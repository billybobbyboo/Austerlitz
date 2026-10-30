#!/usr/bin/env node
/* Stage 8, implementation PR 8H (decision 255 (d); docs/STAGE8_SPEC.md section 20.9): the far battle information's hierarchy prototype
   (tools/stage8/protos/farnames.js) measured, for review. In each view (Part A's low views, the wall of formation names among them,
   horizon-east its test; tools/stage8/views.js), on a page opened as the harness opens it: as built and with each variant, the view laid out as
   the harness lays it out; for every drawn formation name its distance ratio (the eye's to the name over the eye's to its target), whether it
   is far (over MLS.FAR), its size, and its contrast as rendered (measure.js textContrast's method: the 10th percentile of the ground around the
   ink, on the frame captured); the frame's map text at AA (every map text, the harness's measure); the layer's pass (the median of five,
   measure.js's); and a capture of each. A sheet per view, the variants side by side.
   node tools/stage8/far-8h.js [--html build] [--views horizon-east,...] [--variants none,d-plate,d-ink,d-both] [--out dir]
   Measurement and prototype code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), V=require("./views.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const HTML=path.resolve(opt("--html")||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=path.resolve(opt("--out")||path.join(L.EVID8,"8h","far"));
const VIEWS=(opt("--views")||"horizon-east,pratzen-low,inf-front,ph8-overview-watch").split(","), VARS=(opt("--variants")||"none,d-plate,d-ink,d-both").split(",");
const PROTO=fs.readFileSync(path.join(__dirname,"protos","farnames.js"),"utf8");
const md5=f=>require("crypto").createHash("md5").update(fs.readFileSync(f)).digest("hex");
/* in the page: every drawn formation name's ratio, far flag, size, box and ink, and the pass's median time */
const NAMES=function(){ var dt=landCam.position.distanceTo(orbitTarget), out=[];
  for(var k in ML.items){ var it=ML.items[k]; if(k.indexOf("n:")!==0||it.state!=="on"||!it.el) continue;
    var r=it.el.getBoundingClientRect(), cs=getComputedStyle(it.el);
    out.push({id:k, ratio:+(camera.position.distanceTo(it.world)/dt).toFixed(2), far:camera.position.distanceTo(it.world)/dt>MLS.FAR, px:parseFloat(cs.fontSize),
      bx:[r.left,r.top,r.right,r.bottom], color:cs.color, bg:cs.backgroundColor}); }
  var t=[]; for(var i=0;i<5;i++){ var a=performance.now(); mlLayout(); t.push(performance.now()-a); } t.sort(function(x,y){ return x-y; });
  return {names:out, passMs:+t[2].toFixed(3)}; };
/* in the page: the contrast as rendered of each name's words on the captured frame, measure.js textContrast's method, per name */
const CONTRAST=function(a){ return new Promise(function(res){ var im=new Image(); im.onload=function(){
  var cv=document.createElement("canvas"); cv.width=im.width; cv.height=im.height; var x=cv.getContext("2d",{willReadFrequently:true}); x.drawImage(im,0,0); var d=x.getImageData(0,0,cv.width,cv.height).data;
  function lin(v){ v/=255; return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4); } function Lum(c){ return 0.2126*lin(c[0])+0.7152*lin(c[1])+0.0722*lin(c[2]); }
  res(a.names.map(function(t){ var m=/rgba?\(([^)]+)\)/.exec(t.color); if(!m) return null; var ink=m[1].split(",").map(parseFloat);
    var x0=Math.max(0,Math.ceil(t.bx[0])), y0=Math.max(0,Math.ceil(t.bx[1])), x1=Math.min(cv.width,Math.floor(t.bx[2])), y1=Math.min(cv.height,Math.floor(t.bx[3])), w=x1-x0, h=y1-y0; if(w<2||h<2) return null;
    var px=[], dist=[], mx=0, i, j; for(j=0;j<h;j++) for(i=0;i<w;i++){ var o=((y0+j)*cv.width+x0+i)*4, q=[d[o],d[o+1],d[o+2]], dd=Math.hypot(q[0]-ink[0],q[1]-ink[1],q[2]-ink[2]); px.push(q); dist.push(dd); if(dd>mx) mx=dd; }
    var near=new Uint8Array(w*h); for(j=0;j<h;j++) for(i=0;i<w;i++) if(dist[j*w+i]<0.5*mx) for(var b2=-1;b2<=1;b2++) for(var a2=-1;a2<=1;a2++){ var ii=i+a2, jj=j+b2; if(ii>=0&&jj>=0&&ii<w&&jj<h) near[jj*w+ii]=1; }
    var li=Lum(ink), cs=[]; for(var k=0;k<px.length;k++){ if(dist[k]<0.5*mx||near[k]) continue; var lq=Lum(px[k]); cs.push((Math.max(li,lq)+0.05)/(Math.min(li,lq)+0.05)); }
    if(!cs.length) return null; cs.sort(function(p,q){ return p-q; }); return {id:t.id, far:t.far, ratio:t.ratio, px:t.px, contrast:+cs[Math.floor(cs.length*0.10)].toFixed(2)}; })); };
  im.src="data:image/png;base64,"+a.b64; }); };
(async()=>{
  fs.mkdirSync(OUT,{recursive:true});
  process.env.AUSTERLITZ_HTML=HTML;
  const browser=await L.launch(), res={tool:"tools/stage8/far-8h.js", build:path.basename(HTML), md5:md5(HTML), chromium:browser.version(), views:{}};
  for(const vn of VIEWS){ const v=V[vn]; if(!v) throw new Error("no view "+vn);
    const page=await L.open(browser,v.viewport); await page.evaluate(PROTO);
    const R=res.views[vn]={}, tiles=[];
    for(const vr of VARS){
      await L.applyCase(page,v);
      await page.evaluate(x=>{ if(x==="none") window.__p8h.farnames.uninstall(); else window.__p8h.farnames.install(x); AUSTERLITZ_DEBUG.settle(4); },vr);
      const a=await page.evaluate(NAMES), png=await L.png(page), b64=png.toString("base64");
      const tc=await page.evaluate(b=>window.__aus.textContrast(b),b64), per=(await page.evaluate(CONTRAST,{names:a.names,b64:b64})).filter(Boolean);
      const far=per.filter(p=>p.far), near=per.filter(p=>!p.far), mn=xs=>xs.length?Math.min(...xs.map(p=>p.contrast)):null, md=xs=>{ if(!xs.length) return null; const s=xs.map(p=>p.contrast).sort((p,q)=>p-q); return s[Math.floor(s.length/2)]; };
      R[vr]={names:a.names.length, far:far.length, near:near.length, farMin:mn(far), farMedian:md(far), nearMin:mn(near), nearMedian:md(near), minPx:a.names.length?Math.min(...a.names.map(n=>n.px)):null,
        mapTextMin:tc.min, mapTextBelowAA:tc.belowAA.length, belowAA:tc.belowAA.slice(0,6), passMs:a.passMs, stats:await page.evaluate(()=>window.__p8h.farnames.stats())};
      fs.writeFileSync(path.join(OUT,vn+"-"+vr+".jpg"),await L.jpeg(page,null,86));
      tiles.push({png:png, cap:vn+", "+vr+": "+far.length+" far names, contrast "+(R[vr].farMin==null?"-":R[vr].farMin+" (min) / "+R[vr].farMedian+" (median)")+", map text below AA "+R[vr].mapTextBelowAA});
      console.log(vn+" "+vr+" "+JSON.stringify(R[vr]));
    }
    await page.evaluate(()=>window.__p8h.farnames.uninstall());
    await L.sheet(page,tiles,2,800,450,"decision 255 (d), a prototype: far formation names, "+vn,path.join(OUT,vn+"-sheet.jpg"),true);
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT,"far-8h.json"),JSON.stringify(res,null,1));
})().catch(e=>{ console.error(e); process.exit(1); });
