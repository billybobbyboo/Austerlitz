/* Final audit after Stage 8, area "history": a loader for the historical dataset and the app's clock, derived and state helpers.
   Run against an ISOLATED copy of the repository (never the live tree): set ISO=<path of the copy> (default: the audit's history-iso
   scratch copy). The copy must have had `node tools/mk-world-mod.js` and `node tools/mk-helpers.js` run in it.
   The loading follows sim-test.js and runtime-test.js: world module first, then data.js, analysis.js, narrative.js, appearance.js, then
   the generated helpers, all evaluated in the global scope. Nothing is written anywhere. */
const fs=require('fs'), path=require('path');
const ISO=process.env.ISO||'/tmp/claude-0/-home-user-Austerlitz/cb561984-b1ad-5d5a-82ba-de46bf4c820e/scratchpad/history-iso';
function load(opts){
  opts=opts||{};
  const M=require(path.join(ISO,'_world_mod.js'));
  global.W=M.W; global.height=M.height; global.hAt=M.hAt; global.smoothstep=M.smoothstep;
  global.covAt=M.covAt; global.SATS=M.SATS; global.MENI=M.MENI; global.VILLAGES=M.VILLAGES;
  M.buildCover(); M.buildGrid();
  Object.defineProperty(global,'covWater',{get:()=>M.covWater,configurable:true});
  Object.defineProperty(global,'covRoad',{get:()=>M.covRoad,configurable:true});
  Object.defineProperty(global,'covMarsh',{get:()=>M.covMarsh,configurable:true});
  const ev=f=>(0,eval)(fs.readFileSync(path.join(ISO,f),'utf8'));
  ev('geo.js'); ev('data.js'); ev('analysis.js'); ev('narrative.js'); ev('appearance.js');
  global.leavesOf=function(id,out){out=out||[];const f=FORMATIONS[id];if(f.track)out.push(id);
    if(f.children)f.children.forEach(k=>leavesOf(k,out));return out;};
  ev('_clock.js');
  global.units={}; Object.keys(FORMATIONS).forEach(id=>{ if(FORMATIONS[id].track) units[id]={}; });
  global.clock=T_MIN;
  ev('_derived.js'); ev('_events.js');
  if(opts.state){ try{ ev('_state.js'); }catch(e){ console.error('state helpers not loaded: '+e.message); } }
  return M;
}
module.exports={load,ISO};
