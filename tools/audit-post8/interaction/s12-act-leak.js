#!/usr/bin/env node
/* Scenario 12 (second session): scope of what scenario 3 saw under the Allied headquarters' reading at 07:30, where Saint-Hilaire's card said
   "Where: Not known to Allied headquarters at 07:30" and, two rows above, "Doing now: Standing in fog behind Puntowitz, hidden from the plateau".
   For each reading (Napoleon's, the Allied headquarters) at every 10 clock minutes, every formation the reading does not know (readHidden, the
   app's own test) and the card's "Doing now" text for it (stateAt(id,textPhase(id,clock)).act, the card's own expression, app.js 7794/7818):
   how many such texts name a place (a feature's name or its first word, or a village of world.js). Observation through the app's own globals
   on a harness page (no input: setCommandView and setClock are the app's own functions, called as the controls call them); nothing changes. */
"use strict";
const fs=require("fs"), path=require("path");
const I=require("./ilib.js");
(async()=>{
  const b=await I.A.launch();
  const p=await I.openV(b,[1280,720],{harness:true,drive:false});
  const r=await p.evaluate(()=>{
    const names=new Set(); FEATURES.forEach(f=>{ if(f.name){ names.add(f.name); const w=f.name.split(/[ ,(]/)[0]; if(w.length>4) names.add(w); } });
    try{ VILLAGES.forEach(v=>{ if(v.name) names.add(v.name); if(v.n) names.add(v.n); }); }catch(e){}
    const N=[...names].filter(n=>n&&n.length>3);
    const out={names:N.length, byReading:{}, examples:[]};
    const keep=clock;
    for(const cv of ["fr","al"]){
      setCommandView(cv); let hidden=0, withAct=0, naming=0; const pairs=new Map();
      for(let t=240;t<=1080;t+=10){ setClock(t,{instant:true,force:true,camera:false}); knowAtClock();
        for(const id in FORMATIONS){ const f=FORMATIONS[id]; if(!f.track) continue; if(!readHidden(id)) continue; hidden++;
          const s2=stateAt(id,textPhase(id,clock)); if(!s2||!s2.act) continue; withAct++;
          const hit=N.filter(n=>s2.act.indexOf(n)>=0);
          if(hit.length){ naming++; const k=id+"|"+s2.act; if(!pairs.has(k)) pairs.set(k,{id,reading:cv,first:fmtClock(t),act:s2.act,names:hit}); else pairs.get(k).last=fmtClock(t); } } }
      out.byReading[cv]={formationClocksHidden:hidden,withDoingNow:withAct,namingAPlace:naming,distinctTexts:pairs.size};
      out.examples=out.examples.concat([...pairs.values()]);
    }
    setCommandView("none"); setClock(keep,{instant:true,force:true,camera:false});
    return out;
  });
  r.build={md5:require("crypto").createHash("md5").update(fs.readFileSync(path.resolve(process.env.AUSTERLITZ_HTML||path.join(I.ROOT,"austerlitz-command-map.html")))).digest("hex")};
  fs.writeFileSync(path.join(I.EV,"s12-act-leak.json"),JSON.stringify(r,null,1));
  console.log(JSON.stringify({names:r.names,byReading:r.byReading,distinct:r.examples.length,first:r.examples.slice(0,6)},null,1));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
