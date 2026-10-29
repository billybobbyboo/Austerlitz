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
/* no selector list declared twice in one context: the base rules (all of them, wherever they stand between the @media blocks; until roadmap
   step 5 only those before the first @media were read, and four selectors were declared twice: #firstrun, #firstrun h2, #firstrun p,
   .legend .ar), or one @media block */
{ const seen={}, dupes=[]; let blk=0, prev;
  allRules.forEach(r=>{ if(r.media!==prev){ blk++; prev=r.media; } const k=(r.media===null?"base":"@media "+r.media+" #"+blk)+" | "+r.sel;
    if(seen[k]) dupes.push(r.media===null?r.sel:r.sel+" (in @media "+r.media+")"); seen[k]=1; });
  if(dupes.length) errs.push("duplicated rules: "+[...new Set(dupes)].join(" | ")); }

const required=[
 ".tab-btn",".chap",".cmdrow",".planblock",".pill.claim-fact",".pill.claim-disputed",".pill.claim-interp",
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
  const LS=require("./tools/lang-scan.js");   /* roadmap step 5: the one walker and entity table (tools/lang-scan.js) */
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
  const dec=s=>LS.decodeEntities(s,n=>TYPE_ERRS.push("glyph scan: the entity &"+n+"; is not in tools/lang-scan.js's table"));
  /* every code point a visitor can be shown, with every source file it comes from */
  const vis=new Map(), add=(s,where)=>{ for(const ch of s){ const c=ch.codePointAt(0); if(c>=0x20&&c!==0x7F&&!(c>=0x80&&c<0xA0)){ if(!vis.has(c)) vis.set(c,new Set()); vis.get(c).add(where); } } };
  const exempt=c=>SERIF_EXEMPT.some(([a,z,only])=>c>=a&&c<=z&&[...vis.get(c)].every(w=>w===only));
  /* roadmap step 5 (the step-1 hand-on): the strings are tools/lang-scan.js's records (every string of the built scripts but assets.js's
     data URIs, tokens.js's TOKENS, shell.html's text and visitor attributes), their entities decoded by its table; until step 5 an acorn
     tokenizer of its own here, and shell.html read whole */
  for(const r of LS(process.cwd()).records) if(r.file!=="assets.js") add(dec(r.text),r.file);
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
  if(!/var playing=false, speed=0\.5,/.test(app)) perr.push("app.js: the default speed is not half speed");
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
   flags (then formationAtlas, removed in 6C; figKit, makeBlock, flagTexture): their colours are KIT's, or NATION's for the generic appearance.
   Every spelling of a colour is read (roadmap step 1, docs/FINAL_AUDIT.md T-6: until step 1 only 0xRRGGBB and #RRGGBB, so eleven
   literals in five declarations went unseen, now in LAND_COL, LIGHT_RIG and KIT; symbols.js was not read, and has no table): 0xRRGGBB;
   #RGB, #RGBA, #RRGGBB, #RRGGBBAA; an rgb() or rgba() triple of numbers (the alpha may be computed); hsl() and hsla(); THREE.Color,
   .setRGB and .setHSL with three numbers. Not palette colours: white (the neutral base a material, an instance colour or a sprite's mask
   multiplies), and black where the canvas is compositing "destination-in" (the last globalCompositeOperation set before it in its
   declaration), an alpha mask, where only the alpha counts; the six-digit hex keeps the rule's exemption before step 1 (white written
   FFFFFF or ffffff, nothing else), so nothing that rule flagged passes now. Since roadmap step 5 (the step-1 hand-on) GLSL's vec3 and
   vec4 literals of three or four numbers (since the review of b588b37 also components that are expressions beginning with a number, the
   elevation tints') in shader source are read too (until step 5 they were not: the ground shader's crop tints,
   frost and viewshed tints, now LAND_COL.glsl); a luma weight (the vector a dot() takes with a colour) is not a colour. */
{
  const acorn=require('acorn'), perr=[];
  const ALLOW={"world.js":["COVER_COL","LAND_COL","WATER_COL"],"app.js":["LIGHT","LIGHT_RIG","SPRITE_COL","KIT"],"symbols.js":[]};
  const LIT=/vec[34]\(\s*-?[\d.][^,()]*,\s*-?[\d.][^,()]*,\s*-?[\d.][^,()]*(?:,\s*-?[\d.][^,()]*)?\)|0x[0-9A-Fa-f]{6}\b|#(?:[0-9A-Fa-f]{8}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{3,4})\b|rgba?\(\s*\d+(?:\.\d+)?\s*,\s*\d+(?:\.\d+)?\s*,\s*\d+(?:\.\d+)?|hsla?\(\s*\d|THREE\.Color\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*\)|\.set(?:RGB|HSL)\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*\)/g;
  /* a literal's r, g, b (0-255), or null where it is not read (hsl, setHSL: never exempt) */
  const rgbOf=x=>{ let m;
    if((m=/^(?:0x|#)([0-9A-Fa-f]{6})(?:[0-9A-Fa-f]{2})?$/.exec(x))) return [0,2,4].map(i=>parseInt(m[1].substr(i,2),16));
    if((m=/^#([0-9A-Fa-f]{3,4})$/.exec(x))) return [0,1,2].map(i=>parseInt(m[1][i]+m[1][i],16));
    if((m=/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/.exec(x))) return [m[1],m[2],m[3]].map(Number);
    if((m=/^(?:THREE\.Color|\.setRGB)\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/.exec(x))) return [m[1],m[2],m[3]].map(v=>Math.round(+v*255));
    return null; };
  let nLit=0, nWhite=0, nMask=0, nLuma=0;
  Object.keys(ALLOW).forEach(f=>{ const src=fs.readFileSync(f,'utf8'), ast=acorn.parse(src,{ecmaVersion:2020});
    ast.body.forEach(n=>{ const name=n.type==="FunctionDeclaration"?n.id.name:n.type==="VariableDeclaration"?n.declarations.map(d=>d.id.name).join(","):"("+n.type+")";
      const body=src.slice(n.start,n.end), lit=[]; let m; LIT.lastIndex=0;
      while((m=LIT.exec(body))){ nLit++; const c=rgbOf(m[0]);
        if(/^vec/.test(m[0])&&/dot\(\s*\w+\s*,\s*$/.test(body.slice(Math.max(0,m.index-16),m.index))){ nLuma++; continue; }   /* a luma weight */
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
    " alpha-mask black and "+nLuma+" GLSL luma weights exempt); the landscape's colours in their tables (light, sprites, ground, land, water), the figures' in KIT, the paper map's ground in the tokens"));
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
    /* roadmap step 5 (the step-1 hand-on): a standard's threads (KIT.weave laid over each cloth, flagTexture) on every cloth a standard is
       drawn in, KIT.flag's and each nation's plain cloth, at decision 84's black or lighter */
    { const wv=/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/.exec(KIT.weave||"");
      if(!wv) perr.push("KIT.weave is not an rgba() colour");
      else { const a=+wv[4], W=[+wv[1],+wv[2],+wv[3]], NAT=vm.runInContext("NATION",ctx);
        const cloths=Object.keys(KIT.flag).map(k=>["KIT.flag."+k,KIT.flag[k]]).concat(Object.keys(NAT).map(n=>["NATION."+n+".fill",parseInt(NAT[n].fill.slice(1),16)]));
        cloths.forEach(([n,c])=>{ const m=[16,8,0].map((sh,i)=>Math.round(((c>>sh)&255)*(1-a)+W[i]*a)), h=(m[0]<<16)|(m[1]<<8)|m[2];
          if(Y(h)<floor-1e-6) perr.push("the weave's threads on "+n+" ("+c.toString(16)+") fall below decision 84's black"); }); } }
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
/* Stage 8, implementation PR 8B (decision 241; docs/STAGE8_SPEC.md section 14): the decided values in place: the movement arrows' casing at most
   16 px on screen and their fill at 0.62 of its opacity, the casing at its own; the event glyphs and the objective markers at most 64 px; the cap
   and the fill on the movement arrows and their drawn-on parts only, the ground's test on every overlay ribbon and the lines' ticks */
{
  const src=fs.readFileSync('app.js','utf8'), aerr=[];
  if(!/var ARROW_CAP=\{PX:16, Q:1\.1, OP:0\.62, M:0\.97\}/.test(src)) aerr.push("ARROW_CAP is not {PX:16, Q:1.1, OP:0.62, M:0.97}");
  if(!/var ARROW_EDGE_OP=1;/.test(src)) aerr.push("the casing's opacity is not its own (ARROW_EDGE_OP 1)");
  if(!/var SYM_MAX_PX=64, SYM_FADE=\[4,12\];/.test(src)) aerr.push("the glyphs' cap is not 64 px");
  const caps=(src.match(/cap:true, fillOp:ARROW_CAP\.OP, edgeOp:ARROW_EDGE_OP, border:true, ground:true, role:"(arrow|drawon)"/g)||[]).length;
  if(caps!==2) aerr.push("the cap, the fill and the bordered casing on "+caps+" drawers, not the arrows' and their drawn-on parts'");
  if(/border:true[^}]*role:"(halt|line|bound)"/.test(src)) aerr.push("a line, boundary or halt bar has a bordered casing");
  /* the border in the two perspective presentations only: on the paper map nothing changes (0.3.1 item 4), the casing under the whole fill */
  if(!/BORDER\.U\.value=paper\?0:1;/.test(src)||(src.match(/sh\.uniforms\.uBorder=BORDER\.U;/g)||[]).length!==2||(src.match(/if\(uBorder>0\.5&&/g)||[]).length!==2)
    aerr.push("the casing's border is not switched off on the paper map (BORDER.U, uBorder in both hooks)");
  ["halt","line","bound"].forEach(r=>{ if(!new RegExp('ground:true,role:"'+r+'"\\}').test(src)) aerr.push("the "+r+"s are not tested against the ground"); });
  if(/cap:true[^}]*role:"(halt|line|bound)"/.test(src)) aerr.push("a line, boundary or halt bar is capped");
  if(!/lm\.onBeforeCompile=groundDepthHook;/.test(src)) aerr.push("the lines' ticks are not tested against the ground");
  if(!/function groundDepthHook\(sh\)\{\n  atmoUniforms\(sh\);/.test(src)) aerr.push("the ground's hook drops the atmosphere's uniforms (a fogged tick drawn black)");
  aerr.forEach(e=>console.log("  ! "+e));
  console.log("arrows and glyphs (decision 241): "+(aerr.length?aerr.length+" wrong":"the cap 16 px, the fill 0.62 and the casing a border on the movement arrows and their drawn-on parts (the border in the perspective presentations only), the glyphs at 64 px, every overlay ribbon and tick tested against the ground"));
  if(aerr.length) process.exitCode=1;
}
/* Stage 8, implementation PR 8C (decision 240 (a); docs/STAGE8_SPEC.md sections 3.3, 7.2 and 15): the map layer in motion. The decided values
   in place (the re-placement pass every 333 ms, two passes with room before an item returns, the band of 8%, fades of 180 ms of wall-clock time,
   the far step at 1.5 times the eye's distance to its target); the motion read from the app's own state, never from a switch a harness sets;
   no fade under reduced motion (the hold and the band kept); the band on every distance switch and released at rest; what is never dropped and
   the keyboard's focus placed by the full search; every discontinuity a fresh view; a remnant under the live items and taking no pointer; the far
   step only on the names at t-small (decision 16: t-micro, the tertiary floor) */
{
  const acorn=require('acorn'), src=fs.readFileSync('app.js','utf8'), css=fs.readFileSync('style.css','utf8'), ast=acorn.parse(src,{ecmaVersion:2020}), merr=[];
  const fn=name=>{ const n=ast.body.find(q=>q.type==="FunctionDeclaration"&&q.id.name===name); return n?src.slice(n.start,n.end):null; };
  if(!/var MLS=\{EVERY:333, PASSES:2, BAND:0\.08, FADE_MS:180, JUMP_MIN:5, JUMP_VIEW:0\.6, JUMP_DEG:40, FAR:1\.5,/.test(src))
    merr.push("MLS is not {EVERY:333, PASSES:2, BAND:0.08, FADE_MS:180, JUMP_MIN:5, JUMP_VIEW:0.6, JUMP_DEG:40, FAR:1.5}");
  const ms=fn("mlMotionSource");
  if(!ms||!/return !!\(tween\|\|playing\|\|now-lastInput<INPUT_HOLD_MS\|\|now<panelMoveUntil\); \}$/.test(ms)) merr.push("mlMotionSource does not read the app's own state alone (a tween, Play, an input's hold, a panel's move)");
  if(/AUSTERLITZ_DEBUG|window\.__|MOVING/.test(ms||"")) merr.push("mlMotionSource reads a switch outside the app's state");
  if(!/MLS\.fadeOn=!RM&&!MLS\.fresh&&MLS\.fromMotion;/.test(src)) merr.push("the fades are not off under reduced motion and in a fresh view (MLS.fadeOn)");
  const lay=fn("mlLayout")||"";
  /* Stage 8, 8D's prerequisite (the audit of 8C): what the stabiliser never holds (the never-dropped, the forced focus, the item with the focus)
     takes its state at once, as an item does where the fades are off */
  if(!/var tg=on\?1:0, prot=it\.keep\|\|it\.forced\|\|it\.el===foc;/.test(lay)||!/if\(!MLS\.fadeOn\|\|prot\) it\.fa=tg;/.test(lay))
    merr.push("mlLayout does not draw an item at once where the fades are off, or a protected item (never dropped, the focus) at its fade's alpha");
  /* ... and its own presentation opacity (o.op: an overlay's fade-in) still multiplies its fade's alpha */
  if(!/var op=on\?\(it\.op<1\?Math\.max\(0,it\.op\):1\)\*it\.fa:\(rm\?it\.fa:1\)/.test(lay)) merr.push("a drawn item's opacity is no longer its presentation opacity times its fade's alpha");
  if(!/for\(var ik=0;ik<nk;ik\+\+\)\{ var kt=order\[ik\]; kt\.held=false; if\(!\(mlPlaceItem\(kt,VW,VH,panels,obst\)\|\|mlWrapPlace\(kt,VW,VH,panels,obst\)\)\) kt\.state="dropped"; \}/.test(lay))
    merr.push("what is never dropped is not placed first by the full search (decision 39)");
  if(!/if\(s==="build"\|\|it\.el===foc\) return mlPlaceItem\(it,VW,VH,panels,obst\);/.test(lay)) merr.push("the keyboard's focus is not placed by the full search in motion");
  if(!/it\.room2>=MLS\.PASSES/.test(lay)||!/if\(!MLS\.pass\)\{ it\.held=true; return false; \}/.test(lay)) merr.push("a hidden item does not wait for the re-placement passes");
  const band=fn("mlBand")||"";
  if(!/if\(!mlMotionSource\(performance\.now\(\)\)\|\|!\(d>0\)\)\{ MLS\.bandD=null; MLS\.band=\{\}; return d; \}/.test(band)) merr.push("the band is not released at rest (mlBand)");
  if(!/if\(!\(d>0\)\|\|!mlMotionSource\(performance\.now\(\)\)\) return d;/.test(fn("mlBandAt")||"")) merr.push("the band is not released at rest (mlBandAt)");
  [["mlBand(viewDist())","the distance switches"],['mlBandAt("near:"+id,',"the landscape's names near the eye"],['mlBandAt("full:"+id,',"the counters' full form"],['mlBandAt("links",',"the plan links"],['mlBandAt("far:"+it.key,',"the far step"]]
    .forEach(b=>{ if(src.indexOf(b[0])<0) merr.push("the band is not on "+b[1]); });
  [["setMode","ground"],["setPresentation","presentation"],["setCommandView","reading"],["eyeEnter","eye level"],["eyeLeave","eye level"],["setDisplayFactor","factor"],["glRestored","context"],["endTweens","tween ended at once"]]
    .forEach(r=>{ const b=fn(r[0]); if(!b) merr.push(r[0]+" missing"); else if(b.indexOf('mlReset("'+r[1]+'")')<0) merr.push(r[0]+" is not a fresh view (mlReset \""+r[1]+"\")"); });
  if(src.indexOf('mlReset("window")')<0) merr.push("a resize is not a fresh view");
  const far=fn("mlFar")||"";
  if(!/if\(!it\.small\|\|camera\.isOrthographicCamera\|\|mode==="staff"\) return false;/.test(far)||!/if\(!\(dt>=1\)\) return false;/.test(far)) merr.push("the far step is not limited to the small names in the perspective presentations with a guarded distance");
  if(!/it\.small=\/\\bmlt-small\\b\/\.test\(it\.el\.className\)/.test(lay)) merr.push("the far step's items are not the names at t-small (.mlt-small)");
  if(!/\.ml-item\.ml-fading\{z-index:-1;pointer-events:none\}/.test(css)) merr.push("a remnant is not under the live items without the pointer (.ml-fading)");
  if(!/\.mlt-small\.ml-far\{font-size:var\(--t-micro\);/.test(css)) merr.push("the far step is not t-micro on .mlt-small");
  const farRules=css.match(/[^{}]*\.ml-far[^{}]*\{[^}]*\}/g)||[];
  if(farRules.length!==1) merr.push("ml-far in "+farRules.length+" rules, not the one");
  if(!/--t-micro:10\.5px/.test(css)) merr.push("t-micro is not 10.5 px (decision 16's tertiary floor)");
  merr.forEach(e=>console.log("  ! "+e));
  console.log("map layer in motion (decision 240 (a)): "+(merr.length?merr.length+" wrong":"the pass every 333 ms, two passes with room, the band 8% on every switch and released at rest, fades 180 ms off under reduced motion and in a fresh view, the motion from the app's state, the never-dropped and the focus by the full search and at full opacity at once, every discontinuity a fresh view, the remnants under the live items without the pointer; the far step at 1.5 on the small names only, t-micro"));
  if(merr.length) process.exitCode=1;
}
/* Stage 8, implementation PR 8D (decisions 249 (a), 244 (a), 250 (b); docs/STAGE8_SPEC.md section 16): culling and the hooks as decided. Every
   block's instanced meshes carry their own bounds and are culled by them (cullBlock in buildFormations, frustumCulled from CULL.on, on by
   default); three r128's frustum test kept for every other object; the bounds refreshed at the test by the instance matrices' version, the count
   and the geometry; the shared geometries' bounds never written (no boundingSphere and no computeBoundingSphere in the culling code); culling
   never hides (no visible written there); the app never turns it off (setCull and CULL.on written only by the self-test) and, since 8E, the
   gait's uniforms are written by gaitStep alone, the knee by kitLodSet, besides the self-test; the hook after three's begin_vertex, the atmosphere's uniforms first, on the kit's material and on its own depth
   material with the mesh's two uniforms, its branch taken only above amplitude 0 and the amplitude clamped to 1 (the envelope's bound); the
   frame's culling counts reset with renderer.info; lowTier as decision 236 left it (density 1.0, no shadow map) */
{
  const acorn=require('acorn'), src=fs.readFileSync('app.js','utf8'), ast=acorn.parse(src,{ecmaVersion:2020}), cerr=[];
  const fn=name=>{ const n=ast.body.find(q=>q.type==="FunctionDeclaration"&&q.id.name===name); return n?src.slice(n.start,n.end):null; };
  const a0=src.indexOf("  function selfTest(){"), st0=a0, st1=a0<0?-1:src.indexOf("\n  }\n",src.indexOf("/* 11. render on demand */",a0));
  const outsideST=re=>{ const out=[]; let m; const g=new RegExp(re.source,"g"); while((m=g.exec(src))) if(!(m.index>st0&&m.index<st1)) out.push(src.slice(Math.max(0,src.lastIndexOf("\n",m.index)+1),m.index+40).trim().slice(0,90)); return out; };
  if(st0<0||st1<0) cerr.push("the self-test's source not found (its bounds: \"  function selfTest(){\" to the end of its render-on-demand block)");
  if(!/^var CULL=\{on:true, meshes:\[\], geo:new WeakMap\(\)/m.test(src)) cerr.push("CULL is not on by default");
  const cb=fn("cullBlock")||"", ct=fn("cullTest")||"", cr=fn("cullRefresh")||"", cg=fn("cullGeo")||"", sc=fn("setCull")||"", am=fn("animMesh")||"", ah=fn("animHook")||"";
  if(!/animMesh\(o\);\s*o\.userData\.cull=\{s:new THREE\.Sphere\(\), ver:-1, n:-1, g:null, P:null, pv:-1, K:null, kv:-1, av:-1, env:0, id:id\};\s*o\.frustumCulled=CULL\.on; CULL\.meshes\.push\(o\);/.test(cb))
    cerr.push("cullBlock does not give every instanced mesh its bounds (stale until first made), its hook and frustumCulled from CULL.on");
  if(!/cullBlock\(g,id\);/.test(fn("buildFormations")||"")) cerr.push("buildFormations does not cull each block by its own bounds (cullBlock)");
  if(!/F\.intersectsObject=function\(o\)\{ var cl=o\.userData&&o\.userData\.cull; return cl\?cullTest\(this,o,cl\):r128\.call\(this,o\); \};/.test(src))
    cerr.push("three's frustum test is not r128's own for every object without bounds of its own");
  if(!/if\(cullStale\(o,cl\)\) cullRefresh\(o,cl\);/.test(ct)) cerr.push("the bounds are not refreshed when stale (cullStale) at the test");
  /* 8E's prerequisite (the audit of 8D): stale also when the geometry's position or part attribute (object, version) or the animation's
     definition (ANIM.ver) differ from the ones the bounds were made from; the envelope read again at each refresh, keyed by what it is made from */
  const cs=fn("cullStale")||"", ae=fn("animEnv")||"", ad=fn("animDefine")||"", ak=fn("animKey")||"";
  if(!/if\(cl\.ver!==o\.instanceMatrix\.version\|\|cl\.n!==o\.count\|\|cl\.g!==o\.geometry\|\|cl\.av!==ANIM\.ver\) return true;/.test(cs)||!/return cl\.P!==Pa\|\|cl\.pv!==Pa\.version\|\|cl\.K!==K\|\|cl\.kv!==\(K\?K\.version:-1\);/.test(cs))
    cerr.push("cullStale does not compare the instances' version and count, the geometry, its position and part attributes (objects and versions) and the animation's definition (8E's prerequisite)");
  if(!/cl\.env=animEnv\(g\);/.test(cr)) cerr.push("cullRefresh does not read the envelope of the geometry drawn at each refresh (8E's prerequisite: cullBlock read it once)");
  if(!/cl\.ver=m\.instanceMatrix\.version; cl\.n=m\.count; cl\.g=g;\s*cl\.P=Pa; cl\.pv=Pa\.version; cl\.K=K; cl\.kv=K\?K\.version:-1; cl\.av=ANIM\.ver;/.test(cr)) cerr.push("cullRefresh does not record what it was computed from");
  if(!/if\(c&&c\.av===ANIM\.ver&&c\.P===Pa&&c\.pv===Pa\.version&&c\.kv===K\.version\) return c\.e;/.test(ae)) cerr.push("animEnv's cache is not keyed by its attributes' objects and versions and the animation's definition (8E's prerequisite)");
  if(!/Object\.keys\(def\|\|\{\}\)\.forEach\(function\(k\)\{ ANIM\[k\]=def\[k\]; \}\); ANIM\.ver\+\+; ANIM\.body=animGLSL\(\);/.test(ad)) cerr.push("animDefine does not move the animation's definition's version with its table");
  if(!/return "ANIM "\+ANIM\.ver;/.test(ak)||!/m\.material\.customProgramCacheKey=animKey;/.test(am)||!/d\.customProgramCacheKey=animKey;/.test(am)) cerr.push("the kit's programs are not keyed by the animation's definition (a changed table would draw with the old program)");
  if(!/if\(cl\.n<=0\)\{ CULL\.frame\.culled\+\+; return false; \}/.test(ct)) cerr.push("a mesh with no instance to draw is not culled");
  [["cullBlock",cb],["cullTest",ct],["cullRefresh",cr],["cullGeo",cg],["cullStale",fn("cullStale")||""],["setCull",sc]].forEach(([n,t])=>{ if(!t) cerr.push(n+" missing");
    if(/boundingSphere|computeBounding|boundingBox/.test(t)) cerr.push(n+" writes or reads a geometry's own bounds (shared by every block of its class)");
    if(/\.visible\s*=/.test(t)) cerr.push(n+" hides or shows an object (culling must leave visible alone: a shadow cast from outside the view)"); });
  if(!/var Pa=g\.attributes\.position, s=CULL\.geo\.get\(Pa\); if\(s&&s\.pv===Pa\.version\) return s;/.test(cg)) cerr.push("a geometry's sphere is not read once into CULL.geo for its position attribute (again when its version moves)");
  const sw=outsideST(/setCull\(/).filter(x=>!/^function setCull\(on\)/.test(x)); if(sw.length) cerr.push("setCull called outside the self-test: "+sw.join(" | "));
  const co=outsideST(/CULL\.on\s*=[^=]/).filter(x=>!/^function setCull\(on\)/.test(x)); if(co.length) cerr.push("CULL.on written outside setCull and the self-test: "+co.join(" | "));
  /* since 8E (decision 244 (a)): the gait's uniforms written by gaitStep alone (its one writer) and the knee by kitLodSet, besides the self-test */
  { const span=nm=>{ const n=ast.body.find(q=>q.type==="FunctionDeclaration"&&q.id.name===nm); return n?[n.start,n.end]:[-1,-1]; }, gS=span("gaitStep"), kS=span("kitLodSet"), uw=[];
    let m; const g=/uAnim(\w+)\.value\s*=[^=]/g;
    while((m=g.exec(src))){ const i=m.index; if(i>st0&&i<st1) continue; const inG=i>gS[0]&&i<gS[1], inK=i>kS[0]&&i<kS[1];
      if(!(inG&&/^(Amp|Phase|Trot|RollG|RollL)$/.test(m[1]))&&!(inK&&m[1]==="Knee")) uw.push(src.slice(Math.max(0,src.lastIndexOf("\n",i)+1),i+40).trim().slice(0,90)); }
    if(uw.length) cerr.push("the gait's uniforms written outside gaitStep (the knee outside kitLodSet) and the self-test: "+uw.join(" | "));
    const gs=fn("gaitStep")||"";
    ["Amp","Phase","Trot","RollG","RollL"].forEach(k=>{ if(!new RegExp("U\\.uAnim"+k+"\\.value=").test(gs)) cerr.push("gaitStep does not write uAnim"+k); });
    if(!/U\.uAnimKnee\.value=rich\?1:0;/.test(fn("kitLodSet")||"")) cerr.push("kitLodSet does not set the knee with the level of detail"); }
  if(!/^function animHook\(sh\)\{\n  atmoUniforms\(sh\);/.test(ah)) cerr.push("the kit's hook drops the atmosphere's uniforms");
  if(!/\.replace\("#include <begin_vertex>","#include <begin_vertex>\\n"\+ANIM\.body\)/.test(ah)) cerr.push("the hook is not right after three's begin_vertex");
  if(!/m\.material\.onBeforeCompile=animHook;/.test(am)||!/new THREE\.MeshDepthMaterial\(\{depthPacking:THREE\.RGBADepthPacking\}\); d\.userData\.anim=U; d\.onBeforeCompile=animHook;/.test(am)||!/m\.customDepthMaterial=d;/.test(am))
    cerr.push("the hook is not on the kit's material and on its own depth material (the shadow casting the pose drawn)");
  if(!/m\.userData\.anim=U; m\.material\.userData\.anim=U;/.test(am)) cerr.push("the kit's material and its depth material do not share the mesh's uniforms");
  if(!/return \["if\(uAnimAmp>0\.0&&aPart>0\.5\)\{",\s*"  float anK=floor\(aPart\+0\.5\), anA=min\(uAnimAmp,1\.0\),/.test(src)) cerr.push("the hook's branch is not off at amplitude 0, or the amplitude is not clamped to the envelope's 1");
  if(!/renderer\.info\.reset\(\); cullFrameStart\(\);/.test(fn("renderFrameNow")||"")) cerr.push("the frame's culling counts are not reset with renderer.info");
  if(!/return Math\.min\(window\.devicePixelRatio\|\|1, lowTier\?1:2\);/.test(src)||!/sun\.castShadow=!lowTier;/.test(src)) cerr.push("lowTier's density (1.0) or its shadow setting (none) changed (decision 236)");
  cerr.forEach(e=>console.log("  ! "+e));
  console.log("culling and the hooks (decisions 249 (a), 244 (a), 250 (b)): "+(cerr.length?cerr.length+" wrong":"every block's instanced meshes culled by their own bounds, refreshed by version, count, geometry, its attributes and the animation's definition (the envelope read again at each refresh), the shared geometries' bounds untouched, nothing hidden, r128's test for the rest; culling switched only by the self-test, the gait's uniforms written by gaitStep alone (the knee by kitLodSet) and the self-test; the hook after begin_vertex on the kit's material and its depth material, inert at amplitude 0; lowTier as decision 236"));
  if(cerr.length) process.exitCode=1;
}
/* Stage 8, implementation PR 8E (decisions 242 (a), 243 (a), 244 (a), 245 (a); docs/STAGE8_SPEC.md sections 4 and 17): the troops' values and
   rules as decided, in the source (the self-test's 8E block runs them). The level of detail (242 (a)): rich from 17.6 CSS px, simple under 14.5
   (16 px with a margin each way), only in the eye's view, a block's meshes switched together each to its own pair, kitLod allocating nothing.
   The artillery (243 (a)): its wheels at ORDNANCE's heights; one carriage colour for every army (the vehicles' parts coloured from KIT.gear
   alone, read by no nation, dress or claim); the drivers only from ORDNANCE.fr.drivers, by the corps a claim names, none elsewhere; the switch
   between the deployed and the limbered battery at once. The gait (244 (a)): its phase the modelled track's distance over a stride (no wall
   clock and no random number in it), its amplitude by the clock's rate (full to 3.2 cycles a second, none from 4.8) for a formation's meshes
   together, none under 1 km/h or under reduced motion, eased; the wheels within one spoke's interval; the hook's parts the legs, the arm, the
   root and the wheels, nothing else (no firing, kneeling, falling or casualty). 245 (a): no facings (decision 104; Stage 6C's block holds the
   cloths). The standards' drape (section 4.5): still (flagGeo reads no clock or time), its folds in the cloth's depth only */
{
  const acorn=require('acorn'), src=fs.readFileSync('app.js','utf8'), ast=acorn.parse(src,{ecmaVersion:2020}), eerr=[];
  const fn=name=>{ const n=ast.body.find(q=>q.type==="FunctionDeclaration"&&q.id.name===name); return n?src.slice(n.start,n.end):""; };
  const a0=src.indexOf("  function selfTest(){"), st1=a0<0?-1:src.indexOf("\n  }\n",src.indexOf("/* 11. render on demand */",a0));
  /* the level of detail */
  if(!/^var KLOD=\{IN:17\.6, OUT:14\.5, H:1\.635, M:0\.6, k:0, n:0\};/m.test(src)) eerr.push("KLOD is not 17.6 px in and 14.5 px out (16 px with a margin each way)");
  const kl=fn("kitLod"), ks=fn("kitLodSet");
  if(!/u\.inView=_kF\.intersectsBox\(_kB\); u\.lodPx=px; rich=u\.inView&&\(u\.lodRich\?px>=KLOD\.OUT:px>=KLOD\.IN\);/.test(kl)) eerr.push("kitLod's switch is not in the eye's view with its hysteresis");
  if(/new |\[\]|\{\}|\.clone\(/.test(kl)) eerr.push("kitLod allocates (it runs for every block every frame)");
  if(!/u\.lod\.forEach\(function\(m\)\{ var L=m\.userData\.lod; m\.geometry=rich\?L\.r:L\.s;/.test(ks)) eerr.push("kitLodSet does not switch every mesh of the block to its own pair");
  if(!/kitLodFrame\(\);/.test(fn("updateVisibility"))||!/settleBlock\(rec\); kitLod\(rec\); gaitStep\(rec,id\);/.test(fn("updateVisibility"))) eerr.push("updateVisibility does not take the level of detail and the gait after each block's seating");
  /* the artillery */
  if(!/function kitArtR\(which\)\{ var w=ORDNANCE\.fr\.wheels; return \(which==="gun"\?w\.gun_m:w\.limber_m\)\/2\*kitArtScale\(\); \}/.test(src)) eerr.push("the wheels are not ORDNANCE's heights at the figures' scale (kitArtR)");
  ["kitGunParts","kitLimberParts","kitWheel","kitDisc","artGeo"].forEach(f=>{ const t=fn(f); if(!t) eerr.push(f+" missing");
    if(/NATION|nation|dress|DRESS|KIT\.cloth|KIT\.mat|ORDNANCE\.(fr_guard|at|ru)/.test(t)) eerr.push(f+" colours or shapes a vehicle by army or dress (one carriage colour for every army, decisions 109, 243 (a))");
    if(/0x[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{6}/.test(t)) eerr.push(f+" draws a colour of its own (the vehicles' colours are KIT.gear's)"); });
  const ad=fn("artDrivers");
  if(!/ORDNANCE\.fr\.drivers\|\|\[\]\)\.filter\(function\(d\)\{ return d\.corps===a; \}\)\[0\];/.test(ad)||!/a=FORMATIONS\[a\]&&FORMATIONS\[a\]\.parent;/.test(ad)||!/return \{n:0, claim:null\}; \}$/.test(ad))
    eerr.push("artDrivers does not take its drivers from the claim whose corps holds the battery, and none elsewhere (decision 243 (a))");
  { let m; const g=/ORDNANCE\.[a-z_]+\.drivers/g, out=[], as=src.indexOf("function artDrivers("), ae=as+ad.length, cm=[];
    acorn.parse(src,{ecmaVersion:2020,onComment:(blockC,text,start,end)=>cm.push([start,end])});
    while((m=g.exec(src))) if(!(m.index>=as&&m.index<ae)&&!(m.index>a0&&m.index<st1)&&!cm.some(c=>m.index>=c[0]&&m.index<c[1])) out.push(src.slice(src.lastIndexOf("\n",m.index)+1,m.index+30).trim().slice(0,80));
    if(out.length) eerr.push("the drivers' claims read outside artDrivers and the self-test: "+out.join(" | ")); }
  if(!/u\.deployed\.visible=!moving;\s*u\.limbered\.visible=moving;/.test(src)) eerr.push("the switch between the deployed and the limbered battery is not at once (ORDNANCE.fr.limbering: no duration read)");
  /* the gait */
  if(!/^var GAIT=\{STRIDE:\{man:6\.6, horse:16, team:12\}, ROLL:2, FULL:3\.2, NONE:4\.8, KMH:1, TROT_KMH:8, EASE:0\.22, EPS:1e-3,/m.test(src)) eerr.push("GAIT's values are not 8E's (the strides, the fade from 3.2 to 4.8 cycles a second, 1 km/h)");
  const gs=fn("gaitStep"), gr=fn("gaitRoll");
  if(!/var rate=clockRate\(\), fv=gaitFastest\(rec,G\), sk=G\.seek!==GAIT\.seek;/.test(gs)||!/if\(lg&&!RM&&lg\.kmh>=GAIT\.KMH\)\{ c=rate\*lg\.mpm\/fv; want=clamp01\(\(GAIT\.NONE-c\)\/\(GAIT\.NONE-GAIT\.FULL\)\);/.test(gs))
    eerr.push("the gait's amplitude is not the clock rate's rule by the formation's fastest stride, none under 1 km/h or under reduced motion");
  if(!/var amp=G\.amp, D=amp>0\?gaitDistOf\(id,L\):0;/.test(gs)||!/U\.uAnimAmp\.value=amp; U\.uAnimPhase\.value=amp>0\?2\*Math\.PI\*\(x-Math\.floor\(x\)\):0;/.test(gs))
    eerr.push("the gait's phase is not the track's distance over the stride, or a formation's meshes do not share its amplitude");
  if(!/if\(G\.amp!==want\)\{ G\.amp\+=\(want-G\.amp\)\*e;/.test(gs)||!/var e=\(RM\|\|sk\)\?1:ease\(GAIT\.EASE\);/.test(gs)) eerr.push("the gait's amplitude is not eased, or not stopped at once under reduced motion, or a seek not shown at once");
  /* Stage 8, 8F's prerequisite (the audit of 8E): a clock that stands without being moved holds the pose drawn (no ease); every move of the
     clock but Play's own advance is a seek (setClock counts it; tickClock's two calls are Play's) */
  if(!/if\(rate===0&&!sk&&!RM\)\{ want=G\.amp; trot=G\.trot; \}/.test(gs)) eerr.push("a paused clock does not hold the gait drawn (the amplitude and the trot eased on with the clock standing)");
  if(!/^  if\(!opts\.play\) GAIT\.seek\+\+;/m.test(fn("setClock"))) eerr.push("setClock does not count a seek (every move of the clock but Play's own advance)");
  { const tc=fn("tickClock"); if(!/setClock\(T_MAX,\{play:true\}\); stopPlay\(\);/.test(tc)||!/setClock\(nt,\{play:true\}\); DWELL\.expect=clock;/.test(tc)||(tc.match(/setClock\(/g)||[]).length!==2) eerr.push("tickClock's advance of the clock is not marked Play's own (it would count as a seek)"); }
  /* Stage 8, 8F's prerequisite 2 (the audit of 8E: the contact): the hook and its mirror plant each kit's own soles (the simple kit's HEEL0 and
     TOE0, its legs' boxes, by the knee's uniform; the rich kit's HEEL and TOE); 8E's two chords a figure, read through the drawn ground's
     compact heights alone (groundYFast; no other reader of the ground in the slopes), made again whenever scaleGround changes the ground. Each
     foot's own profile (ten lookups a man, twelve a horse) was measured over the animation's budget and is not drawn (docs/STAGE8_SPEC.md 18) */
  { const sl=(/\n  function slopes\(rs,rc,horse,out,o\)\{[\s\S]*?\n  \/\* the block's rotation/.exec(src)||[""])[0], wsrc=fs.readFileSync('world.js','utf8');
    if(!sl) eerr.push("layoutFigs's slopes not found");
    else { if(/groundY\(|displayHeight\(|height\(|hAt\(/.test(sl)) eerr.push("the slopes read the ground other than through groundYFast on the compact heights");
      if((sl.match(/groundYFast\(GH,/g)||[]).length!==4) eerr.push("the slopes are not 8E's two chords a figure (four lookups in all: a man's two, a horse's two)"); }
    if(!/_gH=groundHeights\(\); \}/.test(src)) eerr.push("the seating does not take the drawn ground's compact heights (seatPrep)");
    if(!/"attribute vec2 aSl;"/.test(src)) eerr.push("the hook's slopes are not 8E's two a figure (aSl, a vec2)");
    if(!/float anZe=anE==0\?mix\("\+f\(M\.HEEL0\)\+","\+f\(M\.HEEL\)\+",anKn\):mix\("\+f\(M\.TOE0\)\+","\+f\(M\.TOE\)\+",anKn\);/.test(src)||!/function animManRoot\(f,kL,kR,sa,sb,kn\)\{ var M=ANIM\.MAN, g=-1e9, k=kn===undefined\?1:kn;/.test(src)||
       !/\[M\.HEEL0\+\(M\.HEEL-M\.HEEL0\)\*k,M\.TOE0\+\(M\.TOE-M\.TOE0\)\*k\]\.forEach/.test(src)||!/out\[1\]=y\+animManRoot\(f,kL,kR,sl,sh,kn\);/.test(src))
      eerr.push("the hook or its mirror does not plant the kit's own soles (the simple kit's HEEL0 and TOE0, the rich kit's HEEL and TOE)");
    if(!/^    HEEL0:-0\.09, TOE0:0\.09\},/m.test(src)) eerr.push("ANIM.MAN's simple soles are not its legs' boxes' (HEEL0 -0.09, TOE0 0.09)");
    if(!/function animChord\(sa,sb,z\)\{ return z>=0\?sa\*z:sb\*z; \}/.test(src)||!/g=Math\.max\(g,animChord\(sa,sb,_anT\[1\]\)-animChord\(sa,sb,z0\)-\(_anT\[0\]-M\.FOOT\)\);/.test(src)||
       !/"      float anCz=anZe>=0\.0\?anSl\.x\*anZe:anSl\.y\*anZe;",/.test(src)||!/\(anFL\.y>=0\.0\?anSl\.x\*anFL\.y:anSl\.y\*anFL\.y\)-anCz-/.test(src))
      eerr.push("the man's chords are not the ground from his middle in the hook and its mirror (ahead of it the slope ahead, behind it the slope behind; each edge's posed place against its rest place)");
    if(!/GHEIGHTS\.ver=-1;/.test((/\nfunction scaleGround\(geo\)\{[\s\S]*?\n\}/.exec(wsrc)||[""])[0])) eerr.push("scaleGround does not mark the compact heights stale (the slopes would read the ground before the change)"); }
  if(!/if\(!sk&&G\.t===clock&&G\.rate===rate&&G\.rm===RM&&G\.fv===fv&&G\.amp===G\.want&&G\.trot===G\.trotW&&!\(u\.slopeStale&&rate===0\)\) return;/.test(gs)||/new |\.clone\(/.test(gs.split("G.t=clock;")[0].split("if(!G.meshes.length) return;")[1]||"x new ")||!/lg=L\?gaitLegOf\(L,_glo\):null/.test(gs))
    eerr.push("gaitStep computes or allocates when nothing changed (the clock, its rate, reduced motion and the parts drawn the same, the gait arrived)");
  if(!/while\(a&&a!==rec\.block&&a\.visible\) a=a\.parent; if\(a!==rec\.block\) continue;/.test(fn("gaitFastest"))) eerr.push("the gait's cadence is not the parts drawn now's (gaitFastest)");
  ["gaitStep","gaitDistOf","gaitLegOf","gaitRoll","clockRate"].forEach(f=>{ if(/performance\.now|Date\.now|Math\.random|lastFrame/.test(fn(f))) eerr.push(f+" reads a wall clock or a random number (the gait is the clock's)"); });
  if(!/a-=pg\*Math\.round\(a\/pg\); b-=pl\*Math\.round\(b\/pl\); out\[0\]=a; out\[1\]=b;/.test(gr)) eerr.push("the wheels' angles are not taken within one spoke's interval, whole (an angle scaled by the fade steps back at each interval)");
  { const m=/^  PART:\{([\s\S]*?)\}\},\n  env:/m.exec(src); const kinds=new Set(); if(m) (m[1]+"}").replace(/kind:"(\w+)"/g,(x,k)=>{ kinds.add(k); return x; });
    const ok=new Set(["none","thigh","shin","arm","root","hoof","wheel"]); if(!m||!kinds.size) eerr.push("ANIM.PART not found");
    kinds.forEach(k=>{ if(!ok.has(k)) eerr.push("the hook moves a part of kind \""+k+"\" (the gait swings legs and arms and turns wheels, nothing else)"); }); }
  if(/kneel|fire|firing|recoil|fall|casualt|smoke/i.test(fn("animGLSL")+fn("animAt"))) eerr.push("the hook draws a behaviour beyond the gait (firing, kneeling, falling or casualties are not 8E's)");
  /* the standards' drape */
  const fg=fn("flagGeo");
  if(!/^  std:\{drop:0\.853, thick:0\.61, aspect:2\.4\/1\.4, fold:\{n:2\.5, a:0\.07\}\},/m.test(src)) eerr.push("KIT.std's drape is not section 4.5's (two and a half folds, 0.07 deep)");
  if(!/a\.setZ\(i,F\.a\*\(0\.35\+0\.65\*u\)\*Math\.sin\(Math\.PI\*F\.n\*u\)\);/.test(fg)||/setX|setY|clock|performance|Date|uTime/.test(fg)) eerr.push("the standards' drape is not still, in the cloth's depth only");
  eerr.forEach(e=>console.log("  ! "+e));
  console.log("the troops (decisions 242 (a), 243 (a), 244 (a), 245 (a)): "+(eerr.length?eerr.length+" wrong":"the level of detail 17.6 in, 14.5 out, in view, a block's meshes together, kitLod allocating nothing; the wheels at ORDNANCE's heights, one carriage colour for every army, the drivers only where a claim's corps holds the battery, the switch at once; the gait's phase the track's distance over its stride, its amplitude the clock rate's rule for a formation's meshes together, none under 1 km/h or reduced motion, eased, no wall clock, the wheels within a spoke's interval, the hook's parts the legs, the arm, the root and the wheels; the standards' drape still"));
  if(eerr.length) process.exitCode=1;
}
/* Stage 8, implementation PR 8F (decisions 246 (a), 247 (a); docs/STAGE8_SPEC.md sections 5, 7.3, 7.4 and 18): water, woods and the near
   ground as decided, in the source (the self-test's 8F block draws them). The water: its colours in WATER_COL, 8E's kept for the paper map,
   which draws the water with 8E's own materials (waterPresentation, called by setMode before the water's opacity as before); the meres'
   outlines, levels and shore ring 4E's; the landscape's ice writing no depth, the shore band without a polygon offset and drawn after its ice;
   the hooks chaining the atmosphere's uniforms, each with its own program; nothing in the water read from a clock or a time (no animated
   water), no hole cut (no discard). The woods: TREE8F's values; the deciduous habits and the bush drawn on both faces and opaque (no alpha);
   8E's crowns' jitter kept in the shells; the conifers 8E's. The near ground: GDETAIL's values, on the landscape's natural ground only (uMode
   1), faded by the eye's distance, anchored to the ground (its uv, not the screen), the texel scaled by a grey ratio within GDETAIL's clamp
   (no new colour), off under lowTier. The self-test's bounds for them: ICE8F, WOODS8E and KIT8E */
{
  const acorn=require('acorn'), src=fs.readFileSync('app.js','utf8'), wsrc=fs.readFileSync('world.js','utf8'), wast=acorn.parse(wsrc,{ecmaVersion:2020}), ferr=[];
  const wfn=name=>{ const n=wast.body.find(q=>q.type==="FunctionDeclaration"&&q.id.name===name); return n?wsrc.slice(n.start,n.end):""; };
  const wvar=name=>{ const n=wast.body.find(q=>q.type==="VariableDeclaration"&&q.declarations.some(d=>d.id.name===name)); return n?wsrc.slice(n.start,n.end):""; };
  /* the water */
  if(!/^var WATER_COL=\{ice:0x4E5C66, iceRim:0x75838B, bank:0x4E5A4C, stream:0x587A8E,/m.test(wsrc)) ferr.push("WATER_COL's paper colours are not 8E's (ice, iceRim, bank, stream)");
  if(!/^  iceClear:0x[0-9A-F]{6}, iceFrost:0x[0-9A-F]{6}, iceBand:0x[0-9A-F]{6}, bankLand:0x[0-9A-F]{6}, streamLand:0x[0-9A-F]{6}\};/m.test(wsrc)) ferr.push("the landscape's water colours are not in WATER_COL");
  if(!/^var ICE=\{roughness:0\.32, env:0\.42, rim:0\.86, rimLift:0\.02,/m.test(wsrc)) ferr.push("ICE's 4E values changed (the ice's material, the shore ring's width and lift)");
  const bw=wfn("buildWater"), wp=wfn("waterPresentation"), hooks=wfn("iceHook")+wfn("streamHook")+wvar("WATER_GLSL");
  if(!/mere\(SATS,28,10\.5,-3\.85\);\s*mere\(MENI,23,9,-3\.95\);/.test(bw)||!/new THREE\.CircleGeometry\(1,48\)/.test(bw)||!/new THREE\.RingGeometry\(ICE\.rim,1,48,1\)/.test(bw)) ferr.push("the meres' outlines, levels or shore ring are not 4E's");
  if(!/paper:\{ice:new THREE\.MeshStandardMaterial\(\{color:lin\(WATER_COL\.ice\),roughness:ICE\.roughness,metalness:0\.0,envMapIntensity:ICE\.env,transparent:true,opacity:0\.96\}\),\s*bank:matte\(\{color:WATER_COL\.bank,roughness:0\.96,side:THREE\.DoubleSide\}\),\s*stream:new THREE\.MeshStandardMaterial\(\{color:lin\(WATER_COL\.stream\),roughness:0\.48,metalness:0\.0,envMapIntensity:0\.18,side:THREE\.DoubleSide\}\)\}\};/.test(bw))
    ferr.push("the paper map's water materials are not 8E's (buildWater until 8F)");
  if(!/var S=staff\?WATER_MATS\.paper:WATER_MATS\.land;\s*waterMeshes\.forEach\(function\(m\)\{ var k=waterKind\(m\); if\(S\[k\]\) m\.material=S\[k\]; \}\);/.test(wp)) ferr.push("waterPresentation does not give each water mesh its presentation's materials");
  if(!/  waterPresentation\(staff\);[^\n]*\n  world\.water\.forEach\(function\(w2\)\{ if\(w2\.material\.opacity!==undefined\) w2\.material\.opacity=staff\?1:0\.94; \}\);/.test(src)) ferr.push("setMode does not put the water's materials in place before it sets their opacity as before");
  if(!/transparent:true,opacity:0\.96,depthWrite:false\}\),false\);/.test(bw)||/polygonOffset/.test(bw)||!/r\.renderOrder=1;/.test(bw)) ferr.push("the landscape's ice writes its depth, or the shore band has a polygon offset or is not drawn after its ice");
  if((hooks.match(/atmoUniforms\(sh\)/g)||[]).length!==2||!/customProgramCacheKey=function\(\)\{ return band\?"ice8f-band":"ice8f"; \}/.test(hooks)||!/customProgramCacheKey=function\(\)\{ return "stream8f"; \}/.test(hooks)) ferr.push("the water's hooks do not chain the atmosphere's uniforms or have no program of their own");
  if(/uTime|performance|Date|clock|Math\.random|discard/.test(hooks)) ferr.push("the water reads a clock or a time (animated water) or cuts a hole (discard)");
  if(/uWaterLand|WATER_U/.test(wsrc)) ferr.push("a presentation's uniform in the water (the paper map's water is 8E's materials, not a branch)");
  /* the woods */
  if(!/^var TREE8F=\{keep:0\.42, shrink:0\.7, scrubKeep:0\.45, scrubShrink:0\.72\};/m.test(wsrc)) ferr.push("TREE8F is not the prototype's t-airy (keep 0.42, shrink 0.70; the bush 0.45, 0.72)");
  const bwd=wfn("buildWoods"), tk=wfn("treeKit"), ts=wfn("treeShell");
  if(!/matte\(\{color:0xFFFFFF,flatShading:true,side:THREE\.DoubleSide\}\),Math\.max\(1,list\.length\)\);/.test(bwd)||!/scrubMesh=new THREE\.InstancedMesh\(kit\.scrub,matte\(\{color:0xFFFFFF,flatShading:true,side:THREE\.DoubleSide\}\)/.test(bwd)) ferr.push("the deciduous habits or the bush are not drawn on both faces");
  if(/transparent|alphaTest|alphaMap|opacity/.test(bwd)) ferr.push("the woods drawn with alpha (8F's crowns are opaque: nothing sorted)");
  if(!/var k=0\.78\+0\.44\*hash2\(Math\.round\(pa\[i\]\*13\+seed\),Math\.round\(pa\[i\+1\]\*7\+pa\[i\+2\]\*11\)\); pa\[i\]\*=k; pa\[i\+1\]\*=k\*0\.92; pa\[i\+2\]\*=k;/.test(ts)||!/new THREE\.IcosahedronGeometry\(1,2\)/.test(ts)) ferr.push("the shells are not 8E's crowns (the icosahedron, detail 2, and its jitter)");
  if(!/mergeParts\(\[T\(0\.6\),\{geo:cone,p:\[0,2\.3,0\],s:\[0\.95,3\.4,0\.95\]\},\{geo:cone,p:\[0,1\.35,0\],s:\[1\.25,1\.4,1\.25\]\}\]\),\s*mergeParts\(\[T\(0\.9\),\{geo:cone,p:\[0,3\.0,0\],s:\[0\.8,4\.2,0\.8\]\}\]\)/.test(tk)) ferr.push("the conifers are not 8E's");
  /* the near ground */
  if(!/^var GDETAIL=\{amount:0\.55, near:14, far:60, k:7\.3, rot:0\.61, lo:0\.62, hi:1\.38,/m.test(wsrc)) ferr.push("GDETAIL's values changed");
  const gd=wvar("GROUND_FRAG_DETAIL");
  if(!/if\(uMode>0\.5&&uMode<1\.5&&\(uDetail\.x>0\.0\|\|uDebug>4\.5\)\)\{/.test(gd)||!/float gDf=uDetail\.x\*\(1\.0-smoothstep\(uDetail\.y,uDetail\.z,length\(vViewPosition\)\)\);/.test(gd)) ferr.push("the near detail is not the landscape's natural ground's alone, faded by the eye's distance");
  if(!/vec2 gDu=mat2\(uDetailR\.x,uDetailR\.y,-uDetailR\.y,uDetailR\.x\)\*vUv\*uDetail\.w[,;]/.test(gd)||/gl_FragCoord/.test(gd)) ferr.push("the near detail is not anchored to the ground (its uv)");
  /* 8G's prerequisite 2 (docs/STAGE8_SPEC.md section 19.2): the gradients taken under the uniforms' test alone, before the fade's; inside the
     fade's branch no derivative and no sampling that takes its own (only textureGrad with the gradients taken before it) */
  { const i0=gd.indexOf("if(uMode>0.5&&uMode<1.5&&(uDetail.x>0.0||uDebug>4.5)){"), i1=gd.indexOf("gDgx=dFdx(gDu)*gDk, gDgy=dFdy(gDu)*gDk;"), i2=gd.indexOf("float gDf="), i3=gd.indexOf("if(gDf>0.002");
    const inner=i3>=0?gd.slice(i3):"";
    if(!(i0>=0&&i1>i0&&i2>i1&&i3>i2)) ferr.push("the near detail's gradients are not taken under the uniforms' test alone, before the fade's test (8G's prerequisite 2)");
    if(/dFdx|dFdy|fwidth/.test(inner)) ferr.push("a derivative is taken inside the near detail's fade branch, where the fragments of a quad differ (8G's prerequisite 2)");
    if(/\btexture2D\(|\btexture\(|\btextureLod\(/.test(inner)||(inner.match(/textureGrad\(/g)||[]).length!==1||!/textureGrad\(map,gDt,gDgx,gDgy\)/.test(inner)) ferr.push("the near detail samples its texture inside the fade branch otherwise than by textureGrad with the gradients taken before it (8G's prerequisite 2)"); }
  if(!/texelColor\.rgb\*=mix\(1\.0,clamp\(gDl,uDetailC\.x,uDetailC\.y\),gDf\);/.test(gd)||!/\/max\(uCellLum\[int\(gCell\+0\.5\)\],0\.001\);/.test(gd)) ferr.push("the near detail is not its cell's grey ratio within GDETAIL's clamp (a new colour, or the class's tone moved)");
  if(!/^  groundDetail\(!lowTier\);/m.test(src)) ferr.push("the near detail is not off under lowTier (decision 236)");
  if(!/flip=!\(_atlas&&_atlas\.flipY===false\);/.test(wfn("atlasLum"))||!/cy=\(flip\?2-Math\.floor\(k\/4\):Math\.floor\(k\/4\)\)\*R,/.test(wfn("atlasLum"))) ferr.push("the near detail's cells' means are not taken as the shader samples the cells (the flip read from the texture as uploaded)");
  if(!/\+\s*GROUND_FRAG_DETAIL\+/.test(wfn("atlasShader"))||!/"#ifdef USE_MAP\\n"\+\s*"  vec4 texelColor=gAtlas\(map,tuv\);\\n"\+\s*"  vec4 gDbgT=texelColor;\\n"\+[^\n]*\n\s*"  texelColor=mapTexelToLinear\(texelColor\);\\n"\+\s*GROUND_FRAG_DETAIL\+/.test(wfn("atlasShader"))) ferr.push("the near detail is not inside the ground's texture (USE_MAP: none on the paper map, whose ground has no texture)");
  /* the near detail's debug sample (8G's prerequisite 1) never scales the texel: the scaling only where it is not asked for */
  if(!/if\(uDebug>4\.5\) gDbgD=gDc; else \{/.test(gd)) ferr.push("the near detail's debug sample is not apart from the detail's scaling (uDebug 5)");
  /* the self-test's bounds */
  if(!/var ICE8F=\{SHORE:1\.10, MARGIN:1\.25\};/.test(src)) ferr.push("the self-test's ice bounds (ICE8F) are not 1.10 at the shore and 1.25 at the margin");
  if(!/var WOODS8E=\{wood:634, village:184, conifer:376, edge:354, stream:202\}, KIT8E=\{broad:\[560,380,560,380\], conifer:\[62,41\], scrub:360\};/.test(src)) ferr.push("the self-test's 8E woods (WOODS8E, KIT8E) are not 8E's");
  ferr.forEach(e=>console.log("  ! "+e));
  console.log("water, woods and the near ground (decisions 246 (a), 247 (a)): "+(ferr.length?ferr.length+" wrong":"the water's colours in WATER_COL, the paper map's water 8E's materials, the meres' outlines, levels and ring 4E's, the ice writing no depth, the band without an offset and after its ice, nothing animated; TREE8F, the crowns opaque on both faces, 8E's jitter and conifers; GDETAIL on the natural ground only, faded, anchored, a grey ratio, off under lowTier; the self-test's bounds"));
  if(ferr.length) process.exitCode=1;
}
/* Stage 8, 8G's verification (docs/STAGE8_SPEC.md section 19.1): a block at rest is drawn the same in every frame. Each of poseBlock's eased
   values (the shape, the tilt, the heading) takes its target exactly once it is within the threshold that stops asking for frames, instead of
   easing on below it (by about 1e-9 a frame until 8G); a loose body's sway eases on, but takes its swayed heading exactly within 1e-6.
   Since 8H (section 20.4; the block wheeling on after a pause): the eases run only while the clock moves on under Play (adv); the clock
   standing, the pose is held (the turn, the shape, the dip and the sway); a seek (GAIT.seek) or a block's first pose takes the clock's pose
   at once (sk); a broken body's sway is no longer drift for render on demand (ambientNow) */
{
  const acorn=require('acorn'), src=fs.readFileSync('app.js','utf8'), ast=acorn.parse(src,{ecmaVersion:2020}), rerr=[];
  const fnOf=name=>{ const n=ast.body.find(q=>q.type==="FunctionDeclaration"&&q.id.name===name); return n?src.slice(n.start,n.end):""; };
  const pb=fnOf("poseBlock");
  if(!/if\(sk\)\{ u\.sw=sh\[0\]; u\.sd=sh\[1\]; \}\s*else if\(adv\)\{\s*if\(Math\.abs\(sh\[0\]-u\.sw\)>0\.002\|\|Math\.abs\(sh\[1\]-u\.sd\)>0\.002\)\{ settling=true; u\.sw \+= \(sh\[0\]-u\.sw\)\*rate; u\.sd \+= \(sh\[1\]-u\.sd\)\*rate; \}\s*else \{ u\.sw=sh\[0\]; u\.sd=sh\[1\]; \} \}/.test(pb)) rerr.push("the block's shape: not held with the clock standing, not the clock's at a seek, or easing on below its threshold");
  if(!/if\(sk\) u\.tilt=lowered;\s*else if\(adv\)\{\s*if\(Math\.abs\(lowered-\(u\.tilt\|\|0\)\)>0\.002\)\{ settling=true; u\.tilt = \(u\.tilt\|\|0\) \+ \(lowered-\(u\.tilt\|\|0\)\)\*ease\(0\.05\); \}\s*else u\.tilt=lowered; \}/.test(pb)) rerr.push("the block's tilt: not held with the clock standing, not the clock's at a seek, or easing on below its threshold");
  if(!/if\(!LOOSE\[st\]&&Math\.abs\(d0\)<=0\.002\) rec\.yaw=want0\+Math\.PI\*2\*Math\.round\(\(rec\.yaw-want0\)\/\(Math\.PI\*2\)\);/.test(pb)||!/else if\(Math\.abs\(diff\)<1e-6\) rec\.yaw=want\+Math\.PI\*2\*Math\.round\(\(rec\.yaw-want\)\/\(Math\.PI\*2\)\);/.test(pb)) rerr.push("the block's heading eases on below its threshold");
  { const eased=(pb.match(/[\w.]+ \+=/g)||[]).map(t=>t.slice(0,-3)).sort().join(",");
    if(eased!=="rec.yaw,u.sd,u.sw,want") rerr.push("poseBlock eases values other than the shape and the heading ("+eased+"): each eased value takes its target exactly at rest"); }
  /* 8H: the seek and the clock's advance read once, before any ease; the heading the clock's at a seek, held with the clock standing, before the sway */
  if(!/var sk=rec\.pSeek!==GAIT\.seek\|\|rec\.yaw===undefined, adv=rec\.pClock!==clock;\s*rec\.pSeek=GAIT\.seek; rec\.pClock=clock;/.test(pb)) rerr.push("poseBlock does not read the seek (GAIT.seek) and the clock's advance once per pose");
  { const iSk=pb.indexOf("if(sk){ rec.yaw="), iAdv=pb.indexOf("if(!adv) return;"), iSw=pb.indexOf("if(LOOSE[st]) want +="), iEase=pb.indexOf("rec.yaw += diff*ease(WHEEL[f.arm]");
    if(!(iSk>0&&iAdv>iSk&&iSw>iAdv&&iEase>iSw)) rerr.push("the heading: not the clock's at a seek, then held with the clock standing, before the sway and the turn ease");
    if(!/if\(sk\)\{ rec\.yaw=rec\.yaw===undefined\?want0:want0\+Math\.PI\*2\*Math\.round\(\(rec\.yaw-want0\)\/\(Math\.PI\*2\)\); return; \}/.test(pb)) rerr.push("a seek does not take the clock's heading at once, its turns kept"); }
  if(/LOOSE\[/.test(fnOf("ambientNow"))) rerr.push("a broken body's sway still counted as drift (ambientNow): it is the pose's, held while the clock stands");
  rerr.forEach(e=>console.log("  ! "+e));
  console.log("a block at rest (8G's verification; 8H's pause): "+(rerr.length?rerr.length+" wrong":"its shape, tilt and heading take their targets exactly within the threshold that stops asking for frames; eased only while the clock moves on under Play, held while it stands, the clock's at a seek"));
  if(rerr.length) process.exitCode=1;
}
/* Stage 8, implementation PR 8G's prerequisite 1 (the audit of 8F; docs/STAGE8_SPEC.md section 19.1): the ground's atlas mapped as painted. Both
   atlases uploaded with their rows as painted (flipY false: the shader's cell k, rows from the texture's first, is the canvas's cell k the right
   way up); the photographs' normals turned to the atlas's own convention as they are blended in (their green, OpenGL's, toward the image's top;
   the patterns' toward its foot, the way the shader's v runs); the procedural painters shared by the atlases and the self-test's check; the
   shader's debug outputs (uDebug 2 to 5, the cell forced by uDebugCell) each behind its own uDebug test, both 0 as built, so that nothing drawn
   changes; the self-test's check of the mapping present */
{
  const acorn=require('acorn'), src=fs.readFileSync('app.js','utf8'), wsrc=fs.readFileSync('world.js','utf8'), wast=acorn.parse(wsrc,{ecmaVersion:2020}), perr=[];
  const wfn=name=>{ const n=wast.body.find(q=>q.type==="FunctionDeclaration"&&q.id.name===name); return n?wsrc.slice(n.start,n.end):""; };
  const ca=wfn("coverAtlas"), cn=wfn("coverNormalAtlas"), pn=wfn("photoNormal"), as=wfn("atlasShader"), gu=wfn("groundUniforms");
  if(!/_atlas=new THREE\.CanvasTexture\(c\);\s*_atlas\.flipY=false;/.test(ca)||!/paintAtlasCells\(d,CW\);/.test(ca)) perr.push("the colour atlas is not uploaded as painted (flipY false) from paintAtlasCells");
  if(!/_nrmAtlas=new THREE\.CanvasTexture\(c\);\s*_nrmAtlas\.flipY=false;/.test(cn)||!/paintNormalCells\(d,CW\);/.test(cn)) perr.push("the normal atlas is not uploaded as painted (flipY false) from paintNormalCells");
  if(!/var nx=-\(hR-hL\)\*s, ny=-\(hU-hD\)\*s, nz=1\.0;/.test(wfn("paintNormalCells"))) perr.push("the patterns' normals are not differentiated along the canvas's rows and down its columns (their green toward its foot)");
  if(!/d\[o\+1\]=Math\.round\(d\[o\+1\]\*\(1-w\)\+\(255-ph\[p\+1\]\)\*w\);/.test(pn)) perr.push("the photographs' normals are not turned to the atlas's convention as they are blended in (their green, OpenGL's, toward the image's top)");
  if(/flipY\s*=\s*true/.test(wsrc)) perr.push("a texture of world.js uploaded flipped");
  if(!/"float gCell=uDebug>1\.5\?uDebugCell:\(uMode>0\.5\?/.test(wsrc)) perr.push("the forced cell is not the debug outputs' alone (uDebug above 1.5)");
  { const m=/\.replace\("#include <dithering_fragment>",([\s\S]*?)\);\s*\};/.exec(as), body=m?m[1]:"";
    const assigns=(body.match(/gl_FragColor=/g)||[]).length, guarded=(body.match(/if\(uDebug>[0-9.]+(&&uDebug<[0-9.]+)?\) gl_FragColor=/g)||[]).length;
    if(!m||assigns!==5||guarded!==5) perr.push("the ground's debug outputs are not five, each behind its own uDebug test ("+guarded+" of "+assigns+")"); }
  if(!/uDebug:\{value:0\}, uDebugCell:\{value:0\}/.test(gu)) perr.push("the debug uniforms are not 0 as built");
  if(!/the ground's atlas \(8G's prerequisite 1\): each cover cell drawn from its own painting, the right way up/.test(src)) perr.push("the self-test's check of the atlas's mapping is missing");
  perr.forEach(e=>console.log("  ! "+e));
  console.log("the ground's atlas (8G's prerequisite 1): "+(perr.length?perr.length+" wrong":"both atlases uploaded as painted, the photographs' normals turned to the patterns' convention, the painters shared with the self-test, the debug outputs behind uDebug and off as built, the self-test's check present"));
  if(perr.length) process.exitCode=1;
}
/* Stage 8, implementation PR 8G (decision 248 (a); docs/STAGE8_SPEC.md section 19): the buildings. Their values (VILL8G, BLD8G: design values,
   changed only on purpose); what they read of the claims (BUILDINGS: the rear buildings' share and walls, the fences; CHURCHES and CHAPELS);
   the roofs a convention by a share, never chosen by a building's walls; no wall drawn round the castle, its orchard or its pheasantry, no
   other wall than Telnitz's churchyard's; the plan deterministic (seeded, no Math.random); each building on the drawn ground read exactly and
   laid again whenever the ground changes; every building mesh shown and hidden with the landscape's layers */
{
  const acorn=require('acorn'), wsrc=fs.readFileSync('world.js','utf8'), src=fs.readFileSync('app.js','utf8'), wast=acorn.parse(wsrc,{ecmaVersion:2020}), gerr=[];
  const wfn=name=>{ const n=wast.body.find(q=>q.type==="FunctionDeclaration"&&q.id.name===name); return n?wsrc.slice(n.start,n.end):""; };
  const wvar=name=>{ const n=wast.body.find(q=>q.type==="VariableDeclaration"&&q.declarations.some(d=>d.id.name===name)); return n?wsrc.slice(n.start,n.end):""; };
  const V=wvar("VILL8G"), Bv=wvar("BLD8G");
  if(!/plot:\[1\.9,2\.2\],/.test(V)||!/small:\{plot:\[1\.75,1\.95\], long:\[2\.05,2\.45\]\},/.test(V)||!/tiny:\{plot:\[1\.5,1\.7\], long:\[1\.75,2\.05\], w:\[0\.9,1\.0\], d:\[0\.85,0\.95\]\},/.test(V)||
     !/side:\{w:\[1\.0,1\.12\], l:\[2\.3,2\.8\]\},/.test(V)||!/north:0\.85,/.test(V)||!/rear:\{d:\[0\.9,1\.05\], h:\[0\.82,0\.95\], share:0\.2\},/.test(V)||!/clear:\{road:0\.25, stream:0\.35, tree:0\.2\},/.test(V)||
     !/margin:0\.40,/.test(V)||!/mere:0\.25,/.test(V)||!/touch:0\.01,/.test(V)) gerr.push("VILL8G's values changed (design values: change them on purpose, with docs/STAGE8_SPEC.md section 19)");
  if(!/pitch:\{thatch:1\.15, tile:0\.84\},/.test(Bv)||!/tile:0\.17,/.test(Bv)||!/castle:\{w:7\.6, d:5\.8, west:1\.35, east:2\.3, ns:1\.2, h:\[1\.15,2\.05\]\},/.test(Bv)||!/fence:\{len:0\.62, h:0\.3, inset:0\.3\},/.test(Bv)||
     !/chateau:\{w:5\.6, d:1\.5, wing:\[1\.4,2\.6\], h:2\.0, near:10, bearing:236, tol:22\.5\}/.test(Bv))
    gerr.push("BLD8G's values changed (design values: change them on purpose, with docs/STAGE8_SPEC.md section 19; the château's tolerance, 22.5 degrees, with section 20.3)");
  if(!/var CHAPEL8G=0\.5;/.test(wsrc)) gerr.push("the chapel's size (CHAPEL8G) changed");
  if(!/var V8CANDS=24;/.test(wsrc)) gerr.push("the church's places tried for its village's plan (V8CANDS) changed");
  /* the claims read, not typed */
  const rear=wfn("v8Rear"), plan=wfn("planBuildings8g"), church=wfn("churchPlan8g");
  /* Stage 8, implementation PR 8H (docs/STAGE8_SPEC.md section 20.3): the château within its tolerance of its bearing today (an octant, not 8G's
     quarter-turn), its centre in the town's place, no drawn road or stream between it and its church; the town's church taking the least move,
     among its every clear place within 5 units, that leaves the château such a place; the farmsteads' words counted from what is drawn */
  { const cp=wfn("chateauPlan8g");
    if(!/if\(dev>B\.tol\+1e-9\) continue;/.test(cp)||/>90\+1e-9/.test(cp)) gerr.push("the château not sought within BLD8G.chateau.tol of its bearing (8G's quarter-turn back?)");
    if(!/if\(!v8Foot\(c\[0\],c\[1\]\)\) continue;/.test(cp)||!/if\(v8Between\(ch\.x,ch\.z,c\[0\],c\[1\],segs\)\) continue;/.test(cp)) gerr.push("the château's place not held in the town's place, or a drawn road or stream allowed between it and its church");
    if(!/kind==="temple"\?0:V8CANDS/.test(wfn("churchPlan8g"))) gerr.push("the town's church not offered its every clear place within 5 units");
    if(!/if\(!ct\.parts\.length\) continue;/.test(plan)) gerr.push("a place of the town's church taken that leaves its château none");
    const bs=(acorn.parse(src,{ecmaVersion:2020}).body.find(q=>q.type==="FunctionDeclaration"&&q.id.name==="buildingsSection")||{}), bsrc=bs.start!=null?src.slice(bs.start,bs.end):"";
    if(!/farmsteadsText\(P\)/.test(bsrc)||/each an L along its street: this map/.test(bsrc)) gerr.push("the dossier's farmsteads not counted as drawn (farmsteadsText): 'each an L' typed for every village"); }
  if(!/BUILDINGS\.villages/.test(rear)||!/c\.n/.test(rear)||!/c\.wall==="timber"/.test(rear)) gerr.push("the rear buildings' share and walls not read from BUILDINGS.villages");
  if(!/BUILDINGS\.fences/.test(plan)) gerr.push("the fences not drawn from BUILDINGS.fences");
  if(!/CHAPELS\.indexOf\(v\[0\]\)/.test(church)||!/CHURCHES\.indexOf\(v\[0\]\)/.test(church)) gerr.push("the churches and the chapel not drawn from CHURCHES and CHAPELS");
  /* the roofs: a convention by a share; the walls never choose a roof */
  if(!/var roof=town\?"tile":\(f\.roof<BLD8G\.tile\?"tile":"thatch"\);/.test(plan)) gerr.push("the farmsteads' roofs not the design share (BLD8G.tile), the town's tile");
  if(!/part:"rear building", village:v\[0\], farm:i\}/.test(plan)||!/L\.push\(\{R:f\.rear\.R, h:f\.rear\.h, roof:roof, wall:/.test(plan)) gerr.push("a rear building's roof not its farmstead's");
  { const roofs=(plan.match(/roof:[^,}]+/g)||[]); if(roofs.some(r=>/timber|wall/.test(r))) gerr.push("a roof chosen by a building's walls ("+roofs.filter(r=>/timber|wall/.test(r)).join(", ")+")"); }
  /* no wall but Telnitz's churchyard's: no ring round the castle (8F's), no orchard or pheasantry wall */
  if(/Math\.cos\(a\)\*7\.0/.test(wsrc)||/orchard|pheasant|Fasan/i.test(wfn("castlePlan8g")+plan)) gerr.push("a wall drawn round the castle, its orchard or its pheasantry");
  if((plan.match(/wall="stone"|wall:"stone"/g)||[]).length!==1||!/churchyard8g\(ch,cc\)\.forEach\(function\(q\)\{ q\.village=v\[0\]; q\.wall="stone";/.test(plan)) gerr.push("a stone wall drawn other than Telnitz's churchyard's");
  if(!/if\(v\[0\]==="Telnitz"\) churchyard8g/.test(plan)) gerr.push("the churchyard's wall not Telnitz's alone");
  /* the plan deterministic */
  ["v8PlanAt","villagePlan8g","churchPlan8g","castlePlan8g","chateauPlan8g","fences8g","planBuildings8g","v8Near","v8NearAll","v8Settle"].forEach(f=>{ const b=wfn(f); if(!b) gerr.push(f+" missing"); else if(/Math\.random/.test(b)) gerr.push(f+" draws Math.random (the plan is seeded)"); });
  /* on the drawn ground, read exactly; laid again when it changes */
  const bg=wfn("bldGround");
  if(!/\[\[ax,bx\],\[az,bz\],\[ax\+az,bx\+bz\]\]/.test(bg)||!/if\(v8BoxPt\(R,gx,gz\)===0\) rd\(gx,gz\);/.test(bg)) gerr.push("the ground under a building not read exactly (its edges' crossings of the grid and the cells' diagonals, the grid's vertices inside)");
  if(!/layBuildings\(\);/.test(wfn("rescaleWorld"))) gerr.push("the buildings not laid again when the drawn ground changes (rescaleWorld)");
  if(!/floor=Math\.max\(G\.mean,G\.g1-0\.45\*Math\.max\(b\.h,0\.6\)\);/.test(wfn("layBuildings"))) gerr.push("a building's floor not between the ground's mean and its highest point less 0.45 of its walls");
  /* shown with the landscape's layers */
  { const n=acorn.parse(src,{ecmaVersion:2020}).body.find(q=>q.type==="FunctionDeclaration"&&q.id.name==="syncLandscapeLayers"), sl=n?src.slice(n.start,n.end):"";
    if(!/\["barns","plinths","thatch","stone","fences"\]\.forEach\(function\(k\)\{ if\(world\[k\]\) world\[k\]\.visible=on; \}\);/.test(sl)) gerr.push("the 8G building meshes not shown and hidden with the landscape's layers (syncLandscapeLayers)"); }
  if(!/barns:barnMesh, plinths:plinthMesh, thatch:thatchMesh, stone:stoneMesh, fences:fenceMesh/.test(wfn("buildWorld"))) gerr.push("buildWorld does not hand the 8G meshes to the app");
  /* the self-test's exception, named with its reason */
  if(!/var FARMS8G=\{Satschan:\{n:5, why:"half its place lies under the drawn Satschan mere's ice, the Littawa crosses the rest and its church stands in it"\}\};/.test(src)) gerr.push("the self-test's FARMS8G changed (Satschan's 5 of 7, with its reason: a shortfall needs its reason, with docs/STAGE8_SPEC.md section 19)");
  gerr.forEach(e=>console.log("  ! "+e));
  console.log("the buildings (decision 248 (a)): "+(gerr.length?gerr.length+" wrong":"VILL8G, BLD8G and CHAPEL8G as built; the rear buildings, the fences, the churches and the chapel read from BUILDINGS, CHURCHES and CHAPELS; the roofs a share, never the walls'; no wall but Telnitz's churchyard's; the plan seeded; the ground read exactly, laid again with it; shown with the landscape; FARMS8G"));
  if(gerr.length) process.exitCode=1;
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
  /* Stage 8, implementation PR 8B (decision 239): the layer's first setting by presentation, off on the landscape (where the app opens) and on
     on the paper map (decision 85 kept there); the outlines no dash either, in the side's token colour on its edge, the selection's in the accent */
  if(!/var CONF_ON=\{land:false, paper:true\};/.test(src)||!/layerOn=\{[^}]*confidence:false/.test(src)) cerr.push("position confidence is not off at first on the landscape and on at first on the paper map (decisions 85, 239)");
  ["makeOutline","outlinePlace","outlineReach"].forEach(f=>{ const n=ast.body.find(q=>q.type==="FunctionDeclaration"&&q.id.name===f);
    if(!n) cerr.push(f+" missing"); else if(/setLineDash|LineDashed|dashSize|dashRuns|segment/i.test(src.slice(n.start,n.end))) cerr.push(f+" draws a dash"); });
  { const m=/var OUTLINE_FS=\[([\s\S]*?)\]\.join/.exec(src); if(!m||/dash|fract\(|mod\(/i.test(m[1])) cerr.push("the outline's fragment shader is missing or draws a dash"); }
  if(!/outlinePlace\(rec\.line,gl,wq\[0\],wq\[1\],rec\.yaw\|\|0,fu\.W0\*fu\.sw,fu\.D0\*fu\.sd,hexNum\(sl\?TOKENS\.theme\.dark\.accent:SL\.base\),hexNum\(sl\?TOKENS\.sym\.keyline:SL\.edge\)/.test(src)||
     !/SL=TOKENS\.sym\.side\[sdl\]/.test(src)) cerr.push("the outlines' colours are not the side's tokens (the selection's the accent)");
  cerr.forEach(e=>console.log("  ! "+e));
  console.log("confidence marks: "+(cerr.length?cerr.length+" wrong":"no dash, the side's token colour; off at first on the landscape, on at first on the paper map; the outlines no dash, in the side's tokens, the selection's in the accent"));
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
  /* decision 173 (WCAG 2.5.3): its name begins with its visible words; no aria-pressed on a three-way cycle */
  { const b=(sh.match(/<button[^>]*id="eyesbtn"[^>]*>([^<]*)</)||[]); const lab=(b[0]||"").match(/aria-label="([^"]*)"/);
    if(!b[0]||/aria-pressed/.test(b[0])||!lab||lab[1].indexOf(b[1])!==0) werr.push("shell.html: the eyes button's name does not begin with its visible words, or it carries aria-pressed");
    if(/eyesbtn[\s\S]{0,400}setAttribute\("aria-pressed"/.test(src)) werr.push("app.js: the eyes button is still given aria-pressed"); }
  werr.forEach(e=>console.log("  ! "+e));
  console.log("Whose eyes: "+(werr.length?werr.length+" wrong":"one control, labelled a model reading, the eye's vantage hidden until a headquarters is chosen, its button's name beginning with its words (decision 173)"));
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
  if(!/var playing=false, speed=0\.5,/.test(app)) oerr.push("app.js: Play no longer starts at half speed (decision 74)");
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
  if(!/bottom:var\(--tb\)/.test(base)) derr.push("style.css: the undocked .drawer reaches over the timeline (decision 165: bottom:var(--tb)): "+base.trim());
  derr.forEach(e=>console.log("  ! "+e));
  console.log("dossier hidden when closed: "+(derr.length?derr.length+" wrong":"hidden after its slide, shown at once, inert while closed, above the timeline undocked (decision 165)"));
  if(derr.length) process.exitCode=1;
}
/* decision 164 (roadmap step 3): the Panels button, a disclosure of the rail below 1080 px; its words from LABELS; not shown docked or under the
   first card; its behaviour is the harness's narrow block */
{
  const sh=fs.readFileSync('shell.html','utf8'), css=fs.readFileSync('style.css','utf8'), src=fs.readFileSync('app.js','utf8'), perr=[];
  const b=(sh.match(/<button[^>]*id="panelsbtn"[^>]*>/)||[""])[0];
  if(!b||!/aria-expanded="false"/.test(b)||!/aria-controls="rail"/.test(b)||!/type="button"/.test(b)) perr.push("shell.html: the Panels button is not a disclosure of #rail");
  if(!/<nav class="rail" id="rail"/.test(sh)) perr.push("shell.html: the rail has no id for aria-controls");
  if(!/panels:\{button:"Panels"/.test(src)||!/pb\.textContent=LABELS\.panels\.button/.test(src)) perr.push("app.js: the Panels button's words are not from LABELS");
  if(!/\n#panelsbtn\{display:none\}/.test(css)||!/@media \(max-width:1079\.98px\)\{ body:not\(\.firstrun-on\) #panelsbtn\{display:inline-block\} \}/.test(css)) perr.push("style.css: the Panels button is not shown below 1080 px only, outside the first card");
  if(!/setAttribute\("aria-expanded",String\(!document\.body\.classList\.contains\("rail-hidden"\)\)\)/.test(src)) perr.push("app.js: syncInert does not keep the button's aria-expanded");
  perr.forEach(e=>console.log("  ! "+e));
  console.log("the Panels button: "+(perr.length?perr.length+" wrong":"a disclosure of the rail below 1080 px, its words from LABELS, aria-expanded kept by syncInert (decision 164)"));
  if(perr.length) process.exitCode=1;
}
/* decision 174 (roadmap step 3, the owner's answer): at 720 px and below the dispatch card keeps its derived readings (nothing in that block
   hides them); the caption shows them only where the card is hidden, as above 720 px; the harness's narrow block measures it at 700 px */
{
  const css=fs.readFileSync('style.css','utf8'), i=css.indexOf("@media (max-width:720px){"), blk=i<0?"":css.slice(i,css.indexOf("\n}",i));
  /* every rule of the block whose selectors name the card's readings: none hides them (display:none or visibility:hidden) */
  const hides=[...blk.slice(blk.indexOf("{")+1).matchAll(/([^{}]+)\{([^}]*)\}/g)].some(m=>/\.der\b/.test(m[1])&&!/\.tb-cap/.test(m[1])&&/display:none|visibility:hidden/.test(m[2]));
  const ok=i>=0&&!hides&&!/\.tb-cap \.der/.test(blk);
  console.log("the derived readings at 720 px and below: "+(ok?"kept in the dispatch card (decision 174)":"WRONG"));
  if(!ok){ console.log("  ! style.css: the 720 px block hides the card's derived readings or overrides the caption's"); process.exitCode=1; }
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
/* roadmap step 5 (question 172; WCAG 1.4.11): the map items' focus ring stands on a plate of its own, so it meets 3:1 on any ground. The
   base rule .ml-item:focus-visible draws an outline in a token colour and a box-shadow plate in another, the plate reaching at least 1 px
   past the ring (spread >= offset + width + 1), and the two token colours at 3:1 or more in the dark theme (:root) and the paper map's
   (body.mode-staff), as the tokens block writes them */
{
  const ferr=[], R=allRules.find(r=>r.media===null&&r.sels.indexOf(".ml-item:focus-visible")>=0);
  const tok=sel=>{ const r=allRules.find(q=>q.media===null&&q.sel===sel), o={}; if(r) for(const m of r.body.matchAll(/(--[\w-]+):([^;]+)/g)) o[m[1]]=m[2].trim(); return o; };
  const dark=tok(":root"), paper=Object.assign({},dark,tok("body.mode-staff"));
  const lum=h=>{ const v=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(c=>c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4)); return 0.2126*v[0]+0.7152*v[1]+0.0722*v[2]; };
  const ratio=(a,b)=>{ const x=lum(a), y=lum(b); return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05); };
  if(!R) ferr.push("style.css: no base rule .ml-item:focus-visible");
  else { const b=R.body.replace(/\s+/g," ");
    const ol=/outline:\s*(\d+(?:\.\d+)?)px solid var\((--[\w-]+)\)/.exec(b), of=/outline-offset:\s*(\d+(?:\.\d+)?)px/.exec(b), sh=/box-shadow:\s*0 0 0 (\d+(?:\.\d+)?)px var\((--[\w-]+)\)/.exec(b);
    if(!ol||!of||!sh) ferr.push("style.css: .ml-item:focus-visible lacks its outline, offset or plate (box-shadow 0 0 0 Npx var(--token))");
    else { const w=+ol[1], o=+of[1], sp=+sh[1];
      if(sp<o+w+1) ferr.push("style.css: the focus ring's plate ("+sp+" px) does not reach 1 px past the ring ("+(o+w)+" px)");
      [["the dark theme",dark],["the paper map",paper]].forEach(([n,T])=>{ const a=T[ol[2]], p=T[sh[2]];
        if(!/^#[0-9A-Fa-f]{6}$/.test(a||"")||!/^#[0-9A-Fa-f]{6}$/.test(p||"")) ferr.push("style.css: "+n+": "+ol[2]+" or "+sh[2]+" is not a #RRGGBB token");
        else if(ratio(a,p)<3) ferr.push("style.css: "+n+": the focus ring "+a+" on its plate "+p+" at "+ratio(a,p).toFixed(2)+":1, under 3:1"); }); } }
  ferr.forEach(e=>console.log("  ! "+e));
  console.log("map focus ring: "+(ferr.length?ferr.length+" wrong":"on its own plate, at 3:1 or more in both themes (question 172)"));
  if(ferr.length) process.exitCode=1;
}
/* roadmap step 6 item 3 (docs/STEP6_SPEC.md section 4.5; decisions 223-226, 228): the phone layout's rules. Below 720 px wide (one query, the
   stylesheet's and app.js's PHONE_Q): the compact timeline (the ten-minute steps, the four speeds and "Whose eyes?" off it, the speed one button;
   no act row; the phases no presses on the axis, listed in the dispatch sheet); the sheets; the Menu; their controls not shown elsewhere, and at
   least 24 px high where the block sets them; their words from LABELS. Held landscape (430 px tall or less), the controls decision 225 takes off
   the phone's timeline off it too, the tools standing down under the first card. Their behaviour is the harness's phone block and cases */
{
  const sh=fs.readFileSync('shell.html','utf8'), src=fs.readFileSync('app.js','utf8'), herr=[];
  const q=(/var PHONE_Q="([^"]+)"/.exec(src)||[])[1];
  const blk=media=>allRules.filter(r=>r.media===media);
  const ph=blk(q||"(max-width:720px)"), ls=blk("(max-height:430px)");
  const decl=(rules,sel,p)=>{ const r=rules.filter(x=>x.sels.indexOf(sel)>=0); let v=null; r.forEach(x=>declsOf(x.body).forEach(([k,w])=>{ if(k===p) v=w; })); return v; };
  if(q!=="(max-width:720px) and (min-height:431px)") herr.push("app.js: PHONE_Q is not the phone query (max-width:720px) and (min-height:431px): "+q);
  if(!ph.length) herr.push("style.css: no @media "+q+" block (the phone layout)");
  ["#prev","#next","#eyesbtn",".speeds",".tb-acts"].forEach(s=>{ if(decl(ph,s,"display")!=="none") herr.push("style.css: "+s+" not hidden on the phone's timeline (decision 225, 224)"); });
  ["#prev","#next","#eyesbtn",".speeds"].forEach(s=>{ if(decl(ls,s,"display")!=="none") herr.push("style.css: "+s+" not off a phone's timeline held landscape (decisions 225, 226)"); });
  if(decl(ph,".step","pointer-events")!=="none") herr.push("style.css: the phases are still presses on the phone's axis (decision 224 (a))");
  ["#speedbtn","#menubtn",".dgrip",".phlist",".tools-vm"].forEach(s=>{ const b=allRules.find(r=>r.media===null&&r.sels.indexOf(s)>=0);
    if(!b||!/display:none/.test(b.body)) herr.push("style.css: "+s+" is shown outside the phone layout (no base display:none)"); });
  [["#speedbtn",ph],["#menubtn",ph],[".tb-icon",ph],[".tb-play",ph],[".tb-follow",ph],[".ph-item",ph],[".tools .t",ph],[".railclose",ph]].forEach(([s,R])=>{ const h=parseFloat(decl(R,s,"min-height"));
    if(!(h>=24)) herr.push("style.css: "+s+" under 24 px high on a phone ("+decl(R,s,"min-height")+")"); });
  if(!/body\.drawer-open \.dispatch/.test(ph.map(r=>r.sel).join("\n"))) herr.push("style.css: the dispatch sheet does not give way to an open dossier on a phone");
  if(decl(ls,"body.firstrun-on .tools","display")!=="none") herr.push("style.css: held landscape the tools stand under the first card (decision 226)");
  if(!/<button class="t" id="menubtn" type="button" aria-expanded="false" aria-controls="tools">/.test(sh)||!/<div class="tools" id="tools">/.test(sh)) herr.push("shell.html: the Menu is not a disclosure of #tools");
  if(!/<button class="dgrip" id="dgrip" type="button" aria-expanded="false">/.test(sh)) herr.push("shell.html: the dispatch sheet's grip is not a disclosure button");
  if(!/mnb\.textContent=LABELS\.phone\.menu/.test(src)||!/dgb\.setAttribute\("aria-label",LABELS\.phone\.grip\)/.test(src)||!/LABELS\.phone\.speed\+" "\+on\.textContent/.test(src)) herr.push("app.js: the phone layout's words are not from LABELS.phone");
  herr.forEach(e=>console.log("  ! "+e));
  console.log("the phone layout: "+(herr.length?herr.length+" wrong":"below 720 px the compact timeline, the phases listed, the sheets and the Menu, their words from LABELS; held landscape the phone's timeline (decisions 223-226)"));
  if(herr.length) process.exitCode=1;
}
/* Stage 8, implementation PR 8A (decision 253 (b); docs/STAGE8_SPEC.md section 13.2): the roads' and streams' ribbons wound facing up and drawn
   on both faces, and their widths the display convention recorded: half the widths they were built with, on the landscape and on the paper map.
   Whether each kind is drawn where it lies is the self-test's rendered check (ribbonVisibility) */
{
  const W=fs.readFileSync('world.js','utf8'), rerr=[];
  if(!/idx\.push\(o,o\+1,p, o\+1,p\+1,p\)/.test(W)) rerr.push("world.js: the ribbons' triangles are not wound facing up (o, o+1, p), (o+1, p+1, p)");
  const rw=/var RIBBON_W=(\{[^;]*\});/.exec(W); let R=null; try{ R=rw&&Function("return "+rw[1])(); }catch(e){}
  if(!R) rerr.push("world.js: no RIBBON_W table");
  else ["land","paper"].forEach(p=>["stream","road"].forEach(g=>{ if(!R[p]||R[p][g]!==0.5) rerr.push("world.js: RIBBON_W."+p+"."+g+" is "+(R[p]&&R[p][g])+", not the recorded 0.5 (section 13.2)"); }));
  const bw=/function buildWater\([^)]*\)\{[\s\S]*?\n\}/.exec(W), br=/function buildRoads\([^)]*\)\{[\s\S]*?\n\}/.exec(W);
  [["buildWater",bw,2],["buildRoads",br,4]].forEach(([n,m,k])=>{ const c=m?(m[0].match(/side:THREE\.DoubleSide/g)||[]).length:0; if(c<k) rerr.push("world.js: "+n+" draws "+c+" of its "+k+" ribbon materials on both faces"); });
  rerr.forEach(e=>console.log("  ! "+e));
  console.log("roads and streams: "+(rerr.length?rerr.length+" wrong":"wound facing up, drawn on both faces, at half the widths they were built with in both presentations (decision 253)"));
  if(rerr.length) process.exitCode=1;
}
