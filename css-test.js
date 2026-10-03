/* Stylesheet integrity: balance, cascade order, and no duplicated top-level rules.
   Added after a patch silently truncated the file at the first media query. */
const fs=require('fs');
const c=fs.readFileSync('style.css','utf8');
let errs=[];
if(c.count===undefined){}
const open=(c.match(/{/g)||[]).length, close=(c.match(/}/g)||[]).length;
if(open!==close) errs.push(`unbalanced braces: ${open} open, ${close} close`);

const clean=c.replace(/\/\*[\s\S]*?\*\//g,"");
const firstMedia=clean.indexOf("@media");
const base=firstMedia<0?clean:clean.slice(0,firstMedia);

/* top-level selectors only: a selector list starting at column 0 */
const rules=[...base.matchAll(/^([^@\s][^{}]*?)\{/gm)].map(m=>m[1].trim().replace(/\s+/g," "));
const seen={}, dupes=[];
rules.forEach(r=>{ if(seen[r]) dupes.push(r); seen[r]=1; });
if(dupes.length) errs.push("duplicated rules: "+[...new Set(dupes)].join(" | "));

const required=[
 ".tab-btn",".chap",".cmdrow",".planblock",".pill.claim-fact",
 "#viewmode",".vm-btn","#restore",".clockbox",".timerail",".rail-ticks b",".speeds",
 ".tb-trackwrap",".step",".timebar",".dispatch",".legend",".tools",".drawer",
 "body.pm-watch .rail","body.pm-map .rail","body.no-dispatch .dispatch"
];
const missing=required.filter(s=>!rules.some(r=>r===s||r.split(",").map(x=>x.trim()).includes(s)));
if(missing.length) errs.push("missing base rules: "+missing.join(", "));

/* every custom property used must be declared */
const used=new Set([...c.matchAll(/var\((--[\w-]+)\)/g)].map(m=>m[1]));
const declared=new Set([...c.matchAll(/(--[\w-]+)\s*:/g)].map(m=>m[1]));
const undecl=[...used].filter(v=>!declared.has(v));
if(undecl.length) errs.push("undeclared custom properties: "+undecl.join(", "));

console.log("top-level rules:",rules.length,"| custom properties:",declared.size);
console.log("CSS ERRORS:",errs.length);
errs.forEach(e=>console.log("  ! "+e));
process.exitCode = errs.length?1:0;

/* --- targeted checks for the symptoms reported against the previous build --- */
/* collect every rule as {selectors:[...], body} so lookups are exact */
const allRules=[];
{
  const re=/([^{}]+)\{([^{}]*)\}/g; let m;
  const flat=clean.replace(/@media[^{]*\{/g,"");
  while((m=re.exec(flat))!==null){
    const sels=m[1].split(",").map(x=>x.trim().replace(/\s+/g," ")).filter(Boolean);
    allRules.push({sels:sels, body:m[2]});
  }
}
function decls(sel){
  let body=null;
  allRules.forEach(r=>{ if(r.sels.indexOf(sel)>=0) body=(body||"")+r.body; });
  return body===null?null:{body:body};
}
const checks=[
 ["body.pm-map .dispatch","display:none","Clean (the presentation map) must hide the dispatch text"],
 ["body.pm-map .timebar","display:none","Clean (the presentation map) must hide the timeline"],
 ["body.pm-map .tools","display:none","Clean (the presentation map) must hide the controls"],
 ["body.pm-watch .dispatch","display:none","watch mode must hide the dispatch text"],
 ["body.pm-watch .tools","display:none","watch mode must hide the controls"],
 ["body.no-dispatch .dispatch","display:none","the text toggle must hide the dispatch"],
 [".rail-ticks b","position:absolute","hour labels must be positioned, not inline"],
 [".tab-btn","background:none","rail tabs must not render as default buttons"],
 [".vm-btn","cursor:pointer","the presentation control must be clickable"]
];
let cerrs=0;
checks.forEach(([sel,need,why])=>{
  const d=decls(sel);
  if(!d){ console.log("  ! no rule for "+sel+" — "+why); cerrs++; return; }
  if(d.body.replace(/\s/g,"").indexOf(need.replace(/\s/g,""))<0){
    console.log("  ! "+sel+" lacks "+need+" — "+why); cerrs++;
  }
});
console.log("behaviour checks:",checks.length-cerrs+"/"+checks.length+" pass");
if(cerrs) process.exitCode=1;

/* Stage 3E (docs/STAGE3_SPEC.md sections E and H; owner decision 50): the names, a static check over shell.html and the label
   table in app.js. No presentation is labelled "Map" and no ground "Staff map", "Terrain" or "Hybrid"; the identifiers
   (data-vm, data-m) are unchanged. */
{
  const sh=fs.readFileSync('shell.html','utf8'), app=fs.readFileSync('app.js','utf8'), nerr=[];
  const btn=(attr,val)=>{ const m=sh.match(new RegExp('<button[^>]*'+attr+'="'+val+'"[^>]*>([^<]*)</button>')); return m?m[1].trim():null; };
  const want={'data-vm':{study:"Study",watch:"Watch",map:"Clean"},'data-m':{terrain:"Landscape",staff:"Paper map",hybrid:"Landscape with counters"}};
  Object.keys(want).forEach(a=>Object.keys(want[a]).forEach(v=>{ const t=btn(a,v); if(t!==want[a][v]) nerr.push(a+'="'+v+'" is labelled '+JSON.stringify(t)+', not "'+want[a][v]+'"'); }));
  const i=app.indexOf("var LABELS="), j=app.indexOf("function applyLabels");
  if(i<0||j<0) nerr.push("app.js has no label table (LABELS)");
  else { const T=app.slice(i,j);
    [['study',"Study"],['watch',"Watch"],['map',"Clean"]].forEach(q=>{ if(!new RegExp(q[0]+':\\{label:"'+q[1]+'"').test(T)) nerr.push("LABELS.presentation."+q[0]+" is not "+q[1]); });
    if(/label:"Map"|label:"Staff map"|label:"Terrain"|label:"Hybrid"/.test(T)) nerr.push("the label table still names Map, Staff map, Terrain or Hybrid"); }
  if(/>\s*Staff map\s*</.test(sh)||/>Map&hellip;</.test(sh)||/aria-label="Map (mode|settings)"/.test(sh)) nerr.push("shell.html still says Staff map, Map\u2026 or Map mode/settings");
  nerr.forEach(e=>console.log("  ! "+e));
  console.log("names: "+(nerr.length?nerr.length+" wrong":"the presentations, the ground and the layers as decision 50 names them"));
  if(nerr.length) process.exitCode=1;
}
/* Stage 4B (docs/STAGE4_SPEC.md section A.6; decision 70): the grade carries no shadow toe and the landscape no baked hillshade,
   so neither can come back unmeasured; the light reads the computed sun and its table */
{
  const app=fs.readFileSync('app.js','utf8'), world=fs.readFileSync('world.js','utf8'), lerr=[];
  const i=app.indexOf("function initFX"), j=app.indexOf("function sizeFX");
  if(i<0||j<0) lerr.push("app.js: initFX not found");
  else if(/tt\*tt|shadow toe below/.test(app.slice(i,j))) lerr.push("the composite still lifts the shadows (the shadow toe)");
  if(!/float shL=paper>0\.5\?sh:0\.70;/.test(world)||/\(0\.70\+0\.42\*sh\)/.test(world)) lerr.push("world.js: the landscape bakes a hillshade again");
  if(!/var SUN_DAY=/.test(app)||!/var LIGHT_BY_ALT=/.test(app)||!/function applyLight\(/.test(app)) lerr.push("app.js: the computed sun or the light table is missing");
  if(/LIGHT\[[^\]]*\.light\]/.test(app)) lerr.push("app.js reads a phase's light preset on the landscape (LIGHT[...light])");
  lerr.forEach(e=>console.log("  ! "+e));
  console.log("light: "+(lerr.length?lerr.length+" wrong":"no shadow toe, no baked hillshade on the landscape, the light from the computed sun and its table"));
  if(lerr.length) process.exitCode=1;
}
/* Stage 4C (docs/STAGE4_SPEC.md sections B.4 and C.6): one atmosphere in the fog chunks; no recession, no mist sheets; the fog's top
   is the knowledge model's threshold; the legend says what the fog is */
{
  const app=fs.readFileSync('app.js','utf8'), world=fs.readFileSync('world.js','utf8'), sh=fs.readFileSync('shell.html','utf8'), aerr=[];
  if(/function fogShift\(/.test(app)) aerr.push("app.js: the fog's recession (fogShift) is back");
  if(/function mistSheet\(/.test(world)||/MIST_DRIFT/.test(world+app)) aerr.push("the mist sheets are back");
  if(!/C\.fog_fragment=/.test(app)||!/function applyAtmo\(/.test(app)) aerr.push("app.js: the atmosphere's fog chunks or applyAtmo are missing");
  if(!/FOG_TOP_H:-0\.8/.test(app)||!/hAt\(p\[0\],p\[1\]\)<-0\.8/.test(app)) aerr.push("the fog's top and the knowledge model's threshold are no longer the same -0.8");
  if(!/data-lg="fog"/.test(sh)) aerr.push("shell.html: the legend has no valley fog row");
  aerr.forEach(e=>console.log("  ! "+e));
  console.log("atmosphere: "+(aerr.length?aerr.length+" wrong":"the fog chunks and applyAtmo, no recession, no mist sheets, the fog's top the knowledge model's, its legend row"));
  if(aerr.length) process.exitCode=1;
}
/* Stage 4D (docs/STAGE4_SPEC.md section D.4; decisions 74, 75, 78): Play starts at half speed with its button pressed; the dwell's
   toggle in the layers panel, on; the phase boundary's glide not used while playing */
{
  const app=fs.readFileSync('app.js','utf8'), sh=fs.readFileSync('shell.html','utf8'), perr=[];
  if(!/var playing=false, playRAF=0, speed=0\.5,/.test(app)) perr.push("app.js: the default speed is not half speed");
  if(!/data-s="0\.5" aria-pressed="true"/.test(sh)||/data-s="1" aria-pressed="true"/.test(sh)) perr.push("shell.html: the half-speed button is not the pressed one");
  if(!/id="dwell" aria-pressed="true"/.test(sh)) perr.push("shell.html: the dwell's toggle is missing or off");
  if(!/camMove=moveCam && !freeCam && mode!=="staff" && !playing/.test(app)) perr.push("app.js: the phase boundary's glide runs while playing");
  if(!/function followStep\(/.test(app)||!/function dwellAdvance\(/.test(app)) perr.push("app.js: followStep or dwellAdvance missing");
  perr.forEach(e=>console.log("  ! "+e));
  console.log("pacing: "+(perr.length?perr.length+" wrong":"half speed by default, its button pressed; the dwell's toggle on; no phase glide while playing"));
  if(perr.length) process.exitCode=1;
}
/* Stage 4E (docs/STAGE4_SPEC.md section G.3; owner decision 79): the landscape's colours live in their tables. Every colour literal
   in world.js is in COVER_COL, LAND_COL or WATER_COL; in app.js in the light's tables (LIGHT, LIGHT_RIG) or the sprite palette
   (SPRITE_COL), or in the figures, coats and flags, which are Stage 6's (formationAtlas, figKit, makeBlock, flagTexture). White
   (a vertex-coloured material's neutral base) is not a palette colour. The paper map's ground is TOKENS.sym.paperMap.ground. */
{
  const acorn=require('acorn'), perr=[];
  const ALLOW={"world.js":["COVER_COL","LAND_COL","WATER_COL"],"app.js":["LIGHT","LIGHT_RIG","SPRITE_COL","formationAtlas","figKit","makeBlock","flagTexture"]};
  Object.keys(ALLOW).forEach(f=>{ const src=fs.readFileSync(f,'utf8'), ast=acorn.parse(src,{ecmaVersion:2020});
    ast.body.forEach(n=>{ const name=n.type==="FunctionDeclaration"?n.id.name:n.type==="VariableDeclaration"?n.declarations.map(d=>d.id.name).join(","):"("+n.type+")";
      const lit=(src.slice(n.start,n.end).match(/0x[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{6}\b/g)||[]).filter(x=>!/^(0x|#)(FFFFFF|ffffff)$/.test(x));
      if(lit.length&&!ALLOW[f].includes(name)) perr.push(f+": "+name+" has colour literals outside the palette tables ("+lit.slice(0,3).join(", ")+")"); }); });
  const T=fs.readFileSync('tokens.js','utf8'), W=fs.readFileSync('world.js','utf8');
  if(!/"ground":\s*\{"field":/.test(T)||!/paper:\s*COVER_KEYS\.map\(function\(k\)\{ return hexNumW\(TOKENS\.sym\.paperMap\.ground\[k\]\); \}\)/.test(W)) perr.push("the paper map's ground colours are not read from TOKENS.sym.paperMap.ground");
  perr.forEach(e=>console.log("  ! "+e));
  console.log("palette: "+(perr.length?perr.length+" wrong":"the landscape's colours in their tables (light, sprites, ground, land, water), the paper map's ground in the tokens"));
  if(perr.length) process.exitCode=1;
}
