#!/usr/bin/env node
/* The final audits' Stage 6: run one of the self-test's Stage 6 blocks (app.js wp09Checks, wp10Checks, ...) alone on a fresh harness page and print
   each check. node tools/final-stage6/run-block.js <block> [build.html] [--json out.json]. Measurement only. */
"use strict";
const fs=require("fs"), path=require("path");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..",".."), L=require(path.join(ROOT,"tools","stage8","lib.js"));
const block=argv[0], html=argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json"); if(html) process.env.AUSTERLITZ_HTML=path.resolve(html);
(async()=>{
  const b=await L.launch(), page=await L.open(b,[1366,768]), log=[];
  page.on("console",m=>{ if(m.type()==="warning"||m.type()==="error") log.push(m.text().slice(0,300)); });
  page.on("pageerror",e=>log.push("pageerror: "+e.message));
  const t0=Date.now();
  const res=await page.evaluate(n=>window[n](),block);
  res.forEach(c=>console.log((c.ok?"ok   ":"FAIL ")+c.name+"\n      "+String(c.detail).slice(0,600)));
  console.log(block+":",res.filter(c=>c.ok).length,"of",res.length,"passed in",Date.now()-t0,"ms; console",log.length,log.slice(0,4).join(" | "));
  if(opt("--json")) fs.writeFileSync(opt("--json"),JSON.stringify({block,checks:res,console:log},null,1));
  await b.close(); process.exit(res.every(c=>c.ok)&&!log.length?0:1);
})().catch(e=>{ console.error(e); process.exit(2); });
