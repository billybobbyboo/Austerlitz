#!/usr/bin/env node
/* Final audit after Stage 8, area "visibility": a Play run in real time, on the app's own requestAnimationFrame loop and the real clock (no
   motion driver), at 1600 x 900, observed frame by frame, to compare with the driver's runs (long-play.js).
   node tools/audit-post8/visibility/realtime.js [--nogl] [--to 600] [--cap-s 1200] [--out <file.json>]
   The page: a visitor's page (no ?harness=1, CSS transitions kept), its first-run card closed by a real Escape. Set-up through the app's
   globals (said here): the Landscape-with-counters view of tools/visual/motion.js VIEWS.hybrid applied with the clock at 09:00
   (window.__aus.apply, measure.js), Follow on (freeCam false, curVantage null: what motion.js RUN sets), speed 1/2x (the default). Play is
   pressed by a real mouse click on the Play button and, once the clock has reached --to, pressed again (Pause); the frames at rest after it
   are observed for 4 s of real time.
   Observation only: mlCollect and mlLayout are wrapped to read, after each pass the app makes, every collected item's state (drawn, hidden by
   the layout, behind the ground, off the screen or under a panel, absent), the clock, Play, the dwell, MLS's pass and motion, the frame's real
   time. --nogl stubs renderer.render (the WebGL draw; the layout reads nothing it draws), so that the app's own loop runs near a device's rate
   on this machine's software WebGL: an instrumented page, said in the record. Measurement only. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const A=require("../lib.js");
const MO=require(path.join(A.ROOT,"tools","visual","motion.js"));
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const NOGL=argv.includes("--nogl"), TO=+(opt("--to")||600), CAP=+(opt("--cap-s")||1200);
const OUT=path.resolve(opt("--out")||path.join(A.EVID,"visibility","runs","realtime"+(NOGL?"-nogl":"")+".json"));
const OBS=function(nogl){
  var R=window.__rt={F:[], it:{}, keys:[], n:0, list:null, nogl:!!nogl};
  var innerC=window.mlCollect; window.mlCollect=function(){ var l=innerC.apply(this,arguments); R.list=l; return l; };
  var innerL=window.mlLayout; window.mlLayout=function(){ var r=innerL.apply(this,arguments); try{ rec(); }catch(e){ R.err=String(e); } return r; };
  if(nogl){ R.render=renderer.render; renderer.render=function(){}; }
  function rec(){ var f=R.n++, L=R.list||[], seen={}, on=0;
    for(var i=0;i<L.length;i++){ var it=L[i], k=it.key;
      var c=it.eFrame===ML.frame?(it.state==="on"?"#":it.state==="occluded"?"t":it.held?"h":"d"):(it.state==="panel"?"p":"o");
      var r=R.it[k]; if(!r){ r=R.it[k]={cat:it.cat, fid:it.fid, c:[]}; R.keys.push(k); for(var j=0;j<f;j++) r.c.push("."); }
      r.c.push(c); seen[k]=1; if(c==="#") on++; }
    for(var q=0;q<R.keys.length;q++){ if(!seen[R.keys[q]]) R.it[R.keys[q]].c.push("."); }
    R.F.push({rt:+performance.now().toFixed(1), t:+clock.toFixed(3), play:!!playing, pass:MLS.pass, mov:MLS.moving, fresh:MLS.fresh, dw:DWELL.st?DWELL.st.stage:null, on:on,
      tg:[+orbitTarget.x.toFixed(1),+orbitTarget.z.toFixed(1)], dist:+landCam.position.distanceTo(orbitTarget).toFixed(1)}); }
  return true;
};
(async()=>{
  const html=path.resolve(process.env.AUSTERLITZ_HTML||path.join(A.ROOT,"austerlitz-command-map.html"));
  const md5=crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex");
  const b=await A.launch(), t0=Date.now();
  const p=await A.open(b,[1600,900],{harness:false,transitions:true});
  await p.waitForTimeout(3000);
  const card0=await p.evaluate(()=>firstRunOpen);
  await p.keyboard.press("Escape");   /* real input: the first-run card closed where it stands (decision 118) */
  await p.waitForTimeout(1500);
  const card1=await p.evaluate(()=>firstRunOpen);
  const spec=Object.assign(JSON.parse(JSON.stringify(MO.VIEWS.hybrid)),{t:540});
  await p.evaluate(s=>window.__aus.apply(s),spec);
  await p.evaluate(()=>{ AUSTERLITZ_DEBUG.settle(90); freeCam=false; curVantage=null; setSpeed(0.5); requestRender(3); });
  await p.waitForTimeout(3000);   /* the page draws its frames and goes idle */
  await p.evaluate(OBS,NOGL);
  const s0=await A.state(p);
  await p.click("#play");   /* real input: Play */
  const w0=Date.now(); let last=null;
  while(Date.now()-w0<CAP*1000){ await p.waitForTimeout(2000); last=await p.evaluate(()=>({t:clock, n:window.__rt.n, playing:playing}));
    if(last.t>=TO||!last.playing) break; }
  await p.click("#play");   /* real input: Pause */
  const playWall=Date.now()-w0;
  await p.waitForTimeout(4000);
  const R=await p.evaluate(()=>{ var R=window.__rt, I={}; R.keys.forEach(function(k){ var r=R.it[k]; I[k]={cat:r.cat, fid:r.fid, codes:r.c.join("")}; });
    if(R.render) renderer.render=R.render;
    return {frames:R.F, items:I, err:R.err||null, mls:JSON.parse(JSON.stringify(MLS.stats))}; });
  const st=await A.state(p), errs=A.errors(p);
  const out={tool:"realtime.js", nogl:NOGL, build:path.basename(html), md5, chromium:b.version(), viewport:[1600,900], page:"visitor (no ?harness=1, transitions kept)",
    setup:"first-run card closed by a real Escape (open before: "+card0+", after: "+card1+"); VIEWS.hybrid applied at 09:00 via window.__aus.apply; Follow on (freeCam=false), speed 1/2x; Play and Pause by real clicks",
    to:TO, playWallMs:playWall, stateBefore:s0, stateAfter:st, console:errs, frames:R.frames, items:R.items, err:R.err, mls:R.mls, secs:Math.round((Date.now()-t0)/1000)};
  fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(out));
  const F=R.frames, pl=F.filter(f=>f.play), dts=pl.slice(1).map((f,i)=>f.rt-pl[i].rt).sort((a,b)=>a-b);
  console.log("real-time"+(NOGL?" (no GL draw)":"")+": "+F.length+" passes, "+pl.length+" while playing, clock "+(pl[0]?pl[0].t:"-")+" -> "+(pl.length?pl[pl.length-1].t:"-")+
    ", frame interval median "+(dts.length?dts[Math.floor(dts.length/2)].toFixed(0):"-")+" ms (p10 "+(dts.length?dts[Math.floor(dts.length*0.1)].toFixed(0):"-")+", p90 "+(dts.length?dts[Math.floor(dts.length*0.9)].toFixed(0):"-")+
    "), passes "+pl.filter(f=>f.pass).length+", play wall "+(playWall/1000).toFixed(0)+" s, console "+errs.length+", err "+R.err);
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
