#!/usr/bin/env node
/* Final audit after Stage 8, area "visibility": stills of a long Play run at chosen frames, drawn by the app (WebGL), to judge on the screen what
   the tables count. node tools/audit-post8/visibility/stills.js --run hybrid-0830 --frames 300,640 [--out <dir>] [--plain]
   Each still: the run set up and played on the motion driver's clock without the WebGL draw (long-play.js's set-up, runs.js's options) up to the
   frame, then that frame's next frame drawn by the app with WebGL (renderer.render put back for it), the clock still playing (the layout in
   motion), and captured as JPEG. The audit's annotation, added to the page for the capture only and named on it: a dashed magenta ring at the
   anchor of every formation whose counter or name the layout hides in that frame, with its id. With --plain a second capture without it.
   Measurement only. */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("../lib.js");
const MO=require(path.join(A.ROOT,"tools","visual","motion.js"));
const V=require("./vis-lib.js"), {RUNS}=require("./runs.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const RUN=opt("--run")||"hybrid-0830", FR=(opt("--frames")||"300").split(",").map(Number), OUT=path.resolve(opt("--out")||path.join(A.EVID,"visibility","stills")), PLAIN=argv.includes("--plain");
const ANNOT=function(info){
  var VW=renderer.domElement.clientWidth||innerWidth, VH=renderer.domElement.clientHeight||innerHeight, hid=[], drawn=[], occl=[];
  for(var k in ML.items){ var it=ML.items[k]; if(!it.fid||!/^[cn]:/.test(k)||it.eFrame!==ML.frame) continue;
    if(it.state==="on") drawn.push(it.fid); else if(it.state==="occluded") occl.push(it.fid); else hid.push({id:it.fid, x:it.sx, y:it.sy, held:!!it.held}); }
  var box=document.createElement("div"); box.id="audit-annot"; box.style.cssText="position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:2147483647";
  hid.forEach(function(h){ var r=document.createElement("div"); r.style.cssText="position:absolute;left:"+(h.x-14)+"px;top:"+(h.y-14)+"px;width:24px;height:24px;border:2px dashed #ff00d4;border-radius:50%;box-shadow:0 0 0 1px #fff";
    var l=document.createElement("div"); l.textContent=h.id; l.style.cssText="position:absolute;left:"+(h.x+13)+"px;top:"+(h.y-8)+"px;font:600 11px sans-serif;color:#fff;background:#ff00d4;padding:0 3px;border-radius:2px";
    box.appendChild(r); box.appendChild(l); });
  var lg=document.createElement("div"); lg.textContent="AUDIT ANNOTATION (not the app): dashed rings = formations whose "+(mode==="terrain"?"names":"counters")+" the layout hides in this frame ("+hid.length+"); clock "+info.clock+", Play at "+info.speed+"x, frame "+info.frame+" of run "+info.run;
  lg.style.cssText="position:absolute;left:50%;transform:translateX(-50%);top:6px;font:600 12px sans-serif;color:#fff;background:#ff00d4;padding:3px 8px;border-radius:3px;white-space:nowrap";
  box.appendChild(lg); document.body.appendChild(box);
  return {hidden:hid, drawn:drawn, occluded:occl, clock:clock, playing:playing, moving:MLS.moving, pass:MLS.pass};
};
(async()=>{
  const [spec,o]=RUNS[RUN]; fs.mkdirSync(OUT,{recursive:true});
  const rec=[];
  const settle=async p=>{ await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await p.waitForTimeout(450); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); };
  /* each still on a browser of its own: on this shared machine a page's WebGL context was lost after its first still (the canvas black in the
     next captures, the layer still laid out): an environment failure, avoided by a fresh browser per still */
  let b=null, page=null;
  for(const N of FR){
    if(b) await b.close();
    b=await A.launch(); page=await A.open(b,spec.viewport); page.setDefaultTimeout(0);
    await settle(page); await page.evaluate(()=>closeFirst(null));
    await page.evaluate(()=>{ select(null,null); stopPlay(); var a=document.getElementById("audit-annot"); if(a) a.remove(); });
    await page.evaluate(s=>window.__aus.apply(s),spec);
    await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(90,true));
    await page.evaluate(MO.inPage); await page.evaluate(V.ACC);
    await page.evaluate(()=>{ window.__rr=renderer.render; });   /* the real draw, kept before the driver stubs it */
    const a=Object.assign({gl:false,room:false,stat:false,pre:8,rest:30,max:20000,frameMs:1000/30},o,{pauseAt:N});
    const r=await page.evaluate(a=>{ var o=window.__vis.run(a); return {paused:o.paused, n:o.playFrames, t:clock}; },a);
    if(!r.paused) throw new Error("run ended before frame "+N);
    /* the next frame drawn by the app with WebGL, still playing; then the annotation */
    const info=await page.evaluate(x=>{ var stub=renderer.render; renderer.render=window.__rr; window.__md.frame(); renderer.render=stub;
      var h=Math.floor(clock/60), m=Math.floor(clock%60), gl=renderer.getContext();
      return {clock:(h<10?"0":"")+h+":"+(m<10?"0":"")+m, speed:x.speed, frame:x.n+1, run:x.run, glLost:!!(GL&&GL.lost), ctxLost:!!(gl&&gl.isContextLost&&gl.isContextLost()), calls:renderer.info.render.calls}; },{speed:a.speed,n:r.n,run:RUN});
    await page.waitForTimeout(300);
    if(info.glLost||info.ctxLost||!info.calls) console.log("  frame "+(N+1)+": the WebGL frame was not drawn (context lost "+info.ctxLost+", GL.lost "+info.glLost+", draw calls "+info.calls+"): an environment failure; console "+JSON.stringify(A.errors(page).slice(-3)));
    let plain=null;
    if(PLAIN){ plain=path.join(OUT,RUN+"-f"+(N+1)+"-plain.jpg"); await A.jpeg(page,plain,82); }
    const det=await page.evaluate(ANNOT,info);
    const file=path.join(OUT,RUN+"-f"+(N+1)+".jpg"); await A.jpeg(page,file,82);
    await page.evaluate(()=>{ var a=document.getElementById("audit-annot"); if(a) a.remove(); window.__md.stop(); stopPlay(); setCommandView("none"); select(null,null); });
    rec.push(Object.assign({run:RUN, frame:N+1, file:path.relative(A.ROOT,file), plain:plain?path.relative(A.ROOT,plain):null},info,det));
    console.log(RUN+" frame "+(N+1)+" clock "+info.clock+": hidden by the layout "+det.hidden.map(h=>h.id).join(", ")+" ("+det.hidden.length+"), drawn "+det.drawn.length+", behind the ground "+det.occluded.length);
  }
  const jf=path.join(OUT,RUN+"-stills.json"); let prev=[]; if(fs.existsSync(jf)) prev=JSON.parse(fs.readFileSync(jf,"utf8")).filter(x=>!rec.some(y=>y.frame===x.frame));
  fs.writeFileSync(jf,JSON.stringify(prev.concat(rec).sort((p,q)=>p.frame-q.frame),null,1));
  if(b) await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
