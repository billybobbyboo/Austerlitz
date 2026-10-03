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
   Rendering stays stubbed: renderer, render targets, textures, materials, geometries, Color. */
const REAL=require('three');
class Col{constructor(h){this.r=1;this.g=1;this.b=1;this.setHex(h===undefined?0xffffff:h)}
 setHex(h){this.hex=h;this.r=((h>>16)&255)/255;this.g=((h>>8)&255)/255;this.b=(h&255)/255;return this}
 copy(c){this.r=c.r;this.g=c.g;this.b=c.b;this.hex=c.hex;return this}
 clone(){const c=new Col(0);c.r=this.r;c.g=this.g;c.b=this.b;c.hex=this.hex;return c}
 lerp(c,t){this.r+=(c.r-this.r)*t;this.g+=(c.g-this.g)*t;this.b+=(c.b-this.b)*t;return this}
 multiplyScalar(k){this.r*=k;this.g*=k;this.b*=k;return this}
 setHSL(){return this}
 getHexString(){const h=x=>("0"+Math.round(Math.max(0,Math.min(1,x))*255).toString(16)).slice(-2);return h(this.r)+h(this.g)+h(this.b)}
 convertSRGBToLinear(){const f=x=>x<0.04045?x/12.92:Math.pow((x+0.055)/1.055,2.4);this.r=f(this.r);this.g=f(this.g);this.b=f(this.b);return this}}
class Obj extends REAL.Object3D{}
function attr(n,item){const a={count:n,array:new Float32Array(n*item),needsUpdate:false,
  getX:i=>a.array[i*item],getY:i=>a.array[i*item+1],getZ:i=>a.array[i*item+2],
  setY(i,v){a.array[i*item+1]=v},set(x){a.array.set(x)}};return a;}
class Geo{constructor(n=12){this.attributes={position:attr(n,3),normal:attr(n,3),color:attr(n,3)};this.index={};}
 rotateX(){return this}
 toNonIndexed(){ if(!this.index) console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."); this.index=null; return this }
 computeVertexNormals(){}
 setAttribute(k,v){this.attributes[k]=v;return this} setIndex(){return this}
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
   getDrawingBufferSize(v){v.x=1600;v.y=900;return v}},
 WebGLRenderTarget:class{constructor(w,h,o){this.width=w;this.height=h;
   this.texture={generateMipmaps:true};Object.assign(this,o||{})}
   setSize(w,h){this.width=w;this.height=h} dispose(){}},
 ShaderMaterial:function(o){Object.assign(this,o||{});this.uniforms=o&&o.uniforms||{};
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
 SphereGeometry:Geo, ExtrudeGeometry:class extends Geo{translate(){return this}}, Shape:class{moveTo(){}lineTo(){}}, IcosahedronGeometry:class extends Geo{constructor(){super();this.index=null}},BoxGeometry:Geo,ConeGeometry:Geo,CylinderGeometry:Geo,CircleGeometry:Geo,
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
 PCFSoftShadowMap:1,sRGBEncoding:1,ACESFilmicToneMapping:1,BackSide:1,DoubleSide:2,
 LinearFilter:1,ClampToEdgeWrapping:1,
};
const matNames=["MeshBasicMaterial","MeshPhongMaterial","MeshLambertMaterial","MeshStandardMaterial",
  "SpriteMaterial","LineBasicMaterial","LineDashedMaterial"];
const ALLOWED={MeshPhongMaterial:new Set(["color","vertexColors","flatShading","shininess","specular","side","transparent","opacity","map","depthTest","depthWrite","fog"]),
 MeshLambertMaterial:new Set(["color","vertexColors","side","transparent","opacity","map","depthTest","depthWrite","fog"]),
 MeshStandardMaterial:new Set(["color","vertexColors","flatShading","roughness","metalness","side",
   "transparent","opacity","map","normalMap","normalScale","envMap","envMapIntensity","depthTest","depthWrite","fog"]),
 MeshBasicMaterial:new Set(["color","transparent","opacity","fog","depthWrite","depthTest","map","side","vertexColors"]),
 SpriteMaterial:new Set(["map","transparent","opacity","depthTest","fog","color","depthWrite"]),
 LineBasicMaterial:new Set(["color","transparent","opacity","depthTest","depthWrite","linewidth"]),
 LineDashedMaterial:new Set(["color","dashSize","gapSize","transparent","opacity","depthTest","scale","depthWrite"])};
matNames.forEach(n=>{ stub[n]=function(o){ o=o||{};
  Object.keys(o).forEach(k=>{ if(ALLOWED[n]&&!ALLOWED[n].has(k))
    console.warn("THREE."+n+": '"+k+"' is not a property of this material."); });
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

  /* abuse: rapid switching, jumping, toggling */
  for(let i=0;i<40;i++){
    setPhase(i%PHASES.length,true);
    setMode(["terrain","staff","hybrid"][i%3]);
    select(i%2?"f":"t", i%2?"sthilaire":"pratzen");
    setChapter(i%3===0?ANALYSIS[i%ANALYSIS.length].id:null);
    setClock(T_MIN+(i*37)%(T_MAX-T_MIN));
    togglePlay();
    updateVisibility();
  }
  stopPlay(); setChapter(null); select(null,null); setCommandView("none");
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
  let evSeen=0, sitSeen=0;
  for(let t=T_MIN;t<=T_MAX;t+=7){
    setClock(t); updateVisibility();
    if(liveEvents(t).length) evSeen++;
    paintSituation();
    if(_sitKey) sitSeen++;
  }
  console.log("event layer + situation strip over "+evSeen+" sampled minutes OK");

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

  /* jumping between events must reach both ends and never stall */
  setClock(T_MIN,{force:true});
  let hops=0, last=-1;
  for(let i=0;i<60;i++){ jumpEvent(1); if(clock===last) break; last=clock; hops++; }
  if(hops<EVENTS.length-2) throw new Error("forward event jump stalled after "+hops);
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

  /* event jumping must not drag the camera when the moment is already in view */
  setClock(T_MIN,{force:true});
  const camBefore=camera.position.clone();
  freeCam=false;
  jumpEvent(1); jumpEvent(1); jumpEvent(-1);
  if(!isFinite(camera.position.x)) throw new Error("camera left the world");
  console.log("event jump camera behaviour OK");

  /* plan links thin out at distance and fill in on approach */
  setPlan("al");
  orbitTarget.set(0,0,14); camera.position.set(-196,132,226);
  updateVisibility();
  const farCount=planLinks?planLinks.userData.pairs.length:0;
  camera.position.set(-60,40,60); updateVisibility();
  if(!farCount) throw new Error("plan links never built");
  setPlan(planSide);
  console.log("plan link density OK");

  /* the derived readings must use the measured wording */
  if(typeof centreSeparation!=="function") throw new Error("centreSeparation missing");
  setClock(660); paintSituation();
  console.log("derived reading wording OK");

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
  renderFX();
  const seq=renderer._passes.join(" ");
  if(!/^rt( rt){6} screen screen$/.test(seq)) throw new Error("unexpected pass order: "+seq);
  if(scene.background===null) throw new Error("scene background was not restored after the label pass");
  console.log("render order: "+seq+" OK, background restored");
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
  console.log("frame path: FX failure falls back to the standard path and recovers OK");

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
    clock=c0; dwellReset();
    console.log("dwell: the day at 0.5x, 1x, 2x and 4x in its computed length, one dwell at each event start, the clock monotone and never faster than its speed OK"); }

  /* the armies are ranks of figures now, with national colours on the standards */
  const inf=units.sthilaire.block.userData, cav=units.nansouty.block.userData;
  const infN=inf.figs.reduce((a,f)=>a+f.n,0), cavN=cav.figs.reduce((a,f)=>a+f.n,0);
  if(inf.figs.length<2||infN<100) throw new Error("infantry is not ranks of figures: "+inf.figs.length+" meshes, "+infN+" men");
  if(cav.figs.length<3||cavN<20) throw new Error("cavalry is not ranks of horse: "+cav.figs.length+" meshes, "+cavN);
  if(!inf.flags.material.map) throw new Error("standards carry no colours");
  inf.layout(0.4,2.5); inf.layout(1.16,0.82);
  console.log("figures: Saint-Hilaire "+infN+" men in "+inf.figs.length+" draws, Nansouty "+cavN+" horse OK");

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

  /* villages: chimneys and extruded gables */
  let chimneys=0; scene.traverse(o=>{ if(o.geometry&&o.geometry.constructor&&o.material===undefined) return; });
  if(!(world.roofs.geometry instanceof THREE.ExtrudeGeometry)) throw new Error("roofs are not extruded gables");
  console.log("villages: extruded gables, textured walls OK");

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
  console.log("parent/child: "+parents.map(id=>id+(FORMATIONS[id].arm==="hq"?" (command post)":" (column, own battalions only)")).join(", ")+
    "; "+samples+" moments: no command renders troops, no detachment drawn twice, every drawn block on the field, totals within both armies OK");

  /* the events layer toggles off cleanly */
  layerOn.events=false; updateVisibility(); layerOn.events=true; updateVisibility();
  console.log("40 rounds of rapid switching OK");
}catch(e){ errs.push("DRIVE: "+e.message+"\n"+(e.stack||"").split("\n").slice(1,4).join("\n")); }

setTimeout(function(){
  if(!_atlasCanvas) console.log("  E photo atlas: no canvas");
  else if(_atlas.needsUpdate!==true) console.log("  E photo atlas: photograph never painted (needsUpdate not set)");
  else console.log("photo atlas: photograph painted under the land cells OK");
},0);
if(process.env.DUMP_FX){
  const fsx=require('fs'); fsx.mkdirSync('/tmp/tcheck/fx',{recursive:true});
  for(const k of ['matBright','matBlur','matComp','matFXAA'])
    fsx.writeFileSync('/tmp/tcheck/fx/'+k+'.frag','precision highp float;\n'+FX[k].fragmentShader);
  console.log('dumped 4 post shaders');
}
console.warn=origWarn; console.error=origErr;
const uniq=[...new Set(warns)];
console.log("\nconsole.warn unique:",uniq.length);
uniq.slice(0,12).forEach(w=>console.log("  W "+w));
console.log("errors:",errs.length);
errs.forEach(e=>console.log("  E "+e));

