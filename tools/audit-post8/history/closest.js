/* The closest approach of every pair of opposing formations over the day (1-minute samples), with both statuses and whether each is moving:
   centres within 150 m mean the two drawn blocks stand in one another. */
const {load}=require('./load.js'); load({state:true});
const ids=Object.keys(FORMATIONS).filter(id=>FORMATIONS[id].track&&FORMATIONS[id].arm!=='hq');
const fr=ids.filter(i=>FORMATIONS[i].nation==='fr'), al=ids.filter(i=>FORMATIONS[i].nation!=='fr');
const best={};
for(let t=T_MIN;t<=T_MAX;t+=1){ clock=t; const P={}; ids.forEach(i=>P[i]=posNow(i));
  fr.forEach(a=>{ if(!P[a]) return; al.forEach(b=>{ if(!P[b]) return; const km=Math.hypot(P[a][0]-P[b][0],P[a][1]-P[b][1])*KM_PER_MAP; const k=a+' x '+b; if(!best[k]||km<best[k].km) best[k]={km,t}; }); }); }
const rows=Object.keys(best).map(k=>({k,...best[k]})).filter(r=>r.km<0.25).sort((x,y)=>x.km-y.km);
rows.forEach(r=>{ clock=r.t; const [a,b]=r.k.split(' x '); const ph=phaseAt(r.t); const La=legAt(a,r.t), Lb=legAt(b,r.t);
  const mv=L=>L&&L.b&&L.u>0&&L.u<1?'moving':'halted';
  console.log(`${r.k}: ${(r.km*1000).toFixed(0)} m at ${fmtClock(r.t)}; ${a} ${stateAt(a,ph).st} ${mv(La)}; ${b} ${stateAt(b,ph).st} ${mv(Lb)}`); });
