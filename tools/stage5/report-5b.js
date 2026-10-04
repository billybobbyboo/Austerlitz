#!/usr/bin/env node
/* Stage 5B (docs/STAGE5_SPEC.md section I, 5B): spatial confidence, before and after, measured on the built page. It reads the
   running page through the harness's own measures (tools/visual/measure.js); it changes no source file.
   node tools/stage5/report-5b.js [--json out.json] [--md out.md --before before.json] [--from after.json] [--sheet out.jpg]
   AUSTERLITZ_HTML=<build> measures another build (the one before 5B, for the "before").

   Per landscape harness view at 1600 x 900 at its factor, four of them also at 1x and 10.33x, and the paper-map views: the grades
   drawn in the free rectangle, the marks' share of the free rectangle as rendered (a build with the marks: the view drawn once more
   without them, measure.js confShare), solid near-black, mean luminance, the lowest map-text contrast as rendered and the texts
   below AA, the map layer's drops against DROP_LIMIT, the world pass's time (software WebGL: comparable only with itself). */
const fs=require("fs"), path=require("path");
const {launch,open,settle,sheet,CASES,ROOT}=require("../stage2/page.js");
const T=require("../visual/thresholds.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const LAND=CASES.filter(c=>!c.fresh&&c.viewport[0]===1600&&!c.interact);
const MULTI=["overview-field","close-sokolnitz","pratzen-low","ph8-overview-watch"];
const SHEET_KEYS=["pratzen-low","close-sokolnitz","overview-field","pratzen-low-1x","paper-close","hybrid-dimmed"];
async function measure(page,shots,key){
  const buf=await page.screenshot({timeout:180000}), b64=buf.toString("base64"); if(shots&&SHEET_KEYS.includes(key)) shots[key]=buf;
  const px=await page.evaluate(b=>window.__aus.pixels(b),b64), tc=await page.evaluate(b=>window.__aus.textContrast(b),b64);
  const st=await page.evaluate(()=>{ mlLayout(); var r={dropped:ML.stats.dropped,ms:null,grades:null};
    var t=[]; for(var i=0;i<5;i++){ renderFrame(); t.push(DEV.tWorld); } t.sort(function(a,b){ return a-b; }); r.ms=+t[2].toFixed(2);
    if(typeof CONF!=="undefined"){ var fr=(mode!=="staff")?landFreeRect():MAPCAM.freeRect(), v=new THREE.Vector3(), g={A:0,B:0,C:0};
      Object.keys(units).forEach(function(id){ var u=units[id]; [u.foot,u.conf].forEach(function(m){ if(!m||!m.visible||!m.userData.conf) return;
        var p=posNow(id), w=W(p[0],p[1]); v.set(w[0],groundY(w[0],w[1]),w[1]).project(camera);
        var sx=(v.x*0.5+0.5)*innerWidth, sy=(-v.y*0.5+0.5)*innerHeight; if(v.z<1&&sx>=fr[0]&&sx<=fr[2]&&sy>=fr[1]&&sy<=fr[3]) g[m.userData.conf.g]++; }); });
      r.grades=g; }
    return r; });
  let share=null;
  if(await page.evaluate(()=>typeof CONF!=="undefined"&&!!layerOn.confidence)){
    await page.evaluate(()=>{ layerOn.confidence=false; }); await settle(page);
    const off=(await page.screenshot({timeout:180000})).toString("base64");
    await page.evaluate(()=>{ layerOn.confidence=true; }); await settle(page);
    share=(await page.evaluate(([a,b])=>window.__aus.confShare(a,b),[b64,off])).share; }
  return {solidBlack:px.solidBlack,meanLum:px.meanLum,contrast:{min:tc.min,belowAA:tc.belowAA.length},dropped:st.dropped,worldMs:st.ms,grades:st.grades,confShare:share};
}
(async()=>{
  const FROM=opt("--from");
  const out=FROM?JSON.parse(fs.readFileSync(FROM,"utf8")):{html:process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html",when:new Date().toISOString(),views:{}};
  if(!FROM){
    const browser=await launch(), page=await open(browser,[1600,900]), shots={}, OUT=opt("--json");
    for(const fk of [4,1,"model"]) for(const c of LAND){
      if(fk!==4&&(!MULTI.includes(c.name)||c.mode==="staff"||c.factor)) continue;
      const key=c.name+(fk===4?"":fk==="model"?"@10.33x":"@1x");
      await page.evaluate(s=>window.__aus.apply(s),Object.assign({},c,fk===4?{}:{factor:fk})); await settle(page);
      const r=await measure(page,shots,key); r.dropLimit=T.DROP_LIMIT[c.name]; out.views[key]=r;
      console.log(key.padEnd(26),"grades",JSON.stringify(r.grades),"share",r.confShare,"solid",(100*r.solidBlack).toFixed(3)+"%","mean",r.meanLum,
        "AA-",r.contrast.belowAA,"min",r.contrast.min,"drop",r.dropped+"/"+r.dropLimit,"ms",r.worldMs);
      if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1)); }
    if(opt("--sheet")) fs.writeFileSync(opt("--sheet"),await sheet(page,Object.keys(shots).map(k=>({png:shots[k],cap:k})),2,800,450,"Stage 5B: "+out.html));
    if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
    await browser.close();
  }
  if(opt("--md")&&opt("--before")){
    const B=JSON.parse(fs.readFileSync(opt("--before"),"utf8")), f=r=>r?[(r.confShare===null?"-":(100*r.confShare).toFixed(1)+"%"),(100*r.solidBlack).toFixed(3)+"%",r.meanLum,r.contrast.min+(r.contrast.belowAA?" ("+r.contrast.belowAA+" below AA)":""),r.dropped+"/"+r.dropLimit,r.worldMs+" ms"].join(" · "):"-";
    const md=["# Stage 5B against the build before it ("+B.html+")\n","`node tools/stage5/report-5b.js` on each build. Each cell: the position-confidence marks' share of the free rectangle as rendered · solid near-black (limit 0.05%) · mean luminance · lowest map-text contrast as rendered · drops / limit · the world pass (software WebGL).\n",
      "| view | grades in the free rectangle A/B/C (5B) | before 5B | 5B |","|---|---|---|---|"];
    Object.keys(out.views).forEach(k=>{ const a=out.views[k], g=a.grades; md.push("| "+k+" | "+(g?g.A+"/"+g.B+"/"+g.C:"-")+" | "+f(B.views[k])+" | "+f(a)+" |"); });
    fs.writeFileSync(opt("--md"),md.join("\n")+"\n"); console.log(md.join("\n"));
  }
})().catch(e=>{ console.error(e); process.exit(2); });
