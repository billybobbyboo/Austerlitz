/* how long one app frame takes here (software WebGL, loaded machine: not a device's), and the loop's frame count over 20 s idle and playing */
const I=require("./ilib.js");
(async()=>{
  const b=await I.A.launch();
  const p=await I.openV(b,[Number(process.argv[2]||1600),Number(process.argv[3]||900)],{});
  I.log("booted ms",p._loadMs);
  await p.keyboard.press("Escape");
  const t=await p.evaluate(()=>{ const r=[]; for(let i=0;i<4;i++){ const a=performance.now(); renderFrame(); r.push(Math.round(performance.now()-a)); } const a2=performance.now(); updateVisibility(); const uv=performance.now()-a2; return {render:r,updateVis:Math.round(uv)}; });
  I.log("renderFrame ms x4",JSON.stringify(t));
  const n0=await I.loopN(p); await I.wait(p,15000); const n1=await I.loopN(p);
  I.log("loop frames in 15 s after Esc",n1-n0, await p.evaluate(()=>DEV.state));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
