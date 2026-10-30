#!/usr/bin/env node
/* Stage 8, implementation PR 8H (docs/STAGE8_SPEC.md section 20): the matched before-and-after evidence of what 8H changes on screen, as
   tools/stage8/stills-8g.js takes it (the same machinery, copied: two builds, each view on a page opened as the harness opens it, the same state on
   both, the pair side by side, the before on the left, each captioned with its build, clock and factor, and how much of the frame differs). The
   views: the town of Austerlitz from 8G's view and close by its church (the château's bearing, section 20.3); the phase's message at 08:45 in
   Study at 1600 x 900, 1024 x 768 and on a phone (the message placed clear of the controls, section 20.5); the crowns near the eye, 8F's close
   view by the Satschan mere and among the pheasantry wood's crowns (the crowns closing near the eye, section 20.10); and views where 8H changes
   nothing to be seen (the low Pratzen view, the Overview, close on Sokolnitz, the paper map), each pair's difference measured. A view's "after" runs in the
   page once the case is applied (the message flashed as the clock's phase change flashes it).
   node tools/stage8/stills-8h.js --before 8g.html --after 8h.html [--out dir] [--only a,b]
   Writes <out>/pairs/8h-<view>.jpg and <out>/stills-8h.json; measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), V=require("./views.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const BEFORE=path.resolve(opt("--before")), AFTER=path.resolve(opt("--after")||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=path.resolve(opt("--out")||path.join(L.EVID8,"8h"));
const SET="8h", ONLY=opt("--only")?opt("--only").split(","):null;
const VP=[1600,900], PH=[390,844];
const TOAST="flash(PHASES[3].flash); clearTimeout(flash._t); AUSTERLITZ_DEBUG.settle(2);";   /* its 3.4 s hiding timer cleared (as toast-8h.js does): software WebGL takes longer than that to the capture */
const SETS={
  "8h":{
    "austerlitz-town":{viewport:VP, t:840, presentation:"watch", mode:"terrain", aim:{map:[507,126], dir:[-0.55,0.40,0.73], r:36}},
    "austerlitz-church":{viewport:VP, t:840, presentation:"watch", mode:"terrain", aim:{map:[505,122], dir:[-0.20,0.62,0.76], r:16}},
    "toast-1600-study":{viewport:VP, t:525, presentation:"study", mode:"terrain", aim:{map:[285,289], dir:[-1.0,0.35,0.18], r:110}, after:TOAST},
    "toast-1024-study":{viewport:[1024,768], t:525, presentation:"study", mode:"terrain", aim:{map:[285,289], dir:[-1.0,0.35,0.18], r:110}, after:TOAST},
    "toast-phone":{viewport:PH, t:525, presentation:"study", mode:"terrain", aim:{map:[285,289], dir:[-1.0,0.35,0.18], r:140}, after:TOAST},
    "trees-eye":V["trees-eye"], "tree-close":V["tree-close"],
    "pratzen-low":V["pratzen-low"], "overview-field":V["overview-field"], "close-sokolnitz":V["close-sokolnitz"], "paper":V["paper-north-up"]
  }
};
const md5=f=>require("crypto").createHash("md5").update(fs.readFileSync(f)).digest("hex");
/* how much two captures differ (decoded in the page: PNG to pixels) */
const DIFF=function(ab){ return new Promise(function(res){ var n=0, ims=[];
  ab.forEach(function(b64,i){ var im=new Image(); im.onload=function(){ ims[i]=im; if(++n===2) go(); }; im.src="data:image/png;base64,"+b64; });
  function px(im){ var c=document.createElement("canvas"); c.width=im.width; c.height=im.height; var x=c.getContext("2d"); x.drawImage(im,0,0); return x.getImageData(0,0,im.width,im.height).data; }
  function go(){ var A=px(ims[0]), B=px(ims[1]), d=0, s=0, N=A.length/4; for(var i=0;i<A.length;i+=4){ var ga=0.2126*A[i]+0.7152*A[i+1]+0.0722*A[i+2], gb=0.2126*B[i]+0.7152*B[i+1]+0.0722*B[i+2], e=Math.abs(ga-gb); s+=e; if(e>8) d++; }
    res({changed:+(100*d/N).toFixed(3), meanDiff:+(s/N).toFixed(3)}); } }); };
(async()=>{
  if(!SETS[SET]) throw new Error("no set "+SET);
  fs.mkdirSync(path.join(OUT,"pairs"),{recursive:true});
  const JS=path.join(OUT,"stills-"+SET+".json"), old=ONLY&&fs.existsSync(JS)?JSON.parse(fs.readFileSync(JS,"utf8")):null;   /* a partial run (--only) updates its views in the record */
  const browser=await L.launch(), res={chromium:browser.version(), set:SET, before:{file:path.basename(BEFORE), md5:md5(BEFORE)}, after:{file:path.basename(AFTER), md5:md5(AFTER)}, views:old&&old.after.md5===md5(AFTER)?old.views:{}};
  const pages={};
  const pageFor=async(lab,html,vp)=>{ const key=lab+vp.join("x"); if(pages[key]) return pages[key]; for(const k of Object.keys(pages)) if(k.startsWith(lab)){ await pages[k].close(); delete pages[k]; }
    process.env.AUSTERLITZ_HTML=html; pages[key]=await L.open(browser,vp,{}); await pages[key].waitForTimeout(3000); return pages[key]; };
  for(const [name,v] of Object.entries(SETS[SET])){ if(ONLY&&!ONLY.includes(name)) continue;
    const tiles=[], R=res.views[name]={}, pngs=[];
    for(const [lab,html] of [["before",BEFORE],["after",AFTER]]){
      const page=await pageFor(lab,html,v.viewport); const c=Object.assign({},v); delete c.going;
      await page.evaluate(g=>{ if(goingOn!==!!g) document.getElementById("going").click(); },!!v.going);
      delete c.after; await L.applyCase(page,c);
      if(v.after) await page.evaluate(new Function(v.after));
      const st=await page.evaluate(()=>{ var gl=renderer.getContext(), P=renderer.info.programs||[];   /* every program the page has made linked (0x8B82, LINK_STATUS) */
        return {clock:fmtClock(clock), factor:DISPLAY.factor, mode:mode, lowTier:lowTier, going:goingOn, programs:P.length, linked:P.filter(function(p){ return gl.getProgramParameter(p.program,0x8B82); }).length}; });
      st.pageErrors=(page._errors||[]).length; R[lab]=st;
      const png=await L.png(page); pngs.push(png.toString("base64"));
      tiles.push({png:png, cap:lab+" ("+path.basename(lab==="before"?BEFORE:AFTER)+"), "+name+", "+st.clock+", "+(+st.factor.toFixed(2))+"x"+(st.lowTier?", low tier":"")+(st.going?", the going layer":"")});
      await page.evaluate(()=>{ if(goingOn) document.getElementById("going").click(); }); }
    R.diff=await pages[Object.keys(pages)[0]].evaluate(DIFF,pngs);
    const ph=v.viewport[1]>v.viewport[0], tw=ph?390:800, th=ph?844:450;
    await L.sheet(pages[Object.keys(pages)[0]],tiles,2,tw,th,"8H before | after: "+name+" ("+R.diff.changed+"% of the frame changed)",path.join(OUT,"pairs",SET+"-"+name+".jpg"),true);
    console.log("pair "+name+" "+JSON.stringify(R)); }
  for(const k of Object.keys(pages)){ await pages[k].close(); delete pages[k]; }
  fs.writeFileSync(JS,JSON.stringify(res,null,1));
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
