#!/usr/bin/env node
/* Stage 8, implementation PR 8D (docs/STAGE8_SPEC.md section 16): do its checks fail when what they hold is broken? Each mutation replaces one
   string in a copy of the built page; on each copy the self-test's 8D block (culling and the hooks), read from the page's own source (from its
   opening comment to the 8C block's) and run with the self-test's helpers, and for the prerequisite's mutation the 8C block (the map layer in
   motion, from its opening comment to "11. render on demand"). The unmutated copy first: every check passes on it.
   node tools/stage8/mutate-8d.js [--only ids] [--json out.json]     (the build: AUSTERLITZ_HTML, else the repository's)
   Measurement code only: the copies are written to a temporary directory and nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ONLY=opt("--only")?opt("--only").split(","):null, OUT=opt("--json");
/* [id, what it breaks, the block it is judged by, [[from, to], ...]] */
const MUT=[
  ["none","nothing (the build as it is)","8d",[]],
  ["r128","r128's own frustum test for the blocks' meshes: the geometry's sphere at the mesh's origin (one instance's), not the mesh's own bounds","8d",
    [["return cl?cullTest(this,o,cl):r128.call(this,o);","return r128.call(this,o);"]]],
  ["half","the bounds undersized: their radius halved","8d",[["cl.s.radius=n>0?R:-1;","cl.s.radius=n>0?R*0.5:-1;"]]],
  ["noenv","the bounds without the animation's envelope","8d",[["rr=G.r+cl.env;","rr=G.r;"]]],
  ["stale","the bounds never refreshed after their first computation (no invalidation)","8d",
    [["if(cl.ver!==o.instanceMatrix.version||cl.n!==o.count||cl.g!==o.geometry) cullRefresh(o,cl);","if(cl.ver===-1) cullRefresh(o,cl);"]]],
  ["camonly","camera-only culling: the shadow pass tested against the eye's frustum, so a block out of view casts no shadow","8d",
    [["var r=fr.intersectsSphere(_cullS); if(!r) CULL.frame.culled++;",
      "camera.updateMatrixWorld(); var r=(window.__eyeF8||(window.__eyeF8=new THREE.Frustum())).setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse)).intersectsSphere(_cullS); if(!r) CULL.frame.culled++;"]]],
  ["nodepthhook","the kit's depth material without the hook (the shadow cast at rest whatever the pose)","8d",[["m.customDepthMaterial=d; return true;","return true;"]]],
  ["novishook","the kit's own material without the hook (the figures drawn at rest whatever the pose)","8d",[["m.material.userData.anim=U; m.material.onBeforeCompile=animHook;","m.material.userData.anim=U;"]]],
  ["noprot","the prerequisite undone: a protected item (focus, selection, hover) faded in like the rest","8c",[["prot=it.keep||it.forced||it.el===foc;","prot=false;"]]]
];
const BLOCKS={
  "8d":["/* Stage 8, implementation PR 8D (decisions 249 (a), 244 (a), 250 (b); docs/STAGE8_SPEC.md section 16): the blocks culled","/* Stage 8, implementation PR 8C (decision 240 (a); docs/STAGE8_SPEC.md sections 3.4, 7.2 and 15)"],
  "8c":["/* Stage 8, implementation PR 8C (decision 240 (a); docs/STAGE8_SPEC.md sections 3.4, 7.2 and 15)","/* 11. render on demand */"]};
/* a self-test block, in the page */
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
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-8d-")), browser=await L.launch(), res={build:path.basename(html0), md5:require("crypto").createHash("md5").update(src).digest("hex"), chromium:browser.version(), mutations:[]};
  for(const [id,what,blk,subs] of MUT){
    if(ONLY&&!ONLY.includes(id)) continue;
    let s=src; for(const [a,b] of subs){ if(s.split(a).length!==2) throw new Error(id+": the string to replace is not found exactly once: "+a.slice(0,80)); s=s.replace(a,()=>b); }
    const file=path.join(dir,id+".html"); fs.writeFileSync(file,s);
    process.env.AUSTERLITZ_HTML=file;
    const page=await L.open(browser,[1366,768],{}); await page.evaluate(()=>closeFirst(null));
    const st=await page.evaluate(BLOCK,BLOCKS[blk]); const errs=page._errors.slice(); await page.close();
    const failed=(st.checks||[]).filter(c=>!c.ok).map(c=>c.name.slice(0,110)+" | "+String(c.detail).slice(0,260));
    const passed=(st.checks||[]).filter(c=>c.ok).map(c=>c.name.slice(0,110)+" | "+String(c.detail).slice(0,260));
    const R={id, what, block:blk, selfTest:st.error?st.error:{checks:(st.checks||[]).length, failed, passed, ms:st.ms}, pageErrors:errs};
    res.mutations.push(R);
    console.log("== "+id+": "+what+"\n   the self-test's "+blk+" block: "+(st.error||((st.checks||[]).length+" checks, "+failed.length+" failed, "+st.ms+" ms"))+
      (failed.length?"\n     - "+failed.join("\n     - "):"")+(id==="none"?"\n     + "+passed.join("\n     + "):"")+(errs.length?"\n   page errors: "+errs.slice(0,3).join(" | "):""));
    if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
  }
  await browser.close(); fs.rmSync(dir,{recursive:true,force:true});
})().catch(e=>{ console.error(e); process.exit(1); });
