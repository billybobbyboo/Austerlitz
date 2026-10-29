#!/usr/bin/env node
/* Stage 8, implementation PR 8G (docs/STAGE8_SPEC.md section 19): does test.js hold what 8G's data task adds (BUILDINGS, CHURCHES, CHAPELS)?
   Each mutation replaces one string of a source file in a copy of the tree (every other file the repository's own, linked), test.js is run on the
   copy, and its errors are read: the unmutated sources first (no error); each mutation must give at least one error naming what it breaks.
   node tools/stage8/mutate-test-8g.js [--json out.json] [--only id,id]
   Measurement code only: nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), cp=require("child_process");
const ROOT=path.resolve(__dirname,"..",".."), argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; }, OUT=opt("--json"), ONLY=opt("--only")?opt("--only").split(","):null;
/* [id, what it breaks, file, from, to, the error's words (a regular expression)] */
const MUT=[
  ["none","nothing (the sources as they are)",null,null,null,null],
  ["noscope","a claim whose scope does not say how it bears on 1805","appearance.js","scope:\"the church that stood in 1805 (its rebuilding 1726-1734 in the church topography, wolnykt1_1856 p. 438: disputed, both before 1805);","scope:\"the church that stood then (its rebuilding 1726-1734 in the church topography, wolnykt1_1856 p. 438: disputed, both before then);",/scope saying how it bears on 1805/],
  ["roofsclaim","the villages' roofs made a claim (no source names them)","appearance.js","    roofs:{gen:true, why:\"no source read names the roofing","    roofs:{v:\"thatch\", src:\"lejeune1851\", at:\"p. 194\", gr:\"B\", lab:\"fact\", q:\"chaume\", scope:\"1805\", why:\"no source read names the roofing",/plan\.roofs: must stay generic/],
  ["churchnoclaim","a church drawn with no claim","world.js","var CHURCHES=[\"Telnitz\",","var CHURCHES=[\"Turas\",\"Telnitz\",",/drawn with a church and no claim/],
  ["legacy","a village drawn with a church until 8G and not since, with no claim of why","appearance.js","    Girzikowitz:{v:\"Girzikowitz, ein Dorf","    Girzikowitz_:{v:\"Girzikowitz, ein Dorf",/Girzikowitz was drawn with a church until 8G and is not now/],
  ["chapelchurch","a village drawn with a church and a chapel","world.js","var CHAPELS=[\"Holubitz\"];","var CHAPELS=[\"Holubitz\",\"Telnitz\"];",/drawn with a church and a chapel/],
  ["rearwall","a village's rear buildings with walls of no class","appearance.js","n:0.76, wall:\"timber\",","n:0.76, wall:\"wood\",",/its share \(0 to 1\) and its walls/],
  ["notdrawnclaim","what is not drawn made a claim","appearance.js","    santon:{gen:true, en:","    santon:{v:\"x\", en:",/notDrawn\.santon/],
  ["unknownsrc","a claim naming a source not registered","appearance.js","src:\"mza_telnitz1825\", at:\"pieces A02D","src:\"mza_tellnitz1825\", at:\"pieces A02D",/unknown source mza_tellnitz1825/],
  ["badlabel","a claim with a label outside the vocabulary","appearance.js","gr:\"B\", lab:\"attributed\", q:\"in dem ummauerten Friedhof","gr:\"B\", lab:\"probable\", q:\"in dem ummauerten Friedhof",/label probable/],
  ["attributedelsewhere","\"attributed\", BUILDINGS's alone, used in DRESS","appearance.js","gr:\"B\", lab:\"inference\", q:\"Cuirassiers 2. Rég.\",","gr:\"B\", lab:\"attributed\", q:\"Cuirassiers 2. Rég.\",",/label attributed/],
  ["unregistered","a new source cited nowhere","appearance.js","  npu1000133864: {au:","  nosuch2026: {au:\"x\", ti:\"x\", pub:\"x\", d:2026, kind:\"specialist\", url:\"x\"},\n  npu1000133864: {au:",/nosuch2026 is cited nowhere/],
  ["unguarded","BUILDINGS out of check:data's lists","tools/visual/data-invariance.js","    \"BUILDINGS\"],","    \"BUILDINGS_\"],",/BUILDINGS is not in check:data's lists/]
];
const FILES=[...new Set(MUT.map(m=>m[2]).filter(Boolean))], SRC={};
FILES.forEach(f=>{ SRC[f]=fs.readFileSync(path.join(ROOT,f),"utf8"); });
const dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-test-8g-")), res={mutations:[]};
fs.readdirSync(ROOT).forEach(f=>{ if(f===".git"||f==="tools") return; if(!FILES.includes(f)) fs.symlinkSync(path.join(ROOT,f),path.join(dir,f)); });
/* tools: linked but for the files mutated in it */
fs.mkdirSync(path.join(dir,"tools"));
fs.readdirSync(path.join(ROOT,"tools")).forEach(f=>{ if(f!=="visual") fs.symlinkSync(path.join(ROOT,"tools",f),path.join(dir,"tools",f)); });
fs.mkdirSync(path.join(dir,"tools","visual"));
fs.readdirSync(path.join(ROOT,"tools","visual")).forEach(f=>{ if(f!=="data-invariance.js") fs.symlinkSync(path.join(ROOT,"tools","visual",f),path.join(dir,"tools","visual",f)); });
let wrong=0;
for(const [id,what,file,a,b,re] of MUT){ if(ONLY&&id!=="none"&&!ONLY.includes(id)) continue;
  FILES.forEach(f=>{ let s=SRC[f]; if(a&&f===file){ if(s.split(a).length!==2) throw new Error(id+": the string to replace is not found exactly once in "+file); s=s.replace(a,()=>b); } fs.writeFileSync(path.join(dir,f),s); });
  const r=cp.spawnSync("node",["test.js"],{cwd:dir,encoding:"utf8",maxBuffer:64<<20}), out=(r.stdout||"")+(r.stderr||"");
  const errs=out.split("\n").filter(l=>/^ERRORS: |^  ! |^ *- |appearance: |guard: /.test(l));
  const m=out.match(/ERRORS: (\d+)/), n=m?+m[1]:-1;
  const ok=id==="none"?n===0&&r.status===0:(n>0&&re.test(out));
  if(!ok) wrong++;
  res.mutations.push({id, what, file, errors:n, matched:id==="none"?null:re.test(out), ok, lines:errs.filter(l=>re?re.test(l):true).slice(0,4)});
  console.log((ok?"ok    ":"WRONG ")+id.padEnd(20)+(id==="none"?"test.js: "+n+" errors":"test.js: "+n+" errors"+(re.test(out)?", naming it: "+(out.split("\n").find(l=>re.test(l))||"").trim().slice(0,150):", NOT naming it")));
}
fs.rmSync(dir,{recursive:true,force:true});
console.log(wrong?wrong+" WRONG":"every mutation as it should be");
if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
if(wrong) process.exitCode=1;
