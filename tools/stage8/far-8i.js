#!/usr/bin/env node
/* Stage 8, the follow-up 8I (decision 263 (a); docs/STAGE8_SPEC.md section 21): the far names' lighter plate as built (app.js mlFarPlate,
   TOKENS.sym.plate.far), measured on the production build against 8H's (which draws every name on the full plate), in matched views: the views
   check:visual's farPlate block renders (tools/visual/thresholds.js FAR_PLATE_VIEWS: Part A's wall of formation names at 09:00, 12:00 and 15:00,
   the infantry's front, the low Pratzen view, the valley fog's two hours, the phase-8 Overview; a far name selected, one focused, Napoleon's
   reading, held landscape at 844 x 390, the landscape with counters), each on a page opened as the harness opens it. Per view and build: every
   drawn formation name's plate, distance ratio, protection, size and contrast as rendered (tools/visual/measure.js farNames: the 10th percentile
   of the ground round its ink on the captured frame), every map text at AA (measure.js textContrast, the harness's measure), the layer's pass
   time (the median of nine), and a capture; a sheet per view, the two builds side by side. 8H's build has no far plate: its names are read with
   the same ratio test, so its "far" are the names 8I draws on the far plate.
   node tools/stage8/far-8i.js --before <8H build> [--after <build>] [--views tag,...] [--out dir]   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), T=require("../visual/thresholds.js"), CASES=require("../visual/cases.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const AFTER=path.resolve(opt("--after")||path.join(L.ROOT,"austerlitz-command-map.html")), BEFORE=opt("--before")?path.resolve(opt("--before")):null;
const OUT=path.resolve(opt("--out")||path.join(L.EVID8,"8i","far")), ONLY=opt("--views")?opt("--views").split(","):null;
const md5=f=>require("crypto").createHash("md5").update(fs.readFileSync(f)).digest("hex");
const slug=s=>s.replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"").toLowerCase();
/* 8H's names read with 8I's test (no plate there) */
const NAMES_8H=function(){ var dT=landCam.position.distanceTo(orbitTarget), foc=document.activeElement, N=[];
  for(var k in ML.items){ var it=ML.items[k]; if(k.indexOf("n:")!==0||it.eFrame!==ML.frame||it.state!=="on"||!it.el) continue;
    var r=it.el.getBoundingClientRect(), cs=getComputedStyle(it.el), ratio=camera.position.distanceTo(it.world)/dT, prot=!!(it.keep||it.forced||it.el===foc);
    N.push({id:k, plate:(!prot&&ratio>MLS.FAR)?"far (8I's test)":"full", ratio:+ratio.toFixed(3), prot:prot, px:parseFloat(cs.fontSize), bx:[r.left,r.top,r.right,r.bottom], color:cs.color}); }
  return N; };
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});
  const builds=[["8i",AFTER]].concat(BEFORE?[["8h",BEFORE]]:[]), browser=await L.launch();
  const res={tool:"tools/stage8/far-8i.js", builds:builds.map(b=>({tag:b[0], file:path.basename(b[1]), md5:md5(b[1])})), chromium:browser.version(), views:{}};
  const VIEWS=T.FAR_PLATE_VIEWS.filter(v=>!ONLY||ONLY.indexOf(slug(v[0]))>=0);
  for(const [tag,view,over,state,sz] of VIEWS){ const R=res.views[tag]={}, tiles=[];
    for(const [bt,html] of builds){
      process.env.AUSTERLITZ_HTML=html;
      const page=await L.open(browser,sz?[sz[0],sz[1]]:[1600,900]);
      const base=typeof view==="string"?JSON.parse(JSON.stringify(CASES.find(x=>x.name===view))):JSON.parse(JSON.stringify(view)), spec=Object.assign(base,over||{}); delete spec.viewport;
      await page.evaluate(s=>{ closeFirst(null); if(playing) stopPlay(); select(null,null); setCommandView("none"); window.__aus.apply(s); AUSTERLITZ_DEBUG.settle(6,true); },spec);
      let target=null;
      if(state==="select"||state==="focus") target=await page.evaluate(st=>{ mlLayout(); var dT=landCam.position.distanceTo(orbitTarget), id=null;
          for(var k in ML.items){ var it=ML.items[k]; if(k.indexOf("n:")===0&&it.eFrame===ML.frame&&it.state==="on"&&camera.position.distanceTo(it.world)/dT>MLS.FAR){ id=k.slice(2); break; } }
          if(!id) return {id:null}; if(st==="select") select("f",id); else { var e=ML.items["n:"+id].el; if(e&&e.focus) e.focus(); }
          AUSTERLITZ_DEBUG.settle(3,true); mlLayout(); return {id:id}; },state);
      if(state==="reading") await page.evaluate(()=>{ setCommandView("fr"); AUSTERLITZ_DEBUG.settle(3,true); });
      const png=await L.png(page), b64=png.toString("base64");
      let N=await page.evaluate(b=>window.__aus.farNames(b),b64);
      if(N) N=N.names; else { const raw=await page.evaluate(NAMES_8H); N=await page.evaluate(a=>new Promise(res=>{ const im=new Image(); im.onload=()=>{ const cv=document.createElement("canvas"); cv.width=im.width; cv.height=im.height;
        const x=cv.getContext("2d",{willReadFrequently:true}); x.drawImage(im,0,0); const d=x.getImageData(0,0,cv.width,cv.height).data; const lin=v=>{ v/=255; return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4); }, Lm=c=>0.2126*lin(c[0])+0.7152*lin(c[1])+0.0722*lin(c[2]);
        res(a.N.map(t=>{ const m=/rgba?\(([^)]+)\)/.exec(t.color); const o2=Object.assign({},t); delete o2.bx; delete o2.color; o2.contrast=null; if(!m) return o2; const ink=m[1].split(",").map(parseFloat);
          const x0=Math.max(0,Math.ceil(t.bx[0])), y0=Math.max(0,Math.ceil(t.bx[1])), x1=Math.min(cv.width,Math.floor(t.bx[2])), y1=Math.min(cv.height,Math.floor(t.bx[3])), w=x1-x0, h=y1-y0; if(w<2||h<2) return o2;
          const px=[], dist=[]; let mx=0; for(let j=0;j<h;j++) for(let i=0;i<w;i++){ const o=((y0+j)*cv.width+x0+i)*4, q=[d[o],d[o+1],d[o+2]], dd=Math.hypot(q[0]-ink[0],q[1]-ink[1],q[2]-ink[2]); px.push(q); dist.push(dd); if(dd>mx) mx=dd; }
          const near=new Uint8Array(w*h); for(let j=0;j<h;j++) for(let i=0;i<w;i++) if(dist[j*w+i]<0.5*mx) for(let b2=-1;b2<=1;b2++) for(let a2=-1;a2<=1;a2++){ const ii=i+a2, jj=j+b2; if(ii>=0&&jj>=0&&ii<w&&jj<h) near[jj*w+ii]=1; }
          const li=Lm(ink), cc=[]; for(let k=0;k<px.length;k++){ if(dist[k]<0.5*mx||near[k]) continue; const lq=Lm(px[k]); cc.push((Math.max(li,lq)+0.05)/(Math.min(li,lq)+0.05)); }
          if(cc.length){ cc.sort((p,q)=>p-q); o2.contrast=+cc[Math.floor(cc.length*0.10)].toFixed(2); } return o2; })); }; im.src="data:image/png;base64,"+a.b64; }),{N:raw,b64:b64}); }
      const tc=await page.evaluate(b=>window.__aus.textContrast(b),b64);
      const pass=await page.evaluate(()=>{ var t=[]; for(var i=0;i<9;i++){ var a=performance.now(); mlLayout(); t.push(performance.now()-a); } t.sort(function(x,y){ return x-y; }); return +t[4].toFixed(3); });
      const far=N.filter(n=>/^far/.test(n.plate)), near=N.filter(n=>!/^far/.test(n.plate)), mn=xs=>{ const c=xs.map(n=>n.contrast).filter(v=>v!=null); return c.length?Math.min(...c):null; },
        md=xs=>{ const c=xs.map(n=>n.contrast).filter(v=>v!=null).sort((p,q)=>p-q); return c.length?c[Math.floor(c.length/2)]:null; };
      R[bt]={names:N.length, far:far.length, farMin:mn(far), farMedian:md(far), nearMin:mn(near), nearMedian:md(near), sizes:[...new Set(N.map(n=>n.px))], mapTextMin:tc.min, mapTextBelowAA:tc.belowAA.length,
        belowAA:tc.belowAA.slice(0,6), passMs:pass, target:target, perName:N, pageErrors:(page._errors||[]).slice()};
      fs.writeFileSync(path.join(OUT,slug(tag)+"-"+bt+".jpg"),await L.jpeg(page,null,86));
      tiles.push({png:png, cap:bt+": "+tag+": "+N.length+" names, "+far.length+(bt==="8h"?" beyond the far test (full plate)":" on the far plate")+", as rendered "+(R[bt].farMin==null?"-":R[bt].farMin+" (min) / "+R[bt].farMedian+" (median)")+"; map text below AA "+tc.belowAA.length});
      console.log(tag+" ["+bt+"] "+JSON.stringify(Object.assign({},R[bt],{perName:undefined})));
      await page.close(); }
    if(tiles.length){ const sp=await browser.newPage({viewport:{width:1600,height:900}}); await L.sheet(sp,tiles,2,800,450,"8I (decision 263): far formation names, "+tag,path.join(OUT,slug(tag)+"-sheet.jpg"),true).catch(e=>console.log("sheet: "+e.message)); await sp.close(); }
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT,"far-8i.json"),JSON.stringify(res,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
