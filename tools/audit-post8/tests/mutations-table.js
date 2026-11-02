#!/usr/bin/env node
/* Final audit after Stage 8, area "tests": merge the negative controls' records and render them as a table. Read-only on the repository.
   usage: node tools/audit-post8/tests/mutations-table.js <out.json> <in.json> [in2.json ...]
   Writes the merged record (each mutation once, the later file winning) to <out.json> and prints a markdown table: the mutation, what
   claims to guard it, the suites run, which failed (caught it), the outcome with and without check:data, and the auditor's prediction. */
const fs=require("fs");
const [OUT,...INS]=process.argv.slice(2);
if(!OUT||!INS.length){ console.error("usage: mutations-table.js <out.json> <in.json> [...]"); process.exit(2); }
const by=new Map(); let meta=null;
INS.forEach(f=>{ const j=JSON.parse(fs.readFileSync(f,"utf8")); meta=meta||j; j.results.forEach(r=>by.set(r.id,r)); });
const results=[...by.values()].sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));
const caughtN=results.filter(r=>r.outcome==="caught").length, nodeOnly=results.filter(r=>r.outcomeExcludingCheckData==="caught").length;
const summary={mutations:results.length, caught:caughtN, missed:results.filter(r=>r.outcome==="missed").length,
  caughtWithoutCheckData:nodeOnly, missedByEveryCheckButCheckData:results.filter(r=>r.outcome==="caught"&&r.outcomeExcludingCheckData==="missed").map(r=>r.id),
  missedByEverything:results.filter(r=>r.outcome==="missed").map(r=>r.id),
  inconclusive:results.filter(r=>(r.inconclusive||[]).length).map(r=>r.id+": "+r.inconclusive.join(",")),
  surprises:results.filter(r=>r.matchesExpectation===false).map(r=>r.id),
  allRestored:results.every(r=>r.restored&&(r.buildRestored!==false))};
fs.writeFileSync(OUT,JSON.stringify({generated:new Date().toISOString(),isolatedCopy:"a copy of the repository's tracked files at 43e3e5b (docs and node_modules symlinked read-only); never the working tree",
  auditedBuildMd5:meta.auditedBuildMd5, judgedAs:"each suite as tools/run-all.sh judges it: a non-zero exit or a line matching its FAILS pattern; check:data and check:chronology by their exit codes; a suite killed by the timeout is inconclusive",
  fails:meta.fails, summary, results},null,1)+"\n");
const esc=s=>String(s).replace(/\|/g,"\\|").replace(/\n/g," ");
const L=["| id | mutation | claimed guard | suites run | caught by | outcome | without check:data | predicted |","|---|---|---|---|---|---|---|---|"];
results.forEach(r=>{ const run=Object.keys(r.suites||{});
  L.push("| "+r.id+" | "+esc(r.title)+" | "+esc(r.claim)+" | "+run.join(", ")+" | "+(r.caughtBy.join(", ")||"nothing")+((r.inconclusive||[]).length?" (inconclusive: "+r.inconclusive.join(", ")+")":"")+" | **"+r.outcome+"** | "+r.outcomeExcludingCheckData+" | "+r.expect+" |"); });
console.log(L.join("\n"));
console.log("\n"+JSON.stringify(summary));
