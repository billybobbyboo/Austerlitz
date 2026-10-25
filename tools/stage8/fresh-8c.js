#!/usr/bin/env node
/* Stage 8, implementation PR 8C (decision 240 (a); docs/STAGE8_SPEC.md sections 3.4 and 15): a view reached without motion is laid out exactly as
   the build before 8C lays it out. Every case of tools/visual/cases.js the harness applies by its case spec (not the fresh pages, the phone
   cases, the device cases, the interactions or the opening's), applied and settled as the harness applies and settles it, on each of two builds;
   for each case every item of the map layer: its state, its box (to the pixel) and its leader, the drops and their ids, compared. The far step
   (section 7.2) draws some names smaller inside the box their own size gives them; the boxes compared are the layout's.
   node tools/stage8/fresh-8c.js --ref ref.html --cand cand.html [--json out.json]
   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), CASES=require(path.join(L.ROOT,"tools","visual","cases.js"));
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const REF=path.resolve(opt("--ref")), CAND=path.resolve(opt("--cand")), OUT=opt("--json");
async function layouts(browser,html){
  process.env.AUSTERLITZ_HTML=html; const pages={}, out={};
  for(const c of CASES){ if(c.fresh||c.phone||c.device||c.interact||c.opening!==undefined) continue;
    const key=c.viewport.join("x"); if(!pages[key]) pages[key]=await L.open(browser,c.viewport,{});
    const p=pages[key];
    await p.evaluate(s=>window.__aus.apply(s),c); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await p.waitForTimeout(450); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2));
    out[c.name]=await p.evaluate(()=>{ mlLayout(); const S=ML.stats, items={};
      for(const k in ML.items){ const it=ML.items[k]; if(it.eFrame!==ML.frame) continue; items[k]=[it.state, it.state==="on"?it.rect.map(v=>Math.round(v)).join(","):"", it.lead?1:0]; }
      return {placed:S.placed, dropped:S.dropped, ids:S.dropped_.slice().sort(), items:items, far:typeof MLS!=="undefined"?MLS.stats.far:null}; }); }
  for(const k in pages) await pages[k].close();
  return out;
}
(async()=>{
  const browser=await L.launch(), A=await layouts(browser,REF), B=await layouts(browser,CAND), res={ref:path.basename(REF), cand:path.basename(CAND), chromium:browser.version(), cases:{}};
  await browser.close();
  let same=0, diff=0;
  Object.keys(A).forEach(n=>{ const a=A[n], b=B[n], d=[];
    if(!b){ d.push("not laid out on the candidate"); }
    else { if(a.placed!==b.placed||a.dropped!==b.dropped) d.push("placed/dropped "+a.placed+"/"+a.dropped+" -> "+b.placed+"/"+b.dropped);
      if(a.ids.join(",")!==b.ids.join(",")) d.push("dropped ids differ");
      new Set(Object.keys(a.items).concat(Object.keys(b.items))).forEach(k=>{ const x=a.items[k], y=b.items[k]; if(!x||!y||x.join("|")!==y.join("|")) d.push(k+": "+(x?x.join(" "):"-")+" -> "+(y?y.join(" "):"-")); }); }
    res.cases[n]={items:Object.keys(a.items).length, placed:a.placed, dropped:a.dropped, ids:a.ids, far:b?b.far:null, differences:d};
    if(d.length) diff++; else same++;
    console.log(n.padEnd(20),Object.keys(a.items).length+" items, placed "+a.placed+", dropped "+a.dropped+(b&&b.far?", "+b.far+" drawn at the far step":"")+": "+(d.length?"DIFFERENT "+d.slice(0,4).join("; "):"identical")); });
  res.identical=same; res.different=diff;
  console.log(same+" cases identical, "+diff+" different");
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
  if(diff) process.exitCode=1;
})().catch(e=>{ console.error(e); process.exit(1); });
