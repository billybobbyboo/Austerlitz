#!/usr/bin/env node
/* The final audits' Stage 7, WP-12: the device route run quick on this tree's build (tools/step6/perf-local.js, the console way, the overview and
   Play at half speed only) and its report checked (route-check.js). Used by tools/final-stage7/mutate.js's wp12 controls.
   node tools/final-stage7/route-selfcheck.js [--phone] */
"use strict";
const cp=require("child_process"), path=require("path"), os=require("os"), fs=require("fs");
const ROOT=path.resolve(__dirname,"..",".."), out=path.join(fs.mkdtempSync(path.join(os.tmpdir(),"route-")),"r.json"), phone=process.argv.includes("--phone");
const args=[path.join(ROOT,"tools","step6","perf-local.js"),"--quick","--json",out].concat(phone?["--way","frame","--device","iphone","--phone"]:["--way","paste","--only","overview,play-half"]);
cp.execFileSync("node",args,{cwd:ROOT,stdio:"inherit",timeout:1800000});
cp.execFileSync("node",[path.join(__dirname,"route-check.js"),out],{stdio:"inherit"});
