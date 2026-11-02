/* Every anchor's grade: declared on the anchor, or carried forward from an earlier entry (stateAt takes the last cf). An inherited A
   ("Position documented in the sources", POS_CLAIM "Position: documented") on an anchor that moved and states no act of its own is listed:
   the grade then rests on another place's evidence. Also: the statement claims of each anchor's act (narrative.js) beside its grade. */
const {load}=require('./load.js'); load({state:true});
const rows=[], inh=[]; let nA=0,nInhA=0,nInh=0;
function sc(ref){ const e=STATEMENT_CLAIMS[ref]; return e?e.cl:'unchecked'; }
Object.keys(FORMATIONS).forEach(id=>{ const f=FORMATIONS[id]; if(!f.track) return; const A=anchorList(id);
  A.forEach((b,i)=>{ if(b.p===null) return; const e=f.track[b.ph]; const s=stateAt(id,b.ph); const declared=('cf' in e);
    let from=null; if(!declared){ for(let k=b.ph-1;k>=0;k--){ if(f.track[k]&&f.track[k].cf){ from=k; break; } } }
    const moved=i>0&&A[i-1].p&&(Math.hypot(b.p[0]-A[i-1].p[0],b.p[1]-A[i-1].p[1])*KM_PER_MAP);
    if(s.cf==='A') nA++; if(!declared){ nInh++; if(s.cf==='A') nInhA++; }
    const act=e.act?('act claim '+sc('FORMATIONS.'+id+'.track["'+b.ph+'"].act')):'no act';
    rows.push(`${id}@${b.ph} ${s.cf}${declared?'':' (inherited from @'+from+')'} moved ${moved?moved.toFixed(2)+' km':'-'} st ${e.st||'(carried)'}; ${act}`);
    if(!declared&&s.cf==='A') inh.push(`${id}@${b.ph} [${b.p}] A inherited from @${from}, moved ${moved?moved.toFixed(2):'-'} km, status ${s.st}, ${e.act?'act: '+e.act.slice(0,90):'no act of its own'}`); }); });
console.log(`anchors with a position: ${rows.length}; graded A: ${nA}; grade carried forward (not declared): ${nInh}, of which A: ${nInhA}`);
console.log('\n== anchors whose A is carried forward from an earlier entry =='); inh.forEach(x=>console.log(x));
console.log('\n== all anchors =='); rows.forEach(x=>console.log(x));
