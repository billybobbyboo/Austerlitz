#!/usr/bin/env node
/* The final audits' Stage 5, WP-07: the motion block's long Play runs alone on a build (tools/visual/motion.js runBlock, onlyLong).
   node tools/final-stage5/long-only.js <repo root> <build.html> [out.json]   Measurement only. */
// the motion block's long Play runs alone on a build (measurement only)
const path=require("path"), ROOT=process.argv[2], html=path.resolve(process.argv[3]);
process.env.AUSTERLITZ_HTML=html;
const L=require(path.join(ROOT,"tools","stage8","lib.js")), MO=require(path.join(ROOT,"tools","visual","motion.js")), fs=require("fs");
(async()=>{ const b=await L.launch(); const p=await L.open(b,[1600,900]); p.setDefaultTimeout(0);
  const settle=async q=>{ await q.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await q.waitForTimeout(450); await q.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); };
  const B=await MO.runBlock(p,settle,{onlyLong:true,log:console.log}); await b.close();
  if(process.argv[4]) fs.writeFileSync(process.argv[4],JSON.stringify(B.long,null,1));
  B.long.forEach(l=>{ const u=l.forms.filter(f=>f.playInView>=60); const tot=l.forms.reduce((a,f)=>a+f.playInView,0);
    console.log(l.id+": formations in view "+u.length+", under half "+u.filter(f=>f.playShare<0.5).length+", longest "+Math.max(...u.map(f=>f.longestMin))+" min"); });
})().catch(e=>{ console.error(e); process.exit(1); });
