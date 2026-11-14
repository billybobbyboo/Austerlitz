/* Audit probe library (temporary; not part of the project). Serves the pinned build over http on localhost, answers the cdnjs
   three.js request from a verified local copy, and gives small helpers. Browser: the pre-installed Chromium via global Playwright,
   software WebGL (SwiftShader), as the project's own harness launches it. */
"use strict";
const http=require("http"), fs=require("fs"), path=require("path");
const {chromium}=require("playwright");
const ROOT=path.join(__dirname,"..");
const HTML=path.join(ROOT,"pinned.html");
const THREE=path.join(ROOT,"vendor","three.min.js");
const SHOTS=path.join(ROOT,"shots");
function serve(){
  return new Promise(res=>{
    const s=http.createServer((q,r)=>{
      const u=q.url.split("?")[0];
      if(u==="/"||u==="/austerlitz-command-map.html"){ r.writeHead(200,{"content-type":"text/html; charset=utf-8"}); fs.createReadStream(HTML).pipe(r); }
      else { r.writeHead(404); r.end(); }
    });
    s.listen(0,"127.0.0.1",()=>res({server:s,url:"http://127.0.0.1:"+s.address().port+"/austerlitz-command-map.html"}));
  });
}
/* Mesa llvmpipe through ANGLE under Xvfb (headed): about 5x faster here than SwiftShader, the same picture. AUDIT_GL=swiftshader for the
   project's own launch flags. */
function ensureX(){
  const cp=require("child_process");
  try{ cp.execSync("pgrep -x Xvfb",{stdio:"ignore"}); }catch(e){ cp.spawn("Xvfb",[":99","-screen","0","2600x1700x24"],{detached:true,stdio:"ignore"}).unref(); cp.execSync("sleep 1.5"); }
}
async function launch(){
  if(process.env.AUDIT_GL==="swiftshader") return chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
  ensureX();
  return chromium.launch({headless:false,args:["--use-gl=angle","--use-angle=gl","--ignore-gpu-blocklist","--enable-gpu","--window-position=0,0"],
    env:Object.assign({},process.env,{LIBGL_ALWAYS_SOFTWARE:"1",GALLIUM_DRIVER:"llvmpipe",DISPLAY:":99",LP_NUM_THREADS:"4"})});
}
const IPHONE_UA="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
async function open(browser,url,o){
  o=o||{};
  const ctxo={viewport:{width:o.w||1440,height:o.h||900},deviceScaleFactor:o.dpr||1};
  if(o.phone){ ctxo.isMobile=true; ctxo.hasTouch=true; ctxo.userAgent=IPHONE_UA; ctxo.deviceScaleFactor=o.dpr||3; }
  if(o.reducedMotion) ctxo.reducedMotion="reduce";
  if(o.forcedColors) ctxo.forcedColors="active";
  if(o.colorScheme) ctxo.colorScheme=o.colorScheme;
  if(o.video) ctxo.recordVideo={dir:o.video,size:{width:ctxo.viewport.width,height:ctxo.viewport.height}};
  const ctx=await browser.newContext(ctxo);
  const page=await ctx.newPage();
  const log=[];
  page.on("console",m=>{ if(m.type()==="error"||m.type()==="warning") log.push(m.type()+": "+m.text()); });
  page.on("pageerror",e=>log.push("pageerror: "+e.message));
  await page.route(/three(\.min)?\.js$/,r=>r.fulfill({path:THREE,contentType:"application/javascript",headers:{"access-control-allow-origin":"*"}}));
  const t0=Date.now();
  await page.goto(url,{waitUntil:"domcontentloaded"});
  await page.waitForFunction(()=>(!document.getElementById("boot")&&typeof window.camera!=="undefined")||(window.AUS_BOOT&&window.AUS_BOOT.failed),null,{timeout:240000,polling:250});
  page._bootMs=Date.now()-t0; page._log=log;
  return {ctx,page,log};
}
async function shot(page,name,o){
  const p=path.join(SHOTS,name+".png");
  await page.screenshot(Object.assign({path:p,timeout:240000},o||{}));
  return p;
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
/* settle: wait for n animation frames (software GL is slow; a frame can take 100s of ms) */
async function frames(page,n){ await page.evaluate(n=>new Promise(r=>{ let i=0; (function f(){ if(++i>=n) r(); else requestAnimationFrame(f); })(); }),n||3); }
module.exports={serve,launch,open,shot,sleep,frames,SHOTS,ROOT,IPHONE_UA};
