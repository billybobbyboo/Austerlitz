#!/usr/bin/env node
/* Final audit after Stage 8, area "interaction": every scenario record's checks in one table (docs/audit-post8-evidence/interaction/summary.json
   and a text table on stdout): scenario, check, as expected or not, what was expected, a compact observation. Reads only the records. */
"use strict";
const fs=require("fs"), path=require("path");
const EV=path.join(__dirname,"..","..","..","docs","audit-post8-evidence","interaction");
const files=fs.readdirSync(EV).filter(f=>/^s\d+[a-z]?-.*\.json$/.test(f)&&!/summary|result/.test(f)).sort((a,b)=>parseInt(a.slice(1))-parseInt(b.slice(1))||a.localeCompare(b));
const out=[];
for(const f of files){ let j; try{ j=JSON.parse(fs.readFileSync(path.join(EV,f),"utf8")); }catch(e){ continue; }
  if(!j.checks) continue;
  const logs=(j.steps||[]).flatMap(s=>(s.log||[]).map(l=>Object.assign({step:s.label},l)));
  const errs=(j.steps||[]).filter(s=>s.error).map(s=>({step:s.label,error:s.error}));
  out.push({file:f, name:j.name, md5:j.build&&j.build.md5, started:j.started, ms:j.ms, pages:(j.pages||[]).map(p=>p.kind+" "+p.size.join("x")+" boot "+Math.round((p.bootMs||0)/1000)+" s"),
    checks:j.checks.map(c=>({id:c.id,ok:c.ok,expected:c.expected,observed:JSON.stringify(c.observed).slice(0,300)})), stepErrors:errs, console:logs, fatal:j.fatal||null}); }
fs.writeFileSync(path.join(EV,"summary.json"),JSON.stringify(out,null,1));
for(const r of out){ const bad=r.checks.filter(c=>!c.ok);
  console.log(r.file+"  "+r.checks.length+" checks, "+bad.length+" not as expected, "+r.stepErrors.length+" step errors, "+r.console.length+" console messages"+(r.fatal?", FATAL":"")+"  ["+r.md5+"] "+r.pages.join("; "));
  bad.forEach(c=>console.log("   NOT  "+c.id+"  | "+c.observed.slice(0,160)));
  r.stepErrors.forEach(e=>console.log("   STEP ERROR  "+e.step.slice(0,70)+" | "+e.error.slice(0,120))); }
