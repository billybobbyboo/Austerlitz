#!/usr/bin/env node
/* UI/UX roadmap step 5: the plate's prototypes (tools/ux-step5/protos/plate.js) on a build, as entered at 1600 x 900, 1366 x 768 and 1280 x 720 and
   on a phone at 390 x 844: each variant put into the page before the paper map is entered; plate()'s measures (tools/ux-step5/lib.js) and a capture.
   node tools/ux-step5/protos-run.js <out-dir> <build.html> [--only v1,v2] [--vp 1600x900,...] [--t 570]
   Measurement only. */
"use strict";
const fs=require("fs"), path=require("path"), cp=require("child_process");
const U=require("./lib.js");
const VARIANTS=require("./variants.js");
const ALLVP=[[1600,900],[1366,768],[1280,720],[390,844,1]];
const PROTO=fs.readFileSync(path.join(__dirname,"protos","plate.js"),"utf8");
(async()=>{
  const a=process.argv.slice(2), opt=f=>{ const i=a.indexOf(f); return i>=0?a[i+1]:null; };
  const out=path.resolve(a[0]), html=path.resolve(a[1]), only=opt("--only"), vps=opt("--vp"), T=opt("--t")?+opt("--t"):570;
  const names=only?only.split(","):Object.keys(VARIANTS);
  const VP=vps?vps.split(",").map(s=>{ const m=s.split("x").map(Number); return m[0]<720?[m[0],m[1],1]:m; }):ALLVP;
  fs.mkdirSync(out,{recursive:true}); const res={build:U.buildInfo(html), t:T, runs:[]};
  const b=await U.launch(); res.chromium=b.version();
  for(const n of names){ const v=VARIANTS[n];
    for(const vp of VP){ const phone=!!vp[2], p=await U.open(b,html,{vp:[vp[0],vp[1]],phone});
      if(!phone){ await p.evaluate(()=>closeFirst(null)); await U.settle(p,6); }
      if(v){ await p.evaluate(PROTO); await p.evaluate(o=>window.__u5.install(o),v); }
      await U.enterPaper(p,{vp:[vp[0],vp[1]],t:T});
      const m=await U.plate(p);
      const name=n+"-"+vp[0]+"x"+vp[1]+(phone?"-phone":""), png=path.join(out,name+".png");
      fs.writeFileSync(png,await p.screenshot());
      const f=m.freeRect, d=6; m.surround=await U.canvasAt(p,[[f[0]+d,f[1]+d],[f[2]-d,f[1]+d],[f[0]+d,f[3]-d],[f[2]-d,f[3]-d]]);
      m.errors=p.__errs.filter(e=>!/willReadFrequently/.test(e)); try{ cp.execFileSync("ffmpeg",["-y","-loglevel","error","-i",png,"-q:v","3",png.replace(/png$/,"jpg")]); fs.unlinkSync(png); }catch(e){}
      res.runs.push(Object.assign({variant:n, vp:[vp[0],vp[1]], phone},m));
      console.log(n.padEnd(13),(vp[0]+"x"+vp[1]+(phone?"p":"")).padEnd(10),"twelve",m.twelveDrawn,"counters",m.counters,"outside",m.countersOutside.length,"led",m.countersLed,"placed",m.placed,"dropped",m.dropped,"byCat",JSON.stringify(m.byCat),"cart",m.cartBox?"yes":"no","surround",JSON.stringify(m.surround[0]),"errors",m.errors.length);
      await p.context().close(); }
  }
  await b.close(); fs.writeFileSync(path.join(out,"protos.json"),JSON.stringify(res,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
