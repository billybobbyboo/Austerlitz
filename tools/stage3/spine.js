#!/usr/bin/env node
/* Stage 3 Part A (docs/STAGE3_SPEC.md section C): how the day's structures relate today. Reads the live data through
   tools/stage2/model.js; changes nothing; bundles nothing.
   node tools/stage3/spine.js [--md out.md] [--json out.json]

   The structures: PHASES (10, with their timeline lines, PHASES[].events), ACTS (5, grouping phases), EVENTS (25),
   ANALYSIS (the chapters: 10), TOUR (the guided tour's stops). For each phase: its act, its window, the EVENTS whose window
   starts in it or runs into it, its own timeline lines, the chapters and the tour stops whose clock falls in it. Then the
   places where two structures say different things about the same moment:
   - a tour stop against the chapter, plan or feature it reuses (clock, camera);
   - a chapter's or tour stop's camera against the phase camera it copies (identical arrays), and the phase its clock is in;
   - interval EVENTS that cross a phase or act boundary;
   - every clock time stated in a text (the chronology audit's own parser, copied from tools/stage2/chronology.js) against the
     clock the text is shown at: a phase's lede and timeline, an act's line, a chapter's text, a tour stop's text;
   - EVENTS and phase timeline lines that name the same moment (same formation names, times within 30 min), and those that
     have no counterpart. The matching is a heuristic; its output is reviewed by hand in the specification. */
const {load}=require("../stage2/model.js"), fs=require("fs");
const X=load(), P=X.PHASES, A=X.ACTS, E=X.EVENTS, C=X.ANALYSIS, T=X.TOUR;
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const hm=t=>{ if(t==null) return "-"; const h=Math.floor(t/60), m=Math.round(t%60); return (h<10?"0":"")+h+":"+(m<10?"0":"")+m; };
const win=e=>Array.isArray(e.t)?e.t:[e.t,e.t];
const phaseAt=t=>{ for(let i=P.length-1;i>=0;i--) if(t>=P[i].t0) return i; return 0; };
const actOf=ph=>A.find(a=>a.phases.includes(ph));
const camEq=(a,b)=>a&&b&&a.length===b.length&&a.every((v,i)=>v===b[i]);
const phaseCam=cam=>{ const i=P.findIndex(p=>camEq(p.cam,cam)); return i; };
/* since the spine data task, a theme and a stop name a moment ("ph:<n>" or "ev:<id>") instead of a clock and camera of their own:
   resolved here as the app resolves them (app.js momentOf, chapterCam, stopCam), so the report reads either data */
const mom=m=>{ const k=String(m||""), i=k.indexOf(":"), kind=k.slice(0,i), id=k.slice(i+1);
  if(kind==="ph") return P[+id]?{t:P[+id].t0,ph:+id}:null;
  const e=E.find(x=>x.id===id); return e?{t:win(e)[0],ph:phaseAt(win(e)[0])}:null; };
C.forEach(c=>{ if(c.t===undefined&&c.at){ const r=mom(c.at); c.t=r.t; if(!c.cam) c.cam=P[r.ph].cam; } });
T.forEach(st=>{ if(st.at){ const r=mom(st.at); if(st.t===undefined) st.t=r.t; if(!st.cam){ const c=st.chapter?C.find(x=>x.id===st.chapter):null; st.cam=c?c.cam:P[r.ph].cam; } } });
/* times in free text: the parser of tools/stage2/chronology.js (timesIn), unchanged */
const WORD={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12};
const hr=h=>h<4?h+12:h;
function timesIn(text){
  const out=[]; let m; const t=String(text);
  const reI=/(\d{1,2}):(\d{2})\s*[-–]\s*(\d{1,2}):(\d{2})/g; while((m=reI.exec(t))) out.push({a:+m[1]*60+ +m[2],b:+m[3]*60+ +m[4]});
  const stripped=t.replace(reI," ");
  const reP=/(after\s+)?(\d{1,2}):(\d{2})/g; while((m=reP.exec(stripped))){ const v=+m[2]*60+ +m[3]; out.push(m[1]?{a:v,b:null,after:true}:{a:v,b:v}); }
  const reQ=/(a quarter to|quarter to|a quarter past|quarter past|half past)\s+(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)/gi;
  while((m=reQ.exec(t))){ const h=hr(WORD[m[2].toLowerCase()]), k=m[1].toLowerCase(); const v=/to/.test(k)?h*60-15:/half/.test(k)?h*60+30:h*60+15; out.push({a:v,b:v,words:m[0]}); }
  const reO=/(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve) o'clock/gi; while((m=reO.exec(t))){ const v=hr(WORD[m[1].toLowerCase()])*60; out.push({a:v,b:v,words:m[0]}); }
  const reN=/\b(noon|midday)\b/gi; while((m=reN.exec(t))) out.push({a:720,b:720,words:m[0]});
  return out.filter(x=>x.a>=0&&x.a<=1440);
}
const labTime=lab=>{ const m=/^(c\.\s*)?(after\s+)?(\d{1,2}):(\d{2})(?:\s*[-–]\s*(\d{1,2}):(\d{2}))?/.exec(lab); if(!m) return null;
  const a=+m[3]*60+ +m[4]; return {a,b:m[5]?+m[5]*60+ +m[6]:a,after:!!m[2]}; };
/* proper names in a text (capitalised words of 4+ letters, not sentence-initial common words): for the heuristic match */
const STOP=new Set("The This That With From Their There When Where Every Each Behind Between Without Allied Allies French Russian Austrian Napoleon's About Some After Before Against North South East West Guard Column Columns Division Brigade Corps".split(" "));
const names=s=>new Set((String(s).match(/\b[A-Z][a-zà-ž'’\-]{3,}/g)||[]).map(w=>w.replace(/['’]s$/,"")).filter(w=>!STOP.has(w)));

const R={counts:{phases:P.length,phaseLines:P.reduce((n,p)=>n+(p.events||[]).length,0),acts:A.length,events:E.length,chapters:C.length,tour:T.length},phases:[],findings:[]};
const F=(kind,where,text)=>R.findings.push({kind,where,text});

/* ---- per phase ---- */
P.forEach((p,i)=>{
  const act=actOf(i);
  const evStart=E.filter(e=>phaseAt(win(e)[0])===i).map(e=>e.id+" "+(Array.isArray(e.t)?hm(e.t[0])+"-"+hm(e.t[1]):hm(e.t)));
  const evInto=E.filter(e=>{ const w=win(e); return w[0]<p.t0&&w[1]>p.t0; }).map(e=>e.id);
  const lines=(p.events||[]).map(([lab])=>lab);
  const ch=C.filter(c=>phaseAt(c.t)===i).map(c=>c.id+" "+hm(c.t));
  const tr=T.map((s,k)=>({s,k})).filter(o=>phaseAt(o.s.t)===i).map(o=>(o.k+1)+" "+hm(o.s.t));
  R.phases.push({ph:i,act:act?act.id:null,label:p.label,title:p.title,t0:p.t0,t1:p.t1,clock:p.clock,eventsStarting:evStart,eventsRunningInto:evInto,timeline:lines,chapters:ch,tour:tr});
});

/* ---- the tour against what it reuses ---- */
T.forEach((s,k)=>{
  const where="TOUR["+k+"] (stop "+(k+1)+", \""+s.n+"\")", ph=phaseAt(s.t), pc=phaseCam(s.cam);
  if(s.chapter){ const c=C.find(x=>x.id===s.chapter);
    if(!c) F("tour-ref",where,"chapter "+s.chapter+" not found");
    else { if(c.t!==s.t) F("tour-clock",where,"stop clock "+hm(s.t)+" (phase "+ph+") but its chapter \""+c.id+"\" sets "+hm(c.t)+" (phase "+phaseAt(c.t)+")");
      if(!camEq(c.cam,s.cam)) F("tour-cam",where,"stop camera differs from its chapter \""+c.id+"\"'s"); } }
  if(pc>=0&&pc!==ph) F("tour-cam-phase",where,"camera is phase "+pc+"'s ("+P[pc].label+"), clock "+hm(s.t)+" is in phase "+ph+" ("+P[ph].label+")");
  if(pc<0) F("tour-cam-own",where,"camera is its own (no phase's), clock "+hm(s.t)+" in phase "+ph);
  timesIn(s.x).forEach(t=>{ const inPh=phaseAt(t.a); if(inPh!==ph) F("tour-text-time",where,"text says "+(t.words||hm(t.a))+(t.b&&t.b!==t.a?"-"+hm(t.b):"")+" (phase "+inPh+"); shown at "+hm(s.t)+" (phase "+ph+")"); });
});
/* ---- chapters ---- */
C.forEach(c=>{
  const where="ANALYSIS \""+c.id+"\" (\""+c.n+"\")", ph=phaseAt(c.t), pc=phaseCam(c.cam);
  if(pc>=0&&pc!==ph) F("chapter-cam-phase",where,"camera is phase "+pc+"'s ("+P[pc].label+"), clock "+hm(c.t)+" is in phase "+ph+" ("+P[ph].label+")");
  if(pc<0) F("chapter-cam-own",where,"camera is its own, clock "+hm(c.t)+" in phase "+ph);
  timesIn(c.text).forEach(t=>{ const a=phaseAt(t.a), b=t.b!=null?phaseAt(t.b):a; if(a!==ph||b!==ph) F("chapter-text-time",where,"text says "+(t.words||hm(t.a)+(t.b!=null&&t.b!==t.a?"-"+hm(t.b):""))+" (phase "+a+(b!==a?"-"+b:"")+"); set at "+hm(c.t)+" (phase "+ph+")"); });
});
/* ---- acts ---- */
A.forEach(a=>{ timesIn(a.line).forEach(t=>F("act-text-time","ACTS \""+a.id+"\"","line states "+hm(t.a))); });
const covered=A.flatMap(a=>a.phases).sort((x,y)=>x-y); if(covered.join()!==P.map((_,i)=>i).join()) F("acts","ACTS","acts do not cover the phases once each: "+covered.join());
/* ---- interval events across boundaries ---- */
E.forEach(e=>{ const w=win(e); if(w[0]===w[1]) return; const a=phaseAt(w[0]), b=phaseAt(w[1]-0.01);
  if(a!==b){ const aa=actOf(a).id, ab=actOf(b).id; F(aa!==ab?"event-crosses-act":"event-crosses-phase","EVENTS \""+e.id+"\"",hm(w[0])+"-"+hm(w[1])+": phases "+a+"-"+b+(aa!==ab?", acts "+aa+" / "+ab:"")); } });
/* ---- phase ledes and timeline lines against their phase ---- */
P.forEach((p,i)=>{
  (p.events||[]).forEach(([lab,txt])=>{ const t=labTime(lab); if(!t) return; if(t.a<p.t0-0.5||t.a>=p.t1+0.5) F("phase-line-outside","PHASES["+i+"] timeline",lab+" is outside "+hm(p.t0)+"-"+hm(p.t1)+": \""+txt.slice(0,70)+"...\""); });
  timesIn(p.lede).forEach(t=>{ if(t.a<p.t0||t.a>p.t1) F("phase-lede-outside","PHASES["+i+"] lede","states "+(t.words||hm(t.a))+", outside "+hm(p.t0)+"-"+hm(p.t1)); });
});
/* ---- EVENTS against the phase timeline lines (heuristic) ---- */
const LINES=[]; P.forEach((p,i)=>(p.events||[]).forEach(([lab,txt],k)=>LINES.push({ph:i,k,lab,txt,t:labTime(lab),nm:names(txt)})));
const pairs=[], evMatched=new Set(), lnMatched=new Set();
/* each EVENT against its best line: the most shared names, then the nearest time (within 30 min) */
E.forEach(e=>{ const w=win(e), nm=names(e.n+" "+(e.why||"")); let best=null;
  LINES.forEach((l,j)=>{ if(!l.t) return; const d=l.t.a<w[0]?w[0]-l.t.a:l.t.a>w[1]?l.t.a-w[1]:0; if(d>30) return;
    const shared=[...nm].filter(x=>l.nm.has(x)); if(!shared.length) return;
    if(!best||shared.length>best.shared.length||(shared.length===best.shared.length&&d<best.apart)) best={j,l,apart:d,shared}; });
  if(best){ pairs.push({event:e.id,eventTime:Array.isArray(e.t)?hm(w[0])+"-"+hm(w[1]):hm(e.t),line:"phase "+best.l.ph+" \""+best.l.lab+"\"",lineTime:hm(best.l.t.a),apart:best.apart,shared:best.shared});
    evMatched.add(e.id); lnMatched.add(best.j); } });
R.eventLinePairs=pairs;
R.eventsWithoutLine=E.filter(e=>!evMatched.has(e.id)).map(e=>e.id);
R.linesWithoutEvent=LINES.filter((l,j)=>!lnMatched.has(j)).map(l=>"phase "+l.ph+" \""+l.lab+"\" "+l.txt.slice(0,60));
/* the same moment, different clocks: a pair whose times differ at all */
pairs.filter(p=>p.apart>0).forEach(p=>F("event-vs-line",p.event,"event "+p.eventTime+", "+p.line+" at "+p.lineTime+" ("+p.apart+" min apart; shared: "+p.shared.join(", ")+")"));

/* ---- output ---- */
if(opt("--json")) fs.writeFileSync(opt("--json"),JSON.stringify(R,null,1));
const md=[];
md.push("# The day's structures today (tools/stage3/spine.js)\n");
md.push("Counts: "+Object.entries(R.counts).map(([k,v])=>k+" "+v).join(", ")+".\n");
md.push("| phase | act | window | label / title | EVENTS starting in it | running into it | its timeline lines | chapters | tour stops |");
md.push("|---|---|---|---|---|---|---|---|---|");
R.phases.forEach(r=>md.push("| "+r.ph+" | "+r.act+" | "+hm(r.t0)+"-"+hm(r.t1)+" | "+r.label+" / "+r.title+" | "+(r.eventsStarting.join("; ")||"-")+" | "+(r.eventsRunningInto.join(", ")||"-")+" | "+(r.timeline.join("; ")||"-")+" | "+(r.chapters.join("; ")||"-")+" | "+(r.tour.join("; ")||"-")+" |"));
md.push("\n## Where they disagree or do not line up\n");
const kinds=[...new Set(R.findings.map(f=>f.kind))];
kinds.forEach(k=>{ md.push("**"+k+"**\n"); R.findings.filter(f=>f.kind===k).forEach(f=>md.push("- "+f.where+": "+f.text)); md.push(""); });
md.push("## EVENTS and phase timeline lines (heuristic match: a shared proper name, times within 30 min)\n");
md.push("| event | its time | line | line time | apart (min) | shared names |"); md.push("|---|---|---|---|---:|---|");
pairs.forEach(p=>md.push("| "+p.event+" | "+p.eventTime+" | "+p.line+" | "+p.lineTime+" | "+p.apart+" | "+p.shared.join(", ")+" |"));
md.push("\nEVENTS with no timeline line: "+(R.eventsWithoutLine.join(", ")||"none")+".\n");
md.push("Timeline lines with no EVENT:\n"); R.linesWithoutEvent.forEach(l=>md.push("- "+l));
const out=md.join("\n")+"\n";
if(opt("--md")) fs.writeFileSync(opt("--md"),out); else process.stdout.write(out);
