/* The final audits' Stage 4, WP-04b (docs/ROADMAP_FINAL_AUDIT.md): the negative controls. Each mutation puts one fix of WP-04b back as it was
   (or breaks the rule its check holds) in a copy of the sources and runs the suite that holds it; a mutation is caught when that suite exits
   non-zero with a failing line naming the fix (want). The unmutated copy (N0) must pass every runner, but for the lines named in N0_ALLOWED
   (tour stop 5's quoted viewshed, put to the owner with WP-04b's refit). Read-only on the repository: the copies are made under the system's
   temporary directory and removed after.
   Usage: node tools/final-stage4-wp04b/mutate.js [--only N1,N2] [--out file.json]   (from the repository root; npm install first) */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), cp=require("child_process");
const ROOT=path.join(__dirname,"..","..");
/* the failing line the unmutated tree is allowed while the owner decides tour stop 5 (WP-04b's report): terrain-test's quote check */
const N0_ALLOWED=[/^  tour stop 5 quotes 73% and under 3%; live readings [\d.]+% and [\d.]+%: DISAGREE$/];
const MUT=[
  {id:"N0", finding:"none (the unmutated copy)", edits:[], runners:["terrain","test","sim","rt","css","geo"], want:null},
  {id:"N1", finding:"CL-GEO-01 (the relief before WP-04b: no RELIEF_DEM, PBERG 5.45, SCHLAP 3.0)", runners:["terrain"], want:"relief tolerance: the southern Pratzen plateau", edits:[["world.js",
    "  for(var i=0;i<RELIEF_DEM.length;i++) r+=tbump(x,z,RELIEF_DEM[i]);   /* WP-04b: the relief between the anchors */\n", ""],["world.js",
    "h += bump(x,z,PBERG,10,9.5,2.93,0.26);", "h += bump(x,z,PBERG,10,9.5,5.45,0.26);"],["world.js",
    "h += bump(x,z,SCHLAP,15,9,0.22,0.36);", "h += bump(x,z,SCHLAP,15,9,3.0,0.36);"]]},
  {id:"N2", finding:"CL-GEO-01 (c16r's amplitudes, the fit without the summit held)", runners:["terrain"], want:"relief tolerance: no false summit", edits:[["world.js",
    "edge:0.76, h:6.09}", "edge:0.76, h:6.15}"],["world.js","edge:0.07, h:5.58}","edge:0.07, h:5.56}"],["world.js","edge:0.34, h:5.77}","edge:0.34, h:5.69}"],
    ["world.js","edge:0.38, h:-4.59}","edge:0.38, h:-4.66}"],["world.js","edge:0, h:-4.11}","edge:0, h:-4.61}"],["world.js",
    "h += bump(x,z,PBERG,10,9.5,2.93,0.26);", "h += bump(x,z,PBERG,10,9.5,3.26,0.26);"]]}
];
const args=process.argv.slice(2), only=(args.indexOf("--only")>=0?args[args.indexOf("--only")+1].split(","):null), outF=args.indexOf("--out")>=0?args[args.indexOf("--out")+1]:null;
function makeCopy(m){
  const d=fs.mkdtempSync(path.join(os.tmpdir(),"aus-mut4b-"+m.id+"-"));
  cp.execSync("tar -C "+JSON.stringify(ROOT)+" --exclude=./.git --exclude=./node_modules --exclude=./archive --exclude=./.claude --exclude='*/pages' --exclude='./tools/visual/out*' -cf - . | tar -C "+JSON.stringify(d)+" -xf -");
  fs.symlinkSync(path.join(ROOT,"node_modules"),path.join(d,"node_modules"));
  m.edits.forEach(e=>{ const p=path.join(d,e[0]), s=fs.readFileSync(p,"utf8"), n=s.split(e[1]).length-1;
    if(n!==1) throw new Error(m.id+": the fix's code is found "+n+" times in "+e[0]+": "+e[1].slice(0,70)); fs.writeFileSync(p,s.split(e[1]).join(e[2])); });
  cp.execSync("python3 build.py",{cwd:d,stdio:"ignore"});
  cp.execSync(process.execPath+" tools/mk-helpers.js",{cwd:d,stdio:"ignore"});
  return d;
}
const RUN={terrain:["terrain-test.js"], test:["test.js"], sim:["sim-test.js"], rt:["runtime-test.js"], css:["css-test.js"], geo:["geo-test.js"]};
/* a suite's failing lines: its error marks ("  ! ", "  E ", "ERROR"), and terrain-test's verdict words */
const FAILLINE=/^ {0,4}[!E] |OUTSIDE|DISAGREE|BROKEN|FLOATS|FAIL(?:ED|S)?\b|^\s*[✗x] /;
function run(d,k){
  const r=cp.spawnSync(process.execPath,RUN[k],{cwd:d,encoding:"utf8",maxBuffer:64e6});
  const txt=(r.stdout||"")+(r.stderr||"");
  const E=txt.split("\n").filter(l=>FAILLINE.test(l)&&!/\b0 failed\b|ERRORS: 0\b|errors: 0\b/.test(l)).map(l=>l.slice(0,400));
  return {status:r.status, errors:E};
}
const res=[];
for(const m of MUT){ if(only&&only.indexOf(m.id)<0) continue;
  const t0=Date.now(), r={id:m.id,finding:m.finding}; let d=null;
  try{ d=makeCopy(m); r.runs={}; m.runners.forEach(k=>{ r.runs[k]=run(d,k); });
    const failed=[].concat(...Object.values(r.runs).map(x=>x.errors));
    if(m.want===null){ const extra=failed.filter(l=>!N0_ALLOWED.some(re=>re.test(l)));
      const statusOk=Object.entries(r.runs).every(([k,x])=>x.status===0||(x.errors.length&&x.errors.every(l=>N0_ALLOWED.some(re=>re.test(l)))));
      r.caught=statusOk&&!extra.length; r.allowed=failed.filter(l=>N0_ALLOWED.some(re=>re.test(l)));
      r.verdict=r.caught?"passes"+(r.allowed.length?" (but the "+r.allowed.length+" allowed line(s): "+r.allowed.join(" | ")+")":""):"FAILS (the unmutated copy must pass)"; }
    else { r.caught=Object.values(r.runs).every(x=>x.status!==0&&x.errors.some(e=>e.indexOf(m.want)>=0)); r.verdict=r.caught?"caught":"NOT CAUGHT"; }
    r.failed=failed.slice(0,12);
  } catch(e){ r.verdict="ERROR "+e.message; r.caught=false; }
  finally { if(d) cp.execSync("rm -rf "+JSON.stringify(d)); }
  r.seconds=Math.round((Date.now()-t0)/1000); res.push(r);
  console.log(m.id+" "+m.finding+": "+r.verdict+" ("+r.seconds+" s)"+(m.want!==null&&r.failed&&r.failed.length?"\n    "+r.failed.filter(f=>f.indexOf(m.want)>=0).concat(r.failed).slice(0,3).map(f=>f.slice(0,220)).join("\n    "):(!r.caught&&r.failed?"\n    "+r.failed.slice(0,4).join("\n    "):"")));
}
if(outF) fs.writeFileSync(outF,JSON.stringify(res,null,1)+"\n");
const bad=res.filter(r=>!r.caught); console.log(bad.length?"NOT ALL AS EXPECTED: "+bad.map(r=>r.id).join(", "):"all "+res.length+" as expected");
process.exitCode=bad.length?1:0;
