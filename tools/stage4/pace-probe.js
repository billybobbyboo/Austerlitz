#!/usr/bin/env node
/* Stage 4 Part A (docs/STAGE4_SPEC.md section D): pacing, measured on the built page. The probe reads the running page and moves
   its landscape camera along two rules over the whole day (measurement code, not the Stage 4 implementation); it changes no
   source file. node tools/stage4/pace-probe.js [--json out.json]

   1. The clock as it plays (fact, from the page's own constants and data): MIN_PER_SEC, the speeds, TRANS_MS; each phase's and
      each event's duration in seconds at each speed; the share of each phase that the phase change's camera glide takes; the
      events whose start falls inside that glide.
   2. Two camera rules over the day, Study at 1600 x 900, the default display factor, at 1x and at 0.5x, the clock stepped one
      minute at a time:
        today  (Follow on, Stage 3D): at each phase boundary the eye glides to the phase's authored view (presetFrame) over
               TRANS_MS, through the app's own setupArc and applyArc; otherwise it stands still;
        follow (a candidate for Stage 4's continuous follow): the target eased toward the weighted centre of the live events
               (liveEvents, the app's own weights), with a time constant of 1.5 s of real time; the distance eased toward one that
               holds their spread (2.4 x the weighted radius + 70 units, kept in 86-274); the direction eased toward the current
               phase's authored view; the floor applied (clampCamera).
      Per rule: the share of clock minutes in which every live event of weight >= 0.5 lies inside the free rectangle (and the
      share of those events, minute by minute), the eye's clearance and the floor's clamps, the ground's speed across the screen
      at the free centre (px per real second: the target's move divided by worldPerPx there), and every 10 clock minutes the map
      layer's drops (mlLayout on the formations as placed at that minute). */
const fs=require("fs"), path=require("path");
const {launch,open,settle,CASES,ROOT}=require("../stage2/page.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const OUT=opt("--json")||path.join(ROOT,"docs","stage4-evidence","pace-probe.json");

const PROBE=function(){
  var P={};
  P.constants=function(){ return {MIN_PER_SEC:MIN_PER_SEC,speeds:[].map.call(document.querySelectorAll(".spd-btn"),function(b){ return +b.dataset.s; }),TRANS_MS:TRANS_MS,T_MIN:T_MIN,T_MAX:T_MAX,
    phases:PHASES.map(function(p){ return {id:p.id,label:p.label,t0:p.t0,t1:p.t1}; }),
    events:EVENTS.map(function(e){ var w=evWindow(e); return {id:e.id,t0:w[0],t1:w[1],kind:e.kind,phase:phaseAt(w[0])}; })}; };
  var v=new THREE.Vector3();
  function onFree(p,fr){ v.set(p[0],p[1],p[2]).project(landCam); if(v.z>1||v.z<-1) return false; var W=renderer.domElement.clientWidth||innerWidth, H=viewH();
    var x=(v.x*0.5+0.5)*W, y=(-v.y*0.5+0.5)*H; return x>=fr[0]&&x<=fr[2]&&y>=fr[1]&&y<=fr[3]; }
  function evPt(e){ var w=W(e.p[0],e.p[1]); return [w[0],groundY(w[0],w[1]),w[1]]; }
  /* run one rule over the day; speed: the playback speed (1 = 10 clock minutes a second) */
  P.run=function(rule,speed,layerEvery){
    syncViewOffset(true); var fr=landFreeRect(), dtReal=1/(MIN_PER_SEC*speed), glideMin=TRANS_MS/1000*MIN_PER_SEC*speed;
    var res={rule:rule,speed:speed,minutes:0,allLive:0,liveSeen:0,liveTotal:0,minClear:1e9,clamps0:CAM.clamps,px:[],drops:[],moves:0};
    var ph=-1, arc=null, arcT0=0, T=null, dist=null, dir=null;
    function camOf(p){ var c=presetFrame(PHASES[p].cam); return c; }
    var c0=camOf(0); landCam.position.set(c0[0],c0[1],c0[2]); orbitTarget.set(c0[3],c0[4],c0[5]); landCam.lookAt(orbitTarget); clampCamera();
    for(var t=T_MIN;t<=T_MAX;t+=1){
      var p=phaseAt(t), prevT=orbitTarget.clone();
      if(rule==="today"){
        if(p!==ph){ if(ph>=0){ var c=camOf(p); arc=setupArc(landCam.position,orbitTarget,new THREE.Vector3(c[0],c[1],c[2]),new THREE.Vector3(c[3],c[4],c[5])); arcT0=t; res.moves++; } ph=p; }
        if(arc){ var k=Math.min(1,(t-arcT0)/glideMin); applyArc(arc,easeInOut(k)); if(k>=1) arc=null; }
      } else {
        var L=liveEvents(t), sw=0, cx=0, cz=0;
        L.forEach(function(o){ var q=evPt(o.e); cx+=q[0]*o.w; cz+=q[2]*o.w; sw+=o.w; });
        var c2=camOf(p), dGoal=new THREE.Vector3(c2[0]-c2[3],c2[1]-c2[4],c2[2]-c2[5]).normalize();
        if(sw>0){ cx/=sw; cz/=sw; var rad=0; L.forEach(function(o){ var q=evPt(o.e); rad+=o.w*Math.hypot(q[0]-cx,q[2]-cz); }); rad/=sw;
          var goal=new THREE.Vector3(cx,groundY(cx,cz),cz), dg=Math.max(86,Math.min(274,2.4*rad+70)); }
        else { goal=T?T.clone():new THREE.Vector3(c2[3],c2[4],c2[5]); dg=dist||Math.hypot(c2[0]-c2[3],c2[1]-c2[4],c2[2]-c2[5]); }
        if(!T){ T=goal.clone(); dist=dg; dir=dGoal.clone(); }
        var a=1-Math.exp(-dtReal/1.5);
        T.lerp(goal,a); T.y=groundY(T.x,T.z); dist+=(dg-dist)*a; dir.lerp(dGoal,a).normalize();
        orbitTarget.copy(T); landCam.position.copy(T).addScaledVector(dir,dist); landCam.lookAt(orbitTarget); if(clampCamera()) res.moves++;
      }
      landCam.updateMatrixWorld(true);
      var cl=landCam.position.y-camGround(landCam.position.x,landCam.position.z); if(cl<res.minClear) res.minClear=cl;
      var live=liveEvents(t).filter(function(o){ return o.w>=0.5; }), seen=0;
      live.forEach(function(o){ if(onFree(evPt(o.e),fr)) seen++; });
      res.minutes++; res.liveTotal+=live.length; res.liveSeen+=seen; if(live.length&&seen===live.length) res.allLive++; else if(!live.length) res.allLive++;
      var mv=orbitTarget.distanceTo(prevT); if(t>T_MIN) res.px.push(mv/Math.max(1e-6,worldPerPx(orbitTarget))/dtReal);
      if(layerEvery&&t%layerEvery===0){ clock=t; setClock(t,{instant:true,force:true,camera:false}); for(var s=0;s<30;s++){ settling=false; updateVisibility(); } mlLayout(); res.drops.push([t,ML.stats.dropped,ML.stats.placed]); }
    }
    res.clamps=CAM.clamps-res.clamps0; delete res.clamps0;
    res.px.sort(function(a,b){ return a-b; }); var q=function(f){ return +res.px[Math.floor(f*(res.px.length-1))].toFixed(1); };
    res.screenSpeed={p50:q(0.5),p95:q(0.95),max:q(1)}; delete res.px;
    res.allLiveShare=+(res.allLive/res.minutes).toFixed(3); res.liveSeenShare=+(res.liveSeen/Math.max(1,res.liveTotal)).toFixed(3); res.minClear=+res.minClear.toFixed(2);
    var d=res.drops.map(function(x){ return x[1]; }); res.dropStats={samples:d.length,max:Math.max.apply(null,d),mean:+(d.reduce(function(a,b){ return a+b; },0)/d.length).toFixed(2)};
    return res; };
  window.__pace=P; return true;
};

(async()=>{
  const browser=await launch(), out={when:new Date().toISOString()};
  const page=await open(browser,[1600,900]);
  await page.evaluate(PROBE.toString().replace(/^function\s*\(\)\s*\{/,"(function(){")+")()");
  /* Study, the default factor, Follow on, no selection: as a visitor who presses Play */
  await page.evaluate(s=>window.__aus.apply(s),{name:"pace",viewport:[1600,900],t:240,presentation:"study",mode:"terrain",cam:[-230,132,211,-28,0,1]}); await settle(page);
  const K=await page.evaluate(()=>__pace.constants()); out.constants=K;
  /* 1. the clock: durations at each speed (derived from the constants) */
  const sec=(min,s)=>+(min/(K.MIN_PER_SEC*s)).toFixed(1);
  out.day={minutes:K.T_MAX-K.T_MIN,seconds:Object.fromEntries(K.speeds.map(s=>[s+"x",sec(K.T_MAX-K.T_MIN,s)]))};
  out.phases=K.phases.map(p=>{ const m=p.t1-p.t0, gl=K.TRANS_MS/1000*K.MIN_PER_SEC, inGlide=K.events.filter(e=>e.t0>=p.t0&&e.t0<p.t0+gl&&e.t0<p.t1).map(e=>e.id);
    return {id:p.id,label:p.label,minutes:m,seconds:Object.fromEntries(K.speeds.map(s=>[s+"x",sec(m,s)])),glideShare1x:+Math.min(1,gl/m).toFixed(2),eventsStarting:K.events.filter(e=>e.t0>=p.t0&&e.t0<p.t1).length,startInGlide1x:inGlide}; });
  out.events=K.events.map(e=>({id:e.id,kind:e.kind,phase:e.phase,minutes:e.t1-e.t0,seconds1x:sec(e.t1-e.t0,1)}));
  out.phases.forEach(p=>console.log("phase",p.id,p.label.padEnd(12),p.minutes,"min",JSON.stringify(p.seconds),"glide",p.glideShare1x,"events",p.eventsStarting,"in glide",p.startInGlide1x.join(",")));
  console.log("day",JSON.stringify(out.day));
  /* 2. the two rules */
  out.rules={};
  for(const speed of [1,0.5]) for(const rule of ["today","follow"]){
    const r=await page.evaluate(([rule,speed])=>__pace.run(rule,speed,10),[rule,speed]);
    out.rules[rule+"@"+speed+"x"]=r; console.log(rule.padEnd(7),speed+"x",JSON.stringify(r).slice(0,600));
    fs.writeFileSync(OUT,JSON.stringify(out,null,1));
  }
  if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  fs.writeFileSync(OUT,JSON.stringify(out,null,1)); await browser.close();
})().catch(e=>{ console.error(e); process.exit(2); });
