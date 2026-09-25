#!/usr/bin/env node
/* Where the dark pixels in the low Pratzen view come from, reproducibly.
   node tools/visual/darkness-study.js <patched.html> <original.html> <outdir>
   Builds three variants of the patched build that undo the Stage 0 grade changes one at a time,
   measures the pratzen-low case (cases.js) in each, and in the final build attributes whatever
   near-black remains to labels, formations and woods by hiding each and re-rendering the same frame.
   near-black = a pixel whose brightest channel is below 16/255, outside the interface panels;
   solid = 8x8 blocks at least 90% near-black (how a slope clipped to black shows). */
const fs=require("fs"), path=require("path"), os=require("os");
const {chromium}=require("playwright");
const [patched,original,out]=process.argv.slice(2).map(p=>path.resolve(p));
const THREE_LOCAL=[process.env.AUSTERLITZ_THREE,path.join(__dirname,"three.min.js")].find(p=>p&&fs.existsSync(p));
const MEASURE=fs.readFileSync(path.join(__dirname,"measure.js"),"utf8");
const CASE=require("./cases.js").find(c=>c.name==="pratzen-low");
fs.mkdirSync(out,{recursive:true});
function sub(s,a,b,what){ if(s.split(a).length!==2) throw new Error("variant anchor not unique: "+what); return s.replace(a,b); }
const P=fs.readFileSync(patched,"utf8");
const PINNED='      "  vec3 pc=clamp(pow(max(c,vec3(0.0)),vec3(1.0/2.2)),0.0,1.0);",\n      /* pinned at black and white, so the curve can steepen the middle but never clip an end */\n      "  vec3 pk=pow(pc,vec3(contrast)), qk=pow(vec3(1.0)-pc,vec3(contrast));",\n      "  c=pow(pk/max(pk+qk,vec3(1e-6)),vec3(2.2));",';
const PERCEPTUAL_CLAMP='      "  vec3 pc=pow(max(c,vec3(0.0)),vec3(1.0/2.2));",\n      "  pc=clamp((pc-0.5)*contrast+0.5,0.0,1.0);",\n      "  c=pow(pc,vec3(2.2));",';
const LINEAR='      "  c=clamp((c-0.5)*contrast+0.5,0.0,1.0);",';
const TOE='      "  vec3 tt=clamp(vec3(0.2)-srgb,0.0,0.2);",\n      "  srgb+=1.2*srgb*tt*tt/0.04;",\n';
const PAL_NEW='(0.70+0.42*sh)', PAL_OLD='(0.46+0.74*sh)';
const v2=sub(sub(P,PINNED,PERCEPTUAL_CLAMP,"pinned contrast"),TOE,"","shadow toe");     /* the 7.4% state */
const v1=sub(v2,PAL_NEW,PAL_OLD,"palette");                                             /* contrast change only */
const v0=sub(v1,PERCEPTUAL_CLAMP,LINEAR,"perceptual contrast");                          /* original grade and palette, Stage 0 seating */
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"aus-dark-"));
const V=[["A original build",original],["B original grade+palette, Stage 0 seating",null,v0],
         ["C + contrast in perceptual space (clamped)",null,v1],["D + narrower landscape hillshade  (the 7.4% state)",null,v2],
         ["E + pinned contrast and shadow toe  (final)",patched]];
(async()=>{
  const browser=await chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
  const rows=[];
  for(const [label,file,text] of V){
    let f=file; if(!f){ f=path.join(tmp,label[0]+".html"); fs.writeFileSync(f,text); }
    const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
    if(THREE_LOCAL) await page.route(/three(\.min)?\.js$/,r=>r.fulfill({path:THREE_LOCAL,contentType:"application/javascript"}));
    await page.goto("file://"+f+"?harness=1",{waitUntil:"commit",timeout:180000});
    await page.waitForFunction(()=>!document.getElementById("boot")&&typeof window.camera!=="undefined",null,{timeout:240000,polling:500});
    await page.evaluate(MEASURE);
    await page.evaluate(s=>window.__aus.apply(s),CASE);
    if(await page.evaluate(()=>!!window.AUSTERLITZ_DEBUG)) await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); else await page.waitForTimeout(3200);
    async function measure(tag){
      const buf=await page.screenshot({timeout:180000});
      fs.writeFileSync(path.join(out,"pratzen-low_"+label[0]+(tag?"_"+tag:"")+".png"),buf);
      return page.evaluate(b=>window.__aus.pixels(b),buf.toString("base64"));
    }
    const px=await measure("");
    rows.push({variant:label, nearBlackPct:+(100*px.nearBlack).toFixed(2), solidBlocks:px.solidBlocks, meanLum:px.meanLum});
    console.log(label.padEnd(52),"near-black",(100*px.nearBlack).toFixed(2)+"%","solid blocks",px.solidBlocks,"mean lum",px.meanLum);
    if(label[0]==="E"){
      /* attribution in the final build: hide one family of objects, re-render the same frame, re-measure */
      const parts=[["no labels","labels"],["no formations","formations"],["no woods","woods"],["none of these","all"]];
      for(const [name,key] of parts){
        await page.evaluate(k=>{
          window.__hid=[];
          function hide(o){ if(o&&o.visible){ o.visible=false; window.__hid.push(o); } }
          if(k==="labels"||k==="all") scene.traverse(o=>{ if(o.isSprite&&(o.layers.mask&2)) hide(o); });
          if(k==="formations"||k==="all") Object.keys(units).forEach(id=>{ const r=units[id]; hide(r.block); hide(r.pad); hide(r.smoke); hide(r.dust); hide(r.stem); });
          if(k==="woods"||k==="all") hide(world.woods);
          renderFrame();
        },key);
        const q=await measure(key);
        await page.evaluate(()=>{ window.__hid.forEach(o=>o.visible=true); renderFrame(); });
        rows.push({variant:"E final, "+name, nearBlackPct:+(100*q.nearBlack).toFixed(2), solidBlocks:q.solidBlocks, meanLum:q.meanLum});
        console.log(("  E final, "+name).padEnd(52),"near-black",(100*q.nearBlack).toFixed(2)+"%","solid blocks",q.solidBlocks);
      }
    }
    await page.close();
  }
  fs.writeFileSync(path.join(out,"darkness-study.json"),JSON.stringify({case:CASE,rows},null,1));
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(2); });
