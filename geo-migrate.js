/* =========================================================================
   One-time migration of every map coordinate from the legacy frame to the
   ground-truth-corrected frame.

   Controls: the nineteen places the legacy map already drew (villages and
   summits) -> their positions from GEO (ground truth through the fitted
   transform). Every other coordinate moves by inverse-distance weighting of
   the control displacements (Shepard, p = 2): exact at the controls,
   bounded (no displacement larger than a control's), no extrapolation.
   Points the legacy map had topologically wrong (fold zones) are listed by
   tools/inventory.js and re-anchored by meaning in tools/geo-anchor.js.

   Run once:  node tools/geo-migrate.js      (rewrites the four sources; ALREADY APPLIED -
   running it again would warp the corrected coordinates a second time)
   ========================================================================= */
const fs=require('fs'), path=require('path');
const GEO=require('../geo.js');
const ROOT=path.join(__dirname,'..');

const {warp,CTRL,LEGACY}=require('./warp.js');   /* the single warp, shared with geo-anchor.js */
const R=v=>Math.round(v);
const W2M=(x,z)=>[x*2+340, z*2+250], M2W=(mx,my)=>[(mx-340)*0.5,(my-250)*0.5];

/* pair rewriter: every [x,y] numeric pair in a text region */
const PAIR=/\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]/g;
function warpPairs(txt){ return txt.replace(PAIR,(m,a,b)=>{ const q=warp(+a,+b); return '['+R(q[0])+','+R(q[1])+']'; }); }
/* keyed pair: key:[x,y] */
function warpKeyed(txt,keys){
  const re=new RegExp('\\b('+keys.join('|')+')\\s*:\\s*\\[\\s*(-?\\d+(?:\\.\\d+)?)\\s*,\\s*(-?\\d+(?:\\.\\d+)?)\\s*\\]','g');
  return txt.replace(re,(m,k,a,b)=>{ const q=warp(+a,+b); return k+':['+R(q[0])+','+R(q[1])+']'; });
}
/* keyed list of pairs: key:[[x,y],...] */
function warpKeyedLists(txt,keys){
  const re=new RegExp('\\b('+keys.join('|')+')\\s*:\\s*(\\[\\s*\\[[^\\]]*\\](?:\\s*,\\s*\\[[^\\]]*\\])*\\s*\\])','g');
  return txt.replace(re,(m,k,list)=>k+':'+warpPairs(list));
}
/* camera arrays [cx,cy,cz, tx,ty,tz] in world units: move the target by the warp,
   and the camera with it (same orbit offset). independent=true warps both. */
function warpCam(nums,independent){
  const v=nums.map(Number);
  const tm=W2M(v[3],v[5]), tq=warp(tm[0],tm[1]), tw=M2W(tq[0],tq[1]);
  let cx=v[0]+(tw[0]-v[3]), cz=v[2]+(tw[1]-v[5]);
  if(independent){ const cm=W2M(v[0],v[2]), cq=warp(cm[0],cm[1]), cw=M2W(cq[0],cq[1]); cx=cw[0]; cz=cw[1]; }
  return [R(cx),v[1],R(cz),R(tw[0]),v[4],R(tw[1])];
}
function warpCams(txt,key){
  const re=new RegExp('\\b'+key+'\\s*:\\s*\\[([^\\]]*)\\]','g');
  return txt.replace(re,(m,inner)=>{ const n=inner.split(',').map(s=>s.trim()); if(n.length!==6) return m; return key+':['+warpCam(n,false).join(',')+']'; });
}

const report=[];
function rewrite(file,fn){
  const p=path.join(ROOT,file), before=fs.readFileSync(p,'utf8'), after=fn(before);
  fs.writeFileSync(p,after,'utf8');
  const nb=(before.match(PAIR)||[]).length; report.push(file+': rewritten ('+(before===after?'unchanged':'changed')+')');
}

/* ---- data.js: track anchors, via waypoints, feature positions, phase cameras ---- */
rewrite('data.js',t=>{
  t=warpKeyed(t,['p']);
  t=warpKeyedLists(t,['via']);
  t=warpCams(t,'cam');
  return t;
});
/* ---- analysis.js: plan objectives, routes, staging, event markers, tour cameras (NOT event times t:[a,b]) ---- */
rewrite('analysis.js',t=>{
  t=warpKeyed(t,['p','obj','c']);
  t=warpKeyedLists(t,['route']);
  t=warpCams(t,'cam');
  return t;
});
/* ---- world.js: every pair between the hydrography and the noise section; relief and pond centres; the castle ---- */
rewrite('world.js',t=>{
  const a=t.indexOf('var GOLDBACH_M'), b=t.indexOf('/* ---------------- noise and relief');
  let region=t.slice(a,b);
  const vi=region.indexOf('var VILLAGES'), ve=region.indexOf('var CHURCHES');
  region=warpPairs(region.slice(0,vi))+region.slice(vi,ve)+warpPairs(region.slice(ve));   /* villages are regenerated from GEO */
  t=t.slice(0,a)+region+t.slice(b);
  t=t.replace(/\bW\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/g,(m,x,y)=>{ const q=warp(+x,+y); return 'W('+R(q[0])+','+R(q[1])+')'; });
  return t;
});
/* ---- app.js: overlays, vantage cameras, the staff camera ---- */
rewrite('app.js',t=>{
  const a=t.indexOf('var OVERLAYS'), b=t.indexOf('\n};',a)+3;
  t=t.slice(0,a)+t.slice(a,b).replace(/\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*(,\s*"[^"]*"\s*)?\]/g,(m,x,y,lab)=>{ const q=warp(+x,+y); return '['+R(q[0])+','+R(q[1])+(lab||'')+']'; })+t.slice(b);
  const va=t.indexOf('var VANTAGE'), vb=t.indexOf('};',va)+2;
  t=t.slice(0,va)+t.slice(va,vb).replace(/(\w+)\s*:\s*\[([^\]]*)\]/g,(m,k,inner)=>{ const n=inner.split(',').map(s=>s.trim()); if(n.length!==6) return m; return k+':['+warpCam(n,k==='zuran').join(',')+']'; })+t.slice(vb);
  t=t.replace('flyTo(staff ? [2,262,52,2,0,20] :', ()=>'flyTo(staff ? ['+warpCam(['2','262','52','2','0','20'],false).join(',')+'] :');
  return t;
});
console.log(report.join('\n'));
