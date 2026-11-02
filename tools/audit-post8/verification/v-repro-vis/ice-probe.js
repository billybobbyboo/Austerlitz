#!/usr/bin/env node
/* Final audit after Stage 8, verification lens "v-repro-vis": an independent reproduction of finding visual-landscape #0 (figures on the
   frozen meres drawn sunk into the ice). Measurement only: nothing of the application is changed (the ice is hidden only in this page, for
   one capture, to show what it covers, and shown again).

   Unlike the area's probe (block centres, posNow, against groundY on a grid), this reads every drawn figure instance: for each formation's
   block, every visible InstancedMesh under it (the kit's men, riders, horses, guns, standards, as drawn at that level of detail), each
   instance's lowest and highest point in the world (mesh.matrixWorld x instance matrix x the geometry's bounding box's bottom and top at the
   instance's origin), against each mere's ice (world.js buildWater's discs: waterMeshes with userData.mere, CircleGeometry scaled rx x rz, at
   mesh.position.y): an instance inside a disc (normalised radius < 1) whose bottom lies below the ice's plane is drawn sunk, by that depth,
   and the share of its height under the plane is what the ice (transparent 0.96, depth-tested) covers. Its seat is compared with groundY.

   usage: node ice-probe.js [--html <build>] [--label <name>] [--shots] [--clocks 960,980,1000,1020] [--factors 4,1,10.33] */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const A=require("../../lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; }, has=f=>argv.includes(f);
const SCR=path.join(A.SCRATCH,"v-repro-vis"), EV=path.join(A.EVID,"verification","v-repro-vis");
fs.mkdirSync(SCR,{recursive:true}); fs.mkdirSync(EV,{recursive:true});
if(opt("--html")) process.env.AUSTERLITZ_HTML=path.resolve(opt("--html"));
const LABEL=opt("--label")||"current";
const CLOCKS=(opt("--clocks")||"960,980,1000,1020").split(",").map(Number), FACTORS=(opt("--factors")||"4").split(",").map(Number);
const MEASURE=function(){
  var out={discs:[], forms:{}, t:clock, factor:typeof DISPLAY!=="undefined"?DISPLAY.f||DISPLAY.factor||null:null};
  var discs=waterMeshes.filter(function(w){ return w.userData&&w.userData.mere; }).map(function(w){ var q=w.userData.mere;
    return {name:(typeof SATS!=="undefined"&&q[0]===SATS)?"Satschan":"Menitz", cx:q[0][0], cz:q[0][1], rx:q[1], rz:q[2], y:w.position.y, transparent:w.material.transparent, opacity:w.material.opacity, depthTest:w.material.depthTest, depthWrite:w.material.depthWrite}; });
  out.discs=discs.map(function(d){ return Object.assign({},d,{y:+d.y.toFixed(3)}); });
  function shown(o){ while(o){ if(!o.visible) return false; o=o.parent; } return true; }
  var m=new THREE.Matrix4(), mw=new THREE.Matrix4(), lo=new THREE.Vector3(), hi=new THREE.Vector3();
  Object.keys(units).forEach(function(id){ var u=units[id], g=u&&u.block; if(!g||!shown(g)) return;
    g.updateMatrixWorld(true);
    var rec=null;
    g.traverse(function(o){ if(!o.isInstancedMesh||!shown(o)||!o.count) return;
      var geo=o.geometry; if(!geo.boundingBox) geo.computeBoundingBox(); var bb=geo.boundingBox;
      var kind=(o.userData&&(o.userData.gaitKind||o.userData.kind))||o.name||"mesh";
      for(var i=0;i<o.count;i++){ o.getMatrixAt(i,m); mw.multiplyMatrices(o.matrixWorld,m);
        lo.set(0,bb.min.y,0).applyMatrix4(mw); hi.set(0,bb.max.y,0).applyMatrix4(mw);
        for(var k=0;k<discs.length;k++){ var d=discs[k], r=Math.hypot((lo.x-d.cx)/d.rx,(lo.z-d.cz)/d.rz); if(r>=1) continue;
          if(!rec) rec=out.forms[id]={name:FORMATIONS[id].name, inside:0, sunk:0, sunkHalf:0, maxDepth:-1e9, sumFrac:0, maxFrac:0, seatMax:0, kinds:{}, mere:{}};
          var dep=d.y-lo.y, H=Math.max(1e-6,hi.y-lo.y), fr=Math.max(0,Math.min(1,dep/H)), gy=groundY(lo.x,lo.z);
          rec.inside++; rec.mere[d.name]=(rec.mere[d.name]||0)+1; if(dep>0.02) rec.sunk++; if(fr>=0.5) rec.sunkHalf++;
          rec.maxDepth=Math.max(rec.maxDepth,dep); rec.sumFrac+=fr; rec.maxFrac=Math.max(rec.maxFrac,fr);
          var kk=rec.kinds[kind]||(rec.kinds[kind]={n:0,sunk:0,maxDepth:-1e9,maxFrac:0,height:+H.toFixed(3)}); kk.n++; if(dep>0.02) kk.sunk++; kk.maxDepth=Math.max(kk.maxDepth,dep); kk.maxFrac=Math.max(kk.maxFrac,fr);
          /* the seat: the instance's bottom against the drawn ground under it (a rider's bottom is his horse's back: not a seat) */
          rec.seatMax=Math.max(rec.seatMax,Math.abs(lo.y-gy));
        } } });
    if(rec){ rec.meanFrac=+(rec.sumFrac/rec.inside).toFixed(3); delete rec.sumFrac; rec.maxDepth=+rec.maxDepth.toFixed(3); rec.maxFrac=+rec.maxFrac.toFixed(3); rec.seatMax=+rec.seatMax.toFixed(3);
      Object.keys(rec.kinds).forEach(function(k){ var q=rec.kinds[k]; q.maxDepth=+q.maxDepth.toFixed(3); q.maxFrac=+q.maxFrac.toFixed(3); });
      rec.status=typeof liveStatus==="function"?liveStatus(id,curPhase):null; var p=posNow(id); rec.pos=p?[+p[0].toFixed(1),+p[1].toFixed(1)]:null; }
  });
  /* the bed under each disc against its ice (a grid, as the area's probe; for the record) */
  out.bed=discs.map(function(d){ var n=0, below=0, mx=-1e9; for(var i=-1;i<=1;i+=0.05) for(var j=-1;j<=1;j+=0.05){ if(i*i+j*j>=1) continue; var dep=d.y-groundY(d.cx+i*d.rx,d.cz+j*d.rz); n++; if(dep>0) below++; mx=Math.max(mx,dep); }
    return {mere:d.name, samples:n, belowShare:+(below/n).toFixed(3), maxDepth:+mx.toFixed(3)}; });
  return out;
};
(async()=>{
  const html=path.resolve(process.env.AUSTERLITZ_HTML||path.join(A.ROOT,"austerlitz-command-map.html"));
  const md5=crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex");
  const b=await A.launch(), t0=Date.now(); const page=await A.open(b,[1600,900]); page.setDefaultTimeout(0);
  console.log("booted",((Date.now()-t0)/1000).toFixed(0),"s",path.basename(html),md5);
  await page.evaluate(()=>{ if(window.AUSTERLITZ_DEBUG&&AUSTERLITZ_DEBUG.settle) AUSTERLITZ_DEBUG.settle(30); if(typeof closeFirst==="function") closeFirst(null); });
  const res={label:LABEL, build:path.basename(html), md5, chromium:b.version(), runs:[]};
  const spec=(t,r,dir)=>({vp:[1600,900], presentation:"watch", mode:"terrain", t, aim:{map:"dok", dir:dir||[0.55,0.45,0.70], r:r||16}});
  const settle=async()=>{ await page.evaluate(()=>{ if(window.AUSTERLITZ_DEBUG&&AUSTERLITZ_DEBUG.settle) AUSTERLITZ_DEBUG.settle(3,true); }); await A.frames(page,3); };
  for(const f of FACTORS){
    await page.evaluate(f=>{ if(typeof setDisplayFactor==="function") setDisplayFactor(f); },f);
    for(const t of CLOCKS){
      await page.evaluate(s=>window.__aus.apply(s),spec(t)); await settle();
      const r=await page.evaluate(MEASURE); r.factorAsked=f; r.clockAsked=t; res.runs.push(r);
      const fm=Object.keys(r.forms).map(id=>{ const q=r.forms[id]; return id+": "+q.inside+" inside, "+q.sunk+" sunk (>=half "+q.sunkHalf+"), max "+q.maxDepth+" u, mean share under "+q.meanFrac+", max "+q.maxFrac+", seat "+q.seatMax; }).join(" | ");
      console.log("factor",f,"t",t,"discs",JSON.stringify(r.discs.map(d=>d.name+" y "+d.y))," bed",JSON.stringify(r.bed),"\n   ",fm||"(none inside)");
    }
  }
  if(has("--shots")){
    await page.evaluate(()=>{ if(typeof setDisplayFactor==="function") setDisplayFactor(4); });
    const shot=async(name,s,hideIce)=>{ await page.evaluate(s=>window.__aus.apply(s),s); await settle();
      if(hideIce) await page.evaluate(()=>{ waterMeshes.concat(iceRims).forEach(function(w){ if(w.userData&&w.userData.mere) w.visible=false; }); requestRender(3); });
      await A.frames(page,4); const f=path.join(EV,LABEL+"-"+name+".jpg"); await page.screenshot({path:f,type:"jpeg",quality:62});
      if(hideIce) await page.evaluate(()=>{ waterMeshes.concat(iceRims).forEach(function(w){ if(w.userData&&w.userData.mere) w.visible=true; }); requestRender(3); });
      console.log("shot",f); };
    await shot("dok-1640-r16",spec(1000,16),false);
    await shot("dok-1640-r16-noice",spec(1000,16),true);
    await shot("dok-1640-r40",spec(1000,40,[0.55,0.6,0.58]),false);
    await shot("dok-1640-r40-noice",spec(1000,40,[0.55,0.6,0.58]),true);
  }
  res.errors=A.errors(page).slice(0,20);
  fs.writeFileSync(path.join(SCR,"ice-"+LABEL+".json"),JSON.stringify(res,null,1));
  await b.close(); console.log("done",((Date.now()-t0)/1000).toFixed(0),"s; errors",res.errors.length);
})().catch(e=>{ console.error(e); process.exit(1); });
