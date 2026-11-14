/* Journey 1 (arrive cold), desktop 1440x900 DPR1, llvmpipe. Real clicks and keys only. */
"use strict";
const L=require("./lib.js");
(async()=>{
  const {server,url}=await L.serve(); const b=await L.launch();
  const st=page=>page.evaluate(()=>({clock:clock,hhmm:(Math.floor(clock/60)+"").padStart(2,"0")+":"+(Math.round(clock%60)+"").padStart(2,"0"),mode:typeof mode!=="undefined"?mode:null,pres:typeof presentation!=="undefined"?presentation:null,playing:playing,speed:speed,active:document.activeElement&&(document.activeElement.id||document.activeElement.className||document.activeElement.tagName)}));
  const vis=(page,sel)=>page.evaluate(s=>{ const e=document.querySelector(s); if(!e) return null; const r=e.getBoundingClientRect(); return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),text:(e.innerText||"").replace(/\s+/g," ").slice(0,600)}; },sel);
  // ---- page A: the opening
  let {page,log}=await L.open(b,url,{w:1440,h:900});
  // focus order inside the card by Tab
  const order=[]; for(let i=0;i<5;i++){ await page.keyboard.press("Tab"); order.push(await page.evaluate(()=>document.activeElement.id||document.activeElement.innerText.slice(0,20))); }
  console.log("card tab order",order);
  await page.getByRole("button",{name:/Begin/}).click(); await L.sleep(2500);
  await L.shot(page,"j1-open-1"); console.log("opening 1",await st(page), await vis(page,"#tourbar")||await vis(page,".tourbar"));
  console.log("bars",await page.evaluate(()=>[...document.querySelectorAll("[id*=tour]")].map(e=>({id:e.id,vis:e.getBoundingClientRect().height>0,t:(e.innerText||"").replace(/\s+/g," ").slice(0,300)}))));
  for(let i=2;i<=4;i++){
    await page.locator("#tour-next").click(); await L.sleep(6000);
    await L.shot(page,"j1-open-"+i+"-playing"); console.log("playing toward",i,await st(page));
    // wait up to 150 s for arrival, else press Next again (goes straight there)
    let arrived=false; for(let k=0;k<50;k++){ await L.sleep(3000); if(await page.evaluate(()=>!OPENING.play)){ arrived=true; break; } }
    if(!arrived){ await page.locator("#tour-next").click(); await L.sleep(3000); }
    console.log("arrived by play:",arrived);
    await L.sleep(2500); await L.shot(page,"j1-open-"+i); console.log("opening",i,await st(page), await vis(page,"#tour"));
  }
  await page.locator("#tour-next").click(); await L.sleep(3000);
  await L.shot(page,"j1-open-end"); console.log("opening end",await st(page));
  console.log("logA",JSON.stringify(log)); await page.context().close();
  // ---- page B: explore on my own
  ({page,log}=await L.open(b,url,{w:1440,h:900}));
  await page.getByRole("button",{name:"Explore on my own"}).click(); await L.sleep(1500);
  await L.shot(page,"j1-explore"); console.log("explore",await st(page));
  console.log("logB",JSON.stringify(log));
  await b.close(); server.close();
})().catch(e=>{ console.error(e); process.exit(1); });
