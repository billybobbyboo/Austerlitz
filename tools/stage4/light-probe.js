#!/usr/bin/env node
/* Stage 4 Part A (docs/STAGE4_SPEC.md section A): the light, tried on the built page by a probe. The probe changes the running
   page's sun, its grade's shadow toe and its ground shader's baked hillshade (measurement code, not the Stage 4 implementation);
   it changes no source file. node tools/stage4/light-probe.js [--json out.json] [--sheet out.jpg] [--views a,b] [--no-sweep]

   For every landscape harness view (tools/visual/cases.js) at its own clock, and for four of them at 1x, 4x and 10.33x, seven
   variants of the light:
     A  today: the phase's LIGHT preset (app.js), the shadow toe on, the landscape's narrowed baked hillshade (0.70-1.12);
     B  today without the toe;
     C  the computed sun (tools/stage4/ephem.js, the clock read as local apparent time) in place of the preset's direction, the
        preset's colour, intensity, sky fill, fog and grade kept; the toe on;
     D  C without the toe;
     E  the computed sun corrected to the display factor (tan alt_k = k tan alt: the lit side and the cast shadows of the drawn
        ground are then the true ground's under the true sun; tools/stage4/sun.js), no toe;
     F  E with the baked hillshade at its full range before Stage 0's correction (0.46-1.20);
     G  E with no baked hillshade on the landscape (every point at the flat ground's value, 0.994).
   Each is rendered through the app's own frame path (renderFrame: FX on, the map layer laid out), screenshot, and measured:
   the harness's pixel measure (near-black share; solid near-black 8x8 blocks, the Stage 0 limit 0.05%; mean luminance), the
   1st and 5th percentile of luminance outside the panels, every map-layer text's contrast on the rendered frame (the harness's
   method), the map layer's drops against DROP_LIMIT and its pass time, and the frame's world and post-processing times
   (DEV.tWorld, DEV.tPost; software WebGL, so relative only). The unobstructed fraction and the camera are not touched by the
   light; they are read once per view, as the check that they did not move.
   The sweep: the Field vantage and the low Pratzen view at 4x, every hour 08:00-16:00, variants A, D and E. */
const fs=require("fs"), path=require("path");
const {launch,open,settle,sheet,CASES,ROOT}=require("../stage2/page.js");
const T=require("../visual/thresholds.js");
const {makeSun}=require("./ephem.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; }, flag=k=>args.includes(k);

const PROBE=function(makeSunSrc){
  var P4={}, D2R=Math.PI/180;
  var sunAtClock=(new Function("return "+makeSunSrc))()(49.14,16.76);
  var N=GEOREF.NORTH, E=[-N[1],N[0]];
  P4.sunVec=function(az,alt,R){ var a=az*D2R, hx=Math.sin(a)*E[0]+Math.cos(a)*N[0], hz=Math.sin(a)*E[1]+Math.cos(a)*N[1];
    return new THREE.Vector3(hx*Math.cos(alt*D2R)*R,Math.sin(alt*D2R)*R,hz*Math.cos(alt*D2R)*R); };
  P4.place=function(){ sun.target.position.copy(orbitTarget); sun.target.updateMatrixWorld(); sun.position.copy(orbitTarget).add(sunDir); sun.updateMatrixWorld();
    if(sunDisc){ sunDisc.position.copy(sunDir).normalize().multiplyScalar(560).add(orbitTarget); sunDisc.visible=sunDisc.material.opacity>0.02; } };
  P4.saved=null;
  P4.save=function(){ P4.saved={p:sunDir.clone()}; };
  P4.restore=function(){ if(P4.saved) sunDir.copy(P4.saved.p); P4.place(); };
  P4.sunNow=function(){ return sunAtClock(clock,"apparent"); };
  /* the light's direction: "preset" (as the app left it), "true" (the computed sun), "corrected" (its vertical scaled by the factor) */
  P4.dir=function(kind){
    P4.restore(); if(kind==="preset") return null;
    var s=P4.sunNow(), alt=s.alt; if(kind==="corrected") alt=Math.atan(DISPLAY.factor*Math.tan(alt*D2R))/D2R;
    sunDir.copy(P4.sunVec(s.az,alt,P4.saved.p.length())); P4.place(); return {az:+s.az.toFixed(1),alt:+s.alt.toFixed(1),drawnAlt:+alt.toFixed(1)};
  };
  /* the grade's shadow toe (app.js initFX, the composite's last lines) */
  P4.toe=function(on){ var m=FX.matComp, a="srgb+=1.2*srgb*tt*tt/0.04;", b="srgb+=0.0*srgb*tt*tt/0.04;", want=on?a:b, other=on?b:a;
    if(m.fragmentShader.indexOf(other)>=0){ m.fragmentShader=m.fragmentShader.replace(other,want); m.needsUpdate=true; } return m.fragmentShader.indexOf(want)>=0; };
  /* the landscape's baked hillshade (world.js GROUND_FRAG_MAIN): narrow (today), full (before Stage 0's correction), none */
  var HILL={narrow:"(0.70+0.42*sh)",full:"(0.46+0.74*sh)",none:"(0.994)"}, hillNow="narrow";
  P4.hill=function(kind){ if(kind===hillNow) return true; var src=window.GROUND_FRAG_MAIN, from=":"+HILL[hillNow]+")";
    if(src.indexOf(from)<0) return false; window.GROUND_FRAG_MAIN=src.replace(from,":"+HILL[kind]+")"); hillNow=kind;
    var m=groundMesh.material; m.customProgramCacheKey=function(){ return "stage4-hill-"+kind; }; m.needsUpdate=true; return true; };
  /* the luminance percentiles of a screenshot outside the panels (the harness's panel list) */
  P4.lum=function(b64){ return new Promise(function(res){ var im=new Image(); im.onload=function(){
    var cv=document.createElement("canvas"); cv.width=im.width; cv.height=im.height; var x=cv.getContext("2d",{willReadFrequently:true}); x.drawImage(im,0,0);
    var d=x.getImageData(0,0,cv.width,cv.height).data, R=[], h=new Uint32Array(256), n=0;
    [".rail",".dispatch",".legend",".timebar",".tools","#viewmode","#firstrun",".drawer","#tourbar","#selchip","#devstats","#restore","#layerpop","#vsbadge","#toast"].forEach(function(s){
      document.querySelectorAll(s).forEach(function(e){ var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||+cs.opacity<0.05||e.hidden) return;
        if((e.classList.contains("rail")&&document.body.classList.contains("rail-hidden"))||(e.classList.contains("drawer")&&!e.classList.contains("on"))) return;
        var r=e.getBoundingClientRect(); if(r.width>0&&r.height>0) R.push([r.left,r.top,r.right,r.bottom]); }); });
    for(var y=0;y<cv.height;y+=2) for(var xx=0;xx<cv.width;xx+=2){ var ui=false; for(var k=0;k<R.length;k++){ var r=R[k]; if(xx>=r[0]&&xx<r[2]&&y>=r[1]&&y<r[3]){ ui=true; break; } }
      if(ui) continue; var o=(y*cv.width+xx)*4; h[Math.round(0.2126*d[o]+0.7152*d[o+1]+0.0722*d[o+2])]++; n++; }
    function q(f){ var c=0, t=f*n; for(var i=0;i<256;i++){ c+=h[i]; if(c>=t) return i; } return 255; }
    var u25=0; for(var i2=0;i2<25;i2++) u25+=h[i2];
    res({p1:q(0.01),p5:q(0.05),p50:q(0.5),under25:n?+(u25/n).toFixed(4):0}); }; im.src="data:image/png;base64,"+b64; }); };
  P4.frame=function(){ var w=0,p=0; for(var i=0;i<3;i++){ renderFrame(); w+=DEV.tWorld; p+=DEV.tPost; } return {world:+(w/3).toFixed(1),post:+(p/3).toFixed(1)}; };
  P4.layer=function(){ mlLayout(); var t=[]; for(var i=0;i<3;i++){ var a=performance.now(); mlLayout(); t.push(performance.now()-a); } t.sort(function(a,b){ return a-b; });
    return {dropped:ML.stats.dropped,placed:ML.stats.placed,ms:+t[1].toFixed(2)}; };
  P4.state=function(){ var c=landCam.position; return {clock:clock,phase:curPhase,light:PHASES[curPhase].light,factor:+DISPLAY.factor.toFixed(2),
    eye:[+c.x.toFixed(2),+c.y.toFixed(2),+c.z.toFixed(2)],clearance:+(c.y-camGround(c.x,c.z)).toFixed(3),unobstructed:window.__aus.unobstructed(),
    shadowBox:[sun.shadow.camera.right-sun.shadow.camera.left,sun.shadow.camera.top-sun.shadow.camera.bottom],shadowPx:sun.shadow.mapSize.x}; };
  window.__p4=P4; return true;
};

const VARIANTS=[
  {k:"A",dir:"preset",toe:true,hill:"narrow",note:"today"},
  {k:"B",dir:"preset",toe:false,hill:"narrow",note:"today, no toe"},
  {k:"C",dir:"true",toe:true,hill:"narrow",note:"computed sun, toe"},
  {k:"D",dir:"true",toe:false,hill:"narrow",note:"computed sun, no toe"},
  {k:"E",dir:"corrected",toe:false,hill:"narrow",note:"computed sun corrected to the factor, no toe"},
  {k:"F",dir:"corrected",toe:false,hill:"full",note:"E, full baked hillshade"},
  {k:"G",dir:"corrected",toe:false,hill:"none",note:"E, no baked hillshade"}];
const LAND=CASES.filter(c=>!c.fresh&&c.mode!=="staff"&&!c.interact&&c.viewport[0]===1600&&!c.factor);
const MULTI=["overview-field","close-sokolnitz","pratzen-low","ph8-overview-study"];
const FACTORS=[1,4,"model"];

async function measure(page,c,v,fk,shots){
  const info=await page.evaluate(v=>{ __p4.toe(v.toe); __p4.hill(v.hill); return __p4.dir(v.dir); },v);
  const fr=await page.evaluate(()=>__p4.frame());
  const buf=await page.screenshot({timeout:180000}), b64=buf.toString("base64");
  const px=await page.evaluate(b=>window.__aus.pixels(b),b64);
  const lum=await page.evaluate(b=>__p4.lum(b),b64);
  const tc=await page.evaluate(b=>window.__aus.textContrast(b),b64);
  const ly=await page.evaluate(()=>__p4.layer());
  if(shots) shots.push({key:c.name+"@"+fk+":"+v.k,png:buf});
  return {variant:v.k,sun:info,frameMs:fr,nearBlack:px.nearBlack,solidBlack:px.solidBlack,solidBlocks:px.solidBlocks,meanLum:px.meanLum,
    lum,contrast:{texts:tc.texts,min:tc.min,belowAA:tc.belowAA.length},layer:ly};
}
(async()=>{
  const browser=await launch(), out={when:new Date().toISOString(),variants:VARIANTS,views:{},sweep:{}};
  const page=await open(browser,[1600,900]);
  await page.evaluate(PROBE.toString().replace(/^function\s*\(makeSunSrc\)\s*\{/,"(function(makeSunSrc){")+")("+JSON.stringify(makeSun.toString())+")");
  const only=opt("--views"), shots=[];
  for(const fk of FACTORS){
    for(const c of LAND){
      if(only&&!only.split(",").includes(c.name)) continue;
      if(fk!==4&&!MULTI.includes(c.name)) continue;
      const spec=Object.assign({},c,{factor:fk});
      await page.evaluate(s=>window.__aus.apply(s),spec); await settle(page);
      await page.evaluate(()=>{ __p4.save(); });
      const st=await page.evaluate(()=>__p4.state());
      const key=c.name+"@"+(fk==="model"?"10.33":fk)+"x", rows=[];
      for(const v of VARIANTS){ rows.push(await measure(page,c,v,fk==="model"?"10.33":fk,shots)); }
      await page.evaluate(()=>{ __p4.toe(true); __p4.hill("narrow"); __p4.restore(); });
      const st2=await page.evaluate(()=>__p4.state());
      out.views[key]={case:c.name,state:st,stateAfter:{unobstructed:st2.unobstructed,clearance:st2.clearance,eye:st2.eye},dropLimit:T.DROP_LIMIT[c.name],rows};
      console.log(key.padEnd(28),st.light.padEnd(9),"t",st.clock,rows.map(r=>r.variant+": blk "+r.nearBlack+" solid "+r.solidBlocks+" p1 "+r.lum.p1+" p5 "+r.lum.p5+" lum "+r.meanLum+" AA- "+r.contrast.belowAA+" min "+r.contrast.min+" drop "+r.layer.dropped+(r.sun?" alt "+r.sun.alt+"/"+r.sun.drawnAlt:"")).join(" | "));
      fs.writeFileSync(opt("--json")||path.join(ROOT,"docs","stage4-evidence","light-probe.json"),JSON.stringify(out,null,1));
    }
  }
  if(!flag("--no-sweep")){
    for(const name of ["overview-field","pratzen-low"]){
      const c=CASES.find(x=>x.name===name);
      for(let t=480;t<=960;t+=60){
        await page.evaluate(s=>window.__aus.apply(s),Object.assign({},c,{t,factor:4})); await settle(page);
        await page.evaluate(()=>{ __p4.save(); });
        const st=await page.evaluate(()=>__p4.state()), rows=[];
        for(const v of VARIANTS.filter(v=>["A","D","E"].includes(v.k))) rows.push(await measure(page,c,v,"4",null));
        await page.evaluate(()=>{ __p4.toe(true); __p4.hill("narrow"); __p4.restore(); });
        out.sweep[name+"@"+t]={state:st,rows};
        console.log("sweep",name,t,st.light,rows.map(r=>r.variant+": blk "+r.nearBlack+" solid "+r.solidBlocks+" p5 "+r.lum.p5+" lum "+r.meanLum+(r.sun?" alt "+r.sun.alt+"/"+r.sun.drawnAlt:"")).join(" | "));
        fs.writeFileSync(opt("--json")||path.join(ROOT,"docs","stage4-evidence","light-probe.json"),JSON.stringify(out,null,1));
      }
    }
  }
  if(opt("--sheet")&&shots.length){
    const pick=[["pratzen-low@10.33","A"],["pratzen-low@10.33","B"],["pratzen-low@10.33","D"],["pratzen-low@10.33","E"],
      ["close-sokolnitz@4","A"],["close-sokolnitz@4","B"],["close-sokolnitz@4","D"],["close-sokolnitz@4","E"],
      ["overview-field@4","A"],["overview-field@4","E"],["overview-field@4","F"],["overview-field@4","G"]];
    const tiles=pick.map(([k,v])=>{ const s=shots.find(x=>x.key===k+":"+v); return s?{png:s.png,cap:k+"x "+v+": "+VARIANTS.find(x=>x.k===v).note}:null; }).filter(Boolean);
    fs.writeFileSync(opt("--sheet"),await sheet(page,tiles,4,560,315,"Stage 4 Part A: the light (tools/stage4/light-probe.js)"));
  }
  if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(2); });
