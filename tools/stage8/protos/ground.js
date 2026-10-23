/* Stage 8 Part A (docs/STAGE8_SPEC.md section 2): the ground cues under the troops (the owner's note L1, "the coloured glow underneath troops
   and divisions ... remove it; it looks clunky"), prototyped in the live page only. Each alternative switches the build's own marks off
   (CONF.none, the measurement switch the app never sets: no mark but the 1x footprint) and draws its own after every state pass
   (updateVisibility wrapped), from the same blocks, yaws and footprints the build's marks use (units[id].block.userData W0, sw, D0, sd;
   rec.yaw; the side's tokens). Nothing at 1x is touched (decision 34: there the footprint is the formation). Alternatives:
   - none:     no ground cue at all (the roadmap's option (a): side by names, counters and coats only; the grade by the names' badges and the
               dossier). Also the reference the others' screen share is measured against;
   - marker:   a small side marker: a chevron on the ground just ahead of the formation's front, about MARK_PX px across at its distance
               (a screen size, as the skeleton's anchors are), in the side's base colour with the side's edge colour as its casing, pointing
               the way the block faces; depth-tested (hills and nearer figures hide it), lifted as the build's marks are;
   - outline:  a thin crisp outline of the footprint the build's A mark fills (W0 sw x D0 sd), about LINE_PX px wide, cased, in the side's
               colour; no fill, no glow (the roadmap's option (b) without the grade);
   - selonly:  nothing under unselected formations; the selected formation (and its highlighted family) outlined in the interface's accent
               (the build's selection ellipse hidden while this one is shown): the "restrained selection outline";
   - confline: the optional confidence layer redrawn as outlines: each formation's grade extent (decision 86: A the footprint, B the
               frontage doubled, C a disc of its frontage's radius) as a crisp outline, the line thinner as the grade weakens (A 2.0 px,
               B 1.5 px, C 1.1 px); no dash (decisions 15, 85), no fill, no new hue (decision 1).
   Sizes in px are DESIGN VALUES for the prototype. */
"use strict";
const inPage=function(){
  if(window.__g8) return true;
  window.__p8=window.__p8||{};
  var G={style:null, recs:{}, grp:null, orig:null, selHidden:false};
  var MARK_PX=15, LINE_PX=1.7, LIFT=0.18, CASE=2.0;
  var _v=new THREE.Vector3();
  function chevTex(){
    if(G.tex) return G.tex;
    var N=64, cv=document.createElement("canvas"); cv.width=cv.height=N; var x=cv.getContext("2d");
    function chev(sc,col){ x.save(); x.translate(N/2,N/2); x.scale(sc,sc); x.beginPath(); x.moveTo(0,-26); x.lineTo(24,18); x.lineTo(0,6); x.lineTo(-24,18); x.closePath(); x.fillStyle=col; x.fill(); x.restore(); }
    chev(1.0,"#2a2f36"); chev(0.72,"#ffffff");   /* the casing darkened by the side's colour (white x side = the fill; the casing multiplies to near black) */
    var t=new THREE.CanvasTexture(cv); t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping; G.tex=t; return t;
  }
  function mat(hex,op,order){ var m=new THREE.MeshBasicMaterial({color:lin(hex),transparent:true,opacity:op,depthWrite:false,fog:false,
      polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}); return m; }
  function rec(id){
    var R=G.recs[id]; if(R) return R;
    var sd=sideOfNation(FORMATIONS[id].nation), S=TOKENS.sym.side[sd];
    R=G.recs[id]={sd:sd};
    R.mark=new THREE.Mesh(new THREE.BufferGeometry(),new THREE.MeshBasicMaterial({color:lin(hexNum(S.base)),map:chevTex(),transparent:true,depthWrite:false,fog:false,
      polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2})); R.mark.userData.conf={dims:"",key:""}; R.mark.renderOrder=5; R.mark.frustumCulled=false;
    R.lineC=new THREE.Mesh(new THREE.BufferGeometry(),mat(hexNum(S.edge),0.55)); R.lineC.renderOrder=5; R.lineC.frustumCulled=false;
    R.line=new THREE.Mesh(new THREE.BufferGeometry(),mat(hexNum(S.base),0.95)); R.line.renderOrder=6; R.line.frustumCulled=false;
    [R.mark,R.lineC,R.line].forEach(function(m){ m.visible=false; G.grp.add(m); });
    return R;
  }
  /* a closed polyline on the drawn ground as a strip hw wide (world units), every vertex lift above groundY */
  function strip(mesh,pts,hw,lift){
    var P=[], I=[], n=pts.length;
    for(var i=0;i<n;i++){ var a=pts[i], b=pts[(i+1)%n], dx=b[0]-a[0], dz=b[1]-a[1], L=Math.hypot(dx,dz)||1, nx=-dz/L*hw, nz=dx/L*hw;
      var k=Math.max(1,Math.ceil(L/0.5));
      for(var j=0;j<=k;j++){ var x=a[0]+dx*j/k, z=a[1]+dz*j/k, o=P.length/3;
        P.push(x+nx,groundY(x+nx,z+nz)+lift,z+nz, x-nx,groundY(x-nx,z-nz)+lift,z-nz);
        if(j<k) I.push(o,o+2,o+1, o+1,o+2,o+3); } }
    var g=mesh.geometry; g.dispose(); g=new THREE.BufferGeometry(); g.setAttribute("position",new THREE.Float32BufferAttribute(P,3)); g.setIndex(I); mesh.geometry=g;
  }
  function rectPts(x,z,yaw,w,d){ var c=Math.cos(yaw), s=Math.sin(yaw), out=[];
    [[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]].forEach(function(q){ var u=q[0], v=q[1]; out.push([x+u*c+v*s, z-u*s+v*c]); }); return out; }
  function discPts(x,z,r){ var out=[]; for(var i=0;i<48;i++){ var t=i/48*Math.PI*2; out.push([x+Math.cos(t)*r,z+Math.sin(t)*r]); } return out; }
  function place(){
    var st=G.style, trueScale=isTrueScale(), sel=selection&&selection.kind==="f"?selection.id:null;
    Object.keys(units).forEach(function(id){
      var u=units[id], R=rec(id), b=u.block, fu=b.userData;
      R.mark.visible=R.line.visible=R.lineC.visible=false;
      if(!b.visible||trueScale||mode==="staff"||!fu) return;
      var x=b.position.x, z=b.position.z, yaw=u.yaw||0, w=fu.W0*fu.sw, d=fu.D0*fu.sd, wpp=worldPerPx(_v.set(x,groundY(x,z),z));
      var inFam=sel&&(sel===id||(highlight&&highlight[id]));
      if(st==="marker"){
        var S=Math.max(0.35,Math.min(MARK_PX*wpp,Math.max(w,d)*0.9)), off=d*0.5*b.scale.x+S*0.75, fx=x+Math.sin(yaw)*off, fz=z+Math.cos(yaw)*off;
        groundPatch(R.mark,R.mark.userData.conf,fx,fz,yaw,S,S,LIFT); R.mark.visible=true; return; }
      var line=null, px=LINE_PX, col=null;
      if(st==="outline") line=rectPts(x,z,yaw,w,d);
      else if(st==="selonly"){ if(!inFam) return; line=rectPts(x,z,yaw,w*1.25+1.2,d*1.25+1.2); px=2.0; col=hexNum(TOKENS.theme.dark.accent); }
      else if(st==="confline"){ var g=confAt(id,clock).cf; px=g==="A"?2.0:g==="B"?1.5:1.1;
        line=g==="A"?rectPts(x,z,yaw,w,d):g==="B"?rectPts(x,z,yaw,2*w,d):discPts(x,z,w); }
      if(!line) return;
      var hw=Math.max(0.02,Math.min(0.6,px*wpp/2)), key=[st,x.toFixed(3),z.toFixed(3),yaw.toFixed(4),w.toFixed(3),d.toFixed(3),hw.toFixed(3),DISPLAY.factor].join("|");
      if(R.key!==key){ R.key=key; strip(R.lineC,line,hw*CASE,LIFT-0.02); strip(R.line,line,hw,LIFT); }   /* rebuilt only when it moved, turned or rescaled */
      R.line.material.color.copy(lin(col!=null?col:hexNum(TOKENS.sym.side[R.sd].base)));
      R.line.visible=R.lineC.visible=true;
    });
    if(selRing){ var hide=(st==="selonly"); if(hide){ selRing.visible=false; } }
  }
  function install(style){
    if(G.style) uninstall();
    G.style=style; G.grp=new THREE.Group(); scene.add(G.grp); G.recs={};
    G.conf0=CONF.none; CONF.none=true;
    G.orig=window.updateVisibility;
    window.updateVisibility=function(){ G.orig(); place(); };
    updateVisibility(); requestRender(3);
    return {style:style};
  }
  function uninstall(){
    if(!G.style) return;
    window.updateVisibility=G.orig; CONF.none=G.conf0; scene.remove(G.grp);
    G.grp.traverse(function(o){ if(o.geometry) o.geometry.dispose(); if(o.material) o.material.dispose(); });
    G.grp=null; G.recs={}; G.style=null; updateVisibility(); requestRender(3);
  }
  ["none","marker","outline","selonly","confline"].forEach(function(s){ window.__p8["g-"+s]={install:function(){ return install(s); }, uninstall:uninstall}; });
  window.__g8=G; return true;
};
module.exports={inPage, ids:{"g-none":{},"g-marker":{},"g-outline":{},"g-selonly":{},"g-confline":{}}};
