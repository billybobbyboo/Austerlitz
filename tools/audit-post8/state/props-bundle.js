/* audit-post8 (state): property checks that drive the built app itself (bundle.js of an isolated copy) in runtime-test.js's stubbed THREE +
   DOM environment (its own prelude, tools/audit-post8/state/load-bundle.js). Read-only on the repository. Takes about 3.5 minutes to load
   (buildWorld in the stubs) and a few minutes to run.
   Usage: node props-bundle.js <iso-root>  > out.txt
   Each block prints its own lines; a block that throws prints THREW and the others still run.
   B1  Play's own advance (tickClock) over the whole day at 1/2x, 1x, 2x and 4x, the dwell on, 60 frames a second: the clock never goes back,
       never NaN, holds once at every distinct event start after the first minute for DWELL.HOLD, ends at T_MAX with Play stopped; the real time
       against dwellDayLength; the largest change of rate between two frames
   B2  a change of speed inside a dwell (each stage, each pair of 1/2x and 4x): the clock continuous, the hold its full length, the rate after the
       ease out the new speed's
   B3  pause and resume inside a dwell's ease in, hold and ease out
   B4  a theme (setChapter, the theme button's own call) chosen while the clock plays: does the clock stop, as app.js:8827 says?
   B5  Play at 4x across phase boundaries, the dwell off: the overlays' fade (TRANS_MS) against the phase's length; the outgoing group's
       opacity before and after the next boundary (a pop back to 0.9 when the fade was cut short)
   B6  the reading ("Whose eyes?") within a clock minute: knowledgeOf at m+0.9 reached through m+0.1 against reached from the minute before
   B7  Play to the end, then Play again
   B8  the phone's speed button (speedNext) through its four speeds
   B9  the first frame after the page went idle: dt held at 120 ms, the clock's step on Play from idle at each speed
   B10 overlays and groups after many phase changes (no growth)
   B11 the clock at exact boundaries: setClock(NaN), setClock(+-Infinity), and the slider's toClock with a zero-width rail
   B12 seeks counted (GAIT.seek) on every move but Play's own advance */
const AU_fs=require('fs'), AU_Module=require('module'), AU_path=require('path');
const AU_ISO=AU_path.resolve(process.argv[2]||'.'); process.chdir(AU_ISO);
require=AU_Module.createRequire(AU_ISO+'/runtime-test.js');
const AU_LOG=(...a)=>process.stdout.write(a.join(' ')+'\n');
const AU_tLoad=Date.now();
eval(require(AU_path.join(__dirname,'load-bundle.js')).prelude(AU_ISO));
AU_LOG(`loaded the bundle in ${((Date.now()-AU_tLoad)/1000).toFixed(0)} s; init errors ${errs.length} ${errs.slice(0,2).join(' | ')}; warnings ${warns.length}`);
console.warn=(...a)=>warns.push(a.join(' ')); console.error=(...a)=>errs.push(a.join(' '));
let AU_T=1e7; const AU_realNow=performance.now; performance.now=()=>AU_T;
function AU_block(name,fn){ const t0=Date.now(); AU_LOG(`\n=== ${name}`); try{ fn(); }catch(e){ AU_LOG('THREW '+e.message+'\n'+(e.stack||'').split('\n').slice(1,5).join('\n')); } AU_LOG(`(${((Date.now()-t0)/1000).toFixed(1)} s)`); }
const AU_DT=1000/60;
closeFirst(null);
const AU_STARTS=dwellStarts().slice();
AU_LOG(`dwell starts (${AU_STARTS.length}): ${AU_STARTS.map(fmtClock).join(' ')}; HOLD ${DWELL.HOLD} s, EASE ${DWELL.EASE} s; T_MIN ${T_MIN} T_MAX ${T_MAX}`);

/* B1 */
AU_block('B1 Play over the whole day, the dwell on',()=>{
  [0.5,1,2,4].forEach(x=>{
    stopPlay(); dwellSet(true); setSpeed(x); setClock(T_MIN,{instant:true,force:true}); togglePlay();
    let frames=0, prev=clock, back=0, nan=0, holds=[], cur=null, maxDr=0, prevRate=null, v=MIN_PER_SEC*x, phaseChanges=0, lastPh=curPhase;
    while(playing&&frames<200000){
      AU_T+=AU_DT; tickClock(AU_DT); frames++;
      if(!Number.isFinite(clock)) nan++;
      if(clock<prev-1e-12) back++;
      const rate=(clock-prev)/(AU_DT/1000);
      if(prevRate!==null&&playing) maxDr=Math.max(maxDr,Math.abs(rate-prevRate)/v);
      prevRate=rate;
      if(DWELL.st&&DWELL.st.stage==='hold'){ if(!cur||cur.E!==DWELL.st.E){ cur={E:DWELL.st.E,frames:0,clockOK:true}; holds.push(cur); } cur.frames++; if(Math.abs(clock-cur.E)>1e-9) cur.clockOK=false; }
      if(curPhase!==lastPh){ phaseChanges++; lastPh=curPhase; }
      prev=clock; }
    const want=AU_STARTS.filter(s=>s>T_MIN+1e-9&&s<T_MAX), got=holds.map(h=>h.E), miss=want.filter(s=>!got.includes(s)), dup=got.filter((s,i)=>got.indexOf(s)!==i);
    const holdS=holds.map(h=>h.frames*AU_DT/1000), badHold=holds.filter(h=>Math.abs(h.frames*AU_DT/1000-DWELL.HOLD)>2*AU_DT/1000||!h.clockOK);
    const real=frames*AU_DT/1000, ref=dwellDayLength(T_MIN,x);
    AU_LOG(`  ${x}x: ${frames} frames, ${real.toFixed(2)} s real (dwellDayLength ${ref.toFixed(2)} s, diff ${(real-ref).toFixed(3)} s); clock ends ${clock} playing ${playing}; backwards ${back}; NaN ${nan}; phase changes ${phaseChanges}`);
    AU_LOG(`      holds ${holds.length} of ${want.length} starts; missed ${miss.map(fmtClock).join(',')||'none'}; repeated ${dup.map(fmtClock).join(',')||'none'}; hold lengths ${Math.min(...holdS).toFixed(3)}-${Math.max(...holdS).toFixed(3)} s; off-length or moving ${badHold.length}; largest rate change between frames ${maxDr.toFixed(3)} x the speed`);
  });
});

/* B2 */
AU_block('B2 a change of speed inside a dwell',()=>{
  const E=AU_STARTS.find(s=>s>600);   /* a start mid-morning */
  const pairs=[[4,0.5],[0.5,4],[4,1],[1,4]];
  ['in','hold','out'].forEach(stage=>pairs.forEach(([a,b])=>{
    stopPlay(); dwellSet(true); setSpeed(a); setClock(E-30,{instant:true,force:true}); togglePlay();
    let g=0; while(playing&&g++<100000){ AU_T+=AU_DT; tickClock(AU_DT); if(DWELL.st&&DWELL.st.E===E&&DWELL.st.stage===stage&&DWELL.st.tau>=(stage==='hold'?DWELL.HOLD:DWELL.st.te)*0.4) break; }
    const c0=clock, st0=Object.assign({},DWELL.st);
    setSpeed(b);   /* the speed button's own call */
    let prev=clock, maxStep=0, holdF=0, exitRate=null, f=0, prevC=clock, sawStage=st0.stage;
    while(playing&&f++<200000){ AU_T+=AU_DT; tickClock(AU_DT); const step=clock-prev; maxStep=Math.max(maxStep,step); prev=clock;
      if(DWELL.st&&DWELL.st.E===E&&DWELL.st.stage==='hold') holdF++;
      if(!DWELL.st&&exitRate===null&&clock>E){ /* first frame after the dwell */ AU_T+=AU_DT; const c1=clock; tickClock(AU_DT); exitRate=(clock-c1)/(AU_DT/1000); break; } }
    const holdS=(stage==='in'?holdF*AU_DT/1000:null);
    AU_LOG(`  ${stage} ${a}x->${b}x at clock ${c0.toFixed(4)} (tau ${st0.tau.toFixed(3)} of ${(st0.stage==='hold'?DWELL.HOLD:st0.te).toFixed(3)} s): largest clock step after ${maxStep.toFixed(4)} min (a frame at ${b}x is ${(MIN_PER_SEC*b*AU_DT/1000).toFixed(4)}, at ${a}x ${(MIN_PER_SEC*a*AU_DT/1000).toFixed(4)}); hold after the change ${holdS===null?'-':holdS.toFixed(3)+' s'}; rate after the dwell ${exitRate===null?'?':exitRate.toFixed(3)} min/s (the new speed ${MIN_PER_SEC*b})`);
  }));
});

/* B3 */
AU_block('B3 pause and resume inside a dwell',()=>{
  const E=AU_STARTS.find(s=>s>600);
  ['in','hold','out'].forEach(stage=>{
    stopPlay(); dwellSet(true); setSpeed(0.5); setClock(E-10,{instant:true,force:true}); togglePlay();
    let g=0; while(playing&&g++<100000){ AU_T+=AU_DT; tickClock(AU_DT); if(DWELL.st&&DWELL.st.E===E&&DWELL.st.stage===stage&&DWELL.st.tau>=(stage==='hold'?DWELL.HOLD:DWELL.st.te)*0.5) break; }
    const c0=clock; togglePlay(); /* pause */ const paused=!playing; AU_T+=5000; togglePlay(); /* resume */
    let holdF=0, f=0, first=null; while(playing&&f++<100000){ AU_T+=AU_DT; const cb=clock; tickClock(AU_DT); if(first===null) first=(clock-cb)/(AU_DT/1000); if(DWELL.st&&DWELL.st.E===E&&DWELL.st.stage==='hold') holdF++; if(clock>E+3) break; }
    AU_LOG(`  paused in the ${stage} at ${c0.toFixed(4)} (E ${E}): paused ${paused}; first rate after resume ${first.toFixed(3)} min/s; hold at E after resume ${(holdF*AU_DT/1000).toFixed(3)} s`);
  });
  stopPlay();
});

/* B4 */
AU_block('B4 a theme chosen while the clock plays',()=>{
  stopPlay(); setSpeed(0.5); setClock(300,{instant:true,force:true}); togglePlay();
  for(let i=0;i<10;i++){ AU_T+=AU_DT; tickClock(AU_DT); }
  const c=ANALYSIS[0], before=clock, wasPlaying=playing;
  setChapter(chapter===c.id?null:c.id);   /* the theme button's own handler (app.js buildUI, ".chap") */
  const at=clock, still=playing;
  for(let i=0;i<120;i++){ AU_T+=AU_DT; tickClock(AU_DT); if(tween) tween(AU_T); }
  AU_LOG(`  playing ${wasPlaying} at ${before.toFixed(2)}; theme "${c.id}" chosen: clock ${at.toFixed(2)} (its moment ${chapterClock(c)}), playing after ${still}; two seconds later the clock is ${clock.toFixed(2)}, chapter still ${chapter}, freeCam ${freeCam}, Follow target ${FOLLOW.T?'set':'none'}`);
  AU_LOG(`  for comparison: a tour stop (applyTour) and a phase button call stopPlay() first (app.js applyTour, buildTimeline)`);
  setChapter(null); stopPlay();
});

/* B5 */
AU_block('B5 the overlays\' fade at 4x across phase boundaries (dwell off and on)',()=>{
  [false,true].forEach(dw=>{
    stopPlay(); dwellSet(dw); setSpeed(4); setClock(T_MIN,{instant:true,force:true}); if(tween){ for(let i=0;i<4&&tween;i++) tween(AU_T+1e7); }
    togglePlay();
    let lastPh=curPhase, tPh=AU_T, rows=[], pops=0, cutFades=0;
    while(playing){
      AU_T+=AU_DT; if(tween) tween(AU_T);
      const prevMats=overlayMats.slice(), prevOp=prevMats.map(m=>m.opacity), prevFadeIn=ovFadeIn;
      tickClock(AU_DT); applyOverlayOpacity();
      if(curPhase!==lastPh){
        const real=(AU_T-tPh)/1000; tPh=AU_T;
        /* the group that was current is now oldMats: its opacity now against what it was the frame before */
        let maxBefore=0, maxAfter=0; prevMats.forEach((m,i)=>{ maxBefore=Math.max(maxBefore,prevOp[i]); maxAfter=Math.max(maxAfter,m.opacity); });
        const cut=prevFadeIn<1; if(cut) cutFades++;
        const pop=prevMats.length&&maxAfter>maxBefore+0.2; if(pop) pops++;
        rows.push(`${fmtClock(PHASES[lastPh].t0)}->${fmtClock(PHASES[curPhase].t0)} ${real.toFixed(2)} s; outgoing fade-in had reached ${prevFadeIn.toFixed(2)}; its ${prevMats.length} materials' largest opacity ${maxBefore.toFixed(2)} -> ${maxAfter.toFixed(2)}${pop?'  POP':''}`);
        lastPh=curPhase; } }
    AU_LOG(`  dwell ${dw?'on':'off'}: TRANS_MS ${TRANS_MS} ms; ${rows.length} phase changes, ${cutFades} with the incoming fade cut short, ${pops} with the outgoing group popping up by more than 0.2`);
    rows.forEach(r=>AU_LOG('    '+r));
  });
  dwellSet(true); setSpeed(0.5); stopPlay();
});

/* B6 */
AU_block('B6 the reading within a clock minute',()=>{
  const ids=Object.keys(FORMATIONS);
  ['fr','al'].forEach(cv=>{
    setCommandView(cv);
    const read=()=>{ const o={}; ids.forEach(id=>o[id]=knowledgeOf(id)); return o; };
    let diffs=[], samples=0;
    for(let m=T_MIN+1;m<T_MAX-1;m+=1){
      setClock(m+0.1,{instant:true}); read(); setClock(m+0.9,{instant:true}); const a=read();
      setClock(m-0.5,{instant:true}); read(); setClock(m+0.9,{instant:true}); const b=read();
      samples++;
      ids.forEach(id=>{ if(a[id]!==b[id]) diffs.push(`${id} at ${fmtClock(m)}+0.9: ${a[id]} through ${fmtClock(m)}+0.1, ${b[id]} sought directly`); }); }
    AU_LOG(`  ${cv}: ${samples} minutes, ${diffs.length} formation-minutes whose reading at m+0.9 depends on the path`); diffs.slice(0,12).forEach(d=>AU_LOG('    '+d));
  });
  setCommandView('none');
});

/* B7 */
AU_block('B7 Play to the end, then Play again',()=>{
  stopPlay(); dwellSet(true); setSpeed(4); setClock(T_MAX-3,{instant:true,force:true}); togglePlay();
  let f=0; while(playing&&f++<10000){ AU_T+=AU_DT; tickClock(AU_DT); }
  const endClock=clock, endPlaying=playing, endPhase=curPhase;
  togglePlay();
  AU_LOG(`  ran to ${endClock} (T_MAX ${T_MAX}) in ${f} frames, playing ${endPlaying}, phase ${endPhase}; Play again: clock ${clock}, phase ${curPhase}, playing ${playing}`);
  AU_T+=AU_DT; tickClock(AU_DT); AU_LOG(`  a frame later the clock is ${clock.toFixed(3)}`);
  /* within half a minute of the end, Play starts the day again; just outside it, Play runs the last minute and stops */
  stopPlay(); setClock(T_MAX-0.49,{instant:true}); togglePlay(); AU_LOG(`  from T_MAX-0.49: Play puts the clock at ${clock}`);
  stopPlay(); setClock(T_MAX-0.51,{instant:true}); togglePlay(); let g=0; while(playing&&g++<1000){ AU_T+=AU_DT; tickClock(AU_DT); } AU_LOG(`  from T_MAX-0.51: Play runs ${g} frames to ${clock}, playing ${playing}`);
  setSpeed(0.5);
});

/* B8 */
AU_block('B8 the phone speed button',()=>{
  const btns=[0.5,1,2,4].map(s=>({dataset:{s:String(s)},textContent:s+'x',setAttribute(){},getAttribute(){return null;}}));
  const qsa=document.querySelectorAll, qs=document.querySelector;
  document.querySelectorAll=q=>q===".spd-btn"?btns:qsa(q);
  document.querySelector=q=>q==='.spd-btn[aria-pressed="true"]'?null:qs(q);
  try{ setSpeed(0.5); const seq=[speed]; for(let i=0;i<5;i++){ speedNext(); seq.push(speed); } AU_LOG(`  from 0.5: ${seq.join(' -> ')}`);
    speed=3; speedNext(); AU_LOG(`  from a speed not among the buttons (3): ${speed}`); }
  finally{ document.querySelectorAll=qsa; document.querySelector=qs; setSpeed(0.5); }
});

/* B9 */
AU_block('B9 the first frame after the page went idle',()=>{
  [0.5,4].forEach(x=>{
    stopPlay(); setSpeed(x); setClock(500,{instant:true,force:true});
    lastFrame=AU_T-30000; AU_T+=0;   /* the page idle for 30 s: the loop returned before lastFrame=now */
    togglePlay(); const c0=clock; AU_T+=AU_DT; lastInput=AU_T; loop(); const c1=clock; AU_T+=AU_DT; loop(); const c2=clock;
    AU_LOG(`  ${x}x: the first frame after 30 s idle advances ${(c1-c0).toFixed(3)} clock min (dt held at 120 ms; a 60 Hz frame is ${(MIN_PER_SEC*x*AU_DT/1000).toFixed(3)}); the second ${(c2-c1).toFixed(3)}`);
  });
  stopPlay(); setSpeed(0.5);
});

/* B10 */
AU_block('B10 overlays after many phase changes',()=>{
  const n0=overlayRoot.children.length; let maxKids=n0, rnd=12345; const r=()=>{ rnd=(rnd*1103515245+12345)%2147483648; return rnd/2147483648; };
  for(let i=0;i<300;i++){ setClock(T_MIN+r()*(T_MAX-T_MIN),{instant:r()<0.3}); if(tween&&r()<0.5) tween(AU_T+=r()*3000); maxKids=Math.max(maxKids,overlayRoot.children.length); }
  for(let i=0;i<4&&tween;i++) tween(AU_T+=1e7);
  AU_LOG(`  overlay groups: ${n0} before, at most ${maxKids} during 300 random seeks, ${overlayRoot.children.length} after the tweens ended`);
});

/* B11 */
AU_block('B11 the clock at its edges',()=>{
  const keep=clock;
  [NaN,Infinity,-Infinity,T_MIN-100,T_MAX+100].forEach(v=>{ try{ setClock(v,{instant:true}); AU_LOG(`  setClock(${v}) -> clock ${clock}, phase ${curPhase}, posNow(sthilaire) ${JSON.stringify(posNow('sthilaire'))}`); }catch(e){ AU_LOG(`  setClock(${v}) threw ${e.message}`); } });
  setClock(keep,{instant:true,force:true});
  /* the rail's toClock with a zero width: T_MIN+clamp((x-left)/(width||1))*(T_MAX-T_MIN) */
  const toClock=(x,left,width)=>T_MIN+Math.max(0,Math.min(1,(x-left)/(width||1)))*(T_MAX-T_MIN);
  AU_LOG(`  toClock with a zero-width rail: ${toClock(0,0,0)}, ${toClock(0.5,0,0)}, ${toClock(5,0,0)} (any x>left+1 gives T_MAX)`);
});

/* B12 */
AU_block('B12 seeks counted',()=>{
  stopPlay(); const s0=GAIT.seek; setClock(600); const s1=GAIT.seek; togglePlay(); AU_T+=AU_DT; tickClock(AU_DT); const s2=GAIT.seek; stopPlay(); jumpEvent(1); const s3=GAIT.seek;
  AU_LOG(`  a seek +${s1-s0}; Play's own advance +${s2-s1}; an event jump +${s3-s2}`);
});

/* B13 the opening's played stretches (7D): Next from each step plays at 4x to the next stop; arrival exact, the visitor's speed put back */
AU_block('B13 the opening\'s played stretches',()=>{
  stopPlay(); setSpeed(0.5); setCommandView('none'); openingStart();
  for(let k=0;k<OPENING.stops.length-1;k++){
    const from=clock, target=stopClock(TOUR[OPENING.stops[k+1]]), t0=AU_T; openingGo(1);
    const started=!!OPENING.play, spd=speed; let f=0, pops=0, lastPh=curPhase;
    while(OPENING.play&&f++<200000){ AU_T+=AU_DT; if(tween) tween(AU_T); const pm=overlayMats.slice(), po=pm.map(m=>m.opacity); tickClock(AU_DT); applyOverlayOpacity(); openingPlayWatch();
      if(curPhase!==lastPh){ let b=0,a=0; pm.forEach((m,i)=>{ b=Math.max(b,po[i]); a=Math.max(a,m.opacity); }); if(pm.length&&a>b+0.2) pops++; lastPh=curPhase; } }
    AU_LOG(`  step ${k+1}->${k+2}: from ${fmtClock(from)} to the stop at ${fmtClock(target)}: stretch started ${started} at ${spd}x; ${(f*AU_DT/1000).toFixed(2)} s; arrived at clock ${clock} (target ${target}); OPENING.k ${OPENING.k}; speed now ${speed}; playing ${playing}; outgoing overlay pops ${pops}`);
  }
  openingEnd('skip'); AU_LOG(`  after Skip: clock ${clock}, opening on ${OPENING.on}, tourStep ${tourStep}, speed ${speed}`);
});

/* B14 the plateau note's look-back at fractional clocks (plateauFlatFor reads the minute samples) */
AU_block('B14 plateauFlatFor at fractional clocks',()=>{
  const d=plateauDay(); let neg=[];
  for(let t=T_MIN+60;t<PHASES[PLATEAU_LAST].t1;t+=0.125){ clock=t; const onH=plateauStrength('al'); if(onH>0){ const ff=plateauFlatFor(onH,t); if(ff<0) neg.push(`${t.toFixed(3)}: ${ff.toFixed(3)} (onH ${onH}, minute sample ${d[Math.floor(t-T_MIN)]})`); } }
  setClock(600,{instant:true,force:true});
  AU_LOG(`  ${neg.length} fractional clocks where the look-back is negative (the minute's sample differs from the holding at the clock): ${neg.slice(0,6).join('; ')}`);
});

performance.now=AU_realNow;
AU_LOG(`\nwarnings during the checks: ${warns.length}${warns.length?': '+[...new Set(warns)].slice(0,5).join(' | '):''}; errors ${errs.length}${errs.length?': '+errs.slice(0,3).join(' | '):''}`);
AU_LOG(`total ${((Date.now()-AU_tLoad)/1000).toFixed(0)} s`);
process.exit(0);
