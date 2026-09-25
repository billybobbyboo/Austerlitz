/* Fit the relief amplitudes to verified elevations (least squares, V_M_PER_UNIT fixed).
   The height function is linear in its amplitudes (before the x1.2 and the pond clamp), so each
   term's shape is evaluated at the anchors and the amplitudes solved for. */
const M=require('../_world_mod.js'), G=require('../geo.js');
const A={pratzeberg:[324,5],vinohrady:[294,6],santon:[296,6],zuran:[290,6],bosenitz:[257,8],kobelnitz:[211,5],sokolnitz:[207,5],pratzen:[245,12],vinocol:[273,10],
  augezd:[195,8],          /* Újezd u Brna 195 m (municipal infobox) */
  krzenowitz:[210,8],      /* Křenovice: 203-216 m at the village (turistika.cz; municipal range 210-250) */
  austerlitz:[218,18]};    /* Slavkov: built-up area 200-237 m (jmk.cz) - only the range is sourced */
const pts=Object.keys(A).map(k=>({k,m:G.GT[k].map,w:M.W(G.GT[k].map[0],G.GT[k].map[1]),target:A[k][0],tol:A[k][1]}));
/* term shapes, mirroring world.js height() */
const bumpS=(x,z,c,rx,rz,edge)=>{ const d=Math.sqrt(((x-c[0])/rx)**2+((z-c[1])/rz)**2); return 1-M.smoothstep(edge,1,d); };
const crest=[[309,193],[313,205],[323,231],[332,257],[309,273],[285,289],[281,302]].map(p=>M.W(p[0],p[1]));
function polyD(x,z,pts){ let d=1e9; for(let i=0;i<pts.length-1;i++){ const a=pts[i],b=pts[i+1],vx=b[0]-a[0],vz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*vx+(z-a[1])*vz)/(vx*vx+vz*vz))); d=Math.min(d,Math.hypot(x-a[0]-t*vx,z-a[1]-t*vz)); } return d; }
const RIDGE_W=8.0;                                  /* world units: ~0.5 km either side of the crest line */
const northKm=(x,z)=>G.northingKm(x*2+340,z*2+250);
const TERMS={
  prat:  (x,z)=>bumpS(x,z,M.PRAT,50,60,0.48),
  ridge: (x,z)=>Math.exp(-(polyD(x,z,crest)**2)/(RIDGE_W*RIDGE_W)),
  pberg: (x,z)=>bumpS(x,z,M.PBERG,10,9.5,0.26),
  vino:  (x,z)=>bumpS(x,z,M.VINO,11,10,0.26),
  santon:(x,z)=>bumpS(x,z,M.SANTON,7.4,6.4,0.30),
  zuran: (x,z)=>bumpS(x,z,M.ZURAN,6.6,5.8,0.36),
  north: (x,z)=>M.smoothstep(3.0,6.0,northKm(x,z)),
  tiltN: (x,z)=>G.mapToEN(x*2+340,z*2+250)[1],      /* regional plane: the land falls toward the Svratka */
  tiltE: (x,z)=>G.mapToEN(x*2+340,z*2+250)[0],
  slav:  (x,z)=>bumpS(x,z,M.SLAV,13,11,0.40),   /* the rise the town of Austerlitz stands on (legacy; height now fitted) */
  valley:(x,z)=>{ const d=Math.min(polyD(x,z,M.LITAVA),polyD(x,z,M.BROOKS[M.BROOKS.length-1])); return Math.exp(-(d*d)/(25*25)); }   /* the middle-Litava lowland: the Litava and its Rakovec, ~1.6 km either side */
};
const CUR={prat:2.55,ridge:5.28,pberg:5.12,vino:1.73,santon:5.18,zuran:4.97,north:1.21,tiltN:0.54,tiltE:-0.57,valley:0,slav:4.2};
/* verify the decomposition reproduces the live height at the anchors */
let maxErr=0; pts.forEach(p=>{ const live=M.height(p.w[0],p.w[1]); const rest=live/1.2-Object.keys(CUR).reduce((s,k)=>s+CUR[k]*TERMS[k](p.w[0],p.w[1]),0); p.rest=rest; });
/* rest = everything not being fitted (noise, grooves, ponds, other bumps); check by recomposition */
pts.forEach(p=>{ const recon=1.2*(p.rest+Object.keys(CUR).reduce((s,k)=>s+CUR[k]*TERMS[k](p.w[0],p.w[1]),0)); maxErr=Math.max(maxErr,Math.abs(recon-M.height(p.w[0],p.w[1]))); });
/* solve: unknowns = amplitudes + datum, heights in metres = DATUM + V*1.2*(rest + sum a_k s_k) */
const V=G.V_M_PER_UNIT, keys=Object.keys(TERMS), n=keys.length+1;
const rows=[], rhs=[];
pts.forEach(p=>{ const r=keys.map(k=>V*1.2*TERMS[k](p.w[0],p.w[1])); r.push(1); rows.push(r.map(v=>v/p.tol)); rhs.push((p.target-V*1.2*p.rest)/p.tol); });
/* the sourced drop along the Goldbach: Kobylnice 211 m -> Sokolnice 207 m, downstream (4 m +/- 1.5) */
{ const a=pts.find(p=>p.k==='kobelnitz'), b=pts.find(p=>p.k==='sokolnitz'), tol=1.5;
  const r=keys.map(k=>V*1.2*(TERMS[k](a.w[0],a.w[1])-TERMS[k](b.w[0],b.w[1]))); r.push(0);
  rows.push(r.map(v=>v/tol)); rhs.push((4-V*1.2*(a.rest-b.rest))/tol); }
/* weak regularisation toward the current amplitudes (keeps the landscape recognisable) */
const REG={prat:0.08,ridge:0.08,tiltN:0.5,tiltE:50,valley:0.3};   /* tiltE held at zero: a plane made the Litava run uphill */   /* the broad dome and the crest ridge may trade height; the named summits stay near their old shape */
const PRIOR=Object.assign({},CUR,{tiltE:0,valley:0});
keys.forEach((k,i)=>{ const w=REG[k]!==undefined?REG[k]:0.35; const r=Array(n).fill(0); r[i]=w; rows.push(r); rhs.push(w*PRIOR[k]); });
function lsq(A,b){ const m=A[0].length, N=Array.from({length:m},()=>Array(m+1).fill(0)); A.forEach((r,ri)=>{ for(let i=0;i<m;i++){ for(let j=0;j<m;j++) N[i][j]+=r[i]*r[j]; N[i][m]+=r[i]*b[ri]; } });
  for(let i=0;i<m;i++){ let p=i; for(let r=i+1;r<m;r++) if(Math.abs(N[r][i])>Math.abs(N[p][i])) p=r; [N[i],N[p]]=[N[p],N[i]]; for(let r=0;r<m;r++) if(r!==i){ const f=N[r][i]/N[i][i]; for(let c=i;c<=m;c++) N[r][c]-=f*N[i][c]; } } return N.map((r,i)=>r[m]/r[i]); }
const sol=lsq(rows,rhs); const amp={}; keys.forEach((k,i)=>amp[k]=+sol[i].toFixed(2)); const DATUM=+sol[keys.length].toFixed(1);
console.log('decomposition check: max error '+maxErr.toExponential(2)+' units');
console.log('fitted amplitudes '+JSON.stringify(amp)+'  DATUM_M '+DATUM+'  (V_M_PER_UNIT '+V+')');
pts.forEach(p=>{ const h=1.2*(p.rest+keys.reduce((s,k)=>s+amp[k]*TERMS[k](p.w[0],p.w[1]),0)); const m=DATUM+V*h; console.log('  '+p.k.padEnd(11)+m.toFixed(0)+' m   target '+p.target+' ±'+p.tol+(Math.abs(m-p.target)>p.tol?'   <-- outside':'')); });
module.exports={amp,DATUM,RIDGE_W};
