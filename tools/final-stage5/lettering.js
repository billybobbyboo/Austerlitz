#!/usr/bin/env node
/* The final audits' Stage 5, WP-08's lettering, measured on the audit's own shots (tools/audit-post8/visual-maps/capture.js), on each build given:
   the low views' wall of formation names (decision 284 (b): re-measured once WP-07's map-layer change is made, CL-MAP-15), the Plans view (CL-MAP-11,
   CL-MAP-18) and the paper map as entered (CL-MAP-05, decision 302 (b)). The wall's shots (tools/audit-post8/visual-maps/capture.js FAR_LOW: looking east over the Goldbach in Watch, the
   Landscape at 09:00 and 12:00, Landscape with counters at 12:00, at 1600 x 900; the Landscape at 12:00 at 1280 x 720), applied the same way on the
   harness's page (window.__aus.apply, then AUSTERLITZ_DEBUG.settle as the audit's lib does), on each build given; for each shot the map layer's
   drawn items by kind, the formation names by plate (far or full), the rows they stand in and the share of the view their boxes cover (their union
   on a 4 px grid), with a JPEG of the frame; the Plans view at the Overview (both plans, the Landscape at 09:30, 1600 and 1280 px) and the paper map
   as entered (09:30, 1600, 1280 and 1024 px) likewise, with the items dropped.
   node tools/final-stage5/lettering.js <out-dir> <label>=<build.html> [<label>=<build.html> ...]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto"), cp=require("child_process");
const A=require(path.join(__dirname,"..","audit-post8","lib.js"));
const OVER=[-27,272,41,-27,0,9];
const FAR_LOW={t:720, presentation:"watch", mode:"terrain", aim:{map:[230,250], dir:[-0.97,0.10,0.21], r:60}};
const SHOTS=[
  {vp:[1600,900], n:"wall-0900", spec:Object.assign({},FAR_LOW,{t:540})},
  {vp:[1600,900], n:"wall-1200", spec:FAR_LOW},
  {vp:[1600,900], n:"wall-1200-counters", spec:Object.assign({},FAR_LOW,{mode:"hybrid"})},
  {vp:[1280,720], n:"wall-1200", spec:FAR_LOW},
  {vp:[1600,900], n:"plans-overview", spec:{t:570, presentation:"study", mode:"terrain", plan:"both", cam:OVER}},
  {vp:[1280,720], n:"plans-overview", spec:{t:570, presentation:"study", mode:"terrain", plan:"both", cam:OVER}},
  {vp:[1600,900], n:"paper-entered", spec:{t:570, presentation:"study", mode:"staff", paper:"frame", cam:OVER}},
  {vp:[1280,720], n:"paper-entered", spec:{t:570, presentation:"study", mode:"staff", paper:"frame", cam:OVER}},
  {vp:[1024,768], n:"paper-entered", spec:{t:570, presentation:"study", mode:"staff", paper:"frame", cam:OVER}}
];
const READ=function(){
  mlLayout(); var D=[];
  for(var k in ML.items){ var it=ML.items[k]; if(it.eFrame!==ML.frame||it.state!=="on"||!it.el) continue; var r=it.el.getBoundingClientRect();
    D.push({id:k, cat:it.cat, mode:it.mode||null, far:it.el.classList.contains("ml-far"), text:(it.el.textContent||"").replace(/\s+/g," ").trim().slice(0,40),
      box:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]}); }
  return {items:D, stats:{items:ML.stats.items, placed:ML.stats.placed, dropped:ML.stats.dropped, droppedIds:(ML.stats.dropped_||[]).slice(), withheld:ML.stats.withheld||0}, clock:clock, presentation:presentation, mode:mode};
};
function summarise(rd,vp){
  const names=rd.items.filter(x=>x.id.startsWith("n:")), by={};
  rd.items.forEach(x=>{ by[x.cat]=(by[x.cat]||0)+1; });
  const G=4, W=Math.ceil(vp[0]/G), H=Math.ceil(vp[1]/G);
  function share(list){ const g=new Uint8Array(W*H); let n=0;
    list.forEach(x=>{ const [l,t,w,h]=x.box; for(let y=Math.max(0,Math.floor(t/G));y<Math.min(H,Math.ceil((t+h)/G));y++) for(let c=Math.max(0,Math.floor(l/G));c<Math.min(W,Math.ceil((l+w)/G));c++){ if(!g[y*W+c]){ g[y*W+c]=1; n++; } } });
    return +(n/(W*H)).toFixed(4); }
  const ys=names.map(x=>x.box[1]), rows=[...new Set(names.map(x=>Math.round(x.box[1]/12)))].length;
  return {drawn:rd.items.length, byCat:by, names:names.length, far:names.filter(x=>x.far).length, full:names.filter(x=>!x.far).length,
    namesY:names.length?[Math.min(...ys),Math.max(...names.map(x=>x.box[1]+x.box[3]))]:null, nameRows12px:rows,
    namesInTopHalf:names.filter(x=>x.box[1]+x.box[3]/2<vp[1]/2).length, nameShare:share(names), labelShare:share(rd.items), dropped:rd.stats.dropped,
    droppedIds:rd.stats.droppedIds, withheld:rd.stats.withheld, places:rd.items.filter(x=>x.id.startsWith("t:")).length};
}
(async()=>{
  const out=path.resolve(process.argv[2]), builds=process.argv.slice(3).map(a=>{ const i=a.indexOf("="); return {label:a.slice(0,i), html:path.resolve(a.slice(i+1))}; });
  if(!builds.length) throw new Error("usage: wall.js <out-dir> <label>=<build.html> ...");
  fs.mkdirSync(out,{recursive:true}); const res={shots:SHOTS.map(s=>({n:s.n, vp:s.vp, spec:s.spec})), builds:[]};
  for(const B of builds){ process.env.AUSTERLITZ_HTML=B.html; const md5=crypto.createHash("md5").update(fs.readFileSync(B.html)).digest("hex");
    const rec={label:B.label, md5, shots:[]}; const b=await A.launch(); rec.chromium=b.version();
    for(const vp of [...new Set(SHOTS.map(s=>s.vp.join("x")))]){ const V=vp.split("x").map(Number), page=await A.open(b,V);
      await page.keyboard.press("Escape"); await A.frames(page,3);
      for(const sh of SHOTS.filter(s=>s.vp.join("x")===vp)){
        await page.evaluate(s=>window.__aus.apply(s),Object.assign({viewport:V},JSON.parse(JSON.stringify(sh.spec))));
        await A.settle(page);
        const png=await page.screenshot({timeout:900000}), f=path.join(out,B.label+"-"+vp+"-"+sh.n);
        fs.writeFileSync(f+".png",png); cp.execFileSync("ffmpeg",["-y","-loglevel","error","-i",f+".png","-q:v","4",f+".jpg"]); fs.unlinkSync(f+".png");
        const rd=await page.evaluate(READ), s=summarise(rd,V);
        rec.shots.push({n:sh.n, vp:V, summary:s, items:rd.items});
        console.log(B.label.padEnd(8), vp.padEnd(9), sh.n.padEnd(20), "drawn", s.drawn, "names", s.names, "(far "+s.far+", full "+s.full+")", "in the top half", s.namesInTopHalf, "rows", s.nameRows12px, "y", JSON.stringify(s.namesY), "names' share", (100*s.nameShare).toFixed(1)+"%", "labels' share", (100*s.labelShare).toFixed(1)+"%", JSON.stringify(s.byCat), "places", s.places, "dropped", s.dropped, "withheld", s.withheld, s.droppedIds.join(" ")); }
      await page.close(); }
    await b.close(); res.builds.push(rec); }
  fs.writeFileSync(path.join(out,"lettering.json"),JSON.stringify(res,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
