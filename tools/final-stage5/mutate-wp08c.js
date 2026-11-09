#!/usr/bin/env node
/* The final audits' Stage 5, WP-08's lettering and landmarks: the negative controls of the self-test's block (app.js wp08cChecks). Each mutation puts
   one fix back on a copy of the build (each replacement must apply exactly once) and runs the block on a fresh page; the check it names must fail,
   every other pass. "none" is the build as it is: every check passes.
   node tools/final-stage5/mutate-wp08c.js [build.html] [--json out.json]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), crypto=require("crypto");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..",".."), L=require(path.join(ROOT,"tools","stage8","lib.js"));
const html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(ROOT,"austerlitz-command-map.html")), OUT=opt("--json");
const A="arrow labels and names", P="the Plans view", C="the chapels", O="the landmarks' outlines";
const M=[
  {name:"none", rep:[], fails:[]},
  {name:"the name-only labels drawn beside their formations", fails:[A], rep:[['  function dupDrawn(it){ if(!it.dupOf) return false;','  function dupDrawn(it){ if(true) return false;']]},
  {name:"a name-only label withheld with its formation out of view", fails:[A], rep:[['  function dupDrawn(it){ if(!it.dupOf) return false;','  function dupDrawn(it){ if(!it.dupOf) return false; return true;']]},
  {name:"a label that tells the movement withheld", fails:[A], rep:[['function mlNameOnly(label,f){ if(!f||!label||/\\s/.test(label)) return false;','function mlNameOnly(label,f){ if(!f||!label) return false; return true;']]},
  {name:"the phase's labels kept beside a plan", fails:[P], rep:[['  if(labels&&layerOn.arrows&&!planGroup) ovText.forEach(','  if(labels&&layerOn.arrows) ovText.forEach(']]},
  {name:"the plan labels without their mark", fails:[P], rep:[[`mlContent(it,["pl",t.text,sd||"",PL].join("|"),(sd?'<i class="mln-mark"`,`mlContent(it,["pl",t.text,sd||"",PL].join("|"),(false?'<i class="mln-mark"`]]},
  {name:"the phase's arrows not dimmed", fails:[P], rep:[['var ML_DUP_PRI=7.95, PLAN_DIM=0.35;','var ML_DUP_PRI=7.95, PLAN_DIM=1;']]},
  {name:"St Anthony's place a diamond again", fails:[C], rep:[['  chapel:{kind:"chapel",','  chapel:{kind:"none",']]},
  {name:"no line in the places' dossiers", fails:[C], rep:[['  var nd=landmarkNotDrawn(ft); if(nd) wrap.appendChild(nd);','']]},
  {name:"the outlines always on the landscape", fails:[O], rep:[['    var on=presentation!=="map"&&(paper||sel===q[1]);','    var on=presentation!=="map";']]},
  {name:"no outline on the paper map", fails:[O], rep:[['    var on=presentation!=="map"&&(paper||sel===q[1]);','    var on=presentation!=="map"&&sel===q[1];']]}
];
(async()=>{
  const src=fs.readFileSync(html,"utf8"), dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-wp08c-")), res={build:path.basename(html), md5:crypto.createHash("md5").update(src).digest("hex"), mutations:[]};
  const b=await L.launch(); res.chromium=b.version(); let ok=true;
  for(const m of M){ let s=src; for(const [a,c] of m.rep){ const n=s.split(a).length-1; if(n!==1) throw new Error(m.name+": a replacement found "+n+" times: "+a.slice(0,80)); s=s.replace(a,()=>c); }
    const f=path.join(dir,"m.html"); fs.writeFileSync(f,s); process.env.AUSTERLITZ_HTML=f;
    const p=await L.open(b,[1366,768]); p.setDefaultTimeout(0); const errs=[]; p.on("pageerror",e=>errs.push(e.message));
    await p.evaluate(()=>{ AUSTERLITZ_DEBUG.settle(30); closeFirst(null); });
    const r=await p.evaluate(()=>wp08cChecks()); await p.close();
    const failed=r.filter(c=>!c.ok).map(c=>c.name), want=m.fails;
    const expected=want.every(w=>failed.some(x=>x.startsWith(w)))&&failed.every(x=>want.some(w=>x.startsWith(w)))&&r.length===4&&!errs.length;
    if(!expected) ok=false;
    res.mutations.push({name:m.name, expectedToFail:want, failed:failed.map(x=>x.replace(/ \(WP-08.*$/,"")), asExpected:expected, details:r.filter(c=>!c.ok).map(c=>String(c.detail).slice(0,300)), pageErrors:errs});
    console.log((expected?"as expected  ":"NOT EXPECTED ")+m.name.padEnd(52)+" failed: "+(failed.map(x=>x.replace(/ \(WP-08.*$/,"")).join("; ")||"none")); }
  await b.close();
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
  console.log(ok?"all "+M.length+" as expected":"NOT ALL AS EXPECTED"); process.exit(ok?0:1);
})().catch(e=>{ console.error(e); process.exit(1); });
