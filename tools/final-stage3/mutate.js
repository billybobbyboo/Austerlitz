/* The final audits' Stage 3 (docs/ROADMAP_FINAL_AUDIT.md: WP-05, WP-06): the negative controls. Each mutation takes one fix out of a copy of
   the sources (its code put back as it was before the fix), builds the copy, and runs the check that holds the fix: runtime-test.js's WP-05/06
   block (tools/final-stage3/rt-block.js) or the self-test's wp56Checks in a fresh page (Chromium, 1366 x 768). A mutation is caught when the
   fix's own check fails on the copy; the unmutated copy must pass both. Read-only on the repository: the copies are made under the system's
   temporary directory and removed after.
   Usage: node tools/final-stage3/mutate.js [--only M1,M2] [--out file.json]   (from the repository root; npm install first) */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), cp=require("child_process");
const ROOT=path.join(__dirname,"..","..");
const MUT=[
  {id:"M0", finding:"none (the unmutated copy)", edits:[], runners:["rt","page"], want:null},
  {id:"M1", finding:"CL-SIM-03", runners:["rt"], want:"a theme stops the clock", edits:[["app.js",
    "  stopPlay();   /* the final audits' WP-05 (CL-SIM-03)", "  void 0;   /* mutated (CL-SIM-03)"]]},
  {id:"M2", finding:"CL-SIM-07", runners:["rt"], want:"the first Play frame", edits:[["app.js",
    "if(state===\"idle\") DEV.state=\"idle\"; lastFrame=now; return; }", "if(state===\"idle\") DEV.state=\"idle\"; return; }"]]},
  {id:"M3", finding:"CL-SIM-08", runners:["rt"], want:"the caption after a pause", edits:[["app.js",
    "  paintSituation();   /* the final audits' WP-05 (CL-SIM-08)", "  void 0;   /* mutated (CL-SIM-08)"]]},
  {id:"M4", finding:"CL-UX-14", runners:["rt"], want:"the event keys' margin", edits:[["app.js",
    "if(ts[i]>t+1e-6){ goToEventAt(ts[i]); return; }", "if(ts[i]>t+1.5){ goToEventAt(ts[i]); return; }"]]},
  {id:"M5", finding:"CL-SIM-06", runners:["rt"], want:"the reading by the minute", edits:[["app.js",
    "  if(commandView===\"none\") return;\n  var keep=clock, kp=curPhase;", "  return;\n  var keep=clock, kp=curPhase;"]]},
  {id:"M6", finding:"CL-SIM-04", runners:["rt"], want:"the overlays' fade", edits:[["app.js",
    "var obase=layerOn.arrows?0.9*ovFrom:0;", "var obase=0.9;"]]},
  {id:"M7", finding:"CL-SIM-01", runners:["rt","page"], want:["dossiers follow the clock","dossiers (WP-05"], edits:[["app.js",
    "  if(selection&&selection.kind===\"t\"){   /* Stage 8, 8A", "  if(selection&&selection.kind===\"t\"&&commandView!==\"none\"){   /* Stage 8, 8A"],["app.js",
    "    \"|\"+commandView+(EYE.on?\"e\":\"\")+\"|\"+Math.floor(clock+1e-9);", "    \"|\"+commandView+(EYE.on?\"e\":\"\");"]]},
  {id:"M7b", finding:"CL-SIM-01 (the section repaint)", runners:["page"], want:"dossiers", edits:[["app.js",
    "&&drawerMorph(body.firstChild,nn)){ syncInert(); return; }", "&&false){ syncInert(); return; }"]]},
  {id:"M8", finding:"CL-SIM-05", runners:["rt"], want:"Doing now under a reading", edits:[["app.js",
    "  var hidAct=!!(f.track&&readHidden(id));", "  var hidAct=false;"],["app.js",
    "    var hidAct=readHidden(id);   /* WP-05 (CL-SIM-05)", "    var hidAct=false;   /* mutated (CL-SIM-05)"]]},
  {id:"M9", finding:"CL-SIM-02 (the arrows)", runners:["rt","page"], want:["arrows and derived readings","Whose eyes?"], edits:[["app.js",
    "function ovReadSync(){\n  var ch=false;", "function ovReadSync(){ return;\n  var ch=false;"],["app.js",
    "    if(t.of&&readHidden(t.of)) return;   /* WP-05 (CL-SIM-02)", "    /* mutated (CL-SIM-02)"]]},
  {id:"M9b", finding:"CL-SIM-02 (the derived readings)", runners:["rt","page"], want:["arrows and derived readings","Whose eyes?"], edits:[["app.js",
    "function overKnown(fn){\n  if(commandView===\"none\") return fn();", "function overKnown(fn){\n  return fn();"]]},
  {id:"M10", finding:"CL-UX-07", runners:["rt"], want:"the reading on a phone", edits:[["style.css",
    "  body.reading-on #eyesbtn{display:inline-block;order:4;min-height:36px}\n", ""]]},
  {id:"M11", finding:"CL-UX-02", runners:["page"], want:"camera (WP-06, CL-UX-02)", edits:[["app.js",
    "  function take(){ if(_tw.cam&&tween===_runTween)", "  function take(){ return; if(_tw.cam&&tween===_runTween)"]]},
  {id:"M12", finding:"CL-UX-03", runners:["page"], want:"timeline (WP-06, CL-UX-03)", edits:[["app.js",
    "  if(evh){ var mk=null;", "  if(false){ var mk=null;"]]},
  {id:"M13", finding:"CL-UX-13", runners:["page"], want:"timeline (WP-06, CL-UX-13)", edits:[["app.js",
    "rail.addEventListener(\"pointerdown\",function(e){ if(e.button!==0) return; railBegin(e,rail); });", "rail.addEventListener(\"pointerdown\",function(e){ railBegin(e,rail); });"],["app.js",
    "    if(e.buttons!==undefined&&!(e.buttons&1)){ railEnd(); return; }   /* the release was missed", "    /* mutated (CL-UX-13): the release was missed"],["app.js",
    "  window.addEventListener(\"pointercancel\",railEnd);\n  rail.addEventListener(\"lostpointercapture\",railEnd);\n", ""]]},
  {id:"M14", finding:"CL-UX-04", runners:["page"], want:"timeline tips (WP-06, CL-UX-04)", edits:[["app.js",
    "  function tipYield(e){ if(tp.hidden) return;", "  function tipYield(e){ return;"]]},
  {id:"M15", finding:"CL-UX-19", runners:["page"], want:"map input (WP-06, CL-UX-19)", edits:[["app.js",
    "var S=SHEETS[id]; canvasDragEnd(); S.from=focusedEl();", "var S=SHEETS[id]; S.from=focusedEl();"]]},
  {id:"M16", finding:"CL-UX-20", runners:["page"], want:"focus (WP-06, CL-UX-20)", edits:[["app.js",
    "function resizeFocus(was){\n  if(!was) return;", "function resizeFocus(was){\n  return;"]]}
];
const args=process.argv.slice(2), only=(args.indexOf("--only")>=0?args[args.indexOf("--only")+1].split(","):null), outF=args.indexOf("--out")>=0?args[args.indexOf("--out")+1]:null;
const COPY=["app.js","assets.js","fonts.css","tokens.js","geo.js","data.js","appearance.js","analysis.js","narrative.js","world.js","symbols.js","shell.html","style.css","build.py","runtime-test.js","package.json"];
function makeCopy(m){
  const d=fs.mkdtempSync(path.join(os.tmpdir(),"aus-mut-"+m.id+"-"));
  COPY.forEach(f=>fs.copyFileSync(path.join(ROOT,f),path.join(d,f)));
  cp.execSync("cp -r "+JSON.stringify(path.join(ROOT,"tools"))+" "+JSON.stringify(path.join(d,"tools")));
  fs.symlinkSync(path.join(ROOT,"node_modules"),path.join(d,"node_modules"));
  m.edits.forEach(e=>{ const p=path.join(d,e[0]), s=fs.readFileSync(p,"utf8"), n=s.split(e[1]).length-1;
    if(n!==1) throw new Error(m.id+": the fix's code is found "+n+" times in "+e[0]+": "+e[1].slice(0,70)); fs.writeFileSync(p,s.replace(e[1],e[2])); });
  cp.execSync("python3 build.py",{cwd:d,stdio:"ignore"});
  return d;
}
function runRt(d){
  const r=cp.spawnSync(process.execPath,[path.join(d,"tools","final-stage3","rt-block.js")],{cwd:d,encoding:"utf8",maxBuffer:64e6});
  const txt=(r.stdout||"")+(r.stderr||""), E=txt.split("\n").filter(l=>/^  E /.test(l)), ok=txt.split("\n").filter(l=>/^WP-05\/06: .* OK$/.test(l));
  return {errors:E.map(l=>l.slice(4,260)), passed:ok.length};
}
async function runPage(d){
  const {chromium}=require(path.join(ROOT,"node_modules","playwright"));
  const {routeThree,waitBoot}=require(path.join(ROOT,"tools","visual","three-route.js"));
  const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1366,height:768}}); const msgs=[];
  p.on("pageerror",e=>msgs.push(e.message));
  try{ await routeThree(p); await p.goto("file://"+path.join(d,"austerlitz-command-map.html")); await waitBoot(p);
    const r=await p.evaluate(()=>{ closeFirst(null); return AUSTERLITZ_DEBUG.wp56().map(c=>({name:c.name,ok:c.ok,detail:String(c.detail).slice(0,300)})); });
    return {checks:r, pageErrors:msgs};
  } finally { await b.close(); }
}
(async()=>{
  const res=[];
  for(const m of MUT){ if(only&&only.indexOf(m.id)<0) continue;
    const t0=Date.now(), d=makeCopy(m), r={id:m.id,finding:m.finding};
    try{
      if(m.runners.indexOf("rt")>=0) r.rt=runRt(d);
      if(m.runners.indexOf("page")>=0) r.page=await runPage(d);
      const failed=[].concat(r.rt?r.rt.errors:[], r.page?r.page.checks.filter(c=>!c.ok).map(c=>c.name+": "+c.detail):[]);
      r.failed=failed;
      /* caught: by every runner the mutation names, one of its failures the fix's own check */
      const W=[].concat(m.want||[]), hit=L=>L.some(f=>W.some(w=>f.indexOf(w)>=0));
      r.byRunner={}; if(r.rt) r.byRunner.rt=hit(r.rt.errors); if(r.page) r.byRunner.page=hit(r.page.checks.filter(c=>!c.ok).map(c=>c.name));
      r.caught=m.want===null?failed.length===0:Object.keys(r.byRunner).every(k=>r.byRunner[k]);
      r.verdict=m.want===null?(r.caught?"passes":"FAILS (the unmutated copy must pass)"):(r.caught?"caught":"NOT CAUGHT");
    } catch(e){ r.verdict="ERROR "+e.message; r.caught=false; }
    finally { cp.execSync("rm -rf "+JSON.stringify(d)); }
    r.seconds=Math.round((Date.now()-t0)/1000); res.push(r);
    console.log(m.id+" "+m.finding+": "+r.verdict+" ("+r.seconds+" s)"+(r.failed&&r.failed.length?"\n    "+r.failed.slice(0,3).map(f=>f.slice(0,200)).join("\n    "):""));
  }
  if(outF) fs.writeFileSync(outF,JSON.stringify(res,null,1)+"\n");
  const bad=res.filter(r=>!r.caught); console.log(bad.length?"NOT ALL CAUGHT: "+bad.map(r=>r.id).join(", "):"all "+res.length+" as expected");
  process.exitCode=bad.length?1:0;
})();
