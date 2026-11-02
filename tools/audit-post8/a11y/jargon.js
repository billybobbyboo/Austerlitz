#!/usr/bin/env node
/* Final audit after Stage 8, area a11y: the visitor-facing words, read statically. tools/lang-scan.js gives every string a visitor can be
   shown (the guarded data, the presentation code's literals, the tokens, shell.html's text and visitor attributes), each with file:line and
   whether it is judged; this scan lists the judged ones that carry the project's internal words (anchor, leg, interpolated, phase numbers,
   ids, the code's own names) and the terms whose naming the brief asks about. Read-only; loads no page.
   node tools/audit-post8/a11y/jargon.js  ->  docs/audit-post8-evidence/a11y/jargon.json */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.join(__dirname,"..","..","..");
const scan=require(path.join(ROOT,"tools","lang-scan.js"))(ROOT);
const recs=scan.records.filter(r=>!r.skip);
const PAT={
  anchor:/\banchor(s|ed)?\b/i,
  leg:/\blegs?\b/i,
  interpolat:/\binterpolat\w*/i,
  "phase number":/\bphase\s*\d+|\bphases?\s+\d/i,
  "id-like":/\b[a-z]+_[a-z_]+\b|\b[a-z]+@\d\b|#[a-z]+\b/,
  "code word":/\b(moveMin|tm|confAt|posNow|stateAt|undefined|NaN|null|harness|self-test|selftest)\b/,
  "decision ref":/\bdecision\s+\d{2,3}\b/i,
  "model reading":/\bmodel reading\b/i,
  vantage:/\bvantage\b/i,
  dossier:/\bdossier\b/i,
  counters:/\bcounters?\b/i,
  frontage:/\bfrontage\b/i,
  viewshed:/\bviewshed\b/i,
  grade:/\bgrade[sd]?\b|\b[ABC]\s*:\s*(position|sector|reconstructed)/i,
  presentation:/\bpresentation\b/i,
  "Clean/Map":/\bClean\b|\bMap view\b|\bStaff map\b/,
  "Whose eyes":/Whose eyes/i,
  "derived":/\bderived\b/i
};
const out={generated:new Date().toISOString(),records:recs.length,byPattern:{}};
for(const [k,re] of Object.entries(PAT)){
  const hits=recs.filter(r=>re.test(r.text));
  out.byPattern[k]={n:hits.length,files:hits.reduce((a,r)=>{ a[r.file]=(a[r.file]||0)+1; return a; },{}),
    ex:hits.slice(0,400).map(r=>r.file+":"+r.line+" "+(r.path||r.decl||"")+" :: "+r.text.replace(/\s+/g," ").slice(0,200))};
}
fs.writeFileSync(path.join(ROOT,"docs","audit-post8-evidence","a11y","jargon.json"),JSON.stringify(out,null,1));
for(const [k,v] of Object.entries(out.byPattern)) console.log(k.padEnd(14),v.n,JSON.stringify(v.files));
