#!/usr/bin/env node
/* Final audit (docs/FINAL_AUDIT.md, dimension 7): load time and frame cost, measured in the built page under SOFTWARE WebGL
   (SwiftShader, headless Chromium): the numbers compare views with one another within one run; they are not a visitor's GPU.
   node tools/audit/perf-probe.js [--json out.json] [--loads 3]
   - Load: fresh pages (with and without ?harness=1), the time from navigation to the boot screen gone, and the Navigation Timing
     marks; three loads each by default.
   - Per harness view (tools/visual/cases.js; the fresh and interaction cases excluded, they are the harness's own): one whole frame's
     draw calls and triangles (renderer.info, autoReset off as the app keeps it), the world pass (median of 7, window.__s5.frame), the
     map layer's pass (mlLayout, median of 7), updateVisibility, the GPU memory counts (geometries, textures, programs), the DOM's
     node count, the map layer's nodes, the JS heap (performance.memory).
   Measurement only; nothing is written to a source file. Never run it beside `npm run check:visual`. */
const fs=require("fs"), path=require("path");
const L=require("../stage7/lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), LOADS=+(opt("--loads")||3);
const CASES=require(path.join(L.ROOT,"tools","visual","cases.js")).filter(c=>!c.fresh&&!c.interact);
const med=a=>{ const s=a.slice().sort((x,y)=>x-y); return +s[Math.floor(s.length/2)].toFixed(2); };
(async()=>{
  const browser=await L.launch(), res={note:"software WebGL (SwiftShader) in headless Chromium; 4 CPU cores; comparable within this run only",loads:[],views:{}};
  for(let i=0;i<LOADS;i++) for(const harness of [true,false]){
    const p=await L.open(browser,[1600,900],{harness:harness?undefined:false});
    const nav=await p.evaluate(()=>{ const n=performance.getEntriesByType("navigation")[0]; return n?{domContentLoaded:Math.round(n.domContentLoadedEventEnd),load:Math.round(n.loadEventEnd),transfer:n.transferSize,decoded:n.decodedBodySize}:null; });
    const heap=await p.evaluate(()=>performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576):null);
    res.loads.push({harness,bootGoneMs:p._loadMs,nav,heapMB:heap}); console.log("load",harness?"harness":"visitor",p._loadMs,"ms", JSON.stringify(nav),"heap",heap,"MB");
    await p.close();
  }
  const page=await L.open(browser,[1600,900]);
  await page.evaluate(()=>{ if(window.closeFirst&&firstRunOpen) closeFirst(null); });
  for(const c of CASES){
    if(c.viewport[0]!==1600) await page.setViewportSize({width:c.viewport[0],height:c.viewport[1]});
    await L.applyCase(page,c);
    const m=await page.evaluate(()=>{
      renderer.info.autoReset=false;
      const md=a=>{ const s=a.slice().sort((x,y)=>x-y); return +s[Math.floor(s.length/2)].toFixed(2); };
      renderer.info.reset(); renderFrame(); const calls=renderer.info.render.calls, tris=renderer.info.render.triangles;
      const lay=[], upd=[]; for(let i=0;i<7;i++){ let t=performance.now(); mlLayout(); lay.push(performance.now()-t); t=performance.now(); updateVisibility(); upd.push(performance.now()-t); }
      const mi=renderer.info.memory;
      return {calls,tris,worldMs:window.__s5.frame(7),layerMs:md(lay),updateMs:md(upd),geometries:mi.geometries,textures:mi.textures,
        programs:renderer.info.programs?renderer.info.programs.length:null,dom:document.getElementsByTagName("*").length,
        mapLayerNodes:ML.stats.nodes,placed:ML.stats.placed,dropped:ML.stats.dropped,heapMB:performance.memory?Math.round(performance.memory.usedJSHeapSize/1048576):null,
        fx:FX.on,pixelRatio:renderer.getPixelRatio()};
    });
    res.views[c.name]=m;
    console.log(c.name.padEnd(22),"calls",String(m.calls).padStart(5),"tris",String(m.tris).padStart(8),"world",String(m.worldMs).padStart(7),"ms layer",String(m.layerMs).padStart(6),
      "ms update",String(m.updateMs).padStart(6),"ms geo",m.geometries,"tex",m.textures,"prog",m.programs,"dom",m.dom,"heap",m.heapMB,"MB");
    if(c.viewport[0]!==1600) await page.setViewportSize({width:1600,height:900});
  }
  await browser.close();
  const V=Object.values(res.views);
  res.summary={views:V.length,callsMax:Math.max(...V.map(v=>v.calls)),callsMedian:med(V.map(v=>v.calls)),worldMsMedian:med(V.map(v=>v.worldMs)),worldMsMax:Math.max(...V.map(v=>v.worldMs)),
    layerMsMedian:med(V.map(v=>v.layerMs)),layerMsMax:Math.max(...V.map(v=>v.layerMs)),loadVisitorMedian:med(res.loads.filter(l=>!l.harness).map(l=>l.bootGoneMs)),loadHarnessMedian:med(res.loads.filter(l=>l.harness).map(l=>l.bootGoneMs))};
  console.log(JSON.stringify(res.summary));
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
