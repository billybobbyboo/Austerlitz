#!/usr/bin/env node
/* Final audit after Stage 8, area visual-landscape: numbers read from the built page for what the captures showed (measurement only; nothing of
   the application changed; the harness's page, ?harness=1, its animation loop held, nothing rendered):
   1. trees and scrub on the meres' drawn ice (world.js buildWater's discs, CircleGeometry scaled rx x rz) and on their water class (coverClass's
      ponds, pond > 0.5), by kind (wood, village, garden, edge, stream), from the instanced meshes' own matrices (treeMesh, coniferMesh, scrubMesh);
   2. the drawn ground under each mere's ice: the ice's level minus groundY over a grid inside its disc;
   3. the formations standing inside a disc, every 10 minutes 05:00-17:00 (posNow, the block's place): the depth of the ground under the ice there;
   4. the buildings of Satschan and Sokolnitz as planned (BLDG): parts, plan sizes (R.a, R.b: half-sides in world units) and heights;
   5. the drawn figure's height (a man's head top, KIT.art) for scale.
   usage: node probe.js <out.json> */
"use strict";
const fs=require("fs"), A=require("../lib.js");
(async()=>{
  const b=await A.launch(); const t0=Date.now(); const page=await A.open(b,[1600,900]);
  console.log("booted",Date.now()-t0,"ms");
  await page.evaluate(()=>{ if(!window.__held){ window.__held=true; window.loop=function(){ requestAnimationFrame(window.loop); }; } });
  const res=await page.evaluate(()=>{
    var out={}, m=new THREE.Matrix4(), v=new THREE.Vector3();
    var discs=waterMeshes.filter(function(w){ return w.userData&&w.userData.mere; }).map(function(w){ var q=w.userData.mere; return {name:q[0]===SATS?"Satschan":"Menitz", cx:q[0][0], cz:q[0][1], rx:q[1], rz:q[2], y:+w.position.y.toFixed(3)}; });
    out.discs=discs;
    function nr(d,x,z){ return Math.sqrt(Math.pow((x-d.cx)/d.rx,2)+Math.pow((z-d.cz)/d.rz,2)); }
    function sst(a,b,x){ var t=Math.max(0,Math.min(1,(x-a)/(b-a))); return t*t*(3-2*t); }
    function pond(d,x,z){ return 1-sst(0.55,1.08,nr(d,x,z)); }
    /* 1. trees */
    var meshes=[];
    [["broad",treeMesh],["conifer",coniferMesh]].forEach(function(p){ p[1].children.forEach(function(im){ meshes.push([p[0],im]); }); });
    meshes.push(["scrub",scrubMesh]);
    var onIce=[], tot={};
    meshes.forEach(function(p){ var im=p[1], kinds=im.userData.kinds||[];
      for(var k=0;k<im.count;k++){ im.getMatrixAt(k,m); v.setFromMatrixPosition(m); var kind=kinds[k]||"?"; tot[p[0]+":"+kind]=(tot[p[0]+":"+kind]||0)+1;
        discs.forEach(function(d){ var r=nr(d,v.x,v.z); if(r<1) onIce.push({mesh:p[0], kind:kind, mere:d.name, x:+v.x.toFixed(2), z:+v.z.toFixed(2), r:+r.toFixed(3), water:pond(d,v.x,v.z)>0.5, ground:+groundY(v.x,v.z).toFixed(3), base:+v.y.toFixed(3)}); }); } });
    out.trees={totals:tot, onIce:onIce, onIceCount:onIce.length, onWaterClass:onIce.filter(function(t){ return t.water; }).length};
    /* 2. the ground under the ice */
    out.under=discs.map(function(d){ var n=0, s=0, mx=-1e9, mn=1e9, below=0;
      for(var i=-1;i<=1;i+=0.05) for(var j=-1;j<=1;j+=0.05){ if(i*i+j*j>=1) continue; var x=d.cx+i*d.rx, z=d.cz+j*d.rz, g=groundY(x,z), dep=d.y-g; n++; s+=dep; mx=Math.max(mx,dep); mn=Math.min(mn,dep); if(dep>0) below++; }
      return {mere:d.name, samples:n, depthMean:+(s/n).toFixed(3), depthMax:+mx.toFixed(3), depthMin:+mn.toFixed(3), groundBelowIceShare:+(below/n).toFixed(3)}; });
    /* 5. the figure's scale */
    out.kitArt=(typeof KIT!=="undefined"&&KIT.art)?JSON.parse(JSON.stringify(KIT.art)):null;
    /* 3. formations inside a disc through the day */
    var rows=[];
    for(var t=300;t<=1020;t+=10){
      setClock(t,{instant:true,force:true,camera:false});
      Object.keys(units).forEach(function(id){ var f=FORMATIONS[id]; if(!f||!f.track) return; var p=posNow(id); if(!p) return; var w=W(p[0],p[1]);
        discs.forEach(function(d){ var r=nr(d,w[0],w[1]); if(r<1.05){ var g=groundY(w[0],w[1]); rows.push({t:fmtClock(t), id:id, arm:f.arm, nation:f.nation, mere:d.name, r:+r.toFixed(3), iceMinusGround:+(d.y-g).toFixed(3), status:liveStatus(id,phaseAt(t))}); } }); });
    }
    out.formations=rows;
    var by={}; rows.forEach(function(q){ if(q.r>=1) return; var k=q.id+"@"+q.mere; (by[k]=by[k]||{id:q.id,mere:q.mere,first:q.t,last:q.t,n:0,maxDepth:-1e9}); by[k].last=q.t; by[k].n++; by[k].maxDepth=Math.max(by[k].maxDepth,q.iceMinusGround); });
    out.formationsInside=Object.keys(by).map(function(k){ return by[k]; });
    /* 4. the buildings */
    function rec(q){ return {part:q.part, village:q.village, a:q.R?+q.R.a.toFixed(3):null, b:q.R?+q.R.b.toFixed(3):null, h:q.h!==undefined?+(+q.h).toFixed(3):null, x:q.R?+q.R.x.toFixed(2):(q.x!==undefined?+q.x.toFixed(2):null), z:q.R?+q.R.z.toFixed(2):(q.z!==undefined?+q.z.toFixed(2):null), scale:q.scale||null}; }
    out.buildings={Satschan:BLDG.filter(function(q){ return q.village==="Satschan"; }).map(rec), Sokolnitz:BLDG.filter(function(q){ return q.village==="Sokolnitz"; }).map(rec)};
    return out;
  });
  fs.writeFileSync(process.argv[2],JSON.stringify(res,null,1));
  console.log("discs",JSON.stringify(res.discs));
  console.log("trees on ice",res.trees.onIceCount,"on water class",res.trees.onWaterClass, JSON.stringify(res.trees.onIce.map(t=>t.kind+"/"+t.mere+"/r"+t.r+(t.water?"/W":""))));
  console.log("under",JSON.stringify(res.under));
  console.log("inside",JSON.stringify(res.formationsInside));
  console.log("kitArt",JSON.stringify(res.kitArt));
  console.log("Satschan parts",res.buildings.Satschan.length,JSON.stringify(res.buildings.Satschan.map(q=>q.part)));
  console.log("errors",JSON.stringify(A.errors(page)));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
