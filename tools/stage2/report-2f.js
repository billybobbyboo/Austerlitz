#!/usr/bin/env node
/* Stage 2F: the per-view table, before (the Stage 2E build) and after (the 2F build), from two runs of the harness with the
   same cases (tools/visual/cases.js):
   node tools/stage2/report-2f.js <2E harness report.json> <2F harness report.json> [--md out.md]
   2F changes how the ground is coloured (per point, not per triangle), drapes roads and streams, and adds the meres' row to
   the legend. First table: the Stage 0 measures the ground's colour moves (mean luminance, the near-black fraction); second:
   every view's map-layer measures (section J, 2D and 2E), which 2F must still meet. */
const fs=require("fs"), T=require("../visual/thresholds.js");
const [A,B]=process.argv.slice(2,4).map(p=>JSON.parse(fs.readFileSync(p,"utf8")));
const pct=v=>v==null?"-":(100*v).toFixed(1)+"%";
const names=Object.keys(B.cases);
const L=["**The ground's colour (Stage 0 measures): before (2E build) → after (2F build)**","",
  "| view | mean luminance | near-black fraction |","|---|---|---|"];
for(const n of names){ const a=A.cases[n]&&A.cases[n].pixels, b=B.cases[n].pixels;
  L.push("| "+n+" | "+(a?a.meanLum.toFixed(1):"-")+" → "+b.meanLum.toFixed(1)+" | "+(a?pct(a.nearBlack):"-")+" → "+pct(b.nearBlack)+" |"); }
L.push("","**Every view, the map layer (section J, 2D and 2E): before (2E build) → after (2F build)**","",
  "| view | overlaps | dropped (limit) | leaders | pass ms | DOM nodes | text below floor | text below AA (lowest) | unobstructed at the case's size (2C baseline) | 1280 x 720 (2C baseline) | legend over dispatch |",
  "|---|---|---|---|---|---|---|---|---|---|---|");
for(const n of names){ const a=A.cases[n], b=B.cases[n], la=a&&a.layer, lb=b.layer, U=T.UNOBSTRUCTED[n]||[];
  const ov=x=>Object.values(x.labels.pairs).reduce((p,q)=>p+q,0), tc=x=>x.textContrast?x.textContrast.belowAA.length+" ("+x.textContrast.min+")":"-";
  L.push("| "+n+" | "+(a?ov(a):"-")+" → "+ov(b)+" | "+(la?la.dropped:"-")+" → "+lb.dropped+" ("+T.DROP_LIMIT[n]+") | "+(la?la.leaders:"-")+" → "+lb.leaders+
    " | "+(la?la.ms:"-")+" → "+lb.ms+" | "+(la?la.nodes:"-")+" → "+lb.nodes+" | "+(la?la.belowFloor.length+"/"+la.texts:"-")+" → "+lb.belowFloor.length+"/"+lb.texts+
    " | "+(a?tc(a):"-")+" → "+tc(b)+" | "+(a?pct(a.unobstructed):"-")+" → "+pct(b.unobstructed)+" ("+pct(U[0])+") | "+(a?pct(a.unobstructed720):"-")+" → "+pct(b.unobstructed720)+" ("+pct(U[1])+")"+
    " | "+(a?Math.round(a.legendOverDispatch||0):"-")+" → "+Math.round(b.legendOverDispatch||0)+" px |"); }
const out=L.join("\n")+"\n";
console.log(out);
const k=process.argv.indexOf("--md"); if(k>0) fs.writeFileSync(process.argv[k+1],out);
