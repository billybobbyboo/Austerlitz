global.GEOREF=require('./geo.js');   /* the single geographic reference */
/* Exercise the real terrain functions on the real three r128 (the devDependency the build's own version): the drawn ground is its
   PlaneGeometry and the meres its CircleGeometry and RingGeometry (roadmap step 1, docs/FINAL_AUDIT.md T-2: until step 1 only THREE.Color,
   stubbed) */
global.THREE=require('three');
const fs=require('fs');
eval(fs.readFileSync('data.js','utf8'));
eval(fs.readFileSync('tokens.js','utf8'));   /* Stage 4E: world.js reads the paper map's ground colours from TOKENS, as in the build's order */
eval(fs.readFileSync('world.js','utf8'));

let t=Date.now();
buildCover();  const tCov=Date.now()-t;
t=Date.now(); buildGrid(); const tGrid=Date.now()-t;
console.log("buildCover",tCov+"ms   buildGrid",tGrid+"ms");

/* land cover across a realistic sampling of the mesh */
t=Date.now();
const NX=281,NZ=241, names=["open field","meadow","marsh","water","wood","village","vineyard","track"];
const cov={}; let n=0;
for(let j=0;j<NZ;j++) for(let i=0;i<NX;i++){
  const x=-180+i*(360/(NX-1)), z=-155+j*(310/(NZ-1));
  const c=coverClass(x,z,localHeight(x,z));   /* the live classifier, on local relief */
  cov[c]=(cov[c]||0)+1; n++;
}
console.log("terrain sample",(Date.now()-t)+"ms");
if(100*(cov[1]||0)/n>15){ console.log("  ! meadow covers "+(100*cov[1]/n).toFixed(1)+"% - the land-cover thresholds are reading regional, not local, relief"); process.exitCode=1; }
console.log("\n-- land cover --");
Object.keys(cov).map(Number).sort((a,b)=>cov[b]-cov[a]).forEach(k=>
  console.log("  "+names[k].padEnd(12),(100*cov[k]/n).toFixed(1).padStart(5)+"%"));

/* contours */
t=Date.now();
let fine=[],index=[],lv=0,levels=0;
for(let L=-5;L<=14.001;L+=CONTOUR_INTERVAL){ marchLevel(L,(lv%CONTOUR_INDEX===0)?index:fine); lv++; levels++; }
console.log("\ncontours: "+levels+" levels, "+
  ((fine.length+index.length)/6).toLocaleString()+" segments in "+(Date.now()-t)+"ms",
  "| index lines:",(index.length/6).toLocaleString());

/* viewshed comparison: the whole point of the Pratzen.
   Observers are placed at ground-truth positions with a 3 m eye (a mounted
   observer), the same convention the application uses. These shares are
   readings from the model's terrain, not historical facts. */
const G=GEOREF, P=k=>G.GT[k].map;
function vsPct(mp,eyeM){
  computeViewshed(mp,eyeM);
  let v=0; for(let i=0;i<vsMask.length;i++) v+=vsMask[i];
  return 100*v/vsMask.length;
}
console.log("\n-- sightlines (share of the field visible from a 3 m eye) --");
const VS={};
[["Pratzeberg","pratzeberg"],["Stare Vinohrady","vinohrady"],["Santon","santon"],["Zuran","zuran"],
 ["Puntowitz (valley)","puntowitz"],["Sokolnitz (valley)","sokolnitz"],["Augezd","augezd"]].forEach(q=>{
  VS[q[1]]=vsPct(P(q[1]),3.0); console.log("  "+q[0].padEnd(24), VS[q[1]].toFixed(1)+"%"); });
computeViewshed(P('pratzeberg'),3.0);
function seen(mp){ const w=W(mp[0],mp[1]); return sampleVS(w[0],w[1])?"visible":"dead ground"; }
console.log("\nFrom the Pratzeberg:  Sokolnitz is "+seen(P('sokolnitz'))+",  Telnitz is "+seen(P('telnitz'))+",  Kobelnitz is "+seen(P('kobelnitz')));
computeViewshed(P('puntowitz'),3.0);
console.log("From Puntowitz:       the Pratzeberg is "+seen(P('pratzeberg'))+",  Stare Vinohrady is "+seen(P('vinohrady')));
clearViewshed();
if(!(VS.pratzeberg>2*VS.puntowitz)) { console.log("  ! the plateau no longer sees much more than the valley floor"); process.exitCode=1; }

/* the tour quotes these two shares: they must be the live readings */
{ const fs2=require('fs'); eval(fs2.readFileSync('analysis.js','utf8'));
  const stop=TOUR.find(x=>/Pratzeberg summit can see/.test(x.x)); const m=stop.x.match(/about (\d+) per cent[^.]*under (\d+) per cent/);
  const ok=m && Math.abs(+m[1]-VS.pratzeberg)<=2 && VS.puntowitz<+m[2];
  console.log("  tour stop 5 quotes "+(m?m[1]+"% and under "+m[2]+"%":"?")+"; live readings "+VS.pratzeberg.toFixed(1)+"% and "+VS.puntowitz.toFixed(1)+"%: "+(ok?"agree":"DISAGREE"));
  if(!ok) process.exitCode=1; }

/* relief in metres at ground-truth positions, against the verified elevations */
console.log("\n-- relief (m, model | verified) --");
const TARGET={pratzeberg:[324,5],vinohrady:[294,6],santon:[296,6],zuran:[290,6],bosenitz:[257,8],kobelnitz:[211,6],sokolnitz:[207,6],pratzen:[245,12],vinocol:[273,10],
  telnitz:[195,8], augezd:[195,8], krzenowitz:[210,8], austerlitz:[218.5,18.5]};   /* Austerlitz: only its 200-237 m range is sourced */
let reliefBad=0;
Object.keys(TARGET).forEach(k=>{ const m=G.elevM(hAt(P(k)[0],P(k)[1])), t=TARGET[k];
  const ok=Math.abs(m-t[0])<=t[1]; if(!ok) reliefBad++;
  console.log("  "+G.GT[k].n.padEnd(30)+m.toFixed(0).padStart(4)+" | "+t[0]+" \u00b1"+t[1]+(ok?"":"   <-- outside")); });
const mAt=k=>G.elevM(hAt(P(k)[0],P(k)[1]));
/* the Pratzeberg's margin is geo-test.js's, 25 m (roadmap step 1, docs/FINAL_AUDIT.md T-9: until step 1 this check asked for 20 m, the two
   checks of one fact disagreeing; the stricter kept) */
const order=[mAt('pratzeberg')-Math.max(mAt('santon'),mAt('vinohrady'),mAt('zuran'))>=25,
             Math.min(mAt('santon'),mAt('vinohrady'),mAt('zuran'))>mAt('vinocol'),
             mAt('vinocol')>mAt('pratzen'), mAt('pratzen')>Math.max(mAt('kobelnitz'),mAt('sokolnitz'))];
console.log("  summit ordering (Pratzeberg 25+ m above Santon/Vinohrady/Zuran > col > Pratzen village > Goldbach): "+(order.every(x=>x)?"OK":"BROKEN "+order)+
  "  (the Pratzeberg "+(mAt('pratzeberg')-Math.max(mAt('santon'),mAt('vinohrady'),mAt('zuran'))).toFixed(1)+" m above the highest of the three)");
const down=mAt('kobelnitz')>=mAt('sokolnitz') && mAt('sokolnitz')>=mAt('telnitz');
console.log("  the Goldbach falls downstream (Kobelnitz >= Sokolnitz >= Telnitz): "+(down?"OK":"BROKEN")+"  ("+['kobelnitz','sokolnitz','telnitz'].map(k=>mAt(k).toFixed(0)).join(" > ")+" m)");
/* the meres: no edge of the ice, nor of its shore ice, may hang above the DRAWN ground (docs/STAGE4_SPEC.md section F.1; roadmap step 1,
   docs/FINAL_AUDIT.md T-2: until step 1 this block computed a level with its own copy of mereLevel's rule, on the model height, and
   compared it with the same model height, which holds by construction). Now every part is the live code's: the meres as buildWater
   makes them (read, not typed again), each at rescaleWorld's level (mereLevel plus its lift), on the ground groundGeometry builds and
   scaleGround draws at each factor, read by groundY. The edge is the drawn one: the mesh's 48 outer vertices under its own matrix.
   groundY is linear on each ground triangle, so its lowest value along a chord of that edge lies at an end or where the chord crosses a
   grid line or a cell's diagonal: found exactly there, and on 2,000 points around the edge as a cross-check. One ice disc and one ring
   of shore ice per mere, two meres, at 1x, 4x and 10.33x: 12 surfaces. Then the check is shown not vacuous: every surface lifted a
   further 0.05 units (mereLevel's own margin), at least one must float. */
let floatBad=0;
{ groundMesh={geometry:groundGeometry()};   /* buildWorld's ground: groundY reads it */
  const MERES=[], scene={add(o){ if(o.userData&&o.userData.mere) MERES.push(o); }};
  waterMeshes.length=0; iceRims.length=0; buildWater(scene);
  const cw=GROUND_W/GROUND_NX, cd=GROUND_D/GROUND_NZ;
  const nameOf=c=>c===SATS?"Satschan":c===MENI?"Menitz":"the mere at "+c.map(v=>v.toFixed(1)).join(",");
  /* the lowest drawn ground on the segment a-b (x, z): every crossing of a grid line in x or z and of a cell's diagonal (fx+fz an
     integer, groundY's split), each read just either side, and the ends */
  function chordLow(a,b){
    const fx=t=>(a[0]+(b[0]-a[0])*t+GROUND_W/2)/cw, fz=t=>(a[1]+(b[1]-a[1])*t+GROUND_D/2)/cd, ts=[0,1];
    [[fx(0),fx(1)],[fz(0),fz(1)],[fx(0)+fz(0),fx(1)+fz(1)]].forEach(([p,q])=>{ if(p===q) return;
      for(let k=Math.ceil(Math.min(p,q));k<=Math.floor(Math.max(p,q));k++) ts.push((k-p)/(q-p)); });
    let lo=1e9; ts.forEach(t=>[t-1e-9,t,t+1e-9].forEach(u=>{ u=Math.max(0,Math.min(1,u));
      lo=Math.min(lo,groundY(a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u)); }));
    return lo;
  }
  /* the drawn edge: the vertices at local radius 1 under the mesh's matrix, each once (the ring closes on its first vertex), in order */
  function drawnEdge(m){
    const P=m.geometry.attributes.position, v=new THREE.Vector3(), c=m.userData.mere[0], E=new Map();
    for(let i=0;i<P.count;i++){ v.fromBufferAttribute(P,i); if(Math.abs(Math.hypot(v.x,v.y)-1)>1e-6) continue;
      v.applyMatrix4(m.matrixWorld); E.set(v.x.toFixed(6)+","+v.z.toFixed(6),[v.x,v.z,Math.atan2(v.z-c[1],v.x-c[0])]); }
    return [...E.values()].sort((p,q)=>p[2]-q[2]);
  }
  /* every surface at every factor, each lifted by extra above rescaleWorld's level */
  function measure(extra){
    const out=[];
    for(const f of DISPLAY.settings){
      DISPLAY.factor=f; DISPLAY.flat=false; scaleGround(groundMesh.geometry);
      MERES.forEach(m=>{ const q=m.userData.mere, y=mereLevel.apply(null,q)+(m.userData.mereLift||0)+extra;   /* rescaleWorld's rule */
        m.position.y=y; m.updateMatrixWorld(true);
        const E=drawnEdge(m); let lo=1e9, dense=1e9;
        for(let i=0;i<E.length;i++) lo=Math.min(lo,chordLow(E[i],E[(i+1)%E.length]));
        for(let k=0;k<2000;k++){ const s=k/2000*E.length, i=Math.floor(s), u=s-i, a=E[i], b=E[(i+1)%E.length];
          dense=Math.min(dense,groundY(a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u)); }
        out.push({name:nameOf(q[0])+" "+(m.userData.mereLift?"shore ice":"ice"), f:f, y:y, n:E.length, lo:lo, dense:dense,
          ok:E.length===48&&lo>=y&&dense>=y}); }); }
    DISPLAY.factor=DISPLAY.defaultFactor; scaleGround(groundMesh.geometry);
    MERES.forEach(m=>{ m.position.y=mereLevel.apply(null,m.userData.mere)+(m.userData.mereLift||0); });
    return out;
  }
  /* one ice disc (in waterMeshes) and one ring of shore ice (in iceRims, lifted) for each of two meres */
  const per={}; MERES.forEach(m=>{ const k=nameOf(m.userData.mere[0]), r=per[k]=per[k]||{ice:0,rim:0};
    if(m.userData.mereLift>0&&iceRims.includes(m)) r.rim++; else if(!m.userData.mereLift&&waterMeshes.includes(m)) r.ice++; });
  const shape=Object.keys(per).length===2&&Object.values(per).every(r=>r.ice===1&&r.rim===1)&&MERES.length===4;
  if(!shape){ console.log("  ! the meres drawn are not two, each one ice disc and one ring of shore ice: "+JSON.stringify(per)); floatBad++; }
  const R=measure(0);
  R.forEach(r=>{ if(!r.ok) floatBad++;
    console.log("  mere: "+r.name+" at "+(+r.f.toFixed(2))+"x: level "+r.y.toFixed(3)+", drawn edge "+r.n+" vertices, its lowest drawn ground "+
      r.lo.toFixed(3)+" (2,000 points "+r.dense.toFixed(3)+"), margin "+(r.lo-r.y).toFixed(4)+(r.ok?"  OK":"  FLOATS")); });
  if(R.length!==12){ console.log("  ! "+R.length+" mere surfaces checked, want 12 (two meres and their shore ice at three factors)"); floatBad++; }
  const C=measure(0.05), nC=C.filter(r=>!r.ok).length;
  console.log("  mere: the check is not vacuous: lifted a further 0.05, "+nC+" of "+C.length+" surfaces would float (want at least 1)");
  if(!nC){ console.log("  ! the mere check cannot fail: lifted a further 0.05, no surface floats"); floatBad++; }
  groundMesh=null;   /* the rest of the suite reads the model, as before */
}
if(reliefBad||!order.every(x=>x)||!down||floatBad) process.exitCode=1;
console.log("  vertical exaggeration (derived): "+G.EXAG.toFixed(1)+"x");

/* --- crop distribution: the field must actually contain all four holdings --- */
(function(){
  const counts=[0,0,0,0]; let field=0;
  for(let mz=20;mz<480;mz+=4) for(let mx=20;mx<660;mx+=4){
    const w=W(mx,mz), x=w[0], z=w[1];
    const ang=0.5+1.7*vnoise(x/88+3.1,z/88+7.7), ca=Math.cos(ang), sa=Math.sin(ang);
    const u1=x*ca+z*sa, v1=-x*sa+z*ca;
    const block=Math.floor(v1/30), strip=Math.floor(u1/5.2);
    const bh=hash2(block*3+1,(strip>>2)*7+5);
    const crop = bh<0.42?0 : bh<0.68?1 : bh<0.88?2 : 3;
    counts[crop]++; field++;
  }
  const pct=counts.map(c=>Math.round(100*c/field));
  console.log("crop distribution (stubble/plough/pasture/sowing): "+pct.join("/")+" %");
  if(counts.some(c=>c===0)) { console.log("  ! a crop type never occurs"); process.exitCode=1; }
})();
