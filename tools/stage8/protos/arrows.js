/* Stage 8 Part A (docs/STAGE8_SPEC.md section 7.1): the movement arrows' weight on screen, prototyped in the live page only. The build draws
   every arrow as a draped ribbon of fixed width in world units (attack 2.0-2.6, counter 1.8-2.3, move 1.3-1.6, its casing 1.34 times; heads
   7.5 wide and 6.5 long; app.js buildArrow), over everything (depthTest false), at 95% of each material's opacity: in the Overview a thin line,
   in a close or low view a band 60 px and more across with a head larger than a battalion. The prototypes rebuild the current phase's
   overlays (rebuildOverlays, the build's own) through a wrapped drapedRibbon, so the arrows' paths, kinds, heads, colours, labels and draw-on
   are the build's; only the drawn width, the depth test and the opacity change:
   - a-cap:  each ribbon's width capped so its casing is at most MAX_PX across at its middle (the head scaled with it), never widened;
   - a-soft: a-cap, the fills at OP times their opacity, and the ribbons depth-tested (a hill in front hides the part behind it, as at the eye
             level; they are lifted 2.4 units, above the figures' heads, so the figures do not cut them);
   - a-calm: a-soft, and the event glyphs and objective markers capped at GLYPH_PX on screen (the build's SYM_MAX_PX, 192) instead.
   Design values for the prototype: MAX_PX 16, OP 0.62, GLYPH_PX 64. */
"use strict";
const inPage=function(){
  if(window.__a8) return true;
  window.__p8=window.__p8||{};
  var A={orig:null, kind:null, sym0:null}, MAX_PX=16, OP=0.62, GLYPH_PX=64;
  function wrapped(mapPts,o,add,mats){
    var wp=mapPts.map(function(p){ return o.world?p:W(p[0],p[1]); }), mid=wp[Math.floor(wp.length/2)], P=new THREE.Vector3(mid[0],groundY(mid[0],mid[1])+(o.lift||0),mid[1]);
    /* the scale at the ribbon's middle; a middle behind the eye (worldPerPx negative there) is left uncapped: it is not where the ribbon is seen */
    var wpp=worldPerPx(P), wmax=Math.max(o.w0||0,o.w1||0)*1.34, k=(wmax>0&&wpp>0&&isFinite(wpp))?Math.min(1,MAX_PX*wpp/wmax):1;
    var o2=Object.assign({},o,{w0:o.w0*k, w1:o.w1*k}); if(o.head){ o2.headW=o.headW*k; o2.headL=o.headL*k; }
    var r=A.orig(mapPts,o2,add,mats);
    if(A.kind!=="a-cap") (r.layers||[]).forEach(function(lay){ [lay.shaft,lay.head].forEach(function(m){ if(!m) return; m.material.depthTest=true; m.material.userData.op=(m.material.userData.op||1)*OP; m.material.needsUpdate=true; }); });
    return r;
  }
  function install(kind){
    if(A.kind) uninstall(); A.kind=kind; A.orig=window.drapedRibbon; window.drapedRibbon=wrapped;
    if(kind==="a-calm"){ A.sym0=SYM_MAX_PX; SYM_MAX_PX=GLYPH_PX; }
    rebuildOverlays(curPhase,true); updateVisibility(); requestRender(3); return {kind:kind};
  }
  function uninstall(){ if(!A.kind) return; window.drapedRibbon=A.orig; if(A.sym0!==null){ SYM_MAX_PX=A.sym0; A.sym0=null; } A.kind=null; rebuildOverlays(curPhase,true); updateVisibility(); requestRender(3); }
  ["a-cap","a-soft","a-calm"].forEach(function(k){ window.__p8[k]={install:function(){ return install(k); }, uninstall:uninstall}; });
  /* a-rebuild: no change at all, only the build's own rebuild of the current phase's overlays (rebuildOverlays), as every prototype above
     does on install and on removal: what the build itself makes of a rebuild, for comparison with the frames after the prototypes */
  window.__p8["a-rebuild"]={install:function(){ rebuildOverlays(curPhase,true); updateVisibility(); requestRender(3); return {kind:"a-rebuild"}; }, uninstall:function(){}};
  window.__a8=A; return true;
};
module.exports={inPage, ids:{"a-cap":{},"a-soft":{},"a-calm":{},"a-rebuild":{}}};
