#!/usr/bin/env node
/* Stage 2B: renders of the built page at 1x, the default (4x) and the model's own scale (GEOREF.EXAG, 10.33x), from the
   five vantages (Field, Zuran, Pratzen, Allied, Overview; app.js VANTAGE, re-framed at use by the app) and the harness's
   low Pratzen view, through the app's own control (setDisplayFactor, via the harness case's `factor`). Watch
   presentation, landscape mode, 09:30 (the low view 09:50, as in the harness). Also times the factor change itself.
   node tools/stage2/renders-2b.js [outdir] [--sheets docsdir]
   Writes <view>-<f>.png and exag-2b.json (figure seating against the drawn mesh, camera clearance, the drawn
   Pratzeberg-Sokolnitz relief and its screen height); with --sheets, one contact sheet per view as 2b-<view>.jpg. */
const fs=require("fs"), path=require("path"), P=require("./page.js");
const args=process.argv.slice(2), out=path.resolve(args[0]&&!args[0].startsWith("--")?args[0]:path.join(__dirname,"out","renders-2b"));
fs.mkdirSync(out,{recursive:true});
const si=args.indexOf("--sheets"), sheets=si>=0?path.resolve(args[si+1]):null;
const FACTORS=[1,4,"model"];
const VIEWS=[["field","field"],["zuran","zuran"],["pratzen","plateau"],["allied","allied"],["overview","plan"],["pratzen-low",null]];
(async()=>{
  const b=await P.launch(), page=await P.open(b,[1600,900]);
  const low=P.CASES.find(c=>c.name==="pratzen-low"), res={views:{},change:[]};
  for(const f of FACTORS){
    for(const [name,v] of VIEWS){
      const spec=Object.assign({},v?{t:570,presentation:"watch",mode:"terrain",cam:await page.evaluate(v=>VANTAGE[v],v)}:low,{factor:f});
      await P.applyCase(page,spec);
      const png=await page.screenshot({timeout:300000});
      const tag=f==="model"?"10.33":String(f);
      fs.writeFileSync(path.join(out,name+"-"+tag+".png"),png);
      const m=await page.evaluate(()=>{ var fg=__aus.figures(), cam=camera.position, g=__aus.groundMax(cam.x,cam.z,1.5);
        var a=GEOREF.GT.pratzeberg.map, c=GEOREF.GT.sokolnitz.map, wa=W(a[0],a[1]), wc=W(c[0],c[1]);
        var pa=new THREE.Vector3(wa[0],groundY(wa[0],wa[1]),wa[1]).project(camera), pc=new THREE.Vector3(wa[0],groundY(wc[0],wc[1]),wa[1]).project(camera);
        var feet=0; Object.keys(units).forEach(function(id){ if(units[id].foot&&units[id].foot.visible) feet++; });
        return {factor:DISPLAY.factor, figMax:fg.maxErr, figCount:fg.count, footprints:feet, clearance:+(cam.y-g).toFixed(2),
          pbergDrawn:+(groundY(wa[0],wa[1])-groundY(wc[0],wc[1])).toFixed(2), reliefPx:Math.round(Math.abs(pa.y-pc.y)*innerHeight/2)}; });
      (res.views[name]=res.views[name]||{})[tag]=m;
      console.log(name.padEnd(12),tag.padEnd(6),JSON.stringify(m));
    }
  }
  /* the factor change on this machine: three rounds of 4 -> 1 -> 10.33 -> 4 at the Pratzen vantage */
  await P.applyCase(page,{t:570,presentation:"watch",mode:"terrain",cam:await page.evaluate(()=>VANTAGE.plateau),factor:4});
  res.change=await page.evaluate(()=>{ var t=[]; for(var r=0;r<3;r++){ [1,GEOREF.EXAG,4].forEach(function(f){ t.push({to:f,ms:+setDisplayFactor(f).toFixed(1)}); }); } return t; });
  const ms=res.change.map(c=>c.ms).sort((a,b)=>a-b);
  res.changeSummary={n:ms.length,min:ms[0],median:ms[Math.floor(ms.length/2)],max:ms[ms.length-1]};
  console.log("factor change (ms): "+JSON.stringify(res.changeSummary)+"  "+res.change.map(c=>c.to.toFixed(2)+":"+c.ms).join(" "));
  fs.writeFileSync(path.join(out,"exag-2b.json"),JSON.stringify(res,null,1));
  if(sheets){ fs.mkdirSync(sheets,{recursive:true});
    for(const [name] of VIEWS){
      const tiles=["1","4","10.33"].map(t=>({png:fs.readFileSync(path.join(out,name+"-"+t+".png")),cap:name+" at "+t+"x"+(t==="1"?" (true scale)":t==="4"?" (default)":" (the model's own scale)")}));
      fs.writeFileSync(path.join(sheets,"2b-"+name+".jpg"),await P.sheet(page,tiles,3,640,360,"Stage 2B, display factor: "+name+" (1x, 4x, 10.33x)"));
    } }
  if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(2); });
