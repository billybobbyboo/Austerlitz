#!/usr/bin/env node
/* Stage 5 Part A (docs/STAGE5_SPEC.md section D): "Whose eyes?", measured on the built page by a probe. It reads the page's
   own functions, moves the eye for the measurement and puts everything back; it changes no source file.
   node tools/stage5/eyes-probe.js [--json f] [--sheet f]

   1. the Command view as the page computes it: for each headquarters ("fr", "al") every 10 clock minutes, every enemy leaf
      formation's reading (knowledgeOf, cached per phase as the page does) against the same rule evaluated afresh at that
      clock (the cache cleared): how often the drawn reading is not the clock's.
   2. what the Command view changes on screen in each presentation: in the Field vantage at 05:00, 08:00 and 10:00, the enemy
      formations hidden ("unknown"), and those "reported only" ("uncertain") and whether the map layer marks them (the "?"
      badge is a counter's: the landscape draws names, not counters).
   3. the viewshed (computeViewshed, the model's grid, a 3 m eye) from each headquarters' anchors: the share of the modelled
      ground visible, and of it the share under the valley fog's top (238.2 m, the knowledge rule's) in the fog's hours;
      the two line-of-sight implementations against each other (hasLOS from the headquarters to each enemy formation, and
      the viewshed's cell at the formation).
   4. an eye at the headquarters (3 m above the drawn ground, the vertical metre scaled by the display factor) at 1x, 4x and
      10.33x: for each enemy formation, line of sight over the drawn ground (displayHeight, the target 2.5 m) against the
      model's (hasLOS); and over the drawn ground to the top of what is drawn for it (the figures' bounding box at 4x and
      10.33x, the footprint at 1x): how many formations the model hides whose drawing would show above the ground between;
      how tall each would be on screen (px) from the eye; the camera floor and the near plane at that eye.
   5. a sheet: the eye at the Zuran (Napoleon's post) at 08:30 looking at the Pratzen, at 1x, 4x and 10.33x. */
const fs=require("fs"), path=require("path");
const L5=require("./lib.js");
const {launch,open,settle,CASES,HELPERS,inject,sheet,EVID}=L5;
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const OUT=opt("--json")||path.join(EVID,"eyes-probe.json"), SHEET=opt("--sheet")||path.join(EVID,"eyes-sheet.jpg");

const PROBE=function(){
  var E={};
  function sideOf(id){ return FORMATIONS[id].nation==="fr"?"fr":"al"; }
  function enemies(cv){ return Object.keys(units).filter(function(id){ return sideOf(id)!==cv&&!!posNow(id); }); }
  E.cache=function(){ var res={fr:{samples:0,stale:0,ex:[]},al:{samples:0,stale:0,ex:[]}}, keep=clock, cv0=commandView;
    ["fr","al"].forEach(function(cv){ setCommandView(cv); var lastPh=-1;
      for(var t=T_MIN;t<=T_MAX;t+=10){ setClock(t,{instant:true,force:true,camera:false});
        if(curPhase!==lastPh){ lastPh=curPhase; knowKey=""; }   /* the page's reading: computed at the first clock of the phase it sees, then kept */
        var ids=enemies(cv), page={}; ids.forEach(function(id){ page[id]=knowledgeOf(id); });
        var kk=knowKey, kc=knowCache; knowKey=""; knowCache={};   /* afresh at this clock, then the page's cache put back as it was */
        ids.forEach(function(id){ var fresh=knowledgeOf(id); res[cv].samples++; if(fresh!==page[id]){ res[cv].stale++; if(res[cv].ex.length<10) res[cv].ex.push(id+" "+fmtClock(t)+" drawn "+page[id]+", at the clock "+fresh); } });
        knowKey=kk; knowCache=kc; } });
    setCommandView(cv0); setClock(keep,{instant:true,force:true,camera:false}); return res; };
  E.onScreen=function(cv){ setCommandView(cv); knowKey=""; var out={unknown:0,uncertain:0,seen:0,uncertainMarked:0,uncertainIds:[]};
    renderFrame(); mlLayout();
    enemies(cv).forEach(function(id){ var k=knowledgeOf(id); out[k]=(out[k]||0)+1;
      if(k==="uncertain"){ out.uncertainIds.push(id); var marked=false; Object.keys(ML.items).forEach(function(key){ var it=ML.items[key]; if(it.fid===id&&it.state==="on"&&/\?/.test(it.el.textContent||"")) marked=true; }); if(marked) out.uncertainMarked++; } });
    setCommandView("none"); return out; };
  E.viewshed=function(){ var out=[], top=238.2, keep=clock;
    [["gqg","fr"],["ahq","al"]].forEach(function(h){ anchorList(h[0]).forEach(function(a){ if(!a.p) return;
      var t0=performance.now(); computeViewshed(a.p,EYE_OBSERVER_M); var ms=performance.now()-t0; var vis=0, low=0, n=vsMask.length;
      for(var i=0;i<n;i++) if(vsMask[i]){ vis++; if(GEOREF.elevM(gridH[i])<top) low++; }
      /* the two line-of-sight implementations at this anchor's phase */
      var t=Math.max(PHASES[a.ph].t0,a.arr||0)+1; setClock(t,{instant:true,force:true,camera:false});
      var agree=0, dis=0, ex=[];
      enemies(h[1]).forEach(function(id){ var p=posNow(id), w=W(p[0],p[1]), los=hasLOS(a.p,p), vs=!!sampleVS(w[0],w[1]); if(los===vs) agree++; else { dis++; if(ex.length<4) ex.push(id+(los?" LOS, not in viewshed":" in viewshed, no LOS")); } });
      out.push({hq:h[0],ph:a.ph,p:a.p,ms:+ms.toFixed(1),visibleShare:+(vis/n).toFixed(4),underFogTopShareOfVisible:vis?+(low/vis).toFixed(3):0,losAgree:agree,losDisagree:dis,ex:ex}); }); });
    clearViewshed(); setClock(keep,{instant:true,force:true,camera:false}); return out; };
  /* the eye at a headquarters at the current factor */
  E.eye=function(hq,cv){ var p=posNow(hq); if(!p) return null; var k=DISPLAY.factor, mU=k/GEOREF.M_PER_WORLD, w=W(p[0],p[1]);
    var eyeY=displayHeight(w[0],w[1])+3.0*mU, res={factor:k,eyeAboveGroundUnits:+(3.0*mU).toFixed(4),camFloorUnits:CAM_CLEAR,camFloorM:+(CAM_CLEAR/mU).toFixed(1),nearPlaneM:+(landCam.near*GEOREF.M_PER_WORLD).toFixed(0),
      targets:0,drawnAgree:0,drawnDisagree:0,modelHidden:0,hiddenButDrawnShows:0,shows:[],pxTall:[]};
    var H=viewH(), tf=Math.tan(landCam.fov*Math.PI/360);
    function drawnLOS(x0,y0,z0,x1,y1,z1){ var dx=x1-x0, dz=z1-z0, L=Math.hypot(dx,dz), n=Math.min(400,Math.max(8,Math.ceil(L/0.5)));
      for(var i=1;i<n;i++){ var t=i/n; if(displayHeight(x0+dx*t,z0+dz*t) > y0+(y1-y0)*t+0.5*mU) return false; } return true; }
    enemies(cv).forEach(function(id){ var q=posNow(id), wq=W(q[0],q[1]), gy=displayHeight(wq[0],wq[1]), rec=units[id]; res.targets++;
      var model=hasLOS(p,q), drawn=drawnLOS(w[0],eyeY,w[1],wq[0],gy+2.5*mU,wq[1]); if(model===drawn) res.drawnAgree++; else res.drawnDisagree++;
      var top;
      if(k===1) top=gy+0.25;   /* the footprint's lift at true scale (placeFootprint, 0.25 units) */
      else { rec.block.updateMatrixWorld(true); var bb=new THREE.Box3().setFromObject(rec.block); top=bb.isEmpty()?gy:bb.max.y; }
      var dist=Math.hypot(wq[0]-w[0],wq[1]-w[1]); res.pxTall.push([id,+((top-gy)*H/(2*dist*tf)).toFixed(1),+(dist*GEOREF.M_PER_WORLD/1000).toFixed(2)]);
      if(!model){ res.modelHidden++; if(drawnLOS(w[0],eyeY,w[1],wq[0],top,wq[1])){ res.hiddenButDrawnShows++; if(res.shows.length<12) res.shows.push(id); } } });
    return res; };
  E.place=function(hq,look){ var p=posNow(hq), w=W(p[0],p[1]), k=DISPLAY.factor, mU=k/GEOREF.M_PER_WORLD, l=W(look[0],look[1]);
    E._near=landCam.near; landCam.near=0.05; landCam.updateProjectionMatrix(); freeCam=true;
    landCam.position.set(w[0],displayHeight(w[0],w[1])+3.0*mU,w[1]); orbitTarget.set(l[0],displayHeight(l[0],l[1]),l[1]); landCam.lookAt(orbitTarget); landCam.updateMatrixWorld(true);
    var floor=camFloor(w[0],w[1]); return {eyeY:+landCam.position.y.toFixed(3),floor:+floor.toFixed(3),underFloor:landCam.position.y<floor}; };
  E.draw=function(){ renderFrame(); return true; };
  E.restore=function(){ if(E._near!==undefined){ landCam.near=E._near; landCam.updateProjectionMatrix(); } return true; };
  window.__s5e=E; return true;
};

(async()=>{
  const browser=await launch(), page=await open(browser,[1600,900]), out={html:process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html",when:new Date().toISOString()}, tiles=[];
  await inject(page,HELPERS); await inject(page,PROBE);
  const field=CASES.find(c=>c.name==="overview-field");
  out.cache=await page.evaluate(()=>__s5e.cache()); console.log("cache",JSON.stringify({fr:[out.cache.fr.stale,out.cache.fr.samples],al:[out.cache.al.stale,out.cache.al.samples]}),out.cache.fr.ex.slice(0,3),out.cache.al.ex.slice(0,3));
  if(args.includes("--cache-only")){ const prev=fs.existsSync(OUT)?JSON.parse(fs.readFileSync(OUT,"utf8")):{}; prev.cache=out.cache; prev.cacheWhen=out.when; fs.writeFileSync(OUT,JSON.stringify(prev,null,1)); await browser.close(); return; }
  out.onScreen={};
  for(const [t,pres,md] of [[300,"study","terrain"],[480,"study","terrain"],[600,"study","terrain"],[300,"study","hybrid"],[480,"study","hybrid"],[300,"study","staff"]]){
    await page.evaluate(s=>window.__aus.apply(s),Object.assign({},field,{t,presentation:pres,mode:md})); await settle(page);
    for(const cv of ["fr","al"]){ const k=md+"@"+t+":"+cv; out.onScreen[k]=await page.evaluate(c=>__s5e.onScreen(c),cv); console.log("on screen",k,JSON.stringify(out.onScreen[k])); } }
  out.viewshed=await page.evaluate(()=>__s5e.viewshed()); out.viewshed.forEach(v=>console.log("viewshed",JSON.stringify(v)));
  out.eye={};
  for(const [fk,lab] of [[1,"1x"],[4,"4x"],["model","10.33x"]]){
    for(const [t,hq,cv] of [[510,"gqg","fr"],[600,"gqg","fr"],[780,"gqg","fr"],[480,"ahq","al"],[600,"ahq","al"]]){
      await page.evaluate(s=>window.__aus.apply(s),Object.assign({},field,{t,presentation:"watch",mode:"terrain",factor:fk})); await settle(page);
      const k=hq+"@"+t+"@"+lab; out.eye[k]=await page.evaluate(([h,c])=>__s5e.eye(h,c),[hq,cv]);
      const e=out.eye[k]; console.log("eye",k,"targets",e.targets,"drawn LOS agree",e.drawnAgree,"disagree",e.drawnDisagree,"model hidden",e.modelHidden,"drawing shows",e.hiddenButDrawnShows,"floor",e.camFloorM+"m","near",e.nearPlaneM+"m");
    }
    await page.evaluate(s=>window.__aus.apply(s),Object.assign({},field,{t:510,presentation:"watch",mode:"terrain",factor:fk})); await settle(page);
    const pl=await page.evaluate(()=>__s5e.place("gqg",[285,289])); out.eye["place@"+lab]=pl;
    await page.evaluate(()=>{ const m=document.getElementById("maplayer"); if(m) m.style.visibility="hidden"; });
    await page.evaluate(()=>__s5e.draw());
    tiles.push({png:await page.screenshot({timeout:180000}),cap:"eye at the Zuran 08:30 toward the Pratzeberg, "+lab+(pl.underFloor?" (under today's camera floor)":"")});
    await page.evaluate(()=>{ const m=document.getElementById("maplayer"); if(m) m.style.visibility=""; __s5e.restore(); });
  }
  fs.mkdirSync(EVID,{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(out,null,1));
  fs.writeFileSync(SHEET,await sheet(page,tiles,3,640,360,"Stage 5 Part A: an eye 3 m above the ground at Napoleon's post (probe; the map layer hidden)"));
  if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(2); });
