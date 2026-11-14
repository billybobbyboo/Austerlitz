#!/usr/bin/env node
/* The closing re-verification pass: two presentation fixes no check holds, verified in the page (measurement only; nothing is changed).
   CL-HIS-12 (WP-01): the Command tab marks a row DOCUMENTED only where its statement's claim rests on a reading (fact, attributed,
     disputed); any other documented row carries its claim's tag. Read: every Command row of both headquarters at every phase, as painted
     (paintCommand into #cmdbody), each row's DOCUMENTED label against its statement's claim (stmtClaim).
   CL-SRC-06 (WP-02): the headline strength says what it is wherever it is shown: "this map's working figure" for a formation's own figure,
     "derived: the sum of its formations" otherwise. Read: every formation's compact card and full dossier (compactCard, dossierFormation) at
     09:30, each strength row's words.
   A page at 1600 x 900, the build by default (file://, ?harness=1), Chromium as the harness runs it.
   node tools/closing/page-probe.js [build.html] [--json out.json]   Exit 1 if either fix is not as WP-01 and WP-02 describe. */
"use strict";
const fs=require("fs"), path=require("path");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..",".."), TR=require(path.join(ROOT,"tools","visual","three-route.js"));
const { chromium } = require("playwright");
const html=path.resolve(argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json")||path.join(ROOT,"austerlitz-command-map.html")), OUT=opt("--json");
(async()=>{
  const b=await chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
  const p=await (await b.newContext({viewport:{width:1600,height:900}})).newPage(), errs=[];
  p.on("pageerror",e=>errs.push(e.message));
  await TR.routeThree(p); await p.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:120000}); await TR.waitBoot(p,240000);
  const r=await p.evaluate(()=>{
    if(typeof closeFirst==="function") closeFirst(null);
    const out={command:{rows:0,documented:0,documentedUnread:0,readNotDocumented:0,tagged:0,examples:[]}, strength:{rows:0,tagged:0,untagged:[],kinds:{}}};
    /* CL-HIS-12 */
    ["fr","al"].forEach(side=>{ setCommandView(side);
      PHASES.forEach((P,i)=>{ setClock(P.t0+1,{instant:true,force:true}); paintCommand();
        const book=COMMAND[side]||{}; let ph=-1; for(let k=curPhase;k>=0;k--){ if(book[k]){ ph=k; break; } } if(ph<0) return;
        const rows=[...document.querySelectorAll("#cmdbody .cmdrow")];
        rows.forEach((row,j)=>{ const it=book[ph][j]; if(!it) return; const ref='COMMAND.'+side+'["'+ph+'"]['+j+']', cl=stmtClaim(ref).cl, k=srcKind(it[1]);
          const doc=!!row.querySelector(".src.doc"), read=["fact","attributed","disputed"].indexOf(cl)>=0;
          out.command.rows++; if(doc) out.command.documented++;
          if(doc&&!read){ out.command.documentedUnread++; if(out.command.examples.length<6) out.command.examples.push(ref+" "+cl+" shown DOCUMENTED"); }
          if(k==="doc"&&read&&!doc) out.command.readNotDocumented++;
          if(k==="doc"&&!read&&!doc) out.command.tagged++; }); }); });
    setCommandView("none");
    /* CL-SRC-06 */
    setClock(570,{instant:true,force:true});
    Object.keys(FORMATIONS).forEach(id=>{
      [["card",()=>compactCard(id)],["dossier",()=>dossierFormation(id)]].forEach(([where,fn])=>{ let el; try{ el=fn(); }catch(e){ return; } if(!el) return;
        const t=(el.textContent||"").replace(/\s+/g," "); const m=t.match(/(Approximate strength|Strength)[^≈]*≈ ?[\d,–]+ men[^)]*\)?/);
        if(!m) return; out.strength.rows++;
        const kind=/this map.s working figure/.test(m[0])?"working":/derived: the sum of its formations/.test(m[0])?"derived":/working/.test(m[0])?"working (range)":null;
        if(kind){ out.strength.tagged++; out.strength.kinds[kind]=(out.strength.kinds[kind]||0)+1; } else out.strength.untagged.push(where+" "+id+": "+m[0].slice(0,90)); }); });
    return out; });
  await b.close(); r.build=path.basename(html); r.md5=require("crypto").createHash("md5").update(fs.readFileSync(html)).digest("hex"); r.errors=errs;
  const C=r.command, S=r.strength;
  console.log("CL-HIS-12, the Command tab: "+C.rows+" rows read at every phase of both headquarters; "+C.documented+" shown DOCUMENTED; "+C.documentedUnread+
    " DOCUMENTED on a claim not resting on a reading; "+C.readNotDocumented+" documented rows on a read claim not shown DOCUMENTED; "+C.tagged+" documented rows carrying their claim's tag");
  C.examples.forEach(x=>console.log("  "+x));
  console.log("CL-SRC-06, the headline strengths: "+S.rows+" strength rows in the cards and dossiers at 09:30; tagged "+S.tagged+" "+JSON.stringify(S.kinds)+"; untagged "+S.untagged.length);
  S.untagged.slice(0,8).forEach(x=>console.log("  "+x));
  console.log("build "+r.build+" md5 "+r.md5+"; page errors "+errs.length);
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(r,null,1));
  process.exit(C.rows&&!C.documentedUnread&&!C.readNotDocumented&&S.rows&&!S.untagged.length&&!errs.length?0:1);
})().catch(e=>{ console.error(e); process.exit(2); });
