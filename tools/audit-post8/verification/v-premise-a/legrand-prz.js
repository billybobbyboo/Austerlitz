// v-premise-a: Legrand's undated leg @2->@4 (reached at phase starts: legWindow's default, app.js:3299-3304) against prz and the castle.
// Usage: node legrand-prz.js [repoRoot]. Reads geo.js, data.js and world.js's LANDMARK_SITES literal only.
const fs=require('fs'), vm=require('vm'), path=require('path'); const R=process.argv[2]||'/home/user/Austerlitz';
const ctx={}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(R,'geo.js'),'utf8'),ctx); vm.runInContext(fs.readFileSync(path.join(R,'data.js'),'utf8')+'\n;this.F=FORMATIONS;this.P=PHASES;this.G=GEOREF;',ctx);
const castle=JSON.parse(fs.readFileSync(path.join(R,'world.js'),'utf8').match(/LANDMARK_SITES=\{castle:(\[[^\]]+\])/)[1]);
const L=ctx.F.legrand.track, Z=ctx.F.prz.track, K=ctx.G.KM_PER_MAP, t0=ctx.P[2].t0, t1=ctx.P[4].t0;
const a=L[2].p, b=L[4].p, pz=Z[2].p; const fm=t=>String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
console.log(`legrand@2 ${JSON.stringify(a)} -> @4 ${JSON.stringify(b)} over ${fm(t0)}-${fm(t1)}; prz@2=@4=@7 ${JSON.stringify(pz)} (no move 08:00-12:45); castle ${JSON.stringify(castle)}; ${(K*1000).toFixed(1)} m per map unit`);
let best=[1e9,0]; for(let t=t0;t<=t1;t++){ const u=(t-t0)/(t1-t0), p=[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u];
  const dp=Math.hypot(p[0]-pz[0],p[1]-pz[1])*K*1000, dc=Math.hypot(p[0]-castle[0],p[1]-castle[1])*K*1000; if(dp<best[0]) best=[dp,t];
  if(t%15===0||t===531) console.log(`${fm(t)} legrand [${p[0].toFixed(1)},${p[1].toFixed(1)}] to prz ${dp.toFixed(0)} m, to castle ${dc.toFixed(0)} m`); }
console.log(`closest to prz: ${best[0].toFixed(0)} m at ${fm(best[1])}`);
