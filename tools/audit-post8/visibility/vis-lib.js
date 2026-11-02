/* Final audit after Stage 8, area "visibility": formation counters and names during extended playback (docs/STAGE8_SPEC.md sections 22.3,
   23.2, 23.4: the carried item). Measurement code only: nothing here changes a source file, a threshold or the build.

   In the page: ACC (inject after tools/visual/motion.js inPage) defines window.__vis.run(a), a long Play run on the motion driver's clock
   (tools/visual/motion.js: the app's own loop one frame at a time, performance.now answering the driver's time; RUN's "play" set-up, step for
   step: setClock(from) as a seek, Follow on (freeCam false) unless a.follow===false, the speed, eight pre frames at rest, then Play pressed),
   played until the clock reaches a.to (or Play stops at the day's end, or a.max frames), then stopped and a.rest frames at rest. After every
   frame it reads the driver's snap (every item the layer collected: drawn, held or dropped by the layout, behind the ground, off the screen,
   under a panel; with a.room, whether the full search would place a hidden item in that frame's room, tried and undone) and keeps, per item,
   one character a frame:
     #  drawn                         h  held by the stabiliser (hidden), no room for the full search     H  held, with room
     d  dropped, no room              D  dropped, with room for the full search (in the frame's own boxes)
     t  behind the drawn ground       o  off the screen                p  under a panel                     .  not in the layer (level of detail,
                                                                                                             not shown at this clock or reading)
   and, with a.stat, a second string: the layout a fresh view would give in the same frame (mlLayout's "build": what is never dropped first,
   then everything else by the full search in priority order, from an empty taken list, with the frame's panels and symbols; run on the
   frame's own items, tried and undone): '#' placed, '-' not placed, ' ' not eligible (off screen, under a panel, behind the ground).
   Also, per item: its jumps (drawn in two successive frames, its box moved more than 3 px against its own anchor: motion.js's measure), its
   priority range as the layer gave it (it.pri; base it.base), the frames it was protected (keep) and those it was protected but hidden.
   Per frame: the clock, Play, the dwell's stage, whether the frame was a re-placement pass and moving (MLS), counts, the eye's target.
   The snap's "held" is read against the item's own state: an item held in one frame and behind the ground in the next keeps it.held
   (mlLayout resets it only for the items it lays out), and the snap then reports "held"; here it is 't' and counted (quirk).

   In node: summarise(r, frameMs) the per-item and per-formation tables; benchmark-equivalent totals (motion.js tracking's definitions). */
"use strict";
const ACC=function(){
  if(window.__vis) return true;
  function code(s,it){
    if(s.st==="on") return "#";
    if(s.st==="offscreen") return "o";
    if(s.st==="panel") return "p";
    if(s.st==="occluded"||(it&&it.state==="occluded")) return "t";
    if(s.st==="held") return s.room?"H":"h";
    return s.room?"D":"d";
  }
  /* the layout a fresh view would give now (mlLayout's "build"), on the frame's own items, tried and undone */
  function staticBuild(LIST){
    var VW=renderer.domElement.clientWidth||innerWidth, VH=renderer.domElement.clientHeight||innerHeight;
    var panels=mlPanels(), obst=mlObstacles(VW,VH), elig=(LIST||[]).filter(function(it){ return it.eFrame===ML.frame&&!it.occ&&it.state!=="occluded"; });
    var order=elig.slice().sort(function(a,b){ return (a.keep!==b.keep)?(a.keep?-1:1):(a.pri-b.pri); });
    var saved=order.map(function(it){ return [it.rect,it.lead,it.state,it.ox,it.oy,it.mrect]; }), tk=ML.taken, out={};
    ML.taken=[];
    try{ order.forEach(function(it){ out[it.key]=!!mlPlaceItem(it,VW,VH,panels,obst); }); }
    finally{ ML.taken=tk; order.forEach(function(it,i){ var s=saved[i]; it.rect=s[0]; it.lead=s[1]; it.state=s[2]; it.ox=s[3]; it.oy=s[4]; it.mrect=s[5]; }); }
    return out;
  }
  function Acc(){ this.it={}; this.keys=[]; this.F=[]; this.n=0; this.quirk=0; }
  Acc.prototype.step=function(sn,ph,stat){
    var f=this.n++, A=sn.items, seen={}, nOn=0;
    for(var k in A){ var s=A[k], it=ML.items[k], r=this.it[k];
      if(!r){ r=this.it[k]={cat:s.cat, fid:s.fid, c:[], s:[], j:0, pmin:1e9, pmax:-1e9, base:it?it.base:null, keepF:0, keepHid:0, px:null, pf:-2, far:0};
        this.keys.push(k); for(var i=0;i<f;i++){ r.c.push("."); r.s.push(" "); } }
      var c=code(s,it); if(s.st==="held"&&c==="t"){ this.quirk++; }
      r.c.push(c); seen[k]=1; if(c==="#") nOn++;
      if(it){ if(it.pri<r.pmin) r.pmin=it.pri; if(it.pri>r.pmax) r.pmax=it.pri; }
      if(s.keep){ r.keepF++; if(c!=="#"&&c!=="o"&&c!=="p"&&c!=="t") r.keepHid++; }
      if(c==="#"){ var dx=s.x-s.sx, dy=s.y-s.sy; if(r.pf===f-1&&Math.hypot(dx-r.px[0],dy-r.px[1])>3) r.j++; r.px=[dx,dy]; r.pf=f; if(s.far) r.far++; }
      r.s.push(stat?((c==="#"||c==="h"||c==="H"||c==="d"||c==="D")?(stat[k]?"#":"-"):" "):" ");
    }
    for(var q=0;q<this.keys.length;q++){ var kk=this.keys[q]; if(!seen[kk]){ this.it[kk].c.push("."); this.it[kk].s.push(" "); } }
    var land=mode!=="staff";
    this.F.push({t:+clock.toFixed(3), ph:ph, phase:curPhase, pass:sn.mls?sn.mls.pass:null, mov:sn.mls?sn.mls.moving:null, play:!!playing,
      dw:DWELL.st?DWELL.st.stage:null, on:nOn, drop:sn.dropped, held:sn.held, stat:!!stat, hov:ML.hover||null, sel:selection?selection.id:null,
      tg:land?[+orbitTarget.x.toFixed(1),+orbitTarget.z.toFixed(1)]:null, dist:land?+landCam.position.distanceTo(orbitTarget).toFixed(1):null});
  };
  Acc.prototype.out=function(){ var I={}, self=this;
    this.keys.forEach(function(k){ var r=self.it[k]; I[k]={cat:r.cat, fid:r.fid, codes:r.c.join(""), stat:r.s.join(""), jumps:r.j, pmin:r.pmin===1e9?null:+r.pmin.toFixed(7),
      pmax:r.pmax===-1e9?null:+r.pmax.toFixed(7), base:r.base==null?null:+(+r.base).toFixed(7), keepF:r.keepF, keepHid:r.keepHid, farFrames:r.far}; });
    return {items:I, frames:this.F, quirk:this.quirk}; };
  /* names for the tables: the formations, the events, the places */
  function meta(items){
    var fm={}, em={}, pm={};
    Object.keys(items).forEach(function(k){ var r=items[k];
      if(r.fid&&FORMATIONS[r.fid]&&!fm[r.fid]){ var f=FORMATIONS[r.fid]; fm[r.fid]={name:f.name, desig:f.desig, ech:f.ech, arm:f.arm, nation:f.nation, strength:f.strength||null, parent:f.parent||null,
        short:typeof shortCommander==="function"?shortCommander(f):null}; }
      if(k.indexOf("e:")===0){ var id=k.slice(2), e=EVENTS.filter(function(x){ return x.id===id; })[0]; if(e) em[k]={title:e.n||id, window:evWindow(e)}; }
      if(k.indexOf("t:")===0){ var it=ML.items[k]; pm[k]={name:it&&it.el?it.el.textContent:k.slice(2)}; }
    });
    return {formations:fm, events:em, places:pm};
  }
  window.__vis={
    staticBuild:staticBuild,
    run:function(a){
      var D=window.__md, opt={room:a.room!==false}, LIST=null, S=new Acc(), w0=Date.now(), n=0, st=null, paused=false, endedPlaying=null;
      D.start({gl:a.gl, frameMs:a.frameMs});
      var inner=window.mlCollect; window.mlCollect=function(){ var l=inner.apply(this,arguments); LIST=l; return l; };   /* the frame's list, in mlCollect's order (D.stop restores the app's) */
      try{
        if(a.reading) setCommandView(a.reading);
        if(a.select) select("f",a.select);
        requestRender(2);
        /* motion.js RUN's Play set-up, step for step */
        stopPlay(); setClock(a.from,{instant:true,force:true,camera:false});
        if(mode!=="staff"){ if(a.follow===false){ freeCam=true; } else { freeCam=false; curVantage=null; } }
        setSpeed(a.speed); requestRender(a.pre||8); D.frame(a.pre||8);
        S.step(D.snap(opt),"pre",a.stat?staticBuild(LIST):null);
        /* a.hover: a visitor's pointer comes to rest on the formation's counter or name (a buttonless move on the canvas at its anchor, motion.js
           D.hover) and stays there while it plays */
        if(a.hover){ var hi=ML.items["c:"+a.hover]||ML.items["n:"+a.hover]; S.hovered=hi?D.hover(Math.round(hi.sx),Math.round(hi.sy)):null; }
        togglePlay();
        while(n<a.max){ D.frame(); n++;
          st=(a.stat&&(n%(a.statEvery||1)===0))?staticBuild(LIST):null;
          S.step(D.snap(opt),"play",st);
          if(a.pauseAt&&n>=a.pauseAt){ paused=true; break; }   /* stills.js: the run left playing on the driver's clock at this frame, to be drawn */
          if(a.fixedFrames){ if(n>=a.fixedFrames) break; }
          else if(!playing||clock>=a.to-1e-9) break; }
        if(paused){ var po=S.out(); po.paused=true; po.playFrames=n; return po; }
        endedPlaying=playing; stopPlay();
        for(var r=0;r<(a.rest==null?30:a.rest);r++){ D.frame(); S.step(D.snap(opt),"rest",a.stat?staticBuild(LIST):null); }
        /* and a fresh view at the end (a seek's layout at the same clock and eye: mlReset, one frame) */
        if(a.freshEnd){ mlReset("audit"); requestRender(1); D.frame(); S.step(D.snap(opt),"fresh",a.stat?staticBuild(LIST):null); }
      } finally {
        if(!paused){ D.stop(); if(a.reading) setCommandView("none"); if(a.select) select(null,null); }
      }
      var o=S.out(); o.meta=meta(o.items); o.playFrames=n; o.hovered=S.hovered===undefined?undefined:S.hovered; o.endedPlaying=endedPlaying; o.wallMs=Date.now()-w0; o.endClock=clock;
      o.mls=typeof MLS!=="undefined"?JSON.parse(JSON.stringify(MLS.stats)):null; o.viewport=[innerWidth,innerHeight]; o.presentation=presentation; o.mode=mode; o.commandView=commandView;
      return o;
    }
  };
  return true;
};

/* ---------------- in node ---------------- */
const HIDE=new Set(["h","H","d","D"]), INV=new Set(["#","h","H","d","D","t"]);
function runs(str,set){ const out=[]; let s=-1; for(let i=0;i<=str.length;i++){ const inS=i<str.length&&set.has(str[i]); if(inS&&s<0) s=i; if(!inS&&s>=0){ out.push([s,i-1]); s=-1; } } return out; }
/* per item: the counts over the run (or over a frame range [a, b]) */
function itemStats(codes,stat,F,frameMs,range){
  const a=range?range[0]:0, b=range?range[1]:codes.length-1, c=codes.slice(a,b+1), s=stat?stat.slice(a,b+1):"";
  const cnt=ch=>{ let n=0; for(const x of c) if(ch.includes(x)) n++; return n; };
  const drawn=cnt("#"), hid=cnt("hHdD"), room=cnt("HD"), occl=cnt("t"), off=cnt("op"), absent=cnt("."), inView=drawn+hid+occl;
  const hr=runs(c,HIDE), nd=runs(c,new Set(["h","H","d","D","t"]));
  const span=r=>{ const f0=a+r[0], f1=a+r[1]; const t0=f0>0?F[f0-1].t:F[f0].t, t1=F[f1].t; return +(t1-t0).toFixed(2); };   /* clock minutes the episode covers */
  let longest=null; hr.forEach(r=>{ const L=r[1]-r[0]+1; if(!longest||L>longest.frames) longest={frames:L, from:a+r[0], to:a+r[1], clockFrom:F[a+r[0]].t, clockMin:span(r)}; });
  let maxClock=0; hr.forEach(r=>{ maxClock=Math.max(maxClock,span(r)); });
  let longestND=0; nd.forEach(r=>{ longestND=Math.max(longestND,r[1]-r[0]+1); });
  let sLong=0; if(s) runs(s,new Set(["-"])).forEach(r=>{ sLong=Math.max(sLong,r[1]-r[0]+1); });   /* the fresh layout's longest stretch without the item, in view (the counterfactual) */
  let sOn=0, sElig=0, starve=0, extra=0;
  if(s) for(let i=0;i<c.length;i++){ if(s[i]==="#"||s[i]==="-"){ sElig++; if(s[i]==="#") sOn++; if(s[i]==="#"&&HIDE.has(c[i])) starve++; if(s[i]==="-"&&c[i]==="#") extra++; } }
  return {frames:c.length, inView, drawn, share:inView?+(drawn/inView).toFixed(3):null, hiddenLayout:hid, hiddenWithRoom:room, occluded:occl, offscreen:off, absent,
    episodes:hr.length, longestFrames:longest?longest.frames:0, longestMs:longest?Math.round(longest.frames*frameMs):0, longestClockMin:longest?longest.clockMin:0,
    longestFrom:longest?longest.clockFrom:null, longestClockMinMax:+maxClock.toFixed(2), longestNotDrawnOnScreenMs:Math.round(longestND*frameMs),
    staticEligible:sElig, staticShare:sElig?+(sOn/sElig).toFixed(3):null, starvedVsStatic:starve, drawnWhereStaticNot:extra, staticLongestMs:Math.round(sLong*frameMs)};
}
/* motion.js tracking's formation key: the counter in a frame where it is collected, else the name */
function formationCodes(items,fid,n){
  const c=items["c:"+fid], m=items["n:"+fid];
  if(!c&&!m) return null;
  let codes="", stat="";
  for(let i=0;i<n;i++){ const cc=c?c.codes[i]:".", mm=m?m.codes[i]:"."; if(cc!=="."){ codes+=cc; stat+=c.stat[i]; } else { codes+=mm; stat+=m?m.stat[i]:" "; } }
  return {codes,stat,key:c&&m?"c:+n:":c?"c:":"n:"};
}
function summarise(r,frameMs){
  const F=r.frames, n=F.length, I=r.items, meta=r.meta;
  const pre=F.findIndex(f=>f.ph==="pre"), p0=F.findIndex(f=>f.ph==="play"), p1=F.map(f=>f.ph).lastIndexOf("play"), r0=F.findIndex(f=>f.ph==="rest"), r1=F.map(f=>f.ph).lastIndexOf("rest"), fr=F.findIndex(f=>f.ph==="fresh");
  const playRange=[p0,p1];
  const fids=[...new Set(Object.values(I).filter(x=>x.fid).map(x=>x.fid))];
  const forms=fids.map(fid=>{ const fc=formationCodes(I,fid,n); if(!fc) return null; const m=meta.formations[fid]||{};
    const it=I["c:"+fid]||I["n:"+fid];
    const all=itemStats(fc.codes,fc.stat,F,frameMs,[0,r1]), play=itemStats(fc.codes,fc.stat,F,frameMs,playRange);   /* all: pre, play and rest (the benchmark's frames), not the fresh one */
    return {id:fid, item:fc.key, name:m.name, desig:m.desig, ech:m.ech, arm:m.arm, nation:m.nation, strength:m.strength, base:it.base, pmin:it.pmin, pmax:it.pmax,
      jumps:(I["c:"+fid]?I["c:"+fid].jumps:0)+(I["n:"+fid]?I["n:"+fid].jumps:0), keepHid:(I["c:"+fid]?I["c:"+fid].keepHid:0)+(I["n:"+fid]?I["n:"+fid].keepHid:0),
      before:fc.codes[pre], after:fc.codes[r1], fresh:fr>=0?fc.codes[fr]:null, staticBefore:fc.stat[pre], staticAfter:fc.stat[r1],
      all, play, codes:fc.codes};
  }).filter(Boolean);
  const other=Object.keys(I).filter(k=>!/^[cn]:/.test(k)).map(k=>{ const x=I[k], st=itemStats(x.codes,x.stat,F,frameMs,playRange);
    const nm=k.startsWith("e:")?(meta.events[k]||{}).title:k.startsWith("t:")?(meta.places[k]||{}).name:k.replace(/^[a-z]+:/,"");
    return {key:k, cat:x.cat, name:nm, base:x.base, pmin:x.pmin, pmax:x.pmax, keepF:x.keepF, keepHid:x.keepHid, jumps:x.jumps, before:x.codes[pre], after:x.codes[r1], play:st}; });
  /* the benchmark's totals over the whole run (motion.js tracking: formation-frames in view = drawn + behind the ground + hidden by the layout) */
  const tot={drawn:0,inView:0,longestMs:0,episodes:0};
  forms.forEach(f=>{ tot.drawn+=f.all.drawn; tot.inView+=f.all.inView; tot.episodes+=f.all.episodes; tot.longestMs=Math.max(tot.longestMs,f.all.longestMs); });
  return {frames:n, playFrames:p1-p0+1, clockFrom:F[p0]?F[p0].t:null, clockTo:F[p1]?F[p1].t:null, passes:F.filter(f=>f.ph==="play"&&f.pass).length,
    dwellFrames:F.filter(f=>f.ph==="play"&&f.dw).length, total:tot, formations:forms, other};
}
module.exports={ACC, summarise, itemStats, runs, formationCodes};
