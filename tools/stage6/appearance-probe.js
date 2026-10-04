#!/usr/bin/env node
/* Stage 6 Part A (docs/STAGE6_SPEC.md sections 3 and 4): historical appearance prototyped on the built page by a probe. It changes the
   running scene for the measurement (instance colours, the figures' fixed-part geometry, an added facings mesh, the flags' textures) and
   restores it; it changes no source file. The prototype colours, shapes and flag patterns are MEASUREMENT VALUES chosen to stand for the
   classes of section 2 (a dark blue, a dragoon green, a Russian dark green, a white; a bicorne, a bearskin, a crested helmet; collar,
   lapels and cuffs in a contrasting colour; the 1804 lozenge, a cross-and-disc colour, a yellow colour with an eagle): they are not
   proposed values and claim nothing about any regiment.
   node tools/stage6/appearance-probe.js [--json f] [--md f] [--sheet f] [--only views] [--keys views] [--from f.json (the summary only)]

   Per view (tools/stage6/lib.js views()):
   1. identity today: the formations whose figures are drawn in the free rectangle, and for each whether its name or counter is displayed,
      whether its position-confidence mark is drawn (the side's colour, decision 85), and its side;
   2. variants, each against the view as it is (two screenshots): P1 the prototype coats; P2 coats, headgear, facings, cuirasses and flags;
      P2-fac, P2-hat, P2-flag (P2 without the facings, with today's cylinder, with today's flags): the share of the free rectangle each
      changes, the changed pixels per figure in view, solid near-black and mean luminance (measure.js pixels; the Stage 0 limit 0.05%), the
      map text's contrast as rendered (measure.js textContrast; AA), the map layer's drops, the world pass's time; the position-confidence
      marks' share as rendered (measure.js confShare) today and with P2; for P2-fac, P2-hat and P2-flag also solid near-black (which part
      darkens a view);
   2b. a side cue on the ground for every formation (question 12): each ground mark drawn as grade A's crisp footprint (confAt overridden in the
      running page for the measurement), its share of the free rectangle and its contrast against the ground;
   3. with --keys (or the default close views): each formation's coats keyed in magenta, one render each, so the pixels where its coats show
      are found and their rendered colour read today and with P1; the CIEDE2000 difference between formations of the two sides as
      rendered: whether a coat can tell the sides apart once coats are historical. */
const fs=require("fs"), path=require("path");
const L=require("./lib.js");
const {launch,open,settle,HELPERS,inject,views,applyView,shot,contrastOf,darkOf,sheet,EVID6}=L;
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const OUTJ=opt("--json")||path.join(EVID6,"appearance-probe.json"), OUTM=opt("--md")||path.join(EVID6,"appearance-probe.md"), SHEET=opt("--sheet");
const KEYS=(opt("--keys")||"close-sokolnitz,pratzen-low,pratzen-orbit-min,selected-formation,watch-selected,eye-zuran,overview-field,hybrid-dimmed").split(",");

const PROBE=function(){
  var S={saved:null,extra:[],G:null};
  var K=figKit();
  /* prototype classes, per formation: coat colour, headgear, facings colour, cuirass, flag (measurement values only, see the header) */
  var C={frBlue:0x23305A, frGreen:0x2D4A2E, ruGreen:0x253A2A, atWhite:0xE6E2D6, ruWhite:0xEDEAE0, red:0x9E2B25, white:0xEEE9DD, steel:0xA3A8AD, brass:0xB08D57, black:0x2E2B27, fur:0x2A2420};
  var CLS={
    gqg:{coat:C.frGreen,hat:"busby",fac:C.red}, heightguns:{coat:C.frBlue,hat:"bicorne",fac:C.red},
    sthilaire:{coat:C.frBlue,hat:"bicorne",fac:C.white}, vandamme:{coat:C.frBlue,hat:"bicorne",fac:C.white}, legrand:{coat:C.frBlue,hat:"bicorne",fac:C.white},
    friant:{coat:C.frBlue,hat:"bicorne",fac:C.white}, caffarelli:{coat:C.frBlue,hat:"bicorne",fac:C.white}, suchet:{coat:C.frBlue,hat:"bicorne",fac:C.white},
    rivaud:{coat:C.frBlue,hat:"bicorne",fac:C.white}, drouet:{coat:C.frBlue,hat:"bicorne",fac:C.white}, santon:{coat:C.frBlue,hat:"shako",fac:C.white},
    bourcier:{coat:C.frGreen,hat:"helmet",fac:C.red,metal:C.brass}, walther:{coat:C.frGreen,hat:"helmet",fac:C.red,metal:C.brass},
    kellermann:{coat:C.frGreen,hat:"shako",fac:C.red}, nansouty:{coat:C.frBlue,hat:"helmet",fac:C.red,cuirass:true,metal:C.steel},
    dhautpoul:{coat:C.frBlue,hat:"helmet",fac:C.red,cuirass:true,metal:C.steel}, guard_inf:{coat:C.frBlue,hat:"bearskin",fac:C.white},
    guard_cav:{coat:C.frBlue,hat:"bearskin",fac:C.white}, c_gren:{coat:C.frBlue,hat:"bearskin",fac:C.white},
    kienmayer:{coat:C.atWhite,hat:"helmet",fac:C.red,metal:C.black}, kollo:{coat:C.atWhite,hat:"helmet",fac:C.red,metal:C.black},
    dok:{coat:C.ruGreen,hat:"bicorne",fac:C.red}, lang:{coat:C.ruGreen,hat:"bicorne",fac:C.red}, kamensky:{coat:C.ruGreen,hat:"bicorne",fac:C.red},
    prz:{coat:C.ruGreen,hat:"bicorne",fac:C.red}, milo:{coat:C.ruGreen,hat:"bicorne",fac:C.red}, bag:{coat:C.ruGreen,hat:"bicorne",fac:C.red},
    rg_inf:{coat:C.ruGreen,hat:"bicorne",fac:C.red}, rg_cav:{coat:C.ruWhite,hat:"helmet",fac:C.red,metal:C.black},
    lich:{coat:C.ruGreen,hat:"helmet",fac:C.red,metal:C.black,mixCoat:C.atWhite}, ahq:{coat:C.ruGreen,hat:"bicorne",fac:C.red}, buxhowden:{coat:C.ruGreen,hat:"bicorne",fac:C.red}
  };
  S.CLS=CLS;
  /* ---- geometry: the figure kit's own parts, the headgear swapped (figKit's proportions; probe copies of its merge) ---- */
  function merge(parts){ var P=[],N=[],Cc=[], m=new THREE.Matrix4(), q=new THREE.Quaternion(), e=new THREE.Euler(), v=new THREE.Vector3(), n=new THREE.Vector3();
    parts.forEach(function(pt){ var g=pt.geo.index?pt.geo.toNonIndexed():pt.geo; g.computeVertexNormals(); e.set(pt.rot[0],pt.rot[1],pt.rot[2]); q.setFromEuler(e);
      m.compose(new THREE.Vector3(pt.p[0],pt.p[1],pt.p[2]),q,new THREE.Vector3(pt.s[0],pt.s[1],pt.s[2])); var nm=new THREE.Matrix3().getNormalMatrix(m);
      var pa=g.attributes.position.array, na=g.attributes.normal.array, col=lin(pt.col);
      for(var k=0;k<pa.length;k+=3){ v.set(pa[k],pa[k+1],pa[k+2]).applyMatrix4(m); P.push(v.x,v.y,v.z); n.set(na[k],na[k+1],na[k+2]).applyMatrix3(nm).normalize(); N.push(n.x,n.y,n.z); Cc.push(col.r,col.g,col.b); } });
    var o=new THREE.BufferGeometry(); o.setAttribute("position",new THREE.Float32BufferAttribute(P,3)); o.setAttribute("normal",new THREE.Float32BufferAttribute(N,3)); o.setAttribute("color",new THREE.Float32BufferAttribute(Cc,3)); return o; }
  function box(w,h,d){ return new THREE.BoxGeometry(w,h,d); }
  function part(geo,p,col,s,rot){ return {geo:geo,p:p,s:s||[1,1,1],rot:rot||[0,0,0],col:col}; }
  var SKIN=0xC9A98A, BLACK=0x2E2B27, WOOD=0x4A3826, STEEL=0x8A8E92, BREECH=0xBDB8AC, LEATHER=0x3A2E22;
  var head=new THREE.IcosahedronGeometry(0.115,1);
  /* headgear centred on y0 (the hat's base: 1.365 on foot, 1.745 mounted) */
  function hat(kind,y0,metal){
    if(kind==="cylinder") return [part(new THREE.CylinderGeometry(0.115,0.13,0.27,7),[0,y0+0.135,0],BLACK)];
    if(kind==="shako") return [part(new THREE.CylinderGeometry(0.125,0.115,0.25,7),[0,y0+0.125,0],BLACK)];
    if(kind==="bicorne") return [part(box(0.46,0.15,0.09),[0,y0+0.10,0],BLACK), part(box(0.20,0.06,0.20),[0,y0+0.03,0],BLACK)];
    if(kind==="bearskin") return [part(new THREE.CylinderGeometry(0.15,0.13,0.42,8),[0,y0+0.21,0],0x2A2420)];
    if(kind==="busby") return [part(new THREE.CylinderGeometry(0.14,0.13,0.30,8),[0,y0+0.15,0],0x3A2C22), part(box(0.05,0.18,0.06),[0.10,y0+0.20,-0.04],0x9E2B25)];
    if(kind==="helmet") return [part(new THREE.SphereGeometry(0.135,8,5,0,Math.PI*2,0,Math.PI/2),[0,y0-0.02,0],metal||STEEL),
      part(box(0.05,0.13,0.27),[0,y0+0.15,-0.01],metal===BLACK?BLACK:metal||STEEL), part(box(0.07,0.30,0.05),[0,y0-0.05,-0.13],BLACK)];
    return [];
  }
  function infFixed(kind,metal){ return merge([part(box(0.13,0.62,0.18),[-0.09,0.31,0],BREECH),part(box(0.13,0.62,0.18),[0.09,0.31,0],BREECH),part(head,[0,1.30,0],SKIN)]
    .concat(hat(kind,1.365,metal),[part(box(0.28,0.30,0.14),[0,0.96,-0.20],LEATHER),part(box(0.045,1.25,0.045),[0.27,1.12,0.12],WOOD,null,[0.18,0,0.10]),part(box(0.03,0.32,0.03),[0.33,1.82,0.06],STEEL,null,[0.18,0,0.10])])); }
  function riderFixed(kind,metal){ return merge([part(head,[0,1.68,0],SKIN)].concat(hat(kind,1.745,metal),[part(box(0.11,0.34,0.14),[-0.14,0.98,0.05],BREECH,null,[0.5,0,0]),
    part(box(0.11,0.34,0.14),[0.14,0.98,0.05],BREECH,null,[0.5,0,0]),part(box(0.03,0.95,0.03),[0.28,1.55,0.10],STEEL,null,[-0.55,0,0.15])])); }
  /* facings on the coat: collar, two lapels, two cuffs (on foot: torso 0.36 x 0.56 at 0.62-1.18, front at z 0.12); a cuirass for the cuirassiers */
  function facings(mounted,col,cuirass){ var p=[];
    if(!mounted){ p.push(part(box(0.30,0.07,0.25),[0,1.15,0],col),part(box(0.07,0.40,0.012),[-0.075,0.93,0.126],col),part(box(0.07,0.40,0.012),[0.075,0.93,0.126],col),
      part(box(0.11,0.08,0.13),[-0.24,0.66,0.02],col),part(box(0.11,0.08,0.13),[0.24,0.70,0.12],col,null,[-0.35,0,0])); }
    else { p.push(part(box(0.27,0.06,0.23),[0,1.52,0],col),part(box(0.06,0.34,0.012),[-0.07,1.31,0.116],col),part(box(0.06,0.34,0.012),[0.07,1.31,0.116],col),
      part(box(0.11,0.08,0.13),[-0.22,1.09,0],col),part(box(0.11,0.08,0.13),[0.22,1.11,0.04],col));
      if(cuirass) p.push(part(box(0.35,0.36,0.25),[0,1.28,0],cuirass)); }
    return merge(p); }
  /* flag textures, 128 x 64 like today's (the cloth stays 2.4 x 1.4: only its painting changes) */
  function flagProto(kind){ var c=document.createElement("canvas"); c.width=128; c.height=64; var x=c.getContext("2d");
    if(kind==="fr"){ x.fillStyle="#1F3E8F"; x.fillRect(0,0,128,64); x.fillStyle="#B5262B"; x.beginPath(); x.moveTo(64,0); x.lineTo(128,0); x.lineTo(128,32); x.closePath(); x.fill();
      x.beginPath(); x.moveTo(0,32); x.lineTo(0,64); x.lineTo(64,64); x.closePath(); x.fill();
      x.fillStyle="#EEE9DD"; x.beginPath(); x.moveTo(64,0); x.lineTo(128,32); x.lineTo(64,64); x.lineTo(0,32); x.closePath(); x.fill();
      x.fillStyle="#C9A23A"; x.fillRect(52,26,24,3); x.fillRect(48,33,32,3); }
    else if(kind==="ru"){ x.fillStyle="#2B4E7E"; x.fillRect(0,0,128,64); x.fillStyle="#E9E2D2"; x.beginPath(); x.moveTo(0,0); x.lineTo(128,64); x.lineTo(128,52); x.lineTo(24,0); x.closePath(); x.fill();
      x.beginPath(); x.moveTo(128,0); x.lineTo(0,64); x.lineTo(0,52); x.lineTo(104,0); x.closePath(); x.fill();
      x.fillStyle="#D9822B"; x.beginPath(); x.arc(64,32,12,0,Math.PI*2); x.fill(); x.fillStyle="#1A1714"; x.fillRect(58,26,12,12); }
    else { x.fillStyle="#E2B634"; x.fillRect(0,0,128,64); for(var k=0;k<32;k++){ x.fillStyle=["#B5262B","#EEE9DD","#1A1714","#E2B634"][k%4];
        x.beginPath(); x.moveTo(k*4,0); x.lineTo(k*4+4,0); x.lineTo(k*4+2,6); x.closePath(); x.fill(); x.beginPath(); x.moveTo(k*4,64); x.lineTo(k*4+4,64); x.lineTo(k*4+2,58); x.closePath(); x.fill(); }
      x.fillStyle="#1A1714"; x.fillRect(54,20,20,24); x.fillRect(46,22,8,6); x.fillRect(74,22,8,6); }
    return ctexS(c); }
  S.save=function(){ if(S.saved) return; var sv=[];
    Object.keys(units).forEach(function(id){ var b=units[id].block; if(!b) return; b.traverse(function(o){ if(!o.isInstancedMesh) return;
      sv.push({id:id,o:o,geo:o.geometry,ic:o.instanceColor?Float32Array.from(o.instanceColor.array):null,map:(o.material&&o.material.map)||null}); }); });
    S.saved=sv;
    var G={inf:{},rid:{},fac:{},flag:{fr:flagProto("fr"),ru:flagProto("ru"),at:flagProto("at")}};
    S.G=G; };
  function geoFor(set,kind,metal){ var k=kind+"|"+(metal||0); if(!S.G[set][k]) S.G[set][k]=(set==="inf"?infFixed:riderFixed)(kind,metal); return S.G[set][k]; }
  S.restore=function(){ if(!S.saved) return; S.saved.forEach(function(e){ e.o.geometry=e.geo; if(e.ic){ e.o.instanceColor.array.set(e.ic); e.o.instanceColor.needsUpdate=true; }
      if(e.o.material&&e.map&&e.o.material.map!==e.map){ e.o.material.map=e.map; e.o.material.needsUpdate=true; } });
    S.extra.forEach(function(m){ if(m.parent) m.parent.remove(m); }); S.extra=[]; requestRender(2); };
  /* the variant: o.coats, o.hats, o.facings, o.flags (booleans); o.key: a formation whose coats are drawn magenta */
  S.apply=function(o){ S.save(); S.restore(); var lc=new THREE.Color();
    S.saved.forEach(function(e){ var cl=CLS[e.id], f=FORMATIONS[e.id], m=e.o; if(!cl) return;
      var coatMesh=(m.geometry===K.infCoat||m.geometry===K.rider)&&!!e.ic;
      if(coatMesh&&(o.coats||o.key===e.id)){ var base=lin(parseInt(NATION[f.nation].fill.slice(1),16)), mixB=f.mix?lin(parseInt(NATION[f.mix.nation].fill.slice(1),16)):null, A=m.instanceColor.array;
        for(var i=0;i<A.length/3;i++){ var r=e.ic[i*3], g=e.ic[i*3+1], b=e.ic[i*3+2], mx=Math.max(r,g,b);
          var isMix=mixB&&Math.abs(r/mx-mixB.r/Math.max(mixB.r,mixB.g,mixB.b))<0.02&&Math.abs(b/mx-mixB.b/Math.max(mixB.r,mixB.g,mixB.b))<0.02;
          var ref=isMix?mixB:base, j=mx/Math.max(ref.r,ref.g,ref.b);
          if(o.key===e.id) lc.setRGB(1,0,1); else { lc.copy(lin(isMix&&cl.mixCoat?cl.mixCoat:cl.coat)).multiplyScalar(j); }
          A[i*3]=lc.r; A[i*3+1]=lc.g; A[i*3+2]=lc.b; }
        m.instanceColor.needsUpdate=true; }
      if(o.hats&&m.geometry===K.infFixed) m.geometry=geoFor("inf",cl.hat,cl.metal);
      if(o.hats&&m.geometry===K.riderFixed) m.geometry=geoFor("rid",cl.hat==="bicorne"&&FORMATIONS[e.id].arm==="cav"?"helmet":cl.hat,cl.metal);
      if(o.facings&&coatMesh){ var mounted=m.geometry===K.rider, key=(mounted?"m":"f")+"|"+cl.fac+"|"+(cl.cuirass&&mounted?1:0);
        if(!S.G.fac[key]) S.G.fac[key]=facings(mounted,cl.fac,cl.cuirass&&mounted?cl.metal||C.steel:0);
        var fm=new THREE.InstancedMesh(S.G.fac[key],matte({color:0xFFFFFF,vertexColors:true,flatShading:true}),m.count), M=new THREE.Matrix4();
        for(var q=0;q<m.count;q++){ m.getMatrixAt(q,M); fm.setMatrixAt(q,M); } fm.castShadow=true; fm.visible=m.visible; m.parent.add(fm); S.extra.push(fm); }
      if(o.flags&&m===units[e.id].block.userData.flags){ m.material.map=S.G.flag[f.nation]; m.material.needsUpdate=true; } });
    requestRender(2); return true; };
  /* identity today: the formations drawn in the free rectangle; name, counter, confidence mark, side */
  S.identity=function(){ var fr=(mode!=="staff")?landFreeRect():MAPCAM.freeRect(null,landPanels()), R=__s5.panels(), v=new THREE.Vector3(), VW=renderer.domElement.clientWidth||innerWidth, VH=viewH(), out=[];
    camera.updateMatrixWorld(true);
    Object.keys(units).forEach(function(id){ var r=units[id], f=FORMATIONS[id], b=r.block; var p=posNow(id); if(!p) return;
      var w=W(p[0],p[1]); v.set(w[0],groundY(w[0],w[1]),w[1]).project(camera); var sx=(v.x*0.5+0.5)*VW, sy=(-v.y*0.5+0.5)*VH;
      if(v.z>1||sx<fr[0]||sx>fr[2]||sy<fr[1]||sy>fr[3]) return; for(var k=0;k<R.length;k++){ var q=R[k]; if(sx>=q[0]&&sx<q[2]&&sy>=q[1]&&sy<q[3]) return; }
      var nm=ML.items["n:"+id], ct=ML.items["c:"+id];
      out.push({id:id,side:sideOfNation(f.nation),figures:!!(b&&__aus.effVisible(b)),name:!!(nm&&nm.on),counter:!!(ct&&ct.on),conf:!!((r.conf&&r.conf.visible)||(r.foot&&r.foot.visible)),
        dist:+camera.position.distanceTo(new THREE.Vector3(w[0],groundY(w[0],w[1]),w[1])).toFixed(1)}); });
    return out; };
  S.figuresInView=function(){ var n=0, fr=(mode!=="staff")?landFreeRect():MAPCAM.freeRect(null,landPanels()), M=new THREE.Matrix4(), v=new THREE.Vector3(), VW=renderer.domElement.clientWidth||innerWidth, VH=viewH();
    camera.updateMatrixWorld(true);
    Object.keys(units).forEach(function(id){ var b=units[id].block; if(!b||!__aus.effVisible(b)) return; b.updateMatrixWorld(true);
      b.traverse(function(o){ if(!o.isInstancedMesh||!(o.geometry===K.infCoat||o.geometry===K.rider)||!__aus.effVisible(o)) return;
        for(var i=0;i<o.count;i++){ o.getMatrixAt(i,M); v.setFromMatrixPosition(M).applyMatrix4(o.matrixWorld).project(camera); var sx=(v.x*0.5+0.5)*VW, sy=(-v.y*0.5+0.5)*VH;
          if(v.z<1&&sx>=fr[0]&&sx<=fr[2]&&sy>=fr[1]&&sy<=fr[3]) n++; } }); });
    return n; };
  /* the pixels where a formation's coats show (the key render against the variant's own), and their colour in two shots */
  function lab(r,g,b){ function l(c){ c/=255; return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4); } var R=l(r),G=l(g),B=l(b);
    var X=(0.4124*R+0.3576*G+0.1805*B)/0.95047, Y=(0.2126*R+0.7152*G+0.0722*B), Z=(0.0193*R+0.1192*G+0.9505*B)/1.08883;
    function f(t){ return t>0.008856?Math.cbrt(t):7.787*t+16/116; } return [116*f(Y)-16,500*(f(X)-f(Y)),200*(f(Y)-f(Z))]; }
  S.de2000=function(a,b){ var L1=a[0],a1=a[1],b1=a[2],L2=b[0],a2=b[1],b2=b[2], avgL=(L1+L2)/2, C1=Math.hypot(a1,b1), C2=Math.hypot(a2,b2), avgC=(C1+C2)/2,
      G=0.5*(1-Math.sqrt(Math.pow(avgC,7)/(Math.pow(avgC,7)+Math.pow(25,7)))), a1p=a1*(1+G), a2p=a2*(1+G), C1p=Math.hypot(a1p,b1), C2p=Math.hypot(a2p,b2), avgCp=(C1p+C2p)/2;
    function hp(x,y){ if(x===0&&y===0) return 0; var h=Math.atan2(y,x)*180/Math.PI; return h<0?h+360:h; }
    var h1p=hp(a1p,b1), h2p=hp(a2p,b2), dhp=Math.abs(h1p-h2p)<=180?h2p-h1p:(h2p<=h1p?h2p-h1p+360:h2p-h1p-360), avgHp=Math.abs(h1p-h2p)>180?(h1p+h2p+360)/2:(h1p+h2p)/2;
    var T=1-0.17*Math.cos((avgHp-30)*Math.PI/180)+0.24*Math.cos(2*avgHp*Math.PI/180)+0.32*Math.cos((3*avgHp+6)*Math.PI/180)-0.20*Math.cos((4*avgHp-63)*Math.PI/180);
    var dLp=L2-L1, dCp=C2p-C1p, dHp=2*Math.sqrt(C1p*C2p)*Math.sin(dhp*Math.PI/360), SL=1+0.015*Math.pow(avgL-50,2)/Math.sqrt(20+Math.pow(avgL-50,2)), SC=1+0.045*avgCp, SH=1+0.015*avgCp*T;
    var dT=30*Math.exp(-Math.pow((avgHp-275)/25,2)), RC=2*Math.sqrt(Math.pow(avgCp,7)/(Math.pow(avgCp,7)+Math.pow(25,7))), RT=-RC*Math.sin(2*dT*Math.PI/180);
    return Math.sqrt(Math.pow(dLp/SL,2)+Math.pow(dCp/SC,2)+Math.pow(dHp/SH,2)+RT*(dCp/SC)*(dHp/SH)); };
  S.keyColour=function(keyB64,refB64,todayB64){ function img(b){ return new Promise(function(r){ var i=new Image(); i.onload=function(){ var c=document.createElement("canvas"); c.width=i.width; c.height=i.height;
      var x=c.getContext("2d",{willReadFrequently:true}); x.drawImage(i,0,0); r({w:i.width,d:x.getImageData(0,0,i.width,i.height).data}); }; i.src="data:image/png;base64,"+b; }); }
    var fr=(mode!=="staff")?landFreeRect():MAPCAM.freeRect(null,landPanels()), R=__s5.panels();
    return Promise.all([img(keyB64),img(refB64),img(todayB64)]).then(function(I){ var Kd=I[0].d, Rd=I[1].d, Td=I[2].d, Wd=I[0].w, n=0, s=[0,0,0], t=[0,0,0];
      for(var y=Math.ceil(fr[1]);y<Math.floor(fr[3]);y++) for(var x=Math.ceil(fr[0]);x<Math.floor(fr[2]);x++){ var inP=false; for(var k=0;k<R.length;k++){ var q=R[k]; if(x>=q[0]&&x<q[2]&&y>=q[1]&&y<q[3]){ inP=true; break; } } if(inP) continue;
        var o=(y*Wd+x)*4; if(!(Kd[o]-Kd[o+1]>40&&Kd[o+2]-Kd[o+1]>40)) continue; if(Math.abs(Kd[o]-Rd[o])+Math.abs(Kd[o+1]-Rd[o+1])+Math.abs(Kd[o+2]-Rd[o+2])<60) continue;
        n++; s[0]+=Rd[o]; s[1]+=Rd[o+1]; s[2]+=Rd[o+2]; t[0]+=Td[o]; t[1]+=Td[o+1]; t[2]+=Td[o+2]; }
      if(!n) return {px:0};
      var m=s.map(function(v){ return v/n; }), mt=t.map(function(v){ return v/n; });
      function hx(c){ return "#"+c.map(function(v){ return ("0"+Math.round(v).toString(16)).slice(-2); }).join("").toUpperCase(); }
      return {px:n,proto:hx(m),today:hx(mt),labProto:lab(m[0],m[1],m[2]).map(function(v){ return +v.toFixed(2); }),labToday:lab(mt[0],mt[1],mt[2]).map(function(v){ return +v.toFixed(2); })}; }); };
  window.__s6=S; return true;
};

(async()=>{
  const FROM=opt("--from");
  const out=FROM?JSON.parse(fs.readFileSync(FROM,"utf8")):{html:process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html",when:new Date().toISOString(),views:{}}, tiles=[];
  if(!FROM){
  const browser=await launch(), page=await open(browser,[1600,900]);
  await inject(page,HELPERS); await inject(page,PROBE);
  const ONLY=opt("--only"), RUN=ONLY?views().filter(v=>ONLY.split(",").includes(v.key)):views();
  const quick=async()=>{ await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); };
  for(const V of RUN){
    const t0=Date.now();
    await applyView(page,V);
    await page.evaluate(()=>{ if(window.__s6.saved){ __s6.restore(); __s6.saved=null; } });   /* a fresh save per view: the blocks' state is the view's */
    const r={clock:V.c.t,factor:V.c.factor||4,identity:await page.evaluate(()=>__s6.identity()),figures:await page.evaluate(()=>__s6.figuresInView())};
    const b0=await shot(page);
    r.base={layer:await page.evaluate(()=>__s5.layer()),contrast:await contrastOf(page,b0),dark:await darkOf(page,b0),worldMs:await page.evaluate(()=>__s5.frame(3))};
    if(r.figures>0){
      /* the confidence marks' share today: the view without them */
      await page.evaluate(()=>{ layerOn.confidence=false; }); await quick(); const c0=await shot(page);
      await page.evaluate(()=>{ layerOn.confidence=true; }); await quick();
      r.base.confShare=await page.evaluate(([a,b])=>window.__aus.confShare(a,b),[b0,c0]);
      const VAR={P1:{coats:true},P2:{coats:true,hats:true,facings:true,flags:true},"P2-fac":{coats:true,hats:true,flags:true},"P2-hat":{coats:true,facings:true,flags:true},"P2-flag":{coats:true,hats:true,facings:true}};
      const shots={};
      for(const k of Object.keys(VAR)){
        await page.evaluate(o=>__s6.apply(o),VAR[k]); await quick(); const b=await shot(page); shots[k]=b;
        const d=await page.evaluate(([a,b])=>__s5.diff(a,b,8),[b0,b]);
        const e={diff:d,changedPerFigure:d.samples?+(d.changed*d.samples*4/r.figures).toFixed(2):0};
        if(k==="P1"||k==="P2"){ e.layer=await page.evaluate(()=>__s5.layer()); e.contrast=await contrastOf(page,b); e.dark=await darkOf(page,b); e.worldMs=await page.evaluate(()=>__s5.frame(3)); }
        else e.dark=await darkOf(page,b);   /* P2 without one part: which part darkens the view */
        if(k==="P2"){ await page.evaluate(()=>{ layerOn.confidence=false; }); await quick(); const c1=await shot(page); await page.evaluate(()=>{ layerOn.confidence=true; }); await quick();
          e.confShare=await page.evaluate(([a,b])=>window.__aus.confShare(a,b),[b,c1]); }
        r[k]=e; }
      /* a side cue on the ground for every formation (question 12): each ground mark drawn as the crisp footprint (grade A's mark, the
         side's colour) whatever its grade; confAt is overridden in the running page for the measurement and restored */
      await page.evaluate(()=>{ window.__confAt0=confAt; window.confAt=function(id,t){ var c=window.__confAt0(id,t); return {cf:"A",interp:c.interp}; }; });
      await quick(); const sd1=await shot(page);
      await page.evaluate(()=>{ layerOn.confidence=false; }); await quick(); const sd0=await shot(page);
      await page.evaluate(()=>{ layerOn.confidence=true; window.confAt=window.__confAt0; }); await quick();
      r.sideMark={confShare:await page.evaluate(([a,b])=>window.__aus.confShare(a,b),[sd1,sd0]),diff:await page.evaluate(([a,b])=>__s5.diff(a,b,8),[sd0,sd1])};
      /* what each part of P2 adds, as rendered: P2 against P2 without it (changed px over the free rectangle, sampled every 2 px, x4) */
      r.parts={};
      for(const [k,nm] of [["P2-fac","facings"],["P2-hat","headgear"],["P2-flag","flags"]]){ const d=await page.evaluate(([a,b])=>__s5.diff(a,b,8),[shots[k],shots.P2]);
        r.parts[nm]={changed:d.changed,px:Math.round(d.changed*d.samples*4),perFigure:+(d.changed*d.samples*4/r.figures).toFixed(2),contrastMedian:d.contrastMedian}; }
      if(SHEET&&["pratzen-orbit-min","pratzen-low","close-sokolnitz","eye-zuran"].includes(V.key)){ tiles.push({png:Buffer.from(b0,"base64"),cap:V.key+" today"}); tiles.push({png:Buffer.from(shots.P2,"base64"),cap:V.key+" prototype P2"}); }
      /* each formation's coats keyed, against P1 */
      if(KEYS.includes(V.key)){ r.keys={};
        await page.evaluate(()=>__s6.apply({coats:true})); await quick(); const p1=await shot(page);
        for(const it of r.identity.filter(q=>q.figures)){
          await page.evaluate(id=>__s6.apply({coats:true,key:id}),it.id); await quick(); const kb=await shot(page);
          const kc=await page.evaluate(([a,b,c])=>__s6.keyColour(a,b,c),[kb,p1,b0]); if(kc.px>=12) r.keys[it.id]=Object.assign({side:it.side},kc); }
        const ids=Object.keys(r.keys), cross={today:[],proto:[]};
        for(let i=0;i<ids.length;i++) for(let j=i+1;j<ids.length;j++){ const A=r.keys[ids[i]], B=r.keys[ids[j]]; if(A.side===B.side) continue;
          const dt=await page.evaluate(([a,b])=>__s6.de2000(a,b),[A.labToday,B.labToday]), dp=await page.evaluate(([a,b])=>__s6.de2000(a,b),[A.labProto,B.labProto]);
          cross.today.push([ids[i],ids[j],+dt.toFixed(1)]); cross.proto.push([ids[i],ids[j],+dp.toFixed(1)]); }
        cross.today.sort((a,b)=>a[2]-b[2]); cross.proto.sort((a,b)=>a[2]-b[2]); r.cross={today:cross.today.slice(0,6),proto:cross.proto.slice(0,6),pairs:cross.today.length}; }
      await page.evaluate(()=>__s6.restore()); await quick();
    }
    r.seconds=Math.round((Date.now()-t0)/1000);
    out.views[V.key]=r;
    const idn=r.identity, drawn=idn.filter(q=>q.figures);
    console.log(V.key.padEnd(24),"figs",r.figures,"formations",drawn.length,"named",drawn.filter(q=>q.name||q.counter).length,"conf",drawn.filter(q=>q.conf).length,
      r.P2?"| P1 chg "+r.P1.diff.changed+" blk "+r.P1.dark.solidBlack+" AA- "+r.P1.contrast.belowAA+" | P2 chg "+r.P2.diff.changed+" blk "+r.P2.dark.solidBlack+" AA- "+r.P2.contrast.belowAA+" min "+r.P2.contrast.min+
      " drop "+r.base.layer.dropped+"/"+r.P2.layer.dropped+" conf "+r.base.confShare.share+"/"+r.P2.confShare.share+" | fac/fig "+r.parts.facings.perFigure+" hat/fig "+r.parts.headgear.perFigure+" flag px "+r.parts.flags.px:"",
      r.cross?"| cross dE today "+(r.cross.today[0]||[])[2]+" proto "+(r.cross.proto[0]||[])[2]+" "+JSON.stringify(r.cross.proto[0]||""):"","| "+r.seconds+" s");
    fs.writeFileSync(OUTJ,JSON.stringify(out,null,1));
  }
  if(SHEET&&tiles.length) fs.writeFileSync(SHEET,await sheet(page,tiles,2,800,450,"Stage 6 Part A: prototype appearance P2 (measurement values, not proposals) against the view today"));
  if(page._errors.length){ console.log("page errors:",page._errors.slice(0,5)); out.pageErrors=page._errors.slice(0,5); fs.writeFileSync(OUTJ,JSON.stringify(out,null,1)); }
  await browser.close();
  }
  /* the markdown */
  const md=["# Stage 6 Part A: prototype appearance, measured ("+out.html+")\n",
    "`node tools/stage6/appearance-probe.js`. P1: prototype coats; P2: coats, headgear, facings, cuirasses and flags (measurement values, not proposals). "+
    "Solid near-black: the share of 8 x 8 blocks at least 90% near-black outside the panels (Stage 0 limit 0.0005). Map text: the lowest contrast as rendered and the "+
    "number below AA. The confidence marks' share as rendered (`measure.js` `confShare`). Changed: the share of the free rectangle that differs from the view as it is.\n",
    "## Identity today, and the thresholds\n",
    "| view | figures in view | formations with figures | named or countered | with a ground mark | solid black today / P1 / P2 | mean luminance today / P2 | text min today / P2 (below AA) | drops today / P2 | confidence share today / P2 | changed P1 / P2 |","|---|---|---|---|---|---|---|---|---|---|---|"];
  Object.keys(out.views).forEach(k=>{ const r=out.views[k], d=r.identity.filter(q=>q.figures);
    if(!r.P2) return md.push("| "+k+" | "+r.figures+" | "+d.length+" | "+d.filter(q=>q.name||q.counter).length+" | "+d.filter(q=>q.conf).length+" | "+r.base.dark.solidBlack+" / - / - | "+r.base.dark.meanLum+" / - | "+r.base.contrast.min+" / - ("+r.base.contrast.belowAA+") | "+r.base.layer.dropped+" / - | - | - |");
    md.push("| "+k+" | "+r.figures+" | "+d.length+" | "+d.filter(q=>q.name||q.counter).length+" | "+d.filter(q=>q.conf).length+" | "+r.base.dark.solidBlack+" / "+r.P1.dark.solidBlack+" / "+r.P2.dark.solidBlack+" | "+
      r.base.dark.meanLum+" / "+r.P2.dark.meanLum+" | "+r.base.contrast.min+" / "+r.P2.contrast.min+" ("+r.base.contrast.belowAA+" / "+r.P2.contrast.belowAA+") | "+r.base.layer.dropped+" / "+r.P2.layer.dropped+" | "+
      r.base.confShare.share+" / "+r.P2.confShare.share+" | "+r.P1.diff.changed+" / "+r.P2.diff.changed+" |"); });
  md.push("\n## What each part of P2 changes, as rendered (px over the free rectangle, and per figure in view; the median contrast of the changed pixels against the same pixels without the part)\n",
    "| view | facings px (per figure, contrast) | headgear px (per figure, contrast) | flags px (contrast) | world pass ms today / P2 | a crisp side footprint for every formation: share (median contrast, share at 3:1) |","|---|---|---|---|---|---|");
  Object.keys(out.views).forEach(k=>{ const r=out.views[k]; if(!r.parts) return; const P=r.parts;
    md.push("| "+k+" | "+P.facings.px+" ("+P.facings.perFigure+", "+P.facings.contrastMedian+") | "+P.headgear.px+" ("+P.headgear.perFigure+", "+P.headgear.contrastMedian+") | "+P.flags.px+" ("+P.flags.contrastMedian+") | "+r.base.worldMs+" / "+r.P2.worldMs+" | "+(r.sideMark?r.sideMark.confShare.share+" ("+r.sideMark.diff.contrastMedian+", "+r.sideMark.diff.share3to1+")":"-")+" |"); });
  md.push("\n## Coats as rendered: the closest pairs of formations of opposite sides (CIEDE2000), today and in prototype P1\n","| view | formations keyed | pairs | closest today | closest in P1 |","|---|---|---|---|---|");
  Object.keys(out.views).forEach(k=>{ const r=out.views[k]; if(!r.cross) return; const f=a=>a.slice(0,3).map(p=>p[0]+"-"+p[1]+" "+p[2]).join("; ");
    md.push("| "+k+" | "+Object.keys(r.keys).length+" | "+r.cross.pairs+" | "+f(r.cross.today)+" | "+f(r.cross.proto)+" |"); });
  md.push("\n## Each keyed formation's coats as rendered (mean sRGB of the pixels where its coats show; px)\n");
  Object.keys(out.views).forEach(k=>{ const r=out.views[k]; if(!r.keys) return;
    md.push("- **"+k+"**: "+Object.keys(r.keys).map(id=>{ const q=r.keys[id]; return id+" ("+q.side+", "+q.px+" px) "+q.today+" -> "+q.proto; }).join("; ")); });
  fs.writeFileSync(OUTM,md.join("\n")+"\n");
})().catch(e=>{ console.error(e); process.exit(2); });
