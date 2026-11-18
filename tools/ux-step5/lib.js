/* UI/UX roadmap step 5 (docs/UX_ART_AUDIT.md UA-08, Direction B on the paper map): the step's shared measures. Pages opened by the step-4 opener
   (tools/ux-step4/lib.js: three.js from the local copy checked against the page's integrity, ?harness=1, the harness's measure.js injected,
   transitions stilled). The paper map entered as the harness's paper cases enter it (window.__aus.apply with paper:"frame", t 570, Study), or on a
   phone by its taps (the Menu, Layers, Paper map, the panel closed: harness.js phone:"paper", decision 238). plate() reads the plate as drawn with the
   live block's own reader (tools/visual/ux5.js plateRead: north and the field's edges on screen, what the audit called the sheet's tilt; the scale;
   the free rectangle the field is framed in and the field's box against it; each counter's box against the neatline, else the free rectangle; the
   twelve villages by layer place or base lettering; the plate's own elements where a build has them). Measurement only: nothing here is a build's. */
"use strict";
const path=require("path");
const L4=require("../ux-step4/lib.js");
/* the twelve villages and the plate's reader: the live block's own (tools/visual/ux5.js), so that the step's tools and its block measure alike */
const UX5=require(path.join(L4.ROOT,"tools","visual","ux5.js")), TWELVE=UX5.TWELVE;
async function enterPaper(p,o){ o=o||{};
  if(p.__phone){ await p.evaluate(()=>{ try{ closeFirst(null); }catch(e){} }); await L4.settle(p,10);
    const tap=async q=>{ await p.tap(q,{timeout:60000}); await L4.settle(p,6); };
    await tap("#menubtn"); await tap("#layersbtn"); await tap('.mode-btn[data-m="staff"]'); await tap("#layerclose"); if(o.t!==undefined){ await p.evaluate(t=>setClock(t,{instant:true,force:true,camera:false}),o.t); } await L4.settle(p,20); return; }
  await p.evaluate(s=>window.__aus.apply(s),Object.assign({viewport:o.vp,t:o.t===undefined?570:o.t,presentation:o.presentation||"study",mode:"staff",paper:"frame",cam:[-27,272,41,-27,0,9]},o.spec||{}));
  await L4.settle(p,20); }
/* in the page: the plate as drawn (ux5.js plateRead), with the layer's drawn items by kind */
async function plate(p){ const r=await p.evaluate(UX5.plateRead,TWELVE);
  r.byCat=await p.evaluate(()=>{ const o={}; for(const k in ML.items){ const it=ML.items[k]; if(it.eFrame===ML.frame&&it.state==="on") o[it.cat]=(o[it.cat]||0)+1; } return o; });
  r.cartBox=r.cartouche; return r; }
/* the canvas's colour at screen points, from a screenshot with every interface element and the map layer hidden (the drawn map alone) */
async function canvasAt(p,pts){
  await p.evaluate(()=>{ var s=document.createElement("style"); s.id="__u5hide"; s.textContent="body>*:not(#stage):not(script){visibility:hidden!important} #maplayer{visibility:hidden!important}"; document.head.appendChild(s); });
  const b64=(await p.screenshot()).toString("base64");
  await p.evaluate(()=>{ var s=document.getElementById("__u5hide"); if(s) s.remove(); });
  return p.evaluate(([b64,pts])=>new Promise(res=>{ var im=new Image(); im.onload=function(){ var cv=document.createElement("canvas"); cv.width=im.width; cv.height=im.height; var x=cv.getContext("2d",{willReadFrequently:true}); x.drawImage(im,0,0);
    res(pts.map(function(q){ var d=x.getImageData(Math.round(q[0]*im.width/innerWidth),Math.round(q[1]*im.height/innerHeight),1,1).data; return [d[0],d[1],d[2]]; })); }; im.src="data:image/png;base64,"+b64; }),[b64,pts]);
}
module.exports=Object.assign({},L4,{TWELVE, enterPaper, plate, canvasAt, UX5});
