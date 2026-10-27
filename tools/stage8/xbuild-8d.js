#!/usr/bin/env node
/* Stage 8, implementation PR 8D (docs/STAGE8_SPEC.md section 16): is the default picture unchanged against the build before 8D? The WebGL frame of
   two builds in the same views, each view on several fresh pages of each build (the harness's own case applied and settled; then the eye set to
   the place the first page's settled at, so that every page draws from one eye: a settled glide ends a little apart from page to page, which
   alone moved 700-1,600 pixels of the low Pratzen view; then one frame drawn and read from the drawing buffer at once). What still differs
   between fresh pages of either build is measured first ("unstable"), and the builds are compared outside it: a pixel in which every page of
   one build agrees with the others of its build and with none of the other build's is a change the build made ("consistentChange").
   node tools/stage8/xbuild-8d.js <before.html> <after.html> [--pages 3] [--views a,b] [--json out.json]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), K=+(opt("--pages")||3), BUILDS=argv.filter((a,i)=>a.endsWith(".html")&&!["--json"].includes(argv[i-1]));
const VIEWS=(opt("--views")||"pratzen-low,close-sokolnitz,selected-formation,overview-field,eye-zuran,ph8-overview-watch").split(",");
if(BUILDS.length!==2){ console.error("usage: xbuild-8d.js <before.html> <after.html> [--pages 3] [--views a,b] [--json out.json]"); process.exit(2); }
const md5=f=>crypto.createHash("md5").update(fs.readFileSync(f)).digest("hex");
(async()=>{
  const browser=await L.launch(), res={note:"the WebGL frame, fresh pages, pixels differing in any channel", chromium:browser.version(), pages:K,
    builds:BUILDS.map(b=>({file:path.basename(b), md5:md5(b)})), views:{}};
  let eye=null;
  async function frame(html,c){ process.env.AUSTERLITZ_HTML=path.resolve(html); const page=await L.open(browser,c.viewport);
    try{ await page.evaluate(()=>closeFirst(null)); await page.evaluate(s=>window.__aus.apply(s),c); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(60)); await page.waitForTimeout(300); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(4));
      const r=await page.evaluate(E=>{ var cam=camera.isOrthographicCamera, own=cam?null:[landCam.position.x,landCam.position.y,landCam.position.z,orbitTarget.x,orbitTarget.y,orbitTarget.z], off=null;
        if(E&&own){ off=Math.hypot(own[0]-E[0],own[1]-E[1],own[2]-E[2])+Math.hypot(own[3]-E[3],own[4]-E[4],own[5]-E[5]);
          landCam.position.set(E[0],E[1],E[2]); orbitTarget.set(E[3],E[4],E[5]); landCam.lookAt(orbitTarget); syncViewOffset(true); }
        var gl=renderer.getContext(), w=gl.drawingBufferWidth, h=gl.drawingBufferHeight; renderFrame(); var b=new Uint8Array(w*h*4); gl.readPixels(0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,b);
        var s=""; for(var i=0;i<b.length;i+=4) s+=String.fromCharCode(b[i],b[i+1],b[i+2]); return {w:w,h:h,px:btoa(s),programs:renderer.info.programs.length,own:own,off:off}; },eye);
      if(!eye&&r.own) eye=r.own;
      return {w:r.w, h:r.h, buf:Buffer.from(r.px,"base64"), programs:r.programs, off:r.off}; }
    finally{ await page.close(); } }
  for(const v of VIEWS){ const c=L.byName(v); if(!c){ console.log(v+": no such case"); continue; }
    const F=[[],[]]; eye=null;
    for(let k=0;k<K;k++) for(let b=0;b<2;b++) F[b].push(await frame(BUILDS[b],c));   /* the builds' pages interleaved */
    const n=F[0][0].buf.length/3, unst=[new Uint8Array(n),new Uint8Array(n)], same=(a,b,p)=>a[p*3]===b[p*3]&&a[p*3+1]===b[p*3+1]&&a[p*3+2]===b[p*3+2];
    for(let b=0;b<2;b++) for(let k=1;k<K;k++){ const A=F[b][0].buf, B=F[b][k].buf; for(let p=0;p<n;p++) if(!same(A,B,p)) unst[b][p]=1; }
    let uA=0,uB=0,uU=0,cross=0,outside=0,consistent=0; const where=[];   /* where (the drawing buffer's rows, from the bottom): up to 24 of the consistent changes */
    for(let p=0;p<n;p++){ const a=unst[0][p], b=unst[1][p]; if(a) uA++; if(b) uB++; if(a||b) uU++;
      let any=false; for(let i=0;i<K&&!any;i++) for(let j=0;j<K&&!any;j++) if(!same(F[0][i].buf,F[1][j].buf,p)) any=true;
      if(any){ cross++; if(!a&&!b) outside++; }
      if(!a&&!b&&!same(F[0][0].buf,F[1][0].buf,p)){ consistent++;
        if(where.length<24){ const w=F[0][0].w, q=F[0][0].buf, r=F[1][0].buf; where.push({x:p%w, y:Math.floor(p/w), before:[q[p*3],q[p*3+1],q[p*3+2]], after:[r[p*3],r[p*3+1],r[p*3+2]]}); } } }
    const R=res.views[v]={size:[F[0][0].w,F[0][0].h], unstableBefore:uA, unstableAfter:uB, unstableEither:uU, differingBetweenBuilds:cross, outsideUnstable:outside, consistentChange:consistent, where:where,
      programs:[F[0].map(x=>x.programs),F[1].map(x=>x.programs)], eyeOff:[F[0].map(x=>x.off),F[1].map(x=>x.off)]};
    console.log(v.padEnd(22)+JSON.stringify(R));
    if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); } }
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
