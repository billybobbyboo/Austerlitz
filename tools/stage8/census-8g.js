#!/usr/bin/env node
/* Stage 8, implementation PR 8H (docs/STAGE8_SPEC.md section 19.6, written in 8H): implementation PR 8G's building census, read from two
   check:visual reports as CI made them (each report's census, tools/visual/measure.js census: one whole frame by pass and by what is drawn,
   reconciled with renderer.info; "onWarm", the frame with culling on as a visitor's page draws it, the depth for the overlays reused): per
   case, the frame's draw calls and triangles, and those of the buildings (houses, roofs, chimneys, spires, walls and fences: both passes),
   on the build before and the build after, with the differences; the phone cases' too (their own budget, section 8.3).
   node tools/stage8/census-8g.js --before <report.json> --after <report.json> [--state onWarm] [--out file.json] [--md file.md]
   Reads files only; measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const A=JSON.parse(fs.readFileSync(opt("--before"),"utf8")), B=JSON.parse(fs.readFileSync(opt("--after"),"utf8")), ST=opt("--state")||"onWarm";
const BLD=/^(shadow|world) \| (houses|roofs|chimneys|spires|walls and fences)$/;
function sum(c){ if(!c||!c.census||!c.census[ST]) return null; const C=c.census[ST], o={calls:C.calls, tris:C.tris, bCalls:0, bTris:0, bShadowTris:0, byKind:{}};
  Object.entries(C.byWhat||{}).forEach(([k,v])=>{ const m=BLD.exec(k); if(!m) return; o.bCalls+=v.calls||0; o.bTris+=v.tris||0; if(m[1]==="shadow") o.bShadowTris+=v.tris||0;
    const K=m[2]; o.byKind[K]=o.byKind[K]||{calls:0,tris:0}; o.byKind[K].calls+=v.calls||0; o.byKind[K].tris+=v.tris||0; });
  o.lowTier=C.lowTier; o.shadow=C.shadow; o.factor=C.factor; o.mode=C.mode; o.reconciled=C.reconciled; return o; }
const out={tool:"tools/stage8/census-8g.js", state:ST, before:{md5:A.md5, chromium:A.env&&A.env.chromium, when:A.when}, after:{md5:B.md5, chromium:B.env&&B.env.chromium, when:B.when}, cases:{}};
Object.keys(B.cases).forEach(k=>{ const a=sum(A.cases[k]), b=sum(B.cases[k]); if(!a||!b) return;
  out.cases[k]={before:a, after:b, d:{calls:b.calls-a.calls, tris:b.tris-a.tris, bCalls:b.bCalls-a.bCalls, bTris:b.bTris-a.bTris, trisPct:+(100*(b.tris-a.tris)/a.tris).toFixed(2)}}; });
const rows=Object.entries(out.cases), num=x=>x.toLocaleString("en-GB");
out.summary={cases:rows.length, framesMoreTris:rows.filter(([k,v])=>v.d.tris>0).length, largestTrisPct:Math.max(...rows.map(([k,v])=>v.d.trisPct)), largestBuildingTris:Math.max(...rows.map(([k,v])=>v.after.bTris)),
  maxCallsDesktop:Math.max(...rows.filter(([k,v])=>!v.after.lowTier).map(([k,v])=>v.after.calls)), maxTrisDesktop:Math.max(...rows.filter(([k,v])=>!v.after.lowTier).map(([k,v])=>v.after.tris)),
  maxTrisPhone:Math.max(...rows.filter(([k,v])=>v.after.lowTier).map(([k,v])=>v.after.tris).concat([0]))};
if(opt("--out")) fs.writeFileSync(opt("--out"),JSON.stringify(out,null,1));
const md=["| case | frame calls (before, after) | frame triangles (before, after, change) | buildings' calls (before, after) | buildings' triangles (before, after; in the shadow pass after) |","|---|---|---|---|---|"]
  .concat(rows.map(([k,v])=>"| "+k+(v.after.lowTier?" (low tier)":"")+" | "+v.before.calls+", "+v.after.calls+" | "+num(v.before.tris)+", "+num(v.after.tris)+", "+(v.d.tris>=0?"+":"")+num(v.d.tris)+" ("+(v.d.trisPct>=0?"+":"")+v.d.trisPct+"%) | "+v.before.bCalls+", "+v.after.bCalls+" | "+num(v.before.bTris)+", "+num(v.after.bTris)+"; "+num(v.after.bShadowTris)+" |"));
if(opt("--md")) fs.writeFileSync(opt("--md"),md.join("\n")+"\n");
console.log(JSON.stringify(out.summary)); console.log(md.slice(0,8).join("\n"));
