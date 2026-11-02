/* COMMAND rows: the source label the Command tab prints (SRC_LABEL: doc DOCUMENTED, inf THIS MAP'S READING, anec ANECDOTE) against the row's
   statement claim in narrative.js (STATEMENT_CLAIMS["COMMAND.<side>[\"<ph>\"][<i>]"]). A DOCUMENTED row whose claim is interpretation or
   uncertain, or a row whose text says "this map's"/"inferred" while labelled DOCUMENTED, is flagged. */
const {load}=require('./load.js'); load();
const out=[];
['fr','al'].forEach(side=>Object.keys(COMMAND[side]).forEach(ph=>COMMAND[side][ph].forEach((r,i)=>{
  const ref='COMMAND.'+side+'["'+ph+'"]['+i+']';
  const c=STATEMENT_CLAIMS[ref]; const cl=c?c.cl:'unchecked';
  const txt=r[2]; const flags=[];
  if(r[1]==='doc' && /interpretation|uncertain/.test(cl)) flags.push('DOCUMENTED vs claim '+cl);
  if(r[1]==='doc' && /this map'?s|inferred|inference|not established|no source read|no account read/i.test(txt)) flags.push('DOCUMENTED row text says: '+(txt.match(/this map'?s[^.;]*|inferred[^.;]*|inference[^.;]*|not established[^.;]*|no source read[^.;]*|no account read[^.;]*/i)||[''])[0]);
  if(r[1]==='inf' && cl==='fact') flags.push('THIS MAP\'S READING vs claim fact');
  out.push([ref, r[0], r[1], cl, flags.join('; '), txt.slice(0,160)].join(' | '));
})));
console.log('ref | kind | src label | statement claim | flags | text');
out.forEach(x=>console.log(x));
