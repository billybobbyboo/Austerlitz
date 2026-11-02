#!/usr/bin/env node
/* Final audit after Stage 8, verification v-repro-ux-maps: V-M5's origin. The paper map entered by real clicks at 1600x900, 1280x720 and
   1024x768 (09:30, Study, everyone) on a visitor's page of another build, read as desk.js reads the audited build (the pass's own list, one
   pass, each place's state). The build: AUSTERLITZ_HTML (default: main at 9eb7abb, the last commit before Stage 8 Part A, its build md5
   c4793156..., extracted to the scratchpad by git show). Set-up by script, said so: the clock (setClock) and AUSTERLITZ_DEBUG.settle.
   node tools/audit-post8/verification/v-repro-ux-maps/origin.js [label]  -> docs/audit-post8-evidence/verification/v-repro-ux-maps/origin-<label>.json */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const SCR="/tmp/claude-0/-home-user-Austerlitz/cb561984-b1ad-5d5a-82ba-de46bf4c820e/scratchpad/v-repro-ux-maps";
if(!process.env.AUSTERLITZ_HTML) process.env.AUSTERLITZ_HTML=path.join(SCR,"build-pre8.html");
const A=require("../../lib.js");
const label=process.argv[2]||"pre8";
const OUT=path.join(A.EVID,"verification","v-repro-ux-maps"); fs.mkdirSync(OUT,{recursive:true});
const md5=crypto.createHash("md5").update(fs.readFileSync(process.env.AUSTERLITZ_HTML)).digest("hex");
const R={build:path.basename(process.env.AUSTERLITZ_HTML)+" md5 "+md5,browser:"Chromium 141.0.7390.37 headless shell, SwiftShader",page:"visitor page (no ?harness=1)",steps:[]};
const save=()=>fs.writeFileSync(path.join(OUT,"origin-"+label+".json"),JSON.stringify(R,null,1));
const step=(what,o)=>{ R.steps.push(Object.assign({what},o)); console.log("STEP",what,JSON.stringify(o).slice(0,300)); save(); };
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const LAYER=()=>{ var L=mlCollect(); mlLayout(); var by={}, items=L.map(function(it){ by[it.cat]=by[it.cat]||{}; by[it.cat][it.state||"?"]=(by[it.cat][it.state||"?"]||0)+1;
  return {id:it.key,cat:it.cat,state:it.state,text:((it.el&&it.el.textContent)||"").replace(/\s+/g," ").trim().slice(0,70)}; });
  return {n:L.length,byCat:by,places:items.filter(function(x){ return x.cat==="place"; })}; };
async function click(page,sel){ const b=await page.evaluate(s=>{ const e=document.querySelector(s); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.left+r.width/2,y:r.top+r.height/2,w:r.width}; },sel);
  if(!b||!(b.w>0)) throw new Error("not clickable: "+sel); await page.mouse.click(b.x,b.y); await wait(900); return sel; }
async function settle(page){ await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(30)); await wait(1200); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); }
async function setMode(page,m){ return [await click(page,"#layersbtn"),await click(page,'.mode-btn[data-m="'+m+'"]'),await click(page,"#layerclose")]; }
(async()=>{
  const t0=Date.now(), b=await A.launch(); let page;
  try{
    page=await A.open(b,[1600,900],{harness:false,transitions:true});
    await page.waitForSelector("#firstrun:not([hidden])",{timeout:120000}).catch(()=>{});
    await page.keyboard.press("Escape"); await wait(1500);
    await page.evaluate(()=>setClock(570,{instant:true,force:true})); await settle(page);
    for(const vp of [[1600,900],[1280,720],[1024,768]]){
      if(vp[0]!==1600){ await page.setViewportSize({width:vp[0],height:vp[1]}); await wait(2500); await setMode(page,"terrain"); await settle(page); }
      const mc=await setMode(page,"staff"); await wait(2500); await settle(page);
      const L=await page.evaluate(LAYER);
      const f=path.join(OUT,"origin-"+label+"-paper-"+vp.join("x")+".jpg"); await A.jpeg(page,f,78);
      step("paper map entered by real clicks at "+vp.join("x"),{clicks:mc,state:await A.state(page),n:L.n,byCat:L.byCat,places:L.places,shot:path.relative(A.ROOT,f)});
    }
    R.errors=A.errors(page);
  }catch(e){ step("FAILED",{err:String(e.stack||e).slice(0,800)}); }
  finally{ R.seconds=Math.round((Date.now()-t0)/1000); save(); await b.close().catch(()=>{}); console.log("done",R.seconds); }
})();
