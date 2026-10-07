/* Run the whole battle and check it holds together: continuity, activation,
   event/position agreement, and whether the causal chain is actually legible. */
const fs=require('fs');
const M=require('./_world_mod.js');
global.W=M.W; global.height=M.height; global.hAt=M.hAt; global.smoothstep=M.smoothstep;
global.covAt=M.covAt; global.SATS=M.SATS; global.MENI=M.MENI; global.VILLAGES=M.VILLAGES;
M.buildCover(); M.buildGrid();
Object.defineProperty(global,'covWater',{get:()=>M.covWater});
Object.defineProperty(global,'covRoad',{get:()=>M.covRoad});
Object.defineProperty(global,'covMarsh',{get:()=>M.covMarsh});
eval(fs.readFileSync('data.js','utf8'));
eval(fs.readFileSync('analysis.js','utf8'));
global.leavesOf=function(id,out){out=out||[];const f=FORMATIONS[id];if(f.track)out.push(id);
  if(f.children)f.children.forEach(k=>leavesOf(k,out));return out;};
eval(fs.readFileSync('_clock.js','utf8'));
global.units={}; Object.keys(FORMATIONS).forEach(id=>{ if(FORMATIONS[id].track) units[id]={}; });
global.clock=T_MIN;
eval(fs.readFileSync('_derived.js','utf8'));
eval(fs.readFileSync('_events.js','utf8'));

let errs=[], warns=[];
const STEP=2;

/* ---- 1. continuity and activation across the whole battle ---- */
let lastPhase=-1, prev={}, maxJump={id:null,km:0,t:0};
for(let t=T_MIN;t<=T_MAX;t+=STEP){
  clock=t;
  const ph=phaseAt(t);
  if(ph<lastPhase) errs.push(`phase went backwards at ${fmtClock(t)}`);
  lastPhase=ph;
  Object.keys(units).forEach(id=>{
    const A=anchorList(id);
    const first=A.length?PHASES[A[0].ph].t0:T_MIN;
    const p=(goneAt(id,t)||notYetAt(id,t))?null:posAtClock(id,t);
    if(p && t<first-0.001) errs.push(`${id} is on the field before its first anchor`);
    if(p&&prev[id]){
      const km=Math.hypot(p[0]-prev[id][0],p[1]-prev[id][1])*KM_PER_MAP;
      const kmh=km/(STEP/60);
      const ceil=(SPEED_CEIL[FORMATIONS[id].arm]||5)*1.35;   /* allow for path curvature */
      if(kmh>ceil) errs.push(`${id} moved at ${kmh.toFixed(1)} km/h at ${fmtClock(t)}`);
      if(km>maxJump.km) maxJump={id,km,t};
    }
    prev[id]=p;
  });
}
console.log(`swept ${fmtClock(T_MIN)}-${fmtClock(T_MAX)} at ${STEP}-minute resolution`);
console.log(`  largest single step: ${maxJump.id} ${(maxJump.km*1000).toFixed(0)} m at ${fmtClock(maxJump.t)}`);

/* ---- 2. does the reconstruction put the named formations where the event says? ----
   True distance (KM_PER_MAP comes from geo.js). Default: some named formation within
   1.0 km of the marker at some moment in the event's window (a point event: at its
   time). An event may carry its own tolKm only with a written tolWhy, and never above
   2 km. Events naming no plotted formation are reported, not silently passed. */
const EV_TOL_KM=1.0, EV_TOL_CAP=2.0;
let far=0, excepted=[], unplotted=[], worst={km:0};
EVENTS.forEach(e=>{
  const w=Array.isArray(e.t)?e.t:[e.t,e.t];
  if(e.tolKm!==undefined && !e.tolWhy){ errs.push(`event "${e.id}": tolKm without a written reason`); }
  if(e.tolKm!==undefined && e.tolKm>EV_TOL_CAP){ errs.push(`event "${e.id}": tolerance ${e.tolKm} km exceeds the ${EV_TOL_CAP} km cap`); }
  const tol=e.tolKm!==undefined?Math.min(e.tolKm,EV_TOL_CAP):EV_TOL_KM;
  /* T-6 (docs/FINAL_AUDIT.md): an unknown id fails (it was skipped). The candidates stay the named tracked formations; an aggregate's
     tracked formations stand in only for an event that names no tracked formation (none today), so no event's existing test is
     weakened by extra candidates (the step-1 critic's violation 2) */
  e.forms.filter(f=>!FORMATIONS[f]).forEach(f=>errs.push(`event "${e.id}": names ${f}, which is not a formation`));
  const named=e.forms.filter(f=>FORMATIONS[f]&&FORMATIONS[f].track);
  const cand=named.length?named:[...new Set([].concat(...e.forms.filter(f=>FORMATIONS[f]).map(f=>leavesOf(f,[]))))];
  let best=null;
  for(let t=w[0];t<=w[1];t+=2){ clock=t;
    cand.forEach(fid=>{ const p=posNow(fid); if(!p) return;
      const km=Math.hypot(p[0]-e.p[0],p[1]-e.p[1])*KM_PER_MAP; if(!best||km<best.km) best={km,fid,t}; }); }
  if(!best){ unplotted.push(e.id); return; }
  if(best.km>tol){ errs.push(`event "${e.id}": nearest named formation (${best.fid}) is ${best.km.toFixed(2)} km from its marker (tolerance ${tol} km)`); far++; }
  if(e.tolKm!==undefined) excepted.push(`${e.id} ${best.km.toFixed(2)} km (allowed ${tol}): ${e.tolWhy}`);
  if(e.tolKm===undefined && best.km>worst.km) worst={km:best.km,id:e.id};
});
console.log(`  ${EVENTS.length} events checked against formation positions (true distance, ${EV_TOL_KM} km default): ${far} disagreements`);
console.log(`  worst agreement under the default tolerance: ${worst.id} ${worst.km.toFixed(2)} km`);
excepted.forEach(x=>console.log('  explicit tolerance: '+x));
if(unplotted.length) console.log('  events naming no plotted formation (not tested): '+unplotted.join(', '));

/* ---- 1b. troops are counted once: no side ever has more men on the field than its army ---- */
{ const armyOf=id=>+String(FORMATIONS[id].army.men).replace(/[^\d]/g,'');
  const AL=armyOf('ahq'), FR=armyOf('gqg'); let worst={al:0,fr:0};
  for(let t=T_MIN;t<=T_MAX;t+=10){ worst.al=Math.max(worst.al,sideOnFieldAt('al',t)); worst.fr=Math.max(worst.fr,sideOnFieldAt('fr',t)); }
  let raw=0; Object.keys(FORMATIONS).forEach(id=>{ const f=FORMATIONS[id]; if(f.track&&f.nation!=='fr') raw+=f.strength||0; });
  console.log(`  most men on the field at once: Allied ${worst.al} of ${AL}, French ${worst.fr} of ${FR} (naive sum of tracked Allied strengths would be ${raw})`);
  if(worst.al>AL) errs.push(`Allied men on the field (${worst.al}) exceed the Allied army (${AL}): a parent is being counted with its children`);
  if(worst.fr>FR) errs.push(`French men on the field (${worst.fr}) exceed the French army (${FR}): a parent is being counted with its children`); }

/* ---- 2b. the tour quotes derived plateau figures: they must be the live figures ---- */
{ const stop=TOUR.find(x=>/plateau outline/.test(x.x)); const nums=(stop.x.match(/about ([\d,]+)/g)||[]).map(m=>+m.replace(/[^\d]/g,''));
  clock=240; const dawn=plateauStrength('al'); let low=1e9; for(let t=240;t<=525;t+=5){ clock=t; low=Math.min(low,plateauStrength('al')); }
  const ok=nums.length===2 && Math.abs(nums[0]-dawn)<=600 && Math.abs(nums[1]-low)<=600;
  console.log(`  tour stop 4 quotes ${nums.join(' and ')}; live figures ${dawn} at 04:00 and ${low} before the attack: ${ok?'agree':'DISAGREE'}`);
  if(!ok) errs.push('tour stop 4 quotes plateau figures that no longer match the live computation'); }

/* ---- 3. acts must cover every phase, contiguously and in order ---- */
let seen=[];
ACTS.forEach(a=>{ a.phases.forEach(p=>seen.push(p)); });
seen.sort((x,y)=>x-y);
for(let i=0;i<PHASES.length;i++) if(seen[i]!==i) errs.push(`acts do not cover phase ${i} contiguously`);

/* ---- 4. the causal chain: does the story show in the numbers? ---- */
console.log("\n-- the mechanism, read off the reconstruction --");
const marks=[[240,"04:00 deployment"],[420,"07:00 Telnitz"],[480,"08:00 Sokolnitz"],
             [525,"08:45 Soult attacks"],[570,"09:30"],[660,"11:00 Pratzeberg held"],
             [720,"12:00"],[840,"14:00 the wheel"],[960,"16:00"]];
let series=[];
marks.forEach(([t,lbl])=>{
  clock=t;
  const al=plateauStrength("al"), fr=plateauStrength("fr"), cut=centreSeparation();
  series.push({t,al,fr,cut});
  console.log(`  ${lbl.padEnd(22)} on the heights: Allied ${String(al).padStart(6)}  French ${String(fr).padStart(6)}  ${cut?"ARMY CUT":""}`);
});
const start=series[0].al, low=Math.min(...series.slice(0,4).map(s=>s.al));
if(!(low<start*0.55)) errs.push("the Allied centre never visibly empties before Soult attacks");
const frLate=series.find(s=>s.t===660);
if(!(frLate&&frLate.fr>4000)) errs.push("the French never hold the plateau in strength");
clock=T_MIN;
const early=Object.keys(units).filter(id=>posNow(id));
clock=900;
const late=Object.keys(units).filter(id=>posNow(id));
console.log(`\nformations on the field at 04:00: ${early.length}, at 15:00: ${late.length}`);
["kamensky","heightguns"].forEach(id=>{
  clock=T_MIN; const a=!!posNow(id);
  clock=900;   const b=!!posNow(id);
  if(a) errs.push(`${id} is present at 04:00 but should not appear until later`);
  if(!b&&id==="heightguns") errs.push(`${id} never appears`);
});
clock=240;
if(centreSeparation()) errs.push("the army is reported cut in two before the battle begins");
const cutEver=series.some(s=>s.cut);
if(!cutEver) warns.push("the derived reading never reports the Allied army as cut in two");

/* T-3 (docs/FINAL_AUDIT.md): a warning is an error unless it is acknowledged here by its exact text, with the reason it stands and where
   that is recorded ({w, why, see}); an acknowledged warning that is no longer raised is an error too, until its entry is removed. None
   today. */
const KNOWN_WARN=[];
{ const uw=[...new Set(warns)];
  uw.filter(w=>!KNOWN_WARN.some(k=>k.w===w)).forEach(w=>errs.push("warning not acknowledged in KNOWN_WARN: "+w));
  KNOWN_WARN.filter(k=>!uw.includes(k.w)).forEach(k=>errs.push("acknowledged warning no longer raised (remove it from KNOWN_WARN): "+k.w));
  KNOWN_WARN.forEach(k=>{ if(!k.why||!k.see) errs.push("KNOWN_WARN entry without its reason or its record: "+k.w); }); }

const uniq=[...new Set(errs)];
console.log("\nERRORS:",errs.length,uniq.length<errs.length?"("+uniq.length+" distinct)":"");
uniq.slice(0,12).forEach(e=>console.log("  ! "+e));
console.log("warnings:",warns.length,"("+KNOWN_WARN.length+" acknowledged)");
warns.forEach(w=>{ const k=KNOWN_WARN.find(x=>x.w===w); console.log("  ~ "+w+(k?"  [acknowledged: "+k.why+"]":"")); });
process.exitCode=errs.length?1:0;
