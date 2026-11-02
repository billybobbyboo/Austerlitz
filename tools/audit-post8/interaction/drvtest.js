const I=require("./ilib.js");
(async()=>{
  const b=await I.A.launch();
  const p=await I.openV(b,[1600,900],{});
  I.log("booted ms",p._loadMs);
  await p.keyboard.press("Escape");
  let t0=Date.now(); await I.clickEl(p,"#play"); I.log("click ms",Date.now()-t0);
  t0=Date.now(); await I.play(p,300); const s=await I.snap(p); I.log("300 frames ms",Date.now()-t0,"clock",s.clockText,s.clock.toFixed(2),"dwell",s.dwellSt,"cap",s.caption);
  t0=Date.now(); await I.drawShot(p,"drvtest"); I.log("draw+shot ms",Date.now()-t0);
  I.log("errors",JSON.stringify(p._log));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
