#!/usr/bin/env node
/* Stage 8, implementation PR 8A (decision 253; docs/STAGE8_SPEC.md section 13): the roads', the streams' and their banks' drawn widths,
   compared before any is accepted. Since 8A the ribbons are drawn (world.js ribbon(), wound facing up); their drawn width is RIBBON_W's
   factor for their group (the streams with their banks; the roads with their edges) and for the presentation (the landscape, both
   perspective presentations; the paper map) times the width they were built with until 8A: display conventions. In each view the frame is
   captured with the ribbons culled ("off": their materials drawing only the back face, which since 8A faces down: what every build before
   8A drew, the same draw calls and triangles), then at each candidate factor, set for the
   presentation shown and draped again (world.js drape); beside each frame its draw calls and triangles (renderer.info, every pass), the
   ribbons' pixels on screen (each kind painted a flat colour and counted, as tools/stage8/stream-vis.js counts them: stream magenta, bank
   cyan, road and road edge yellow), and the median time of five frames drawn (software WebGL: a CPU measure of the fragments added, not a
   GPU's). A contact sheet of each view's variants is written beside the frames.
   node tools/stage8/ribbon-widths.js [--variants off,1,0.7,0.5,0.35] [--views a,b] [--out dir] [--json file]
   AUSTERLITZ_HTML another build; AUSTERLITZ_CHROME the Chromium to run. Measurement only: RIBBON_W and the ribbons' materials and visibility
   are put back after each view. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("./lib.js"), VIEWS=require("./views.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const VAR=(opt("--variants")||"off,1,0.7,0.5,0.35").split(",");
const DEF="village-telnitz,village-sokolnitz,close-sokolnitz,goldbach-top,goldbach-noon,stream-low,pratzen-low,overview-field,overview-plan,pratzen-low-1x,paper-north-up,paper-close";
const ONLY=(opt("--views")||DEF).split(","), OUT=opt("--out")||path.join(L.EVID8,"ribbons"), JSONF=opt("--json")||path.join(OUT,"ribbon-widths.json");
const HTML=path.resolve(process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html"));
(async()=>{
  const browser=await L.launch(); let page=null, vp=null;
  const res={build:crypto.createHash("md5").update(fs.readFileSync(HTML)).digest("hex"), variants:VAR, views:{}};
  const save=()=>{ fs.mkdirSync(path.dirname(JSONF),{recursive:true}); fs.writeFileSync(JSONF,JSON.stringify(res,null,1)); };
  for(const name of ONLY){
    const v=VIEWS[name]; if(!v) throw new Error("no view "+name);
    if(!page||vp!==v.viewport.join("x")){ if(page) await page.close(); page=await L.open(browser,v.viewport); vp=v.viewport.join("x"); }
    await L.applyCase(page,v);
    await page.evaluate(()=>{ if(window.__rw) return;
      var rib=function(){ return DRAPED.filter(function(o){ var k=o.userData.drape&&o.userData.drape.kind; return k==="stream"||k==="bank"||k==="road"||k==="road edge"; }); };
      window.__rw={W0:JSON.parse(JSON.stringify(RIBBON_W)), rib:rib,
        /* "off": the ribbons submitted and culled, as before 8A (their materials drawing the back face only, which now faces down) */
        set:function(k){ var M=DISPLAY.flat?"paper":"land";
          rib().forEach(function(o){ var sd=(k==="off")?THREE.BackSide:THREE.FrontSide; if(o.material.side!==sd){ o.material.side=sd; o.material.needsUpdate=true; } });
          if(k!=="off"){ RIBBON_W[M].stream=+k; RIBBON_W[M].road=+k; DRAPED.forEach(drape); }
          requestRender(3); },
        reset:function(){ var W0=window.__rw.W0; ["land","paper"].forEach(function(M){ RIBBON_W[M].stream=W0[M].stream; RIBBON_W[M].road=W0[M].road; });
          rib().forEach(function(o){ if(o.material.side!==THREE.FrontSide){ o.material.side=THREE.FrontSide; o.material.needsUpdate=true; } }); DRAPED.forEach(drape); requestRender(3); },
        cost:function(){ renderer.info.autoReset=false; renderer.info.reset(); renderFrame();
          var c={calls:renderer.info.render.calls, tris:renderer.info.render.triangles}, gl=renderer.getContext(), T=[];
          for(var i=0;i<5;i++){ var t0=performance.now(); renderFrame(); gl.finish(); T.push(performance.now()-t0); }
          T.sort(function(a,b){ return a-b; }); c.ms=+T[2].toFixed(1); return c; },
        paint:function(on){ rib().forEach(function(o){ var m=o.material, k=o.userData.drape.kind;
            if(on){ if(!m.userData.rw) m.userData.rw={c:m.color.clone(), e:m.emissive?m.emissive.clone():null};
              var c=k==="stream"?[1,0,1]:k==="bank"?[0,1,1]:[1,1,0]; m.color.setRGB(c[0],c[1],c[2]); if(m.emissive) m.emissive.setRGB(c[0],c[1],c[2]); }
            else if(m.userData.rw){ m.color.copy(m.userData.rw.c); if(m.emissive&&m.userData.rw.e) m.emissive.copy(m.userData.rw.e); delete m.userData.rw; }
            m.needsUpdate=true; }); requestRender(3); },
        count:function(a,b){ var img=function(s){ return new Promise(function(r){ var i=new Image(); i.onload=function(){ var c=document.createElement("canvas"); c.width=i.width; c.height=i.height;
            var x=c.getContext("2d",{willReadFrequently:true}); x.drawImage(i,0,0); r(x.getImageData(0,0,i.width,i.height).data); }; i.src="data:image/png;base64,"+s; }); };
          return Promise.all([img(a),img(b)]).then(function(I){ var A=I[0], B=I[1], st=0, bk=0, rd=0;
            for(var k=0;k<A.length;k+=4){ var dd=Math.max(Math.abs(A[k]-B[k]),Math.abs(A[k+1]-B[k+1]),Math.abs(A[k+2]-B[k+2])); if(dd<=40) continue;
              var r=B[k], g=B[k+1], bl=B[k+2]; if(r>g+60&&bl>g+60) st++; else if(g>r+60&&bl>r+60) bk++; else if(r>bl+60&&g>bl+60) rd++; }
            return {stream:st, bank:bk, road:rd}; }); } }; });
    const R=res.views[name]={mode:v.mode, factor:v.factor||4, variants:{}}, tiles=[];
    for(const k of VAR){
      await page.evaluate(k=>window.__rw.set(k),k); await L.settle(page);
      const shot=await L.png(page), c=await page.evaluate(()=>window.__rw.cost());
      fs.mkdirSync(OUT,{recursive:true}); await L.jpeg(page,path.join(OUT,name+"-"+(k==="off"?"off":"w"+k)+".jpg"),84);
      let px=null;
      if(k!=="off"){ await page.evaluate(()=>window.__rw.paint(true)); await L.settle(page);
        const painted=(await L.png(page)).toString("base64"); px=await page.evaluate(([a,b])=>window.__rw.count(a,b),[shot.toString("base64"),painted]);
        await page.evaluate(()=>window.__rw.paint(false)); await L.settle(page); }
      R.variants[k]=Object.assign({},c,{px:px});
      tiles.push({png:shot, cap:name+" · "+(k==="off"?"ribbons off (every build before 8A)":"×"+k+" of the widths before 8A")+(px?" · px s/b/r "+px.stream+"/"+px.bank+"/"+px.road:"")+" · "+c.calls+" calls "+(c.tris/1e6).toFixed(3)+"M tris"});
      console.log(name.padEnd(18),String(k).padEnd(5),JSON.stringify(R.variants[k]));
    }
    await page.evaluate(()=>window.__rw.reset()); await L.settle(page);
    const back=await page.evaluate(()=>window.__rw.cost()); R.restored=back;
    await L.sheet(page,tiles,VAR.length>3?3:VAR.length,640,360,name+": the ribbons' widths (decision 253)",path.join(OUT,name+"-sheet.jpg"));
    save();
  }
  if(page) await page.close(); await browser.close(); save();
})().catch(e=>{ console.error(e); process.exit(1); });
