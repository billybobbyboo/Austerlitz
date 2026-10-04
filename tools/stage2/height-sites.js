#!/usr/bin/env node
/* Stage 2 Part A, section A: every call of the height functions in the bundled sources.
   node tools/stage2/height-sites.js [--json out.json]
   Parses each bundled source with acorn and lists every call to height(), hAt(), groundY(),
   localHeight(), regionalLevel() and gridAt(gridH, ...) with file, line and the enclosing
   top-level (and innermost named) function. The classification (model or presentation) is
   made by hand in docs/STAGE2_SPEC.md §A; this script only finds the sites, so that the
   inventory can be re-checked and 2B's guard can be tested against it. */
const fs=require("fs"), path=require("path"), acorn=require("acorn");
const ROOT=path.resolve(__dirname,"..",".."), FILES=["world.js","symbols.js","app.js","analysis.js","data.js","geo.js"];
const NAMES=new Set(["height","hAt","groundY","localHeight","regionalLevel"]);
const rows=[];
for(const f of FILES){
  const src=fs.readFileSync(path.join(ROOT,f),"utf8");
  const ast=acorn.parse(src,{ecmaVersion:2020,sourceType:"script",locations:true});
  (function walk(n,top,inner){
    if(!n||typeof n.type!=="string") return;
    let t=top, i=inner;
    if(/Function/.test(n.type)){
      const nm=n.id&&n.id.name; if(nm){ if(!t) t=nm; i=nm; }
    }
    if(n.type==="VariableDeclarator"&&n.init&&/Function/.test(n.init.type)){ if(!t) t=n.id.name; i=n.id.name; }
    if(n.type==="Property"&&n.value&&/Function/.test(n.value.type)&&n.key){ i=(n.key.name||n.key.value); }
    if(n.type==="CallExpression"&&n.callee.type==="Identifier"){
      const c=n.callee.name;
      const grid=c==="gridAt"&&n.arguments[0]&&n.arguments[0].name==="gridH";
      if(NAMES.has(c)||grid) rows.push({file:f,line:n.loc.start.line,call:grid?"gridAt(gridH)":c,top:t||"(top level)",inner:i||t||"(top level)",
        text:src.split("\n")[n.loc.start.line-1].trim().slice(0,140)});
    }
    for(const k in n){ if(k==="loc") continue; const v=n[k];
      if(Array.isArray(v)) v.forEach(x=>walk(x,t,i)); else if(v&&typeof v.type==="string") walk(v,t,i); }
  })(ast,null,null);
}
/* the classification of docs/STAGE2_SPEC.md §A, by enclosing function (top > inner):
   model:        true model units must stay (height, relief, viewshed, line of sight, knowledge, dossier metres, cover
                 classification on local relief, and the tests of those);
   presentation: a drawn position or the drawn ground; in 2B these read the display height (displayY / groundY);
   test:         a runtime check of the drawn scene (compares against the drawn ground). */
const CLASS={
  "world.js:height":"model","world.js:hAt":"model","world.js:buildGrid":"model","world.js:buildFaceFacts":"model",
  /* Stage 2B: the display height is defined from the model height; the camera presets, authored over the model
     ground, are re-framed from it; the ground mesh is built on the model surface (land cover, the elevation tint and
     the going classes are read from it) and then drawn at the display factor by scaleGround */
  "world.js:displayHeight":"model","world.js:authoredLift":"model","world.js:buildWorld":"model",
  "world.js:groundY":"presentation","world.js:ribbon":"presentation","world.js:mereLevel":"presentation",
  "world.js:buildSettlements":"presentation","world.js:buildWoods":"presentation",
  "world.js:buildApron > v":"presentation","world.js:buildMarshSymbols":"presentation","world.js:buildAnalysis":"presentation",
  "world.js:mistSheet":"presentation","world.js:buildMist":"presentation",
  "app.js:makeBlock > seatLocal":"presentation","app.js:spriteFloor":"presentation","app.js:buildFeatureGlyphs":"presentation",
  "app.js:updateTrail":"presentation","app.js:groundPts":"presentation","app.js:buildObjective":"presentation",
  "app.js:buildPlateauRing":"presentation","app.js:updateSelRing":"presentation","app.js:buildEventLayer":"presentation",
  "app.js:hasLOS":"model","app.js:knowledgeOf":"model","app.js:planRibbon > build":"presentation","app.js:planStaging":"presentation",
  "app.js:planObjective":"presentation","app.js:updatePlanLinks":"presentation","app.js:setPlan":"presentation",
  "app.js:settleBlock":"presentation","app.js:updateVisibility > placeSprite":"presentation","app.js:updateVisibility":"presentation",
  "app.js:pickAt":"presentation","app.js:camGround":"presentation","app.js:centreOnMap":"presentation","app.js:onScreen":"presentation",
  "app.js:dossierFeature":"model","app.js:dossierAnalysis":"model",
  /* Stage 2C: the overlays draped on the drawn ground, and the self-test that measures them against it */
  "app.js:drapeTri":"presentation","app.js:drapedRibbon":"presentation","app.js:buildArrow":"presentation","app.js:buildHalt":"presentation",
  "app.js:buildLine":"presentation","app.js:buildBoundary":"presentation","app.js:overlayDrape":"test",
  /* Stage 2D: the map layer's occlusion (the eye-to-anchor segment against the drawn ground) and the ground under the
     pointer (hover and picking by footprint): both read the drawn ground */
  "app.js:mlOccluded":"presentation","app.js:groundAt":"presentation",
  "app.js:figureError":"test","app.js:selfTest":"test","app.js:selfTest > centreEye":"test","app.js:selfTest > atFactor":"test","app.js:factorFacts":"test",
  /* Stage 2E: on the flat paper map the drawn scale is 0, so the apron's elevation tint (a colour, as buildFaceFacts' tint)
     reads the model height directly instead of the drawn height over the drawn scale; the self-test's paper-map checks
     project the drawn ground and compare it with the display height when the relief is back */
  "world.js:apronGeometry > push":"model","app.js:paperChecks":"test","app.js:paperChecks > scr":"test",
  /* Stage 2F: the local relief the cover classes are read on (COVER_ML, sampled from localHeight: the model's classes, drawn
     per point); roads and streams draped on the drawn ground; the self-test's cover truth (the model's class at a point),
     its road and stream draping, and its check of the woods' trees against the model's class */
  "world.js:buildCoverMl > exact":"model","world.js:drape":"presentation",
  "app.js:coverTruth":"test","app.js:roadDrape":"test","app.js:woodPlacement":"test",
  /* Stage 3D: the landscape camera (LANDCAM) and the Overview's fit read the drawn ground: the grabbed point's plane, the
     cursor's point a zoom scales about, the target anchored on its view ray, the double-click's focus, the field's edge */
  "app.js:fitOverview":"presentation","app.js:anchor":"presentation","app.js:panStart":"presentation","app.js:zoomAt":"presentation",
  "app.js:focusAt":"presentation",
  "app.js:landControls":"test","app.js:landKeysTouch":"test","app.js:cameraChecks3D":"test",
  /* Stage 4B: the self-test's shadow coverage reads the drawn ground under the free rectangle */
  "app.js:lightChecks":"test",
  /* Stage 4C: the self-test's atmosphere checks (the Overview's ground, the knowledge model's threshold) */
  "app.js:fogChecks":"test","app.js:atmoDayChecks":"test",
  /* Stage 4D: Follow's target stands on the drawn ground */
  "app.js:followGoal":"presentation","app.js:followStep":"presentation",
  /* Stage 4D: a drawn-on arrow's end, draped like the rest of its shaft; the self-test's day under Follow */
  "app.js:shaftEnd":"presentation","app.js:paceChecks":"test",
  /* Stage 4E: the self-test's ice and smoke checks against the drawn ground */
  "app.js:extrasChecks":"test",
  /* Stage 5B: a confidence mark's size on screen (the paper map's cap) at its drawn ground */
  "app.js:confPlace":"presentation",
  /* Stage 5B: the self-test's drape of the marks against the drawn ground */
  "app.js:confDrape":"test","app.js:confChecks":"test","app.js:confDayChecks":"test"
};
rows.forEach(r=>{ r.where=r.top+(r.inner!==r.top?" > "+r.inner:""); r.cls=CLASS[r.file+":"+r.where]||"UNCLASSIFIED"; });
/* the model-side exceptions inside presentation functions: the local relief used to choose where marsh symbols go */
rows.forEach(r=>{ if(r.file==="world.js"&&r.where==="buildMarshSymbols"&&r.call==="localHeight") r.cls="model"; });
const by={}; rows.forEach(r=>{ by[r.call]=(by[r.call]||0)+1; });
const byC={}; rows.forEach(r=>{ byC[r.cls]=(byC[r.cls]||0)+1; });
console.log("height-function call sites: "+rows.length+"  "+JSON.stringify(by)+"  "+JSON.stringify(byC));
rows.forEach(r=>console.log(r.file+":"+r.line+"\t"+r.cls+"\t"+r.call+"\t"+r.where+"\t"+r.text));
const un=rows.filter(r=>r.cls==="UNCLASSIFIED"); if(un.length){ console.log("UNCLASSIFIED sites: "+un.length); process.exitCode=1; }
/* --check (the 2B guard, run by tools/run-all.sh since Stage 2B): presentation sites must not call height() or hAt(),
   and every site must be classified (an unclassified site fails above) */
if(process.argv.includes("--check")){ const bad=rows.filter(r=>r.cls==="presentation"&&(r.call==="height"||r.call==="hAt"));
  console.log("presentation sites calling height()/hAt(): "+bad.length+(bad.length?" (they must read the display height)":"")); if(bad.length) process.exitCode=1; }
const md=process.argv.indexOf("--md"); if(md>0){
  const L=["| site | call | enclosing function | class |","|---|---|---|---|"];
  rows.forEach(r=>L.push("| `"+r.file+":"+r.line+"` | "+r.call+" | "+r.where+" | "+r.cls+" |")); fs.writeFileSync(process.argv[md+1],L.join("\n")+"\n"); }
const j=process.argv.indexOf("--json"); if(j>0) fs.writeFileSync(process.argv[j+1],JSON.stringify(rows,null,1));
