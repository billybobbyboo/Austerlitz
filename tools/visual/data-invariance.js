#!/usr/bin/env node
/* Proves which parts of the build changed between two HTML files, declaration by declaration.
   node tools/visual/data-invariance.js <original.html> <patched.html>   (exit 1 if any DATA changed)
   The script is parsed with acorn; every top-level declaration is compared by its exact source
   text. DATA below is the historical, geographic and model foundation (the verified correction
   work): it must be byte-identical. Everything else is rendering or interface, and is listed. */
const fs=require("fs"), path=require("path");
let acorn; try{ acorn=require("acorn"); }catch(e){ acorn=require(path.join(__dirname,"node_modules","acorn")); }
const [A,B]=process.argv.slice(2).map(p=>path.resolve(p));
const DATA={
  "historical datasets":["ASSETS","GEOREF","NATION","CLAIM","CLAIM_FROM_CONF","STATUS","PHASES","FORMATIONS","FEATURES","SOURCE_NOTE",
    "ANALYSIS","COMMAND","KNOW_OVERRIDE","PLANS","ACTS","EVENTS","TOUR","OVERLAYS",
    /* Stage 6B: the historical appearance (appearance.js) */
    "APPEARANCE_GRADE","APPEARANCE_VOCAB","APPEARANCE_SOURCES","DRESS","COMPOSITION","COLOURS_CARRIED","STANDARD_MEASURES"],
  "geography and relief model":["W","M2W","UNITS_PER_KM","GOLDBACH_M","LITAVA_M","BROOKS_M","GOLDBACH,LITAVA,BROOKS","ROADS","WOODS","MARSH",
    "VINEYARD","VILLAGES","CHURCHES","CREST_M","TERRAIN_LINES","hash2","vnoise","dist2","pnoise","segDist","polyDist","smoothstep","bump","ell",
    "CREST","PRAT,VINO,PBERG,SANTON,ZURAN,SATS,MENI,SLAV,SCHLAP","regionalH","_RS,_RM","pondHold","regionalLevel","height","localHeight",
    "coverClass","hAt","COV_NX,COV_NZ,COV_X0,COV_Z0,COV_DX,COV_DZ","covWood,covMarsh,covVill,covRoad,covWater,covVine","buildCover","covAt",
    "G_NX,G_NZ,G_X0,G_Z0,G_DX,G_DZ","gridH,gridCurv","buildGrid","gridAt","CONTOUR_INTERVAL,CONTOUR_INDEX"],
  "movement, strength and confidence model":["stateAt","leavesOf","posOf","aggStrength","aggStatus","trackedDescendants","activeAt","ownStrengthAt",
    "sideOnFieldAt","GRADE_RANK","worseGrade","confAt","liveConf","aggConf","aggInterp","T_MIN,T_MAX","KM_PER_MAP","phaseAt","anchorList",
    "legPath","pointOnPath","legWindow","legAt","posAtClock","notYetAt","goneAt","headingAt","marchRate","posNow","SPEED_CEIL","TACTICAL_RATE,BATTLE_ORDER","wetAt",
    "nearSettlement","crossingProblem","auditMovement"],
  "historical appearance model (Stage 6B)":["appearanceOf"],
  "derived readings, sight and knowledge":["evWindow","evWeight","liveEvents","actOf","PLATEAU_POLY","onPlateau","plateauStrength","PBERG_NORTHING",
    "SEP_KM","sideCentroid","centreSeparation","EYE_OBSERVER_M,EYE_TARGET_M,LOS_CLEAR_M","hasLOS","knowledgeOf","familyOf","sampleVS","computeViewshed"],
  /* roadmap step 2 (docs/FINAL_AUDIT.md D-5): seven data declarations in app.js, five since C1 and two since C28 (the values typed into standardNotes and troopNotes are
     D-5 (b)). SUN_DAY: the sun's date (2 December 1805), place (the field's centre) and the clock read as local apparent time (decision
     69: a reading, not a finding; the clock basis of the sources' hours is not established); FEATURE_GT: which surveyed place
     (GEOREF.GT) a place's dossier quotes as "surveyed X m"; TIMING_TEXT, CONF_TEXT and CONF_INTERP: the timing and position grades as a
     visitor is told them. Since C28 (the completeness critic's item 6, after the reference moved to the step-2 build): POS_CLAIM, a
     formation's position grade as its pill words it (decision 128 (a)), and SRC_LABEL, the Command tab's source grades (DOCUMENTED,
     INFERRED, ANECDOTE): the same class, what a visitor is told a statement's or a position's grade is */
  "data in app.js (roadmap step 2, D-5)":["SUN_DAY","FEATURE_GT","TIMING_TEXT","CONF_TEXT","CONF_INTERP","POS_CLAIM","SRC_LABEL"]
};
function split(file){
  const h=fs.readFileSync(file,"utf8");
  const i=h.indexOf("<script>/* Embedded ground textures"), j=h.lastIndexOf("</script>");
  if(i<0||j<0) throw new Error("script block not found in "+file);
  return {head:h.slice(0,i), script:h.slice(i+8,j), tail:h.slice(j)};
}
function decls(src){
  const ast=acorn.parse(src,{ecmaVersion:2020,sourceType:"script"}), m=new Map(), unnamed={};
  ast.body.forEach(n=>{
    let k;
    if(n.type==="FunctionDeclaration") k=n.id.name;
    else if(n.type==="VariableDeclaration") k=n.declarations.map(d=>d.id.name).join(",");
    else { unnamed[n.type]=(unnamed[n.type]||0)+1; k="<"+n.type+" #"+unnamed[n.type]+">"; }
    if(m.has(k)) k=k+" (again)";
    m.set(k,src.slice(n.start,n.end));
  });
  return m;
}
const a=split(A), b=split(B), da=decls(a.script), db=decls(b.script);
const changed=[], added=[], removed=[];
for(const [k,v] of da){ if(!db.has(k)) removed.push(k); else if(db.get(k)!==v) changed.push(k); }
for(const k of db.keys()) if(!da.has(k)) added.push(k);
let bad=0;
console.log("original "+path.basename(A)+": "+da.size+" top-level statements;  patched "+path.basename(B)+": "+db.size);
console.log("\nDATA (must be byte-identical):");
for(const [group,names] of Object.entries(DATA)){
  const miss=names.filter(n=>!da.has(n)), diff=names.filter(n=>da.has(n)&&db.get(n)!==da.get(n));
  bad+=miss.length+diff.length;
  let bytes=0; names.forEach(n=>{ if(da.has(n)) bytes+=da.get(n).length; });
  console.log("  "+(diff.length||miss.length?"CHANGED ":"identical ")+group+": "+names.length+" declarations, "+bytes.toLocaleString()+" bytes"+
    (diff.length?"  changed: "+diff.join(", "):"")+(miss.length?"  not found: "+miss.join(", "):""));
}
const dataSet=new Set([].concat(...Object.values(DATA)));
const tex=[...da.keys()].filter(k=>/^ASSETS$/.test(k));
console.log("\nRendering and interface declarations changed ("+changed.length+"): "+changed.filter(k=>!dataSet.has(k)).join(", "));
console.log("Added ("+added.length+"): "+added.join(", "));
console.log("Removed ("+removed.length+"): "+(removed.join(", ")||"none"));
const cssA=a.head.slice(a.head.indexOf("<style>"),a.head.indexOf("</style>")), cssB=b.head.slice(b.head.indexOf("<style>"),b.head.indexOf("</style>"));
console.log("\nOutside the script: CSS "+(cssA===cssB?"identical":"changed (+"+(cssB.length-cssA.length)+" bytes; the original rules are "+(cssB.startsWith(cssA.slice(0,-1))?"kept verbatim, additions appended":"edited")+")")+
  "; markup "+(a.head.slice(a.head.indexOf("</style>"))===b.head.slice(b.head.indexOf("</style>"))?"identical":"changed")+"; closing "+(a.tail===b.tail?"identical":"changed"));
console.log(bad?"\nDATA CHANGED: "+bad:"\nAll "+dataSet.size+" DATA declarations are byte-identical to the original build.");
process.exit(bad?1:0);
