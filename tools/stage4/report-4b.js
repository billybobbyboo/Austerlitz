#!/usr/bin/env node
/* Stage 4B (docs/STAGE4_SPEC.md sections A.6, H and I): the light as the build draws it, per view, for a before-and-after table.
   It reads the running page through the harness's own measures (tools/visual/measure.js) and changes nothing.
   node tools/stage4/report-4b.js [--json out.json] [--md out.md] [--before before.json] [--label "Stage 4B"] [--sheet out.jpg]
   AUSTERLITZ_HTML=<build> measures another build (e.g. archive/spine-6b2cccd4.html, the build before 4B).
   --from after.json writes the table (--md, with --before) from a measurement already made, without a browser.

   For every landscape harness view (tools/visual/cases.js) at its own clock and factor, four of them also at 1x and 10.33x, and the
   sweep (the Field vantage and the low Pratzen view at 4x every hour 08:00-16:00): the solid near-black share (the Stage 0 limit
   0.05%), the near-black share, the 5th percentile and the mean of luminance outside the panels, every map text's contrast as
   rendered (the lowest; how many below AA), the map layer's drops against DROP_LIMIT and its pass time, and on a 4B build the light
   (the sun's true and drawn altitude, the shadow box's size); on a 4C build the atmosphere (the haze and the valley fog over the
   ground under the free rectangle, by the page's own atmoAt; the haze at the orbit target) and three views in the valley fog's hours. */
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
    var At=null; if(typeof atmoAt==="function"&&mode!=="staff"){ applyAtmo(); var fr=landFreeRect(), hs=0, vs=0, n=0;
      for(var j=0;j<=8;j++) for(var i=0;i<=12;i++){ var g=groundAt(fr[0]+(fr[2]-fr[0])*i/12,fr[1]+(fr[3]-fr[1])*j/8); if(!g) continue;
        var q=atmoAt(landCam.position,new THREE.Vector3(g[0],groundY(g[0],g[1]),g[1])); hs+=q[0]; vs+=q[1]; n++; }
      At={haze:n?+(hs/n).toFixed(3):null,fog:n?+(vs/n).toFixed(3):null,atTarget:+atmoAt(landCam.position,orbitTarget)[0].toFixed(3),
        top:+ATMO.u.uAtmoC.value.x.toFixed(1),cap:+ATMO.u.uAtmoC.value.w.toFixed(2),visKm:LIGHT_NOW?+LIGHT_NOW.vis.toFixed(1):null}; }
    var L=(typeof LIGHT_NOW!=="undefined"&&LIGHT_NOW&&LIGHT_NOW.sun)?{alt:+LIGHT_NOW.sun.alt.toFixed(1),drawn:+(Math.asin(LIGHT_NOW.dir.y)*180/Math.PI).toFixed(1),twilight:+LIGHT_NOW.twilight.toFixed(2),
      box:SHADOW_FIT.ext,fill:+LIGHT_NOW.fill.toFixed(2)}:null;
    return {dropped:ML.stats.dropped,ms:+t[1].toFixed(2),light:L,atmo:At,clock:clock,phase:curPhase}; });
  return {solidBlack:px.solidBlack,solidBlocks:px.solidBlocks,nearBlack:px.nearBlack,meanLum:px.meanLum,p5:lum.p5,p50:lum.p50,
    contrast:{texts:tc.texts,min:tc.min,belowAA:tc.belowAA.length},dropped:st.dropped,layerMs:st.ms,light:st.light,atmo:st.atmo};
}
(async()=>{
  const FROM=opt("--from");
  const browser=FROM?null:await launch(), out=FROM?JSON.parse(fs.readFileSync(FROM,"utf8")):{html:process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html",when:new Date().toISOString(),views:{},sweep:{}};
  const page=FROM?null:await open(browser,[1600,900]); const shots={};
  const OUT=FROM?null:opt("--json");
  if(!FROM){
  for(const fk of [4,1,"model"]) for(const c of LAND){
    if(fk!==4&&!MULTI.includes(c.name)) continue;
    const spec=Object.assign({},c,fk===4?{}:{factor:fk}), key=c.name+(fk===4?"":fk==="model"?"@10.33x":"@1x");
    await page.evaluate(s=>window.__aus.apply(s),spec); await settle(page);
    const r=await measure(page,shots,key); r.dropLimit=T.DROP_LIMIT[c.name]; out.views[key]=r;
    console.log(key.padEnd(26),"solid",(100*r.solidBlack).toFixed(3)+"%","p5",r.p5,"mean",r.meanLum,"AA-",r.contrast.belowAA,"min",r.contrast.min,"drop",r.dropped+"/"+r.dropLimit,r.layerMs+"ms",r.light?JSON.stringify(r.light):"",r.atmo?JSON.stringify(r.atmo):"");
    if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
  }
  /* Stage 4C: the valley fog's hours, at 4x: the Field vantage at 08:00, the Sokolnitz close view at 08:20, the low Pratzen view at 08:30 */
  out.fog={};
  for(const [name,t] of [["overview-field",480],["close-sokolnitz",500],["pratzen-low",510]]){ const c=CASES.find(x=>x.name===name);
    await page.evaluate(s=>window.__aus.apply(s),Object.assign({},c,{t,factor:4})); await settle(page);
    const r=await measure(page,shots,name+"@"+t); r.dropLimit=T.DROP_LIMIT[name]; out.fog[name+"@"+t]=r;
    console.log("fog",name.padEnd(16),t,"solid",(100*r.solidBlack).toFixed(3)+"%","p5",r.p5,"mean",r.meanLum,"AA-",r.contrast.belowAA,"min",r.contrast.min,"drop",r.dropped,r.atmo?JSON.stringify(r.atmo):"");
    if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1)); }
  for(const name of ["overview-field","pratzen-low"]){ const c=CASES.find(x=>x.name===name);
    for(let t=480;t<=960;t+=60){
      await page.evaluate(s=>window.__aus.apply(s),Object.assign({},c,{t,factor:4})); await settle(page);
      const r=await measure(page,null,null); out.sweep[name+"@"+t]=r;
      console.log("sweep",name.padEnd(16),t,"solid",(100*r.solidBlack).toFixed(3)+"%","p5",r.p5,"mean",r.meanLum,"AA-",r.contrast.belowAA,r.light?JSON.stringify(r.light):"");
      if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
    } }
  if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
  }
  if(opt("--md")&&opt("--before")){
    const B=JSON.parse(fs.readFileSync(opt("--before"),"utf8")), lab=opt("--label")||"after", f=r=>r?(100*r.solidBlack).toFixed(3)+"% · "+r.p5+" · "+r.meanLum+" · "+r.contrast.min+" · "+r.dropped:"-";
    const md=["# "+lab+" against the build before it ("+B.html+")\n","`node tools/stage4/report-4b.js` on each build. Each cell: solid near-black (Stage 0 limit 0.05%) · luminance p5 · mean · lowest map-text contrast as rendered · drops.\n",
      "| view | before | "+lab+" | drop limit | "+lab+": the sun's altitude, true / drawn; the shadow box |","|---|---|---|---|---|"];
    Object.keys(out.views).forEach(k=>{ const a=out.views[k], L=a.light; md.push("| "+k+" | "+f(B.views[k])+" | "+f(a)+" | "+(a.dropLimit!==undefined?a.dropLimit:"-")+" | "+(L?L.alt+" / "+L.drawn+"; "+L.box:"-")+" |"); });
    md.push("\n## The day at 4x\n","| view @ clock | before | "+lab+" | "+lab+": the sun's altitude, true / drawn |","|---|---|---|---|");
    Object.keys(out.sweep).forEach(k=>{ const a=out.sweep[k], L=a.light; md.push("| "+k+" | "+f(B.sweep[k])+" | "+f(a)+" | "+(L?L.alt+" / "+L.drawn:"-")+" |"); });
    const at=a=>a?"haze "+a.haze+", fog "+a.fog+"; at the target "+a.atTarget+"; top "+a.top+" m, cap "+a.cap+"; vis "+a.visKm+" km":"-";
    if(Object.values(out.views).some(a=>a.atmo)){
      md.push("\n## The atmosphere per view\n","Over the ground under the free rectangle (13 x 9 points, the page's own `atmoAt`): the mean haze and valley fog; the haze at the orbit target; the fog's top and cap; the haze's visibility (a design value).\n",
        "| view | mean luminance, before / "+lab+" | "+lab+": the atmosphere |","|---|---|---|");
      Object.keys(out.views).forEach(k=>{ const a=out.views[k], b=B.views[k]; md.push("| "+k+" | "+(b?b.meanLum:"-")+" / "+a.meanLum+" | "+at(a.atmo)+" |"); }); }
    if(out.fog){
      md.push("\n## The valley fog's hours at 4x\n","| view @ clock | before | "+lab+" | "+lab+": the atmosphere |","|---|---|---|---|");
      Object.keys(out.fog).forEach(k=>{ const a=out.fog[k]; md.push("| "+k+" | "+f(B.fog&&B.fog[k])+" | "+f(a)+" | "+at(a.atmo)+" |"); }); }
    fs.writeFileSync(opt("--md"),md.join("\n")+"\n");
  }
  if(opt("--sheet")&&!FROM){
    const keys=["pratzen-low@10.33x","pratzen-low","close-sokolnitz","overview-field","selected-formation","ph8-overview-study"];
    const tiles=keys.filter(k=>shots[k]).map(k=>({png:shots[k],cap:k}));
    fs.writeFileSync(opt("--sheet"),await sheet(page,tiles,3,560,315,(opt("--label")||"")+" ("+path.basename(out.html)+")"));
  }
  if(page&&page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  if(browser) await browser.close();
})().catch(e=>{ console.error(e); process.exit(2); });
