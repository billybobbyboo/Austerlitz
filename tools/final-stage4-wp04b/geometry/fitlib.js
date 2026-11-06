/* WP-04b measurement: the relief's terms, their shapes as world.js computes them, the DEM targets, and a least-squares refit.
   Measurement code only. Loads a tree (ROOT) through the audit's lib.js. */
"use strict";
const fs=require("fs"), path=require("path"), vm=require("vm");
const SCR=path.resolve(__dirname,"..","..","..","docs","final-stage4-wp04b-evidence","dem");   /* WP-04b's requests and responses, as committed */
function loadTree(ROOT){ const L=require(path.join(ROOT,"tools/audit-post8/geography/lib.js")); return L.load(ROOT,{clock:false}); }
/* the live amplitudes as world.js (origin/main add185b) writes them, with the literal each one is */
const LIVE={prat:1.13, crest:5.29, vino:1.03, pberg:5.45, santon:5.24, zuran:5.45, slav:2.58, schlap:3.0, north:0.51, tiltN:0.37, valley:-3.16};
/* the term shapes, mirroring world.js localHeight() and regionalH()/regionalLevel() (amplitude 1) */
function shapes(G){
  const bumpS=(x,z,c,rx,rz,edge)=>G.bump(x,z,c,rx,rz,1,edge);
  const nk=(x,z)=>G.GEOREF.mapToEN(x*G.GEOREF.MAP_PER_WORLD+G.GEOREF.WORLD_ORIGIN[0],z*G.GEOREF.MAP_PER_WORLD+G.GEOREF.WORLD_ORIGIN[1])[1];
  const regRaw={
    north:(x,z)=>G.smoothstep(3.0,6.0,nk(x,z)),
    tiltN:(x,z)=>nk(x,z),
    valley:(x,z)=>{ const dv=Math.min(G.polyDist(x,z,G.LITAVA),G.polyDist(x,z,G.BROOKS[G.BROOKS.length-1])); return Math.exp(-(dv*dv)/625); }
  };
  /* regionalLevel's blend at the meres, linear in each regional term */
  const blend=f=>(x,z)=>{ let r=f(x,z); const ws=G.pondHold(x,z,G.SATS,28,10.5), wm=G.pondHold(x,z,G.MENI,23,9);
    if(ws>0) r=r*(1-ws)+f(G.SATS[0],G.SATS[1])*ws; if(wm>0) r=r*(1-wm)+f(G.MENI[0],G.MENI[1])*wm; return r; };
  return {
    prat:(x,z)=>bumpS(x,z,G.PRAT,50,60,0.48),
    crest:(x,z)=>{ const d=G.polyDist(x,z,G.CREST); return Math.exp(-(d*d)/64); },
    vino:(x,z)=>bumpS(x,z,G.VINO,11,10,0.26),
    pberg:(x,z)=>bumpS(x,z,G.PBERG,10,9.5,0.26),
    santon:(x,z)=>bumpS(x,z,G.SANTON,7.4,6.4,0.30),
    zuran:(x,z)=>bumpS(x,z,G.ZURAN,6.6,5.8,0.36),
    slav:(x,z)=>bumpS(x,z,G.SLAV,13,11,0.40),
    schlap:(x,z)=>bumpS(x,z,G.SCHLAP,15,9,0.36),
    north:blend(regRaw.north), tiltN:blend(regRaw.tiltN), valley:blend(regRaw.valley)
  };
}
/* a new term: a bump as world.js's bump() (flat within edge, nothing beyond 1), optionally turned by rot (radians, world axes); centre in map units,
   radii in world units */
function newShape(G,t){ const c=G.W(t.c[0],t.c[1]), co=Math.cos(t.rot||0), si=Math.sin(t.rot||0);
  return (x,z)=>{ const dx=x-c[0], dz=z-c[1], u=(dx*co+dz*si)/t.rx, v=(-dx*si+dz*co)/t.rz, d=Math.sqrt(u*u+v*v); return 1-G.smoothstep(t.edge,1,d); }; }
/* the DEM data: the audit's responses and this session's */
function demData(G,EV){
  const rd=f=>JSON.parse(fs.readFileSync(f,"utf8"));
  const out={};
  { const req=rd(path.join(EV,"dem-core-request.json")), E=[]; for(let i=0;;i++){ const f=path.join(EV,"raw","openmeteo-core-"+i+".json"); if(!fs.existsSync(f)) break; E.push(...rd(f).elevation); }
    out.core=req.map((p,i)=>({map:p.map, dem:E[i]})); }
  { const req=rd(path.join(EV,"dem-request.json")), E=[]; for(let i=0;;i++){ const f=path.join(EV,"raw","openmeteo-dem-"+i+".json"); if(!fs.existsSync(f)) break; E.push(...rd(f).elevation); }
    out.frame=req.map((p,i)=>Object.assign({},p,{dem:E[i]})).filter(p=>p.set==="grid");
    out.goldbach=req.map((p,i)=>Object.assign({},p,{dem:E[i]})).filter(p=>p.set==="goldbach"); }
  { const req=rd(path.join(EV,"dem-profiles-request.json")), E=rd(path.join(EV,"raw","openmeteo-dem-profiles.json")).elevation; out.profiles=req.map((p,i)=>({set:p.set,k:p.k,map:p.map,dem:E[i]})); }
  { const A=rd(path.join(SCR,"req-anchors.json")), E=rd(path.join(SCR,"raw","openmeteo-anchors-0.json")).elevation, S=rd(path.join(SCR,"raw","opentopodata-srtm30m-anchors.json")).results.map(r=>r.elevation);
    out.anchors=A.map((a,i)=>Object.assign({},a,{dem:E[i], srtm:S[i]})); }
  const grid=(f,n)=>{ const P=rd(path.join(SCR,f)), E=[]; for(let i=0;i<n;i++) E.push(...rd(path.join(SCR,"raw",(f.replace("req-","openmeteo-").replace(".json",""))+"-"+i+".json")).elevation); if(E.length!==P.length) throw new Error(f); return P.map((p,i)=>({map:p.map, dem:E[i]})); };
  out.vsouth=grid("req-vsouth.json",5); out.vslap=grid("req-vslap.json",2);
  { const S=[]; for(let i=0;i<5;i++){ const f=path.join(SCR,"raw","opentopodata-srtm30m-vsouth-"+i+".json"); if(!fs.existsSync(f)) { S.length=0; break; } S.push(...rd(f).results.map(r=>r.elevation)); }
    if(S.length===out.vsouth.length) out.vsouth.forEach((p,i)=>p.srtm=S[i]); }
  return out;
}
/* the sourced anchors of tools/relief-fit.js (A{}) */
const SRC_ANCHORS={pratzeberg:[324,5],vinohrady:[294,6],santon:[296,6],zuran:[290,6],bosenitz:[257,8],kobelnitz:[211,5],sokolnitz:[207,5],pratzen:[245,12],vinocol:[273,10],
  augezd:[195,8],krzenowitz:[210,8],austerlitz:[218,18]};
/* least squares with Gaussian elimination on the normal equations (relief-fit.js's lsq) */
function lsq(A,b){ const m=A[0].length, N=Array.from({length:m},()=>Array(m+1).fill(0)); A.forEach((r,ri)=>{ for(let i=0;i<m;i++){ if(!r[i]) continue; for(let j=0;j<m;j++) N[i][j]+=r[i]*r[j]; N[i][m]+=r[i]*b[ri]; } });
  for(let i=0;i<m;i++){ let p=i; for(let r=i+1;r<m;r++) if(Math.abs(N[r][i])>Math.abs(N[p][i])) p=r; [N[i],N[p]]=[N[p],N[i]]; for(let r=0;r<m;r++) if(r!==i){ const f=N[r][i]/N[i][i]; for(let c=i;c<=m;c++) N[r][c]-=f*N[i][c]; } } return N.map((r,i)=>r[m]/r[i]); }
module.exports={loadTree, LIVE, shapes, newShape, demData, SRC_ANCHORS, lsq, SCR};
