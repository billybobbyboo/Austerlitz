#!/usr/bin/env node
/* Stage 2 Part A, section B: renders at display exaggerations 1x, 3x, 4x, 5x and 10.33x from the five vantages
   (Field, Zuran, Pratzen, Allied, Overview; app.js VANTAGE) and the harness's low Pratzen view, using the in-page
   probe (probe-exag.js). Watch presentation at 09:30 (the low view at 09:50, as in the harness), landscape mode.
   node tools/stage2/exag-renders.js <outdir>
   Writes <view>-<f>.png, one contact sheet per view (sheet-<view>.jpg) and exag.json: per render the figure
   seating error (the harness's measure, against the drawn mesh), camera clearance and the screen height of the
   drawn Pratzeberg-Sokolnitz relief (projected). */
const fs=require("fs"), path=require("path"), P=require("./page.js"), PROBE=require("./probe-exag.js");
const out=path.resolve(process.argv[2]||path.join(__dirname,"out","exag")); fs.mkdirSync(out,{recursive:true});
const FACTORS=[1,3,4,5,10.33];
const VIEWS=[["field","field"],["zuran","zuran"],["pratzen","plateau"],["allied","allied"],["overview","plan"],["pratzen-low",null]];
(async()=>{
  const b=await P.launch(), page=await P.open(b,[1600,900]);
  await page.evaluate(PROBE);
  const low=P.CASES.find(c=>c.name==="pratzen-low"), res={};
  for(const f of FACTORS){
    await page.evaluate(f=>__stage2.exag(f>=10.3?GEOREF.EXAG:f),f);
    for(const [name,v] of VIEWS){
      const spec=v?{t:570,presentation:"watch",mode:"terrain",cam:await page.evaluate(v=>__stage2.reframe(VANTAGE[v]),v)}:low;
      await P.applyCase(page,spec);
      const png=await page.screenshot({timeout:300000});
      fs.writeFileSync(path.join(out,name+"-"+f+".png"),png);
      const m=await page.evaluate(()=>{ var fg=__aus.figures(), cam=camera.position, g=__aus.groundMax(cam.x,cam.z,1.5);
        var a=GEOREF.GT.pratzeberg.map, c=GEOREF.GT.sokolnitz.map, wa=W(a[0],a[1]), wc=W(c[0],c[1]);
        var pa=new THREE.Vector3(wa[0],groundY(wa[0],wa[1]),wa[1]).project(camera), pc=new THREE.Vector3(wa[0],groundY(wc[0],wc[1]),wa[1]).project(camera);
        return {figMax:fg.maxErr, figCount:fg.count, clearance:+(cam.y-g).toFixed(2), pbergDrawn:+(groundY(wa[0],wa[1])-groundY(wc[0],wc[1])).toFixed(2),
          reliefPx:Math.round(Math.abs(pa.y-pc.y)*innerHeight/2)}; });
      (res[name]=res[name]||{})[f]=m;
      console.log(name.padEnd(12),String(f).padEnd(6),JSON.stringify(m));
    }
  }
  fs.writeFileSync(path.join(out,"exag.json"),JSON.stringify(res,null,1));
  for(const [name] of VIEWS){
    const tiles=FACTORS.map(f=>({png:fs.readFileSync(path.join(out,name+"-"+f+".png")),cap:name+" at "+f+"x"}));
    fs.writeFileSync(path.join(out,"sheet-"+name+".jpg"),await P.sheet(page,tiles,3,640,360,"Display exaggeration: "+name+" (1x, 3x, 4x / 5x, 10.33x)"));
  }
  if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(2); });
