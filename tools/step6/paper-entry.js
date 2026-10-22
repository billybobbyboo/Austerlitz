/* Roadmap step 6 item 1, found while P1's viewport was probed (docs/STEP6_SPEC.md section 12): how the paper map is framed when a phone
   enters it. Each size, each way in, on a fresh page with a phone's device (density 3, touch, Safari's user agent), by real taps: "Explore on
   my own", then "menu" (the Paper map button sought behind the Menu: it is not there, the button is in the Layers panel only) or "layers" (the
   Layers panel, its Paper map button, then its close); after 6 s and the app's settle, MAPCAM's state, the modelled field's box on the screen
   and the free rectangle, logged; a screenshot of each.
   node tools/step6/paper-entry.js [390x844,402x714] [screenshot dir]
   Measurement only; nothing is written to a source file. Never run it beside check:visual. */
const path=require("path"), R=path.join(__dirname,"..","..");
const { chromium } = require("playwright");
const TR=require("../visual/three-route.js");
const IOS="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const SIZES=(process.argv[2]||"390x844,402x714").split(",").map(s=>s.split("x").map(Number));
async function tap(p,sel){ let h=await p.$(sel); if(h&&!(await h.isVisible())){ await (await p.$("#menubtn")).tap({timeout:90000}); await p.waitForTimeout(800); h=await p.$(sel); }
  if(!h||!(await h.isVisible())) return sel+" NOT VISIBLE"; await h.tap({timeout:90000}); await p.waitForTimeout(800); return sel; }
const probe=()=>{ const st=MAPCAM.state(), F=MAPCAM.field.map(c=>MAPCAM.toScreen(c[0],c[1])); const xs=F.map(q=>q[0]),ys=F.map(q=>q[1]);
  const fr=MAPCAM.freeRect(); return {mode, framed:MAPCAM.framed(), wpp:+st.wpp.toFixed(4), field:[Math.min(...xs),Math.min(...ys),Math.max(...xs),Math.max(...ys)].map(Math.round), freeRect:fr,
  layerOpen:!document.getElementById("layerpop").hidden, menuOpen:document.body.classList.contains("menu-open"), vp:[innerWidth,innerHeight]}; };
(async()=>{
  const b=await chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
  for(const [w,h] of SIZES) for(const way of ["menu","layers"]){
    const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:IOS});
    const p=await ctx.newPage(); await TR.routeThree(p);
    await p.goto("file://"+R+"/austerlitz-command-map.html?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(p,240000,500);
    const log=[]; log.push(await tap(p,"#fr-close"));
    if(way==="layers"){ log.push(await tap(p,"#layersbtn")); log.push(await tap(p,".mode-btn[data-m=staff]")); log.push(JSON.stringify(await p.evaluate(probe))); log.push(await tap(p,"#layerclose")); }
    else { log.push(await tap(p,".mode-btn[data-m=staff]")); }
    await p.waitForTimeout(6000); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(30));
    const r=await p.evaluate(probe);
    await p.screenshot({path:(process.argv[3]||".")+"/"+w+"x"+h+"-"+way+".png"});
    console.log(w+"x"+h, way, log.join(" | "), "=>", JSON.stringify(r));
    await ctx.close(); }
  await b.close(); })().catch(e=>{ console.error(e); process.exit(1); });
