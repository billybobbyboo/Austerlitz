#!/usr/bin/env node
/* Stage 8, implementation PR 8H (docs/STAGE8_SPEC.md sections 18.10 item 5 and 20.10): the ice against a low sun. 8F left it as built: "at 15:00
   the sun's glare on the clear ice spreads wider and whiter than 8E's sheen ... A rougher clear ice would narrow it, at the cost of the gloss the
   decision asks for". Measured here on the build and on variants of it made by replacing ICE's clear-ice roughness (world.js `ICE.clear`, 0.20
   as built) in a copy of the build (each variant compiles its own programs; nothing is written to a source file), in ice-8f.js's three views
   (from above, 90 units off; obliquely, 70; low, 50; at 4x, Watch) at 09:00, 12:00 and 15:00:
   - ice-8f.js's ratios (the frame's grey at 0.92 of each mere's radius, the shore band's middle, at 0.8, the rimed margin, and at 0.5, the clear
     middle, each over the drawn field's at 1.12) and the self-test's ice bounds on them (the band at most ICE8F.SHORE 1.10 times the field, the
     rimed margin at most ICE8F.MARGIN 1.25 times, the margin lighter than the clear middle: the gloss the decision asks for, "clearer toward the
     middle", read as the clear middle's grey against the margin's);
   - the glare: over a polar grid of each mere's surface (radii 0.05 to 0.85 of its radius by 0.05, 96 bearings; the frame drawn into a target of
     the tool's, no post-processing), the share of the ice's samples brighter than 1.5 times the field beside it and than 200 of 255 (white),
     its 95th percentile and its brightest, over the field's grey;
   - a still of each view at 15:00 for each variant, side by side in a sheet.
   --sky: variants of the sky's reflection at a grazing view over the clear ice instead (world.js `ICE.sky`, 1.4 as built: the specular radiance
   times 1 + sky x (1 - rime) x grazing^4, 8F's), the clear ice as built: the broad white sheen of the oblique and low views is that term's.
   node tools/stage8/ice-8h.js [--html build] [--clear 0.20,0.26,0.32,0.40 | --sky 1.4,0.7,0] [--out dir] [--tag name]
   Measurement and prototype code only. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), crypto=require("crypto");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const HTML=path.resolve(opt("--html")||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=path.resolve(opt("--out")||path.join(L.EVID8,"8h","ice"));
const SKY=opt("--sky")?opt("--sky").split(","):null, CLEAR=SKY?["0.20"]:(opt("--clear")||"0.20,0.26,0.32,0.40").split(","), TAG=opt("--tag")||(SKY?"sky":"clear");
const KEY="clear:0.20, rime:0.62,", KEYS="sky:1.4,";
const MEAS=function(){
  closeFirst(null); setDisplayFactor(DISPLAY.defaultFactor); setMode("terrain"); setPresentation("watch");
  var W0=480, H0=270, rt=new THREE.WebGLRenderTarget(W0,H0), B=new Uint8Array(W0*H0*4), out={views:{}};
  function grab(){ renderer.setRenderTarget(rt); renderer.clear(); renderer.render(scene,camera); renderer.readRenderTargetPixels(rt,0,0,W0,H0,B); renderer.setRenderTarget(null); return Uint8Array.from(B); }
  function aim(map,dir,r){ var w=W(map[0],map[1]), y=groundY(w[0],w[1]), d=new THREE.Vector3(dir[0],dir[1],dir[2]).normalize().multiplyScalar(r);
    tween=null; camArc=null; freeCam=true; curVantage=null; landCam.position.set(w[0]+d.x,y+d.y,w[1]+d.z); orbitTarget.set(w[0],y,w[1]); landCam.lookAt(orbitTarget); clampCamera(); syncViewOffset(true); AUSTERLITZ_DEBUG.settle(6,true); }
  var _pv=new THREE.Vector3();
  function pxAt(x,y,z){ _pv.set(x,y,z).project(camera); if(Math.abs(_pv.x)>1||Math.abs(_pv.y)>1||_pv.z<-1||_pv.z>1) return -1; return (Math.floor((_pv.y*0.5+0.5)*H0)*W0+Math.floor((_pv.x*0.5+0.5)*W0))*4; }
  function lum(b,o){ return 0.2126*b[o]+0.7152*b[o+1]+0.0722*b[o+2]; }
  var meres=world.water.filter(function(m){ return m.userData.mere; });
  function measure(fb){ var R={};
    [0.92,0.8,0.5].forEach(function(rr){ var lm=0, n1=0; meres.forEach(function(m){ var Q=m.userData.mere, c2=Q[0], y2=m.position.y;
      for(var bi=0;bi<48;bi++){ var b=bi/48*2*Math.PI, o3=pxAt(c2[0]+rr*Q[1]*Math.cos(b),y2,c2[1]+rr*Q[2]*Math.sin(b)); if(o3>=0){ lm+=lum(fb,o3); n1++; } } }); R["r"+rr]=lm/Math.max(1,n1); });
    var lg=0, n2=0; meres.forEach(function(m){ var Q=m.userData.mere, c2=Q[0];
      for(var bi=0;bi<48;bi++){ var b=bi/48*2*Math.PI, gx=c2[0]+1.12*Q[1]*Math.cos(b), gz=c2[1]+1.12*Q[2]*Math.sin(b), o4=pxAt(gx,groundY(gx,gz),gz); if(o4>=0){ lg+=lum(fb,o4); n2++; } } });
    var field=lg/Math.max(1,n2), S=[];
    meres.forEach(function(m){ var Q=m.userData.mere, c2=Q[0], y2=m.position.y;
      for(var rr=0.05;rr<0.851;rr+=0.05) for(var bi=0;bi<96;bi++){ var b=bi/96*2*Math.PI, o=pxAt(c2[0]+rr*Q[1]*Math.cos(b),y2,c2[1]+rr*Q[2]*Math.sin(b)); if(o>=0) S.push(lum(fb,o)); } });
    S.sort(function(a,b){ return a-b; });
    var bright=S.filter(function(v){ return v>1.5*field; }).length, white=S.filter(function(v){ return v>200; }).length;
    return {shore:+(R["r0.92"]/field).toFixed(3), margin:+(R["r0.8"]/field).toFixed(3), clear:+(R["r0.5"]/field).toFixed(3),
      field:+field.toFixed(1), samples:S.length, glare15:+(100*bright/Math.max(1,S.length)).toFixed(2), white:+(100*white/Math.max(1,S.length)).toFixed(2),
      p95:S.length?+(S[Math.floor(0.95*(S.length-1))]/field).toFixed(3):null, max:S.length?+(S[S.length-1]/field).toFixed(3):null}; }
  var V=[["above",[250,440],[0.10,0.80,0.59],90],["oblique",[262,444],[0.45,0.50,-0.74],70],["low",[262,440],[0.45,0.18,-0.74],50]];
  V.forEach(function(v){ out.views[v[0]]={};
    [540,720,900].forEach(function(t){ setClock(t,{instant:true,force:true,camera:false}); aim(v[1],v[2],v[3]); AUSTERLITZ_DEBUG.settle(6,true); out.views[v[0]][fmtClock(t)]=measure(grab()); }); });
  rt.dispose(); return out; };
const SHOT=function(v){ var V={above:[[250,440],[0.10,0.80,0.59],90], oblique:[[262,444],[0.45,0.50,-0.74],70], low:[[262,440],[0.45,0.18,-0.74],50]}[v];
  setClock(900,{instant:true,force:true,camera:false}); var w=W(V[0][0],V[0][1]), y=groundY(w[0],w[1]), d=new THREE.Vector3(V[1][0],V[1][1],V[1][2]).normalize().multiplyScalar(V[2]);
  tween=null; camArc=null; freeCam=true; curVantage=null; landCam.position.set(w[0]+d.x,y+d.y,w[1]+d.z); orbitTarget.set(w[0],y,w[1]); landCam.lookAt(orbitTarget); clampCamera(); syncViewOffset(true); AUSTERLITZ_DEBUG.settle(8); return true; };
(async()=>{
  const src=fs.readFileSync(HTML,"utf8"); if(src.split(KEY).length!==2) throw new Error("the build's ICE declaration is not "+KEY);
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"ice-8h-")); fs.mkdirSync(OUT,{recursive:true});
  if(SKY&&src.split(KEYS).length!==2) throw new Error("the build's ICE.sky is not "+KEYS);
  const builds=SKY?SKY.map(k=>{ const f=path.join(dir,"sky-"+k+".html"); fs.writeFileSync(f,src.replace(KEYS,"sky:"+k+",")); return ["sky "+k,f]; })
    :CLEAR.map(c=>{ const f=path.join(dir,"clear-"+c+".html"); fs.writeFileSync(f,src.replace(KEY,"clear:"+c+", rime:0.62,")); return ["clear "+c,f]; });
  const browser=await L.launch(), res={tool:"tools/stage8/ice-8h.js", build:path.basename(HTML), md5:crypto.createHash("md5").update(fs.readFileSync(HTML)).digest("hex"), chromium:browser.version(), variants:{}}, tiles={above:[],oblique:[],low:[]};
  let sp=null;
  for(const [c,html] of builds){
    process.env.AUSTERLITZ_HTML=html; const page=await L.open(browser,[1366,768],{}); const r=await page.evaluate(MEAS);
    for(const v of ["above","oblique","low"]){ await page.evaluate(SHOT,v); const png=await L.png(page); tiles[v].push({png:png, cap:"ICE."+c+(c==="clear 0.20"||c==="sky 1.4"?" (as built)":"")+", "+v+", 15:00: glare "+r.views[v]["15:00"].glare15+"% of the ice over 1.5 x the field, clear middle "+r.views[v]["15:00"].clear+" x"}); await L.jpeg(page,path.join(OUT,"ice-"+v+"-1500-"+c.replace(" ","")+".jpg"),86); }
    if(!sp) sp=page; else await page.close();
    res.variants[c]=r; console.log("== ICE."+c); Object.keys(r.views).forEach(v=>console.log("  "+v.padEnd(8)+Object.entries(r.views[v]).map(([t,x])=>t+" band "+x.shore+" margin "+x.margin+" clear "+x.clear+" glare "+x.glare15+"% white "+x.white+"% p95 "+x.p95+" max "+x.max).join(" | ")));
  }
  for(const v of ["above","oblique","low"]) await L.sheet(sp,tiles[v],2,683,384,"the ice at 15:00 by "+(SKY?"the sky's reflection at a grazing view":"the clear ice's roughness")+" ("+v+")",path.join(OUT,"ice-"+v+"-1500-"+TAG+"-sheet.jpg"),true);
  await sp.close(); await browser.close(); fs.rmSync(dir,{recursive:true,force:true});
  fs.writeFileSync(path.join(OUT,"ice-8h-"+TAG+".json"),JSON.stringify(res,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
