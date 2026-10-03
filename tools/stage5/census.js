#!/usr/bin/env node
/* Stage 5 Part A (docs/STAGE5_SPEC.md): the evidence the data already carries, counted in node from the live sources through
   tools/stage2/model.js (the model, not the scene). It reads; it changes no source file and bundles nothing.
   node tools/stage5/census.js [--json f] [--md f]

   1. grades: every leaf formation on the field, every 10 clock minutes, by its position grade as the app computes it (confAt:
      the anchor's cf carried forward, an interpolated position graded no better than the weaker anchor), with men; per phase
      at its start, middle and end; which formations never carry an explicit cf (stateAt's default "B").
   2. anchors and legs: per formation and in all, by grade; the legs' windows (the minutes a formation is between anchors);
      the timing evidence (tm): grade, basis, derived arrivals and their rule.
   3. events: instants and intervals, their lengths, how many overlap at each minute, their own cf and claim.
   4. knowledge: the Command view's reading of every enemy formation from each headquarters every 10 minutes, computed
      without the page's cache (knowledgeOf's rule: KNOW_OVERRIDE, else line of sight from the headquarters' plotted position
      and the fog rule), by source (override or computed); COMMAND's statements by kind and source.
   5. plans: each PLANS column against the tracks of the formations it names (the largest and the final distance between the
      ordered route and the executed track), and the four Allied "axis" arrows of OVERLAYS phase 0 against the PLANS routes of
      the same columns.
   6. day-tracks: each leaf formation's day as a polyline (anchors and vias): its extent (km), length, number of anchors, the
      shortest leg.
   7. data structure: duplicate keys in the object literals of data.js and analysis.js (the later value wins in JavaScript). */
const fs=require("fs"), path=require("path"), acorn=require("acorn");
const {load,ROOT,read}=require("../stage2/model.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const OUTJ=opt("--json")||path.join(ROOT,"docs","stage5-evidence","census.json");
const OUTM=opt("--md")||path.join(ROOT,"docs","stage5-evidence","census.md");
const X=load(["stateAt","GRADE_RANK","worseGrade","confAt","T_MAX","evWindow","evWeight","EYE_OBSERVER_M","hasLOS","SPEED_CEIL","phaseAt"]);
const {FORMATIONS,PHASES,EVENTS,OVERLAYS,PLANS,KNOW_OVERRIDE,COMMAND,GEOREF}=X;
const KM=GEOREF.KM_PER_MAP, T0=PHASES[0].t0, T1=PHASES[PHASES.length-1].t1;
const leaves=Object.keys(FORMATIONS).filter(id=>FORMATIONS[id].track);
const phaseAt=X.phaseAt, side=id=>FORMATIONS[id].nation==="fr"?"fr":"al";
const on=(id,t)=>!X.notYetAt(id,t)&&!X.goneAt(id,t)&&!!X.posAtClock(id,t);
const r1=v=>Math.round(v*10)/10, r2=v=>Math.round(v*100)/100, r3=v=>Math.round(v*1000)/1000;
const out={when:new Date().toISOString(),leaves:leaves.length};

/* 1. grades */
const G=[]; const perPhase={};
for(let t=T0;t<=T1;t+=10){ const ph=phaseAt(t), row={t,ph,A:0,B:0,C:0,interp:0,menA:0,menB:0,menC:0,on:0};
  leaves.forEach(id=>{ if(!on(id,t)) return; const c=X.confAt(id,t); row.on++; row[c.cf]++; if(c.interp) row.interp++; row["men"+c.cf]+=FORMATIONS[id].strength||0; });
  G.push(row); }
out.gradesEvery10=G;
PHASES.forEach((p,i)=>{ const at=[p.t0,Math.round((p.t0+p.t1)/2),p.t1-1].map(t=>{ const r={t,A:0,B:0,C:0,interp:0,on:0,ids:{A:[],B:[],C:[]}};
  leaves.forEach(id=>{ if(!on(id,t)) return; const c=X.confAt(id,t); r.on++; r[c.cf]++; r.ids[c.cf].push(id+(c.interp?"*":"")); if(c.interp) r.interp++; }); return r; });
  perPhase[i]={label:p.label,clock:p.clock,start:at[0],mid:at[1],end:at[2]}; });
out.gradesPerPhase=perPhase;
const fm={A:0,B:0,C:0,interp:0,all:0};
G.forEach(r=>{ fm.A+=r.A; fm.B+=r.B; fm.C+=r.C; fm.interp+=r.interp; fm.all+=r.on; });
out.formationSamples=fm;
out.neverExplicitCf=leaves.filter(id=>!Object.values(FORMATIONS[id].track).some(e=>e.cf));
out.gradeChangesWithoutMove=[];   /* a cf on a track entry with no p: the grade changes while the position is carried forward */
leaves.forEach(id=>Object.keys(FORMATIONS[id].track).forEach(ph=>{ const e=FORMATIONS[id].track[ph]; if(e.cf&&!("p" in e)) out.gradeChangesWithoutMove.push(id+"@"+ph+":"+e.cf); }));

/* 2. anchors, legs, timing */
const A={anchors:0,byGrade:{A:0,B:0,C:0},legs:0,legsWithVia:0,tm:0,tmBy:{A:0,B:0,C:0},basis:{},derived:0,rule:{},flag:0,legMinutes:0,anchorsPer:{}};
leaves.forEach(id=>{ const L=X.anchorList(id).filter(a=>a.p!==null); A.anchorsPer[id]=L.length;
  L.forEach((a,i)=>{ A.anchors++; const s=X.stateAt(id,a.ph); A.byGrade[s?s.cf:"B"]++;
    if(a.tm){ A.tm++; A.tmBy[a.tm.gr]=(A.tmBy[a.tm.gr]||0)+1; A.basis[a.tm.basis]=(A.basis[a.tm.basis]||0)+1; }
    if(a.arrDerived){ A.derived++; A.rule[a.arrRule]=(A.rule[a.arrRule]||0)+1; } if(a.arrFlag) A.flag++;
    if(i>0){ A.legs++; if(a.via) A.legsWithVia++; const w=X.legWindow(L[i-1],a); A.legMinutes+=Math.max(0,w[1]-w[0]); } }); });
A.legMinutesShare=null;
let onMin=0; for(let t=T0;t<T1;t++) leaves.forEach(id=>{ if(on(id,t)) onMin++; });
A.formationMinutesOnField=onMin; A.legMinutesShare=r3(A.legMinutes/onMin);
out.anchors=A;

/* 3. events */
const EV=EVENTS.map(e=>{ const w=X.evWindow(e); return {id:e.id,t0:w[0],t1:w[1],len:w[1]-w[0],cf:e.cf,claim:e.claim,side:e.side}; });
let maxOv=0, maxAt=null; for(let t=T0;t<=T1;t++){ const n=EV.filter(e=>t>=e.t0&&t<=e.t1).length; if(n>maxOv){ maxOv=n; maxAt=t; } }
out.events={n:EV.length,instants:EV.filter(e=>!e.len).length,intervals:EV.filter(e=>e.len).length,
  intervalLengths:EV.filter(e=>e.len).map(e=>[e.id,e.len]).sort((a,b)=>b[1]-a[1]),maxConcurrentIntervals:maxOv,at:maxAt,
  byCf:EV.reduce((o,e)=>(o[e.cf]=(o[e.cf]||0)+1,o),{}),list:EV};

/* 4. knowledge (the rule of knowledgeOf, computed per clock with no cache) */
function know(cv,id,t){ const ph=phaseAt(t); if(side(id)===cv) return "own";
  const ov=KNOW_OVERRIDE[cv]&&KNOW_OVERRIDE[cv][id];
  if(ov){ let r="seen"; for(let i=ov.length-1;i>=0;i--) if(ph>=ov[i][0]){ r=ov[i][1]; break; } return "o:"+r; }
  const hq=X.posAtClock(cv==="fr"?"gqg":"ahq",t), p=X.posAtClock(id,t);
  if(!hq||!p) return "c:unknown"; if(!X.hasLOS(hq,p)) return "c:unknown";
  if(PHASES[ph].mist>0.5&&X.hAt(p[0],p[1])<-0.8) return "c:uncertain"; return "c:seen"; }
const K={fr:[],al:[]};
["fr","al"].forEach(cv=>{ for(let t=T0;t<=T1;t+=10){ const r={t,ph:phaseAt(t)};
  leaves.forEach(id=>{ if(side(id)===cv||!on(id,t)) return; const k=know(cv,id,t); r[k]=(r[k]||0)+1; }); K[cv].push(r); } });
out.knowledge=K;
/* within a phase, how often the reading at each clock differs from the reading at the phase's first clock (the page caches per phase) */
const stale={fr:0,al:0,samples:{fr:0,al:0},examples:[]};
["fr","al"].forEach(cv=>PHASES.forEach((p,ph)=>{ const first={};
  for(let t=p.t0;t<p.t1;t+=10) leaves.forEach(id=>{ if(side(id)===cv||!on(id,t)) return; const k=know(cv,id,t);
    if(first[id]===undefined){ first[id]=k; return; } stale.samples[cv]++; if(k!==first[id]){ stale[cv]++; if(stale.examples.length<12) stale.examples.push(cv+" "+id+" "+t+": "+first[id]+" -> "+k); } }); }));
out.knowledgeWithinPhase=stale;
const cmd={}; ["fr","al"].forEach(s=>{ cmd[s]={}; Object.keys(COMMAND[s]||{}).forEach(ph=>(COMMAND[s][ph]||[]).forEach(it=>{ const k=it[0]+"/"+it[1]; cmd[s][k]=(cmd[s][k]||0)+1; })); });
out.command=cmd; out.overrides={fr:Object.keys(KNOW_OVERRIDE.fr).length,al:Object.keys(KNOW_OVERRIDE.al).length};
out.hqPositions={gqg:X.anchorList("gqg").map(a=>[a.ph,a.p,X.stateAt("gqg",a.ph).cf]),ahq:X.anchorList("ahq").map(a=>[a.ph,a.p,X.stateAt("ahq",a.ph).cf])};

/* 5. plans */
function segDist(p,a,b){ const dx=b[0]-a[0], dy=b[1]-a[1], L=dx*dx+dy*dy||1, u=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L)); return Math.hypot(p[0]-a[0]-u*dx,p[1]-a[1]-u*dy); }
function polyDist(p,P){ let m=1e9; for(let i=1;i<P.length;i++) m=Math.min(m,segDist(p,P[i-1],P[i])); return m; }
const PL=[];
["al","fr"].forEach(sd=>PLANS[sd].cols.forEach(c=>{ const row={side:sd,n:c.n,routeKm:0,forms:[]};
  for(let i=1;i<c.route.length;i++) row.routeKm+=Math.hypot(c.route[i][0]-c.route[i-1][0],c.route[i][1]-c.route[i-1][1])*KM;
  row.routeKm=r2(row.routeKm);
  (c.forms||[]).forEach(fid=>{ if(!FORMATIONS[fid]||!FORMATIONS[fid].track){ row.forms.push({id:fid,tracked:false}); return; }
    let mx=0, endD=null, endT=null, n=0, within1km=0;
    for(let t=T0;t<=T1;t+=10){ if(!on(fid,t)) continue; const p=X.posAtClock(fid,t), d=polyDist(p,c.route)*KM; n++; if(d<=1) within1km++; if(d>mx) mx=d; endD=Math.hypot(p[0]-c.obj[0],p[1]-c.obj[1])*KM; endT=t; }
    row.forms.push({id:fid,tracked:true,maxFromRouteKm:r2(mx),shareWithin1km:n?r2(within1km/n):null,lastFromObjectiveKm:endD===null?null:r2(endD),last:endT}); });
  PL.push(row); }));
out.plans=PL;
const AX=OVERLAYS[0].arrows.filter(a=>a.kind==="axis"), MAP={"I Column":"1st Column","II Column":"2nd Column","III Column":"3rd Column","IV Column":"4th Column"};
out.axisVsPlan=AX.map(a=>{ const key=Object.keys(MAP).find(k=>a.label.indexOf(k)===0), col=PLANS.al.cols.find(c=>c.n.indexOf(MAP[key])===0);
  if(!col) return {label:a.label,col:null};
  const dA=Math.max(...a.pts.map(p=>polyDist(p,col.route)))*KM, dB=Math.max(...col.route.map(p=>polyDist(p,a.pts)))*KM;
  const endA=a.pts[a.pts.length-1], endB=col.route[col.route.length-1];
  return {label:a.label,plan:col.n,axisPts:a.pts.length,planPts:col.route.length,hausdorffKm:r2(Math.max(dA,dB)),axisOffRouteKm:r2(dA),endsApartKm:r2(Math.hypot(endA[0]-endB[0],endA[1]-endB[1])*KM)}; });

/* 6. day-tracks */
out.dayTracks=leaves.map(id=>{ const L=X.anchorList(id).filter(a=>a.p!==null); const pts=[]; let len=0, shortest=null;
  L.forEach((a,i)=>{ if(i===0){ pts.push(a.p); return; } const pp=X.legPath(L[i-1],a); pp.pts.slice(1).forEach(q=>pts.push(q)); const km=pp.len*KM; len+=km; if(km>0.02&&(shortest===null||km<shortest)) shortest=km; });
  const xs=pts.map(p=>p[0]), ys=pts.map(p=>p[1]), w=(Math.max(...xs)-Math.min(...xs))*KM, h=(Math.max(...ys)-Math.min(...ys))*KM;
  const grades=L.map(a=>X.stateAt(id,a.ph).cf).join("");
  return {id,name:FORMATIONS[id].name,anchors:L.length,distinctPlaces:new Set(L.map(a=>a.p.join(","))).size,extentKm:[r2(w),r2(h)],lengthKm:r2(len),shortestLegKm:shortest===null?null:r2(shortest),grades}; });

/* 7. duplicate keys */
function dups(file){ const src=read(file), ast=acorn.parse(src,{ecmaVersion:2020,locations:true}), res=[];
  (function walk(n){ if(!n||typeof n.type!=="string") return;
    if(n.type==="ObjectExpression"){ const seen={}; n.properties.forEach(p=>{ const k=p.key&&(p.key.name||p.key.value); if(k===undefined) return; if(seen[k]) res.push(file+":"+p.loc.start.line+" "+k+" (also line "+seen[k]+")"); else seen[k]=p.loc.start.line; }); }
    for(const k in n){ const v=n[k]; if(Array.isArray(v)) v.forEach(walk); else if(v&&typeof v.type==="string") walk(v); } })(ast);
  return res; }
out.duplicateKeys=[].concat(dups("data.js"),dups("analysis.js"));

fs.mkdirSync(path.dirname(OUTJ),{recursive:true}); fs.writeFileSync(OUTJ,JSON.stringify(out,null,1));

/* the markdown summary */
const M=["# Stage 5 Part A: the evidence census\n","`node tools/stage5/census.js` on the live sources (the model in node, `tools/stage2/model.js`). Fact: counted from the data and the app's own functions; nothing is changed.\n",
 "## Grades per phase (leaf formations on the field at the phase's start · middle · last minute; A/B/C, * interpolated)\n","| phase | start A/B/C (interp) | middle | end |","|---|---|---|---|"];
PHASES.forEach((p,i)=>{ const P=perPhase[i], f=r=>r.A+"/"+r.B+"/"+r.C+" ("+r.interp+")"; M.push("| "+i+" "+p.label+" ("+p.clock+") | "+f(P.start)+" | "+f(P.mid)+" | "+f(P.end)+" |"); });
M.push("\nFormation-samples every 10 minutes over the day: "+fm.all+"; A "+fm.A+" ("+(100*fm.A/fm.all).toFixed(1)+"%), B "+fm.B+" ("+(100*fm.B/fm.all).toFixed(1)+"%), C "+fm.C+" ("+(100*fm.C/fm.all).toFixed(1)+"%); interpolated "+fm.interp+" ("+(100*fm.interp/fm.all).toFixed(1)+"%).");
M.push("Formations with no explicit cf anywhere (graded B by stateAt's default): "+(out.neverExplicitCf.join(", ")||"none")+".");
M.push("Grade set on an entry with no position (the grade changes, the position is carried): "+(out.gradeChangesWithoutMove.join(", ")||"none")+".\n");
M.push("## Anchors, legs and timing\n","Anchors "+A.anchors+" (A "+A.byGrade.A+", B "+A.byGrade.B+", C "+A.byGrade.C+"); legs "+A.legs+" ("+A.legsWithVia+" with vias); leg minutes "+A.legMinutes+" of "+onMin+" formation-minutes on the field ("+(100*A.legMinutesShare).toFixed(1)+"%).");
M.push("Explicit timing (tm): "+A.tm+" anchors; grade "+JSON.stringify(A.tmBy)+"; basis "+JSON.stringify(A.basis)+"; derived arrivals "+A.derived+" "+JSON.stringify(A.rule)+", flagged "+A.flag+".\n");
M.push("## Events\n",out.events.n+" events: "+out.events.instants+" instants, "+out.events.intervals+" intervals; at most "+maxOv+" windows open at once (at "+maxAt+" min). Interval lengths (min): "+out.events.intervalLengths.map(x=>x[0]+" "+x[1]).join(", ")+". Event cf: "+JSON.stringify(out.events.byCf)+".\n");
M.push("## Knowledge (every 10 minutes; o: an override in KNOW_OVERRIDE, c: computed by line of sight and the fog rule)\n");
["fr","al"].forEach(cv=>{ const tot={}; K[cv].forEach(r=>Object.keys(r).forEach(k=>{ if(k!=="t"&&k!=="ph") tot[k]=(tot[k]||0)+r[k]; })); M.push("- "+(cv==="fr"?"French headquarters on the Allies":"Allied headquarters on the French")+": "+JSON.stringify(tot)); });
M.push("- within a phase, the reading at a later clock differs from the phase's first in "+stale.fr+" of "+stale.samples.fr+" French and "+stale.al+" of "+stale.samples.al+" Allied samples (the page caches per phase). Examples: "+stale.examples.slice(0,6).join("; "));
M.push("- COMMAND statements: "+JSON.stringify(cmd)+"; KNOW_OVERRIDE entries: "+JSON.stringify(out.overrides)+".\n");
M.push("## Plans against the tracks\n","| side | column | route km | formation: largest distance from the route (km), share of samples within 1 km, last distance from the objective (km) |","|---|---|---|---|");
PL.forEach(r=>M.push("| "+r.side+" | "+r.n+" | "+r.routeKm+" | "+r.forms.map(f=>f.tracked?f.id+": "+f.maxFromRouteKm+", "+f.shareWithin1km+", "+f.lastFromObjectiveKm:f.id+": not tracked").join("; ")+" |"));
M.push("\nThe phase-0 axis arrows (OVERLAYS) against the PLANS routes of the same columns:");
out.axisVsPlan.forEach(a=>M.push("- "+a.label+" vs "+a.plan+": "+a.axisPts+" and "+a.planPts+" points, the axis arrow at most "+a.axisOffRouteKm+" km off the plan route, the largest distance between them "+a.hausdorffKm+" km, their ends "+a.endsApartKm+" km apart"));
M.push("\n## Day-tracks\n","| formation | anchors (places) | extent km | length km | shortest leg km | grades |","|---|---|---|---|---|---|");
out.dayTracks.forEach(d=>M.push("| "+d.id+" | "+d.anchors+" ("+d.distinctPlaces+") | "+d.extentKm.join(" x ")+" | "+d.lengthKm+" | "+(d.shortestLegKm===null?"-":d.shortestLegKm)+" | "+d.grades+" |"));
M.push("\n## Duplicate keys in the data's object literals\n",(out.duplicateKeys.length?out.duplicateKeys.map(x=>"- "+x).join("\n"):"none"));
fs.writeFileSync(OUTM,M.join("\n")+"\n");
console.log(M.join("\n"));
