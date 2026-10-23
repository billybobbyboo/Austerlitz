#!/usr/bin/env node
/* Stage 8 Part A (docs/STAGE8_SPEC.md): short motion recordings of the build and of its prototypes, for exact comparison. Software WebGL draws a
   frame in seconds here, so a clip is not filmed in real time: each frame is set and drawn by the app, then captured, and the frames are
   encoded at the frame rate a visitor's screen would have shown them (FPS). A clip's clock advances by the play speed's clock minutes for each
   frame's share of a second (MIN_PER_SEC x speed / FPS): at the default ½x, half a clock minute a frame at 10 frames a second, as Play would.
   The clock is set as Play sets it (setClock without force: the overlays, the facings and the phase's toast change only when the phase does;
   until this was found the clips set it with force, which rebuilt the overlays every frame); Play's dwell at event starts is not reproduced.
   The camera either follows a formation (a fixed offset in the world from its block, so the shot tracks it without turning) or moves by the
   app's own camera functions (a pan, a zoom, an orbit) one step a frame. ?harness=1 is kept (deterministic frames: the smoke does not drift).
   Prototypes (tools/stage8/protos/<file>.js, file:id) are installed before the first frame; the gait is told the play speed it stands for.
   node tools/stage8/record.js --clip id [--variants base,file:id,...] [--out dir] [--fps n] [--vp WxH]
   Writes <out>/<clip>-<variant>.mp4 and .gif, and <out>/<clip>.mp4/.gif, the variants stacked. Measurement and prototype code only. */
"use strict";
const fs=require("fs"), path=require("path"), cp=require("child_process");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const CLIP=opt("--clip"), OUT=opt("--out")||path.join(L.EVID8,"clips"), FPS=+(opt("--fps")||10);
const VP=(opt("--vp")||"1280x720").split("x").map(Number);
const SCR=path.join(process.env.STAGE8_TMP||"/tmp/claude-0/-home-user-Austerlitz/ba382c5e-dd3f-5c64-85fb-08499da0536a/scratchpad","frames");
/* the clips. follow: the formation the shot tracks (r, az from its facing at the first frame, el); moving: record the leg in progress */
const CLIPS={
  "inf-march": {t:525, mode:"terrain", presentation:"watch", follow:{id:"sthilaire", r:26, az:0.75, el:0.33}, from:527, to:545, speed:0.5,
    variants:["base","figures:f-gait"], note:"Saint-Hilaire's division climbing the plateau's west slope (its leg 08:45-09:15), at ½x, the camera tracking it 26 units out."},
  "cav-move": {mode:"terrain", presentation:"watch", follow:{id:"guard_cav", r:26, az:0.75, el:0.33}, from:629, to:647, speed:0.5,
    variants:["base","figures:f-gait-gc"], note:"The Guard cavalry on its march of 10:30-11:15 (4.85 km/h, the one cavalry leg of the model fast enough to step: Nansouty's are drifts under 1 km/h), at ½x, tracked 26 units out."},
  "bat-limber": {mode:"terrain", presentation:"watch", follow:{id:"heightguns", r:24, az:1.1, el:0.36}, from:822, to:838, speed:0.5,
    variants:["base","figures:f-gait"], note:"The guns on the heights limbering up and moving off toward Augezd (the leg 13:45-14:30), at ½x."},
  "inf-march-4x": {t:525, mode:"terrain", presentation:"watch", follow:{id:"sthilaire", r:26, az:0.75, el:0.33}, from:527, to:567, speed:4, fps:10,
    variants:["figures:f-gait"], note:"The same climb at 4x: the gait's cycle would exceed 3.2 a second on screen, so it fades out (section 4.3)."},
  "paper-zoom": {t:570, mode:"staff", presentation:"study", paper:"frame", cam:[-27,272,41,-27,0,9], motion:{kind:"zoom", k:1.05, n:30},
    variants:["base","labels:l-fade"], note:"The paper map as entered, zoomed in about the centre of the free area, 30 frames."},
  "paper-play": {t:540, mode:"staff", presentation:"study", paper:"frame", cam:[-27,272,41,-27,0,9], from:540, to:560, speed:0.5,
    variants:["base","labels:l-fade"], note:"The paper map while the clock plays at ½x from 09:00: the counters move with their formations."},
  "hybrid-orbit": {t:570, mode:"hybrid", presentation:"study", cam:[-195,92,156,-33,4,-2], motion:{kind:"orbit", d:12, n:30},
    variants:["base","labels:l-fade"], note:"Landscape with counters from the Field vantage, orbited about its target, 30 frames."},
  "hybrid-zoom": {t:570, mode:"hybrid", presentation:"study", cam:[-195,92,156,-33,4,-2], motion:{kind:"zoom", k:1.05, n:30},
    variants:["base","labels:l-fade"], note:"Landscape with counters from the Field vantage, zoomed in about the centre, 30 frames."},
  "stream-flow": {t:720, mode:"terrain", presentation:"watch", aim:{map:[206,380], dir:[0.05,0.99,0.1], r:28}, motion:{kind:"hold", n:30},
    variants:["water:w-stream","water:w-flow"], note:"The Goldbach below Sokolnitz at noon from straight above (goldbach-top; from the bank at 1280 x 720 the stream is out of the frame): the stream drawn and restyled, still and with its ripple drifting downstream (assessment only)."}
};
(async()=>{
  const C=CLIPS[CLIP]; if(!C) throw new Error("no clip "+CLIP+" ("+Object.keys(CLIPS).join(", ")+")");
  const variants=(opt("--variants")?opt("--variants").split(","):C.variants), fps=C.fps||FPS;
  const browser=await L.launch(), made=[];
  for(const vname of variants){
    const page=await L.open(browser,VP);
    const proto=vname==="base"?null:(()=>{ const [f,id]=vname.split(":"), M=require(path.join(__dirname,"protos",f+".js")); return {f,id,M}; })();
    if(proto) await L.inject(page,proto.M.inPage);
    const spec=Object.assign({viewport:VP},C); delete spec.variants;
    if(spec.from!=null) spec.t=spec.from;
    if(spec.moving){ const w=await page.evaluate(M=>{ const A=anchorList(M.id); for(let i=1;i<A.length;i++){ const a=A[i-1], b=A[i]; if(!a.p||!b.p) continue; const w=legWindow(a,b); if(w[1]>M.after&&w[1]-w[0]>4) return w; } return null; },spec.moving);
      if(!w) throw new Error("no leg for "+spec.moving.id); spec.from=Math.max(w[0]-1,0); spec.to=Math.min(w[1],spec.from+(spec.span||18)); spec.t=spec.from; C.window=w; }
    if(!spec.cam&&!spec.aim) spec.cam=[-195,92,156,-33,4,-2];
    await L.applyCase(page,spec);
    if(proto) await page.evaluate(([id])=>window.__p8[id].install(),[proto.id]);
    /* the shot: the follow offset fixed in the world at the first frame */
    if(C.follow) await page.evaluate(F=>{ const rec=units[F.id], b=rec.block, a=(rec.yaw||0)+F.az; window.__rec8={F:F, off:new THREE.Vector3(Math.sin(a)*Math.cos(F.el),Math.sin(F.el),Math.cos(a)*Math.cos(F.el)).multiplyScalar(F.r)}; },C.follow);
    const dir=path.join(SCR,CLIP+"-"+vname.replace(/[:]/g,"_")); fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir,{recursive:true});
    const n=C.motion?C.motion.n:Math.round((spec.to-spec.from)/(10*(C.speed||0.5)/fps));
    const t1=Date.now();
    for(let k=0;k<=n;k++){
      await page.evaluate(([C,k,fps,spec])=>{
        if(window.__l8){ window.__l8.moving=k>0&&k<(C.motion?C.motion.n:1e9); window.__l8.frameMs=1000/fps; }
        if(window.__f8) window.__f8.rate=MIN_PER_SEC*(C.speed||0.5)/60;   /* the gait told the play speed this clip stands for */
        if(spec.from!=null){ const t=spec.from+k*MIN_PER_SEC*(C.speed||0.5)/fps; setClock(Math.min(spec.to,t),{instant:false,camera:false}); }   /* as Play sets it (tickClock: no force), the camera held by the shot */
        if(C.motion&&k>0){ const fr=mode==="staff"?MAPCAM.freeRect():landFreeRect(), c=[(fr[0]+fr[2])/2,(fr[1]+fr[3])/2];
          if(C.motion.kind==="zoom"){ if(mode==="staff") MAPCAM.zoomAt(c[0],c[1],1/C.motion.k); else LANDCAM.zoomAt(c[0],c[1],1/C.motion.k); }
          else if(C.motion.kind==="orbit") LANDCAM.orbit(C.motion.d,0);
          else if(C.motion.kind==="pan"){ if(mode==="staff") MAPCAM.pan(C.motion.d,0); }
          if(window.__w8) window.__w8.setTime(k/fps); }
        if(window.__rec8){ const b=units[window.__rec8.F.id].block, T=new THREE.Vector3(b.position.x,groundY(b.position.x,b.position.z),b.position.z);
          setTween("cam",null); freeCam=true; orbitTarget.copy(T); landCam.position.copy(T).add(window.__rec8.off); landCam.lookAt(orbitTarget); clampCamera(); }
        /* one visitor's frame: the state pass a few times at the frame's own easing (FK for 1/fps s), the view offset, the draw */
        const fk=FK; FK=Math.max(0.25,Math.min(7.2,(1000/fps)/16.667));
        for(let i=0;i<2;i++){ settling=false; updateVisibility(); }
        FK=fk; syncViewOffset(true); renderFrame();
      },[C,k,fps,spec]);
      await L.jpeg(page,path.join(dir,"f"+String(k).padStart(5,"0")+".jpg"),82);
    }
    const info=await page.evaluate(()=>({clock:clock, hz:window.__f8?window.__f8.hz:null}));
    await page.close();
    const base=path.join(OUT,CLIP+"-"+vname.replace(/[:]/g,"_"));
    const enc=L.encode(dir,base,fps,480);
    made.push({variant:vname, dir, enc, frames:n+1, secs:((Date.now()-t1)/1000).toFixed(0), info});
    console.log(CLIP,vname,"frames",n+1,"in",((Date.now()-t1)/1000).toFixed(0),"s ->",path.relative(L.ROOT,enc.mp4),JSON.stringify(info));
  }
  await browser.close();
  /* the variants stacked one above the other, each labelled */
  if(made.length>1){
    const inputs=[], filt=[];
    made.forEach((m,i)=>{ inputs.push("-i",m.enc.mp4); filt.push("["+i+":v]drawtext=text='"+m.variant.replace(/[:]/g," ")+"':x=10:y=10:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6[v"+i+"]"); });
    const st=made.map((m,i)=>"[v"+i+"]").join("")+"vstack=inputs="+made.length+"[o]";
    const out=path.join(OUT,CLIP);
    try{ cp.execFileSync("ffmpeg",["-y","-loglevel","error"].concat(inputs,["-filter_complex",filt.concat([st]).join(";"),"-map","[o]","-c:v","libx264","-pix_fmt","yuv420p","-crf","25",out+".mp4"]));
      cp.execFileSync("ffmpeg",["-y","-loglevel","error","-i",out+".mp4","-vf","fps="+fps+",scale=480:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=4",out+".gif"]);
      console.log("stacked",path.relative(L.ROOT,out+".mp4")); }
    catch(e){ console.log("stacking failed (drawtext may need a font):",String(e.message).slice(0,200));
      cp.execFileSync("ffmpeg",["-y","-loglevel","error"].concat(inputs,["-filter_complex",made.map((m,i)=>"["+i+":v]").join("")+"vstack=inputs="+made.length+"[o]","-map","[o]","-c:v","libx264","-pix_fmt","yuv420p","-crf","25",out+".mp4"]));
      cp.execFileSync("ffmpeg",["-y","-loglevel","error","-i",out+".mp4","-vf","fps="+fps+",scale=480:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=4",out+".gif"]); }
  }
})().catch(e=>{ console.error(e); process.exit(1); });
