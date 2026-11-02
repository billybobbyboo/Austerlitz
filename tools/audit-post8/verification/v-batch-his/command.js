/* v-batch-his: COMMAND rows' source label (SRC_LABEL) against the statement's claim (narrative.js STATEMENT_CLAIMS / CLAIM_BY_CLASS, the
   same lookup as app.js stmtClaim). Read-only; evaluates analysis.js and narrative.js from the live tree. */
const fs=require('fs'); const R='/home/user/Austerlitz/';
(0,eval)(fs.readFileSync(R+'analysis.js','utf8').replace(/^var /mg,'global.__x=1;var ')); // plain eval in global scope
(0,eval)(fs.readFileSync(R+'narrative.js','utf8'));
function claim(ref){ if(Object.prototype.hasOwnProperty.call(STATEMENT_CLAIMS,ref)) return STATEMENT_CLAIMS[ref].cl;
  for(const k of Object.keys(CLAIM_BY_CLASS)) if(new RegExp(CLAIM_BY_CLASS[k].re).test(ref)) return CLAIM_BY_CLASS[k].cl; return 'unchecked'; }
const tally={}; let docN=0, docUn=0;
['fr','al'].forEach(s=>Object.keys(COMMAND[s]).forEach(ph=>COMMAND[s][ph].forEach((r,i)=>{ const ref='COMMAND.'+s+'["'+ph+'"]['+i+']', c=claim(ref);
  const k=r[1]+'/'+c; tally[k]=(tally[k]||0)+1; if(r[1]==='doc'){ docN++; if(c==='unchecked') docUn++; } })));
console.log('rows by source kind / claim:',JSON.stringify(tally));
console.log('DOCUMENTED rows',docN,'of which unchecked',docUn);
console.log('al@5[0]:',JSON.stringify(COMMAND.al["5"]), '| al@4[0] kind:',COMMAND.al["4"][0][0]);
