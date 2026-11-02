/* Final audit after Stage 8, area perf-attribution: the pages measure.js wrote, summarised by build and motion across rounds.
   Usage: node analyse.js <outdir> [ref=L3] > summary.md ; also writes <outdir>/summary.json
   Per build and motion, over the rounds: the timing pass's loop() per frame (median of each round's median, with the rounds' range), the main
   thread's CPU and wait per frame (schedstat, the whole timed evaluate: loop, flush and sync), the named steps' medians, the draw calls; the profile
   pass's script by subsystem (ms a frame and share of the profiled run) and its top functions; each build against the reference build. */
"use strict";
const fs=require("fs"), path=require("path");
const dir=process.argv[2], REF=process.argv[3]||"L3";
const pages=fs.readdirSync(dir).filter(f=>/^page-\d+-.+\.json$/.test(f)).map(f=>JSON.parse(fs.readFileSync(path.join(dir,f),"utf8")));
const med=a=>{ const s=a.filter(x=>x!=null&&isFinite(x)).sort((x,y)=>x-y), n=s.length; return n?(n%2?s[n>>1]:(s[n/2-1]+s[n/2])/2):null; };
const f2=x=>x==null?"-":(+x).toFixed(2), f3=x=>x==null?"-":(+x).toFixed(3);
const rng=a=>{ const s=a.filter(x=>x!=null&&isFinite(x)); return s.length?f2(Math.min(...s))+"-"+f2(Math.max(...s)):"-"; };
const builds=[...new Set(pages.map(p=>p.build.label))], B={};
pages.forEach(p=>{ (B[p.build.label]=B[p.build.label]||[]).push(p); });
const motions=[...new Set([].concat(...pages.map(p=>Object.keys(p.motions||{}))))];
const S={builds:{}, motions, ref:REF};
const out=[];
out.push("# perf-attribution summary ("+pages.length+" pages: "+builds.map(b=>b+" x"+B[b].length+" (rounds "+B[b].map(p=>p.round).join(",")+")").join(", ")+")\n");
out.push("## Start-up (ms from navigation, page's own clock)\n");
out.push("| build | rounds | DOM ready | first frame (AUS_BOOT ok) | boot overlay gone | main thread quiet (last long task end) | longest task | long tasks total |");
out.push("|---|---|---|---|---|---|---|---|");
builds.forEach(b=>{ const P=B[b].filter(p=>p.boot); const g=k=>P.map(p=>p.boot[k]);
  S.builds[b]={md5:B[b][0].build.md5, bytes:B[b][0].build.bytes, boot:{domReady:med(g("domReady")), firstFrame:med(g("firstFrame")), bootGone:med(g("bootGone")), quiet:med(g("lastLongEnd")), longest:med(g("longest")), longMs:med(g("longMs")), ranges:{firstFrame:rng(g("firstFrame")), bootGone:rng(g("bootGone")), quiet:rng(g("lastLongEnd"))}}, motions:{}};
  out.push("| "+b+" | "+P.length+" | "+med(g("domReady"))+" ("+rng(g("domReady"))+") | "+med(g("firstFrame"))+" ("+rng(g("firstFrame"))+") | "+med(g("bootGone"))+" ("+rng(g("bootGone"))+") | "+med(g("lastLongEnd"))+" ("+rng(g("lastLongEnd"))+") | "+med(g("longest"))+" | "+med(g("longMs"))+" |"); });
out.push("");
const STEPK=["updateVisibility","mlLayout","renderFrame","three.render","renderFX","gdepthPass","arrowCap","applyLight","placeLights","applyAtmo","syncViewOffset","syncFollow","tickClock","followStep","frameState","kitLodFrame"];
motions.forEach(m=>{
  out.push("## "+m+"\n");
  const note=(pages.find(p=>p.motions&&p.motions[m])||{}).motions[m].note; out.push(note+"\n");
  out.push("| build | rounds | loop p50 (range) | loop mean | CPU/frame (range) | wait/frame | GPU proc CPU/frame | flush p50 | calls | triangles | clock | MLS passes/moving/rest/fresh |");
  out.push("|---|---|---|---|---|---|---|---|---|---|---|---|");
  builds.forEach(b=>{ const R=B[b].map(p=>p.motions&&p.motions[m]&&p.motions[m].timing).filter(Boolean); if(!R.length) return;
    const x={rounds:R.length, loopP50:med(R.map(r=>r.loop.p50)), loopP50r:rng(R.map(r=>r.loop.p50)), loopMean:med(R.map(r=>r.loop.mean)), cpu:med(R.map(r=>r.cpuMsPerFrame)), cpur:rng(R.map(r=>r.cpuMsPerFrame)),
      wait:med(R.map(r=>r.cpuWaitMsPerFrame)), gpu:med(R.map(r=>r.gpuCpuMsPerFrame)), flush:med(R.map(r=>r.flush.p50)), calls:med(R.map(r=>r.calls.p50)), tris:med(R.map(r=>r.tris.p50)),
      clock:R.map(r=>(+r.clock0).toFixed(1)+"-"+(+r.clock1).toFixed(1)).join(" "), mls:R[0].mls?[R[0].mls.passes,R[0].mls.moving,R[0].mls.rest,R[0].mls.fresh].join("/"):"(before 8C)", steps:{}, err:R.map(r=>r.err).filter(Boolean)};
    STEPK.forEach(k=>{ const v=R.map(r=>r.steps&&r.steps[k]&&r.steps[k].p50); if(v.some(y=>y!=null)) x.steps[k]={p50:med(v), range:rng(v), mean:med(R.map(r=>r.steps&&r.steps[k]&&r.steps[k].mean))}; });
    const PR=B[b].map(p=>p.motions&&p.motions[m]&&p.motions[m].profile).filter(r=>r&&r.agg);
    if(PR.length){ const cats={}; PR.forEach(r=>r.agg.cats.forEach(c=>{ (cats[c.cat]=cats[c.cat]||{ms:[],share:[]}).ms.push(c.msPerFrame); cats[c.cat].share.push(c.share); }));
      x.prof={rounds:PR.length, run:med(PR.map(r=>r.agg.runMsPerFrame)), runr:rng(PR.map(r=>r.agg.runMsPerFrame)), cats:{}};
      Object.keys(cats).forEach(c=>{ while(cats[c].ms.length<PR.length){ cats[c].ms.push(0); cats[c].share.push(0); } x.prof.cats[c]={ms:med(cats[c].ms), msr:rng(cats[c].ms), share:med(cats[c].share)}; });
      const fns={}; PR.forEach(r=>r.agg.top.forEach(t=>{ (fns[t.fn]=fns[t.fn]||[]).push(t.msPerFrame); }));
      x.prof.top=Object.entries(fns).map(([k,v])=>{ while(v.length<PR.length) v.push(0); return [k,med(v)]; }).sort((a,b)=>b[1]-a[1]).slice(0,25);
      const inc={}; PR.forEach(r=>Object.entries(r.agg.incl).forEach(([k,v])=>{ (inc[k]=inc[k]||[]).push(v); })); x.prof.incl={}; Object.keys(inc).forEach(k=>x.prof.incl[k]=med(inc[k]));
      const tb={}; PR.forEach(r=>(r.agg.threeBy||[]).forEach(t=>{ (tb[t.caller]=tb[t.caller]||[]).push(t.msPerFrame); })); x.prof.threeBy=Object.entries(tb).map(([k,v])=>[k,med(v)]).sort((a,b)=>b[1]-a[1]).slice(0,8); }
    S.builds[b].motions[m]=x;
    out.push("| "+b+" | "+x.rounds+" | "+f2(x.loopP50)+" ("+x.loopP50r+") | "+f2(x.loopMean)+" | "+f2(x.cpu)+" ("+x.cpur+") | "+f2(x.wait)+" | "+f2(x.gpu)+" | "+f2(x.flush)+" | "+x.calls+" | "+x.tris+" | "+x.clock+" | "+x.mls+" |"); });
  out.push("");
  out.push("Named steps, median of the rounds' per-frame medians (ms):\n");
  out.push("| step | "+builds.join(" | ")+" | "+builds.filter(b=>b!==REF).map(b=>b+" - "+REF).join(" | ")+" |");
  out.push("|---|"+builds.map(()=>"---").join("|")+"|"+builds.filter(b=>b!==REF).map(()=>"---").join("|")+"|");
  const rows=["loop"].concat(STEPK);
  rows.forEach(k=>{ const v=builds.map(b=>{ const x=S.builds[b].motions[m]; if(!x) return null; return k==="loop"?x.loopP50:(x.steps[k]?x.steps[k].p50:null); });
    if(v.every(y=>y==null)) return; const r=v[builds.indexOf(REF)];
    out.push("| "+k+" | "+v.map(f3).join(" | ")+" | "+builds.filter(b=>b!==REF).map(b=>{ const y=v[builds.indexOf(b)]; return y==null||r==null?"-":(y-r>=0?"+":"")+f3(y-r); }).join(" | ")+" |"); });
  out.push("");
  if(builds.some(b=>S.builds[b].motions[m]&&S.builds[b].motions[m].prof)){
    out.push("Profile (the frames' samples; ms a frame, median over rounds, and share of the profiled run):\n");
    const cats=[...new Set([].concat(...builds.map(b=>S.builds[b].motions[m]&&S.builds[b].motions[m].prof?Object.keys(S.builds[b].motions[m].prof.cats):[])))];
    const refP=S.builds[REF]&&S.builds[REF].motions[m]&&S.builds[REF].motions[m].prof;
    cats.sort((a,b)=>{ const g=c=>Math.max(...builds.map(bb=>{ const p=S.builds[bb].motions[m]&&S.builds[bb].motions[m].prof; return p&&p.cats[c]?p.cats[c].ms:0; })); return g(b)-g(a); });
    out.push("| subsystem | "+builds.map(b=>b+" ms (share)").join(" | ")+" | "+builds.filter(b=>b!==REF).map(b=>b+" - "+REF+" ms").join(" | ")+" |");
    out.push("|---|"+builds.map(()=>"---").join("|")+"|"+builds.filter(b=>b!==REF).map(()=>"---").join("|")+"|");
    out.push("| (profiled run) | "+builds.map(b=>{ const p=S.builds[b].motions[m]&&S.builds[b].motions[m].prof; return p?f2(p.run)+" ("+p.runr+")":"-"; }).join(" | ")+" | "+builds.filter(b=>b!==REF).map(b=>{ const p=S.builds[b].motions[m]&&S.builds[b].motions[m].prof; return p&&refP?(p.run-refP.run>=0?"+":"")+f2(p.run-refP.run):"-"; }).join(" | ")+" |");
    cats.forEach(c=>{ out.push("| "+c+" | "+builds.map(b=>{ const p=S.builds[b].motions[m]&&S.builds[b].motions[m].prof; const q=p&&p.cats[c]; return q?f3(q.ms)+" ("+(100*q.share).toFixed(1)+"%)":"0"; }).join(" | ")+" | "+
      builds.filter(b=>b!==REF).map(b=>{ const p=S.builds[b].motions[m]&&S.builds[b].motions[m].prof; const q=p&&p.cats[c], r=refP&&refP.cats[c]; const d=(q?q.ms:0)-(r?r.ms:0); return (d>=0?"+":"")+f3(d); }).join(" | ")+" |"); });
    out.push("");
    builds.forEach(b=>{ const p=S.builds[b].motions[m]&&S.builds[b].motions[m].prof; if(!p) return;
      out.push("Top functions by self time, "+b+": "+p.top.slice(0,14).map(t=>"`"+t[0]+"` "+f3(t[1])).join("; ")+"\n");
      out.push("three.js and GL time by the app function that called it, "+b+": "+p.threeBy.map(t=>"`"+t[0]+"` "+f3(t[1])).join("; ")+"\n"); });
  }
});
fs.writeFileSync(path.join(dir,"summary.json"),JSON.stringify(S,null,1));
console.log(out.join("\n"));
