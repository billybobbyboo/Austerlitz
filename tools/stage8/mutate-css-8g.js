#!/usr/bin/env node
/* Stage 8, implementation PR 8G (docs/STAGE8_SPEC.md section 19): does css-test.js hold what 8G's commits fix and add? Each mutation replaces one
   string of a source file (its fifth element: app.js unless named), css-test.js is run on the copy in a temporary tree (every other file the
   repository's own, linked), and the line of the block it names (its sixth element) and its findings are read. The unmutated source first:
   every block named passes on it.
   node tools/stage8/mutate-css-8g.js [--json out.json] [--only id,id]
   Measurement code only: nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), cp=require("child_process");
const ROOT=path.resolve(__dirname,"..",".."), argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; }, OUT=opt("--json"), ONLY=opt("--only")?opt("--only").split(","):null;
const REST="a block at rest (8G's verification)";
/* [id, what it breaks, from, to, the file (app.js unless named), the block's line] */
const MUT=[
  ["none","nothing (the source as it is)",null,null,null,null],
  ["shape","the block's shape easing on below its threshold (8F's)","if(Math.abs(sh[0]-u.sw)>0.002||Math.abs(sh[1]-u.sd)>0.002){ settling=true; u.sw += (sh[0]-u.sw)*rate; u.sd += (sh[1]-u.sd)*rate; }\n  else { u.sw=sh[0]; u.sd=sh[1]; }",
    "if(Math.abs(sh[0]-u.sw)>0.002||Math.abs(sh[1]-u.sd)>0.002) settling=true;\n  u.sw += (sh[0]-u.sw)*rate;\n  u.sd += (sh[1]-u.sd)*rate;",null,REST],
  ["tilt","the block's tilt easing on below its threshold (8F's)","if(Math.abs(lowered-(u.tilt||0))>0.002){ settling=true; u.tilt = (u.tilt||0) + (lowered-(u.tilt||0))*ease(0.05); }\n  else u.tilt=lowered;",
    "if(Math.abs(lowered-(u.tilt||0))>0.002) settling=true;\n  u.tilt = (u.tilt||0) + (lowered-(u.tilt||0))*ease(0.05);",null,REST],
  ["yaw","the block's heading easing on below its threshold (8F's)","  if(!LOOSE[st]&&Math.abs(d0)<=0.002) rec.yaw=want0+Math.PI*2*Math.round((rec.yaw-want0)/(Math.PI*2));\n  else if(Math.abs(diff)<1e-6) rec.yaw=want+Math.PI*2*Math.round((rec.yaw-want)/(Math.PI*2));\n  else rec.yaw += diff*ease(WHEEL[f.arm]||0.05);",
    "  rec.yaw += diff*ease(WHEEL[f.arm]||0.05);",null,REST],
  ["swayexact","a loose body's sway eased on below 1e-6","  else if(Math.abs(diff)<1e-6) rec.yaw=want+Math.PI*2*Math.round((rec.yaw-want)/(Math.PI*2));\n","",null,REST],
  ["eased","another value eased in poseBlock","  var lowered = (st===","  u.sw2=(u.sw2||0); u.sw2 += 0.001;\n  var lowered = (st===",null,REST]
];
const MF=["app.js","world.js"], SRC={}, dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-css-8g-")), res={mutations:[]};
MF.forEach(f=>{ SRC[f]=fs.readFileSync(path.join(ROOT,f),"utf8"); });
fs.readdirSync(ROOT).forEach(f=>{ if(!MF.includes(f)&&f!==".git") fs.symlinkSync(path.join(ROOT,f),path.join(dir,f)); });
const BLOCKS=[...new Set(MUT.map(m=>m[5]).filter(Boolean))];
let wrong=0;
for(const [id,what,a,b,file,block] of MUT){ if(ONLY&&id!=="none"&&!ONLY.includes(id)) continue;
  const F=file||"app.js";
  MF.forEach(f=>{ let s=SRC[f]; if(a&&f===F){ if(s.split(a).length!==2) throw new Error(id+": the string to replace is not found exactly once in "+F); s=s.replace(a,()=>b); } fs.writeFileSync(path.join(dir,f),s); });
  const r=cp.spawnSync("node",["css-test.js"],{cwd:dir,encoding:"utf8",maxBuffer:64<<20}), out=r.stdout||"", lines=out.split("\n");
  const found=lines.filter(l=>/^  ! /.test(l)).map(l=>l.slice(4));
  const lineOf=bk=>lines.find(l=>l.startsWith(bk+": "))||"", fails=bk=>/: \d+ wrong$/.test(lineOf(bk));
  let ok;
  if(id==="none") ok=BLOCKS.every(bk=>lineOf(bk)&&!fails(bk))&&r.status===0;
  else ok=fails(block);
  if(!ok) wrong++;
  res.mutations.push({id, what, block, blockFails:block?fails(block):null, ok, findings:found.slice(0,6), exit:r.status});
  console.log((ok?"ok    ":"WRONG ")+id.padEnd(13)+(id==="none"?"every block named passes":ok?"its block fails: "+found.slice(0,2).join(" | "):"its block passes (it should fail)"));
}
fs.rmSync(dir,{recursive:true,force:true});
console.log(wrong?wrong+" WRONG":"every mutation as it should be");
if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
if(wrong) process.exitCode=1;
