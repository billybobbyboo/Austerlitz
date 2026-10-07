#!/usr/bin/env node
/* Re-checks a finished harness report against the thresholds, without re-rendering.
   node tools/visual/check-report.js <outdir | report.json> [--html austerlitz-command-map.html] [--legacy] [--write-manifest]
   (exit 1 on any failure)
   Roadmap step 1 (decision 131; docs/FINAL_AUDIT.md T-4): before step 1 this re-ran only each case's own thresholds; it ignored the run's
   recorded failures, the case list and the self-test's size, so a report missing cases or self-test checks passed. It now judges the whole
   report with thresholds.js judgeReport, the same function the harness applies at the end of a --test run:
   1. the report is of the build in --html (its md5);
   2. a run on an archived build (report.mode.legacy) is read only with --legacy; a report made by a harness before step 1 (no mode) fails
      on what it does not record (the state, the features, the live blocks, every page's messages), and is still read through;
   3. every case of cases.js present and no other (unless the report is a --selftest-only run), each checked with its spec;
   4. the live blocks from their raw numbers (report.live);
   5. the self-test required, every check by name against tools/visual/selftest-manifest.json;
   6. every page's console messages against thresholds.js CONSOLE_ALLOW (each entry named, with its reason);
   7. the failures the run recorded: each one not derived again here counts ("recorded by the run"), with one exception: a report made since
      step 1 records only what judgeReport derived from its own numbers, so a recorded failure of a limit tools/visual/remeasure.js
      re-measures (a drop limit, also in the fog views and the Watch dwell; an unobstructed baseline; a px-per-km floor) that is not derived
      again means that limit was changed since the run (decision 141's re-measure: "check-report.js on the second run passes with the new
      values, with no re-rendering"), and is listed as a note. Every other check of such a failure is still derived from the numbers.
   --write-manifest: writes tools/visual/selftest-manifest.json from the report's self-test, only if every check passed and the report is of
   the build in --html; it prints the names added and removed, for CHANGELOG.md. */
const fs=require("fs"), path=require("path"), crypto=require("crypto"), T=require("./thresholds.js"), CASES=require("./cases.js");
const argv=process.argv.slice(2), flag=f=>argv.includes(f), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const pos=argv.filter((a,i)=>!a.startsWith("--")&&argv[i-1]!=="--html");
const target=path.resolve(pos[0]||path.join(__dirname,"out"));
const rp=fs.existsSync(target)&&fs.statSync(target).isDirectory()?path.join(target,"report.json"):target;
const r=JSON.parse(fs.readFileSync(rp,"utf8"));
const LEGACY=flag("--legacy"), WRITE=flag("--write-manifest");
const htmlPath=path.resolve(opt("--html")||"austerlitz-command-map.html");
const MANIFEST_PATH=path.join(__dirname,"selftest-manifest.json");
let MAN=null; try{ MAN=JSON.parse(fs.readFileSync(MANIFEST_PATH,"utf8")); }catch(e){}
const htmlMd5=fs.existsSync(htmlPath)?crypto.createHash("md5").update(fs.readFileSync(htmlPath)).digest("hex"):null;

console.log("report "+path.relative(process.cwd(),rp)+": "+r.html+"  md5 "+r.md5+"  cases "+Object.keys(r.cases||{}).length+
  "  mode "+(r.mode?JSON.stringify(r.mode):"none (a harness before roadmap step 1)")+(r.env?"  env "+JSON.stringify(r.env):""));

if(WRITE){
  const st=r.selfTest, bad=[];
  if(htmlMd5!==r.md5) bad.push("the report is of another build than "+path.relative(process.cwd(),htmlPath)+" ("+r.md5+" against "+htmlMd5+")");
  if(r.mode&&r.mode.legacy) bad.push("an archived build's run (--legacy)");
  if(!st||!Array.isArray(st.checks)||!st.checks.length) bad.push("the report holds no self-test");
  else { const f=st.checks.filter(c=>!c.ok); if(f.length) bad.push(f.length+" self-test checks failed: "+f.map(c=>c.name).join("; "));
    const names=st.checks.map(c=>c.name); if(new Set(names).size!==names.length) bad.push("a self-test check is named twice"); }
  if(bad.length){ bad.forEach(b=>console.log("REFUSED: "+b)); process.exit(1); }
  const names=st.checks.map(c=>c.name), was=MAN&&Array.isArray(MAN.names)?MAN.names:[];
  const added=names.filter(n=>!was.includes(n)), removed=was.filter(n=>!names.includes(n));
  const doc={note:"tools/visual/selftest-manifest.json (roadmap step 1, T-4): the in-app self-test's checks by name, in run order, from a passing run of build "+r.md5+
    " (written by check-report.js --write-manifest). The harness (--test, --selftest-only) and check-report.js fail on a check missing, added, renamed or named twice: "+
    "regenerate it in the commit that changes a check, and record the names added and removed in CHANGELOG.md.", md5:r.md5, count:names.length, names:names};
  fs.writeFileSync(MANIFEST_PATH,JSON.stringify(doc,null,1)+"\n");
  console.log("wrote "+path.relative(process.cwd(),MANIFEST_PATH)+": "+names.length+" checks (was "+was.length+"); added "+added.length+", removed "+removed.length);
  added.forEach(n=>console.log("  + "+n)); removed.forEach(n=>console.log("  - "+n));
  process.exit(0);
}

const head=[];
/* 1, 2 */
if(!htmlMd5) head.push("no build at "+htmlPath+" to compare the report with");
else if(htmlMd5!==r.md5) head.push("the report is of another build: md5 "+r.md5+", "+path.relative(process.cwd(),htmlPath)+" is "+htmlMd5);
if(!r.mode) head.push("the report was made by a harness before roadmap step 1 (no mode, features, case state, live blocks or log of every page): re-run npm run check:visual");
else { if(r.mode.legacy&&!LEGACY) head.push("the report is an archived build's run (--legacy): read it with --legacy");
  if(!r.mode.legacy&&LEGACY) head.push("--legacy given for a report made without it");
  if(!r.mode.test) head.push("the report is a measurement run (no --test): nothing was required of it"); }
head.forEach(x=>console.log("FAIL "+x));
const out=head.slice();
/* 3-6: judged as the harness judges a --test run */
const so=!!(r.mode&&r.mode.selftestOnly);
const derived=T.judgeReport(r,{cases:CASES, allCases:CASES, manifest:MAN, legacy:LEGACY});
if(!so) for(const c of CASES){ const m=(r.cases||{})[c.name]; if(!m) continue;
  const f=derived.filter(x=>x.startsWith(c.name+": "));
  const kn=(T.KNOWN[c.name]||[]).filter(k=>m.labels&&m.labels.examples.includes(k));
  if(kn.length) console.log("KNOWN "+c.name.padEnd(20)+"  residual carried to Stage 2: "+kn.join("; "));
  console.log((f.length?"FAIL ":"PASS ")+c.name.padEnd(20)+(f.length?"  "+f.map(x=>x.slice(c.name.length+2)).join(" | "):
    "  figures "+m.figures.maxErr+"  camera "+m.camera.clearance+"  overlaps "+Object.values(m.labels.pairs).reduce((a,b)=>a+b,0)+(kn.length?" (known)":"")+"  solid-black "+m.pixels.solidBlocks+"  near-black "+m.pixels.nearBlack)); }
const caseNames=new Set(CASES.map(c=>c.name));
const rest=derived.filter(x=>!(x.indexOf(": ")>0&&caseNames.has(x.slice(0,x.indexOf(": ")))));
if(r.selfTest&&Array.isArray(r.selfTest.checks)) console.log("in-app self-test ("+r.selfTest.ms+" ms): "+r.selfTest.checks.filter(c=>c.ok).length+" of "+r.selfTest.checks.length+" pass; the manifest has "+(MAN?MAN.count:"no")+" checks");
const CU=T.judgeConsole(T.consoleEntries(r)).used;
console.log("console messages judged: "+T.consoleEntries(r).length+(r.mode?"":" (only the last page's: a report made before step 1)")+
  (Object.keys(CU).length?"; allowed by name (CONSOLE_ALLOW): "+Object.entries(CU).map(([k,n])=>k+" "+n).join(", "):""));
rest.forEach(x=>console.log("FAIL "+x));
derived.forEach(x=>out.push(x));
/* 7 */
const dset=new Set(derived), notDerived=(r.failures||[]).filter(f=>!dset.has(f));
const REMEASURED=[/: \d+ items dropped, over the limit of \d+/, /: unobstructed map (at 1280 x 720 )?[\d.]+%, below the baseline [\d.]+%$/,
  /: paper map as entered: [\d.]+ px per true km, below \d+$/, /^the valley fog: .*: \d+ items dropped, over \d+$/];
/* the Watch dwell's one message carries six conditions; it is a note only while its raw numbers meet every condition but the drop
   limit, judged here again (the diff review of roadmap step 1: the pattern alone waved through a darkness, AA or caption failure) */
const DW=r.live&&r.live.dwell, dwellOnlyDrops=!!DW&&DW.E===540&&DW.solid<=T.SOLID_BLACK&&!(DW.belowAA||[]).length&&!!DW.cap&&DW.lit>=1;
const remeasured=f=>REMEASURED.some(re=>re.test(f))||(/^the Watch view in a dwell: /.test(f)&&dwellOnlyDrops);
notDerived.forEach(f=>{ if(r.mode&&remeasured(f)) console.log("NOTE recorded by the run under a limit changed since (remeasure.js), not derived now from its numbers: "+f);
  else { console.log("FAIL (recorded by the run, not derived now) "+f); out.push("(recorded by the run) "+f); } });
console.log(out.length?("FAILURES: "+out.length):"all checks pass for this report"+(so?" (a --selftest-only run: the self-test, the slider, Play and the 3E keys)":""));
process.exit(out.length?1:0);
