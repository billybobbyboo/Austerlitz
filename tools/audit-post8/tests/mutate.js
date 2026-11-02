#!/usr/bin/env node
/* Final audit after Stage 8, area "tests": run the negative controls of mutations-list.js against an ISOLATED copy of the repository.
   usage: node tools/audit-post8/tests/mutate.js <isolated-copy> <out.json> [M01,M02,...]
   The copy must not be the working tree (refused if it holds .git or if it is /home/user/Austerlitz). For each mutation: every edit's find
   string must occur exactly once (else the mutation is reported "not applied"); the edited files are written; each suite of its run list is
   run there (nice 19, a 900 s timeout) and judged as tools/run-all.sh judges a suite (a non-zero exit, or a line matching its FAILS pattern);
   check:data and check:chronology by their exit codes. Then every edited file is restored byte for byte (sha256 checked) and, where a build
   ran, the build is made again and its md5 checked against the audited build's. The record keeps each edit as a unified diff, each suite's
   exit code, verdict, wall time and the first lines naming the failure. */
const cp=require("child_process"), fs=require("fs"), path=require("path"), crypto=require("crypto"), os=require("os");
const [ISO,OUT,ONLY]=process.argv.slice(2);
if(!ISO||!OUT){ console.error("usage: mutate.js <isolated-copy> <out.json> [ids]"); process.exit(2); }
const iso=path.resolve(ISO);
if(iso==="/home/user/Austerlitz"||fs.existsSync(path.join(iso,".git"))) { console.error("refused: "+iso+" is a working tree, not an isolated copy"); process.exit(2); }
const LIST=require("./mutations-list.js");
const AUDITED_MD5="f10fe585c46aea576f436ed51ac46f83";
const TIMEOUT_S=+(process.env.MUTATE_TIMEOUT_S||1800);
const FAILS=/^(CSS ERRORS|ERRORS|errors|findings): *[1-9]|VIOLATIONS \([1-9]|, [1-9][0-9]* failed$|: [1-9][0-9]* disagreements|^  (!|E|FAIL|✗) |BROKEN|  FLOATS$|: DISAGREE$|<-- outside|^console\.warn unique: *[1-9]/m;
const SUITES={
  test:{cmd:"node test.js"}, redteam:{cmd:"node redteam.js"}, sim:{cmd:"node sim-test.js"}, audit:{cmd:"node audit.js"},
  binding:{cmd:"node binding-test.js"}, geo:{cmd:"node geo-test.js"}, terrain:{cmd:"node terrain-test.js"}, css:{cmd:"node css-test.js"},
  runtime:{cmd:"python3 build.py >/dev/null && node runtime-test.js", build:true},
  height:{cmd:"node tools/stage2/height-sites.js --check"},
  chron:{cmd:"node tools/stage2/chronology.js --check", exitOnly:true},
  data:{cmd:"python3 build.py >/dev/null && node tools/visual/data-invariance.js archive/stage8k-f10fe585.html austerlitz-command-map.html", build:true, exitOnly:true},
  build:{cmd:"python3 build.py", build:true, exitOnly:true}
};
const sha=b=>crypto.createHash("sha256").update(b).digest("hex");
const md5f=f=>crypto.createHash("md5").update(fs.readFileSync(f)).digest("hex");
function sh(cmd,timeout){
  const t0=Date.now();
  const r=cp.spawnSync("sh",["-c","nice -n 19 "+cmd],{cwd:iso,encoding:"utf8",timeout:(timeout||TIMEOUT_S)*1000,maxBuffer:1<<28,env:Object.assign({},process.env,{TMPDIR:path.join(iso,".tmp")})});
  /* a suite killed by the timeout (or any signal) is inconclusive, never "caught": the machine was loaded, not the mutation detected */
  return {code:r.status===null?(r.signal||"timeout"):r.status, timedOut:r.status===null, out:(r.stdout||"")+(r.stderr||""), ms:Date.now()-t0};
}
fs.mkdirSync(path.join(iso,".tmp"),{recursive:true});
function udiff(file,before,after){
  const d=path.join(os.tmpdir(),"mut-"+process.pid); fs.mkdirSync(d,{recursive:true});
  const a=path.join(d,"a"), b=path.join(d,"b"); fs.writeFileSync(a,before); fs.writeFileSync(b,after);
  const r=cp.spawnSync("diff",["-u","--label","a/"+file,"--label","b/"+file,a,b],{encoding:"utf8",maxBuffer:1<<28});
  /* long lines: keep each changed line to 600 characters around its first difference */
  return (r.stdout||"").split("\n").map(l=>l.length>700?l.slice(0,700)+" …["+(l.length-700)+" more characters]":l).join("\n");
}
function failLines(out){
  return out.split("\n").filter(l=>FAILS.test(l)||/^\s*(!|✗|E |FAIL)/.test(l)||/Error:|error:|not acknowledged|DATA CHANGED|CHANGED |exceeds|over its/.test(l))
    .slice(0,8).map(l=>l.length>400?l.slice(0,400)+" …":l);
}
const results=[]; const want=ONLY?new Set(ONLY.split(",")):null;
const t00=Date.now();
for(const m of LIST){
  if(want&&!want.has(m.id)) continue;
  const rec={id:m.id,title:m.title,claim:m.claim,expect:m.expect,edits:[],suites:{},applied:true};
  const orig={};
  /* apply: every edit's find exactly once, the edits of one file in order */
  for(const e of m.edits){
    const f=path.join(iso,e.file); if(!(e.file in orig)) orig[e.file]=fs.readFileSync(f);
    const cur=fs.readFileSync(f,"utf8"), n=cur.split(e.find).length-1;
    if(n!==1){ rec.applied=false; rec.notApplied=e.file+": the find string occurs "+n+" times"; break; }
    fs.writeFileSync(f,cur.replace(e.find,()=>e.replace));
  }
  Object.keys(orig).forEach(file=>rec.edits.push({file,diff:udiff(file,orig[file].toString("utf8"),fs.readFileSync(path.join(iso,file),"utf8"))}));
  let built=false;
  if(rec.applied){
    for(const s of m.run){
      const S=SUITES[s]; if(!S){ rec.suites[s]={error:"no such suite"}; continue; }
      const r=sh(S.cmd); if(S.build) built=true;
      const failed=!r.timedOut&&(r.code!==0||(!S.exitOnly&&FAILS.test(r.out)));
      rec.suites[s]={exit:r.code, verdict:r.timedOut?"inconclusive (killed: "+r.code+")":failed?"FAILED (caught)":"passed (missed)", seconds:+(r.ms/1000).toFixed(1), lines:failed?failLines(r.out):[]};
      process.stdout.write(m.id+" "+s.padEnd(8)+" "+rec.suites[s].verdict+" ("+rec.suites[s].seconds+" s)\n");
    }
  }
  /* restore, byte for byte */
  Object.keys(orig).forEach(file=>fs.writeFileSync(path.join(iso,file),orig[file]));
  rec.restored=Object.keys(orig).every(file=>sha(fs.readFileSync(path.join(iso,file)))===sha(orig[file]));
  if(built){ const r=sh("python3 build.py >/dev/null"); rec.rebuilt=r.code===0; rec.buildMd5After=md5f(path.join(iso,"austerlitz-command-map.html")); rec.buildRestored=rec.buildMd5After===AUDITED_MD5; }
  const caughtBy=Object.entries(rec.suites).filter(([k,v])=>v.verdict&&/caught/.test(v.verdict)).map(([k])=>k);
  rec.inconclusive=Object.entries(rec.suites).filter(([k,v])=>v.verdict&&/inconclusive/.test(v.verdict)).map(([k])=>k);
  const nodeSuites=["test","redteam","sim","audit","binding","geo","terrain","css","runtime","height"];
  rec.caughtBy=caughtBy;
  rec.caughtByNodeSuite=caughtBy.filter(k=>nodeSuites.includes(k));
  rec.outcome=!rec.applied?"not applied":caughtBy.length?"caught":"missed";
  rec.outcomeExcludingCheckData=!rec.applied?"not applied":caughtBy.filter(k=>k!=="data").length?"caught":"missed";
  rec.matchesExpectation=rec.applied?(rec.outcomeExcludingCheckData===m.expect||rec.outcome===m.expect):null;
  results.push(rec);
  console.log(m.id+" => "+rec.outcome+" (by "+(caughtBy.join(", ")||"nothing")+"); restored "+rec.restored+(built?"; build restored "+rec.buildRestored:""));
  fs.writeFileSync(OUT,JSON.stringify({generated:new Date().toISOString(),isolatedCopy:iso,auditedBuildMd5:AUDITED_MD5,fails:FAILS.source,results},null,1)+"\n");
}
console.log("done: "+results.length+" mutations in "+Math.round((Date.now()-t00)/1000)+" s");
