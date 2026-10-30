/* Stage 8, implementation PR 8H (decision 255 (d); docs/STAGE8_SPEC.md section 20.9): a hierarchy for far battle information by another means
   than size. An in-page prototype (put into the live page after it started; nothing here is in the source), for review: the landscape's
   formation names (the map layer's "n:" items, battle information at t-ui, whose 12 px floor decision 16 keeps) standing beyond the far step's
   distance (8C's MLS.FAR, 1.5 times the eye's distance to its target: the same test as the far step's, mlFar, without its band) are drawn with a
   lighter plate, a dimmer ink, or both; their size, words, marks and placement unchanged. Variants (the dark theme's tokens; the paper map has
   no far names and is untouched):
   - "d-plate": the plate's alpha .62 (TOKENS.sym.plate.dark is .88): more of the ground shows through;
   - "d-ink": the ink the interface's body text (#B4AC99, --text-body) on the plate as it is;
   - "d-both": the plate at .74 and the ink the interface's text (#CABFA8, --text).
   After each layout pass the far names' inline plate and ink are set, the others' given back (mlContent sets them only when an item's content
   changes). window.__p8h.farnames.install(variant) / uninstall() / stats(). */
(function(){
  if(!window.__p8h) window.__p8h={};
  var V={"d-plate":{plate:"rgba(10,14,18,.62)", ink:null}, "d-ink":{plate:null, ink:"#B4AC99"}, "d-both":{plate:"rgba(10,14,18,.74)", ink:"#CABFA8"}};
  var orig=null, variant=null, last={far:0, near:0};
  function far(it){
    if(camera.isOrthographicCamera||mode==="staff") return false;
    var dt=landCam.position.distanceTo(orbitTarget); if(!(dt>=1)) return false;
    return camera.position.distanceTo(it.world)/dt>MLS.FAR;
  }
  function after(){
    var v=V[variant], nf=0, nn=0;
    for(var k in ML.items){ var it=ML.items[k]; if(k.indexOf("n:")!==0||!it.el) continue;
      if(!it.p255) it.p255={bg:it.el.style.background, col:it.el.style.color};
      var f=!!v&&it.state==="on"&&far(it);
      if(f){ nf++; if(v.plate) it.el.style.background=v.plate; if(v.ink) it.el.style.color=v.ink; it.el.dataset.far255="1"; }
      else { if(it.el.dataset.far255){ it.el.style.background=it.p255.bg; it.el.style.color=it.p255.col; delete it.el.dataset.far255; } if(it.state==="on") nn++; }
      if(!f&&!it.el.dataset.far255) it.p255={bg:it.el.style.background, col:it.el.style.color}; }
    last.far=nf; last.near=nn;
  }
  function wrapped(){ var r=orig.apply(this,arguments); after(); return r; }
  window.__p8h.farnames={
    install:function(v){ if(!orig){ orig=mlLayout; mlLayout=wrapped; } variant=v; after(); return true; },
    uninstall:function(){ variant=null; after(); if(orig){ mlLayout=orig; orig=null; } return true; },
    stats:function(){ return {variant:variant, far:last.far, near:last.near}; }
  };
})();
