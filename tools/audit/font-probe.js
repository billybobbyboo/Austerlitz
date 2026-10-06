#!/usr/bin/env node
/* Final audit (docs/FINAL_AUDIT.md, dimensions 6 and 2.6): which fonts the page is drawn with on this machine, and what that does to the
   harness's narrow-390 case. The type tokens name system font stacks (tokens.js: serif "Iowan Old Style", "Palatino Linotype", Palatino,
   "Book Antiqua", Georgia, serif; sans ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, sans-serif), so the face
   drawn depends on the fonts installed. On a fresh 390 x 844 page as the harness opens it: the platform fonts Chromium used for the
   timeline, the card's title and its key (CDP CSS.getPlatformFontsForNode), the timeline's height, the card's box, the unobstructed fraction;
   then the same page with the sans stack resolved to each of three installed families in turn (a style override in the probe's page only).
   node tools/audit/font-probe.js [--json out.json]. Measurement only; never run it beside `npm run check:visual`. */
const fs=require("fs"), path=require("path");
const L=require("../stage7/lib.js");
const argv=process.argv.slice(2), OUT=argv.includes("--json")?argv[argv.indexOf("--json")+1]:null;
(async()=>{
  const browser=await L.launch(), res={};
  const page=await L.open(browser,[390,844]);
  const cdp=await page.context().newCDPSession(page);
  await cdp.send("DOM.enable"); await cdp.send("CSS.enable");
  const doc=await cdp.send("DOM.getDocument",{depth:-1});
  async function fontsOf(sel){ const q=await cdp.send("DOM.querySelector",{nodeId:doc.root.nodeId,selector:sel}); if(!q.nodeId) return null;
    const f=await cdp.send("CSS.getPlatformFontsForNode",{nodeId:q.nodeId}); return f.fonts.map(x=>x.familyName+" ("+x.glyphCount+")"); }
  res.used={timelineCaption:await fontsOf("#tb-cap"),play:await fontsOf("#play"),phaseStep:await fontsOf("#phases .step"),cardTitle:await fontsOf("#fr-title"),
    cardKey:await fontsOf("#fr-key"),cardPrimary:await fontsOf("#fr-tour")};
  const measure=()=>page.evaluate(()=>{ const m=window.__aus.metrics(), c=document.getElementById("firstrun").getBoundingClientRect();
    return {timeline:m.timeline.height,unobstructed:m.unobstructed,card:[Math.round(c.top*10)/10,Math.round(c.height*10)/10],sans:getComputedStyle(document.body).getPropertyValue("--sans").trim().slice(0,40)}; });
  res.asOpened=await measure();
  res.withSans={};
  for(const fam of ["DejaVu Sans","Liberation Sans","FreeSans"]){
    await page.evaluate(f=>{ let s=document.getElementById("__fontprobe"); if(!s){ s=document.createElement("style"); s.id="__fontprobe"; document.head.appendChild(s); }
      s.textContent=":root{--sans:\""+f+"\",sans-serif !important}"; },fam);
    await page.evaluate(()=>window.dispatchEvent(new Event("resize"))); await L.settle(page);
    res.withSans[fam]=await measure(); }
  await browser.close();
  console.log(JSON.stringify(res,null,1));
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
