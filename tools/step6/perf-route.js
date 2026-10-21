/* Roadmap step 6 Part A (docs/STEP6_SPEC.md section 2): the measurement route for real hardware (question 139).
   Drives the built page, unchanged, through AUSTERLITZ_DEBUG and the app's own globals over a fixed route, and records frame times.
   Measurement code only: nothing here is the product, and nothing is written anywhere but the report it returns.

   Three ways to run it (docs/STEP6_SPEC.md section 2.3):
   - pasted whole into the browser console on the build's own page (desktop Chrome or Edge: F12, Console): it runs on that window and
     prints the report; AUS_PERF.last.text holds it afterwards;
   - loaded by tools/step6/perf-run.html, which opens the build in a same-origin frame and calls AUS_PERF.run(frame.contentWindow)
     (the phone: a hosted copy opened in Safari or Chrome; the report is shown with Copy and Share buttons);
   - by tools/step6/perf-local.js under Playwright here (software WebGL: it checks that the route runs; its numbers are not a GPU's).

   What it measures, per segment (a fixed view held or moved for a fixed number of seconds):
   - the interval between animation frames of the build's window (requestAnimationFrame timestamps): the frame time a visitor sees. While a
     segment runs the app draws every animation frame (a still view is kept drawing by requestRender, as an orbit keeps it drawing), so the
     interval is the frame time; a GPU-bound frame shows here, because the browser holds the next animation frame until the GPU catches up;
   - a long frame: an interval above 1.5 times the display's own refresh interval, measured first with the app's loop paused by this script
     (on a visitor's page the app is never idle while smoke or dust drifts: it redraws at its ambient rate);
   - the app's JavaScript time per drawn frame (its loop() timed by a wrapper): the CPU side; a page cannot read the GPU's own time
     unless the timer query below is offered;
   - the GPU's own time per drawn frame where the browser offers WebGL2's timer query (EXT_disjoint_timer_query_webgl2); else "-";
   - draw calls and triangles of each drawn frame (renderer.info, which the app resets at the start of each frame: every pass, the shadow
     map's included).
   The developer readout's "frames drawn/s" (the ` key) is not a frame rate: the app renders on demand and idles; it is not used. */
(function(root){
  "use strict";
  var VERSION="step6-perf-route 1";
  /* the route: the views of the brief, with the harness's own camera for each (tools/visual/cases.js) */
  var OV=[-27,272,41,-27,0,9], FIELD=[-195,92,156,-33,4,-2];
  var PRATZEN={map:[285,289], dir:[-1.0,0.13,0.18], r:70};
  var VIEWS=[
    {id:"overview",       spec:{t:570, presentation:"watch", mode:"terrain", cam:OV},  move:"orbit", note:"the Overview vantage, 09:30, Watch (harness case overview-plan)"},
    {id:"pratzen-low-4x", spec:{t:590, presentation:"watch", mode:"terrain", aim:PRATZEN}, move:"orbit", note:"the low Pratzen view, 09:50, the 4x default (pratzen-low)"},
    {id:"pratzen-low-1x", spec:{t:590, presentation:"watch", mode:"terrain", aim:PRATZEN, factor:1}, move:"orbit", note:"the same at 1x: formations as footprints (pratzen-low-1x)"},
    {id:"pratzen-low-10x",spec:{t:590, presentation:"watch", mode:"terrain", aim:PRATZEN, factor:"model"}, move:"orbit", note:"the same at 10.33x (pratzen-low-10x)"},
    {id:"ph8-overview",   spec:{t:880, presentation:"watch", mode:"terrain", cam:OV},  move:"orbit", note:"phase 8, 14:40, the Overview, Watch (ph8-overview-watch)"},
    {id:"paper",          spec:{t:570, presentation:"study", mode:"staff", paper:"frame", cam:OV}, move:"pan", note:"the paper map as entered, 09:30, Study (paper-north-up)"},
    {id:"eye",            spec:{t:510, presentation:"watch", mode:"terrain", eyes:"fr", eye:true, cam:FIELD}, move:"look", note:"eye level at the Zuran, 08:30 (eye-zuran)"}
  ];
  /* the diagnostic segments: the same moving view with the figures and standards hidden (their materials' visible flag, set by this
     script and restored), and with Visual effects off (the visitor's own F toggle). They say what a dropped frame is spent on */
  var DIAG=["overview","pratzen-low-4x","ph8-overview"];
  /* the played segments: Play under Follow from 08:30. Ten clock minutes at 4x last a quarter of a second (MIN_PER_SEC 10 x 4 = 40 clock
     minutes a second), too few frames to measure; so each played segment runs for its seconds and records the clock it covered */
  var PLAYED=[{id:"play-4x", speed:4, t:510}, {id:"play-half", speed:0.5, t:510}];
  var SECS={idle:3, held:4, move:6, played:12, warm:0.5};

  function pct(a,p){ if(!a.length) return null; var s=a.slice().sort(function(x,y){ return x-y; }); return s[Math.min(s.length-1,Math.floor(p*(s.length-1)+0.5))]; }
  function r1(v){ return v==null?null:Math.round(v*10)/10; }
  function wait(w,ms){ return new Promise(function(res){ w.setTimeout(res,ms); }); }

  function run(w,o){
    o=o||{};
    var scale=o.quick?0.5:1, only=o.only?String(o.only).split(","):null, log=o.log||function(){};
    var G=function(e){ return w.eval(e); };   /* the build's globals, var, function and lexical alike */
    var D=w.AUSTERLITZ_DEBUG;
    if(!D||!D.applyCase) return Promise.reject(new Error("AUSTERLITZ_DEBUG.applyCase not found: is this the built page, started?"));
    var THREE=w.THREE, renderer=G("renderer");
    /* measure.js's aimOf (tools/visual/measure.js), copied: an aim's camera from its map point */
    function aimOf(spec){
      var mp=spec.aim.map; if(typeof mp==="string") mp=w.posNow(mp);
      var p=w.W(mp[0],mp[1]), ty=w.height(p[0],p[1]);
      var d=new THREE.Vector3(spec.aim.dir[0],spec.aim.dir[1],spec.aim.dir[2]).normalize().multiplyScalar(spec.aim.r);
      return [p[0]+d.x,ty+d.y,p[1]+d.z, p[0],ty,p[1]];
    }
    function apply(spec){
      if(spec.factor==="model") spec=Object.assign({},spec,{factor:G("GEOREF.EXAG")});
      D.applyCase(spec,aimOf); D.settle(30);
    }
    /* ---- frame sampling: one requestAnimationFrame chain on the build's window ---- */
    var S={on:false, last:0, t0:0, rows:[], step:null, keep:false, gpu:[]};
    var app={js:0, drew:false, paused:false};
    /* the app's loop() timed; renderFrame() marks a drawn frame (both looked up by name each frame, so a wrapper on the window is used) */
    var origLoop=w.loop, origRF=w.renderFrame;
    /* app.paused: the app's loop skipped (only the chain kept), so the idle sample is the display's own refresh: on a visitor's page the app is
       never idle while smoke, dust or a broken formation drifts (ambientNow redraws at AMBIENT_MS) */
    w.loop=function(){ if(app.paused){ w.requestAnimationFrame(w.loop); app.js=0; return; } var t=w.performance.now(); origLoop(); app.js=w.performance.now()-t; };
    /* the GPU's own time per drawn frame where the browser offers WebGL2's timer query (EXT_disjoint_timer_query_webgl2; whether a browser offers it is reported, not assumed):
       one TIME_ELAPSED query round renderFrame(), read back when available; a disjoint (a GPU reset or clock change) discards the frame's */
    var gl=renderer.getContext(), TQ=null;
    try{ if(renderer.capabilities.isWebGL2) TQ=gl.getExtension("EXT_disjoint_timer_query_webgl2"); }catch(e){ TQ=null; }
    var pendQ=[];
    w.renderFrame=function(){ var q=null;
      if(TQ&&S.on&&pendQ.length<8){ q=gl.createQuery(); gl.beginQuery(TQ.TIME_ELAPSED_EXT,q); }
      try{ origRF(); } finally{ if(q){ gl.endQuery(TQ.TIME_ELAPSED_EXT); pendQ.push(q); } }
      app.drew=true; };
    function pollQ(){
      if(!TQ) return; var disjoint=gl.getParameter(TQ.GPU_DISJOINT_EXT);
      while(pendQ.length&&gl.getQueryParameter(pendQ[0],gl.QUERY_RESULT_AVAILABLE)){ var q=pendQ.shift();
        if(!disjoint&&S.on) S.gpu.push(gl.getQueryParameter(q,gl.QUERY_RESULT)/1e6); gl.deleteQuery(q); }
      if(disjoint){ pendQ.forEach(function(q){ gl.deleteQuery(q); }); pendQ=[]; } }
    function tick(ts){
      if(!S.on) return;
      w.requestAnimationFrame(tick);
      if(S.last){
        var ri=renderer.info.render;
        S.rows.push({t:ts-S.t0, dt:ts-S.last, drew:app.drew, js:app.drew?app.js:null, calls:app.drew?ri.calls:null, tris:app.drew?ri.triangles:null});
      }
      S.last=ts; app.drew=false; pollQ();
      if(S.step) S.step((ts-S.t0)/1000);
      if(S.keep) w.requestRender(2);   /* the view kept drawing every frame */
    }
    function sample(secs,step,keep){
      return new Promise(function(res){
        S.rows=[]; S.gpu=[]; S.last=0; S.step=step||null; S.keep=!!keep; S.on=true;
        w.requestAnimationFrame(function(ts){ S.t0=ts; S.last=0; w.requestAnimationFrame(tick); });
        w.setTimeout(function(){ S.on=false; S.step=null; S.keep=false; var r=S.rows.slice(); r.gpu=S.gpu.slice(); res(r); }, secs*1000+100);
      });
    }
    var refresh=null;
    function summarise(id,kind,rows,extra){
      var warm=rows.filter(function(r){ return r.t<SECS.warm*1000; }), R=rows.filter(function(r){ return r.t>=SECS.warm*1000; });
      var dt=R.map(function(r){ return r.dt; }), drawn=R.filter(function(r){ return r.drew; });
      var js=drawn.map(function(r){ return r.js; }), long=refresh?dt.filter(function(d){ return d>1.5*refresh; }).length:null;
      var span=dt.reduce(function(a,b){ return a+b; },0);
      return Object.assign({id:id, kind:kind, frames:dt.length, drawn:drawn.length, fps:span?r1(dt.length/(span/1000)):null,
        p50:r1(pct(dt,0.5)), p90:r1(pct(dt,0.9)), p95:r1(pct(dt,0.95)), p99:r1(pct(dt,0.99)), max:r1(dt.length?Math.max.apply(null,dt):null),
        long:long, longPct:long==null||!dt.length?null:r1(100*long/dt.length),
        warmMax:r1(warm.length?Math.max.apply(null,warm.map(function(r){ return r.dt; })):null),
        js50:r1(pct(js,0.5)), js95:r1(pct(js,0.95)), gpu50:rows.gpu&&rows.gpu.length?r1(pct(rows.gpu,0.5)):null, gpu95:rows.gpu&&rows.gpu.length?r1(pct(rows.gpu,0.95)):null, gpuN:rows.gpu?rows.gpu.length:0,
        calls:pct(drawn.map(function(r){ return r.calls; }),0.5), tris:pct(drawn.map(function(r){ return r.tris; }),0.5)}, extra||{});
    }
    /* ---- the moves: the camera written each frame through the app's own camera and clamp (no pointer events) ---- */
    function orbitStep(){
      var L=G("landCam"), T=G("orbitTarget").clone(), off=L.position.clone().sub(T), r=Math.hypot(off.x,off.z), a0=Math.atan2(off.z,off.x), y=off.y;
      return function(s){ var a=a0+s*Math.PI/9;   /* 20 degrees a second about the target */
        L.position.set(T.x+r*Math.cos(a),T.y+y,T.z+r*Math.sin(a)); G("orbitTarget").copy(T); L.lookAt(T); w.clampCamera(); w.requestRender(2); };
    }
    function lookStep(){   /* at the eye: the direction of view turned about the eye, 20 degrees a second (eyeFollow keeps it) */
      var L=G("landCam"), E=L.position.clone(), d=G("orbitTarget").clone().sub(E), r=Math.hypot(d.x,d.z), a0=Math.atan2(d.z,d.x);
      return function(s){ var a=a0+s*Math.PI/9; G("orbitTarget").set(E.x+r*Math.cos(a),E.y+d.y,E.z+r*Math.sin(a)); L.lookAt(G("orbitTarget")); w.requestRender(2); };
    }
    function panStep(){   /* the paper map: the centre moved round a circle of a fifth of the view's width, one turn in 6 s */
      var M=G("MAPCAM"), q=M.state(), rad=0.2*w.innerWidth*q.wpp;
      return function(s){ var a=s*Math.PI/3; M.centreOn(q.x+rad*Math.cos(a)-rad,q.z+rad*Math.sin(a),q.wpp,true); w.requestRender(2); };
    }
    var MOVE={orbit:orbitStep, look:lookStep, pan:panStep};
    /* the figures and standards: every mesh of a formation's block (makeBlock: its body, the men, horses and guns, and its standards) */
    function kitMeshes(){
      var out=[], units=G("units");
      Object.keys(units).forEach(function(id){ var b=units[id].block, ud=b&&b.userData; if(!ud) return;
        [ud.body,ud.std].forEach(function(gr){ if(gr) gr.traverse(function(m){ if(m.isMesh) out.push(m); }); }); });
      return out;
    }
    function figuresHidden(on){ kitMeshes().forEach(function(m){ m.material.visible=!on; }); w.requestRender(3); }

    function device(){
      var gl=renderer.getContext(), ext=gl.getExtension("WEBGL_debug_renderer_info"), sz=new THREE.Vector2(); renderer.getDrawingBufferSize(sz);
      var n=w.navigator;
      return {ua:n.userAgent, platform:n.platform||null, cores:n.hardwareConcurrency||null, memoryGB:n.deviceMemory||null,
        dpr:w.devicePixelRatio, screen:[w.screen.width,w.screen.height], viewport:[w.innerWidth,w.innerHeight], inFrame:w!==w.top,
        glVendor:ext?gl.getParameter(ext.UNMASKED_VENDOR_WEBGL):gl.getParameter(gl.VENDOR), glRenderer:ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),
        webgl2:!!renderer.capabilities.isWebGL2, maxTexture:renderer.capabilities.maxTextureSize, pixelRatio:renderer.getPixelRatio(), buffer:[sz.x,sz.y],
        gpuTimer:!!TQ, lowTier:G("lowTier"), fx:G("FX.on"), fxScale:G("FX.scale"), shadowMap:G("renderer.shadowMap.enabled"),
        reducedMotion:!!G("RM"), visibility:w.document.visibilityState, version:VERSION, load:navTiming()};
    }
    /* the page's own load (Navigation Timing): to the DOM ready and the load event, and the bytes over the network (0 from the cache) */
    function navTiming(){ try{ var n=w.performance.getEntriesByType("navigation")[0]; if(!n) return null;
      return {domReadyMs:Math.round(n.domContentLoadedEventEnd), loadMs:Math.round(n.loadEventEnd), transferBytes:n.transferSize||0, bodyBytes:n.decodedBodySize||null}; }catch(e){ return null; } }
    function buildHash(){
      try{
        if(!(w.crypto&&w.crypto.subtle)||!w.fetch) return Promise.resolve(null);
        return w.fetch(w.location.href.split("#")[0]).then(function(r){ return r.arrayBuffer(); }).then(function(b){
          return w.crypto.subtle.digest("SHA-256",b).then(function(h){ return {bytes:b.byteLength, sha256:Array.prototype.map.call(new Uint8Array(h),function(x){ return ("0"+x.toString(16)).slice(-2); }).join("")}; }); })
          .catch(function(){ return null; });
      }catch(e){ return Promise.resolve(null); }
    }
    var out={version:VERSION, started:new Date().toISOString(), device:null, build:null, refreshMs:null, segments:[], notes:[]};
    function want(id){ return !only||only.indexOf(id)>=0; }
    var seq=Promise.resolve();
    function then(f){ seq=seq.then(f); }
    then(function(){ return buildHash().then(function(h){ out.build=h; }); });
    then(function(){
      if(G("RM")) out.notes.push("reduced motion is on: Follow moves only at event starts (turn it off for the played segments)");
      if(w.document.visibilityState!=="visible") out.notes.push("the page was not visible when the run began");
      w.setSpeed(0.5); apply(VIEWS[0].spec); log("refresh");
      return wait(w,800).then(function(){ app.paused=true; return wait(w,1500); }).then(function(){ return sample(SECS.idle*scale); }).then(function(rows){
        app.paused=false; w.requestRender(2);
        var dt=rows.map(function(r){ return r.dt; }); refresh=pct(dt,0.5);
        if(dt.length<20){ refresh=1000/60; out.notes.push("the refresh could not be measured ("+dt.length+" idle frames): 16.7 ms assumed"); }
        else if(refresh>25) out.notes.push("the display refreshed every "+r1(refresh)+" ms while idle (a 30 Hz cap: Low Power Mode on an iPhone, or a battery saver?)");
        out.refreshMs=r1(refresh);
        out.segments.push(summarise("idle","idle",rows,{note:"the app's loop paused by this script: the display's own refresh"}));
        out.device=device(); });
    });
    VIEWS.forEach(function(v){
      if(!want(v.id)) return;
      then(function(){ log(v.id); apply(v.spec); return wait(w,600).then(function(){ return sample(SECS.held*scale,null,true); })
        .then(function(rows){ out.segments.push(summarise(v.id,"held",rows,{note:v.note})); }); });
      then(function(){ apply(v.spec); return wait(w,300).then(function(){ return sample(SECS.move*scale,MOVE[v.move](),true); })
        .then(function(rows){ out.segments.push(summarise(v.id,v.move,rows)); }); });
      if(DIAG.indexOf(v.id)>=0){
        then(function(){ log(v.id+" no figures"); apply(v.spec); figuresHidden(true);
          return wait(w,300).then(function(){ return sample(SECS.move*scale,MOVE[v.move](),true); })
          .then(function(rows){ figuresHidden(false); out.segments.push(summarise(v.id,v.move+" -figures",rows,{note:"figures and standards hidden"})); }); });
        then(function(){ log(v.id+" effects off"); apply(v.spec); var was=G("FX.on"); w.setFXEnabled(false);
          return wait(w,300).then(function(){ return sample(SECS.move*scale,MOVE[v.move](),true); })
          .then(function(rows){ w.setFXEnabled(was); out.segments.push(summarise(v.id,v.move+" -effects",rows,{note:"Visual effects off (the F key)"})); }); });
      }
    });
    PLAYED.forEach(function(p){
      if(!want(p.id)) return;
      then(function(){ log(p.id); apply({t:p.t, presentation:"watch", mode:"terrain", cam:FIELD}); w.setFollow(true); D.settle(30);
        w.setSpeed(p.speed); var c0=G("clock"); w.togglePlay();
        return sample(SECS.played*scale).then(function(rows){ var c1=G("clock"); if(G("playing")) w.stopPlay(); w.setSpeed(0.5);
          out.segments.push(summarise(p.id,"played",rows,{note:"Play at "+p.speed+"x under Follow from 08:30, Watch", clockFrom:r1(c0), clockTo:r1(c1), follow:!G("freeCam")})); }); });
    });
    return seq.then(function(){ pendQ.forEach(function(q){ gl.deleteQuery(q); }); pendQ=[]; w.loop=origLoop; w.renderFrame=origRF; out.finished=new Date().toISOString(); out.text=format(out); return out; },
      function(e){ app.paused=false; w.loop=origLoop; w.renderFrame=origRF; S.on=false; try{ figuresHidden(false); }catch(x){} throw e; });
  }
  function pad(s,n){ s=String(s==null?"-":s); while(s.length<n) s=" "+s; return s; }
  function format(r){
    var d=r.device||{}, L=[];
    L.push("Austerlitz step 6 frame-time route ("+r.version+"), "+r.started);
    L.push("device: "+d.ua);
    L.push("GPU: "+d.glVendor+" / "+d.glRenderer+"; WebGL2 "+d.webgl2+"; cores "+d.cores+"; memory "+d.memoryGB+" GB");
    L.push("screen "+(d.screen||[]).join("x")+", viewport "+(d.viewport||[]).join("x")+", devicePixelRatio "+d.dpr+", drawn at "+d.pixelRatio+" ("+(d.buffer||[]).join("x")+
      "), lowTier "+d.lowTier+", effects "+d.fx+" (scale "+d.fxScale+"), in a frame "+d.inFrame);
    if(d.load) L.push("load: DOM ready "+d.load.domReadyMs+" ms, load event "+d.load.loadMs+" ms, "+d.load.transferBytes+" bytes transferred");
    L.push("build: "+(r.build?r.build.bytes+" bytes, sha256 "+r.build.sha256:"not read")+"; refresh "+r.refreshMs+" ms; long frame > "+(r.refreshMs?r1(1.5*r.refreshMs):"-")+" ms");
    r.notes.forEach(function(n){ L.push("NOTE: "+n); });
    L.push(pad("segment",16)+pad("kind",17)+pad("frames",7)+pad("fps",7)+pad("p50",7)+pad("p95",7)+pad("p99",7)+pad("max",7)+pad("long%",7)+pad("warm",7)+pad("js50",6)+pad("js95",6)+pad("gpu50",6)+pad("gpu95",6)+pad("calls",6)+pad("tris",9));
    r.segments.forEach(function(s){ L.push(pad(s.id,16)+pad(s.kind,17)+pad(s.frames,7)+pad(s.fps,7)+pad(s.p50,7)+pad(s.p95,7)+pad(s.p99,7)+pad(s.max,7)+pad(s.longPct,7)+pad(s.warmMax,7)+pad(s.js50,6)+pad(s.js95,6)+pad(s.gpu50,6)+pad(s.gpu95,6)+pad(s.calls,6)+pad(s.tris,9)); });
    L.push("AUS_PERF_JSON "+JSON.stringify(r,function(k,v){ return k==="text"?undefined:v; }));
    return L.join("\n");
  }
  var API={run:run, format:format, VERSION:VERSION, VIEWS:VIEWS, DIAG:DIAG, PLAYED:PLAYED, SECS:SECS, last:null};
  root.AUS_PERF=API;
  /* pasted into the console of the build's own page: run there at once */
  if(root.AUSTERLITZ_DEBUG&&root.AUSTERLITZ_DEBUG.applyCase&&!root.AUS_PERF_NO_AUTORUN){
    console.log("AUS_PERF: running the route (about 3 minutes); keep this tab in front and do not touch the page");
    run(root,{log:function(m){ console.log("AUS_PERF: "+m); }}).then(function(r){ API.last=r; console.log(r.text); console.log("AUS_PERF: done; copy(AUS_PERF.last.text) copies the report"); },
      function(e){ console.error("AUS_PERF failed:",e); });
  }
})(typeof window!=="undefined"?window:this);
