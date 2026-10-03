#!/usr/bin/env node
/* Stage 5 Part A (docs/STAGE5_SPEC.md section A): spatial confidence, prototyped on the built page by a probe. It adds
   draped meshes to the running scene for the measurement and removes them; it changes no source file.
   node tools/stage5/confidence-probe.js [--json f] [--sheet f]

   For every landscape harness view (four also at 1x and 10.33x) and the two paper-map views at 1600 x 900:
   - the leaf formations drawn, by position grade as the app computes it (confAt), and how many are interpolated;
   - their footprints (Stage 2B's primitive: frontage W0 x sw by depth D0 x sd, ground scale) in metres;
   - four encodings drawn under the formations, each a draped mesh like makeFootprint's (16 x 16 vertices, every vertex at
     its lift above groundY, the side's colour):
       F  every formation as its crisp footprint (the 1x drawing, at every factor);
       G1 graded: A the crisp footprint; B a soft frontage (the footprint's frontage doubled, its alpha falling to nothing over
          the outer half of each end; depth crisp); C a diffuse zone (a disc, radius the formation's own frontage, alpha falling
          from the centre);
       G2 as G1, the C zone's radius 1 km (a fixed ground distance) instead;
       G3 as G1, with A drawn as nothing new (only B and C carry a mark: "no mark means documented");
     the radii and the falloffs are DESIGN VALUES for the probe, not error bounds: the data grades a position, it does not
     give a distance;
   - per encoding: the share of the free rectangle changed against the view without it (two screenshots), the contrast of
     the changed pixels against the ground they cover, the map layer's drops, map text contrast as rendered, solid
     near-black, and the world pass's time (software WebGL: comparable only with itself);
   - the share of each zone's sample points (every 0.5 world units) where the draped mesh lies under the drawn ground. */
const fs=require("fs"), path=require("path");
const L5=require("./lib.js");
const {launch,open,settle,CASES,LAND,MULTI,PAPER,HELPERS,inject,shot,contrastOf,darkOf,sheet,EVID}=L5;
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const OUT=opt("--json")||path.join(EVID,"confidence-probe.json"), SHEET=opt("--sheet")||path.join(EVID,"confidence-sheet.jpg");

const PROBE=function(){
  var C={grp:null};
  function alphaTex(kind){ var N=128, cv=document.createElement("canvas"); cv.width=cv.height=N; var x=cv.getContext("2d"), im=x.createImageData(N,N), d=im.data;
    for(var j=0;j<N;j++) for(var i=0;i<N;i++){ var u=(i+0.5)/N*2-1, v=(j+0.5)/N*2-1, a=1;
      if(kind==="soft"){ var e=Math.abs(u); a=e<0.5?1:Math.max(0,1-(e-0.5)/0.5); a=a*a*(3-2*a); }
      else if(kind==="zone"){ var r=Math.hypot(u,v); a=r>=1?0:Math.pow(1-r*r,1.5); }
      var o=(j*N+i)*4; d[o]=d[o+1]=d[o+2]=255; d[o+3]=Math.round(255*a); }
    x.putImageData(im,0,0); var t=new THREE.CanvasTexture(cv); return t; }
  var TEX={};
  function mesh(hex,op,kind){ var g=new THREE.PlaneGeometry(1,1,16,16); g.rotateX(-Math.PI/2);
    if(!TEX[kind]) TEX[kind]=kind==="crisp"?null:alphaTex(kind);
    var m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:lin(hex),transparent:true,opacity:op,map:TEX[kind]||null,depthWrite:false,side:THREE.DoubleSide,fog:false}));
    m.userData.base=Float32Array.from(g.attributes.position.array); m.renderOrder=4; m.frustumCulled=false; return m; }
  function under(m){ /* sample the drawn mesh every 0.5 units between its vertices (bilinear) against groundY */
    var P=m.geometry.attributes.position, n=17, bad=0, tot=0;
    for(var j=0;j<16;j++) for(var i=0;i<16;i++){ var a=j*n+i, b=a+1, c=a+n, d=c+1;
      var ax=P.getX(a),az=P.getZ(a), bx=P.getX(b), cz=P.getZ(c), sx=Math.max(1,Math.ceil(Math.abs(bx-ax)/0.5)), sz=Math.max(1,Math.ceil(Math.abs(cz-az)/0.5));
      for(var q=0;q<=sz;q++) for(var p=0;p<=sx;p++){ var u=p/sx, w=q/sz;
        var X=(1-w)*((1-u)*P.getX(a)+u*P.getX(b))+w*((1-u)*P.getX(c)+u*P.getX(d)), Z=(1-w)*((1-u)*P.getZ(a)+u*P.getZ(b))+w*((1-u)*P.getZ(c)+u*P.getZ(d)),
            Y=(1-w)*((1-u)*P.getY(a)+u*P.getY(b))+w*((1-u)*P.getY(c)+u*P.getY(d));
        tot++; if(Y<groundY(X,Z)) bad++; } }
    return [bad,tot]; }
  C.census=function(){ var fr=(mode!=="staff")?landFreeRect():MAPCAM.freeRect(null,landPanels()), v=new THREE.Vector3(), out={drawn:0,inFree:0,A:0,B:0,C:0,interp:0,foot:[]};
    Object.keys(units).forEach(function(id){ var p=posNow(id); if(!p) return; out.drawn++; var w=W(p[0],p[1]); v.set(w[0],groundY(w[0],w[1]),w[1]).project(camera);
      var sx=(v.x*0.5+0.5)*(renderer.domElement.clientWidth||innerWidth), sy=(-v.y*0.5+0.5)*viewH(); if(v.z>1||sx<fr[0]||sx>fr[2]||sy<fr[1]||sy>fr[3]) return;
      out.inFree++; var c=confAt(id,clock); out[c.cf]++; if(c.interp) out.interp++;
      var u=units[id].block.userData; out.foot.push([id,c.cf,Math.round(u.W0*u.sw*GEOREF.M_PER_WORLD),Math.round(u.D0*u.sd*GEOREF.M_PER_WORLD)]); });
    return out; };
  C.clear=function(){ if(C.grp){ scene.remove(C.grp); C.grp.traverse(function(o){ if(o.geometry) o.geometry.dispose(); if(o.material) o.material.dispose(); }); C.grp=null; } requestRender(2); };
  C.build=function(variant){ C.clear(); var g=new THREE.Group(); C.grp=g; scene.add(g); var und=[0,0], n=0, KM1=1000/GEOREF.M_PER_WORLD;
    Object.keys(units).forEach(function(id){ var rec=units[id], p=posNow(id); if(!p) return; var f=rec.f, c=confAt(id,clock).cf, u=rec.block.userData;
      if(!u||!u.W0) return; poseBlock(rec,id,liveStatus(id,curPhase));
      var w=W(p[0],p[1]), yaw=rec.yaw||0, Wf=u.W0*u.sw, Df=u.D0*u.sd, hex=hexNum(TOKENS.sym.side[sideOfNation(f.nation)].base), m=null;
      if(variant==="F"||c==="A"){ if(variant==="G3"&&c==="A") return; m=mesh(hex,0.62,"crisp"); placeFootprint(m,w[0],w[1],yaw,Wf,Df,0.25); }
      else if(c==="B"){ m=mesh(hex,0.55,"soft"); placeFootprint(m,w[0],w[1],yaw,Wf*2,Df,0.25); }
      else { var R=variant==="G2"?KM1:Wf; m=mesh(hex,0.45,"zone"); placeFootprint(m,w[0],w[1],yaw,2*R,2*R,0.25); }
      g.add(m); n++; var q=under(m); und[0]+=q[0]; und[1]+=q[1]; });
    requestRender(2); return {meshes:n,underShare:und[1]?+(und[0]/und[1]).toFixed(4):0}; };
  window.__s5c=C; return true;
};

const VIEWS=[];
LAND.forEach(c=>VIEWS.push({c,key:c.name}));
MULTI.forEach(n=>{ const c=CASES.find(x=>x.name===n); VIEWS.push({c:Object.assign({},c,{factor:1}),key:n+"@1x"}); VIEWS.push({c:Object.assign({},c,{factor:"model"}),key:n+"@10.33x"}); });
CASES.filter(c=>c.name==="pratzen-low-1x"||c.name==="pratzen-low-10x").forEach(c=>{ if(!VIEWS.find(v=>v.key===c.name)) VIEWS.push({c,key:c.name}); });
PAPER.filter(c=>c.name==="paper-north-up"||c.name==="paper-close").forEach(c=>VIEWS.push({c,key:c.name}));
const SHEET_KEYS=["pratzen-low","close-sokolnitz","overview-field","pratzen-low@1x","paper-close"];

(async()=>{
  const browser=await launch(), page=await open(browser,[1600,900]), out={html:process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html",when:new Date().toISOString(),views:{}}, tiles=[];
  await inject(page,HELPERS); await inject(page,PROBE);
  const ONLY=opt("--only"), RUN=ONLY?VIEWS.filter(v=>ONLY.split(",").includes(v.key)):VIEWS;
  for(const V of RUN){
    await page.evaluate(s=>window.__aus.apply(s),V.c); await settle(page);
    await page.evaluate(()=>__s5c.clear()); await settle(page);
    const r={clock:V.c.t,factor:V.c.factor||4,census:await page.evaluate(()=>__s5c.census())};
    const b0=await shot(page); r.base={layer:await page.evaluate(()=>__s5.layer()),contrast:await contrastOf(page,b0),dark:await darkOf(page,b0),worldMs:await page.evaluate(()=>__s5.frame(5))};
    if(SHEET_KEYS.includes(V.key)) tiles.push({png:Buffer.from(b0,"base64"),cap:V.key+" today"});
    for(const vr of ["F","G1","G2","G3"]){
      const b=await page.evaluate(v=>__s5c.build(v),vr); await settle(page);
      const b1=await shot(page), d=await page.evaluate(([a,b])=>__s5.diff(a,b),[b0,b1]);
      r[vr]={meshes:b.meshes,underShare:b.underShare,diff:d,layer:await page.evaluate(()=>__s5.layer()),contrast:await contrastOf(page,b1),dark:await darkOf(page,b1),worldMs:await page.evaluate(()=>__s5.frame(5))};
      if(SHEET_KEYS.includes(V.key)&&(vr==="G1"||vr==="G2")) tiles.push({png:Buffer.from(b1,"base64"),cap:V.key+" "+vr});
      await page.evaluate(()=>__s5c.clear()); }
    out.views[V.key]=r;
    console.log(V.key.padEnd(24),"grades",r.census.A+"/"+r.census.B+"/"+r.census.C,"in free",r.census.inFree,"base drop",r.base.layer.dropped,
      ["F","G1","G2","G3"].map(k=>k+" chg "+r[k].diff.changed+" c "+r[k].diff.contrastMedian+" drop "+r[k].layer.dropped+" AA- "+r[k].contrast.belowAA+" min "+r[k].contrast.min+" ms "+r[k].worldMs+" under "+r[k].underShare).join(" | "),"base ms",r.base.worldMs);
    fs.mkdirSync(EVID,{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(out,null,1));
  }
  if(tiles.length){ const jpg=await sheet(page,tiles,3,640,360,"Stage 5 Part A: spatial confidence prototypes (today, G1: C zone radius = frontage, G2: C zone radius 1 km)"); fs.writeFileSync(SHEET,jpg); }
  if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(2); });
