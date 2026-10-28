#!/usr/bin/env node
/* Stage 8, implementation PR 8F (decisions 246 (a), 247 (a); docs/STAGE8_SPEC.md section 18): the matched before-and-after evidence of the water,
   the woods and the near ground. Two builds (8E's as merged, or any "before"; the 8F build, the "after"), each view on a page opened as the
   harness opens it (?harness=1, tools/visual/measure.js's aim and case code), the same state on both: the pair side by side in one sheet (the
   before on the left), every view at its clock, factor, presentation and camera:
   - the water: the meres from above, from the north-east and low (15:00), at 09:00 and 12:00 (the light through the day), against the low sun
     (14:00), at 1x and 10.33x, near the ice's level (an eye a little over a unit above it), in Landscape with counters; the Goldbach from above,
     from its bank and low;
   - the woods: the pheasantry (4x, 1x, 10.33x), through its edge low with troops beyond (09:00), from inside a wood's edge over the mere
     (ice-sun), close to Sokolnitz, the Overview's silhouettes (two views);
   - the near ground: the low Pratzen view at 1x, 4x and 10.33x, the low east view, the eye level at the Zuran, a low view over the fields;
   - a phone's screen (390 x 844, a low tier: no shadow and no near detail) over the meres and over the pheasantry;
   and three short clips, the before above the after (H.264, 10 frames a second; the app's own frames, each asked for): an orbit at the
   pheasantry's edge (the crowns' openness and their shimmer), a dolly over the Satschan mere toward a grazing view (the ice, the shore band),
   a slow pan low over the fields (the near detail anchored: nothing swims). The clock stands in every clip (nothing in the water moves).
   node tools/stage8/stills-8f.js --before 8e.html --after 8f.html [--out dir] [--only a,b] [--no-clips]
   Writes <out>/pairs/<view>.jpg, <out>/clips/<clip>.mp4 and <out>/stills-8f.json; measurement code only. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), cp=require("child_process");
const L=require("./lib.js"), V=require("./views.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const BEFORE=path.resolve(opt("--before")), AFTER=path.resolve(opt("--after")||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=path.resolve(opt("--out")||path.join(L.EVID8,"8f"));
const ONLY=opt("--only")?opt("--only").split(","):null;
const VP=[1600,900], PH=[390,844];
const Wv=(o,x)=>Object.assign(JSON.parse(JSON.stringify(o)),x);   /* a view with some of its fields changed */
const VIEWS={
  "ice-high":V["ice-high"], "ice-mid":V["ice-mid"], "ice-low":V["ice-low"], "ice-sun":V["ice-sun"],
  "ice-mid-0900":Wv(V["ice-mid"],{t:540}), "ice-mid-1200":Wv(V["ice-mid"],{t:720}),
  "ice-mid-1x":Wv(V["ice-mid"],{factor:1}), "ice-mid-10x":Wv(V["ice-mid"],{factor:"model"}),
  "ice-eye":{viewport:VP, t:900, presentation:"watch", mode:"terrain", aim:{map:[262,428], dir:[0.22,0.075,0.97], r:16}},
  "ice-hybrid":Wv(V["ice-mid"],{mode:"hybrid"}),
  "goldbach-top":V["goldbach-top"], "goldbach-noon":V["goldbach-noon"], "stream-low":V["stream-low"],
  "woods-pheasantry":V["woods-pheasantry"], "woods-pheasantry-1x":Wv(V["woods-pheasantry"],{factor:1}), "woods-pheasantry-10x":Wv(V["woods-pheasantry"],{factor:"model"}),
  "woods-edge-low":{viewport:VP, t:540, presentation:"watch", mode:"terrain", aim:{map:[236,385], dir:[-0.92,0.12,0.37], r:34}},
  "close-sokolnitz":V["close-sokolnitz"], "overview-field":V["overview-field"], "ph8-overview-watch":V["ph8-overview-watch"],
  "pratzen-low":V["pratzen-low"], "pratzen-low-1x":V["pratzen-low-1x"], "pratzen-low-10x":V["pratzen-low-10x"], "horizon-east":V["horizon-east"],
  "eye-zuran":V["eye-zuran"], "fields-low":{viewport:VP, t:720, presentation:"watch", mode:"terrain", aim:{map:[300,300], dir:[0.30,0.07,0.95], r:22}},
  "hybrid-low":Wv(V["pratzen-low"],{mode:"hybrid"}),
  "phone-ice":{viewport:PH, t:900, presentation:"study", mode:"terrain", aim:{map:[262,444], dir:[0.45,0.50,-0.74], r:70}},
  "phone-woods":{viewport:PH, t:500, presentation:"study", mode:"terrain", aim:{map:[236,385], dir:[-0.55,0.36,0.75], r:52}}
};
const CLIPS={
  "woods-orbit":{t:540, vp:[960,540], n:30, cam:f=>({map:[236,385], dir:[-0.92+0.5*f,0.14,0.37+0.4*f], r:34})},
  "ice-dolly":{t:900, vp:[960,540], n:30, cam:f=>({map:[262,440], dir:[0.45,0.50-0.42*f,-0.74], r:58-30*f})},
  "ground-pan":{t:720, vp:[960,540], n:30, cam:f=>({map:[300-6*f,300+10*f], dir:[0.30,0.07,0.95], r:22})}
};
const md5=f=>require("crypto").createHash("md5").update(fs.readFileSync(f)).digest("hex");
/* the eye r units from the ground under a map point, along dir (as measure.js aims a case) */
const AIM=function(a){ var w=W(a.map[0],a.map[1]), y=groundY(w[0],w[1]), d=new THREE.Vector3(a.dir[0],a.dir[1],a.dir[2]).normalize().multiplyScalar(a.r);
  tween=null; camArc=null; freeCam=true; curVantage=null; landCam.position.set(w[0]+d.x,y+d.y,w[1]+d.z); orbitTarget.set(w[0],y,w[1]); landCam.lookAt(orbitTarget); clampCamera(); syncViewOffset(true);
  requestRender(2); AUSTERLITZ_DEBUG.settle(2); return true; };
(async()=>{
  fs.mkdirSync(path.join(OUT,"pairs"),{recursive:true}); fs.mkdirSync(path.join(OUT,"clips"),{recursive:true});
  const browser=await L.launch(), res={chromium:browser.version(), before:{file:path.basename(BEFORE), md5:md5(BEFORE)}, after:{file:path.basename(AFTER), md5:md5(AFTER)}, views:{}, clips:{}};
  const pages={};
  const pageFor=async(lab,html,vp)=>{ const key=lab+vp.join("x"); if(pages[key]) return pages[key]; for(const k of Object.keys(pages)) if(k.startsWith(lab)){ await pages[k].close(); delete pages[k]; }
    process.env.AUSTERLITZ_HTML=html; pages[key]=await L.open(browser,vp,{}); return pages[key]; };
  for(const [name,v] of Object.entries(VIEWS)){ if(ONLY&&!ONLY.includes(name)) continue;
    const tiles=[], R=res.views[name]={};
    for(const [lab,html] of [["before",BEFORE],["after",AFTER]]){
      const page=await pageFor(lab,html,v.viewport); await L.applyCase(page,v);
      const st=await page.evaluate(()=>({clock:fmtClock(clock), factor:DISPLAY.factor, mode:mode, lowTier:lowTier})); R[lab]=st;
      tiles.push({png:await L.png(page), cap:lab+" ("+(lab==="before"?path.basename(BEFORE):path.basename(AFTER))+"), "+name+", "+st.clock+", "+(+st.factor.toFixed(2))+"x"+(st.lowTier?", low tier":"")}); }
    const ph=v.viewport[1]>v.viewport[0], tw=ph?390:800, th=ph?844:450;
    await L.sheet(pages[Object.keys(pages)[0]],tiles,2,tw,th,"8F before | after: "+name,path.join(OUT,"pairs",name+".jpg"),true);
    console.log("pair "+name+" "+JSON.stringify(R)); }
  for(const k of Object.keys(pages)){ await pages[k].close(); delete pages[k]; }
  if(!argv.includes("--no-clips")) for(const [name,c] of Object.entries(CLIPS)){ if(ONLY&&!ONLY.includes(name)) continue;
    const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"clip-8f-")), made=[];
    for(const [lab,html] of [["before",BEFORE],["after",AFTER]]){
      process.env.AUSTERLITZ_HTML=html; const page=await L.open(browser,c.vp,{}); await L.applyCase(page,{viewport:c.vp, t:c.t, presentation:"watch", mode:"terrain", aim:c.cam(0)});
      const dir=path.join(tmp,lab); fs.mkdirSync(dir,{recursive:true});
      for(let i=0;i<c.n;i++){ await page.evaluate(AIM,c.cam(i/(c.n-1))); fs.writeFileSync(path.join(dir,"f"+String(i).padStart(5,"0")+".jpg"),await L.jpeg(page,null,86)); }
      await page.close(); const mp4=path.join(tmp,lab+".mp4");
      cp.execFileSync("ffmpeg",["-y","-loglevel","error","-framerate","10","-i",path.join(dir,"f%05d.jpg"),"-c:v","libx264","-pix_fmt","yuv420p","-crf","23","-vf","pad=ceil(iw/2)*2:ceil(ih/2)*2",mp4]); made.push(mp4); }
    const f=path.join(OUT,"clips",name+"-8e-8f.mp4");
    cp.execFileSync("ffmpeg",["-y","-loglevel","error","-i",made[0],"-i",made[1],"-filter_complex","vstack=inputs=2","-c:v","libx264","-pix_fmt","yuv420p","-crf","23",f]);
    fs.rmSync(tmp,{recursive:true,force:true}); res.clips[name]={file:path.relative(L.ROOT,f), frames:c.n, clock:c.t}; console.log("clip "+name+": "+path.relative(L.ROOT,f)+" (before above, after below)"); }
  fs.writeFileSync(path.join(OUT,"stills-8f.json"),JSON.stringify(res,null,1));
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
