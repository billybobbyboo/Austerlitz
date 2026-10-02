#!/usr/bin/env node
/* Stage 4 Part A (docs/STAGE4_SPEC.md sections E and F): smoke, ice and the horizon, measured on the built page by a probe (it
   reads the running page and times one extra render pass; it changes no source file). node tools/stage4/extras-probe.js [--json f] [--horizon-only]

   1. smoke and dust, in every landscape harness view: the sprites drawn, their share of the free rectangle (each sprite's
      projected square, clipped), and the frame's world time; the cost of a depth pre-pass at the scene target's size (the
      scene drawn once more with a depth material into a target with a depth texture), which soft particles need.
   2. smoke over the day (fact, from the app's own functions): at every 5 clock minutes, the leaf formations whose phase status
      is a fighting one (liveStatus, FIGHTING: what draws smoke today) and how many of them a live event names (liveEvents,
      EVENTS[].forms, through each formation's parents): how far "the phase's status" and "the event's window" agree.
   3. the meres: in every landscape view, the share of each mere's outline on screen and inside the free rectangle.
   4. the horizon: in every landscape view, for 32 screen columns, the screen row of the true horizon (a level ray from the eye, 1,800 units out, inside the camera's far plane)
      and of the apron's far edge in that direction; the largest gap (px) where the dome shows below the horizon; the edge's
      distance (km) and today's fog factor there (with Stage 3D's recession). */
const fs=require("fs"), path=require("path");
const {launch,open,settle,CASES,ROOT}=require("../stage2/page.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const OUT=opt("--json")||path.join(ROOT,"docs","stage4-evidence","extras-probe.json");

const PROBE=function(){
  var X4={}, v=new THREE.Vector3();
  function Wd(){ return renderer.domElement.clientWidth||innerWidth; } function Hd(){ return viewH(); }
  function proj(p){ v.copy(p).project(landCam); return [(v.x*0.5+0.5)*Wd(),(-v.y*0.5+0.5)*Hd(),v.z]; }
  X4.sprites=function(){ landCam.updateMatrixWorld(true); var fr=landFreeRect(), A=(fr[2]-fr[0])*(fr[3]-fr[1]), out={smoke:0,dust:0,smokeArea:0,dustArea:0};
    var H=window.innerHeight, t=Math.tan(landCam.fov*Math.PI/360);
    Object.keys(units).forEach(function(id){ var r=units[id]; ["smoke","dust"].forEach(function(k){ var s=r[k]; if(!s||!s.visible||s.material.opacity<0.02) return;
      var p=s.getWorldPosition(new THREE.Vector3()), c=p.clone().applyMatrix4(landCam.matrixWorldInverse); if(c.z>-1) return;
      var q=proj(p), px=s.scale.x*H/(2*(-c.z)*t), py=s.scale.y*H/(2*(-c.z)*t);
      var x0=Math.max(fr[0],q[0]-px/2), x1=Math.min(fr[2],q[0]+px/2), y0=Math.max(fr[1],q[1]-py/2), y1=Math.min(fr[3],q[1]+py/2);
      out[k]++; if(x1>x0&&y1>y0) out[k+"Area"]+=(x1-x0)*(y1-y0)/A; }); });
    out.smokeArea=+out.smokeArea.toFixed(4); out.dustArea=+out.dustArea.toFixed(4); return out; };
  var rtD=null, depthMat=null;
  X4.prepass=function(){ var w=FX.rtScene.width, h=FX.rtScene.height;
    if(!rtD){ rtD=new THREE.WebGLRenderTarget(w,h); rtD.depthTexture=new THREE.DepthTexture(w,h); depthMat=new THREE.MeshDepthMaterial(); }
    var t=[]; for(var i=0;i<4;i++){ var a=performance.now(); camera.layers.set(LAYER_WORLD); scene.overrideMaterial=depthMat; renderer.setRenderTarget(rtD); renderer.clear(); renderer.render(scene,camera);
      scene.overrideMaterial=null; renderer.setRenderTarget(null); camera.layers.enableAll(); var gl=renderer.getContext(); gl.finish(); t.push(performance.now()-a); }
    t.sort(function(a,b){ return a-b; }); var f=[]; for(var j=0;j<3;j++){ renderFrame(); f.push(DEV.tWorld); } f.sort(function(a,b){ return a-b; });
    return {size:[w,h],prepassMs:+t[1].toFixed(1),worldMs:+f[1].toFixed(1)}; };
  X4.smokeDay=function(){ var rows=[];
    for(var t=T_MIN;t<=T_MAX;t+=5){ setClock(t,{instant:true,force:true,camera:false});
      var named={}; liveEvents(t).forEach(function(o){ if(o.w<0.5) return; (o.e.forms||[]).forEach(function(f){ named[f]=1; }); });
      var ph=phaseAt(t), fight=0, inEv=0;
      Object.keys(units).forEach(function(id){ var st=liveStatus(id,ph); if(!(st&&FIGHTING[st])) return; if(!posNow(id)) return; fight++;
        var a=id, hit=false; for(var k=0;k<6&&a;k++){ if(named[a]){ hit=true; break; } a=FORMATIONS[a]&&FORMATIONS[a].parent; } if(hit) inEv++; });
      rows.push([t,ph,fight,inEv]); }
    return rows; };
  X4.meres=function(){ landCam.updateMatrixWorld(true); var fr=landFreeRect(), out={};
    [["satschan",SATS,28,10.5],["menitz",MENI,23,9]].forEach(function(m){ var n=0,on=0,free=0;
      for(var k=0;k<48;k++){ var a=k/48*Math.PI*2, x=m[1][0]+Math.cos(a)*m[2], z=m[1][1]+Math.sin(a)*m[3], q=proj(new THREE.Vector3(x,groundY(x,z),z)); n++;
        if(q[2]<1&&q[0]>=0&&q[0]<=Wd()&&q[1]>=0&&q[1]<=Hd()){ on++; if(q[0]>=fr[0]&&q[0]<=fr[2]&&q[1]>=fr[1]&&q[1]<=fr[3]) free++; } }
      out[m[0]]={onScreen:+(on/n).toFixed(2),inFree:+(free/n).toFixed(2)}; }); return out; };
  X4.horizon=function(){ landCam.updateMatrixWorld(true); var E=landCam.position, fs=fogShift(), n=scene.fog.near+fs, f=scene.fog.far+fs, worst=0, dist=[], fog=[], cols=0;
    var inv=new THREE.Vector3();
    for(var i=0;i<32;i++){ var sx=(i+0.5)/32*Wd(), r=inv.set(sx/Wd()*2-1,0,0.5).unproject(landCam).sub(E); r.y=0; if(r.lengthSq()<1e-9) continue; r.normalize();
      var tx=r.x>0?(860-E.x)/r.x:(-860-E.x)/r.x, tz=r.z>0?(760-E.z)/r.z:(-760-E.z)/r.z, t=Math.min(tx,tz); if(!(t>0)) continue;
      var edge=new THREE.Vector3(E.x+r.x*t,-0.35,E.z+r.z*t), hor=new THREE.Vector3(E.x+r.x*1800,E.y,E.z+r.z*1800), qe=proj(edge), qh=proj(hor);
      if(qe[2]>1||qh[2]>1) continue; cols++;
      if(qe[0]>=0&&qe[0]<=Wd()) worst=Math.max(worst,qe[1]-qh[1]);
      var d=edge.clone().applyMatrix4(landCam.matrixWorldInverse).z*-1, k=Math.max(0,Math.min(1,(d-n)/(f-n))); fog.push(k*k*(3-2*k)); dist.push(t*GEOREF.M_PER_WORLD/1000); }
    var fw=new THREE.Vector3(); landCam.getWorldDirection(fw); fw.y=0; fw.normalize(); var hy=proj(new THREE.Vector3(E.x+1800*fw.x,E.y,E.z+1800*fw.z))[1];
    return {columns:cols,gapPx:+worst.toFixed(1),horizonRow:+hy.toFixed(0),edgeKm:dist.length?[+Math.min.apply(null,dist).toFixed(1),+Math.max.apply(null,dist).toFixed(1)]:null,
      edgeFog:fog.length?[+Math.min.apply(null,fog).toFixed(3),+Math.max.apply(null,fog).toFixed(3)]:null}; };
  window.__x4=X4; return true;
};
const LAND=CASES.filter(c=>!c.fresh&&c.mode!=="staff"&&c.viewport[0]===1600&&!c.interact);
(async()=>{
  const HOR=process.argv.includes("--horizon-only");   /* re-measure the horizon alone, into the existing file */
  const browser=await launch(), out=HOR&&fs.existsSync(OUT)?JSON.parse(fs.readFileSync(OUT,"utf8")):{when:new Date().toISOString(),views:{}};
  const page=await open(browser,[1600,900]);
  await page.evaluate(PROBE.toString().replace(/^function\s*\(\)\s*\{/,"(function(){")+")()");
  for(const c of LAND){
    await page.evaluate(s=>window.__aus.apply(s),c); await settle(page);
    if(HOR){ out.views[c.name].horizon=await page.evaluate(()=>__x4.horizon()); console.log(c.name.padEnd(22),JSON.stringify(out.views[c.name].horizon)); fs.writeFileSync(OUT,JSON.stringify(out,null,1)); continue; }
    const r=await page.evaluate(()=>({sprites:__x4.sprites(),prepass:__x4.prepass(),meres:__x4.meres(),horizon:__x4.horizon()}));
    r.clock=c.t; r.factor=c.factor||4; out.views[c.name]=r; console.log(c.name.padEnd(22),JSON.stringify(r));
    fs.writeFileSync(OUT,JSON.stringify(out,null,1));
  }
  if(!HOR){ out.smokeDay=await page.evaluate(()=>__x4.smokeDay());
  const sd=out.smokeDay, fighting=sd.filter(r=>r[2]>0);
  out.smokeSummary={samples:sd.length,withSmoke:fighting.length,formationMinutes:fighting.reduce((a,r)=>a+r[2],0),namedByLiveEvent:fighting.reduce((a,r)=>a+r[3],0),
    minutesSmokeNoEvent:fighting.filter(r=>r[3]===0).length*5};
  console.log("smoke over the day",JSON.stringify(out.smokeSummary)); }
  if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  fs.writeFileSync(OUT,JSON.stringify(out,null,1)); await browser.close();
})().catch(e=>{ console.error(e); process.exit(2); });
