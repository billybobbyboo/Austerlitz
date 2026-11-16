#!/usr/bin/env node
/* UI/UX roadmap step 3: framing.js over a list of runs, three at a time (the machine's four cores, one left). Each line of the list:
   <tag> <framing.js's arguments after the build>; a line's --set takes a JSON object without spaces. --tool names another probe taking the
   same <build> --out --tag arguments (tools/ux-step2/probe.js: Step 2's acceptance runs, re-measured on step 3's builds).
   node tools/ux-step3/sweep.js <build.html> <out dir> <list file> [--jobs 3] [--tool tools/ux-step2/probe.js] */
"use strict";
const fs=require("fs"), path=require("path"), { spawn }=require("child_process");
const [B,O,LIST]=process.argv.slice(2), A=process.argv, J=A.indexOf("--jobs")>0?+A[A.indexOf("--jobs")+1]:3, TOOL=A.indexOf("--tool")>0?path.resolve(A[A.indexOf("--tool")+1]):path.join(__dirname,"framing.js");
fs.mkdirSync(O,{recursive:true});
const runs=fs.readFileSync(LIST,"utf8").split("\n").map(s=>s.trim()).filter(s=>s&&!s.startsWith("#")).map(s=>s.split(/\s+/));
let i=0, live=0;
function next(){ if(i>=runs.length){ return; } const [tag,...args]=runs[i++]; live++;
  const out=fs.openSync(path.join(O,tag+".log"),"w");
  const c=spawn(process.execPath,[TOOL,B,"--out",O,"--tag",tag,...args],{stdio:["ignore",out,out]});
  c.on("exit",code=>{ live--; const t=fs.readFileSync(path.join(O,tag+".log"),"utf8").trim().split("\n").pop(); console.log((code?"[exit "+code+"] ":"")+t.slice(0,800)); next(); }); }
for(let k=0;k<J;k++) next();
