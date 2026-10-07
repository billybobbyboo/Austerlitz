/* The suites' generated inputs, kept fresh (roadmap step 1, docs/FINAL_AUDIT.md T-9: until step 1 only geo-test.js regenerated what it
   read, so a suite run on its own outside tools/run-all.sh could test a stale copy of the code).
   regen(...which): every suite that reads a generated module regenerates it first from the live sources, as tools/run-all.sh does:
     "world"   _world_mod.js from world.js (tools/mk-world-mod.js);
     "helpers" _clock.js, _derived.js, _events.js, _state.js, _ov.js from app.js (tools/mk-helpers.js).
   A generator that fails (a declaration not found) throws, with its own message on stderr, and the suite stops with a non-zero exit.
   bundleStale(): runtime-test.js reads bundle.js, which only build.py writes (with the committed austerlitz-command-map.html, so a suite
   does not rebuild it); null when bundle.js is exactly the join of the sources build.py names, else the reason it is not. */
const cp=require("child_process"), fs=require("fs"), path=require("path");
const ROOT=path.join(__dirname,"..");
const GEN={world:"mk-world-mod.js", helpers:"mk-helpers.js"};
function regen(...which){
  which.forEach(k=>{
    if(!GEN[k]) throw new Error("tools/fresh.js: no generator named "+k);
    cp.execFileSync(process.execPath,[path.join(__dirname,GEN[k])],{cwd:ROOT,stdio:["ignore","ignore","inherit"]});
  });
}
function bundleStale(){
  /* build.py's file list, read where H-8's tools/lang-scan.js reads it: one literal list after "for f in" */
  const bp=fs.readFileSync(path.join(ROOT,"build.py"),"utf8"), m=/for f in (\[[^\]]+\])/.exec(bp);
  if(!m) return "build.py's list of the bundle's sources (for f in [...]) cannot be read";
  let files; try{ files=JSON.parse(m[1].replace(/'/g,'"')); }catch(e){ return "build.py's list of the bundle's sources does not parse: "+m[1]; }
  const bundle=path.join(ROOT,"bundle.js");
  if(!fs.existsSync(bundle)) return "bundle.js is missing: run npm run build (python3 build.py)";
  /* build.py reads each source in text mode (universal newlines) and joins them with "\n" */
  const want=files.map(f=>fs.readFileSync(path.join(ROOT,f),"utf8").replace(/\r\n?/g,"\n")).join("\n");
  if(fs.readFileSync(bundle,"utf8")!==want) return "bundle.js is stale: it is not the join of "+files.join(", ")+" (run npm run build)";
  return null;
}
module.exports={regen, bundleStale};
