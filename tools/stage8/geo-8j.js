#!/usr/bin/env node
/* Stage 8, the follow-up 8J (decision 259 (a); docs/STAGE8_SPEC.md section 21.7): what the corrections draw, measured in node on the model's own
   cover (no page): the traced pheasantry's outline drawn as wood (drawnCover, coverClass's 4) and its spill outside, sampled every 0.25 world
   units; the classes at the castle's and the Pratzen church's sites and over the garden's outline; the corrected Goldbach's distances to the
   castle, the village and the build's old bed; the heights at the sites (GEOREF.elevM over hAt). Optionally against another tree (--before).
   node tools/stage8/geo-8j.js [--before <tree>] [--json out.json]   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
function load(ROOT){ const ctx={}; const vm=require("vm"); const sb={console, Math, Float32Array, Uint8Array, Int16Array, Array, Object, JSON, isFinite, parseFloat};
  sb.GEOREF=require(path.join(ROOT,"geo.js")); sb.THREE=require(path.join(__dirname,"..","..","node_modules","three")); vm.createContext(sb);
  for(const f of ["data.js","analysis.js","tokens.js","world.js"]) vm.runInContext(fs.readFileSync(path.join(ROOT,f),"utf8"),sb,{filename:f});
  vm.runInContext("buildCover(); buildCoverMl(); if(typeof buildGrid==='function') buildGrid();",sb); return sb; }
const CLS=["open","low wet","marsh","water","wood","village","vine","road"];
function measure(G){ const r={};
  const pw=G.WOODS.find(w=>w.poly);
  if(pw){ const P=G.polyWorld(pw), b=P.box; let inN=0, inW=0, outN=0, outW=0, by={};
    for(let x=b[0]-3;x<=b[2]+3;x+=0.25) for(let z=b[1]-3;z<=b[3]+3;z+=0.25){ const inside=G.inPolyW(x,z,P), c=G.drawnCover(x,z);
      if(inside){ inN++; if(c===4) inW++; by[CLS[c]]=(by[CLS[c]]||0)+1; } else if(G.polySd(x,z,P)<3){ outN++; if(c===4) outW++; } }
    r.pheasantry={samples:inN, woodShare:+(inW/inN).toFixed(3), classesInside:Object.fromEntries(Object.entries(by).map(([k,v])=>[k,+(v/inN).toFixed(3)])), spillWithin3Units:+(outW/outN).toFixed(3)}; }
  else { const w=G.WOODS[0]; r.pheasantry={ellipse:w.c, rx:w.rx, ry:w.ry}; }
  const site=(name,mp)=>{ const w=G.W(mp[0],mp[1]); return {name, map:mp, cover:CLS[G.coverClass(w[0],w[1])], drawn:CLS[G.drawnCover(w[0],w[1])], elevM:+G.GEOREF.elevM(G.hAt(mp[0],mp[1])).toFixed(1)}; };
  const LS=G.LANDMARK_SITES||null;
  r.sites=[site("Sokolnitz (village point)",[G.GEOREF.GT.sokolnitz.map[0],G.GEOREF.GT.sokolnitz.map[1]])];
  if(LS){ r.sites.push(site("the castle's site",LS.castle)); Object.keys(LS.church||{}).forEach(k=>r.sites.push(site(k+"'s church site",LS.church[k]))); }
  if(G.GARDENS){ G.GARDENS.forEach(g=>{ const P=G.polyWorld(g), b=P.box; const by={}; let n=0; for(let x=b[0];x<=b[2];x+=0.25) for(let z=b[1];z<=b[3];z+=0.25){ if(!G.inPolyW(x,z,P)) continue; n++; const c=CLS[G.coverClass(x,z)]; by[c]=(by[c]||0)+1; }
    r.garden={n:g.n, samples:n, classes:Object.fromEntries(Object.entries(by).map(([k,v])=>[k,+(v/n).toFixed(3)]))}; }); }
  const bed=G.GOLDBACH_M, segD=(p,L)=>{ let d=1e9; for(let i=0;i<L.length-1;i++){ const a=L[i], c=L[i+1], dx=c[0]-a[0], dy=c[1]-a[1], t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy))); d=Math.min(d,Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)); } return d*G.GEOREF.KM_PER_MAP*1000; };
  r.bed={toVillageM:Math.round(segD(G.GEOREF.GT.sokolnitz.map,bed)), toCastleSiteM:LS?Math.round(segD(LS.castle,bed)):null};
  return r; }
const AFTER=path.join(__dirname,"..",".."), BEFORE=opt("--before"), out={tool:"tools/stage8/geo-8j.js", after:measure(load(AFTER))};
if(BEFORE) out.before=measure(load(path.resolve(BEFORE)));
console.log(JSON.stringify(out,null,1));
if(opt("--json")) fs.writeFileSync(opt("--json"),JSON.stringify(out,null,1));
