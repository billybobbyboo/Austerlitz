/* In-page driver and measurements for the Stage 0 harness. Uses the application's own globals,
   so the same measurements run against the pre-Stage-0 build and later builds. Independent of
   the code under test where it matters: the ground surface is read from the ground mesh's own
   vertex buffer, not from any helper in the app. */
(function(){
  var V=THREE.Vector3, M4=THREE.Matrix4;
  var D=function(){ return window.AUSTERLITZ_DEBUG||null; };
  function effVisible(o){ while(o){ if(!o.visible) return false; o=o.parent; } return true; }

  /* ---- the rendered ground: the triangles of the terrain mesh as drawn ---- */
  var SW=360/280, SH=310/240;
  /* the ground the app means to draw: the display height since Stage 2B, the model height before it */
  function drawnH(x,z){ return (typeof displayHeight==="function")?displayHeight(x,z):height(x,z); }
  function rg(x,z){
    var P=groundMesh.geometry.attributes.position.array;
    var fx=(x+180)/SW, fz=(z+155)/SH;
    if(fx<0||fz<0||fx>280||fz>240) return drawnH(x,z);
    var ix=Math.min(279,Math.floor(fx)), iz=Math.min(239,Math.floor(fz)), u=fx-ix, v=fz-iz;
    var o0=(iz*280+ix)*18, o1=o0+9;
    var ha=P[o0+1], hb=P[o0+4], hd=P[o0+7], hc=P[o1+4];
    return (u+v<=1) ? ha+u*(hd-ha)+v*(hb-ha) : hc+(1-u)*(hb-hc)+(1-v)*(hd-hc);
  }
  function groundMax(x,z,r){
    var m=rg(x,z);
    for(var k=0;k<8;k++){ var a=k/8*Math.PI*2; m=Math.max(m,rg(x+Math.cos(a)*r,z+Math.sin(a)*r)); }
    return m;
  }
  function selfCheckGround(){
    var worst=0;
    for(var i=0;i<200;i++){
      var ix=(i*37)%280, iz=(i*53)%240, x=-180+ix*SW, z=-155+iz*SH;
      worst=Math.max(worst,Math.abs(rg(x,z)-drawnH(x,z)));
    }
    return worst;
  }

  /* ---- drive the app into a case ---- */
  function aimOf(spec){
    var mp=spec.aim.map;
    if(typeof mp==="string") mp=posNow(mp);
    var w=W(mp[0],mp[1]), ty=height(w[0],w[1]);
    var d=new V(spec.aim.dir[0],spec.aim.dir[1],spec.aim.dir[2]).normalize().multiplyScalar(spec.aim.r);
    return [w[0]+d.x,ty+d.y,w[1]+d.z, w[0],ty,w[1]];
  }
  function apply(spec){
    var dbg=D();
    if(spec.factor==="model") spec=Object.assign({},spec,{factor:GEOREF.EXAG});
    if(dbg&&dbg.applyCase) return dbg.applyCase(spec, aimOf);
    /* pre-Stage-0 build: set the same state through its globals */
    var fr=document.getElementById("firstrun"); if(fr) fr.hidden=true;
    if(typeof stopPlay==="function") stopPlay();
    if(typeof tourStep!=="undefined"&&tourStep>=0) exitTour();
    setPresentation(spec.presentation||"study");
    if(mode!==(spec.mode||"terrain")) setMode(spec.mode||"terrain");
    setClock(spec.t,{instant:true,force:true,camera:false});
    select(null,null);
    if(spec.select) select(spec.select[0],spec.select[1]);
    var c=spec.cam||aimOf(spec);
    freeCam=true; tween=null;
    camera.position.set(c[0],c[1],c[2]); orbitTarget.set(c[3],c[4],c[5]); camera.lookAt(orbitTarget);
    return true;
  }

  /* ---- sprites on screen ---- */
  var inkCache=new WeakMap();
  function inkBox(tex){
    if(!tex||!tex.image||!tex.image.getContext) return [0,0,1,1];
    var cv=tex.image; if(inkCache.has(cv)) return inkCache.get(cv);
    var w=cv.width,h=cv.height,d=cv.getContext("2d").getImageData(0,0,w,h).data;
    var x0=w,y0=h,x1=-1,y1=-1;
    for(var y=0;y<h;y++) for(var x=0;x<w;x++){ if(d[(y*w+x)*4+3]>24){ if(x<x0)x0=x; if(x>x1)x1=x; if(y<y0)y0=y; if(y>y1)y1=y; } }
    var r = x1<0 ? [0.5,0.5,0.5,0.5] : [x0/w,y0/h,(x1+1)/w,(y1+1)/h];
    inkCache.set(cv,r); return r;
  }
  function rectOfSprite(sp){
    var cam=camera, W0=window.innerWidth, H0=window.innerHeight;
    var p=sp.getWorldPosition(new V()), v=p.clone().applyMatrix4(cam.matrixWorldInverse);
    if(v.z>-cam.near) return null;
    var ndc=p.clone().project(cam); if(Math.abs(ndc.x)>1.05||Math.abs(ndc.y)>1.05) return null;
    var ppw=H0/(2*(-v.z)*Math.tan(cam.fov*Math.PI/360));
    var sx=sp.scale.x*ppw, sy=sp.scale.y*ppw, cx=(ndc.x*0.5+0.5)*W0, cy=(-ndc.y*0.5+0.5)*H0;
    var b=inkBox(sp.material&&sp.material.map);
    return [cx-sx/2+b[0]*sx, cy-sy/2+b[1]*sy, cx-sx/2+b[2]*sx, cy-sy/2+b[3]*sy];
  }
  function labelSet(){
    var L=[];
    function add(sp,cat,id){ if(sp&&effVisible(sp)&&(!sp.material||sp.material.opacity>0.05)) L.push({sp:sp,cat:cat,id:id}); }
    Object.keys(units).forEach(function(k){ add(units[k].sprite,"counter",k); add(units[k].nameLabel,"name",k); });
    Object.keys(aggregates).forEach(function(k){ add(aggregates[k].sprite,"counter",k); });
    (eventMarks||[]).forEach(function(m){ add(m.ls,"event",m.e.id); });
    if(typeof plateauLabel!=="undefined") add(plateauLabel,"plateau","plateau");
    (overlayLabels||[]).forEach(function(s,i){ add(s,"overlay",i); });
    (featureSprites||[]).forEach(function(o){ add(o.sprite,"feature",o.ft.id); });
    (analysisSprites||[]).forEach(function(o){ add(o.sprite,"analysis",o.tl.n); });
    return L;
  }
  /* Stage 2D: the map layer's rendered boxes (getBoundingClientRect of every item drawn), not projected sprites */
  function hasLayer(){ return typeof ML!=="undefined"&&ML.root&&!ML.canvas; }
  function layerBoxes(){
    var R=[];
    Object.keys(ML.items).forEach(function(k){ var it=ML.items[k]; if(!it.on||!it.disp) return;
      var b=it.el.getBoundingClientRect(); if(b.width>0&&b.height>0) R.push({o:{cat:it.cat,id:k},r:[b.left,b.top,b.right,b.bottom]}); });
    return R;
  }
  function overlaps(){
    camera.updateMatrixWorld(true);
    if(hasLayer()) return layerOverlaps();
    var L=labelSet(), R=[];
    L.forEach(function(o){ var r=rectOfSprite(o.sp); if(r) R.push({o:o,r:r}); });
    var pairs={}, list=[], P=panelRects();
    /* an overlap wholly under an opaque interface panel cannot be seen, so it is not counted */
    function hidden(x0,y0,x1,y1){ for(var k=0;k<P.length;k++){ var c=P[k]; if(x0>=c[0]&&y0>=c[1]&&x1<=c[2]&&y1<=c[3]) return true; } return false; }
    for(var i=0;i<R.length;i++) for(var j=i+1;j<R.length;j++){
      var a=R[i].r,b=R[j].r, ix=Math.min(a[2],b[2])-Math.max(a[0],b[0]), iy=Math.min(a[3],b[3])-Math.max(a[1],b[1]);
      if(ix>4&&iy>4&&!hidden(Math.max(a[0],b[0]),Math.max(a[1],b[1]),Math.min(a[2],b[2]),Math.min(a[3],b[3]))){
        var k=[R[i].o.cat,R[j].o.cat].sort().join("x");
        pairs[k]=(pairs[k]||0)+1;
        if(list.length<40) list.push(R[i].o.cat+":"+R[i].o.id+" / "+R[j].o.cat+":"+R[j].o.id);
      }
    }
    return {visible:R.length, pairs:pairs, examples:list};
  }

  /* Stage 2D, stricter than the sprite test above (which allowed 4 px either way): any two drawn boxes that share more
     than half a pixel in both directions overlap; so does a box on an interface panel or on an arrow head */
  function layerOverlaps(){
    var R=layerBoxes(), P=panelRects(), H=headRects(), pairs={}, list=[], overPanel=[], overHead=[];
    function cross(a,b){ return Math.min(a[2],b[2])-Math.max(a[0],b[0])>0.5&&Math.min(a[3],b[3])-Math.max(a[1],b[1])>0.5; }
    for(var i=0;i<R.length;i++){
      for(var j=i+1;j<R.length;j++) if(cross(R[i].r,R[j].r)){ var k=[R[i].o.cat,R[j].o.cat].sort().join("x");
        pairs[k]=(pairs[k]||0)+1; if(list.length<40) list.push(R[i].o.cat+":"+R[i].o.id+" / "+R[j].o.cat+":"+R[j].o.id); }
      P.forEach(function(p){ if(cross(R[i].r,p)) overPanel.push(R[i].o.id); });
      H.forEach(function(h){ if(cross(R[i].r,h.r)) overHead.push(R[i].o.id+" on the "+h.side+" head of phase "+curPhase); });
    }
    return {visible:R.length, pairs:pairs, examples:list, overPanel:overPanel, overHead:overHead, heads:H.length};
  }
  /* the arrow heads as drawn: every vertex of each head mesh (the casing, the larger) projected, independently of the
     layer's own obstacle list */
  function headRects(){
    var out=[], v=new V(), W0=window.innerWidth, H0=window.innerHeight;
    if(typeof curOv==="undefined"||!curOv||!layerOn.arrows) return out;
    curOv.updateMatrixWorld(true);
    curOv.traverse(function(o){ var d=o.userData&&o.userData.drape; if(!d||d.kind!=="head"||!o.geometry||!effVisible(o)) return;
      if(o.material&&o.material.opacity<0.05) return;
      var P=o.geometry.attributes.position, r=[1e9,1e9,-1e9,-1e9], ok=true;
      for(var i=0;i<P.count;i++){ v.fromBufferAttribute(P,i).applyMatrix4(o.matrixWorld).project(camera); if(v.z>1||v.z<-1){ ok=false; break; }
        var x=(v.x*0.5+0.5)*W0, y=(-v.y*0.5+0.5)*H0; r[0]=Math.min(r[0],x); r[1]=Math.min(r[1],y); r[2]=Math.max(r[2],x); r[3]=Math.max(r[3],y); }
      if(ok&&r[2]>0&&r[0]<W0&&r[3]>0&&r[1]<H0) out.push({r:r,side:o.userData.side||"casing"}); });
    return out;
  }
  /* every text in the layer: its size against its floor (decision 16: 12 px for battle information, 10.5 px for the
     echelon, nation tag, badge, place and terrain-study names) */
  function layerTexts(){
    var out=[];
    if(!hasLayer()) return out;
    Object.keys(ML.items).forEach(function(k){ var it=ML.items[k]; if(!it.on||!it.disp) return;
      var els=[it.el].concat(Array.prototype.slice.call(it.el.querySelectorAll("*")));
      els.forEach(function(e){ var own="", rg=document.createRange(), b=null;
        for(var c=0;c<e.childNodes.length;c++){ var tn=e.childNodes[c]; if(tn.nodeType!==3||!tn.textContent.trim()) continue; own+=tn.textContent;
          rg.selectNodeContents(tn); var rr=rg.getBoundingClientRect();   /* the words' own box: not a mark or an icon beside them */
          b=b?{left:Math.min(b.left,rr.left),top:Math.min(b.top,rr.top),right:Math.max(b.right,rr.right),bottom:Math.max(b.bottom,rr.bottom)}:rr; }
        own=own.replace(/\s+/g," ").trim(); if(!own||!b) return;
        var eb=e.getBoundingClientRect();   /* clipped to the element: a line box can be shorter than the font's ascent and descent */
        b={left:Math.max(b.left,eb.left),top:Math.max(b.top,eb.top),right:Math.min(b.right,eb.right),bottom:Math.min(b.bottom,eb.bottom)};
        var cs=getComputedStyle(e), cls=typeof e.className==="string"?e.className:"";
        var tert=/mlc-ech|mlc-tag|mlc-badge/.test(cls)||/mlt-small/.test(it.el.className);
        out.push({cat:it.cat,id:k,text:own.slice(0,40),px:parseFloat(cs.fontSize),weight:cs.fontWeight,color:cs.color,floor:tert?10.5:12,
          bx:[b.left,b.top,b.right,b.bottom]}); });
    });
    return out;
  }
  /* the pass: the layer's own counts, and its time (median of five passes over the settled view) */
  function layer(){
    if(!hasLayer()) return null;
    var t=[]; for(var i=0;i<5;i++){ var a=performance.now(); mlLayout(); t.push(performance.now()-a); } t.sort(function(x,y){ return x-y; });
    var s=ML.stats, T=layerTexts();
    return {items:s.items,placed:s.placed,leaders:s.leaders,dropped:s.dropped,droppedIds:s.dropped_.slice(),occluded:s.occluded,offscreen:s.offscreen,
            underPanel:s.underPanel,keepMissing:s.keepMissing.slice(),nodes:s.nodes,ms:+t[2].toFixed(2),
            texts:T.length,belowFloor:T.filter(function(x){ return x.px<x.floor; }).map(function(x){ return x.id+" "+x.px+"px<"+x.floor; }),
            minPx:T.length?Math.min.apply(null,T.map(function(x){ return x.px; })):null};
  }
  /* section H: the share of the viewport not under the interface panels (4 px grid), the harness's panel list */
  function unobstructed(){
    var sel=[".rail",".dispatch",".legend",".timebar",".tools","#viewmode","#firstrun",".drawer","#tourbar","#selchip","#layerpop","#vsbadge"];
    var railHidden=document.body.classList.contains("rail-hidden"), R=[];
    sel.forEach(function(s){ document.querySelectorAll(s).forEach(function(e){
      var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||+cs.opacity<0.05||e.hidden) return;
      if((e.classList.contains("rail")&&railHidden)||(e.classList.contains("drawer")&&!e.classList.contains("on"))) return;
      var r=e.getBoundingClientRect(); if(r.width>0&&r.height>0) R.push([r.left,r.top,r.right,r.bottom]); }); });
    var G=4, nx=Math.ceil(innerWidth/G), ny=Math.ceil(innerHeight/G), free=0;
    for(var j=0;j<ny;j++) for(var i=0;i<nx;i++){ var x=i*G+G/2, y=j*G+G/2, cov=false;
      for(var k=0;k<R.length;k++){ var r=R[k]; if(x>=r[0]&&x<r[2]&&y>=r[1]&&y<r[3]){ cov=true; break; } } if(!cov) free++; }
    return +(free/(nx*ny)).toFixed(4);
  }
  /* decision 29: the legend never over the dispatch (the area they share, px) */
  function legendOverDispatch(){
    var lg=document.querySelector(".legend"), dp=document.querySelector(".dispatch");
    function box(e){ if(!e) return null; var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden") return null; var r=e.getBoundingClientRect(); return r.width>0&&r.height>0?r:null; }
    var a=box(lg), b=box(dp); if(!a||!b) return 0;
    return Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
  }
  /* Stage 3B (docs/STAGE3_SPEC.md section H): the legend never over the rail, the dossier or the timebar (the area it shares
     with them, px): stricter than "never over the dispatch", which is vacuous once the dispatch is in the rail */
  function legendOverPanels(){
    var lg=document.querySelector(".legend"); if(!lg) return 0;
    var cs=getComputedStyle(lg); if(cs.display==="none"||cs.visibility==="hidden") return 0;
    var a=lg.getBoundingClientRect(); if(!(a.width>0&&a.height>0)) return 0;
    var sum=0, railHidden=document.body.classList.contains("rail-hidden");
    [".rail",".drawer",".timebar"].forEach(function(q){ var e=document.querySelector(q); if(!e) return; var c=getComputedStyle(e);
      if(c.display==="none"||c.visibility==="hidden") return;
      if((e.classList.contains("rail")&&railHidden)||(e.classList.contains("drawer")&&!e.classList.contains("on"))) return;
      var b=e.getBoundingClientRect(); sum+=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)); });
    return sum;
  }
  /* Stage 3B: where the dispatch stands (in the rail's Now tab, or a card), and whether the legend is open */
  function docking(){
    var dp=document.querySelector(".dispatch"), lg=document.querySelector(".legend");
    return {hasNowTab:!!document.getElementById("tab-now"), dispatchInRail:!!(dp&&dp.closest&&dp.closest(".rail")), docked:document.body.classList.contains("docked"),
      legendOpen:!!(lg&&!lg.classList.contains("collapsed")), tab:(document.querySelector('.tab-btn[aria-selected="true"]')||{dataset:{}}).dataset.t||null};
  }
  /* Stage 3C (docs/STAGE3_SPEC.md sections D and H): the timeline's height; where the presentation switch stands and whether
     the caption's derived reading is shown; and, made current in turn, whether every phase's label is whole */
  function timeline(){
    var tb=document.querySelector(".timebar"), vm=document.getElementById("viewmode"), d=document.querySelector("#tb-cap .der");
    var shown=function(e){ if(!e) return false; var cs=getComputedStyle(e); return cs.display!=="none"&&cs.visibility!=="hidden"&&e.getBoundingClientRect().width>0; };
    return {height:shown(tb)?+tb.getBoundingClientRect().height.toFixed(1):null, hasRow:!!document.getElementById("tb-vm"),
      switchInRow:!!(vm&&vm.closest&&vm.closest(".tb-top")), switchOpacity:vm?+getComputedStyle(vm).opacity:null,
      capDerived:d?shown(d):null};
  }
  function phaseLabels(){
    if(!document.getElementById("tb-vm")||typeof setClock!=="function") return null;
    var t0=clock, cut=[], S=document.querySelectorAll("#phases .step");
    for(var i=0;i<PHASES.length;i++){ setClock(PHASES[i].t0+1,{instant:true,camera:false}); var b=S[i]; if(b.scrollWidth>b.clientWidth+1) cut.push(PHASES[i].label); }
    setClock(t0,{instant:true,camera:false});
    return {width:window.innerWidth, cut:cut};
  }
  /* the section E method on the layer, refined for DOM text (Stage 2D). In each text's box on the rendered frame, the pixels
     at least half the largest RGB distance from its ink are its surround, and the contrast reported is the 10th percentile
     over them. Two refinements: only pixels wholly inside the box are read (section E added 2 px round a sprite's estimated
     box; a DOM box is exact, and its rounded-out edge is ground, not the plate), and the ink's anti-aliased fringe (the
     pixels within 1 px of one nearer the ink than half) is left out of the surround. Without them the 10th percentile
     falls on the fringe: 3.8-4.0:1 for text measured 6.49:1 at the median on its opaque plate (hybrid-dimmed).
     AA: 4.5:1 below 18 px (14 px bold), else 3:1. */
  function textContrast(b64){
    var T=layerTexts();
    return new Promise(function(res){
      var im=new Image();
      im.onload=function(){
        var cv=document.createElement("canvas"); cv.width=im.width; cv.height=im.height;
        var x=cv.getContext("2d",{willReadFrequently:true}); x.drawImage(im,0,0); var d=x.getImageData(0,0,cv.width,cv.height).data;
        function lin(v){ v/=255; return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4); }
        function L(c){ return 0.2126*lin(c[0])+0.7152*lin(c[1])+0.0722*lin(c[2]); }
        var below=[], min=99, n=0, raw=99;
        T.forEach(function(t){
          var m=/rgba?\(([^)]+)\)/.exec(t.color); if(!m) return; var ink=m[1].split(",").map(parseFloat);
          var x0=Math.max(0,Math.ceil(t.bx[0])), y0=Math.max(0,Math.ceil(t.bx[1])), x1=Math.min(cv.width,Math.floor(t.bx[2])), y1=Math.min(cv.height,Math.floor(t.bx[3]));
          var w=x1-x0, h=y1-y0; if(w<2||h<2) return;
          var px=[], dist=[], mx=0, i, j;
          for(j=0;j<h;j++) for(i=0;i<w;i++){ var o=((y0+j)*cv.width+x0+i)*4, q=[d[o],d[o+1],d[o+2]], dd=Math.hypot(q[0]-ink[0],q[1]-ink[1],q[2]-ink[2]);
            px.push(q); dist.push(dd); if(dd>mx) mx=dd; }
          var near=new Uint8Array(w*h);   /* the ink and its 1 px fringe */
          for(j=0;j<h;j++) for(i=0;i<w;i++) if(dist[j*w+i]<0.5*mx) for(var b2=-1;b2<=1;b2++) for(var a2=-1;a2<=1;a2++){ var ii=i+a2, jj=j+b2; if(ii>=0&&jj>=0&&ii<w&&jj<h) near[jj*w+ii]=1; }
          var li=L(ink), cs=[], cr=[];
          for(var k=0;k<px.length;k++){ if(dist[k]<0.5*mx) continue; var lq=L(px[k]), c=(Math.max(li,lq)+0.05)/(Math.min(li,lq)+0.05); cr.push(c); if(!near[k]) cs.push(c); }
          if(!cs.length) return;
          cs.sort(function(a,b){ return a-b; }); cr.sort(function(a,b){ return a-b; });
          var c=cs[Math.floor(cs.length*0.10)], need=(t.px>=18||(t.px>=14&&+t.weight>=600))?3:4.5; n++;
          if(c<min) min=c; raw=Math.min(raw,cr[Math.floor(cr.length*0.10)]);
          if(c<need) below.push(t.id+" \""+t.text+"\" "+c.toFixed(2)+"<"+need);
        });
        res({texts:n, min:n?+min.toFixed(2):null, belowAA:below, rawSectionE:n?+raw.toFixed(2):null});
      };
      im.src="data:image/png;base64,"+b64;
    });
  }

  /* Stage 2E: the paper map's geometry, read from the page as drawn (docs/STAGE2_SPEC.md section J, 2E): the bearing of
     GEOREF.NORTH on screen, screen pixels per true kilometre (east-west, from GEOREF) at four places, the scale bar against
     them, the share of the modelled ground (360 x 310 world units, sampled every 10) on screen and in the unobstructed area,
     and what is drawn and hidden. Runs on any build in staff mode (the perspective staff map before 2E, for comparison). */
  function paperMap(){
    if(typeof mode==="undefined"||mode!=="staff") return null;
    camera.updateMatrixWorld(true);
    var VW=window.innerWidth, VH=window.innerHeight, v=new V();
    function scr(mp){ var w=W(mp[0],mp[1]); v.set(w[0],rg(w[0],w[1]),w[1]).project(camera); return [(v.x*0.5+0.5)*VW,(-v.y*0.5+0.5)*VH]; }
    function perKm(mp){ var g=GEOREF.toGeo(mp[0],mp[1]), dl=0.5/(111.32*Math.cos(g[0]*Math.PI/180)), a=scr(GEOREF.toMap(g[0],g[1]-dl)), b=scr(GEOREF.toMap(g[0],g[1]+dl));
      return +Math.hypot(a[0]-b[0],a[1]-b[1]).toFixed(3); }
    var GT=GEOREF.GT, pb=GT.pratzeberg.map, g=GEOREF.toGeo(pb[0],pb[1]), c=scr(pb), u=scr(GEOREF.toMap(g[0]+0.01,g[1]));
    var brg=Math.atan2(u[0]-c[0],-(u[1]-c[1]))*180/Math.PI;
    var K={pratzeberg:perKm(pb),sokolnitz:perKm(GT.sokolnitz.map),santon:perKm(GT.santon.map),satschan:perKm(GT.satschan.map)}, KV=Object.values(K);
    var kmax=Math.max.apply(null,KV), kmin=Math.min.apply(null,KV), kmean=KV.reduce(function(a,b){ return a+b; },0)/KV.length;
    var lab=(document.getElementById("sb-label")||{}).textContent||"", km=/km/.test(lab)?parseFloat(lab):parseFloat(lab)/1000;
    var sb=document.getElementById("sb-fill"), bw=sb?sb.getBoundingClientRect().width:0;
    /* the harness's own panel list, as unobstructed() reads it */
    var R=[], railHidden=document.body.classList.contains("rail-hidden");
    [".rail",".dispatch",".legend",".timebar",".tools","#viewmode","#firstrun",".drawer","#tourbar","#selchip","#layerpop","#vsbadge"].forEach(function(q){ document.querySelectorAll(q).forEach(function(e){
      var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||+cs.opacity<0.05||e.hidden) return;
      if((e.classList.contains("rail")&&railHidden)||(e.classList.contains("drawer")&&!e.classList.contains("on"))) return;
      var r=e.getBoundingClientRect(); if(r.width>0&&r.height>0) R.push([r.left,r.top,r.right,r.bottom]); }); });
    var n=0, onS=0, inF=0;
    for(var i=0;i<=36;i++) for(var j=0;j<=31;j++){ var x=-180+i*10, z=-155+j*10; v.set(x,rg(x,z),z).project(camera); var sx=(v.x*0.5+0.5)*VW, sy=(-v.y*0.5+0.5)*VH; n++;
      if(sx<0||sy<0||sx>VW||sy>VH) continue; onS++; var cov=false; for(var k=0;k<R.length;k++){ var q=R[k]; if(sx>=q[0]&&sx<=q[2]&&sy>=q[1]&&sy<=q[3]){ cov=true; break; } } if(!cov) inF++; }
    var hidden=[];
    [["trees",world.trees],["conifers",world.conifers],["scrub",world.scrub],["houses",world.houses],["roofs",world.roofs],["spires",world.spires],["chimneys",world.chimneys],["mist",world.mist],["dome",world.dome]]
      .forEach(function(q){ if(q[1]&&effVisible(q[1])) hidden.push(q[0]); });
    Object.keys(units).forEach(function(id){ var r=units[id]; if(r.block&&effVisible(r.block)) hidden.push("figures:"+id); if(r.smoke&&effVisible(r.smoke)) hidden.push("smoke:"+id); if(r.dust&&effVisible(r.dust)) hidden.push("dust:"+id); });
    var drapes=0; if(typeof curOv!=="undefined"&&curOv) curOv.traverse(function(o){ if(o.userData&&o.userData.drape&&o.userData.drape.kind!=="head"&&effVisible(o)) drapes++; });
    var counters=hasLayer()?Object.keys(ML.items).filter(function(k){ return ML.items[k].mode==="counter"&&ML.items[k].on; }).length:0;
    var P=world.paper;
    var drawn={hillshade:(typeof groundPalette!=="undefined"&&groundPalette==="paper"&&effVisible(groundMesh)),contours:!layerOn.contours||effVisible(world.contours),
      villageFootprints:!!(P&&effVisible(P)&&P.userData.villages>0),woods:!!(P&&effVisible(P)&&P.userData.woods>0),
      water:world.water.every(function(w){ return effVisible(w); }),drapedArrows:drapes>0,counters:counters>0};
    var ym=0, GP=groundMesh.geometry.attributes.position.array; for(var q2=1;q2<GP.length;q2+=3) ym=Math.max(ym,Math.abs(GP[q2]));
    return {camera:camera.isOrthographicCamera?"orthographic":"perspective "+camera.fov+"\u00b0", northBearing:+brg.toFixed(3), pxPerKm:K,
      spread:+((kmax-kmin)/kmax).toFixed(5), scaleBar:{label:lab,px:+bw.toFixed(1),want:+(km*kmean).toFixed(1),err:km?+(Math.abs(bw-km*kmean)/(km*kmean)).toFixed(5):null},
      frameOnScreen:+(onS/n).toFixed(4), frameInFree:+(inF/n).toFixed(4), hidden:hidden, drawn:drawn, groundMaxY:+ym.toFixed(4),
      hillshade:(typeof PAPER_HILLSHADE!=="undefined")?PAPER_HILLSHADE:null};
  }

  /* ---- figures on the ground ---- */
  function figureGeos(){ var K=(typeof figKit==="function")?figKit():FIG; return [K.infCoat,K.infFixed,K.horse,K.rider,K.riderFixed]; }
  function figures(){
    var geos=figureGeos(), m=new M4(), p=new V(), n=0, worst=0, sum=0, bad=0, worstId=null;
    Object.keys(units).forEach(function(id){
      var b=units[id].block; if(!b||!effVisible(b)) return;
      b.updateMatrixWorld(true);
      b.traverse(function(o){
        if(!o.isInstancedMesh||geos.indexOf(o.geometry)<0||!effVisible(o)) return;
        for(var i=0;i<o.count;i++){
          o.getMatrixAt(i,m); p.set(0,0,0).applyMatrix4(m).applyMatrix4(o.matrixWorld);
          var e=p.y-rg(p.x,p.z), a=Math.abs(e);
          n++; sum+=a; if(a>0.05) bad++; if(a>worst){ worst=a; worstId=id+(e>0?" floats ":" sinks ")+a.toFixed(2); }
        }
      });
    });
    return {count:n, maxErr:+worst.toFixed(4), meanErr:n?+(sum/n).toFixed(4):0, over005:bad, worst:worstId};
  }
  /* standards: the foot of each pole */
  function standards(){
    var m=new M4(), p=new V(), worst=0, n=0;
    Object.keys(units).forEach(function(id){
      var b=units[id].block, u=b&&b.userData; if(!b||!effVisible(b)||!u||!u.poles) return;
      b.updateMatrixWorld(true);
      for(var i=0;i<u.poles.count;i++){
        u.poles.getMatrixAt(i,m);
        p.set(0,-2.6,0).applyMatrix4(m).applyMatrix4(u.poles.matrixWorld);  /* pole geometry is 5.2 long, centred */
        var a=Math.abs(p.y-rg(p.x,p.z)); n++; if(a>worst) worst=a;
      }
    });
    return {count:n, maxErr:+worst.toFixed(3)};
  }

  /* ---- sprite textures and mist ---- */
  function edgeAlpha(tex){
    if(!tex||!tex.image||!tex.image.getContext) return null;
    var c=tex.image, w=c.width, h=c.height, d=c.getContext("2d").getImageData(0,0,w,h).data, mx=0;
    for(var x=0;x<w;x++){ mx=Math.max(mx,d[(x)*4+3],d[((h-1)*w+x)*4+3]); }
    for(var y=0;y<h;y++){ mx=Math.max(mx,d[(y*w)*4+3],d[(y*w+w-1)*4+3]); }
    return mx;
  }
  function mistEdge(){
    if(!world||!world.mist||!world.mist.visible) return {visible:false};
    var worst=0, band=0;
    world.mist.children.forEach(function(ms){
      if(!ms.visible||!ms.geometry.parameters) return;
      var gp=ms.geometry.parameters, pw=gp.width, ph=gp.height, op=ms.material.opacity;
      var col=ms.geometry.attributes.color, nx=gp.widthSegments||1, ny=gp.heightSegments||1;
      for(var j=0;j<=24;j++) for(var i=0;i<=24;i++){
        var lx=(i/24-0.5)*pw, ly=(j/24-0.5)*ph, x=ms.position.x+lx, z=ms.position.z-ly;
        var r=Math.min(1,Math.hypot(lx/(pw/2),ly/(ph/2)));
        var ta = r<0.6 ? 0.86+(0.52-0.86)*(r/0.6) : 0.52*(1-(r-0.6)/0.4);
        if(ms.userData.haze) ta=ta; 
        var va=1;
        if(col&&col.itemSize===4){
          var fx=(lx/pw+0.5)*nx, fy=(0.5-ly/ph)*ny, ix=Math.min(nx-1,Math.floor(fx)), iy=Math.min(ny-1,Math.floor(fy)), u=fx-ix, v=fy-iy;
          var A=col.array, idx=function(a,b){ return ((b*(nx+1))+a)*4+3; };
          va=(A[idx(ix,iy)]*(1-u)+A[idx(ix+1,iy)]*u)*(1-v)+(A[idx(ix,iy+1)]*(1-u)+A[idx(ix+1,iy+1)]*u)*v;
        }
        var g=rg(x,z), dy=ms.position.y-g;
        if(dy<0.45&&dy>-0.05){ band++; worst=Math.max(worst,ta*op*va); }
      }
    });
    return {visible:true, crossingSamples:band, maxAlphaAtCrossing:+worst.toFixed(3)};
  }

  /* ---- everything for one case ---- */
  function metrics(){
    camera.updateMatrixWorld(true);
    var c=camera.position;
    return {
      clock:(typeof fmtClock==="function")?fmtClock(clock):null, phase:curPhase, mode:mode, presentation:presentation,
      camera:{pos:[+c.x.toFixed(2),+c.y.toFixed(2),+c.z.toFixed(2)], clearance:+(c.y-groundMax(c.x,c.z,1.5)).toFixed(3)},
      groundSelfCheck:+selfCheckGround().toFixed(6),
      figures:figures(), standards:standards(), labels:overlaps(),
      smokeEdgeAlpha:(typeof _smokeTex!=="undefined")?edgeAlpha(_smokeTex):null,
      dustEdgeAlpha:(typeof _dustTex!=="undefined")?edgeAlpha(_dustTex):null,
      mist:mistEdge(),
      selection:selection?selection.kind+":"+selection.id:null,
      highlightOn:!!highlight,
      drawerVisible:(function(){ var d=document.getElementById("drawer"); if(!d) return false; var cs=getComputedStyle(d); return d.classList.contains("on")&&cs.display!=="none"; })(),
      chipVisible:(function(){ var d=document.getElementById("selchip"); if(!d) return null; return !d.hidden&&getComputedStyle(d).display!=="none"; })(),
      firstRunVisible:(function(){ var d=document.getElementById("firstrun"); return !!d&&!d.hidden; })(),
      dispatchVisible:(function(){ var d=document.querySelector(".dispatch"); return !!d&&getComputedStyle(d).display!=="none"&&d.getBoundingClientRect().width>0; })(),
      stats:(D()&&D().stats)?D().stats():null,
      layer:layer(), unobstructed:unobstructed(), legendOverDispatch:legendOverDispatch(), paper:paperMap(),
      legendOverPanels:legendOverPanels(), docking:docking(), viewport:[window.innerWidth,window.innerHeight], timeline:timeline(),
      heads:headsHidden(), focus:focusOffset(), smoke:smokeShare(), smokePuffs:(typeof SMOKE!=="undefined")
    };
  }
  /* Stage 4E (docs/STAGE4_SPEC.md section E.3; the measure of tools/stage4/extras-probe.js): the smoke's share of the free
     rectangle, each visible smoke sprite's projected square (its own scale, at its distance), clipped to the rectangle, overlaps
     counted twice; read from the scene, not from the app's own cap. A build with one sprite per formation or with puffs. */
  function smokeShare(){
    if(typeof units==="undefined"||camera.isOrthographicCamera) return null;
    camera.updateMatrixWorld(true);
    var fr=(typeof landFreeRect==="function")?landFreeRect():MAPCAM.freeRect(), A=(fr[2]-fr[0])*(fr[3]-fr[1]), H=window.innerHeight, t=Math.tan(camera.fov*Math.PI/360), S=0, n=0, v=new V();
    Object.keys(units).forEach(function(id){ var g=units[id].smoke; if(!g||!g.visible) return;
      (g.isSprite?[g]:g.children).forEach(function(s){ if(!s.visible||s.material.opacity<0.02) return;
        var p=s.getWorldPosition(new V()), c=p.clone().applyMatrix4(camera.matrixWorldInverse); if(c.z>-1) return;
        v.copy(p).project(camera); var x=(v.x*0.5+0.5)*window.innerWidth, y=(-v.y*0.5+0.5)*H, w=s.scale.x*H/(2*(-c.z)*t), h=s.scale.y*H/(2*(-c.z)*t);
        var x0=Math.max(fr[0],x-w/2), x1=Math.min(fr[2],x+w/2), y0=Math.max(fr[1],y-h/2), y1=Math.min(fr[3],y+h/2); n++;
        if(x1>x0&&y1>y0) S+=(x1-x0)*(y1-y0)/A; }); });
    return {sprites:n, share:+S.toFixed(4)};
  }
  /* Stage 3D (docs/STAGE3_SPEC.md section H; the measure of tools/stage3/dock-probe.js): the arrow heads on screen, and those
     more than a quarter hidden, under one panel or off the screen's edge (a box partly off screen counts its off-screen part) */
  function headsHidden(){
    var H=headRects(), P=panelRects(), W0=window.innerWidth, H0=window.innerHeight, n=0, list=[];
    H.forEach(function(h){ var r=h.r, a=Math.max(1e-9,(r[2]-r[0])*(r[3]-r[1])), worst=0;
      P.forEach(function(q){ var ix=Math.max(0,Math.min(r[2],q[2])-Math.max(r[0],q[0])), iy=Math.max(0,Math.min(r[3],q[3])-Math.max(r[1],q[1])); worst=Math.max(worst,ix*iy); });
      var on=Math.max(0,Math.min(r[2],W0)-Math.max(r[0],0))*Math.max(0,Math.min(r[3],H0)-Math.max(r[1],0)), hid=Math.min(a,worst+(a-on));
      if(hid>0.25*a){ n++; list.push(h.side+" head "+Math.round(100*hid/a)+"% hidden"); } });
    return {heads:H.length, hiddenOverQuarter:n, list:list};
  }
  /* Stage 3D: the landscape's orbit target against the free rectangle's centre (px), on a build with the view offset */
  function focusOffset(){
    if(typeof syncViewOffset!=="function"||camera.isOrthographicCamera) return null;
    var fr=(typeof landFreeRect==="function")?landFreeRect():MAPCAM.freeRect(), v=new V().copy(orbitTarget); camera.updateMatrixWorld(true); v.project(camera);
    var x=(v.x*0.5+0.5)*window.innerWidth, y=(-v.y*0.5+0.5)*window.innerHeight;
    return +Math.hypot(x-(fr[0]+fr[2])/2,y-(fr[1]+fr[3])/2).toFixed(3);
  }

  /* ---- pixels of a screenshot, outside the interface panels ---- */
  function panelRects(){
    var sel=[".rail",".dispatch",".legend",".timebar",".tools","#viewmode","#firstrun",".drawer","#tourbar","#selchip","#devstats","#restore","#layerpop","#vsbadge","#toast"];
    var railHidden=document.body.classList.contains("rail-hidden");
    var R=[];
    sel.forEach(function(s){ document.querySelectorAll(s).forEach(function(e){
      var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||+cs.opacity<0.05||e.hidden) return;
      if((e.classList.contains("rail")&&railHidden)||(e.classList.contains("drawer")&&!e.classList.contains("on"))) return;
      var r=e.getBoundingClientRect(); if(r.width>0&&r.height>0) R.push([r.left,r.top,r.right,r.bottom]); }); });
    return R;
  }
  function pixels(b64){
    return new Promise(function(res){
      var im=new Image();
      im.onload=function(){
        var cv=document.createElement("canvas"); cv.width=im.width; cv.height=im.height;
        var x=cv.getContext("2d"); x.drawImage(im,0,0);
        var d=x.getImageData(0,0,cv.width,cv.height).data, R=panelRects(), n=0, blk=0, lum=0;
        function inUI(xx,y){ for(var k=0;k<R.length;k++){ var r=R[k]; if(xx>=r[0]&&xx<r[2]&&y>=r[1]&&y<r[3]) return true; } return false; }
        for(var y=0;y<cv.height;y+=2) for(var xx=0;xx<cv.width;xx+=2){
          if(inUI(xx,y)) continue;
          var o=(y*cv.width+xx)*4, mx=Math.max(d[o],d[o+1],d[o+2]); n++;
          if(mx<16) blk++; lum+=0.2126*d[o]+0.7152*d[o+1]+0.0722*d[o+2];
        }
        /* a slope clipped to black forms solid regions; a shako, a letter or a pole does not.
           Count 8x8 blocks outside the panels that are at least 90% near-black. */
        var B=8, solid=0, blocks=0;
        for(var by=0;by+B<=cv.height;by+=B) for(var bx=0;bx+B<=cv.width;bx+=B){
          if(inUI(bx,by)||inUI(bx+B-1,by+B-1)) continue;
          blocks++; var c=0;
          for(var yy=by;yy<by+B;yy++) for(var x2=bx;x2<bx+B;x2++){ var o2=(yy*cv.width+x2)*4; if(Math.max(d[o2],d[o2+1],d[o2+2])<16) c++; }
          if(c>=0.9*B*B) solid++;
        }
        res({samples:n, nearBlack:n?+(blk/n).toFixed(4):0, solidBlack:blocks?+(solid/blocks).toFixed(5):0, solidBlocks:solid, meanLum:n?+(lum/n).toFixed(1):0});
      };
      im.src="data:image/png;base64,"+b64;
    });
  }

  window.__aus={apply:apply, metrics:metrics, pixels:pixels, rg:rg, groundMax:groundMax, figures:figures,
                overlaps:overlaps, aimOf:aimOf, effVisible:effVisible, unobstructed:unobstructed, textContrast:textContrast, layerTexts:layerTexts,
                legendOverDispatch:legendOverDispatch, headRects:headRects, paperMap:paperMap, legendOverPanels:legendOverPanels, docking:docking, timeline:timeline, phaseLabels:phaseLabels, headsHidden:headsHidden, focusOffset:focusOffset, smokeShare:smokeShare};
})();
