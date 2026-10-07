#!/usr/bin/env node
/* Stage 2C regression (docs/STAGE2_SPEC.md sections C and J; owner decisions 20-23, 33, 37, 46):
   1. the arrow-track binding: every OVERLAYS arrow has exactly one verdict, derived or interpretive; the arrow of phase ph
      depicts the leg (or run of consecutive legs) the model executes during ph; every derived arrow is generated from its
      leg by the app's own arrowPts(), and its end points equal the leg's anchors exactly; every other arrow carries an
      interpretive marker of a known kind, consistent with what it shows; no axis arrow describes a halt; the arrows that
      could not be settled are listed here by name, each with its CHANGELOG.md entry; any other mismatch fails.
   2. dashes (static): dashed or segmented drawing only in the allowed drawers (axis arrows, plan links, plan staging
      outlines, valley and dead-ground lines, the ordered routes, and in SVG the day-track's ordered route); boundaries, lines,
      halt bars and the movement trail solid.
   node binding-test.js      (exit 1 on any error) */
const fs=require("fs"), path=require("path"), acorn=require("acorn");
const B=require("./tools/stage2/arrow-binding.js");
const X=B.X, F=X.FORMATIONS, P=X.PHASES;
const errors=[]; let checks=0;
function ok(cond,msg){ checks++; if(!cond) errors.push(msg); }

/* the arrows that stay hand-authored (decision 37: they cannot be settled); each has its CHANGELOG.md entry */
const UNSETTLED=[
  {ph:1,label:"I Column descends",why:"the unresolved Dokhturov conflict (dok@1)"},
  {ph:4,label:"Kamensky turns about",why:"the unresolved Kamensky conflict (kamensky@3, kamensky@4)"}
];
const KINDS=["route","objective","group","unmodelled","halt","unsettled"];
const changelog=fs.readFileSync(path.join(__dirname,"CHANGELOG.md"),"utf8");
const entry2c=changelog.slice(0,changelog.indexOf("## 2026-09 · Stage 2C precondition"));   /* the 2C entry sits above it */

/* ---- 1. the binding ---- */
const counts={derived:0}; KINDS.forEach(k=>counts[k]=0);
Object.keys(X.OVERLAYS).map(Number).forEach(ph=>{
  const t0=P[ph].t0, t1=P[ph].t1;
  (X.OVERLAYS[ph].arrows||[]).forEach(a=>{
    const tag="phase "+ph+" \""+a.label+"\"";
    ok(!!a.leg!==!!a.interp, tag+": has "+(a.leg&&a.interp?"both a leg and an interpretive marker":"no verdict (neither a leg nor an interpretive marker)"));
    const row=B.rows.find(r=>r.ph===ph&&r.label===a.label&&r.kind===a.kind);
    ok(!!row, tag+": not in the binding report");
    if(/halt|stopp|held up|standing still/i.test(a.label)) ok(a.kind!=="axis", tag+": an axis arrow describes a halt");
    if(a.leg){
      counts.derived++;
      const [id,from,to]=a.leg, f=F[id], A=f&&f.track?X.anchorList(id):[];
      const i=A.findIndex(q=>q.ph===from), j=A.findIndex(q=>q.ph===to);
      ok(i>=0&&j>i, tag+": leg "+id+" "+from+"→"+to+" is not a run of anchors");
      if(!(i>=0&&j>i)) return;
      ok(!a.pts, tag+": a derived arrow carries points of its own");
      ok(a.kind!=="axis"&&a.kind!=="halt", tag+": a derived arrow of kind "+a.kind);
      ok((f.nation==="fr"?"fr":"al")===a.side, tag+": side "+a.side+" but "+id+" is "+f.nation);
      ok(B.named(a.label).includes(id), tag+": its label does not name "+id);
      for(let k=i+1;k<=j;k++){ const w=X.legWindow(A[k-1],A[k]), ov=Math.min(w[1],t1)-Math.max(w[0],t0);
        ok(A[k-1].p&&A[k].p, tag+": leg "+A[k-1].ph+"→"+A[k].ph+" leaves the field");
        ok(ov>=1, tag+": leg "+A[k-1].ph+"→"+A[k].ph+" ("+w.join("-")+") is not executed during the phase ("+t0+"-"+t1+")"); }
      const pts=X.arrowPts(a);
      ok(pts&&pts.length>=2, tag+": arrowPts gives no points");
      if(!pts) return;
      const s=pts[0], e=pts[pts.length-1];
      ok(s[0]===A[i].p[0]&&s[1]===A[i].p[1], tag+": starts at "+JSON.stringify(s)+", not the anchor "+JSON.stringify(A[i].p));
      ok(e[0]===A[j].p[0]&&e[1]===A[j].p[1], tag+": ends at "+JSON.stringify(e)+", not the anchor "+JSON.stringify(A[j].p));
      ok(row&&row.verdictExec==="derivable", tag+": not derivable on the leg executed in the phase ("+(row&&row.whyExec)+")");
      return;
    }
    const kind=String(a.interp).split(":")[0], why=String(a.interp).slice(kind.length+1).trim();
    ok(KINDS.includes(kind), tag+": unknown interpretive kind \""+kind+"\"");
    ok(why.length>=12, tag+": the interpretive marker gives no reason");
    ok(Array.isArray(a.pts)&&a.pts.length>=2, tag+": an interpretive arrow without points");
    counts[kind]=(counts[kind]||0)+1;
    const nm=B.named(a.label).filter(id=>B.side(id)===a.side), single=nm.length===1&&!!F[nm[0]].track&&!/ and /.test(a.label.split("→")[0]);
    if(kind==="route") ok(a.kind==="axis", tag+": a route that is not drawn as an axis arrow");
    if(a.kind==="axis") ok(kind==="route", tag+": an axis arrow whose marker is "+kind);
    if(kind==="halt"||a.kind==="halt"){ ok(kind==="halt"&&a.kind==="halt", tag+": halt marker and kind disagree"); ok(!!F[a.of], tag+": a halt without its formation (of)"); }
    if(kind==="group") ok(nm.length>1||nm.some(id=>!F[id].track)||/ and /.test(a.label), tag+": marked group but names one tracked formation");
    if(kind==="unmodelled") ok(nm.length===0, tag+": marked unmodelled but names "+nm.join(", "));
    if(kind==="objective"||kind==="unsettled"){
      ok(single, tag+": marked "+kind+" but does not name one tracked formation");
      ok(row&&row.verdictExec!=="derivable", tag+": marked "+kind+" but derivable on the leg executed in the phase: derive it");
    }
    if(kind==="unsettled"){
      const u=UNSETTLED.find(q=>q.ph===ph&&q.label===a.label);
      ok(!!u, tag+": hand-authored (unsettled) but not listed by name in UNSETTLED");
      ok(entry2c.indexOf(a.label)>=0, tag+": unsettled, but CHANGELOG.md's 2C entry does not record it");
    }
  });
});
UNSETTLED.forEach(u=>{ const a=(X.OVERLAYS[u.ph].arrows||[]).find(q=>q.label===u.label);
  ok(!!a&&/^unsettled:/.test(a.interp||""), "listed as unsettled but not so marked in OVERLAYS: phase "+u.ph+" \""+u.label+"\""); });
/* any arrow naming one tracked formation that is neither derived nor marked objective or unsettled must not be a mismatch */
B.rows.forEach(r=>{ if(r.marker==="derived"||r.marker==="objective"||r.marker==="unsettled") return;
  if(r.verdict!=="interpretive") ok(false, "phase "+r.ph+" \""+r.label+"\": a mismatch that is not listed ("+r.whyExec+")"); });
const nArrows=B.rows.length;

/* ---- 2. dashes (static) ---- */
const DASH=[/LineDashedMaterial/,/computeLineDistances/,/setLineDash/,/\bdashRuns\(/,/\.dash\b/,/\bruns\s*:/,
  /* SVG's dash, every way of writing it (roadmap step 1, docs/FINAL_AUDIT.md T-9: until step 1 only three.js and canvas dashes were read):
     an attribute in markup, setAttribute(NS), the style property, a style declaration; a read (getAttribute) draws nothing */
  /stroke-dasharray\s*=\s*\\?["']/,/setAttribute(?:NS)?\(\s*(?:null\s*,\s*)?["']stroke-dasharray/,/\.strokeDasharray\s*=/,/stroke-dasharray\s*:/,/setProperty\(\s*["']stroke-dasharray/];
/* Stage 5F (docs/STAGE5_SPEC.md section E.4; decision 93): routeBuild, the ordered routes of the two plans, is the one new dashed drawer,
   and it draws only PLANS' routes (checked below). Stage 5G (section F.3; decision 95): dayTrackEl, the dossier's day-track inset, dashes in
   SVG its formation's ordered route and nothing else (checked below; read since roadmap step 1) */
const ALLOWED={"app.js":["dashRuns","buildArrow","planStaging","buildPlanLinks","updatePlanLinks","drapedRibbon","routeBuild","dayTrackEl"],
               "world.js":["buildAnalysis"]};
const dashers={};
["app.js","world.js","symbols.js"].forEach(file=>{
  const src=fs.readFileSync(path.join(__dirname,file),"utf8"), ast=acorn.parse(src,{ecmaVersion:2020});
  ast.body.forEach(n=>{ const name=n.type==="FunctionDeclaration"?n.id.name:n.type==="VariableDeclaration"?n.declarations.map(d=>d.id.name).join(","):null;
    if(!name) return; const body=src.slice(n.start,n.end);
    if(name==="ANALYSIS_STYLE") return;   /* the terrain-study style table: which terrain lines are dashed (valley, dead ground) */
    if(DASH.some(re=>re.test(body))){ (dashers[file]=dashers[file]||[]).push(name);
      ok((ALLOWED[file]||[]).includes(name), file+": "+name+" draws dashed or segmented lines, and is not an allowed drawer"); } });
  if(file==="app.js"){
    const fn=nm=>{ const d=ast.body.find(n=>n.type==="FunctionDeclaration"&&n.id.name===nm); return d?src.slice(d.start,d.end):""; };
    ["buildBoundary","buildLine","buildHalt","updateTrail"].forEach(nm=>{ const b=fn(nm);
      ok(b.length>0, "app.js: "+nm+" not found");
      ok(!DASH.some(re=>re.test(b))&&!/addTube\(/.test(b), "app.js: "+nm+" is dashed or segmented"); });
    const ba=fn("buildArrow");
    ok(/runs\s*:\s*a\.kind==="axis"\?dashRuns\(/.test(ba), "app.js: buildArrow dashes something other than the axis arrows");
    const ps=fn("planStaging"); ok(/dashRuns\(/.test(ps), "app.js: the plan staging outline is no longer dashed");
    const rb=fn("routeBuild"); ok(/dashRuns\(/.test(rb)&&/PLANS\[sd\]\.cols\[ci\]/.test(rb)&&/c\.route\.map/.test(rb), "app.js: routeBuild dashes something other than a plan column's ordered route");
    /* dayTrackEl is allowed the SVG attribute in markup only (DASH[6]): every other way of dashing, three.js, canvas, dashRuns and the
       other SVG forms, fails as it did before it was allowed (the diff review of roadmap step 1) */
    const dt=fn("dayTrackEl"); ok(dt.length>0&&!DASH.some((re,i)=>i!==6&&re.test(dt))&&(dt.match(/stroke-?dasharray/gi)||[]).length===1&&
      /<polyline class="dt-route"[^>]*stroke-dasharray/.test(dt)&&/L\.routes\.forEach/.test(dt),
      "app.js: dayTrackEl dashes something other than the ordered route (one stroke-dasharray, on the dt-route polyline drawn from the routes, and no other way of dashing)");
    /* Stage 4D (docs/STAGE4_SPEC.md section D.4): only an arrow derived from an executed leg draws on with the clock */
    ok((src.match(/DRAWON\.push\(/g)||[]).length===1&&/if\(a\.leg\)\{ var d=\{[^{}]*\}; DRAWON\.push\(/.test(ba), "app.js: an arrow that is not derived (a.leg) draws on with the clock");
    ["buildBoundary","buildLine","buildHalt","buildObjective","planStaging","buildPlanLinks"].forEach(nm=>{ ok(!/DRAWON/.test(fn(nm)), "app.js: "+nm+" draws on with the clock"); });
  }
  if(file==="world.js"){
    const d=ast.body.find(n=>n.type==="VariableDeclaration"&&n.declarations[0].id.name==="ANALYSIS_STYLE"), t=d?src.slice(d.start,d.end):"";
    const dashed=(t.match(/(\w+)\s*:\s*\{\s*dash\s*:\s*true/g)||[]).map(m=>m.split(":")[0].trim());
    ok(JSON.stringify(dashed.sort())===JSON.stringify(["dead","valley"]), "world.js: dashed terrain lines are "+dashed.join(", ")+", not valley and dead ground");
  }
});
const css=fs.readFileSync(path.join(__dirname,"style.css"),"utf8"), cssDash=(css.match(/[^{}]*\{[^}]*(?:dashed|stroke-dasharray)[^}]*\}/g)||[]).map(r=>r.split("{")[0].trim());
ok(cssDash.length&&cssDash.every(sel=>/^\.legend \.(dsh|stg)$/.test(sel)), "style.css: dashed borders or SVG dashes outside the legend's dash samples: "+cssDash.join("; "));
/* shell.html's markup (its inline SVG, the compass rose among it) dashes nothing (roadmap step 1) */
const shell=fs.readFileSync(path.join(__dirname,"shell.html"),"utf8").replace(/<!--[\s\S]*?-->/g,"");
ok(!/stroke-dasharray/.test(shell)&&!/style\s*=\s*"[^"]*dashed/.test(shell), "shell.html: its markup draws a dash");

/* ---- report ---- */
console.log("binding: "+nArrows+" arrows, "+counts.derived+" derived from the leg executed in their phase, "+
  KINDS.map(k=>counts[k]+" "+k).join(", ")+" (interpretive)");
console.log("draw-on: only the derived arrows (a.leg) draw on with the clock; interpretive arrows, lines, boundaries, halt bars and plans keep the phase's fade");
console.log("unsettled, hand-authored and listed (decision 37): "+UNSETTLED.map(u=>"phase "+u.ph+" \""+u.label+"\" ("+u.why+")").join("; "));
console.log("dashed or segmented drawers: "+Object.entries(dashers).map(([f,n])=>f+": "+n.join(", ")).join("; ")+"; boundaries, lines, halt bars and the trail solid");
console.log("binding-test: "+checks+" checks, "+errors.length+" failed");
errors.forEach(e=>console.log("  ! "+e));
process.exitCode=errors.length?1:0;
