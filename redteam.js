/* RED TEAM — actively try to break the reconstruction.
   Not a confirmation of the existing suites; a hunt for errors they miss. */
const fs=require('fs'), path=require('path');
require('./tools/fresh.js').regen('world','helpers');   /* roadmap step 1 (docs/FINAL_AUDIT.md T-9): the generated modules read below are regenerated from the live sources first, also when this suite runs on its own */
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
/* every event's named formations must actually be on the field then. T-6 (docs/FINAL_AUDIT.md): an unknown id fails (it was skipped);
   an aggregate is on the field when one of its tracked formations is, and fails if it has none */
EVENTS.forEach(e=>{
  const w=Array.isArray(e.t)?e.t:[e.t,e.t];
  clock=(w[0]+w[1])/2;
  e.forms.forEach(fid=>{
    if(!FORMATIONS[fid]){ fail("temporal",`event "${e.id}" names ${fid}, which is not a formation`); return; }
    if(FORMATIONS[fid].track){
      if(!posNow(fid)) fail("temporal",`event "${e.id}" names ${fid}, which is not on the field at ${fmtClock(clock)}`);
      return; }
    const lv=leavesOf(fid,[]);
    if(!lv.length) fail("temporal",`event "${e.id}" names ${fid}, an aggregate with no tracked formation`);
    else if(!lv.some(id=>posNow(id))) fail("temporal",`event "${e.id}" names ${fid}, none of whose formations (${lv.join(", ")}) is on the field at ${fmtClock(clock)}`);
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

/* ---------- 6a. LANGUAGE, every visitor string (H-8, docs/FINAL_AUDIT.md; owner decision 131, roadmap step 1) ----------
   Section 6 above is kept as it was, so no allow-list can ever excuse a hit in the fields it reads. This section applies its BANNED
   and CAUSAL, and VERDICT below, to every string a visitor can be shown, collected by tools/lang-scan.js: every guarded declaration
   (tools/visual/data-invariance.js), the presentation code of every file build.py joins, tokens.js and shell.html. Not judged: strings
   in code positions, the self-test and console text (developer), and appearance.js's q and v inside a claim (the source's own words, as
   printed; a hit there is listed as a note, never a finding). Every occurrence is reported, not only the first. A hit is a finding (a
   causal one a warning, so KNOWN_WARN's rule below applies) unless a LANG_ALLOW entry names it: its place, its exact phrase, its kind,
   why it stands and the task that removes it. An entry that matches nothing is a finding, so the list can only shrink as those tasks
   land; each allowed hit is printed in every run, so none passes silently. Allow a causal hit here too (kind "causal"), not in
   KNOWN_WARN: its warning names a line, which moves. */
/* a verdict on the battle (H-4): a finding unless its own sentence carries a label (CLAUDE.md's words, or question 127's "this map
   reads ... as") or LANG_ALLOW names it. The label exempts a verdict only, never a certainty word. */
const VERDICT=/\b(decisive(?:ly)?|decid(?:e|es|ed|ing) (?:it\b(?! (?:was|is|would|could|should|had|has|must|might|best|better|wise|necessary|prudent|safer|time))|(?:the|this) (?:\w+ )?(?:battle|day|campaign|war|fight|action|outcome|issue))|turning[- ]point|won the (?:battle|day)|lost the (?:battle|day)|sealed (?:the|its|their) fate)\b/i;
const LABELLED=/\b(this map reads|reads (?:it |them )?as|interpretation|interpretive|inference|inferred|disputed|derived)\b/i;
const LANG_ALLOW=[
  /* guarded data that step 1 cannot change: roadmap step 2's data task (question 129) removes them */
  {where:"FEATURES[#satschan].story", phrase:"some men certainly died", kind:"certainty",
   until:"roadmap step 2, the data task (question 129: H-13)",
   why:"H-13, the debunking told as fact (data.js:714): the count drained from the meres is a lower bound; to be labelled as interpretation, "+
       "keeping the hedge"},
  {where:"FORMATIONS.c_iv.role", phrase:"The decisive centre assault", kind:"verdict",
   until:"roadmap step 2, the data task (question 129; H-4's roles, question 127)",
   why:"H-4: an interpretation shown under the dossier's 'record' tag (data.js:165)"},
  {where:"FORMATIONS.c_gd.role", phrase:"then decides it", kind:"verdict",
   until:"roadmap step 2, the data task (question 129; H-4's roles, question 127)",
   why:"H-4: an interpretation shown under the dossier's 'record' tag (data.js:383)"},
  {where:"FORMATIONS.c_cav.role", phrase:"decides the cavalry battle", kind:"verdict",
   until:"roadmap step 2, the data task (question 129; H-4's roles, question 127)",
   why:"the same class as H-4's roles (data.js:311), found by this scan and not named in the audit; an open point for the owner"},
  /* a claim about the app itself, false today (H-3): question 126 marks the plateau label "derived"; the entry may then stay only
     with the check that backs the claim named in its reason, else the data task rewords the sentence */
  {where:"SOURCE_NOTE.layers[2][1]", phrase:"always marked derived", kind:"certainty",
   until:"roadmap step 2, the presentation part (question 126: H-3)",
   why:"the plateau label carries no 'derived' mark, and from 12:45 none is on screen (H-3; data.js:769)"},
  /* the first claim (H-4): decision 108's words, written twice; question 127 (b) labels them and retitles the vantage */
  {where:"paintKey", phrase:"and it decides the battle", kind:"verdict",
   until:"roadmap step 2, the presentation part (question 127 (b))",
   why:"H-4: decision 108's words, an unlabelled interpretation and the first claim a visitor reads (the first-run key)"},
  {where:"shell.html p#fr-key text", phrase:"and it decides the battle", kind:"verdict",
   until:"roadmap step 2, the presentation part (question 127 (b))",
   why:"H-4: the same sentence in the #fr-key paragraph, shown before start-up repaints it; 127 must change both places"},
  {where:"shell.html button[data-v=plateau]@title", phrase:"The ground that decided the battle", kind:"verdict",
   until:"roadmap step 2, the presentation part (question 127 (b))",
   why:"H-4: the Pratzen vantage's title; 127 (b) retitles it 'The Pratzen plateau'"},
  /* permanent: attributed words, not the map's own verdict */
  {where:"PLANS.al.assumed[1]", phrase:"the decisive ground was the French right", kind:"verdict", until:null,
   why:"attributed: an assumption of the Allied plan, shown as one in the Plans tab; allowed by its exact phrase, not by exempting the field"}
];
{ const LS=require(path.join(__dirname,"tools","lang-scan.js"))(__dirname);
  if(LS.missing.length) fail("language",`the overclaim scan cannot find the guarded declarations ${LS.missing.join(", ")}`);
  const whereOf=r=>r.file==="shell.html"?"shell.html "+r.path:r.path;
  const used=LANG_ALLOW.map(()=>0), notes=[], allowed=[];
  let judged=0, prose=0; const notJudged={code:0,developer:0,verbatim:0};
  const all=(re,t)=>{ const g=new RegExp(re.source,"gi"), o=[]; let m; while((m=g.exec(t))) o.push(m); return o; };
  const sentence=(t,i)=>{ const a=t.lastIndexOf(". ",i), b=t.indexOf(". ",i); return t.slice(a<0?0:a+2,b<0?t.length:b+1); };
  LANG_ALLOW.forEach(a=>{ if(!a.where||!a.phrase||!/^(certainty|verdict|causal)$/.test(a.kind)||!a.why||a.until===undefined)
    fail("language",`LANG_ALLOW entry without its place, phrase, kind, reason or task: ${JSON.stringify(a)}`); });
  LS.records.forEach(r=>{
    if(r.skip){ notJudged[r.skip]++;
      if(r.skip==="verbatim") [BANNED,CAUSAL,VERDICT].forEach(re=>all(re,r.text).forEach(m=>notes.push(`${r.path}: "${m[0]}" (the source's own words, not judged)`)));
      return; }
    judged++; if(/\s/.test(r.text)&&r.text.length>=20) prose++;
    const hits=[];
    all(BANNED,r.text).forEach(m=>hits.push(["certainty",m]));
    all(VERDICT,r.text).forEach(m=>{ if(!LABELLED.test(sentence(r.text,m.index))) hits.push(["verdict",m]); });
    all(CAUSAL,r.text).forEach(m=>hits.push(["causal",m]));
    hits.forEach(([kind,m])=>{
      const w=whereOf(r);
      const k=LANG_ALLOW.findIndex(a=>a.kind===kind&&a.where===w&&(()=>{ const i=r.text.indexOf(a.phrase); return i>=0&&m.index>=i&&m.index<i+a.phrase.length; })());
      if(k>=0){ used[k]++; allowed.push(`${kind} "${m[0]}" at ${w}`+(LANG_ALLOW[k].until?` until ${LANG_ALLOW[k].until}`:" (attributed; permanent)")); return; }
      const at=`${w} (${r.file}:${r.line})`;
      if(kind==="certainty") fail("language",`${at} asserts certainty: "${m[0]}"`);
      else if(kind==="verdict") fail("language",`${at} gives an unlabelled verdict: "${m[0]}"`);
      else warn("language",`${at} uses strong causal language: "${m[0]}"`);
    });
  });
  LANG_ALLOW.forEach((a,k)=>{ if(!used[k]) fail("language",`LANG_ALLOW entry "${a.phrase}" at ${a.where} matches nothing: remove it (or update it with the text that replaced it)`); });
  /* canaries: the scan's reach cannot shrink unseen. The fields section 6 reads, every built file but the textures, the presentation's
     named sources and shell.html must each yield judged text. */
  const OLD=[/^EVENTS\[[^\]]+\]\.(n|why)$/,/^PHASES\[[^\]]+\]\.(lede|title)$/,/^ANALYSIS\[[^\]]+\]\.text$/,/^TOUR\[[^\]]+\]\.x$/,
    /^FORMATIONS\.\w+\.(role|note)$/,/^PLANS\.(al|fr)\.(intent|cost)$/];
  OLD.forEach(re=>{ if(!LS.records.some(r=>!r.skip&&re.test(r.path))) fail("language",`the overclaim scan no longer reads ${re}`); });
  const words=r=>!r.skip&&/[A-Za-z]{2,} [A-Za-z]{2,}/.test(r.text);
  LS.files.filter(f=>f!=="assets.js").forEach(f=>{ if(!LS.records.some(r=>r.file===f&&words(r))) fail("language",`the overclaim scan reads no visitor text in ${f}`); });
  ["LABELS","KEYS","EYES","TIMING_TEXT","CONF_TEXT","CONF_INTERP","paintKey","troopNotes","standardNotes","arrowNotes","lightNotes",
   "dossierFormation","dossierFeature","dossierEvent","dossierAnalysis","dressSection","compactCard","openSources","plateauText","shell.html"].forEach(d=>{
    if(!LS.records.some(r=>r.decl===d&&words(r))) fail("language",`the overclaim scan reads no visitor text in ${d}`); });
  console.log(`overclaim scan: ${judged} strings judged (${prose} prose); not judged: ${notJudged.verbatim} the sources' own words `+
    `(appearance.js q and v), ${notJudged.developer} developer, ${notJudged.code} in code positions`);
  console.log(`overclaim scan: read from ${LS.files.length} sources (build.py's list and shell.html): ${LS.files.join(", ")}`);
  console.log(`overclaim scan: ${allowed.length} allowed (LANG_ALLOW, ${LANG_ALLOW.length} entries), ${notes.length} notes`);
  allowed.forEach(a=>console.log("  ~ allowed: "+a));
  notes.forEach(n=>console.log("  ~ note: "+n));
}

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

/* D-2 (docs/FINAL_AUDIT.md; question 131): every tracked formation's first positioned anchor declares its grade. The grade carries
   forward, so the later anchors need none; where none has been declared stateAt (app.js) draws the formation at its default "B" without
   a word. The old rule here skipped an anchor at phase 0, the first anchor of 30 of the 32 tracked formations. */
Object.keys(units).forEach(id=>{
  const tr=FORMATIONS[id].track, keys=Object.keys(tr).map(Number).sort((a,b)=>a-b), k0=keys.find(k=>"p" in tr[k]&&tr[k].p);
  if(k0===undefined){ fail("grade",`${id} has no positioned anchor`); return; }
  if(!tr[k0].cf) fail("grade",`${id} first positioned anchor at phase ${k0} declares no grade (D-2: stateAt would draw it at its default B)`);
});

/* T-3 (docs/FINAL_AUDIT.md): a warning is a finding unless it is acknowledged here by its exact text, with the reason it stands and
   where that is recorded ({w, why, see}); an acknowledged warning that is no longer raised is a finding too, until its entry is removed.
   This block stays after every warn() and before the report. */
const KNOWN_WARN=[
  {w:"movement: cavalry mean rate 0.82 is not above infantry 1.26",
   why:"a model property kept on purpose since the chronology data task: the dated moves are shorter and faster, and the cavalry's slow "+
       "legs are the undated creeping moves of decision 45; a warning, not a finding, and not changed. The infantry mean was 1.23 until "+
       "roadmap step 2 dated drouet@3's departure at Soult's advance (08:45, H-2): its leg no longer creeps from 04:00, so it is faster",
   see:"docs/STAGE2_SPEC.md §M.12 (:1303) and §M.13 (:1407), on the creeping moves of §M.10; CHANGELOG.md, the chronology data task and the Stage 2C "+
       "precondition (the march rates), and roadmap step 2 (H-2, Drouet's departure)"}];
{ const uw=[...new Set(W_)];
  uw.filter(w=>!KNOWN_WARN.some(k=>k.w===w)).forEach(w=>fail("warning",`not acknowledged in KNOWN_WARN: ${w}`));
  KNOWN_WARN.filter(k=>!uw.includes(k.w)).forEach(k=>fail("warning",`acknowledged but no longer raised (remove it from KNOWN_WARN): ${k.w}`));
  KNOWN_WARN.forEach(k=>{ if(!k.why||!k.see) fail("warning",`KNOWN_WARN entry without its reason or its record: ${k.w}`); }); }

console.log("=== RED TEAM ===");
console.log("findings:",F.length);
[...new Set(F)].forEach(f=>console.log("  ✗ "+f));
console.log("warnings:",W_.length,"("+KNOWN_WARN.length+" acknowledged)");
[...new Set(W_)].forEach(w=>{ const k=KNOWN_WARN.find(x=>x.w===w); console.log("  ~ "+w+(k?"  [acknowledged: "+k.why+"]":"")); });
console.log("\nmean march rates  infantry "+infM.toFixed(2)+"  cavalry "+cavM.toFixed(2)+"  artillery "+artM.toFixed(2)+" km/h");
process.exitCode=F.length?1:0;
