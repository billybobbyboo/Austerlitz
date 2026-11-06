/* The final audits' Stage 3 (WP-05, CL-SIM-01): an open dossier's cost while the clock plays. Since WP-05 an open formation's dossier is
   repainted at each clock minute (and kept as it is where nothing changed); at 4x a 60 Hz frame is 0.644 clock minutes, so most frames repaint
   it. Measured as the clock's step (setClock, Play's own advance) per frame over 300 frames from 09:00 (the page's clock advanced 1/60 s a frame), with no dossier open, Saint-Hilaire's card,
   his full dossier and the IV Column's full dossier, on each build given, in a fresh page at 1366 x 768 (median of three passes).
   Usage: node tools/final-stage3/play-cost.js <build.html> [<build.html> ...] [--out file.json] */
"use strict";
const path=require("path"), fs=require("fs"), ROOT=path.join(__dirname,"..","..");
const {chromium}=require(path.join(ROOT,"node_modules","playwright"));
const {routeThree,waitBoot}=require(path.join(ROOT,"tools","visual","three-route.js"));
const args=process.argv.slice(2), outI=args.indexOf("--out"), out=outI>=0?args[outI+1]:null, builds=args.filter((a,i)=>!a.startsWith("--")&&i!==outI+1);
function inPage(){
  closeFirst(null); stopPlay(); setCommandView("none");
  const per=0.644, N=300, res={};
  function run(label,setup){ const T=[], P=[];
    for(let pass=0;pass<3;pass++){ select(null,null); dossierExpanded=false; setClock(540,{instant:true,force:true,camera:false}); setup();
      for(let i=0;i<20;i++) setClock(540+i*per,{play:true,camera:false});
      setClock(540,{instant:true,force:true,camera:false}); setup(); let paints=0; const pd=window.paintDrawerBody; window.paintDrawerBody=function(){ paints++; return pd.apply(this,arguments); };
      /* the page's own clock (performance.now) advanced a 60 Hz frame for each step, as Play's frames are; the cost timed by the real one */
      const real=performance.now.bind(performance); let fake=real(); performance.now=function(){ return fake; };
      let ms=0; try{ for(let i=0;i<N;i++){ fake+=1000/60; const a=real(); setClock(540+i*per,{play:true,camera:false}); ms+=real()-a; } } finally { delete performance.now; }
      T.push(ms/N); window.paintDrawerBody=pd; P.push(paints); }
    T.sort((a,b)=>a-b); res[label]={msPerFrame:+T[1].toFixed(3),repaints:P[1],frames:N}; }
  run("no dossier",()=>{});
  run("Saint-Hilaire's card",()=>{ select("f","sthilaire"); });
  run("Saint-Hilaire's full dossier",()=>{ select("f","sthilaire"); dossierExpanded=true; paintDrawer(); });
  run("the IV Column's full dossier",()=>{ select("f","c_iv"); dossierExpanded=true; paintDrawer(); });
  select(null,null); dossierExpanded=false; return res;
}
(async()=>{
  const all={};
  for(const h of builds){ const b=await chromium.launch(), p=await b.newPage({viewport:{width:1366,height:768}});
    try{ await routeThree(p); await p.goto("file://"+path.resolve(h)); await waitBoot(p);
      all[path.basename(h)]=await p.evaluate(inPage); } finally { await b.close(); }
    console.log(path.basename(h)+" "+JSON.stringify(all[path.basename(h)])); }
  if(out) fs.writeFileSync(out,JSON.stringify({what:"the clock's step per 60 Hz frame at 4x (0.644 clock minutes), 300 frames from 09:00, median of three passes, ms",builds:all},null,1)+"\n");
})().catch(e=>{ console.error(e); process.exit(1); });
