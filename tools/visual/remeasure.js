#!/usr/bin/env node
/* The one re-measure after the embedded fonts (roadmap step 1; owner decision 141 (a): "re-measure once"), by decision 62's method.
   node tools/visual/remeasure.js <run1> <run2> [--bounds keep|tight] [--emit] [--accept-loosening 141] [--html austerlitz-command-map.html]
   (npm run check:remeasure -- <run1> <run2> ...; a run is a harness output directory or its report.json)
   It reads two full check:visual runs of the same build and proposes, for every font-dependent limit of thresholds.js (DROP_LIMIT,
   UNOBSTRUCTED, PAPER_MIN_PXKM), the value the build supports. It never edits thresholds.js: --emit prints the override block, in the file's
   own append-and-comment style, to paste at the end of the limits, and the table for CHANGELOG.md (constant, was, is, why).
   It stops (exit 2), proposing nothing, when:
   - the two runs are of different builds, or of another build than --html, or in different environments (platform, Chromium, Playwright);
   - a run is not a full --test run of this harness (a --legacy, --selftest-only or --only run, or a report made before step 1), or lacks a
     case of cases.js;
   - the two runs differ in any measure re-measured here (drops, the unobstructed share, px per km), which would mean a race (font loading,
     layout) rather than a measure;
   - a run fails anything other than the limits re-measured here (judged by thresholds.js judgeReport with those limits lifted);
   - a baseline would fall below its Stage 2C value (Stage 3B's rule: "never below the Stage 2C value it replaces").
   The rules (--bounds keep, the default, the lead's rule for step 1: "keep the existing bounds where they are still met; change a limit or
   baseline only where the fonts moved the measure past it; record every change"):
   - DROP_LIMIT: the measure is the largest drop count over every view held to that limit: the case, and the live views that reuse it (the
     valley fog's hours use their case's limit; the Watch dwell uses pratzen-low's). keep: a limit the measure exceeds is raised to it; every
     other stays. tight: every limit becomes its measure (decision 62's tight count).
   - UNOBSTRUCTED, at the case's viewport and at 1280 x 720: the measure rounded down to 0.1 point (the 3B, 3C and 7B convention). keep: a
     baseline the measure falls below is lowered to it; every other stays (the convention's raise is listed, not applied). tight: both
     directions. A case without a baseline takes the convention's value.
   - PAPER_MIN_PXKM: the measure rounded down to a whole px per km (3C). keep: lowered only where the measure falls below; tight: both ways.
   - Every change that loosens (a limit raised, a baseline or a px-per-km floor lowered), and every change to the opening's cases (decision
     121: "never raised or lowered"), is listed; the script exits 1 unless --accept-loosening 141 is given (decision 141 is the owner's
     authority for the one re-measure; the record must still list each).
   - Reported, not re-measured (spec values): TIMELINE_MAX (narrow-390's height is recorded, decision 122), CONF_SHARE ("never raised"),
     SMOKE_SHARE, SOLID_BLACK, HORIZON_DE, FOCUS_PX, LAYER_MS and PAPER. The in-app self-test's own limits are app.js constants.
   At the end both runs are judged again with the proposed values: each must then pass (check-report.js on the second run passes once the
   block is pasted, with no re-rendering). */
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const T=require("./thresholds.js"), CASES=require("./cases.js");
const argv=process.argv.slice(2), flag=f=>argv.includes(f), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const VAL=["--bounds","--accept-loosening","--html"];
const files=argv.filter((a,i)=>!a.startsWith("--")&&!VAL.includes(argv[i-1]));
const BOUNDS=opt("--bounds")||"keep", EMIT=flag("--emit"), ACCEPT=opt("--accept-loosening")==="141";
const htmlPath=path.resolve(opt("--html")||"austerlitz-command-map.html");
if(files.length!==2||!["keep","tight"].includes(BOUNDS)){ console.error("usage: remeasure.js <run1> <run2> [--bounds keep|tight] [--emit] [--accept-loosening 141] [--html file]"); process.exit(2); }
const load=f=>{ const p=fs.existsSync(f)&&fs.statSync(f).isDirectory()?path.join(f,"report.json"):f; return JSON.parse(fs.readFileSync(p,"utf8")); };
const R=files.map(load);
let MAN=null; try{ MAN=JSON.parse(fs.readFileSync(path.join(__dirname,"selftest-manifest.json"),"utf8")); }catch(e){}
const stop=[];

/* each limit's origin (thresholds.js comments) */
const TIGHT62=["selected-formation","narrow-1024","eye-zuran","eye-zuran-1x","plans-overview","narrow-390"];
const DEC121=["opening-1","opening-2","opening-3","opening-4","opening-end","opening-1-laptop"];
const dropOrigin=n=>DEC121.includes(n)?"the 7C build's count (decision 121: never raised or lowered)":TIGHT62.includes(n)?"a tight count (decision 62's method)":
  /^paper-/.test(n)?"the 2E matched count (decision 39)":"the 2C canvas count (decision 39)";
const unobOrigin=n=>DEC121.includes(n)?"the 7C build's (decision 121: never raised or lowered)":["eye-zuran","eye-zuran-1x","plans-overview"].includes(n)?"the 7D build's (step 1, T-5; provisional)":
  ["first-run","first-run-laptop","narrow-390"].includes(n)?"the 7B build's (3B/3C convention)":"the 3B/3C build's (3B/3C convention)";
/* Stage 3B's floor: the Stage 2C baselines (thresholds.js, the Stage 3B comment); narrow-1024 on the Stage 2F build */
const FLOOR_2C={"first-run":[.5442,.4391],"first-run-laptop":[.4831,.4391],"overview-field":[.3028,.1511],"overview-plan":[.8045,.7987],
  "close-sokolnitz":[.8045,.7987],"staff-paper":[.3028,.1511],"pratzen-low":[.8045,.7709],"pratzen-orbit-min":[.8045,.7709],"pratzen-low-1x":[.8045,.7709],
  "pratzen-low-10x":[.8045,.7709],"selected-formation":[.1477,.0697],"watch-selected":[.7844,.732],"hybrid-dimmed":[.7869,.7434],"paper-north-up":[.3028,.1511],
  "paper-close":[.3028,.1626],"paper-drawer":[.1477,.0697],"paper-laptop":[.1511,.1511],"narrow-1024":[.4845,.4389]};
const down3=v=>+(Math.floor(Math.round(v*1e6)/1e3)/1e3).toFixed(3);   /* rounded down to 0.1 point, free of float noise */
const same=get=>JSON.stringify(get(R[0]))===JSON.stringify(get(R[1]));

/* 1. the runs */
if(R[0].md5!==R[1].md5) stop.push("the two runs are of different builds ("+R[0].md5+", "+R[1].md5+")");
const htmlMd5=fs.existsSync(htmlPath)?crypto.createHash("md5").update(fs.readFileSync(htmlPath)).digest("hex"):null;
if(htmlMd5!==R[0].md5) stop.push("the runs are of build "+R[0].md5+", "+path.relative(process.cwd(),htmlPath)+" is "+htmlMd5+": the values would be pasted for another build");
R.forEach((r,i)=>{ const M=r.mode;
  if(!M) stop.push("run "+(i+1)+" was made by a harness before roadmap step 1");
  else if(!M.test||M.legacy||M.selftestOnly||M.only) stop.push("run "+(i+1)+" is not a full --test run ("+JSON.stringify(M)+")");
  CASES.forEach(c=>{ if(!r.cases||!r.cases[c.name]) stop.push("run "+(i+1)+" lacks case "+c.name); });
  if(!r.live||!r.live.fog||!r.live.dwell) stop.push("run "+(i+1)+" lacks the live views held to the drop limits (report.live.fog, .dwell)"); });
if(!same(r=>r.env&&{platform:r.env.platform,arch:r.env.arch,chromium:r.env.chromium,playwright:r.env.playwright})) stop.push("the two runs' environments differ: "+JSON.stringify(R.map(r=>r.env)));
if(stop.length){ stop.forEach(s=>console.log("STOP: "+s)); process.exit(2); }

/* 2. the measures, identical in both runs */
const liveDrops=(r,n)=>[].concat((r.live.fog||[]).filter(F=>F.name===n).map(F=>F.dropped),n==="pratzen-low"&&r.live.dwell?[r.live.dwell.dropped]:[]);
for(const c of CASES){ const n=c.name;
  if(!same(r=>[r.cases[n].layer.dropped,r.cases[n].layer.droppedIds])) stop.push(n+": the drops differ between the runs ("+R.map(r=>r.cases[n].layer.dropped+" "+r.cases[n].layer.droppedIds.join(",")).join(" / ")+")");
  if(!same(r=>liveDrops(r,n))) stop.push(n+": the live views' drops differ between the runs ("+R.map(r=>liveDrops(r,n).join(",")).join(" / ")+")");
  if(!same(r=>[r.cases[n].unobstructed,r.cases[n].unobstructed720])) stop.push(n+": the unobstructed share differs between the runs");
  if(!same(r=>r.cases[n].paper?r.cases[n].paper.pxPerKm.pratzeberg:null)) stop.push(n+": px per km differs between the runs"); }
/* 3. nothing else fails: each run judged with the re-measured limits lifted */
const lifted={DROP_LIMIT:{},UNOBSTRUCTED:{},PAPER_MIN_PXKM:{}};
CASES.forEach(c=>{ lifted.DROP_LIMIT[c.name]=Infinity; lifted.UNOBSTRUCTED[c.name]=[0,0]; lifted.PAPER_MIN_PXKM[c.name]=0; });
R.forEach((r,i)=>T.judgeReport(r,{cases:CASES,allCases:CASES,manifest:MAN,limits:lifted}).forEach(f=>stop.push("run "+(i+1)+" fails other than on a re-measured limit: "+f)));

/* 4. the proposals */
const L=T.limits(), rows=[], changes=[], notes=[];
const change=(k,was,is,loosens,why,n)=>changes.push({k,was,is,loosens,dec121:DEC121.includes(n),why});
for(const c of CASES){ const n=c.name, m=R[0].cases[n];
  const live=liveDrops(R[0],n), d=Math.max(m.layer.dropped,...live), now=L.DROP_LIMIT[n];
  let prop=now===undefined?d:(BOUNDS==="tight"?d:Math.max(now,d));
  if(live.length) notes.push(n+": the case drops "+m.layer.dropped+", the live views held to its limit "+live.join(", ")+": the measure is "+d);
  if(prop!==now) change('DROP_LIMIT["'+n+'"]',now===undefined?"none":now,prop,now!==undefined&&prop>now,dropOrigin(n)+"; measured "+d+(live.length?" (with the live views)":"")+
    (m.layer.droppedIds.length?": "+m.layer.droppedIds.join(", "):""),n);
  const U0=L.UNOBSTRUCTED[n]||null, meas=[m.unobstructed,m.unobstructed720], conv=meas.map(down3);
  let U1;
  if(!U0) U1=conv;
  else if(BOUNDS==="tight") U1=conv;
  else U1=U0.map((u,i)=>meas[i]<u?conv[i]:u);
  if(U0&&BOUNDS==="keep") conv.forEach((v,i)=>{ if(v>U0[i]) notes.push(n+": the 3B/3C convention would raise the "+(i?"1280 x 720":"case viewport")+" baseline "+U0[i]+" to "+v+" (not under --bounds keep"+(DEC121.includes(n)?"; decision 121: never raised":"")+")"); });
  const F=FLOOR_2C[n]; if(F) U1.forEach((v,i)=>{ if(v<F[i]) stop.push(n+": the baseline "+v+" would fall below its Stage 2C value "+F[i]+" (Stage 3B's rule)"); });
  if(!U0||U1[0]!==U0[0]||U1[1]!==U0[1]) change('UNOBSTRUCTED["'+n+'"]',U0?"["+U0.join(",")+"]":"none","["+U1.join(",")+"]",!!U0&&(U1[0]<U0[0]||U1[1]<U0[1]),
    unobOrigin(n)+"; measured "+meas.join(" / ")+", rounded down to 0.1 point (3B/3C/7B)"+(F?"; the 2C floor "+F.join(" / "):""),n);
  rows.push([n,now===undefined?"-":now,d,prop,U0?U0.join("/"):"-",meas.join("/"),U1.join("/")]); }
for(const [n,lim] of Object.entries(L.PAPER_MIN_PXKM)){ const v=R[0].cases[n].paper.pxPerKm.pratzeberg, conv=Math.floor(v), p=BOUNDS==="tight"||v<lim?conv:lim;
  if(p!==lim) change('PAPER_MIN_PXKM["'+n+'"]',lim,p,p<lim,"Stage 3C's floor; measured "+v+" px per true km, rounded down (3C)",n); }

/* 5. reported, not re-measured */
const tl=CASES.filter(c=>!T.TIMELINE_RECORDED.includes(c.name)).map(c=>[c.name,R[0].cases[c.name].timeline.height]), tlMax=Math.max(...tl.map(x=>x[1]));
const conf={land:[],paper:[]}; CASES.forEach(c=>{ const m=R[0].cases[c.name]; if(m.confShare) conf[m.mode==="staff"?"paper":"land"].push(m.confShare.share); });
const smoke=Math.max(...CASES.map(c=>{ const m=R[0].cases[c.name]; return m.smoke?m.smoke.share:0; })), ms=Math.max(...CASES.map(c=>R[0].cases[c.name].layer.ms));

console.log("build "+R[0].html+" md5 "+R[0].md5+"; two runs ("+R.map(r=>r.when).join(", ")+"), "+JSON.stringify(R[0].env)+"; --bounds "+BOUNDS);
console.log("case".padEnd(20)+"drop limit  measured  proposed   unobstructed baseline  measured            proposed");
rows.forEach(x=>console.log(x[0].padEnd(20)+String(x[1]).padStart(10)+String(x[2]).padStart(10)+String(x[3]).padStart(10)+"   "+String(x[4]).padEnd(22)+" "+String(x[5]).padEnd(19)+" "+x[6]));
notes.forEach(x=>console.log("  note: "+x));
console.log("TIMELINE_MAX "+T.TIMELINE_MAX+" (Stage 3C spec; not re-measured): the tallest held view "+tlMax+" px"+(tlMax>T.TIMELINE_MAX?" OVER: fix the CSS, never the limit":"")+
  "; recorded, not held: "+T.TIMELINE_RECORDED.map(n=>n+" "+R[0].cases[n].timeline.height+" px").join(", ")+" (decision 122)");
console.log("CONF_SHARE land "+T.CONF_SHARE.land+", paper "+T.CONF_SHARE.paper+" (5B, never raised): the largest measured land "+Math.max(...conf.land)+", paper "+Math.max(...conf.paper));
console.log("SMOKE_SHARE "+T.SMOKE_SHARE+": the largest measured "+smoke+"; LAYER_MS "+T.LAYER_MS+": the slowest pass "+ms+" ms");

/* 6. both runs pass with the proposals */
const prop={DROP_LIMIT:{},UNOBSTRUCTED:{},PAPER_MIN_PXKM:{}};
changes.forEach(c=>{ const m=/^(\w+)\["(.+)"\]$/.exec(c.k); prop[m[1]][m[2]]=m[1]==="UNOBSTRUCTED"?JSON.parse(c.is):c.is; });
if(!stop.length) R.forEach((r,i)=>{ const f=T.judgeReport(r,{cases:CASES,allCases:CASES,manifest:MAN,limits:prop}); f.forEach(x=>stop.push("run "+(i+1)+" still fails with the proposed values: "+x)); });

const loose=changes.filter(c=>c.loosens||c.dec121);
console.log("\n"+changes.length+" proposed changes; "+changes.filter(c=>c.loosens).length+" loosen"+(changes.some(c=>c.dec121)?", "+changes.filter(c=>c.dec121).length+" against decision 121":"")+":");
changes.forEach(c=>console.log("  "+(c.loosens?"LOOSENS ":c.dec121?"DEC 121 ":"        ")+c.k+": "+c.was+" -> "+c.is+"   ("+c.why+")"));
if(stop.length){ stop.forEach(s=>console.log("STOP: "+s)); process.exit(2); }
console.log("both runs pass with the proposed values (thresholds.js judgeReport)");
if(EMIT&&changes.length){
  console.log("\n/* Decision 141 (the embedded fonts, roadmap step 1): every case re-measured once on the "+R[0].md5+" build, two identical runs ("+
    R[0].env.platform+", Chromium "+R[0].env.chromium+", Playwright "+R[0].env.playwright+"), by tools/visual/remeasure.js --bounds "+BOUNDS+" (decision 62's method"+
    (BOUNDS==="keep"?"; a bound kept where the build still meets it, changed only where the fonts moved the measure past it":"")+"). Each value: was, is and why, in\n   CHANGELOG.md"+
    (loose.length?"; loosened under decision 141: "+loose.map(c=>c.k).join(", "):"")+" */");
  changes.forEach(c=>console.log(c.k+"="+c.is+";   /* was "+c.was+(c.loosens?"; loosened (decision 141)":"")+(c.dec121?"; decision 121's value changed (decision 141)":"")+" */"));
  console.log("\n| constant | was | is | why |\n|---|---|---|---|");
  changes.forEach(c=>console.log("| `"+c.k+"` | "+c.was+" | "+c.is+" | "+(c.loosens?"**loosened (decision 141)**; ":"")+(c.dec121?"**decision 121's value changed (decision 141)**; ":"")+c.why+" |"));
}
if(loose.length&&!ACCEPT){ console.log("\n"+loose.length+" change(s) loosen a limit or change decision 121's: run again with --accept-loosening 141 to accept them under decision 141, and list each in CHANGELOG.md"); process.exit(1); }
process.exit(0);
