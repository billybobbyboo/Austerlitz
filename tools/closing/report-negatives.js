#!/usr/bin/env node
/* The closing re-verification pass: ChatGPT's T13 (docs/FINAL_AUDIT_POST_STAGE8_CHATGPT.md: "five independent mutations of the current full
   report: missing case, no cases, missing self-test check, console error, missing live motion"; its script was not kept, only its record,
   docs/final-audit-chatgpt-evidence/report-negative-controls.json), made again on this build's own check:visual report: the report judged as it
   is by tools/visual/thresholds.js judgeReport (as check-report.js judges it: every case of cases.js, the self-test against its manifest), then
   each of the five mutations applied to a copy and judged; a mutation is caught when judgeReport returns a failure naming what it removed or added.
   No app or report file is changed.   node tools/closing/report-negatives.js <report.json> [--json out.json] */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(__dirname,"..",".."), T=require(path.join(ROOT,"tools","visual","thresholds.js")), CASES=require(path.join(ROOT,"tools","visual","cases.js"));
const argv=process.argv.slice(2), OUT=argv.includes("--json")?argv[argv.indexOf("--json")+1]:null, rp=argv.find((a,i)=>a.endsWith(".json")&&argv[i-1]!=="--json");
const R=JSON.parse(fs.readFileSync(rp,"utf8")), MAN=JSON.parse(fs.readFileSync(path.join(ROOT,"tools","visual","selftest-manifest.json"),"utf8"));
const clone=o=>JSON.parse(JSON.stringify(o)), judge=r=>T.judgeReport(r,{cases:CASES,allCases:CASES,manifest:MAN,legacy:false});
const out={report:path.basename(rp), md5:R.md5, asIs:null, mutations:[]};
const base=judge(R); out.asIs=base; console.log("as measured: "+(base.length?base.length+" failures: "+base.slice(0,4).join(" | "):"no failure"));
const MUT=[
  ["one missing visual case", r=>{ delete r.cases["overview-field"]; }, /case overview-field not measured/],
  ["all visual cases missing", r=>{ r.cases={}; }, /not measured \(T-4\)/],
  ["missing self-test check", r=>{ r.selfTest.checks.splice(5,1); }, /self-test|manifest/i],
  ["added console error", r=>{ (r.console=r.console||[]).push({page:"main",at:"the closing pass's control",type:"error",text:"Uncaught TypeError: the closing pass's control"}); }, /closing pass's control/],
  ["missing live motion block", r=>{ delete r.live.motion; }, /motion/i]
];
MUT.forEach(([name,f,want])=>{ const r=clone(R); f(r); const fails=judge(r).filter(x=>!base.includes(x)), hit=fails.some(x=>want.test(x));
  out.mutations.push({name,caught:hit,failures:fails.slice(0,40),n:fails.length});
  console.log((hit?"caught ":"MISSED ")+name+": "+fails.length+" failures"+(fails.length?", e.g. "+(fails.find(x=>want.test(x))||fails[0]):"")); });
const ok=!base.length&&out.mutations.every(m=>m.caught);
console.log(ok?"the report passes as measured and every mutation is caught":"NOT every control holds");
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
process.exit(ok?0:1);
