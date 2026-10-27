#!/usr/bin/env node
/* Stage 8, implementation PR 8E (decisions 242 (a), 243 (a), 244 (a); docs/STAGE8_SPEC.md section 17): the stills and the clips of the troops,
   before (the 8D build) and after. Each is drawn by the app on a page opened as the harness opens it (?harness=1, software WebGL), the app's own
   loop held (so that nothing between two captures moves the clock or eases the gait), the state set through the app's own functions:
   - a still: the clock set, paused (a marching formation's pose at the clock: the gait full at a paused clock, decision 244 (a)'s rule), the eye
     aimed at a formation (its map position at the clock, a direction and a distance), settled, drawn and captured; on both builds where the 8D
     build draws the same thing;
   - a clip: Play's own stepping at a speed (dwellAdvance, 30 steps a second of the clip, FK 2: the gait's ease as at 30 frames a second), each
     step's blocks posed and seated (updateVisibility), every third step drawn and captured (10 frames a second of the clip, as 8C's clips), the
     eye following the formation (its map position each captured frame, the same direction and distance); a pause is a stretch of steps with the
     clock still (not playing); a speed change a stretch at another speed. Encoded with ffmpeg (H.264, 10 frames a second); where both builds
     are drawn, the two stacked one above the other (8D above, 8E below).
   The views are DESIGN (chosen to show the drawing); the formations and clocks are the data's (gaitLeg: sthilaire marching up the Pratzen at
   5.0 km/h at 09:00; guard_cav at 4.9 km/h at 10:45; heightguns limbered and moving at 3.2 km/h at 14:00, deployed at 10:00).
   node tools/stage8/clips-8e.js --before 8d.html --after 8e.html [--out dir] [--only id,id] [--vp WxH]
   Writes <out>/stills/<id>.png (and <id>-8D.png, <id>-8E.png where both), <out>/clips/<id>.mp4 and a log; measurement code only. */
"use strict";
const fs=require("fs"), path=require("path"), cp=require("child_process"), os=require("os");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const BEFORE=opt("--before"), AFTER=opt("--after")||process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html");
const OUT=path.resolve(opt("--out")||path.join(L.EVID8,"8e")), ONLY=opt("--only")?opt("--only").split(","):null;
const VP=(opt("--vp")||"960x540").split("x").map(Number), SVP=[1280,720];
const DIR=[-0.55,0.42,0.72], SIDE=[0.95,0.22,0.22], LOW=[-0.70,0.16,0.70];
/* stills: [id, note, spec, both builds?] (spec: t, factor, presentation, the aim {id, dir, r}, phone) */
const STILLS=[
  ["infantry", "Saint-Hilaire's division marching up the Pratzen at 09:00, paused (its pose at the clock), 26 units off: the rich kit (8E) against 6C's kit (8D)", {t:540, aim:{id:"sthilaire", dir:DIR, r:26}}, true],
  ["cavalry", "the Guard's cavalry marching at 10:45, paused, 30 units off: riders and horses, rich (8E) against 6C's (8D)", {t:645, aim:{id:"guard_cav", dir:SIDE, r:30}}, true],
  ["artillery-deployed", "the guns on the heights (IV Corps' foot artillery) in action at 10:00, 22 units off: the pieces, the coffret on the limber, the limber, its team and its driver behind each gun (8E) against the guns and crews 8D drew", {t:600, aim:{id:"heightguns", dir:DIR, r:22}}, true],
  ["artillery-limbered", "the same battery limbered and moving at 14:00, paused, 22 units off: team, driver, limber, the piece on its pintle with the coffret between its cheeks (8E) against 8D's", {t:845, aim:{id:"heightguns", dir:SIDE, r:22}}, true],
  ["lod-26", "the level of detail by distance: Saint-Hilaire's division at 09:00, 26 units off (rich)", {t:540, aim:{id:"sthilaire", dir:DIR, r:26}}, false],
  ["lod-110", "110 units off (a man about 21 px: rich)", {t:540, aim:{id:"sthilaire", dir:DIR, r:110}}, false],
  ["lod-180", "180 units off (a man about 13 px: simple)", {t:540, aim:{id:"sthilaire", dir:DIR, r:180}}, false],
  ["slope-10x", "on the slope at 10.33x: Saint-Hilaire's men climbing at 09:00, paused mid-stride, seen low from the side: the planted feet on the drawn ground", {t:540, factor:"model", aim:{id:"sthilaire", dir:LOW, r:18}}, false],
  ["phone", "a phone's page (390 x 844 at density 1, touch, an iPhone's user agent): Saint-Hilaire's division at 09:00, 40 units off", {t:540, phone:true, aim:{id:"sthilaire", dir:DIR, r:40}}, false]
];
/* clips: [id, note, spec, stretches [[speed (0 paused), seconds], ...], both builds?] */
const CLIPS=[
  ["infantry-half", "Saint-Hilaire's division marching up the Pratzen from 09:00 at Play's half speed, 3 s (the eye following it, 26 units off): the gait (8E) against the formation sliding (8D)", {t:540, aim:{id:"sthilaire", dir:DIR, r:26}}, [[0.5,3]], true],
  ["cavalry-half", "the Guard's cavalry from 10:45 at half speed, 3 s, 30 units off", {t:645, aim:{id:"guard_cav", dir:SIDE, r:30}}, [[0.5,3]], false],
  ["artillery-half", "the guns on the heights limbered and moving from 14:00 at half speed, 3 s, 22 units off: the teams' gait and the wheels turning with them", {t:840, aim:{id:"heightguns", dir:SIDE, r:22}}, [[0.5,3]], false],
  ["speeds", "the gait's fade with the speed: Saint-Hilaire's division from 09:00, 40 units off, 1.5 s each at half speed, 1x, 2x and 4x (its men's cycles a second on screen: full to 3.2, none from 4.8, eased between)", {t:540, aim:{id:"sthilaire", dir:DIR, r:40}}, [[0.5,1.5],[1,1.5],[2,1.5],[4,1.5]], false],
  ["pause", "Play at half speed, paused for 1.5 s (the pose held, no stepping), resumed: Saint-Hilaire's division from 09:00, 30 units off", {t:540, aim:{id:"sthilaire", dir:DIR, r:30}}, [[0.5,1.5],[0,1.5],[0.5,1.5]], false],
  ["slope-10x", "at 10.33x on the slope, from the side and low: Saint-Hilaire's division from 09:00 at half speed, 3 s", {t:540, factor:"model", aim:{id:"sthilaire", dir:LOW, r:18}}, [[0.5,3]], false],
  ["phone-half", "a phone's page (390 x 844 at density 1): Saint-Hilaire's division from 09:00 at half speed, 3 s, 40 units off", {t:540, phone:true, aim:{id:"sthilaire", dir:DIR, r:40}}, [[0.5,3]], false]
];
const IOS="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
/* in the page: hold the app's loop, set the state, aim */
const SETUP=function(s){
  if(!window.__held){ window.__held=true; window.loop=function(){ requestAnimationFrame(window.loop); }; }   /* the app's own loop held: nothing moves between two captures */
  closeFirst(null); stopPlay(); setPresentation("map");
  if(s.factor) setDisplayFactor(s.factor==="model"?GEOREF.EXAG:s.factor);
  setClock(s.t,{instant:true,force:true,camera:false});
  window.__aimS=s.aim; window.__aimAt=function(){ var a=window.__aimS, p=posNow(a.id), w=W(p[0],p[1]), y=groundY(w[0],w[1]), d=new THREE.Vector3(a.dir[0],a.dir[1],a.dir[2]).normalize().multiplyScalar(a.r);
    tween=null; camArc=null; freeCam=true; curVantage=null; landCam.position.set(w[0]+d.x,y+d.y,w[1]+d.z); orbitTarget.set(w[0],y,w[1]); landCam.lookAt(orbitTarget); clampCamera(); syncViewOffset(true); };
  window.__aimAt(); AUSTERLITZ_DEBUG.settle(40,true); window.__aimAt(); AUSTERLITZ_DEBUG.settle(20,true); renderFrame();
  var u=units[s.aim.id]&&units[s.aim.id].block.userData;
  return {clock:fmtClock(clock), rich:u&&u.lodRich!==undefined?u.lodRich:null, lodPx:u&&u.lodPx?+u.lodPx.toFixed(1):null, amp:u&&u.gait?+u.gait.amp.toFixed(3):null};
};
/* in the page: n steps of Play at speed x (0: the clock still), the last one drawn */
const STEP=function(a){
  var x=a.x, fk=FK; FK=2;
  for(var i=0;i<a.n;i++){ if(x>0){ playing=true; speed=x; DWELL.st=null; setClock(dwellAdvance(1/30,MIN_PER_SEC*speed)); } else playing=false;
    window.__aimAt(); updateVisibility(); }
  playing=false; FK=fk; renderFrame();
  var u=units[window.__aimS.id]&&units[window.__aimS.id].block.userData;
  return {clock:fmtClock(clock), amp:u&&u.gait?+u.gait.amp.toFixed(3):null, rich:u?u.lodRich:null};
};
async function openPage(browser,html,phone,vp){
  process.env.AUSTERLITZ_HTML=html;
  if(!phone){ const p=await L.open(browser,vp,{}); return p; }
  const TR=require(path.join(L.ROOT,"tools","visual","three-route.js"));
  const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,userAgent:IOS});
  const page=await ctx.newPage(); page._phone=true; page._errors=[]; page.on("pageerror",e=>page._errors.push(e.message));
  await TR.routeThree(page); await page.goto("file://"+html+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(page,240000,250);
  await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
  return page;
}
async function closePage(p){ const cx=p.context(); await p.close(); if(p._phone) await cx.close(); }
const ff=a=>{ const r=cp.spawnSync("ffmpeg",["-y","-loglevel","error"].concat(a),{encoding:"utf8"}); if(r.status!==0) throw new Error("ffmpeg: "+r.stderr); };
(async()=>{
  fs.mkdirSync(path.join(OUT,"stills"),{recursive:true}); fs.mkdirSync(path.join(OUT,"clips"),{recursive:true});
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"clips-8e-")), log=[], builds=[["8D",BEFORE],["8E",AFTER]].filter(b=>b[1]).map(b=>[b[0],path.resolve(b[1])]);
  const browser=await L.launch(); log.push("chromium "+browser.version()+"; builds "+builds.map(b=>b[0]+" "+require("crypto").createHash("md5").update(fs.readFileSync(b[1])).digest("hex")).join(", "));
  for(const [id,note,spec,both] of STILLS){
    if(ONLY&&!ONLY.includes(id)) continue;
    const shots=[];
    for(const [lab,html] of builds){ if(!both&&lab!=="8E") continue;
      const page=await openPage(browser,html,spec.phone,SVP); const st=await page.evaluate(SETUP,spec);
      const f=path.join(OUT,"stills",id+(both?"-"+lab:"")+".png"); await page.screenshot({path:f}); shots.push(f); await closePage(page);
      log.push("still "+id+" "+lab+": "+JSON.stringify(st)+" -> "+path.relative(L.ROOT,f)); console.log(log[log.length-1]); }
    if(shots.length===2){ const f=path.join(OUT,"stills",id+".png"); ff(["-i",shots[0],"-i",shots[1],"-filter_complex","vstack=inputs=2",f]); shots.forEach(s=>fs.unlinkSync(s)); log.push("  stacked (8D above, 8E below) -> "+path.relative(L.ROOT,f)); }
  }
  for(const [id,note,spec,stretches,both] of CLIPS){
    if(ONLY&&!ONLY.includes(id)) continue;
    const made=[];
    for(const [lab,html] of builds){ if(!both&&lab!=="8E") continue;
      const dir=path.join(tmp,id+"-"+lab); fs.mkdirSync(dir,{recursive:true});
      const page=await openPage(browser,html,spec.phone,spec.phone?[390,844]:VP); const st0=await page.evaluate(SETUP,spec); let k=0; const t0=Date.now(), rows=[];
      await page.screenshot({path:path.join(dir,String(k++).padStart(4,"0")+".png")});
      for(const [x,secs] of stretches) for(let i=0;i<Math.round(secs*10);i++){ const r=await page.evaluate(STEP,{x:x,n:3}); rows.push(r); await page.screenshot({path:path.join(dir,String(k++).padStart(4,"0")+".png")}); }
      await closePage(page);
      const f=path.join(tmp,id+"-"+lab+".mp4"); ff(["-framerate","10","-i",path.join(dir,"%04d.png"),"-c:v","libx264","-pix_fmt","yuv420p","-crf","23","-vf","pad=ceil(iw/2)*2:ceil(ih/2)*2",f]); made.push(f);
      log.push("clip "+id+" "+lab+": "+k+" frames in "+Math.round((Date.now()-t0)/1000)+" s, from "+JSON.stringify(st0)+" to "+JSON.stringify(rows[rows.length-1])+"; the amplitude along it "+rows.filter((r,i)=>i%5===0).map(r=>r.amp).join(" "));
      console.log(log[log.length-1]); }
    const f=path.join(OUT,"clips",id+".mp4");
    if(made.length===2) ff(["-i",made[0],"-i",made[1],"-filter_complex","vstack=inputs=2","-c:v","libx264","-pix_fmt","yuv420p","-crf","23",f]); else fs.copyFileSync(made[0],f);
    log.push("  -> "+path.relative(L.ROOT,f)+(made.length===2?" (8D above, 8E below)":"")+": "+note);
  }
  await browser.close(); fs.rmSync(tmp,{recursive:true,force:true});
  fs.writeFileSync(path.join(OUT,"clips","record-log.txt"),log.join("\n")+"\n");
})().catch(e=>{ console.error(e); process.exit(1); });
