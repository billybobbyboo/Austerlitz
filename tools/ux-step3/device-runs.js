#!/usr/bin/env node
/* UI/UX roadmap step 3 (UA-02): the owner's two-build device runs (docs/ux-step3-evidence/device/PROTOCOL.md), read by the rules stated before them.
   Reads only docs/ux-step3-evidence/device/{desk,phone}-S{2,3}-N.{txt,json} (the owner's reports, verbatim) and, for the record, Stage 7's runs on the
   same devices (docs/final-stage7-evidence/device/{desk,phone}-S7-*.json). Nothing here is measured in this container.
   (1) each .txt is the route's own format() of its .json, character for character;
   (2) each report names the build its file says: S2 the pinned Step 2 copy, S3 the pinned Step 3 copy, by bytes and SHA-256;
   (3) the ordinary route whole: its 23 segments (idle; overview, pratzen-low-4x and ph8-overview held, orbit, orbit -figures, orbit -effects;
       pratzen-low-1x and -10x held and orbit; paper held and pan; eye held and look; play-4x and play-half played), the played ones with Follow on
       from 08:30 (clockFrom 510);
   (4) section 8.3's budget on every frame's maxima (callsMax, trisMax): the desktop's 900 calls and 2.8 million triangles; the phone's heaviest
       frame at most 1.62 million triangles and its segment medians of calls at most 10% above Step 2's of the same session;
   (5) section 8.5's rule, each Step 3 run against each Step 2 run: no segment's long-frame share rising above 5% where it was under, no median
       interval moving by more than one refresh;
   (6) the desktop's CPU line: no segment's js50 more than 1 ms above Step 2's (each Step 3 run against each Step 2 run);
   (7) per segment, the two builds' runs side by side, with the spread between a build's own two runs beside the difference between the builds.
   node tools/ux-step3/device-runs.js [--json out.json] [--txt out.txt]   Exit 1 if (1), (2) or (3) fails. */
"use strict";
const fs=require("fs"), path=require("path"), vm=require("vm");
const ROOT=path.resolve(__dirname,"..",".."), DIR=path.join(ROOT,"docs","ux-step3-evidence","device"), S7=path.join(ROOT,"docs","final-stage7-evidence","device");
const opt=f=>{ const i=process.argv.indexOf(f); return i>=0?process.argv[i+1]:null; };
const box={console:{log(){},error(){}}}; vm.createContext(box); vm.runInContext(fs.readFileSync(path.join(ROOT,"tools","step6","perf-route.js"),"utf8"),box);
const format=box.AUS_PERF.format;
const BUILD={S2:{bytes:3071014, sha256:"06842ca46dfbdaf6c892de2393b83b5e28c6fe211a180c53244688bfbedaf186"},
             S3:{bytes:3085998, sha256:"48f5d6314e2b8b336d17d3be6caad94c5c4254471da6095605fd013d644c9b34"}};
const ROUTE=["idle|idle"].concat(...["overview","pratzen-low-4x"].map(v=>["held","orbit","orbit -figures","orbit -effects"].map(k=>v+"|"+k)),
  ...["pratzen-low-1x","pratzen-low-10x"].map(v=>["held","orbit"].map(k=>v+"|"+k)), ["held","orbit","orbit -figures","orbit -effects"].map(k=>"ph8-overview|"+k),
  ["paper|held","paper|pan","eye|held","eye|look","play-4x|played","play-half|played"]);
const key=s=>s.id+"|"+s.kind, by=j=>{ const o={}; j.segments.forEach(s=>o[key(s)]=s); return o; };
const bad=[], out={note:"the owner's runs of the Step 2 and Step 3 builds, read by sections 8.3 and 8.5 and the CPU line; nothing here is measured in this container", devices:{}};
const r2=x=>x==null?null:Math.round(x*100)/100;
for(const dev of ["desk","phone"]){
  const files=fs.readdirSync(DIR).filter(f=>new RegExp("^"+dev+"-S[23]-\\d+\\.json$").test(f)).sort();
  if(!files.length) { out.devices[dev]={runs:0, note:"no reports filed"}; continue; }
  const runs={S2:[],S3:[]};
  for(const f of files){
    const b=f.match(/-S([23])-/)[1], j=JSON.parse(fs.readFileSync(path.join(DIR,f),"utf8")), txt=fs.readFileSync(path.join(DIR,f.replace(/\.json$/,".txt")),"utf8").replace(/\n+$/,"");
    if(format(j)!==txt) bad.push(f+": the .txt is not the route's format() of its .json");
    const want=BUILD["S"+b]; if(!(j.build&&j.build.bytes===want.bytes&&j.build.sha256===want.sha256)) bad.push(f+": its build "+JSON.stringify(j.build)+" is not the Step "+b+" copy's");
    const have=j.segments.map(key); ROUTE.forEach(k=>{ if(!have.includes(k)) bad.push(f+": no segment "+k); });
    j.segments.filter(s=>s.kind!=="idle"&&!s.frames).forEach(s=>bad.push(f+": "+key(s)+" recorded no frames"));
    j.segments.filter(s=>s.kind==="played").forEach(s=>{ if(s.follow!==true||s.clockFrom!==510||!(s.clockTo>s.clockFrom)) bad.push(f+": "+key(s)+" not Play under Follow from 08:30 ("+s.follow+", "+s.clockFrom+" to "+s.clockTo+")"); });
    runs["S"+b].push({f, j, B:by(j)});
  }
  const segs=ROUTE.filter(k=>k!=="idle|idle"), R=Math.max(...runs.S2.concat(runs.S3).map(r=>r.j.refreshMs));
  const D={runs:files, refreshMs:R, device:runs.S3.concat(runs.S2)[0].j.device.ua, gpu:runs.S3.concat(runs.S2)[0].j.device.glRenderer, viewport:runs.S3.concat(runs.S2)[0].j.device.viewport,
    started:files.map(f=>{ const r=runs.S2.concat(runs.S3).find(x=>x.f===f); return [f, r.j.started, r.j.finished, r.j.device.load.transferBytes]; }), budget:{}, rule85:{held:true, fails:[]}, cpu:{held:true, maxExcess:null, fails:[]}, segments:{}};
  /* (4) section 8.3's budget */
  runs.S2.concat(runs.S3).forEach(r=>{ const m=(f)=>r.j.segments.reduce((a,s)=>s[f]>a.v?{v:s[f],at:key(s)}:a,{v:0}); const c=m("callsMax"), t=m("trisMax");
    const e={callsMax:c, trisMax:t};
    if(dev==="desk"){ e.within=c.v<=900&&t.v<=2.8e6; e.rule="at most 900 calls and 2.8 million triangles in any frame"; }
    else { const ref=runs.S2; const over=r.f.includes("-S3-")?segs.filter(k=>{ const s=r.B[k]; return s&&s.calls&&ref.some(q=>q.B[k]&&q.B[k].calls&&s.calls>1.1*q.B[k].calls); }):[];
      e.callsOverStep2By10pct=over; e.within=t.v<=1.62e6&&!over.length; e.rule="the heaviest frame at most 1.62 million triangles; segment medians of calls at most 10% above Step 2's"; }
    D.budget[r.f]=e; });
  /* (5) section 8.5 and (6) the CPU line, each Step 3 run against each Step 2 run */
  let maxEx=-Infinity, maxAt=null;
  for(const a of runs.S3) for(const b of runs.S2) for(const k of segs){ const x=a.B[k], y=b.B[k]; if(!x||!y) continue;
    if(Math.abs(x.p50-y.p50)>Math.max(a.j.refreshMs,b.j.refreshMs)+1e-9){ D.rule85.held=false; D.rule85.fails.push(a.f+" vs "+b.f+" "+k+": median "+y.p50+" to "+x.p50); }
    if(y.longPct<=5&&x.longPct>5){ D.rule85.held=false; D.rule85.fails.push(a.f+" vs "+b.f+" "+k+": long-frame share "+y.longPct+"% to "+x.longPct+"%"); }
    if(dev==="desk"&&x.js50!=null&&y.js50!=null){ const ex=r2(x.js50-y.js50); if(ex>maxEx){ maxEx=ex; maxAt=a.f+" vs "+b.f+" "+k; } if(ex>1+1e-9){ D.cpu.held=false; D.cpu.fails.push(a.f+" vs "+b.f+" "+k+": js50 "+y.js50+" to "+x.js50); } } }
  if(dev==="desk") { D.cpu.maxExcess=maxEx; D.cpu.at=maxAt; D.cpu.rule="js50 not above Step 2's by more than 1 ms"; } else D.cpu={note:"the CPU line is the desktop's (section 8.3)"};
  /* (7) side by side */
  const F=["fps","p50","p95","max","longPct","missedPct","js50","js95","gpu50","gpu95","calls","callsMax","tris","trisMax"];
  for(const k of segs){ const row={};
    F.forEach(f=>{ const s2=runs.S2.map(r=>r.B[k]?r.B[k][f]:null), s3=runs.S3.map(r=>r.B[k]?r.B[k][f]:null);
      const sp=v=>v.filter(x=>x!=null).length>1?r2(Math.max(...v.filter(x=>x!=null))-Math.min(...v.filter(x=>x!=null))):null, mean=v=>{ const w=v.filter(x=>x!=null); return w.length?w.reduce((p,q)=>p+q,0)/w.length:null; };
      row[f]={S2:s2, S3:s3, spreadS2:sp(s2), spreadS3:sp(s3), meanDiff:(mean(s2)!=null&&mean(s3)!=null)?r2(mean(s3)-mean(s2)):null}; });
    D.segments[k]=row; }
  /* for the record: Stage 7's runs on the same device (13 November 2026, Stage 7's build) */
  const s7=fs.existsSync(S7)?fs.readdirSync(S7).filter(f=>new RegExp("^"+dev+"-S7-\\d+\\.json$").test(f)).sort():[];
  D.stage7={runs:s7, played:{}};
  s7.forEach(f=>{ const B=by(JSON.parse(fs.readFileSync(path.join(S7,f),"utf8"))); ["play-4x|played","play-half|played"].forEach(k=>{ const s=B[k]; if(s) (D.stage7.played[k]=D.stage7.played[k]||[]).push({f, fps:s.fps, p50:s.p50, longPct:s.longPct, missedPct:s.missedPct, js50:s.js50, calls:s.calls, callsMax:s.callsMax, tris:s.tris, trisMax:s.trisMax}); }); });
  out.devices[dev]=D;
}
/* the printed reading */
const L=[];
for(const dev of Object.keys(out.devices)){ const D=out.devices[dev]; if(!D.segments){ L.push(dev+": "+D.note); continue; }
  L.push(dev+": "+D.runs.join(", ")+"; "+D.gpu+"; viewport "+D.viewport.join(" x ")+"; refresh "+D.refreshMs+" ms");
  D.started.forEach(([f,s,e,t])=>L.push("  "+f+": "+s+" to "+e+", "+t+" bytes transferred"));
  Object.keys(D.budget).forEach(f=>{ const b=D.budget[f]; L.push("  8.3 "+f+": calls at most "+b.callsMax.v+" ("+b.callsMax.at+"), triangles at most "+b.trisMax.v+" ("+b.trisMax.at+"): "+(b.within?"within":"OVER")+" ("+b.rule+")"); });
  L.push("  8.5 (each Step 3 run against each Step 2 run): "+(D.rule85.held?"holds in every segment":"fails: "+D.rule85.fails.join("; ")));
  if(dev==="desk") L.push("  CPU line: "+(D.cpu.held?"holds":"fails: "+D.cpu.fails.join("; "))+"; the largest js50 excess "+D.cpu.maxExcess+" ms ("+D.cpu.at+")");
  L.push("  segment                         fps S2|S3        p50 S2|S3        p95 S2|S3      long% S2|S3   miss% S2|S3     js50 S2|S3      gpu50 S2|S3       calls S2|S3          callsMax S2|S3      trisMax S2|S3");
  const j=v=>v.map(x=>x==null?"-":x).join("/");
  Object.keys(D.segments).forEach(k=>{ const r=D.segments[k]; L.push("  "+k.padEnd(30)+["fps","p50","p95","longPct","missedPct","js50","gpu50","calls","callsMax","trisMax"].map(f=>(j(r[f].S2)+" | "+j(r[f].S3)).padStart(f.startsWith("tris")?27:f.startsWith("calls")?19:15)).join(" ")); });
  Object.keys(D.stage7.played).forEach(k=>L.push("  Stage 7 "+k+": "+D.stage7.played[k].map(s=>s.f+" fps "+s.fps+", p50 "+s.p50+", long% "+s.longPct+", miss% "+s.missedPct+", js50 "+s.js50+", calls "+s.calls+" (max "+s.callsMax+"), triangles max "+s.trisMax).join("; ")));
}
if(bad.length){ L.push("FINDINGS:"); bad.forEach(b=>L.push("  FAIL "+b)); } else L.push("every report verbatim, its build the pinned copy its name says, the ordinary route whole: OK");
const text=L.join("\n")+"\n"; process.stdout.write(text);
if(opt("--json")) fs.writeFileSync(opt("--json"),JSON.stringify(out,null,1)+"\n");
if(opt("--txt")) fs.writeFileSync(opt("--txt"),text);
process.exit(bad.length?1:0);
