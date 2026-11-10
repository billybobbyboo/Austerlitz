#!/usr/bin/env node
/* The final audits' Stage 6, WP-10 (CL-VIS-04; owner decision 307): formation blocks drawn through buildings, measured on a built page (the harness's
   page, ?harness=1; the loop held; measurement only). Every 10 minutes 05:00-17:00 at 4x: each visible block's footprint (the extent of its seated
   men, horses and pieces, ud.ext, in the block's frame, carried to the ground through its world matrix) against every building's plan (BLDG's R,
   world.js v8Overlap with no gap): which blocks stand on which buildings, how many building parts, by village. A part "under" a block when their
   plans overlap at all.
   node tools/final-stage6/occupy.js [build.html] [--json out.json] */
"use strict";
const fs=require("fs"), path=require("path");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..",".."), L=require(path.join(ROOT,"tools","stage8","lib.js"));
const html=argv.find((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json"); if(html) process.env.AUSTERLITZ_HTML=path.resolve(html);
(async()=>{
  const b=await L.launch(), page=await L.open(b,[1600,900]);
  await page.evaluate(()=>{ window.loop=function(){}; });
  const res=await page.evaluate(()=>{
    var v=new THREE.Vector3(), rows=[], parts={}, byVil={}, byF={}, clocks=0, withAny=0;
    for(var t=300;t<=1020;t+=10){ setClock(t,{instant:true,force:true,camera:false}); updateVisibility(); clocks++; var any=false;
      Object.keys(units).forEach(function(id){ var bl=units[id].block, u=bl&&bl.userData; if(!bl||!bl.visible||!u||!u.ext) return; bl.updateMatrixWorld(true);
        var X=u.ext; if(!(X[1]>X[0])) return;
        var C=[[X[0],X[2]],[X[1],X[2]],[X[1],X[3]],[X[0],X[3]]].map(function(c){ v.set(c[0],0,c[1]).applyMatrix4(bl.matrixWorld); return [v.x,v.z]; });
        var cx=(C[0][0]+C[2][0])/2, cz=(C[0][1]+C[2][1])/2, ax=Math.hypot(C[1][0]-C[0][0],C[1][1]-C[0][1])/2, bz=Math.hypot(C[3][0]-C[0][0],C[3][1]-C[0][1])/2, th=Math.atan2(C[1][1]-C[0][1],C[1][0]-C[0][0]);
        var R=v8Rect(cx,cz,th,ax,bz), hit=[];
        BLDG.forEach(function(q,i){ if(!q.R) return; if(Math.abs(q.R.x-cx)>ax+bz+q.R.a+q.R.b||Math.abs(q.R.z-cz)>ax+bz+q.R.a+q.R.b) return; if(v8Overlap(R,q.R,0)) hit.push(i); });
        if(!hit.length) return; any=true;
        hit.forEach(function(i){ var q=BLDG[i]; parts[i]=(parts[i]||0)+1; byVil[q.village]=(byVil[q.village]||0)+1; });
        var k=id; byF[k]=byF[k]||{id:id, clocks:0, parts:0, villages:{}}; byF[k].clocks++; byF[k].parts+=hit.length; hit.forEach(function(i){ byF[k].villages[BLDG[i].village]=1; });
        rows.push({t:fmtClock(t), id:id, parts:hit.length, villages:Object.keys(hit.reduce(function(o,i){ o[BLDG[i].village]=1; return o; },{})).join(", ")}); });
      if(any) withAny++; }
    return {clocks:clocks, clocksWithAny:withAny, partsEverUnder:Object.keys(parts).length, buildingsDrawn:BLDG.filter(function(q){ return q.R; }).length,
      byVillage:byVil, byFormation:Object.keys(byF).map(function(k){ var f=byF[k]; f.villages=Object.keys(f.villages).join(", "); return f; }).sort(function(a,b){ return b.parts-a.parts; }), rows:rows};
  });
  if(opt("--json")) fs.writeFileSync(opt("--json"),JSON.stringify(res,null,1));
  console.log("clocks "+res.clocks+", with a block on a building "+res.clocksWithAny+"; building parts ever under a block "+res.partsEverUnder+" of "+res.buildingsDrawn);
  console.log("block-clocks on buildings by village (part-overlaps):",JSON.stringify(res.byVillage));
  res.byFormation.slice(0,15).forEach(f=>console.log("  "+f.id+": "+f.clocks+" clocks, "+f.parts+" part-overlaps ("+f.villages+")"));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(1); });
