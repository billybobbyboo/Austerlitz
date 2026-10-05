/* RED TEAM — actively try to break the reconstruction.
   Not a confirmation of the existing suites; a hunt for errors they miss. */
const fs=require('fs');
const M=require('./_world_mod.js');
global.W=M.W; global.height=M.height; global.hAt=M.hAt; global.smoothstep=M.smoothstep;
global.covAt=M.covAt; global.SATS=M.SATS; global.MENI=M.MENI; global.VILLAGES=M.VILLAGES;
M.buildCover(); M.buildGrid();
Object.defineProperty(global,'covWater',{get:()=>M.covWater});
Object.defineProperty(global,'covRoad',{get:()=>M.covRoad});
Object.defineProperty(global,'covMarsh',{get:()=>M.covMarsh});
eval(fs.readFileSync('data.js','utf8'));
eval(fs.readFileSync('analysis.js','utf8'));
global.leavesOf=function(id,out){out=out||[];const f=FORMATIONS[id];if(f.track)out.push(id);
  if(f.children)f.children.forEach(k=>leavesOf(k,out));return out;};
eval(fs.readFileSync('_clock.js','utf8'));
global.units={}; Object.keys(FORMATIONS).forEach(id=>{ if(FORMATIONS[id].track) units[id]={}; });
global.clock=T_MIN;

const F=[], W_=[];   /* findings, warnings */
const fail=(cat,msg)=>F.push(cat+": "+msg);
const warn=(cat,msg)=>W_.push(cat+": "+msg);

/* ---------- 1. TEMPORAL ---------- */
Object.keys(units).forEach(id=>{
  const A=anchorList(id);
  if(!A.length){ fail("temporal",`${id} has a track but no anchors`); return; }
  const first=PHASES[A[0].ph].t0;
  for(let t=T_MIN;t<first;t+=5){
    if(!notYetAt(id,t)&&posAtClock(id,t)) { fail("temporal",`${id} visible at ${fmtClock(t)}, before its first anchor`); break; }
  }
  const nullAnchor=A.find(a=>a.p===null);
  if(nullAnchor){
    const gone=PHASES[nullAnchor.ph].t0;
    for(let t=gone;t<=T_MAX;t+=5){
      if(!goneAt(id,t)){ fail("temporal",`${id} still present at ${fmtClock(t)} after being removed`); break; }
    }
  }
});
/* events must not precede what they depend on */
const PREREQ=[["soult","decision"],["pratzen-village","soult"],["face-about","soult"],
  ["kamensky","soult"],["pratzeberg","kamensky"],["guard-broken","guard-attack"],
  ["hq-forward","pratzeberg"],["wheel","pratzeberg"],["sokolnitz-falls","wheel"],
  ["augezd","wheel"],["ice","augezd"],["telnitz-retaken","davout"],["davout-resumes","buxhowden-blind"]];
const evT=id=>{const e=EVENTS.find(x=>x.id===id);if(!e)return null;const w=Array.isArray(e.t)?e.t:[e.t,e.t];return w;};
PREREQ.forEach(([after,before])=>{
  const a=evT(after), b=evT(before);
  if(!a||!b){ fail("temporal",`prerequisite pair ${after}/${before} references a missing event`); return; }
  if(a[0]<b[0]) fail("temporal",`"${after}" starts before its prerequisite "${before}"`);
});
/* every event's named formations must actually be on the field then */
EVENTS.forEach(e=>{
  const w=Array.isArray(e.t)?e.t:[e.t,e.t];
  clock=(w[0]+w[1])/2;
  e.forms.forEach(fid=>{
    if(!FORMATIONS[fid]) return;
    if(!FORMATIONS[fid].track) return;
    if(!posNow(fid)) fail("temporal",`event "${e.id}" names ${fid}, which is not on the field at ${fmtClock(clock)}`);
  });
});

/* ---------- 2. SPATIAL ---------- */
function wet(mp){
  const w=W(mp[0],mp[1]);
  const pS=1-smoothstep(0.55,1.08,Math.sqrt(((w[0]-SATS[0])/28)**2+((w[1]-SATS[1])/10.5)**2));
  const pM=1-smoothstep(0.55,1.08,Math.sqrt(((w[0]-MENI[0])/23)**2+((w[1]-MENI[1])/9)**2));
  return {pond:Math.max(pS,pM), marsh:covAt(covMarsh,w[0],w[1])};
}
Object.keys(units).forEach(id=>{
  const A=anchorList(id);
  A.forEach(a=>{
    if(!a.p) return;
    if(a.p[0]<0||a.p[0]>680||a.p[1]<0||a.p[1]>500) fail("spatial",`${id} anchor at phase ${a.ph} is off the map`);
    const w=wet(a.p);
    if(w.pond>0.55&&!a.ice) fail("spatial",`${id} halts in open water at phase ${a.ph}`);
    const nearVill=VILLAGES.some(v=>Math.hypot(a.p[0]-v[1],a.p[1]-v[2])<32);
    if(w.marsh>0.72&&!a.ice&&!nearVill)
      warn("spatial",`${id} halts in deep marsh away from a village at phase ${a.ph}`);
  });
});
/* nothing should sit on top of something else at rest */
for(const t of [T_MIN,480,660,870]){
  clock=t;
  const live=Object.keys(units).filter(id=>posNow(id));
  for(let i=0;i<live.length;i++) for(let j=i+1;j<live.length;j++){
    const a=posNow(live[i]), b=posNow(live[j]);
    if(Math.hypot(a[0]-b[0],a[1]-b[1])<3.0)
      warn("spatial",`${live[i]} and ${live[j]} occupy nearly the same ground at ${fmtClock(t)}`);
  }
}

/* ---------- 3. MOVEMENT: are the arms actually distinct? ---------- */
const byArm={};
Object.keys(units).forEach(id=>{
  const f=FORMATIONS[id], A=anchorList(id);
  for(let i=0;i<A.length-1;i++){
    if(!A[i].p||!A[i+1].p) continue;
    const pp=legPath(A[i],A[i+1]), w=legWindow(A[i],A[i+1]);
    const km=pp.len*KM_PER_MAP, min=w[1]-w[0];
    if(min<=0||km<0.05) continue;
    (byArm[f.arm]=byArm[f.arm]||[]).push(km/(min/60));
  }
});
const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
const infM=byArm.inf?mean(byArm.inf):0, cavM=byArm.cav?mean(byArm.cav):0, artM=byArm.art?mean(byArm.art):0;
if(cavM&&infM&&cavM<=infM) warn("movement",`cavalry mean rate ${cavM.toFixed(2)} is not above infantry ${infM.toFixed(2)}`);
const maxOf=a=>Math.max(...a);
if(byArm.art&&maxOf(byArm.art)>SPEED_CEIL.art)
  fail("movement",`artillery peaks at ${maxOf(byArm.art).toFixed(2)} km/h, above its ${SPEED_CEIL.art} ceiling`);
if(byArm.cav&&maxOf(byArm.cav)>SPEED_CEIL.cav)
  fail("movement",`cavalry peaks above its ceiling`);

/* ---------- 3b. EXPLICIT TIMES (owner decision 40): the movement audit must reject every invalid one ---------- */
{ const CASES=[
    ["arrival before departure",   {2:{p:[100,100],cf:"C"},4:{p:[110,100],tm:{dep:600,at:590,gr:"C",basis:"app narrative, unsourced",ev:["x"]}}}],
    ["departs before the previous anchor is reached", {2:{p:[100,100],cf:"C"},4:{p:[110,100],tm:{at:640,gr:"C",basis:"app narrative, unsourced",ev:["x"]}},5:{p:[120,100],tm:{dep:620,gr:"C",basis:"app narrative, unsourced",ev:["x"]}}}],
    ["arrives after the next leg departs", {2:{p:[100,100],cf:"C"},4:{p:[110,100],tm:{at:700,gr:"C",basis:"app narrative, unsourced",ev:["x"]}},5:{p:[120,100]}}],
    ["outside the day",            {2:{p:[100,100],cf:"C"},9:{p:[110,100],tm:{at:1200,gr:"C",basis:"app narrative, unsourced",ev:["x"]}}}],
    ["a first entry with a time",  {2:{p:[100,100],cf:"C",tm:{at:500,gr:"C",basis:"app narrative, unsourced",ev:["x"]}},4:{p:[110,100]}}]];
  let caught=0;
  CASES.forEach(([what,track])=>{
    FORMATIONS.__probe={ech:"div",nation:"fr",arm:"inf",name:"probe",commander:"probe",track:track};
    const hits=auditMovement().filter(p=>p.id==="__probe"&&/^timing/.test(p.why));
    delete FORMATIONS.__probe;
    if(hits.length) caught++; else fail("timing",`the movement audit accepts an invalid explicit time: ${what}`);
  });
  /* and a valid delayed move is accepted, and moves inside its phase */
  FORMATIONS.__probe={ech:"div",nation:"fr",arm:"inf",name:"probe",commander:"probe",
    track:{2:{p:[100,100],cf:"C"},4:{p:[110,100],tm:{dep:585,gr:"C",basis:"app narrative, unsourced",ev:["x"]}},5:{p:[112,100]}}};
  const okHits=auditMovement().filter(p=>p.id==="__probe"), A=anchorList("__probe");
  const moving=posAtClock("__probe",580)[0]===100 && posAtClock("__probe",600)[0]>100;
  delete FORMATIONS.__probe;
  if(okHits.length) fail("timing",`the movement audit rejects a valid delayed move: ${okHits.map(p=>p.why).join("; ")}`);
  if(!moving) fail("timing","a move dated to begin inside its phase does not hold until its departure");
  console.log("explicit-time rules: "+caught+" of "+CASES.length+" invalid timings rejected; a valid delayed move holds until "+fmtClock(A[1].w[0])+" and arrives "+fmtClock(A[1].w[1]));
}

/* ---------- 4. COMMAND ---------- */
Object.keys(FORMATIONS).forEach(id=>{
  const f=FORMATIONS[id];
  if(!f.commander) fail("command",`${id} has no commander`);
  if(f.parent){
    const p=FORMATIONS[f.parent];
    if(!p) fail("command",`${id} has a parent that does not exist`);
    else if(!(p.children||[]).includes(id))
      fail("command",`${id} claims ${f.parent} as parent, but ${f.parent} does not list it as a child`);
  }
  (f.children||[]).forEach(c=>{
    if(FORMATIONS[c].parent!==id)
      fail("command",`${id} lists ${c} as a child, but ${c}'s parent is ${FORMATIONS[c].parent}`);
  });
});
Object.keys(FORMATIONS).filter(id=>FORMATIONS[id].children).forEach(id=>{
  const f=FORMATIONS[id];
  if(!f.strength) return;
  /* a brigade detachment is counted inside its parent's strength, not added to it */
  if((f.children||[]).every(k=>FORMATIONS[k].ech==="bde")) return;
  const kids=(f.children||[]).map(k=>FORMATIONS[k].strength||0).reduce((a,b)=>a+b,0);
  if(kids&&Math.abs(f.strength-kids)/f.strength>0.25)
    warn("command",`${id} declares ${f.strength} but its children sum to ${kids}`);
});

/* ---------- 5. PLAN ---------- */
['al','fr'].forEach(sd=>PLANS[sd].cols.forEach(col=>{
  (col.forms||[]).forEach(fid=>{
    if(!FORMATIONS[fid]) { fail("plan",`${col.n} names a formation that does not exist`); return; }
    const A=anchorList(fid);
    if(A.length&&PHASES[A[0].ph].t0>PHASES[0].t0)
      warn("plan",`${col.n} names ${fid}, which is not on the field when the plan is made`);
  });
  let near=1e9,nm="";
  FEATURES.forEach(ft=>{const d=Math.hypot(ft.p[0]-col.obj[0],ft.p[1]-col.obj[1]);if(d<near){near=d;nm=ft.name;}});
  if(near*KM_PER_MAP>1.5) warn("plan",`${col.n} objective is ${(near*KM_PER_MAP).toFixed(1)} km from any named feature`);   /* true km, one scale */
}));

/* ---------- 6. LANGUAGE: overclaim scan ---------- */
const BANNED=/\b(certainly|undoubtedly|proves|proven|definitely|always|never doubted|obviously)\b/i;
const CAUSAL=/\b(caused|because of this|as a result of which|therefore proves)\b/i;
function scan(where,txt){
  if(!txt||typeof txt!=="string") return;
  if(BANNED.test(txt)) fail("language",`${where} asserts certainty: "${txt.match(BANNED)[0]}"`);
  if(CAUSAL.test(txt)) warn("language",`${where} uses strong causal language: "${txt.match(CAUSAL)[0]}"`);
}
EVENTS.forEach(e=>{scan("event "+e.id,e.n);scan("event "+e.id,e.why);});
PHASES.forEach(p=>{scan("phase "+p.id,p.lede);scan("phase "+p.id,p.title);});
ANALYSIS.forEach(c=>scan("chapter "+c.id,c.text));
TOUR.forEach((s,i)=>scan("tour "+i,s.x));
Object.keys(FORMATIONS).forEach(id=>{scan(id,FORMATIONS[id].role);scan(id,FORMATIONS[id].note);});
['al','fr'].forEach(sd=>{scan("plan "+sd,PLANS[sd].intent);scan("plan "+sd,PLANS[sd].cost);});

/* ---------- 6b. RETIRED CLAIMS: corrected in the 2026-09 pass, must never return ---------- */
{ const RETIRED=["cut in two along its own centre line","within the hour","Kursk regiment is destroyed","1,600 of 2,000",
    "chapel at Stare Vinohrady","Perhaps five thousand","Perhaps 5,000","fivefold","published order of battle","amber army",
    "12 km of open rolling crest","eastern shoulder of the plateau","Coming up the Vienna road","reaches Raigern after",
    "reduced to the ranks","vine-planted","FML Johann Kollowrat","FML Johann Karl","Fereys","Western face scarped",
    "western face was scarped","Corsican and Po tirailleurs in Telnitz","contemporaries reported he was drunk",
    "sixty per cent","falls by two-thirds","can see into the Goldbach valley","seeing into the Goldbach valley",
    "can see the whole Allied left","Not visible from the plateau","the fourth, the counter-march","Cut the Brunn road",
    "Emperor Francis I present","Chevalier Guard and Guard cavalry regiments","had stalled because Liechtenstein",
    "Vienna road at Raigern","both emperors in attendance","Guard infantry break two French battalions and carry off"];
  const src={}; ['data.js','appearance.js','analysis.js','world.js','app.js','shell.html'].forEach(f=>src[f]=fs.readFileSync(f,'utf8'));   /* appearance.js since Stage 6B */
  let n=0; RETIRED.forEach(ph=>Object.keys(src).forEach(f=>{ if(src[f].indexOf(ph)>=0){ fail("retired",`${f} still says "${ph}"`); n++; } }));
  console.log("retired claims checked: "+RETIRED.length+" phrases across "+Object.keys(src).length+" sources, "+n+" found"); }

/* every reconstruction-graded track entry must carry a claim or confidence */
Object.keys(units).forEach(id=>{
  const tr=FORMATIONS[id].track;
  Object.keys(tr).forEach(k=>{
    const e=tr[k];
    if("p" in e && e.p && !e.cf && k!=="0"){
      /* confidence carries forward, so only the first anchor must declare one */
      const keys=Object.keys(tr).map(Number).sort((a,b)=>a-b);
      if(+k===keys[0]) fail("language",`${id} first anchor at phase ${k} declares no confidence`);
    }
  });
});

console.log("=== RED TEAM ===");
console.log("findings:",F.length);
[...new Set(F)].forEach(f=>console.log("  ✗ "+f));
console.log("warnings:",W_.length);
[...new Set(W_)].slice(0,14).forEach(w=>console.log("  ~ "+w));
console.log("\nmean march rates  infantry "+infM.toFixed(2)+"  cavalry "+cavM.toFixed(2)+"  artillery "+artM.toFixed(2)+" km/h");
process.exitCode=F.length?1:0;
