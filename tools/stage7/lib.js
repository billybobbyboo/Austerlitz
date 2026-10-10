/* Stage 7 Part A: shared by the page probes in this folder. The page is opened as the Stage 0 harness opens it (tools/stage2/page.js:
   headless Chromium, software WebGL, ?harness=1, tools/visual/measure.js injected, CSS transitions off), with two additions a first
   visit needs: reduced motion can be emulated before the page loads, and a page can be opened without ?harness=1 (the harness flag
   stops the drift and the smoke's motion; a visitor's page has neither flag). The Stage 5 helpers (tools/stage5/lib.js) are reused.
   Measurement code only: nothing here is the Stage 7 design, and nothing is written to a source file. */
const fs=require("fs"), path=require("path");
const { chromium } = require("playwright");
const L5=require("../stage5/lib.js");
const ROOT=L5.ROOT;
const TR=require("../visual/three-route.js"), THREE_LOCAL=TR.THREE_LOCAL;   /* roadmap step 3: one route for three.js (decision 133) */
const MEASURE=fs.readFileSync(path.join(ROOT,"tools","visual","measure.js"),"utf8");
const TH=require(path.join(ROOT,"tools","visual","thresholds.js"));
const EVID7=path.join(ROOT,"docs","stage7-evidence");
async function launch(){ return chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]}); }
/* o: {rm: emulate prefers-reduced-motion, harness: false to load without ?harness=1, transitions: true to keep CSS transitions} */
async function open(browser,vp,o){
  o=o||{};
  const page=await browser.newPage({viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:1,reducedMotion:o.rm?"reduce":"no-preference"});
  page._errors=[]; page.on("pageerror",e=>page._errors.push(e.message));
  await TR.routeThree(page);
  const t0=Date.now();
  await page.goto("file://"+path.resolve(process.env.AUSTERLITZ_HTML||path.join(ROOT,"austerlitz-command-map.html"))+(o.harness===false?"":"?harness=1"),{waitUntil:"commit",timeout:180000});
  await TR.waitBoot(page,240000,250);
  page._loadMs=Date.now()-t0;
  await page.evaluate(MEASURE);
  if(!o.transitions) await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  await L5.inject(page,L5.HELPERS);
  /* the self-test's finishTween (app.js, inside AUSTERLITZ_DEBUG), copied: run every tween to its end */
  await page.evaluate(()=>{ window.__fin=function(){ var n=0; while(tween&&n<4){ tween(performance.now()+1e7); n++; } }; });
  return page;
}
/* one frame's measures, as the harness takes them (tools/visual/harness.js): the metrics record, darkness, map text as rendered, the
   confidence marks' share (the view drawn once more without them: CONF.none, as the harness), the smoke's share, draw calls and the world
   pass. limit: the drop limit the frame is held against (stated by the caller) */
async function frame(page,limit,o){
  o=o||{};
  await L5.settle(page);
  const buf=await page.screenshot({timeout:180000}), b64=buf.toString("base64");
  const m=await page.evaluate(()=>window.__aus.metrics());
  const px=await page.evaluate(b=>window.__aus.pixels(b),b64);
  const tc=await page.evaluate(b=>window.__aus.textContrast?window.__aus.textContrast(b):null,b64);
  let conf=null;
  if(!o.noConf&&await page.evaluate(()=>typeof CONF!=="undefined"&&!!layerOn.confidence)){
    await page.evaluate(()=>{ layerOn.confidence=false; CONF.none=true; }); await L5.settle(page);
    const off=(await page.screenshot({timeout:180000})).toString("base64");
    await page.evaluate(()=>{ layerOn.confidence=true; CONF.none=false; }); await L5.settle(page);
    conf=(await page.evaluate(([a,b])=>window.__aus.confShare(a,b),[b64,off])).share;
  }
  /* draw calls of one whole frame, as tools/stage6/compare-6d.js counts them (the app keeps autoReset off, app.js:514; left so) */
  const cost=await page.evaluate(()=>{ renderer.info.autoReset=false; renderer.info.reset(); renderFrame(); var calls=renderer.info.render.calls, tris=renderer.info.render.triangles;
    return {calls:calls,tris:tris,worldMs:window.__s5.frame(7)}; });
  const L=m.layer||{};
  return {png:buf,
    unobstructed:m.unobstructed, clearance:m.camera&&m.camera.clearance,
    layer:{items:L.items,placed:L.placed,underPanel:L.underPanel,dropped:L.dropped,droppedIds:L.droppedIds,ms:L.ms,minPx:L.minPx,limit:limit,overLimit:limit!=null&&L.dropped>limit},
    text:{min:tc&&tc.min,belowAA:tc?tc.belowAA.length:null,n:tc&&tc.texts},
    dark:{solidBlack:px.solidBlack,solidBlocks:px.solidBlocks,nearBlack:px.nearBlack,meanLum:px.meanLum,overLimit:px.solidBlack>TH.SOLID_BLACK},
    smoke:m.smoke?m.smoke.share:null, smokeOver:m.smoke?m.smoke.share>TH.SMOKE_SHARE:null,
    conf:conf, confOver:conf!=null?conf>TH.CONF_SHARE[m.mode==="staff"?"paper":"land"]:null,
    cost:cost, firstRunVisible:m.firstRunVisible, dispatchVisible:m.dispatchVisible, docking:m.docking, presentation:m.presentation, mode:m.mode,
    stage0:TH.check("probe",Object.assign({},m,{pixels:px,textContrast:tc})).filter(s=>!/unobstructed|items dropped|Study shows the|the legend is open/.test(s))};
}
function strip(f){ const o=Object.assign({},f); delete o.png; return o; }
module.exports=Object.assign({},L5,{launch,open,frame,strip,TH,EVID7,ROOT});
