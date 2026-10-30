/* Stage 8, implementation PR 8H (decision 258 (b); docs/STAGE8_SPEC.md section 20.8): more places beside a counter's anchor while the view moves.
   An in-page prototype (put into the live page after it started; nothing here is in the source): while the view moves (mlPlaceItem's local
   search, the stabiliser's hold), a counter whose own place is taken tries the variant's places hugging its anchor before it is hidden; a fresh
   view (the build's full search) and the rest after motion are untouched. Each place is drawn with a leader from the anchor to the counter's
   frame foot, as a counter's places other than its first are. Variants:
   - "c4": right of the anchor, left of it, below it, and straight above it lifted clear of the first place's row;
   - "c8": c4's and the four corners (above right, above left, below right, below left).
   window.__p8h.counters.install(variant) / uninstall(). */
(function(){
  if(!window.__p8h) window.__p8h={};
  var orig=null, variant=null, stats={tried:0, placed:0};
  function places(it,cl){
    var w=it.w, h=it.h, sx=it.sx, sy=it.sy, g=4, C=[[sx+cl+g,sy-h/2],[sx-cl-g-w,sy-h/2],[sx-it.ox,sy+cl+g],[sx-it.ox,sy-cl-it.oy-h-g]];
    if(variant==="c8") C.push([sx+g,sy-cl-h-g],[sx-g-w,sy-cl-h-g],[sx+g,sy+cl+g],[sx-g-w,sy+cl+g]);
    return C;
  }
  function wrapped(it,VW,VH,panels,obst,local){
    if(orig(it,VW,VH,panels,obst,local)) return true;
    if(!local||it.mode!=="counter"||!variant) return false;
    var cl=it.acl+(it.r?it.r*it.ppw:0), C=places(it,cl); stats.tried++;
    for(var i=0;i<C.length;i++) if(mlFree(C[i][0],C[i][1],it.w,it.h,VW,VH,panels,obst)){ stats.placed++; return mlTake(it,C[i][0],C[i][1],true); }
    return false;
  }
  window.__p8h.counters={
    install:function(v){ if(!orig){ orig=mlPlaceItem; mlPlaceItem=wrapped; } variant=v; stats.tried=0; stats.placed=0; return true; },
    uninstall:function(){ if(orig){ mlPlaceItem=orig; orig=null; } variant=null; return true; },
    stats:function(){ return {variant:variant, tried:stats.tried, placed:stats.placed}; }
  };
})();
