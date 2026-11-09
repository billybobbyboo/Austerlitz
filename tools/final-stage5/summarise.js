#!/usr/bin/env node
/* The final audits' Stage 5, WP-07: the variant tool's results (tools/final-stage5/variants.js --json) as one markdown table: the 16's totals, the
   judge's failing lines, and each long run's share drawn, longest hidden (battle minutes) and formations under half; the event-named share.
   node tools/final-stage5/summarise.js <variants-1.json> [...]   Measurement only. */
const fs=require("fs"), files=process.argv.slice(2), V=[];
files.forEach(f=>{ try{ JSON.parse(fs.readFileSync(f,"utf8")).variants.forEach(v=>{ if(!V.some(x=>x.name===v.name)) V.push(v); }); }catch(e){} });
const runs=["hybrid-0830","hybrid-1200","hybrid-0900-3600","phone-0900","land-0900","paper-0900","hybrid-4x-day","hybrid-fr-0900","hybrid-al-0900"];
console.log("| variant | jumps | pops | flicker | lod | failing lines | "+runs.map(r=>r).join(" | ")+" | event-named (08:30) |");
console.log("|"+"---|".repeat(7+runs.length));
V.forEach(v=>{ const L=v.long||{}; console.log("| "+v.name+" | "+v.totals.jumps+" | "+v.totals.pops+" | "+v.totals.flicker+" | "+v.totals.lod+" | "+v.failures.length+" | "+
  runs.map(r=>L[r]?(Math.round(L[r].share*1000)/10)+"%, "+L[r].longestMin+" min, "+L[r].under50.length+" <50%":"-").join(" | ")+" | "+(L["hybrid-0830"]?Math.round(L["hybrid-0830"].evNamed.share*1000)/10+"%":"-")+" |"); });
