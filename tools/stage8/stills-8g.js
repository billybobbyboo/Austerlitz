#!/usr/bin/env node
/* Stage 8, implementation PR 8G (docs/STAGE8_SPEC.md section 19): the matched before-and-after evidence. Two builds (merged 8F's, or any "before";
   the PR's, the "after"), each view on a page opened as the harness opens it (?harness=1, tools/visual/measure.js's aim and case code), the same
   state on both: the pair side by side in one sheet (the before on the left), each captioned with its build, clock and factor, and how much of the
   frame differs between them (pixels whose grey differs by more than 8 of 255, and the mean difference). Sets of views:
   - pre1, the ground's atlas (prerequisite 1): low over the fields at noon and close over them (the near detail's distance), the Goldbach in
     the valley fog and at noon (the water class's ground, the marsh, the meadow), the marsh bottoms below Telnitz, the Littawa's bank near Hostieradek at noon in Clean (the water class's ground beside the stream), the low Pratzen view, the
     Overview, the going layer, the paper map (which draws no texture: identical), and a phone's screen (a low tier: no near detail);
   - pre2, the near detail's gradients (prerequisite 2): where it is drawn, where it fades out, where it is not drawn, and a phone's page;
   - 8g, the buildings: each village and landmark close and low, morning fog and later light, from afar, at 10.33x and 1x, the paper map, the
     eye level and a phone.
   Each capture records the page's errors and whether every program it made linked.
   node tools/stage8/stills-8g.js --before 8f.html --after 8g.html --set pre1 [--out dir] [--only a,b]
   Writes <out>/pairs/<set>-<view>.jpg and <out>/stills-<set>.json; measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), V=require("./views.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const BEFORE=path.resolve(opt("--before")), AFTER=path.resolve(opt("--after")||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=path.resolve(opt("--out")||path.join(L.EVID8,"8g"));
const SET=opt("--set")||"pre1", ONLY=opt("--only")?opt("--only").split(","):null;
const VP=[1600,900], PH=[390,844];
const Wv=(o,x)=>Object.assign(JSON.parse(JSON.stringify(o)),x);
const SETS={
  pre1:{
    "fields-low":{viewport:VP, t:720, presentation:"watch", mode:"terrain", aim:{map:[300,300], dir:[0.30,0.07,0.95], r:22}},
    "fields-close":{viewport:VP, t:720, presentation:"watch", mode:"terrain", aim:{map:[318,300], dir:[0.30,0.16,0.94], r:9}},
    "stream-low":V["stream-low"], "goldbach-noon":V["goldbach-noon"],
    "marsh-low":{viewport:VP, t:780, presentation:"watch", mode:"terrain", aim:{map:[232,420], dir:[-0.40,0.22,0.89], r:26}},
    "stream-bank":{viewport:VP, t:720, presentation:"map", mode:"terrain", aim:{map:[333,326], dir:[0.62,0.34,0.70], r:20}},
    "pratzen-low":V["pratzen-low"], "overview-field":V["overview-field"],
    "going":Wv(V["pratzen-low"],{going:true}),
    "paper":V["paper-north-up"],
    "phone-fields":{viewport:PH, t:720, presentation:"study", mode:"terrain", aim:{map:[300,300], dir:[0.30,0.12,0.95], r:24}}
  },
  /* prerequisite 2, the near detail's gradients taken before its fade's branch: where the detail is drawn (low and close over the fields, the
     eye level), where it fades out (the fade's far edge, 60 units, crossing the ground in the frame), where it is not drawn (the paper map, the
     Overview), and a phone's page (a low tier: no near detail) */
  pre2:{
    "fields-low":{viewport:VP, t:720, presentation:"watch", mode:"terrain", aim:{map:[300,300], dir:[0.30,0.07,0.95], r:22}},
    "fields-close":{viewport:VP, t:720, presentation:"watch", mode:"terrain", aim:{map:[318,300], dir:[0.30,0.16,0.94], r:9}},
    "fade-edge":{viewport:VP, t:720, presentation:"watch", mode:"terrain", aim:{map:[300,300], dir:[0.30,0.20,0.93], r:58}},
    "fade-edge-low":{viewport:VP, t:600, presentation:"watch", mode:"terrain", aim:{map:[262,330], dir:[-0.62,0.10,0.78], r:44}},
    "pratzen-low":V["pratzen-low"], "pratzen-low-10x":V["pratzen-low-10x"],
    "eye-zuran":V["eye-zuran"], "overview-field":V["overview-field"],
    "paper":V["paper-north-up"],
    "phone-fields":{viewport:PH, t:720, presentation:"study", mode:"terrain", aim:{map:[300,300], dir:[0.30,0.12,0.95], r:24}}
  },
  /* 8G's buildings: each village and landmark close and low, in the valley fog of the morning and in the later light, from afar (the Overview,
     the Field vantage, the low Pratzen view), at 10.33x and 1x (none drawn), on the paper map and at the eye level (none drawn), and on a phone */
  "8g":{
    "telnitz-fog":V["village-telnitz"],
    "telnitz-noon":{viewport:VP, t:780, presentation:"watch", mode:"terrain", aim:{map:[212,408], dir:[-0.30,0.42,0.86], r:34}},
    "sokolnitz-fog":{viewport:VP, t:480, presentation:"watch", mode:"terrain", aim:{map:[210,364], dir:[-0.55,0.34,0.76], r:30}},
    "sokolnitz-noon":{viewport:VP, t:720, presentation:"watch", mode:"terrain", aim:{map:[210,364], dir:[0.40,0.40,0.82], r:34}},
    "sokolnitz-castle":V["village-sokolnitz"],
    "close-sokolnitz":V["close-sokolnitz"],
    "pratzen-close":V["village-pratzen"],
    "pratzen-low":V["pratzen-low"],
    "kobelnitz-puntowitz":{viewport:VP, t:600, presentation:"watch", mode:"terrain", aim:{map:[209,250], dir:[-0.62,0.40,0.68], r:46}},
    "augezd-meres":V["ice-low"],
    "holubitz-blasowitz":{viewport:VP, t:660, presentation:"watch", mode:"terrain", aim:{map:[318,118], dir:[-0.30,0.36,0.88], r:52}},
    "austerlitz-town":{viewport:VP, t:840, presentation:"watch", mode:"terrain", aim:{map:[507,126], dir:[-0.55,0.40,0.73], r:36}},
    "overview-field":V["overview-field"],
    "overview-plan":V["overview-plan"],
    "pratzen-low-10x":V["pratzen-low-10x"],
    "pratzen-low-1x":V["pratzen-low-1x"],
    "paper":V["paper-north-up"],
    "eye-zuran":V["eye-zuran"],
    "phone-telnitz":{viewport:PH, t:780, presentation:"study", mode:"terrain", aim:{map:[212,408], dir:[-0.30,0.42,0.86], r:40}}
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
      await L.applyCase(page,c);
      const st=await page.evaluate(()=>{ var gl=renderer.getContext(), P=renderer.info.programs||[];   /* every program the page has made linked (0x8B82, LINK_STATUS) */
        return {clock:fmtClock(clock), factor:DISPLAY.factor, mode:mode, lowTier:lowTier, going:goingOn, programs:P.length, linked:P.filter(function(p){ return gl.getProgramParameter(p.program,0x8B82); }).length}; });
      st.pageErrors=(page._errors||[]).length; R[lab]=st;
      const png=await L.png(page); pngs.push(png.toString("base64"));
      tiles.push({png:png, cap:lab+" ("+path.basename(lab==="before"?BEFORE:AFTER)+"), "+name+", "+st.clock+", "+(+st.factor.toFixed(2))+"x"+(st.lowTier?", low tier":"")+(st.going?", the going layer":"")});
      await page.evaluate(()=>{ if(goingOn) document.getElementById("going").click(); }); }
    R.diff=await pages[Object.keys(pages)[0]].evaluate(DIFF,pngs);
    const ph=v.viewport[1]>v.viewport[0], tw=ph?390:800, th=ph?844:450;
    await L.sheet(pages[Object.keys(pages)[0]],tiles,2,tw,th,"8G "+SET+" before | after: "+name+" ("+R.diff.changed+"% of the frame changed)",path.join(OUT,"pairs",SET+"-"+name+".jpg"),true);
    console.log("pair "+name+" "+JSON.stringify(R)); }
  for(const k of Object.keys(pages)){ await pages[k].close(); delete pages[k]; }
  fs.writeFileSync(JS,JSON.stringify(res,null,1));
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
