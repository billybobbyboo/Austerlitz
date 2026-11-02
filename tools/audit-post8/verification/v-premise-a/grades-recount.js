// v-premise-a: independent recount of position grades (own vs carried) from data.js alone.
// Usage: node grades-recount.js [repoRoot]. Reads geo.js and data.js in a vm context; no app code.
const fs=require('fs'), vm=require('vm'), path=require('path');
const R=process.argv[2]||'/home/user/Austerlitz';
const ctx={console}; vm.createContext(ctx);
for(const f of ['geo.js','data.js']) vm.runInContext(fs.readFileSync(path.join(R,f),'utf8')+'\n;this.FORMATIONS=typeof FORMATIONS!=="undefined"?FORMATIONS:this.FORMATIONS;this.GEOREF=typeof GEOREF!=="undefined"?GEOREF:this.GEOREF;',ctx,{filename:f});
const F=ctx.FORMATIONS, K=ctx.GEOREF.KM_PER_MAP;
let pos=0,A=0,carried=0,carriedA=0; const rows=[];
for(const id of Object.keys(F)){ const tr=F[id].track; if(!tr) continue;
  let cf=null, prev=null, lastOwn=null;
  for(const ph of Object.keys(tr).map(Number).sort((a,b)=>a-b)){ const e=tr[ph];
    const own=('cf' in e); if(own){ cf=e.cf; }
    if(!('p' in e)||e.p===null) continue;
    pos++; const g=cf||'B(default)'; if(g==='A') A++;
    if(!own){ carried++; if(g==='A'){ carriedA++; const d=prev?Math.hypot(e.p[0]-prev[0],e.p[1]-prev[1])*K:0, d0=lastOwn?Math.hypot(e.p[0]-lastOwn[0],e.p[1]-lastOwn[1])*K:0;
        rows.push(`${id}@${ph} A carried; ${d.toFixed(2)} km from previous anchor, ${d0.toFixed(2)} km from the last anchor graded A itself; act:${e.act?'yes':'no'}`);} }
    else lastOwn=e.p;
    prev=e.p; } }
console.log(`positioned anchors ${pos}; graded A (own or carried) ${A}; grades carried ${carried}; carried A ${carriedA}`);
rows.forEach(r=>console.log(r));
