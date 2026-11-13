#!/usr/bin/env node
/* The final audits' Stage 7, WP-12 (decision 278): the owner's desktop runs of Stage 7's build by the ordinary route (version 4), read by the rules
   stated before them. Reads only: docs/final-stage7-evidence/device/desk-S7-*.{txt,json} (the owner's reports, verbatim), Stage 8's D1 and D2 on the
   same desktop (docs/stage8-evidence/device/desk-D*.json, the build decision 268 (a) accepted) and step 6's L3 (docs/step6-evidence/perf-L3-desktop.json,
   section 8.3's "today's").
   (1) each .txt is the route's own format() of its .json, character for character (the printed table, header and notes agree with the JSON);
   (2) section 8.3's desktop budget on the per-frame maxima (callsMax, trisMax; version 4) against 900 calls and 2.8 million triangles;
   (3) section 8.5's rule (decision 250 (b), unchanged) against D1/D2 and against L3: no segment's long-frame share rising above 5% where it was under,
       no median interval moving by more than one refresh;
   (4) section 8.3's CPU line, js50 not above L3's by more than 1 ms, and the like-for-like change against D1/D2 (decision 268 (a)'s excess);
   (5) the missed-refresh share: the reports' own (missedPct, from the raw intervals), D1/D2's estimated as 1 - fps x R (no intervals were kept).
   node tools/final-stage7/device-desk.js [--json out.json]   Exit 1 if (1) fails. */
"use strict";
const fs=require("fs"), path=require("path"), vm=require("vm");
const ROOT=path.resolve(__dirname,"..",".."), DIR=path.join(ROOT,"docs","final-stage7-evidence","device");
const OUT=(i=>i>=0?process.argv[i+1]:null)(process.argv.indexOf("--json"));
const box={console:{log(){},error(){}}}; vm.createContext(box); vm.runInContext(fs.readFileSync(path.join(ROOT,"tools","step6","perf-route.js"),"utf8"),box);
const format=box.AUS_PERF.format, rd=f=>JSON.parse(fs.readFileSync(f,"utf8"));
const key=s=>s.id+"|"+s.kind, by=j=>{ const o={}; j.segments.forEach(s=>o[key(s)]=s); return o; };
const r1=x=>x==null?null:Math.round(x*10)/10, est=(s,R)=>s&&s.fps?r1(100*Math.max(0,1-s.fps*R/1000)):null;
const L3=rd(path.join(ROOT,"docs","step6-evidence","perf-L3-desktop.json")), D=[1,2].map(n=>rd(path.join(ROOT,"docs","stage8-evidence","device","desk-D"+n+".json")));
const L3s=by(L3), Ds=D.map(by), bad=[], res={note:"the owner's desktop runs of Stage 7's build read by sections 8.3 and 8.5; nothing here is measured in this container", reports:{}};
const runs=fs.readdirSync(DIR).filter(f=>/^desk-S7-\d+\.json$/.test(f)).sort();
if(!runs.length){ console.log("no desk-S7-*.json"); process.exit(1); }
for(const f of runs){
  const j=rd(path.join(DIR,f)), txt=fs.readFileSync(path.join(DIR,f.replace(/\.json$/,".txt")),"utf8").replace(/\n+$/,""), R=j.refreshMs;
  const same=format(j)===txt; if(!same) bad.push(f+": the .txt is not the route's format() of its .json");
  const segs=j.segments.filter(s=>s.kind!=="idle"&&s.frames);
  const mxC=segs.reduce((a,s)=>s.callsMax>a.v?{v:s.callsMax,at:key(s)}:a,{v:0}), mxT=segs.reduce((a,s)=>s.trisMax>a.v?{v:s.trisMax,at:key(s)}:a,{v:0});
  const rows=segs.map(s=>{ const l=L3s[key(s)], d=Ds.map(x=>x[key(s)]);
    const r={seg:key(s), fps:s.fps, p50:s.p50, max:s.max, longPct:s.longPct, missedPct:s.missedPct, js50:s.js50, gpu50:s.gpu50, callsMax:s.callsMax, trisMax:s.trisMax,
      L3:l?{fps:l.fps,p50:l.p50,longPct:l.longPct,js50:l.js50,missedEst:est(l,L3.refreshMs)}:null,
      D:d.map((x,i)=>x?{fps:x.fps,p50:x.p50,longPct:x.longPct,js50:x.js50,missedEst:est(x,D[i].refreshMs)}:null)};
    r.cpuOverL3=l&&l.js50!=null&&s.js50!=null?r1(s.js50-l.js50):null;
    r.cpuVsD=d.map(x=>x&&x.js50!=null&&s.js50!=null?r1(s.js50-x.js50):null);
    const rule=(b,Rb)=>b?{median:Math.abs(s.p50-b.p50)<=Math.max(R,Rb), long:!(b.longPct<=5&&s.longPct>5)}:null;
    r.rule85={L3:rule(l,L3.refreshMs), D:d.map((x,i)=>rule(x,D[i].refreshMs))};
    return r; });
  const cpuOver=rows.filter(r=>r.cpuOverL3!=null&&r.cpuOverL3>1).map(r=>r.seg+" +"+r.cpuOverL3);
  const r85fail=rows.filter(r=>[r.rule85.L3].concat(r.rule85.D).some(x=>x&&!(x.median&&x.long))).map(r=>r.seg);
  res.reports[f]={started:j.started, version:j.version, build:j.build, refreshMs:R, refreshEndMs:j.refreshEndMs, wakeLock:j.wakeLock, ua:j.device.ua, gl:j.device.glRenderer,
    load:j.device.load, txtIsFormat:same, budget83:{callsMax:mxC, trisMax:mxT, within:mxC.v<=900&&mxT.v<=2.8e6}, rule85Fails:r85fail, cpuOverL3ByMoreThan1ms:cpuOver,
    longFramesOver25ms:segs.reduce((a,s)=>a+(s.long||0),0), largestMax:segs.reduce((a,s)=>s.max>a.v?{v:s.max,at:key(s)}:a,{v:0}), rows:rows};
  console.log("\n"+f+" ("+j.version+", "+j.started+"; R "+R+" ms, at the end "+j.refreshEndMs+"; wake lock "+j.wakeLock+")");
  console.log("  build "+j.build.bytes+" bytes, sha256 "+j.build.sha256);
  console.log("  the .txt is the route's format() of the .json: "+(same?"yes":"NO"));
  console.log("  section 8.3, desktop: the largest frame "+mxC.v+" calls ("+mxC.at+"), "+mxT.v+" triangles ("+mxT.at+"): "+(res.reports[f].budget83.within?"within 900 and 2.8 million":"OVER"));
  console.log("  section 8.5 against L3 and D1/D2: "+(r85fail.length?"fails at "+r85fail.join(", "):"holds in every segment"));
  console.log("  section 8.3's CPU line (js50 not above L3's by more than 1 ms): "+(cpuOver.length?"exceeded at "+cpuOver.join(", "):"met in every segment"));
  console.log("  frames over 25 ms "+res.reports[f].longFramesOver25ms+"; the longest interval "+res.reports[f].largestMax.v+" ms ("+res.reports[f].largestMax.at+")");
  console.log("  "+"segment".padEnd(30)+"fps (D1/D2 -> now)".padEnd(24)+"miss% (D est. -> now)".padEnd(24)+"js50 L3 | D1/D2 -> now".padEnd(28)+"vs L3");
  rows.forEach(r=>console.log("  "+r.seg.padEnd(30)+(r.D.map(x=>x?x.fps:"-").join("/")+" -> "+r.fps).padEnd(24)+(r.D.map(x=>x?x.missedEst:"-").join("/")+" -> "+r.missedPct).padEnd(24)+
    ((r.L3?r.L3.js50:"-")+" | "+r.D.map(x=>x?x.js50:"-").join("/")+" -> "+r.js50).padEnd(28)+(r.cpuOverL3==null?"-":(r.cpuOverL3>0?"+":"")+r.cpuOverL3)));
}
if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
if(bad.length){ bad.forEach(b=>console.log("FAIL "+b)); process.exit(1); }
