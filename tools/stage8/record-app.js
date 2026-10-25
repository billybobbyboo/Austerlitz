/* Stage 8, implementation PR 8C: record.js --app (its header). A clip of a build as it is, the motion reaching it as a visitor's does
   (tools/visual/motion.js): the app's own loop at 30 frames a second on the driver's clock, each frame drawn by the app (the WebGL draw kept),
   and every third frame captured, so the clip shows 10 frames of the visitor's second, as Part A's clips do (section 3.3). The motion is the
   label-motion run's (the pointer's drag, its right-button drag, the wheel's steps, Play with Follow), 8 frames at rest before and 30 after.
   The variants stacked one above the other: the build before 8C, 8C, and 8C under reduced motion (no fades; the hold and the band kept).
   node tools/stage8/record.js --app --clip id --builds label=file.html,label=file.html[,...] [--rm-last] [--out dir] [--vp WxH]
   Writes <out>/<clip>-<label>.mp4 and .gif, and <out>/<clip>.mp4/.gif, the variants stacked. Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path"), cp=require("child_process");
const L=require("./lib.js");
const MO=require(path.join(L.ROOT,"tools","visual","motion.js"));
/* the clips: a motion of tools/visual/motion.js MOTIONS (its view and kind), with its frames; the paper map's Play from 09:00 to 09:20 */
const CLIPS={
  "hybrid-orbit":{motion:"hybrid-orbit", n:60, note:"Landscape with counters from the Field vantage at 09:30, orbited by a right-button drag of 6 px a frame, 60 frames (2 s), then 30 at rest."},
  "hybrid-zoom":{motion:"hybrid-zoom", n:60, note:"Landscape with counters from the Field vantage at 09:30, the wheel's step every third frame, ten in and ten out, then 30 frames at rest."},
  "paper-zoom":{motion:"paper-zoom", n:60, note:"The paper map as entered at 09:30, the wheel's step every third frame, ten in and ten out, then 30 frames at rest."},
  "paper-play":{motion:"paper-play", n:120, from:540, note:"The paper map as entered while Play runs at ½x from 09:00 to 09:20 (120 frames, 4 s), then 30 frames at rest."}
};
async function main(argv){
  const opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
  const CLIP=opt("--clip"), C=CLIPS[CLIP]; if(!C) throw new Error("no clip "+CLIP+" ("+Object.keys(CLIPS).join(", ")+")");
  const OUT=opt("--out")||path.join(L.EVID8,"8c","clips"), VP=(opt("--vp")||"1280x720").split("x").map(Number), FPS=10, EVERY=3;
  const SCR=path.join(process.env.STAGE8_TMP||require("os").tmpdir(),"frames-8c");
  const builds=(opt("--builds")||"").split(",").filter(Boolean).map(s=>{ const i=s.indexOf("="); return {label:s.slice(0,i), html:path.resolve(s.slice(i+1)), rm:false}; });
  if(!builds.length) throw new Error("--builds label=file.html,...");
  if(argv.includes("--rm-last")) builds.push(Object.assign({},builds[builds.length-1],{label:builds[builds.length-1].label+" reduced motion", rm:true}));
  const M=MO.MOTIONS.find(x=>x[0]===C.motion), [id,view,kind,,amt]=M, n=C.n, rest=30;
  const browser=await L.launch(), made=[];
  for(const B of builds){
    process.env.AUSTERLITZ_HTML=B.html;
    const page=await L.open(browser,VP,{rm:B.rm});
    await L.applyCase(page,Object.assign({},MO.VIEWS[view],{viewport:VP}));
    await page.evaluate(MO.inPage);
    const tag=B.label.replace(/[^A-Za-z0-9]+/g,"_"), dir=path.join(SCR,CLIP+"-"+tag);
    fs.rmSync(dir,{recursive:true,force:true}); fs.mkdirSync(dir,{recursive:true});
    const t1=Date.now(); let k=0;
    const shot=async()=>{ await L.jpeg(page,path.join(dir,"f"+String(k++).padStart(5,"0")+".jpg"),82); };
    await page.evaluate(a=>{ var D=window.__md; D.start({gl:true}); requestRender(2);
      if(a.kind==="play"){ stopPlay(); setClock(a.from,{instant:true,force:true,camera:false}); if(mode!=="staff"){ freeCam=false; curVantage=null; } setSpeed(a.amt); D.frame(8); togglePlay(); }
      else D.frame(8);
      var c=D.centre(); window.__rc={c:c, a:a};
      if(a.kind==="pan") D.down(c[0],c[1],0); if(a.kind==="orbit") D.down(c[0],c[1],2); },{kind:kind, amt:amt, from:C.from||540});
    await shot();
    for(let i=1;i<=n+rest;i++){
      await page.evaluate(([i,n])=>{ var D=window.__md, R=window.__rc, a=R.a, c=R.c;
        if(i<=n){ if(a.kind==="pan") D.move(c[0]+a.amt*i,c[1],0); else if(a.kind==="orbit") D.move(c[0]+a.amt*i,c[1],2);
          else if(a.kind==="zoom"&&i%3===0) D.wheel(c[0],c[1],i<=n/2?-100:100); }
        if(i===n+1){ if(a.kind==="pan") D.up(c[0]+a.amt*n,c[1],0); if(a.kind==="orbit") D.up(c[0]+a.amt*n,c[1],2); if(a.kind==="play") stopPlay(); }
        D.frame(); },[i,n]);
      if(i%EVERY===0) await shot();
    }
    const info=await page.evaluate(()=>{ var D=window.__md; D.stop(); return {clock:clock, rm:RM, passes:typeof MLS!=="undefined"?MLS.stats.passes:null}; });
    await page.close();
    const base=path.join(OUT,CLIP+"-"+tag), enc=L.encode(dir,base,FPS,480);
    made.push({label:B.label, enc, frames:k, secs:((Date.now()-t1)/1000).toFixed(0), info});
    console.log(CLIP,B.label,"frames",k,"in",((Date.now()-t1)/1000).toFixed(0),"s ->",path.relative(L.ROOT,enc.mp4),JSON.stringify(info));
  }
  await browser.close();
  if(made.length>1){
    const inputs=[], filt=[];
    made.forEach((m,i)=>{ inputs.push("-i",m.enc.mp4); filt.push("["+i+":v]drawtext=text='"+m.label.replace(/[^A-Za-z0-9 .]/g," ")+"':x=10:y=10:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6[v"+i+"]"); });
    const st=made.map((m,i)=>"[v"+i+"]").join("")+"vstack=inputs="+made.length+"[o]", out=path.join(OUT,CLIP);
    const gif=()=>cp.execFileSync("ffmpeg",["-y","-loglevel","error","-i",out+".mp4","-vf","fps="+FPS+",scale=480:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96[p];[b][p]paletteuse=dither=bayer:bayer_scale=4",out+".gif"]);
    try{ cp.execFileSync("ffmpeg",["-y","-loglevel","error"].concat(inputs,["-filter_complex",filt.concat([st]).join(";"),"-map","[o]","-c:v","libx264","-pix_fmt","yuv420p","-crf","25",out+".mp4"])); gif(); }
    catch(e){ console.log("stacking with labels failed (drawtext may need a font):",String(e.message).slice(0,200));
      cp.execFileSync("ffmpeg",["-y","-loglevel","error"].concat(inputs,["-filter_complex",made.map((m,i)=>"["+i+":v]").join("")+"vstack=inputs="+made.length+"[o]","-map","[o]","-c:v","libx264","-pix_fmt","yuv420p","-crf","25",out+".mp4"])); gif(); }
    console.log("stacked",path.relative(L.ROOT,out+".mp4"),"(top to bottom: "+made.map(m=>m.label).join(", ")+")");
  }
  return made;
}
module.exports={main, CLIPS};
