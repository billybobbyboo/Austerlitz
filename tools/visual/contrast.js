#!/usr/bin/env node
/* Stage 1 text-contrast check (docs/VISUAL_SPEC.md §6).
   node tools/visual/contrast.js <build.html> [--json out.json]     exit 1 if any visible text fails WCAG AA
   Drives the built page through the interface states where text appears (first run, Study, the formation,
   event, place and terrain dossiers, analysis, command, plans, layers, sources, tour, and the paper map with
   its dossier, tour and layers), reads every visible text element's computed colour, size and weight with the
   stack of translucent ancestor backgrounds and opacities, and composites it over two map backdrops taken from
   the Stage 0 screenshots: landscape #0C1116 and #A6AEB3, paper map #F1EDE1 and #D4D5C9. Text below 18 px (14 px
   bold) needs 4.5:1, larger text 3:1. CSS transitions are disabled so nothing is read mid-transition.
   Stage 2D: counters and all map text are DOM (the map layer, #maplayer), so they are read here like any page text. Map text
   sits on plates meant to meet AA over any ground: it is composited over black and white as well as the two backdrops
   (decision 38). Six states were added for what the contextual legend and the layer show only then: the terrain study,
   the going classes, a plan and the halt (legend-layers), true scale (legend-1x), the legend closed, and the hybrid view
   with a corps highlighted (dimmed counters; in Study, since Watch draws the view-mode control at 24% until it is hovered,
   a Stage 1 matter recorded in CHANGELOG.md); each state is drawn once before it is read (the layer lays out in a frame). */
const fs=require("fs"), path=require("path");
const { chromium } = require("playwright");
const argv=process.argv.slice(2), html=path.resolve(argv[0]||"austerlitz-command-map.html");
const jsonOut=argv.indexOf("--json")>=0?argv[argv.indexOf("--json")+1]:null;
const THREE_LOCAL=[process.env.AUSTERLITZ_THREE, path.join(__dirname,"three.min.js"),
  path.resolve("node_modules/three/build/three.min.js")].find(p=>p&&fs.existsSync(p));

const COLLECT=`(function(state){
  function rgba(s){ var m=/rgba?\\(([^)]+)\\)/.exec(s); if(!m) return null; var p=m[1].split(",").map(parseFloat); return [p[0],p[1],p[2],p.length>3?p[3]:1]; }
  var out=[], all=document.querySelectorAll("body *");
  for(var i=0;i<all.length;i++){
    var e=all[i], own="";
    for(var k=0;k<e.childNodes.length;k++){ var n=e.childNodes[k]; if(n.nodeType===3) own+=n.textContent; }
    own=own.replace(/\\s+/g," ").trim(); if(!own) continue;
    var r=e.getBoundingClientRect(); if(r.width<1||r.height<1) continue;
    var cs=getComputedStyle(e); if(cs.visibility==="hidden"||cs.display==="none") continue;
    var hid=false, op=1, bgs=[];
    for(var a=e;a&&a!==document.documentElement;a=a.parentElement){
      var ac=getComputedStyle(a); if(ac.display==="none"||a.hidden){ hid=true; break; }
      op*=parseFloat(ac.opacity);
      var b=rgba(ac.backgroundColor); if(b&&b[3]>0) bgs.push(b.concat([a.id||(typeof a.className==="string"?a.className:"")||a.tagName]));
    }
    if(hid||op<0.02) continue;
    var sel=e.id?"#"+e.id:(e.tagName.toLowerCase()+(typeof e.className==="string"&&e.className?"."+e.className.trim().split(/\\s+/).join("."):""));
    out.push({state:state, sel:sel, text:own.slice(0,40), color:rgba(cs.color), size:parseFloat(cs.fontSize), weight:cs.fontWeight, opacity:op, bgs:bgs,
      map:!!(e.closest&&e.closest("#maplayer"))});
  }
  return out;
})`;
const STATES=[
  ["study", ()=>{ closeFirst&&closeFirst(); setPresentation("study"); setMode("terrain"); setClock(570,{force:true}); updateVisibility(); }],
  ["formation", ()=>{ select("f","sthilaire"); paintDrawer(); }],
  ["formation-expanded", ()=>{ dossierExpanded=true; paintDrawer(); }],
  ["event", ()=>{ select("e",EVENTS[3].id); paintDrawer(); }],
  ["feature", ()=>{ select("t","pratzen"); paintDrawer(); }],
  ["terrain-line", ()=>{ select("a",TERRAIN_LINES[0].n); paintDrawer(); }],
  ["tab-analysis", ()=>{ select(null,null); var b=document.querySelector('.tab-btn[data-t="analysis"]'); if(b) b.click(); setChapter(ANALYSIS[2].id); }],
  ["tab-command", ()=>{ setChapter(null); var b=document.querySelector('.tab-btn[data-t="command"]'); if(b) b.click(); setCommandView("al"); }],
  ["plans", ()=>{ setCommandView("none"); var b=document.querySelector('.tab-btn[data-t="plans"]'); if(b) b.click(); setPlan("both"); updateVisibility(); }],
  ["layers", ()=>{ setPlan(planSide); var b=document.getElementById("layersbtn"); if(b) b.click(); }],
  ["sources", ()=>{ var x=document.getElementById("layerclose"); if(x) x.click(); openSources(); }],
  ["tour", ()=>{ var m=document.getElementById("modal-close"); if(m) m.click(); startTour(); tourGo(1); }],
  ["staff", ()=>{ exitTour(); setMode("staff"); setPresentation("study"); select("f","sthilaire"); paintDrawer(); updateVisibility(); }],
  ["staff-tour", ()=>{ select(null,null); startTour(); tourGo(1); }],
  ["staff-layers", ()=>{ exitTour(); var b=document.getElementById("layersbtn"); if(b) b.click(); }],
  /* Stage 2D */
  ["legend-layers", ()=>{ var x=document.getElementById("layerclose"); if(x) x.click(); setMode("terrain"); setPresentation("study"); select(null,null);
    setClock(460,{force:true}); setPlan("al"); document.getElementById("going").click(); document.querySelector('.layer-btn[data-l="analysis"]').click(); updateVisibility(); }],
  ["legend-1x", ()=>{ setPlan(planSide); document.getElementById("going").click(); document.querySelector('.layer-btn[data-l="analysis"]').click();
    setDisplayFactor(1); setClock(300,{force:true}); updateVisibility(); }],
  ["legend-closed", ()=>{ setDisplayFactor(DISPLAY.defaultFactor); setClock(570,{force:true}); document.getElementById("lg-toggle").click(); updateVisibility(); }],
  ["hybrid-dimmed", ()=>{ document.getElementById("lg-toggle").click(); setMode("hybrid"); setPresentation("study"); setClock(600,{force:true}); select("f","c_iv");
    AUSTERLITZ_DEBUG.placeCamera([-66,76,101,0,19,26]); updateVisibility(); }]
];
function hx(h){ h=h.replace("#",""); return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)); }
function lin(v){ v/=255; return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4); }
function L(c){ return 0.2126*lin(c[0])+0.7152*lin(c[1])+0.0722*lin(c[2]); }
function over(t,a,b){ return [0,1,2].map(i=>t[i]*a+b[i]*(1-a)); }
function ratio(a,b){ const la=L(a), lb=L(b); return (Math.max(la,lb)+0.05)/(Math.min(la,lb)+0.05); }
const BACK={dark:[hx("#0C1116"),hx("#A6AEB3")], paper:[hx("#F1EDE1"),hx("#D4D5C9")]};

(async()=>{
  const browser=await chromium.launch({args:["--use-gl=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
  const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
  if(THREE_LOCAL) await page.route(/three(\.min)?\.js$/,r=>r.fulfill({path:THREE_LOCAL,contentType:"application/javascript"}));
  await page.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000});
  await page.waitForFunction(()=>!document.getElementById("boot")&&typeof window.camera!=="undefined",null,{timeout:240000,polling:500});
  await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  const rows=[...await page.evaluate(COLLECT+'("first-run")')];
  for(const [name,fn] of STATES){ await page.evaluate(fn);
    await page.evaluate(()=>{ if(window.AUSTERLITZ_DEBUG) AUSTERLITZ_DEBUG.settle(3); });   /* a drawn frame: the map layer lays out in it */
    await page.waitForTimeout(300); rows.push(...await page.evaluate(COLLECT+"("+JSON.stringify(name)+")")); }
  await browser.close();
  const pairs=new Map(); let small=0;
  rows.forEach(r=>{
    const paper=r.state.startsWith("staff"); let worst=99, wbg=null;
    BACK[paper?"paper":"dark"].concat(r.map?[[0,0,0],[255,255,255]]:[]).forEach(bd=>{
      let bg=bd; for(let i=r.bgs.length-1;i>=0;i--) bg=over(r.bgs[i].slice(0,3),r.bgs[i][3],bg);
      const fg=over(r.color.slice(0,3),r.color[3]*r.opacity,bg), c=ratio(fg,bg);
      if(c<worst){ worst=c; wbg=bg; }
    });
    if(r.size<10.5) small++;
    const need=(r.size>=18||(r.size>=14&&+r.weight>=600))?3:4.5;
    const key=[paper?"paper":"dark",r.color.join(","),r.opacity.toFixed(2),wbg.map(Math.round).join(","),r.size].join("|");
    const p=pairs.get(key); if(!p||worst<p.ratio) pairs.set(key,{ratio:worst,need:need,theme:paper?"paper":"dark",size:r.size,sel:r.sel,text:r.text,state:r.state});
  });
  const all=[...pairs.values()], fails=all.filter(p=>p.ratio<p.need).sort((a,b)=>a.ratio-b.ratio);
  console.log("text elements "+rows.length+", distinct text/background pairs "+all.length+", below AA "+fails.length+", text below 10.5 px "+small);
  fails.slice(0,40).forEach(p=>console.log("  ! "+p.ratio.toFixed(2)+" < "+p.need+"  "+p.theme+" "+p.size+"px "+p.sel+" ["+p.state+'] "'+p.text+'"'));
  if(jsonOut) fs.writeFileSync(jsonOut,JSON.stringify(all,null,1));
  console.log(fails.length||small?"CONTRAST: FAILED":"CONTRAST: all text meets WCAG AA");
  process.exitCode=(fails.length||small)?1:0;
})();
