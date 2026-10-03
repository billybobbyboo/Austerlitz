#!/usr/bin/env node
/* Stage 4B (docs/STAGE4_SPEC.md sections A.6, H and I): the light as the build draws it, per view, for a before-and-after table.
   It reads the running page through the harness's own measures (tools/visual/measure.js) and changes nothing.
   node tools/stage4/report-4b.js [--json out.json] [--md out.md] [--before before.json] [--label "Stage 4B"] [--sheet out.jpg]
   AUSTERLITZ_HTML=<build> measures another build (e.g. archive/spine-6b2cccd4.html, the build before 4B).

   For every landscape harness view (tools/visual/cases.js) at its own clock and factor, four of them also at 1x and 10.33x, and the
   sweep (the Field vantage and the low Pratzen view at 4x every hour 08:00-16:00): the solid near-black share (the Stage 0 limit
   0.05%), the near-black share, the 5th percentile and the mean of luminance outside the panels, every map text's contrast as
   rendered (the lowest; how many below AA), the map layer's drops against DROP_LIMIT and its pass time, and on a 4B build the light
   (the sun's true and drawn altitude, the shadow box's size). */
const fs=require("fs"), path=require("path");
const {launch,open,settle,sheet,CASES,ROOT}=require("../stage2/page.js");
const T=require("../visual/thresholds.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const LAND=CASES.filter(c=>!c.fresh&&c.mode!=="staff"&&!c.interact&&c.viewport[0]===1600);
const MULTI=["overview-field","close-sokolnitz","pratzen-low","ph8-overview-study"];
const LUM=function(b64){ return new Promise(function(res){ var im=new Image(); im.onload=function(){
  var cv=document.createElement("canvas"); cv.width=im.width; cv.height=im.height; var x=cv.getContext("2d",{willReadFrequently:true}); x.drawImage(im,0,0);
  var d=x.getImageData(0,0,cv.width,cv.height).data, R=[], h=new Uint32Array(256), n=0;
  [".rail",".dispatch",".legend",".timebar",".tools","#viewmode","#firstrun",".drawer","#tourbar","#selchip","#devstats","#restore","#layerpop","#vsbadge","#toast"].forEach(function(s){
    document.querySelectorAll(s).forEach(function(e){ var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||+cs.opacity<0.05||e.hidden) return;
      if((e.classList.contains("rail")&&document.body.classList.contains("rail-hidden"))||(e.classList.contains("drawer")&&!e.classList.contains("on"))) return;
      var r=e.getBoundingClientRect(); if(r.width>0&&r.height>0) R.push([r.left,r.top,r.right,r.bottom]); }); });
  for(var y=0;y<cv.height;y+=2) for(var xx=0;xx<cv.width;xx+=2){ var ui=false; for(var k=0;k<R.length;k++){ var r=R[k]; if(xx>=r[0]&&xx<r[2]&&y>=r[1]&&y<r[3]){ ui=true; break; } }
    if(ui) continue; var o=(y*cv.width+xx)*4; h[Math.round(0.2126*d[o]+0.7152*d[o+1]+0.0722*d[o+2])]++; n++; }
  function q(f){ var c=0, t=f*n; for(var i=0;i<256;i++){ c+=h[i]; if(c>=t) return i; } return 255; }
  res({p5:q(0.05),p50:q(0.5)}); }; im.src="data:image/png;base64,"+b64; }); };
async function measure(page,shots,key){
  const buf=await page.screenshot({timeout:180000}), b64=buf.toString("base64");
  if(shots) shots[key]=buf;
  const px=await page.evaluate(b=>window.__aus.pixels(b),b64), lum=await page.evaluate(LUM.toString().replace(/^function/,"(function")+")("+JSON.stringify(b64)+")");
  const tc=await page.evaluate(b=>window.__aus.textContrast(b),b64);
  const st=await page.evaluate(()=>{ mlLayout(); var t=[]; for(var i=0;i<3;i++){ var a=performance.now(); mlLayout(); t.push(performance.now()-a); } t.sort(function(a,b){ return a-b; });
    var L=(typeof LIGHT_NOW!=="undefined"&&LIGHT_NOW&&LIGHT_NOW.sun)?{alt:+LIGHT_NOW.sun.alt.toFixed(1),drawn:+(Math.asin(LIGHT_NOW.dir.y)*180/Math.PI).toFixed(1),twilight:+LIGHT_NOW.twilight.toFixed(2),
      box:SHADOW_FIT.ext,fill:+LIGHT_NOW.fill.toFixed(2)}:null;
    return {dropped:ML.stats.dropped,ms:+t[1].toFixed(2),light:L,clock:clock,phase:curPhase}; });
  return {solidBlack:px.solidBlack,solidBlocks:px.solidBlocks,nearBlack:px.nearBlack,meanLum:px.meanLum,p5:lum.p5,p50:lum.p50,
    contrast:{texts:tc.texts,min:tc.min,belowAA:tc.belowAA.length},dropped:st.dropped,layerMs:st.ms,light:st.light};
}
(async()=>{
  const browser=await launch(), out={html:process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html",when:new Date().toISOString(),views:{},sweep:{}};
  const page=await open(browser,[1600,900]); const shots={};
  const OUT=opt("--json");
  for(const fk of [4,1,"model"]) for(const c of LAND){
    if(fk!==4&&!MULTI.includes(c.name)) continue;
    const spec=Object.assign({},c,fk===4?{}:{factor:fk}), key=c.name+(fk===4?"":fk==="model"?"@10.33x":"@1x");
    await page.evaluate(s=>window.__aus.apply(s),spec); await settle(page);
    const r=await measure(page,shots,key); r.dropLimit=T.DROP_LIMIT[c.name]; out.views[key]=r;
    console.log(key.padEnd(26),"solid",(100*r.solidBlack).toFixed(3)+"%","p5",r.p5,"mean",r.meanLum,"AA-",r.contrast.belowAA,"min",r.contrast.min,"drop",r.dropped+"/"+r.dropLimit,r.layerMs+"ms",r.light?JSON.stringify(r.light):"");
    if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
  }
  for(const name of ["overview-field","pratzen-low"]){ const c=CASES.find(x=>x.name===name);
    for(let t=480;t<=960;t+=60){
      await page.evaluate(s=>window.__aus.apply(s),Object.assign({},c,{t,factor:4})); await settle(page);
      const r=await measure(page,null,null); out.sweep[name+"@"+t]=r;
      console.log("sweep",name.padEnd(16),t,"solid",(100*r.solidBlack).toFixed(3)+"%","p5",r.p5,"mean",r.meanLum,"AA-",r.contrast.belowAA,r.light?JSON.stringify(r.light):"");
      if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
    } }
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
  if(opt("--md")&&opt("--before")){
    const B=JSON.parse(fs.readFileSync(opt("--before"),"utf8")), lab=opt("--label")||"after", f=r=>r?(100*r.solidBlack).toFixed(3)+"% · "+r.p5+" · "+r.meanLum+" · "+r.contrast.min+" · "+r.dropped:"-";
    const md=["# "+lab+" against the build before it ("+B.html+")\n","`node tools/stage4/report-4b.js` on each build. Each cell: solid near-black (Stage 0 limit 0.05%) · luminance p5 · mean · lowest map-text contrast as rendered · drops.\n",
      "| view | before | "+lab+" | drop limit | "+lab+": the sun's altitude, true / drawn; the shadow box |","|---|---|---|---|---|"];
    Object.keys(out.views).forEach(k=>{ const a=out.views[k], L=a.light; md.push("| "+k+" | "+f(B.views[k])+" | "+f(a)+" | "+(a.dropLimit!==undefined?a.dropLimit:"-")+" | "+(L?L.alt+" / "+L.drawn+"; "+L.box:"-")+" |"); });
    md.push("\n## The day at 4x\n","| view @ clock | before | "+lab+" | "+lab+": the sun's altitude, true / drawn |","|---|---|---|---|");
    Object.keys(out.sweep).forEach(k=>{ const a=out.sweep[k], L=a.light; md.push("| "+k+" | "+f(B.sweep[k])+" | "+f(a)+" | "+(L?L.alt+" / "+L.drawn:"-")+" |"); });
    fs.writeFileSync(opt("--md"),md.join("\n")+"\n");
  }
  if(opt("--sheet")){
    const keys=["pratzen-low@10.33x","pratzen-low","close-sokolnitz","overview-field","selected-formation","ph8-overview-study"];
    const tiles=keys.filter(k=>shots[k]).map(k=>({png:shots[k],cap:k}));
    fs.writeFileSync(opt("--sheet"),await sheet(page,tiles,3,560,315,(opt("--label")||"")+" ("+path.basename(out.html)+")"));
  }
  if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(2); });
