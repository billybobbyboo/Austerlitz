#!/usr/bin/env node
/* Stage 3 Part A (docs/STAGE3_SPEC.md sections A and H): landscape navigation and the open items, tried on the built page by a
   probe. The probe adds functions to the running page (measurement code, not the Stage 3 implementation); it changes no
   source file. node tools/stage3/nav-probe.js [--json out.json] [--only nav,viewmode,heads,switch,keys]

   1. Map-style landscape navigation, at 1x, 4x and 10.33x, from four views (the Field, Pratzen and Overview vantages and the
      harness's low Pratzen aim), through the app's own groundAt, groundY, clampCamera and camFloor:
      - drag pans: the ground point grabbed under the pointer is moved with it, 300 px in 12 steps, in four directions.
        Three rules for the orbit target are measured; in each the eye and target move in the horizontal plane of the grabbed
        point: (a) "release": the target is then lifted or lowered to the drawn ground under it, the eye with it; (b) "step":
        the same at every step; (c) "anchor": the target is moved along its own view ray to the drawn ground, the eye kept,
        so nothing on screen moves. A drag whose pointer passes above the horizon of the grabbed point's plane is "lost". Reported: the
        grabbed point's distance from the pointer during the drag and after release (px), the eye's clearance, floor clamps;
      - zoom toward the cursor: the whole eye-target pair scaled about the ground point under the cursor, 6 steps in and 6 out
        at 9% (the wheel's step), at five cursor positions. Reported: the ground point's drift from the cursor (px), the steps
        the radius limits (24-620) or the floor stopped;
      - the floor: after every step the eye is at or above camFloor (the count of violations must be 0).
   2. camera.setViewOffset: with the orbit target centred in the free rectangle, every picking and projection helper still
      agrees with the drawn frame: groundAt(project(p)) returns p (world units and px) for 40 ground points; worldPerPx at the
      target is unchanged; mlLayout runs.
   3. The open items carried from Stage 2 (section H):
      - the Watch #viewmode control at 24% opacity: its rendered text contrast over the map in the Watch harness views (per
        button: the median pixel of its box is the surround, the 3rd or 97th luminance percentile on the far side of it is
        the ink; the same in Study, at full opacity, for comparison);
      - pratzen-orbit-min (the harness's own interaction replayed) and four other views: the share of the screen the arrow
        heads' bounding boxes cover, against their triangles, and the map layer's own obstacles by kind (mlObstacles);
        the pratzen-orbit-min screenshot (docs/stage3-evidence/orbit-min.jpg);
      - the mode switch during playback: setMode into and out of the paper map while playing, timed;
      - keys (section F): Space with a focused button; ArrowRight with the time rail focused. */
const fs=require("fs");
const path=require("path");
const {launch,open,settle,CASES,ROOT}=require("../stage2/page.js");
/* the harness's own interaction (tools/visual/harness.js, interact), read from its source so the view is the harness's */
const HS=fs.readFileSync(path.join(ROOT,"tools","visual","harness.js"),"utf8");
const interact=eval("("+HS.slice(HS.indexOf("async function interact"),HS.indexOf("\n(async()=>{"))+")");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };

const PROBE=function(){
  var NP={}, v=new THREE.Vector3(), R=new THREE.Vector3();
  function W(){ return renderer.domElement.clientWidth||innerWidth; } function H(){ return renderer.domElement.clientHeight||innerHeight; }
  function scr(x,y,z){ camera.updateMatrixWorld(true); v.set(x,y,z).project(camera); return [(v.x*0.5+0.5)*W(),(-v.y*0.5+0.5)*H()]; }
  function ray(sx,sy){ camera.updateMatrixWorld(true); R.set(sx/W()*2-1,-(sy/H())*2+1,0.5).unproject(camera).sub(camera.position).normalize(); return R; }
  function floorOK(){ return landCam.position.y>=camFloor(landCam.position.x,landCam.position.z)-1e-6; }
  function sync(){ sph.setFromVector3(landCam.position.clone().sub(orbitTarget)); }
  /* a drag from (sx0,sy0) by (dx,dy) in n steps; reseat: "release" or "step" */
  NP.drag=function(sx0,sy0,dx,dy,n,reseat){
    var g=groundAt(sx0,sy0); if(!g) return null; var gp=[g[0],groundY(g[0],g[1]),g[1]], worst=0, clamps=CAM.clamps, bad=0;
    for(var k=1;k<=n;k++){
      var sx=sx0+dx*k/n, sy=sy0+dy*k/n, r=ray(sx,sy), E=landCam.position;
      if(r.y>=0){ NP.lost=(NP.lost||0)+1; return {lost:true,atStep:k}; }
      var t=(gp[1]-E.y)/r.y, hx=E.x+r.x*t, hz=E.z+r.z*t, ddx=gp[0]-hx, ddz=gp[2]-hz;
      orbitTarget.x+=ddx; orbitTarget.z+=ddz; landCam.position.x+=ddx; landCam.position.z+=ddz;
      if(reseat==="step"){ var ty=groundY(orbitTarget.x,orbitTarget.z), dyy=ty-orbitTarget.y; orbitTarget.y=ty; landCam.position.y+=dyy; }
      clampCamera(); landCam.lookAt(orbitTarget); if(!floorOK()) bad++;
      var s=scr(gp[0],gp[1],gp[2]); worst=Math.max(worst,Math.hypot(s[0]-sx,s[1]-sy));
    }
    var during=worst;
    if(reseat==="anchor"){ var ts=scr(orbitTarget.x,orbitTarget.y,orbitTarget.z), ga=groundAt(ts[0],ts[1]);   /* the target re-anchored on its own view ray: nothing on screen moves */
      if(ga){ orbitTarget.set(ga[0],groundY(ga[0],ga[1]),ga[1]); landCam.lookAt(orbitTarget); } if(!floorOK()) bad++; }
    if(reseat==="release"){ var ty2=groundY(orbitTarget.x,orbitTarget.z), dy2=ty2-orbitTarget.y; orbitTarget.y=ty2; landCam.position.y+=dy2; clampCamera(); landCam.lookAt(orbitTarget); if(!floorOK()) bad++; }
    var s2=scr(gp[0],gp[1],gp[2]); sync();
    return {during:+during.toFixed(2), after:+Math.hypot(s2[0]-(sx0+dx),s2[1]-(sy0+dy)).toFixed(2), clamps:CAM.clamps-clamps, floorViolations:bad,
      clearance:+(landCam.position.y-camGround(landCam.position.x,landCam.position.z)).toFixed(2)};
  };
  /* zoom by k about the ground point under (sx,sy): the eye-target pair scaled about it, the radius kept in 24-620 */
  NP.zoom=function(sx,sy,k){
    var g=groundAt(sx,sy); if(!g) return null; var gp=new THREE.Vector3(g[0],groundY(g[0],g[1]),g[1]);
    var r0=landCam.position.distanceTo(orbitTarget), r1=Math.max(24,Math.min(620,r0*k)), kk=r1/r0, limited=Math.abs(kk-k)>1e-9;
    orbitTarget.sub(gp).multiplyScalar(kk).add(gp); landCam.position.sub(gp).multiplyScalar(kk).add(gp);
    var clamped=clampCamera(); landCam.lookAt(orbitTarget); sync();
    var s=scr(gp.x,gp.y,gp.z);
    return {drift:+Math.hypot(s[0]-sx,s[1]-sy).toFixed(2), limited:limited, clamped:clamped, floorOK:floorOK()};
  };
  NP.save=function(){ return {p:landCam.position.clone(),t:orbitTarget.clone()}; };
  NP.restore=function(s){ landCam.position.copy(s.p); orbitTarget.copy(s.t); landCam.lookAt(orbitTarget); sync(); };
  /* setViewOffset: the target at the free rectangle's centre; the helpers against the drawn frame */
  NP.offset=function(){
    var fr=MAPCAM.freeRect(), w=W(), h=H(), cx=(fr[0]+fr[2])/2, cy=(fr[1]+fr[3])/2;
    var wpp0=worldPerPx(orbitTarget);
    camera.setViewOffset(w,h,w/2-cx,h/2-cy,w,h); camera.updateProjectionMatrix();
    var t=scr(orbitTarget.x,orbitTarget.y,orbitTarget.z), worstW=0, worstPx=0, n=0, miss=0;
    for(var i=0;i<40;i++){ var sx=fr[0]+(fr[2]-fr[0])*((i%8)+0.5)/8, sy=fr[1]+(fr[3]-fr[1])*(Math.floor(i/8)+0.5)/5, g=groundAt(sx,sy); if(!g){ miss++; continue; }
      var p=[g[0],groundY(g[0],g[1]),g[1]], s=scr(p[0],p[1],p[2]), g2=groundAt(s[0],s[1]); if(!g2){ miss++; continue; }
      n++; worstW=Math.max(worstW,Math.hypot(g2[0]-p[0],g2[1]-p[2])); worstPx=Math.max(worstPx,Math.hypot(s[0]-sx,s[1]-sy)); }
    var wpp1=worldPerPx(orbitTarget), a=performance.now(); mlLayout(); var ms=performance.now()-a;
    var res={target:[+t[0].toFixed(1),+t[1].toFixed(1)], freeCentre:[cx,cy], roundTripWorld:+worstW.toFixed(4), roundTripPx:+worstPx.toFixed(3), points:n, missed:miss,
      wppWithout:+wpp0.toFixed(5), wppWith:+wpp1.toFixed(5), layoutMs:+ms.toFixed(2), keepMissing:ML.stats.keepMissing.length};
    camera.clearViewOffset(); camera.updateProjectionMatrix(); mlLayout(); return res;
  };
  /* the Watch #viewmode: rendered contrast of its words (the 90th and 10th luminance percentiles inside each button's text box) */
  NP.viewmodeBoxes=function(){ return Array.prototype.map.call(document.querySelectorAll("#viewmode .vm-btn"),function(b){ var rg=document.createRange(); rg.selectNodeContents(b); var r=rg.getBoundingClientRect(), bb=b.getBoundingClientRect();
    return {text:b.textContent, box:[r.left,r.top,r.right,r.bottom], button:[bb.left,bb.top,bb.right,bb.bottom], opacity:getComputedStyle(document.getElementById("viewmode")).opacity, pressed:b.getAttribute("aria-pressed")}; }); };
  NP.contrast=function(b64,boxes){ return new Promise(function(res){ var im=new Image(); im.onload=function(){ var cv=document.createElement("canvas"); cv.width=im.width; cv.height=im.height;
      var x=cv.getContext("2d"); x.drawImage(im,0,0); var d=x.getImageData(0,0,cv.width,cv.height).data;
      function lin(c){ c/=255; return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4); }
      res(boxes.map(function(bx){ var L=[]; for(var y=Math.ceil(bx.button[1]);y<Math.floor(bx.button[3]);y++) for(var xx=Math.ceil(bx.button[0]);xx<Math.floor(bx.button[2]);xx++){ var o=(y*cv.width+xx)*4; L.push(0.2126*lin(d[o])+0.7152*lin(d[o+1])+0.0722*lin(d[o+2])); }
        /* the button's surround is its median pixel; its words are the extreme on the far side of it (3rd or 97th percentile) */
        L.sort(function(a,b){ return a-b; }); var lo=L[Math.floor(L.length*0.03)], md=L[Math.floor(L.length*0.5)], hi=L[Math.floor(L.length*0.97)], ink=(hi-md>md-lo)?hi:lo;
        return {text:bx.text, pressed:bx.pressed, opacity:bx.opacity, inkLum:+ink.toFixed(4), groundLum:+md.toFixed(4), ratio:+((Math.max(ink,md)+0.05)/(Math.min(ink,md)+0.05)).toFixed(2)}; })); };
    im.src="data:image/png;base64,"+b64; }); };
  /* the arrow heads' screen cover: bounding boxes against triangles, on a 4 px grid */
  NP.headCover=function(){ var G=4, w=W(), h=H(), nx=Math.ceil(w/G), ny=Math.ceil(h/G), box=new Uint8Array(nx*ny), tri=new Uint8Array(nx*ny), heads=0, skipped=0;
    if(!curOv) return null; curOv.updateMatrixWorld(true);
    curOv.traverse(function(o){ var dd=o.userData&&o.userData.drape; if(!dd||dd.kind!=="head"||!o.geometry||!window.__aus.effVisible(o)) return; if(o.material&&o.material.opacity<0.05) return; heads++;
      var P=o.geometry.attributes.position, I=o.geometry.index, S=[], bx=[1e9,1e9,-1e9,-1e9], behind=false;
      /* as measure.js headRects: a head with a vertex outside the depth range (behind the eye) is not counted */
      for(var i0=0;i0<P.count;i0++){ v.fromBufferAttribute(P,i0).applyMatrix4(o.matrixWorld).project(camera); if(v.z>1||v.z<-1){ behind=true; break; } }
      if(behind){ skipped++; return; }
      for(var i=0;i<P.count;i++){ v.fromBufferAttribute(P,i).applyMatrix4(o.matrixWorld).project(camera); var sx=(v.x*0.5+0.5)*w, sy=(-v.y*0.5+0.5)*h; S.push([sx,sy]);
        bx[0]=Math.min(bx[0],sx); bx[1]=Math.min(bx[1],sy); bx[2]=Math.max(bx[2],sx); bx[3]=Math.max(bx[3],sy); }
      for(var j=Math.max(0,Math.floor(bx[1]/G));j<Math.min(ny,Math.ceil(bx[3]/G));j++) for(var i2=Math.max(0,Math.floor(bx[0]/G));i2<Math.min(nx,Math.ceil(bx[2]/G));i2++) box[j*nx+i2]=1;
      var nt=I?I.count/3:P.count/3;
      for(var t=0;t<nt;t++){ var a=S[I?I.getX(t*3):t*3], b=S[I?I.getX(t*3+1):t*3+1], c=S[I?I.getX(t*3+2):t*3+2];
        var x0=Math.max(0,Math.floor(Math.min(a[0],b[0],c[0])/G)), x1=Math.min(nx-1,Math.ceil(Math.max(a[0],b[0],c[0])/G)), y0=Math.max(0,Math.floor(Math.min(a[1],b[1],c[1])/G)), y1=Math.min(ny-1,Math.ceil(Math.max(a[1],b[1],c[1])/G));
        for(var yy=y0;yy<=y1;yy++) for(var xx=x0;xx<=x1;xx++){ var px=xx*G+G/2, py=yy*G+G/2;
          var d1=(px-b[0])*(a[1]-b[1])-(a[0]-b[0])*(py-b[1]), d2=(px-c[0])*(b[1]-c[1])-(b[0]-c[0])*(py-c[1]), d3=(px-a[0])*(c[1]-a[1])-(c[0]-a[0])*(py-a[1]);
          if(!((d1<0||d2<0||d3<0)&&(d1>0||d2>0||d3>0))) tri[yy*nx+xx]=1; } } });
    var nb=0, nt2=0; for(var q=0;q<box.length;q++){ nb+=box[q]; nt2+=tri[q]; }
    /* the layer's own obstacles (mlObstacles: head boxes, marker and event-glyph discs), by kind, as the pass sees them */
    function cover(list){ var g=new Uint8Array(nx*ny), n=0; list.forEach(function(r){ for(var j=Math.max(0,Math.floor(r[1]/G));j<Math.min(ny,Math.ceil(r[3]/G));j++) for(var i=Math.max(0,Math.floor(r[0]/G));i<Math.min(nx,Math.ceil(r[2]/G));i++) g[j*nx+i]=1; });
      for(var q2=0;q2<g.length;q2++) n+=g[q2]; return +(n/g.length).toFixed(4); }
    var all=mlObstacles(w,h), sv=[ovHeads,ovMarkers,planGroup,eventGroup&&eventGroup.visible], parts={};
    var oh=ovHeads, om=ovMarkers; ovHeads=[]; ovMarkers=[]; var noArrows=mlObstacles(w,h); ovHeads=oh; ovMarkers=[]; var headsOnly=mlObstacles(w,h); ovMarkers=om;
    var evv=eventGroup?eventGroup.visible:false; if(eventGroup) eventGroup.visible=false; var noEvents=mlObstacles(w,h); if(eventGroup) eventGroup.visible=evv;
    /* each obstacle by kind, as mlObstacles builds them (heads, then objective markers, then plan, then event glyphs) */
    var oh2=ovHeads; ovHeads=[]; var noHeads=mlObstacles(w,h); ovHeads=oh2;
    var nH=all.length-noHeads.length, nM=noHeads.length-noArrows.length, nE=all.length-noEvents.length;
    var list=all.map(function(r,i){ return {kind:i<nH?"arrow head":(i<nH+nM?"objective marker":(i<all.length-nE?"plan":"event glyph")), rect:r.map(function(x){ return Math.round(x); }), w:Math.round(r[2]-r[0]), h:Math.round(r[3]-r[1])}; });
    var layerObst={all:cover(all), count:all.length, withoutArrowHeadsAndMarkers:cover(noArrows), withoutEventGlyphs:cover(noEvents), list:list,
      liveGlyphs:eventMarks.filter(function(k){ return k.sp.visible&&k.m.opacity>0.05; }).map(function(k){ return {id:k.e.id, distance:+camera.position.distanceTo(k.world).toFixed(1), pxRadius:Math.round(2.1/worldPerPx(k.world))}; })};
    return {layerObstacles:layerObst, heads:heads, behindEye:skipped, boxShare:+(nb/box.length).toFixed(4), triangleShare:+(nt2/box.length).toFixed(4), dropped:ML.stats.dropped, placed:ML.stats.placed}; };
  NP.switchTimes=function(){ var out=[]; togglePlay(); for(var i=0;i<3;i++){ var a=performance.now(); setMode("staff"); var b=performance.now(); setMode("terrain"); var c=performance.now(); out.push([+(b-a).toFixed(1),+(c-b).toFixed(1)]); } stopPlay(); return out; };
  window.__nav=NP;
};

(async()=>{
  /* --only a,b (nav, viewmode, heads, switch, keys): run those parts and merge them into the --json file */
  const only=opt("--only")?opt("--only").split(","):null, want=k=>!only||only.includes(k);
  const prev=(only&&opt("--json")&&fs.existsSync(opt("--json")))?JSON.parse(fs.readFileSync(opt("--json"),"utf8")):{};
  const out=Object.assign(prev,{when:new Date().toISOString()}), browser=await launch();
  const page=await open(browser,[1600,900]);
  await page.evaluate(`(${PROBE.toString()})()`);
  const low=CASES.find(c=>c.name==="pratzen-low");
  const VIEWS=[["field",{cam:[-195,92,156,-33,4,-2]}],["pratzen",{cam:[23,26,55,-31,10,-13]}],["overview",{cam:[-27,272,41,-27,0,9]}],["pratzen-low",{aim:low.aim}]];
  if(want("nav")) out.nav={};
  for(const f of (want("nav")?[1,4,"model"]:[])){
    for(const [vn,vs] of VIEWS){
      const spec=Object.assign({t:590,presentation:"watch",mode:"terrain",factor:f,viewport:[1600,900]},vs);
      await page.evaluate(s=>window.__aus.apply(s),spec); await settle(page);
      const r=await page.evaluate(()=>{ const N=window.__nav, s0=N.save(), res={drag:{},zoom:[]}, W=innerWidth, H=innerHeight;
        [["release"],["step"],["anchor"]].forEach(([rs])=>{ res.drag[rs]=[];
          [[300,0],[-300,0],[0,300],[0,-300]].forEach(d=>{ N.restore(s0); res.drag[rs].push(Object.assign({dir:d},N.drag(W*0.55,H*0.5,d[0],d[1],12,rs))); }); });
        [[0.5,0.5],[0.3,0.4],[0.7,0.6],[0.5,0.75],[0.62,0.3]].forEach(c=>{ N.restore(s0); const sx=W*c[0], sy=H*c[1], steps=[];
          for(let i=0;i<6;i++) steps.push(N.zoom(sx,sy,1/1.09)); for(let i=0;i<6;i++) steps.push(N.zoom(sx,sy,1.09));
          const ok=steps.filter(Boolean); res.zoom.push({at:c, steps:ok.length, worstDrift:Math.max(...ok.map(s=>s.drift)), limited:ok.filter(s=>s.limited).length,
            clamped:ok.filter(s=>s.clamped).length, floorViolations:ok.filter(s=>!s.floorOK).length, driftUnclamped:Math.max(0,...ok.filter(s=>!s.clamped&&!s.limited).map(s=>s.drift))}); });
        N.restore(s0); res.offset=N.offset(); N.restore(s0); res.violations=CAM.violations; return res; });
      out.nav[(f==="model"?"10.33":f)+"x "+vn]=r;
      const dm=(k,f)=>{ const ok=r.drag[k].filter(d=>d&&!d.lost); return ok.length?Math.max(...ok.map(d=>d[f])):"-"; }, lost=k=>r.drag[k].filter(d=>!d||d.lost).length;
      console.log((f==="model"?"10.33":f)+"x",vn.padEnd(12),"drag worst px during/after: release",dm("release","during"),"/",dm("release","after"),
        " step",dm("step","during"),"/",dm("step","after")," anchor",dm("anchor","during"),"/",dm("anchor","after")," lost above the horizon",lost("anchor")+"/4",
        " zoom drift worst",Math.max(...r.zoom.map(z=>z.worstDrift)),"unclamped",Math.max(...r.zoom.map(z=>z.driftUnclamped)),"clamped steps",r.zoom.reduce((a,z)=>a+z.clamped,0),
        " floor violations",r.zoom.reduce((a,z)=>a+z.floorViolations,0)+r.drag.release.reduce((a,d)=>a+(d.floorViolations||0),0)+r.drag.step.reduce((a,d)=>a+(d.floorViolations||0),0)+r.drag.anchor.reduce((a,d)=>a+(d.floorViolations||0),0),
        " offset round trip",r.offset.roundTripPx,"px wpp",r.offset.wppWithout,"->",r.offset.wppWith," render-guard",r.violations);
    }
  }
  /* the open items */
  if(want("viewmode")) out.viewmode={};
  for(const name of (want("viewmode")?["overview-plan","close-sokolnitz","pratzen-low","watch-selected","hybrid-dimmed"]:[])){
    const c=CASES.find(x=>x.name===name); await page.evaluate(s=>window.__aus.apply(s),c); await settle(page);
    const boxes=await page.evaluate(()=>window.__nav.viewmodeBoxes()), buf=await page.screenshot({timeout:180000});
    out.viewmode[name]=await page.evaluate(([b,x])=>window.__nav.contrast(b,x),[buf.toString("base64"),boxes]);
    console.log("viewmode",name,JSON.stringify(out.viewmode[name].map(x=>x.text+" "+x.ratio+":1")));
  }
  if(want("viewmode")){ const c=CASES.find(x=>x.name==="overview-field"); await page.evaluate(s=>window.__aus.apply(s),c); await settle(page);
    const boxes=await page.evaluate(()=>window.__nav.viewmodeBoxes()), buf=await page.screenshot({timeout:180000});
    out.viewmodeStudy=await page.evaluate(([b,x])=>window.__nav.contrast(b,x),[buf.toString("base64"),boxes]);
    console.log("viewmode study overview-field",JSON.stringify(out.viewmodeStudy.map(x=>x.text+" "+x.ratio+":1"))); }
  if(want("heads")){ const c=CASES.find(x=>x.name==="pratzen-orbit-min"); await page.evaluate(s=>window.__aus.apply(s),c); await settle(page);
    await interact(page,c.interact,c.viewport); await settle(page);   /* the harness's own interaction: the view it measures */
    out.headCover={"pratzen-orbit-min":await page.evaluate(()=>window.__nav.headCover())};
    fs.writeFileSync(path.join(ROOT,"docs","stage3-evidence","orbit-min.jpg"),await page.screenshot({type:"jpeg",quality:80,timeout:180000}));
    for(const name of ["overview-plan","pratzen-low","staff-paper","paper-close"]){ const c2=CASES.find(x=>x.name===name); await page.evaluate(s=>window.__aus.apply(s),c2); await settle(page);
      out.headCover[name]=await page.evaluate(()=>window.__nav.headCover()); }
    console.log("head cover",JSON.stringify(out.headCover)); }
  if(want("switch")){ const c=CASES.find(x=>x.name==="overview-field"); await page.evaluate(s=>window.__aus.apply(s),c); await settle(page);
    out.switchDuringPlay=await page.evaluate(()=>window.__nav.switchTimes()); console.log("mode switch while playing (into, out of) ms",JSON.stringify(out.switchDuringPlay)); }
  /* keys: Space on a focused button; ArrowRight on the focused time rail */
  if(want("keys")){ const c=CASES.find(x=>x.name==="overview-field"); await page.evaluate(s=>window.__aus.apply(s),c); await settle(page);
    const k={};
    await page.focus("#tourbtn"); const t0=await page.evaluate(()=>({tour:tourStep,playing:playing})); await page.keyboard.press(" "); await page.waitForTimeout(300);
    k.spaceOnTourButton={before:t0,after:await page.evaluate(()=>({tour:tourStep,playing:playing}))};
    await page.evaluate(()=>{ stopPlay(); if(tourStep>=0) exitTour(); });
    await page.focus("#timerail"); const c0=await page.evaluate(()=>clock); await page.keyboard.press("ArrowRight"); const c1=await page.evaluate(()=>clock);
    await page.keyboard.press("Shift+ArrowRight"); const c2=await page.evaluate(()=>clock);
    k.timerail={start:c0,arrowRight:c1-c0,shiftArrowRight:c2-c1, ariaValueNow:await page.evaluate(()=>document.getElementById("timerail").getAttribute("aria-valuenow"))};
    await page.focus("#play"); const c3=await page.evaluate(()=>clock); await page.keyboard.press("ArrowRight"); k.arrowOnPlayButton=(await page.evaluate(()=>clock))-c3;
    out.keys=k; console.log("keys",JSON.stringify(k)); }
  out.pageErrors=page._errors;
  if(opt("--json")) fs.writeFileSync(opt("--json"),JSON.stringify(out,null,1));
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
