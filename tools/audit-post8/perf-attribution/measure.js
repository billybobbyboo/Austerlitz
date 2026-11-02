/* Final audit after Stage 8, area perf-attribution: the same deterministic motions on several builds, interleaved, each page on a fresh browser.
   Usage: node measure.js <outdir> <rawdir> <label=html> [<label=html> ...]
   env: PA_ROUNDS (rounds of the builds in the order given: A,B,A,B...; default 2), PA_FIRST (first round's number, default 1),
        PA_MOTIONS (default play-half,overview-held,overview-route,overview-drag,ph8-drag), PA_VP (default 2560x1305: the device page),
        PA_BOOTPROF (rounds whose start-up is profiled, default "2"), PA_PLAY_N (default 1656: the device's 12 s at 144 Hz less its 0.5 s warm-up),
        PA_ORBIT_N (default 792: the device's 6 s less 0.5), PA_HELD_N (default 504: the device's 4 s less 0.5), PA_WARM (default 72: the device
        route's first 0.5 s, excluded), PA_PASSES (default timing,profile; "count": every GL and listed app call counted over PA_COUNT_N frames, default 144), PA_STUB (default 1)
   Per page: the start-up (and its profile in PA_BOOTPROF rounds); per motion, from the same set-up each time, a timing pass (no profiler: each
   frame's real time, its named steps, the main thread's CPU and wait from schedstat) and a profile pass (the CDP sampling profiler at 200 us
   over the same frames). Writes <outdir>/page-<round>-<label>.json (statistics) and <rawdir>/{frames,prof,boot}-<round>-<label>[-<motion>-<pass>].json.gz. */
"use strict";
const fs=require("fs"), path=require("path"), zlib=require("zlib"), cp=require("child_process");
const P=require("./pa-lib.js");
const [outdir,rawdir,...specs]=process.argv.slice(2);
if(!outdir||!rawdir||!specs.length){ console.error("usage: node measure.js <outdir> <rawdir> <label=html>..."); process.exit(2); }
fs.mkdirSync(outdir,{recursive:true}); fs.mkdirSync(rawdir,{recursive:true});
const BUILDS=specs.map(s=>{ const i=s.indexOf("="), html=s.slice(i+1); return {label:s.slice(0,i), html, md5:cp.execFileSync("md5sum",[html]).toString().split(" ")[0], bytes:fs.statSync(html).size}; });
const ROUNDS=+(process.env.PA_ROUNDS||2), FIRST=+(process.env.PA_FIRST||1), MOTIONS=(process.env.PA_MOTIONS||"play-half,overview-held,overview-route,overview-drag,ph8-drag").split(",");
const VP=(process.env.PA_VP||"2560x1305").split("x").map(Number), BOOTPROF=(process.env.PA_BOOTPROF||"2").split(",").map(Number);
const N={play:+(process.env.PA_PLAY_N||1656), route:+(process.env.PA_ORBIT_N||792), drag:+(process.env.PA_ORBIT_N||792), held:+(process.env.PA_HELD_N||504)};
const WARM=+(process.env.PA_WARM||72), PASSES=(process.env.PA_PASSES||"timing,profile").split(","), STUB=process.env.PA_STUB!=="0";
const FRAME_MS=1000/144;   /* the device desktop's 144 Hz; the drag 0.485 px a frame: 20 degrees a second at 0.005 rad a pixel (LANDCAM orbit, app.js:6514), as the route's orbitStep */
const log=m=>console.log(new Date().toISOString().slice(11,19)+" "+m);
const r3=x=>Math.round(x*1000)/1000;
(async()=>{
  for(let round=FIRST;round<FIRST+ROUNDS;round++) for(const B of BUILDS){
    const tag=round+"-"+B.label, file=path.join(outdir,"page-"+tag+".json");
    if(fs.existsSync(file)){ log("skip "+tag+" (done)"); continue; }
    const browser=await P.A.launch();
    const out={build:B, round, viewport:VP, frameMs:FRAME_MS, stubDraws:STUB, started:new Date().toISOString(), load0:P.loadavg(), motions:{}};
    try{
      const page=await P.openVisitor(browser,B.html,VP,{profileBoot:BOOTPROF.indexOf(round)>=0?1000:0, stub:STUB});
      out.boot=page._boot; out.browserVersion=browser.version();
      if(page._bootProfile){ out.bootProfile=P.aggregate(page._bootProfile,1,{root:null,steps:["init","buildWorld","groundGeometry","buildFormations","buildUI","openFirstRun","loop","renderFrame","renderFX","render","compileShader","linkProgram","getProgramParameter","getShaderParameter","liftBoot","buildCover","coverClass","scaleGround","planBuildings8g","layBuildings","makeBlock","kitGeo","artGeo","groundDetail"],top:40});
        fs.writeFileSync(path.join(rawdir,"boot-"+tag+".json.gz"),zlib.gzipSync(JSON.stringify(page._bootProfile))); }
      log(tag+" booted: firstFrame "+out.boot.firstFrame+" ms, bootGone "+out.boot.bootGone+" ms, quiet by "+out.boot.lastLongEnd+" ms, stub "+JSON.stringify(out.boot.stub));
      for(const key of MOTIONS){
        const M=P.MOTIONS[key], n=N[M.kind], o={kind:M.kind, n, warm:WARM, frameMs:FRAME_MS, pxPerFrame:0.485};
        const rec={note:M.note, kind:M.kind, n, warm:WARM};
        for(const pass of PASSES){
          rec.setup=await P.setup(page,key);
          const nn=pass==="count"?Math.min(n,+(process.env.PA_COUNT_N||144)):n;
          const r=await P.runMotion(browser,page,Object.assign({},o,{n:nn, profile:pass==="profile", count:pass==="count", sampleUs:200}));
          const col=j=>r.t.map(x=>x[j]);
          const R={err:r.err||r.begin.err||null, clock0:r.clock0, clock1:r.clock1, wallS:r.wallS, load:r.load, drainMs:r.begin.drainMs,
            cpuMsPerFrame:r3(r.cpu.runMs/nn), cpuWaitMsPerFrame:r3(r.cpu.waitMs/nn), cpuWallMs:r.cpu.wallMs, gpuCpuMsPerFrame:r3(r.cpu.gpuRunMs/nn), thread:r.cpu.thread,
            input:P.stats(col(0)), loop:P.stats(col(1)), flush:P.stats(col(2)), sync:P.stats(col(3)),
            calls:P.stats(r.info.map(x=>x[0])), tris:P.stats(r.info.map(x=>x[1])), ncalls:r.ncalls, mls:r.mls||null,
            ml:r.ml.length?{placed:P.stats(r.ml.map(x=>x[0])), dropped:P.stats(r.ml.map(x=>x[1])), held:P.stats(r.ml.map(x=>x[2]))}:null,
            cull:r.cull.length?{tests:P.stats(r.cull.map(x=>x[0])), culled:P.stats(r.cull.map(x=>x[1])), refresh:P.stats(r.cull.map(x=>x[2])), inst:P.stats(r.cull.map(x=>x[3]))}:null,
            steps:{}, n:nn};
          if(r.counts){ const pf=x=>+(x/nn).toFixed(2); R.counts={frames:nn, glTotalPerFrame:pf(r.counts.glTotal), bytesPerFrame:Math.round(r.counts.bytes/nn), gl:{}, app:{}};
            Object.keys(r.counts.gl).sort((a,b)=>r.counts.gl[b]-r.counts.gl[a]).forEach(k=>R.counts.gl[k]=pf(r.counts.gl[k])); Object.keys(r.counts.app).sort((a,b)=>r.counts.app[b]-r.counts.app[a]).forEach(k=>R.counts.app[k]=pf(r.counts.app[k])); }
          Object.keys(r.steps).forEach(k=>{ R.steps[k]=P.stats(r.steps[k]); });
          fs.writeFileSync(path.join(rawdir,"frames-"+tag+"-"+key+"-"+pass+".json.gz"),zlib.gzipSync(JSON.stringify({t:r.t, info:r.info, steps:r.steps, ml:r.ml, cull:r.cull})));
          if(r.profile){ R.agg=P.aggregate(r.profile,nn,{steps:P.STEPS,top:80}); fs.writeFileSync(path.join(rawdir,"prof-"+tag+"-"+key+".json.gz"),zlib.gzipSync(JSON.stringify(r.profile))); }
          rec[pass]=R;
          log(tag+" "+key+" "+pass+": loop p50 "+R.loop.p50+" mean "+R.loop.mean+" p90 "+R.loop.p90+" max "+R.loop.max+" | cpu "+R.cpuMsPerFrame+" wait "+R.cpuWaitMsPerFrame+" gpu "+R.gpuCpuMsPerFrame+
            " ms/frame | flush p50 "+R.flush.p50+" sync p50 "+R.sync.p50+" | upd p50 "+(R.steps.updateVisibility||{}).p50+" ml p50 "+(R.steps.mlLayout||{}).p50+" three p50 "+(R.steps["three.render"]||{}).p50+
            " | calls "+R.calls.p50+" tris "+R.tris.p50+" | clock "+(+R.clock0).toFixed(1)+"-"+(+R.clock1).toFixed(1)+" | "+R.wallS+" s"+(R.err?" ERR "+R.err:"")+(R.agg?" | profiled "+R.agg.runMsPerFrame+" ms/frame":""));
        }
        out.motions[key]=rec;
      }
      out.consoleLog=page._log.slice(0,20);
    }catch(e){ out.error=String(e&&e.stack||e).slice(0,1500); log(tag+" ERROR "+out.error); }
    out.finished=new Date().toISOString(); out.load1=P.loadavg();
    await browser.close();
    fs.writeFileSync(file,JSON.stringify(out));
    log("wrote "+file);
  }
})().catch(e=>{ console.error(e); process.exit(1); });
