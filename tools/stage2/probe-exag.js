/* Stage 2 Part A, section B: an in-page PROBE of display exaggeration, for measurement only. It is not the
   2B implementation (docs/STAGE2_SPEC.md §A gives that design); it changes the running page, never a source.
   __stage2.exag(f): draw the ground at display factor f (1 = true scale, GEOREF.EXAG = today's 10.33x).
   - height() is replaced by s*height0() (s = f / GEOREF.EXAG), so everything the app places each frame from
     height() or groundY() (counters, labels, formations through the rebuilt ground mesh, the camera floor)
     follows; overlays are rebuilt.
   - everything built once from height() is re-seated: each vertex, instance or sprite keeps its offset above
     the ground, y = y0 + (s - 1) * height0(x, z); ground and apron normals are rescaled, (s nx, ny, s nz), and
     the baked shade and slope (FACE) and the palettes are recomputed from them. Rotated planes (the meres, the
     mist sheets) move as a whole.
   Not moved, by design of the probe: the sky dome, lights, the plan overlay (off in every case). */
module.exports=`(function(){
  var S=window.__stage2=window.__stage2||{};
  if(!S.H0){ S.H0=height; S.orig=new Map(); }
  var H0=S.H0, EX=GEOREF.EXAG;
  function skipSet(){
    var k=new Set([domeMesh, overlayRoot, selRing]);
    if(typeof sunDisc!=="undefined") k.add(sunDisc);
    if(typeof planGroup!=="undefined"&&planGroup) k.add(planGroup);
    [units,aggregates].forEach(function(M){ Object.keys(M).forEach(function(id){ var r=M[id];
      ["block","sprite","stem","smoke","pad","dust","nameLabel","trail"].forEach(function(p){ if(r[p]) k.add(r[p]); }); }); });
    return k;
  }
  function identityXf(o){ return o.rotation.x===0&&o.rotation.y===0&&o.rotation.z===0&&o.scale.x===1&&o.scale.y===1&&o.scale.z===1&&o.position.x===0&&o.position.z===0; }
  S.exag=function(f){
    var s=f/EX; S.f=f; S.s=s;
    window.height=function(x,z){ return s*H0(x,z); };
    var skip=skipSet(), m=new THREE.Matrix4(), p=new THREE.Vector3(), q=new THREE.Quaternion(), sc=new THREE.Vector3();
    var LX=-0.52, LY=0.70, LZ=-0.49, ln=Math.sqrt(LX*LX+LY*LY+LZ*LZ); LX/=ln; LY/=ln; LZ/=ln;
    function visit(o){
      if(skip.has(o)||o.isLight||o.isCamera) return;
      var rec=S.orig.get(o);
      if(o.isInstancedMesh){
        if(!rec){ rec={mats:[]}; for(var i=0;i<o.count;i++){ o.getMatrixAt(i,m); rec.mats.push(m.clone()); } S.orig.set(o,rec); }
        for(var i2=0;i2<o.count;i2++){ rec.mats[i2].decompose(p,q,sc); p.y+=(s-1)*H0(p.x,p.z); m.compose(p,q,sc); o.setMatrixAt(i2,m); }
        o.instanceMatrix.needsUpdate=true; return;
      }
      if(o.isSprite){ if(!rec){ rec={y:o.position.y}; S.orig.set(o,rec); } o.position.y=rec.y+(s-1)*H0(o.position.x,o.position.z); return; }
      if((o.isMesh||o.isLine)&&o.geometry&&o.geometry.attributes&&o.geometry.attributes.position){
        if(!identityXf(o)){   /* a rotated or placed plane: move it as a whole */
          if(!rec){ rec={y:o.position.y}; S.orig.set(o,rec); } o.position.y=rec.y+(s-1)*H0(o.position.x,o.position.z);
        } else {
          var P=o.geometry.attributes.position, N=o.geometry.attributes.normal;
          if(!rec){ rec={y:Float32Array.from(P.array), n:N?Float32Array.from(N.array):null}; S.orig.set(o,rec); }
          for(var v=0;v<P.count;v++){ var x=P.array[v*3], z=P.array[v*3+2]; P.array[v*3+1]=rec.y[v*3+1]+(s-1)*H0(x,z); }
          P.needsUpdate=true;
          if(N&&rec.n&&(o===groundMesh||o===world.apron)){
            for(var v2=0;v2<N.count;v2++){ var nx=rec.n[v2*3]*s, ny=rec.n[v2*3+1], nz=rec.n[v2*3+2]*s, L=Math.hypot(nx,ny,nz)||1;
              N.array[v2*3]=nx/L; N.array[v2*3+1]=ny/L; N.array[v2*3+2]=nz/L; }
            N.needsUpdate=true;
          } else if(N&&o.isMesh) o.geometry.computeVertexNormals();
          o.geometry.computeBoundingSphere(); o.geometry.computeBoundingBox&&o.geometry.computeBoundingBox();
          return;
        }
      }
      (o.children||[]).forEach(visit);
    }
    scene.children.forEach(visit);
    /* the baked shade, frost and slope from the new ground normals, then the palettes */
    var pa=groundMesh.geometry.attributes.position.array, na=groundMesh.geometry.attributes.normal.array;
    for(var qv=0;qv<FACE.n*3;qv++){ var a=na[qv*3],b=na[qv*3+1],c=na[qv*3+2]; FACE.vsh[qv]=Math.max(0,a*LX+b*LY+c*LZ); FACE.vnz[qv]=c; }
    for(var fi=0;fi<FACE.n;fi++){ var o9=fi*9;
      var ux=pa[o9+3]-pa[o9],uy=pa[o9+4]-pa[o9+1],uz=pa[o9+5]-pa[o9+2], vx=pa[o9+6]-pa[o9],vy=pa[o9+7]-pa[o9+1],vz=pa[o9+8]-pa[o9+2];
      var nx=uy*vz-uz*vy, ny=uz*vx-ux*vz, nz=ux*vy-uy*vx, nl=Math.hypot(nx,ny,nz)||1; nx/=nl; ny/=nl; nz/=nl; if(ny<0){ nx=-nx; ny=-ny; nz=-nz; }
      FACE.slope[fi]=Math.acos(Math.max(-1,Math.min(1,ny))); FACE.shade[fi]=Math.max(0,nx*LX+ny*LY+nz*LZ); FACE.nz[fi]=nz; FACE.h[fi]=(pa[o9+1]+pa[o9+4]+pa[o9+7])/3/s; }
    palNatural=makePalette("natural"); palPaper=makePalette("paper"); palGoing=null; applyGround();
    rebuildOverlays(curPhase,true);
    requestRender(3);
    return {f:f,s:s};
  };
  /* a vantage [eye, target] keeps each point's height above its own ground */
  S.reframe=function(c){ var s=S.s||1;
    return [c[0],c[1]+(s-1)*H0(c[0],c[2]),c[2], c[3],c[4]+(s-1)*H0(c[3],c[5]),c[5]]; };
})();`;
