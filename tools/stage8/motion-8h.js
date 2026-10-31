#!/usr/bin/env node
/* Stage 8, implementation PR 8H (decision 258 (b); docs/STAGE8_SPEC.md section 20.8): the harness's motion block on a page of its own, as
   tools/stage8/motion-8d.js runs it (?harness=1, software WebGL, the measures injected, CSS transitions off; tools/visual/motion.js runBlock: the
   16 motions and the extra runs, every run's jumps, pops, level-of-detail switches and flickers, its invariants and the formations' visibility),
   with a prototype of tools/stage8/protos/ put into the page after it started (--proto counters:c4), so a variant is measured on the exact
   benchmark decision 257 (b) pins (run it with AUSTERLITZ_CHROME naming Playwright 1.56's Chromium 141 headless shell, the browser CI runs).
   --frames (section 20.4): the block run through a copy of tools/visual/motion.js that counts, in each driven run, the frames the app drew
   (laid the map layer out) among the eight before the motion and the thirty at rest after it; --pre-all with it asks for every one of the
   eight in every run (the experiment that showed the Play runs' passes phased by them).
   node tools/stage8/motion-8h.js [<build.html>] [--proto file:variant] [--selftest] [--frames [--pre-all]] [--json out.json]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto"), os=require("os");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const L=require("./lib.js"), TR=require(path.join(L.ROOT,"tools","visual","three-route.js"));
const MO=(function(){ const f=path.join(L.ROOT,"tools","visual","motion.js"); if(!argv.includes("--frames")) return require(f);
  /* the instrumented copy: each replacement must apply exactly once */
  let s=fs.readFileSync(f,"utf8"); const rep=(a,b)=>{ if(s.split(a).length!==2) throw new Error("motion.js changed: "+a.slice(0,60)); s=s.replace(a,()=>b); };
  rep("var D=window.__md, kind=a.kind, n=a.n, amt=a.amt, F=[], c=D.centre(), opt={room:!!a.room}, sel=a.select||null;","var D=window.__md, kind=a.kind, n=a.n, amt=a.amt, F=[], c=D.centre(), opt={room:!!a.room}, sel=a.select||null, mf0, preDrawn, mr0;");
  rep("requestRender(2);   /* the layer laid out before the first snap","requestRender(a.preAll?(a.pre||8):2); mf0=ML.frame;   /* the layer laid out before the first snap");
  rep("D.frame(a.pre||8); F.push(D.snap(opt)); togglePlay(); }","D.frame(a.pre||8); preDrawn=ML.frame-mf0; F.push(D.snap(opt)); togglePlay(); }");
  rep("else { D.frame(a.pre||8); F.push(D.snap(opt)); }","else { D.frame(a.pre||8); preDrawn=ML.frame-mf0; F.push(D.snap(opt)); }");
  rep("var restFrom=F.length;\n  for(var r=0;r<(a.rest||30);r++){ D.frame(); F.push(D.snap(opt)); }","var restFrom=F.length; mr0=ML.frame;\n  for(var r=0;r<(a.rest||30);r++){ D.frame(); F.push(D.snap(opt)); }");
  rep("return {F:F, restFrom:restFrom, ms:lm,","return {F:F, restFrom:restFrom, ms:lm, preDrawn:preDrawn, restDrawn:ML.frame-mr0,");
  rep("const A={kind:kind,n:n,amt:amt,gl:false,room:false,select:R.sel||null,rest:30,pre:8,reading:X.reading||null,touch:!!X.touch};","const A={kind:kind,n:n,amt:amt,gl:false,room:false,select:R.sel||null,rest:30,pre:8,reading:X.reading||null,touch:!!X.touch,preAll:"+(argv.includes("--pre-all")?"true":"false")+"};");
  rep("end:M.idle, msMed:q(0.5), msP95:q(0.95), secs:+((Date.now()-t0)/1000).toFixed(1)};","end:M.idle, msMed:q(0.5), msP95:q(0.95), secs:+((Date.now()-t0)/1000).toFixed(1), preDrawn:r.preDrawn, restDrawn:r.restDrawn};");
  s=s.replace(/require\("(\.\/[^"]+)"\)/g,(m,q)=>"require("+JSON.stringify(path.join(path.dirname(f),q))+")");
  const tmp=path.join(fs.mkdtempSync(path.join(os.tmpdir(),"motion-8h-")),"motion.js"); fs.writeFileSync(tmp,s); return require(tmp); })();
const OUT=opt("--json"), SO=argv.includes("--selftest"), PROTO=opt("--proto"), html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(L.ROOT,"austerlitz-command-map.html"));
const MEASURE=fs.readFileSync(path.join(L.ROOT,"tools","visual","measure.js"),"utf8");
(async()=>{
  const browser=await L.launch(), errs=[], t0=Date.now();
  const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
  page.on("pageerror",e=>errs.push(e.message)); page.on("console",m=>{ if(m.type()==="warning"||m.type()==="error") errs.push(m.type()+": "+m.text().slice(0,200)); });
  await TR.routeThree(page); await page.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(page);
  await page.evaluate(MEASURE); await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  let proto=null;
  if(PROTO){ const [f,v]=PROTO.split(":"); await page.evaluate(fs.readFileSync(path.join(__dirname,"protos",f+".js"),"utf8")); await page.evaluate(([f,v])=>window.__p8h[f].install(v),[f,v]); proto={file:f, variant:v}; }
  const settle=async p=>{ await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await p.waitForTimeout(450); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); };
  const R=await MO.runBlock(page,settle,{selftestOnly:SO, log:s=>console.log(s)}), ver=browser.version();
  if(proto) proto.stats=await page.evaluate(f=>window.__p8h[f].stats(),proto.file);
  await page.close(); await browser.close();
  const base=R.runs.filter(r=>!r.real&&!r.point&&!r.select&&!r.reading&&!r.touch), S=k=>base.reduce((s,r)=>s+r[k],0), T=k=>R.runs.reduce((s,r)=>s+r.track[k],0);
  R.totals={jumps:S("jumps"), pops:S("pops"), lod:S("lod"), flicker:S("flicker")};
  R.visibility={inView:T("inView"), drawn:T("on"), share:+(100*T("on")/Math.max(1,T("inView"))).toFixed(2), longestMs:Math.max(...R.runs.map(r=>r.track.longestMs)), episodes:T("episodes")};
  R.build=path.basename(html); R.md5=crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex"); R.chromium=ver; R.proto=proto;
  R.selftestOnly=SO; R.console=errs; R.secs=Math.round((Date.now()-t0)/1000);
  console.log("the 16: "+JSON.stringify(R.totals)+"; visibility "+JSON.stringify(R.visibility)+"; "+R.runs.length+" runs; console "+errs.length+" ("+R.secs+" s)"+(proto?"; proto "+JSON.stringify(proto):""));
  R.runs.forEach(r=>console.log("  "+r.key.padEnd(28)+" formations drawn "+r.track.on+" of "+r.track.inView+" ("+(r.track.inView?(100*r.track.on/r.track.inView).toFixed(1):"-")+"%), longest hidden "+r.track.longestMs+" ms, "+r.track.episodes+" disappearances"+(r.preDrawn!==undefined?", frames drawn before "+r.preDrawn+" of 8, at rest "+r.restDrawn+" of 30":"")));
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(R,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
