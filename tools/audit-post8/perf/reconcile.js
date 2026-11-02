#!/usr/bin/env node
/* Post-Stage-8 final audit, area "perf": the device evidence reconciled (no browser; reads only).
   node tools/audit-post8/perf/reconcile.js [outDir]
   Reads docs/stage8-evidence/device/*.{txt,json} (the ten Stage 8 device reports) and docs/step6-evidence/perf-*.json (L1-L3, P1-P5, P5a, P5b),
   loads tools/step6/perf-route.js unchanged (its format() and bracketVerdict(), the route's own code), and writes:
     <outDir>/rows.csv          every table row of the ten reports with the checks made on it
     <outDir>/reconcile.json    every result, machine-readable
     <outDir>/reconcile.md      the reconciliation report (identity, settings, text reproduction, recomputation, the claims of
                                docs/STAGE8_SPEC.md sections 24-25 recomputed, the historical comparisons, the census)
   Nothing in the repository is written but outDir. */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(__dirname,"..","..","..");
const OUT=path.resolve(process.argv[2]||path.join(ROOT,"docs","audit-post8-evidence","perf"));
const DEV=path.join(ROOT,"docs","stage8-evidence","device"), S6=path.join(ROOT,"docs","step6-evidence");
const ROUTE=require(path.join(ROOT,"tools","step6","perf-route.js")).AUS_PERF;
const EXPECT={bytes:2810630, sha256:"bf27887c177ec68efbaedfe29e9d7826cf89c66ca7390b17e3cda8acf708db07"};
const DESK=["desk-D1","desk-D2","desk-fx","desk-cull","desk-gait"], PHONE=["phone-R1","phone-R2","phone-fx","phone-cull","phone-gait"];
const HIST=["perf-L1-desktop","perf-L2-desktop","perf-L3-desktop","perf-P1-iphone","perf-P2-iphone","perf-P3-iphone","perf-P4-iphone","perf-P5a-oldbuild-iphone","perf-P5b-oldbuild-iphone","perf-P5-iphone"];
const SECS=ROUTE.SECS, PH=ROUTE.PHONE, CULLR=ROUTE.CULLR;

/* ---------- helpers ---------- */
const r1=v=>v==null?null:Math.round(v*10)/10;
const sum=a=>a.reduce((x,y)=>x+y,0);
/* the standard median (the two middle values averaged) and the route's own nearest-rank percentile (perf-route.js pct) */
function median(a){ if(!a.length) return null; const s=a.slice().sort((x,y)=>x-y), m=s.length>>1; return s.length%2?s[m]:(s[m-1]+s[m])/2; }
function pctRoute(a,p){ if(!a.length) return null; const s=a.slice().sort((x,y)=>x-y); return s[Math.min(s.length-1,Math.floor(p*(s.length-1)+0.5))]; }
const mn=a=>Math.min.apply(null,a), mx=a=>Math.max.apply(null,a);
const rng=a=>a.length?(mn(a)===mx(a)?String(mn(a)):mn(a)+"-"+mx(a)):"-";
const pc=(a,b)=>r1(100*(b-a)/a);
function load(dir,f){ return JSON.parse(fs.readFileSync(path.join(dir,f+".json"),"utf8")); }
function deepEq(a,b){ return JSON.stringify(a)===JSON.stringify(b); }

const R={}, TXT={}, H={};
DESK.concat(PHONE).forEach(f=>{ R[f]=load(DEV,f); TXT[f]=fs.readFileSync(path.join(DEV,f+".txt"),"utf8"); });
HIST.forEach(f=>{ H[f]=load(S6,f); });

const res={identity:[], textCheck:[], rowCounts:{}, rowChecks:[], settings:[], blockSettings:[], verdicts:[], claims:[], history:{}, census:{}, timeline:[], notes:[]};

/* ---------- 1. build identity, device, settings, visibility ---------- */
function devLine(f,r){
  const d=r.device||{};
  return {file:f, version:r.version, route:r.route||"ordinary", started:r.started, finished:r.finished,
    bytes:r.build&&r.build.bytes, sha256:r.build&&r.build.sha256, buildOK:!!(r.build&&r.build.bytes===EXPECT.bytes&&r.build.sha256===EXPECT.sha256),
    bodyBytes:d.load&&d.load.bodyBytes, transferBytes:d.load&&d.load.transferBytes, domReadyMs:d.load&&d.load.domReadyMs,
    ua:d.ua, glRenderer:d.glRenderer, cores:d.cores, memoryGB:d.memoryGB, screen:(d.screen||[]).join("x"), viewport:(d.viewport||[]).join("x"), dpr:d.dpr,
    pixelRatio:d.pixelRatio, buffer:(d.buffer||[]).join("x"), lowTier:d.lowTier, fx:d.fx, fxScale:d.fxScale, shadowMap:d.shadowMap, reducedMotion:d.reducedMotion,
    gpuTimer:d.gpuTimer, inFrame:d.inFrame, visibility:d.visibility, refreshMs:r.refreshMs, longMs:r.longMs, notes:r.notes.slice(),
    hiddenSegments:r.segments.filter(s=>s.hidden).map(s=>s.id+" "+s.kind), segments:r.segments.length};
}
DESK.concat(PHONE).forEach(f=>res.identity.push(devLine(f,R[f])));
HIST.forEach(f=>res.identity.push(devLine(f,H[f])));

/* the runs' timeline (rest between runs: start of one minus finish of the one before; the page's load falls inside it) */
[DESK,PHONE].forEach(G=>G.forEach((f,i)=>{ const r=R[f], p=i?R[G[i-1]]:null;
  res.timeline.push({file:f, started:r.started, finished:r.finished, durMin:r1((Date.parse(r.finished)-Date.parse(r.started))/60000),
    restBeforeMin:p?r1((Date.parse(r.started)-Date.parse(p.finished))/60000):null}); }));

/* ---------- 2. the text: the JSON line in each .txt the .json; the whole .txt reproduced by the route's own format() ---------- */
DESK.concat(PHONE).forEach(f=>{
  const txt=TXT[f].replace(/\n$/,""), lines=txt.split("\n"), jl=lines.find(l=>l.startsWith("AUS_PERF_JSON "));
  const fromTxt=jl?JSON.parse(jl.slice("AUS_PERF_JSON ".length)):null;
  const regen=ROUTE.format(R[f]), rl=regen.split("\n");
  const diff=[]; for(let i=0;i<Math.max(lines.length,rl.length);i++) if(lines[i]!==rl[i]) diff.push(i+1);
  /* the table rows: the lines between the header and the verdict / JSON lines */
  const hi=lines.findIndex(l=>/^\s+segment\s+kind\s+frames/.test(l));
  const tableRows=lines.slice(hi+1).filter(l=>!/^(AUS_PERF_JSON|CULLING|EFFECTS|GAIT|NOTE)/.test(l)).length;
  res.textCheck.push({file:f, jsonLineEqualsJsonFile:deepEq(fromTxt,R[f]), textReproducedByFormat:diff.length===0, differingLines:diff, tableRows, segments:R[f].segments.length});
});

/* ---------- 3. every row: what can be recomputed from the JSON, and its internal consistency ----------
   The JSON keeps each segment's summary, not its frame intervals: fps, p50, p95 and the long count cannot be recomputed from raw intervals
   (the route does not keep them). What can: longPct from long/frames (as the route computes it); the span the fps implies (frames/fps) against the
   segment's own sampling window; the percentiles' order; the long count against the percentiles (the route's nearest-rank pct). */
function nominalSecs(r,s){
  const route=r.route||"ordinary";
  if(s.kind==="idle") return SECS.idle;
  if(route==="phone") return s.kind==="warm-up"?PH.warm:PH.secs;
  if(r.bracket) return s.kind==="warm-up"?r.bracket.warm:r.bracket.secs;
  if(s.kind==="held") return SECS.held; if(s.kind==="played") return SECS.played; return SECS.move;
}
function checkRow(f,r,s,rowIdx){
  const secs=nominalSecs(r,s), win=secs-SECS.warm;   /* the intervals counted: t >= 0.5 s of a window of secs*1000+100 ms from the sample's call */
  const span=s.fps?s.frames/s.fps:null;              /* seconds, implied by the route's fps = frames/(sum dt/1000) */
  const longPctRe=s.frames?r1(100*s.long/s.frames):null;
  const order=[s.p50,s.p90,s.p95,s.p99,s.max].every((v,i,a)=>i===0||v==null||a[i-1]==null||a[i-1]<=v);
  const longMs=r.longMs, n=s.frames;
  /* with the route's nearest-rank percentile: p_q > longMs exactly when long > n-1-idx(q), idx(q)=floor(q(n-1)+0.5) (strict ">" both sides) */
  const idx=q=>Math.min(n-1,Math.floor(q*(n-1)+0.5));
  const cons=q=>{ const k=n-1-idx(q); const v=q===0.5?s.p50:q===0.9?s.p90:q===0.95?s.p95:s.p99; if(v==null) return true;
    /* v is rounded to 0.1 ms: within 0.05 of longMs it cannot be told */
    if(Math.abs(v-longMs)<0.05) return true; return (v>longMs)===(s.long>k); };
  const consistent=n?[0.5,0.9,0.95,0.99].every(cons):true;
  const fpsVsP50=s.fps&&s.p50?r1(1000/s.fps):null;    /* the mean interval */
  const row={file:f, i:rowIdx, id:s.id, kind:s.kind, cand:s.cand||"", order:s.order||"", round:s.round||"", block:s.block==null?"":s.block,
    frames:s.frames, drawn:s.drawn, fps:s.fps, meanMs:fpsVsP50, p50:s.p50, p90:s.p90, p95:s.p95, p99:s.p99, max:s.max, long:s.long, longPct:s.longPct,
    longPctRecomputed:longPctRe, longPctOK:longPctRe===s.longPct, warmMax:s.warmMax, js50:s.js50, js95:s.js95, gpu50:s.gpu50, gpu95:s.gpu95, gpuN:s.gpuN,
    calls:s.calls, tris:s.tris, hidden:s.hidden, nominalSecs:secs, impliedSpanS:span==null?null:Math.round(span*1000)/1000,
    spanVsWindow:span==null?null:Math.round((span-win)*1000)/1000, percentilesOrdered:order, longVsPercentilesConsistent:consistent,
    drawnEqFrames:s.drawn===s.frames,
    missedRefreshPct:s.fps&&r.refreshMs?r1(100*Math.max(0,1-s.fps*r.refreshMs/1000)):null,   /* 1 - fps x R: refreshes that brought no new frame */
    setOn:s.setOn==null?"":s.setOn, set:s.set?("density "+s.set.density+" pass "+(s.set.shadowPass?"on":"off")+" cast "+s.set.figCast+"/"+s.set.fig+" shown "+s.set.figShown+"/"+s.set.fig):""};
  return row;
}
DESK.concat(PHONE).forEach(f=>{ const r=R[f]; r.segments.forEach((s,i)=>res.rowChecks.push(checkRow(f,r,s,i))); res.rowCounts[f]=r.segments.length; });
res.rowCounts.desktop=sum(DESK.map(f=>R[f].segments.length)); res.rowCounts.phone=sum(PHONE.map(f=>R[f].segments.length));
res.rowCounts.total=res.rowCounts.desktop+res.rowCounts.phone;
const RC=res.rowChecks;
res.rowSummary={rows:RC.length, longPctMismatch:RC.filter(x=>!x.longPctOK).map(x=>x.file+"#"+x.i),
  percentileOrderViolations:RC.filter(x=>!x.percentilesOrdered).map(x=>x.file+"#"+x.i),
  longVsPercentileInconsistent:RC.filter(x=>!x.longVsPercentilesConsistent).map(x=>x.file+"#"+x.i),
  drawnNotFrames:RC.filter(x=>!x.drawnEqFrames).map(x=>x.file+"#"+x.i+" ("+x.drawn+"/"+x.frames+")"),
  spanVsWindow:{min:mn(RC.filter(x=>x.spanVsWindow!=null).map(x=>x.spanVsWindow)), max:mx(RC.filter(x=>x.spanVsWindow!=null).map(x=>x.spanVsWindow)),
    worst:RC.filter(x=>x.spanVsWindow!=null).sort((a,b)=>Math.abs(b.spanVsWindow)-Math.abs(a.spanVsWindow)).slice(0,6).map(x=>x.file+" "+x.id+" "+x.kind+": "+x.spanVsWindow+" s")},
  hidden:RC.filter(x=>x.hidden).length};

/* ---------- 4. the per-block settings: each block's switch as it read on the page ---------- */
DESK.concat(PHONE).forEach(f=>{ const r=R[f];
  if(r.route==="phone"){
    const want={A:{density:1,shadowPass:true,cast:315,shown:342}, figShadow:{density:1,shadowPass:true,cast:0,shown:342}, shadowPass:{density:1,shadowPass:false,cast:315,shown:342},
      density1:{density:1,shadowPass:true,cast:315,shown:342}, density1Pass:{density:1,shadowPass:false,cast:315,shown:342}, figures:{density:1,shadowPass:true,cast:315,shown:0}};
    r.segments.filter(s=>s.set).forEach(s=>{ const w=want[s.cand], ok=w&&s.set.density===w.density&&s.set.shadowPass===w.shadowPass&&s.set.figCast===w.cast&&s.set.figShown===w.shown&&s.set.fig===342;
      res.blockSettings.push({file:f, id:s.id, kind:s.kind, cand:s.cand, set:s.set, asIntended:!!ok}); });
  }
  if(r.bracket) r.segments.filter(s=>s.order).forEach(s=>res.blockSettings.push({file:f, id:s.id, kind:s.kind, cand:s.cand, setOn:s.setOn, asIntended:s.setOn===(s.cand==="A")}));
});
res.blockSettingsSummary={blocks:res.blockSettings.length, notAsIntended:res.blockSettings.filter(b=>!b.asIntended).map(b=>b.file+" "+b.id+" "+b.kind)};

/* ---------- 5. the bracket verdicts recomputed with the route's own rule ---------- */
DESK.concat(PHONE).filter(f=>R[f].bracket).forEach(f=>{ const r=R[f], BK=ROUTE.BRACKETS[r.route];
  const V=ROUTE.bracketVerdict(r.segments,BK);
  Object.keys(V).forEach(id=>res.verdicts.push({file:f, view:id, recomputed:V[id].verdict, faster:V[id].faster, slower:V[id].slower, neither:V[id].neither, missing:V[id].missing,
    stored:r.bracketVerdict[id].verdict, same:deepEq(V[id],r.bracketVerdict[id])})); });

/* ---------- 6. the claims of docs/STAGE8_SPEC.md sections 24 and 25, recomputed ---------- */
function claim(where,text,ok,computed,method,notes){ res.claims.push({where,claim:text,verification:ok===true?"verified":ok===false?"contradicted":ok,computed,method,notes:notes||""}); }
const seg=(r,id,kind)=>r.segments.find(s=>s.id===id&&s.kind===kind);
const L3=H["perf-L3-desktop"], D1=R["desk-D1"], D2=R["desk-D2"], P5=H["perf-P5-iphone"], P3=H["perf-P3-iphone"], P4=H["perf-P4-iphone"];
const ORD=D1.segments.map(s=>s.id+"|"+s.kind);

/* 24: identity and device */
claim("§24 intro","every desktop report names the build 2,810,630 bytes, SHA-256 bf27887c...db07",DESK.every(f=>res.identity.find(x=>x.file===f).buildOK),
  DESK.map(f=>f+": "+R[f].build.bytes+" "+R[f].build.sha256.slice(0,8)).join("; "),"read build.bytes/sha256 from each JSON");
claim("§24 intro","Chrome 156, RTX 4070 (ANGLE D3D11), 32 cores, 32 GB, 2560x1440, refresh 6.9 ms, page 2560x1305 at density 1, effects on at 1.3, not lowTier, wrapper page",
  DESK.every(f=>{ const d=R[f].device; return /Chrome\/156/.test(d.ua)&&/RTX 4070/.test(d.glRenderer)&&d.cores===32&&d.memoryGB===32&&d.screen.join("x")==="2560x1440"&&d.viewport.join("x")==="2560x1305"&&d.pixelRatio===1&&d.fx===true&&d.fxScale===1.3&&d.lowTier===false&&d.inFrame===true&&R[f].refreshMs===6.9; }),
  "all five","device fields of each JSON");
claim("§24 intro","starts D1 07:01, D2 07:08, fx 07:11, cull 07:16, gait 07:25 UTC",DESK.map(f=>R[f].started.slice(11,16)).join(",")==="07:01,07:08,07:11,07:16,07:25",DESK.map(f=>R[f].started.slice(11,16)).join(", "),"started");
claim("§24 intro","165 rows of 165",res.rowCounts.desktop===165,res.rowCounts.desktop+" segments; every row reproduced by format(): "+DESK.every(f=>res.textCheck.find(x=>x.file===f).textReproducedByFormat),"count segments; regenerate the text with perf-route.js format()");
claim("§24 intro","L3: same desktop, same page size, the wrapper page, build 2,218,404 bytes (md5 c9d29c14...)",
  /RTX 4070/.test(L3.device.glRenderer)&&L3.device.viewport.join("x")==="2560x1305"&&L3.device.inFrame===true&&L3.build.bytes===2218404?"partly":false,
  "L3: "+L3.device.ua.match(/Chrome\/[\d.]+/)[0]+" (D1/D2: "+D1.device.ua.match(/Chrome\/[\d.]+/)[0]+"), "+L3.build.bytes+" bytes sha256 "+L3.build.sha256.slice(0,8)+"; started "+L3.started,
  "device fields of L3 against D1/D2","the GPU, screen, viewport, density, effects scale and wrapper match; the browser does not: L3 ran Chrome 155, D1/D2 Chrome 156 (not stated in §24)");

/* 24.1: section 8.5's rule */
const med=(r,ex)=>r.segments.filter(s=>s.kind!=="idle"&&!(ex&&ex(s))).map(s=>s.p50);
const p50Diffs=[D1,D2].map(r=>r.segments.filter(s=>s.kind!=="idle").map(s=>{ const l=seg(L3,s.id,s.kind); return {id:s.id+" "+s.kind, now:s.p50, L3:l?l.p50:null}; }));
const nonPlay=p50Diffs.flat().filter(x=>!/^play/.test(x.id)), play=p50Diffs.flat().filter(x=>/^play/.test(x.id));
claim("§24.1","every median 6.9 ms as in L3 but the two Play segments, 7.0 against 6.9",
  nonPlay.every(x=>x.now===6.9&&x.L3===6.9)&&play.every(x=>x.now===7&&x.L3===6.9),
  "non-Play p50 now "+rng(nonPlay.map(x=>x.now))+" (L3 "+rng(nonPlay.map(x=>x.L3))+"); Play now "+rng(play.map(x=>x.now))+" (L3 "+rng(play.map(x=>x.L3))+")","segment p50, D1/D2 against L3");
const deskRows=RC.filter(x=>x.file.startsWith("desk"));
const maxLongPct=mx(deskRows.map(x=>x.longPct)), maxLongRows=deskRows.filter(x=>x.longPct===maxLongPct&&x.longPct>0);
claim("§24.1","the largest long-frame share 0.2% (one frame of 34.7 ms in D2's pratzen-low-10x held; D1 none)",
  maxLongPct===0.2&&maxLongRows.length===1&&maxLongRows[0].file==="desk-D2"&&maxLongRows[0].id==="pratzen-low-10x"&&maxLongRows[0].kind==="held"&&maxLongRows[0].long===1&&maxLongRows[0].max===34.7&&RC.filter(x=>x.file==="desk-D1").every(x=>x.long===0),
  "max longPct "+maxLongPct+" at "+maxLongRows.map(x=>x.file+" "+x.id+" "+x.kind+" ("+x.long+" of "+x.frames+", max "+x.max+")").join("; ")+"; D1 long total "+sum(RC.filter(x=>x.file==="desk-D1").map(x=>x.long)),"rows");
const longAll=deskRows.reduce((a,x)=>a+x.long,0), longestPost=mx(deskRows.map(x=>x.max)), longestWarm=mx(deskRows.map(x=>x.warmMax));
const warmOver=deskRows.filter(x=>x.warmMax>25);
const decisive=["overview","pratzen-low-4x","pratzen-low-10x","ph8-overview"];
const decisiveLong=deskRows.filter(x=>decisive.indexOf(x.id)>=0&&/orbit|cull [AB]|warm-up/.test(x.kind)&&x.long>0);
claim("§24.1","across the five reports nine frames over 25 ms in all, the longest 41.6 ms, none in a decisive orbit",
  longAll===9&&longestPost===41.6&&decisiveLong.filter(x=>/^orbit/.test(x.kind)).length===0?"partly":false,
  "long (after each segment's first 0.5 s) "+longAll+"; longest after 0.5 s "+longestPost+" ms ("+deskRows.filter(x=>x.max===longestPost).map(x=>x.file+" "+x.id+" "+x.kind).join(", ")+"); in the first 0.5 s (warm column, not counted) "+warmOver.length+" segments over 25 ms, the longest "+longestWarm+" ms ("+deskRows.filter(x=>x.warmMax===longestWarm).map(x=>x.file+" "+x.id+" "+x.kind).join(", ")+"); long frames in the decisive views' bracket/warm-up blocks: "+decisiveLong.map(x=>x.file+" "+x.id+" "+x.kind+" "+x.long).join("; "),
  "sum of long; max of max; max of warmMax","true of the counted intervals (each segment after its first 0.5 s); the excluded first 0.5 s holds longer frames (warm column) and the statement 'in all' does not say so");
/* 8.3 desktop */
const buildRows=deskRows.filter(x=>!(x.file==="desk-cull"&&x.cand==="B")&&!(x.file==="desk-fx"&&x.cand==="B")&&!/-figures|-effects/.test(x.kind)&&x.calls!=null);
const allMeas=deskRows.filter(x=>x.calls!=null);
const maxCalls=mx(buildRows.map(x=>x.calls)), maxTris=mx(buildRows.map(x=>x.tris));
claim("§24.1","8.3 desktop: the heaviest frame 839 draw calls (the Overview's orbit) and 2,289,649 triangles (Play at 4x), against 900 and 2.8 million",
  maxCalls===839&&maxTris===2289649?"partly":false,
  "max over the segments' MEDIAN calls "+maxCalls+" ("+buildRows.filter(x=>x.calls===maxCalls).map(x=>x.file+" "+x.id+" "+x.kind).join(", ")+"), median tris "+maxTris+" ("+buildRows.filter(x=>x.tris===maxTris).map(x=>x.file+" "+x.id+" "+x.kind).join(", ")+"); over every measured row incl. culling-off B blocks: calls "+mx(allMeas.map(x=>x.calls))+", tris "+mx(allMeas.map(x=>x.tris)),
  "max of per-segment medians (the route records calls/tris as each segment's median drawn frame: pct(...,0.5))","the numbers are right as segment medians; 'the heaviest frame' is not measured by the route (no per-frame maximum is kept)");
const L3c=(id,k)=>seg(L3,id,k);
const tri=(r,id,k)=>seg(r,id,k).tris, cal=(r,id,k)=>seg(r,id,k).calls;
const c1=[pc(tri(L3,"overview","held"),tri(D1,"overview","held")),pc(tri(L3,"overview","orbit"),tri(D1,"overview","orbit")),pc(tri(L3,"pratzen-low-4x","held"),tri(D1,"pratzen-low-4x","held")),pc(tri(L3,"play-4x","played"),tri(D1,"play-4x","played"))];
claim("§24.1","against L3: the Overview 2,523,605 to 1,978,147 held and 2,125,343 in orbit (-21.6%, -15.8%); the low view at 4x 2,480,187 to 1,714,213 held (-30.9%); Play at 4x 2,496,647 to 2,289,649 (-8.3%)",
  tri(L3,"overview","held")===2523605&&tri(D1,"overview","held")===1978147&&tri(D1,"overview","orbit")===2125343&&tri(L3,"pratzen-low-4x","held")===2480187&&tri(D1,"pratzen-low-4x","held")===1714213&&tri(L3,"play-4x","played")===2496647&&tri(D1,"play-4x","played")===2289649&&c1.join()==="-21.6,-15.8,-30.9,-8.3",
  "D1: "+c1.join("%, ")+"% (L3 orbit tris "+tri(L3,"overview","orbit")+" = its held); D2: overview held "+tri(D2,"overview","held")+", orbit "+tri(D2,"overview","orbit")+", low 4x held "+tri(D2,"pratzen-low-4x","held")+", play-4x "+tri(D2,"play-4x","played"),
  "segment median tris, D1 against L3","D1's figures; the held comparison mixes frames: since 8B a held view reuses the ground's depth (147,088 triangles fewer), L3's held drew it; the orbit (-15.8%) is the like-for-like one");
claim("§24.1","the low views fewer calls (761 to 592 held at 4x); the Overview's calls 832 to 837-839 (+0.8%)",
  cal(L3,"pratzen-low-4x","held")===761&&cal(D1,"pratzen-low-4x","held")===592&&cal(L3,"overview","held")===832&&[cal(D1,"overview","held"),cal(D1,"overview","orbit"),cal(D2,"overview","held"),cal(D2,"overview","orbit")].every(c=>c>=837&&c<=839),
  "L3 761 -> D1 "+cal(D1,"pratzen-low-4x","held")+"/D2 "+cal(D2,"pratzen-low-4x","held")+"; Overview L3 "+cal(L3,"overview","held")+" -> D1 "+cal(D1,"overview","held")+"/"+cal(D1,"overview","orbit")+", D2 "+cal(D2,"overview","held")+"/"+cal(D2,"overview","orbit"),"segment median calls");
/* integrated-GPU condition: no 4x frame rose > 10% in tris or calls against L3 (4x: every segment but the 1x and 10.33x views; the -figures and
   -effects segments are diagnostics, listed apart) */
const rises=[];
[D1,D2].forEach((r,ri)=>r.segments.filter(s=>s.calls!=null).forEach(s=>{ const l=seg(L3,s.id,s.kind); if(!l||l.calls==null) return;
  rises.push({run:ri?"D2":"D1", id:s.id+" "+s.kind, x4:!/pratzen-low-(1x|10x)/.test(s.id), diag:/-figures|-effects/.test(s.kind), dCalls:pc(l.calls,s.calls), dTris:pc(l.tris,s.tris)}); }));
const own4=rises.filter(x=>x.x4&&!x.diag), diag4=rises.filter(x=>x.x4&&x.diag), not4=rises.filter(x=>!x.x4);
const mC=a=>mx(a.map(x=>x.dCalls)), mT=a=>mx(a.map(x=>x.dTris)), at=(a,k,v)=>a.filter(x=>x[k]===v).map(x=>x.run+" "+x.id).join(", ");
claim("§24.1","no 4x frame of the route rose by more than 10% in triangles or calls against L3 (the largest rise +0.8% in calls)",
  mC(own4)===0.8&&mT(own4)<=10&&mC(diag4)<=10&&mT(diag4)<=10?"verified":mC(own4)<=10&&mT(own4)<=10?"partly":false,
  "4x, the build's own segments: largest rise in calls "+mC(own4)+"% ("+at(own4,"dCalls",mC(own4))+"), in triangles "+mT(own4)+"% ("+at(own4,"dTris",mT(own4))+"); 4x diagnostics (figures hidden, effects off): calls up to "+mC(diag4)+"% ("+at(diag4,"dCalls",mC(diag4))+"), triangles up to "+mT(diag4)+"%; outside the condition (1x, 10.33x): calls up to "+mC(not4)+"%, triangles up to "+mT(not4)+"% ("+at(not4,"dTris",mT(not4))+")",
  "every D1/D2 segment's median calls/tris against L3's same segment",
  "holds as worded (4x); the 1x view's moving frame rose "+mT(not4)+"% in triangles (231,985 to 380,601: the ground's depth pass of 8B drawn while the eye moves), outside the condition");
res.history.risesVsL3=rises;
/* 8.3 animation: the gait bracket */
const DG=R["desk-gait"], gA=DG.segments.filter(s=>s.order&&s.cand==="A"), gB=DG.segments.filter(s=>s.order&&s.cand==="B");
claim("§24.1","the gait bracket's two sides the same frame (802 calls each; triangles within 68); script median 7.2-7.4 ms with the gait, 7.2-7.3 at rest; GPU 4.5-4.6 on both",
  gA.concat(gB).every(s=>s.calls===802)&&(mx(gA.concat(gB).map(s=>s.tris))-mn(gA.concat(gB).map(s=>s.tris)))<=68&&rng(gA.map(s=>s.js50))==="7.2-7.4"&&rng(gB.map(s=>s.js50))==="7.2-7.3"&&mn(gA.concat(gB).map(s=>s.gpu50))>=4.5&&mx(gA.concat(gB).map(s=>s.gpu50))<=4.6,
  "calls A "+rng(gA.map(s=>s.calls))+" B "+rng(gB.map(s=>s.calls))+"; tris spread "+(mx(gA.concat(gB).map(s=>s.tris))-mn(gA.concat(gB).map(s=>s.tris)))+"; js50 A "+rng(gA.map(s=>s.js50))+" (median "+median(gA.map(s=>s.js50))+") B "+rng(gB.map(s=>s.js50))+" (median "+median(gB.map(s=>s.js50))+"); gpu50 A "+rng(gA.map(s=>s.gpu50))+" B "+rng(gB.map(s=>s.gpu50)),
  "desk-gait bracket blocks","the numbers hold; the reading 'the gait adds none' (§24.1, CPU) over-reads them: block B runs gaitStep's checks and the shader hook at amplitude 0, and the blocks' js50 resolve 0.1 ms with a 0.2 ms spread");
/* 8.3 CPU: js50 L3 -> D1/D2 */
const js=(r,id,k)=>seg(r,id,k).js50;
const cpu=[["overview","orbit"],["overview","orbit -effects"],["play-half","played"],["play-4x","played"]].map(([id,k])=>({seg:id+" "+k, L3:js(L3,id,k), D1:js(D1,id,k), D2:js(D2,id,k), d1:r1(js(D1,id,k)-js(L3,id,k)), d2:r1(js(D2,id,k)-js(L3,id,k))}));
const others=[D1,D2].map(r=>r.segments.filter(s=>s.js50!=null&&!/^(overview\|orbit|overview\|orbit -effects|play-half\|played|play-4x\|played)$/.test(s.id+"|"+s.kind)).map(s=>r1(s.js50-js(L3,s.id,s.kind)))).flat();
claim("§24.1","js50 L3 to D1/D2: Overview orbit 4.8 to 5.8/5.9 (+1.0/+1.1), orbit -effects 4.0 to 5.1/5.1 (+1.1), Play half 6.1 to 7.6/7.6 (+1.5), Play 4x 6.0 to 6.9/7.0 (+0.9/+1.0); every other segment -0.2 to +0.9",
  cpu.map(c=>c.L3+">"+c.D1+"/"+c.D2).join(";")==="4.8>5.8/5.9;4>5.1/5.1;6.1>7.6/7.6;6>6.9/7"&&mn(others)===-0.2&&mx(others)===0.9,
  cpu.map(c=>c.seg+": "+c.L3+" -> "+c.D1+"/"+c.D2+" ("+c.d1+"/"+c.d2+")").join("; ")+"; others "+mn(others)+" to "+mx(others),
  "segment js50, D1/D2 against L3","L3 ran Chrome 155, D1/D2 Chrome 156: the rise is Stage 8's and the browser's together, not separable from these runs");
const DC=R["desk-cull"], cA=v=>DC.segments.filter(s=>s.order&&s.id===v&&s.cand==="A"), cB=v=>DC.segments.filter(s=>s.order&&s.id===v&&s.cand==="B");
claim("§24.1","culling removes about 0.9 ms (5.1-5.2 ms with culling, 6.0-6.1 without, both low views)",
  ["pratzen-low-4x","pratzen-low-10x"].every(v=>mn(cA(v).map(s=>s.js50))>=5.1&&mx(cA(v).map(s=>s.js50))<=5.2&&mn(cB(v).map(s=>s.js50))>=6.0&&mx(cB(v).map(s=>s.js50))<=6.1),
  ["pratzen-low-4x","pratzen-low-10x"].map(v=>v+": A "+rng(cA(v).map(s=>s.js50))+" B "+rng(cB(v).map(s=>s.js50))+" (medians "+median(cA(v).map(s=>s.js50))+"/"+median(cB(v).map(s=>s.js50))+")").join("; "),"desk-cull bracket blocks' js50");
/* 24.2 */
const pl=r=>["play-4x","play-half"].map(id=>seg(r,id,"played"));
claim("§24.2","L3 Play 139-140 fps with p95 at 7.1; now 120-124 with p95 13.9",
  rng(pl(L3).map(s=>s.fps))==="139-139.7"&&pl(L3).every(s=>s.p95===7.1)&&mn(pl(D1).concat(pl(D2)).map(s=>s.fps))>=120&&mx(pl(D1).concat(pl(D2)).map(s=>s.fps))<=124.9&&pl(D1).concat(pl(D2)).every(s=>s.p95===13.9),
  "L3 fps "+rng(pl(L3).map(s=>s.fps))+" p95 "+rng(pl(L3).map(s=>s.p95))+"; D1/D2 fps "+pl(D1).concat(pl(D2)).map(s=>s.fps).join(", ")+" p95 "+rng(pl(D1).concat(pl(D2)).map(s=>s.p95)),"played segments");
const held2=pl(D1).concat(pl(D2)).map(s=>r1(100*(144/s.fps-1)));
claim("§24.2","about one frame in five or six held for two refreshes",
  "partly",
  "if every interval is one or two refreshes (6.94/13.9 ms): share of frames held two = 144/fps-1 = "+held2.join(", ")+"% (one in "+held2.map(h=>r1(100/h)).join(", ")+"); the missed-refresh share 1-fps/144 = "+pl(D1).concat(pl(D2)).map(s=>r1(100*(1-s.fps/144))).join(", ")+"%; p90 13.9 and max 20.9 (three refreshes occur)",
  "derived from fps; the route keeps no interval histogram","an estimate under a one-or-two-refresh assumption, consistent with p50 7.0/p90 13.9; not a count");
claim("§24.2","the script's p95 8.4-9.0 ms in Play (L3 6.6-6.8), GPU median 4.5-4.6",
  rng(pl(D1).concat(pl(D2)).map(s=>s.js95))==="8.4-9"&&rng(pl(L3).map(s=>s.js95))==="6.6-6.8"&&rng(pl(D1).concat(pl(D2)).map(s=>s.gpu50))==="4.5-4.6",
  "js95 "+pl(D1).concat(pl(D2)).map(s=>s.js95).join(", ")+" (L3 "+pl(L3).map(s=>s.js95).join(", ")+"); js50 "+pl(D1).concat(pl(D2)).map(s=>s.js50).join(", ")+" (L3 "+pl(L3).map(s=>s.js50).join(", ")+"); gpu50 "+pl(D1).concat(pl(D2)).map(s=>s.gpu50).join(", "),"played segments",
  "js50 itself (6.9-7.6 ms) is at or above the 6.94 ms refresh in Play, which supports 'limited by the script' more directly than js95");
/* brackets on the desktop */
const dv=res.verdicts.filter(v=>v.file.startsWith("desk"));
claim("§24.2","the three brackets 'not shown', each 12 comparisons of 12 'neither'",dv.every(v=>v.recomputed==="not shown"&&v.neither===12&&v.faster===0&&v.slower===0),
  dv.map(v=>v.file+" "+v.view+": "+v.faster+"/"+v.slower+"/"+v.neither+"/"+v.missing).join("; "),"bracketVerdict() of perf-route.js re-run on the segments");
const brBlocks=["desk-fx","desk-cull","desk-gait"].map(f=>R[f].segments.filter(s=>s.order)).flat();
claim("§24.2","every block's median interval 6.9 ms (7.0 in Play)",brBlocks.filter(s=>s.id!=="play-half").every(s=>s.p50===6.9)&&brBlocks.filter(s=>s.id==="play-half").every(s=>s.p50===7),
  "orbit blocks p50 "+rng(brBlocks.filter(s=>s.id!=="play-half").map(s=>s.p50))+"; Play blocks "+rng(brBlocks.filter(s=>s.id==="play-half").map(s=>s.p50)),"bracket blocks");
const FXD=R["desk-fx"], fA=FXD.segments.filter(s=>s.order&&s.cand==="A"), fB=FXD.segments.filter(s=>s.order&&s.cand==="B");
const uA=[...new Set(fA.map(s=>s.tris))].sort(), uB=[...new Set(fB.map(s=>s.tris))].sort();
const triDiff=uA.length===uB.length?uA.map((v,i)=>v-uB[i]):null;
claim("§24.2","effects off saves about 0.5 ms of script (4.6-4.7 against 5.1-5.2); 5-10 calls fewer; the same triangles within 10",
  rng(fB.map(s=>s.js50))==="4.6-4.7"&&rng(fA.map(s=>s.js50))==="5.1-5.2"&&triDiff&&triDiff.every(d=>Math.abs(d)<=10)&&(mn(fA.map(s=>s.calls))-mx(fB.map(s=>s.calls)))>=5&&(mx(fA.map(s=>s.calls))-mn(fB.map(s=>s.calls)))<=10,
  "js50 A "+rng(fA.map(s=>s.js50))+" B "+rng(fB.map(s=>s.js50))+"; calls A "+rng(fA.map(s=>s.calls))+" B "+rng(fB.map(s=>s.calls))+"; triangles take two orbit states on each side, A "+uA.join("/")+", B "+uB.join("/")+" (A-B "+(triDiff||[]).join(", ")+")","desk-fx blocks");
const c4A=cA("pratzen-low-4x"), c4B=cB("pratzen-low-4x"), c10A=cA("pratzen-low-10x"), c10B=cB("pratzen-low-10x");
claim("§24.2","culling at 4x 597-600 calls and 1,872,779-1,875,699 triangles against 784-786 and 2,208,415 (-24%, -15%); at 10.33x 624-625 and about 1.90 million against 786-787 and about 2.21 million; about 0.9 ms of script fewer",
  rng(c4A.map(s=>s.calls))==="597-600"&&rng(c4A.map(s=>s.tris))==="1872779-1875699"&&rng(c4B.map(s=>s.calls))==="784-786"&&rng(c4B.map(s=>s.tris))==="2208415"&&rng(c10A.map(s=>s.calls))==="624-625"&&rng(c10B.map(s=>s.calls))==="786-787",
  "4x A calls "+rng(c4A.map(s=>s.calls))+" tris "+rng(c4A.map(s=>s.tris))+"; B calls "+rng(c4B.map(s=>s.calls))+" tris "+rng(c4B.map(s=>s.tris))+" ("+pc(median(c4B.map(s=>s.calls)),median(c4A.map(s=>s.calls)))+"%, "+pc(median(c4B.map(s=>s.tris)),median(c4A.map(s=>s.tris)))+"%); 10x A calls "+rng(c10A.map(s=>s.calls))+" tris "+rng(c10A.map(s=>s.tris))+"; B calls "+rng(c10B.map(s=>s.calls))+" tris "+rng(c10B.map(s=>s.tris)),"desk-cull blocks");
const gpuBr=brBlocks.map(s=>s.gpu50);
claim("§24.2","the GPU's medians fall near 2.2-2.6 or near 3.8-4.6 ms in blocks of either side alike","partly",
  "bracket blocks' gpu50: "+JSON.stringify(gpuBr.reduce((o,v)=>{ o[v]=(o[v]||0)+1; return o; },{})),"histogram of gpu50 over the desktop bracket blocks","inference about GPU clock states is the record's own; the values are bimodal as stated (see histogram)");
const loads=DESK.map(f=>R[f].device.load);
claim("§24.2","the first report fetched 1,219,603 bytes, DOM ready 5.9 s; the others from cache (2.6-2.8 s)",
  loads[0].transferBytes===1219603&&r1(loads[0].domReadyMs/1000)===5.9&&loads.slice(1).every(l=>l.transferBytes<=300)&&mn(loads.slice(1).map(l=>l.domReadyMs))>=2550&&mx(loads.slice(1).map(l=>l.domReadyMs))<=2849,
  loads.map((l,i)=>DESK[i]+" "+l.transferBytes+" B, "+l.domReadyMs+" ms").join("; "),"device.load","two of the four cached loads transferred 300 bytes (a revalidation, the body from the cache)");

/* 25: the phone */
claim("§25 intro","every phone report names 2,810,630 bytes, SHA-256 bf27887c...db07",PHONE.every(f=>res.identity.find(x=>x.file===f).buildOK),PHONE.map(f=>R[f].build.bytes+" "+R[f].build.sha256.slice(0,8)).join("; "),"build fields");
claim("§25 intro","Safari 26.6.1, viewport 402x714, density 3, lowTier, drawn at density 1",
  PHONE.every(f=>{ const d=R[f].device; return /Version\/26\.6\.1/.test(d.ua)&&d.viewport.join("x")==="402x714"&&d.dpr===3&&d.lowTier===true&&d.pixelRatio===1; }),"all five","device fields","'the sun casting no shadow' is not recorded by the route (it reads renderer.shadowMap.enabled, true on every phone report); it follows from app.js:646 (sun.castShadow=!lowTier)");
claim("§25 intro","starts R1 07:50, R2 08:00, fx 08:10, cull 08:22, gait 08:35",PHONE.map(f=>R[f].started.slice(11,16)).join(",")==="07:50,08:00,08:10,08:22,08:35",PHONE.map(f=>R[f].started.slice(11,16)).join(", "),"started");
claim("§25 intro","184 rows of 184",res.rowCounts.phone===184,res.rowCounts.phone+"; every row reproduced by format(): "+PHONE.every(f=>res.textCheck.find(x=>x.file===f).textReproducedByFormat),"count; format()");
const PR=[R["phone-R1"],R["phone-R2"]];
const As=(kind)=>PR.map(r=>r.segments.filter(s=>s.id===kind&&s.cand==="A"&&s.round)).flat();
const Fg=(kind)=>PR.map(r=>r.segments.filter(s=>s.id===kind&&s.cand==="figures")).flat();
const Wu=(kind)=>PR.map(r=>r.segments.find(s=>s.id===kind&&s.kind==="warm-up"));
function phoneRow(kind,label){
  const a=As(kind), fps=a.map(s=>s.fps), p50=a.map(s=>s.p50), lp=a.map(s=>s.longPct), drop=a.filter(s=>s.longPct>5).length;
  const spans=a.map(s=>s.frames/s.fps), pooledFps=r1(sum(a.map(s=>s.frames))/sum(spans));
  return {kind:label, n:a.length, fpsMedian:median(fps), fpsMedianRoute:pctRoute(fps,0.5), fpsMin:mn(fps), fpsMax:mx(fps), pooledFps, p50Median:median(p50), p50Range:rng(p50),
    longMedian:median(lp), longMedianRoute:pctRoute(lp,0.5), longMin:mn(lp), longMax:mx(lp), dropping:drop+" of "+a.length,
    warm:Wu(kind).map(s=>s.fps+" fps, "+s.longPct+"% long, calls "+s.calls+", tris "+s.tris),
    figures:Fg(kind).map(s=>s.fps), figuresMedian:median(Fg(kind).map(s=>s.fps)), figuresLong:Fg(kind).map(s=>s.longPct),
    missedRefreshMedian:r1(100*(1-median(fps)*17/1000)), aCalls:rng(a.map(s=>s.calls)), aTris:rng(a.map(s=>s.tris)), aJs50:rng(a.map(s=>s.js50)), aP95:rng(a.map(s=>s.p95)), aMax:rng(a.map(s=>s.max))};
}
const pOv=phoneRow("ph8-overview","phase 8's Overview, orbiting"), pPl=phoneRow("play-half","Play at half speed");
res.phoneTable=[pOv,pPl];
claim("§25.1","Overview As: fps median 40.8 (27.2-42.8), p50 24 ms (23-37), long median 18.1% (9.6-100), 24 of 24 dropping",
  pOv.n===24&&r1(pOv.fpsMedian)===40.8&&pOv.fpsMin===27.2&&pOv.fpsMax===42.8&&pOv.p50Median===24&&pOv.p50Range==="23-37"&&pOv.longMin===9.6&&pOv.longMax===100&&pOv.dropping==="24 of 24"?(Math.abs(pOv.longMedian-18.1)<0.06?"verified":"partly"):false,
  "n "+pOv.n+"; fps median "+pOv.fpsMedian+" (route's nearest-rank "+pOv.fpsMedianRoute+"), range "+pOv.fpsMin+"-"+pOv.fpsMax+", pooled "+pOv.pooledFps+"; p50 median "+pOv.p50Median+" ("+pOv.p50Range+"); long median "+pOv.longMedian+" (nearest-rank "+pOv.longMedianRoute+") range "+pOv.longMin+"-"+pOv.longMax+"; "+pOv.dropping,
  "median over the 24 A blocks of R1 and R2 (2 runs x 2 rounds x 6 As; the 45 s warm-up excluded), each block's own fps/p50/long%","the long median is "+pOv.longMedian+" (printed 18.1)");
claim("§25.1","Play As: fps median 43.3 (42.8-43.8), p50 23 (22-23), long median 8.6% (5.3-14.2), 24 of 24 dropping",
  pPl.n===24&&pPl.fpsMin===42.8&&pPl.fpsMax===43.8&&pPl.p50Median===23&&pPl.p50Range==="22-23"&&pPl.longMin===5.3&&pPl.longMax===14.2&&pPl.dropping==="24 of 24"&&Math.abs(pPl.longMedian-8.6)<0.06?(Math.abs(pPl.fpsMedian-43.3)<0.051?"verified":"partly"):false,
  "n "+pPl.n+"; fps median "+pPl.fpsMedian+" (nearest-rank "+pPl.fpsMedianRoute+"), range "+pPl.fpsMin+"-"+pPl.fpsMax+", pooled "+pPl.pooledFps+"; p50 "+pPl.p50Median+" ("+pPl.p50Range+"); long median "+pPl.longMedian+" range "+pPl.longMin+"-"+pPl.longMax+"; "+pPl.dropping,"as above","the fps median is "+pPl.fpsMedian+" (printed 43.3)");
claim("§25.1","the warm-ups: Overview 49.5 and 49.9, 6.8% and 5.4% long; Play 45.2 and 45.7, 2.6% and 2.0% long",
  Wu("ph8-overview").map(s=>s.fps+"/"+s.longPct).join()==="49.5/6.8,49.9/5.4"&&Wu("play-half").map(s=>s.fps+"/"+s.longPct).join()==="45.2/2.6,45.7/2",
  "Overview "+pOv.warm.join("; ")+" | Play "+pPl.warm.join("; "),"warm-up segments",
  "the warm-ups are not the blocks' content: Play's warm-up plays 45 s from 08:30 (its end clock not recorded; the blocks 6 s each from 08:30), its median frame "+Wu("play-half").map(s=>s.calls+" calls/"+s.tris).join(", ")+" against the As' "+pPl.aCalls+" calls/"+pPl.aTris+"; the Overview's warm-up orbits 2.5 turns, each block the first 120 degrees");
claim("§25.1","figures hidden: Overview 48.5 (47.4-54.4); Play 59.2 (58.5-59.6), 0% long",
  r1(pOv.figuresMedian)===48.5&&mn(pOv.figures)===47.4&&mx(pOv.figures)===54.4&&Math.abs(pPl.figuresMedian-59.2)<0.051&&mn(pPl.figures)===58.5&&mx(pPl.figures)===59.6&&pPl.figuresLong.every(v=>v===0),
  "Overview "+pOv.figures.join(", ")+" (median "+pOv.figuresMedian+"); Play "+pPl.figures.join(", ")+" (median "+pPl.figuresMedian+"), long "+pPl.figuresLong.join(", "),"figures blocks");
const lowA=["phone-fx","phone-cull"].map(f=>R[f].segments.filter(s=>s.order&&s.cand==="A")), lowW=["phone-fx","phone-cull"].map(f=>R[f].segments.find(s=>s.kind==="warm-up"));
claim("§25.1","the low view at 4x (the brackets' A blocks): 60.0 and 59.8 fps, 17 ms, 0% (at most 0.3%), 0 of 28; warm-up 60, 0%",
  lowA.map(a=>r1(median(a.map(s=>s.fps)))).join()==="60,59.8"&&lowA.flat().every(s=>s.p50===17)&&mx(lowA.flat().map(s=>s.longPct))===0.3&&lowA.flat().filter(s=>s.longPct>5).length===0&&lowA.flat().length===28&&lowW.every(s=>s.fps>=59.85&&s.longPct===0)?"verified":false,
  "fx A median "+median(lowA[0].map(s=>s.fps))+", cull A median "+median(lowA[1].map(s=>s.fps))+"; p50 "+rng(lowA.flat().map(s=>s.p50))+"; long max "+mx(lowA.flat().map(s=>s.longPct))+"; blocks "+lowA.flat().length+"; warm-ups "+lowW.map(s=>s.fps+"/"+s.longPct).join(", "),"phone-fx and phone-cull A blocks");
const dips=PR.map((r,ri)=>r.segments.filter(s=>s.id==="ph8-overview"&&s.round&&s.fps<33).map(s=>"R"+(ri+1)+" "+s.kind+" "+s.fps+" fps p50 "+s.p50+" long "+s.longPct+"%")).flat();
const dipRows=PR.map((r,ri)=>r.segments.filter(s=>s.id==="ph8-overview"&&s.round&&s.fps<33).map(s=>({run:ri+1,cand:s.cand,fps:s.fps,p50:s.p50,long:s.longPct}))).flat();
claim("§25.1","in each run the Overview fell for two blocks to 27.2-32.0 fps (p50 34-37 ms, 66-100% long) and recovered (R1 a candidate and the A after it; R2 two As)",
  dipRows.filter(d=>d.run===1).length===2&&dipRows.filter(d=>d.run===2).length===2&&dipRows.filter(d=>d.run===1).map(d=>d.cand).join()==="density1Pass,A"&&dipRows.filter(d=>d.run===2).every(d=>d.cand==="A")&&mn(dipRows.map(d=>d.fps))===27.2&&mx(dipRows.map(d=>d.fps))===32&&mn(dipRows.map(d=>d.p50))===34&&mx(dipRows.map(d=>d.p50))===37&&Math.round(mn(dipRows.map(d=>d.long)))===66&&mx(dipRows.map(d=>d.long))===100,
  dips.join("; "),"Overview blocks under 33 fps","numbers as stated; 'the phone's own state' is an attribution: in these blocks js50 is 17-18 ms against 6-7 ms elsewhere (a CPU-side event), and they recover within one or two blocks");
/* phone-rule */
let ruleOut="";
try{ ruleOut=require("child_process").execFileSync(process.execPath,[path.join(ROOT,"tools","step6","phone-rule.js"),path.join(DEV,"phone-R1.json"),path.join(DEV,"phone-R2.json")],{encoding:"utf8"}); }catch(e){ ruleOut="phone-rule.js failed: "+e.message; }
res.phoneRule=ruleOut;
claim("§25.1","section 14.1's rule: both runs stand, both test both kinds, no candidate cures, rule 4; the reference cures Play in both runs (gain 1.353); the Overview gains 1.38 and 1.43 without curing",
  /rule 4: nothing is built/.test(ruleOut)&&/figures \(reference\)\s+play-half\s+run 1 cures true\s+gain 1\.353/.test(ruleOut)&&/figures \(reference\)\s+play-half\s+run 2 cures true\s+gain 1\.353/.test(ruleOut)&&/figures \(reference\)\s+ph8-overview\s+run 1 cures false\s+gain 1\.375/.test(ruleOut)&&/figures \(reference\)\s+ph8-overview\s+run 2 cures false\s+gain 1\.431/.test(ruleOut),
  (ruleOut.match(/VERDICT:.*/)||[""])[0]+" | "+(ruleOut.split("\n").filter(l=>/^figures/.test(l)).map(l=>l.slice(0,70)).join(" | ")),"tools/step6/phone-rule.js over R1 and R2 (reads only)");
/* 8.3 phone */
const phoneMeas=PHONE.map(f=>R[f].segments.filter(s=>s.tris!=null&&!(s.cand==="B"&&f==="phone-cull"))).flat();
const phMaxTris=mx(phoneMeas.map(s=>s.tris)), ovTris=As("ph8-overview").map(s=>s.tris);
const P5ov=seg(P5,"ph8-overview","held"), P5ovo=seg(P5,"ph8-overview","orbit"), P5pl=seg(P5,"play-half","played"), P5low=seg(P5,"pratzen-low-4x","orbit");
const cullP=R["phone-cull"], cpA=cullP.segments.filter(s=>s.order&&s.cand==="A"), cpB=cullP.segments.filter(s=>s.order&&s.cand==="B");
claim("§25.1","8.3 phone: heaviest frame 1,364,901 triangles (Play) against 1.62 million; the Overview 1,309,505 (P5's 1,469,251, -10.9%)",
  phMaxTris===1364901&&mx(ovTris)===1309505&&P5ov.tris===1469251&&pc(1469251,1309505)===-10.9?"partly":false,
  "max of the phone segments' MEDIAN tris "+phMaxTris+" ("+phoneMeas.filter(s=>s.tris===phMaxTris).map(s=>s.id+" "+s.kind).join(", ")+"); the Overview As' median tris "+rng(ovTris)+"; P5 ph8-overview held "+P5ov.tris+", orbit "+P5ovo.tris,
  "per-segment medians (the route keeps no per-frame maximum)","numbers right as medians; 'heaviest frame' is not measured; the CI census's phone maximum (1,288,561, phone-390-first) is below what the phone drew at the median in Play (1.36 M) and phase 8's Overview (1.31 M)");
const aC=k=>rng(As(k).map(s=>s.calls));
claim("§25.1","draw calls against P5's: Overview 532 vs 525 (+1.3%), Play 517 vs 508 (+1.8%), low view at 4x 211 vs 442 (culling; with culling off 446-448)",
  aC("ph8-overview")==="532"&&P5ov.calls===525&&aC("play-half")==="517"&&P5pl.calls===508&&rng(cpA.map(s=>s.calls))==="211"&&P5low.calls===442&&rng(cpB.map(s=>s.calls))==="446-448",
  "Overview As "+aC("ph8-overview")+" vs P5 "+P5ov.calls+" ("+pc(P5ov.calls,532)+"%); Play As "+aC("play-half")+" vs P5 "+P5pl.calls+" ("+pc(P5pl.calls,517)+"%); low 4x cull A "+rng(cpA.map(s=>s.calls))+" vs P5 orbit "+P5low.calls+"; cull B "+rng(cpB.map(s=>s.calls)),
  "medians","P5's Play covered 08:30-09:10.6 in 12 s (its recorded clock), the blocks 6 s each from 08:30 (their end clock not recorded): the medians are of different stretches of the clock");
claim("§25.1","across routes against P5: Overview orbit 47 fps, 2.7% long -> 40.8, 18.1%; Play half 53, 1.6% -> 43.3, 8.6%; medians 22 -> 24 ms and 17 -> 23 ms",
  P5ovo.fps===47&&P5ovo.longPct===2.7&&P5pl.fps===53&&P5pl.longPct===1.6&&P5ovo.p50===22&&P5pl.p50===17,
  "P5 ph8 orbit "+P5ovo.fps+"/"+P5ovo.longPct+"%/p50 "+P5ovo.p50+"; P5 play-half "+P5pl.fps+"/"+P5pl.longPct+"%/p50 "+P5pl.p50,"P5 segments","the record labels it across routes; also across clock windows and the phone's state; P5's own segments were not 'held' at 60 (47 fps, p50 22 ms; 53 fps, p95 24 ms)");
const d1p=(r,k)=>r.segments.filter(s=>s.id===k&&s.cand==="density1Pass"), aP=(r,k)=>r.segments.filter(s=>s.id===k&&s.cand==="A"&&s.round);
const p34=k=>({d1p:[P3,P4].map(r=>d1p(r,k)).flat(), A:[P3,P4].map(r=>aP(r,k)).flat()});
const o34=p34("ph8-overview"), q34=p34("play-half");
claim("§25.1","P3/P4's density1Pass: Overview 29.4 fps and 86.2% long; Play 40.0 and 38.7%; their As 21.0 and 27.1, 100% long",
  r1(median(o34.d1p.map(s=>s.fps)))===29.4&&r1(median(o34.d1p.map(s=>s.longPct)))===86.2&&r1(median(q34.d1p.map(s=>s.fps)))===40&&r1(median(q34.d1p.map(s=>s.longPct)))===38.7&&r1(median(o34.A.map(s=>s.fps)))===21&&r1(median(q34.A.map(s=>s.fps)))===27.1,
  "Overview d1p "+o34.d1p.map(s=>s.fps+"/"+s.longPct).join(", ")+" (medians "+median(o34.d1p.map(s=>s.fps))+"/"+median(o34.d1p.map(s=>s.longPct))+"); Play d1p "+q34.d1p.map(s=>s.fps+"/"+s.longPct).join(", ")+" (medians "+median(q34.d1p.map(s=>s.fps))+"/"+median(q34.d1p.map(s=>s.longPct))+"); As medians "+median(o34.A.map(s=>s.fps))+" / "+median(q34.A.map(s=>s.fps))+", long "+rng(o34.A.concat(q34.A).map(s=>s.longPct)),
  "median over the 4 density1Pass blocks and the 24 A blocks of P3+P4",
  "numbers right; the inference drawn from them (Stage 8's build the better, by culling and fewer triangles) rests on a session whose As ran 21-27 fps (100% long) and on a proxy configuration (the stale shadow map still sampled); in phase 8's Overview culling saves nothing (532 calls against about 525) and 11% fewer triangles cannot by themselves give +39% fps: the phone's state dominates this reading");
/* 25.2 */
const pc12=v=>res.verdicts.find(x=>x.file===v);
const cpAf=cpA.map(s=>s.fps), cpBf=cpB.map(s=>s.fps);
claim("§25.2","culling: not shown, 7 of 12 faster, none slower; 59.8 fps median (59.3-60) with, 54.1 (52.8-60) without; 211 calls and ~857,000 tris against 446-448 and ~1,312,000 (-53%, -35%)",
  pc12("phone-cull").faster===7&&pc12("phone-cull").slower===0&&r1(median(cpAf))===59.8&&mn(cpAf)===59.3&&mx(cpAf)===60&&r1(median(cpBf))===54.1&&mn(cpBf)===52.8&&mx(cpBf)===60,
  "faster "+pc12("phone-cull").faster+", slower "+pc12("phone-cull").slower+"; A fps "+rng(cpAf)+" median "+median(cpAf)+"; B fps "+rng(cpBf)+" median "+median(cpBf)+"; tris A "+rng(cpA.map(s=>s.tris))+" B "+rng(cpB.map(s=>s.tris))+" ("+pc(median(cpB.map(s=>s.calls)),median(cpA.map(s=>s.calls)))+"% calls, "+pc(median(cpB.map(s=>s.tris)),median(cpA.map(s=>s.tris)))+"% tris)","phone-cull blocks");
const fxP=R["phone-fx"], fpA=fxP.segments.filter(s=>s.order&&s.cand==="A"), fpB=fxP.segments.filter(s=>s.order&&s.cand==="B"), slowB=fpB.filter(s=>s.fps<50);
claim("§25.2","effects: not shown, 4 of 12 effects-on faster, none slower; 5 of 14 effects-off blocks at 35-47 fps (19-95% long; js50 11-12 in four of them); none of the 14 effects-on blocks (58.4-60)",
  pc12("phone-fx").faster===4&&pc12("phone-fx").slower===0&&slowB.length===5&&fpB.length===14&&mn(slowB.map(s=>s.fps))>=35&&mx(slowB.map(s=>s.fps))<=47.9&&fpA.length===14&&mn(fpA.map(s=>s.fps))===58.4&&mx(fpA.map(s=>s.fps))===60&&slowB.filter(s=>s.js50>=11&&s.js50<=12).length===4,
  "faster "+pc12("phone-fx").faster+"; slow B blocks "+slowB.map(s=>s.kind+": "+s.fps+" fps, "+s.longPct+"%, js50 "+s.js50).join("; ")+"; A fps "+rng(fpA.map(s=>s.fps)),"phone-fx blocks");
const gP=R["phone-gait"], gpA=gP.segments.filter(s=>s.order&&s.cand==="A"), gpB=gP.segments.filter(s=>s.order&&s.cand==="B");
claim("§25.2","gait: not shown, 12 of 12 neither; 43.0 fps with the gait, 43.3 at rest; p50 23 in every block; the same calls and triangles",
  pc12("phone-gait").neither===12&&Math.abs(median(gpA.map(s=>s.fps))-43.0)<=0.051&&r1(median(gpB.map(s=>s.fps)))===43.3&&gpA.concat(gpB).every(s=>s.p50===23)&&rng(gpA.map(s=>s.calls))===rng(gpB.map(s=>s.calls))&&(mx(gpA.concat(gpB).map(s=>s.tris))-mn(gpA.concat(gpB).map(s=>s.tris)))/mn(gpA.concat(gpB).map(s=>s.tris))<0.002,
  "neither "+pc12("phone-gait").neither+"; A median "+median(gpA.map(s=>s.fps))+" ("+rng(gpA.map(s=>s.fps))+"), B median "+median(gpB.map(s=>s.fps))+" ("+rng(gpB.map(s=>s.fps))+"); p50 "+rng(gpA.concat(gpB).map(s=>s.p50))+"; calls A "+rng(gpA.map(s=>s.calls))+" B "+rng(gpB.map(s=>s.calls))+"; tris A "+rng(gpA.map(s=>s.tris))+" B "+rng(gpB.map(s=>s.tris))+"; js50 A "+rng(gpA.map(s=>s.js50))+" B "+rng(gpB.map(s=>s.js50))+"; long A "+rng(gpA.map(s=>s.longPct))+" B "+rng(gpB.map(s=>s.longPct)),"phone-gait blocks");

/* ---------- 7. history: L3 vs D1/D2 per segment; the phone's A blocks over time; P5 ---------- */
res.history.L3vsD=ORD.filter(k=>!/^idle/.test(k)).map(k=>{ const [id,kind]=k.split("|"), l=seg(L3,id,kind), a=seg(D1,id,kind), b=seg(D2,id,kind);
  return {seg:id+" "+kind, fps:[l.fps,a.fps,b.fps], p50:[l.p50,a.p50,b.p50], p95:[l.p95,a.p95,b.p95], max:[l.max,a.max,b.max], js50:[l.js50,a.js50,b.js50], js95:[l.js95,a.js95,b.js95], gpu50:[l.gpu50,a.gpu50,b.gpu50], calls:[l.calls,a.calls,b.calls], tris:[l.tris,a.tris,b.tris],
    clock:id.startsWith("play")?[l.clockFrom+"-"+l.clockTo,a.clockFrom+"-"+a.clockTo,b.clockFrom+"-"+b.clockTo]:null}; });
res.history.phoneSeries=PR.map((r,ri)=>({run:"R"+(ri+1), ov:r.segments.filter(s=>s.id==="ph8-overview").map(s=>({k:s.kind, fps:s.fps, p50:s.p50, p95:s.p95, max:s.max, long:s.longPct, js50:s.js50})),
  pl:r.segments.filter(s=>s.id==="play-half").map(s=>({k:s.kind, fps:s.fps, p50:s.p50, p95:s.p95, max:s.max, long:s.longPct, js50:s.js50}))}));
/* the long share's sensitivity: blocks of nearly equal fps with different long shares */
const plA=As("play-half").slice().sort((a,b)=>a.fps-b.fps);
res.history.playLongVsFps=plA.map(s=>({fps:s.fps, p50:s.p50, p95:s.p95, p99:s.p99, max:s.max, long:s.longPct}));
/* earlier phone runs: the same heavy segments */
res.history.phoneHist=["perf-P1-iphone","perf-P2-iphone","perf-P5a-oldbuild-iphone","perf-P5b-oldbuild-iphone","perf-P5-iphone"].map(f=>({file:f, build:H[f].build.sha256.slice(0,8), drawnAt:H[f].device.pixelRatio,
  segs:["ph8-overview|held","ph8-overview|orbit","play-half|played","play-4x|played","pratzen-low-4x|orbit"].map(k=>{ const [id,kind]=k.split("|"), s=seg(H[f],id,kind); return s?{seg:k, fps:s.fps, p50:s.p50, p95:s.p95, long:s.longPct, calls:s.calls, tris:s.tris, clock:s.clockFrom!=null?s.clockFrom+"-"+s.clockTo:null}:null; })}));

/* ---------- 8. the census against the route's own frames (CI's census-8l.json) ---------- */
try{
  const C=JSON.parse(fs.readFileSync(path.join(ROOT,"docs","stage8-evidence","8l","census","census-8l.json"),"utf8"));
  res.census.raw=Object.keys(C);
  res.census.file="docs/stage8-evidence/8l/census/census-8l.json";
}catch(e){ res.census.error=e.message; }


/* ---------- 9. derived analyses for the report ---------- */
res.longFrames=RC.filter(x=>x.long>0).map(x=>({file:x.file, seg:x.id+" "+x.kind, long:x.long, frames:x.frames, max:x.max}));
res.warmOver25=RC.filter(x=>x.warmMax>25&&!x.file.startsWith("phone")).map(x=>({file:x.file, seg:x.id+" "+x.kind, warmMax:x.warmMax}));
/* the census (CI, the same build) against the route's own frames: the held view reuses the ground's depth (the census's still eye), the moving view
   draws it (the census's complete frame) */
try{
  const C=JSON.parse(fs.readFileSync(path.join(ROOT,"docs","stage8-evidence","8l","census","census-8l.json"),"utf8")).after;
  const map=[["overview","overview-plan"],["pratzen-low-4x","pratzen-low"],["pratzen-low-1x","pratzen-low-1x"],["pratzen-low-10x","pratzen-low-10x"],["ph8-overview","ph8-overview-watch"],["paper","paper-north-up"],["eye","eye-zuran"]];
  res.census.pairs=map.map(([d,c])=>{ const h=seg(D1,d,"held"), m=D1.segments.find(s=>s.id===d&&/^(orbit|pan|look)$/.test(s.kind)), K=C.cases[c];
    return {view:d, census:c, heldCalls:h.calls, stillCalls:K.warm.calls, heldTris:h.tris, stillTris:K.warm.tris, dHeld:pc(K.warm.tris,h.tris), movingCalls:m.calls, completeCalls:K.cold.calls, movingTris:m.tris, completeTris:K.cold.tris, dMoving:pc(K.cold.tris,m.tris)}; });
  res.census.maxima=C.maxima; res.census.md5=C.md5; res.census.chromium=C.chromium;
  const playMax=mx([D1,D2].map(r=>r.segments.filter(s=>s.kind==="played").map(s=>s.tris)).flat());
  const phPlay=mx(PHONE.map(f=>R[f].segments.filter(s=>s.id==="play-half"&&s.tris!=null&&s.cand!=="B").map(s=>s.tris)).flat());
  const phOv=mx(PR.map(r=>r.segments.filter(s=>s.id==="ph8-overview"&&s.tris!=null).map(s=>s.tris)).flat());
  res.census.vsRoute={desktopCensusMax:C.maxima.desktop.complete.tris.v, desktopRoutePlay4xMedian:playMax, desktopHeadroomCensus:r1(100*(1-C.maxima.desktop.complete.tris.v/2.8e6)), desktopHeadroomRoute:r1(100*(1-playMax/2.8e6)),
    phoneCensusMax:C.maxima.phone.complete.tris.v, phoneRoutePlayMedian:phPlay, phoneRouteOverviewMedian:phOv, phoneHeadroomCensus:r1(100*(1-C.maxima.phone.complete.tris.v/1.62e6)), phoneHeadroomRoute:r1(100*(1-phPlay/1.62e6))};
}catch(e){ res.census.error=e.message; }
/* the long share against fps in the phone's Play As: the same rate, very different shares */
res.sensitivity={playAs:{fpsRange:rng(As("play-half").map(s=>s.fps)), longRange:rng(As("play-half").map(s=>s.longPct)), p95:rng(As("play-half").map(s=>s.p95)), p99:rng(As("play-half").map(s=>s.p99)), max:rng(As("play-half").map(s=>s.max))},
  overviewAs:{js50Normal:rng(As("ph8-overview").filter(s=>s.fps>=33).map(s=>s.js50)), js50Dips:rng(As("ph8-overview").filter(s=>s.fps<33).map(s=>s.js50))},
  missedRefresh:{phoneOverviewAs:r1(100*(1-median(As("ph8-overview").map(s=>s.fps))/60)), phonePlayAs:r1(100*(1-median(As("play-half").map(s=>s.fps))/60)),
    deskPlay:[D1,D2].map(r=>r.segments.filter(s=>s.kind==="played").map(s=>s.id+" "+r1(100*(1-s.fps/144)))).flat()}};

/* ---------- 10. the report ---------- */
function table(head,rows){ return "| "+head.join(" | ")+" |\n|"+head.map(()=>"---").join("|")+"|\n"+rows.map(r=>"| "+r.map(v=>v==null?"-":String(v).replace(/\|/g,"/")).join(" | ")+" |").join("\n")+"\n"; }
const M=[];
M.push("# Device evidence reconciled (post-Stage-8 final audit, area perf)\n");
M.push("Generated by `node tools/audit-post8/perf/reconcile.js` on "+new Date().toISOString().slice(0,10)+" from the committed reports (no browser, nothing measured here). The route's own `format()` and `bracketVerdict()` are loaded from `tools/step6/perf-route.js` unchanged.\n");
M.push("## 1. Build identity, device and settings\n");
M.push(table(["report","route","started (UTC)","bytes","sha256","the audited build?","browser","GPU","viewport","dpr / drawn","lowTier","fx (scale)","shadowMap flag","RM","refresh / long >","visibility","notes","hidden segs"],
  res.identity.map(x=>[x.file,x.version,x.started.replace("T"," ").slice(0,19),x.bytes||"(not read)",x.sha256?x.sha256.slice(0,12)+"...":"-",x.buildOK?"yes":"no",(x.ua.match(/(Chrome\/[\d]+|Version\/[\d.]+)/)||[""])[0],(x.glRenderer||"").replace(/^ANGLE \(NVIDIA, /,"").slice(0,32),x.viewport,x.dpr+" / "+x.pixelRatio,x.lowTier,x.fx+" ("+x.fxScale+")",x.shadowMap,x.reducedMotion,x.refreshMs+" / "+x.longMs,x.visibility,x.notes.length,x.hiddenSegments.length])));
M.push("\nRuns' timeline (rest = start minus the previous report's finish; the page's load falls inside it):\n");
M.push(table(["report","started","finished","minutes","rest before (min)"],res.timeline.map(t=>[t.file,t.started.slice(11,19),t.finished.slice(11,19),t.durMin,t.restBeforeMin])));
M.push("\n## 2. The text against the JSON\n");
M.push(table(["report","JSON line in .txt = .json","whole .txt = format(.json)","table rows","segments"],res.textCheck.map(t=>[t.file,t.jsonLineEqualsJsonFile,t.textReproducedByFormat+(t.differingLines.length?" (lines "+t.differingLines.join(",")+")":""),t.tableRows,t.segments])));
M.push("\nRows: desktop "+res.rowCounts.desktop+", phone "+res.rowCounts.phone+", total "+res.rowCounts.total+".\n");
M.push("\n## 3. Row-level recomputation (every row, `rows.csv`)\n");
M.push("- longPct recomputed as `r1(100*long/frames)` (perf-route.js:167): mismatches "+res.rowSummary.longPctMismatch.length+" of "+RC.length+".\n");
M.push("- percentiles ordered (p50 <= p90 <= p95 <= p99 <= max): violations "+res.rowSummary.percentileOrderViolations.length+".\n");
M.push("- the long count against the percentiles by the route's own nearest-rank `pct` (perf-route.js:86) and threshold `longMs`: inconsistent rows "+res.rowSummary.longVsPercentileInconsistent.length+".\n");
M.push("- the span each row's fps implies (frames/fps) against its sampling window (secs - 0.5 s): excess "+res.rowSummary.spanVsWindow.min+" to "+res.rowSummary.spanVsWindow.max+" s (the window runs secs*1000+100 ms from the sample's call, perf-route.js:153, plus timer latency); largest: "+res.rowSummary.spanVsWindow.worst.join("; ")+".\n");
M.push("- drawn = frames in every row but the ten idle rows (the app's loop paused by design): every counted interval ended in a drawn frame.\n");
M.push("- hidden segments: "+res.rowSummary.hidden+"; notes in any report: "+DESK.concat(PHONE).filter(f=>R[f].notes.length).length+".\n");
M.push("- per-block switches as read on the page: "+res.blockSettingsSummary.blocks+" blocks, not as intended: "+res.blockSettingsSummary.notAsIntended.length+".\n");
M.push("- bracket verdicts recomputed with the route's bracketVerdict(): "+res.verdicts.map(v=>v.file+" "+v.view+" '"+v.recomputed+"' ("+v.faster+"/"+v.slower+"/"+v.neither+"/"+v.missing+") = stored: "+v.same).join("; ")+".\n");
M.push("\nNot recomputable: fps, p50, p90, p95, p99, max and the long count themselves. The route keeps only each segment's summary (perf-route.js:160-171); the frame intervals are not in the report, so no independent recomputation of a percentile or of the frame rate from raw data is possible. Only internal consistency can be shown (above).\n");
M.push("\n## 4. The claims of docs/STAGE8_SPEC.md sections 24-25, recomputed\n");
M.push(table(["where","claim","verification","computed","method","notes"],res.claims.map(c=>[c.where,c.claim,c.verification,c.computed,c.method,c.notes])));
M.push("\n## 5. Long frames (desktop, every counted interval > 25 ms) and the warm column\n");
M.push(table(["report","segment","long","frames","max ms"],res.longFrames.filter(x=>x.file.startsWith("desk")).map(x=>[x.file,x.seg,x.long,x.frames,x.max])));
M.push("\nFirst 0.5 s of a segment (not counted by design) over 25 ms on the desktop:\n\n"+table(["report","segment","warm max ms"],res.warmOver25.map(x=>[x.file,x.seg,x.warmMax])));
M.push("\n## 6. L3 (22 Oct, Chrome 155, build 0c64a52d) against D1/D2 (1 Nov, Chrome 156, build bf27887c), segment by segment\n");
M.push(table(["segment","fps L3/D1/D2","p50","p95","max","js50","js95","gpu50","calls","tris","clock (played)"],res.history.L3vsD.map(x=>[x.seg,x.fps.join("/"),x.p50.join("/"),x.p95.join("/"),x.max.join("/"),x.js50.join("/"),x.js95.join("/"),x.gpu50.join("/"),x.calls.join("/"),x.tris.join("/"),x.clock?x.clock.join(" | "):""])));
M.push("\n## 7. The phone's blocks in order (R1, R2)\n");
res.history.phoneSeries.forEach(x=>{ M.push("\n**"+x.run+", phase 8's Overview orbiting**\n\n"+table(["block","fps","p50","p95","max","long%","js50"],x.ov.map(s=>[s.k,s.fps,s.p50,s.p95,s.max,s.long,s.js50])));
  M.push("\n**"+x.run+", Play at half speed**\n\n"+table(["block","fps","p50","p95","max","long%","js50"],x.pl.map(s=>[s.k,s.fps,s.p50,s.p95,s.max,s.long,s.js50]))); });
M.push("\nThe A blocks summarised (both runs, 24 each):\n\n"+table(["kind","n","fps median (route nearest-rank)","fps range","fps pooled","p50 median (range)","long% median (nearest-rank)","long% range","dropping","missed refreshes at 60 Hz (1-fps/60)","js50","calls","tris"],
  res.phoneTable.map(t=>[t.kind,t.n,t.fpsMedian+" ("+t.fpsMedianRoute+")",t.fpsMin+"-"+t.fpsMax,t.pooledFps,t.p50Median+" ("+t.p50Range+")",t.longMedian+" ("+t.longMedianRoute+")",t.longMin+"-"+t.longMax,t.dropping,t.missedRefreshMedian+"%",t.aJs50,t.aCalls,t.aTris])));
M.push("\nSensitivity of the long share: the 24 Play A blocks run at "+res.sensitivity.playAs.fpsRange+" fps (p95 "+res.sensitivity.playAs.p95+" ms, p99 "+res.sensitivity.playAs.p99+", max "+res.sensitivity.playAs.max+") while their long share ranges "+res.sensitivity.playAs.longRange+"%: the threshold (25.5 ms) sits in the upper tail of one distribution centred at 23 ms.\n");
M.push("\nThe Overview's slow blocks (under 33 fps) have js50 "+res.sensitivity.overviewAs.js50Dips+" ms against "+res.sensitivity.overviewAs.js50Normal+" ms in the others: the app's own script time per frame trebles in them and recovers within one or two 6 s blocks.\n");
M.push("\n## 8. Earlier phone runs (the same heavy segments)\n");
res.history.phoneHist.forEach(h=>{ M.push("\n**"+h.file+"** (build "+h.build+", drawn at "+h.drawnAt+")\n\n"+table(["segment","fps","p50","p95","long%","calls","tris","clock"],h.segs.filter(Boolean).map(s=>[s.seg,s.fps,s.p50,s.p95,s.long,s.calls,s.tris,s.clock]))); });
M.push("\n## 9. The census (CI, census-8l.json, the same build) against the route's frames (D1)\n");
if(res.census.pairs) M.push(table(["view","census case","held calls / still calls","held tris / still tris (diff %)","moving calls / complete calls","moving tris / complete tris (diff %)"],res.census.pairs.map(p=>[p.view,p.census,p.heldCalls+" / "+p.stillCalls,p.heldTris+" / "+p.stillTris+" ("+p.dHeld+")",p.movingCalls+" / "+p.completeCalls,p.movingTris+" / "+p.completeTris+" ("+p.dMoving+")"])));
if(res.census.vsRoute) M.push("\nThe census's maxima against what the route drew (medians): desktop census max "+res.census.vsRoute.desktopCensusMax+" (headroom "+res.census.vsRoute.desktopHeadroomCensus+"%) vs Play at 4x "+res.census.vsRoute.desktopRoutePlay4xMedian+" (headroom "+res.census.vsRoute.desktopHeadroomRoute+"%); phone census max "+res.census.vsRoute.phoneCensusMax+" (headroom "+res.census.vsRoute.phoneHeadroomCensus+"%) vs the phone's Play "+res.census.vsRoute.phoneRoutePlayMedian+" (headroom "+res.census.vsRoute.phoneHeadroomRoute+"%) and phase 8's Overview "+res.census.vsRoute.phoneRouteOverviewMedian+". The census's cases are fixed harness views at 1600 x 900 or a phone's 390-430 px; none plays the clock under Follow, none is phase 8's Overview on a phone.\n");
M.push("\n## 10. Section 14.1's rule on R1 and R2 (`node tools/step6/phone-rule.js`, reads only)\n\n```\n"+res.phoneRule.trim()+"\n```\n");
fs.mkdirSync(OUT,{recursive:true});
fs.writeFileSync(path.join(OUT,"reconcile.md"),M.join("\n"));
fs.mkdirSync(OUT,{recursive:true});
fs.writeFileSync(path.join(OUT,"reconcile.json"),JSON.stringify(res,null,1));
/* rows.csv */
const cols=Object.keys(RC[0]);
fs.writeFileSync(path.join(OUT,"rows.csv"),[cols.join(",")].concat(RC.map(x=>cols.map(c=>{ const v=x[c]; const s=v==null?"":String(v); return /[,"]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s; }).join(","))).join("\n")+"\n");
console.log("rows",RC.length,"desktop",res.rowCounts.desktop,"phone",res.rowCounts.phone);
console.log("text reproduced by format():",res.textCheck.map(t=>t.file+":"+t.textReproducedByFormat+"/"+t.jsonLineEqualsJsonFile+"/"+t.tableRows).join(" "));
console.log("row summary",JSON.stringify(res.rowSummary));
console.log("block settings",JSON.stringify(res.blockSettingsSummary));
console.log("verdicts",res.verdicts.map(v=>v.file+" "+v.view+" "+v.recomputed+" same "+v.same).join("; "));
res.claims.forEach(c=>console.log("["+c.verification+"] "+c.where+": "+c.claim.slice(0,110)+"\n      -> "+c.computed.slice(0,600)+(c.notes?"\n      note: "+c.notes:"")));
