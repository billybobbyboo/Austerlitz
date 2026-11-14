/* Mock S3-B again, in the page only: the apron hidden so the sheet's surround is the paper's tone (no image edit). PROGRAMMATIC; nothing shipped. */
"use strict";
const L=require("./lib.js"); const inject=require("./metrics.js"); const treat=require("./treat.js"); const path=require("path");
const MS=path.join(L.ROOT,"mock");
(async()=>{
  const {server,url}=await L.serve(); const b=await L.launch();
  const {page}=await L.open(b,url,{w:1440,h:900}); await page.evaluate(inject); await page.evaluate(treat);
  await page.getByRole("button",{name:"Explore on my own"}).click(); await L.sleep(600);
  await page.evaluate(()=>{ setClock(540,{instant:true,force:true}); setMode("staff"); }); await L.sleep(4500);
  await page.locator("#layersbtn").click(); await L.sleep(500); await page.locator("#layerpop").getByText("Contours",{exact:true}).click(); await L.sleep(300); await page.keyboard.press("Escape"); await L.sleep(600);
  const r=await page.evaluate(()=>{ var ok=typeof apronMesh!=="undefined"&&!!apronMesh; if(ok) apronMesh.visible=false; scene.background.set("#E9E2CE"); requestRender(8);
    window.__treat.B({filter:"contrast(1.16) saturate(1.28)",frame:true,frameInset:6,title:["2 December 1805 · about nine o’clock","Soult storms the heights","Saint-Hilaire and Vandamme climb out of the fog onto the plateau"]});
    /* the paper map's own labels keep their plates (they are already ink on paper); only the live events take the dark plate */
    var st=document.createElement("style"); st.textContent="body.aud-b.mode-staff #maplayer .ml-item:not(.aud-live){text-shadow:none}"; document.head.appendChild(st);
    return {apron:ok,bg:scene.background.getHexString()}; });
  console.log(JSON.stringify(r)); await L.sleep(2500);
  await page.screenshot({path:path.join(MS,"S3-desk-paper-B.png"),timeout:240000}); console.log("shot S3-desk-paper-B");
  await b.close(); server.close();
})().catch(e=>{ console.error(e); process.exit(1); });
