#!/usr/bin/env node
/* Stage 8, implementation PR 8D (docs/STAGE8_SPEC.md section 16): does css-test.js's 8D block (culling and the hooks as decided) fail when what
   it holds is broken? Each mutation replaces one string of app.js; css-test.js is run on the copy in a temporary tree (every other file the
   repository's own, linked), and its 8D line and its findings are read. The unmutated source first: the block passes on it.
   node tools/stage8/mutate-css-8d.js [--json out.json]
   Measurement code only: nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), cp=require("child_process");
const ROOT=path.resolve(__dirname,"..",".."), argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; }, OUT=opt("--json");
/* [id, what it breaks, from, to] */
const MUT=[
  ["none","nothing (the source as it is)",null,null],
  ["nocullblock","a block's meshes left without bounds (no cullBlock in buildFormations)","      cullBlock(g,id);   /* Stage 8, 8D","      /* Stage 8, 8D"],
  ["hides","culling by visible: a mesh with nothing to draw hidden","  if(cl.n<=0){ CULL.frame.culled++; return false; }","  if(cl.n<=0){ CULL.frame.culled++; o.visible=false; return false; }"],
  /* since 8E's prerequisite (cullStale, CULL.geo by the position attribute) the same two mutations on the code as it now reads */
  ["noversion","the bounds not refreshed when the instance matrices change","if(cl.ver!==o.instanceMatrix.version||cl.n!==o.count||cl.g!==o.geometry||cl.av!==ANIM.ver) return true;","if(cl.n!==o.count||cl.g!==o.geometry||cl.av!==ANIM.ver) return true;"],
  ["sharedbounds","a shared geometry's own bounds written","  var Pa=g.attributes.position, s=CULL.geo.get(Pa); if(s&&s.pv===Pa.version) return s;","  var Pa=g.attributes.position, s=CULL.geo.get(Pa); if(s&&s.pv===Pa.version) return s; g.computeBoundingSphere();"],
  ["appoff","the app switching culling off (on a low tier)","function cullFrameStart(){ var F=CULL.frame;","function cullFrameStart(){ if(lowTier) setCull(false); var F=CULL.frame;"],
  ["nodepthhook","the kit's depth material without the hook","d.userData.anim=U; d.onBeforeCompile=animHook;","d.userData.anim=U;"],
  ["gaitset","the app moving the gait (a uniform written outside the self-test)","function cullFrameStart(){ var F=CULL.frame;","function cullFrameStart(){ CULL.meshes.forEach(function(m){ if(m.userData.anim) m.userData.anim.uAnimAmp.value=0.5; }); var F=CULL.frame;"],
  ["lowtier","lowTier's shadow setting changed","sun.castShadow=!lowTier;","sun.castShadow=true;"]
];
const src=fs.readFileSync(path.join(ROOT,"app.js"),"utf8"), dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-css-8d-")), res={mutations:[]};
fs.readdirSync(ROOT).forEach(f=>{ if(f!=="app.js"&&f!==".git") fs.symlinkSync(path.join(ROOT,f),path.join(dir,f)); });
let wrong=0;
for(const [id,what,a,b] of MUT){
  let s=src; if(a){ if(s.split(a).length!==2) throw new Error(id+": the string to replace is not found exactly once"); s=s.replace(a,()=>b); }
  fs.writeFileSync(path.join(dir,"app.js"),s);
  const r=cp.spawnSync("node",["css-test.js"],{cwd:dir,encoding:"utf8",maxBuffer:64<<20}), out=r.stdout||"";
  const line=(out.split("\n").find(l=>l.startsWith("culling and the hooks"))||""), found=out.split("\n").filter(l=>/^  ! /.test(l)).map(l=>l.slice(4));
  const fails=/: \d+ wrong$/.test(line), ok=id==="none"?!fails&&line.length>0:fails;
  if(!ok) wrong++;
  res.mutations.push({id, what, blockFails:fails, ok, findings:found.slice(0,6), exit:r.status});
  console.log((ok?"ok    ":"WRONG ")+id.padEnd(13)+(id==="none"?"the block passes":fails?"the block fails: "+found.slice(0,2).join(" | "):"the block passes (it should fail)"));
}
fs.rmSync(dir,{recursive:true,force:true});
console.log(wrong?wrong+" WRONG":"every mutation as it should be");
if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
if(wrong) process.exitCode=1;
