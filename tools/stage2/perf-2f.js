#!/usr/bin/env node
/* Stage 2F: what the cover drawing costs, on the harness machine (headless Chromium, software WebGL), for one build.
   node tools/stage2/perf-2f.js <build.html> [--runs 3] [--json out.json]
   1. start-up: the page from navigation to ready (the boot card gone), each run a fresh page;
   2. the cover drawing's own work at start-up, re-run in the loaded page: before 2F the two palettes and their upload
      (makePalette natural and paper, applyGround); since 2F also the local-relief grid (buildCoverMl), the shader's data
      textures (groundTextures) and the vertex facts (groundVertexFacts);
   3. a display-factor change (setDisplayFactor, all six changes between 1x, 4x and 10.33x), twice;
   4. a switch into and out of the paper map at each setting, three times (as tools/stage2/paper-2e.js);
   5. a drawn frame of the harness views overview-field and paper-north-up (renderFrame to a pixel read back: median of seven,
      after three to warm up). */
const fs=require("fs"), path=require("path"), P=require("./page.js");
const argv=process.argv.slice(2), HTML=path.resolve(argv[0]), ri=argv.indexOf("--runs"), RUNS=ri>=0?+argv[ri+1]:3, jo=argv.indexOf("--json");
(async()=>{
  const b=await P.launch(), res={build:path.basename(HTML), bootMs:[]};
  for(let r=0;r<RUNS;r++){ const t=Date.now(); const page=await P.open(b,[1600,900],HTML); res.bootMs.push(Date.now()-t); if(r<RUNS-1) await page.close(); else res.page=page; }
  const page=res.page; delete res.page;
  res.cover=await page.evaluate(()=>{ const o={}; function T(k,f){ const t=performance.now(); f(); o[k]=+(performance.now()-t).toFixed(1); }
    if(typeof buildCoverMl==="function"){ T("buildCoverMl",()=>buildCoverMl()); T("groundTextures",()=>{ _gTex=null; groundTextures(); });
      T("groundVertexFacts",()=>groundVertexFacts(groundMesh.geometry)); }
    T("makePalette natural",()=>makePalette("natural")); T("makePalette paper",()=>{ paperShade(); makePalette("paper"); }); T("applyGround",()=>applyGround());
    o.total=+Object.keys(o).reduce((a,k)=>a+o[k],0).toFixed(1); return o; });
  console.log("boot ms:",res.bootMs.join(", "),"| cover work:",JSON.stringify(res.cover));
  res.factorMs=await page.evaluate(()=>{ const out=[], S=DISPLAY.settings;
    for(let k=0;k<2;k++) for(const [a,c] of [[0,1],[1,2],[2,0],[0,2],[2,1],[1,0]]){ setDisplayFactor(S[a]); out.push(+setDisplayFactor(S[c]).toFixed(0)); }
    setDisplayFactor(DISPLAY.defaultFactor); return out; });
  console.log("factor change ms:",res.factorMs.join(", "));
  res.switchMs=await page.evaluate(()=>{ const out={};
    DISPLAY.settings.forEach(f=>{ setMode("terrain"); setDisplayFactor(f); const into=[], back=[];
      for(let k=0;k<3;k++){ let t=performance.now(); setMode("staff"); into.push(+(performance.now()-t).toFixed(0)); t=performance.now(); setMode("terrain"); back.push(+(performance.now()-t).toFixed(0)); }
      out[fmtFactor(f)+"x"]={intoPaper:into, backToLandscape:back}; });
    setDisplayFactor(DISPLAY.defaultFactor); return out; });
  console.log("paper switch ms:",JSON.stringify(res.switchMs));
  res.frameMs={};
  for(const name of ["overview-field","paper-north-up"]){ await P.applyCase(page,P.CASES.find(c=>c.name===name));
    res.frameMs[name]=await page.evaluate(()=>{ const t=[], gl=renderer.getContext(), px=new Uint8Array(4);
      for(let k=0;k<3;k++){ renderFrame(); gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px); }   /* warm: programs compiled, textures uploaded */
      for(let k=0;k<7;k++){ const a=performance.now(); renderFrame(); gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px); t.push(performance.now()-a); }
      t.sort((a,b)=>a-b); return +t[3].toFixed(0); }); }
  console.log("frame ms (median of 7):",JSON.stringify(res.frameMs));
  if(jo>=0) fs.writeFileSync(argv[jo+1],JSON.stringify(res,null,1));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(2); });
