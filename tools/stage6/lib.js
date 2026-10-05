/* Stage 6 Part A: shared by the page probes in this folder. The page is opened as the Stage 0 harness opens it (tools/stage2/page.js,
   with tools/visual/measure.js injected) and the Stage 5 helpers (tools/stage5/lib.js: the screenshot comparison, the world pass's
   timer, the map layer's counts). Measurement code only: nothing here is the Stage 6 design, and nothing is written to a source file. */
const path=require("path");
const L5=require("../stage5/lib.js");
const {CASES}=L5;
/* the views: every landscape harness view at 1600 x 900 at its own factor (the 4x default, the eye level at 1x), the closest orbit
   (pratzen-orbit-min, reached by the harness's own pointer path, copied below), the low Pratzen view and the four MULTI views at the model's
   10.33x, the low Pratzen view at 1x (no figures: the footprint rule, decision 34) and the two paper-map views at 1600 x 900 (counters only) */
function views(){
  const V=[];
  CASES.filter(c=>!c.fresh&&c.mode!=="staff"&&c.viewport[0]===1600&&!c.interact&&!c.factor).forEach(c=>V.push({c,key:c.name}));
  CASES.filter(c=>c.name==="pratzen-orbit-min"||c.name==="eye-zuran-1x"||c.name==="pratzen-low-1x"||c.name==="pratzen-low-10x").forEach(c=>V.push({c,key:c.name}));
  ["overview-field","close-sokolnitz","ph8-overview-watch"].forEach(n=>{ const c=CASES.find(x=>x.name===n); V.push({c:Object.assign({},c,{factor:"model"}),key:n+"@10.33x"}); });
  CASES.filter(c=>c.mode==="staff"&&c.viewport[0]===1600&&(c.name==="paper-north-up"||c.name==="paper-close")).forEach(c=>V.push({c,key:c.name}));
  return V;
}
/* the harness's pointer path for an interact case (tools/visual/harness.js, interact(): the same wheel and pointer handlers a visitor
   drives, fed as events in one go), copied so the probes reach the closest orbit exactly as the harness does */
async function interact(page,it,vp){
  await page.evaluate(([it,vp])=>{
    var el=renderer.domElement, cx=Math.round(vp[0]*0.62), cy=Math.round(vp[1]*0.45), spc=el.setPointerCapture;
    el.setPointerCapture=function(){};
    function wheelAt(){ camera.updateMatrixWorld(true); var v=orbitTarget.clone().project(camera); return [Math.round((v.x*0.5+0.5)*vp[0]),Math.round((-v.y*0.5+0.5)*vp[1])]; }
    var o=function(x,y,b){ return {pointerId:1,isPrimary:true,pointerType:"mouse",clientX:x,clientY:y,buttons:b?2:0,button:2,bubbles:true,cancelable:true}; };
    function drag(dx,dy){ var n=12; el.dispatchEvent(new PointerEvent("pointerdown",o(cx,cy,1)));
      for(var k=1;k<=n;k++) el.dispatchEvent(new PointerEvent("pointermove",o(cx+dx*k/n,cy+dy*k/n,1)));
      window.dispatchEvent(new PointerEvent("pointerup",o(cx+dx,cy+dy,0))); }
    var height=displayHeight;
    if(it.target==="deepest"){ var cands=[], bT=null, bD=-1e9;
      FEATURES.forEach(function(ft){ var w=W(ft.p[0],ft.p[1]); cands.push([w[0],height(w[0],w[1]),w[1],"place "+ft.id]); });
      Object.keys(FORMATIONS).forEach(function(id){ var q=posNow(id); if(q){ var w=W(q[0],q[1]); cands.push([w[0],height(w[0],w[1]),w[1],"formation "+id]); } });
      cands.forEach(function(c){ for(var q2=0;q2<72;q2++){ var th=q2/72*Math.PI*2;
        var d=height(c[0]+24*Math.sin(th),c[2]+24*Math.cos(th))-(c[1]+24*Math.cos(Math.PI/2-0.03)); if(d>bD){ bD=d; bT=c; } } });
      orbitTarget.set(bT[0],bT[1],bT[2]); var dv=new THREE.Vector3(-0.55,0.62,0.56).normalize().multiplyScalar(86);
      camera.position.set(bT[0]+dv.x,bT[1]+dv.y,bT[2]+dv.z); camera.lookAt(orbitTarget); window.__target=bT[3]; }
    syncViewOffset(true);
    var wb=wheelAt();
    for(var w2=0;w2<(it.target==="deepest"?(it.wheel||0):0);w2++) el.dispatchEvent(new WheelEvent("wheel",{deltaY:-120,clientX:wb[0],clientY:wb[1],bubbles:true,cancelable:true}));
    if(it.dragX||it.dragY) drag(it.dragX||0,it.dragY||0);
    if(it.aim==="deepest"){ var tg=orbitTarget, phi=Math.PI/2-0.03, r=24, best=-1e9, bt=0;
      for(var q=0;q<360;q++){ var th=q/360*Math.PI*2, x=tg.x+r*Math.sin(phi)*Math.sin(th), z=tg.z+r*Math.sin(phi)*Math.cos(th), d=height(x,z)-(tg.y+r*Math.cos(phi)); if(d>best){ best=d; bt=th; } }
      var now=new THREE.Spherical().setFromVector3(camera.position.clone().sub(tg)).theta, dth=bt-now;
      while(dth>Math.PI) dth-=2*Math.PI; while(dth<-Math.PI) dth+=2*Math.PI; drag(-dth/0.005,0); }
    el.setPointerCapture=spc;
  },[it,vp]);
}
async function applyView(page,V){
  await page.evaluate(s=>window.__aus.apply(s),V.c); await L5.settle(page);
  if(V.c.interact){ await interact(page,V.c.interact,V.c.viewport); await L5.settle(page); }
}
module.exports=Object.assign({},L5,{views,interact,applyView,EVID6:path.join(L5.ROOT,"docs","stage6-evidence")});
