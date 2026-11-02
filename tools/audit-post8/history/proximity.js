/* Opposing formations' plotted centres closer than a threshold (true distance, KM_PER_MAP), sampled every 5 minutes over the day: an
   interpolated leg that passes through an enemy formation, or two enemies drawn on one spot. Statuses printed so that a melee
   (attacking/charging/engaged) can be told from a march through an enemy. Also: each formation's nearest enemy at each phase's middle. */
const {load}=require('./load.js'); load({state:true});
const TH=+(process.argv[2]||0.35);
const ids=Object.keys(FORMATIONS).filter(id=>FORMATIONS[id].track&&FORMATIONS[id].arm!=='hq');
const fr=ids.filter(i=>FORMATIONS[i].nation==='fr'), al=ids.filter(i=>FORMATIONS[i].nation!=='fr');
const close={};
for(let t=T_MIN;t<=T_MAX;t+=5){ clock=t; const ph=phaseAt(t);
  fr.forEach(a=>{ const pa=posNow(a); if(!pa) return; al.forEach(b=>{ const pb=posNow(b); if(!pb) return;
    const km=Math.hypot(pa[0]-pb[0],pa[1]-pb[1])*KM_PER_MAP; if(km>=TH) return;
    const k=a+' x '+b; const sa=stateAt(a,ph), sb=stateAt(b,ph);
    const La=legAt(a,t), Lb=legAt(b,t); const ma=La&&La.b&&La.u>0&&La.u<1, mb=Lb&&Lb.b&&Lb.u>0&&Lb.u<1;
    (close[k]=close[k]||[]).push(`${fmtClock(t)} ${(km*1000).toFixed(0)}m ${a}:${sa.st}${ma?'(moving)':''} ${b}:${sb.st}${mb?'(moving)':''}`); }); }); }
console.log(`== opposing formations closer than ${TH} km (5-minute samples) ==`);
Object.keys(close).forEach(k=>{ const v=close[k]; console.log(`${k}: ${v.length} samples, first ${v[0]}, last ${v[v.length-1]}`); });
