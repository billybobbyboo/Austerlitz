#!/usr/bin/env node
/* Stage 8, the follow-up 8J: on builds in order, each on a page opened as the probes open it, the woods' trees and scrub by kind as the self-test
   counts them (world.trees, world.conifers, world.scrub userData.kinds: its WOODS8E pins) and the buildings' plans (BLDG) village by village (every
   part's rectangle, centre, half sides and turn, and its part's name); then each build against the one before: the villages whose plans changed and
   those identical. What a data task's woods do to the buildings, which keep clear of the woods' and the villages' trees.
   node tools/stage8/woods-bldg-8j.js <build> <build> [...] [--json out.json]   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path"), L=require("./lib.js");
const argv=process.argv.slice(2), oi=argv.indexOf("--json"), OUT=oi>=0?argv[oi+1]:null, FILES=argv.filter((a,i)=>a!=="--json"&&i!==oi+1);
const md5=f=>require("crypto").createHash("md5").update(fs.readFileSync(f)).digest("hex");
(async()=>{
  const browser=await L.launch(), res={tool:"tools/stage8/woods-bldg-8j.js", builds:[]};
  for(const f of FILES){ process.env.AUSTERLITZ_HTML=path.resolve(f); const page=await L.open(browser,[1280,720]);
    const r=await page.evaluate(()=>{ var K={}; world.trees.children.forEach(function(im){ (im.userData.kinds||[]).forEach(function(k){ K[k]=(K[k]||0)+1; }); });
      K.conifer=0; world.conifers.children.forEach(function(im){ K.conifer+=(im.userData.kinds||[]).length; }); (world.scrub.userData.kinds||[]).forEach(function(k){ K[k]=(K[k]||0)+1; });
      var by={}; (BLDG||[]).forEach(function(b){ var R=b.R||{}, key=[R.x,R.z,R.a,R.b,R.t].map(function(q){ return typeof q==="number"?q.toFixed(3):String(q); }).join(",")+"|"+b.part; (by[b.village||"?"]=by[b.village||"?"]||[]).push(key); });
      Object.keys(by).forEach(function(v){ by[v].sort(); }); return {woods:K, parts:(BLDG||[]).length, villages:by}; });
    res.builds.push({file:path.basename(f), md5:md5(f), woods:r.woods, parts:r.parts, villages:r.villages, errors:(page._errors||[]).slice()}); await page.close();
    console.log(path.basename(f)+": woods "+JSON.stringify(r.woods)+", "+r.parts+" building parts"); }
  await browser.close();
  for(let i=1;i<res.builds.length;i++){ const A=res.builds[i-1].villages, B=res.builds[i].villages, vs=[...new Set(Object.keys(A).concat(Object.keys(B)))].sort(), ch=[], same=[];
    vs.forEach(v=>{ const a=(A[v]||[]).join(";"), b=(B[v]||[]).join(";"); if(a===b) same.push(v); else ch.push(v+" ("+(A[v]||[]).length+" to "+(B[v]||[]).length+" parts)"); });
    res["diff"+i]={from:res.builds[i-1].file, to:res.builds[i].file, changed:ch, identical:same};
    console.log(res.builds[i-1].file+" -> "+res.builds[i].file+": changed "+ch.length+": "+(ch.join(", ")||"none")+"; identical "+same.length); }
  res.builds.forEach(b=>{ delete b.villages; });
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
