#!/usr/bin/env node
/* Stage 8, implementation PR 8D (decisions 249 (a), 250 (b); docs/STAGE8_SPEC.md sections 8.2-8.4 and 16): the census of one whole frame per
   view and pass, before and after, from the harness's own measure (tools/visual/measure.js census: every draw call where three r128 issues it,
   by pass, shadow, the ground's depth for the overlays, world, labels and post-processing, and by what is drawn, reconciled with renderer.info
   for the same frame). Per build and view, four frames: with culling and without it (a build without CULL draws as it does, its one frame
   standing for both), each with the depth pass reused from the last frame (a still eye) and drawn again (a frame whose eye moved), so that like
   is compared with like; and, as step 6 estimated it (docs/STEP6_SPEC.md section 3.2: "the figure meshes none of whose men is in the view,
   world pass"), the triangles of the figure meshes none of whose instances is in the eye's frustum, read on any build from its instance
   matrices, so that the estimate and the saving measured are set side by side on the same build.
   The views: the harness's 20 cases that are neither fresh pages nor real pointer input (tools/visual/cases.js), and three of them at 1x and
   10.33x (step 6's choice); --phone adds the three heavy views of the phone route on a phone's page (390 x 844, density 3, an iPhone's user
   agent: lowTier, no shadow pass).
   node tools/stage8/census-8d.js <build.html> [<build.html> ...] [--json out.json] [--only name,name] [--phone] [--md out.md]
   node tools/stage8/census-8d.js --from a.json,b.json --json out.json --md out.md   (runs of one build each, joined, nothing rendered)
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), MD=opt("--md"), ONLY=opt("--only")?opt("--only").split(","):null, PHONE=argv.includes("--phone"), FROM=opt("--from");
const BUILDS=argv.filter((a,i)=>a.endsWith(".html")&&!["--json","--md","--only","--from"].includes(argv[i-1]));
if(!BUILDS.length&&!FROM){ console.error("usage: census-8d.js <build.html> [...] [--json out.json] [--md out.md] [--only names] [--phone]"); process.exit(2); }
const CASES=require(path.join(L.ROOT,"tools","visual","cases.js")).filter(c=>!c.fresh&&!c.interact);
const MULTI=["overview-field","close-sokolnitz","ph8-overview-watch"];
const VIEWS=[]; CASES.forEach(c=>{ VIEWS.push(c); if(MULTI.includes(c.name)){ VIEWS.push(Object.assign({},c,{name:c.name+"-1x",factor:1})); VIEWS.push(Object.assign({},c,{name:c.name+"-10x",factor:"model"})); } });
/* the views in the order of their viewports (a page is opened for each viewport, in its first view's order), the cases' order within each */
const VPO=[]; VIEWS.forEach(v=>{ const k=v.viewport.join("x"); if(!VPO.includes(k)) VPO.push(k); });
VIEWS.sort((a,b)=>VPO.indexOf(a.viewport.join("x"))-VPO.indexOf(b.viewport.join("x")));
const PHONE_VIEWS=["overview-plan","pratzen-low","ph8-overview-watch"].map(n=>Object.assign({},CASES.find(c=>c.name===n),{name:"phone:"+n,viewport:[390,844],phone:true}));
const IOS="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
/* in the page: step 6's estimate, the figure meshes none of whose instances is in the eye's frustum (each instance's own sphere: its geometry's
   through its matrix and the mesh's), and their triangles, world pass */
const ESTIMATE=function(){
  var F=new THREE.Frustum(), M=new THREE.Matrix4(), Mi=new THREE.Matrix4(), S=new THREE.Sphere(), out={meshes:0, off:0, offTris:0, tris:0};
  camera.updateMatrixWorld(); F.setFromProjectionMatrix(M.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
  function vis(o){ while(o){ if(!o.visible) return false; o=o.parent; } return true; }
  Object.keys(units).forEach(function(id){ var b=units[id].block; if(!b) return; b.updateMatrixWorld(true);
    b.traverse(function(o){ if(!o.isInstancedMesh||!vis(o)||o.count<=0) return;
      var g=o.geometry; if(!g.boundingSphere) g=g.clone(), g.computeBoundingSphere();   /* a clone: the shared geometry's own bounds are not written */
      var gs=g.boundingSphere, A=o.instanceMatrix.array, n=Math.min(o.count,A.length/16), idx=o.geometry.index, tri=Math.floor((idx?idx.count:o.geometry.attributes.position.count)/3)*n, any=false;
      for(var i=0;i<n&&!any;i++){ Mi.fromArray(A,i*16); S.copy(gs).applyMatrix4(Mi).applyMatrix4(o.matrixWorld); if(F.intersectsSphere(S)) any=true; }
      out.meshes++; out.tris+=tri; if(!any){ out.off++; out.offTris+=tri; } }); });
  return out;
};
const sum=(c,ps)=>ps.reduce((a,p)=>a+((c.byPass[p]||{}).tris||0),0);
(async()=>{
  if(FROM){ const parts=FROM.split(",").map(f=>JSON.parse(fs.readFileSync(f,"utf8"))), J={note:parts[0].note, chromium:parts[0].chromium, builds:{}};
    parts.forEach(p=>Object.assign(J.builds,p.builds)); return writeOut(J); }
  const browser=await L.launch(), res={note:"one whole frame per view and pass, software WebGL; the counts are what each build asks the GPU to draw, the same on any GPU at the same viewport",
    chromium:browser.version(), builds:{}};
  for(const b of BUILDS){
    process.env.AUSTERLITZ_HTML=path.resolve(b);
    const md5=crypto.createHash("md5").update(fs.readFileSync(b)).digest("hex"), R={md5:md5, views:{}};
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
      const m=await page.evaluate(()=>{ var A=window.__aus, has=typeof CULL!=="undefined";
        var o={hasCull:has, onWarm:A.census(has?{cull:true}:{}), offWarm:has?A.census({cull:false}):null, offCold:has?A.census({cull:false,cold:true}):null, onCold:A.census(has?{cull:true,cold:true}:{cold:true})};
        if(!has){ o.offWarm=o.onWarm; o.offCold=o.onCold; }
        return o; });
      m.estimate=await page.evaluate(ESTIMATE);
      R.views[v.name]=m;
      const C=m.onCold, O=m.offCold;
      console.log(path.basename(b).slice(0,22).padEnd(23)+v.name.padEnd(28)+" eye moved: "+String(C.calls).padStart(4)+" calls "+String(C.tris).padStart(9)+" tris"+(m.hasCull?" (not culled "+O.calls+" / "+O.tris+", -"+(100*(1-C.tris/O.tris)).toFixed(1)+"%)":"")+
        "  world "+sum(C,["world"])+" shadow "+sum(C,["shadow"])+" depth "+sum(C,["depth"])+" post "+sum(C,["post"])+" labels "+sum(C,["labels"])+
        "  still eye "+m.onWarm.tris+"  reconciled "+[m.onWarm,m.offWarm,m.offCold,m.onCold].every(x=>x.reconciled)+"  step 6's estimate: "+m.estimate.off+" of "+m.estimate.meshes+" figure meshes off view, "+m.estimate.offTris+" tris");
    }
    if(page){ const cx=page.context(); await page.close(); if(page._phone) await cx.close(); }
    res.builds[path.basename(b)]=R;
    if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
  }
  await browser.close();
  writeOut(res);
})().catch(e=>{ console.error(e); process.exit(1); });
function writeOut(res){
  if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
  if(MD){ const out=[], k=n=>n>=1e6?(n/1e6).toFixed(3)+" M":n>=1e3?(n/1e3).toFixed(1)+" k":String(n);
    out.push("# The census by view and pass (tools/stage8/census-8d.js)\n");
    out.push("Generated from `"+path.basename(OUT||"census.json")+"` ("+res.chromium+", software WebGL): one whole frame per view, every pass, reconciled with `renderer.info`. "+
      "\"Eye moved\": the ground's depth for the overlays drawn again in the frame (8B's pass, as when the eye moves); \"still\": reused from the last frame. "+
      "Triangles as three counts them; calls are draw calls.\n");
    const BN=Object.keys(res.builds);
    if(BN.length>=2){ const A=res.builds[BN[0]], B=res.builds[BN[BN.length-1]], pc=(a,b)=>a?(100*(b-a)/a).toFixed(1)+"%":"-", PS=["world","shadow","depth","post","labels"];
      out.push("## Before and after: "+BN[0]+" (md5 `"+A.md5+"`) against "+BN[BN.length-1]+" (md5 `"+B.md5+"`)\n");
      out.push("The frame as each build draws it when the eye moves (the ground's depth drawn): calls, then triangles, whole frame and by pass (before → after). "+
        "Step 6's estimate is read on the before build: the triangles of the figure meshes none of whose instances is in the eye's frustum (world pass).\n");
      out.push("| view | calls | triangles | change | world | shadow | depth | post | labels | step 6's estimate (world, figures off the view) |");
      out.push("|---|---|---|---|---|---|---|---|---|---|");
      Object.keys(A.views).forEach(vn=>{ const a=A.views[vn], b=B.views[vn]; if(!b) return; const X=a.hasCull?a.offCold:a.onCold, Y=b.onCold;
        out.push("| "+vn+" | "+X.calls+" → "+Y.calls+" | "+k(X.tris)+" → "+k(Y.tris)+" | "+pc(X.tris,Y.tris)+" | "+PS.map(q=>k(sum(X,[q]))+" → "+k(sum(Y,[q]))).join(" | ")+" | "+a.estimate.offTris.toLocaleString("en-GB")+" ("+a.estimate.off+" of "+a.estimate.meshes+" meshes) |"); });
      out.push(""); }
    for(const [bn,R] of Object.entries(res.builds)){
      out.push("## "+bn+" (md5 `"+R.md5+"`)\n");
      out.push("| view | culled? | calls | triangles | world | shadow | depth | post | labels | figures (all passes) | still eye: triangles | reconciled |");
      out.push("|---|---|---|---|---|---|---|---|---|---|---|---|");
      for(const [vn,m] of Object.entries(R.views)){ const rows=m.hasCull?[["yes",m.onCold,m.onWarm],["no",m.offCold,m.offWarm]]:[["(no culling in the build)",m.onCold,m.onWarm]];
        rows.forEach(([cu,C,W])=>out.push("| "+vn+" | "+cu+" | "+C.calls+" | "+k(C.tris)+" | "+k(sum(C,["world"]))+" | "+k(sum(C,["shadow"]))+" | "+k(sum(C,["depth"]))+" | "+k(sum(C,["post"]))+" | "+k(sum(C,["labels"]))+" | "+k(C.figures.tris)+" | "+k(W.tris)+" | "+(C.reconciled&&W.reconciled)+" |")); }
      out.push(""); }
    fs.mkdirSync(path.dirname(MD),{recursive:true}); fs.writeFileSync(MD,out.join("\n")+"\n"); }
}
