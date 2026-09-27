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
  "pratzen-low":13,"pratzen-orbit-min":27,"selected-formation":3,"watch-selected":8,"hybrid-dimmed":13,"pratzen-low-1x":12,"pratzen-low-10x":8};
/* section H: the unobstructed share of the viewport on the Stage 2C build, at the case's viewport and at 1280 x 720, measured
   by this harness (CSS transitions off, the panels at rest). It must not fall. These equal tools/stage2/map-text.js's values
   in every view but one: selected-formation at 1280 x 720 is 6.97% at rest, where map-text.js reported 15.1% with the
   dossier drawer frozen at the start of its slide, almost wholly off screen (CHANGELOG.md, Stage 2D). */
const UNOBSTRUCTED={"first-run":[0.5442,0.4391],"first-run-laptop":[0.4831,0.4391],"overview-field":[0.3028,0.1511],"overview-plan":[0.8045,0.7987],
  "close-sokolnitz":[0.8045,0.7987],"staff-paper":[0.3028,0.1511],"pratzen-low":[0.8045,0.7709],"pratzen-orbit-min":[0.8045,0.7709],
  "selected-formation":[0.1477,0.0697],"watch-selected":[0.7844,0.732],"hybrid-dimmed":[0.7869,0.7434],"pratzen-low-1x":[0.8045,0.7709],
  "pratzen-low-10x":[0.8045,0.7709]};
const LAYER_MS=8;   /* section J's budget for one pass at 1600 x 900 on the harness machine */
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
  if(U&&m.unobstructed!==undefined&&m.unobstructed<U[0]) f.push("unobstructed map "+(100*m.unobstructed).toFixed(1)+"%, below the Stage 2C "+(100*U[0]).toFixed(1)+"%");
  if(U&&m.unobstructed720!==undefined&&m.unobstructed720<U[1]) f.push("unobstructed map at 1280 x 720 "+(100*m.unobstructed720).toFixed(1)+"%, below the Stage 2C "+(100*U[1]).toFixed(1)+"%");
  if(m.legendOverDispatch>0) f.push("the legend lies over the dispatch ("+Math.round(m.legendOverDispatch)+" px)");
  return f;
};
