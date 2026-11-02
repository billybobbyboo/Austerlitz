/* When the derived "centre separation" is reported over the day (app.js centreSeparation, SEP_KM 1.45), every 5 minutes, with the French
   formation that cuts the line and the two Allied centroids; and the plateau reading (Allied) at the same clocks. */
const {load}=require('./load.js'); load();
let prev=null; const runs=[];
for(let t=T_MIN;t<=T_MAX;t+=5){ clock=t; const c=centreSeparation(); if(c!==prev){ runs.push([t,c]); prev=c; } }
console.log('centreSeparation changes: '+runs.map(r=>fmtClock(r[0])+' '+(r[1]?'ON':'off')).join(', '));
[240,420,525,570,600,630,660,675,720,765,800,840,870,880,900,960,1020].forEach(t=>{ clock=t; const a=sideCentroid('al','south'), b=sideCentroid('al','north');
  let who=[]; Object.keys(units).forEach(id=>{ const f=FORMATIONS[id]; if(f.nation!=='fr'||f.arm==='hq') return; const p=posNow(id); if(!p||!a||!b) return; const vx=b[0]-a[0], vy=b[1]-a[1], L=vx*vx+vy*vy; const u=((p[0]-a[0])*vx+(p[1]-a[1])*vy)/L; if(u<0.18||u>0.82) return; const qx=a[0]+vx*u, qy=a[1]+vy*u; const d=Math.hypot(p[0]-qx,p[1]-qy)*KM_PER_MAP; if(d<1.45) who.push(id+' '+d.toFixed(2)+'km'); });
  const sAl=[], nAl=[]; Object.keys(units).forEach(id=>{ const f=FORMATIONS[id]; if(f.arm==='hq'||f.nation==='fr') return; const p=posNow(id); if(!p) return; const dn=GEOREF.northingKm(p[0],p[1])-PBERG_NORTHING; (dn>0?nAl:sAl).push(id); });
  console.log(`${fmtClock(t)} sep=${centreSeparation()} plateauAl=${plateauStrength('al')} southC=${a&&a.map(x=>x.toFixed(0))} northC=${b&&b.map(x=>x.toFixed(0))} south=[${sAl}] north=[${nAl}] cutters=[${who}]`); });
