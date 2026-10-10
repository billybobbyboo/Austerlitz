/* Stylesheet integrity: balance, cascade order, and no duplicated top-level rules.
   Added after a patch silently truncated the file at the first media query. */
const fs=require('fs');
const c=fs.readFileSync('style.css','utf8');
let errs=[];
const open=(c.match(/{/g)||[]).length, close=(c.match(/}/g)||[]).length;
if(open!==close) errs.push(`unbalanced braces: ${open} open, ${close} close`);

const clean=c.replace(/\/\*[\s\S]*?\*\//g,"");
const firstMedia=clean.indexOf("@media");
const base=firstMedia<0?clean:clean.slice(0,firstMedia);

/* Every rule with its @media context, media null for a base rule (roadmap step 1, docs/FINAL_AUDIT.md T-9 and the critic's violation 1:
   until step 1 the targeted checks below read every @media body merged with the base rules). One parse for every check of the rules: a
   check that a rule holds reads the base rules (a rule only inside an @media does not hold in every layout), a check that a rule is absent
   reads the base and every @media, and the type scan reads both. The parse reads @media one level deep: another at-rule or an @media
   inside an @media is an error, not a misread. */
const allRules=[];
{ const re=/@media([^{]*)\{|([^{}]+)\{([^{}]*)\}|\}/g; let m, media=null;
  for(const a of clean.matchAll(/@(?!media\b)[A-Za-z-]+/g)) errs.push("style.css: the at-rule "+a[0]+", which the rule parse does not read");
  while((m=re.exec(clean))!==null){
    if(m[1]!==undefined){ if(media!==null) errs.push("style.css: @media "+m[1].trim()+" inside @media "+media+", which the rule parse does not read"); media=m[1].trim(); continue; }
    if(m[2]===undefined){ media=null; continue; }
    const sel=m[2].trim().replace(/\s+/g," ");
    allRules.push({sel:sel, sels:sel.split(",").map(x=>x.trim()).filter(Boolean), body:m[3], media:media});
  }
}

/* top-level selectors only: a selector list starting at column 0 */
const rules=[...base.matchAll(/^([^@\s][^{}]*?)\{/gm)].map(m=>m[1].trim().replace(/\s+/g," "));
const seen={}, dupes=[];
rules.forEach(r=>{ if(seen[r]) dupes.push(r); seen[r]=1; });
if(dupes.length) errs.push("duplicated rules: "+[...new Set(dupes)].join(" | "));

const required=[
 ".tab-btn",".chap",".cmdrow",".planblock",".pill.claim-fact",".pill.claim-disputed",
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

/* The embedded type (decision 141; roadmap step 1, docs/FINAL_AUDIT.md T-0). fonts.css, written by tools/fonts/build-fonts.py and committed,
   is read as it ships: each face's WOFF2 decoded with Node's own brotli (tools/fonts/woff2.js). The type tokens name an embedded face first;
   every face is an embedded WOFF2 whose bytes and fonts.css's are the ones tools/fonts/manifest.json records (no hand edit), renamed (no
   source name, Bitstream or Vera in its names), carrying its copyright, its licence record and a note of its changes, with no OpenType
   feature outside FONT_FEATURES (calt would draw " x " as a multiplication sign and "->" as an arrow, altering quoted words), with
   font-display:swap, the three metric overrides and no size-adjust (so CSS px sizes and the 10.5 px floor stay what they say), and a
   unicode-range it has every code point of; the three licences in the header, and the build carrying fonts.css verbatim. Every glyph a
   visitor can be shown (every string and template in the scripts, with escapes and entities decoded, shell.html's text and attributes,
   style.css's content values) is in the sans faces, and in the serif unless SERIF_EXEMPT gives the reason and every source that can show
   it is the one file that reason names (check:contrast proves at run time that no visible text is drawn in any other face). No font-family or font shorthand outside the tokens, in style.css (base rules
   and every @media), shell.html or the presentation scripts. */
const TYPE_ERRS=[];
{
  const acorn=require("acorn"), W2=require("./tools/fonts/woff2.js"), crypto=require("crypto");
  const FAM={sans:"Austerlitz Sans",serif:"Austerlitz Serif"};
  const FONT_FEATURES=new Set(["kern","liga","ccmp","locl","mark","mkmk","rlig","clig","tnum"]);
  /* glyphs the serif may lack, each with its reason and the one source file the reason holds for: a code point is exempt only
     while every source that can show it is that file (a Cyrillic letter in analysis.js, whose text the serif draws, is an error) */
  const SERIF_EXEMPT=[[0x0400,0x045F,"appearance.js","Cyrillic: only in appearance.js (the sources' titles and quoted words), drawn in the sans (the sources sheet's lists, the dossier's Dress rows)"],
    [0x0462,0x0463,"appearance.js","the same: pre-reform Cyrillic in appearance.js, drawn in the sans"],[0x0472,0x0475,"appearance.js","the same"],
    [0x2502,0x2502,"shell.html","the timeline's event buttons (.tb-icon, sans; the glyph from DejaVu Sans)"],[0x25BA,0x25BA,"shell.html","the timeline's buttons (.tb-icon, sans)"],
    [0x25C4,0x25C4,"shell.html","the timeline's buttons (.tb-icon, sans)"]];
  /* where a font-family may be set outside the tokens, with the reason */
  const FONT_ALLOW=[["#devstats","the developer readout (aria-hidden, hidden unless the ` key or ?stats): a monospace stack is its purpose"]];
  const ENT={middot:"·",times:"×",asymp:"≈",ndash:"–",mdash:"—",hellip:"…",rdquo:"”",ldquo:"“",rsquo:"’",
    lsquo:"‘",minus:"−",lt:"<",gt:">",amp:"&",lsaquo:"‹",rsaquo:"›",laquo:"«",raquo:"»",frac12:"½",nbsp:" ",
    quot:'"',apos:"'",rarr:"→",larr:"←",uarr:"↑",darr:"↓",deg:"°",sect:"§",copy:"©"};
  const rd=f=>fs.readFileSync(f,"utf8");
  const first=v=>{ const m=/^\s*(?:"([^"]+)"|'([^']+)'|([^,]+))/.exec(v||""); return m?(m[1]||m[2]||m[3]).trim():""; };
  /* 1. the tokens name an embedded face first */
  const tok=JSON.parse(/\/\*TOKENS:BEGIN\*\/([\s\S]*)\/\*TOKENS:END\*\//.exec(rd("tokens.js"))[1]);
  for(const r of ["sans","serif"]) if(first(tok.type[r])!==FAM[r]) TYPE_ERRS.push(`tokens.js: the ${r} stack names ${first(tok.type[r])} first, not the embedded "${FAM[r]}"`);
  /* 2. fonts.css: the faces as they ship */
  const faces=[];
  if(!fs.existsSync("fonts.css")) TYPE_ERRS.push("fonts.css is missing (tools/fonts/build-fonts.py writes it)");
  else {
    const css=rd("fonts.css"), man=JSON.parse(rd("tools/fonts/manifest.json")), sha=b=>crypto.createHash("sha256").update(b).digest("hex");
    if(sha(Buffer.from(css,"utf8"))!==man.fonts_css.sha256) TYPE_ERRS.push("fonts.css is not the file tools/fonts/build-fonts.py wrote (its sha256 is not the manifest's): never edit it by hand");
    const blocks=[...css.matchAll(/@font-face\{([^}]*)\}/g)].map(m=>m[1]);
    if(blocks.length!==man.faces.length) TYPE_ERRS.push(`fonts.css has ${blocks.length} faces, the manifest ${man.faces.length}`);
    if(/src:url\((?!data:font\/woff2;base64,)/.test(css)||/@import|url\((?!data:)/.test(css)) TYPE_ERRS.push("fonts.css loads something that is not an embedded WOFF2");
    blocks.forEach((b,i)=>{
      const fam=(/font-family:"([^"]+)"/.exec(b)||[])[1], d=/src:url\(data:font\/woff2;base64,([A-Za-z0-9+\/=]+)\) format\("woff2"\)/.exec(b);
      if(!d){ TYPE_ERRS.push(`fonts.css: face ${i+1} (${fam}) is not an embedded WOFF2`); return; }
      const buf=Buffer.from(d[1],"base64"), m=man.faces[i]||{};
      if(sha(buf)!==m.woff2_sha256) TYPE_ERRS.push(`fonts.css: face ${i+1}'s WOFF2 is not the manifest's`);
      let names, cm, feats;
      try{ names=W2.nameRecords(buf); cm=W2.cmapCodepoints(buf); feats=W2.featureTags(buf,"GSUB").concat(W2.featureTags(buf,"GPOS")); }
      catch(e){ TYPE_ERRS.push(`fonts.css: face ${i+1} (${fam}) does not decode: ${e.message}`); return; }
      const ps=names[6]||"face "+(i+1);
      if(fam!==FAM.sans&&fam!==FAM.serif) TYPE_ERRS.push(`fonts.css: ${ps} declares the family "${fam}", which no token names`);
      if(names[1]!==fam||names[4]!==fam) TYPE_ERRS.push(`fonts.css: ${ps} calls itself "${names[1]}" / "${names[4]}", not "${fam}" (renamed: the GUST Font License's request, the Bitstream Vera licence, OFL practice)`);
      [1,3,4,6].forEach(id=>{ if(/Inter\b|Pagella|TeX Gyre|DejaVu|Bitstream|Vera\b/.test(names[id]||"")) TYPE_ERRS.push(`fonts.css: ${ps}'s name ${id} "${names[id]}" keeps a source's or a reserved name`); });
      if(!names[0]) TYPE_ERRS.push(`fonts.css: ${ps} carries no copyright record (name 0)`);
      if(!names[13]) TYPE_ERRS.push(`fonts.css: ${ps} carries no licence record (name 13)`);
      if(!/^Modified version of /.test(names[10]||"")) TYPE_ERRS.push(`fonts.css: ${ps} does not state its changes in name 10 (the LPPL's clause 6)`);
      feats.forEach(t=>{ if(!FONT_FEATURES.has(t)) TYPE_ERRS.push(`fonts.css: ${ps} keeps the OpenType feature ${t} (only ${[...FONT_FEATURES].join(" ")})`); });
      const ur=(/unicode-range:([^;}]+)/.exec(b)||[])[1]||"", range=[];
      if(!ur) TYPE_ERRS.push(`fonts.css: ${ps} declares no unicode-range`);
      ur.split(",").forEach(p=>{ const [a,z]=p.trim().slice(2).split("-"); const A=parseInt(a,16), Z=z?parseInt(z,16):A; for(let c=A;c<=Z;c++) range.push(c); });
      const notIn=range.filter(c=>!cm.has(c)); if(notIn.length) TYPE_ERRS.push(`fonts.css: ${ps} declares ${notIn.length} code points it lacks (U+${notIn[0].toString(16).toUpperCase()}...)`);
      if(!/font-display:swap/.test(b)) TYPE_ERRS.push(`fonts.css: ${ps} without font-display:swap (the boot line must never be invisible)`);
      ["ascent-override","descent-override","line-gap-override"].forEach(k=>{ if(!new RegExp(k+":[0-9.]+%").test(b)) TYPE_ERRS.push(`fonts.css: ${ps} without ${k} (the layout-compatibility metrics)`); });
      if(/size-adjust/.test(b)) TYPE_ERRS.push(`fonts.css: ${ps} sets size-adjust (CSS px sizes and the 10.5 px floor would no longer be what they say)`);
      faces.push({fam,cm:new Set(range.filter(c=>cm.has(c))),ps});
    });
    for(const r of ["sans","serif"]) if(!faces.some(f=>f.fam===FAM[r])) TYPE_ERRS.push(`fonts.css: no face of "${FAM[r]}"`);
    for(const [k,txt] of [["SIL Open Font License 1.1","SIL OPEN FONT LICENSE Version 1.1"],["GUST Font License","GUST Font License"],["Bitstream Vera licence","Bitstream Vera Fonts Copyright"],
      ["LaTeX Project Public License","LaTeX Project Public License"],["unmodified original's location","https://ctan.org/pkg/tex-gyre-pagella"]])
      if(!css.includes(txt)) TYPE_ERRS.push(`fonts.css: the ${k} text is not in its header`);
    if(fs.existsSync("austerlitz-command-map.html")&&!rd("austerlitz-command-map.html").includes(css)) TYPE_ERRS.push("austerlitz-command-map.html does not carry fonts.css verbatim (python3 build.py)");
  }
  /* 3. coverage: every glyph a visitor can be shown */
  const dec=s=>s.replace(/&#x([0-9a-f]+);/gi,(m,h)=>String.fromCodePoint(parseInt(h,16))).replace(/&#([0-9]+);/g,(m,n)=>String.fromCodePoint(+n))
    .replace(/&([a-z]+[0-9]*);/gi,(m,n)=>ENT[n]!=null?ENT[n]:(TYPE_ERRS.push("glyph scan: the entity &"+n+"; is not in css-test.js's table"),m));
  /* every code point a visitor can be shown, with every source file it comes from */
  const vis=new Map(), add=(s,where)=>{ for(const ch of s){ const c=ch.codePointAt(0); if(c>=0x20&&c!==0x7F&&!(c>=0x80&&c<0xA0)){ if(!vis.has(c)) vis.set(c,new Set()); vis.get(c).add(where); } } };
  const exempt=c=>SERIF_EXEMPT.some(([a,z,only])=>c>=a&&c<=z&&[...vis.get(c)].every(w=>w===only));
  for(const f of ["tokens.js","geo.js","data.js","appearance.js","analysis.js","world.js","symbols.js","app.js"])
    for(const t of acorn.tokenizer(rd(f),{ecmaVersion:2022})) if(t.type.label==="string"||t.type.label==="template") add(dec(String(t.value)),f);
  add(dec(rd("shell.html").replace(/<!--[\s\S]*?-->/g,"")),"shell.html");
  for(const m of clean.matchAll(/(?<![-\w])content:\s*"((?:[^"\\]|\\.)*)"/g)) add(m[1].replace(/\\([0-9a-fA-F]{1,6})\s?/g,(x,h)=>String.fromCodePoint(parseInt(h,16))),"style.css");
  for(const r of ["sans","serif"]){
    const F=faces.filter(f=>f.fam===FAM[r]); if(!F.length) continue;
    const miss=[...vis.keys()].filter(c=>!F.some(f=>f.cm.has(c))&&!(r==="serif"&&exempt(c)));
    if(miss.length) TYPE_ERRS.push(`coverage: ${miss.length} glyph(s) a visitor can be shown are not in "${FAM[r]}": `+
      miss.slice(0,12).map(c=>"U+"+c.toString(16).toUpperCase().padStart(4,"0")+" "+String.fromCodePoint(c)+" ("+[...vis.get(c)].join(", ")+")").join(", ")+(miss.length>12?" ...":""));
  }
  /* 4. no font set outside the tokens: style.css's rules with their @media context (base rules and every @media), shell.html, the scripts */
  { let n=0;
    for(const r of allRules){
      n++; const sel=r.sel, body=r.body, where=sel+(r.media?" (@media "+r.media+")":"");
      if(FONT_ALLOW.some(a=>sel===a[0])) continue;
      for(const d of body.matchAll(/(?:^|;)\s*font-family\s*:([^;]+)/g)) if(!/^\s*var\(--(sans|serif)\)\s*$/.test(d[1])) TYPE_ERRS.push(`style.css: ${where} sets font-family:${d[1].trim()} outside the tokens`);
      for(const d of body.matchAll(/(?:^|;)\s*font\s*:([^;]+)/g)) if(!/^\s*inherit\s*$/.test(d[1])) TYPE_ERRS.push(`style.css: ${where} sets the font shorthand ${d[1].trim()} outside the tokens`);
    }
    if(n<400) TYPE_ERRS.push("the type scan read only "+n+" rules of style.css (the parse is broken)"); }
  { const sh=rd("shell.html"); for(const m of sh.matchAll(/font-family\s*=|style="[^"]*font(?:-family)?\s*:/g)) TYPE_ERRS.push(`shell.html:${sh.slice(0,m.index).split("\n").length}: a font set outside the tokens`); }
  for(const f of ["app.js","symbols.js","world.js"]){ const s=rd(f); for(const m of s.matchAll(/font-family\s*[:=]|fontFamily\s*=|\.font\s*=|\bfont\s*:/g)) TYPE_ERRS.push(`${f}:${s.slice(0,m.index).split("\n").length}: a font set outside the tokens`); }
  console.log("embedded type: "+faces.length+" faces, "+vis.size+" distinct glyphs a visitor can be shown, "+TYPE_ERRS.length+" errors");
  TYPE_ERRS.forEach(e=>errs.push("type: "+e));
}

console.log("top-level rules:",rules.length,"| custom properties:",declared.size);
console.log("CSS ERRORS:",errs.length);
errs.forEach(e=>console.log("  ! "+e));
process.exitCode = errs.length?1:0;

/* --- targeted checks for the symptoms reported against the previous build --- */
/* lookups by exact selector in allRules (above). decls(sel): the base rules naming sel, their bodies joined (a rule that must hold);
   declsAll(sel): every rule naming sel, base and @media, each {media, body} (a rule that must be absent, a value that must hold in every
   layout); null if none */
function decls(sel){
  let body=null;
  allRules.forEach(r=>{ if(r.media===null&&r.sels.indexOf(sel)>=0) body=(body||"")+r.body; });
  return body===null?null:{body:body};
}
function declsAll(sel){
  const out=allRules.filter(r=>r.sels.indexOf(sel)>=0).map(r=>({media:r.media, body:r.body}));
  return out.length?out:null;
}
const declsOf=body=>[...body.matchAll(/(?:^|;)\s*([-\w]+)\s*:([^;]*)/g)].map(m=>[m[1],m[2].replace(/\s/g,"")]);
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
/* each in the base rules (since roadmap step 1 not satisfied by an @media), and set otherwise by no rule for that selector, base or @media */
checks.forEach(([sel,need,why])=>{
  const d=decls(sel);
  if(!d){ console.log("  ! no base rule for "+sel+" — "+why); cerrs++; return; }
  if(d.body.replace(/\s/g,"").indexOf(need.replace(/\s/g,""))<0){
    console.log("  ! "+sel+" lacks "+need+" in its base rules — "+why); cerrs++; return;
  }
  const prop=need.split(":")[0], val=need.slice(prop.length+1).replace(/\s/g,"");
  const other=(declsAll(sel)||[]).flatMap(r=>declsOf(r.body).filter(([p,v])=>p===prop&&v.replace(/!important$/,"")!==val).map(([p,v])=>p+":"+v+(r.media?" (@media "+r.media+")":" (a base rule)")));
  if(other.length){ console.log("  ! "+sel+" sets "+other.join(", ")+", not "+need+" — "+why); cerrs++; }
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
   flags (formationAtlas, figKit, makeBlock, flagTexture): their colours are KIT's, or NATION's for the generic appearance.
   Every spelling of a colour is read (roadmap step 1, docs/FINAL_AUDIT.md T-6: until step 1 only 0xRRGGBB and #RRGGBB, so eleven
   literals in five declarations went unseen, now in LAND_COL, LIGHT_RIG and KIT; symbols.js was not read, and has no table): 0xRRGGBB;
   #RGB, #RGBA, #RRGGBB, #RRGGBBAA; an rgb() or rgba() triple of numbers (the alpha may be computed); hsl() and hsla(); THREE.Color,
   .setRGB and .setHSL with three numbers. Not palette colours: white (the neutral base a material, an instance colour or a sprite's mask
   multiplies), and black where the canvas is compositing "destination-in" (the last globalCompositeOperation set before it in its
   declaration), an alpha mask, where only the alpha counts; the six-digit hex keeps the rule's exemption before step 1 (white written
   FFFFFF or ffffff, nothing else), so nothing that rule flagged passes now. GLSL's vec3 literals (the ground shader's frost and
   viewshed tints, the post chain's luma weights) are not read: shader source, not a canvas or material colour. */
{
  const acorn=require('acorn'), perr=[];
  const ALLOW={"world.js":["COVER_COL","LAND_COL","WATER_COL"],"app.js":["LIGHT","LIGHT_RIG","SPRITE_COL","KIT"],"symbols.js":[]};
  const LIT=/0x[0-9A-Fa-f]{6}\b|#(?:[0-9A-Fa-f]{8}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{3,4})\b|rgba?\(\s*\d+(?:\.\d+)?\s*,\s*\d+(?:\.\d+)?\s*,\s*\d+(?:\.\d+)?|hsla?\(\s*\d|THREE\.Color\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*\)|\.set(?:RGB|HSL)\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*\)/g;
  /* a literal's r, g, b (0-255), or null where it is not read (hsl, setHSL: never exempt) */
  const rgbOf=x=>{ let m;
    if((m=/^(?:0x|#)([0-9A-Fa-f]{6})(?:[0-9A-Fa-f]{2})?$/.exec(x))) return [0,2,4].map(i=>parseInt(m[1].substr(i,2),16));
    if((m=/^#([0-9A-Fa-f]{3,4})$/.exec(x))) return [0,1,2].map(i=>parseInt(m[1][i]+m[1][i],16));
    if((m=/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/.exec(x))) return [m[1],m[2],m[3]].map(Number);
    if((m=/^(?:THREE\.Color|\.setRGB)\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/.exec(x))) return [m[1],m[2],m[3]].map(v=>Math.round(+v*255));
    return null; };
  let nLit=0, nWhite=0, nMask=0;
  Object.keys(ALLOW).forEach(f=>{ const src=fs.readFileSync(f,'utf8'), ast=acorn.parse(src,{ecmaVersion:2020});
    ast.body.forEach(n=>{ const name=n.type==="FunctionDeclaration"?n.id.name:n.type==="VariableDeclaration"?n.declarations.map(d=>d.id.name).join(","):"("+n.type+")";
      const body=src.slice(n.start,n.end), lit=[]; let m; LIT.lastIndex=0;
      while((m=LIT.exec(body))){ nLit++; const c=rgbOf(m[0]);
        /* the six-digit hex: the exemption before step 1 only; the other spellings: white, or black in an alpha mask */
        if(/^(0x|#)[0-9A-Fa-f]{6}$/.test(m[0])){ if(/^(0x|#)(FFFFFF|ffffff)$/.test(m[0])){ nWhite++; continue; } }
        else if(c&&c.every(v=>v===255)){ nWhite++; continue; }
        else if(c&&c.every(v=>v===0)){ const ops=[...body.slice(0,m.index).matchAll(/globalCompositeOperation\s*=\s*"([a-z-]+)"/g)];
          if(ops.length&&ops[ops.length-1][1]==="destination-in"){ nMask++; continue; } }
        lit.push(m[0]+" (line "+src.slice(0,n.start+m.index).split("\n").length+")"); }
      if(lit.length&&!ALLOW[f].includes(name)) perr.push(f+": "+name+" has colour literals outside the palette tables ("+lit.slice(0,3).join(", ")+")"); }); });
  const T=fs.readFileSync('tokens.js','utf8'), W=fs.readFileSync('world.js','utf8');
  if(!/"ground":\s*\{"field":/.test(T)||!/paper:\s*COVER_KEYS\.map\(function\(k\)\{ return hexNumW\(TOKENS\.sym\.paperMap\.ground\[k\]\); \}\)/.test(W)) perr.push("the paper map's ground colours are not read from TOKENS.sym.paperMap.ground");
  perr.forEach(e=>console.log("  ! "+e));
  console.log("palette: "+(perr.length?perr.length+" wrong":"0 colour literals outside the tables ("+nLit+" read in "+Object.keys(ALLOW).join(", ")+"; "+nWhite+" white and "+nMask+
    " alpha-mask black exempt); the landscape's colours in their tables (light, sprites, ground, land, water), the figures' in KIT, the paper map's ground in the tokens"));
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
      if(!E||!new RegExp("\\b"+k+"\\b").test((E.en||"").toLowerCase())) perr.push("KIT.flag."+k+": not a word of the claim it draws"); });   /* a whole word (roadmap step 1, T-9: until step 1 a substring, "red" in "bordered") */
    perr.forEach(e=>console.log("  ! "+e));
    console.log("kit: "+(perr.length?perr.length+" wrong":Object.keys(KIT.cloth).length+" cloth colours, all classes of appearance.js and none below decision 84's black; "+used+
      " settled coat and legwear values drawn; "+Object.keys(KIT.head).length+" headgear shapes; cuirasses for "+Object.keys(KIT.cuirass).join(", ")+
      "; "+Object.keys(KIT.paint).length+" standard paintings for "+Object.keys(KIT.carry).filter(k=>KIT.carry[k].paint).length+" colours entries, their "+Object.keys(KIT.flag).length+" colours words of their claims"));
  }
  if(perr.length) process.exitCode=1;
}
/* roadmap step 2 (docs/FINAL_AUDIT.md D-5, D-6): what the presentation must not type or keep. (a) The sources sheet's notes on the troops
   and the standards, and the dossier's Dress, type no measure and no appearance grade's definition: every centimetre, metre and cloth size
   and the grades' words are read from appearance.js (runtime-test.js changes the table and reads them follow it); the light's note types no
   minutes (SUN_DAY's equation of time). (b) The dossier's place and march rows are built by posRow and marchRow, which tag the derived;
   paintSituation keeps no clock of its own for the plateau's note */
{ const acorn=require('acorn'), app=fs.readFileSync('app.js','utf8'), ast=acorn.parse(app,{ecmaVersion:2020}), derr=[];
  const fn=name=>ast.body.find(s=>s.type==="FunctionDeclaration"&&s.id.name===name);
  const lits=node=>{ const o=[]; (function w(x){ if(!x||typeof x.type!=="string") return;
    if(x.type==="Literal"&&typeof x.value==="string") o.push(x.value); else if(x.type==="TemplateLiteral") x.quasis.forEach(q=>o.push(q.value.cooked));
    for(const k in x){ if(k==="type"||k==="start"||k==="end") continue; const v=x[k]; if(Array.isArray(v)) v.forEach(w); else if(v&&typeof v.type==="string") w(v); } })(node); return o; };
  ["troopNotes","standardNotes","dressSection","lightNotes"].forEach(name=>{ const n=fn(name); if(!n){ derr.push("app.js: no "+name); return; }
    lits(n).forEach(s=>{ if(/\d\s*(cm|m)\b|\d\s*x\s*\d/.test(s)) derr.push(name+": a typed measure \u201c"+s.slice(0,60)+"\u201d (read it from appearance.js)");
      if(/documented for/.test(s)) derr.push(name+": a typed grade definition \u201c"+s.slice(0,60)+"\u201d (read APPEARANCE_GRADE)");
      if(name==="lightNotes"&&/\d+ minutes/.test(s)) derr.push("lightNotes: typed minutes \u201c"+s.slice(0,60)+"\u201d (read SUN_DAY)"); }); });
  const src=n=>n?app.slice(n.start,n.end):"";
  const dF=src(fn("dossierFormation")), cC=src(fn("compactCard")), pR=src(fn("posRow")), mR=src(fn("marchRow")), pS=src(fn("paintSituation"));
  if(!/posRow\(id,false\)/.test(dF)||!/marchRow\(id\)/.test(dF)||/Position at|Next move/.test(dF)) derr.push("dossierFormation: its place and march rows not built by posRow and marchRow");
  if(!/posRow\(id,true\)/.test(cC)||/row\("Where"/.test(cC)) derr.push("compactCard: its place row not built by posRow");
  if(!/derivedTag\(\)/.test(mR)||(pR.match(/derivedTag\(\)/g)||[]).length<2) derr.push("posRow/marchRow: the aggregate's midpoint or the march row without the derived tag");
  if(!pS) derr.push("app.js: no paintSituation");
  if(/(^|[^=!<>])=\s*clock\b/.test(pS)) derr.push("paintSituation: keeps a clock of its own (the plateau's note must follow the clock alone, plateauFlatFor)");
  derr.forEach(e=>console.log("  ! "+e));
  console.log("typed data and derived tags: "+(derr.length?derr.length+" wrong":"the troops' and the standards' notes and the Dress type no measure or grade definition, the light no minutes; the place and march rows tagged by posRow and marchRow; paintSituation keeps no clock"));
  if(derr.length) process.exitCode=1; }
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

/* Stage 7B (docs/STAGE7_SPEC.md section 6, 7B; owner decisions 111-113, 120): the first-run card is a modal dialog described by its key, with
   two buttons whose words come from LABELS (the primary and the stay), no hint and no "Watch the battle"; its buttons at least 24 px high
   (WCAG 2.2, 2.5.8); the docked dispatch is no longer hidden under it (decision 113), the undocked one still is (decision 58) */
{
  const sh=fs.readFileSync('shell.html','utf8'), app=fs.readFileSync('app.js','utf8'), ferr=[];
  const tag=(sh.match(/<div id="firstrun"[^>]*>/)||[""])[0];
  if(!/role="dialog"/.test(tag)||!/aria-modal="true"/.test(tag)||!/aria-labelledby="fr-title"/.test(tag)||!/aria-describedby="fr-key"/.test(tag))
    ferr.push("shell.html: the first-run card is not a modal dialog labelled by its title and described by its key: "+tag);
  const card=sh.slice(sh.indexOf('<div id="firstrun"'),sh.indexOf('<div id="toast"'));
  const ids=[...card.matchAll(/<button[^>]*id="([^"]+)"/g)].map(m=>m[1]);
  if(ids.join(",")!=="fr-tour,fr-close") ferr.push("shell.html: the first-run card's buttons are "+ids.join(", ")+", not the primary and the stay");
  if(/fr-hint|fr-watch/.test(card)) ferr.push("shell.html: the first-run card still carries the hint or \"Watch the battle\" (decision 120, decision 111)");
  /* roadmap step 2 (decision 127 (b); decision 108's decided words): the key's plateau sentence, written twice (shell.html's #fr-key, shown
     before start-up repaints it, and paintKey), labelled as this map's reading in both, the unlabelled verdict in neither */
  { const KEY127="The high ground in the centre is the Pratzen plateau, which this map reads as deciding the battle.";
    const frKey=((card.match(/<p id="fr-key">([\s\S]*?)<\/p>/)||[])[1]||"").replace(/\s+/g," ");
    const pk=(app.match(/function paintKey\(\)\{[\s\S]*?\n\}/)||[""])[0];
    if(frKey.indexOf(KEY127)<0) ferr.push("shell.html: #fr-key does not carry decision 127 (b)'s labelled sentence: "+frKey.slice(-120));
    if(pk.indexOf(JSON.stringify(KEY127))<0) ferr.push("app.js: paintKey does not write decision 127 (b)'s labelled sentence");
    if(/and it decides the battle/i.test(frKey+pk)) ferr.push("the first-run key still gives the unlabelled verdict \"and it decides the battle\" (decision 127 (b))"); }
  if(!/firstRun:\{primary:"[^"]+", primaryTitle:"[^"]+",\s*stay:"[^"]+", stayTitle:"[^"]+"\}/.test(app)) ferr.push("app.js: LABELS.firstRun (the card's words) is missing");
  if(!/fp\.textContent=F\.primary/.test(app)||!/fs\.textContent=F\.stay/.test(app)) ferr.push("app.js: applyLabels does not write the card's words from LABELS");
  /* the buttons' height in every layout (roadmap step 1, T-9: until step 1 the first min-height found, @media bodies merged): a base
     min-height for the card's buttons, and every height a rule naming them sets, base or @media, at least 24 px (a height auto and a
     max-height none set no limit) */
  const btnSel=s=>/\.fr-act \.t\b|#fr-tour\b|#fr-close\b/.test(s);
  const hs=allRules.filter(r=>r.sels.some(btnSel)).flatMap(r=>declsOf(r.body).filter(([p])=>/^(min-height|height|max-height)$/.test(p)).map(([p,v])=>({p:p,v:v,media:r.media,sel:r.sel})));
  const px=x=>{ const q=/^(\d+(?:\.\d+)?)px(?:!important)?$/.exec(x.v); return q?+q[1]:NaN; };
  const low=hs.filter(x=>!(px(x)>=24||(x.p==="height"&&/^auto(!important)?$/.test(x.v))||(x.p==="max-height"&&/^none(!important)?$/.test(x.v))));
  if(!hs.some(x=>x.p==="min-height"&&x.media===null&&x.sel==="#firstrun .fr-act .t"&&px(x)>=24)||low.length)
    ferr.push("style.css: the first-run card's buttons are not at least 24 px high in every layout: "+(low.length?low.map(x=>x.sel+"{"+x.p+":"+x.v+"}"+(x.media?" (@media "+x.media+")":"")).join(", "):"no base min-height for #firstrun .fr-act .t"));
  const hid=declsAll("body.firstrun-on .dispatch");
  if(hid) ferr.push("style.css: the dispatch is hidden under the first-run card ("+hid.map(r=>r.media?"@media "+r.media:"every layout").join(", ")+"; decision 113)");
  const und=decls("body.firstrun-on:not(.docked) .dispatch");
  if(!und||!/display:none/.test(und.body.replace(/\s/g,""))) ferr.push("style.css: the undocked dispatch card is not hidden under the first-run card (decision 58)");
  ferr.forEach(e=>console.log("  ! "+e));
  console.log("first run: "+(ferr.length?ferr.length+" wrong":"a modal dialog described by its key, the primary and the stay from LABELS, buttons at least 24 px, the docked dispatch shown under it"));
  if(ferr.length) process.exitCode=1;
}

/* Stage 7C (docs/STAGE7_SPEC.md section 6, 7C; decisions 115, 118): the opening's words are LABELS entries with no clock time, figure, proper
   name or quotation mark (the tour's text, TOUR, carries every claim it shows); the card's primary begins it; the bar is a region named by its
   count and title; the Skip button is the bar's own (its colours the tour bar's, from the tokens); the tools' button stands down while the
   card is open; the bar's arrows are a row of the key table */
{
  const acorn=require('acorn'), vm=require('vm'), app=fs.readFileSync('app.js','utf8'), sh=fs.readFileSync('shell.html','utf8'), oerr=[];
  const ast=acorn.parse(app,{ecmaVersion:2020}), ln=ast.body.find(n=>n.type==="VariableDeclaration"&&n.declarations.some(d=>d.id.name==="LABELS"));
  const ctx={}; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync('data.js','utf8')+"\n"+(ln?app.slice(ln.start,ln.end):"var LABELS={};")+"\nthis.X={L:LABELS,F:FORMATIONS,FE:FEATURES};",ctx);
  const {L,F,FE}=ctx.X, O=L.opening;
  const keys=["button","buttonTitle","head","back","next","finish","skip","skipTitle","said","ended","left","playing","paused","playText","saidPlay"];
  if(!O) oerr.push("app.js: LABELS.opening (the opening's words) is missing");
  else {
    const names=new Set();
    Object.keys(F).forEach(id=>[F[id].name,F[id].commander].forEach(n=>String(n||"").split(/[^A-Za-z\u00C0-\u017F]+/).forEach(w=>{ if(w.length>2&&/^[A-Z]/.test(w)) names.add(w); })));
    FE.forEach(f=>String(f.name||"").split(/[^A-Za-z\u00C0-\u017F]+/).forEach(w=>{ if(w.length>2&&/^[A-Z]/.test(w)) names.add(w); }));
    ["The","General","Marshal","Prince","Emperor","Count","First","Second","Third","Fourth","Fifth","Imperial","Guard","Column","Corps","Division","Brigade","Headquarters","Army"].forEach(w=>names.delete(w));
    keys.forEach(k=>{ const v=O[k];
      if(typeof v!=="string"||!v) { oerr.push("LABELS.opening."+k+" is missing"); return; }
      if(/\d/.test(v)) oerr.push("LABELS.opening."+k+" carries a figure or a clock time: "+v);
      if(/["'\u2018\u2019\u201c\u201d\u00ab\u00bb]/.test(v)) oerr.push("LABELS.opening."+k+" carries a quotation mark: "+v);
      v.split(/[^A-Za-z\u00C0-\u017F]+/).forEach(w=>{ if(names.has(w)) oerr.push("LABELS.opening."+k+" names \""+w+"\" (a formation, a commander or a place)"); }); });
    [L.firstRun.primary,L.firstRun.primaryTitle].forEach(v=>{ if(/\d|["\u201c\u201d]/.test(v)) oerr.push("LABELS.firstRun's primary words carry a figure or a quotation: "+v); });
    if(!/%k/.test(O.head)||!/%n/.test(O.head)||!/%t/.test(O.said)||!/%c/.test(O.ended)) oerr.push("LABELS.opening: the heading, the step's message or the end's message lost its placeholder");
  }
  const on=ast.body.find(n=>n.type==="VariableDeclaration"&&n.declarations.some(d=>d.id.name==="OPENING"));
  if(!on||!/stops:\[0,5,6,7\]/.test(app.slice(on.start,on.end))) oerr.push("app.js: OPENING's stops are not the tour's 1, 6, 7 and 8 (decision 114)");
  /* Stage 7D (decision 123): the clock played between the steps at 4x, the opening's own speed; the visitor's Play still starts at half speed (decision 74) */
  if(!on||!/SPEED:4\b/.test(app.slice(on.start,on.end))) oerr.push("app.js: OPENING.SPEED is not 4x (decision 123)");
  if(!/var playing=false, playRAF=0, speed=0\.5,/.test(app)) oerr.push("app.js: Play no longer starts at half speed (decision 74)");
  if(!/if\(OPENING\.play&&t&&t\.closest&&t\.closest\("#play"\)\) return;/.test(app)) oerr.push("app.js: the Play/Pause button does not pause the opening's played stretch");
  if(!/lv&&!OPENING\.applying&&!OPENING\.play/.test(app)) oerr.push("app.js: the phase announcements are not folded while the clock plays between steps");
  if(!/closeFirst\("open"\)/.test(app)||!/how==="open"\)\{ openingStart\(\)/.test(app)) oerr.push("app.js: the card's primary action does not begin the opening");
  const tb=(sh.match(/<div id="tourbar"[^>]*>/)||[""])[0];
  if(!/role="region"/.test(tb)||!/aria-labelledby="tour-n tour-t"/.test(tb)) oerr.push("shell.html: the bar is not a region named by its count and title: "+tb);
  if(!/<div class="tour-act">[\s\S]*?id="tour-exit"/.test(sh)) oerr.push("shell.html: the bar's Skip (tour-exit) is missing");
  const nx=decls("#tour-next"); if(!nx||!/var\(--text\)/.test(nx.body)||!/var\(--on-accent\)/.test(nx.body)) oerr.push("style.css: the bar's Next is not drawn from the tokens");
  const ob=decls("body.firstrun-on #openingbtn"); if(!ob||!/display:none/.test(ob.body.replace(/\s/g,""))) oerr.push("style.css: the tools' opening button does not stand down under the first-run card");
  if(!/\{id:"opening", scope:"bar", group:"Time", keys:\["ArrowLeft","ArrowRight"\]/.test(app)) oerr.push("app.js: the bar's arrows are not a row of the key table");
  if(!/if\(OPENING\.on\)\{ openingEnd\("skip"\); return; \}/.test(app)) oerr.push("app.js: Esc does not skip the opening");
  if(!/lv&&!OPENING\.applying/.test(app)) oerr.push("app.js: a step's phase announcement is not folded into its own message");
  oerr.forEach(e=>console.log("  ! "+e));
  console.log("opening: "+(oerr.length?oerr.length+" wrong":keys.length+" words in LABELS with no figure, clock, name or quotation; the tour's stops 1, 6, 7, 8; the clock played between them at 4x, Play still at half speed; begun by the card's primary; the bar a named region; Esc skips; one message a step"));
  if(oerr.length) process.exitCode=1;
}
/* roadmap step 3 (decision 133 (a); docs/FINAL_AUDIT.md SW-1): three.js from cdnjs r128 with its integrity and crossorigin, the start-up
   guard before it, the failure dialog's markup, the bundle's start through boot() (which reports and rethrows), the loop stopped on a
   failure, the context-loss notice. The page's behaviour is check:contrast's (tools/visual/boot-check.js) */
{
  const sh=fs.readFileSync('shell.html','utf8'), app=fs.readFileSync('app.js','utf8'), berr=[], crypto=require('crypto');
  const ext=sh.match(/<script\b[^>]*\bsrc=[^>]*>/g)||[];
  if(ext.length!==1) berr.push("shell.html: "+ext.length+" external scripts, not one");
  const tag=ext[0]||"", want="sha512-"+crypto.createHash("sha512").update(fs.readFileSync("node_modules/three/build/three.min.js")).digest("base64");
  if(!/\bsrc="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\/three\.min\.js"/.test(tag)) berr.push("shell.html: three.js is not cdnjs's r128: "+tag);
  if(!/\bcrossorigin="anonymous"/.test(tag)) berr.push("shell.html: the three.js tag has no crossorigin=\"anonymous\"");
  const ig=(/\bintegrity="([^"]+)"/.exec(tag)||[])[1];
  if(ig!==want) berr.push("shell.html: the three.js integrity is "+ig+", not the sha512 of node_modules/three/build/three.min.js (three 0.128.0, byte-identical to cdnjs's r128)");
  const gi=sh.indexOf("var AUS_BOOT="), ti=sh.indexOf(tag);
  if(gi<0||gi>ti) berr.push("shell.html: the start-up guard (AUS_BOOT) does not stand before the three.js tag");
  const bf=(sh.match(/<div id="boot-fail"[^>]*>/)||[""])[0];
  ['role="alertdialog"','aria-modal="true"','aria-labelledby="boot-h"','aria-describedby="boot-why"',' hidden'].forEach(a=>{ if(bf.indexOf(a)<0) berr.push("shell.html: #boot-fail lacks "+a); });
  if(!/<h2 id="boot-h">/.test(sh)||!/<div id="boot-why">/.test(sh)) berr.push("shell.html: the dialog's heading or description is missing");
  ["three","webgl","error"].forEach(k=>{ if(!new RegExp('<p data-boot="'+k+'" hidden>').test(sh)) berr.push("shell.html: no reason for the kind "+k); });
  if(!/<button id="boot-reload" type="button">/.test(sh)) berr.push("shell.html: Reload is not a button");
  if(!/<p id="boot-status" role="status" data-slow="[^"]+"><\/p>/.test(sh)) berr.push("shell.html: the slow start's status line is not an empty role=status");
  if(!/<div id="glnotice" role="alert"><\/div>/.test(sh)) berr.push("shell.html: the context-loss notice is not an empty alert");
  if(/localStorage|sessionStorage/.test(sh.slice(gi,ti))) berr.push("shell.html: the guard stores something");
  if(!/\nboot\(\);\s*$/.test(app)) berr.push("app.js: the bundle does not start through boot()");
  if(!/function boot\(\)\{\n  try\{ init\(\); \}\n  catch\(e\)\{ if\(typeof AUS_BOOT!=="undefined"&&AUS_BOOT\) AUS_BOOT\.fail\(e\.ausKind\|\|"error",e\); throw e; \}\n  if\(typeof AUS_BOOT!=="undefined"&&AUS_BOOT\) AUS_BOOT\.ok\(\);[^\n]*\n\}/.test(app)) berr.push("app.js: boot() does not report to the guard and rethrow");
  if(!/function loop\(\)\{\n  if\(bootFailed\(\)\) return;/.test(app)) berr.push("app.js: the loop does not stop after a failed start");
  if(!/catch\(e\)\{ e\.ausKind="webgl"; throw e; \}/.test(app)) berr.push("app.js: the renderer's failure is not told apart (webgl)");
  berr.forEach(e=>console.log("  ! "+e));
  console.log("start-up: "+(berr.length?berr.length+" wrong":"three.js from cdnjs r128 with its sha512 and crossorigin, the guard before it, the failure dialog, boot() reporting and rethrowing, the loop stopped on a failure, the context-loss notice"));
  if(berr.length) process.exitCode=1;
}
/* roadmap step 3 (decision 134 (a); docs/FINAL_AUDIT.md A-1): the single-key shortcuts switch: a toggle button in the "?" overlay, outside the
   list the app writes, on by default, nothing stored (decision 117), its words from LABELS; the window's handler and the opening's mute a
   typed character when it is off. Its behaviour is the self-test's and the harness's (real key presses) */
{
  const sh=fs.readFileSync('shell.html','utf8'), app=fs.readFileSync('app.js','utf8'), kerr=[];
  const hk=(sh.match(/<button id="help-keys"[^>]*>/)||[""])[0];
  if(!/type="button"/.test(hk)||!/aria-pressed="true"/.test(hk)) kerr.push("shell.html: #help-keys is not a toggle button, pressed by default: "+hk);
  const hs=sh.indexOf('<div id="help"'), hki=sh.indexOf('id="help-keys"'), hbi=sh.indexOf('<div id="help-body"');
  if(!(hs>=0&&hki>hs&&hki<hbi)) kerr.push("shell.html: the switch is not in the overlay before (outside) its key list");
  if(/class="[^"]*hp-row/.test(hk)) kerr.push("shell.html: the switch carries .hp-row (the overlay's check counts those as rows)");
  if(!/<i aria-hidden="true">/.test(sh.slice(hki,hki+200))) kerr.push("shell.html: the switch's on/off word is not hidden from its name");
  if(!/var SHORTCUTS=\{on:true\};/.test(app)) kerr.push("app.js: SHORTCUTS is not declared on by default");
  const fn=(n)=>{ const i=app.indexOf("function "+n+"("); return i<0?"":app.slice(i,app.indexOf("\n}",i)); };
  ["setShortcuts","paintShortcuts","onWindowKey"].forEach(n=>{ const b=fn(n); if(!b) kerr.push("app.js: "+n+" is missing"); else if(/localStorage|sessionStorage|indexedDB|document\.cookie/.test(b)) kerr.push("app.js: "+n+" stores something (decision 117)"); });
  if(/localStorage|sessionStorage|indexedDB/.test(app)) kerr.push("app.js: browser storage is used (decision 117: nothing stored)");
  if(!/if\(muted\) return;/.test(fn("onWindowKey"))) kerr.push("app.js: onWindowKey does not mute a typed character with the switch off");
  if(!/if\(shortcutMuted\(e\)\) return;/.test(app)) kerr.push("app.js: the opening's key listener does not mute a typed character with the switch off");
  if(!/keys:\{single:"Single-key shortcuts"/.test(app)) kerr.push("app.js: the switch's words are not in LABELS.keys");
  kerr.forEach(e=>console.log("  ! "+e));
  console.log("shortcuts switch: "+(kerr.length?kerr.length+" wrong":"a toggle button in the overlay outside its list, on by default, nothing stored, its words in LABELS, a typed character muted when off"));
  if(kerr.length) process.exitCode=1;
}
/* roadmap step 3 (docs/FINAL_AUDIT.md SW-3): the closed dossier hidden once it has slid away (visibility, delayed by the slide), shown at once
   when it opens; app.js's syncInert makes it inert while closed. Its behaviour is the self-test's */
{
  const css=fs.readFileSync('style.css','utf8'), derr=[];
  const base=(css.match(/\n\.drawer\{[^}]*\}/)||[""])[0], on=(css.match(/\n\.drawer\.on\{[^}]*\}/)||[""])[0];
  if(!/visibility:hidden/.test(base)||!/visibility 0s linear \.32s/.test(base)) derr.push("style.css: the closed .drawer is not hidden after its .32 s slide: "+base.trim());
  if(!/visibility:visible/.test(on)||!/visibility 0s\}/.test(on.replace(/;?\s*\}$/,"}"))) derr.push("style.css: the open .drawer is not shown at once: "+on.trim());
  if(!/k===dr&&!dOn/.test(fs.readFileSync('app.js','utf8'))) derr.push("app.js: syncInert does not make the closed dossier inert");
  derr.forEach(e=>console.log("  ! "+e));
  console.log("dossier hidden when closed: "+(derr.length?derr.length+" wrong":"hidden after its slide, shown at once, inert while closed"));
  if(derr.length) process.exitCode=1;
}
/* roadmap step 3 (docs/FINAL_AUDIT.md SW-10): the layout seams. The narrow layout's breakpoint is the complement of app.js's DOCK_MIN (a docked
   layout at exactly 1080 px also took the narrow rules); the resize handler sets the drawing buffer's density before its size; and no
   declaration inside an @media is overridden by a later base rule with the same selector and property (such a rule never applies) */
{
  const app=fs.readFileSync('app.js','utf8'), serr=[];
  const dock=+((/var DOCK_MIN=(\d+)/.exec(app)||[])[1]);
  const widths=[...clean.matchAll(/@media \(max-width:([\d.]+)px\)/g)].map(m=>+m[1]);
  if(!(dock>0)) serr.push("app.js: DOCK_MIN not found");
  if(widths.indexOf(dock)>=0) serr.push("style.css: @media (max-width:"+dock+"px) also applies to the docked layout at exactly "+dock+" px");
  if(widths.indexOf(dock-0.02)<0) serr.push("style.css: no narrow layout at (max-width:"+(dock-0.02)+"px), DOCK_MIN's complement");
  const rs=/function onResize\(\)\{[\s\S]*?\n  \}/.exec(app);
  if(!rs||!/setPixelRatio\(pxRatio\(\)\);[\s\S]*setSize\(/.test(rs[0])) serr.push("app.js: the resize handler does not set the density before the size");
  const dl=b=>b.split(";").map(x=>x.trim()).filter(Boolean).map(x=>{ const i=x.indexOf(":"); return [x.slice(0,i).trim(),x.slice(i+1).trim()]; });
  allRules.forEach((r,i)=>{ if(r.media===null) return;
    dl(r.body).forEach(([p,v])=>{ if(/!important$/.test(v)) return;
      r.sels.forEach(sel=>{ const later=allRules.slice(i+1).find(q=>q.media===null&&q.sels.indexOf(sel)>=0&&dl(q.body).some(([p2])=>p2===p));
        if(later) serr.push("style.css: "+sel+"{"+p+"} in @media "+r.media+" is overridden by a later base rule ("+later.sel+"), so it never applies"); }); }); });
  serr.forEach(e=>console.log("  ! "+e));
  console.log("layout seams: "+(serr.length?serr.length+" wrong":"the narrow layout below "+dock+" px only, the density set on resize, no @media declaration shadowed by a later base rule"));
  if(serr.length) process.exitCode=1;
}
/* roadmap step 3 (docs/FINAL_AUDIT.md S-6): reduced motion in the stylesheet (every transition and animation off under the preference) and
   followed live by the app (its media query's change event). Its behaviour is the self-test's and the harness's (emulateMedia) */
{
  const app=fs.readFileSync('app.js','utf8'), rerr=[];
  const rm=allRules.find(r=>r.media&&/prefers-reduced-motion:\s*reduce/.test(r.media)&&r.sels.indexOf("*")>=0);
  if(!rm||!/transition:none!important/.test(rm.body.replace(/\s/g,""))||!/animation:none!important/.test(rm.body.replace(/\s/g,""))) rerr.push("style.css: no rule turning every transition and animation off under prefers-reduced-motion");
  if(!/RM_MQ\.addEventListener\("change",rmChange\)/.test(app)) rerr.push("app.js: the reduced-motion preference is not followed live (rmChange)");
  rerr.forEach(e=>console.log("  ! "+e));
  console.log("reduced motion: "+(rerr.length?rerr.length+" wrong":"every transition and animation off in the stylesheet under the preference; the app follows it live"));
  if(rerr.length) process.exitCode=1;
}
