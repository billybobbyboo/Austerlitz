/* Final audit after Stage 8, area perf-attribution: the builds side by side in one session, so that the machine's load (other jobs on its
   4 cores) falls on every build alike. One browser and one visitor's page per build, opened one after another; then, per motion, timed
   blocks in a palindrome order (A B C C B A ...: a linear drift in the machine's load cancels), each block from the motion's own set-up
   (pa-lib.js setup, a fresh warm-up), every page but the measured one held by the motion driver (its loop stopped: nothing runs there);
   then one count block per build and motion (every GL call and the listed app calls counted: load-independent).
   Usage: node paired.js <out.json> <rawdir> <label=html> [<label=html> ...]
   env: PA_MOTIONS (default play-half,overview-held,overview-route,overview-drag,ph8-drag), PA_VP (default 2560x1305), PA_REPS (palindromes per
        motion, default 1), PA_PLAY_N (default 552), PA_ORBIT_N (default 264), PA_HELD_N (default 168), PA_WARM (default 72), PA_COUNT_N (default 144),
        PA_COUNT (default 1) */
"use strict";
const fs=require("fs"), path=require("path"), zlib=require("zlib"), cp=require("child_process");
const P=require("./pa-lib.js");
const [outFile,rawdir,...specs]=process.argv.slice(2);
if(!outFile||!rawdir||specs.length<2){ console.error("usage: node paired.js <out.json> <rawdir> <label=html> <label=html> ..."); process.exit(2); }
fs.mkdirSync(rawdir,{recursive:true});
const BUILDS=specs.map(s=>{ const i=s.indexOf("="), html=s.slice(i+1); return {label:s.slice(0,i), html, md5:cp.execFileSync("md5sum",[html]).toString().split(" ")[0], bytes:fs.statSync(html).size}; });
const MOTIONS=(process.env.PA_MOTIONS||"play-half,overview-held,overview-route,overview-drag,ph8-drag").split(","), VP=(process.env.PA_VP||"2560x1305").split("x").map(Number);
const REPS=+(process.env.PA_REPS||1), N={play:+(process.env.PA_PLAY_N||552), route:+(process.env.PA_ORBIT_N||264), drag:+(process.env.PA_ORBIT_N||264), held:+(process.env.PA_HELD_N||168)};
const WARM=+(process.env.PA_WARM||72), COUNT_N=+(process.env.PA_COUNT_N||144), COUNT=process.env.PA_COUNT!=="0", FRAME_MS=1000/144;
const log=m=>console.log(new Date().toISOString().slice(11,19)+" "+m);
const r3=x=>Math.round(x*1000)/1000;
const hold=page=>page.evaluate(()=>{ if(window.__md) window.__md.start({gl:true, frameMs:1000/144}); });
const release=page=>page.evaluate(()=>{ if(window.__md) window.__md.stop(); });
function blockRec(r,n){
  const col=j=>r.t.map(x=>x[j]); const R={err:r.err||r.begin.err||null, clock0:r.clock0, clock1:r.clock1, wallS:r.wallS, load:r.load, n,
    cpuMsPerFrame:r3(r.cpu.runMs/n), cpuWaitMsPerFrame:r3(r.cpu.waitMs/n), gpuCpuMsPerFrame:r3(r.cpu.gpuRunMs/n),
    loop:P.stats(col(1)), flush:P.stats(col(2)), sync:P.stats(col(3)), calls:P.stats(r.info.map(x=>x[0])), tris:P.stats(r.info.map(x=>x[1])), mls:r.mls||null, steps:{}};
  Object.keys(r.steps).forEach(k=>{ R.steps[k]=P.stats(r.steps[k]); });
  if(r.counts){ const pf=x=>+(x/n).toFixed(2); R.counts={frames:n, glTotalPerFrame:pf(r.counts.glTotal), bytesPerFrame:Math.round(r.counts.bytes/n), gl:{}, app:{}};
    Object.keys(r.counts.gl).sort((a,b)=>r.counts.gl[b]-r.counts.gl[a]).forEach(k=>R.counts.gl[k]=pf(r.counts.gl[k]));
    Object.keys(r.counts.app).sort((a,b)=>r.counts.app[b]-r.counts.app[a]).forEach(k=>R.counts.app[k]=pf(r.counts.app[k])); }
  return R;
}
(async()=>{
  const out={builds:BUILDS, viewport:VP, frameMs:FRAME_MS, reps:REPS, N, warm:WARM, started:new Date().toISOString(), load0:P.loadavg(), pages:{}, motions:{}, order:{}};
  const ctx={};
  for(const B of BUILDS){
    const browser=await P.A.launch(), page=await P.openVisitor(browser,B.html,VP,{stub:true});
    await page.evaluate(MD_IN);
    ctx[B.label]={browser,page}; out.pages[B.label]={boot:page._boot, browserVersion:browser.version()};
    log(B.label+" booted: firstFrame "+page._boot.firstFrame+" ms, bootGone "+page._boot.bootGone+", init "+(page._boot.bootms?page._boot.bootms.init:"-")+" ms; held");
    await hold(page);
  }
  const labels=BUILDS.map(b=>b.label), pal=labels.concat(labels.slice().reverse());
  try{
    for(const key of MOTIONS){
      const M=P.MOTIONS[key], n=N[M.kind]; out.motions[key]={note:M.note, n, blocks:[], counts:{}};
      const seq=[]; for(let i=0;i<REPS;i++) seq.push(...pal); out.order[key]=seq;
      for(let bi=0;bi<seq.length;bi++){ const L=seq[bi], C=ctx[L];
        await release(C.page);
        const st=await P.setup(C.page,key);
        const r=await P.runMotion(C.browser,C.page,{kind:M.kind, n, warm:WARM, frameMs:FRAME_MS, pxPerFrame:0.485, profile:false});
        await hold(C.page);
        const R=blockRec(r,n); R.build=L; R.i=bi; R.setup=st; out.motions[key].blocks.push(R);
        fs.writeFileSync(path.join(rawdir,"paired-"+key+"-"+bi+"-"+L+".json.gz"),zlib.gzipSync(JSON.stringify({t:r.t, info:r.info, steps:r.steps})));
        log(key+" #"+bi+" "+L+": cpu "+R.cpuMsPerFrame+" wait "+R.cpuWaitMsPerFrame+" | loop p50 "+R.loop.p50+" | upd "+(R.steps.updateVisibility||{}).p50+" ml "+(R.steps.mlLayout||{}).p50+" three "+(R.steps["three.render"]||{}).p50+
          " | calls "+R.calls.p50+" | clock "+(+R.clock0).toFixed(1)+"-"+(+R.clock1).toFixed(1)+" | load "+(r.load[1]||[]).join(" ")+(R.err?" ERR "+R.err:""));
      }
      if(COUNT) for(const L of labels){ const C=ctx[L];
        await release(C.page); await P.setup(C.page,key);
        const nn=Math.min(n,COUNT_N), r=await P.runMotion(C.browser,C.page,{kind:M.kind, n:nn, warm:WARM, frameMs:FRAME_MS, pxPerFrame:0.485, profile:false, count:true});
        await hold(C.page);
        const R=blockRec(r,nn); out.motions[key].counts[L]=R.counts; out.motions[key].counts[L].calls=R.calls.p50; out.motions[key].counts[L].err=R.err;
        log(key+" count "+L+": GL calls/frame "+R.counts.glTotalPerFrame+", bytes/frame "+R.counts.bytesPerFrame+", draws "+R.calls.p50);
      }
      fs.writeFileSync(outFile,JSON.stringify(out));
    }
  }catch(e){ out.error=String(e&&e.stack||e).slice(0,1500); log("ERROR "+out.error); }
  for(const L of labels){ try{ out.pages[L].consoleLog=ctx[L].page._log.slice(0,20); await ctx[L].browser.close(); }catch(e){} }
  out.finished=new Date().toISOString(); out.load1=P.loadavg();
  fs.writeFileSync(outFile,JSON.stringify(out));
  log("wrote "+outFile);
})().catch(e=>{ console.error(e); process.exit(1); });
const MD_IN=P.MD.inPage;
