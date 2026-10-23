#!/usr/bin/env node
/* Stage 8 Part A (docs/STAGE8_SPEC.md section 5): how much of the streams the build actually draws. In each view the streams' material is
   painted pure red and the banks' pure green (emissive, so the light does not matter), the frame drawn, and the red and green pixels counted
   (a pixel whose red or green channel exceeds the other two by more than 60); then the same with the two materials' depth test off, so that
   nothing hides them: the second count is what the ribbons would cover on the screen, the first what is drawn of them. Their ratio is the
   share of each ribbon the drawn ground (and anything else in front: figures, trees, houses) hides. The materials are restored after each view.
   node tools/stage8/stream-vis.js [--views a,b] [--json file]
   Measurement only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), VIEWS=require("./views.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const TOP={viewport:[1600,900], t:720, presentation:"watch", mode:"terrain", aim:{map:[206,380], dir:[0.05,0.99,0.1], r:28}};
const EXTRA={ "goldbach-top":TOP, "goldbach-top-1x":Object.assign({},TOP,{factor:1}), "goldbach-top-10x":Object.assign({},TOP,{factor:"model"}) };
const ONLY=(opt("--views")||"goldbach-top,goldbach-top-1x,goldbach-top-10x,overview-field,village-sokolnitz,village-telnitz,close-sokolnitz,stream-low,ice-high").split(","), JSONF=opt("--json");
(async()=>{
  const browser=await L.launch(), page=await L.open(browser,[1600,900]);
  const res={build:require("crypto").createHash("md5").update(fs.readFileSync(path.join(L.ROOT,"austerlitz-command-map.html"))).digest("hex"), views:{}};
  await page.evaluate(()=>{
    window.__sv={ count:function(b){ return new Promise(function(r){ var i=new Image(); i.onload=function(){ var c=document.createElement("canvas"); c.width=i.width; c.height=i.height;
        var x=c.getContext("2d",{willReadFrequently:true}); x.drawImage(i,0,0); var d=x.getImageData(0,0,i.width,i.height).data, red=0, green=0;
        for(var k=0;k<d.length;k+=4){ if(d[k]>d[k+1]+60&&d[k]>d[k+2]+60) red++; else if(d[k+1]>d[k]+60&&d[k+1]>d[k+2]+60) green++; } r({red:red,green:green}); }; i.src="data:image/png;base64,"+b; }); },
      paint:function(depth){ var keep=[]; world.water.forEach(function(o){ var k=o.userData.drape&&o.userData.drape.kind; if(k!=="stream"&&k!=="bank") return; var m=o.material;
          if(!m.userData.sv) m.userData.sv={c:m.color.clone(), e:m.emissive?m.emissive.clone():null, dt:m.depthTest};
          var col=k==="stream"?[1,0,0]:[0,1,0]; m.color.setRGB(col[0],col[1],col[2]); if(m.emissive) m.emissive.setRGB(col[0],col[1],col[2]); m.depthTest=depth; m.needsUpdate=true; });
        requestRender(3); },
      restore:function(){ world.water.forEach(function(o){ var m=o.material, s=m.userData.sv; if(!s) return; m.color.copy(s.c); if(s.e) m.emissive.copy(s.e); m.depthTest=s.dt; delete m.userData.sv; m.needsUpdate=true; }); requestRender(3); } };
  });
  for(const name of ONLY){
    const v=VIEWS[name]||EXTRA[name]; if(!v) throw new Error("no view "+name);
    await L.applyCase(page,v);
    if(v.focus) throw new Error("focus views are not supported here");
    const R=res.views[name]={};
    for(const depth of [true,false]){
      await page.evaluate(d=>window.__sv.paint(d),depth); await L.settle(page);
      const b=(await L.png(page)).toString("base64"), c=await page.evaluate(b=>window.__sv.count(b),b);
      R[depth?"drawn":"unhidden"]=c;
    }
    await page.evaluate(()=>window.__sv.restore()); await L.settle(page);
    R.streamShare=R.unhidden.red?+(R.drawn.red/R.unhidden.red).toFixed(3):null; R.bankShare=R.unhidden.green?+(R.drawn.green/R.unhidden.green).toFixed(3):null;
    console.log(name.padEnd(20),"stream drawn",R.drawn.red,"of",R.unhidden.red,"("+R.streamShare+")","banks drawn",R.drawn.green,"of",R.unhidden.green,"("+R.bankShare+")");
    if(JSONF){ fs.mkdirSync(path.dirname(JSONF),{recursive:true}); fs.writeFileSync(JSONF,JSON.stringify(res,null,1)); }
  }
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
