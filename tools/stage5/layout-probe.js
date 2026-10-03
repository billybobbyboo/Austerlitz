#!/usr/bin/env node
/* Stage 5 Part A (docs/STAGE5_SPEC.md sections C and F): interval events as bars on the timeline, and a day-track map in the
   dossier, measured on the built page by a probe (it reads the layout, adds prototype elements for the measurement and
   removes them; it changes no source file). node tools/stage5/layout-probe.js [--json f] [--sheet f]

   1. the timeline at 1600 x 900, 1280 x 720 and 1024 x 768, in Study and in Watch: the rail's width, the timebar's height
      (Stage 3C: at most 92 px), the event row's height and the free height left under 92 px; the 11 interval events as bars
      on the time axis packed into lanes (greedy, in start order, 2 px apart, an instant kept as its marker): lanes needed,
      the shortest bar in px; the bars drawn inside the rail's marker band (2 px a lane, 0.5 px apart: the event row is drawn over the
      rail, so nothing adds height) and what they share with the hour numerals and the markers, the timebar's height with them; the bars' fill (the side colour) against the timebar's ground (non-text contrast, 3:1); each interval's
      marker (drawn at its midpoint) against its dwell (at its start, Stage 4D), in px.
   2. the dossier at the same sizes with Saint-Hilaire's division selected: the dossier's width and height (Study: the rail's
      column from 1080 px; a card below), so a day-track inset's scale can be derived per formation (census.json). */
const fs=require("fs"), path=require("path");
const L5=require("./lib.js");
const {launch,open,settle,CASES,HELPERS,inject,sheet,EVID}=L5;
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const OUT=opt("--json")||path.join(EVID,"layout-probe.json"), SHEET=opt("--sheet")||path.join(EVID,"timeline-sheet.jpg");

const PROBE=function(){
  var T={};
  function lin(v){ v/=255; return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4); }
  function lum(c){ return 0.2126*lin(c[0])+0.7152*lin(c[1])+0.0722*lin(c[2]); }
  function rgb(s){ if(/^#/.test(s)){ var n=parseInt(s.slice(1),16); return [(n>>16)&255,(n>>8)&255,n&255]; } var m=/rgba?\(([^)]+)\)/.exec(s); return m?m[1].split(",").map(parseFloat).slice(0,3):null; }
  function cr(a,b){ var x=lum(a), y=lum(b); return +((Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)).toFixed(2); }
  function bgOf(e){ while(e){ var c=getComputedStyle(e).backgroundColor; if(c&&!/rgba\(0, 0, 0, 0\)|transparent/.test(c)){ var a=/rgba\([^)]*,\s*([\d.]+)\)/.exec(c); return {c:rgb(c),a:a?+a[1]:1}; } e=e.parentElement; } return {c:[12,17,22],a:1}; }
  T.timeline=function(){ var tb=document.querySelector(".timebar"), rail=document.getElementById("timerail"), ev=document.getElementById("evmarks");
    var R=rail.getBoundingClientRect(), H=tb.getBoundingClientRect().height, eh=ev?ev.getBoundingClientRect().height:0, wpx=R.width/(T_MAX-T_MIN);
    var I=EVENTS.map(function(e){ var w=evWindow(e); return {id:e.id,t0:w[0],t1:w[1],side:e.side}; }).filter(function(e){ return e.t1>e.t0; }).sort(function(a,b){ return a.t0-b.t0; });
    var lanes=[], shortest=1e9; I.forEach(function(e){ var x0=(e.t0-T_MIN)*wpx, x1=(e.t1-T_MIN)*wpx; shortest=Math.min(shortest,x1-x0);
      var k=0; while(k<lanes.length&&lanes[k]>x0-2) k++; lanes[k]=x1; e.lane=k; });
    var bg=bgOf(tb), fr=rgb(TOKENS.sym.side.fr.base), al=rgb(TOKENS.sym.side.al.base);
    var dwell=I.map(function(e){ return [e.id,+(((e.t0+e.t1)/2-e.t0)*wpx).toFixed(1)]; });
    return {railW:+R.width.toFixed(1),pxPerMin:+wpx.toFixed(3),timebarH:+H.toFixed(1),eventRowH:+eh.toFixed(1),slackTo92:+(92-H).toFixed(1),intervals:I.length,lanes:lanes.length,
      shortestBarPx:+shortest.toFixed(1),assign:I.map(function(e){ return [e.id,e.lane]; }),barContrast:{fr:cr(fr,bg.c),al:cr(al,bg.c),ground:bg},markerFromDwellPx:dwell}; };
  /* the bars inside the rail's marker band (the event row is drawn over the rail: no height to add, Stage 3C's 92 px): lane k a
     2 px bar at top 1+2.5k px of #evmarks; then the boxes they share with the hour numerals and with the markers */
  T.addBars=function(){ var ev=document.getElementById("evmarks"), info=T.timeline(), L={}; info.assign.forEach(function(a){ L[a[0]]=a[1]; });
    var H0=document.querySelector(".timebar").getBoundingClientRect().height;
    EVENTS.forEach(function(e){ var w=evWindow(e); if(w[1]<=w[0]) return; var b=document.createElement("i"); b.className="s5bar";
      b.style.cssText="position:absolute;height:2px;top:"+(1+L[e.id]*2.5)+"px;left:"+tlPc(w[0])+"%;width:"+(tlPc(w[1])-tlPc(w[0]))+"%;background:"+TOKENS.sym.side[e.side].base+";pointer-events:none";
      ev.appendChild(b); });
    function box(e){ var r=e.getBoundingClientRect(); return [r.left,r.top,r.right,r.bottom]; }
    function hit(a,b){ return Math.min(a[2],b[2])-Math.max(a[0],b[0])>0.5&&Math.min(a[3],b[3])-Math.max(a[1],b[1])>0.5; }
    var bars=[].slice.call(ev.querySelectorAll(".s5bar")).map(box), nums=[].slice.call(document.querySelectorAll("#railticks b")).map(box), marks=[].slice.call(ev.querySelectorAll(".ev-mark")).map(box);
    var bandTop=Math.min.apply(null,bars.map(function(r){ return r[1]; })), bandBot=Math.max.apply(null,bars.map(function(r){ return r[3]; }));
    var numTop=nums.length?Math.min.apply(null,nums.map(function(r){ return r[1]; })):null;
    var onNum=0, onMark=0; bars.forEach(function(b){ if(nums.some(function(n){ return hit(b,n); })) onNum++; if(marks.some(function(m){ return hit(b,m); })) onMark++; });
    return {lanes:info.lanes,band:[+bandTop.toFixed(1),+bandBot.toFixed(1)],numeralsTop:numTop===null?null:+numTop.toFixed(1),barsOverNumerals:onNum,barsUnderAMarker:onMark,
      timebarH:+document.querySelector(".timebar").getBoundingClientRect().height.toFixed(1),timebarH0:+H0.toFixed(1)}; };
  T.removeBars=function(){ document.querySelectorAll(".s5bar").forEach(function(e){ e.remove(); }); return true; };
  T.dossier=function(){ var d=document.querySelector(".drawer.on .dossier")||document.querySelector(".dossier"), cs=d?d.getBoundingClientRect():null, sc=d?d.closest(".drawer"):null;
    return d?{w:+cs.width.toFixed(1),h:+cs.height.toFixed(1),inner:d.clientWidth,drawer:sc?[+sc.getBoundingClientRect().width.toFixed(1),+sc.getBoundingClientRect().height.toFixed(1)]:null,docked:document.body.classList.contains("docked")||null}:null; };
  window.__s5t=T; return true;
};

(async()=>{
  const browser=await launch(), out={html:process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html",when:new Date().toISOString(),timeline:{},dossier:{}}, tiles=[];
  const field=CASES.find(c=>c.name==="overview-field"), sel=CASES.find(c=>c.name==="selected-formation");
  for(const vp of [[1600,900],[1280,720],[1024,768]]){
    const page=await open(browser,vp); await inject(page,HELPERS); await inject(page,PROBE);
    for(const pres of ["study","watch"]){
      await page.evaluate(s=>window.__aus.apply(s),Object.assign({},field,{viewport:vp,presentation:pres})); await settle(page);
      const k=vp.join("x")+":"+pres, r=await page.evaluate(()=>__s5t.timeline()); r.withBars=await page.evaluate(()=>__s5t.addBars()); await settle(page);
      if(vp[0]===1600||vp[0]===1024){ const tb=await page.evaluate(()=>{ const r=document.querySelector(".timebar").getBoundingClientRect(); return [r.left,r.top,r.width,r.height]; });
        tiles.push({png:await page.screenshot({clip:{x:tb[0],y:Math.max(0,tb[1]-4),width:tb[2],height:tb[3]+4},timeout:180000}),cap:k+" with interval bars (prototype)"}); }
      await page.evaluate(()=>__s5t.removeBars());
      out.timeline[k]=r; console.log("timeline",k,JSON.stringify({railW:r.railW,H:r.timebarH,ev:r.eventRowH,lanes:r.lanes,shortest:r.shortestBarPx,withBars:r.withBars,contrast:r.barContrast.fr+"/"+r.barContrast.al}));
    }
    await page.evaluate(s=>window.__aus.apply(s),Object.assign({},sel,{viewport:vp})); await settle(page);
    out.dossier[vp.join("x")]=await page.evaluate(()=>__s5t.dossier()); console.log("dossier",vp.join("x"),JSON.stringify(out.dossier[vp.join("x")]));
    if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
    await page.close();
  }
  /* day-track insets (derived): each formation's day fitted into the dossier's width, at a 3:2 inset */
  const C=JSON.parse(fs.readFileSync(path.join(EVID,"census.json"),"utf8"));
  out.dayTrackInset={};
  Object.keys(out.dossier).forEach(k=>{ const d=out.dossier[k]; if(!d) return; const w=d.inner-16, h=Math.round(w*2/3);
    out.dayTrackInset[k]={insetPx:[w,h],rows:C.dayTracks.map(t=>{ const ex=t.extentKm, s=Math.min(ex[0]>0?w/ex[0]:1e9,ex[1]>0?h/ex[1]:1e9,w/1.0);   /* at least 1 km across */
      return [t.id,+s.toFixed(1),t.shortestLegKm===null?null:+(t.shortestLegKm*s).toFixed(1)]; })};
    const rows=out.dayTrackInset[k].rows, small=rows.filter(r=>r[2]!==null&&r[2]<8);
    console.log("inset",k,JSON.stringify(out.dayTrackInset[k].insetPx),"px/km min",Math.min(...rows.map(r=>r[1])),"legs under 8 px",small.length,small.map(r=>r[0]).join(","));
  });
  fs.mkdirSync(EVID,{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(out,null,1));
  const page=await open(browser,[1600,900]); fs.writeFileSync(SHEET,await sheet(page,tiles,1,1600,110,"Stage 5 Part A: interval events as bars (prototype, inside the marker band)",true)); await browser.close();
})().catch(e=>{ console.error(e); process.exit(2); });
