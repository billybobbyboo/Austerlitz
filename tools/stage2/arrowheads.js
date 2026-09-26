#!/usr/bin/env node
/* Stage 2 Part A, section D (owner decision 20): the Allied notched chevron against the French plain triangle.
   An in-page PROBE, not the 2C implementation: the phase's OVERLAYS arrows are drawn as ground-draped ribbons
   with the app's own planRibbon() (dark casing, side colour from TOKENS.sym.side; chevron = Allied), and the
   tube arrows are hidden. Views: the Overview vantage and a close view, on the landscape and on the paper map,
   at phase 5 (10:50: French and Allied attacks and counter-attacks on the Olmütz road) and phase 8 (15:30:
   Allied retreats, French attacks).
   Each render is also written in greyscale (luminance) and under protanopia, deuteranopia and tritanopia
   (Machado, Oliveira and Fernandes 2009, severity 1.0, applied in linear RGB).
   Measured per view: each head's projected width, length and notch depth in screen pixels.
   node tools/stage2/arrowheads.js <outdir> */
const fs=require("fs"), path=require("path"), P=require("./page.js");
const out=path.resolve(process.argv[2]||path.join(__dirname,"out","heads")); fs.mkdirSync(out,{recursive:true});
/* ribbon dimensions in world units: shaft 2.0 -> 2.6 wide, head 7.5 wide and 6.5 long, notch 0.38 of the head length (planRibbon) */
const DIM={w0:2.0,w1:2.6,hw:7.5,hl:6.5};
const PROBE=`window.__heads=function(ph,dim){
  if(typeof clearPlan==="function") clearPlan();
  planGroup=new THREE.Group(); scene.add(planGroup);
  overlayRoot.visible=false;
  var ov=OVERLAYS[ph], heads=[];
  (ov.arrows||[]).forEach(function(a){
    var S=TOKENS.sym.side[a.side];
    planRibbon(a.pts,hexNum(S.base),hexNum(S.edge),dim.w0,dim.w1,dim.hw,dim.hl,a.side==="al");
    var e=a.pts[a.pts.length-1], p=a.pts[a.pts.length-2]; heads.push({side:a.side,label:a.label,end:e,prev:p});
  });
  window.__headList=heads; requestRender(3); return heads.length;
};
window.__headPx=function(dim){
  camera.updateMatrixWorld(true);
  function scr(x,z){ var v=new THREE.Vector3(x,height(x,z)+1.9,z).project(camera); return [(v.x*0.5+0.5)*innerWidth,(-v.y*0.5+0.5)*innerHeight,v.z]; }
  return __headList.map(function(h){
    /* the curve's end tangent approximated by the last segment, in world units */
    var e=W(h.end[0],h.end[1]), p=W(h.prev[0],h.prev[1]), dx=e[0]-p[0], dz=e[1]-p[1], L=Math.hypot(dx,dz)||1; dx/=L; dz/=L;
    var nx=-dz, nz=dx, tip=scr(e[0]+dx*dim.hl,e[1]+dz*dim.hl), l=scr(e[0]+nx*dim.hw/2,e[1]+nz*dim.hw/2), r=scr(e[0]-nx*dim.hw/2,e[1]-nz*dim.hw/2),
        c=scr(e[0],e[1]), n=scr(e[0]-dx*dim.hl*0.38,e[1]-dz*dim.hl*0.38);
    var on=[tip,l,r].every(function(q){ return q[2]<1&&q[0]>0&&q[0]<innerWidth&&q[1]>0&&q[1]<innerHeight; });
    return {side:h.side,label:h.label,onScreen:on,cx:Math.round((tip[0]+c[0])/2),cy:Math.round((tip[1]+c[1])/2),widthPx:+Math.hypot(l[0]-r[0],l[1]-r[1]).toFixed(1),lengthPx:+Math.hypot(tip[0]-c[0],tip[1]-c[1]).toFixed(1),
      notchPx:h.side==="al"?+Math.hypot(n[0]-c[0],n[1]-c[1]).toFixed(1):0};
  });
};
window.__sim=async function(b64,kind){
  var M={protan:[0.152286,1.052583,-0.204868,0.114503,0.786281,0.099216,-0.003882,-0.048116,1.051998],
         deutan:[0.367322,0.860646,-0.227968,0.280085,0.672501,0.047413,-0.011820,0.042940,0.968881],
         tritan:[1.255528,-0.076749,-0.178779,-0.078411,0.930809,0.147602,0.004733,0.691367,0.303900]}[kind];
  var im=await new Promise(function(r){ var i=new Image(); i.onload=function(){ r(i); }; i.src="data:image/png;base64,"+b64; });
  var cv=document.createElement("canvas"); cv.width=im.width; cv.height=im.height; var x=cv.getContext("2d"); x.drawImage(im,0,0);
  var d=x.getImageData(0,0,cv.width,cv.height), a=d.data, lin=function(v){ v/=255; return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4); },
      enc=function(v){ v=Math.max(0,Math.min(1,v)); return Math.round(255*(v<=0.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-0.055)); };
  var T=new Float32Array(256); for(var k=0;k<256;k++) T[k]=lin(k);
  for(var i=0;i<a.length;i+=4){ var R=T[a[i]],G=T[a[i+1]],B=T[a[i+2]];
    if(kind==="grey"){ var Y=enc(0.2126*R+0.7152*G+0.0722*B); a[i]=a[i+1]=a[i+2]=Y; }
    else { a[i]=enc(M[0]*R+M[1]*G+M[2]*B); a[i+1]=enc(M[3]*R+M[4]*G+M[5]*B); a[i+2]=enc(M[6]*R+M[7]*G+M[8]*B); } }
  x.putImageData(d,0,0); return cv.toDataURL("image/png").split(",")[1];
};`;
const VIEWS=[
  {name:"overview",cam:"plan"},
  {name:"close-ph5",ph:5,aim:{map:[265,120],dir:[-0.35,0.8,0.5],r:70}},
  {name:"close-ph8",ph:8,aim:{map:[262,405],dir:[-0.35,0.8,0.5],r:75}}
];
const PHASE_T={5:650,8:930};
(async()=>{
  const b=await P.launch(), page=await P.open(b,[1600,900]); await page.evaluate(PROBE);
  const rows=[], tiles={};
  for(const mode of ["terrain","staff"]) for(const ph of [5,8]) for(const v of VIEWS){
    if(v.ph&&v.ph!==ph) continue;
    const spec={t:PHASE_T[ph],presentation:"watch",mode};
    if(v.cam) spec.cam=await page.evaluate(k=>VANTAGE[k],v.cam); else spec.aim=v.aim;
    await P.applyCase(page,spec);
    await page.evaluate(([ph,d])=>__heads(ph,d),[ph,DIM]); await P.settle(page);
    const png=await page.screenshot({timeout:300000}), base=mode+"-ph"+ph+"-"+v.name;
    fs.writeFileSync(path.join(out,base+".png"),png);
    const px=await page.evaluate(d=>__headPx(d),DIM);
    px.forEach(h=>rows.push(Object.assign({mode,ph,view:v.name},h)));
    const variants=[{cap:"normal",png}];
    for(const k of ["grey","protan","deutan","tritan"]){ const s=Buffer.from(await page.evaluate(([b,k])=>__sim(b,k),[png.toString("base64"),k]),"base64");
      fs.writeFileSync(path.join(out,base+"-"+k+".png"),s); variants.push({cap:k,png:s}); }
    tiles[base]=variants;
    console.log(base, JSON.stringify(px.filter(h=>h.onScreen).map(h=>h.side+" "+h.widthPx+"x"+h.lengthPx+(h.notchPx?" notch "+h.notchPx:""))));
  }
  fs.writeFileSync(path.join(out,"heads.json"),JSON.stringify({DIM,rows},null,1));
  /* crops: every on-screen head, 112 px square around its centre, normal and greyscale, drawn at 2x without smoothing */
  for(const mode of ["terrain","staff"]){
    const list=rows.filter(r=>r.mode===mode&&r.onScreen);
    const b64=await page.evaluate(async([list,imgs])=>{
      const load=s=>new Promise(r=>{ const i=new Image(); i.onload=()=>r(i); i.src="data:image/png;base64,"+s; });
      const Z=2, C=112, cv=document.createElement("canvas"), cols=list.length; cv.width=cols*C*Z; cv.height=2*C*Z+40; const x=cv.getContext("2d");
      x.fillStyle="#101418"; x.fillRect(0,0,cv.width,cv.height); x.imageSmoothingEnabled=false;
      for(let k=0;k<list.length;k++){ const h=list[k];
        for(let v=0;v<2;v++){ const im=await load(imgs[h.key+(v?"-grey":"")]);
          x.drawImage(im,h.cx-C/2,h.cy-C/2,C,C,k*C*Z,20+v*C*Z,C*Z,C*Z); }
        x.fillStyle="#E8E2D3"; x.font="12px sans-serif"; x.fillText((h.side==="al"?"Allied ":"French ")+h.view+" ph"+h.ph+" "+h.widthPx+"px",k*C*Z+4,14); }
      return cv.toDataURL("image/png").split(",")[1];
    },[list.map(r=>Object.assign({key:r.mode+"-ph"+r.ph+"-"+r.view},r)),Object.fromEntries([...new Set(list.map(r=>r.mode+"-ph"+r.ph+"-"+r.view))].flatMap(k=>[
      [k,fs.readFileSync(path.join(out,k+".png")).toString("base64")],[k+"-grey",fs.readFileSync(path.join(out,k+"-grey.png")).toString("base64")]]))]);
    fs.writeFileSync(path.join(out,"crops-"+mode+".png"),Buffer.from(b64,"base64"));
  }
  for(const [base,v] of Object.entries(tiles))
    fs.writeFileSync(path.join(out,"sheet-"+base+".jpg"),await P.sheet(page,v.map(t=>({png:t.png,cap:base+" · "+t.cap})),3,640,360,
      "Allied chevron / French triangle: "+base+" (normal, greyscale, protanopia / deuteranopia, tritanopia)"));
  if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(2); });
