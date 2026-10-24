#!/usr/bin/env node
/* Stage 8, implementation PRs 8A and 8B (docs/STAGE8_SPEC.md sections 13 and 14): two builds compared in matching views, the same case (camera,
   clock, presentation, viewport, factor, reading, selection) applied to each by the harness's own route (tools/stage8/lib.js applyCase).
   For each view and build: the frame (JPEG), and measured on the page as drawn:
   - each movement arrow's casing at its widest on screen (px; from the drawn geometry: every row of its casing's shaft with both edges in
     front of the eye and on the screen, edge to edge), the widest line of battle, boundary and halt bar likewise; the overlay ribbons' roles
     read from the order rebuildOverlays builds them in (the lines with their ticks, the boundaries, then each arrow: its casing and fill with
     their heads, a derived arrow's drawn-on part after it, a halt bar's casing and fill), the same in every build since 2C;
   - the event glyphs' and the objective markers' largest size on screen (px), as drawn (visible, not faded out);
   - the ground cues drawn: the filled marks (rec.conf, rec.foot) and the outlines (rec.line, since 8B), and the layer's setting;
   - the frame's cost: draw calls and triangles of one drawn frame (renderer.info), the median of five frames drawn (software WebGL here:
     a measure of this machine's CPU, comparable between the two builds, not a GPU's), and since 8B the ground's depth pass (GDEPTH: its
     triangles and its time on the CPU when drawn).
   Then a sheet per view, the two frames side by side. Variants of the second build (--b-variants) are drawn after its own view: "conf-on",
   Position confidence switched on (decision 239's optional layer).
   node tools/stage8/compare-8.js --a old.html --b new.html [--views a,b] [--out dir] [--json file] [--b-variants conf-on] [--label-a x --label-b y]
   AUSTERLITZ_CHROME the Chromium to run. Measurement only: nothing here changes either build, and every switch a variant makes is put back. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("./lib.js"), VIEWS=require("./views.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const A=path.resolve(opt("--a")), B=path.resolve(opt("--b")), OUT=path.resolve(opt("--out")||path.join(L.EVID8,"compare")), JSONF=opt("--json")||path.join(OUT,"compare.json");
const LA=opt("--label-a")||"before", LB=opt("--label-b")||"after", BV=(opt("--b-variants")||"").split(",").filter(Boolean);
const ONLY=(opt("--views")||"overview-field,pratzen-low,close-sokolnitz,eye-zuran,selected-formation,paper-north-up").split(",");
const md5=f=>crypto.createHash("md5").update(fs.readFileSync(f)).digest("hex");
/* in the page: the measures */
function measure(){
  var V=new THREE.Vector3(), W2=renderer.domElement.clientWidth, H2=renderer.domElement.clientHeight, out={};
  function scr(x,y,z){ V.set(x,y,z).applyMatrix4(camera.matrixWorldInverse); var d=-V.z; V.set(x,y,z).project(camera); return [(V.x+1)/2*W2,(1-V.y)/2*H2,d]; }
  /* the overlay ribbons by role, from the build order */
  var O=OVERLAYS[curPhase]||{}, kids=curOv?curOv.children.slice():[], k=0, rib=[];
  function take(role,n,heads){ var ms=[]; for(var i=0;i<n;i++){ var c=kids[k++]; if(c&&c.userData.drape&&c.userData.drape.kind==="shaft") ms.push(c); else if(heads&&c&&c.userData.drape&&c.userData.drape.kind==="head"){ } } return ms; }
  (O.lines||[]).forEach(function(){ var s=take("line",2); k+=15; rib.push({role:"line",shafts:s}); });
  (O.bounds||[]).forEach(function(){ rib.push({role:"bound",shafts:take("bound",2)}); });
  (O.arrows||[]).forEach(function(a){ var pts=typeof arrowPts==="function"?arrowPts(a):a.pts; if(!pts||pts.length<2) return;
    if(a.kind==="halt"){ rib.push({role:"halt",shafts:take("halt",2)}); return; }
    var s=[kids[k],kids[k+2]], h=[kids[k+1],kids[k+3]]; k+=4; rib.push({role:"arrow",kind:a.kind,side:a.side,shafts:s,heads:h});
    if(a.leg){ rib.push({role:"drawon",shafts:[kids[k],kids[k+1]]}); k+=2; } });
  var roleOK=k<=kids.length&&rib.every(function(r){ return r.shafts.every(function(m){ return m&&m.userData.drape&&m.userData.drape.kind==="shaft"; }); });
  if(curOv&&curOv.userData.ribbons) roleOK=roleOK&&curOv.userData.ribbons.length===rib.length&&curOv.userData.ribbons.every(function(R,i){ return R.role===rib[i].role; });
  function widest(m){ if(!m||!m.visible||!m.geometry.index) return null; var I=m.geometry.index.array, A=m.geometry.attributes.position.array, mm=I[1]-I[0]-1, per=(mm+1)*3, rows=Math.floor(A.length/per), dr=m.geometry.drawRange, last=dr.count===Infinity?rows-1:Math.min(rows-1,Math.round(dr.count/(mm*6))), best=0, n=0;
    for(var i=0;i<=last;i++){ var q=i*per, e=q+mm*3, a=scr(A[q],A[q+1],A[q+2]), b=scr(A[e],A[e+1],A[e+2]);
      if(a[2]<=camera.near||b[2]<=camera.near) continue; if(Math.max(a[0],b[0])<0||Math.min(a[0],b[0])>W2||Math.max(a[1],b[1])<0||Math.min(a[1],b[1])>H2) continue;
      n++; best=Math.max(best,Math.hypot(a[0]-b[0],a[1]-b[1])); } return n?best:null; }
  var W={arrow:[],drawon:[],line:[],bound:[],halt:[]};
  rib.forEach(function(r){ var w=widest(r.shafts[0]); if(w!==null) W[r.role].push(+w.toFixed(1)); });
  out.widths=W; out.roleOK=roleOK; out.layerArrows=!!layerOn.arrows;
  out.widest={}; Object.keys(W).forEach(function(r){ out.widest[r]=W[r].length?Math.max.apply(null,W[r]):null; });
  /* the glyphs and the objective markers, as drawn */
  var gl=0, ob=0;
  (typeof eventMarks!=="undefined"?eventMarks:[]).forEach(function(e){ if(!e.sp||!e.sp.visible||!(e.sp.material.opacity>0.01)) return; gl=Math.max(gl,e.sp.scale.x/worldPerPx(e.sp.position)); });
  (typeof ovMarkers!=="undefined"?ovMarkers:[]).forEach(function(e){ if(!e.sp||!e.sp.visible||!(e.sp.material.opacity>0.01)) return; ob=Math.max(ob,e.sp.scale.x/worldPerPx(e.sp.position)); });
  out.glyphPx=+gl.toFixed(1); out.markerPx=+ob.toFixed(1); out.symMax=typeof SYM_MAX_PX!=="undefined"?SYM_MAX_PX:null;
  /* the ground cues */
  var c={filled:0,foot:0,line:0}; Object.keys(units).forEach(function(id){ var r=units[id]; if(r.conf&&r.conf.visible) c.filled++; if(r.foot&&r.foot.visible) c.foot++; if(r.line&&r.line.visible) c.line++; });
  out.cues=c; out.confLayer=!!layerOn.confidence;
  /* the cost */
  var ar0=renderer.info.autoReset; renderer.info.autoReset=false; renderer.info.reset(); if(typeof GDEPTH!=="undefined") GDEPTH.key=null; renderFrame();
  out.calls=renderer.info.render.calls; out.tris=renderer.info.render.triangles;
  if(typeof GDEPTH!=="undefined") out.gdepth={tris:GDEPTH.tris, ms:+GDEPTH.ms.toFixed(2), on:GDEPTH.key!==null};
  var g=renderer.getContext(), T=[]; for(var i=0;i<5;i++){ if(typeof GDEPTH!=="undefined") GDEPTH.key=null; var t0=performance.now(); renderFrame(); g.finish(); T.push(performance.now()-t0); }
  T.sort(function(a,b){ return a-b; }); out.ms=+T[2].toFixed(1);
  var T2=[]; for(i=0;i<5;i++){ var t1=performance.now(); renderFrame(); g.finish(); T2.push(performance.now()-t1); } T2.sort(function(a,b){ return a-b; }); out.msCached=+T2[2].toFixed(1);
  renderer.info.autoReset=ar0;   /* the app's own setting given back (off since roadmap step 3: its frame resets the count) */
  return out;
}
const VARIANTS={ "conf-on":[()=>{ layerOn.confidence=true; if(typeof syncConfButton==="function") syncConfButton(); updateVisibility(); requestRender(3); },
                            ()=>{ layerOn.confidence=false; if(typeof syncConfButton==="function") syncConfButton(); updateVisibility(); requestRender(3); }] };
(async()=>{
  const browser=await L.launch(), res={a:{html:A,md5:md5(A),label:LA}, b:{html:B,md5:md5(B),label:LB}, views:{}};
  if(fs.existsSync(JSONF)){ try{ const old=JSON.parse(fs.readFileSync(JSONF,"utf8")); if(old.a&&old.b&&old.a.md5===res.a.md5&&old.b.md5===res.b.md5) Object.assign(res.views,old.views); }catch(e){} }
  const save=()=>{ fs.mkdirSync(path.dirname(JSONF),{recursive:true}); fs.writeFileSync(JSONF,JSON.stringify(res,null,1)); };
  const shots={};
  for(const [key,html] of [["a",A],["b",B]]){
    process.env.AUSTERLITZ_HTML=html; let page=null, vp=null;
    for(const name of ONLY){
      const v=VIEWS[name]; if(!v) throw new Error("no view "+name);
      if(!page||vp!==v.viewport.join("x")){ if(page) await page.close(); page=await L.open(browser,v.viewport); vp=v.viewport.join("x"); }
      await L.applyCase(page,v); await L.settle(page);
      const file=path.join(OUT,name+"-"+key+".jpg"); await L.jpeg(page,file,86);
      const m=await page.evaluate(measure); m.errors=page._errors.slice();
      (res.views[name]=res.views[name]||{})[key]=m; (shots[name]=shots[name]||{})[key]=await L.png(page);
      console.log(key,name.padEnd(22),JSON.stringify({widest:m.widest,glyph:m.glyphPx,marker:m.markerPx,cues:m.cues,conf:m.confLayer,calls:m.calls,tris:m.tris,ms:m.ms,gd:m.gdepth,role:m.roleOK}));
      if(key==="b") for(const vn of BV){ const V=VARIANTS[vn]; await page.evaluate(V[0]); await L.settle(page);
        await L.jpeg(page,path.join(OUT,name+"-b-"+vn+".jpg"),86); const mv=await page.evaluate(measure); res.views[name]["b-"+vn]=mv; shots[name]["b-"+vn]=await L.png(page);
        console.log("b+"+vn,name.padEnd(19),JSON.stringify({cues:mv.cues,conf:mv.confLayer,calls:mv.calls,tris:mv.tris,ms:mv.ms}));
        await page.evaluate(V[1]); await L.settle(page); }
      save();
    }
    if(page) await page.close();
  }
  /* the sheets: the two builds side by side (and the variants) */
  const page=await L.open(browser,[1600,900]);
  for(const name of ONLY){ const S=shots[name]; if(!S) continue; const tiles=[{png:S.a,cap:name+" · "+LA},{png:S.b,cap:name+" · "+LB}];
    BV.forEach(vn=>{ if(S["b-"+vn]) tiles.push({png:S["b-"+vn],cap:name+" · "+LB+", "+vn}); });
    await L.sheet(page,tiles,tiles.length,800,450,name+": "+LA+" and "+LB,path.join(OUT,name+"-sheet.jpg")); }
  await page.close(); await browser.close(); save();
})().catch(e=>{ console.error(e); process.exit(1); });
