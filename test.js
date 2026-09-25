global.GEOREF=require('./geo.js');   /* the single geographic reference */
const fs=require('fs');
function load(f){ eval(fs.readFileSync(f,'utf8')); return eval; }
eval(fs.readFileSync('data.js','utf8'));
eval(fs.readFileSync('world.js','utf8'));
eval(fs.readFileSync('_state.js','utf8'));
eval(fs.readFileSync('_ov.js','utf8'));
eval(fs.readFileSync('analysis.js','utf8'));
/* the plotted anchor a formation (or the first of its leaves) holds at a phase - the data, not the live clock */
function anchorPos(id,ph){ const f=FORMATIONS[id];
  if(f.track){ const s=stateAt(id,ph); return s&&s.p?s.p:null; }
  for(const k of leavesOf(id,[])){ const q=anchorPos(k,ph); if(q) return q; } return null; }

let errs=[], warn=[];
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
  if(c.t<PHASES[0].t0||c.t>PHASES[PHASES.length-1].t1) errs.push("chapter "+c.id+": time off the clock");
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
