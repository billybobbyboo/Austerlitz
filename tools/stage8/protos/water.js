/* Stage 8 Part A (docs/STAGE8_SPEC.md section 5): the ice, the shores and the streams (the owner's note L4), prototyped in the live page only.
   The meres stay ice (the data: the Satschan mere "frozen on 2 December"; the guns firing "down on the ice"; Stage 4E's rule,
   docs/STAGE4_SPEC.md section F.1: no cracks, holes, snow or figures in the water) and keep their outlines (decision 27). What the
   prototypes change is the surface's material and its light, and the streams' look; each is a DESIGN value, none a claim:
   - w-ice:      the build's two ice materials given a variation over the mere: a frosted margin (lighter, rougher) easing into clearer, darker,
                 glossier ice toward the middle, a broad low-contrast tonal noise (wind-polished and rimed patches, no lines), and a stronger
                 reflection of the sky at grazing angles (a Fresnel weight on the environment map); the shore ice's hard ring replaced by a
                 band feathered at both edges;
   - w-stream:   the streams drawn at all (the build's ribbons, world.js ribbon(), are wound facing down, so with the materials' default
                 front side three r128 culls every one of them and the landscape draws no stream, bank or road ribbon: here the stream and
                 bank materials are made double-sided), the streams darker and less blue (open water under a winter sky), reflecting the sky
                 more at grazing angles, the banks a little darker where they meet the water;
   - w-streamice: w-stream with a thin pale rim of ice along both edges of the water, its edge broken by a noise (shown for assessment only:
                 whether the streams froze at the edges on the day is not recorded in the data; section 5.2);
   - w-flow:     w-stream with a slow drift of its ripple pattern downstream (the Goldbach's course runs north to south, as drawn), in real
                 time; shown for assessment only (section 5.2), never under reduced motion; under ?harness=1 the pattern stands still.
   Every material is restored on uninstall. */
"use strict";
const inPage=function(){
  if(window.__w8) return true;
  window.__p8=window.__p8||{};
  var Wt={on:null, undo:[], t0:performance.now(), U:{uTime:{value:0}}, raf:0};
  var NOISE="float h8(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }\n"+
    "float n8(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(h8(i),h8(i+vec2(1,0)),f.x),mix(h8(i+vec2(0,1)),h8(i+vec2(1,1)),f.x),f.y); }\n"+
    "float fbm8(vec2 p){ return 0.55*n8(p)+0.28*n8(p*2.1+3.7)+0.17*n8(p*4.3+9.1); }\n";
  function patch(mat,fn){ var m0={obc:mat.onBeforeCompile, key:mat.customProgramCacheKey, env:mat.envMapIntensity, rough:mat.roughness, col:mat.color.clone(), op:mat.opacity, tr:mat.transparent, side:mat.side};
    Wt.undo.push(function(){ mat.onBeforeCompile=m0.obc; mat.customProgramCacheKey=m0.key; mat.envMapIntensity=m0.env; mat.roughness=m0.rough; mat.color.copy(m0.col); mat.opacity=m0.op; mat.transparent=m0.tr; mat.side=m0.side; mat.needsUpdate=true; });
    fn(mat); mat.needsUpdate=true; }
  /* the mere's ice: local uv of the CircleGeometry (0..1 across), r its distance from the centre (0 at the middle, 1 at the shore) */
  function iceShader(mat,frostCol,clearCol,isRim){
    mat.onBeforeCompile=function(sh){
      atmoUniforms(sh);   /* the atmosphere's uniforms, as every material of the app gets them (app.js: a material with a hook of its own calls it) */
      sh.uniforms.uFrost={value:lin(frostCol)}; sh.uniforms.uClear={value:lin(clearCol)};
      sh.vertexShader=sh.vertexShader.replace("#include <common>","#include <common>\nvarying vec2 vUv8; varying vec3 vW8;").replace("#include <begin_vertex>","#include <begin_vertex>\nvUv8=uv; vW8=(modelMatrix*vec4(position,1.0)).xyz;");
      sh.fragmentShader=sh.fragmentShader.replace("#include <common>","#include <common>\nvarying vec2 vUv8; varying vec3 vW8; uniform vec3 uFrost, uClear;\n"+NOISE)
        .replace("#include <color_fragment>","#include <color_fragment>\n"+
          "float r8=length(vUv8-0.5)*2.0; float nz=fbm8(vW8.xz*0.11); float nf=fbm8(vW8.xz*0.37+7.0);\n"+
          (isRim?"float t8=clamp((r8-0.86)/0.14,0.0,1.0); float fr8=0.85+0.15*nf; diffuseColor.a*=smoothstep(0.0,0.35,t8)*smoothstep(1.0,0.55,t8);\n"
                :"float fr8=clamp(smoothstep(0.40,1.0,r8)+0.45*(nz-0.5)+0.20*(nf-0.5),0.0,1.0);\n")+
          "diffuseColor.rgb=mix(uClear,uFrost,fr8)*(0.93+0.14*nz);\n")
        .replace("#include <roughnessmap_fragment>","#include <roughnessmap_fragment>\nroughnessFactor=mix(0.20,0.62,fr8);")
        .replace("#include <lights_fragment_maps>","#include <lights_fragment_maps>\n{ vec3 V8=normalize(cameraPosition-vW8); float fz=pow(1.0-max(dot(V8,vec3(0,1,0)),0.0),4.0); iblIrradiance*=1.0; radiance*= (1.0+2.2*fz*(1.0-fr8)); }");
    };
    mat.customProgramCacheKey=function(){ return "w8ice"+(isRim?"rim":""); };
  }
  /* streams: world position only (the ribbons carry no uv); the ripple a noise in the world plane, drifted downstream (-z is north here: the
     course's mean direction is read from the Goldbach's own points) when uFlow is on */
  function streamShader(mat,iceEdge,flow){
    mat.onBeforeCompile=function(sh){
      atmoUniforms(sh);   /* the atmosphere's uniforms, as every material of the app gets them (app.js: a material with a hook of its own calls it) */
      sh.uniforms.uTime=Wt.U.uTime; sh.uniforms.uFlow={value:flow?1:0}; sh.uniforms.uDir={value:new THREE.Vector2(Wt.dir[0],Wt.dir[1])}; sh.uniforms.uEdge={value:iceEdge?1:0};
      sh.uniforms.uEdgeCol={value:lin(0xB2BCC0)};
      sh.vertexShader=sh.vertexShader.replace("#include <common>","#include <common>\nattribute float aAcross; varying vec3 vW8; varying float vAc8;").replace("#include <begin_vertex>","#include <begin_vertex>\nvW8=(modelMatrix*vec4(position,1.0)).xyz; vAc8=aAcross;");
      sh.fragmentShader=sh.fragmentShader.replace("#include <common>","#include <common>\nvarying vec3 vW8; varying float vAc8; uniform float uTime, uFlow, uEdge; uniform vec2 uDir; uniform vec3 uEdgeCol;\n"+NOISE)
        .replace("#include <color_fragment>","#include <color_fragment>\n"+
          "vec2 q8=vW8.xz*1.3-uDir*uTime*uFlow*0.25; float rp=fbm8(q8); diffuseColor.rgb*=0.86+0.22*rp;\n"+
          "float ed8=uEdge*smoothstep(0.62,0.74,abs(vAc8)+0.06*(fbm8(vW8.xz*0.9)-0.5)); diffuseColor.rgb=mix(diffuseColor.rgb,uEdgeCol,ed8);\n")
        .replace("#include <roughnessmap_fragment>","#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,0.6,ed8);")
        .replace("#include <lights_fragment_maps>","#include <lights_fragment_maps>\n{ vec3 V8=normalize(cameraPosition-vW8); float fz=pow(1.0-max(dot(V8,vec3(0,1,0)),0.0),3.0); radiance*=(1.0+3.0*fz); }");
    };
    mat.customProgramCacheKey=function(){ return "w8stream"+(iceEdge?"i":"")+(flow?"f":""); };   /* one program per variant: a variant installed after another must not reuse its program (w-streamice did, and drew no rim) */
  }
  function install(kind){
    if(Wt.on) uninstall(); Wt.on=kind;
    var G=GOLDBACH, d=[G[G.length-1][0]-G[0][0],G[G.length-1][1]-G[0][1]], L=Math.hypot(d[0],d[1]); Wt.dir=[d[0]/L,d[1]/L];
    if(kind==="w-ice"){
      var ice=waterMeshes.filter(function(o){ return o.userData.mere; }), rims=iceRims;
      if(ice[0]) patch(ice[0].material,function(m){ iceShader(m,0xA9B3B7,0x5E6C74,false); m.envMapIntensity=0.55; });
      if(rims[0]) patch(rims[0].material,function(m){ iceShader(m,0xA9B3B7,0x8C989E,true); m.transparent=true; });
    } else {
      var str=waterMeshes.filter(function(o){ return o.userData.drape&&o.userData.drape.kind==="stream"; }), banks=waterMeshes.filter(function(o){ return o.userData.drape&&o.userData.drape.kind==="bank"; });
      /* the ribbons carry no uv: each vertex's place across its ribbon (-1..1) from how ribbon() lays them out, rows of m+1 vertices,
         m = ceil(width / RIBBON_STEP), the widths world.js gives the streams (the Goldbach 2.8, the Litava 3.2, each brook 1.4) */
      var widths=[2.8,3.2,1.4,1.4,1.4,1.4,1.4];
      str.forEach(function(o,i){ var m=Math.max(1,Math.ceil(widths[Math.min(i,widths.length-1)]/RIBBON_STEP)), n=o.geometry.attributes.position.count, A=new Float32Array(n);
        for(var k=0;k<n;k++) A[k]=-1+2*(k%(m+1))/m;
        o.geometry.setAttribute("aAcross",new THREE.BufferAttribute(A,1)); Wt.undo.push(function(){ o.geometry.deleteAttribute("aAcross"); }); });
      if(str[0]) patch(str[0].material,function(m){ m.side=THREE.DoubleSide; m.color.copy(lin(0x3E4E58)); m.roughness=0.22; m.envMapIntensity=0.55; streamShader(m,kind==="w-streamice",kind==="w-flow"); });
      if(banks[0]) patch(banks[0].material,function(m){ m.side=THREE.DoubleSide; m.color.copy(lin(0x454D40)); });
      if(kind==="w-flow"&&!RM&&!HARNESS){ var tick=function(){ Wt.U.uTime.value=(performance.now()-Wt.t0)/1000; requestRender(1); Wt.raf=requestAnimationFrame(tick); }; tick();
        Wt.undo.push(function(){ cancelAnimationFrame(Wt.raf); }); }
    }
    requestRender(3); return {kind:kind};
  }
  function uninstall(){ while(Wt.undo.length) Wt.undo.pop()(); Wt.on=null; requestRender(3); }
  ["w-ice","w-stream","w-streamice","w-flow"].forEach(function(k){ window.__p8[k]={install:function(){ return install(k); }, uninstall:uninstall}; });
  /* for recordings: the flow's clock set by the probe (deterministic frames) */
  Wt.setTime=function(t){ Wt.U.uTime.value=t; requestRender(1); };
  window.__w8=Wt; return true;
};
module.exports={inPage, ids:{"w-ice":{},"w-stream":{},"w-streamice":{},"w-flow":{}}};
