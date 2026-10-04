#!/usr/bin/env node
/* Stage 5E (docs/STAGE5_SPEC.md section I, 5E; owner decisions 91, 92): "Whose eyes?" and the eye-level vantage, measured on the built
   page. It reads the running page through the harness's own measures (tools/visual/measure.js); it changes no source file.
   node tools/stage5/report-5e.js [--json out.json] [--md out.md] [--from out.json] [--sheet out.jpg]

   1. The reading over the day: every 10 minutes for both headquarters, the readings that differ between the cache keyed by the phase
      (before 5E) and the rule at the clock (5E), by kind.
   2. "Reported only" on screen: Napoleon's and the Allied headquarters at 05:00, 08:00 and 10:00 from the Field vantage, in the landscape,
      with counters and on the paper map: formations reported only, drawn as the C zone, with their name or counter drawn and marked "?".
   3. The viewshed from each headquarters' plotted position at each of its anchors: the share of the modelled ground in sight, of it
      fogged (while the mist exceeds 0.5), the time to compute (software), cells against the rule's threshold.
   4. The eye-level vantage, Napoleon's headquarters at 08:30, 10:00 and 13:00 and the Allied at 08:00 and 10:00, at 1x, 4x and 10.33x:
      the eye's height above the drawn ground against 3 m scaled, enemy figures drawn and those the model hides from the headquarters,
      "not known" drawn, reported only drawn as zones; solid near-black, mean luminance, the lowest map-text contrast as rendered, drops,
      the world pass's time. */
const fs=require("fs");
const {launch,open,settle,sheet,CASES}=require("../stage2/page.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const READING=function(){
  var out={}, keep=commandView;
  ["fr","al"].forEach(function(cv){ setCommandView(cv); var first={}, n=0, diff=0, kinds={};
    for(var t=T_MIN;t<=T_MAX;t+=10){ setClock(t,{instant:true,camera:false}); knowKey="";
      Object.keys(units).forEach(function(id){ if(sideOfNation(FORMATIONS[id].nation)===cv||!posNow(id)) return; var k=knowledgeOf(id), fk=curPhase+"|"+id; n++;
        if(first[fk]===undefined) first[fk]=k; else if(first[fk]!==k){ diff++; var q=first[fk]+" > "+k; kinds[q]=(kinds[q]||0)+1; } }); }
    out[cv]={readings:n,differ:diff,kinds:kinds}; });
  setCommandView(keep); return out; };
const MARKED=function(cv,t,md){
  setCommandView(cv); setMode(md); setClock(t,{instant:true,force:true,camera:false});
  if(md==="staff") MAPCAM.frameField(true); else flyTo(VANTAGE.field); AUSTERLITZ_DEBUG.settle(2); AUSTERLITZ_DEBUG.settle(4); mlLayout();
  var r={unc:0,zone:0,drawn:0,marked:0,figures:0};
  Object.keys(units).forEach(function(id){ if(drawnKnow(id)!=="uncertain"||!posNow(id)) return; r.unc++; var u=units[id];
    if(u.conf&&u.conf.visible&&u.conf.userData.conf.g==="C") r.zone++; if(u.block&&u.block.visible) r.figures++;
    var it=ML.items[(md==="terrain"?"n:":"c:")+id]; if(it&&it.eFrame===ML.frame&&it.state==="on"){ r.drawn++; var b=it.el.querySelector(md==="terrain"?".mln-bdg":".mlc-badge"); if(b&&b.textContent==="?") r.marked++; } });
  return r; };
const VIEWSHED=function(){
  var out=[], keep=commandView, kc=clock;
  ["fr","al"].forEach(function(cv){ setCommandView(cv); var hq=EYES.HQ[cv];
    anchorList(hq).forEach(function(a){ if(!a.p) return; setClock(Math.max(T_MIN,a.arr),{instant:true,force:true,camera:false});
      var t0=performance.now(); eyesViewshed(true); var ms=performance.now()-t0, vis=0, fog=0, wrong=0, all=0;
      for(var j=0;j<G_NZ;j++) for(var i=0;i<G_NX;i++){ var x=G_X0+i*G_DX, z=G_Z0+j*G_DZ; if(Math.abs(x)>178||Math.abs(z)>153) continue; all++; var k=j*G_NX+i; if(!vsMask[k]) continue; vis++;
        if(vsMask[k]===2) fog++; if((vsMask[k]===2)!==(PHASES[curPhase].mist>0.5&&height(x,z)<ATMO.FOG_TOP_H)) wrong++; }
      out.push({hq:cv,phase:a.ph,at:fmtClock(clock),visible:+(vis/all).toFixed(4),fogged:vis?+(fog/vis).toFixed(4):0,ms:+ms.toFixed(1),wrong:wrong}); }); });
  setCommandView(keep); setClock(kc,{instant:true,force:true,camera:false}); return out; };
const EYEV=function(cv,t){
  setMode("terrain"); setCommandView(cv); setClock(t,{instant:true,force:true,camera:false}); AUSTERLITZ_DEBUG.settle(2); var ok=eyeEnter(); AUSTERLITZ_DEBUG.settle(6); mlLayout();
  var hq=posNow(EYES.HQ[cv]), L=landCam.position, r={on:ok&&EYE.on,dy:+(L.y-groundY(L.x,L.z)).toFixed(4),want:+eyeHeight().toFixed(4),figures:0,hidden:0,unknownDrawn:0,zones:0,dropped:ML.stats.dropped,ms:null};
  Object.keys(units).forEach(function(id){ var f=FORMATIONS[id], u=units[id], p=posNow(id); if(sideOfNation(f.nation)===cv||!p) return;
    if(u.block&&u.block.visible){ r.figures++; if(!hasLOS(hq,p)) r.hidden++; }
    if(knowledgeOf(id)==="unknown"&&((u.block&&u.block.visible)||(u.conf&&u.conf.visible))) r.unknownDrawn++;
    if(u.conf&&u.conf.visible&&drawnKnow(id)==="uncertain") r.zones++; });
  var tt=[]; for(var i=0;i<5;i++){ renderFrame(); tt.push(DEV.tWorld); } tt.sort(function(a,b){ return a-b; }); r.ms=+tt[2].toFixed(2);
  return r; };
(async()=>{
  const FROM=opt("--from");
  const out=FROM?JSON.parse(fs.readFileSync(FROM,"utf8")):{html:process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html",when:new Date().toISOString()};
  if(!FROM){
    const browser=await launch(), page=await open(browser,[1600,900]), tiles=[], field=CASES.find(c=>c.name==="overview-field");
    await page.evaluate(s=>window.__aus.apply(s),field); await settle(page);
    out.reading=await page.evaluate(READING); console.log("reading",JSON.stringify(out.reading));
    out.marked={};
    for(const cv of ["fr","al"]) for(const t of [300,480,600]) for(const md of ["terrain","hybrid","staff"]){
      await page.evaluate(s=>window.__aus.apply(s),field); await settle(page);
      const k=cv+" "+t+" "+md; out.marked[k]=await page.evaluate(new Function("a","return ("+MARKED.toString()+")(a[0],a[1],a[2])"),[cv,t,md]);
      console.log("marked",k,JSON.stringify(out.marked[k])); }
    await page.evaluate(s=>window.__aus.apply(s),field); await settle(page);
    out.viewshed=await page.evaluate(VIEWSHED); out.viewshed.forEach(v=>console.log("viewshed",JSON.stringify(v)));
    out.eye={};
    for(const fk of [1,4,"model"]) for(const [cv,t] of [["fr",510],["fr",600],["fr",780],["al",480],["al",600]]){
      await page.evaluate(s=>window.__aus.apply(s),Object.assign({},field,{factor:fk})); await settle(page);
      const r=await page.evaluate(new Function("a","return ("+EYEV.toString()+")(a[0],a[1])"),[cv,t]); await settle(page);
      const buf=await page.screenshot({timeout:240000}), b64=buf.toString("base64");
      const px=await page.evaluate(b=>window.__aus.pixels(b),b64), tc=await page.evaluate(b=>window.__aus.textContrast(b),b64);
      Object.assign(r,{solidBlack:px.solidBlack,meanLum:px.meanLum,contrast:{min:tc.min,belowAA:tc.belowAA.length}});
      const k=cv+" "+t+" @"+(fk==="model"?"10.33":fk)+"x"; out.eye[k]=r; console.log("eye",k,JSON.stringify(r));
      if((cv==="fr"&&t===510)||(cv==="al"&&t===480&&fk===4)||(cv==="fr"&&t===780&&fk===4)) tiles.push({png:buf,cap:"eye level, "+k});
      await page.evaluate(()=>{ eyeLeave(); setCommandView("none"); });
      if(opt("--json")) fs.writeFileSync(opt("--json"),JSON.stringify(out,null,1)); }
    if(opt("--json")) fs.writeFileSync(opt("--json"),JSON.stringify(out,null,1));
    if(opt("--sheet")) fs.writeFileSync(opt("--sheet"),await sheet(page,tiles,2,800,450,"Stage 5E: the eye-level vantage ("+out.html+")"));
    if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
    await browser.close();
  }
  if(opt("--md")){
    const md=["# Stage 5E: \"Whose eyes?\" and the eye-level vantage ("+out.html+")\n","`node tools/stage5/report-5e.js`.\n",
      "## The reading over the day (every 10 minutes)\n","| headquarters | enemy readings | the cache keyed by the phase (before 5E) differs from the rule at the clock (5E) | by kind (before > at the clock) |","|---|---|---|---|"];
    Object.keys(out.reading).forEach(k=>{ const r=out.reading[k]; md.push("| "+k+" | "+r.readings+" | "+r.differ+" | "+Object.entries(r.kinds).map(([a,b])=>a+": "+b).join(", ")+" |"); });
    md.push("\n## Reported only, on screen (the Field vantage; the paper map framed)\n","| headquarters, clock, view | reported only | drawn as the C zone | with figures | name or counter drawn | of them marked \"?\" |","|---|---|---|---|---|---|");
    Object.keys(out.marked).forEach(k=>{ const r=out.marked[k]; md.push("| "+k+" | "+r.unc+" | "+r.zone+" | "+r.figures+" | "+r.drawn+" | "+r.marked+" |"); });
    md.push("\n## The viewshed from each headquarters' plotted position (at each anchor)\n","| headquarters | phase, at | modelled ground in sight | of it fogged | cells against the rule's threshold | computed in (software) |","|---|---|---|---|---|---|");
    out.viewshed.forEach(v=>md.push("| "+v.hq+" | "+v.phase+", "+v.at+" | "+(100*v.visible).toFixed(1)+"% | "+(100*v.fogged).toFixed(1)+"% | "+v.wrong+" | "+v.ms+" ms |"));
    md.push("\n## The eye-level vantage\n","| headquarters, clock, factor | the eye above the ground (want) | enemy figures drawn / hidden from the headquarters | not known drawn | reported zones | drops | solid near-black | mean luminance | lowest map-text contrast | world pass |","|---|---|---|---|---|---|---|---|---|---|");
    Object.keys(out.eye).forEach(k=>{ const r=out.eye[k]; md.push("| "+k+" | "+r.dy+" ("+r.want+") | "+r.figures+" / "+r.hidden+" | "+r.unknownDrawn+" | "+r.zones+" | "+r.dropped+" | "+(100*r.solidBlack).toFixed(3)+"% | "+r.meanLum+" | "+r.contrast.min+(r.contrast.belowAA?" ("+r.contrast.belowAA+" below AA)":"")+" | "+r.ms+" ms |"); });
    fs.writeFileSync(opt("--md"),md.join("\n")+"\n"); console.log(md.join("\n"));
  }
})().catch(e=>{ console.error(e); process.exit(2); });
