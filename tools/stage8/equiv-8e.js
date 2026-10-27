#!/usr/bin/env node
/* Stage 8, implementation PR 8E's prerequisite (the audit of 8D; docs/STAGE8_SPEC.md section 17): the static comparison of culling's picture.
   Until 8E, tools/visual/thresholds.js passed a case when E.px <= EQUIV_PX + E.repeatPx: the pixels where the culled frame differs from the
   unculled could be excused by an equal count of pixels where two renders of the culled frame differ, wherever those lay. Now (censusCheck) no
   pixel may differ and two renders of one state must be identical (a repeat difference fails as inconclusive), and measure.js locates both sets.
   This tool shows the old rule and the new on:
   A. records alone (no page): none differing; an unrelated difference excused by an equal repeat count elsewhere; repeat noise alone; a
      difference with no repeat;
   B. the build, in the harness's low Pratzen case (tools/visual/cases.js "pratzen-low", 1600 x 900): (1) as it is, measured by measure.js's
      cullEquiv; (2) the mutation: one mesh in view wrongly culled (its frustum test forced to say "out"), so that the culled frame lacks it, and
      the second render of the culled frame given exactly as many changed pixels as that, elsewhere (pixels where the frames agree, the
      readPixels of that render altered in place: noise the comparison did not cause), judged by the old rule and by censusCheck.
   node tools/stage8/equiv-8e.js [--json out.json]     (the build: AUSTERLITZ_HTML, else the repository's)
   Measurement code only: nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), T=require("../visual/thresholds.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json");
const OLD=E=>E.px<=0+E.repeatPx;   /* the rule as it stood at 2f41819 (thresholds.js censusCheck, EQUIV_PX 0) */
const census={onWarm:{reconciled:true},offWarm:{reconciled:true},offCold:{reconciled:true,tris:1,calls:1},onCold:{reconciled:true,tris:1,calls:1}};
const judge=E=>{ const f=T.censusCheck("probe",{census,cullEquiv:E},{device:false}); return {oldRule:OLD(E)?"pass":"fail", newRule:f.length?"fail":"pass", why:f}; };
const A=[
  ["no pixel differs, two renders identical",{px:0,max:0,repeatPx:0,outside:0,shared:0,worse:0,firstOutside:[],firstRepeat:[]}],
  ["120 pixels differ at one place; two renders differ in 120 others (an unrelated change excused by an equal count elsewhere)",{px:120,max:64,repeatPx:120,outside:120,shared:0,worse:0,firstOutside:[[700,400,1,2,3,9,9,9]],firstRepeat:[[10,10,5,5,5,6,5,5]]}],
  ["no culling difference; two renders differ in 50 pixels (repeat noise alone)",{px:0,max:0,repeatPx:50,outside:0,shared:0,worse:0,firstOutside:[],firstRepeat:[[10,10,5,5,5,6,5,5]]}],
  ["120 pixels differ, two renders identical",{px:120,max:64,repeatPx:0,outside:120,shared:0,worse:0,firstOutside:[[700,400,1,2,3,9,9,9]],firstRepeat:[]}]
].map(([k,E])=>Object.assign({record:k},judge(E)));
const inPage=function(mutate){
  var spec=window.__equivSpec; window.__aus.apply(spec); AUSTERLITZ_DEBUG.settle(24);
  if(!mutate) return {E:window.__aus.cullEquiv()};
  /* the mesh: the kit mesh in view covering the most pixels' worth of instances (its bounds' radius on screen) */
  var F=new THREE.Frustum(), M=new THREE.Matrix4(); camera.updateMatrixWorld(); F.setFromProjectionMatrix(M.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
  var best=null, bs=-1; CULL.meshes.forEach(function(m){ var o=m; while(o){ if(!o.visible) return; o=o.parent; } if(!m.userData.anim||m.count<=0) return;
    F.intersectsObject(m); var S=m.userData.cull.s.clone().applyMatrix4(m.matrixWorld); if(!F.intersectsSphere(S)) return; var d=camera.position.distanceTo(S.center), s=S.radius/Math.max(1,d);
    if(s>bs){ bs=s; best=m; } });
  if(!best) return {error:"no kit mesh in view"};
  var gl=renderer.getContext(), rp=gl.readPixels, bufs=[], noise=null, calls=0;
  /* the mesh wrongly culled: three's frustum test answers "out" for it, in both passes, while culling is on */
  var it=THREE.Frustum.prototype.intersectsObject; THREE.Frustum.prototype.intersectsObject=function(o){ return (o===best&&CULL.on)?false:it.call(this,o); };
  gl.readPixels=function(x,y,w,h,f,t,b){ rp.apply(gl,arguments); calls++; bufs.push(b);
    if(noise&&calls===2) for(var i=0;i<noise.length;i++){ var q=noise[i]; b[q]=b[q]===255?254:b[q]+1; } };
  try{
    var E1=window.__aus.cullEquiv(), A0=bufs[0], B0=bufs[2], n=E1.px, pick=[];
    for(var i=A0.length-4;i>=0&&pick.length<n;i-=4) if(A0[i]===B0[i]&&A0[i+1]===B0[i+1]&&A0[i+2]===B0[i+2]) pick.push(i);
    noise=pick; bufs=[]; calls=0;
    var E2=window.__aus.cullEquiv();
    return {mesh:best.userData.cull.id+" ("+(best.userData.kit?best.userData.kit.role+" "+best.userData.kit.part:"")+")", withoutNoise:E1, withNoise:E2};
  } finally { gl.readPixels=rp; THREE.Frustum.prototype.intersectsObject=it; }
};
(async()=>{
  const html=path.resolve(process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html"));
  const res={build:path.basename(html), md5:require("crypto").createHash("md5").update(fs.readFileSync(html)).digest("hex"), records:A, page:{}};
  console.log("A. records:"); A.forEach(r=>console.log("   "+r.record+": the old rule "+r.oldRule+", the new "+r.newRule+(r.why.length?" ("+r.why.join("; ")+")":"")));
  const browser=await L.launch(); res.chromium=browser.version();
  const spec=L.byName("pratzen-low");
  for(const mut of [false,true]){
    const page=await L.open(browser,[1600,900],{}); await page.evaluate(s=>{ closeFirst(null); window.__equivSpec=s; },spec);
    const r=await page.evaluate(inPage,mut); await page.close();
    if(!mut){ res.page.asBuilt=Object.assign({E:r.E},judge(r.E)); console.log("B1. the build as it is, pratzen-low: "+r.E.px+" pixels differ, "+r.E.repeatPx+" between two renders; the old rule "+res.page.asBuilt.oldRule+", the new "+res.page.asBuilt.newRule); }
    else if(r.error){ res.page.mutated={error:r.error}; console.log("B2. "+r.error); }
    else { res.page.mutated={mesh:r.mesh, withoutNoise:Object.assign({E:r.withoutNoise},judge(r.withoutNoise)), withNoise:Object.assign({E:r.withNoise},judge(r.withNoise))};
      const a=res.page.mutated.withoutNoise, b=res.page.mutated.withNoise;
      console.log("B2. "+r.mesh+" wrongly culled: "+a.E.px+" pixels differ, "+a.E.repeatPx+" between two renders: the old rule "+a.oldRule+", the new "+a.newRule);
      console.log("    and as many pixels changed elsewhere in the second render: "+b.E.px+" differ ("+b.E.outside+" where the two renders agree), "+b.E.repeatPx+" between two renders: the old rule "+b.oldRule+", the new "+b.newRule+" ("+b.why.join("; ")+")"); }
  }
  await browser.close();
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(path.resolve(OUT),JSON.stringify(res,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
