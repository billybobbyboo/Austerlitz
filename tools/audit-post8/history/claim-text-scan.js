/* Statement claims against the statement's own words (tools/step4/statements.js, run on the isolated copy): a statement claimed "fact"
   (CLAIM_WORDS: "A source read here says what the statement says") whose text says part of it is this map's, inferred, or not established;
   and the counts of claims by class. Read-only. */
const path=require('path');
const {load,ISO}=require('./load.js'); load();
const {statements}=require(path.join(ISO,'tools','step4','statements.js'));
const S=statements(ISO);
const by={}, flags=[];
S.forEach(s=>{ const e=STATEMENT_CLAIMS[s.ref]; let cl=e?e.cl:null; if(!cl){ for(const k in CLAIM_BY_CLASS){ if(new RegExp(CLAIM_BY_CLASS[k].re).test(s.ref)){ cl=CLAIM_BY_CLASS[k].cl+'*'; break; } } } cl=cl||'unchecked';
  by[s.cls]=by[s.cls]||{}; by[s.cls][cl]=(by[s.cls][cl]||0)+1;
  if(/^fact/.test(cl) && /this map'?s|inferred|an inference|not established|no source read|no account read|is not recorded/i.test(s.text)) flags.push(`${s.ref} claimed ${cl}: "${(s.text.match(/[^.;]*(this map'?s|inferred|an inference|not established|no source read|no account read|is not recorded)[^.;]*/i)||[''])[0].trim().slice(0,160)}"`); });
console.log('statements: '+S.length);
Object.keys(by).forEach(c=>console.log('  '+c.padEnd(16)+JSON.stringify(by[c])));
console.log('\n"fact" claims whose own words reserve part of the statement as this map\'s or not established: '+flags.length); flags.forEach(f=>console.log('  '+f));
