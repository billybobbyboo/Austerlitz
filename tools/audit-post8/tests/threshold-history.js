#!/usr/bin/env node
/* Final audit after Stage 8, area "tests": the history of the harness's limits (tools/visual/thresholds.js) and of the other
   numeric limits the checks hold (boot-check.js CTX_DELETES), commit by commit, each change classified as tightened or loosened.
   Read-only on the repository: it runs `git log` and `git show` and writes only to the output paths given.
   usage: node tools/audit-post8/tests/threshold-history.js <out.json> <out.md> [scratch-dir]
   Every revision of tools/visual/thresholds.js is evaluated on its own (it requires nothing) and its non-function exports are
   flattened to key paths; consecutive revisions are compared path by path. The direction of a change is known for the limit
   families below (a larger drop limit, share, ceiling or budget is looser; a smaller unobstructed baseline, pixel density or cut is
   looser); any other path is reported as "changed". */
const cp=require("child_process"), fs=require("fs"), path=require("path"), os=require("os");
const ROOT=path.resolve(__dirname,"..","..","..");
const [OUTJ,OUTM,SCR]=process.argv.slice(2);
if(!OUTJ||!OUTM){ console.error("usage: threshold-history.js <out.json> <out.md> [scratch-dir]"); process.exit(2); }
const scratch=SCR||fs.mkdtempSync(path.join(os.tmpdir(),"thr-"));
fs.mkdirSync(scratch,{recursive:true});
/* HISTORY_GIT_DIR: a full clone to read the history from (the working clone is shallow: its boundary commits hide their parents) */
const GITDIR=process.env.HISTORY_GIT_DIR||null;
const git=(args)=>cp.execFileSync("git",GITDIR?["--git-dir",GITDIR].concat(args):args,{cwd:ROOT,encoding:"utf8",maxBuffer:1<<28});

/* every non-merge commit reachable from HEAD that touched the file (full history: the PR branches' own commits too), oldest first;
   each compared with its own parent's version, so a change is attributed to the commit that made it whatever the branch order */
function revisions(file){
  return git(["log","--full-history","--no-merges","--format=%H|%P|%ad|%s","--date=short","--reverse","--",file]).trim().split("\n").filter(Boolean)
    .map(l=>{ const [h,p,d,...s]=l.split("|"); return {h,p:p.split(" ")[0],d,s:s.join("|")}; });
}
function evalAt(h,file,srcOnly){
  let src; try{ src=git(["show",h+":"+file]); }catch(e){ return null; }
  if(srcOnly) return {mod:null,src};
  const p=path.join(scratch,"thr-"+h.slice(0,10)+"-"+path.basename(file));
  fs.writeFileSync(p,src);
  try{ delete require.cache[require.resolve(p)]; return {mod:require(p),src}; }catch(e){ return {err:e.message,src}; }
}
function flat(v,pre,out){
  if(typeof v==="function") return out;
  if(v===null||typeof v!=="object"){ out[pre]=v; return out; }
  if(Array.isArray(v)&&v.every(x=>x===null||typeof x!=="object")){ out[pre]=JSON.stringify(v); return out; }
  Object.keys(v).forEach(k=>flat(v[k],pre?pre+"."+k:k,out)); return out;
}
/* direction: +1 when a larger value is looser, -1 when a smaller value is looser, 0 unknown */
function sense(key){
  if(/^DROP_LIMIT\./.test(key)) return 1;
  if(/^UNOBSTRUCTED\./.test(key)) return -1;
  if(/^CONF_SHARE\.|^SMOKE_SHARE$|^SOLID_BLACK$|^LAYER_MS$|^TIMELINE_MAX$|^HORIZON_DE$/.test(key)) return 1;
  if(/^PAPER_MIN_PXKM\./.test(key)) return -1;
  if(/^MOTION\.(JUMPS|POPS|FLICKER|LOD|VIS_REAL_FRAMES)$|^MOTION\.REAL_TOL\./.test(key)) return 1;
  if(/^CENSUS\.(DESK|PHONE)\.|^CENSUS\.EQUIV_PX$/.test(key)) return 1;
  if(/^CENSUS\.LOW\.cut$/.test(key)) return -1;
  if(/^CAM_TOL$|^MAP_WPP_TOL$|^GROUND_SELF_TOL$|^FOCUS_PX$/.test(key)) return 1;
  if(/^PAPER\.(north|spread|scaleBar)$/.test(key)) return 1;
  if(/^CTX_DELETES$/.test(key)) return 1;
  if(/^PHONE\.timeline\./.test(key)) return 1;
  if(/^PHONE\.framing\./.test(key)) return -1;
  return 0;
}
/* the array-valued limits compared element by element: UNOBSTRUCTED [case viewport, 1280 x 720] and MOTION.VIS [drawn, in view, longest ms] */
function arrDir(key,a,b){
  try{ a=JSON.parse(a); b=JSON.parse(b); }catch(e){ return null; }
  if(!Array.isArray(a)||!Array.isArray(b)) return null;
  if(/^UNOBSTRUCTED\./.test(key)){ const d=a.map((x,i)=>b[i]-x); const loose=d.some(x=>x<-1e-12), tight=d.some(x=>x>1e-12); return loose&&tight?"mixed":loose?"loosened":tight?"tightened":"same"; }
  if(/^MOTION\.VIS\./.test(key)){ /* drawn: smaller looser; in view: changed either way (a denominator); longest: larger looser */
    const parts=[]; if(b[0]<a[0]) parts.push("drawn floor lowered (looser)"); if(b[0]>a[0]) parts.push("drawn floor raised (tighter)");
    if(b[1]!==a[1]) parts.push("denominator changed");
    if(b[2]>a[2]) parts.push("longest-hidden ceiling raised (looser)"); if(b[2]<a[2]) parts.push("longest-hidden ceiling lowered (tighter)");
    const loose=parts.some(p=>/looser/.test(p)), tight=parts.some(p=>/tighter/.test(p));
    return (loose&&tight?"mixed":loose?"loosened":tight?"tightened":"re-based")+" ("+parts.join("; ")+")"; }
  return null;
}
function classify(key,a,b){
  if(a===undefined) return "added";
  if(b===undefined) return "removed";
  const ad=arrDir(key,a,b); if(ad) return ad;
  const s=sense(key);
  if(typeof a==="number"&&typeof b==="number"&&s){ return (b-a)*s>0?"loosened":"tightened"; }
  return "changed";
}
function history(file,pick,srcOnly){
  const revs=revisions(file), rows=[], seen=new Set(); let last=null;
  revs.forEach(r=>{
    const e=evalAt(r.h,file,srcOnly); if(!e) return;
    if(e.err){ rows.push({rev:r,error:e.err}); return; }
    const snap=pick(e.mod,e.src); last=snap;
    const pe=r.p?evalAt(r.p,file,srcOnly):null;
    if(!pe||pe.err){ rows.push({rev:r,first:true,keys:Object.keys(snap).length}); return; }
    const prev=pick(pe.mod,pe.src);
    const keys=new Set([...Object.keys(prev),...Object.keys(snap)]), ch=[];
    keys.forEach(k=>{ if(prev[k]!==snap[k]){ const sig=k+"\u0000"+prev[k]+"\u0000"+snap[k]; const dup=seen.has(sig); seen.add(sig);
      ch.push({key:k,was:prev[k],is:snap[k],dir:classify(k,prev[k],snap[k]),dup}); } });
    if(ch.length) rows.push({rev:r,changes:ch});
  });
  const head=evalAt("HEAD",file,srcOnly);
  return {file,revisions:revs.length,rows,final:head&&!head.err?pick(head.mod,head.src):last};
}
const THR="tools/visual/thresholds.js", BOOT="tools/visual/boot-check.js";
const thr=history(THR,m=>{ const o={}; Object.keys(m).forEach(k=>{ if(typeof m[k]!=="function") flat(m[k],k,o); }); return o; });
const boot=history(BOOT,(m,src)=>{ const mm=/const CTX_DELETES=(\d+)/.exec(src); return mm?{CTX_DELETES:+mm[1]}:{}; },true);
/* CHANGELOG.md's mentions of the loosened keys' cases, to pair a loosening with its recorded decision (a reader's aid, not a proof) */
const CL=fs.readFileSync(path.join(ROOT,"CHANGELOG.md"),"utf8");
function decisionsIn(msg){ return [...new Set((msg.match(/decisions? \d+(?: \([a-z]\))?(?:(?:,| and| to|-)\s*\d+(?: \([a-z]\))?)*/gi)||[]))]; }
const out={generated:new Date().toISOString(),head:git(["rev-parse","HEAD"]).trim(),gitDir:GITDIR?"a full clone of origin/main (HISTORY_GIT_DIR)":"the working clone",thresholds:thr,bootCheck:boot};
fs.writeFileSync(OUTJ,JSON.stringify(out,null,1)+"\n");
/* the markdown: every loosening and every non-addition change, with the commit, its subject and the decisions its subject names */
const L=[];
L.push("# Threshold history (generated)","",
  "Generated by `node tools/audit-post8/tests/threshold-history.js` on "+out.generated.slice(0,10)+" at HEAD `"+out.head.slice(0,12)+"`.",
  "Each revision of `"+THR+"` ("+thr.revisions+" commits) and `"+BOOT+"` ("+boot.revisions+" commits) evaluated on its own; consecutive revisions compared",
  "key by key. Direction: a larger drop limit, share, ceiling, budget or tolerance is looser; a smaller unobstructed baseline, paper-map density or",
  "culling cut is looser. \"added\" is a new case's first limit (its value is what the build of that day measured, by the file's own rule);",
  "\"re-based\" a visibility baseline whose drawn floor and longest-hidden ceiling did not loosen but whose denominator moved.","");
function table(h,title){
  L.push("## "+title,"");
  const counts={};
  h.rows.forEach(r=>{ if(r.error){ L.push("- `"+r.rev.h.slice(0,7)+"` "+r.rev.d+": could not be evaluated ("+r.error+")"); return; }
    if(r.first){ L.push("- `"+r.rev.h.slice(0,7)+"` "+r.rev.d+" (first revision): "+r.keys+" limit paths. "+r.rev.s,""); return; }
    const ch=r.changes.filter(c=>!c.dup);
    ch.forEach(c=>{ const k=c.dir.split(" ")[0]; counts[k]=(counts[k]||0)+1; });
    const interesting=ch.filter(c=>c.dir!=="added");
    const added=ch.filter(c=>c.dir==="added");
    if(!interesting.length&&!added.length) return;
    L.push("### `"+r.rev.h.slice(0,7)+"` "+r.rev.d+": "+r.rev.s.replace(/\|/g,"/"));
    const dec=decisionsIn(r.rev.s); if(dec.length) L.push("Decisions named in the subject: "+dec.join("; ")+".");
    L.push("");
    if(interesting.length){ L.push("| key | was | is | direction |","|---|---|---|---|");
      interesting.forEach(c=>L.push("| `"+c.key+"` | "+String(c.was).replace(/\|/g,"/")+" | "+String(c.is).replace(/\|/g,"/")+" | "+c.dir+" |")); L.push(""); }
    if(added.length) L.push("Added: "+added.map(c=>"`"+c.key+"` = "+String(c.is).slice(0,60)).join(", ")+".","");
  });
  L.push("Totals by direction: "+Object.entries(counts).map(([k,v])=>k+" "+v).join(", ")+".","");
}
table(thr,"tools/visual/thresholds.js");
table(boot,"tools/visual/boot-check.js (CTX_DELETES)");
fs.writeFileSync(OUTM,L.join("\n")+"\n");
console.log("thresholds.js: "+thr.revisions+" revisions; boot-check.js: "+boot.revisions+"; written "+OUTJ+" and "+OUTM);
