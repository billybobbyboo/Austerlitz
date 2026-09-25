const G=require('./geo-proto.js');
const CTRL=Object.keys(G.OLD).map(n=>({n,P:G.OLD[n],Q:G.NEW[n],D:[G.NEW[n][0]-G.OLD[n][0],G.NEW[n][1]-G.OLD[n][1]]}));
/* 1. Shepard IDW (exact, bounded: every displacement is a convex mix of control displacements) */
function idw(x,y,p){ let sw=0,dx=0,dy=0; for(const c of CTRL){ const d2=(x-c.P[0])**2+(y-c.P[1])**2; if(d2<1e-9) return c.D; const w=1/Math.pow(d2,p/2); sw+=w; dx+=w*c.D[0]; dy+=w*c.D[1]; } return [dx/sw,dy/sw]; }
/* 2. thin-plate spline (exact, minimal bending, affine extrapolation) */
function tpsSolve(){ const n=CTRL.length, N=n+3, M=Array.from({length:N},()=>Array(N).fill(0)), bx=Array(N).fill(0), by=Array(N).fill(0);
  const U=r=>r<1e-9?0:r*r*Math.log(r);
  for(let i=0;i<n;i++){ for(let j=0;j<n;j++) M[i][j]=U(Math.hypot(CTRL[i].P[0]-CTRL[j].P[0],CTRL[i].P[1]-CTRL[j].P[1]));
    M[i][n]=1; M[i][n+1]=CTRL[i].P[0]; M[i][n+2]=CTRL[i].P[1]; M[n][i]=1; M[n+1][i]=CTRL[i].P[0]; M[n+2][i]=CTRL[i].P[1]; bx[i]=CTRL[i].D[0]; by[i]=CTRL[i].D[1]; }
  const solve=(A0,b0)=>{ const A=A0.map(r=>r.slice()), b=b0.slice(), m=b.length; for(let i=0;i<m;i++){ let p=i; for(let r=i+1;r<m;r++) if(Math.abs(A[r][i])>Math.abs(A[p][i])) p=r;
      [A[i],A[p]]=[A[p],A[i]]; [b[i],b[p]]=[b[p],b[i]]; for(let r=0;r<m;r++) if(r!==i){ const f=A[r][i]/A[i][i]; for(let c=i;c<m;c++) A[r][c]-=f*A[i][c]; b[r]-=f*b[i]; } } return b.map((v,i)=>v/A[i][i]); };
  return {wx:solve(M,bx), wy:solve(M,by), U}; }
const T=tpsSolve();
function tps(x,y){ const n=CTRL.length; let dx=T.wx[n]+T.wx[n+1]*x+T.wx[n+2]*y, dy=T.wy[n]+T.wy[n+1]*x+T.wy[n+2]*y;
  for(let i=0;i<n;i++){ const u=T.U(Math.hypot(x-CTRL[i].P[0],y-CTRL[i].P[1])); dx+=T.wx[i]*u; dy+=T.wy[i]*u; } return [dx,dy]; }
function assess(name,f){ let minDet=1e9,at=null,neg=0,tot=0,maxD=0;
  for(let y=0;y<=500;y+=4) for(let x=0;x<=680;x+=4){ const h=1, a=f(x+h,y), b=f(x-h,y), c=f(x,y+h), d=f(x,y-h);
    const J=[[1+(a[0]-b[0])/(2*h),(c[0]-d[0])/(2*h)],[(a[1]-b[1])/(2*h),1+(c[1]-d[1])/(2*h)]]; const det=J[0][0]*J[1][1]-J[0][1]*J[1][0];
    tot++; if(det<=0) neg++; if(det<minDet){minDet=det;at=[x,y];} const m=f(x,y); maxD=Math.max(maxD,Math.hypot(m[0],m[1])); }
  let exact=0; CTRL.forEach(c=>{ const m=f(c.P[0],c.P[1]); exact=Math.max(exact,Math.hypot(m[0]-c.D[0],m[1]-c.D[1])); });
  console.log(name.padEnd(10)+' folded area '+(100*neg/tot).toFixed(2)+'%  min Jacobian '+minDet.toFixed(3)+' at ['+at+']  max displacement '+maxD.toFixed(0)+'  control error '+exact.toFixed(3)); }
assess('IDW p=2',(x,y)=>idw(x,y,2)); assess('IDW p=3',(x,y)=>idw(x,y,3)); assess('TPS',tps);
module.exports={CTRL,idw,tps};
