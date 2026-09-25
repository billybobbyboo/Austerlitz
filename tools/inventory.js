/* Every map coordinate in the data, with where it lives, its warp, and whether it sits in a fold zone. */
const fs=require('fs'); const Wp=require('./warp-proto.js');
const f=(x,y)=>Wp.idw(x,y,2);
function det(x,y){ const h=0.5,a=f(x+h,y),b=f(x-h,y),c=f(x,y+h),d=f(x,y-h); return (1+(a[0]-b[0])/(2*h))*(1+(c[1]-d[1])/(2*h))-((c[0]-d[0])/(2*h))*((a[1]-b[1])/(2*h)); }
global.window={}; eval(fs.readFileSync('data.js','utf8')); eval(fs.readFileSync('analysis.js','utf8'));
const app=fs.readFileSync('app.js','utf8'); { const i0=app.indexOf('var OVERLAYS'); const i1=app.indexOf('\n};',i0)+3; eval(app.slice(i0,i1)); global.OVERLAYS=OVERLAYS; }
const out=[];
const add=(where,p)=>{ if(!p||typeof p[0]!=='number') return; const d=f(p[0],p[1]); out.push({where,p:[p[0],p[1]],q:[p[0]+d[0],p[1]+d[1]],det:det(p[0],p[1])}); };
Object.keys(FORMATIONS).forEach(id=>{ const t=FORMATIONS[id].track; if(t) Object.keys(t).forEach(ph=>{ if(t[ph].p) add('track '+id+' ph'+ph,t[ph].p); }); });
FEATURES.forEach(F=>add('feature '+F.id,F.p));
['al','fr'].forEach(sd=>{ const P=PLANS[sd]; (P.cols||[]).forEach((c,i)=>{ add('plan '+sd+' col'+i+' obj',c.obj); (c.route||[]).forEach((r,j)=>add('plan '+sd+' col'+i+' route'+j,r)); });
  (P.objectives||[]).forEach((o,i)=>add('plan '+sd+' objective '+o.n,o.p)); (P.staging||[]).forEach((s,i)=>{ if(Array.isArray(s)) add('plan '+sd+' staging'+i,s); else if(s&&s.p) add('plan '+sd+' staging '+(s.n||i),s.p); }); });
EVENTS.forEach(e=>add('event '+e.id,e.p));
Object.keys(OVERLAYS).forEach(ph=>{ const O=OVERLAYS[ph]; ['lines','arrows','bounds'].forEach(k=>(O[k]||[]).forEach((L,i)=>L.pts.forEach((p,j)=>add('overlay ph'+ph+' '+k+i+' '+(L.label||'')+' #'+j,p)))); (O.obj||[]).forEach(o=>add('overlay ph'+ph+' obj '+o[2],o)); });
console.log('coordinates inventoried: '+out.length);
const bad=out.filter(o=>o.det<=0.15);
console.log('in or near a fold zone (Jacobian <= 0.15): '+bad.length);
bad.forEach(o=>console.log('  '+o.where.padEnd(58)+' ['+o.p+'] -> ['+o.q.map(v=>v.toFixed(0))+']  det '+o.det.toFixed(2)));
console.log('\nPLANS staging sample: '+JSON.stringify(PLANS.al.staging).slice(0,200));
fs.writeFileSync('/tmp/inventory.json',JSON.stringify(out));
