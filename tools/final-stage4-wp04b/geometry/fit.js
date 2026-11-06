/* WP-04b measurement: refit the parametric relief (existing amplitudes, plus new bump terms whose geometry is searched by Nelder-Mead
   with the amplitudes solved by weighted least squares inside), against the sourced anchors, the Goldbach's sourced drop and DEM targets.
   node fit.js ROOT EVDIR CONFIG.json OUT.json
   CONFIG: {free:[existing term names], reg:{term:w}, newTerms:[{name,c:[mx,my],rx,rz,edge,rot,opt:[param names]}], sets:{anchors:sigma|null,
            core:sigma|null, coreBox:[x0,x1,y0,y1]|null, profiles:sigma|null}, iters:n}
   Measurement code only: writes OUT.json, nothing in the tree.
   As committed (the final audits' Stage 4, WP-04b): the search that found RELIEF_DEM's geometry, run on a tree whose world.js is the relief before
   WP-04b (its amplitudes fitlib.js's LIVE; e.g. `git show 9228a3f:world.js`), EVDIR docs/audit-post8-evidence/geography; WP-04b's own grids are
   read from docs/final-stage4-wp04b-evidence/dem/ (fitlib.js). c16.json is the search (Nelder-Mead over each term's centre, radii, edge and turn,
   2,500 iterations, 4 restarts), c16.out.json its result; c16r.json its geometry rounded, c16r.out.json the amplitudes solved for it (reproduced
   exactly from the committed responses). world.js carries c16r's geometry with tools/relief-fit.js's amplitudes, which add the summit held. */
"use strict";
const fs=require("fs"), path=require("path");
const F=require("./fitlib.js");
const ROOT=path.resolve(process.argv[2]), EV=path.resolve(process.argv[3]), CFG=JSON.parse(fs.readFileSync(process.argv[4],"utf8")), OUT=process.argv[5];
const G=F.loadTree(ROOT), S=F.shapes(G), D=F.demData(G,EV), GR=G.GEOREF, V=GR.V_M_PER_UNIT;
const elevNow=(mx,my)=>GR.elevM(G.hAt(mx,my));
/* targets: {map, target m, sigma m, kind} */
const T=[];
Object.keys(F.SRC_ANCHORS).forEach(k=>T.push({kind:"src", id:k, map:GR.GT[k].map, target:F.SRC_ANCHORS[k][0], sigma:(CFG.srcSigma&&CFG.srcSigma[k])||F.SRC_ANCHORS[k][1]*(CFG.srcScale||1)}));
if(CFG.sets.anchors) D.anchors.forEach(a=>{ if(CFG.skipAnchors&&CFG.skipAnchors.includes(a.id)) return; T.push({kind:"dem", id:a.id, map:a.map, target:a.dem, sigma:Math.max(CFG.sets.anchors,Math.abs(a.dem-a.srtm))}); });
const inMere=p=>{ const a=(p[0]-268)/62, b=(p[1]-421)/26, c=(p[0]-187)/52, d=(p[1]-457)/22; return a*a+b*b<1||c*c+d*d<1; };   /* the meres' model beds (water in 1805) against today's drained fields: left out */
if(CFG.sets.core){ const B=CFG.sets.coreBox; D.core.forEach(p=>{ if(inMere(p.map)) return; if(B&&!(p.map[0]>=B[0]&&p.map[0]<=B[1]&&p.map[1]>=B[2]&&p.map[1]<=B[3])) return; T.push({kind:"core", map:p.map, target:p.dem, sigma:CFG.sets.core}); }); }
if(CFG.sets.profiles) D.profiles.forEach(p=>T.push({kind:"prof", map:p.map, target:p.dem, sigma:CFG.sets.profiles}));
/* the 150 m south grid; within minSrtm.r map units of minSrtm.c the lower of GLO-90 and SRTM 30 m (both surface models: the lower nearer the
   ground, where the Pratzeberg's monument park lifts GLO-90) */
const MS=CFG.sets.minSrtm;
if(CFG.sets.vsouth) D.vsouth.forEach(p=>{ if(inMere(p.map)) return; const near=MS&&Math.hypot(p.map[0]-MS.c[0],p.map[1]-MS.c[1])<=MS.r;
  T.push({kind:"vsouth", map:p.map, target:near?Math.min(p.dem,p.srtm):p.dem, sigma:near&&MS.sigma?MS.sigma:CFG.sets.vsouth}); });
if(CFG.sets.vslap) D.vslap.forEach(p=>T.push({kind:"vslap", map:p.map, target:p.dem, sigma:CFG.sets.vslap}));
/* a cap: the DEM points (core and 150 m south grids) within r map units of a centre, their targets no higher than cap m, sigma s (so that no
   ground is drawn above the sourced summit) */
if(CFG.sets.cap) CFG.sets.cap.forEach(c=>{ D.core.concat(D.vsouth).forEach(p=>{ if(Math.hypot(p.map[0]-c.c[0],p.map[1]-c.c[1])>c.r) return; T.push({kind:"cap", map:p.map, target:Math.min(p.dem,c.cap), sigma:c.sigma}); }); });
/* a drawn stream's bed held at its present height (so that no new reverse gradient appears): sampled every 1 world unit, within box hb */
if(CFG.sets.hold) CFG.sets.hold.forEach(h=>{ const L=h.line==="LITAVA"?G.LITAVA_M:h.line==="GOLDBACH"?G.GOLDBACH_M:G.BROOKS_M[h.brook];
  for(let i=0;i<L.length-1;i++){ const a=L[i], b=L[i+1], d=Math.hypot(b[0]-a[0],b[1]-a[1]), n=Math.max(1,Math.ceil(d/2));
    for(let k=0;k<=n;k++){ const p=[a[0]+(b[0]-a[0])*k/n, a[1]+(b[1]-a[1])*k/n]; if(h.box&&!(p[0]>=h.box[0]&&p[0]<=h.box[1]&&p[1]>=h.box[2]&&p[1]<=h.box[3])) continue;
      T.push({kind:"hold", map:p, target:GR.elevM(G.hAt(p[0],p[1])), sigma:h.sigma}); } } });
if(CFG.sets.extra) CFG.sets.extra.forEach(e=>T.push({kind:"extra", id:e.id, map:e.map, target:e.target, sigma:e.sigma}));
/* precompute: each target's world point, live height, existing shapes */
const free=CFG.free, P=T.map(t=>{ const w=G.W(t.map[0],t.map[1]); return Object.assign(t,{w, h0:G.height(w[0],w[1]), s:free.map(k=>S[k](w[0],w[1]))}); });
const kob=G.W(...GR.GT.kobelnitz.map), sok=G.W(...GR.GT.sokolnitz.map);
const dropRow=free.map(k=>S[k](kob[0],kob[1])-S[k](sok[0],sok[1])), drop0=G.height(kob[0],kob[1])-G.height(sok[0],sok[1]);
const REG=CFG.reg||{};
/* solve amplitudes for a given new-term geometry; returns {amp, newAmp, sse} */
function solve(NT){
  const nS=NT.map(t=>F.newShape(G,t)), nNew=NT.length, n=free.length+nNew, rows=[], rhs=[];
  P.forEach(p=>{ const sNew=nS.map(f=>f(p.w[0],p.w[1])); const r=p.s.concat(sNew).map(v=>V*1.2*v/p.sigma);
    /* metres = elevM(h0) + V*1.2*(sum (a_k-live_k) s_k + sum b_j t_j) */
    const base=GR.elevM(p.h0)-V*1.2*free.reduce((s,k,i)=>s+F.LIVE[k]*p.s[i],0);
    rows.push(r); rhs.push((p.target-base)/p.sigma); p._sNew=sNew; p._base=base; });
  /* the drop Kobylnice -> Sokolnice 4 m +/- 1.5 */
  { const sN=nS.map(f=>f(kob[0],kob[1])-f(sok[0],sok[1])); const r=dropRow.concat(sN).map(v=>V*1.2*v/1.5);
    const base=V*(drop0)-V*1.2*free.reduce((s,k,i)=>s+F.LIVE[k]*dropRow[i],0); rows.push(r); rhs.push((4-base)/1.5); }
  free.forEach((k,i)=>{ const w=REG[k]!==undefined?REG[k]:0.35, r=Array(n).fill(0); r[i]=w; rows.push(r); rhs.push(w*(CFG.prior&&CFG.prior[k]!==undefined?CFG.prior[k]:F.LIVE[k])); });
  NT.forEach((t,j)=>{ const w=t.reg!==undefined?t.reg:0.02, r=Array(n).fill(0); r[free.length+j]=w; rows.push(r); rhs.push(0); });
  const sol=F.lsq(rows,rhs); let sse=0; rows.forEach((r,i)=>{ let v=-rhs[i]; for(let j=0;j<n;j++) v+=r[j]*sol[j]; sse+=v*v; });
  const amp={}; free.forEach((k,i)=>amp[k]=sol[i]); const newAmp=NT.map((t,j)=>sol[free.length+j]);
  return {amp, newAmp, sse};
}
/* Nelder-Mead over the new terms' searched parameters */
const NT0=(CFG.newTerms||[]).map(t=>Object.assign({},t));
const pv=[]; NT0.forEach((t,j)=>(t.opt||[]).forEach(o=>pv.push({j,o})));
const get=(NT)=>pv.map(q=>q.o==="cx"?NT[q.j].c[0]:q.o==="cy"?NT[q.j].c[1]:NT[q.j][q.o]);
const put=(x)=>{ const NT=NT0.map(t=>Object.assign({},t,{c:t.c.slice()})); pv.forEach((q,i)=>{ if(q.o==="cx") NT[q.j].c[0]=x[i]; else if(q.o==="cy") NT[q.j].c[1]=x[i]; else NT[q.j][q.o]=x[i]; }); return NT; };
const bounds={rx:[1.5,60],rz:[1.5,60],edge:[0,0.9],rot:[-1.6,1.6]};
function cost(x){ const NT=put(x); for(const t of NT){ for(const k of ["rx","rz","edge","rot"]){ const b=bounds[k]; if(t[k]!==undefined&&(t[k]<b[0]||t[k]>b[1])) return 1e12; }
    if(CFG.minBand&&(1-t.edge)*Math.min(t.rx,t.rz)<CFG.minBand) return 1e12; }   /* no cliff: each term's flank at least minBand world units wide */
  return solve(NT).sse; }
let best={x:get(NT0)}; best.f=cost(best.x);
if(pv.length){
  const stepOf=q=>q.o==="cx"||q.o==="cy"?6:q.o==="edge"?0.15:q.o==="rot"?0.3:3;
  for(let restart=0;restart<(CFG.restarts||3);restart++){
    const n=pv.length; let simp=[best.x.slice()]; for(let i=0;i<n;i++){ const y=best.x.slice(); y[i]+=stepOf(pv[i])*(restart%2?-1:1); simp.push(y); }
    let fs_=simp.map(cost);
    for(let it=0;it<(CFG.iters||1500);it++){
      const idx=fs_.map((f,i)=>i).sort((a,b)=>fs_[a]-fs_[b]); simp=idx.map(i=>simp[i]); fs_=idx.map(i=>fs_[i]);
      const c=Array(n).fill(0); for(let i=0;i<n;i++) for(let k=0;k<n;k++) c[k]+=simp[i][k]/n;
      const xr=c.map((v,k)=>v+(v-simp[n][k])), fr=cost(xr);
      if(fr<fs_[0]){ const xe=c.map((v,k)=>v+2*(v-simp[n][k])), fe=cost(xe); if(fe<fr){ simp[n]=xe; fs_[n]=fe; } else { simp[n]=xr; fs_[n]=fr; } }
      else if(fr<fs_[n-1]){ simp[n]=xr; fs_[n]=fr; }
      else { const xc=c.map((v,k)=>v+0.5*(simp[n][k]-v)), fc=cost(xc); if(fc<fs_[n]){ simp[n]=xc; fs_[n]=fc; } else { for(let i=1;i<=n;i++){ simp[i]=simp[i].map((v,k)=>simp[0][k]+0.5*(v-simp[0][k])); fs_[i]=cost(simp[i]); } } }
    }
    const bi=fs_.indexOf(Math.min(...fs_)); if(fs_[bi]<best.f) best={x:simp[bi], f:fs_[bi]};
  }
}
const NT=put(best.x), sol=solve(NT);
NT.forEach((t,j)=>t.amp=sol.newAmp[j]);
const res={config:CFG, targets:{src:P.filter(p=>p.kind==="src").length, dem:P.filter(p=>p.kind==="dem").length, core:P.filter(p=>p.kind==="core").length, prof:P.filter(p=>p.kind==="prof").length},
  sse:sol.sse, amp:sol.amp, newTerms:NT.map(t=>({name:t.name, c:t.c.map(v=>+v.toFixed(2)), rx:+t.rx.toFixed(3), rz:+t.rz.toFixed(3), edge:+t.edge.toFixed(3), rot:+(t.rot||0).toFixed(3), amp:+t.amp.toFixed(3), where:t.where||"local"}))};
fs.writeFileSync(OUT,JSON.stringify(res,null,1));
console.log("sse "+sol.sse.toFixed(1)+"  amplitudes "+JSON.stringify(Object.fromEntries(Object.entries(sol.amp).map(([k,v])=>[k,+v.toFixed(3)]))));
res.newTerms.forEach(t=>console.log("  new "+JSON.stringify(t)));
