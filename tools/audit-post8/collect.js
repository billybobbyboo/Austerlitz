#!/usr/bin/env node
/* Final audit after Stage 8: collect every area's structured result into one candidate list.
   Sources: each workflow journal's agent results (static areas returned their full object) and each browser area's result.json.
   usage: node tools/audit-post8/collect.js <journal.jsonl ...>   writes docs/audit-post8-evidence/candidates.json and .md */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(__dirname,"..",".."), EV=path.join(ROOT,"docs","audit-post8-evidence");
const results=[];
for(const j of process.argv.slice(2)){
  for(const line of fs.readFileSync(j,"utf8").split("\n")){ if(!line.trim()) continue; let o; try{ o=JSON.parse(line); }catch(e){ continue; }
    const v=o.result||o.value||o.output; if(v&&typeof v==="object"&&v.area&&Array.isArray(v.findings)) results.push(v); }
}
for(const d of fs.readdirSync(EV)){ const f=path.join(EV,d,"result.json"); if(fs.existsSync(f)){ try{ const v=JSON.parse(fs.readFileSync(f,"utf8")); if(v&&v.area&&!results.find(r=>r.area===v.area)) results.push(v); }catch(e){ console.error("bad",f,e.message); } } }
const all=[]; for(const r of results) for(const [i,f] of (r.findings||[]).entries()) all.push(Object.assign({area:r.area, key:r.area+"#"+(i+1)},f));
fs.writeFileSync(path.join(EV,"candidates.json"),JSON.stringify({areas:results.map(r=>r.area),count:all.length,findings:all},null,1));
const sev=s=>({S1:1,S2:2,S3:3,S4:4})[String(s||"").slice(0,2)]||9;
all.sort((a,b)=>sev(a.severity)-sev(b.severity)||a.area.localeCompare(b.area));
let md="# Candidate findings (before verification)\n\n| key | sev | pri | category | status | title |\n|---|---|---|---|---|---|\n";
for(const f of all) md+="| "+f.key+" | "+f.severity+" | "+f.priority+" | "+f.category+" | "+f.status+" | "+String(f.title).replace(/\|/g,"/")+" |\n";
fs.writeFileSync(path.join(EV,"candidates.md"),md);
console.log("areas",results.map(r=>r.area).join(", "),"findings",all.length);
