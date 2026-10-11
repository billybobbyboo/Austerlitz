#!/usr/bin/env node
/* tools/fonts/accept-probe.js: the acceptance test of the embedded type (decision 141; roadmap step 1, docs/FINAL_AUDIT.md T-0).
   node tools/fonts/accept-probe.js [build.html] [--json out.json]
   Before the type was embedded, check:visual's verdict depended on the fonts installed (narrow-390 measured 46.0% here against its
   46.8% baseline, 46.89% with DejaVu Sans). This probe opens the three fresh cases that measure where text decides the layout
   (narrow-390 at 390 x 844, first-run at 1600 x 900, and opening-1-laptop at 1280 x 720, reached by a real click on the card's primary
   action), as tools/visual/harness.js opens them (headless Chromium, software WebGL, ?harness=1, measure.js, CSS transitions off), in
   two font configurations: this machine's (the inherited environment) and a DejaVu-only fontconfig (FONTCONFIG_FILE, written to a
   private temporary directory). In each it records the timeline's height, the first-run card's and the opening bar's boxes, the
   unobstructed share (measure.js, to 0.0001) and which fonts drew the card's title, its key, the timeline's caption and a probe set in
   plain sans-serif and serif. It passes when the two configurations draw the system's generic faces differently (else it proves nothing)
   and the embedded faces draw the probed interface in both, and every measure is identical: boxes and heights within 0.01 px, the
   unobstructed share within 0.01 point. Exit 0 pass, 1 fail, 2 could not run. Measurement only; one browser at a time, never beside
   npm run check:visual. */
const fs=require("fs"), os=require("os"), path=require("path"), cp=require("child_process");
const ROOT=path.resolve(__dirname,"..",".."), argv=process.argv.slice(2);
const HTML=path.resolve(argv.find(a=>/\.html$/.test(a))||path.join(ROOT,"austerlitz-command-map.html"));
const JSON_OUT=argv.includes("--json")?argv[argv.indexOf("--json")+1]:null;
const CASES=[{name:"narrow-390",vp:[390,844]},{name:"first-run",vp:[1600,900]},{name:"opening-1-laptop",vp:[1280,720],opening:true}];
const EMBEDDED=["Austerlitz Sans","Austerlitz Serif"];

async function child(){
  const { chromium }=require("playwright");
  const TR=require("../visual/three-route.js"), THREE_LOCAL=TR.THREE_LOCAL;   /* roadmap step 3: one route for three.js (decision 133) */
  const MEASURE=fs.readFileSync(path.join(ROOT,"tools","visual","measure.js"),"utf8");
  const browser=await chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
  const res={fontconfig:process.env.FONTCONFIG_FILE||"(this machine's)",cases:{}};
  for(const c of CASES){
    const page=await browser.newPage({viewport:{width:c.vp[0],height:c.vp[1]},deviceScaleFactor:1});
    const errors=[]; page.on("pageerror",e=>errors.push(e.message));
    await TR.routeThree(page);
    await page.goto("file://"+HTML+"?harness=1",{waitUntil:"commit",timeout:180000});
    await TR.waitBoot(page);
    await page.evaluate(MEASURE);
    await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
    const settle=async()=>{ await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await page.waitForTimeout(450); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); };
    await settle();
    if(c.opening){ await page.click("#fr-tour",{timeout:180000}); await settle(); }
    const m=await page.evaluate(()=>{ const box=id=>{ const e=document.getElementById(id); if(!e||e.hidden) return null; const r=e.getBoundingClientRect();
        return r.width>0?[r.left,r.top,r.width,r.height].map(v=>+v.toFixed(3)):null; };
      const mt=window.__aus.metrics();
      /* two probes set in the generic families, outside the interface's faces: what this configuration draws for them */
      ["sans-serif","serif"].forEach((g,i)=>{ const p=document.createElement("span"); p.id="__fontprobe"+i; p.textContent="Hamburgefontsiv";
        p.style.cssText="position:fixed;left:0;top:0;font-family:"+g+";opacity:0;pointer-events:none"; document.body.appendChild(p); });
      /* the line box at line-height normal, embedded face against the face its metric overrides copy (where installed): a record */
      const lines={}; [["Austerlitz Sans","DejaVu Sans"],["Austerlitz Serif","Liberation Serif"]].forEach(pair=>{ pair.forEach(fam=>{ lines[fam]=[10.5,11.5,12.5,14,17,21,25].map(px=>{
        const q=document.createElement("span"); q.textContent="Hamburg"; q.style.cssText="position:fixed;left:0;top:0;display:inline-block;line-height:normal;opacity:0;font-family:\""+fam+"\";font-size:"+px+"px";
        document.body.appendChild(q); const h=q.getBoundingClientRect().height; q.remove(); return h; }); }); });
      return {timeline:mt.timeline.height,unobstructed:mt.unobstructed,card:box("firstrun"),bar:box("tourbar"),lineBoxes:lines,
        opening:typeof OPENING!=="undefined"?{on:OPENING.on,k:OPENING.k}:null,faces:(typeof FONTS!=="undefined"&&FONTS.state)?FONTS.state:null}; });
    const cdp=await page.context().newCDPSession(page); await cdp.send("DOM.enable"); await cdp.send("CSS.enable");
    const doc=await cdp.send("DOM.getDocument",{depth:-1});
    async function drawn(sel){ const q=await cdp.send("DOM.querySelector",{nodeId:doc.root.nodeId,selector:sel}); if(!q.nodeId) return null;
      return (await cdp.send("CSS.getPlatformFontsForNode",{nodeId:q.nodeId})).fonts.map(f=>f.familyName+(f.isCustomFont?"":" (system)")); }
    m.fonts={cardTitle:await drawn("#fr-title"),cardKey:await drawn("#fr-key"),caption:await drawn("#tb-cap"),play:await drawn("#play"),
      barTitle:await drawn("#tour-t"),genericSans:await drawn("#__fontprobe0"),genericSerif:await drawn("#__fontprobe1")};
    m.errors=errors;
    res.cases[c.name]=m;
    await page.close();
  }
  await browser.close();
  process.stdout.write("\n@@RESULT@@"+JSON.stringify(res)+"\n");
}

function dejavuDir(){
  const tried=["/usr/share/fonts/truetype/dejavu","/usr/share/fonts/dejavu","/usr/share/fonts/TTF","/usr/local/share/fonts/dejavu"];
  for(const d of tried) if(fs.existsSync(path.join(d,"DejaVuSans.ttf"))) return d;
  try{ const f=cp.execFileSync("fc-match",["-f","%{file}","DejaVu Sans"],{encoding:"utf8"}); if(/DejaVuSans\.ttf$/.test(f)) return path.dirname(f); }catch(e){}
  return null;
}
function run(env,label){
  const r=cp.spawnSync(process.execPath,[__filename,"--child",HTML],{env:Object.assign({},process.env,env),encoding:"utf8",maxBuffer:1<<26,timeout:1800000});
  const m=/@@RESULT@@(.*)\n/.exec(r.stdout||"");
  if(r.status!==0||!m){ console.error("accept-probe: the "+label+" run failed (exit "+r.status+")\n"+(r.stderr||"").slice(-3000)); process.exit(2); }
  return JSON.parse(m[1]);
}
function main(){
  if(!fs.existsSync(HTML)){ console.error("accept-probe: no build at "+HTML); process.exit(2); }
  const dj=dejavuDir(); if(!dj){ console.error("accept-probe: no DejaVu Sans directory found for the DejaVu-only configuration"); process.exit(2); }
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"austerlitz-fonts-"));
  const conf=path.join(tmp,"fonts.conf");
  fs.writeFileSync(conf,'<?xml version="1.0"?>\n<!DOCTYPE fontconfig SYSTEM "fonts.dtd">\n<fontconfig>\n  <dir>'+dj+'</dir>\n  <cachedir>'+path.join(tmp,"cache")+'</cachedir>\n</fontconfig>\n');
  const A=run({},"this machine's fonts"), B=run({FONTCONFIG_FILE:conf},"DejaVu-only");
  fs.rmSync(tmp,{recursive:true,force:true});
  const fails=[], rows=[];
  const near=(a,b,t)=>(a===null&&b===null)||(Array.isArray(a)&&Array.isArray(b)?a.length===b.length&&a.every((v,i)=>Math.abs(v-b[i])<=t):(a!==null&&b!==null&&Math.abs(a-b)<=t));
  for(const c of CASES){
    const a=A.cases[c.name], b=B.cases[c.name];
    for(const [k,t] of [["timeline",0.01],["card",0.01],["bar",0.01],["unobstructed",0.0001]]){
      const ok=near(a[k],b[k],t); rows.push([c.name,k,JSON.stringify(a[k]),JSON.stringify(b[k]),ok?"identical":"DIFFERENT"]);
      if(!ok) fails.push(c.name+": "+k+" "+JSON.stringify(a[k])+" with this machine's fonts, "+JSON.stringify(b[k])+" with DejaVu only"); }
    if(c.opening&&!(a.opening&&a.opening.on&&a.opening.k===0&&b.opening&&b.opening.on&&b.opening.k===0)) fails.push(c.name+": the opening's first step was not reached");
    for(const [lab,R] of [["this machine's fonts",a],["DejaVu only",b]]){
      /* an element not shown (the card after the click, the bar before it) is drawn in no font: skipped; the caption, and the card's title or
         the bar's, must have been drawn, and only in the embedded faces */
      for(const k of ["cardTitle","cardKey","caption","play","barTitle"]){ const f=R.fonts[k]; if(!f||!f.length) continue;
        if(f.some(x=>!EMBEDDED.includes(x))) fails.push(c.name+" ("+lab+"): "+k+" drawn in "+f.join(", ")); }
      if(!(R.fonts.caption&&R.fonts.caption.length)||!((R.fonts.cardTitle&&R.fonts.cardTitle.length)||(R.fonts.barTitle&&R.fonts.barTitle.length)))
        fails.push(c.name+" ("+lab+"): the caption, or both the card's and the bar's titles, drawn in no font");
      if(!R.faces||R.faces.loaded.length!==3||R.faces.failed.length) fails.push(c.name+" ("+lab+"): the embedded faces' record at boot "+JSON.stringify(R.faces));
      if(R.errors.length) fails.push(c.name+" ("+lab+"): page errors "+R.errors.join("; "));
    }
  }
  const gs=k=>JSON.stringify(A.cases["first-run"].fonts[k])+" against "+JSON.stringify(B.cases["first-run"].fonts[k]);
  const differ=JSON.stringify(A.cases["first-run"].fonts.genericSans)!==JSON.stringify(B.cases["first-run"].fonts.genericSans)||
    JSON.stringify(A.cases["first-run"].fonts.genericSerif)!==JSON.stringify(B.cases["first-run"].fonts.genericSerif);
  if(!differ) fails.push("the two configurations draw the generic faces alike ("+gs("genericSans")+"; "+gs("genericSerif")+"): the probe proves nothing here");
  console.log("generic sans-serif: "+gs("genericSans")+"\ngeneric serif: "+gs("genericSerif"));
  rows.forEach(r=>console.log(r[0].padEnd(18)+r[1].padEnd(13)+r[2].padEnd(36)+r[3].padEnd(36)+r[4]));
  ["first-run","narrow-390","opening-1-laptop"].forEach(n=>console.log(n+": card title "+JSON.stringify(A.cases[n].fonts.cardTitle)+", caption "+JSON.stringify(A.cases[n].fonts.caption)+
    ", bar title "+JSON.stringify(A.cases[n].fonts.barTitle)+"; boot record "+(A.cases[n].faces?A.cases[n].faces.loaded.length+" loaded in "+A.cases[n].faces.ms+" ms"+(A.cases[n].faces.late?", late":""):"none")));
  const lb=A.cases["first-run"].lineBoxes; console.log("line boxes at 10.5-25 px (this machine): "+Object.keys(lb).map(k=>k+" "+lb[k].join("/")).join("; "));
  if(JSON_OUT) fs.writeFileSync(JSON_OUT,JSON.stringify({machine:A,dejavuOnly:B,fails},null,1));
  fails.forEach(f=>console.log("  ! "+f));
  console.log(fails.length?"ACCEPTANCE: FAILED ("+fails.length+")":"ACCEPTANCE: identical under both font configurations; every probed text drawn in the embedded faces");
  process.exitCode=fails.length?1:0;
}
if(argv.includes("--child")) child().catch(e=>{ console.error(e); process.exit(1); });
else main();
