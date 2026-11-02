/* Final audit after Stage 8, area perf-attribution: the same deterministic motions on several builds, interleaved, each on a fresh browser and page.
   Usage: node measure.js <outdir> <rawdir> <label=html> [<label=html> ...]
   env: PA_ROUNDS (rounds of the builds in the order given: A,B,A,B...; default 2), PA_MOTIONS (default play-half,overview-orbit,ph8-orbit),
        PA_VP (default 1600x816: the device page's aspect, 2560x1305), PA_BOOTPROF (rounds whose start-up is profiled, default "2"),
        PA_PLAY_N (default 1152: 08:30 to about 09:12 at half speed, the device's window), PA_ORBIT_N (default 792: the device's 5.5 s counted),
        PA_WARM (default 72: the device route's first 0.5 s, excluded), PA_STUB (default 1), PA_PROFILE (default 1)
   Per page: the start-up (and its profile in PA_BOOTPROF rounds); per motion two passes from the same set-up: timing (no profiler: each frame's
   real time and the main thread's CPU from schedstat) and profile (the CDP sampling profiler at 200 us over the same frames).
   Writes <outdir>/page-<round>-<label>.json (no raw profile) and <rawdir>/prof-<round>-<label>-<motion>.json.gz (raw profiles). */
"use strict";
const fs=require("fs"), path=require("path"), zlib=require("zlib"), cp=require("child_process");
const P=require("./pa-lib.js");
const [outdir,rawdir,...specs]=process.argv.slice(2);
if(!outdir||!rawdir||!specs.length){ console.error("usage: node measure.js <outdir> <rawdir> <label=html>..."); process.exit(2); }
fs.mkdirSync(outdir,{recursive:true}); fs.mkdirSync(rawdir,{recursive:true});
const BUILDS=specs.map(s=>{ const i=s.indexOf("="), html=s.slice(i+1); return {label:s.slice(0,i), html, md5:cp.execFileSync("md5sum",[html]).toString().split(" ")[0], bytes:fs.statSync(html).size}; });
const ROUNDS=+(process.env.PA_ROUNDS||2), MOTIONS=(process.env.PA_MOTIONS||"play-half,overview-orbit,ph8-orbit").split(","), VP=(process.env.PA_VP||"1600x816").split("x").map(Number);
const BOOTPROF=(process.env.PA_BOOTPROF||"2").split(",").map(Number), PLAY_N=+(process.env.PA_PLAY_N||1152), ORBIT_N=+(process.env.PA_ORBIT_N||792), WARM=+(process.env.PA_WARM||72);
const STUB=process.env.PA_STUB!=="0", PROFILE=process.env.PA_PROFILE!=="0";
const FRAME_MS=1000/144;   /* the device desktop's 144 Hz; the orbit 0.485 px a frame: 20 degrees a second at 0.005 rad a pixel (LANDCAM.orbit), as the route's orbitStep */
const log=m=>console.log(new Date().toISOString().slice(11,19)+" "+m);
const r2=x=>Math.round(x*100)/100;
(async()=>{
  for(let round=1;round<=ROUNDS;round++) for(const B of BUILDS){
    const tag=round+"-"+B.label, file=path.join(outdir,"page-"+tag+".json");
    if(fs.existsSync(file)){ log("skip "+tag+" (done)"); continue; }
    const browser=await P.A.launch();
    const out={build:B, round, viewport:VP, frameMs:FRAME_MS, stubDraws:STUB, started:new Date().toISOString(), load0:P.loadavg(), motions:{}};
    try{
      const page=await P.openVisitor(browser,B.html,VP,{profileBoot:BOOTPROF.indexOf(round)>=0?1000:0});
      out.boot=page._boot; out.browserVersion=browser.version();
      if(page._bootProfile){ out.bootProfile=P.aggregate(page._bootProfile,1,{root:null,steps:["init","buildWorld","groundGeometry","buildFormations","buildUI","openFirstRun","loop","renderFrame","renderFX","render","compileShader","linkProgram","getProgramParameter","getShaderParameter","fontsReady","liftBoot","buildCover","coverClass","scaleGround","planBuildings8g","layBuildings","makeBlock","kitGeo","artGeo"],top:40});
        fs.writeFileSync(path.join(rawdir,"boot-"+tag+".json.gz"),zlib.gzipSync(JSON.stringify(page._bootProfile))); }
      log(tag+" booted: bootGone "+out.boot.bootGone+" ms, first frame "+out.boot.firstFrame+" ms, long tasks "+out.boot.longMs+" ms");
      for(const key of MOTIONS){
        const M=P.MOTIONS[key], n=M.kind==="play"?PLAY_N:ORBIT_N, o={kind:M.kind, n, warm:WARM, frameMs:FRAME_MS, pxPerFrame:0.485, stubDraws:STUB};
        const rec={note:M.note, n, warm:WARM};
        for(const pass of PROFILE?["timing","profile"]:["timing"]){
          rec.setup=await P.setup(page,key);
          const r=await P.runMotion(browser,page,Object.assign({},o,{profile:pass==="profile",sampleUs:200}));
          const loop=r.t.map(x=>x[1]), inp=r.t.map(x=>x[0]), sync=r.t.map(x=>x[2]);
          const R={err:r.err||r.begin.err||null, clock0:r.clock0, clock1:r.clock1, wallS:r.wallS, load:r.load,
            cpuMsPerFrame:r2(r.cpu.runMs/n*100)/100, cpuWaitMsPerFrame:r2(r.cpu.waitMs/n*100)/100, cpuWallMs:r.cpu.wallMs, cpuOthers:r.cpu.others,
            loop:P.stats(loop), input:P.stats(inp), sync:P.stats(sync),
            calls:P.stats(r.info.map(x=>x[0])), tris:P.stats(r.info.map(x=>x[1])),
            cull:r.cull.length?{tests:P.stats(r.cull.map(x=>x[0])), culled:P.stats(r.cull.map(x=>x[1])), refresh:P.stats(r.cull.map(x=>x[2])), inst:P.stats(r.cull.map(x=>x[3]))}:null,
            loopMs:loop.map(x=>Math.round(x*100)/100)};
          if(r.profile){ R.agg=P.aggregate(r.profile,n,{steps:P.STEPS,top:80}); fs.writeFileSync(path.join(rawdir,"prof-"+tag+"-"+key+".json.gz"),zlib.gzipSync(JSON.stringify(r.profile))); }
          rec[pass]=R;
          log(tag+" "+key+" "+pass+": cpu "+R.cpuMsPerFrame.toFixed(2)+" ms/frame (wait "+R.cpuWaitMsPerFrame.toFixed(2)+"), loop p50 "+R.loop.p50+" mean "+R.loop.mean+" p95 "+R.loop.p95+" max "+R.loop.max+
            ", calls "+R.calls.p50+", tris "+R.tris.p50+", clock "+(+R.clock0).toFixed(1)+"-"+(+R.clock1).toFixed(1)+", "+R.wallS+" s"+(R.err?" ERR "+R.err:"")+(R.agg?" | profiled run "+R.agg.runMsPerFrame+" ms/frame":""));
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
