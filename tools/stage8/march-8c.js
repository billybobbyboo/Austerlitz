#!/usr/bin/env node
/* Stage 8, implementation PR 8C, the audit of 8A and 8B, finding B: what a formation's march row says under a reading that does not know it.
   (1) In the page, every minute of the day under each headquarters' reading, every formation on the field the reading does not know whose plotted
   leg gives a march row: the row's name ("Marching", "Next move", or since 8C "Plotted leg") and whether it says where the formation is ("over the
   frozen mere"), counted by reading, name and ice; (2) by real clicks in the live page, under Napoleon's headquarters, the order of battle's row of
   a formation opens its dossier and its full dossier, and its place and march rows are read as shown: Kienmayer's division, the Left Wing Command
   and Dokhturov's column at 16:00 (the first two not known to the reading then, the third seen), Kollowrath's and Langeron's columns at 10:00.
   node tools/stage8/march-8c.js [--json out.json]     (the build: AUSTERLITZ_HTML, else the repository's). Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json");
(async()=>{
  const html=path.resolve(process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html"));
  const browser=await L.launch(), page=await L.open(browser,[1366,768]), res={build:path.basename(html), chromium:browser.version()};
  /* by real clicks, on the page as it opened (the first-run card closed by its own button) */
  await page.click("#fr-close"); await page.waitForTimeout(300);
  await page.click("#tab-command"); await page.waitForTimeout(200);
  await page.click('.cmd-btn[data-cv="fr"]'); await page.waitForTimeout(300);
  res.live=[];
  for(const [t,ids] of [[960,["kienmayer","buxhowden","dok"]],[600,["kollo","lang"]]]){
    await page.evaluate(t=>{ setClock(t,{instant:true,camera:false}); AUSTERLITZ_DEBUG.settle(4); },t);
    for(const id of ids){
      await page.click("#tab-oob"); await page.waitForTimeout(200);
      const sel='#oob .oob-row[data-id="'+id+'"]';
      if(!(await page.locator(sel).count())){ res.live.push({t,id,error:"no order-of-battle row "+sel}); continue; }
      await page.locator(sel).first().click(); await page.waitForTimeout(400);
      const full=page.locator("#drawer button",{hasText:"Full dossier"}); if(await full.count()){ await full.first().click(); await page.waitForTimeout(400); }
      const r=await page.evaluate(id=>{ const d=document.getElementById("drawer-body"), rows=[];
        d.querySelectorAll(".kv").forEach(kv=>{ const dt=kv.querySelector("dt"), dd=kv.querySelector("dd"); if(dt&&dd) rows.push([dt.textContent.trim(),dd.textContent.replace(/\s+/g," ").trim()]); });
        return {reading:commandView, clock:fmtClock(clock), hidden:readHidden(id), drawn:drawnKnow(id), rows:rows.filter(r=>/^(Position|Where|Marching|Next move|Plotted leg)/.test(r[0]))}; },id);
      res.live.push(Object.assign({t,id},r));
      console.log(r.clock,id,r.hidden?"(not known)":"(known)",JSON.stringify(r.rows));
      await page.keyboard.press("Escape"); await page.waitForTimeout(200); } }
  res.enumeration=await page.evaluate(()=>{
    const out={}, by={};
    for(const cv of ["fr","al"]){ setCommandView(cv);
      for(let t=T_MIN;t<=T_MAX;t+=1){ setClock(t,{instant:true,camera:false});
        Object.keys(units).forEach(id=>{ if(sideOfNation(FORMATIONS[id].nation)===cv||!posNow(id)||!readHidden(id)) return;
          const mr=marchRate(id,clock); if(!mr) return;
          const row=marchRow(id), name=(row.match(/<dt>([^<]*)<\/dt>/)||[,"?"])[1], ice=row.indexOf("frozen mere")>=0;
          const k=cv+"|"+id+"|"+name+(ice?"|ice":"");
          if(!out[k]) out[k]={reading:cv, id:id, row:name, saysIce:ice, legOverIce:!!mr.ice, first:fmtClock(t), last:fmtClock(t), minutes:0};
          out[k].last=fmtClock(t); out[k].minutes++;
          const s=cv+" "+name+(ice?" (over the frozen mere)":""); by[s]=(by[s]||0)+1; }); } }
    setCommandView("none");
    return {byRow:by, rows:Object.values(out)}; });
  console.log(JSON.stringify(res.enumeration.byRow));
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
  await page.close(); await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
