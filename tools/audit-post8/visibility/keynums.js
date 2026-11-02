#!/usr/bin/env node
/* Final audit after Stage 8, area "visibility": the numbers the README cites, printed from tables.json (analyse.js), so that none is copied by
   hand. node tools/audit-post8/visibility/keynums.js [--json <tables.json>] */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(__dirname,"..","..","..");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const T=JSON.parse(fs.readFileSync(path.resolve(opt("--json")||path.join(ROOT,"docs","audit-post8-evidence","visibility","tables.json")),"utf8"));
const hhmm=t=>t==null?"-":String(Math.floor(t/60)).padStart(2,"0")+":"+String(Math.floor(t%60)).padStart(2,"0");
const pct=x=>x==null?"-":(100*x).toFixed(1)+"%";
Object.values(T.runs).forEach(r=>{
  const c=r.checks, F=r.formations.filter(f=>f.play.inView>0);
  const w=F.slice().sort((a,b)=>b.play.longestFrames-a.play.longestFrames).slice(0,6);
  const under40=F.filter(f=>f.play.inView>=0.1*r.playFrames&&f.play.share<0.4).map(f=>f.id+" "+pct(f.play.share));
  const under60=F.filter(f=>f.play.inView>=0.1*r.playFrames&&f.play.share<0.6).length;
  const over5s=F.filter(f=>f.play.longestMs>=5000).length;
  console.log("\n"+r.run+": "+r.presentation+"/"+r.mode+" "+r.viewport.join("x")+", reading "+r.reading+(r.select?", selected "+r.select:"")+", Follow "+(r.follow?"on":"off")+", "+r.speed+"x, "+hhmm(r.clockFrom)+"-"+hhmm(r.clockTo)+", "+r.playFrames+" play frames ("+(r.playFrames*r.frameMs/1000).toFixed(1)+" s), passes "+r.passes+", dwell frames "+r.dwellFrames);
  console.log("  formation-frames drawn (play) "+r.playTotal.drawn+"/"+r.playTotal.inView+" = "+pct(r.playTotal.share)+"; fresh layout "+pct(c.formations.staticShare)+"; starved vs fresh "+c.formations.starvedVsStatic+", extra "+c.formations.drawnWhereStaticNot+"; whole run (pre+play+rest) "+r.total.drawn+"/"+r.total.inView+" longest "+r.total.longestMs+" ms, episodes "+r.total.episodes);
  console.log("  formations under 40% (in view >= 10% of play): "+(under40.join(", ")||"none")+"; under 60%: "+under60+" of "+F.length+"; longest >= 5 s: "+over5s);
  console.log("  longest: "+w.map(f=>f.id+" "+f.play.longestMs+" ms = "+f.play.longestClockMin+" min from "+hhmm(f.play.longestFrom)+" (share "+pct(f.play.share)+", fresh "+pct(f.play.staticShare)+", fresh longest gap "+f.play.staticLongestMs+" ms, rest "+f.before+f.after+(f.fresh||"")+")").join("; "));
  console.log("  protected hidden frames "+c.keepHiddenFrames+"; events "+c.events.drawn+"/"+c.events.inView+"; army+corps "+c.corpsArmy.drawn+"/"+c.corpsArmy.inView+" = "+pct(c.corpsArmy.share)+", longest "+c.corpsArmy.longestMs+" ms/"+c.corpsArmy.longestClockMin+" min; by echelon "+Object.keys(c.byEch).map(k=>k+" "+pct(c.byEch[k].share)).join(", "));
  console.log("  places "+c.places.drawn+"/"+c.places.inView+" = "+pct(c.places.share)+" (fresh "+pct(c.places.staticShare)+", never drawn "+c.places.never+" of "+c.places.n+"); objectives "+pct(c.objectives.share)+" (fresh "+pct(c.objectives.staticShare)+"); overlays "+pct(c.overlays.share));
  const rest=r.formations.filter(f=>f.play.inView>0), bd=rest.filter(f=>f.before!=="#"&&"hHdD".includes(f.before)).map(f=>f.id), ad=rest.filter(f=>"hHdD".includes(f.after)).map(f=>f.id), fd=rest.filter(f=>f.fresh&&"hHdD".includes(f.fresh)).map(f=>f.id);
  console.log("  hidden at rest before: "+(bd.join(",")||"none")+"; after (persist): "+(ad.join(",")||"none")+"; fresh view at the end: "+(fd.join(",")||"none"));
});
if(T.benchmark){ const B=T.benchmark; console.log("\nbenchmark: bench share "+pct(B.bench.share)+", longest "+B.bench.longestMs+" ms, starved "+B.bench.starved.join(",")+"; long-run windows of 90 play frames: "+B.windowsN+", share "+pct(B.windowShareMin)+"-"+pct(B.windowShareMax)+
  ", windows with a formation hidden the whole window: "+B.windowsOver3000+"; long run share "+pct(B.long.share)+", longest "+B.long.longestMs+" ms");
  const ws=B.windows90.map(w=>w.share).sort((a,b)=>a-b); console.log("  window shares median "+pct(ws[Math.floor(ws.length/2)])+"; the window at 09:00: "+JSON.stringify(B.windows90.find(w=>w.from>=540&&w.from<556)||null)); }
Object.keys(T.realtime||{}).forEach(k=>{ const C=T.realtime[k]; console.log("\nrealtime "+k+" vs "+C.against+": real frames "+C.realFrames+" (interval "+JSON.stringify(C.realIntervalMs)+", passes "+C.realPasses+"), driver frames "+C.driverFrames+" (passes "+C.driverPasses+"); drawn real "+C.real.drawn+"/"+C.real.inView+" = "+pct(C.real.share)+", driver "+C.driver.drawn+"/"+C.driver.inView+" = "+pct(C.driver.share)+"; longest frames real "+C.real.longestFrames+", driver "+C.driver.longestFrames+"; paired frames "+C.pairedFrames+", identical "+C.pairedIdentical+", formation-frame differences "+C.pairedCodeDifferences);
  const worst=C.rows.filter(r=>r.real&&r.driver).sort((a,b)=>(a.driver.share||0)-(b.driver.share||0)).slice(0,6); worst.forEach(r=>console.log("   "+r.id.padEnd(12)+" real "+pct(r.real.share)+" longest "+r.real.longestFrames+"f/"+r.real.longestClockMin+"min | driver "+pct(r.driver.share)+" longest "+r.driver.longestFrames+"f/"+r.driver.longestClockMin+"min")); });
