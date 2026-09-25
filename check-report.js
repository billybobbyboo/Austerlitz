#!/usr/bin/env node
/* Re-checks a finished harness report against the Stage 0 thresholds, without re-rendering.
   node tools/visual/check-report.js <outdir>   (exit 1 on any failure) */
const fs=require("fs"), path=require("path"), T=require("./thresholds.js");
const dir=path.resolve(process.argv[2]||path.join(__dirname,"out"));
const r=JSON.parse(fs.readFileSync(path.join(dir,"report.json"),"utf8"));
let fails=0;
console.log("report "+r.html+"  md5 "+r.md5+"  cases "+Object.keys(r.cases).length);
for(const [name,m] of Object.entries(r.cases)){
  const f=T.check(name,m); fails+=f.length;
  const kn=(T.KNOWN[name]||[]).filter(k=>m.labels.examples.includes(k));
  if(kn.length) console.log("KNOWN "+name.padEnd(20)+"  residual carried to Stage 2: "+kn.join("; "));
  console.log((f.length?"FAIL ":"PASS ")+name.padEnd(20)+(f.length?"  "+f.join(" | "):
    "  figures "+m.figures.maxErr+"  camera "+m.camera.clearance+"  overlaps "+Object.values(m.labels.pairs).reduce((a,b)=>a+b,0)+(kn.length?" (known)":"")+"  solid-black "+m.pixels.solidBlocks+"  near-black "+m.pixels.nearBlack));
}
if(r.selfTest){ console.log("in-app self-test ("+r.selfTest.ms+" ms):");
  r.selfTest.checks.forEach(c=>{ if(!c.ok) fails++; console.log("  "+(c.ok?"PASS ":"FAIL ")+c.name); }); }
console.log(fails?("FAILURES: "+fails):"all Stage 0 checks pass for this report");
process.exit(fails?1:0);
