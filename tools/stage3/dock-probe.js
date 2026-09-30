#!/usr/bin/env node
/* Stage 3 Part A (docs/STAGE3_SPEC.md sections B, D and G): the docked layout, tried on the built page by a probe. The probe
   rearranges the running page's DOM and CSS (measurement code, not the Stage 3 implementation); it changes no source file.
   node tools/stage3/dock-probe.js [--json out.json] [--md out.md] [--shots dir] [--levels 0,1,2,3,4] [--cases a,b]

   Levels (each includes the ones before it):
     0 today            the build as it is
     1 now-tab          the dispatch docked in the rail as a first tab, "Now" (the section moved into a new tab pane)
     2 timeline         one timeline of about 90 px: a control row (play, clock, the situation's first line as a caption,
                        speeds, scale) and one track (act bands, phase ticks with their labels, the time rail with its event
                        markers and hour ticks; the hour numerals are left out of the probe); the situation line's readings move to the Now tab
     3 legend-closed    the legend closed to its head ("Key") by default in Study
     4 dossier-in-rail  the dossier (drawer) opens in the rail's column instead of a second panel on the right
   Per harness view (tools/visual/cases.js) and per level: the unobstructed fraction (section H: the harness's own
   measure.js, at the case's viewport and at 1280 x 720), the panels' rectangles, the timebar's height and rows, the largest
   free rectangle (MAPCAM.freeRect, the rectangle the paper map frames in), the paper map's px per km as framed, the arrow
   heads under a panel, and the landscape's orbit target against the free rectangle's centre, without and with
   camera.setViewOffset centring it there (section A). Two extra views: the phase-8 Overview (14:40, Study and Watch), where
   2C found the Allied heads under the timebar. */
const fs=require("fs"), path=require("path");
const {launch,open,settle,CASES,sheet}=require("../stage2/page.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const LEVELS=(opt("--levels")||"0,1,2,3,4").split(",").map(Number);
const NAMES=["today","now-tab","timeline","legend-closed","dossier-in-rail"];
const EXTRA=[
  {name:"ph8-overview-study", viewport:[1600,900], t:880, presentation:"study", mode:"terrain", cam:[-27,272,41,-27,0,9],
   note:"Phase 8 (14:40), the Overview vantage, Study: where 2C found the Allied heads under the timebar."},
  {name:"ph8-overview-watch", viewport:[1600,900], t:880, presentation:"watch", mode:"terrain", cam:[-27,272,41,-27,0,9],
   note:"The same in Watch."},
  {name:"paper-1366", viewport:[1366,768], t:570, presentation:"study", mode:"staff", paper:"frame", cam:[-27,272,41,-27,0,9],
   note:"The paper map as entered at 1366 x 768 (2E: 272 x 504 px free, 9.9 px per km)."}
];
let cases=CASES.concat(EXTRA); cases=cases.filter(c=>c.fresh).concat(cases.filter(c=>!c.fresh).sort((a,b)=>a.viewport.join('x')<b.viewport.join('x')?-1:a.viewport.join('x')>b.viewport.join('x')?1:0)); if(opt("--cases")){ const w=opt("--cases").split(","); cases=cases.filter(c=>w.includes(c.name)); }

/* ---- the probe, injected into the page ---- */
const PROBE=function(){
  var S3={level:0};
  function css(t){ var s=document.createElement("style"); s.textContent=t; document.head.appendChild(s); }
  function mv(node,parent,before){ if(node&&parent) parent.insertBefore(node,before||null); }
  S3.dock=function(level){
    S3.level=level;
    if(level>=1){   /* the dispatch as the rail's first tab */
      var tabs=document.querySelector(".rail .tabs"), b=document.createElement("button");
      b.className="tab-btn"; b.dataset.t="now"; b.textContent="Now"; b.setAttribute("role","tab");
      tabs.insertBefore(b,tabs.firstChild);
      tabs.querySelectorAll(".tab-btn").forEach(function(x){ x.setAttribute("aria-selected",String(x===b)); });
      var pane=document.createElement("div"); pane.id="now"; pane.className="tabpane";
      var rs=document.querySelector(".railscroll"); rs.insertBefore(pane,rs.firstChild);
      rs.querySelectorAll(".tabpane").forEach(function(p){ p.hidden=(p!==pane); });
      var d=document.querySelector(".dispatch"); mv(d,pane); d.classList.add("s3-docked");
      css(".dispatch.s3-docked{position:static!important;left:auto!important;bottom:auto!important;width:auto!important;max-height:none!important;"+
          "box-shadow:none!important;background:transparent!important;border:0!important;padding:4px 0 10px!important;overflow:visible!important}"+
          ".dispatch.s3-docked h2{font-size:var(--t-h2)!important}");
    }
    if(level>=2){   /* one timeline of about 90 px */
      var tb=document.querySelector(".timebar"), top=tb.querySelector(".tb-top"), rail=document.getElementById("timerail"),
          sit=document.getElementById("situation"), acts=document.getElementById("acts"), tw=tb.querySelector(".tb-trackwrap");
      var cap=document.createElement("div"); cap.className="s3-cap";
      function capText(){ var a=sit.querySelector(".act"), e=sit.querySelector(".ev"); cap.textContent=[a&&a.textContent,e&&e.textContent].filter(Boolean).join("  ·  ")||sit.textContent.split("\n")[0]; }
      capText(); new MutationObserver(capText).observe(sit,{childList:true,subtree:true,characterData:true});
      mv(cap,top,top.querySelector(".speeds"));
      var track=document.createElement("div"); track.className="s3-track";
      var band=document.createElement("div"); band.className="s3-acts", ticks=document.createElement("div"); ticks.className="s3-phases";
      var T0=T_MIN, T1=T_MAX, pc=function(t){ return 100*(t-T0)/(T1-T0); };
      ACTS.forEach(function(a){ var p0=PHASES[a.phases[0]], p1=PHASES[a.phases[a.phases.length-1]], s=document.createElement("span");
        s.style.left=pc(p0.t0)+"%"; s.style.width=(pc(p1.t1)-pc(p0.t0))+"%"; s.textContent=a.n; band.appendChild(s); });
      PHASES.forEach(function(p){ var s=document.createElement("span"); s.style.left=pc(p.t0)+"%"; s.style.width=(pc(p.t1)-pc(p.t0))+"%"; s.textContent=p.label; ticks.appendChild(s); });
      track.appendChild(band); mv(rail,track); track.appendChild(ticks); tb.appendChild(track);
      /* the situation's readings go to the Now tab (Study); in Watch only the caption stays */
      var now=document.getElementById("now"); if(now) now.insertBefore(sit,now.firstChild); else sit.style.display="none";
      acts.style.display="none"; if(tw) tw.style.display="none";
      css(".s3-cap{flex:1 1 200px;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:var(--t-ui);color:var(--text-hi)}"+
          ".timebar .tb-top{padding:2px 14px 0!important;flex-wrap:nowrap!important}"+
          ".s3-track{position:relative;margin:2px 14px 2px;height:50px}"+
          ".s3-acts,.s3-phases{position:absolute;left:0;right:0;height:16px}.s3-acts{top:0}.s3-phases{top:16px}"+
          ".s3-acts span,.s3-phases span{position:absolute;top:0;height:16px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;"+
          "font-size:var(--t-ui);line-height:16px;color:var(--text-muted);padding-left:4px;box-sizing:border-box}"+
          ".s3-acts span{border-left:2px solid var(--line-2);color:var(--text)}.s3-phases span{border-left:1px solid var(--line)}"+
          ".s3-track #timerail{position:absolute!important;left:0;right:0;top:32px;height:18px;margin:0!important;width:auto!important;flex:none!important}.s3-track .rail-ticks{top:7px!important}.s3-track .rail-ticks b{display:none}"+
          "#now .tb-sit{display:block!important;padding:0 0 8px!important;border:0!important}");
      window.dispatchEvent(new Event("resize"));
    }
    if(level>=3){ ML.legendOpen=false; }
    if(level>=4){   /* the dossier in the rail's column */
      css(".drawer{left:0!important;right:auto!important;width:var(--rail)!important;bottom:var(--tb)!important;z-index:21!important;transform:translateX(-101%)}"+
          ".drawer.on{transform:translateX(0)!important}"+
          "body.drawer-open .tools,body.drawer-open .legend{transform:none!important}");
    }
    if(typeof requestRender==="function") requestRender(3);
  };
  /* measurements */
  var SEL=[".rail",".dispatch",".legend",".timebar",".tools","#viewmode","#firstrun",".drawer","#tourbar","#selchip","#layerpop","#vsbadge"];
  function panels(){ var railHidden=document.body.classList.contains("rail-hidden"), out={};
    SEL.forEach(function(s){ document.querySelectorAll(s).forEach(function(e){ var cs=getComputedStyle(e);
      if(cs.display==="none"||cs.visibility==="hidden"||+cs.opacity<0.05||e.hidden) return;
      if((e.classList.contains("rail")&&railHidden)||(e.classList.contains("drawer")&&!e.classList.contains("on"))) return;
      var r=e.getBoundingClientRect(); if(r.width>0&&r.height>0) out[s]=[Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)]; }); });
    return out; }
  function rows(){ var tb=document.querySelector(".timebar"), o={};
    if(!tb||getComputedStyle(tb).display==="none") return null;
    [["#prog","prog"],[".tb-top","top"],["#situation","situation"],["#acts","acts"],[".tb-trackwrap","phases"],[".s3-track","track"]].forEach(function(q){
      var e=tb.querySelector(q[0]); if(!e) return; var cs=getComputedStyle(e); if(cs.display==="none") return; var r=e.getBoundingClientRect(); if(r.height>0) o[q[1]]=Math.round(r.height*10)/10; });
    o.total=Math.round(tb.getBoundingClientRect().height*10)/10; return o; }
  var v3=new THREE.Vector3();
  function targetScreen(){ if(camera.isOrthographicCamera) return null; camera.updateMatrixWorld(true);
    v3.copy(orbitTarget).project(camera); return [(v3.x*0.5+0.5)*innerWidth,(-v3.y*0.5+0.5)*innerHeight]; }
  function inRects(p,R){ for(var k in R){ var r=R[k]; if(p[0]>=r[0]&&p[0]<=r[2]&&p[1]>=r[1]&&p[1]<=r[3]) return k; } return null; }
  function headsUnder(){ var H=window.__aus.headRects(), P=panels(), n=0, list=[], area=0, tot=0;
    H.forEach(function(h){ var r=h.r, a=(r[2]-r[0])*(r[3]-r[1]); tot+=a; var worst=0, by=null;
      for(var k in P){ var q=P[k], ix=Math.max(0,Math.min(r[2],q[2])-Math.max(r[0],q[0])), iy=Math.max(0,Math.min(r[3],q[3])-Math.max(r[1],q[1])); if(ix*iy>worst){ worst=ix*iy; by=k; } }
      /* a head whose box lies partly off screen counts its off-screen part as hidden too */
      var on=Math.max(0,Math.min(r[2],innerWidth)-Math.max(r[0],0))*Math.max(0,Math.min(r[3],innerHeight)-Math.max(r[1],0));
      var hid=Math.min(a,worst+(a-on)); area+=hid; if(hid>0.25*a){ n++; list.push(h.side+" head "+Math.round(100*hid/a)+"% under "+(worst>=a-on?by:"the screen edge")); } });
    return {heads:H.length, hiddenOverQuarter:n, hiddenShare:tot?+(area/tot).toFixed(3):0, list:list}; }
  S3.measure=function(){
    var P=panels(), fr=MAPCAM.freeRect(), W=innerWidth, H=innerHeight, out={level:S3.level, vp:[W,H], unobstructed:window.__aus.unobstructed(),
      panels:P, timebar:rows(), free:{rect:fr, w:fr[2]-fr[0], h:fr[3]-fr[1], share:+(((fr[2]-fr[0])*(fr[3]-fr[1]))/(W*H)).toFixed(4)},
      heads:headsUnder(), layer:ML.stats?{items:ML.stats.items,placed:ML.stats.placed,dropped:ML.stats.dropped,underPanel:ML.stats.underPanel}:null};
    /* the paper map as framed now, and as the field would frame in the free rectangle */
    if(mode==="staff"){ var st=MAPCAM.state(); out.paper={pxPerKm:+(GEOREF.UNITS_PER_KM/st.wpp).toFixed(2), wpp:st.wpp, frameInFree:(window.__aus.paperMap()||{}).frameInFree}; }
    /* the landscape's orbit target, and the same with setViewOffset centring it in the free rectangle */
    var t=targetScreen();
    if(t){ var cx=(fr[0]+fr[2])/2, cy=(fr[1]+fr[3])/2;
      out.target={screen:[Math.round(t[0]),Math.round(t[1])], fromFreeCentre:Math.round(Math.hypot(t[0]-cx,t[1]-cy)), underPanel:inRects(t,P)};
      camera.setViewOffset(W,H,W/2-cx,H/2-cy,W,H); camera.updateProjectionMatrix();
      var t2=targetScreen(), h2=headsUnder(), wpp0=null;
      out.offset={screen:[Math.round(t2[0]),Math.round(t2[1])], fromFreeCentre:Math.round(Math.hypot(t2[0]-cx,t2[1]-cy)), underPanel:inRects(t2,P), heads:h2,
        worldPerPxAtTarget:+worldPerPx(orbitTarget).toFixed(5)};
      camera.clearViewOffset(); camera.updateProjectionMatrix();
      out.offset.worldPerPxAtTargetWithout=+worldPerPx(orbitTarget).toFixed(5);
      requestRender(2); }
    return out; };
  window.__s3=S3;
};

/* the measurements read CSS pixels only (panels, the layer, the free rectangle, projections), so the probe draws at a
   quarter of the pixel ratio (a sixteenth of the software-rendering work) and at 1 only for the screenshots */
const PR=async(page,r)=>page.evaluate(r=>{ renderer.setPixelRatio(r); if(typeof sizeFX==="function") sizeFX(); },r);
async function prep(page,level){ await page.evaluate(`(${PROBE.toString()})()`); await PR(page,0.25); await page.evaluate(l=>window.__s3.dock(l),level); await settle(page); }
async function sizeTo(page,w,h){ await page.setViewportSize({width:w,height:h});
  await page.evaluate(()=>window.dispatchEvent(new Event("resize"))); await page.waitForTimeout(450); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); }

(async()=>{
  const out={when:new Date().toISOString(), levels:NAMES, cases:{}}, shots=opt("--shots"), tiles={};
  if(shots) fs.mkdirSync(shots,{recursive:true});
  const browser=await launch();
  for(const level of LEVELS){
    let page=null, key=null;
    for(const c of cases){
      const k=c.viewport.join("x")+(c.fresh?":"+c.name:"");
      if(k!==key){ if(page) await page.close(); page=await open(browser,c.viewport); await prep(page,level); key=k; }
      if(!c.fresh){ await page.evaluate(s=>window.__aus.apply(s),c); await settle(page); }
      /* the first-run card in a fresh view: at level >= 1 the dispatch is in the rail, so the card no longer hides it */
      const m=await page.evaluate(()=>window.__s3.measure());
      if(shots&&["first-run","overview-field","selected-formation","paper-north-up","paper-laptop","ph8-overview-watch"].includes(c.name)&&(level===0||level===LEVELS[LEVELS.length-1]))
        { await PR(page,1); await settle(page); (tiles[c.name]=tiles[c.name]||[]).push({png:await page.screenshot({timeout:180000}),cap:c.name+" · "+NAMES[level]}); await PR(page,0.25); }
      const vp0=c.viewport; await sizeTo(page,1280,720);
      if(!c.fresh&&c.paper==="frame"){ await page.evaluate(s=>window.__aus.apply(s),c); await settle(page); }
      m.at720=await page.evaluate(()=>window.__s3.measure());
      await sizeTo(page,vp0[0],vp0[1]);
      if(!c.fresh&&c.paper==="frame"){ await page.evaluate(s=>window.__aus.apply(s),c); await settle(page); }
      (out.cases[c.name]=out.cases[c.name]||{})[NAMES[level]]=m;
      console.log(NAMES[level].padEnd(16),c.name.padEnd(20),"free",m.unobstructed,"/",m.at720.unobstructed,"tb",m.timebar&&m.timebar.total,
        "rect",m.free.w+"x"+m.free.h, m.paper?"px/km "+m.paper.pxPerKm+" (720: "+(m.at720.paper&&m.at720.paper.pxPerKm)+")":"",
        m.target?"target "+m.target.fromFreeCentre+"px→"+m.offset.fromFreeCentre+"px"+(m.target.underPanel?" under "+m.target.underPanel:""):"",
        "heads hidden>25% "+m.heads.hiddenOverQuarter+"/"+m.heads.heads, page._errors.length?"ERR "+page._errors.slice(-1):"");
    }
    if(page) await page.close();
  }
  if(opt("--json")) fs.writeFileSync(opt("--json"),JSON.stringify(out,null,1));
  if(shots){ const pg=await open(browser,[1600,900]);
    const T=[]; Object.keys(tiles).forEach(k=>tiles[k].forEach(t=>T.push(t)));
    fs.writeFileSync(path.join(shots,"dock-probe.jpg"),await sheet(pg,T,2,800,450,"Stage 3 Part A: today (left) and the docked layout probe (right)",true));
    await pg.close(); }
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
