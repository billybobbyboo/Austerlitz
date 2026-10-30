#!/usr/bin/env node
/* Stage 8, implementation PR 8H (docs/STAGE8_SPEC.md section 20.11): do css-test.js's and geo-test.js's 8H rules fail when what they hold is
   broken? As tools/stage8/mutate-css-8f.js: each mutation replaces one string of a source file (its fifth element: world.js unless named); the
   suite is run on the copy in a temporary tree (every other file the repository's own, linked), and the line that holds the rule is read. The
   unmutated source first: each line passes on it. The rules: css-test.js's "the buildings" (the château's octant, its place and nothing between,
   the town's church's places, the farmsteads' words), "a block at rest" (the pose held with the clock standing, the clock's at a seek, the
   sway no longer drift) and "water, woods and the near ground" (since 8H the crowns closing near the eye); geo-test.js's G-2 checks (one authority for the map-to-world factor and origin).
   node tools/stage8/mutate-css-8h.js [--json out.json]
   Measurement code only: nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), cp=require("child_process");
const ROOT=path.resolve(__dirname,"..",".."), argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; }, OUT=opt("--json");
const LINES={
  bld:["css-test.js",l=>l.startsWith("the buildings (decision 248 (a)): "),l=>/: \d+ wrong$/.test(l)],
  woods:["css-test.js",l=>l.startsWith("water, woods and the near ground (decisions 246 (a), 247 (a)): "),l=>/: \d+ wrong$/.test(l)],
  rest:["css-test.js",l=>l.startsWith("a block at rest (8G's verification; 8H's pause): "),l=>/: \d+ wrong$/.test(l)],
  geo:["geo-test.js",l=>/^geo-test: \d+ passed, \d+ failed/.test(l),l=>!/, 0 failed/.test(l)]
};
/* [id, the rule's line, what it breaks, from, to, the file (world.js unless named)] */
const MUT=[
  ["none","bld","nothing (the source as it is)",null,null],
  ["nonerest","rest","nothing (the source as it is)",null,null],
  ["nonegeo","geo","nothing (the source as it is)",null,null],
  ["tol","bld","the château's tolerance a quarter-turn again (8G's)","chateau:{w:5.6, d:1.5, wing:[1.4,2.6], h:2.0, near:10, bearing:236, tol:22.5}","chateau:{w:5.6, d:1.5, wing:[1.4,2.6], h:2.0, near:10, bearing:236, tol:90}"],
  ["octant","bld","the château's octant typed as a quarter-turn in the planner","if(dev>B.tol+1e-9) continue;","if(dev>90+1e-9) continue;"],
  ["foot","bld","the château's centre not held in the town's place","if(!v8Foot(c[0],c[1])) continue;","if(false) continue;"],
  ["between","bld","a drawn road or stream allowed between the château and its church","if(v8Between(ch.x,ch.z,c[0],c[1],segs)) continue;","if(false) continue;"],
  ["temple","bld","the town's church offered only the village's first places (8G's)","kind===\"temple\"?0:V8CANDS","V8CANDS"],
  ["noparts","bld","a church place taken that leaves its château none","if(!ct.parts.length) continue;","/* (none) */"],
  ["words","bld","the dossier's farmsteads typed \"each an L\" for every village","h+=row(\"Farmsteads\",esc(farmsteadsText(P)+","h+=row(\"Farmsteads\",esc(P.farms.length+\" drawn, each an L along its street\"+","app.js"],
  ["restease","rest","a block's shape eased with the clock standing","  if(sk){ u.sw=sh[0]; u.sd=sh[1]; }\n  else if(adv){","  if(sk){ u.sw=sh[0]; u.sd=sh[1]; }\n  else {","app.js"],
  ["noseek","rest","a seek not taking the clock's heading at once","  if(sk){ rec.yaw=rec.yaw===undefined?want0:want0+Math.PI*2*Math.round((rec.yaw-want0)/(Math.PI*2)); return; }","  if(sk&&rec.yaw===undefined){ rec.yaw=want0; return; }","app.js"],
  ["noadv","rest","the heading eased on with the clock standing","  if(!adv) return;\n  if(LOOSE[st])","  if(LOOSE[st])","app.js"],
  ["drift","rest","a broken body's sway counted as drift again","    /* a broken formation's sway is no longer drift: since 8H it is part of the block's pose, which the clock standing holds (poseBlock) */","    if(r.block&&r.block.visible&&LOOSE[liveStatus(id,curPhase)]) return true;","app.js"],
  ["nonewoods","woods","nothing (the source as it is)",null,null],
  ["nearvals","woods","the crowns closing nearer or farther than TREE8H's (far 16 to 30)","var TREE8H={near:5, far:16, U:{uTreeNear:{value:1}}};","var TREE8H={near:5, far:30, U:{uTreeNear:{value:1}}};"],
  ["nearcall","woods","the bush drawn without the near hook","  treeNear(scrubMesh.material,1/TREE8F.scrubShrink);   /* 8H: the crowns closing near the eye */","  /* (none) */"],
  ["neargeo","woods","a habit made without its faces' centres","var a=P.length; h.cr.forEach(function(C){ treeShell(P,C[0],C[1],C[2],TREE8F.keep,TREE8F.shrink); }); return treeNearGeo(treeGeo(P),P,a); }),","var a=P.length; h.cr.forEach(function(C){ treeShell(P,C[0],C[1],C[2],TREE8F.keep,TREE8F.shrink); }); return treeGeo(P); }),"],
  ["nearatmo","woods","the near hook not chaining the atmosphere's uniforms","    if(typeof atmoUniforms===\"function\") atmoUniforms(sh);   /* the atmosphere's uniforms (app.js), as every material gets them */\n    sh.uniforms.uTreeNear=TREE8H.U.uTreeNear;","    sh.uniforms.uTreeNear=TREE8H.U.uTreeNear;"],
  ["wtyped","geo","W's factor and origin typed again (0.5, 340, 250)","function W(mx,my){ var o=GEOREF.WORLD_ORIGIN, k=GEOREF.MAP_PER_WORLD; return [(mx-o[0])/k, (my-o[1])/k]; }","function W(mx,my){ return [(mx-340)*0.5, (my-250)*0.5]; }"],
  ["themelen","geo","a theme's length by a typed factor again","row(\"Length\",\"about \"+(len*KM_PER_MAP).toFixed(1)","row(\"Length\",\"about \"+(len*0.5/UNITS_PER_KM).toFixed(1)","app.js"]
];
const MF=["app.js","world.js","geo.js"], SRC={}, dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-css-8h-")), res={mutations:[]};
MF.forEach(f=>{ SRC[f]=fs.readFileSync(path.join(ROOT,f),"utf8"); });
fs.readdirSync(ROOT).forEach(f=>{ if(!MF.includes(f)&&f!==".git") fs.symlinkSync(path.join(ROOT,f),path.join(dir,f)); });
let wrong=0;
for(const [id,ln,what,a,b,file] of MUT){
  const F=file||"world.js", [suite,pick,failed]=LINES[ln];
  MF.forEach(f=>{ let s=SRC[f]; if(a&&f===F){ if(s.split(a).length!==2) throw new Error(id+": the string to replace is not found exactly once in "+F+": "+a.slice(0,80)); s=s.replace(a,()=>b); } fs.writeFileSync(path.join(dir,f),s); });
  const r=cp.spawnSync("node",[suite],{cwd:dir,encoding:"utf8",maxBuffer:64<<20}), out=(r.stdout||"")+(r.stderr||"");
  const line=out.split("\n").find(pick)||"", found=out.split("\n").filter(l=>/^  ! |FAIL|✗/.test(l)).map(l=>l.trim()).slice(0,4);
  const fails=!line||failed(line), none=/^none/.test(id), ok=none?!fails&&line.length>0:fails;
  if(!ok) wrong++;
  res.mutations.push({id, rule:ln, suite, what, lineFails:fails, ok, line:line.slice(0,200), findings:found, exit:r.status});
  console.log((ok?"ok    ":"WRONG ")+id.padEnd(10)+suite.padEnd(12)+(none?"the rule passes":fails?"the rule fails: "+(found[0]||line).slice(0,160):"the rule passes (it should fail)"));
}
fs.rmSync(dir,{recursive:true,force:true});
console.log(wrong?wrong+" WRONG":"every mutation as it should be");
if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
if(wrong) process.exitCode=1;
