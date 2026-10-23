#!/usr/bin/env node
/* Stage 8 Part A (docs/STAGE8_SPEC.md section 5): how much of the streams, their banks and the roads the build actually draws (the three are
   ribbons draped by world.js's ribbon()). The app sets their visibility itself every frame, so the ribbons are found by their colour, not by
   hiding them: in each view the frame is taken as the build draws it (A); then with the streams' material painted pure magenta, the banks'
   pure cyan and the roads' (both their kinds) pure yellow (colour and emissive, so the light does not matter), as drawn (B); then painted and drawn double-sided with the depth test on (C: a ribbon facing away from the eye shows); then
   double-sided with the depth test off (D: nothing hides them). A pixel counts for a ribbon when it changed from A by more than 40 of 255 and
   is that ribbon's colour (magenta: red and blue each over green by more than 60; cyan: green and blue each over red by more than 60;
   yellow: red and green each over blue by more than 60). B is
   what is drawn of each ribbon, C what would be drawn if both faces were, D what the ribbon would cover if nothing hid it: D - C is what the
   drawn ground and everything in front hide. The materials are restored after each view, and the frame after it compared with A.
   node tools/stage8/stream-vis.js [--views a,b] [--json file]
   Measurement only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js"), VIEWS=require("./views.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const TOP={viewport:[1600,900], t:720, presentation:"watch", mode:"terrain", aim:{map:[206,380], dir:[0.05,0.99,0.1], r:28}};
const NOON={viewport:[1600,900], t:720, presentation:"watch", mode:"terrain", aim:{map:[206,380], dir:[-0.78,0.30,0.55], r:30}};
const EXTRA={ "goldbach-top":TOP, "goldbach-top-1x":Object.assign({},TOP,{factor:1}), "goldbach-top-10x":Object.assign({},TOP,{factor:"model"}),
  "goldbach-noon":NOON, "goldbach-noon-1x":Object.assign({},NOON,{factor:1}) };
const ONLY=(opt("--views")||"goldbach-top,goldbach-top-1x,goldbach-top-10x,goldbach-noon,goldbach-noon-1x,overview-field,village-sokolnitz,village-telnitz,close-sokolnitz,stream-low,pratzen-low").split(","), JSONF=opt("--json");
(async()=>{
  const browser=await L.launch(), page=await L.open(browser,[1600,900]);
  const res={build:require("crypto").createHash("md5").update(fs.readFileSync(path.join(L.ROOT,"austerlitz-command-map.html"))).digest("hex"), views:{}};
  const install=()=>page.evaluate(()=>{ if(window.__sv) return;
    var img=function(b){ return new Promise(function(r){ var i=new Image(); i.onload=function(){ var c=document.createElement("canvas"); c.width=i.width; c.height=i.height; var x=c.getContext("2d",{willReadFrequently:true}); x.drawImage(i,0,0); r(x.getImageData(0,0,i.width,i.height).data); }; i.src="data:image/png;base64,"+b; }); };
    window.__sv={
      count:function(a,b){ return Promise.all([img(a),img(b)]).then(function(I){ var A=I[0], B=I[1], st=0, bk=0, rd=0, ch=0;
        for(var k=0;k<A.length;k+=4){ var dd=Math.max(Math.abs(A[k]-B[k]),Math.abs(A[k+1]-B[k+1]),Math.abs(A[k+2]-B[k+2])); if(dd<=40) continue; ch++;
          var r=B[k], g=B[k+1], bl=B[k+2]; if(r>g+60&&bl>g+60) st++; else if(g>r+60&&bl>r+60) bk++; else if(r>bl+60&&g>bl+60) rd++; } return {stream:st, bank:bk, road:rd, changed:ch}; }); },
      paint:function(side,depth){ world.water.concat(world.roads).forEach(function(o){ var k=o.userData.drape&&o.userData.drape.kind; if(k!=="stream"&&k!=="bank"&&k!=="road"&&k!=="road edge") return; var m=o.material;
          if(!m.userData.sv) m.userData.sv={c:m.color.clone(), e:m.emissive.clone(), dt:m.depthTest, side:m.side};
          var c=k==="stream"?[1,0,1]:k==="bank"?[0,1,1]:[1,1,0]; m.color.setRGB(c[0],c[1],c[2]); m.emissive.setRGB(c[0],c[1],c[2]); m.side=side?THREE.DoubleSide:m.userData.sv.side; m.depthTest=depth; m.needsUpdate=true; });
        requestRender(3); },
      restore:function(){ world.water.concat(world.roads).forEach(function(o){ var m=o.material, s=m.userData.sv; if(!s) return; m.color.copy(s.c); m.emissive.copy(s.e); m.depthTest=s.dt; m.side=s.side; delete m.userData.sv; m.needsUpdate=true; }); requestRender(3); } }; });
  for(const name of ONLY){
    const v=VIEWS[name]||EXTRA[name]; if(!v) throw new Error("no view "+name);
    await L.applyCase(page,v); await install();
    if(v.focus) throw new Error("focus views are not supported here");
    const A=(await L.png(page)).toString("base64"), R=res.views[name]={};
    for(const [key,side,depth] of [["drawn",false,true],["doubleSided",true,true],["unhidden",true,false]]){
      await page.evaluate(([s,d])=>window.__sv.paint(s,d),[side,depth]); await L.settle(page);
      const B=(await L.png(page)).toString("base64"); R[key]=await page.evaluate(([a,b])=>window.__sv.count(a,b),[A,B]);
    }
    await page.evaluate(()=>window.__sv.restore()); await L.settle(page);
    const back=(await L.png(page)).toString("base64"); R.restored=await page.evaluate(([a,b])=>window.__sv.count(a,b),[A,back]);
    console.log(name.padEnd(18),"stream drawn/double-sided/unhidden",R.drawn.stream,R.doubleSided.stream,R.unhidden.stream,"  banks",R.drawn.bank,R.doubleSided.bank,R.unhidden.bank,"  roads",R.drawn.road,R.doubleSided.road,R.unhidden.road,"  after restore",JSON.stringify(R.restored));
    if(JSONF){ fs.mkdirSync(path.dirname(JSONF),{recursive:true}); fs.writeFileSync(JSONF,JSON.stringify(res,null,1)); }
  }
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(1); });
