#!/usr/bin/env node
/* The final audits' Stage 6, WP-10 (CL-VIS-01): the gait-on-the-ground check's cases beyond H_TOL, listed with their formation, clock and error. A copy of
   the build is patched to record every case hRec judges beyond H_TOL (window.__hOver), and AUSTERLITZ_DEBUG.selfTest() run on a fresh page.
   node tools/final-stage6/gait-cases.js <build.html> <out.json>. Measurement only. */
"use strict";
const fs=require("fs"),path=require("path");
const L=require(path.join(__dirname,"..","stage8","lib.js"));
const A="function hRec(key,r,where,px){ var s=HS[key]||(HS[key]={a:[],w:0,where:\"\",rest:0,lift:[],px:0,pxWhere:\"\"}); var a=Math.abs(r[0]);";
const B=A+" var _P=key.split(\"|\"), _T=_P[0]===\"4\"?0.03:0.03*GEOREF.EXAG/4; if(a>_T) (window.__hOver=window.__hOver||[]).push(key+\" \"+where.replace(/ \\(playing\\)| \\(paused\\)/,'')+\" \"+a.toFixed(3));";
(async()=>{
  const src=fs.readFileSync(process.argv[2],"utf8"); if(src.split(A).length!==2) throw new Error("patch");
  const f=process.argv[2]+".h.html"; fs.writeFileSync(f,src.replace(A,B)); process.env.AUSTERLITZ_HTML=f;
  const b=await L.launch(), p=await L.open(b,[1366,768]);
  const r=await p.evaluate(()=>{ const o=AUSTERLITZ_DEBUG.selfTest(); return {over:window.__hOver||[], fails:o.checks.filter(c=>!c.ok).map(c=>c.name.slice(0,60))}; });
  fs.writeFileSync(process.argv[3],JSON.stringify(r,null,1)); console.log(process.argv[3],r.over.length,"over",r.fails);
  await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
