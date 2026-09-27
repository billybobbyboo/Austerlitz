#!/usr/bin/env node
/* Stage 2 Part A, sections E and H.
   E. Every in-scene text and symbol element in each harness view, MEASURED from the projected sprites:
      - an init script records every fillText on every canvas (text, font size in canvas pixels through the
        canvas transform, fill colour, the run's box), so each sprite's text runs are known from its own texture;
      - each sprite is projected with the live camera (the harness's formula): on-screen text size =
        canvas font pixels x (sprite's screen height / canvas height);
      - contrast is read from the rendered frame: in the run's screen box (plus 2 px), the pixels far from the ink
        (at least half the largest RGB distance from it) are the text's rendered surround (halo, plate or ground);
        the ink is the recorded fill at the sprite's opacity over that surround; the reported contrast is the
        10th percentile over the surround pixels (90% of the surround is at least this far from the ink).
      Floors (owner decision 16): 12 px for battle information (counter name, strength, status; formation names;
      overlay (movement) labels; event labels; the plateau statistic); 10.5 px for tertiary text (designation,
      echelon, nation tag, badges, place and terrain-study labels, objective names). WCAG AA: 4.5:1 below 18 px
      (14 px bold), else 3:1.
   H. The unobstructed map fraction: the share of the viewport not covered by the union of the fixed interface
      panels (the harness's panel list), per harness view, at the case's viewport and at 1280 x 720.
   node tools/stage2/map-text.js <outdir>   (writes map-text.json and prints a summary) */
const fs=require("fs"), path=require("path"), P=require("./page.js");
/* it measures the Stage 0 canvas path (its sprites), on builds up to Stage 2C (archive/stage2c-68ac7721.html); from Stage 2D
   the harness (tools/visual/measure.js) measures the map layer */
async function canvasPath(page){ if(!await page.evaluate(()=>{ var k=Object.keys(units)[0]; return !!(k&&units[k].sprite); })){
  console.error("this build has no canvas labels (Stage 2D or later): run it on archive/stage2c-68ac7721.html (AUSTERLITZ_HTML)"); process.exit(2); } }
const out=path.resolve(process.argv[2]||path.join(__dirname,"out","text")); fs.mkdirSync(out,{recursive:true});
const INIT=`(function(){
  var C=CanvasRenderingContext2D.prototype, ft=C.fillText;
  C.fillText=function(t,x,y,mw){
    try{ var cv=this.canvas, m=this.getTransform(), px=parseFloat((/(\\d+(\\.\\d+)?)px/.exec(this.font)||[0,10])[1]), wt=(/^(\\d{3})\\b/.exec(this.font)||[0,"400"])[1];
      var w=this.measureText(String(t)).width; if(mw&&w>mw) w=mw;
      var al=this.textAlign, x0=al==="center"?x-w/2:(al==="right"||al==="end")?x-w:x;
      var bl=this.textBaseline, y0=bl==="middle"?y-0.5*px:bl==="top"?y:y-0.78*px, y1=y0+px;
      var sx=Math.hypot(m.a,m.b);
      (cv.__runs=cv.__runs||[]).push({t:String(t),px:px*sx,w:wt,fill:String(this.fillStyle),alpha:this.globalAlpha,
        box:[m.a*x0+m.c*y0+m.e, m.b*x0+m.d*y0+m.f, m.a*(x0+w)+m.c*y1+m.e, m.b*(x0+w)+m.d*y1+m.f]}); }catch(e){}
    return ft.apply(this,arguments);
  };
})();`;
const COLLECT=`(function(){
  function vis(o){ while(o){ if(!o.visible) return false; o=o.parent; } return true; }
  var L=[];
  function add(sp,cat,id){ if(sp&&vis(sp)&&sp.material&&sp.material.opacity>0.05) L.push({sp:sp,cat:cat,id:String(id)}); }
  Object.keys(units).forEach(function(k){ add(units[k].sprite,"counter",k); add(units[k].nameLabel,"name",k); });
  Object.keys(aggregates).forEach(function(k){ add(aggregates[k].sprite,"counter",k); });
  (eventMarks||[]).forEach(function(m){ add(m.ls,"event",m.e.id); if(m.g) add(m.g,"eventGlyph",m.e.id); });
  if(plateauLabel) add(plateauLabel,"plateau","plateau");
  (overlayLabels||[]).forEach(function(s,i){ add(s,"overlay",i); });
  if(overlayRoot) overlayRoot.traverse(function(o){ if(o.isSprite&&overlayLabels.indexOf(o)<0) add(o,"objective","obj"); });
  (featureSprites||[]).forEach(function(o){ add(o.sprite,"place",o.ft.id); });
  (analysisSprites||[]).forEach(function(o){ add(o.sprite,"analysis",o.tl.n); });
  return L;
})()`;
const MEASURE_TEXT=`(function(){
  var L=${COLLECT}, cam=camera; cam.updateMatrixWorld(true);
  var W0=innerWidth, H0=innerHeight, rows=[];
  L.forEach(function(o){
    var sp=o.sp, p=sp.getWorldPosition(new THREE.Vector3()), v=p.clone().applyMatrix4(cam.matrixWorldInverse);
    if(v.z>-cam.near) return;
    var ndc=p.clone().project(cam); if(Math.abs(ndc.x)>1.02||Math.abs(ndc.y)>1.02) return;
    var ppw=H0/(2*(-v.z)*Math.tan(cam.fov*Math.PI/360)), sx=sp.scale.x*ppw, sy=sp.scale.y*ppw, cx=(ndc.x*0.5+0.5)*W0, cy=(-ndc.y*0.5+0.5)*H0;
    var cv=sp.material.map&&sp.material.map.image, runs=(cv&&cv.__runs)||[];
    var rec={cat:o.cat,id:o.id,op:+sp.material.opacity.toFixed(2),screen:[cx-sx/2,cy-sy/2,cx+sx/2,cy+sy/2].map(Math.round),hPx:+sy.toFixed(1),runs:[]};
    if(cv) runs.forEach(function(r){
      var k=sy/cv.height, kx=sx/cv.width;
      rec.runs.push({t:r.t.slice(0,40),px:+(r.px*k).toFixed(2),w:r.w,fill:r.fill,alpha:r.alpha,
        box:[cx-sx/2+r.box[0]*kx, cy-sy/2+r.box[1]*k, cx-sx/2+r.box[2]*kx, cy-sy/2+r.box[3]*k].map(function(q){ return Math.round(q); })});
    });
    rows.push(rec);
  });
  return rows;
})()`;
const PANELS=`(function(){
  var sel=[".rail",".dispatch",".legend",".timebar",".tools","#viewmode","#firstrun",".drawer","#tourbar","#selchip","#layerpop","#vsbadge"];
  var railHidden=document.body.classList.contains("rail-hidden"), R=[];
  sel.forEach(function(s){ document.querySelectorAll(s).forEach(function(e){
    var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||+cs.opacity<0.05||e.hidden) return;
    if((e.classList.contains("rail")&&railHidden)||(e.classList.contains("drawer")&&!e.classList.contains("on"))) return;
    var r=e.getBoundingClientRect(); if(r.width>0&&r.height>0) R.push({s:s,r:[r.left,r.top,r.right,r.bottom]}); }); });
  var G=4, nx=Math.ceil(innerWidth/G), ny=Math.ceil(innerHeight/G), free=0;
  for(var j=0;j<ny;j++) for(var i=0;i<nx;i++){ var x=i*G+G/2, y=j*G+G/2, cov=false;
    for(var k=0;k<R.length;k++){ var r=R[k].r; if(x>=r[0]&&x<r[2]&&y>=r[1]&&y<r[3]){ cov=true; break; } } if(!cov) free++; }
  return {viewport:[innerWidth,innerHeight], free:+(free/(nx*ny)).toFixed(4), panels:R.map(function(q){ return q.s; })};
})()`;
function hx(s){ s=s.trim(); if(s[0]==="#"){ const h=s.length===4?s.slice(1).split("").map(c=>c+c).join(""):s.slice(1,7); return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16)).concat([1]); }
  const m=/rgba?\(([^)]+)\)/.exec(s); if(m){ const p=m[1].split(",").map(parseFloat); return [p[0],p[1],p[2],p.length>3?p[3]:1]; } return null; }
const lin=v=>{ v/=255; return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4); };
const Lum=c=>0.2126*lin(c[0])+0.7152*lin(c[1])+0.0722*lin(c[2]);
const ratio=(a,b)=>{ const x=Lum(a),y=Lum(b); return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05); };
function floorOf(cat,run){
  if(cat==="counter"){ if(/^≈/.test(run.t)||run.px>0&&run.role==="name"||run.role==="status") return 12;
    return 10.5; }
  if(["name","overlay","event","plateau"].includes(cat)) return 12;
  return 10.5;
}
(async()=>{
  const b=await P.launch(), res={cases:{},small:{}};
  const cases=P.CASES;
  let page=null, vpKey="";
  for(const c of cases){
    const key=c.viewport.join("x")+(c.fresh?":"+c.name:"");
    if(key!==vpKey||c.fresh){ if(page) await page.close(); page=await P.open(b,c.viewport,null,INIT); await canvasPath(page); vpKey=key; }
    if(!c.fresh) await P.applyCase(page,c); else await P.settle(page);
    const png=await page.screenshot({timeout:300000});
    const rows=await page.evaluate(MEASURE_TEXT);
    const panels=await page.evaluate(PANELS);
    /* the rendered surround of each run, from the frame */
    const stats=await page.evaluate(async([b64,rows])=>{
      const im=await new Promise(r=>{ const i=new Image(); i.onload=()=>r(i); i.src="data:image/png;base64,"+b64; });
      const cv=document.createElement("canvas"); cv.width=im.width; cv.height=im.height; const x=cv.getContext("2d"); x.drawImage(im,0,0);
      const d=x.getImageData(0,0,cv.width,cv.height).data;
      return rows.map(r=>r.runs.map(u=>{
        const x0=Math.max(0,u.box[0]-2), y0=Math.max(0,u.box[1]-2), x1=Math.min(cv.width-1,u.box[2]+2), y1=Math.min(cv.height-1,u.box[3]+2);
        const px=[]; for(let yy=y0;yy<=y1;yy++) for(let xx=x0;xx<=x1;xx++){ const o=(yy*cv.width+xx)*4; px.push([d[o],d[o+1],d[o+2]]); }
        return px.length?px:null; }));
    },[png.toString("base64"),rows]);
    rows.forEach((r,i)=>r.runs.forEach((u,j)=>{
      const ink=hx(u.fill), pix=stats[i][j];
      if(!ink||!pix){ u.contrast=null; return; }
      const dist=q=>Math.hypot(q[0]-ink[0],q[1]-ink[1],q[2]-ink[2]), mx=Math.max(...pix.map(dist));
      const sur=pix.filter(q=>dist(q)>=0.5*mx); if(!sur.length){ u.contrast=null; return; }
      const a=ink[3]*(u.alpha==null?1:u.alpha)*r.op;
      const cs=sur.map(q=>{ const i2=[0,1,2].map(k=>ink[k]*a+q[k]*(1-a)); return ratio(i2,q); }).sort((p,q)=>p-q);
      u.contrast=+cs[Math.floor(cs.length*0.10)].toFixed(2);
    }));
    /* roles within a counter: the name is the only run at its weight 500 or the one below the frame; the status sits on the plate */
    rows.filter(r=>r.cat==="counter").forEach(r=>{ const f=r.runs; if(!f.length) return;
      const byY=f.slice().sort((p,q)=>p.box[1]-q.box[1]); byY[byY.length-1].role="status"; if(byY.length>1) byY[byY.length-2].role="name"; });
    let n=0, below=0, belowAA=0; const perCat={};
    rows.forEach(r=>{ const C=perCat[r.cat]=perCat[r.cat]||{elements:0,runs:0,minPx:99,maxPx:0,belowFloor:0,belowAA:0,minContrast:99};
      C.elements++;
      r.runs.forEach(u=>{ if(/^[\s·]*$/.test(u.t)) return; n++; C.runs++; const fl=floorOf(r.cat,u); u.floor=fl;
        C.minPx=Math.min(C.minPx,u.px); C.maxPx=Math.max(C.maxPx,u.px);
        if(u.px<fl){ below++; C.belowFloor++; }
        const need=(u.px>=18||(u.px>=14&&+u.w>=600))?3:4.5;
        if(u.contrast!=null){ C.minContrast=Math.min(C.minContrast,u.contrast); if(u.contrast<need){ belowAA++; C.belowAA++; } } }); });
    res.cases[c.name]={viewport:c.viewport,elements:rows.length,runs:n,belowFloor:below,belowAA:belowAA,perCat,unobstructed:panels,rows};
    console.log(c.name.padEnd(20),"elements",rows.length,"runs",n,"below floor",below,"below AA",belowAA,"unobstructed",panels.free,
      JSON.stringify(Object.fromEntries(Object.entries(perCat).map(([k,v])=>[k,v.runs+" runs "+v.minPx.toFixed(1)+"-"+v.maxPx.toFixed(1)+"px, <floor "+v.belowFloor+", <AA "+v.belowAA+", min "+(v.minContrast===99?"-":v.minContrast.toFixed(2))]))));
  }
  if(page) await page.close();
  /* H at 1280 x 720 */
  let sp=null;
  for(const c of cases){
    if(c.fresh){ const p2=await P.open(b,[1280,720]); await P.settle(p2); res.small[c.name]=await p2.evaluate(PANELS); await p2.close(); }
    else { if(!sp) sp=await P.open(b,[1280,720]); await P.applyCase(sp,c); res.small[c.name]=await sp.evaluate(PANELS); }
    console.log("1280x720",c.name.padEnd(20),res.small[c.name].free);
  }
  fs.writeFileSync(path.join(out,"map-text.json"),JSON.stringify(res,null,1));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(2); });
