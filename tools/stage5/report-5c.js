#!/usr/bin/env node
/* Stage 5C (docs/STAGE5_SPEC.md section I, 5C; owner decision 89): the interval bars and the one event clock, before and after,
   measured on the built page. It reads the running page; it changes no source file.
   node tools/stage5/report-5c.js [--json out.json] [--md out.md --before before.json] [--from after.json] [--sheet out.jpg]
   AUSTERLITZ_HTML=<build> measures another build (the one before 5C, for the "before").

   At 1600 x 900, 1280 x 720 and 1024 x 768, in Study and in Watch: the rail's width, the timebar's height (Stage 3C: at most 92
   px); the bars drawn (none before 5C): their number, lanes, the shortest in px, the largest distance of an edge from its window
   (tlPc), bars over an hour numeral, two bars of a lane overlapping, the lowest contrast of a bar against the timebar (its scrim
   at .96 over black and over white); each marker's centre against its event's start (the largest distance, and the counter-march's,
   in px); the minutes the previous/next event keys stop at from 04:00; a marker's click on the counter-march. */
const fs=require("fs");
const {launch,open,settle,sheet,CASES}=require("../stage2/page.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const READ=function(){
  function rgb(s){ var m=String(s).match(/[\d.]+/g)||[]; return [+m[0],+m[1],+m[2]]; }
  function lum(c){ var v=c.map(function(x){ x/=255; return x<=0.04045?x/12.92:Math.pow((x+0.055)/1.055,2.4); }); return 0.2126*v[0]+0.7152*v[1]+0.0722*v[2]; }
  function cr(a,b){ var x=lum(a), y=lum(b); return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05); }
  var tb=document.querySelector(".timebar"), ax=document.querySelector(".tb-trackwrap").getBoundingClientRect(), rail=document.getElementById("timerail").getBoundingClientRect();
  function xAt(t){ return ax.left+tlPc(t)/100*ax.width; }
  var r={railW:+rail.width.toFixed(1),timebarH:+tb.getBoundingClientRect().height.toFixed(1)};
  var bars=[].slice.call(document.querySelectorAll("#evmarks .ev-bar")), nums=[].slice.call(document.querySelectorAll("#railticks b")).map(function(b){ return b.getBoundingClientRect(); });
  var edge=0, short=1e9, onNum=0, lanes={}, crMin=null, sc=rgb(getComputedStyle(document.body).getPropertyValue("--scrim-rgb"));
  bars.forEach(function(b){ var e=EVENTS.filter(function(x){ return x.id===b.dataset.ev; })[0], w=evWindow(e), q=b.getBoundingClientRect();
    edge=Math.max(edge,Math.abs(q.left-xAt(w[0])),Math.abs(q.right-xAt(w[1]))); short=Math.min(short,q.width);
    if(nums.some(function(n){ return Math.min(n.right,q.right)>Math.max(n.left,q.left)&&Math.min(n.bottom,q.bottom)>Math.max(n.top,q.top); })) onNum++;
    (lanes[b.dataset.lane]=lanes[b.dataset.lane]||[]).push([q.left,q.right]);
    var c=rgb(getComputedStyle(b).backgroundColor); [0,255].forEach(function(g){ var v=cr(c,sc.map(function(x){ return 0.96*x+0.04*g; })); crMin=crMin===null?v:Math.min(crMin,v); }); });
  var lOv=0; Object.keys(lanes).forEach(function(k){ var L=lanes[k].sort(function(a,b){ return a[0]-b[0]; }); for(var i=1;i<L.length;i++) if(L[i][0]<L[i-1][1]-0.5) lOv++; });
  var top=bars.length?Math.min.apply(null,bars.map(function(b){ return b.getBoundingClientRect().top; })):null, bot=bars.length?Math.max.apply(null,bars.map(function(b){ return b.getBoundingClientRect().bottom; })):null;
  r.bars={n:bars.length,intervals:EVENTS.filter(function(e){ var w=evWindow(e); return w[1]>w[0]; }).length,lanes:Object.keys(lanes).length,shortestPx:bars.length?+short.toFixed(1):null,
    edgeErrPx:bars.length?+edge.toFixed(2):null,overNumerals:onNum,laneOverlaps:lOv,band:top===null?null:[+top.toFixed(1),+bot.toFixed(1)],
    numeralsTop:nums.length?+Math.min.apply(null,nums.map(function(n){ return n.top; })).toFixed(1):null,contrastMin:crMin===null?null:+crMin.toFixed(2)};
  var M=[].slice.call(document.querySelectorAll("#evmarks .ev-mark")), off=0, cm=null;
  M.forEach(function(b,i){ var q=b.getBoundingClientRect(), c=(q.left+q.right)/2, lab=b.getAttribute("aria-label")||"";
    var e=EVENTS.filter(function(x){ return lab.indexOf(x.n)>=0; }).sort(function(a,b){ return b.n.length-a.n.length; })[0]; if(!e) return;
    var d=Math.abs(c-xAt(evWindow(e)[0])); off=Math.max(off,d); if(e.id==="counter-march") cm=+d.toFixed(1); });
  r.markers={n:M.length,maxFromStartPx:+off.toFixed(1),countermarchFromStartPx:cm,example:(M.filter(function(b){ return /counter-march|Counter/i.test(b.getAttribute("aria-label")||""); })[0]||M[0]).getAttribute("aria-label")};
  return r; };
const CLOCK=function(){
  stopPlay(); setClock(T_MIN,{force:true,instant:true,camera:false}); var stops=[], last=-1;
  for(var i=0;i<60;i++){ jumpEvent(1); (typeof finishTween==="function"&&finishTween()); if(clock===last) break; last=clock; stops.push(clock); }
  var cm=EVENTS.filter(function(e){ return e.id==="counter-march"; })[0], w=cm?evWindow(cm):null, at=null;
  var M=[].slice.call(document.querySelectorAll("#evmarks .ev-mark")).filter(function(b){ return cm&&(b.getAttribute("aria-label")||"").indexOf(cm.n)>=0; })[0];
  if(M){ M.click(); (typeof finishTween==="function"&&finishTween()); at=clock; } select(null,null); stopPlay();
  var starts={}; EVENTS.forEach(function(e){ starts[evWindow(e)[0]]=1; });
  return {keyStops:stops.map(fmtClock),distinctStarts:Object.keys(starts).length,countermarch:w?{window:w.map(fmtClock),markerClick:at===null?null:fmtClock(at),themeMoment:fmtClock(momentOf("ev:counter-march").t)}:null}; };
(async()=>{
  const FROM=opt("--from");
  const out=FROM?JSON.parse(fs.readFileSync(FROM,"utf8")):{html:process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html",when:new Date().toISOString(),views:{}};
  if(!FROM){
    const browser=await launch(), field=CASES.find(c=>c.name==="overview-field"), tiles=[];
    for(const vp of [[1600,900],[1280,720],[1024,768]]){
      const page=await open(browser,vp);
      for(const pres of ["study","watch"]){
        await page.evaluate(s=>window.__aus.apply(s),Object.assign({},field,{viewport:vp,presentation:pres})); await settle(page);
        const k=vp.join("x")+":"+pres, r=await page.evaluate(READ); out.views[k]=r;
        console.log(k.padEnd(16),JSON.stringify(r));
        if(vp[0]!==1280){ const tb=await page.evaluate(()=>{ const q=document.querySelector(".timebar").getBoundingClientRect(); return [q.left,q.top,q.width,q.height]; });
          tiles.push({png:await page.screenshot({clip:{x:tb[0],y:Math.max(0,tb[1]-4),width:tb[2],height:tb[3]+4},timeout:180000}),cap:k}); }
      }
      if(vp[0]===1600){ out.clock=await page.evaluate(CLOCK); console.log("clock",JSON.stringify(out.clock)); }
      if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
      await page.close();
    }
    if(opt("--json")) fs.writeFileSync(opt("--json"),JSON.stringify(out,null,1));
    if(opt("--sheet")) fs.writeFileSync(opt("--sheet"),await sheet(await (async()=>{ const p=await open(browser,[1600,900]); return p; })(),tiles,1,1600,100,"Stage 5C: "+out.html,true));
    await browser.close();
  }
  if(opt("--md")&&opt("--before")){
    const B=JSON.parse(fs.readFileSync(opt("--before"),"utf8"));
    const f=r=>r?[r.timebarH+" px",r.bars.n+"/"+r.bars.intervals,r.bars.lanes,r.bars.shortestPx===null?"-":r.bars.shortestPx+" px",r.bars.edgeErrPx===null?"-":r.bars.edgeErrPx+" px",
      r.bars.overNumerals+" / "+r.bars.laneOverlaps,r.bars.contrastMin===null?"-":r.bars.contrastMin,r.markers.maxFromStartPx+" px ("+r.markers.countermarchFromStartPx+")"].join(" · "):"-";
    const md=["# Stage 5C against the build before it ("+B.html+")\n",
      "`node tools/stage5/report-5c.js` on each build, the Field vantage. Each cell: the timebar's height (at most 92) · bars / intervals · lanes · the shortest bar · an edge's largest distance from its window · bars over a numeral / overlapping in a lane · the lowest bar contrast against the timebar (over black and white) · a marker's largest distance from its event's start (the counter-march's).\n",
      "| size, presentation | before 5C | 5C |","|---|---|---|"];
    Object.keys(out.views).forEach(k=>md.push("| "+k+" | "+f(B.views[k])+" | "+f(out.views[k])+" |"));
    const c=(x,lab)=>x?md.push("\n"+lab+": the previous/next event keys from 04:00 stop at "+x.keyStops.length+" minutes ("+x.keyStops.join(", ")+"); "+x.distinctStarts+" distinct starts; the counter-march ("+x.countermarch.window.join(" to ")+"): its marker's click "+x.countermarch.markerClick+", its theme moment "+x.countermarch.themeMoment+"."):null;
    c(B.clock,"Before 5C"); c(out.clock,"5C");
    fs.writeFileSync(opt("--md"),md.join("\n")+"\n"); console.log(md.join("\n"));
  }
})().catch(e=>{ console.error(e); process.exit(2); });
