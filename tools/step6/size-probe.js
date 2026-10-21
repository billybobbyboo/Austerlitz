#!/usr/bin/env node
/* Roadmap step 6 Part A (docs/STEP6_SPEC.md section 3.1, the review's item 8): what "a man's size on screen" measures. census.js and
   lod-probe.js take a man's height as the projection of a vertical 1.8-unit segment at the block's first man: under a camera looking steeply
   down (the Overview) a vertical segment is foreshortened, so that measure follows the camera's pitch as much as its distance. Here, per
   formation block drawn as figures, in the five views of lod-probe.js: the block's distance from the eye, that vertical measure, and a measure
   that does not depend on the pitch: the diameter on screen of a man's bounding sphere (the coat geometry's sphere through the first man's
   instance and the block's world matrix), in CSS px at 1600 x 900; with each block's figure triangles (world pass, every mesh of its body).
   node tools/step6/size-probe.js [--json out.json]
   Opened as the harness opens a page (tools/stage7/lib.js). Measurement only; nothing is written to a source file. */
const fs=require("fs"), path=require("path");
const L=require("../stage7/lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json");
const CASES=require(path.join(L.ROOT,"tools","visual","cases.js"));
const VIEWS=["overview-plan","ph8-overview-watch","overview-field","pratzen-low","close-sokolnitz"].map(n=>CASES.find(c=>c.name===n));
const SIZE=function(){
  window.__size=function(){
    var V=THREE.Vector3, m4=new THREE.Matrix4(), mw=new THREE.Matrix4(), p0=new V(), p1=new V(), s=new THREE.Sphere(), cam=camera, H=window.innerHeight;
    var tanH=Math.tan(THREE.MathUtils.degToRad(cam.fov)/2), out=[];
    function up(o){ while(o){ if(!o.visible) return false; o=o.parent; } return true; }
    Object.keys(units).forEach(function(id){ var b=units[id].block, ud=b&&b.userData; if(!ud||!up(b)||!ud.figs||!ud.figs.length) return;
      var m=ud.figs[0].mesh; if(!m.count) return; b.updateMatrixWorld(true);
      m.getMatrixAt(0,m4); mw.multiplyMatrices(m.matrixWorld,m4);
      p0.set(0,0,0).applyMatrix4(mw); p1.set(0,1.8,0).applyMatrix4(mw);
      var a=p0.clone().project(cam), c=p1.clone().project(cam), behind=a.z>1;
      var vert=behind?null:Math.abs(a.y-c.y)*H/2;
      if(!m.geometry.boundingSphere) m.geometry.computeBoundingSphere();
      s.copy(m.geometry.boundingSphere).applyMatrix4(mw);
      var d=s.center.distanceTo(cam.position), sph=behind?null:(2*s.radius)/(d*tanH)*(H/2);
      var tris=0; ud.body.traverse(function(o){ if(o.isInstancedMesh&&o.count&&up(o)){ var g=o.geometry; tris+=Math.floor((g.index?g.index.count:g.attributes.position.count)/3)*o.count; } });
      out.push({id:id, d:+d.toFixed(1), vertPx:vert==null?null:+vert.toFixed(2), spherePx:sph==null?null:+sph.toFixed(2), tris:tris}); });
    var pitch=Math.asin(Math.max(-1,Math.min(1,cam.getWorldDirection(new V()).y)))*180/Math.PI;
    return {pitchDeg:+pitch.toFixed(1), fov:cam.fov, blocks:out};
  };
};
(async()=>{
  const browser=await L.launch(), page=await L.open(browser,[1600,900]);
  await L.inject(page,SIZE);
  const res={note:"per block: distance (world units), a vertical man's height on screen and a man's bounding sphere's diameter on screen (CSS px, 1600 x 900); software WebGL, no time measured",views:{}};
  for(const c of VIEWS){
    await L.applyCase(page,c);
    const r=await page.evaluate(()=>window.__size());
    res.views[c.name]=r;
    const band=(k,v)=>v==null?"behind":v<2?"<2":v<4?"2-4":v<8?"4-8":v<16?"8-16":">=16";
    const H=(k)=>{ const h={}; r.blocks.forEach(b=>{ const x=band(k,b[k]); h[x]=(h[x]||0)+b.tris; }); return JSON.stringify(h); };
    console.log(c.name.padEnd(20),"pitch",r.pitchDeg,"deg; blocks",r.blocks.length,"| tris by vertical px",H("vertPx"),"| by sphere px",H("spherePx"));
  }
  await browser.close();
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
