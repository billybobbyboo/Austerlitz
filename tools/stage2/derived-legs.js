#!/usr/bin/env node
/* Chronology data task, follow-up (owner, on #12): the legs whose arrival is DERIVED from the march-rate ceiling rather
   than dated, and the legs whose pace a dated time forces near the ceiling. Reads the live model; changes nothing.
   node tools/stage2/derived-legs.js [--md out.md] [--json out.json]
   For each such leg: distance, window, speed and share of the arm's ceiling; the formation's status during the leg;
   the ground (ascent along the route in metres, a Goldbach crossing, villages passed); the slack the next anchor leaves
   (the latest arrival that keeps the next leg within its ceiling, and the slowest pace that allows) and so which anchor
   bounds it. Then the options, simulated on the whole model: (a) undated arrivals at a stated share of the ceiling;
   (b) a lower tactical rate for formations deployed in battle order; (c) at the ceiling, flagged. Since the 2C
   precondition the live engine is "(b) where it fits, else (c), flagged" (anchorList, TACTICAL_RATE; each leg's rule
   is reported); the other options are simulated against it. The rates are DESIGN VALUES, unsourced; the script says so
   in its output. */
const fs=require("fs"), path=require("path"), cp=require("child_process");
const ROOT=path.resolve(__dirname,"..",".."); process.chdir(ROOT);
cp.execSync("node tools/mk-helpers.js && node tools/mk-world-mod.js",{stdio:"ignore"});
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
const GOLD=[[250,109],[240,160],[212,218],[208,256],[207,297],[204,362],[208,376],[214,410],[237,415],[276,415]];   /* GOLDBACH_M, world.js */
const hm=t=>{ t=Math.round(t); return String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0"); };
const elev=p=>GEOREF.elevM(hAt(p[0],p[1]));
function segX(a,b,c,d){ const o=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
  return o(a,b,c)*o(a,b,d)<0 && o(c,d,a)*o(c,d,b)<0; }
function ground(pp){
  let asc=0, desc=0, prev=null; const n=48, vill=new Set();
  for(let i=0;i<=n;i++){ const q=pointOnPath(pp,i/n), e=elev(q);
    if(prev!==null){ if(e>prev) asc+=e-prev; else desc+=prev-e; } prev=e;
    VILLAGES.forEach(v=>{ if(Math.hypot(q[0]-v[1],q[1]-v[2])<22) vill.add(v[0]); }); }
  let crosses=false; for(let i=1;i<pp.pts.length;i++) for(let j=1;j<GOLD.length;j++) if(segX(pp.pts[i-1],pp.pts[i],GOLD[j-1],GOLD[j])) crosses=true;
  return {from:Math.round(elev(pp.pts[0])),to:Math.round(elev(pp.pts[pp.pts.length-1])),asc:Math.round(asc),desc:Math.round(desc),crosses,villages:[...vill]};
}
function statusDuring(id,ph){ const tr=FORMATIONS[id].track; let st=null; for(let i=0;i<=ph;i++) if(tr[i]&&tr[i].st) st=tr[i].st; return st; }
/* which legs: every derived arrival, and every leg at 80% of its ceiling or more */
function legs(){
  const out=[];
  Object.keys(FORMATIONS).forEach(id=>{ const f=FORMATIONS[id]; if(!f.track) return; const A=anchorList(id), ceil=SPEED_CEIL[f.arm]||5;
    for(let k=1;k<A.length;k++){ const a=A[k-1], b=A[k]; if(!a.p||!b.p) continue;
      const pp=legPath(a,b), km=pp.len*KM_PER_MAP, w=b.w, min=w[1]-w[0], kmh=min>0?km/(min/60):Infinity;
      const share=kmh/ceil; if(!(b.arrDerived||share>=0.8)) continue;
      const c=A[k+1]; let latest=null, bound="nothing: last anchor";
      if(c&&c.p){ const nkm=legPath(b,c).len*KM_PER_MAP; latest=c.arr-nkm/(SPEED_CEIL[f.arm]||5)*60;
        if(c.tm&&c.tm.dep!=null) latest=Math.min(latest,c.w[0]);
        bound=id+"@"+c.ph+" reached "+hm(c.arr)+(c.tm?(c.tm.at!=null?" (dated)":" (dated departure)"):" (phase-start default)")+", "+(nkm*1000).toFixed(0)+" m on"; }
      else if(c&&c.p===null){ latest=PHASES[c.ph].t0; bound="leaves the field at "+hm(latest); }
      else latest=T_MAX;
      const slowest=latest>w[0]?km/((latest-w[0])/60):Infinity;
      out.push({key:id+"@"+b.ph,id,arm:f.arm,ceil,km:+km.toFixed(2),dep:w[0],arr:w[1],min:Math.round(min),kmh:+kmh.toFixed(2),share:+share.toFixed(2),
        derived:!!b.arrDerived,how:b.arrDerived?(b.arrRule==="moveMin"?"moveMin "+b.moveMin:b.arrRule):"dated window",flag:b.arrFlag||null,
        status:statusDuring(id,b.ph),ground:ground(pp),latest,bound,slowest:+slowest.toFixed(2),
        forced:!b.arrDerived}); } });
  return out;
}
/* readings for a variant: explicit arrivals injected in memory, caches cleared */
function readings(){
  Object.keys(FORMATIONS).forEach(id=>{ delete FORMATIONS[id]._anchors; });
  const aud=auditMovement();
  let cut=null; for(let t=240;t<=1080;t++){ clock=t; if(centreSeparation()){ cut=hm(t); break; } }
  const ev=[]; EVENTS.forEach(e=>{ const w=Array.isArray(e.t)?e.t:[e.t,e.t], tol=e.tolKm!==undefined?Math.min(e.tolKm,2):1; let best=null;
    for(let t=w[0];t<=w[1];t+=2){ clock=t; e.forms.forEach(fid=>{ if(!FORMATIONS[fid]||!FORMATIONS[fid].track) return; const p=posNow(fid); if(!p) return;
      const km=Math.hypot(p[0]-e.p[0],p[1]-e.p[1])*KM_PER_MAP; if(!best||km<best.km) best={km,fid}; }); }
    if(best&&best.km>tol) ev.push(e.id+" "+best.km.toFixed(2)+" km (tolerance "+tol+")"); });
  clock=525; const p0845=plateauStrength("fr"); clock=570; const p0930=plateauStrength("fr");
  return {audit:aud.map(p=>p.id+" "+p.leg+" "+p.why),cut,events:ev,fr0845:p0845,fr0930:p0930};
}
const base=legs(), derived=base.filter(r=>r.derived);
const TACT=TACTICAL_RATE;   /* option (b), now the live engine's table: DESIGN VALUES, unsourced (no rate for art or hq) */
const FORMED={test:st=>!!BATTLE_ORDER[st]};
const LIVE=r=>r.how==="ceiling"||r.how==="tactical";   /* the legs whose arrival a rate decides (not moveMin) */
function variant(fn){
  const saved={}; derived.forEach(r=>{ const e=FORMATIONS[r.id].track[+r.key.split("@")[1]]; saved[r.key]=e.tm; const at=fn(r);
    if(at!=null) e.tm=Object.assign({},e.tm,{at:Math.ceil(at)}); });
  const out=readings(), rows=derived.map(r=>{ const A=anchorList(r.id), b=A.find(q=>q.ph===+r.key.split("@")[1]);
    return {key:r.key,arr:hm(b.arr),kmh:+(r.km/((b.w[1]-b.w[0])/60)).toFixed(2),fits:b.arr<=r.latest+1e-6}; });
  derived.forEach(r=>{ FORMATIONS[r.id].track[+r.key.split("@")[1]].tm=saved[r.key]; });
  Object.keys(FORMATIONS).forEach(id=>{ delete FORMATIONS[id]._anchors; });
  return Object.assign(out,{rows});
}
const VAR={
  "live engine: b where it fits, else c (flagged)":()=>null,
  "c at the ceiling (before the 2C precondition)":r=>LIVE(r)?Math.ceil(r.dep+r.km/r.ceil*60-1e-9):null,
  "a 75% of ceiling":r=>LIVE(r)?r.dep+r.km/(0.75*r.ceil)*60:null,
  "a 60% of ceiling":r=>LIVE(r)?r.dep+r.km/(0.60*r.ceil)*60:null,
  "a 50% of ceiling":r=>LIVE(r)?r.dep+r.km/(0.50*r.ceil)*60:null,
  "b tactical rate in battle order":r=>LIVE(r)&&TACT[r.arm]&&FORMED.test(r.status||"")?r.dep+r.km/(TACT[r.arm])*60:null
};
const res={};
Object.entries(VAR).forEach(([k,fn])=>res[k]=variant(fn));
/* ---- report ---- */
console.log("legs with a derived arrival: "+derived.length+"; legs at 80% of their ceiling or more: "+base.filter(r=>r.share>=0.8).length);
base.forEach(r=>console.log((r.derived?"DERIVED ":"dated   ")+r.key.padEnd(13)+hm(r.dep)+"-"+hm(r.arr)+"  "+r.km+" km  "+r.kmh+" km/h = "+Math.round(100*r.share)+"% of "+r.ceil+
  "  ["+r.how+(r.flag?"; flagged: "+r.flag:"")+"]  status "+r.status+"  ground "+r.ground.from+"->"+r.ground.to+" m, ascent "+r.ground.asc+" m"+(r.ground.crosses?", crosses the Goldbach":"")+(r.ground.villages.length?", through "+r.ground.villages.join("/"):"")+
  "  | latest arrival "+hm(r.latest)+" (bound: "+r.bound+"), slowest pace "+r.slowest+" km/h"));
console.log("\nOPTIONS (rates are design values, unsourced):");
Object.entries(res).forEach(([k,v])=>{ console.log("== "+k+": centre separation "+v.cut+"; French on the plateau 08:45 / 09:30 "+v.fr0845+" / "+v.fr0930+"; audit findings "+v.audit.length+(v.audit.length?": "+v.audit.join("; "):"")+"; event failures "+v.events.length+(v.events.length?": "+v.events.join("; "):""));
  console.log("   "+v.rows.map(r=>r.key+" "+r.arr+" "+r.kmh+" km/h"+(r.fits?"":" DOES NOT FIT")).join("; ")); });
const md=process.argv.indexOf("--md"); if(md>0){
  const L=["| leg | window | km | km/h | share of ceiling | arrival | status during the leg | ground: elevation, ascent | Goldbach | villages | bounded by (latest arrival; slowest pace that fits) |","|---|---|---:|---:|---:|---|---|---|---|---|---|"];
  base.forEach(r=>L.push("| "+r.key+" | "+hm(r.dep)+"-"+hm(r.arr)+" | "+r.km+" | "+r.kmh+" | "+Math.round(100*r.share)+"% of "+r.ceil+" | "+(r.derived?"derived ("+r.how+(r.flag?"; flagged: "+r.flag:"")+")":"dated")+" | "+r.status+" | "+r.ground.from+" → "+r.ground.to+" m, +"+r.ground.asc+" m | "+(r.ground.crosses?"crosses":"-")+" | "+(r.ground.villages.join(", ")||"-")+" | "+r.bound+"; "+hm(r.latest)+"; "+r.slowest+" km/h |"));
  L.push("","| option | arrivals (leg: arrival, km/h; ! = does not fit before the next anchor) | centre separation | French on plateau 08:45 / 09:30 | movement-audit findings | event failures |","|---|---|---|---|---|---|");
  Object.entries(res).forEach(([k,v])=>L.push("| "+k+" | "+v.rows.map(r=>r.key+" "+r.arr+", "+r.kmh+(r.fits?"":" !")).join("; ")+" | "+v.cut+" | "+v.fr0845+" / "+v.fr0930+" | "+(v.audit.join("; ")||"0")+" | "+(v.events.join("; ")||"0")+" |"));
  fs.writeFileSync(process.argv[md+1],L.join("\n")+"\n"); }
const j=process.argv.indexOf("--json"); if(j>0) fs.writeFileSync(process.argv[j+1],JSON.stringify({legs:base,options:res,TACT},null,1));
