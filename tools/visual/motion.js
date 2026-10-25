/* Stage 8, implementation PR 8C (decision 240 (a); docs/STAGE8_SPEC.md sections 3.2, 3.5 and 15): the map layer in motion, driven through the
   app's own frame and its own input, and measured. Shared by tools/stage8/label-motion.js (--app, the 16 motions on any build, for the before
   and after), tools/stage8/record.js (--app clips) and the harness's motion block (tools/visual/harness.js, check:visual).
   In the page (inPage, injected by the caller): window.__md, a driver that stops the app's animation loop and runs it one frame at a time on
   a clock of its own (performance.now answers the driver's time, advanced a frame's length at each step), so that every rule that reads the
   wall clock (the input hold, the tweens and glides, Play, the stabiliser's re-placement passes and fades) runs as it would at that frame
   rate, deterministically and whatever the machine's speed. The motion reaches the app as a visitor's does: pointer and wheel events on the
   canvas (they set the input hold and run the app's own drag, wheel and orbit handlers), a vantage glide or the paper map's eased move (a
   tween), Play (the app's own tickClock and Follow). The WebGL draw can be skipped (gl: false; the layout reads nothing it draws), so a
   motion's frames take milliseconds; the recorder draws them. Nothing is set that the app does not set itself: no harness switch.
   After each frame, snap() reads every item the layer collected that frame: its state (on, dropped, held, occluded, off screen, under a
   panel), its box and its anchor on the screen, its kind and formation, a remnant fading out where it was drawn.
   In node (measure): Part A's measures over a run's snaps (section 3.2: a jump is an item drawn in two successive frames whose box moved more
   than 3 px against its own anchor; a pop an item in view in both that went from drawn to not drawn or back; a level-of-detail switch an item
   entering or leaving the layer in view; a flicker an item drawn, gone and drawn again within 10 frames; an overlap two drawn boxes
   overlapping), and the tracking of formations a visitor follows: for each formation's counter or name, the frames it is drawn, those it is
   off the screen or under a panel, behind the ground, out of the layer (its level of detail), and those it is in view but not drawn because
   the layout gave it no room (placement): the longest such disappearance, and how long it stays hidden once the layout has room for it again
   (room: the full search would place it in that frame, tried against the frame's own boxes, panels and symbols and undone); its jumps, the
   times its box changes side of its anchor, and its swaps with a neighbour (two drawn formations within 150 px whose boxes stand in the
   opposite order to their anchors, newly). Measurement only. */
"use strict";
const inPage=function(){
  if(window.__md) return true;
  var realNow=performance.now.bind(performance), realRaf=window.requestAnimationFrame.bind(window), realRender=null, T=0, on=false, list=[], origCollect=null, origLayout=null, ms=[], broken=false;
  var D={frameMs:1000/30, frames:0, gl:true};
  D.start=function(o){ o=o||{}; if(on) return D; on=true; D.gl=o.gl!==false; D.frameMs=o.frameMs||1000/30; T=realNow(); D.frames=0; ms=[];
    broken=false; window.requestAnimationFrame=function(cb){ if(cb===window.loop){ broken=true; return 0; } return realRaf(cb); };
    performance.now=function(){ return T; };
    if(!D.gl&&!realRender){ realRender=renderer.render; renderer.render=function(){}; }
    if(!origCollect){ origCollect=window.mlCollect; window.mlCollect=function(){ var l=origCollect.apply(this,arguments); list=l; return l; }; }
    if(!origLayout){ origLayout=window.mlLayout; window.mlLayout=function(){ var a=realNow(); var r=origLayout.apply(this,arguments); ms.push(realNow()-a); return r; }; }
    return D; };
  D.stop=function(){ if(!on) return; on=false; performance.now=realNow; window.requestAnimationFrame=realRaf;
    if(realRender){ renderer.render=realRender; realRender=null; }
    if(origCollect){ window.mlCollect=origCollect; origCollect=null; } if(origLayout){ window.mlLayout=origLayout; origLayout=null; }
    requestRender(3); if(broken) realRaf(window.loop); };   /* the app's own loop goes on: its pending frame, or, if that came and stopped, a new one */
  /* one frame of the app: its own loop, at the driver's clock */
  D.frame=function(n){ for(var i=0;i<(n||1);i++){ T+=D.frameMs; D.frames++; window.loop(); } return D; };
  D.now=function(){ return T; };
  D.layerMs=function(){ var r=ms; ms=[]; return r; };
  /* a visitor's input on the canvas, through the window's capture listeners (the input hold) and the app's own handlers */
  var el=function(){ return renderer.domElement; };
  D.ptype="mouse";   /* "touch": a finger's pointer (a phone's pan) */
  function pev(t,x,y,b,btn){ return new PointerEvent(t,{pointerId:9,isPrimary:true,pointerType:D.ptype,clientX:x,clientY:y,buttons:b,button:btn,bubbles:true,cancelable:true}); }
  D.down=function(x,y,btn){ var c=el(), spc=c.setPointerCapture; c.setPointerCapture=function(){}; c.dispatchEvent(pev("pointerdown",x,y,btn===2?2:1,btn||0)); c.setPointerCapture=spc; };
  D.move=function(x,y,btn){ el().dispatchEvent(pev("pointermove",x,y,btn===2?2:1,btn||0)); };
  D.up=function(x,y,btn){ window.dispatchEvent(pev("pointerup",x,y,0,btn||0)); };
  D.wheel=function(x,y,dy){ el().dispatchEvent(new WheelEvent("wheel",{deltaY:dy,clientX:x,clientY:y,bubbles:true,cancelable:true})); };
  D.centre=function(){ var fr=mode==="staff"?MAPCAM.freeRect():landFreeRect(); return [Math.round((fr[0]+fr[2])/2),Math.round((fr[1]+fr[3])/2)]; };
  /* could the full search place this dropped item now (against the frame's boxes, panels and symbols)? Tried and undone */
  function roomFor(it,VW,VH,panels,obst){
    var keep=[it.rect,it.lead,it.state,it.ox,it.oy,it.mrect,it.wrapped], n=ML.taken.length, ok=false;
    try{ ok=!!mlPlaceItem(it,VW,VH,panels,obst); } catch(e){ ok=false; }
    ML.taken.length=n; it.rect=keep[0]; it.lead=keep[1]; it.state=keep[2]; it.ox=keep[3]; it.oy=keep[4]; it.mrect=keep[5];
    return ok; }
  /* the layer as the frame left it */
  D.snap=function(o){ o=o||{};
    var VW=renderer.domElement.clientWidth||innerWidth, VH=renderer.domElement.clientHeight||innerHeight, out={}, panels=null, obst=null;
    camera.updateMatrixWorld();
    (list||[]).forEach(function(it){
      var inF=it.eFrame===ML.frame, st=inF?(it.held?"held":it.state):(it.state==="panel"?"panel":"offscreen");
      if(!inF&&it.state!=="panel") st="offscreen";
      var r={st:st, x:it.rect?+it.rect[0].toFixed(1):0, y:it.rect?+it.rect[1].toFixed(1):0, w:it.w, h:it.h, sx:+(+it.sx||0).toFixed(1), sy:+(+it.sy||0).toFixed(1),
        cat:it.cat, keep:!!it.keep, fid:it.fid||null, ck:it.ck, rem:!!it.rem, fa:it.fa===undefined?null:+(+it.fa).toFixed(2), far:!!it.farC,
        unk:!!(it.fid&&typeof readHidden==="function"&&readHidden(it.fid))};   /* its formation not known to the reading */
      if(o.room&&(st==="dropped"||st==="held")){ if(!panels){ panels=mlPanels(); obst=mlObstacles(VW,VH); } r.room=roomFor(it,VW,VH,panels,obst); }
      out[it.key]=r; });
    var M=typeof MLS!=="undefined"?MLS:null;
    return {items:out, t:T, frame:ML.frame, dropped:ML.stats.dropped, placed:ML.stats.placed, held:ML.stats.held||0, state:typeof DEV!=="undefined"?DEV.state:null,
      mls:M?{moving:M.moving, fresh:M.fresh, from:M.fromMotion, pass:M.pass, fade:M.fadeOn, fading:M.stats.fading, far:M.stats.far}:null,
      src:{tween:!!tween, playing:!!playing, hold:+(T-lastInput).toFixed(0), need:needFrames, settling:!!settling, panel:+(panelMoveUntil-T).toFixed(0)},
      remnants:(function(){ var n=0, bad=[]; for(var k in ML.items){ var it=ML.items[k], e=it.el; if(!e.classList.contains("ml-fading")) continue; n++;
        var cs=getComputedStyle(e); if(cs.pointerEvents!=="none"||!(+cs.zIndex<0)||e.classList.contains("on")) bad.push(k); } return {n:n, bad:bad}; })(),
      nodes:ML.root?ML.root.querySelectorAll(".ml-item").length:0};
  };
  window.__md=D; return true;
};

/* ---- in node: the measures over a run's snaps ---- */
const OV=(p,q)=>p.x<q.x+q.w-1&&q.x<p.x+p.w-1&&p.y<q.y+q.h-1&&q.y<p.y+p.h-1;
function measure(F,o){
  o=o||{}; const frameMs=o.frameMs||1000/30, restFrom=o.restFrom==null?F.length:o.restFrom, track=o.track||[];
  const M={frames:F.length, jumps:0, pops:0, lod:0, flicker:0, overlapFrames:0, overlapPairs:0, itemFrames:0, contentSwaps:0, held:0, heldFrames:0,
    keepHidden:0, keepHiddenKeys:[], remnantBad:0, jumpCats:{}, popCats:{}, restJumps:0, restPops:0, keepJumps:0, sizeJumps:0, unknownDrawn:0, drawn:[], idle:null, moving:0};
  const hist={}, inView=s=>s&&s.st!=="offscreen"&&s.st!=="panel";
  for(let f=0;f<F.length;f++){
    const A=F[f].items, keys=Object.keys(A), on=keys.filter(k=>A[k].st==="on");
    M.drawn.push(on.length); if(F[f].mls&&F[f].mls.moving) M.moving++;
    let ov=0; for(let a=0;a<on.length;a++) for(let b=a+1;b<on.length;b++) if(OV(A[on[a]],A[on[b]])) ov++;
    if(ov){ M.overlapFrames++; M.overlapPairs+=ov; }
    M.remnantBad+=F[f].remnants?F[f].remnants.bad.length:0;
    keys.forEach(k=>{ const s=A[k]; (hist[k]||(hist[k]=[]))[f]=s.st==="on"?1:0;
      if(s.st==="held") M.heldFrames++;
      if(s.unk&&(s.st==="on"||s.rem)) M.unknownDrawn++;   /* drawn or fading, though the reading does not know its formation */
      if(s.keep&&inView(s)&&s.st!=="on"&&s.st!=="occluded"){ M.keepHidden++; if(M.keepHiddenKeys.indexOf(k)<0) M.keepHiddenKeys.push(k); } });
    if(!f) continue;
    const P=F[f-1].items, rest=f>=restFrom;
    new Set(keys.concat(Object.keys(P))).forEach(k=>{ const a=P[k], b=A[k];
      if(!!a!==!!b){ if(inView(a)||inView(b)) M.lod++; return; }
      if(!inView(a)||!inView(b)) return;
      M.itemFrames++;
      const aOn=a.st==="on", bOn=b.st==="on";
      if(aOn&&bOn){ const dx=(b.x-b.sx)-(a.x-a.sx), dy=(b.y-b.sy)-(a.y-a.sy); if(Math.hypot(dx,dy)>3){ M.jumps++; M.jumpCats[b.cat]=(M.jumpCats[b.cat]||0)+1; if(rest) M.restJumps++;
          if(b.keep) M.keepJumps++; if(a.w!==b.w||a.h!==b.h) M.sizeJumps++; }   /* of them: a never-dropped item's (placed by the full search), a box whose size changed */
        if(a.ck!==b.ck) M.contentSwaps++; }
      else if(aOn!==bOn){ M.pops++; M.popCats[b.cat]=(M.popCats[b.cat]||0)+1; if(rest) M.restPops++; }
    });
  }
  Object.keys(hist).forEach(k=>{ const h=hist[k]; for(let i=0;i<h.length;i++){ if(h[i]!==1) continue;
    for(let j=i+1;j<Math.min(h.length,i+11);j++){ if(h[j]===0){ for(let m=j+1;m<Math.min(h.length,i+11);m++){ if(h[m]===1){ M.flicker++; i=m; break; } } break; } } } });
  M.drawnMed=M.drawn.slice().sort((a,b)=>a-b)[Math.floor(M.drawn.length/2)]||0;
  M.drawnSum=M.drawn.reduce((s,v)=>s+v,0);
  delete M.drawn;
  M.idle=F.length?F[F.length-1].state:null;
  M.track=tracking(F,frameMs,track);
  return M;
}
/* a formation followed through the motion: its counter (c:) or name (n:) */
function tracking(F,frameMs,ids){
  const T={all:{frames:0,on:0,offscreen:0,lod:0,terrain:0,placement:0,episodes:0,longest:0,lagMax:0,lagSum:0,lagN:0,jumps:0,sides:0,swaps:0}, by:{}};
  const keyOf=(A,id)=>A["c:"+id]?"c:"+id:A["n:"+id]?"n:"+id:null;
  const fids=new Set(); F.forEach(fr=>Object.keys(fr.items).forEach(k=>{ const s=fr.items[k]; if(s.fid&&(k.startsWith("c:")||k.startsWith("n:"))) fids.add(s.fid); }));
  const want=new Set(ids);
  const side=s=>{ const cx=s.x+s.w/2-s.sx, cy=s.y+s.h/2-s.sy; return (Math.abs(cx)<6?"c":cx>0?"r":"l")+(Math.abs(cy)<6?"m":cy>0?"b":"t"); };
  fids.forEach(id=>{
    const R={frames:F.length,on:0,offscreen:0,lod:0,terrain:0,placement:0,episodes:0,longest:0,lagMax:0,lagSum:0,lagN:0,jumps:0,sides:0,swaps:0}; let run=0, roomAt=-1, prev=null, prevF=-1;
    for(let f=0;f<F.length;f++){ const A=F[f].items, k=keyOf(A,id), s=k?A[k]:null;
      if(!s){ R.lod++; run=0; roomAt=-1; prev=null; continue; }
      if(s.st==="offscreen"||s.st==="panel"){ R.offscreen++; run=0; roomAt=-1; prev=null; continue; }
      if(s.st==="occluded"){ R.terrain++; run=0; roomAt=-1; prev=null; continue; }
      if(s.st==="on"){ R.on++;
        if(run>0){ if(roomAt>=0){ const lag=f-roomAt; R.lagMax=Math.max(R.lagMax,lag); R.lagSum+=lag; R.lagN++; } }
        run=0; roomAt=-1;
        if(prev&&prevF===f-1){ const dx=(s.x-s.sx)-(prev.x-prev.sx), dy=(s.y-s.sy)-(prev.y-prev.sy); if(Math.hypot(dx,dy)>3) R.jumps++; if(side(s)!==side(prev)) R.sides++; }
        prev=s; prevF=f; continue; }
      /* hidden by the layout: the delay counts from the frame since which the full search has had room for it in every frame */
      R.placement++; if(!run) R.episodes++; run++; R.longest=Math.max(R.longest,run); if(!s.room) roomAt=-1; else if(roomAt<0) roomAt=f; prev=null; }
    /* swaps: with each drawn neighbour within 150 px, the boxes' order across the anchors' order, newly */
    for(let f=1;f<F.length;f++){ const A=F[f].items, P=F[f-1].items, k=keyOf(A,id), s=k?A[k]:null, k0=keyOf(P,id), s0=k0?P[k0]:null;
      if(!s||!s0||s.st!=="on"||s0.st!=="on") continue;
      Object.keys(A).forEach(q=>{ if(q===k) return; const t=A[q], t0=P[q]; if(!t||!t0||t.st!=="on"||t0.st!=="on"||!t.fid) return;
        if(Math.hypot(t.sx-s.sx,t.sy-s.sy)>150) return;
        const inv=(u,v)=>{ const ax=Math.sign(v.sx-u.sx), bx=Math.sign((v.x+v.w/2)-(u.x+u.w/2)), ay=Math.sign(v.sy-u.sy), by=Math.sign((v.y+v.h/2)-(u.y+u.h/2));
          return (Math.abs(v.sx-u.sx)>8&&ax!==bx)||(Math.abs(v.sy-u.sy)>8&&ay!==by); };
        if(inv(s,t)&&!inv(s0,t0)) R.swaps++; }); }
    const inViewF=R.on+R.terrain+R.placement;
    R.visible=inViewF?+(R.on/inViewF).toFixed(3):null; R.longestMs=Math.round(R.longest*frameMs); R.lagMaxMs=Math.round(R.lagMax*frameMs); R.lagMeanMs=R.lagN?Math.round(R.lagSum/R.lagN*frameMs):0;
    if(want.has(id)) T.by[id]=R;
    const a=T.all; a.frames+=F.length; ["on","offscreen","lod","terrain","placement","episodes","jumps","sides","swaps","lagSum","lagN"].forEach(x=>a[x]+=R[x]);
    a.longest=Math.max(a.longest,R.longest); a.lagMax=Math.max(a.lagMax,R.lagMax);
  });
  const a=T.all, iv=a.on+a.terrain+a.placement; a.visible=iv?+(a.on/iv).toFixed(3):null; a.longestMs=Math.round(a.longest*frameMs); a.lagMaxMs=Math.round(a.lagMax*frameMs);
  a.lagMeanMs=a.lagN?Math.round(a.lagSum/a.lagN*frameMs):0; a.formations=fids.size;
  return T;
}
/* the 16 motions of tools/stage8/label-motion.js (Part A's, section 3.2), as a visitor drives them: [id, view, kind, frames, amount] */
const VIEWS={
  hybrid:{name:"hybrid-field", viewport:[1600,900], t:570, presentation:"study", mode:"hybrid", cam:[-195,92,156,-33,4,-2]},
  paper:{name:"paper-frame", viewport:[1600,900], t:570, presentation:"study", mode:"staff", paper:"frame", cam:[-27,272,41,-27,0,9]},
  land:{name:"land-field", viewport:[1600,900], t:570, presentation:"study", mode:"terrain", cam:[-195,92,156,-33,4,-2]},
  low:{name:"land-low", viewport:[1600,900], t:590, presentation:"study", mode:"terrain", aim:{map:[285,289], dir:[-1.0,0.13,0.18], r:70}},
  phone:{name:"phone-hybrid", viewport:[390,844], t:570, presentation:"study", mode:"hybrid", cam:[-195,92,156,-33,4,-2]}
};
const MOTIONS=[
  ["hybrid-pan","hybrid","pan",60,8], ["hybrid-zoom","hybrid","zoom",60,1.03], ["hybrid-orbit","hybrid","orbit",60,6], ["hybrid-glide","hybrid","glide",45,"plateau"], ["hybrid-play","hybrid","play",90,0.5],
  ["paper-pan","paper","pan",60,8], ["paper-zoom","paper","zoom",60,1.03], ["paper-glide","paper","glide",45,"sokolnitz"], ["paper-play","paper","play",90,0.5],
  ["land-pan","land","pan",60,8], ["land-zoom","land","zoom",60,1.03], ["land-orbit","land","orbit",60,6], ["land-play","land","play",90,0.5],
  ["low-pan","low","pan",60,8], ["low-orbit","low","orbit",60,6], ["low-zoom","low","zoom",60,1.03]
];
/* beyond Part A's 16 (Stage 8, 8C): the same motions under each headquarters' reading ("Whose eyes?", decision 92), and a finger's pan on a
   page 390 px wide (the phone layout, decisions 223-226): [id, view, kind, frames, amount, {reading, touch}] */
const EXTRA=[
  ["hybrid-pan","hybrid","pan",60,8,{reading:"fr"}], ["hybrid-pan","hybrid","pan",60,8,{reading:"al"}], ["paper-play","paper","play",90,0.5,{reading:"al"}],
  ["phone-pan","phone","pan",60,6,{touch:true}]
];
/* one motion in the page, frame by frame (the page already in its view): the input of each frame, then the app's frame, then the snap.
   pre frames at rest before (the layer's memory, as a visitor's view has it), the motion, rest frames after (the band released, the fades) */
const RUN=function(a){
  var D=window.__md, kind=a.kind, n=a.n, amt=a.amt, F=[], c=D.centre(), opt={room:!!a.room}, sel=a.select||null;
  D.start({gl:a.gl, frameMs:a.frameMs}); D.ptype=a.touch?"touch":"mouse";
  if(a.reading) setCommandView(a.reading);
  if(sel){ select("f",sel); }
  requestRender(2);   /* the layer laid out before the first snap, as a visitor's view at rest has it (render on demand draws nothing at rest) */
  if(kind==="play"){ stopPlay(); setClock(a.from||540,{instant:true,force:true,camera:false}); if(mode!=="staff"){ freeCam=false; curVantage=null; } setSpeed(amt); D.frame(a.pre||8); F.push(D.snap(opt)); togglePlay(); }   /* Follow on, as Part A's probe had it (no glide to the phase's view) */
  else { D.frame(a.pre||8); F.push(D.snap(opt)); }
  if(kind==="glide"){ if(mode==="staff"){ var w0=W(210,362); MAPCAM.glideTo(w0[0],w0[1],0.09,1500); } else flyTo(VANTAGE[amt]); }
  if(kind==="pan") D.down(c[0],c[1],0);
  if(kind==="orbit") D.down(c[0],c[1],2);
  for(var i=1;i<=n;i++){
    if(kind==="pan") D.move(c[0]+amt*i,c[1],0);
    else if(kind==="orbit") D.move(c[0]+amt*i,c[1],2);
    else if(kind==="zoom"){ if(i%3===0) D.wheel(c[0],c[1],i<=n/2?-100:100); }   /* the wheel's own step (9% a notch) every third frame: 10 in, 10 out */
    D.frame(); F.push(D.snap(opt));
  }
  if(kind==="pan") D.up(c[0]+amt*n,c[1],0);
  if(kind==="orbit") D.up(c[0]+amt*n,c[1],2);
  if(kind==="play") stopPlay();
  var restFrom=F.length;
  for(var r=0;r<(a.rest||30);r++){ D.frame(); F.push(D.snap(opt)); }
  var lm=D.layerMs(); D.stop(); D.ptype="mouse"; if(a.reading) setCommandView("none");
  return {F:F, restFrom:restFrom, ms:lm, mls:typeof MLS!=="undefined"?JSON.parse(JSON.stringify(MLS.stats)):null};
};
/* the motions real input can drive (the pointer's drag, its right-button drag and the wheel): the same frames as RUN, the input sent by the
   browser's own input pipeline (Playwright's mouse: the events a visitor's mouse makes, trusted, with their pointer capture), one frame of
   the app after each */
const REAL=["hybrid-pan","hybrid-orbit","hybrid-zoom","paper-zoom"];
async function runReal(page,a){
  const kind=a.kind, n=a.n, amt=a.amt, opt={room:!!a.room}, btn=kind==="orbit"?"right":"left";
  const c=await page.evaluate(a=>{ var D=window.__md; D.start({gl:a.gl, frameMs:a.frameMs}); if(a.select) select("f",a.select); requestRender(2);
    D.frame(a.pre||8); window.__mdF=[D.snap({room:!!a.room})]; return D.centre(); },a);
  const step=o=>page.evaluate(o=>{ var D=window.__md; D.frame(); window.__mdF.push(D.snap(o)); },o);
  await page.mouse.move(c[0],c[1]);
  if(kind==="pan"||kind==="orbit") await page.mouse.down({button:btn});
  for(let i=1;i<=n;i++){
    if(kind==="pan"||kind==="orbit") await page.mouse.move(c[0]+amt*i,c[1]);
    else if(kind==="zoom"&&i%3===0) await page.mouse.wheel(0,i<=n/2?-100:100);
    await step(opt);
  }
  if(kind==="pan"||kind==="orbit") await page.mouse.up({button:btn});
  await page.mouse.move(2,2);   /* the pointer off the map: no hover held over an item at rest */
  const restFrom=await page.evaluate(()=>window.__mdF.length);
  for(let r=0;r<(a.rest||30);r++) await step(opt);
  return page.evaluate(()=>{ var D=window.__md, F=window.__mdF; window.__mdF=null; var lm=D.layerMs(); D.stop();
    return {F:F, ms:lm, mls:typeof MLS!=="undefined"?JSON.parse(JSON.stringify(MLS.stats)):null}; }).then(r=>Object.assign(r,{restFrom:restFrom}));
}
module.exports={inPage, measure, tracking, VIEWS, MOTIONS, EXTRA, RUN, REAL, runReal};
