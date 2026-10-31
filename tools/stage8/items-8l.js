#!/usr/bin/env node
/* Stage 8, the integration pass (question 267; docs/STAGE8_SPEC.md section 22): where the motion block's counts moved between two builds, item
   by item. On a page of its own per build (as tools/stage8/motion-8h.js opens it), the block's driven runs (motion.js blockRuns, the self-test's:
   the 16, the two with a selection, the three under a reading, the finger's pan; not the runs by real input or their twins), each run's jumps and
   pops by item and frame; then, run by run, the items whose counts differ between the builds. And the Play runs' formations hidden by the layout
   (each formation's longest stretch in view and not drawn, by frame: drawn, hidden with or without room for the full search, behind the ground,
   off the screen), with, on the second build, each re-placement pass of the hybrid view's Play: the items that came back and those that left in
   it, and for the formations hidden longest the place the full search would give them in the room left (tried and undone).
   node tools/stage8/items-8l.js <before.html> <after.html> [--json out.json] [--md out.md]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const L=require("./lib.js"), TR=require(path.join(L.ROOT,"tools","visual","three-route.js")), MO=require(path.join(L.ROOT,"tools","visual","motion.js"));
const MEASURE=fs.readFileSync(path.join(L.ROOT,"tools","visual","measure.js"),"utf8");
const OUT=opt("--json"), MD=opt("--md"), builds=argv.filter((a,i)=>a.endsWith(".html")&&!["--json","--md"].includes(argv[i-1])).map(a=>path.resolve(a));
if(builds.length!==2){ console.error("two builds: <before.html> <after.html>"); process.exit(2); }
function perItem(F){ const ev={}, inView=s=>s&&s.st!=="offscreen"&&s.st!=="panel";
  for(let f=1;f<F.length;f++){ const A=F[f].items, P=F[f-1].items;
    new Set(Object.keys(A).concat(Object.keys(P))).forEach(k=>{ const a=P[k], b=A[k]; if(!a||!b||!inView(a)||!inView(b)) return;
      const aOn=a.st==="on", bOn=b.st==="on";
      if(aOn&&bOn){ if(Math.hypot((b.x-b.sx)-(a.x-a.sx),(b.y-b.sy)-(a.y-a.sy))>3) (ev[k]=ev[k]||{j:[],p:[]}).j.push(f); }
      else if(aOn!==bOn) (ev[k]=ev[k]||{j:[],p:[]}).p.push(f+(bOn?"+":"-")); }); }
  return ev; }
/* each formation's frames in a run: # drawn, r hidden by the layout with room for the full search, h hidden without, t behind the ground,
   o off the screen or under a panel, L out of the layer (its level of detail) */
function hidden(F){ const keyOf=(A,id)=>A["c:"+id]?"c:"+id:A["n:"+id]?"n:"+id:null, fids=new Set(), out={};
  F.forEach(fr=>Object.keys(fr.items).forEach(k=>{ const s=fr.items[k]; if(s.fid&&(k.startsWith("c:")||k.startsWith("n:"))) fids.add(s.fid); }));
  fids.forEach(fid=>{ let run=0, best=0, from=-1, cur=-1; const h=F.map((fr,f)=>{ const k=keyOf(fr.items,fid), s=k?fr.items[k]:null;
      const c=!s?"L":(s.st==="offscreen"||s.st==="panel")?"o":s.st==="occluded"?"t":s.st==="on"?"#":(s.room?"r":"h");
      if(c==="h"||c==="r"){ if(!run) cur=f; run++; if(run>best){ best=run; from=cur; } } else run=0; return c; }).join("");
    out[fid]={longestFrames:best, from:from, frames:h}; });
  return out; }
async function open(browser,html){
  const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
  await TR.routeThree(page); await page.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(page);
  await page.evaluate(MEASURE); await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  return page; }
(async()=>{
  const t0=Date.now(), R={builds:builds.map(b=>({build:path.basename(b), md5:crypto.createHash("md5").update(fs.readFileSync(b)).digest("hex")})), runs:{}, play:{}};
  const settle=async p=>{ await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await p.waitForTimeout(450); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); };
  const per=[];
  /* each build in a browser of its own, as the block runs (its page the browser's first: with the two in one browser the second build's
     hybrid-glide drew 1,157 formation-frames where every run of the block draws 1,152, the same jumps and pops) */
  for(let bi=0;bi<2;bi++){ const browser=await L.launch(); R.chromium=browser.version(); const page=await open(browser,builds[bi]); await settle(page); await page.evaluate(()=>closeFirst(null));
    const B={}; let vp=null;
    for(const RR of MO.blockRuns(true)){ if(RR.real||RR.point) continue; const [id,view,kind,n,amt]=RR.m, X=RR.extra||{}, V=MO.VIEWS[view];
      const key=MO.runKey({id,select:RR.sel||null,reading:X.reading||null,touch:!!X.touch});
      if(!vp||vp[0]!==V.viewport[0]||vp[1]!==V.viewport[1]){ vp=V.viewport; await page.setViewportSize({width:vp[0],height:vp[1]});
        await page.waitForFunction(([w,h])=>window.innerWidth===w&&window.innerHeight===h&&Math.abs(landCam.aspect-w/h)<1e-9&&(typeof PHONE==="undefined"||PHONE===window.matchMedia(PHONE_Q).matches),[vp[0],vp[1]],{timeout:60000,polling:50});
        await settle(page); }
      await page.evaluate(()=>{ select(null,null); stopPlay(); }); await page.evaluate(s=>window.__aus.apply(s),V); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(90,true)); await page.evaluate(MO.inPage);
      const A={kind,n,amt,gl:false,room:kind==="play",select:RR.sel||null,rest:30,pre:8,reading:X.reading||null,touch:!!X.touch};
      /* the hybrid view's Play on the second build: each pass's returns and departures, and the starved formations' place in the room left */
      if(bi===1&&key==="hybrid-play") await page.evaluate(()=>{ window.__log=[]; var orig=window.mlLayout; window.__origLayout=orig;
        window.mlLayout=function(){ var r=orig.apply(this,arguments), on={}; for(var k in ML.items){ var it=ML.items[k]; if(it.eFrame===ML.frame&&it.state==="on") on[k]=1; }
          window.__log.push({pass:MLS.pass, moving:MLS.moving, strat:MLS.moving?"hold":MLS.fromMotion?"persist":"build", on:on}); return r; }; });
      const r=await page.evaluate(new Function("a","return ("+MO.RUN.toString()+")(a);"),A);
      const M=MO.measure(r.F,{restFrom:r.restFrom});
      B[key]={jumps:M.jumps, pops:M.pops, lod:M.lod, flicker:M.flicker, drawn:M.track.all.on, inView:M.track.all.on+M.track.all.terrain+M.track.all.placement, longestMs:M.track.all.longestMs, ev:perItem(r.F)};
      if(kind==="play"){ B[key].hidden=hidden(r.F); }
      if(bi===1&&key==="hybrid-play"){ const log=await page.evaluate(()=>{ window.mlLayout=window.__origLayout; return window.__log; });
        B[key].passes=[]; log.forEach((q,i)=>{ if(!i) return; const p=log[i-1]; const back=Object.keys(q.on).filter(k=>!p.on[k]), left=Object.keys(p.on).filter(k=>!q.on[k]);
          if(q.pass&&q.moving) B[key].passes.push({pass:i, strategy:q.strat, cameBack:back, left:left}); }); }
      console.log(path.basename(builds[bi]).padEnd(26)+key.padEnd(20)+" jumps "+B[key].jumps+" pops "+B[key].pops+" drawn "+B[key].drawn+" of "+B[key].inView+", longest hidden "+B[key].longestMs+" ms"); }
    per.push(B); await page.close(); await browser.close(); }
  /* run by run, the items whose counts differ */
  const [A0,B0]=per, net={};
  Object.keys(B0).forEach(k=>{ const a=A0[k], b=B0[k]; if(!a) return; const d={};
    new Set(Object.keys(a.ev).concat(Object.keys(b.ev))).forEach(it=>{ const x=a.ev[it]||{j:[],p:[]}, y=b.ev[it]||{j:[],p:[]};
      if(x.j.length!==y.j.length||x.p.length!==y.p.length){ d[it]={jumps:[x.j.length,y.j.length], pops:[x.p.length,y.p.length]};
        if(!/[+]/.test(k)){ const t=net[it]||(net[it]={jumps:0,pops:0}); t.jumps+=y.j.length-x.j.length; t.pops+=y.p.length-x.p.length; } } });
    R.runs[k]={before:{jumps:a.jumps,pops:a.pops,drawn:a.drawn,inView:a.inView,longestMs:a.longestMs}, after:{jumps:b.jumps,pops:b.pops,drawn:b.drawn,inView:b.inView,longestMs:b.longestMs}, items:d}; });
  const sixteen=Object.keys(B0).filter(k=>!/[+]/.test(k)), tot=(P,k)=>sixteen.reduce((s,r)=>s+P[r][k],0);
  R.totals={before:{jumps:tot(A0,"jumps"),pops:tot(A0,"pops")}, after:{jumps:tot(B0,"jumps"),pops:tot(B0,"pops")}};
  R.netByItem=Object.fromEntries(Object.entries(net).sort((p,q)=>(Math.abs(q[1].jumps)+Math.abs(q[1].pops))-(Math.abs(p[1].jumps)+Math.abs(p[1].pops))));
  R.itemsChanged=Object.keys(net).length; R.runsChanged=sixteen.filter(k=>Object.keys(R.runs[k].items).length).length;
  ["hybrid-play","paper-play","land-play"].forEach(k=>{ R.play[k]={before:A0[k].hidden, after:B0[k].hidden, passes:B0[k].passes||null}; });
  R.secs=Math.round((Date.now()-t0)/1000);
  console.log("the 16: "+JSON.stringify(R.totals)+"; "+R.itemsChanged+" items changed their counts in "+R.runsChanged+" of the 16 runs ("+R.secs+" s)");
  const top=k=>Object.entries(R.play[k].after).sort((p,q)=>q[1].longestFrames-p[1].longestFrames).slice(0,4);
  top("hybrid-play").forEach(([f,x])=>console.log("  hybrid-play after: "+f.padEnd(12)+" hidden "+x.longestFrames+" frames from "+x.from+"  "+x.frames));
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(R,null,1)); }
  if(MD){ const l=["# The motion block's counts item by item: "+R.builds[0].build+" against "+R.builds[1].build,"",
      "Made by `tools/stage8/items-8l.js` (Chromium "+R.chromium+"). The 16's totals: jumps "+R.totals.before.jumps+" to "+R.totals.after.jumps+", pops "+R.totals.before.pops+" to "+R.totals.after.pops+"; "+R.itemsChanged+" items changed their counts in "+R.runsChanged+" of the 16 runs.","",
      "| run | jumps | pops | formations drawn of in view | longest hidden (ms) | items changed |","|---|---|---|---|---|---|"];
    sixteen.forEach(k=>{ const x=R.runs[k]; l.push("| "+k+" | "+x.before.jumps+" to "+x.after.jumps+" | "+x.before.pops+" to "+x.after.pops+" | "+x.before.drawn+"/"+x.before.inView+" to "+x.after.drawn+"/"+x.after.inView+" | "+x.before.longestMs+" to "+x.after.longestMs+" | "+Object.keys(x.items).length+" |"); });
    l.push("","Net change by item over the 16 (jumps, pops), the largest first:","");
    Object.entries(R.netByItem).slice(0,20).forEach(([k,v])=>l.push("- `"+k+"`: "+(v.jumps>=0?"+":"")+v.jumps+", "+(v.pops>=0?"+":"")+v.pops));
    l.push("","The hybrid view's Play on the second build: the formations hidden longest (frame by frame: # drawn, r hidden with room for the full search, h hidden without, t behind the ground, o off the screen, L out of the layer):","","```");
    top("hybrid-play").forEach(([f,x])=>l.push(f.padEnd(12)+" "+String(x.longestFrames).padStart(4)+" "+x.frames)); l.push("```","","Its re-placement passes (each: the items that came back, those that left):","");
    (R.play["hybrid-play"].passes||[]).forEach(p=>l.push("- frame "+p.pass+" ("+p.strategy+"): back "+(p.cameBack.join(", ")||"none")+"; left "+(p.left.join(", ")||"none")));
    fs.writeFileSync(MD,l.join("\n")+"\n"); }
})().catch(e=>{ console.error(e); process.exit(1); });
