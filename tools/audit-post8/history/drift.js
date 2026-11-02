/* Legs drawn as a slow drift: a formation whose plotted leg lasts over 90 minutes at under 1 km/h moves continuously across the map for the
   whole window (the engine interpolates linearly from the previous anchor's arrival unless moveMin or tm.dep holds it). While it does, the
   dossier's march row reads "Marching" (marchRate().moving), beside a status that may say "In reserve" or "Holding". Listed with the status
   the formation shows during the leg. */
const {load}=require('./load.js'); load({state:true});
const rows=[];
Object.keys(FORMATIONS).forEach(id=>{ const f=FORMATIONS[id]; if(!f.track) return; const A=anchorList(id);
  for(let i=1;i<A.length;i++){ const a=A[i-1], b=A[i]; if(a.p===null||b.p===null) continue; const w=b.w; const km=legPath(a,b).len*KM_PER_MAP; const min=w[1]-w[0]; if(min<=0) continue; const kmh=km/(min/60);
    if(min>90 && kmh<1 && km>0.2){ const mid=(w[0]+w[1])/2; clock=mid; const s=stateAt(id,phaseAt(mid)); const mr=marchRate(id,mid);
      rows.push(`${id.padEnd(11)} ${a.ph}->${b.ph} ${fmtClock(w[0])}-${fmtClock(w[1])} ${km.toFixed(2)} km in ${min} min = ${kmh.toFixed(2)} km/h; at ${fmtClock(mid)} status "${STATUS[s.st]?STATUS[s.st].label:s.st}", dossier row "${mr&&mr.moving?'Marching':'Next move'}"${b.moveMin?' moveMin '+b.moveMin:''}`); } } });
console.log(rows.length+' slow-drift legs (over 90 min, under 1 km/h, over 0.2 km):'); rows.forEach(r=>console.log(r));
