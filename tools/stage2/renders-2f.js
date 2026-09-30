#!/usr/bin/env node
/* Stage 2F: the evidence sheets (docs/stage2-evidence/2f-*.jpg), each before (the 2E build) and after (this build).
   node tools/stage2/renders-2f.js <2E build.html> <2F build.html> <evidence dir>
   2f-sawtooth.jpg  question L1's views (2e-sawtooth.jpg): close on Sokolnitz and on the Pratzen, the paper map and the landscape
                    (4x) from above;
   2f-woods.jpg     two woods, the copse west of the plateau (the most turned, WOODS.rot 0.4) and the Sokolnitz pheasantry,
                    from above on the landscape and on the paper map: the trees and the paper map's wood against the cover.
   The draping of roads and streams is measured, not rendered: tools/stage2/drape-2f.js. */
const fs=require("fs"), path=require("path"), P=require("./page.js");
const [OLD,NEW,EV]=process.argv.slice(2,5).map(p=>path.resolve(p));
const CLIP={x:400,y:120,width:800,height:520};
async function shots(b,html,views){ const page=await P.open(b,[1600,900],html), out=[];
  for(const v of views){ await P.applyCase(page,v.c); out.push(await page.screenshot({clip:v.clip||CLIP})); }
  await page.close(); return out; }
async function sheet(b,views,title,file){
  const before=await shots(b,OLD,views), after=await shots(b,NEW,views), T=[];
  views.forEach((v,k)=>{ T.push({png:before[k],cap:v.n+": 2E"}); T.push({png:after[k],cap:v.n+": 2F"}); });
  const page=await P.open(b,[1600,900],NEW);
  fs.writeFileSync(path.join(EV,file),await P.sheet(page,T,2,800,520,title,true)); await page.close();
}
(async()=>{
  const b=await P.launch();
  const top=(map,mode,r)=>({t:500,presentation:"watch",mode,aim:mode==="staff"?{map,dir:[0,1,0],r}:{map,dir:[-0.1,1,0.25],r}});
  await sheet(b,[
    {n:"Sokolnitz, paper map, close",c:top([210,362],"staff",58)},
    {n:"Sokolnitz, landscape (4x), from above",c:top([210,362],"terrain",58)},
    {n:"the Pratzen, paper map, close",c:top([280,255],"staff",58)},
    {n:"the Pratzen, landscape (4x), from above",c:top([280,255],"terrain",58)}],
    "Question L1: the land cover's edges, before (2E: each 81 m triangle) and after (2F: drawn per point)","2f-sawtooth.jpg");
  await sheet(b,[
    {n:"copse west of the plateau, landscape (4x)",c:top([229,253],"terrain",46)},
    {n:"copse west of the plateau, paper map",c:top([229,253],"staff",46)},
    {n:"Sokolnitz pheasantry, landscape (4x)",c:top([236,385],"terrain",62)},
    {n:"Sokolnitz pheasantry, paper map",c:top([236,385],"staff",62)}],
    "Woods: the trees and the paper map's wood inside the wood's land cover (2F), before and after","2f-woods.jpg");
  await b.close();
})().catch(e=>{ console.error(e); process.exit(2); });
