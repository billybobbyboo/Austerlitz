/* Known residuals, carried openly from Stage 0 into Stage 2 (the counter layer). Keyed to the exact
   case and pair, so any other overlap still fails. Remove each entry when it is fixed.
   Removed in the chronology data task: hybrid-dimmed, Walther's and Nansouty's counters (Cavalry Reserve,
   both dimmed) at the left screen edge, which the Stage 0 fallback (20 positions, then 80% and 64% size)
   could not place. The fallback then tried a wider ring of positions after those 20 (app.js, declutter),
   and the case had no overlap. Stage 2D replaces that fallback with the map layer, which places every item
   clear of every other. There is no known residual. */
const KNOWN={};
module.exports.KNOWN=KNOWN;
/* Stage 2D (docs/STAGE2_SPEC.md section J; owner decisions 24, 29, 38 and 39). Each limit is what the Stage 0 canvas pass
   hid in that view, re-measured on the Stage 2C build (archive/stage2c-68ac7721.html, tools/stage2/dom-layer.js "canvas
   today"; section F.3's earlier counts, on the Stage 1B build, were 12, 14, 10, 10, 9, 9, 7, 21, 5, 11, 10): the map layer
   may drop no more in that view (decision 39). */
const DROP_LIMIT={"first-run":12,"first-run-laptop":16,"overview-field":11,"overview-plan":12,"close-sokolnitz":18,"staff-paper":13,
  "pratzen-low":13,"pratzen-orbit-min":27,"selected-formation":3,"watch-selected":8,"hybrid-dimmed":13,"pratzen-low-1x":12,"pratzen-low-10x":8,
  /* Stage 2E: the four paper-map views are new, and the 2C build has no plan camera. tools/stage2/paper-limits.js reproduces
     each on the 2C build (its own camera straight down, north up, at the 2E view's centre and scale) and counts what the 2C
     canvas pass hides there, with the 2C panels moved to where the 2E panels stand ("matched"). With the 2C build's own
     panels (the method used above) the counts are 19, 3, 3 and 0: its 587 px legend covers ground the 2E legend leaves free,
     and the 2C pass counts an item under a panel as neither shown nor hidden, so at 1280 x 720, where that legend covers the
     whole framed field, it hides nothing by construction. The matched counts are the limits (CHANGELOG.md, Stage 2E). */
  "paper-north-up":20,"paper-close":2,"paper-drawer":5,"paper-laptop":21,
  /* Stage 3B: narrow-1024 (the undocked layout, decision 58) has no 2C count; its limit is what the map layer drops there on the
     build before 3B (the Stage 2F build, ee4390a2), so 3B, which leaves that layout as it was, may drop no more */
  "narrow-1024":5,
  /* Stage 3C: the two phase-8 Overview views are new; their limits are the main method's, what the Stage 2C canvas pass hides there
     (tools/stage2/dom-layer.js "today", AUSTERLITZ_HTML=archive/stage2c-68ac7721.html, which gives overview-field's 11 again) */
  "ph8-overview-study":7,"ph8-overview-watch":7};
/* Stage 3D: the view offset puts the orbit target at the free rectangle's centre, and two views then show ground their panels
   had covered, where one more place name finds no room beside its marker: selected-formation 4 (was limit 3), narrow-1024 6
   (was 5). The same framing on the Stage 3C build (tools/stage3/offset-limits.js --prev) drops the same items, 4 and 6: the
   framing adds them, not the layer. Re-derived by Stage 2E's method the 2C canvas pass hides 10 (matched panels; 7 native)
   and 23 there; the owner chose the tight count, the previous build's in the same framing (the method 3B used for
   narrow-1024), so that any further drop fails (docs/stage3-evidence/offset-limits.json; CHANGELOG.md, Stage 3D). */
DROP_LIMIT["selected-formation"]=4; DROP_LIMIT["narrow-1024"]=6;
/* Stage 5E (docs/STAGE5_SPEC.md section D.6): the eye-level views are new; their limits are what the 5E build drops there (place names on
   the horizon: Goldbach, Telnitz, Sokolnitz, Satschan, Kobelnitz, and at 1x Menitz), never raised (as decision 62 set the 3D framing's) */
DROP_LIMIT["eye-zuran"]=5; DROP_LIMIT["eye-zuran-1x"]=6;
/* Stage 5F (decision 94): the Plans tab, both plans, at the Overview: what the 5F build drops there (ten place names and the Allied
   headquarters' name), never raised; the Plans tab itself is unchanged (its fix is a task after Stage 5) */
DROP_LIMIT["plans-overview"]=11;
/* Stage 7B (owner decision 122): narrow-390, the first screen at 390 x 844, is new; its limit is what the 7B build drops there (the Allied
   headquarters' and the Fifth Column's names, Pratzen, Stare Vinohrady, Santon, Zuran), never raised */
DROP_LIMIT["narrow-390"]=6;
/* section H: the unobstructed share of the viewport on the Stage 2C build, at the case's viewport and at 1280 x 720, measured
   by this harness (CSS transitions off, the panels at rest). It must not fall. These equal tools/stage2/map-text.js's values
   in every view but one: selected-formation at 1280 x 720 is 6.97% at rest, where map-text.js reported 15.1% with the
   dossier drawer frozen at the start of its slide, almost wholly off screen (CHANGELOG.md, Stage 2D). */
/* Stage 3B (docs/STAGE3_SPEC.md section H): raised to what the 3B build measures (the dispatch in the rail's Now tab, the dossier
   in the rail's column, the legend closed by default), rounded down to 0.1 point, so no later part can give it back; never
   below the Stage 2C value it replaces. The Stage 2C baselines (at 1600 x 900 or the case's viewport / 1280 x 720) were:
   first-run .5442/.4391, first-run-laptop .4831/.4391, overview-field .3028/.1511, overview-plan and close-sokolnitz
   .8045/.7987, staff-paper .3028/.1511, pratzen-low, pratzen-orbit-min, pratzen-low-1x and pratzen-low-10x .8045/.7709,
   selected-formation .1477/.0697, watch-selected .7844/.732, hybrid-dimmed .7869/.7434, paper-north-up .3028/.1511,
   paper-close .3028/.1626, paper-drawer .1477/.0697, paper-laptop .1511/.1511; narrow-1024 (new in 3B) .4845/.4389 on the
   Stage 2F build. The views 3B does not change (Watch, the first run, the undocked view at its own size) keep their values. */
/* Stage 3C (section H): raised again to what the 3C build measures (the one timeline of 90.5 px, 92 in Watch), rounded down to
   0.1 point; the two phase-8 views are new and take their 3C values. The Stage 3B baselines were: first-run .5442/.4391,
   first-run-laptop .4831/.4391, overview-field, staff-paper, selected-formation and the paper views .631/.577, overview-plan and
   close-sokolnitz .8045/.7987, pratzen-low, pratzen-orbit-min, pratzen-low-1x and pratzen-low-10x .8045/.7709, watch-selected
   .7844/.732, hybrid-dimmed .7869/.7434, paper-laptop .577/.577, narrow-1024 .4845/.577. */
const UNOBSTRUCTED={"first-run":[0.614,0.49],"first-run-laptop":[0.531,0.49],"overview-field":[0.703,0.628],"overview-plan":[0.897,0.872],
  "close-sokolnitz":[0.897,0.872],"staff-paper":[0.703,0.628],"pratzen-low":[0.897,0.872],"pratzen-orbit-min":[0.897,0.872],
  "selected-formation":[0.703,0.628],"watch-selected":[0.879,0.833],"hybrid-dimmed":[0.881,0.847],"pratzen-low-1x":[0.897,0.872],
  "pratzen-low-10x":[0.897,0.872],"paper-north-up":[0.703,0.628],"paper-close":[0.703,0.628],"paper-drawer":[0.703,0.628],"paper-laptop":[0.628,0.628],
  "narrow-1024":[0.535,0.628],"ph8-overview-study":[0.703,0.628],"ph8-overview-watch":[0.897,0.872]};
/* Stage 7B (docs/STAGE7_SPEC.md section 6; decisions 111, 120, 122): the first-run card without its hint and "Watch the battle" is 49 px
   shorter. first-run and first-run-laptop are raised to what the 7B build measures, rounded down to 0.1 point (the 3B and 3C method), so no
   later part can give the gain back: they were .614/.49 and .531/.49 (3C). narrow-390 is new, its baselines the 7B build's (at 1280 x 720
   the resized page docks, as every case's second measure does) */
UNOBSTRUCTED["first-run"]=[0.634,0.520]; UNOBSTRUCTED["first-run-laptop"]=[0.558,0.520]; UNOBSTRUCTED["narrow-390"]=[0.468,0.520];
const LAYER_MS=8;   /* section J's budget for one pass at 1600 x 900 on the harness machine */
/* Stage 2E (section J, 2E): every paper-map view is a true north-up plan: GEOREF.NORTH within 0.5 degrees of up; screen pixels
   per true km at four places equal to 1% (on the 2D build's tilted staff map they differ by 6.0% and north is 17.8 degrees
   off); the scale bar correct to 1%; no figure, roof, chimney, house or 3D tree drawn; hillshade, contours, village
   footprints, water, woods, draped arrows and counters drawn. The views that enter the paper map as a visitor does frame the
   whole modelled ground inside the unobstructed area (every sample point on screen and clear of every panel). All new. */
const PAPER={north:0.5, spread:0.01, scaleBar:0.01}, FRAMED=["paper-north-up","paper-laptop"];
module.exports.PAPER=PAPER; module.exports.FRAMED=FRAMED;
/* Stage 3B (docs/STAGE3_SPEC.md sections B.4 and H; owner decision 49): the paper map as entered, Study, framed at least this
   many screen px per true km (east-west, at the Pratzeberg). Before 3B: 17.1 at 1600 x 900 and 5.5 at 1280 x 720. New.
   Stage 3C (section H): raised from 25 and 19 to 28 and 21 (the 3C build: 28.5 and 21.6, with the one timeline). */
const PAPER_MIN_PXKM={"paper-north-up":28,"paper-laptop":21};
/* Stage 3C (section H): the one timeline's height, at every viewport (before 3C: 170 px at 1600 x 900, 139 at 1366 x 768 and
   1280 x 720). New */
const TIMELINE_MAX=92;
/* Stage 7B (owner decision 122): narrow-390, the first screen at 390 x 844, is a new case whose timeline wraps (172 px on the 6D build); its
   height is recorded in the report, not held to TIMELINE_MAX, until the project takes up a phone layout. Every other view is held as before */
const TIMELINE_RECORDED=["narrow-390"];
/* Stage 3D (section H): in the phase-8 Overview views no arrow head more than a quarter hidden by a panel or the screen's edge
   (4 of 5 Allied arrows in Part A; 2 of 5 still wholly under the 90 px timeline before the Overview was fitted); in every
   landscape view on a build with the view offset, the orbit target at the free rectangle's centre within 1 px. New */
const HEADS_SHOWN=["ph8-overview-study","ph8-overview-watch"], FOCUS_PX=1;
module.exports.HEADS_SHOWN=HEADS_SHOWN; module.exports.FOCUS_PX=FOCUS_PX;
module.exports.TIMELINE_MAX=TIMELINE_MAX;
/* Stage 4B (docs/STAGE4_SPEC.md section A.6): the Stage 0 darkness limit, and the views the harness renders through the day without
   the shadow toe: [case, clock or null (the case's own), factor or null (the case's own)]. New */
const SOLID_BLACK=0.0005, LIGHT_SWEEP=[];
["overview-field","pratzen-low"].forEach(n=>{ for(let t=480;t<=960;t+=60) LIGHT_SWEEP.push([n,t,4]); });
["overview-field","close-sokolnitz","ph8-overview-study"].forEach(n=>{ LIGHT_SWEEP.push([n,null,1]); LIGHT_SWEEP.push([n,null,"model"]); });
const SMOKE_SHARE=0.25; module.exports.SMOKE_SHARE=SMOKE_SHARE;   /* Stage 4E: the smoke's share of the free rectangle, at most */
/* Stage 5B (docs/STAGE5_SPEC.md section A.5): the position-confidence marks' share of the free rectangle as rendered (measure.js
   confShare), at most: on the landscape and on the paper map. Set from the 5B build's harness views (the largest on the landscape
   19.2%, pratzen-low-1x; on the paper map 15.1%, paper-close: docs/stage5-evidence/5b-after.json), rounded up; never raised */
const CONF_SHARE={land:0.20, paper:0.16}; module.exports.CONF_SHARE=CONF_SHARE;
/* Stage 4E (docs/STAGE4_SPEC.md section F.2): the horizon in the low views [case, factor]; where the apron's far edge stands below
   the true horizon, the gap is drawn in the haze's colour: its mean colour per column within HORIZON_DE (0-255, the largest
   channel) of the sky's just above the horizon */
const HORIZON_VIEWS=[["pratzen-low",1],["pratzen-low",4],["pratzen-low","model"]], HORIZON_DE=10;
module.exports.HORIZON_VIEWS=HORIZON_VIEWS; module.exports.HORIZON_DE=HORIZON_DE;
module.exports.SOLID_BLACK=SOLID_BLACK; module.exports.LIGHT_SWEEP=LIGHT_SWEEP;
/* Stage 4C (docs/STAGE4_SPEC.md section C.6): the valley fog's hours, rendered by the harness at 4x [case, clock]. New */
const FOG_VIEWS=[["overview-field",480],["pratzen-low",510]];
module.exports.FOG_VIEWS=FOG_VIEWS;
module.exports.PAPER_MIN_PXKM=PAPER_MIN_PXKM;
module.exports.DROP_LIMIT=DROP_LIMIT; module.exports.UNOBSTRUCTED=UNOBSTRUCTED; module.exports.LAYER_MS=LAYER_MS;
/* Stage 0 guarantees, checked on every baseline case (harness --test). The numbers are the
   contract; each failure message says what a visitor would see. */
module.exports.check=function(name,m){
  const f=[];
  /* Stage 5E (decision 91): the eye-level vantage is the one camera path below the floor; there the eye must stand at its own height
     above the drawn ground, exactly, at the headquarters */
  if(m.eyeLevel){ const E=m.eyeLevel; if(!(E.on&&Math.abs(E.dy-E.want)<1e-4&&E.atHQ)) f.push("the eye-level vantage: on "+E.on+", "+E.dy+" units above the ground (want "+E.want+"), at the headquarters "+E.atHQ); }
  else if(m.camera.clearance<1.79) f.push("camera only "+m.camera.clearance+" units above the drawn ground (floor 1.8)");
  if(m.figures.count&&m.figures.maxErr>0.02) f.push("a figure is "+m.figures.maxErr+" units off the drawn ground ("+m.figures.worst+")");
  if(m.standards.count&&m.standards.maxErr>0.02) f.push("a standard's foot is "+m.standards.maxErr+" units off the ground");
  /* overlaps: every pair fails, except a pair named in KNOWN for that case (reported, not hidden) */
  const known=(KNOWN[name]||[]), left=m.labels.examples.filter(e=>!known.includes(e));
  const n=Object.values(m.labels.pairs).reduce((a,b)=>a+b,0);
  if(n>0&&(left.length||n>m.labels.examples.length)) f.push(n+" overlapping labels or counters "+JSON.stringify(m.labels.pairs)+": "+m.labels.examples.slice(0,4).join("; "));
  if(m.smokeEdgeAlpha) f.push("smoke sprites have a visible edge (alpha "+m.smokeEdgeAlpha+"/255)");
  if(m.dustEdgeAlpha) f.push("dust sprites have a visible edge (alpha "+m.dustEdgeAlpha+"/255)");
  if(m.mist.visible&&m.mist.maxAlphaAtCrossing>0.02) f.push("mist visible where the ground rises through it (alpha "+m.mist.maxAlphaAtCrossing+")");
  /* black-slope clipping shows as solid near-black regions; small black details (headgear, text, poles) are fine */
  if(m.pixels.solidBlack>SOLID_BLACK) f.push("solid near-black regions cover "+(100*m.pixels.solidBlack).toFixed(3)+"% of the map ("+m.pixels.solidBlocks+" blocks of 8x8; limit 0.05%)");
  if(m.selection&&!m.drawerVisible&&!m.chipVisible) f.push("selection "+m.selection+" is shown nowhere");
  if(!m.selection&&m.chipVisible) f.push("selection chip shown with nothing selected");
  /* Stage 7B (docs/STAGE7_SPEC.md sections 0.4 item 2 and 6; owner decision 113): Stage 0's "first-run card stacked on the dispatch card"
     failed whenever both were visible. Written when the dispatch was a floating card, it meant the card over the dispatch; since 3B the
     dispatch from 1080 px is the rail's Now tab, which the card cannot stand over, and decision 113 shows it there under the card. The test
     is now what the message says: the two boxes may not meet. Below 1080 px, where the dispatch is a card again (decision 58), it still
     fails as before (the boxes overlap there, Part A section 6). Without the boxes (a build measured by an older harness) it fails as before. */
  if(m.firstRunVisible&&m.dispatchVisible){ const a=m.firstRunBox, b=m.dispatchBox;
    if(!a||!b||(Math.min(a[2],b[2])-Math.max(a[0],b[0])>0&&Math.min(a[3],b[3])-Math.max(a[1],b[1])>0)) f.push("first-run card stacked on the dispatch card"); }
  /* Stage 7B (docs/STAGE7_SPEC.md section 6, 7B; decisions 111, 118): on the fresh first-run page, by real key presses, the card has focus
     on its primary action, Tab stays inside it, and Esc closes it where it stands with focus on Play */
  if(m.firstRunKeys){ const K=m.firstRunKeys;
    if(K.focus0!=="fr-tour") f.push("the first-run card does not take focus on its primary action ("+K.focus0+")");
    if(!K.tabs.every(x=>x.inCard)) f.push("Tab leaves the first-run card: "+K.tabs.map(x=>x.id).join(", "));
    if(K.open||!K.camSame||K.focus1!=="play") f.push("Esc on the first-run card: open "+K.open+", camera unmoved "+K.camSame+", focus "+K.focus1+" (want closed, unmoved, Play)"); }
  if(m.stats&&m.stats.camera&&m.stats.camera.violations) f.push("a camera path bypassed the floor ("+m.stats.camera.violations+")");
  /* Stage 2D: the map layer. The overlap test above reads its rendered boxes and is stricter (any shared pixel) */
  const L=m.layer;
  if(L){
    if(m.labels.overPanel&&m.labels.overPanel.length) f.push("map text under an interface panel: "+m.labels.overPanel.slice(0,4).join("; "));
    if(m.labels.overHead&&m.labels.overHead.length) f.push("map text over an arrow head: "+m.labels.overHead.slice(0,4).join("; "));
    if(DROP_LIMIT[name]!==undefined&&L.dropped>DROP_LIMIT[name]) f.push(L.dropped+" items dropped, over the limit of "+DROP_LIMIT[name]+" (what the canvas pass hid): "+L.droppedIds.join(", "));
    if(L.keepMissing.length) f.push("never dropped, yet not drawn: "+L.keepMissing.join(", "));
    if(!(L.ms<LAYER_MS)) f.push("the layer pass took "+L.ms+" ms (budget "+LAYER_MS+" ms)");
    if(L.belowFloor.length) f.push(L.belowFloor.length+" map texts below their floor: "+L.belowFloor.slice(0,4).join("; "));
    if(m.textContrast&&m.textContrast.belowAA.length) f.push(m.textContrast.belowAA.length+" map texts below AA on the rendered frame: "+m.textContrast.belowAA.slice(0,4).join("; "));
  }
  const U=UNOBSTRUCTED[name];
  if(U&&m.unobstructed!==undefined&&m.unobstructed<U[0]) f.push("unobstructed map "+(100*m.unobstructed).toFixed(1)+"%, below the baseline "+(100*U[0]).toFixed(1)+"%");
  if(U&&m.unobstructed720!==undefined&&m.unobstructed720<U[1]) f.push("unobstructed map at 1280 x 720 "+(100*m.unobstructed720).toFixed(1)+"%, below the baseline "+(100*U[1]).toFixed(1)+"%");
  if(m.legendOverDispatch>0) f.push("the legend lies over the dispatch ("+Math.round(m.legendOverDispatch)+" px)");
  /* Stage 3B (docs/STAGE3_SPEC.md sections B.2 and H; owner decisions 49, 54, 55, 58). All new; run only on a build that has
     the Now tab (the harness also measures earlier builds for comparison) */
  if(m.legendOverPanels>0) f.push("the legend lies over the rail, the dossier or the timebar ("+Math.round(m.legendOverPanels)+" px)");
  const Dk=m.docking;
  if(Dk&&Dk.hasNowTab&&m.viewport){ const wide=m.viewport[0]>=1080;
    if(Dk.docked!==wide) f.push("docked is "+Dk.docked+" at "+m.viewport[0]+" px wide (docked from 1080 px)");
    if(m.presentation==="study"&&m.dispatchVisible&&Dk.dispatchInRail!==wide)
      f.push(wide?"the dispatch is a card over the map at "+m.viewport[0]+" px (from 1080 px it is the rail's Now tab)":"the dispatch is in the rail at "+m.viewport[0]+" px (below 1080 px it stays a card)");
    /* Stage 7B (decision 113): also while the first-run card is open (before 7B it showed the order of battle there, exempt) */
    if(m.presentation==="study"&&wide&&Dk.tab!=="now") f.push("Study shows the "+Dk.tab+" tab, not the Now tab (decision 55"+(m.firstRunVisible?", 113":"")+")");
    if(m.presentation==="study"&&!m.firstRunVisible&&Dk.legendOpen) f.push("the legend is open though nobody opened it (it opens closed, decision 49)"); }
  /* Stage 3C (docs/STAGE3_SPEC.md sections D, G.2 and H; owner decisions 53, 60). All new; run only on a build with the timeline's
     control row (#tb-vm) */
  const TL=m.timeline;
  if(TL&&TL.hasRow){
    if(TL.height!==null&&TL.height>TIMELINE_MAX&&!TIMELINE_RECORDED.includes(name)) f.push("the timeline is "+TL.height+" px tall (at most "+TIMELINE_MAX+")");
    if(m.presentation==="watch"&&!(TL.switchInRow&&TL.switchOpacity===1)) f.push("Watch: the presentation switch is not in the timeline's control row at full opacity ("+TL.switchOpacity+")");
    if(m.presentation==="watch"&&TL.capDerived===false) f.push("Watch: the caption's derived reading is not shown");
    if(m.phaseLabels720&&m.phaseLabels720.cut.length) f.push("at 1280 x 720 the current phase's label is cut: "+m.phaseLabels720.cut.join(", ")); }
  /* Stage 4E (docs/STAGE4_SPEC.md section E.3): the smoke covers at most a quarter of the free rectangle; new, on a build with puffs */
  if(m.smoke&&m.smokePuffs&&!(m.smoke.share<=SMOKE_SHARE)) f.push("smoke covers "+(100*m.smoke.share).toFixed(1)+"% of the free rectangle (limit "+(100*SMOKE_SHARE)+"%)");
  /* Stage 5B (docs/STAGE5_SPEC.md section A.5): the position-confidence marks within their share of the free rectangle; new, on a build with them */
  if(m.confShare){ const lim=CONF_SHARE[m.mode==="staff"?"paper":"land"]; if(!(m.confShare.share<=lim)) f.push("the position-confidence marks cover "+(100*m.confShare.share).toFixed(1)+"% of the free rectangle (limit "+(100*lim).toFixed(0)+"%)"); }
  /* Stage 5D (docs/STAGE5_SPEC.md section B.4): with the evidence skeleton on (the whole day) the map layer unchanged and its text at AA; new,
     on a build with the skeleton */
  if(m.skeleton){ const K=m.skeleton;
    if(K.items[0]!==K.items[1]||K.dropped[0]!==K.dropped[1]||!K.sameDrops) f.push("with the evidence skeleton on, the map layer changed: items "+K.items.join(" to ")+", drops "+K.dropped.join(" to ")+(K.sameDrops?"":" (other formations dropped)"));
    if(K.belowAA.length) f.push("with the evidence skeleton on, "+K.belowAA.length+" map texts below AA: "+K.belowAA.slice(0,4).join("; "));
    if(!(K.anchors>0)) f.push("the evidence skeleton drew no anchor with the whole day on"); }
  /* Stage 5F (docs/STAGE5_SPEC.md section E.4): with the ordered routes on, the map layer unchanged and its text at AA; new, on a build with them */
  if(m.routes){ const R=m.routes;
    if(R.items[0]!==R.items[1]||R.dropped[0]!==R.dropped[1]||!R.sameDrops) f.push("with the ordered routes on, the map layer changed: items "+R.items.join(" to ")+", drops "+R.dropped.join(" to "));
    if(R.belowAA.length) f.push("with the ordered routes on, "+R.belowAA.length+" map texts below AA: "+R.belowAA.slice(0,4).join("; ")); }
  if(HEADS_SHOWN.includes(name)&&m.heads&&m.heads.hiddenOverQuarter>0) f.push("arrow heads more than a quarter hidden by a panel or the edge: "+m.heads.list.join(", "));
  if(m.focus!=null&&!(m.focus<=FOCUS_PX)) f.push("the orbit target "+m.focus+" px from the free rectangle's centre (limit "+FOCUS_PX+" px)");
  if(m.focus720!=null&&!(m.focus720<=FOCUS_PX)) f.push("after the resize to 1280 x 720 the orbit target is "+m.focus720+" px from the free rectangle's centre (limit "+FOCUS_PX+" px)");
  if(m.paper&&PAPER_MIN_PXKM[name]!==undefined&&!(m.paper.pxPerKm.pratzeberg>=PAPER_MIN_PXKM[name]))
    f.push("paper map as entered: "+m.paper.pxPerKm.pratzeberg+" px per true km, below "+PAPER_MIN_PXKM[name]);
  const Pm=m.paper;
  if(Pm){
    if(!(Math.abs(Pm.northBearing)<=PAPER.north)) f.push("paper map: north is "+Pm.northBearing+" degrees off up (limit "+PAPER.north+")");
    if(!(Pm.spread<=PAPER.spread)) f.push("paper map: px per true km differs by "+(100*Pm.spread).toFixed(2)+"% across the view "+JSON.stringify(Pm.pxPerKm)+" (limit 1%)");
    if(!(Pm.scaleBar.err<=PAPER.scaleBar)) f.push("paper map: the scale bar ("+Pm.scaleBar.label+", "+Pm.scaleBar.px+" px) is off by "+(100*Pm.scaleBar.err).toFixed(2)+"% (want "+Pm.scaleBar.want+" px)");
    if(Pm.hidden.length) f.push("paper map draws what it hides: "+Pm.hidden.slice(0,6).join(", "));
    const miss=Object.keys(Pm.drawn).filter(k=>!Pm.drawn[k]); if(miss.length) f.push("paper map does not draw: "+miss.join(", "));
    if(FRAMED.includes(name)&&Pm.frameInFree<1) f.push("paper map: "+(100*(1-Pm.frameInFree)).toFixed(1)+"% of the modelled ground is off screen or under a panel (on screen "+(100*Pm.frameOnScreen).toFixed(1)+"%)");
  }
  return f;
};
