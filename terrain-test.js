global.GEOREF=require('./geo.js');   /* the single geographic reference */
/* Exercise the real terrain functions with only THREE.Color stubbed. */
global.THREE={ Color:class{constructor(h){this.setHex(h||0xffffff)}
  setHex(h){this.r=((h>>16)&255)/255;this.g=((h>>8)&255)/255;this.b=(h&255)/255;return this} } };
const fs=require('fs');
eval(fs.readFileSync('data.js','utf8'));
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
const order=[mAt('pratzeberg')>Math.max(mAt('santon'),mAt('vinohrady'),mAt('zuran'))+20,
             Math.min(mAt('santon'),mAt('vinohrady'),mAt('zuran'))>mAt('vinocol'),
             mAt('vinocol')>mAt('pratzen'), mAt('pratzen')>Math.max(mAt('kobelnitz'),mAt('sokolnitz'))];
console.log("  summit ordering (Pratzeberg > Santon/Vinohrady/Zuran > col > Pratzen village > Goldbach): "+(order.every(x=>x)?"OK":"BROKEN "+order));
const down=mAt('kobelnitz')>=mAt('sokolnitz') && mAt('sokolnitz')>=mAt('telnitz');
console.log("  the Goldbach falls downstream (Kobelnitz >= Sokolnitz >= Telnitz): "+(down?"OK":"BROKEN")+"  ("+['kobelnitz','sokolnitz','telnitz'].map(k=>mAt(k).toFixed(0)).join(" > ")+" m)");
/* the meres: no edge of the water may hang above the ground */
let floatBad=0;
[["Satschan",SATS,28,10.5,-3.85],["Menitz",MENI,23,9,-3.95]].forEach(([n,c,rx,rz,base])=>{
  let lo=1e9; for(let a=0;a<96;a++){ const t=a/96*Math.PI*2; lo=Math.min(lo,height(c[0]+Math.cos(t)*rx,c[1]+Math.sin(t)*rz)); }
  const wl=Math.min(base+1.2*regionalLevel(c[0],c[1]),lo-0.05);
  const ok=wl<=lo; if(!ok) floatBad++;
  console.log("  "+n+" mere: water "+wl.toFixed(2)+", lowest ground at its edge "+lo.toFixed(2)+(ok?"  OK":"  FLOATS")); });
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
