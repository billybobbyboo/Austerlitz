#!/usr/bin/env node
/* UI/UX roadmap step 5: the paper runs of tools/ux-step5/motion-paper.js, variant by variant, against the build's own runs and thresholds.js MOTION.VIS.
   node tools/ux-step5/motion-table.js <dir with base.json and <variant>.json ...>  Measurement only. */
"use strict";
const fs=require("fs"), path=require("path");
const dir=path.resolve(process.argv[2]), TH=require(path.join(__dirname,"..","visual","thresholds.js"));
const files=fs.readdirSync(dir).filter(f=>f.endsWith(".json")).sort((a,b)=>a==="base.json"?-1:b==="base.json"?1:a.localeCompare(b));
const base=JSON.parse(fs.readFileSync(path.join(dir,"base.json")));
const keys=base.runs.map(r=>r.key);
console.log("variant".padEnd(14)+"jumps pops lod flick | "+keys.map(k=>k.padEnd(18)).join(" ")+" | lowered");
files.forEach(f=>{ const R=JSON.parse(fs.readFileSync(path.join(dir,f))), T=R.totals; let low=[];
  const cells=keys.map(k=>{ const r=R.runs.find(x=>x.key===k); if(!r) return "-".padEnd(18); const b=TH.MOTION.VIS[k];
    if(b&&!r.real){ if(r.track.inView!==b[1]) low.push(k+" inView "+r.track.inView+"/"+b[1]); if(r.track.on<b[0]) low.push(k+" drawn "+r.track.on+"<"+b[0]); if(r.track.longestMs>b[2]) low.push(k+" longest "+r.track.longestMs+">"+b[2]); }
    return (r.track.on+"/"+r.track.inView+" "+r.track.longestMs+"ms").padEnd(18); });
  console.log(f.replace(".json","").padEnd(14)+String(T.jumps).padStart(5)+String(T.pops).padStart(5)+String(T.lod).padStart(4)+String(T.flicker).padStart(6)+" | "+cells.join(" ")+" | "+(low.length?low.join("; "):"none"));
});
