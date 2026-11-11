#!/usr/bin/env node
/* The final audits' Stage 6, WP-09 (CL-UX-01, CL-UX-09): check:contrast's reflow and forced-colours states alone (tools/visual/contrast.js
   REFLOW_STATES, FC_STATES, RF_HELP, read from that file, not copied), each page opened as contrast.js opens it (?harness=1, its boot, the fonts,
   transitions off): set up, drawn, then its reached-condition. No text is read: this is the states' negative control (a build without a fix must
   leave its state unreached). node tools/final-stage6/contrast-states.js <build.html> */
"use strict";
const path=require("path"), fs=require("fs");
const html=path.resolve(process.argv[2]||"austerlitz-command-map.html"); process.env.AUSTERLITZ_HTML=html;
const L=require(path.join(__dirname,"..","stage8","lib.js")), TR=require(path.join(__dirname,"..","visual","three-route.js"));
const src=fs.readFileSync(path.join(__dirname,"..","visual","contrast.js"),"utf8"), part=src.slice(src.indexOf("const RF_HELP"),src.indexOf("function hx(h)"));
const M=new Function(part+";return {RF_HELP,REFLOW_STATES,FC_STATES};")();
async function run(b,opts,states,help,out){ const p=await b.newPage(opts); await TR.routeThree(p);
  await p.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:600000}); await TR.waitBoot(p); await p.evaluate(()=>document.fonts.ready);
  await p.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  if(help) await p.evaluate(help);
  for(const [n,fn,needs,reached] of states){ const miss=await p.evaluate(N=>N.filter(k=>typeof window[k]==="undefined"&&!new Function("try{ return typeof "+k+"!=='undefined'; }catch(e){ return false; }")()),needs);
    if(miss.length){ out.push([n,"the build has no "+miss.join(", ")]); continue; }
    let ok; try{ await p.evaluate(fn); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(3)); await p.waitForTimeout(300); ok=await p.evaluate(reached); }catch(e){ ok="error: "+e.message.split("\n")[0]; }
    out.push([n,ok]); }
  await p.close(); }
(async()=>{ const b=await L.launch(), out=[];
  await run(b,{viewport:{width:320,height:256},deviceScaleFactor:4},M.REFLOW_STATES,M.RF_HELP,out);
  await run(b,{viewport:{width:1600,height:900},deviceScaleFactor:1,forcedColors:"active"},M.FC_STATES,null,out);
  out.forEach(r=>console.log(r[0]+" "+r[1])); await b.close();
  process.exit(out.every(r=>r[1]===true)?0:1); })().catch(e=>{ console.error(e); process.exit(2); });
