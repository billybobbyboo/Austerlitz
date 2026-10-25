#!/usr/bin/env node
/* Stage 8, implementation PR 8C (docs/STAGE8_SPEC.md section 15.2): a view reached through motion against the same view reached without it. After
   each of the 16 motions of tools/visual/motion.js and its 30 frames at rest, the map layer's items placed and its dropped ids at rest (the
   kept places first, then the others), against the same view laid out afresh (mlReset: as before 8C). Measurement code only.
   node tools/stage8/rest-8c.js out.json     (the build: AUSTERLITZ_HTML, else the repository's) */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto"), L=require("./lib.js"), MO=require(path.join(L.ROOT,"tools","visual","motion.js"));
(async()=>{ const html=path.resolve(process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html"));
  const b=await L.launch(); let page=null, cur=null; const out=[];
  for(const m of MO.MOTIONS){ const [id,view,kind,n,amt]=m;
    if(!page||cur!==view){ if(page) await page.close(); page=await L.open(b,MO.VIEWS[view].viewport,{}); cur=view; }
    await page.evaluate(()=>{ select(null,null); stopPlay(); }); await L.applyCase(page,MO.VIEWS[view]); await page.evaluate(MO.inPage);
    await page.evaluate(new Function("a","return ("+MO.RUN.toString()+")(a);"),{kind,n,amt,gl:false,room:false,rest:30,pre:8});
    const r=await page.evaluate(()=>{ const st=()=>({placed:ML.stats.placed, dropped:ML.stats.dropped_.slice().sort()});
      mlLayout(); const a=st(); mlReset("test"); mlLayout(); const f=st();
      return {rest:a.placed, fresh:f.placed, onlyRestDropped:a.dropped.filter(k=>f.dropped.indexOf(k)<0), onlyFreshDropped:f.dropped.filter(k=>a.dropped.indexOf(k)<0)}; });
    out.push(Object.assign({id},r)); console.log(id.padEnd(13),"at rest",r.rest,"reached directly",r.fresh,"dropped only at rest",r.onlyRestDropped.join(" "),"| only directly",r.onlyFreshDropped.join(" ")); }
  const S=k=>out.reduce((s,x)=>s+x[k],0); console.log("TOTAL at rest",S("rest"),"reached directly",S("fresh"),"; fewer in",out.filter(x=>x.rest<x.fresh).length,"more in",out.filter(x=>x.rest>x.fresh).length,"of 16");
  const res={build:crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex"), html:path.basename(html), chromium:b.version(), runs:out};
  fs.writeFileSync(process.argv[2],JSON.stringify(res,null,1)); if(page) await page.close(); await b.close(); })().catch(e=>{ console.error(e); process.exit(1); });
