#!/usr/bin/env node
/* Stage 8, implementation PR 8F (docs/STAGE8_SPEC.md section 18): do its checks fail when what they hold is broken? Each mutation replaces one
   string in a copy of the built page; on each copy the self-test's 8F block, read from the page's own source (from its opening comment to the
   self-test's restore of the saved state), is run with the self-test's helpers. The unmutated copy first: every check passes on it.
   node tools/stage8/mutate-8f.js [--only ids] [--json out.json] [--check]     (the build: AUSTERLITZ_HTML, else the repository's; --check: only
   that every mutation's strings stand exactly once in the build)
   The near detail's setting on a low tier is not among them: the self-test's page (1366 x 768) is never low, so css-test.js holds it
   (tools/stage8/mutate-css-8f.js's detaillow).
   Measurement code only: the copies are written to a temporary directory and nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ONLY=opt("--only")?opt("--only").split(","):null, OUT=opt("--json");
/* [id, what it breaks, [[from, to], ...]] */
const MUT=[
  ["none","nothing (the build as it is)",[]],
  ["paperwater","the paper map's water drawn with the landscape's materials",[["  var S=staff?WATER_MATS.paper:WATER_MATS.land;","  var S=WATER_MATS.land;"]]],
  ["paperstream","the paper map's streams in the landscape's colour",[["stream:new THREE.MeshStandardMaterial({color:lin(WATER_COL.stream),roughness:0.48,metalness:0.0,envMapIntensity:0.18,side:THREE.DoubleSide})}};","stream:new THREE.MeshStandardMaterial({color:lin(WATER_COL.streamLand),roughness:0.48,metalness:0.0,envMapIntensity:0.18,side:THREE.DoubleSide})}};"]]],
  ["hardring","the shore ice a hard ring (its band not feathered)",[["diffuseColor.a*=smoothstep(0.0,\"+glslF(ICE.band[0])+\",iT)*(1.0-smoothstep(\"+glslF(ICE.band[1])+\",1.0,iT));","diffuseColor.a*=1.0;"]]],
  ["brightrim","the rimed margin as bright as Part A's prototype (#A9B3B7)",[["iceFrost:0x5E6664","iceFrost:0xA9B3B7"],["iceBand:0x5A615E","iceBand:0xA9B3B7"]]],
  ["firstrim","the rimed margin as 8F first drew it (0x7C8686, its band 0x737C79)",[["iceFrost:0x5E6664","iceFrost:0x7C8686"],["iceBand:0x5A615E","iceBand:0x737C79"]]],
  ["polyoffset","the shore band drawn with a polygon offset (8F's first way against z-fighting: over the ground at the shore)",[["    transparent:true,opacity:0.96}),true);","    transparent:true,opacity:0.96,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-4}),true);"]]],
  ["depthwrite","the landscape's ice writing its depth (8E's; the band fights it for the pixel)",[["transparent:true,opacity:0.96,depthWrite:false}),false);","transparent:true,opacity:0.96}),false);"]]],
  ["renderorder","the shore band sorted with its ice (8E's order: an eye looking up draws the band first)",[["    r.renderOrder=1;","    r.renderOrder=0;"]]],
  ["flow","the streams animated (their tone moved a little in every frame drawn)",[["  tickClock(dt);","  tickClock(dt); if(WATER_MATS) WATER_MATS.land.stream.color.offsetHSL(0,0,0.002);"]]],
  ["treecount","a wood thinned: its trees fewer than 8E's",[["for(var i=0;i<wd.n;i++){","for(var i=0;i<Math.round(wd.n*0.9);i++){"]]],
  ["treetris","a deciduous habit heavier than 8E's (its shells closed again)",[["broad:HAB.map(function(h,vi){ var P=[]; treeLimbs(P,h,vi); h.cr.forEach(function(C){ treeShell(P,C[0],C[1],C[2],TREE8F.keep,TREE8F.shrink); }); return treeGeo(P); }),","broad:HAB.map(function(h,vi){ var P=[]; treeLimbs(P,h,vi); h.cr.forEach(function(C){ treeShell(P,C[0],C[1],C[2],1.0,1.0); }); return treeGeo(P); }),"]]],
  ["treeside","the open crowns drawn on their front faces only",[["matte({color:0xFFFFFF,flatShading:true,side:THREE.DoubleSide}),Math.max(1,list.length));   /* 8F: both faces (the open shells) */","matte({color:0xFFFFFF,flatShading:true}),Math.max(1,list.length));"]]],
  ["detailfar","the near detail reaching beyond its far edge",[["float gDf=uDetail.x*(1.0-smoothstep(uDetail.y,uDetail.z,length(vViewPosition)));","float gDf=uDetail.x;"]]],
  ["detailpaper","the near detail on the paper map's ground too (its guard, its texture's absence there and the fade all gone: the paper map's eye is always beyond the fade's far edge)",[["  if(uMode>0.5&&uMode<1.5&&uDetail.x>0.0){","  if(uDetail.x>0.0){"],["m.map=(name===\"paper\")?null:m.userData.grain;","m.map=m.userData.grain;"],["float gDf=uDetail.x*(1.0-smoothstep(uDetail.y,uDetail.z,length(vViewPosition)));","float gDf=uDetail.x;"]]],
  ["detailtone","the near detail darkening the ground (its sample not over its cell's mean)",[["float gDl=dot(gDc,vec3(0.2126,0.7152,0.0722))/max(uCellLum[int(gCell+0.5)],0.001);","float gDl=dot(gDc,vec3(0.2126,0.7152,0.0722))/max(uCellLum[int(gCell+0.5)],0.001)*0.85;"]]],
  ["lumflip","the near detail normalised by the canvas's cells as laid out, not as the shader samples them (three's flip ignored)",[["cy=(flip?2-Math.floor(k/4):Math.floor(k/4))*R,","cy=Math.floor(k/4)*R,"]]],
  ["detailoff","the near detail never drawn",[["function groundDetail(on){ if(groundMesh&&groundMesh.material.userData.U) groundMesh.material.userData.U.uDetail.value.x=on?GDETAIL.amount:0; }","function groundDetail(on){ if(groundMesh&&groundMesh.material.userData.U) groundMesh.material.userData.U.uDetail.value.x=0; }"]]]
];
const F8="/* Stage 8, implementation PR 8F (decisions 246 (a), 247 (a); docs/STAGE8_SPEC.md sections 5, 7.3, 7.4 and 18): water, woods and the near",
  END="    if(mode!==save.mode) setMode(save.mode);";
/* the self-test's 8F block, in the page */
const BLOCK=function(m){
  var src=[].map.call(document.scripts,function(s){ return s.textContent; }).join("\n");
  var a=src.indexOf(m[0]), b=src.indexOf(m[1],a+10);
  if(a<0||b<0) return {error:"the self-test's block not found"};
  var out=[], ck=function(n,ok,d){ out.push({name:n,ok:!!ok,detail:d}); };
  var fin=function(){ var n=0; if(tween) mlReset("tween ended at once"); while(tween&&n<4){ tween(performance.now()+1e7); n++; } };
  var t0=performance.now();
  try{ new Function("ck","settle","finishTween","placeCamera",src.slice(a,b))(ck,AUSTERLITZ_DEBUG.settle,fin,AUSTERLITZ_DEBUG.placeCamera); }
  catch(e){ out.push({name:"the block ran",ok:false,detail:"threw: "+e.message}); }
  return {checks:out, ms:Math.round(performance.now()-t0)};
};
(async()=>{
  const html0=path.resolve(process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html")), src=fs.readFileSync(html0,"utf8");
  if(argv.includes("--check")){ let bad=0; for(const [id,,subs] of MUT) for(const [a] of subs){ const n=src.split(a).length-1; if(n!==1){ bad++; console.log(id+": found "+n+" times: "+a.slice(0,90)); } }
    console.log(bad?bad+" strings not found exactly once":"every mutation's strings stand exactly once ("+MUT.length+" mutations)"); process.exitCode=bad?1:0; return; }
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-8f-")), browser=await L.launch(), res={build:path.basename(html0), md5:require("crypto").createHash("md5").update(src).digest("hex"), chromium:browser.version(), mutations:[]};
  let wrong=0;
  for(const [id,what,subs] of MUT){
    if(ONLY&&!ONLY.includes(id)) continue;
    let s=src; for(const [a,b] of subs){ if(s.split(a).length!==2) throw new Error(id+": the string to replace is not found exactly once: "+a.slice(0,80)); s=s.replace(a,()=>b); }
    const file=path.join(dir,id+".html"); fs.writeFileSync(file,s);
    process.env.AUSTERLITZ_HTML=file;
    const page=await L.open(browser,[1366,768],{}); await page.evaluate(()=>closeFirst(null));
    const st=await page.evaluate(BLOCK,[F8,END]); const errs=page._errors.slice(); await page.close();
    const failed=(st.checks||[]).filter(c=>!c.ok).map(c=>c.name.slice(0,110)+" | "+String(c.detail).slice(0,+(process.env.MUT_DETAIL||600)));
    const passed=(st.checks||[]).filter(c=>c.ok).map(c=>c.name.slice(0,110)+" | "+String(c.detail).slice(0,+(process.env.MUT_DETAIL||600)));
    const ok=id==="none"?!st.error&&(st.checks||[]).length>0&&!failed.length:!!(st.error||failed.length);
    if(!ok) wrong++;
    res.mutations.push({id, what, ok, selfTest:st.error?st.error:{checks:(st.checks||[]).length, failed, passed, ms:st.ms}, pageErrors:errs});
    console.log((ok?"ok    ":"WRONG ")+"== "+id+": "+what+"\n   the 8F block: "+(st.error||((st.checks||[]).length+" checks, "+failed.length+" failed, "+st.ms+" ms"))+
      (failed.length?"\n     - "+failed.join("\n     - "):"")+(id==="none"?"\n     + "+passed.join("\n     + "):"")+(errs.length?"\n   page errors: "+errs.slice(0,3).join(" | "):""));
    if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
  }
  await browser.close(); fs.rmSync(dir,{recursive:true,force:true});
  console.log(wrong?wrong+" WRONG":"every mutation as it should be");
  if(wrong) process.exitCode=1;
})().catch(e=>{ console.error(e); process.exit(1); });
