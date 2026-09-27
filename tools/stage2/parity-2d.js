#!/usr/bin/env node
/* Stage 2D: parity screenshots of the map layer against the Stage 0 canvas path it replaces, from ONE build (the canvas path
   is drawn with ?labels=canvas while it exists), in every harness view; and the legend in its states.
   node tools/stage2/parity-2d.js <outdir> [--sheets <dir>]
   Writes <outdir>/<case>-canvas.png and <case>-layer.png, parity.json (the layer's counts per view), and with --sheets
   2d-parity-1.jpg and 2d-parity-2.jpg (each view: the canvas path left, the layer right) and 2d-legend.jpg. */
const fs=require("fs"), path=require("path"), P=require("./page.js");
const argv=process.argv.slice(2), out=path.resolve(argv[0]||path.join(__dirname,"out","parity"));
const si=argv.indexOf("--sheets"), sheets=si>=0?path.resolve(argv[si+1]):null;
fs.mkdirSync(out,{recursive:true}); if(sheets) fs.mkdirSync(sheets,{recursive:true});
(async()=>{
  const b=await P.launch(), res={};
  for(const [tag,q] of [["canvas","&labels=canvas"],["layer",""]]){
    let page=null, key0="";
    for(const c of P.CASES){
      const key=c.viewport.join("x")+(c.fresh?":"+c.name:"");
      if(key!==key0||c.fresh){ if(page) await page.close(); page=await P.open(b,c.viewport,null,null,q); key0=key; }
      if(!c.fresh) await P.applyCase(page,c); else await P.settle(page);
      fs.writeFileSync(path.join(out,c.name+"-"+tag+".png"),await page.screenshot({timeout:300000}));
      const s=await page.evaluate(()=>typeof ML!=="undefined"&&!ML.canvas?{placed:ML.stats.placed,dropped:ML.stats.dropped,leaders:ML.stats.leaders,
        occluded:ML.stats.occluded,nodes:ML.stats.nodes}:{labels:Object.assign({},LABEL_STATS)});
      (res[c.name]=res[c.name]||{})[tag]=s;
      console.log(tag.padEnd(7),c.name.padEnd(20),JSON.stringify(s));
    }
    if(page) await page.close();
  }
  fs.writeFileSync(path.join(out,"parity.json"),JSON.stringify(res,null,1));
  /* the legend in its states (Study, 1600 x 900; the last at 1280 x 720 with a dossier open, where it stays closed) */
  const L=[], page=await P.open(b,[1600,900]);
  const S=[["landscape, 4x, 09:30",{t:570,presentation:"study",mode:"terrain",cam:[-195,92,156,-33,4,-2]},null],
    ["paper map (counters)",{t:570,presentation:"study",mode:"staff",cam:[-27,272,41,-27,0,9]},null],
    ["04:30: boundaries, routes",{t:270,presentation:"study",mode:"terrain",cam:[-27,272,41,-27,0,9]},null],
    ["08:20: halt, plan, going, terrain study",{t:500,presentation:"study",mode:"terrain",cam:[-195,92,156,-33,4,-2]},
      ()=>{ setPlan("al"); document.getElementById("going").click(); document.querySelector('.layer-btn[data-l="analysis"]').click(); }],
    ["true scale (1x)",{t:570,presentation:"study",mode:"terrain",factor:1,cam:[-195,92,156,-33,4,-2]},
      ()=>{ setPlan(planSide); document.getElementById("going").click(); document.querySelector('.layer-btn[data-l="analysis"]').click(); }],
    ["closed",{t:570,presentation:"study",mode:"terrain",cam:[-195,92,156,-33,4,-2]},()=>{ document.getElementById("lg-toggle").click(); }]];
  for(const [cap,spec,fn] of S){
    await P.applyCase(page,Object.assign({name:cap,viewport:[1600,900]},spec));
    if(fn){ await page.evaluate(fn); await P.settle(page); }
    const r=await page.evaluate(()=>{ const e=document.querySelector(".legend").getBoundingClientRect(); return [e.left,e.top,e.width,e.height]; });
    /* the rows it shows: the contextual rows, and the going classes */
    const rows=await page.evaluate(()=>{ const lg=document.querySelector(".legend"), out=[];
      if(lg.classList.contains("collapsed")) return ["(closed)"];
      lg.querySelectorAll(".lg-rows > .k, #goingkey .k").forEach(k=>{ if(k.offsetParent!==null&&!k.hidden) out.push(k.textContent.replace(/\s+/g," ").trim().slice(0,60)); });
      return out; });
    (res.legend=res.legend||{})[cap]={size:[Math.round(r[2]),Math.round(r[3])],rows:rows};
    console.log("legend",cap,Math.round(r[2])+"x"+Math.round(r[3]),JSON.stringify(rows));
    const pad=6, clip={x:Math.max(0,r[0]-pad),y:Math.max(0,r[1]-pad),width:Math.min(1600-Math.max(0,r[0]-pad),r[2]+2*pad),height:r[3]+2*pad};
    L.push({cap:cap+" ("+Math.round(r[2])+" x "+Math.round(r[3])+" px)",png:await page.screenshot({clip})});
  }
  await page.evaluate(()=>document.getElementById("lg-toggle").click());
  await page.setViewportSize({width:1280,height:720});
  await P.applyCase(page,{name:"narrow",viewport:[1280,720],t:570,presentation:"study",mode:"terrain",select:["f","sthilaire"],aim:{map:"sthilaire",dir:[-0.55,0.62,0.56],r:86}});
  const narrow=await page.screenshot();
  const lg=await page.evaluate(()=>{ const e=document.querySelector(".legend"); return e.className+" "+JSON.stringify(e.getBoundingClientRect()); });
  console.log("1280 x 720 with the dossier open:",lg);
  fs.writeFileSync(path.join(out,"parity.json"),JSON.stringify(res,null,1));
  if(sheets){
    const views=P.CASES.map(c=>c.name), half=Math.ceil(views.length/2);
    for(const [k,part] of [[1,views.slice(0,half)],[2,views.slice(half)]]){
      const tiles=[]; part.forEach(n=>{ tiles.push({cap:n+": the canvas path (Stage 0, ?labels=canvas)",png:fs.readFileSync(path.join(out,n+"-canvas.png"))});
        tiles.push({cap:n+": the map layer (2D)",png:fs.readFileSync(path.join(out,n+"-layer.png"))}); });
      fs.writeFileSync(path.join(sheets,"2d-parity-"+k+".jpg"),await P.sheet(page,tiles,2,640,360,"Stage 2D parity: the same build, the canvas path left and the map layer right"));
    }
    const legendTiles=L.map(x=>x);   /* crops, each scaled into its tile */
    legendTiles.push({cap:"1280 x 720, a dossier open: the legend stays closed beside the dispatch",png:narrow});
    fs.writeFileSync(path.join(sheets,"2d-legend.jpg"),await P.sheet(page,legendTiles,4,400,420,"Stage 2D: the contextual legend in its states",true));
  }
  await b.close();
})().catch(e=>{ console.error(e); process.exit(2); });
