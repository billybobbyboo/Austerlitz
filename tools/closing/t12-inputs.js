#!/usr/bin/env node
/* The closing re-verification pass: ChatGPT's T12 (tools/stage8/mutate-8l.js "with the two-case report and both recorded motion reports") made
   again on this build's own CI reports. mutate-8l.js reads a report holding the cases ph8-overview-watch and plans-overview, and two motion
   records ({runs}: the self-test's page's and check:visual's). Its 8L inputs were 8L's own files (docs/stage8-evidence/8l/); here they are cut
   from this build's check:visual report and check:selftest report, unchanged: the report as it is, and each report's live.motion.runs.
   node tools/closing/t12-inputs.js <visual-report.json> <selftest-report.json> <out-dir>   Writes report.json, motion-selftest.json and
   motion-full.json into <out-dir>; then: node tools/stage8/mutate-8l.js <out-dir>/report.json <out-dir>/motion-selftest.json <out-dir>/motion-full.json */
"use strict";
const fs=require("fs"), path=require("path");
const [V,S,O]=process.argv.slice(2);
if(!V||!S||!O){ console.error("usage: t12-inputs.js <visual-report.json> <selftest-report.json> <out-dir>"); process.exit(2); }
const RV=JSON.parse(fs.readFileSync(V,"utf8")), RS=JSON.parse(fs.readFileSync(S,"utf8"));
["ph8-overview-watch","plans-overview"].forEach(n=>{ if(!RV.cases||!RV.cases[n]) throw new Error("the visual report has no case "+n); });
if(!RV.live||!RV.live.motion||!RS.live||!RS.live.motion) throw new Error("a report has no live motion block");
fs.mkdirSync(O,{recursive:true});
fs.writeFileSync(path.join(O,"report.json"),JSON.stringify(RV));
fs.writeFileSync(path.join(O,"motion-selftest.json"),JSON.stringify({runs:RS.live.motion.runs, md5:RS.md5, from:path.basename(S)}));
fs.writeFileSync(path.join(O,"motion-full.json"),JSON.stringify({runs:RV.live.motion.runs, md5:RV.md5, from:path.basename(V)}));
console.log("wrote "+O+": the report ("+Object.keys(RV.cases).length+" cases, md5 "+RV.md5+"), the self-test's motion runs "+RS.live.motion.runs.length+", check:visual's "+RV.live.motion.runs.length);
