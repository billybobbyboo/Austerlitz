/* audit-post8 (state), second run: the open dossier against the clock. Drives the built app (bundle.js of an isolated copy) in runtime-test.js's
   stubbed environment, as props-bundle.js does. Read-only on the repository.
   Usage: node props-bundle2.js <iso-root>  > out.txt
   C1  a formation's compact card and full dossier while the clock moves inside one leg (the slider's own call, setClock): is the dossier
       repainted (paintDrawerBody), and do the rows it shows with the clock ("Where", "Position at HH:MM", the day-track's dot "at HH:MM")
       still say what the model says at the new clock?
   C2  the same for a formation standing still within a phase
   C3  a place's dossier ("Formations nearby now") under everyone's reading and under a headquarters reading, the clock moved within a phase
   C4  an aggregate's card ("Midpoint") while its formations march */
const AU_fs=require('fs'), AU_Module=require('module'), AU_path=require('path');
const AU_ISO=AU_path.resolve(process.argv[2]||'.'); process.chdir(AU_ISO);
require=AU_Module.createRequire(AU_ISO+'/runtime-test.js');
const AU_LOG=(...a)=>process.stdout.write(a.join(' ')+'\n');
const AU_tLoad=Date.now();
eval(require(AU_path.join(__dirname,'load-bundle.js')).prelude(AU_ISO));
AU_LOG(`loaded the bundle in ${((Date.now()-AU_tLoad)/1000).toFixed(0)} s; init errors ${errs.length}; warnings ${warns.length}`);
console.warn=(...a)=>warns.push(a.join(' ')); console.error=(...a)=>errs.push(a.join(' '));
function AU_block(name,fn){ const t0=Date.now(); AU_LOG(`\n=== ${name}`); try{ fn(); }catch(e){ AU_LOG('THREW '+e.message+'\n'+(e.stack||'').split('\n').slice(1,5).join('\n')); } AU_LOG(`(${((Date.now()-t0)/1000).toFixed(1)} s)`); }
closeFirst(null);
/* count the dossier's repaints, and keep what each repaint read: the clock, and the rows' model values at that clock */
let AU_paints=[]; const AU_pdb=paintDrawerBody;
paintDrawerBody=function(){ const s=selection; let rec={clock:clock};
  if(s&&s.kind==="f"){ const p=posNow(s.id); rec.where=p?nearestFeature(p):null; }
  if(s&&s.kind==="t"){ const ft=FEATURES.find(x=>x.id===s.id); rec.nearby=ft?placeNearby(ft).join(","):null; }
  AU_paints.push(rec); return AU_pdb.apply(this,arguments); };
/* a leaf with a long leg inside one phase: the leg's window inside the phase, at least 30 minutes */
function AU_longLeg(minLen){
  const out=[];
  Object.keys(FORMATIONS).filter(id=>FORMATIONS[id].track).forEach(id=>{ const A=anchorList(id);
    for(let i=1;i<A.length;i++){ const a=A[i-1], b=A[i]; if(!a.p||!b.p||!b.w) continue; const w0=b.w[0], w1=b.w[1];
      if(w1-w0<minLen) continue; if(phaseAt(w0+1)!==phaseAt(w1-1)) continue;
      if(legPath(a,b).len*KM_PER_MAP<1.0) continue; out.push({id,w0,w1,km:legPath(a,b).len*KM_PER_MAP}); } });
  return out.sort((x,y)=>y.km-x.km);
}
AU_block('C1 a marching formation\'s card and full dossier while the clock moves inside its leg',()=>{
  setCommandView('none');
  const L=AU_longLeg(30); AU_LOG(`  ${L.length} legs of 30+ minutes inside one phase and 1+ km; using the five longest`);
  L.slice(0,5).forEach(g=>{
    [false,true].forEach(full=>{
      setClock(g.w0+3,{instant:true,force:true}); select(null,null); select('f',g.id); if(full){ dossierExpanded=true; paintDrawer(); }
      const n0=AU_paints.length, first=AU_paints[n0-1];
      const ts=[g.w0+8,g.w0+(g.w1-g.w0)/2,g.w1-3]; const rows=[];
      ts.forEach(t=>{ setClock(t); const p=posNow(g.id); rows.push(`${fmtClock(t)}: model "${p?nearestFeature(p):'-'}"`); });
      const painted=AU_paints.length-n0, last=AU_paints[AU_paints.length-1];
      AU_LOG(`  ${g.id} ${full?'full dossier':'card'}, leg ${fmtClock(g.w0)}-${fmtClock(g.w1)} (${g.km.toFixed(1)} km, phase ${phaseAt(g.w0+1)}): painted at ${fmtClock(first.clock)} "${first.where}"; repaints while the clock moved to ${fmtClock(ts[2])}: ${painted}; the dossier now shows the clock of ${fmtClock(last.clock)} and "${last.where}"; ${rows.join('; ')}`);
      dossierExpanded=false; });
  });
  select(null,null);
});
AU_block('C2 a standing formation\'s full dossier (its "Position at HH:MM" row and day-track caption) while the clock moves within a phase',()=>{
  setCommandView('none');
  /* a leaf standing still at its anchor for 40+ minutes inside one phase */
  let pick=null;
  Object.keys(FORMATIONS).filter(id=>FORMATIONS[id].track).some(id=>{ for(let t=T_MIN+5;t<T_MAX-45;t+=5){ const L0=legAt(id,t), L1=legAt(id,t+40);
      if(L0&&L1&&L0.a===L1.a&&(!L0.b||L0.u<=0)&&(!L1.b||L1.u<=0)&&phaseAt(t)===phaseAt(t+40)&&posNow(id)!==undefined){ pick={id,t}; return true; } } return false; });
  if(!pick){ AU_LOG('  none found'); return; }
  setClock(pick.t,{instant:true,force:true}); select(null,null); select('f',pick.id); dossierExpanded=true; paintDrawer();
  const n0=AU_paints.length; [10,20,40].forEach(d=>setClock(pick.t+d));
  AU_LOG(`  ${pick.id} standing from ${fmtClock(pick.t)}: dossier painted at ${fmtClock(AU_paints[n0-1].clock)}; repaints while the clock moved to ${fmtClock(pick.t+40)}: ${AU_paints.length-n0} (its rows "Position at ${fmtClock(AU_paints[AU_paints.length-1].clock)}" and the day-track's "at ${fmtClock(AU_paints[AU_paints.length-1].clock)}" stand while the timeline reads ${fmtClock(clock)})`);
  dossierExpanded=false; select(null,null);
});
AU_block('C3 a place\'s dossier, "Formations nearby now", within a phase',()=>{
  ['none','fr'].forEach(cv=>{
    setCommandView(cv); let shown=0, stale=0, ex=[];
    FEATURES.forEach(ft=>{
      for(let ph=0;ph<PHASES.length;ph++){ const t0=PHASES[ph].t0+1, t1=PHASES[ph].t1-1;
        setClock(t0,{instant:true,force:true}); select(null,null); select('t',ft.id);
        const n0=AU_paints.length, a=AU_paints[n0-1].nearby; setClock(t1); const b=placeNearby(ft).join(","), painted=AU_paints.length-n0, last=AU_paints[AU_paints.length-1].nearby;
        shown++; if(last!==b){ stale++; if(ex.length<6) ex.push(`${ft.id} ${fmtClock(t0)}->${fmtClock(t1)}: shows [${last}] (repaints ${painted}), the model [${b}]`); } } });
    AU_LOG(`  reading ${cv}: ${shown} place-phases; the list shown differs from the model at the phase's last minute in ${stale}`); ex.forEach(e=>AU_LOG('    '+e));
  });
  setCommandView('none'); select(null,null);
});
AU_block('C4 an aggregate\'s card while its formations march',()=>{
  setCommandView('none');
  const aggs=Object.keys(FORMATIONS).filter(id=>!FORMATIONS[id].track&&FORMATIONS[id].children);
  let res=[];
  aggs.forEach(id=>{ for(let ph=1;ph<PHASES.length;ph++){ const t0=PHASES[ph].t0+2, t1=PHASES[ph].t1-2;
      setClock(t0,{instant:true,force:true}); select(null,null); select('f',id); const n0=AU_paints.length; const p0=posNow(id);
      setClock(t1); const p1=posNow(id), painted=AU_paints.length-n0;
      if(p0&&p1&&nearestFeature(p0)!==nearestFeature(p1)&&!painted) res.push(`${id} phase ${ph}: card "Midpoint ${nearestFeature(p0)}" kept at ${fmtClock(t1)}, the model's midpoint "${nearestFeature(p1)}"`); } });
  AU_LOG(`  ${res.length} aggregate-phases whose card keeps a midpoint the model has left (no repaint)`); res.slice(0,8).forEach(r=>AU_LOG('    '+r));
  select(null,null);
});
AU_LOG(`\nwarnings ${warns.length}; errors ${errs.length}${errs.length?': '+errs.slice(0,3).join(' | '):''}; total ${((Date.now()-AU_tLoad)/1000).toFixed(0)} s`);
process.exit(0);
