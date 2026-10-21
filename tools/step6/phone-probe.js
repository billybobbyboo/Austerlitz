#!/usr/bin/env node
/* Roadmap step 6 Part A (docs/STEP6_SPEC.md section 4): the build on phone-sized screens, measured as it is (--layout current) and with a
   prototype layout injected by this probe (--layout <id> from tools/step6/phone-layouts.js: CSS and JS put into the live page after it
   started; never in the source). Chromium with touch, the device's pixel ratio and a phone's user agent (so the build takes its lowTier path
   as on a phone; Safari itself is not here: the harness is Chromium only, docs/FINAL_AUDIT.md section 5).
   Each device on fresh pages, the states reached by real taps where a control exists (page.tap: touch events; each state checked after its
   tap, and reached by the app's own function only if the tap did not take, which the state's note then says), else through the app's own
   functions (named in each state's note):
     first     the first screen, untouched (04:00, the first-run card open)
     explore   after a tap on "Explore on my own" (the card closed where it stands), the clock at 09:30
     panels    then a tap on Panels: the rail and its Now tab
     dossier   Saint-Hilaire's division selected (select(), as a tap on its counter does), its dossier open
     watch     a tap on Watch, 09:30
     layers    the Layers panel opened by a tap
     paper     the paper map, by a tap on its button in the Layers panel, then the panel closed
     tour      the guided tour's first stop, by a tap on Guided tour
   Per state: the unobstructed fraction and the timeline's height (tools/visual/measure.js, the harness's own measures); every text element
   cut (its content wider or taller than its box where the overflow is hidden, or its box partly outside the screen; text wholly off the screen
   is counted apart); every visible control that takes a press, its box against WCAG 2.5.8 (24 x 24 px, or its spacing exception; the event
   markers counted apart, decision 167's essential exception) and against 44 x 44 px (Apple's and WCAG 2.5.5's AAA size); controls whose
   centre another element covers (a tap there reaches the other); the panels that overlap one another; the features with no reachable control
   (none of nine points of any of its controls on the screen and on top);
   the map text's contrast as rendered (measure.js textContrast on a CSS-scale screenshot: the map layer's labels only); every visible text's
   contrast by check:contrast's own method (its COLLECT and judging, read from tools/visual/contrast.js), and the 10.5 px floor.
   node tools/step6/phone-probe.js [--layout current|<id>] [--only 390x844,...] [--states first,explore] [--json out.json] [--shots dir]
     [--contrast-only] (every measure but the screenshot and the map text's, which it skips)
   Measurement only; nothing is written to a source file. Never run it beside check:visual. */
const fs=require("fs"), path=require("path");
const { chromium } = require("playwright");
const TR=require("../visual/three-route.js");
const L5=require("../stage5/lib.js");
const ROOT=path.join(__dirname,"..","..");
const MEASURE=fs.readFileSync(path.join(ROOT,"tools","visual","measure.js"),"utf8");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const LAYOUT=opt("--layout")||"current", OUT=opt("--json"), SHOTS=opt("--shots"), LIGHT=argv.includes("--contrast-only");
const LAYOUTS=require("./phone-layouts.js");
/* the interface text's contrast, by check:contrast's own method, read from tools/visual/contrast.js itself (not copied): its COLLECT (each visible
   text's computed colour, size and weight, with the stack of translucent ancestor backgrounds and opacities) and its judging (composited over the
   two backdrops of the theme, map text also over black and white; 4.5:1, or 3:1 from 18 px or 14 px bold) */
const CX_SRC=fs.readFileSync(path.join(ROOT,"tools","visual","contrast.js"),"utf8");
const COLLECT=new Function("return `"+/const COLLECT=`([\s\S]*?)`;/.exec(CX_SRC)[1]+"`")();
const CXJ=new Function(["hx","lin","L","over","ratio","BACK"].map(n=>{ const m=new RegExp("^(?:function "+n+"\\(.*|const "+n+"=.*)$","m").exec(CX_SRC); if(!m) throw new Error("contrast.js: "+n+" not found"); return m[0]; }).join("\n")+
  "\nreturn {over:over,ratio:ratio,BACK:BACK};")();
function judgeText(rows,paper){
  const out={texts:rows.length,belowAA:[],small:0};
  rows.forEach(r=>{ let worst=99;
    CXJ.BACK[paper?"paper":"dark"].concat(r.map?[[0,0,0],[255,255,255]]:[]).forEach(bd=>{ let bg=bd; for(let i=r.bgs.length-1;i>=0;i--) bg=CXJ.over(r.bgs[i].slice(0,3),r.bgs[i][3],bg);
      const fg=CXJ.over(r.color.slice(0,3),r.color[3]*r.opacity,bg), c=CXJ.ratio(fg,bg); if(c<worst) worst=c; });
    if(r.size<10.5) out.small++;
    const need=(r.size>=18||(r.size>=14&&+r.weight>=600))?3:4.5;
    if(worst<need) out.belowAA.push(worst.toFixed(2)+"<"+need+" "+r.size+"px "+r.sel+' "'+r.text+'"'); });
  return out;
}
const IOS="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const AND="Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36";
/* the five sizes of the brief, each with a common phone's density (CSS px; the density is the device's, the user agent its system's) */
const DEVICES=[
  {key:"360x800", vp:[360,800], dpr:3, ua:AND, note:"a 360 px Android phone (Galaxy S20-S24 class)"},
  {key:"390x844", vp:[390,844], dpr:3, ua:IOS, note:"iPhone 12-15 (the full CSS viewport; Safari's bars take part of it)"},
  {key:"412x915", vp:[412,915], dpr:2.625, ua:AND, note:"Pixel 7 class"},
  {key:"430x932", vp:[430,932], dpr:3, ua:IOS, note:"iPhone 14-15 Plus and Pro Max"},
  {key:"844x390", vp:[844,390], dpr:3, ua:IOS, note:"iPhone 12-15 held landscape"}
].filter(d=>!opt("--only")||opt("--only").split(",").includes(d.key));
const STATES=(opt("--states")||"first,explore,panels,dossier,watch,layers,paper,tour").split(",");

const INPAGE=function(){
  var A={};
  function vis(e){ if(!e||!e.isConnected) return false; var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||+cs.opacity<0.02) return false;
    for(var p=e;p;p=p.parentElement){ var c=getComputedStyle(p); if(c.display==="none"||c.visibility==="hidden"||p.hidden) return false; }
    var r=e.getBoundingClientRect(); return r.width>0&&r.height>0; }
  function desc(e){ if(!e||e===document.body) return "body"; return e.tagName.toLowerCase()+(e.id?"#"+e.id:"")+(e.className&&typeof e.className==="string"?"."+e.className.trim().split(/\s+/).slice(0,2).join("."):""); }
  function nameOf(e){ var a=e.getAttribute("aria-label"); if(a&&a.trim()) return a.trim(); var t=(e.textContent||"").replace(/\s+/g," ").trim(); return t||e.getAttribute("title")||""; }
  var SEL="button,a[href],input,select,textarea,[role=button],[role=tab],[role=slider],[tabindex]:not([tabindex='-1'])";
  var MAPSEL="#maplayer";
  A.targets=function(){
    /* a press's target only: an element that takes no pointer event (the act bands, decision 166 (a)) is a keyboard control, not a target */
    var R=Array.prototype.slice.call(document.querySelectorAll(SEL)).filter(function(e){ return vis(e)&&!e.disabled&&!(e.closest&&e.closest(MAPSEL))&&!e.closest("[inert]")&&getComputedStyle(e).pointerEvents!=="none"; })
      .map(function(e){ var b=e.getBoundingClientRect(), r={left:b.left,top:b.top,right:b.right,bottom:b.bottom,width:b.width,height:b.height};
        /* the press area a positioned ::before adds (the phases' reach up over the act row, style.css .step::before, decision 166 (a)) */
        var pb=getComputedStyle(e,"::before"); if(pb.content&&pb.content!=="none"&&pb.position==="absolute"){ var t=parseFloat(pb.top), h=parseFloat(pb.height);
          if(t<0&&h>0){ r.top=Math.min(r.top,b.top+t); r.height=r.bottom-r.top; } }
        return {e:e,r:r,cx:(r.left+r.right)/2,cy:(r.top+r.bottom)/2}; });
    return R.map(function(o,i){
      var small=o.r.width<24-1e-6||o.r.height<24-1e-6, ok=!small;
      if(small){ ok=true; for(var j=0;j<R.length;j++){ if(j===i) continue; var q=R[j];
        var nx=Math.max(q.r.left,Math.min(o.cx,q.r.right)), ny=Math.max(q.r.top,Math.min(o.cy,q.r.bottom));
        if(Math.hypot(nx-o.cx,ny-o.cy)<12){ ok=false; break; } if((q.r.width<24||q.r.height<24)&&Math.hypot(q.cx-o.cx,q.cy-o.cy)<24){ ok=false; break; } } }
      var cx=Math.max(0,Math.min(innerWidth-1,o.cx)), cy=Math.max(0,Math.min(innerHeight-1,o.cy)), top=document.elementFromPoint(cx,cy);
      var covered=!!(top&&top!==o.e&&!o.e.contains(top)&&!(top.closest&&top.closest("label")&&top.closest("label").contains(o.e)));
      var outside=o.r.right>innerWidth+0.5||o.r.bottom>innerHeight+0.5||o.r.left<-0.5||o.r.top<-0.5;
      var offscreen=o.r.right<=0||o.r.bottom<=0||o.r.left>=innerWidth||o.r.top>=innerHeight;
      return {el:desc(o.e),name:nameOf(o.e).slice(0,40),evmark:!!(o.e.closest&&o.e.closest("#evmarks")),w:+o.r.width.toFixed(1),h:+o.r.height.toFixed(1),x:Math.round(o.r.left),y:Math.round(o.r.top),
        under24:small,spacingOk:ok,under44:o.r.width<44||o.r.height<44,covered:covered?desc(top):null,outside:outside,offscreen:offscreen}; }); };
  /* cut text: an element holding its own text whose content overflows a box that clips it, or whose box runs off the screen */
  A.cut=function(){
    var out=[];
    document.querySelectorAll("body *").forEach(function(e){
      if(e.closest(MAPSEL)||e.closest(".sr-only")||!vis(e)) return;
      var own=Array.prototype.some.call(e.childNodes,function(n){ return n.nodeType===3&&n.textContent.trim().length>0; }); if(!own) return;
      var cs=getComputedStyle(e), r=e.getBoundingClientRect(), why=null;
      var clipX=cs.overflowX!=="visible"||cs.textOverflow==="ellipsis", clipY=cs.overflowY!=="visible"||(cs.webkitLineClamp&&cs.webkitLineClamp!=="none");
      if(clipX&&e.scrollWidth>e.clientWidth+1) why=cs.textOverflow==="ellipsis"?"ellipsis":"clipped across";
      else if(clipY&&e.scrollHeight>e.clientHeight+1&&cs.overflowY!=="auto"&&cs.overflowY!=="scroll") why="clipped down";
      if(!why){ for(var p=e.parentElement;p&&p!==document.body;p=p.parentElement){ var pc=getComputedStyle(p); if(pc.overflow==="hidden"||pc.overflowX==="hidden"){
        var pr=p.getBoundingClientRect(); if(r.right>pr.right+1||r.left<pr.left-1){ why="cut by "+desc(p); } break; } } }
      if(!why&&(r.right<=0||r.left>=innerWidth||r.bottom<=0||r.top>=innerHeight)) why="wholly off the screen";
      else if(!why&&(r.right>innerWidth+0.5||r.left<-0.5||r.bottom>innerHeight+0.5||r.top<-0.5)) why="partly off the screen";
      if(why) out.push({el:desc(e),why:why,text:(e.textContent||"").replace(/\s+/g," ").trim().slice(0,60),w:Math.round(r.width)}); });
    return out; };
  /* text under the project's 10.5 px floor (CLAUDE.md, check:contrast), the map layer's included */
  A.small=function(){ var out=[]; document.querySelectorAll("body *").forEach(function(e){ if(e.closest(".sr-only")||!vis(e)) return;
      if(!Array.prototype.some.call(e.childNodes,function(n){ return n.nodeType===3&&n.textContent.trim().length>0; })) return;
      var px=parseFloat(getComputedStyle(e).fontSize); if(px<10.5-1e-6) out.push(desc(e)+" "+px+"px"); }); return out; };
  var PANELS={rail:".rail",timebar:".timebar",card:"#firstrun",dispatch:".dispatch",tools:".tools",viewmode:"#viewmode",drawer:".drawer",
    layers:"#layerpop",tourbar:"#tourbar",selchip:"#selchip",legend:".legend",eyecap:"#eyecap",help:"#help"};
  A.panels=function(){ var o={}; Object.keys(PANELS).forEach(function(k){ var e=document.querySelector(PANELS[k]); if(!e||!vis(e)||e.getAttribute("aria-hidden")==="true") return;
      if(k==="rail"&&document.body.classList.contains("rail-hidden")) return; if(k==="drawer"&&!e.classList.contains("on")) return;
      var r=e.getBoundingClientRect(); if(r.right<=0||r.left>=innerWidth||r.bottom<=0||r.top>=innerHeight) return; o[k]=[r.left,r.top,r.right,r.bottom].map(Math.round); }); return o; };
  A.overlaps=function(){ var P=A.panels(), K=Object.keys(P), out=[];
    for(var i=0;i<K.length;i++) for(var j=i+1;j<K.length;j++){ var a=P[K[i]], b=P[K[j]], w=Math.min(a[2],b[2])-Math.max(a[0],b[0]), h=Math.min(a[3],b[3])-Math.max(a[1],b[1]);
      if(w>1&&h>1){ var inA=document.querySelector(PANELS[K[i]]).contains(document.querySelector(PANELS[K[j]]))||document.querySelector(PANELS[K[j]]).contains(document.querySelector(PANELS[K[i]]));
        if(!inA) out.push({a:K[i],b:K[j],w:Math.round(w),h:Math.round(h)}); } }
    return out; };
  /* the features a visitor needs, each by the controls that do it; reachable: one of them visible, on the screen, not covered */
  var FEAT={play:["#play"], clock:["#timerail"], phases:["#phases .step"], presentation:[".vm-btn"], layers:["#layersbtn"], paperMap:[".mode-btn[data-m=staff]","#layersbtn"],
    panels:["#panelsbtn","#tab-now"], follow:["#follow"], vantages:[".van-btn"], help:["#helpbtn"], sources:["#srcbtn"], tour:["#tourbtn","#fr-tour"], events:["#evmarks button, #evmarks [role=button]"],
    eyes:["#eyesbtn"], speeds:[".spd-btn"]};
  A.reach=function(){ var o={}; Object.keys(FEAT).forEach(function(k){ var best=null;
      FEAT[k].forEach(function(s){ document.querySelectorAll(s).forEach(function(e){ if(best==="ok") return; if(!vis(e)||e.closest("[inert]")){ best=best||"hidden"; return; }
        /* reachable where any of nine points of its box (its centre, the inner corners and the edges' middles, 20% in) is on the screen and
           finds it on top */
        var r=e.getBoundingClientRect(), on=0, top=null;
        [[.5,.5],[.2,.2],[.8,.2],[.2,.8],[.8,.8],[.5,.2],[.5,.8],[.2,.5],[.8,.5]].forEach(function(q){ var x=r.left+q[0]*r.width, y=r.top+q[1]*r.height;
          if(x<0||y<0||x>=innerWidth||y>=innerHeight) return; on++; var t=document.elementFromPoint(x,y); if(t&&(t===e||e.contains(t))) best="ok"; else if(!top) top=t; });
        if(best==="ok") return; best=on?"covered by "+desc(top):"off the screen"; }); });
      o[k]=best||"absent"; }); return o; };
  window.__ph=A; return true;
};
async function open(browser,d){
  const ctx=await browser.newContext({viewport:{width:d.vp[0],height:d.vp[1]},deviceScaleFactor:d.dpr,isMobile:true,hasTouch:true,userAgent:d.ua});
  const page=await ctx.newPage();
  page._errors=[]; page.on("pageerror",e=>page._errors.push(e.message));
  page._console=[]; page.on("console",m=>{ if(m.type()==="warning"||m.type()==="error") page._console.push(m.type()+": "+m.text().slice(0,160)); });
  await TR.routeThree(page);
  const t0=Date.now();
  await page.goto("file://"+path.join(ROOT,"austerlitz-command-map.html")+"?harness=1",{waitUntil:"commit",timeout:180000});
  await TR.waitBoot(page,240000,500);
  page._loadMs=Date.now()-t0;
  await page.evaluate(MEASURE);
  await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  await L5.inject(page,L5.HELPERS);
  await L5.inject(page,INPAGE);
  page._ctx=ctx;
  return page;
}
async function settle(page){ await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(60)); await page.waitForTimeout(450); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); }
/* a tap on a control; under the menu prototype a tool hidden behind the Menu button is reached through it, as a visitor would */
async function tapIf(page,sel){ let h=await page.$(sel);
  if(h&&!(await h.isVisible())){ const m=await page.$("#ph-menu"); if(m&&await m.isVisible()){ await m.tap(); await page.waitForTimeout(700); h=await page.$(sel); } }
  if(!h||!(await h.isVisible())) return false;
  /* Playwright taps once the element has stood still for two animation frames: here a frame can take seconds, so the wait is long, and a tap
     that still fails is recorded, not swallowed (a first version gave it 5 s and lost taps silently) */
  try{ await h.tap({timeout:90000}); }catch(e){ (page._tapErrors=page._tapErrors||[]).push(sel+": "+e.message.split("\n")[0]); return false; }
  await page.waitForTimeout(700); return true; }
/* a tap that must reach a state: the tap, then the state checked; once more if it did not take (under software WebGL at density 3 a frame
   holds the main thread for seconds); then the app's own function, the way used recorded */
async function reach(page,sel,ok,fallback,label){
  for(let i=0;i<2;i++){ const t=await tapIf(page,sel); if(t&&await page.evaluate(ok)) return "tap: "+label+(i?" (the second tap)":""); }
  if(await page.evaluate(ok)) return "tap: "+label;
  await page.evaluate(fallback); await page.waitForTimeout(700);
  return label+": "+(await page.evaluate(ok)?"the tap did not take; reached by the app's own function":"NOT REACHED");
}
/* each state from a fresh page, so that one state's taps never carry into the next */
const REACH={
  first: async p=>"untouched",
  explore: async p=>{ const h=await reach(p,"#fr-close",()=>!firstRunOpen,()=>closeFirst(null),"Explore on my own");
    await p.evaluate(()=>{ setClock(570,{instant:true,force:true}); }); return h+"; setClock(09:30)"; },
  panels: async p=>"explore, then "+(await REACH.explore(p),await reach(p,"#panelsbtn",()=>!document.body.classList.contains("rail-hidden"),()=>document.getElementById("panelsbtn").click(),"Panels")),
  dossier: async p=>{ await REACH.explore(p); await p.evaluate(()=>{ select("f","sthilaire"); }); await p.waitForTimeout(700); return "explore, then select('f','sthilaire') (a tap on its counter)"; },
  watch: async p=>"explore, then "+(await REACH.explore(p),await reach(p,".vm-btn[data-vm=watch]",()=>presentation==="watch",()=>setPresentation("watch"),"Watch")),
  layers: async p=>"explore, then "+(await REACH.explore(p),await reach(p,"#layersbtn",()=>!document.getElementById("layerpop").hidden,()=>document.getElementById("layersbtn").click(),"Layers")),
  paper: async p=>{ await REACH.layers(p); const h=await reach(p,".mode-btn[data-m=staff]",()=>mode==="staff",()=>setMode("staff"),"Paper map");
    await tapIf(p,"#layerclose"); return "layers, then "+h+", then tap: close"; },
  tour: async p=>"explore, then "+(await REACH.explore(p),await reach(p,"#tourbtn",()=>tourStep>=0,()=>startTour(),"Guided tour"))
};
(async()=>{
  const lay=LAYOUT==="current"?null:LAYOUTS[LAYOUT]; if(LAYOUT!=="current"&&!lay) throw new Error("no layout "+LAYOUT);
  const browser=await chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
  if(SHOTS) fs.mkdirSync(SHOTS,{recursive:true});
  const res={layout:LAYOUT, note:lay?lay.note:"the build as it is", devices:{}};
  for(const d of DEVICES){
    const D=res.devices[d.key]={note:d.note,dpr:d.dpr,states:{}};
    for(const st of STATES){
      const page=await open(browser,d);
      if(lay) await lay.apply(page);
      await settle(page);
      let how; try{ how=await REACH[st](page); }catch(e){ how="FAILED: "+e.message.split("\n")[0]; }
      await settle(page);
      const m=await page.evaluate(()=>{ const x=window.__aus.metrics(); return {unobstructed:x.unobstructed, timeline:x.timeline&&x.timeline.height, layer:x.layer&&{placed:x.layer.placed,dropped:x.layer.dropped}}; });
      const T=await page.evaluate(()=>window.__ph.targets()), cut=await page.evaluate(()=>window.__ph.cut());
      const ov=await page.evaluate(()=>window.__ph.overlaps()), reach=await page.evaluate(()=>window.__ph.reach()), panels=await page.evaluate(()=>window.__ph.panels());
      /* --contrast-only: the interface text's contrast and the floor only (no screenshot, no map-text measure) */
      const css=LIGHT?null:await page.screenshot({timeout:180000,scale:"css"}), b64=css?css.toString("base64"):null;
      const tc=LIGHT?{texts:null,belowAA:[],min:null}:await page.evaluate(b=>window.__aus.textContrast(b),b64), small=await page.evaluate(()=>window.__ph.small());
      if(SHOTS&&css) fs.writeFileSync(path.join(SHOTS,LAYOUT+"-"+d.key+"-"+st+".png"),css);
      const ui=judgeText(await page.evaluate(COLLECT+"("+JSON.stringify(st)+")"), await page.evaluate(()=>mode==="staff"));
      const S={how, uiContrast:{texts:ui.texts, belowAA:ui.belowAA.length, belowAAList:ui.belowAA.slice(0,12), below10_5px:ui.small}, unobstructed:m.unobstructed, timeline:m.timeline, layer:m.layer, panels, overlaps:ov,
        targets:T.length, fail2_5_8:T.filter(t=>t.under24&&!t.spacingOk&&!t.evmark).map(t=>t.el+" "+t.w+"x"+t.h+" '"+t.name+"'"),
        evmarksUnder24:T.filter(t=>t.evmark&&t.under24&&!t.spacingOk).length,
        under44:T.filter(t=>t.under44).length, under44List:T.filter(t=>t.under44).map(t=>t.el+" "+t.w+"x"+t.h),
        covered:T.filter(t=>t.covered).map(t=>t.el+" '"+t.name+"' under "+t.covered), outside:T.filter(t=>t.outside).map(t=>t.el+" '"+t.name+"'"+(t.offscreen?" (wholly off)":"")),
        cut:cut.filter(c=>c.why!=="wholly off the screen"), offScreenText:cut.filter(c=>c.why==="wholly off the screen").length, unreachable:Object.keys(reach).filter(k=>reach[k]!=="ok").map(k=>k+": "+reach[k]),
        contrast:{texts:tc.texts, belowAA:tc.belowAA.length, belowAAList:tc.belowAA.slice(0,8), min:tc.min, belowFloor:small.length, belowFloorList:small.slice(0,8)},
        console:page._console.slice(), errors:page._errors.slice(), tapErrors:(page._tapErrors||[]).slice()};
      D.states[st]=S;
      console.log(LAYOUT,d.key,st.padEnd(8),"unobstr",S.unobstructed,"tl",S.timeline,"cut",S.cut.length,"2.5.8 fail",S.fail2_5_8.length,"(+"+S.evmarksUnder24+" event markers)","<44",S.under44+"/"+S.targets,
        "covered",S.covered.length,"outside",S.outside.length,"overlaps",ov.map(o=>o.a+"/"+o.b).join(",")||"-","unreachable",S.unreachable.length,"map text AA fail",S.contrast.belowAA,"interface text",S.uiContrast.texts,"below AA",S.uiContrast.belowAA,"under 10.5 px",S.uiContrast.below10_5px,"|",how);
      await page._ctx.close();
    }
  }
  await browser.close();
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
