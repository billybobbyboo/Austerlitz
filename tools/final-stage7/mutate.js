#!/usr/bin/env node
/* The final audits' Stage 7 (WP-11's rule alongside WP-14 and WP-16): the negative controls. Each mutation puts one fix back and runs the check
   that holds it alone; the check must fail, and on the build as it is ("none") pass. Two kinds:
   - "build": the replacements on a copy of austerlitz-command-map.html, then the named boot cases of tools/visual/boot-check.js on it;
   - "src": the replacements on a copy of the source tree (git ls-files, without docs/ and archive/; node_modules linked), built there
     (python3 build.py), then the named suite run there (its exit status; a failing suite must print the expected words).
   Each replacement must apply exactly once.
   - "block": the replacements on a copy of the build, then one of the self-test's blocks alone on a fresh page (tools/final-stage6/run-block.js);
     the checks named must fail and every other check of the block pass.
   node tools/final-stage7/mutate.js <set> [--json out.json] [--only name,name]   (sets: wp14, wp16, wp16b)
   Measurement only; nothing is written to a source file of this tree. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), crypto=require("crypto"), cp=require("child_process");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..",".."), OUT=opt("--json"), ONLY=opt("--only")?opt("--only").split(","):null;
const SETS={
  wp14:[
    {name:"none (the build as it is)", kind:"build", cases:["context-play","context-heap","context-loss"], rep:[], fails:[]},
    {name:"CL-ROB-02 put back: the frame asks only GL.lost, set by the loss's event", kind:"build", cases:["context-play"], fails:["context-play"],
      rep:[["if(glLostNow()){ DEV.skipped++; return; }","if(GL.lost){ DEV.skipped++; return; }"]]},
    {name:"CL-ROB-04 put back: the lost context's dispose listeners kept at a restore", kind:"build", cases:["context-heap","context-loss"], fails:["context-heap","context-loss"],
      rep:[["  glPruneDispose();   /* the final audits' Stage 7, WP-14 (CL-ROB-04)","  /* glPruneDispose(); */   /* the final audits' Stage 7, WP-14 (CL-ROB-04)"]]},
    {name:"CL-ROB-11 put back: esc() leaves both quotes", kind:"src", suite:"runtime-test.js", expect:"esc() leaves",
      rep:[["app.js",'.replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/\'/g,"&#39;"); }','.replace(/>/g,"&gt;"); }']]},
    {name:"CL-ROB-11 put back in part: esc() leaves the single quote", kind:"src", suite:"runtime-test.js", expect:"esc() leaves",
      rep:[["app.js",'.replace(/"/g,"&quot;").replace(/\'/g,"&#39;"); }','.replace(/"/g,"&quot;"); }']]},
    {name:"CL-ROB-10 put back: gaitDist named in the gait's comment again", kind:"src", suite:"tools/final-stage7/dead-code.js", expect:"names a function",
      rep:[["app.js","at the clock (gaitDistOf: every leg","at the clock (gaitDist: every leg"]]},
    {name:"CL-ROB-10 put back: v8Near defined again and called by nothing", kind:"src", suite:"tools/final-stage7/dead-code.js", expect:"never called",
      rep:[["world.js","function v8NearAll(cc,mk,why,ctx,maxR,cap){","function v8Near(cc,mk,why,ctx,maxR){ var all=v8NearAll(cc,mk,why,ctx,maxR,1); return all.length?all[0]:null; }\nfunction v8NearAll(cc,mk,why,ctx,maxR,cap){"]]}
  ]
};
const P14="the label pass keeps the lights (WP-16, CL-PERF-14)", P13="the free rectangle kept by its inputs (WP-16, CL-PERF-13)";
SETS.wp16=[
  {name:"none (the build as it is)", kind:"block", block:"wp16Checks", rep:[], fails:[]},
  {name:"CL-PERF-14 put back: the lights not on the label layer", kind:"block", block:"wp16Checks", fails:[P14],
    rep:[["  if(!FX.lightsLabel){ FX.lightsLabel=true; scene.traverse(function(o){ if(o.isLight) o.layers.enable(LAYER_LABEL); }); }\n",""]]},
  {name:"CL-PERF-14 in part: the shadow map not held for the label pass", kind:"block", block:"wp16Checks", fails:[P14],
    rep:[["  renderer.shadowMap.autoUpdate=false;\n  renderer.render(scene,camera);","  renderer.render(scene,camera);"]]},
  {name:"CL-PERF-13 put back: the search run on every call", kind:"block", block:"wp16Checks", fails:[P13],
    rep:[["    if(got) return got.slice();\n","    if(false&&got) return got.slice();\n"]]},
  {name:"CL-PERF-13 in part: the kept rectangle handed out itself", kind:"block", block:"wp16Checks", fails:[P13],
    rep:[["    if(got) return got.slice();\n","    if(got) return got;\n"]]}
];
const P12="each figure's beat in its slopes' attribute (WP-16, CL-PERF-12)";
SETS.wp16b=[
  {name:"none (the build as it is)", kind:"block", block:"wp16Checks", rep:[], fails:[]},
  {name:"CL-PERF-12: the phases not copied into aSl", kind:"block", block:"wp16Checks", fails:[P12],
    rep:[["    if(P) for(var i=0;i<n&&i<P.length;i++) S.array[i*3+2]=P[i];","    if(false) for(var i=0;i<n&&i<P.length;i++) S.array[i*3+2]=P[i];"]]},
  {name:"CL-PERF-12: the phases into a slope's place", kind:"block", block:"wp16Checks", fails:[P12],
    rep:[["    if(P) for(var i=0;i<n&&i<P.length;i++) S.array[i*3+2]=P[i];","    if(P) for(var i=0;i<n&&i<P.length;i++) S.array[i*3+1]=P[i];"]]},
  {name:"CL-PERF-12: the layout's slopes copied two a figure over the phases", kind:"block", block:"wp16Checks", fails:[P12],
    rep:[["Sn=Math.min(c.Sl.length>>1,SAa.length/3); for(var q2=0;q2<Sn;q2++){ SAa[q2*3]=c.Sl[q2*2]; SAa[q2*3+1]=c.Sl[q2*2+1]; }","Sn=Math.min(c.Sl.length,SAa.length); for(var q2=0;q2<Sn;q2++){ SAa[q2]=c.Sl[q2]; }"]]},
  {name:"CL-PERF-12: the phase's own attribute declared again", kind:"src", suite:"css-test.js", expect:"not one attribute a figure",
    rep:[["app.js",'ANIM.decl=["attribute float aPart;","attribute vec3 aSl;",','ANIM.decl=["attribute float aPart;","attribute float aPh;","attribute vec3 aSl;",']]}
];
const S=SETS[argv[0]]; if(!S){ console.error("unknown set "+argv[0]+"; one of "+Object.keys(SETS).join(", ")); process.exit(2); }
const dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-s7-")), html=path.join(ROOT,"austerlitz-command-map.html"), src=fs.readFileSync(html,"utf8");
const res={set:argv[0], build:crypto.createHash("md5").update(src).digest("hex"), bytes:Buffer.byteLength(src), mutations:[]};
let allOk=true;
function srcTree(){ const t=path.join(dir,"tree-"+Date.now()); fs.mkdirSync(t,{recursive:true});
  cp.execSync("git ls-files -z | grep -zv '^docs/\\|^archive/' | xargs -0 cp --parents -t "+JSON.stringify(t),{cwd:ROOT,shell:"/bin/bash",stdio:"ignore",env:Object.assign({},process.env)});
  fs.symlinkSync(path.join(ROOT,"node_modules"),path.join(t,"node_modules")); return t; }
for(const m of S){
  if(ONLY&&!ONLY.some(o=>m.name.indexOf(o)>=0)) continue;
  let applied=true, failed=[], out="";
  if(m.kind==="block"){
    let s=src; for(const [a,b] of m.rep){ const n=s.split(a).length-1; if(n!==1){ applied=false; console.log("NOT APPLIED ("+n+"x): "+m.name); break; } s=s.replace(a,()=>b); }
    const f=path.join(dir,"m.html"), jf=path.join(dir,"r.json"); fs.writeFileSync(f,s); try{ fs.unlinkSync(jf); }catch(e){}
    try{ cp.execFileSync("node",[path.join(ROOT,"tools","final-stage6","run-block.js"),m.block,f,"--json",jf],{stdio:"ignore",timeout:1800000}); }catch(e){}
    let checks=[]; try{ checks=JSON.parse(fs.readFileSync(jf,"utf8")).checks; }catch(e){}
    failed=checks.filter(c=>!c.ok).map(c=>c.name); out=checks.map(c=>(c.ok?"ok ":"FAIL ")+c.name+": "+String(c.detail).slice(0,300)).join("\n");
    if(!checks.length){ failed=["(no checks read)"]; }
  } else if(m.kind==="build"){
    let s=src; for(const [a,b] of m.rep){ const n=s.split(a).length-1; if(n!==1){ applied=false; console.log("NOT APPLIED ("+n+"x): "+m.name); break; } s=s.replace(a,()=>b); }
    const f=path.join(dir,"m.html"); fs.writeFileSync(f,s);
    try{ out=cp.execFileSync("node",[path.join(ROOT,"tools","visual","boot-check.js"),f,m.cases.join(",")],{encoding:"utf8",timeout:3600000}); }catch(e){ out=String(e.stdout||"")+String(e.stderr||""); }
    m.cases.forEach(c=>{ if(new RegExp("^\\s*FAIL "+c+":","m").test(out)||!new RegExp("^\\s*ok "+c+":","m").test(out)) failed.push(c); });
  } else {
    const t=srcTree();
    for(const [file,a,b] of m.rep){ const p=path.join(t,file), s=fs.readFileSync(p,"utf8"), n=s.split(a).length-1; if(n!==1){ applied=false; console.log("NOT APPLIED ("+n+"x): "+m.name); break; } fs.writeFileSync(p,s.replace(a,()=>b)); }
    let code=0; try{ cp.execFileSync("python3",["build.py"],{cwd:t,stdio:"ignore"}); out=cp.execFileSync("node",[m.suite],{cwd:t,encoding:"utf8",timeout:1800000,maxBuffer:1<<28}); }
    catch(e){ code=e.status||1; out=String(e.stdout||"")+String(e.stderr||""); }
    if(code!==0&&out.indexOf(m.expect)>=0) failed.push(m.suite);
    m.fails=[m.suite];
    fs.rmSync(t,{recursive:true,force:true});
  }
  const ok=applied&&m.fails.every(x=>failed.indexOf(x)>=0)&&failed.every(x=>m.fails.indexOf(x)>=0);
  if(!ok) allOk=false;
  const lines=out.split("\n").filter(l=>/FAIL|Error|leaves|never called|names a function|ok context/.test(l)).slice(0,6).map(l=>l.slice(0,400));
  res.mutations.push({name:m.name, kind:m.kind, applied, expected:m.fails, failed, ok, lines});
  console.log((ok?"as expected ":"UNEXPECTED  ")+m.name+": failed ["+failed.join("; ")+"]");
}
res.allAsExpected=allOk;
if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
console.log(allOk?"every mutation as expected":"NOT every mutation as expected");
process.exit(allOk?0:1);
