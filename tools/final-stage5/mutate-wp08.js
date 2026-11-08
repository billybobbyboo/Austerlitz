#!/usr/bin/env node
/* The final audits' Stage 5, WP-08: the negative controls of the self-test's WP-08 block (app.js wp08Checks). Each mutation puts one fix back on a
   copy of the build (each replacement must apply exactly once) and runs the block on a fresh page; the check it names must fail, every other pass.
   "none" is the build as it is: every check passes. The caption (CL-MAP-06) and the card below 1080 px (CL-MAP-13) are the harness's narrow block's,
   their negative control main's build (tools/final-stage5/caption-judge.js, card-judge.js).
   node tools/final-stage5/mutate-wp08.js [build.html] [--json out.json]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), crypto=require("crypto");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..",".."), L=require(path.join(ROOT,"tools","stage8","lib.js"));
const html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(ROOT,"austerlitz-command-map.html")), OUT=opt("--json");
const G="the event glyphs", K="the key's rows", H="the key in the ? overlay", R="the north rose", S="the selection on the landscape";
const M=[
  {name:"none", rep:[], fails:[]},
  {name:"the default glyph an upright arrow again", fails:[G], rep:[['  other:function(x){ x.beginPath(); for(var k=0;k<8;k++){ var a=(k+0.5)*Math.PI/4; x.moveTo(64+12*Math.cos(a),64+12*Math.sin(a)); x.lineTo(64+27*Math.cos(a),64+27*Math.sin(a)); } x.stroke(); }',
    '  other:function(x){ x.beginPath(); x.moveTo(64,34); x.lineTo(64,94); x.stroke(); x.beginPath(); x.moveTo(48,52); x.lineTo(64,32); x.lineTo(80,52); x.stroke(); }']]},
  {name:"the capture a ring and a full cross again", fails:[G], rep:[['  capture:function(x,col){ x.fillStyle=col; x.beginPath(); x.arc(64,64,15,0,Math.PI*2); x.fill(); },',
    '  capture:function(x){ x.beginPath(); x.moveTo(64,16); x.lineTo(64,112); x.moveTo(16,64); x.lineTo(112,64); x.stroke(); },']]},
  {name:"the axis row never shown", fails:[K], rep:[['  on.axis=axis.length>0;','  on.axis=false;']]},
  {name:"no status row", fails:[K], rep:[['on["arm-"+f.arm]=true; if(st) on["st-"+st.tone]=true;','on["arm-"+f.arm]=true;']]},
  {name:"no key in the ? overlay", fails:[H], rep:[['    if(K.length) html+=\'<h3>\'','    if(false) html+=\'<h3>\'']]},
  {name:"the rose not shown", fails:[R], rep:[['.tb-rose{width:22px;','.tb-rose{display:none;width:22px;']]},
  {name:"the rose turned the wrong way", fails:[R], rep:[['_rose.setAttribute("transform","rotate("+ang.toFixed(1)+" 30 30)");','_rose.setAttribute("transform","rotate("+(-ang).toFixed(1)+" 30 30)");']]},
  {name:"no edge on the selected name", fails:[S], rep:[['    if(it.selC!==sel){ it.el.classList.toggle("mln-sel",sel); it.selC=sel; }','']]},
  {name:"the ring at 0.62 again", fails:[S], rep:[['  var sro=0.9-selRing.material.opacity;','  var sro=0.62-selRing.material.opacity;']]}
];
(async()=>{
  const src=fs.readFileSync(html,"utf8"), dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-wp08-")), res={build:path.basename(html), md5:crypto.createHash("md5").update(src).digest("hex"), mutations:[]};
  const b=await L.launch(); res.chromium=b.version(); let ok=true;
  for(const m of M){ let s=src; for(const [a,c] of m.rep){ const n=s.split(a).length-1; if(n!==1) throw new Error(m.name+": a replacement found "+n+" times: "+a.slice(0,80)); s=s.replace(a,()=>c); }
    const f=path.join(dir,"m.html"); fs.writeFileSync(f,s); process.env.AUSTERLITZ_HTML=f;
    const p=await L.open(b,[1366,768]); p.setDefaultTimeout(0); const errs=[]; p.on("pageerror",e=>errs.push(e.message));
    await p.evaluate(()=>{ AUSTERLITZ_DEBUG.settle(30); closeFirst(null); });
    const r=await p.evaluate(()=>wp08Checks()); await p.close();
    const failed=r.filter(c=>!c.ok).map(c=>c.name), want=m.fails;
    const expected=want.every(w=>failed.some(x=>x.startsWith(w)))&&failed.every(x=>want.some(w=>x.startsWith(w)))&&r.length===5&&!errs.length;
    if(!expected) ok=false;
    res.mutations.push({name:m.name, expectedToFail:want, failed:failed.map(x=>x.replace(/ \(WP-08.*$/,"")), asExpected:expected, details:r.filter(c=>!c.ok).map(c=>String(c.detail).slice(0,300)), pageErrors:errs});
    console.log((expected?"as expected  ":"NOT EXPECTED ")+m.name.padEnd(44)+" failed: "+(failed.map(x=>x.replace(/ \(WP-08.*$/,"")).join("; ")||"none")); }
  await b.close();
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
  console.log(ok?"all "+M.length+" as expected":"NOT ALL AS EXPECTED"); process.exit(ok?0:1);
})().catch(e=>{ console.error(e); process.exit(1); });
