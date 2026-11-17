/* UI/UX roadmap step 4 (UA-03; owner decision 113): the welcome's place prototyped in the live page (node tools/ux-step4/proto-place.js [build]
   [out.json] [capture prefix]). The build's own card (its rows), placed by a style put into the page (the build is not changed):
   W0 as built (centred over the map, at the foot of the free map);
   W1 the audit's: from 1080 px the rail's column, the whole of it down to the timeline, the dispatch behind it (decision 113 would not hold);
   W2 the rail's column, standing at its foot, as tall as its rows: the rail's head (the title, the tabs, the dispatch's derived reading with its
   tag, decision 119 (a)) above it where it leaves room (decision 113 in part).
   Measured fresh at 1600 x 900, 1366 x 768 and 1280 x 720: the unobstructed share (the harness's), the boxes, whether the card scrolls, whether
   a "derived" tag is on screen and the card's overlap with the dispatch */
"use strict";
const path=require("path"), fs=require("fs"), L=require("./lib.js");
const html=path.resolve(process.argv[2]||"austerlitz-command-map.html"), out=process.argv[3]||null, cap=process.argv[4]||null;
const PLACE={
  W0:"",
  W1:"body.docked #firstrun{left:0;top:0;bottom:var(--tb);transform:none;width:var(--rail);box-sizing:border-box;overflow-y:auto;border:0;border-right:1px solid var(--line-2);box-shadow:none;padding:22px 18px 16px}",
  W2:"body.docked #firstrun{left:0;top:auto;bottom:var(--tb);transform:none;width:var(--rail);box-sizing:border-box;max-height:calc(100vh - var(--tb));overflow-y:auto;border:0;border-top:1px solid var(--line-2);border-right:1px solid var(--line-2);box-shadow:0 -12px 30px rgba(0,0,0,.45);padding:18px 18px 14px}"
};
/* added after the first run (W1 at 1366 x 768 cannot reach 0.70 with the tools and the timeline standing): W1t, W1 with the tools and the
   presentation switch standing down while the card stands (they are inert under the modal card already, decision 117); W1tb, W1t with the
   timeline standing down too; W2c, W2 with the rows' prose at the interface's 12.5 px */
PLACE.W1t=PLACE.W1+"body.docked.firstrun-on .tools,body.docked.firstrun-on #viewmode{display:none}";
PLACE.W1tb=PLACE.W1t+"body.docked.firstrun-on .timebar{display:none}body.docked.firstrun-on #firstrun{bottom:0}";
PLACE.W2c=PLACE.W2+"body.docked #firstrun .fr-row p{font-size:13px;line-height:1.5}body.docked #firstrun h2{font-size:var(--t-h3)}";
const ONLY=(process.env.ONLY||"").split(",").filter(Boolean); if(ONLY.length) Object.keys(PLACE).forEach(k=>{ if(ONLY.indexOf(k)<0) delete PLACE[k]; });
const VPS=[[1600,900],[1366,768],[1280,720]];
(async()=>{ const b=await L.launch(), R={build:L.buildInfo(html), places:PLACE, results:{}};
  for(const k of Object.keys(PLACE)){ R.results[k]={};
    for(const v of VPS){ const p=await L.open(b,html,{vp:v}), n=v.join("x");
      if(PLACE[k]) await p.addStyleTag({content:PLACE[k]}); await p.evaluate(()=>{ syncViewOffset(true); requestRender(4); }); await L.settle(p,8);
      const r=await L.boxes(p);
      r.cardScrolls=await p.evaluate(()=>{ var e=document.getElementById("firstrun"); return e.scrollHeight>e.clientHeight+1?e.scrollHeight-e.clientHeight:0; });
      r.buttonsInView=await p.evaluate(()=>["fr-tour","fr-close","fr-grades"].map(function(id){ var e=document.getElementById(id), c=document.getElementById("firstrun").getBoundingClientRect(), q=e.getBoundingClientRect(); return q.top>=c.top-0.5&&q.bottom<=c.bottom+0.5&&q.bottom<=innerHeight; }));
      if(cap) await p.screenshot({path:cap+"-"+k+"-"+n+".png",timeout:300000});
      R.results[k][n]=r; console.log(k,n,"free",r.unobstructed,"card",JSON.stringify(r.card),"scrolls",r.cardScrolls,"buttons",r.buttonsInView.join(","),"derived",r.derivedOnScreen,"overDispatch",r.cardOverDispatch);
      await p.context().close(); } }
  await b.close(); if(out) fs.writeFileSync(out,JSON.stringify(R,null,1)+"\n");
})().catch(e=>{ console.error(e); process.exit(1); });
