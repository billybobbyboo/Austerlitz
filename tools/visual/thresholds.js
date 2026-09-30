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
  "narrow-1024":5};
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
const UNOBSTRUCTED={"first-run":[0.5442,0.4391],"first-run-laptop":[0.4831,0.4391],"overview-field":[0.631,0.577],"overview-plan":[0.8045,0.7987],
  "close-sokolnitz":[0.8045,0.7987],"staff-paper":[0.631,0.577],"pratzen-low":[0.8045,0.7709],"pratzen-orbit-min":[0.8045,0.7709],
  "selected-formation":[0.631,0.577],"watch-selected":[0.7844,0.732],"hybrid-dimmed":[0.7869,0.7434],"pratzen-low-1x":[0.8045,0.7709],
  "pratzen-low-10x":[0.8045,0.7709],"paper-north-up":[0.631,0.577],"paper-close":[0.631,0.577],"paper-drawer":[0.631,0.577],"paper-laptop":[0.577,0.577],
  "narrow-1024":[0.4845,0.577]};
const LAYER_MS=8;   /* section J's budget for one pass at 1600 x 900 on the harness machine */
/* Stage 2E (section J, 2E): every paper-map view is a true north-up plan: GEOREF.NORTH within 0.5 degrees of up; screen pixels
   per true km at four places equal to 1% (on the 2D build's tilted staff map they differ by 6.0% and north is 17.8 degrees
   off); the scale bar correct to 1%; no figure, roof, chimney, house or 3D tree drawn; hillshade, contours, village
   footprints, water, woods, draped arrows and counters drawn. The views that enter the paper map as a visitor does frame the
   whole modelled ground inside the unobstructed area (every sample point on screen and clear of every panel). All new. */
const PAPER={north:0.5, spread:0.01, scaleBar:0.01}, FRAMED=["paper-north-up","paper-laptop"];
module.exports.PAPER=PAPER; module.exports.FRAMED=FRAMED;
/* Stage 3B (docs/STAGE3_SPEC.md sections B.4 and H; owner decision 49): the paper map as entered, Study, framed at least this
   many screen px per true km (east-west, at the Pratzeberg). Before 3B: 17.1 at 1600 x 900 and 5.5 at 1280 x 720. New. */
const PAPER_MIN_PXKM={"paper-north-up":25,"paper-laptop":19};
module.exports.PAPER_MIN_PXKM=PAPER_MIN_PXKM;
module.exports.DROP_LIMIT=DROP_LIMIT; module.exports.UNOBSTRUCTED=UNOBSTRUCTED; module.exports.LAYER_MS=LAYER_MS;
/* Stage 0 guarantees, checked on every baseline case (harness --test). The numbers are the
   contract; each failure message says what a visitor would see. */
module.exports.check=function(name,m){
  const f=[];
  if(m.camera.clearance<1.79) f.push("camera only "+m.camera.clearance+" units above the drawn ground (floor 1.8)");
  if(m.figures.count&&m.figures.maxErr>0.02) f.push("a figure is "+m.figures.maxErr+" units off the drawn ground ("+m.figures.worst+")");
  if(m.standards.count&&m.standards.maxErr>0.02) f.push("a standard's foot is "+m.standards.maxErr+" units off the ground");
  /* overlaps: every pair fails, except a pair named in KNOWN for that case (reported, not hidden) */
  const known=(KNOWN[name]||[]), left=m.labels.examples.filter(e=>!known.includes(e));
  const n=Object.values(m.labels.pairs).reduce((a,b)=>a+b,0);
  if(n>0&&(left.length||n>m.labels.examples.length)) f.push(n+" overlapping labels or counters "+JSON.stringify(m.labels.pairs)+": "+m.labels.examples.slice(0,4).join("; "));
  if(m.smokeEdgeAlpha) f.push("smoke sprites have a visible edge (alpha "+m.smokeEdgeAlpha+"/255)");
  if(m.dustEdgeAlpha) f.push("dust sprites have a visible edge (alpha "+m.dustEdgeAlpha+"/255)");
  if(m.mist.visible&&m.mist.maxAlphaAtCrossing>0.02) f.push("mist visible where the ground rises through it (alpha "+m.mist.maxAlphaAtCrossing+")");
  /* black-slope clipping shows as solid near-black regions; small black details (shakos, text, poles) are fine */
  if(m.pixels.solidBlack>0.0005) f.push("solid near-black regions cover "+(100*m.pixels.solidBlack).toFixed(3)+"% of the map ("+m.pixels.solidBlocks+" blocks of 8x8; limit 0.05%)");
  if(m.selection&&!m.drawerVisible&&!m.chipVisible) f.push("selection "+m.selection+" is shown nowhere");
  if(!m.selection&&m.chipVisible) f.push("selection chip shown with nothing selected");
  if(m.firstRunVisible&&m.dispatchVisible) f.push("first-run card stacked on the dispatch card");
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
    if(m.presentation==="study"&&wide&&!m.firstRunVisible&&Dk.tab!=="now") f.push("Study shows the "+Dk.tab+" tab, not the Now tab (decision 55)");
    if(m.presentation==="study"&&!m.firstRunVisible&&Dk.legendOpen) f.push("the legend is open though nobody opened it (it opens closed, decision 49)"); }
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
