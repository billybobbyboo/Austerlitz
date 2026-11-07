#!/usr/bin/env node
/* The final audits' roadmap, Stage 5, WP-07 (docs/ROADMAP_FINAL_AUDIT.md; CL-MAP-01, -02, -07, -12, CL-TEST-02; owner question 274, applied by
   its recommended default (a): "let event-named formations and a fresh layout's higher-priority items take room from held places during Play,
   add a long-gap measure to the benchmark, and re-baseline MOTION.VIS on the owner's word"): the candidate rules measured before any is
   adopted. Each variant is the build with replacements in its script (each must apply exactly once), written to a temporary copy; on it:
   - the motion block as check:selftest runs it (tools/visual/motion.js runBlock), judged by thresholds.js's own judge (checkLive): the 16's
     ceilings, every driven run's visibility baseline (MOTION.VIS), each run by real input against its twin, the invariants;
   - the long Play runs of the audit's visibility area (tools/audit-post8/visibility/runs.js, long-play.js's set-up step for step: the motion
     driver's clock at 30 frames a second, no draw), and ChatGPT's continuous 3,600 frames from 09:00 (CG-F01): per formation the share of its
     in-view frames drawn (drawn over drawn, hidden by the layout and behind the ground: vis-lib.js itemStats) and its longest hidden by the
     layout, in ms on the driver's clock and in battle minutes; the formations under half; the formations a live event names, while its label is
     drawn (the audit's analyse.js evForms).
   The variants (none is adopted by this tool; each is a sketch of a rule, measured):
   - "none": the build as it is.
   - "event-named": every formation a live event names (EVENTS[].forms, while the event's label is drawn) and its collected parents at priority
     1.5, after the highlighted family (1) and before every other formation (counters 3+, names 7+); not protected (decision 39 unchanged).
   - "fresh-first": during Play, at a re-placement pass, an item the frame's fresh layout would place (mlLayout's "build" on the same items,
     panels and symbols, tried and undone) comes back at once by the full search, without waiting for a second pass with room: in priority
     order, so it takes the room of a lower-priority item whose held place it needs.
   - "both": the two together (question 274 (a)).
   - "hysteresis": the corps counters above 265 units and the division counters below 235 once the view has moved (CL-MAP-12), 250 for a view
     reached without motion (as before, so every fresh view is laid out as it was).
   node tools/final-stage5/variants.js [build.html] [--only a,b] [--long k1,k2|none] [--full] [--json out.json]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), crypto=require("crypto");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..",".."), L=require(path.join(ROOT,"tools","stage8","lib.js"));
const MO=require(path.join(ROOT,"tools","visual","motion.js")), TH=require(path.join(ROOT,"tools","visual","thresholds.js"));
const V=require(path.join(ROOT,"tools","audit-post8","visibility","vis-lib.js")), RS=require(path.join(ROOT,"tools","audit-post8","visibility","runs.js"));
const OUT=opt("--json"), FULL=argv.includes("--full"), ONLY=opt("--only")?opt("--only").split(","):null;
const html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(ROOT,"austerlitz-command-map.html"));
/* the long runs: the audit's, and ChatGPT's continuous 3,600 frames from 09:00 in Landscape with counters (its CG-F01 protocol) */
const LONG={"hybrid-0830":RS.RUNS["hybrid-0830"], "hybrid-1200":RS.RUNS["hybrid-1200"], "hybrid-0900-3600":[RS.view("hybrid"),{from:540,speed:0.5,fixedFrames:3600,rest:90}],
  "phone-0900":RS.RUNS["phone-0900"], "land-0900":RS.RUNS["land-0900"], "paper-0900":RS.RUNS["paper-0900"], "hybrid-4x-day":RS.RUNS["hybrid-4x-day"],
  "hybrid-fr-0900":RS.RUNS["hybrid-fr-0900"], "hybrid-al-0900":RS.RUNS["hybrid-al-0900"]};
const LONG_KEYS=opt("--long")==="none"?[]:opt("--long")?opt("--long").split(","):Object.keys(LONG);

const EVN_DEF='  var foc=null;';
const EVN=[EVN_DEF, EVN_DEF+'\n  var evNamed={}; if(eventGroup&&eventGroup.visible) eventMarks.forEach(function(k){ if(k.labelOn&&k.e.forms) k.e.forms.forEach(function(id){ for(var x=id,g=0;x&&FORMATIONS[x]&&g<6;x=FORMATIONS[x].parent,g++) evNamed[x]=1; }); });'];
const EVN_C=['add(it,{cat:"counter",mode:"counter",pri:sel?0:(hov||fo)?0.5:inFam?1:base,','add(it,{cat:"counter",mode:"counter",pri:sel?0:(hov||fo)?0.5:inFam?1:evNamed[id]?1.5:base,'];
const EVN_N=['add(it,{cat:"name",pri:sel?0:(hov||fo)?0.5:inFam?1:base,','add(it,{cat:"name",pri:sel?0:(hov||fo)?0.5:inFam?1:evNamed[id]?1.5:base,'];
const FF_A=['    if(s==="build"||it.el===foc) return mlPlaceItem(it,VW,VH,panels,obst);',
  '    if(s==="build"||it.el===foc) return mlPlaceItem(it,VW,VH,panels,obst);\n    if(FRESH&&FRESH[it.key]&&!(it.wasOn&&it.mem)){ if(mlPlaceItem(it,VW,VH,panels,obst)){ it.room2=0; return true; } }'];
const FF_B=['  runRest(strat);',
  '  var FRESH=null;\n  if(strat==="hold"&&MLS.pass&&playing){ FRESH={}; var tk0=ML.taken.slice(), sv=[];\n'+
  '    for(var iq=nk;iq<order.length;iq++){ var q=order[iq]; sv.push([q,q.rect,q.lead,q.state,q.ox,q.oy,q.mrect]); FRESH[q.key]=!!mlPlaceItem(q,VW,VH,panels,obst); }\n'+
  '    ML.taken=tk0; sv.forEach(function(s){ var q=s[0]; q.rect=s[1]; q.lead=s[2]; q.state=s[3]; q.ox=s[4]; q.oy=s[5]; q.mrect=s[6]; }); }\n  runRest(strat);'];
const HYS=['  var wantCorps = dist>250;','  var wantCorps = (typeof MLS!=="undefined"&&!MLS.fresh&&(MLS.moving||MLS.fromMotion))?(lodEch==="corps"?dist>235:dist>265):dist>250;'];
const VARIANTS=[{name:"none",rep:[]},{name:"event-named",rep:[EVN,EVN_C,EVN_N]},{name:"fresh-first",rep:[FF_A,FF_B]},{name:"both",rep:[EVN,EVN_C,EVN_N,FF_A,FF_B]},
  {name:"hysteresis",rep:[HYS]},{name:"both+hysteresis",rep:[EVN,EVN_C,EVN_N,FF_A,FF_B,HYS]}];

/* the formations a live event names, while its label is drawn (the audit's analyse.js evForms, in brief) */
const HID=new Set(["h","H","d","D"]);
function evNamedShare(raw,events){
  const F=raw.frames, p0=F.findIndex(f=>f.ph==="play"), p1=F.map(f=>f.ph).lastIndexOf("play"), out=[]; let v=0, d=0;
  events.forEach(e=>{ const ei=raw.items["e:"+e.id]; if(!ei||!e.forms.length) return; const idx=[]; for(let i=p0;i<=p1;i++) if(ei.codes[i]==="#") idx.push(i); if(!idx.length) return;
    e.forms.forEach(fid=>{ const fc=V.formationCodes(raw.items,fid,F.length); if(!fc) return; let iv=0, dr=0;
      idx.forEach(i=>{ const c=fc.codes[i]; if(c==="#"){ iv++; dr++; } else if(HID.has(c)||c==="t") iv++; });
      if(iv){ v+=iv; d+=dr; out.push({event:e.id, id:fid, inView:iv, share:+(dr/iv).toFixed(3)}); } }); });
  return {inView:v, drawn:d, share:v?+(d/v).toFixed(3):null, under80:out.filter(r=>r.inView>=10&&r.share<0.8).sort((a,b)=>a.share-b.share)};
}
(async()=>{
  const src=fs.readFileSync(html,"utf8"), R={build:path.basename(html), md5:crypto.createHash("md5").update(src).digest("hex"), full:FULL, variants:[]};
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"wp07-variants-"));
  const settle=async p=>{ await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await p.waitForTimeout(450); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); };
  for(const VA of VARIANTS){ if(ONLY&&!ONLY.includes(VA.name)) continue;
    let s=src; for(const [a,b] of VA.rep){ const n=s.split(a).length-1; if(n!==1) throw new Error(VA.name+": a replacement found "+n+" times: "+a.slice(0,70)); s=s.replace(a,()=>b); }
    const file=path.join(dir,VA.name+".html"); fs.writeFileSync(file,s); process.env.AUSTERLITZ_HTML=file;
    const browser=await L.launch(), errs=[], t0=Date.now();
    /* the motion block, as check:selftest runs it */
    let page=await L.open(browser,[1600,900]); page.setDefaultTimeout(0);
    page.on("pageerror",e=>errs.push(e.message)); page.on("console",m=>{ if(m.type()==="warning"||m.type()==="error") errs.push(m.type()+": "+m.text().slice(0,200)); });
    const B=await MO.runBlock(page,settle,{selftestOnly:!FULL, log:()=>{}});
    const runs=B.runs, s16=runs.filter(r=>!r.real&&!r.point&&!r.select&&!r.reading&&!r.touch), S=k=>s16.reduce((a,r)=>a+r[k],0);
    const judged=TH.checkLive({motion:B},{selftestOnly:!FULL,legacy:true}).filter(x=>/map layer in motion/.test(x));
    const lines=judged.length?judged[0].replace(/^the map layer in motion \(decision 240 \(a\)\): /,"").replace(/ \{"jumps".*$/,"").split("; "):[];
    const drivenVis=runs.filter(r=>!r.real&&TH.MOTION.VIS[r.key]);
    const res={name:VA.name, totals:{jumps:S("jumps"),pops:S("pops"),flicker:S("flicker"),lod:S("lod")}, failures:lines,
      drawn:drivenVis.reduce((a,r)=>a+r.track.on,0), drawnBaselines:drivenVis.reduce((a,r)=>a+TH.MOTION.VIS[r.key][0],0),
      runs:runs.map(r=>({key:r.key,jumps:r.jumps,pops:r.pops,flicker:r.flicker,lod:r.lod,hover:r.hover,track:{on:r.track.on,inView:r.track.inView,longestMs:r.track.longestMs}})), long:{}};
    const events=await page.evaluate(()=>EVENTS.map(e=>({id:e.id, forms:e.forms||[]})));
    await page.close();
    /* the long runs, as long-play.js sets each up */
    let vp=null; page=null;
    for(const k of LONG_KEYS){ const [spec,o]=LONG[k];
      if(!page||vp[0]!==spec.viewport[0]||vp[1]!==spec.viewport[1]){
        if(page) await page.close(); vp=spec.viewport; page=await L.open(browser,vp); page.setDefaultTimeout(0);
        page.on("pageerror",e=>errs.push(e.message)); page.on("console",m=>{ if(m.type()==="warning"||m.type()==="error") errs.push(m.type()+": "+m.text().slice(0,200)); });
        await settle(page); await page.evaluate(()=>closeFirst(null)); }
      await page.evaluate(()=>{ select(null,null); stopPlay(); });
      await page.evaluate(s=>window.__aus.apply(s),spec); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(90,true));
      await page.evaluate(MO.inPage); await page.evaluate(V.ACC);
      const a=Object.assign({gl:false,room:false,stat:false,pre:8,rest:30,max:20000,freshEnd:true,frameMs:1000/30},o);
      const r=await page.evaluate(a=>window.__vis.run(a),a), SU=V.summarise(r,a.frameMs);
      const fm=SU.formations.filter(f=>f.play.inView>=30).map(f=>({id:f.id, share:f.play.share, longestMs:f.play.longestMs, longestMin:f.play.longestClockMin, inView:f.play.inView}));
      const tot=SU.formations.reduce((x,f)=>{ x.d+=f.play.drawn; x.v+=f.play.inView; return x; },{d:0,v:0});
      res.long[k]={clock:[SU.clockFrom,SU.clockTo], playFrames:SU.playFrames, share:+(tot.d/Math.max(1,tot.v)).toFixed(3), drawn:tot.d, inView:tot.v,
        longestMs:Math.max(0,...fm.map(f=>f.longestMs)), longestMin:Math.max(0,...fm.map(f=>f.longestMin)),
        under50:fm.filter(f=>f.share<0.5).sort((p,q)=>p.share-q.share).map(f=>f.id+" "+f.share+" ("+f.longestMin+" min)"),
        worst:fm.slice().sort((p,q)=>q.longestMs-p.longestMs).slice(0,6).map(f=>f.id+" "+f.longestMs+"ms/"+f.longestMin+"min "+f.share),
        evNamed:evNamedShare(r,events), formations:fm}; }
    if(page) await page.close();
    R.chromium=browser.version(); await browser.close();
    res.console=errs; res.secs=Math.round((Date.now()-t0)/1000); R.variants.push(res);
    console.log("["+VA.name+"] the 16 "+JSON.stringify(res.totals)+"; formations drawn "+res.drawn+" (the baselines' "+res.drawnBaselines+"); "+lines.length+" failing lines"+(lines.length?": "+lines.join("; "):"")+"; console "+errs.length+" ("+res.secs+" s)");
    Object.keys(res.long).forEach(k=>{ const x=res.long[k]; console.log("   "+k.padEnd(18)+" share "+x.share+", longest "+x.longestMs+" ms / "+x.longestMin+" min, under half "+x.under50.length+" ["+x.under50.join("; ")+"], event-named "+x.evNamed.share+" (under 80%: "+x.evNamed.under80.length+")"); });
    if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(R,null,1)); } }
})().catch(e=>{ console.error(e); process.exit(1); });
