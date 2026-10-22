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
