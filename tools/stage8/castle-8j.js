#!/usr/bin/env node
/* Stage 8, the follow-up 8J (docs/STAGE8_SPEC.md section 21.7): the Sokolnitz castle at its own site. On a build, on a page opened as the probes
   open it: the drawn track and brook beside the castle's site (their distance from it and their drawn widths, v8NearSegs), then, for 8G's size and
   smaller ones, the castle's quadrangle (BLD8G.castle, every side times the size) at its nearest clear place within 8 units on the site's side of
   every drawn road and stream (no centre line crossed, v8Between), and at its nearest clear place covering its site (the site inside the
   quadrangle), each searched on a 0.1-unit grid (0.05 for the covering), clear as the planner tests it (v8Clear against the drawn roads, streams,
   meres and trees); then what the build draws (BLDG: the castle's and its farm's size, the quadrangle's centre from the site, its sides in metres,
   the site inside or not), Sokolnitz's farmsteads drawn against the map's count, and the III Column's place against the castle's site every ten
   minutes (posAtClock: its figures are laid round it).
   node tools/stage8/castle-8j.js <build> [--json out.json]   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path"), L=require("./lib.js");
const argv=process.argv.slice(2), oi=argv.indexOf("--json"), OUT=oi>=0?argv[oi+1]:null, FILE=argv.filter((a,i)=>a!=="--json"&&i!==oi+1)[0];
const md5=f=>require("crypto").createHash("md5").update(fs.readFileSync(f)).digest("hex");
(async()=>{
  const browser=await L.launch(); process.env.AUSTERLITZ_HTML=path.resolve(FILE); const page=await L.open(browser,[1280,720]);
  const r=await page.evaluate(()=>{
    var t=woodsPlan(), trees=t.broad.concat(t.conif), B0=BLD8G.castle, n=v8North(), e=v8East(), site=LANDMARK_SITES.castle, c=W(site[0],site[1]), M=GEOREF.M_PER_WORLD;
    var tE=Math.atan2(e[1],e[0]), tN=Math.atan2(n[1],n[0]), segs=v8NearSegs(c,16), ctx={placed:[], segs:segs, trees:trees.filter(function(q){ return Math.hypot(q[0]-c[0],q[2]-c[1])<20; })};
    function rel(x,z){ var dx=x-c[0], dz=z-c[1]; return [dx*e[0]+dz*e[1], dx*n[0]+dz*n[1]]; }
    function at(o,de,dn){ return [o[0]+e[0]*de+n[0]*dn, o[1]+e[1]*de+n[1]*dn]; }
    function cas(o,s){ var w=B0.w*s, d=B0.d*s, we=B0.west*s, ea=B0.east*s, ns=B0.ns*s, P=[], inner=d-2*ns;
      function rg(de,dn,tt,a,b){ var p=at(o,de,dn); P.push(v8Rect(p[0],p[1],tt,a,b)); }
      rg(0,d/2-ns/2,tE,w/2,ns/2); rg(0,-d/2+ns/2,tE,w/2,ns/2); rg(-w/2+we/2,0,tN,inner/2-0.02,we/2); rg(w/2-ea/2,0,tN,inner/2-0.02,ea/2); return P; }
    function clear(P){ for(var i=0;i<P.length;i++){ var why=v8Clear(P[i],ctx); if(why) return why; } return null; }
    /* the drawn ribbons beside the site: each obstacle's nearest segment */
    var near={}; segs.forEach(function(o){ var d=segDist(c[0],c[1],o.ax,o.az,o.bx,o.bz), k=o.kind+" "+(o.name||""); if(!near[k]||d<near[k].d) near[k]={kind:o.kind, name:o.name||null, d:d, h:o.h, c:o.c}; });
    var ribbons=Object.keys(near).map(function(k){ var q=near[k]; return {kind:q.kind, name:q.name, fromSiteM:Math.round(q.d*M), drawnWidthM:Math.round(2*q.h*M), clearanceM:Math.round(q.c*M), freeM:Math.round((q.d-q.h-q.c)*M)}; }).filter(function(q){ return q.fromSiteM<400; }).sort(function(a,b){ return a.fromSiteM-b.fromSiteM; });
    var sizes=[], s, k;
    for(k=0;;k++){ s=Math.round((1-k*CASTLE8J.step)*1000)/1000; if(s<CASTLE8J.floor-1e-9) break;
      var best=null, cover=null, hw=B0.w*s/2, hd=B0.d*s/2, de, dn, off, o;
      for(de=-8;de<=8+1e-9;de+=0.1) for(dn=-8;dn<=8+1e-9;dn+=0.1){ off=Math.hypot(de,dn); if(off>8||(best&&off>=best.off)) continue; o=at(c,de,dn);
        if(v8Between(c[0],c[1],o[0],o[1],segs)||clear(cas(o,s))) continue; best={off:off, de:de, dn:dn}; }
      for(de=-hw;de<=hw+1e-9;de+=0.05) for(dn=-hd;dn<=hd+1e-9;dn+=0.05){ off=Math.hypot(de,dn); if(cover&&off>=cover.off) continue; o=at(c,de,dn); if(clear(cas(o,s))) continue; cover={off:off, de:de, dn:dn}; }
      var f=function(q){ return q?{offUnits:+q.off.toFixed(2), offM:Math.round(q.off*M), east:+q.de.toFixed(2), north:+q.dn.toFixed(2)}:null; };
      sizes.push({size:s, quadrangleM:[Math.round(B0.w*s*M), Math.round(B0.d*s*M)], nearestClearOnItsSide:f(best), nearestClearCovering:f(cover), atSite:!clear(cas(c,s))}); }
    /* 8G's size anywhere within 8 units, whatever lies between (the nearest clear place the old rule would have found further off) */
    var any=null; for(var de2=-8;de2<=8+1e-9;de2+=0.1) for(var dn2=-8;dn2<=8+1e-9;dn2+=0.1){ var off2=Math.hypot(de2,dn2); if(off2>8||(any&&off2>=any.off)) continue; if(clear(cas(at(c,de2,dn2),1))) continue; any={off:off2, de:de2, dn:dn2}; }
    var cr=BLDG.filter(function(b){ return /^castle /.test(b.part||""); }), fm=BLDG.filter(function(b){ return /^farm /.test(b.part||""); }), drawn=null;
    if(cr.length){ var E=[], N=[]; cr.forEach(function(b){ b.R.corners.forEach(function(q){ var p=rel(q[0],q[1]); E.push(p[0]); N.push(p[1]); }); });
      var cx=cr.reduce(function(a,b){ return a+b.R.x; },0)/cr.length, cz=cr.reduce(function(a,b){ return a+b.R.z; },0)/cr.length, cc=rel(cx,cz);
      var fx=fm.reduce(function(a,b){ return a+b.R.x; },0)/Math.max(1,fm.length), fz=fm.reduce(function(a,b){ return a+b.R.z; },0)/Math.max(1,fm.length), ff=rel(fx,fz);
      drawn={castleRanges:cr.length, farmRanges:fm.length, sizes:cr.concat(fm).map(function(b){ return b.scale; }), centreFromSiteM:[Math.round(cc[0]*M), Math.round(cc[1]*M)],
        quadrangleM:[Math.round((Math.max.apply(null,E)-Math.min.apply(null,E))*M), Math.round((Math.max.apply(null,N)-Math.min.apply(null,N))*M)],
        siteInside:Math.min.apply(null,E)<=0&&Math.max.apply(null,E)>=0&&Math.min.apply(null,N)<=0&&Math.max.apply(null,N)>=0, farmCentreFromSiteM:fm.length?[Math.round(ff[0]*M), Math.round(ff[1]*M)]:null,
        heights:cr.map(function(b){ return b.part+" "+b.h; })}; }
    var sv=VILLAGES.filter(function(v){ return v[0]==="Sokolnitz"; })[0], sp=BLDG.plans&&BLDG.plans.Sokolnitz;
    /* the III Column (prz) against the castle's site every ten minutes, 04:00-17:00: its position's distance (the block's figures are laid round it) */
    var col=[], win=null; for(var tm=240;tm<=1020;tm+=10){ var gone=goneAt("prz",tm)||notYetAt("prz",tm), p=gone?null:posAtClock("prz",tm), dm=p?Math.round(GEOREF.kmBetween(p,site)*1000):null;
      col.push({t:("0"+Math.floor(tm/60)).slice(-2)+":"+("0"+tm%60).slice(-2), m:dm}); if(dm!=null&&dm<=150){ if(!win) win={from:col[col.length-1].t}; win.to=col[col.length-1].t; } }
    return {site:site, metresPerWorldUnit:M, ribbons:ribbons, sizes:sizes, size1AnywhereWithin8:any?{offUnits:+any.off.toFixed(2), offM:Math.round(any.off*M), east:+any.de.toFixed(2), north:+any.dn.toFixed(2), acrossARibbon:v8Between(c[0],c[1],at(c,any.de,any.dn)[0],at(c,any.de,any.dn)[1],segs)}:null,
      drawn:drawn, sokolnitzFarmsteads:{drawn:sp?sp.farms.length:null, map:sv?sv[3]:null}, CASTLE8J:CASTLE8J, thirdColumn:{within150m:win, every10min:col}}; });
  const res={tool:"tools/stage8/castle-8j.js", build:path.basename(FILE), md5:md5(FILE), errors:(page._errors||[]).slice()}; Object.assign(res,r);
  await browser.close();
  console.log("ribbons beside the site: "+r.ribbons.map(q=>q.kind+(q.name?" ("+q.name+")":"")+" "+q.fromSiteM+" m, drawn "+q.drawnWidthM+" m wide, free "+q.freeM+" m").join("; "));
  r.sizes.forEach(q=>console.log("size "+q.size+" ("+q.quadrangleM.join(" by ")+" m): nearest clear on its side "+(q.nearestClearOnItsSide?q.nearestClearOnItsSide.offM+" m":"none within 8 units")+"; covering its site "+(q.nearestClearCovering?q.nearestClearCovering.offM+" m":"none")));
  console.log("8G's size anywhere within 8 units: "+JSON.stringify(r.size1AnywhereWithin8));
  console.log("drawn: "+JSON.stringify(r.drawn)+"; Sokolnitz's farmsteads "+JSON.stringify(r.sokolnitzFarmsteads));
  console.log("the III Column within 150 m of the castle's site: "+JSON.stringify(r.thirdColumn.within150m)+"; nearest "+Math.min.apply(null,r.thirdColumn.every10min.filter(q=>q.m!=null).map(q=>q.m))+" m");
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
