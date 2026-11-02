/* Final audit after Stage 8, area "robustness": which files under tools/ CI runs (measurement only).
   node tools/audit-post8/robustness/ci-reach.js  ->  docs/audit-post8-evidence/robustness/ci-reach.json
   Entry points: what .github/workflows/checks.yml runs on every push (build.py; npm test = tools/run-all.sh and the scripts and nine suites it runs;
   check:data, check:chronology, check:contrast, check:selftest) and on demand (check:visual). From each, the closure over require() of a
   relative or rooted path, child_process spawns of a literal .js/.py path, and readFileSync of a literal .js path (page scripts read and
   injected, such as tools/visual/measure.js). A literal path is resolved against the reading file's directory, then the repository root.
   What the closure does not reach under tools/ is not run by CI (it may still be a manual measurement tool, by design). */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(__dirname,"..","..","..");
const OUT=path.join(ROOT,"docs","audit-post8-evidence","robustness","ci-reach.json");
const push=["build.py","tools/run-all.sh","tools/mk-world-mod.js","tools/mk-helpers.js","tools/stage2/height-sites.js",
  "css-test.js","test.js","geo-test.js","terrain-test.js","audit.js","sim-test.js","redteam.js","runtime-test.js","binding-test.js",
  "tools/visual/data-invariance.js","tools/stage2/chronology.js","tools/visual/contrast.js","tools/visual/harness.js"];
const onDemand=["tools/visual/harness.js","tools/visual/check-report.js"];
function refsOf(file){
  let s; try{ s=fs.readFileSync(path.join(ROOT,file),"utf8"); }catch(e){ return []; }
  const out=new Set(), dir=path.dirname(file);
  const add=p=>{ if(!p) return; const cands=[path.join(dir,p),p,path.join(dir,p+".js"),p+".js"];
    for(const c of cands){ const n=path.normalize(c); if(fs.existsSync(path.join(ROOT,n))&&fs.statSync(path.join(ROOT,n)).isFile()){ out.add(n); return; } } };
  let m;
  const reReq=/require\(\s*(?:path\.join\(([^)]*)\)|["'`]([^"'`]+)["'`])\s*\)/g;
  while((m=reReq.exec(s))){ if(m[2]){ if(/^\.|\//.test(m[2])) add(m[2]); } else if(m[1]){ const parts=[...m[1].matchAll(/["'`]([^"'`]+)["'`]/g)].map(x=>x[1]); if(parts.length) add(parts.join("/")); } }
  const reLit=/["'`]((?:\.{1,2}\/|tools\/|[\w-]+\/)?[\w./-]+\.(?:js|py|sh|html|json))["'`]/g;
  while((m=reLit.exec(s))){ const p=m[1]; if(/node_modules|^https?:/.test(p)) continue; add(p); }
  /* path.join(ROOT,"tools","visual","measure.js") and similar */
  const reJoin=/path\.(?:join|resolve)\(([^()]*(?:\([^()]*\)[^()]*)*)\)/g;
  while((m=reJoin.exec(s))){ const parts=[...m[1].matchAll(/["'`]([^"'`]+)["'`]/g)].map(x=>x[1]); if(parts.length&&/\.(js|py|sh|json|html)$/.test(parts[parts.length-1])) add(parts.join("/")); }
  /* shell lines: node X.js, python3 X.py */
  const reSh=/(?:node|python3|sh)\s+([\w./-]+\.(?:js|py|sh))/g;
  while((m=reSh.exec(s))) add(m[1]);
  return [...out];
}
function closure(entries){ const seen=new Set(), q=[...entries];
  while(q.length){ const f=path.normalize(q.pop()); if(seen.has(f)) continue; seen.add(f); refsOf(f).forEach(r=>{ if(!seen.has(r)) q.push(r); }); }
  return seen; }
const cPush=closure(push), cAll=closure(push.concat(onDemand));
const tools=[]; (function walk(d){ fs.readdirSync(path.join(ROOT,d),{withFileTypes:true}).forEach(e=>{ const p=path.join(d,e.name);
  if(e.isDirectory()){ if(!/audit-post8/.test(p)) walk(p); } else if(/\.(js|py|sh|html|mjs)$/.test(e.name)) tools.push(p); }); })("tools");
const byDir=(list)=>list.reduce((o,f)=>{ const k=f.split("/").slice(0,2).join("/"); o[k]=(o[k]||0)+1; return o; },{});
const notRun=tools.filter(f=>!cAll.has(f)), onDemandOnly=tools.filter(f=>cAll.has(f)&&!cPush.has(f)), everyPush=tools.filter(f=>cPush.has(f));
const res={generated:new Date().toISOString(), toolsFiles:tools.length, everyPush:everyPush.length, onDemandOnly:onDemandOnly.length, notRunByCI:notRun.length,
  notRunByDir:byDir(notRun), everyPushList:everyPush.sort(), onDemandOnlyList:onDemandOnly.sort(), notRunList:notRun.sort()};
fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1));
console.log(JSON.stringify({toolsFiles:res.toolsFiles,everyPush:res.everyPush,onDemandOnly:res.onDemandOnly,notRunByCI:res.notRunByCI,notRunByDir:res.notRunByDir,everyPushList:res.everyPushList,onDemandOnlyList:res.onDemandOnlyList},null,1));
