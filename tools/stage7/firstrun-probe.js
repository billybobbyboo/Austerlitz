#!/usr/bin/env node
/* Stage 7 Part A (docs/STAGE7_SPEC.md section 1): what a first-time visitor meets today, read from the running page.
   node tools/stage7/firstrun-probe.js [--json f] [--sheet f] [--title t] [--only screens,ways,count,narrow]
   screens  a fresh page at 1600 x 900, 1366 x 768, 1280 x 720, 1024 x 768 and 390 x 844, and at 1600 x 900 under reduced motion and
            without ?harness=1 (a visitor's page): the clock, the computed sun, the light, the valley fog and the smoke at that clock; the
            camera; the card (its text, buttons, ARIA, focus); what is shown and hidden; the unobstructed fraction; drops, map text as
            rendered, darkness, the smoke's and the confidence marks' shares; draw calls and the world pass
   ways     each way out of the card, each on a fresh page at 1600 x 900: its three buttons by a real click; a click on the map; the keys
            2, Space, "?", Esc; Tab from a fresh page (where focus goes); a reload after closing (does the card come back; what is stored)
   count    the ways into the day, counted as the audit counted them (docs/VISUAL_AUDIT.md:44-46), now
   narrow   (only when named) at 1024 x 768, the dispatch card's box once the first-run card is closed, against the card's box
   Measurement only: nothing here is the Stage 7 design, and nothing is written to a source file. */
const fs=require("fs"), path=require("path");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ONLY=(opt("--only")||"screens,ways,count").split(",");
const OUT=opt("--json")||path.join(L.EVID7,"firstrun-probe.json"), SHEET=opt("--sheet")||path.join(L.EVID7,"firstrun-sheet.jpg");
const res=fs.existsSync(OUT)?JSON.parse(fs.readFileSync(OUT,"utf8")):{};
const save=()=>fs.writeFileSync(OUT,JSON.stringify(res,null,1));

/* everything the page says about its first screen (read, not changed) */
const STATE=()=>{
  var fr=document.getElementById("firstrun"), r=fr&&!fr.hidden?fr.getBoundingClientRect():null, s=SUN_DAY.at(clock), Ln=LIGHT_NOW||{};
  function shown(q){ var e=document.querySelector(q); if(!e) return null; var cs=getComputedStyle(e); if(e.hidden||cs.display==="none"||cs.visibility==="hidden") return false;
    if(q===".rail"&&document.body.classList.contains("rail-hidden")) return false; var b=e.getBoundingClientRect(); return b.width>0&&b.height>0; }
  function box(q){ var e=document.querySelector(q); if(!e||!shown(q)) return null; var b=e.getBoundingClientRect(); return [Math.round(b.left),Math.round(b.top),Math.round(b.width),Math.round(b.height)]; }
  var ae=document.activeElement, tab=document.querySelector(".tab-btn[aria-selected='true']");
  var fights=Object.keys(units).filter(function(id){ return smokeAmount(id,clock)>0; });
  /* the light's rows: lightAt clamps the altitude to the table's first row (-18 degrees), so the night light is the predawn row */
  var rows=s.am?LIGHT_BY_ALT.am:LIGHT_BY_ALT.pm, row=rows[0][1]; rows.forEach(function(q){ if(Math.max(rows[0][0],s.alt)>=q[0]) row=q[1]; });
  return {
    clock:clock, clockText:fmtClock(clock), phase:curPhase, playing:playing, speed:speed, presentation:presentation, mode:mode, factor:DISPLAY.factor,
    rm:RM, harness:HARNESS,
    sun:{alt:+s.alt.toFixed(2),geo:+s.geo.toFixed(2),az:+s.az.toFixed(1),twilight:+(Ln.twilight||0).toFixed(3),disc:+(Ln.disc||0).toFixed(3),discShown:!!(sunDisc&&sunDisc.material.opacity>0),row:row,
      sunrise:(function(){ for(var t=300;t<720;t++) if(SUN_DAY.at(t).geo>-0.833) return fmtClock(t); return null; })()},
    fog:{amount:+fogAmount(clock).toFixed(3),cap:+fogCap(fogAmount(clock)).toFixed(3),top:+fogTop(fogAmount(clock)).toFixed(1),mist:PHASES[curPhase].mist},
    smoke:{fighting:fights.length,ids:fights.slice(0,8),share:SMOKE.share},
    camera:{pos:landCam.position.toArray().map(function(v){ return +v.toFixed(1); }),tgt:orbitTarget.toArray().map(function(v){ return +v.toFixed(1); }),
      dist:+landCam.position.distanceTo(orbitTarget).toFixed(1),clearance:+(landCam.position.y-camGround(landCam.position.x,landCam.position.z)).toFixed(1),
      vantage:curVantage,freeCam:freeCam,follow:!freeCam,haze:+ATMO.u.uAtmoB.value.w.toFixed(2)},
    card:fr?{open:typeof firstRunOpen!=="undefined"&&firstRunOpen,hidden:fr.hidden,box:r?[Math.round(r.left),Math.round(r.top),Math.round(r.width),Math.round(r.height)]:null,
      role:fr.getAttribute("role"),labelledby:fr.getAttribute("aria-labelledby"),describedby:fr.getAttribute("aria-describedby"),modal:fr.getAttribute("aria-modal"),
      tabindex:fr.getAttribute("tabindex"),title:(document.getElementById("fr-title")||{}).textContent,
      key:(document.getElementById("fr-key")||{}).textContent.replace(/\s+/g," ").trim(),hint:((fr.querySelector(".fr-hint")||{}).textContent||"").replace(/\s+/g," ").trim(),
      buttons:[].map.call(fr.querySelectorAll("button"),function(b){ var q=b.getBoundingClientRect(); return {id:b.id,text:b.textContent,h:Math.round(q.height),w:Math.round(q.width)}; })}:null,
    focus:ae?(ae.id||ae.tagName.toLowerCase()+(ae.className&&typeof ae.className==="string"?"."+ae.className.split(" ")[0]:"")):null,
    focusInCard:!!(ae&&fr&&fr.contains(ae)),
    shown:{rail:shown(".rail"),dispatch:shown(".dispatch"),legend:shown(".legend"),legendOpen:typeof ML!=="undefined"?ML.legendOpen:null,drawer:shown(".drawer"),tools:shown(".tools"),
      viewmode:shown("#viewmode"),timebar:shown(".timebar"),tourbar:shown("#tourbar"),selchip:shown("#selchip"),vsbadge:shown("#vsbadge"),help:shown("#help"),
      tab:tab?tab.dataset.t:null,docked:docked,railHidden:document.body.classList.contains("rail-hidden"),bodyClasses:document.body.className},
    boxes:{rail:box(".rail"),timebar:box(".timebar"),tools:box(".tools"),viewmode:box("#viewmode"),legend:box(".legend"),dispatch:box(".dispatch"),tourbar:box("#tourbar")},
    live:(function(){ var e=document.getElementById("live-phase"); return e?{text:e.textContent,aria:e.getAttribute("aria-live")}:null; })(),
    tourStep:tourStep, chapter:chapter, plan:planSide, selection:selection?selection.kind+":"+selection.id:null,
    storage:(function(){ var o={}; try{ o.local=Object.keys(localStorage); o.session=Object.keys(sessionStorage); }catch(e){ o.error=String(e); } return o; })()
  };
};
const COUNT=()=>{
  var marks=document.querySelectorAll("#evmarks .ev-mark").length, bars=document.querySelectorAll("#evmarks .ev-bar, .ev-bar").length;
  var starts={}; EVENTS.forEach(function(e){ starts[Array.isArray(e.t)?e.t[0]:e.t]=1; });
  return {tourStops:TOUR.length, play:1, speeds:document.querySelectorAll(".spd-btn").length, phases:PHASES.length, acts:ACTS.length, events:EVENTS.length,
    eventMarkers:marks, intervalBars:bars, distinctStarts:Object.keys(starts).length, themes:ANALYSIS.length, vantages:Object.keys(VANTAGE).length,
    vantageButtons:[].map.call(document.querySelectorAll(".van-btn"),function(b){ return b.dataset.v+(b.hidden?" (hidden)":"")+(b.getAttribute("aria-pressed")==="true"?" (pressed)":""); }), presentations:Object.keys(LABELS.presentation).length, grounds:Object.keys(LABELS.ground).length,
    railTabs:[].map.call(document.querySelectorAll(".tab-btn"),function(b){ return b.dataset.t+(b.hidden?" (hidden)":""); }),
    keysRows:KEYS.length, keyGroups:KEYS.map(function(k){ return k.group; }).filter(function(g,i,a){ return a.indexOf(g)===i; }),
    plans:document.querySelectorAll(".plan-btn").length, follow:!!document.getElementById("follow"),
    eyes:document.querySelectorAll(".cmdpick button").length,
    focusable:[].filter.call(document.querySelectorAll("button,a[href],input,select,textarea,[tabindex]:not([tabindex='-1'])"),function(e){ var cs=getComputedStyle(e); var r=e.getBoundingClientRect();
      return !e.disabled&&cs.visibility!=="hidden"&&cs.display!=="none"&&r.width>0&&r.height>0&&!e.closest("[hidden]"); }).length};
};

(async()=>{
  const browser=await L.launch();
  if(ONLY.includes("screens")){
    res.screens=res.screens||{};
    const V=[["1600x900",[1600,900],{}],["1366x768",[1366,768],{}],["1280x720",[1280,720],{}],["1024x768",[1024,768],{}],["390x844",[390,844],{}],
      ["1600x900-rm",[1600,900],{rm:true}],["1600x900-visitor",[1600,900],{harness:false}]];
    const tiles=[];
    for(const [k,vp,o] of V){
      const page=await L.open(browser,vp,o);
      const st=await page.evaluate(STATE);
      /* the first-run limits are the harness's (tools/visual/thresholds.js): first-run 12 at 1600 x 900, first-run-laptop 16 at 1366 x 768;
         the other sizes have no first-run case: held against the larger of the two, stated */
      const lim=k.startsWith("1600")?L.TH.DROP_LIMIT["first-run"]:(k==="1366x768"?L.TH.DROP_LIMIT["first-run-laptop"]:16);
      const f=await L.frame(page,lim,{noConf:o.harness===false});
      res.screens[k]=Object.assign({vp,loadMs:page._loadMs,errors:page._errors},st,{frame:L.strip(f)});
      tiles.push({png:f.png,cap:k+": unobstructed "+(100*f.unobstructed).toFixed(1)+"%, drops "+f.layer.dropped});
      console.log(k,"load",page._loadMs,"ms","clock",st.clockText,"sun",st.sun.alt,"fog",st.fog.amount,"cam",st.camera.dist,"free",f.unobstructed,"drops",f.layer.dropped,"text",f.text.min,"conf",f.conf,"calls",f.cost.calls);
      save(); await page.close();
    }
    const pg=await L.open(browser,[1600,900]);
    fs.writeFileSync(SHEET,await L.sheet(pg,tiles,4,400,250,opt("--title")||"Stage 7 Part A: the first screen today (fresh pages)",true));
    await pg.close();
  }
  if(ONLY.includes("count")){
    const page=await L.open(browser,[1600,900]);
    res.count=await page.evaluate(COUNT); console.log("count",JSON.stringify(res.count)); save(); await page.close();
  }
  if(ONLY.includes("ways")){
    res.ways=res.ways||{};
    /* each way on a fresh page; the state just after, and again after the camera's glide (if any) has run its course */
    const W=[
      ["button: Guided tour", p=>p.click("#fr-tour")],
      ["button: Watch the battle", p=>p.click("#fr-watch")],
      ["button: Explore", p=>p.click("#fr-close")],
      ["a click on the map", p=>p.mouse.click(1000,250)],
      ["key 2", p=>p.keyboard.press("2")],
      ["key Space", p=>p.keyboard.press(" ")],
      ["key ?", p=>p.keyboard.press("?")],
      ["key Esc", p=>p.keyboard.press("Escape")],
      ["key ArrowRight", p=>p.keyboard.press("ArrowRight")],
      ["Tab x8", async p=>{ const seq=[]; for(let i=0;i<8;i++){ await p.keyboard.press("Tab"); seq.push(await p.evaluate(()=>{ var a=document.activeElement, fr=document.getElementById("firstrun");
        return (a.id||a.tagName.toLowerCase()+"."+(a.className||"").split(" ")[0])+(fr.contains(a)?" [card]":""); })); } return seq; }]
    ];
    for(const [k,fn] of W){
      if(res.ways[k]&&!argv.includes("--redo")) continue;
      const page=await L.open(browser,[1600,900]);
      /* a button the card no longer has (7B removed "Watch the battle") is recorded as absent */
      const bid=(k.startsWith("button: ")?{"button: Guided tour":"#fr-tour","button: Watch the battle":"#fr-watch","button: Explore":"#fr-close"}[k]:null);
      if(bid&&!await page.$(bid)){ res.ways[k]={absent:true}; console.log(k,"-> absent"); save(); await page.close(); continue; }
      const before=await page.evaluate(STATE);
      const extra=await fn(page);
      await page.waitForTimeout(300);
      const after=await page.evaluate(STATE);
      await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(60)); await page.waitForTimeout(2000);   /* a glide (1.6 s) and a phase change run on */
      const later=await page.evaluate(STATE);
      const pick=s=>({clock:s.clockText,playing:s.playing,speed:s.speed,presentation:s.presentation,tab:s.shown.tab,cardOpen:s.card.open,focus:s.focus,focusInCard:s.focusInCard,
        dispatch:s.shown.dispatch,legend:s.shown.legend,legendOpen:s.shown.legendOpen,tourbar:s.shown.tourbar,help:s.shown.help,rail:s.shown.rail,tourStep:s.tourStep,
        camera:s.camera,storage:s.storage});
      res.ways[k]={before:pick(before),after:pick(after),later:pick(later),extra:extra||null,errors:page._errors};
      console.log(k,"->",JSON.stringify(pick(later)).slice(0,300));
      save(); await page.close();
    }
    if(!res.ways.reload||argv.includes("--redo")){
      const page=await L.open(browser,[1600,900]);
      await page.click("#fr-close"); await page.waitForTimeout(300);
      const st0=await page.evaluate(STATE);
      await page.reload({waitUntil:"commit"});
      await require("../visual/three-route.js").waitBoot(page,240000,250);   /* roadmap step 3: a failed start reported at once */
      const st1=await page.evaluate(STATE);
      res.ways.reload={beforeReload:{cardOpen:st0.card.open,storage:st0.storage},afterReload:{cardOpen:st1.card.open,storage:st1.storage,clock:st1.clockText}};
      console.log("reload",JSON.stringify(res.ways.reload)); save(); await page.close();
    }
  }
  if(ONLY.includes("narrow")){
    /* below 1080 px the dispatch is a card again (decision 58): where it stands once the first-run card is closed, against the card's box */
    const page=await L.open(browser,[1024,768]);
    res.narrow=await page.evaluate(()=>{ var b=function(e){ var r=e.getBoundingClientRect(); return [r.left,r.top,r.width,r.height].map(Math.round); };
      var card=b(document.getElementById("firstrun")); closeFirst(null); var d=b(document.querySelector(".dispatch"));
      var ox=Math.max(0,Math.min(card[0]+card[2],d[0]+d[2])-Math.max(card[0],d[0])), oy=Math.max(0,Math.min(card[1]+card[3],d[1]+d[3])-Math.max(card[1],d[1]));
      return {vp:[1024,768],docked:docked,card:card,dispatch:d,overlap:[ox,oy]}; });
    console.log("narrow",JSON.stringify(res.narrow)); save(); await page.close();
    /* what the first screen names: every map-layer item placed, with its text (is the Pratzen named, and how?) */
    res.names={};
    for(const vp of [[1600,900],[1366,768],[1280,720],[1024,768],[390,844]]){
      const pg=await L.open(browser,vp); await L.settle(pg);
      res.names[vp.join("x")]=await pg.evaluate(()=>{ mlLayout(); var out=[];
        Object.keys(ML.items).forEach(function(k){ var it=ML.items[k]; if(it.eFrame===ML.frame&&it.state==="on") out.push(k+": "+(it.el.textContent||"").replace(/\s+/g," ").trim().slice(0,60)); });
        return {placed:out,dropped:ML.stats.dropped_.slice(),plateau:(ML.items["p:plateau"]&&ML.items["p:plateau"].state==="on")?ML.items["p:plateau"].el.textContent.replace(/\s+/g," ").trim():null}; });
      console.log("names",vp.join("x"),JSON.stringify(res.names[vp.join("x")]).slice(0,600)); save(); await pg.close();
    }
  }
  await browser.close();
})();
