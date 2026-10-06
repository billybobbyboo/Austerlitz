#!/usr/bin/env node
/* Stage 7 Part A (docs/STAGE7_SPEC.md section 2): every sentence an opening could show, with its file and line, its words, its reading
   time at stated rates (design values), what it states (times, figures, quotations), and which suite already reads it.
   node tools/stage7/text-inventory.js [--json f] [--md f]
   Reads the sources as text and evaluates data.js and analysis.js as test.js does; writes nothing to a source file. Measurement only:
   nothing here is the Stage 7 design. */
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(__dirname,"..","..");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const SRC={}; ["data.js","analysis.js","app.js","shell.html","sim-test.js","terrain-test.js","test.js","redteam.js","runtime-test.js","tools/stage2/chronology.js"]
  .forEach(f=>SRC[f]=fs.readFileSync(path.join(ROOT,f),"utf8"));
global.GEOREF=require(path.join(ROOT,"geo.js"));
const X=(function(){ eval(SRC["data.js"]); eval(SRC["analysis.js"]); return {PHASES,EVENTS,ANALYSIS,TOUR,ACTS,SOURCE_NOTE,PLANS}; })();

/* the line of a string in a file: its first 48 characters as written there (the sources keep straight quotes; a few use \u escapes) */
function lineOf(file,s){ const src=SRC[file], k=String(s).slice(0,48); let i=src.indexOf(k);
  if(i<0){ const esc=k.replace(/[\u2018\u2019]/g,"\\u2019").replace(/[\u201C\u201D]/g,m=>m==="\u201C"?"\\u201c":"\\u201d"); i=src.indexOf(esc); }
  return i<0?null:src.slice(0,i).split("\n").length; }
const words=s=>String(s).trim().split(/\s+/).filter(Boolean).length;
/* reading rates, words a minute: design values for the measurement (section 3 states them), not findings */
const WPM=[160,200,238];
const secs=(w,r)=>+(w/r*60).toFixed(1);
/* what a sentence states that the opening must not add to or alter: clock times, numbers, quotation marks */
function states(s){ const t=String(s);
  return {times:(t.match(/\b\d{1,2}:\d{2}\b|a quarter to \w+|\w+ o'clock|about noon|noon/gi)||[]),
          figures:(t.match(/\b\d[\d,.]*\b(?!:)/g)||[]).filter(x=>!/^\d{1,2}$/.test(x)||/per cent/.test(t)),
          numberWords:(t.match(/\b(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|sixteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand)\b/gi)||[]),
          quotes:(t.match(/["\u201C\u201D'][^"\u201C\u201D]{3,}["\u201C\u201D]/g)||[])}; }

/* the suites that read each kind of text (fact: read from the suites; the line is where the check is) */
const READ={
  guard:"check:data (tools/visual/data-invariance.js): the declaration byte-identical to archive/stage6b-7fc0f6c3.html",
  redteam:"redteam.js section 6: overclaim scan (no certainty words; causal language warned) and section 6b: the 37 retired phrases absent",
  chron:"check:chronology (tools/stage2/chronology.js): its clock times read as timed statements and audited against the engine",
  testMoment:"test.js: the moment resolves to a phase or an event, the clock on the day, the chapter exists, only stop 4 keeps its own clock",
  spine:"the self-test's spine checks (app.js): every theme and stop resolves to its moments; stop 7 follows its theme",
  runtime:"runtime-test.js: every stop applied forward and back, and the tour finished",
  sim4:"sim-test.js 2b: stop 4's two figures (about 39,000 and about 19,000) recomputed from the plateau reading, within 600",
  terr5:"terrain-test.js: stop 5's two shares (about 73 per cent, under 3 per cent) recomputed from the viewshed",
  fr108:"the self-test's first-run check (app.js, decision 108): four phrases pinned, the swatches the drawing colours, no coat named as a nation's",
  test105:"test.js (decision 105): SOURCE_NOTE's open questions kept while the appearance table does not settle them",
  sim3:"sim-test.js 3: the acts cover every phase, contiguously and in order (the act's phases, not its line)"
};
const ROWS=[];
function row(kind,id,file,text,reads,extra){ const w=words(text);
  ROWS.push(Object.assign({kind,id,file,line:lineOf(file,text),words:w,secs:Object.fromEntries(WPM.map(r=>[r,secs(w,r)])),states:states(text),reads,text},extra||{})); }

X.TOUR.forEach((s,i)=>{ const r=["guard","redteam","chron","testMoment","spine","runtime"];
  if(i===3) r.push("sim4"); if(i===4) r.push("terr5");
  row("tour stop",(i+1)+" "+s.n,"analysis.js",s.x,r,{at:s.at,t:s.t,chapter:s.chapter||null,plan:s.plan||null,feature:s.feature||null,cam:!!s.cam,title:s.n,titleLine:lineOf("analysis.js",'n:"'+s.n+'"')}); });
X.ANALYSIS.forEach(c=>row("theme",c.id+" "+c.n,"analysis.js",c.text,["guard","redteam","chron","testMoment","spine"],{at:c.at}));
X.PHASES.forEach(p=>{ row("phase lede",p.id+" "+p.title,"data.js",p.lede,["guard","redteam","chron"],{t0:p.t0});
  (p.events||[]).forEach(e=>row("phase timeline line",p.id+" "+e[0],"data.js",e[1],["guard","chron"],{label:e[0]})); });
X.ACTS.forEach(a=>row("act line",a.id+" "+a.n,"analysis.js",a.line,["guard","sim3"]));
X.EVENTS.forEach(e=>{ if(e.why) row("event why",e.id+" "+e.n,"analysis.js",e.why,["guard","redteam","chron"],{t:e.t}); });
X.SOURCE_NOTE.body.forEach((b,i)=>row("SOURCE_NOTE body",String(i+1),"data.js",b,["guard"].concat(i===5?["test105"]:[])));
/* the first-run card: written by paintKey from COLOUR_KEY (app.js), with a static copy in shell.html; not guarded data */
const fk=/p\.innerHTML="French formations are marked in "/.exec(SRC["app.js"]);
row("first-run key","the card's key","app.js","French formations are marked in blue and the Allies in amber: on their names, their counters and the ground beneath them, and on the movement arrows. The high ground in the centre is the Pratzen plateau, and it decides the battle.",["fr108"],
  {line:fk?SRC["app.js"].slice(0,fk.index).split("\n").length:null,shellLine:lineOf("shell.html","French formations are marked in blue and the Allies")});
row("first-run hint","the card's hint","shell.html","Drag to move the map, right-drag to turn it, scroll to zoom, and click any formation to see who it was and what it was doing.",[]);

/* the tour's whole reading: the nine stops, and the subsets section 3 measures */
const T=ROWS.filter(r=>r.kind==="tour stop");
const SUB={"all nine":[1,2,3,4,5,6,7,8,9],"1, 6, 7":[1,6,7],"1, 6, 7, 8":[1,6,7,8],"1, 4, 6, 7, 8":[1,4,6,7,8],"1, 3, 6, 7":[1,3,6,7]};
const subsets=Object.entries(SUB).map(([k,ix])=>{ const w=ix.reduce((a,i)=>a+T[i-1].words,0); return {stops:k,words:w,secs:Object.fromEntries(WPM.map(r=>[r,secs(w,r)]))}; });
/* the retired phrases and the overclaim pattern, applied here to every row, as redteam.js applies them to its subset */
const RET=(/const RETIRED=\[([\s\S]*?)\];/.exec(SRC["redteam.js"])||[])[1]; const RETIRED=RET?eval("["+RET+"]"):[];
const BANNED=/\b(certainly|undoubtedly|proves|proven|definitely|always|never doubted|obviously)\b/i;
ROWS.forEach(r=>{ r.retiredFound=RETIRED.filter(p=>r.text.indexOf(p)>=0); r.overclaim=BANNED.test(r.text)?r.text.match(BANNED)[0]:null; });
const out={wpm:WPM,rows:ROWS,subsets,retired:RETIRED.length,readers:READ};
const J=opt("--json"), M=opt("--md");
if(J) fs.writeFileSync(J,JSON.stringify(out,null,1));
if(M){ const L=["# Stage 7 Part A: the text inventory","","`node tools/stage7/text-inventory.js` (no page). Reading times at "+WPM.join(", ")+" words a minute: design values, not findings.","",
  "## Who reads what","",...Object.entries(READ).map(([k,v])=>"- `"+k+"`: "+v),"",
  "## Every row","","| kind | id | file:line | words | s at 200 | times | figures | read by |","|---|---|---|---|---|---|---|---|",
  ...ROWS.map(r=>"| "+r.kind+" | "+r.id.replace(/\|/g,"/")+" | "+r.file+":"+r.line+" | "+r.words+" | "+r.secs[200]+" | "+(r.states.times.join("; ")||"-")+" | "+(r.states.figures.concat(r.states.numberWords).join("; ")||"-")+" | "+r.reads.join(", ")+" |"),
  "","## The tour's subsets","","| stops | words | s at 160 | s at 200 | s at 238 |","|---|---|---|---|---|",
  ...subsets.map(s=>"| "+s.stops+" | "+s.words+" | "+s.secs[160]+" | "+s.secs[200]+" | "+s.secs[238]+" |"),
  "","Retired phrases found in any row: "+ROWS.reduce((a,r)=>a+r.retiredFound.length,0)+"; overclaim words: "+ROWS.filter(r=>r.overclaim).map(r=>r.kind+" "+r.id+" ("+r.overclaim+")").join(", ")||"none"];
  fs.writeFileSync(M,L.join("\n")+"\n"); }
console.log(ROWS.length+" rows; tour "+T.map(r=>r.words).join("/")+" words; subsets "+subsets.map(s=>s.stops+": "+s.words+" w, "+s.secs[200]+" s at 200").join("; "));
console.log("overclaim words: "+(ROWS.filter(r=>r.overclaim).map(r=>r.kind+" "+r.id+" ("+r.overclaim+")").join(", ")||"none")+"; retired phrases found: "+ROWS.reduce((a,r)=>a+r.retiredFound.length,0));
