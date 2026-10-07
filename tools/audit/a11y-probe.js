#!/usr/bin/env node
/* Final audit (docs/FINAL_AUDIT.md, dimension 6): the first screen at five sizes, and keyboard-only use, measured in the built page.
   node tools/audit/a11y-probe.js [--json out.json] [--sheet out.jpg] [--only 1600x900,390x844] [--visitor]
   Each size on a fresh page opened as the harness opens it (tools/stage7/lib.js: headless Chromium, software WebGL, ?harness=1; with
   --visitor without it), untouched, then:
   - the panels' boxes, anything outside the viewport, horizontal scroll, the timeline's height, the unobstructed fraction (measure.js);
   - every visible interactive element: its box, its accessible name (aria-labelledby, aria-label, text, title, in that order), whether
     it is under 24 x 24 px and, if so, whether WCAG 2.2's spacing exception (2.5.8: a 24 px circle on its centre meets no other target
     or circle) saves it; duplicate ids; focusable elements inside aria-hidden or inert; the live regions;
   - the Tab order from the card (real key presses): each stop's name, whether it is visible, whether a focus indicator is drawn
     (outline or box-shadow), and whether its centre is covered by another element (2.4.11, focus not obscured);
   - then Esc (the card closed where it stands) and the Tab order of the whole page, up to 120 stops, with the same measures; the visible
     interactive elements never reached by Tab (reachable only by arrows inside a roving group, or not at all);
   - console warnings and errors, page errors, the load time.
   Measurement only: nothing is written to a source file. Never run it beside `npm run check:visual`. */
const fs=require("fs"), path=require("path");
const L=require("../stage7/lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), SHEET=opt("--sheet"), ONLY=opt("--only"), VISITOR=argv.includes("--visitor");
const SIZES=[[1600,900],[1366,768],[1280,720],[1024,768],[390,844]].filter(s=>!ONLY||ONLY.split(",").includes(s[0]+"x"+s[1]));

/* in the page */
const INPAGE=function(){
  var A={};
  function vis(e){ if(!e||!e.isConnected) return false; var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||+cs.opacity<0.02) return false;
    for(var p=e;p;p=p.parentElement){ var c=getComputedStyle(p); if(c.display==="none"||c.visibility==="hidden") return false; if(p.hidden) return false; }
    var r=e.getBoundingClientRect(); return r.width>0&&r.height>0; }
  function nameOf(e){ var lb=e.getAttribute("aria-labelledby");
    if(lb){ var t=lb.split(/\s+/).map(function(id){ var x=document.getElementById(id); return x?x.textContent.trim():""; }).join(" ").trim(); if(t) return t; }
    var a=e.getAttribute("aria-label"); if(a&&a.trim()) return a.trim();
    if(e.tagName==="INPUT"&&e.id){ var l=document.querySelector("label[for='"+e.id+"']"); if(l&&l.textContent.trim()) return l.textContent.trim(); }
    if(e.closest&&e.closest("label")&&e.tagName==="INPUT") return e.closest("label").textContent.trim();
    var tx=(e.textContent||"").replace(/\s+/g," ").trim(); if(tx) return tx;
    var ti=e.getAttribute("title"); if(ti) return ti.trim()+" (title only)";
    return ""; }
  function desc(e){ if(!e||e===document.body) return "body"; return e.tagName.toLowerCase()+(e.id?"#"+e.id:"")+(e.className&&typeof e.className==="string"?"."+e.className.trim().split(/\s+/).slice(0,2).join("."):""); }
  var SEL="button,a[href],input,select,textarea,[role=button],[role=tab],[role=slider],[role=link],[role=checkbox],[role=menuitem],[role=switch],[tabindex]";
  A.targets=function(){
    var all=Array.prototype.slice.call(document.querySelectorAll(SEL)).filter(function(e){ return vis(e)&&e.getAttribute("tabindex")!=="-1"||vis(e)&&/^(button|a|input|select)$/i.test(e.tagName); });
    all=all.filter(function(e){ return !e.disabled; });
    var R=all.map(function(e){ var r=e.getBoundingClientRect(); return {e:e,r:r,cx:(r.left+r.right)/2,cy:(r.top+r.bottom)/2}; });
    var out=[];
    R.forEach(function(o,i){
      var small=o.r.width<24-1e-6||o.r.height<24-1e-6, saved=null;
      if(small){ /* 2.5.8 spacing: a 24 px circle on its centre must not meet another target or another undersized target's circle */
        saved=true;
        for(var j=0;j<R.length;j++){ if(j===i) continue; var q=R[j];
          var nx=Math.max(q.r.left,Math.min(o.cx,q.r.right)), ny=Math.max(q.r.top,Math.min(o.cy,q.r.bottom));
          if(Math.hypot(nx-o.cx,ny-o.cy)<12) { saved=false; break; }
          var qs=q.r.width<24||q.r.height<24; if(qs&&Math.hypot(q.cx-o.cx,q.cy-o.cy)<24){ saved=false; break; } } }
      out.push({el:desc(o.e),uid:uid(o.e),name:nameOf(o.e),w:+o.r.width.toFixed(1),h:+o.r.height.toFixed(1),x:Math.round(o.r.left),y:Math.round(o.r.top),
        small:small,spacingOk:saved,role:o.e.getAttribute("role")||o.e.tagName.toLowerCase(),tabindex:o.e.getAttribute("tabindex"),
        outside:o.r.right>innerWidth+0.5||o.r.bottom>innerHeight+0.5||o.r.left<-0.5||o.r.top<-0.5});
    });
    return out; };
  A.structure=function(){
    var ids={}, dup=[]; document.querySelectorAll("[id]").forEach(function(e){ if(ids[e.id]) dup.push(e.id); ids[e.id]=1; });
    var hiddenFocusable=[]; document.querySelectorAll("[aria-hidden=true],[inert]").forEach(function(h){
      h.querySelectorAll(SEL).forEach(function(e){ if(vis(e)&&e.getAttribute("tabindex")!=="-1"&&!e.disabled) hiddenFocusable.push(desc(h)+" > "+desc(e)); }); });
    var live=Array.prototype.slice.call(document.querySelectorAll("[aria-live],[role=status],[role=alert],[role=log]")).map(function(e){
      return {el:desc(e),live:e.getAttribute("aria-live"),role:e.getAttribute("role"),atomic:e.getAttribute("aria-atomic"),text:(e.textContent||"").trim().slice(0,80)}; });
    var dialogs=Array.prototype.slice.call(document.querySelectorAll("[role=dialog],[role=alertdialog],dialog")).map(function(e){
      return {el:desc(e),modal:e.getAttribute("aria-modal"),label:e.getAttribute("aria-labelledby")||e.getAttribute("aria-label"),desc:e.getAttribute("aria-describedby"),visible:vis(e)}; });
    var landmarks=Array.prototype.slice.call(document.querySelectorAll("main,nav,header,footer,aside,[role=main],[role=navigation],[role=region],[role=complementary],[role=banner],[role=contentinfo],section[aria-label],section[aria-labelledby]")).map(function(e){ return {el:desc(e),role:e.getAttribute("role")||e.tagName.toLowerCase(),name:nameOf(e).slice(0,50),visible:vis(e)}; });
    var headings=Array.prototype.slice.call(document.querySelectorAll("h1,h2,h3,h4,[role=heading]")).filter(vis).map(function(e){ return e.tagName+" "+(e.textContent||"").trim().slice(0,50); });
    var canvas=document.querySelector("#stage canvas")||document.querySelector("canvas");
    var lang=document.documentElement.getAttribute("lang");
    var imgsNoAlt=Array.prototype.slice.call(document.querySelectorAll("img:not([alt])")).filter(vis).map(desc);
    var svgsNamed=Array.prototype.slice.call(document.querySelectorAll("svg")).filter(vis).map(function(s){ return {role:s.getAttribute("role"),label:s.getAttribute("aria-label")||"",hidden:s.getAttribute("aria-hidden")}; });
    var svgNoName=svgsNamed.filter(function(s){ return s.hidden!=="true"&&!s.label&&s.role!=="presentation"&&s.role!=="none"; }).length;
    return {duplicateIds:dup,hiddenFocusable:hiddenFocusable,live:live,dialogs:dialogs,landmarks:landmarks,headings:headings,lang:lang,
      title:document.title,canvas:canvas?{role:canvas.getAttribute("role"),label:canvas.getAttribute("aria-label"),tabindex:canvas.getAttribute("tabindex")}:null,
      imgsNoAlt:imgsNoAlt,svgVisible:svgsNamed.length,svgVisibleUnnamed:svgNoName,hScroll:document.documentElement.scrollWidth>innerWidth+1,vScroll:document.documentElement.scrollHeight>innerHeight+1}; };
  A.panels=function(){ var S={rail:".rail",timebar:".timebar",card:"#firstrun",legend:".legend",tools:".tools",dispatch:".dispatch",viewmode:"#viewmode",tourbar:"#tourbar",drawer:".drawer",chip:"#selchip"}, o={};
    Object.keys(S).forEach(function(k){ var e=document.querySelector(S[k]); if(!e||!vis(e)){ o[k]=null; return; } var r=e.getBoundingClientRect();
      o[k]={x:Math.round(r.left),y:Math.round(r.top),w:Math.round(r.width),h:Math.round(r.height),outside:r.right>innerWidth+0.5||r.bottom>innerHeight+0.5||r.left<-0.5||r.top<-0.5}; });
    return o; };
  var _ids=new WeakMap(), _n=0; function uid(e){ if(!_ids.has(e)) _ids.set(e,++_n); return _ids.get(e); }
  var PANELS=[".rail",".drawer",".timebar","#firstrun",".legend",".tools","#viewmode",".dispatch","#tourbar","#layerpop","#help","#modal","#selchip"];
  A.focus=function(){ var e=document.activeElement; if(!e||e===document.body) return {el:"body",uid:0};
    var r=e.getBoundingClientRect(), cs=getComputedStyle(e), cx=(r.left+r.right)/2, cy=(r.top+r.bottom)/2;
    /* obscured: the topmost element at its centre belongs to an interface panel that does not contain it (2.4.11); the map's own
       canvas under a click-through map item does not count */
    var top=document.elementFromPoint(Math.max(0,Math.min(innerWidth-1,cx)),Math.max(0,Math.min(innerHeight-1,cy))), pan=null;
    if(top&&top!==e&&!e.contains(top)) for(var i=0;i<PANELS.length;i++){ var P=top.closest&&top.closest(PANELS[i]); if(P&&!P.contains(e)){ pan=P; break; } }
    var obscured=!!pan;
    var ind=(cs.outlineStyle!=="none"&&parseFloat(cs.outlineWidth)>0)||(cs.boxShadow&&cs.boxShadow!=="none");
    return {el:desc(e),name:nameOf(e).slice(0,60),visible:vis(e),inView:r.right>0&&r.bottom>0&&r.left<innerWidth&&r.top<innerHeight,indicator:ind,
      outline:cs.outlineStyle+" "+cs.outlineWidth+" "+cs.outlineColor,shadow:cs.boxShadow==="none"?"":cs.boxShadow.slice(0,40),obscuredBy:obscured?desc(pan)+" ("+desc(top)+")":null,uid:uid(e)}; };
  window.__a11y=A; return true;
};

(async()=>{
  const browser=await L.launch(), res={build:require("crypto").createHash("md5").update(fs.readFileSync(path.join(L.ROOT,"austerlitz-command-map.html"))).digest("hex"),visitor:VISITOR,sizes:{}}, tiles=[];
  for(const vp of SIZES){
    const key=vp[0]+"x"+vp[1]; process.stdout.write(key+" ... ");
    const page=await L.open(browser,vp,{harness:VISITOR?false:undefined,transitions:false});
    const logs=[]; page.on("console",m=>{ if(m.type()==="warning"||m.type()==="error") logs.push(m.type()+": "+m.text().slice(0,200)); });
    await L.inject(page,INPAGE); await L.settle(page);
    const r={loadMs:page._loadMs};
    r.metrics=await page.evaluate(()=>{ const m=window.__aus.metrics(); return {unobstructed:m.unobstructed,timeline:m.timeline,layer:m.layer&&{placed:m.layer.placed,dropped:m.layer.dropped,minPx:m.layer.minPx}}; });
    r.panels=await page.evaluate(()=>window.__a11y.panels());
    r.structure=await page.evaluate(()=>window.__a11y.structure());
    r.targets=await page.evaluate(()=>window.__a11y.targets());
    r.targetsSmall=r.targets.filter(t=>t.small); r.targetsFailing=r.targets.filter(t=>t.small&&!t.spacingOk); r.targetsUnnamed=r.targets.filter(t=>!t.name);
    r.targetsOutside=r.targets.filter(t=>t.outside);
    const png1=await page.screenshot({timeout:180000}); tiles.push({png:png1,cap:key+" first screen"});
    r.focusAtLoad=await page.evaluate(()=>window.__a11y.focus());
    /* the card's Tab cycle */
    r.cardTabs=[]; for(let i=0;i<4;i++){ await page.keyboard.press("Tab"); r.cardTabs.push(await page.evaluate(()=>window.__a11y.focus())); }
    await page.keyboard.press("Escape"); await L.settle(page);
    r.afterEsc={focus:await page.evaluate(()=>window.__a11y.focus()),open:await page.evaluate(()=>firstRunOpen),panels:await page.evaluate(()=>window.__a11y.panels())};
    const png2=await page.screenshot({timeout:180000}); tiles.push({png:png2,cap:key+" after Esc"});
    r.targetsAfter=await page.evaluate(()=>window.__a11y.targets());
    /* the page's Tab order, from Play (where Esc leaves focus) */
    const order=[], start=(await page.evaluate(()=>window.__a11y.focus())).uid;
    for(let i=0;i<160;i++){ await page.keyboard.press("Tab"); const f=await page.evaluate(()=>window.__a11y.focus()); if(f.uid===start) break; order.push(f); }
    r.tabCycleClosed=order.length<160;
    r.tabOrder=order;
    r.tabNoIndicator=order.filter(f=>f.el!=="body"&&!f.indicator).map(f=>f.el);
    r.tabHidden=order.filter(f=>f.el!=="body"&&(!f.visible||!f.inView)).map(f=>f.el);
    r.tabObscured=order.filter(f=>f.obscuredBy).map(f=>f.el+" under "+f.obscuredBy);
    const reached=new Set(order.map(f=>f.uid).concat([r.afterEsc.focus.uid]));
    r.neverTabbed=r.targetsAfter.filter(t=>!reached.has(t.uid)).map(t=>t.el+(t.tabindex!==null?" [tabindex="+t.tabindex+"]":"")+" '"+t.name.slice(0,30)+"'");
    r.console=logs; r.pageErrors=page._errors.slice();
    res.sizes[key]=r;
    console.log("load",r.loadMs,"ms; unobstructed",r.metrics.unobstructed,"; targets",r.targets.length,"small",r.targetsSmall.length,"failing 2.5.8",r.targetsFailing.length,
      "; unnamed",r.targetsUnnamed.length,"; tab stops",order.length,"no indicator",r.tabNoIndicator.length,"hidden",r.tabHidden.length,"obscured",r.tabObscured.length,
      "; never tabbed",r.neverTabbed.length,"; console",logs.length,"errors",r.pageErrors.length);
    await page.close();
  }
  if(SHEET&&tiles.length){ const p=await L.open(browser,[1600,900]); fs.writeFileSync(SHEET,await L.sheet(p,tiles,2,800,450,"Final audit: the first screen and after Esc ("+res.build.slice(0,8)+")",true)); await p.close(); }
  await browser.close();
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
