#!/usr/bin/env node
/* Before/after gallery from two harness runs.
   node tools/visual/compare-gallery.js <beforeDir> <afterDir> <outDir>
   Writes <outDir>/gallery.html (the two builds side by side, case by case, with the measurements)
   and <outDir>/compare/<case>.png (one image per case, rendered from that page). */
const fs=require("fs"), path=require("path"), {chromium}=require("playwright");
const [bd,ad,od]=process.argv.slice(2).map(p=>path.resolve(p));
const B=JSON.parse(fs.readFileSync(path.join(bd,"report.json"))), A=JSON.parse(fs.readFileSync(path.join(ad,"report.json")));
const CASES=require("./cases.js");
fs.mkdirSync(path.join(od,"compare"),{recursive:true});
const rel=p=>path.relative(od,p).split(path.sep).join("/");
function metrics(m){ if(!m) return "<i>not run</i>";
  const ov=Object.values(m.labels.pairs).reduce((a,b)=>a+b,0);
  return ["figures off ground: <b>"+m.figures.maxErr+"</b> units max ("+m.figures.over005+" of "+m.figures.count+" over 0.05)",
    "standards: <b>"+m.standards.maxErr+"</b>","camera above ground: <b>"+m.camera.clearance+"</b>",
    "overlapping labels/counters: <b>"+ov+"</b>","solid black 8x8 blocks: <b>"+m.pixels.solidBlocks+"</b> (near-black px "+(100*m.pixels.nearBlack).toFixed(2)+"%)",
    "smoke/dust edge alpha: <b>"+m.smokeEdgeAlpha+"/"+m.dustEdgeAlpha+"</b>","mist at ground crossing: <b>"+(m.mist.visible?m.mist.maxAlphaAtCrossing:"-")+"</b>",
    m.selection?("selection "+m.selection+": dossier "+m.drawerVisible+", chip "+m.chipVisible):""].filter(Boolean).join("<br>"); }
let html='<!doctype html><meta charset="utf-8"><title>Austerlitz Stage 0: before and after</title><style>body{font:13px/1.45 system-ui,sans-serif;background:#111;color:#ddd;margin:0}'+
 'section{padding:14px 16px 18px;border-bottom:1px solid #333;width:1640px}h2{font:600 16px system-ui;margin:0 0 4px}p{margin:0 0 8px;color:#aaa}'+
 '.row{display:flex;gap:12px}.col{width:808px}.col img{width:800px;border:1px solid #444;display:block}.lab{font-weight:600;margin:6px 0 2px}.m{color:#bbb;font-size:12px}</style>'+
 '<h1 style="font:600 20px system-ui;padding:14px 16px 0">Stage 0: before (build '+B.md5.slice(0,8)+') and after (build '+A.md5.slice(0,8)+')</h1>';
for(const c of CASES){
  const b=B.cases[c.name], a=A.cases[c.name]; if(!b&&!a) continue;
  html+='<section id="'+c.name+'"><h2>'+c.name+'</h2><p>'+c.note+'</p><div class="row">'+
    '<div class="col"><div class="lab">before</div><img src="'+rel(path.join(bd,c.name+".png"))+'"><div class="m">'+metrics(b)+'</div></div>'+
    '<div class="col"><div class="lab">after Stage 0</div><img src="'+rel(path.join(ad,c.name+".png"))+'"><div class="m">'+metrics(a)+'</div></div></div></section>';
}
fs.writeFileSync(path.join(od,"gallery.html"),html);
(async()=>{
  const br=await chromium.launch(); const pg=await br.newPage({viewport:{width:1680,height:900}});
  await pg.goto("file://"+path.join(od,"gallery.html")); await pg.waitForLoadState("load");
  for(const c of CASES){ const el=await pg.$("#"+c.name); if(el) await el.screenshot({path:path.join(od,"compare",c.name+".png")}); }
  await br.close(); console.log("gallery written: "+path.join(od,"gallery.html"));
})();
