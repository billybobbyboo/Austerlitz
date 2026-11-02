/* Final audit after Stage 8, area "interaction": the scenario runner. Each scenario file calls run(name, opts, body): one browser, one or more
   pages (ilib.js openV / openP), a list of steps each followed by a compact snapshot of the state (ilib.js SNAP), checks written beside the
   steps (each with what was expected and what was observed), screenshots at key points, the console's warnings and errors and the page's
   errors. The record is written to docs/audit-post8-evidence/interaction/<name>.json. Measurement only: nothing of the application changes. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const I=require("./ilib.js");
const HTML=path.resolve(process.env.AUSTERLITZ_HTML||path.join(I.ROOT,"austerlitz-command-map.html"));
const BUILD=(()=>{ const b=fs.readFileSync(HTML); return {file:path.relative(I.ROOT,HTML), bytes:b.length, md5:crypto.createHash("md5").update(b).digest("hex")}; })();
const KEEP=["clock","clockText","playing","speed","speedPressed","speedBtn","dwellOn","dwellBtn","dwellSt","dwellNext","presentation","mode","factor","selection","commandView","TOURCV",
  "eye","tourStep","opening","openingK","openingPlay","firstRun","freeCam","curVantage","followBtn","playBtn","curPhase","chapter","plan","caption","capVisible","toast","livePhase",
  "selchip","drawer","panels","focus","focusVisible","inertKids","ml","overlays","drawon","smoke","blocks","tween","layers","viewport","phone","phaseTitle"];
function compact(s){ const o={}; KEEP.forEach(k=>{ if(s[k]!==undefined) o[k]=s[k]; }); if(typeof o.clock==="number") o.clock=+o.clock.toFixed(3);
  if(s.cam){ const c=s.cam; o.cam=c.kind==="map"?{map:[+c.x.toFixed(2),+c.z.toFixed(2),+c.wpp.toFixed(4)]}:{pos:c.pos.map(v=>+v.toFixed(2)),tgt:c.tgt.map(v=>+v.toFixed(2))}; }
  return o; }
async function run(name,opts,body){
  const t0=Date.now(), out={name, build:BUILD, browser:"Chromium 141.0.7390.37 (pinned headless shell), ANGLE on SwiftShader (software WebGL)", started:new Date().toISOString(),
    opts, pages:[], steps:[], checks:[], shots:[], notes:[]};
  const b=await I.A.launch();
  const ctx={out, b, I,
    async page(kind,size,o){ const p=kind==="phone"?await I.openP(b,size,o||{}):await I.openV(b,size,o||{}); out.pages.push({kind,size,o:o||{},bootMs:p._loadMs}); p._idx=out.pages.length-1; return p; },
    async step(p,label,fn,o){ o=o||{}; const r={page:p._idx,label,at:Date.now()-t0};
      try{ if(fn) r.ret=await fn(p); }catch(e){ r.error=String(e&&e.message||e).slice(0,500); I.log("STEP ERROR",label,r.error); }
      if(o.snap!==false){ try{ r.s=compact(await I.snap(p)); }catch(e){ r.snapError=String(e.message).slice(0,300); } }
      /* o.shot: the page as it stands with the 3D canvas blanked (not shown: it would be the last frame drawn (its draw skipped by the driver: under this machine's software WebGL a 1600 x 900
         frame takes minutes under load; the panels, the map layer's names and counters, the caption and the clock are the page's own DOM); o.draw:
         one real frame of the 3D view drawn first */
      if(o.shot||o.draw){ try{ const nm=name+"-"+(o.draw||o.shot)+(o.draw?"":"-dom"); if(o.draw) r.shot=await I.drawShot(p,nm); else { await p.evaluate(()=>{ renderer.domElement.style.visibility="hidden"; }); try{ r.shot=await I.shot(p,nm); } finally{ await p.evaluate(()=>{ renderer.domElement.style.visibility=""; }); } } out.shots.push(r.shot); }catch(e){ r.shotError=String(e.message).slice(0,300); } }
      r.log=p._log.splice(0); r.ms=Date.now()-t0-r.at;
      out.steps.push(r); I.log(name,"|",label,"|",r.s?("clock "+r.s.clockText+" play "+r.s.playing+" "+r.s.presentation+"/"+r.s.mode+" sel "+r.s.selection+" focus "+r.s.focus):"", r.error?"ERR":"", r.log.length?("LOG "+JSON.stringify(r.log).slice(0,300)):"");
      return r; },
    check(id,ok,expected,observed,extra){ const c=Object.assign({id,ok:!!ok,expected,observed},extra||{}); out.checks.push(c); I.log(ok?"  ok ":"  NOT AS EXPECTED ",id,"|",expected,"|",JSON.stringify(observed).slice(0,400)); return !!ok; },
    note(s){ out.notes.push(s); I.log("note:",s); },
    last(){ return out.steps[out.steps.length-1]; }
  };
  try{ await body(ctx); }catch(e){ out.fatal=String(e&&e.stack||e).slice(0,2000); I.log("FATAL",out.fatal); }
  finally{ out.ms=Date.now()-t0; out.ended=new Date().toISOString();
    try{ await b.close(); }catch(e){}
    fs.writeFileSync(path.join(I.EV,name+".json"),JSON.stringify(out,null,1));
    const bad=out.checks.filter(c=>!c.ok);
    I.log("DONE",name,"checks",out.checks.length,"not as expected",bad.length,"ms",out.ms); }
  return out;
}
/* common input helpers (real input unless named "set up") */
const H={
  esc:p=>p.keyboard.press("Escape"),
  key:(p,k)=>p.keyboard.press(k),
  click:(p,sel,o)=>I.clickEl(p,sel,o),
  /* the time rail: the x of a clock minute on it */
  railX:(p,t)=>p.evaluate(t=>{ const r=document.getElementById("timerail").getBoundingClientRect(); return {x:r.left+(t-T_MIN)/(T_MAX-T_MIN)*r.width, y:r.top+r.height/2}; },t),
  /* (fixed in the second session: the first run pressed the rail's centre line at the clock's own minute, which an event marker's enlarged
     hit area covers when the clock stands at an event start (style.css .ev-mark::after inset -6px; .ev-mark.dw scale 1.5), so the press went
     to the marker: the press now starts at the nearest point of the rail at that minute that the rail itself would take (scanned down the
     rail, then sideways), and the step reports what covered the centre line) */
  railStart:(p,t)=>p.evaluate(t=>{ const rail=document.getElementById("timerail"), r=rail.getBoundingClientRect(), x0=r.left+(t-T_MIN)/(T_MAX-T_MIN)*r.width, yc=r.top+r.height/2;
    const nm=h=>h?(h.id?"#"+h.id:h.tagName.toLowerCase()+"."+String(h.className).split(" ")[0]):null, own=h=>!!(h&&(h===rail||rail.contains(h)));
    const atCentre=nm(document.elementFromPoint(x0,yc));
    for(const dx of [0,2,-2,4,-4,6,-6,8,-8,10,-10,12,-12,14,-14,16,-16]) for(const fy of [0.5,0.75,0.9,0.25,0.1]){ const x=x0+dx, y=r.top+r.height*fy; if(own(document.elementFromPoint(x,y))) return {x,y,dx,fy,atCentre}; }
    return {x:x0,y:yc,dx:0,fy:0.5,atCentre,covered:true}; },t),
  async dragRail(p,t0,t1,steps){ const a=await H.railStart(p,t0), z=await H.railX(p,t1); await p.mouse.move(a.x,a.y); await p.mouse.down(); for(let i=1;i<=(steps||6);i++) await p.mouse.move(a.x+(z.x-a.x)*i/(steps||6),a.y); await p.mouse.up(); return a; },
  /* Play or Pause by a real click on the Play button, pressed only when the clock's state differs from the one wanted (added in the second
     session: the first run of s2 pressed it blindly after a Space had already changed the state, and every check after it read a paused
     clock); in Clean, where the button is hidden, Space with no button focused (the window's "play" row) */
  async setPlay(p,want){ const st=await p.evaluate(()=>{ const b=document.getElementById("play"), r=b.getBoundingClientRect(); return {playing:playing, shown:r.width>0&&r.height>0&&getComputedStyle(b).visibility!=="hidden"}; });
    if(st.playing===want) return {pressed:false};
    if(st.shown){ await I.clickEl(p,"#play"); return {pressed:"click"}; }
    await p.evaluate(()=>{ if(document.activeElement) document.activeElement.blur(); }); await p.keyboard.press(" "); return {pressed:"space"}; },
  /* set up: focus an element as a visitor's Tab would leave it (programmatic focus; the keys that follow are real) */
  focus:(p,sel)=>I.focusEl(p,sel),
  frames:(p,n)=>I.play(p,n),
  until:(p,cond,n)=>I.until(p,cond,n),
  st:p=>I.snap(p),
  ev:(p,js,arg)=>p.evaluate(js,arg)
};
module.exports={run,H,I,BUILD,compact};
