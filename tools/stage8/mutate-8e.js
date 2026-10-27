#!/usr/bin/env node
/* Stage 8, implementation PR 8E (docs/STAGE8_SPEC.md section 17): do its checks fail when what they hold is broken? Each mutation replaces one
   string in a copy of the built page; on each copy one block of the self-test, read from the page's own source (from its opening comment to the
   next block's) and run with the self-test's helpers. The unmutated copy first: every check passes on it.
   node tools/stage8/mutate-8e.js [--only ids] [--json out.json]     (the build: AUSTERLITZ_HTML, else the repository's)
   Measurement code only: the copies are written to a temporary directory and nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ONLY=opt("--only")?opt("--only").split(","):null, OUT=opt("--json");
/* [id, what it breaks, the block it is judged by, [[from, to], ...]] */
const MUT=[
  ["none","nothing (the build as it is)","8d",[]],
  /* 8E's prerequisite (the audit of 8D): the envelope following the geometry and the definition */
  ["envonce","8D's behaviour: the envelope read once, when the mesh's bounds are first made, and kept whatever geometry it is given","8d",
    [["var t0=performance.now(), g=m.geometry, Pa=g.attributes.position, K=g.attributes.aPart||null; cl.env=animEnv(g);",
      "var t0=performance.now(), g=m.geometry, Pa=g.attributes.position, K=g.attributes.aPart||null; if(cl.env0===undefined) cl.env0=animEnv(g); cl.env=cl.env0;"]]],
  ["stale8d","8D's staleness test: the instances' version and count and the geometry's identity only (no attribute or definition compared)","8d",
    [["if(cl.ver!==o.instanceMatrix.version||cl.n!==o.count||cl.g!==o.geometry||cl.av!==ANIM.ver) return true;","if(cl.ver!==o.instanceMatrix.version||cl.n!==o.count||cl.g!==o.geometry) return true; return false;"]]],
  ["envcache8d","8D's envelope cache: one value per part attribute, whatever its version or the animation's definition","8d",
    [["if(c&&c.av===ANIM.ver&&c.P===Pa&&c.pv===Pa.version&&c.kv===K.version) return c.e;","if(c) return c.e;"]]]
];
const BLOCKS={
  "8d":["/* Stage 8, implementation PR 8D (decisions 249 (a), 244 (a), 250 (b); docs/STAGE8_SPEC.md section 16): the blocks culled","/* Stage 8, implementation PR 8C (decision 240 (a); docs/STAGE8_SPEC.md sections 3.4, 7.2 and 15)"]};
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
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-8e-")), browser=await L.launch(), res={build:path.basename(html0), md5:require("crypto").createHash("md5").update(src).digest("hex"), chromium:browser.version(), mutations:[]};
  for(const [id,what,blk,subs] of MUT){
    if(ONLY&&!ONLY.includes(id)) continue;
    let s=src; for(const [a,b] of subs){ if(s.split(a).length!==2) throw new Error(id+": the string to replace is not found exactly once: "+a.slice(0,80)); s=s.replace(a,()=>b); }
    const file=path.join(dir,id+".html"); fs.writeFileSync(file,s);
    process.env.AUSTERLITZ_HTML=file;
    const page=await L.open(browser,[1366,768],{}); await page.evaluate(()=>closeFirst(null));
    const st=await page.evaluate(BLOCK,BLOCKS[blk]); const errs=page._errors.slice(); await page.close();
    const failed=(st.checks||[]).filter(c=>!c.ok).map(c=>c.name.slice(0,110)+" | "+String(c.detail).slice(0,3000));
    const passed=(st.checks||[]).filter(c=>c.ok).map(c=>c.name.slice(0,110)+" | "+String(c.detail).slice(0,300));
    const R={id, what, block:blk, selfTest:st.error?st.error:{checks:(st.checks||[]).length, failed, passed, ms:st.ms}, pageErrors:errs};
    res.mutations.push(R);
    console.log("== "+id+": "+what+"\n   the self-test's "+blk+" block: "+(st.error||((st.checks||[]).length+" checks, "+failed.length+" failed, "+st.ms+" ms"))+
      (failed.length?"\n     - "+failed.join("\n     - "):"")+(id==="none"?"\n     + "+passed.join("\n     + "):"")+(errs.length?"\n   page errors: "+errs.slice(0,3).join(" | "):""));
    if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
  }
  await browser.close(); fs.rmSync(dir,{recursive:true,force:true});
})().catch(e=>{ console.error(e); process.exit(1); });
