#!/usr/bin/env node
/* Stage 2E: the per-view table, before (the Stage 2D build, whose paper map is the tilted perspective staff map) and after
   (the true north-up paper map), from two runs of the harness with the same cases (tools/visual/cases.js):
   node tools/stage2/report-2e.js <2D harness report.json> <2E harness report.json> [--md out.md]
   The 2D build frames a paper case by its cam (paper-north-up and paper-laptop: the Overview vantage) or its aim; the 2E
   build frames paper:"frame" cases by MAPCAM. First table: section J's 2E measures (the paper views); second: every view's
   map-layer measures (section J, 2D), which 2E must still meet. */
const fs=require("fs"), T=require("../visual/thresholds.js");
const [A,B]=process.argv.slice(2,4).map(p=>JSON.parse(fs.readFileSync(p,"utf8")));
const pct=v=>v==null?"-":(100*v).toFixed(1)+"%";
const L=["**The paper map (section J, 2E): before (2D build) → after (2E build)**","",
  "| view | camera | north on screen | px per true km (4 places) | spread | scale bar | field on screen / in the unobstructed area | 3D objects drawn | missing |",
  "|---|---|---|---|---|---|---|---|---|"];
const names=Object.keys(B.cases);
for(const n of names){ const a=A.cases[n]&&A.cases[n].paper, b=B.cases[n].paper; if(!b) continue;
  const k=x=>Object.values(x.pxPerKm).map(v=>v.toFixed(1)).join(" / "), sb=x=>x.scaleBar.label+" "+x.scaleBar.px+" px (want "+x.scaleBar.want+", "+(100*x.scaleBar.err).toFixed(2)+"%)";
  const miss=x=>{ const m=Object.keys(x.drawn).filter(q=>!x.drawn[q]); return m.length?m.join(", "):"none"; };
  const hid=x=>x.hidden.length?x.hidden.length+" ("+[...new Set(x.hidden.map(h=>h.split(":")[0]))].join(", ")+")":"0";
  L.push("| "+n+" | "+(a?a.camera:"-")+" → "+b.camera+" | "+(a?a.northBearing.toFixed(2)+"°":"-")+" → "+b.northBearing.toFixed(2)+"° | "+(a?k(a):"-")+" → "+k(b)+
    " | "+(a?(100*a.spread).toFixed(2)+"%":"-")+" → "+(100*b.spread).toFixed(2)+"% | "+(a?sb(a):"-")+" → "+sb(b)+
    " | "+(a?pct(a.frameOnScreen)+" / "+pct(a.frameInFree):"-")+" → "+pct(b.frameOnScreen)+" / "+pct(b.frameInFree)+
    " | "+(a?hid(a):"-")+" → "+hid(b)+" | "+(a?miss(a):"-")+" → "+miss(b)+" |"); }
L.push("","**Every view, the map layer (section J, 2D): before (2D build) → after (2E build)**","",
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
