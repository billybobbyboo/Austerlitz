/* Stage 8 Part A (docs/STAGE8_SPEC.md): shared by the probes in this folder. The page is opened as the Stage 7 and step 6 probes open it
   (tools/stage7/lib.js: headless Chromium, software WebGL, ?harness=1 unless asked otherwise, tools/visual/measure.js injected, CSS
   transitions off), so a probe's numbers are the harness's. Added here: JPEG screenshots for the evidence (smaller than PNG), a contact
   sheet of labelled tiles, a frame-sequence recorder (each frame drawn by the app and captured; then ffmpeg) and the ground-truth helpers
   the motion probes share. Measurement and prototype code only: nothing here is written to a source file, and every prototype a probe
   injects is undone or dies with its page. */
"use strict";
const fs=require("fs"), path=require("path"), cp=require("child_process");
const L7=require("../stage7/lib.js");
const ROOT=L7.ROOT, EVID8=path.join(ROOT,"docs","stage8-evidence");
const CASES=require(path.join(ROOT,"tools","visual","cases.js"));
const byName=n=>{ const c=CASES.find(c=>c.name===n); if(!c) throw new Error("no case "+n); return JSON.parse(JSON.stringify(c)); };
async function jpeg(page,file,q,clip){ const o={type:"jpeg",quality:q||84,timeout:180000}; if(clip) o.clip=clip; const b=await page.screenshot(o); if(file){ fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,b); } return b; }
async function png(page,clip){ const o={timeout:180000}; if(clip) o.clip=clip; return page.screenshot(o); }
/* draw the app's frame now (render on demand: the probes call the app's own renderFrame and its map layer pass) */
async function draw(page,n){ await page.evaluate(k=>{ for(let i=0;i<(k||1);i++){ AUSTERLITZ_DEBUG.settle(1); } },n||1); }
/* a contact sheet (tools/stage2/page.js sheet), saved as JPEG */
async function sheet(page,tiles,cols,tw,th,title,file,fit){ const b=await L7.sheet(page,tiles,cols,tw,th,title,fit); if(file){ fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,b); } return b; }
/* frames to video: dir holds f00000.jpg...; writes an MP4 (H.264, yuv420p) and a small looping GIF preview beside it */
function encode(dir,out,fps,gifW){
  fs.mkdirSync(path.dirname(out),{recursive:true});
  cp.execFileSync("ffmpeg",["-y","-loglevel","error","-framerate",String(fps),"-i",path.join(dir,"f%05d.jpg"),"-c:v","libx264","-pix_fmt","yuv420p","-crf","24","-preset","slow",
    "-vf","pad=ceil(iw/2)*2:ceil(ih/2)*2",out+".mp4"]);
  if(gifW){ const pal=path.join(dir,"palette.png");
    cp.execFileSync("ffmpeg",["-y","-loglevel","error","-framerate",String(fps),"-i",path.join(dir,"f%05d.jpg"),"-vf","scale="+gifW+":-1:flags=lanczos,palettegen=max_colors=96",pal]);
    cp.execFileSync("ffmpeg",["-y","-loglevel","error","-framerate",String(fps),"-i",path.join(dir,"f%05d.jpg"),"-i",pal,"-lavfi","scale="+gifW+":-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4",out+".gif"]); }
  return {mp4:out+".mp4", gif:gifW?out+".gif":null};
}
module.exports=Object.assign({},L7,{ROOT,EVID8,CASES,byName,jpeg,png,draw,sheet,encode});
