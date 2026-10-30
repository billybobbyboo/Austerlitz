/* WGS 84 <-> S-JTSK / Krovak East North (EPSG:5514), for reading the ČÚZK and CENIA services that serve EPSG:5514.
   Krovak per EPSG Guidance Note 7-2 (method 9819/1041), Bessel 1841; the datum shift S-JTSK -> WGS 84 by the seven
   parameters 570.8, 85.7, 462.8 m, 4.998", 1.587", 5.261", 3.56 ppm (EPSG:1623's values) applied as a position vector
   transformation (PROJ's +towgs84 for EPSG:5514). Checked against the RÚIAN service's own EPSG:5514 and EPSG:4326 outputs
   for the same buildings by compute-places.js (checks.krovak in places.json): they agree to 0.00 m in this convention, and
   differ by 31 m in the coordinate frame convention, which this file used in its first draft.
   Research tool for docs/stage8-evidence/8h/geo; not part of the build. */
"use strict";
const D2R = Math.PI/180, AS2R = Math.PI/(180*3600);
const WGS = {a:6378137.0, f:1/298.257223563};
const BES = {a:6377397.155, f:1/299.1528128};
/* S-JTSK to WGS 84: EPSG:1623's seven values, position vector convention */
const H = {tx:570.8, ty:85.7, tz:462.8, rx:4.998*AS2R, ry:1.587*AS2R, rz:5.261*AS2R, ds:3.56e-6};
function e2(el){ return el.f*(2-el.f); }
function geod2ecef(lat,lon,h,el){ const a=el.a, E2=e2(el), s=Math.sin(lat*D2R), c=Math.cos(lat*D2R), N=a/Math.sqrt(1-E2*s*s);
  return [(N+h)*c*Math.cos(lon*D2R),(N+h)*c*Math.sin(lon*D2R),(N*(1-E2)+h)*s]; }
function ecef2geod(X,Y,Z,el){ const a=el.a, E2=e2(el), p=Math.hypot(X,Y); let lat=Math.atan2(Z,p*(1-E2)), h=0;
  for(let i=0;i<10;i++){ const s=Math.sin(lat), N=a/Math.sqrt(1-E2*s*s); h=p/Math.cos(lat)-N; lat=Math.atan2(Z,p*(1-E2*N/(N+h))); }
  return [lat/D2R, Math.atan2(Y,X)/D2R, h]; }
/* position vector transformation (EPSG 9606): Xt = (1+ds) R Xs + T, R = [[1,-rz,ry],[rz,1,-rx],[-ry,rx,1]] */
function pvt(P){ const rx=H.rx, ry=H.ry, rz=H.rz, m=1+H.ds;
  return [m*(P[0]-rz*P[1]+ry*P[2])+H.tx, m*(rz*P[0]+P[1]-rx*P[2])+H.ty, m*(-ry*P[0]+rx*P[1]+P[2])+H.tz]; }
function jtsk2wgsGeod(lat,lon){ const P=pvt(geod2ecef(lat,lon,0,BES)); return ecef2geod(P[0],P[1],P[2],WGS); }
function wgs2jtskGeod(lat,lon){ /* the inverse by iteration on the forward shift (exact to well under a millimetre) */
  let la=lat, lo=lon; for(let i=0;i<6;i++){ const f=jtsk2wgsGeod(la,lo); la+=lat-f[0]; lo+=lon-f[1]; } return [la,lo]; }
/* Krovak on Bessel */
const KR = (function(){ const a=BES.a, E2=e2(BES), e=Math.sqrt(E2), phC=49.5*D2R, lam0=(24+50/60)*D2R, alC=(30+17/60+17.30311/3600)*D2R,
  phP=78.5*D2R, kP=0.9999, sC=Math.sin(phC);
  const A=a*Math.sqrt(1-E2)/(1-E2*sC*sC), B=Math.sqrt(1+E2*Math.pow(Math.cos(phC),4)/(1-E2)), g0=Math.asin(sC/B);
  const t0=Math.tan(Math.PI/4+g0/2)*Math.pow((1+e*sC)/(1-e*sC),e*B/2)/Math.pow(Math.tan(Math.PI/4+phC/2),B);
  const n=Math.sin(phP), r0=kP*A/Math.tan(phP);
  return {e,lam0,alC,phP,B,t0,n,r0}; })();
function krovakFwd(lat,lon){ const {e,lam0,alC,phP,B,t0,n,r0}=KR, ph=lat*D2R, la=lon*D2R, s=Math.sin(ph);
  const U=2*(Math.atan(t0*Math.pow(Math.tan(ph/2+Math.PI/4),B)/Math.pow((1+e*s)/(1-e*s),e*B/2))-Math.PI/4);
  const V=B*(lam0-la), T=Math.asin(Math.cos(alC)*Math.sin(U)+Math.sin(alC)*Math.cos(U)*Math.cos(V));
  const Dd=Math.asin(Math.cos(U)*Math.sin(V)/Math.cos(T)), th=n*Dd;
  const r=r0*Math.pow(Math.tan(Math.PI/4+phP/2),n)/Math.pow(Math.tan(T/2+Math.PI/4),n);
  const Xs=r*Math.cos(th), Yw=r*Math.sin(th);   /* southing, westing */
  return [-Yw,-Xs]; }                           /* EPSG:5514 east, north */
function krovakInv(E,N){ const {e,lam0,alC,phP,B,t0,n,r0}=KR, Xs=-N, Yw=-E;
  const r=Math.hypot(Xs,Yw), th=Math.atan2(Yw,Xs), Dd=th/n;
  const T=2*(Math.atan(Math.pow(r0/r,1/n)*Math.tan(Math.PI/4+phP/2))-Math.PI/4);
  const U=Math.asin(Math.cos(alC)*Math.sin(T)-Math.sin(alC)*Math.cos(T)*Math.cos(Dd));
  const V=Math.asin(Math.cos(T)*Math.sin(Dd)/Math.cos(U));
  let ph=U; for(let i=0;i<8;i++){ const s=Math.sin(ph); ph=2*(Math.atan(Math.pow(t0,-1/B)*Math.pow(Math.tan(U/2+Math.PI/4),1/B)*Math.pow((1+e*s)/(1-e*s),e/2))-Math.PI/4); }
  return [ph/D2R,(lam0-V/B)/D2R]; }
/* public: WGS 84 lat/lon <-> EPSG:5514 [E,N] */
function toJTSK(lat,lon){ const g=wgs2jtskGeod(lat,lon); return krovakFwd(g[0],g[1]); }
function fromJTSK(E,N){ const g=krovakInv(E,N); const w=jtsk2wgsGeod(g[0],g[1]); return [w[0],w[1]]; }
module.exports={toJTSK,fromJTSK,krovakFwd,krovakInv,jtsk2wgsGeod,wgs2jtskGeod};
