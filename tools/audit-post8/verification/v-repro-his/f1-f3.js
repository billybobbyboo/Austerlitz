/* v-repro-his, history #1 and #3, in node on the isolated copy (the model's own posAtClock; distances are computed here).
   f1: Legrand's leg @2->@4 against the III Column (prz) and the Sokolnitz castle site (world.js LANDMARK_SITES.castle), minute by minute
       08:00-09:30, on this build; and the same leg against prz's anchors as they stood before 8J (archive/stage8h-24e29da7.html, read here).
   f3: who stands near Blasowitz and Krug: every non-hq Allied formation's distance to Blasowitz at the event's minute (11:15) and over
       10:30-11:30; the Russian Guard's closest approach to Blasowitz and Krug over the whole day.
   node f1-f3.js f1|f3   (ISO=<isolated copy>) */
const fs=require('fs'), path=require('path');
const {load,ISO}=require('./load.js'); const M=load();
const km=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])*KM_PER_MAP;
const P=(id,t)=>(goneAt(id,t)||notYetAt(id,t))?null:posAtClock(id,t);
const village=n=>{ const v=VILLAGES.find(v=>v[0]===n); return [v[1],v[2]]; };
const which=process.argv[2];
if(which==='f1'){
  const src=fs.readFileSync(path.join(ISO,'world.js'),'utf8'); const m=src.match(/var LANDMARK_SITES=\{castle:\[([\d.]+),([\d.]+)\]/); const C=[+m[1],+m[2]];
  console.log('castle site (world.js LANDMARK_SITES.castle):',C);
  let best={d:1e9}, bestC={d:1e9};
  for(let t=480;t<=570;t+=0.25){ const a=P('legrand',t), b=P('prz',t); const d=km(a,b)*1000, dc=km(a,C)*1000;
    if(d<best.d) best={d,t,a,b}; if(dc<bestC.d) bestC={d:dc,t}; }
  console.log(`closest legrand-prz on this build: ${best.d.toFixed(0)} m at ${fmtClock(Math.round(best.t))} (${best.t} min), legrand [${best.a.map(x=>x.toFixed(1))}], prz [${best.b}]`);
  console.log(`closest legrand-castle on this build: ${bestC.d.toFixed(0)} m at ${fmtClock(Math.round(bestC.t))} (${bestC.t} min)`);
  for(const t of [525,531]){ clock=t; console.log(fmtClock(t),'legrand',P('legrand',t).map(x=>x.toFixed(1)),stateAt('legrand',textPhase('legrand',t)).st,'| prz',P('prz',t),stateAt('prz',textPhase('prz',t)).st,'|',(km(P('legrand',t),P('prz',t))*1000).toFixed(0),'m apart |',(km(P('legrand',t),C)*1000).toFixed(0),'m from the castle site'); }
  /* before 8J: prz@2 [238,332] and @4 [233,344], both reached at their phases' start (no tm on either, as on this build), Legrand unchanged */
  const H=fs.readFileSync('/home/user/Austerlitz/archive/stage8h-24e29da7.html','utf8');
  const i0=H.search(/\n *prz:\{ ech/); if(i0<0) throw new Error('prz not found in 8H'); const blk=H.slice(i0, i0+3000);
  const p2=blk.match(/\n\s+2:\{p:\[(\d+),(\d+)\]/), p4=blk.match(/\n\s+4:\{p:\[(\d+),(\d+)\]/);
  const A2=[+p2[1],+p2[2]], A4=[+p4[1],+p4[2]];
  let b8h={d:1e9}; for(let t=480;t<=570;t+=0.25){ const u=(t-480)/90, q=[A2[0]+(A4[0]-A2[0])*u, A2[1]+(A4[1]-A2[1])*u], a=P('legrand',t); const d=km(a,q)*1000; if(d<b8h.d) b8h={d,t}; }
  console.log(`8H's prz@2 ${JSON.stringify(A2)} @4 ${JSON.stringify(A4)}: closest legrand-prz then ${b8h.d.toFixed(0)} m at ${fmtClock(Math.round(b8h.t))}`);
}
if(which==='f3'){
  const B=village('Blasowitz'), K=village('Krug'); console.log('Blasowitz',B,'Krug',K);
  for(const t of [630,660,675,690]){ clock=t; const rows=[];
    Object.keys(units).forEach(id=>{ const f=FORMATIONS[id]; if(f.nation==='fr'||f.arm==='hq') return; const p=P(id,t); if(!p) return; rows.push([id,km(p,B)]); });
    rows.sort((a,b)=>a[1]-b[1]); console.log(fmtClock(t)+' nearest Allied (non-hq) to Blasowitz: '+rows.slice(0,6).map(r=>r[0]+' '+r[1].toFixed(2)+' km').join(', ')); }
  ['rg_inf','rg_cav'].forEach(id=>{ let bB={d:1e9}, bK={d:1e9}; for(let t=T_MIN;t<=T_MAX;t++){ const p=P(id,t); if(!p) continue; const dB=km(p,B), dK=km(p,K); if(dB<bB.d) bB={d:dB,t}; if(dK<bK.d) bK={d:dK,t}; }
    console.log(`${id}: closest to Blasowitz ${bB.d.toFixed(2)} km at ${fmtClock(bB.t)}; to Krug ${bK.d.toFixed(2)} km at ${fmtClock(bK.t)}; @0 [${FORMATIONS[id].track[0].p}] ${km(FORMATIONS[id].track[0].p,village('Krzenowitz')).toFixed(2)} km from Krzenowitz, cf ${FORMATIONS[id].track[0].cf}`); });
  const e=EVENTS.find(e=>e.id==='blasowitz'); console.log('event blasowitz: t',e.t,'forms',e.forms,'tolKm',e.tolKm,'claim',e.claim,'cf',e.cf);
  e.forms.forEach(id=>{ clock=e.t; console.log('  named',id,km(P(id,e.t),e.p).toFixed(2),'km from the marker at',fmtClock(e.t)); });
}
