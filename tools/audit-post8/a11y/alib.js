/* Final audit after Stage 8, area "a11y" (accessibility, first use, visitor-facing content): shared helpers.
   Measurement code only: nothing here changes the application, its data, its thresholds, its tests or its build.
   - openV(browser,[w,h],o): a VISITOR's page (no ?harness=1: the first-run card shows, the drift moves; CSS transitions kept) in a context of its
     own, so that the device scale factor, forced colours, reduced motion and a phone can be set: o.dsf (default 1), o.forced (forced-colors:
     active), o.rm (prefers-reduced-motion: reduce), o.phone (density 3, touch, isMobile, an iPhone's user agent: tools/audit-post8/lib.js).
   - INPAGE (window.__a11y): read-only probes run in the page: fi() the focused element (desc, role, name by CDP elsewhere, box, visibility,
     opacity, indicator), targets() WCAG 2.5.8 with the spacing exception, small() text under 12 px, cut() clipped or ellipsized text, scroll()
     horizontal and vertical overflow, panels() the panels' boxes and their overlaps, text(sel) the visible text of a region.
   - ax(page): the focused element's computed role and name (CDP Accessibility.getPartialAXTree), and axTree(page) the full tree, compacted.
   - run(tag,fn): launch the pinned Chromium 141 (ANGLE on SwiftShader: software WebGL; no time here is a device's), run, and save
     docs/audit-post8-evidence/a11y/<tag>.json however it ends; shots as JPEG at CSS pixels (scale "css").
   Real input everywhere a visitor acts (page.mouse, page.keyboard, page.touchscreen, CDP Input.dispatchTouchEvent); app globals are read to
   observe, and to aim a click at an item's box; any set-up done by script is said so in the step's text. */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("../lib.js");
const TR=require("../../visual/three-route.js");
const ROOT=A.ROOT;
const EV=path.join(ROOT,"docs","audit-post8-evidence","a11y");
fs.mkdirSync(EV,{recursive:true});
const MEASURE=fs.readFileSync(path.join(ROOT,"tools","visual","measure.js"),"utf8");

const INPAGE=`window.__a11y=(function(){
  function desc(e){ if(!e) return null; if(e===document.body) return "body"; if(e===document.documentElement) return "html";
    var c=(e.className&&typeof e.className==="string")?"."+e.className.trim().split(/\\s+/).slice(0,2).join("."):"";
    return e.tagName.toLowerCase()+(e.id?"#"+e.id:"")+c; }
  function txt(e,n){ return String((e&&(e.innerText||e.textContent))||"").replace(/\\s+/g," ").trim().slice(0,n||80); }
  function vis(e){ if(!e||!e.isConnected) return false; if(e.checkVisibility&&!e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true})) return false;
    var r=e.getBoundingClientRect(); return r.width>0&&r.height>0; }
  function opac(e){ var o=1; for(var x=e;x&&x.nodeType===1;x=x.parentElement){ o*=parseFloat(getComputedStyle(x).opacity)||0; } return +o.toFixed(3); }
  function box(r){ return [Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]; }
  function onScr(r){ return r.right>0&&r.bottom>0&&r.left<innerWidth&&r.top<innerHeight; }
  function fullOn(r){ return r.left>=-0.5&&r.top>=-0.5&&r.right<=innerWidth+0.5&&r.bottom<=innerHeight+0.5; }
  var PANELS=[".rail",".drawer",".timebar",".tools","#viewmode",".legend","#tourbar","#firstrun","#selchip","#layerpop",".dispatch","#menubtn","#help .sheet","#modal .sheet","#restore","#toast","#eyecap","#vsbadge"];
  function panelEls(){ var o=[]; PANELS.forEach(function(s){ document.querySelectorAll(s).forEach(function(e){ if(vis(e)) o.push({sel:s,e:e,r:e.getBoundingClientRect()}); }); }); return o; }
  function inter(a,b){ var w=Math.min(a.right,b.right)-Math.max(a.left,b.left), h=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top); return (w>0&&h>0)?w*h:0; }
  /* what covers an element: by hit test where it takes the pointer, else (the map layer: pointer-events none) the panels drawn over it */
  function covered(e){
    var r=e.getBoundingClientRect(), pe=getComputedStyle(e).pointerEvents;
    if(pe!=="none"){ var pts=[[.5,.5],[.15,.5],[.85,.5]], tot=0, hit=0, by=[];
      pts.forEach(function(p){ var x=r.left+r.width*p[0], y=r.top+r.height*p[1]; if(x<0||y<0||x>=innerWidth||y>=innerHeight) return; tot++;
        var t=document.elementFromPoint(x,y); if(t&&(t===e||e.contains(t)||t.contains(e))) hit++; else by.push(desc(t)); });
      return {how:"hit",tot:tot,hit:hit,by:by.slice(0,2)}; }
    var a=r.width*r.height||1, worst=0, wsel=null;
    panelEls().forEach(function(p){ if(p.e.contains(e)) return; var f=inter(r,p.r)/a; if(f>worst){ worst=f; wsel=p.sel; } });
    return {how:"panels",frac:+worst.toFixed(2),by:wsel};
  }
  function inertAnc(e){ for(var x=e;x;x=x.parentElement){ if(x.inert) return desc(x); } return null; }
  function ariaHiddenAnc(e){ for(var x=e;x&&x.nodeType===1;x=x.parentElement){ if(x.getAttribute("aria-hidden")==="true") return desc(x); } return null; }
  function fi(){
    var e=document.activeElement; if(!e||e===document.body||e===document.documentElement) return {el:desc(e),body:true};
    var r=e.getBoundingClientRect(), cs=getComputedStyle(e);
    return {el:desc(e), text:txt(e,70), aria:e.getAttribute("aria-label"), role:e.getAttribute("role"), box:box(r), vis:vis(e), opacity:opac(e),
      onScreen:onScr(r), fullOn:fullOn(r), fv:e.matches(":focus-visible"),
      ring:{os:cs.outlineStyle, ow:cs.outlineWidth, oc:cs.outlineColor, oo:cs.outlineOffset, bs:cs.boxShadow==="none"?"none":cs.boxShadow.slice(0,60)},
      covered:(vis(e)&&onScr(r))?covered(e):null, inert:inertAnc(e), ariaHidden:ariaHiddenAnc(e), inMap:!!e.closest("#maplayer"), tabindex:e.getAttribute("tabindex")};
  }
  /* WCAG 2.5.8: every visible target on screen; a target under 24 x 24 passes by spacing when the 24 px circle on its centre meets no other
     target's box and no other undersized target's circle (the understanding document's test); the map layer's items listed apart (a map) */
  var TSEL="button,a[href],input,select,textarea,summary,[role=button],[role=tab],[role=slider],[role=link],[role=checkbox],[role=menuitem],[role=switch],[tabindex]:not([tabindex='-1'])";
  function targets(){
    var all=[].slice.call(document.querySelectorAll(TSEL)).filter(function(e){ if(!vis(e)) return false; var r=e.getBoundingClientRect(); if(!onScr(r)) return false;
      if(e.closest("[inert]")) return false; if(getComputedStyle(e).pointerEvents==="none"&&!e.closest("#maplayer")) return false; if(e.id==="maplayer") return false; return true; });
    var T=all.map(function(e){ var r=e.getBoundingClientRect(); return {e:e,r:r,cx:r.left+r.width/2,cy:r.top+r.height/2,small:(r.width<24-0.01||r.height<24-0.01),map:!!e.closest("#maplayer")}; });
    var ui=T.filter(function(t){ return !t.map; }), out=[];
    ui.forEach(function(t){ if(!t.small) return;
      var bad=null;
      ui.forEach(function(u){ if(u===t||bad) return;
        /* the circle against u's box */
        var nx=Math.max(u.r.left,Math.min(t.cx,u.r.right)), ny=Math.max(u.r.top,Math.min(t.cy,u.r.bottom));
        if(Math.hypot(nx-t.cx,ny-t.cy)<12-0.01&&!(u.e.contains(t.e)||t.e.contains(u.e))){ bad="circle meets "+desc(u.e); return; }
        if(u.small&&Math.hypot(u.cx-t.cx,u.cy-t.cy)<24-0.01){ bad="circle meets the circle of "+desc(u.e); } });
      out.push({el:desc(t.e), name:(t.e.getAttribute("aria-label")||txt(t.e,40)), w:+t.r.width.toFixed(1), h:+t.r.height.toFixed(1), spacing:bad?"fails ("+bad+")":"passes"}); });
    return {n:ui.length, small:out.filter(function(x){ return true; }), fail:out.filter(function(x){ return x.spacing!=="passes"; }).length,
      map:{n:T.length-ui.length, small:T.filter(function(t){ return t.map&&t.small; }).length}};
  }
  /* text under 12 px (and under the 10.5 px floor), on screen and drawn */
  function small(){
    var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT), n, by={}, floor=[], tot=0, smallN=0;
    while((n=w.nextNode())){ var s=n.nodeValue.replace(/\\s+/g," ").trim(); if(!s) continue; var e=n.parentElement; if(!e||!vis(e)) continue;
      if(e.closest("script,style,[aria-hidden=true] svg")) continue;
      var rg=document.createRange(); rg.selectNodeContents(n); var rr=rg.getBoundingClientRect(); if(!(rr.width>0&&rr.height>0)||!onScr(rr)) continue;
      if(opac(e)<0.05) continue;
      tot++; var fs=parseFloat(getComputedStyle(e).fontSize);
      if(fs<12-0.01){ smallN++; var k=fs.toFixed(1)+"px "+(e.closest("#maplayer")?"map":(e.closest(".timebar")?"timeline":(e.closest(".rail,.drawer")?"panel":"other")));
        if(!by[k]) by[k]={n:0,ex:[]}; by[k].n++; if(by[k].ex.length<6) by[k].ex.push(desc(e)+": "+s.slice(0,40)); }
      if(fs<10.5-0.01) floor.push(desc(e)+" "+fs+"px: "+s.slice(0,40)); }
    return {texts:tot, under12:smallN, by:by, underFloor:floor.slice(0,20)};
  }
  /* clipped content: an element whose text overflows a hidden or clipped box (or is ellipsized), and visible boxes beyond the viewport */
  function cut(){
    var o=[], off=[];
    document.querySelectorAll("body *").forEach(function(e){
      if(e.closest("svg,canvas,#stage,script,style")||!vis(e)) return; var r=e.getBoundingClientRect(); if(!onScr(r)) return;
      var cs=getComputedStyle(e); var hx=/hidden|clip/.test(cs.overflowX), hy=/hidden|clip/.test(cs.overflowY);
      var t=txt(e,60); if(!t) return;
      if((hx||cs.textOverflow==="ellipsis")&&e.scrollWidth>e.clientWidth+1) o.push({el:desc(e),dir:"x",sw:e.scrollWidth,cw:e.clientWidth,text:t});
      else if(hy&&e.scrollHeight>e.clientHeight+1&&!/auto|scroll/.test(cs.overflowY)) o.push({el:desc(e),dir:"y",sh:e.scrollHeight,ch:e.clientHeight,text:t});
    });
    /* leaf-ish boxes with text sticking out of the viewport */
    document.querySelectorAll("button,p,h1,h2,h3,span,b,i,div,li,small,kbd").forEach(function(e){
      if(e.closest("svg,#stage,#maplayer")||!vis(e)) return; if(e.children.length>3) return; var t=txt(e,50); if(!t) return;
      var r=e.getBoundingClientRect(); if(onScr(r)&&!fullOn(r)) off.push({el:desc(e),box:box(r),text:t}); });
    return {clipped:o.slice(0,60), clippedN:o.length, beyondViewport:off.slice(0,40), beyondN:off.length};
  }
  function scroll(){ var d=document.documentElement, b=document.body;
    return {iw:innerWidth, ih:innerHeight, docSW:d.scrollWidth, docSH:d.scrollHeight, bodySW:b.scrollWidth, bodySH:b.scrollHeight,
      hscroll:d.scrollWidth>innerWidth+1||b.scrollWidth>innerWidth+1, vscroll:d.scrollHeight>innerHeight+1, scrollX:scrollX, scrollY:scrollY,
      vv:window.visualViewport?{scale:+visualViewport.scale.toFixed(3),w:Math.round(visualViewport.width),h:Math.round(visualViewport.height),x:Math.round(visualViewport.offsetLeft),y:Math.round(visualViewport.offsetTop)}:null,
      bodyOverflow:getComputedStyle(b).overflow+"/"+getComputedStyle(d).overflow}; }
  function panels(){ var P=panelEls(), ov=[];
    for(var i=0;i<P.length;i++) for(var j=i+1;j<P.length;j++){ if(P[i].e.contains(P[j].e)||P[j].e.contains(P[i].e)) continue;
      var a=inter(P[i].r,P[j].r); if(a>4) ov.push(P[i].sel+" x "+P[j].sel+": "+Math.round(a)+" px2"); }
    return {boxes:P.map(function(p){ return p.sel+" "+box(p.r).join(","); }), overlaps:ov}; }
  function text(sel,n){ var e=document.querySelector(sel); return e&&vis(e)?txt(e,n||4000):null; }
  function ids(){ var seen={}, dup=[]; document.querySelectorAll("[id]").forEach(function(e){ if(seen[e.id]) dup.push(e.id); seen[e.id]=1; }); return dup; }
  /* information given only in a title attribute (a native tooltip: shown to a mouse that rests, never to the keyboard or to touch) */
  function titles(){ var o=[]; document.querySelectorAll("[title]").forEach(function(e){ var t=e.getAttribute("title"); if(!t) return;
      var nm=(e.getAttribute("aria-label")||txt(e,200)).toLowerCase(); var tl=t.toLowerCase();
      var extra=tl.replace(/\\(key [^)]*\\)|\\(esc\\)|\\(\\?\\)/g,"").trim();
      if(nm&&(extra===nm||nm.indexOf(extra)>=0)) return;
      o.push({el:desc(e), shown:vis(e), name:nm.slice(0,60), title:t.slice(0,200), describedby:e.getAttribute("aria-describedby")}); });
    return o; }
  /* the phase's narrative: is its text (the lede), the situation's readings and the events list drawn on screen, and could the Now tab show it */
  function narr(){ var l=document.getElementById("d-lede"), si=document.getElementById("situation"), ev=document.getElementById("d-events"), dp=document.querySelector(".dispatch"), nt=document.getElementById("tab-now");
    function on(e){ if(!e||!vis(e)) return false; var r=e.getBoundingClientRect(); return onScr(r); }
    return {lede:on(l), ledeText:txt(l,60), situation:on(si), events:on(ev), dispatchDisplay:dp?getComputedStyle(dp).display:null, dispatchIn:dp&&dp.parentElement?desc(dp.parentElement):null,
      nowTab:!!(nt&&!nt.hidden), docked:document.body.classList.contains("docked"), railHidden:document.body.classList.contains("rail-hidden"), caption:txt(document.getElementById("tb-cap"),160)}; }
  return {desc:desc,txt:txt,vis:vis,fi:fi,targets:targets,small:small,cut:cut,scroll:scroll,panels:panels,text:text,ids:ids,titles:titles,covered:covered,narr:narr};
})();`;

const SCRATCH=path.join(A.SCRATCH,"a11y");
fs.mkdirSync(SCRATCH,{recursive:true});

async function openV(browser,vp,o){
  o=o||{};
  const co={viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:o.dsf||1,reducedMotion:o.rm?"reduce":"no-preference"};
  if(o.forced) co.forcedColors="active";
  if(o.phone) Object.assign(co,{deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:A.IOS_UA});
  const ctx=await browser.newContext(co);
  const page=await ctx.newPage();
  page._log=[];
  page.on("console",m=>{ const t=m.type(); if(t==="warning"||t==="error"||t==="assert") page._log.push({type:t,text:m.text().slice(0,300)}); });
  page.on("pageerror",e=>page._log.push({type:"pageerror",text:String(e.message).slice(0,300)}));
  await TR.routeThree(page);
  const t0=Date.now();
  await page.goto("file://"+path.resolve(process.env.AUSTERLITZ_HTML||path.join(ROOT,"austerlitz-command-map.html"))+(o.harness?"?harness=1":""),{waitUntil:"commit",timeout:180000});
  await TR.waitBoot(page,240000,250);
  page._bootMs=Date.now()-t0;
  await page.evaluate(MEASURE);
  await page.evaluate(INPAGE);
  page._cdp=await ctx.newCDPSession(page);
  try{ await page._cdp.send("Accessibility.enable"); }catch(e){}
  return page;
}
const P=(page,fn,arg)=>page.evaluate(fn,arg);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
/* the focused element's computed role and name, as the browser exposes them */
async function ax(page,expr){
  const c=page._cdp;
  try{
    const r=await c.send("Runtime.evaluate",{expression:expr||"document.activeElement"});
    if(!r.result||!r.result.objectId) return null;
    const d=await c.send("DOM.describeNode",{objectId:r.result.objectId});
    const t=await c.send("Accessibility.getPartialAXTree",{backendNodeId:d.node.backendNodeId,fetchRelatives:false});
    const n=(t.nodes||[])[0]; if(!n) return null;
    const props={}; (n.properties||[]).forEach(p=>{ props[p.name]=p.value&&p.value.value; });
    return {role:n.role&&n.role.value, name:n.name&&n.name.value, desc:n.description&&n.description.value, ignored:n.ignored, props};
  }catch(e){ return {err:String(e.message).slice(0,120)}; }
}
/* the whole accessibility tree, compacted: unignored nodes with a role, their name, a few properties and the depth */
async function axTree(page){
  const c=page._cdp, t=await c.send("Accessibility.getFullAXTree",{});
  const byId={}; t.nodes.forEach(n=>byId[n.nodeId]=n);
  const out=[];
  const root=t.nodes[0];
  (function walk(n,d){
    if(!n) return;
    const role=n.role&&n.role.value, keep=!n.ignored&&role&&!/^(none|generic|InlineTextBox|LineBreak|StaticText)$/.test(role);
    if(keep){ const props={}; (n.properties||[]).forEach(p=>{ if(/^(focusable|focused|modal|live|expanded|pressed|selected|level|hidden|disabled|valuetext|haspopup|current)$/.test(p.name)) props[p.name]=p.value&&p.value.value; });
      out.push({d,role,name:(n.name&&n.name.value||"").slice(0,120),props}); }
    (n.childIds||[]).forEach(id=>walk(byId[id],keep?d+1:d));
  })(root,0);
  return out;
}
async function shot(page,file){ const b=await page.screenshot({type:"jpeg",quality:72,scale:"css",timeout:180000}); fs.writeFileSync(file,b); return file; }
async function clip(page,file,box){ const b=await page.screenshot({type:"jpeg",quality:85,scale:"css",clip:box,timeout:180000}); fs.writeFileSync(file,b); return file; }
async function center(page,sel,i){ return page.evaluate(([s,k])=>{ const e=document.querySelectorAll(s)[k||0]; if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width,h:r.height,vis:window.__a11y.vis(e)}; },[sel,i||0]); }
async function click(page,sel,i){ const c=await center(page,sel,i); if(!c) throw new Error("no element "+sel); await page.mouse.click(c.x,c.y); return c; }
async function tap(page,sel,i){ const c=await center(page,sel,i); if(!c) throw new Error("no element "+sel); await page.touchscreen.tap(c.x,c.y); return c; }
/* a placed formation item of the map layer near the free area's middle, not under a panel: [x,y,name,key] (app globals read to aim) */
async function formationTarget(page,prefer){
  return page.evaluate(pref=>{
    const out=[]; for(const k in ML.items){ const it=ML.items[k]; if(!it.pick||it.pick.kind!=="f"||!it.el||it.el.style.display==="none") continue;
      const r=it.el.getBoundingClientRect(); if(!(r.width>0&&r.height>0)) continue; if(parseFloat(getComputedStyle(it.el).opacity)<0.5) continue;
      const cv=window.__a11y.covered(it.el); if(cv&&cv.frac>0.05) continue;
      if(r.left<4||r.top<4||r.right>innerWidth-4||r.bottom>innerHeight-4) continue;
      out.push({x:r.left+r.width/2,y:r.top+r.height/2,id:it.pick.id,name:(FORMATIONS[it.pick.id]||{}).name,key:k,w:r.width,h:r.height}); }
    if(pref){ const f=out.filter(o=>o.id===pref); if(f.length) return f[0]; }
    out.sort((a,b)=>Math.hypot(a.x-innerWidth/2,a.y-innerHeight*0.45)-Math.hypot(b.x-innerWidth/2,b.y-innerHeight*0.45));
    return out[0]||null; },prefer||null);
}
/* run a probe: browser launched, record saved however it ends */
async function run(tag,fn){
  const R={tag,started:new Date().toISOString(),build:process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html",env:"Chromium 141.0.7390.37 headless shell (CI's pin), ANGLE on SwiftShader (software WebGL); desktop emulation, no assistive technology",steps:[],shots:[]};
  const t0=Date.now();
  const log=s=>{ const m="["+((Date.now()-t0)/1000).toFixed(0)+"s] "+s; console.log(m); };
  R.step=(name,o)=>{ const s=Object.assign({step:name,t:+((Date.now()-t0)/1000).toFixed(1)},o||{}); R.steps.push(s); log(name); save(); return s; };
  R.shot=async(page,name)=>{ const f=path.join(EV,tag+"-"+name+".jpg"); try{ await shot(page,f); R.shots.push(path.relative(ROOT,f)); }catch(e){ R.shots.push("FAILED "+name+": "+e.message); } return f; };
  R.clip=async(page,name,box)=>{ const f=path.join(EV,tag+"-"+name+".jpg"); try{ await clip(page,f,box); R.shots.push(path.relative(ROOT,f)); }catch(e){ R.shots.push("FAILED "+name+": "+e.message); } return f; };
  const save=()=>fs.writeFileSync(path.join(EV,tag+".json"),JSON.stringify(R,(k,v)=>k==="step"&&typeof v==="function"?undefined:v,1));
  let b;
  try{ b=await A.launch(); log("browser up"); await fn(b,R,log); R.ok=true; }
  catch(e){ R.error=String(e.stack||e).slice(0,1500); log("ERROR "+e.message); }
  finally{ R.ended=new Date().toISOString(); R.seconds=Math.round((Date.now()-t0)/1000); delete R.step; delete R.shot; delete R.clip; save(); if(b) await b.close().catch(()=>{}); }
  return R;
}
module.exports={A,ROOT,EV,SCRATCH,INPAGE,openV,P,wait,ax,axTree,shot,clip,center,click,tap,formationTarget,run};
