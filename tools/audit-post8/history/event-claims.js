/* For every EVENT: the claim its dossier pill shows (EVENTS[].claim -> CLAIM[].label and CLAIM[].note, app.js dossierEvent) against the
   statement claims narrative.js gives its name, its why and its dispute (STATEMENT_CLAIMS, else unchecked). A pill "Fact" ("Attested in the
   standard accounts of the battle") beside a statement claimed "interpretation" or "uncertain" is a contradiction on one screen. */
const {load}=require('./load.js'); load();
function sc(ref){ const e=STATEMENT_CLAIMS[ref]; if(e) return e.cl; for(const k in CLAIM_BY_CLASS){ if(new RegExp(CLAIM_BY_CLASS[k].re).test(ref)) return CLAIM_BY_CLASS[k].cl+'(class)'; } return 'unchecked'; }
const rows=[];
EVENTS.forEach(e=>{
  const n=sc('EVENTS[#'+e.id+'].n'), w=sc('EVENTS[#'+e.id+'].why'), d=e.dispute?sc('EVENTS[#'+e.id+'].dispute'):'-';
  const flag=[];
  if(e.claim==='fact' && [n,w].some(x=>/interpretation|uncertain/.test(x))) flag.push('PILL fact vs statement '+[n,w].join('/'));
  if(e.claim==='est' && [n,w].some(x=>/interpretation|uncertain/.test(x))) flag.push('PILL est vs statement '+[n,w].join('/'));
  if(e.claim!=='disputed' && d!=='-') flag.push('has dispute but pill '+e.claim);
  if(e.claim==='disputed' && !e.dispute) flag.push('pill disputed without a dispute text');
  rows.push([e.id, Array.isArray(e.t)?e.t.map(fmtClock).join('-'):fmtClock(e.t), 'pill:'+e.claim, 'timing:'+e.cf, 'n:'+n, 'why:'+w, 'dispute:'+d, flag.join('; ')].join(' | '));
});
console.log('event | t | pill claim | timing grade | name claim | why claim | dispute claim | flags');
rows.forEach(r=>console.log(r));
