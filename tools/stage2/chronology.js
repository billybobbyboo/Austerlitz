#!/usr/bin/env node
/* Stage 2 Part A, section M: the chronology audit. Reads the live data; changes nothing.
   node tools/stage2/chronology.js [--md out.md] [--json out.json] [--evidence] [--times] [--check]
   --times  every explicit anchor time (tm, owner decisions 40-41): window, grade, basis, and each evidence quote resolved
            to its current file:line;
   --check  the regression (npm run check:chronology; since roadmap step 1, finding D-1 of docs/FINAL_AUDIT.md). It reads the
            live text, not only the hand-typed table, and exits 1 on any of these:
     verdicts  a move with a timed statement early or late (REVIEW, judged against the live engine window), other than the
               unresolved conflicts named in CONFLICTS (decision 42), each of which must be an anchor;
     times     an explicit anchor time without evidence, grade or basis, or quoting text that is not in the sources (--times);
     L1  a timed string literal or comment of data.js or analysis.js that the extractor below does not read and that no class of
         EXCLUDED_PATHS covers (an acorn inventory, by path); a class that covers nothing; an inventory path whose literal is not
         the model's value there;
     L2  a timed statement (one statement and one of its times) that no REVIEW row cites (REVIEW_CITES) and ALLOW_TIMED does
         not name; an ALLOW_TIMED entry that a row also cites;
     L3  a cite or an ALLOW_TIMED entry that does not resolve to exactly one live statement still carrying that time: a retimed
         sentence, a moved or renamed source (a new path, phase or id), or a free-text ref reworded within the beginning its
         cite names, fails here until its row (or its entry) is reviewed; a reword that keeps the time and the cited beginning
         is not detected (the ledger is by ref and time, not by full text);
     L4  a REVIEW row with a kind whose text times (from, and to when set) are not times of the statements it cites; (L4b) a
         cite outside its row's text times;
     L5  a REVIEW or REVIEW_CITES key that is not a movement anchor, or a row of one table missing from the other;
     L6  a phase whose clock string is not its t0 - t1;
     (L7, the themes' and tour stops' moments and the one stop that keeps its own clock, is test.js's: not repeated here;)
     L8  a named conflict whose row does not cite SOURCE_NOTE's open question at its own time (the conflict stays disclosed);
     D1  a derived arrival other than at the tactical rate (a design value, unsourced), at the ceiling (flagged, and named in
         CEILING_FLAGGED) or at its own moveMin (named in MOVEMIN_DERIVED); a named leg whose arrival has another rule;
     F1  the dated legs forced to 80% of their ceiling or more by a following default not exactly FORCED_DATED;
     F2  a leg at 80% of its ceiling or more named in none of CEILING_FLAGGED, FORCED_DATED and NEAR_CEILING, or a
         NEAR_CEILING leg no longer there (80% is section M.13's line);
     M1  any finding of the movement audit (app.js auditMovement: a leg over its arm's ceiling, a crossing of open water or of
         the marshy bottom, an explicit time out of order or outside the day), run here on world.js's cover.

   The statements (the extractor; since step 1 one statement per string, each with a stable reference, "ref"):
     timeline <ph>: <text>       PHASES[].events, timed by the label (and by any time in the line's text)
     lede <ph> | phase <ph> title|label
     event <id> | event <id> n|why|dispute   EVENTS[]: t (the event's window), its name's, its reason's and its dispute's times (tolWhy
                                 excluded; dispute since roadmap step 2, decision 125 (a))
     formation <id> name|commander|staff|role|note|strengthNote|mixedNote
     anchor <id>@<ph> act|obj   the anchors' texts (tm, the engine's own timing input, is --times's and the movement audit's)
     chapter <id> text|n | tour <k> x|n | act <id> n|line
     feature <id> name|sub|story|why <i>|fact <label>
     command <sd>@<ph>: <text>   the Command tab's knowledge rows
     plan <path> | source-note <path>   every string of PLANS and SOURCE_NOTE
     comment data.js: <text>     comments in data.js
   Times in text: "08:45", "13:00-14:00", "after 11:00", "a quarter to nine", "seven o'clock", and since step 1 "noon" or
   "midday" (12:00). A chapter's or a stop's clock (its moment's, app.js momentOf) is kept as a weak statement for --evidence only.
   A cite is "<ref, or its beginning past the ': '> @HH:MM[-HH:MM][+]" ("+": "after"). REVIEW's evidence column (file:line
   when section M was written) is history; REVIEW_CITES is the live link.

   For every anchor (a track entry with a position) of every formation:
   - the engine's movement window: legWindow(previous anchor, anchor) (app.js), i.e. from the previous anchor's phase start
     (or moveMin before the anchor's phase start) to the anchor's phase start, PHASES[ph].t0, when the anchor is reached;
     since the chronology data task an anchor may carry its own time (tm.at, tm.dep), and legWindow returns the real window;
   - REVIEW below records, by hand, what the timed statements it cites date for this anchor's move (its kind and text
     times); the verdict is computed against the live window.
   Verdicts: consistent (the text's time falls in the engine's window, +-15 min); early (the engine arrives before the text
   says the movement or action happens; size = text time - arrival); late (the engine is still moving after the text says it
   arrived); undetermined (no timed statement about this action). Sizes in minutes. */
const {load}=require("./model.js"), fs=require("fs"), path=require("path"), acorn=require("acorn");
const MODEL_EXTRA=["wetAt","nearSettlement","crossingProblem","auditMovement","fmtClock","momentOf","evWindow","SPEED_CEIL"];
const X=load(MODEL_EXTRA), F=X.FORMATIONS, P=X.PHASES;
const ROOT=path.resolve(__dirname,"..","..");
const SRC={}; ["data.js","analysis.js","app.js"].forEach(f=>SRC[f]=fs.readFileSync(path.join(ROOT,f),"utf8").split("\n"));
function lineOf(text,files){ const raw=String(text).slice(0,60), esc=JSON.stringify(String(text)).slice(1,61);
  for(const f of files||["data.js","analysis.js"]){ const i=SRC[f].findIndex(l=>l.includes(raw)||l.includes(esc)); if(i>=0) return f+":"+(i+1); } return "?"; }
const hm=t=>{ const h=Math.floor(t/60), m=Math.round(t%60); return (h<10?"0":"")+h+":"+(m<10?"0":"")+m; };
const leavesIn=M=>id=>M.leavesOf(id,[]);
/* names a text can use for a formation (leaf ids); aggregates resolve to their tracked leaves */
const NAMES=[
 ["Napoleon",["gqg"]],["Emperor",["gqg"]],["Berthier",["gqg"]],
 ["Saint-Hilaire",["sthilaire"]],["St-Hilaire",["sthilaire"]],["Thiebault",["sthilaire"]],["10e Legere",["sthilaire"]],["Morand",["sthilaire"]],
 ["Vandamme",["vandamme"]],["4th Line",["vandamme"]],["Legrand",["legrand"]],["Levasseur",["legrand"]],
 ["Friant",["friant"]],["Heudelet",["friant"]],["Bourcier",["bourcier"]],["Davout",["friant","bourcier"]],
 ["Soult",["sthilaire","vandamme"]],["Caffarelli",["caffarelli"]],["Suchet",["suchet"]],["Lannes",["caffarelli","suchet"]],
 ["Santon",["santon"]],["Claparède",["santon"]],["Kellermann",["kellermann"]],["Nansouty",["nansouty"]],["d'Hautpoul",["dhautpoul"]],
 ["Walther",["walther"]],["Murat",["kellermann","nansouty","dhautpoul","walther"]],["Rivaud",["rivaud"]],["Drouet",["drouet"]],
 ["Bernadotte",["rivaud","drouet"]],["Bessieres",["guard_cav"]],["Rapp",["guard_cav"]],["French Guard",["guard_inf","guard_cav"]],
 ["Oudinot",["c_gren"]],["grenadiers",["c_gren"]],["Grenadier",["c_gren"]],
 ["Kutuzov",["ahq"]],["the Tsar",["ahq"]],["emperors",["ahq"]],["Weyrother",["ahq"]],["Buxhowden",["buxhowden"]],
 ["Kienmayer",["kienmayer"]],["Dokhturov",["dok"]],["I Column",["dok"]],["1st Column",["dok"]],["First Column",["dok"]],
 ["Langeron",["lang"]],["II Column",["lang"]],["Second Column",["lang"]],["Kamensky",["kamensky"]],
 ["Przybyszewski",["prz"]],["III Column",["prz"]],["Third Column",["prz"]],
 ["4th Column",["milo","kollo"]],["IV Column",["milo","kollo"]],["Fourth Column",["milo","kollo"]],["Miloradovich",["milo"]],
 ["Kollowrat",["kollo"]],["Jurczek",["kollo"]],["Rottermund",["kollo"]],
 ["Liechtenstein",["lich"]],["Fifth Column",["lich"]],["Uvarov",["lich"]],["Bagration",["bag"]],
 ["Russian Guard",["rg_inf","rg_cav"]],["Russian Imperial Guard",["rg_inf","rg_cav"]],["Constantine",["rg_inf","rg_cav"]],["Chevalier Guard",["rg_cav"]],
 ["Guard cavalry",["rg_cav"]]
];
function namesIn(text){ const s=new Set(); NAMES.forEach(([k,ids])=>{ if(new RegExp("(^|[^A-Za-z])"+k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"($|[^A-Za-z])").test(text)) ids.forEach(i=>s.add(i)); }); return s; }
/* times in free text: "08:45", "13:00-14:00", "about 08:30-09:00", "a quarter to nine", "seven o'clock", "after 11:00", "noon" */
const WORD={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12};
const hr=h=>h<4?h+12:h;   /* the day runs 04:00-18:00 */
function timesIn(text){
  const out=[]; let m; const t=String(text);
  const reI=/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/g; while((m=reI.exec(t))) out.push({a:+m[1]*60+ +m[2],b:+m[3]*60+ +m[4]});
  const stripped=t.replace(reI," ");
  const reP=/(after\s+)?(\d{1,2}):(\d{2})/g; while((m=reP.exec(stripped))){ const v=+m[2]*60+ +m[3]; out.push(m[1]?{a:v,b:null,after:true}:{a:v,b:v}); }
  const reQ=/(a quarter to|quarter to|a quarter past|quarter past|half past)\s+(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)/gi;
  while((m=reQ.exec(t))){ const h=hr(WORD[m[2].toLowerCase()]), k=m[1].toLowerCase(); const v=/to/.test(k)?h*60-15:/half/.test(k)?h*60+30:h*60+15; out.push({a:v,b:v,words:m[0]}); }
  const reO=/(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve) o'clock/gi; while((m=reO.exec(t))){ const v=hr(WORD[m[1].toLowerCase()])*60; out.push({a:v,b:v,words:m[0]}); }
  const reN=/\b(noon|midday)\b/gi; while((m=reN.exec(t))) out.push({a:720,b:720,words:m[0]});   /* since step 1 (D-1) */
  return out.filter(x=>x.a>=180&&x.a<=1140);
}
const tstr=s=>hm(s.a)+(s.b!=null&&s.b!==s.a?"-"+hm(s.b):"")+(s.after?"+":"");
const norm=t=>String(t).replace(/\s+/g," ").trim();
const short=(t,n)=>{ t=norm(t); n=n||72; return t.length>n?t.slice(0,n-1)+"…":t; };

/* ---- the inventory (rule L1): every string literal and comment of data.js and analysis.js, by its path in the model
   (PHASES.6.events.2.0, FORMATIONS.gqg.track.6.act; a comment "(comment) data.js:517") and its line ---- */
let INV_CACHE=null;
function inventory(){
  if(INV_CACHE) return INV_CACHE;
  const items=[], lines=new Map();
  ["data.js","analysis.js"].forEach(f=>{
    const src=SRC[f].join("\n"), cm=[];
    const ast=acorn.parse(src,{ecmaVersion:2020,locations:true,onComment:cm});
    (function walk(n,keys){
      if(!n||typeof n!=="object") return;
      if(Array.isArray(n)){ n.forEach(x=>walk(x,keys)); return; }
      const k=keys.join(".");
      if(n.type&&keys.length&&!lines.has(k)) lines.set(k,f+":"+n.loc.start.line);
      if(n.type==="Literal"){ if(typeof n.value==="string") items.push({path:k,f,line:n.loc.start.line,where:f+":"+n.loc.start.line,value:n.value}); return; }
      if(n.type==="ArrayExpression"){ n.elements.forEach((x,i)=>walk(x,keys.concat(i))); return; }
      if(n.type==="ObjectExpression"){ n.properties.forEach(p=>walk(p.value,keys.concat(p.key.type==="Identifier"?p.key.name:p.key.value))); return; }
      if(n.type==="VariableDeclarator"){ walk(n.init,[n.id.name]); return; }
      for(const q in n){ if(q==="loc") continue; const v=n[q]; if(v&&typeof v==="object") walk(v,keys); }
    })(ast,[]);
    cm.forEach(c=>items.push({path:"(comment) "+f+":"+c.loc.start.line,f,line:c.loc.start.line,where:f+":"+c.loc.start.line,value:c.value,comment:true}));
  });
  INV_CACHE={items,lines};
  return INV_CACHE;
}
/* ---- the statements (the extractor, v2 since step 1) ---- */
function extract(M){
  const S=[], refUnit=new Map(), INV=inventory(), leaves=leavesIn(M);
  const whereOf=p=>INV.lines.get(p)||"?";
  /* one statement per string; a ref already taken by another string gets " #2", " #3" */
  function refFor(ref,unit){ let r=ref, n=1; while(refUnit.has(r)&&refUnit.get(r)!==unit) r=ref+" #"+(++n); refUnit.set(r,unit); return r; }
  function add(ref,unit,p,text,times,forms,extra){ if(!times.length) return; const r=refFor(ref,unit);
    times.forEach(t=>S.push(Object.assign({ref:r,src:r,path:p,where:p&&p[0]==="("?p.slice(10):whereOf(p),text:String(text),a:t.a,b:t.b,after:!!t.after,forms:[...forms]},extra||{}))); }
  const str=(o,k)=>typeof o[k]==="string"?o[k]:null;
  M.PHASES.forEach((ph,i)=>{
    (ph.events||[]).forEach(([lab,txt],j)=>{ const u="PHASES."+i+".events."+j, ref="timeline "+i+": "+norm(txt), f=namesIn(txt);
      const m=/^(after\s+)?(\d{1,2}):(\d{2})(?:\s*[-–]\s*(\d{1,2}):(\d{2}))?/.exec(String(lab).replace(/^c\.\s*/,""));
      let tt=timesIn(lab); if(m){ const a=+m[2]*60+ +m[3]; tt=[m[1]?{a,b:null,after:true}:{a,b:m[4]?+m[4]*60+ +m[5]:a}]; }
      add(ref,u,u+".0",lab+" "+txt,tt,f); add(ref,u,u+".1",lab+" "+txt,timesIn(txt),f); });
    if(str(ph,"lede")) add("lede "+i,"PHASES."+i+".lede","PHASES."+i+".lede",ph.lede,timesIn(ph.lede),namesIn(ph.lede));
    ["title","label"].forEach(k=>{ if(str(ph,k)) add("phase "+i+" "+k,"PHASES."+i+"."+k,"PHASES."+i+"."+k,ph[k],timesIn(ph[k]),namesIn(ph[k])); });
  });
  M.EVENTS.forEach((e,i)=>{ const f=new Set((e.forms||[]).flatMap(leaves)); namesIn(e.n+" "+(e.why||"")).forEach(x=>f.add(x));
    const w=Array.isArray(e.t)?{a:e.t[0],b:e.t[1]}:{a:e.t,b:e.t}, u="EVENTS."+i;
    add("event "+e.id,u+".t",u+".t",e.n,[w],f,{kind:e.kind});
    ["n","why","dispute"].forEach(k=>{ if(str(e,k)) add("event "+e.id+" "+k,u+"."+k,u+"."+k,e[k],timesIn(e[k]),f); }); });   /* dispute: roadmap step 2, decision 125 (a) */
  Object.entries(M.FORMATIONS).forEach(([id,fm])=>{
    ["name","commander","staff","role","note","strengthNote","mixedNote"].forEach(k=>{ if(str(fm,k)){ const p="FORMATIONS."+id+"."+k;
      add("formation "+id+" "+k,p,p,fm[k],timesIn(fm[k]),new Set([...leaves(id),...namesIn(fm[k])])); } });
    if(fm.track) Object.entries(fm.track).forEach(([ph,e])=>["act","obj"].forEach(k=>{ if(str(e,k)){ const p="FORMATIONS."+id+".track."+ph+"."+k;
      add("anchor "+id+"@"+ph+" "+k,p,p,e[k],timesIn(e[k]),new Set([id])); } }));
  });
  M.ANALYSIS.forEach((c,i)=>{ const f=new Set((c.forms||[]).flatMap(leaves)), mo=M.momentOf(c.at);
    if(mo) add("chapter "+c.id+" (clock)","ANALYSIS."+i+".at",null,c.n,[{a:mo.t,b:mo.t}],f,{weak:true,where:whereOf("ANALYSIS."+i+".at")});
    ["text","n"].forEach(k=>{ if(str(c,k)) add("chapter "+c.id+" "+k,"ANALYSIS."+i+"."+k,"ANALYSIS."+i+"."+k,c[k],timesIn(c[k]),namesIn(c[k])); }); });
  M.TOUR.forEach((s,k)=>{ const mo=M.momentOf(s.at), t=s.t!==undefined?s.t:mo?mo.t:null, f=namesIn(s.x||"");
    if(t!=null) add("tour "+(k+1)+" (clock)","TOUR."+k+".at",null,s.n,[{a:t,b:t}],f,{weak:true,where:whereOf("TOUR."+k+(s.t!==undefined?".t":".at"))});
    ["x","n"].forEach(q=>{ if(str(s,q)) add("tour "+(k+1)+" "+q,"TOUR."+k+"."+q,"TOUR."+k+"."+q,s[q],timesIn(s[q]),namesIn(s[q])); }); });
  M.ACTS.forEach((a,i)=>["n","line"].forEach(k=>{ if(str(a,k)) add("act "+a.id+" "+k,"ACTS."+i+"."+k,"ACTS."+i+"."+k,a[k],timesIn(a[k]),namesIn(a[k])); }));
  M.FEATURES.forEach((ft,i)=>{ const u="FEATURES."+i;
    ["name","sub","story"].forEach(k=>{ if(str(ft,k)) add("feature "+ft.id+" "+k,u+"."+k,u+"."+k,ft[k],timesIn(ft[k]),namesIn(ft[k])); });
    (ft.why||[]).forEach((w,j)=>{ if(typeof w==="string") add("feature "+ft.id+" why "+j,u+".why."+j,u+".why."+j,w,timesIn(w),namesIn(w)); });
    (ft.facts||[]).forEach((q,j)=>{ const txt=q.join(": "), ref="feature "+ft.id+" fact "+norm(q[0]), uu=u+".facts."+j;
      q.forEach((part,z)=>{ if(typeof part==="string") add(ref,uu,uu+"."+z,txt,timesIn(part),namesIn(txt)); }); }); });
  Object.entries(M.COMMAND).forEach(([sd,byPh])=>Object.entries(byPh).forEach(([ph,rows])=>rows.forEach((r,j)=>{ const p="COMMAND."+sd+"."+ph+"."+j+".2";
    if(typeof r[2]==="string") add("command "+sd+"@"+ph+": "+norm(r[2]),p,p,r[2],timesIn(r[2]),namesIn(r[2])); })));
  [["plan","PLANS",M.PLANS],["source-note","SOURCE_NOTE",M.SOURCE_NOTE]].forEach(([name,root,obj])=>(function walk(o,keys){
    if(typeof o==="string"){ const p=[root].concat(keys).join("."); add(name+" "+keys.join("."),p,p,o,timesIn(o),namesIn(o)); return; }
    if(o&&typeof o==="object") Object.entries(o).forEach(([k,v])=>walk(v,keys.concat(k))); })(obj,[]));
  INV.items.filter(it=>it.comment&&it.f==="data.js").forEach(it=>{ const t=norm(it.value);
    /* the comment on Przybyszewski's phase-8 anchor names no formation: attach it to prz by its content */
    add("comment data.js: "+t,it.path,it.path,it.value,timesIn(it.value),/holds at Sokolnitz until it is surrounded/.test(t)?new Set(["prz"]):namesIn(t)); });
  return S;
}
const ST=extract(X);
module.exports={ST,X,hm,lineOf,namesIn,timesIn,extract,inventory};

/* ---- the review: what each timed statement dates, recorded by hand (docs/STAGE2_SPEC.md section M) ----
   [the verdict section M recorded (frozen, for comparison), kind, text time from, text time to (minutes; null = open),
    evidence (file:line when section M was written: history; the live link is REVIEW_CITES below), note, flag].
   kind says what the statement dates for THIS anchor's move; the verdict is then COMPUTED against the live engine window
   [start, arrival] (legWindow), so re-running the audit after a timing change re-derives every verdict:
     start    the move's beginning:    early if start <= from - 15;  late if start >= to + 15
     arrival  when the anchor is reached: early if arrival <= from - 15;  late if arrival >= to + 15
     during   an action that is (part of) the move: early if arrival <= from - 15;  late if start >= to + 15
     span     the move from beginning to end: early if arrival <= to - 15 or start <= from - 15;  late if start >= from + 15
              or arrival >= to + 15
   A difference of 15 minutes or more counts (section M's tolerance; its prose said "plus or minus 15"). Size = the text's
   time minus the engine's (positive = early). A kind of null: no timed statement about this move ("undetermined").
   Unlisted anchors: under 250 m of movement "minor"; phase 9 "nightfall"; otherwise "undetermined". Flag "creep": the engine
   spread the move from 04:00 although the text starts it later; it is reported while the engine still starts it 15 minutes
   or more before the text's time. */
const T=(h,m)=>h*60+(m||0);
const REVIEW={
 "gqg@6":["early","during",T(12),T(12),"data.js:105; analysis.js:303","the move to Stare Vinohrady is c. 12:00; the engine arrives 11:15"],
 "gqg@7":["undetermined",null,null,null,"analysis.js:51","the order to wheel is untimed; the wheel itself is 13:00-14:00"],
 "heightguns@8":["consistent","during",T(14,30),T(15),"data.js:120; analysis.js:323; analysis.js:327","the causeway under fire from c. 14:30; the engine's battery arrives 14:30"],
 "sthilaire@2":["undetermined",null,null,null,"data.js:72; analysis.js:263","the crossing is untimed; the release is 08:25-08:45"],
 "sthilaire@3":["early","start",T(8,45),T(9),"data.js:78; data.js:79; analysis.js:267; analysis.js:271; analysis.js:31; analysis.js:353","the climb starts c. 08:45 and Pratzen village is cleared c. 09:00; the engine climbs 08:00-08:45 (start 45 min early, arrival at least 15)"],
 "sthilaire@4":["consistent","during",T(9),T(9,45),"data.js:79; data.js:87","the 10e Legere pushes for the summit from c. 09:00 and is on the crest before 09:45; the engine arrives 09:30"],
 "sthilaire@7":["early","span",T(13),T(14),"data.js:113; analysis.js:315; analysis.js:51","the wheel is 13:00-14:00; the engine wheels 11:15-12:45 (arrival 75 min before the text's end, start 105 min before its start)"],
 "sthilaire@8":["consistent","during",T(13),T(14),"data.js:113; analysis.js:319","Sokolnitz falls c. 14:00, inside the engine's 12:45-14:30; note the act, shown in phase 8 (from 14:30), describes 13:00-14:00"],
 "vandamme@3":["early","start",T(8,45),T(9),"data.js:78; analysis.js:267; analysis.js:31; analysis.js:353","as Saint-Hilaire: the climb starts c. 08:45; the engine climbs 08:00-08:45"],
 "vandamme@6":["consistent","during",T(11),null,"data.js:103; analysis.js:295; data.js:564","the Guard attacks after 11:00 (hour not established); the engine arrives 11:15"],
 "vandamme@7":["early","start",T(13),T(14),"data.js:113; analysis.js:315; analysis.js:51","as Saint-Hilaire: the wheel is 13:00-14:00"],
 "vandamme@8":["consistent","arrival",T(14,30),T(14,30),"data.js:120; analysis.js:323","takes the height above Augezd c. 14:30; the engine arrives 14:30"],
 "legrand@1":["consistent","arrival",T(7),T(7),"data.js:62; analysis.js:244","Telnitz attacked c. 07:00; the engine's defenders are in place at 07:00"],
 "legrand@2":["consistent","arrival",T(8),T(8),"data.js:70; analysis.js:255","Sokolnitz attacked c. 08:00"],
 "legrand@7":["early","during",T(13),T(14),"data.js:113; analysis.js:51","the act ties the move to the trap closing, dated 13:00-14:00; the engine arrives 12:45 (at least 15 min early)"],
 "legrand@8":["early","arrival",T(15),T(15),"data.js:640","Telnitz changed hands until 15:00 and the act (phase 8) retakes it 'for good'; the engine arrives 14:30"],
 "friant@1":["early",null,null,null,"data.js:64; analysis.js:251","the statement it was matched to (the leading brigade reaches the Goldbach c. 08:00) dates the arrival at the Goldbach, which is the leg into friant@2 (the davout event's marker is that anchor); this waypoint's own move from Raigern is undated. Section M counted it early by 60 (re-reviewed in the chronology data task)"],
 "friant@2":["early","arrival",T(8,30),T(8,30),"data.js:71; analysis.js:259","Telnitz retaken c. 08:30; the engine arrives 08:00"],
 "friant@7":["consistent","during",T(12,30),T(12,30),"data.js:239; data.js:112; analysis.js:311","the act itself says 'at about 12:30'; the engine arrives 12:45"],
 "friant@8":["consistent","during",T(14),T(14),"analysis.js:319","Sokolnitz falls c. 14:00, inside the engine's 12:45-14:30"],
 "bourcier@7":["consistent","during",T(12,30),T(12,30),"analysis.js:311","Davout resumes c. 12:30; the engine arrives 12:45"],
 "caffarelli@5":["consistent","during",T(9,30),T(10,40),"data.js:86; data.js:95","Lannes advances c. 09:30, the cavalry collide c. 10:40; the engine arrives 10:30","creep"],
 "caffarelli@6":["consistent","arrival",T(11,15),T(11,15),"analysis.js:291","Blasowitz falls c. 11:15"],
 "suchet@5":["consistent","during",T(9,30),T(10,40),"data.js:86","as Caffarelli","creep"],
 "suchet@6":["consistent","arrival",T(11,15),T(11,15),"analysis.js:291","Blasowitz falls c. 11:15"],
 "kellermann@5":["consistent","during",T(10,40),T(10,40),"data.js:95","the collision c. 10:40; the engine arrives 10:30","creep"],
 "nansouty@5":["consistent","during",T(10,40),T(10,40),"data.js:95","the collision c. 10:40","creep"],
 "dhautpoul@5":["consistent","during",T(10,40),T(10,40),"data.js:95","the collision c. 10:40","creep"],
 "rivaud@3":["early","start",T(8,45),null,"data.js:78","the act (phase 3) 'Follows Soult onto the plateau'; Soult advances c. 08:45; the engine arrives 08:45 (at least 15 min early)","creep"],
 "drouet@6":["consistent","during",T(11),null,"data.js:103; analysis.js:299","the Guard attack after 11:00; the engine forms the line by 11:15"],
 "guard_inf@6":["consistent","during",T(11),null,"data.js:103; analysis.js:295","committed as the Russian Guard attacks, after 11:00; the engine arrives 11:15"],
 "guard_inf@7":["early","span",T(13),T(14),"analysis.js:315","the wheel (which names the Guard infantry) is 13:00-14:00; the engine moves 11:15-12:45"],
 "guard_cav@6":["early","during",T(11,45),T(11,45),"data.js:104; analysis.js:299; analysis.js:38","Rapp's counter-charge c. 11:45; the engine arrives 11:15. The texts disagree: the event's window starts 11:15 (analysis.js:299); the chapter's clock was 11:20 (analysis.js:38) until the spine data task, and the theme now opens at phase 6, 11:15"],
 "c_gren@7":["early","span",T(13),T(14),"analysis.js:315","the wheel (which names the grenadiers) is 13:00-14:00; the engine moves 11:15-12:45"],
 "c_gren@8":["consistent","during",T(13),T(14),"analysis.js:315","the wheel 13:00-14:00 inside the engine's 12:45-14:30"],
 "ahq@3":["consistent","during",T(8,30),T(9),"data.js:411; data.js:412; analysis.js:96","the emperors join the column about 08:30-09:00; the engine arrives 08:45; but the headquarters is 'at Krzenowitz' in phase 0 and the engine moves it from 04:00","creep"],
 "ahq@6":["undetermined",null,null,null,"data.js:414","the fall-back to Krzenowitz is untimed; the act places it in phase 6 (from 11:15), after the engine's arrival"],
 "buxhowden@7":["undetermined",null,null,null,"data.js:106; analysis.js:307","the statements (still unaware c. 12:00) concern knowledge, not the move"],
 "kienmayer@1":["consistent","arrival",T(7),T(7),"data.js:62; analysis.js:244","attacks Telnitz c. 07:00; the engine arrives 07:00"],
 "kienmayer@8":["early","span",T(14,30),T(15),"data.js:120; data.js:121; analysis.js:327","the act falls back 'under artillery fire'; the causeway is under fire from c. 14:30 and the ice c. 15:00; the engine completes the move by 14:30"],
 "kienmayer@9":["consistent","during",T(15),T(15),"analysis.js:327","fire on the ice c. 15:00, inside the engine's 14:30-17:00"],
 "dok@1":["early","during",T(7,30),null,"data.js:63","the column 'begins descending' c. 07:30; the engine completes the descent by 07:00. The texts disagree: the event 'columns begin to leave the plateau' is 04:00-07:00 (analysis.js:236), which agrees with the engine"],
 "dok@2":["consistent","during",T(7),T(9),"analysis.js:26","the columns descend into the villages between 07:00 and 09:00"],
 "dok@8":["early","span",T(14,30),T(15),"data.js:120; analysis.js:327","as Kienmayer: the retreat over the meres is under fire from c. 14:30-15:00; the engine completes it by 14:30"],
 "dok@9":["consistent","during",T(15),T(15),"analysis.js:327","the ice c. 15:00, inside 14:30-17:00"],
 "lang@1":["consistent","during",T(4),T(7),"analysis.js:236","the columns leave the plateau 04:00-07:00"],
 "lang@2":["consistent","arrival",T(8),T(8),"data.js:70; analysis.js:255","attacks Sokolnitz c. 08:00"],
 "lang@4":["early","arrival",T(10,30),T(10,30),"data.js:89; analysis.js:283","the reinforcements are sent up c. 10:30; the engine completes the move by 09:30"],
 "lang@7":["consistent","during",T(12,30),T(12,30),"data.js:469; data.js:112","the act: driven back 'at about 12:30'; the engine arrives 12:45"],
 "kamensky@3":["early","during",T(9,45),T(9,45),"data.js:87; analysis.js:279","turns about c. 09:45 (timeline and event); the engine arrives 08:45. The texts disagree: the act puts the turn in phase 3 (08:45-09:30)"],
 "kamensky@4":["early","during",T(9,45),T(9,45),"data.js:87; analysis.js:279","drives the 10e Legere off the crest c. 09:45; the engine arrives 09:30"],
 "kamensky@5":["consistent","during",T(10,15),T(10,15),"data.js:88","Jurczek's attack c. 10:15, inside the engine's 09:30-10:30"],
 "kamensky@6":["consistent","during",T(10,30),T(11),"analysis.js:283; analysis.js:287","the crest is lost c. 10:30 and firmly French by 11:00, inside 10:30-11:15"],
 "kamensky@7":["consistent","during",T(11,15),null,"data.js:483","the act: its route 'after 11:15'"],
 "prz@1":["consistent","during",T(4),T(7),"analysis.js:236","the columns leave the plateau 04:00-07:00"],
 "prz@2":["consistent","arrival",T(8),T(8),"data.js:70; analysis.js:255","goes for the castle c. 08:00"],
 "prz@8":["consistent","during",T(14),T(14),"data.js:496; analysis.js:319","written for the engine's rule: holds until surrounded c. 14:00, then 14:10-14:30. Its text time was typed 14:00-14:30 until roadmap step 1: 14:30 is the phase's start, not a time of any text (rule L4)"],
 "milo@2":["consistent","during",T(4,15),T(8),"analysis.js:240","held up by the counter-march 04:15-08:00"],
 "milo@3":["consistent","arrival",T(8,45),T(8,45),"data.js:78","caught as Soult appears c. 08:45; the engine arrives 08:45"],
 "milo@4":["consistent","during",T(9,15),T(9,15),"data.js:80; analysis.js:275","faces about c. 09:15, inside 08:45-09:30"],
 "kollo@2":["consistent","during",T(4,15),T(8),"analysis.js:240","held up by the counter-march 04:15-08:00"],
 "kollo@4":["early","arrival",T(10,15),T(10,15),"data.js:88","Jurczek attacks the Pratzeberg c. 10:15; the engine arrives 09:30"],
 "kollo@5":["consistent","during",T(10,15),T(11),"data.js:88; analysis.js:287","inside 09:30-10:30"],
 "lich@2":["consistent","during",T(4,15),T(8),"analysis.js:240","the counter-march 04:15-08:00"],
 "lich@5":["consistent","during",T(10,40),T(10,40),"data.js:95","the collision c. 10:40; the engine arrives 10:30"],
 "lich@6":["consistent","arrival",T(11,15),T(11,15),"analysis.js:291","Blasowitz falls c. 11:15"],
 "bag@5":["consistent","during",T(9,30),null,"data.js:86","counter-attacks from c. 09:30, inside the engine's 04:00-10:30","creep"],
 "bag@6":["early","start",T(11,15),null,"data.js:97","'begins falling back' c. 11:15; the engine moves 10:30-11:15 (start 45 min early)"],
 "bag@7":["consistent","during",T(11,15),null,"data.js:97","falling back from 11:15"],
 "bag@8":["early","during",T(16,30),T(16,30),"data.js:122","'withdraws on Rausnitz' c. 16:30; the engine completes the move by 14:30"],
 "rg_inf@6":["consistent","during",T(11),null,"data.js:564; data.js:103","committed around 11:00; the engine arrives 11:15"],
 "rg_inf@7":["consistent","during",T(11,45),T(13,15),"data.js:104; analysis.js:299","driven off after Rapp's charge, inside 11:15-12:45"],
 "rg_cav@6":["consistent","during",T(11),null,"data.js:103","takes the eagle after 11:00; the engine arrives 11:15","creep"],
 "rg_cav@7":["consistent","during",T(11,15),T(13,15),"analysis.js:299","inside the event's window"]
};
/* ---- the cites (rules L2-L5, L8; since roadmap step 1): for each REVIEW row, the live statements it reviewed, each at the
   time(s) the row transcribes, "<ref, or its beginning past the ': '> @HH:MM[-HH:MM][+]". A row without a kind cites the
   statements it judged not to date its move. 136 cites are REVIEW's evidence column resolved to today's statements (file:line
   as of 4b5f14a, else 4d631bf or d91b9a4; two did not resolve: guard_cav@6's analysis.js:38, the old chapter clock 11:20, and
   ahq@6's data.js:414, an untimed act); 36 were added in step 1, each a sentence already in the sources at a time its row
   already records. A sentence retimed, a source moved or renamed (a new path, phase or id), or a free-text ref reworded
   within the beginning its cite names fails L3 until its row is reviewed again; a reword that keeps the time and the cited
   beginning is not detected (the ledger is by ref and time, not by full text). */
const REVIEW_CITES={
 "gqg@6":["timeline 6: Napoleon moves forward from the @12:00","event hq-forward @12:00-12:40","feature vinohrady fact Also @12:00","feature zuran fact Vacated @12:00"],
 "gqg@7":["chapter wheel text @13:00","chapter wheel text @14:00"],
 "heightguns@8":["timeline 8: Vandamme takes the height above @14:30","event augezd @14:30","event ice @15:00","timeline 8: French artillery fires on the @15:00"],
 "sthilaire@2":["timeline 2: Napoleon asks Soult how long @08:30","event decision @08:25-08:45"],
 "sthilaire@3":["timeline 3: Soult's divisions advance. The mist @08:45","timeline 3: Thiebault's brigade clears Pratzen village; @09:00","event pratzen-village @09:00","event soult @08:45-09:15","chapter pratzen text @08:45","tour 6 x @08:45","feature pratzenv fact Cleared by @09:00"],
 "sthilaire@4":["timeline 3: Thiebault's brigade clears Pratzen village; @09:00","event pratzen-village @09:00","timeline 4: Kamensky turns his brigade about @09:45","event kamensky @09:45","feature pratzenv fact Cleared by @09:00"],
 "sthilaire@7":["timeline 7: Soult and Davout launch the @13:00-14:00","event wheel @13:00-14:00","chapter wheel text @13:00","chapter wheel text @14:00"],
 "sthilaire@8":["timeline 7: Soult and Davout launch the @13:00-14:00","event sokolnitz-falls @14:00","timeline 7: Sokolnitz falls @14:00"],
 "vandamme@3":["timeline 3: Soult's divisions advance. The mist @08:45","event soult @08:45-09:15","chapter pratzen text @08:45","tour 6 x @08:45","timeline 3: Thiebault's brigade clears Pratzen village @09:00"],
 "vandamme@6":["timeline 6: The Russian Guard attacks Vandamme; @11:00+","event guard-attack @11:00-13:00","formation constantine role @11:00","feature vinohrady fact Contested by @11:00"],
 "vandamme@7":["timeline 7: Soult and Davout launch the @13:00-14:00","event wheel @13:00-14:00","chapter wheel text @13:00","chapter wheel text @14:00"],
 "vandamme@8":["timeline 8: Vandamme takes the height above @14:30","event augezd @14:30"],
 "legrand@1":["timeline 1: Kienmayer's advance guard attacks Telnitz. @07:00","event telnitz @07:00","feature telnitz fact Changed hands @07:00"],
 "legrand@2":["timeline 2: Langeron attacks Sokolnitz; Przybyszewski goes @08:00","event sokolnitz @08:00"],
 "legrand@7":["timeline 7: Soult and Davout launch the @13:00-14:00","chapter wheel text @13:00","chapter wheel text @14:00"],
 "legrand@8":["feature telnitz fact Changed hands @15:00"],
 "friant@1":["timeline 1: Friant's leading brigade comes up @08:00","event davout @07:45-08:15","event raigern @04:00-04:45","event davout why @08:00"],
 "friant@2":["timeline 2: Friant's leading troops retake Telnitz, @08:30","event telnitz-retaken @08:30"],
 "friant@7":["anchor friant@7 act @12:30","timeline 6: Davout regroups and attacks; Langeron @12:30","event davout-resumes @12:30"],
 "friant@8":["event sokolnitz-falls @14:00","timeline 7: Sokolnitz falls @14:00"],
 "bourcier@7":["event davout-resumes @12:30"],
 "caffarelli@5":["timeline 4: Lannes advances along the highway. @09:30","timeline 5: The cavalry collision west of @10:40"],
 "caffarelli@6":["event blasowitz @11:15","chapter north text @11:15"],
 "suchet@5":["timeline 4: Lannes advances along the highway. @09:30","timeline 5: The cavalry collision west of Blasowitz @10:40"],
 "suchet@6":["event blasowitz @11:15","chapter north text @11:15"],
 "kellermann@5":["timeline 5: The cavalry collision west of @10:40"],
 "nansouty@5":["timeline 5: The cavalry collision west of @10:40"],
 "dhautpoul@5":["timeline 5: The cavalry collision west of @10:40"],
 "rivaud@3":["timeline 3: Soult's divisions advance. The mist @08:45"],
 "drouet@6":["timeline 6: The Russian Guard attacks Vandamme; @11:00+","event guard-broken @11:15-13:15"],
 "guard_inf@6":["timeline 6: The Russian Guard attacks Vandamme; @11:00+","event guard-attack @11:00-13:00"],
 "guard_inf@7":["event wheel @13:00-14:00"],
 "guard_cav@6":["timeline 6: Bessieres and Rapp counter-charge. The @11:45","source-note body.5 @11:45"],
 "c_gren@7":["event wheel @13:00-14:00"],
 "c_gren@8":["event wheel @13:00-14:00"],
 "ahq@3":["anchor ahq@0 act @08:30-09:00","anchor ahq@3 act @08:45","command al@2: That the 4th Column was @08:45"],
 "ahq@6":[],
 "buxhowden@7":["timeline 6: Buxhowden, on the Allied left, @12:00","event buxhowden-blind @11:40-12:40","event buxhowden-blind why @12:00","formation buxhowden role @12:00","chapter cut text @12:00","tour 7 x @12:00"],
 "kienmayer@1":["timeline 1: Kienmayer's advance guard attacks Telnitz. @07:00","event telnitz @07:00","feature telnitz fact Changed hands @07:00"],
 "kienmayer@8":["timeline 8: Vandamme takes the height above @14:30","timeline 8: French artillery fires on the @15:00","event ice @15:00"],
 "kienmayer@9":["event ice @15:00","timeline 8: French artillery fires on the @15:00"],
 "dok@1":["timeline 1: Dokhturov's I Column begins descending @07:30","source-note body.5 @07:30","event columns-move dispute @07:30"],
 "dok@2":["chapter commitment text @07:00","chapter commitment text @09:00","tour 4 x @07:00"],
 "dok@8":["timeline 8: Vandamme takes the height above @14:30","event ice @15:00","timeline 8: French artillery fires on the @15:00"],
 "dok@9":["event ice @15:00","timeline 8: French artillery fires on the @15:00"],
 "lang@1":["event columns-move @04:00-07:00","timeline 0: Allied columns begin to move off the plateau @04:00"],
 "lang@2":["timeline 2: Langeron attacks Sokolnitz; Przybyszewski goes @08:00","event sokolnitz @08:00"],
 "lang@4":["timeline 4: Langeron rides back and sends @10:30","event kursk @10:30"],
 "lang@7":["anchor lang@7 act @12:30","timeline 6: Davout regroups and attacks; Langeron @12:30"],
 "kamensky@3":["timeline 4: Kamensky turns his brigade about @09:45","event kamensky @09:45","source-note body.5 @09:45","event kamensky dispute @09:45"],
 "kamensky@4":["timeline 4: Kamensky turns his brigade about @09:45","event kamensky @09:45","source-note body.5 @09:45"],
 "kamensky@5":["timeline 4: Jurczek's Austrians attack the Pratzeberg; @10:15"],
 "kamensky@6":["event kursk @10:30","event pratzeberg @11:00","timeline 5: The Pratzeberg is firmly in @11:00","lede 3 @11:00","chapter pratzen text @11:00","feature pratzen story @11:00","feature vinohrady fact Taken by @11:00","feature pratzeberg fact Secure by @11:00"],
 "kamensky@7":["anchor kamensky@7 act @11:15+"],
 "prz@1":["event columns-move @04:00-07:00","timeline 0: Allied columns begin to move off the plateau @04:00"],
 "prz@2":["timeline 2: Langeron attacks Sokolnitz; Przybyszewski goes @08:00","event sokolnitz @08:00"],
 "prz@8":["comment data.js: timing inferred: holds at Sokolnitz @14:00","event sokolnitz-falls @14:00","timeline 7: Sokolnitz falls @14:00"],
 "milo@2":["event counter-march @04:15-08:00"],
 "milo@3":["timeline 3: Soult's divisions advance. The mist @08:45"],
 "milo@4":["timeline 3: Kutuzov orders the 4th Column @09:15","event face-about @09:15"],
 "kollo@2":["event counter-march @04:15-08:00"],
 "kollo@4":["timeline 4: Jurczek's Austrians attack the Pratzeberg; @10:15"],
 "kollo@5":["timeline 4: Jurczek's Austrians attack the Pratzeberg; @10:15","event pratzeberg @11:00","timeline 5: The Pratzeberg is firmly in @11:00"],
 "lich@2":["event counter-march @04:15-08:00"],
 "lich@5":["timeline 5: The cavalry collision west of @10:40"],
 "lich@6":["event blasowitz @11:15","chapter north text @11:15"],
 "bag@5":["timeline 4: Lannes advances along the highway. @09:30"],
 "bag@6":["timeline 5: Blasowitz falls. Bagration begins falling @11:15"],
 "bag@7":["timeline 5: Blasowitz falls. Bagration begins falling @11:15"],
 "bag@8":["timeline 8: Organised resistance ends. Bagration withdraws @16:30","event end @16:30"],
 "rg_inf@6":["formation constantine role @11:00","timeline 6: The Russian Guard attacks Vandamme; @11:00+","feature vinohrady fact Contested by @11:00"],
 "rg_inf@7":["timeline 6: Bessieres and Rapp counter-charge. The @11:45","event guard-broken @11:15-13:15"],
 "rg_cav@6":["timeline 6: The Russian Guard attacks Vandamme; @11:00+","feature vinohrady fact Contested by @11:00"],
 "rg_cav@7":["event guard-broken @11:15-13:15"]
};
/* ---- the timed statements not judged against a move (rule L2), each with its reason; an entry no longer in the text fails
   L3. Entries two to four (H-12) wait on the step-2 data task (docs/FINAL_AUDIT.md H-12, question 129). ---- */
const ALLOW_TIMED={
 "timeline 0: Weyrother reads the dispositions @01:00":"before the clock's day (04:00), at the Allied headquarters' first anchor: there is no move to date",
 "timeline 0: Napoleon takes post on the Zuran @06:00":"the headquarters' first anchor (on the Zuran from 04:00): there is no move to date. 06:00 against 04:00 is H-12's contradiction; the step-2 data task (question 129) settles it",
 "feature zuran fact Occupied by @06:00":"as the 06:00 timeline line: the first anchor, no move; H-12, question 129",
 "feature blasowitz fact Fell @11:00":"contradicts 11:15 in the event, the phase line and the theme (H-12); as an arrival it would make caffarelli@6, suchet@6 and lich@6 late by 15 minutes. The step-2 data task (question 129) settles which time is right; until then it is not judged",
 "tour 4 x @04:00":"the plateau reading's clock (a derived reading that sim-test.js checks), not a movement",
 "tour 4 x @07:15":"the plateau reading's clock (a derived reading that sim-test.js checks), not a movement",
 "command al@7: From about noon @12:00":"the Allied command's knowledge (the Command view), not a movement",
 "plan fr.cost @09:00":"a counterfactual (\"if Legrand had broken before nine o'clock\"), not a dated movement",
 "source-note body.5 @04:00":"the other side of the named conflict dok@1 (decision 42): the event's time, restated; the conflict's own time (07:30) is cited by its row (L8)",
 "source-note body.5 @07:00":"the other side of the named conflict dok@1 (decision 42): the phase's clock, restated",
 "source-note body.5 @08:45":"the other side of the named conflicts kamensky@3 and kamensky@4 (decision 42): the phase's clock, restated",
 "source-note body.5 @11:15":"the other side of the named conflict guard_cav@6 (decision 42): the event's time, restated",
 /* roadmap step 2 (decision 125 (a)): the other sides restated where the disputed hours are now marked (the two events' dispute, the three
    phase lines); each conflict's own time is cited by its row. They follow the body.5 entries above rather than being cited by the conflict
    rows: a REVIEW row judges one side, its text time (L4b keeps every cite inside it), and the side restated here is the engine's own
    timing, which the move keeps (decision 42); citing it would mean changing the row's time and so its verdict */
 "event columns-move dispute @04:00":"the other side of the named conflict dok@1 (decision 42), restated in the event's dispute: the event's own time, where dok@1's leg starts. Not cited by dok@1 (as body.5 @04:00): that row judges the 07:30 side from 07:30 onward, and L4b keeps its cites inside it",
 "event kamensky dispute @08:45":"the other side of the named conflicts kamensky@3 and kamensky@4 (decision 42), restated in the event's dispute: the phase's clock, where kamensky@3 arrives. Not cited by kamensky@3 (as body.5 @08:45): that row judges the 09:45 side at 09:45, and L4b keeps its cites inside it",
 "timeline 1: Dokhturov's I Column begins descending @04:00":"the other side of the named conflict dok@1 (decision 42), restated in the phase line's mark: the event's time, where dok@1's leg starts. Not cited by dok@1 (as body.5 @04:00): that row judges the line's own 07:30 from 07:30 onward, and L4b keeps its cites inside it",
 "timeline 4: Kamensky turns his brigade about @08:45":"the other side of the named conflicts kamensky@3 and kamensky@4 (decision 42), restated in the phase line's mark: the phase's clock, where kamensky@3 arrives. Not cited by kamensky@3 (as body.5 @08:45): that row judges the line's own 09:45 at 09:45, and L4b keeps its cites inside it",
 "timeline 6: Bessieres and Rapp counter-charge. The @11:15":"the other side of the named conflict guard_cav@6 (decision 42), restated in the phase line's mark: the event's time, where guard_cav@6 arrives. Not cited by guard_cav@6 (as body.5 @11:15): that row judges the line's own 11:45 at 11:45, and L4b keeps its cites inside it"
};
/* ---- the timed strings the extractor does not read, by class (rule L1); a class that covers nothing fails ---- */
const EXCLUDED_PATHS=[   /* [name, path class, reason] */
 ["tm",/^FORMATIONS\.[^.]+\.track\.\d+\.tm\./,"the engine's own timing input and its evidence: --times (each quote resolved) and the movement audit judge it"],
 ["phase clocks",/^PHASES\.\d+\.clock$/,"the phase's window: rule L6 asserts it equals t0 - t1"],
 ["phase light keys",/^PHASES\.\d+\.light$/,"a light key without a reader since 4B (docs/FINAL_AUDIT.md D-4), not text; this class fails once the step-2 data task removes it"],
 ["tolWhy",/^EVENTS\.\d+\.tolWhy$/,"the suite's tolerance reason (sim-test.js), never shown"],
 ["analysis.js comments",/^\(comment\) analysis\.js:/,"code documentation in analysis.js, never shown"]
];
/* the three internal disagreements of section M (owner decision 42): settled against the sources, or left unresolved,
   keeping today's timing, when the sources could not be read. Kamensky's drive off the crest (kamensky@4) is dated by the
   same timeline entry as his turn, so it stays with that conflict. Each must cite SOURCE_NOTE's open question (L8). */
const CONFLICTS=["dok@1","guard_cav@6","kamensky@3","kamensky@4"];
/* 2C precondition (docs/STAGE2_SPEC.md section M.13), rules D1, F1 and F2: a derived arrival (dated departure, no dated
   arrival) is at the tactical rate (a design value, unsourced), or at the ceiling only for the legs named here, flagged, or at
   its own moveMin only for the legs named in MOVEMIN_DERIVED. The two climbs and Bagration's withdrawal are a dating question
   (the Kamensky passage; nightfall), not a rate one: they wait on the sources. The dated legs forced to 80% of the ceiling or
   more by a following default stay open too (FORCED_DATED, computed and asserted), and every other leg at 80% or more is named
   with its reason (NEAR_CEILING). Any other rule, a named leg moving off its rule, or an unnamed leg reaching 80% fails --check. */
const CEILING_FLAGGED=["sthilaire@3","vandamme@3","bag@8"];
const FORCED_DATED=["c_gren@8","kollo@5"];
const MOVEMIN_DERIVED={
 "gqg@6":"a headquarters has no tactical rate (app.js TACTICAL_RATE); its own moveMin of 40 is slower than the ceiling's 23.8 minutes, so anchorList takes the moveMin. Decided in docs/STAGE2_SPEC.md section M.13 (the derived legs, :1340; the decided table, :1393: \"its own moveMin (headquarters: no tactical rate)\"); data.js's gqg@6 note says so"
};
const NEAR_CEILING={
 "bag@9":"from bag@8's flagged derived arrival (16:45) to the phase-9 default (17:00): it follows from bag@8 and waits on the same sources (docs/STAGE2_SPEC.md section M.13, :1343)",
 "guard_inf@6":"its own moveMin of 60, unchanged since Stage 1B (docs/STAGE2_SPEC.md section M.13, :1344)"
};
const NEAR_SHARE=0.8;
const TOL=15;
function judge(kind,from,to,w){
  const s=w[0], e=w[1], hi=to==null?Infinity:to;
  if(!kind) return ["undetermined",null];
  if(kind==="start"){ if(s<=from-TOL) return ["early",from-s]; if(s>=hi+TOL) return ["late",hi-s]; return ["consistent",null]; }
  if(kind==="arrival"){ if(e<=from-TOL) return ["early",from-e]; if(e>=hi+TOL) return ["late",hi-e]; return ["consistent",null]; }
  if(kind==="during"){ if(e<=from-TOL) return ["early",from-e]; if(s>=hi+TOL) return ["late",hi-s]; return ["consistent",null]; }
  if(kind==="span"){ if(e<=hi-TOL) return ["early",hi-e]; if(s<=from-TOL) return ["early",from-s];
    if(s>=from+TOL) return ["late",from-s]; if(e>=hi+TOL) return ["late",hi-e]; return ["consistent",null]; }
  throw new Error("unknown kind "+kind);
}
const MOTION=/\b(march|marches|marching|climbs|advances|falls back|retreats|escapes|pursues|moves|crosses|wheels|comes down|withdraws|follows|attacks|charges|presses|closes|breaks|retakes|seizes|turns)\b/i;
function audit(M){
  M=M||X; const rows=[];
  Object.entries(M.FORMATIONS).forEach(([id,f])=>{ if(!f.track) return; const A=M.anchorList(id);
    A.forEach((b,k)=>{ if(k===0||!b.p||!A[k-1].p) return; const a=A[k-1], w=M.legWindow(a,b);
      const m=Math.hypot(b.p[0]-a.p[0],b.p[1]-a.p[1])*M.GEOREF.KM_PER_MAP*1000, e=f.track[b.ph], key=id+"@"+b.ph, r=REVIEW[key];
      let v,from=null,to=null,size=null,ev="",note="",flag="",was=null,kind=null;
      if(r){ [was,kind,from,to,ev,note,flag]=r; [v,size]=judge(kind,from,to,w); }
      else if(m<250){ v="minor"; note="under 250 m of movement"; }
      else if(b.ph===9){ v="nightfall"; note="the phase-9 (after dark) position; reached at 17:00"; ev="data.js:125"; }
      else { v="undetermined"; note="no timed statement about this action"; }
      const actPhase=v==="undetermined"&&!!e.act&&MOTION.test(e.act);
      rows.push({key,id,side:f.nation==="fr"?"fr":"al",ph:b.ph,from:a.ph,start:w[0],end:w[1],moveMin:b.moveMin||null,metres:Math.round(m),
        act:(e.act||"").slice(0,140),actLine:e.act?lineOf(e.act.slice(0,50)):"",verdict:v,was:was||v,kind,textFrom:from,textTo:to,size,evidence:ev||"",note:note||"",
        creep:flag==="creep"&&from!=null&&w[0]<=from-TOL,creepResolved:flag==="creep"&&!(from!=null&&w[0]<=from-TOL),actPhase,
        tm:b.tm||null,arrDerived:!!b.arrDerived,conflict:CONFLICTS.includes(key)});
    }); });
  return rows;
}
Object.assign(module.exports,{audit,REVIEW,REVIEW_CITES,ALLOW_TIMED,EXCLUDED_PATHS,CONFLICTS,CEILING_FLAGGED,FORCED_DATED,MOVEMIN_DERIVED,NEAR_CEILING});
if(require.main===module&&!["--evidence","--times","--check"].some(a=>process.argv.includes(a))){
  const rows=audit(), cnt=(f)=>rows.filter(f).length, V=["consistent","early","late","undetermined","minor","nightfall"];
  console.log("movement anchors: "+rows.length);
  console.log("  "+V.map(v=>v+" "+cnt(r=>r.verdict===v)).join(", ")+"; creep "+cnt(r=>r.creep)+"; undetermined whose act describes the move in its phase "+cnt(r=>r.actPhase));
  ["fr","al"].forEach(sd=>console.log("  "+sd+": "+V.map(v=>v+" "+cnt(r=>r.side===sd&&r.verdict===v)).join(", ")));
  const byPh={}; rows.forEach(r=>{ const o=byPh[r.ph]=byPh[r.ph]||{}; o[r.verdict]=(o[r.verdict]||0)+1; });
  Object.keys(byPh).forEach(ph=>console.log("  phase "+ph+" ("+P[ph].clock+"): "+V.filter(v=>byPh[ph][v]).map(v=>v+" "+byPh[ph][v]).join(", ")));
  const early=rows.filter(r=>r.verdict==="early").map(r=>r.size); early.sort((a,b)=>a-b);
  console.log("  early by (min): "+early.join(", ")+"; median "+early[Math.floor(early.length/2)]);
  rows.filter(r=>r.verdict==="early"||r.verdict==="late").forEach(r=>console.log("   "+r.key.padEnd(15)+" "+r.verdict+" "+r.size+" min | engine "+hm(r.start)+"-"+hm(r.end)+" | text "+(r.textFrom!=null?hm(r.textFrom):"")+(r.textTo!=null&&r.textTo!==r.textFrom?"-"+hm(r.textTo):"")+" | "+r.evidence));
  const md=process.argv.indexOf("--md"); if(md>0){
    const L=["| anchor | side | engine window (departure-arrival) | explicit time | moved m | act (shown during the anchor's phase) | text time | what the text dates | verdict | minutes | section M verdict | evidence (when section M was written) | note |","|---|---|---|---|---:|---|---|---|---|---:|---|---|---|"];
    const tt=v=>v==null?"":Array.isArray(v)?v.map(hm).join("-"):hm(v);
    rows.forEach(r=>L.push("| "+r.key+" | "+r.side+" | "+hm(r.start)+"-"+hm(r.end)+(r.moveMin?" (moveMin "+r.moveMin+")":"")+(r.arrDerived?" (arrival derived)":"")+" | "+
      (r.tm?[r.tm.dep!=null?"dep "+tt(r.tm.dep):"",r.tm.at!=null?"at "+tt(r.tm.at):""].filter(Boolean).join(", ")+", grade "+r.tm.gr:"-")+" | "+r.metres+" | "+(r.act?r.act.replace(/\|/g,"/")+" ("+r.actLine+")":"-")+" | "+
      (r.textFrom!=null?hm(r.textFrom):"")+(r.textTo!=null&&r.textTo!==r.textFrom?"-"+hm(r.textTo):(r.textFrom!=null&&r.textTo==null?" onward":""))+" | "+(r.kind||"-")+" | "+r.verdict+(r.creep?" (creep)":"")+(r.creepResolved?" (creep resolved)":"")+(r.actPhase?" (act in phase)":"")+(r.conflict?" (unresolved conflict)":"")+" | "+(r.size==null?"":r.size)+" | "+r.was+" | "+r.evidence+" | "+r.note+" |"));
    fs.writeFileSync(process.argv[md+1],L.join("\n")+"\n"); }
  const j=process.argv.indexOf("--json"); if(j>0) fs.writeFileSync(process.argv[j+1],JSON.stringify(rows,null,1));
}

if(require.main===module&&process.argv.includes("--evidence")){
  Object.entries(F).forEach(([id,f])=>{ if(!f.track) return; const A=X.anchorList(id);
    A.forEach((b,k)=>{ if(k===0||!b.p||!A[k-1].p) return; const a=A[k-1], w=X.legWindow(a,b), t0=P[b.ph].t0, t1=P[b.ph].t1;
      const mine=ST.filter(s=>s.forms.includes(id)&&s.a>=t0&&s.a<t1);
      const inWin=ST.filter(s=>s.forms.includes(id)&&s.a>=w[0]&&s.a<t0);
      console.log(id+"@"+b.ph+"  move "+hm(w[0])+"-"+hm(w[1])+"  | "+(f.track[b.ph].act||"").slice(0,90));
      mine.forEach(s=>console.log("   in phase: "+hm(s.a)+(s.b&&s.b!==s.a?"-"+hm(s.b):"")+(s.after?"+":"")+" ["+short(s.src,60)+" "+s.where+"] "+s.text.slice(0,110)));
      inWin.forEach(s=>console.log("   in window: "+hm(s.a)+(s.b&&s.b!==s.a?"-"+hm(s.b):"")+" ["+short(s.src,60)+" "+s.where+"] "+s.text.slice(0,110)));
    }); });
}

/* ---- explicit times: evidence resolved to file:line (decision 41) ---- */
function quoteAt(q){   /* the statement itself, never the tm entry that quotes it */
  for(const f of ["data.js","analysis.js"]){ const i=SRC[f].findIndex(l=>l.includes(q)&&!l.includes("tm:{")); if(i>=0) return f+":"+(i+1); }
  return null; }
function times(M){
  M=M||X; const out=[];
  Object.entries(M.FORMATIONS).forEach(([id,f])=>{ if(!f.track) return; M.anchorList(id).forEach((b,k,A)=>{ if(!b.tm) return; const tm=b.tm;
    const ev=(tm.ev||[]).map(q=>({q,at:quoteAt(q)}));
    const bad=[]; if(!ev.length) bad.push("no evidence"); ev.forEach(e=>{ if(!e.at) bad.push("evidence not found in the sources: "+e.q); });
    if(!/^[ABC]$/.test(tm.gr||"")) bad.push("no timing grade"); if(!/^(source|app narrative, unsourced)$/.test(tm.basis||"")) bad.push("no basis");
    const tt=v=>v==null?null:Array.isArray(v)?v.map(hm).join("-"):hm(v);
    out.push({key:id+"@"+b.ph,dep:tt(tm.dep),at:tt(tm.at),window:hm(b.w[0])+"-"+hm(b.w[1]),arrDerived:!!b.arrDerived,gr:tm.gr,basis:tm.basis,ev,note:tm.note||"",bad}); }); });
  return out;
}
module.exports.times=times;
if(require.main===module&&process.argv.includes("--times")){
  times().forEach(t=>{ console.log(t.key.padEnd(14)+" "+t.window+(t.arrDerived?" (arrival derived)":"")+" | dep "+(t.dep||"-")+", at "+(t.at||"-")+" | grade "+t.gr+" | "+t.basis);
    t.ev.forEach(e=>console.log("    "+(e.at||"NOT FOUND")+"  \""+e.q+"\""));
    t.bad.forEach(x=>console.log("    ! "+x)); });
}

/* ---- the regression (--check): every rule named in the header, on a loaded model (the live one, or a copy under test) ---- */
function parseCite(c){ const m=/^(.*\S) @(\d\d):(\d\d)(?:-(\d\d):(\d\d))?(\+)?$/.exec(String(c)); if(!m) return null;
  const a=+m[2]*60+ +m[3], b=m[4]!==undefined?+m[4]*60+ +m[5]:(m[6]?null:a); return {ref:m[1],a,b,after:!!m[6]}; }
function citeTimes(q){ return q.b!=null&&q.b!==q.a?[q.a,q.b]:[q.a]; }
function resolve(L,c){
  const q=parseCite(c); if(!q) return {err:"malformed cite \""+c+"\" (\"<ref> @HH:MM[-HH:MM][+]\")"};
  const refs=[...new Set(L.filter(s=>s.ref.startsWith(q.ref)).map(s=>s.ref))];
  let ref=refs.includes(q.ref)?q.ref:null;
  if(!ref){ const free=refs.filter(r=>{ const i=r.indexOf(": "); return i>=0&&q.ref.length>i+2; });
    if(!free.length) return {err:"no live statement is \""+q.ref+"\""+(q.ref.indexOf(": ")>=0?" or begins so":"")};
    if(free.length>1) return {err:"\""+q.ref+"\" is ambiguous: it begins "+free.length+" statements"};
    ref=free[0]; }
  const hits=L.filter(s=>s.ref===ref), s=hits.find(s=>s.a===q.a&&s.b===q.b&&s.after===q.after);
  if(!s) return {err:"\""+short(ref,60)+"\" ("+hits[0].where+") no longer carries "+tstr(q)+" (it carries "+[...new Set(hits.map(tstr))].join(", ")+")"};
  return {s,q};
}
function valueAt(M,p){ let v=M; for(const k of p.split(".")){ if(v==null) return undefined; v=v[k]; } return v; }
function checkModel(M){
  M=M||X; const bad=[], out=[], rows=audit(M), S=extract(M), L=S.filter(s=>!s.weak), INV=inventory();
  const key=s=>s.ref+" @"+tstr(s);
  /* the verdicts, the explicit times and the conflicts (since section M) */
  rows.filter(r=>(r.verdict==="early"||r.verdict==="late")&&!r.conflict).forEach(r=>bad.push(r.key+" is "+r.verdict+" by "+Math.abs(r.size)+" min (engine "+hm(r.start)+"-"+hm(r.end)+")"));
  const T=times(M); T.forEach(t=>t.bad.forEach(x=>bad.push(t.key+": "+x)));
  CONFLICTS.forEach(k=>{ if(!rows.find(r=>r.key===k)) bad.push("named conflict "+k+" is not an anchor"); });
  /* L1: every timed string literal and comment of data.js and analysis.js is read, or excluded by a class */
  const readPaths=new Set(S.map(s=>s.path).filter(Boolean)), classN=EXCLUDED_PATHS.map(()=>0); let timedN=0, readN=0;
  INV.items.forEach(it=>{ if(!timesIn(it.value).length) return; timedN++;
    if(!it.comment&&valueAt(M,it.path)!==it.value) bad.push("L1 "+it.where+" "+(it.path||"(no path)")+": the inventory's literal is not the model's value at that path: \""+short(it.value,50)+"\"");
    const c=EXCLUDED_PATHS.findIndex(([,re])=>re.test(it.path)); if(c>=0){ classN[c]++; return; }
    if(readPaths.has(it.path)) readN++; else bad.push("L1 "+it.where+" "+(it.path||"(no path)")+": a timed string the check does not read: \""+short(it.value,60)+"\""); });
  EXCLUDED_PATHS.forEach(([name,re,why],c)=>{ if(!classN[c]) bad.push("L1 the exclusion class \""+name+"\" ("+re+") covers no timed string: remove it"); if(!why) bad.push("L1 the exclusion class \""+name+"\" gives no reason"); });
  /* L3 and L5: every cite resolves; the two tables name the same movement anchors */
  const anchors=new Set(); Object.keys(M.FORMATIONS).filter(id=>M.FORMATIONS[id].track).forEach(id=>M.anchorList(id).forEach((b,k,A)=>{ if(k>0&&b.p&&A[k-1].p) anchors.add(id+"@"+b.ph); }));
  Object.keys(REVIEW).forEach(k=>{ if(!anchors.has(k)) bad.push("L5 REVIEW row "+k+" is not a movement anchor"); if(!REVIEW_CITES[k]) bad.push("L5 REVIEW row "+k+" has no REVIEW_CITES entry"); });
  Object.keys(REVIEW_CITES).forEach(k=>{ if(!REVIEW[k]) bad.push("L5 REVIEW_CITES names "+k+", which has no REVIEW row"); });
  const cited=new Map(), allowed=new Map(); let nCites=0;
  Object.entries(REVIEW_CITES).forEach(([k,a])=>a.forEach(c=>{ nCites++; const r=resolve(L,c); if(r.err) bad.push("L3 "+k+": "+r.err); else { const kk=key(r.s); cited.set(kk,(cited.get(kk)||[]).concat(k)); } }));
  Object.entries(ALLOW_TIMED).forEach(([c,why])=>{ if(!why) bad.push("L3 ALLOW_TIMED \""+c+"\" gives no reason");
    const r=resolve(L,c); if(r.err) bad.push("L3 ALLOW_TIMED: "+r.err+": remove or update the entry"); else allowed.set(key(r.s),c); });
  /* L2: every live timed statement is cited or allow-listed, not both */
  const live=new Map(); L.forEach(s=>{ if(!live.has(key(s))) live.set(key(s),s); });
  live.forEach((s,kk)=>{ if(!cited.has(kk)&&!allowed.has(kk)) bad.push("L2 "+s.where+" \""+short(s.ref,70)+"\" @"+tstr(s)+": a timed statement no REVIEW row cites (REVIEW_CITES) and ALLOW_TIMED does not name");
    if(cited.has(kk)&&allowed.has(kk)) bad.push("L2 \""+allowed.get(kk)+"\" is allow-listed but cited by "+cited.get(kk).join(", ")+": remove the ALLOW_TIMED entry"); });
  /* L4: a row's text times are times of what it cites; L4b: every cite inside its row's text times */
  Object.entries(REVIEW).forEach(([k,r])=>{ const kind=r[1], from=r[2], to=r[3]; if(!kind) return;
    const qs=(REVIEW_CITES[k]||[]).map(parseCite).filter(Boolean), ts=new Set(qs.flatMap(citeTimes));
    if(!ts.has(from)) bad.push("L4 "+k+": its text time "+hm(from)+" is not a time of the statements it cites");
    if(to!=null&&to!==from&&!ts.has(to)) bad.push("L4 "+k+": its text time "+hm(to)+" is not a time of the statements it cites");
    qs.forEach(q=>{ const qb=q.b==null?Infinity:q.b; if(qb<from||(to!=null&&q.a>to)) bad.push("L4b "+k+": cites \""+q.ref+"\" @"+tstr(q)+", outside its text times "+hm(from)+(to!=null?(to!==from?"-"+hm(to):""):" onward")); }); });
  /* L6: the phase clocks */
  M.PHASES.forEach((p,i)=>{ if(/\d/.test(p.clock||"")&&p.clock!==hm(p.t0)+" - "+hm(p.t1)) bad.push("L6 phase "+i+": its clock \""+p.clock+"\" is not "+hm(p.t0)+" - "+hm(p.t1)); });
  /* L8: each named conflict stays disclosed */
  CONFLICTS.forEach(k=>{ const r=REVIEW[k]; if(!r){ bad.push("L8 named conflict "+k+" has no REVIEW row"); return; }
    if(!(REVIEW_CITES[k]||[]).some(c=>{ const q=parseCite(c); return q&&q.ref.startsWith("source-note ")&&q.a===r[2]; })) bad.push("L8 named conflict "+k+": its row does not cite SOURCE_NOTE at its own time "+hm(r[2])); });
  /* D1: the derived arrivals, by rule and by name */
  const ids=Object.keys(M.FORMATIONS).filter(id=>M.FORMATIONS[id].track);
  const derived=[]; ids.forEach(id=>M.anchorList(id).forEach(b=>{ if(b.arrDerived) derived.push({key:id+"@"+b.ph,b}); }));
  derived.forEach(d=>{ const rule=d.b.arrRule, flagged=CEILING_FLAGGED.includes(d.key);
    if(rule==="ceiling"&&!flagged) bad.push(d.key+": derived arrival at the ceiling, not named in CEILING_FLAGGED");
    if(rule==="ceiling"&&!d.b.arrFlag) bad.push(d.key+": at the ceiling without a flag");
    if(flagged&&rule!=="ceiling") bad.push(d.key+": named in CEILING_FLAGGED but its arrival is "+rule);
    if(rule==="moveMin"&&!MOVEMIN_DERIVED[d.key]) bad.push("D1 "+d.key+": derived arrival at its own moveMin, not named in MOVEMIN_DERIVED (a derived arrival is at the tactical rate unless named)");
    if(!["tactical","ceiling","moveMin"].includes(rule)) bad.push("D1 "+d.key+": derived arrival by an unknown rule "+rule); });
  CEILING_FLAGGED.forEach(k=>{ if(!derived.find(d=>d.key===k)) bad.push("flagged leg "+k+" has no derived arrival"); });
  Object.entries(MOVEMIN_DERIVED).forEach(([k,why])=>{ const d=derived.find(d=>d.key===k);
    if(!why) bad.push("D1 MOVEMIN_DERIVED "+k+" gives no reason");
    if(!d||d.b.arrRule!=="moveMin") bad.push("D1 "+k+": named in MOVEMIN_DERIVED but its arrival is "+(d?d.b.arrRule:"not derived")); });
  /* F1 and F2: the legs at 80% of their ceiling or more */
  const forced=[], near=[];
  ids.forEach(id=>{ const f=M.FORMATIONS[id], A=M.anchorList(id), ceil=M.SPEED_CEIL[f.arm]||5.0;
    A.forEach((b,k)=>{ if(!k||!b.p||!A[k-1].p) return; const a=A[k-1], w=M.legWindow(a,b);
      const km=M.legPath(a,b).len*M.GEOREF.KM_PER_MAP, min=w[1]-w[0], share=min>0?km/(min/60)/ceil:Infinity, kk=id+"@"+b.ph;
      if(share>=NEAR_SHARE){ near.push({key:kk,share}); if(!b.arrDerived&&a.tm&&a.tm.at!=null) forced.push(kk); } }); });
  forced.filter(k=>!FORCED_DATED.includes(k)).forEach(k=>bad.push("F1 "+k+": a dated leg forced to 80% of its ceiling or more, not named in FORCED_DATED"));
  FORCED_DATED.filter(k=>!forced.includes(k)).forEach(k=>bad.push("F1 "+k+": named in FORCED_DATED but no longer a dated leg at 80% of its ceiling or more"));
  near.filter(n=>!CEILING_FLAGGED.includes(n.key)&&!FORCED_DATED.includes(n.key)&&!NEAR_CEILING[n.key]).forEach(n=>bad.push("F2 "+n.key+": at "+Math.round(n.share*100)+"% of its ceiling, named nowhere (CEILING_FLAGGED, FORCED_DATED, NEAR_CEILING)"));
  Object.entries(NEAR_CEILING).forEach(([k,why])=>{ if(!why) bad.push("F2 NEAR_CEILING "+k+" gives no reason");
    if(!near.find(n=>n.key===k)) bad.push("F2 "+k+": named in NEAR_CEILING but below 80% of its ceiling");
    if(CEILING_FLAGGED.includes(k)||FORCED_DATED.includes(k)) bad.push("F2 "+k+": named in NEAR_CEILING and in CEILING_FLAGGED or FORCED_DATED"); });
  /* M1: the movement audit, on world.js's cover (built once per model) */
  if(!M.__coverBuilt){ M.buildCover(); M.__coverBuilt=true; }
  const mv=M.auditMovement(); mv.forEach(p=>bad.push("M1 movement audit: "+p.id+" "+p.leg+" "+p.why+(p.why==="rate"?" ("+p.kmh.toFixed(2)+" km/h over "+p.ceil+")":"")));
  /* the report */
  const early=rows.filter(r=>r.verdict==="early"), late=rows.filter(r=>r.verdict==="late"), withText=rows.filter(r=>r.kind);
  out.push("chronology: "+withText.length+" moves with a timed statement: "+rows.filter(r=>r.kind&&r.verdict==="consistent").length+" consistent, "+
    early.length+" early, "+late.length+" late; unresolved conflicts (decision 42, allowed by name): "+CONFLICTS.map(k=>{ const r=rows.find(q=>q.key===k); return k+" "+(r?r.verdict:"?"); }).join(", ")+
    "; explicit times "+T.length);
  const rowsCiting=Object.values(REVIEW_CITES).filter(a=>a.length).length, nCited=[...live.keys()].filter(k=>cited.has(k)).length, nAllowed=[...live.keys()].filter(k=>allowed.has(k)).length;
  out.push("timed statements: "+live.size+" (data.js and analysis.js; "+timedN+" timed strings and comments, "+readN+" read, "+classN.reduce((a,b)=>a+b,0)+" excluded by class: "+
    EXCLUDED_PATHS.map(([name],c)=>classN[c]+" "+name).join(", ")+")");
  out.push("  cited "+nCited+" by "+rowsCiting+" of "+Object.keys(REVIEW).length+" REVIEW rows ("+nCites+" cites), allow-listed "+nAllowed+" (ALLOW_TIMED, "+Object.keys(ALLOW_TIMED).length+" entries)");
  out.push("derived arrivals: "+derived.map(d=>d.key+" "+hm(d.b.w[0])+"-"+hm(d.b.w[1])+" "+d.b.arrRule+(d.b.arrFlag?" (flagged: "+d.b.arrFlag+")":"")+(MOVEMIN_DERIVED[d.key]?" (named in MOVEMIN_DERIVED)":"")).join("; "));
  out.push("forced dated legs: "+forced.join(", ")+"; at 80% of the ceiling or more: "+near.length+" ("+near.map(n=>n.key+" "+Math.round(n.share*1000)/10+"%").join(", ")+")"+(bad.some(x=>/^F[12] /.test(x))?"":", each named"));
  out.push("movement audit (auditMovement: rate, crossings, explicit times): "+mv.length+" findings");
  out.push("still open (a dating question, waiting on the sources): the ceiling-flagged legs "+CEILING_FLAGGED.join(", ")+"; the dated legs forced near the ceiling "+FORCED_DATED.join(", ")+"; the unresolved conflicts "+CONFLICTS.join(", "));
  return {bad,out};
}
module.exports.checkModel=checkModel; module.exports.MODEL_EXTRA=MODEL_EXTRA;
if(require.main===module&&process.argv.includes("--check")){
  const {bad,out}=checkModel(X);
  out.forEach(l=>console.log(l));
  console.log("errors: "+bad.length); bad.forEach(x=>console.log("  ! "+x));
  process.exitCode=bad.length?1:0;
}
