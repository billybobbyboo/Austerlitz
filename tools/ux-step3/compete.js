#!/usr/bin/env node
/* UI/UX roadmap step 3: a framing.js run's frames read by how many events compete (the events above 0.3 in the frame): for each count, the frames,
   the eye's distance (median, range), the box's share of the free map (median) and the share of frames with every one of them inside; the minutes
   with no live event (what the eye did: its largest move); and the handoffs (a frame where the set of events above 0.3 changes): the largest
   projected move of the ground within two seconds after one, against its frames elsewhere.
   node tools/ux-step3/compete.js <run-frames.json>... */
"use strict";
const fs=require("fs"), q=(a,p)=>{ if(!a.length) return null; const s=a.slice().sort((x,y)=>x-y); return s[Math.min(s.length-1,Math.floor(s.length*p))]; };
process.argv.slice(2).forEach(f=>{ const F=JSON.parse(fs.readFileSync(f,"utf8")).filter(x=>x.p), by={};
  F.forEach(x=>{ const n=Math.min(5,x.ev.length), B=by[n]||(by[n]={frames:0,d:[],box:[],all:0,flow:[]}); B.frames++; B.d.push(x.cam.d); B.box.push(x.box); if(x.ev.every(e=>e[2]==="free")) B.all++; if(x.fl!==undefined) B.flow.push(x.fl); });
  console.log(f.split("/").pop());
  Object.keys(by).sort().forEach(n=>{ const B=by[n]; console.log("  "+(n==="5"?"5+":n)+" events: "+B.frames+" frames, eye "+q(B.d,0.5)+" units ("+Math.min(...B.d)+"-"+Math.max(...B.d)+"), box "+(100*q(B.box,0.5)).toFixed(1)+"%, all inside "+(100*B.all/B.frames).toFixed(1)+"%, ground's move p95 "+q(B.flow,0.95)+" max "+(B.flow.length?Math.max(...B.flow):"-")+" px/s"); });
  /* the handoffs */
  const key=x=>x.ev.map(e=>e[0]).sort().join(","), H=[]; for(let i=1;i<F.length;i++) if(key(F[i])!==key(F[i-1])) H.push(i);
  const near=new Set(); H.forEach(i=>{ for(let j=i;j<Math.min(F.length,i+60);j++) near.add(j); });
  const fN=[], fO=[]; F.forEach((x,i)=>{ if(x.fl===undefined) return; (near.has(i)?fN:fO).push(x.fl); });
  console.log("  handoffs (the set of events above 0.3 changing): "+H.length+"; the ground's move in the 2 s after one: p95 "+q(fN,0.95)+", max "+(fN.length?Math.max(...fN):"-")+" px/s; elsewhere: p95 "+q(fO,0.95)+", max "+(fO.length?Math.max(...fO):"-")+" px/s");
  /* the minutes with no live event at all (no event above 0.02: the eye's target and distance held) */
  const none=F.filter(x=>!x.ev.length), mins=[...new Set(none.map(x=>Math.floor(x.c)))];
  console.log("  frames with no event above 0.3: "+none.length+" ("+mins.length+" minutes: "+(mins.length?mins.slice(0,3).join(",")+(mins.length>3?"... "+mins[mins.length-1]:""):"none")+")");
});
