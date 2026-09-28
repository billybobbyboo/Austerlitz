#!/usr/bin/env node
/* Stage 2E: the evidence sheets (docs/stage2-evidence/2e-*.jpg).
   node tools/stage2/renders-2e.js <2D harness out dir> <2E harness out dir> <evidence dir>
   2e-paper.jpg     each paper-map view, the 2D build's staff map (left) and the 2E paper map (right), from the two harness runs;
   2e-legend.jpg    the legend on the paper map, in each paper view as the 2E build draws it;
   2e-hillshade.jpg the paper map's cartographic hillshade at x2, x4, x6 and x10.33 (the chosen factor is PAPER_HILLSHADE);
   2e-sawtooth.jpg  question L1: the triangle land-cover edges, close on Sokolnitz and on the Pratzen, paper map and landscape. */
const fs=require("fs"), path=require("path"), P=require("./page.js");
const [OLD,NEW,EV]=process.argv.slice(2,5).map(p=>path.resolve(p));
const VIEWS=["paper-north-up","paper-close","paper-drawer","paper-laptop","staff-paper"];
(async()=>{
  const b=await P.launch(), page=await P.open(b,[1600,900]);
  const rd=f=>fs.readFileSync(f);
  let T=[]; VIEWS.forEach(v=>{ T.push({png:rd(path.join(OLD,v+".png")),cap:v+": 2D (staff map, perspective)"}); T.push({png:rd(path.join(NEW,v+".png")),cap:v+": 2E (north-up plan)"}); });
  fs.writeFileSync(path.join(EV,"2e-paper.jpg"),await P.sheet(page,T,2,800,450,"The paper map: before (Stage 2D build) and after (Stage 2E), harness views",true));
  /* the legend on the paper map, in each paper view as drawn by the 2E build (the page's own screenshot of its box) */
  T=[];
  for(const v of VIEWS.concat(["paper-watch"])){
    const c=v==="paper-watch"?{viewport:[1600,900],t:570,presentation:"watch",mode:"staff",paper:"frame"}:P.CASES.find(x=>x.name===v);
    const p2=await P.open(b,c.viewport); await P.applyCase(p2,c);
    const r=await p2.evaluate(()=>{ const e=document.querySelector(".legend"), cs=getComputedStyle(e), q=e.getBoundingClientRect();
      return (cs.display==="none"||q.width<2)?null:{x:Math.floor(q.left),y:Math.floor(q.top),width:Math.ceil(q.width),height:Math.ceil(q.height)}; });
    if(r) T.push({png:await p2.screenshot({clip:r}),cap:v+(v==="paper-watch"?" (Watch: the legend is hidden)":"")});
    await p2.close(); }
  fs.writeFileSync(path.join(EV,"2e-legend.jpg"),await P.sheet(page,T,T.length,330,470,"The legend on the paper map (2E): contextual rows, the hillshade line, the controls",true));
  /* the hillshade factor */
  T=[];
  for(const view of [{n:"overview (Watch, framed)",c:{t:570,presentation:"watch",mode:"staff",paper:"frame"},clip:{x:420,y:40,width:760,height:690}},
                     {n:"the Pratzen",c:{t:570,presentation:"watch",mode:"staff",aim:{map:[290,260],dir:[0,1,0],r:170}},clip:{x:300,y:100,width:1000,height:600}}]){
    await P.applyCase(page,view.c);
    for(const N of [2,4,6,10.33]){
      await page.evaluate(N=>{ window.__hs0=window.__hs0||PAPER_HILLSHADE; PAPER_HILLSHADE=N; paperShade(); palPaper=makePalette("paper"); applyGround(); requestRender(3); },N);
      await P.settle(page); T.push({png:await page.screenshot({clip:view.clip}),cap:view.n+": hillshade ×"+N}); }
    await page.evaluate(()=>{ PAPER_HILLSHADE=window.__hs0; paperShade(); palPaper=makePalette("paper"); applyGround(); requestRender(3); });
  }
  fs.writeFileSync(path.join(EV,"2e-hillshade.jpg"),await P.sheet(page,T,4,500,420,"The paper map's hillshade factor (chosen: ×"+await page.evaluate(()=>PAPER_HILLSHADE)+")",true));
  /* question L1: the triangle edges of the land cover, close, on the paper map and on the landscape */
  T=[];
  for(const v of [{n:"Sokolnitz",map:[210,362]},{n:"the Pratzen",map:[280,255]}]){
    await P.applyCase(page,{t:500,presentation:"watch",mode:"staff",aim:{map:v.map,dir:[0,1,0],r:58}});
    T.push({png:await page.screenshot({clip:{x:400,y:120,width:800,height:520}}),cap:v.n+": paper map, close"});
    await P.applyCase(page,{t:500,presentation:"watch",mode:"terrain",aim:{map:v.map,dir:[-0.1,1,0.25],r:58}});
    T.push({png:await page.screenshot({clip:{x:400,y:120,width:800,height:520}}),cap:v.n+": landscape (4×), from above"});
  }
  fs.writeFileSync(path.join(EV,"2e-sawtooth.jpg"),await P.sheet(page,T,2,800,520,"Question L1: the triangle land-cover edges (fixed in 2F, not in 2E)",true));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(2); });
