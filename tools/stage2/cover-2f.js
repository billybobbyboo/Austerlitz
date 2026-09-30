#!/usr/bin/env node
/* Stage 2F: the cover boundary error (docs/STAGE2_SPEC.md section J, 2F), computed from the model in node.
   node tools/stage2/cover-2f.js [--h 0.125] [--alternatives] [--json out.json]
   The cover polygon of class k is where the model's classifier, at the point itself, gives k:
   coverClass(x, z, localHeight(x, z)) (as terrain-test.js samples it). A drawing's cover is compared with it on a grid of
   step h world units (default 0.125, 7.9 m; the points are the centres of the self-test's render pixels) over the modelled
   ground. For each class k the error is the largest distance from a point where the drawing and the model disagree about k
   (one says k, the other not) to the model's edge of k, less h/2 (the edge lies between two points; resolution +-h/2).
   Drawings, as the code of each stage defines them (the page measures the render itself: AUSTERLITZ_DEBUG.cover):
     2E landscape: each 81 m triangle in the class of its centroid (FACE.cover in buildFaceFacts, before 2F);
     2E paper map: the same triangles, under the village footprints (covVill > 0.55) and the wood symbology (covWood > 0.5);
     2F: drawnCover (world.js), the rule the ground shader evaluates at every point.
   --alternatives adds the two rejected ways of reading the local relief (the report's reasons for COVER_ML): interpolated
   across each triangle from its vertices, and bilinear on a uniform 0.5 grid.
   Also: COVER_ML against the exact grid (every node on the same side of every threshold), and where the paper map's
   symbology and the model's classes disagree (area, by class). */
const W=require("./wmodel.js").load(["coverClass","covAt","buildCover","regionalLevel","localHeight","height","covWood","covVill","GEOREF",
  "buildCoverMl","coverMlAt","drawnCover","COVER_ML"]);
const argv=process.argv.slice(2), opt=(k,d)=>{ const i=argv.indexOf(k); return i>=0?argv[i+1]:d; }, ALT=argv.includes("--alternatives");
const h=+opt("--h",0.125), M_PER=W.GEOREF.M_PER_WORLD;
W.buildCover();
let t0=Date.now(); W.buildCoverMl(); const mlMs=Date.now()-t0;
const res={h, metresPerUnit:M_PER, coverMl:{}, classes:{}, symbology:{}};
/* COVER_ML against localHeight at every node */
{ const M=W.COVER_ML; let flips=0, maxd=0;
  for(let j=0;j<M.nz;j++) for(let i=0;i<M.nx;i++){ const e=W.localHeight(M.x0+i*M.step,M.z0+j*M.step), a=M.a[j*M.nx+i];
    for(const t of [-2.6,-1.2,0.4]) if((a<t)!==(e<t)) flips++; }
  res.coverMl={nodes:M.nx*M.nz, exact:M.exact, sideFlips:flips, buildMs:mlMs};
  console.log("COVER_ML: "+M.nx+" x "+M.nz+" nodes, "+M.exact+" evaluated exactly ("+mlMs+" ms in node); nodes on the other side of a threshold from localHeight: "+flips); }
const NAMES=["field","meadow","marsh","water","wood","village","vineyard","track"];
const X0=-180, Z0=-155, NX=Math.round(360/h), NZ=Math.round(310/h), N=NX*NZ;
/* the ground mesh: PlaneGeometry(360,310,280,240) laid flat; cell (ix,iz) holds triangles (a,b,d) and (b,c,d) (groundY) */
const GX=281, GZ=241, cw=360/280, cd=310/240, VH=new Float64Array(GX*GZ), VML=new Float64Array(GX*GZ);
for(let j=0;j<GZ;j++) for(let i=0;i<GX;i++){ const x=-180+i*cw, z=-155+j*cd, k=j*GX+i; VH[k]=W.height(x,z); VML[k]=VH[k]-1.2*W.regionalLevel(x,z); }
const TRI=new Uint8Array(280*240*2);
for(let iz=0;iz<240;iz++) for(let ix=0;ix<280;ix++){
  const a=iz*GX+ix, b=a+GX, c=b+1, d=a+1, ax=-180+ix*cw, az=-155+iz*cd;
  [[a,b,d,[ax,az],[ax,az+cd],[ax+cw,az]],[b,c,d,[ax,az+cd],[ax+cw,az+cd],[ax+cw,az]]].forEach((t,s)=>{
    const mx=(t[3][0]+t[4][0]+t[5][0])/3, mz=(t[3][1]+t[4][1]+t[5][1])/3, mh=(VH[t[0]]+VH[t[1]]+VH[t[2]])/3;
    TRI[(iz*280+ix)*2+s]=W.coverClass(mx,mz,mh-1.2*W.regionalLevel(mx,mz)); });
}
function cell(x,z){ const fx=(x+180)/cw, fz=(z+155)/cd, ix=Math.min(279,Math.max(0,Math.floor(fx))), iz=Math.min(239,Math.max(0,Math.floor(fz)));
  return [ix,iz,fx-ix,fz-iz]; }
function triClass(x,z){ const c=cell(x,z); return TRI[(c[1]*280+c[0])*2+(c[2]+c[3]<=1?0:1)]; }
function mlVertex(x,z){ const c=cell(x,z), a=c[1]*GX+c[0], b=a+GX, cc=b+1, d=a+1, u=c[2], v=c[3];
  return (u+v<=1) ? VML[a]+u*(VML[d]-VML[a])+v*(VML[b]-VML[a]) : VML[cc]+(1-u)*(VML[b]-VML[cc])+(1-v)*(VML[d]-VML[cc]); }
const G5={nx:721,nz:621,a:null};
if(ALT){ G5.a=new Float64Array(G5.nx*G5.nz); for(let j=0;j<G5.nz;j++) for(let i=0;i<G5.nx;i++) G5.a[j*G5.nx+i]=W.localHeight(-180+i*0.5,-155+j*0.5); }
function ml05(x,z){ const fi=(x+180)/0.5, fj=(z+155)/0.5, i=Math.min(G5.nx-2,Math.floor(fi)), j=Math.min(G5.nz-2,Math.floor(fj)), u=fi-i, v=fj-j, k=j*G5.nx+i, a=G5.a;
  return (a[k]*(1-u)+a[k+1]*u)*(1-v)+(a[k+G5.nx]*(1-u)+a[k+G5.nx+1]*u)*v; }
const T=new Uint8Array(N), D={"2E landscape":new Uint8Array(N), "2E paper map":new Uint8Array(N), "2F":new Uint8Array(N)};
if(ALT){ D["relief from the 81 m vertices"]=new Uint8Array(N); D["relief bilinear on a 0.5 grid"]=new Uint8Array(N); }
const woodIn=new Uint8Array(N), villIn=new Uint8Array(N);
t0=Date.now();
for(let j=0;j<NZ;j++){ const z=Z0+(j+0.5)*h; for(let i=0;i<NX;i++){ const x=X0+(i+0.5)*h, k=j*NX+i;
  T[k]=W.coverClass(x,z,W.localHeight(x,z));
  const tc=triClass(x,z); D["2E landscape"][k]=tc;
  const wv=W.covAt(W.covWood,x,z)>0.5, vv=W.covAt(W.covVill,x,z)>0.55; woodIn[k]=wv; villIn[k]=vv;
  D["2E paper map"][k]=vv?5:wv?4:tc;
  D["2F"][k]=W.drawnCover(x,z);
  if(ALT){ D["relief from the 81 m vertices"][k]=W.coverClass(x,z,mlVertex(x,z)); D["relief bilinear on a 0.5 grid"][k]=W.coverClass(x,z,ml05(x,z)); }
} }
console.error("grid "+NX+" x "+NZ+" at "+h+" units ("+(h*M_PER).toFixed(1)+" m): "+((Date.now()-t0)/1000).toFixed(1)+" s");
/* exact Euclidean distance transform (Felzenszwalb and Huttenlocher), in grid steps, to the set where mask is 1 */
function edt(mask){
  const INF=1e20, L=Math.max(NX,NZ), f=new Float64Array(L), dd=new Float64Array(L), v=new Int32Array(L), zz=new Float64Array(L+1), out=new Float32Array(N);
  function pass(n){ let k=0; v[0]=0; zz[0]=-INF; zz[1]=INF;
    for(let q=1;q<n;q++){ let s; while(true){ s=((f[q]+q*q)-(f[v[k]]+v[k]*v[k]))/(2*q-2*v[k]); if(s<=zz[k]){ k--; continue; } break; }
      k++; v[k]=q; zz[k]=s; zz[k+1]=INF; }
    k=0; for(let q=0;q<n;q++){ while(zz[k+1]<q) k++; dd[q]=(q-v[k])*(q-v[k])+f[v[k]]; } }
  for(let i=0;i<NX;i++){ for(let j=0;j<NZ;j++) f[j]=mask[j*NX+i]?0:INF; pass(NZ); for(let j=0;j<NZ;j++) out[j*NX+i]=dd[j]; }
  for(let j=0;j<NZ;j++){ for(let i=0;i<NX;i++) f[i]=out[j*NX+i]; pass(NX); for(let i=0;i<NX;i++) out[j*NX+i]=Math.sqrt(dd[i]); }
  return out;
}
const km2=c=>+(c*h*h*M_PER*M_PER/1e6).toFixed(3);
for(let k=0;k<8;k++){
  const inK=new Uint8Array(N), outK=new Uint8Array(N); let area=0; for(let q=0;q<N;q++){ inK[q]=T[q]===k; outK[q]=T[q]!==k; area+=inK[q]; }
  if(!area) continue;
  const dIn=edt(inK), dOut=edt(outK), r={areaKm2:km2(area)};
  for(const name of Object.keys(D)){ const A=D[name]; let worst=0, at=null, bad=0;
    for(let q=0;q<N;q++){ let d;
      if(T[q]===k&&A[q]!==k) d=dOut[q]; else if(T[q]!==k&&A[q]===k) d=dIn[q]; else continue;
      bad++; if(d>worst){ worst=d; at=q; } }
    r[name]={maxErrorM:bad?+(Math.max(0,worst-0.5)*h*M_PER).toFixed(1):0, wrongKm2:km2(bad),
      worstAt:at===null?null:[+(X0+(at%NX+0.5)*h).toFixed(2),+(Z0+(Math.floor(at/NX)+0.5)*h).toFixed(2)]}; }
  res.classes[NAMES[k]]=r;
  console.log(NAMES[k].padEnd(9)+String(r.areaKm2).padStart(8)+" km2 | "+Object.keys(D).map(n=>n+" "+String(r[n].maxErrorM).padStart(6)+" m ("+r[n].wrongKm2+" km2)").join(" | "));
}
/* the paper map's symbology against the model's classes: the area inside each symbol whose class is another */
[["wood symbology, 2E (covWood > 0.5)",woodIn,4],["village footprints (covVill > 0.55)",villIn,5]].forEach(q=>{ const by={}; let tot=0, all=0, outside=0;
  for(let k=0;k<N;k++){ if(q[1][k]){ all++; if(T[k]!==q[2]){ tot++; by[NAMES[T[k]]]=(by[NAMES[T[k]]]||0)+1; } } else if(T[k]===q[2]) outside++; }
  res.symbology[q[0]]={areaKm2:km2(all), otherClassKm2:km2(tot), byClass:Object.fromEntries(Object.entries(by).map(e=>[e[0],km2(e[1])])), classOutsideKm2:km2(outside)};
  console.log(q[0]+": "+JSON.stringify(res.symbology[q[0]])); });
const jo=argv.indexOf("--json"); if(jo>=0) require("fs").writeFileSync(argv[jo+1],JSON.stringify(res,null,1));
