/* Headless harness: stub enough of THREE + DOM to run init() and several frames,
   catching anything that would throw or warn in the browser. */
const warns=[], errs=[];
const origWarn=console.warn, origErr=console.error;
console.warn=(...a)=>warns.push(a.join(" "));
console.error=(...a)=>errs.push(a.join(" "));

/* The maths is the real three.js r128 (the devDependency three@0.128.0): vectors, matrices, quaternions,
   Euler angles, spherical coordinates, and Object3D's transforms (position, rotation, quaternion, scale,
   matrix, matrixWorld, lookAt) and the cameras' projection. Stage 0 seats every figure through world
   matrices and places labels through the camera's projection, which token maths cannot exercise.
   Rendering stays stubbed: renderer, render targets, textures, materials, geometries, Color; but every
   material's parameters are checked by a real r128 material (T-1, below). */
const REAL=require('three');
class Col{constructor(h){this.r=1;this.g=1;this.b=1;this.setHex(h===undefined?0xffffff:h)}
 setHex(h){this.hex=h;this.r=((h>>16)&255)/255;this.g=((h>>8)&255)/255;this.b=(h&255)/255;return this}
 copy(c){this.r=c.r;this.g=c.g;this.b=c.b;this.hex=c.hex;return this}
 clone(){const c=new Col(0);c.r=this.r;c.g=this.g;c.b=this.b;c.hex=this.hex;return c}
 lerp(c,t){this.r+=(c.r-this.r)*t;this.g+=(c.g-this.g)*t;this.b+=(c.b-this.b)*t;return this}
 multiplyScalar(k){this.r*=k;this.g*=k;this.b*=k;return this}
 setHSL(){return this}
 getHexString(){const h=x=>("0"+Math.round(Math.max(0,Math.min(1,x))*255).toString(16)).slice(-2);return h(this.r)+h(this.g)+h(this.b)}
 convertSRGBToLinear(){const f=x=>x<0.04045?x/12.92:Math.pow((x+0.055)/1.055,2.4);this.r=f(this.r);this.g=f(this.g);this.b=f(this.b);return this}
 convertLinearToSRGB(){const f=x=>x<0.0031308?x*12.92:1.055*Math.pow(x,1/2.4)-0.055;this.r=f(this.r);this.g=f(this.g);this.b=f(this.b);return this}}
class Obj extends REAL.Object3D{}
function attr(n,item){const a={count:n,array:new Float32Array(n*item),needsUpdate:false,
  getX:i=>a.array[i*item],getY:i=>a.array[i*item+1],getZ:i=>a.array[i*item+2],
  setY(i,v){a.array[i*item+1]=v},setXYZ(i,x,y,z){a.array[i*item]=x;a.array[i*item+1]=y;a.array[i*item+2]=z},set(x){a.array.set(x)}};return a;}
class Geo{constructor(n=12){this.attributes={position:attr(n,3),normal:attr(n,3),color:attr(n,3)};this.index={};}
 rotateX(){return this}
 toNonIndexed(){ if(!this.index) console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."); this.index=null; return this }
 computeVertexNormals(){}
 setAttribute(k,v){this.attributes[k]=v;return this} setIndex(i){this.index=Array.isArray(i)?{array:i,count:i.length}:i;return this}   /* as three's: it keeps the index (Stage 8, 8B: groundPatch rewrites its own) */
 setFromPoints(){return this} setDrawRange(){return this} dispose(){}}
const stub={
 Vector3:REAL.Vector3, Color:Col, Object3D:Obj, Group:Obj,
 Spherical:REAL.Spherical,
 Scene:class extends Obj{},
 PerspectiveCamera:REAL.PerspectiveCamera,
 WebGLRenderer:class{constructor(){this.domElement={style:{},clientHeight:900,clientWidth:1600,
   addEventListener(){},setPointerCapture(){}};this.shadowMap={enabled:true,type:0};
   this.capabilities={isWebGL2:true};this.extensions={get:()=>true};this.autoClear=true;
   /* Stage 0: render statistics (renderer.info, reset each frame by renderFrame) */
   this.info={autoReset:true,reset(){},render:{calls:0,triangles:0,points:0,lines:0},memory:{geometries:0,textures:0},programs:[]}}
   setPixelRatio(){}setSize(){}
   render(sc){
     /* r128 WebGLBackground: a Color background forces a clear even with autoClear=false */
     if(this.autoClear===false && sc && sc.background && sc.background.hex!==undefined && this._target===null)
       throw new Error("render order: a pass with autoClear=false rendered a scene whose background is a Color to the screen; r128 forces a clear and wipes the frame");
     if(!this._passes) this._passes=[];
     this._passes.push(this._target===null?"screen":"rt");
   }
   setRenderTarget(t){this._target=t===undefined?null:t}clear(){}
   /* Stage 8, implementation PR 8B: the ground's depth pass keeps the clear colour and the target it found */
   getRenderTarget(){return this._target||null} getClearColor(c){return c} getClearAlpha(){return 1} setClearColor(){}
   getDrawingBufferSize(v){v.x=1600;v.y=900;return v}},
 WebGLRenderTarget:class{constructor(w,h,o){this.width=w;this.height=h;
   this.texture={generateMipmaps:true};Object.assign(this,o||{})}
   setSize(w,h){this.width=w;this.height=h} dispose(){}},
 ShaderMaterial:function(o){new REAL.ShaderMaterial(o);   /* r128 checks the parameters (T-1, below) */
   Object.assign(this,o||{});this.uniforms=o&&o.uniforms||{};
   this.dispose=()=>{};this.userData={}},
 OrthographicCamera:REAL.OrthographicCamera,
 PMREMGenerator:class{constructor(){}compileEquirectangularShader(){}
   fromEquirectangular(){return {texture:{},dispose(){}}} dispose(){}},
 HalfFloatType:1016, RGBAFormat:1023, LinearEncoding:3000, NoToneMapping:0,
 EquirectangularReflectionMapping:303,
 Matrix4:REAL.Matrix4, Matrix3:REAL.Matrix3, Quaternion:REAL.Quaternion, Euler:REAL.Euler, Vector2:REAL.Vector2,
 Mesh:class extends Obj{constructor(g,m){super();this.geometry=g;this.material=m}},
 Line:class extends Obj{constructor(g,m){super();this.geometry=g;this.material=m}computeLineDistances(){}},
 LineSegments:class extends Obj{constructor(g,m){super();this.geometry=g;this.material=m}
   computeLineDistances(){}},
 Sprite:class extends Obj{constructor(m){super();this.material=m;this.renderOrder=0}},
 InstancedMesh:class extends Obj{constructor(g,m,c){super();this.geometry=g;this.material=m;this.count=c;
     this.instanceColor={needsUpdate:false};
     /* as r128: count x 16 floats, zero until set; get/setMatrixAt read and write them */
     this.instanceMatrix={array:new Float32Array(c*16),itemSize:16,count:c,needsUpdate:false}}
   setMatrixAt(i,m){m.toArray(this.instanceMatrix.array,i*16)} getMatrixAt(i,m){m.fromArray(this.instanceMatrix.array,i*16)}
   setColorAt(){}},
 DirectionalLight:class extends Obj{constructor(c,i){super();this.color=new Col(c);this.intensity=i;
   this.shadow={mapSize:{x:2048,y:2048,set(a,b){this.x=a;this.y=b}},camera:{left:-1,right:1,top:1,bottom:-1,near:1,far:2,updateProjectionMatrix(){}},bias:0};this.target=new Obj()}},
 HemisphereLight:class extends Obj{constructor(a,b,i){super();this.intensity=i}},
 Fog:class{constructor(c,n,f){this.color=new Col(c);this.near=n;this.far=f}},
 PlaneGeometry:class extends Geo{constructor(w,h,a,b){super(((a||1)+1)*((b||1)+1))}},
 SphereGeometry:Geo, ExtrudeGeometry:class extends Geo{translate(){return this}}, Shape:class{moveTo(){}lineTo(){}}, IcosahedronGeometry:class extends Geo{constructor(){super();this.index=null}},BoxGeometry:Geo,ConeGeometry:Geo,CylinderGeometry:Geo,CircleGeometry:Geo,RingGeometry:Geo,
 TubeGeometry:Geo,BufferGeometry:Geo,
 /* the real r128 curves (Stage 2C: the draped ribbons sample them by arc length) */
 CatmullRomCurve3:REAL.CatmullRomCurve3, LineCurve3:REAL.LineCurve3,
 /* the real r128 triangulation (Stage 2E: the paper map's village footprints and woods, traced from the land cover) */
 ShapeUtils:REAL.ShapeUtils,
 BufferAttribute:function(a,i){const t=attr(a.length/i,i);t.array=a;return t},
 Float32BufferAttribute:function(a,i){const t=attr(a.length/i,i);t.array=(a instanceof Float32Array)?a:Float32Array.from(a);return t},
 CanvasTexture:class{constructor(img){this.image=img;this.minFilter=0;this.magFilter=0;this.generateMipmaps=true;
   this.repeat={set(){}};this.needsUpdate=false}
   clone(){return new stub.CanvasTexture()} dispose(){}},
 RepeatWrapping:1000,
 /* Stage 2F: the ground shader's data textures (the cover rasters, the local relief, the field table, the viewshed) */
 DataTexture:class{constructor(d,w,h,f,t){this.image={data:d,width:w,height:h};this.format=f;this.type=t;this.needsUpdate=false} dispose(){}},
 Vector4:REAL.Vector4, NearestFilter:1003, FloatType:1015, UnsignedByteType:1009,
 MathUtils:{degToRad:d=>d*Math.PI/180},
 Clock:class{constructor(){this.t=Date.now()}getElapsedTime(){return (Date.now()-this.t)/1000}},
 PCFSoftShadowMap:1,sRGBEncoding:1,ACESFilmicToneMapping:1,FrontSide:0,BackSide:1,DoubleSide:2,RGBADepthPacking:3201,
 LinearFilter:1,ClampToEdgeWrapping:1,
};
/* T-1 (docs/FINAL_AUDIT.md; roadmap step 1, decision 131): a material's parameters are checked by three.js r128 itself. Each stub
   constructor first builds the real r128 material from the same parameters, whose constructor runs r128's Material.setValues
   (node_modules/three/src/materials/Material.js): an undefined value, the removed 'shading' and a key that is not a property of that
   material each warn, word for word as in the browser, and the warning fails the suite (tools/run-all.sh). The stub keeps the values
   the app reads back. Until step 1 this was a hand list per material, each a strict subset of r128's: it warned falsely on
   LineBasicMaterial's 'fog' (every r128 material has fog, Material.js:16) and ShaderMaterial was not checked at all. */
const matNames=["MeshBasicMaterial","MeshPhongMaterial","MeshLambertMaterial","MeshStandardMaterial",
  "SpriteMaterial","LineBasicMaterial","LineDashedMaterial","MeshDepthMaterial"];   /* MeshDepthMaterial: Stage 8, 8B's ground depth pass */
matNames.forEach(n=>{ if(typeof REAL[n]!=="function") throw new Error("three r128 has no "+n);
  stub[n]=function(o){ new REAL[n](o); o=o||{};
  Object.assign(this,o); this.userData={}; this.opacity=o.opacity!==undefined?o.opacity:1;
  this.color=new Col(o.color); this.needsUpdate=false; this.dispose=()=>{}; }; });
global.THREE=stub;

/* --- DOM --- */
const listeners={};
function mkEl(id){ return {id,style:{},dataset:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},
  innerHTML:"",textContent:"",appendChild(){},setAttribute(){},removeAttribute(){},getAttribute(){return "true"},
  addEventListener(k,f){ (listeners[id]=listeners[id]||{})[k]=f; },
  removeChild(){},parentNode:null,getContext:()=>ctx2d,width:0,height:0,children:[],
  getBoundingClientRect:()=>({width:820,height:96,left:0,top:0,right:820,bottom:96}),
  hidden:false,
  querySelectorAll:()=>[],
  querySelector:(q)=>mkEl(id+" "+q)};}   /* like document.querySelector: a stand-in element (Stage 0's #selchip fills its .sc-k/.sc-n/.sc-s) */
const ctx2d=new Proxy({},{get:(t,k)=>{
  if(k==="measureText") return ()=>({width:60});
  if(k==="createLinearGradient"||k==="createRadialGradient") return ()=>({addColorStop(){}});
  if(k==="canvas") return {width:1,height:1};
  if(k==="createImageData") return (w,h)=>({data:new Uint8ClampedArray(w*h*4),width:w,height:h});
  if(k==="getImageData") return (x,y,w,h)=>({data:new Uint8ClampedArray(w*h*4),width:w,height:h});
  if(k==="putImageData") return ()=>{};
  return ()=>{}; }, set:()=>true});
const store={};
global.Image=class{ constructor(){this.width=1024;this.height=1024;this.onload=null;this._src="";}
  set src(v){ this._src=v; const self=this; Promise.resolve().then(()=>{ if(self.onload) self.onload(); }); }
  get src(){ return this._src; } };
global.document={
  createElement:(t)=>{ const e=mkEl("new-"+t); if(t==="canvas"){e.width=1;e.height=1;e.getContext=()=>ctx2d;} return e; },
  getElementById:(id)=>(store[id]=store[id]||mkEl(id)),
  querySelectorAll:()=>[],
  querySelector:()=>mkEl('q'),
  body:{classList:{add(){},remove(){},toggle(){},contains:()=>false}},
  documentElement:{style:{setProperty(){},removeProperty(){}}},
  addEventListener(){}
};
/* Stage 0's label placement asks which interface panels cover the map (panelCovers). With no stylesheet
   loaded, an element's computed display and visibility are its inline style or the defaults. */
global.getComputedStyle=(e)=>({display:(e&&e.style&&e.style.display)||"block",
  visibility:(e&&e.style&&e.style.visibility)||"visible",getPropertyValue:(k)=>(e&&e.style&&e.style[k])||""});
global.window={innerWidth:1600,innerHeight:900,devicePixelRatio:1,getComputedStyle:global.getComputedStyle,
  addEventListener(){},matchMedia:()=>({matches:false})};
global.performance={now:()=>Date.now()};
global.requestAnimationFrame=()=>0;
global.navigator={};
global.location={search:"",hash:"",href:"about:blank"};   /* Stage 0 reads location.search (the ?harness and ?stats switches); a plain page load has neither */

const fs=require('fs');
/* roadmap step 1 (docs/FINAL_AUDIT.md T-9): bundle.js must be the build of the live sources (tools/fresh.js); a stale one stops the suite at
   once, rather than driving old code for minutes. The suite does not rebuild it: build.py also writes the committed page. */
{ const stale=require('./tools/fresh.js').bundleStale();
  if(stale){ console.warn=origWarn; console.error=origErr; console.log("errors: 1\n  E "+stale); process.exit(1); } }
try{
  eval(fs.readFileSync('bundle.js','utf8'));
}catch(e){ errs.push("THROWN: "+e.message+"\n"+(e.stack||"").split("\n").slice(1,4).join("\n")); }

/* ---- drive the whole application the way a user would ---- */
try{
  for(const m of ["terrain","staff","hybrid"]){
    setMode(m);
    for(let ph=0; ph<PHASES.length; ph++){
      setPhase(ph,false);
      for(let f=0; f<3; f++){ if(tween) tween(performance.now()+f*900); updateVisibility(); }
    }
  }
  console.log("3 modes x "+PHASES.length+" phases OK");

  /* Stage 2D: the map layer lays out in every mode and phase, with a selection too, and every item it collects is
     accounted for exactly once (placed, dropped, behind the ground, off screen or under a panel) */
  let mlPasses=0;
  for(const m of ["terrain","staff","hybrid"]){
    setMode(m);
    for(let ph=0; ph<PHASES.length; ph++){
      setPhase(ph,true); if(tween) tween(performance.now()+9000); updateVisibility(); mlLayout(); mlPasses++;
      const s=ML.stats;
      if(s.items!==s.placed+s.dropped+s.occluded+s.offscreen+s.underPanel) throw new Error("map layer: "+s.items+" items in "+m+" phase "+ph+" are not each counted once");
    }
  }
  select("f","sthilaire"); updateVisibility(); mlLayout(); select(null,null); setMode("terrain");
  console.log("map layer: "+mlPasses+" passes in 3 modes and "+PHASES.length+" phases, every item counted once OK");

  /* Stage 8, implementation PR 8C (decision 240 (a)): the stabiliser, dry run, on the app's own state. A reset gives a fresh view; the eye moved
     a little each pass under the input hold reads as moving (every item still counted once, the fades on unless reduced motion asks); the hold
     over, at rest after the motion; reduced motion keeps the hold and drops the fades; the band holds the distance within BAND while a motion
     source runs and gives the true one at rest */
  {
    const realNow=performance.now; let T=Date.now()+1e6; performance.now=()=>T;
    try{
      setMode("hybrid"); setPhase(3,true); if(tween) tween(T+9000); lastInput=-1e9; mlReset("test"); updateVisibility(); mlLayout();
      if(!MLS.fresh||MLS.moving) throw new Error("the stabiliser: the first pass after a reset is not a fresh view");
      for(const k in ML.items){ if(ML.items[k].eFrame===ML.frame&&ML.items[k].wasOn!==(ML.items[k].state==="on"&&!ML.items[k].forced)) throw new Error("the stabiliser: "+k+" kept no memory of its place"); }
      let moving=0, fades=0;
      const pass=()=>{ updateVisibility(); mlLayout(); const s=ML.stats;
        if(s.items!==s.placed+s.dropped+s.occluded+s.offscreen+s.underPanel) throw new Error("the stabiliser: the items are not each counted once while moving"); };
      for(const rm of [false,true]){ RM=rm;
        for(let f=1;f<=10;f++){ T+=33; lastInput=T; landCam.position.x+=0.4; orbitTarget.x+=0.4; landCam.updateMatrixWorld(); pass();
          if(MLS.moving){ moving++; if(MLS.fadeOn) fades++; if(MLS.fadeOn===rm) throw new Error("the stabiliser: fades "+(rm?"on under reduced motion":"off while moving")); } }
        T+=1000; pass();
        if(MLS.moving||!MLS.fromMotion||MLS.fresh) throw new Error("the stabiliser: not at rest after the motion once the hold is over"); }
      RM=false;
      if(moving<18||!fades) throw new Error("the stabiliser: "+moving+" of 20 passes read as moving, "+fades+" with fades");
      /* Stage 8, 8D prerequisite (the audit of 8C): an item held hidden or still fading in while the view moves, given a priority the stabiliser
         never holds (the selection; the keyboard's focus, document.activeElement), takes its state at once: drawn, its alpha 1 in that pass */
      { let prot=0; const idle=()=>{ for(const k in ML.items){ const it=ML.items[k]; if(it.eFrame===ML.frame&&it.fid&&FORMATIONS[it.fid]&&!it.keep&&(it.held||(it.state==="on"&&it.fa<1))) return it; } return null; };
        for(const how of ["selection","focus"]){
          let it=null; for(let f=1;f<=12&&!it;f++){ T+=33; lastInput=T; landCam.position.x+=0.4; orbitTarget.x+=0.4; landCam.updateMatrixWorld(); pass(); if(MLS.fadeOn) it=idle(); }
          if(!it) throw new Error("the stabiliser: no item held or fading in while moving, for the "+how+" check");
          const fa0=+it.fa.toFixed(2);
          if(how==="selection") select("f",it.fid); else document.activeElement=it.el;
          T+=33; lastInput=T; landCam.position.x+=0.4; orbitTarget.x+=0.4; landCam.updateMatrixWorld(); pass();
          if(!MLS.fadeOn) throw new Error("the stabiliser: fades off in the "+how+" check's pass");
          if(it.eFrame===ML.frame&&it.state==="on"){ prot++; if(it.fa!==1||it.el.style.opacity!=="") throw new Error("the stabiliser: "+it.key+" given the "+how+" is drawn at alpha "+it.fa+" (from "+fa0+"), not at once"); }
          select(null,null); delete document.activeElement; }
        if(!prot) throw new Error("the stabiliser: no item given a priority was drawn in its pass, so its opacity was not checked");
        T+=1000; pass(); }
      lastInput=T; const b=[mlBand(200),mlBand(214),mlBand(217)]; lastInput=-1e9; b.push(mlBand(214));
      if(b.join(",")!=="200,200,217,214") throw new Error("the band: "+b.join(",")+" (want 200,200,217,214)");
      mlReset("test"); pass(); if(!MLS.fresh) throw new Error("the stabiliser: a reset does not give a fresh view");
    } finally { performance.now=realNow; lastInput=-1e9; RM=false; mlReset("test"); }
    setMode("terrain");
    console.log("map layer in motion (decision 240 (a)): fresh after a reset, moving under the input hold (fades off under reduced motion), at rest after it, the band 8% OK");
  }

  /* continuous playback: step the clock the way the render loop does */
  setMode("terrain"); setClock(T_MIN,{force:true});
  let frames=0;
  for(let t=T_MIN;t<=T_MAX;t+=3){ setClock(t); updateVisibility(); frames++; }
  console.log("clock swept "+fmtClock(T_MIN)+"->"+fmtClock(T_MAX)+" in "+frames+" steps OK");

  /* every analysis chapter */
  ANALYSIS.forEach(c=>{ setChapter(c.id); updateVisibility(); });
  setChapter(null);
  console.log(ANALYSIS.length+" analysis chapters OK");

  /* both command views across every phase */
  for(const cv of ["fr","al","none"]){
    setCommandView(cv);
    for(let ph=0;ph<PHASES.length;ph++){ setPhase(ph,true); updateVisibility(); }
  }
  console.log("command views OK");

  /* dossiers for every formation and every feature */
  let nf=0;
  Object.keys(FORMATIONS).forEach(id=>{ select("f",id); paintDrawer(); nf++; });
  FEATURES.forEach(f=>{ select("t",f.id); paintDrawer(); });
  TERRAIN_LINES.forEach(t=>{ select("a",t.n); paintDrawer(); });
  select(null,null);
  console.log("dossiers: "+nf+" formations, "+FEATURES.length+" features, "+TERRAIN_LINES.length+" terrain lines OK");

  /* abuse: rapid switching, jumping, toggling. T-6 (roadmap step 1): after each round the state is the last calls' (the mode, the
     selection, the chapter, the clock and its phase), and play is off after stopPlay; until step 1 nothing here was asserted and its
     "OK" was printed after an unrelated toggle */
  for(let i=0;i<40;i++){
    const ph=i%PHASES.length, m=["terrain","staff","hybrid"][i%3], sk=i%2?"f":"t", sid=i%2?"sthilaire":"pratzen",
          ch=i%3===0?ANALYSIS[i%ANALYSIS.length].id:null, t=T_MIN+(i*37)%(T_MAX-T_MIN);
    setPhase(ph,true);
    setMode(m);
    select(sk,sid);
    setChapter(ch);
    setClock(t);
    togglePlay();
    updateVisibility();
    if(mode!==m||!selection||selection.kind!==sk||selection.id!==sid||chapter!==ch||clock!==t||curPhase!==phaseAt(clock))
      throw new Error("rapid switching, round "+(i+1)+": the state is not the last calls' (want "+JSON.stringify({m,sel:sk+":"+sid,ch,t})+
        ", got "+JSON.stringify({mode,sel:selection?selection.kind+":"+selection.id:null,chapter,clock,curPhase,phaseAt:phaseAt(clock)})+")");
  }
  stopPlay();
  if(playing) throw new Error("rapid switching: still playing after stopPlay");
  console.log("40 rounds of rapid switching: after each the mode, the selection, the chapter, the clock and its phase the last calls'; play off after stopPlay OK");
  setChapter(null); select(null,null); setCommandView("none");
  setPresentation('map'); updateVisibility(); setPresentation('study');
  setSpeed(4); setSpeed(1);
  openSources();
  /* the new visibility levels and the plan overlay */
  ["study","watch","map","study","map","watch"].forEach(v=>{ setPresentation(v); updateVisibility(); });
  setDispatchVisible(false); updateVisibility(); setDispatchVisible(true);
  setPresentation("watch"); updateVisibility(); setPresentation("study");
  setPresentation("map"); updateVisibility(); showEverything();
  ["al","fr","both","both"].forEach(p=>{ setPlan(p); updateVisibility(); });
  setPlan(planSide);
  for(let i=0;i<12;i++){ setPlan(["al","fr","both"][i%3]); setMode(["terrain","staff","hybrid"][i%3]); updateVisibility(); }
  setPlan(planSide);
  console.log("visibility levels and plan overlay OK");

  /* the event layer, the situation strip and the derived readings */
  setPresentation("study"); setMode("terrain");
  EVENTS.forEach(e=>{ select("e",e.id); paintDrawer(); updateVisibility(); });
  select(null,null);
  /* T-6 (roadmap step 1): what the situation paints is read back at every sampled minute (until step 1 it was counted, never read):
     the caption names the act and the phase; where an event is live it names it (or, in a dwell, the dwell's events) and the Now
     tab's strip gives its reason; where none is, the strip gives the act's line */
  let evSeen=0, sitSeen=0, capOk=0, named=0, whyOk=0, lineOk=0;
  /* roadmap step 2 (H-15; decision 125 (a)): an event is named with its note, written here from its claim and window (its hour disputed;
     else an interval; and a reconstruction), not read from evNote or evTag: in the Now tab's strip after its name, in the one-line caption
     as a tag before it */
  const partsRT=(e,L)=>{ const w=evWindow(e), n=[]; if(e.claim==="disputed") n.push(L.disputed); else if(w[1]>w[0]) n.push(L.interval);
    if(e.claim==="recon") n.push(L.recon); return n; };
  const noteRT=e=>{ const n=partsRT(e,LABELS.event); return n.length?" ("+n.join("; ")+")":""; };
  const tagRT=e=>partsRT(e,LABELS.event.tag).join("; ");
  /* roadmap step 3 (decision 159): the tag and the name each a box, the name in .evt */
  const capRT=e=>(tagRT(e)?'<small class="evn">'+esc(tagRT(e))+'</small>':'')+'<span class="evt">'+esc(e.n)+'</span>';
  for(let t=T_MIN;t<=T_MAX;t+=7){
    setClock(t); updateVisibility();
    _sitKey=""; paintSituation(); sitSeen++;
    const cap=document.getElementById("tb-cap").innerHTML, host=document.getElementById("situation").innerHTML;
    const act=actOf(curPhase), live=liveEvents(clock), top=live.length?live[0].e:null, dw=dwellEvents();
    if(cap.indexOf(esc(act.n.toUpperCase()))>=0&&cap.indexOf(esc(PHASES[curPhase].title))>=0) capOk++;
    if(top){ evSeen++;
      if(dw&&dw.length?dw.every(e=>cap.indexOf(capRT(e))>=0):cap.indexOf(capRT(top))>=0) named++;
      if(host.indexOf(esc(top.n+noteRT(top)))>=0&&host.indexOf(esc(top.why))>=0) whyOk++; }
    else if(host.indexOf(esc(act.line))>=0) lineOk++;
  }
  if(capOk!==sitSeen||!evSeen||evSeen===sitSeen||named!==evSeen||whyOk!==evSeen||lineOk!==sitSeen-evSeen)
    throw new Error("situation: of "+sitSeen+" minutes the caption names the act and phase at "+capOk+"; of "+evSeen+" with a live event it names it at "+
      named+", the strip its reason at "+whyOk+"; of "+(sitSeen-evSeen)+" without, the strip the act's line at "+lineOk);
  console.log("event layer + situation strip over "+sitSeen+" sampled minutes: the act and phase named at each; at the "+evSeen+
    " with a live event the event named and its reason given, at the "+(sitSeen-evSeen)+" without the act's line OK");

  /* plan links must track the clock without leaking geometry */
  ["al","fr","both"].forEach(p=>{
    setPlan(p);
    for(let t=T_MIN;t<=T_MAX;t+=60){ setClock(t); updateVisibility(); }
  });
  setPlan(planSide);
  console.log("plan divergence links OK");

  /* derived readings must be finite at every hour */
  for(let t=T_MIN;t<=T_MAX;t+=15){
    setClock(t);
    const a=plateauStrength("al"), f=plateauStrength("fr");
    if(!isFinite(a)||!isFinite(f)||a<0||f<0) throw new Error("bad plateau reading at "+fmtClock(t));
    centreSeparation();
  }
  console.log("derived readings finite across the battle OK");

  /* guided tour: every stop, forwards and back, then out */
  startTour();
  for(let i=0;i<TOUR.length;i++){ tourGo(1); updateVisibility(); }
  startTour();
  for(let i=0;i<TOUR.length+2;i++){ tourGo(-1); updateVisibility(); }
  exitTour();
  if(tourStep!==-1) throw new Error("tour did not exit");
  console.log(TOUR.length+" tour stops forward and back OK");

  /* Stage 7B (docs/STAGE7_SPEC.md section 6; decisions 111, 113): the first-run card opened and closed by each way out; the primary action
     begins the opening (Stage 7C); "explore" (the stay button, Esc, a key) and a press outside (null) leave the camera and the clock where they stand */
  { const fr=document.getElementById("firstrun");
    setClock(T_MIN,{force:true});
    ["open","explore",null].forEach(how=>{ fr.hidden=false; openFirstRun(); if(!firstRunOpen) throw new Error("the first-run card did not open");
      const p0=landCam.position.clone(), c0=clock; closeFirst(how);
      if(firstRunOpen||!fr.hidden) throw new Error("the first-run card did not close ("+how+")");
      if(how==="open"){ if(!OPENING.on||tourStep!==OPENING.stops[0]) throw new Error("the first-run card's primary action did not begin the opening"); openingEnd("skip"); }
      else if(landCam.position.distanceTo(p0)>1e-9||clock!==c0) throw new Error("closing the first-run card ("+how+") moved the camera or the clock"); });
    console.log("first run: opened and closed by each way out (the opening, in place, a press outside) OK"); }

  /* Stage 7C (docs/STAGE7_SPEC.md section 6, 7C; decisions 114, 118): the opening forward, back and skipped from every step, and ended in place
     by each other way; each step at its tour stop's clock; every end leaves tourStep at -1; the end state at the day's start in Study; then the
     tour runs as before */
  { const N=OPENING.stops.length, ways=["end","skip","key","pointer","camera"];
    if(N!==4||OPENING.stops.join(",")!=="0,5,6,7") throw new Error("the opening's stops are "+OPENING.stops.join(",")+", not the tour's 1, 6, 7, 8 (decision 114)");
    /* Stage 7D (decision 123): Next on a step plays the clock to the next one; run here by the app's own tick to its arrival */
    let ticks=0;
    const run=(n)=>{ let g=0; while(OPENING.play&&g++<(n||200000)){ tickClock(100); followStep(100); openingPlayWatch(); ticks++; } };
    const fwd=()=>{ openingGo(1); if(OPENING.play){ if(!playing||speed!==OPENING.SPEED) throw new Error("opening: Next did not play the clock at "+OPENING.SPEED+"x"); run(); } };
    setSpeed(0.5);
    openingStart(); for(let k=1;k<N;k++){ fwd(); updateVisibility(); if(OPENING.k!==k||clock!==stopClock(TOUR[OPENING.stops[k]])||speed!==0.5||playing) throw new Error("opening step "+(k+1)+" is not its tour stop, or the speed not put back"); }
    for(let k=N-2;k>=0;k--){ openingGo(-1); if(OPENING.k!==k) throw new Error("opening: back to step "+(k+1)+" failed"); }
    openingGo(-1); if(OPENING.k!==0) throw new Error("opening: back from the first step moved it");
    for(let k=0;k<N;k++) fwd();
    if(OPENING.on||tourStep!==-1||clock!==T_MIN||presentation!=="study"||freeCam) throw new Error("opening: Finish did not land on the end state");
    for(let k=0;k<N;k++) ways.forEach(how=>{ openingStart(); for(let i=0;i<k;i++) fwd(); const c0=clock; openingEnd(how); updateVisibility();
      if(OPENING.on||tourStep!==-1) throw new Error("opening: "+how+" at step "+(k+1)+" left it on");
      if((how==="end"||how==="skip")?(clock!==T_MIN||freeCam):clock!==c0) throw new Error("opening: "+how+" at step "+(k+1)+" left the clock at "+clock); });
    /* each way while the clock plays between steps: the clock stopped, the visitor's speed back; in place where it stood */
    for(let k=0;k<N-1;k++) ways.forEach(how=>{ openingStart(); for(let i=0;i<k;i++) fwd(); openingGo(1); run(20); const c0=clock; openingEnd(how); updateVisibility();
      if(OPENING.on||OPENING.play||playing||speed!==0.5) throw new Error("opening: "+how+" while playing to step "+(k+2)+" left it on, playing or at speed "+speed);
      if((how==="end"||how==="skip")?(clock!==T_MIN||freeCam):clock!==c0) throw new Error("opening: "+how+" while playing to step "+(k+2)+" left the clock at "+clock); });
    /* Next while it plays goes straight there; Back returns to the stop it started from; reduced motion keeps 7C's cuts */
    openingStart(); openingGo(1); run(20); openingGo(1); if(OPENING.play||OPENING.k!==1||clock!==stopClock(TOUR[OPENING.stops[1]])) throw new Error("opening: Next while playing did not go straight to step 2");
    openingGo(1); run(20); openingGo(-1); if(OPENING.play||OPENING.k!==1||clock!==stopClock(TOUR[OPENING.stops[1]])) throw new Error("opening: Back while playing did not return to step 2");
    const rm=RM; RM=true; openingGo(1); if(OPENING.play||OPENING.k!==2) throw new Error("opening: under reduced motion Next did not cut to step 3"); RM=rm;
    openingEnd("skip");
    startTour(); for(let i=0;i<TOUR.length;i++) tourGo(1); if(tourStep!==-1) throw new Error("the tour after the opening did not finish");
    console.log("opening: "+N+" steps forward (the clock played between them, "+ticks+" ticks), back, finished, and ended by "+ways.length+" ways from every step and while playing; Next and Back while playing; reduced motion's cuts; the tour after it OK"); }

  /* jumping between events must reach both ends and never stall */
  setClock(T_MIN,{force:true});
  let hops=0, last=-1;
  for(let i=0;i<60;i++){ jumpEvent(1); if(clock===last) break; last=clock; hops++; }
  /* Stage 5C (decision 89): an event's clock is its start, and events can share one (as the dwell counts them): the forward jumps
     stop at every distinct start after the day's first minute, then at the day's end, each once */
  const stops=new Set(EVENTS.map(evClock).filter(t=>t>T_MIN+1.5)).size+1;
  if(hops!==stops) throw new Error("forward event jump: "+hops+" hops, want "+stops+" (every distinct start, then the end)");
  for(let i=0;i<60;i++){ jumpEvent(-1); if(clock<=T_MIN+1) break; }
  if(clock>T_MIN+1) throw new Error("backward event jump did not reach the start");
  console.log("event jumping reached both ends in "+hops+" hops OK");

  /* two-stage disclosure on the formation card */
  select("f","sthilaire"); paintDrawer();
  if(dossierExpanded) throw new Error("card opened expanded");
  dossierExpanded=true; paintDrawer();
  select("f","vandamme"); paintDrawer();
  if(dossierExpanded) throw new Error("expansion leaked to the next formation");
  select(null,null);
  console.log("compact card then full dossier OK");

  /* the acts row must cover every phase */
  buildActs();
  for(let ph=0;ph<PHASES.length;ph++){ setPhase(ph,true); paintActs(); if(!actOf(ph)) throw new Error("phase "+ph+" has no act"); }
  console.log("acts row covers all "+PHASES.length+" phases OK");

  /* selection ring follows the selected formation and nothing else */
  setPresentation("study"); setMode("terrain");
  select("f","sthilaire"); updateVisibility();
  if(!selRing.visible) throw new Error("no ring on the selected formation");
  setMode("staff"); updateVisibility();
  if(selRing.visible) throw new Error("ring should not show on the staff map");
  setMode("terrain"); select(null,null); updateVisibility();
  if(selRing.visible) throw new Error("ring outlived the selection");
  console.log("selection ring OK");

  /* event jumping must not drag the camera when the moment is already in view, and centres it when it is not (goToEventAt).
     T-6 (roadmap step 1): until step 1 the camera's position was kept and never compared, and all three jumps here centred, so the
     in-view case never arose. Now, at every distinct event start after the day's first minute, from the start before it, the landscape
     camera is framed as centreOnMap frames (its offset and distance 86) on the event the jump will reach, then on a point far from it:
     framed on it, the jump reaches its start without a centring and Follow stays on; framed away, it centres once and Follow is off. A
     centring is a glide, so the camera's position cannot tell the cases apart synchronously: the evidence is the centreOnMap calls
     and freeCam. */
  { const realC=centreOnMap; let calls=0; centreOnMap=function(p,r){ calls++; return realC(p,r); };
    const finish=()=>{ let g=0; while(tween&&g<4){ tween(performance.now()+1e7); g++; } };   /* as the self-test's finishTween */
    const S=[...new Set(eventTimes().filter(t=>t>T_MIN+1.5))], bad=[]; let inOk=0, offOk=0;
    const aim=(p,away)=>{ const w=W(p[0],p[1]); orbitTarget.set(w[0],displayHeight(w[0],w[1]),w[1]);
      if(away){ orbitTarget.x=-orbitTarget.x+(orbitTarget.x>0?-120:120); orbitTarget.z=-orbitTarget.z; }
      camera.position.copy(orbitTarget).add(new THREE.Vector3(-0.55,0.62,0.56).normalize().multiplyScalar(86));
      camera.lookAt(orbitTarget); camera.updateMatrixWorld(true); };
    try{
      setMode("terrain");
      S.forEach((s,k)=>{ const L=liveEvents(s); if(!L.length){ bad.push(fmtClock(s)+": no live event at its own start"); return; } const e=L[0].e;
        [false,true].forEach(away=>{ const how=e.id+" at "+fmtClock(s)+(away?" framed away":" framed on it");
          setClock(k?S[k-1]:T_MIN,{instant:true,force:true,camera:false}); finish(); freeCam=false; aim(e.p,away);
          if(onScreen(e.p)===away){ bad.push(how+": the set-up did not frame it "+(away?"out of":"in")+" view"); return; }
          const p0=camera.position.clone(), q0=orbitTarget.clone(), c0=calls; jumpEvent(1); const n=calls-c0;
          if(clock!==s) bad.push(how+": the jump reached "+fmtClock(clock));
          else if(!away&&(n||freeCam||camera.position.distanceTo(p0)>1e-9||orbitTarget.distanceTo(q0)>1e-9)) bad.push(how+": "+n+" centrings, Follow "+(freeCam?"off":"on"));
          else if(away&&(n!==1||!freeCam)) bad.push(how+": "+n+" centrings, Follow "+(freeCam?"off":"on"));
          else if(away) offOk++; else inOk++; }); });
    } finally { centreOnMap=realC; }
    if(!S.length||bad.length||inOk!==S.length||offOk!==S.length) throw new Error("event jump camera: "+inOk+" and "+offOk+" of "+S.length+" starts; "+bad.slice(0,4).join("; "));
    /* then as before step 1: from the day's start, two jumps forward and one back, the camera finite */
    setClock(T_MIN,{force:true});
    freeCam=false;
    jumpEvent(1); jumpEvent(1); jumpEvent(-1);
    if(!isFinite(camera.position.x)) throw new Error("camera left the world");
    console.log("event jump camera: at each of "+S.length+" event starts, framed on its event no centring and Follow kept, framed away one centring and Follow off OK"); }

  /* plan links thin out at distance and fill in on approach. T-6 (roadmap step 1): the links drawn are counted (until step 1 the pairs
     were, a constant): far (from 190 units, updatePlanLinks) the leading formation of each column on the field, near every one on it */
  setPlan("al");
  if(!planLinks) throw new Error("plan links never built");
  { const drawnLinks=()=>{ const a=planLinks.geometry.attributes.position.array; let n=0;
      for(let k=0;k<a.length;k+=6) if(a[k]||a[k+1]||a[k+2]||a[k+3]||a[k+4]||a[k+5]) n++; return n; };
    const P=planLinks.userData.pairs, lead=P.filter(q=>q[2]&&posNow(q[0])).length, all=P.filter(q=>posNow(q[0])).length;
    orbitTarget.set(0,0,14); camera.position.set(-196,132,226);
    updateVisibility();
    const farD=viewDist(), far=drawnLinks();
    camera.position.set(-60,40,60); updateVisibility();
    const nearD=viewDist(), near=drawnLinks();
    setPlan(planSide);
    if(selection||!(farD>=190)||!(nearD<190)||far!==lead||near!==all||!(all>lead))
      throw new Error("plan link density: far ("+farD.toFixed(1)+" units) "+far+" drawn, want the "+lead+" leading; near ("+nearD.toFixed(1)+") "+near+", want all "+all+
        (selection?"; a selection is set":""));
    console.log("plan link density: far ("+farD.toFixed(0)+" units) "+far+" links, the leading formations on the field; near ("+nearD.toFixed(0)+") all "+near+" OK"); }

  /* the derived readings must use the measured wording. T-6 (roadmap step 1): read back at seven clocks (until step 1 painted at one,
     never read): the plateau reading ("derived", its figure, its note) in the Now tab's strip and the caption exactly where the Allied
     hold the heights up to phase 6; the centre separation ("derived", its note) exactly where it is detected; each seen shown and not */
  if(typeof centreSeparation!=="function") throw new Error("centreSeparation missing");
  { const seen={heights:0,noHeights:0,cut:0,noCut:0}, bad=[];
    [T_MIN,525,600,660,700,764,800].forEach(t=>{ setClock(t); _sitKey=""; paintSituation();
      const host=document.getElementById("situation").innerHTML, cap=document.getElementById("tb-cap").innerHTML;
      const onH=plateauStrength("al"), want=curPhase<=6&&onH>0, cut=!!centreSeparation();
      const tag='<small>derived</small> on the heights: Allied &asymp; '+onH.toLocaleString("en-GB"), cutTag='<small>derived</small> centre separation detected';
      if((host.indexOf(tag)>=0&&host.indexOf(esc(FLAT_NOTE))>=0)!==want||(cap.indexOf(tag)>=0)!==want) bad.push(fmtClock(t)+": the plateau reading "+(want?"not shown":"shown"));
      if((host.indexOf(cutTag)>=0&&host.indexOf(esc(SEP_NOTE))>=0)!==cut||(cap.indexOf(cutTag)>=0)!==cut) bad.push(fmtClock(t)+": the separation "+(cut?"not shown":"shown"));
      seen[want?"heights":"noHeights"]++; seen[cut?"cut":"noCut"]++; });
    if(bad.length||!seen.heights||!seen.noHeights||!seen.cut||!seen.noCut) throw new Error("derived reading wording: "+bad.join("; ")+" (seen "+JSON.stringify(seen)+")");
    console.log("derived reading wording: the plateau reading shown at "+seen.heights+" of 7 clocks and not at "+seen.noHeights+
      ", the centre separation at "+seen.cut+" and not at "+seen.noCut+", each with \"derived\" and its note OK"); }

  /* roadmap step 2 (decision 125 (a); docs/FINAL_AUDIT.md H-1): an arrow the data marks unsettled carries its mark on its label in its phase,
     and no other arrow does; the sources sheet's arrow note names the mark. A disputed event's dossier carries the mark after its clock and
     its dispute in a section of its own, and the interval sentence ("Shown as an interval rather than a timestamp", since roadmap step 4; "not fixed
     in the sources" until then) is not added under a dispute; every other
     interval event keeps it. Each count must be above zero (the check reads something) */
  { const MARK=" ("+LABELS.arrow.unsettled+")"; let nA=0, nPh=0;
    Object.keys(OVERLAYS).forEach(ph=>{ const uns=(OVERLAYS[ph].arrows||[]).filter(a=>/^unsettled:/.test(a.interp||""));
      rebuildOverlays(+ph,true); nPh++;
      uns.forEach(a=>{ nA++; if(!ovText.some(q=>q.text===a.label+MARK)) throw new Error("unsettled arrow \""+a.label+"\": its label lacks its mark"); });
      const marked=ovText.filter(q=>q.text.endsWith(MARK)).length;
      if(marked!==uns.length) throw new Error("phase "+ph+": "+marked+" map labels carry the mark"+MARK+", but "+uns.length+" arrows are unsettled"); });
    rebuildOverlays(curPhase,true);
    if(arrowNotes()[2].indexOf("each label carries the mark"+MARK+":")<0) throw new Error("the sources sheet's arrow note does not name the mark"+MARK);
    const mk=document.createElement; let made=[], nD=0, nDI=0, nI=0;
    try{
      document.createElement=t=>{ const x=mk(t); made.push(x); return x; };
      EVENTS.forEach(e=>{ made=[]; dossierEvent(e.id);
        const h=made.map(x=>x.innerHTML).join("\n"), w=evWindow(e), iv=w[0]!==w[1], dis=e.claim==="disputed";
        const cm=h.match(/<p class="dh-cmd">([^<]*)<\/p>/), clk=cm?cm[1]:"";
        const sect='<h3>When it happened: disputed</h3><p class="ev-why">'+esc(e.dispute)+claimTag("EVENTS[#"+e.id+"].dispute")+'</p>',   /* decision 203: with its claim tag */ sent=h.indexOf("Shown as an interval rather than a timestamp")>=0;
        if(!cm) throw new Error("event "+e.id+": its dossier has no clock line");
        if(clk.endsWith(esc(" ("+LABELS.event.disputed+")"))!==dis) throw new Error("event "+e.id+": the clock line \""+clk+"\" "+(dis?"lacks":"carries")+" the disputed mark");
        if((h.indexOf(sect)>=0)!==!!e.dispute) throw new Error("event "+e.id+": its dispute section "+(e.dispute?"missing":"shown without a dispute"));
        if(sent!==(iv&&!e.dispute)) throw new Error("event "+e.id+": the interval sentence "+(sent?"shown":"missing")+(e.dispute?" under a dispute":""));
        if(dis){ nD++; if(iv) nDI++; } else if(iv) nI++; });
    } finally { document.createElement=mk; }
    if(!nA||!nD||!nDI||!nI) throw new Error("the disputed hours: "+nA+" unsettled arrows, "+nD+" disputed events ("+nDI+" intervals), "+nI+" other intervals (the check reads nothing)");
    console.log("the disputed hours: "+nA+" unsettled arrows carry their mark, no other arrow in "+nPh+" phases; "+nD+" events graded disputed show it after "+
      "their clock with their dispute, the interval sentence on none of them ("+nDI+" an interval) and on the "+nI+" other intervals OK"); }

  /* owner decision 126 (docs/FINAL_AUDIT.md H-3): the plateau's map label is a derived reading marked so, in its words and its name, drawn
     in the phases the tagged reading is (0-6) and in none after, its Allied figure the reading's. Read back at the seven clocks above, the
     outline eased to rest first (it fades). The phase rule is written here, not read from PLATEAU_LAST */
  { const seen={on:0,off:0}, bad=[];
    setPresentation("study"); setMode("terrain");
    [T_MIN,525,600,660,700,764,800].forEach(t=>{ setClock(t); for(let i=0;i<200;i++) updateEventLayer(); updateVisibility(); mlLayout();
      const it=ML.items["p:plateau"], drawn=!!it&&it.frame===ML.frame, want=curPhase<=6;
      if(drawn!==want) bad.push(fmtClock(t)+": the label "+(want?"not drawn":"drawn")+" in phase "+curPhase);
      if(drawn){ if(!/derived/.test(it.el.innerHTML)) bad.push(fmtClock(t)+': its words without "derived"');
        if(!/derived/.test(it.aria||"")) bad.push(fmtClock(t)+': its name without "derived"');
        if(it.el.innerHTML.indexOf(plateauStrength("al").toLocaleString("en-GB"))<0) bad.push(fmtClock(t)+": its figure is not the reading"); }
      seen[want?"on":"off"]++; });
    if(bad.length||!seen.on||!seen.off) throw new Error("plateau label: "+bad.join("; ")+" (seen "+JSON.stringify(seen)+")");
    console.log("plateau label: drawn and marked derived, words and name, at "+seen.on+" of 7 clocks (phases 0-6); not drawn at "+seen.off+" OK"); }

  /* owner decision 128 (a) (docs/FINAL_AUDIT.md H-5; the implementation plan's completeness critic, item 5): a formation's claim pill is its
     position's, in the compact card and the full dossier: each reads POS_CLAIM for the claim claimOf gives at that clock (the class kept), and
     none carries CLAIM's own words ("Fact", "Estimate", "Reconstruction"), so a return to the blanket pill fails. Every formation at five
     clocks; each count above zero */
  /* roadmap step 4 (decision 128 (b); docs/FINAL_AUDIT.md H-5; the C7 design skeptic's I5): the key each pill should carry is computed here,
     not through the app's posClaimOf: a track entry's own claim up to the phase, else the position's grade's key (CLAIM_FROM_CONF), and
     "interp" where that key is "fact" and the position is interpolated (confAt for a formation with a track, any of its leaves' for an
     aggregate). Until step 4 the want was claimOf's (the grade's "fact" on an interpolated position read "Position: documented") */
  const interpNow=id=>{ const f=FORMATIONS[id]; if(f.track){ const c=confAt(id,clock); return !!(c&&c.interp); }
    return leavesOf(id,[]).some(k=>{ const c=confAt(k,clock); return !!(c&&c.interp); }); };
  const expKey=id=>{ const f=FORMATIONS[id]; let ex=null; if(f.track) for(let i=0;i<=curPhase;i++){ const e=f.track[i]; if(e&&e.claim) ex=e.claim; }
    if(ex) return ex; const k=CLAIM_FROM_CONF[aggConf(id,curPhase)]||"est"; return k==="fact"&&interpNow(id)?"interp":k; };
  { const mk=document.createElement, CL=Object.keys(CLAIM).map(k=>CLAIM[k].label), byCl={}; let made=[], nP=0, nV=0;
    try{
      document.createElement=t=>{ const x=mk(t); made.push(x); return x; };
      [T_MIN,525,600,700,880].forEach(t=>{ setClock(t);
        Object.keys(FORMATIONS).forEach(id=>{ const want=expKey(id);
          [["card",compactCard],["dossier",dossierFormation]].forEach(([w,fn])=>{ made=[]; fn(id); nV++;
            const h=made.map(x=>x.innerHTML||"").join("\n"), P=[...h.matchAll(/<span class="pill claim-(\w+)">([\s\S]*?)<\/span>/g)];
            if(P.length!==1) throw new Error(id+" ("+w+") at "+fmtClock(t)+": "+P.length+" claim pills, want one");
            const cl=P[0][1], txt=P[0][2].replace(/<svg[\s\S]*?<\/svg>/g,"");
            if(cl!==want) throw new Error(id+" ("+w+") at "+fmtClock(t)+": the pill's class "+cl+", its key is "+want);
            if(txt!==esc(POS_CLAIM[cl]||"")) throw new Error(id+" ("+w+") at "+fmtClock(t)+": the pill reads \""+txt+"\", want POS_CLAIM's \""+POS_CLAIM[cl]+"\"");
            if(CL.indexOf(txt)>=0) throw new Error(id+" ("+w+") at "+fmtClock(t)+": the pill carries CLAIM's words \""+txt+"\"");
            nP++; byCl[cl]=(byCl[cl]||0)+1; }); }); });
    } finally { document.createElement=mk; }
    if(!nP||["fact","est","recon","interp"].some(k=>!byCl[k])) throw new Error("position pills: "+nP+" pills read in "+nV+" views, classes "+JSON.stringify(byCl)+" (want all four: fact, est, recon, interp)");
    /* over the day's 85 ten-minute clocks: the app's key (posClaimOf) is the one computed here for every formation on the field, and the
       leaves' interpolated "documented" positions are counted (H-5 counted 825 such leaf samples on the step-3 data) */
    let nI=0, nS=0, nO=0;
    for(let t=T_MIN;t<=T_MAX;t+=10){ setClock(t);
      Object.keys(FORMATIONS).forEach(id=>{ if(!posNow(id)) return; nO++; const w=expKey(id), g=posClaimOf(id,aggConf(id,curPhase));
        if(g!==w) throw new Error(id+" at "+fmtClock(t)+": posClaimOf gives "+g+", the pill's key is "+w);
        if(FORMATIONS[id].track){ nS++; if(w==="interp") nI++; } }); }
    if(!nI) throw new Error("position pills: no interpolated documented position in the day");
    /* the review of b2fc7b5: an explicit track claim wins over "interp" (no datum has both, so a temporary claim on an interpolated
       documented leaf), and under "Position: interpolated" the dossier's paragraph does not say "documented in the sources" while a
       grade-A position that is not interpolated does; an explicit claim other than its grade's brings CLAIM's own note (heightguns@8's "recon"
       until roadmap step 4; no track claim in the data differs from its grade since, so the data no longer exercise that path) */
    { let probe=null;
      for(let t=T_MIN;t<=T_MAX&&!probe;t+=10){ setClock(t); probe=Object.keys(FORMATIONS).find(id=>FORMATIONS[id].track&&posNow(id)&&expKey(id)==="interp")||null; }
      if(!probe) throw new Error("position pills: no interpolated documented leaf to probe");
      const tr=FORMATIONS[probe].track, k0=Object.keys(tr).map(Number).filter(k=>k<=curPhase).sort((a,b)=>b-a)[0], keep=tr[k0].claim;
      const conf=id=>{ made=[]; dossierFormation(id); return made.map(x=>x.className==="conf"?x.textContent||x.innerHTML||"":"").join(""); };
      try{ document.createElement=t=>{ const x=mk(t); made.push(x); return x; };
        const para=conf(probe);
        if(para.indexOf(CONF_TEXT.A)>=0) throw new Error(probe+" at "+fmtClock(clock)+": the dossier says \""+CONF_TEXT.A+"\" under \"Position: interpolated\"");
        if(para.indexOf(CONF_INTERP)<0) throw new Error(probe+" at "+fmtClock(clock)+": the dossier's paragraph lacks CONF_INTERP");
        tr[k0].claim="recon";
        if(posClaimOf(probe,aggConf(probe,curPhase))!=="recon") throw new Error(probe+": an explicit claim does not win over \"interp\"");
        /* roadmap step 4 (the review of 69031df): no track claim in the data differs from its grade since heightguns@8 became "est", so the
           probe's temporary claim holds the dossier's rule that an explicit claim other than its grade's brings CLAIM's own note */
        if(conf(probe).indexOf(CLAIM.recon.note)<0) throw new Error(probe+": an explicit claim other than its grade's does not bring CLAIM's own note");
        tr[k0].claim=CLAIM_FROM_CONF[aggConf(probe,curPhase)];   /* the review of e7f0df1: and one equal to its grade's brings none */
        if(conf(probe).indexOf(CLAIM[tr[k0].claim].note)>=0) throw new Error(probe+": an explicit claim equal to its grade's brings CLAIM's own note");
      } finally { if(keep===undefined) delete tr[k0].claim; else tr[k0].claim=keep; document.createElement=mk; }
      setClock(T_MIN); const a0=Object.keys(FORMATIONS).find(id=>FORMATIONS[id].track&&posNow(id)&&expKey(id)==="fact");
      if(!a0) throw new Error("position pills: no documented, not interpolated leaf at "+fmtClock(T_MIN));
      try{ document.createElement=t=>{ const x=mk(t); made.push(x); return x; };
        if(conf(a0).indexOf(CONF_TEXT.A)<0) throw new Error(a0+": a documented position's dossier lacks CONF_TEXT.A"); }
      finally { document.createElement=mk; }
      console.log("position pills: an explicit claim wins over \"interp\" ("+probe+"); the dossier under \"Position: interpolated\" says CONF_INTERP, not \"documented in the sources\" OK"); }
    console.log("position pills: "+nP+" claim pills in "+nV+" cards and dossiers at five clocks, each POS_CLAIM's words for its key ("+
      Object.keys(byCl).map(k=>k+" "+byCl[k]).join(", ")+"), none CLAIM's; over 85 clocks posClaimOf agrees for "+nO+" formation-samples, "+
      nI+" of "+nS+" leaf samples interpolated between documented anchors (\"Position: interpolated\") OK"); }

  /* decision 187 (roadmap step 4b part B): the claims on screen. In every formation's dossier at five clocks each claim tag names a live
     narrative statement (tools/step4/statements.js), its claim the statement's own (STATEMENT_CLAIMS), else its class's (CLAIM_BY_CLASS),
     else "unchecked", in CLAIM_WORDS's word; the commander, the composition, the figures' note, the role, the note, the act now and the
     objective, where shown, each carry theirs; the sections of statements alone ("What it was doing", "Why it was there") carry no
     section tag. Every narrative statement has a place in the index's words (refLabel), every claimed one is listed in the sources sheet's
     index, and each claim word there with its count */
  { const ST=require('./tools/step4/statements.js').statements(__dirname), live=new Set(ST.map(s=>s.ref)), mk=document.createElement, bad=[], byCl={};
    const KC=Object.keys(CLAIM_BY_CLASS).map(k=>[new RegExp(CLAIM_BY_CLASS[k].re),CLAIM_BY_CLASS[k].cl]);
    const want=r=>Object.prototype.hasOwnProperty.call(STATEMENT_CLAIMS,r)?STATEMENT_CLAIMS[r].cl:((KC.find(([re])=>re.test(r))||[0,"unchecked"])[1]);
    let made=[], nT=0, nV=0;
    try{ document.createElement=t=>{ const x=mk(t); made.push(x); return x; };
      [T_MIN,525,600,700,880].forEach(t=>{ setClock(t);
        Object.keys(FORMATIONS).forEach(id=>{ made=[]; dossierFormation(id); nV++; const f=FORMATIONS[id];
          const h=made.map(x=>x.innerHTML||"").join("\n"), T=[...h.matchAll(/<span class="ltag claim" data-claim="(\w+)" data-ref='([^']+)'><span class="sr-only">Claim: <\/span>([^<]*)<\/span>/g)], refs=T.map(m=>m[2]);
          T.forEach(m=>{ nT++; byCl[m[1]]=(byCl[m[1]]||0)+1;
            if(!live.has(m[2])) bad.push(id+" at "+fmtClock(t)+": a claim tag on "+m[2]+", not a narrative statement");
            else if(m[1]!==want(m[2])) bad.push(id+" at "+fmtClock(t)+": "+m[2]+" tagged "+m[1]+", its claim is "+want(m[2]));
            if(m[3]!==esc(CLAIM_WORDS[m[1]]?CLAIM_WORDS[m[1]].w:"?")) bad.push(id+": the tag on "+m[2]+" reads \""+m[3]+"\", not CLAIM_WORDS's word"); });
          ["commander","staff","strengthNote","role","note"].forEach(k=>{ if(f[k]&&refs.indexOf("FORMATIONS."+id+"."+k)<0) bad.push(id+" at "+fmtClock(t)+": its "+k+" shown without its claim"); });
          if(f.track){ const s=stateAt(id,textPhase(id,clock));
            if(s&&s.act&&refs.indexOf('FORMATIONS.'+id+'.track["'+s.actPhase+'"].act')<0) bad.push(id+" at "+fmtClock(t)+": the act now shown without its claim");
            if(s&&s.obj&&!refs.some(r=>/\.obj$/.test(r))) bad.push(id+" at "+fmtClock(t)+": the objective shown without its claim"); }
          ["What it was doing","Why it was there"].forEach(n=>{ if(h.indexOf("<h3>"+n+" <span")>=0) bad.push(id+": \""+n+"\" still carries a section tag"); }); }); });
    } finally { document.createElement=mk; }
    /* decision 203 (roadmap step 4b part C): the compact card, the event and the place dossiers tag their statements as the formation
       dossier does (the act now and next, the objective, the army total; an event's why and dispute; a place's facts, whys and story), and
       every drawer dossier ends with the button to the index; the index opened from a dossier lists that dossier's statements first */
    let nC=0, nB=0;
    const tagsOf=h=>[...h.matchAll(/<span class="ltag claim" data-claim="(\w+)" data-ref='([^']+)'><span class="sr-only">Claim: <\/span>([^<]*)<\/span>/g)];
    const hasBtn=()=>made.some(x=>(x.innerHTML||"")===esc(LABELS.dossier.sourced));   /* the stub keeps each element's own HTML: the button is one with the label */
    /* the button's list is the dossier's tags, in order (srcButton watched), and no collection is left open after a dossier is built */
    const realSB=srcButton; let given=null; srcButton=function(r){ given=r.slice(); return realSB(r); };
    const judge=(what,h,wantRefs)=>{ const T=tagsOf(h), refs=T.map(m=>m[2]); nC+=T.length; if(hasBtn()) nB++; else bad.push(what+": no \""+LABELS.dossier.sourced+"\" button");
      if(_claimRefs!==null) bad.push(what+": a claim collection left open");
      if(!given||JSON.stringify(given)!==JSON.stringify([...new Set(refs)])) bad.push(what+": the button's statements "+JSON.stringify(given)+" are not its tags "+JSON.stringify(refs));
      T.forEach(m=>{ if(!live.has(m[2])) bad.push(what+": a tag on "+m[2]+", not a statement"); else if(m[1]!==want(m[2])) bad.push(what+": "+m[2]+" tagged "+m[1]+", its claim is "+want(m[2]));
        if(m[3]!==esc(CLAIM_WORDS[m[1]]?CLAIM_WORDS[m[1]].w:"?")) bad.push(what+": the tag on "+m[2]+" reads \""+m[3]+"\""); });
      wantRefs.forEach(r=>{ if(refs.indexOf(r)<0) bad.push(what+": "+r+" shown without its claim"); }); given=null; };
    try{ document.createElement=t=>{ const x=mk(t); made.push(x); return x; };
      [T_MIN,600,880].forEach(t=>{ setClock(t);
        Object.keys(FORMATIONS).forEach(id=>{ made=[]; compactCard(id); const f=FORMATIONS[id], h=made.map(x=>x.innerHTML||"").join("\n"), w=[];
          if(f.army){ w.push("FORMATIONS."+id+".army.men","FORMATIONS."+id+".army.src"); }
          if(f.track){ const s=stateAt(id,textPhase(id,clock)), wt=waitingFor(id,clock); if(s&&s.act) w.push('FORMATIONS.'+id+'.track["'+s.actPhase+'"].act');
            if(wt&&f.track[wt.ph].act) w.push('FORMATIONS.'+id+'.track["'+wt.ph+'"].act');
            if(s&&s.obj){ let k=textPhase(id,clock); while(k>0&&!(f.track[k]&&f.track[k].obj)) k--; w.push('FORMATIONS.'+id+'.track["'+k+'"].obj'); } }
          judge(id+" (card) at "+fmtClock(t),h,w);
          made=[]; given=null; dossierFormation(id); if(!hasBtn()) bad.push(id+" (dossier): no button"); if(_claimRefs!==null) bad.push(id+" (dossier): a claim collection left open"); }); });
      EVENTS.forEach(e=>{ made=[]; dossierEvent(e.id); judge("event "+e.id,made.map(x=>x.innerHTML||"").join("\n"),["EVENTS[#"+e.id+"].why"].concat(e.dispute?["EVENTS[#"+e.id+"].dispute"]:[])); });
      FEATURES.forEach(ft=>{ made=[]; dossierFeature(ft.id); const w=(ft.facts||[]).map((k,i)=>"FEATURES[#"+ft.id+"].facts["+i+"]").concat((ft.why||[]).map((x,i)=>"FEATURES[#"+ft.id+"].why["+i+"]"),ft.story?["FEATURES[#"+ft.id+"].story"]:[]);
        judge("place "+ft.id,made.map(x=>x.innerHTML||"").join("\n"),w.filter(r=>live.has(r))); });
      TERRAIN_LINES.forEach(tl=>{ made=[]; given=null; dossierAnalysis(tl.n); if(!hasBtn()) bad.push("terrain line "+tl.n+": no button"); else nB++;
        if(!given||given.length) bad.push("terrain line "+tl.n+": the button passes "+JSON.stringify(given)+", want none"); });
    } finally { document.createElement=mk; srcButton=realSB; }
    /* the sheet opened from a dossier: its head lists that dossier's statements, each with its claim's word, before the sheet's own text; a
       repaint keeps the list; the tools' button opens it without one; a dossier without statements says so */
    { const e=EVENTS.find(x=>x.dispute), rs=["EVENTS[#"+e.id+"].why","EVENTS[#"+e.id+"].dispute"], mb=document.getElementById("modal-body");
      openSources({refs:rs}); let H=mb.innerHTML, at=H.indexOf('id="claims-here"'), body0=H.indexOf(esc(geoText(SOURCE_NOTE.body[0])));
      if(at<0||body0<0||at>body0) bad.push("the sheet opened from a dossier does not list its statements at its head");
      rs.forEach(r=>{ const p=H.indexOf(esc(refLabel(r))+': <b>'+esc(CLAIM_WORDS[stmtClaim(r).cl].w)+'</b>'); if(p<at||p>body0) bad.push("the sheet opened from "+e.id+"'s dossier does not list "+r+" with its claim first"); });
      openSources({repaint:true}); if(mb.innerHTML.indexOf('id="claims-here"')<0) bad.push("a repaint of the sheet loses the dossier's list");
      openSources(); if(mb.innerHTML.indexOf('id="claims-here"')>=0) bad.push("the tools' sheet lists a dossier's statements");
      openSources({refs:[]}); if(mb.innerHTML.indexOf(esc(LABELS.dossier.none))<0) bad.push("the sheet opened from a dossier without statements does not say so");
      closeSources(); }
    const noLab=ST.filter(s=>!refLabel(s.ref)).map(s=>s.ref); if(noLab.length) bad.push(noLab.length+" statements without a place in the index's words: "+noLab.slice(0,5).join(", "));
    const ix=claimsIndex(), cnt={};
    Object.keys(STATEMENT_CLAIMS).forEach(r=>{ cnt[STATEMENT_CLAIMS[r].cl]=(cnt[STATEMENT_CLAIMS[r].cl]||0)+1; if(ix.indexOf('<li>'+esc(refLabel(r)||r))<0) bad.push("the index does not list "+r); });
    Object.keys(cnt).forEach(k=>{ if(ix.indexOf('<b>'+esc(CLAIM_WORDS[k].w)+'</b>: '+esc(CLAIM_WORDS[k].d)+' '+esc("("+cnt[k]+(cnt[k]===1?" statement":" statements")+")"))<0) bad.push("the index's count for "+k+" is not "+cnt[k]); });
    if(ix.indexOf('<b>'+esc(CLAIM_WORDS.unchecked.w)+'</b>')<0) bad.push("the index does not name the unchecked");
    /* each framing class named in the index with the number of its statements that take its claim (tools/step4/statements.js's classes) */
    Object.keys(CLAIM_BY_CLASS).forEach(k=>{ const n=ST.filter(s=>s.cls===k&&!Object.prototype.hasOwnProperty.call(STATEMENT_CLAIMS,s.ref)).length;
      if(ix.indexOf(esc(CLAIM_BY_CLASS[k].n+" ("+CLAIM_BY_CLASS[k].why+"; "+n+(n===1?" statement":" statements")+")"))<0) bad.push("the index's count for the class "+k+" is not "+n); });
    if(/<details|<summary/.test(ix)) bad.push("the index has a collapsed list, which the sheet's Tab order cannot reach");
    if(!byCl.unchecked||!byCl.interpretation||!nT) bad.push("claim tags: "+nT+" read, kinds "+JSON.stringify(byCl)+" (want the unchecked and the framing interpretation among them)");
    if(bad.length) throw new Error("the claims on screen (decision 187): "+bad.slice(0,8).join("; ")+(bad.length>8?" (and "+(bad.length-8)+" more)":""));
    console.log("the claims on screen (decision 187): "+nT+" claim tags in "+nV+" dossiers at five clocks, each its statement's claim in CLAIM_WORDS's word ("+
      Object.keys(byCl).map(k=>k+" "+byCl[k]).join(", ")+"); every one of "+ST.length+" statements placed in the index's words, the "+Object.keys(STATEMENT_CLAIMS).length+" claimed listed with their counts; "+
      "decision 203: "+nC+" tags in the cards, the events' and the places' dossiers, the button in "+nB+" of them and every full dossier, the dossier's statements first in the index OK"); }

  /* roadmap step 2 (docs/FINAL_AUDIT.md D-5): the sources sheet's notes read the appearance table and the computed sun, not typed values.
     Each value they name is changed in the table for one call and the note must follow it; the table is put back (and the kit's cache). The
     Austrian model is printed with its source and without a trailing parenthesis (its period claim, an inference in the reading) */
  { const bad=[], CC=COLOURS_CARRIED, SM=STANDARD_MEASURES;
    const trial=(what,fn,set,undo,want,not)=>{ set(); _kitDress={}; let s; try{ s=fn().join(" "); } finally { undo(); _kitDress={}; }
      if(s.indexOf(want)<0||(not&&s.indexOf(not)>=0)) bad.push(what+": the note does not follow the table (want \u201c"+want+"\u201d"+(not?", not \u201c"+not+"\u201d":"")+")"); };
    const fc=CC.fr_eagle_inf.cloth, w0=fc.w, h0=fc.h, ai=CC.at_inf, v0=ai.count.v, e0=ai.model.en, rd=SM.ru.stature.dated, ae=SM.at.stature.en, gB=APPEARANCE_GRADE.B, dc=DRESS.fr_dragoon.coat, c0=dc.c, gr0=dc.gr;
    trial("the French cloth",standardNotes,()=>{ fc.w=fc.h=79; },()=>{ fc.w=w0; fc.h=h0; },"the French 79 cm square","81 cm");
    trial("the Austrian count",standardNotes,()=>{ ai.count.v="one to three per battalion"; },()=>{ ai.count.v=v0; },"disputed, one to three per battalion");
    trial("the Austrian model",standardNotes,()=>{ ai.model.en="a test model"; },()=>{ ai.model.en=e0; },"Its model ("+apShort(ai.model.src)+"): a test model;","Leib colour per regiment");
    trial("the Austrian model's period",standardNotes,()=>{ ai.model.en="a test model (the 1700s)"; },()=>{ ai.model.en=e0; },"a test model;","1700s");
    trial("the Russian stature's date",standardNotes,()=>{ SM.ru.stature.dated="1799-01"; },()=>{ SM.ru.stature.dated=rd; },"the minimum of 1799","the minimum of 1804");
    trial("the Austrian stature's period",standardNotes,()=>{ SM.at.stature.en="a test minimum, 1.65 m (the 1770s)"; },()=>{ SM.at.stature.en=ae; },"a minimum of the 1770s","1790s");
    /* the review of C24-C26 (items 3 and 5): the cloths drawn in the generic proportion are named, and follow the table: given a cloth, the
       Russian Guard infantry's colours leave the clause (their shape recomputed as the drawing would, then put back) */
    { const gi=CC.ru_guard_inf, g0=gi.cloth, ST=[]; Object.keys(units).forEach(id=>{ const u=units[id].block&&units[id].block.userData; (u&&u.stds||[]).forEach(q=>{ if(q.S.carry==="ru_guard_inf") ST.push(q); }); });
      const base=standardNotes().join(" "), gc=/where neither a cloth size nor a painting is read \(([^)]*)\), one generic proportion, a design value/.exec(base);
      if(!ST.length) bad.push("the generic cloths: no Russian Guard infantry standard drawn to try");
      if(!gc||gc[1].indexOf("the Russian Guard infantry")<0||gc[1].indexOf("the Royal Guard of the Kingdom of Italy")<0) bad.push("the generic cloths: not named ("+(gc?gc[1]:"no clause")+")");
      const S0=ST.map(q=>q.S);
      trial("a generic cloth given a size",standardNotes,()=>{ gi.cloth={v:"test",en:"100 x 80 cm",w:100,h:80,unit:"cm",src:"viskovatov9_1850",gr:"B",lab:"fact"};
          ST.forEach(q=>{ q.S=kitStdShape(q.S.carry,q.S.nation,q.S.mounted); }); },
        ()=>{ gi.cloth=g0; ST.forEach((q,i)=>{ q.S=S0[i]; }); },"100 x 80 cm","the Russian Guard infantry"); }
    /* the painted patterns' description is typed (it describes the drawing, KIT.paint); each of its words must stand in the item and in the
       table's text it describes (a hyphen read as a space), so a change of the table's model or pattern fails here */
    { const PW=[["1804","fr_eagle_inf","model"],["white","fr_eagle_inf","pattern"],["lozenge","fr_eagle_inf","pattern"],["red and blue","fr_eagle_inf","pattern"],
        ["imperial yellow","at_inf","model"],["black double eagle","at_inf","pattern"],["flame","at_inf","pattern"],["border","at_inf","pattern"]];
      const item=standardNotes().filter(t=>/^Painted where/.test(t))[0]||"", nh=t=>String(t||"").replace(/-/g," ");
      PW.forEach(([w,k,f])=>{ const c=CC[k]&&CC[k][f];
        if(item.indexOf(w)<0) bad.push("the painted item no longer says \u201c"+w+"\u201d (update this list with it)");
        if(!c||!(c.gr==="A"||c.gr==="B")||nh(c.en).indexOf(w)<0) bad.push("the painted item's \u201c"+w+"\u201d is not in "+k+"."+f+" graded A or B ("+(c?nh(c.en):"none")+")"); });
      if(!(CC.ru_inf.pattern&&CC.ru_inf.pattern.gen)) bad.push("the painted item calls the Russian infantry's pattern an open question; the table settles it"); }
    /* the review of C28 (issue 1): 25cc972's committed build printed "(A.'s ratios ...)", an initial for the author, and nothing caught it.
       Whenever an oblong cloth whose size is Dolleczek's is drawn, the cloths' item names him by surname (the last word of the source's
       author), never by an initial; when none is drawn, the parenthesis is absent */
    let dolN=0, dolSur="";
    { const sur=String(APPEARANCE_SOURCES.dolleczek1896.au).split(" (")[0].split(" ").pop(), item=standardNotes().filter(t=>/^The cloths in their sourced proportions/.test(t))[0]||"";
      let dol=0; Object.keys(units).forEach(id=>{ const u=units[id].block&&units[id].block.userData;
        (u&&u.stds||[]).forEach(q=>{ const c=q.S.cloth; if(c&&c.w!==c.h&&c.src==="dolleczek1896") dol++; }); });
      if(!item) bad.push("the cloths' item: not found");
      if(/^[A-Z]\.?$/.test(sur)) bad.push("the cloths' item: Dolleczek's surname read as “"+sur+"”");
      if(/\([A-Z]\.'s ratios/.test(item)) bad.push("the cloths' item names the ratios' author by an initial");
      if(dol&&item.indexOf("("+sur+"'s ratios")<0) bad.push("the cloths' item: "+dol+" oblong cloths of Dolleczek's size drawn, but no “("+sur+"'s ratios”");
      if(!dol&&/'s ratios/.test(item)) bad.push("the cloths' item names whose ratios with no oblong cloth of Dolleczek's size drawn");
      dolN=dol; dolSur=sur; }
    trial("the appearance grades",troopNotes,()=>{ APPEARANCE_GRADE.B="a test grade"; },()=>{ APPEARANCE_GRADE.B=gB; },"B a test grade;");
    trial("a settled coat",troopNotes,()=>{ dc.c="blue"; },()=>{ dc.c=c0; },"the French dragoons wore blue","wore green");
    trial("an unsettled coat",troopNotes,()=>{ dc.gr="C"; },()=>{ dc.gr=gr0; },"never by a coat: the Russian","French dragoons");
    const eot=Math.round(SUN_DAY.at(720).eot);
    if(lightNotes().join(" ").indexOf("about "+eot+" minutes earlier")<0) bad.push("the light: local mean time's shift not SUN_DAY's equation of time ("+eot+" min)");
    if(bad.length) throw new Error("notes from the table: "+bad.join("; "));
    console.log("notes from the table: the standards' and the troops' notes follow 10 changed values of the appearance table (a generic cloth given a size among them), the cloths drawn generic are named, the painted item's 8 typed words stand in the table's model and pattern, the cloths' item names \u201c("+dolSur+"'s ratios\u201d by surname ("+dolN+" oblong cloths of his size drawn), and the light's local-time shift is SUN_DAY's ("+eot+" min) OK"); }

  /* roadmap step 2 (docs/FINAL_AUDIT.md D-6): the derived readings carry their tag. At every half hour, every formation's march row
     (marchRow) tagged derived exactly where marchRate gives a leg; every aggregate's place (posRow) named its formations' midpoint, tagged,
     with the number of its formations on the field; none named a position, and no tracked formation named a midpoint */
  { const bad=[]; let nM=0, nA=0;
    for(let t=T_MIN;t<=T_MAX;t+=30){ setClock(t);
      Object.keys(FORMATIONS).forEach(id=>{ const f=FORMATIONS[id];
        if(f.track){ const mr=marchRate(id,clock), r=marchRow(id);
          if(!!mr!==!!r) bad.push(id+" at "+fmtClock(t)+": a march row "+(mr?"missing":"with no leg"));
          if(r){ nM++; if(r.indexOf('<span class="ltag derived">')<0) bad.push(id+" at "+fmtClock(t)+": the march row untagged"); }
          if(/<dt>Midpoint/.test(posRow(id,false)+posRow(id,true))) bad.push(id+" at "+fmtClock(t)+": a tracked formation named a midpoint");
          return; }
        const full=posRow(id,false), card=posRow(id,true), n=leavesOf(id,[]).filter(k=>!!posNow(k)).length;
        if(!/^<div class="kv"><dt>Midpoint at /.test(full)||!(posNow(id)?/^<div class="kv"><dt>Midpoint <span class="ltag derived">/:/^<div class="kv"><dt>Midpoint<\/dt>/).test(card)) bad.push(id+" at "+fmtClock(t)+": not named its formations' midpoint");
        if(!posNow(id)&&(full+card).indexOf('<span class="ltag derived">')>=0) bad.push(id+" at "+fmtClock(t)+": an absent midpoint tagged derived");
        if(/<dt>(Position at|Where)\b/.test(full+card)) bad.push(id+" at "+fmtClock(t)+": an aggregate named as a position");
        if(posNow(id)){ nA++;
          if(full.indexOf('<span class="ltag derived">')<0) bad.push(id+" at "+fmtClock(t)+": the midpoint untagged");
          if(n>1&&full.indexOf("the mean of its "+n+" formations")<0) bad.push(id+" at "+fmtClock(t)+": the midpoint does not name its "+n+" formations"); } }); }
    /* the review of C24-C26 (item 6): no aggregate is off the field at a half hour in the data, so the absent reading is tried: with no
       formation placed (posNow stubbed for one call each), every aggregate's card and full row carry no derived tag */
    { const realP=posNow; let nO=0;
      try{ posNow=function(){ return null; };
        Object.keys(FORMATIONS).filter(id=>!FORMATIONS[id].track).forEach(id=>{ const full=posRow(id,false), card=posRow(id,true); nO++;
          if((full+card).indexOf('<span class="ltag derived">')>=0||!/^<div class="kv"><dt>Midpoint<\/dt><dd>Not on the field at this hour</.test(card))
            bad.push(id+": with none of its formations on the field, a derived tag or no absent reading ("+card.slice(0,80)+")"); });
      } finally { posNow=realP; }
      if(!nO) bad.push("no aggregate to try off the field"); }
    if(bad.length||!nM||!nA) throw new Error("derived tags: "+bad.slice(0,6).join("; ")+" ("+nM+" march rows, "+nA+" midpoints)");
    console.log("derived tags: "+nM+" march rows tagged derived and "+nA+" aggregate midpoints tagged with their formations' number, at every half hour; no tag on an aggregate with none of its formations on the field OK"); }

  /* roadmap step 2 (docs/FINAL_AUDIT.md D-6): "plotted strength unchanged" follows the clock alone. The plotted holding is sampled here once
     a minute up to phase 7, where the reading ends (plateauStrength, read by this test, not plateauDay); at every 7th minute the caption and
     the Now tab's strip are the same after a jump from 04:00, a jump from 18:00 and the morning played a minute at a time from 04:00, and
     carry the note exactly where the holding shown has not changed for 60 minutes or more */
  { const T7=PHASES[7].t0, v=[]; for(let t=T_MIN;t<=T7;t++){ clock=t; v.push(plateauStrength("al")); }   /* the reading is shown up to phase 6 */
    const flat=t=>{ const x=v[t-T_MIN]; let i=t-T_MIN; while(i>=0&&v[i]===x) i--; return t-(T_MIN+i+1); };
    const paint=()=>{ _sitKey=""; paintSituation(); return document.getElementById("tb-cap").innerHTML+"|"+document.getElementById("situation").innerHTML; };
    const played={}; for(let t=T_MIN;t<=T7;t++){ setClock(t); paintSituation(); if((t-T_MIN)%7===0) played[t]=paint(); }
    const bad=[]; let shown=0, hidden=0;
    for(let t=T_MIN;t<=T7;t+=7){
      setClock(T_MIN); paint(); setClock(t); const a=paint(); setClock(T_MAX); paint(); setClock(t); const b=paint();
      const want=phaseAt(t)<=6&&v[t-T_MIN]>0&&flat(t)>=60, has=a.indexOf("plotted strength unchanged")>=0;
      if(a!==b||a!==played[t]) bad.push(fmtClock(t)+": the caption or the strip depends on where the clock came from");
      if(has!==want) bad.push(fmtClock(t)+": the note "+(want?"missing":"shown")+" (the holding unchanged for "+flat(t)+" min)");
      if(want) shown++; else hidden++; }
    if(bad.length||!shown||!hidden) throw new Error("plateau note: "+bad.slice(0,6).join("; ")+" (shown at "+shown+", not at "+hidden+")");
    console.log("plateau note: the same after a jump either way and played, at "+(shown+hidden)+" sampled minutes; shown at the "+shown+" where the holding has not changed for an hour, at no other OK"); }

  /* the sky must repaint through every lighting state without a NaN */
  for(let ph=0;ph<PHASES.length;ph++){
    setPhase(ph,false);
    for(let f=0;f<4;f++){ if(tween) tween(performance.now()+f*700); }
    if(!isFinite(sunDisc.material.opacity)) throw new Error("sun disc opacity NaN at phase "+ph);
    if(!sunDisc.position||!isFinite(sunDisc.position.x)) throw new Error("sun disc lost at phase "+ph);
  }
  setMode("staff"); if(sunDisc.material.opacity!==0) throw new Error("sun disc visible on the staff map");
  setMode("terrain");
  console.log("sky and sun disc through "+PHASES.length+" lighting states OK");

  /* the ground grain must leave the paper alone */
  setMode("staff"); if(groundMesh.material.map) throw new Error("grain drawn on the staff map");
  setMode("terrain"); if(!groundMesh.material.map) throw new Error("grain missing from the terrain");
  console.log("ground grain swaps with the map mode OK");

  /* the tour's closing stop */
  startTour(); for(let i=0;i<TOUR.length;i++) tourGo(1);
  if(tourStep!==-1) throw new Error("tour did not finish");
  console.log(TOUR.length+"-stop tour finishes cleanly OK");

  /* the terrain material carries the atlas shader and a cover attribute */
  if(typeof groundMesh.material.onBeforeCompile!=="function") throw new Error("atlas shader not attached");
  if(!groundMesh.geometry.attributes.cover) throw new Error("cover attribute missing from the terrain");
  const fakeShader={uniforms:{},vertexShader:"#include <common>\n#include <uv_vertex>\n",fragmentShader:"#include <common>\n#include <map_fragment>\n"};
  groundMesh.material.onBeforeCompile(fakeShader);
  if(!/attribute float cover/.test(fakeShader.vertexShader)) throw new Error("vertex patch did not apply");
  /* Stage 2F: the atlas is sampled at the cover cell's coordinate through gAtlas (with the gradients of the continuous
     coordinate; was texture2D(map,tuv)), and the fragment classifies each point by coverClass's rule (gClass) */
  if(!/gAtlas\(map,tuv\)/.test(fakeShader.fragmentShader)) throw new Error("fragment patch did not apply");
  if(!/float gClass\(/.test(fakeShader.fragmentShader)||!fakeShader.uniforms.uCovA||!fakeShader.uniforms.uMl) throw new Error("the per-point cover classification is not in the ground shader");
  console.log("terrain atlas shader and cover attribute OK");

  /* the post chain: targets sized, passes wired, grade tweened per hour */
  if(!FX.on) throw new Error("post processing failed to initialise");
  for(const m of ["matBright","matBlur","matComp"]) if(!FX[m]) throw new Error(m+" missing");
  renderer._passes=[]; renderer._target=null;
  const gd0=GDEPTH.n;
  renderFX();
  const seq=renderer._passes.join(" "), gdN=GDEPTH.n-gd0;
  /* Stage 8, implementation PR 8B (decision 241): the ground's own depth, when this frame draws it, first, into its own target */
  if(gdN>1||!new RegExp("^"+(gdN?"rt ":"")+"rt( rt){6} screen screen$").test(seq)) throw new Error("unexpected pass order: "+seq+" (the ground's depth pass drawn "+gdN+" times)");
  if(scene.background===null) throw new Error("scene background was not restored after the label pass");
  if(GDEPTH.u.uGroundOn.value!==0) throw new Error("the ground's depth test left on after the world pass");
  console.log("render order: "+seq+" OK"+(gdN?" (the ground's depth pass first)":"")+", background restored, the ground's test off after the world pass");
  sizeFX();
  const grades=[];
  for(let ph=0;ph<PHASES.length;ph++){
    setPhase(ph,false);
    for(let f=0;f<4;f++) if(tween) tween(performance.now()+f*700);
    const u=FX.matComp.uniforms;
    for(const k of ["bloom","exposure","sat","contrast"])
      if(!isFinite(u[k].value)) throw new Error(k+" not finite at phase "+ph);
    grades.push(u.bloom.value.toFixed(2));
  }
  if(new Set(grades).size<4) throw new Error("the grade barely changes across the day");
  console.log("post chain through "+PHASES.length+" hours, bloom "+Math.min(...grades)+"-"+Math.max(...grades)+" OK");

  /* the map symbols sit on the ungraded label layer, and the counters and all map text are the map layer's. Before Stage 2D
     this checked that the counter sprite had a layer; the counter and every text sprite are retired, so the check now covers
     both halves of the separation: every sprite drawn over the ground (render order 10 and up: event glyphs, objective and
     plan markers) on LAYER_LABEL, and the selected formation's counter collected by the map layer */
  let onLabel=0; const offLabel=[];
  setPlan("al");
  scene.traverse(o=>{ if(o instanceof THREE.Sprite&&o.renderOrder>=10){ if(o.layers.mask===(1<<LAYER_LABEL)) onLabel++; else offLabel.push(o.renderOrder); } });
  setPlan(planSide);
  if(!onLabel||offLabel.length) throw new Error("map symbols off the label layer (render orders "+offLabel.join(",")+"), "+onLabel+" on it");
  setMode("staff"); updateVisibility();
  const sid=lodEch==="corps"?"c_iv":"sthilaire";   /* a counter of the echelon the level of detail draws */
  select("f",sid); updateVisibility(); mlLayout();
  const ci=ML.items["c:"+sid];
  if(!ci||ci.frame!==ML.frame) throw new Error("the selected formation's counter is not in the map layer");
  select(null,null); setMode("terrain");
  console.log("label layer: "+onLabel+" map symbols on it; the counters and map text in the map layer OK");

  /* the apron must face upward, or it is culled and the map edge shows */
  const an=world.apron.geometry.attributes.normal.array;
  let down=0, faces=0;
  for(let i=1;i<an.length;i+=9){ faces++; if(an[i]<=0) down++; }
  if(!faces) throw new Error("apron has no faces");
  if(down) throw new Error(down+" of "+faces+" apron faces point down (would be back-face culled)");
  console.log("apron: "+faces+" faces, all facing up OK");

  /* mist must be lit by the hour: darker before dawn than at midday (since Stage 4C the valley fog's colour; the sheets are gone) */
  setMode("terrain"); setPhase(0,true); if(tween) tween(performance.now()+50);
  const m0=ATMO.u.uAtmoV.value.clone();
  setPhase(6,true); if(tween) tween(performance.now()+50);
  const m6=ATMO.u.uAtmoV.value;
  if(!(m0.r+m0.g+m0.b < m6.r+m6.g+m6.b)) throw new Error("predawn mist is not darker than midday mist");
  if(world.mist.children.length||world.mist.visible) throw new Error("the mist sheets are drawn again (Stage 4C: the fog is the atmosphere's)");
  console.log("mist tinted by the hour OK");

  /* one frame path with a live fallback: FX failure must not empty the frame */
  if(!FX.on) throw new Error("FX not on after init");
  const realFX=renderFX;
  renderFX=function(){ throw new Error("simulated post-processing failure"); };
  renderFrame();
  if(FX.on) throw new Error("FX stayed on after a failure");
  if(renderer.outputEncoding!==THREE.sRGBEncoding) throw new Error("standard path did not restore sRGB output");
  renderFX=realFX;
  setFXEnabled(true);
  if(!FX.on||renderer.outputEncoding!==THREE.LinearEncoding) throw new Error("could not re-enable FX");
  renderFrame();
  /* roadmap step 3 (SW-7): a failed set is disposed, not reused; off and on again reuses the targets and materials */
  { const rt0=FX.rtScene, m0=FX.matComp, q0=FX.quad;
    setFXEnabled(false); if(!FX.built) throw new Error("FX: the targets were dropped when the effects were turned off");
    setFXEnabled(true); renderFrame();
    if(FX.rtScene!==rt0||FX.matComp!==m0||FX.quad!==q0) throw new Error("FX: off and on again made new targets or materials (SW-7)");
    renderFX=function(){ throw new Error("simulated post-processing failure"); }; renderFrame(); renderFX=realFX;
    if(FX.built||FX.rtScene) throw new Error("FX: a set that failed in a frame is kept (SW-7)");
    setFXEnabled(true); renderFrame(); if(!FX.on||!FX.built||FX.rtScene===rt0) throw new Error("FX: not rebuilt after a failure");
    /* a resize while the effects are off is taken up when they come back */
    const gd=renderer.getDrawingBufferSize; setFXEnabled(false); renderer.getDrawingBufferSize=function(v){ v.x=1200; v.y=700; return v; };
    setFXEnabled(true); const ww=Math.max(2,(1200*FX.scale)|0);
    if(FX.rtScene.width!==ww||FX.rtFinal.width!==1200||FX.rtFinal.height!==700) throw new Error("FX: a resize while off not taken up ("+FX.rtScene.width+" against "+ww+")");
    renderer.getDrawingBufferSize=gd; sizeFX(); }
  console.log("frame path: FX failure falls back to the standard path and recovers; off and on again reuses its targets OK");
  /* roadmap step 3 (SW-1): boot() reports a start-up error to the guard with its kind and rethrows it; no guard, it only rethrows; a lost
     graphics context stops the frames and fills the notice, a restored one clears it */
  { const init0=init, calls=[]; let thrown=null;
    global.AUS_BOOT={fail:function(k,e){ calls.push(k+":"+e.message); }};
    init=function(){ const e=new Error("no context"); e.ausKind="webgl"; throw e; };
    try{ boot(); }catch(e){ thrown=e.message; }
    init=function(){ throw new Error("other"); }; try{ boot(); }catch(e){ thrown+=","+e.message; }
    delete global.AUS_BOOT; init=function(){ throw new Error("bare"); }; try{ boot(); }catch(e){ thrown+=","+e.message; }
    init=init0;
    if(calls.join()!=="webgl:no context,error:other"||thrown!=="no context,other,bare") throw new Error("boot(): reported ["+calls.join()+"], thrown "+thrown);
    if(GL.lost) throw new Error("GL.lost set at start"); }
  console.log("start-up: boot() reports to the guard with its kind and rethrows; without a guard it rethrows OK");

  /* the vegetation kit and the settlements */
  const broadVariants=world.trees.children.length, conVariants=world.conifers.children.length;
  if(broadVariants<3||conVariants<2) throw new Error("tree kit incomplete: "+broadVariants+" broadleaf, "+conVariants+" conifer");
  if(!world.scrub) throw new Error("no scrub");
  console.log("vegetation: "+broadVariants+" bare deciduous habits, "+conVariants+" conifers, scrub OK");

  /* every formation has a contact pad that follows it */
  let pads=0; Object.keys(units).forEach(id=>{ if(units[id].pad) pads++; });
  if(pads!==Object.keys(units).length) throw new Error("pads: "+pads+" of "+Object.keys(units).length);
  console.log("contact pads under all "+pads+" formations OK");

  /* warm light, cool air: no lighting state may have amber fog, and no night may be black */
  Object.keys(LIGHT).forEach(k=>{
    const L=LIGHT[k]; if(k==="staff") return;
    const c=new THREE.Color(L.fogC);
    if(c.r>c.b*1.12) throw new Error(k+" fog is amber ("+L.fogC.toString(16)+")");
    if((k==="predawn"||k==="dusk") && L.hemi<0.5) throw new Error(k+" is too dark to read (hemi "+L.hemi+")");
  });
  console.log("atmosphere: cool air in every state, readable nights OK");

  /* Stage 4B: the light is the computed sun's and the light table's. Each branch of the table rises in altitude to the day's
     highest, every row names a preset, and the light is finite at every minute of the day */
  ["am","pm"].forEach(b=>{ const R=LIGHT_BY_ALT[b];
    R.forEach((r,i)=>{ if(!LIGHT[r[1]]) throw new Error("light table "+b+" row "+i+" names no preset ("+r[1]+")"); if(i&&r[0]<R[i-1][0]) throw new Error("light table "+b+" not in rising altitude"); });
    if(Math.abs(R[R.length-1][0]-SUN_DAY.noonAlt)>1e-9) throw new Error("light table "+b+" does not end at the day's highest altitude"); });
  for(let t=T_MIN;t<=T_MAX;t+=7){ const L=lightAt(t);
    [L.i,L.hemi,L.fill,L.disc,L.dir.x,L.dir.y,L.dir.z,L.grade[4],L.grade[5]].forEach(v=>{ if(!isFinite(v)) throw new Error("light not finite at "+t); });
    if(L.dir.y<=0) throw new Error("the light comes from below the horizon at "+t); }
  console.log("light table: two branches to the day's highest sun, finite and from above at every minute OK");

  /* Stage 4D: the dwell. A dry run of the day at each speed: its length the computed one within a step, one dwell at each
     event start after 04:00, the clock never running backwards nor faster than its speed */
  { const c0=clock, st=1/60;
    [0.5,1,2,4].forEach(x=>{ clock=T_MIN; dwellReset(); let real=0, n=0, was=null, fast=0, back=0;
      while(clock<T_MAX&&real<3600){ const nt=Math.min(T_MAX,dwellAdvance(st,MIN_PER_SEC*x)); if(nt<clock-1e-9) back++; if(nt-clock>MIN_PER_SEC*x*st*(1+1e-6)) fast++;
        clock=nt; real+=st; if(DWELL.st&&DWELL.st.E!==was){ n++; was=DWELL.st.E; } }
      const L=dwellDayLength(T_MIN,x), want=dwellStarts().filter(t=>t>T_MIN).length;
      if(Math.abs(real-L)>2*st||n!==want||back||fast) throw new Error("dwell at "+x+"x: "+real.toFixed(2)+" s against "+L.toFixed(2)+", "+n+" dwells of "+want+", "+back+" backward and "+fast+" too fast steps"); });
    /* roadmap step 3 (S-2): the toggle mid-day through dwellSet: off across a start, on again; the clock never goes back, the start it
       passed is not dwelt, and every start ahead dwells once */
    { const S=dwellStarts(), E1=S.filter(t=>t>=420)[0], v=MIN_PER_SEC*0.5; let back=0, seen=[];
      clock=E1-30; dwellReset(); dwellSet(false);
      while(clock<=E1+2){ const nt=dwellAdvance(1/60,v); if(nt<clock-1e-9) back++; clock=nt; if(DWELL.st) seen.push(DWELL.st.E); }
      dwellSet(true);
      while(clock<T_MAX){ const nt=Math.min(T_MAX,dwellAdvance(1/60,v)); if(nt<clock-1e-9) back++; clock=nt; if(DWELL.st&&seen[seen.length-1]!==DWELL.st.E) seen.push(DWELL.st.E); }
      const want=S.filter(t=>t>E1+2);
      if(back||!DWELL.on||seen.join()!==want.join()) throw new Error("dwell toggle: "+back+" backward steps, dwelt at ["+seen.join()+"] against ["+want.join()+"]"); }
    clock=c0; dwellReset();
    console.log("dwell: the day at 0.5x, 1x, 2x and 4x in its computed length, one dwell at each event start, the clock monotone and never faster than its speed; the toggle mid-day never sends it back OK"); }

  /* Stage 5B (docs/STAGE5_SPEC.md section A.5): spatial confidence, dry run. Since Stage 8, implementation PR 8B (decision 239): off at first
     on the landscape, where every formation drawn as figures has its outline (the footprint's, in its side's colour) and no filled mark; with
     the layer on, its outline at its confAt grade's extent, still no filled mark; on the paper map on at first (decision 85 kept there), every
     formation on the field with its grade's filled mark, as before */
  { if(layerOn.confidence) throw new Error("position confidence is on at first on the landscape (decision 239)");
    setClock(590,{instant:true,force:true,camera:false}); updateVisibility();
    const figs=Object.keys(units).filter(id=>units[id].block.visible);
    const noLine=figs.filter(id=>{ const r=units[id], U=r.line&&r.line.userData.outline; return !(r.line&&r.line.visible&&U&&U.g==="A"&&U.side===sideOfNation(r.f.nation)); });
    const filled=Object.keys(units).filter(id=>{ const r=units[id]; return r.conf&&r.conf.visible; });
    if(!figs.length||noLine.length) throw new Error("spatial confidence off: "+noLine.length+" of "+figs.length+" formations drawn as figures without their footprint's outline: "+noLine.slice(0,4).join(", "));
    if(filled.length) throw new Error("spatial confidence off: a filled mark on the landscape: "+filled.slice(0,4).join(", "));
    layerOn.confidence=true; updateVisibility();
    const off=Object.keys(units).filter(id=>{ const r=units[id]; if(!r.block.visible) return false; const U=r.line&&r.line.userData.outline; return !(r.line&&r.line.visible&&U&&U.g===confAt(id,clock).cf); });
    const filled2=Object.keys(units).filter(id=>{ const r=units[id]; return r.conf&&r.conf.visible; });
    layerOn.confidence=false; updateVisibility();
    if(off.length) throw new Error("spatial confidence on: "+off.length+" formations drawn as figures without their grade's outline: "+off.slice(0,4).join(", "));
    if(filled2.length) throw new Error("spatial confidence on: a filled mark on the landscape: "+filled2.slice(0,4).join(", "));
    setMode("staff"); updateVisibility();
    if(!layerOn.confidence) throw new Error("position confidence is not on at first on the paper map (decision 85, kept by decision 239)");
    let n=0, bad=[]; Object.keys(units).forEach(id=>{ const r=units[id], p=posNow(id); if(!p||knowledgeOf(id)==="unknown") return; n++;
      const g=confAt(id,clock).cf; if(!r.conf||!r.conf.visible||r.conf.userData.conf.g!==g||!r.conf.geometry.index) bad.push(id); });
    setMode("terrain"); updateVisibility();
    if(layerOn.confidence) throw new Error("position confidence still on back on the landscape (decision 239)");
    if(!n||bad.length) throw new Error("spatial confidence on the paper map: "+bad.length+" of "+n+" formations without their grade's mark: "+bad.slice(0,4).join(", "));
    console.log("spatial confidence: off at first on the landscape, "+figs.length+" formations drawn as figures at 09:50 each outlined in its side's colour, none filled; on, each outlined at its grade; on at first on the paper map, "+n+" formations each with its grade's mark (decisions 85, 239) OK"); }


  /* Stage 5D (docs/STAGE5_SPEC.md section B.4; decision 90): the evidence skeleton, dry run. Off by default; on, at 09:50 with nothing
     selected, the legs whose window meets the phase and their anchors, each anchor's mask its grade's; the whole day every leg;
     switched off, nothing left */
  { if(layerOn.skeleton||SKEL.day||SKEL.grp) throw new Error("the evidence skeleton is not off by default");
    select(null,null); setClock(590,{instant:true,force:true,camera:false}); layerOn.skeleton=true; updateVisibility();
    const ph=curPhase, nPh=SKEL.scope?SKEL.scope.legs.length:0, nA=SKEL.marks.length;
    const wrongLeg=SKEL.scope.legs.filter(L=>!(L.w[1]>=PHASES[ph].t0&&L.w[0]<=PHASES[ph].t1)).length;
    const wrongMask=SKEL.marks.filter(m=>m.material.map!==skelTexture(m.userData.skel.cf,m.userData.skel.timed)).length;
    SKEL.day=true; updateVisibility(); const nDay=SKEL.scope.legs.length;
    let all=0; Object.keys(units).forEach(id=>{ const A=anchorList(id); for(let i=1;i<A.length;i++) if(A[i-1].p!==null&&A[i].p!==null) all++; });
    layerOn.skeleton=false; SKEL.day=false; updateVisibility();
    if(!nPh||!nA||wrongLeg||wrongMask||nDay!==all||SKEL.grp||SKEL.marks.length) throw new Error("evidence skeleton: "+nPh+" legs and "+nA+" anchors in the phase ("+wrongLeg+" outside it, "+wrongMask+" with another mask); the whole day "+nDay+" of "+all+" legs; left when off: "+!!SKEL.grp);
    console.log("evidence skeleton: off by default; at 09:50 "+nPh+" legs of the phase and their "+nA+" anchors; the whole day "+nDay+" legs; none left when switched off OK"); }

  /* Stage 5E (docs/STAGE5_SPEC.md section D.6; decision 92): "Whose eyes?", dry run. The reading follows the clock: every 30 minutes for
     both headquarters the cached reading is the rule's afresh; every "not known" or "reported only" has its reason; the control cycles */
  { let n=0, diff=0; const why={};
    ["fr","al"].forEach(cv=>{ setCommandView(cv);
      for(let t=T_MIN;t<=T_MAX;t+=30){ setClock(t,{instant:true,camera:false});
        const ids=Object.keys(units).filter(id=>sideOfNation(FORMATIONS[id].nation)!==cv&&posNow(id)), d={};
        ids.forEach(id=>{ d[id]=knowledgeOf(id); }); knowKey="";
        ids.forEach(id=>{ n++; const k=knowledgeOf(id); if(k!==d[id]) diff++; if(k==="unknown"||k==="uncertain"){ const r=knowReason(id); if(!r) throw new Error("no reason for "+cv+" "+id+" "+k); why[r]=(why[r]||0)+1; } }); } });
    setCommandView("none"); eyesCycle(); const c1=commandView; eyesCycle(); const c2=commandView; eyesCycle(); const c3=commandView;
    if(!n||diff||c1!=="fr"||c2!=="al"||c3!=="none") throw new Error("Whose eyes: "+diff+" of "+n+" readings not the rule's at the clock; the cycle "+[c1,c2,c3].join(","));
    console.log("Whose eyes: "+n+" readings at the clock, each the rule's afresh; reasons "+JSON.stringify(why)+"; the control cycles everyone, Napoleon, the Allied headquarters OK"); }

  /* roadmap step 5 (question 170 (b)): under a reading the plan links and the selection ring draw a formation where the reading draws it
     (readPos) and nothing for one it does not know: every link's start is its formation's readPos (or no link), every 30 minutes for both
     headquarters and both plans, near (every link shown); an unknown enemy selected has no ring, a known one its ring at readPos */
  { let links=0, hid=0, rings=0, noRing=0; const bad=[];
    setMode("terrain"); setPresentation("study"); camera.position.set(-60,40,60); orbitTarget.set(0,0,14);
    ["fr","al"].forEach(cv=>{ setCommandView(cv);
      ["al","fr"].forEach(pl=>{ setPlan(pl);
        for(let t=T_MIN;t<=T_MAX;t+=30){ setClock(t,{instant:true,camera:false}); updateVisibility();
          const a=planLinks.geometry.attributes.position.array, P=planLinks.userData.pairs;
          P.forEach((q,i)=>{ const r=readPos(q[0]), k=i*6, on=!!(a[k]||a[k+1]||a[k+2]||a[k+3]||a[k+4]||a[k+5]);
            if(!r){ if(on) bad.push(cv+" "+pl+" "+fmtClock(t)+": a link from "+q[0]+", which the reading does not know"); else if(posNow(q[0])) hid++; return; }
            const w=W(r[0],r[1]); if(!on||Math.abs(a[k]-w[0])>1e-4||Math.abs(a[k+2]-w[1])>1e-4) bad.push(cv+" "+pl+" "+fmtClock(t)+": "+q[0]+"'s link not from its reading's position"); else links++; }); }
        setPlan(planSide); });
      [600,900].forEach(t=>{ setClock(t,{instant:true,camera:false});
        Object.keys(units).filter(id=>sideOfNation(FORMATIONS[id].nation)!==cv&&posNow(id)).forEach(id=>{ select("f",id); updateVisibility();
          const r=readPos(id); if(!r){ if(selRing.visible) bad.push(cv+" "+fmtClock(t)+": a ring on "+id+", which the reading does not know"); else noRing++; }
          else { const w=W(r[0],r[1]); if(!selRing.visible||Math.abs(selRing.position.x-w[0])>1e-4||Math.abs(selRing.position.z-w[1])>1e-4) bad.push(cv+" "+fmtClock(t)+": "+id+"'s ring not at its reading's position"); else rings++; } }); });
      select(null,null); });
    setCommandView("none"); updateVisibility();
    if(bad.length||!links||!hid||!rings||!noRing) throw new Error("readings, plan links and the ring: "+(bad.slice(0,4).join("; ")||"a case never met")+" ("+links+" links, "+hid+" hidden, "+rings+" rings, "+noRing+" none)");
    console.log("Whose eyes, plan links and the selection ring (question 170 (b)): "+links+" links at the reading's positions, "+hid+" hidden with their formation; "+rings+" rings, "+noRing+" withheld OK"); }

  /* Stage 8, implementation PR 8A (decision 251; docs/STAGE8_SPEC.md section 9.1): under a reading, a formation on the field that the reading
     does not know has no place anywhere the map gives one, the camera included. Every 30 minutes for both headquarters, every formation of the
     other side on the field: the centring (focusOn, as the dossier's button and the order of battle's rows call it) goes to readPos or nowhere;
     the card's "Where" and the full dossier's "Position at" say the reading's sentence (readUnknown) exactly when it does not know it, and the
     full dossier then offers no "Centre the map here"; its day-track draws nothing of its day (no plotted place, leg, route or dot, none in the
     frame), and an aggregate's draws only the days of the formations the reading knows; a place's "Formations nearby now" never
     lists it. Every corps or column of that side with formations on the field: its midpoint the mean of its known formations (aggReading),
     their number said, or the sentence when none is known. An open dossier follows a change of the reading */
  { let nH=0, nK=0, nAgg=0, nPart=0, nPl=0, nFollow=0, nHM=0, nHI=0, nKI=0; const bad=[], mk=document.createElement, realCM=centreOnMap; let made=[], cm=null;
    const html=()=>made.map(x=>x.innerHTML||"").join("\n"), centreBtn=()=>made.some(x=>x.innerHTML==="Centre the map here");
    try{ document.createElement=t=>{ const x=mk(t); made.push(x); return x; }; centreOnMap=function(mp){ cm=mp; };
      ["fr","al"].forEach(cv=>{ setCommandView(cv);
        for(let t=T_MIN;t<=T_MAX;t+=30){ setClock(t,{instant:true,camera:false});
          const at=cv+" "+fmtClock(t);
          Object.keys(units).filter(id=>sideOfNation(FORMATIONS[id].nation)!==cv&&posNow(id)).forEach(id=>{
            const hid=readHidden(id), r=readPos(id), U=esc(readUnknown());
            if(hid!==(drawnKnow(id)==="unknown")||hid!==(r===null)) bad.push(at+": "+id+" hidden "+hid+", drawn "+drawnKnow(id)+", readPos "+JSON.stringify(r));
            cm=null; focusOn(id);
            if(hid&&cm) bad.push(at+": "+id+" centred, which the reading does not know");
            if(!hid&&!(cm&&Math.abs(cm[0]-r[0])<1e-9&&Math.abs(cm[1]-r[1])<1e-9)) bad.push(at+": "+id+" centred at "+JSON.stringify(cm)+", not its reading's position");
            made=[]; compactCard(id); const hc=html(); made=[]; dossierFormation(id); const hf=html(), btn=centreBtn();
            const w='<dt>Where</dt><dd>'+U+'</dd>', p='<dt>Position at '+esc(fmtClock(clock))+'</dt><dd>'+U+'</dd>';
            if(hid){ nH++;
              if(hc.indexOf(w)<0) bad.push(at+": "+id+"'s card does not say "+readUnknown());
              if(hf.indexOf(p)<0) bad.push(at+": "+id+"'s dossier does not say "+readUnknown());
              if(btn) bad.push(at+": "+id+"'s dossier offers to centre on it");
              if(hf.indexOf(esc(LABELS.reading.noCentre.replace("%u",readUnknown())))<0) bad.push(at+": "+id+"'s dossier does not say why it does not centre");
              const M=dayTrackModel(id);
              if(!M||M.leaves.length||M.frame||M.hidden.indexOf(id)<0) bad.push(at+": "+id+"'s day-track draws its day ("+(M?M.leaves.length+" leaves, frame "+!!M.frame:"none")+")");
              else if(hf.indexOf(esc(LABELS.reading.noDay.replace("%c",fmtClock(clock)).replace("%r",EYES.LABEL[cv])))<0) bad.push(at+": "+id+"'s dossier does not say why its day is not shown");
              /* Stage 8, implementation PR 8C (the audit of 8A and 8B, finding B): its march row says nothing of it now, neither "Marching" nor
                 "Next move" nor "over the frozen mere" (where it is); the plotted leg's figures under the neutral name */
              const mr=marchRate(id,clock);
              if(/<dt>(Marching|Next move)<\/dt>/.test(hf)||hf.indexOf("over the frozen mere")>=0) bad.push(at+": "+id+"'s dossier says what its plotted leg says of it now: "+(hf.match(/<dt>(Marching|Next move)<\/dt>[^]{0,80}/)||["over the frozen mere"])[0]);
              if(mr){ nHM++; if(mr.ice) nHI++; if(hf.indexOf("<dt>"+LABELS.reading.leg+"</dt>")<0||hf.indexOf(esc(LABELS.reading.legNote.replace("%r",EYES.LABEL[cv]).replace("%c",fmtClock(clock))))<0) bad.push(at+": "+id+"'s plotted leg not given under its neutral name with the reading's note"); } }
            else { nK++;
              if(hc.indexOf(w)>=0||hf.indexOf(p)>=0) bad.push(at+": "+id+" known, but its place withheld");
              if(!btn) bad.push(at+": "+id+" known, but its dossier offers no centring");
              /* a formation the reading knows: its march row as before (the rule withholds only what the reading does not know) */
              const mr=marchRate(id,clock);
              if(mr&&hf.indexOf("<dt>"+(mr.moving?"Marching":"Next move")+"</dt>")<0) bad.push(at+": "+id+" known, but its march row not "+(mr.moving?"Marching":"Next move"));
              if(mr&&mr.ice){ nKI++; if(hf.indexOf("over the frozen mere")<0) bad.push(at+": "+id+" known, but its leg over the frozen mere not said"); } } });
          Object.keys(FORMATIONS).filter(id=>!FORMATIONS[id].track&&sideOfNation(FORMATIONS[id].nation)!==cv&&posNow(id)).forEach(id=>{ nAgg++;
            const A=aggReading(id); made=[]; dossierFormation(id); const hf=html(), MD=dayTrackModel(id);
            if(MD&&MD.leaves.some(L=>readHidden(L.id))) bad.push(at+": "+id+"'s day-track draws the day of a formation the reading does not know");
            if(!A.p){ if(hf.indexOf('<dt>Midpoint at '+esc(fmtClock(clock))+'</dt><dd>'+esc(readUnknown())+'</dd>')<0) bad.push(at+": "+id+": none known, but its midpoint shown"); }
            else if(!A.whole){ nPart++;
              if(hf.indexOf(esc(nearestFeature(A.p)))<0||hf.indexOf(esc(EYES.LABEL[cv]))<0) bad.push(at+": "+id+": the midpoint is not its known formations' mean, named"); }
            cm=null; focusOn(id); if(!A.p&&cm) bad.push(at+": "+id+" centred, none of its formations known");
            if(A.p&&!(cm&&Math.abs(cm[0]-A.p[0])<1e-9&&Math.abs(cm[1]-A.p[1])<1e-9)) bad.push(at+": "+id+" centred off its known formations' mean"); });
          FEATURES.forEach(ft=>{ placeNearby(ft).forEach(u=>{ if(readHidden(u)) bad.push(at+": "+ft.id+" lists "+u+" nearby"); }); nPl++; }); } });
      /* an open dossier follows the reading: its key holds the reading, and a change repaints it */
      setClock(510,{instant:true,camera:false}); setCommandView("fr");
      const enemy=Object.keys(units).find(id=>sideOfNation(FORMATIONS[id].nation)==="al"&&posNow(id)&&readHidden(id));
      if(enemy){ select("f",enemy); const k1=_drawerKey; setCommandView("none"); const k2=_drawerKey; setCommandView("fr"); const k3=_drawerKey;
        if(k1===k2||k2===k3||k1!==k3||k3!==drawerKey()) bad.push("an open dossier did not follow the reading ("+[k1,k2,k3].join(" / ")+")"); else nFollow++;
        select(null,null); }
      else bad.push("no enemy hidden at 08:30 to open a dossier on");
    } finally { document.createElement=mk; centreOnMap=realCM; setCommandView("none"); }
    if(bad.length||!nH||!nK||!nAgg||!nPart||!nFollow||!nHM||!nHI||!nKI) throw new Error("readings, the centring and the dossiers' places (decision 251): "+(bad.slice(0,6).join("; ")||"a case never met")+
      " ("+nH+" hidden, "+nK+" known, "+nAgg+" aggregates, "+nPart+" partly known, "+nFollow+" followed; march rows: "+nHM+" hidden, "+nHI+" of them over the ice, "+nKI+" known over the ice)");
    console.log("Whose eyes, the centring and the dossiers' places (decision 251): "+nH+" formations withheld (no centring, the reading's sentence in the card and the dossier, no day drawn, "+
      nHM+" march rows neutral, "+nHI+" of them over the frozen mere), "+nK+" known at their reading's position ("+nKI+" over the frozen mere said); "+nAgg+" corps or columns ("+nPart+
      " at their known formations' mean); "+nPl+" places' nearby lists; an open dossier followed the reading OK"); }

  /* Stage 8, implementation PR 8A (decision 251): the sources sheet gives each claim as recorded: the index and a dossier's list carry every
     claim's note and, in a dispute, the side each work supports beside that work (narrative.js's by[].side); nothing is typed */
  { const bad=[], ix=claimsIndex(); let nN=0, nS=0, nD=0;
    Object.keys(STATEMENT_CLAIMS).forEach(r=>{ const E=STATEMENT_CLAIMS[r];
      if(E.note){ nN++; if(ix.indexOf(esc(E.note))<0) bad.push(r+": its note is not in the index"); }
      const W=claimWorks(E);
      W.forEach(w=>{ if(!w.sides.length) return; nS++; const s=esc(w.w)+': '+esc(w.sides.join("; "));
        if(ix.indexOf(s)<0) bad.push(r+": "+w.w+"'s side is not beside it in the index");
        if(dossierClaims([r]).indexOf(s)<0) bad.push(r+": "+w.w+"'s side is not beside it in a dossier's list"); });
      if(E.cl==="disputed"){ nD++; if(!W.some(w=>w.sides.length)) bad.push(r+": disputed, with no side shown"); } });
    if(bad.length||!nN||!nS||!nD) throw new Error("the claims as recorded (decision 251): "+(bad.slice(0,6).join("; ")||"none met")+" ("+nN+" notes, "+nS+" sides, "+nD+" disputes)");
    console.log("the claims as recorded in the sources sheet (decision 251): "+nN+" notes and "+nS+" works' sides in "+nD+" disputes, in the index and a dossier's list OK"); }

  /* the review of 22c77ac: the dossier's pill for a corps or column is its formations' reading (aggReading) with their count as its reason,
     never the corps' own rule at its mean position; a formation's is the drawing's (drawnKnow) with knowReason's reason. Every 30 minutes for
     both readings, every aggregate with formations on the field */
  { let nA=0, nWhy=0; const bad=[];
    ["fr","al"].forEach(cv=>{ setCommandView(cv);
      for(let t=T_MIN;t<=T_MAX;t+=30){ setClock(t,{instant:true,camera:false});
        Object.keys(FORMATIONS).filter(id=>!FORMATIONS[id].track&&leavesOf(id,[]).some(k=>posNow(k))).forEach(id=>{ nA++;
          const P=pillReading(id), A=aggReading(id);
          if(P.kn!==A.know) bad.push(cv+" "+fmtClock(t)+" "+id+": the pill reads "+P.kn+", its formations "+A.know);
          const wantWhy=!A.whole&&(A.know==="unknown"||A.know==="uncertain");
          if(wantWhy!==!!P.why||(P.why&&P.why.indexOf(String(A.n))<0)) bad.push(cv+" "+fmtClock(t)+" "+id+": reason "+JSON.stringify(P.why)+" for "+A.k+" of "+A.n+" known");
          if(P.why) nWhy++; });
        Object.keys(units).filter(id=>posNow(id)).forEach(id=>{ const P=pillReading(id); if(P.kn!==drawnKnow(id)||((P.kn==="unknown"||P.kn==="uncertain")&&!P.why)) bad.push(cv+" "+fmtClock(t)+" "+id+": the formation's pill "+P.kn+" without its reason"); }); } });
    setCommandView("none"); setClock(T_MIN,{instant:true,camera:false});
    if(bad.length||!nA||!nWhy) throw new Error("the dossier's reading pill: "+(bad.slice(0,4).join("; ")||"no aggregate with a reason met"));
    console.log("Whose eyes, the dossier's pill: "+nA+" corps and column readings, each its formations' reading, "+nWhy+" with their count as the reason OK"); }

  /* roadmap step 5 (R-4): the legend's control hint is KEYS's hint rows, in their order, and the shell's fallback the landscape's; and a map
     item's short name (question 172's message) is its own name, not its accessible name's first word */
  { const H=(land)=>KEYS.filter(r=>r.hint&&(land?!r.paper:!r.land)).sort((a,b)=>a.hi-b.hi).map(r=>r.hint).join(" \u00b7 ");
    const shell=require('fs').readFileSync('shell.html','utf8'), m=/id="lg-hint">([^<]*)</.exec(shell), dec=x=>x.replace(/&middot;/g,"\u00b7");
    if(legendHint(true)!==H(true)||legendHint(false)!==H(false)||!/wheel/.test(legendHint(true))||/scroll/.test(legendHint(true))) throw new Error("the legend's hint is not KEYS's: "+legendHint(true));
    if(!m||dec(m[1])!==legendHint(true)) throw new Error("shell.html's legend hint is not the landscape's KEYS hint: "+(m?m[1]:"none"));
    const ev=EVENTS[0], it={pick:{kind:"e",id:ev.id},el:{getAttribute:()=>"Event, 07:00: x",textContent:""}};
    if(mlShortName(it)!==ev.n||mlShortName({pick:{kind:"f",id:"sthilaire"},el:it.el})!==FORMATIONS.sthilaire.name) throw new Error("a map item's short name is not its own: "+mlShortName(it));
    console.log("the legend's hint from KEYS ("+KEYS.filter(r=>r.hint).length+" rows), the shell's fallback the same; the map items' short names OK"); }

  /* Stage 5F (docs/STAGE5_SPEC.md section E.4; decision 93): the ordered routes, dry run. Off by default; on at 09:30, every column; in
     phase 0 with the arrows drawn, not the four the axis arrows draw; with Saint-Hilaire selected, his two columns; off, nothing left */
  { if(layerOn.routes||ROUTES.grp) throw new Error("the ordered routes are not off by default");
    select(null,null); layerOn.routes=true; setClock(570,{instant:true,force:true,camera:false}); updateVisibility(); const all=ROUTES.grp?ROUTES.grp.children.length:0;
    setClock(250,{instant:true,force:true,camera:false}); updateVisibility(); const ph0=ROUTES.grp?ROUTES.grp.children.length:0;
    setClock(570,{instant:true,force:true,camera:false}); select("f","sthilaire"); updateVisibility(); const sel=ROUTES.grp?ROUTES.grp.children.length:0; select(null,null);
    layerOn.routes=false; updateVisibility();
    const cols=PLANS.al.cols.length+PLANS.fr.cols.length, ax=Object.keys(routeAxis0()).length;
    if(all!==cols||ax!==4||ph0>cols-4||sel!==2||ROUTES.grp) throw new Error("ordered routes: "+all+" of "+cols+" at 09:30, "+ph0+" at 04:10 ("+ax+" axis columns), "+sel+" for Saint-Hilaire, left when off "+!!ROUTES.grp);
    console.log("ordered routes: off by default; "+all+" columns at 09:30, "+ph0+" at 04:10 (the "+ax+" axis arrows' columns left to them), "+sel+" for Saint-Hilaire; none left when switched off OK"); }

  /* Stage 5G (docs/STAGE5_SPEC.md section F.4): the day-track's model, dry run: every leaf formation's inset holds its anchors in order,
     its legs through their vias, its frame inside the inset */
  { let n=0, bad=[]; setClock(590,{instant:true,force:true,camera:false});
    Object.keys(units).forEach(id=>{ if(!FORMATIONS[id].track) return; const M=dayTrackModel(id); n++; if(!M){ bad.push(id+" none"); return; }
      const A=anchorList(id).filter(a=>a.p!==null), flat=[].concat(...M.leaves[0].anchors.map(g=>g.members));
      if(flat.length!==A.length||flat.some((m,i)=>m.an!==A[i])) bad.push(id+" anchors");
      if(M.leaves[0].legs.some(l=>l.pts.length!==legPath(l.a,l.b).pts.length)) bad.push(id+" vias");
      if(!(M.bar.px>0&&M.bar.px<=0.4*DT.W)) bad.push(id+" bar"); });
    if(!n||bad.length) throw new Error("day-track: "+bad.length+" of "+n+" wrong: "+bad.slice(0,4).join(", "));
    console.log("day-track: "+n+" formations, each its anchors in order, its legs through their vias, its scale bar within the inset OK"); }

  /* the armies are ranks of figures now, with cloths on the standards (since 6C plain, in the nation's symbol colour) */
  const inf=units.sthilaire.block.userData, cav=units.nansouty.block.userData;
  const infN=inf.figs.reduce((a,f)=>a+f.n,0), cavN=cav.figs.reduce((a,f)=>a+f.n,0);
  if(inf.figs.length<2||infN<100) throw new Error("infantry is not ranks of figures: "+inf.figs.length+" meshes, "+infN+" men");
  if(cav.figs.length<3||cavN<20) throw new Error("cavalry is not ranks of horse: "+cav.figs.length+" meshes, "+cavN);
  if(!inf.flags.material.map) throw new Error("standards carry no colours");
  inf.layout(0.4,2.5); inf.layout(1.16,0.82);
  console.log("figures: Saint-Hilaire "+infN+" men in "+inf.figs.length+" draws, Nansouty "+cavN+" horse OK");

  /* Stage 6C (docs/STAGE6_SPEC.md section 6.2): a dry run of the kit by class for every block: its classes from appearance.js, each
     drawn unit a class (decision 100), every class set with its meshes, generic only where the composition has no class for the group */
  { let nb=0, nr=0, units6=0; const bad=[];
    Object.keys(units).forEach(id=>{ const u=units[id].block&&units[id].block.userData; if(!u) return; nb++;
      const A=appearanceOf(id); if(!A){ bad.push(id+": no composition"); return; }
      if(!u.dress||!u.dress.length){ bad.push(id+": no class drawn"); return; }
      u.dress.forEach(r=>{ nr++;
        if(r.dress!==null&&!DRESS[r.dress]) bad.push(id+": unknown class "+r.dress);
        if(!r.meshes||r.meshes.length!==(r.mounted?3:2)||r.meshes.some(m=>!m.userData.kit)) bad.push(id+" "+r.role+": its meshes");
        if(r.dress===null&&r.role!=="officers"&&A.parts.some(p=>p.mount===(r.mounted?"horse":"foot"))) bad.push(id+" "+r.role+": generic beside its classes"); });
      const ranks=u.dress.filter(r=>r.role==="ranks");
      if(u.nBat&&ranks.reduce((a,r)=>a+r.units.length,0)!==u.nBat) bad.push(id+": ranks drawn "+ranks.reduce((a,r)=>a+r.units.length,0)+" of "+u.nBat+" units");
      units6+=ranks.reduce((a,r)=>a+r.units.length,0); });
    if(nb!==32||bad.length) throw new Error("kit by class: "+nb+" blocks; "+bad.slice(0,4).join("; "));
    console.log("kit by class: "+nb+" blocks, "+nr+" class sets, "+units6+" battalions and squadrons each a class of their composition OK"); }

  /* Stage 6D (docs/STAGE6_SPEC.md section 6.3): a dry run of the standards: each block's as its classes' colours entries rule (kitStdRule per
     drawn unit), none on a headquarters or a battery, one pole per standard, and a detachment's battalions take their standards with them */
  { let n=0; const bad=[];
    Object.keys(units).forEach(id=>{ const u=units[id].block&&units[id].block.userData; if(!u) return; const S=u.stds||[]; n+=S.length;
      if((FORMATIONS[id].arm==="hq"||FORMATIONS[id].arm==="art")&&S.length) bad.push(id+": standards on a "+FORMATIONS[id].arm);
      (u.dress||[]).filter(r=>r.dress&&(r.role==="ranks"||r.role==="riders")).forEach(r=>{ const R=kitStdRule(DRESS[r.dress].carry), w=R.n>=1?R.n*r.units.length:Math.ceil(R.n*r.units.length);
        const got=S.filter(q=>q.dress===r.dress).length; if(got!==w) bad.push(id+" "+r.dress+": "+got+" of "+w); });
      const kb=u.shownBat===undefined?Infinity:u.shownBat, shownS=S.filter(q=>q.unit<kb).length;
      if(S.length&&u.poles.count!==shownS) bad.push(id+": "+u.poles.count+" poles for the "+shownS+" standards of its battalions shown");
      if(u.showBattalions&&u.nBat>1&&S.some(q=>q.unit>0)){ const keep=u.shownBat; u.showBattalions(1);
        const shown=u.poles.count, want=S.filter(q=>q.unit<1).length; u.showBattalions(keep===undefined?u.nBat:keep);
        if(shown!==want) bad.push(id+": "+shown+" standards with one battalion shown, "+want+" belong to it"); } });
    if(!n||bad.length) throw new Error("standards: "+bad.slice(0,4).join("; "));
    console.log("standards: "+n+" on the blocks as their colours entries rule, none on headquarters or batteries, a detachment's taken with its battalions OK"); }

  /* twelve atlas cells, the three photographs present, fields routed by crop */
  if(_atlasCanvas.height!==1536) throw new Error("atlas is not three rows of cells: "+_atlasCanvas.height);
  for(const k of ["mud","grass","litter"]) if(!ASSETS[k]||!ASSETS[k].diff||!ASSETS[k].nor) throw new Error("asset missing: "+k);
  console.log("ground: 12-cell atlas, 3 photographs embedded OK");

  /* every block is laid onto its slope and re-seats its men when it moves */
  const rec=units.vandamme; let seats=0; const origLayout=rec.block.userData.layout;
  rec.block.userData.layout=function(a,b){ seats++; return origLayout(a,b); };
  rec.seatPos=null; rec.seated=false;   /* "not yet seated": seatPos before Stage 0, seated since */
  settleBlock(rec); rec.block.position.x+=2; settleBlock(rec); settleBlock(rec);
  if(seats!==2) throw new Error("re-seating fired "+seats+" times, expected 2 (first, then after a move)");
  rec.block.userData.layout=origLayout;
  console.log("figures re-seat on the ground when the block moves OK");

  /* villages: chimneys and extruded gables. T-6 (roadmap step 1): until step 1 a traverse here did nothing and only the gables were
     checked; now the houses, the chimneys in the scene and the textures of walls and roofs too */
  if(!(world.roofs.geometry instanceof THREE.ExtrudeGeometry)) throw new Error("roofs are not extruded gables");
  if(!world.houses||!(world.houses.count>0)||!world.houses.parent) throw new Error("villages: no houses drawn");
  if(!world.chimneys||!(world.chimneys.count>0)||!world.chimneys.parent) throw new Error("villages: no chimneys drawn");
  if(!world.houses.material.map||!world.roofs.material.map) throw new Error("villages: walls or roofs untextured");
  console.log("villages: "+world.houses.count+" houses with textured walls, extruded textured gables, "+world.chimneys.count+" chimneys OK");

  /* parent/child rendering and accounting, driven through the real frame path across the whole battle:
     a command never renders troops; a column never draws a detached brigade twice; every visible
     block is a formation on the field (and vice versa); untracked parents get no block at all;
     neither side ever has more men on the field than its army. */
  const tracked=Object.keys(FORMATIONS).filter(id=>FORMATIONS[id].track);
  const extra=Object.keys(units).filter(id=>!FORMATIONS[id].track);
  if(extra.length) throw new Error("untracked formations have blocks: "+extra.join(", "));
  if(tracked.some(id=>!units[id])) throw new Error("a tracked formation has no block");
  const parents=tracked.filter(id=>trackedDescendants(id).length);
  if(!parents.length) throw new Error("no tracked parent formations: the rule would be untested");
  const caps={al:+String(FORMATIONS.ahq.army.men).replace(/[^0-9]/g,""), fr:+String(FORMATIONS.gqg.army.men).replace(/[^0-9]/g,"")};
  let samples=0, detachedSeen=0, fullSeen=0;
  for(let t=T_MIN;t<=T_MAX;t+=15){
    setClock(t); updateVisibility(); samples++;
    tracked.forEach(id=>{
      const rec=units[id], on=activeAt(id,clock)&&!!posNow(id);
      if(rec.block.visible && !on) throw new Error(id+" is drawn at "+fmtClock(clock)+" but is not on the field");
      if(on && mode!=="staff" && !rec.block.visible) throw new Error(id+" is on the field at "+fmtClock(clock)+" but not drawn");
    });
    parents.forEach(id=>{
      const f=FORMATIONS[id], ud=units[id].block.userData;
      if(f.arm==="hq"){ if(ud.batFigs&&ud.batFigs.length) throw new Error(id+" is a command but renders troop battalions"); return; }
      if(!units[id].block.visible) return;
      const own=ownStrengthAt(id,clock), want=Math.max(1,Math.min(ud.nBat,Math.round(ud.nBat*own/f.strength)));
      if(ud.shownBat!==want) throw new Error(id+" shows "+ud.shownBat+" of "+ud.nBat+" battalions at "+fmtClock(clock)+"; its own "+own+" men warrant "+want);
      if(want<ud.nBat) detachedSeen++; else fullSeen++;
    });
    ["al","fr"].forEach(sd=>{ const n=sideOnFieldAt(sd,clock); if(n>caps[sd]) throw new Error(sd+" has "+n+" men on the field at "+fmtClock(clock)+", more than its army ("+caps[sd]+")"); });
  }
  if(!detachedSeen||!fullSeen) throw new Error("the detachment case was not exercised (detached "+detachedSeen+", whole "+fullSeen+")");
  console.log("parent/child: "+parents.map(id=>id+(FORMATIONS[id].arm==="hq"?" (command post)":" (own battalions only)")).join(", ")+
    "; "+samples+" moments: no command renders troops, no detachment drawn twice, every drawn block on the field, totals within both armies OK");

  /* the events layer toggles off and on cleanly. T-6 (roadmap step 1): its visibility is read back (until step 1 it was not, and this
     printed the rapid switching's "OK", which now prints after its own rounds) */
  { layerOn.events=false; updateVisibility(); const off=eventGroup.visible;
    layerOn.events=true; updateVisibility(); const on=eventGroup.visible;
    if(off||!on||on!==!cleanViewHidesEvents()) throw new Error("events layer: hidden "+!off+" when off, shown "+on+" when on, in "+presentation);
    console.log("events layer: off hides it, on shows it again ("+presentation+") OK"); }

  /* roadmap step 6 item 3 Part B (docs/STEP6_SPEC.md section 4.5): the phone layout's Menu, the dispatch sheet and the portrait framing, a dry
     run (the body's classes held in a set for it): above 720 px (PHONE false) neither opens and the presets are the authored ones; below it the
     Menu and the sheet open and close, and a preset keeps its target, its eye on the same line of sight at least as far; leaving the phone
     layout closes both. Their behaviour is the harness's phone block and cases */
  { const cl0=document.body.classList, S=new Set(), P0=PHONE, mm0=window.matchMedia;
    document.body.classList={add(c){S.add(c)},remove(c){S.delete(c)},toggle(c,on){ if(on===undefined?!S.has(c):on) S.add(c); else S.delete(c); return S.has(c); },contains:c=>S.has(c)};
    try{
      PHONE=false; setMenu(true); setDSheet(true); if(menuOpen()||dsheetOpen()) throw new Error("phone layout: the Menu or the sheet opened above 720 px");
      const A=reframe(VANTAGE.field), B=presetFrame(VANTAGE.field); if(A.some((v,i)=>Math.abs(v-B[i])>1e-9)) throw new Error("phone layout: a preset reframed above 720 px");
      PHONE=true;
      setMenu(true); if(!menuOpen()) throw new Error("phone layout: setMenu(true) did not open the Menu");
      setMenu(false); if(menuOpen()) throw new Error("phone layout: setMenu(false) did not close the Menu");
      setDSheet(true); if(!dsheetOpen()) throw new Error("phone layout: the grip did not open the dispatch sheet");
      const k=portraitK(), C=presetFrame(VANTAGE.field);
      if(!(k>=1&&k<=PORTRAIT_FIT.kMax)) throw new Error("phone layout: the portrait factor "+k+" outside [1, "+PORTRAIT_FIT.kMax+"]");
      if([3,4,5].some(i=>Math.abs(C[i]-A[i])>1e-9)) throw new Error("phone layout: the portrait framing moved the preset's target");
      const d0=Math.hypot(A[0]-A[3],A[1]-A[4],A[2]-A[5]), d1=Math.hypot(C[0]-C[3],C[1]-C[4],C[2]-C[5]);
      if(!(Math.abs(d1-k*d0)<1e-6)) throw new Error("phone layout: the eye "+d1+" from the target, want "+k+" x "+d0);
      /* the stub's window is 1,600 px wide, so the factor above may be 1: the framing itself at 1.75, the factor 390 x 844 takes (the review's item 4) */
      const E=portraitFrame(A,1.75), d2=Math.hypot(E[0]-E[3],E[1]-E[4],E[2]-E[5]), u0=[0,1,2].map(i=>(A[i]-A[i+3])/d0), u2=[0,1,2].map(i=>(E[i]-E[i+3])/d2);
      if([3,4,5].some(i=>E[i]!==A[i])||!(Math.abs(d2-1.75*d0)<1e-9)||u0.some((v,i)=>Math.abs(v-u2[i])>1e-9)) throw new Error("phone layout: portraitFrame(1.75) did not keep the target and the line of sight at 1.75 times the distance");
      if(portraitFrame(A,1)!==A) throw new Error("phone layout: portraitFrame(1) is not the preset itself");
      PHONE=true; S.add("menu-open"); S.add("dsheet-open"); window.matchMedia=()=>({matches:false}); syncPhone();
      if(PHONE||menuOpen()||dsheetOpen()) throw new Error("phone layout: leaving the phone layout left the Menu or the sheet open");
      console.log("phone layout: the Menu and the dispatch sheet only below 720 px, closed on leaving it; the portrait framing (factor "+k.toFixed(3)+" in this stub, and 1.75) keeps the target and the line of sight OK");
    } finally { PHONE=P0; document.body.classList=cl0; window.matchMedia=mm0; } }

  /* roadmap step 6, decision 238 (docs/STEP6_SPEC.md section 12): the paper map's field framed again when a panel's change gives it room, a
     dry run with the panel list stubbed: framed beside a panel covering most of the screen (the Layers sheet on a phone), then the panel gone:
     drawn larger; a panel opening over it (a selection's chip, a dossier): nothing moves; panned by the visitor: nothing moves. Its behaviour
     in a page is the harness's phone-390-paper case */
  { const mp0=mlPanels, m0=mode, s0=MAPCAM.state(); let P=[];
    mlPanels=()=>P.map(q=>q.slice());
    try{
      mode="staff";
      P=[[0,0,1600,700]]; MAPCAM.frameField(true); const w1=MAPCAM.state().wpp;
      P=[]; syncViewOffset(true); const w2=MAPCAM.state().wpp;
      if(!(w2<w1*0.99)||!MAPCAM.framed()) throw new Error("paper map: the panel closed, the field not framed again ("+w1+" to "+w2+", framed "+MAPCAM.framed()+")");
      const a=MAPCAM.state(); P=[[0,0,400,300]]; syncViewOffset(true); const b=MAPCAM.state();
      if(a.x!==b.x||a.z!==b.z||a.wpp!==b.wpp) throw new Error("paper map: a panel opening over the framed field moved it");
      P=[]; syncViewOffset(true); const c=MAPCAM.state();
      if(a.x!==c.x||a.z!==c.z||a.wpp!==c.wpp) throw new Error("paper map: the panel closing again moved the field, framed for that room already");
      MAPCAM.pan(40,10); const d=MAPCAM.state(); P=[[0,0,1600,700]]; syncViewOffset(true); P=[]; syncViewOffset(true); const e=MAPCAM.state();
      if(MAPCAM.framed()||d.x!==e.x||d.z!==e.z||d.wpp!==e.wpp) throw new Error("paper map: a panel's change moved a field the visitor had panned");
      console.log("paper map: framed again when a panel's change gives the field room ("+w1.toFixed(3)+" to "+w2.toFixed(3)+" units a pixel), never when a panel opens over it or after a pan OK");
    } finally { mlPanels=mp0; mode=m0; MAPCAM.restore(s0); } }

  /* Stage 6B: the appearance table's resolution, a dry run for every drawn block (appearance.js; decision 100) */
  { const ids=Object.keys(units).filter(id=>units[id].block); let parts=0, dom=0;
    ids.forEach(id=>{ const r=appearanceOf(id);
      if(!r||!r.parts.length) throw new Error(id+": the appearance table does not resolve");
      const sums={}; r.parts.forEach(p=>{ sums[p.mount]=(sums[p.mount]||0)+p.share; });
      Object.entries(sums).forEach(([g,sum])=>{ if(Math.abs(sum-1)>1e-9) throw new Error(id+": the "+g+" appearance shares sum to "+sum); });
      r.parts.forEach(p=>{ if(!p.d) throw new Error(id+": dress "+p.dress+" unknown"); if(!p.colours) throw new Error(id+": no colours entry for "+p.dress); });
      parts+=r.parts.length; if(r.dominant) dom++; });
    console.log("appearance: "+ids.length+" blocks resolve to "+parts+" dress parts ("+dom+" by their dominant class) OK"); }
}catch(e){ errs.push("DRIVE: "+e.message+"\n"+(e.stack||"").split("\n").slice(1,4).join("\n")); }

/* the photograph is painted into the atlas when its image loads (a microtask in this stub): checked after the dry runs, before the report.
   T-1 (roadmap step 1): until step 1 its "E" lines were printed outside the report and set no exit code */
function atlasCheck(){
  if(typeof _atlasCanvas==="undefined"||!_atlasCanvas) errs.push("photo atlas: no canvas");
  else if(_atlas.needsUpdate!==true) errs.push("photo atlas: photograph never painted (needsUpdate not set)");
  else console.log("photo atlas: photograph painted under the land cells OK");
}
if(process.env.DUMP_FX){
  const fsx=require('fs'); fsx.mkdirSync('/tmp/tcheck/fx',{recursive:true});
  for(const k of ['matBright','matBlur','matComp','matFXAA'])
    fsx.writeFileSync('/tmp/tcheck/fx/'+k+'.frag','precision highp float;\n'+FX[k].fragmentShader);
  console.log('dumped 4 post shaders');
}
/* Decision 141 (roadmap step 1, docs/FINAL_AUDIT.md T-0): the embedded type's loader, dry runs, before the report. The stub document has
   no document.fonts, so init took the "none" path; its FONTS.ready must have resolved (a fault there is an E line, not a late rejection).
   Then fontsReady is driven over stub FontFaceSets: every face loads; one rejects (the promise still resolves, the face listed failed);
   one never settles (the timeout resolves it, timed out); load() throws; every face already loaded (not late); a face of another family
   ignored; no document.fonts. And relayoutAfterFonts runs, with the first-run card open and closed. */
async function fontDryRuns(){
  const st0=await FONTS.ready;
  if(!FONTS.state||FONTS.state.none!==true) throw new Error("init's fontsReady without document.fonts did not record the 'none' path");
  function face(family,how,status){ const f={family:family,weight:"400",unicodeRange:"U+0020-007E",status:status||"unloaded"};
    f.load=()=>{ if(how==="throw") throw new Error("stub: load throws");
      if(how==="hang"){ f.status="loading"; return new Promise(()=>{}); }
      if(how==="reject"){ f.status="loading"; return Promise.reject(new Error("stub: bad font")).catch(e=>{ f.status="error"; throw e; }); }
      f.status="loaded"; return Promise.resolve(f); };
    return f; }
  function set(list){ global.document.fonts={forEach:cb=>list.forEach(cb)}; }
  const three=how=>[face('"Austerlitz Sans"',"ok"),face('"Austerlitz Sans"',"ok"),face("Austerlitz Serif",how||"ok")];
  const cases=[
    ["every face loads", three(), r=>r.loaded.length===3&&!r.failed.length&&r.late&&!r.timedOut&&!r.none],
    ["one face rejects", three("reject"), r=>r.loaded.length===2&&r.failed.length===1&&/error/.test(r.failed[0])&&!r.timedOut],
    ["one face never settles", three("hang"), r=>r.loaded.length===2&&r.failed.length===1&&r.timedOut],
    ["load() throws", three("throw"), r=>r.loaded.length===2&&r.failed.length===1&&/threw/.test(r.failed[0])&&!r.timedOut],
    ["every face already loaded", [face("Austerlitz Sans","ok","loaded"),face("Austerlitz Sans","ok","loaded"),face("Austerlitz Serif","ok","loaded")],
      r=>r.loaded.length===3&&!r.late&&!r.timedOut],
    ["a face of another family is not counted", three().concat([face("Georgia","hang")]), r=>r.loaded.length===3&&!r.failed.length&&!r.timedOut]];
  for(const [name,list,ok] of cases){ set(list); const t0=Date.now(), r=await fontsReady(50);
    if(!ok(r)) throw new Error("fontsReady, "+name+": "+JSON.stringify(r)); if(Date.now()-t0>2000) throw new Error("fontsReady, "+name+": took "+(Date.now()-t0)+" ms"); }
  delete global.document.fonts;
  const none=await fontsReady(50); if(!none.none) throw new Error("fontsReady without document.fonts: "+JSON.stringify(none));
  const fr=firstRunOpen; firstRunOpen=true; relayoutAfterFonts(); firstRunOpen=false; relayoutAfterFonts(); firstRunOpen=fr;
  console.log("embedded type: init's loader took the no-fonts path ("+JSON.stringify(st0===undefined?FONTS.state:st0)+"); fontsReady over "+cases.length+
    " stub face sets (loaded, rejected, never settled, throwing, already loaded, another family) and none; relayoutAfterFonts with the card open and closed OK");
}
let reported=false;
function report(){
if(reported) return; reported=true;
console.warn=origWarn; console.error=origErr;
const uniq=[...new Set(warns)];
console.log("\nconsole.warn unique:",uniq.length);
uniq.forEach(w=>console.log("  W "+w));   /* every one (until step 1 the first 12) */
console.log("errors:",errs.length);
errs.forEach(e=>console.log("  E "+e));
/* T-1 (roadmap step 1): a warning or an error fails this suite by its exit code too (until step 1 only by run-all's patterns, and a
   warning by none) */
if(uniq.length||errs.length) process.exitCode=1;
}
/* a dry run that never settles must not skip the report: a watchdog, and a last word on exit */
const fontWatch=setTimeout(()=>{ errs.push("FONTS: the dry runs did not finish within 30 s"); report(); },30000);
process.on("exit",()=>{ if(!reported){ console.log("  E FONTS: the dry runs never settled, so the report was not reached"); process.exitCode=1; } });
/* a promise rejected with no handler (the app's or a dry run's) is a named error of this suite, not a late crash past the report
   (roadmap step 1, the critic's conflict 10); one after the report is printed and fails the exit code */
process.on("unhandledRejection",e=>{ const m="UNHANDLED REJECTION: "+(e&&e.message||String(e))+"\n"+((e&&e.stack)||"").split("\n").slice(1,4).join("\n");
  if(reported){ console.log("  E "+m); process.exitCode=1; } else errs.push(m); });
fontDryRuns().catch(e=>errs.push("FONTS: "+e.message+"\n"+(e.stack||"").split("\n").slice(1,4).join("\n")))
  .then(()=>new Promise(r=>setTimeout(r,0)))
  .then(()=>{ try{ atlasCheck(); }catch(e){ errs.push("photo atlas: "+e.message); } })
  .then(()=>{ clearTimeout(fontWatch); report(); });

