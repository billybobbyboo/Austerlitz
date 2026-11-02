// v-premise-a: the relief model's elevation (GEOREF.elevM of world.js height) at given lat/lon points, from a fresh isolated copy.
// Usage: node relief-points.js <isoRoot> lat,lon[,label] ...   Prints map coords, model metres (true scale, the same as the sources sheet's).
const path=require('path'); const R=process.argv[2];
const G=require(path.join(R,'geo.js')), M=require(path.join(R,'_world_mod.js'));
for(const a of process.argv.slice(3)){ const [la,lo,lab]=a.split(','); const m=G.toMap(+la,+lo), w=M.W(m[0],m[1]);
  const h=M.height(w[0],w[1]); console.log(`${lab||''} lat ${la} lon ${lo} map [${m[0].toFixed(1)},${m[1].toFixed(1)}] model ${G.elevM(h).toFixed(1)} m (height() ${h.toFixed(2)})`); }
