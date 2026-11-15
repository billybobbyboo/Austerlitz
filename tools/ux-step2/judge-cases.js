#!/usr/bin/env node
/* UI/UX roadmap step 2: a targeted run's cases judged one by one. `harness.js <build> <outdir> --only a,b` (without --test: the cases alone, no
   self-test and no live block) writes report.json; this applies thresholds.js's own per-case check to each case in it, with its spec from
   cases.js, and the console's judgement. It is not `check:visual`: the self-test, the live blocks and every other case are not run.
   node tools/ux-step2/judge-cases.js <outdir | report.json> */
"use strict";
const fs=require("fs"), path=require("path"), ROOT=path.resolve(__dirname,"..","..");
const T=require(path.join(ROOT,"tools","visual","thresholds.js")), CASES=require(path.join(ROOT,"tools","visual","cases.js"));
const t=path.resolve(process.argv[2]||"."), rp=fs.statSync(t).isDirectory()?path.join(t,"report.json"):t, r=JSON.parse(fs.readFileSync(rp,"utf8"));
const spec={}; CASES.forEach(c=>{ spec[c.name]=c; });
let bad=0;
console.log("report of build md5 "+r.md5+", "+Object.keys(r.cases||{}).length+" cases"+(r.env?", env "+JSON.stringify(r.env):""));
Object.entries(r.cases||{}).forEach(([n,m])=>{
  const f=spec[n]?T.check(n,m,spec[n],{}):["not in cases.js"], L=m.layer||{}, tc=m.textContrast||{};
  console.log((f.length?"FAIL ":"ok   ")+n+": labels placed "+L.placed+", dropped "+L.dropped+", pass "+L.ms+" ms; map text contrast min "+tc.min+
    (tc.cased!=null?", cased texts "+tc.cased+(tc.casedMin!=null?" (min "+tc.casedMin+")":"")+", unread "+tc.casedUnread:"")+"; unobstructed "+m.unobstructed+" / "+m.unobstructed720);
  f.forEach(x=>console.log("     "+x)); bad+=f.length; });
const cb=T.judgeConsole(T.consoleEntries(r)).bad; cb.forEach(e=>console.log("console: "+JSON.stringify(e).slice(0,300))); bad+=cb.length;
console.log(bad?"FAILURES: "+bad:"every case judged passes its own thresholds (the cases alone: not check:visual)");
process.exit(bad?1:0);
