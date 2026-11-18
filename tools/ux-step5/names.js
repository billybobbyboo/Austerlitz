#!/usr/bin/env node
/* UI/UX roadmap step 5: the build's lettering modes as entered (PLATE.NAMES, switched in the page before the paper map is entered: "none", decision 302
   (b) as it was; "after", after the layer; "counters", after the counters while the plate stands, the owner's option (b) and the build's default;
   "framed", before the layer while the plate stands, option (a)), at 1600 x 900, 1366 x 768 and 1280 x 720, Study, 09:30 (the harness's own entry):
   the twelve drawn (tools/visual/ux5.js plateRead), the counters' leaders, the counters drawn and outside the neatline, the layer's drops, a capture each.
   node tools/ux-step5/names.js <build.html> <out-dir> [--modes none,after,counters,framed] [--t 570]
   Measurement only. */
"use strict";
const fs=require("fs"), path=require("path"), cp=require("child_process");
const U=require("./lib.js"), X=U.UX5;
(async()=>{
  const a=process.argv.slice(2), opt=f=>{ const i=a.indexOf(f); return i>=0?a[i+1]:null; };
  const html=path.resolve(a[0]), out=path.resolve(a[1]), modes=(opt("--modes")||"none,after,counters,framed").split(","), T=opt("--t")?+opt("--t"):570;
  fs.mkdirSync(out,{recursive:true}); const b=await U.launch(), R={build:U.buildInfo(html), chromium:b.version(), t:T, rows:[]};
  for(const vp of [[1600,900],[1366,768],[1280,720]]) for(const m of modes){
    const p=await U.open(b,html,{vp}); await p.evaluate(()=>closeFirst(null)); await U.settle(p,6);
    await p.evaluate(m=>{ PLATE.NAMES=m; },m); await U.enterPaper(p,{vp,t:T});
    const r=await p.evaluate(X.plateRead,X.TWELVE), f=path.join(out,m+"-"+vp.join("x")+".png");
    fs.writeFileSync(f,await p.screenshot({timeout:300000})); try{ cp.execFileSync("ffmpeg",["-y","-loglevel","error","-i",f,"-q:v","3",f.replace(/png$/,"jpg")]); fs.unlinkSync(f); }catch(e){}
    const row={vp:vp.join("x"), mode:m, twelve:r.twelveDrawn, named:r.twelve.filter(t=>t.drawn).map(t=>t.name), lead:r.leadPx, counters:r.counters, outside:r.countersOutside.length, placed:r.placed, dropped:r.dropped, errors:p.__errs.length};
    R.rows.push(row); console.log(row.vp.padEnd(9),m.padEnd(9),"twelve",row.twelve,"leaders",JSON.stringify(row.lead),"counters",row.counters,"outside",row.outside,"placed",row.placed,"dropped",row.dropped,"errors",row.errors);
    await p.context().close(); }
  await b.close(); fs.writeFileSync(path.join(out,"names.json"),JSON.stringify(R,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
