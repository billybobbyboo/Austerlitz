#!/usr/bin/env node
/* Stage 2C evidence: the movement arrows as built (not a probe). The Allied notched chevron and the French plain triangle
   on the landscape and on the paper map, each also in greyscale (luminance), at the Overview vantage and in close views
   (phase 4, 10:00: the northern advance and the Pratzeberg; phase 8, 15:30: the retreat over the ponds); and the arrows
   draped on the drawn ground at 1x, 4x and 10.33x in a low view. Measures every head on screen (width, length and, for a
   chevron, the notch depth, in pixels) from the head meshes' own tip, base and notch.
   node tools/stage2/arrows-2c.js [outdir] [--sheets docsdir]   (writes 2c-heads.jpg, 2c-drape.jpg and arrows-2c.json) */
const fs=require("fs"), path=require("path"), P=require("./page.js");
const args=process.argv.slice(2), out=path.resolve(args[0]&&!args[0].startsWith("--")?args[0]:path.join(__dirname,"out","arrows-2c"));
fs.mkdirSync(out,{recursive:true});
const si=args.indexOf("--sheets"), sheets=si>=0?path.resolve(args[si+1]):null;
const GREY=`window.__grey=async function(b64){
  var im=await new Promise(function(r){ var i=new Image(); i.onload=function(){ r(i); }; i.src="data:image/png;base64,"+b64; });
  var cv=document.createElement("canvas"); cv.width=im.width; cv.height=im.height; var x=cv.getContext("2d"); x.drawImage(im,0,0);
  var d=x.getImageData(0,0,cv.width,cv.height), a=d.data, T=new Float32Array(256);
  for(var k=0;k<256;k++){ var v=k/255; T[k]=v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4); }
  for(var i=0;i<a.length;i+=4){ var Y=0.2126*T[a[i]]+0.7152*T[a[i+1]]+0.0722*T[a[i+2]];
    var e=Math.round(255*(Y<=0.0031308?12.92*Y:1.055*Math.pow(Y,1/2.4)-0.055)); a[i]=a[i+1]=a[i+2]=e; }
  x.putImageData(d,0,0); return cv.toDataURL("image/png").split(",")[1];
};
window.__heads=function(){
  camera.updateMatrixWorld(true);
  function scr(p){ var v=new THREE.Vector3(p[0],groundY(p[0],p[1])+2.4,p[1]).project(camera); return [(v.x*0.5+0.5)*innerWidth,(-v.y*0.5+0.5)*innerHeight,v.z]; }
  var out=[];
  curOv.traverse(function(o){ var u=o.userData; if(!u.drape||u.drape.kind!=="head"||!u.side) return;
    var t=scr(u.tip), l=scr(u.base[0]), r=scr(u.base[1]), c=[(l[0]+r[0])/2,(l[1]+r[1])/2];
    var on=[t,l,r].every(function(q){ return q[2]<1&&q[0]>0&&q[0]<innerWidth&&q[1]>0&&q[1]<innerHeight-190; });
    var n=u.notch?scr(u.notch):null;
    out.push({side:u.side,head:u.head,onScreen:on,widthPx:+Math.hypot(l[0]-r[0],l[1]-r[1]).toFixed(1),lengthPx:+Math.hypot(t[0]-c[0],t[1]-c[1]).toFixed(1),
      notchPx:n?+Math.hypot(n[0]-c[0],n[1]-c[1]).toFixed(1):0}); });
  return out;
};`;
const HEADS=[
  {name:"overview-ph4",vant:"plan",t:600},
  {name:"overview-ph8",vant:"plan",t:930},
  {name:"close-ph4",cam:[-35,100,-25,-35,0,-62],t:600},
  {name:"close-ph8",cam:[-39,110,115,-39,0,75],t:930}
];
const LOW={name:"low-ph7",cam:[-5,34,40,-22,0,20],t:820};
(async()=>{
  const b=await P.launch(), page=await P.open(b,[1600,900]); await page.evaluate(GREY);
  const res={heads:{},drape:{}}, tiles=[], dtiles=[];
  for(const mode of ["terrain","staff"]) for(const v of HEADS){
    const cam=v.cam||await page.evaluate(k=>VANTAGE[k],v.vant);
    await P.applyCase(page,{t:v.t,presentation:"watch",mode,cam});
    const png=await page.screenshot({timeout:300000}), grey=Buffer.from(await page.evaluate(s=>__grey(s),png.toString("base64")),"base64");
    const tag=(mode==="staff"?"paper":"landscape")+"-"+v.name, h=await page.evaluate(()=>__heads());
    fs.writeFileSync(path.join(out,tag+".png"),png); fs.writeFileSync(path.join(out,tag+"-grey.png"),grey);
    res.heads[tag]=h;
    const on=h.filter(q=>q.onScreen), al=on.filter(q=>q.side==="al"), fr=on.filter(q=>q.side==="fr");
    const rng=(a,k)=>a.length?Math.min(...a.map(q=>q[k])).toFixed(1)+"-"+Math.max(...a.map(q=>q[k])).toFixed(1):"-";
    console.log(tag.padEnd(26)+"on screen: "+al.length+" Allied (width "+rng(al,"widthPx")+" px, notch "+rng(al,"notchPx")+" px), "+fr.length+" French (width "+rng(fr,"widthPx")+" px)");
    tiles.push({png,cap:tag},{png:grey,cap:tag+", greyscale"});
  }
  for(const f of [1,4,"model"]){
    await P.applyCase(page,{t:LOW.t,presentation:"watch",mode:"terrain",cam:LOW.cam,factor:f});
    const png=await page.screenshot({timeout:300000}), tag=LOW.name+"-"+(f==="model"?"10.33":f);
    fs.writeFileSync(path.join(out,tag+".png"),png); dtiles.push({png,cap:tag+"x: phase 7, 13:40"});
  }
  fs.writeFileSync(path.join(out,"arrows-2c.json"),JSON.stringify(res,null,1));
  if(sheets){ fs.mkdirSync(sheets,{recursive:true});
    fs.writeFileSync(path.join(sheets,"2c-heads.jpg"),await P.sheet(page,tiles,4,800,450,"Stage 2C heads: Allied notched chevron, French plain triangle; landscape and paper, colour and greyscale"));
    fs.writeFileSync(path.join(sheets,"2c-drape.jpg"),await P.sheet(page,dtiles,3,800,450,"Stage 2C: arrows, lines and boundaries draped on the drawn ground at 1x, 4x, 10.33x"));
    fs.writeFileSync(path.join(sheets,"arrows-2c.json"),JSON.stringify(res,null,1)); }
  if(page._errors.length) console.log("page errors: "+page._errors.join(" | "));
  await b.close();
})();
