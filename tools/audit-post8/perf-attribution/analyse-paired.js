/* Final audit after Stage 8, area perf-attribution: paired.js's session summarised. Usage: node analyse-paired.js <paired.json> [ref=L3] > paired.md
   Per motion: each build's blocks (the main thread's CPU per frame, schedstat, the whole timed evaluate; loop() p50; three.render p50), the median
   over its blocks, and each build against the reference by the blocks next to each other in the palindrome (each block of a build with the
   nearest reference block: the ratio of their CPU per frame), so that the machine's drifting load cancels; then the count blocks: GL calls per
   frame by method and the listed app calls per frame, each build against the reference (load-independent). */
"use strict";
const fs=require("fs");
const o=JSON.parse(fs.readFileSync(process.argv[2],"utf8")), REF=process.argv[3]||"L3";
const labels=o.builds.map(b=>b.label), others=labels.filter(l=>l!==REF);
const med=a=>{ const s=a.filter(x=>x!=null&&isFinite(x)).sort((x,y)=>x-y), n=s.length; return n?(n%2?s[n>>1]:(s[n/2-1]+s[n/2])/2):null; };
const f2=x=>x==null?"-":(+x).toFixed(2), pc=x=>x==null?"-":((x-1)*100>=0?"+":"")+((x-1)*100).toFixed(1)+"%";
const out=[];
out.push("# paired session: "+labels.map(l=>{ const b=o.builds.find(x=>x.label===l); return l+" ("+b.md5.slice(0,8)+", "+b.bytes+" B)"; }).join(", "));
out.push("\nviewport "+o.viewport.join("x")+", frame "+o.frameMs.toFixed(3)+" ms (144 Hz), blocks per build per motion "+(2*o.reps)+" (palindrome order), frames per block "+JSON.stringify(o.N)+", warm-up "+o.warm+"; load "+JSON.stringify(o.load0)+" -> "+JSON.stringify(o.load1)+"\n");
out.push("## Start-up in this session (ms; one page each, opened one after another under the machine's load)\n");
out.push("| build | DOM ready | first frame | boot overlay gone | main thread quiet | BOOTMS init |"); out.push("|---|---|---|---|---|---|");
labels.forEach(l=>{ const b=o.pages[l].boot; out.push("| "+l+" | "+b.domReady+" | "+b.firstFrame+" | "+b.bootGone+" | "+b.lastLongEnd+" | "+(b.bootms?b.bootms.init:"(none before 8H)")+" |"); });
const S={};
Object.keys(o.motions).forEach(m=>{ const M=o.motions[m]; S[m]={};
  out.push("\n## "+m+"\n\n"+M.note+"\n");
  out.push("Blocks in order: "+M.blocks.map(b=>b.build+" "+f2(b.cpuMsPerFrame)).join(", ")+"\n");
  out.push("| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs "+REF+" (adjacent blocks: median, range) |");
  out.push("|---|---|---|---|---|---|---|---|---|---|");
  labels.forEach(l=>{ const B=M.blocks.filter(b=>b.build===l); if(!B.length) return;
    const ratios=l===REF?[]:B.map(b=>{ const R=M.blocks.filter(x=>x.build===REF); let best=null; R.forEach(x=>{ if(!best||Math.abs(x.i-b.i)<Math.abs(best.i-b.i)) best=x; }); return best?b.cpuMsPerFrame/best.cpuMsPerFrame:null; });
    const x={cpu:med(B.map(b=>b.cpuMsPerFrame)), cpus:B.map(b=>b.cpuMsPerFrame), wait:med(B.map(b=>b.cpuWaitMsPerFrame)), loop:med(B.map(b=>b.loop.p50)), three:med(B.map(b=>b.steps["three.render"]&&b.steps["three.render"].p50)),
      upd:med(B.map(b=>b.steps.updateVisibility&&b.steps.updateVisibility.p50)), ml:med(B.map(b=>b.steps.mlLayout&&b.steps.mlLayout.p50)), calls:med(B.map(b=>b.calls.p50)), ratio:med(ratios), ratios};
    S[m][l]=x;
    out.push("| "+l+" | "+B.length+" | "+f2(x.cpu)+" ("+x.cpus.map(f2).join(", ")+") | "+f2(x.wait)+" | "+f2(x.loop)+" | "+f2(x.three)+" | "+f2(x.upd)+" | "+f2(x.ml)+" | "+x.calls+" | "+(l===REF?"-":pc(x.ratio)+" ("+ratios.map(pc).join(", ")+")")+" |"); });
  if(M.counts&&Object.keys(M.counts).length){
    const C=M.counts, keys=new Set(); labels.forEach(l=>C[l]&&Object.keys(C[l].gl).forEach(k=>keys.add(k)));
    out.push("\nCounts per frame (load-independent; "+(C[labels[0]]||{}).frames+" frames each): GL calls in all "+labels.map(l=>l+" "+(C[l]?C[l].glTotalPerFrame:"-")).join(", ")+"; bytes uploaded by bufferData/bufferSubData "+labels.map(l=>l+" "+(C[l]?C[l].bytesPerFrame:"-")).join(", ")+"; draw calls "+labels.map(l=>l+" "+(C[l]?C[l].calls:"-")).join(", ")+"\n");
    const rows=[...keys].map(k=>[k,labels.map(l=>C[l]&&C[l].gl[k]||0)]).filter(r=>Math.max(...r[1])>=1).sort((a,b)=>Math.max(...b[1])-Math.max(...a[1]));
    out.push("| GL method | "+labels.join(" | ")+" | "+others.map(l=>l+" - "+REF).join(" | ")+" |"); out.push("|---|"+labels.map(()=>"---").join("|")+"|"+others.map(()=>"---").join("|")+"|");
    rows.slice(0,28).forEach(r=>out.push("| "+r[0]+" | "+r[1].map(v=>v.toFixed(1)).join(" | ")+" | "+others.map(l=>{ const d=r[1][labels.indexOf(l)]-r[1][labels.indexOf(REF)]; return (d>=0?"+":"")+d.toFixed(1); }).join(" | ")+" |"));
    const ak=new Set(); labels.forEach(l=>C[l]&&Object.keys(C[l].app).forEach(k=>ak.add(k)));
    const arows=[...ak].map(k=>[k,labels.map(l=>C[l]&&C[l].app[k]||0)]).sort((a,b)=>Math.max(...b[1])-Math.max(...a[1]));
    out.push("\n| app function (calls per frame) | "+labels.join(" | ")+" |"); out.push("|---|"+labels.map(()=>"---").join("|")+"|");
    arows.forEach(r=>out.push("| "+r[0]+" | "+r[1].map(v=>v.toFixed(1)).join(" | ")+" |"));
    S[m].counts=C;
  }
});
fs.writeFileSync(process.argv[2].replace(/\.json$/,"-summary.json"),JSON.stringify(S,null,1));
console.log(out.join("\n"));
