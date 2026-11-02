/* audit-post8 (state), third run: two follow-ups of props-bundle.js. Drives the built app (bundle.js of an isolated copy) in runtime-test.js's
   stubbed environment. Read-only on the repository.
   Usage: node props-bundle3.js <iso-root>  > out.txt
   D1  the phases stepped quickly with the clock stopped (PageDown's own call, setClock(PHASES[ph+1].t0), the rail's keydown): a second step
       0.5 s after the first; the outgoing group's opacity before and after (applyOverlayOpacity), against TRANS_MS
   D2  a theme chosen while the clock plays, with the frame's own order (tween, tickClock, followStep): where the camera's target is when the
       theme's glide ends and two seconds later, against the theme's authored view (chapterCam) */
const AU_fs=require('fs'), AU_Module=require('module'), AU_path=require('path');
const AU_ISO=AU_path.resolve(process.argv[2]||'.'); process.chdir(AU_ISO);
require=AU_Module.createRequire(AU_ISO+'/runtime-test.js');
const AU_LOG=(...a)=>process.stdout.write(a.join(' ')+'\n');
const AU_tLoad=Date.now();
eval(require(AU_path.join(__dirname,'load-bundle.js')).prelude(AU_ISO));
AU_LOG(`loaded the bundle in ${((Date.now()-AU_tLoad)/1000).toFixed(0)} s; init errors ${errs.length}; warnings ${warns.length}`);
console.warn=(...a)=>warns.push(a.join(' ')); console.error=(...a)=>errs.push(a.join(' '));
let AU_T=1e7; performance.now=()=>AU_T;
function AU_block(name,fn){ const t0=Date.now(); AU_LOG(`\n=== ${name}`); try{ fn(); }catch(e){ AU_LOG('THREW '+e.message+'\n'+(e.stack||'').split('\n').slice(1,5).join('\n')); } AU_LOG(`(${((Date.now()-t0)/1000).toFixed(1)} s)`); }
const AU_DT=1000/60;
closeFirst(null);
function AU_frames(ms){ const n=Math.round(ms/AU_DT); for(let i=0;i<n;i++){ AU_T+=AU_DT; if(tween) tween(AU_T); tickClock(AU_DT); followStep(AU_DT); applyOverlayOpacity(); } }
AU_block('D1 two phase steps half a second apart, the clock stopped',()=>{
  stopPlay(); setMode('terrain');
  [[1,2],[2,3],[3,4],[4,5]].forEach(([a,b])=>{
    setClock(PHASES[a].t0-5,{instant:true,force:true}); AU_frames(3000);
    setClock(PHASES[a].t0); AU_frames(500);   /* PageDown: the next phase's start */
    const mats=overlayMats.slice(), before=Math.max(0,...mats.map(m=>m.opacity)), fin=ovFadeIn;
    setClock(PHASES[b].t0); applyOverlayOpacity();   /* PageDown again, 0.5 s later */
    const after=Math.max(0,...mats.map(m=>m.opacity));
    AU_LOG(`  ${fmtClock(PHASES[a].t0)} then ${fmtClock(PHASES[b].t0)} 0.5 s later: the ${fmtClock(PHASES[a].t0)} phase's ${mats.length} overlay materials had faded in to ${fin.toFixed(2)} (largest opacity ${before.toFixed(2)}); leaving, they are drawn at ${after.toFixed(2)}, then fade out over ${(0.42*TRANS_MS/1000).toFixed(2)} s`);
  });
});
AU_block('D2 a theme chosen while the clock plays: the camera after its glide',()=>{
  stopPlay(); setMode('terrain'); setSpeed(0.5); setClock(560,{instant:true,force:true}); freeCam=false; togglePlay(); AU_frames(1000);
  const c=ANALYSIS.find(x=>x.id!==chapter)||ANALYSIS[0], cam=presetFrame(chapterCam(c));
  setChapter(c.id);
  const dist=()=>Math.hypot(orbitTarget.x-cam[3],orbitTarget.z-cam[5]);
  AU_frames(1700); const d1=dist(), c1=clock, p1=playing;
  AU_frames(2000); const d2=dist(), c2=clock;
  AU_frames(4000); const d3=dist(), c3=clock;
  AU_LOG(`  theme "${c.id}" (its moment ${fmtClock(chapterClock(c))}) chosen while playing: 1.7 s later (the glide's 1.6 s over) playing ${p1}, clock ${fmtClock(c1)}, the target ${d1.toFixed(1)} units from the theme's authored target; 3.7 s: clock ${fmtClock(c2)}, ${d2.toFixed(1)} units; 7.7 s: clock ${fmtClock(c3)}, ${d3.toFixed(1)} units (freeCam ${freeCam}, Follow ${FOLLOW.T?'following':'idle'})`);
  stopPlay(); setChapter(null);
});
AU_LOG(`\nwarnings ${warns.length}; errors ${errs.length}${errs.length?': '+errs.slice(0,3).join(' | '):''}; total ${((Date.now()-AU_tLoad)/1000).toFixed(0)} s`);
process.exit(0);
