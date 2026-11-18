#!/usr/bin/env node
/* UI/UX roadmap step 5: the paper map as entered on any build, at 1600 x 900, 1366 x 768 and 1280 x 720 (Study, 09:30, as the harness's paper cases)
   and at 390 x 844 as a phone (entered by its taps); each view's plate() measures (tools/ux-step5/lib.js), the canvas's colour at the free
   rectangle's four inner corners (the surround), and a capture. node tools/ux-step5/probe.js <out-dir> <label>=<build.html> [...] [--t 540]
   Measurement only. */
"use strict";
const fs=require("fs"), path=require("path"), cp=require("child_process");
const U=require("./lib.js");
const VIEWS=[{vp:[1600,900]},{vp:[1366,768]},{vp:[1280,720]},{vp:[390,844],phone:true}];
(async()=>{
  const args=process.argv.slice(2), ti=args.indexOf("--t"), T=ti>=0?+args[ti+1]:570;
  const rest=args.filter((a,i)=>!(ti>=0&&(i===ti||i===ti+1))), out=path.resolve(rest[0]), builds=rest.slice(1).map(a=>{ const i=a.indexOf("="); return {label:a.slice(0,i), html:path.resolve(a.slice(i+1))}; });
  fs.mkdirSync(out,{recursive:true}); const res={t:T, builds:[]};
  const b=await U.launch();
  for(const B of builds){ const rec={label:B.label, build:U.buildInfo(B.html), chromium:b.version(), views:[]};
    for(const V of VIEWS){ const p=await U.open(b,B.html,{vp:V.vp,phone:!!V.phone});
      if(!V.phone){ await p.evaluate(()=>closeFirst(null)); await U.settle(p,6); }
      await U.enterPaper(p,{vp:V.vp,t:T});
      const m=await U.plate(p), f=m.freeRect, d=6;
      const name=B.label+"-"+V.vp.join("x")+(V.phone?"-phone":"")+"-paper-entered", png=path.join(out,name+".png");
      fs.writeFileSync(png,await p.screenshot());
      m.surround=await U.canvasAt(p,[[f[0]+d,f[1]+d],[f[2]-d,f[1]+d],[f[0]+d,f[3]-d],[f[2]-d,f[3]-d]]);
      m.errors=p.__errs.filter(e=>!/willReadFrequently/.test(e)); try{ cp.execFileSync("ffmpeg",["-y","-loglevel","error","-i",png,"-q:v","3",png.replace(/png$/,"jpg")]); fs.unlinkSync(png); }catch(e){}
      rec.views.push(Object.assign({vp:V.vp,phone:!!V.phone},m));
      console.log(B.label.padEnd(8),(V.vp.join("x")+(V.phone?" phone":"")).padEnd(14),"north",m.paperMap&&m.paperMap.north,"edges",JSON.stringify(m.edges),"field in free",m.fieldInFree,
        "counters",m.counters,"outside",m.countersOutside.length,"led",m.countersLed,"twelve",m.twelveDrawn,"dropped",m.dropped,"surround",JSON.stringify(m.surround[0]),"contours",JSON.stringify(m.contours),"errors",m.errors.length);
      await p.context().close(); }
    res.builds.push(rec); }
  await b.close();
  fs.writeFileSync(path.join(out,"probe.json"),JSON.stringify(res,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
