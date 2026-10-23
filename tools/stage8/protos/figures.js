/* Stage 8 Part A (docs/STAGE8_SPEC.md section 4): the troops (the owner's note L3: "greater depth and detail in cavalry, infantry and
   especially artillery ... and movement that does not look like soldiers and equipment moving statically, as if they were floating"),
   prototyped in the live page on three representative formations only: Saint-Hilaire's division (French line and light infantry), Nansouty's
   division (French cuirassiers and carabiniers) and the French guns on the heights (heightguns, IV Corps' foot artillery). Every colour is the
   build's own, read from the meshes it replaces: each coat instance keeps its instance colour (KIT's cloth by class, decision 102), each fixed
   part its class's legwear, headgear and cuirass (kitDress); nothing the appearance table does not settle at A or B is added, but for one
   value the build does not yet draw and the table settles: the French cuirassiers' dark blue saddle-cloth (DRESS.fr_cuirassier.furniture, B).
   The new shapes are DESIGN (proportions, the man's joints, the horse's build, the carriage's parts) or GENERIC (the gun is a generic field
   piece of the period, not a sourced model of any army's system). The battery follows the leads read for this session (docs/stage8-evidence/
   leads.md, items 5, 6, 22, 23, 27; to be registered before anything is built): the wheels about 1.31 m and the limber's 1.13 m, near
   Gassendi's 1.46 and 1.14 m (B); the Gribeauval coffret between the trail's cheeks on the march and on the limber in action (Gassendi, B);
   one train soldier a vehicle (IV Corps' order of 25 October 1805, A) on the near horse of the wheel pair (which pair is not stated: DESIGN);
   the limbers and teams behind the deployed guns (Gassendi's drill, B; the distance at the symbol scale is DESIGN); four horses a drawn gun
   and five gunners about it, as the build draws them. The figure's height to its hat's top is kept within 2% of the build's, so the
   standards' ratio (decision 106) is unchanged.
   Motion ("f-gait"): legs, arms and horses' legs swing in the vertex shader (a part attribute on the new geometry, a phase uniform per mesh).
   The phase is a function of the clock alone: the distance the formation's modelled track has covered since its first anchor (legPath over
   the legs reached, the current leg to the clock's u), so the same clock always gives the same pose, scrubbing included; a paused clock or
   a halted formation does not step. One stride is STRIDE units of that distance (a DESIGN value for the compressed time and the figure scale,
   docs/STAGE8_SPEC.md section 4.3); the swing fades out where the cycle on screen would run faster than MAX_HZ (fast play) and under
   reduced motion. Infantry steps together (a formed body in cadence: DESIGN), horses each on their own beat; the walk's four beats
   (left hind, left fore, right hind, right fore) for horses, a trot above TROT_KMH of modelled speed (DESIGN thresholds). */
"use strict";
const inPage=function(){
  if(window.__f8) return true;
  window.__p8=window.__p8||{};
  var F={on:false, gait:false, recs:[], undo:[], t0:performance.now(), lastClock:null, lastT:null, hz:{}};
  var IDS={inf:"sthilaire", cav:"nansouty", art:"heightguns"};
  /* DESIGN: map units of modelled track per gait cycle (two steps), chosen so that at the default play speed (½x: five clock minutes a second)
     a formation at a typical modelled rate steps at about one cycle a second (infantry at 3 km/h: 250 m a second, 6.6 map units = 208 m a
     cycle, 1.2 cycles a second; cavalry at a 6 km/h walk 1.0; teams at 4.5 km/h 1.0); docs/STAGE8_SPEC.md section 4.3 */
  var STRIDE={inf:6.6, cav:16, art:12}, MAX_HZ=3.2, TROT_KMH=8.0;
  var BOX=function(w,h,d){ return new THREE.BoxGeometry(w,h,d); };
  /* ---- geometry: parts merged with vertex colours (white takes the instance colour) and a part index for the gait ---- */
  function merge(parts){
    var P=[],N=[],C=[],A=[], m=new THREE.Matrix4(), q=new THREE.Quaternion(), e=new THREE.Euler(), v=new THREE.Vector3(), n=new THREE.Vector3(), white=new THREE.Color(1,1,1);
    parts.forEach(function(pt){
      var g=pt.geo.index?pt.geo.toNonIndexed():pt.geo.clone(); g.computeVertexNormals();
      e.set(pt.rot?pt.rot[0]:0,pt.rot?pt.rot[1]:0,pt.rot?pt.rot[2]:0); q.setFromEuler(e);
      m.compose(new THREE.Vector3(pt.p[0],pt.p[1],pt.p[2]),q,new THREE.Vector3(pt.s?pt.s[0]:1,pt.s?pt.s[1]:1,pt.s?pt.s[2]:1));
      var nm=new THREE.Matrix3().getNormalMatrix(m), pa=g.attributes.position.array, na=g.attributes.normal.array, col=pt.col!=null?lin(pt.col):white;
      for(var k=0;k<pa.length;k+=3){ v.set(pa[k],pa[k+1],pa[k+2]).applyMatrix4(m); P.push(v.x,v.y,v.z); n.set(na[k],na[k+1],na[k+2]).applyMatrix3(nm).normalize(); N.push(n.x,n.y,n.z);
        C.push(col.r,col.g,col.b); A.push(pt.part||0); }
    });
    var out=new THREE.BufferGeometry();
    out.setAttribute("position",new THREE.Float32BufferAttribute(P,3)); out.setAttribute("normal",new THREE.Float32BufferAttribute(N,3));
    out.setAttribute("color",new THREE.Float32BufferAttribute(C,3)); out.setAttribute("aPart",new THREE.Float32BufferAttribute(A,1));
    return out;
  }
  function P(geo,p,s,rot,col,part){ return {geo:geo,p:p,s:s,rot:rot,col:col,part:part}; }
  /* a tapered box: a four-sided frustum, its base w0 x d0, its top w1 x d1, h high, centred */
  function taper(w0,d0,w1,d1,h){ var g=new THREE.CylinderGeometry(Math.SQRT1_2,Math.SQRT1_2,1,4,1); g.rotateY(Math.PI/4);
    var a=g.attributes.position; for(var i=0;i<a.count;i++){ var y=a.getY(i), t=y+0.5, w=w0+(w1-w0)*t, d=d0+(d1-d0)*t; a.setX(i,a.getX(i)*w); a.setZ(i,a.getZ(i)*d); a.setY(i,y*h); }
    return g; }
  var M=KIT.mat, ICO=new THREE.IcosahedronGeometry(0.115,1);
  /* the man on foot, without his coat (legs in the legwear, head, hat, pack, musket and bayonet unless a gunner); parts 1/2 the legs */
  function footFixed(leg,head,gunner,facings){
    var parts=[
      P(taper(0.11,0.13,0.135,0.15,0.32),[-0.085,0.47,0],null,null,leg,1), P(taper(0.085,0.10,0.11,0.13,0.32),[-0.085,0.16,0],null,null,leg,1),
      P(BOX(0.10,0.06,0.20),[-0.085,0.03,0.04],null,null,M.black,1),
      P(taper(0.11,0.13,0.135,0.15,0.32),[0.085,0.47,0],null,null,leg,2), P(taper(0.085,0.10,0.11,0.13,0.32),[0.085,0.16,0],null,null,leg,2),
      P(BOX(0.10,0.06,0.20),[0.085,0.03,0.04],null,null,M.black,2),
      P(ICO,[0,1.30,0.01],[1,1.06,1],null,M.skin), P(BOX(0.08,0.08,0.08),[0,1.19,0],null,null,M.skin)].concat(kitHat(head,1.365).map(function(q){ q.part=0; return q; }));
    if(!gunner) parts.push(P(BOX(0.30,0.30,0.13),[0,0.96,-0.19],null,null,M.leather), P(BOX(0.32,0.06,0.10),[0,1.12,-0.20],[1,1,1],[0,0,0],M.leather),
      P(BOX(0.04,1.30,0.04),[0.25,1.10,0.10],null,[0.16,0,0.12],M.wood), P(BOX(0.028,0.30,0.028),[0.335,1.86,0.03],null,[0.16,0,0.12],M.metal));
    else parts.push(P(BOX(0.24,0.16,0.08),[0.16,0.70,-0.10],null,null,M.leather));
    /* f-facings (a data task first: the facings claims carry no colour class): the lapels, the turnbacks on the skirts, the collar */
    if(facings!=null) parts.push(P(BOX(0.075,0.40,0.03),[-0.07,0.95,0.125],null,[0,0,-0.08],facings[0]), P(BOX(0.075,0.40,0.03),[0.07,0.95,0.125],null,[0,0,0.08],facings[0]),
      P(BOX(0.12,0.18,0.03),[-0.09,0.55,-0.135],null,[0.12,0,0.2],facings[0]), P(BOX(0.12,0.18,0.03),[0.09,0.55,-0.135],null,[0.12,0,-0.2],facings[0]),
      P(BOX(0.22,0.06,0.20),[0,1.18,0.0],null,null,facings[1]));
    return merge(parts);
  }
  /* the coat: a torso wider at the shoulders, the skirts behind, the arms (3 the left arm, swung; the right holds the musket) */
  function footCoat(){
    return merge([P(taper(0.30,0.20,0.40,0.24,0.52),[0,0.90,0]), P(taper(0.34,0.06,0.30,0.05,0.30),[0,0.58,-0.10],null,[0.12,0,0]),
      P(taper(0.09,0.10,0.11,0.12,0.50),[-0.245,0.88,0.0],null,[0,0,0.06],undefined,3), P(BOX(0.075,0.075,0.075),[-0.27,0.61,0.02],null,null,M.skin,3),
      P(taper(0.09,0.10,0.11,0.12,0.46),[0.235,0.90,0.07],null,[-0.32,0,-0.05])]);
  }
  /* the horse: a barrel body, chest and quarters, the neck raised forward, the head angled down; legs jointed (5 LF, 6 RF, 7 LH, 8 RH) */
  function horse(col){
    var legs=[], L=[[-0.12,0.40,5],[0.12,0.40,6],[-0.12,-0.40,7],[0.12,-0.40,8]];
    L.forEach(function(q){ legs.push(P(taper(0.075,0.10,0.11,0.15,0.34),[q[0],0.52,q[1]],null,null,col,q[2]), P(taper(0.055,0.06,0.07,0.08,0.34),[q[0],0.19,q[1]],null,null,col,q[2]),
      P(BOX(0.085,0.05,0.10),[q[0],0.025,q[1]+0.01],null,null,M.black,q[2])); });
    var body=new THREE.CylinderGeometry(0.21,0.20,0.86,8,1); body.rotateX(Math.PI/2);
    return merge([P(body,[0,0.86,0],[1.0,1.15,1]), P(taper(0.30,0.34,0.36,0.40,0.30),[0,0.84,0.43],null,[Math.PI/2,0,0],col), P(taper(0.32,0.30,0.38,0.36,0.26),[0,0.88,-0.42],null,[-Math.PI/2,0,0],col),
      P(taper(0.20,0.30,0.14,0.20,0.52),[0,1.13,0.62],null,[0.72,0,0],col), P(taper(0.12,0.24,0.09,0.15,0.40),[0,1.27,0.92],null,[2.1,0,0],col),
      P(BOX(0.03,0.08,0.03),[-0.04,1.43,0.80],null,null,col), P(BOX(0.03,0.08,0.03),[0.04,1.43,0.80],null,null,col),
      P(BOX(0.05,0.36,0.07),[0,0.86,-0.66],null,[0.45,0,0],M.black)].concat(legs));
  }
  /* the rider seated, without his coat: thighs along the horse, shins down, head and hat, sabre at the shoulder, the cuirass where drawn, and
     the saddle and its cloth (cloth: the class's settled saddle-cloth colour, else the leather) */
  function riderFixed(leg,head,cuir,cloth,driver){
    var parts=[P(ICO,[0,1.69,0.02],[1,1.06,1],null,M.skin), P(BOX(0.08,0.08,0.08),[0,1.58,0.01],null,null,M.skin)].concat(kitHat(head,1.755)).concat([
      P(taper(0.11,0.15,0.13,0.17,0.36),[-0.17,1.06,0.12],null,[1.35,0,0],leg), P(taper(0.11,0.15,0.13,0.17,0.36),[0.17,1.06,0.12],null,[1.35,0,0],leg),
      P(taper(0.08,0.10,0.10,0.12,0.40),[-0.20,0.80,0.26],null,[0.18,0,0],M.black), P(taper(0.08,0.10,0.10,0.12,0.40),[0.20,0.80,0.26],null,[0.18,0,0],M.black),
      P(BOX(0.46,0.06,0.62),[0,1.08,-0.02],null,null,M.leather), P(BOX(0.52,0.30,0.70),[0,0.97,-0.06],[1,1,1],null,cloth!=null?cloth:M.leather)]);
    if(cuir) parts.push(P(taper(0.34,0.24,0.40,0.27,0.40),[0,1.36,0],null,null,M[cuir]));
    if(!driver) parts.push(P(BOX(0.03,0.95,0.03),[0.27,1.62,0.08],null,[-0.35,0,0.12],M.metal));   /* the sabre at the shoulder; a driver none */
    return merge(parts);
  }
  function riderCoat(){ return merge([P(taper(0.28,0.20,0.36,0.23,0.50),[0,1.33,0]), P(taper(0.30,0.05,0.34,0.05,0.26),[0,1.07,-0.12],null,[0.35,0,0]),
      P(taper(0.08,0.09,0.10,0.11,0.42),[-0.22,1.30,0.10],null,[-0.45,0,0.05]), P(taper(0.08,0.09,0.10,0.11,0.42),[0.22,1.32,0.06],null,[-0.30,0,-0.05])]); }
  /* the field piece, generic: a turned barrel, a bracket trail of two cheeks to the ground, an axle; wheels of twelve spokes */
  function barrel(){ var pr=[[0.0,-0.85],[0.06,-0.86],[0.10,-0.80],[0.125,-0.72],[0.125,-0.30],[0.11,-0.28],[0.105,0.55],[0.095,0.60],[0.10,0.70],[0.085,0.72],[0.0,0.72]].map(function(q){ return new THREE.Vector2(q[0],q[1]); });
    var g=new THREE.LatheGeometry(pr,8); g.rotateX(Math.PI/2); return g; }
  function wheel(r){ var parts=[P(new THREE.TorusGeometry(r,0.035,3,14),[0,0,0],null,[0,Math.PI/2,0],KIT.gear.wheel), P(new THREE.CylinderGeometry(0.07,0.07,0.16,8),[0,0,0],null,[0,0,Math.PI/2],KIT.gear.wheel)];
    for(var i=0;i<12;i++){ var a=i/12*Math.PI*2; parts.push(P(BOX(0.025,r,0.03),[0,Math.cos(a)*r/2,Math.sin(a)*r/2],null,[a,0,0],KIT.gear.wheel)); }
    return parts; }
  function gun(coffret){
    var W=0.52, out=[P(barrel(),[0,1.02,0.18],[1.35,1.35,1.35],[-0.05,0,0],KIT.gear.barrel)];
    if(coffret) out.push(P(BOX(0.28,0.20,0.50),[0,0.70,-0.42],null,[-0.443,0,0],KIT.gear.limber));   /* the coffret between the cheeks, on the march */
    [-0.17,0.17].forEach(function(x){ out.push(P(BOX(0.06,0.18,1.94),[x,0.535,-0.575],null,[-0.443,0,0],KIT.gear.trail)); });
    out.push(P(BOX(0.42,0.10,0.10),[0,0.60,0.05],null,null,KIT.gear.trail), P(BOX(0.30,0.06,0.22),[0,0.06,-1.42],null,null,KIT.gear.trail));
    wheel(0.60).forEach(function(q){ q.p=[q.p[0]-W,q.p[1]+0.60,q.p[2]+0.05]; out.push(q); });
    wheel(0.60).forEach(function(q){ q.p=[q.p[0]+W,q.p[1]+0.60,q.p[2]+0.05]; out.push(q); });
    return merge(out);
  }
  /* the limber, generic: an axle, two wheels, the frame and the pole forward; the coffret on it in action (Gassendi) */
  function limber(coffret){ var W=0.50, out=[P(BOX(0.40,0.10,0.10),[0,0.55,0],null,null,KIT.gear.limber), P(BOX(0.36,0.08,0.80),[0,0.62,0.12],null,null,KIT.gear.limber),
      P(BOX(0.06,0.06,1.90),[0,0.66,1.25],null,null,KIT.gear.limber)];
    if(coffret) out.push(P(BOX(0.30,0.22,0.52),[0,0.77,0.12],null,null,KIT.gear.limber));   /* the coffret set on the limber in action */
    wheel(0.52).forEach(function(q){ q.p=[q.p[0]-W,q.p[1]+0.52,q.p[2]]; out.push(q); });
    wheel(0.52).forEach(function(q){ q.p=[q.p[0]+W,q.p[1]+0.52,q.p[2]]; out.push(q); });
    return merge(out); }
  /* ---- the gait: the part index swings about its joint, the body bobs; uniforms per material ---- */
  function gaitMaterial(mat,kind){
    var U={uPhase:{value:0}, uAmp:{value:0}, uTrot:{value:0}, uKind:{value:kind==="horse"?1:0}};
    mat.onBeforeCompile=function(sh){
      atmoUniforms(sh);   /* the atmosphere's uniforms (app.js: a material with a hook of its own calls it) */
      for(var k in U) sh.uniforms[k]=U[k];
      sh.vertexShader=sh.vertexShader.replace("#include <common>","#include <common>\nattribute float aPart;\nuniform float uPhase, uAmp, uTrot, uKind;\n"+
        "vec3 swingX(vec3 p, vec3 o, float a){ vec3 q=p-o; float c=cos(a), s=sin(a); return o+vec3(q.x, q.y*c-q.z*s, q.y*s+q.z*c); }\n")
      .replace("#include <begin_vertex>","#include <begin_vertex>\n"+
        "#ifdef USE_INSTANCING\n float ph=uPhase;\n if(uKind>0.5){ vec4 o=instanceMatrix[3]; ph+=6.2831853*fract(sin(dot(o.xz,vec2(12.9898,78.233)))*43758.5453); }\n#else\n float ph=uPhase;\n#endif\n"+
        "float sw=0.0; vec3 piv=vec3(0.0);\n"+
        "if(uKind<0.5){ if(aPart>0.5&&aPart<1.5){ sw=sin(ph)*0.42; piv=vec3(-0.085,0.62,0.0);} else if(aPart>1.5&&aPart<2.5){ sw=-sin(ph)*0.42; piv=vec3(0.085,0.62,0.0);} else if(aPart>2.5&&aPart<3.5){ sw=-sin(ph)*0.30; piv=vec3(-0.245,1.12,0.0);} }\n"+
        "else { float off=0.0; if(aPart>4.5&&aPart<5.5){ off=uTrot>0.5?0.0:0.25; piv=vec3(-0.12,0.69,0.40);} else if(aPart>5.5&&aPart<6.5){ off=uTrot>0.5?0.5:0.75; piv=vec3(0.12,0.69,0.40);} else if(aPart>6.5&&aPart<7.5){ off=uTrot>0.5?0.5:0.0; piv=vec3(-0.12,0.69,-0.40);} else if(aPart>7.5){ off=uTrot>0.5?0.0:0.5; piv=vec3(0.12,0.69,-0.40);} \n"+
        "  if(aPart>4.5) sw=sin(ph+6.2831853*off)*(uTrot>0.5?0.55:0.38); }\n"+
        "transformed=swingX(transformed,piv,sw*uAmp);\n"+
        "transformed.y+=uAmp*(uKind>0.5?(uTrot>0.5?0.05:0.025):0.022)*abs(sin(ph));\n");
    };
    mat.customProgramCacheKey=function(){ return "f8gait"+kind; };
    mat.needsUpdate=true; return U;
  }
  /* the cumulative modelled track distance (map units) at the clock: every leg reached in full, the current one to its u */
  function trackDist(id,t){ var A=anchorList(id), d=0; for(var i=1;i<A.length;i++){ var a=A[i-1], b=A[i]; if(!a.p||!b.p) continue; var w=legWindow(a,b), len=legPath(a,b).len;
      if(t>=w[1]) d+=len; else if(t>w[0]) d+=len*(t-w[0])/((w[1]-w[0])||1); } return d; }
  /* ---- install: swap the three formations' figure geometries; the battery rebuilt from its own gun places ---- */
  function swap(mesh,geo){ var g0=mesh.geometry; F.undo.push(function(){ mesh.geometry=g0; }); mesh.geometry=geo; }
  function install(o){
    if(F.on) uninstall(); F.on=true; F.gait=!!(o&&o.gait); F.recs=[];
    var cache={};
    function facingsOf(kd){ return (o&&o.facings&&kd.dress==="fr_line")?[KIT.cloth.white,KIT.cloth.red]:null; }   /* fr_line: white lapels and turnbacks, red collar (fieffe2_1854, B), no colour class in the table */
    function geoOf(kind,kd,key){ var k=kind+"|"+key+"|"+(facingsOf(kd)?"fc":""); return cache[k]||(cache[k]=kind==="foot"?footFixed(kd.leg,kd.head,kd.gunner,facingsOf(kd)):kind==="rider"?riderFixed(kd.leg,kd.head,kd.cuirass,
      kd.dress==="fr_cuirassier"&&DRESS.fr_cuirassier.furniture&&/dark blue/.test(DRESS.fr_cuirassier.furniture.v||"")?KIT.cloth["dark blue"]:null):kind==="horse"?horse(kd.horseCol):null); }
    var coatFoot=footCoat(), coatRider=riderCoat();
    [IDS.inf,IDS.cav].forEach(function(id){ var b=units[id]&&units[id].block, ud=b&&b.userData; if(!ud) return;
      ud.dress.forEach(function(r){ var kd=r.kd||kitGeneric(FORMATIONS[id].nation);
        r.meshes.forEach(function(m){ var part=m.userData.kit&&m.userData.kit.part, mounted=r.mounted, ng=null, gk=null;
          if(!mounted&&part==="coat"){ ng=coatFoot; gk="man"; } else if(!mounted&&part==="fixed"){ ng=geoOf("foot",kd,[kd.leg,kd.head,kd.gunner?1:0].join("|")); gk="man"; }
          else if(mounted&&part==="horse"){ ng=geoOf("horse",kd,kd.horseCol); gk="horse"; } else if(mounted&&part==="coat"){ ng=coatRider; gk="rider"; }
          else if(mounted&&part==="fixed"){ ng=geoOf("rider",kd,[kd.leg,kd.head,kd.cuirass,kd.dress].join("|")); gk="rider"; }
          if(!ng) return; swap(m,ng);
          /* a rider takes his horse's beat (the horse kind: the same per-instance phase from the same place), his parts never swing, he bobs with it */
          if(F.gait){ var m0=m.material; m.material=m0.clone(); F.undo.push(function(){ m.material.dispose(); m.material=m0; });
            F.recs.push({id:id, kind:mounted?"horse":"man", arm:mounted?"cav":"inf", mat:m.material, U:gaitMaterial(m.material,mounted?"horse":"man")}); } }); }); });
    /* the battery: its deployed and limbered groups hidden, rebuilt in the same places (the build's barrel instances give each gun's place) */
    var hb=units[IDS.art]&&units[IDS.art].block, hu=hb&&hb.userData;
    if(hu&&hu.deployed){
      var guns=[], m4=new THREE.Matrix4(), pv=new THREE.Vector3(), qv=new THREE.Quaternion(), sv=new THREE.Vector3(), bar=hu.deployed.children[0];
      for(var i=0;i<bar.count;i++){ var st=hu.seat.filter(function(s){ return s.mesh===bar; })[0]; guns.push([st.P[i*3],st.P[i*3+2]]); }
      var dep=new THREE.Group(), lim=new THREE.Group(); hu.body.add(dep); hu.body.add(lim);
      var GUN=gun(false), GUNC=gun(true), LIMB=limber(false), LIMBC=limber(true), HORSE=horse(KIT.horse.brown), crewKd=(hu.dress.filter(function(r){ return r.role==="crew"; })[0]||{}).kd||kitGeneric("fr");
      var mk=function(geo,n,vc){ var im=new THREE.InstancedMesh(geo,matte({color:0xFFFFFF,vertexColors:true,flatShading:true}),n); im.castShadow=true; im.frustumCulled=false; return im; };
      var DRV=riderFixed(KIT.mat.legwear,"generic",null,null,true), n=guns.length;
      /* deployed: the guns, their crews, and behind each its limber (the coffret on it) and team with its driver; limbered: the limber, the gun
         hooked behind with the coffret between its cheeks, the team ahead with its driver */
      var gD=mk(GUN,n), cC=mk(coatFoot,n*5), cF=mk(geoOf("foot",crewKd,"crew|"+crewKd.leg+"|"+crewKd.head),n*5), lD=mk(LIMBC,n), hD=mk(HORSE,n*4), dDC=mk(coatRider,n), dDF=mk(DRV,n);
      var gL=mk(GUNC,n), lL=mk(LIMB,n), hT=mk(HORSE,n*4), dC=mk(coatRider,n), dF=mk(DRV,n);
      var col=new THREE.Color(), tint=lin(crewKd.coat||hexNum(NATION.fr.fill)), D=new THREE.Object3D(), local=[];
      function put(im,i,x,y,z,ry,rx){ local.push({im:im,i:i,x:x,y:y,z:z,ry:ry||0,rx:rx||0}); }
      function team(hm,dc,df,k,x,z0,dir){   /* two pairs of horses from z0 in the direction dir (+1 ahead, -1 behind), the driver on the near wheeler */
        [[-0.30,0],[0.30,0],[-0.30,1.4],[0.30,1.4]].forEach(function(h,j){ put(hm,k*4+j,x+h[0]*dir,0,z0+h[1]*dir,dir>0?0:Math.PI); });
        put(dc,k,x-0.30*dir,0,z0,dir>0?0:Math.PI); put(df,k,x-0.30*dir,0,z0,dir>0?0:Math.PI); }
      guns.forEach(function(g,k){ var x=g[0], z=g[1];
        /* deployed: the piece facing +z; five gunners about it as the build has them (two at the muzzle, two at the wheels, one at the trail:
           DESIGN, no drill manual's posts read here); the limber with its team turned to the rear behind the trail (Gassendi's drill, B; the
           distance DESIGN) */
        put(gD,k,x,0,z,0);
        [[-0.75,0.95,0.4],[0.75,0.95,-0.4],[-0.85,-0.1,0.2],[0.85,-0.1,-0.2],[0.25,-1.6,0.0]].forEach(function(c,j){ put(cC,k*5+j,x+c[0],0,z+c[1],c[2]); put(cF,k*5+j,x+c[0],0,z+c[1],c[2]); });
        put(lD,k,x,0,z-3.0,Math.PI); team(hD,dDC,dDF,k,x,z-5.1,-1);
        /* limbered: the limber ahead, the piece hooked behind with its trail up on the limber (pitched 0.33 rad, then turned), the team ahead */
        put(lL,k,x,0,z+0.9,0); put(gL,k,x,0.07,z-0.62,Math.PI,0.33);
        team(hT,dC,dF,k,x,z+3.0,1); });
      [gD,cC,cF,lD,hD,dDC,dDF].forEach(function(im){ dep.add(im); }); [gL,lL,hT,dC,dF].forEach(function(im){ lim.add(im); });
      for(var c=0;c<cC.count;c++){ col.copy(tint).multiplyScalar(0.86+0.28*srnd(c*7+3)); cC.setColorAt(c,col); }
      cC.instanceColor.needsUpdate=true;
      /* the drivers' coats: the nation's symbol colour (no train dress in the table); the horses one brown (decision 109), their bodies taking it as an instance colour */
      [dC,dDC].forEach(function(im){ for(var c2=0;c2<im.count;c2++){ col.copy(lin(hexNum(NATION.fr.fill))).multiplyScalar(0.86+0.28*srnd(c2*5+1)); im.setColorAt(c2,col); } im.instanceColor.needsUpdate=true; });
      [hT,hD].forEach(function(im){ for(var c3=0;c3<im.count;c3++){ col.copy(lin(KIT.horse.brown)).multiplyScalar(0.92+0.16*srnd(c3*11+5)); im.setColorAt(c3,col); } im.instanceColor.needsUpdate=true; });
      function seat(){ if(!hu.seatPrep) return; hu.seatPrep(); var C=hu.upright(), g=new THREE.Vector3(), q=new THREE.Quaternion(), s=new THREE.Vector3(1,1,1), mm=new THREE.Matrix4(), e=new THREE.Euler();
        local.forEach(function(L){ hu.seatLocal(L.x,L.z,g); g.y+=L.y; e.set(L.rx,L.ry,0,"YXZ"); q.setFromEuler(e).premultiply(C); mm.compose(g,q,s); L.im.setMatrixAt(L.i,mm); });
        [gD,cC,cF,lD,hD,dDC,dDF,gL,lL,hT,dC,dF].forEach(function(im){ im.instanceMatrix.needsUpdate=true; }); }
      seat();
      var lay0=hu.layout; hu.layout=function(sw,sd){ lay0(sw,sd); seat(); }; F.undo.push(function(){ hu.layout=lay0; });
      var dv=hu.deployed, lv=hu.limbered; hu.deployed=dep; hu.limbered=lim; dv.visible=false; lv.visible=false; lim.visible=false;
      F.undo.push(function(){ hu.deployed=dv; hu.limbered=lv; hu.body.remove(dep); hu.body.remove(lim); [gD,cC,cF,lD,hD,dDC,dDF,gL,lL,hT,dC,dF].forEach(function(im){ im.material.dispose(); }); });
      if(F.gait){ [cC,cF].forEach(function(im){ F.recs.push({id:IDS.art, kind:"man", arm:"art", mat:im.material, U:gaitMaterial(im.material,"man"), crew:true}); });
        [hT,hD].forEach(function(im){ F.recs.push({id:IDS.art, kind:"horse", arm:"art", mat:im.material, U:gaitMaterial(im.material,"horse"), deployed:im===hD}); });
        [dC,dF,dDC,dDF].forEach(function(im){ F.recs.push({id:IDS.art, kind:"horse", arm:"art", mat:im.material, U:gaitMaterial(im.material,"horse"), deployed:im===dDC||im===dDF}); }); }
      if(hu.layout) hu.layout(hu.sw,hu.sd);
    }
    var upd0=window.updateVisibility; window.updateVisibility=function(){ upd0(); gaitUpdate(); }; F.undo.push(function(){ window.updateVisibility=upd0; });
    updateVisibility(); requestRender(3);
    return {formations:[IDS.inf,IDS.cav,IDS.art], gait:F.gait, materials:F.recs.length};
  }
  /* the phase and amplitude of each formation's gait at the clock: amplitude 1 while its leg is in progress, 0 when it stands, the clock is
     paused at a halt, under reduced motion, or where the cycles on screen would exceed MAX_HZ (clock minutes a second times cycles a clock minute) */
  function gaitUpdate(){
    if(!F.gait) return;
    /* clock hours per real second (0 when paused or scrubbing: a scrub draws poses, not a cycle rate); F.rate: the play speed a recording stands for */
    var vClock=F.rate!=null?F.rate:(playing?MIN_PER_SEC*speed/60:0), changed=false;
    F.recs.forEach(function(R){
      var id=R.id, mr=marchRate(id,clock), moving=!!(mr&&mr.moving), d=trackDist(id,clock), cyc=d/STRIDE[R.arm];
      var hz=moving?vClock*mr.kmh/KM_PER_MAP/STRIDE[R.arm]:0;   /* cycles a real second at the speed played */
      var amp=(!moving||RM)?0:Math.max(0,Math.min(1,(MAX_HZ*1.5-hz)/(MAX_HZ*0.5)));
      if(R.crew&&units[id].block.userData.deployed&&units[id].block.userData.deployed.visible) amp=0;
      var ph=cyc*Math.PI*2, tr=(mr&&mr.kmh>TROT_KMH)?1:0;
      if(R.U.uPhase.value!==ph||R.U.uAmp.value!==amp||R.U.uTrot.value!==tr) changed=true;
      R.U.uPhase.value=ph; R.U.uAmp.value=amp; R.U.uTrot.value=tr; F.hz[id]=+hz.toFixed(2);
    });
    if(changed) requestRender(1);   /* a frame only when a pose changed: a stopped clock or a halted formation leaves the page idle */
  }
  function uninstall(){ while(F.undo.length) F.undo.pop()(); F.on=false; F.recs=[]; updateVisibility(); requestRender(3); }
  window.__p8["f-kit"]={install:function(){ return install({gait:false}); }, uninstall:uninstall};
  window.__p8["f-gait"]={install:function(){ return install({gait:true}); }, uninstall:uninstall};
  window.__p8["f-facings"]={install:function(){ return install({gait:false, facings:true}); }, uninstall:uninstall};
  window.__f8=F; F.trackDist=trackDist; F.gaitUpdate=gaitUpdate; return true;
};
module.exports={inPage, ids:{"f-kit":{},"f-gait":{},"f-facings":{}}};
