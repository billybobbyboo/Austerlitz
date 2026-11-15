#!/usr/bin/env node
/* UI/UX roadmap step 2: the acceptance runs' table (Markdown), from the summaries tools/ux-step2/probe.js wrote: each run on the base build and
   on this one, side by side. node tools/ux-step2/report.js <dir with base-*.json and step2-*.json> */
"use strict";
const fs=require("fs"), path=require("path"), dir=path.resolve(process.argv[2]);
const pc=x=>x===null||x===undefined?"n/a":(100*x).toFixed(1)+"%", J=f=>JSON.parse(fs.readFileSync(path.join(dir,f),"utf8"));
const runs=fs.readdirSync(dir).filter(f=>/^step2-.*\.json$/.test(f)&&!/-frames\.json$/.test(f)).map(f=>f.slice(6,-5)).sort();
const order=["desk-study-0830-0930","desk-watch-0830-0930","phone-study-0830-0930","phone-watch-0830-0930","desk-study-1130-1300","desk-watch-1130-1300","phone-study-1130-1300","phone-watch-1130-1300"];
const R=order.filter(r=>runs.includes(r)).concat(runs.filter(r=>!order.includes(r)));
const name=r=>r.replace(/^desk-/,"1440 x 900, ").replace(/^phone-/,"390 x 844 (phone), ").replace("study","Study").replace("watch","Watch").replace("counters","Landscape with counters").replace("paper","Paper map").replace("-fr"," (Napoleon's reading)").replace("-al"," (the Allied reading)").replace(/-(\d\d)(\d\d)-(\d\d)(\d\d)$/,", $1:$2 to $3:$4");
console.log("| Run (frames) | Build | Filled plates over the formations' box: max / median / frames over 12% | Labels drawn: max / median; on a fill: max | Tier 3 fills | Event-named formations drawn of those in view | Label pass: median / 95th (ms) |");
console.log("|---|---|---|---|---|---|---|");
R.forEach(r=>{ ["base","step2"].forEach(b=>{ const f=b+"-"+r+".json"; if(!fs.existsSync(path.join(dir,f))) return; const o=J(f), c=o.coverage, d=o.drawn, e=o.events;
  console.log("| "+(b==="base"?name(r)+" ("+o.frames+")":"")+" | "+(b==="base"?"Step 1":"**Step 2**")+" | "+pc(c.max)+" / "+pc(c.median)+" / "+c.over12+" of "+c.frames+" | "+d.max+" / "+d.median+"; "+d.fillsMax+" | "+c.tier3FillsMax+
    " | "+e.drawn+" of "+e.inView+" ("+pc(e.share)+")"+" | "+o.layerMs.median+" / "+o.layerMs.p95+" |"); }); });
console.log("\n| Run | Build | Texts read at full opacity (frames drawn) | Tier 3 against its casing: min / 10th pct / below 4.5 | Tier 3, the words' whole box: median / below 4.5 | Tier 3, the bare ground: median / below 4.5 | Every text, as its surface gives it: min / below 4.5 |");
console.log("|---|---|---|---|---|---|---|");
R.forEach(r=>{ ["base","step2"].forEach(b=>{ const f=b+"-"+r+".json"; if(!fs.existsSync(path.join(dir,f))) return; const o=J(f), k=o.contrast; if(!k.samples) return; const t=k.tier3;
  console.log("| "+(b==="base"?name(r):"")+" | "+(b==="base"?"Step 1":"**Step 2**")+" | "+(k.texts-k.fading)+" ("+k.samples+")"+" | "+(t.ring.n?t.ring.min+" / "+t.ring.p10+" / "+t.ring.below+" of "+t.ring.n:"none drawn")+" | "+(t.box.n?t.box.median+" / "+t.box.below+" of "+t.box.n:"-")+" | "+(t.bare.n?t.bare.median+" / "+t.bare.below+" of "+t.bare.n:"-")+
    " | "+k.all.ring.min+" / "+k.all.ring.below+" of "+k.all.ring.n+" |"); }); });
console.log("\nThe formations a live event names, by event (this build):");
R.forEach(r=>{ const f="step2-"+r+".json"; if(!fs.existsSync(path.join(dir,f))) return; const o=J(f), e=o.events; console.log("\n- **"+name(r)+"**: drawn "+e.drawn+" of "+e.inView+" in view over "+e.frames+" frames of Play; not drawn: behind the ground "+e.miss.occluded+", no room "+e.miss.placement+", Watch's set "+e.miss.calm+"; outside the measure: off the screen "+e.out.offscreen+", under a panel "+e.out.panel+", not known to the reading "+e.out.reading+", not on the field "+e.out.field+", no name at that distance "+e.out.lod+", a corps (no name of its own) "+e.out.aggregate+".");
  Object.keys(e.by).forEach(id=>{ const B=e.by[id]; console.log("  - `"+id+"`: label drawn "+B.frames+" frames; its formations drawn "+B.drawn+" of "+B.inView+(Object.keys(B.miss).length?"; misses "+JSON.stringify(B.miss):"")+(Object.keys(B.out).length?"; outside "+JSON.stringify(B.out):"")); }); });
