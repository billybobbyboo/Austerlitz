#!/usr/bin/env node
/* Stage 4D (docs/STAGE4_SPEC.md sections D and I): pacing as the build plays it. It reads the running page and drives the clock and
   the camera through the app's own functions (tickClock, followStep, dwellAdvance, drawOnArrows); it changes no source file.
   node tools/stage4/report-4d.js [--json out.json] [--md out.md] [--before before.json]
   AUSTERLITZ_HTML=<build> measures another build (the 4C build, before 4D: section D.2's "today" rule, the phase glide).

   1. The day's length at each speed (on a 4D build with its dwells, the computed and a dry run), and each phase's seconds at 1/2x.
   2. Section D.2's table on the build: Study at 1600 x 900, the default factor, Follow on, the clock played at 1/2x and 1x from
      04:00 to 18:00 in steps of 50 ms of real time. On a 4D build, the implementation (the continuous follow and the dwells); on a
      build before it, the phase glide as Stage 3D drew it (setClock's own startPhaseTransition, its tween run in real time).
      Per run: the share of clock minutes with every live event (weight >= 0.5) inside the free rectangle and the share of live
      event-minutes inside it; the target's speed across the screen (px per real second at the target, before the step); the
      floor's clamps and the lowest clearance; every 10 clock minutes the map layer's drops.
   3. The draw-on (a 4D build): for each derived arrow, at 20 clocks inside its legs, the distance of its drawn end from the
      formation; and in every landscape and paper-map harness view, the derived arrows drawn whole, drawn in part and not yet
      drawn, with the map layer's drops. */
const fs=require("fs"), path=require("path");
const {launch,open,settle,CASES}=require("../stage2/page.js");
const T=require("../visual/thresholds.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const PROBE=function(){
  var P={}, v=new THREE.Vector3();
  P.is4d=typeof DWELL!=="undefined";
  function onFree(p,fr){ v.set(p[0],p[1],p[2]).project(landCam); if(v.z>1||v.z<-1) return false; var Wd=renderer.domElement.clientWidth||innerWidth, H=viewH();
    var x=(v.x*0.5+0.5)*Wd, y=(-v.y*0.5+0.5)*H; return x>=fr[0]&&x<=fr[2]&&y>=fr[1]&&y<=fr[3]; }
  P.lengths=function(){ if(!P.is4d) return null; var o={};
    [0.5,1,2,4].forEach(function(x){ o[x+"x"]=+dwellDayLength(T_MIN,x).toFixed(1); });
    var ph=PHASES.map(function(p,i){ var v2=MIN_PER_SEC*0.5, S=dwellStarts(), L=(p.t1-p.t0)/v2, n=0;
      S.forEach(function(t,k){ if(t>p.t0&&t<p.t1||(t===p.t0&&i>0)){ L+=DWELL.HOLD+2*dwellReach(k,v2)/v2; n++; } });
      return {id:p.id,label:p.label,minutes:p.t1-p.t0,seconds:+L.toFixed(1),dwells:n}; });
    return {day:o,phases:ph,starts:dwellStarts().length}; };
  P.run=function(x,stepMs){
    var sp=speed, real=0, n=0, c=presetFrame(PHASES[0].cam), fr=landFreeRect(), R={minutes:0,allLive:0,liveSeen:0,liveTotal:0,px:[],drops:[],minClear:1e9,clamps0:CAM.clamps};
    setSpeed(x); stopPlay(); setClock(T_MIN,{instant:true,force:true,camera:false}); AUSTERLITZ_DEBUG.settle(2,true);
    landCam.position.set(c[0],c[1],c[2]); orbitTarget.set(c[3],c[4],c[5]); landCam.lookAt(orbitTarget); clampCamera(); syncViewOffset(true);
    freeCam=false; playing=true; if(P.is4d){ dwellReset(); FOLLOW.T=null; FOLLOW.ev=null; }
    var last=-1, now=performance.now();
    while(playing&&n<200000){ var pT=orbitTarget.clone(), pW=worldPerPx(orbitTarget);
      now+=stepMs; if(tween) tween(now); tickClock(stepMs); if(P.is4d) followStep(stepMs); real+=stepMs; n++;
      R.px.push(Math.hypot(orbitTarget.x-pT.x,orbitTarget.z-pT.z)/pW/(stepMs/1000));
      var cl=landCam.position.y-camGround(landCam.position.x,landCam.position.z); if(cl<R.minClear) R.minClear=cl;
      var m=Math.floor(clock); if(m===last) continue; last=m; R.minutes++; landCam.updateMatrixWorld(true);
      var live=liveEvents(clock).filter(function(o){ return o.w>=0.5; }), seen=0;
      live.forEach(function(o){ var w=W(o.e.p[0],o.e.p[1]); if(onFree([w[0],groundY(w[0],w[1]),w[1]],fr)) seen++; });
      R.liveTotal+=live.length; R.liveSeen+=seen; if(seen===live.length) R.allLive++;
      if(m%10===0){ for(var k=0;k<12;k++){ settling=false; updateVisibility(); } mlLayout(); R.drops.push([m,ML.stats.dropped]); } }
    stopPlay(); setSpeed(sp);
    R.px.sort(function(a,b){ return a-b; }); var q=function(f){ return +R.px[Math.floor(f*(R.px.length-1))].toFixed(1); };
    var d=R.drops.map(function(z){ return z[1]; });
    return {speed:x,seconds:+(real/1000).toFixed(1),allLiveShare:+(R.allLive/R.minutes).toFixed(3),liveSeenShare:+(R.liveSeen/Math.max(1,R.liveTotal)).toFixed(3),
      screenSpeed:{p50:q(0.5),p95:q(0.95),max:q(1)},clamps:CAM.clamps-R.clamps0,minClear:+R.minClear.toFixed(1),
      drops:{mean:+(d.reduce(function(a,b){ return a+b; },0)/d.length).toFixed(2),max:Math.max.apply(null,d)}}; };
  P.drawOn=function(){ if(!P.is4d) return null; var keep=clock, out=[];
    for(var ph=0;ph<PHASES.length;ph++){ rebuildOverlays(ph,true);
      DRAWON.slice().forEach(function(d){ var A=anchorList(d.a.leg[0]), i0=-1, i1=-1; A.forEach(function(q,k){ if(q.ph===d.a.leg[1]&&i0<0) i0=k; if(q.ph===d.a.leg[2]&&i0>=0) i1=k; });
        var w0=legWindow(A[i0],A[i0+1])[0], w1=legWindow(A[i1-1],A[i1])[1], worst=0;
        for(var k=1;k<=20;k++){ var t=w0+(w1-w0)*k/21; clock=t; drawOnArrows(); var L=legAt(d.a.leg[0],t); if(!L||!L.b||L.u<=0||!d.tip) continue;
          var q=posAtClock(d.a.leg[0],t), w=W(q[0],q[1]); worst=Math.max(worst,Math.hypot(d.tip[0]-w[0],d.tip[1]-w[1])); }
        out.push({phase:ph,label:d.a.label,leg:d.a.leg,window:[w0,w1],worst:+worst.toFixed(3),length:+d.r.len.toFixed(1)}); }); }
    clock=keep; rebuildOverlays(phaseAt(keep),true); setClock(keep,{instant:true,force:true,camera:false});
    return out; };
  P.view=function(){ mlLayout(); var o={dropped:ML.stats.dropped,placed:ML.stats.placed};
    if(P.is4d){ var w=0,p=0,h=0; DRAWON.forEach(function(d){ if(d.s>=1) w++; else if(d.s>0) p++; else h++; }); o.arrows={whole:w,part:p,notYet:h}; }
    else { var n=0; (OVERLAYS[curPhase].arrows||[]).forEach(function(a){ if(a.leg) n++; }); o.arrows={whole:n,part:0,notYet:0}; }
    return o; };
  window.__p4=P; return true;
};
(async()=>{
  const browser=await launch(), out={html:process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html",when:new Date().toISOString()};
  const page=await open(browser,[1600,900]); const OUT=opt("--json");
  await page.evaluate(PROBE.toString().replace(/^function\s*\(\)\s*\{/,"(function(){")+")()");
  /* the harness views: derived arrows and drops */
  out.views={};
  for(const c of CASES.filter(c=>!c.fresh&&!c.interact&&c.viewport[0]===1600)){
    await page.evaluate(s=>window.__aus.apply(s),c); await settle(page);
    out.views[c.name]=Object.assign(await page.evaluate(()=>__p4.view()),{dropLimit:T.DROP_LIMIT[c.name]});
    console.log(c.name.padEnd(22),JSON.stringify(out.views[c.name])); }
  await page.evaluate(s=>window.__aus.apply(s),{name:"pace",viewport:[1600,900],t:240,presentation:"study",mode:"terrain",cam:[-230,132,211,-28,0,1]}); await settle(page);
  out.is4d=await page.evaluate(()=>__p4.is4d);
  out.lengths=await page.evaluate(()=>__p4.lengths()); console.log("lengths",JSON.stringify(out.lengths));
  out.drawOn=await page.evaluate(()=>__p4.drawOn()); if(out.drawOn) console.log("draw-on: worst",Math.max(...out.drawOn.map(r=>r.worst)));
  out.rules={};
  for(const x of [0.5,1]){ out.rules[x+"x"]=await page.evaluate(x=>__p4.run(x,50),x); console.log("run",x,JSON.stringify(out.rules[x+"x"])); if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1)); }
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
  if(opt("--md")&&opt("--before")){
    const B=JSON.parse(fs.readFileSync(opt("--before"),"utf8")), md=["# Stage 4D: pacing, against the build before it ("+B.html+")\n","`node tools/stage4/report-4d.js` on each build.\n","## Section D.2's table, as built\n",
      "Study at 1600 x 900, the default factor, Follow on, played from 04:00 to 18:00 in 50 ms steps of real time. Before 4D: the phase glide (Stage 3D); 4D: the continuous follow and the dwells.\n",
      "| build @ speed | the day, s | minutes with every live event in the free rectangle | live event-minutes in it | target's speed px/s: median / 95th / largest | floor clamps; lowest clearance | drops every 10 min: mean / largest |","|---|---|---|---|---|---|---|"];
    const row=(lab,r)=>md.push("| "+lab+" | "+r.seconds+" | "+(100*r.allLiveShare).toFixed(1)+"% | "+(100*r.liveSeenShare).toFixed(1)+"% | "+r.screenSpeed.p50+" / "+r.screenSpeed.p95+" / "+r.screenSpeed.max+" | "+r.clamps+"; "+r.minClear+" | "+r.drops.mean+" / "+r.drops.max+" |");
    ["0.5x","1x"].forEach(k=>{ row("before @"+k,B.rules[k]); row("4D @"+k,out.rules[k]); });
    if(out.lengths){ md.push("\n## The day's length\n","Computed from the dwells as built (the self-test and `runtime-test.js` check a dry run against it). "+out.lengths.starts+" distinct event starts; the one at 04:00 is where Play begins and does not dwell.\n",
      "| speed | "+Object.keys(out.lengths.day).join(" | ")+" |","|---|"+Object.keys(out.lengths.day).map(()=>"---|").join(""),"| the day, s | "+Object.values(out.lengths.day).join(" | ")+" |",
      "\n| phase | minutes | seconds at ½× (with its dwells) | dwells |","|---|---|---|---|");
      out.lengths.phases.forEach(p=>md.push("| "+p.id+" "+p.label+" | "+p.minutes+" | "+p.seconds+" | "+p.dwells+" |")); }
    if(out.drawOn){ md.push("\n## The draw-on\n","Each derived arrow at 20 clocks inside its legs: the largest distance of its drawn end from the formation (units; the self-test's limit 0.5).\n","| phase | arrow | leg | clocks | length | worst |","|---|---|---|---|---|---|");
      out.drawOn.forEach(r=>md.push("| "+r.phase+" | "+r.label+" | "+r.leg.join(" ")+" | "+r.window.map(t=>String(Math.floor(t/60)).padStart(2,"0")+":"+String(Math.round(t%60)).padStart(2,"0")).join("-")+" | "+r.length+" | "+r.worst+" |")); }
    md.push("\n## The harness views\n","Derived arrows drawn whole / in part / not yet; the map layer's drops against the view's limit.\n","| view | before: arrows; drops | 4D: arrows; drops | limit |","|---|---|---|---|");
    Object.keys(out.views).forEach(k=>{ const a=out.views[k], b=B.views[k]||{}; const f=r=>r&&r.arrows?r.arrows.whole+" / "+r.arrows.part+" / "+r.arrows.notYet+"; "+r.dropped:"-"; md.push("| "+k+" | "+f(b)+" | "+f(a)+" | "+(a.dropLimit===undefined?"-":a.dropLimit)+" |"); });
    fs.writeFileSync(opt("--md"),md.join("\n")+"\n"); }
  if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(2); });
