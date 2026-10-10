#!/usr/bin/env node
/* Final audit (docs/FINAL_AUDIT.md, dimension 5): what a visitor sees when the page cannot start. No source changes.
   node tools/audit/boot-probe.js [--json out.json]
   Two fresh pages at 1600 x 900, without ?harness=1 (a visitor's page):
   - "no three.js": the cdnjs request for three.min.js aborted, as when offline or the CDN is blocked;
   - "no WebGL": Chromium launched with --disable-3d-apis (three.js loads; WebGL cannot be created).
   After 20 s each records whether the boot screen (#boot) is still there, its text, what else is visible, the page errors and the
   console errors, and a screenshot (docs/audit-evidence/boot-*.png when --shots is given). Never run it beside `npm run check:visual`.
   Kept as the audit's evidence: it reproduces builds before roadmap step 3. Since step 3 the page's three.js tag carries crossorigin, which
   this probe's route answers without the header the harness's tools send (tools/visual/three-route.js), and the start-up failures are
   checked by tools/visual/boot-check.js (run by check:contrast). */
const fs=require("fs"), path=require("path");
const { chromium } = require("playwright");
const ROOT=path.resolve(__dirname,"..","..");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), SHOTS=opt("--shots");
const THREE_LOCAL=path.join(ROOT,"node_modules","three","build","three.min.js");
async function run(name,args,blockThree){
  const browser=await chromium.launch({args});
  const page=await browser.newPage({viewport:{width:1600,height:900}});
  const errs=[], cons=[]; page.on("pageerror",e=>errs.push(e.message)); page.on("console",m=>{ if(m.type()==="error"||m.type()==="warning") cons.push(m.type()+": "+m.text().slice(0,160)); });
  await page.route(/three(\.min)?\.js$/,r=>blockThree?r.abort():r.fulfill({path:THREE_LOCAL,contentType:"application/javascript"}));
  await page.goto("file://"+path.join(ROOT,"austerlitz-command-map.html"),{waitUntil:"commit",timeout:180000});
  await page.waitForTimeout(20000);
  const st=await page.evaluate(()=>{ const b=document.getElementById("boot");
    return {bootPresent:!!b,bootText:b?b.textContent.trim():null,bootOpacity:b?getComputedStyle(b).opacity:null,canvas:!!document.querySelector("#stage canvas"),
      threeLoaded:typeof THREE!=="undefined",initRan:typeof renderer!=="undefined"&&!!renderer}; });
  if(SHOTS) fs.writeFileSync(path.join(SHOTS,"boot-"+name+".png"),await page.screenshot());
  await browser.close();
  return Object.assign({case:name,pageErrors:errs,console:cons},st);
}
(async()=>{
  const res=[];
  res.push(await run("no-three",["--use-angle=swiftshader","--enable-unsafe-swiftshader"],true));
  res.push(await run("no-webgl",["--disable-3d-apis","--disable-gpu"],false));
  res.forEach(r=>console.log(r.case.padEnd(10),"boot still shown:",r.bootPresent,"("+JSON.stringify(r.bootText)+")","canvas:",r.canvas,"three:",r.threeLoaded,"init ran:",r.initRan,"\n   page errors:",JSON.stringify(r.pageErrors)));
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
