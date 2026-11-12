#!/usr/bin/env node
/* The final audits' Stage 6: the negative controls of the self-test's Stage 6 blocks. Each mutation puts one fix back on a copy of the build (each
   replacement must apply exactly once) and runs its block alone on a fresh page (tools/final-stage6/run-block.js); the checks it names must fail
   and every other check of the block pass. "none" is the build as it is: every check passes.
   node tools/final-stage6/mutate-wp10g.js <set> [build.html] [--json out.json]   (sets: wp10g, the crowns and the blocks among the buildings)
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), crypto=require("crypto"), cp=require("child_process");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..","..");
const set=argv[0], html=path.resolve(argv.find((a,i)=>i>0&&a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(ROOT,"austerlitz-command-map.html")), OUT=opt("--json");
const C="the crowns near the eye (WP-10, CL-VIS-08; decision 308)", B="the blocks among the buildings (WP-10, CL-VIS-04; decision 307 (c))";
const SETS={
  wp10g:{block:"wp10gChecks", M:[
    {name:"none", rep:[], fails:[]},
    {name:"the closed faces near the eye again (no twigs)", fails:[C], rep:[['"+glslF(TREE6.W)+"&&fract(tH*7.13)<vTnG*uTwig) discard;','"+glslF(TREE6.W)+"&&fract(tH*7.13)<vTnG*uTwig*0.0) discard;']]},
    {name:"the twigs drawn at every distance", fails:[C], rep:[['"if(vTnG*uTwig>0.001){ vec3 tD','"if(uTwig>0.001){ vec3 tD'],['&&fract(tH*7.13)<vTnG*uTwig) discard;','&&fract(tH*7.13)<uTwig) discard;']]},
    {name:"the sources sheet silent on the blocks among the buildings", fails:[B], rep:[['so where a block stands in a village its "+\n      "figures pass through the buildings','so where a block stands in a village its "+\n      "figures cross the buildings']]}
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
