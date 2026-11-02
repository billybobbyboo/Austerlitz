/* audit-post8 (state): property checks on the simulation's own functions, loaded the way sim-test.js loads them (the generated helper
   modules _clock.js, _derived.js, _events.js, _state.js, made from the live app.js by tools/mk-helpers.js, over world.js's module and the
   data). Read-only: run it in an isolated copy whose generated modules are current.
   Usage: node props-helpers.js <iso-root>     prints a report; exit code 1 if a property fails.
   Properties:
     P1  every tracked formation's position is finite at every critical time (each anchor's arrival, each leg's departure, each phase
         boundary, the day's first and last minute) and continuous across it: t-eps, t, t+eps (eps 1e-6 and 1e-3 minutes) within the arm's
         ceiling over 2 eps (plus 1e-9 units); a presence change (first anchor, removal) is listed, not judged
     P2  a sweep of the day at 1/8 minute: no NaN, every position inside the map frame (tools/map-frame.js), presence only as anchorList says
     P3  the derived readings (plateauStrength both sides, centreSeparation) sampled at 1/8 minute: where they change, and every flicker
         (a change undone within 5 minutes) listed
     P4  the event jumps (jumpEvent's rule, copied from app.js: forward the first start > t+1.5, else T_MAX; back the last < t-1.5, else
         T_MIN): from T_MIN forward and from T_MAX back, every distinct start visited once and in order
     P5  confAt for every leaf at 1/4 minute: a grade in A/B/C, never undefined
     P6  the phases contiguous (t1 of one the t0 of the next) and phaseAt at each boundary +-eps
     P7  anchors: arrivals non-decreasing along each track, every leg's window w0 <= w1 */
const fs=require('fs'), path=require('path');
const ISO=path.resolve(process.argv[2]||'.'); process.chdir(ISO);
const M=require(ISO+'/_world_mod.js');
global.W=M.W; global.height=M.height; global.hAt=M.hAt; global.smoothstep=M.smoothstep;
global.covAt=M.covAt; global.SATS=M.SATS; global.MENI=M.MENI; global.VILLAGES=M.VILLAGES;
M.buildCover(); M.buildGrid();
Object.defineProperty(global,'covWater',{get:()=>M.covWater});
Object.defineProperty(global,'covRoad',{get:()=>M.covRoad});
Object.defineProperty(global,'covMarsh',{get:()=>M.covMarsh});
eval(fs.readFileSync('data.js','utf8'));
eval(fs.readFileSync('analysis.js','utf8'));
eval(fs.readFileSync('_clock.js','utf8'));
global.units={}; Object.keys(FORMATIONS).forEach(id=>{ if(FORMATIONS[id].track) units[id]={}; });
eval(fs.readFileSync('_state.js','utf8'));
eval(fs.readFileSync('_derived.js','utf8'));
eval(fs.readFileSync('_events.js','utf8'));
const MAPF=require(ISO+'/tools/map-frame.js')(W);
let fails=[], notes=[];
const out=[]; const log=s=>{ out.push(s); };
const ids=Object.keys(FORMATIONS).filter(id=>FORMATIONS[id].track);
const pos=(id,t)=>(goneAt(id,t)||notYetAt(id,t))?null:posAtClock(id,t);
const fin=p=>p===null||(Array.isArray(p)&&p.length===2&&Number.isFinite(p[0])&&Number.isFinite(p[1]));
log(`day ${fmtClock(T_MIN)}-${fmtClock(T_MAX)} (${T_MIN}-${T_MAX} min), ${PHASES.length} phases, ${ids.length} tracked formations, ${EVENTS.length} events`);

/* ---- P6 phases ---- */
{ let bad=0;
  for(let i=0;i<PHASES.length;i++){ const p=PHASES[i];
    if(!(p.t0<p.t1)){ fails.push(`P6 phase ${i}: t0 ${p.t0} not before t1 ${p.t1}`); bad++; }
    if(i<PHASES.length-1&&p.t1!==PHASES[i+1].t0){ fails.push(`P6 phase ${i}: t1 ${p.t1} is not phase ${i+1}'s t0 ${PHASES[i+1].t0}`); bad++; }
    if(phaseAt(p.t0)!==i) { fails.push(`P6 phaseAt(${p.t0}) = ${phaseAt(p.t0)}, want ${i}`); bad++; }
    if(i>0&&phaseAt(p.t0-1e-9)!==i-1){ fails.push(`P6 phaseAt(${p.t0}-1e-9) = ${phaseAt(p.t0-1e-9)}, want ${i-1}`); bad++; } }
  log(`P6 phases contiguous, phaseAt at every boundary: ${bad?bad+' problems':'OK'}; durations (min): ${PHASES.map(p=>p.t1-p.t0).join(', ')}`); }

/* ---- P7 anchors ---- */
{ let bad=0, legs=0;
  ids.forEach(id=>{ const A=anchorList(id);
    for(let i=1;i<A.length;i++){ const a=A[i-1], b=A[i];
      if(b.arr<a.arr-1e-9){ fails.push(`P7 ${id}: anchor ${b.ph} reached at ${b.arr}, before anchor ${a.ph} at ${a.arr}`); bad++; }
      if(a.p&&b.p){ legs++; if(!(b.w[0]<=b.w[1]+1e-9)){ fails.push(`P7 ${id}: leg ${a.ph}->${b.ph} window ${b.w}`); bad++; } } } });
  log(`P7 anchors: ${legs} legs, arrivals non-decreasing and windows ordered: ${bad?bad+' problems':'OK'}`); }

/* ---- P1 continuity at critical times ---- */
{ let checks=0, jumps=[], presence=0, nonfin=[];
  ids.forEach(id=>{ const f=FORMATIONS[id], A=anchorList(id), ceil=(SPEED_CEIL[f.arm]||5);
    const T=new Set([T_MIN,T_MAX]); PHASES.forEach(p=>{ T.add(p.t0); T.add(p.t1); });
    A.forEach(a=>{ if(Number.isFinite(a.arr)) T.add(a.arr); if(a.w){ T.add(a.w[0]); T.add(a.w[1]); } });
    [...T].filter(t=>t>=T_MIN&&t<=T_MAX).forEach(t=>{
      [1e-6,1e-3].forEach(eps=>{ checks++;
        const tm=Math.max(T_MIN,t-eps), tp=Math.min(T_MAX,t+eps), pm=pos(id,tm), p0=pos(id,t), pp=pos(id,tp);
        [pm,p0,pp].forEach((p,k)=>{ if(!fin(p)) nonfin.push(`${id} at ${[tm,t,tp][k]}: ${JSON.stringify(p)}`); });
        if(!!pm!==!!pp){ presence++; return; }
        if(pm&&pp){ const km=Math.hypot(pp[0]-pm[0],pp[1]-pm[1])*KM_PER_MAP, allow=ceil*(tp-tm)/60+1e-9*KM_PER_MAP;
          if(km>allow) jumps.push({id,t,eps,m:km*1000,allowM:allow*1000}); }
        if(p0&&pm&&!pp){ /* leaving */ } }); }); });
  jumps.sort((a,b)=>b.m-a.m);
  log(`P1 continuity at critical times: ${checks} checks; presence changes ${presence}; non-finite ${nonfin.length}; discontinuities ${jumps.length}`);
  jumps.slice(0,40).forEach(j=>log(`   jump ${j.id} at ${fmtClock(j.t)} (${j.t}) eps ${j.eps}: ${j.m.toFixed(3)} m (allowed ${j.allowM.toFixed(6)} m)`));
  nonfin.slice(0,20).forEach(s=>log('   non-finite '+s));
  if(nonfin.length) fails.push(`P1 ${nonfin.length} non-finite positions`);
  if(jumps.length) fails.push(`P1 ${jumps.length} discontinuities (largest ${jumps[0].m.toFixed(1)} m: ${jumps[0].id} at ${fmtClock(jumps[0].t)})`); }

/* ---- P2 sweep ---- */
{ const STEP=1/8; let n=0, nan=0, outside=[], pres={};
  for(let t=T_MIN;t<=T_MAX+1e-9;t+=STEP){ const tt=Math.min(T_MAX,t);
    ids.forEach(id=>{ const p=pos(id,tt); n++;
      if(!fin(p)){ nan++; return; }
      if(p&&!MAPF.inside(p)) outside.push(`${id} at ${fmtClock(tt)}: ${p.map(v=>v.toFixed(1))}`);
      if(p) pres[id]=(pres[id]||0)+1; }); }
  log(`P2 sweep at 1/8 min: ${n} samples; NaN ${nan}; outside the ${MAPF.w}x${MAPF.h} map frame ${outside.length}`);
  outside.slice(0,10).forEach(s=>log('   outside '+s));
  const never=ids.filter(id=>!pres[id]); if(never.length) log('   never on the field: '+never.join(', '));
  const endOn=ids.filter(id=>pos(id,T_MAX)), startOn=ids.filter(id=>pos(id,T_MIN));
  log(`   at ${fmtClock(T_MIN)} ${startOn.length} on the field; at ${fmtClock(T_MAX)} ${endOn.length}`);
  if(nan) fails.push(`P2 ${nan} NaN positions`); if(outside.length) fails.push(`P2 ${outside.length} positions outside the map frame`); }

/* ---- P3 derived readings ---- */
{ const STEP=1/8; let prev=null, ch={al:[],fr:[],cut:[]};
  for(let t=T_MIN;t<=T_MAX+1e-9;t+=STEP){ clock=Math.min(T_MAX,t);
    const r={al:plateauStrength('al'),fr:plateauStrength('fr'),cut:centreSeparation()};
    if(!Number.isFinite(r.al)||!Number.isFinite(r.fr)) fails.push(`P3 plateau strength not finite at ${clock}`);
    if(prev) ['al','fr','cut'].forEach(k=>{ if(r[k]!==prev[k]) ch[k].push({t:clock,from:prev[k],to:r[k]}); });
    prev=r; }
  const flick=k=>{ const c=ch[k], o=[]; for(let i=1;i<c.length;i++) if(c[i].t-c[i-1].t<5&&c[i].to===c[i-1].from) o.push(`${fmtClock(c[i-1].t)}(${c[i-1].t.toFixed(3)}) ${c[i-1].from}->${c[i-1].to}, back at ${c[i].t.toFixed(3)} (${((c[i].t-c[i-1].t)*60).toFixed(0)} s of clock)`); return o; };
  ['al','fr'].forEach(k=>{ log(`P3 plateau strength ${k}: ${ch[k].length} changes over the day; flickers (undone within 5 min): ${flick(k).length}`); flick(k).slice(0,12).forEach(s=>log('   '+s)); });
  log(`P3 centre separation: ${ch.cut.length} switches: `+ch.cut.map(c=>`${c.to?'ON':'off'} at ${fmtClock(c.t)} (${c.t.toFixed(3)})`).join('; '));
  const fc=flick('cut'); log(`   flickers (undone within 5 min): ${fc.length}`); fc.forEach(s=>log('   '+s));
  /* the plateau reading's last phase (decision 126): the holding after it is not shown; record its values there */
  clock=PHASES[PLATEAU_LAST].t1-1e-6; const lastAl=plateauStrength('al'); clock=PHASES[PLATEAU_LAST+1].t0; const nextAl=plateauStrength('al');
  log(`   plateau holding (al) just before the end of phase ${PLATEAU_LAST} (${fmtClock(PHASES[PLATEAU_LAST].t1)}): ${lastAl}; at phase ${PLATEAU_LAST+1}'s start: ${nextAl}`); }

/* ---- P4 event jumps (jumpEvent's rule, app.js jumpEvent/eventTimes) ---- */
{ const ts=EVENTS.map(e=>Array.isArray(e.t)?e.t[0]:e.t).sort((a,b)=>a-b), distinct=[...new Set(ts)];
  const fwd=t=>{ for(let i=0;i<ts.length;i++) if(ts[i]>t+1.5) return ts[i]; return T_MAX; };
  const back=t=>{ for(let j=ts.length-1;j>=0;j--) if(ts[j]<t-1.5) return ts[j]; return T_MIN; };
  let t=T_MIN, seqF=[], g=0; while(t<T_MAX&&g++<1000){ t=fwd(t); seqF.push(t); }
  t=T_MAX; let seqB=[]; g=0; while(t>T_MIN&&g++<1000){ t=back(t); seqB.push(t); }
  const inDay=distinct.filter(s=>s>T_MIN+1.5&&s<=T_MAX), visitedF=seqF.filter(s=>s!==T_MAX||inDay.includes(T_MAX));
  const missF=inDay.filter(s=>!seqF.includes(s)), dupF=seqF.filter((s,i)=>seqF.indexOf(s)!==i);
  const inDayB=distinct.filter(s=>s<T_MAX-1.5&&s>=T_MIN), missB=inDayB.filter(s=>!seqB.includes(s));
  const close=[]; for(let i=1;i<distinct.length;i++) if(distinct[i]-distinct[i-1]<=1.5) close.push(`${fmtClock(distinct[i-1])} and ${fmtClock(distinct[i])}`);
  log(`P4 event jumps: ${distinct.length} distinct starts (${ts.length} events); forward from ${fmtClock(T_MIN)}: ${seqF.length} stops, missed ${missF.length}, repeated ${dupF.length}; back from ${fmtClock(T_MAX)}: ${seqB.length} stops, missed ${missB.length}`);
  if(close.length) log('   starts 1.5 min or less apart (one jump skips the other): '+close.join('; '));
  const atMin=distinct.filter(s=>s<=T_MIN+1.5); if(atMin.length) log('   starts within 1.5 min of the first minute (never a forward stop): '+atMin.map(fmtClock).join(', '));
  if(missF.length) fails.push(`P4 forward jumps miss ${missF.map(fmtClock).join(', ')}`);
  if(missB.length) fails.push(`P4 backward jumps miss ${missB.map(fmtClock).join(', ')}`);
  if(dupF.length) fails.push(`P4 forward jumps repeat ${dupF.map(fmtClock).join(', ')}`);
  /* the 1.5 rule seen from a clock just short of a start (the slider leaves fractional clocks): which starts a forward jump skips */
  const skipped=distinct.filter(s=>{ const from=s-1; return from>=T_MIN&&fwd(from)!==s; });
  log(`   from one minute before a start, a forward jump skips that start for ${skipped.length} of ${distinct.length} starts (the 1.5-minute margin): e.g. ${skipped.slice(0,6).map(fmtClock).join(', ')}`); }

/* ---- P5 confAt ---- */
{ let n=0, bad=[];
  for(let t=T_MIN;t<=T_MAX+1e-9;t+=0.25){ const tt=Math.min(T_MAX,t);
    ids.forEach(id=>{ if(!pos(id,tt)) return; n++; const c=confAt(id,tt); if(!c||!/^[ABC]$/.test(c.cf)||typeof c.interp!=='boolean') bad.push(`${id} at ${tt}: ${JSON.stringify(c)}`); }); }
  log(`P5 confAt on the field at 1/4 min: ${n} samples, ${bad.length} without a grade`); bad.slice(0,10).forEach(s=>log('   '+s));
  if(bad.length) fails.push(`P5 ${bad.length} samples without a grade`); }

/* ---- P8 aggregates' positions (posNow's centroid of leaves present) finite whenever any leaf is present ---- */
{ let n=0, bad=0; const aggs=Object.keys(FORMATIONS).filter(id=>!FORMATIONS[id].track&&FORMATIONS[id].children);
  for(let t=T_MIN;t<=T_MAX+1e-9;t+=1){ clock=Math.min(T_MAX,t);
    aggs.forEach(id=>{ const p=posNow(id); n++; if(p&&!fin(p)) bad++; const any=leavesOf(id,[]).some(k=>pos(k,clock)); if(!!p!==any) bad++; }); }
  log(`P8 aggregates (${aggs.length}) at every minute: ${n} samples, ${bad} inconsistent`); if(bad) fails.push(`P8 ${bad} aggregate samples inconsistent`); }

log(''); log(fails.length?`FAILED ${fails.length}:`:'ALL PROPERTIES HOLD'); fails.forEach(f=>log('  ! '+f));
console.log(out.join('\n'));
process.exitCode=fails.length?1:0;
