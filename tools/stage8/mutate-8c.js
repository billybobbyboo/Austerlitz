#!/usr/bin/env node
/* Stage 8, implementation PR 8C: do its checks fail when the behaviour they hold is broken? Each mutation replaces one string in a copy of the
   built page (the app's own code as built, or its style sheet); on each copy, (1) the self-test's 8C block, read from the page's own source
   (from its opening comment to "11. render on demand") and run with the self-test's helpers (ck, settle, finishTween, placeCamera), and
   (2) with --motion, the 16 motions of tools/visual/motion.js judged as the harness's motion block judges them (thresholds.js MOTION:
   the totals' limits, and in every run no overlap, no never-dropped item hidden, no remnant out of rule, idle at rest). css-test.js's static
   block is run on the mutated sources by tools' own mutation script, not here. The unmutated copy first: every check passes on it.
   node tools/stage8/mutate-8c.js [--only ids] [--motion] [--json out.json]     (the build: AUSTERLITZ_HTML, else the repository's)
   Measurement code only: the copies are written to a temporary directory and nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os");
const L=require("./lib.js"), MO=require(path.join(L.ROOT,"tools","visual","motion.js")), TH=require(path.join(L.ROOT,"tools","visual","thresholds.js"));
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ONLY=opt("--only")?opt("--only").split(","):null, MOTION=argv.includes("--motion"), OUT=opt("--json");
/* [id, what it breaks, [[from, to], ...]] */
const MUT=[
  ["none","nothing (the build as it is)",[]],
  ["off","the stabiliser off: every pass laid out afresh, as before 8C",[['var strat=MLS.moving?"hold":MLS.fromMotion?"persist":"build";','var strat="build";']]],
  ["band","no band: the switches read the true distance while the view moves",[['if(MLS.bandD===null||Math.abs(d-MLS.bandD)>MLS.BAND*MLS.bandD) MLS.bandD=d;\n  return MLS.bandD;','return d;']]],
  ["rmfade","fades under reduced motion",[['MLS.fadeOn=!RM&&!MLS.fresh&&MLS.fromMotion;','MLS.fadeOn=!MLS.fresh&&MLS.fromMotion;']]],
  ["reshuffle","the full search for every item at rest after motion (a reshuffle)",[['var strat=MLS.moving?"hold":MLS.fromMotion?"persist":"build";','var strat=MLS.moving?"hold":"build";']]],
  ["atonce","a returning item drawn at once (no re-placement pass, no second pass)",[['if(!MLS.pass){ it.held=true; return false; }',''],['if(it.room2>=MLS.PASSES)','if(it.room2>=1)']]],
  ["keepheld","the never-dropped items held and hidden like the rest",[['while(nk<order.length&&order[nk].keep) nk++;','']]],
  ["focusheld","the keyboard's focus held like the rest",[['if(s==="build"||it.el===foc) return mlPlaceItem(it,VW,VH,panels,obst);','if(s==="build") return mlPlaceItem(it,VW,VH,panels,obst);']]],
  ["rempicked","a remnant (an item not drawn) picked by the pointer",[['if(it.on&&it.rect&&cx>=it.rect[0]','if(it.rect&&cx>=it.rect[0]']]],
  ["farall","the far step on battle information too",[['if(!it.small||camera.isOrthographicCamera','if(camera.isOrthographicCamera']]],
  ["remnantlong","a remnant kept past its fade",[['it.rem=!on&&it.fa>0&&it.lastOn?it.lastOn:null;','it.rem=!on&&it.lastOn?it.lastOn:null;']]]
];
/* the self-test's 8C block, in the page */
const BLOCK=function(){
  var src=[].map.call(document.scripts,function(s){ return s.textContent; }).join("\n");
  var a=src.indexOf("/* Stage 8, implementation PR 8C (decision 240 (a); docs/STAGE8_SPEC.md sections 3.4, 7.2 and 15)"), b=src.indexOf("/* 11. render on demand */",a);
  if(a<0||b<0) return {error:"the self-test's 8C block not found"};
  var out=[], ck=function(n,ok,d){ out.push({name:n,ok:!!ok,detail:d}); };
  var fin=function(){ var n=0; while(tween&&n<4){ tween(performance.now()+1e7); n++; } };
  try{ new Function("ck","settle","finishTween","placeCamera",src.slice(a,b))(ck,AUSTERLITZ_DEBUG.settle,fin,AUSTERLITZ_DEBUG.placeCamera); }
  catch(e){ out.push({name:"the block ran",ok:false,detail:"threw: "+e.message}); }
  return {checks:out};
};
async function motions(browser,html){
  process.env.AUSTERLITZ_HTML=html; let page=null, cur=null; const runs=[];
  for(const m of MO.MOTIONS){ const [id,view,kind,n,amt]=m;
    if(!page||cur!==view){ if(page) await page.close(); page=await L.open(browser,MO.VIEWS[view].viewport,{}); cur=view; }
    await page.evaluate(()=>{ select(null,null); stopPlay(); }); await L.applyCase(page,MO.VIEWS[view]); await page.evaluate(MO.inPage);
    const r=await page.evaluate(new Function("a","return ("+MO.RUN.toString()+")(a);"),{kind,n,amt,gl:false,room:false,rest:30,pre:8});
    const M=MO.measure(r.F,{restFrom:r.restFrom}); runs.push({id,kind,jumps:M.jumps,pops:M.pops,lod:M.lod,flicker:M.flicker,overlapFrames:M.overlapFrames,keepHidden:M.keepHidden,remnantBad:M.remnantBad,moving:M.moving,end:M.idle}); }
  if(page) await page.close();
  const S=k=>runs.reduce((s,r)=>s+r[k],0), T={jumps:S("jumps"),pops:S("pops"),lod:S("lod"),flicker:S("flicker")}, bad=[], X=TH.MOTION;
  if(T.jumps>X.JUMPS) bad.push("jumps "+T.jumps); if(T.pops>X.POPS) bad.push("pops "+T.pops); if(T.flicker>X.FLICKER) bad.push("flickers "+T.flicker);
  if(T.lod>X.LOD) bad.push("level-of-detail switches "+T.lod);
  runs.forEach(r=>{ if(r.overlapFrames) bad.push(r.id+" overlap"); if(r.keepHidden) bad.push(r.id+" never-dropped hidden "+r.keepHidden); if(r.remnantBad) bad.push(r.id+" remnants out of rule "+r.remnantBad);
    if(!(r.moving>0)) bad.push(r.id+" no frame moving"); if(r.kind!=="play"&&r.end!=="idle") bad.push(r.id+" not idle at rest"); });
  return {totals:T, fails:bad};
}
(async()=>{
  const html0=path.resolve(process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html")), src=fs.readFileSync(html0,"utf8");
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-8c-")), browser=await L.launch(), res={build:path.basename(html0), mutations:[]};
  for(const [id,what,subs] of MUT){
    if(ONLY&&!ONLY.includes(id)) continue;
    let s=src; for(const [a,b] of subs){ if(s.split(a).length!==2) throw new Error(id+": the string to replace is not found exactly once: "+a.slice(0,80)); s=s.replace(a,()=>b); }
    const file=path.join(dir,id+".html"); fs.writeFileSync(file,s);
    process.env.AUSTERLITZ_HTML=file;
    const page=await L.open(browser,[1366,768],{}); const st=await page.evaluate(BLOCK); await page.close();
    const failed=(st.checks||[]).filter(c=>!c.ok).map(c=>c.name.replace(/^map layer( in motion)? \((section 7\.2, )?decision 240\): /,"").slice(0,90)+" | "+String(c.detail).slice(0,160));
    const R={id, what, selfTest:st.error?st.error:{checks:(st.checks||[]).length, failed}};
    if(MOTION) R.motion=await motions(browser,file);
    res.mutations.push(R);
    console.log("== "+id+": "+what+"\n   self-test 8C block: "+(st.error||((st.checks||[]).length+" checks, "+failed.length+" failed"))+(failed.length?"\n     - "+failed.join("\n     - "):"")+
      (R.motion?"\n   motion block: "+JSON.stringify(R.motion.totals)+(R.motion.fails.length?" FAILS: "+R.motion.fails.slice(0,6).join("; "):" passes"):""));
    if(OUT) fs.writeFileSync(OUT,JSON.stringify(res,null,1));
  }
  await browser.close(); fs.rmSync(dir,{recursive:true,force:true});
})().catch(e=>{ console.error(e); process.exit(1); });
