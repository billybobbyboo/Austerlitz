#!/usr/bin/env node
/* Stage 8, the follow-up 8J (decision 259 (a); docs/STAGE8_SPEC.md section 21): what the geographic corrections change in the derived readings and
   the knowledge model, measured on two builds (before and after), each on a page opened as the probes open it. The relief moves with the Goldbach's
   bed (localHeight's carve follows GOLDBACH), and the III Column's places move with the castle and the pheasantry, so: (1) "Whose eyes?" (decision 92):
   for Napoleon's and the Allied headquarters, every ten minutes from 04:00 to 17:00, every enemy formation on the field read by knowledgeOf (seen,
   uncertain, unknown) and its reason (knowReason); (2) the viewshed's share of the field from the terrain test's seven observers (a 3 m eye,
   computeViewshed); (3) the derived readings the screen shows: the plateau's strength at each phase's start and the centres' separation. Every
   difference is listed with its formation, clock and reading on each build.
   node tools/stage8/know-8j.js --before <build> --after <build> [--out file.json]   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const BUILDS=[["before",path.resolve(opt("--before"))],["after",path.resolve(opt("--after"))]], OUT=opt("--out");
const md5=f=>require("crypto").createHash("md5").update(fs.readFileSync(f)).digest("hex");
const READ=function(){
  var out={know:{}, vs:{}, plateau:{}, sep:{}};
  ["fr","al"].forEach(function(cv){ setCommandView(cv);
    for(var t=T_MIN;t<=T_MAX;t+=10){ setClock(t,{instant:true,force:true,camera:false}); knowKey="";
      Object.keys(units).forEach(function(id){ if(sideOfNation(FORMATIONS[id].nation)===cv||!posNow(id)) return;
        var k=knowledgeOf(id); out.know[cv+"|"+t+"|"+id]=k+(k!=="seen"?" ("+(knowReason(id)||"")+")":""); }); } });
  setCommandView("none");
  [["pratzeberg"],["vinohrady"],["santon"],["zuran"],["puntowitz"],["sokolnitz"],["augezd"]].forEach(function(q){ var mp=GEOREF.GT[q[0]].map; computeViewshed(mp,3.0);
    var v=0; for(var i=0;i<vsMask.length;i++) v+=vsMask[i]; out.vs[q[0]]=+(100*v/vsMask.length).toFixed(2); });
  if(typeof clearViewshed==="function") clearViewshed();
  PHASES.forEach(function(ph,i){ out.plateau[i]=plateauStrength(ph.t0+1); var s=centreSeparation(ph.t0+1); out.sep[i]=s&&s.km!==undefined?+s.km.toFixed(3):(typeof s==="number"?+s.toFixed(3):JSON.stringify(s)); });
  return out;
};
(async()=>{
  const browser=await L.launch(), res={tool:"tools/stage8/know-8j.js", builds:{}, diff:{know:[], vs:{}, plateau:[], sep:[]}};
  const R={};
  for(const [tag,html] of BUILDS){ process.env.AUSTERLITZ_HTML=html; const page=await L.open(browser,[1280,720]);
    await page.evaluate(()=>{ closeFirst(null); if(playing) stopPlay(); });
    R[tag]=await page.evaluate(READ); res.builds[tag]={file:path.basename(html), md5:md5(html), readings:Object.keys(R[tag].know).length, errors:(page._errors||[]).slice()}; await page.close(); }
  await browser.close();
  const A=R.before, B=R.after, keys=new Set(Object.keys(A.know).concat(Object.keys(B.know)));
  keys.forEach(k=>{ if(A.know[k]!==B.know[k]){ const [cv,t,id]=k.split("|"); res.diff.know.push({reading:cv, clock:+t, id:id, before:A.know[k]||"(not on the field)", after:B.know[k]||"(not on the field)"}); } });
  Object.keys(B.vs).forEach(k=>{ res.diff.vs[k]={before:A.vs[k], after:B.vs[k], d:+(B.vs[k]-A.vs[k]).toFixed(2)}; });
  Object.keys(B.plateau).forEach(i=>{ if(A.plateau[i]!==B.plateau[i]) res.diff.plateau.push({phase:+i, before:A.plateau[i], after:B.plateau[i]}); if(A.sep[i]!==B.sep[i]) res.diff.sep.push({phase:+i, before:A.sep[i], after:B.sep[i]}); });
  res.summary={readings:keys.size, differ:res.diff.know.length, byReading:{fr:res.diff.know.filter(d=>d.reading==="fr").length, al:res.diff.know.filter(d=>d.reading==="al").length},
    formations:[...new Set(res.diff.know.map(d=>d.id))]};
  console.log(JSON.stringify(res.summary)); console.log("viewshed shares: "+JSON.stringify(res.diff.vs)); console.log("plateau differs: "+JSON.stringify(res.diff.plateau)+"; separation differs: "+JSON.stringify(res.diff.sep));
  res.diff.know.slice(0,60).forEach(d=>console.log("  "+d.reading+" "+String(Math.floor(d.clock/60)).padStart(2,"0")+":"+String(d.clock%60).padStart(2,"0")+" "+d.id+": "+d.before+" -> "+d.after));
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
