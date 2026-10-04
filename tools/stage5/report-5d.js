#!/usr/bin/env node
/* Stage 5D (docs/STAGE5_SPEC.md section I, 5D; owner decision 90): the evidence skeleton, measured on the built page. It reads the
   running page through the harness's own measures (tools/visual/measure.js); it changes no source file.
   node tools/stage5/report-5d.js [--json out.json] [--md out.md] [--from out.json] [--sheet out.jpg]

   Per landscape harness view at 1600 x 900 at its factor, four of them also at 1x and 10.33x, and the paper-map views, three states:
   the view as it opens (the skeleton off, its default), the skeleton on in its scope (the selection's family, else the phase), and on
   for the whole day. In each: anchors and legs drawn and those in the free rectangle; the skeleton's share of the free rectangle as
   rendered (measure.js confShare: against the view without it); the map layer's items and drops; the lowest map-text contrast as
   rendered and the texts below AA; solid near-black; the world pass's time (software WebGL: comparable only with itself). */
const fs=require("fs");
const {launch,open,settle,sheet,CASES}=require("../stage2/page.js");
const T=require("../visual/thresholds.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const LAND=CASES.filter(c=>!c.fresh&&c.viewport[0]===1600&&!c.interact);
const MULTI=["overview-field","close-sokolnitz","pratzen-low","ph8-overview-watch"];
const SHEET_KEYS=["overview-field","selected-formation","close-sokolnitz","pratzen-low@10.33x","paper-north-up","paper-drawer"];
const STATE=function(){
  mlLayout(); var r={items:ML.stats.items,dropped:ML.stats.dropped,ms:null,anchors:0,legs:0,anchorsIn:0,legsIn:0,scope:null};
  var t=[]; for(var i=0;i<5;i++){ renderFrame(); t.push(DEV.tWorld); } t.sort(function(a,b){ return a-b; }); r.ms=+t[2].toFixed(2);
  if(SKEL.scope){ var fr=(mode!=="staff")?landFreeRect():MAPCAM.freeRect(), v=new THREE.Vector3();
    function inFree(x,z){ v.set(x,groundY(x,z),z).project(camera); var sx=(v.x*0.5+0.5)*innerWidth, sy=(-v.y*0.5+0.5)*innerHeight; return v.z<1&&sx>=fr[0]&&sx<=fr[2]&&sy>=fr[1]&&sy<=fr[3]; }
    r.anchors=SKEL.marks.length; r.legs=SKEL.scope.legs.length; r.scope=SKEL.scope.whole?(SKEL.scope.sel?"family of "+SKEL.scope.sel:"whole day"):"phase "+SKEL.scope.ph;
    SKEL.marks.forEach(function(m){ if(inFree(m.userData.skel.x,m.userData.skel.z)) r.anchorsIn++; });
    var P=SKEL.lines.geometry.attributes.position;
    SKEL.scope.legs.forEach(function(L){ for(var q=L.seg[0];q<L.seg[1];q++) if(inFree(P.getX(2*q),P.getZ(2*q))){ r.legsIn++; return; } }); }
  return r; };
async function measure(page,shots,key,state,offB64){
  const buf=await page.screenshot({timeout:180000}), b64=buf.toString("base64"); if(shots&&SHEET_KEYS.includes(key)&&state!=="off") shots[key+" "+state]=buf;
  const px=await page.evaluate(b=>window.__aus.pixels(b),b64), tc=await page.evaluate(b=>window.__aus.textContrast(b),b64), st=await page.evaluate(STATE);
  const share=offB64?(await page.evaluate(([a,b])=>window.__aus.confShare(a,b),[b64,offB64])).share:null;
  return {b64,r:Object.assign(st,{solidBlack:px.solidBlack,meanLum:px.meanLum,contrast:{min:tc.min,belowAA:tc.belowAA.length},share})};
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
      await page.evaluate(()=>{ layerOn.skeleton=false; SKEL.day=false; }); await settle(page);
      const off=await measure(page,shots,key,"off",null);
      await page.evaluate(()=>{ layerOn.skeleton=true; SKEL.day=false; }); await settle(page);
      const sc=await measure(page,shots,key,"scope",off.b64);
      await page.evaluate(()=>{ SKEL.day=true; }); await settle(page);
      const day=await measure(page,shots,key,"day",off.b64);
      await page.evaluate(()=>{ layerOn.skeleton=false; SKEL.day=false; }); await settle(page);
      out.views[key]={dropLimit:T.DROP_LIMIT[c.name],off:off.r,scope:sc.r,day:day.r};
      const f=r=>r.scope+" A "+r.anchorsIn+"/"+r.anchors+" L "+r.legsIn+"/"+r.legs+" share "+r.share+" drop "+r.dropped+" AA- "+r.contrast.belowAA+" min "+r.contrast.min+" ms "+r.ms;
      console.log(key.padEnd(26),"off drop "+off.r.dropped+" min "+off.r.contrast.min+" ms "+off.r.ms," | ",f(sc.r)," | ",f(day.r));
      if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1)); }
    if(opt("--sheet")) fs.writeFileSync(opt("--sheet"),await sheet(page,Object.keys(shots).map(k=>({png:shots[k],cap:k})),2,800,450,"Stage 5D: the evidence skeleton ("+out.html+")"));
    if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
    await browser.close();
  }
  if(opt("--md")){
    const g=r=>r?[r.scope,r.anchorsIn+"/"+r.anchors,r.legsIn+"/"+r.legs,(100*r.share).toFixed(1)+"%",r.dropped,r.contrast.min+(r.contrast.belowAA?" ("+r.contrast.belowAA+" below AA)":""),r.ms+" ms"].join(" · "):"-";
    const md=["# Stage 5D: the evidence skeleton ("+out.html+")\n",
      "`node tools/stage5/report-5d.js`. The view as it opens has the skeleton off (its default); then on in its scope (decision 90: the selected formation's family, else the legs meeting the phase) and on for the whole day. Each skeleton cell: scope · anchors in the free rectangle / drawn · legs in the free rectangle / drawn · its share of the free rectangle as rendered · drops · lowest map-text contrast as rendered · the world pass (software WebGL).\n",
      "| view | off: drops (limit) · lowest contrast · world pass | on, in scope | on, the whole day |","|---|---|---|---|"];
    Object.keys(out.views).forEach(k=>{ const v=out.views[k]; md.push("| "+k+" | "+v.off.dropped+" ("+v.dropLimit+") · "+v.off.contrast.min+" · "+v.off.ms+" ms | "+g(v.scope)+" | "+g(v.day)+" |"); });
    fs.writeFileSync(opt("--md"),md.join("\n")+"\n"); console.log(md.join("\n"));
  }
})().catch(e=>{ console.error(e); process.exit(2); });
