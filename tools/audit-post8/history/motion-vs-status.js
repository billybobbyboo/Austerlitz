/* A moving formation faces its heading (app.js poseBlock: headingAt before enemyFacing). Flagged here, every 5 minutes: a formation shown
   with an offensive status (attacking, charging, counterattack, advancing, pursuing) while moving away from every enemy within 3 km
   (its heading more than 120 degrees off the bearing to the nearest enemy), and a formation shown retreating/withdrawing/repulsed while
   moving toward the nearest enemy (within 60 degrees). Runs of consecutive samples are merged. */
const {load}=require('./load.js'); load({state:true});
const OFF={attacking:1,charging:1,counterattack:1,advancing:1,pursuing:1}, BACK={retreating:1,withdrawing:1,repulsed:1};
const bearing=(a,b)=>{ const wa=W(a[0],a[1]), wb=W(b[0],b[1]); return Math.atan2(wb[0]-wa[0],wb[1]-wa[1]); };
const dAng=(x,y)=>{ let d=x-y; while(d>Math.PI) d-=2*Math.PI; while(d<-Math.PI) d+=2*Math.PI; return Math.abs(d)*180/Math.PI; };
const runs={};
for(let t=T_MIN;t<=T_MAX;t+=5){ clock=t; const ph=phaseAt(t);
  Object.keys(units).forEach(id=>{ const f=FORMATIONS[id]; if(f.arm==='hq') return; const me=posNow(id); if(!me) return; const h=headingAt(id,t); if(h===null) return;
    const mr=marchRate(id,t); if(!mr||mr.kmh<0.5) return;
    let best=null,bd=1e9; Object.keys(units).forEach(k=>{ const g=FORMATIONS[k]; if(g.arm==='hq'||(g.nation==='fr')===(f.nation==='fr')) return; const q=posNow(k); if(!q) return; const d=Math.hypot(q[0]-me[0],q[1]-me[1]); if(d<bd){bd=d;best=k;} });
    if(!best||bd*KM_PER_MAP>3) return; const s=stateAt(id,ph); const a=dAng(h,bearing(me,posNow(best)));
    let flag=null; if(OFF[s.st]&&a>120) flag='offensive status, moving away'; else if(BACK[s.st]&&a<60) flag='retreat status, moving toward the enemy';
    if(!flag) return; const k=id+'|'+s.st+'|'+flag; (runs[k]=runs[k]||[]).push({t,best,km:bd*KM_PER_MAP,a,kmh:mr.kmh}); }); }
Object.keys(runs).forEach(k=>{ const v=runs[k]; const [id,st,flag]=k.split('|');
  console.log(`${id} "${st}" ${flag}: ${fmtClock(v[0].t)}-${fmtClock(v[v.length-1].t)} (${v.length*5} min sampled); e.g. ${fmtClock(v[0].t)} nearest enemy ${v[0].best} ${v[0].km.toFixed(2)} km, heading ${v[0].a.toFixed(0)} deg off it, ${v[0].kmh.toFixed(2)} km/h`); });
