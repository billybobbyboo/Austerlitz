#!/usr/bin/env node
/* The final audits' Stage 6: the negative controls of the self-test's Stage 6 blocks. Each mutation puts one fix back on a copy of the build (each
   replacement must apply exactly once) and runs its block alone on a fresh page (tools/final-stage6/run-block.js); the checks it names must fail
   and every other check of the block pass. "none" is the build as it is: every check passes.
   node tools/final-stage6/mutate-wp10p.js <set> [build.html] [--json out.json]   (sets: wp10p, the facings, the camp, the streams and the tier)
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), crypto=require("crypto"), cp=require("child_process");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..","..");
const set=argv[0], html=path.resolve(argv.find((a,i)=>i>0&&a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(ROOT,"austerlitz-command-map.html")), OUT=opt("--json");
const F="the facings (WP-10, CL-VIS-03)", C="the headquarters' camp (WP-10, CL-VIS-07)", G="the streams' glint (WP-10, CL-VIS-05)", R="the tier on a resize (WP-10, CL-VIS-09)";
const SETS={
  wp10p:{block:"wp10pChecks", M:[
    {name:"none", rep:[], fails:[]},
    {name:"a drifting block faces along its drift again", fails:[F], rep:[["  if(want!==null&&mr&&mr.kmh<GAIT.KMH){ var ef=enemyFacing(id); if(ef!==null) want=ef; }\n",""]]},
    {name:"a halted block's facing taken once in its phase again", fails:[F], rep:[["var FACE={STEP:10, TURN:Math.PI/4};","var FACE={STEP:1e9, TURN:Math.PI/4};"]]},
    {name:"the camp pitched at every status again", fails:[C], rep:[["  if(u.camp){ var cv=!moving; if(u.camp[0].visible!==cv){ u.camp[0].visible=cv; u.camp[1].visible=cv; } }",""]]},
    {name:"the streams at 0.30 again", fails:[G], rep:[["var STREAM={rough:0.60,","var STREAM={rough:0.30,"]]},
    {name:"the tier decided once again (no retier on a resize)", fails:[R], rep:[["    retier();   /* the final audits' Stage 6 (CL-VIS-09)","    /* retier(); */   /* the final audits' Stage 6 (CL-VIS-09)"]]}
  ]}
};
const S=SETS[set]; if(!S){ console.error("unknown set "+set+"; one of "+Object.keys(SETS).join(", ")); process.exit(2); }
const src=fs.readFileSync(html,"utf8"), dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-s6-")), res={set, build:path.basename(html), md5:crypto.createHash("md5").update(src).digest("hex"), mutations:[]};
let allOk=true;
for(const m of S.M){
  let s=src, applied=true;
  for(const [a,b] of m.rep){ const n=s.split(a).length-1; if(n!==1){ applied=false; console.log("NOT APPLIED ("+n+"x): "+m.name+": "+a.slice(0,80)); break; } s=s.replace(a,()=>b); }
  const f=path.join(dir,"m.html"); fs.writeFileSync(f,s);
  const jf=path.join(dir,"r.json"); try{ fs.unlinkSync(jf); }catch(e){}
  try{ cp.execFileSync("node",[path.join(__dirname,"run-block.js"),S.block,f,"--json",jf],{stdio:"ignore",timeout:1200000}); }catch(e){}
  let checks=[]; try{ checks=JSON.parse(fs.readFileSync(jf,"utf8")).checks; }catch(e){}
  const failed=checks.filter(c=>!c.ok).map(c=>c.name.split(":")[0]);
  const ok=applied&&checks.length>0&&m.fails.every(x=>failed.indexOf(x)>=0)&&failed.every(x=>m.fails.indexOf(x)>=0);
  if(!ok) allOk=false;
  res.mutations.push({name:m.name, applied, expected:m.fails, failed, ok, detail:checks.filter(c=>!c.ok).map(c=>String(c.detail).slice(0,300))});
  console.log((ok?"as expected ":"UNEXPECTED  ")+m.name+": failed ["+failed.join("; ")+"]");
}
res.allAsExpected=allOk;
if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
console.log(set+":",res.mutations.filter(x=>x.ok).length,"of",res.mutations.length,"as expected");
process.exit(allOk?0:1);
