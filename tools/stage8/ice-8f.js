#!/usr/bin/env node
/* Stage 8, implementation PR 8F (decision 246 (a): "Tune the bright ice margins so they integrate with the surrounding terrain"; docs/STAGE8_SPEC.md
   section 18.3): the meres' light against the field beside them, in the frame, on 8E's build, on 8F's, and on two variants of 8F's made by
   replacing strings in a copy of it (so that each is rebuilt from the commit): 8F's first draft (its margin 0x7C8686, its band 0x737C79, its
   clear ice 0x4B585F, the band drawn with a polygon offset and the ice writing its depth) and that draft with Part A's w-ice margin colour
   (#A9B3B7). In three views (from above, 90 units off; obliquely, 70; low, 50; at 4x) at 09:00, 12:00 and 15:00: the mean grey of the frame
   (drawn into a target of the tool's, no post-processing) at 48 points round each mere at 0.92 of its radius (the shore band's middle), 0.8
   (the rimed margin) and 0.5 (the clear middle), each over the mean grey of the drawn ground at 1.12 (the field just beyond the shore).
   On the first draft, taken apart from above at 12:00: the environment's weight at 0, the frost's colour at 0.82 of itself, the band hidden.
   node tools/stage8/ice-8f.js --before 8e.html --after 8f.html [--json out.json]
   Measurement code only: the copies are written to a temporary directory and nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), crypto=require("crypto");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const BEFORE=path.resolve(opt("--before")), AFTER=path.resolve(opt("--after")||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=opt("--json");
const FIRST=[["iceClear:0x3E494F, iceFrost:0x5E6664, iceBand:0x5A615E,","iceClear:0x4B585F, iceFrost:0x7C8686, iceBand:0x737C79,"],
  ["    transparent:true,opacity:0.96}),true);","    transparent:true,opacity:0.96,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),true);"],
  ["transparent:true,opacity:0.96,depthWrite:false}),false);","transparent:true,opacity:0.96}),false);"]];
const WICE=FIRST.map(x=>x.slice()); WICE[0][1]="iceClear:0x4B585F, iceFrost:0xA9B3B7, iceBand:0xA9B3B7,";
const MEAS=function(parts){
  closeFirst(null); setDisplayFactor(DISPLAY.defaultFactor); setMode("terrain"); setPresentation("watch");
  var W0=480, H0=270, rt=new THREE.WebGLRenderTarget(W0,H0), B=new Uint8Array(W0*H0*4), out={views:{}};
  function grab(){ renderer.setRenderTarget(rt); renderer.clear(); renderer.render(scene,camera); renderer.readRenderTargetPixels(rt,0,0,W0,H0,B); renderer.setRenderTarget(null); return Uint8Array.from(B); }
  function aim(map,dir,r){ var w=W(map[0],map[1]), y=groundY(w[0],w[1]), d=new THREE.Vector3(dir[0],dir[1],dir[2]).normalize().multiplyScalar(r);
    tween=null; camArc=null; freeCam=true; curVantage=null; landCam.position.set(w[0]+d.x,y+d.y,w[1]+d.z); orbitTarget.set(w[0],y,w[1]); landCam.lookAt(orbitTarget); clampCamera(); syncViewOffset(true); AUSTERLITZ_DEBUG.settle(6,true); }
  var _pv=new THREE.Vector3();
  function pxAt(x,y,z){ _pv.set(x,y,z).project(camera); if(Math.abs(_pv.x)>1||Math.abs(_pv.y)>1||_pv.z<-1||_pv.z>1) return -1; return (Math.floor((_pv.y*0.5+0.5)*H0)*W0+Math.floor((_pv.x*0.5+0.5)*W0))*4; }
  function lum(b,o){ return 0.2126*b[o]+0.7152*b[o+1]+0.0722*b[o+2]; }
  var meres=world.water.filter(function(m){ return m.userData.mere; });
  function ratios(fb){ var R={};
    [0.92,0.8,0.5].forEach(function(rr){ var lm=0, lg=0, n1=0, n2=0;
      meres.forEach(function(m){ var Q=m.userData.mere, c2=Q[0], y2=m.position.y;
        for(var bi=0;bi<48;bi++){ var b=bi/48*2*Math.PI, cs=Math.cos(b), sn=Math.sin(b), o3=pxAt(c2[0]+rr*Q[1]*cs,y2,c2[1]+rr*Q[2]*sn), gx=c2[0]+1.12*Q[1]*cs, gz=c2[1]+1.12*Q[2]*sn, o4=pxAt(gx,groundY(gx,gz),gz);
          if(o3>=0){ lm+=lum(fb,o3); n1++; } if(o4>=0){ lg+=lum(fb,o4); n2++; } } });
      R["r"+rr]=+((lm/Math.max(1,n1))/Math.max(1,lg/Math.max(1,n2))).toFixed(3); });
    return R; }
  var V=[["above",[250,440],[0.10,0.80,0.59],90],["oblique",[262,444],[0.45,0.50,-0.74],70],["low",[262,440],[0.45,0.18,-0.74],50]];
  V.forEach(function(v){ out.views[v[0]]={};
    [540,720,900].forEach(function(t){ setClock(t,{instant:true,force:true,camera:false}); aim(v[1],v[2],v[3]); AUSTERLITZ_DEBUG.settle(6,true); out.views[v[0]][fmtClock(t)]=ratios(grab()); }); });
  if(parts){ setClock(720,{instant:true,force:true,camera:false}); aim(V[0][1],V[0][2],V[0][3]); AUSTERLITZ_DEBUG.settle(6,true); out.parts={};
    var D=meres[0].material, R0=world.iceRims[0].material, e0=[D.envMapIntensity,R0.envMapIntensity];
    D.envMapIntensity=0; R0.envMapIntensity=0; out.parts["the environment's weight 0"]=ratios(grab()); D.envMapIntensity=e0[0]; R0.envMapIntensity=e0[1];
    world.iceRims.forEach(function(r){ r.visible=false; }); out.parts["the band hidden"]=ratios(grab()); world.iceRims.forEach(function(r){ r.visible=true; });
    var po=R0.polygonOffset; R0.polygonOffset=false; out.parts["the band without its offset"]=ratios(grab()); R0.polygonOffset=po; }
  rt.dispose(); return out; };
(async()=>{
  const src=fs.readFileSync(AFTER,"utf8"), dir=fs.mkdtempSync(path.join(os.tmpdir(),"ice-8f-"));
  const mk=(name,subs)=>{ let s=src; for(const [a,b] of subs){ if(s.split(a).length!==2) throw new Error(name+": not found exactly once: "+a.slice(0,60)); s=s.replace(a,()=>b); } const f=path.join(dir,name+".html"); fs.writeFileSync(f,s); return f; };
  const first=mk("first",FIRST), wice=mk("wice",WICE), fr=mk("first-frost82",[...FIRST.slice(1),["iceClear:0x3E494F, iceFrost:0x5E6664, iceBand:0x5A615E,","iceClear:0x4B585F, iceFrost:0x666E6E, iceBand:0x5E6663,"]]);
  const builds=[["8E",BEFORE,false],["8F's first draft",first,true],["the first draft with its frost at 0.82",fr,false],["the first draft with w-ice's margin",wice,false],["8F as built",AFTER,false]];
  const browser=await L.launch(), res={chromium:browser.version(), builds:{}};
  for(const [lab,html,parts] of builds){
    process.env.AUSTERLITZ_HTML=html; const page=await L.open(browser,[1366,768],{}); const r=await page.evaluate(MEAS,parts); await page.close();
    res.builds[lab]=Object.assign({file:path.basename(html), md5:crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex")},r);
    console.log("== "+lab); Object.keys(r.views).forEach(v=>console.log("  "+v.padEnd(8)+Object.entries(r.views[v]).map(([t,x])=>t+" "+x["r0.92"]+" / "+x["r0.8"]+" / "+x["r0.5"]).join("   ")));
    if(r.parts) Object.entries(r.parts).forEach(([k,x])=>console.log("  "+k+": "+x["r0.92"]+" / "+x["r0.8"]+" / "+x["r0.5"])); }
  await browser.close(); fs.rmSync(dir,{recursive:true,force:true});
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
