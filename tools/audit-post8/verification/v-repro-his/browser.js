/* v-repro-his: the history findings #0-#4 seen in the audited build's own page (one harness page, 1600 x 900, Chromium 141 on SwiftShader).
   Real input where the finding is about what a visitor does: the first-run card's primary action and the opening bar's Next by real clicks
   (as tools/visual/harness.js reaches 'opening-2'), Esc by a real key, the face-about event marker by a real mouse click at its box.
   Set-up through the harness's own case driver (window.__aus.apply -> AUSTERLITZ_DEBUG.applyCase: clock, selection, camera) where only a state
   is needed; everything else is read from the page (DOM text, the blocks' instance matrices, the app's own functions as observers).
   node browser.js   -> docs/audit-post8-evidence/verification/v-repro-his/browser.json and *.jpg */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("/home/user/Austerlitz/tools/audit-post8/lib.js");
const OUT=path.join(A.EVID,"verification","v-repro-his"); fs.mkdirSync(OUT,{recursive:true});
const RUN=process.env.VR_RUN||"run2", VP=(process.env.VR_VP||"1600x900").split("x").map(Number), SKIP_OPENING=!!process.env.VR_SKIP_OPENING;
const R={started:new Date().toISOString(), run:RUN, viewport:VP, build:null, steps:{}};
const log=(k,v)=>{ R.steps[k]=v; fs.writeFileSync(path.join(OUT,"browser-"+RUN+".json"),JSON.stringify(R,null,1)); console.log(k, JSON.stringify(v).slice(0,600)); };
async function shot(page,f,q){ try{ await A.jpeg(page,f,q); } catch(e){ log("screenshot_failed_"+path.basename(f),String(e.message).slice(0,160)); } }
async function settle(page){ await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(30)); await page.waitForTimeout(400); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); }
/* in the page: a block's figures (every instanced mesh's instances, world x,z, deduplicated), the drawer's text, a block's facing */
const PAGE_HELPERS=`
window.__vr={
  figs:function(id){ var rec=units[id]; if(!rec||!rec.block) return []; rec.block.updateMatrixWorld(true); var m=new THREE.Matrix4(), v=new THREE.Vector3(), seen={}, out=[];
    rec.block.traverse(function(o){ if(!o.isInstancedMesh) return; for(var i=0;i<o.count;i++){ o.getMatrixAt(i,m); m.premultiply(o.matrixWorld); v.setFromMatrixPosition(m);
      var k=Math.round(v.x*20)+","+Math.round(v.z*20); if(seen[k]) continue; seen[k]=1; out.push([v.x,v.z]); } }); return out; },
  hull:function(P){ P=P.slice().sort(function(a,b){ return a[0]-b[0]||a[1]-b[1]; }); if(P.length<3) return P; var cr=function(o,a,b){ return (a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]); }, lo=[], up=[];
    P.forEach(function(p){ while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0) lo.pop(); lo.push(p); });
    for(var i=P.length-1;i>=0;i--){ var p=P[i]; while(up.length>=2&&cr(up[up.length-2],up[up.length-1],p)<=0) up.pop(); up.push(p); }
    up.pop(); lo.pop(); return lo.concat(up); },
  inHull:function(H,p){ if(H.length<3) return false; for(var i=0;i<H.length;i++){ var a=H[i], b=H[(i+1)%H.length]; if((b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0])<0) return false; } return true; },
  overlap:function(a,b){ var A=this.figs(a), B=this.figs(b), HA=this.hull(A), HB=this.hull(B), self=this; var aInB=A.filter(function(p){ return self.inHull(HB,p); }).length, bInA=B.filter(function(p){ return self.inHull(HA,p); }).length;
    var md=1e9; A.forEach(function(p){ B.forEach(function(q){ var d=Math.hypot(p[0]-q[0],p[1]-q[1]); if(d<md) md=d; }); });
    return {clock:clock, figs:[A.length,B.length], aInsideB:aInB, bInsideA:bInA, minFigGap_m:+(md*GEOREF.KM_PER_MAP*GEOREF.MAP_PER_WORLD*1000).toFixed(1)}; },
  inCastle:function(id){ var A=this.figs(id), parts=BLDG.filter(function(b){ return b.landmark&&/castle|farm/.test(b.part||""); }); var n=0;
    A.forEach(function(p){ if(parts.some(function(b){ return v8BoxPt(b.R,p[0],p[1])===0; })) n++; }); return {figs:A.length, insideCastleOrFarm:n, parts:parts.map(function(b){ return b.part; })}; },
  facing:function(id,oppId){ var rec=units[id], b=rec.block; b.updateMatrixWorld(true); var f=new THREE.Vector3(0,0,1).applyQuaternion(b.quaternion); f.y=0; f.normalize();
    var me=W(posNow(id)[0],posNow(id)[1]), op=W(posNow(oppId)[0],posNow(oppId)[1]), dx=op[0]-me[0], dz=op[1]-me[1], L=Math.hypot(dx,dz);
    var h=headingAt(id,clock), y=rec.yaw, ang=Math.acos(Math.max(-1,Math.min(1,(f.x*dx+f.z*dz)/L)))*180/Math.PI;
    return {clock:clock, yaw:y, headingAt:h, yawMinusHeading:h===null?null:+(Math.atan2(Math.sin(y-h),Math.cos(y-h))).toFixed(4), forward:[+f.x.toFixed(3),+f.z.toFixed(3)],
      compassDeg:+((Math.atan2(f.x,-f.z)*180/Math.PI+360)%360).toFixed(0), toOpponentDeg:+((Math.atan2(dx,-dz)*180/Math.PI+360)%360).toFixed(0), angleToOpponent:+ang.toFixed(0), km:+(L*GEOREF.MAP_PER_WORLD*GEOREF.KM_PER_MAP).toFixed(2),
      moving:!!(marchRate(id,clock)&&marchRate(id,clock).moving), kmh:marchRate(id,clock)?+marchRate(id,clock).kmh.toFixed(2):null}; },
  drawer:function(){ var b=document.getElementById("drawer-body"); return b?b.innerText.replace(/\\n+/g," | ").slice(0,1600):null; },
  pills:function(){ var b=document.getElementById("drawer-body"); return b?[].map.call(b.querySelectorAll(".pill"),function(x){ return x.textContent.trim(); }):[]; },
  tags:function(){ var b=document.getElementById("drawer-body"); return b?[].map.call(b.querySelectorAll(".ltag.claim"),function(x){ return {ref:x.getAttribute("data-ref"),claim:x.getAttribute("data-claim"),text:x.textContent.trim()}; }):[]; },
  conf:function(){ var b=document.getElementById("drawer-body"); return b?[].map.call(b.querySelectorAll("p.conf"),function(x){ return x.textContent.trim(); }):[]; },
  layerTexts:function(re){ var L=document.getElementById("maplayer"); if(!L) return []; var r=new RegExp(re); return [].map.call(L.querySelectorAll("*"),function(x){ return (x.children.length===0?(x.textContent||""):"")+(x.getAttribute&&x.getAttribute("aria-label")?" [aria] "+x.getAttribute("aria-label"):""); }).filter(function(s){ return r.test(s); }).slice(0,8); },
  screen:function(mp){ var w=W(mp[0],mp[1]), v=new THREE.Vector3(w[0],groundY(w[0],w[1]),w[1]).project(camera); return [+((v.x+1)/2*innerWidth).toFixed(0),+((1-v.y)/2*innerHeight).toFixed(0),+v.z.toFixed(3)]; }
};`;
(async()=>{
  const b=await A.launch();
  try{
    const page=await A.open(b,VP);
    await page.addScriptTag({content:PAGE_HELPERS});
    R.build=await page.evaluate(()=>({len:document.documentElement.outerHTML.length, title:document.title}));
    /* ---- history #1: the opening's step 2 (08:45), reached by real clicks as the harness reaches 'opening-2' ---- */
    if(!SKIP_OPENING){ await page.click("#fr-tour",{timeout:180000}); await settle(page);
    await page.click("#tour-next",{timeout:180000}); if(await page.evaluate(()=>!!OPENING.play)) await page.click("#tour-next",{timeout:180000});
    await settle(page);
    const op=await page.evaluate(()=>({on:OPENING.on,k:OPENING.k,stop:tourStep,clock:clock,
      legrand:__vr.screen(posNow("legrand")), prz:__vr.screen(posNow("prz")), castle:__vr.screen([212.9,344.3]), vp:[innerWidth,innerHeight],
      overlap:__vr.overlap("legrand","prz"), castleFigs:__vr.inCastle("legrand"), visible:{legrand:units.legrand.block.visible, prz:units.prz.block.visible}}));
    log("f1_opening_step2",op);
    await shot(page,path.join(OUT,"f1-opening-step2-0845.jpg"),80);
    await page.keyboard.press("Escape"); await settle(page);
    log("after_escape",await page.evaluate(()=>({opening:OPENING.on,clock:clock}))); }
    else { await page.keyboard.press("Escape"); await settle(page); log("card_closed_by_escape",await page.evaluate(()=>({firstRun:firstRunOpen,clock:clock}))); }
    /* ---- history #1: the two blocks and the castle at 08:44, 08:45 and 08:51, close up ---- */
    for(const t of [524,525,531]){
      await page.evaluate(t=>window.__aus.apply({t:t,presentation:"study",mode:"terrain",aim:{map:[213.5,342.5],dir:[0.35,1.0,1],r:14}}),t); await settle(page);
      log("f1_"+t,await page.evaluate(()=>({clock:clock, overlap:__vr.overlap("legrand","prz"), castleFigs:__vr.inCastle("legrand"), sts:[liveStatus("legrand",curPhase),liveStatus("prz",curPhase)]})));
      if(t===531) await shot(page,path.join(OUT,"f1-sokolnitz-0851.jpg"),82);
    }
    /* ---- history #0: the displayed status and the block's facing ---- */
    for(const [id,t,opp] of [["rg_inf",720,"vandamme"],["rg_cav",720,"vandamme"],["lich",660,"kellermann"],["milo",630,"sthilaire"]]){
      await page.evaluate(([id,t])=>window.__aus.apply({t:t,presentation:"study",mode:"terrain",select:["f",id],aim:{map:id,dir:[0.3,1.0,1],r:40}}),[id,t]); await settle(page);
      log("f0_"+id+"_"+t,await page.evaluate(([id,opp])=>({facing:__vr.facing(id,opp), pills:__vr.pills(), drawer:__vr.drawer(), arrowLabel:__vr.layerTexts("Russian Imperial Guard")}),[id,opp]));
    }
    /* ---- history #2: the face-about marker pressed by a real mouse click ---- */
    await page.evaluate(()=>window.__aus.apply({t:500,presentation:"study",mode:"terrain",aim:{map:[290,237],dir:[0.3,1.1,1],r:60}})); await settle(page);
    const box=await page.evaluate(()=>{ var b=[].filter.call(document.querySelectorAll("#evmarks button.ev-mark"),function(x){ return /face about/.test(x.getAttribute("aria-label")||""); })[0];
      if(!b) return null; var r=b.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,w:r.width,h:r.height,aria:b.getAttribute("aria-label"),tip:b.dataset.tip}; });
    log("f2_marker",box);
    if(box){ await page.mouse.move(box.x,box.y); await page.mouse.down(); await page.mouse.up(); await settle(page);
      log("f2_dossier",await page.evaluate(()=>({clock:clock, selection:selection&&(selection.kind+":"+selection.id), pills:__vr.pills(), tags:__vr.tags(), conf:__vr.conf(), drawer:__vr.drawer(),
        mapLabel:__vr.layerTexts("face about"), phaseLine:PHASES[3].events.filter(function(e){ return /face about/.test(e[1]); })})));
      await shot(page,path.join(OUT,"f2-face-about-dossier.jpg"),82); }
    /* ---- history #3: Blasowitz at the event's minute ---- */
    await page.evaluate(()=>window.__aus.apply({t:675,presentation:"study",mode:"terrain",aim:{map:[310,170],dir:[0.15,1.3,1],r:75}})); await settle(page);
    log("f3_1115",await page.evaluate(()=>{ var B=[296,147], out=[]; Object.keys(units).forEach(function(id){ var f=FORMATIONS[id]; if(f.nation==="fr"||f.arm==="hq") return; var p=posNow(id); if(!p) return;
      out.push([id,+(Math.hypot(p[0]-B[0],p[1]-B[1])*GEOREF.KM_PER_MAP).toFixed(2)]); }); out.sort(function(a,b){ return a[1]-b[1]; });
      return {clock:clock, nearestAllied:out.slice(0,5), eventLabel:__vr.layerTexts("Blasowitz"), screen:{Blasowitz:__vr.screen(B), rg_inf:__vr.screen(posNow("rg_inf")), rg_cav:__vr.screen(posNow("rg_cav")), lich:__vr.screen(posNow("lich"))}}; }));
    /* ---- history #4: Caffarelli's card during his pursuit, at an arrival, and after his last anchor ---- */
    for(const t of [840,870,1050]){
      await page.evaluate(t=>window.__aus.apply({t:t,presentation:"study",mode:"terrain",select:["f","caffarelli"],aim:{map:"caffarelli",dir:[0.3,1.0,1],r:40}}),t); await settle(page);
      log("f4_caffarelli_"+t,await page.evaluate(()=>({clock:clock, conf:confAt("caffarelli",clock), pills:__vr.pills(), confText:__vr.conf()})));
    }
    log("errors",A.errors(page));
  } finally { await b.close(); R.finished=new Date().toISOString(); fs.writeFileSync(path.join(OUT,"browser-"+RUN+".json"),JSON.stringify(R,null,1)); }
})().catch(e=>{ console.error("FAILED",e&&e.stack||e); R.error=String(e&&e.stack||e); fs.writeFileSync(path.join(OUT,"browser-"+RUN+".json"),JSON.stringify(R,null,1)); process.exit(1); });
