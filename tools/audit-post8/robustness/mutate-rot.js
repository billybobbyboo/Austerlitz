/* Final audit after Stage 8, area "robustness": do Stage 8's mutation scripts still apply to today's sources? (measurement only; nothing run)
   node tools/audit-post8/robustness/mutate-rot.js  ->  docs/audit-post8-evidence/robustness/mutate-rot.json
   tools/stage8/mutate-*.js (CI never runs them: ci-reach.json) each break one thing on a copy and show that a check then fails. A mutation
   whose searched string no longer occurs in the file it edits cannot be applied any more, and its script no longer shows that its check can
   fail. Each script's table (const MUT=[...]) is read with acorn, never run, by the layout its own comment above the table states
   ("[id, what it breaks, from, to, the file (world.js unless named)]", "[id, ..., [[from, to], ...]]"): its from-strings looked up in today's
   file, the file the entry names, else the default the comment names, else the script's header's (the built page for the self-test's
   mutations, which edit "a copy of the built page"; app.js for mutate-css-8d.js, which "replaces one string of app.js"). A mutation applies
   when every from-string occurs (once, or more than once: reported). mutate-8l.js breaks measured records, not sources: not read. */
"use strict";
const fs=require("fs"), path=require("path");
const acorn=require(path.join(__dirname,"..","..","..","node_modules","acorn"));
const ROOT=path.resolve(__dirname,"..","..",".."), OUT=path.join(ROOT,"docs","audit-post8-evidence","robustness","mutate-rot.json");
const files=fs.readdirSync(path.join(ROOT,"tools","stage8")).filter(f=>/^mutate-.*\.js$/.test(f)&&f!=="mutate-8l.js").sort();
const cache={}; const read=f=>{ if(!(f in cache)){ const p=path.join(ROOT,f); cache[f]=fs.existsSync(p)?fs.readFileSync(p,"utf8"):null; } return cache[f]; };
function lit(n){ if(!n) return undefined; if(n.type==="Literal") return n.value; if(n.type==="TemplateLiteral"&&!n.expressions.length) return n.quasis[0].value.cooked;
  if(n.type==="BinaryExpression"&&n.operator==="+"){ const a=lit(n.left), b=lit(n.right); return (typeof a==="string"&&typeof b==="string")?a+b:undefined; } return undefined; }
const out={generated:new Date().toISOString(),scripts:[]};
for(const f of files){
  const src=fs.readFileSync(path.join(ROOT,"tools","stage8",f),"utf8").replace(/^#!.*\n/,"\n");
  const ast=acorn.parse(src,{ecmaVersion:"latest",locations:true});
  let table=null, tstart=0; ast.body.forEach(st=>{ if(st.type==="VariableDeclaration") st.declarations.forEach(d=>{ if(d.id.name==="MUT"&&d.init&&d.init.type==="ArrayExpression"){ table=d; tstart=st.start; } }); });
  const rec={script:f,mutations:0,applies:0,appliesWithRepeats:0,notApplicable:0,notLiteral:0,notApplicableList:[]};
  if(!table){ rec.note="no MUT table"; out.scripts.push(rec); continue; }
  const before=src.slice(0,tstart), cm=before.match(/\/\*\s*\[(id[^\]]*(?:\[\[[^\]]*\][^\]]*\])?[^\]]*)\]\s*\*\/\s*$/);
  const layout=cm?cm[1]:null; rec.layout=layout;
  const fields=layout?layout.replace(/\[\[from, to\], \.\.\.\]/,"PAIRS").split(",").map(s=>s.trim()):[];
  const iPairs=fields.indexOf("PAIRS"), iFrom=fields.indexOf("from"), iTo=fields.indexOf("to"), iFile=fields.findIndex(s=>/^(the )?file/.test(s));
  const dm=layout&&layout.match(/\(([\w.]+) unless named\)/);
  const header=src.slice(0,1200);
  const dflt=dm?dm[1]:(/copy of the built page|the build as it is/.test(header+layout+src.slice(table.start,table.start+400))?"austerlitz-command-map.html":(/string of app\.js/.test(header)?"app.js":"austerlitz-command-map.html"));
  rec.defaultFile=dflt;
  table.init.elements.forEach(e=>{ if(!e||e.type!=="ArrayExpression") return; const id=lit(e.elements[0]);
    let pairs=[];
    if(iPairs>=0){ const P=e.elements[iPairs]; if(P&&P.type==="ArrayExpression") pairs=P.elements.map(p=>p&&p.type==="ArrayExpression"?lit(p.elements[0]):undefined); }
    else if(iFrom>=0){ const fr=e.elements[iFrom]; if(fr&&fr.type==="Literal"&&fr.value===null) pairs=[]; else pairs=[lit(fr)]; }
    if(!pairs.length) return;   /* the control */
    rec.mutations++;
    if(pairs.some(p=>typeof p!=="string")){ rec.notLiteral++; return; }
    let file=dflt; if(iFile>=0){ const fl=lit(e.elements[iFile]); if(typeof fl==="string"&&fl) file=fl; }
    const txt=read(file); if(txt===null){ rec.notApplicable++; rec.notApplicableList.push({id,file,missingFile:true}); return; }
    let ok=true, rep=false; const miss=[];
    pairs.forEach(s=>{ const i=txt.indexOf(s); if(i<0){ ok=false; miss.push(s.slice(0,100)); } else if(txt.indexOf(s,i+1)>=0) rep=true; });
    if(ok){ rec.applies++; if(rep) rec.appliesWithRepeats++; } else { rec.notApplicable++; rec.notApplicableList.push({id,file,missing:miss}); } });
  out.scripts.push(rec);
}
out.total=out.scripts.reduce((a,r)=>{ ["mutations","applies","appliesWithRepeats","notApplicable","notLiteral"].forEach(k=>a[k]=(a[k]||0)+(r[k]||0)); return a; },{});
fs.writeFileSync(OUT,JSON.stringify(out,null,1));
console.log(JSON.stringify(out.total)); out.scripts.forEach(r=>console.log(r.script,"| default",r.defaultFile,"| m",r.mutations,"applies",r.applies,"(repeats",r.appliesWithRepeats+")","notApplicable",r.notApplicable,"notLit",r.notLiteral,r.note||""));
