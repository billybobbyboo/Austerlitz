const I=require("./ilib.js");
(async()=>{
  const b=await I.A.launch();
  const p=await I.openV(b,[800,450],{});
  I.log("booted ms",p._loadMs);
  await p.keyboard.press("Escape");
  await I.drawShot(p,"drawtest-c");
  I.log("errors",JSON.stringify(p._log));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
