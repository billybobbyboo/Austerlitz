#!/usr/bin/env node
/* Final audit after Stage 8, area "tests": merge the negative controls' records and render them as a table. Read-only on the repository.
   usage: node tools/audit-post8/tests/mutations-table.js <out.json> <in.json> [in2.json ...]
   Writes the merged record (each mutation once, the later file winning) to <out.json> and prints a markdown table: the mutation, what
   claims to guard it, the suites run, which failed (caught it) and by what mechanism, the outcome with and without check:data and by a
   semantic check alone, and the auditor's prediction.
   Mechanism (added when the area was finished): each failing suite's recorded lines (mutate.js keeps the first eight) are read as one of
     "semantic"           a check of the property itself (a rate, a sum, a rule over the data or the code, a behaviour);
     "claim hash"         narrative.js's drift key (test.js: the statement changed since its claim was written): a review trigger;
     "inventory"          test.js's inventory freshness (docs/step4-evidence/inventory.*): cleared by regenerating it, no review needed;
     "text hash"          check:chronology L9 (the cited statement's text changed): a review trigger;
     "known-warning text" a warning acknowledged by its exact text (KNOWN_WARN) changed its words or numbers;
     "data identity"      check:data's byte identity, a change detector every data task moves.
   A suite whose lines show both a semantic line and a change detector counts as semantic. The reading is heuristic (from the recorded
   lines only) and is stated as such in the README. */
const fs=require("fs");
const [OUT,...INS]=process.argv.slice(2);
if(!OUT||!INS.length){ console.error("usage: mutations-table.js <out.json> <in.json> [...]"); process.exit(2); }
const by=new Map(); let meta=null;
INS.forEach(f=>{ const j=JSON.parse(fs.readFileSync(f,"utf8")); meta=meta||j; j.results.forEach(r=>by.set(r.id,r)); });
const results=[...by.values()].sort((a,b)=>a.id.localeCompare(b.id,undefined,{numeric:true}));
function mechanism(suite,lines){
  if(suite==="data") return "data identity";
  const L=(lines||[]).filter(l=>!/^(ERRORS|errors|findings|CSS ERRORS):/.test(l)&&!/^=== /.test(l));
  /* an unacknowledged warning is a known warning's changed text when the same warning, its numbers aside, is also reported as acknowledged
     but no longer raised (M01, M25); alone, it is a new warning: semantic (M03's strength sums) */
  const stem=l=>l.replace(/^.*?(not acknowledged in KNOWN_WARN|acknowledged but no longer raised[^:]*):\s*/,"").replace(/[\d.,]+/g,"#").trim();
  const gone=new Set(L.filter(l=>/acknowledged but no longer raised/.test(l)).map(stem));
  const kinds=new Set();
  L.forEach(l=>{
    if(/the inventory is out of date/.test(l)) kinds.add("inventory");
    else if(/changed since its claim was written/.test(l)) kinds.add("claim hash");
    else if(/^\s*! L9 /.test(l)) kinds.add("text hash");
    else if(/acknowledged but no longer raised/.test(l)) kinds.add("known-warning text");
    else if(/not acknowledged in KNOWN_WARN/.test(l)) kinds.add(gone.has(stem(l))?"known-warning text":"semantic");
    else if(/^\s*(!|✗|E |FAIL)|VIOLATIONS|DISAGREE|BROKEN|FLOATS/.test(l)) kinds.add("semantic"); });
  if(!kinds.size) kinds.add("semantic");   /* an exit code with no recorded line (the height guard prints its sites, not a "!" line) */
  return kinds.has("semantic")?"semantic":[...kinds].join("+");
}
results.forEach(r=>{
  r.mechanisms={}; (r.caughtBy||[]).forEach(s=>{ r.mechanisms[s]=mechanism(s,(r.suites[s]||{}).lines); });
  r.caughtSemantically=(r.caughtBy||[]).filter(s=>r.mechanisms[s]==="semantic");
  r.outcomeSemantic=!r.applied?"not applied":r.caughtSemantically.length?"caught":"missed";
});
const caughtN=results.filter(r=>r.outcome==="caught").length, nodeOnly=results.filter(r=>r.outcomeExcludingCheckData==="caught").length;
const summary={mutations:results.length, caught:caughtN, missed:results.filter(r=>r.outcome==="missed").length,
  caughtWithoutCheckData:nodeOnly, caughtSemantically:results.filter(r=>r.outcomeSemantic==="caught").length,
  missedByEveryCheckButCheckData:results.filter(r=>r.outcome==="caught"&&r.outcomeExcludingCheckData==="missed").map(r=>r.id),
  caughtOnlyByChangeDetectors:results.filter(r=>r.outcome==="caught"&&r.outcomeSemantic==="missed").map(r=>r.id+" ("+Object.entries(r.mechanisms).map(([k,v])=>k+": "+v).join(", ")+")"),
  missedByEverything:results.filter(r=>r.outcome==="missed").map(r=>r.id),
  inconclusive:results.filter(r=>(r.inconclusive||[]).length).map(r=>r.id+": "+r.inconclusive.join(",")),
  surprises:results.filter(r=>r.matchesExpectation===false).map(r=>r.id),
  allRestored:results.every(r=>r.restored&&(r.buildRestored!==false))};
fs.writeFileSync(OUT,JSON.stringify({generated:new Date().toISOString(),isolatedCopy:"copies of the repository's tracked files at 43e3e5b (docs and node_modules symlinked read-only); never the working tree",
  auditedBuildMd5:meta.auditedBuildMd5, judgedAs:"each suite as tools/run-all.sh judges it: a non-zero exit or a line matching its FAILS pattern; check:data and check:chronology by their exit codes; a suite killed by the timeout is inconclusive",
  mechanismNote:"mechanisms and caughtSemantically are read from each failing suite's first eight recorded lines (mutations-table.js): semantic, claim hash, inventory, text hash, known-warning text, data identity",
  fails:meta.fails, summary, results},null,1)+"\n");
const esc=s=>String(s).replace(/\|/g,"\\|").replace(/\n/g," ");
const L=["| id | mutation | claimed guard | suites run | caught by (mechanism) | outcome | without check:data | by a semantic check | predicted |","|---|---|---|---|---|---|---|---|---|"];
results.forEach(r=>{ const run=Object.keys(r.suites||{});
  const cb=(r.caughtBy||[]).map(s=>s+" ("+r.mechanisms[s]+")").join(", ")||"nothing";
  L.push("| "+r.id+" | "+esc(r.title)+" | "+esc(r.claim)+" | "+run.join(", ")+" | "+cb+((r.inconclusive||[]).length?" (inconclusive: "+r.inconclusive.join(", ")+")":"")+" | **"+r.outcome+"** | "+r.outcomeExcludingCheckData+" | "+r.outcomeSemantic+" | "+r.expect+" |"); });
console.log(L.join("\n"));
console.log("\n"+JSON.stringify(summary));
