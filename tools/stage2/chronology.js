#!/usr/bin/env node
/* Stage 2 Part A, section M: the chronology audit. Reads the live data; changes nothing.
   node tools/stage2/chronology.js [--md out.md] [--json out.json] [--evidence] [--times] [--check]
   --times  every explicit anchor time (tm, owner decisions 40-41): window, grade, basis, and each evidence quote resolved
            to its current file:line;
   --check  the regression (npm run check:chronology): exits 1 if any move with a timed statement is early or late, other
            than the unresolved conflicts named in CONFLICTS; if any explicit time lacks evidence, grade or basis, or quotes
            text that is not in the sources; or if the movement audit reports a timing or march-rate finding.

   For every anchor (a track entry with a position) of every formation:
   - the engine's movement window: legWindow(previous anchor, anchor) (app.js), i.e. from the previous anchor's phase start
     (or moveMin before the anchor's phase start) to the anchor's phase start, PHASES[ph].t0, when the anchor is reached;
   - every timed statement about the formation in the app's own data: phase timelines ("c. 11:45 ...") and ledes, EVENTS
     (by their forms list and by names), the anchors' act / obj text, formation notes, analysis chapters (their text and the
     clock each chapter sets), tour stops (text and clock), features, the command-knowledge text, and comments in data.js;
     since the chronology data task an anchor may carry its own time (tm.at, tm.dep), and legWindow returns the real window;
   - a statement is attached to the anchor whose phase contains its time (the reading that an anchor's text describes its
     phase); REVIEW below records, by hand, for each attached statement whether it describes the anchor's action, and the
     verdict with its evidence.
   Verdicts: consistent (the text's time falls in the engine's window, +-5 min); early (the engine arrives before the text
   says the movement or action happens; size = text time - arrival); late (the engine is still moving after the text says it
   arrived); undetermined (no timed statement about this action). Sizes in minutes. */
const {load}=require("./model.js"), fs=require("fs"), path=require("path");
const X=load(), F=X.FORMATIONS, P=X.PHASES;
const ROOT=path.resolve(__dirname,"..","..");
const SRC={}; ["data.js","analysis.js","app.js"].forEach(f=>SRC[f]=fs.readFileSync(path.join(ROOT,f),"utf8").split("\n"));
function lineOf(text,files){ const probe=String(text).slice(0,60); for(const f of files||["data.js","analysis.js"]){ const i=SRC[f].findIndex(l=>l.includes(probe)); if(i>=0) return f+":"+(i+1); } return "?"; }
const hm=t=>{ const h=Math.floor(t/60), m=Math.round(t%60); return (h<10?"0":"")+h+":"+(m<10?"0":"")+m; };
const leaves=id=>X.leavesOf(id,[]);
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
/* times in free text: "08:45", "13:00-14:00", "about 08:30-09:00", "a quarter to nine", "seven o'clock", "after 11:00" */
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
  return out.filter(x=>x.a>=180&&x.a<=1140);
}
/* ---- the statements ---- */
const ST=[];
function add(src,where,text,times,forms,extra){ times.forEach(t=>ST.push(Object.assign({src,where,text:String(text).slice(0,220),a:t.a,b:t.b,after:!!t.after,forms:[...forms]},extra||{}))); }
P.forEach((ph,i)=>{
  (ph.events||[]).forEach(([lab,txt])=>{ let tt=[]; const m=/^(after\s+)?(\d{1,2}):(\d{2})(?:\s*[-–]\s*(\d{1,2}):(\d{2}))?/.exec(lab.replace(/^c\.\s*/,""));
    if(m){ const a=+m[2]*60+ +m[3]; tt=[m[1]?{a,b:null,after:true}:{a,b:m[4]?+m[4]*60+ +m[5]:a}]; }
    add("phase "+i+" timeline",lineOf(txt),lab+" "+txt,tt,namesIn(txt)); });
  add("phase "+i+" lede",lineOf(ph.lede),ph.lede,timesIn(ph.lede),namesIn(ph.lede));
});
X.EVENTS.forEach(e=>{ const f=new Set((e.forms||[]).flatMap(leaves)); namesIn(e.n+" "+(e.why||"")).forEach(i=>f.add(i));
  const t=Array.isArray(e.t)?{a:e.t[0],b:e.t[1]}:{a:e.t,b:e.t}; add("event "+e.id,lineOf('id:"'+e.id+'"',["analysis.js"]),e.n,[t],f,{kind:e.kind}); });
Object.entries(F).forEach(([id,f])=>{
  ["note","role","strengthNote"].forEach(k=>{ if(f[k]) add("formation "+id+" "+k,lineOf(f[k].slice(0,50)),f[k],timesIn(f[k]),new Set([...leaves(id),...namesIn(f[k])])); });
  if(f.track) Object.entries(f.track).forEach(([ph,e])=>{ ["act","obj"].forEach(k=>{ if(e[k]) add("anchor "+id+"@"+ph+" "+k,lineOf(e[k].slice(0,50)),e[k],timesIn(e[k]),new Set([id])); }); });
});
X.ANALYSIS.forEach(c=>{ const f=new Set((c.forms||[]).flatMap(leaves)); add("chapter "+c.id+" (clock)",lineOf('id:"'+c.id+'"',["analysis.js"]),c.n,[{a:c.t,b:c.t}],f,{weak:true});
  add("chapter "+c.id+" text",lineOf((c.text||"").slice(0,50),["analysis.js"]),c.text||"",timesIn(c.text||""),namesIn(c.text||"")); });
X.TOUR.forEach((s,k)=>{ add("tour stop "+(k+1)+" (clock)",lineOf(s.x.slice(0,50),["analysis.js"]),s.n,[{a:s.t,b:s.t}],namesIn(s.x),{weak:true});
  add("tour stop "+(k+1)+" text",lineOf(s.x.slice(0,50),["analysis.js"]),s.x,timesIn(s.x),namesIn(s.x)); });
X.FEATURES.forEach(ft=>{ const txt=[ft.sub,ft.story,...(ft.why||[]),...(ft.facts||[]).map(q=>q.join(": "))].join(" "); add("feature "+ft.id,lineOf('id:"'+ft.id+'"'),txt,timesIn(txt),namesIn(txt)); });
Object.entries(X.COMMAND).forEach(([sd,byPh])=>Object.entries(byPh).forEach(([ph,rows])=>rows.forEach(r=>add("command "+sd+"@"+ph,lineOf(r[2].slice(0,50),["analysis.js"]),r[2],timesIn(r[2]),namesIn(r[2])))));
SRC["data.js"].forEach((l,i)=>{ const c=/\/\*(.*?)\*\//.exec(l); if(c&&/track|timing|\d{1,2}:\d{2}/.test(c[1])&&/\d{1,2}:\d{2}/.test(c[1])){ const idm=/^\s*(\w+):\{/.exec(l); add("comment data.js:"+(i+1),"data.js:"+(i+1),c[1],timesIn(c[1]),namesIn(c[1])); } });
/* the comment on Przybyszewski's phase-8 anchor names no formation: attach it to prz by its line */
ST.filter(s=>s.src==="comment data.js:496").forEach(s=>s.forms=["prz"]);
module.exports={ST,X,hm,lineOf,namesIn,timesIn};

/* ---- the review: what each timed statement dates, recorded by hand (docs/STAGE2_SPEC.md section M) ----
   [the verdict section M recorded (frozen, for comparison), kind, text time from, text time to (minutes; null = open),
    evidence (file:line when section M was written), note, flag].
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
 "guard_cav@6":["early","during",T(11,45),T(11,45),"data.js:104; analysis.js:299; analysis.js:38","Rapp's counter-charge c. 11:45; the engine arrives 11:15. The texts disagree: the event's window starts 11:15 (analysis.js:299) and the chapter's clock is 11:20 (analysis.js:38)"],
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
 "prz@8":["consistent","during",T(14),T(14,30),"data.js:496; analysis.js:319","written for the engine's rule: holds until surrounded c. 14:00, then 14:10-14:30"],
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
/* the three internal disagreements of section M (owner decision 42): settled against the sources, or left unresolved,
   keeping today's timing, when the sources could not be read. Kamensky's drive off the crest (kamensky@4) is dated by the
   same timeline entry as his turn, so it stays with that conflict. */
const CONFLICTS=["dok@1","guard_cav@6","kamensky@3","kamensky@4"];
/* 2C precondition (docs/STAGE2_SPEC.md section M.13): derived arrivals that keep the march-rate ceiling, flagged, by name.
   The two climbs and Bagration's withdrawal are a dating question (the Kamensky passage; nightfall), not a rate one:
   they wait on the sources. The dated legs forced near the ceiling by a following default stay open too. Any other
   derived arrival at the ceiling, or one of these moving off it, fails --check. */
const CEILING_FLAGGED=["sthilaire@3","vandamme@3","bag@8"];
const FORCED_DATED=["c_gren@8","kollo@5"];
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
function audit(){
  const rows=[];
  Object.entries(F).forEach(([id,f])=>{ if(!f.track) return; const A=X.anchorList(id);
    A.forEach((b,k)=>{ if(k===0||!b.p||!A[k-1].p) return; const a=A[k-1], w=X.legWindow(a,b);
      const m=Math.hypot(b.p[0]-a.p[0],b.p[1]-a.p[1])*X.GEOREF.KM_PER_MAP*1000, e=f.track[b.ph], key=id+"@"+b.ph, r=REVIEW[key];
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
module.exports.audit=audit; module.exports.REVIEW=REVIEW; module.exports.CONFLICTS=CONFLICTS; module.exports.CEILING_FLAGGED=CEILING_FLAGGED;
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
  const anchorsOut=[];
  Object.entries(F).forEach(([id,f])=>{ if(!f.track) return; const A=X.anchorList(id);
    A.forEach((b,k)=>{ if(k===0||!b.p||!A[k-1].p) return; const a=A[k-1], w=X.legWindow(a,b), t0=P[b.ph].t0, t1=P[b.ph].t1;
      const mine=ST.filter(s=>s.forms.includes(id)&&s.a>=t0&&s.a<t1);
      const inWin=ST.filter(s=>s.forms.includes(id)&&s.a>=w[0]&&s.a<t0);
      console.log(id+"@"+b.ph+"  move "+hm(w[0])+"-"+hm(w[1])+"  | "+(f.track[b.ph].act||"").slice(0,90));
      mine.forEach(s=>console.log("   in phase: "+hm(s.a)+(s.b&&s.b!==s.a?"-"+hm(s.b):"")+(s.after?"+":"")+" ["+s.src+" "+s.where+"] "+s.text.slice(0,110)));
      inWin.forEach(s=>console.log("   in window: "+hm(s.a)+(s.b&&s.b!==s.a?"-"+hm(s.b):"")+" ["+s.src+" "+s.where+"] "+s.text.slice(0,110)));
    }); });
}

/* ---- explicit times: evidence resolved to file:line (decision 41) ---- */
function quoteAt(q){   /* the statement itself, never the tm entry that quotes it */
  for(const f of ["data.js","analysis.js"]){ const i=SRC[f].findIndex(l=>l.includes(q)&&!l.includes("tm:{")); if(i>=0) return f+":"+(i+1); }
  return null; }
function times(){
  const out=[];
  Object.entries(F).forEach(([id,f])=>{ if(!f.track) return; X.anchorList(id).forEach((b,k,A)=>{ if(!b.tm) return; const tm=b.tm;
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
if(require.main===module&&process.argv.includes("--check")){
  const rows=audit(), bad=[];
  rows.filter(r=>(r.verdict==="early"||r.verdict==="late")&&!r.conflict).forEach(r=>bad.push(r.key+" is "+r.verdict+" by "+Math.abs(r.size)+" min (engine "+hm(r.start)+"-"+hm(r.end)+")"));
  times().forEach(t=>t.bad.forEach(x=>bad.push(t.key+": "+x)));
  CONFLICTS.forEach(k=>{ if(!rows.find(r=>r.key===k)) bad.push("named conflict "+k+" is not an anchor"); });
  const ids=Object.keys(F).filter(id=>F[id].track);
  /* derived arrivals: the tactical rate (a design value) or the ceiling, flagged by name */
  const derived=[]; ids.forEach(id=>X.anchorList(id).forEach(b=>{ if(b.arrDerived) derived.push({key:id+"@"+b.ph,b}); }));
  derived.forEach(d=>{ const flagged=CEILING_FLAGGED.includes(d.key);
    if(d.b.arrRule==="ceiling"&&!flagged) bad.push(d.key+": derived arrival at the ceiling, not named in CEILING_FLAGGED");
    if(d.b.arrRule==="ceiling"&&!d.b.arrFlag) bad.push(d.key+": at the ceiling without a flag");
    if(flagged&&d.b.arrRule!=="ceiling") bad.push(d.key+": named in CEILING_FLAGGED but its arrival is "+d.b.arrRule); });
  CEILING_FLAGGED.forEach(k=>{ if(!derived.find(d=>d.key===k)) bad.push("flagged leg "+k+" has no derived arrival"); });
  /* the movement audit, as the suites run it, is checked by audit.js and selfTest; here only the explicit-time rules */
  const early=rows.filter(r=>r.verdict==="early"), late=rows.filter(r=>r.verdict==="late"), withText=rows.filter(r=>r.kind);
  console.log("chronology: "+withText.length+" moves with a timed statement: "+rows.filter(r=>r.kind&&r.verdict==="consistent").length+" consistent, "+
    early.length+" early, "+late.length+" late; unresolved conflicts (decision 42, allowed by name): "+CONFLICTS.map(k=>{ const r=rows.find(q=>q.key===k); return k+" "+(r?r.verdict:"?"); }).join(", ")+
    "; explicit times "+times().length);
  console.log("derived arrivals: "+derived.map(d=>d.key+" "+hm(d.b.w[0])+"-"+hm(d.b.w[1])+" "+d.b.arrRule+(d.b.arrFlag?" (flagged: "+d.b.arrFlag+")":"")).join("; "));
  console.log("still open (a dating question, waiting on the sources): the ceiling-flagged legs "+CEILING_FLAGGED.join(", ")+"; the dated legs forced near the ceiling "+FORCED_DATED.join(", ")+"; the unresolved conflicts "+CONFLICTS.join(", "));
  console.log("errors: "+bad.length); bad.forEach(x=>console.log("  ! "+x));
  process.exitCode=bad.length?1:0;
}
