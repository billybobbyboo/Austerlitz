/* Stage 8 Part A (docs/STAGE8_SPEC.md section 6): the buildings (the owner's note L5), prototyped in the live page only. The villages are
   rebuilt from the build's own data (world.js VILLAGES: each village's place and its number of houses; CHURCHES; the lane each village's houses
   follow, the nearest road within 14 units, else the build's own seeded direction), at the build's building scale (about 10-15 times life,
   the legend's words); the build's houses, roofs, chimneys and spires are hidden while a prototype stands and shown again after. Nothing
   moves a village's place or extent (the extents are a data question, Stage 2E). What is DESIGN and what waits on evidence:
   - the composition: houses gable-end to the lane on both sides, a yard behind each with a barn across its end on about half the plots;
     a common pattern of the region's "street villages", stated here as a design value until the cadastre's plans are read
     (docs/stage8-evidence/leads.md, topic 2);
   - the roof: a steep gable (its height about half the house's width), two materials, thatch (straw-grey) and tile (red-brown), in a share
     ROOF_TILE that is a placeholder (the Stable Cadastre of the 1820s-30s colours buildings by material: its reading would set it);
   - walls whitewashed over a darker plinth, two small windows in the gable to the lane, a door to the yard; a chimney on the ridge;
   - churches (the build's CHURCHES list): a nave, a polygonal east end and a west tower with a plain pyramidal helm, generic (no church's
     own form is claimed);
   b-landmarks adds what the leads read for this session support (docs/stage8-evidence/leads.md, items 43, 47-53): the chapel of St Anthony
   above Augezd (FEATURES chapel, approximate) drawn as a small chapel with its roof (its existence on the day is an eyewitness's, Stutterheim
   1806, B; its form is GENERIC; the data's "lost its roof about the time of the battle" rests on a modern town text, C, so the roofless form is
   not drawn); the Sokolnitz castle as the regular quadrangle round a court that Wolny (1837, B) and the 1825 indication sketch (B) give, its
   east front two storeys and the other three one, in place of the build's three wings and corner block, at the build's own place; and the
   fences round Telnitz and Sokolnitz ("mit Zäunen und Gräben umgeben", Schönhals 1873 p. 155, B) as a low fence along each village's drawn
   cover edge (the line is the drawn edge: an assumption). The pheasantry's wall is not drawn: its date is disputed (a regional site, C, puts
   it in the second half of the 19th century) and Wolny names only the orchard as walled. b-village keeps the build's own castle. */
"use strict";
const inPage=function(){
  if(window.__b8) return true;
  window.__p8=window.__p8||{};
  var B={on:null, grp:null, hidden:[], upd:null}, ROOF_TILE=0.4;
  var col={wall:0xD9D2C1, wall2:0xCFC6B2, plinth:0x6E655A, window:0x2B2A28, door:0x4A3A2A, thatch:0x8B7D5E, thatch2:0x9A8A66, tile:0x9A4A33, tile2:0xA85A3E,
    barn:0x6E5E4A, chimney:0xB9B0A0, tower:0xE0D9C8, helm:0x4F5254, chapel:0xCFC8B6, fence:0x6B5A44};
  function lane(cc){ var best=1e9, dir=0.3; ROADS.forEach(function(r){ var pts=M2W(r.p); for(var k=0;k<pts.length-1;k++){ var dd=segDist(cc[0],cc[1],pts[k][0],pts[k][1],pts[k+1][0],pts[k+1][1]);
      if(dd<best){ best=dd; dir=Math.atan2(pts[k+1][1]-pts[k][1],pts[k+1][0]-pts[k][0]); } } }); return best<14?dir:0.3+hash2(Math.floor(cc[0]),Math.floor(cc[1]))*3.1; }
  /* a house: walls (a box with its openings painted per face: a canvas atlas, the gable faces windows, one long face a door), a gable roof
     (a prism) with eaves, a ridge chimney; unit sizes, scaled per instance */
  function atlas(){ var c=document.createElement("canvas"); c.width=256; c.height=128; var x=c.getContext("2d");
    function face(ox,kind){ x.fillStyle="#ffffff"; x.fillRect(ox,0,128,128); for(var i=0;i<500;i++){ x.fillStyle="rgba(120,110,95,"+(0.02+hash2(i+ox,5)*0.05)+")"; x.fillRect(ox+hash2(i,1+ox)*128,hash2(i,2)*128,2+hash2(i,3)*5,2+hash2(i,4)*3); }
      x.fillStyle="#7a7166"; x.fillRect(ox,104,128,24);   /* the plinth */
      x.fillStyle="#2b2a28"; if(kind==="gable"){ x.fillRect(ox+30,48,20,26); x.fillRect(ox+78,48,20,26); } else { x.fillRect(ox+26,50,16,22); x.fillStyle="#4a3a2a"; x.fillRect(ox+70,52,22,52); } }
    face(0,"gable"); face(128,"long"); var t=new THREE.CanvasTexture(c); t.encoding=THREE.sRGBEncoding; t.anisotropy=4; return t; }
  function houseGeo(){ /* a 1 x 1 x 1 box with uvs: the two gable ends (+z, -z) take the left half of the atlas, the long sides the right; top and bottom plain */
    var g=new THREE.BoxGeometry(1,1,1), uv=g.attributes.uv;
    /* BoxGeometry's faces in order: +x, -x, +y, -y, +z, -z, four vertices each */
    for(var f=0;f<6;f++) for(var v=0;v<4;v++){ var i=f*4+v, u=uv.getX(i), w=uv.getY(i);
      var gable=(f===4||f===5), top=(f===2||f===3); uv.setXY(i, top?0.02:(gable?u*0.5:0.5+u*0.5), top?0.5:w); }
    return g; }
  function roofGeo(){ var sh=new THREE.Shape(); sh.moveTo(-0.58,0); sh.lineTo(0.58,0); sh.lineTo(0,0.55); sh.lineTo(-0.58,0);
    var g=new THREE.ExtrudeGeometry(sh,{depth:1.08,bevelEnabled:false}); g.translate(0,0,-0.54); g.computeVertexNormals(); return g; }
  function thatchTex(){ var c=document.createElement("canvas"); c.width=c.height=128; var x=c.getContext("2d"); x.fillStyle="#ffffff"; x.fillRect(0,0,128,128);
    for(var r=0;r<40;r++){ x.fillStyle="rgba(70,60,40,"+(0.05+hash2(r,9)*0.08)+")"; x.fillRect(0,r*3.2+hash2(r,7)*2,128,1.2); }
    for(var i=0;i<300;i++){ x.fillStyle="rgba(255,250,235,"+(hash2(i,11)*0.08)+")"; x.fillRect(hash2(i,12)*128,hash2(i,13)*128,1,4+hash2(i,14)*5); }
    var t=new THREE.CanvasTexture(c); t.wrapS=t.wrapT=THREE.RepeatWrapping; t.encoding=THREE.sRGBEncoding; return t; }
  function inst(geo,mat,list,shadow){ var m=new THREE.InstancedMesh(geo,mat,Math.max(1,list.length)), d=new THREE.Object3D(), c=new THREE.Color();
    list.forEach(function(q,i){ d.position.set(q.p[0],q.p[1],q.p[2]); d.rotation.set(0,q.r||0,0); d.scale.set(q.s[0],q.s[1],q.s[2]); d.updateMatrix(); m.setMatrixAt(i,d.matrix);
      if(q.c!=null){ c.setHex(q.c).convertSRGBToLinear(); if(q.k) c.multiplyScalar(q.k); m.setColorAt(i,c); } });
    m.count=list.length; if(m.instanceColor) m.instanceColor.needsUpdate=true; m.castShadow=!!shadow&&!lowTier; m.receiveShadow=true; m.frustumCulled=false; return m; }
  function build(landmarks){
    var seed=1805; function rnd(){ seed=(seed*1664525+1013904223)%4294967296; return seed/4294967296; }
    var H=[], R=[], T=[], CH=[], TW=[], HE=[], NV=[];
    VILLAGES.forEach(function(v){
      var cc=W(v[1],v[2]), ln=lane(cc), cl=Math.cos(ln), sl=Math.sin(ln), n=v[3], per=Math.ceil(n/2), sp=2.5;
      function at(a,o){ return [cc[0]+a*cl-o*sl, cc[1]+a*sl+o*cl]; }
      for(var i=0;i<n;i++){
        var side=(i%2)?1:-1, k=Math.floor(i/2), a=(k-(per-1)/2)*sp+(rnd()-0.5)*0.4, depth=2.3+rnd()*0.9, wid=1.25+rnd()*0.25, hh=0.95+rnd()*0.25;
        var cen=at(a,side*(1.6+depth/2)), y=displayHeight(cen[0],cen[1]), rot=-ln+(rnd()-0.5)*0.06;   /* the house's long axis (its ridge) across the lane: the gable to it */
        H.push({p:[cen[0],y+hh/2,cen[1]],r:rot,s:[wid,hh,depth],c:(rnd()<0.5?col.wall:col.wall2),k:0.92+0.12*rnd()});
        var tile=rnd()<ROOF_TILE; (tile?T:R).push({p:[cen[0],y+hh,cen[1]],r:rot,s:[wid,wid*1.0,depth],c:tile?(rnd()<0.5?col.tile:col.tile2):(rnd()<0.5?col.thatch:col.thatch2),k:0.9+0.15*rnd()});
        var ch=at(a,side*(1.6+depth*0.62)); CH.push({p:[ch[0],y+hh+wid*0.5,ch[1]],r:rot,s:[1,1,1]});
        if(rnd()<0.55){ var bc=at(a+(rnd()-0.5)*0.4,side*(1.6+depth+1.6)), by=displayHeight(bc[0],bc[1]);   /* the barn across the yard's end */
          H.push({p:[bc[0],by+0.45,bc[1]],r:-ln+(rnd()-0.5)*0.05,s:[2.3,0.9,1.1],c:col.barn,k:0.9+0.15*rnd()});
          R.push({p:[bc[0],by+0.9,bc[1]],r:-ln+(rnd()-0.5)*0.05,s:[1.1,1.0,2.3],c:col.thatch,k:0.85+0.15*rnd(),swap:true}); }
      }
      /* a church on the lane at the village's middle, its axis east-west with the east end east (the usual orientation: design, no church's
         own plan is claimed) */
      if(CHURCHES.indexOf(v[0])>=0){ var cp=at(0,0), y2=displayHeight(cp[0],cp[1]), r2=Math.atan2(-MAPCAM.east.z,MAPCAM.east.x);
        H.push({p:[cp[0],y2+0.95,cp[1]],r:r2,s:[3.6,1.9,1.9],c:col.tower,k:1});
        T.push({p:[cp[0],y2+1.9,cp[1]],r:r2+Math.PI/2,s:[1.9,1.1,3.6],c:col.tile,k:0.9});
        var tw=[cp[0]-Math.cos(r2)*2.2, cp[1]+Math.sin(r2)*2.2];   /* the west tower */
        TW.push({p:[tw[0],y2+2.0,tw[1]],r:r2,s:[1.3,4.0,1.3],c:col.tower,k:1}); HE.push({p:[tw[0],y2+4.0,tw[1]],r:r2+Math.PI/4,s:[1.0,1.5,1.0],c:col.helm,k:1});
        var ap=[cp[0]+Math.cos(r2)*1.95, cp[1]-Math.sin(r2)*1.95]; NV.push({p:[ap[0],y2+0.85,ap[1]],r:r2,s:[0.95,1.7,0.95],c:col.tower,k:0.97}); }
    });
    /* the roofs whose ridge runs along the instance's own x (barns): their scale's x and z swapped above (swap), the prism turned */
    R.forEach(function(q){ if(q.swap){ q.r+=Math.PI/2; } });
    var wallMat=matte({color:0xFFFFFF,flatShading:true,map:atlas()}), roofT=matte({color:0xFFFFFF,flatShading:true,map:roofTexture(),side:THREE.DoubleSide}), roofTh=matte({color:0xFFFFFF,flatShading:true,map:thatchTex(),roughness:0.97});
    var g=new THREE.Group(), RG=roofGeo();
    g.add(inst(houseGeo(),wallMat,H,true), inst(RG,roofTh,R,true), inst(RG,roofT,T,true), inst(new THREE.BoxGeometry(0.2,0.5,0.2),matte({color:col.chimney,flatShading:true}),CH,true),
      inst(new THREE.BoxGeometry(1,1,1),matte({color:0xFFFFFF,flatShading:true,map:atlas()}),TW,true), inst(new THREE.ConeGeometry(0.75,1,4),matte({color:0xFFFFFF,flatShading:true}),HE,true),
      inst(new THREE.CylinderGeometry(0.5,0.5,1,6),matte({color:0xFFFFFF,flatShading:true}),NV,true));
    /* the Sokolnitz castle: the build's own instances (b-village), or Wolny's quadrangle (b-landmarks); the build's castle is the last
       instances of its house and roof meshes (world.js buildSettlements pushes it after the villages: 4 wings and 16 enclosure blocks, 4
       roofs), each within 9 units of its place, W(226,355) */
    var cs=W(226,355);
    function near(m,last){ var M=new THREE.Matrix4(), q=new THREE.Vector3(), out=[]; for(var i=Math.max(0,m.count-last);i<m.count;i++){ m.getMatrixAt(i,M); q.setFromMatrixPosition(M); if(Math.hypot(q.x-cs[0],q.z-cs[1])<9) out.push(i); } return out; }
    function copyOf(m,idx){ var c=new THREE.InstancedMesh(m.geometry,m.material,Math.max(1,idx.length)), M=new THREE.Matrix4(), cc=new THREE.Color();
      idx.forEach(function(i,k){ m.getMatrixAt(i,M); c.setMatrixAt(k,M); if(m.instanceColor){ m.getColorAt(i,cc); c.setColorAt(k,cc); } });
      c.count=idx.length; if(c.instanceColor) c.instanceColor.needsUpdate=true; c.castShadow=m.castShadow; c.receiveShadow=m.receiveShadow; c.frustumCulled=false; c.userData.shared=true; return c; }
    if(!landmarks){ g.add(copyOf(houseMesh,near(houseMesh,20)), copyOf(roofMesh,near(roofMesh,4))); }
    else {
      var r2c=Math.atan2(-MAPCAM.east.z,MAPCAM.east.x), ex=Math.cos(r2c), ez=-Math.sin(r2c), sx=Math.sin(r2c), sz=Math.cos(r2c);   /* east, and south (the local z) */
      function pos(a,b){ return [cs[0]+a*ex+b*sx, cs[1]+a*ez+b*sz]; }
      var Wq=7.0, Dq=6.0, tq=1.6, Hc=[], Rc=[];
      function wing(a,b,len,h,ew){ var p=pos(a,b), y=displayHeight(p[0],p[1]), r=ew?r2c+Math.PI/2:r2c;   /* ew: the wing runs east-west */
        Hc.push({p:[p[0],y+h/2,p[1]],r:r,s:[tq,h,len],c:col.wall,k:1}); Rc.push({p:[p[0],y+h,p[1]],r:r,s:[tq,tq*0.95,len],c:col.tile,k:0.92}); }
      wing( Wq/2-tq/2,0,Dq,3.0,false);   /* the east front, two storeys */
      wing(-Wq/2+tq/2,0,Dq,1.8,false);   /* the west wing */
      wing(0,-Dq/2+tq/2,Wq-2*tq,1.8,true); wing(0,Dq/2-tq/2,Wq-2*tq,1.8,true);   /* the north and south wings */
      g.add(inst(houseGeo(),wallMat,Hc,true), inst(RG,roofT,Rc,true));
      /* the chapel of St Anthony: a small nave under its roof, east-west, at the feature's approximate place (form GENERIC) */
      var chf=FEATURES.filter(function(f){ return f.id==="chapel"; })[0], chN=0;
      if(chf){ var cw=W(chf.p[0],chf.p[1]), cy=displayHeight(cw[0],cw[1]);
        g.add(inst(houseGeo(),wallMat,[{p:[cw[0],cy+0.6,cw[1]],r:r2c+Math.PI/2,s:[1.1,1.2,1.8],c:col.chapel,k:1}],true), inst(RG,roofT,[{p:[cw[0],cy+1.2,cw[1]],r:r2c+Math.PI/2,s:[1.1,1.0,1.8],c:col.tile,k:0.9}],true)); chN=1; }
      /* the fences round Telnitz and Sokolnitz along the drawn village cover's edge (class 5), a post-and-rail line 0.3 high */
      var fence=[];
      ["Telnitz","Sokolnitz"].forEach(function(nm){ var v=VILLAGES.filter(function(q){ return q[0]===nm; })[0]; if(!v) return; var c0=W(v[1],v[2]), R0=(2.4+v[3]*0.42)*2.2, pts=[];
        for(var a=0;a<Math.PI*2;a+=0.03){ for(var r=R0;r>0.5;r-=0.1){ var x=c0[0]+Math.cos(a)*r, z=c0[1]+Math.sin(a)*r; if(drawnCover(x,z)===5){ pts.push([x,z]); break; } } }
        for(var i3=0;i3<pts.length;i3++){ var p0=pts[i3], p1=pts[(i3+1)%pts.length], dx=p1[0]-p0[0], dz=p1[1]-p0[1], L=Math.hypot(dx,dz); if(L<0.05||L>3) continue;
          var mx=(p0[0]+p1[0])/2, mz=(p0[1]+p1[1])/2; fence.push({p:[mx,displayHeight(mx,mz)+0.15,mz],r:-Math.atan2(dz,dx),s:[L+0.04,0.3,0.06],c:col.fence,k:0.9+0.1*hash2(i3,3)}); } });
      g.add(inst(new THREE.BoxGeometry(1,1,1),matte({color:0xFFFFFF,flatShading:true}),fence,false));
      B.landmarkCounts={castleWings:4, chapel:chN, fenceSegments:fence.length};
    }
    B.counts={houses:H.length, thatched:R.length, tiled:T.length, chimneys:CH.length, towers:TW.length};
    return g;
  }
  function install(kind){
    if(B.on) uninstall(); B.on=kind;
    B.hidden=[houseMesh,roofMesh,chimneyMesh,spireMesh].filter(Boolean); B.hidden.forEach(function(m){ m.userData._v8=m.visible; m.visible=false; });
    B.grp=build(kind==="b-landmarks"); scene.add(B.grp);
    B.upd=window.updateVisibility; window.updateVisibility=function(){ B.upd(); B.grp.visible=landscapeVisible(); B.hidden.forEach(function(m){ m.visible=false; }); };
    var tris=0; B.grp.traverse(function(o){ if(o.isInstancedMesh){ var g=o.geometry, t=(g.index?g.index.count:g.attributes.position.count)/3; tris+=t*o.count; } });
    /* the villages' extents kept: the share of buildings (the build's, the prototype's) whose centre lies in the drawn village cover (class 5) */
    function inVill(m){ var M=new THREE.Matrix4(), p=new THREE.Vector3(), n=0, k=0; for(var i=0;i<m.count;i++){ m.getMatrixAt(i,M); p.setFromMatrixPosition(M); n++; if(drawnCover(p.x,p.z)===5) k++; } return n?+(k/n).toFixed(3):null; }
    var inV={build:inVill(houseMesh), prototype:inVill(B.grp.children[0])};
    updateVisibility(); requestRender(3); return {kind:kind, counts:B.counts, landmarks:B.landmarkCounts||null, triangles:tris, inVillageCover:inV};
  }
  function uninstall(){ if(!B.on) return; window.updateVisibility=B.upd; scene.remove(B.grp); B.grp.traverse(function(o){ if(o.userData.shared) return; if(o.geometry) o.geometry.dispose(); if(o.material){ if(o.material.map&&o.material.map!==_roofTex) o.material.map.dispose(); o.material.dispose(); } });
    B.hidden.forEach(function(m){ m.visible=true; }); B.on=null; updateVisibility(); requestRender(3); }
  ["b-village","b-landmarks"].forEach(function(k){ window.__p8[k]={install:function(){ return install(k); }, uninstall:uninstall}; });
  window.__b8=B; return true;
};
module.exports={inPage, ids:{"b-village":{},"b-landmarks":{}}};
