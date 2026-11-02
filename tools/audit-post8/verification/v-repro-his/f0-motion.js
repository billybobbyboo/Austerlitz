/* v-repro-his, history #0: a formation's displayed status (the card's and dossier's liveStatus: stateAt at textPhase) against its own
   movement, computed here from posAtClock alone (the velocity is the position 2.5 min after less the position 2.5 min before; the facing a
   moving block takes is its heading: app.js poseBlock, "var want=headingAt(id,clock)", so the heading is the velocity's direction).
   For each formation: every 5 minutes in [from,to], the displayed status, the speed, the distance to a named opponent and to the nearest
   non-hq enemy, the rate at which those distances change (negative: closing), and the angle between the movement and the bearing to them.
   node f0-motion.js   (ISO=<isolated copy>) */
const {load}=require('./load.js'); load();
const deg=r=>(r*180/Math.PI);
const ang=(v,u)=>{ const a=Math.atan2(v[0],v[1]), b=Math.atan2(u[0],u[1]); let d=a-b; while(d>Math.PI) d-=2*Math.PI; while(d<-Math.PI) d+=2*Math.PI; return Math.abs(deg(d)); };
const P=(id,t)=>(goneAt(id,t)||notYetAt(id,t))?null:posAtClock(id,t);
const shown=(id,t)=>{ clock=t; const s=stateAt(id,textPhase(id,t)); return s&&s.st; };
function nearestEnemy(id,t){ const f=FORMATIONS[id], me=P(id,t); let best=null,bd=1e9;
  Object.keys(units).forEach(k=>{ const g=FORMATIONS[k]; if(g.arm==='hq'||(g.nation==='fr')===(f.nation==='fr')) return; const q=P(k,t); if(!q) return; const d=Math.hypot(q[0]-me[0],q[1]-me[1]); if(d<bd){bd=d;best=k;} });
  return best; }
const CASES=[
  {id:'rg_inf', opp:'vandamme', from:675, to:770},
  {id:'rg_cav', opp:'vandamme', from:675, to:770},
  {id:'lich',   opp:'kellermann', from:630, to:680},
  {id:'milo',   opp:'sthilaire', from:570, to:680},
  {id:'kollo',  opp:'sthilaire', from:600, to:640}];
const out=[];
for(const c of CASES){
  out.push(`== ${c.id} (opponent named here: ${c.opp}); anchors: `+anchorList(c.id).map(a=>`@${a.ph}${a.p?'['+a.p+']':' gone'} arr ${fmtClock(a.arr)}${a.w?' w '+a.w.map(fmtClock).join('-'):''}`).join('; '));
  let away=0, n=0, first=null, last=null;
  for(let t=c.from;t<=c.to;t+=5){
    const me=P(c.id,t), a=P(c.id,t-2.5), b=P(c.id,t+2.5); if(!me||!a||!b) continue;
    const v=[b[0]-a[0],b[1]-a[1]], kmh=Math.hypot(v[0],v[1])*KM_PER_MAP*12;   /* 5 minutes -> per hour */
    const st=shown(c.id,t), lab=STATUS[st]?STATUS[st].label:st;
    const ne=nearestEnemy(c.id,t);
    const row=[c.opp,ne].map(k=>{ const q=P(k,t), qa=P(k,t-2.5), qb=P(k,t+2.5); if(!q) return k+' -';
      const d=Math.hypot(q[0]-me[0],q[1]-me[1])*KM_PER_MAP, d0=Math.hypot(qa[0]-a[0],qa[1]-a[1])*KM_PER_MAP, d1=Math.hypot(qb[0]-b[0],qb[1]-b[1])*KM_PER_MAP;
      const g=kmh>0.05?ang(v,[q[0]-me[0],q[1]-me[1]]).toFixed(0):'-';
      return `${k} ${d.toFixed(2)} km (${((d1-d0)*12).toFixed(2)} km/h) angle ${g}`; });
    const mv=kmh>0.05?`moving ${kmh.toFixed(2)} km/h toward ${deg(Math.atan2(v[0],-v[1])).toFixed(0)} deg (compass, map north up)`:'still';
    out.push(`${fmtClock(t)} shown "${lab}" (${st}) ${mv} | ${row.join(' | ')}`);
    if(kmh>0.05&&/attack|charg|advanc|pursu/.test(st)){ n++; const q=P(c.opp,t); if(q&&ang(v,[q[0]-me[0],q[1]-me[1]])>120){ away++; if(first===null) first=t; last=t; } }
  }
  out.push(`-> ${c.id}: ${n} moving samples with an offensive status, ${away} of them more than 120 deg off the bearing to ${c.opp}`+(first!==null?` (${fmtClock(first)}-${fmtClock(last)})`:''));
}
console.log(out.join('\n'));
