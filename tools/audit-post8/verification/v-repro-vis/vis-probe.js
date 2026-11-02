#!/usr/bin/env node
/* Final audit after Stage 8, verification lens "v-repro-vis": an independent reproduction of findings visibility #0 and #1.
   Measurement only: nothing of the application, its data, thresholds, tests or build is changed.

   The run is set up as tools/visual/motion.js RUN's Play run (the project's deterministic driver, not the visibility area's instrument):
   the harness's page (?harness=1) at the view's viewport, the view applied (motion.js VIEWS), then on the driver's clock (30 frames a second,
   the WebGL draw skipped: the map layer's occlusion is the CPU ray march mlOccluded, app.js:5204, so the layout reads nothing drawn):
   select none, Play stopped, setClock(from) as a seek, Follow on (freeCam false), the speed, eight frames at rest, then Play pressed, played
   until the clock reaches `to`, then Play stopped and 30 frames at rest.

   What is observed is independent of the area's coding (vis-lib.js / motion.js snap, which read the layer's own it.state):
   - drawn: the formation's map-layer element as the browser has it after the frame: getComputedStyle(el).opacity >= 0.5, display not none
     (style.css:704-705: .ml-item opacity 0, .on opacity 1; an inline opacity is a fade); a remnant fading out (.ml-fading) is counted apart;
   - in view: the item's anchor (it.world, the point the layer anchors the counter or name to) projected by this script with the camera
     inside the canvas, the topmost element at that point (document.elementFromPoint; #maplayer has pointer-events none) the canvas itself,
     not a panel, and the anchor not behind the drawn ground (the one thing taken from the app: it.state "occluded", its CPU ray march);
   - the record of a formation is its counter (c:<id>) where the layer collected one this frame, else its name (n:<id>);
   - event labels (e:<id>) drawn by the same DOM test; the formations each names from EVENTS[].forms.
   Codes per frame: # drawn and in view, r in view and only a fading remnant, x in view and not drawn, o off the canvas, p under a panel,
   t behind the ground, . not collected by the layer this frame. The app's own state is kept beside it (A: on/held/dropped/...).

   usage: node vis-probe.js [--runs hybrid-0830,hybrid-1200,land-0900] [--out <dir>] */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const A=require("../../lib.js");
const MO=require(path.join(A.ROOT,"tools","visual","motion.js"));
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=path.resolve(opt("--out")||path.join(A.SCRATCH,"v-repro-vis"));
fs.mkdirSync(OUT,{recursive:true});
const view=(k,o)=>Object.assign(JSON.parse(JSON.stringify(MO.VIEWS[k])),o||{});
const RUNS={
  "hybrid-0830":[view("hybrid"),{from:510,to:690,speed:0.5}],
  "hybrid-1200":[view("hybrid"),{from:720,to:900,speed:0.5}],
  "land-0900":[view("land"),{from:540,to:720,speed:0.5}],
  "hybrid-0900-20":[view("hybrid"),{from:540,to:560,speed:0.5}]
};
const OBS=function(){
  if(window.__vrv) return true;
  window.__vrv={run:function(a){
    var D=window.__md, LIST=null, inner=null, v=new THREE.Vector3(), cvs=renderer.domElement, fids=Object.keys(FORMATIONS);
    var F={}, E={}, AP={}, frames=[], dis=0, disN=0, t0=Date.now();
    fids.forEach(function(id){ F[id]=[]; AP[id]=[]; });
    function opa(el){ if(!el||!el.isConnected) return 0; var cs=getComputedStyle(el); if(cs.display==="none"||cs.visibility==="hidden") return 0; return +cs.opacity; }
    function appCode(it){ if(it.eFrame!==ML.frame) return it.state==="panel"?"p":"o"; if(it.held) return "h"; var s=it.state;
      return s==="on"?"#":s==="dropped"?"d":s==="occluded"?"t":s==="offscreen"?"o":s==="panel"?"p":"?"; }
    function obs(ph){
      camera.updateMatrixWorld();
      var VW=cvs.clientWidth||innerWidth, VH=cvs.clientHeight||innerHeight, R=cvs.getBoundingClientRect(), byKey={};
      (LIST||[]).forEach(function(it){ byKey[it.key]=it; });
      fids.forEach(function(id){
        var it=byKey["c:"+id]||byKey["n:"+id], c=".", ac=".";
        if(it){
          v.copy(it.world).project(camera);
          var sx=(v.x*0.5+0.5)*VW, sy=(-v.y*0.5+0.5)*VH, on=v.z<1&&sx>=0&&sx<=VW&&sy>=0&&sy<=VH;
          ac=appCode(it);
          if(!on) c="o";
          else { var top=document.elementFromPoint(R.left+sx,R.top+sy);
            if(top!==cvs) c="p";
            else if(it.state==="occluded"&&it.eFrame===ML.frame) c="t";
            else { var op=opa(it.el); c=op>=0.5?"#":(it.el.classList.contains("ml-fading")&&op>0?"r":"x"); } }
          /* agreement of this projection with the layer's own anchor (it.sx, it.sy) for items it laid out this frame */
          if(it.eFrame===ML.frame&&on){ disN++; if(Math.hypot((+it.sx||0)-sx,(+it.sy||0)-sy)>1.5) dis++; }
        }
        F[id].push(c); AP[id].push(ac);
      });
      (LIST||[]).forEach(function(it){ if(it.key.indexOf("e:")!==0) return; var id=it.key.slice(2);
        if(!E[id]){ E[id]={c:[]}; for(var i=0;i<frames.length;i++) E[id].c.push("."); }
        E[id].c.push(opa(it.el)>=0.5?"#":"-"); });
      Object.keys(E).forEach(function(id){ if(E[id].c.length<frames.length+1) E[id].c.push("."); });
      frames.push({t:+clock.toFixed(3), ph:ph, play:!!playing, dw:(typeof DWELL!=="undefined"&&DWELL.st)?DWELL.st.stage:null,
        tg:mode!=="staff"?[+orbitTarget.x.toFixed(1),+orbitTarget.z.toFixed(1)]:null});
    }
    D.start({gl:false, frameMs:a.frameMs||1000/30});
    inner=window.mlCollect; window.mlCollect=function(){ var l=inner.apply(this,arguments); LIST=l; return l; };
    var n=0;
    try{
      requestRender(2);
      stopPlay(); setClock(a.from,{instant:true,force:true,camera:false});
      if(mode!=="staff"){ if(a.follow===false) freeCam=true; else { freeCam=false; curVantage=null; } }
      setSpeed(a.speed); requestRender(8); D.frame(8); obs("pre");
      togglePlay();
      while(n<(a.max||20000)){ D.frame(); n++; obs("play"); if(!playing||clock>=a.to-1e-9) break; }
      stopPlay();
      for(var r=0;r<30;r++){ D.frame(); obs("rest"); }
    } finally { window.mlCollect=inner; D.stop(); }
    var forms={}; fids.forEach(function(id){ var s=F[id].join(""); if(/[#rx]/.test(s)) forms[id]={codes:s, app:AP[id].join(""), name:FORMATIONS[id].name}; });
    var ev={}; Object.keys(E).forEach(function(id){ var e=EVENTS.filter(function(x){ return x.id===id; })[0]; ev[id]={codes:E[id].c.join(""), forms:e&&e.forms?e.forms.slice():[], title:e?(e.n||id):id}; });
    return {frames:frames, forms:forms, events:ev, playFrames:n, endClock:clock, presentation:presentation, mode:mode, viewport:[innerWidth,innerHeight],
      projDisagree:[dis,disN], wallMs:Date.now()-t0};
  }};
  return true;
};
(async()=>{
  const want=(opt("--runs")||"hybrid-0830,hybrid-1200,land-0900").split(",").filter(Boolean);
  const html=path.resolve(process.env.AUSTERLITZ_HTML||path.join(A.ROOT,"austerlitz-command-map.html"));
  const md5=crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex");
  const b=await A.launch(), t0=Date.now();
  let page=null, vp=null;
  const settle=async p=>{ await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await p.waitForTimeout(450); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); };
  for(const k of want){
    const [spec,o]=RUNS[k];
    if(!page){ vp=spec.viewport; page=await A.open(b,vp); page.setDefaultTimeout(0); await settle(page); await page.evaluate(()=>closeFirst(null)); console.log("booted",((Date.now()-t0)/1000).toFixed(0),"s"); }
    await page.evaluate(()=>{ select(null,null); stopPlay(); });
    await page.evaluate(s=>window.__aus.apply(s),spec);
    await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(90,true));
    await page.evaluate(MO.inPage); await page.evaluate(OBS);
    const r=await page.evaluate(a=>window.__vrv.run(a),o);
    const rec={run:k, spec, opts:o, md5, chromium:b.version(), errors:A.errors(page).slice(0,20), ...r};
    fs.writeFileSync(path.join(OUT,"raw-"+k+".json"),JSON.stringify(rec));
    console.log(k,"frames",r.frames.length,"play",r.playFrames,"end",r.endClock.toFixed(2),"wall",(r.wallMs/1000).toFixed(1),"s; projection disagreements",r.projDisagree.join("/"));
  }
  await b.close();
  console.log("done",((Date.now()-t0)/1000).toFixed(0),"s; md5",md5);
})().catch(e=>{ console.error(e); process.exit(1); });
