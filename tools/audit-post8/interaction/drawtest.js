const I=require("./ilib.js");
(async()=>{
  const b=await I.A.launch();
  const p=await I.openV(b,[800,450],{});
  I.log("booted ms",p._loadMs);
  await p.keyboard.press("Escape");
  let r=await p.evaluate(()=>{ window.__drv.draw(); const gl=renderer.getContext(); const px=new Uint8Array(4); gl.readPixels(400,225,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px); return {px:Array.from(px),lost:GL.lost,ctxLost:gl.isContextLost(),fx:FX.on}; });
  I.log("after draw, same task",JSON.stringify(r));
  await I.shot(p,"drawtest-a");
  r=await p.evaluate(()=>{ const gl=renderer.getContext(); const px=new Uint8Array(4); gl.readPixels(400,225,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px); return {px:Array.from(px),lost:GL.lost,ctxLost:gl.isContextLost()}; });
  I.log("later task",JSON.stringify(r));
  await p.evaluate(()=>window.__drv.stop());
  await I.wait(p,20000);
  await I.shot(p,"drawtest-b");
  I.log("errors",JSON.stringify(p._log));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
