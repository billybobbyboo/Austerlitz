#!/usr/bin/env node
/* Stage 4E (docs/STAGE4_SPEC.md sections E, F, G and I): smoke, ice, the horizon and the palette, as the build draws them, for a
   before-and-after table. It reads the running page through the harness's own measures (tools/visual/measure.js); it changes no
   source file. node tools/stage4/report-4e.js [--json out.json] [--md out.md --before before.json] [--from after.json] [--sheet out.jpg]
   AUSTERLITZ_HTML=<build> measures another build (the 4D build, before 4E).

   Per landscape harness view at its own clock and factor, and four of them at 1x and 10.33x: the smoke's sprites and their share of
   the free rectangle (measure.js smokeShare: each sprite's projected rectangle, clipped, overlaps counted twice), the solid
   near-black share (the Stage 0 limit 0.05%), the mean luminance outside the panels, every map text's contrast as rendered and the
   map layer's drops; in the low views (the low Pratzen view at 1x, 4x and 10.33x) the horizon: in 32 columns, the gap between the
   apron's far edge and the true horizon and its colour against the sky just above the horizon (the map text hidden). */
const fs=require("fs"), path=require("path");
const {launch,open,settle,sheet,CASES}=require("../stage2/page.js");
const T=require("../visual/thresholds.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const LAND=CASES.filter(c=>!c.fresh&&c.mode!=="staff"&&!c.interact&&c.viewport[0]===1600);
const MULTI=["overview-field","close-sokolnitz","pratzen-low","ph8-overview-study"];
async function horizon(page){
  const cols=await page.evaluate(()=>{ landCam.updateMatrixWorld(true); var E=landCam.position, fr=landFreeRect(), W0=renderer.domElement.clientWidth||innerWidth, H0=viewH(), out=[], v=new THREE.Vector3();
    function sy(p){ v.copy(p).project(landCam); return v.z<1?[(v.x*0.5+0.5)*W0,(-v.y*0.5+0.5)*H0]:null; }
    for(var i=0;i<32;i++){ var sx=fr[0]+(i+0.5)/32*(fr[2]-fr[0]), r=new THREE.Vector3(sx/W0*2-1,0,0.5).unproject(landCam).sub(E); r.y=0; if(r.lengthSq()<1e-9) continue; r.normalize();
      var tx=r.x>0?(860-E.x)/r.x:(-860-E.x)/r.x, tz=r.z>0?(760-E.z)/r.z:(-760-E.z)/r.z, t=Math.min(tx,tz); if(!(t>0)) continue;
      var e=sy(new THREE.Vector3(E.x+r.x*t,-0.35,E.z+r.z*t)), h=sy(new THREE.Vector3(E.x+r.x*1800,E.y,E.z+r.z*1800)); if(!e||!h) continue;
      if(h[1]<fr[1]+10||e[1]>fr[3]) continue; out.push([Math.round(sx),Math.round(h[1]),Math.round(e[1])]); }
    return out; });
  await page.evaluate(()=>{ const m=document.getElementById("maplayer"); if(m) m.style.visibility="hidden"; });
  const b64=(await page.screenshot({timeout:180000})).toString("base64");
  await page.evaluate(()=>{ const m=document.getElementById("maplayer"); if(m) m.style.visibility=""; });
  return page.evaluate(([b,cols])=>new Promise(res=>{ const im=new Image(); im.onload=()=>{ const cv=document.createElement("canvas"); cv.width=im.width; cv.height=im.height;
    const x=cv.getContext("2d",{willReadFrequently:true}); x.drawImage(im,0,0); const d=x.getImageData(0,0,cv.width,cv.height).data;
    function mean(px,y0,y1){ let s=[0,0,0],n=0; for(let y=Math.max(0,y0);y<=Math.min(cv.height-1,y1);y++) for(let dx=-2;dx<=2;dx++){ const o=(y*cv.width+px+dx)*4; s[0]+=d[o]; s[1]+=d[o+1]; s[2]+=d[o+2]; n++; } return n?s.map(a=>a/n):null; }
    let worst=0, gaps=0, gapPx=0; cols.forEach(([px,hy,ey])=>{ if(ey-hy<4) return; gaps++; gapPx=Math.max(gapPx,ey-hy); const g=mean(px,hy+1,ey-2), k=mean(px,hy-8,hy-3); if(!g||!k) return;
      worst=Math.max(worst,Math.abs(g[0]-k[0]),Math.abs(g[1]-k[1]),Math.abs(g[2]-k[2])); });
    res({columns:cols.length,gaps:gaps,gapPx:gapPx,worst:+worst.toFixed(1)}); }; im.src="data:image/png;base64,"+b; }),[b64,cols]);
}
async function measure(page,shots,key){
  const buf=await page.screenshot({timeout:180000}), b64=buf.toString("base64"); if(shots) shots[key]=buf;
  const px=await page.evaluate(b=>window.__aus.pixels(b),b64), tc=await page.evaluate(b=>window.__aus.textContrast(b),b64);
  const st=await page.evaluate(()=>{ mlLayout(); return {dropped:ML.stats.dropped,smoke:window.__aus.smokeShare()}; });
  return {solidBlack:px.solidBlack,meanLum:px.meanLum,contrast:{min:tc.min,belowAA:tc.belowAA.length},dropped:st.dropped,smoke:st.smoke};
}
(async()=>{
  const FROM=opt("--from");
  const browser=FROM?null:await launch(), out=FROM?JSON.parse(fs.readFileSync(FROM,"utf8")):{html:process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html",when:new Date().toISOString(),views:{},horizon:{}};
  const page=FROM?null:await open(browser,[1600,900]), shots={}, OUT=FROM?null:opt("--json");
  if(!FROM){
  for(const fk of [4,1,"model"]) for(const c of LAND){
    if(fk!==4&&!MULTI.includes(c.name)) continue;
    const key=c.name+(fk===4?"":fk==="model"?"@10.33x":"@1x");
    await page.evaluate(s=>window.__aus.apply(s),Object.assign({},c,fk===4?{}:{factor:fk})); await settle(page);
    const r=await measure(page,shots,key); r.dropLimit=T.DROP_LIMIT[c.name]; out.views[key]=r;
    console.log(key.padEnd(26),"smoke",JSON.stringify(r.smoke),"solid",(100*r.solidBlack).toFixed(3)+"%","mean",r.meanLum,"AA-",r.contrast.belowAA,"min",r.contrast.min,"drop",r.dropped+"/"+r.dropLimit);
    if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1)); }
  for(const fk of [1,4,"model"]){ const c=CASES.find(x=>x.name==="pratzen-low");
    await page.evaluate(s=>window.__aus.apply(s),Object.assign({},c,{factor:fk})); await settle(page);
    const k="pratzen-low@"+(fk==="model"?"10.33":fk)+"x"; out.horizon[k]=await horizon(page); console.log("horizon",k,JSON.stringify(out.horizon[k]));
    if(fk==="model") shots["horizon@10.33x"]=await page.screenshot({timeout:180000}); }
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
  }
  if(opt("--md")&&opt("--before")){
    const B=JSON.parse(fs.readFileSync(opt("--before"),"utf8")), f=r=>r?(r.smoke?(100*r.smoke.share).toFixed(1)+"% ("+r.smoke.sprites+")":"-")+" · "+(100*r.solidBlack).toFixed(3)+"% · "+r.meanLum+" · "+r.contrast.min+" · "+r.dropped:"-";
    const md=["# Stage 4E against the build before it ("+B.html+")\n","`node tools/stage4/report-4e.js` on each build. Each cell: the smoke's share of the free rectangle (its sprites) · solid near-black (limit 0.05%) · mean luminance · lowest map-text contrast as rendered · drops.\n",
      "| view | before | Stage 4E | drop limit |","|---|---|---|---|"];
    Object.keys(out.views).forEach(k=>md.push("| "+k+" | "+f(B.views[k])+" | "+f(out.views[k])+" | "+(out.views[k].dropLimit===undefined?"-":out.views[k].dropLimit)+" |"));
    md.push("\n## The horizon in the low views\n","Columns of the free rectangle where the apron's far edge stands under the true horizon; the gap's colour against the sky's just above the horizon (the largest channel difference, 0-255; the harness's limit "+T.HORIZON_DE+").\n",
      "| view | before: gap columns, largest gap px, colour difference | Stage 4E |","|---|---|---|");
    const h=r=>r?r.gaps+" of "+r.columns+", "+r.gapPx+" px, "+r.worst:"-";
    Object.keys(out.horizon).forEach(k=>md.push("| "+k+" | "+h(B.horizon[k])+" | "+h(out.horizon[k])+" |"));
    fs.writeFileSync(opt("--md"),md.join("\n")+"\n"); }
  if(opt("--sheet")&&!FROM){
    const keys=["close-sokolnitz","pratzen-low","pratzen-low@10.33x","overview-field","horizon@10.33x","ph8-overview-study"];
    fs.writeFileSync(opt("--sheet"),await sheet(page,keys.filter(k=>shots[k]).map(k=>({png:shots[k],cap:k})),3,560,315,(process.env.AUSTERLITZ_HTML?"before 4E":"Stage 4E")+" ("+path.basename(out.html)+")")); }
  if(page&&page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  if(browser) await browser.close();
})().catch(e=>{ console.error(e); process.exit(2); });
