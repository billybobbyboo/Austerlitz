#!/usr/bin/env node
/* The final audits' Stage 6: the negative controls of the self-test's Stage 6 blocks. Each mutation puts one fix back on a copy of the build (each
   replacement must apply exactly once) and runs its block alone on a fresh page (tools/final-stage6/run-block.js); the checks it names must fail
   and every other check of the block pass. "none" is the build as it is: every check passes.
   node tools/final-stage6/mutate.js <set> [build.html] [--json out.json]   (sets: wp10m, the meres)
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), crypto=require("crypto"), cp=require("child_process");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..","..");
const set=argv[0], html=path.resolve(argv.find((a,i)=>i>0&&a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(ROOT,"austerlitz-command-map.html")), OUT=opt("--json");
const V1="the meres (WP-10, CL-VIS-01)", V2="the meres (WP-10, CL-VIS-02)";
const SETS={
  wp10m:{block:"wp10Checks", M:[
    {name:"none", rep:[], fails:[]},
    {name:"the men and horses seated on the drawn ground under the ice", fails:[V1], rep:[["_wp.y=iceTop(groundY(_wp.x,_wp.z),_wp.x,_wp.z);","_wp.y=groundY(_wp.x,_wp.z);"]]},
    {name:"the gait's chords read the drawn ground under the ice", fails:[V1], rep:[
      ["out[o]=(iceTop(groundYFast(GH,xa,za),xa,za)-y)/a; out[o+1]=(y-iceTop(groundYFast(GH,xb,zb),xb,zb))/a;","out[o]=(groundYFast(GH,xa,za)-y)/a; out[o+1]=(y-groundYFast(GH,xb,zb))/a;"],
      ["out[o]=(iceTop(groundYFast(GH,xf,zf),xf,zf)-y)/f; out[o+1]=(y-iceTop(groundYFast(GH,xh,zh),xh,zh))/h;","out[o]=(groundYFast(GH,xf,zf)-y)/f; out[o+1]=(y-groundYFast(GH,xh,zh))/h;"]]},
    {name:"the block (its marquee) placed on the drawn ground under the ice", fails:[V1], rep:[["rec.block.position.set(wq[0],iceTop(groundY(wq[0],wq[1]),wq[0],wq[1]),wq[1]);","rec.block.position.set(wq[0],groundY(wq[0],wq[1]),wq[1]);"]]},
    {name:"the trees and bushes on the ice drawn again", fails:[V2], rep:[["function inMereDisc(x,z){\n","function inMereDisc(x,z){ return false;\n"]]}
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
