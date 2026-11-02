#!/usr/bin/env node
/* Final audit after Stage 8, area visual-maps: a reproducible capture matrix of the map's cartographic presentation.
   node tools/audit-post8/visual-maps/capture.js <set> [only,...]
   Each set runs on ONE page (the harness's page, ?harness=1: no drift or smoke motion, CSS transitions off, the first-run card closed by a real Esc),
   applies each shot's case spec through window.__aus.apply (tools/visual/measure.js -> AUSTERLITZ_DEBUG.applyCase), runs the shot's extra steps
   (listed in its JSON: real clicks where marked "real", else the app's own DOM handlers), settles (AUSTERLITZ_DEBUG.settle as the harness does),
   then saves <shot>.jpg (q80) and <shot>.json (the spec, the steps, __aus.state, the map layer's counts and drawn items, the map text's contrast
   as rendered by the harness's own measure on a PNG of the same frame, the far names' plates, the caption's visible parts) and a contact sheet.
   Measurement only: nothing is written to a source file; nothing in the app is changed beyond the state a visitor can reach. */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("../lib.js");
const AREA="visual-maps";
const OUTD=path.join(A.EVID,AREA);
const FIELD=[-195,92,156,-33,4,-2], OVER=[-27,272,41,-27,0,9];
const LOW={map:[285,289], dir:[-1.0,0.13,0.18], r:70};
const FAR_LOW={t:720, presentation:"watch", mode:"terrain", aim:{map:[230,250], dir:[-0.97,0.10,0.21], r:60}};   /* thresholds.js FAR_LOW (horizon-east) */
const S=(o)=>o;
const SETS={
  d1600:{vp:[1600,900], shots:[
    {n:"paper-entered", spec:{t:570, presentation:"study", mode:"staff", paper:"frame", cam:OVER}},
    {n:"paper-entered-key", spec:{t:570, presentation:"study", mode:"staff", paper:"frame", cam:OVER}, steps:["legendOpen"]},
    {n:"paper-sokolnitz", spec:{t:500, presentation:"study", mode:"staff", aim:{map:[210,362], dir:[-0.62,0.46,0.64], r:58}}},
    {n:"paper-pratzen", spec:{t:570, presentation:"study", mode:"staff", aim:{map:[285,289], dir:[-0.62,0.46,0.64], r:58}}},
    {n:"paper-santon", spec:{t:660, presentation:"study", mode:"staff", aim:{map:[228,88], dir:[-0.62,0.46,0.64], r:58}}},
    {n:"counters-field", spec:{t:570, presentation:"study", mode:"hybrid", cam:FIELD}},
    {n:"counters-field-key", spec:{t:570, presentation:"study", mode:"hybrid", cam:FIELD}, steps:["legendOpen"]},
    {n:"counters-overview", spec:{t:570, presentation:"study", mode:"hybrid", cam:OVER}},
    {n:"land-field", spec:{t:570, presentation:"study", mode:"terrain", cam:FIELD}},
    {n:"land-field-key", spec:{t:570, presentation:"study", mode:"terrain", cam:FIELD}, steps:["legendOpen"]},
    {n:"plans-overview", spec:{t:570, presentation:"study", mode:"terrain", plan:"both", cam:OVER}},
    {n:"plans-tab", spec:{t:570, presentation:"study", mode:"terrain", plan:"both", cam:OVER}, steps:["tabPlans"]},
    {n:"watch-0900", spec:{t:540, presentation:"watch", mode:"terrain", cam:OVER}},
    {n:"watch-1200", spec:{t:720, presentation:"watch", mode:"terrain", cam:OVER}},
    {n:"watch-1420", spec:{t:860, presentation:"watch", mode:"terrain", cam:OVER}},
    {n:"watch-1440", spec:{t:880, presentation:"watch", mode:"terrain", cam:OVER}},
    {n:"pratzen-low", spec:{t:590, presentation:"watch", mode:"terrain", aim:LOW}},
    {n:"wall-0900", spec:Object.assign({},FAR_LOW,{t:540})},
    {n:"wall-1200", spec:FAR_LOW},
    {n:"wall-1200-counters", spec:Object.assign({},FAR_LOW,{mode:"hybrid"})},
    {n:"selected-sthilaire", spec:{t:570, presentation:"study", mode:"terrain", select:["f","sthilaire"], aim:{map:"sthilaire", dir:[-0.55,0.62,0.56], r:86}}},
    {n:"selected-sthilaire-paper", spec:{t:570, presentation:"study", mode:"staff", select:["f","sthilaire"], aim:{map:"sthilaire", dir:[-0.55,0.62,0.56], r:86}}},
    {n:"selected-soult-counters", spec:{t:570, presentation:"study", mode:"hybrid", select:["f","c_iv"], cam:FIELD}},
    {n:"layers-skel-routes-overview", spec:{t:570, presentation:"study", mode:"terrain", cam:OVER}, steps:["layer:skeleton","layer:routes","legendOpen"]},
    {n:"layers-skel-routes-selected", spec:{t:570, presentation:"study", mode:"terrain", select:["f","sthilaire"], aim:{map:"sthilaire", dir:[-0.55,0.62,0.56], r:86}}, steps:["layer:skeleton","layer:routes"]},
    {n:"layers-skel-routes-paper", spec:{t:570, presentation:"study", mode:"staff", paper:"frame", cam:OVER}, steps:["layer:skeleton","layer:routes"]},
    {n:"layers-confidence-field", spec:{t:570, presentation:"study", mode:"terrain", cam:FIELD}, steps:["layer:confidence","legendOpen"]},
    {n:"eyes-fr-overview", spec:{t:510, presentation:"study", mode:"terrain", eyes:"fr", cam:OVER}, steps:["legendOpen"]},
    {n:"eyes-al-overview", spec:{t:570, presentation:"study", mode:"terrain", eyes:"al", cam:OVER}},
    {n:"eyes-al-counters", spec:{t:570, presentation:"study", mode:"hybrid", eyes:"al", cam:FIELD}},
    {n:"eyes-fr-paper", spec:{t:510, presentation:"study", mode:"staff", eyes:"fr", paper:"frame", cam:OVER}},
    {n:"eye-zuran", spec:{t:510, presentation:"watch", mode:"terrain", eyes:"fr", eye:true, cam:FIELD}},
    {n:"clean-field", spec:{t:570, presentation:"map", mode:"terrain", cam:FIELD}},
    {n:"eye-zuran-noarrows", spec:{t:510, presentation:"watch", mode:"terrain", eyes:"fr", eye:true, cam:FIELD}, steps:["layerOff:arrows"]},
    {n:"wall-0900-arrows-on", spec:Object.assign({},FAR_LOW,{t:540}), steps:["layer:arrows"]}
  ]},
  d1280:{vp:[1280,720], shots:[
    {n:"paper-entered", spec:{t:570, presentation:"study", mode:"staff", paper:"frame", cam:OVER}},
    {n:"counters-overview", spec:{t:570, presentation:"study", mode:"hybrid", cam:OVER}},
    {n:"land-field", spec:{t:570, presentation:"study", mode:"terrain", cam:FIELD}},
    {n:"plans-overview", spec:{t:570, presentation:"study", mode:"terrain", plan:"both", cam:OVER}},
    {n:"watch-1200", spec:{t:720, presentation:"watch", mode:"terrain", cam:OVER}},
    {n:"watch-1420", spec:{t:860, presentation:"watch", mode:"terrain", cam:OVER}},
    {n:"selected-sthilaire", spec:{t:570, presentation:"study", mode:"terrain", select:["f","sthilaire"], aim:{map:"sthilaire", dir:[-0.55,0.62,0.56], r:86}}},
    {n:"wall-1200", spec:FAR_LOW}
  ]},
  d1024:{vp:[1024,768], shots:[
    {n:"land-field", spec:{t:570, presentation:"study", mode:"terrain", cam:FIELD}},
    {n:"paper-entered", spec:{t:570, presentation:"study", mode:"staff", paper:"frame", cam:OVER}},
    {n:"watch-1200", spec:{t:720, presentation:"watch", mode:"terrain", cam:OVER}},
    {n:"selected-sthilaire", spec:{t:570, presentation:"study", mode:"terrain", select:["f","sthilaire"], aim:{map:"sthilaire", dir:[-0.55,0.62,0.56], r:86}}},
    {n:"counters-overview", spec:{t:570, presentation:"study", mode:"hybrid", cam:OVER}}
  ]}
};
/* in-page readers */
const READ=function(){
  var out={};
  try{ mlLayout(); var s=ML.stats; out.layer={items:s.items,placed:s.placed,dropped:s.dropped,droppedIds:s.dropped_.slice(),occluded:s.occluded,offscreen:s.offscreen,underPanel:s.underPanel,keepMissing:s.keepMissing.slice()}; }catch(e){ out.layerErr=String(e); }
  try{ var D=[]; for(var k in ML.items){ var it=ML.items[k]; if(it.eFrame!==ML.frame) continue; var r=it.el?it.el.getBoundingClientRect():null;
      D.push({id:k,cat:it.cat,state:it.state,text:it.el?(it.el.textContent||"").replace(/\s+/g," ").trim().slice(0,48):"",box:r&&it.state==="on"?[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]:null,
        plate:it.el&&it.el.style?it.el.style.background||"":"", keep:!!it.keep}); }
    out.items=D; }catch(e){ out.itemsErr=String(e); }
  var cap=document.getElementById("tb-cap");
  if(cap){ out.caption={title:cap.title, visible:[].map.call(cap.children,function(k){ var cs=getComputedStyle(k); return {cls:k.className,text:(k.textContent||"").trim(),shown:cs.display!=="none",cut:k.scrollWidth>k.clientWidth+1}; }),
      box:(function(){ var r=cap.getBoundingClientRect(); return [Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]; })()}; }
  var lg=document.getElementById("lg-toggle"); out.legend={expanded:lg?lg.getAttribute("aria-expanded"):null,
    rows:[].filter.call(document.querySelectorAll("#lg-rows .k"),function(k){ return getComputedStyle(k).display!=="none"&&k.getBoundingClientRect().height>0; }).map(function(k){ return (k.textContent||"").trim().slice(0,90); })};
  var sb=document.getElementById("sb-label"); out.scaleBar=sb?sb.textContent:null;
  out.body=document.body.className;
  return out;
};
async function step(page,s){
  if(s==="legendOpen"){ const ex=await page.evaluate(()=>{ const b=document.getElementById("lg-toggle"); return b&&getComputedStyle(b).display!=="none"?b.getAttribute("aria-expanded"):"none"; });
    if(ex==="false"){ await page.click("#lg-toggle",{timeout:180000,force:true}); return "real click #lg-toggle (was closed)"; } return "legend already "+ex; }
  if(s==="tabPlans"){ await page.evaluate(()=>selectTab("plans")); return "selectTab('plans') (the app's own tab function)"; }
  if(s.startsWith("layerOff:")){ const l=s.slice(9); const r=await page.evaluate(l=>{ const b=document.querySelector('.layer-btn[data-l="'+l+'"]'); if(!b) return "no button"; if(b.getAttribute("aria-pressed")==="true") b.click(); return b.getAttribute("aria-pressed"); },l);
    return "DOM click .layer-btn[data-l="+l+"] (the app's own handler) -> pressed "+r; }
  if(s.startsWith("layer:")){ const l=s.slice(6); const r=await page.evaluate(l=>{ const b=document.querySelector('.layer-btn[data-l="'+l+'"]'); if(!b) return "no button"; if(b.getAttribute("aria-pressed")!=="true") b.click(); return b.getAttribute("aria-pressed"); },l);
    return "DOM click .layer-btn[data-l="+l+"] (the app's own handler) -> pressed "+r; }
  return "unknown step "+s;
}
(async()=>{
  const set=process.argv[2], only=(process.argv[3]||"").split(",").filter(Boolean), SET=SETS[set]; if(!SET) throw new Error("no set "+set);
  const dir=path.join(OUTD,set); fs.mkdirSync(dir,{recursive:true});
  const b=await A.launch(); const t0=Date.now();
  const page=await A.open(b,SET.vp);
  await page.keyboard.press("Escape"); await A.frames(page,3);
  const fr=await page.evaluate(()=>firstRunOpen);
  console.log(set,"page open",((Date.now()-t0)/1000).toFixed(0),"s; first-run open after Esc:",fr);
  const tiles=[];
  const list=only.length?only.map(n=>{ const x=SET.shots.find(q=>q.n===n); if(!x) throw new Error("no shot "+n); return x; }):SET.shots;   /* the order given */
  for(const sh of list){ try{
    const t1=Date.now(); const spec=Object.assign({viewport:SET.vp},JSON.parse(JSON.stringify(sh.spec)));
    await page.evaluate(s=>window.__aus.apply(s),spec);
    const done=[]; for(const s of (sh.steps||[])) done.push(await step(page,s));
    await A.settle(page);
    const tS=Date.now();
    const png=await page.screenshot({timeout:900000});
    const pngF=path.join(A.SCRATCH,AREA,"last.png"); fs.mkdirSync(path.dirname(pngF),{recursive:true}); fs.writeFileSync(pngF,png);
    require("child_process").execFileSync("ffmpeg",["-y","-loglevel","error","-i",pngF,"-q:v","4",path.join(dir,sh.n+".jpg")]);
    const jpg=fs.readFileSync(path.join(dir,sh.n+".jpg"));
    const tM=Date.now();
    const st=await page.evaluate(s=>window.__aus.state(s),spec);
    const rd=await page.evaluate(READ);
    const b64=png.toString("base64");
    const tc=await page.evaluate(x=>window.__aus.textContrast(x),b64).catch(e=>({err:String(e)}));
    let far=null; if(spec.mode!=="staff") far=await page.evaluate(x=>window.__aus.farNames(x),b64).catch(e=>({err:String(e)}));
    const rec={shot:sh.n, set, viewport:SET.vp, build:"austerlitz-command-map.html md5 f10fe585c46aea576f436ed51ac46f83", page:"harness page (?harness=1), first-run card closed by a real Esc",
      spec, steps:done, state:st, layer:rd.layer, caption:rd.caption, legend:rd.legend, scaleBar:rd.scaleBar, bodyClass:rd.body,
      textContrast:tc&&{texts:tc.texts,min:tc.min,belowAA:tc.belowAA,err:tc.err}, farNames:far, items:rd.items, ms:Date.now()-t1, msSettle:tS-t1, msShot:tM-tS, msMeasure:Date.now()-tM,
      jpeg:"ffmpeg -q:v 4 from the PNG screenshot of the same frame"};
    fs.writeFileSync(path.join(dir,sh.n+".json"),JSON.stringify(rec,null,1));
    tiles.push({png:jpg,cap:sh.n+"  "+(st.clock!=null?String(Math.floor(st.clock/60)).padStart(2,"0")+":"+String(st.clock%60).padStart(2,"0"):"")+" "+st.presentation+"/"+st.mode+"  drop "+(rd.layer?rd.layer.dropped:"?")+"  AA-min "+(tc&&tc.min)});
    console.log(set,sh.n,"done in",((Date.now()-t1)/1000).toFixed(1),"s (settle",((tS-t1)/1000).toFixed(1),"shot",((tM-tS)/1000).toFixed(1),"measure",((Date.now()-tM)/1000).toFixed(1),"); dropped",rd.layer&&rd.layer.dropped,"text min",tc&&tc.min,"belowAA",tc&&tc.belowAA&&tc.belowAA.length);
  }catch(e){ console.log(set,sh.n,"SHOT FAILED",String(e.message).slice(0,200)); } }
  if(tiles.length>1&&!only.length){ const tw=SET.vp[0]>=1280?640:512, th=Math.round(tw*SET.vp[1]/SET.vp[0]);
    for(let i=0;i<tiles.length;i+=12){ await A.sheet(page,tiles.slice(i,i+12),3,tw,th,set+" ("+SET.vp.join("x")+"), sheet "+(i/12+1),path.join(dir,"sheet-"+(i/12+1)+".jpg")); } }
  fs.writeFileSync(path.join(dir,only.length?"errors-"+only.join("+")+".json":"errors.json"),JSON.stringify(A.errors(page),null,1));
  await b.close();
  console.log(set,"all done in",((Date.now()-t0)/1000).toFixed(0),"s");
})().catch(e=>{ console.error("FAILED",e); process.exit(1); });
