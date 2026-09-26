#!/usr/bin/env node
/* Stage 2 Part A, section B: the relief at each display exaggeration, from the model (no scene).
   node tools/stage2/relief.js [--json out.json]
   Display factor f (1x = true scale): the drawn height of a model height h (world units, GEOREF.V_M_PER_UNIT
   metres each) is s*h with s = f / GEOREF.EXAG, so a drawn gradient is f times the true gradient.
   - relief: Pratzeberg summit (GEOREF.GT) above Sokolnitz village, and the Santon summit above the Goldbach
     at the point of the stream nearest the Santon; model heights (hAt), drawn world units at f.
   - drawn slope on the Pratzen's west face: (a) along the transect from the Pratzeberg summit due west (map
     frame) to the Goldbach, sampled every 0.25 world units: maximum and mean; (b) the terrain mesh as built
     (the 280 x 240 triangulation of world.js, 81 m cells): 95th percentile and maximum of triangle slopes
     whose centre lies west of the summit (map x < summit x), within 2.0 km of it and above the Goldbach.
   - ratios of the drawn relief to the symbol sizes of docs/VISUAL_SPEC.md §9 (figure 1.98, house height
     1.35 and long side 1.97, broadleaf 3.39, conifer 4.66 world units; medians).
   - the going layer's slope classes (world.js makeGoingPalette: "hard" above 9 degrees, "severe" above 17,
     on the drawn triangles) expressed as true slope, and how many triangles each class holds at each f. */
const {load}=require("./model.js"), fs=require("fs");
const X=load(), G=X.GEOREF, EX=G.EXAG, MPU=G.M_PER_WORLD;
const FACTORS=[1,3,4,5,G.EXAG];
const SYM={figure:1.98, houseH:1.35, houseL:1.97, broadleaf:3.39, conifer:4.66};
const hM=p=>X.hAt(p[0],p[1]);
const P=G.GT.pratzeberg.map, S=G.GT.sokolnitz.map, SA=G.GT.santon.map;
/* nearest point of the Goldbach (map polyline in world.js as GOLDBACH world coords) to the Santon */
const Ws=X.W(SA[0],SA[1]); let gb=null, gd=1e9;
for(let i=0;i<X.GOLDBACH.length-1;i++){ const a=X.GOLDBACH[i], b=X.GOLDBACH[i+1];
  for(let t=0;t<=1;t+=0.01){ const x=a[0]+(b[0]-a[0])*t, z=a[1]+(b[1]-a[1])*t, dd=Math.hypot(x-Ws[0],z-Ws[1]); if(dd<gd){ gd=dd; gb=[x,z]; } } }
const rel={
  pbergSokol:{top:G.elevM(hM(P)), foot:G.elevM(hM(S)), dh:hM(P)-hM(S), km:G.kmBetween(P,S)},
  santonGold:{top:G.elevM(hM(SA)), foot:G.elevM(X.height(gb[0],gb[1])), dh:hM(SA)-X.height(gb[0],gb[1]), km:gd*MPU/1000}
};
/* transect: summit due west (map -x) until the Goldbach bottom (the lowest point) */
const Wp=X.W(P[0],P[1]); const tr=[];
for(let d=0; d<=90; d+=0.25){ const x=Wp[0]-d, z=Wp[1]; tr.push([d,X.height(x,z)]); }
let lo=0; tr.forEach((q,i)=>{ if(q[1]<tr[lo][1]) lo=i; }); const trs=tr.slice(0,lo+1);
const grads=[]; for(let i=1;i<trs.length;i++) grads.push(Math.abs(trs[i][1]-trs[i-1][1])/0.25);   /* model units per world unit */
const gMax=Math.max(...grads), gMean=(trs[0][1]-trs[trs.length-1][1])/(trs[trs.length-1][0]);
/* the mesh as built: vertex heights on the ground grid, two triangles per cell (a,b,d),(b,c,d) */
const NX=280,NZ=240,GW=360,GD=310, cw=GW/NX, cd=GD/NZ;
const Hv=new Float64Array((NX+1)*(NZ+1));
for(let j=0;j<=NZ;j++) for(let i=0;i<=NX;i++) Hv[j*(NX+1)+i]=X.height(-GW/2+i*cw,-GD/2+j*cd);
function triGrad(ax,az,ah,bx,bz,bh,cx,cz,ch){  /* |grad h| of the plane through three points */
  const ux=bx-ax,uz=bz-az,uh=bh-ah, vx=cx-ax,vz=cz-az,vh=ch-ah, det=ux*vz-uz*vx;
  const gx=(uh*vz-uz*vh)/det, gz=(ux*vh-uh*vx)/det; return Math.hypot(gx,gz); }
const west=[], all=[];
const goldH=X.height(Wp[0]-trs[trs.length-1][0],Wp[1]);
for(let j=0;j<NZ;j++) for(let i=0;i<NX;i++){
  const x0=-GW/2+i*cw, z0=-GD/2+j*cd, x1=x0+cw, z1=z0+cd, h=(a,b)=>Hv[b*(NX+1)+a];
  const A=[x0,z0,h(i,j)], B=[x0,z1,h(i,j+1)], C=[x1,z1,h(i+1,j+1)], D=[x1,z0,h(i+1,j)];
  [[A,B,D],[B,C,D]].forEach(t=>{
    const g=triGrad(...t[0],...t[1],...t[2]), cx=(t[0][0]+t[1][0]+t[2][0])/3, cz=(t[0][1]+t[1][1]+t[2][1])/3, ch=(t[0][2]+t[1][2]+t[2][2])/3;
    all.push(g);
    if(cx<Wp[0] && Math.hypot(cx-Wp[0],cz-Wp[1])*MPU<=2000 && ch>goldH) west.push(g);
  });
}
west.sort((a,b)=>a-b); const w95=west[Math.floor(west.length*0.95)], wMax=west[west.length-1];
const deg=g=>Math.atan(g)*180/Math.PI;
/* model gradients are in model units (V_M_PER_UNIT m) per world unit (M_PER_WORLD m): true gradient = g/EX */
const out={EXAG:EX, relief:rel, symbols:SYM, transect:{lengthKm:trs[trs.length-1][0]*MPU/1000, dropM:(trs[0][1]-trs[trs.length-1][1])*G.V_M_PER_UNIT},
  going:{hardDrawnDeg:9,severeDrawnDeg:17,hardTrueDeg:deg(Math.tan(9*Math.PI/180)/EX),severeTrueDeg:deg(Math.tan(17*Math.PI/180)/EX)}, rows:[]};
FACTORS.forEach(f=>{
  const s=f/EX, r={f:+f.toFixed(2)};
  r.pbergSokolUnits=rel.pbergSokol.dh*s; r.santonGoldUnits=rel.santonGold.dh*s;
  r.transectMaxDeg=deg(gMax*s); r.transectMeanDeg=deg(gMean*s);
  r.meshWest95Deg=deg(w95*s); r.meshWestMaxDeg=deg(wMax*s);
  Object.entries(SYM).forEach(([k,v])=>{ r["pbergSokol_per_"+k]=r.pbergSokolUnits/v; });
  r.santon_per_figure=r.santonGoldUnits/SYM.figure;
  /* going classes as the layer computes them today (on the drawn slope at the current 10.33x), and if computed at f */
  const hard=all.filter(g=>deg(g*s)>9&&deg(g*s)<=17).length, sev=all.filter(g=>deg(g*s)>17).length;
  r.goingHardPct=100*hard/all.length; r.goingSeverePct=100*sev/all.length;
  out.rows.push(r);
});
out.trueSlope={transectMaxDeg:deg(gMax/EX), transectMeanDeg:deg(gMean/EX), meshWest95Deg:deg(w95/EX), meshWestMaxDeg:deg(wMax/EX)};
const f2=x=>x.toFixed(2), f1=x=>x.toFixed(1);
console.log("Pratzeberg "+f1(rel.pbergSokol.top)+" m above Sokolnitz "+f1(rel.pbergSokol.foot)+" m: "+f1(rel.pbergSokol.dh*G.V_M_PER_UNIT)+" m over "+f2(rel.pbergSokol.km)+" km (model heights)");
console.log("Santon "+f1(rel.santonGold.top)+" m above the Goldbach "+f1(rel.santonGold.foot)+" m at the stream's nearest point, "+f2(rel.santonGold.km)+" km: "+f1(rel.santonGold.dh*G.V_M_PER_UNIT)+" m");
console.log("west-face transect: "+f2(out.transect.lengthKm)+" km, drop "+f1(out.transect.dropM)+" m; true slope max "+f1(out.trueSlope.transectMaxDeg)+", mean "+f2(out.trueSlope.transectMeanDeg)+
  " deg; mesh (west, 2 km, "+west.length+" triangles) true p95 "+f1(out.trueSlope.meshWest95Deg)+", max "+f1(out.trueSlope.meshWestMaxDeg)+" deg");
console.log("going classes on the drawn 10.33x slope: 'hard' > 9 deg drawn = "+f2(out.going.hardTrueDeg)+" deg true; 'severe' > 17 deg drawn = "+f2(out.going.severeTrueDeg)+" deg true");
console.log("f\tPb-Sok u\tSan-Gb u\ttr max\ttr mean\tmesh p95\tmesh max\tPb/fig\tPb/house\tPb/tree\tPb/conif\tSan/fig\thard%\tsevere%");
out.rows.forEach(r=>console.log([f2(r.f),f2(r.pbergSokolUnits),f2(r.santonGoldUnits),f1(r.transectMaxDeg),f1(r.transectMeanDeg),f1(r.meshWest95Deg),f1(r.meshWestMaxDeg),
  f2(r.pbergSokol_per_figure),f2(r.pbergSokol_per_houseH),f2(r.pbergSokol_per_broadleaf),f2(r.pbergSokol_per_conifer),f2(r.santon_per_figure),f1(r.goingHardPct),f1(r.goingSeverePct)].join("\t")));
const i=process.argv.indexOf("--json"); if(i>0) fs.writeFileSync(process.argv[i+1],JSON.stringify(out,null,1));
