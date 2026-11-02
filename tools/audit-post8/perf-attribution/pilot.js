/* perf-attribution pilot: one page of one build, a few frames of each motion, to size the real runs. Usage: node pilot.js <html> [w h] */
"use strict";
const P=require("./pa-lib.js");
(async()=>{
  const html=process.argv[2], vp=[+(process.argv[3]||1600),+(process.argv[4]||816)];
  const b=await P.A.launch();
  const t0=Date.now();
  const page=await P.openVisitor(b,html,vp);
  console.log("boot",JSON.stringify(page._boot),"open s",((Date.now()-t0)/1000).toFixed(1));
  for(const key of ["play-half","overview-orbit"]){
    const st=await P.setup(page,key); console.log(key,"setup",JSON.stringify(st));
    const M=P.MOTIONS[key];
    const r=await P.runMotion(page,{kind:M.kind,n:+(process.env.PA_N||12),warm:+(process.env.PA_W||6),frameMs:1000/144,pxPerFrame:0.485,profile:process.env.PA_PROF!=="0",sampleUs:200,stubDraws:process.env.PA_STUB==="1"});
    if(r.err) console.log("ERR",r.err);
    const loopMs=r.t.map(x=>x[1]), sync=r.t.map(x=>x[2]);
    console.log(key,"wall s",r.wallS,"loop",JSON.stringify(P.stats(loopMs)),"sync",JSON.stringify(P.stats(sync)),"info",JSON.stringify(r.info.slice(0,3)),"cull",JSON.stringify(r.cull.slice(0,3)),"clock",r.clock0,r.clock1);
    const ag=P.aggregate(r.profile,r.t.length,{steps:P.STEPS,top:15});
    console.log(JSON.stringify({run:ag.runMsPerFrame,sync:ag.syncMsPerFrame,us:ag.sampleUsMedian,n:ag.samplesInRun,cats:ag.cats,top:ag.top.slice(0,12),incl:ag.incl}));
  }
  console.log("log",JSON.stringify(page._log.slice(0,5)));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
