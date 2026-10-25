#!/usr/bin/env node
/* Stage 8, implementation PR 8C: the tables of docs/STAGE8_SPEC.md section 15.6, from two label-motion.js --app runs (the build before 8C and
   8C), printed as Markdown. node tools/stage8/tables-8c.js before.json after.json   Measurement code only. */
"use strict";
const fs=require("fs");
const [A,B]=process.argv.slice(2).map(f=>JSON.parse(fs.readFileSync(f,"utf8")));
const key=r=>r.id, by=R=>{ const o={}; R.runs.forEach(r=>o[key(r)]=r); return o; }, a=by(A), b=by(B);
const n=x=>x==null?"-":Number(x).toLocaleString("en-GB"), pc=x=>x==null?"-":(100*x).toFixed(0)+"%";
const base=A.runs.filter(r=>!r.select&&!r.real&&!r.reading&&!r.touch).map(r=>r.id);
const out=[];
out.push("| motion | jumps | pops | level-of-detail switches | flickers | formations drawn while in view | longest hidden by the layout | back after room (most) |");
out.push("|---|---|---|---|---|---|---|---|");
const row=(id,label)=>{ const p=a[id], q=b[id]; if(!p||!q) return;
  out.push("| `"+(label||id)+"` | "+n(p.jumps)+" / "+n(q.jumps)+" | "+n(p.pops)+" / "+n(q.pops)+" | "+n(p.lod)+" / "+n(q.lod)+" | "+n(p.flicker)+" / "+n(q.flicker)+" | "+
    pc(p.track.all.visible)+" / "+pc(q.track.all.visible)+" | "+n(p.track.all.longestMs)+" / "+n(q.track.all.longestMs)+" ms | "+n(p.track.all.lagMaxMs)+" / "+n(q.track.all.lagMaxMs)+" ms |"); };
base.forEach(id=>row(id));
const S=(R,ids,k)=>ids.reduce((s,id)=>s+R[id][k],0);
out.push("| **the 16** | **"+n(S(a,base,"jumps"))+" / "+n(S(b,base,"jumps"))+"** | **"+n(S(a,base,"pops"))+" / "+n(S(b,base,"pops"))+"** | **"+n(S(a,base,"lod"))+" / "+n(S(b,base,"lod"))+"** | **"+
  n(S(a,base,"flicker"))+" / "+n(S(b,base,"flicker"))+"** | | | |");
out.push("");
out.push("| run (8B / 8C) | jumps | pops | level-of-detail switches | flickers | formations drawn while in view | never-dropped hidden | drawn though not known |");
out.push("|---|---|---|---|---|---|---|---|");
A.runs.filter(r=>r.select||r.real||r.reading||r.touch).forEach(p=>{ const q=b[p.id]; if(!q) return;
  out.push("| `"+p.id+"` | "+n(p.jumps)+" / "+n(q.jumps)+" | "+n(p.pops)+" / "+n(q.pops)+" | "+n(p.lod)+" / "+n(q.lod)+" | "+n(p.flicker)+" / "+n(q.flicker)+" | "+pc(p.track.all.visible)+" / "+pc(q.track.all.visible)+" | "+
    n(p.keepHidden)+" / "+n(q.keepHidden)+" | "+n(p.unknownDrawn)+" / "+n(q.unknownDrawn)+" |"); });
out.push("");
/* the formations followed, over the 16: frames in view by what became of them */
const T=(R,ids)=>{ const t={on:0,terrain:0,placement:0,offscreen:0,lod:0,episodes:0,jumps:0,sides:0,swaps:0,lagSum:0,lagN:0,longest:0,lagMax:0};
  ids.forEach(id=>{ const x=R[id].track.all; Object.keys(t).forEach(k=>{ if(k==="longest") t.longest=Math.max(t.longest,x.longestMs); else if(k==="lagMax") t.lagMax=Math.max(t.lagMax,x.lagMaxMs); else t[k]+=x[k]||0; }); });
  const iv=t.on+t.terrain+t.placement; t.visible=iv?t.on/iv:null; t.lagMean=t.lagN?Math.round(t.lagSum/t.lagN*1000/30):0; return t; };
const ta=T(a,base), tb=T(b,base);
out.push("| over the 16 motions (8B / 8C) | |");
out.push("|---|---|");
out.push("| formation-frames in view (drawn, behind the ground, or hidden by the layout) | "+n(ta.on+ta.terrain+ta.placement)+" / "+n(tb.on+tb.terrain+tb.placement)+" |");
out.push("| of them drawn | "+n(ta.on)+" ("+pc(ta.visible)+") / "+n(tb.on)+" ("+pc(tb.visible)+") |");
out.push("| hidden by the layout (no room, or held by 8C until a re-placement pass) | "+n(ta.placement)+" / "+n(tb.placement)+" |");
out.push("| behind the ground | "+n(ta.terrain)+" / "+n(tb.terrain)+" |");
out.push("| off the screen or under a panel (not counted against visibility) | "+n(ta.offscreen)+" / "+n(tb.offscreen)+" |");
out.push("| out of the layer by its level of detail | "+n(ta.lod)+" / "+n(tb.lod)+" |");
out.push("| times a formation was hidden by the layout | "+n(ta.episodes)+" / "+n(tb.episodes)+" |");
out.push("| longest such disappearance | "+n(ta.longest)+" / "+n(tb.longest)+" ms |");
out.push("| back after the layout had room for it again: mean, most | "+n(ta.lagMean)+", "+n(ta.lagMax)+" / "+n(tb.lagMean)+", "+n(tb.lagMax)+" ms |");
out.push("| a drawn formation's box moving against its anchor (jumps) | "+n(ta.jumps)+" / "+n(tb.jumps)+" |");
out.push("| its box changing side of its anchor | "+n(ta.sides)+" / "+n(tb.sides)+" |");
out.push("| two neighbouring formations' boxes swapping order (identity) | "+n(ta.swaps)+" / "+n(tb.swaps)+" |");
out.push("");
/* each formation followed */
const ids=Object.keys(b[base[0]].track.by||{});
out.push("| formation (8B / 8C, over the 16) | drawn while in view | longest hidden by the layout | jumps | swaps |");
out.push("|---|---|---|---|---|");
ids.forEach(f=>{ const g=(R)=>{ let on=0,iv=0,lg=0,j=0,sw=0; base.forEach(id=>{ const x=(R[id].track.by||{})[f]; if(!x) return; on+=x.on; iv+=x.on+x.terrain+x.placement; lg=Math.max(lg,x.longestMs); j+=x.jumps; sw+=x.swaps; });
    return {v:iv?on/iv:null,lg,j,sw}; }; const p=g(a), q=g(b);
  out.push("| "+f+" | "+pc(p.v)+" / "+pc(q.v)+" | "+n(p.lg)+" / "+n(q.lg)+" ms | "+n(p.j)+" / "+n(q.j)+" | "+n(p.sw)+" / "+n(q.sw)+" |"); });
console.log(out.join("\n"));
