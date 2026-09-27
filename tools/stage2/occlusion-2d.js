#!/usr/bin/env node
/* Stage 2D: the map layer's occlusion test (app.js mlOccluded: the eye-to-anchor segment marched over the drawn ground)
   against section F.3's method (a three.js Raycaster against the ground mesh), on the same anchors: every anchor the layer
   collects in the view, and a grid of anchors 2.2 units above the drawn ground every 10 units across the field.
   node tools/stage2/occlusion-2d.js [--json out.json]
   Reports, per harness view: anchors, agreement, the occluded count by each method, and the time each took. */
const fs=require("fs"), path=require("path"), P=require("./page.js");
const VIEWS=["pratzen-low","pratzen-orbit-min","pratzen-low-1x","pratzen-low-10x","close-sokolnitz","hybrid-dimmed","overview-field"];
(async()=>{
  const b=await P.launch(), page=await P.open(b,[1600,900]), res={};
  for(const name of VIEWS){
    await P.applyCase(page,P.CASES.find(x=>x.name===name));
    res[name]=await page.evaluate(()=>{
      var rc=new THREE.Raycaster(), dir=new THREE.Vector3(), agree=0, rayOcc=0, marchOcc=0, dis=[];
      var list=Object.keys(ML.items).map(function(k){ return ML.items[k]; }).filter(function(it){ return it.eFrame===ML.frame; }).map(function(it){ return {key:it.key,world:it.world}; });
      var layer=list.length;
      for(var x=-170;x<=170;x+=10) for(var z=-145;z<=145;z+=10) list.push({key:"grid "+x+","+z,world:new THREE.Vector3(x,groundY(x,z)+2.2,z)});
      var t0=performance.now(), mg=mlMaxG(), M=list.map(function(it){ return mlOccluded(it.world,mg); }), tm=performance.now()-t0;
      t0=performance.now();
      var R=list.map(function(it){ dir.copy(it.world).sub(camera.position); var d=dir.length(); dir.normalize(); rc.set(camera.position,dir); rc.far=d-1.2;
        return rc.intersectObject(groundMesh,false).length>0; });
      var tr=performance.now()-t0;
      list.forEach(function(it,i){ if(M[i]===R[i]) agree++; else if(dis.length<6) dis.push(it.key+": march "+M[i]+", ray "+R[i]); if(R[i]) rayOcc++; if(M[i]) marchOcc++; });
      return {factor:DISPLAY.factor,anchors:list.length,layerAnchors:layer,agree:agree,rayOccluded:rayOcc,marchOccluded:marchOcc,
              marchMs:+tm.toFixed(2),rayMs:+tr.toFixed(0),marchMsPerAnchor:+(tm/list.length).toFixed(4),rayMsPerAnchor:+(tr/list.length).toFixed(2),disagree:dis};
    });
    console.log(name.padEnd(18),JSON.stringify(res[name]));
  }
  const j=process.argv.indexOf("--json"); if(j>0) fs.writeFileSync(process.argv[j+1],JSON.stringify(res,null,1));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(2); });
