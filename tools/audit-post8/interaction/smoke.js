/* smoke: a visitor's page, its first state, the card closed by Esc, frame rate under Play (software WebGL; not a device's) */
const I=require("./ilib.js");
(async()=>{
  const b=await I.A.launch();
  const p=await I.openV(b,[1600,900],{});
  I.log("booted ms",p._loadMs);
  const s0=await I.snap(p); I.log(JSON.stringify({card:s0.panels.firstrun,clock:s0.clockText,cap:s0.caption,focus:s0.focus,toast:s0.toast}));
  await p.keyboard.press("Escape"); await I.wait(p,800);
  const s1=await I.snap(p); I.log(JSON.stringify({card:s1.panels.firstrun,focus:s1.focus,dev:s1.devState}));
  const c=await I.counts(p); I.log("listeners",c.live,"timeouts",c.timeouts,"rafs",c.rafs,"intervals",c.intervals,"observers",c.observers);
  const n0=await I.loopN(p), t0=Date.now();
  await p.click("#play"); await I.wait(p,10000);
  const n1=await I.loopN(p), s2=await I.snap(p);
  I.log("frames in 10 s while playing",n1-n0,"clock",s2.clockText,"playing",s2.playing,"dwell",s2.dwellSt);
  await I.shot(p,"smoke-playing");
  I.log("errors",JSON.stringify(p._log));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
