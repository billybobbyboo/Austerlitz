#!/usr/bin/env node
/* Final audit after Stage 8, area a11y: a compact digest of the probes' records (docs/audit-post8-evidence/a11y/*.json), for reading.
   node tools/audit-post8/a11y/digest.js <tag> [full] */
"use strict";
const fs=require("fs"), path=require("path");
const EV=path.join(__dirname,"..","..","..","docs","audit-post8-evidence","a11y");
const tag=process.argv[2], full=process.argv[3]==="full";
const R=JSON.parse(fs.readFileSync(path.join(EV,tag+".json"),"utf8"));
const cut=(s,n)=>{ s=typeof s==="string"?s:JSON.stringify(s); return s&&s.length>n?s.slice(0,n)+"…":s; };
console.log(tag,"ok:",R.ok,"seconds:",R.seconds,R.error?"ERROR "+R.error.slice(0,400):"");
for(const s of R.steps){
  const o=Object.assign({},s); delete o.step; delete o.t;
  const lines=[];
  if(o.fi) lines.push("focus: "+(o.fi.el||"?")+(o.ax?" ["+o.ax.role+" '"+cut(o.ax.name||"",60)+"']":"")+(o.fi.vis===false?" NOT VISIBLE":"")+(o.fi.onScreen===false?" OFF SCREEN":"")+(o.fi.covered?" cover="+cut(o.fi.covered,80):""));
  delete o.fi; delete o.ax;
  if(o.targets&&!full){ const t=o.targets; lines.push("targets: n="+t.n+" fail="+t.fail+" failing(excl. markers/phases)="+cut((t.failing||t.small||[]).filter(x=>x.spacing!=="passes"&&!/ev-mark|button\.step/.test(x.el)).map(x=>x.el+" "+x.w+"x"+x.h+" "+x.spacing),600)); delete o.targets; }
  if(o.small&&!full){ const m=o.small; lines.push("small: "+m.under12+"/"+m.texts+" under 12px; under floor "+m.underFloor.length+"; by "+cut(Object.entries(m.by).map(([k,v])=>k+":"+v.n),300)); delete o.small; }
  if(o.cut&&!full){ const c=o.cut; lines.push("cut: clipped "+c.clippedN+" "+cut(c.clipped.filter(x=>!/sr-only/.test(x.el)).map(x=>x.el+"("+x.dir+") '"+x.text.slice(0,40)+"'"),700)+"; beyond "+c.beyondN+" "+cut(c.beyondViewport.map(x=>x.el+" "+x.box.join(",")+" '"+x.text.slice(0,30)+"'"),500)); delete o.cut; }
  if(o.panels&&!full){ lines.push("overlaps: "+cut(o.panels.overlaps,400)); delete o.panels; }
  if(o.scroll&&!full){ const c=o.scroll; lines.push("scroll: "+c.iw+"x"+c.ih+" doc "+c.docSW+"x"+c.docSH+" h="+c.hscroll+" v="+c.vscroll+" vv="+cut(c.vv,80)+" "+c.bodyOverflow); delete o.scroll; }
  for(const k in o) lines.push(k+": "+cut(o[k],full?20000:700));
  console.log("\n## ["+s.t+"s] "+s.step+"\n  "+lines.join("\n  "));
}
console.log("\nshots:",R.shots.length,R.shots.filter(x=>/FAILED/.test(x)));
if(R.console&&R.console.length) console.log("console:",cut(R.console,800));
