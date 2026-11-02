#!/usr/bin/env node
/* Final audit after Stage 8, area "tests": the narrative inventory's reach. Read-only.
   usage: node tools/audit-post8/tests/inventory-reach.js [root] [out.json]
   tools/step4/statements.js inventories the strings of data.js and analysis.js whose lang-scan path matches one of its CLASSES; nothing
   asserts that the classes cover every narrative string. This lists the guarded, judged, prose-like strings (two words or more, 20
   characters or more) of data.js and analysis.js that match no class, grouped by their path with the indices folded. */
const path=require("path"), fs=require("fs");
const ROOT=path.resolve(process.argv[2]||".");
const LS=require(path.join(ROOT,"tools","lang-scan.js"))(ROOT), {CLASSES,statements}=require(path.join(ROOT,"tools","step4","statements.js"));
const S=statements(ROOT);
const rec=LS.records.filter(r=>(r.file==="data.js"||r.file==="analysis.js")&&r.guarded&&!r.skip&&r.text&&/[A-Za-z]{2,} [A-Za-z]{2,}/.test(r.text)&&r.text.length>=20);
const out=rec.filter(r=>!CLASSES.some(([c,re])=>re.test(r.path)));
const fold=p=>p.replace(/\[#[\w-]+\]/g,"[#id]").replace(/\[\d+\]/g,"[n]").replace(/\["\d+"\]/g,'["n"]').replace(/^FORMATIONS\.\w+/,"FORMATIONS.<id>");
const groups={}; out.forEach(r=>{ const k=fold(r.path); (groups[k]=groups[k]||[]).push(r); });
const rows=Object.entries(groups).sort((a,b)=>b[1].length-a[1].length).map(([k,v])=>({path:k,n:v.length,example:v[0].path,text:v[0].text.slice(0,140),where:v[0].file+":"+v[0].line}));
const res={statements:S.length,prose:rec.length,outside:out.length,groups:rows};
if(process.argv[3]) fs.writeFileSync(process.argv[3],JSON.stringify(res,null,1)+"\n");
console.log("inventoried statements: "+S.length+"; prose-like guarded strings in data.js and analysis.js: "+rec.length+"; matching no class: "+out.length+" in "+rows.length+" path shapes");
rows.forEach(r=>console.log("  "+String(r.n).padStart(4)+"  "+r.path+"   e.g. "+r.example+" ("+r.where+"): "+JSON.stringify(r.text)));
