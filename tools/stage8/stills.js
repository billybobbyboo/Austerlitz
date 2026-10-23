#!/usr/bin/env node
/* Stage 8 Part A (docs/STAGE8_SPEC.md): direct screenshots of the build in the views of tools/stage8/views.js, and of the same views with
   a prototype of tools/stage8/protos/ put into the live scene, so that each pair is the same camera, clock and state. Each frame's draw
   calls and triangles (renderer.info, every pass) and the map layer's counts are recorded beside it; a prototype is undone after its frame
   and the frame after it checked against the first (calls and triangles equal).
   node tools/stage8/stills.js [--views a,b] [--protos file:id,file:id] [--out dir] [--json file] [--base] [--merge] (--base: the build's frame too,
   default on when no prototype is named; the JSON is written after each view, and --merge keeps the views an earlier run of the same build wrote)
   Measurement and prototype code only: nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), VIEWS=require("./views.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ONLY=opt("--views")?opt("--views").split(","):Object.keys(VIEWS);
const PROTOS=opt("--protos")?opt("--protos").split(","):[];
const OUT=opt("--out")||path.join(L.EVID8,"views"), JSONF=opt("--json");
const BASE=!PROTOS.length||argv.includes("--base");
/* a prototype is named file:id (tools/stage8/protos/<file>.js exports {inPage, ids}); its in-page module registers window.__p8[id] */
const P8=PROTOS.map(spec=>{ const [file,id]=spec.split(":"), M=require(path.join(__dirname,"protos",file+".js")); if(!M.ids[id]) throw new Error("no prototype "+spec);
  return {file, id, inPage:M.inPage, opts:M.ids[id]}; });
const FILES=[...new Set(P8.map(p=>p.file))].map(f=>P8.find(p=>p.file===f));
(async()=>{
  const browser=await L.launch(); let page=null, vp=null;
  const res={build:require("crypto").createHash("md5").update(fs.readFileSync(path.join(L.ROOT,"austerlitz-command-map.html"))).digest("hex"), views:{}};
  if(JSONF&&argv.includes("--merge")&&fs.existsSync(JSONF)){ const old=JSON.parse(fs.readFileSync(JSONF,"utf8")); if(old.build===res.build) Object.assign(res.views,old.views); }
  const save=()=>{ if(JSONF){ fs.mkdirSync(path.dirname(JSONF),{recursive:true}); fs.writeFileSync(JSONF,JSON.stringify(res,null,1)); } };
  for(const name of ONLY){
    const v=VIEWS[name]; if(!v) throw new Error("no view "+name);
    if(!page||vp!==v.viewport.join("x")){ if(page) await page.close(); page=await L.open(browser,v.viewport); vp=v.viewport.join("x");
      for(const p of FILES) await L.inject(page,p.inPage); }
    await L.applyCase(page,v);
    /* a view framed from a block (views.js focus): the camera at r units from the block, az from its facing, el up; Follow off, as a case */
    if(v.focus){ await page.evaluate(F=>{ const rec=units[F.id], b=rec.block, y=rec.yaw||0, a=y+F.az, T=new THREE.Vector3(b.position.x,groundY(b.position.x,b.position.z),b.position.z);
        const d=new THREE.Vector3(Math.sin(a)*Math.cos(F.el),Math.sin(F.el),Math.cos(a)*Math.cos(F.el)).multiplyScalar(F.r);
        tween=null; freeCam=true; curVantage=null; orbitTarget.copy(T); landCam.position.copy(T).add(d); landCam.lookAt(orbitTarget); clampCamera(); requestRender(3); },v.focus);
      await L.settle(page); }
    const cost=()=>page.evaluate(()=>{ renderer.info.autoReset=false; renderer.info.reset(); renderFrame(); return {calls:renderer.info.render.calls, tris:renderer.info.render.triangles, items:ML.stats.items, placed:ML.stats.placed, dropped:ML.stats.dropped}; });
    const R=res.views[name]={};
    const b0=await cost();
    if(BASE){ await L.jpeg(page,path.join(OUT,name+"-base.jpg"),86); R.base=b0; console.log(name.padEnd(20),"base",JSON.stringify(b0)); }
    for(const p of P8){
      const info=await page.evaluate(([id,o])=>window.__p8[id].install(o),[p.id,p.opts||{}]);
      await L.settle(page);
      const k=await cost(); await L.jpeg(page,path.join(OUT,name+"-"+p.id+".jpg"),86);
      await page.evaluate(id=>window.__p8[id].uninstall(),p.id); await L.settle(page);
      const back=await cost();
      R[p.id]=Object.assign({info},k,{restored:back.calls===b0.calls&&back.tris===b0.tris, after:{calls:back.calls, tris:back.tris}});
      console.log(name.padEnd(20),p.id.padEnd(16),JSON.stringify(k),back.calls===b0.calls&&back.tris===b0.tris?"":"NOT RESTORED "+JSON.stringify(back));
    }
    save();
  }
  if(page) await page.close(); await browser.close();
  save();
})().catch(e=>{ console.error(e); process.exit(1); });
