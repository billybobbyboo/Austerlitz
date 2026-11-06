/* every opposing pair whose drawn centres come within 0.5 km: the runs of minutes, the least distance, statuses */
const {load}=require('/home/user/Austerlitz/tools/audit-post8/history/load.js'); load({state:true});
const ids=Object.keys(FORMATIONS).filter(id=>FORMATIONS[id].track&&FORMATIONS[id].arm!=='hq');
const fr=ids.filter(i=>FORMATIONS[i].nation==='fr'), al=ids.filter(i=>FORMATIONS[i].nation!=='fr');
const runs={};
for(let t=T_MIN;t<=T_MAX;t+=1){ clock=t; const P={}; ids.forEach(i=>P[i]=posNow(i)); const ph=phaseAt(t);
  fr.forEach(a=>{ if(!P[a]) return; al.forEach(b=>{ if(!P[b]) return; const km=Math.hypot(P[a][0]-P[b][0],P[a][1]-P[b][1])*KM_PER_MAP; if(km>=0.5) return;
    const k=a+' x '+b, R=(runs[k]=runs[k]||[]), last=R[R.length-1];
    if(last&&last.t1===t-1){ last.t1=t; if(km<last.km){last.km=km;last.at=t;} } else R.push({t0:t,t1:t,km,at:t,sa:stateAt(a,ph).st,sb:stateAt(b,ph).st}); }); }); }
Object.keys(runs).sort().forEach(k=>runs[k].forEach(r=>console.log(`${k}: ${fmtClock(r.t0)}-${fmtClock(r.t1)} min ${(r.km*1000).toFixed(0)} m at ${fmtClock(r.at)} (${r.sa} / ${r.sb})`)));
