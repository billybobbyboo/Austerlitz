/* UI/UX roadmap step 4: the base build's first frame measured (node tools/ux-step4/base.js [build] [out.json] [capture prefix]): at 1600 x 900,
   1366 x 768 and 1280 x 720 (desktop, density 1) and 390 x 844 (a phone's page), each fresh: the boxes, the unobstructed share, the battle area's
   luminance at 04:00 and the frame's capture */
"use strict";
const path=require("path"), fs=require("fs"), L=require("./lib.js");
const html=path.resolve(process.argv[2]||"austerlitz-command-map.html"), out=process.argv[3]||null, cap=process.argv[4]||null;
const VPS=[[1600,900],[1366,768],[1280,720],[390,844,"phone"]];
(async()=>{ const b=await L.launch(), R={build:L.buildInfo(html), views:{}};
  for(const v of VPS){ const p=await L.open(b,html,{vp:[v[0],v[1]],phone:v[2]==="phone"}), k=v[0]+"x"+v[1];
    const r={first:await L.boxes(p), clock:await p.evaluate(()=>clock)};
    if(cap) await p.screenshot({path:cap+"-"+k+".png",timeout:300000});
    r.lum=await L.battleLum(p);
    r.light=await p.evaluate(()=>({i:+sun.intensity.toFixed(3),hemi:+hemi.intensity.toFixed(3),fill:fillLight?+fillLight.intensity.toFixed(3):null}));
    R.views[k]=r; console.log(k,JSON.stringify(r)); await p.context().close(); }
  await b.close(); if(out) fs.writeFileSync(out,JSON.stringify(R,null,1)+"\n");
})().catch(e=>{ console.error(e); process.exit(1); });
