global.GEOREF=require('./geo.js');   /* the single geographic reference */
const fs=require('fs');
require('./tools/fresh.js').regen('helpers');   /* roadmap step 1 (docs/FINAL_AUDIT.md T-9): the generated modules read below are regenerated from the live sources first, also when this suite runs on its own */
function load(f){ eval(fs.readFileSync(f,'utf8')); return eval; }
eval(fs.readFileSync('data.js','utf8'));
eval(fs.readFileSync('appearance.js','utf8'));   /* Stage 6B: the historical appearance, loaded after data.js as in the build's order */
eval(fs.readFileSync('tokens.js','utf8'));   /* Stage 4E: world.js reads the paper map's ground colours from TOKENS, as in the build's order */
eval(fs.readFileSync('world.js','utf8'));
eval(fs.readFileSync('_state.js','utf8'));
eval(fs.readFileSync('_ov.js','utf8'));
eval(fs.readFileSync('analysis.js','utf8'));
/* the plotted anchor a formation (or the first of its leaves) holds at a phase - the data, not the live clock */
function anchorPos(id,ph){ const f=FORMATIONS[id];
  if(f.track){ const s=stateAt(id,ph); return s&&s.p?s.p:null; }
  for(const k of leavesOf(id,[])){ const q=anchorPos(k,ph); if(q) return q; } return null; }

let errs=[], warn=[];
/* a moment's clock: a phase's start ("ph:<n>") or an event's start ("ev:<id>"); null if it names neither */
function momentT(m){ const k=String(m||""), i=k.indexOf(":"), kind=k.slice(0,i), id=k.slice(i+1);
  if(kind==="ph"){ const n=+id; return (PHASES[n]&&String(n)===id)?PHASES[n].t0:null; }
  if(kind==="ev"){ const e=EVENTS.find(x=>x.id===id); return e?(Array.isArray(e.t)?e.t[0]:e.t):null; }
  return null; }
const ids=Object.keys(FORMATIONS);
console.log("formations:",ids.length,"| phases:",PHASES.length,"| features:",FEATURES.length);

// structural checks
ids.forEach(id=>{
  const f=FORMATIONS[id];
  if(f.parent && !FORMATIONS[f.parent]) errs.push(id+": bad parent "+f.parent);
  (f.children||[]).forEach(c=>{ if(!FORMATIONS[c]) errs.push(id+": bad child "+c); });
  if(!f.track && !f.children) errs.push(id+": neither track nor children");
  if(f.track) Object.keys(f.track).forEach(k=>{
    const e0=f.track[k];
    if(e0.claim && !CLAIM[e0.claim]) errs.push(id+" ph"+k+": unknown claim class "+e0.claim);
    else if(e0.claim==="disputed") errs.push(id+" ph"+k+": claim disputed is an event's, with its dispute (roadmap step 2, decision 125 (a)); a track entry marks a disputed hour in its act");
    if(e0.via) e0.via.forEach(v=>{ if(v[0]<0||v[0]>680||v[1]<0||v[1]>500)
      errs.push(id+" ph"+k+": via point off map "+v); });
    if(e0.moveMin!==undefined && !(e0.moveMin>0)) errs.push(id+" ph"+k+": bad moveMin");
    const n=+k; if(!(n>=0&&n<PHASES.length)) errs.push(id+": track phase "+k+" out of range");
    const e=f.track[k];
    if(e.st && !STATUS[e.st]) errs.push(id+" ph"+k+": unknown status "+e.st);
    if('p' in e && e.p!==null){
      if(e.p[0]<0||e.p[0]>680||e.p[1]<0||e.p[1]>500) errs.push(id+" ph"+k+": pos off map "+e.p);
    }
    if(e.cf && !"ABC".includes(e.cf)) errs.push(id+" ph"+k+": bad confidence");
  });
  if(!NATION[f.nation]) errs.push(id+": bad nation");
});
/* D-2 (docs/FINAL_AUDIT.md; question 131): every tracked formation's first positioned anchor declares its grade. A grade carries
   forward to the later anchors, and where none has been declared stateAt (app.js) draws the formation at its default "B" without a
   word. Checked on every tracked formation, the 30 whose first anchor is at phase 0 included (redteam.js's old rule skipped phase 0). */
ids.forEach(id=>{ const tr=FORMATIONS[id].track; if(!tr) return;
  const keys=Object.keys(tr).map(Number).sort((a,b)=>a-b), k0=keys.find(k=>"p" in tr[k]&&tr[k].p);
  if(k0===undefined){ errs.push(id+": no positioned anchor, so no grade (D-2)"); return; }
  if(!tr[k0].cf) errs.push(id+" ph"+k0+": the first positioned anchor declares no grade (D-2: stateAt would draw it at its default B)");
});

// every formation resolves a position somewhere
ids.forEach(id=>{
  let any=false;
  for(let ph=0;ph<PHASES.length;ph++) if(anchorPos(id,ph)) any=true;
  if(!any) errs.push(id+": never has a position");
});

// child strengths vs parent: direct children only, the parent itself never counted
const aggOf=id=>FORMATIONS[id].strength||(FORMATIONS[id].children||[]).reduce((t,k)=>t+aggOf(k),0);
Object.keys(FORMATIONS).filter(id=>FORMATIONS[id].children).forEach(id=>{
  const f=FORMATIONS[id], sum=f.children.reduce((t,k)=>t+aggOf(k),0);
  const ownTroops=!!f.track && f.arm!=="hq";          /* a column that also has a detachment, like Langeron's */
  if(ownTroops){ if(sum>f.strength) errs.push(id+": detachments ("+sum+") exceed the parent ("+f.strength+")"); return; }
  if(f.strength && sum>f.strength) errs.push(id+": its formations ("+sum+") exceed its declared strength ("+f.strength+"): a detachment counted beside its parent, not under it (docs/FINAL_AUDIT.md D-3)");
  if(f.strength && Math.abs(f.strength-sum)/f.strength>0.30) warn.push(id+": declared "+f.strength+" vs children "+sum);
});
/* D-4 (docs/FINAL_AUDIT.md; roadmap step 2): a key declared twice in one object literal of the guarded sources (the later silently wins:
   heightguns@8 declared cf "C" and then "B" until step 2), and a moveMin on a formation's first positioned anchor, where no leg runs into
   it (anchorList never reads it: heightguns@7's 30 until step 2) */
{ const acorn=require("acorn"), dup=[];
  ["geo.js","data.js","appearance.js","analysis.js"].forEach(f=>{ (function walk(n){ if(!n||typeof n.type!=="string") return;
      if(n.type==="ObjectExpression"){ const seen=new Set(); n.properties.forEach(p=>{ if(p.type!=="Property"||p.computed) return;
        const k=p.key.type==="Identifier"?p.key.name:String(p.key.value); if(seen.has(k)) dup.push(f+":"+p.loc.start.line+" "+k); seen.add(k); }); }
      for(const k in n){ const v=n[k]; if(Array.isArray(v)) v.forEach(walk); else if(v&&typeof v.type==="string") walk(v); } })(acorn.parse(fs.readFileSync(f,"utf8"),{ecmaVersion:2020,locations:true})); });
  dup.forEach(d=>errs.push("a key declared twice in one object literal (the later wins): "+d));
  ids.forEach(id=>{ const tr=FORMATIONS[id].track; if(!tr) return; const k0=Object.keys(tr).map(Number).sort((a,b)=>a-b).find(k=>"p" in tr[k]);
    if(k0!==undefined&&tr[k0].moveMin!==undefined) errs.push(id+"@"+k0+": a moveMin on the first positioned anchor, where no leg runs into it (anchorList never reads it)"); }); }

// overlays
for(let i=0;i<PHASES.length;i++){
  const o=OVERLAYS[i];
  if(!o){ warn.push("phase "+i+": no overlay"); continue; }
  [...(o.arrows||[]),...(o.lines||[]),...(o.bounds||[])].forEach(x=>{
    (x.pts||[]).forEach(p=>{ if(p[0]<0||p[0]>680||p[1]<0||p[1]>500) errs.push("phase "+i+": overlay point off map "+p); });
    if(x.side && !["fr","al"].includes(x.side)) errs.push("phase "+i+": bad side");
  });
  (o.obj||[]).forEach(p=>{ if(p[0]<0||p[0]>680) errs.push("phase "+i+": objective off map"); });
}

// terrain sanity at the places that matter, in metres, at ground-truth positions
const G=GEOREF, mAt=k=>G.elevM(hAt(G.GT[k].map[0],G.GT[k].map[1]));
console.log("\n-- relief (m) --");
['pratzeberg','vinohrady','vinocol','santon','zuran','bosenitz','pratzen','kobelnitz','sokolnitz','telnitz','augezd','blasowitz','krzenowitz','austerlitz']
  .forEach(k=>console.log(G.GT[k].n.padEnd(30), mAt(k).toFixed(0)));
const hw=ROADS.find(r=>r.cls==="highway").p, sant=G.GT.santon.map;
const nearHw=hw.reduce((b,q)=>Math.hypot(q[0]-sant[0],q[1]-sant[1])<Math.hypot(b[0]-sant[0],b[1]-sant[1])?q:b);
if(mAt('santon')-G.elevM(hAt(nearHw[0],nearHw[1])) < 15) errs.push("Santon does not stand above the highway");
if(mAt('pratzeberg')-mAt('sokolnitz') < 80) errs.push("Pratzen plateau not dominant over the Goldbach");
if(hAt(SATS[0]*2+340,SATS[1]*2+250) > -2) errs.push("Satschan basin not a depression");

// phase-by-phase occupancy
console.log("\n-- counters on the field by phase --");
for(let ph=0;ph<PHASES.length;ph++){
  const leaves=ids.filter(id=>FORMATIONS[id].track && anchorPos(id,ph));
  const fr=leaves.filter(id=>FORMATIONS[id].nation==='fr').length;
  const al=leaves.length-fr;
  console.log(String(ph).padStart(2), PHASES[ph].clock.padEnd(14), "fr:"+String(fr).padStart(2), "allied:"+String(al).padStart(2));
}

// phases must have strictly increasing, contiguous clock windows
for(let i=0;i<PHASES.length;i++){
  const p=PHASES[i];
  if(!(p.t1>p.t0)) errs.push("phase "+i+": t1 not after t0");
  if(i && PHASES[i-1].t1!==p.t0) errs.push("phase "+i+": clock gap after phase "+(i-1));
}
// analysis chapters must reference real formations, features and times
ANALYSIS.forEach(c=>{
  c.forms.forEach(f=>{ if(!FORMATIONS[f]) errs.push("chapter "+c.id+": unknown formation "+f); });
  c.feats.forEach(f=>{ if(!FEATURES.some(x=>x.id===f)) errs.push("chapter "+c.id+": unknown feature "+f); });
  /* the spine data task: a chapter's clock is its principal moment's; every moment it names is a phase or an event (stricter
     than the clock-range check it replaces, which the resolved clock still passes) */
  const at=momentT(c.at);
  if(at===null) errs.push("chapter "+c.id+": principal moment "+c.at+" is not a phase or an event");
  else if(at<PHASES[0].t0||at>PHASES[PHASES.length-1].t1) errs.push("chapter "+c.id+": time off the clock");
  if(!Array.isArray(c.moments)||!c.moments.length) errs.push("chapter "+c.id+": no moments");
  else c.moments.forEach(m=>{ if(momentT(m)===null) errs.push("chapter "+c.id+": moment "+m+" is not a phase or an event"); });
  if(c.t!==undefined) errs.push("chapter "+c.id+": keeps a clock of its own (t); its clock is its principal moment's");
});
TOUR.forEach((st,i)=>{
  const at=momentT(st.at);
  if(at===null) errs.push("tour stop "+(i+1)+": moment "+st.at+" is not a phase or an event");
  const t=st.t!==undefined?st.t:at;
  if(t===null||t<PHASES[0].t0||t>PHASES[PHASES.length-1].t1) errs.push("tour stop "+(i+1)+": time off the clock");
  if(st.chapter&&!ANALYSIS.some(c=>c.id===st.chapter)) errs.push("tour stop "+(i+1)+": unknown chapter "+st.chapter);
  if(st.t!==undefined&&i!==3) errs.push("tour stop "+(i+1)+": keeps its own clock; only stop 4 does (its text quotes the 07:15 reading)");
});
["fr","al"].forEach(sd=>{
  Object.keys(COMMAND[sd]).forEach(ph=>{
    if(+ph<0||+ph>=PHASES.length) errs.push("COMMAND."+sd+": phase "+ph+" out of range");
    COMMAND[sd][ph].forEach(it=>{
      if(["saw","knew","didnt","ordered","expected"].indexOf(it[0])<0) errs.push("COMMAND."+sd+" ph"+ph+": bad kind "+it[0]);
      if(["doc","inf","anec"].indexOf(it[1])<0) errs.push("COMMAND."+sd+" ph"+ph+": source must be doc, inf or anec");
      if(it[1]==="anec"&&!/memoir anecdote/.test(it[2])) errs.push("COMMAND."+sd+" ph"+ph+": an anecdote row must say it is a memoir anecdote (H-7)");
      if(it[1]!=="anec"&&/memoir anecdote/.test(it[2])) errs.push("COMMAND."+sd+" ph"+ph+": a row that tells a memoir anecdote must carry the anec tag, not "+it[1]+" (H-7)");
    });
  });
  Object.keys(KNOW_OVERRIDE[sd]).forEach(id=>{
    if(!FORMATIONS[id]) errs.push("KNOW_OVERRIDE."+sd+": unknown formation "+id);
    KNOW_OVERRIDE[sd][id].forEach(o=>{
      if(["seen","uncertain","unknown"].indexOf(o[1])<0) errs.push("KNOW_OVERRIDE."+sd+"."+id+": bad state");
    });
  });
});
/* T-6 (docs/FINAL_AUDIT.md): the events validated. Each has a unique kebab-case id; a clock (a minute, or a window [t0,t1] with t0<t1)
   inside the day; a point on the map; a side; a kind the dossier names (its KIND table, read from app.js: if it cannot be read the check
   fails, it does not skip); a timing grade; a claim class (a disputed one with its dispute naming both hours: roadmap step 2, decision
   125 (a)); a title and a reason; known formations, each named once and each with a tracked
   formation to stand for it; a tolerance only with its written reason and never above sim-test.js's 2 km cap; no other field. An event may
   name no formation only where EV_NO_FORMS says why. */
{ const EV_FIELDS=["id","t","n","side","kind","p","forms","cf","claim","why","dispute","tolKm","tolWhy"], EV_TOL_CAP=2.0;
  const EV_NO_FORMS={ end:"'Organised resistance ends' is army-wide: its own text (analysis.js) speaks of Bagration, the Guard and the Allied "+
    "left together, not of one formation; sim-test.js reports it as naming no plotted formation (not tested)." };
  const km=/var KIND=\{decision:[^}]*\}/.exec(fs.readFileSync('app.js','utf8'));
  let KIND=null; if(km){ try{ KIND=eval("("+km[0].replace(/^var KIND=/,"")+")"); }catch(x){ KIND=null; } }
  if(!KIND||typeof KIND!=="object") errs.push("events: the dossier's KIND table (app.js, dossierEvent) cannot be read, so no event's kind can be checked");
  const T0=PHASES[0].t0, T1=PHASES[PHASES.length-1].t1, num=x=>typeof x==="number"&&isFinite(x), str=x=>typeof x==="string"&&x.trim()!=="";
  const evIds=new Set(); let evN=0;
  EVENTS.forEach((e,i)=>{ evN++; const w="event "+(e&&e.id?e.id:"#"+i)+": ", bad=m=>errs.push(w+m);
    if(!e||typeof e!=="object") return bad("not an object");
    Object.keys(e).forEach(k=>{ if(!EV_FIELDS.includes(k)) bad("unknown field "+k); });
    if(!str(e.id)||!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.id)) bad("id is not a kebab-case name");
    else if(evIds.has(e.id)) bad("id used twice"); else evIds.add(e.id);
    const tw=Array.isArray(e.t)?e.t:[e.t,e.t];
    if(Array.isArray(e.t)&&!(e.t.length===2&&num(e.t[0])&&num(e.t[1])&&e.t[0]<e.t[1])) bad("window "+JSON.stringify(e.t)+" is not [t0,t1] with t0<t1");
    else if(!num(tw[0])||!num(tw[1])) bad("no clock");
    else if(tw[0]<T0||tw[1]>T1) bad("clock "+JSON.stringify(e.t)+" outside the day ("+T0+"-"+T1+")");
    if(!Array.isArray(e.p)||e.p.length!==2||!num(e.p[0])||!num(e.p[1])) bad("no point");
    else if(e.p[0]<0||e.p[0]>680||e.p[1]<0||e.p[1]>500) bad("point off map "+e.p);
    if(!["fr","al"].includes(e.side)) bad("bad side "+e.side);
    if(KIND&&!Object.prototype.hasOwnProperty.call(KIND,e.kind)) bad("kind "+e.kind+" is not one the dossier names ("+Object.keys(KIND).join(", ")+")");
    if(typeof e.cf!=="string"||e.cf.length!==1||!"ABC".includes(e.cf)) bad("timing grade "+e.cf+" is not A, B or C");
    if(!Object.prototype.hasOwnProperty.call(CLAIM,e.claim)) bad("unknown claim class "+e.claim);
    /* roadmap step 2 (decision 125 (a)): a disputed claim carries its dispute, naming both hours (checked: two distinct clock times;
       who gives each is the text's, not checked); a dispute stands only on a disputed claim */
    if(e.claim==="disputed"){ const hrs=new Set(String(e.dispute||"").match(/\b\d\d:\d\d\b/g)||[]);
      if(!str(e.dispute)) bad("claim disputed without its dispute (decision 125)");
      else if(hrs.size<2) bad("its dispute names "+hrs.size+" clock time(s), not both hours (decision 125)");
      if(e.cf==="A") bad("a disputed hour graded A (Timing A is dated in a cited source, TIMING_TEXT; question 143)"); }
    else if(e.dispute!==undefined) bad("a dispute on a claim that is not disputed");
    if(!str(e.n)) bad("no title"); if(!str(e.why)) bad("no reason (why)");
    if(!Array.isArray(e.forms)) bad("forms is not a list");
    else {
      if(!e.forms.length&&!EV_NO_FORMS[e.id]) bad("names no formation, and EV_NO_FORMS does not say why");
      e.forms.forEach((f,j)=>{
        if(e.forms.indexOf(f)!==j) bad("names "+f+" twice");
        if(!FORMATIONS[f]) bad("names "+f+", which is not a formation");
        else if(!leavesOf(f,[]).length) bad("names "+f+", which has no tracked formation to stand for it");
      });
    }
    if(e.tolKm!==undefined){ if(!num(e.tolKm)||!(e.tolKm>0)) bad("tolKm "+e.tolKm+" is not a positive number");
      else if(e.tolKm>EV_TOL_CAP) bad("tolKm "+e.tolKm+" exceeds the "+EV_TOL_CAP+" km cap");
      if(!str(e.tolWhy)) bad("tolKm without a written reason (tolWhy)"); }
    else if(e.tolWhy!==undefined) bad("tolWhy without a tolKm");
  });
  Object.keys(EV_NO_FORMS).forEach(id=>{ const e=EVENTS.find(x=>x&&x.id===id);
    if(!e||!Array.isArray(e.forms)||e.forms.length) errs.push("events: EV_NO_FORMS names "+id+", which is no longer an event naming no formation (remove the entry)"); });
  console.log("events validated: "+evN+" ("+Object.keys(EV_NO_FORMS).length+" naming no formation, acknowledged: "+Object.keys(EV_NO_FORMS).join(", ")+")"); }
console.log("\nphases:",PHASES.length,"| chapters:",ANALYSIS.length,
  "| command entries:",Object.keys(COMMAND.fr).length+Object.keys(COMMAND.al).length);
/* ---- Stage 6B: the historical appearance (appearance.js; docs/STAGE6_SPEC.md §6.1, decisions 99-101, 103, 105, 106, 109) ----
   Every leaf formation resolves to dress classes whose shares sum to 1 in each mount group; every value names a source, a
   locator, a grade, a label and a verbatim quote, or is a disputed value keeping each side, or says it is generic (or, for
   colours, that none is shown); grade A only with a source dated 1804-1805 or a regulation shown in force on the day; every
   colours entry has a model, a count rule and a cloth (or says it is generic or not shown); the open questions of
   SOURCE_NOTE stay while the table does not settle them (decision 105). */
{ let ap=0, apBad=0; const bad=m=>{ errs.push("appearance: "+m); apBad++; };
  const LABELS=["fact","disputed","derived","inference","uncertain"], KINDS=["regulation","primary-text","primary-image","object","specialist","modern-web-specialist"];
  const srcOk=k=>!!APPEARANCE_SOURCES[k], used=new Set();
  Object.entries(APPEARANCE_SOURCES).forEach(([k,S])=>{ ap++;
    if(!S.au||!S.ti||!S.pub||!(S.d>1700&&S.d<2100)||!KINDS.includes(S.kind)||!S.url) bad("source "+k+" lacks author, title, publisher, year, kind or url"); });
  const year=d=>{ const m=/^(\d{4})/.exec(String(d||"")); return m?+m[1]:null; };
  /* a claim; or a disputed value with its sides; or {gen:true, why}; or, where allowNone, {none:true, why} */
  function claim(where,c,cls,allowNone){ ap++;
    if(!c||typeof c!=="object") return bad(where+": missing");
    if(c.gen){ if(!c.why) bad(where+": generic without a reason"); return; }
    if(c.none){ if(!allowNone) bad(where+": 'none' is allowed only for colours"); else if(!c.why) bad(where+": none without a reason"); return; }
    if(!c.v||!c.gr||!c.lab) return bad(where+": lacks v, gr or lab");
    if(!"ABC".includes(c.gr)||c.gr.length!==1) bad(where+": grade "+c.gr);
    if(!LABELS.includes(c.lab)) bad(where+": label "+c.lab);
    if(cls==="colour"&&!APPEARANCE_VOCAB.colour.includes(c.c)) bad(where+": colour class "+c.c+" not in the vocabulary");
    if(cls==="head"&&!APPEARANCE_VOCAB.head.includes(c.h)) bad(where+": headgear class "+c.h+" not in the vocabulary");
    if(c.lab==="disputed"){
      if(c.gr!=="C") bad(where+": a disputed value graded "+c.gr+" (disputed is grade C)");
      if(!Array.isArray(c.sides)||c.sides.length<2) return bad(where+": disputed without two sides");
      if(cls==="colour"&&c.c!=="generic"||cls==="head"&&c.h!=="generic") bad(where+": a disputed value must be drawn generic (decision 103)");
      c.sides.forEach((x,i)=>claim(where+" side "+i,x)); return; }
    if(!c.src||!c.at||!c.q) return bad(where+": lacks src, at or q");
    if(!srcOk(c.src)) bad(where+": unknown source "+c.src); else used.add(c.src);
    if(c.gr==="A"){ const S=APPEARANCE_SOURCES[c.src]||{}, dy=year(c.dated);
      const dated=(S.d>=1804&&S.d<=1805)||(dy>=1804&&dy<=1805), reg=S.kind==="regulation"&&c.inForce&&srcOk(c.inForce.src)&&c.inForce.at&&c.inForce.q;
      if(!dated&&!reg) bad(where+": grade A without a source dated 1804-1805 or a regulation shown in force ("+c.src+", "+(c.dated||S.d)+")"); }
    if(c.inForce){ if(!(srcOk(c.inForce.src)&&c.inForce.at&&c.inForce.q)) bad(where+": inForce lacks a source, locator or quote"); else used.add(c.inForce.src); } }
  Object.entries(DRESS).forEach(([k,d])=>{ ap++;
    if(!NATION[d.nation]) bad("dress "+k+": nation "+d.nation);
    if(!d.name) bad("dress "+k+": no name");
    if(!["foot","horse"].includes(d.mount)) bad("dress "+k+": mount "+d.mount);
    if(!COLOURS_CARRIED[d.carry]) bad("dress "+k+": colours entry "+d.carry+" missing");
    claim("dress "+k+".coat",d.coat,"colour"); claim("dress "+k+".legwear",d.legwear,"colour"); claim("dress "+k+".head",d.head,"head");
    claim("dress "+k+".greatcoat",d.greatcoat);
    if(d.greatcoat&&!d.greatcoat.gen&&![true,false,null].includes(d.greatcoat.worn)) bad("dress "+k+".greatcoat: worn must be true, false or null (decision 101)");
    if(d.cuirass){ claim("dress "+k+".cuirass",d.cuirass); if(![true,false,null].includes(d.cuirass.has)) bad("dress "+k+".cuirass: has must be true, false or null"); }
    ["facings","furniture"].forEach(a=>{ if(d[a]) claim("dress "+k+"."+a,d[a]); });
    if(d.horse) claim("dress "+k+".horse",d.horse,"colour"); });
  const leaves=Object.keys(FORMATIONS).filter(id=>FORMATIONS[id].track), usedDress=new Set();
  leaves.forEach(id=>{ ap++; const F=FORMATIONS[id], C=COMPOSITION[id];
    if(!C){ bad(id+": no composition"); return; }
    const r=appearanceOf(id);
    if(!r.parts.length) return bad(id+": no parts");
    const groups={}; r.parts.forEach(p=>{ (groups[p.mount]=groups[p.mount]||[]).push(p); });
    Object.entries(groups).forEach(([g,ps])=>{ const sum=ps.reduce((t,p)=>t+p.share,0), units=new Set(ps.map(p=>p.unit));
      if(Math.abs(sum-1)>1e-9) bad(id+": the "+g+" shares sum to "+sum);
      if(units.size>1) bad(id+": the "+g+" parts mix units ("+[...units].join(", ")+")"); });
    if(C.dominant&&(!C.basis||C.parts.length!==1)) bad(id+": a dominant class needs its basis and one part");
    /* roadmap step 2 (docs/FINAL_AUDIT.md H-11, H-19): the note is shown in the dossier's Dress; it names no file, field or formation id */
    if(C.note&&[/\bdata\.js\b/,/\bthe data(?:'s)?\b/i,/not changed here/,new RegExp("\\((?:"+Object.keys(FORMATIONS).join("|")+")(?:\\.\\w+)?\\)")].some(re=>re.test(C.note)))
      bad(id+": its note, shown in the dossier's Dress, names the project's files, fields or ids: "+C.note);
    const kind=p=>{ const d=DRESS[p.dress]; return d?d.nation:null; };
    const mixOk=n=>n===F.nation||F.arm==="mixed"||(F.mix&&F.mix.nation===n);
    C.parts.forEach((p,i)=>{ const d=DRESS[p.dress];
      if(!d) return bad(id+" part "+i+": unknown dress "+p.dress);
      usedDress.add(p.dress);
      if(!(p.n>0)) bad(id+" part "+i+": n "+p.n);
      if(!["bn","sqn","regt","coy","men","staff","dominant"].includes(p.unit)) bad(id+" part "+i+": unit "+p.unit);
      if(!mixOk(kind(p))) bad(id+" part "+i+": "+p.dress+" is "+kind(p)+", the formation "+F.nation+" and not mixed");
      if(!C.dominant) claim(id+" part "+i,p); });
    (C.others||[]).forEach((p,i)=>{ if(!DRESS[p.dress]) bad(id+" other "+i+": unknown dress "+p.dress); else usedDress.add(p.dress); claim(id+" other "+i,p); });
    /* the regiments' men, where every part gives them in men, against the data's strength (its range if it has one, else 30%) */
    if(C.parts.every(p=>p.unit==="men")&&F.strength){ const men=C.parts.reduce((t,p)=>t+p.n,0), R=F.strengthRange;
      if(R?(men<R[0]*0.7||men>R[1]*1.3):Math.abs(men-F.strength)/F.strength>0.30) warn.push(id+": composition "+men+" men against the data's "+F.strength); } });
  Object.keys(COMPOSITION).forEach(id=>{ if(!FORMATIONS[id]||!FORMATIONS[id].track) bad("composition for "+id+", not a leaf formation"); });
  Object.keys(DRESS).forEach(k=>{ if(!usedDress.has(k)) warn.push("appearance: dress "+k+" is used by no composition"); });
  Object.entries(COLOURS_CARRIED).forEach(([k,c])=>{ ap++;
    ["model","count","cloth"].forEach(a=>claim("colours "+k+"."+a,c[a],null,true));
    const plain=x=>x&&!x.gen&&!x.none&&x.lab!=="disputed";
    if(plain(c.count)&&!(c.count.n>=0&&c.count.per)) bad("colours "+k+".count: no number per unit");
    if(plain(c.cloth)&&!(c.cloth.w>0&&c.cloth.h>0&&c.cloth.unit)) bad("colours "+k+".cloth: no dimensions");
    ["staff","finial","pattern"].forEach(a=>{ if(c[a]!==undefined) claim("colours "+k+"."+a,c[a],null,true); });
    if(plain(c.staff)&&!(c.staff.m>0)) bad("colours "+k+".staff: no metres"); });
  ["fr","ru","at"].forEach(n=>{ ap++; const M=STANDARD_MEASURES[n];
    if(!M){ bad("standard measures: "+n+" missing"); return; }
    if(M.provisional){ if(!M.why) bad("standard measures "+n+": provisional without a reason"); return; }
    claim("standard measures "+n+".staff",M.staff); claim("standard measures "+n+".stature",M.stature);
    if(!(M.staff&&M.staff.m>0&&M.stature&&M.stature.m>0)) bad("standard measures "+n+": no metres"); });
  /* a source a note names counts as cited; a token in a note that looks like a source key must be one */
  const notes=[]; (function walk(o){ if(!o||typeof o!=="object") return; for(const [k,v] of Object.entries(o)){
    if(typeof v==="string"&&["note","why","basis"].includes(k)) notes.push(v); else if(typeof v==="object") walk(v); } })([DRESS,COMPOSITION,COLOURS_CARRIED,STANDARD_MEASURES]);
  notes.forEach(t=>(t.match(/\b[a-z][a-z0-9_]*\d{4}[a-z]{0,3}\b/g)||[]).forEach(k=>{ if(srcOk(k)) used.add(k); else bad("a note names an unknown source '"+k+"'"); }));
  /* T-3: an error, not a warning (CLAUDE.md, 6B: "every source cited and registered") */
  Object.keys(APPEARANCE_SOURCES).forEach(k=>{ if(!used.has(k)&&!notes.some(t=>t.indexOf(k)>=0)) bad("source "+k+" is cited nowhere (every source cited and registered, 6B)"); else used.add(k); });
  /* decision 105: an open question of SOURCE_NOTE stays open until the table settles it at grade A or B, undisputed */
  const note=SOURCE_NOTE.body.join(" "), settled=c=>c&&!c.gen&&!c.none&&"AB".includes(c.gr)&&c.lab==="fact";
  const grenz=Object.values(DRESS).filter(d=>d.grenz).map(d=>d.coat), ruInf=COLOURS_CARRIED.ru_inf;
  if(!grenz.length) bad("no Grenz dress class (kienmayer's Grenz)");
  if(!grenz.every(settled)&&!/whether Grenz infantry wore brown in 1805/.test(note)) bad("the Grenz coat is not settled but SOURCE_NOTE no longer asks");
  if(!(ruInf&&settled(ruInf.pattern))&&!/the pattern of Russian infantry flags/.test(note)) bad("the Russian infantry colours are not settled but SOURCE_NOTE no longer asks");
  console.log("appearance checks: "+(ap-apBad)+"/"+ap+" pass ("+Object.keys(DRESS).length+" dress classes, "+Object.keys(APPEARANCE_SOURCES).length+" sources, "+
    leaves.length+" leaf formations, "+Object.keys(COLOURS_CARRIED).length+" colours entries)"); }

/* roadmap step 2 (docs/FINAL_AUDIT.md D-5): the guard's reach. Every top-level declaration of the four data files, and five data declarations
   in app.js (the sun's date, place and clock basis; which places a dossier quotes as surveyed; the timing and position grades a visitor is
   told), are in check:data's lists (tools/visual/data-invariance.js DATA, read from that file as tools/lang-scan.js reads it), so a new
   declaration cannot sit outside the guard unseen */
{ const acorn=require('acorn'), di=fs.readFileSync('tools/visual/data-invariance.js','utf8'), dm=di.match(/const DATA=(\{[\s\S]*?\n\});/);
  const G=new Set(dm?[].concat(...Object.values(Function("return ("+dm[1]+")")())):[]);
  if(!dm) errs.push("guard: DATA not found in tools/visual/data-invariance.js");
  let n=0, out=0;
  const keyOf=s=>s.type==="FunctionDeclaration"?s.id.name:(s.type==="VariableDeclaration"?s.declarations.map(d=>d.id.name).join(","):null);
  ["geo.js","data.js","analysis.js","appearance.js"].forEach(f=>acorn.parse(fs.readFileSync(f,'utf8'),{ecmaVersion:2020}).body.forEach(s=>{
    const k=keyOf(s); if(k===null) return; n++;
    if(!G.has(k)){ out++; errs.push("guard: "+f+"'s "+k+" is not in check:data's lists (tools/visual/data-invariance.js)"); } }));
  const APP_DATA=["SUN_DAY","FEATURE_GT","TIMING_TEXT","CONF_TEXT","CONF_INTERP"];
  /* each is app.js's own top-level declaration under that name alone, the key check:data compares it by (else it reports "not found") */
  const appKeys=new Set(acorn.parse(fs.readFileSync('app.js','utf8'),{ecmaVersion:2020}).body.map(keyOf).filter(k=>k!==null));
  APP_DATA.forEach(k=>{ if(!G.has(k)){ out++; errs.push("guard: app.js's "+k+" is not in check:data's lists (D-5)"); }
    if(!appKeys.has(k)) errs.push("guard: app.js declares no top-level "+k+" of its own (D-5)"); });
  console.log("guard: the "+n+" declarations of the four data files and app.js's "+APP_DATA.length+" data declarations "+
    (out?"are not all in check:data's lists ("+out+" outside)":"are in check:data's lists")+" ("+G.size+" names)"); }
/* T-3 (docs/FINAL_AUDIT.md): a warning fails unless it is acknowledged here by its exact text, with the reason it stands and where that is
   recorded ({w, why, see}); an acknowledged warning that is no longer raised fails too, until its entry is removed. None today. */
const KNOWN_WARN=[];
{ const uw=[...new Set(warn)];
  uw.filter(w=>!KNOWN_WARN.some(k=>k.w===w)).forEach(w=>errs.push("warning not acknowledged in KNOWN_WARN: "+w));
  KNOWN_WARN.filter(k=>!uw.includes(k.w)).forEach(k=>errs.push("acknowledged warning no longer raised (remove it from KNOWN_WARN): "+k.w));
  KNOWN_WARN.forEach(k=>{ if(!k.why||!k.see) errs.push("KNOWN_WARN entry without its reason or its record: "+k.w); }); }

console.log("\nERRORS:",errs.length); errs.forEach(e=>console.log("  ! "+e));
console.log("warnings:",warn.length,"("+KNOWN_WARN.length+" acknowledged)");
warn.forEach(e=>{ const k=KNOWN_WARN.find(x=>x.w===e); console.log("  ~ "+e+(k?"  [acknowledged: "+k.why+"]":"")); });

/* --- order of battle: figures that were corrected against the published returns.
   Pinned so a failed patch can never silently revert them again. --- */
/* corrected in the 2026-09 geographic and historical pass (Duffy 1977; Smith 1998 unless noted) */
const OOB=[
 ["kienmayer","arm","mixed"],["kienmayer","strength",6800],["kienmayer","guns",12],
 ["c_iii","strength",4300],["c_iii","guns",12],["friant","strength",3470],["bourcier","strength",830],
 ["dok","strength",13490],["dok","guns",64],["bag","guns",42],
 ["lich","strength",5400],["lich","guns",24],["lich","nation","ru"],
 ["constantine","strength",10500],["constantine","guns",40],
 ["rg_inf","strength",6730],["rg_cav","strength",3700],
 ["c_gren","guns",undefined],["c_cav","guns",36],["gqg","guns",undefined],
 ["col4","strength",13900],["milo","strength",4800],["kamensky","strength",4250],["nansouty","strength",1600],
 ["santon","arm","inf"],["santon","battery",18],["santon","parent","suchet"],["buxhowden","arm","hq"]
];

let oobBad=0, oobBadPin=0;
OOB.forEach(([id,k,v])=>{
  if(!FORMATIONS[id]){ console.log("  ! unknown formation "+id); oobBad++; return; }
  if(FORMATIONS[id][k]!==v){
    console.log("  ! "+id+"."+k+" is "+FORMATIONS[id][k]+", expected "+v); oobBad++;
  }
});
const PIN=[ [()=>FORMATIONS.gqg.army&&FORMATIONS.gqg.army.guns===139, "the 139 guns are the army total, on gqg.army"],
  [()=>JSON.stringify(FORMATIONS.col4.strengthRange)==="[12000,23900]", "4th Column range 12,000-23,900"],
  [()=>JSON.stringify(FORMATIONS.milo.strengthRange)==="[4800,7000]", "Miloradovich range 4,800-7,000"],
  [()=>/^FZM /.test(FORMATIONS.kollo.commander)&&/^FZM /.test(FORMATIONS.col4.commander), "Kollowrat is FZM (Deutsche Biographie)"],
  [()=>/Kologrivov/.test(FORMATIONS.rg_cav.commander), "Kologrivov commands the Guard cavalry"],
  [()=>/Claparède/.test(FORMATIONS.santon.commander), "Claparède commands on the Santon"],
  [()=>/Féry/.test(FORMATIONS.legrand.staff)&&/Schobert/.test(FORMATIONS.legrand.staff)&&!/Fereys/.test(FORMATIONS.legrand.staff), "Legrand: Merle, Féry, Levasseur; Schobert's 3e in Telnitz"],
  [()=>FORMATIONS.lich.mix&&FORMATIONS.lich.mix.nation==="at", "5th Column mixed"] ];
PIN.forEach(([f,msg])=>{ if(!f()){ console.log("  ! "+msg); oobBadPin++; } });
if(!/Beaumont/.test(JSON.stringify(FORMATIONS.c_cav||{}))){
  console.log("  ! the note on Beaumont's dragoons is missing from the cavalry reserve"); oobBad++;
}
["kienmayer","c_iii","dok","lich","constantine"].forEach(id=>{
  if(!FORMATIONS[id].strengthNote) { console.log("  ! "+id+" has no note on its figures"); oobBad++; }
});
console.log("order of battle checks:",(OOB.length+6+PIN.length-oobBad-oobBadPin)+"/"+(OOB.length+6+PIN.length)+" pass");
if(oobBad||oobBadPin||errs.length) process.exitCode=1;
