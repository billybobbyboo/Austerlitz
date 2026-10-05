global.GEOREF=require('./geo.js');   /* the single geographic reference */
const fs=require('fs');
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
  if(f.strength && Math.abs(f.strength-sum)/f.strength>0.30) warn.push(id+": declared "+f.strength+" vs children "+sum);
});

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
      if(it[1]!=="doc"&&it[1]!=="inf") errs.push("COMMAND."+sd+" ph"+ph+": source must be doc or inf");
    });
  });
  Object.keys(KNOW_OVERRIDE[sd]).forEach(id=>{
    if(!FORMATIONS[id]) errs.push("KNOW_OVERRIDE."+sd+": unknown formation "+id);
    KNOW_OVERRIDE[sd][id].forEach(o=>{
      if(["seen","uncertain","unknown"].indexOf(o[1])<0) errs.push("KNOW_OVERRIDE."+sd+"."+id+": bad state");
    });
  });
});
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
  Object.keys(APPEARANCE_SOURCES).forEach(k=>{ if(!used.has(k)&&!notes.some(t=>t.indexOf(k)>=0)) warn.push("appearance: source "+k+" is cited nowhere"); else used.add(k); });
  /* decision 105: an open question of SOURCE_NOTE stays open until the table settles it at grade A or B, undisputed */
  const note=SOURCE_NOTE.body.join(" "), settled=c=>c&&!c.gen&&!c.none&&"AB".includes(c.gr)&&c.lab==="fact";
  const grenz=Object.values(DRESS).filter(d=>d.grenz).map(d=>d.coat), ruInf=COLOURS_CARRIED.ru_inf;
  if(!grenz.length) bad("no Grenz dress class (kienmayer's Grenz)");
  if(!grenz.every(settled)&&!/whether Grenz infantry wore brown in 1805/.test(note)) bad("the Grenz coat is not settled but SOURCE_NOTE no longer asks");
  if(!(ruInf&&settled(ruInf.pattern))&&!/the pattern of Russian infantry flags/.test(note)) bad("the Russian infantry colours are not settled but SOURCE_NOTE no longer asks");
  console.log("appearance checks: "+(ap-apBad)+"/"+ap+" pass ("+Object.keys(DRESS).length+" dress classes, "+Object.keys(APPEARANCE_SOURCES).length+" sources, "+
    leaves.length+" leaf formations, "+Object.keys(COLOURS_CARRIED).length+" colours entries)"); }

console.log("\nERRORS:",errs.length); errs.forEach(e=>console.log("  ! "+e));
console.log("warnings:",warn.length); warn.forEach(e=>console.log("  ~ "+e));

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
 ["santon","arm","inf"],["santon","battery",18],["buxhowden","arm","hq"]
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
