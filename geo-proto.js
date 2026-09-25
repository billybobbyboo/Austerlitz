/* Prototype: fit the similarity transform (ground truth -> legacy frame), then a rubber-sheet warp
   (legacy position -> corrected position) and test it for folds before anything is written. */
const GT={ // lat, lon  (villages: CZ municipality register 1.1.2018; summits: PeakVisor DEM)
 Telnitz:[49.101969,16.717850], Sokolnitz:[49.114020,16.721665], Kobelnitz:[49.138134,16.731930],
 Puntowitz:[49.152257,16.742391], Schlapanitz:[49.168729,16.727418], Girzikowitz:[49.166816,16.758096],
 Bosenitz:[49.191870,16.771563], Blasowitz:[49.165785,16.786216], Holubitz:[49.177588,16.812243],
 Pratzen:[49.141161,16.765498], Krzenowitz:[49.142261,16.829426], Austerlitz:[49.153354,16.876598],
 Augezd:[49.104448,16.757474], Satschan:[49.087986,16.733849], Menitz:[49.082495,16.694343],
 Pratzeberg:[49.128006,16.763427], StareVinohrady:[49.148292,16.785864], Zuran:[49.179365,16.738880],
 Santon:[49.188258,16.763559]};
const OLD={Bosenitz:[215,92],Girzikowitz:[206,178],Puntowitz:[224,214],Kobelnitz:[238,272],Sokolnitz:[232,330],
 Telnitz:[226,396],Augezd:[292,428],Blasowitz:[300,152],Holubitz:[368,88],Pratzen:[372,290],Schlapanitz:[120,165],
 Krzenowitz:[420,180],Austerlitz:[560,205],Menitz:[160,478],Satschan:[322,478],Pratzeberg:[338,306],
 StareVinohrady:[310,190],Zuran:[168,150],Santon:[205,78]};
const LAT0=49.14, LON0=16.76, KX=111.32*Math.cos(LAT0*Math.PI/180), KY=111.13;
const en=n=>[(GT[n][1]-LON0)*KX,(GT[n][0]-LAT0)*KY];
/* fit map = X0 + k(e cos - n sin), Y0 - k(e sin + n cos)  as linear LSQ in (p=k cos, q=k sin, X0, Y0) */
function lsq(A,b){ const n=A[0].length, M=Array.from({length:n},()=>Array(n+1).fill(0));
  for(let r=0;r<A.length;r++) for(let i=0;i<n;i++){ for(let j=0;j<n;j++) M[i][j]+=A[r][i]*A[r][j]; M[i][n]+=A[r][i]*b[r]; }
  for(let i=0;i<n;i++){ let p=i; for(let r=i+1;r<n;r++) if(Math.abs(M[r][i])>Math.abs(M[p][i])) p=r; [M[i],M[p]]=[M[p],M[i]];
    for(let r=0;r<n;r++) if(r!==i){ const f=M[r][i]/M[i][i]; for(let c=i;c<=n;c++) M[r][c]-=f*M[i][c]; } }
  return M.map((row,i)=>row[n]/row[i]); }
function fit(names){ const A=[],b=[]; names.forEach(n=>{ const [e,no]=en(n); A.push([e,-no,1,0]); b.push(OLD[n][0]); A.push([-no,-e,0,1]); b.push(OLD[n][1]); }); return lsq(A,b); }
const fwd=(s,e,no)=>[s[2]+s[0]*e-s[1]*no, s[3]-s[1]*e-s[0]*no];
/* the frame is fitted on VILLAGES only (as in the audit); summits are then placed by it */
const CORE=['Telnitz','Sokolnitz','Kobelnitz','Puntowitz','Girzikowitz','Bosenitz','Blasowitz','Holubitz','Krzenowitz','Augezd','Menitz','Satschan','Pratzen','Austerlitz','Schlapanitz'];
let names=CORE.slice(), s=fit(names);
/* audit procedure: twice, re-score ALL core villages against the current fit and refit without the worst three */
for(let k=0;k<2;k++){ const r=CORE.map(n=>[n,Math.hypot(...fwd(s,...en(n)).map((v,i)=>v-OLD[n][i]))]).sort((a,b)=>a[1]-b[1]); names=r.slice(0,r.length-3).map(x=>x[0]); s=fit(names); }
const k=Math.hypot(s[0],s[1]), th=Math.atan2(s[1],s[0])*180/Math.PI;
console.log('fit on:',names.join(', '));
console.log('k = '+k.toFixed(3)+' map units per true km  ->  '+(1/k).toFixed(5)+' km per map unit;  rotation '+th.toFixed(2)+' deg;  X0,Y0 = '+s[2].toFixed(2)+', '+s[3].toFixed(2));
const NEW={}; Object.keys(GT).forEach(n=>{ NEW[n]=fwd(s,...en(n)); });
const AUD={Pratzen:[276,243],Pratzeberg:[285,289],StareVinohrady:[313,205],Austerlitz:[507,126],Augezd:[297,372],Satschan:[262,444],
 Schlapanitz:[163,177],Sokolnitz:[208,365],Kobelnitz:[205,277],Zuran:[177,134],Santon:[222,87]};
let worst=0; Object.keys(AUD).forEach(n=>{ const d=Math.hypot(NEW[n][0]-AUD[n][0],NEW[n][1]-AUD[n][1]); worst=Math.max(worst,d); });
console.log('audited positions reproduced to within '+worst.toFixed(2)+' map units ('+(worst/k*1000).toFixed(0)+' m)');
/* inverse check */
const inv=(s,mx,my)=>{ const dx=mx-s[2], dy=my-s[3], kk=s[0]*s[0]+s[1]*s[1]; return [(s[0]*dx - s[1]*dy)/kk, (-s[1]*dx - s[0]*dy)/kk]; };
let rt=0; Object.keys(GT).forEach(n=>{ const m=NEW[n], e=inv(s,m[0],m[1]), e0=en(n); rt=Math.max(rt,Math.hypot(e[0]-e0[0],e[1]-e0[1])); });
console.log('inverse round-trip error: '+(rt*1e6).toFixed(3)+' mm');
/* true north in map coordinates (x right, y down) */
const N1=fwd(s,0,1), N0=fwd(s,0,0); const nv=[N1[0]-N0[0],N1[1]-N0[1]]; const nb=Math.atan2(nv[0],-nv[1])*180/Math.PI;
console.log('true north points '+nb.toFixed(1)+' deg from map-up (negative = counter-clockwise, toward the upper left)');
module.exports={s,k,th,NEW,OLD,GT,en,fwd,inv};
