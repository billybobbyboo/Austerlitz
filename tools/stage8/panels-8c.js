#!/usr/bin/env node
/* Stage 8, implementation PR 8C, the audit of 8A and 8B, finding C: the panels the unobstructed share subtracts (tools/visual/measure.js
   unobstructed()), each one's rectangle, in a check:visual case's state, with the share; on the build given, or on the committed page of each git
   revision given (--revs a,b,...: each revision's austerlitz-command-map.html, read with git show into a temporary directory), so the share can be
   followed back through the builds and two browsers compared (AUSTERLITZ_CHROME names the one to run).
   node tools/stage8/panels-8c.js --cases first-run,narrow-1024 [--revs sha,sha,...] [--json out.json]     Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), cp=require("child_process");
const L=require("./lib.js"), CASES=require(path.join(L.ROOT,"tools","visual","cases.js"));
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const NAMES=(opt("--cases")||"first-run,first-run-laptop,narrow-1024").split(","), REVS=opt("--revs")?opt("--revs").split(","):null, OUT=opt("--json");
async function measure(browser,html,name){
  const c=CASES.find(x=>x.name===name); if(!c) throw new Error("no case "+name);
  process.env.AUSTERLITZ_HTML=html; const p=await L.open(browser,c.viewport,{});
  if(!c.fresh) await p.evaluate(s=>window.__aus.apply(s),c);
  await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await p.waitForTimeout(450); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2));
  const r=await p.evaluate(()=>{
    const sel=[".rail",".dispatch",".legend",".timebar",".tools","#viewmode","#firstrun",".drawer","#tourbar","#selchip","#layerpop","#vsbadge"], railHidden=document.body.classList.contains("rail-hidden"), out=[];
    sel.forEach(s=>document.querySelectorAll(s).forEach(e=>{ const cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||+cs.opacity<0.05||e.hidden) return;
      if((e.classList.contains("rail")&&railHidden)||(e.classList.contains("drawer")&&!e.classList.contains("on"))) return;
      const b=e.getBoundingClientRect(); if(b.width>0&&b.height>0) out.push([s,+b.left.toFixed(2),+b.top.toFixed(2),+b.right.toFixed(2),+b.bottom.toFixed(2)]); }));
    return {ua:(navigator.userAgent.match(/(Headless)?Chrome\/[\d.]+/)||[""])[0], viewport:[innerWidth,innerHeight], share:window.__aus.metrics().unobstructed, panels:out}; });
  await p.close(); return r;
}
(async()=>{
  const browser=await L.launch(), res={chromium:browser.version(), runs:[]};
  let builds=[[null,path.resolve(process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html"))]], tmp=null;
  if(REVS){ tmp=fs.mkdtempSync(path.join(os.tmpdir(),"panels-8c-"));
    builds=REVS.map(s=>{ const f=path.join(tmp,s+".html"); fs.writeFileSync(f,cp.execFileSync("git",["show",s+":austerlitz-command-map.html"],{cwd:L.ROOT,maxBuffer:1<<26})); return [s,f]; }); }
  for(const [rev,html] of builds) for(const name of NAMES){
    const r=await measure(browser,html,name); res.runs.push(Object.assign({rev:rev, build:path.basename(html), case:name},r));
    console.log((rev||path.basename(html)).padEnd(12),name.padEnd(22),"share",r.share,JSON.stringify(r.panels.filter(q=>q[0]===".tools"||q[0]==="#viewmode"))); }
  await browser.close(); if(tmp) fs.rmSync(tmp,{recursive:true,force:true});
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
