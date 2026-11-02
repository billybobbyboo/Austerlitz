// Print narrative statements (ref, class, file:line, claim, readings, note) for refs matching a regex; read-only.
// usage: node tools/audit-post8/sources-chronology/stmts.js ROOT REGEX   (ROOT: a repo copy; run in an isolated copy)
const path=require("path"),fs=require("fs"),vm=require("vm");
const ROOT=process.argv[2]; const re=new RegExp(process.argv[3]||".");
const {statements}=require(path.join(ROOT,"tools/step4/statements.js"));
const ctx={};vm.createContext(ctx);
for(const f of ["data.js","analysis.js","narrative.js"]) vm.runInContext(fs.readFileSync(path.join(ROOT,f),"utf8"),ctx);
const SC=ctx.STATEMENT_CLAIMS, CBC=ctx.CLAIM_BY_CLASS;
const all=statements(ROOT);
let n=0;
for(const s of all){ if(!re.test(s.ref)) continue; n++;
  let cl="unchecked", by=[], note="";
  if(SC[s.ref]){cl=SC[s.ref].cl; by=SC[s.ref].by||[]; note=SC[s.ref].note||"";}
  else { for(const k of Object.keys(CBC)){ if(new RegExp(CBC[k].re).test(s.ref)){cl=CBC[k].cl+" (by class)";} } }
  console.log("REF "+s.ref+" | "+s.cls+" | "+s.file+":"+s.line+" | claim="+cl);
  console.log("   TEXT: "+(s.label?"["+s.label+"] ":"")+s.text);
  for(const b of by) console.log("   BY: "+b.src+" "+b.at+" rd="+b.rd+(b.side?" side="+b.side:""));
  if(note) console.log("   NOTE: "+note);
}
console.error("matched "+n+" of "+all.length);
