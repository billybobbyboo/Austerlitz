#!/usr/bin/env node
/* Stage 2 Part A, section M: what each timing remedy would do to the derived readings. Changes nothing.
   node tools/stage2/chronology-sim.js [--json out.json]
   The model is loaded as the suites load it (the generated helpers _clock.js, _derived.js, _events.js and _world_mod.js,
   regenerated first from the live sources by tools/mk-helpers.js and tools/mk-world-mod.js). The engine's leg timing is
   then replaced by a variant, and the readings the suites and the self-test check are recomputed:
     today   legWindow as it is: a leg ends at the start of its anchor's phase (the check: must reproduce today exactly);
     a-end   remedy (a): an anchor is reached at the END of its phase (moveMin keeps "holds, then marches");
     a-mid   remedy (a): an anchor is reached half-way through its phase;
     b-shift remedy (b), sketched: today's rule, and each anchor the audit found early is moved later by its measured
             offset (chronology.js REVIEW), later legs pushed back, keeping their duration, where they would overlap.
   Readings: march-rate audit (legs over their arm's ceiling, fastest per arm); event agreement as sim-test.js checks it
   (a named formation within 1.0 km, or the event's written tolerance, across its window); the plateau statistic and centre
   separation at the sim-test marks and the tour stop 4 figures; the Command view's knowledge model (seen / uncertain /
   unknown per side at each phase's midpoint); formations named by an event but not on the field at its time (redteam);
   displacement of every formation at the harness cases' clocks. */
const fs=require("fs"), path=require("path"), cp=require("child_process");
const ROOT=path.resolve(__dirname,"..",".."); process.chdir(ROOT);
cp.execSync("node tools/mk-helpers.js && node tools/mk-world-mod.js",{stdio:"ignore"});
const acorn=require("acorn");
const M=require(path.join(ROOT,"_world_mod.js"));
global.W=M.W; global.height=M.height; global.hAt=M.hAt; global.smoothstep=M.smoothstep;
global.covAt=M.covAt; global.SATS=M.SATS; global.MENI=M.MENI; global.VILLAGES=M.VILLAGES;
M.buildCover(); M.buildGrid();
Object.defineProperty(global,'covWater',{get:()=>M.covWater}); Object.defineProperty(global,'covRoad',{get:()=>M.covRoad});
Object.defineProperty(global,'covMarsh',{get:()=>M.covMarsh});
global.GEOREF=require(path.join(ROOT,"geo.js"));
eval(fs.readFileSync('data.js','utf8'));
eval(fs.readFileSync('analysis.js','utf8'));
global.leavesOf=function(id,out){out=out||[];const f=FORMATIONS[id];if(f.track)out.push(id);if(f.children)f.children.forEach(k=>leavesOf(k,out));return out;};
eval(fs.readFileSync('_clock.js','utf8'));
global.units={}; Object.keys(FORMATIONS).forEach(id=>{ if(FORMATIONS[id].track) units[id]={}; });
global.clock=T_MIN;
eval(fs.readFileSync('_derived.js','utf8'));
eval(fs.readFileSync('_events.js','utf8'));
/* the knowledge model and line of sight, taken from app.js by name */
const KSRC=(function(){ const src=fs.readFileSync('app.js','utf8'), ast=acorn.parse(src,{ecmaVersion:2020}), out=[];
  const want=new Set(["EYE_OBSERVER_M,EYE_TARGET_M,LOS_CLEAR_M","hasLOS","knowCache,knowKey","knowledgeOf"]);
  ast.body.forEach(n=>{ const k=n.type==="FunctionDeclaration"?n.id.name:n.type==="VariableDeclaration"?n.declarations.map(d=>d.id.name).join(","):null;
    if(want.has(k)) out.push(src.slice(n.start,n.end)); }); return out.join("\n"); })();
eval(KSRC);
var commandView="none", curPhase=0;
const {audit,REVIEW}=require("./chronology.js");
const hm=t=>{ const h=Math.floor(t/60), m=Math.round(t%60); return (h<10?"0":"")+h+":"+(m<10?"0":"")+m; };
const origLegAt=legAt;
/* ---- variants: a timing function per leg, then a generic legAt ---- */
const EARLY={}; audit().filter(r=>r.verdict==="early").forEach(r=>EARLY[r.key]=r.size);
const VARIANTS={
  today:(id,a,b)=>legWindow(a,b),
  "a-end":(id,a,b)=>{ const t0=PHASES[b.ph].t0, t1=PHASES[b.ph].t1; return [b.moveMin&&b.moveMin<t1-t0?t1-b.moveMin:t0,t1]; },
  "a-mid":(id,a,b)=>{ const t0=PHASES[b.ph].t0, t1=PHASES[b.ph].t1, e=t0+(t1-t0)/2; return [b.moveMin&&b.moveMin<e-t0?e-b.moveMin:t0,e]; },
  "b-shift":(id,a,b)=>{ const w=legWindow(a,b), d=EARLY[id+"@"+b.ph]||0; return [w[0]+d,w[1]+d]; }
};
function timings(id,fn){ const A=anchorList(id), out=[]; let prevEnd=-1e9;
  for(let i=1;i<A.length;i++){ const a=A[i-1], b=A[i]; if(a.p===null||b.p===null){ out.push(null); continue; }
    let [s,e]=fn(id,a,b); if(s<prevEnd){ const d=prevEnd-s; s+=d; e+=d; } prevEnd=e; out.push([s,e]); }
  return out; }
let VAR="today", TIM={};
function setVariant(v){ VAR=v; TIM={}; Object.keys(FORMATIONS).forEach(id=>{ if(FORMATIONS[id].track) TIM[id]=timings(id,VARIANTS[v]); }); knowKey=""; }
legAt=function(id,t){
  const A=anchorList(id); if(!A.length||A[0].p===null) return null;
  if(t<=PHASES[A[0].ph].t0) return {a:A[0],b:null,u:0};
  const TT=TIM[id]; let i=0;
  /* the leg in progress, or the last anchor reached */
  for(let k=1;k<A.length;k++){ const w=TT[k-1]; if(!w) { if(A[k].p===null && t>=PHASES[A[k].ph].t0) return null; break; }
    if(t<w[0]) return {a:A[k-1],b:A[k],u:0,w};
    if(t<w[1]) return {a:A[k-1],b:A[k],u:(t-w[0])/((w[1]-w[0])||1),w};
    i=k; }
  return {a:A[i],b:null,u:0};
};
/* ---- the readings ---- */
function speeds(){ const out={over:[],max:{}}; Object.keys(TIM).forEach(id=>{ const f=FORMATIONS[id], A=anchorList(id);
  TIM[id].forEach((w,k)=>{ if(!w) return; const a=A[k], b=A[k+1], km=legPath(a,b).len*KM_PER_MAP, min=w[1]-w[0], kmh=min>0?km/(min/60):(km>0.02?Infinity:0), ceil=SPEED_CEIL[f.arm]||5;
    out.max[f.arm]=Math.max(out.max[f.arm]||0,kmh); if(kmh>ceil+0.001) out.over.push(id+" "+a.ph+"->"+b.ph+" "+(kmh===Infinity?"inf":kmh.toFixed(1))+" km/h (ceiling "+ceil+")"); }); });
  Object.keys(out.max).forEach(k=>out.max[k]=+out.max[k].toFixed(2)); return out; }
function events(){ const fails=[]; let worst={km:0};
  EVENTS.forEach(e=>{ const w=Array.isArray(e.t)?e.t:[e.t,e.t], tol=e.tolKm!==undefined?Math.min(e.tolKm,2):1.0; let best=null;
    for(let t=w[0];t<=w[1];t+=2){ clock=t; e.forms.forEach(fid=>{ if(!FORMATIONS[fid]||!FORMATIONS[fid].track) return; const p=posNow(fid); if(!p) return;
      const km=Math.hypot(p[0]-e.p[0],p[1]-e.p[1])*KM_PER_MAP; if(!best||km<best.km) best={km,fid}; }); }
    if(!best) return; if(best.km>tol) fails.push(e.id+" "+best.fid+" "+best.km.toFixed(2)+" km (tolerance "+tol+")"); if(e.tolKm===undefined&&best.km>worst.km) worst={km:+best.km.toFixed(2),id:e.id}; });
  return {fails,worst}; }
const MARKS=[240,420,480,525,570,660,720,840,960];
function plateau(){ const rows=MARKS.map(t=>{ clock=t; return {t:hm(t),al:plateauStrength("al"),fr:plateauStrength("fr"),cut:!!centreSeparation()}; });
  clock=240; const dawn=plateauStrength("al"); let low=1e9; for(let t=240;t<=525;t+=5){ clock=t; low=Math.min(low,plateauStrength("al")); }
  let firstCut=null; for(let t=240;t<=1080;t+=1){ clock=t; if(centreSeparation()){ firstCut=hm(t); break; } }
  const s=rows[0].al, lowMarks=Math.min(...rows.slice(0,4).map(r=>r.al));
  return {rows,dawn,lowBeforeSoult:low,firstCut,centreEmpties:lowMarks<s*0.55,frenchHold1100:rows.find(r=>r.t==="11:00").fr>4000}; }
function knowledge(){ const out={}; ["fr","al"].forEach(sd=>{ commandView=sd; out[sd]=PHASES.map((ph,i)=>{ curPhase=i; clock=(ph.t0+ph.t1)/2; knowKey="";
  const c={seen:0,uncertain:0,unknown:0}; Object.keys(FORMATIONS).forEach(id=>{ const f=FORMATIONS[id]; if(!f.track) return; if((f.nation==="fr"?"fr":"al")===sd) return;
    if(!posNow(id)) return; const k=knowledgeOf(id); if(c[k]!==undefined) c[k]++; }); return c.seen+"/"+c.uncertain+"/"+c.unknown; }); }); commandView="none"; curPhase=0; return out; }
function temporal(){ const f=[]; EVENTS.forEach(e=>{ const t=Array.isArray(e.t)?e.t[0]:e.t; clock=t; (e.forms||[]).forEach(fid=>{ if(FORMATIONS[fid]&&!posNow(fid)) f.push(e.id+" "+fid); }); }); return f; }
const CASE_T=[500,570,585,590,600];
function positions(){ const o={}; CASE_T.forEach(t=>{ clock=t; o[t]={}; Object.keys(TIM).forEach(id=>{ const p=posNow(id); if(p) o[t][id]=p; }); }); return o; }
/* ---- run ---- */
setVariant("today");
/* the generic legAt must reproduce today's engine exactly */
let maxDiff=0; Object.keys(TIM).forEach(id=>{ for(let t=T_MIN;t<=T_MAX;t+=3){ const a=origLegAt(id,t), b=legAt(id,t);
  const pa=a&&(a.b&&a.u>0?pointOnPath(legPath(a.a,a.b),a.u):a.a.p), pb=b&&(b.b&&b.u>0?pointOnPath(legPath(b.a,b.b),b.u):b.a.p);
  if(!!pa!==!!pb) maxDiff=Infinity; else if(pa) maxDiff=Math.max(maxDiff,Math.hypot(pa[0]-pb[0],pa[1]-pb[1])); } });
console.log("check: the variant engine reproduces today's positions to "+maxDiff.toFixed(6)+" map units");
const base=positions(), res={};
Object.keys(VARIANTS).forEach(v=>{ setVariant(v); const sp=speeds(), ev=events(), pl=plateau(), kn=knowledge(), tm=temporal(), pos=positions();
  const disp={}; CASE_T.forEach(t=>{ let mx=0,who="",n=0,sum=0; Object.keys(base[t]).forEach(id=>{ const a=base[t][id], b=pos[t][id]; if(!b) return; const m=Math.hypot(a[0]-b[0],a[1]-b[1])*KM_PER_MAP*1000; sum+=m; n++; if(m>mx){ mx=m; who=id; } });
    disp[hm(t)]={maxM:Math.round(mx),who,meanM:Math.round(sum/(n||1))}; });
  res[v]={speedsOver:sp.over,speedMax:sp.max,eventFails:ev.fails,eventWorst:ev.worst,plateau:pl,knowledge:kn,temporal:tm,displacement:disp};
  console.log("\n== "+v);
  console.log("  march-rate audit: "+sp.over.length+" legs over ceiling"+(sp.over.length?": "+sp.over.slice(0,8).join("; "):"")+"  fastest by arm "+JSON.stringify(sp.max));
  console.log("  event agreement: "+ev.fails.length+" failures"+(ev.fails.length?": "+ev.fails.join("; "):"")+"; worst under default "+JSON.stringify(ev.worst));
  console.log("  plateau Allied/French at "+pl.rows.map(r=>r.t+" "+r.al+"/"+r.fr+(r.cut?" CUT":"")).join(", "));
  console.log("  tour stop 4 figures: dawn "+pl.dawn+", low before 08:45 "+pl.lowBeforeSoult+"; centre separation first reported "+pl.firstCut+"; centre empties "+pl.centreEmpties+"; French hold at 11:00 "+pl.frenchHold1100);
  console.log("  knowledge seen/uncertain/unknown by phase: fr "+kn.fr.join(" ")+" | al "+kn.al.join(" "));
  console.log("  events naming a formation not yet on the field: "+(tm.length?tm.join(", "):"none"));
  console.log("  displacement vs today at the harness clocks: "+Object.entries(disp).map(([t,d])=>t+" max "+d.maxM+" m ("+d.who+"), mean "+d.meanM+" m").join("; "));
});
const j=process.argv.indexOf("--json"); if(j>0) fs.writeFileSync(process.argv[j+1],JSON.stringify(res,null,1));
