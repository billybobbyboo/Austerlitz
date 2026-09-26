/* Stage 2 Part A: open the built page the way the Stage 0 harness does (headless Chromium, software WebGL,
   ?harness=1 for deterministic frames, three.js served locally when available), with the harness's in-page
   driver (tools/visual/measure.js) injected. Shared by the measurement scripts in this folder. */
const fs=require("fs"), path=require("path");
const { chromium } = require("playwright");
const ROOT=path.resolve(__dirname,"..","..");
const THREE_LOCAL=[process.env.AUSTERLITZ_THREE, path.join(ROOT,"tools","visual","three.min.js"),
  path.join(ROOT,"node_modules","three","build","three.min.js")].find(p=>p&&fs.existsSync(p));
const MEASURE=fs.readFileSync(path.join(ROOT,"tools","visual","measure.js"),"utf8");
const CASES=require(path.join(ROOT,"tools","visual","cases.js"));
async function launch(){
  return chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
}
async function open(browser,vp,html,init){
  const page=await browser.newPage({viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:1});
  if(init) await page.addInitScript(init);
  page._errors=[]; page.on("pageerror",e=>page._errors.push(e.message));
  if(THREE_LOCAL) await page.route(/three(\.min)?\.js$/,r=>r.fulfill({path:THREE_LOCAL,contentType:"application/javascript"}));
  await page.goto("file://"+path.resolve(html||path.join(ROOT,"austerlitz-command-map.html"))+"?harness=1",{waitUntil:"commit",timeout:180000});
  await page.waitForFunction(()=>!document.getElementById("boot")&&typeof window.camera!=="undefined",null,{timeout:240000,polling:500});
  await page.evaluate(MEASURE);
  return page;
}
async function applyCase(page,c){ await page.evaluate(s=>window.__aus.apply(s),c); await settle(page); }
async function settle(page){ await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); }
/* a contact sheet: tiles (PNG buffers) scaled into a grid with captions, returned as a JPEG buffer */
async function sheet(page,tiles,cols,tw,th,title){
  const b64=await page.evaluate(async([T,cols,tw,th,title])=>{
    const load=s=>new Promise(r=>{ const i=new Image(); i.onload=()=>r(i); i.src="data:image/png;base64,"+s; });
    const rows=Math.ceil(T.length/cols), cap=22, top=title?30:0, cv=document.createElement("canvas");
    cv.width=cols*tw; cv.height=top+rows*(th+cap); const x=cv.getContext("2d");
    x.fillStyle="#101418"; x.fillRect(0,0,cv.width,cv.height);
    x.font="600 16px sans-serif"; x.fillStyle="#E8E2D3"; if(title) x.fillText(title,8,21);
    for(let k=0;k<T.length;k++){ const im=await load(T[k].png), c=k%cols, r=Math.floor(k/cols), ox=c*tw, oy=top+r*(th+cap);
      x.drawImage(im,ox,oy+cap,tw,th); x.font="14px sans-serif"; x.fillStyle="#E8E2D3"; x.fillText(T[k].cap,ox+6,oy+16); }
    return cv.toDataURL("image/jpeg",0.86).split(",")[1];
  },[tiles.map(t=>({png:t.png.toString("base64"),cap:t.cap})),cols,tw,th,title||""]);
  return Buffer.from(b64,"base64");
}
module.exports={launch,open,applyCase,settle,sheet,CASES,ROOT};
