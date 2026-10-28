/* Stage 8, implementation PR 8F (decision 247 (a); docs/STAGE8_SPEC.md sections 7.3 and 18): the woods' deciduous trees in December, prototyped
   in the live page only, before anything is built ("8F begins with a prototype measured against 2F's checks"). What the build draws (world.js
   treeKit): four bare deciduous habits, each a trunk and two or three crowns, every crown an icosahedron (detail 2: 180 faces in r128) pushed in
   and out along its normals, solid and flat-shaded: from a wood's edge a faceted grey mass, "a boulder" (section 7.3); 380 to 560 triangles a
   tree. The scrub (one bush, two such crowns: 360). The conifers are not touched (their shares are the build's, pending evidence).
   Every prototype keeps the instances as they are (the same meshes, matrices, colours, seating and counts): only each habit's geometry, and in
   t-lace a second mesh per habit, change. Each is a DESIGN value, none a claim:
   - t-open:  each crown a twig shell: the same jittered icosahedron (so the crown's envelope is the build's), about half of its faces kept
              (a seeded choice), each kept face shrunk toward its centre, so the shell is perforated and its far side shows through; inside it
              the trunk forks into main limbs toward each crown, each limb ending in two twigs toward the shell. Opaque, the material the build's
              but drawn on both faces (the shell's inner side is seen through its gaps). No transparency, no new program;
   - t-airy:  t-open more open (fewer faces kept, smaller);
   - t-lace:  the trunk and limbs of t-open, and in place of each shell three crossed vertical cards and one level card with a twig texture
              (a canvas painted here: branching strokes on transparent ground), alpha-tested (no blending, so nothing is sorted) and casting
              their twigs' shadow through a depth material with the same test: the transparency option, measured for its overdraw, its
              shimmer and its shadows (the decision: "measure transparency costs if introduced").
   The scrub in every variant: t-open's treatment, one shell pair and two stems. Every geometry and material is restored on uninstall. */
"use strict";
const inPage=function(){
  if(window.__t8) return true;
  window.__p8=window.__p8||{};
  var T8={on:null, undo:[]};
  /* a tapered prism from p0 to p1 (radii r0, r1, n sides), outward-wound triangles */
  function prism(P,p0,p1,r0,r1,n,tw){
    var ax=p1[0]-p0[0], ay=p1[1]-p0[1], az=p1[2]-p0[2], L=Math.hypot(ax,ay,az)||1; ax/=L; ay/=L; az/=L;
    var hx=Math.abs(ay)<0.9?0:1, hy=Math.abs(ay)<0.9?1:0, ux=hy*az-0*ay, uy=0*ax-hx*az, uz=hx*ay-hy*ax, ul=Math.hypot(ux,uy,uz)||1; ux/=ul; uy/=ul; uz/=ul;
    var vx=ay*uz-az*uy, vy=az*ux-ax*uz, vz=ax*uy-ay*ux, ring=function(p,r,i){ var a=2*Math.PI*i/n+(tw||0), c=Math.cos(a)*r, s=Math.sin(a)*r; return [p[0]+ux*c+vx*s, p[1]+uy*c+vy*s, p[2]+uz*c+vz*s]; };
    for(var i=0;i<n;i++){ var a0=ring(p0,r0,i), a1=ring(p0,r0,i+1), b0=ring(p1,r1,i), b1=ring(p1,r1,i+1);
      P.push(a0[0],a0[1],a0[2], a1[0],a1[1],a1[2], b1[0],b1[1],b1[2]);  P.push(a0[0],a0[1],a0[2], b1[0],b1[1],b1[2], b0[0],b0[1],b0[2]); }
  }
  /* the build's crown (treeKit's crown(seed): the same icosahedron, the same jitter), its faces kept by a seeded choice and shrunk */
  function shell(P,seed,c,s,keep,shrink){
    var g=new THREE.IcosahedronGeometry(1,2), pa=g.attributes.position.array.slice(); g.dispose();
    for(var i=0;i<pa.length;i+=3){ var k=0.78+0.44*hash2(Math.round(pa[i]*13+seed),Math.round(pa[i+1]*7+pa[i+2]*11)); pa[i]*=k; pa[i+1]*=k*0.92; pa[i+2]*=k; }
    for(var f=0;f<pa.length/9;f++){ if(hash2(f*7+seed*131,seed*17+3)>keep) continue;
      var o=f*9, cx=(pa[o]+pa[o+3]+pa[o+6])/3, cy=(pa[o+1]+pa[o+4]+pa[o+7])/3, cz=(pa[o+2]+pa[o+5]+pa[o+8])/3;
      for(var v=0;v<3;v++){ var q=o+v*3; P.push(c[0]+s[0]*(cx+(pa[q]-cx)*shrink), c[1]+s[1]*(cy+(pa[q+1]-cy)*shrink), c[2]+s[2]*(cz+(pa[q+2]-cz)*shrink)); } }
  }
  /* the four habits, as treeKit draws them: the trunk's height and each crown's seed, centre and radii */
  var HAB=[{T:1.1, cr:[[1,[0,2.0,0],[1.25,1.05,1.25]],[2,[0.55,2.35,0.2],[0.75,0.7,0.75]],[3,[-0.5,2.25,-0.3],[0.7,0.62,0.7]]]},
           {T:1.5, cr:[[2,[0,2.4,0],[0.95,1.1,0.95]],[3,[0.1,3.4,0.1],[0.7,0.85,0.7]]]},
           {T:0.8, cr:[[3,[0,1.6,0],[1.55,0.85,1.45]],[1,[0.8,1.7,0],[0.7,0.55,0.7]],[2,[-0.75,1.65,0.3],[0.65,0.5,0.65]]]},
           {T:1.2, cr:[[2,[0,2.4,0],[0.62,1.5,0.62]],[3,[0,3.5,0],[0.45,0.8,0.45]]]}];
  /* the trunk and the limbs: the trunk to its fork, four main limbs into the main crown (two twigs each toward its shell), one limb into each
     other crown (two twigs); each limb's direction a seeded jitter */
  function limbs(P,h,vi){
    var F=[0,h.T,0]; prism(P,[0,0,0],F,0.16,0.11,6);
    h.cr.forEach(function(C,ci){ var c=C[1], s=C[2], nL=ci===0?4:1;
      for(var k=0;k<nL;k++){ var a=(ci===0?Math.PI/4+k*Math.PI/2:Math.atan2(c[2],c[0]))+0.5*(hash2(vi*17+ci*5+k,11)-0.5), e=ci===0?0.55+0.25*hash2(vi*13+k,5):0.0;
        var tip=ci===0?[c[0]+Math.cos(a)*s[0]*0.55, c[1]+(e-0.2)*s[1]*0.6, c[2]+Math.sin(a)*s[2]*0.55]:[c[0],c[1],c[2]];
        prism(P,F,tip,0.085,0.045,4,a);
        for(var t=0;t<2;t++){ var b=a+(t?0.6:-0.6)+0.3*(hash2(vi*29+ci*7+k*3+t,23)-0.5), up=0.35+0.4*hash2(vi*31+k*5+t,41);
          var end=[c[0]+Math.cos(b)*s[0]*0.88*(ci===0?1:0.7), c[1]+up*s[1]*0.8, c[2]+Math.sin(b)*s[2]*0.88*(ci===0?1:0.7)];
          prism(P,tip,end,0.04,0.014,3,b); } } });
  }
  function geo(P){ var g=new THREE.BufferGeometry(); g.setAttribute("position",new THREE.Float32BufferAttribute(P,3)); g.computeVertexNormals(); g.computeBoundingSphere(); return g; }
  function openTree(vi,keep,shrink){ var h=HAB[vi], P=[]; limbs(P,h,vi); h.cr.forEach(function(C){ shell(P,C[0],C[1],C[2],keep,shrink); }); return geo(P); }
  function limbsOnly(vi){ var P=[]; limbs(P,HAB[vi],vi); return geo(P); }
  function openScrub(keep,shrink){ var P=[]; prism(P,[0,0,0],[0.05,0.55,0],0.05,0.02,3); prism(P,[0.1,0,0.05],[0.55,0.45,0.2],0.04,0.016,3);
    shell(P,1,[0,0.5,0],[1,0.6,0.9],keep,shrink); shell(P,1,[0.6,0.4,0.2],[0.6,0.45,0.55],keep,shrink); return geo(P); }
  /* t-lace: a crown's cards (three vertical at 60 degrees, one level), its uv the card's own */
  function cards(vi){ var h=HAB[vi], P=[], U=[];
    h.cr.forEach(function(C){ var c=C[1], s=C[2];
      for(var k=0;k<3;k++){ var a=k*Math.PI/3+0.3*hash2(vi*7+k,3), dx=Math.cos(a)*s[0], dz=Math.sin(a)*s[2], y0=c[1]-s[1], y1=c[1]+s[1];
        var A=[c[0]-dx,y0,c[2]-dz], B=[c[0]+dx,y0,c[2]+dz], Cc=[c[0]+dx,y1,c[2]+dz], D=[c[0]-dx,y1,c[2]-dz];
        P.push.apply(P,A.concat(B,Cc,A,Cc,D)); U.push(0,0,1,0,1,1,0,0,1,1,0,1); }
      var y=c[1]+0.1*s[1], A2=[c[0]-s[0],y,c[2]-s[2]], B2=[c[0]+s[0],y,c[2]-s[2]], C2=[c[0]+s[0],y,c[2]+s[2]], D2=[c[0]-s[0],y,c[2]+s[2]];
      P.push.apply(P,A2.concat(B2,C2,A2,C2,D2)); U.push(0,0,1,0,1,1,0,0,1,1,0,1); });
    var g=new THREE.BufferGeometry(); g.setAttribute("position",new THREE.Float32BufferAttribute(P,3)); g.setAttribute("uv",new THREE.Float32BufferAttribute(U,2)); g.computeVertexNormals(); g.computeBoundingSphere(); return g; }
  var _tw=null;
  function twigTexture(){ if(_tw) return _tw;
    var c=document.createElement("canvas"); c.width=c.height=256; var x=c.getContext("2d"); x.clearRect(0,0,256,256); x.strokeStyle="#ffffff"; x.lineCap="round";
    var seed=5; function r(){ seed=(seed*1664525+1013904223)%4294967296; return seed/4294967296; }
    function br(px,py,a,len,w,d){ if(d>6||len<4) return; var qx=px+Math.cos(a)*len, qy=py+Math.sin(a)*len; x.lineWidth=w; x.beginPath(); x.moveTo(px,py); x.lineTo(qx,qy); x.stroke();
      var n=d<2?3:2; for(var i=0;i<n;i++) br(qx,qy,a+(r()-0.5)*1.3,len*(0.62+r()*0.18),Math.max(0.6,w*0.66),d+1); }
    for(var k=0;k<7;k++) br(128,250,-Math.PI/2+(r()-0.5)*1.4,46+r()*20,3.2,0);
    _tw=new THREE.CanvasTexture(c); _tw.anisotropy=4; return _tw; }
  function keepMesh(im){ var m0={geo:im.geometry, side:im.material.side}; T8.undo.push(function(){ im.geometry.dispose(); im.geometry=m0.geo; im.material.side=m0.side; im.material.needsUpdate=true; }); }
  function install(kind){
    if(T8.on) uninstall(); T8.on=kind;
    var kit=treeKit(), keep=kind==="t-airy"?0.42:0.55, shrink=kind==="t-airy"?0.70:0.80;
    world.trees.children.forEach(function(im){ var vi=kit.broad.indexOf(im.geometry); if(vi<0) return; keepMesh(im);
      if(kind==="t-lace"){ im.geometry=limbsOnly(vi);
        var mat=new THREE.MeshStandardMaterial({color:0xFFFFFF, map:twigTexture(), alphaTest:0.45, side:THREE.DoubleSide, roughness:1, metalness:0, envMapIntensity:im.material.envMapIntensity});
        var lace=new THREE.InstancedMesh(cards(vi),mat,im.count); lace.instanceMatrix.copy(im.instanceMatrix); lace.instanceMatrix.needsUpdate=true;
        if(im.instanceColor){ lace.instanceColor=im.instanceColor.clone(); lace.instanceColor.needsUpdate=true; }
        lace.castShadow=true; lace.customDepthMaterial=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking, map:twigTexture(), alphaTest:0.45, side:THREE.DoubleSide});
        lace.frustumCulled=false; world.trees.add(lace); T8.undo.push(function(){ world.trees.remove(lace); lace.geometry.dispose(); mat.dispose(); lace.customDepthMaterial.dispose(); });
      } else { im.geometry=openTree(vi,keep,shrink); im.material.side=THREE.DoubleSide; im.material.needsUpdate=true; } });
    if(world.scrub){ keepMesh(world.scrub); world.scrub.geometry=openScrub(kind==="t-airy"?0.45:0.58,kind==="t-airy"?0.72:0.82); world.scrub.material.side=THREE.DoubleSide; world.scrub.material.needsUpdate=true; }
    requestRender(3); return {kind:kind, tris:T8.tris()};
  }
  function uninstall(){ while(T8.undo.length) T8.undo.pop()(); T8.on=null; requestRender(3); }
  /* triangles a tree, by habit, as installed (the build's when nothing is) */
  T8.tris=function(){ var o={broad:[], scrub:0, lace:[]}, kit=treeKit();
    world.trees.children.forEach(function(im){ var g=im.geometry, n=(g.index?g.index.count:g.attributes.position.count)/3; if(im.material.map) o.lace.push(n); else o.broad.push(n); });
    if(world.scrub){ var g=world.scrub.geometry; o.scrub=(g.index?g.index.count:g.attributes.position.count)/3; } return o; };
  ["t-open","t-airy","t-lace"].forEach(function(k){ window.__p8[k]={install:function(){ return install(k); }, uninstall:uninstall}; });
  window.__t8=T8; return true;
};
module.exports={inPage, ids:{"t-open":{},"t-airy":{},"t-lace":{}}};
