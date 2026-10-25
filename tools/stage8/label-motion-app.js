/* Stage 8, implementation PR 8C: label-motion.js --app (its header). The build measured as it is, the motion reaching it as a visitor's does
   (tools/visual/motion.js). Writes, per motion: Part A's measures (jumps, pops, level-of-detail switches, flicker, overlaps), the held frames,
   priority items hidden, remnants out of rule, the frame the run ends on (idle or not), the tracking of formations (visible share, off the
   screen, behind the ground, out of the layer, hidden by placement: the longest and the delay after room), and the layer's pass time. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("./lib.js");
const MO=require(path.join(L.ROOT,"tools","visual","motion.js"));
/* the formations reported one by one: ordinary ones a visitor might follow at 09:30-09:50, and the selection (priority) */
const TRACK=["sthilaire","vandamme","legrand","kollo","kamensky","lang","prz","dok","bag","lich","c_iv","c_iii"];
const SELECTED=[["hybrid-zoom","sthilaire"],["hybrid-orbit","sthilaire"],["paper-zoom","sthilaire"],["paper-play","sthilaire"]];
/* the motions real input can drive, driven again by it (MO.REAL: the pointer's drag, its right-button drag, the wheel) */
function pct(a,q){ if(!a.length) return null; const s=a.slice().sort((x,y)=>x-y); return +s[Math.min(s.length-1,Math.floor(s.length*q))].toFixed(3); }
async function main(o){
  const html=path.resolve(process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html"));
  const res={build:crypto.createHash("md5").update(fs.readFileSync(html)).digest("hex"), html:path.basename(html), rm:!!o.rm,
    note:"tools/visual/motion.js: the app's own loop at 30 frames a second on the driver's clock; the WebGL draw skipped; the motion by the app's own input and state",
    chromium:null, runs:[]};
  const browser=await L.launch(); res.chromium=browser.version();
  const runs=MO.MOTIONS.map(m=>({m:m,sel:null})).concat(MO.REAL.map(id=>({m:MO.MOTIONS.find(x=>x[0]===id),sel:null,real:true})),
    MO.EXTRA.map(m=>({m:m,sel:null,extra:m[5]})), SELECTED.map(s=>({m:MO.MOTIONS.find(x=>x[0]===s[0]),sel:s[1]})));
  let page=null, cur=null;
  for(const R of runs){
    const [id,view,kind,n,amt]=R.m, X=R.extra||{}, rid=id+(R.sel?"+sel":"")+(R.real?"+real":"")+(X.reading?"+"+X.reading:"")+(X.touch?"+touch":"");
    if(o.only&&!o.only.includes(rid)&&!o.only.includes(id)) continue;
    if(!page||cur!==view){ if(page) await page.close(); page=await L.open(browser,MO.VIEWS[view].viewport,{rm:!!o.rm}); cur=view; await L.inject(page,MO.inPage); }
    await page.evaluate(()=>{ select(null,null); if(typeof stopPlay==="function") stopPlay(); });
    await L.applyCase(page,MO.VIEWS[view]);
    await L.inject(page,MO.inPage);
    const t0=Date.now();
    const A={kind:kind,n:n,amt:amt,gl:false,room:true,select:R.sel,rest:30,pre:8,reading:X.reading||null,touch:!!X.touch};
    const r=R.real?await MO.runReal(page,A):await page.evaluate(new Function("a","return ("+MO.RUN.toString()+")(a);"),A);
    const M=MO.measure(r.F,{restFrom:r.restFrom,track:TRACK.concat(R.sel?[R.sel]:[])});
    M.id=rid; M.view=view; M.kind=kind; M.select=R.sel; M.real=!!R.real; M.reading=X.reading||null; M.touch=!!X.touch; M.msMed=pct(r.ms,0.5); M.msP95=pct(r.ms,0.95); M.msMax=pct(r.ms,1); M.passes=r.ms.length; M.mls=r.mls; M.secs=+((Date.now()-t0)/1000).toFixed(1);
    res.runs.push(M);
    const T=M.track.all;
    console.log(rid.padEnd(17),"jumps",String(M.jumps).padStart(4),"pops",String(M.pops).padStart(4),"lod",String(M.lod).padStart(3),"flicker",String(M.flicker).padStart(3),
      "overlap",M.overlapFrames,"held fr",M.heldFrames,"keep hidden",M.keepHidden,"remnant bad",M.remnantBad,"unknown drawn",M.unknownDrawn,"| visible",T.visible,"placement fr",T.placement,"longest",T.longestMs+"ms",
      "lag max",T.lagMaxMs+"ms","swaps",T.swaps,"| ms med/p95",M.msMed,M.msP95,"| end",M.idle);
    if(o.out){ fs.mkdirSync(path.dirname(o.out),{recursive:true}); fs.writeFileSync(o.out,JSON.stringify(res,null,1)); }
  }
  if(page) await page.close(); await browser.close();
  const sum=(f,k)=>res.runs.filter(f).reduce((s,r)=>s+r[k],0), tot=f=>({jumps:sum(f,"jumps"), pops:sum(f,"pops"), lod:sum(f,"lod"), flicker:sum(f,"flicker"),
    overlapFrames:sum(f,"overlapFrames"), keepHidden:sum(f,"keepHidden"), remnantBad:sum(f,"remnantBad"), heldFrames:sum(f,"heldFrames"), runs:res.runs.filter(f).length});
  res.totals=tot(r=>!r.select&&!r.real&&!r.reading&&!r.touch); res.totalsReal=tot(r=>r.real); res.totalsSelected=tot(r=>!!r.select); res.totalsExtra=tot(r=>!!(r.reading||r.touch));
  console.log("TOTAL (the 16 motions)",JSON.stringify(res.totals));
  console.log("TOTAL (the four by real input)",JSON.stringify(res.totalsReal));
  console.log("TOTAL (the four with a selection)",JSON.stringify(res.totalsSelected));
  console.log("TOTAL (the readings and the phone)",JSON.stringify(res.totalsExtra));
  if(o.out) fs.writeFileSync(o.out,JSON.stringify(res,null,1));
  return res;
}
module.exports={main};
