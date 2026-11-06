/* The final audits' Stage 3 (WP-05, WP-06): runtime-test.js's prelude and its WP-05/06 block alone, the rest of the suite skipped (about 3 minutes
   against the suite's 6). Run from a repository root whose bundle.js is built: node tools/final-stage3/rt-block.js. Used by mutate.js on its
   copies; the suite itself (npm test) runs the block in place */
require=require('module').createRequire(process.cwd()+'/runtime-test.js');
const fs=require('fs'); let src=fs.readFileSync('runtime-test.js','utf8');
const pre=src.split('/* ---- drive the whole application')[0];
const a=src.indexOf('  /* the final audits\' Stage 3'), b=src.indexOf('}catch(e){ errs.push("DRIVE: "');
const block=src.slice(a,b);
eval(pre+'\ntry{\n'+block+'\n}catch(e){ errs.push("DRIVE: "+e.message+"\\n"+e.stack); }\nconsole.warn=origWarn; console.log("errors:",errs.length); errs.forEach(e=>console.log("  E "+e));');
