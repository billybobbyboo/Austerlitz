#!/usr/bin/env node
/* Stage 8, implementation PR 8E's prerequisite (the audit of 8D; docs/STAGE8_SPEC.md section 17): does a mesh's culling bound follow its geometry
   and the animation's definition? The app's own functions (ANIM, animAt, animEnv, animDefine where the source has it, cullGeo, cullRefresh,
   cullStale where it has it, cullTest, three's patched frustum test, cullBlock, animMesh), read from an app.js by acorn and run with the real
   three r128 (the devDependency), on a mesh of the probe's own, one instance of the kit's leg:
   1. the geometry swapped: a mesh drawn with G1 (every vertex of part 10: only the bob moves it, envelope 0.022) is given G2 (every vertex of
      part 1: the leg's swing about its hip, envelope 0.283); after the next frustum test, is the bound's envelope G2's, and does every vertex
      of every instance, animated at amp 1 over 64 phases (animAt: the hook's arithmetic, sampled, not the envelope's formula), lie inside the
      bound?
   2. back to G1: the envelope G1's again (valid for the geometry drawn, not stuck at the largest);
   3. the definition changed (part 10's bob raised fivefold, by animDefine where the source has it, else by writing ANIM.PART as 8D's source
      would have to): does the next test give an envelope and a bound that hold the animated vertices?
   4. an unchanged mesh: no refresh at the next test (the unchanged frame's cost is the comparisons only).
   node tools/stage8/envelope-8e.js [--src app.js] [--rev <git revision>] [--revs <rev>,<rev>] [--json out.json]
   Measurement code only: nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), cp=require("child_process"), acorn=require("acorn");
const THREE=require("three");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const ROOT=path.resolve(__dirname,"..",".."), OUT=opt("--json");
function load(label,src){
  const ast=acorn.parse(src,{ecmaVersion:2020}), want=["ANIM","animAt","animEnv","animDefine","animKey","animGLSL","animHook","animMesh","CULL","_cullS","cullGeo","cullRefresh","cullStale","cullTest","cullBlock"];
  const pick=[]; let patch=null;
  ast.body.forEach(n=>{ let k=null; if(n.type==="FunctionDeclaration") k=n.id.name; else if(n.type==="VariableDeclaration") k=n.declarations.map(d=>d.id.name).join(",");
    if(k&&want.indexOf(k)>=0) pick.push(src.slice(n.start,n.end));
    if(n.type==="ExpressionStatement"&&src.slice(n.start,n.end).indexOf("F.intersectsObject=function(o)")>=0) patch=src.slice(n.start,n.end); });
  /* ANIM.decl and ANIM.body are assignments after ANIM's declaration */
  const extra=ast.body.filter(n=>n.type==="ExpressionStatement"&&/^ANIM\.(decl|body)=/.test(src.slice(n.start,n.end))).map(n=>src.slice(n.start,n.end)).join("\n");
  const body=pick.join("\n")+"\n"+extra+"\n"+(patch||"")+"\nreturn {ANIM:ANIM, animAt:animAt, animEnv:animEnv, animDefine:typeof animDefine==='function'?animDefine:null, CULL:CULL, cullTest:cullTest, cullBlock:cullBlock};";
  /* the probe's own Frustum, so that the app's patch of three's prototype in one load does not reach another */
  const T=Object.assign({},THREE); T.Frustum=class extends THREE.Frustum{};
  const api=new Function("THREE","performance","requestRender","atmoUniforms",body)(T,require("perf_hooks").performance,function(){},function(){});
  api.label=label; api.T=T; return api;
}
function geom(part){   /* the kit's leg (its box, as kitFootFixed draws it), every vertex given one part: part 10, only the bob (envelope 0.022); part 1, the
     leg's swing about its hip (envelope 0.283, the audit's two numbers) */
  const P=Array.from(new THREE.BoxGeometry(0.13,0.62,0.18).translate(-0.09,0.31,0).toNonIndexed().attributes.position.array);
  const g=new THREE.BufferGeometry(); g.setAttribute("position",new THREE.Float32BufferAttribute(P,3));
  g.setAttribute("aPart",new THREE.Float32BufferAttribute(new Array(P.length/3).fill(part),1)); return g;
}
/* the probe's own oracle: every vertex of every instance, animated at amp 1 over 64 phases by animAt, in the mesh's world frame; the largest
   distance beyond the bound (<= 0 when every one is inside), and the largest displacement any vertex took (the envelope as sampled) */
function oracle(api,m){
  const cl=m.userData.cull, S=new THREE.Sphere().copy(cl.s).applyMatrix4(m.matrixWorld), Mi=new THREE.Matrix4(), V=new THREE.Vector3(), out=[0,0,0];
  const P=m.geometry.attributes.position.array, K=m.geometry.attributes.aPart.array; let beyond=-Infinity, disp=0;
  for(let i=0;i<m.count;i++){ Mi.fromArray(m.instanceMatrix.array,i*16);
    for(let v=0;v<K.length;v++) for(let k=0;k<64;k++){ api.animAt(Math.round(K[v]),P[v*3],P[v*3+1],P[v*3+2],k/64*Math.PI*2,1,out);
      disp=Math.max(disp,Math.hypot(out[0]-P[v*3],out[1]-P[v*3+1],out[2]-P[v*3+2]));
      V.set(out[0],out[1],out[2]).applyMatrix4(Mi).applyMatrix4(m.matrixWorld); beyond=Math.max(beyond,V.distanceTo(S.center)-S.radius); } }
  return {beyond:+beyond.toFixed(5), sampledEnv:+disp.toFixed(5)};
}
function run(api){
  const g1=geom(10), g2=geom(1), mat=new THREE.MeshLambertMaterial(), m=new THREE.InstancedMesh(g1,mat,1), grp=new THREE.Group(), A=new THREE.Matrix4();
  A.makeTranslation(0,0,0); m.setMatrixAt(0,A); m.instanceMatrix.needsUpdate=true; grp.add(m);
  api.cullBlock(grp,"probe"); grp.position.set(10,0,10); grp.updateMatrixWorld(true);
  const cam=new THREE.PerspectiveCamera(50,1.6,0.5,5000); cam.position.set(10,8,40); cam.lookAt(10,0,10); cam.updateMatrixWorld(true);
  const F=new api.T.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix,cam.matrixWorldInverse));
  const R={source:api.label}, cl=m.userData.cull, step=k=>{ F.intersectsObject(m); const o=oracle(api,m); R[k]={env:+cl.env.toFixed(5), envOfGeometry:+api.animEnv(m.geometry).toFixed(5), sampled:o.sampledEnv, beyond:o.beyond, holds:o.beyond<=1e-6}; };
  step("1. drawn with G1");
  m.geometry=g2; step("2. given G2");
  m.geometry=g1; step("3. back to G1");
  const r0=api.CULL.total.refresh; F.intersectsObject(m); R["4. unchanged, refreshes at the next test"]=api.CULL.total.refresh-r0;
  const P0=api.ANIM.PART, P1=JSON.parse(JSON.stringify(P0)); P1[10].bob=P0[10].bob*5;
  if(api.animDefine) api.animDefine(P1); else api.ANIM.PART=P1;
  step("5. the definition changed (part 10's bob x5)"+(api.animDefine?" by animDefine":" by writing ANIM.PART (the source has no animDefine)"));
  if(api.animDefine) api.animDefine(P0); else api.ANIM.PART=P0;
  return R;
}
const cases=[];
const src=opt("--src"), rev=opt("--rev"), revs=opt("--revs");
/* --revs A,B: those revisions only. Since implementation PR 8E itself the working tree's definition is 8E's (part 10 the man's root, no bob;
   ANIM.WHEEL read from ORDNANCE through the kit), so the probe's scenario, which is the prerequisite's, is run on the revisions it was written
   for: --revs 2f41819,2af8ed9 (8D as merged, and 8E's prerequisite); 8E's own definition is held by runtime-test.js and the self-test */
if(revs) revs.split(",").forEach(r=>cases.push(load("git "+r+":app.js",cp.execSync("git show "+r+":app.js",{cwd:ROOT,maxBuffer:64<<20}).toString())));
else {
  if(rev) cases.push(load("git "+rev+":app.js",cp.execSync("git show "+rev+":app.js",{cwd:ROOT,maxBuffer:64<<20}).toString()));
  cases.push(load(src||"app.js (working tree)",fs.readFileSync(path.resolve(ROOT,src||"app.js"),"utf8"))); }
const res={three:THREE.REVISION, runs:cases.map(run)};
res.runs.forEach(r=>{ console.log("== "+r.source); Object.keys(r).filter(k=>k!=="source").forEach(k=>console.log("   "+k+": "+JSON.stringify(r[k]))); });
if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(path.resolve(OUT),JSON.stringify(res,null,1)); }
