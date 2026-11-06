/* The final audits' Stage 4, WP-04b: what a change to world.js moves, between two trees (each with node_modules and _clock.js:
   node tools/mk-helpers.js in it first): (a) the land cover (coverClass on localHeight, the live classifier) on a 1-unit world grid; (b) the
   drawn streams' beds (GOLDBACH_M, LITAVA_M, each BROOKS_M, downstream, every 0.5 world units): every reverse gradient of 1 m or more (the bed above
   the lowest bed upstream of it), before and after; (c) "Whose eyes?": app.js's own knowledgeOf, hasLOS and their constants, extracted from each
   tree's app.js and run on its own relief, for every formation from both headquarters every 10 minutes 04:00-17:00; (d) the buildings on their
   cover class (BLDG, planBuildings8g on the drawn cover) by village; (e) the height change over the frame.
     node tools/final-stage4-wp04b/consequences.js BASEROOT CANDROOT [OUT.json]
   Measurement code only: reads the trees, writes OUT.json only. */
"use strict";
const fs=require("fs"), path=require("path"), vm=require("vm");
const [BASE,CAND,OUT]=process.argv.slice(2).map((a,i)=>i<2?path.resolve(a):a);
function load(ROOT){
  const L=require(path.join(ROOT,"tools","audit-post8","geography","lib.js")), G=L.load(ROOT), app=fs.readFileSync(path.join(ROOT,"app.js"),"utf8");
  const grab=re=>{ const m=app.match(re); if(!m) throw new Error(ROOT+": not found in app.js: "+re); return m[0]; };
  vm.runInContext(grab(/\nvar EYE_OBSERVER_M=[^\n]*/)+"\n"+grab(/\nfunction hasLOS\([\s\S]*?\n\}\n/)+"\nvar knowCache={}, knowKey='', commandView='none', curPhase=0;\n"+
    grab(/\nfunction knowledgeOf\([\s\S]*?\n\}\n/),G);
  G.ROOT=ROOT; return G;
}
const A=load(BASE), B=load(CAND), out={base:BASE, cand:CAND};
const names=["field","meadow","marsh","water","wood","village","vineyard","track"];
/* (a) the land cover */
{ let n=0, changed=0; const moves={}, before={}, after={};
  for(let z=-155;z<=155;z+=1) for(let x=-180;x<=180;x+=1){ const a=A.coverClass(x,z,A.localHeight(x,z)), b=B.coverClass(x,z,B.localHeight(x,z)); n++;
    before[names[a]]=(before[names[a]]||0)+1; after[names[b]]=(after[names[b]]||0)+1; if(a!==b){ changed++; const k=names[a]+"->"+names[b]; moves[k]=(moves[k]||0)+1; } }
  out.cover={points:n, changed, moves, before, after};
  console.log("(a) land cover, 1-unit world grid: "+n+" points, "+changed+" change class "+JSON.stringify(moves)); }
/* (b) the streams */
{ const samp=(G,L)=>{ const o=[]; for(let i=0;i<L.length-1;i++){ const a=G.W(...L[i]), b=G.W(...L[i+1]), d=Math.hypot(b[0]-a[0],b[1]-a[1]), k=Math.max(1,Math.ceil(d/0.5));
      for(let s=0;s<k;s++) o.push([a[0]+(b[0]-a[0])*s/k, a[1]+(b[1]-a[1])*s/k]); } return o; };
  const rises=(G,P)=>{ const m=P.map(p=>G.GEOREF.elevM(G.height(p[0],p[1]))); let rev=[], run=null, lo=m[0];
    for(let i=1;i<m.length;i++){ if(m[i]>lo+1e-9){ if(!run) run={from:i-1, peak:0}; run.peak=Math.max(run.peak,m[i]-lo); run.to=i; } else { if(run){ rev.push(run); run=null; } lo=m[i]; } }
    if(run) rev.push(run); return {m, rev:rev.filter(r=>r.peak>=1).map(r=>({fromMap:[P[r.from][0]*2+340,P[r.from][1]*2+250].map(v=>+v.toFixed(0)), toMap:[P[r.to][0]*2+340,P[r.to][1]*2+250].map(v=>+v.toFixed(0)), riseM:+r.peak.toFixed(1)}))}; };
  out.streams={};
  [["Goldbach","GOLDBACH_M"],["Litava","LITAVA_M"]].concat(A.BROOKS_M.map((b,i)=>["BROOKS["+i+"]",i])).forEach(([n,k])=>{
    const LA=typeof k==="number"?A.BROOKS_M[k]:A[k], LB=typeof k==="number"?B.BROOKS_M[k]:B[k], PA=samp(A,LA), PB=samp(B,LB), a=rises(A,PA), b=rises(B,PB);
    const same=JSON.stringify(LA)===JSON.stringify(LB), ch=same?a.m.map((v,i)=>b.m[i]-v):null, mx=ch?ch.reduce((x,y)=>Math.abs(y)>Math.abs(x)?y:x,0):null;
    out.streams[n]={before:a.rev, after:b.rev, bedChangeMaxM:mx==null?null:+mx.toFixed(1), sameLine:same};
    console.log("(b) "+n.padEnd(10)+" reverse >=1 m before "+a.rev.length+" "+JSON.stringify(a.rev.map(r=>r.riseM))+", after "+b.rev.length+" "+JSON.stringify(b.rev.map(r=>r.riseM))+(mx==null?" (the line moved)":"; bed change max "+mx.toFixed(1)+" m")); }); }
/* (c) "Whose eyes?" */
{ const know=(G,view,id,t)=>{ vm.runInContext("clock="+t+"; curPhase=phaseAt(clock); commandView='"+view+"'; knowKey='';",G); return G.knowledgeOf(id); };
  out.knowledge={byView:{}, changes:[]};
  ["fr","al"].forEach(view=>{ let n=0, diff=0; const tally={};
    for(let t=240;t<=1020;t+=10) Object.keys(A.FORMATIONS).forEach(id=>{ const a=know(A,view,id,t), b=know(B,view,id,t); if(a==="own"&&b==="own") return; n++;
      if(a!==b){ diff++; const k=a+"->"+b; tally[k]=(tally[k]||0)+1; out.knowledge.changes.push({view, id, t:A.fmtClock(t), from:a, to:b}); } });
    out.knowledge.byView[view]={readings:n, changed:diff, moves:tally};
    console.log("(c) "+(view==="fr"?"Napoleon's":"the Allied")+" headquarters: "+n+" readings (formation x 10 min, 04:00-17:00), "+diff+" change "+JSON.stringify(tally)); });
  const per={}; out.knowledge.changes.forEach(c=>{ const k=c.view+" "+c.id; per[k]=(per[k]||0)+1; }); out.knowledge.byFormation=per;
  console.log("    by formation: "+JSON.stringify(per)); }
/* (d) the buildings on the drawn cover by village, as tools/audit-post8/geography/buildings.js counts them (the planner's records, the parts that
   are buildings, each centre's drawnCover class), and the records' count and placement (any record moved) */
{ const by=G=>{ vm.runInContext("var __WP=woodsPlan(); var __B=planBuildings8g(__WP.broad.concat(__WP.conif));",G); const o={}, rec=[];
    G.__B.forEach(b=>{ if(b.R) rec.push([b.village,b.part||"",+b.R.x.toFixed(3),+b.R.z.toFixed(3)]); if(!b.R||b.landmark&&!(b.church||b.part==="chapel"||b.part==="church")) return;
      if(b.part==="fence"||b.part==="churchyard wall") return; const c=names[G.drawnCover(b.R.x,b.R.z)], q=o[b.village]=o[b.village]||{n:0}; q.n++; q[c]=(q[c]||0)+1; });
    return {o, rec}; };
  const a=by(A), b=by(B), moved=a.rec.filter((r,i)=>JSON.stringify(r)!==JSON.stringify(b.rec[i])).length;
  out.buildings={before:a.o, after:b.o, records:[a.rec.length,b.rec.length], recordsMoved:moved+Math.abs(a.rec.length-b.rec.length)};
  console.log("(d) buildings' records "+a.rec.length+" -> "+b.rec.length+", "+out.buildings.recordsMoved+" moved or added");
  Object.keys(b.o).forEach(v=>{ const x=a.o[v]||{}, y=b.o[v]; if(JSON.stringify(x)!==JSON.stringify(y)) console.log("    "+v+": "+JSON.stringify(x)+" -> "+JSON.stringify(y)); }); }
/* (e) the height change over the frame */
{ let worst={d:0}, nch=0, n=0;
  for(let z=-125;z<=125;z+=1) for(let x=-170;x<=170;x+=1){ const d=(B.height(x,z)-A.height(x,z))*A.GEOREF.V_M_PER_UNIT; n++; if(Math.abs(d)>0.5) nch++; if(Math.abs(d)>Math.abs(worst.d)) worst={d, map:[x*2+340,z*2+250]}; }
  out.frame={points:n, movedOver05m:nch, largestM:+worst.d.toFixed(1), at:worst.map};
  console.log("(e) height change over the frame: "+nch+" of "+n+" points move more than 0.5 m; largest "+worst.d.toFixed(1)+" m at map "+worst.map); }
if(OUT) fs.writeFileSync(OUT,JSON.stringify(out,null,1));
