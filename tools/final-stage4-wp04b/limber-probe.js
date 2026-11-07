#!/usr/bin/env node
/* The final audits' Stage 4, WP-04b: the limbered pieces on their limbers' pintles, as the self-test's artillery check reads them (the heights'
   battery at the middle of its first moving leg, Watch on the landscape, settled), and the pieces' wheels on the drawn ground there: for each
   limbered piece the distance from its trail's end to its limber's pintle, and how far its axle stands above the drawn ground under it beyond
   its wheel's radius (groundY at the axle's x, z in the world). Also at every clock of that leg, ten minutes apart. On each build named, on a
   fresh page as the harness opens it.
   node tools/final-stage4-wp04b/limber-probe.js <a.html> [<b.html> ...] [--json out.json]
   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("../stage8/lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; }, OUT=opt("--json");
const HTML=argv.filter((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json").map(f=>path.resolve(f));
const MEAS=function(){
  function finishTween(){ var n=0; while(tween&&n<4){ tween(performance.now()+1e7); n++; } }
  function settle(n){ finishTween(); syncViewOffset(true); var fk=FK; FK=7.2; for(var i=0;i<(n||60);i++){ settling=false; updateVisibility(); } FK=fk; }
  closeFirst(null); setMode("terrain"); setPresentation("watch");
  var hg="heightguns", mv=null; anchorList(hg).forEach(function(b,i){ if(i&&!mv&&b.w&&b.w[1]>b.w[0]) mv=b.w; });
  var hb=units[hg].block, hu=hb.userData, out=[];
  var Mi=new THREE.Matrix4(), Mw=new THREE.Matrix4(), V=new THREE.Vector3(), V2=new THREE.Vector3(), Ax=new THREE.Vector3();
  var clocks=[(mv[0]+mv[1])/2]; for(var t=mv[0];t<=mv[1];t+=10) clocks.push(t);
  clocks.forEach(function(t,ci){
    setClock(t,{instant:true,force:true,camera:false}); settle(24); hb.updateMatrixWorld(true);
    var gLm=null, lLm=null; hu.limbered.traverse(function(o){ if(!o.isInstancedMesh||!o.userData.kit) return; if(o.userData.kit.part==="gun limbered with its coffret") gLm=o; if(o.userData.kit.part==="limber") lLm=o; });
    var rG=kitArtR("gun"), p=kitArtPitch(), tl=2.05, end=new THREE.Vector3(0,rG+(0.05-rG)*Math.cos(p)+tl*Math.sin(p),(rG-0.05)*Math.sin(p)+tl*Math.cos(p)), pin=new THREE.Vector3(0,kitArtR("limber")+0.02,ART_AT.PIN);
    var wE=0, gap=0, gapMax=0, vis=hu.limbered.visible;
    for(var q=0;q<hu.art.guns;q++){
      /* as the self-test's check: the two instances' own matrices (one group) */
      gLm.getMatrixAt(q,Mi); lLm.getMatrixAt(q,Mw); V.copy(end).applyMatrix4(Mi); V2.copy(pin).applyMatrix4(Mw); wE=Math.max(wE,V.distanceTo(V2));
      Mi.premultiply(gLm.matrixWorld);
      /* the axle's world place (0, rG, 0 in the piece's frame); its wheel's lowest point is rG below it along the piece's own up */
      Ax.set(0,rG,0).applyMatrix4(Mi); var up=new THREE.Vector3(0,1,0).transformDirection(hb.matrixWorld); var low=Ax.clone().addScaledVector(up,-rG*hb.scale.y);   /* the block's up */
      var g0=groundY(low.x,low.z); gap=low.y-g0; if(Math.abs(gap)>Math.abs(gapMax)) gapMax=gap; }
    out.push({clock:fmtClock(t), mid:ci===0, limberedShown:vis, trailToPintle:+wE.toFixed(4), wheelGapMax:+gapMax.toFixed(4)}); });
  return out; };
(async()=>{ const browser=await L.launch(), res={chromium:browser.version(), builds:[]};
  for(const html of HTML){ process.env.AUSTERLITZ_HTML=html; const page=await L.open(browser,[1366,768],{}); await page.waitForTimeout(5000);
    const r=await page.evaluate(MEAS); await page.close();
    res.builds.push({file:path.basename(html), md5:crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex"), clocks:r});
    console.log(path.basename(html)+": "+r.map(c=>c.clock+(c.mid?" (the check's)":"")+" trail-pintle "+c.trailToPintle+", wheel gap "+c.wheelGapMax+(c.limberedShown?"":" (limbered group hidden)")).join("; ")); }
  await browser.close();
  if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); } })().catch(e=>{ console.error(e); process.exit(1); });
