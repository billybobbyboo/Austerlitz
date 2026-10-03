#!/usr/bin/env node
/* Stage 5 Part A (docs/STAGE5_SPEC.md section B): the evidence skeleton, prototyped on the built page by a probe (draped lines
   and markers added to the running scene and removed; no source file changes). node tools/stage5/skeleton-probe.js [--json f] [--sheet f]

   The skeleton: every leaf formation's anchors (the plotted positions, anchorList) as markers by grade (A a filled disc, B a
   ring, C a small hollow ring: shape, not hue or dash; drawn about 9 px across at their distance), and its legs (legPath,
   the vias included) as thin lines draped every 0.5 world units, lifted 0.4 above groundY, in the annotation colour (the paper map's own on the paper map). Three
   scopes: S-day every anchor and leg of the day; S-phase the legs whose window meets the current phase and their two
   anchors; S-sel the selected formation's family only (the views with a selection). Per view and scope: anchors and legs
   drawn, those inside the free rectangle, the changed share of the free rectangle and the contrast of the changed pixels
   against the ground, the map layer's drops (unchanged: the skeleton is not a map-layer item), map text contrast as
   rendered, the world pass's time (software), the share of line sample points under the drawn ground; and how many map-layer
   items one label per anchor in the free rectangle would add. */
const fs=require("fs"), path=require("path");
const L5=require("./lib.js");
const {launch,open,settle,CASES,LAND,MULTI,PAPER,HELPERS,inject,shot,contrastOf,sheet,EVID}=L5;
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const OUT=opt("--json")||path.join(EVID,"skeleton-probe.json"), SHEET=opt("--sheet")||path.join(EVID,"skeleton-sheet.jpg");

const PROBE=function(){
  var K={grp:null};
  function ringTex(kind){ var N=64, cv=document.createElement("canvas"); cv.width=cv.height=N; var x=cv.getContext("2d");
    x.clearRect(0,0,N,N); x.strokeStyle="#fff"; x.fillStyle="#fff"; x.lineWidth=kind==="C"?6:10;
    x.beginPath(); x.arc(N/2,N/2,kind==="C"?N*0.28:N*0.38,0,Math.PI*2); if(kind==="A") x.fill(); else x.stroke();
    return new THREE.CanvasTexture(cv); }
  var TEX={};
  function marker(p,cf,col,px){ var w=W(p[0],p[1]), r=px*worldPerPx(new THREE.Vector3(w[0],groundY(w[0],w[1]),w[1]));
    if(!TEX[cf]) TEX[cf]=ringTex(cf);
    var g=new THREE.PlaneGeometry(1,1,4,4); g.rotateX(-Math.PI/2);
    var m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:col,map:TEX[cf],transparent:true,depthWrite:false,fog:false,side:THREE.DoubleSide}));
    m.userData.base=Float32Array.from(g.attributes.position.array); m.renderOrder=16; m.frustumCulled=false; placeFootprint(m,w[0],w[1],0,2*r,2*r,0.5); return m; }
  K.clear=function(){ if(K.grp){ scene.remove(K.grp); K.grp.traverse(function(o){ if(o.geometry) o.geometry.dispose(); if(o.material) o.material.dispose(); }); K.grp=null; } requestRender(2); };
  K.build=function(scope){ K.clear(); var g=new THREE.Group(); K.grp=g; scene.add(g);
    var col=lin(hexNum(TOKENS.sym.label[mode==="staff"?"paper":"dark"].annotation)), fr=(mode!=="staff")?landFreeRect():MAPCAM.freeRect(null,landPanels()), v=new THREE.Vector3();
    var pos=[], und=0, tot=0, nA=0, nL=0, inA=0, inL=0, ph=curPhase, t0=PHASES[ph].t0, t1=PHASES[ph].t1;
    var fam=(selection&&selection.kind==="f")?familyOf(selection.id):null;
    function inFree(p){ var w=W(p[0],p[1]); v.set(w[0],groundY(w[0],w[1]),w[1]).project(camera); var sx=(v.x*0.5+0.5)*(renderer.domElement.clientWidth||innerWidth), sy=(-v.y*0.5+0.5)*viewH();
      return v.z<1&&sx>=fr[0]&&sx<=fr[2]&&sy>=fr[1]&&sy<=fr[3]; }
    var anchorsDone={};
    Object.keys(units).forEach(function(id){ if(scope==="S-sel"&&!(fam&&fam[id])) return;
      var A=anchorList(id).filter(function(a){ return a.p!==null; });
      A.forEach(function(b,i){ if(i===0) return; var a=A[i-1], w=legWindow(a,b);
        if(scope==="S-phase"&&!(w[1]>=t0&&w[0]<=t1)) return;
        var pp=legPath(a,b), n=Math.max(2,Math.ceil(pp.len*GEOREF.UNITS_PER_KM*GEOREF.KM_PER_MAP/0.5)), prev=null, anyIn=false;
        for(var k=0;k<=n;k++){ var q=pointOnPath(pp,k/n), ww=W(q[0],q[1]), y=groundY(ww[0],ww[1])+0.4, cur=[ww[0],y,ww[1]];
          if(prev){ pos.push(prev[0],prev[1],prev[2],cur[0],cur[1],cur[2]); var mx=(prev[0]+cur[0])/2, mz=(prev[2]+cur[2])/2; tot++; if((prev[1]+cur[1])/2<groundY(mx,mz)) und++; }
          prev=cur; if(!anyIn&&k%4===0&&inFree(q)) anyIn=true; }
        nL++; if(anyIn) inL++;
        [a,b].forEach(function(an){ var key=id+"@"+an.ph; if(anchorsDone[key]) return; anchorsDone[key]=1; var s=stateAt(id,an.ph);
          g.add(marker(an.p,s?s.cf:"B",col,4.5)); nA++; if(inFree(an.p)) inA++; }); });
      if(A.length===1&&scope!=="S-phase"){ var key=id+"@"+A[0].ph; if(!anchorsDone[key]){ anchorsDone[key]=1; g.add(marker(A[0].p,stateAt(id,A[0].ph).cf,col,4.5)); nA++; if(inFree(A[0].p)) inA++; } } });
    var geo=new THREE.BufferGeometry(); geo.setAttribute("position",new THREE.Float32BufferAttribute(new Float32Array(pos),3));
    var ls=new THREE.LineSegments(geo,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:0.8,fog:false})); ls.renderOrder=16; ls.frustumCulled=false; g.add(ls);
    requestRender(2); return {anchors:nA,anchorsInFree:inA,legs:nL,legsInFree:inL,segments:pos.length/6,underShare:tot?+(und/tot).toFixed(4):0}; };
  window.__s5k=K; return true;
};

const VIEWS=[];
LAND.forEach(c=>VIEWS.push({c,key:c.name}));
MULTI.forEach(n=>{ const c=CASES.find(x=>x.name===n); VIEWS.push({c:Object.assign({},c,{factor:1}),key:n+"@1x"}); VIEWS.push({c:Object.assign({},c,{factor:"model"}),key:n+"@10.33x"}); });
PAPER.filter(c=>c.name==="paper-north-up"||c.name==="paper-close"||c.name==="paper-drawer").forEach(c=>VIEWS.push({c,key:c.name}));
const SHEET_KEYS=["overview-plan","close-sokolnitz","selected-formation","paper-north-up"];

(async()=>{
  const browser=await launch(), page=await open(browser,[1600,900]), out={html:process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html",when:new Date().toISOString(),views:{}}, tiles=[];
  await inject(page,HELPERS); await inject(page,PROBE);
  const ONLY=opt("--only"), RUN=ONLY?VIEWS.filter(v=>ONLY.split(",").includes(v.key)):VIEWS;
  for(const V of RUN){
    await page.evaluate(s=>window.__aus.apply(s),V.c); await settle(page); await page.evaluate(()=>__s5k.clear()); await settle(page);
    const b0=await shot(page), r={clock:V.c.t,factor:V.c.factor||4,base:{layer:await page.evaluate(()=>__s5.layer()),contrast:await contrastOf(page,b0),worldMs:await page.evaluate(()=>__s5.frame(5))}};
    const scopes=["S-day","S-phase"].concat(V.c.select?["S-sel"]:[]);
    for(const sc of scopes){
      const b=await page.evaluate(s=>__s5k.build(s),sc); await settle(page);
      const b1=await shot(page), d=await page.evaluate(([a,b])=>__s5.diff(a,b),[b0,b1]);
      r[sc]=Object.assign(b,{diff:d,layer:await page.evaluate(()=>__s5.layer()),contrast:await contrastOf(page,b1),worldMs:await page.evaluate(()=>__s5.frame(5))});
      if(SHEET_KEYS.includes(V.key)&&(sc==="S-day"||sc==="S-sel")) tiles.push({png:Buffer.from(b1,"base64"),cap:V.key+" "+sc});
      await page.evaluate(()=>__s5k.clear()); }
    out.views[V.key]=r;
    console.log(V.key.padEnd(24),scopes.map(k=>k+" A "+r[k].anchorsInFree+"/"+r[k].anchors+" L "+r[k].legsInFree+"/"+r[k].legs+" chg "+r[k].diff.changed+" c "+r[k].diff.contrastMedian+" drop "+r[k].layer.dropped+"/"+r.base.layer.dropped+" AA- "+r[k].contrast.belowAA+" ms "+r[k].worldMs+"/"+r.base.worldMs+" under "+r[k].underShare).join(" | "));
    fs.mkdirSync(EVID,{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(out,null,1));
  }
  if(tiles.length){ fs.writeFileSync(SHEET,await sheet(page,tiles,2,800,450,"Stage 5 Part A: the evidence skeleton prototype (S-day: every anchor and leg; S-sel: the selected family)")); }
  if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(2); });
