/* The four named conflicts (tools/stage2/chronology.js CONFLICTS: bag@6, guard_cav@6, kamensky@3, kamensky@4): for each, the leg the map
   draws (window, from-to), the event and the phase line that give the other hour, and whether each surface a visitor reads names the dispute. */
const {load}=require('./load.js'); load({state:true});
const out=[];
function legOf(id,ph){ const A=anchorList(id); const i=A.findIndex(a=>a.ph===ph); const b=A[i], a=A[i-1]; return {a,b}; }
[['bag',6,'blasowitz'],['guard_cav',6,'guard-broken'],['kamensky',3,'kamensky'],['kamensky',4,'kamensky']].forEach(([id,ph,ev])=>{
  const {a,b}=legOf(id,ph); const e=EVENTS.find(x=>x.id===ev); const tr=FORMATIONS[id].track[ph];
  out.push(`${id}@${ph}: drawn leg ${a.ph}->${b.ph} ${fmtClock(b.w[0])}-${fmtClock(b.w[1])} from [${a.p}] to [${b.p}]; arrival ${b.arrDerived?'derived ('+b.arrRule+')':'the phase start'}${b.tm?'; timing grade '+b.tm.gr+' ('+b.tm.basis+')':'; no timing row (no tm)'}`);
  out.push(`   act: ${tr.act||'(none)'}`);
  out.push(`   act claim: ${(STATEMENT_CLAIMS['FORMATIONS.'+id+'.track["'+ph+'"].act']||{cl:'unchecked'}).cl}; position grade ${stateAt(id,ph).cf}`);
  out.push(`   event "${e.n}" ${Array.isArray(e.t)?e.t.map(fmtClock).join('-'):fmtClock(e.t)}, claim ${e.claim}${e.dispute?' (dispute: '+e.dispute.slice(0,160)+'...)':''}`);
  const lines=[].concat(...PHASES.map(P=>P.events.map(l=>({ph:P.id,l})))).filter(x=>new RegExp(id==='bag'?'Bagration|Blasowitz':id==='guard_cav'?'Rapp':'Kamensky').test(x.l[1]));
  lines.forEach(x=>out.push(`   phase ${x.ph} line "${x.l[0]}": ${x.l[1].slice(0,140)}`)); });
/* kamensky's drawn reversal against the French climb */
clock=480; const k0=posNow('kamensky'); clock=524; const k1=posNow('kamensky');
out.push(`kamensky drawn 08:00 [${k0}] -> 08:44 [${k1.map(x=>x.toFixed(1))}] (north-east, back toward the Pratzeberg) while Saint-Hilaire waits at [206,231] until 08:45; it enters the plateau outline at 08:29 (plateauStrength Allied 19,300 -> 23,550).`);
console.log(out.join('\n'));
