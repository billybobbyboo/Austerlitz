#!/usr/bin/env node
/* Stage 4 Part A (docs/STAGE4_SPEC.md section A.4): what the solid near-black regions are, where the shadow toe is removed. For
   the given harness views and factors, with the light variants of light-probe.js (B: today without the toe; E: the computed sun
   corrected to the factor, without the toe; H: E with the fill light turned opposite the sun at 0.28; J: E with the sky fill
   raised by 0.12), the probe renders the frame, finds the 8x8 blocks outside the panels that are at
   least 90% near-black (the harness's Stage 0 measure), and casts a ray through each block's centre to name what is drawn
   there: the ground, a formation's figures (by id), trees, houses, roofs or other. It changes no source file.
   node tools/stage4/dark-probe.js [--json out.json] [--png dir] [--cases pratzen-low@4,pratzen-low@10.33] */
const fs=require("fs"), path=require("path");
const {launch,open,settle,CASES,ROOT}=require("../stage2/page.js");
const {makeSun}=require("./ephem.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const OUT=opt("--json")||path.join(ROOT,"docs","stage4-evidence","dark-probe.json");
const WANT=(opt("--cases")||"pratzen-low@4,pratzen-low@10.33,close-sokolnitz@4,overview-field@4").split(",");

const PROBE=function(makeSunSrc){
  var D2R=Math.PI/180, sunAt=(new Function("return "+makeSunSrc))()(49.14,16.76), N=GEOREF.NORTH, E=[-N[1],N[0]], save=sunDir.clone();
  function place(){ sun.target.position.copy(orbitTarget); sun.target.updateMatrixWorld(); sun.position.copy(orbitTarget).add(sunDir); sun.updateMatrixWorld(); }
  var Z={};
  var fill=scene.children.filter(function(o){ return o.isDirectionalLight&&o!==sun; })[0], fill0=fill?{p:fill.position.clone(),i:fill.intensity}:null, hemi0=hemi.intensity;
  Z.variant=function(k){ sunDir.copy(save); if(fill){ fill.position.copy(fill0.p); fill.intensity=fill0.i; } hemi.intensity=hemi0; var m=FX.matComp, a="srgb+=1.2*srgb*tt*tt/0.04;", b="srgb+=0.0*srgb*tt*tt/0.04;";
    var toe=(k==="A"); var want=toe?a:b, other=toe?b:a; if(m.fragmentShader.indexOf(other)>=0){ m.fragmentShader=m.fragmentShader.replace(other,want); m.needsUpdate=true; }
    if(k==="E"||k==="H"||k==="J"){ var s=sunAt(clock,"apparent"), alt=Math.atan(DISPLAY.factor*Math.tan(s.alt*D2R)), az=s.az*D2R, R=save.length();
      var hx=Math.sin(az)*E[0]+Math.cos(az)*N[0], hz=Math.sin(az)*E[1]+Math.cos(az)*N[1]; sunDir.set(hx*Math.cos(alt)*R,Math.sin(alt)*R,hz*Math.cos(alt)*R);
      /* H: the fixed fill turned to stand opposite the sun's azimuth, at 0.28 (was 0.16 from a fixed direction); J: the sky fill raised by 0.12 */
      if(k==="H"&&fill){ fill.position.set(-hx*120,60,-hz*120); fill.intensity=0.28; fill.updateMatrixWorld(); }
      if(k==="J") hemi.intensity=hemi0+0.12; }
    place(); renderFrame(); return true; };
  Z.restore=function(){ Z.variant("A"); save=sunDir.clone(); };
  Z.reset=function(){ save=sunDir.clone(); hemi0=hemi.intensity; if(fill) fill0={p:fill.position.clone(),i:fill.intensity}; };
  /* name what a ray through screen point (x,y) meets first */
  var owner=null;
  function owners(){ owner=new Map(); Object.keys(units).forEach(function(id){ var r=units[id]; ["block","figs","inst","mesh"].forEach(function(k){ if(r[k]&&r[k].traverse) r[k].traverse(function(o){ owner.set(o,"figures:"+id); }); }); });
    var w=world; [["ground",w.ground],["apron",w.apron],["trees",w.trees],["conifers",w.conifers],["scrub",w.scrub],["houses",w.houses],["roofs",w.roofs],["spires",w.spires],["chimneys",w.chimneys]].forEach(function(q){ if(q[1]&&q[1].traverse) q[1].traverse(function(o){ owner.set(o,q[0]); }); });
    (w.water||[]).forEach(function(o){ owner.set(o,"water"); }); (w.roads||[]).forEach(function(o){ owner.set(o,"road"); }); }
  Z.what=function(pts){ if(!owner) owners(); var rc=new THREE.Raycaster(), W0=renderer.domElement.clientWidth||innerWidth, H0=innerHeight, out={};
    camera.layers.set(LAYER_WORLD); rc.layers.set(LAYER_WORLD);
    pts.forEach(function(p){ rc.setFromCamera(new THREE.Vector2(p[0]/W0*2-1,-(p[1]/H0)*2+1),camera);
      var hits=rc.intersectObjects(scene.children,true).filter(function(h){ return h.object.visible&&!(h.object.material&&h.object.material.transparent&&h.object.material.opacity<0.5); });
      var k="nothing"; if(hits.length){ var o=hits[0].object; while(o&&!owner.has(o)) o=o.parent; k=o?owner.get(o):(hits[0].object.type+(hits[0].object.name?":"+hits[0].object.name:"")); }
      var g=k.split(":")[0]; out[g]=(out[g]||0)+1; if(k.indexOf("figures:")===0){ out.ids=out.ids||{}; out.ids[k.slice(8)]=(out.ids[k.slice(8)]||0)+1; } });
    camera.layers.enableAll(); return out; };
  Z.blocks=function(b64){ return new Promise(function(res){ var im=new Image(); im.onload=function(){ var cv=document.createElement("canvas"); cv.width=im.width; cv.height=im.height;
    var x=cv.getContext("2d",{willReadFrequently:true}); x.drawImage(im,0,0); var d=x.getImageData(0,0,cv.width,cv.height).data, B=8, pts=[];
    for(var by=0;by+B<=cv.height;by+=B) for(var bx=0;bx+B<=cv.width;bx+=B){ var c=0; for(var yy=by;yy<by+B;yy++) for(var xx=bx;xx<bx+B;xx++){ var o=(yy*cv.width+xx)*4; if(Math.max(d[o],d[o+1],d[o+2])<16) c++; }
      if(c>=0.9*B*B) pts.push([bx+B/2,by+B/2]); }
    res(pts); }; im.src="data:image/png;base64,"+b64; }); };
  window.__dk=Z; return true;
};
(async()=>{
  const browser=await launch(), out={when:new Date().toISOString(),cases:{}};
  const page=await open(browser,[1600,900]);
  await page.evaluate(PROBE.toString().replace(/^function\s*\(makeSunSrc\)\s*\{/,"(function(makeSunSrc){")+")("+JSON.stringify(makeSun.toString())+")");
  for(const w of WANT){
    const [name,f]=w.split("@"), c=CASES.find(x=>x.name===name);
    await page.evaluate(s=>window.__aus.apply(s),Object.assign({},c,{factor:f==="10.33"?"model":+f})); await settle(page);
    await page.evaluate(()=>__dk.reset());
    out.cases[w]={};
    for(const v of ["A","B","E","H","J"]){
      await page.evaluate(v=>__dk.variant(v),v);
      const buf=await page.screenshot({timeout:180000});
      const pts=await page.evaluate(b=>__dk.blocks(b),buf.toString("base64"));
      const what=pts.length?await page.evaluate(p=>__dk.what(p),pts):{};
      out.cases[w][v]={solidBlocks:pts.length,what};
      if(opt("--png")&&pts.length) fs.writeFileSync(path.join(opt("--png"),"dark-"+name+"-"+f+"-"+v+".png"),buf);
      console.log(w,v,pts.length,JSON.stringify(what));
    }
    await page.evaluate(()=>__dk.restore());
    fs.writeFileSync(OUT,JSON.stringify(out,null,1));
  }
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(2); });
