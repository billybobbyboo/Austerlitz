#!/usr/bin/env node
/* Final audit (docs/FINAL_AUDIT.md, dimension 6): a map-layer item that is dropped at the view (not drawn) but in the Tab order: is it
   drawn, on screen and named once it has focus and the page has drawn its next frame? At 1600 x 900, the card closed by Esc, the Overview
   at 04:00: every map item focused in turn by Tab from the map layer's group, the page settled after each (AUSTERLITZ_DEBUG.settle), then
   its display, box, whether it is inside the viewport and outside every panel. Measurement only; never beside `npm run check:visual`.
   node tools/audit/mlfocus-probe.js [--json out.json] */
const fs=require("fs");
const L=require("../stage7/lib.js");
const argv=process.argv.slice(2), OUT=argv.includes("--json")?argv[argv.indexOf("--json")+1]:null;
(async()=>{
  const browser=await L.launch(), page=await L.open(browser,[1600,900]);
  await page.keyboard.press("Escape"); await L.settle(page);
  await page.focus("#maplayer"); const out=[];
  for(let i=0;i<40;i++){ await page.keyboard.press("Tab"); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(3));
    const f=await page.evaluate(()=>{ const a=document.activeElement; if(!a||!a.classList||!a.classList.contains("ml-item")) return null;
      const cs=getComputedStyle(a), r=a.getBoundingClientRect();
      const under=[".rail",".timebar",".tools","#viewmode",".legend"].some(s=>{ const p=document.querySelector(s); if(!p) return false; const q=p.getBoundingClientRect();
        return r.left<q.right&&r.right>q.left&&r.top<q.bottom&&r.bottom>q.top&&getComputedStyle(p).display!=="none"; });
      return {name:a.getAttribute("aria-label"),display:cs.display,visibility:cs.visibility,box:[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)],
        inView:r.width>0&&r.right>0&&r.bottom>0&&r.left<innerWidth&&r.top<innerHeight,underPanel:under}; });
    if(!f) break; out.push(f); }
  await browser.close();
  out.forEach(f=>console.log((f.display==="none"||!f.inView?"NOT SHOWN  ":(f.underPanel?"UNDER PANEL":"shown      "))+"  "+f.name.slice(0,70)+"  "+JSON.stringify(f.box)));
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
