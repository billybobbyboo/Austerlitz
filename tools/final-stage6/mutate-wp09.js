#!/usr/bin/env node
/* The final audits' Stage 6: the negative controls of the self-test's Stage 6 blocks. Each mutation puts one fix back on a copy of the build (each
   replacement must apply exactly once) and runs its block alone on a fresh page (tools/final-stage6/run-block.js); the checks it names must fail
   and every other check of the block pass. "none" is the build as it is: every check passes.
   node tools/final-stage6/mutate-wp09.js <set> [build.html] [--json out.json]   (sets: wp09, names, the hint, the focus, the caveats and the card)
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), crypto=require("crypto"), cp=require("child_process");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..","..");
const set=argv[0], html=path.resolve(argv.find((a,i)=>i>0&&a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(ROOT,"austerlitz-command-map.html")), OUT=opt("--json");
const N="names and structure (WP-09, CL-UX-15)", H="the phase text's hint (WP-09, CL-UX-12)", F="the focus to an opened panel (WP-09, CL-UX-10)", C="the caveats shown (WP-09, CL-UX-08)", R="the first card's reconstruction (WP-09, CL-UX-11; decision 276 (a))";
const SETS={
  wp09:{block:"wp09Checks", M:[
    {name:"none", rep:[], fails:[]},
    {name:"the tablist named The rail again", fails:[N], rep:[['role="tablist" aria-label="Panels"','role="tablist" aria-label="The rail"']]},
    {name:"Play pressed again", fails:[N], rep:[['  if(b) b.textContent="Pause";','  if(b){ b.textContent="Pause"; b.setAttribute("aria-pressed","true"); }']]},
    {name:"the layer tag inside its heading again", fails:[N], rep:[["(layer?'<div class=\"sect-h\"><h3>'+esc(title)+'</h3><span","(layer?'<div class=\"sect-h\"><h3>'+esc(title)+'<span"],["LAYER_TAG[layer])+'</span></div>':'<h3>'+esc(title)+'</h3>')","LAYER_TAG[layer])+'</span></h3></div>':'<h3>'+esc(title)+'</h3>')"]]},
    {name:"the hint names D whatever the switch", fails:[H], rep:[['(SHORTCUTS.on?" "+L.key:"")','(" "+L.key)']]},
    {name:"Layers opened by a key leaves the focus on its button", fails:[F], rep:[['    if(open&&kb) focusTo(','    if(false) focusTo(']]},
    {name:"a map item's Enter leaves the focus on the item", fails:[F], rep:[['      if(h&&shown(h)){ h.tabIndex=-1; h.focus({preventScroll:true}); } };','      };']]},
    {name:"the derived readings' notes in their tooltips alone", fails:[C], rep:[["+'<span class=\"der-note\">'+esc(FLAT_NOTE)+'</span>'","+''"]]},
    {name:"the vantage's caveat in its tooltip alone", fails:[C], rep:[['    if(vn){ vn.textContent=m?pb.textContent+": "+m[1]+".":""; vn.hidden=!m; } }','    }']]},
    {name:"the card without its reconstruction sentence", fails:[R], rep:[["    esc(LABELS.card.recon)+' <button","    ' <button"]]}
  ]}
};
const S=SETS[set]; if(!S){ console.error("unknown set "+set+"; one of "+Object.keys(SETS).join(", ")); process.exit(2); }
const src=fs.readFileSync(html,"utf8"), dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-s6-")), res={set, build:path.basename(html), md5:crypto.createHash("md5").update(src).digest("hex"), mutations:[]};
let allOk=true;
for(const m of S.M){
  let s=src, applied=true;
  for(const [a,b] of m.rep){ const n=s.split(a).length-1; if(n!==1){ applied=false; console.log("NOT APPLIED ("+n+"x): "+m.name+": "+a.slice(0,80)); break; } s=s.replace(a,()=>b); }
  const f=path.join(dir,"m.html"); fs.writeFileSync(f,s);
  const jf=path.join(dir,"r.json"); try{ fs.unlinkSync(jf); }catch(e){}
  try{ cp.execFileSync("node",[path.join(__dirname,"run-block.js"),S.block,f,"--json",jf],{stdio:"ignore",timeout:1200000}); }catch(e){}
  let checks=[]; try{ checks=JSON.parse(fs.readFileSync(jf,"utf8")).checks; }catch(e){}
  const failed=checks.filter(c=>!c.ok).map(c=>c.name.split(":")[0]);
  const ok=applied&&checks.length>0&&m.fails.every(x=>failed.indexOf(x)>=0)&&failed.every(x=>m.fails.indexOf(x)>=0);
  if(!ok) allOk=false;
  res.mutations.push({name:m.name, applied, expected:m.fails, failed, ok, detail:checks.filter(c=>!c.ok).map(c=>String(c.detail).slice(0,300))});
  console.log((ok?"as expected ":"UNEXPECTED  ")+m.name+": failed ["+failed.join("; ")+"]");
}
res.allAsExpected=allOk;
if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
console.log(set+":",res.mutations.filter(x=>x.ok).length,"of",res.mutations.length,"as expected");
process.exit(allOk?0:1);
