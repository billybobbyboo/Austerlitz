#!/usr/bin/env node
/* Stage 8, the follow-up 8K (decision 260 (a); docs/STAGE8_SPEC.md section 21): COMMAND.fr["5"][0] says, as an inference from the model's terrain,
   that "most of the Olmütz road sector, including the Santon, is in view" from the Zuran. With the highway moved onto II/430's line that inference
   is measured again on two builds (before and after), each on a page opened as the probes open it: the model's own viewshed (computeViewshed, the
   3 m eye of "Whose eyes?", EYE_OBSERVER_M) from the Zuran's ground truth, and the highway (ROADS[0]) from the point nearest the Santon's summit
   to the point nearest the post house (GEOREF.GT.posthouse) sampled every 0.05 km: the share of the samples whose grid cell is in sight, the
   Santon's own cell, and the longest stretch hidden.
   node tools/stage8/roadview-8k.js --before <build> --after <build> [--out file.json]   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const BUILDS=[["before",path.resolve(opt("--before"))],["after",path.resolve(opt("--after"))]], OUT=opt("--out");
const md5=f=>require("crypto").createHash("md5").update(fs.readFileSync(f)).digest("hex");
const READ=function(){
  var G=GEOREF.GT, hw=ROADS.filter(function(r){ return r.cls==="highway"; })[0].p, km=GEOREF.kmBetween;
  function near(p){ var b=null; for(var i=0;i<hw.length-1;i++){ var a=hw[i], c=hw[i+1], dx=c[0]-a[0], dy=c[1]-a[1], L2=dx*dx+dy*dy, t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L2)), q=[a[0]+t*dx,a[1]+t*dy], d=Math.hypot(p[0]-q[0],p[1]-q[1]);
    if(!b||d<b.d) b={d:d,i:i,t:t,q:q}; } return b; }
  var s=near(G.santon.map), e=near(G.posthouse.map), pts=[s.q], i;
  for(i=s.i+1;i<=e.i;i++) pts.push(hw[i]); pts.push(e.q);
  var samp=[]; for(i=0;i<pts.length-1;i++){ var a=pts[i], c=pts[i+1], n=Math.max(1,Math.ceil(km(a,c)/0.05)); for(var k=0;k<n;k++) samp.push([a[0]+(c[0]-a[0])*k/n, a[1]+(c[1]-a[1])*k/n]); } samp.push(pts[pts.length-1]);
  computeViewshed(G.zuran.map,EYE_OBSERVER_M);
  var cell=function(p){ var w=W(p[0],p[1]), ix=Math.round((w[0]-G_X0)/G_DX), iz=Math.round((w[1]-G_Z0)/G_DZ); return (ix<0||iz<0||ix>=G_NX||iz>=G_NZ)?0:vsMask[iz*G_NX+ix]; };
  var vis=0, run=0, longest=0, len=0; samp.forEach(function(p,j){ var v=cell(p)?1:0; vis+=v; if(!v){ run+=(j?km(samp[j-1],p):0); if(run>longest) longest=run; } else run=0; if(j) len+=km(samp[j-1],p); });
  var out={road:pts.map(function(p){ return [+p[0].toFixed(1),+p[1].toFixed(1)]; }), km:+len.toFixed(2), samples:samp.length, inSight:vis, share:+(vis/samp.length).toFixed(3), longestHiddenKm:+longest.toFixed(2), santon:cell(G.santon.map)?"in sight":"hidden", posthouse:cell(G.posthouse.map)?"in sight":"hidden"};
  if(typeof clearViewshed==="function") clearViewshed();
  return out;
};
(async()=>{
  const browser=await L.launch(), res={tool:"tools/stage8/roadview-8k.js", builds:{}};
  for(const [tag,html] of BUILDS){ process.env.AUSTERLITZ_HTML=html; const page=await L.open(browser,[1280,720]);
    await page.evaluate(()=>{ closeFirst(null); if(playing) stopPlay(); });
    res.builds[tag]=Object.assign({file:path.basename(html), md5:md5(html)},await page.evaluate(READ),{errors:(page._errors||[]).slice()}); await page.close();
    console.log(tag+": "+JSON.stringify(res.builds[tag])); }
  await browser.close();
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
