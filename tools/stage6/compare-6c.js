#!/usr/bin/env node
/* Stage 6C (docs/STAGE6_SPEC.md section 6.2, "Its report must show"): the figures by class measured against the build before them, view by
   view, on the real builds (no probe changes the scene except the coat keying of measure 3, which it restores).
   node tools/stage6/compare-6c.js [--before archive/stage6b-7fc0f6c3.html] [--after austerlitz-command-map.html] [--only views]
                                   [--json f] [--md f] [--sheet f]
   Per view (tools/stage6/lib.js views()), on each build:
   1. the thresholds as rendered: solid near-black and mean luminance (measure.js pixels; the Stage 0 limit 0.0005), the map text's lowest
      contrast and the number below AA (measure.js textContrast), the map layer's drops, the world pass (software WebGL, the median of 3
      frames), the smoke's share (measure.js smokeShare) and the position-confidence marks' share (measure.js confShare: the view drawn once
      more without them);
   2. the figures in the free rectangle, the formations drawn as figures, and the share of the free rectangle that differs between the builds;
   3. in the close and middle views, each formation's coats keyed in magenta (one render each, the instance colours restored after), so the
      pixels where its coats show are found and their rendered colour read; the CIEDE2000 difference between formations of opposite sides
      as rendered (decision 97: once coats follow the sources, a coat cannot carry side; the cue is the symbology's).
   It also lists every block's classes as drawn on the after build, with their grades (appearanceOf and the block's ud.dress).
   Each view's results are saved as it is measured (the JSON, and its frame in --frames, default the system's temporary folder), and a run
   with --resume skips what is saved: a long run cut short continues where it stopped. */
const fs=require("fs"), path=require("path");
const L=require("./lib.js");
const {launch,open,HELPERS,inject,views,applyView,shot,contrastOf,darkOf,sheet,EVID6,ROOT}=L;
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const BEFORE=opt("--before")||"archive/stage6b-7fc0f6c3.html", AFTER=opt("--after")||"austerlitz-command-map.html";
const OUTJ=opt("--json")||path.join(EVID6,"compare-6c.json"), OUTM=opt("--md")||path.join(EVID6,"compare-6c.md"), SHEET=opt("--sheet")||path.join(EVID6,"compare-6c-sheet.jpg");
const KEYS=["close-sokolnitz","pratzen-low","pratzen-orbit-min","selected-formation","watch-selected","overview-field","hybrid-dimmed"];
const SHEETV=["close-sokolnitz","pratzen-low","eye-zuran","pratzen-orbit-min"];
const FRAMES=opt("--frames")||path.join(require("os").tmpdir(),"aus-compare-6c"), RESUME=args.includes("--resume");
fs.mkdirSync(FRAMES,{recursive:true});

const PROBE=function(){
  var S={};
  function coatGeo(g){ var K=figKit(); return g===K.infCoat||g===K.rider; }
  S.coatMeshes=function(id){ var L=[], b=units[id]&&units[id].block; if(!b) return L;
    b.traverse(function(o){ if(o.isInstancedMesh&&coatGeo(o.geometry)&&o.instanceColor) L.push(o); }); return L; };
  S.key=function(id){ S.unkey(); S.saved=S.coatMeshes(id).map(function(m){ var a=Float32Array.from(m.instanceColor.array);
      for(var i=0;i<m.instanceColor.array.length;i+=3){ m.instanceColor.array[i]=1; m.instanceColor.array[i+1]=0; m.instanceColor.array[i+2]=1; }
      m.instanceColor.needsUpdate=true; return {m:m,a:a}; }); requestRender(2); };
  S.unkey=function(){ (S.saved||[]).forEach(function(e){ e.m.instanceColor.array.set(e.a); e.m.instanceColor.needsUpdate=true; }); S.saved=null; requestRender(2); };
  /* the formations whose figures are drawn and whose position projects into the free rectangle, with their side */
  S.identity=function(){ var fr=landFreeRect(), R=__s5.panels(), v=new THREE.Vector3(), VW=renderer.domElement.clientWidth||innerWidth, VH=viewH(), out=[];
    camera.updateMatrixWorld(true);
    Object.keys(units).forEach(function(id){ var r=units[id], f=FORMATIONS[id], b=r.block, p=posNow(id); if(!p||!b||!__aus.effVisible(b)) return;
      var w=W(p[0],p[1]); v.set(w[0],groundY(w[0],w[1]),w[1]).project(camera); var sx=(v.x*0.5+0.5)*VW, sy=(-v.y*0.5+0.5)*VH;
      if(v.z>1||sx<fr[0]||sx>fr[2]||sy<fr[1]||sy>fr[3]) return; for(var k=0;k<R.length;k++){ var q=R[k]; if(sx>=q[0]&&sx<q[2]&&sy>=q[1]&&sy<q[3]) return; }
      out.push({id:id,side:sideOfNation(f.nation)}); });
    return out; };
  S.figures=function(){ var n=0, fr=landFreeRect(), M=new THREE.Matrix4(), v=new THREE.Vector3(), VW=renderer.domElement.clientWidth||innerWidth, VH=viewH();
    camera.updateMatrixWorld(true);
    Object.keys(units).forEach(function(id){ var b=units[id].block; if(!b||!__aus.effVisible(b)) return; b.updateMatrixWorld(true);
      b.traverse(function(o){ if(!o.isInstancedMesh||!coatGeo(o.geometry)||!__aus.effVisible(o)) return;
        for(var i=0;i<o.count;i++){ o.getMatrixAt(i,M); v.setFromMatrixPosition(M).applyMatrix4(o.matrixWorld).project(camera); var sx=(v.x*0.5+0.5)*VW, sy=(-v.y*0.5+0.5)*VH;
          if(v.z<1&&sx>=fr[0]&&sx<=fr[2]&&sy>=fr[1]&&sy<=fr[3]) n++; } }); });
    return n; };
  function lab(r,g,b){ function l(c){ c/=255; return c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4); } var R=l(r),G=l(g),B=l(b);
    var X=(0.4124*R+0.3576*G+0.1805*B)/0.95047, Y=(0.2126*R+0.7152*G+0.0722*B), Z=(0.0193*R+0.1192*G+0.9505*B)/1.08883;
    function f(t){ return t>0.008856?Math.cbrt(t):7.787*t+16/116; } return [116*f(Y)-16,500*(f(X)-f(Y)),200*(f(Y)-f(Z))]; }
  S.de2000=function(a,b){ var L1=a[0],a1=a[1],b1=a[2],L2=b[0],a2=b[1],b2=b[2], avgL=(L1+L2)/2, C1=Math.hypot(a1,b1), C2=Math.hypot(a2,b2), avgC=(C1+C2)/2,
      G=0.5*(1-Math.sqrt(Math.pow(avgC,7)/(Math.pow(avgC,7)+Math.pow(25,7)))), a1p=a1*(1+G), a2p=a2*(1+G), C1p=Math.hypot(a1p,b1), C2p=Math.hypot(a2p,b2), avgCp=(C1p+C2p)/2;
    function hp(x,y){ if(x===0&&y===0) return 0; var h=Math.atan2(y,x)*180/Math.PI; return h<0?h+360:h; }
    var h1p=hp(a1p,b1), h2p=hp(a2p,b2), dhp=Math.abs(h1p-h2p)<=180?h2p-h1p:(h2p<=h1p?h2p-h1p+360:h2p-h1p-360), avgHp=Math.abs(h1p-h2p)>180?(h1p+h2p+360)/2:(h1p+h2p)/2;
    var T=1-0.17*Math.cos((avgHp-30)*Math.PI/180)+0.24*Math.cos(2*avgHp*Math.PI/180)+0.32*Math.cos((3*avgHp+6)*Math.PI/180)-0.20*Math.cos((4*avgHp-63)*Math.PI/180);
    var dLp=L2-L1, dCp=C2p-C1p, dHp=2*Math.sqrt(C1p*C2p)*Math.sin(dhp*Math.PI/360), SL=1+0.015*Math.pow(avgL-50,2)/Math.sqrt(20+Math.pow(avgL-50,2)), SC=1+0.045*avgCp, SH=1+0.015*avgCp*T;
    var dT=30*Math.exp(-Math.pow((avgHp-275)/25,2)), RC=2*Math.sqrt(Math.pow(avgCp,7)/(Math.pow(avgCp,7)+Math.pow(25,7))), RT=-RC*Math.sin(2*dT*Math.PI/180);
    return Math.sqrt(Math.pow(dLp/SL,2)+Math.pow(dCp/SC,2)+Math.pow(dHp/SH,2)+RT*(dCp/SC)*(dHp/SH)); };
  /* the pixels where the keyed render is magenta and differs from the plain render: their mean colour in the plain render */
  S.keyColour=function(keyB64,refB64){ function img(b){ return new Promise(function(r){ var i=new Image(); i.onload=function(){ var c=document.createElement("canvas"); c.width=i.width; c.height=i.height;
      var x=c.getContext("2d",{willReadFrequently:true}); x.drawImage(i,0,0); r({w:i.width,d:x.getImageData(0,0,i.width,i.height).data}); }; i.src="data:image/png;base64,"+b; }); }
    var fr=landFreeRect(), R=__s5.panels();
    return Promise.all([img(keyB64),img(refB64)]).then(function(I){ var Kd=I[0].d, Rd=I[1].d, Wd=I[0].w, n=0, s=[0,0,0];
      for(var y=Math.ceil(fr[1]);y<Math.floor(fr[3]);y++) for(var x=Math.ceil(fr[0]);x<Math.floor(fr[2]);x++){ var inP=false; for(var k=0;k<R.length;k++){ var q=R[k]; if(x>=q[0]&&x<q[2]&&y>=q[1]&&y<q[3]){ inP=true; break; } } if(inP) continue;
        var o=(y*Wd+x)*4; if(!(Kd[o]-Kd[o+1]>40&&Kd[o+2]-Kd[o+1]>40)) continue; if(Math.abs(Kd[o]-Rd[o])+Math.abs(Kd[o+1]-Rd[o+1])+Math.abs(Kd[o+2]-Rd[o+2])<60) continue;
        n++; s[0]+=Rd[o]; s[1]+=Rd[o+1]; s[2]+=Rd[o+2]; }
      if(!n) return {px:0}; var m=s.map(function(v){ return v/n; });
      return {px:n,hex:"#"+m.map(function(v){ return ("0"+Math.round(v).toString(16)).slice(-2); }).join("").toUpperCase(),lab:lab(m[0],m[1],m[2]).map(function(v){ return +v.toFixed(2); })}; }); };
  /* every block's classes as drawn (the after build), with the grades of their coat, legwear and headgear */
  S.blocks=function(){ if(typeof appearanceOf!=="function") return null; var out={};
    Object.keys(units).forEach(function(id){ var u=units[id].block&&units[id].block.userData; if(!u||!u.dress) return;
      out[id]=u.dress.map(function(r){ var d=r.dress?DRESS[r.dress]:null; function g(v){ return !v?"-":v.gen?"not settled":v.sides?"disputed":v.gr; }
        return {role:r.role,dress:r.dress,units:r.units.length,figures:r.figures,coat:r.kd.coatName,leg:r.kd.legName,head:r.kd.head,cuirass:r.kd.cuirass,horse:r.mounted?r.kd.horse:null,
          gr:d?{coat:g(d.coat),leg:g(d.legwear),head:g(d.head)}:null}; }); });
    return out; };
  window.__s6c=S; return true;
};

async function measure(html,RUN,label,out){
  const res=out[label];
  const todo=RUN.filter(V=>!res.views[V.key]);
  if(!todo.length&&(label!=="after"||res.blocks)) return;
  const browser=await launch(), page=await open(browser,[1600,900],path.resolve(ROOT,html));
  await inject(page,HELPERS); await inject(page,PROBE);
  const quick=async()=>{ await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); };
  for(const V of todo){
    const t0=Date.now(); await applyView(page,V);
    const r={figures:0}, b0=await shot(page);
    r.layer=await page.evaluate(()=>__s5.layer()); r.contrast=await contrastOf(page,b0); r.dark=await darkOf(page,b0);
    r.worldMs=await page.evaluate(()=>__s5.frame(15));
    r.calls=await page.evaluate(()=>{ renderer.info.autoReset=false; renderer.info.reset(); renderFrame(); var c=renderer.info.render.calls; renderer.info.autoReset=true; return c; }); r.smoke=await page.evaluate(()=>{ var s=window.__aus.smokeShare(); return s?s.share:null; });
    fs.writeFileSync(path.join(FRAMES,label+"-"+V.key+".png"),Buffer.from(b0,"base64"));
    if(V.c.mode!=="staff"){
      r.figures=await page.evaluate(()=>__s6c.figures()); r.identity=await page.evaluate(()=>__s6c.identity());
      /* the marks' share against the view with no mark at all (CONF.none, since 6C; on 6B Position confidence off drew none), and on 6C the
         share of decision 107's side footprint (Position confidence off) against the same */
      if(r.figures>0){ await page.evaluate(()=>{ layerOn.confidence=false; CONF.none=true; }); await quick(); const c0=await shot(page);
        await page.evaluate(()=>{ CONF.none=false; }); await quick(); const c1=await shot(page);
        await page.evaluate(()=>{ layerOn.confidence=true; }); await quick();
        r.confShare=(await page.evaluate(([a,b])=>window.__aus.confShare(a,b),[b0,c0])).share;
        r.sideShare=(await page.evaluate(([a,b])=>window.__aus.confShare(a,b),[c1,c0])).share; }
      if(KEYS.includes(V.key)&&r.figures>0){ r.keys={};
        for(const it of r.identity){ await page.evaluate(id=>__s6c.key(id),it.id); await quick(); const kb=await shot(page); await page.evaluate(()=>__s6c.unkey()); await quick();
          const kc=await page.evaluate(([a,b])=>__s6c.keyColour(a,b),[kb,b0]); if(kc.px>=12) r.keys[it.id]=Object.assign({side:it.side},kc); }
        const ids=Object.keys(r.keys), cross=[];
        for(let i=0;i<ids.length;i++) for(let j=i+1;j<ids.length;j++){ const A=r.keys[ids[i]], B=r.keys[ids[j]]; if(A.side===B.side) continue;
          cross.push([ids[i],ids[j],+(await page.evaluate(([a,b])=>__s6c.de2000(a,b),[A.lab,B.lab])).toFixed(1)]); }
        cross.sort((a,b)=>a[2]-b[2]); r.cross={pairs:cross.length,closest:cross.slice(0,4)}; } }
    /* the share of the free rectangle that differs from the before build's frame of the same view */
    const bf=path.join(FRAMES,"before-"+V.key+".png");
    if(label==="after"&&fs.existsSync(bf)) r.changed=(await page.evaluate(([x,y])=>__s5.diff(x,y,8),[fs.readFileSync(bf).toString("base64"),b0])).changed;
    r.seconds=Math.round((Date.now()-t0)/1000); res.views[V.key]=r; res.errors=page._errors.slice(0,5);
    fs.writeFileSync(OUTJ,JSON.stringify(out,null,1));
    console.log(label.padEnd(7),V.key.padEnd(24),"figs",r.figures,"blk",r.dark.solidBlack,"lum",r.dark.meanLum,"AA-",r.contrast.belowAA,"min",r.contrast.min,"drop",r.layer.dropped,
      "conf",r.confShare,"side",r.sideShare,"smoke",r.smoke,"ms",r.worldMs,"calls",r.calls,r.cross?"cross "+JSON.stringify(r.cross.closest[0]||null):"","|",r.seconds,"s");
  }
  if(label==="after"){ res.blocks=await page.evaluate(()=>__s6c.blocks()); fs.writeFileSync(OUTJ,JSON.stringify(out,null,1)); }
  await browser.close();
}

(async()=>{
  const ONLY=opt("--only"), RUN=ONLY?views().filter(v=>ONLY.split(",").includes(v.key)):views();
  const out=RESUME&&fs.existsSync(OUTJ)?JSON.parse(fs.readFileSync(OUTJ,"utf8")):{when:new Date().toISOString(),before:{html:BEFORE,views:{},errors:[]},after:{html:AFTER,views:{},errors:[]}};
  await measure(BEFORE,RUN,"before",out);
  await measure(AFTER,RUN,"after",out);
  out.when=new Date().toISOString(); fs.writeFileSync(OUTJ,JSON.stringify(out,null,1));
  /* the sheet of the close views, before and after, from the saved frames */
  const T=[]; SHEETV.forEach(k=>["before","after"].forEach(l=>{ const f=path.join(FRAMES,l+"-"+k+".png"); if(fs.existsSync(f)) T.push({png:fs.readFileSync(f),cap:k+": "+(l==="before"?"Stage 6B ("+BEFORE+")":"Stage 6C")}); }));
  if(T.length){ const browser=await launch(), page=await open(browser,[1600,900],path.resolve(ROOT,AFTER));
    fs.writeFileSync(SHEET,await sheet(page,T,2,800,450,"Stage 6C: the figures by class (right) against Stage 6B (left), as rendered")); await browser.close(); }
  const A={views:out.after.views,blocks:out.after.blocks,errors:out.after.errors||[]}, B={views:out.before.views,errors:out.before.errors||[]};
  /* the markdown */
  const md=["# Stage 6C: the figures by class against the build before them\n",
    "`node tools/stage6/compare-6c.js`, run "+out.when.slice(0,10)+". Before: `"+BEFORE+"` (Stage 6B); after: `"+AFTER+"` (Stage 6C). 1600 x 900, software WebGL (the world pass's times compare only with one another). "+
    "Solid near-black: the share of 8 x 8 blocks at least 90% near-black outside the panels (Stage 0 limit 0.0005). Map text: the lowest contrast as rendered and the number below AA. "+
    "Drops: the map layer's. Smoke and confidence: their shares of the free rectangle (measure.js); the confidence marks against the view drawn with no mark (CONF.none on 6C), "+
    "and on 6C the share of decision 107's side footprint, drawn when Position confidence is off. The world pass: the median of 15 frames, and the draw calls of one frame. "+
    "Changed: the share of the free rectangle that differs between the builds.\n",
    "| view | figures | solid black before / after | mean luminance before / after | text min (below AA) before / after | drops before / after | confidence share before / after | side footprint (after) | smoke share before / after | world pass ms before / after | draw calls before / after | changed |","|---|---|---|---|---|---|---|---|---|---|---|---|"];
  Object.keys(A.views).forEach(k=>{ const a=A.views[k], b=B.views[k]||{}; const f=(x,y)=>(x===undefined||x===null?"-":x)+" / "+(y===undefined||y===null?"-":y);
    md.push("| "+k+" | "+a.figures+" | "+f(b.dark&&b.dark.solidBlack,a.dark.solidBlack)+" | "+f(b.dark&&b.dark.meanLum,a.dark.meanLum)+" | "+
      f(b.contrast&&(b.contrast.min+" ("+b.contrast.belowAA+")"),a.contrast.min+" ("+a.contrast.belowAA+")")+" | "+f(b.layer&&b.layer.dropped,a.layer.dropped)+" | "+
      f(b.confShare,a.confShare)+" | "+(a.sideShare===undefined?"-":a.sideShare)+" | "+f(b.smoke,a.smoke)+" | "+f(b.worldMs,a.worldMs)+" | "+f(b.calls,a.calls)+" | "+(a.changed===undefined?"-":a.changed)+" |"); });
  md.push("\n## Coats as rendered: the closest pairs of formations of opposite sides (CIEDE2000)\n",
    "Each formation's coats keyed in magenta (one render each), the pixels where they show read in the plain render. Expected to fall (decision 97): coats follow the sources, and side is carried by the symbology.\n",
    "| view | before: pairs, closest three | after: pairs, closest three |","|---|---|---|");
  Object.keys(A.views).forEach(k=>{ const a=A.views[k], b=B.views[k]||{}; if(!a.cross&&!b.cross) return; const f=c=>c?c.pairs+": "+c.closest.slice(0,3).map(p=>p[0]+"-"+p[1]+" "+p[2]).join("; "):"-";
    md.push("| "+k+" | "+f(b.cross)+" | "+f(a.cross)+" |"); });
  md.push("\n## Every block's classes as drawn (after), with their grades (coat / legwear / headgear; \"not settled\" and \"disputed\" are drawn generic)\n","| block | role | class | units | figures | coat | legwear | headgear | cuirass | horses | grades |","|---|---|---|---|---|---|---|---|---|---|---|");
  Object.keys(A.blocks||{}).forEach(id=>A.blocks[id].forEach(r=>md.push("| "+id+" | "+r.role+" | "+(r.dress||"generic")+" | "+r.units+" | "+r.figures+" | "+r.coat+" | "+r.leg+" | "+r.head+" | "+(r.cuirass||"-")+" | "+(r.horse||"-")+" | "+(r.gr?r.gr.coat+" / "+r.gr.leg+" / "+r.gr.head:"-")+" |")));
  md.push("\n`compare-6c-sheet.jpg`: "+SHEETV.join(", ")+", before and after.");
  if(B.errors.length||A.errors.length) md.push("\nPage errors: before "+JSON.stringify(B.errors)+", after "+JSON.stringify(A.errors));
  fs.writeFileSync(OUTM,md.join("\n")+"\n");
  console.log("written",OUTJ,OUTM,SHEET);
})().catch(e=>{ console.error(e); process.exit(2); });
