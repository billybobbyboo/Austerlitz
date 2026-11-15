/* UI/UX roadmap step 1: check:contrast's reflow page, its states applied as contrast.js applies them (320 x 256 at density 4), and the map layer's fades read after each:
   the item a state brings in stands mid-fade 300 ms after one frame (on the base build and this one alike); then frames until none fades.
   node tools/ux-step1/rf-fade.js <build.html>   (measurement only) */
const path=require("path"), ROOT=path.resolve(__dirname,"..",".."), TR=require(path.join(ROOT,"tools","visual","three-route.js")); const {chromium}=require("playwright");
const html=path.resolve(process.argv[2]);
const RF_HELP="window.__rf={noH:function(){ return true; }, on:function(){return true;}};";
const S=[["reflow-explore", ()=>{ closeFirst(null); setPresentation("study"); setMode("terrain"); setClock(570,{force:true}); updateVisibility(); }],
 ["reflow-phase", ()=>{ document.getElementById("phasebtn").click(); var l=document.getElementById("d-lede"); if(l) l.scrollIntoView({block:"start"}); }],
 ["reflow-panels", ()=>{ setDSheet(false); setPanels(true); }],
 ["reflow-sources", ()=>{ openSources(); }],
 ["reflow-dossier", ()=>{ closeSources(); setPanels(false); select("f","sthilaire"); paintDrawer(); }],
 ["reflow-help", ()=>{ select(null,null); setHelp(true); }]];
(async()=>{ const b=await chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]});
 const p=await b.newPage({viewport:{width:320,height:256},deviceScaleFactor:4}); await TR.routeThree(p);
 await p.goto("file://"+html+"?harness=1",{waitUntil:"commit"}); await TR.waitBoot(p);
 await p.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"});
 const rd=()=>p.evaluate(()=>{ const out=[]; for(const k in ML.items){ const it=ML.items[k]; if(!it.el) continue; const t=it.el.textContent||""; if(/Kollowrat/.test(t)) out.push({k,on:it.on,fa:it.fa,rem:!!it.rem,op:it.el.style.opacity,cls:it.el.className}); }
   const fading=[].filter.call(document.querySelectorAll("#maplayer .ml-item"),e=>e.style.opacity!=="").map(e=>e.textContent.slice(0,24)+"@"+e.style.opacity);
   return {it:out,fading,tbH:document.querySelector(".timebar").getBoundingClientRect().height,cap:document.getElementById("tb-cap").textContent.slice(0,80)}; });
 for(const [n,fn] of S){ const t0=Date.now(); await p.evaluate(fn); await p.evaluate(()=>{ AUSTERLITZ_DEBUG.settle(3); }); const t1=Date.now(); await p.waitForTimeout(300);
   const F="(function(){ for(var k in ML.items){ var it=ML.items[k]; if(!it||it.eFrame!==ML.frame) continue; if((it.on&&typeof it.fa==='number'&&it.fa<1)||it.rem) return k; } return false; })()";
   let c=0; const f0=await p.evaluate(F); while(c<40&&await p.evaluate(F)){ await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(1)); await p.waitForTimeout(100); c++; }
   console.log(n,"settle ms",t1-t0,"fading first",f0,"frames",c,JSON.stringify(await rd())); }
 await p.waitForTimeout(3000); console.log("after 3 s",JSON.stringify(await rd()));
 await b.close(); })();
