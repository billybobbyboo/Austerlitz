const {load}=require('./load.js'); load();
const km=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])*KM_PER_MAP;
for(const [a,b] of [['rg_inf','guard_cav'],['rg_cav','guard_cav'],['rg_inf','vandamme'],['rg_cav','vandamme'],['rg_inf','drouet']]){
  let best={d:1e9}; for(let t=600;t<=780;t++){ const p=posAtClock(a,t), q=posAtClock(b,t); if(!p||!q) continue; const d=km(p,q); if(d<best.d) best={d,t}; }
  console.log(a,'x',b,'closest',best.d.toFixed(2),'km at',fmtClock(best.t)); }
