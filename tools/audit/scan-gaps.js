#!/usr/bin/env node
/* Final audit (docs/FINAL_AUDIT.md, dimension 1): the overclaim scan (redteam.js section 6) applied to every string a visitor can be
   shown, not only the fields it reads. No page. Loads geo.js, data.js, appearance.js, analysis.js in a vm (as the suites do), walks every
   string value of every top-level data declaration, and applies redteam.js's own BANNED (certainty) and CAUSAL patterns, read from
   redteam.js so they cannot drift. Each hit is reported with its path and whether redteam.js reads that field. Also lists, per
   declaration, how many strings it holds and how many of them redteam's scan reads.
   node tools/audit/scan-gaps.js [--json out.json]
   Measurement only: nothing is written to a source file. */
const fs=require("fs"), path=require("path"), vm=require("vm");
const ROOT=path.resolve(__dirname,"..","..");
const argv=process.argv.slice(2), OUT=argv.includes("--json")?argv[argv.indexOf("--json")+1]:null;
const rt=fs.readFileSync(path.join(ROOT,"redteam.js"),"utf8");
const BANNED=eval(rt.match(/const BANNED=(\/.*\/i);/)[1]), CAUSAL=eval(rt.match(/const CAUSAL=(\/.*\/i);/)[1]);
const ctx={console}; vm.createContext(ctx);
const src=["geo.js","data.js","appearance.js","analysis.js"].map(f=>fs.readFileSync(path.join(ROOT,f),"utf8")).join("\n");
vm.runInContext(src+"\n;this.__D={PHASES,FORMATIONS,FEATURES,SOURCE_NOTE,EVENTS,ANALYSIS,COMMAND,PLANS,TOUR,ACTS:typeof ACTS!=='undefined'?ACTS:null,CLAIM,"+
  "APPEARANCE_SOURCES,DRESS,COMPOSITION,COLOURS_CARRIED,STANDARD_MEASURES};",ctx);
const D=ctx.__D;
/* the fields redteam.js section 6 reads (redteam.js:183-188) */
const READ=[/^EVENTS\[\d+\]\.(n|why)$/,/^PHASES\[\d+\]\.(lede|title)$/,/^ANALYSIS\[\d+\]\.text$/,/^TOUR\[\d+\]\.x$/,/^FORMATIONS\.[^.]+\.(role|note)$/,/^PLANS\.(al|fr)\.(intent|cost)$/];
const isRead=p=>READ.some(r=>r.test(p));
const hits=[], per={};
function walk(v,p,top){
  if(typeof v==="string"){ per[top]=per[top]||{strings:0,read:0,prose:0,proseRead:0}; per[top].strings++; if(isRead(p)) per[top].read++;
    /* prose: a sentence a visitor reads (a space and at least 20 characters), not an identifier, code or colour */
    if(/\s/.test(v)&&v.length>=20){ per[top].prose++; if(isRead(p)) per[top].proseRead++; }
    if(/^(#|0x|data:|https?:)/.test(v)||v.length<12) return;
    const b=v.match(BANNED), c=v.match(CAUSAL);
    if(b) hits.push({kind:"certainty",word:b[0],path:p,scanned:isRead(p),text:v.slice(Math.max(0,b.index-80),b.index+80)});
    if(c) hits.push({kind:"causal",word:c[0],path:p,scanned:isRead(p),text:v.slice(Math.max(0,c.index-80),c.index+80)});
    return; }
  if(Array.isArray(v)) v.forEach((x,i)=>walk(x,p+"["+i+"]",top));
  else if(v&&typeof v==="object") Object.keys(v).forEach(k=>walk(v[k],p+"."+k,top));
}
Object.keys(D).forEach(k=>{ if(D[k]) walk(D[k],k,k); });
const out={banned:String(BANNED),causal:String(CAUSAL),perDeclaration:per,hits};
console.log("redteam's patterns: certainty "+BANNED+"  causal "+CAUSAL);
console.log("prose strings per declaration (a space and 20 characters or more; read by redteam's scan / all):");
Object.keys(per).forEach(k=>console.log("  "+k.padEnd(20)+String(per[k].proseRead).padStart(6)+" / "+per[k].prose));
const tot=Object.values(per).reduce((a,x)=>[a[0]+x.prose,a[1]+x.proseRead],[0,0]);
console.log("  total".padEnd(22)+String(tot[1]).padStart(6)+" / "+tot[0]+"  ("+(100*tot[1]/tot[0]).toFixed(1)+"% read)");
console.log("hits ("+hits.length+"):");
hits.forEach(h=>console.log("  "+(h.scanned?"[scanned]   ":"[NOT READ]  ")+h.kind.padEnd(10)+JSON.stringify(h.word).padEnd(16)+h.path+"\n      …"+h.text.replace(/\s+/g," ")+"…"));
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
