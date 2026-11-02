/* v-repro-srcgeo-sim (state-probe2.js): state #0's full dossier and place dossier on a visitor's page at 1280 x 720, the audited build, the app's
   loop stepped on a virtual clock (as browser-probe.js; the machine's load starves real frames and the panels' slide). The selection and the
   full dossier are set up through the app's own handlers (element.click() on the "Full dossier" button; select("t","pratzen") for the place),
   said so in the record; every clock move inside the phase is real input (a mouse click on the time rail, ArrowRight on the focused rail).
   The app's state is otherwise only read. Writes one JSON record to argv[2]. */
"use strict";
const fs=require("fs");
const A=require("/home/user/Austerlitz/tools/audit-post8/lib.js");
const OUT=process.argv[2]; const rec={started:new Date().toISOString(),steps:[]};
const log=(k,v)=>{ rec.steps.push({k,v}); console.log(k,JSON.stringify(v).slice(0,1400)); };
const step=(p,n)=>p.evaluate(n=>window.__vs(n),n);
(async()=>{
  const crypto=require("crypto"), html=fs.readFileSync("/home/user/Austerlitz/austerlitz-command-map.html");
  rec.build={bytes:html.length,md5:crypto.createHash("md5").update(html).digest("hex")};
  const b=await A.launch(); const p=await A.open(b,[1280,720],{harness:false,transitions:true});
  log("boot",{ms:p._loadMs}); await p.keyboard.press("Escape");
  await p.evaluate(()=>{ const realNow=performance.now.bind(performance), realRaf=window.requestAnimationFrame; let T=realNow();
    window.requestAnimationFrame=function(cb){ if(cb===window.loop) return 0; return realRaf.call(window,cb); };
    performance.now=function(){ return T; }; renderer.render=function(){};
    window.__vs=function(n){ for(let i=0;i<n;i++){ T+=1000/30; window.loop(); } return Math.round(T); }; });
  await step(p,60);
  const railX=t=>p.evaluate(t=>{ const r=document.getElementById("timerail").getBoundingClientRect(); return [r.left+(t-T_MIN)/(T_MAX-T_MIN)*r.width, r.top+r.height/2]; },t);
  const click=async t=>{ const [x,y]=await railX(t); await p.mouse.click(x,y); await step(p,60); };
  const read=id=>p.evaluate(id=>{ const t=((document.getElementById("drawer-body")||{}).innerText||"").replace(/\s+/g," "); const pos=posNow(id);
    const m=t.match(/(Position at \d\d:\d\d) ([^]*?)(?= Claim| Nearby| On the| Movement| Role|$)/); const dt=t.match(/the dot where it is at (\d\d:\d\d)/);
    return {clock:fmtClock(clock),phase:curPhase,sel:selection&&selection.kind+":"+selection.id,expanded:dossierExpanded,positionRow:m?m[1]+" | "+m[2].slice(0,80):null,
      dayTrackCaption:dt?dt[1]:null,model:pos?nearestFeature(pos):null,keyNow:drawerKey(),keyPainted:_drawerKey}; },id);
  /* a standing headquarters: Napoleon's, 04:05 to 04:45 (phase 0), the full dossier */
  await click(245.5); log("rail click for about 04:05",await p.evaluate(()=>fmtClock(clock)));
  await p.evaluate(()=>{ document.querySelector('.oob-row[data-id="gqg"]').click(); }); await step(p,60);
  await p.evaluate(()=>{ const m=document.querySelector(".more-btn"); if(m) m.click(); }); await step(p,10);
  log("gqg full dossier (set up by the app's own handlers)",await read("gqg"));
  await p.focus("#timerail"); for(let i=0;i<4;i++){ await p.keyboard.press("ArrowRight"); await step(p,3); }
  log("gqg full dossier after 4 x ArrowRight",await read("gqg"));
  /* marching: the same full dossier, 12:00 to 12:37 (phase 6) */
  await click(720.5); log("after a rail click for 12:00",await read("gqg"));
  await p.focus("#timerail"); for(let i=0;i<3;i++){ await p.keyboard.press("ArrowRight"); await step(p,3); }
  log("after 3 x ArrowRight",await read("gqg"));
  await click(757.5); log("after a rail click for about 12:37",await read("gqg"));
  /* a place: Pratzen Heights, phase 6 (11:15-12:45), everyone's reading */
  await click(676.5);
  await p.evaluate(()=>{ select("t","pratzen"); }); await step(p,10);
  const readP=()=>p.evaluate(()=>{ const t=((document.getElementById("drawer-body")||{}).innerText||"").replace(/\s+/g," "); const ft=FEATURES.filter(f=>f.id==="pratzen")[0];
    const m=t.match(/Formations nearby now(.*)$/); return {clock:fmtClock(clock),phase:curPhase,sel:selection&&selection.kind+":"+selection.id,commandView,
      nearbyShown:m?m[1].slice(0,400):null,model:placeNearby(ft).map(k=>FORMATIONS[k].name),keyNow:drawerKey()}; });
  log("pratzen place (select set up through the app's select) at about 11:16",await readP());
  await click(764.5); log("pratzen place after a rail click for about 12:44",await readP());
  rec.errors=A.errors(p); await b.close(); rec.ended=new Date().toISOString(); fs.writeFileSync(OUT,JSON.stringify(rec,null,1)); console.log("DONE");
})().catch(e=>{ console.error("FATAL",e); rec.fatal=String(e&&e.stack||e); fs.writeFileSync(OUT,JSON.stringify(rec,null,1)); process.exit(1); });
