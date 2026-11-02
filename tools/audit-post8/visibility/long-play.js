#!/usr/bin/env node
/* Final audit after Stage 8, area "visibility": counters and names over long Play runs on the motion driver's clock (vis-lib.js).
   node tools/audit-post8/visibility/long-play.js --runs bench-hybrid,hybrid-0830,... [--out <dir>] [--frame-ms 33.333] [--stat-every 1]
   Opens the harness's page (?harness=1, software WebGL, CSS transitions off: the page the motion block runs on) at each run's viewport, sets up
   each run as tools/visual/motion.js runBlock sets up a run (no drawn frame: select none, Play stopped, the view applied, settle(90, no render),
   the driver injected), then plays it (vis-lib.js ACC: RUN's Play set-up, step for step), with gl:false (the layout reads nothing it draws).
   Writes <out>/raw-<run>.json (every item's per-frame string) and <out>/sum-<run>.json (vis-lib.js summarise). Measurement only. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const A=require("../lib.js");
const MO=require(path.join(A.ROOT,"tools","visual","motion.js"));
const V=require("./vis-lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=path.resolve(opt("--out")||path.join(A.EVID,"visibility","runs")), FRAME_MS=+(opt("--frame-ms")||1000/30), STAT_EVERY=+(opt("--stat-every")||1);
fs.mkdirSync(OUT,{recursive:true});
const {RUNS}=require("./runs.js");
(async()=>{
  const want=(opt("--runs")||"bench-hybrid").split(",").filter(Boolean);
  want.forEach(k=>{ if(!RUNS[k]) throw new Error("no run "+k); });
  const html=path.resolve(process.env.AUSTERLITZ_HTML||path.join(A.ROOT,"austerlitz-command-map.html"));
  const md5=crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex");
  const b=await A.launch(), t0=Date.now();
  let page=null, vp=null;
  const settle=async p=>{ await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await p.waitForTimeout(450); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); };
  for(const k of want){
    const [spec,o]=RUNS[k], t1=Date.now();
    if(!page){ vp=spec.viewport; page=await A.open(b,vp); page.setDefaultTimeout(0); await settle(page); await page.evaluate(()=>closeFirst(null)); }
    if(vp[0]!==spec.viewport[0]||vp[1]!==spec.viewport[1]){ vp=spec.viewport; await page.setViewportSize({width:vp[0],height:vp[1]});
      await page.waitForFunction(([w,h])=>window.innerWidth===w&&window.innerHeight===h&&Math.abs(landCam.aspect-w/h)<1e-9&&(typeof PHONE==="undefined"||PHONE===window.matchMedia(PHONE_Q).matches),[vp[0],vp[1]],{timeout:120000,polling:50});
      await settle(page); }
    await page.evaluate(()=>{ select(null,null); stopPlay(); });
    await page.evaluate(s=>window.__aus.apply(s),spec);
    await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(90,true));
    await page.evaluate(MO.inPage); await page.evaluate(V.ACC);
    const a=Object.assign({gl:false,room:true,stat:true,statEvery:STAT_EVERY,pre:8,rest:30,max:20000,freshEnd:true,frameMs:FRAME_MS},o);
    const r=await page.evaluate(a=>window.__vis.run(a),a);
    const S=V.summarise(r,a.frameMs);
    const raw={run:k, spec, opts:a, build:path.basename(html), md5, chromium:b.version(), viewport:r.viewport, presentation:r.presentation, mode:r.mode,
      playFrames:r.playFrames, hovered:r.hovered, endedPlaying:r.endedPlaying, endClock:r.endClock, wallMs:r.wallMs, quirk:r.quirk, mls:r.mls, meta:r.meta, frames:r.frames, items:r.items};
    fs.writeFileSync(path.join(OUT,"raw-"+k+".json"),JSON.stringify(raw));
    const sum=Object.assign({run:k, spec, opts:a, build:path.basename(html), md5, chromium:b.version(), wallMs:r.wallMs, quirk:r.quirk},S);
    sum.formations.forEach(f=>{ delete f.codes; });
    fs.writeFileSync(path.join(OUT,"sum-"+k+".json"),JSON.stringify(sum,null,1));
    const worst=S.formations.slice().sort((p,q)=>q.play.longestFrames-p.play.longestFrames).slice(0,5).map(f=>f.id+" "+f.play.longestMs+"ms/"+f.play.longestClockMin+"min share "+f.play.share).join("; ");
    console.log(k.padEnd(20)+" frames "+S.frames+" (play "+S.playFrames+", "+S.clockFrom+"->"+S.clockTo+"), formations drawn "+S.total.drawn+" of "+S.total.inView+", longest hidden "+S.total.longestMs+" ms, episodes "+S.total.episodes+
      ", quirk "+r.quirk+", wall "+(r.wallMs/1000).toFixed(1)+" s, run "+((Date.now()-t1)/1000).toFixed(0)+" s\n   worst: "+worst);
  }
  await b.close();
  console.log("done in "+((Date.now()-t0)/1000).toFixed(0)+" s");
})().catch(e=>{ console.error(e); process.exit(1); });
