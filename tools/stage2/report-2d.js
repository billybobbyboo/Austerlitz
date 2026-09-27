#!/usr/bin/env node
/* Stage 2D: the per-view table, before (the Stage 0 canvas pass, on the Stage 2C build) and after (the map layer).
   node tools/stage2/report-2d.js <2C harness report.json> <dom-layer dom.json on 2C> <map-text.json on 2C> <2D harness report.json> [--md out.md]
   before: overlaps and the unobstructed fraction from the harness run on archive/stage2c-68ac7721.html (CSS transitions off);
   hidden, moved and the declutter pass time from tools/stage2/dom-layer.js ("canvas today"); sizes and contrast from
   tools/stage2/map-text.js (the section E method on the sprites). after: the harness run on the 2D build (measure.js). */
const fs=require("fs"), T=require("../visual/thresholds.js");
const [A,D,M,B]=process.argv.slice(2,6).map(p=>JSON.parse(fs.readFileSync(p,"utf8")));
const pct=v=>v==null?"-":(100*v).toFixed(1)+"%";
const L=["| view | overlaps | dropped (limit) | leaders | pass ms | DOM nodes | text below floor | text below AA (lowest) | unobstructed 1600 x 900 or case | 1280 x 720 | legend over dispatch |",
         "|---|---|---|---|---|---|---|---|---|---|---|"];
const names=Object.keys(B.cases);
for(const n of names){
  const a=A.cases[n], d=D[n]&&D[n].canvasToday, m=M.cases[n], b=B.cases[n], l=b.layer, tc=b.textContrast;
  const ov=x=>Object.values(x.labels.pairs).reduce((p,q)=>p+q,0);
  let mn=99; if(m) Object.values(m.perCat).forEach(c=>{ if(c.runs) mn=Math.min(mn,c.minContrast); });
  L.push("| "+n+" | "+ov(a)+" → "+ov(b)+" | "+(d?d.stats.hidden:"-")+" hidden → "+l.dropped+" ("+T.DROP_LIMIT[n]+") | "+(d?d.stats.moved:"-")+" moved → "+l.leaders+
    " | "+(d?d.declutterMs:"-")+" → "+l.ms+" | 0 → "+l.nodes+" | "+(m?m.belowFloor+"/"+m.runs:"-")+" → "+l.belowFloor.length+"/"+l.texts+
    " | "+(m?m.belowAA+" ("+mn.toFixed(2)+")":"-")+" → "+(tc?tc.belowAA.length+" ("+tc.min+")":"-")+
    " | "+pct(a.unobstructed)+" → "+pct(b.unobstructed)+" | "+pct(a.unobstructed720)+" → "+pct(b.unobstructed720)+
    " | "+Math.round(a.legendOverDispatch||0)+" → "+Math.round(b.legendOverDispatch||0)+" px |");
}
const out=L.join("\n")+"\n";
console.log(out);
const k=process.argv.indexOf("--md"); if(k>0) fs.writeFileSync(process.argv[k+1],out);
