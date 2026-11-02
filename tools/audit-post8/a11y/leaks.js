#!/usr/bin/env node
/* Final audit after Stage 8, area a11y: do the project's internal references (roadmap steps, owner questions and decisions, register ids, file
   paths, code names) reach a visitor's screen? The static scan (jargon.js) finds them in visitor strings; this probe shows where they are
   DRAWN: each formation whose timing note carries one, at a clock inside that move's window (its dossier's "Dated by" row); the dossiers whose
   claims' notes carry one ("How this is sourced": the sheet's head); the whole sources sheet. Harness page (no drift; deterministic), 1600 x 900;
   the clock and the selection are SET BY SCRIPT (setClock, select: set-up, not a visitor's input); the text is read as drawn (innerText).
   node tools/audit-post8/a11y/leaks.js */
"use strict";
const L=require("./alib.js");
const RE="roadmap|\\bquestion \\d|\\bdecision \\d|moveMin|docs/|\\bS5\\.\\d|\\bregister\\b|\\bStage \\d|\\bself-test|\\bharness\\b|[a-z]+@\\d|\\bphase-\\d|SOURCE_NOTE|\\bReadings? [A-Z]\\d|\\bC\\d\\.\\d+\\b|\\bT\\d\\.\\d\\b|8[A-L]\\b";
const ONLY_TIMING=process.argv[2]==="timing";   /* the timing notes alone (the first run read a window the data does not have: tm.dep and tm.at are the move's) */
L.run(ONLY_TIMING?"leaks-timing":"leaks",async(b,R,log)=>{
  const p=await L.A.open(b,[1600,900]);
  await p.evaluate(L.INPAGE);
  await L.P(p,()=>{ if(typeof closeFirst==="function") closeFirst("explore"); });
  /* the formations whose timing notes or claim notes carry an internal reference */
  const plan=await L.P(p,re=>{ const rx=new RegExp(re,"i"), out=[];
    for(const id in FORMATIONS){ const f=FORMATIONS[id]; if(!f.track) continue;
      for(const k in f.track){ const a=f.track[k]; if(a&&a.tm&&a.tm.note&&rx.test(a.tm.note)){ const t0=a.tm.dep!=null?a.tm.dep:(a.tm.at!=null?a.tm.at-20:null), t1=a.tm.at!=null?a.tm.at:(t0!=null?t0+20:null); if(t0!=null) out.push({id,k,clock:Math.round((t0+t1)/2),why:"tm.note"}); } } }
    const cl=[]; for(const r in STATEMENT_CLAIMS){ const E=STATEMENT_CLAIMS[r]; if(E&&E.note&&rx.test(E.note)) cl.push(r); }
    return {timing:out,claims:cl}; },RE);
  R.step("plan: timing notes and claim notes with an internal reference",plan);
  const rows=[];
  for(const t of plan.timing){
    const r=await L.P(p,([t,re])=>{ setClock(t.clock); select("f",t.id); AUSTERLITZ_DEBUG.settle(2);
      const more=document.querySelector("#drawer-body .more-btn"); if(more){ more.click(); AUSTERLITZ_DEBUG.settle(2); }   /* the full dossier: the "Dated by" row is dossierFormation's, not the card's */
      const body=document.getElementById("drawer-body"), txt=(body.innerText||"").replace(/\s+/g," ");
      const rx=new RegExp(re,"gi"), hits=[...new Set((txt.match(rx)||[]))];
      const i=txt.indexOf("Dated by"); return {id:t.id,k:t.k,clock:fmtClock(clock),shown:document.getElementById("drawer").classList.contains("on"),hits,datedBy:i>=0?txt.slice(i,i+700):null}; },[t,RE]);
    rows.push(r); }
  R.step("dossiers at a clock inside each move's window: the 'Dated by' row as drawn",{rows});
  await R.shot(p,"dated-by-last-dossier");
  if(ONLY_TIMING) return;
  /* the claim notes: a dossier for each formation named in a claim's ref, its sources sheet opened by its own button */
  const ids=[...new Set(plan.claims.map(r=>(/^FORMATIONS\.(\w+)\./.exec(r)||[])[1]).filter(Boolean))];
  const evs=[...new Set(plan.claims.map(r=>(/^EVENTS\[#([\w-]+)\]/.exec(r)||[])[1]).filter(Boolean))];
  const sheets=[];
  for(const id of ids){
    const r=await L.P(p,([id,re])=>{ setClock(600); select("f",id); AUSTERLITZ_DEBUG.settle(2);
      const b=document.querySelector("#drawer-body .src-head button"); if(b) b.click(); AUSTERLITZ_DEBUG.settle(1);
      const m=document.getElementById("modal-body"), txt=(m.innerText||"").replace(/\s+/g," "), i=txt.indexOf("Tagged in this dossier");
      const head=i>=0?txt.slice(i,i+2500):txt.slice(0,1200), rx=new RegExp(re,"gi");
      const hits=[...new Set((head.match(rx)||[]))]; const ctx=[]; let m2; const rx2=new RegExp(re,"gi"); while((m2=rx2.exec(head))&&ctx.length<6) ctx.push(head.slice(Math.max(0,m2.index-160),m2.index+80));
      closeSources(); return {id,hits,ctx}; },[id,RE]);
    sheets.push(r); }
  for(const id of evs){
    const r=await L.P(p,([id,re])=>{ const e=EVENTS.find(x=>x.id===id); if(!e) return {id,missing:true}; setClock(evClock(e)); select("e",id); AUSTERLITZ_DEBUG.settle(2);
      const b=document.querySelector("#drawer-body .src-head button"); if(b) b.click(); AUSTERLITZ_DEBUG.settle(1);
      const m=document.getElementById("modal-body"), txt=(m.innerText||"").replace(/\s+/g," "), i=txt.indexOf("Tagged in this dossier");
      const head=i>=0?txt.slice(i,i+2500):"", rx=new RegExp(re,"gi"); const hits=[...new Set((head.match(rx)||[]))]; const ctx=[]; let m2; const rx2=new RegExp(re,"gi"); while((m2=rx2.exec(head))&&ctx.length<6) ctx.push(head.slice(Math.max(0,m2.index-160),m2.index+80));
      closeSources(); return {event:id,hits,ctx}; },[id,RE]);
    sheets.push(r); }
  R.step("'How this is sourced' sheets of the dossiers whose claims carry an internal reference: the head as drawn",{sheets});
  /* the whole sources sheet, from the rail's button */
  const whole=await L.P(p,re=>{ select(null,null); openSources(); AUSTERLITZ_DEBUG.settle(1);
    const txt=(document.getElementById("modal-body").innerText||"").replace(/\s+/g," "), rx=new RegExp(re,"gi"), out=[]; let m;
    while((m=rx.exec(txt))&&out.length<60) out.push(txt.slice(Math.max(0,m.index-140),m.index+90));
    const len=txt.length; closeSources(); return {chars:len,hits:out.length,ctx:out}; },RE);
  R.step("the whole sources sheet ('Accuracy and sources'): internal references as drawn",whole);
  R.console=p._log?p._log.slice(0,20):[];
});
