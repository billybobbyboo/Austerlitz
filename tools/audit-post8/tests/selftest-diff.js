#!/usr/bin/env node
/* Final audit after Stage 8, area "tests": the in-app self-test's checks before Stage 8 and now, by name. Read-only.
   usage: node tools/audit-post8/tests/selftest-diff.js <old build or app.js> <new build or app.js> [out.json]
   Extracts AUSTERLITZ_DEBUG's source from each (a build's script or app.js), finds every ck("literal name", condition, ...) call with a
   literal name, and compares, for the names present in both, the condition text with its numbers. A changed number in a kept check's
   condition is listed (a tolerance moved under the same name); so are the checks only in one of the two. Names built from expressions are
   counted, not compared. */
const fs=require("fs");
const [A,B,OUT]=process.argv.slice(2);
function debugSrc(f){ const s=fs.readFileSync(f,"utf8"), i=s.indexOf("var AUSTERLITZ_DEBUG=(function(){"); if(i<0) throw new Error("no AUSTERLITZ_DEBUG in "+f);
  return s.slice(i); }
/* the argument list of a call starting at its "(": balanced, string-aware */
function argsAt(s,i){ let d=0,k=i,out=[],cur="";
  for(;k<s.length;k++){ const c=s[k];
    if(c==='"'||c==="'"||c==='`'){ let j=k+1; for(;j<s.length&&s[j]!==c;j++) if(s[j]==='\\') j++; cur+=s.slice(k,j+1); k=j; continue; }
    if(c==='('||c==='['||c==='{'){ d++; if(d===1&&c==='(') continue; }
    else if(c===')'||c===']'||c==='}'){ d--; if(d===0) { out.push(cur.trim()); return out; } }
    else if(c===','&&d===1){ out.push(cur.trim()); cur=""; continue; }
    cur+=c; }
  return out; }
function checks(src){ const m=new Map(); let dyn=0; const re=/\bck\(/g; let x;
  while((x=re.exec(src))){ const a=argsAt(src,x.index+2); if(a.length<2) continue;
    const nm=/^"((?:[^"\\]|\\.)*)"$/.exec(a[0]); if(!nm){ dyn++; continue; }
    const k=nm[1]; if(!m.has(k)) m.set(k,[]); m.get(k).push(a[1].replace(/\s+/g," ")); }
  /* the other form: out.push({name:"literal", ok:<expr>, detail:...}) */
  const re2=/\{name:"((?:[^"\\]|\\.)*)",\s*ok:/g;
  while((x=re2.exec(src))){ const st=x.index+x[0].length; let d=0,k=st,cur="";
    for(;k<src.length;k++){ const c=src[k];
      if(c==='"'||c==="'"){ let j=k+1; for(;j<src.length&&src[j]!==c;j++) if(src[j]==='\\') j++; cur+=src.slice(k,j+1); k=j; continue; }
      if(c==='('||c==='['||c==='{') d++; else if(c===')'||c===']'||c==='}'){ if(d===0) break; d--; } else if(c===','&&d===0) break;
      cur+=c; }
    const key=x[1]; if(!m.has(key)) m.set(key,[]); m.get(key).push(cur.replace(/\s+/g," ").trim()); }
  return {m,dyn}; }
const nums=t=>(t.match(/(?<![\w.])\d+(?:\.\d+)?(?:e-?\d+)?(?![\w])/g)||[]).join(",");
const a=checks(debugSrc(A)), b=checks(debugSrc(B));
const both=[...a.m.keys()].filter(k=>b.m.has(k)), onlyA=[...a.m.keys()].filter(k=>!b.m.has(k)), onlyB=[...b.m.keys()].filter(k=>!a.m.has(k));
const changed=[];
both.forEach(k=>{ const ca=a.m.get(k).join(" || "), cb=b.m.get(k).join(" || ");
  if(ca!==cb) changed.push({name:k, numbersChanged:nums(ca)!==nums(cb), was:ca.slice(0,600), is:cb.slice(0,600)}); });
const res={old:A,new:B,literalNames:{old:a.m.size,new:b.m.size},dynamicNames:{old:a.dyn,new:b.dyn},kept:both.length,onlyOld:onlyA,onlyNew:onlyB.length,
  conditionChanged:changed.length, numbersChanged:changed.filter(c=>c.numbersChanged).length, changed};
if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1)+"\n");
console.log("literal-named checks: old "+a.m.size+" (+"+a.dyn+" dynamic), new "+b.m.size+" (+"+b.dyn+" dynamic); kept "+both.length+"; only old "+onlyA.length+"; only new "+onlyB.length);
console.log("kept checks whose condition text changed: "+changed.length+", of them with a number changed: "+changed.filter(c=>c.numbersChanged).length);
changed.filter(c=>c.numbersChanged).forEach(c=>console.log("\n* "+c.name.slice(0,160)+"\n  was: "+c.was.slice(0,300)+"\n  is:  "+c.is.slice(0,300)));
