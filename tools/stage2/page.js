/* Stage 2 Part A: open the built page the way the Stage 0 harness does (headless Chromium, software WebGL,
   ?harness=1 for deterministic frames, three.js served locally when available), with the harness's in-page
   driver (tools/visual/measure.js) injected. Shared by the measurement scripts in this folder. */
const fs=require("fs"), path=require("path");
const { chromium } = require("playwright");
const ROOT=path.resolve(__dirname,"..","..");
const TR=require("../visual/three-route.js"), THREE_LOCAL=TR.THREE_LOCAL;   /* roadmap step 3: one route for three.js (decision 133) */
const MEASURE=fs.readFileSync(path.join(ROOT,"tools","visual","measure.js"),"utf8");
const CASES=require(path.join(ROOT,"tools","visual","cases.js"));
async function launch(){
  return chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
}
async function open(browser,vp,html,init,query){   /* query: more of the page's query string, e.g. "&labels=canvas" (Stage 2D) */
  const page=await browser.newPage({viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:1});
  if(init) await page.addInitScript(init);
  page._errors=[]; page.on("pageerror",e=>page._errors.push(e.message));
  await TR.routeThree(page);
  /* AUSTERLITZ_HTML measures a fixed build (e.g. an archived one) while the sources are being edited */
  await page.goto("file://"+path.resolve(html||process.env.AUSTERLITZ_HTML||path.join(ROOT,"austerlitz-command-map.html"))+"?harness=1"+(query||""),{waitUntil:"commit",timeout:180000});
  await TR.waitBoot(page);
  await page.evaluate(MEASURE);
  /* CSS transitions off (Stage 2D), as in the harness: headless Chromium does not advance them while the page draws nothing */
  await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  return page;
}
async function applyCase(page,c){ await page.evaluate(s=>window.__aus.apply(s),c); await settle(page); }
async function settle(page){ await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(90));
  /* anything the page does after a frame (the time bar's ResizeObserver): let it run, then lay out and draw once more */
  await page.waitForTimeout(450); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); }
/* a contact sheet: tiles (PNG buffers) scaled into a grid with captions, returned as a JPEG buffer */
async function sheet(page,tiles,cols,tw,th,title,fit){   /* fit: keep each tile's aspect ratio (Stage 2D, the legend crops) */
  const b64=await page.evaluate(async([T,cols,tw,th,title,fit])=>{
    const load=s=>new Promise(r=>{ const i=new Image(); i.onload=()=>r(i); i.src="data:image/png;base64,"+s; });
    const rows=Math.ceil(T.length/cols), cap=22, top=title?30:0, cv=document.createElement("canvas");
    cv.width=cols*tw; cv.height=top+rows*(th+cap); const x=cv.getContext("2d");
    x.fillStyle="#101418"; x.fillRect(0,0,cv.width,cv.height);
    x.font="600 16px sans-serif"; x.fillStyle="#E8E2D3"; if(title) x.fillText(title,8,21);
    for(let k=0;k<T.length;k++){ const im=await load(T[k].png), c=k%cols, r=Math.floor(k/cols), ox=c*tw, oy=top+r*(th+cap);
      if(fit){ const s=Math.min(tw/im.width,th/im.height); x.drawImage(im,ox+(tw-im.width*s)/2,oy+cap,im.width*s,im.height*s); }
      else x.drawImage(im,ox,oy+cap,tw,th);
      x.font="14px sans-serif"; x.fillStyle="#E8E2D3"; x.fillText(T[k].cap,ox+6,oy+16); }
    return cv.toDataURL("image/jpeg",0.86).split(",")[1];
  },[tiles.map(t=>({png:t.png.toString("base64"),cap:t.cap})),cols,tw,th,title||"",!!fit]);
  return Buffer.from(b64,"base64");
}
module.exports={launch,open,applyCase,settle,sheet,CASES,ROOT};
