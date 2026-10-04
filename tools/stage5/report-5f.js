#!/usr/bin/env node
/* Stage 5F (docs/STAGE5_SPEC.md section I, 5F; owner decisions 93, 94): the ordered routes, measured on the built page. It reads the
   running page through the harness's own measures (tools/visual/measure.js); it changes no source file.
   node tools/stage5/report-5f.js [--json out.json] [--md out.md] [--from out.json] [--sheet out.jpg]

   1. Per landscape harness view at 1600 x 900 at its factor, four of them also at 1x and 10.33x, and the paper-map views, the routes off
      (as the view opens) and on: routes drawn and those in the free rectangle, their share of the free rectangle as rendered (measure.js
      confShare against the view without them), the map layer's items and drops, the lowest map-text contrast as rendered and the texts
      below AA, solid near-black, the world pass's time (software WebGL: comparable only with itself).
   2. Where plan and execution part (derived): for every formation a plan column names, the largest distance of its executed position
      (every 10 minutes over the day) from that column's route, as the dossier gives it.
   3. The phase-0 rule: each axis arrow's column and its mean distance from the route. */
const fs=require("fs");
const {launch,open,settle,sheet,CASES}=require("../stage2/page.js");
const T=require("../visual/thresholds.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const LAND=CASES.filter(c=>!c.fresh&&c.viewport[0]===1600&&!c.interact&&!c.eye&&!c.plan);
const MULTI=["overview-field","close-sokolnitz","pratzen-low","ph8-overview-watch"];
const SHEET_KEYS=["overview-field","selected-formation","close-sokolnitz","pratzen-low@10.33x"];
const STATE=function(){
  mlLayout(); var r={items:ML.stats.items,dropped:ML.stats.dropped,ms:null,routes:0,inFree:0};
  var t=[]; for(var i=0;i<5;i++){ renderFrame(); t.push(DEV.tWorld); } t.sort(function(a,b){ return a-b; }); r.ms=+t[2].toFixed(2);
  if(ROUTES.grp){ var fr=(mode!=="staff")?landFreeRect():MAPCAM.freeRect(), v=new THREE.Vector3();
    r.routes=ROUTES.grp.children.length;
    ROUTES.grp.children.forEach(function(m){ var c=PLANS[m.userData.route.sd].cols[m.userData.route.ci];
      if(c.route.some(function(q){ var w=W(q[0],q[1]); v.set(w[0],groundY(w[0],w[1]),w[1]).project(camera); var sx=(v.x*0.5+0.5)*innerWidth, sy=(-v.y*0.5+0.5)*innerHeight;
        return v.z<1&&sx>=fr[0]&&sx<=fr[2]&&sy>=fr[1]&&sy<=fr[3]; })) r.inFree++; }); }
  return r; };
const DEVIATION=function(){ var out=[], seen={};
  ["al","fr"].forEach(function(sd){ PLANS[sd].cols.forEach(function(c){ c.forms.forEach(function(id){ if(!units[id]||seen[id]) return; seen[id]=1;
    routeDeviation(id).forEach(function(q){ out.push({id:id,name:FORMATIONS[id].name,col:q.col,km:+q.km.toFixed(2)}); }); }); }); });
  var ax=routeAxis0(); return {deviation:out,axis0:Object.keys(ax).map(function(k){ var p=k.split(":"); return {col:PLANS[p[0]].cols[+p[1]].n,arrow:ax[k].label,meanM:Math.round(ax[k].dist*GEOREF.KM_PER_MAP*1000)}; })}; };
async function measure(page,shots,key,state,offB64){
  const buf=await page.screenshot({timeout:180000}), b64=buf.toString("base64"); if(shots&&SHEET_KEYS.includes(key)&&state==="on") shots[key]=buf;
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
      await page.evaluate(()=>{ layerOn.routes=false; }); await settle(page);
      const off=await measure(page,shots,key,"off",null);
      await page.evaluate(()=>{ layerOn.routes=true; }); await settle(page);
      const on=await measure(page,shots,key,"on",off.b64);
      await page.evaluate(()=>{ layerOn.routes=false; }); await settle(page);
      out.views[key]={dropLimit:T.DROP_LIMIT[c.name],off:off.r,on:on.r};
      console.log(key.padEnd(26),"off drop "+off.r.dropped+" min "+off.r.contrast.min+" ms "+off.r.ms," | on routes "+on.r.inFree+"/"+on.r.routes+" share "+on.r.share+" drop "+on.r.dropped+" AA- "+on.r.contrast.belowAA+" min "+on.r.contrast.min+" ms "+on.r.ms);
      if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1)); }
    Object.assign(out,await page.evaluate(DEVIATION)); console.log("deviation",JSON.stringify(out.deviation)); console.log("axis0",JSON.stringify(out.axis0));
    if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
    if(opt("--sheet")) fs.writeFileSync(opt("--sheet"),await sheet(page,Object.keys(shots).map(k=>({png:shots[k],cap:k+", ordered routes on"})),2,800,450,"Stage 5F: the ordered routes ("+out.html+")"));
    if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
    await browser.close();
  }
  if(opt("--md")){
    const g=r=>[r.inFree+"/"+r.routes,(100*r.share).toFixed(1)+"%",r.dropped,r.contrast.min+(r.contrast.belowAA?" ("+r.contrast.belowAA+" below AA)":""),r.ms+" ms"].join(" · ");
    const md=["# Stage 5F: the ordered routes ("+out.html+")\n","`node tools/stage5/report-5f.js`. Off as the view opens (the default); on: routes in the free rectangle / drawn · their share of the free rectangle as rendered · drops · lowest map-text contrast as rendered · the world pass (software WebGL).\n",
      "| view | off: drops (limit) · lowest contrast · world pass | on |","|---|---|---|"];
    Object.keys(out.views).forEach(k=>{ const v=out.views[k]; md.push("| "+k+" | "+v.off.dropped+" ("+v.dropLimit+") · "+v.off.contrast.min+" · "+v.off.ms+" ms | "+g(v.on)+" |"); });
    md.push("\n## Where plan and execution part (derived: the largest distance from the column's route, every 10 minutes over the day)\n","| formation | column | km |","|---|---|---|");
    out.deviation.forEach(d=>md.push("| "+d.name+" | "+d.col+" | "+d.km+" |"));
    md.push("\n## The phase-0 rule: the columns the axis arrows already draw\n","| column | axis arrow | mean distance of the arrow's points from the route |","|---|---|---|");
    out.axis0.forEach(a=>md.push("| "+a.col+" | "+a.arrow+" | "+a.meanM+" m |"));
    fs.writeFileSync(opt("--md"),md.join("\n")+"\n"); console.log(md.join("\n"));
  }
})().catch(e=>{ console.error(e); process.exit(2); });
