/* Final audit after Stage 8, verification 'v-repro-his': an independent loader (written for this verification, not the history
   area's load.js). It follows sim-test.js's own loading order: the world module, data.js, analysis.js, narrative.js, then the helpers
   tools/mk-helpers.js generates from app.js; any further app.js function is taken from the live app.js by its declaration name.
   Run against an ISOLATED copy (ISO=<copy>; default the verifier's own copy) in which tools/mk-world-mod.js and tools/mk-helpers.js were run.
   Read-only: nothing is written anywhere. */
const fs=require('fs'), path=require('path');
const ISO=process.env.ISO||'/tmp/claude-0/-home-user-Austerlitz/cb561984-b1ad-5d5a-82ba-de46bf4c820e/scratchpad/v-repro-his-iso';
const APP=fs.readFileSync(path.join(ISO,'app.js'),'utf8');
/* a top-level function's source by name: brace matching that skips strings and comments */
function fnSrc(name){
  const i=APP.indexOf('\nfunction '+name+'(');
  if(i<0) throw new Error('no function '+name);
  let d=0, seen=false;
  for(let k=i+1;k<APP.length;k++){
    const c=APP[k], n=APP[k+1];
    if(c==='/'&&n==='/'){ k=APP.indexOf('\n',k); continue; }
    if(c==='/'&&n==='*'){ k=APP.indexOf('*/',k+2)+1; continue; }
    if(c==='"'||c==="'"){ for(k++;k<APP.length&&APP[k]!==c;k++) if(APP[k]==='\\') k++; continue; }
    if(c==='{'){ d++; seen=true; } else if(c==='}'){ d--; if(seen&&d===0) return APP.slice(i+1,k+1); }
  }
  throw new Error('unterminated '+name);
}
function load(){
  const M=require(path.join(ISO,'_world_mod.js'));
  global.W=M.W; global.height=M.height; global.hAt=M.hAt; global.smoothstep=M.smoothstep;
  global.covAt=M.covAt; global.SATS=M.SATS; global.MENI=M.MENI; global.VILLAGES=M.VILLAGES;
  M.buildCover(); M.buildGrid();
  Object.defineProperty(global,'covWater',{get:()=>M.covWater,configurable:true});
  Object.defineProperty(global,'covRoad',{get:()=>M.covRoad,configurable:true});
  Object.defineProperty(global,'covMarsh',{get:()=>M.covMarsh,configurable:true});
  const ev=f=>(0,eval)(fs.readFileSync(path.join(ISO,f),'utf8'));
  ev('geo.js'); ev('data.js'); ev('analysis.js'); ev('narrative.js');
  ev('_clock.js');
  global.units={}; Object.keys(FORMATIONS).forEach(id=>{ if(FORMATIONS[id].track) units[id]={}; });
  global.clock=T_MIN;
  ev('_derived.js'); ev('_events.js'); ev('_state.js');
  /* presentation helpers the card and dossier use (app.js), by name */
  ['waitingFor','textPhase'].forEach(n=>{ try{ (0,eval)(fnSrc(n)); }catch(e){ console.error('not loaded: '+n+' '+e.message); } });
  return M;
}
module.exports={load,ISO,fnSrc,APP};
