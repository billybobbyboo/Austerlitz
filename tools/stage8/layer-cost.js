#!/usr/bin/env node
/* Stage 8, implementation PR 8C (docs/STAGE8_SPEC.md sections 3.5 and 8.3): the map layer's pass time, two builds in the same motions on the same
   idle machine. The 16 motions of tools/visual/motion.js (the app's own loop at 30 frames a second on the driver's clock, the WebGL draw
   skipped, no dry run of the room), each build in turn, round after round (the builds interleaved, so a drift of the machine falls on both);
   each pass of mlLayout timed by the real clock. Per motion and over all: the median and the 95th percentile of the passes, pooled over the
   rounds, and the candidate's excess over the reference (the budget: 0.5 ms at the median, 2 ms at the 95th percentile). CPU time in this page
   on this machine; a device's is for the device runs (section 8).
   node tools/stage8/layer-cost.js --ref ref.html --cand cand.html [--rounds 3] [--json out.json] */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os");
const L=require("./lib.js"), MO=require(path.join(L.ROOT,"tools","visual","motion.js"));
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const REF=path.resolve(opt("--ref")), CAND=path.resolve(opt("--cand")), ROUNDS=+(opt("--rounds")||3), OUT=opt("--json");
const q=(a,p)=>{ if(!a.length) return null; const s=a.slice().sort((x,y)=>x-y); return s[Math.min(s.length-1,Math.floor(s.length*p))]; };
async function runBuild(browser,html){
  process.env.AUSTERLITZ_HTML=html; let page=null, cur=null; const out={};
  for(const m of MO.MOTIONS){ const [id,view,kind,n,amt]=m;
    if(!page||cur!==view){ if(page) await page.close(); page=await L.open(browser,MO.VIEWS[view].viewport,{}); cur=view; }
    await page.evaluate(()=>{ select(null,null); stopPlay(); }); await L.applyCase(page,MO.VIEWS[view]); await page.evaluate(MO.inPage);
    const r=await page.evaluate(new Function("a","return ("+MO.RUN.toString()+")(a);"),{kind,n,amt,gl:false,room:false,rest:30,pre:8});
    out[id]=r.ms; }
  if(page) await page.close();
  return out;
}
(async()=>{
  const browser=await L.launch(), ms={ref:{},cand:{}}, res={ref:path.basename(REF), cand:path.basename(CAND), rounds:ROUNDS, chromium:browser.version(), host:{cpus:os.cpus().length, model:os.cpus()[0].model, load:os.loadavg()}, motions:{}};
  for(let r=0;r<ROUNDS;r++){
    for(const [k,html] of (r%2?[["cand",CAND],["ref",REF]]:[["ref",REF],["cand",CAND]])){
      const t0=Date.now(), o=await runBuild(browser,html);
      Object.keys(o).forEach(id=>{ (ms[k][id]=ms[k][id]||[]).push(...o[id]); });
      console.log("round",r+1,k,((Date.now()-t0)/1000).toFixed(0)+" s, load",os.loadavg().map(x=>x.toFixed(2)).join(" ")); }
  }
  await browser.close();
  const all={ref:[],cand:[]}; let worstMed=-1e9, worstP95=-1e9;
  MO.MOTIONS.forEach(([id])=>{ const a=ms.ref[id]||[], b=ms.cand[id]||[]; all.ref.push(...a); all.cand.push(...b);
    const R={ref:{n:a.length, med:+q(a,0.5).toFixed(2), p95:+q(a,0.95).toFixed(2)}, cand:{n:b.length, med:+q(b,0.5).toFixed(2), p95:+q(b,0.95).toFixed(2)}};
    R.dMed=+(R.cand.med-R.ref.med).toFixed(2); R.dP95=+(R.cand.p95-R.ref.p95).toFixed(2); worstMed=Math.max(worstMed,R.dMed); worstP95=Math.max(worstP95,R.dP95);
    res.motions[id]=R;
    console.log(id.padEnd(13),"ref med/p95",R.ref.med,R.ref.p95,"cand",R.cand.med,R.cand.p95,"excess",R.dMed,R.dP95); });
  res.all={ref:{n:all.ref.length, med:+q(all.ref,0.5).toFixed(2), p95:+q(all.ref,0.95).toFixed(2)}, cand:{n:all.cand.length, med:+q(all.cand,0.5).toFixed(2), p95:+q(all.cand,0.95).toFixed(2)}};
  res.all.dMed=+(res.all.cand.med-res.all.ref.med).toFixed(2); res.all.dP95=+(res.all.cand.p95-res.all.ref.p95).toFixed(2);
  res.worst={dMed:worstMed, dP95:worstP95}; res.budget={med:0.5, p95:2}; res.within=res.all.dMed<=0.5&&res.all.dP95<=2&&worstMed<=0.5&&worstP95<=2;
  console.log("ALL ref med/p95",res.all.ref.med,res.all.ref.p95,"cand",res.all.cand.med,res.all.cand.p95,"excess",res.all.dMed,res.all.dP95,"| worst motion's excess",worstMed,worstP95,"| within the budget:",res.within);
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
