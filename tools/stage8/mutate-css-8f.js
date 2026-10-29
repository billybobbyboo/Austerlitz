#!/usr/bin/env node
/* Stage 8, implementation PR 8F (docs/STAGE8_SPEC.md section 18): does css-test.js's 8F block (water, woods and the near ground as decided)
   fail when what it holds is broken? Each mutation replaces one string of a source file (its fifth element: world.js unless named); css-test.js
   is run on the copy in a temporary tree (every other file the repository's own, linked), and its 8F line and its findings are read. The
   unmutated source first: the block passes on it.
   node tools/stage8/mutate-css-8f.js [--json out.json]
   Measurement code only: nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), cp=require("child_process");
const ROOT=path.resolve(__dirname,"..",".."), argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; }, OUT=opt("--json");
/* [id, what it breaks, from, to, the file (world.js unless named)] */
const MUT=[
  ["none","nothing (the source as it is)",null,null],
  ["papercol","the paper map's stream colour moved (8E's WATER_COL.stream)","stream:0x587A8E,","stream:0x5A7A8E,"],
  ["landcol","a landscape water colour written outside WATER_COL","bankLand:0x454C40, ","bankLand:BANK8F, "],
  ["rimwidth","the shore ring wider than 4E's","rim:0.86, rimLift:0.02,","rim:0.80, rimLift:0.02,"],
  ["level","a mere moved (its level changed)","mere(MENI,23,9,-3.95);","mere(MENI,23,9,-3.75);"],
  ["paper8e","the paper map's ice not 8E's (its roughness)","paper:{ice:new THREE.MeshStandardMaterial({color:lin(WATER_COL.ice),roughness:ICE.roughness,","paper:{ice:new THREE.MeshStandardMaterial({color:lin(WATER_COL.ice),roughness:ICE.clear,"],
  ["papermats","the paper map drawn with the landscape's water","  var S=staff?WATER_MATS.paper:WATER_MATS.land;","  var S=WATER_MATS.land;"],
  ["opacityfirst","setMode setting the water's opacity before its materials are in place","  waterPresentation(staff);   /* Stage 8, 8F (decision 246 (a)): the landscape's ice and streams (8F's materials), or the paper map's (8E's) */\n  world.water.forEach(function(w2){ if(w2.material.opacity!==undefined) w2.material.opacity=staff?1:0.94; });","  world.water.forEach(function(w2){ if(w2.material.opacity!==undefined) w2.material.opacity=staff?1:0.94; });\n  waterPresentation(staff);","app.js"],
  ["depth","the landscape's ice writing its depth","transparent:true,opacity:0.96,depthWrite:false}),false);","transparent:true,opacity:0.96}),false);"],
  ["offset","the shore band drawn with a polygon offset","    transparent:true,opacity:0.96}),true);","    transparent:true,opacity:0.96,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),true);"],
  ["order","the shore band sorted with its ice","    r.renderOrder=1;","    r.renderOrder=0;"],
  ["atmo","the stream's hook not chaining the atmosphere's uniforms","  mat.onBeforeCompile=function(sh){\n    if(typeof atmoUniforms===\"function\") atmoUniforms(sh);\n    sh.vertexShader=sh.vertexShader.replace(\"#include <common>\",\"#include <common>\\nvarying vec3 vStW;\")","  mat.onBeforeCompile=function(sh){\n    sh.vertexShader=sh.vertexShader.replace(\"#include <common>\",\"#include <common>\\nvarying vec3 vStW;\")"],
  ["flow","the streams animated (a time in their hook)","*wFbm(vStW.xz*\"+glslF(STREAM.scale)+\");\")","*wFbm(vStW.xz*\"+glslF(STREAM.scale)+\"+uTime);\")"],
  ["hole","a hole cut in the ice (discard)","diffuseColor.rgb=mix(uIceA,uIceF,iM)*(","if(iP>0.95) discard; diffuseColor.rgb=mix(uIceA,uIceF,iM)*("],
  ["treevals","TREE8F's crowns denser than the prototype's","var TREE8F={keep:0.42, shrink:0.7,","var TREE8F={keep:0.6, shrink:0.7,"],
  ["treeside","the deciduous habits drawn on their front faces only","var im=new THREE.InstancedMesh(kit.broad[vi],matte({color:0xFFFFFF,flatShading:true,side:THREE.DoubleSide}),Math.max(1,list.length));","var im=new THREE.InstancedMesh(kit.broad[vi],matte({color:0xFFFFFF,flatShading:true}),Math.max(1,list.length));"],
  ["treealpha","the crowns drawn with alpha","scrubMesh=new THREE.InstancedMesh(kit.scrub,matte({color:0xFFFFFF,flatShading:true,side:THREE.DoubleSide}),","scrubMesh=new THREE.InstancedMesh(kit.scrub,matte({color:0xFFFFFF,flatShading:true,side:THREE.DoubleSide,transparent:true,opacity:0.8}),"],
  ["jitter","the shells not 8E's crowns (their jitter)","var k=0.78+0.44*hash2(Math.round(pa[i]*13+seed),","var k=0.70+0.60*hash2(Math.round(pa[i]*13+seed),"],
  ["conifer","a conifer changed","mergeParts([T(0.9),{geo:cone,p:[0,3.0,0],s:[0.8,4.2,0.8]}])","mergeParts([T(0.9),{geo:cone,p:[0,3.0,0],s:[0.7,4.2,0.7]}])"],
  ["detailvals","GDETAIL's reach moved","var GDETAIL={amount:0.55, near:14, far:60,","var GDETAIL={amount:0.55, near:14, far:90,"],
  ["detailmode","the near detail on every mode","  \"  if(uMode>0.5&&uMode<1.5&&(uDetail.x>0.0||uDebug>4.5)){\",","  \"  if(uDetail.x>0.0||uDebug>4.5){\","],
  ["detailfade","the near detail not faded by the eye's distance","float gDf=uDetail.x*(1.0-smoothstep(uDetail.y,uDetail.z,length(vViewPosition)));","float gDf=uDetail.x;"],
  ["detailscreen","the near detail on the screen, not the ground","vec2 gDu=mat2(uDetailR.x,uDetailR.y,-uDetailR.y,uDetailR.x)*vUv*uDetail.w;","vec2 gDu=mat2(uDetailR.x,uDetailR.y,-uDetailR.y,uDetailR.x)*gl_FragCoord.xy*0.01*uDetail.w;"],
  ["detailtint","the near detail a colour of its own","texelColor.rgb*=mix(1.0,clamp(gDl,uDetailC.x,uDetailC.y),gDf);","texelColor.rgb*=mix(vec3(1.0),vec3(0.9,1.0,0.9)*clamp(gDl,uDetailC.x,uDetailC.y),gDf);"],
  ["lumflip","the near detail normalised by the canvas's cells as laid out (three's flip ignored)","cy=(flip?2-Math.floor(k/4):Math.floor(k/4))*R,","cy=Math.floor(k/4)*R,"],
  ["detaillow","the near detail drawn under lowTier","  groundDetail(!lowTier);","  groundDetail(true);","app.js"],
  ["bounds","the self-test's margin bound loosened","var ICE8F={SHORE:1.10, MARGIN:1.25};","var ICE8F={SHORE:1.10, MARGIN:1.45};","app.js"],
  ["woods8e","the self-test's 8E tree counts not 8E's","var WOODS8E={wood:634, village:184,","var WOODS8E={wood:630, village:184,","app.js"]
];
const MF=["app.js","world.js"], SRC={}, dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-css-8f-")), res={mutations:[]};
MF.forEach(f=>{ SRC[f]=fs.readFileSync(path.join(ROOT,f),"utf8"); });
fs.readdirSync(ROOT).forEach(f=>{ if(!MF.includes(f)&&f!==".git") fs.symlinkSync(path.join(ROOT,f),path.join(dir,f)); });
let wrong=0;
for(const [id,what,a,b,file] of MUT){
  const F=file||"world.js";
  MF.forEach(f=>{ let s=SRC[f]; if(a&&f===F){ if(s.split(a).length!==2) throw new Error(id+": the string to replace is not found exactly once in "+F); s=s.replace(a,()=>b); } fs.writeFileSync(path.join(dir,f),s); });
  const r=cp.spawnSync("node",["css-test.js"],{cwd:dir,encoding:"utf8",maxBuffer:64<<20}), out=r.stdout||"";
  const line=(out.split("\n").find(l=>l.startsWith("water, woods and the near ground (decisions 246 (a), 247 (a))"))||""), found=out.split("\n").filter(l=>/^  ! /.test(l)).map(l=>l.slice(4));
  const fails=/: \d+ wrong$/.test(line), ok=id==="none"?!fails&&line.length>0&&r.status===0:fails;
  if(!ok) wrong++;
  res.mutations.push({id, what, blockFails:fails, ok, findings:found.slice(0,6), exit:r.status});
  console.log((ok?"ok    ":"WRONG ")+id.padEnd(13)+(id==="none"?"the block passes":fails?"the block fails: "+found.slice(0,2).join(" | "):"the block passes (it should fail)"));
}
fs.rmSync(dir,{recursive:true,force:true});
console.log(wrong?wrong+" WRONG":"every mutation as it should be");
if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
if(wrong) process.exitCode=1;
