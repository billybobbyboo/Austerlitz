/* Final audit after Stage 8, verification 'v-batch-his': my own probes for history findings #6-#14, run on an ISOLATED copy
   (ISO=<copy>, default the verifier's own scratch copy, application files md5-identical to HEAD; tools/mk-world-mod.js and
   tools/mk-helpers.js run there). Loading reuses verification/v-repro-his/load.js (sim-test.js's order: world module, data.js,
   analysis.js, narrative.js, the generated helpers). Positions from the model's own posAtClock (via posNow at `clock`); every
   distance, side and heading computed here. Read-only. Usage: node probe.js <name>   names: kamensky kienmayer caffarelli bourcier
   milo sokolnitz drift krug guardcorps */
process.env.ISO=process.env.ISO||'/tmp/claude-0/-home-user-Austerlitz/cb561984-b1ad-5d5a-82ba-de46bf4c820e/scratchpad/v-batch-his-iso';
const L=require('../v-repro-his/load.js'); const M=L.load();
const fmt=t=>String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
const WSRC=require('fs').readFileSync(process.env.ISO+'/world.js','utf8');
function worldVar(n){ const m=WSRC.match(new RegExp('var '+n+'\\s*=\\s*(\\[[\\s\\S]*?\\]\\]);')); return m?(0,eval)(m[1]):null; }
const GOLDBACH=worldVar('GOLDBACH_M'), LITAVA=worldVar('LITAVA_M');
const km=(a,b)=>GEOREF.kmBetween(a,b), brg=(a,b)=>GEOREF.bearingDeg(a,b);
function at(id,t){ global.clock=t; const p=posNow(id); return p?[+p[0].toFixed(2),+p[1].toFixed(2)]:null; }
const name=process.argv[2];
const out=[]; const P=(...a)=>out.push(a.join(' '));
if(name==='kamensky'){
  [470,479,480,485,490,495,500,505,509,510,515,520,524,525,540,555,570,585].forEach(t=>{
    const k=at('kamensky',t), s=at('sthilaire',t), l=at('lang',t);
    global.clock=t; const pl=plateauStrength('al'), pf=plateauStrength('fr');
    P(fmt(t),'kamensky',JSON.stringify(k),'onPlateau',k?onPlateau(k):'-','| sthilaire',JSON.stringify(s),'onPlateau',s?onPlateau(s):'-',
      '| lang',JSON.stringify(l),'| plateau al',pl,'fr',pf);
  });
  /* minute the plateau reading changes between 08:00 and 08:45 */
  let prev=null; for(let t=480;t<=525;t++){ global.clock=t; const v=plateauStrength('al'); if(prev!==null&&v!==prev) P('plateau al changes at',fmt(t),prev,'->',v); prev=v; }
  /* heading of kamensky's 08:00-08:45 leg: bearing from north, clockwise, true via GEOREF */
  const a=at('kamensky',480), b=at('kamensky',524);
  P('kamensky 08:00->08:44 true bearing deg',brg(a,b).toFixed(1),'dist km',km(a,b).toFixed(3));
  const la=at('lang',480), lb=at('lang',524);
  P('lang 08:00->08:44 true bearing deg',brg(la,lb).toFixed(1),'dist km',km(la,lb).toFixed(3));
  P('kamensky@2 to Pratzeberg GT km', GEOREF.GT.pratzeberg?km(a,GEOREF.GT.pratzeberg.map).toFixed(3):'-', '08:44', GEOREF.GT.pratzeberg?km(b,GEOREF.GT.pratzeberg.map).toFixed(3):'-');
  P('anchorList kamensky', JSON.stringify((typeof anchorList==='function'?anchorList('kamensky'):[]).map(x=>({ph:x.ph,t:x.t,dep:x.dep,arr:x.arr,p:x.p}))).slice(0,800));
}
function nearestOnLine(pt,line){ let best=null;
  for(let i=0;i<line.length-1;i++){ const a=line[i], b=line[i+1], dx=b[0]-a[0], dy=b[1]-a[1];
    let u=((pt[0]-a[0])*dx+(pt[1]-a[1])*dy)/(dx*dx+dy*dy); u=Math.max(0,Math.min(1,u)); const q=[a[0]+u*dx,a[1]+u*dy];
    const d=km(pt,q); if(!best||d<best.d) best={d,q,seg:i}; } return best; }
function brookXAt(line,y){ for(let i=0;i<line.length-1;i++){ const a=line[i], b=line[i+1]; if((a[1]-y)*(b[1]-y)<=0&&a[1]!==b[1]) return a[0]+(y-a[1])/(b[1]-a[1])*(b[0]-a[0]); } return null; }
if(name==='kienmayer'){
  const G=GOLDBACH; P('GOLDBACH_M points (world.js):',G.length,'last',JSON.stringify(G[G.length-1]));
  const tr=FORMATIONS.kienmayer.track;
  Object.keys(tr).forEach(k=>{ const p=tr[k].p; if(!p) return; const n=nearestOnLine(p,G), x=brookXAt(G.slice(0,22),p[1]);
    P('kienmayer@'+k,JSON.stringify(p),'act:',JSON.stringify(tr[k].act||''),'| nearest Goldbach km',n.d.toFixed(3),'at',JSON.stringify(n.q.map(v=>+v.toFixed(1))),'seg',n.seg,
      '| N-S reach x at its y',x===null?'-':x.toFixed(2),'side',x===null?'-':(p[0]>x?'EAST':'WEST'),'by km',x===null?'-':km(p,[x,p[1]]).toFixed(3)); });
  /* the whole day: does the marker ever stand west of the N-S reach? */
  let west=0, n=0; for(let t=T_MIN;t<=T_MAX;t+=5){ const p=at('kienmayer',t); if(!p) continue; const x=brookXAt(G.slice(0,22),p[1]); if(x===null) continue; n++; if(p[0]<x) west++; }
  P('samples every 5 min with a N-S reach at their y:',n,'west of it:',west);
  const s0=[[250,109],[240,160],[212,218],[208,256],[207,297],[204,362],[208,376],[214,410],[237,415],[276,415]];
  const x0=brookXAt(s0,400); P('Stage 0 GOLDBACH_M x at y 400:',x0.toFixed(2),'kienmayer@7 east by km',km([242,400],[x0,400]).toFixed(3));
  P('true bearing from brook point at y400 to kienmayer@7:',brg([brookXAt(G.slice(0,22),400),400],[242,400]).toFixed(1));
  P('narrative claim of kienmayer act@7:',JSON.stringify(Object.keys(STATEMENT_CLAIMS).filter(r=>/kienmayer/.test(r)).map(r=>r+':'+STATEMENT_CLAIMS[r].claim)));
}
if(name==='caffarelli'){
  const HW=M.ROADS[0].p; P('highway',M.ROADS[0].n,'points',HW.length);
  const enemies=Object.keys(units).filter(id=>FORMATIONS[id].nation!=='fr');
  for(let t=720;t<=1020;t+=15){ const c=at('caffarelli',t); if(!c) continue; const b=at('bag',t); const st=stateAt('caffarelli',phaseAt?phaseAt(t):null);
    let ne=null; enemies.forEach(id=>{ const q=at(id,t); if(!q) return; const d=km(c,q); if(!ne||d<ne.d) ne={id,d}; });
    const hw=nearestOnLine(c,HW);
    P(fmt(t),'caff',JSON.stringify(c),'| to highway km',hw.d.toFixed(2),'| to bag km',b?km(c,b).toFixed(2):'-','| northing diff km',b?(GEOREF.northingKm(b[0],b[1])-GEOREF.northingKm(c[0],c[1])).toFixed(2):'-',
      '| nearest enemy',ne?ne.id+' '+ne.d.toFixed(2):'-','| obj',st?JSON.stringify(st.obj):'?','cf',st?st.cf:'?','st',st?st.st:'?'); }
}
function segX(a,b,c,d){ const r=[b[0]-a[0],b[1]-a[1]], q=[d[0]-c[0],d[1]-c[1]], den=r[0]*q[1]-r[1]*q[0]; if(!den) return null;
  const t=((c[0]-a[0])*q[1]-(c[1]-a[1])*q[0])/den, u=((c[0]-a[0])*r[1]-(c[1]-a[1])*r[0])/den; return (t>=0&&t<=1&&u>=0&&u<=1)?[a[0]+t*r[0],a[1]+t*r[1]]:null; }
function covAtMap(p){ const w=M.W(p[0],p[1]); return +M.covAt(M.covWater,w[0],w[1]).toFixed(2); }
function roadNear(pt){ let best=null; M.ROADS.forEach(r=>{ const n=nearestOnLine(pt,r.p); if(!best||n.d<best.d) best={d:n.d,n:r.n}; }); return best; }
if(name==='bourcier'){
  ['kienmayer','dok','lang','prz','buxhowden'].forEach(e=>{ let best=null;
    for(let t=840;t<=1020;t++){ const a=at('bourcier',t), b=at(e,t); if(!a||!b) continue; const d=km(a,b); if(!best||d<best.d) best={t,d,a,b}; }
    if(best) P('bourcier vs',e,'closest',(best.d*1000).toFixed(0),'m at',fmt(best.t),JSON.stringify(best.a),JSON.stringify(best.b));
  });
  [870,878,885,890,894,900,915,930,960].forEach(t=>{ const b=at('bourcier',t), k=at('kienmayer',t), d=at('dok',t); P(fmt(t),'bourcier',JSON.stringify(b),'kien',JSON.stringify(k),'dok',JSON.stringify(d),'st kien',stateAt('kienmayer',phaseAt(t)).st,'st dok',stateAt('dok',phaseAt(t)).st); });
}
if(name==='milo'){
  P('LITAVA_M',JSON.stringify(LITAVA));
  const tr=FORMATIONS.milo.track; Object.keys(tr).forEach(k=>{ const p=tr[k].p; if(!p) return; const n=nearestOnLine(p,LITAVA);
    const ix=Math.round((p[0]+0)), w=covAtMap(p); P('milo@'+k,JSON.stringify(p),'to Litava line m',(n.d*1000).toFixed(0),'covWater',w); });
  /* every minute's step across the Litava line, and the road there */
  let prev=at('milo',T_MIN); for(let t=T_MIN+1;t<=T_MAX;t++){ const c=at('milo',t); if(prev&&c){ for(let i=0;i<LITAVA.length-1;i++){ const x=segX(prev,c,LITAVA[i],LITAVA[i+1]); if(x){ const rn=roadNear(x); P('milo crosses the Litava line at',fmt(t),JSON.stringify(x.map(v=>+v.toFixed(1))),'nearest road',rn.n,(rn.d*1000).toFixed(0)+' m'); } } } prev=c; }
}
if(name==='sokolnitz'){
  const V=[208,365]; const ids=Object.keys(units);
  for(let t=480;t<=840;t+=15){ let fr=null, al=null; ids.forEach(id=>{ const q=at(id,t); if(!q) return; const d=km(V,q); const s=FORMATIONS[id].nation==='fr'?'fr':'al';
      if(s==='fr'){ if(!fr||d<fr.d) fr={id,d}; } else { if(!al||d<al.d) al={id,d}; } });
    const lg=at('legrand',t), fi=at('friant',t), la=at('lang',t);
    P(fmt(t),'nearest fr',fr.id,fr.d.toFixed(2),'| nearest al',al.id,al.d.toFixed(2),'| legrand',lg?km(V,lg).toFixed(2):'-','friant',fi?km(V,fi).toFixed(2):'-','lang',la?km(V,la).toFixed(2):'-'); }
  const l2=FORMATIONS.lang.track[2].p; const x=brookXAt(GOLDBACH.slice(0,22),l2[1]);
  P('lang@2',JSON.stringify(l2),'to village km',km(V,l2).toFixed(3),'brook x at its y',x.toFixed(2),'east of the brook by km',km(l2,[x,l2[1]]).toFixed(3),'cf',FORMATIONS.lang.track[2].cf);
  P('friant min distance to village all day:',(()=>{let b=1e9,bt=0; for(let t=T_MIN;t<=T_MAX;t++){const q=at('friant',t); if(q){const d=km(V,q); if(d<b){b=d;bt=t;}}} return b.toFixed(2)+' km at '+fmt(bt);})());
  P('legrand anchors',JSON.stringify(Object.keys(FORMATIONS.legrand.track).map(k=>k+':'+JSON.stringify(FORMATIONS.legrand.track[k].p))));
}
if(name==='drift'){
  if(typeof marchRate!=='function') (0,eval)(L.fnSrc('marchRate'));
  if(typeof liveStatus!=='function'){ try{ (0,eval)(L.fnSrc('liveStatus')); }catch(e){ P('liveStatus not loaded',e.message); } }
  const lab=st=>(STATUS[st]&&STATUS[st].label)||st;
  let n=0, nOff=0; const ex=[];
  Object.keys(units).forEach(id=>{ for(let t=T_MIN;t<=T_MAX;t+=1){ global.clock=t; const mr=marchRate(id,t); if(!mr||!mr.moving) continue;
      if(mr.kmh<1){ n++; const ph=phaseAt(t); const st=stateAt(id,textPhase(id,t)).st; if(['reserve','concealed','holding','forming'].includes(st)){ nOff++; if(ex.length<400) ex.push(id+' '+fmt(t)+' '+lab(st)+' Marching '+mr.km.toFixed(1)+' km '+Math.round(mr.min)+' min '+mr.kmh.toFixed(2)+' km/h'); } } } });
  P('formation-minutes with the row "Marching" under 1 km/h:',n,'; of them with status reserve/concealed/holding/forming:',nOff);
  const seen={}; ex.forEach(e=>{ const id=e.split(' ')[0]; if(!seen[id]){ seen[id]=1; P('  e.g.',e); } });
  global.clock=457; const mr=marchRate('rg_cav',457); P('rg_cav 07:37',JSON.stringify(mr),'status',lab(stateAt('rg_cav',textPhase('rg_cav',457)).st));
}
console.log(out.join('\n'));
module.exports={at,km,fmt};
