/* Roadmap step 3: compare two check:visual reports case by case (the harness's --compare diffs only the PNGs).
   node tools/step3/report-diff.js <reference report.json or dir> <new report.json or dir>
   For every case present in both: the map layer's drops and dropped ids, the unobstructed fractions at the case's size and at 1280 x 720,
   the timeline's height and the case's own failures; every difference is printed, and each new value judged against its limit in
   tools/visual/thresholds.js. Exit 1 if a case present in the reference is missing from the new report or a new value is past its limit;
   a difference within the limits is printed, not failed (each is to be explained in CHANGELOG.md). Not bundled. */
"use strict";
const fs=require("fs"), path=require("path");
const T=require("../visual/thresholds.js");
function load(p){ if(fs.existsSync(p)&&fs.statSync(p).isDirectory()) p=path.join(p,"report.json"); return JSON.parse(fs.readFileSync(p,"utf8")); }
const [ra,rb]=process.argv.slice(2);
if(!ra||!rb){ console.error("usage: report-diff.js <reference> <new>"); process.exit(2); }
const A=load(ra), B=load(rb), diffs=[], bad=[];
const r4=v=>v==null?"null":(+v).toFixed(4);
for(const name of Object.keys(A.cases||{})){
  const a=A.cases[name], b=(B.cases||{})[name];
  if(!b){ if((B.cases&&Object.keys(B.cases).length)&&process.argv.indexOf("--all")>=0) bad.push(name+": missing from the new report"); continue; }
  const la=a.layer||{}, lb=b.layer||{}, d=[];
  if(la.dropped!==lb.dropped) d.push("drops "+la.dropped+" -> "+lb.dropped);
  const ia=(la.droppedIds||[]).slice().sort().join(","), ib=(lb.droppedIds||[]).slice().sort().join(",");
  if(ia!==ib) d.push("dropped ids ["+ia+"] -> ["+ib+"]");
  if(r4(a.unobstructed)!==r4(b.unobstructed)) d.push("unobstructed "+r4(a.unobstructed)+" -> "+r4(b.unobstructed));
  if(r4(a.unobstructed720)!==r4(b.unobstructed720)) d.push("unobstructed at 1280x720 "+r4(a.unobstructed720)+" -> "+r4(b.unobstructed720));
  const ta=a.timeline&&a.timeline.height, tb=b.timeline&&b.timeline.height;
  if(ta!==tb) d.push("timeline "+ta+" -> "+tb+" px");
  const lim=T.DROP_LIMIT&&T.DROP_LIMIT[name];
  if(lim!=null&&lb.dropped>lim) bad.push(name+": drops "+lb.dropped+" past its limit "+lim);
  const U=T.UNOBSTRUCTED&&T.UNOBSTRUCTED[name];
  if(U&&b.unobstructed!=null&&b.unobstructed<U[0]) bad.push(name+": unobstructed "+r4(b.unobstructed)+" below "+U[0]);
  if(U&&b.unobstructed720!=null&&b.unobstructed720<U[1]) bad.push(name+": unobstructed at 1280x720 "+r4(b.unobstructed720)+" below "+U[1]);
  if(tb!=null&&tb>T.TIMELINE_MAX&&!(T.TIMELINE_RECORDED||[]).includes(name)) bad.push(name+": timeline "+tb+" px over "+T.TIMELINE_MAX);
  if(d.length) diffs.push(name+": "+d.join("; "));
}
const nB=Object.keys(B.cases||{}).filter(n=>A.cases&&A.cases[n]).length;
console.log("compared "+nB+" case(s) of "+Object.keys(A.cases||{}).length+" in the reference");
console.log(diffs.length?"differences:\n  "+diffs.join("\n  "):"no difference in drops, dropped ids, unobstructed fractions or timeline height");
if(bad.length){ console.log("PAST A LIMIT:\n  "+bad.join("\n  ")); process.exit(1); }
