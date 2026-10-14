/* Roadmap step 4 (docs/FINAL_AUDIT.md H-6; owner decisions 128 (b), 130): the narrative statements of data.js and analysis.js, one
   statement per string a visitor reads as a statement about the battle or about this map's method, each with a stable ref in the
   overclaim scan's path format (tools/lang-scan.js: an array element by its id where it has one, FEATURES[#zuran].story,
   PHASES[#3].events[1], FORMATIONS.kamensky.track["3"].act). A timeline line, a place's fact, a layer and a Command row are one
   statement each (their label and text together; the ref is the pair's). Read-only; loads no page.
   statements(ROOT) -> [{ref, cls, text, t, label, file, line}]: t the statement's text as the claim's drift guard reads it (the text
   part, not the label), label the pair's label where there is one. Excluded (and why): names and identifiers (but an event's n, which
   states what happened), enums and keys, tm.ev (quotations of other statements, whose claim is theirs), tolWhy (never shown), the
   apparatus (CLAIM, STATUS, NATION), the appearance table (claim by claim since Stage 6B). */
"use strict";
const path=require("path");
/* [class, pattern over lang-scan's path, the pair's member that is the statement's text (null: the string itself)] */
const CLASSES=[
  ["phase title",   /^PHASES\[#\d+\]\.title$/],
  ["phase lede",    /^PHASES\[#\d+\]\.lede$/],
  ["phase flash",   /^PHASES\[#\d+\]\.flash$/],
  ["phase line",    /^(PHASES\[#\d+\]\.events\[\d+\])\[(0|1)\]$/, 1],
  ["event name",    /^EVENTS\[#[\w-]+\]\.n$/],
  ["event why",     /^EVENTS\[#[\w-]+\]\.why$/],
  ["event dispute", /^EVENTS\[#[\w-]+\]\.dispute$/],
  ["formation",     /^FORMATIONS\.\w+\.(desig|commander|staff|role|note|strengthNote|mixedNote)$/],
  ["formation",     /^FORMATIONS\.\w+\.army\.(men|src)$/],
  ["track act",     /^FORMATIONS\.\w+\.track\["\d+"\]\.act$/],
  ["track objective", /^FORMATIONS\.\w+\.track\["\d+"\]\.obj$/],
  ["timing note",   /^FORMATIONS\.\w+\.track\["\d+"\]\.tm\.note$/],
  ["place",         /^FEATURES\[#\w+\]\.(sub|story)$/],
  ["place why",     /^FEATURES\[#\w+\]\.why\[\d+\]$/],
  ["place fact",    /^(FEATURES\[#\w+\]\.facts\[\d+\])\[(0|1)\]$/, 1],
  ["theme",         /^ANALYSIS\[#\w+\]\.text$/],
  ["tour",          /^TOUR\[\d+\]\.x$/],
  ["act",           /^ACTS\[#\w+\]\.line$/],
  ["command",       /^(COMMAND\.(?:fr|al)\["\d+"\]\[\d+\])\[(0|1|2)\]$/, 2],
  ["plan",          /^PLANS\.(?:al|fr)\.(author|intent|cost)$/],
  ["plan",          /^PLANS\.(?:al|fr)\.assumed\[\d+\]$/],
  ["plan order",    /^PLANS\.(?:al|fr)\.cols\[\d+\]\.ord$/],
  ["method",        /^SOURCE_NOTE\.(body|refs)\[\d+\]$/],
  ["method",        /^(SOURCE_NOTE\.layers\[\d+\])\[(0|1)\]$/, 1]
];
const T_LEN=40;
function statements(ROOT){
  ROOT=path.resolve(ROOT);
  const LS=require(path.join(ROOT,"tools","lang-scan.js"))(ROOT);
  const out=[], byRef=new Map();
  LS.records.filter(r=>(r.file==="data.js"||r.file==="analysis.js")&&r.guarded&&r.text!=="").forEach(r=>{   /* an empty story is no statement */
    for(const [cls,re,textIdx] of CLASSES){ const m=re.exec(r.path); if(!m) continue;
      if(textIdx==null){ const s={ref:r.path,cls,text:r.text,t:r.text.slice(0,T_LEN),label:null,file:r.file,line:r.line}; out.push(s); byRef.set(s.ref,s); return; }
      const ref=m[1], part=+m[2]; let s=byRef.get(ref);
      if(!s){ s={ref,cls,text:"",t:"",label:null,parts:[],ti:textIdx,file:r.file,line:r.line}; out.push(s); byRef.set(ref,s); }
      s.parts[part]=r.text;
      return; } });
  /* the text's index is the pattern's that made the pair (two classes, "method" among them, have patterns of both kinds; the review of
     c69890a: looked up by class name, SOURCE_NOTE.layers lost their text) */
  out.forEach(s=>{ if(!s.parts) return; const ti=s.ti;
    s.label=s.parts.filter((x,i)=>i!==ti&&x!=null).join(" / ")||null; s.text=s.parts[ti]||""; s.t=s.text.slice(0,T_LEN); delete s.parts; delete s.ti; });
  return out;
}
module.exports={statements,CLASSES,T_LEN};
if(require.main===module){
  const S=statements(path.resolve(__dirname,"..","..")), c={};
  S.forEach(s=>{ c[s.cls]=(c[s.cls]||0)+1; });
  console.log("narrative statements: "+S.length); Object.entries(c).forEach(([k,v])=>console.log("  "+k+": "+v));
}
