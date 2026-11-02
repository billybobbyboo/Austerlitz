/* Post-Stage-8 final audit, area "geography": one loader for the audit's node scripts.
   Loads a source tree's geo.js, data.js, analysis.js, appearance.js, tokens.js, world.js (on the real three r128) and, when present, the
   generated _clock.js (tools/mk-helpers.js output) into one vm context, as tools/stage8/geo-8j.js does; builds the cover rasters, the local
   relief grid and the analysis grid. Measurement code only: it reads the tree, never writes it.
   Usage: const G=require("./lib.js").load(ROOT)   (ROOT: a tree with node_modules; the audit runs it on an isolated copy) */
"use strict";
const fs=require("fs"), path=require("path"), vm=require("vm");
function load(ROOT,opt){
  opt=opt||{};
  const sb={console, Math, Float32Array, Float64Array, Uint8Array, Uint16Array, Int16Array, Uint32Array, Int32Array, Array, Object, JSON, isFinite,
    parseFloat, parseInt, Number, String, Date, Map, Set, RegExp, Error, Symbol, performance:{now:()=>Date.now()}};
  sb.window={}; sb.THREE=require(path.join(ROOT,"node_modules","three"));
  vm.createContext(sb);
  const run=f=>vm.runInContext(fs.readFileSync(path.join(ROOT,f),"utf8"),sb,{filename:f});
  run("geo.js");
  for(const f of ["data.js","analysis.js","appearance.js","tokens.js","world.js"]) run(f);
  if(opt.clock!==false && fs.existsSync(path.join(ROOT,"_clock.js"))){
    /* the leg logic reads leavesOf, as audit.js defines it */
    vm.runInContext("function leavesOf(id,out){ out=out||[]; var f=FORMATIONS[id]; if(f.track) out.push(id); if(f.children) f.children.forEach(function(k){ leavesOf(k,out); }); return out; }",sb);
    run("_clock.js");
  }
  vm.runInContext("buildCover(); buildCoverMl(); buildGrid();",sb);
  return sb;
}
/* geometry helpers, in whatever unit the points are given */
function segDist(p,a,b){ const vx=b[0]-a[0], vy=b[1]-a[1], L=vx*vx+vy*vy; let t=L?((p[0]-a[0])*vx+(p[1]-a[1])*vy)/L:0; t=Math.max(0,Math.min(1,t));
  const q=[a[0]+t*vx,a[1]+t*vy]; return {d:Math.hypot(p[0]-q[0],p[1]-q[1]), q, t}; }
function polyDist(p,L){ let best={d:1e18}; for(let i=0;i<L.length-1;i++){ const r=segDist(p,L[i],L[i+1]); if(r.d<best.d){ best=r; best.i=i; } } return best; }
/* proper intersection of segments ab and cd: the parameter along ab, or null */
function segX(a,b,c,d){ const r=[b[0]-a[0],b[1]-a[1]], s=[d[0]-c[0],d[1]-c[1]], den=r[0]*s[1]-r[1]*s[0]; if(Math.abs(den)<1e-12) return null;
  const qp=[c[0]-a[0],c[1]-a[1]], t=(qp[0]*s[1]-qp[1]*s[0])/den, u=(qp[0]*r[1]-qp[1]*r[0])/den;
  return (t>=0&&t<=1&&u>=0&&u<=1)?{t,u,p:[a[0]+t*r[0],a[1]+t*r[1]]}:null; }
function polyX(A,B){ const out=[]; for(let i=0;i<A.length-1;i++) for(let j=0;j<B.length-1;j++){ const x=segX(A[i],A[i+1],B[j],B[j+1]); if(x) out.push({i,j,t:x.t,u:x.u,p:x.p}); } return out; }
/* WGS 84 helpers: Vincenty inverse on the ellipsoid (metres, initial azimuth), and a haversine for cross-checks */
function vincenty(lat1,lon1,lat2,lon2){
  const a=6378137, f=1/298.257223563, b=(1-f)*a, R=Math.PI/180, L=(lon2-lon1)*R, U1=Math.atan((1-f)*Math.tan(lat1*R)), U2=Math.atan((1-f)*Math.tan(lat2*R));
  const sU1=Math.sin(U1), cU1=Math.cos(U1), sU2=Math.sin(U2), cU2=Math.cos(U2); let lam=L, it=0, sS, cS, sig, sA, c2A, c2m;
  do{ const sl=Math.sin(lam), cl=Math.cos(lam); sS=Math.sqrt((cU2*sl)**2+(cU1*sU2-sU1*cU2*cl)**2); if(sS===0) return {m:0,az:0};
    cS=sU1*sU2+cU1*cU2*cl; sig=Math.atan2(sS,cS); sA=cU1*cU2*sl/sS; c2A=1-sA*sA; c2m=c2A?cS-2*sU1*sU2/c2A:0;
    const C=f/16*c2A*(4+f*(4-3*c2A)), lp=lam; lam=L+(1-C)*f*sA*(sig+C*sS*(c2m+C*cS*(-1+2*c2m*c2m))); if(Math.abs(lam-lp)<1e-12) break; }while(++it<200);
  const u2=c2A*(a*a-b*b)/(b*b), A=1+u2/16384*(4096+u2*(-768+u2*(320-175*u2))), B=u2/1024*(256+u2*(-128+u2*(74-47*u2)));
  const dS=B*sS*(c2m+B/4*(cS*(-1+2*c2m*c2m)-B/6*c2m*(-3+4*sS*sS)*(-3+4*c2m*c2m)));
  const s=b*A*(sig-dS), az=Math.atan2(cU2*Math.sin(lam),cU1*sU2-sU1*cU2*Math.cos(lam))/R;
  return {m:s, az:(az+360)%360}; }
module.exports={load, segDist, polyDist, segX, polyX, vincenty};
