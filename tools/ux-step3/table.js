#!/usr/bin/env node
/* UI/UX roadmap step 3: framing.js's summaries side by side, one row a run (Markdown), with the events under 90% named.
   node tools/ux-step3/table.js <summary.json>... [--events] */
"use strict";
const fs=require("fs"), argv=process.argv.slice(2), files=argv.filter(a=>a.endsWith(".json")), EV=argv.includes("--events");
const S=files.map(f=>JSON.parse(fs.readFileSync(f,"utf8")));
const pc=x=>x===null||x===undefined?"-":(100*x).toFixed(1)+"%";
console.log("| run | event-minutes inside | live minutes, all inside | events under 90% | box median | box at goal | formations in the free map (median, min) | eye: units, degrees | ground's move: max, p95 (px/s) | target max (px/s) | rich blocks: median, max | names in the layer / drawn (median) | filled plates over the box: median, max |");
console.log("|---|---|---|---|---|---|---|---|---|---|---|---|---|");
S.forEach(s=>{ const u=Object.keys(s.events).filter(id=>s.events[id].share<0.9).map(id=>id+" "+Math.round(100*s.events[id].share)+"%");
  console.log("| "+s.tag+" | "+s.eventMinutes.inside+" of "+s.eventMinutes.total+" ("+pc(s.eventMinutes.share)+") | "+s.live.all+" of "+s.live.minutes+" ("+pc(s.live.allShare)+") | "+(u.join(", ")||"none")+" | "+pc(s.box.median)+" | "+pc(s.box.atGoal)+" (goal "+(100*s.box.goal)+"%) | "+
    s.formations.inFreeMedian+", "+s.formations.inFreeMin+" (of "+s.formations.onFieldMedian+") | "+s.cam.dMedian+", "+s.cam.elMedian+" | "+s.motion.flowMax+", "+s.motion.flowP95+(s.motion.voffFrames?" ("+s.motion.flowMaxNoVoff+" without the "+s.motion.voffFrames+" frames the view offset moved)":"")+" | "+s.motion.targetMax+(s.motion.voffFrames?" ("+s.motion.targetMaxNoVoff+")":"")+" | "+s.kit.richMedian+", "+s.kit.richMax+" | "+s.labels.namesMedian+" / "+s.labels.namesOnMedian+" | "+pc(s.fillCover.median)+", "+pc(s.fillCover.max)+" |"); });
if(EV){ const ids=[...new Set([].concat(...S.map(s=>Object.keys(s.events))))];
  console.log("\n| event | "+S.map(s=>s.tag).join(" | ")+" |\n|---|"+S.map(()=>"---|").join(""));
  ids.forEach(id=>console.log("| "+id+" | "+S.map(s=>{ const e=s.events[id]; if(!e) return "-"; const w=Object.keys(e.why).map(k=>k+" "+e.why[k]).join(", "); return e.inside+" of "+e.minutes+" ("+Math.round(100*e.share)+"%)"+(w?"; out: "+w:""); }).join(" | ")+" |")); }
