#!/usr/bin/env node
/* Stage 8, implementation PR 8H (docs/FINAL_AUDIT.md P-4; docs/STAGE8_SPEC.md section 20.7): the start's cost, measured over repeated loads.
   Each build loaded --loads times on a fresh page as a visitor's (no ?harness=1; software WebGL, 1600 x 900), the loads of the builds
   interleaved so that the machine's state falls on both alike: the page's own Navigation Timing (DOM ready, the load event); the first frame
   drawn (BOOTMS.firstFrameAt where the build has 8H's marks, else the moment the start-up guard reports done, polled every 20 ms); 8H's phases
   (BOOTMS: the renderer, the world and its parts, WORLDMS: the land cover's and the relief's grids, the cover's multi-level grid, the ground,
   water, roads, settlements, woods; the formations, the interface, the state, init's whole); and on every build, after the start, the two
   grids made again five times (buildCover, buildGrid: warm, the median), the relief grid's cost the audit asked to re-measure (2E's +0.45 s).
   Medians and 95th percentiles over the loads, never one load.
   node tools/stage8/startup-8h.js --builds 8g=<html>,8h=<html> [--loads 7] [--out file.json]
   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), TR=require("../visual/three-route.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const BUILDS=(opt("--builds")||("now="+path.join(L.ROOT,"austerlitz-command-map.html"))).split(",").map(s=>{ const i=s.indexOf("="); return {tag:s.slice(0,i), file:path.resolve(s.slice(i+1))}; });
const LOADS=+(opt("--loads")||7), OUT=opt("--out");
const md5=f=>require("crypto").createHash("md5").update(fs.readFileSync(f)).digest("hex");
const q=(xs,p)=>{ const s=xs.filter(x=>x!=null&&isFinite(x)).sort((a,b)=>a-b); if(!s.length) return null; return +s[Math.min(s.length-1,Math.floor(p*(s.length-1)+0.5))].toFixed(1); };
async function one(browser,html){
  const ctx=await browser.newContext({viewport:{width:1600,height:900},deviceScaleFactor:1}), page=await ctx.newPage();
  await page.addInitScript(()=>{ window.__done=null; (function poll(){ try{ if(window.AUS_BOOT&&AUS_BOOT.done&&window.__done===null) window.__done=performance.now(); }catch(e){} if(window.__done===null) setTimeout(poll,20); })(); });
  await TR.routeThree(page);
  await page.goto("file://"+html,{waitUntil:"commit",timeout:180000}); await TR.waitBoot(page,240000,250);
  await page.waitForFunction(()=>window.__done!==null||(typeof BOOTMS!=="undefined"&&BOOTMS.firstFrameAt!==undefined),null,{timeout:120000}).catch(()=>{});
  const r=await page.evaluate(()=>{ var n=performance.getEntriesByType("navigation")[0]||{}, B=typeof BOOTMS!=="undefined"?JSON.parse(JSON.stringify(BOOTMS)):null;
    var warm={cover:[],grid:[]}; for(var i=0;i<5;i++){ var a=performance.now(); buildCover(); var b=performance.now(); buildGrid(); var c=performance.now(); warm.cover.push(b-a); warm.grid.push(c-b); }
    warm.cover.sort(function(x,y){ return x-y; }); warm.grid.sort(function(x,y){ return x-y; });
    return {domReady:n.domContentLoadedEventEnd, load:n.loadEventEnd, firstFrame:B&&B.firstFrameAt!==undefined?B.firstFrameAt:window.__done, boot:B, warmCover:warm.cover[2], warmGrid:warm.grid[2]}; });
  await ctx.close(); return r;
}
(async()=>{
  const browser=await L.launch(), out={tool:"tools/stage8/startup-8h.js", chromium:browser.version(), loads:LOADS, builds:{}};
  BUILDS.forEach(B=>{ out.builds[B.tag]={file:path.relative(L.ROOT,B.file)||B.file, md5:md5(B.file), runs:[]}; });
  for(let i=0;i<LOADS;i++) for(const B of (i%2?BUILDS.slice().reverse():BUILDS)){ const r=await one(browser,B.file); out.builds[B.tag].runs.push(r);
    console.log(B.tag+" load "+(i+1)+": first frame "+Math.round(r.firstFrame)+" ms, load event "+Math.round(r.load)+" ms"+(r.boot?", init "+r.boot.init+" ms (world "+r.boot.world+")":"")+", warm grids "+r.warmCover.toFixed(1)+" + "+r.warmGrid.toFixed(1)+" ms"); }
  await browser.close();
  for(const tag of Object.keys(out.builds)){ const R=out.builds[tag].runs, S={};
    ["domReady","load","firstFrame","warmCover","warmGrid"].forEach(k=>{ S[k]={median:q(R.map(r=>r[k]),0.5), p95:q(R.map(r=>r[k]),0.95)}; });
    if(R[0].boot){ ["renderer","world","formations","ui","state","init"].forEach(k=>{ S["init:"+k]={median:q(R.map(r=>r.boot[k]),0.5), p95:q(R.map(r=>r.boot[k]),0.95)}; });
      Object.keys(R[0].boot.worldParts||{}).forEach(k=>{ S["world:"+k]={median:q(R.map(r=>r.boot.worldParts[k]),0.5), p95:q(R.map(r=>r.boot.worldParts[k]),0.95)}; }); }
    out.builds[tag].summary=S; console.log(tag+" "+JSON.stringify(S)); }
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(out,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
