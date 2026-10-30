#!/usr/bin/env node
/* Stage 8, the follow-up 8J and 8K (decisions 259 (a) and 260 (a); docs/STAGE8_SPEC.md section 21): the matched before-and-after evidence of what
   each data task changes on screen, as tools/stage8/stills-8h.js takes it (the same machinery, copied: two builds, each view on a page opened as
   the harness opens it, the same state on both, the pair side by side, the before on the left, each captioned with its build, clock and factor,
   and how much of the frame differs). The set "8j": the Sokolnitz castle and the pheasantry close (the castle again at 15:00, closer, the III Column gone from it), the brook by the village, the III Column at
   the castle at 10:00, the Pratzen church, the Austerlitz garden, the paper map close on Sokolnitz, and views where 8J changes nothing to be seen
   but the woods (the low Pratzen view, the Overview). The set "8k" (in 8K's branch): the post, the highway at the Santon's foot, Bagration at
   dawn, the northern battle at 10:30 and 14:30, the paper map's north, the Overview.
   node tools/stage8/stills-8j.js --set 8j|8k --before <build> --after <build> [--out dir] [--only a,b]
   Writes <out>/pairs/<set>-<view>.jpg and <out>/stills-<set>.json; measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), V=require("./views.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const SET=opt("--set")||"8j", BEFORE=path.resolve(opt("--before")), AFTER=path.resolve(opt("--after")||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=path.resolve(opt("--out")||path.join(L.EVID8,SET));
const ONLY=opt("--only")?opt("--only").split(","):null;
const VP=[1600,900], PH=[390,844];
const TOAST="flash(PHASES[3].flash); clearTimeout(flash._t); AUSTERLITZ_DEBUG.settle(2);";   /* its 3.4 s hiding timer cleared (as toast-8h.js does): software WebGL takes longer than that to the capture */
const SETS={
  "8j":{
    "sokolnitz-castle":{viewport:VP, t:600, presentation:"watch", mode:"terrain", aim:{map:[212.9,344.3], dir:[-0.55,0.42,0.72], r:26}},
    "sokolnitz-castle-afternoon":{viewport:VP, t:900, presentation:"watch", mode:"terrain", aim:{map:[212.9,344.3], dir:[-0.55,0.42,0.72], r:14}},   /* the castle close, after the III Column has gone (it stands over the castle 08:00-14:10) */
    "sokolnitz-pheasantry":{viewport:VP, t:600, presentation:"watch", mode:"terrain", aim:{map:[214.6,328.5], dir:[0.62,0.40,0.68], r:34}},
    "sokolnitz-brook":{viewport:VP, t:500, presentation:"watch", mode:"terrain", aim:{map:[211,360], dir:[0.70,0.34,0.62], r:30}},
    "sokolnitz-column":{viewport:VP, t:600, presentation:"study", mode:"terrain", aim:{map:[214,345], dir:[-0.62,0.46,0.64], r:48}},
    "pratzen-church":{viewport:VP, t:540, presentation:"watch", mode:"terrain", aim:{map:[277,252], dir:[-0.65,0.38,0.66], r:22}},
    "austerlitz-garden":{viewport:VP, t:840, presentation:"watch", mode:"terrain", aim:{map:[496,125], dir:[-0.40,0.55,0.73], r:30}},
    "paper-sokolnitz":V["paper-close"],
    "pratzen-low":V["pratzen-low"], "overview-field":V["overview-field"]
  },
  "8k":{
    "posthouse":{viewport:VP, t:900, presentation:"watch", mode:"terrain", aim:{map:[363.2,53.8], dir:[-0.55,0.40,0.73], r:24}},
    "highway-santon":{viewport:VP, t:420, presentation:"watch", mode:"terrain", aim:{map:[231,98], dir:[0.62,0.36,0.70], r:40}},
    "bagration-dawn":{viewport:VP, t:360, presentation:"study", mode:"terrain", aim:{map:[352,64], dir:[-0.70,0.42,0.58], r:44}},
    "north-1030":{viewport:VP, t:630, presentation:"study", mode:"terrain", aim:{map:[290,78], dir:[0.20,0.62,0.76], r:80}},
    "north-1430":{viewport:VP, t:870, presentation:"study", mode:"terrain", aim:{map:[370,50], dir:[-0.30,0.60,0.74], r:60}},
    "paper-north":{viewport:VP, t:630, presentation:"study", mode:"staff", aim:{map:[310,70], dir:[-0.62,0.46,0.64], r:110}},
    "overview-field":V["overview-field"]
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
    await L.sheet(pages[Object.keys(pages)[0]],tiles,2,tw,th,SET.toUpperCase()+" before | after: "+name+" ("+R.diff.changed+"% of the frame changed)",path.join(OUT,"pairs",SET+"-"+name+".jpg"),true);
    console.log("pair "+name+" "+JSON.stringify(R)); }
  for(const k of Object.keys(pages)){ await pages[k].close(); delete pages[k]; }
  fs.writeFileSync(JS,JSON.stringify(res,null,1));
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
