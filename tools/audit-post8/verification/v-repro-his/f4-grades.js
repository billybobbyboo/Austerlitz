/* v-repro-his, history #4: every positioned anchor's grade, declared on its own track entry or carried from an earlier one (data.js's own
   convention, "values carry forward until changed"; stateAt), counted; for each carried A: the anchor the A was declared on, the distance
   from it, whether the anchor has an act of its own and that act's claim (narrative.js), and what a visitor is shown while the formation
   stands at it or moves into it: the pill's key (app.js posClaimOf: CLAIM_FROM_CONF of confAt's grade, "interp" for an A between anchors) per
   minute of the day. Suchet's anchors are listed beside them.   node f4-grades.js  (ISO=<isolated copy>) */
const {load}=require('./load.js'); load();
const km=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])*KM_PER_MAP;
const claimOfRef=ref=>{ if(STATEMENT_CLAIMS[ref]) return STATEMENT_CLAIMS[ref].cl; for(const k in CLAIM_BY_CLASS) if(new RegExp(CLAIM_BY_CLASS[k].re).test(ref)) return CLAIM_BY_CLASS[k].cl+'(class)'; return 'unchecked'; };
let pos=0, A=0, carried=0, carriedA=0, declaredA=0, defaultB=0; const list=[];
Object.keys(FORMATIONS).forEach(id=>{ const f=FORMATIONS[id]; if(!f.track) return;
  const keys=Object.keys(f.track).map(Number).sort((a,b)=>a-b);
  let lastCf=null, lastCfPh=null, lastCfP=null, prevP=null;
  keys.forEach(ph=>{ const e=f.track[ph];
    if(e.cf){ lastCf=e.cf; lastCfPh=ph; lastCfP=('p' in e)?e.p:lastCfP; }
    if(!('p' in e)||e.p===null) return;
    const leg=prevP?km(e.p,prevP):null; prevP=e.p;
    pos++; const g=e.cf||lastCf||'B'; if(g==='A') A++;
    if(!e.cf){ carried++; if(!lastCf) defaultB++; if(g==='A'){ carriedA++;
        list.push({id,ph,p:e.p,from:lastCfPh,d:lastCfP?km(e.p,lastCfP):null,leg,act:!!e.act,actClaim:e.act?claimOfRef(`FORMATIONS.${id}.track["${ph}"].act`):'-',st:e.st||'(carried)'}); } }
    else if(e.cf==='A') declaredA++;
    if(e.cf) lastCfP=e.p; });
});
console.log(`positioned anchors ${pos}; graded A ${A} (declared ${declaredA}, carried ${carriedA}); grades carried forward ${carried} (of which ${defaultB} the default B with no grade declared before)`);
/* what the pill says, per minute, for the formations with carried A anchors: minutes "documented" (A, not interpolated) and "interpolated" (A between anchors) */
function pillMinutes(id){ let doc=0, interp=0, docCarried=0; const f=FORMATIONS[id];
  for(let t=T_MIN;t<=T_MAX;t++){ clock=t; if(goneAt(id,t)||notYetAt(id,t)) continue; const c=confAt(id,t); if(c.cf!=='A') continue;
    if(c.interp) interp++; else { doc++; const L=legAt(id,t); const at=(L&&L.b&&L.u>=1)?L.b:L&&L.a; if(at&&!f.track[at.ph].cf) docCarried++; } }
  return {doc,interp,docCarried}; }
const byId={}; list.forEach(r=>(byId[r.id]=byId[r.id]||[]).push(r));
Object.keys(byId).forEach(id=>{ const m=pillMinutes(id);
  console.log(`${id}: carried A at `+byId[id].map(r=>`@${r.ph} (from @${r.from}, ${r.d==null?'?':r.d.toFixed(2)+' km'} from it, leg ${r.leg==null?'-':r.leg.toFixed(2)}, act ${r.act?r.actClaim:'none'}, st ${r.st})`).join('; ')+
    ` | minutes with grade A on the day: shown "documented" ${m.doc} (${m.docCarried} of them at a carried-A anchor), "interpolated" ${m.interp}`); });
console.log('suchet anchors: '+Object.keys(FORMATIONS.suchet.track).map(ph=>{ const e=FORMATIONS.suchet.track[ph]; return '@'+ph+(e.p?'['+e.p+']':'')+' cf '+(e.cf||'(carried)'); }).join('; '));
const big=list.filter(r=>r.d!==null&&r.d>=1); console.log(`carried A anchors 1 km or more from the anchor that declared the A: ${big.length}; with no act of their own: ${list.filter(r=>!r.act).length} of ${list.length}`);
