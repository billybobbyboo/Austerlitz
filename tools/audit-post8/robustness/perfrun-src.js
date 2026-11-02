/* Final audit after Stage 8, area "robustness": tools/step6/perf-run.html's ?src= parameter (measurement only; nothing is changed).
   node tools/audit-post8/robustness/perfrun-src.js  ->  docs/audit-post8-evidence/robustness/perfrun-src.json
   perf-run.html sets its frame's src from location.search's "src" unchecked (tools/step6/perf-run.html:40-45: src=q.get("src")...; fr.src=src),
   and GitHub Pages serves that page (pages-tools-headers.txt: HTTP 200, the repository's bytes). Here the page and perf-route.js are copied
   unchanged into a scratch folder and served from a local HTTP server on 127.0.0.1 (never the live site); then, in the pinned Chromium:
   1. ?src=javascript:...  a benign payload that writes the parent page's title from inside the frame (does script run in the page's origin?);
   2. ?src=data:text/html,... the same attempt from a data: document (an opaque origin: expected blocked);
   3. the default (no src): the frame's src as the page intends (the control).
   Each case: the page's title after 4 s, the frame's URL, and the console's errors. */
"use strict";
const fs=require("fs"), path=require("path"), http=require("http");
const A=require("../lib.js");
const ROOT=path.resolve(__dirname,"..","..",".."), OUT=path.join(A.EVID,"robustness","perfrun-src.json");
const SIM=path.join("/tmp/claude-0/-home-user-Austerlitz/cb561984-b1ad-5d5a-82ba-de46bf4c820e/scratchpad","robustness","pages-sim");
(async()=>{
  const res={what:"perf-run.html ?src= on a local copy",started:new Date().toISOString(),cases:[]};
  const dir=path.join(SIM,"tools","step6"); fs.mkdirSync(dir,{recursive:true});
  ["perf-run.html","perf-route.js"].forEach(f=>fs.copyFileSync(path.join(ROOT,"tools","step6",f),path.join(dir,f)));
  res.md5=require("child_process").execSync("md5sum "+["perf-run.html","perf-route.js"].map(f=>path.join(dir,f)).join(" ")+" "+["perf-run.html","perf-route.js"].map(f=>path.join(ROOT,"tools","step6",f)).join(" ")).toString().trim().split("\n");
  const srv=http.createServer((q,r)=>{ const u=decodeURIComponent(q.url.split("?")[0]); const f=path.join(SIM,u);
    if(!f.startsWith(SIM)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){ r.writeHead(404); r.end("not found"); return; }
    r.writeHead(200,{"content-type":f.endsWith(".html")?"text/html; charset=utf-8":"application/javascript"}); r.end(fs.readFileSync(f)); });
  await new Promise(z=>srv.listen(0,"127.0.0.1",z)); const base="http://127.0.0.1:"+srv.address().port+"/tools/step6/perf-run.html";
  const b=await A.launch();
  try{
    const CASES=[
      {id:"javascript-url",src:"javascript:parent.document.title='RBX '+parent.location.origin;void 0"},
      {id:"data-url",src:"data:text/html,<script>try{parent.document.title='RBD '+parent.location.origin}catch(e){document.title='blocked'}</script>"},
      {id:"control (no src)",src:null}];
    for(const c of CASES){
      const ctx=await b.newContext(); const page=await ctx.newPage(); const log=[];
      page.on("console",m=>{ if(m.type()==="error"||m.type()==="warning") log.push(m.type()+": "+m.text().slice(0,200)); });
      page.on("pageerror",e=>log.push("pageerror: "+String(e.message).slice(0,200)));
      const url=base+(c.src===null?"":"?src="+encodeURIComponent(c.src));
      await page.goto(url,{waitUntil:"load",timeout:60000}); await page.waitForTimeout(4000);
      const r=await page.evaluate(()=>({title:document.title,frameSrc:document.getElementById("app").getAttribute("src"),
        msg:document.getElementById("msg").textContent}));
      res.cases.push({id:c.id,url:url.replace(/^http:\/\/127\.0\.0\.1:\d+/,"http://127.0.0.1:<port>"),title:r.title,frameSrc:r.frameSrc,msg:r.msg,
        scriptRanInPageOrigin:/^RBX http:\/\/127\.0\.0\.1/.test(r.title)||/^RBD http/.test(r.title),log});
      await ctx.close();
    }
    res.browser=b.version();
  }catch(e){ res.error=String(e&&e.stack||e); process.exitCode=1; }
  finally{ await b.close(); srv.close(); res.finished=new Date().toISOString(); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); console.log("done",OUT); }
})();
