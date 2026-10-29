#!/usr/bin/env node
/* Stage 8, implementation PR 8G (docs/STAGE8_SPEC.md section 19): do its checks fail when what they hold is broken? Each mutation replaces one
   or more strings in a copy of the built page; on each copy the self-test's block named by the mutation (read from the page's own source, from
   its opening comment to the next block's or the self-test's restore of the saved state) is run with the self-test's helpers. The unmutated
   copy first: every check of every block passes on it.
   node tools/stage8/mutate-8g.js [--only ids] [--json out.json] [--check]     (the build: AUSTERLITZ_HTML, else the repository's; --check: only
   that every mutation's strings stand exactly once in the build)
   Measurement code only: the copies are written to a temporary directory and nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ONLY=opt("--only")?opt("--only").split(","):null, OUT=opt("--json");
/* the self-test's blocks this tool runs, by their opening comments' first words */
const BLOCKS={
  pre1:"    /* Stage 8, implementation PR 8G's prerequisite 1 (the audit of 8F; docs/STAGE8_SPEC.md section 19.1): the ground's atlas"
};
const END="    if(mode!==save.mode) setMode(save.mode);";
/* [id, the block, what it breaks, [[from, to], ...]] */
const MUT=[
  ["none","pre1","nothing (the build as it is)",[]],
  ["atlas8f","pre1","8F's atlas: both uploaded flipped, the photographs' normals as they came (their green unturned)",[["_atlas.flipY=false;","_atlas.flipY=true;"],["_nrmAtlas.flipY=false;","_nrmAtlas.flipY=true;"],["(255-ph[p+1])*w","ph[p+1]*w"]]],
  ["colourflip","pre1","the colour atlas alone uploaded flipped",[["_atlas.flipY=false;","_atlas.flipY=true;"]]],
  ["normalflip","pre1","the normal atlas alone uploaded flipped",[["_nrmAtlas.flipY=false;","_nrmAtlas.flipY=true;"]]],
  ["greenunturned","pre1","the photographs' normals blended in with their green unturned (two conventions in one atlas)",[["(255-ph[p+1])*w","ph[p+1]*w"]]],
  ["normalsign","pre1","the patterns' normals painted with their green turned the other way (the relief lit from the wrong side)",[["var nx=-(hR-hL)*s, ny=-(hU-hD)*s, nz=1.0;","var nx=-(hR-hL)*s, ny=(hU-hD)*s, nz=1.0;"]]],
  ["cellrow","pre1","the shader's rows of cells exchanged (8F's cells without its flip)",[["float ci=mod(gCell,4.0), cj=floor(gCell/4.0);","float ci=mod(gCell,4.0), cj=2.0-floor(gCell/4.0);"]]],
  ["tuvflip","pre1","the shader's sample of a cell upside down (v from the cell's foot)",[["fract(vUv.y)*0.3125+0.0104167+cj*0.3333333);","(1.0-fract(vUv.y))*0.3125+0.0104167+cj*0.3333333);"]]],
  ["detailrow","pre1","the near detail sampling another row's cell",[["fract(gDu.y)*0.3125+0.0104167+cj*0.3333333)","fract(gDu.y)*0.3125+0.0104167+(2.0-cj)*0.3333333)"]]],
  ["detailflip","pre1","the near detail's sample upside down",[["fract(gDu.y)*0.3125+0.0104167+cj*0.3333333)","(1.0-fract(gDu.y))*0.3125+0.0104167+cj*0.3333333)"]]]
];
/* the block, in the page: from its marker to the next block's marker or END */
const BLOCK=function(m){
  var src=[].map.call(document.scripts,function(s){ return s.textContent; }).join("\n");
  var a=src.indexOf(m.start); if(a<0) return {error:"the self-test's block not found"};
  var b=src.indexOf(m.end,a+10); m.others.forEach(function(o){ var c=src.indexOf(o,a+10); if(c>0&&c<b) b=c; });
  if(b<0) return {error:"the block's end not found"};
  var out=[], ck=function(n,ok,d){ out.push({name:n,ok:!!ok,detail:d}); };
  var fin=function(){ var n=0; if(tween) mlReset("tween ended at once"); while(tween&&n<4){ tween(performance.now()+1e7); n++; } };
  var t0=performance.now();
  try{ new Function("ck","settle","finishTween","placeCamera",src.slice(a,b)+(m.call||""))(ck,AUSTERLITZ_DEBUG.settle,fin,AUSTERLITZ_DEBUG.placeCamera); }
  catch(e){ out.push({name:"the block ran",ok:false,detail:"threw: "+e.message}); }
  return {checks:out, ms:Math.round(performance.now()-t0)};
};
(async()=>{
  const html0=path.resolve(process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html")), src=fs.readFileSync(html0,"utf8");
  if(argv.includes("--check")){ let bad=0; for(const [id,,,subs] of MUT) for(const [a] of subs){ const n=src.split(a).length-1; if(n!==1){ bad++; console.log(id+": found "+n+" times: "+a.slice(0,90)); } }
    console.log(bad?bad+" strings not found exactly once":"every mutation's strings stand exactly once ("+MUT.length+" mutations)"); process.exitCode=bad?1:0; return; }
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-8g-")), browser=await L.launch(), res={build:path.basename(html0), md5:require("crypto").createHash("md5").update(src).digest("hex"), chromium:browser.version(), mutations:[]};
  let wrong=0;
  for(const [id,blk,what,subs] of MUT){
    if(ONLY&&!ONLY.includes(id)) continue;
    let s=src; for(const [a,b] of subs){ if(s.split(a).length!==2) throw new Error(id+": the string to replace is not found exactly once: "+a.slice(0,80)); s=s.replace(a,()=>b); }
    const file=path.join(dir,id+".html"); fs.writeFileSync(file,s);
    process.env.AUSTERLITZ_HTML=file;
    const page=await L.open(browser,[1366,768],{}); await page.evaluate(()=>closeFirst(null)); await page.waitForTimeout(3000);   /* the photographs painted */
    const st=await page.evaluate(BLOCK,{start:BLOCKS[blk], end:END, others:Object.keys(BLOCKS).filter(k=>k!==blk).map(k=>BLOCKS[k])}); const errs=page._errors.slice(); await page.close();
    const failed=(st.checks||[]).filter(c=>!c.ok).map(c=>c.name.slice(0,110)+" | "+String(c.detail).slice(0,+(process.env.MUT_DETAIL||600)));
    const passed=(st.checks||[]).filter(c=>c.ok).map(c=>c.name.slice(0,110)+" | "+String(c.detail).slice(0,+(process.env.MUT_DETAIL||600)));
    const ok=/^none/.test(id)?!st.error&&(st.checks||[]).length>0&&!failed.length:!!(st.error||failed.length);
    if(!ok) wrong++;
    res.mutations.push({id, block:blk, what, ok, selfTest:st.error?st.error:{checks:(st.checks||[]).length, failed, passed, ms:st.ms}, pageErrors:errs});
    console.log((ok?"ok    ":"WRONG ")+"== "+id+" ("+blk+"): "+what+"\n   the block: "+(st.error||((st.checks||[]).length+" checks, "+failed.length+" failed, "+st.ms+" ms"))+
      (failed.length?"\n     - "+failed.join("\n     - "):"")+(/^none/.test(id)?"\n     + "+passed.join("\n     + "):"")+(errs.length?"\n   page errors: "+errs.slice(0,3).join(" | "):""));
    if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
  }
  await browser.close(); fs.rmSync(dir,{recursive:true,force:true});
  console.log(wrong?wrong+" WRONG":"every mutation as it should be");
  if(wrong) process.exitCode=1;
})().catch(e=>{ console.error(e); process.exit(1); });
