#!/usr/bin/env node
/* Stage 2 Part A, section G (owner decision 25): a scratch PROBE of the true north-up paper map, for measurement.
   Compared: today's paper map (staff mode, the app's Overview vantage, perspective 37 degrees, tilted about 7
   degrees) and a probe camera looking straight down with GEOREF.NORTH up, near-orthographic (field of view
   4 degrees, the eye far above), framed with camera.setViewOffset so that the battlefield frame (360 x 310 world
   units) is centred in the part of the viewport no fixed panel covers.
   Measured: screen pixels per true kilometre (east-west, from GEOREF) at the Pratzeberg summit and at Sokolnitz,
   and at the top and bottom of the frame (scale uniformity; a scale bar is valid everywhere only if these agree);
   the bearing of GEOREF.NORTH on screen; the share of the battlefield frame inside the unobstructed area.
   node tools/stage2/paper-map.js <outdir> */
const fs=require("fs"), path=require("path"), P=require("./page.js");
const out=path.resolve(process.argv[2]||path.join(__dirname,"out","paper")); fs.mkdirSync(out,{recursive:true});
const PROBE=`window.__paper={
  free:function(){ /* the largest map rectangle clear of the rail, the tools, the legend and the timebar (a simple model) */
    function r(s){ var e=document.querySelector(s); if(!e) return null; var cs=getComputedStyle(e); if(cs.display==="none"||e.hidden) return null;
      if(e.classList.contains("rail")&&document.body.classList.contains("rail-hidden")) return null; var b=e.getBoundingClientRect(); return b.width>0?b:null; }
    var L=0,T=0,R=innerWidth,B=innerHeight, rail=r(".rail"), tb=r(".timebar"), tools=r(".tools");
    if(rail) L=rail.right; if(tb) B=tb.top; if(tools) T=Math.max(T,tools.bottom*0);
    return [L,T,R,B];
  },
  northUp:function(fov,focus,zoom){ var f=this.free(), cx=(f[0]+f[2])/2, cy=(f[1]+f[3])/2;
    camera.fov=fov; camera.far=20000; camera.near=10; scene.fog.near=1e5; scene.fog.far=2e5;
    var ang=GEOREF.ROT_DEG*Math.PI/180, n=new THREE.Vector3(-Math.sin(ang),0,-Math.cos(ang));
    /* the frame's extent across and along north, to fit the free rectangle */
    var C=[[-180,-155],[180,-155],[180,155],[-180,155]], e=new THREE.Vector3(-n.z,0,n.x), ax=0, ay=0;
    C.forEach(function(q){ ax=Math.max(ax,Math.abs(q[0]*e.x+q[1]*e.z)); ay=Math.max(ay,Math.abs(q[0]*n.x+q[1]*n.z)); });
    var fw=f[2]-f[0], fh=f[3]-f[1], half=Math.max(ay, ax*fh/fw)*(zoom||1);
    var d=half/Math.tan(fov*Math.PI/360)*(innerHeight/fh);
    var c=focus?new THREE.Vector3(focus.x,0,focus.z):new THREE.Vector3(0,0,0);
    camera.up.copy(n); camera.position.set(c.x,d,c.z); orbitTarget.copy(c); camera.lookAt(c);
    camera.setViewOffset(innerWidth,innerHeight,-(cx-innerWidth/2),-(cy-innerHeight/2),innerWidth,innerHeight);
    camera.updateProjectionMatrix(); freeCam=true; tween=null; requestRender(3);
  },
  reset:function(){ camera.fov=37; camera.far=1900; camera.near=1; camera.up.set(0,1,0); camera.clearViewOffset(); camera.updateProjectionMatrix(); },
  measure:function(){ camera.updateMatrixWorld(true);
    function px(mp,dy){ var w=W(mp[0],mp[1]); var v=new THREE.Vector3(w[0],groundY(w[0],w[1])+(dy||0),w[1]).project(camera); return [(v.x*0.5+0.5)*innerWidth,(-v.y*0.5+0.5)*innerHeight]; }
    function perKm(mp){ var g=GEOREF.toGeo(mp[0],mp[1]), a=GEOREF.toMap(g[0],g[1]-0.5/(111.32*Math.cos(g[0]*Math.PI/180))), b=GEOREF.toMap(g[0],g[1]+0.5/(111.32*Math.cos(g[0]*Math.PI/180)));
      var A=px(a), B=px(b); return +Math.hypot(A[0]-B[0],A[1]-B[1]).toFixed(1); }
    var pb=GEOREF.GT.pratzeberg.map, so=GEOREF.GT.sokolnitz.map, north=GEOREF.GT.santon.map, south=GEOREF.GT.satschan.map;
    var o=px(pb), nn=GEOREF.toGeo(pb[0],pb[1]), up=px(GEOREF.toMap(nn[0]+0.01,nn[1])), brg=Math.atan2(up[0]-o[0],-(up[1]-o[1]))*180/Math.PI;
    /* the battlefield frame's share inside the free rectangle: sample the frame on a grid */
    var f=this.free(), n=0, inF=0, onS=0;
    for(var i=0;i<=36;i++) for(var j=0;j<=31;j++){ var x=-180+i*10, z=-155+j*10, v=new THREE.Vector3(x,groundY(x,z),z).project(camera);
      var sx=(v.x*0.5+0.5)*innerWidth, sy=(-v.y*0.5+0.5)*innerHeight; n++; if(sx>=0&&sx<=innerWidth&&sy>=0&&sy<=innerHeight) onS++; if(sx>=f[0]&&sx<=f[2]&&sy>=f[1]&&sy<=f[3]) inF++; }
    return {pxPerKm:{pratzeberg:perKm(pb),sokolnitz:perKm(so),santon:perKm(north),satschan:perKm(south)}, northBearingOnScreen:+brg.toFixed(1),
      frameOnScreen:+(onS/n).toFixed(3), frameInFree:+(inF/n).toFixed(3), free:f.map(Math.round), fov:camera.fov};
  }
};`;
(async()=>{
  const b=await P.launch(), page=await P.open(b,[1600,900]); await page.evaluate(PROBE); const res={};
  const base={t:570,presentation:"study",mode:"staff"};
  const shots=[];
  await P.applyCase(page,Object.assign({cam:[-27,272,41,-27,0,9]},base));
  res.today=await page.evaluate(()=>__paper.measure()); let png=await page.screenshot({timeout:300000}); fs.writeFileSync(path.join(out,"today-overview.png"),png); shots.push({png,cap:"today: staff map, Overview vantage (perspective 37°, tilted)"});
  await page.evaluate(()=>{ __paper.northUp(4); }); await P.settle(page);
  res.northUp=await page.evaluate(()=>__paper.measure()); png=await page.screenshot({timeout:300000}); fs.writeFileSync(path.join(out,"northup-overview.png"),png); shots.push({png,cap:"probe: north up, straight down, 4° (near-orthographic)"});
  const sok=await page.evaluate(()=>{ const w=W(GEOREF.GT.sokolnitz.map[0],GEOREF.GT.sokolnitz.map[1]); return {x:w[0],z:w[1]}; });
  /* closer: 0.28 of the frame's extent, centred on Sokolnitz */
  await page.evaluate(f=>{ __paper.northUp(4,f,0.28); },sok); await P.settle(page);
  res.northUpClose=await page.evaluate(()=>__paper.measure()); png=await page.screenshot({timeout:300000}); fs.writeFileSync(path.join(out,"northup-sokolnitz.png"),png); shots.push({png,cap:"probe: north up, closer, on Sokolnitz"});
  fs.writeFileSync(path.join(out,"sheet-paper.jpg"),await P.sheet(page,shots,3,640,360,"Paper map: today and the north-up probe (staff mode, 09:30)"));
  fs.writeFileSync(path.join(out,"paper.json"),JSON.stringify(res,null,1));
  console.log(JSON.stringify(res,null,1));
  if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(2); });
