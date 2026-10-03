#!/usr/bin/env node
/* Stage 5 Part A (docs/STAGE5_SPEC.md section E): plan ghosts, measured on the built page by a probe (it turns the Plans
   overlay on and off through the page's own setPlan, and adds and removes prototype meshes; no source file changes).
   node tools/stage5/plans-probe.js [--json f] [--sheet f]

   In every landscape harness view, four of them at 1x and 10.33x, and the paper map as entered, against the view without it:
   P-today  the Plans overlay as the Plans tab draws it today, both plans (setPlan("both"), the camera kept: heavy ribbons
            drawn over everything, depthTest off; staging areas, objectives, labels, divergence links; every formation dimmed);
   P-ghost  a prototype: each plan column's ordered route (PLANS[].cols[].route, read) as a thin ribbon 1.6 world units (about
            100 m) wide, draped every 0.5 units 0.3 above groundY, the side's colour at 30% opacity, depth-tested so the figures
            stand on it, no head, label, staging or objective; the formations not dimmed.
   Per variant: the routes inside the free rectangle, the changed share of the free rectangle and the contrast of the changed
   pixels against the ground, the map layer's drops, map text contrast as rendered, the world pass's time (software). */
const fs=require("fs"), path=require("path");
const L5=require("./lib.js");
const {launch,open,settle,CASES,LAND,MULTI,PAPER,HELPERS,inject,shot,contrastOf,sheet,EVID}=L5;
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const OUT=opt("--json")||path.join(EVID,"plans-probe.json"), SHEET=opt("--sheet")||path.join(EVID,"plans-sheet.jpg");

const PROBE=function(){
  var P={grp:null};
  P.clear=function(){ if(P.grp){ scene.remove(P.grp); P.grp.traverse(function(o){ if(o.geometry) o.geometry.dispose(); if(o.material) o.material.dispose(); }); P.grp=null; }
    if(planSide) setPlan(planSide); if(P.h0!==undefined){ highlight=P.h0; P.h0=undefined; } requestRender(2); return true; };
  P.today=function(){ P.clear(); P.h0=highlight; freeCam=true; setPlan("both"); requestRender(2); return {planSide:planSide,labels:planText.length}; };
  P.ghost=function(){ P.clear(); var g=new THREE.Group(); P.grp=g; scene.add(g); var fr=(mode!=="staff")?landFreeRect():MAPCAM.freeRect(null,landPanels()), v=new THREE.Vector3(), inFree=0, n=0;
    ["al","fr"].forEach(function(sd){ var col=lin(hexNum(TOKENS.sym.side[sd].base));
      PLANS[sd].cols.forEach(function(c){ var pts=c.route.map(function(q){ var w=W(q[0],q[1]); return [w[0],w[1]]; }), V=[], I=[], seen=false;
        for(var i=1;i<pts.length;i++){ var a=pts[i-1], b=pts[i], L=Math.hypot(b[0]-a[0],b[1]-a[1]), s=Math.max(1,Math.ceil(L/0.5)), nx=-(b[1]-a[1])/L*0.8, nz=(b[0]-a[0])/L*0.8;
          for(var k=(i===1?0:1);k<=s;k++){ var t=k/s, x=a[0]+(b[0]-a[0])*t, z=a[1]+(b[1]-a[1])*t;
            V.push(x+nx,groundY(x+nx,z+nz)+0.3,z+nz, x-nx,groundY(x-nx,z-nz)+0.3,z-nz);
            if(!seen&&k%4===0){ v.set(x,groundY(x,z),z).project(camera); var sx=(v.x*0.5+0.5)*(renderer.domElement.clientWidth||innerWidth), sy=(-v.y*0.5+0.5)*viewH(); if(v.z<1&&sx>=fr[0]&&sx<=fr[2]&&sy>=fr[1]&&sy<=fr[3]) seen=true; } } }
        for(var q=0;q<V.length/6-1;q++){ var o=q*2; I.push(o,o+1,o+2,o+1,o+3,o+2); }
        var geo=new THREE.BufferGeometry(); geo.setAttribute("position",new THREE.Float32BufferAttribute(V,3)); geo.setIndex(I);
        var m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0.30,depthWrite:false,fog:false,side:THREE.DoubleSide}));
        m.renderOrder=3; m.frustumCulled=false; g.add(m); n++; if(seen) inFree++; }); });
    requestRender(2); return {routes:n,routesInFree:inFree}; };
  window.__s5p=P; return true;
};

const VIEWS=[];
LAND.forEach(c=>VIEWS.push({c,key:c.name}));
MULTI.forEach(n=>{ const c=CASES.find(x=>x.name===n); VIEWS.push({c:Object.assign({},c,{factor:1}),key:n+"@1x"}); VIEWS.push({c:Object.assign({},c,{factor:"model"}),key:n+"@10.33x"}); });
PAPER.filter(c=>c.name==="paper-north-up").forEach(c=>VIEWS.push({c,key:c.name}));
const SHEET_KEYS=["overview-field","close-sokolnitz","paper-north-up"];

(async()=>{
  const browser=await launch(), page=await open(browser,[1600,900]), out={html:process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html",when:new Date().toISOString(),views:{}}, tiles=[];
  await inject(page,HELPERS); await inject(page,PROBE);
  const ONLY=opt("--only"), RUN=ONLY?VIEWS.filter(v=>ONLY.split(",").includes(v.key)):VIEWS;
  for(const V of RUN){
    await page.evaluate(s=>window.__aus.apply(s),V.c); await settle(page); await page.evaluate(()=>__s5p.clear()); await settle(page);
    const b0=await shot(page), r={clock:V.c.t,factor:V.c.factor||4,base:{layer:await page.evaluate(()=>__s5.layer()),contrast:await contrastOf(page,b0),worldMs:await page.evaluate(()=>__s5.frame(5))}};
    for(const vr of ["P-today","P-ghost"]){
      const b=await page.evaluate(v=>v==="P-today"?__s5p.today():__s5p.ghost(),vr); await settle(page);
      const b1=await shot(page), d=await page.evaluate(([a,b])=>__s5.diff(a,b),[b0,b1]);
      r[vr]=Object.assign(b,{diff:d,layer:await page.evaluate(()=>__s5.layer()),contrast:await contrastOf(page,b1),worldMs:await page.evaluate(()=>__s5.frame(5))});
      if(SHEET_KEYS.includes(V.key)) tiles.push({png:Buffer.from(b1,"base64"),cap:V.key+" "+vr});
      await page.evaluate(()=>__s5p.clear()); await settle(page); }
    out.views[V.key]=r;
    console.log(V.key.padEnd(24),"base drop",r.base.layer.dropped,["P-today","P-ghost"].map(k=>k+" chg "+r[k].diff.changed+" c "+r[k].diff.contrastMedian+" drop "+r[k].layer.dropped+" AA- "+r[k].contrast.belowAA+" min "+r[k].contrast.min+" ms "+r[k].worldMs+"/"+r.base.worldMs+(r[k].routesInFree!==undefined?" routes "+r[k].routesInFree:"")).join(" | "));
    fs.mkdirSync(EVID,{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(out,null,1));
  }
  if(tiles.length) fs.writeFileSync(SHEET,await sheet(page,tiles,2,800,450,"Stage 5 Part A: the Plans overlay today (both plans) and plan ghosts (prototype)"));
  if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  await browser.close();
})().catch(e=>{ console.error(e); process.exit(2); });
