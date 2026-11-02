/* audit-post8 (state): load the built bundle in runtime-test.js's own stubbed THREE + DOM environment (its prelude, read from the
   runtime-test.js of the isolated copy, verbatim but for its two result arrays made reachable), so that a script can drive the app's own
   functions (setClock, tickClock, dwellAdvance, togglePlay, select, ...). Read-only on the repository: it runs in an isolated copy.
   Usage (from another script):  const L=require('<this file>'); L.load(ISO)  -> returns nothing; the app's globals are then defined in the
   CALLER's scope only if the caller evals L.prelude(ISO) itself (direct eval keeps the bundle's declarations in the caller's scope). */
const fs=require('fs');
exports.prelude=function(ISO){
  let pre=fs.readFileSync(ISO+'/runtime-test.js','utf8').split('/* ---- drive the whole application')[0];
  if(!/const warns=\[\], errs=\[\];/.test(pre)) throw new Error('runtime-test.js prelude changed: cannot find its result arrays');
  pre=pre.replace('const warns=[], errs=[];','var warns=[], errs=[];');
  return pre;
};
