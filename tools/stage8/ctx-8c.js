#!/usr/bin/env node
/* Stage 8, implementation PR 8C, the audit of 8B, finding A: check:contrast's start-up case "context-depth" (tools/visual/boot-check.js) on the
   build given, alone, its numbers printed and kept: the context lost and restored with the eye and the window still; the ground's depth drawn
   again or not, its texels against those before the loss, and the frame after the restore against the frame before (the figures hidden).
   --cases names other start-up cases to run with it (context-loss: the loss and restore with the page idle, then a clock step).
   node tools/stage8/ctx-8c.js [--cases context-depth,context-loss] [--json out.json]     (the build: AUSTERLITZ_HTML, else the repository's).
   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const BC=require("../visual/boot-check.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), CASES=(opt("--cases")||"context-depth").split(",");
(async()=>{
  const html=path.resolve(process.env.AUSTERLITZ_HTML||path.join(__dirname,"..","..","austerlitz-command-map.html"));
  const R=await BC.runBootCases(html,CASES);
  R.forEach(r=>console.log((r.ok?"PASS ":"FAIL ")+r.line));
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify({build:path.basename(html), results:R},null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
