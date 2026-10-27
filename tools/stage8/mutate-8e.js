#!/usr/bin/env node
/* Stage 8, implementation PR 8E (docs/STAGE8_SPEC.md section 17): do its checks fail when what they hold is broken? Each mutation replaces one
   string in a copy of the built page; on each copy one block of the self-test, read from the page's own source (from its opening comment to the
   next block's) and run with the self-test's helpers. The unmutated copy first: every check passes on it.
   node tools/stage8/mutate-8e.js [--only ids] [--json out.json]     (the build: AUSTERLITZ_HTML, else the repository's)
   Measurement code only: the copies are written to a temporary directory and nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ONLY=opt("--only")?opt("--only").split(","):null, OUT=opt("--json");
/* [id, what it breaks, the block it is judged by, [[from, to], ...]] */
const MUT=[
  ["none","nothing (the build as it is)","8d",[]],
  /* 8E's prerequisite (the audit of 8D): the envelope following the geometry and the definition */
  ["envonce","8D's behaviour: the envelope read once, when the mesh's bounds are first made, and kept whatever geometry it is given","8d",
    [["var t0=performance.now(), g=m.geometry, Pa=g.attributes.position, K=g.attributes.aPart||null; cl.env=animEnv(g);",
      "var t0=performance.now(), g=m.geometry, Pa=g.attributes.position, K=g.attributes.aPart||null; if(cl.env0===undefined) cl.env0=animEnv(g); cl.env=cl.env0;"]]],
  ["stale8d","8D's staleness test: the instances' version and count and the geometry's identity only (no attribute or definition compared)","8d",
    [["if(cl.ver!==o.instanceMatrix.version||cl.n!==o.count||cl.g!==o.geometry||cl.av!==ANIM.ver) return true;","if(cl.ver!==o.instanceMatrix.version||cl.n!==o.count||cl.g!==o.geometry) return true; return false;"]]],
  ["envcache8d","8D's envelope cache: one value per part attribute, whatever its version or the animation's definition","8d",
    [["c=ANIM.env.get(K);\n  if(c&&c.av===ANIM.ver&&c.P===Pa&&c.pv===Pa.version&&c.kv===K.version) return c.e;","c=ANIM.env.get(K);\n  if(c) return c.e;"]]],
  /* 8E: the troops (the self-test's 8E block); each rule broken in turn */
  ["none8e","nothing (the build as it is)","8e",[]],
  ["kitratio","the rich kit's head four times as fine (its triangles past section 8.2's 1.3 times)","8e",[["headR:new THREE.OctahedronGeometry(0.115,1)","headR:new THREE.IcosahedronGeometry(0.115,3)"]]],
  ["kitcolour","the rich man's feet in the leather's colour, not the legwear's","8e",[["P(B(0.10,0.05,0.20),[-0.085,0.025,0.035],null,null,leg,13), P(B(0.10,0.05,0.20),[0.085,0.025,0.035],null,null,leg,14),","P(B(0.10,0.05,0.20),[-0.085,0.025,0.035],null,null,M.leather,13), P(B(0.10,0.05,0.20),[0.085,0.025,0.035],null,null,M.leather,14),"]]],
  ["artwheels","the limber's wheels the gun's size (Gassendi's two heights not kept)","8e",[["return (which===\"gun\"?w.gun_m:w.limber_m)/2*kitArtScale();","return w.gun_m/2*kitArtScale();"]]],
  ["artcoffret","no coffret on the deployed limber (ORDNANCE.fr.coffret not drawn)","8e",[["lD=vmesh(\"limber\",{coffret:true},guns,dep)","lD=vmesh(\"limber\",{},guns,dep)"]]],
  ["artdrivers","IV Corps' authorisation generalised: a driver on every French team","8e",[["    if(hit) return {n:hit.n, claim:hit}; a=FORMATIONS[a]&&FORMATIONS[a].parent; }","    if(hit) return {n:hit.n, claim:hit}; a=FORMATIONS[a]&&FORMATIONS[a].parent; } if(nation===\"fr\") return {n:1, claim:null};"]]],
  ["lodcentre","a man's size on screen measured at the block's centre, not at its nearest point","8e",[["var px=Math.max(KLOD.H*sc*KLOD.k/Math.max(camera.near,dmin),pc);","var px=KLOD.H*sc*KLOD.k/Math.max(camera.near,camera.position.distanceTo(b.position));"]]],
  ["lodnohyst","no hysteresis: one threshold each way","8e",[["rich=u.inView&&(u.lodRich?px>=KLOD.OUT:px>=KLOD.IN); }","rich=u.inView&&px>=KLOD.IN; }"]]],
  ["lodsplit","a block's first mesh left on the simple kit when the block turns rich","8e",[["u.lod.forEach(function(m){ var L=m.userData.lod; m.geometry=rich?L.r:L.s;","u.lod.forEach(function(m,j){ var L=m.userData.lod; m.geometry=rich&&j>0?L.r:L.s;"]]],
  ["shared","the phases written into the shared geometry","8e",[["w.setAttribute(\"aPh\",ph); w.setAttribute(\"aSl\",sl); w.userData=","w.setAttribute(\"aPh\",ph); w.setAttribute(\"aSl\",sl); g.setAttribute(\"aPh\",ph); w.userData="]]],
  ["gaitwall","the phase accumulated frame by frame (wall-clock), not the clock's","8e",[["U.uAnimPhase.value=amp>0?2*Math.PI*(x-Math.floor(x)):0;","U.uAnimPhase.value=amp>0?(U.uAnimPhase.value+0.1)%(2*Math.PI):0;"]]],
  ["wheelwrap","the wheels' angle not taken within one spoke's interval","8e",[["a-=pg*Math.round(a/pg); b-=pl*Math.round(b/pl);",""]]],
  ["gaitnofade","the amplitude never faded by the speed","8e",[["c=rate*lg.mpm/fv;","c=0;"]]],
  ["gaitcrew","a battery's cadence its hidden crew's (every part's, not the parts drawn)","8e",[["var rate=clockRate(), fv=gaitFastest(rec,G);","var rate=clockRate(), fv=G.fastest;"]]],
  ["gaitrmease","reduced motion eased, not at once","8e",[["var e=RM?1:ease(GAIT.EASE);","var e=ease(GAIT.EASE);"]]],
  ["gaitparts","a formation's horses faded apart from its men","8e",[["U.uAnimAmp.value=amp; U.uAnimPhase.value=","U.uAnimAmp.value=k===\"man\"?amp:Math.min(1,amp*1.6); U.uAnimPhase.value="]]],
  ["gaitdrift","no 1 km/h floor: a drift between anchors stepped","8e",[["if(lg&&!RM&&lg.kmh>=GAIT.KMH){ c=","if(lg&&!RM&&lg.kmh>=0){ c="]]],
  ["gaitrm","reduced motion ignored by the gait","8e",[["if(lg&&!RM&&lg.kmh>=GAIT.KMH){ c=","if(lg&&lg.kmh>=GAIT.KMH){ c="]]],
  ["gaitnoease","the amplitude set at once, not eased","8e",[["if(G.amp!==want){ G.amp+=(want-G.amp)*e;","if(G.amp!==want){ G.amp=want;"]]],
  ["slopestale","the slopes left where Play stopped (not taken again on the pause)","8e",[["(!u.slopeSeat||(u.slopeStale&&clockRate()===0))) u.layout(u.sw,u.sd);","(!u.slopeSeat)) u.layout(u.sw,u.sd);"]]],
  ["slopeevery","the slopes taken at every seating while the clock plays (no step)","8e",[["!ud.slopeSeat||clockRate()===0||Math.hypot(","!ud.slopeSeat||true||Math.hypot("]]],
  ["s5","8D's facing: cached per phase at the first clock visited","8e",[["var tc=faceClock(id,clock), key=tc+\"|\"+id;","var tc=clock, key=curPhase+\"|\"+id;"]]],
  ["contact","the drawn ground's slopes not counted in the rise or dip that plants the feet (the hook and its mirror alike)","8e",[["sl=Math.max(-S,Math.min(S,s2[0])), sh=Math.max(-S,Math.min(S,s2[1]))","sl=0, sh=0"],["\"  vec2 anSl=clamp(aSl,vec2(-\"+f(ANIM.SLOPE)+\"),vec2(\"+f(ANIM.SLOPE)+\"));\"","\"  vec2 anSl=vec2(0.0);\""]]],
  ["drape","the cloth narrowed by its folds","8e",[["for(var i=0;i<a.count;i++){ var u=(a.getX(i)+1.2)/2.4; a.setZ(i,","for(var i=0;i<a.count;i++){ var u=(a.getX(i)+1.2)/2.4; a.setX(i,a.getX(i)*0.97); a.setZ(i,"]]]
];
const E8="/* Stage 8, implementation PR 8E (decisions 242 (a), 243 (a), 244 (a), 245 (a); docs/STAGE8_SPEC.md sections 4 and 17): the troops.",
  C8="/* Stage 8, implementation PR 8C (decision 240 (a); docs/STAGE8_SPEC.md sections 3.4, 7.2 and 15)";
const BLOCKS={
  "8d":["/* Stage 8, implementation PR 8D (decisions 249 (a), 244 (a), 250 (b); docs/STAGE8_SPEC.md section 16): the blocks culled",E8],
  "8e":[E8,C8]};
/* a self-test block, in the page */
const BLOCK=function(m){
  var src=[].map.call(document.scripts,function(s){ return s.textContent; }).join("\n");
  var a=src.indexOf(m[0]), b=src.indexOf(m[1],a+10);
  if(b<0&&m[1].indexOf("PR 8E")>=0) b=src.indexOf("/* Stage 8, implementation PR 8C (decision 240 (a)",a+10);   /* a build before 8E: the 8D block ends at the 8C block */
  if(a<0||b<0) return {error:"the self-test's block not found"};
  var out=[], ck=function(n,ok,d){ out.push({name:n,ok:!!ok,detail:d}); };
  var fin=function(){ var n=0; if(tween) mlReset("tween ended at once"); while(tween&&n<4){ tween(performance.now()+1e7); n++; } };
  var t0=performance.now();
  try{ new Function("ck","settle","finishTween","placeCamera",src.slice(a,b))(ck,AUSTERLITZ_DEBUG.settle,fin,AUSTERLITZ_DEBUG.placeCamera); }
  catch(e){ out.push({name:"the block ran",ok:false,detail:"threw: "+e.message}); }
  return {checks:out, ms:Math.round(performance.now()-t0)};
};
(async()=>{
  const html0=path.resolve(process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html")), src=fs.readFileSync(html0,"utf8");
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-8e-")), browser=await L.launch(), res={build:path.basename(html0), md5:require("crypto").createHash("md5").update(src).digest("hex"), chromium:browser.version(), mutations:[]};
  for(const [id,what,blk,subs] of MUT){
    if(ONLY&&!ONLY.includes(id)) continue;
    let s=src; for(const [a,b] of subs){ if(s.split(a).length!==2) throw new Error(id+": the string to replace is not found exactly once: "+a.slice(0,80)); s=s.replace(a,()=>b); }
    const file=path.join(dir,id+".html"); fs.writeFileSync(file,s);
    process.env.AUSTERLITZ_HTML=file;
    const page=await L.open(browser,[1366,768],{}); await page.evaluate(()=>closeFirst(null));
    const st=await page.evaluate(BLOCK,BLOCKS[blk]); const errs=page._errors.slice(); await page.close();
    const failed=(st.checks||[]).filter(c=>!c.ok).map(c=>c.name.slice(0,110)+" | "+String(c.detail).slice(0,3000));
    const passed=(st.checks||[]).filter(c=>c.ok).map(c=>c.name.slice(0,110)+" | "+String(c.detail).slice(0,300));
    const R={id, what, block:blk, selfTest:st.error?st.error:{checks:(st.checks||[]).length, failed, passed, ms:st.ms}, pageErrors:errs};
    res.mutations.push(R);
    console.log("== "+id+": "+what+"\n   the self-test's "+blk+" block: "+(st.error||((st.checks||[]).length+" checks, "+failed.length+" failed, "+st.ms+" ms"))+
      (failed.length?"\n     - "+failed.join("\n     - "):"")+(id==="none"?"\n     + "+passed.join("\n     + "):"")+(errs.length?"\n   page errors: "+errs.slice(0,3).join(" | "):""));
    if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
  }
  await browser.close(); fs.rmSync(dir,{recursive:true,force:true});
})().catch(e=>{ console.error(e); process.exit(1); });
