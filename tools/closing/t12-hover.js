#!/usr/bin/env node
/* The closing re-verification pass: ChatGPT's T12, the one control of tools/stage8/mutate-8l.js that this build's own records leave vacuous.
   mutate-8l.js's "a run by real input hovering other than its twin" sets the paper zoom's real-input run's hover to null and expects
   thresholds.js checkLive's "its pointer hovers nothing, its twin's constantine". On 8L's records the twin with the pointer hovered Constantine's
   counter; on this build's (check:visual's and check:selftest's of run 43524457649) both the real run and its twin hover nothing, so that
   mutation changes nothing and nothing can fail. The same intent, a real-input run hovering other than its twin, made on these records by the
   two other ways round: the twin hovering Constantine and the real run nothing (mutate-8l.js's own expected message), and the real run hovering
   Constantine and the twin nothing. Each on both blocks. Judged as mutate-8l.js judges (checkLive, legacy, the 16's two ceilings set aside).
   node tools/closing/t12-hover.js <motion-selftest.json> <motion-full.json> [--json out.json]   (exit 1 if any control is missed)
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.join(__dirname,"..",".."), TH=require(path.join(ROOT,"tools","visual","thresholds.js"));
const [mst,mfull]=argv.filter((a,i)=>a.endsWith(".json")&&argv[i-1]!=="--json"), OUT=opt("--json");
if(!mst||!mfull){ console.error("usage: t12-hover.js <motion-selftest.json> <motion-full.json> [--json out.json]"); process.exit(2); }
const MS=JSON.parse(fs.readFileSync(mst,"utf8")), MF=JSON.parse(fs.readFileSync(mfull,"utf8")), clone=o=>JSON.parse(JSON.stringify(o));
const CEIL=/^jumps \d+ over the 16 motions|^pops \d+ \(limit/;
const motionF=(runs,so)=>{ const f=TH.checkLive({motion:{runs:runs}},{selftestOnly:so,legacy:true}).filter(x=>/map layer in motion/.test(x));
  return f.length?f[0].replace(/^the map layer in motion \(decision 240 \(a\)\): /,"").replace(/ \{"jumps".*$/,"").split("; ").filter(x=>!CEIL.test(x)):[]; };
const out={records:{}, asWritten:{}, controls:[]}, ok=[];
[["the self-test's block",MS.runs,true],["check:visual's block",MF.runs,false]].forEach(([name,runs,so])=>{
  const real=runs.find(x=>x.real&&x.id==="paper-zoom"), twin=runs.find(x=>x.point&&x.id==="paper-zoom");
  const rec=motionF(runs,so); out.records[name]={failures:rec, realHover:real.hover===undefined?"(not recorded)":real.hover, twinHover:twin.hover===undefined?"(not recorded)":twin.hover};
  ok.push(!rec.length); console.log((rec.length?"FAIL ":"pass ")+"as measured: "+name+"; the paper zoom by real input hovers "+(real.hover||"nothing")+", its twin "+(twin.hover||"nothing")+(rec.length?" -> "+rec.join("; "):""));
  /* mutate-8l.js's own mutation, as written: shown to change nothing on these records */
  let r=clone(runs); r.find(x=>x.real&&x.id==="paper-zoom").hover=null; const same=JSON.stringify(r)===JSON.stringify(runs);
  out.asWritten[name]={recordUnchanged:same, failures:motionF(r,so)};
  console.log("  mutate-8l.js's mutation as written: the record "+(same?"unchanged (vacuous here)":"changed")+", failures "+(out.asWritten[name].failures.join("; ")||"none"));
  [["the twin hovering Constantine, the real run nothing",x=>{ x.find(y=>y.point&&y.id==="paper-zoom").hover="constantine"; x.find(y=>y.real&&y.id==="paper-zoom").hover=null; },/paper-zoom by real input: its pointer hovers nothing, its twin's constantine/],
   ["the real run hovering Constantine, the twin nothing",x=>{ x.find(y=>y.real&&y.id==="paper-zoom").hover="constantine"; x.find(y=>y.point&&y.id==="paper-zoom").hover=null; },/paper-zoom by real input: its pointer hovers constantine, its twin's nothing/]
  ].forEach(([what,f,want])=>{ const m=clone(runs); f(m); const fl=motionF(m,so), hit=fl.some(x=>want.test(x));
    out.controls.push({block:name, control:what, caught:hit, failures:fl}); ok.push(hit);
    console.log("  "+(hit?"caught ":"MISSED ")+what+(hit?" -> "+fl.filter(x=>want.test(x))[0]:" ("+(fl.join("; ")||"no failure")+")")); });
});
out.all=ok.every(Boolean);
console.log(out.all?"every record passes and every control is caught":"NOT ALL: see above");
if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(out,null,1)); }
process.exit(out.all?0:1);
