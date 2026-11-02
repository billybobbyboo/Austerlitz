/* Final audit after Stage 8, area "robustness": the tools CI never runs, checked for rot without running them (measurement only).
   node tools/audit-post8/robustness/tools-rot.js  ->  docs/audit-post8-evidence/robustness/tools-rot.json
   For each file of ci-reach.json's notRunList (and the one on-demand tool): a .js file through `node --check` (it parses), and every
   require() or readFileSync()/existsSync() of a literal relative path (a string, or path.join(__dirname, "...")) resolved against the file's
   folder and the repository's root: does it exist? A .py file through `python3 -m py_compile` (into a scratch folder, not __pycache__ here).
   Each file is classed by its folder and its own header: "history" (CLAUDE.md: never run again; docs/SUITE_RECOVERY.md), "stage evidence"
   (a past stage's measurement), "mutation" (a check broken on a copy to show it can fail), "device route", "generator", "audit (2026-10)",
   "other". Nothing is executed beyond parsing. */
"use strict";
const fs=require("fs"), path=require("path"), cp=require("child_process");
const ROOT=path.resolve(__dirname,"..","..",".."), EV=path.join(ROOT,"docs","audit-post8-evidence","robustness");
const reach=JSON.parse(fs.readFileSync(path.join(EV,"ci-reach.json"),"utf8"));
const SCR="/tmp/claude-0/-home-user-Austerlitz/cb561984-b1ad-5d5a-82ba-de46bf4c820e/scratchpad/robustness/pyc";
const HISTORY=new Set(["tools/geo-migrate.js","tools/geo-anchor.js","tools/patch-app.py","tools/patch-history.py","tools/split-from-html.py","tools/stage0/apply-stage0.py","tools/stage0/extract-edits.py","tools/warp.js","tools/warp-proto.js","tools/geo-proto.js","tools/relief-fit.js","tools/stale-compare.js","tools/geo-dump.js","tools/inventory.js","tools/leg-check.js"]);
const recovery=fs.existsSync(path.join(ROOT,"docs","SUITE_RECOVERY.md"))?fs.readFileSync(path.join(ROOT,"docs","SUITE_RECOVERY.md"),"utf8"):"";
function kind(f){
  const b=path.basename(f);
  if(HISTORY.has(f)||recovery.includes(b)&&/^tools\/[^/]+$/.test(f)) return "history";
  if(/mutate/.test(b)) return "mutation";
  if(/^tools\/step6\/perf-|phone-rule|perf-local/.test(f)) return "device route";
  if(/^tools\/fonts\//.test(f)) return "generator";
  if(/^tools\/audit\//.test(f)) return "audit (2026-10)";
  if(/^tools\/(stage\d|step\d)/.test(f)) return "stage evidence";
  return "other";
}
const out={generated:new Date().toISOString(),files:[],summary:{}};
const list=reach.notRunList.concat(reach.onDemandOnlyList||[]);
fs.mkdirSync(SCR,{recursive:true});
for(const f of list){
  const abs=path.join(ROOT,f), r={file:f,kind:kind(f)};
  if(!fs.existsSync(abs)){ r.missing=true; out.files.push(r); continue; }
  if(f.endsWith(".js")){
    try{ cp.execFileSync(process.execPath,["--check",abs],{stdio:"pipe"}); r.parses=true; }catch(e){ r.parses=false; r.parseError=String(e.stderr||e.message).split("\n").slice(0,3).join(" ").slice(0,200); }
    const src=fs.readFileSync(abs,"utf8"), refs=new Set();
    const re=/require\(\s*["'](\.{1,2}\/[^"']+)["']\s*\)|path\.(?:join|resolve)\(\s*__dirname\s*,\s*((?:["'][^"']+["']\s*,?\s*)+)\)/g; let m;
    while((m=re.exec(src))){ if(m[1]) refs.add(path.resolve(path.dirname(abs),m[1]));
      else { const parts=[...m[2].matchAll(/["']([^"']+)["']/g)].map(x=>x[1]); if(parts.length) refs.add(path.resolve(path.dirname(abs),...parts)); } }
    const miss=[]; refs.forEach(p=>{ const cand=[p,p+".js",path.join(p,"index.js")]; if(!cand.some(c=>fs.existsSync(c))) miss.push(path.relative(ROOT,p)); });
    r.refs=refs.size; r.missingRefs=miss;
  } else if(f.endsWith(".py")){
    try{ cp.execFileSync("python3",["-I","-c","import py_compile,sys; py_compile.compile(sys.argv[1],cfile=sys.argv[2],doraise=True)",abs,path.join(SCR,path.basename(f)+"c")],{stdio:"pipe"}); r.parses=true; }
    catch(e){ r.parses=false; r.parseError=String(e.stderr||e.message).split("\n").slice(-3).join(" ").slice(0,200); }
  } else r.other=true;
  out.files.push(r);
}
const by={}; out.files.forEach(r=>{ const k=r.kind, e=by[k]||(by[k]={n:0,parses:0,parseFail:0,withMissingRefs:0,missing:0});
  e.n++; if(r.missing) e.missing++; if(r.parses===true) e.parses++; if(r.parses===false) e.parseFail++; if(r.missingRefs&&r.missingRefs.length) e.withMissingRefs++; });
out.summary=by;
out.missingRefFiles=out.files.filter(r=>r.missingRefs&&r.missingRefs.length).map(r=>({file:r.file,kind:r.kind,missing:r.missingRefs}));
out.parseFailures=out.files.filter(r=>r.parses===false).map(r=>({file:r.file,error:r.parseError}));
fs.writeFileSync(path.join(EV,"tools-rot.json"),JSON.stringify(out,null,1));
console.log(JSON.stringify(out.summary),"missingRef files:",out.missingRefFiles.length,"parse failures:",out.parseFailures.length);
