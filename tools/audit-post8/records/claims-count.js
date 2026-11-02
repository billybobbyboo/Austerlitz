/* Records audit: the narrative statements' claims counted on the live tree (H-6, C-48): narrative.js's STATEMENT_CLAIMS by claim, the
   statements tools/step4/statements.js inventories, those with a claim of their own, those CLAIM_BY_CLASS covers, the rest ("Not yet
   checked"), and entries no longer naming a live statement. node tools/audit-post8/records/claims-count.js ROOT. Reads only. */
"use strict";
const fs=require("fs"), vm=require("vm"), path=require("path"), ROOT=path.resolve(process.argv[2]||path.join(__dirname,"..","..",".."));
const ctx={}; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(ROOT,"narrative.js"),"utf8").replace(/\bconst /g,"var ").replace(/\blet /g,"var "),ctx);
const S=ctx.STATEMENT_CLAIMS, C=ctx.CLAIM_BY_CLASS, by={}; Object.values(S).forEach(e=>by[e.cl]=(by[e.cl]||0)+1);
let all=require(path.join(ROOT,"tools/step4/statements.js")).statements(ROOT); all=Array.isArray(all)?all:Object.values(all);
const pats=Object.values(C).map(x=>new RegExp(x.ref||x.pattern||x.re)), live=new Set(all.map(s=>s.ref));
let own=0, cls=0, un=0; all.forEach(s=>{ if(S[s.ref]) own++; else if(pats.some(p=>p.test(s.ref))) cls++; else un++; });
console.log(JSON.stringify({statements:all.length, ownClaims:own, byClass:cls, unchecked:un, entries:Object.keys(S).length, byClaim:by,
  staleEntries:Object.keys(S).filter(r=>!live.has(r)).length, classes:Object.keys(C)}));
