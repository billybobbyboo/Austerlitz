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
   (SPRITE_COL). White (a vertex-coloured material's neutral base) is not a palette colour. The paper map's ground is
   TOKENS.sym.paperMap.ground. Stage 6C (docs/STAGE6_SPEC.md sections 5 and 6.2) ends Stage 4E's exemption of the figures, coats and
   flags (formationAtlas, figKit, makeBlock, flagTexture): their colours are KIT's, or NATION's for the generic appearance. */
{
  const acorn=require('acorn'), perr=[];
  const ALLOW={"world.js":["COVER_COL","LAND_COL","WATER_COL"],"app.js":["LIGHT","LIGHT_RIG","SPRITE_COL","KIT"]};
  Object.keys(ALLOW).forEach(f=>{ const src=fs.readFileSync(f,'utf8'), ast=acorn.parse(src,{ecmaVersion:2020});
    ast.body.forEach(n=>{ const name=n.type==="FunctionDeclaration"?n.id.name:n.type==="VariableDeclaration"?n.declarations.map(d=>d.id.name).join(","):"("+n.type+")";
      const lit=(src.slice(n.start,n.end).match(/0x[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{6}\b/g)||[]).filter(x=>!/^(0x|#)(FFFFFF|ffffff)$/.test(x));
      if(lit.length&&!ALLOW[f].includes(name)) perr.push(f+": "+name+" has colour literals outside the palette tables ("+lit.slice(0,3).join(", ")+")"); }); });
  const T=fs.readFileSync('tokens.js','utf8'), W=fs.readFileSync('world.js','utf8');
  if(!/"ground":\s*\{"field":/.test(T)||!/paper:\s*COVER_KEYS\.map\(function\(k\)\{ return hexNumW\(TOKENS\.sym\.paperMap\.ground\[k\]\); \}\)/.test(W)) perr.push("the paper map's ground colours are not read from TOKENS.sym.paperMap.ground");
  perr.forEach(e=>console.log("  ! "+e));
  console.log("palette: "+(perr.length?perr.length+" wrong":"the landscape's colours in their tables (light, sprites, ground, land, water), the figures' in KIT, the paper map's ground in the tokens"));
  if(perr.length) process.exitCode=1;
}
/* Stage 6C (docs/STAGE6_SPEC.md section 6.2; owner decisions 99, 102-104, 109): KIT draws only what appearance.js names. Every KIT cloth
   colour is a colour class of APPEARANCE_VOCAB, and every class a settled claim (A or B) uses has a drawn value; every settled headgear
   class has a shape; a cuirass is drawn for exactly the classes whose claim settles that one was worn; no drawn cloth, black or horse
   darker than decision 84's black (#2E2B27) */
{
  const acorn=require('acorn'), vm=require('vm'), perr=[];
  const app=fs.readFileSync('app.js','utf8'), ast=acorn.parse(app,{ecmaVersion:2020});
  const kn=ast.body.find(n=>n.type==="VariableDeclaration"&&n.declarations.some(d=>d.id.name==="KIT"));
  const ctx={}; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync('data.js','utf8')+"\n"+fs.readFileSync('appearance.js','utf8')+"\n"+(kn?app.slice(kn.start,kn.end):"var KIT=null;")+
    "\nthis.X={KIT:KIT,DRESS:DRESS,VOCAB:APPEARANCE_VOCAB,CC:COLOURS_CARRIED};",ctx);
  const {KIT,DRESS,VOCAB}=ctx.X;
  if(!KIT) perr.push("app.js: no KIT table");
  else {
    const S=(v,k)=>!!(v&&!v.gen&&!v.none&&!v.sides&&(v.gr==="A"||v.gr==="B")&&v[k]&&v[k]!=="generic");
    const Y=h=>{ const l=c=>{ c/=255; return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4); }; return 0.2126*l((h>>16)&255)+0.7152*l((h>>8)&255)+0.0722*l(h&255); };
    const floor=Y(0x2E2B27);
    Object.keys(KIT.cloth).forEach(k=>{ if(k==="generic"||VOCAB.colour.indexOf(k)<0) perr.push("KIT.cloth \""+k+"\" is not a colour class of appearance.js");
      if(Y(KIT.cloth[k])<floor-1e-6) perr.push("KIT.cloth \""+k+"\" is darker than decision 84's black"); });
    Object.keys(KIT.head).forEach(k=>{ if(VOCAB.head.indexOf(k)<0) perr.push("KIT.head \""+k+"\" is not a headgear class of appearance.js");
      if(KIT.mat[KIT.head[k].col]===undefined) perr.push("KIT.head \""+k+"\" is drawn in no material of KIT"); });
    if(KIT.mat.black!==0x2E2B27) perr.push("KIT.mat.black is not decision 84's #2E2B27");
    Object.keys(KIT.horse).forEach(k=>{ if(Y(KIT.horse[k])<floor-1e-6) perr.push("KIT.horse \""+k+"\" is darker than decision 84's black"); });
    let used=0;
    Object.keys(DRESS).forEach(id=>{ const d=DRESS[id];
      ["coat","legwear"].forEach(a=>{ if(S(d[a],"c")){ used++; if(KIT.cloth[d[a].c]===undefined) perr.push(id+"."+a+": the colour \""+d[a].c+"\" has no drawn value"); } });
      if(S(d.head,"h")&&!KIT.head[d.head.h]) perr.push(id+".head: the headgear \""+d.head.h+"\" has no shape");
      if(S(d.horse,"c")&&KIT.horse[d.horse.c]===undefined) perr.push(id+".horse: \""+d.horse.c+"\" has no drawn value");
      const cu=!!(d.cuirass&&!d.cuirass.gen&&!d.cuirass.sides&&d.cuirass.has===true&&(d.cuirass.gr==="A"||d.cuirass.gr==="B"));
      if(cu!==(KIT.cuirass[id]!==undefined)) perr.push(id+": a cuirass "+(cu?"recorded but not drawn":"drawn but not recorded"));
      if(KIT.cuirass[id]!==undefined&&KIT.mat[KIT.cuirass[id]]===undefined) perr.push(id+": its cuirass in no material of KIT"); });
    /* Stage 6D: the standards' paintings and colours. A painting only where the colours entry's model is a claim graded A or B and the
       painting's source entry gives the pattern at A or B; every flag colour a word of the claims it draws; a lower bound only on a
       disputed count */
    const C6=ctx.X.CC, ok6=v=>!!(v&&!v.gen&&!v.none&&!v.sides&&(v.gr==="A"||v.gr==="B"));
    Object.keys(KIT.paint||{}).forEach(p=>{ const E=C6[KIT.paint[p].from]; if(!E||!ok6(E.pattern)) perr.push("KIT.paint."+p+": its source entry gives no pattern at A or B"); });
    Object.keys(KIT.carry||{}).forEach(k=>{ const E=C6[k], K=KIT.carry[k];
      if(!E) perr.push("KIT.carry."+k+": no such colours entry");
      else { if(K.paint&&(!KIT.paint[K.paint]||!ok6(E.model))) perr.push("KIT.carry."+k+": painted without a model graded A or B");
        if(K.lower&&!(E.count&&E.count.sides)) perr.push("KIT.carry."+k+": a lower bound on a count that is not disputed"); } });
    const words={white:["fr_eagle_inf","pattern"], red:["fr_eagle_inf","pattern"], blue:["fr_eagle_inf","pattern"], yellow:["at_inf","model"], black:["at_inf","pattern"], gilt:["fr_eagle_inf","finial"]};
    Object.keys(KIT.flag||{}).forEach(k=>{ const w=words[k], E=w&&C6[w[0]]&&C6[w[0]][w[1]];
      if(!E||(E.en||"").toLowerCase().indexOf(k)<0) perr.push("KIT.flag."+k+": not a word of the claim it draws"); });
    perr.forEach(e=>console.log("  ! "+e));
    console.log("kit: "+(perr.length?perr.length+" wrong":Object.keys(KIT.cloth).length+" cloth colours, all classes of appearance.js and none below decision 84's black; "+used+
      " settled coat and legwear values drawn; "+Object.keys(KIT.head).length+" headgear shapes; cuirasses for "+Object.keys(KIT.cuirass).join(", ")+
      "; "+Object.keys(KIT.paint).length+" standard paintings for "+Object.keys(KIT.carry).filter(k=>KIT.carry[k].paint).length+" colours entries, their "+Object.keys(KIT.flag).length+" colours words of their claims"));
  }
  if(perr.length) process.exitCode=1;
}
/* Stage 5B (docs/STAGE5_SPEC.md section A.5; decisions 4 and 15): the position-confidence marks carry the grade by sharpness, never by
   a dash or a dotted line, and their colour is the side's from the tokens */
{
  const acorn=require('acorn'), src=fs.readFileSync('app.js','utf8'), ast=acorn.parse(src,{ecmaVersion:2020}), cerr=[];
  const want=["confTexture","makeConfMark","confSize","confPlace"], seen={};
  ast.body.forEach(n=>{ if(n.type!=="FunctionDeclaration"||!want.includes(n.id.name)) return; seen[n.id.name]=1;
    const body=src.slice(n.start,n.end); if(/setLineDash|LineDashed|dashSize|dashRuns|segment/i.test(body)) cerr.push(n.id.name+" draws a dash"); });
  want.forEach(f=>{ if(!seen[f]) cerr.push(f+" missing"); });
  if(!/confPlace\(rec\[mk\],g,wq\[0\],wq\[1\],rec\.yaw\|\|0,fu\.W0\*fu\.sw,fu\.D0\*fu\.sd,hexNum\(side\)/.test(src)||!/side=TOKENS\.sym\.side\[sideOfNation\(f\.nation\)\]\.base/.test(src)) cerr.push("the marks' colour is not the side's token");
  if(!/layerOn=\{[^}]*confidence:true/.test(src)) cerr.push("position confidence is not on by default (decision 85)");
  cerr.forEach(e=>console.log("  ! "+e));
  console.log("confidence marks: "+(cerr.length?cerr.length+" wrong":"no dash, the side's token colour, on by default"));
  if(cerr.length) process.exitCode=1;
}
/* Stage 5D (docs/STAGE5_SPEC.md section B.4; decisions 4, 15, 90): the evidence skeleton draws no dash, its colour is the annotation
   token's, it is off by default with its "whole day" choice off, and both are in the layers panel */
{
  const acorn=require('acorn'), src=fs.readFileSync('app.js','utf8'), sh=fs.readFileSync('shell.html','utf8'), ast=acorn.parse(src,{ecmaVersion:2020}), kerr=[];
  const want=["skelTexture","skelScope","skelDrape","skelBuild","skelPlaceMarks","skelUpdate","groundPatch"], seen={};
  ast.body.forEach(n=>{ if(n.type!=="FunctionDeclaration"||!want.includes(n.id.name)) return; seen[n.id.name]=1;
    const body=src.slice(n.start,n.end); if(/setLineDash|LineDashed|dashSize|dashRuns|computeLineDistances/i.test(body)) kerr.push(n.id.name+" draws a dash"); });
  want.forEach(f=>{ if(!seen[f]) kerr.push(f+" missing"); });
  if(!/col=lin\(hexNum\(TOKENS\.sym\.label\[mode==="staff"\?"paper":"dark"\]\.annotation\)\)/.test(src)) kerr.push("the skeleton's colour is not the annotation token");
  if(!/layerOn=\{[^}]*skeleton:false/.test(src)) kerr.push("the evidence skeleton is not off by default");
  if(!/var SKEL=\{[^}]*day:false/.test(src)) kerr.push("the skeleton's whole day is not off by default (decision 90)");
  if(!/data-l="skeleton" aria-pressed="false"/.test(sh)||!/id="skel-day" aria-pressed="false"/.test(sh)) kerr.push("shell.html: the skeleton's buttons are missing or not off");
  kerr.forEach(e=>console.log("  ! "+e));
  console.log("evidence skeleton: "+(kerr.length?kerr.length+" wrong":"no dash, the annotation token's colour, off by default with the whole day off"));
  if(kerr.length) process.exitCode=1;
}
/* Stage 5E (docs/STAGE5_SPEC.md section D.5; decision 91): the Command view is one control, "Whose eyes?", labelled a model reading;
   the encoding it describes is the one drawn (no "broken outline"); the eye-level vantage is hidden until a headquarters is chosen */
{
  const sh=fs.readFileSync('shell.html','utf8'), src=fs.readFileSync('app.js','utf8'), werr=[];
  if(!/>Whose eyes\?</.test(sh)) werr.push("shell.html: no \u201cWhose eyes?\u201d control");
  if(/>Omniscient</.test(sh)||/See the field as a headquarters saw it/.test(sh)) werr.push("shell.html: the Command tab's old buttons or heading remain");
  if(!/A model reading: line of sight over this model's ground/.test(sh)||!/NOTE:"A model reading: line of sight over this model's ground/.test(src)) werr.push("the control or the eye's caption is not labelled a model reading");
  if(/broken outline/.test(src)) werr.push("app.js still describes a broken outline");
  if(!/data-v="eye" hidden/.test(sh)||!/id="eyego" type="button" hidden/.test(sh)) werr.push("the eye-level vantage is not hidden by default");
  if(!/id="eyesbtn"/.test(sh)) werr.push("the timeline has no \u201cWhose eyes?\u201d button");
  werr.forEach(e=>console.log("  ! "+e));
  console.log("Whose eyes: "+(werr.length?werr.length+" wrong":"one control, labelled a model reading, the eye's vantage hidden until a headquarters is chosen"));
  if(werr.length) process.exitCode=1;
}
/* Stage 5F (docs/STAGE5_SPEC.md section E.4; decisions 15, 93): the ordered routes are off by default, in the side's token colour, and
   their legend row uses the legend's own dash sample; their dash (planned, decision 15) is checked in binding-test.js */
{
  const sh=fs.readFileSync('shell.html','utf8'), src=fs.readFileSync('app.js','utf8'), rerr=[];
  if(!/layerOn=\{[^}]*routes:false/.test(src)) rerr.push("the ordered routes are not off by default (decision 93)");
  if(!/data-l="routes" aria-pressed="false"/.test(sh)) rerr.push("shell.html: the Ordered routes button is missing or not off");
  if(!/<b>Ordered routes<\/b>/.test(sh)||/ghost/i.test((sh.match(/data-l="routes"[^]*?<\/button>/)||[""])[0])) rerr.push("the layer is not named \u201cOrdered routes\u201d");
  if(!/lin\(hexNum\(TOKENS\.sym\.side\[sd\]\.base\)\),transparent:true,opacity:ROUTES\.OP/.test(src)) rerr.push("the routes' colour is not the side's token");
  if(!/data-lg="routes"><span>[^<]*not what was marched<\/span><span class="dsh"><\/span>/.test(sh)) rerr.push("the legend's routes row is missing, or not the dash sample");
  rerr.forEach(e=>console.log("  ! "+e));
  console.log("ordered routes: "+(rerr.length?rerr.length+" wrong":"off by default, named, the side's token colour, the legend's dash sample"));
  if(rerr.length) process.exitCode=1;
}
/* Stage 5G (docs/STAGE5_SPEC.md section F.3; decisions 15, 95): the day-track's colours are the tokens' (the paper map's ground, the paper
   ink, the side's deep), its legs solid and only the ordered route dashed; its stylesheet carries no colour of its own */
{
  const src=fs.readFileSync('app.js','utf8'), css=fs.readFileSync('style.css','utf8'), derr=[];
  const fn=(()=>{ const i=src.indexOf("function dayTrackEl("), j=src.indexOf("\n}\n",i); return i<0?"":src.slice(i,j); })();
  if(!fn) derr.push("dayTrackEl missing");
  if(!/P=TOKENS\.sym\.paperMap, ink=TOKENS\.sym\.label\.paper\.ink, side=TOKENS\.sym\.side\[sd\]\.deep/.test(fn)) derr.push("the inset's colours are not the tokens'");
  if(/#[0-9A-Fa-f]{3,6}\b/.test(fn)) derr.push("dayTrackEl writes a colour of its own");
  if((fn.match(/stroke-dasharray/g)||[]).length!==1||!/class="dt-route"[^>]*stroke-dasharray/.test(fn)) derr.push("something but the ordered route is dashed in the inset");
  const dtCss=(css.split("/* Stage 5G")[1]||""); if(/#[0-9A-Fa-f]{3,6}\b|rgb\(/.test(dtCss)) derr.push("style.css: the inset's rules carry a colour of their own");
  derr.forEach(e=>console.log("  ! "+e));
  console.log("day-track: "+(derr.length?derr.length+" wrong":"the tokens' colours, the legs solid and only the ordered route dashed"));
  if(derr.length) process.exitCode=1;
}
