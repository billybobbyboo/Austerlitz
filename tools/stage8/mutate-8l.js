#!/usr/bin/env node
/* Stage 8, the integration pass (docs/STAGE8_SPEC.md section 22): the pass's new rules in tools/visual/thresholds.js, each shown to fail on a
   copy of a measured record with that one thing broken, and the records as measured shown to pass the rule. The records: a harness report
   with the cases ph8-overview-watch and plans-overview (tools/visual/harness.js --test --only ph8-overview-watch,plans-overview, this pass's
   build) and the motion block's two runs (tools/stage8/motion-8h.js: check:selftest's and check:visual's). Judged by thresholds.js's own check
   (a case, with its cases.js spec) and checkLive (the block): a mutation passes if the judge reports a failure naming it, a record passes if the
   judge reports none for the rule (the 16's two ceilings excepted, which the build exceeds: question 267).
   node tools/stage8/mutate-8l.js <report.json> <motion-selftest.json> <motion-full.json> [--json out.json]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const L=require("./lib.js"), TH=require(path.join(L.ROOT,"tools","visual","thresholds.js")), CASES=require(path.join(L.ROOT,"tools","visual","cases.js"));
const [rep,mst,mfull]=argv.filter((a,i)=>a.endsWith(".json")&&argv[i-1]!=="--json"), OUT=opt("--json");
const R=JSON.parse(fs.readFileSync(rep,"utf8")), MS=JSON.parse(fs.readFileSync(mst,"utf8")), MF=JSON.parse(fs.readFileSync(mfull,"utf8"));
const clone=o=>JSON.parse(JSON.stringify(o)), spec=n=>CASES.find(c=>c.name===n);
const caseF=(n,m)=>TH.check(n,m,spec(n),{});
const CEIL=/^jumps \d+ over the 16 motions|^pops \d+ \(limit/;
const motionF=(runs,so)=>{ const f=TH.checkLive({motion:{runs:runs}},{selftestOnly:so,legacy:true}).filter(x=>/map layer in motion/.test(x));
  return f.length?f[0].replace(/^the map layer in motion \(decision 240 \(a\)\): /,"").replace(/ \{"jumps".*$/,"").split("; ").filter(x=>!CEIL.test(x)):[]; };
const out={records:{}, mutations:[]}, ok=[];
function rec(name,fails){ out.records[name]=fails; ok.push(!fails.length); console.log((fails.length?"FAIL ":"pass ")+"as measured: "+name+(fails.length?" -> "+fails.join("; "):"")); }
function mut(name,fails,want){ const hit=fails.some(x=>want.test(x)); out.mutations.push({name:name, caught:hit, failures:fails}); ok.push(hit);
  console.log((hit?"caught ":"MISSED ")+name+(hit?" -> "+fails.filter(x=>want.test(x))[0]:" ("+(fails.join("; ")||"no failure")+")")); }
/* the caption at 14:40 (CAP_DERIVED_ABSENT) */
const W=R.cases["ph8-overview-watch"], WATCH=/Watch: /;
rec("ph8-overview-watch",caseF("ph8-overview-watch",W).filter(x=>WATCH.test(x)));
let m=clone(W); m.timeline.capDerived=true; m.derived.shown=["separation"]; mut("a derived reading shown at 14:40",caseF("ph8-overview-watch",m),/where the model gives none/);
m=clone(W); m.derived.separation=true; mut("the model giving the centre separation at 14:40",caseF("ph8-overview-watch",m),/the model gives a derived reading/);
m=clone(W); delete m.derived; mut("the model not asked at the case's clock",caseF("ph8-overview-watch",m),/not measured at the case's clock/);
m=clone(W); delete m.derivedPositive; mut("no positive case",caseF("ph8-overview-watch",m),/not measured at 860/);
m=clone(W); m.derivedPositive.timeline.capDerived=null; m.derivedPositive.derived.shown=[]; mut("the reading not shown at 14:20",caseF("ph8-overview-watch",m),/does not show the model's derived reading/);
m=clone(W); m.derivedPositive.derived.separation=false; m.derivedPositive.derived.plateau=false; mut("the positive case covering nothing",caseF("ph8-overview-watch",m),/covers nothing/);
m=clone(W); m.derivedBack.clock=860; mut("the clock not set back",caseF("ph8-overview-watch",m),/not set back/);
/* plans-overview's limit: 13 */
const P=R.cases["plans-overview"], DROP=/dropped/;
rec("plans-overview",caseF("plans-overview",P).filter(x=>DROP.test(x)));
m=clone(P); m.layer.dropped=14; if(m.layer.dropped_) m.layer.dropped_=m.layer.dropped_.concat(["t:austerlitz"]); mut("14 dropped in plans-overview",caseF("plans-overview",m),DROP);
/* the motion block: each run by real input against its twin with the pointer */
rec("the self-test's block",motionF(MS.runs,true)); rec("check:visual's block",motionF(MF.runs,false));
let r=clone(MF.runs).filter(x=>!x.point); mut("the twins with the pointer missing",motionF(r,false),/twins with the pointer for the/);
r=clone(MF.runs); r.find(x=>x.real&&x.id==="paper-zoom").hover=null; mut("a run by real input hovering other than its twin",motionF(r,false),/its pointer hovers nothing, its twin's constantine/);
r=clone(MF.runs); r.find(x=>x.point&&x.id==="hybrid-orbit").pops+=1; mut("a twin hovering nothing that differs from its 16's run",motionF(r,false),/hovering nothing differs from the 16's run in pops/);
r=clone(MF.runs); r.find(x=>x.point&&x.id==="hybrid-orbit").track.on-=1; mut("a twin hovering nothing drawing fewer than its 16's run",motionF(r,false),/differs from the 16's run in formations' on|fewer drawn/);
r=clone(MF.runs); const pz=r.find(x=>x.real&&x.id==="paper-zoom"), tj=r.find(x=>x.point&&x.id==="paper-zoom").jumps, tol=Math.max(TH.MOTION.REAL_TOL.abs,TH.MOTION.REAL_TOL.rel*tj);
pz.jumps=tj+Math.floor(tol)+1; mut("a run by real input "+(Math.floor(tol)+1)+" jumps from its twin (the tolerance "+tol+")",motionF(r,false),/by real input: jumps/);
r=clone(MF.runs); r.find(x=>x.point&&x.id==="paper-zoom").track.on-=1; mut("the paper zoom's twin below its visibility baseline",motionF(r,false),/paper-zoom\+point: formations drawn/);
r=clone(MS.runs).filter(x=>!(x.point&&x.id==="paper-zoom")); mut("the self-test's paper zoom without its twin",motionF(r,true),/twins with the pointer|no twin with the pointer/);
out.all=ok.every(Boolean);
console.log(out.all?"every record passes and every mutation is caught":"NOT ALL: see above");
if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(out,null,1)); }
process.exit(out.all?0:1);
