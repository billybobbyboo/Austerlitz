/* dump the map geometry of a source tree as JSON (used for the before/after plot) */
const fs=require('fs'), path=require('path'); const dir=process.argv[2];
global.window={}; global.GEO=fs.existsSync(path.join(dir,'geo.js'))?require(path.resolve(dir,'geo.js')):null;
const src=f=>fs.readFileSync(path.join(dir,f),'utf8');
eval(src('data.js')); eval(src('analysis.js'));
const w=src('world.js'); const head=w.slice(0,w.indexOf('/* ---------------- noise and relief'));
eval(head.replace('var UNITS_PER_KM = GEO.UNITS_PER_KM;','var UNITS_PER_KM=1;'));
const pr=w.match(/var PRAT=[\s\S]*?;\n/)[0]; eval(pr);
const tracks={}; Object.keys(FORMATIONS).forEach(id=>{ const f=FORMATIONS[id]; if(f.track){ tracks[id]={nation:f.nation,arm:f.arm,pts:{}}; Object.keys(f.track).forEach(ph=>{ if(f.track[ph].p) tracks[id].pts[ph]=f.track[ph].p; }); }});
const a=src('app.js'); const i0=a.indexOf('var OVERLAYS'), i1=a.indexOf('\n};',i0)+3; eval(a.slice(i0,i1));
console.log(JSON.stringify({VILLAGES,ROADS,GOLDBACH_M,LITAVA_M,BROOKS_M,TERRAIN_LINES,WOODS,SATS_M:[SATS[0]*2+340,SATS[1]*2+250],MENI_M:[MENI[0]*2+340,MENI[1]*2+250],
  tracks,FEATURES:FEATURES.map(f=>({id:f.id,p:f.p})),OVERLAYS}));
