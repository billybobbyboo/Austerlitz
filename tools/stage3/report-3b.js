#!/usr/bin/env node
/* Stage 3B: per harness view, before (the Stage 2F build) and after (the 3B build), from two harness reports
   (tools/visual/harness.js <build> <out> writes <out>/report.json and one PNG per view). Changes nothing.
   node tools/stage3/report-3b.js <before-out-dir> <after-out-dir> [--md out.md] [--sheet out.jpg]
   The sheet puts six views side by side, before (left) and after (right), from the harness's own screenshots. */
const fs=require("fs"), path=require("path");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const [A,B]=args.filter(a=>!a.startsWith("--")&&a!==opt("--md")&&a!==opt("--sheet"));
const ra=JSON.parse(fs.readFileSync(path.join(A,"report.json"),"utf8")), rb=JSON.parse(fs.readFileSync(path.join(B,"report.json"),"utf8"));
const T=require("../visual/thresholds.js");
const pc=x=>x==null?"-":(100*x).toFixed(1)+"%", km=m=>m&&m.paper?m.paper.pxPerKm.pratzeberg.toFixed(1):"-";
const md=["# Stage 3B: per harness view, before (Stage 2F, "+ra.md5.slice(0,8)+") and after (3B, "+rb.md5.slice(0,8)+")\n",
  "From the two harness reports (`tools/visual/harness.js`), by `tools/stage3/report-3b.js`. Unobstructed: the Stage 2 section H measure at the case's viewport and at 1280 x 720. Dropped: the map layer's drops against `DROP_LIMIT`. Paper map: screen px per true km at the Pratzeberg.\n",
  "| view | unobstructed, case viewport | at 1280 x 720 | dropped (limit) | paper map px/km | the dispatch | legend | legend over rail, dossier or timebar (px) | layer pass ms | lowest map-text contrast |",
  "|---|---|---|---|---|---|---|---|---|---|"];
Object.keys(rb.cases).forEach(k=>{ const a=ra.cases[k]||{}, b=rb.cases[k], L=T.DROP_LIMIT[k];
  const where=m=>m&&m.docking&&m.docking.hasNowTab?(m.dispatchVisible?(m.docking.dispatchInRail?"Now tab":"card"):"hidden"):(m&&m.dispatchVisible?"card":"hidden");
  const lg=m=>m&&m.docking&&m.docking.hasNowTab?(m.docking.legendOpen?"open":"closed"):"open (default)";
  md.push("| "+k+" | "+pc(a.unobstructed)+" → "+pc(b.unobstructed)+" | "+pc(a.unobstructed720)+" → "+pc(b.unobstructed720)+" | "+
    (a.layer?a.layer.dropped:"-")+" → "+(b.layer?b.layer.dropped:"-")+(L!==undefined?" ("+L+")":"")+" | "+km(a)+" → "+km(b)+" | "+where(a)+" → "+where(b)+" | "+
    lg(a)+" → "+lg(b)+" | "+(b.legendOverPanels!==undefined?Math.round(b.legendOverPanels):"-")+" | "+(a.layer?a.layer.ms:"-")+" → "+(b.layer?b.layer.ms:"-")+" | "+
    (a.textContrast?a.textContrast.min:"-")+" → "+(b.textContrast?b.textContrast.min:"-")+" |"); });
md.push("\nFailures in the after report: "+(rb.failures&&rb.failures.length?rb.failures.join("; "):"none")+".");
if(rb.selfTest&&rb.selfTest.checks){ const C=rb.selfTest.checks; md.push("Self-test (after): "+C.filter(c=>c.ok).length+" of "+C.length+" pass"+(C.some(c=>!c.ok)?"; FAILED: "+C.filter(c=>!c.ok).map(c=>c.name).join("; "):"")+", in "+Math.round(rb.selfTest.ms/1000)+" s."); }
const out=md.join("\n")+"\n";
if(opt("--md")) fs.writeFileSync(opt("--md"),out); else process.stdout.write(out);
if(opt("--sheet")){ (async()=>{ const {launch,sheet}=require("../stage2/page.js"); const br=await launch(), pg=await br.newPage();
  const V=["overview-field","selected-formation","paper-north-up","paper-laptop","paper-drawer","narrow-1024"], tiles=[];
  V.forEach(v=>[[A,"before"],[B,"3B"]].forEach(([d,c])=>{ const f=path.join(d,v+".png"); if(fs.existsSync(f)) tiles.push({png:fs.readFileSync(f),cap:v+" · "+c}); }));
  fs.writeFileSync(opt("--sheet"),await sheet(pg,tiles,2,800,450,"Stage 3B: the Stage 2F build (left) and the docked layout (right), from the harness's screenshots",true));
  await br.close(); })(); }
