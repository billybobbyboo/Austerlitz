/* Fit the relief amplitudes to verified elevations (least squares, V_M_PER_UNIT and DATUM_M fixed: the fog's top, GEOREF.elevM(-0.8) = 238.2 m,
   and the 10.33x setting, GEOREF.EXAG, keep their values).
   The height function is linear in its amplitudes (before the x1.2 and the meres' clamp), so each fitted term's shape is evaluated at the
   targets and the amplitudes solved for; every other term (the noise, the grooves, the meres, the other bumps, the regional fall) is held at
   world.js's own value.
   WP-04b (the final audits' Stage 4; CL-GEO-01, docs/FINAL_AUDIT_POST_STAGE8.md; owner decision 273 (a)): until it this script fitted eleven amplitudes at
   the twelve anchors below alone, its CUR table no longer world.js's (its output was not world.js's amplitudes since the regional fall was
   refitted); the relief between the anchors stood 30-80 m below open elevation data over the southern Pratzen plateau and the chapel knoll and
   about 45 m above it at Slapanice. Now it fits PBERG's and SCHLAP's amplitudes and the six RELIEF_DEM terms' (world.js; their geometry fixed
   as a Nelder-Mead search found it, each flank at least 3 world units wide, docs/final-stage4-wp04b-evidence/dem/) against:
     A{}  the twelve sourced anchors, sigma half their tolerance (the Pratzeberg 0.5 m, so that it stays its 324 m and 25 m above the Santon,
          geo-test.js; Stare Vinohrady 2 m, the col 3 m);
     the sourced drop Kobylnice 211 -> Sokolnice 207 m at the GT points, 4 m +/- 1.5;
     D    Copernicus GLO-90 (Open-Meteo), sigma 10 m: the audit's 300 m core grid within map x 240-360, y 260-380, the meres' beds left out
          (docs/audit-post8-evidence/geography/dem-core-request.json, raw/openmeteo-core-*.json), and WP-04b's two 150 m grids, the southern
          plateau (x 250-350, y 275-375) and Slapanice (x 140-195, y 150-210) (docs/final-stage4-wp04b-evidence/dem/req-vsouth.json, req-vslap.json, raw/);
          within 19 map units (0.6 km) of the Pratzeberg the lower of GLO-90 and SRTM 30 m (OpenTopoData, raw/opentopodata-srtm30m-vsouth-*),
          sigma 3 m: both are surface models, and there GLO-90 stands up to 16 m above SRTM (the Cairn of Peace's park);
     the drawn beds held at their heights before WP-04b, sigma 0.75 m (the Litava whole, the Goldbach within x 150-300, y 150-420, BROOKS[1]
          and BROOKS[3]), so that no reverse gradient is added;
     a weak pull toward the amplitudes before WP-04b (PBERG 5.45, SCHLAP 3.0, the new terms 0);
     the summit held: no ground within 1 km of the Pratzeberg above 324 + 2 m (below; without it the fit drew 326.4 m 168 m east of the summit
          point, c16r as measured for the owner's decision, which fails tools/relief-tolerance.js's summit line by 0.4 m).
   Run: node tools/mk-world-mod.js && node tools/relief-fit.js   (it says whether world.js carries the fitted amplitudes, to 0.01).
   Held out (the validation, tools/audit-post8/geography/extra.js and plateau.js): the four plateau profiles, the southern box's mean, the
   chapel's point, the frame's 600 m grid and fifteen named DEM anchors (docs/final-stage4-wp04b-evidence/dem/req-anchors.json, with SRTM 30 m beside them). */
const fs=require('fs'), path=require('path');
const M=require('../_world_mod.js'), G=require('../geo.js');
const ROOT=path.join(__dirname,'..'), EV=path.join(ROOT,'docs','audit-post8-evidence','geography'), EV4=path.join(ROOT,'docs','final-stage4-wp04b-evidence','dem');
const A={pratzeberg:[324,5],vinohrady:[294,6],santon:[296,6],zuran:[290,6],bosenitz:[257,8],kobelnitz:[211,5],sokolnitz:[207,5],pratzen:[245,12],vinocol:[273,10],
  augezd:[195,8],          /* Újezd u Brna 195 m (municipal infobox) */
  krzenowitz:[210,8],      /* Křenovice: 203-216 m at the village (turistika.cz; municipal range 210-250) */
  austerlitz:[218,18]};    /* Slavkov: built-up area 200-237 m (jmk.cz) - only the range is sourced */
const V=G.V_M_PER_UNIT;
/* the fitted terms' shapes (amplitude 1), mirroring world.js */
const TERMS={pberg:(x,z)=>M.bump(x,z,M.PBERG,10,9.5,1,0.26), schlap:(x,z)=>M.bump(x,z,M.SCHLAP,15,9,1,0.36)};
M.RELIEF_DEM.forEach((t,i)=>{ const u=Object.assign({},t,{h:1}); TERMS['dem'+i]=(x,z)=>M.tbump(x,z,u); });
const LIVE={pberg:2.93, schlap:0.22}; M.RELIEF_DEM.forEach((t,i)=>LIVE['dem'+i]=t.h);   /* world.js's amplitudes as written (checked below) */
const PRIOR={pberg:5.45, schlap:3.0}; M.RELIEF_DEM.forEach((t,i)=>PRIOR['dem'+i]=0);   /* before WP-04b */
const REG={pberg:0.35, schlap:0.02}; M.RELIEF_DEM.forEach((t,i)=>REG['dem'+i]=0.02);
const keys=Object.keys(TERMS), n=keys.length;
/* rest: the height without the fitted terms; the height before WP-04b is rest plus the prior amplitudes */
const rest=(x,z)=>M.height(x,z)/1.2-keys.reduce((s,k)=>s+LIVE[k]*TERMS[k](x,z),0);
const before=(x,z)=>1.2*(rest(x,z)+keys.reduce((s,k)=>s+PRIOR[k]*TERMS[k](x,z),0));
const rd=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const T=[];
const SIG={pratzeberg:0.5, vinohrady:2, vinocol:3};
Object.keys(A).forEach(k=>T.push({k, map:G.GT[k].map, target:A[k][0], sigma:SIG[k]||A[k][1]/2, tol:A[k][1]}));
const inMere=p=>{ const a=(p[0]-268)/62, b=(p[1]-421)/26, c=(p[0]-187)/52, d=(p[1]-457)/22; return a*a+b*b<1||c*c+d*d<1; };
{ const req=rd(path.join(EV,'dem-core-request.json')), E=[]; for(let i=0;;i++){ const f=path.join(EV,'raw','openmeteo-core-'+i+'.json'); if(!fs.existsSync(f)) break; E.push(...rd(f).elevation); }
  req.forEach((p,i)=>{ const q=p.map; if(inMere(q)||q[0]<240||q[0]>360||q[1]<260||q[1]>380) return; T.push({map:q, target:E[i], sigma:10}); }); }
const PB=G.GT.pratzeberg.map;
[['req-vsouth.json','openmeteo-vsouth',5,'opentopodata-srtm30m-vsouth'],['req-vslap.json','openmeteo-vslap',2,null]].forEach(([f,r,k,s])=>{ const P=rd(path.join(EV4,f)), E=[], S=[];
  for(let i=0;i<k;i++){ E.push(...rd(path.join(EV4,'raw',r+'-'+i+'.json')).elevation); if(s) S.push(...rd(path.join(EV4,'raw',s+'-'+i+'.json')).results.map(q=>q.elevation)); }
  if(E.length!==P.length||(s&&S.length!==P.length)) throw new Error(f+': '+E.length+' heights for '+P.length+' points');
  P.forEach((p,i)=>{ if(inMere(p.map)) return; const near=s&&Math.hypot(p.map[0]-PB[0],p.map[1]-PB[1])<=19;
    T.push({map:p.map, target:near?Math.min(E[i],S[i]):E[i], sigma:near?3:10}); }); });
[[M.LITAVA_M,null],[M.GOLDBACH_M,[150,300,150,420]],[M.BROOKS_M[3],null],[M.BROOKS_M[1],null]].forEach(([L,box])=>{
  for(let i=0;i<L.length-1;i++){ const a=L[i], b=L[i+1], d=Math.hypot(b[0]-a[0],b[1]-a[1]), m=Math.max(1,Math.ceil(d/2));
    for(let s=0;s<=m;s++){ const p=[a[0]+(b[0]-a[0])*s/m, a[1]+(b[1]-a[1])*s/m]; if(box&&!(p[0]>=box[0]&&p[0]<=box[1]&&p[1]>=box[2]&&p[1]<=box[3])) continue;
      const w=M.W(p[0],p[1]); T.push({map:p, target:G.elevM(before(w[0],w[1])), sigma:0.75}); } } });
/* the rows: metres = DATUM + V*1.2*(rest + sum a_k s_k) */
const rows=[], rhs=[];
T.forEach(p=>{ const w=M.W(p.map[0],p.map[1]); p.w=w; rows.push(keys.map(k=>V*1.2*TERMS[k](w[0],w[1])/p.sigma)); rhs.push((p.target-G.elevM(1.2*rest(w[0],w[1])))/p.sigma); });
{ const a=M.W(...G.GT.kobelnitz.map), b=M.W(...G.GT.sokolnitz.map), tol=1.5;
  rows.push(keys.map(k=>V*1.2*(TERMS[k](a[0],a[1])-TERMS[k](b[0],b[1]))/tol)); rhs.push((4-V*1.2*(rest(a[0],a[1])-rest(b[0],b[1])))/tol); }
keys.forEach((k,i)=>{ const r=Array(n).fill(0); r[i]=REG[k]; rows.push(r); rhs.push(REG[k]*PRIOR[k]); });
function lsq(A,b){ const m=A[0].length, N=Array.from({length:m},()=>Array(m+1).fill(0)); A.forEach((r,ri)=>{ for(let i=0;i<m;i++){ for(let j=0;j<m;j++) N[i][j]+=r[i]*r[j]; N[i][m]+=r[i]*b[ri]; } });
  for(let i=0;i<m;i++){ let p=i; for(let r=i+1;r<m;r++) if(Math.abs(N[r][i])>Math.abs(N[p][i])) p=r; [N[i],N[p]]=[N[p],N[i]]; for(let r=0;r<m;r++) if(r!==i){ const f=N[r][i]/N[i][i]; for(let c=i;c<=m;c++) N[r][c]-=f*N[i][c]; } } return N.map((r,i)=>r[m]/r[i]); }
let sol=lsq(rows,rhs);
/* the summit held (WP-04b's summit line, tools/relief-tolerance.js: no ground within 1 km of the Pratzeberg more than 2 m above its surveyed 324 m;
   the amplitudes solved without it drew 326.4 m 168 m east of the summit point): every point of a 25 m lattice within 1 km of GT.pratzeberg that
   the solution draws above CAP is added as a target at CAP, sigma 0.05 m, and the amplitudes solved again, until none is added (an active set;
   CAP 0.5 m inside the line, so that the rounded amplitudes keep it) */
const CAP=G.GT.pratzeberg.elev+2-0.5, CAPS=0.05, KMU=1/G.KM_PER_MAP, LST=0.025/G.KM_PER_MAP, LAT=[], ACT=new Set();
for(let y=-KMU;y<=KMU+1e-9;y+=LST) for(let x=-KMU;x<=KMU+1e-9;x+=LST){ if(x*x+y*y>KMU*KMU) continue; const w=M.W(PB[0]+x,PB[1]+y);
  LAT.push({s:keys.map(k=>V*1.2*TERMS[k](w[0],w[1])), r:G.elevM(1.2*rest(w[0],w[1]))}); }
for(let it=0;it<30;it++){ let added=0; LAT.forEach((p,i)=>{ if(ACT.has(i)||p.r+p.s.reduce((t,v,j)=>t+v*sol[j],0)<=CAP) return; ACT.add(i); added++;
    rows.push(p.s.map(v=>v/CAPS)); rhs.push((CAP-p.r)/CAPS); }); if(!added) break; sol=lsq(rows,rhs); }
const amp={}; keys.forEach((k,i)=>amp[k]=+sol[i].toFixed(2));
console.log('the summit held: '+ACT.size+' lattice points at '+CAP+' m');
const name=k=>k.startsWith('dem')?'RELIEF_DEM['+k.slice(3)+'] ('+M.RELIEF_DEM[+k.slice(3)].n+')':k;
console.log('targets: '+Object.keys(A).length+' sourced anchors, '+(T.length-Object.keys(A).length)+' DEM points and held beds; DATUM_M '+G.DATUM_M+', V_M_PER_UNIT '+V+' (fixed)');
let off=0; keys.forEach(k=>{ const d=Math.abs(amp[k]-LIVE[k]); if(d>0.011) off++; console.log('  '+name(k).padEnd(48)+' fitted '+amp[k].toFixed(2).padStart(6)+'   world.js '+LIVE[k].toFixed(2).padStart(6)+(d>0.011?'   <-- world.js differs':'')); });
console.log(off?'world.js does not carry the fitted amplitudes ('+off+')':'world.js carries the fitted amplitudes (to 0.01)');
Object.keys(A).forEach(k=>{ const w=M.W(...G.GT[k].map), m=G.elevM(M.height(w[0],w[1])); console.log('  '+k.padEnd(11)+m.toFixed(0)+' m   target '+A[k][0]+' ±'+A[k][1]+(Math.abs(m-A[k][0])>A[k][1]?'   <-- outside':'')); });
module.exports={amp};
