/* Roadmap step 6 Part A (docs/STEP6_SPEC.md section 4.3): phone layouts prototyped for measurement only. Each is CSS and a little JS that
   tools/step6/phone-probe.js injects into the live page after it has started; nothing here is in the source or the build, and nothing is a
   design decided: these are the shapes the owner's questions ask about, built far enough to be measured (sizes, cuts, targets, contrast).
   Every rule applies only on a phone-sized screen (max-width 720 px, or max-height 430 px held landscape; the compact timeline only below 720
   px wide), so the layouts the harness holds above that are untouched. Each default rule stands before its media block (a first version had
   it after, and the added buttons never showed: its compact run is superseded). The words are the build's own: no text is written or rewritten here; a control the prototype adds takes an
   existing control's words (the speed button shows the speed the build shows); the two new names, "Menu" and the grip's "Open the card", are
   placeholders of the prototype, not words decided (LABELS is the owner's).
   - compact: the timeline as two rows: the transport (event back, Play, event forward, Follow), the clock, the speed as one button that
     steps through the build's four speeds, "?"; then the caption on its own line; the track without the act row and without the phase labels
     (the phases stay as presses, each with its accessible name); the ten-minute steps and "Whose eyes?" leave the timeline (the slider and
     the event steps remain; "Whose eyes?" stays in the Command tab).
   - sheets: compact, and the dispatch card, the dossier, the rail and the first-run card as sheets across the foot of the screen above the
     timeline, each scrolling inside: the dispatch collapsed to 22% of the screen's height with a grip that opens it to 60%; the dossier at
     most 55%, the rail 60%, the first-run card 50%.
   - menu: sheets, and the tools and the presentation switch folded behind one "Menu" button at the top right (the Watch presentation keeps
     its switch in the timeline, as the build does). */
const PHONE="@media (max-width:720px), (max-height:430px)";
/* the compact timeline only where the screen is narrow: held landscape (844 x 390) the build's own timeline is one row already (90.5 px) */
const NARROW="@media (max-width:720px)";
const COMPACT=`#ph-speed{display:none}
${NARROW}{
  .tb-top{flex-wrap:wrap;row-gap:2px;column-gap:6px;padding:4px 8px 0}
  .tb-ctrl{gap:4px;flex:0 0 auto;order:1}
  #prev,#next{display:none}
  .speeds{display:none}
  #eyesbtn{display:none}
  .tb-icon,.tb-play,.tb-follow,#ph-speed{min-height:40px}
  .tb-icon{min-width:40px}
  #ph-speed{display:inline-block;min-width:44px;order:3}
  .clockbox{order:2}
  .tb-cap{order:5;flex:1 1 calc(100% - 50px);min-width:0;padding:0 2px}
  #helpbtn{order:6;min-width:36px;min-height:32px}
  .tb-trackwrap{height:48px;margin:0 8px}
  .tb-acts{display:none}
  .tb-track{top:0;height:24px}
  #phases .step{height:24px}
  #phases .step .step-l{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  .timerail,.evmarks{top:24px}
}`;
/* the sheets: the dispatch card collapsed to its head (a press on its grip opens it to 60% of the screen), the dossier and the rail at most
   55% and 60%, the first-run card across the foot; each scrolls inside */
const SHEETS=`#ph-grip{display:none}
${PHONE}{
  .dispatch,body:not(.rail-hidden) .dispatch{left:0!important;right:0!important;width:auto!important;bottom:var(--tb)!important;max-height:22vh!important;
    overflow:hidden!important;border-left:0;border-top:2px solid var(--accent);padding:22px 14px 8px}
  body.ph-sheet-open .dispatch{max-height:60vh!important;overflow-y:auto!important}
  #ph-grip{display:block;position:absolute;left:50%;top:0;transform:translateX(-50%);width:64px;height:24px;margin:0;padding:0;background:none;border:0;cursor:pointer}
  #ph-grip::before{content:"";display:block;width:36px;height:4px;margin:10px auto;border-radius:2px;background:var(--text-muted)}
  .drawer{left:0;right:0;width:auto;top:auto;bottom:var(--tb);height:55vh;border-left:0;border-top:1px solid var(--line-2);transform:translateY(100%)}
  .drawer.on{transform:translateY(0)}
  #firstrun,body.rail-hidden #firstrun{left:0!important;right:0;width:auto!important;transform:none!important;bottom:var(--tb)!important;max-height:50vh;overflow-y:auto;
    padding:14px 16px 12px;border-left:0;border-right:0}
  .rail{right:0;width:auto;top:auto;bottom:var(--tb);max-height:60vh;border-right:0;border-top:1px solid var(--line);transform:translateY(0)}
  body.rail-hidden .rail{transform:translateY(100%)}
}`;
const MENU=`#ph-menu{display:none}
${PHONE}{
  #ph-menu{display:inline-block;position:fixed;top:10px;right:10px;z-index:43;min-width:44px;min-height:44px}
  .tools{top:62px;right:10px;left:10px;align-items:stretch;background:rgba(var(--scrim-rgb),.96);border:1px solid var(--line-2);padding:10px;display:none}
  body.ph-menu-open .tools{display:flex}
  .tools .grp{max-width:none;justify-content:flex-start}
  .tools .t{min-height:44px}
  body:not(.pm-watch) #viewmode{display:none}
  body.ph-menu-open:not(.pm-watch) #viewmode{display:flex;top:auto;left:10px;right:10px;transform:none;position:fixed;bottom:calc(var(--tb) + 10px)}
  body.ph-menu-open .vm-btn{min-height:44px;flex:1 1 0}
}`;
/* the speed as one button: each press the next of the build's own four speed buttons (their words and their handlers) */
function speedJS(){
  if(document.getElementById("ph-speed")) return;
  var b=document.createElement("button"); b.id="ph-speed"; b.className="t"; b.type="button";
  var S=[].slice.call(document.querySelectorAll(".spd-btn"));
  function paint(){ var on=S.find(function(x){ return x.getAttribute("aria-pressed")==="true"; })||S[0]; b.textContent=on.textContent; b.setAttribute("aria-label","Playback speed "+on.textContent); }
  b.addEventListener("click",function(){ var i=S.findIndex(function(x){ return x.getAttribute("aria-pressed")==="true"; }); S[(i+1)%S.length].click(); paint(); });
  paint(); var c=document.querySelector(".clockbox"); c.parentNode.insertBefore(b,c.nextSibling);
}
/* the dispatch sheet's grip: open or closed (its name is a placeholder of this prototype, not a decided word) */
function gripJS(){
  var d=document.querySelector(".dispatch"); if(!d||document.getElementById("ph-grip")) return;
  var b=document.createElement("button"); b.id="ph-grip"; b.type="button"; b.setAttribute("aria-expanded","false"); b.setAttribute("aria-label","Open the card");
  b.addEventListener("click",function(){ var on=!document.body.classList.contains("ph-sheet-open"); document.body.classList.toggle("ph-sheet-open",on); b.setAttribute("aria-expanded",String(on)); });
  d.insertBefore(b,d.firstChild);
}
function menuJS(){
  if(document.getElementById("ph-menu")) return;
  var b=document.createElement("button"); b.id="ph-menu"; b.className="t"; b.type="button"; b.textContent="Menu"; b.setAttribute("aria-expanded","false");
  b.addEventListener("click",function(){ var on=!document.body.classList.contains("ph-menu-open"); document.body.classList.toggle("ph-menu-open",on); b.setAttribute("aria-expanded",String(on)); });
  document.body.appendChild(b);
  /* a press on any tool closes the menu (the Layers panel and the sheets open over the map, not under the menu); heard in the capture phase,
     since the Layers button stops its click's propagation (app.js:5766): a first version listened in the bubble phase and the menu stayed open
     over the Layers panel (its layers and paper states re-measured, phone-menu-layers.json) */
  document.querySelector(".tools").addEventListener("click",function(){ document.body.classList.remove("ph-menu-open"); b.setAttribute("aria-expanded","false"); },true);
}
async function inject(page,css,js){
  await page.addStyleTag({content:css});
  for(const f of js) await page.evaluate("("+f.toString()+")()");
  await page.evaluate(()=>{ if(typeof syncTimebarHeight==="function") syncTimebarHeight(); requestRender(3); });
}
module.exports={
  compact:{note:"the compact timeline (prototype, injected by the probe)", apply:p=>inject(p,COMPACT,[speedJS])},
  sheets:{note:"the compact timeline and the panels as sheets at the foot (prototype)", apply:p=>inject(p,COMPACT+SHEETS,[speedJS,gripJS])},
  menu:{note:"the compact timeline, the sheets and the controls behind a Menu button (prototype)", apply:p=>inject(p,COMPACT+SHEETS+MENU,[speedJS,gripJS,menuJS])}
};
