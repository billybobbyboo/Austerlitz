#!/usr/bin/env node
/* Verification v-batch-tests: re-run selected negative controls of tools/audit-post8/tests/mutations-list.js on an ISOLATED copy,
   with a chosen, cheap subset of suites (the area's own record ran more). usage:
     node rerun.js <iso> <out.json> M25:audit,sim,chron M31:test ...
   Each edit's find must occur exactly once; files restored byte for byte (sha256 checked); where a build ran, the build is made again
   and its md5 checked against the audited f10fe585... Suites judged as tools/run-all.sh judges them (exit code or its FAILS pattern). */
const cp=require("child_process"), fs=require("fs"), path=require("path"), crypto=require("crypto");
const [ISO,OUT,...SPECS]=process.argv.slice(2);
const iso=path.resolve(ISO);
if(iso==="/home/user/Austerlitz"||fs.existsSync(path.join(iso,".git"))){ console.error("refused: not an isolated copy"); process.exit(2); }
const LIST=require("/home/user/Austerlitz/tools/audit-post8/tests/mutations-list.js");
const FAILS=/^(CSS ERRORS|ERRORS|errors|findings): *[1-9]|VIOLATIONS \([1-9]|, [1-9][0-9]* failed$|: [1-9][0-9]* disagreements|^  (!|E|FAIL|✗) |BROKEN|  FLOATS$|: DISAGREE$|<-- outside|^console\.warn unique: *[1-9]/m;
const SUITES={ test:"node test.js", redteam:"node redteam.js", sim:"node sim-test.js", audit:"node audit.js", binding:"node binding-test.js",
  geo:"node geo-test.js", css:"node css-test.js", chron:"node tools/stage2/chronology.js --check",
  data:"python3 build.py >/dev/null && node tools/visual/data-invariance.js archive/stage8k-f10fe585.html austerlitz-command-map.html" };
const EXIT_ONLY=new Set(["chron","data"]);
const sha=b=>crypto.createHash("sha256").update(b).digest("hex");
const md5f=f=>crypto.createHash("md5").update(fs.readFileSync(f)).digest("hex");
function sh(cmd){ const t0=Date.now(); const r=cp.spawnSync("sh",["-c","nice -n 10 "+cmd],{cwd:iso,encoding:"utf8",timeout:600000,maxBuffer:1<<28,
  env:Object.assign({},process.env,{TMPDIR:path.join(iso,".tmp")})}); return {code:r.status===null?"timeout":r.status,out:(r.stdout||"")+(r.stderr||""),s:(Date.now()-t0)/1000}; }
fs.mkdirSync(path.join(iso,".tmp"),{recursive:true});
const out=[];
for(const spec of SPECS){
  const [id,sl]=spec.split(":"); const m=LIST.find(x=>x.id===id); const rec={id,title:m.title,suites:{}};
  const orig={};
  for(const e of m.edits){ const f=path.join(iso,e.file); if(!(e.file in orig)) orig[e.file]=fs.readFileSync(f);
    const cur=fs.readFileSync(f,"utf8"), n=cur.split(e.find).length-1; if(n!==1) throw new Error(id+": find occurs "+n+" times in "+e.file);
    fs.writeFileSync(f,cur.replace(e.find,()=>e.replace)); }
  let built=false;
  for(const s of sl.split(",")){ const r=sh(SUITES[s]); if(s==="data") built=true;
    const fail=r.code!==0||(!EXIT_ONLY.has(s)&&FAILS.test(r.out));
    rec.suites[s]={exit:r.code,verdict:fail?"FAILED":"passed",seconds:r.s,
      lines:r.out.split("\n").filter(l=>FAILS.test(l)||/^\s*(!|✗|E |FAIL)/.test(l)||/DATA CHANGED|CHANGED |Rendering and interface|All \d+ DATA|VIOLATIONS|disagree/i.test(l)).slice(0,10).map(l=>l.slice(0,300))}; }
  for(const [f,b] of Object.entries(orig)){ fs.writeFileSync(path.join(iso,f),b); if(sha(fs.readFileSync(path.join(iso,f)))!==sha(b)) throw new Error("restore failed "+f); }
  if(built){ sh("python3 build.py >/dev/null"); rec.buildMd5After=md5f(path.join(iso,"austerlitz-command-map.html")); }
  rec.restored=true; out.push(rec); console.log(JSON.stringify(rec));
}
fs.writeFileSync(OUT,JSON.stringify(out,null,1)+"\n");
