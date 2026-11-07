/* The final audits' Stage 4, WP-03 (docs/ROADMAP_FINAL_AUDIT.md): the negative controls. Each mutation takes one fix out of a copy of the
   sources (its data or code put back as it was before the fix) and runs the check that holds it: test.js (decision 272 (a)'s grade rule and
   the claims on the reworded texts), sim-test.js (decision 285 (a)'s rule, the fight register, the Litava, Sokolnitz held), runtime-test.js
   (the drift's march row, CL-HIS-13) or check:chronology (Kamensky's hold, decision 286 (a)). A mutation is caught when its check fails with
   the fix's own message; the unmutated copy (M0) must pass every runner. Read-only on the repository: the copies are made under the system's
   temporary directory and removed after.
   Usage: node tools/final-stage4/mutate.js [--only M1,M2] [--out file.json]   (from the repository root; npm install first) */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), cp=require("child_process");
const ROOT=path.join(__dirname,"..","..");
const MUT=[
  {id:"M0", finding:"none (the unmutated copy)", edits:[], runners:["test","sim","rt","chron"], want:null},
  {id:"M1", finding:"CL-HIS-05 (decision 285 (a))", runners:["sim"], want:"285: rg_inf@7", edits:[["data.js",
    '7:{p:[397,196],cf:"B",st:"repulsed",hold:true,act:"Driven off', '7:{p:[397,196],cf:"B",st:"repulsed",act:"Driven off']]},
  {id:"M2", finding:"CL-HIS-07 (decision 286 (a))", runners:["chron"], want:"kamensky@3", edits:[["data.js",
    'st:"countermarch",cf:"A",hold:true,obj:"Retake the Pratzeberg"', 'st:"countermarch",cf:"A",obj:"Retake the Pratzeberg"']]},
  {id:"M3", finding:"CL-HIS-13", runners:["rt"], want:"march row", edits:[["app.js",
    "  if(mr.kmh<GAIT.KMH) return row(LABELS.march.drift,", "  if(false) return row(LABELS.march.drift,"]]},
  {id:"M4", finding:"CL-HIS-04", runners:["sim"], want:"legrand x prz", edits:[["data.js",
    '    4:{p:[192,365],st:"supporting",cf:"B",', '    4:{p:[220,321],st:"supporting",cf:"B",'],["data.js",
    'st:"attacking",via:[[208,365]],act:"Presses east to the stream at Sokolnitz', 'st:"attacking",via:[[211,322],[208,365]],act:"Presses east to the stream at Sokolnitz']]},
  {id:"M5", finding:"CL-HIS-10 (Bourcier)", runners:["sim"], want:"bourcier x", edits:[["data.js",
    '    8:{p:[201,416],cf:"B",st:"attacking",act:"On Davout', '    8:{p:[253,393],cf:"B",st:"pursuing",via:[[212,408],[247,397]],act:"On Davout'],["data.js",
    '    9:{p:[201,416],cf:"C",st:"holding",act:"Its place at nightfall is this map\'s: Davout', '    9:{p:[297,374],cf:"C",st:"pursuing",via:[[273,378]],act:"Its place at nightfall is this map\'s: Davout']]},
  {id:"M6", finding:"CL-HIS-10 (the Litava)", runners:["sim"], want:"Litava: milo@8", edits:[["data.js",
    '    8:{p:[461,161],cf:"C",st:"retreating",act:"Back across the brook', '    8:{p:[446,210],cf:"C",st:"retreating",act:"Back across the brook']]},
  {id:"M7", finding:"CL-HIS-02 (decision 272 (a))", runners:["test"], want:"caffarelli@6: moves", edits:[["data.js",
    '    6:{p:[321,120],cf:"B",st:"advancing"},', '    6:{p:[321,120],st:"advancing"},']]},
  {id:"M8", finding:"the fight register (CL-HIS-10)", runners:["sim"], want:"sthilaire x kamensky", edits:[["sim-test.js",
    ' {a:"sthilaire",b:"kamensky",from:"09:10",to:"11:15",', ' {a:"sthilaire",b:"kamensky",from:"09:10",to:"09:15",']]},
  {id:"M9", finding:"CL-HIS-11", runners:["sim"], want:"CL-HIS-11: Sokolnitz village drawn without friant", edits:[["data.js",
    '    5:{p:[208,365],cf:"B",st:"engaged",obj:"Hold Sokolnitz"', '    5:{p:[200,398],cf:"B",st:"engaged",obj:"Hold Sokolnitz"'],["data.js",
    '    7:{p:[208,365],st:"attacking",cf:"B",obj:"Press east across the Goldbach"', '    7:{p:[204,390],st:"attacking",cf:"B",obj:"Press east across the Goldbach"'],["data.js",
    '    8:{p:[208,365],cf:"B",st:"attacking",act:"At Sokolnitz', '    8:{p:[214,410],cf:"B",st:"attacking",act:"At Sokolnitz']]},
  {id:"M10", finding:"CL-HIS-08 (the act held by its claim)", runners:["test"], want:"kienmayer.track", edits:[["data.js",
    'act:"Its cavalry formed beyond the Telnitz defile, west of the Goldbach, its battalions and guns in Telnitz (Stutterheim; Schönhals), until the French came down behind the column. The point drawn, between Telnitz and the Satschan mere, is where Schönhals has Carneville\'s brigade face Vandamme\'s descent: this map\'s"',
    'act:"Holding west of the Goldbach as the trap closes behind it"']]},
  {id:"M11", finding:"CL-HIS-03 (the divided register held by its claim)", runners:["test"], want:"rg_inf.track", edits:[["data.js",
    'act:"Where it stood is divided: on the heights by Blasowitz and Krug', 'act:"Where it stood: on the heights by Blasowitz and Krug']]}
];
const args=process.argv.slice(2), only=(args.indexOf("--only")>=0?args[args.indexOf("--only")+1].split(","):null), outF=args.indexOf("--out")>=0?args[args.indexOf("--out")+1]:null;
function makeCopy(m){
  const d=fs.mkdtempSync(path.join(os.tmpdir(),"aus-mut4-"+m.id+"-"));
  /* the sources, the suites and what they read (tools/, the registers and the inventory); not .git, node_modules, the archive or page images */
  cp.execSync("tar -C "+JSON.stringify(ROOT)+" --exclude=./.git --exclude=./node_modules --exclude=./archive --exclude=./.claude --exclude='*/pages' --exclude='./tools/visual/out*' -cf - . | tar -C "+JSON.stringify(d)+" -xf -");
  fs.symlinkSync(path.join(ROOT,"node_modules"),path.join(d,"node_modules"));
  m.edits.forEach(e=>{ const p=path.join(d,e[0]), s=fs.readFileSync(p,"utf8"), n=s.split(e[1]).length-1;
    if(n!==1) throw new Error(m.id+": the fix's code is found "+n+" times in "+e[0]+": "+e[1].slice(0,70)); fs.writeFileSync(p,s.replace(e[1],e[2])); });
  cp.execSync("python3 build.py",{cwd:d,stdio:"ignore"});
  return d;
}
const RUN={test:["test.js"], sim:["sim-test.js"], rt:["runtime-test.js"], chron:["tools/stage2/chronology.js","--check"]};
function run(d,k){
  const r=cp.spawnSync(process.execPath,RUN[k],{cwd:d,encoding:"utf8",maxBuffer:64e6});
  const txt=(r.stdout||"")+(r.stderr||"");
  const E=txt.split("\n").filter(l=>/^  [!E] /.test(l)).map(l=>l.slice(4,300));
  return {status:r.status, errors:E};
}
const res=[];
for(const m of MUT){ if(only&&only.indexOf(m.id)<0) continue;
  const t0=Date.now(), r={id:m.id,finding:m.finding}; let d=null;
  try{ d=makeCopy(m); r.runs={}; m.runners.forEach(k=>{ r.runs[k]=run(d,k); });
    const failed=[].concat(...Object.values(r.runs).map(x=>x.errors)), bad=Object.values(r.runs).some(x=>x.status!==0);
    if(m.want===null){ r.caught=!bad&&!failed.length; r.verdict=r.caught?"passes":"FAILS (the unmutated copy must pass)"; }
    else { r.caught=Object.values(r.runs).every(x=>x.status!==0&&x.errors.some(e=>e.indexOf(m.want)>=0)); r.verdict=r.caught?"caught":"NOT CAUGHT"; }
    r.failed=failed.slice(0,6);
  } catch(e){ r.verdict="ERROR "+e.message; r.caught=false; }
  finally { if(d) cp.execSync("rm -rf "+JSON.stringify(d)); }
  r.seconds=Math.round((Date.now()-t0)/1000); res.push(r);
  console.log(m.id+" "+m.finding+": "+r.verdict+" ("+r.seconds+" s)"+(r.failed&&r.failed.length?"\n    "+r.failed.slice(0,2).map(f=>f.slice(0,200)).join("\n    "):""));
}
if(outF) fs.writeFileSync(outF,JSON.stringify(res,null,1)+"\n");
const bad=res.filter(r=>!r.caught); console.log(bad.length?"NOT ALL CAUGHT: "+bad.map(r=>r.id).join(", "):"all "+res.length+" as expected");
process.exitCode=bad.length?1:0;
