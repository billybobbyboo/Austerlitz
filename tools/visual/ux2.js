/* UI/UX roadmap step 2 (docs/UX_ART_AUDIT.md UA-01, UA-15, Direction A; the owner's decision of 15 November 2026): the Landscape's label tiers,
   measured. Shared by tools/ux-step2/probe.js (the acceptance runs, on any build: the base build's record is the reproduction of UA-01) and the
   harness's live block "ux2" (tools/visual/harness.js; check:selftest and check:visual), judged by thresholds.js checkUx2.
   In the page (inPage): window.__ux2, measures that read the app's own state and change nothing but, for a frame's contrast, the layer's ink
   and its visibility (put back at once):
   - snap(): every item the layer collected in the frame laid out last: its state (on, dropped, held, occluded, off screen, under a panel,
     withheld, calm), its tier and surface where the build has them, its box, its anchor, whether it stands on a fill (its own computed background,
     so the same question is asked of a build without tiers), its fade;
   - comp(): the audit's composition measure (docs/ux-art-audit/evidence/probes/metrics.js comp(), kept: the free rectangle, the formations'
     bounding box inside it, the labels over it), on a 1 px raster where the audit's was 4 px, with the fills apart from the labels: the share of
     the formations' box under a filled plate (the criterion), under any drawn label's box, and under the plates with the names' marks and badges;
   - contrast(A,B,C): every drawn text's contrast on three frames of one state: A as rendered, B with the layer's ink transparent (its plates and
     casings kept), C with the layer hidden. The ink's pixels are those the ink changed (A against B: exact, where the harness's textContrast
     takes the pixels nearest the ink's colour, which reads pale fog as ink). Three measures, each the 10th percentile over its pixels, as
     textContrast's (the worst decile; the ink's 1 px anti-aliased fringe aside): "ring", the pixels RING px from the ink, the first whole pixel
     beyond the fringe (what the letters stand against: a cased label's casing, a plated label's plate; WCAG technique G18's note on a border
     wide enough to fill a letter's inner details, which is then the letter's background); "wide", the pixels to RING + 1 px (a pixel beyond the
     casing's opaque part); "box", every pixel of the words' box (textContrast's own surround: the plate, or for a cased label the ground between
     and round its words too); "bare", the same box on C (the ground alone, were the label drawn with neither plate nor casing).
   In node: evShare(), the roadmap's visibility measure of the formations a live event names (tools/visual/motion.js runBlock's long Play runs:
   over the frames the clock played with the event's label drawn, the formations in view and those drawn), here with each miss's cause;
   playRun(), a scripted Play on the motion driver's clock (30 frames a second, the WebGL draw only at the sampled frames; o.comp: every frame's
   composition and computed fills with its snap). */
"use strict";
const inPage=function(){
  if(window.__ux2) return true;
  var U={RING:2};
  /* the free rectangle of the presentation shown (the Landscape's: its own panels; the audit's measure asked the paper map's of both) */
  function free(){ try{ return mode==="staff"||typeof landFreeRect!=="function"?MAPCAM.freeRect():landFreeRect(); }catch(e){ return [0,0,innerWidth,innerHeight]; } }
  function alphaOf(c){ var m=/rgba?\(([^)]+)\)/.exec(c||""); if(!m) return 0; var p=m[1].split(",").map(parseFloat); return p.length>3?p[3]:1; }
  /* why a formation a live event names has no name or counter in the layer (not collected): the reading, the field, the level of detail */
  function why(id){ var f=FORMATIONS[id]; if(!f) return "none";
    if(typeof readHidden==="function"&&readHidden(id)) return "reading";
    if(typeof knowledgeOf==="function"&&knowledgeOf(id)==="unknown") return "reading";
    var r=units[id]; if(!r) return "aggregate";
    if(!posNow(id)) return "field";
    return "lod"; }
  U.snap=function(o){ o=o||{};
    var out={}, foc=document.activeElement;
    for(var k in ML.items){ var it=ML.items[k]; if(it.frame!==ML.frame) continue;
      var inF=it.eFrame===ML.frame, st=inF?(it.held?"held":it.state):(it.state==="panel"?"panel":"offscreen");
      var r={st:st, cat:it.cat, fid:it.fid||null, keep:!!it.keep, tier:it.tier===undefined?null:it.tier, surf:it.surf===undefined?null:it.surf,
        x:it.rect?+it.rect[0].toFixed(1):0, y:it.rect?+it.rect[1].toFixed(1):0, w:it.w||0, h:it.h||0, sx:+(+it.sx||0).toFixed(1), sy:+(+it.sy||0).toFixed(1),
        fa:it.fa===undefined?null:+(+it.fa).toFixed(2), op:it.op===undefined?1:+(+it.op).toFixed(2), foc:it.el===foc, forced:!!it.forced, grown:!!it.grow};
      if(o.style&&st==="on"){ var cs=getComputedStyle(it.el); r.fill=alphaOf(cs.backgroundColor)>0.05; r.px=parseFloat(cs.fontSize); r.bg=cs.backgroundColor; r.ink=cs.color; r.shadows=cs.textShadow==="none"?0:cs.textShadow.split(/,(?![^(]*\))/).length; r.cls=it.el.className; r.opacity=+cs.opacity;
        /* the box drawn against the box the layout holds for it (a live event's grown plate: the larger box round the one laid out) */
        var rb=it.el.getBoundingClientRect(); if(it.rect){ r.dx=+(rb.left-Math.round(it.grow?it.grow[0]:it.rect[0])).toFixed(1); r.dw=+(rb.width-(it.grow?it.w1:it.w)).toFixed(1); } }
      out[k]=r; }
    var ev={}, forms={}, named={}, evOn=!!(typeof eventGroup!=="undefined"&&eventGroup&&eventGroup.visible);
    EVENTS.forEach(function(e){ var w=evWeight(e,clock); if(w>0.02){ ev[e.id]=+w.toFixed(3); if(w>0.3) (e.forms||[]).forEach(function(id){
      if(evOn) for(var x=id,g=0;x&&FORMATIONS[x]&&g<6;x=FORMATIONS[x].parent,g++) named[x]=1;
      if(!ML.items["n:"+id]||ML.items["n:"+id].frame!==ML.frame){ if(!ML.items["c:"+id]||ML.items["c:"+id].frame!==ML.frame) forms[id]=why(id); } }); } });
    return {items:out, clock:clock, playing:!!playing, presentation:presentation, mode:mode, reading:typeof commandView!=="undefined"?commandView:"none", ev:ev, why:forms, named:named, width:innerWidth,
      focus:(function(){ var a=document.activeElement; for(var k in ML.items) if(ML.items[k].el===a) return k; return null; })(),
      key:(function(){ var q=function(k){ var e=document.querySelector('#lg-rows [data-lg="'+k+'"]'); return e?!e.hidden:null; }; return {tiers:q("tiers"), calm:q("calm")}; })(),
      stats:{placed:ML.stats.placed, dropped:ML.stats.dropped, calm:ML.stats.calm===undefined?null:ML.stats.calm, t1:ML.stats.t1===undefined?null:ML.stats.t1, t2:ML.stats.t2===undefined?null:ML.stats.t2, t3:ML.stats.t3===undefined?null:ML.stats.t3, fills:ML.stats.fills===undefined?null:ML.stats.fills},
      dist:+camera.position.distanceTo(orbitTarget).toFixed(1)};
  };
  /* the audit's composition measure: the formations on the field projected by their place on the drawn ground, their box inside the free rectangle */
  U.comp=function(extra){   /* extra: the keys of items counted as filled too (a variant measured, never drawn: the far plate under them) */
    var f=free(), fw=f[2]-f[0], fh=f[3]-f[1], v=new THREE.Vector3(), out={free:f.map(Math.round), clock:clock};
    camera.updateMatrixWorld();
    var xs=[], ys=[], n=0, inF=0;
    for(var id in FORMATIONS){ var F=FORMATIONS[id]; if(!F.track) continue; var p=posNow(id); if(!p) continue; var w=W(p[0],p[1]);
      v.set(w[0],groundY(w[0],w[1]),w[1]).project(camera); if(v.z>=1) continue; var sx=(v.x+1)/2*innerWidth, sy=(1-v.y)/2*innerHeight; n++;
      if(sx>=f[0]&&sx<=f[2]&&sy>=f[1]&&sy<=f[3]){ inF++; xs.push(sx); ys.push(sy); } }
    out.formations={onField:n, inFree:inF};
    if(!xs.length) return out;
    var b=[Math.min.apply(null,xs),Math.min.apply(null,ys),Math.max.apply(null,xs),Math.max.apply(null,ys)].map(Math.round); out.bbox=b;
    out.bboxShare=+(((b[2]-b[0])*(b[3]-b[1]))/(fw*fh)).toFixed(4);
    var bw=Math.max(1,b[2]-b[0]), bh=Math.max(1,b[3]-b[1]), gF=new Uint8Array(bw*bh), gL=new Uint8Array(bw*bh), gA=new Uint8Array(bw*bh);
    function paint(g,r){ var x0=Math.max(0,Math.round(r.left)-b[0]), x1=Math.min(bw,Math.round(r.right)-b[0]), y0=Math.max(0,Math.round(r.top)-b[1]), y1=Math.min(bh,Math.round(r.bottom)-b[1]);
      for(var y=y0;y<y1;y++) for(var x=x0;x<x1;x++) g[y*bw+x]=1; }
    var nL=0, nF=0, t3F=0, byEl=new Map(); if(extra) for(var k0 in ML.items) byEl.set(ML.items[k0].el,k0);
    [].forEach.call(document.querySelectorAll("#maplayer .ml-item"),function(e){ var cs=getComputedStyle(e); if(!(+cs.opacity>0.5)) return; var r=e.getBoundingClientRect(); if(!(r.width>0)) return;
      nL++; paint(gL,r);
      var filled=alphaOf(cs.backgroundColor)>0.05||!!(extra&&byEl.get(e)&&extra.indexOf(byEl.get(e))>=0);
      if(filled){ nF++; paint(gF,r); paint(gA,r); if(e.classList.contains("ml-q")) t3F++; }
      /* a counter's plates are its children's (the frame, the name's plate); a name's mark and badge are fills of their own */
      [].forEach.call(e.querySelectorAll("*"),function(c){ var cc=getComputedStyle(c); if(alphaOf(cc.backgroundColor)>0.05||c.tagName==="svg"){ var rr=c.getBoundingClientRect(); if(rr.width>0){ paint(gA,rr); if(e.classList.contains("mlc")) paint(gF,rr); } } });
      if(e.classList.contains("mlc")&&!filled) nF++; });
    function share(g){ var c=0; for(var i=0;i<g.length;i++) c+=g[i]; return +(c/g.length).toFixed(4); }
    out.labels=nL; out.filled=nF; out.tier3Filled=t3F; out.fillCover=share(gF); out.labelCover=share(gL); out.fillAllCover=share(gA);
    return out;
  };
  /* every drawn label's own words: the item, its ink, the words' box (the text nodes' own, clipped to the item), as measure.js layerTexts */
  U.texts=function(){
    var out=[];
    for(var k in ML.items){ var it=ML.items[k]; if(it.eFrame!==ML.frame||it.state!=="on"||it.cat==="counter") continue;
      var e=it.el, rg=document.createRange(), b=null, own="";
      for(var c=0;c<e.childNodes.length;c++){ var tn=e.childNodes[c]; if(tn.nodeType!==3||!tn.textContent.trim()) continue; own+=tn.textContent; rg.selectNodeContents(tn); var rr=rg.getBoundingClientRect();
        b=b?{left:Math.min(b.left,rr.left),top:Math.min(b.top,rr.top),right:Math.max(b.right,rr.right),bottom:Math.max(b.bottom,rr.bottom)}:rr; }
      if(!b||!own.trim()) continue;
      var eb=e.getBoundingClientRect(), cs=getComputedStyle(e);
      out.push({k:k, cat:it.cat, tier:it.tier===undefined?null:it.tier, surf:it.surf===undefined?null:it.surf, text:own.trim().slice(0,48), ink:cs.color, px:parseFloat(cs.fontSize), opacity:+cs.opacity,
        fill:alphaOf(cs.backgroundColor)>0.05, cased:cs.textShadow!=="none", bx:[Math.max(b.left,eb.left),Math.max(b.top,eb.top),Math.min(b.right,eb.right),Math.min(b.bottom,eb.bottom)]}); }
    return out;
  };
  U.inkOff=function(off){ var s=document.getElementById("ux2-ink"); if(off&&!s){ s=document.createElement("style"); s.id="ux2-ink"; s.textContent="#maplayer .ml-item{color:transparent!important}"; document.head.appendChild(s); } else if(!off&&s) s.remove(); };
  U.layerOff=function(off){ ML.root.style.visibility=off?"hidden":""; };
  function load(b64){ return new Promise(function(res){ var im=new Image(); im.onload=function(){ var cv=document.createElement("canvas"); cv.width=im.width; cv.height=im.height;
    var x=cv.getContext("2d",{willReadFrequently:true}); x.drawImage(im,0,0); res({w:cv.width,h:cv.height,d:x.getImageData(0,0,cv.width,cv.height).data}); }; im.src="data:image/png;base64,"+b64; }); }
  function lin(v){ v/=255; return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4); }
  function L3(r,g,b){ return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b); }
  U.contrast=function(a64,b64,c64,T){
    return Promise.all([load(a64),load(b64),c64?load(c64):null]).then(function(I){ var A=I[0], B=I[1], C=I[2], RING=U.RING;
      T.forEach(function(t){ var m=/rgba?\(([^)]+)\)/.exec(t.ink); t.ring=t.wide=t.box=t.bare=null; t.inkPx=0; if(!m) return; var ink=m[1].split(",").map(parseFloat), li=L3(ink[0],ink[1],ink[2]);
        var x0=Math.max(0,Math.ceil(t.bx[0])), y0=Math.max(0,Math.ceil(t.bx[1])), x1=Math.min(A.w,Math.floor(t.bx[2])), y1=Math.min(A.h,Math.floor(t.bx[3]));
        /* the ring can lie outside the words' box (above an ascender, beside the last letter): read RING + 1 px round it */
        var P=RING+1, X0=Math.max(0,x0-P), Y0=Math.max(0,y0-P), X1=Math.min(A.w,x1+P), Y1=Math.min(A.h,y1+P), w=X1-X0, h=Y1-Y0; if(w<2||h<2) return;
        var core=new Uint8Array(w*h), i, j, o, n=0;
        for(j=0;j<h;j++) for(i=0;i<w;i++){ o=((Y0+j)*A.w+X0+i)*4;
          var dAB=Math.hypot(A.d[o]-B.d[o],A.d[o+1]-B.d[o+1],A.d[o+2]-B.d[o+2]), dIB=Math.hypot(ink[0]-B.d[o],ink[1]-B.d[o+1],ink[2]-B.d[o+2]);
          /* the ink's coverage of the pixel: how far it moved the pixel toward the ink's colour; half or more is ink. Only inside the words' box */
          if(i+X0>=x0&&i+X0<x1&&j+Y0>=y0&&j+Y0<y1&&dIB>24&&dAB/dIB>=0.5){ core[j*w+i]=1; n++; } }
        t.inkPx=n; if(n<4) return;
        /* distance to the ink (chamfer, in pixels): 0 the ink, 1 its fringe */
        var dist=new Float32Array(w*h); for(i=0;i<w*h;i++) dist[i]=core[i]?0:1e6;
        for(j=0;j<h;j++) for(i=0;i<w;i++){ o=j*w+i; if(i>0) dist[o]=Math.min(dist[o],dist[o-1]+1); if(j>0) dist[o]=Math.min(dist[o],dist[o-w]+1); if(i>0&&j>0) dist[o]=Math.min(dist[o],dist[o-w-1]+1.4142); if(i<w-1&&j>0) dist[o]=Math.min(dist[o],dist[o-w+1]+1.4142); }
        for(j=h-1;j>=0;j--) for(i=w-1;i>=0;i--){ o=j*w+i; if(i<w-1) dist[o]=Math.min(dist[o],dist[o+1]+1); if(j<h-1) dist[o]=Math.min(dist[o],dist[o+w]+1); if(i<w-1&&j<h-1) dist[o]=Math.min(dist[o],dist[o+w+1]+1.4142); if(i>0&&j<h-1) dist[o]=Math.min(dist[o],dist[o+w-1]+1.4142); }
        var ring=[], wide=[], box=[], bare=[];
        function cr(l){ return (Math.max(li,l)+0.05)/(Math.min(li,l)+0.05); }
        for(j=0;j<h;j++) for(i=0;i<w;i++){ o=j*w+i; var d=dist[o]; if(d<1.5) continue;   /* the ink and its 1 px fringe (a diagonal neighbour too) */
          var q=((Y0+j)*A.w+X0+i)*4, inBox=i+X0>=x0&&i+X0<x1&&j+Y0>=y0&&j+Y0<y1;
          var lb=L3(B.d[q],B.d[q+1],B.d[q+2]);
          if(d<=RING+0.001) ring.push(cr(lb));
          if(d<=RING+1.001) wide.push(cr(lb));
          if(inBox){ box.push(cr(lb)); if(C) bare.push(cr(L3(C.d[q],C.d[q+1],C.d[q+2]))); } }
        function p10(a){ if(!a.length) return null; a.sort(function(x,y){ return x-y; }); return +a[Math.floor(a.length*0.10)].toFixed(2); }
        t.ring=p10(ring); t.wide=p10(wide); t.box=p10(box); t.bare=C?p10(bare):null; });
      return T; });
  };
  window.__ux2=U; return true;
};

/* ---- in node ---- */
/* the formations a live event names, over the frames the clock played with the event's label drawn (motion.js runBlock's measure for its long
   Play runs): in view (a name or counter in the layer, not off the screen or under a panel) and drawn; and here each frame a formation is not
   drawn, by its cause: behind the ground ("occluded"), no room ("placement": dropped, or held by the stabiliser), Watch's set ("calm": never a
   formation a live event names; counted to show it), and outside the measure's denominator, as in the roadmap's: off the screen, under a panel,
   not collected ("reading": the reading does not know it; "field": not on the field at the clock; "lod": the level of detail gives it no name
   there; "aggregate": a corps, which has no name of its own on the Landscape) */
function evShare(F,events){
  const R={inView:0, drawn:0, miss:{occluded:0, placement:0, calm:0, withheld:0}, out:{offscreen:0, panel:0, reading:0, field:0, lod:0, aggregate:0, none:0}, by:{}, frames:0};
  F.forEach(fr=>{ if(!fr.playing) return; R.frames++; const A=fr.items;
    events.forEach(e=>{ const ei=A["e:"+e.id]; if(!ei||ei.st!=="on") return;
      const B=R.by[e.id]||(R.by[e.id]={frames:0, inView:0, drawn:0, miss:{}, out:{}}); B.frames++;
      (e.forms||[]).forEach(fid=>{ const s=A["c:"+fid]||A["n:"+fid];
        const outk=!s?(fr.why&&fr.why[fid])||"none":s.st==="offscreen"?"offscreen":s.st==="panel"?"panel":null;
        if(outk){ R.out[outk]=(R.out[outk]||0)+1; B.out[fid+":"+outk]=(B.out[fid+":"+outk]||0)+1; return; }
        R.inView++; B.inView++;
        if(s.st==="on"){ R.drawn++; B.drawn++; return; }
        const mk=s.st==="occluded"?"occluded":s.st==="calm"?"calm":s.st==="withheld"?"withheld":"placement";
        R.miss[mk]=(R.miss[mk]||0)+1; B.miss[fid+":"+mk]=(B.miss[fid+":"+mk]||0)+1; }); }); });
  R.share=R.inView?+(R.drawn/R.inView).toFixed(4):null;
  return R;
}
/* a scripted Play from a seek, Follow on, at half speed, on the motion driver's clock; the WebGL draw skipped but at the sampled frames
   (o.sample(f, clock) says which: each then drawn by the app's own frame, the ground's depth drawn again, and handed to o.onSample).
   Returns every frame's snap */
async function playRun(page,MO,o){
  await page.evaluate(MO.inPage); await page.evaluate(inPage);
  await page.evaluate(a=>{ var D=window.__md; D.start({gl:true}); window.__ux2rr=renderer.render; renderer.render=function(){};
    if(a.reading&&a.reading!=="none") setCommandView(a.reading);
    stopPlay(); setClock(a.from,{instant:true,force:true,camera:false}); if(mode!=="staff"){ freeCam=false; curVantage=null; } setSpeed(0.5); requestRender(8); D.frame(8); togglePlay(); },{from:o.from,reading:o.reading||null});
  const F=[]; let f=0, last=null;
  for(;;){ f++;
    const want=o.sample?!!o.sample(f,last?last.clock:o.from):false;
    const s=await page.evaluate(([g,c])=>{ var D=window.__md; if(g){ if(typeof GDEPTH!=="undefined") GDEPTH.key=null; renderer.render=window.__ux2rr; } D.frame(); if(g) renderer.render=function(){};
      var s=window.__ux2.snap({style:c}); if(c) s.comp=window.__ux2.comp(); return s; },[want,!!o.comp]);
    s.f=f; F.push(s); last=s;
    if(want&&o.onSample) await o.onSample(f,s);
    if(!s.playing||s.clock>=o.to-1e-9||f>=(o.max||6000)) break; }
  const ms=await page.evaluate(()=>{ var D=window.__md, lm=D.layerMs(); stopPlay(); renderer.render=window.__ux2rr; D.stop(); if(typeof setCommandView==="function"&&commandView!=="none") setCommandView("none"); return lm; });
  return {F:F, ms:ms};
}
/* ---- the harness's live block "ux2" (check:selftest and check:visual; thresholds.js checkUx2), and tools/ux-step2/block.js on any build ----
   open(vp, dev) gives a started page (the harness's openPage); settle(page) the app at rest. The block reads; thresholds.js judges.
   - still: the Landscape in Study at 09:00 and in the valley fog at 08:44, a view reached without motion: every drawn label's tier, the surface
     it is drawn on as computed (its own background, its size, its casing), and every text's contrast as rendered (contrast() above);
   - modes: the paper map and the Landscape with counters at 09:00 (every label on its plate, no tier), Clean (no label);
   - play: a scripted Play in Study from 08:40 to 09:05 (the driver's clock, no draw): every frame's composition (the share of the formations' box
     under filled plates), the drawn labels by tier, the formations a live event names drawn (evShare), the label pass's time;
   - watch: the same Play in Watch (UA-15): the drawn labels and their tiers in every frame; then, while it plays, a tier 3 name focused (drawn,
     on the plate), blurred (not drawn), hovered and selected (tier 2, drawn); the focus kept through a pause (tier 3 back), a change to Study
     and back, Play again and a seek; and in both runs every frame's tiers against the rule as the events come and go;
   - phone: the same on a phone's page (390 x 844, density 3, touch, an iPhone's user agent; Chromium's emulation): a live event's size, the phone
     turned and back (each live event's box drawn as the layout holds it), the Play;
   - forced: a forced-colours mode emulated: a tier 3 label on the system's Canvas, a live event's and a tier 2 label's outline;
   - reduced (check:visual and the probe): reduced motion emulated: the tiers and Watch's set while the clock plays. */
const PLAY=[520,545], STILL=[["09:00",540],["08:44, the valley fog",524.7]];
async function runBlock(open,settle,o){
  o=o||{}; const MO=require("./motion.js"), L={still:[], modes:[]}, log=o.log||function(){}, so=!!o.selftestOnly, only=o.only?String(o.only).split(","):null, want=k=>!only||only.includes(k);
  const view=(p,a)=>p.evaluate(a=>{ if(playing) stopPlay(); select(null,null); setCommandView("none"); if(document.activeElement&&document.activeElement.blur) document.activeElement.blur();
    setMode(a.mode||"terrain"); setPresentation(a.pres||"study"); setClock(a.t,{instant:true,force:true}); },a);
  const summary=(R,events)=>{ const F=R.F, cov=F.filter(s=>s.comp&&s.comp.bbox), ms=R.ms.slice().sort((a,b)=>a-b), EV=evShare(F,events);
    const fr=F.map(s=>{ const on=Object.keys(s.items).filter(k=>s.items[k].st==="on"), t=n=>on.filter(k=>s.items[k].tier===n).length;
      return {f:s.f, clock:+s.clock.toFixed(2), playing:s.playing, drawn:on.length, t1:t(1), t2:t(2), t3:t(3), t0:on.filter(k=>!s.items[k].tier).length, calm:Object.keys(s.items).filter(k=>s.items[k].st==="calm").length,
        fills:on.filter(k=>s.items[k].fill).length, t3fills:on.filter(k=>s.items[k].tier===3&&s.items[k].fill&&!s.items[k].foc&&!s.items[k].forced), cover:s.comp&&s.comp.bbox?s.comp.fillCover:null,
        other:on.filter(k=>s.items[k].tier===3&&!s.items[k].foc&&!s.items[k].forced)}; });
    /* every frame's tiers against the rule, as the events come and go: a live event (weight above 0.3) tier 1, a formation one names or what
       the layer protects tier 2, every other label tier 3 */
    const tierBad=[]; F.forEach(s=>{ Object.keys(s.items).forEach(k=>{ const n=s.items[k]; if(n.st!=="on"||n.cat==="counter") return;
      const want=n.cat==="event"&&s.ev[k.slice(2)]>0.3?1:(n.keep||(n.cat==="name"&&s.named[n.fid]))?2:3; if(n.tier!==want&&tierBad.length<12) tierBad.push("frame "+s.f+" ("+s.clock.toFixed(1)+"): "+k+" tier "+n.tier+", "+want+" expected"); }); });
    return {frames:F.length, from:F.length?F[0].clock:null, to:F.length?F[F.length-1].clock:null, fr:fr, tierBad:tierBad, events:[...new Set([].concat.apply([],F.map(s=>Object.keys(s.ev).filter(id=>s.ev[id]>0.3))))], coverMax:cov.length?Math.max.apply(null,cov.map(s=>s.comp.fillCover)):null,
      ev:EV, msMedian:ms.length?+ms[Math.floor(ms.length/2)].toFixed(2):null, msMax:ms.length?+ms[ms.length-1].toFixed(2):null}; };
  const p=await open([1440,900]); await settle(p); await p.evaluate(()=>closeFirst(null)); await p.evaluate(inPage);
  const events=await p.evaluate(()=>EVENTS.map(e=>({id:e.id, forms:e.forms||[]})));
  const tokens=await p.evaluate(()=>{ var t=document.createElement("i"); document.body.appendChild(t); t.style.background=TOKENS.theme.dark.accent; var a=getComputedStyle(t).backgroundColor; t.style.background=TOKENS.sym.plate.dark; var d=getComputedStyle(t).backgroundColor; t.remove();
    var cs=getComputedStyle(document.documentElement); return {accent:a, plate:d, tLive:parseFloat(cs.getPropertyValue("--t-live"))||null, tUi:parseFloat(cs.getPropertyValue("--t-ui"))||null}; });
  L.tokens=tokens;
  if(want("still")) for(const [tag,t] of (so?STILL.slice(1):STILL)){
    await view(p,{t:t}); await settle(p);
    const S=await p.evaluate(()=>{ mlLayout(); return window.__ux2.snap({style:true}); }), T=await p.evaluate(()=>window.__ux2.texts());
    const A=await p.screenshot({timeout:180000,scale:"css"}); await p.evaluate(()=>window.__ux2.inkOff(true)); const B=await p.screenshot({timeout:180000,scale:"css"});
    await p.evaluate(()=>{ window.__ux2.inkOff(false); window.__ux2.layerOff(true); }); const C=await p.screenshot({timeout:180000,scale:"css"}); await p.evaluate(()=>window.__ux2.layerOff(false));
    const tc=await p.evaluate(([a,b,c,T])=>window.__ux2.contrast(a,b,c,T),[A.toString("base64"),B.toString("base64"),C.toString("base64"),T]);
    L.still.push({tag:tag, t:t, snap:S, texts:tc});
    const on=Object.keys(S.items).filter(k=>S.items[k].st==="on"), q=tc.filter(x=>x.tier===3&&x.ring!==null);
    log("ux2 still, "+tag+": "+on.length+" labels drawn, by tier "+[1,2,3].map(n=>on.filter(k=>S.items[k].tier===n).length).join("/")+", on a fill "+on.filter(k=>S.items[k].fill).length+
      "; tier 3 as rendered "+(q.length?Math.min.apply(null,q.map(x=>x.ring)).toFixed(2)+":1 at least over "+q.length+" texts":"none read")); }
  if(want("modes")) for(const [tag,a] of [["the paper map",{mode:"staff",t:540}],["the Landscape with counters",{mode:"hybrid",t:540}],["Clean",{mode:"terrain",pres:"map",t:540}]]){
    await view(p,a); await settle(p);
    const S=await p.evaluate(()=>{ mlLayout(); return window.__ux2.snap({style:true}); });
    L.modes.push({tag:tag, snap:S}); const on=Object.keys(S.items).filter(k=>S.items[k].st==="on");
    log("ux2 "+tag+": "+on.length+" labels drawn, with a tier "+on.filter(k=>S.items[k].tier).length+", with a tier's class "+on.filter(k=>/\bml-(t1|t2|q)\b/.test(S.items[k].cls||"")).length); }
  if(want("play")){
    await view(p,{t:PLAY[0]}); await settle(p);
    L.play=summary(await playRun(p,MO,{from:PLAY[0],to:so?PLAY[0]+15:PLAY[1],comp:true}),events);
    log("ux2 Play in Study, "+L.play.frames+" frames to "+(L.play.to||0).toFixed(1)+": filled plates over the formations' box "+(100*L.play.coverMax).toFixed(1)+"% at most; the formations a live event names drawn "+L.play.ev.drawn+" of "+L.play.ev.inView+"; the label pass "+L.play.msMedian+" ms (median)"); }
  if(want("watch")){
    await view(p,{t:PLAY[0],pres:"watch"}); await settle(p);
    L.watch=summary(await playRun(p,MO,{from:PLAY[0],to:so?PLAY[0]+15:PLAY[1],comp:true}),events);
    log("ux2 Play in Watch, "+L.watch.frames+" frames: "+Math.max.apply(null,L.watch.fr.map(x=>x.drawn))+" labels drawn at most, tier 3 drawn in "+L.watch.fr.filter(x=>x.playing&&x.other.length).length+" frames; the formations a live event names drawn "+L.watch.ev.drawn+" of "+L.watch.ev.inView);
    /* the focus, the hover and the selection while Watch plays, and through a pause and a change of presentation */
    await view(p,{t:530,pres:"watch"}); await settle(p); await p.evaluate(MO.inPage);
    L.seq=await p.evaluate(()=>{ var D=window.__md, U=window.__ux2, R={};
      D.start({gl:false}); stopPlay(); setClock(530,{instant:true,force:true,camera:false}); freeCam=false; curVantage=null; setSpeed(0.5); requestRender(8); D.frame(8); togglePlay(); D.frame(24);
      var s=U.snap(), id=null; for(var k in s.items){ if(k.indexOf("n:")===0&&s.items[k].st==="calm"){ id=k; break; } }
      function st(tag){ var q=U.snap({style:true}), it=q.items[id]||{}, on=Object.keys(q.items).filter(function(k){ return q.items[k].st==="on"; });
        R[tag]={playing:q.playing, presentation:q.presentation, st:it.st||null, tier:it.tier===undefined?null:it.tier, surf:it.surf===undefined?null:it.surf, fill:!!it.fill, keep:!!it.keep, focus:q.focus===id,
          drawn:on.length, t3:on.filter(function(k){ return q.items[k].tier===3&&k!==id; }).length, calm:Object.keys(q.items).filter(function(k){ return q.items[k].st==="calm"; }).length, key:q.key}; }
      R.id=id; st("playing"); if(!id){ stopPlay(); D.stop(); return R; }
      var it=ML.items[id], fid=it.fid;
      it.el.focus(); D.frame(3); st("focused");
      it.el.blur(); D.frame(3); st("blurred");
      R.hovered0=D.hover(it.sx,it.sy); D.frame(3); st("hovered"); D.leave(2,2); D.frame(3);
      select("f",fid); D.frame(3); st("selected"); R.playAfterSelect=!!playing; select(null,null); if(!playing) togglePlay(); D.frame(3);
      it.el.focus(); D.frame(3); stopPlay(); D.frame(14); st("paused");
      setPresentation("study"); D.frame(4); st("study");
      setPresentation("watch"); D.frame(4); togglePlay(); D.frame(8); st("playing again");
      /* a seek while it plays: the clock set a quarter of an hour on (the app's own seek; the camera as it stands): the focus stays in the layer, on
         the item while the layer still holds it, and drawn */
      setClock(clock+15,{instant:true,force:true,camera:false}); D.frame(4); st("sought");
      R.sought.inLayer=!!(document.activeElement&&(document.activeElement===ML.root||document.activeElement.parentNode===ML.root)); R.sought.held=!!(ML.items[id]&&ML.items[id].eFrame===ML.frame);
      if(document.activeElement&&document.activeElement.blur) document.activeElement.blur(); stopPlay(); D.frame(2); D.stop(); return R; });
    log("ux2 Watch while it plays, "+(L.seq.id||"no tier 3 name")+": "+["playing","focused","blurred","hovered","selected","paused","study","playing again","sought"].map(k=>k+" "+(L.seq[k]?L.seq[k].st+(L.seq[k].focus?" (focus)":""):"-")).join(", ")); }
  if(want("forced")){
    await p.emulateMedia({forcedColors:"active"}); await view(p,{t:540}); await settle(p);
    L.forced=await p.evaluate(()=>{ mlLayout(); var out=[], al=function(c){ var m=/rgba?\(([^)]+)\)/.exec(c||""); if(!m) return 0; var q=m[1].split(",").map(parseFloat); return q.length>3?q[3]:1; };
      for(var k in ML.items){ var it=ML.items[k]; if(it.eFrame!==ML.frame||it.state!=="on"||it.cat==="counter") continue; var cs=getComputedStyle(it.el);
        out.push({k:k, tier:it.tier===undefined?null:it.tier, bgAlpha:al(cs.backgroundColor), outline:cs.outlineStyle+" "+cs.outlineWidth, shadow:cs.textShadow}); }
      return {active:matchMedia("(forced-colors: active)").matches, items:out}; });
    await p.emulateMedia({forcedColors:"none"});
    log("ux2 forced colours: "+L.forced.items.length+" labels; tier 3 on no fill "+L.forced.items.filter(x=>x.tier===3&&!(x.bgAlpha>0.5)).length+"; tier 1 outlines "+[...new Set(L.forced.items.filter(x=>x.tier===1).map(x=>x.outline))].join(", ")); }
  if(want("reduced")&&!so){
    await p.emulateMedia({reducedMotion:"reduce"}); await view(p,{t:PLAY[0],pres:"watch"}); await settle(p);
    const rm=await p.evaluate(()=>typeof RM!=="undefined"?RM:null);
    L.reduced=Object.assign({rm:rm},summary(await playRun(p,MO,{from:PLAY[0],to:PLAY[0]+10,comp:true}),events));
    await p.emulateMedia({reducedMotion:"no-preference"});
    log("ux2 reduced motion, Play in Watch: "+L.reduced.frames+" frames, "+Math.max.apply(null,L.reduced.fr.map(x=>x.drawn))+" labels drawn at most, tier 3 drawn in "+L.reduced.fr.filter(x=>x.playing&&x.other.length).length+" frames"); }
  await p.context().close();
  if(want("phone")){
    const q=await open([390,844],"ios"); await settle(q); await q.tap("#fr-close",{timeout:60000}); await q.evaluate(inPage);
    await view(q,{t:540}); await settle(q);
    const S=await q.evaluate(()=>{ mlLayout(); return window.__ux2.snap({style:true}); });
    L.phone={still:S, phoneLayout:await q.evaluate(()=>typeof PHONE!=="undefined"?PHONE:null)};
    /* the phone turned (844 x 390: from 720 px wide a live event at t-live where it stands clear) and back: each live event's box drawn where
       and as wide as the layout holds it. (The turn hides and shows the labels, which measures them again, so this case does not by itself catch a
       box at t-live kept from the other width: css-test.js holds that rule in the source) */
    const turn=async(w,h)=>{ await q.setViewportSize({width:w,height:h}); await q.evaluate(()=>window.dispatchEvent(new Event("resize")));
      await q.waitForFunction(([w,h])=>window.innerWidth===w&&window.innerHeight===h&&Math.abs(landCam.aspect-w/h)<1e-9&&(typeof PHONE==="undefined"||PHONE===window.matchMedia(PHONE_Q).matches),[w,h],{timeout:60000,polling:50});
      await settle(q); return q.evaluate(()=>{ mlLayout(); return window.__ux2.snap({style:true}); }); };   /* nothing set but the size: the labels stay as they are */
    L.phone.turned=await turn(844,390); L.phone.back=await turn(390,844);
    await view(q,{t:PLAY[0]}); await settle(q);
    L.phone.play=summary(await playRun(q,MO,{from:PLAY[0],to:so?PLAY[0]+15:PLAY[1],comp:true}),events);
    const cv=L.phone.play.fr.map(x=>x.cover).filter(x=>x!==null).sort((a,b)=>a-b);
    L.phone.play.coverMedian=cv.length?cv[Math.floor(cv.length/2)]:null;
    log("ux2 a phone (390 x 844): a live event at "+[...new Set(Object.keys(S.items).filter(k=>S.items[k].st==="on"&&S.items[k].tier===1).map(k=>S.items[k].px))].join(", ")+" px; Play, "+L.phone.play.frames+" frames: filled plates over the formations' box "+(100*L.phone.play.coverMax).toFixed(1)+"% at most, "+(100*(L.phone.play.coverMedian||0)).toFixed(1)+"% (median); the formations a live event names drawn "+L.phone.play.ev.drawn+" of "+L.phone.play.ev.inView);
    await q.context().close(); }
  return L;
}
/* check:visual's block "tiers" (thresholds.js TIER_VIEWS; judged by thresholds.js checkTiers): each view applied to the page (measure.js injected:
   window.__aus), a tier 3 name selected or focused, Napoleon's reading, a phone held landscape, the Landscape with counters; every drawn label's tier,
   surface, size and contrast as rendered (measure.js tierNames, on the frame as rendered and with the ink transparent). In the harness, and alone
   by tools/ux-step2/tiers.js */
async function tierViews(first,settle,VIEWS){
  const views=[], lines=[], vpF=first.viewportSize(), CASES=require("./cases.js");
  const sizeF=async(w,h)=>{ await first.setViewportSize({width:w,height:h}); await first.evaluate(()=>window.dispatchEvent(new Event("resize"))); await first.waitForTimeout(700); };
  for(const [tag,view,over,state,sz] of VIEWS){
    const base=typeof view==="string"?JSON.parse(JSON.stringify(CASES.find(x=>x.name===view))):JSON.parse(JSON.stringify(view));
    const spec=Object.assign(base,over||{}); delete spec.viewport;
    if(sz) await sizeF(sz[0],sz[1]);
    await first.evaluate(s=>{ closeFirst(null); if(playing) stopPlay(); select(null,null); setCommandView("none"); if(document.activeElement&&document.activeElement.blur) document.activeElement.blur(); window.__aus.apply(s); },spec); await settle(first);
    /* a tier 3 name of the view, selected or focused: the first drawn */
    const target=state==="select"||state==="focus"?await first.evaluate(st=>{ mlLayout(); var id=null;
        for(var k in ML.items){ var it=ML.items[k]; if(k.indexOf("n:")===0&&it.eFrame===ML.frame&&it.state==="on"&&it.tier===3){ id=k.slice(2); break; } }
        if(!id) return {id:null};
        if(st==="select") select("f",id); else { var e=ML.items["n:"+id].el; if(e&&e.focus) e.focus(); }
        AUSTERLITZ_DEBUG.settle(2,true); mlLayout(); var t=ML.items["n:"+id];
        return {id:id, tier:t?t.tier:null, surf:t?t.surf:null, prot:!!(t&&(t.keep||t.forced||t.el===document.activeElement))}; },state):null;
    if(state==="reading") await first.evaluate(()=>{ setCommandView("fr"); AUSTERLITZ_DEBUG.settle(2,true); });
    if(state) await settle(first);
    const A=await first.screenshot({timeout:180000}); await first.evaluate(()=>window.__aus.inkOff(true)); const B=await first.screenshot({timeout:180000}); await first.evaluate(()=>window.__aus.inkOff(false));
    const tn=await first.evaluate(([a,b])=>window.__aus.tierNames(a,b),[A.toString("base64"),B.toString("base64")]);
    const N=(tn&&tn.items)||[], q=N.filter(n=>n.surface==="none"), cs=q.map(n=>n.contrast).filter(c=>c!=null), by=t=>N.filter(n=>n.tier===t).length;
    views.push({tag:tag, state:state||null, size:sz||null, on:tn?tn.on:null, width:tn?tn.width:null, items:N, target:target});
    lines.push(tag+": "+N.length+" labels, tier 1 "+by(1)+", tier 2 "+by(2)+", tier 3 "+by(3)+(by(0)?", tier 0 "+by(0):"")+", "+q.length+" on no plate"+(cs.length?" (as rendered "+Math.min(...cs).toFixed(2)+" to "+Math.max(...cs).toFixed(2)+":1)":"")+(target?", the "+state+"ed name "+JSON.stringify(target):""));
    await first.evaluate(()=>{ select(null,null); setCommandView("none"); if(document.activeElement&&document.activeElement.blur) document.activeElement.blur(); setMode("terrain"); });
    if(sz) await sizeF(vpF.width,vpF.height); }
  return {views:views, lines:lines};
}
module.exports={inPage, evShare, playRun, runBlock, tierViews, PLAY, STILL};
