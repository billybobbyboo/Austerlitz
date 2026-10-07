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
/* Stage 7C (owner decision 121): the opening's cases are new; each limit is what the 7C build drops there (decision 62's method), never raised:
   step 1 the place names the Overview's distance drops at 04:00 (Pratzen, Stare Vinohrady, the Pratzeberg, Zuran, the Goldbach, Telnitz,
   Sokolnitz, Augezd; at 1280 x 720 also Santon and Austerlitz), step 2 seven names around the plateau, step 3 three, step 4 four, the end state
   the first screen's seven */
DROP_LIMIT["opening-1"]=8; DROP_LIMIT["opening-2"]=7; DROP_LIMIT["opening-3"]=3; DROP_LIMIT["opening-4"]=4; DROP_LIMIT["opening-end"]=7;
DROP_LIMIT["opening-1-laptop"]=10;
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
/* Stage 7C (owner decision 121): the opening's cases, what the 7C build measures there (the tour's bar over the map, 164-187 px tall), rounded down
   to 0.1 point; the end state is Study's view (the Study baselines .703/.628, met) */
UNOBSTRUCTED["opening-1"]=[0.632,0.516]; UNOBSTRUCTED["opening-2"]=[0.639,0.529]; UNOBSTRUCTED["opening-3"]=[0.639,0.529];
UNOBSTRUCTED["opening-4"]=[0.639,0.529]; UNOBSTRUCTED["opening-end"]=[0.703,0.628]; UNOBSTRUCTED["opening-1-laptop"]=[0.516,0.516];
/* Roadmap step 1 (T-5; docs/FINAL_AUDIT.md section 2.6, decision 131): the three views measured since 5E and 5F had no baseline, and their
   unobstructed checks were skipped without a word (if(U&&...)). Their baselines are what the 7D build measures there
   (docs/audit-evidence/check-visual-report.json: 89.78% / 87.22% at both eye levels, 70.36% / 62.88% with the Plans overlay), rounded down
   to 0.1 point (the 3B and 3C method): Watch's and Study's own values. Provisional until the one re-measure after the embedded fonts
   (decision 141, tools/visual/remeasure.js), which met all three as they stand (89.78% / 87.22% and 70.45% / 63.01%): kept */
UNOBSTRUCTED["eye-zuran"]=[0.897,0.872]; UNOBSTRUCTED["eye-zuran-1x"]=[0.897,0.872]; UNOBSTRUCTED["plans-overview"]=[0.703,0.628];
/* Decision 141 (the embedded fonts, roadmap step 1): every case re-measured once on the 1aa3ada14130b3d27fc0817b41f8537b build, two identical runs (linux, Chromium 141.0.7390.37, Playwright 1.56.0), by tools/visual/remeasure.js --bounds keep (decision 62's method; a bound kept where the build still meets it, changed only where the fonts moved the measure past it). Each value: was, is and why, in
   CHANGELOG.md; loosened under decision 141: UNOBSTRUCTED["first-run"], DROP_LIMIT["narrow-390"], UNOBSTRUCTED["narrow-390"], UNOBSTRUCTED["first-run-laptop"], DROP_LIMIT["eye-zuran"], DROP_LIMIT["plans-overview"] */
UNOBSTRUCTED["first-run"]=[0.626,0.507];   /* was [0.634,0.52]; loosened (decision 141) */
DROP_LIMIT["narrow-390"]=7;   /* was 6; loosened (decision 141) */
UNOBSTRUCTED["narrow-390"]=[0.46,0.507];   /* was [0.468,0.52]; loosened (decision 141) */
UNOBSTRUCTED["first-run-laptop"]=[0.546,0.507];   /* was [0.558,0.52]; loosened (decision 141) */
DROP_LIMIT["eye-zuran"]=6;   /* was 5; loosened (decision 141) */
DROP_LIMIT["plans-overview"]=12;   /* was 11; loosened (decision 141) */
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
module.exports.TIMELINE_MAX=TIMELINE_MAX; module.exports.TIMELINE_RECORDED=TIMELINE_RECORDED;
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
   contract; each failure message says what a visitor would see.
   Roadmap step 1 (decision 131; docs/FINAL_AUDIT.md T-5, T-6): check(name, m, spec, opts). With the case's spec (cases.js) and not
   opts.legacy, every measure the case's kind calls for is required (requirements below: a build or a report without it fails, where before
   step 1 a missing measure skipped its check without a word), the case must stand in the state it asks for (expectState), Watch must show
   the caption's derived reading (true, not merely not false) and the ordered routes must draw at least one route. Called with two
   arguments (tools/stage7/lib.js's probes) or with opts.legacy (an archived build), it applies the gated checks as before step 1.
   opts.limits overrides DROP_LIMIT, UNOBSTRUCTED and PAPER_MIN_PXKM by case (tools/visual/remeasure.js re-judges a run with the values it
   proposes); every other value is this file's. */
module.exports.check=function(name,m,spec,opts){
  opts=opts||{};
  const f=[], strict=!!spec&&!opts.legacy, LIM=limits(opts.limits);
  const DROP_LIMIT=LIM.DROP_LIMIT, UNOBSTRUCTED=LIM.UNOBSTRUCTED, PAPER_MIN_PXKM=LIM.PAPER_MIN_PXKM;
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
  /* Stage 7C (docs/STAGE7_SPEC.md section 6, 7C; decisions 114, 118): an opening case shows the step its clicks reached (or, after Finish, the end
     state at 04:00); on the opening-2 page, by real key presses, Esc from step 2, Enter on the focused Next and Space on Skip do what they say */
  if(m.opening){ const O=m.opening;
    if(O.want==="end"?(O.on||O.stop!==-1||O.clock!==240):(!O.on||O.k!==O.want)) f.push("the opening's clicks reached "+(O.on?"step "+(O.k+1):"no step")+" (tour stop "+(O.stop+1)+", clock "+O.clock+"), not "+(O.want==="end"?"the end state":"step "+(O.want+1))); }
  if(m.openingKeys){ const K=m.openingKeys, endOk=q=>!q.on&&q.stop===-1&&q.clock===240&&q.pres==="study"&&q.follow&&q.vantage==="plan"&&q.id==="play"&&!q.bar&&(!m.viewport||m.viewport[0]<1080||q.tab==="now");
    if(!endOk(K.esc)) f.push("Esc at the opening's step 2 did not land on the end state: "+JSON.stringify(K.esc));
    if(!(K.begun.on&&K.begun.k===0&&K.begun.id==="tour-next")) f.push("the tools' button did not begin the opening with focus on its Next: "+JSON.stringify(K.begun));
    /* Stage 7D (decision 123): Enter on Next plays the clock at 4x toward step 2; Space off a button pauses it (the clock still for 1.5 s) and
       resumes it; Enter on Next again goes straight to step 2, the visitor's half speed back */
    if(K.played&&!(K.played.play&&K.played.to===1&&K.played.playing&&K.played.speed===4)) f.push("Enter on the opening's Next did not play the clock at 4x toward step 2: "+JSON.stringify(K.played));
    if(K.paused&&!(K.paused.play&&!K.paused.playing&&K.paused.still&&/paused$/.test(K.paused.head))) f.push("Space did not pause the opening's played stretch: "+JSON.stringify(K.paused));
    if(K.resumed&&!(K.resumed.play&&K.resumed.playing)) f.push("Space did not resume the opening's played stretch: "+JSON.stringify(K.resumed));
    if(K.speedAfter!==undefined&&K.speedAfter!==0.5) f.push("after the played stretch the speed is "+K.speedAfter+", not the visitor's half speed");
    if(!(K.enter.on&&K.enter.k===1&&K.enter.id==="tour-next")) f.push("Enter on the opening's Next did not reach step 2: "+JSON.stringify(K.enter));
    if(K.tab!=="tour-exit") f.push("Tab from the opening's Next went to "+K.tab+", not Skip");
    if(!endOk(K.space)) f.push("Space on Skip did not land on the end state: "+JSON.stringify(K.space)); }
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
  /* (strict: a case without a baseline, or a report without both measures, fails in requirements below) */
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
    /* roadmap step 1 (T-6): strict, the reading must be shown (true); before step 1 only false failed, and a caption with no derived reading
       at all (null) passed. CAP_DERIVED_NONE names a case exempt, with its reason (none) */
    if(m.presentation==="watch"&&(strict?(TL.capDerived!==true&&!CAP_DERIVED_NONE.includes(name)):TL.capDerived===false)) f.push("Watch: the caption's derived reading is not shown ("+TL.capDerived+")");
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
    if(R.belowAA.length) f.push("with the ordered routes on, "+R.belowAA.length+" map texts below AA: "+R.belowAA.slice(0,4).join("; "));
    /* roadmap step 1 (T-6): strict, the layer must draw a route (before step 1 a view with none drawn passed every check above vacuously);
       ROUTES_NONE names a case exempt, with its reason (none) */
    if(strict&&!(R.routes>0)&&!ROUTES_NONE.includes(name)) f.push("with the ordered routes on, none drawn ("+R.routes+")"); }
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
  if(strict){ requirements(name,m,spec,LIM).forEach(x=>f.push(x)); expectState(name,m,spec).forEach(x=>f.push(x)); }
  return f;
};

/* ============================================================
   Roadmap step 1 (decision 131: the suite hardened before any data task; docs/FINAL_AUDIT.md section 2.6, T-1, T-4, T-5, T-6): what the
   harness, check-report.js, check:contrast and remeasure.js judge, in one place, so a report is judged the same way when it is made and
   when it is read again (check-report.js re-applies everything from the numbers the report holds; nothing is decided only in harness.js).
   ============================================================ */

/* the limits by case, with overrides (remeasure.js re-judges a run with the values it proposes) */
function limits(o){ o=o||{};
  return {DROP_LIMIT:Object.assign({},DROP_LIMIT,o.DROP_LIMIT||{}), UNOBSTRUCTED:Object.assign({},UNOBSTRUCTED,o.UNOBSTRUCTED||{}),
    PAPER_MIN_PXKM:Object.assign({},PAPER_MIN_PXKM,o.PAPER_MIN_PXKM||{})}; }
module.exports.limits=limits;

/* T-1: a console warning or error (or a failed console.assert), a page error, a crash or a failed request on any page the harness or
   check:contrast opens is a failure unless an entry here names it: {id, type ("warning", "error", "assert", "pageerror", "crash",
   "requestfailed"), text: an anchored RegExp of the message, at: a RegExp of the blocks it may come from (optional), max: at most how many
   per run, why: why it is harmless, until: what removes it}. One entry, below; every other message fails. (Before step 1 the harness kept
   only the last page's messages, and printed them; the 7D run's nine Canvas2D readback warnings came from test code reading the app's
   texture canvases, fixed in step 1 by reading through test-owned canvases: app.js texData, measure.js readCanvas.) */
const CONSOLE_ALLOW=[
  /* Found by step 1's check:contrast (the first run that listens): leaving the eye level clamps the eye to the floor before the observer's
     own formations near it are drawn again (eyeLeave calls clampCamera, then the next updateVisibility shows the blocks eyeOwnNear hid,
     and formationTop raises the floor above the eye); the render-time guard (renderFrameNow) corrects it before the frame, so nothing is
     drawn below the floor, counts CAM.violations and warns once per page. check:contrast's "staff-eyes" state leaves the eye level and its
     "daytrack" state draws the landscape there again. A visitor leaving the eye level near a headquarters triggers it (INFERENCE from the
     code and a probe: Napoleon's headquarters, 08:30, the floor raised from 4.80 to 7.22 units). The harness never draws a frame between
     applyCase's eyeLeave and its placeCamera. Harmless to what is drawn; the fix is in the app (clamp after the blocks are shown again),
     a robustness item for roadmap step 3, not a tools commit's: remove this entry with it. */
  {id:"eye-leave-floor", type:"warning", text:/^Austerlitz runtime check: a camera path bypassed the ground floor$/, at:/^(staff-eyes|daytrack)$/, max:1,
    why:"the render-time guard corrected the eye before the frame (nothing drawn below the floor); it warns that eyeLeave clamped before the eye's own formations were shown again",
    until:"the app fix in roadmap step 3 (eyeLeave clamps after the blocks near the eye are drawn again)"}];
function judgeConsole(log){
  const used={}, bad=[];
  (log||[]).forEach(e=>{ const a=CONSOLE_ALLOW.find(x=>x.type===e.type&&x.text.test(e.text)&&(!x.at||x.at.test(e.at||"")));
    if(a&&(used[a.id]=(used[a.id]||0)+1)<=a.max) return; bad.push(e); });
  return {bad,used};
}
function consoleLine(e){ return "console "+e.type+" on the "+(e.page||"?")+" page during "+(e.at||"?")+": "+e.text; }
module.exports.CONSOLE_ALLOW=CONSOLE_ALLOW; module.exports.judgeConsole=judgeConsole; module.exports.consoleLine=consoleLine;

/* T-5: what the build must have for every check here to run (measure.js features(), read from the page). A missing one fails a --test run;
   before step 1 about 23 typeof gates in harness.js, thresholds.js and contrast.js skipped their checks without a word. A run on an
   archived build (--legacy) keeps the gates and lists what it skipped (report.skipped). The value names the stage that brought it */
const REQUIRED_FEATURES={LANDCAM:"Stage 3D: the landscape camera, the real-input orbit case", syncViewOffset:"Stage 3D: the view offset",
  displayHeight:"Stage 2B: the display height", ML:"Stage 2D: the map layer", MAPCAM:"Stage 2E: the paper map's plan camera",
  OPENING:"Stage 7C: the opening", CONF:"Stage 5B: position confidence", ROUTES:"Stage 5F: the ordered routes", SKEL:"Stage 5D: the evidence skeleton",
  EYE:"Stage 5E: the eye-level vantage", frButtons:"Stage 7B: the first-run dialog", timelineRow:"Stage 3C: the timeline's control row",
  nowTab:"Stage 3B: the rail's Now tab", DWELL:"Stage 4D: the dwell", KEYS:"Stage 3E: the key table", SUN_DAY:"Stage 4B: the computed sun",
  ATMO:"Stage 4C: the atmosphere", SMOKE:"Stage 4E: smoke in puffs", settle:"Stage 0: AUSTERLITZ_DEBUG.settle",
  applyCase:"Stage 0: AUSTERLITZ_DEBUG.applyCase", selfTest:"Stage 0: AUSTERLITZ_DEBUG.selfTest"};
module.exports.REQUIRED_FEATURES=REQUIRED_FEATURES;

/* T-6: the vacuous edges. Watch's caption must show its derived reading (capDerived true) and the ordered routes must draw a route, in every
   case but one named here with its reason. Empty: no case is exempt */
const CAP_DERIVED_NONE=[], ROUTES_NONE=[];
module.exports.CAP_DERIVED_NONE=CAP_DERIVED_NONE; module.exports.ROUTES_NONE=ROUTES_NONE;

/* T-6: the state a case asks for. CAM_TOL (world units; 0.63 m across the ground at 63.2 m per unit): the camera after the harness's own
   settling against the snapshot measure.js takes right after applyCase (a glide, Follow or a fly-to moves it whole units); on the paper map
   the plan's centre within CAM_TOL and its scale (world units per px) within MAP_WPP_TOL relative.
   GROUND_SELF_TOL (world units): measure.js reads the drawn ground from the ground mesh's own vertex buffer (rg); against the app's
   displayHeight at 200 vertices it must agree within 1e-4 units (0.6 mm at 10.33x, 6 mm at 1x), else every figure, standard and camera
   measure of the view is void. The 7D run's largest disagreement is 3e-6 (pratzen-low-10x; every other case 0-1e-6); float32's bound at
   10.33x is about 2.9e-5 (the largest model slope 2.657 x half an ulp of 180, 7.63e-6, x sqrt 2, plus 4.8e-7 in y); 1e-4 is ten times under
   the self-test's own groundY check (1e-3) and 200 times under figure seating (0.02). Before step 1 it was recorded and never asserted */
const CAM_TOL=0.01, MAP_WPP_TOL=1e-3, GROUND_SELF_TOL=1e-4;
module.exports.CAM_TOL=CAM_TOL; module.exports.MAP_WPP_TOL=MAP_WPP_TOL; module.exports.GROUND_SELF_TOL=GROUND_SELF_TOL;

/* T-5: every measure the case's kind calls for. A reading is a case the visitor reads the battle in (not the fresh first screen; the
   opening's steps are readings, harness.js); the skeleton and the routes are not drawn at the eye level (5E); the paper map has no smoke and
   no orbit focus (orthographic) */
function requirements(name,m,spec,LIM){
  const f=[], need=(ok,what)=>{ if(!ok) f.push("not measured: "+what+" (T-5)"); };
  const reading=!spec.fresh||spec.opening!==undefined, land=m.mode!=="staff", U=LIM.UNOBSTRUCTED[name], Dk=m.docking, TL=m.timeline;
  need(!!m.layer,"the map layer's pass (Stage 2D)");
  if(LIM.DROP_LIMIT[name]===undefined) f.push("no drop limit for this case in thresholds.js: its drops are unchecked (T-5)");
  if(!U) f.push("no unobstructed baseline for this case in thresholds.js: its share is unchecked (T-5)");
  need(typeof m.unobstructed==="number"&&typeof m.unobstructed720==="number","the unobstructed share at the case's viewport and at 1280 x 720");
  need(!!(Dk&&Dk.hasNowTab&&m.viewport),"the docking (the rail's Now tab, Stage 3B)");
  need(!!(TL&&TL.hasRow&&TL.height!==null),"the timeline's control row and height (Stage 3C)");
  if(land){ need(!!(m.smoke&&m.smokePuffs),"the smoke's share (Stage 4E)"); need(m.focus!=null&&m.focus720!=null,"the orbit target against the free rectangle's centre (Stage 3D)"); }
  else need(!!m.paper,"the paper map's geometry (Stage 2E)");
  if(reading) need(!!m.confShare,"the position-confidence marks' share (Stage 5B)");
  if(reading&&!spec.eye){ need(!!m.skeleton,"the evidence skeleton on, the whole day (Stage 5D)"); need(!!m.routes,"the ordered routes on (Stage 5F)");
    if(m.skeleton&&!(m.skeleton.legs>0)) f.push("the evidence skeleton drew no leg with the whole day on ("+m.skeleton.legs+")"); }
  if(HEADS_SHOWN.includes(name)) need(!!m.heads,"the arrow heads (Stage 3D)");
  if(spec.eye) need(!!m.eyeLevel,"the eye's height and place (Stage 5E)");
  if(spec.opening!==undefined) need(!!m.opening,"the opening's step (Stage 7C)");
  if(name==="overview-field"||name==="overview-plan") need(!!m.phaseLabels720,"every phase's label at 1280 x 720 (Stage 3C)");
  if(name==="first-run") need(!!m.firstRunKeys,"the first-run card by real key presses (Stage 7B)");
  if(name==="opening-2") need(!!m.openingKeys,"the opening by real key presses (Stage 7C, 7D)");
  if(spec.interact) need(!!m.intended,"the interaction's intended move (Stage 0)");
  /* (the vertex layout is part of the case's state; a report without a state fails in expectState) */
  if(!(typeof m.groundSelfCheck==="number"&&m.groundSelfCheck<=GROUND_SELF_TOL&&(!m.state||m.state.groundLayout===true)))
    f.push("the harness's own ground reader disagrees with the drawn ground by "+m.groundSelfCheck+" units (limit "+GROUND_SELF_TOL+"; the vertex layout rg reads: "+
      (m.state?m.state.groundLayout:"-")+"): every figure, standard and camera measure in this view is void");
  return f;
}
module.exports.requirements=requirements;

/* T-6: the case stands in the state it asks for (measure.js state(), taken before the screenshot), and the page is given back as it was
   found after the case's own measures (stateAfter: the layers at their defaults, the viewport the case's). Before step 1 applyCase's
   "return true" was the only evidence */
function expectState(name,m,spec){
  const f=[], s=m.state;
  if(!s) return ["the case's state was not recorded (T-6; a report made by a harness before roadmap step 1): its clock, presentation, mode, factor, selection, camera, layers and the ground's vertex layout are unchecked"];
  const want=(what,got,exp)=>{ if(got!==exp) f.push("state: "+what+" is "+JSON.stringify(got)+", the case asks "+JSON.stringify(exp)+" (T-6)"); };
  const reading=!spec.fresh||spec.opening!==undefined;
  if(spec.opening===undefined){
    const t=spec.expect&&spec.expect.t!==undefined?spec.expect.t:spec.t;
    if(!(typeof s.clock==="number"&&Math.abs(s.clock-t)<1e-9)) f.push("state: the clock is "+s.clock+", the case asks "+t+" (T-6)");
    want("the presentation",s.presentation,spec.presentation||"study");
    want("the ground",s.mode,spec.mode||"terrain");
    const fw=spec.factor==="model"?s.exag:(spec.factor||s.defaultFactor);
    if(!(typeof s.factor==="number"&&Math.abs(s.factor-fw)<1e-9)) f.push("state: the display factor is "+s.factor+", the case asks "+fw+" (T-6)");
    want("the selection",s.selection,spec.select?spec.select.join(":"):null);
    want("\"Whose eyes?\"",s.commandView,spec.eyes||"none");
    want("the eye level",s.eye,!!spec.eye);
    want("the Plans overlay",s.plan,spec.plan||null);
    want("the tour stop",s.tour,-1);
    want("the opening",s.opening,false);
    want("the first-run card",s.firstRun,!!spec.fresh);
  } else {
    if(s.openingPlay) f.push("state: the opening's clock is still playing toward a step (OPENING.play) (T-6)");
    want("the first-run card",s.firstRun,false);
  }
  if(s.playing) f.push("state: the clock is playing (T-6)");
  if(s.tween) f.push("state: a camera glide is still running (T-6)");
  if(!Array.isArray(s.viewport)||s.viewport[0]!==spec.viewport[0]||s.viewport[1]!==spec.viewport[1]) f.push("state: the viewport is "+JSON.stringify(s.viewport)+", the case asks "+JSON.stringify(spec.viewport)+" (T-6)");
  const L=s.layers||{};
  if(reading&&L.confidence!==true) f.push("state: Position confidence is off: decision 85 has it on by default (T-6)");
  if(L.routes||L.skeleton||s.confNone||s.skelDay) f.push("state: a layer is not at its default before the case's measures: routes "+L.routes+", skeleton "+L.skeleton+" (whole day "+s.skelDay+"), CONF.none "+s.confNone+" (T-6)");
  /* the camera where the case put it (not on a fresh page, and not after the interaction case's real input, which moves it on purpose) */
  if(!spec.fresh&&!spec.interact){ const a=s.applied, c=s.cam;
    if(!a||!c) f.push("state: no camera snapshot after applyCase (T-6)");
    else if(a.kind!==c.kind) f.push("state: the camera changed kind after applyCase ("+a.kind+" to "+c.kind+") (T-6)");
    else if(c.kind==="map"){ const dx=Math.abs(c.x-a.x), dz=Math.abs(c.z-a.z), dw=Math.abs(c.wpp-a.wpp)/a.wpp;
      if(!(dx<=CAM_TOL&&dz<=CAM_TOL&&dw<=MAP_WPP_TOL)) f.push("state: the paper map moved after applyCase: centre by "+Math.max(dx,dz).toFixed(4)+" units (limit "+CAM_TOL+"), scale by "+(100*dw).toFixed(3)+"% (limit "+(100*MAP_WPP_TOL)+"%) (T-6)"); }
    else { let d=0; for(let i=0;i<3;i++) d=Math.max(d,Math.abs(c.pos[i]-a.pos[i]),Math.abs(c.tgt[i]-a.tgt[i]));
      if(!(d<=CAM_TOL)) f.push("state: the camera moved "+d.toFixed(4)+" units after applyCase (limit "+CAM_TOL+") (T-6)"); } }
  if(s.aimErr!=null&&!(s.aimErr<=CAM_TOL)) f.push("state: the camera stands "+s.aimErr+" units across the ground from where the case's cam or aim puts it (limit "+CAM_TOL+"; reframing moves only height) (T-6)");
  if(s.paperFocus!=null&&!(s.paperFocus<=FOCUS_PX)) f.push("state: the paper map's centred point is "+s.paperFocus+" px from the free rectangle's centre (limit "+FOCUS_PX+" px) (T-6)");
  const t=m.stateAfter;
  if(!t) f.push("state: not recorded after the case's measures (T-6)");
  else { const La=t.layers||{};
    if(La.confidence!==true||La.routes||La.skeleton||t.confNone||t.skelDay) f.push("state after the case's measures: the layers not given back (confidence "+La.confidence+", routes "+La.routes+", skeleton "+La.skeleton+", whole day "+t.skelDay+", CONF.none "+t.confNone+") (T-6)");
    if(!Array.isArray(t.viewport)||t.viewport[0]!==spec.viewport[0]||t.viewport[1]!==spec.viewport[1]) f.push("state after the case's measures: the viewport is "+JSON.stringify(t.viewport)+", not the case's (T-6)"); }
  return f;
}
module.exports.expectState=expectState;

/* T-4: the harness's live blocks (real key presses and rendered sweeps after the cases) judged from the raw numbers they record
   (report.live), so a report read again by check-report.js is judged by today's limits. Before step 1 each block decided in harness.js and
   its result survived only as a sentence. A --selftest-only run (check:selftest) runs the self-test, the slider, Play and the 3E keys; the
   rendered sweeps (the dwell view, the light, the fog, the horizon) stay in check:visual. Under --legacy a block the build cannot run is
   listed in report.skipped instead */
function checkLive(live,opts){
  opts=opts||{}; const f=[], LIM=limits(opts.limits), legacy=!!opts.legacy, so=!!opts.selftestOnly;
  if(!live){ return legacy?[]:["the report records no live blocks (report.live; T-4): made by a harness before roadmap step 1"]; }
  const req=(k,what)=>{ if(!live[k]&&!legacy) f.push("live block not run: "+what+" (T-4, T-5)"); return !!live[k]; };
  const hm=t=>String(Math.floor(t/60)).padStart(2,"0")+":"+String(Math.round(t%60)).padStart(2,"0");
  if(req("slider","the slider and an event marker by real key presses (Stage 3C)")){ const S=live.slider;
    if(!Array.isArray(S.keys)||S.keys.length!==8) f.push("the slider by real key presses: "+(S.keys?S.keys.length:0)+" of 8 keys recorded");
    (S.keys||[]).forEach(k=>{ if(!(Math.abs(k.clock-k.want)<=1e-6)||k.aria!==String(Math.round(k.clock))) f.push("the slider by real key presses: "+k.key+" gave "+k.clock+" (want "+k.want+"), aria-valuenow "+k.aria); });
    if(!S.valuetext||S.valuetext.t!==S.valuetext.want) f.push("the slider's aria-valuetext "+JSON.stringify(S.valuetext&&S.valuetext.t)+", want "+JSON.stringify(S.valuetext&&S.valuetext.want));
    const E=S.marker||{}; if(!E.id||!(Math.abs(E.clock-E.mid)<=1e-6)||E.sel!=="e:"+E.id) f.push("an event marker by real key presses: "+JSON.stringify(E)); }
  if(req("play","Play by a real key press (Stage 4D)")){ const P=live.play;
    if(!P.playing||P.speed!==0.5||P.pressed!=="0.5"||!(P.clock>730)||P.after) f.push("Play by a real key press: playing "+P.playing+" at "+P.speed+"x (pressed "+P.pressed+"), clock 12:10 -> "+P.clock+"; Space again: playing "+P.after); }
  if(req("keys3E","Space, Enter, the arrows, Ctrl+C and the \"?\" overlay by real key presses (Stage 3E)")){ const K=live.keys3E;
    if(!(K.space2&&K.space2.speed===2&&!K.space2.playing)) f.push("keys by real key presses: Space on a speed button: "+JSON.stringify(K.space2));
    if(!(K.enter4&&K.enter4.speed===4&&!K.enter4.playing)) f.push("keys by real key presses: Enter on a speed button: "+JSON.stringify(K.enter4));
    if(!(K.arrows&&K.arrows.clock===600)) f.push("keys by real key presses: the arrows on a focused button stepped the clock to "+(K.arrows&&K.arrows.clock));
    if(!(K.ctrlC&&K.ctrlC.c0===K.ctrlC.c1)) f.push("keys by real key presses: Ctrl+C toggled the contours");
    const H=K.help||{}; if(!(H.h1&&H.h1.open&&H.h1.focus==="help-close"&&H.h2==="help-body"&&H.h3==="help-close"&&H.h4&&!H.h4.open&&H.h4.focus==="tourbtn"))
      f.push("keys by real key presses: the overlay's focus: "+JSON.stringify(H)); }
  if(so) return f;
  if(req("dwell","the Watch view held in a dwell (Stage 4D)")){ const D=live.dwell, lim=LIM.DROP_LIMIT["pratzen-low"];
    if(D.E!==540||!(D.solid<=SOLID_BLACK)||(D.belowAA||[]).length||!(D.dropped<=lim)||!D.cap||!(D.lit>=1))
      f.push("the Watch view in a dwell: at "+(D.E!=null?hm(D.E):"-")+" ("+(D.ev||[]).join(", ")+"): solid "+(100*D.solid).toFixed(3)+"%, below AA "+(D.belowAA||[]).length+", drops "+D.dropped+" (limit "+lim+"), caption "+JSON.stringify(D.cap)+", "+D.lit+" marker lit"); }
  if(req("light","the day's light (Stage 4B)")){
    if(!legacy&&live.light.length!==LIGHT_SWEEP.length) f.push("the day's light: "+live.light.length+" of "+LIGHT_SWEEP.length+" views rendered");
    live.light.forEach(L=>{ if(!(L.solid<=SOLID_BLACK)) f.push("the day's light: "+L.tag+": solid near-black regions cover "+(100*L.solid).toFixed(3)+"% of the map ("+L.blocks+" blocks; limit 0.05%)"); }); }
  if(req("fog","the valley fog's hours (Stage 4C)")){
    if(!legacy&&live.fog.length!==FOG_VIEWS.length) f.push("the valley fog: "+live.fog.length+" of "+FOG_VIEWS.length+" views rendered");
    live.fog.forEach(F=>{ const lim=LIM.DROP_LIMIT[F.name];
      if(!(F.solid<=SOLID_BLACK)) f.push("the valley fog: "+F.tag+": solid near-black "+(100*F.solid).toFixed(3)+"%");
      if((F.belowAA||[]).length) f.push("the valley fog: "+F.tag+": "+F.belowAA.length+" map texts below AA: "+F.belowAA.slice(0,3).join("; "));
      if(!(F.dropped<=lim)) f.push("the valley fog: "+F.tag+": "+F.dropped+" items dropped, over "+lim);
      if(!(F.under>0)) f.push("the valley fog: "+F.tag+": no formation drawn under the fog");
      if(!(F.worst<=F.cap+1e-9)||!(F.cap>0)) f.push("the valley fog: "+F.tag+": the fog "+F.worst+" against its cap "+F.cap); }); }
  if(req("horizon","the horizon in the low views (Stage 4E)")){
    if(!legacy&&live.horizon.length!==HORIZON_VIEWS.length) f.push("the horizon: "+live.horizon.length+" of "+HORIZON_VIEWS.length+" views rendered");
    live.horizon.forEach(H=>{ if(H.gaps&&!(H.worst<=HORIZON_DE)) f.push("the horizon: "+H.tag+": the gap under the horizon differs from the sky by "+H.worst+" (limit "+HORIZON_DE+")"); }); }
  return f;
}
module.exports.checkLive=checkLive;

/* T-4: the in-app self-test, every check by name against tools/visual/selftest-manifest.json (generated from a passing run by
   check-report.js --write-manifest, in the commit that adds, removes or renames a check, and recorded in CHANGELOG.md). Before step 1 a
   report without a self-test, or with fewer checks, passed check-report.js. The names interpolate code constants only, never a measure */
function checkSelfTest(st,MAN,opts){
  opts=opts||{}; const f=[];
  if(!st||!Array.isArray(st.checks)) return ["the in-app self-test did not run or returned nothing (T-4)"];
  st.checks.forEach(c=>{ if(!c.ok) f.push(c.name+": "+c.detail); });
  if(opts.legacy) return f;
  if(!MAN||!Array.isArray(MAN.names)){ f.push("no self-test manifest (tools/visual/selftest-manifest.json; T-4)"); return f; }
  const got=st.checks.map(c=>c.name), seen=new Set(), man=new Set(MAN.names);
  got.forEach(n=>{ if(seen.has(n)) f.push("self-test check named twice: "+n+" (T-4)"); seen.add(n); });
  if(got.length!==MAN.count||MAN.names.length!==MAN.count) f.push("the self-test ran "+got.length+" checks; the manifest has "+MAN.count+" (T-4)");
  MAN.names.filter(n=>!seen.has(n)).forEach(n=>f.push("self-test check missing: "+n+" (T-4)"));
  got.filter(n=>!man.has(n)).forEach(n=>f.push("self-test check not in the manifest: "+n+" (regenerate it with check-report.js --write-manifest and record it in CHANGELOG.md; T-4)"));
  return f;
}
module.exports.checkSelfTest=checkSelfTest;

/* entries of a merged report: this run's, and those kept with the cases measured by an earlier run of the same build (harness --only) */
function runEntries(r,key){
  const out=(r[key]||[]).slice();
  Object.values(r.cases||{}).forEach(m=>{ if(m.run!==r.run) (m[key]||[]).forEach(e=>out.push(e)); });
  return out;
}
module.exports.runEntries=runEntries;

/* T-4: one judgement of a whole report, made by harness.js at the end of a --test run and again by check-report.js.
   opts: cases (the case specs that must be present: this run's selection, or every case of cases.js), allCases (cases.js: no other may be
   present), manifest, legacy, limits. A report made before step 1 (no report.mode) fails here on what it does not record */
function judgeReport(r,opts){
  opts=opts||{}; const out=[], legacy=!!opts.legacy, mode=r.mode||{}, so=!!mode.selftestOnly;
  if(!legacy){
    if(!r.features) out.push("the report records no feature map (report.features; T-5): made by a harness before roadmap step 1");
    else Object.keys(REQUIRED_FEATURES).forEach(k=>{ if(!r.features[k]) out.push("the build has no "+k+" ("+REQUIRED_FEATURES[k]+"): its checks cannot run (T-5)"); });
    runEntries(r,"skipped").forEach(s=>out.push("skipped during "+s.at+": "+s.what+" (T-5)"));
    (r.pages||[]).forEach(p=>{ if(p.fonts!=="loaded") out.push("the "+p.label+" page: the fonts are "+p.fonts+" after document.fonts.ready (decision 141)"); });
  }
  if(!so){
    const want=opts.cases||[], all=(opts.allCases||want), names=all.map(c=>c.name), spec={};
    all.forEach(c=>{ spec[c.name]=c; });
    want.forEach(c=>{ if(!r.cases||!r.cases[c.name]) out.push("case "+c.name+" not measured (T-4)"); });
    Object.keys(r.cases||{}).forEach(n=>{ if(!names.includes(n)) out.push("case "+n+" is not in cases.js (T-4)"); });
    Object.entries(r.cases||{}).forEach(([n,m])=>{ if(spec[n]) module.exports.check(n,m,spec[n],{legacy,limits:opts.limits}).forEach(x=>out.push(n+": "+x)); });
  }
  checkLive(r.live,{legacy,selftestOnly:so,limits:opts.limits}).forEach(x=>out.push(x));
  checkSelfTest(r.selfTest,opts.manifest,{legacy}).forEach(x=>out.push(x));
  if(!legacy) judgeConsole(consoleEntries(r)).bad.forEach(e=>out.push(consoleLine(e)));
  return out;
}
/* a report's console entries; a report made before step 1 kept only the last page's, as sentences (report.consoleWarnings) */
function consoleEntries(r){
  if(r.console||r.mode) return runEntries(r,"console");
  return (r.consoleWarnings||[]).map(w=>{ const k=/^(PAGEERROR|warning|error): ([\s\S]*)$/.exec(w)||[null,"warning",w];
    return {page:"last",at:"an unknown block (a report made before roadmap step 1 kept only the last page's messages)",type:k[1]==="PAGEERROR"?"pageerror":k[1],text:k[2]}; });
}
module.exports.consoleEntries=consoleEntries; module.exports.judgeReport=judgeReport;
