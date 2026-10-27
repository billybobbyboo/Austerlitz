/* Stage 8, implementation PR 8D (decision 249 (a); docs/STAGE8_SPEC.md section 16): culling in motion, held to the picture without it. Shared by
   the harness's live block "cull" (tools/visual/harness.js, check:visual) and tools/stage8/cull-8d.js.
   In the page (inPage): window.__cm runs a sequence of the app's own frames on the motion driver's clock (tools/visual/motion.js, its WebGL draw
   kept), the motion reaching the app as a visitor's does (a drag, an orbit, the wheel, Play under Follow, a vantage's glide; a formation taken
   out of the view by each edge, the eye level turned, a finger's pan on a phone). After every frame the app drew (with culling, as it draws it),
   every figure mesh is judged: culled only if none of its instances is in the eye's frustum (each instance's own sphere: its geometry's,
   through its matrix and the mesh's, widened by the animation's envelope: since 8E's prerequisite the judge's own, every vertex animated at amp 1
   over 64 phases by animAt, not the envelope the bounds were made with); every second frame the same state is drawn again without culling and
   the two read from the drawing buffer at once and compared pixel for pixel (two renders of one state are equal on this machine, so the
   tolerance is 0). Counted: the frames judged and compared, the pixels differing, the meshes culled, those drawn in the shadow pass only (out of
   view, casting), the frames where a mesh changed between culled and drawn (a boundary crossed), and any instance in view of a culled mesh.
   The culling switch is set directly (CULL.on and each mesh's frustumCulled), not by setCull, so that no frame is asked for. Measurement only */
"use strict";
const inPage=function(){
  if(window.__cm) return true;
  var F=new THREE.Frustum(), M=new THREE.Matrix4(), Mi=new THREE.Matrix4(), S=new THREE.Sphere(), gl=null;
  function vis(o){ while(o){ if(!o.visible) return false; o=o.parent; } return true; }
  function cullSet(on){ CULL.on=on; CULL.meshes.forEach(function(m){ m.frustumCulled=on; }); }
  function read(){ gl=gl||renderer.getContext(); var w=gl.drawingBufferWidth, h=gl.drawingBufferHeight, b=new Uint8Array(w*h*4); gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b); return b; }
  function diff(a,b){ var n=0; for(var i=0;i<a.length;i+=4) if(a[i]!==b[i]||a[i+1]!==b[i+1]||a[i+2]!==b[i+2]) n++; return n; }
  /* the judge's own envelope of a geometry (8E's prerequisite): the largest displacement of any vertex animated at amp 1 over 64 phases by animAt,
     the hook's arithmetic, and since 8E over every pose the hook allows (animPoses: 32 phases, the slope, the trot, the knee and the wheels at
     their extremes) where the build has it; 0 for a geometry without parts or a build without the hook. Kept per part attribute (a mesh's own
     geometry shares its kit's) and its attributes' versions */
  var ENV=new WeakMap(), eo=[0,0,0];
  function envOf(g){ var K=g.attributes.aPart, Pa=g.attributes.position; if(!K||typeof animAt!=="function") return 0;
    var c=ENV.get(K); if(c&&c.pv===Pa.version&&c.kv===K.version&&c.P===Pa&&c.av===(typeof ANIM!=="undefined"?ANIM.ver:0)) return c.e;
    var P=Pa.array, KA=K.array, e=0;
    for(var v=0;v<KA.length;v++){ var x=P[v*3], y=P[v*3+1], z=P[v*3+2];
      if(typeof animPoses==="function") animPoses(Math.round(KA[v]),x,y,z,32,function(q){ var d=Math.hypot(q[0]-x,q[1]-y,q[2]-z); if(d>e) e=d; },eo);
      else for(var k=0;k<64;k++){ animAt(Math.round(KA[v]),x,y,z,k/64*Math.PI*2,1,eo); var d=Math.hypot(eo[0]-x,eo[1]-y,eo[2]-z); if(d>e) e=d; } }
    ENV.set(K,{e:e,pv:Pa.version,kv:K.version,P:Pa,av:(typeof ANIM!=="undefined"?ANIM.ver:0)}); return e; }
  /* the frame just drawn: each mesh's culling against its instances; the passes it was drawn in */
  function judge(R,passW,passS){
    camera.updateMatrixWorld(); F.setFromProjectionMatrix(M.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse)); R.judged++;
    CULL.meshes.forEach(function(m){ if(!vis(m)||m.count<=0) return; var cl=m.userData.cull, drawn=passW.has(m);
      var was=R.state.get(m); if(was!==undefined&&was!==drawn) R.toggles++; R.state.set(m,drawn);
      if(passS.has(m)&&!drawn) R.shadowOnly++;
      if(drawn) return; R.culled++;
      var G=cullGeo(m.geometry), A=m.instanceMatrix.array, n=Math.min(m.count,A.length/16), ms=m.matrixWorld.getMaxScaleOnAxis(), env=envOf(m.geometry);
      for(var i=0;i<n;i++){ Mi.fromArray(A,i*16); S.center.set(G.c[0],G.c[1],G.c[2]).applyMatrix4(Mi).applyMatrix4(m.matrixWorld); S.radius=(G.r+env)*Mi.getMaxScaleOnAxis()*ms;
        if(F.intersectsSphere(S)){ R.inView++; if(R.bad.length<6) R.bad.push(R.label+" frame "+R.frame+": "+cl.id+" culled with instance "+i+" in view"); break; } } });
  }
  var C={};
  /* one frame of the app (the driver's), its draws recorded by pass; every second frame compared with the same state drawn without culling, and
     the run's first drawn frame whatever its place (a reduced-motion glide draws one frame, the jump, and then rests) */
  C.step=function(R,compare){
    var orig=renderer.renderBufferDirect, W=new Set(), Sh=new Set();
    renderer.renderBufferDirect=function(c,sc,g,mt,ob){ if(ob&&ob.userData&&ob.userData.cull){ if(sc===null) Sh.add(ob); else if(sc===scene) W.add(ob); } return orig.apply(this,arguments); };
    var f0=DEV.frames;
    try{ window.__md.frame(); } finally{ renderer.renderBufferDirect=orig; }
    R.frame++;
    if(DEV.frames===f0) return;   /* no frame drawn (the page at rest): nothing to judge */
    judge(R,W,Sh);
    if(compare||!R.compared){ var A=read(); cullSet(false); renderFrame(); var B=read(); cullSet(true); R.compared++; var d=diff(A,B); R.px+=d; if(d&&R.bad.length<6) R.bad.push(R.label+" frame "+R.frame+": "+d+" pixels differ without culling"); }
  };
  C.newRun=function(label){ return {label:label, frame:0, judged:0, compared:0, px:0, culled:0, shadowOnly:0, toggles:0, inView:0, bad:[], state:new Map()}; };
  C.done=function(R){ delete R.state; return R; };
  window.__cm=C; return true;
};
/* the sequences: [label, view spec, kind, frames, amount, options]; the views are motion.js's and the harness's own (every spec names a cam or an
   aim, as the harness's applyCase needs one; an edge sequence then sets its own eye on the formation) */
const FIELD=[-195,92,156,-33,4,-2], OV=[-27,272,41,-27,0,9];
const SEQ=[
  ["pan from the Field vantage, Landscape","land",{t:570,presentation:"study",mode:"terrain",cam:FIELD},"pan",36,8],
  ["orbit from the Field vantage","land",{t:570,presentation:"study",mode:"terrain",cam:FIELD},"orbit",36,6],
  ["zoom on the Pratzeberg's west face","low",{t:590,presentation:"watch",mode:"terrain",aim:{map:[285,289],dir:[-1.0,0.13,0.18],r:70}},"zoom",30,1.03],
  ["Play at 1x under Follow from 08:40 (shapes, seating and battalions changing)","land",{t:520,presentation:"watch",mode:"terrain",cam:FIELD},"play",40,1],
  ["a glide to the Pratzen vantage","land",{t:570,presentation:"watch",mode:"terrain",cam:FIELD},"glide",30,"plateau"],
  ["Saint-Hilaire's division leaving the view by each edge","edge",{t:585,presentation:"watch",mode:"terrain",cam:FIELD},"edge",32,"sthilaire"],
  ["Nansouty's division leaving the view by each edge","edge",{t:600,presentation:"watch",mode:"terrain",cam:FIELD},"edge",32,"nansouty"],
  ["the eye level at the Zuran, turned","eye",{t:510,presentation:"watch",mode:"terrain",eyes:"fr",eye:true,cam:FIELD},"look",30,0.035],
  ["pan at 1x (footprints)","land",{t:570,presentation:"study",mode:"terrain",cam:FIELD,factor:1},"pan",20,8],
  ["pan at 10.33x","low",{t:590,presentation:"watch",mode:"terrain",factor:"model",aim:{map:[285,289],dir:[-1.0,0.13,0.18],r:70}},"pan",30,8],
  ["orbit with the visual effects off","low",{t:590,presentation:"watch",mode:"terrain",aim:{map:[285,289],dir:[-1.0,0.13,0.18],r:70}},"orbit",30,6,{fx:false}],
  ["a glide under reduced motion (a jump)","land",{t:570,presentation:"watch",mode:"terrain",cam:FIELD},"glide",12,"plateau",{rm:true}],
  ["a low sun: orbit at 08:20 close on Sokolnitz (long shadows)","low",{t:500,presentation:"watch",mode:"terrain",aim:{map:[210,362],dir:[-0.62,0.46,0.64],r:58}},"orbit",36,7],
  ["after the graphics context is lost and restored: an orbit","low",{t:590,presentation:"watch",mode:"terrain",aim:{map:[285,289],dir:[-1.0,0.13,0.18],r:70}},"orbit",24,6,{ctx:true}]
];
const PHONE_SEQ=[["a finger's pan, 390 x 844 (an iPhone: lowTier, no shadow)","phone",{t:570,presentation:"study",mode:"terrain",cam:FIELD},"pan",24,6,{touch:true}]];
/* one sequence in the page (the page already in its view, the drivers injected) */
const RUN=function(a){
  var D=window.__md, C=window.__cm, R=C.newRun(a.label), c=D.centre(), n=a.n, amt=a.amt, kind=a.kind, o=a.o||{};
  D.start({gl:true, frameMs:1000/30}); D.ptype=o.touch?"touch":"mouse";
  requestRender(2); D.frame(4);
  if(kind==="play"){ stopPlay(); freeCam=false; curVantage=null; setSpeed(amt); togglePlay(); }
  if(kind==="glide") flyTo(VANTAGE[amt]);
  if(kind==="pan") D.down(c[0],c[1],0);
  if(kind==="orbit") D.down(c[0],c[1],2);
  var base=null, right=null, up=null, k0=0;
  if(kind==="edge"){ var p=posNow(amt); if(p){ var w=W(p[0],p[1]), y=displayHeight(w[0],w[1]), d=new THREE.Vector3(-0.55,0.62,0.56).normalize().multiplyScalar(46);
      landCam.position.set(w[0]+d.x,y+d.y,w[1]+d.z); orbitTarget.set(w[0],y,w[1]); landCam.lookAt(orbitTarget); clampCamera(); syncViewOffset(true); camera.updateMatrixWorld();
      base={e:landCam.position.clone(), t:orbitTarget.clone()}; right=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0); up=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1);
      k0=Math.tan(camera.fov*Math.PI/360)*landCam.position.distanceTo(orbitTarget); } }
  for(var i=1;i<=n;i++){
    if(kind==="pan") D.move(c[0]+amt*i,c[1],0);
    else if(kind==="orbit") D.move(c[0]+amt*i,c[1],2);
    else if(kind==="zoom"){ if(i%3===0) D.wheel(c[0],c[1],i<=n/2?-100:100); }
    else if(kind==="look"){ var dir=new THREE.Vector3().subVectors(orbitTarget,landCam.position), q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),amt);
      dir.applyQuaternion(q); orbitTarget.copy(landCam.position).add(dir); landCam.lookAt(orbitTarget); lastInput=performance.now(); }
    else if(kind==="edge"&&base){ /* the formation from the centre out by an edge, one edge in each quarter of the sequence: left, right, bottom, top */
      var qn=Math.floor((i-1)/(n/4)), f=((i-1)%(n/4))/(n/4-1), dx=qn===0?-1:qn===1?1:0, dy=qn===2?-1:qn===3?1:0, s=f*1.6;
      var sh=right.clone().multiplyScalar(-dx*s*k0*camera.aspect).add(up.clone().multiplyScalar(-dy*s*k0));
      landCam.position.copy(base.e).add(sh); orbitTarget.copy(base.t).add(sh); landCam.lookAt(orbitTarget); lastInput=performance.now(); }
    C.step(R,i%2===0);
  }
  if(kind==="pan") D.up(c[0]+amt*n,c[1],0);
  if(kind==="orbit") D.up(c[0]+amt*n,c[1],2);
  if(kind==="play") stopPlay();
  for(var r=0;r<4;r++) C.step(R,r===3);
  D.stop(); D.ptype="mouse";
  return C.done(R);
};
/* the block: a page per configuration (the caller's openPage, its settle); each sequence from its view reached without motion. o.only (a list
   of words of the sequences' labels; tools/stage8/cull-8d.js --seq) runs only the sequences it names: the harness never passes it */
async function runBlock(open,settle,o){
  o=o||{}; const MO=require("./motion.js"), out={runs:[]}, log=o.log||function(){};
  const pick=s=>!o.only||o.only.some(w=>s[0].indexOf(w)>=0);
  /* the desktop's page at 1280 x 720: below 900 x 700 the app draws the low tier (lowTier: density 1.0 and no shadow pass, decision 236), which
     would leave the shadow pass untested */
  const conf=[{vp:[1280,720],seq:SEQ.filter(pick)},{vp:[390,844],device:"ios",seq:PHONE_SEQ.filter(pick)}].filter(K=>K.seq.length);
  for(const K of conf){
    const page=await open(K.vp,K.device);
    try{
      await settle(page); await page.evaluate(()=>closeFirst(null));
      for(const s of K.seq){ const [label,,spec,kind,n,amt,opt]=s, X=opt||{}, t0=Date.now();
        if(X.rm) await page.emulateMedia({reducedMotion:"reduce"});
        await page.evaluate(()=>{ select(null,null); stopPlay(); });
        await page.evaluate(sp=>window.__aus.apply(sp),Object.assign({viewport:K.vp},spec)); await settle(page);
        if(X.fx===false) await page.evaluate(()=>setFXEnabled(false));
        if(X.ctx){ /* the context lost and restored, the view still: the next frames drawn by the app after the restore (glRestored) */
          await page.evaluate(()=>new Promise(res=>{ var ext=renderer.getContext().getExtension("WEBGL_lose_context"); if(!ext) return res(false);
            renderer.domElement.addEventListener("webglcontextrestored",function h(){ renderer.domElement.removeEventListener("webglcontextrestored",h); setTimeout(()=>res(true),50); });
            ext.loseContext(); setTimeout(()=>ext.restoreContext(),300); }));
          await settle(page); }
        await page.evaluate(MO.inPage); await page.evaluate(inPage);
        const r=await page.evaluate(new Function("a","return ("+RUN.toString()+")(a);"),{label:label,kind:kind,n:n,amt:amt,o:X});
        if(X.fx===false) await page.evaluate(()=>setFXEnabled(true));
        if(X.rm) await page.emulateMedia({reducedMotion:"no-preference"});
        r.secs=+((Date.now()-t0)/1000).toFixed(1); r.viewport=K.vp; r.device=K.device||null; r.ctx=!!X.ctx; r.fx=X.fx!==false; r.rm=!!X.rm;
        r.lowTier=await page.evaluate(()=>!!lowTier); r.shadow=await page.evaluate(()=>!!(sun.castShadow&&renderer.shadowMap.enabled));
        out.runs.push(r);
        log("cull in motion: "+label.padEnd(72)+" "+r.judged+" frames judged, "+r.compared+" compared, "+r.px+" pixels differing, "+r.culled+" culled, "+r.shadowOnly+" casting out of view, "+
          r.toggles+" boundary crossings, "+r.inView+" culled with an instance in view ("+r.secs+" s)"); }
    } finally { const cx=page.context(); await page.close(); if(K.device) await cx.close(); }
  }
  return out;
}
module.exports={inPage, SEQ, PHONE_SEQ, RUN, runBlock};
