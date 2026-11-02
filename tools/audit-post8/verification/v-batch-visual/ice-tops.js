#!/usr/bin/env node
/* Final audit after Stage 8, verification v-batch-visual (visual-landscape #1): for every tree and bush whose instance stands inside a mere's
   drawn ice disc, the instance's base, its geometry's top (the instanced geometry's bounding box times the instance's scale) and the ice's level,
   so that a bush drawn wholly under the 0.96-opaque ice is told from one that stands out of it. Read from the built page's own instanced meshes
   (treeMesh, scrubMesh) on the harness page; nothing changed; nothing rendered for the numbers.
   usage: node ice-tops.js <out.json> */
"use strict";
const fs=require("fs"), A=require("../../lib.js");
(async()=>{
  const b=await A.launch(); const page=await A.open(b,[800,600]);
  const res=await page.evaluate(()=>{
    var m=new THREE.Matrix4(), p=new THREE.Vector3(), q=new THREE.Quaternion(), s=new THREE.Vector3();
    var discs=waterMeshes.filter(function(w){ return w.userData&&w.userData.mere; }).map(function(w){ var d=w.userData.mere; return {name:d[0]===SATS?"Satschan":"Menitz", cx:d[0][0], cz:d[0][1], rx:d[1], rz:d[2], y:w.position.y, mat:{opacity:w.material.opacity, transparent:w.material.transparent, depthWrite:w.material.depthWrite}}; });
    var meshes=[]; treeMesh.children.forEach(function(im){ meshes.push(["broad",im]); }); meshes.push(["scrub",scrubMesh]);
    var rows=[];
    meshes.forEach(function(e){ var im=e[1]; im.geometry.computeBoundingBox(); var top=im.geometry.boundingBox.max.y, kinds=im.userData.kinds||[];
      for(var k=0;k<im.count;k++){ im.getMatrixAt(k,m); m.decompose(p,q,s);
        discs.forEach(function(d){ var r=Math.sqrt(Math.pow((p.x-d.cx)/d.rx,2)+Math.pow((p.z-d.cz)/d.rz,2)); if(r<1){
          var t=p.y+top*s.y; rows.push({mesh:e[0], kind:kinds[k]||"?", mere:d.name, x:+p.x.toFixed(2), z:+p.z.toFixed(2), r:+r.toFixed(3), base:+p.y.toFixed(3), top:+t.toFixed(3), ice:+d.y.toFixed(3), aboveIce:+(t-d.y).toFixed(3), baseBelowIce:+(d.y-p.y).toFixed(3)}); } }); } });
    return {discs:discs, rows:rows};
  });
  const out=res.rows, stand=out.filter(r=>r.aboveIce>0), sub=out.filter(r=>r.aboveIce<=0);
  res.summary={inside:out.length, standingOutOfIce:stand.length, wholeUnderIce:sub.length,
    byKind:out.reduce((o,r)=>{ const k=r.kind+(r.aboveIce>0?":out":":under"); o[k]=(o[k]||0)+1; return o; },{}),
    outRooted:stand.filter(r=>r.baseBelowIce>0).length};
  console.log(JSON.stringify(res.summary)); console.log(JSON.stringify(res.discs));
  fs.writeFileSync(process.argv[2]||"ice-tops.json",JSON.stringify(res,null,1));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
