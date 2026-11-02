#!/usr/bin/env node
/* Final audit after Stage 8, area a11y: writes the README's findings, carried-status and not-checked sections from result-data.js (between
   their headings), so the README and result.json say the same thing; idempotent. node tools/audit-post8/a11y/readme-fill.js */
"use strict";
const fs=require("fs"), path=require("path");
const P=path.join(__dirname,"..","..","..","docs","audit-post8-evidence","a11y","README.md");
const R=require("./result-data.js");
let s=fs.readFileSync(P,"utf8");
const sev={S1:0,S2:1,S3:2,S4:3};
const F=R.findings.slice().sort((a,b)=>sev[a.severity]-sev[b.severity]||a.id.localeCompare(b.id));
const fx=F.map(f=>"- **"+f.id+" · "+f.severity+" / "+f.priority+" · "+f.category+" · "+f.origin+" · "+f.status+".** "+f.title+".\n  "+
  "Observed: "+f.observed+"\n  Expected: "+f.expected+"\n  Remedy: "+f.remedy+(f.effort?" (effort "+f.effort+")":"")+"\n  Refs: "+f.refs.join("; ")+".\n  Evidence: "+f.evidence+".").join("\n");
const sect=(head,next,body)=>{ const a=s.indexOf(head), b=s.indexOf(next,a+head.length); if(a<0||b<0) throw new Error("section "+head); s=s.slice(0,a+head.length)+"\n"+body+"\n\n"+s.slice(b); };
sect("## Findings (full fields in `result.json`)","## Carried from the previous audit",fx);
sect("## Carried from the previous audit (docs/FINAL_AUDIT.md 2.7)","## Not checked",R.carried_status.map(c=>"- "+c.item+": **"+c.status+"**. "+c.evidence+".").join("\n"));
sect("## Not checked","## Evidence index",R.not_checked.map(x=>"- "+x).join("\n"));
fs.writeFileSync(P,s);
console.log("filled", F.length, "findings");
