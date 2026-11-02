// Count the timed and placed claims the ledger samples from; read-only.
// usage: node tools/audit-post8/sources-chronology/coverage.js ROOT
const fs=require("fs"),vm=require("vm"),path=require("path");
const ROOT=process.argv[2]||path.resolve(__dirname,"../../..");
const ctx={};vm.createContext(ctx);
for(const f of ["data.js","analysis.js","narrative.js"]) vm.runInContext(fs.readFileSync(path.join(ROOT,f),"utf8"),ctx);
vm.runInContext("this.__F=FORMATIONS;this.__P=PHASES;this.__E=EVENTS;",ctx);
const F=ctx.__F,P=ctx.__P,E=ctx.__E;
let anchors=0,pos=0,tm=0,tmByGr={},graded={},act=0;
for(const id of Object.keys(F)){const t=F[id].track||{};for(const k of Object.keys(t)){anchors++;const e=t[k];if(e.p)pos++;if(e.cf)graded[e.cf]=(graded[e.cf]||0)+1;if(e.act)act++;if(e.tm){tm++;tmByGr[e.tm.gr]=(tmByGr[e.tm.gr]||0)+1;}}}
let lines=0,clocked=0;for(const p of P){for(const l of (p.events||[])){lines++;if(/^c\.\s*\d|^\d\d:\d\d/.test(l[0]||""))clocked++;}}
let ev=E.length,evT=E.filter(e=>typeof e.t==="number").length,evW=E.filter(e=>e.t0!=null||e.t1!=null||e.win||e.w).length;
const claims={};for(const e of E){claims[e.claim]=(claims[e.claim]||0)+1;}
console.log(JSON.stringify({formations:Object.keys(F).length,anchors,positioned:pos,explicitPosGrades:graded,withAct:act,timedAnchors:tm,timedByGrade:tmByGr,phases:P.length,phaseLines:lines,phaseLinesWithClock:clocked,events:ev,eventsWithT:evT,eventClaimPills:claims},null,1));
