#!/usr/bin/env node
/* Final audit after Stage 8, area a11y: writes docs/audit-post8-evidence/a11y/result.json (the structured result) from the literal below,
   so that the JSON is valid and the README and the result say the same thing. node tools/audit-post8/a11y/result-src.js */
"use strict";
const fs=require("fs"), path=require("path");
const OUT=path.join(__dirname,"..","..","..","docs","audit-post8-evidence","a11y","result.json");
const R=require("./result-data.js");
const SEV={S1:0,S2:1,S3:2,S4:3}; R.findings.sort((a,b)=>SEV[a.severity]-SEV[b.severity]||a.id.localeCompare(b.id));   /* most severe first */
fs.writeFileSync(OUT,JSON.stringify(R,null,1));
console.log("written",OUT,"findings",R.findings.length);
