/* Strengths: aggregate vs children, the leaf rule's totals over the day, the army totals, the plateau reading against the tour's figures,
   and the numbers a visitor sees at once on counters (f.strength || aggStrength) where a parent leaf and its tracked child are both drawn. */
const {load}=require('./load.js'); load({state:true});
const F=FORMATIONS, ids=Object.keys(F);
const out=[]; const log=s=>{out.push(s);};
log('== 1. aggregates and parents: declared strength vs the sum of their children ==');
ids.forEach(id=>{ const f=F[id]; if(!f.children) return;
  const sum=f.children.reduce((a,k)=>a+(F[k].strength||0),0);
  log(`${id.padEnd(12)} declared ${String(f.strength).padStart(6)}  children ${f.children.map(k=>k+'='+(F[k].strength||0)).join(' + ')} = ${sum}  diff ${f.strength!=null?f.strength-sum:'n/a'}  ${f.track?'(tracked: the leaf rule subtracts active children)':'(aggregate)'}`);
  if(f.strengthNote) log('     note: '+f.strengthNote.slice(0,260));
});
log('\n== 2. the leaf rule: totals on the field over the day (sideOnFieldAt, every 5 min) ==');
['fr','al'].forEach(side=>{ let mx=0,mt=0,mn=1e9,mnt=0; for(let t=T_MIN;t<=T_MAX;t+=5){ const v=sideOnFieldAt(side,t); if(v>mx){mx=v;mt=t;} if(v<mn){mn=v;mnt=t;} }
  log(`${side}: max ${mx} at ${fmtClock(mt)}, min ${mn} at ${fmtClock(mnt)}`); });
const armyFr=F.gqg.army.men, armyAl=F.ahq.army.men;
log(`army totals shown in the HQ dossiers: French "${armyFr}" (${F.gqg.army.src}), Allied "${armyAl}" (${F.ahq.army.src})`);
/* sum of all leaves' strength, without the leaf rule (what a naive sum of counters would give) */
['fr','al'].forEach(side=>{ let naive=0, leaf=0; ids.forEach(id=>{ const f=F[id]; if(!f.track||f.arm==='hq') return; if((f.nation==='fr')!==(side==='fr')) return; naive+=f.strength||0; leaf+=ownStrengthAt(id,600)||0; });
  log(`${side}: naive sum of tracked formations' declared strengths ${naive}; leaf-rule sum at 10:00 ${leaf}`); });
log('\n== 3. the plateau reading (plateauStrength, Allied) against the tour stop 4 text ==');
const stop=TOUR.find(s=>/plateau outline/.test(s.x)); log('tour: '+stop.x.match(/falls from[^.]*\./)[0]);
[240,420,445,480,525,555,570,600,630,660,675].forEach(t=>{ clock=t; const by=[]; Object.keys(units).forEach(id=>{ const f=F[id]; if(f.nation==='fr') return; const own=ownStrengthAt(id,t); const p=posNow(id); if(own&&p&&onPlateau(p)) by.push(id+'='+own); });
  log(`${fmtClock(t)}: Allied ${plateauStrength('al')}  French ${plateauStrength('fr')}   [${by.join(', ')}]`); });
log('\n== 4. counters: a tracked parent and its tracked child drawn at once, each with its declared strength ==');
ids.forEach(id=>{ const f=F[id]; if(!f.track||!f.children) return; f.children.forEach(k=>{ if(!F[k].track) return;
  let both=0, first=null; for(let t=T_MIN;t<=T_MAX;t+=5){ if(activeAt(id,t)&&activeAt(k,t)){ both++; if(first==null) first=t; } }
  log(`${id} counter shows ${(f.strength||aggStrength(id))}, its child ${k} ${(F[k].strength)}; both on the field from ${first!=null?fmtClock(first):'-'} (${both*5} min); the parent's own troops by the leaf rule ${ownStrengthAt(id,first||600)}; parent note says "including": ${/includ/i.test(f.strengthNote||'')}`); }); });
log('\n== 5. HQ formations with a strength (shown on their counter and dossier) ==');
ids.forEach(id=>{ const f=F[id]; if(f.arm==='hq'&&f.strength) log(`${id} arm hq, strength ${f.strength}, tracked ${!!f.track}; children sum ${(f.children||[]).reduce((a,k)=>a+(F[k].strength||0),0)}; note: ${f.strengthNote||''}`); });
console.log(out.join('\n'));
