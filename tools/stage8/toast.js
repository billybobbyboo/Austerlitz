#!/usr/bin/env node
/* Stage 8 Part A (docs/STAGE8_SPEC.md section 9.4): the phase's toast against the view switch. One phase carries a message (phase 3, 08:45,
   PHASES[3].flash), shown by flash() when the clock enters the phase other than instantly (setClock: Play, the rail's keys, a phase's
   button). In Study and in Watch at 1600 x 900, 1366 x 768 and 1280 x 720: the clock at 08:40, the time rail focused and PageDown pressed (a
   real key: the next phase's start), then (the toast's hiding timer cleared, so that the slow capture still shows it) the toast's and the
   switch's boxes, their overlap, their opacity
   and their z-index (the toast takes no pointer, so elementFromPoint cannot tell which is drawn over the other: both are fixed in the
   page's root stacking context, the higher z-index drawn over the lower), and a capture of the screen's top.
   node tools/stage8/toast.js [--json file] [--cases 1280x720-study,...] [--merge]   Measurement only. The JSON is written after each case;
   --merge keeps an earlier run's cases of the same build. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const JSONF=opt("--json")||path.join(L.EVID8,"toast.json"), OUT=path.join(L.EVID8,"toast");
(async()=>{
  const browser=await L.launch(), res={build:require("crypto").createHash("md5").update(fs.readFileSync(path.join(L.ROOT,"austerlitz-command-map.html"))).digest("hex"), cases:{}};
  if(argv.includes("--merge")&&fs.existsSync(JSONF)){ const old=JSON.parse(fs.readFileSync(JSONF,"utf8")); if(old.build===res.build) Object.assign(res.cases,old.cases); }
  const ONLY=opt("--cases")?opt("--cases").split(","):null;
  for(const vp of [[1600,900],[1366,768],[1280,720]]) for(const pres of ["study","watch"]){
    if(ONLY&&!ONLY.includes(vp.join("x")+"-"+pres)) continue;
    const page=await L.open(browser,vp);
    await L.applyCase(page,{viewport:vp, t:520, presentation:pres, mode:"terrain", cam:[-195,92,156,-33,4,-2]});
    await page.evaluate(()=>document.getElementById("timerail").focus());
    await page.keyboard.press("PageDown");
    await page.waitForTimeout(300);   /* L.open turns CSS transitions off: the toast is at full opacity at once */
    /* the toast hides itself after 3.4 s, and a software-rendered capture can take longer: its timer is cleared so the capture shows it as
       a visitor sees it in those 3.4 s (the one change this probe makes to the page) */
    const timed=await page.evaluate(()=>{ const had=!!flash._t; clearTimeout(flash._t); return had; });
    const r=await page.evaluate(()=>{
      const t=document.getElementById("toast"), v=document.getElementById("viewmode"), a=t.getBoundingClientRect(), b=v.getBoundingClientRect();
      const box=q=>({x:Math.round(q.left), y:Math.round(q.top), w:Math.round(q.width), h:Math.round(q.height)});
      const ox=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left)), oy=Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
      const st=getComputedStyle(t), sv=getComputedStyle(v);
      return {clock:Math.round(clock), phase:curPhase, text:t.textContent, toastOn:t.classList.contains("on"), toast:box(a), toastOpacity:+st.opacity, toastZ:st.zIndex,
        switchBox:box(b), switchOpacity:+sv.opacity, switchZ:sv.zIndex, switchPosition:sv.position,
        overlap:{w:Math.round(ox), h:Math.round(oy), px:Math.round(ox*oy), shareOfToast:+(ox*oy/Math.max(1,a.width*a.height)).toFixed(3)}};
    });
    const id=vp.join("x")+"-"+pres;
    const x0=Math.max(0,Math.min(r.toast.x,r.switchBox.x)-24), x1=Math.min(vp[0],Math.max(r.toast.x+r.toast.w,r.switchBox.x+r.switchBox.w)+24);
    await L.jpeg(page,path.join(OUT,id+".jpg"),90,{x:x0,y:0,width:x1-x0,height:Math.min(vp[1],Math.max(r.toast.y+r.toast.h,r.switchBox.y+r.switchBox.h)+20)});
    r.timerCleared=timed; res.cases[id]=r;
    console.log(id.padEnd(16),"toast",r.toastOn?"on":"off",JSON.stringify(r.toast),"switch",JSON.stringify(r.switchBox),r.switchPosition,"overlap",JSON.stringify(r.overlap),"z",r.toastZ,"under",r.switchZ);
    await page.close();
    fs.writeFileSync(JSONF,JSON.stringify(res,null,1));
  }
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
