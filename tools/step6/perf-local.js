#!/usr/bin/env node
/* Roadmap step 6 Part A (docs/STEP6_SPEC.md section 2.4): runs the frame-time route (tools/step6/perf-route.js) here, under Playwright, to
   show that it runs end to end in both of its ways (pasted into the build's page; the wrapper page tools/step6/perf-run.html with the build in
   a frame) and to record what it reports here. Here is SOFTWARE WebGL (SwiftShader, headless Chromium, no GPU): its frame times are not a
   visitor's and decide nothing (question 139 needs the owner's machines); its draw calls and triangles are the build's own.
   node tools/step6/perf-local.js [--way paste|frame] [--device desktop|iphone] [--viewport WxH] [--quick] [--only id,id] [--phone] [--cull] [--fx] [--json out.json]
   (--phone: decision 236's phone route, docs/STEP6_SPEC.md section 14; --cull, --fx: Stage 8's bracketed routes, culling and the effects on and off, 8D, docs/STAGE8_SPEC.md section 16)
   The repository is served from a local HTTP server (the wrapper reads its frame's window, which file:// pages may not); three.js is answered
   from the local copy (tools/visual/three-route.js). Measurement only; never run it beside check:visual. */
const fs=require("fs"), path=require("path"), http=require("http");
const { chromium } = require("playwright");
const TR=require("../visual/three-route.js");
const ROOT=path.join(__dirname,"..","..");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; }, has=f=>argv.includes(f);
const WAY=opt("--way")||"paste", DEV=opt("--device")||"desktop", VPO=opt("--viewport"), OUT=opt("--json"), QUICK=has("--quick"), ONLY=opt("--only"), PHONE=has("--phone"), CULL=has("--cull"), FX=has("--fx");
const DEVICES={
  desktop:{viewport:{width:1600,height:900},deviceScaleFactor:1},
  /* an iPhone 13-15's CSS viewport and density; Chromium with Safari's user agent, so the build takes its lowTier path as on the phone */
  iphone:{viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true,
    userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"}
};
const TYPES={".html":"text/html; charset=utf-8",".js":"application/javascript",".css":"text/css",".json":"application/json"};
function serve(){ return new Promise(res=>{ const s=http.createServer((q,r)=>{
  const p=path.join(ROOT,decodeURIComponent(q.url.split("?")[0])); if(!p.startsWith(ROOT)||!fs.existsSync(p)||fs.statSync(p).isDirectory()){ r.writeHead(404); r.end(); return; }
  r.writeHead(200,{"content-type":TYPES[path.extname(p)]||"application/octet-stream"}); fs.createReadStream(p).pipe(r); }).listen(0,"127.0.0.1",()=>res(s)); }); }
(async()=>{
  const srv=await serve(), base="http://127.0.0.1:"+srv.address().port+"/";
  const browser=await chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
  const cfg=Object.assign({},DEVICES[DEV]); if(VPO){ const v=VPO.split("x").map(Number); cfg.viewport={width:v[0],height:v[1]}; }
  const ctx=await browser.newContext(cfg), page=await ctx.newPage();
  const errors=[]; page.on("pageerror",e=>errors.push(e.message)); page.on("console",m=>{ if(m.type()==="error"||m.type()==="warning") errors.push(m.type()+": "+m.text()); });
  await TR.routeThree(page);
  const t0=Date.now(); let r;
  if(WAY==="paste"){
    await page.goto(base+"austerlitz-command-map.html",{waitUntil:"commit",timeout:180000});
    await TR.waitBoot(page,240000,500);
    console.log("started in",Date.now()-t0,"ms");
    await page.evaluate(()=>{ window.AUS_PERF_NO_AUTORUN=true; });
    await page.addScriptTag({path:path.join(__dirname,"perf-route.js")});
    r=await page.evaluate(o=>AUS_PERF.run(window,o).then(x=>x),{quick:QUICK,only:ONLY,phone:PHONE,cull:CULL,fx:FX});
  } else {
    const qs=[QUICK?"quick=1":"",ONLY?"only="+ONLY:"",PHONE?"route=phone":"",CULL?"route=cull":"",FX?"route=fx":""].filter(Boolean).join("&");
    await page.goto(base+"tools/step6/perf-run.html"+(qs?"?"+qs:""),{waitUntil:"load",timeout:180000});
    await page.waitForFunction(()=>!document.getElementById("go").disabled,null,{timeout:300000,polling:500});
    console.log("started in",Date.now()-t0,"ms; the panel:",await page.textContent("#msg"));
    await page.click("#go");
    await page.waitForFunction(()=>!document.getElementById("res").hidden||/failed/.test(document.getElementById("msg").textContent),null,{timeout:3600000,polling:1000});
    r=await page.evaluate(()=>AUS_PERF.last);
    if(!r) throw new Error(await page.textContent("#msg"));
  }
  console.log(r.text.split("\n").filter(l=>!/^AUS_PERF_JSON/.test(l)).join("\n"));
  console.log("console warnings and errors:",errors.length, errors.slice(0,5).join(" | "));
  r.local={way:WAY,device:DEV,quick:QUICK,phone:PHONE,cull:CULL,fx:FX,errors:errors,note:"software WebGL (SwiftShader) in headless Chromium: frame times are not a GPU's"};
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(r,null,1));
  await browser.close(); srv.close();
})().catch(e=>{ console.error(e); process.exit(1); });
