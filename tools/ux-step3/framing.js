#!/usr/bin/env node
/* UI/UX roadmap step 3 (docs/UX_ART_AUDIT.md UA-02): Follow's framing during Play, measured on any build, so that the Step 2 build and the
   candidate are measured by one tool, one clock, one start, one viewport, one presentation and one renderer.
   A run: a page at the size asked (tools/ux-step3/lib.js: a desktop's, or a phone's, Chromium's emulation), the card closed by a real press,
   the ground (the Landscape, or the Landscape with counters) and the presentation asked, the clock set to the run's start and the eye put at
   that phase's authored view (presetFrame, the same on every build: the start is not left to the build's own seek), Follow on, then Play at
   half speed on the motion driver's clock (tools/visual/motion.js: the app's own loop stepped at 30 frames a second whatever the machine's
   speed; the WebGL draw skipped, which the layout and the measures do not read) until the clock reaches the run's end.
   Every frame, in the page (window.__fr.frame):
   - the live events with a weight above 0.3 (UA-02's rule): each one's place projected on the drawn ground and classed: in the free map (the
     largest rectangle no panel covers, landFreeRect: the rectangle Follow frames into), on the screen but outside it, under a panel, off the
     screen or behind the eye; and its label's state in the layer (drawn, behind the ground, dropped);
   - the composition (tools/visual/ux2.js comp: the formations on the field, those inside the free map, their box's share of it, and the
     filled plates over that box);
   - the eye: its distance to its target, its elevation and azimuth, its clearance above the floor (camFloor) and the target's;
   - the projected movement: the ground points under a 5 x 5 grid of the free map and the qualifying events' places, taken in the frame before
     and projected again in this one, each while it is on the screen in both: the largest move in CSS px a second (the "flow"), and the
     target's own (the move the 150 px/s cap holds);
   - the rich kit (KLOD): the blocks drawn rich, the switches;
   - the labels: drawn by kind, the formation names in the layer and drawn, those dropped.
   In node: the per-event share of minutes inside the free map (a minute counts for an event when the event qualifies in at least half its
   frames; it is inside when it is inside in at least half of those), the share of live minutes (a minute with a qualifying event) with every
   qualifying event inside, the box's share against 50% (desktop) or 40% (phone), the formations in the free map, the flow's maxima and its
   95th percentile, and what was below the floor.
   node tools/ux-step3/framing.js <build.html> --out <dir> [--vp 1440x900] [--phone] [--pres study|watch] [--mode terrain|hybrid] [--from 240]
     [--to 1080] [--tag name] [--set '{"ELEV":52}'] (FOLLOW's fields set in the page before the run: a candidate's parameters, on a build that
     reads them) [--reduced] [--census N] (every Nth frame drawn with WebGL and its draw calls and triangles read: the census; the numbers are
     the build's own, not a GPU's time) */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), MO=require(path.join(L.ROOT,"tools","visual","motion.js")), UX=require(path.join(L.ROOT,"tools","visual","ux2.js"));
const argv=process.argv.slice(2), opt=(f,d)=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:d; }, has=f=>argv.includes(f);
const html=path.resolve(argv.find(a=>a.endsWith(".html"))||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=path.resolve(opt("--out","tools/ux-step3/out"));
const PHONE=has("--phone"), VP=opt("--vp",PHONE?"390x844":"1440x900").split("x").map(Number), PRES=opt("--pres","study"), MODE=opt("--mode","terrain");
const FROM=+opt("--from",240), TO=+opt("--to",1080), SET=opt("--set",null), RED=has("--reduced"), CENSUS=+opt("--census",0);
const TAG=opt("--tag",(PHONE?"phone":"desk")+"-"+VP.join("x")+"-"+PRES+(MODE!=="terrain"?"-"+MODE:"")+"-"+FROM+"-"+TO+(RED?"-rm":""));
const W0=0.3;

const inPage=function(){
  if(window.__fr) return true;
  var R={prev:null, grid:5};
  var v=new THREE.Vector3();
  function free(){ return mode==="staff"?MAPCAM.freeRect():landFreeRect(); }
  function panels(){ try{ return mode==="staff"?mlPanels():landPanels(); }catch(e){ return []; } }
  function proj(p){ v.set(p[0],p[1],p[2]).project(camera); return {x:(v.x+1)/2*innerWidth, y:(1-v.y)/2*innerHeight, z:v.z}; }
  function cls(s,fr,P){ if(!(s.z<1&&s.z>-1)) return "behind";
    if(s.x<0||s.y<0||s.x>innerWidth||s.y>innerHeight) return "offscreen";
    for(var i=0;i<P.length;i++){ var q=P[i]; if(s.x>=q[0]&&s.x<=q[2]&&s.y>=q[1]&&s.y<=q[3]) return "panel"; }
    if(s.x>=fr[0]&&s.x<=fr[2]&&s.y>=fr[1]&&s.y<=fr[3]) return "free";
    return "margin"; }
  R.frame=function(o){ o=o||{};
    camera.updateMatrixWorld(); var fr=free(), P=panels(), out={clock:+clock.toFixed(3), playing:!!playing, free:fr.map(Math.round)};
    /* the eye */
    var c=camera.position, t=orbitTarget, d=c.distanceTo(t), h=Math.hypot(c.x-t.x,c.z-t.z);
    out.cam={d:+d.toFixed(2), el:+(Math.atan2(c.y-t.y,h)*180/Math.PI).toFixed(2), az:+(Math.atan2(c.x-t.x,c.z-t.z)*180/Math.PI).toFixed(2),
      clear:mode==="staff"?null:+(c.y-camFloor(c.x,c.z)).toFixed(3), t:[+t.x.toFixed(2),+t.y.toFixed(2),+t.z.toFixed(2)], freeCam:!!freeCam, voff:typeof VOFF!=="undefined"?[+VOFF.x.toFixed(1),+VOFF.y.toFixed(1)]:null};
    /* the qualifying live events */
    var ev=[], pts=[];
    liveEvents(clock).forEach(function(q){ if(!(q.w>0.3)) return; var w=W(q.e.p[0],q.e.p[1]), P3=[w[0],groundY(w[0],w[1]),w[1]], s=proj(P3), it=ML.items["e:"+q.e.id];
      ev.push({id:q.e.id, w:+q.w.toFixed(3), c:cls(s,fr,P), sx:Math.round(s.x), sy:Math.round(s.y), lab:it&&it.frame===ML.frame?(it.eFrame===ML.frame?it.state:"offscreen"):null}); pts.push(P3); });
    out.ev=ev;
    /* the projected movement since the frame before: its points projected again */
    var dt=o.dt||1/30;
    if(R.prev&&R.prev.pts.length){ var mx=0, ms=[];
      /* a point counts while it is on the screen in both frames (an event's place beyond the screen's edge moves fast and is not seen) */
      var onS=function(q){ return q.x>=0&&q.y>=0&&q.x<=innerWidth&&q.y<=innerHeight; };
      R.prev.pts.forEach(function(p,i){ var s=proj(p), a=R.prev.scr[i]; if(!a||!(s.z<1&&s.z>-1)||!onS(s)||!onS(a)) return; var m=Math.hypot(s.x-a.x,s.y-a.y)/dt; ms.push(m); if(m>mx) mx=m; });
      out.flow=+mx.toFixed(1); var st=proj(R.prev.tgt); out.tflow=+(Math.hypot(st.x-R.prev.tscr.x,st.y-R.prev.tscr.y)/dt).toFixed(1); }
    /* this frame's points: the ground under a grid of the free map, and the events' places */
    var G=[]; if(mode!=="staff"){ for(var i=0;i<R.grid;i++) for(var j=0;j<R.grid;j++){ var gx=fr[0]+(fr[2]-fr[0])*(i+0.5)/R.grid, gy=fr[1]+(fr[3]-fr[1])*(j+0.5)/R.grid, g=groundAt(gx,gy); if(g) G.push([g[0],groundY(g[0],g[1]),g[1]]); } }
    G=G.concat(pts);
    R.prev={pts:G, scr:G.map(function(p){ var s=proj(p); return {x:s.x,y:s.y}; }), tgt:[t.x,t.y,t.z], tscr:(function(){ var s=proj([t.x,t.y,t.z]); return {x:s.x,y:s.y}; })()};
    /* the composition, the rich kit, the labels */
    out.comp=window.__ux2.comp();
    var rich=0, inV=0; for(var id in units){ var u=units[id].block&&units[id].block.userData; if(!u) continue; if(u.lodRich) rich++; if(u.inView) inV++; }
    out.kit={rich:rich, inView:inV, switches:KLOD.n};
    var lab={on:0, names:0, namesOn:0, events:0, eventsOn:0, counters:0, countersOn:0, dropped:ML.stats.dropped};
    for(var k in ML.items){ var it=ML.items[k]; if(it.frame!==ML.frame) continue; var inF=it.eFrame===ML.frame, on=inF&&it.state==="on";
      if(on) lab.on++; if(it.cat==="name"){ lab.names++; if(on) lab.namesOn++; } else if(it.cat==="event"){ lab.events++; if(on) lab.eventsOn++; } else if(it.cat==="counter"){ lab.counters++; if(on) lab.countersOn++; } }
    out.lab=lab;
    return out; };
  R.reset=function(){ R.prev=null; };
  window.__fr=R; return true;
};

const median=a=>L.q(a,0.5), p95=a=>L.q(a,0.95);
function summarise(F,meta){
  const S={tag:TAG, build:meta.build, env:meta.env, vp:VP, phone:PHONE, pres:PRES, mode:MODE, from:FROM, to:TO, set:SET?JSON.parse(SET):null, reduced:RED, frames:F.length};
  const play=F.filter(f=>f.playing);
  /* per event, per minute */
  const byMin={}; play.forEach(f=>{ const m=Math.floor(f.clock+1e-9); (byMin[m]=byMin[m]||[]).push(f); });
  const mins=Object.keys(byMin).map(Number).sort((a,b)=>a-b), ev={}, live={minutes:0, all:0, allVisible:0};
  mins.forEach(m=>{ const fs_=byMin[m], ids=new Set(); fs_.forEach(f=>f.ev.forEach(e=>ids.add(e.id)));
    const q=[...ids].filter(id=>fs_.filter(f=>f.ev.some(e=>e.id===id)).length*2>=fs_.length);
    if(!q.length) return; live.minutes++;
    let allIn=0, allVis=0;
    fs_.forEach(f=>{ const has=q.map(id=>f.ev.find(e=>e.id===id)); if(has.every(e=>e&&e.c==="free")) allIn++; if(has.every(e=>e&&(e.c==="free"||e.c==="margin"))) allVis++; });
    if(allIn*2>=fs_.length) live.all++; if(allVis*2>=fs_.length) live.allVisible++;
    q.forEach(id=>{ const E=ev[id]||(ev[id]={minutes:0, inside:0, visible:0, why:{}}); E.minutes++;
      const fe=fs_.map(f=>f.ev.find(e=>e.id===id)).filter(Boolean), nIn=fe.filter(e=>e.c==="free").length, nVis=fe.filter(e=>e.c==="free"||e.c==="margin").length;
      if(nIn*2>=fe.length) E.inside++; else { const c={}; fe.forEach(e=>{ if(e.c!=="free") c[e.c]=(c[e.c]||0)+1; }); const top=Object.keys(c).sort((a,b)=>c[b]-c[a])[0]; E.why[top]=(E.why[top]||0)+1; }
      if(nVis*2>=fe.length) E.visible++; }); });
  Object.keys(ev).forEach(id=>{ const E=ev[id]; E.share=+(E.inside/E.minutes).toFixed(3); E.visShare=+(E.visible/E.minutes).toFixed(3); });
  S.events=ev; S.eventsUnder90=Object.keys(ev).filter(id=>ev[id].share<0.9);
  S.eventMinutes={total:Object.keys(ev).reduce((s,id)=>s+ev[id].minutes,0), inside:Object.keys(ev).reduce((s,id)=>s+ev[id].inside,0)};
  S.eventMinutes.share=S.eventMinutes.total?+(S.eventMinutes.inside/S.eventMinutes.total).toFixed(3):null;
  live.allShare=live.minutes?+(live.all/live.minutes).toFixed(3):null; live.allVisibleShare=live.minutes?+(live.allVisible/live.minutes).toFixed(3):null; S.live=live;
  /* frame-weighted event share too (a dwell's held frames weigh more) */
  let fq=0, fi=0; play.forEach(f=>f.ev.forEach(e=>{ fq++; if(e.c==="free") fi++; })); S.eventFrames={qualifying:fq, inside:fi, share:fq?+(fi/fq).toFixed(3):null};
  /* the composition */
  const goal=PHONE?0.40:0.50, box=play.map(f=>f.comp&&f.comp.bbox?f.comp.bboxShare:0), inF=play.map(f=>f.comp&&f.comp.formations?f.comp.formations.inFree:0), onF=play.map(f=>f.comp&&f.comp.formations?f.comp.formations.onField:0);
  const liveF=play.filter(f=>f.ev.length), boxL=liveF.map(f=>f.comp&&f.comp.bbox?f.comp.bboxShare:0);
  S.box={goal:goal, median:median(box), p10:L.q(box,0.1), max:box.length?Math.max(...box):null, atGoal:+(box.filter(x=>x>=goal).length/Math.max(1,box.length)).toFixed(3),
    liveMedian:median(boxL), liveAtGoal:+(boxL.filter(x=>x>=goal).length/Math.max(1,boxL.length)).toFixed(3)};
  S.formations={inFreeMedian:median(inF), inFreeMin:inF.length?Math.min(...inF):null, inFreeMax:inF.length?Math.max(...inF):null, onFieldMedian:median(onF),
    inFreeShareMedian:median(play.map(f=>f.comp&&f.comp.formations&&f.comp.formations.onField?f.comp.formations.inFree/f.comp.formations.onField:0))};
  const cov=play.map(f=>f.comp&&f.comp.bbox?f.comp.fillCover:null).filter(x=>x!==null);
  S.fillCover={median:median(cov), max:cov.length?Math.max(...cov):null, over12:cov.filter(x=>x>0.12).length, of:cov.length};
  /* the eye */
  const d=play.map(f=>f.cam.d), el=play.map(f=>f.cam.el), cl=play.map(f=>f.cam.clear).filter(x=>x!==null);
  S.cam={dMedian:median(d), dMin:d.length?Math.min(...d):null, dMax:d.length?Math.max(...d):null, elMedian:median(el), elMin:el.length?Math.min(...el):null, elMax:el.length?Math.max(...el):null,
    clearMin:cl.length?Math.min(...cl):null, below:cl.filter(x=>x<-1e-6).length};
  const fl=play.map(f=>f.flow).filter(x=>x!==undefined), tf=play.map(f=>f.tflow).filter(x=>x!==undefined);
  /* the frames in which the eye's view offset moved (a panel's change: the phone's dispatch sheet as the phase's text changes length) move every
     point on the screen by that offset's easing, whatever Follow does: the target's move counted without them too */
  const vo=play.map((f,i)=>i>0&&f.cam.voff&&play[i-1].cam.voff&&(f.cam.voff[0]!==play[i-1].cam.voff[0]||f.cam.voff[1]!==play[i-1].cam.voff[1]));
  const tfF=play.filter((f,i)=>f.tflow!==undefined&&!vo[i]).map(f=>f.tflow), flF=play.filter((f,i)=>f.flow!==undefined&&!vo[i]).map(f=>f.flow);
  S.motion={flowMax:fl.length?Math.max(...fl):null, flowP95:p95(fl), flowP99:L.q(fl,0.99), flowOver150:fl.filter(x=>x>150+1e-6).length, flowOver300:fl.filter(x=>x>300).length, targetMax:tf.length?Math.max(...tf):null, targetOver150:tf.filter(x=>x>150+1e-6).length, frames:fl.length,
    voffFrames:vo.filter(Boolean).length, targetMaxNoVoff:tfF.length?Math.max(...tfF):null, targetOver150NoVoff:tfF.filter(x=>x>150+1e-6).length, flowMaxNoVoff:flF.length?Math.max(...flF):null, flowP95NoVoff:p95(flF)};
  /* the flow's largest frames, with the clock: the handoffs */
  S.motion.top=play.filter(f=>f.flow!==undefined).sort((a,b)=>b.flow-a.flow).slice(0,8).map(f=>({clock:f.clock, flow:f.flow, tflow:f.tflow, d:f.cam.d, el:f.cam.el, az:f.cam.az}));
  const rich=play.map(f=>f.kit.rich); S.kit={richMedian:median(rich), richMax:rich.length?Math.max(...rich):null, switches:play.length?play[play.length-1].kit.switches-play[0].kit.switches:0};
  const on=play.map(f=>f.lab.on), nm=play.map(f=>f.lab.names), nmOn=play.map(f=>f.lab.namesOn), dr=play.map(f=>f.lab.dropped);
  S.labels={drawnMedian:median(on), drawnMax:on.length?Math.max(...on):null, namesMedian:median(nm), namesMax:nm.length?Math.max(...nm):null, namesOnMedian:median(nmOn), namesOnMax:nmOn.length?Math.max(...nmOn):null, droppedMedian:median(dr), droppedMax:dr.length?Math.max(...dr):null};
  const cz=play.filter(f=>f.census), cc=cz.map(f=>f.census.calls), ct=cz.map(f=>f.census.tris);
  S.census=cz.length?{frames:cz.length, callsMedian:median(cc), callsMax:Math.max(...cc), trisMedian:median(ct), trisMax:Math.max(...ct),
    trisMaxAt:cz.reduce((a,f)=>f.census.tris>a.t?{t:f.census.tris,clock:f.clock,d:f.cam.d,rich:f.kit.rich}:a,{t:-1}), callsMaxAt:cz.reduce((a,f)=>f.census.calls>a.c?{c:f.census.calls,clock:f.clock}:a,{c:-1})}:null;
  S.layerMs=meta.ms&&meta.ms.length?{median:+median(meta.ms).toFixed(2), p95:+p95(meta.ms).toFixed(2), over8:meta.ms.filter(x=>x>8).length, n:meta.ms.length}:null;
  return S;
}

module.exports={inPage, summarise};
if(require.main===module) (async()=>{
  fs.mkdirSync(OUT,{recursive:true});
  const b=await L.launch(), p=await L.open(b,html,{vp:VP,phone:PHONE,reduced:RED});
  await L.settle(p); await L.closeCard(p); await L.settle(p);
  await p.evaluate(MO.inPage); await p.evaluate(UX.inPage); await p.evaluate(inPage);
  const env=await p.evaluate(()=>{ var gl=renderer.getContext(), e=gl.getExtension("WEBGL_debug_renderer_info"); return {renderer:e?gl.getParameter(e.UNMASKED_RENDERER_WEBGL):null, ua:navigator.userAgent, dpr:devicePixelRatio,
    phoneLayout:typeof PHONE!=="undefined"?PHONE:null, w:innerWidth, h:innerHeight, rm:typeof RM!=="undefined"?RM:null, follow:JSON.parse(JSON.stringify(FOLLOW,function(k,v){ return (k==="T"||k==="dir")?undefined:v; }))}; });
  /* the start: the driver at rest, its pending frame consumed (tools/visual/ux2.js playRun), the clock at the run's start, the eye at that phase's
     authored view (the same on every build), Follow on, half speed, Play */
  /* --census N: every Nth frame drawn by the app's own frame (the WebGL draw put back for it, as tools/visual/ux2.js playRun draws its samples) and
     its draw calls and triangles read (renderer.info, reset by the app at each frame's start: every pass, the shadow map's included) */
  const n0=await p.evaluate(a=>{ setMode(a.mode); setPresentation(a.pres); select(null,null); var D=window.__md; D.start({gl:!!a.census}); if(a.census){ window.__frrr=renderer.render; renderer.render=function(){}; } return DEV.frames+DEV.skipped; },{mode:MODE,pres:PRES,census:CENSUS});
  await p.waitForFunction(n=>DEV.frames+DEV.skipped>n,n0,{timeout:15000}).catch(()=>{});
  const set=SET?JSON.parse(SET):null;
  await p.evaluate(a=>{ var D=window.__md; if(typeof mlReset==="function") mlReset("driver"); needFrames=0;
    if(a.set) Object.keys(a.set).forEach(function(k){ if(typeof a.set[k]==="object"&&a.set[k]&&FOLLOW[k]&&typeof FOLLOW[k]==="object") Object.assign(FOLLOW[k],a.set[k]); else FOLLOW[k]=a.set[k]; });
    stopPlay(); setClock(a.from,{instant:true,force:true,camera:false}); finishTweenAll();
    if(mode!=="staff"){ var c=presetFrame(PHASES[phaseAt(a.from)].cam); if(typeof EYE!=="undefined"&&EYE.on) eyeLeave(); landCam.position.set(c[0],c[1],c[2]); orbitTarget.set(c[3],c[4],c[5]); landCam.lookAt(orbitTarget); clampCamera(); syncViewOffset(true); freeCam=false; curVantage=null; }
    setSpeed(0.5); requestRender(8); D.frame(8); window.__fr.reset(); togglePlay();
    function finishTweenAll(){ var n=0; while(tween&&n<8){ tween(performance.now()+1e7); n++; } } },{from:FROM,set:set});
  const F=[]; let f=0;
  for(;;){ f++;
    const s=await p.evaluate(c=>{ var D=window.__md, g=c>0&&window.__frrr&&(D.frames%c===0);
      if(g){ if(typeof GDEPTH!=="undefined") GDEPTH.key=null; renderer.render=window.__frrr; } D.frame(); var info=g?{calls:renderer.info.render.calls, tris:renderer.info.render.triangles}:null; if(g) renderer.render=function(){};
      var o=window.__fr.frame({dt:D.frameMs/1000}); if(info) o.census=info; return o; },CENSUS);
    s.f=f; F.push(s);
    if(!s.playing||s.clock>=TO-1e-9||f>=40000) break; }
  const ms=await p.evaluate(()=>{ var D=window.__md, lm=D.layerMs(); stopPlay(); if(window.__frrr){ renderer.render=window.__frrr; window.__frrr=null; } D.stop(); return lm; });
  const errs=p.__errs.slice();
  await b.close();
  const S=summarise(F,{build:L.buildInfo(html), env:env, ms:ms}); S.errors=errs;
  fs.writeFileSync(path.join(OUT,TAG+".json"),JSON.stringify(S,null,1));
  fs.writeFileSync(path.join(OUT,TAG+"-frames.json"),JSON.stringify(F.map(x=>({f:x.f,c:x.clock,p:x.playing?1:0,cam:x.cam,ev:x.ev.map(e=>[e.id,e.w,e.c,e.lab]),fl:x.flow,tf:x.tflow,
    box:x.comp&&x.comp.bbox?x.comp.bboxShare:0,inF:x.comp&&x.comp.formations?x.comp.formations.inFree:0,cov:x.comp&&x.comp.bbox?x.comp.fillCover:null,kit:x.kit.rich,lab:[x.lab.on,x.lab.names,x.lab.namesOn,x.lab.dropped],census:x.census||undefined}))));
  console.log(TAG+": "+F.length+" frames; event-minutes inside "+S.eventMinutes.inside+" of "+S.eventMinutes.total+" ("+(100*(S.eventMinutes.share||0)).toFixed(1)+"%); live minutes all inside "+S.live.all+" of "+S.live.minutes+" ("+(100*(S.live.allShare||0)).toFixed(1)+"%); events under 90%: "+(S.eventsUnder90.join(", ")||"none")+
    "; box median "+(100*(S.box.median||0)).toFixed(1)+"%, at the "+(100*S.box.goal)+"% goal in "+(100*S.box.atGoal).toFixed(1)+"% of frames; formations in the free map median "+S.formations.inFreeMedian+" (of "+S.formations.onFieldMedian+")"+
    "; eye "+S.cam.dMedian+" units, "+S.cam.elMedian+" deg; flow max "+S.motion.flowMax+" px/s (p95 "+S.motion.flowP95+"), target max "+S.motion.targetMax+"; below the floor "+S.cam.below+"; rich blocks median "+S.kit.richMedian+" (max "+S.kit.richMax+"); names in the layer median "+S.labels.namesMedian+", drawn "+S.labels.namesOnMedian+"; errors "+errs.length);
})().catch(e=>{ console.error(e); process.exit(1); });
