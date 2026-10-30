#!/usr/bin/env node
/* Stage 8, the follow-up 8I (docs/STAGE8_SPEC.md section 21; the audit of 8H's build): the render census of one or two check:visual reports with
   both of its frames named, never one for the other. tools/visual/measure.js census records four frames per case (harness.js): with culling and
   without, each with the ground's depth for the overlays reused ("Warm": the eye still since the last frame, the depth pass skipped) and drawn
   again ("Cold": the complete frame, as after any move of the eye). 8H's headline (section 20.12, tools/stage8/census-8g.js's default, "onWarm")
   was the still eye's; the acceptance checks (tools/visual/thresholds.js, section 8.3's budget) judge "onCold", the complete frame. Here, per case:
   the complete frame's calls and triangles (onCold), the still eye's (onWarm), the depth pass's share between them; the maxima over the cases of
   each, by tier (the desktop's, the phone's low tier), each a maximum over cases separately (the most calls and the most triangles need not be one
   frame); and the headroom against section 8.3's budgets taken from the complete frame (the desktop 900 calls and 2.8 million triangles, the phone
   1.62 million triangles). Geometry counts only: no frame time here (the device routes measure those).
   node tools/stage8/census-8i.js --after <report.json> [--before <report.json>] [--out file.json] [--md file.md]
   Reads files only; measurement code only. */
"use strict";
const fs=require("fs");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const B=JSON.parse(fs.readFileSync(opt("--after"),"utf8")), A=opt("--before")?JSON.parse(fs.readFileSync(opt("--before"),"utf8")):null;
const BUDGET={desktop:{calls:900, tris:2800000}, phone:{tris:1620000}};   /* section 8.3 (tools/visual/thresholds.js CENSUS) */
function one(c){ const C=c&&c.census; if(!C||!C.onCold||!C.onWarm) return null;
  return {lowTier:!!C.onCold.lowTier, cold:{calls:C.onCold.calls, tris:C.onCold.tris}, warm:{calls:C.onWarm.calls, tris:C.onWarm.tris},
    depth:{calls:C.onCold.calls-C.onWarm.calls, tris:C.onCold.tris-C.onWarm.tris}, reconciled:[C.onCold,C.onWarm].every(x=>x.reconciled)}; }
function maxima(cases){ const out={}; ["desktop","phone"].forEach(t=>{ const R=Object.entries(cases).filter(([k,v])=>(t==="phone")===v.lowTier);
  if(!R.length) return; const mx=(s,f)=>{ let best=null; R.forEach(([k,v])=>{ if(!best||v[s][f]>best.v) best={v:v[s][f], at:k}; }); return best; };
  out[t]={cases:R.length, complete:{calls:mx("cold","calls"), tris:mx("cold","tris")}, still:{calls:mx("warm","calls"), tris:mx("warm","tris")}};
  const b=BUDGET[t], c=out[t].complete; out[t].headroom={};
  if(b.calls) out[t].headroom.calls={budget:b.calls, used:c.calls.v, left:b.calls-c.calls.v, pct:+(100*(b.calls-c.calls.v)/b.calls).toFixed(1)};
  out[t].headroom.tris={budget:b.tris, used:c.tris.v, left:b.tris-c.tris.v, pct:+(100*(b.tris-c.tris.v)/b.tris).toFixed(1)}; }); return out; }
function read(R){ const cases={}; Object.keys(R.cases||{}).forEach(k=>{ const o=one(R.cases[k]); if(o) cases[k]=o; }); return {md5:R.md5, chromium:R.env&&R.env.chromium, when:R.when, cases:cases, maxima:maxima(cases)}; }
const out={tool:"tools/stage8/census-8i.js", states:{complete:"onCold: culling on, the ground's depth drawn again (the complete frame; what section 8.3's budget judges)",
  still:"onWarm: culling on, the ground's depth reused (the frame drawn while the eye stands still)"}, budgets:BUDGET, after:read(B), before:A?read(A):null};
const num=x=>x==null?"-":x.toLocaleString("en-GB");
const md=[];
const table=(S,title)=>{ md.push("### "+title+" (md5 "+S.md5+", Chromium "+S.chromium+")","","| case | complete frame: calls | complete frame: triangles | still eye: calls | still eye: triangles | the depth pass: calls, triangles |","|---|---|---|---|---|---|");
  Object.entries(S.cases).forEach(([k,v])=>md.push("| "+k+(v.lowTier?" (low tier)":"")+" | "+v.cold.calls+" | "+num(v.cold.tris)+" | "+v.warm.calls+" | "+num(v.warm.tris)+" | "+v.depth.calls+", "+num(v.depth.tris)+" |"));
  md.push("");
  Object.entries(S.maxima).forEach(([t,m])=>{ md.push("- **"+t+"** ("+m.cases+" cases), maxima over the cases, each separately: the complete frame "+m.complete.calls.v+" calls ("+m.complete.calls.at+") and "+num(m.complete.tris.v)+" triangles ("+m.complete.tris.at+"); the still eye "+m.still.calls.v+" calls ("+m.still.calls.at+") and "+num(m.still.tris.v)+" triangles ("+m.still.tris.at+"). Headroom from the complete frame: "+
    (m.headroom.calls?m.headroom.calls.left+" calls of "+m.headroom.calls.budget+" ("+m.headroom.calls.pct+"%), ":"")+num(m.headroom.tris.left)+" triangles of "+num(m.headroom.tris.budget)+" ("+m.headroom.tris.pct+"%)."); });
  md.push(""); };
if(out.before) table(out.before,"Before");
table(out.after,"After");
if(out.before){ md.push("### The complete frame, before and after","","| case | calls (before, after) | triangles (before, after, change) |","|---|---|---|");
  Object.keys(out.after.cases).forEach(k=>{ const a=out.before.cases[k], b=out.after.cases[k]; if(!a||!b) return;
    md.push("| "+k+(b.lowTier?" (low tier)":"")+" | "+a.cold.calls+", "+b.cold.calls+" | "+num(a.cold.tris)+", "+num(b.cold.tris)+", "+(b.cold.tris-a.cold.tris>=0?"+":"")+num(b.cold.tris-a.cold.tris)+" ("+(100*(b.cold.tris-a.cold.tris)/a.cold.tris).toFixed(2)+"%) |"); });
  md.push(""); }
if(opt("--out")) fs.writeFileSync(opt("--out"),JSON.stringify(out,null,1));
if(opt("--md")) fs.writeFileSync(opt("--md"),md.join("\n"));
Object.entries(out.after.maxima).forEach(([t,m])=>console.log(t+": complete frame max "+m.complete.calls.v+" calls ("+m.complete.calls.at+"), "+m.complete.tris.v+" tris ("+m.complete.tris.at+"); still eye max "+m.still.calls.v+" calls, "+m.still.tris.v+" tris; headroom "+JSON.stringify(m.headroom)));
