/* Mock sets 2-5. PROGRAMMATIC state; prototypes injected at run time (treat.js); nothing in the build changes. */
"use strict";
const L=require("./lib.js"); const inject=require("./metrics.js"); const treat=require("./treat.js"); const path=require("path");
const MS=path.join(L.ROOT,"mock"); const ONLY=(process.env.ONLY||"").split(",").filter(Boolean);
const say=(k,v)=>console.log(k,typeof v==="string"?v:JSON.stringify(v));
const want=k=>!ONLY.length||ONLY.indexOf(k)>=0;
const TITLE=["2 December 1805 · about nine o’clock","Soult storms the heights","Saint-Hilaire and Vandamme climb out of the fog onto the plateau"];
(async()=>{
  const {server,url}=await L.serve(); const b=await L.launch();
  const step=async(name,f)=>{ if(!want(name)) return; try{ await f(); }catch(e){ say(name+" ERROR",String(e).slice(0,400)); } };
  const mk=async o=>{ const r=await L.open(b,url,o); await r.page.evaluate(inject); await r.page.evaluate(treat); return r.page; };
  const shot=async(page,n)=>{ await L.sleep(900); await page.screenshot({path:path.join(MS,n+".png"),timeout:240000}); say("shot",n); };
  const settle=async(page,ms)=>{ await L.sleep(ms||1500); await page.waitForFunction(()=>!tween,null,{timeout:30000}).catch(()=>{}); await L.sleep(600); };
  const playFrame=(page,dist,el)=>page.evaluate(o=>{ var g=followGoal(), d=g.dir.clone(); if(o.el){ var h=new THREE.Vector3(d.x,0,d.z).normalize(), e=o.el*Math.PI/180; d.set(h.x*Math.cos(e),Math.sin(e),h.z*Math.cos(e)); } freeCam=true; tween=null; landCam.position.copy(g.T).addScaledVector(d,o.dist); orbitTarget.copy(g.T); landCam.lookAt(orbitTarget); if(typeof clampCamera==="function") clampCamera(); requestRender(6); },{dist:dist,el:el||0});
  // ---- S2: dense 09:00, Study, desktop
  await step("S2",async()=>{ const page=await mk({w:1440,h:900}); await page.getByRole("button",{name:"Explore on my own"}).click(); await L.sleep(600);
    await page.evaluate(()=>setClock(540,{instant:true,force:true})); await settle(page,2500); await playFrame(page,238,0); await settle(page,2500);
    await page.evaluate(()=>window.__treat.A()); await shot(page,"S2-desk-0900-play-A");
    await page.evaluate(T=>{ window.__treat.B({land:true,title:T}); document.body.classList.add("mode-staff"); },TITLE); await shot(page,"S2-desk-0900-play-B"); await page.evaluate(()=>{ window.__treat.off(); document.body.classList.remove("mode-staff"); });
    // the framing proposal: 52 degrees above the horizon at 205 units, same target and clock
    await playFrame(page,205,52); await settle(page,2500); say("S2 steep framing metrics, labels as built",await page.evaluate(()=>window.__audit.comp())); await shot(page,"S2-desk-0900-steep-current-labels");
    await page.evaluate(()=>window.__treat.A()); await L.sleep(500); say("S2 steep + A",await page.evaluate(()=>{ var its=[].slice.call(document.querySelectorAll("#maplayer .ml-item")).filter(e=>+getComputedStyle(e).opacity>0.5&&getComputedStyle(e).visibility!=="hidden"); return {plates:its.filter(e=>!e.classList.contains("aud-quiet")).length,quiet:its.filter(e=>e.classList.contains("aud-quiet")).length}; })); await shot(page,"S2-desk-0900-steep-A");
    await page.evaluate(T=>{ window.__treat.B({land:true,title:T}); document.body.classList.add("mode-staff"); },TITLE); await shot(page,"S2-desk-0900-steep-B");
    await page.context().close(); });
  // ---- S1: the first frame
  await step("S1",async()=>{ const page=await mk({w:1440,h:900}); await shot(page,"S1-desk-first-current");
    // A: the night kept as a tint, the ground readable (a design light already: decision 71); the card in the rail's column with the three encodings
    await page.evaluate(()=>{ var P=LIGHT.predawn; P.i=0.62; P.hemi=1.25; P.grade[2]=1.12; P.grade[5]=1.22; applyLight(true); requestRender(6);
      document.body.classList.add("aud-card"); var fr=document.getElementById("firstrun"), p=document.getElementById("fr-key"), link=document.getElementById("fr-grades");
      var h=document.getElementById("fr-title"); var sub=document.createElement("p"); sub.className="aud-sub"; sub.textContent="2 December 1805 · a reconstruction from the sources"; h.after(sub);
      p.innerHTML='<div class="aud-row"><span class="aud-sw"><i style="background:#4C86D8"></i><i style="background:#D4703A"></i></span><span><b>Blue is French, amber the Allies</b>: on names, counters, the ground beneath a formation and its movement arrows.</span></div>'+
        '<div class="aud-row"><span class="aud-sw"><em>A</em><em>B</em><em>C</em></span><span><b>The letter beside a name grades its position</b>: A documented, B the sector documented and the frontage approximate, C reconstructed from the narrative.</span></div>'+
        '<div class="aud-row"><span class="aud-sw" style="font-size:18px;line-height:14px;color:var(--text-hi)">▲</span><span><b>The high ground in the centre is the Pratzen plateau</b>, which this map reads as deciding the battle.</span></div>';
      if(link){ var k=document.createElement("p"); k.style.cssText="margin:12px 0 0;font-family:var(--sans);font-size:12.5px"; k.appendChild(link); link.textContent="Every symbol: the key"; fr.appendChild(k); } }); await settle(page,2500);
    await shot(page,"S1-desk-first-A");
    await page.context().close();
    // B: the paper plate as the title page
    const p2=await mk({w:1440,h:900}); await p2.evaluate(()=>{ setMode("staff"); document.getElementById("firstrun").hidden=false; document.body.classList.add("firstrun-on"); }); await settle(p2,3500);
    await p2.evaluate(()=>{ scene.background.set("#EDE6D3"); requestRender(6); window.__treat.B({filter:"contrast(1.18) saturate(1.25)",frame:true,frameInset:6,title:["Moravia · 2 December 1805","The Battle of Austerlitz","A reconstruction from the sources, hour by hour"]}); }); await settle(p2,1500);
    await shot(p2,"S1-desk-first-B"); await p2.context().close(); });
  // ---- S3: the paper map at 09:00
  await step("S3",async()=>{ const page=await mk({w:1440,h:900}); await page.getByRole("button",{name:"Explore on my own"}).click(); await L.sleep(600);
    await page.evaluate(()=>{ setClock(540,{instant:true,force:true}); setMode("staff"); }); await settle(page,3500); await shot(page,"S3-desk-paper-current");
    // A: the sheet's surround in the paper's own tone; nothing else changed
    await page.evaluate(()=>{ scene.background.set("#E9E1CC"); requestRender(6); }); await L.sleep(1200); await shot(page,"S3-desk-paper-A");
    // B: the plate: surround, neatline, title, contours on, a firmer print
    await page.locator("#layersbtn").click(); await L.sleep(500); await page.locator("#layerpop").getByText("Contours",{exact:true}).click(); await L.sleep(300); await page.keyboard.press("Escape"); await L.sleep(600);
    await page.evaluate(T=>{ scene.background.set("#EDE6D3"); requestRender(6); window.__treat.B({filter:"contrast(1.22) saturate(1.3)",frame:true,frameInset:6,title:T}); },TITLE); await settle(page,1500); await shot(page,"S3-desk-paper-B");
    await page.context().close(); });
  // ---- S4: the phone at 09:00
  await step("S4",async()=>{ const page=await mk({w:390,h:844,phone:true,dpr:3}); await page.getByRole("button",{name:"Explore on my own"}).tap(); await L.sleep(600);
    await page.evaluate(()=>setClock(540,{instant:true,force:true})); await settle(page,2500); await playFrame(page,238*1.72,0); await settle(page,2500);
    say("S4 phone current",await page.evaluate(()=>window.__audit.comp())); await shot(page,"S4-phone-0900-play-current");
    await page.evaluate(()=>window.__treat.A()); await shot(page,"S4-phone-0900-play-A"); await page.evaluate(()=>window.__treat.off());
    await playFrame(page,300,55); await settle(page,2500); say("S4 phone steep",await page.evaluate(()=>window.__audit.comp())); await page.evaluate(()=>window.__treat.A()); await shot(page,"S4-phone-0900-steep-A");
    await page.evaluate(T=>{ window.__treat.B({land:true,title:["about nine o’clock",T[1]],titleX:10,titleY:10}); document.body.classList.add("mode-staff"); },TITLE); await shot(page,"S4-phone-0900-steep-B");
    await page.context().close(); });
  await b.close(); server.close();
})().catch(e=>{ console.error(e); process.exit(1); });
