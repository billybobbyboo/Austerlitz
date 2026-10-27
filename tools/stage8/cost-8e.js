#!/usr/bin/env node
/* Stage 8, implementation PR 8E (decisions 242 (a), 244 (a); docs/STAGE8_SPEC.md sections 8.4 and 17): what the gait and the kit's level of detail
   cost the CPU in a played stretch, measured on this machine (a container's CPU, software WebGL: the device's own cost is for the device route).
   On a page opened as the harness opens it (?harness=1, 1600 x 900), in four of the harness's views (tools/visual/cases.js: their eye and
   presentation, the clock set to T0), the stretch Play draws: the clock stepped as Play steps it at each speed, 60 steps a second, for N steps,
   each step's blocks posed, seated, given their level of detail and their gait (updateVisibility), no frame drawn. The dwell is off for the
   stretch, so every step is at the speed's nominal rate (a first version left it on: from 08:45, an event's start, the stretch sat in the
   dwell's hold, where nothing moves, for part of its steps, which understated a moving frame's cost). Per step:
   - the time in updateVisibility, in the seating (each block's layoutFigs), in kitLod and in gaitStep (the app's functions, wrapped);
   - the slopes' share (the drawn ground's slopes under each animated figure, layoutFigs), two ways: (a) timed, the same stretch played with the
     slopes and without them (GAIT.noSlopes, a measurement switch the app never sets), alternately, the seating's difference; (b) counted, the
     ground lookups (groundY calls) the seating makes with the slopes and without them (the seating's own: nothing else on the page reads the
     ground inside it), the difference times one lookup's own cost on this machine (timed in a tight loop over the stretch's own points),
     which no other work on the page can disturb;
   - the attributes the gait asks three to upload at the next frame: the slopes' (aSl) versions moved, their instances' bytes.
   (c) benched: each block that took the slopes in the stretch, seated with them and without them in tight loops, the difference a seating
   times its seatings that took them a frame (the timed difference of (a) is noise-bound on a shared machine: its pairs are reported).
   The animation's CPU (decision 244 (a)'s budget, docs/STAGE8_SPEC.md section 17: 0.2 ms a frame) is gaitStep's time plus the slopes' (the
   larger of the counted and the benched), apart from the level of detail's (kitLod) and from the seating 8D already did. Medians over the
   repetitions.
   node tools/stage8/cost-8e.js [<build.html>] [--json out.json] [--n 240] [--reps 5] [--t0 525] [--speeds 0.5,1]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), N=+(opt("--n")||240), REPS=+(opt("--reps")||5), T0=+(opt("--t0")||525), SPEEDS=(opt("--speeds")||"0.5,1").split(",").map(Number);
const html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html"));
const VIEWS=["pratzen-low","close-sokolnitz","overview-plan","overview-field"];
const inPage=function(a){
  var spec=Object.assign({},a.spec,{t:a.t0}); window.__aus.apply(spec); AUSTERLITZ_DEBUG.settle(30);
  var T={seat:0,lod:0,gait:0,upd:0}, cnt=0, rec=null, inL=0, took=null;
  Object.keys(units).forEach(function(id){ var u=units[id].block&&units[id].block.userData; if(!u||!u.layout||u.layout.__w) return; var f=u.layout;
    u.layout=function(p,q,r){ var t=performance.now(); inL++; try{ return f.call(this,p,q,r); } finally{ inL--; T.seat+=performance.now()-t; if(took&&u.slopeSeat&&!u.slopeStale) took[id]=(took[id]||0)+1; } }; u.layout.__w=f; });
  var kl=kitLod, gs=gaitStep, gy=groundY, don=DWELL.on;
  kitLod=function(r){ var t=performance.now(); try{ return kl(r); } finally{ T.lod+=performance.now()-t; } };
  gaitStep=function(r,i){ var t=performance.now(); try{ return gs(r,i); } finally{ T.gait+=performance.now()-t; } };
  var slMeshes=[]; Object.keys(units).forEach(function(id){ var b=units[id].block; if(b) b.traverse(function(o){ if(o.isInstancedMesh&&o.geometry.attributes.aSl) slMeshes.push(o); }); });
  var slVer=function(){ var v=0, by=0; slMeshes.forEach(function(m){ var A=m.geometry.attributes.aSl; v+=A.version; }); return v; };
  function run(noSl,counting,keep){ GAIT.noSlopes=noSl; setClock(a.t0,{instant:true,force:true,camera:false}); AUSTERLITZ_DEBUG.settle(10);
    T.seat=T.lod=T.gait=T.upd=0; cnt=0; rec=keep?[]:null;
    if(counting) groundY=function(x,z){ if(inL){ cnt++; if(rec&&rec.length<400000) rec.push(x,z); } return gy(x,z); };   /* the seating's lookups only */
    var up=0, upB=0, sb0=SEAT_STATS.blocks, ss0=SEAT_STATS.slopes||0;
    playing=true; speed=a.x; FK=1; DWELL.on=false; DWELL.st=null;   /* the dwell off: every step at the speed's nominal rate (a stretch from an event's start sat in its hold) */
    for(var i=0;i<a.n;i++){ var nt=dwellAdvance(1/60,MIN_PER_SEC*speed); setClock(nt);
      var v0=slMeshes.map(function(m){ return m.geometry.attributes.aSl.version; });
      var t=performance.now(); updateVisibility(); T.upd+=performance.now()-t;
      slMeshes.forEach(function(m,j){ var A=m.geometry.attributes.aSl; if(A.version!==v0[j]){ up++; upB+=A.array.byteLength; } }); }
    playing=false; DWELL.on=don; DWELL.st=null; if(counting) groundY=gy;
    return {upd:T.upd/a.n, seat:T.seat/a.n, lod:T.lod/a.n, gait:T.gait/a.n, calls:cnt/a.n, uploads:up/a.n, uploadKB:upB/a.n/1024,
      seatings:(SEAT_STATS.blocks-sb0)/a.n, slopeSeatings:((SEAT_STATS.slopes||0)-ss0)/a.n}; }
  var A=[], B=[], CA=null, CB=null, pts=null;
  try{
    run(false,false,false); run(true,false,false);   /* a warm-up of each, so that neither counted run is the page's first */
    took={}; CA=run(false,true,true); pts=rec; rec=null; var tookA=took; took=null; CB=run(true,true,false);
    for(var k=0;k<a.reps;k++){ A.push(run(false,false,false)); B.push(run(true,false,false)); }
  } finally { GAIT.noSlopes=false; kitLod=kl; gaitStep=gs; groundY=gy; playing=false; DWELL.on=don; DWELL.st=null;
    Object.keys(units).forEach(function(id){ var u=units[id].block&&units[id].block.userData; if(u&&u.layout&&u.layout.__w) u.layout=u.layout.__w; }); }
  /* (c) benched: each block that took the slopes in the counted stretch, seated with the slopes and without them in tight loops (50 seatings
     each, alternately, five rounds, the best of each), the difference a seating, times the seatings that took the slopes a frame */
  var bench=0, nB=0;
  Object.keys(tookA).forEach(function(id){ var u=units[id].block.userData, f=u.layout.__w||u.layout, bA=1e9, bB=1e9;
    for(var r=0;r<5;r++){ var t=performance.now(); for(var i=0;i<50;i++) f(u.sw,u.sd,true); bA=Math.min(bA,(performance.now()-t)/50);
      GAIT.noSlopes=true; t=performance.now(); for(var i2=0;i2<50;i2++) f(u.sw,u.sd); bB=Math.min(bB,(performance.now()-t)/50); GAIT.noSlopes=false; }
    f(u.sw,u.sd); bench+=Math.max(0,bA-bB)*tookA[id]/a.n; nB++; });
  /* one lookup's own cost, over the stretch's own points (the best of nine passes) */
  var m=pts.length/2, s=0, best=1e9;
  for(var r=0;r<9;r++){ var t=performance.now(); for(var i=0;i<m;i++) s+=gy(pts[2*i],pts[2*i+1]); var d=(performance.now()-t)/m; if(d<best) best=d; }
  var med=function(Lst,f){ var q=Lst.map(function(o){ return o[f]; }).sort(function(p,w){ return p-w; }); return q[Math.floor(q.length/2)]; };
  var o={x:a.x, t0:a.t0, frames:a.n, reps:a.reps, sink:isFinite(s)};
  ["upd","seat","lod","gait"].forEach(function(f){ o[f]=[+med(A,f).toFixed(4),+med(B,f).toFixed(4)]; });
  o.slopeLookups=[+CA.calls.toFixed(1),+CB.calls.toFixed(1)]; o.lookupUs=+(best*1000).toFixed(4);
  o.slopeMsCounted=+((CA.calls-CB.calls)*best).toFixed(4); o.slopeMsTimed=+(o.seat[0]-o.seat[1]).toFixed(4);
  o.slopeMsTimedPairs=A.map(function(p,i){ return +(p.seat-B[i].seat).toFixed(4); });
  o.slopeMsBench=+bench.toFixed(4); o.benchBlocks=nB;
  o.uploads=+CA.uploads.toFixed(2); o.uploadKB=+CA.uploadKB.toFixed(2); o.seatings=+CA.seatings.toFixed(2); o.slopeSeatings=+CA.slopeSeatings.toFixed(2);
  o.animationMs=+(o.gait[0]+Math.max(o.slopeMsCounted,o.slopeMsBench)).toFixed(4); o.lodMs=o.lod[0];
  var mv=0; Object.keys(units).forEach(function(id){ var G=units[id].block&&units[id].block.userData.gait; if(G&&G.amp>0) mv++; }); o.animatedAtEnd=mv;
  return o;
};
(async()=>{
  const res={build:path.basename(html), md5:crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex"), n:N, reps:REPS, t0:T0, views:{}};
  process.env.AUSTERLITZ_HTML=html;
  const browser=await L.launch(); res.chromium=browser.version();
  for(const v of VIEWS){
    const spec=L.byName(v); res.views[v]={};
    for(const x of SPEEDS){
      const page=await L.open(browser,spec.viewport,{}); await page.evaluate(()=>closeFirst(null));
      const r=await page.evaluate(inPage,{spec, t0:T0, x, n:N, reps:REPS}); await page.close();
      res.views[v][x+"x"]=r;
      console.log(v+" at "+x+"x: gaitStep "+r.gait[0]+" ms, the slopes "+r.slopeMsCounted+" ms counted ("+(r.slopeLookups[0]-r.slopeLookups[1]).toFixed(0)+" lookups of "+r.lookupUs+" us), "+r.slopeMsBench+" ms benched ("+r.benchBlocks+" blocks), "+
        r.slopeMsTimed+" ms timed (pairs "+r.slopeMsTimedPairs.join(", ")+"): the animation "+r.animationMs+" ms a frame; kitLod "+r.lodMs+" ms; the seating "+r.seat[0]+" ms (without the slopes "+r.seat[1]+
        "); updateVisibility "+r.upd[0]+" ms; "+r.seatings+" seatings a frame, "+r.slopeSeatings+" taking the slopes; "+r.uploads+" slope attributes uploaded a frame ("+r.uploadKB+" KB); "+r.animatedAtEnd+" formations animated");
      if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(path.resolve(OUT),JSON.stringify(res,null,1)); }
    }
  }
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
