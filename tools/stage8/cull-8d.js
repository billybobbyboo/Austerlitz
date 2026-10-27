#!/usr/bin/env node
/* Stage 8, implementation PR 8D (decision 249 (a); docs/STAGE8_SPEC.md section 16): culling in motion, outside the harness: the harness's own
   block (tools/visual/cullmotion.js runBlock: the sequences, each frame's culling judged against its instances, every second frame compared
   pixel for pixel with the same state drawn without culling), on pages opened as the harness opens them (?harness=1, software WebGL, the
   measures injected, CSS transitions off; the phone's page with the phone cases' device).
   node tools/stage8/cull-8d.js [<build.html>] [--json out.json] [--mutate half|camonly] [--seq word,word]
   --mutate: the block run on a copy with one rule broken, as tools/stage8/mutate-8d.js breaks it (half: the bounds' radius halved; camonly: the
   shadow pass tested against the eye's frustum), to show the block fails it (judged by thresholds.js checkLive's culling rules).
   --seq: only the sequences whose labels hold one of the words (the block's own runBlock, o.only); the judgement then leaves out what the
   sequences not run would have given it (the block's count, and the edges', the low sun's and the restore's rules for sequences not run), and
   prints what remains (judgedRun): what the sequences run show.
   --join a.json,b.json,...: runs of one build made in parts (--seq) joined in the block's order and judged as the whole block (nothing rendered).
   Measurement only; nothing is written to a source file (a mutated copy goes to a temporary directory). */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("./lib.js"), CM=require(path.join(L.ROOT,"tools","visual","cullmotion.js")), TR=require(path.join(L.ROOT,"tools","visual","three-route.js"));
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), MUTATE=opt("--mutate"), SEQ=opt("--seq")?opt("--seq").split(","):null, html0=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(L.ROOT,"austerlitz-command-map.html"));
const MUTS={half:[["cl.s.radius=n>0?R:-1;","cl.s.radius=n>0?R*0.5:-1;"]],
  camonly:[["var r=fr.intersectsSphere(_cullS); if(!r) CULL.frame.culled++;",
    "camera.updateMatrixWorld(); var r=(window.__eyeF8||(window.__eyeF8=new THREE.Frustum())).setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse)).intersectsSphere(_cullS); if(!r) CULL.frame.culled++;"]]};
const JOIN=opt("--join");
if(JOIN){ const T=require(path.join(L.ROOT,"tools","visual","thresholds.js")), parts=JOIN.split(",").map(f=>JSON.parse(fs.readFileSync(f,"utf8")));
  if(new Set(parts.map(p=>p.md5)).size!==1||new Set(parts.map(p=>p.chromium)).size!==1) throw new Error("--join: the parts are not of one build and one browser");
  const order=CM.SEQ.map(s=>s[0]).concat(CM.PHONE_SEQ.map(s=>s[0])), runs=[].concat(...parts.map(p=>p.runs)).sort((a,b)=>order.indexOf(a.label)-order.indexOf(b.label));
  const R={note:"the block (tools/visual/cullmotion.js runBlock) run in "+parts.length+" parts (--seq), joined in its order", build:parts[0].build, md5:parts[0].md5, chromium:parts[0].chromium,
    parts:parts.map(p=>p.seq), runs:runs, console:[].concat(...parts.map(p=>p.console||[])), secs:parts.reduce((s,p)=>s+(p.secs||0),0)};
  R.judged=T.checkLive({cull:R},{}).filter(x=>/^culling in motion/.test(x));
  R.totals=runs.reduce((a,r)=>{ ["judged","compared","px","culled","shadowOnly","toggles","inView"].forEach(k=>a[k]=(a[k]||0)+r[k]); return a; },{});
  if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(R,null,1)); }
  console.log(runs.length+" runs; total: "+JSON.stringify(R.totals)+"; console "+R.console.length);
  console.log(R.judged.length?"JUDGED: "+R.judged.join(" ").slice(0,900):"judged as check:visual judges the block (thresholds.js): passes");
  process.exit(R.judged.length?1:0); }
let html=html0;
if(MUTATE){ if(!MUTS[MUTATE]) throw new Error("--mutate: one of "+Object.keys(MUTS).join(", ")); let s=fs.readFileSync(html0,"utf8");
  for(const [a,b] of MUTS[MUTATE]){ if(s.split(a).length!==2) throw new Error(MUTATE+": the string to replace is not found exactly once"); s=s.replace(a,()=>b); }
  const d=fs.mkdtempSync(path.join(require("os").tmpdir(),"cull-8d-")); html=path.join(d,MUTATE+".html"); fs.writeFileSync(html,s); }
const IOS="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const MEASURE=fs.readFileSync(path.join(L.ROOT,"tools","visual","measure.js"),"utf8");
(async()=>{
  const browser=await L.launch(), errs=[];
  async function open(vp,dev){
    const page=dev?await (await browser.newContext({viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:IOS})).newPage()
      :await browser.newPage({viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:1});
    page.on("pageerror",e=>errs.push(e.message)); page.on("console",m=>{ if(m.type()==="warning"||m.type()==="error") errs.push(m.type()+": "+m.text().slice(0,200)); });
    await TR.routeThree(page); await page.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(page);
    await page.evaluate(MEASURE); await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
    return page; }
  async function settle(page){ await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await page.waitForTimeout(450); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); }
  const t0=Date.now(), R=await CM.runBlock(open,settle,{log:s=>console.log(s), only:SEQ});
  R.build=path.basename(html0); R.md5=crypto.createHash("md5").update(fs.readFileSync(html0)).digest("hex"); R.mutate=MUTATE||null; R.chromium=browser.version(); R.console=errs; R.secs=Math.round((Date.now()-t0)/1000);
  R.judged=require(path.join(L.ROOT,"tools","visual","thresholds.js")).checkLive({cull:R},{}).filter(x=>/^culling in motion/.test(x));
  R.seq=SEQ;
  if(SEQ){ /* what the sequences not run would have given the judgement, left out */
    const has=re=>R.runs.some(r=>re.test(r.label)), cut=[/\d+ of the \d+ sequences and \d+ of the \d+ on the phone run/];
    if(!has(/leaving the view by each edge/)) cut.push(/a formation taken out of the view by each edge: a sequence with no mesh changing between culled and drawn \(\)/);
    if(!has(/a low sun/)) cut.push(/the low sun's sequence draws no mesh out of view in the shadow pass \(not run\)/);
    if(!R.runs.some(r=>r.ctx)) cut.push(/no frame drawn after the context's restore/);
    R.judgedRun=R.judged.map(x=>{ let b=x.replace(/^culling in motion \(decision 249 \(a\)\): /,""); cut.forEach(re=>{ b=b.replace(re,""); }); return b.replace(/^(; )+|(; )+$/g,"").replace(/(; ){2,}/g,"; "); }).filter(x=>x.length); }
  await browser.close();
  if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(R,null,1)); }
  const T=R.runs.reduce((a,r)=>{ ["judged","compared","px","culled","shadowOnly","toggles","inView"].forEach(k=>a[k]=(a[k]||0)+r[k]); return a; },{});
  console.log("total: "+JSON.stringify(T)+"; console "+errs.length+(errs.length?": "+errs.slice(0,3).join(" | "):"")+" ("+R.secs+" s)");
  console.log(R.judged.length?"JUDGED: "+R.judged.join(" ").slice(0,900):"judged as check:visual judges the block (thresholds.js): passes");
  if(SEQ) console.log(R.judgedRun.length?"THE SEQUENCES RUN: "+R.judgedRun.join(" ").slice(0,900):"the sequences run: nothing found");
  if(MUTATE) fs.rmSync(path.dirname(html),{recursive:true,force:true});
})().catch(e=>{ console.error(e); process.exit(1); });
