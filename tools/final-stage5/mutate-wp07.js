#!/usr/bin/env node
/* The final audits' Stage 5, WP-07: the negative controls of its checks. Each mutation puts one fix back on a copy of the build (each replacement must
   apply exactly once); on a fresh page the motion block's long Play runs (tools/visual/motion.js runBlock, onlyLong) judged by thresholds.js's own
   judge (its long-run lines, MOTION.LONG), and the self-test's WP-07 block (app.js wp07Checks). The judge line or check it names must fail, the
   others pass; "none" is the build as it is: everything passes.
   node tools/final-stage5/mutate-wp07.js [build.html] [--json out.json] [--only a,b]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), crypto=require("crypto");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..",".."), L=require(path.join(ROOT,"tools","stage8","lib.js"));
const MO=require(path.join(ROOT,"tools","visual","motion.js")), TH=require(path.join(ROOT,"tools","visual","thresholds.js"));
const html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json"&&argv[i-1]!=="--only")||path.join(ROOT,"austerlitz-command-map.html"));
const OUT=opt("--json"), ONLY=opt("--only")?opt("--only").split(","):null;
const GAP="gap", EV="event-named", BAND="band";
const M=[
  {name:"none", rep:[], fails:[]},
  {name:"no aging (the rise never reached)", fails:[GAP], rep:[['var MLAGE={MIN:15, HOLD:15,','var MLAGE={MIN:1e9, HOLD:15,']]},
  {name:"no event-named rise", fails:[EV], rep:[['  if(playing&&eventGroup&&eventGroup.visible) eventMarks.forEach(function(k){ if(!k.labelOn||!k.e.forms) return;','  if(false&&eventGroup&&eventGroup.visible) eventMarks.forEach(function(k){ if(!k.labelOn||!k.e.forms) return;']]},
  {name:"no band (250 always)", fails:[BAND], rep:[['(lodEch==="corps"?dist>CORPS_AT-CORPS_HYST:dist>CORPS_AT+CORPS_HYST):dist>CORPS_AT;','(dist>CORPS_AT):dist>CORPS_AT;']]}
];
(async()=>{
  const src=fs.readFileSync(html,"utf8"), dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-wp07-")), res={build:path.basename(html), md5:crypto.createHash("md5").update(src).digest("hex"), mutations:[]};
  const b=await L.launch(); res.chromium=b.version(); let ok=true;
  const settle=async p=>{ await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await p.waitForTimeout(450); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); };
  for(const m of M){ if(ONLY&&!ONLY.includes(m.name)&&m.name!=="none") continue;
    let s=src; for(const [a,c] of m.rep){ const n=s.split(a).length-1; if(n!==1) throw new Error(m.name+": a replacement found "+n+" times: "+a.slice(0,80)); s=s.replace(a,()=>c); }
    const f=path.join(dir,"m.html"); fs.writeFileSync(f,s); process.env.AUSTERLITZ_HTML=f; const t0=Date.now();
    let p=await L.open(b,[1366,768]); p.setDefaultTimeout(0); const errs=[]; p.on("pageerror",e=>errs.push(e.message));
    await p.evaluate(()=>{ AUSTERLITZ_DEBUG.settle(30); closeFirst(null); });
    const W=await p.evaluate(()=>wp07Checks()); await p.close();
    p=await L.open(b,[1600,900]); p.setDefaultTimeout(0); p.on("pageerror",e=>errs.push(e.message));
    const B=await MO.runBlock(p,settle,{onlyLong:true,log:()=>{}}); await p.close();
    /* the judge's long-run lines alone (the 16 are not run here) */
    const lines=[]; const LG=B.long, ML=TH.MOTION.LONG;
    LG.forEach(r=>{ const over=r.forms.filter(x=>x.playInView>=ML.MIN_FRAMES&&x.longestMin>ML.GAP_MIN); if(over.length) lines.push(GAP+": "+r.id+" "+over.map(x=>x.id+" "+x.longestMin+" min").join(", "));
      if(ML.EV_RUNS.includes(r.id)&&!(r.evShare>=ML.EV_SHARE)) lines.push(EV+": "+r.id+" "+r.evShare);
      if(r.keepHidden||r.overlapFrames||r.unknownDrawn) lines.push("invariants: "+r.id); });
    W.filter(c=>!c.ok).forEach(c=>lines.push(BAND+": "+String(c.detail).slice(0,200)));
    const failed=[...new Set(lines.map(x=>x.split(":")[0]))];
    const expected=m.fails.every(w=>failed.includes(w))&&failed.every(x=>m.fails.includes(x))&&W.length===1&&LG.length===ML.RUNS.length&&!errs.length;
    if(!expected) ok=false;
    res.mutations.push({name:m.name, expectedToFail:m.fails, failed:failed, asExpected:expected, lines:lines, long:LG.map(r=>({id:r.id, longestMin:Math.max(0,...r.forms.filter(x=>x.playInView>=ML.MIN_FRAMES).map(x=>x.longestMin)), evShare:r.evShare})), pageErrors:errs, secs:Math.round((Date.now()-t0)/1000)});
    console.log((expected?"as expected  ":"NOT EXPECTED ")+m.name.padEnd(36)+" failed: "+(failed.join("; ")||"none")+"  | "+LG.map(r=>r.id+" "+Math.max(0,...r.forms.filter(x=>x.playInView>=ML.MIN_FRAMES).map(x=>x.longestMin))+" min, ev "+r.evShare).join("; ")); }
  await b.close();
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
  console.log(ok?"all as expected":"NOT ALL AS EXPECTED"); process.exit(ok?0:1);
})().catch(e=>{ console.error(e); process.exit(1); });
