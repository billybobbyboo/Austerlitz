/* perf-attribution pilot: one page of one build, a few frames of each motion, to size and check the real runs (measure.js).
   Usage: node pilot.js <html> [w h]   env: PA_N (frames, default 24), PA_W (warm-up frames, default 12), PA_PROF=0 (no profile), PA_STUB=0 (draws on) */
"use strict";
const P=require("./pa-lib.js");
(async()=>{
  const html=process.argv[2], vp=[+(process.argv[3]||2560),+(process.argv[4]||1305)];
  const b=await P.A.launch();
  const t0=Date.now();
  const page=await P.openVisitor(b,html,vp,{stub:process.env.PA_STUB!=="0"});
  console.log("boot",JSON.stringify(page._boot),"open s",((Date.now()-t0)/1000).toFixed(1));
  for(const key of Object.keys(P.MOTIONS)){
    const st=await P.setup(page,key); console.log(key,"setup",JSON.stringify(st));
    const M=P.MOTIONS[key];
    const r=await P.runMotion(b,page,{kind:M.kind,n:+(process.env.PA_N||24),warm:+(process.env.PA_W||12),frameMs:1000/144,pxPerFrame:0.485,profile:process.env.PA_PROF!=="0",sampleUs:200});
    if(r.err||r.begin.err) console.log("ERR",r.err||r.begin.err);
    const col=j=>r.t.map(x=>x[j]);
    console.log(key,"wall s",r.wallS,"loop",JSON.stringify(P.stats(col(1))),"flush",JSON.stringify(P.stats(col(2))),"sync",JSON.stringify(P.stats(col(3))),"cpu",JSON.stringify(r.cpu),"drain",r.begin.drainMs,"info",JSON.stringify(r.info.slice(0,2)),"mls",JSON.stringify(r.mls),"clock",r.clock0,r.clock1,"wrapped",r.begin.wrapped.join(","));
    console.log(" steps p50",JSON.stringify(Object.fromEntries(Object.entries(r.steps).map(([k,v])=>[k,P.stats(v).p50]))));
    if(r.profile){ const ag=P.aggregate(r.profile,r.t.length,{steps:P.STEPS,top:15});
      console.log(" prof",JSON.stringify({run:ag.runMsPerFrame,sync:ag.syncMsPerFrame,flush:ag.flushMsPerFrame,us:ag.sampleUsMedian,cats:ag.cats.slice(0,10),top:ag.top.slice(0,10),threeBy:ag.threeBy.slice(0,5)})); }
  }
  console.log("log",JSON.stringify(page._log.slice(0,8)));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
