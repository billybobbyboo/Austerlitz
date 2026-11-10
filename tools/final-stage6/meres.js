#!/usr/bin/env node
/* The final audits' Stage 6, WP-10 (CL-VIS-01, CL-VIS-02): what stands on the meres' drawn ice, measured on a built page (the harness's page,
   ?harness=1; nothing rendered, the animation loop held; measurement only, nothing written to a source file).
   1. the trees and the scrub inside a mere's drawn disc (world.js buildWater's discs, CircleGeometry(1,48) scaled rx x rz), by kind, from the
      instanced meshes' own matrices (treeMesh, coniferMesh, scrubMesh), as tools/audit-post8/visual-landscape/probe.js read them;
   2. every 10 minutes 05:00-17:00, at the factors 1x, 4x and 10.33x: every man and horse of the figure kit (kitGeos) and every gun, limber, wheel
      and tent of a block whose instance stands inside a disc: how far its seat lies below the ice's level there (the ice drawn at the disc's
      mesh's own height). A figure is "under the ice" when its seat is more than 0.01 units below that level.
   node tools/final-stage6/meres.js [build.html] [--json out.json] */
"use strict";
const fs=require("fs"), path=require("path");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..",".."), L=require(path.join(ROOT,"tools","stage8","lib.js"));
const html=argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json"); if(html) process.env.AUSTERLITZ_HTML=path.resolve(html);
(async()=>{
  const b=await L.launch(), page=await L.open(b,[1600,900]), log=[];
  page.on("console",m=>{ if(m.type()==="warning"||m.type()==="error") log.push(m.text().slice(0,300)); });
  await page.evaluate(()=>{ window.loop=function(){}; });
  const res=await page.evaluate(()=>{
    var out={}, m=new THREE.Matrix4(), v=new THREE.Vector3();
    function discs(){ return waterMeshes.filter(function(w){ return w.userData&&w.userData.mere; }).map(function(w){ var q=w.userData.mere; return {name:q[0]===SATS?"Satschan":"Menitz", cx:q[0][0], cz:q[0][1], rx:q[1], rz:q[2], y:w.position.y}; }); }
    function nr(d,x,z){ return Math.sqrt(Math.pow((x-d.cx)/d.rx,2)+Math.pow((z-d.cz)/d.rz,2)); }
    /* 1. the trees and the scrub */
    var D=discs(), meshes=[];
    [["broad",treeMesh],["conifer",coniferMesh]].forEach(function(p){ p[1].children.forEach(function(im){ meshes.push([p[0],im]); }); });
    meshes.push(["scrub",scrubMesh]);
    var onIce=[], tot={};
    meshes.forEach(function(p){ var im=p[1], kinds=im.userData.kinds||[];
      for(var k=0;k<im.count;k++){ im.getMatrixAt(k,m); v.setFromMatrixPosition(m); var kind=kinds[k]||"?"; tot[p[0]+":"+kind]=(tot[p[0]+":"+kind]||0)+1;
        D.forEach(function(d){ var r=nr(d,v.x,v.z); if(r<1) onIce.push({mesh:p[0], kind:kind, mere:d.name, x:+v.x.toFixed(2), z:+v.z.toFixed(2), r:+r.toFixed(3)}); }); } });
    out.trees={totals:tot, onIce:onIce, onIceCount:onIce.length};
    /* every tree and bush as drawn: its matrix and its colour, so that two builds can be compared instance by instance (--compare) */
    var all=[], c=new THREE.Color();
    meshes.forEach(function(p){ var im=p[1], kinds=im.userData.kinds||[];
      for(var k=0;k<im.count;k++){ im.getMatrixAt(k,m); if(im.instanceColor) im.getColorAt(k,c);
        all.push(p[0]+"|"+(kinds[k]||"?")+"|"+Array.from(m.elements).map(function(e){ return e.toFixed(5); }).join(",")+"|"+[c.r,c.g,c.b].map(function(e){ return e.toFixed(5); }).join(",")); } });
    out.treeList=all;
    /* 2. the figures */
    var geos=kitGeos(), byF={}, fac={};
    [1,4,10.33].forEach(function(F){
      setDisplayFactor(F); var Df=discs(), n=0, under=0, worst=0, worstAt="";
      for(var t=300;t<=1020;t+=10){
        setClock(t,{instant:true,force:true,camera:false}); updateVisibility();
        Object.keys(units).forEach(function(id){ var bl=units[id].block; if(!bl||!bl.visible) return; bl.updateMatrixWorld(true);
          var c=bl.position, near=Df.some(function(d){ return nr(d,c.x,c.z)<1.6; }); if(!near) return;
          bl.traverse(function(o){ if(!o.isInstancedMesh) return; var vis=true, q=o; while(q){ if(!q.visible){ vis=false; break; } q=q.parent; } if(!vis) return;
            var fig=geos.indexOf(o.geometry)>=0;
            for(var i=0;i<o.count;i++){ o.getMatrixAt(i,m); v.set(0,0,0).applyMatrix4(m).applyMatrix4(o.matrixWorld);
              Df.forEach(function(d){ if(nr(d,v.x,v.z)>=1) return; n++; var dep=d.y-v.y;
                if(dep>0.01){ under++; var k=id+"@"+d.name; var r=byF[k]||(byF[k]={id:id, mere:d.name, first:fmtClock(t), last:fmtClock(t), n:0, worst:0, kinds:{}}); r.last=fmtClock(t); r.n++; r.worst=Math.max(r.worst,+dep.toFixed(3));
                  var kk=fig?"figure":"gear"; r.kinds[kk]=(r.kinds[kk]||0)+1; }
                if(dep>worst){ worst=dep; worstAt=id+" "+fmtClock(t)+" "+d.name; } }); } }); });
      }
      fac["x"+F]={instancesInside:n, underIce:under, worst:+worst.toFixed(3), worstAt:worstAt};
    });
    setDisplayFactor(4);
    out.factors=fac; out.formations=Object.keys(byF).map(function(k){ return byF[k]; });
    return out;
  });
  res.console=log; res.build=path.basename(process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html");
  if(opt("--compare")){ const A0=JSON.parse(fs.readFileSync(opt("--compare"),"utf8")).treeList, B0=res.treeList, cnt=l=>l.reduce((o,k)=>(o[k]=(o[k]||0)+1,o),{});
    const a=cnt(A0), bb=cnt(B0), gone=[], added=[];
    Object.keys(a).forEach(k=>{ const d=a[k]-(bb[k]||0); for(let i=0;i<d;i++) gone.push(k); });
    Object.keys(bb).forEach(k=>{ const d=bb[k]-(a[k]||0); for(let i=0;i<d;i++) added.push(k); });
    res.compare={against:path.basename(opt("--compare")), before:A0.length, after:B0.length, removed:gone.length, added:added.length,
      removedKinds:gone.map(k=>k.split("|").slice(0,2).join("/")), addedSample:added.slice(0,5)};
    console.log("compared with",opt("--compare")+":",JSON.stringify(Object.assign({},res.compare,{removedKinds:undefined})),"removed by kind",JSON.stringify(cnt(res.compare.removedKinds))); }
  if(opt("--json")) fs.writeFileSync(opt("--json"),JSON.stringify(res,null,1));
  console.log("trees and scrub inside a disc:",res.trees.onIceCount,JSON.stringify(res.trees.onIce.map(t=>t.mesh+"/"+t.kind+"/"+t.mere)));
  Object.keys(res.factors).forEach(k=>console.log(k,JSON.stringify(res.factors[k])));
  console.log("formations:",res.formations.map(r=>r.id+"@"+r.mere+" "+r.first+"-"+r.last+" n"+r.n+" worst "+r.worst).join("; "));
  console.log("console:",log.length);
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
