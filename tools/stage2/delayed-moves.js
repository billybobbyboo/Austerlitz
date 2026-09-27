#!/usr/bin/env node
/* Chronology data task, owner decision 46: what the interface shows while a formation's dated move has not yet begun,
   or is still under way, inside its phase. Reads the built page; changes nothing.
   node tools/stage2/delayed-moves.js [build.html] [--json out.json] [--shots dir]
   For each state: the clock, the selected formation's compact card and full dossier (status pill, "Doing now", the
   "From hh:mm" row, the timing pill and rows, the "What it was doing" list), the counter's status, the Watch view's
   selection chip, and the dispatch's "What changed" list; optionally a screenshot of each state. */
const fs=require("fs"), path=require("path");
const {launch,open,settle,ROOT}=require("./page.js");
const args=process.argv.slice(2), html=args[0]&&!args[0].startsWith("--")?path.resolve(args[0]):path.join(ROOT,"austerlitz-command-map.html");
const opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const STATES=[
  {n:"gqg-waiting",   id:"gqg",       t:690, pres:"study", why:"phase 6 has opened (11:15); the move to Stare Vinohrady is dated c. 12:00"},
  {n:"gqg-moving",    id:"gqg",       t:740, pres:"study", why:"on the march, 12:00-12:40"},
  {n:"bag-waiting",   id:"bag",       t:930, pres:"study", why:"phase 8 has opened (14:30); the withdrawal on Rausnitz is dated c. 16:30"},
  {n:"bag-moving",    id:"bag",       t:996, pres:"study", why:"withdrawing, 16:30-16:45"},
  {n:"sth-ph3-start", id:"sthilaire", t:525, pres:"study", why:"Study view at the start of phase 3: the climb begins now"},
  {n:"sth-climbing",  id:"sthilaire", t:540, pres:"study", why:"climbing, 08:45-09:15"},
  {n:"ph7-start",     id:"sthilaire", t:765, pres:"study", why:"Study view at the start of phase 7 (12:45): the wheel is dated 13:00-14:00"},
  {n:"wheel-watch",   id:"sthilaire", t:810, pres:"watch", why:"Watch view during the wheel"}
];
(async()=>{
  const browser=await launch(), page=await open(browser,[1440,900],html);
  const out=[];
  for(const s of STATES){
    const r=await page.evaluate(async(s)=>{
      setMode("terrain"); setPresentation("study");
      setClock(s.t,{instant:true,force:true,camera:false}); for(let n=0;n<4&&typeof tween==="function"&&tween;n++) tween(performance.now()+1e7);
      select("f",s.id); dossierExpanded=false; paintDrawer();
      const txt=q=>{ const e=document.querySelector(q); return e?e.innerText.replace(/\s+/g," ").trim():""; };
      const compact=txt("#drawer-body");
      dossierExpanded=true; paintDrawer();
      const full=txt("#drawer-body");
      const st=(typeof liveStatus==="function"?liveStatus(s.id,curPhase):aggStatus(s.id,curPhase));
      const L=legAt(s.id,clock), pos=posNow(s.id);
      let chip="";
      if(s.pres==="watch"){ dossierExpanded=false; setPresentation("watch"); select("f",s.id); chip=txt("#selchip"); }
      return {clock:fmtClock(clock), phase:curPhase, counterStatus:st, pos:pos&&pos.map(v=>+v.toFixed(1)),
        leg:L&&L.b?{from:L.a.ph,to:L.b.ph,u:+L.u.toFixed(3),w:(L.w||[]).map(fmtClock)}:null,
        compact, full, chip, changes:txt("#d-changes")};
    },s);
    await settle(page);
    const dir=opt("--shots"); if(dir){ fs.mkdirSync(dir,{recursive:true}); await page.screenshot({path:path.join(dir,"delayed-"+s.n+".jpg"),type:"jpeg",quality:80}); }
    out.push(Object.assign({state:s.n,why:s.why},r));
    console.log("== "+s.n+" ("+r.clock+", phase "+r.phase+"): "+s.why);
    console.log("   counter status: "+r.counterStatus+"; leg "+(r.leg?r.leg.from+"->"+r.leg.to+" u "+r.leg.u+" window "+r.leg.w.join("-"):"none")+"; position "+JSON.stringify(r.pos));
    console.log("   compact: "+r.compact.slice(0,420));
    const m=/What it was doing.*?(?=Why it was there|Historical event|What became|$)/.exec(r.full); console.log("   full, What it was doing: "+(m?m[0].slice(0,420):"-"));
    const w=/Where.*?(?=What it was doing|$)/.exec(r.full); console.log("   full, Where: "+(w?w[0].slice(0,520):"-"));
    if(r.chip) console.log("   Watch chip: "+r.chip);
    console.log("   dispatch: "+r.changes.slice(0,520));
  }
  if(page._errors.length) console.log("page errors: "+page._errors.join(" | "));
  const j=opt("--json"); if(j) fs.writeFileSync(j,JSON.stringify(out,null,1));
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
