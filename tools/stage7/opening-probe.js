#!/usr/bin/env node
/* Stage 7 Part A (docs/STAGE7_SPEC.md section 3): the openings, prototyped by driving the running page with its own machinery. No
   source file changes: every prototype is a sequence of the app's own calls (the tour's applyTour, flyTo's glide, the clock, the dwell,
   Follow, the draw-on, setPresentation, selectTab), and the card's prototypes are edits of the page's DOM made in the probe's own page.
   node tools/stage7/opening-probe.js [--json f] [--sheet f] [--only tour,glides,small,played,card,ends]
   tour    the nine tour stops as stills, applied as the tour applies them (Study, the dispatch hidden, the tour bar), from the first-run
           screen, at 1600 x 900: each stop's frame (unobstructed fraction, drops, map text as rendered, darkness, the smoke's and the
           confidence marks' shares, draw calls, the world pass), the tour bar's box and the stop's clock and camera
   glides  the camera's path between the stops of each subset (and from the first-run Overview to the first stop): sampled every 2% of
           the glide, the lowest clearance above the drawn ground and the floor's lifts
   small   the stops of the subsets at 1280 x 720, and stop 1 at 1024 x 768 (the undocked layout) and 390 x 844
   played  Watch, Follow, the dwell and the draw-on (at the holds the stop's text in the tour bar, as the opening would show it), the clock played from 04:00 to 11:00 by the app's own tickClock and followStep in
           50 ms steps (no wall clock): the length at 1/2x (the default), 1x, 2x and 4x with the dwells counted; at 4x the camera's path
           (lowest clearance, the floor's lifts, the target's screen speed) and frames at the holds (04:00, 08:45, 11:00) and between
   card    the card refined, as DOM edits in the probe's page: without the hint; with one primary action; with the Now tab under it
           (decision 55's tab, which today shows only after the card closes), at 1600 x 900 and 1280 x 720
   names   (only when named) what stops 1, 6, 7 and 8 name on the map at 1600 x 900 and 1280 x 720: the items placed, the plateau reading
   ends    where an opening could leave the visitor: Study on the Now tab at the last stop's clock (Follow on); Study on the Now tab at
           04:00 with the Overview; Watch paused at the last stop's clock
   Measurement only: nothing here is the Stage 7 design, and nothing is written to a source file. */
const fs=require("fs"), path=require("path");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ONLY=(opt("--only")||"tour,glides,small,played,card,ends").split(",");
const OUT=opt("--json")||path.join(L.EVID7,"opening-probe.json"), SHEET=opt("--sheet")||path.join(L.EVID7,"opening-sheet.jpg");
const res=fs.existsSync(OUT)?JSON.parse(fs.readFileSync(OUT,"utf8")):{};
const save=()=>fs.writeFileSync(OUT,JSON.stringify(res,null,1));
const SUBSETS={"1,6,7":[0,5,6],"1,6,7,8":[0,5,6,7],"1,4,6,7,8":[0,3,5,6,7],"all nine":[0,1,2,3,4,5,6,7,8]};
const LIMIT=L.TH.DROP_LIMIT["first-run"];   /* the frames are held against the first-run case's limit (12), stated: no opening case exists yet */
const tiles=[];

/* in the page: apply tour stop i as the tour does (from the first-run card: closeFirst, then the stop), sampling the glide it starts */
const STOP=(i)=>{
  var c0=CAM.clamps, t0=performance.now(), from=landCam.position.clone();
  if(typeof firstRunOpen!=="undefined"&&firstRunOpen) closeFirst(null);
  if(tourStep<0){ tourStep=0; hideDispatch=true; syncVis(); }
  tourStep=i; applyTour();
  var fn=_tw.cam, lo=1e9, n=0;
  if(fn){ for(var k=0;k<=50;k++){ fn(t0+k*1600/50); var p=landCam.position, c=p.y-camGround(p.x,p.z); if(c<lo) lo=c; n++; } }
  var st=TOUR[i], bar=document.getElementById("tourbar"), b=bar.getBoundingClientRect();
  return {stop:i+1,n:st.n,at:st.at,clock:fmtClock(clock),phase:curPhase,chapter:chapter,plan:planSide,selection:selection?selection.kind+":"+selection.id:null,
    glide:{samples:n,lowest:+lo.toFixed(2),lifts:CAM.clamps-c0,from:from.toArray().map(function(v){ return +v.toFixed(1); })},
    camera:{pos:landCam.position.toArray().map(function(v){ return +v.toFixed(1); }),tgt:orbitTarget.toArray().map(function(v){ return +v.toFixed(1); }),dist:+landCam.position.distanceTo(orbitTarget).toFixed(1)},
    bar:{box:[Math.round(b.left),Math.round(b.top),Math.round(b.width),Math.round(b.height)],count:document.getElementById("tour-n").textContent,words:TOUR[i].x.split(/\s+/).length,
      scroll:bar.scrollHeight>bar.clientHeight+1},
    sun:+SUN_DAY.at(clock).alt.toFixed(1), fog:+fogAmount(clock).toFixed(2)};
};
/* in the page: play the clock from t0 to t1 at speed s with the app's tickClock and followStep in 50 ms steps (Follow on, the dwell on);
   returns the simulated seconds, the dwells, and the camera's lowest clearance, floor lifts and the target's largest screen speed */
const PLAY=(a)=>{
  var t0=a[0], t1=a[1], s=a[2], cam=a[3], stops=a[4]||[];
  stopPlay(); setSpeed(s); setClock(t0,{instant:true,force:true,camera:false}); freeCam=false; __fin();
  var c0=CAM.clamps, ms=0, dw=0, lo=1e9, vmax=0, prev=null, hold=false, sawHold=false, log=[];
  playing=true; dwellReset(); FOLLOW.T=null; FOLLOW.ev=null; DWELL.expect=null;
  var guard=0;
  while(clock<t1-1e-6&&guard++<200000){
    tickClock(50); followStep(50); ms+=50;
    var h=!!(DWELL.st&&DWELL.st.stage==="hold"); if(h&&!hold) dw++; hold=h;
    var p=landCam.position, c=p.y-camGround(p.x,p.z); if(c<lo) lo=c;
    if(prev){ landCam.updateMatrixWorld(true); var v=orbitTarget.clone().project(landCam), x=(v.x*0.5+0.5)*innerWidth, y=(-v.y*0.5+0.5)*viewH();
      var w=prev.clone().project(landCam), x0=(w.x*0.5+0.5)*innerWidth, y0=(-w.y*0.5+0.5)*viewH(); vmax=Math.max(vmax,Math.hypot(x-x0,y-y0)/0.05); }
    prev=orbitTarget.clone();
    if(!playing) break;
  }
  if(clock>t1) setClock(t1,{instant:true,force:true,camera:false});
  playing=false; dwellReset(); paintExaggeration();
  return {from:fmtClock(t0),to:fmtClock(clock),speed:s,seconds:+(ms/1000).toFixed(1),dwells:dw,lowest:+lo.toFixed(1),lifts:CAM.clamps-c0,screenSpeedMax:+vmax.toFixed(0),
    camera:{dist:+landCam.position.distanceTo(orbitTarget).toFixed(1)}};
};

(async()=>{
  const browser=await L.launch();
  if(ONLY.includes("tour")){
    res.tour=res.tour||[];
    const page=await L.open(browser,[1600,900]);
    for(let i=0;i<9;i++){
      if(res.tour[i]&&!argv.includes("--redo")) continue;
      /* each stop from the one before, as the tour runs; stop 1 from the first-run card */
      if(i>0) await page.evaluate(k=>{ tourStep=k; applyTour(); __fin(); },i-1);
      const st=await page.evaluate(STOP,i);
      const f=await L.frame(page,LIMIT);
      res.tour[i]=Object.assign(st,{frame:L.strip(f)});
      if([0,3,5,6,7,8].includes(i)) tiles.push({png:f.png,cap:"tour stop "+(i+1)+" ("+st.clock+"): free "+(100*f.unobstructed).toFixed(1)+"%, drops "+f.layer.dropped});
      console.log("stop",i+1,st.clock,"free",f.unobstructed,"drops",f.layer.dropped,"text",f.text.min,"dark",f.dark.solidBlack,"smoke",f.smoke,"conf",f.conf,"calls",f.cost.calls,"world",f.cost.worldMs,"glide low",st.glide.lowest,"lifts",st.glide.lifts);
      save();
    }
    await page.close();
  }
  if(ONLY.includes("glides")){
    res.glides={};
    const page=await L.open(browser,[1600,900]);
    for(const [k,ix] of Object.entries(SUBSETS)){
      /* from the first-run screen (a fresh state each subset: the card reopened as the self-test reopens it) */
      await page.evaluate(()=>{ if(tourStep>=0) exitTour(); stopPlay(); setPresentation("study"); setClock(T_MIN,{instant:true,force:true,camera:false});
        var fr=document.getElementById("firstrun"); fr.hidden=false; openFirstRun(); __fin(); });
      const legs=[];
      for(const i of ix){ const st=await page.evaluate(STOP,i); legs.push({to:i+1,clock:st.clock,lowest:st.glide.lowest,lifts:st.glide.lifts,dist:st.camera.dist}); await page.evaluate(()=>__fin()); }
      res.glides[k]={legs,lowest:Math.min(...legs.map(l=>l.lowest)),lifts:legs.reduce((a,l)=>a+l.lifts,0)};
      console.log("glides",k,JSON.stringify(res.glides[k]));
    }
    await page.evaluate(()=>exitTour());
    save(); await page.close();
  }
  if(ONLY.includes("small")){
    res.small=res.small||{};
    for(const [vk,vp,ix] of [["1280x720",[1280,720],[0,3,5,6,7]],["1024x768",[1024,768],[0]],["390x844",[390,844],[0]]]){
      const page=await L.open(browser,vp);
      for(const i of ix){
        const key=vk+" stop "+(i+1); if(res.small[key]&&!argv.includes("--redo")) continue;
        const st=await page.evaluate(STOP,i); const f=await L.frame(page,vk==="1280x720"?L.TH.DROP_LIMIT["first-run-laptop"]:16);
        res.small[key]=Object.assign(st,{frame:L.strip(f)});
        if(i===0||i===5) tiles.push({png:f.png,cap:key+": free "+(100*f.unobstructed).toFixed(1)+"%, bar "+st.bar.box[3]+" px"});
        console.log(key,"free",f.unobstructed,"bar",JSON.stringify(st.bar),"drops",f.layer.dropped,"text",f.text.min); save();
      }
      await page.close();
    }
  }
  if(ONLY.includes("played")){
    res.played=res.played||{};
    const page=await L.open(browser,[1600,900]);
    await page.evaluate(()=>{ closeFirst(null); setPresentation("watch"); });
    /* the lengths: 04:00 to 11:00 (stops 1, 6, 7's moments), and to 14:30 (stop 8), at the four speeds; the reading holds are added in
       the specification, not here (they are design values) */
    res.played.lengths=[];
    for(const s of [0.5,1,2,4]) for(const t1 of [525,660,870]){
      await page.evaluate(()=>{ var fr=document.getElementById("firstrun"); fr.hidden=false; openFirstRun(); closeFirst(null); setPresentation("watch"); });
      const r=await page.evaluate(PLAY,[240,t1,s]); res.played.lengths.push(r); console.log("played",JSON.stringify(r));
    }
    save();
    /* the frames at 4x: the start (04:00, from the first-run Overview), between, and at the holds */
    res.played.frames=res.played.frames||{};
    await page.evaluate(()=>{ var fr=document.getElementById("firstrun"); fr.hidden=false; openFirstRun(); closeFirst(null); setPresentation("watch"); setClock(T_MIN,{instant:true,force:true,camera:false}); });
    let t=240;
    for(const [lab,t1] of [["04:00 (stop 1's hold)",240],["06:30, playing",390],["08:45 (stop 6's hold)",525],["10:00, playing",600],["11:00 (stop 7's hold)",660]]){
      if(t1>t){ const r=await page.evaluate(PLAY,[t,t1,4]); t=t1; res.played["path to "+lab]=r; }
      /* at a hold the stop's text stands in the tour bar (its place and type), as the opening would show it; between holds no bar */
      const stopAt={240:0,525:5,660:6}[t1];
      await page.evaluate(i=>{ var bar=document.getElementById("tourbar");
        if(i===undefined||i===null){ bar.hidden=true; return; }
        bar.hidden=false; document.getElementById("tour-n").textContent="STEP "+({0:1,5:2,6:3}[i])+" OF 3"; document.getElementById("tour-t").textContent=TOUR[i].n;
        document.getElementById("tour-x").textContent=TOUR[i].x; },stopAt===undefined?null:stopAt);
      const f=await L.frame(page,LIMIT);
      res.played.frames[lab]=Object.assign({clock:await page.evaluate(()=>fmtClock(clock)),dist:await page.evaluate(()=>+landCam.position.distanceTo(orbitTarget).toFixed(1)),
        bar:await page.evaluate(()=>{ var b=document.getElementById("tourbar"); if(b.hidden) return null; var r=b.getBoundingClientRect(); return [r.left,r.top,r.width,r.height].map(Math.round); })},L.strip(f));
      if(lab.includes("hold")) tiles.push({png:f.png,cap:"played 4x, "+lab+": free "+(100*f.unobstructed).toFixed(1)+"%, drops "+f.layer.dropped});
      console.log("played frame",lab,"free",f.unobstructed,"drops",f.layer.dropped,"text",f.text.min,"dark",f.dark.solidBlack,"smoke",f.smoke,"conf",f.conf,"calls",f.cost.calls); save();
      /* restore the clock the frame's settle may not have moved (the probe drives the clock; Play is never on between steps) */
      await page.evaluate(x=>{ if(Math.abs(clock-x)>0.01) setClock(x,{instant:true,force:true,camera:false}); },t1);
    }
    await page.close();
  }
  if(ONLY.includes("card")){
    res.card=res.card||{};
    for(const vp of [[1600,900],[1280,720]]){
      const page=await L.open(browser,vp), vk=vp.join("x");
      const P=[
        ["today",()=>{}],
        ["without the hint",()=>{ document.querySelector("#firstrun .fr-hint").style.display="none"; }],
        ["one primary action",()=>{ document.querySelector("#firstrun .fr-hint").style.display="none"; document.getElementById("fr-watch").style.display="none"; }],
        ["the Now tab under it",()=>{ document.querySelector("#firstrun .fr-hint").style.display=""; document.getElementById("fr-watch").style.display=""; selectTab("now"); }],
        /* the tab alone shows an empty pane: the card's rule hides the dispatch wherever it is (style.css:611); here that rule is lifted */
        ["the Now tab with its dispatch under it",()=>{ var st=document.createElement("style"); st.textContent="body.firstrun-on .dispatch{display:block !important}"; document.head.appendChild(st); selectTab("now"); }]
      ];
      for(const [k,fn] of P){
        const key=vk+" "+k; if(res.card[key]&&!argv.includes("--redo")) continue;
        await page.evaluate(fn); await page.evaluate(()=>{ requestRender(3); });
        const f=await L.frame(page,vp[0]===1600?LIMIT:L.TH.DROP_LIMIT["first-run-laptop"],{noConf:true});
        const box=await page.evaluate(()=>{ var b=document.getElementById("firstrun").getBoundingClientRect(); return [Math.round(b.left),Math.round(b.top),Math.round(b.width),Math.round(b.height)]; });
        /* what of the day's battle the card stands over: every formation on the field at the clock and every place, projected (the view
           is framed without the card, decision 61) */
        const under=await page.evaluate(()=>{ var b=document.getElementById("firstrun").getBoundingClientRect(), out={forms:[],places:[],n:0}, v=new THREE.Vector3();
          landCam.updateMatrixWorld(true);
          function sc(x,z){ v.set(x,groundY(x,z),z).project(landCam); return [(v.x*0.5+0.5)*innerWidth,(-v.y*0.5+0.5)*viewH()]; }
          function inC(q){ return q[0]>=b.left&&q[0]<=b.right&&q[1]>=b.top&&q[1]<=b.bottom; }
          Object.keys(units).forEach(function(id){ var p=posNow(id); if(!p) return; out.n++; var w=W(p[0],p[1]); if(inC(sc(w[0],w[1]))) out.forms.push(id); });
          FEATURES.forEach(function(ft){ out.n++; var w=W(ft.p[0],ft.p[1]); if(inC(sc(w[0],w[1]))) out.places.push(ft.id); });
          mlLayout(); out.placed=Object.keys(ML.items).filter(function(k){ var q=ML.items[k]; return q.eFrame===ML.frame&&q.state==="on"; }); out.dropped=ML.stats.dropped_.slice();
          return out; });
        res.card[key]={box,under,frame:L.strip(f)}; console.log("card",key,"box",box,"free",f.unobstructed,"stage0",f.stage0.join("; ")); save();
      }
      await page.close();
    }
  }
  if(ONLY.includes("ends")){
    res.ends=res.ends||{};
    for(const vp of [[1600,900],[1280,720]]){
    const page=await L.open(browser,vp), vk=vp.join("x");
    const E=[
      ["Study, Now tab, at the last stop's clock (11:00), Follow on",()=>{ closeFirst(null); tourStep=0; hideDispatch=true; syncVis(); tourStep=6; applyTour(); __fin(); exitTour(); setPresentation("study"); selectTab("now"); }],
      ["Study, Now tab, 04:00, the Overview",()=>{ setClock(T_MIN,{instant:true,force:true,camera:false}); flyTo(VANTAGE.plan); __fin(); selectTab("now"); }],
      ["Watch, paused at 11:00, the stop's camera",()=>{ tourStep=0; hideDispatch=true; syncVis(); tourStep=6; applyTour(); __fin(); exitTour(); setPresentation("watch"); }]
    ];
    for(const [k0,fn] of E){
      const k=vk+" "+k0;
      if(res.ends[k]&&!argv.includes("--redo")) continue;
      await page.evaluate(fn);
      const f=await L.frame(page,vp[0]===1600?LIMIT:L.TH.DROP_LIMIT["first-run-laptop"]);
      const s=await page.evaluate(()=>({placed:(mlLayout(),Object.keys(ML.items).filter(function(k){ var q=ML.items[k]; return q.eFrame===ML.frame&&q.state==="on"; })),clock:fmtClock(clock),presentation:presentation,tab:(document.querySelector(".tab-btn[aria-selected='true']")||{dataset:{}}).dataset.t,follow:!freeCam,legendOpen:ML.legendOpen,focus:document.activeElement&&(document.activeElement.id||document.activeElement.tagName)}));
      res.ends[k]=Object.assign(s,{frame:L.strip(f)}); console.log("end",k,JSON.stringify(s),"free",f.unobstructed,"stage0",f.stage0.join("; "));
      if(vp[0]===1600) tiles.push({png:f.png,cap:"end: "+k0.split(",").slice(0,3).join(",")}); save();
    }
    await page.close();
    }
  }
  if(ONLY.includes("names")){
    /* what the stops name on the map: the map-layer items placed (this pass's), and the plateau reading's label if drawn */
    res.names={};
    for(const vp of [[1600,900],[1280,720]]){
      const page=await L.open(browser,vp);
      for(const i of [0,5,6,7]){
        await page.evaluate(STOP,i); await page.evaluate(()=>__fin()); await L.settle(page);
        res.names[vp.join("x")+" stop "+(i+1)]=await page.evaluate(()=>{ mlLayout(); var P=Object.keys(ML.items).filter(function(k){ var q=ML.items[k]; return q.eFrame===ML.frame&&q.state==="on"; });
          var pl=ML.items["p:plateau"]; return {placed:P,dropped:ML.stats.dropped_.slice(),plateau:(pl&&pl.eFrame===ML.frame&&pl.state==="on")?pl.el.textContent.replace(/\s+/g," ").trim():null}; });
        console.log("names",vp.join("x"),"stop",i+1,JSON.stringify(res.names[vp.join("x")+" stop "+(i+1)].plateau)); save();
      }
      await page.close();
    }
  }
  if(tiles.length){ const pg=await L.open(browser,[1600,900]);
    const sh=SHEET.replace(/\.jpg$/,"-"+ONLY.join("-")+".jpg");
    fs.writeFileSync(sh,await L.sheet(pg,tiles,3,480,270,"Stage 7 Part A: the openings, prototyped ("+ONLY.join(", ")+")",true)); await pg.close(); }
  await browser.close();
})();
