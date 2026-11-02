#!/usr/bin/env node
/* Final audit after Stage 8, area visual-landscape: the troops' facings (decision 245 (a), S-5; app.js faceClock, enemyFacing, headingAt, poseBlock)
   judged against the situation the data draws. Drives the built app (bundle.js of an ISOLATED copy of the repository at HEAD, built there by
   build.py: byte-identical to the audited build) in runtime-test.js's own stubbed THREE + DOM environment (its prelude, read verbatim up to
   "drive the whole application"), so the yaw read is the one poseBlock gives each drawn block (a seek: the clock's own heading at once).
   Read-only on the repository.  usage: node facings.js <iso-root> <out.json>
   For every drawn block every 10 minutes 05:00-17:00: its drawn yaw, whether it moves (marchRate), its heading (headingAt), the facing rule's
   own answer (enemyFacing at faceClock), the nearest enemy now and the enemy mass within 2.5 km now (strength-weighted centroid), the phase
   status, and the angles between the drawn yaw and those bearings. Flags (DESIGN thresholds of this audit, stated in the output):
   A halted, nearest enemy now within 1.5 km, drawn yaw more than 90 degrees off its bearing (faces away from the nearest enemy);
   B moving under 1 km/h (a drift the gait does not animate) with an enemy within 1.5 km and the yaw more than 90 degrees off it
     (the block's back turned by a drift);
   C moving with a fighting status (attacking, engaged, charging, counterattack) and the yaw more than 120 degrees off the nearest enemy;
   D halted, the facing taken at faceClock more than 60 degrees off the nearest enemy's bearing now (a stale facing). */
/* not strict: the prelude is evaluated directly, as runtime-test.js runs it (sloppy mode) */
const AU_fs=require('fs'), AU_Module=require('module'), AU_path=require('path');
const AU_ISO=AU_path.resolve(process.argv[2]), AU_OUT=AU_path.resolve(process.argv[3]);
process.chdir(AU_ISO);
require=AU_Module.createRequire(AU_ISO+'/runtime-test.js');
let AU_pre=AU_fs.readFileSync(AU_ISO+'/runtime-test.js','utf8').split('/* ---- drive the whole application')[0];
if(!/const warns=\[\], errs=\[\];/.test(AU_pre)) throw new Error('runtime-test.js prelude changed');
AU_pre=AU_pre.replace('const warns=[], errs=[];','var warns=[], errs=[];');
const AU_t0=Date.now();
eval(AU_pre);
console.warn=(...a)=>warns.push(a.join(' ')); console.error=(...a)=>errs.push(a.join(' '));
process.stdout.write('loaded in '+((Date.now()-AU_t0)/1000).toFixed(0)+' s, errors '+errs.length+'\n');
closeFirst(null);
const AU_DEG=180/Math.PI;
const AU_ad=(a,b)=>{ let d=(a-b)%(2*Math.PI); if(d>Math.PI) d-=2*Math.PI; if(d<-Math.PI) d+=2*Math.PI; return d*AU_DEG; };
const AU_bear=(p,q)=>{ const a=W(p[0],p[1]), b=W(q[0],q[1]); return Math.atan2(b[0]-a[0],b[1]-a[1]); };
const AU_FIGHT={attacking:1,engaged:1,charging:1,counterattack:1};
const AU_rows=[], AU_flags={A:[],B:[],C:[],D:[]};
for(let t=300;t<=1020;t+=10){
  setClock(t,{instant:true,force:true,camera:false});
  for(let i=0;i<3;i++) updateVisibility();
  const ids=Object.keys(units).filter(id=>{ const r=units[id]; return r&&r.block&&r.block.userData&&r.block.userData.body&&FORMATIONS[id].arm!=="hq"&&posNow(id); });
  ids.forEach(id=>{
    const r=units[id], f=FORMATIONS[id], p=posNow(id), yaw=r.yaw;
    if(yaw===undefined||!r.block.visible) return;
    const mr=f.track?marchRate(id,t):null, moving=!!(mr&&mr.moving), hd=headingAt(id,t), ef=enemyFacing(id), fc=faceClock(id,t);
    let near=null, nd=1e9, mx=0, my=0, mw=0;
    Object.keys(units).forEach(k=>{ const g=FORMATIONS[k]; if(!g||g.arm==="hq"||!units[k].block||(g.nation==="fr")===(f.nation==="fr")) return;
      const q=posNow(k); if(!q) return; const d=Math.hypot(q[0]-p[0],q[1]-p[1])*KM_PER_MAP;
      if(d<nd){ nd=d; near={id:k,q:q}; }
      if(d<2.5){ const w=g.strength||3000; mx+=q[0]*w; my+=q[1]*w; mw+=w; } });
    const st=liveStatus(id,phaseAt(t));
    const row={t:fmtClock(t), id:id, arm:f.arm, nation:f.nation, status:st, moving:moving, kmh:mr?+mr.kmh.toFixed(2):null, yaw:+(yaw*AU_DEG).toFixed(1),
      heading:hd===null?null:+(hd*AU_DEG).toFixed(1), rule:ef===null?null:+(ef*AU_DEG).toFixed(1), faceClock:fmtClock(fc),
      near:near?near.id:null, nearKm:near?+nd.toFixed(2):null, dNear:near?+AU_ad(yaw,AU_bear(p,near.q)).toFixed(1):null,
      dMass:mw?+AU_ad(yaw,AU_bear(p,[mx/mw,my/mw])).toFixed(1):null, dRuleNow:(ef!==null&&near)?+AU_ad(ef,AU_bear(p,near.q)).toFixed(1):null};
    AU_rows.push(row);
    if(!moving&&near&&nd<1.5&&Math.abs(row.dNear)>90) AU_flags.A.push(row);
    if(moving&&mr.kmh<1&&near&&nd<1.5&&Math.abs(row.dNear)>90) AU_flags.B.push(row);
    if(moving&&AU_FIGHT[st]&&near&&Math.abs(row.dNear)>120) AU_flags.C.push(row);
    if(!moving&&near&&nd<1.5&&row.dRuleNow!==null&&Math.abs(row.dRuleNow)>60) AU_flags.D.push(row);
  });
}
const AU_sum={rows:AU_rows.length, flags:Object.fromEntries(Object.entries(AU_flags).map(([k,v])=>[k,v.length])),
  movingRows:AU_rows.filter(r=>r.moving).length, driftRows:AU_rows.filter(r=>r.moving&&r.kmh<1).length,
  haltedNear:AU_rows.filter(r=>!r.moving&&r.nearKm!==null&&r.nearKm<1.5).length,
  haltedNearWithin45:AU_rows.filter(r=>!r.moving&&r.nearKm!==null&&r.nearKm<1.5&&Math.abs(r.dNear)<=45).length};
AU_fs.writeFileSync(AU_OUT,JSON.stringify({about:"drawn yaw vs the situation, every 10 minutes 05:00-17:00 (flags A-D: see facings.js header)", summary:AU_sum, flags:AU_flags, rows:AU_rows},null,1));
process.stdout.write(JSON.stringify(AU_sum)+'\n');
for(const k of Object.keys(AU_flags)){ const by={}; AU_flags[k].forEach(r=>{ (by[r.id]=by[r.id]||[]).push(r.t+"("+r.status+","+(r.moving?r.kmh+"kmh":"halt")+",near "+r.near+" "+r.nearKm+"km d"+r.dNear+")"); });
  process.stdout.write("== "+k+"\n"); Object.keys(by).forEach(id=>process.stdout.write("  "+id+": "+by[id].length+"  "+by[id].slice(0,6).join("; ")+(by[id].length>6?" ...":"")+"\n")); }
