#!/usr/bin/env node
/* The final audits' Stage 5, WP-08 (CL-MAP-13): the narrow block's read "dossier at 1000, rail hidden" on a build, judged by thresholds.js checkLive's
   line for it alone (at 1000 x 800, the rail hidden as at load below 1080 px, Saint-Hilaire's dossier open: no dispatch card beside it). Its negative
   control is main's build at c1222e3: it must fail, WP-08's build pass.
   node tools/final-stage5/card-judge.js <build.html>
   Measurement only. */
"use strict";
const path=require("path"), ROOT=path.resolve(__dirname,"..","..");
process.env.AUSTERLITZ_HTML=path.resolve(process.argv[2]||path.join(ROOT,"austerlitz-command-map.html"));
const L=require(path.join(ROOT,"tools","stage8","lib.js")), T=require(path.join(ROOT,"tools","visual","thresholds.js"));
(async()=>{ const b=await L.launch(), p=await L.open(b,[1000,800]); p.setDefaultTimeout(0);
  await p.evaluate(()=>{ AUSTERLITZ_DEBUG.settle(30); closeFirst(null); setPresentation("study"); });
  const r=await p.evaluate(()=>{ setPanels(false); select("f","sthilaire");
    const d=document.querySelector(".dispatch"), b=d.getBoundingClientRect(), dr=document.getElementById("drawer").getBoundingClientRect();
    const card=getComputedStyle(d).display!=="none"&&b.width>0;
    return {docked:docked, open:drawerShown(), rail:!document.body.classList.contains("rail-hidden"), card:card, gap:card?+(dr.left-b.right).toFixed(1):null}; });
  await b.close();
  const f=T.checkLive({narrow:[Object.assign({at:"dossier at 1000, rail hidden"},r)]},{}).filter(x=>/CL-MAP-13/.test(x));
  console.log(JSON.stringify(r)+"\n"+(f.length?f.join("\n"):"passes")); process.exit(f.length?1:0); })().catch(e=>{ console.error(e); process.exit(2); });
