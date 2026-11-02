#!/usr/bin/env node
/* Final audit after Stage 8, area a11y: FIRST USE on a visitor's page, by real input (mouse and keys), at a desktop size.
   node tools/audit-post8/a11y/fu.js 1600x900 [short]
   Steps: the first screen (the card); the opening (Begin; Next plays, Next again goes straight there; to the end); Play and pause; a formation
   clicked on the map (its dossier); "How this is sourced" (the sheet; Esc; focus back); "?" (the overlay: focus, Tab containment, the
   shortcuts switch, Esc); the ways back (Esc with focus in the dossier; the dossier's close button by Enter); evidence and reconstruction
   (the grade, the claim tags, the sheet's index). Each step: a screenshot, the focus (with its computed role and name), the visible words. */
"use strict";
const L=require("./alib.js");
const [W,H]=(process.argv[2]||"1600x900").split("x").map(Number);
const SHORT=process.argv[3]==="short";
const tag="fu-"+W+"x"+H;
L.run(tag,async(b,R,log)=>{
  const p=await L.openV(b,[W,H],{});
  R.bootMs=p._bootMs;
  await L.wait(2500);
  const fiAx=async()=>({fi:await L.P(p,()=>__a11y.fi()), ax:await L.ax(p)});
  const st=()=>L.A.state(p);
  /* 1. the first screen */
  await R.shot(p,"01-first-screen");
  R.step("first screen (the card open), at load",Object.assign(await fiAx(),{
    title:await p.title(), card:await L.P(p,()=>__a11y.text("#firstrun")), now:await L.P(p,()=>__a11y.text("#now",1500)),
    caption:await L.P(p,()=>__a11y.text("#tb-cap")), acts:await L.P(p,()=>[...document.querySelectorAll(".act-btn")].map(b=>b.textContent+" | "+b.getAttribute("aria-label"))),
    phases:await L.P(p,()=>[...document.querySelectorAll("#phases button")].map(b=>b.textContent+" | "+(b.getAttribute("aria-label")||""))),
    tools:await L.P(p,()=>[...document.querySelectorAll(".tools button, #viewmode button, .tb-ctrl button, #speedbtn, #eyesbtn, #helpbtn")].filter(e=>__a11y.vis(e)).map(e=>e.textContent.trim()+(e.getAttribute("aria-label")?" ["+e.getAttribute("aria-label")+"]":""))),
    legend:await L.P(p,()=>__a11y.text(".legend",800)), state:await st(),
    targets:await L.P(p,()=>__a11y.targets()), small:await L.P(p,()=>__a11y.small()), cut:await L.P(p,()=>__a11y.cut()), scroll:await L.P(p,()=>__a11y.scroll()),
    panels:await L.P(p,()=>__a11y.panels()), dupIds:await L.P(p,()=>__a11y.ids()), titles:await L.P(p,()=>__a11y.titles())}));
  /* 2. the opening, begun by the card's primary action (real click) */
  await L.click(p,"#fr-tour"); await L.wait(3500);
  await R.shot(p,"02-opening-1");
  const bar=async()=>({n:await L.P(p,()=>__a11y.text("#tour-n")), t:await L.P(p,()=>__a11y.text("#tour-t")), x:await L.P(p,()=>__a11y.text("#tour-x")),
    buttons:await L.P(p,()=>[...document.querySelectorAll("#tourbar button")].filter(e=>__a11y.vis(e)).map(e=>e.textContent.trim())),
    live:await L.P(p,()=>[document.getElementById("live-phase").textContent,document.getElementById("live-map").textContent]),
    caption:await L.P(p,()=>__a11y.text("#tb-cap")), clock:await L.P(p,()=>clock), k:await L.P(p,()=>OPENING.k), playing:await L.P(p,()=>!!OPENING.play)});
  R.step("opening step 1 (real click on the card's primary)",Object.assign(await fiAx(),{bar:await bar(),cut:await L.P(p,()=>__a11y.cut())}));
  const steps=SHORT?1:3;
  for(let k=0;k<steps;k++){
    await L.click(p,"#tour-next"); await L.wait(3000);
    if(k===0) await R.shot(p,"03-opening-playing");
    R.step("opening: Next pressed once (plays at 4x), after 3 s",Object.assign(await fiAx(),{bar:await bar()}));
    await L.click(p,"#tour-next"); await L.wait(3500);
    await R.shot(p,"04-opening-"+(k+2));
    R.step("opening: Next pressed again (straight to the step)",Object.assign(await fiAx(),{bar:await bar()}));
  }
  /* the last step's Next is Finish (or Skip in the short run: Esc by real key) */
  if(SHORT){ await p.keyboard.press("Escape"); } else { await L.click(p,"#tour-next"); }
  await L.wait(3500);
  await R.shot(p,"05-opening-end");
  R.step(SHORT?"opening skipped by Esc":"opening finished (its last Next)",Object.assign(await fiAx(),{state:await st(),live:await L.P(p,()=>document.getElementById("live-phase").textContent),
    now:await L.P(p,()=>__a11y.text("#now",1200)),caption:await L.P(p,()=>__a11y.text("#tb-cap"))}));
  /* 3. Play by real click, then pause */
  await L.click(p,"#play"); await L.wait(6000);
  await R.shot(p,"06-playing");
  R.step("Play (real click), 6 s later",Object.assign(await fiAx(),{state:await st(),caption:await L.P(p,()=>__a11y.text("#tb-cap")),playBtn:await L.P(p,()=>[document.getElementById("play").textContent,document.getElementById("play").getAttribute("aria-pressed"),document.getElementById("play").getAttribute("aria-label")]),
    live:await L.P(p,()=>document.getElementById("live-phase").textContent),toast:await L.P(p,()=>__a11y.text("#toast"))}));
  await L.click(p,"#play"); await L.wait(1500);
  R.step("Pause (real click)",{state:await st(),playBtn:await L.P(p,()=>[document.getElementById("play").textContent,document.getElementById("play").getAttribute("aria-pressed")])});
  /* 4. a formation clicked on the map (the item's box read from the map layer to aim the real click) */
  let tgt=await L.formationTarget(p);
  R.step("formation target chosen (map layer read to aim)",{tgt});
  if(tgt){
    await p.mouse.move(tgt.x,tgt.y); await L.wait(800);
    await p.mouse.click(tgt.x,tgt.y); await L.wait(2500);
    await R.shot(p,"07-dossier");
    R.step("formation clicked (real mouse): its dossier",Object.assign(await fiAx(),{state:await st(),
      dossier:await L.P(p,()=>__a11y.text("#drawer-body",3500)),
      headings:await L.P(p,()=>[...document.querySelectorAll("#drawer-body h2,#drawer-body h3,#drawer-body h4")].map(h=>h.tagName+" "+h.textContent.trim().slice(0,80))),
      tags:await L.P(p,()=>[...document.querySelectorAll("#drawer-body .ltag, #drawer-body .ctag, #drawer-body [class*=claim]")].slice(0,40).map(e=>e.className+": "+e.textContent.trim().slice(0,60))),
      srcBtn:await L.P(p,()=>{ const b=document.querySelector("#drawer-body .src-head button, #drawer-body .dact button"); if(!b) return null; const r=b.getBoundingClientRect(); return {text:b.textContent.trim(),box:[r.left,r.top,r.width,r.height].map(Math.round),vis:__a11y.vis(b)}; }),
      small:await L.P(p,()=>__a11y.small()), cut:await L.P(p,()=>__a11y.cut()), targets:await L.P(p,()=>{ const t=__a11y.targets(); return {n:t.n,fail:t.fail,failing:t.small.filter(x=>x.spacing!=="passes"&&!/ev-mark|button\.step/.test(x.el))}; })}));
    /* 5. How this is sourced: real click, then Esc */
    const sb=await L.center(p,"#drawer-body .src-head button");
    if(sb&&sb.vis){
      await p.mouse.click(sb.x,sb.y); await L.wait(2000);
      await R.shot(p,"08-sources");
      R.step("'How this is sourced' (real click): the sheet",Object.assign(await fiAx(),{head:await L.P(p,()=>__a11y.text("#modal-body",3000)),
        modal:await L.P(p,()=>{ const m=document.getElementById("modal"); return {on:m.classList.contains("on"),ariaModal:m.getAttribute("aria-modal"),label:m.getAttribute("aria-label"),inertOthers:[...document.body.children].filter(k=>k!==m&&k.tagName!=="SCRIPT").map(k=>(k.id||k.className)+":"+(k.inert?"inert":"live")).join(" ")}; }),
        small:await L.P(p,()=>__a11y.small())}));
      /* scroll the sheet's text by keyboard: Tab to the text region, PageDown */
      await p.keyboard.press("Tab"); await L.wait(300);
      const before=await L.P(p,()=>document.getElementById("modal-body").scrollTop);
      await p.keyboard.press("PageDown"); await L.wait(500);
      R.step("in the sheet: Tab, then PageDown (real keys)",Object.assign(await fiAx(),{scroll:[before,await L.P(p,()=>document.getElementById("modal-body").scrollTop)]}));
      await p.keyboard.press("Escape"); await L.wait(1200);
      R.step("Esc (real key): the sheet closed; where focus went",Object.assign(await fiAx(),{state:await st()}));
    }
    /* 6. the ways back: focus in the dossier (its first button focused by script), then Esc by real key */
    await L.P(p,()=>{ const b=document.querySelector("#drawer-body button"); if(b) b.focus(); });
    R.step("set-up: the dossier's first button focused by script",await fiAx());
    await p.keyboard.press("Escape"); await L.wait(1500);
    await R.shot(p,"09-after-esc");
    R.step("Esc (real key) with focus in the dossier: where focus went",Object.assign(await fiAx(),{state:await st(),drawerOn:await L.P(p,()=>document.getElementById("drawer").classList.contains("on"))}));
    /* select again, then the dossier's close button by Enter */
    tgt=await L.formationTarget(p,tgt.id)||await L.formationTarget(p);
    if(tgt){ await p.mouse.click(tgt.x,tgt.y); await L.wait(2000);
      await L.P(p,()=>{ const b=document.getElementById("drawer-close"); if(b) b.focus(); });
      R.step("formation clicked again; set-up: the dossier's close button focused by script",Object.assign(await fiAx(),{drawerOn:await L.P(p,()=>document.getElementById("drawer").classList.contains("on"))}));
      await p.keyboard.press("Enter"); await L.wait(1500);
      R.step("Enter (real key) on the dossier's close button: where focus went",Object.assign(await fiAx(),{state:await st(),drawerOn:await L.P(p,()=>document.getElementById("drawer").classList.contains("on"))}));
      /* and the dossier's Back button */
      await p.mouse.click(tgt.x,tgt.y); await L.wait(2000);
      await L.P(p,()=>{ const b=document.getElementById("drawer-back"); if(b) b.focus(); });
      await p.keyboard.press("Enter"); await L.wait(1500);
      R.step("formation clicked again; set-up: Back focused by script; Enter (real key): where focus went",Object.assign(await fiAx(),{state:await st(),drawerOn:await L.P(p,()=>document.getElementById("drawer").classList.contains("on")),tab:await L.P(p,()=>{ const t=document.querySelector('.tab-btn[aria-selected="true"]'); return t&&t.id; })}));
    }
  }
  /* 7. "?" by real key: the overlay */
  await L.P(p,()=>{ const e=document.activeElement; if(e&&e.blur) e.blur(); });
  await p.keyboard.press("?"); await L.wait(1500);
  await R.shot(p,"10-help");
  const tabs=[];
  for(let i=0;i<4;i++){ await p.keyboard.press("Tab"); await L.wait(200); tabs.push((await L.P(p,()=>__a11y.fi())).el); }
  R.step("'?' (real key) from the page: the overlay; then Tab x4",{afterOpen:null,tabs,help:await L.P(p,()=>__a11y.text("#help",6000)),
    dialog:await L.P(p,()=>{ const h=document.getElementById("help"); return {hidden:h.hidden,ariaModal:h.getAttribute("aria-modal"),labelledby:h.getAttribute("aria-labelledby")}; }),
    helpbtn:await L.P(p,()=>{ const b=document.getElementById("helpbtn"); return {haspopup:b.getAttribute("aria-haspopup"),expanded:b.getAttribute("aria-expanded")}; }),
    small:await L.P(p,()=>__a11y.small())});
  /* the shortcuts switch: focus it by Tab (it is the second stop), Space, then Esc, then "2" must do nothing */
  await L.P(p,()=>document.getElementById("help-keys").focus());
  await p.keyboard.press("Space"); await L.wait(400);
  R.step("set-up: the switch focused by script; Space (real key)",Object.assign(await fiAx(),{pressed:await L.P(p,()=>document.getElementById("help-keys").getAttribute("aria-pressed")),note:await L.P(p,()=>__a11y.text("#help-keys-d"))}));
  await p.keyboard.press("Escape"); await L.wait(800);
  const pres0=(await st()).presentation;
  await p.keyboard.press("2"); await L.wait(800);
  R.step("Esc, then '2' (real keys) with the shortcuts off",Object.assign(await fiAx(),{presentationBefore:pres0,presentationAfter:(await st()).presentation}));
  /* restore the switch by real input: ? cannot open the overlay with shortcuts off; the ? button by real click */
  await L.click(p,"#helpbtn"); await L.wait(800);
  await L.P(p,()=>document.getElementById("help-keys").focus()); await p.keyboard.press("Space"); await p.keyboard.press("Escape"); await L.wait(600);
  R.step("the ? button (real click), the switch back on (Space), Esc",Object.assign(await fiAx(),{pressed:await L.P(p,()=>document.getElementById("help-keys").getAttribute("aria-pressed"))}));
  /* 8. evidence and reconstruction: the sources sheet from the rail's button (real click), its first screen and the claims index */
  const srcb=await L.center(p,"#srcbtn");
  if(srcb&&srcb.vis){ await p.mouse.click(srcb.x,srcb.y); await L.wait(2000);
    await R.shot(p,"11-sources-sheet");
    R.step("'Accuracy and sources' (real click in the rail)",Object.assign(await fiAx(),{text:await L.P(p,()=>__a11y.text("#modal-body",9000)),
      headings:await L.P(p,()=>[...document.querySelectorAll("#modal-body h2,#modal-body h3,#modal-body h4")].map(h=>h.tagName+" "+h.textContent.trim().slice(0,90)))}));
    await p.keyboard.press("Escape"); await L.wait(800);
    R.step("Esc: focus",await fiAx());
  }
  R.console=p._log.slice(0,40);
});
