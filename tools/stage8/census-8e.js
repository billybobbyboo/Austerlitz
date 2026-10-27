#!/usr/bin/env node
/* Stage 8, implementation PR 8E (decisions 242 (a), 244 (a); docs/STAGE8_SPEC.md sections 8.2-8.4 and 17): the troops' geometry against the 8D
   baseline, and the gait's draw calls and triangles, from the harness's own measure (tools/visual/measure.js census: every draw call of one
   whole frame where three r128 issues it, by pass, shadow, the ground's depth for the overlays, world, labels and post-processing, the figure
   meshes apart, reconciled with renderer.info for the same frame). Per build (each named by its md5, so two builds of one file name are kept
   apart) and view, the frame as the app draws it after the eye moved (culled, every pass, the depth drawn: census {cull:true, cold:true});
   on a build with the gait (GAIT) also the same frame with every kit mesh's amplitude set to 0 and then restored (the frame without the
   animation, the same culling), and the blocks drawn rich and simple (KLOD). Judged: every frame reconciled; on a build with the gait, the
   frame animated and not the same calls and triangles in every pass (the gait adds none); section 8.3's budgets (desktop 2.8 million
   triangles and 900 calls; the phone's 1.62 million triangles, its pages lowTier without the shadow pass).
   The views: the harness's cases that are neither fresh pages nor real pointer input (tools/visual/cases.js), and three of them at 1x and
   10.33x (as census-8d.js); --phone adds the three heavy views of the phone route on a phone's page (390 x 844, density 3, an iPhone's user
   agent).
   node tools/stage8/census-8e.js <8D build.html> <8E build.html> [--json out.json] [--md out.md] [--only name,name] [--phone]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), MD=opt("--md"), ONLY=opt("--only")?opt("--only").split(","):null, PHONE=argv.includes("--phone");
const BUILDS=argv.filter((a,i)=>a.endsWith(".html")&&!["--json","--md","--only"].includes(argv[i-1]));
if(!BUILDS.length){ console.error("usage: census-8e.js <build.html> [...] [--json out.json] [--md out.md] [--only names] [--phone]"); process.exit(2); }
const CASES=require(path.join(L.ROOT,"tools","visual","cases.js")).filter(c=>!c.fresh&&!c.interact);
const MULTI=["overview-field","close-sokolnitz","ph8-overview-watch"];
const VIEWS=[]; CASES.forEach(c=>{ VIEWS.push(c); if(MULTI.includes(c.name)){ VIEWS.push(Object.assign({},c,{name:c.name+"-1x",factor:1})); VIEWS.push(Object.assign({},c,{name:c.name+"-10x",factor:"model"})); } });
const VPO=[]; VIEWS.forEach(v=>{ const k=v.viewport.join("x"); if(!VPO.includes(k)) VPO.push(k); });
VIEWS.sort((a,b)=>VPO.indexOf(a.viewport.join("x"))-VPO.indexOf(b.viewport.join("x")));
const PHONE_VIEWS=["overview-plan","pratzen-low","ph8-overview-watch"].map(n=>Object.assign({},CASES.find(c=>c.name===n),{name:"phone:"+n,viewport:[390,844],phone:true}));
const IOS="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const BUDGET={desktop:{tris:2.8e6, calls:900}, phone:{tris:1.62e6}};
/* in the page: one view's frame, as drawn and (with the gait) with every amplitude 0 */
const FRAME=function(){
  var A=window.__aus, has=typeof CULL!=="undefined", gait=typeof GAIT!=="undefined";
  var pick=function(C){ var bp={}, fp={}; Object.keys(C.byPass).forEach(function(k){ bp[k]=[C.byPass[k].calls,C.byPass[k].tris]; });
    Object.keys(C.figByPass||{}).forEach(function(k){ fp[k]=[C.figByPass[k].calls,C.figByPass[k].tris]; });
    return {calls:C.calls, tris:C.tris, infoCalls:C.infoCalls, infoTris:C.infoTris, reconciled:!!C.reconciled, byPass:bp, fig:C.figures?[C.figures.calls,C.figures.tris]:null, figByPass:fp}; };
  var o={hasCull:has, hasGait:gait, drawn:pick(A.census(has?{cull:true,cold:true}:{cold:true}))};
  if(gait){ var keep=[]; CULL.meshes.forEach(function(m){ var U=m.userData.anim; if(U){ keep.push([U,U.uAnimAmp.value]); U.uAnimAmp.value=0; } });
    o.animated=keep.filter(function(q){ return q[1]>0; }).length;
    try{ o.still=pick(A.census({cull:true,cold:true})); } finally { keep.forEach(function(q){ q[0].uAnimAmp.value=q[1]; }); }
    var rich=0, simple=0; Object.keys(units).forEach(function(k){ var b=units[k].block, u=b&&b.userData; if(u&&b.visible&&u.lod&&u.lod.length){ if(u.lodRich) rich++; else simple++; } });
    o.rich=rich; o.simple=simple; }
  return o;
};
const same=(a,b)=>a&&b&&a.calls===b.calls&&a.tris===b.tris&&Object.keys(a.byPass).every(k=>b.byPass[k]&&a.byPass[k][0]===b.byPass[k][0]&&a.byPass[k][1]===b.byPass[k][1]);
(async()=>{
  const browser=await L.launch(), res={note:"one whole frame per view after the eye moved (culled, every pass, the depth drawn), software WebGL; the counts are what each build asks the GPU to draw, the same on any GPU at the same viewport",
    chromium:browser.version(), budgets:BUDGET, builds:{}, findings:[]};
  for(const b of BUILDS){
    process.env.AUSTERLITZ_HTML=path.resolve(b);
    const md5=crypto.createHash("md5").update(fs.readFileSync(b)).digest("hex"), R={file:path.basename(b), md5:md5, bytes:fs.statSync(b).size, views:{}};
    let page=null, vp=null;
    for(const v of VIEWS.concat(PHONE?PHONE_VIEWS:[])){
      if(ONLY&&!ONLY.includes(v.name)) continue;
      const key=v.viewport.join("x")+(v.phone?"@ios":"");
      if(!page||vp!==key){ if(page){ const cx=page.context(); await page.close(); if(page._phone) await cx.close(); }
        if(v.phone){ const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:IOS});
          page=await ctx.newPage(); page._phone=true; page._errors=[]; page.on("pageerror",e=>page._errors.push(e.message));
          const TR=require(path.join(L.ROOT,"tools","visual","three-route.js")); await TR.routeThree(page);
          await page.goto("file://"+path.resolve(b)+"?harness=1",{waitUntil:"commit",timeout:180000}); await TR.waitBoot(page,240000,250);
          await page.evaluate(fs.readFileSync(path.join(L.ROOT,"tools","visual","measure.js"),"utf8"));
          await page.addStyleTag({content:"*,*::before,*::after{transition:none!important;animation:none!important}"}); }
        else page=await L.open(browser,v.viewport);
        vp=key; await page.evaluate(()=>closeFirst(null)); }
      await page.evaluate(s=>window.__aus.apply(s),v); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(90)); await page.waitForTimeout(300); await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2));
      const m=await page.evaluate(FRAME); R.views[v.name]=m;
      const D=m.drawn, bud=v.phone?BUDGET.phone:BUDGET.desktop;
      if(!D.reconciled||(m.still&&!m.still.reconciled)) res.findings.push(md5.slice(0,8)+" "+v.name+": not reconciled with renderer.info");
      if(m.hasGait&&!same(D,m.still)) res.findings.push(md5.slice(0,8)+" "+v.name+": the gait changes the frame's calls or triangles ("+D.calls+"/"+D.tris+" against "+m.still.calls+"/"+m.still.tris+")");
      if(D.tris>bud.tris||(bud.calls&&D.calls>bud.calls)) res.findings.push(md5.slice(0,8)+" "+v.name+": over section 8.3's budget ("+D.calls+" calls, "+D.tris+" triangles)");
      console.log(md5.slice(0,8)+"  "+v.name.padEnd(28)+String(D.calls).padStart(4)+" calls "+String(D.tris).padStart(9)+" tris"+
        (D.fig?"  figures "+D.fig[0]+"/"+D.fig[1]:"")+"  "+Object.keys(D.byPass).map(k=>k+" "+D.byPass[k][0]+"/"+D.byPass[k][1]).join(", ")+
        (m.hasGait?"  rich "+m.rich+" simple "+m.simple+", "+m.animated+" meshes animated, without the animation "+(same(D,m.still)?"the same":"DIFFERENT"):""));
      if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(path.resolve(OUT),JSON.stringify(Object.assign({},res,{builds:Object.assign({},res.builds,{[md5]:R})}),null,1)); }
    }
    if(page){ const cx=page.context(); await page.close(); if(page._phone) await cx.close(); }
    res.builds[md5]=R;
  }
  await browser.close();
  /* the builds side by side: the second (and later) against the first, by view and pass */
  const keys=Object.keys(res.builds);
  if(keys.length>1){ const A=res.builds[keys[0]], rows=[];
    keys.slice(1).forEach(k=>{ const B=res.builds[k];
      Object.keys(B.views).forEach(n=>{ const a=A.views[n], bb=B.views[n]; if(!a) return; const da=a.drawn, db=bb.drawn;
        rows.push({view:n, base:[da.calls,da.tris], build:[db.calls,db.tris], dCalls:db.calls-da.calls, dTris:db.tris-da.tris, ratio:+(db.tris/da.tris).toFixed(4),
          passes:Object.keys(db.byPass).reduce((o,p)=>{ o[p]=[db.byPass[p][0]-((da.byPass[p]||[0,0])[0]),db.byPass[p][1]-((da.byPass[p]||[0,0])[1])]; return o; },{}),
          figures:da.fig&&db.fig?[db.fig[0]-da.fig[0],db.fig[1]-da.fig[1]]:null}); }); });
    res.compare={base:keys[0], rows};
    if(MD){ const md=["| view | 8D calls / triangles | 8E calls / triangles | change | triangles x | figures' change (calls / triangles) |","|---|---|---|---|---|---|"]
      .concat(rows.map(r=>"| `"+r.view+"` | "+r.base[0]+" / "+r.base[1].toLocaleString("en-GB")+" | "+r.build[0]+" / "+r.build[1].toLocaleString("en-GB")+" | "+(r.dCalls>=0?"+":"")+r.dCalls+" / "+(r.dTris>=0?"+":"")+r.dTris.toLocaleString("en-GB")+" | "+r.ratio+" | "+(r.figures?(r.figures[0]>=0?"+":"")+r.figures[0]+" / "+(r.figures[1]>=0?"+":"")+r.figures[1].toLocaleString("en-GB"):"")+" |"));
      fs.writeFileSync(path.resolve(MD),md.join("\n")+"\n"); } }
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(path.resolve(OUT),JSON.stringify(res,null,1)); }
  console.log(res.findings.length?res.findings.length+" findings:\n  "+res.findings.join("\n  "):"no findings: every frame reconciled, the gait adding no call or triangle, every view within section 8.3's budgets");
  if(res.findings.length) process.exitCode=1;
})().catch(e=>{ console.error(e); process.exit(1); });
