#!/usr/bin/env node
/* The final audits' Stage 7, WP-12 (decision 278): the owner's runs of Stage 7's build by the ordinary route (version 4), read by the rules stated
   before them. Reads only: docs/final-stage7-evidence/device/{desk,phone}-S7-*.{txt,json} (the owner's reports, verbatim) and the earlier runs on the
   same devices: for the desktop Stage 8's D1 and D2 (docs/stage8-evidence/device/desk-D*.json, the build decision 268 (a) accepted) and step 6's L3
   (docs/step6-evidence/perf-L3-desktop.json, section 8.3's "today's"); for the phone P5 (docs/step6-evidence/perf-P5-iphone.json, Stage 8's starting
   build by the same route on the same phone, the run decision 269 (b) asks to compare like for like).
   (1) each .txt is the route's own format() of its .json, character for character (the printed table, header and notes agree with the JSON);
   (2) section 8.3's budget on the per-frame maxima (callsMax, trisMax; version 4): the desktop's 900 calls and 2.8 million triangles; the phone's
       heavy views at most 1.62 million triangles, and its segment medians of calls at most 10% above P5's;
   (3) section 8.5's rule (decision 250 (b), unchanged) against each earlier run: no segment's long-frame share rising above 5% where it was under,
       no median interval moving by more than one refresh;
   (4) the desktop: section 8.3's CPU line, js50 not above L3's by more than 1 ms, and the change against D1/D2 (decision 268 (a)'s excess);
   (5) the missed-refresh share: the reports' own (missedPct, from the raw intervals), the earlier runs' estimated as 1 - fps x R (no intervals kept).
   node tools/final-stage7/device-runs.js [--json out.json]   Exit 1 if (1) fails. */
"use strict";
const fs=require("fs"), path=require("path"), vm=require("vm");
const ROOT=path.resolve(__dirname,"..",".."), DIR=path.join(ROOT,"docs","final-stage7-evidence","device");
const OUT=(i=>i>=0?process.argv[i+1]:null)(process.argv.indexOf("--json"));
const box={console:{log(){},error(){}}}; vm.createContext(box); vm.runInContext(fs.readFileSync(path.join(ROOT,"tools","step6","perf-route.js"),"utf8"),box);
const format=box.AUS_PERF.format, rd=f=>JSON.parse(fs.readFileSync(path.join(ROOT,f),"utf8"));
const key=s=>s.id+"|"+s.kind, by=j=>{ const o={}; j.segments.forEach(s=>o[key(s)]=s); return o; };
const r1=x=>x==null?null:Math.round(x*10)/10, est=(s,R)=>s&&s.fps?r1(100*Math.max(0,1-s.fps*R/1000)):null;
const SETS={
  desk:{base:[["L3","docs/step6-evidence/perf-L3-desktop.json"],["D1","docs/stage8-evidence/device/desk-D1.json"],["D2","docs/stage8-evidence/device/desk-D2.json"]], cpuRef:"L3",
    budget:(segs)=>{ const c=mx(segs,"callsMax"), t=mx(segs,"trisMax"); return {callsMax:c, trisMax:t, within:c.v<=900&&t.v<=2.8e6, rule:"at most 900 calls and 2.8 million triangles"}; }},
  phone:{base:[["P5","docs/step6-evidence/perf-P5-iphone.json"]], cpuRef:null,
    budget:(segs,B)=>{ const t=mx(segs,"trisMax"), over=segs.filter(s=>{ const b=B.P5[key(s)]; return b&&b.calls&&s.calls>1.1*b.calls; }).map(key);
      return {trisMax:t, callsMax:mx(segs,"callsMax"), callsOverP5By10pct:over, within:t.v<=1.62e6&&!over.length, rule:"the heaviest frame at most 1.62 million triangles; segment medians of calls at most 10% above P5's"}; }}};
function mx(segs,f){ return segs.reduce((a,s)=>s[f]>a.v?{v:s[f],at:key(s)}:a,{v:0}); }
const bad=[], res={note:"the owner's runs of Stage 7's build read by sections 8.3 and 8.5; nothing here is measured in this container", reports:{}};
for(const kind of Object.keys(SETS)){
  const S=SETS[kind], base=S.base.map(([n,f])=>({n, j:rd(f)})), B={}; base.forEach(b=>B[b.n]=by(b.j));
  for(const f of fs.readdirSync(DIR).filter(f=>new RegExp("^"+kind+"-S7-\\d+\\.json$").test(f)).sort()){
    const j=JSON.parse(fs.readFileSync(path.join(DIR,f),"utf8")), txt=fs.readFileSync(path.join(DIR,f.replace(/\.json$/,".txt")),"utf8").replace(/\n+$/,""), R=j.refreshMs;
    const same=format(j)===txt; if(!same) bad.push(f+": the .txt is not the route's format() of its .json");
    const segs=j.segments.filter(s=>s.kind!=="idle"&&s.frames);
    const rows=segs.map(s=>{ const r={seg:key(s), fps:s.fps, p50:s.p50, max:s.max, longPct:s.longPct, missedPct:s.missedPct, js50:s.js50, calls:s.calls, callsMax:s.callsMax, trisMax:s.trisMax, base:{}, rule85:{}};
      base.forEach(b=>{ const x=B[b.n][key(s)]; if(!x) return; const Rb=b.j.refreshMs;
        r.base[b.n]={fps:x.fps, p50:x.p50, longPct:x.longPct, js50:x.js50, calls:x.calls, missedEst:est(x,Rb)};
        r.rule85[b.n]={median:Math.abs(s.p50-x.p50)<=Math.max(R,Rb), long:!(x.longPct<=5&&s.longPct>5)}; });
      if(S.cpuRef&&r.base[S.cpuRef]&&r.base[S.cpuRef].js50!=null&&s.js50!=null) r.cpuOverRef=r1(s.js50-r.base[S.cpuRef].js50);
      return r; });
    const r85=rows.filter(r=>Object.values(r.rule85).some(x=>!(x.median&&x.long))).map(r=>r.seg+" ("+Object.keys(r.rule85).filter(n=>!(r.rule85[n].median&&r.rule85[n].long)).map(n=>n+": "+(r.rule85[n].median?"":"median ")+(r.rule85[n].long?"":"long "+r.base[n].longPct+"% to "+r.longPct+"%")).join("; ")+")");
    const cpuOver=rows.filter(r=>r.cpuOverRef!=null&&r.cpuOverRef>1).map(r=>r.seg+" +"+r.cpuOverRef), bud=S.budget(segs,B);
    res.reports[f]={started:j.started, version:j.version, build:j.build, refreshMs:R, refreshEndMs:j.refreshEndMs, wakeLock:j.wakeLock, ua:j.device.ua, gl:j.device.glRenderer, load:j.device.load,
      lowTier:j.device.lowTier, txtIsFormat:same, budget83:bud, rule85Fails:r85, cpuOverRefByMoreThan1ms:S.cpuRef?cpuOver:null, longFrames:segs.reduce((a,s)=>a+(s.long||0),0),
      largestMax:mx(segs,"max"), rows:rows};
    const bn=base.map(b=>b.n).join("/");
    console.log("\n"+f+" ("+j.version+", "+j.started+"; R "+R+" ms, at the end "+j.refreshEndMs+"; wake lock "+j.wakeLock+"; lowTier "+j.device.lowTier+")");
    console.log("  build "+j.build.bytes+" bytes, sha256 "+j.build.sha256);
    console.log("  the .txt is the route's format() of the .json: "+(same?"yes":"NO"));
    console.log("  section 8.3 ("+bud.rule+"): "+(bud.within?"within":"NOT within")+"; the heaviest frame "+bud.callsMax.v+" calls ("+bud.callsMax.at+"), "+bud.trisMax.v+" triangles ("+bud.trisMax.at+")"+(bud.callsOverP5By10pct&&bud.callsOverP5By10pct.length?"; calls over P5's by 10%: "+bud.callsOverP5By10pct.join(", "):""));
    console.log("  section 8.5 against "+bn+": "+(r85.length?"FAILS at "+r85.join(", "):"holds in every segment"));
    if(S.cpuRef) console.log("  section 8.3's CPU line (js50 not above "+S.cpuRef+"'s by more than 1 ms): "+(cpuOver.length?"exceeded at "+cpuOver.join(", "):"met in every segment"));
    console.log("  frames over the long bound ("+j.longMs+" ms) "+res.reports[f].longFrames+"; the longest interval "+res.reports[f].largestMax.v+" ms ("+res.reports[f].largestMax.at+")");
    console.log("  "+"segment".padEnd(30)+("fps ("+bn+" -> now)").padEnd(26)+("p50").padEnd(14)+("long% ("+bn+" -> now)").padEnd(24)+("miss% (est. -> now)").padEnd(22)+"js50");
    rows.forEach(r=>{ const v=f=>base.map(b=>r.base[b.n]?r.base[b.n][f]:"-").join("/");
      console.log("  "+r.seg.padEnd(30)+(v("fps")+" -> "+r.fps).padEnd(26)+(v("p50")+" -> "+r.p50).padEnd(14)+(v("longPct")+" -> "+r.longPct).padEnd(24)+(v("missedEst")+" -> "+r.missedPct).padEnd(22)+v("js50")+" -> "+r.js50); });
  }
}
if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
if(bad.length){ bad.forEach(b=>console.log("FAIL "+b)); process.exit(1); }
