#!/usr/bin/env node
/* Negative controls for tools/step6/phone-rule.js (the final audit after Stage 8, CL-PERF-16): every malformed or incomplete report must be
   refused with a non-zero exit, and the owner's real runs R1 and R2 must still give their verdict (rule 4).
   node tools/step6/phone-rule-negatives.js   (writes its scratch reports to the system temp directory and removes them; exit 1 on any miss) */
const fs=require("fs"), os=require("os"), path=require("path"), cp=require("child_process");
const RULE=path.join(__dirname,"phone-rule.js"), DEV=path.join(__dirname,"..","..","docs","stage8-evidence","device");
const R1=JSON.parse(fs.readFileSync(path.join(DEV,"phone-R1.json"),"utf8")), R2=path.join(DEV,"phone-R2.json");
const dir=fs.mkdtempSync(path.join(os.tmpdir(),"phone-rule-neg-"));
const run=(a,b)=>{ const r=cp.spawnSync(process.execPath,[RULE,a,b],{encoding:"utf8"}); return {code:r.status,out:(r.stdout||"")+(r.stderr||"")}; };
const clone=o=>JSON.parse(JSON.stringify(o));
const kindBlocks=(r,kind)=>r.segments.filter(s=>s.id===kind&&s.cand&&s.round);
const CASES={
  "empty report": ()=>({refreshMs:17,notes:[],segments:[]}),
  "no refresh": r=>{ delete r.refreshMs; return r; },
  "one A removed": r=>{ const a=kindBlocks(r,"play-half").find(s=>s.cand==="A"); r.segments.splice(r.segments.indexOf(a),1); return r; },
  "one candidate removed": r=>{ const c=kindBlocks(r,"ph8-overview").find(s=>s.cand==="figShadow"); r.segments.splice(r.segments.indexOf(c),1); return r; },
  "a round removed": r=>{ const rd=kindBlocks(r,"play-half")[0].round; r.segments=r.segments.filter(s=>!(s.id==="play-half"&&s.round===rd)); return r; },
  "a duplicate block": r=>{ const c=kindBlocks(r,"play-half").find(s=>s.cand==="density1"); r.segments.splice(r.segments.indexOf(c),0,clone(c)); return r; },
  "a non-finite p50": r=>{ kindBlocks(r,"ph8-overview").find(s=>s.cand==="shadowPass").p50=NaN; return r; },
  "a hidden segment": r=>{ kindBlocks(r,"play-half")[1].hidden=true; return r; },
};
let fail=0;
const real=run(path.join(DEV,"phone-R1.json"),R2);
const realOk=real.code===0&&/VERDICT: rule 4/.test(real.out);
console.log((realOk?"ok  ":"MISS")+" real R1, R2: "+(real.out.match(/VERDICT: .*/)||["exit "+real.code])[0]); if(!realOk) fail++;
for(const [name,mut] of Object.entries(CASES)){
  const f=path.join(dir,name.replace(/\W+/g,"-")+".json"); fs.writeFileSync(f,JSON.stringify(mut(clone(R1))));
  const r=run(f,R2), ok=r.code!==0;
  console.log((ok?"ok  ":"MISS")+" "+name+": exit "+r.code+(ok?" ("+((r.out.match(/Error: (.*)/)||[,""])[1]).slice(0,120)+")":" "+(r.out.match(/VERDICT: .*/)||[""])[0]));
  if(!ok) fail++;
}
fs.rmSync(dir,{recursive:true,force:true});
console.log(fail?fail+" control(s) missed":"all controls refused; the real verdict unchanged"); process.exit(fail?1:0);
