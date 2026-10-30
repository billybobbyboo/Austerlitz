#!/usr/bin/env node
/* Stage 8, implementation PR 8H (docs/STAGE8_SPEC.md sections 9.6 and 20.5): the phase's message (#toast, PHASES[3].flash at 08:45) against the
   presentation switch (#viewmode) and every other control it could stand over, at every size the harness measures (tools/visual/cases.js: the
   desktop sizes 1600 x 900, 1366 x 768, 1280 x 720 and 1024 x 768, and the phones' 390 x 844, 360 x 800, 430 x 932, 402 x 714 and 844 x 390, each
   phone's page with the harness's device: density 3, touch, its user agent), in Study and in Watch. Each case a fresh page opened as the harness
   opens it (?harness=1, transitions off), the first card closed, the clock at 08:40, the time rail focused and PageDown pressed (a real key: the
   phase's start, 08:45, where the message shows), its hiding timer cleared so that the capture shows it as a visitor sees it in its 3.4 s; then the
   message's box, the switch's (where it is shown), their overlap in px, and every other visible control (a button, a link, an input or an element
   with a role a visitor presses) whose box the message's crosses. Part A's toast.js measured the switch alone, at the three desktop sizes.
   node tools/stage8/toast-8h.js [--html build] [--out file.json] [--shots dir]   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), TR=require("../visual/three-route.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const HTML=path.resolve(opt("--html")||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=opt("--out"), SHOTS=opt("--shots");
const PHONE={ios:{dpr:3, ua:"Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"},
  android:{dpr:3, ua:"Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36"}};   /* harness.js PHONE_DEVICES */
const SIZES=[[1600,900],[1366,768],[1280,720],[1024,768],[390,844,"ios"],[360,800,"android"],[430,932,"ios"],[402,714,"ios"],[844,390,"ios"]];
const md5=f=>require("crypto").createHash("md5").update(fs.readFileSync(f)).digest("hex");
async function openAt(browser,vp,dev){
  const D=dev?PHONE[dev]:null;
  const ctx=await browser.newContext({viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:D?D.dpr:1,hasTouch:!!D,isMobile:false,userAgent:D?D.ua:undefined});
  const page=await ctx.newPage(); page._errors=[]; page.on("pageerror",e=>page._errors.push(e.message));
  await TR.routeThree(page);
  await page.goto("file://"+HTML+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(page,240000,250);
  await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  return {ctx,page};
}
(async()=>{
  const browser=await L.launch(), out={tool:"tools/stage8/toast-8h.js", build:path.relative(L.ROOT,HTML)||HTML, md5:md5(HTML), browser:browser.version(), cases:{}};
  for(const S of SIZES) for(const pres of ["study","watch"]){
    const vp=[S[0],S[1]], id=vp.join("x")+"-"+pres, {ctx,page}=await openAt(browser,vp,S[2]);
    await page.evaluate(p=>{ closeFirst(null); if(playing) stopPlay(); setPresentation(p); setClock(520,{instant:true,force:true}); AUSTERLITZ_DEBUG.settle(10,true); },pres);
    await page.evaluate(()=>{ var r=document.getElementById("timerail"); r.focus(); });
    await page.keyboard.press("PageDown"); await page.waitForTimeout(250);
    const timed=await page.evaluate(()=>{ const had=!!flash._t; clearTimeout(flash._t); return had; });
    const r=await page.evaluate(()=>{
      const t=document.getElementById("toast"), v=document.getElementById("viewmode"), a=t.getBoundingClientRect();
      const box=q=>({x:Math.round(q.left), y:Math.round(q.top), w:Math.round(q.width), h:Math.round(q.height)});
      const shown=e=>{ if(!e) return false; const q=e.getBoundingClientRect(); if(!(q.width>0&&q.height>0)) return false; for(let n=e;n&&n.nodeType===1;n=n.parentElement){ const s=getComputedStyle(n); if(s.display==="none"||s.visibility==="hidden"||+s.opacity===0) return false; } return true; };
      const ov=(p,q)=>{ const ox=Math.max(0,Math.min(p.right,q.right)-Math.max(p.left,q.left)), oy=Math.max(0,Math.min(p.bottom,q.bottom)-Math.max(p.top,q.top)); return Math.round(ox*oy); };
      const vs=shown(v), b=vs?v.getBoundingClientRect():null;
      const others=[]; document.querySelectorAll("button,a[href],input,select,[role=button],[role=tab],[role=slider],[tabindex='0']").forEach(e=>{ if(e===t||t.contains(e)||!shown(e)) return; if(v&&v.contains(e)) return; if(e.closest&&e.closest("#maplayer")) return;   /* the map's own layer and its items: the message is over the map, taking no pointer, for 3.4 s */ const q=e.getBoundingClientRect(), o=ov(a,q); if(o>0) others.push({el:(e.id?"#"+e.id:e.tagName.toLowerCase()+(e.className&&typeof e.className==="string"?"."+e.className.split(" ")[0]:"")), text:(e.getAttribute("aria-label")||e.textContent||"").trim().slice(0,30), px:o}); });
      return {clock:Math.round(clock), phase:curPhase, text:t.textContent, toastOn:t.classList.contains("on"), toast:box(a), switchShown:vs, switchBox:b?box(b):null,
        overlapSwitch:b?ov(a,b):0, overlapOthers:others, phone:typeof PHONE!=="undefined"?PHONE:null, docked:document.body.classList.contains("docked")};
    });
    r.timerCleared=timed; r.pageErrors=page._errors.slice(); out.cases[id]=r;
    if(SHOTS){ fs.mkdirSync(SHOTS,{recursive:true}); const top=Math.min(vp[1],Math.max(r.toast.y+r.toast.h,r.switchBox?r.switchBox.y+r.switchBox.h:0)+24); await page.screenshot({path:path.join(SHOTS,id+".jpg"),type:"jpeg",quality:86,timeout:180000,clip:{x:0,y:0,width:vp[0],height:top}}); }
    console.log(id.padEnd(16), r.toastOn?"on ":"OFF", JSON.stringify(r.toast), "switch", r.switchShown?JSON.stringify(r.switchBox):"not shown", "overlap", r.overlapSwitch, "others", JSON.stringify(r.overlapOthers));
    await ctx.close();
  }
  await browser.close();
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(out,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
