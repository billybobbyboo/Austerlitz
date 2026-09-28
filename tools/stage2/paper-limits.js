#!/usr/bin/env node
/* Stage 2E (docs/STAGE2_SPEC.md sections J and K; owner decision 39): the drop limits and the unobstructed baselines of the
   paper-map harness views that 2E adds, measured on the Stage 2C build (archive/stage2c-68ac7721.html), as Stage 2D measured
   every other view's. The 2C build has no plan camera, so each view is reproduced there with a PROBE: the case's clock,
   presentation, mode and selection, and the app's own camera (field of view 37 degrees) looking straight down with
   GEOREF.NORTH up, at the centre the 2E build's MAPCAM shows for that case and at the distance that gives its scale (px per
   world unit) on the ground. Straight down on nearly flat ground its scale is nearly uniform, and the 2C level of detail,
   which reads the eye's distance, sees the same distance the 2E build derives from its zoom (app.js distAtWpp). A narrow
   field of view (as tools/stage2/paper-map.js) would put the eye tens of times farther and change the level of detail. The limit is what the 2C canvas pass hides there (LABEL_STATS.hidden); the baselines are the harness's
   unobstructed fraction at the case's viewport and at 1280 x 720.
   Measured twice: with the 2C build's own panels (the method Stage 2D used for every other view), and with the 2C panels
   moved to the rectangles the 2E build's panels occupy in that view ("matched"). The two differ where the 2C legend (the
   Stage 1B legend, 587 px wide) covers ground the 2E legend (296 px) leaves free: the 2C pass counts an item under a
   panel as neither shown nor hidden, so at 1280 x 720, where the 2C legend covers the whole framed field, it hides
   nothing by construction. The matched count is the same items against the same obstacles.
   node tools/stage2/paper-limits.js [2E build] [--json out.json] */
const fs=require("fs"), path=require("path"), P=require("./page.js");
const argv=process.argv.slice(2), jo=argv.indexOf("--json");
const NEW=path.resolve(argv[0]&&!argv[0].startsWith("--")?argv[0]:path.join(P.ROOT,"austerlitz-command-map.html"));
const OLD=path.join(P.ROOT,"archive","stage2c-68ac7721.html");
const NAMES=["paper-north-up","paper-close","paper-drawer","paper-laptop"];
const SEL=[".rail",".dispatch",".legend",".timebar",".tools","#viewmode",".drawer","#selchip","#vsbadge"];
(async()=>{
  const b=await P.launch(), res={};
  for(const name of NAMES){
    const c=P.CASES.find(x=>x.name===name);
    let page=await P.open(b,c.viewport,NEW); await P.applyCase(page,c);
    const st=await page.evaluate(SEL=>{ const s=MAPCAM.state(), R={};
      SEL.forEach(q=>{ const e=document.querySelector(q); if(!e) return; const cs=getComputedStyle(e), r=e.getBoundingClientRect();
        R[q]=(cs.display==="none"||cs.visibility==="hidden"||e.hidden||r.width<1)?null:[r.left,r.top,r.width,r.height]; });
      return {x:s.x,z:s.z,wpp:s.wpp,free:MAPCAM.freeRect(),dropped:ML.stats.dropped,unob:__aus.unobstructed(),panels:R}; },SEL);
    await page.close();
    const out={};
    for(const matched of [false,true]){
    page=await P.open(b,c.viewport,OLD); await P.applyCase(page,c);
    if(matched) await page.evaluate(R=>{ let css="";
      Object.keys(R).forEach(q=>{ css+=q+(R[q]?"{position:fixed!important;left:"+R[q][0]+"px!important;top:"+R[q][1]+"px!important;width:"+R[q][2]+"px!important;height:"+R[q][3]+
        "px!important;right:auto!important;bottom:auto!important;overflow:hidden!important;transform:none!important;max-height:none!important;box-sizing:border-box!important}":"{display:none!important}"); });
      const t=document.createElement("style"); t.textContent=css; document.head.appendChild(t); },st.panels);
    await page.evaluate(s=>{
      var VH=innerHeight, d=s.wpp*VH/(2*Math.tan(camera.fov*Math.PI/360)), ang=GEOREF.ROT_DEG*Math.PI/180;
      camera.near=1; camera.far=d+400; scene.fog.near=1e6; scene.fog.far=2e6;
      camera.up.set(-Math.sin(ang),0,-Math.cos(ang)); camera.position.set(s.x,d,s.z); orbitTarget.set(s.x,0,s.z); camera.lookAt(orbitTarget);
      camera.updateProjectionMatrix(); freeCam=true; tween=null; requestRender(3);
    },st);
    await P.settle(page);
    const old=await page.evaluate(()=>({hidden:LABEL_STATS.hidden,stats:Object.assign({},LABEL_STATS),unob:__aus.unobstructed(),
      pxPerUnit:(function(){ var a=new THREE.Vector3(0,0,0).project(camera), b2=new THREE.Vector3(10,0,0).project(camera); return Math.hypot((a.x-b2.x)*innerWidth/2,(a.y-b2.y)*innerHeight/2)/10; })()}));
    if(!matched){ await page.setViewportSize({width:1280,height:720}); await page.evaluate(()=>window.dispatchEvent(new Event("resize"))); await page.waitForTimeout(450);
      await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); old.unob720=await page.evaluate(()=>__aus.unobstructed()); }
    if(process.env.SHOTS) fs.writeFileSync(path.join(process.env.SHOTS,name+"-2c"+(matched?"-matched":"")+".png"),await page.screenshot());
    await page.close();
    out[matched?"matched":"native"]=old;
    console.log(name.padEnd(16),matched?"matched":"native ","2E view: centre",st.x.toFixed(2),st.z.toFixed(2),"wpp",st.wpp.toFixed(4),"(px/unit",(1/st.wpp).toFixed(3)+")",
      "| 2C probe: px/unit",old.pxPerUnit.toFixed(3),"hidden",old.hidden,JSON.stringify(old.stats),"unobstructed",old.unob,"/",old.unob720);
    }
    res[name]={view2E:st, probe2C:out, limitNative:out.native.hidden, limitMatched:out.matched.hidden, baseline:[out.native.unob,out.native.unob720]};
  }
  if(jo>=0) fs.writeFileSync(argv[jo+1],JSON.stringify(res,null,1));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(2); });
