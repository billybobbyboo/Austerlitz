/* The Now tab's timeline lines (PHASES[].events) against their phase's clock and against the EVENTS of the same subject: a line timed
   outside its phase's window, an event whose start falls in a phase whose lines do not carry it, and an event and a line on one subject
   with different hours. Read-only. */
const {load}=require('./load.js'); load();
function parseLab(s){ let m; if((m=/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/.exec(s))) return [+m[1]*60+ +m[2], +m[3]*60+ +m[4]];
  if((m=/(\d{1,2}):(\d{2})/.exec(s))) return [+m[1]*60+ +m[2], +m[1]*60+ +m[2]]; return null; }
const out=[];
PHASES.forEach(P=>{ P.events.forEach((e,i)=>{ const w=parseLab(e[0]); const inside=w?(w[0]>=P.t0&&w[0]<=P.t1):null;
  out.push(`ph${P.id} [${fmtClock(P.t0)}-${fmtClock(P.t1)}] line ${i} "${e[0]}"${w?(inside?'':'  <-- OUTSIDE the phase window'):' (no clock)'}: ${e[1].slice(0,110)}`); }); });
console.log('== timeline lines and their phases =='); out.forEach(x=>console.log(x));
console.log('\n== events: start, the phase it falls in, and that phase\'s lines with the same start ==');
EVENTS.forEach(e=>{ const w=evWindow(e); const ph=phaseAt(w[0]); const P=PHASES[ph]; const same=P.events.filter(l=>{ const lw=parseLab(l[0]); return lw&&lw[0]===w[0]; });
  const allLines=[].concat(...PHASES.map(Q=>Q.events.map(l=>({ph:Q.id,l}))));
  console.log(`${e.id.padEnd(16)} ${fmtClock(w[0])}${w[1]!==w[0]?'-'+fmtClock(w[1]):''} in ph${ph} (${P.clock})  lines at that start: ${same.length?same.map(l=>'"'+l[0]+'"').join(', '):'NONE'}`); });
