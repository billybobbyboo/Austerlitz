#!/usr/bin/env node
/* Stage 8, implementation PR 8H (docs/STAGE8_SPEC.md section 20.11): do 8H's new and changed self-test checks fail when what they hold is broken?
   As tools/stage8/mutate-8f.js and mutate-8g.js: each mutation replaces strings in a copy of the built page; on each copy the self-test's block
   that holds the rule, read from the page's own source (from its opening comment to the next block's), is run with the self-test's helpers. The
   unmutated copy first: every check of each block passes on it. The blocks: "8g", the buildings (its (e) the château within an octant of its
   bearing, in the town's place, nothing drawn between; its (e') the dossiers' words recounted from the drawn farmsteads); "8e", the troops (its
   (l) the blocks' pose at a pause, a seek and a resume; (k) the gait at a pause); "a6", A-6 (one main landmark holding the map layer, the
   timeline a named region, no heading level skipped, the 2 px ring); "8f", water, woods and the near ground (its (d') the crowns closing near
   the eye, since 8H; the block runs on to the self-test's restore, so 8G's checks run with it).
   node tools/stage8/mutate-8h.js [--only ids] [--json out.json] [--check]     (the build: AUSTERLITZ_HTML, else the repository's; --check: only
   that every mutation's strings stand exactly once in the build)
   The rules a page cannot run in a block (the planner's tolerance's value, the rest rule, render on demand) are css-test.js's
   (tools/stage8/mutate-css-8h.js); the phase's message and the ring as drawn are the harness's live blocks (toast, ring), shown failing on 8G's
   build (section 20.5). Measurement code only: the copies are written to a temporary directory and nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ONLY=opt("--only")?opt("--only").split(","):null, OUT=opt("--json");
/* the self-test's blocks this tool runs: [their opening comment's first words, the next block's] */
const BLOCKS={
  "8g":["    /* Stage 8, implementation PR 8G (decision 248 (a); docs/STAGE8_SPEC.md section 19): the buildings (their ground at each factor is","    if(mode!==save.mode) setMode(save.mode);"],
  "8e":["/* Stage 8, implementation PR 8E (decisions 242 (a), 243 (a), 244 (a), 245 (a); docs/STAGE8_SPEC.md sections 4 and 17): the troops.","/* Stage 8, implementation PR 8C (decision 240 (a); docs/STAGE8_SPEC.md sections 3.4, 7.2 and 15)"],
  "a6":["    /* Stage 8, implementation PR 8H (docs/FINAL_AUDIT.md A-6; docs/STAGE8_SPEC.md section 20.5): one main landmark","    /* Stage 7C (docs/STAGE7_SPEC.md section 6, 7C;"],
  "8f":["/* Stage 8, implementation PR 8F (decisions 246 (a), 247 (a); docs/STAGE8_SPEC.md sections 5, 7.3, 7.4 and 18): water, woods and the near","    if(mode!==save.mode) setMode(save.mode);"]
};
/* [id, the block, what it breaks, [[from, to], ...]] */
const MUT=[
  ["none8g","8g","nothing (the build as it is)",[]],
  ["noocant","8g","the château's octant not sought (the planner takes the nearest clear place whatever its bearing, as 8G's quarter-turn let it)",[["if(dev>B.tol+1e-9) continue;   /* within the tolerance of its bearing today */","if(false) continue;   /* within the tolerance of its bearing today */"]]],
  ["noplace","8g","the château's centre not held in the town's place",[["if(!v8Foot(c[0],c[1])) continue;   /* its centre in the town's place */","if(false) continue;   /* its centre in the town's place */"]]],
  ["nobetween","8g","a drawn road or stream allowed between the château and its church",[["if(v8Between(ch.x,ch.z,c[0],c[1],segs)) continue;   /* no drawn road or stream between it and its church */","if(false) continue;   /* no drawn road or stream between it and its church */"]]],
  ["eachL","8g","the dossiers saying \"each an L\" of every village (8G's words)",[["  if(!lone) return n+\" drawn, each an L along its street\";","  return n+\" drawn, each an L along its street\";"]]],
  ["none8e","8e","nothing (the build as it is)",[]],
  ["poseease","8e","a block's heading eased on with the clock standing (8G's real-time ease)",[["  if(!adv) return;\n  if(LOOSE[st])","  if(LOOSE[st])"]]],
  ["poseshape","8e","a block's shape eased on with the clock standing",[["  if(sk){ u.sw=sh[0]; u.sd=sh[1]; }\n  else if(adv){","  if(sk){ u.sw=sh[0]; u.sd=sh[1]; }\n  else {"]]],
  ["noseek","8e","a seek not showing the clock's pose at once (the heading eased from where it stood)",[["  if(sk){ rec.yaw=rec.yaw===undefined?want0:want0+Math.PI*2*Math.round((rec.yaw-want0)/(Math.PI*2)); return; }","  if(sk&&rec.yaw===undefined){ rec.yaw=want0; return; }"]]],
  ["none6","a6","nothing (the build as it is)",[]],
  ["nomain","a6","the map layer outside a main landmark (8G's page)",[["<main id=\"map-main\"><div id=\"maplayer\" role=\"group\" aria-label=\"The map: formations, events and places\"></div></main>","<div id=\"maplayer\" role=\"group\" aria-label=\"The map: formations, events and places\"></div>"]]],
  ["noregion","a6","the timeline not a named region (a div, as before 8H)",[["<section class=\"timebar\" aria-label=\"Timeline\">","<div class=\"timebar\">"]]],
  ["h4","a6","the Now tab's \"What changed\" an h4 under the dispatch's h2 (a skipped level, as before 8H)",[["host.innerHTML='<h3>WHAT CHANGED AT '+esc(PHASES[phIdx].clock.split(\" \")[0])+'</h3><ul>'+","host.innerHTML='<h4>WHAT CHANGED AT '+esc(PHASES[phIdx].clock.split(\" \")[0])+'</h4><ul>'+"]]],
  ["ring1","a6","the focus ring 1 px (as before 8H)",[[":focus-visible{outline:2px solid var(--accent);outline-offset:2px}",":focus-visible{outline:1px solid var(--accent);outline-offset:2px}"]]],
  ["none8f","8f","nothing (the build as it is)",[]],
  ["nonear","8f","the crowns not closing near the eye (the hook's growth gone: 8F's crowns at every distance)",[["\",tnG*uTreeNear);\");","\",0.0);\");"]]],
  ["nohook","8f","a deciduous habit drawn without the near hook",[["    treeNear(im.material,1/TREE8F.shrink);   /* 8H: the crowns closing near the eye */","    /* (none) */"]]]
];
/* a self-test block, in the page */
const BLOCK=function(m){
  var src=[].map.call(document.scripts,function(s){ return s.textContent; }).join("\n");
  var a=src.indexOf(m[0]), b=src.indexOf(m[1],a+10);
  if(a<0||b<0) return {error:"the self-test's block not found"};
  var out=[], ck=function(n,ok,d){ out.push({name:n,ok:!!ok,detail:d}); };
  var fin=function(){ var n=0; if(tween) mlReset("tween ended at once"); while(tween&&n<4){ tween(performance.now()+1e7); n++; } };
  var t0=performance.now();
  try{ new Function("ck","settle","finishTween","placeCamera",src.slice(a,b))(ck,AUSTERLITZ_DEBUG.settle,fin,AUSTERLITZ_DEBUG.placeCamera); }
  catch(e){ out.push({name:"the block ran",ok:false,detail:"threw: "+e.message}); }
  /* what the planner drew for the château (its main range's centre), to tell a mutation that changes nothing drawn from one the check misses */
  var drawn=null; try{ (Array.isArray(BLDG)?BLDG:[]).forEach(function(r){ if(r&&r.part==="chateau main range"&&r.R) drawn=[+r.R.x.toFixed(4),+r.R.z.toFixed(4)]; }); }catch(e){}   /* BLDG: one record a building */
  return {checks:out, ms:Math.round(performance.now()-t0), chateau:drawn};
};
(async()=>{
  const html0=path.resolve(process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html")), src=fs.readFileSync(html0,"utf8");
  if(argv.includes("--check")){ let bad=0; for(const [id,,,subs] of MUT) for(const [a] of subs){ const n=src.split(a).length-1; if(n!==1){ bad++; console.log(id+": found "+n+" times: "+a.slice(0,90)); } }
    for(const k of Object.keys(BLOCKS)) for(const m of BLOCKS[k]){ if(src.indexOf(m)<0){ bad++; console.log("block "+k+": marker not found: "+m.slice(0,80)); } }
    console.log(bad?bad+" strings not found exactly once":"every mutation's strings stand exactly once ("+MUT.length+" mutations)"); process.exitCode=bad?1:0; return; }
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-8h-")), browser=await L.launch(), res={build:path.basename(html0), md5:require("crypto").createHash("md5").update(src).digest("hex"), chromium:browser.version(), mutations:[]};
  let wrong=0, noneChateau=null;
  for(const [id,blk,what,subs] of MUT){
    if(ONLY&&!ONLY.includes(id)) continue;
    let s=src; for(const [a,b] of subs){ if(s.split(a).length!==2) throw new Error(id+": the string to replace is not found exactly once: "+a.slice(0,80)); s=s.replace(a,()=>b); }
    const file=path.join(dir,id+".html"); fs.writeFileSync(file,s);
    process.env.AUSTERLITZ_HTML=file;
    const page=await L.open(browser,[1366,768],{}); await page.evaluate(()=>closeFirst(null));
    const st=await page.evaluate(BLOCK,BLOCKS[blk]); const errs=page._errors.slice(); await page.close();
    const failed=(st.checks||[]).filter(c=>!c.ok).map(c=>c.name.slice(0,110)+" | "+String(c.detail).slice(0,+(process.env.MUT_DETAIL||600)));
    const none=!subs.length;   /* a control: nothing replaced (an id's prefix will not do: "nonear" begins with "none") */
    if(none&&blk==="8g") noneChateau=JSON.stringify(st.chateau);
    /* a mutation of the planner that leaves the château where it was drawn changes nothing the self-test reads (the place chosen already meets
       the rule): equivalent here, held by css-test.js on the code (tools/stage8/mutate-css-8h.js); reported as such, not as a pass */
    const equivalent=!none&&blk==="8g"&&!failed.length&&!st.error&&st.chateau&&JSON.stringify(st.chateau)===noneChateau&&/^no(place|between)$/.test(id);
    const ok=none?!st.error&&(st.checks||[]).length>0&&!failed.length:(equivalent||!!(st.error||failed.length));
    if(!ok) wrong++;
    res.mutations.push({id, block:blk, what, ok, equivalent, chateau:st.chateau, selfTest:st.error?st.error:{checks:(st.checks||[]).length, failed, ms:st.ms}, pageErrors:errs});
    console.log((ok?(equivalent?"equiv ":"ok    "):"WRONG ")+"== "+id+" ("+blk+"): "+what+"\n   the block: "+(st.error||((st.checks||[]).length+" checks, "+failed.length+" failed, "+st.ms+" ms"))+(equivalent?"; the château drawn where it was ("+JSON.stringify(st.chateau)+"): nothing the check reads changed":"")+
      (failed.length?"\n     - "+failed.join("\n     - "):"")+(errs.length?"\n   page errors: "+errs.slice(0,3).join(" | "):""));
    if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
  }
  await browser.close(); fs.rmSync(dir,{recursive:true,force:true});
  console.log(wrong?wrong+" WRONG":"every mutation as it should be");
  if(wrong) process.exitCode=1;
})().catch(e=>{ console.error(e); process.exit(1); });
