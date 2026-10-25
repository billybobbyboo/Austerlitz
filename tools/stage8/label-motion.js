#!/usr/bin/env node
/* Stage 8 Part A (docs/STAGE8_SPEC.md section 3): the map layer in motion, measured (the owner's note L2: "the division counters dart all
   over the place along with the labels when the screen moves"). The build is unchanged: the probe drives the app's own camera functions
   (LANDCAM.panStart/panTo, zoomAt, orbit; the glide's own setupArc/applyArc; MAPCAM.pan/zoomAt/restore; Play with Follow through tickClock
   and followStep) one frame at a time, runs the frame's own state pass (updateVisibility) and the map layer's pass (mlLayout) as a drawn
   frame does, and reads every item's state and box after each frame. No WebGL frame is needed for the layout, so none is drawn here.
   A frame is a 30 fps frame of the motion: a pan of 8 px a frame is 240 px a second.
   Per motion it reports, over the items in view in two successive frames:
   - jumps: an item drawn in both frames whose box moved against its own anchor by more than 3 px (it took another place: the "dart");
   - pops: an item in view in both frames that went from drawn to dropped or hidden behind the ground, or back (a disappearance or a
     reappearance that is not the anchor leaving the screen or going under a panel);
   - lod: an item that entered or left the layer's list in view (a level-of-detail switch: corps or divisions, the name ranges, the
     brigades, the counters' full form), counted apart;
   - flicker: an item drawn, gone and drawn again within 10 frames;
   - overlaps: pairs of drawn boxes that overlap (the layer's rule is none; a prototype that freezes the layout could break it);
   - the layer's pass time (ML.stats.ms) per frame: median, 95th percentile, maximum (CPU, this machine; software WebGL does not enter it).
   Stabilisers prototyped in the page (each installed by overriding the app's own mlPlaceItem / mlLayout and removed after; --stab):
   - none: the build as it is;
   - persist: each item first tries the place it held in the last frame (its box against its anchor), then the build's own search;
   - persist+hold: persist, and an item that was dropped is shown again only after it has found room in 4 successive frames (the never
     dropped items are exempt), and, while the view moves, the distance the level-of-detail switches read (viewDist: wantCorps 250, the
     brigades 165, the name ranges 170/220/300) held until it has moved 8% (hysteresis; released at rest, where the switches read the true
     distance; the counters' full form, ML_FULL_DIST through viewDistTo, is not banded here). The runs in label-motion.json and
     label-motion-final.json held the band at rest too; label-motion-rest.json measures the band released;
   - freeze: while the camera moves, no item is placed anew: each drawn item keeps its box against its anchor (it moves with the map) and
     nothing new appears; the frame after the motion is solved again with persist (the overlaps this costs are counted);
   - anchor2: anchor, but a drawn item whose held place is blocked first tries the eight places hugging its own anchor (mlPlaceItem's first
     candidates, no rings) before it is hidden, and a hidden item is shown again only after two successive re-placement passes with room;
   - anchor2+band: anchor2 with persist+hold's level-of-detail band (the switches' distance held until it has moved 8%): the composite
     section 3 recommends (tools/stage8/protos/labels.js "l-band");
   - anchor: while the view moves (the camera, or the clock playing), a drawn item keeps its box against its anchor as long as that place is
     free, else it is hidden (never moved: no jump); an item not drawn is searched for only every EVERY frames (a slower re-placement pass,
     333 ms at 30 frames a second); collisions are tested every frame, in priority order, so nothing overlaps; at rest the build's full solve
     with persist. (The approach of tiled-map engines: placements held per label, collisions resolved by hiding, re-placement throttled.)
   node tools/stage8/label-motion.js [--json out.json] [--only motionIds] [--stab none,persist,persist+hold,freeze]
   Measurement and prototype code only: nothing is written to a source file.
   Stage 8, implementation PR 8C: --app measures a build as it is, whatever it holds (8B's, which solves every frame afresh, or 8C's
   stabiliser), the motion reaching it as a visitor's does: through tools/visual/motion.js, the app's own loop at 30 frames a second on the
   driver's clock, a drag's pointer events, the wheel's own steps, a vantage's glide, the paper map's eased move, Play with Follow (no MOVING
   flag: the app reads its own state). The WebGL draw skipped (the layout reads nothing it draws). The same 16 motions, a run at rest of 30
   frames after each, and four with Saint-Hilaire's division selected (priority); for each: Part A's measures, the formations' tracking and
   the layer's pass time (real milliseconds, this machine's CPU).
   node tools/stage8/label-motion.js --app [--json out.json] [--only ids] [--rm]    (the build: AUSTERLITZ_HTML, else the repository's) */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), ONLY=opt("--only")?opt("--only").split(","):null;
const STABS=(opt("--stab")||"none,persist,persist+hold,freeze,anchor,anchor2,anchor2+band").split(",");
if(argv.includes("--app")){ require("./label-motion-app.js").main({out:OUT, only:ONLY, rm:argv.includes("--rm")}).catch(e=>{ console.error(e); process.exit(1); }); return; }

/* the views: Landscape with counters (hybrid) and the paper map, as a visitor in Study at 09:30 sees them; the landscape's names (terrain)
   from the Field vantage and the low Pratzen view */
const VIEWS={
  hybrid:{name:"hybrid-field", viewport:[1600,900], t:570, presentation:"study", mode:"hybrid", cam:[-195,92,156,-33,4,-2]},
  paper:{name:"paper-frame", viewport:[1600,900], t:570, presentation:"study", mode:"staff", paper:"frame", cam:[-27,272,41,-27,0,9]},
  land:{name:"land-field", viewport:[1600,900], t:570, presentation:"study", mode:"terrain", cam:[-195,92,156,-33,4,-2]},
  low:{name:"land-low", viewport:[1600,900], t:590, presentation:"study", mode:"terrain", aim:{map:[285,289], dir:[-1.0,0.13,0.18], r:70}}
};
/* the motions: [id, view, kind, frames, amount] */
const MOTIONS=[
  ["hybrid-pan","hybrid","pan",60,8], ["hybrid-zoom","hybrid","zoom",60,1.03], ["hybrid-orbit","hybrid","orbit",60,6], ["hybrid-glide","hybrid","glide",45,"plateau"], ["hybrid-play","hybrid","play",90,0.5],
  ["paper-pan","paper","pan",60,8], ["paper-zoom","paper","zoom",60,1.03], ["paper-glide","paper","glide",45,"sokolnitz"], ["paper-play","paper","play",90,0.5],
  ["land-pan","land","pan",60,8], ["land-zoom","land","zoom",60,1.03], ["land-orbit","land","orbit",60,6], ["land-play","land","play",90,0.5],
  ["low-pan","low","pan",60,8], ["low-orbit","low","orbit",60,6], ["low-zoom","low","zoom",60,1.03]
];

const PROBE=function(){
  /* the probe draws no WebGL frame: the app's own animation loop is stopped (the pending callback runs once more, then finds this no-op), so
     the page's software renderer does not redraw behind the measurement */
  if(!window.__loopStopped){ window.loop=function(){}; window.__loopStopped=true; }
  var S={}, orig={place:mlPlaceItem, layout:mlLayout, upd:updateVisibility, collect:mlCollect}, STAB="none", FROZEN=false, HOLD=4, BAND=0.08, EVERY=10, MOVING=false, mf=0;
  /* ---- the stabilisers (prototypes) ---- */
  function prevTry(it,VW,VH,panels,obst){
    var p=it._prev; if(!p||p.mode!==it.mode||!(it.w>0&&it.h>0)) return false;
    var x0=it.sx+p.dx, y0=it.sy+p.dy;
    if(it.mode==="place"){ var m=[it.sx-5,it.sy-5,it.sx+5,it.sy+5]; if(!mlFree(m[0],m[1],10,10,VW,VH,panels,obst)) return false;
      ML.taken.push(m); if(mlFree(x0,y0,it.w,it.h,VW,VH,panels,obst)){ it.mrect=m; return mlTake(it,x0,y0,false); } ML.taken.pop(); return false; }
    if(it.mode==="counter"){ var pb=it.hq?12:5; it.ox=5+20; it.oy=13+(it.h-13-pb)/2+14; }
    else { it.ox=it.w/2; it.oy=it.h; }
    if(Math.abs(p.w-it.w)>2||Math.abs(p.h-it.h)>2) return false;   /* its size changed (the full counter, a wrap): search again */
    return mlFree(x0,y0,it.w,it.h,VW,VH,panels,obst)?mlTake(it,x0,y0,p.lead):false;
  }
  /* the places hugging an item's own anchor only (mlPlaceItem's first candidates: no rings, no rows), for anchor2 */
  function localTry(it,VW,VH,panels,obst){
    var w=it.w, h=it.h, sx=it.sx, sy=it.sy, cl=it.acl+(it.r?it.r*it.ppw:0), C, i;
    if(!(w>0&&h>0)) return false;
    if(it.mode==="place"){ var m=[sx-5,sy-5,sx+5,sy+5], g=7; if(!mlFree(m[0],m[1],10,10,VW,VH,panels,obst)) return false;
      C=[[sx+g,sy-h/2],[sx-w/2,sy-g-h],[sx-g-w,sy-h/2],[sx-w/2,sy+g],[sx+g-2,sy-g-h+2],[sx+g-2,sy+g-2],[sx-g-w+2,sy-g-h+2],[sx-g-w+2,sy+g-2]];
      ML.taken.push(m); for(i=0;i<C.length;i++) if(mlFree(C[i][0],C[i][1],w,h,VW,VH,panels,obst)){ it.mrect=m; return mlTake(it,C[i][0],C[i][1],false); } ML.taken.pop(); return false; }
    if(it.mode==="counter"){ var pb=it.hq?12:5; it.ox=5+20; it.oy=13+(h-13-pb)/2+14; C=[[sx-it.ox,sy-cl-it.oy]]; }
    else { it.ox=w/2; it.oy=h; C=[[sx-w/2,sy-cl-h],[sx+2,sy-cl-h],[sx-2-w,sy-cl-h],[sx+cl+2,sy-h/2],[sx-cl-2-w,sy-h/2],[sx-w/2,sy+cl],[sx+2,sy+cl],[sx-2-w,sy+cl]]; }
    for(i=0;i<C.length;i++) if(mlFree(C[i][0],C[i][1],w,h,VW,VH,panels,obst)) return mlTake(it,C[i][0],C[i][1],i>0&&it.mode==="counter");
    return false;
  }
  function placeStab(it,VW,VH,panels,obst){
    if(STAB==="none") return orig.place(it,VW,VH,panels,obst);
    if((STAB==="anchor2"||STAB==="anchor2+band")&&MOVING&&!it.keep){
      if(it._wasOn) return prevTry(it,VW,VH,panels,obst)||localTry(it,VW,VH,panels,obst);   /* held, else beside its anchor, else hidden */
      if(mf%EVERY!==0) return false;
      var ok=orig.place(it,VW,VH,panels,obst);
      if(ok){ it._room2=(it._room2||0)+1; if(it._room2<2){ ML.taken.pop(); if(it.mode==="place") ML.taken.pop(); it.state=""; it.rect=null; return false; } } else it._room2=0;
      return ok; }
    if(STAB==="anchor"&&MOVING&&!it.keep){ if(it._wasOn) return prevTry(it,VW,VH,panels,obst);   /* held, or hidden: never moved */
      return (mf%EVERY===0)?orig.place(it,VW,VH,panels,obst):false; }
    if(STAB==="persist+hold"&&!it.keep&&!it._wasOn){   /* shown again only after HOLD successive frames with room */
      var ok=orig.place(it,VW,VH,panels,obst);
      if(ok){ it._room=(it._room||0)+1; if(it._room<HOLD){ ML.taken.pop(); if(it.mode==="place") ML.taken.pop(); it.state=""; it.rect=null; return false; } }
      else it._room=0;
      return ok; }
    return prevTry(it,VW,VH,panels,obst)||orig.place(it,VW,VH,panels,obst);
  }
  /* after each pass: what each item held, for the next */
  function remember(){ for(var k in ML.items){ var it=ML.items[k], on=it.state==="on"&&it.rect&&it.eFrame===ML.frame;
    it._wasOn=on; it._prev=on?{dx:it.rect[0]-it.sx, dy:it.rect[1]-it.sy, lead:it.lead, mode:it.mode, w:it.w, h:it.h}:null; if(!on&&it.state!=="dropped") it._room=0; } }
  /* freeze: while moving, every drawn item keeps its box against its anchor; an item not drawn stays hidden */
  function layoutFrozen(){
    var t0=performance.now(), VW=renderer.domElement.clientWidth||innerWidth, VH=renderer.domElement.clientHeight||innerHeight; camera.updateMatrixWorld(); ML.frame++;
    var list=mlCollect(), panels=mlPanels(), keep={};
    list.forEach(function(it){ keep[it.key]=1; _mlV.copy(it.world).applyMatrix4(camera.matrixWorldInverse); var depth=-_mlV.z; _mlW.copy(it.world).project(camera);
      var off=depth<=camera.near||Math.abs(_mlW.x)>1||Math.abs(_mlW.y)>1; it.sx=(_mlW.x*0.5+0.5)*VW; it.sy=(-_mlW.y*0.5+0.5)*VH;
      var under=false; for(var p=0;p<panels.length;p++){ var q=panels[p]; if(it.sx>=q[0]&&it.sx<=q[2]&&it.sy>=q[1]&&it.sy<=q[3]){ under=true; break; } }
      if(off||under||!it._prev){ it.state=off?"offscreen":under?"panel":"dropped"; it.el.style.display="none"; it.disp=false; it.eFrame=ML.frame; return; }
      var x=it.sx+it._prev.dx, y=it.sy+it._prev.dy; it.rect=[x,y,x+it.w,y+it.h]; it.state="on"; it.eFrame=ML.frame;
      it.el.style.transform="translate("+Math.round(x)+"px,"+Math.round(y)+"px)"; });
    ML.stats.ms=performance.now()-t0;
  }
  window.mlPlaceItem=placeStab;
  window.mlCollect=function(){ var l=orig.collect(); S._list=l; return l; };
  window.mlLayout=function(){ if(STAB==="freeze"&&FROZEN){ layoutFrozen(); return; } orig.layout(); remember(); };
  /* the level-of-detail band (persist+hold): updateVisibility's distance switches see a distance held inside its band */
  var lodMem={d:null};
  window.updateVisibility=function(){
    if(STAB!=="persist+hold"&&STAB!=="anchor2+band") return orig.upd();
    /* viewDist is read once per pass for every switch (wantCorps 250, showBde 165, the name ranges 170/220/300) and viewDistTo for ML_FULL_DIST 70:
       the band is applied by holding the distance the switches read until it has moved 8% from the last one they acted on */
    if(!MOVING) lodMem.d=null;   /* at rest the switches read the true distance: the band holds only while the view moves */
    var d=viewDist(); if(lodMem.d===null||Math.abs(d-lodMem.d)/lodMem.d>BAND) lodMem.d=d;
    var vd=window.viewDist; window.viewDist=function(){ return lodMem.d; };
    try{ orig.upd(); } finally { window.viewDist=vd; }
  };
  S.stab=function(s){ STAB=s; FROZEN=false; lodMem.d=null; for(var k in ML.items){ var it=ML.items[k]; it._prev=null; it._wasOn=false; it._room=0; it._room2=0; } };
  S.uninstall=function(){ window.mlPlaceItem=orig.place; window.mlLayout=orig.layout; window.updateVisibility=orig.upd; window.mlCollect=orig.collect; };
  /* ---- one frame: the state pass and the map layer, as loop() runs them, without the WebGL draw ---- */
  function frame(){ updateVisibility(); syncViewOffset(true); camera.updateMatrixWorld(); mlLayout(); }
  /* every item the layer collected this frame, with its state (offscreen, panel, occluded, dropped, on) */
  function snap(){ var o={}; (S._list||[]).forEach(function(it){ var st=it.eFrame===ML.frame?it.state:(it.state==="offscreen"||it.state==="panel"?it.state:"offscreen");
      o[it.key]={st:st, x:it.rect?it.rect[0]:0, y:it.rect?it.rect[1]:0, w:it.w, h:it.h, sx:it.sx, sy:it.sy, cat:it.cat, keep:!!it.keep, ck:it.ck}; });
    return {items:o, ms:ML.stats.ms, dropped:ML.stats.dropped, placed:ML.stats.placed}; }
  /* ---- the motions ---- */
  var V3=THREE.Vector3;
  function centre(){ var fr=mode==="staff"?MAPCAM.freeRect():landFreeRect(); return [(fr[0]+fr[2])/2,(fr[1]+fr[3])/2]; }
  S.run=function(kind,n,amt){
    var frames=[], c=centre(), arc=null, pa=null, pb=null, grabbed=false;
    FROZEN=false; for(var w=0;w<HOLD+2;w++) frame();   /* the view at rest long enough for a stabiliser's memory to settle, as a visitor's view has */
    frames.push(snap());   /* the view at rest, before the motion */
    if(kind==="glide"){
      if(mode==="staff"){ var s0=MAPCAM.state(), W0=W(210,362); var tgt=amt==="sokolnitz"?{x:W0[0],z:W0[1],wpp:0.09}:s0;
        pa={x:s0.x,z:s0.z,w:Math.log(s0.wpp)}; pb={x:tgt.x,z:tgt.z,w:Math.log(tgt.wpp)}; }
      else { var v=presetFrame(VANTAGE[amt]); arc=setupArc(landCam.position,orbitTarget,new V3(v[0],v[1],v[2]),new V3(v[3],v[4],v[5])); } }
    if(kind==="play"){ stopPlay(); setClock(540,{instant:true,force:true,camera:false}); if(mode!=="staff"){ freeCam=false; } setSpeed(amt); playing=true; DWELL.expect=null; dwellReset(); FOLLOW.T=null;
      for(var w2=0;w2<HOLD+2;w2++) frame(); frames[0]=snap(); }
    for(var i=1;i<=n;i++){
      FROZEN=(STAB==="freeze"); MOVING=true; mf=i;
      if(kind==="pan"){ if(mode==="staff") MAPCAM.pan(amt,0); else { if(!grabbed){ grabbed=LANDCAM.panStart(c[0],c[1]); } LANDCAM.panTo(c[0]+amt*i,c[1]); } }
      else if(kind==="zoom"){ var k=i<=n/2?1/amt:amt; if(mode==="staff") MAPCAM.zoomAt(c[0],c[1],k); else LANDCAM.zoomAt(c[0],c[1],k); }
      else if(kind==="orbit") LANDCAM.orbit(amt,0);
      else if(kind==="glide"){ var e=easeInOut(i/n);
        if(mode==="staff") MAPCAM.restore({x:pa.x+(pb.x-pa.x)*e, z:pa.z+(pb.z-pa.z)*e, wpp:Math.exp(pa.w+(pb.w-pa.w)*e), moved:false});
        else applyArc(arc,e,0.12); }
      else if(kind==="play"){ FROZEN=false; tickClock(1000/30); followStep(1000/30); }
      frame(); frames.push(snap());
    }
    if(kind==="pan"&&grabbed) LANDCAM.panEnd();
    if(kind==="play"){ stopPlay(); }
    FROZEN=false; MOVING=false; frame(); frames.push(snap());   /* the frame at rest after the motion: solved again */
    return S.measure(frames,kind);
  };
  S.measure=function(F,kind){
    var M={frames:F.length, jumps:0, pops:0, lod:0, flicker:0, overlapFrames:0, overlapPairs:0, itemFrames:0, contentSwaps:0, ms:[], drawn:[], dropped:[], jumpItems:{}, popItems:{}, restJumps:0, restPops:0, jumpCats:{}, popCats:{}, lodKeys:{}};
    var hist={};
    for(var f=0;f<F.length;f++){ var A=F[f].items, keys=Object.keys(A); M.ms.push(F[f].ms); var on=keys.filter(function(k){ return A[k].st==="on"; });
      M.drawn.push(on.length); M.dropped.push(F[f].dropped);
      /* overlaps among drawn boxes (the layer's rule: none) */
      var ov=0; for(var a=0;a<on.length;a++) for(var b=a+1;b<on.length;b++){ var p=A[on[a]], q=A[on[b]]; if(p.x<q.x+q.w-1&&q.x<p.x+p.w-1&&p.y<q.y+q.h-1&&q.y<p.y+p.h-1) ov++; }
      if(ov){ M.overlapFrames++; M.overlapPairs+=ov; }
      keys.forEach(function(k){ var h=hist[k]||(hist[k]=[]); h[f]=A[k].st==="on"?1:0; });
      if(!f) continue;
      var P=F[f-1].items, last=(f===F.length-1);
      var inView=function(o){ return o&&o.st!=="offscreen"&&o.st!=="panel"; };
      keys.concat(Object.keys(P)).filter(function(k,i,arr){ return arr.indexOf(k)===i; }).forEach(function(k){
        var a=P[k], b=A[k];
        if(!!a!==!!b){ if(inView(a)||inView(b)){ M.lod++; M.lodKeys[k]=(M.lodKeys[k]||0)+1; } return; }
        if(!inView(a)||!inView(b)) return;
        M.itemFrames++;
        var aOn=a.st==="on", bOn=b.st==="on";
        if(aOn&&bOn){ var dx=(b.x-b.sx)-(a.x-a.sx), dy=(b.y-b.sy)-(a.y-a.sy); if(Math.hypot(dx,dy)>3){ M.jumps++; M.jumpItems[k]=(M.jumpItems[k]||0)+1; M.jumpCats[b.cat]=(M.jumpCats[b.cat]||0)+1; if(last) M.restJumps++; }
          if(a.ck!==b.ck) M.contentSwaps++; }
        else if(aOn!==bOn){ M.pops++; M.popItems[k]=(M.popItems[k]||0)+1; M.popCats[b.cat]=(M.popCats[b.cat]||0)+1; if(last) M.restPops++; }
      });
    }
    Object.keys(hist).forEach(function(k){ var h=hist[k]; for(var i=0;i<h.length;i++){ if(h[i]!==1) continue; for(var j=i+1;j<Math.min(h.length,i+11);j++){ if(h[j]===0){ for(var m=j+1;m<Math.min(h.length,i+11);m++){ if(h[m]===1){ M.flicker++; i=m; break; } } break; } } } });
    var ms=M.ms.slice(1,-1).sort(function(a,b){ return a-b; });
    M.msMed=+ms[Math.floor(ms.length/2)].toFixed(2); M.msP95=+ms[Math.floor(ms.length*0.95)].toFixed(2); M.msMax=+ms[ms.length-1].toFixed(2);
    M.drawnMed=M.drawn.slice().sort(function(a,b){ return a-b; })[Math.floor(M.drawn.length/2)];
    M.droppedMax=Math.max.apply(null,M.dropped); M.droppedStart=M.dropped[0]; M.droppedEnd=M.dropped[M.dropped.length-1];
    M.jumpsPer100=M.itemFrames?+(100*M.jumps/M.itemFrames).toFixed(2):0; M.popsPer100=M.itemFrames?+(100*M.pops/M.itemFrames).toFixed(2):0;
    M.jumpItems=Object.keys(M.jumpItems).length; M.popItems=Object.keys(M.popItems).length;
    M.lodKeys=Object.keys(M.lodKeys).sort(function(a,b){ return M.lodKeys[b]-M.lodKeys[a]; }).slice(0,12).map(function(k){ return k+"x"+M.lodKeys[k]; });
    delete M.ms; delete M.drawn; delete M.dropped;
    return M;
  };
  window.__s8lm=S; return true;
};

(async()=>{
  const browser=await L.launch();
  const res={note:"software WebGL page; the layout is CPU work in the page (no WebGL frame drawn); 30 fps frames", build:null, runs:[]};
  const crypto=require("crypto"); res.build=crypto.createHash("md5").update(fs.readFileSync(path.join(L.ROOT,"austerlitz-command-map.html"))).digest("hex");
  let page=null, cur=null;
  for(const m of MOTIONS){
    const [id,view,kind,n,amt]=m; if(ONLY&&!ONLY.includes(id)) continue;
    for(const stab of STABS){
      if(!page||cur!==view){ if(page) await page.close(); page=await L.open(browser,VIEWS[view].viewport); await L.inject(page,PROBE); cur=view; }
      await page.evaluate(()=>{ __s8lm.uninstall(); });
      await L.applyCase(page,VIEWS[view]);
      await L.inject(page,PROBE);
      await page.evaluate(s=>__s8lm.stab(s),stab);
      const r=await page.evaluate(([k,n,a])=>__s8lm.run(k,n,a),[kind,n,amt]);
      await page.evaluate(()=>__s8lm.uninstall());
      r.id=id; r.view=view; r.kind=kind; r.stab=stab; res.runs.push(r);
      console.log(id.padEnd(13),stab.padEnd(13),"jumps",String(r.jumps).padStart(4),"("+r.jumpsPer100+"/100, "+r.jumpItems+" items)","pops",String(r.pops).padStart(4),"("+r.popsPer100+"/100)","lod",String(r.lod).padStart(3),
        "flicker",String(r.flicker).padStart(3),"overlap frames",r.overlapFrames,"drawn~",r.drawnMed,"dropped",r.droppedStart+"->"+r.droppedEnd,"(max "+r.droppedMax+")","ms med/p95/max",r.msMed,r.msP95,r.msMax);
    }
  }
  if(page) await page.close(); await browser.close();
  if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
