/* Stage 8 Part A (docs/STAGE8_SPEC.md section 3): the map layer's stabilisers as installable prototypes, for the recordings and stills (the
   same rules tools/stage8/label-motion.js measures; see its header). Each overrides the app's own mlPlaceItem and mlLayout in the live page
   and is removed on uninstall. The view's motion (a camera move, a glide, the clock playing) is told to the prototype by the probe that
   drives it (window.__l8.moving); a real build would read it from its own state (tween, playing, the input hold).
   - l-persist: each item first tries the place it held in the last drawn frame (its box against its anchor), then the build's own search;
   - l-anchor:  while the view moves, a drawn item keeps its place against its anchor while that place is free, else it is hidden (never
                moved); an item not drawn is searched for only every EVERY_MS (333 ms) of motion; at rest the build's full solve with persist;
   - l-anchor2: l-anchor, but a held item whose place is blocked first tries the eight places hugging its own anchor before it is hidden, and a
                hidden item is shown again only after two re-placement passes with room;
   - l-band:    l-anchor2, and, while the view moves, the level-of-detail switches' distance (viewDist) held until it has moved BAND
                (hysteresis); released at rest;
   - l-fade:    l-band, and items appearing or leaving fade over FADE_MS of real time instead of popping (a leaving item drawn at its last
                place, under the others, taking no pointer); not under reduced motion. */
"use strict";
const inPage=function(){
  if(window.__l8) return true;
  window.__p8=window.__p8||{};
  var S={moving:false, frame:0, EVERY_MS:333, acc:0, pass:true, last:0, BAND:0.08, FADE_MS:180}, orig=null, mode8=null, lod={d:null}, fades={};
  function prevTry(it,VW,VH,panels,obst){
    var p=it._prev; if(!p||p.mode!==it.mode||!(it.w>0&&it.h>0)) return false;
    var x0=it.sx+p.dx, y0=it.sy+p.dy;
    if(it.mode==="place"){ var m=[it.sx-5,it.sy-5,it.sx+5,it.sy+5]; if(!mlFree(m[0],m[1],10,10,VW,VH,panels,obst)) return false;
      ML.taken.push(m); if(mlFree(x0,y0,it.w,it.h,VW,VH,panels,obst)){ it.mrect=m; return mlTake(it,x0,y0,false); } ML.taken.pop(); return false; }
    if(it.mode==="counter"){ var pb=it.hq?12:5; it.ox=5+20; it.oy=13+(it.h-13-pb)/2+14; } else { it.ox=it.w/2; it.oy=it.h; }
    if(Math.abs(p.w-it.w)>2||Math.abs(p.h-it.h)>2) return false;
    return mlFree(x0,y0,it.w,it.h,VW,VH,panels,obst)?mlTake(it,x0,y0,p.lead):false;
  }
  /* the places hugging the item's own anchor (mlPlaceItem's first candidates; no rings, no rows) */
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
  function place(it,VW,VH,panels,obst){
    if(mode8==="l-anchor"&&S.moving&&!it.keep){ if(it._wasOn) return prevTry(it,VW,VH,panels,obst); return S.pass?orig.place(it,VW,VH,panels,obst):false; }
    if(mode8!=="l-persist"&&S.moving&&!it.keep){   /* l-anchor2, l-band, l-fade: held, else beside its anchor, else hidden; shown again after two passes with room */
      if(it._wasOn) return prevTry(it,VW,VH,panels,obst)||localTry(it,VW,VH,panels,obst);
      if(!S.pass) return false;
      var ok=orig.place(it,VW,VH,panels,obst);
      if(ok){ it._room2=(it._room2||0)+1; if(it._room2<2){ ML.taken.pop(); if(it.mode==="place") ML.taken.pop(); it.state=""; it.rect=null; return false; } } else it._room2=0;
      return ok; }
    return prevTry(it,VW,VH,panels,obst)||orig.place(it,VW,VH,panels,obst);
  }
  function layout(){
    var now=performance.now(), step=S.frameMs||(S.last?now-S.last:16); S.last=now;
    S.frame++; S.acc+=step; S.pass=!S.moving||S.acc>=S.EVERY_MS; if(S.pass) S.acc=0;   /* the re-placement pass: every EVERY_MS of the view's motion */
    orig.layout();
    for(var k in ML.items){ var it=ML.items[k], on=it.state==="on"&&it.rect&&it.eFrame===ML.frame;
      if(mode8==="l-fade"&&!RM){ var f=fades[k]||(fades[k]={a:on?1:0,last:null});
        var dt=S.frameMs||(f.t?(now-f.t):16);   /* a recording steps its fades by its own frame time (S.frameMs) */
        if(on){ f.last=it.rect.slice(); f.a=Math.min(1,f.a+dt/S.FADE_MS); it.el.style.opacity=String(f.a.toFixed(2)); it.el.style.zIndex=""; it.el.style.pointerEvents=""; }
        else if(f.last&&f.a>0){ f.a=Math.max(0,f.a-dt/S.FADE_MS);
          if(f.a>0){ it.el.style.display=""; it.el.style.transform="translate("+Math.round(f.last[0])+"px,"+Math.round(f.last[1])+"px)"; it.el.style.opacity=String(f.a.toFixed(2)); it.el.style.zIndex="-1"; it.el.style.pointerEvents="none"; it.disp=true; }
          else { it.el.style.display="none"; it.disp=false; it.el.style.opacity=""; it.el.style.zIndex=""; it.el.style.pointerEvents=""; f.last=null; } }
        f.t=now; }
      it._wasOn=on; it._prev=on?{dx:it.rect[0]-it.sx, dy:it.rect[1]-it.sy, lead:it.lead, mode:it.mode, w:it.w, h:it.h}:null; }
  }
  function upd(){
    if(mode8!=="l-band"&&mode8!=="l-fade") return orig.upd();
    if(!S.moving) lod.d=null;   /* at rest the switches read the true distance: the band holds only while the view moves */
    var d=viewDist(); if(lod.d===null||Math.abs(d-lod.d)/lod.d>S.BAND) lod.d=d;
    var vd=window.viewDist; window.viewDist=function(){ return lod.d; };
    try{ orig.upd(); } finally { window.viewDist=vd; }
  }
  function install(m){ if(orig) uninstall(); orig={place:mlPlaceItem, layout:mlLayout, upd:updateVisibility}; mode8=m; lod.d=null; fades={};
    window.mlPlaceItem=place; window.mlLayout=layout; window.updateVisibility=upd; requestRender(3); return {mode:m}; }
  function uninstall(){ if(!orig) return; window.mlPlaceItem=orig.place; window.mlLayout=orig.layout; window.updateVisibility=orig.upd; orig=null; mode8=null;
    for(var k in ML.items){ var it=ML.items[k]; it._prev=null; it._wasOn=false; it.el.style.zIndex=""; it.el.style.pointerEvents=""; } requestRender(3); }
  ["l-persist","l-anchor","l-anchor2","l-band","l-fade"].forEach(function(k){ window.__p8[k]={install:function(){ return install(k); }, uninstall:uninstall}; });
  window.__l8=S; return true;
};
module.exports={inPage, ids:{"l-persist":{},"l-anchor":{},"l-anchor2":{},"l-band":{},"l-fade":{}}};
