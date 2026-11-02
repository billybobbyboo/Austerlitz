/* Final audit after Stage 8, verification "v-premise-rob": robustness #0 (R-1), tools/step6/perf-run.html's ?src= (measurement only).
   node tools/audit-post8/verification/v-premise-rob/src-premise.js -> docs/audit-post8-evidence/verification/v-premise-rob-src.json
   A local imitation of a GitHub Pages user origin, never the live site: one HTTP server on 127.0.0.1 serving
     /Austerlitz/tools/step6/perf-run.html and perf-route.js (byte-identical copies, md5 recorded),
     /Austerlitz/austerlitz-command-map.html and /Austerlitz/austerlitz-8h.html (stubs that only set their title: the build is not needed here),
     /other-site/index.html (a stand-in for another Pages project site of the same account: it writes localStorage "probe").
   A second server on "localhost" (another origin) stands for an attacker's host.
   Part 1, the unmodified page: (a) javascript: reading the sibling site's storage and rewriting the whole page while the address stays the
   tool's; (b) a cross-origin http URL framed full-window under the tool's address (and the route never becoming ready); (c) control.
   Part 2, a patched copy in scratch (the area's remedy: new URL(src, location.href), same origin and http(s), else the default) against the
   documented uses (STAGE8_SPEC.md:4672, :4677, STEP6_SPEC.md:1275) and bypass spellings. Nothing in the repository is changed. */
"use strict";
const fs=require("fs"), path=require("path"), http=require("http"), cp=require("child_process");
const A=require("../../lib.js");
const ROOT=path.resolve(__dirname,"..","..","..",".."), OUT=path.join(ROOT,"docs","audit-post8-evidence","verification","v-premise-rob-src.json");
const SIM=path.join("/tmp/claude-0/-home-user-Austerlitz/cb561984-b1ad-5d5a-82ba-de46bf4c820e/scratchpad","v-premise-rob","pages-sim");
const STUB=t=>"<!doctype html><title>"+t+"</title><p>"+t+"</p>";
function setup(){
  const d=path.join(SIM,"Austerlitz","tools","step6"), dp=path.join(SIM,"Austerlitz","tools","step6p"); fs.mkdirSync(d,{recursive:true}); fs.mkdirSync(dp,{recursive:true});
  fs.mkdirSync(path.join(SIM,"other-site"),{recursive:true});
  ["perf-run.html","perf-route.js"].forEach(f=>{ fs.copyFileSync(path.join(ROOT,"tools","step6",f),path.join(d,f)); fs.copyFileSync(path.join(ROOT,"tools","step6",f),path.join(dp,f)); });
  /* the patch: only the src line's use, the rest byte for byte */
  let h=fs.readFileSync(path.join(dp,"perf-run.html"),"utf8"); const before='  fr.src=src;\n';
  if(h.split(before).length!==2) throw new Error("patch anchor not unique");
  h=h.replace(before,'  (function(){ var D="../../austerlitz-command-map.html", u=null; try{ u=new URL(src,location.href); }catch(e){}\n'+
    '    if(!u||u.origin!==location.origin||!/^https?:$/.test(u.protocol)){ msg.textContent="?src= must name a page on this host; the default build is used."; src=D; u=new URL(D,location.href); }\n'+
    '    fr.src=u.href; })();\n');
  fs.writeFileSync(path.join(dp,"perf-run.html"),h);
  fs.writeFileSync(path.join(SIM,"Austerlitz","austerlitz-command-map.html"),STUB("STUB default build"));
  fs.writeFileSync(path.join(SIM,"Austerlitz","austerlitz-8h.html"),STUB("STUB 8h build"));
  fs.writeFileSync(path.join(SIM,"other-site","index.html"),'<!doctype html><title>other</title><script>localStorage.setItem("probe","SECRET-of-other-site")</script>');
  return cp.execSync("md5sum "+[path.join(d,"perf-run.html"),path.join(d,"perf-route.js"),path.join(ROOT,"tools/step6/perf-run.html"),path.join(ROOT,"tools/step6/perf-route.js"),path.join(dp,"perf-run.html")].join(" ")).toString().trim().split("\n");
}
function serve(root){ return http.createServer((q,r)=>{ const u=decodeURIComponent(q.url.split("?")[0]); const f=path.join(root,u);
  if(!f.startsWith(root)||!fs.existsSync(f)||fs.statSync(f).isDirectory()){ r.writeHead(404); r.end("not found"); return; }
  r.writeHead(200,{"content-type":f.endsWith(".html")?"text/html; charset=utf-8":"application/javascript"}); r.end(fs.readFileSync(f)); }); }
(async()=>{
  const res={what:"R-1 premise checks on a local imitation of a Pages user origin",started:new Date().toISOString(),md5:setup(),part1:[],part2:[]};
  const evil=path.join(SIM,"..","evil"); fs.mkdirSync(evil,{recursive:true}); fs.writeFileSync(path.join(evil,"x.html"),STUB("ATTACKER PAGE"));
  const s1=serve(SIM), s2=serve(evil); await new Promise(z=>s1.listen(0,"127.0.0.1",z)); await new Promise(z=>s2.listen(0,"127.0.0.1",z));
  const O="http://127.0.0.1:"+s1.address().port, E="http://localhost:"+s2.address().port;
  const b=await A.launch();
  async function run(pathq,wait){ const ctx=await b.newContext(); const page=await ctx.newPage(); const log=[];
    page.on("console",m=>{ if(m.type()==="error"||m.type()==="warning") log.push(m.type()+": "+m.text().slice(0,160)); }); page.on("pageerror",e=>log.push("pageerror: "+String(e.message).slice(0,160)));
    await page.goto(O+"/other-site/index.html",{waitUntil:"load"}); /* the sibling site visited first: its storage is in the origin */
    await page.goto(O+pathq,{waitUntil:"load",timeout:60000}); await page.waitForTimeout(wait||3000);
    const r=await page.evaluate(()=>{ const f=document.getElementById("app"); let ft=null, fu=null; try{ ft=f&&f.contentDocument&&f.contentDocument.title; fu=f&&f.contentWindow.location.href; }catch(e){ ft="(cross-origin)"; }
      return {address:location.href, title:document.title, bodyText:(document.body&&document.body.innerText||"").slice(0,120), frameAttr:f&&f.getAttribute("src"), frameTitle:ft, frameURL:fu, msg:(document.getElementById("msg")||{}).textContent||null,
        frameRect:f?(r=>[Math.round(r.width),Math.round(r.height)])(f.getBoundingClientRect()):null, go:(document.getElementById("go")||{}).disabled}; });
    const fr=page.frames().map(x=>x.url()).filter(u=>u!==page.url());
    await ctx.close(); r.address=r.address.split(O).join("<origin>"); r.frames=fr.map(u=>u.split(O).join("<origin>").split(E).join("<evil>")); r.log=log; return r; }
  try{
    const P1="/Austerlitz/tools/step6/perf-run.html", P2="/Austerlitz/tools/step6p/perf-run.html";
    const PAY="javascript:var s=parent.localStorage.getItem('probe');parent.document.documentElement.innerHTML='<title>DEFACED '+s+'</title><body>OWNED</body>';void 0";
    for(const c of [{id:"javascript: reads the sibling site's storage and replaces the page",q:"?src="+encodeURIComponent(PAY)},
      {id:"cross-origin http page framed full-window",q:"?src="+encodeURIComponent(E+"/x.html"),wait:4000},
      {id:"control: no src",q:""}]){ const r=await run(P1+c.q,c.wait); r.id=c.id; res.part1.push(r); }
    const T="javascript:parent.document.title='XSS';void 0";
    for(const c of [
      {id:"documented: ../../austerlitz-8h.html (STAGE8_SPEC.md:4672)",src:"../../austerlitz-8h.html",want:"STUB 8h build"},
      {id:"documented: ../../austerlitz-command-map.html?v=5 (STEP6_SPEC.md:1275)",src:"../../austerlitz-command-map.html?v=5",want:"STUB default build"},
      {id:"absolute same-origin path",src:"/Austerlitz/austerlitz-8h.html",want:"STUB 8h build"},
      {id:"javascript:",src:T},{id:"JAVASCRIPT: upper case",src:T.replace("javascript","JAVASCRIPT")},{id:"leading space and tab inside",src:" java\tscript:parent.document.title='XSS';void 0"},
      {id:"data:",src:"data:text/html,<p>x"},{id:"cross-origin http",src:E+"/x.html"},{id:"protocol-relative cross-origin",src:"//localhost:"+s2.address().port+"/x.html"},
      {id:"blob: of the same origin",src:"blob:"+O+"/00000000-0000-0000-0000-000000000000"}]){
      const r=await run(P2+"?src="+encodeURIComponent(c.src)); r.id=c.id; r.pass=c.want?(r.frameTitle===c.want):(r.title==="Frame-time route"&&r.frameTitle==="STUB default build"); res.part2.push(r); }
    res.browser=b.version();
  }catch(e){ res.error=String(e&&e.stack||e); process.exitCode=1; }
  finally{ await b.close(); s1.close(); s2.close(); res.finished=new Date().toISOString(); fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); console.log("done",OUT); }
})();
