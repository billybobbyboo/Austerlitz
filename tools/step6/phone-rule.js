#!/usr/bin/env node
/* Roadmap step 6, decision 236 (docs/STEP6_SPEC.md section 14.1): the rule that reads the owner's two runs of the phone route, applied as
   written, mechanically.
   - a segment drops when more than 5% of its frames are long (the report's long%);
   - a run stands when its refresh was measured (no "could not be measured" note) and no segment was hidden;
   - a run tests a kind when at least half of that kind's A blocks drop;
   - a candidate cures a kind in a run when both its blocks there do not drop while at least one A beside each of them does;
   - its gain in a kind and a run is the median, over its two blocks, of the two As' mean p50 divided by its own;
   1. neither run tests either kind: nothing is built;
   2. else the first of candidates 1-4 that cures every kind both runs test is built;
   3. else the first of candidates 1-4 whose gain is at least 1.25 in every kind both runs test is built (a gain, not a cure);
   4. else nothing is built.
   node tools/step6/phone-rule.js <run.json> <run.json>
   Reads the reports only; writes nothing. */
const fs=require("fs");
const ORDER=["figShadow","shadowPass","density1","density1Pass"], REF="figures", GAIN=1.25;
const runs=process.argv.slice(2).map(f=>({file:f, r:JSON.parse(fs.readFileSync(f,"utf8"))}));
if(runs.length!==2) throw new Error("two runs, please");
const drops=s=>s.longPct>5;
const median=a=>{ const s=a.slice().sort((x,y)=>x-y), m=s.length>>1; return s.length%2?s[m]:(s[m-1]+s[m])/2; };
/* The final audit after Stage 8 (CL-PERF-16, ChatGPT's CG-F08): the rule read two empty reports as standing, testing both kinds and cured
   by every candidate (gain NaN), and recommended figShadow with exit 0. A report is now refused unless it holds, for each kind, the
   route's rounds in full: at least two rounds, every candidate (and the reference) once per round between two As, and finite positive
   p50 and long% on every block; a refusal throws (exit 1) and names what is missing. */
function complete(file,r){
  const bad=[];
  if(!(typeof r.refreshMs==="number"&&isFinite(r.refreshMs)&&r.refreshMs>0)) bad.push("refreshMs missing or not a positive number");
  if(!Array.isArray(r.notes)) bad.push("notes is not a list");
  if(!Array.isArray(r.segments)||!r.segments.length) bad.push("no segments");
  else ["ph8-overview","play-half"].forEach(kind=>{
    const B=r.segments.filter(s=>s.id===kind&&s.cand&&s.round);
    const rounds=[...new Set(B.map(s=>s.round))];
    if(rounds.length<2) bad.push(kind+": "+rounds.length+" round(s), at least 2 expected");
    rounds.forEach(rd=>ORDER.concat([REF]).forEach(c=>{ const n=B.filter(s=>s.round===rd&&s.cand===c).length;
      if(n!==1) bad.push(kind+" round "+rd+": "+n+" block(s) of "+c+", 1 expected"); }));
    if(B.filter(s=>s.cand==="A").length<2) bad.push(kind+": fewer than two A blocks");
    B.forEach(s=>{ if(!(isFinite(s.p50)&&s.p50>0&&isFinite(s.longPct)&&s.longPct>=0)) bad.push(kind+" "+s.cand+" round "+s.round+": p50 or long% not a finite measure"); });
  });
  if(bad.length) throw new Error(file+" is not a complete phone-route report: "+bad.join("; "));
}
runs.forEach(({file,r})=>complete(file,r));
const out={stands:[], tests:{}, cand:{}};
runs.forEach(({file,r},ri)=>{
  const stands=r.refreshMs!=null&&!r.notes.some(n=>/could not be measured/.test(n))&&!r.segments.some(s=>s.hidden);
  out.stands.push(file+": "+(stands?"stands":"does NOT stand")+" (refresh "+r.refreshMs+" ms, "+r.notes.length+" notes)");
  if(!stands) throw new Error(file+" does not stand: run it again (rule)");
  ["ph8-overview","play-half"].forEach(kind=>{
    const B=r.segments.filter(s=>s.id===kind&&s.cand&&s.round);   /* the blocks in order, the warm-up left out */
    const As=B.filter(s=>s.cand==="A");
    const t=As.filter(drops).length>=As.length/2;
    (out.tests[kind]=out.tests[kind]||[]).push(t);
    ORDER.concat([REF]).forEach(c=>{
      const idx=B.map((s,i)=>s.cand===c?i:-1).filter(i=>i>=0);
      const blocks=idx.map(i=>{ const a=B[i-1], b=B[i+1], s=B[i];
        if(!a||!b||a.cand!=="A"||b.cand!=="A") throw new Error(kind+" "+c+": not between two As");
        return {p50:s.p50, long:s.longPct, aP50:[a.p50,b.p50], aDrop:[drops(a),drops(b)], gain:((a.p50+b.p50)/2)/s.p50,
          cure:!drops(s)&&(drops(a)||drops(b)), set:s.set}; });
      const C=((out.cand[c]=out.cand[c]||{})[kind]=out.cand[c][kind]||[]);
      C.push({run:ri+1, cures:blocks.every(x=>x.cure), gain:+median(blocks.map(x=>x.gain)).toFixed(3),
        blocks:blocks.map(x=>"p50 "+x.p50+" ("+x.long+"% long) against As "+x.aP50.join(", ")+", gain "+x.gain.toFixed(3))});
    });
  });
});
const tested=Object.keys(out.tests).filter(k=>out.tests[k].every(Boolean));
let verdict;
if(!Object.keys(out.tests).some(k=>out.tests[k].some(Boolean))) verdict="rule 1: neither run tests either kind: nothing is built";
else {
  const cured=ORDER.find(c=>tested.every(k=>out.cand[c][k].every(x=>x.cures)));
  if(cured) verdict="rule 2: "+cured+" cures every kind both runs test: built for lowTier";
  else { const g=ORDER.find(c=>tested.every(k=>out.cand[c][k].every(x=>x.gain>=GAIN)));
    verdict=g?"rule 3: no candidate cures; "+g+" gains at least "+GAIN+" in every kind both runs test: built for lowTier (a gain, not a cure)":"rule 4: nothing is built"; }
}
console.log(out.stands.join("\n"));
console.log("tests (both runs):",JSON.stringify(out.tests),"-> kinds both runs test:",tested.join(", ")||"none");
ORDER.concat([REF]).forEach(c=>Object.keys(out.cand[c]).forEach(k=>out.cand[c][k].forEach(x=>
  console.log((c+(c===REF?" (reference)":"")).padEnd(24),k.padEnd(13),"run",x.run,"cures",String(x.cures).padEnd(5),"gain",x.gain,"|",x.blocks.join("; ")))));
console.log("VERDICT:",verdict);
