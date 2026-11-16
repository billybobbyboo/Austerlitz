#!/usr/bin/env node
/* UI/UX roadmap step 3: a motion block's record (tools/stage8/motion-8h.js --json, its page of its own) judged by thresholds.js checkLive's motion
   part alone (the other live blocks' "not run" lines left out), with the runs a Play drives under Follow listed beside their baselines.
   node tools/ux-step3/motion-judge.js <motion.json> [--selftest] */
"use strict";
const path=require("path"), fs=require("fs"), T=require(path.join(__dirname,"..","visual","thresholds.js"));
const f=process.argv[2], so=process.argv.includes("--selftest"), R=JSON.parse(fs.readFileSync(f,"utf8"));
const out=T.checkLive({motion:R},{selftestOnly:so}).filter(x=>!/^live block not run/.test(x));
console.log(R.md5+" "+(R.selftestOnly?"(the self-test's set)":"(check:visual's set)")+": the 16 "+JSON.stringify(R.totals)+"; limits jumps "+T.MOTION.JUMPS+", pops "+T.MOTION.POPS+", flickers "+T.MOTION.FLICKER+", switches "+T.MOTION.LOD);
R.runs.filter(r=>/play|long|3600/.test(r.key||r.id)).forEach(r=>{ const k=r.key||r.id, b=T.MOTION.VIS[k]; console.log("  "+k.padEnd(26)+" in view "+r.track.inView+", drawn "+r.track.on+", longest "+r.track.longestMs+" ms"+(b?"; baseline "+JSON.stringify(b):"")+"; jumps "+r.jumps+", pops "+r.pops+", flickers "+r.flicker+", switches "+r.lod+(r.ev?"; event-named drawn "+JSON.stringify(r.ev):"")); });
(R.long||[]).forEach(r=>console.log("  long "+JSON.stringify(r).slice(0,400)));
console.log(out.length?"FAILED ("+out.length+"):\n  "+out.join("\n  "):"the motion block: every check passed");
