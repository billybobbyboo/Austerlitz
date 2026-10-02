#!/usr/bin/env node
/* Stage 4 Part A (docs/STAGE4_SPEC.md section B): the atmosphere, tried on the built page by a probe. The probe reads the
   running page and, for the renders, replaces three.js's fog shader chunks in the page (measurement code, not the Stage 4
   implementation); it changes no source file. node tools/stage4/fog-probe.js [--json out.json] [--sheet out.jpg] [--only today,model,render,focus,cost] [--png dir]

   1. today: in every landscape harness view, the scene fog as drawn (THREE.Fog, linear in the eye's depth; the phase's LIGHT
      preset's near and far, plus Stage 3D's recession, fogShift, beyond the authored Overview's 274 units): the eye's distance
      to the orbit target, the shift, the fog factor at the target, and over the drawn ground under a 32 x 18 grid of screen
      points (groundAt) its mean and the shares above 0.5 and 0.9; and the same without the shift.
   2. model: what the app's own texts say of the fog and the hours, against the model's elevations (GEOREF.elevM of the model
      height, metres): every drawn formation's elevation at 05:00, 07:00, 08:00, 08:30 and 08:45, by side; the places'; for
      candidate fog tops (210-330 m, and 238.2 m: the knowledge model's threshold, hAt < -0.8 while PHASES[].mist > 0.5), the formations and men under each at 08:00, Soult's two assault divisions named.
   3. render: candidate atmospheres in the page's own frame path, the fog chunks replaced so every fogged material computes them
      in the true (unexaggerated) geometry (the ray's vertical divided by the display factor; heights in metres by GEOREF):
        H0 today; H1 a regional haze, exponential in height (scale height 400 m above 200 m), visibility 10 km at 200 m;
        H2 the same at 20 km; V1 H1 and a valley fog layer below a top (238.2 m, the knowledge model's mist threshold, hAt -0.8 (app.js knowledgeOf), or 260 m; a 15 m soft edge; 200 m visibility
        inside it; drawn at most 85% opaque), the mist sheets hidden. Per render: the harness's pixel measure, the luminance
        percentiles, every map text's contrast on the frame, the map layer's drops and pass time, the frame's times; and, from the
        same formula in the page, the haze over the drawn ground (mean, shares above 0.5 and 0.9) and the share of drawn figures
        under the valley fog's top.
   4. focus (only when asked): H3, H1's haze counted only beyond the orbit target's distance; V55, the valley fog at 238.2 m at most
      55% opaque (with H3); the same measures, in five views at 4x and the two 08:00-08:30 views.
   5. cost (only when asked): the world pass's time with H0, H1 and the valley fog (55%) once compiled, each on a fresh page (5
      frames to warm up, the median of 15), in three views. */
const fs=require("fs"), path=require("path");
const {launch,open,settle,sheet,CASES,ROOT}=require("../stage2/page.js");
const T=require("../visual/thresholds.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const ONLY=(opt("--only")||"today,model,render").split(",");
const OUT=opt("--json")||path.join(ROOT,"docs","stage4-evidence","fog-probe.json");

const PROBE=function(){
  var F4={}, G=GEOREF, MPW=G.M_PER_WORLD, DATUM=G.DATUM_M;
  function W0(){ return renderer.domElement.clientWidth||innerWidth; } function H0(){ return renderer.domElement.clientHeight||innerHeight; }
  function depthOf(p){ var v=new THREE.Vector3(p[0],p[1],p[2]).applyMatrix4(camera.matrixWorldInverse); return -v.z; }
  function smooth(a,b,x){ var t=Math.max(0,Math.min(1,(x-a)/(b-a))); return t*t*(3-2*t); }
  /* the drawn ground under a grid of screen points, clear of the panels (the free rectangle) */
  F4.samples=function(){ camera.updateMatrixWorld(true); var fr=landFreeRect(), S=[];
    for(var j=0;j<18;j++) for(var i=0;i<32;i++){ var sx=fr[0]+(i+0.5)/32*(fr[2]-fr[0]), sy=fr[1]+(j+0.5)/18*(fr[3]-fr[1]), g=groundAt(sx,sy);
      if(g) S.push([g[0],groundY(g[0],g[1]),g[1]]); } return S; };
  F4.today=function(){ var S=F4.samples(), fs=fogShift(), n=scene.fog.near, f=scene.fog.far, d=landCam.position.distanceTo(orbitTarget);
    function stats(sh){ var m=0,a=0,b=0; S.forEach(function(p){ var k=smooth(n+sh,f+sh,depthOf(p)); m+=k; if(k>0.5) a++; if(k>0.9) b++; });
      var kt=smooth(n+sh,f+sh,depthOf([orbitTarget.x,orbitTarget.y,orbitTarget.z]));
      return {atTarget:+kt.toFixed(3),mean:S.length?+(m/S.length).toFixed(3):null,over50:S.length?+(a/S.length).toFixed(3):null,over90:S.length?+(b/S.length).toFixed(3):null}; }
    return {eyeToTarget:+d.toFixed(1),shift:+fs.toFixed(1),near:n,far:f,samples:S.length,withShift:stats(fs),withoutShift:stats(0)}; };
  /* the candidate in JS, the same formula as the chunks below: true-space optical depth of the haze and of the valley layer */
  F4.cfg=null;
  function tau(c,p,cfg){ if(cfg.focus){ var ex=p[0]-c[0], ey=p[1]-c[1], ez=p[2]-c[2], el=Math.sqrt(ex*ex+ey*ey+ez*ez), fk=Math.min(el,cfg.focus)/Math.max(el,1e-9); c=[c[0]+ex*fk,c[1]+ey*fk,c[2]+ez*fk]; }
    var K=DISPLAY.factor, dx=p[0]-c[0], dy=(p[1]-c[1])/K, dz=p[2]-c[2], L=Math.sqrt(dx*dx+dy*dy+dz*dz);
    var mc=DATUM+c[1]/K*MPW, mw=DATUM+p[1]/K*MPW, dm=mw-mc, ec=Math.exp(-(mc-cfg.m0)/cfg.hs), ew=Math.exp(-(mw-cfg.m0)/cfg.hs);
    var th=cfg.sig*L*(Math.abs(dm)>0.01?cfg.hs*(ec-ew)/dm:ew), tv=0;
    if(cfg.top){ function Gm(m){ return m<=cfg.top?m:cfg.top+cfg.he*(1-Math.exp(-(m-cfg.top)/cfg.he)); }
      tv=cfg.sv*L*(Math.abs(dm)>0.01?(Gm(mw)-Gm(mc))/dm:(mw<=cfg.top?1:Math.exp(-(mw-cfg.top)/cfg.he))); }
    return [th,tv]; }
  F4.candidate=function(cfg){ var S=F4.samples(), c=[landCam.position.x,landCam.position.y,landCam.position.z], m=0,a=0,b=0,vm=0,va=0;
    S.forEach(function(p){ var t=tau(c,p,cfg), k=1-Math.exp(-t[0]); m+=k; if(k>0.5) a++; if(k>0.9) b++; var kv=Math.min(cfg.vmax||1,1-Math.exp(-t[1])); vm+=kv; if(kv>0.5) va++; });
    var tt=tau(c,[orbitTarget.x,orbitTarget.y,orbitTarget.z],cfg);
    var eyeM=DATUM+landCam.position.y/DISPLAY.factor*MPW;
    return {eyeM:+eyeM.toFixed(0),hazeAtTarget:+(1-Math.exp(-tt[0])).toFixed(3),haze:{mean:+(m/S.length).toFixed(3),over50:+(a/S.length).toFixed(3),over90:+(b/S.length).toFixed(3)},
      valley:cfg.top?{mean:+(vm/S.length).toFixed(3),over50:+(va/S.length).toFixed(3),atTarget:+Math.min(cfg.vmax||1,1-Math.exp(-tt[1])).toFixed(3)}:null}; };
  /* the drawn formations under the top: the share of their seated figures (world units, the drawn ground) */
  F4.figuresUnder=function(top){ var n=0,u=0,K=DISPLAY.factor; Object.keys(units).forEach(function(id){ var r=units[id]; if(!r.block||!r.block.visible) return;
    var y=r.block.position.y, m=DATUM+y/K*MPW; n++; if(m<top) u++; }); return {formations:n,under:u}; };
  /* elevations of the drawn formations now (the model height, metres) */
  F4.elev=function(){ var out=[]; Object.keys(FORMATIONS).forEach(function(id){ var q=posNow(id); if(!q) return; var w=W(q[0],q[1]), f=FORMATIONS[id];
    out.push({id:id,side:f.nation==="fr"?"fr":"al",name:f.name||f.n||id,men:f.strength||null,m:+G.elevM(height(w[0],w[1])).toFixed(0),drawn:!!(units[id]&&units[id].block&&units[id].block.visible)}); });
    return out; };
  F4.places=function(){ return FEATURES.map(function(ft){ var w=W(ft.p[0],ft.p[1]); return {id:ft.id,m:+G.elevM(height(w[0],w[1])).toFixed(0)}; }); };
  /* the chunks */
  var C=THREE.ShaderChunk, orig={pv:C.fog_pars_vertex,v:C.fog_vertex,pf:C.fog_pars_fragment,f:C.fog_fragment}, tagN=0;
  F4.chunks=function(cfg,vcol){
    if(!cfg){ C.fog_pars_vertex=orig.pv; C.fog_vertex=orig.v; C.fog_pars_fragment=orig.pf; C.fog_fragment=orig.f; }
    else {
      var num=function(x){ var s=String(+x); return s.indexOf(".")<0&&s.indexOf("e")<0?s+".0":s; };
      C.fog_pars_vertex="#ifdef USE_FOG\n\tvarying float fogDepth;\n\tvarying vec3 vFogW;\n#endif";
      C.fog_vertex="#ifdef USE_FOG\n\tfogDepth = - mvPosition.z;\n\tvec3 fgT = mvPosition.xyz - viewMatrix[3].xyz;\n\tvFogW = vec3( dot( viewMatrix[0].xyz, fgT ), dot( viewMatrix[1].xyz, fgT ), dot( viewMatrix[2].xyz, fgT ) );\n#endif";
      C.fog_pars_fragment=orig.pf+"\n#ifdef USE_FOG\n\tvarying vec3 vFogW;\n#endif";
      var K=num(DISPLAY.factor), D=num(DATUM), M=num(MPW);
      C.fog_fragment=["#ifdef USE_FOG",
        "\tvec3 fgS = cameraPosition;",
        cfg.focus?"\tfgS = cameraPosition + ( vFogW - cameraPosition ) * ( min( length( vFogW - cameraPosition ), "+num(cfg.focus)+" ) / max( length( vFogW - cameraPosition ), 1e-6 ) );":"",
        "\tvec3 fgD = vFogW - fgS; float fgL = length( vec3( fgD.x, fgD.y / "+K+", fgD.z ) );",
        "\tfloat mc = "+D+" + fgS.y / "+K+" * "+M+", mw = "+D+" + vFogW.y / "+K+" * "+M+", dm = mw - mc;",
        "\tfloat ec = exp( -( mc - "+num(cfg.m0)+" ) / "+num(cfg.hs)+" ), ew = exp( -( mw - "+num(cfg.m0)+" ) / "+num(cfg.hs)+" );",
        "\tfloat tauH = "+num(cfg.sig)+" * fgL * ( abs( dm ) > 0.01 ? "+num(cfg.hs)+" * ( ec - ew ) / dm : ew );",
        "\tvec3 fgC = mix( gl_FragColor.rgb, fogColor, 1.0 - exp( - tauH ) );",
        cfg.top?["\tfloat tp = "+num(cfg.top)+", he = "+num(cfg.he)+";",
          "\tfloat gc = mc <= tp ? mc : tp + he * ( 1.0 - exp( -( mc - tp ) / he ) );",
          "\tfloat gw = mw <= tp ? mw : tp + he * ( 1.0 - exp( -( mw - tp ) / he ) );",
          "\tfloat tauV = "+num(cfg.sv)+" * fgL * ( abs( dm ) > 0.01 ? ( gw - gc ) / dm : ( mw <= tp ? 1.0 : exp( -( mw - tp ) / he ) ) );",
          "\tfgC = mix( fgC, vec3("+num(vcol.r)+","+num(vcol.g)+","+num(vcol.b)+"), min( "+num(cfg.vmax)+", 1.0 - exp( - tauV ) ) );"].join("\n"):"",
        "\tgl_FragColor.rgb = fgC;",
        "#endif"].join("\n");
    }
    tagN++; var tag="stage4-fog-"+tagN;
    scene.traverse(function(o){ var ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];
      ms.forEach(function(m){ if(!m.fog) return; if(m.__k0===undefined) m.__k0=m.customProgramCacheKey.call(m); var k0=m.__k0; m.customProgramCacheKey=function(){ return k0+"|"+tag; }; m.needsUpdate=true; }); });
    F4.cfg=cfg; return tag; };
  F4.mist=function(on){ world.mist.visible=on&&world.mist.children[0].material.opacity>0.012; };
  F4.mistC=function(){ var c=world.mist.children[0]?world.mist.children[0].material.color:new THREE.Color(0.7,0.7,0.7); return {r:+c.r.toFixed(4),g:+c.g.toFixed(4),b:+c.b.toFixed(4)}; };
  F4.frame=function(){ var w=0,p=0; for(var i=0;i<3;i++){ renderFrame(); w+=DEV.tWorld; p+=DEV.tPost; } return {world:+(w/3).toFixed(1),post:+(p/3).toFixed(1)}; };
  F4.layer=function(){ mlLayout(); var t=[]; for(var i=0;i<3;i++){ var a=performance.now(); mlLayout(); t.push(performance.now()-a); } t.sort(function(a,b){ return a-b; });
    return {dropped:ML.stats.dropped,placed:ML.stats.placed,ms:+t[1].toFixed(2)}; };
  window.__f4=F4; return true;
};

const LAND=CASES.filter(c=>!c.fresh&&c.mode!=="staff"&&!c.interact&&c.viewport[0]===1600);
(async()=>{
  const browser=await launch(), out=fs.existsSync(OUT)?JSON.parse(fs.readFileSync(OUT,"utf8")):{};
  out.when=new Date().toISOString();
  const page=await open(browser,[1600,900]);
  await page.evaluate(PROBE.toString().replace(/^function\s*\(\)\s*\{/,"(function(){")+")()");
  const MPW=await page.evaluate(()=>GEOREF.M_PER_WORLD), sig=km=>+(3.912/km*MPW/1000).toFixed(5);
  const save=()=>fs.writeFileSync(OUT,JSON.stringify(out,null,1));
  if(ONLY.includes("today")){
    out.today={};
    for(const c of LAND){
      await page.evaluate(s=>window.__aus.apply(s),c); await settle(page);
      const r=await page.evaluate(()=>__f4.today()); r.clock=c.t; r.factor=c.factor||4;
      out.today[c.name]=r; console.log("today",c.name.padEnd(22),JSON.stringify(r)); save();
    }
  }
  if(ONLY.includes("model")){
    out.model={clocks:{}};
    for(const t of [300,420,480,510,525]){
      await page.evaluate(t=>{ setClock(t,{instant:true,force:true,camera:false}); AUSTERLITZ_DEBUG.settle(30); },t);
      out.model.clocks[t]=await page.evaluate(()=>__f4.elev());
    }
    out.model.places=await page.evaluate(()=>__f4.places());
    out.model.gt=await page.evaluate(()=>Object.keys(GEOREF.GT).filter(k=>GEOREF.GT[k].elev).map(k=>{ const g=GEOREF.GT[k], w=W(g.map[0],g.map[1]); return {id:k,sourced:g.elev,model:+GEOREF.elevM(height(w[0],w[1])).toFixed(0)}; }));
    const at=out.model.clocks[480], tops=[210,220,230,240,250,260,270,280,290,300,310,320,330];
    out.model.tops=tops.map(top=>{ const u=at.filter(f=>f.drawn&&f.m<top), s=k=>u.filter(f=>f.side===k);
      return {top,fr:s("fr").length,al:s("al").length,frIds:s("fr").map(f=>f.id),alIds:s("al").map(f=>f.id)}; });
    console.log("model: tops at 08:00",JSON.stringify(out.model.tops.map(t=>[t.top,t.fr,t.al])));
    console.log("model: soult's",JSON.stringify(Object.fromEntries(Object.entries(out.model.clocks).map(([t,a])=>[t,a.filter(f=>["sthilaire","vandamme","legrand","c_iv","gqg","kollo","lang","prz","dok","kienmayer","bag","ahq"].includes(f.id)).map(f=>f.id+" "+f.m)]))));
    console.log("model: gt",JSON.stringify(out.model.gt));
    save();
  }
  if(ONLY.includes("render")){
    out.render={};
    const H1={m0:200,hs:400,sig:sig(10)}, H2={m0:200,hs:400,sig:sig(20)};
    const V=top=>Object.assign({},H1,{top,he:15,sv:sig(0.2),vmax:0.85});
    const VIEWS=[["overview-field",null],["overview-plan",null],["close-sokolnitz",null],["pratzen-low",null],["ph8-overview-study",null],
      ["overview-field",480],["close-sokolnitz",500],["pratzen-low",510]];
    const shots=[];
    for(const fk of [1,4,"model"]){
      for(const [name,tOver] of VIEWS){
        if(fk!==4&&!["overview-plan","pratzen-low","close-sokolnitz"].includes(name)) continue;
        const c=CASES.find(x=>x.name===name), spec=Object.assign({},c,{factor:fk},tOver?{t:tOver}:{});
        const key=name+(tOver?"@t"+tOver:"")+"@"+(fk==="model"?"10.33":fk)+"x";
        await page.evaluate(s=>window.__aus.apply(s),spec); await settle(page);
        const vcol=await page.evaluate(()=>__f4.mistC()), rows=[];
        const cands=[["H0",null],["H1",H1],["H2",H2]].concat(tOver?[["V238",V(238.2)],["V260",V(260)]]:[]);
        for(const [k,cfg] of cands){
          await page.evaluate(([cfg,vcol])=>{ __f4.chunks(cfg,vcol); __f4.mist(!cfg||!cfg.top); },[cfg,vcol]);
          const fr=await page.evaluate(()=>__f4.frame());
          const buf=await page.screenshot({timeout:180000}), b64=buf.toString("base64");
          const px=await page.evaluate(b=>window.__aus.pixels(b),b64);
          const tc=await page.evaluate(b=>window.__aus.textContrast(b),b64);
          const ly=await page.evaluate(()=>__f4.layer());
          const an=cfg?await page.evaluate(cfg=>__f4.candidate(cfg),cfg):await page.evaluate(()=>__f4.today());
          const fu=cfg&&cfg.top?await page.evaluate(t=>__f4.figuresUnder(t),cfg.top):null;
          rows.push({cand:k,frameMs:fr,nearBlack:px.nearBlack,solidBlocks:px.solidBlocks,meanLum:px.meanLum,contrast:{texts:tc.texts,min:tc.min,belowAA:tc.belowAA.length},layer:ly,analytic:an,figuresUnder:fu});
          shots.push({key:key+":"+k,png:buf});
        }
        await page.evaluate(()=>{ __f4.chunks(null); __f4.mist(true); });
        out.render[key]={clock:spec.t,dropLimit:T.DROP_LIMIT[name],rows};
        console.log("render",key.padEnd(32),rows.map(r=>r.cand+": lum "+r.meanLum+" AA- "+r.contrast.belowAA+" min "+r.contrast.min+" drop "+r.layer.dropped+" world "+r.frameMs.world+"ms"+(r.analytic.haze?" haze "+r.analytic.haze.mean+"/"+r.analytic.haze.over90:" fog "+(r.analytic.withShift&&r.analytic.withShift.mean))+(r.figuresUnder?" under "+r.figuresUnder.under+"/"+r.figuresUnder.formations:"")+(r.analytic.eyeM?" eye "+r.analytic.eyeM+" m":"")).join(" | "));
        save();
      }
    }
    if(opt("--sheet")){
      const pick=["overview-plan@1x:H0","overview-plan@1x:H1","overview-plan@4x:H0","overview-plan@4x:H1","overview-plan@10.33x:H0","overview-plan@10.33x:H1",
        "overview-field@t480@4x:H0","overview-field@t480@4x:V238","overview-field@t480@4x:V260","pratzen-low@t510@4x:H0","pratzen-low@t510@4x:V238","pratzen-low@t510@4x:V260"];
      const tiles=pick.map(k=>{ const s=shots.find(x=>x.key===k); return s?{png:s.png,cap:k}:null; }).filter(Boolean);
      fs.writeFileSync(opt("--sheet"),await sheet(page,tiles,3,560,315,"Stage 4 Part A: the atmosphere (tools/stage4/fog-probe.js)"));
    }
  }
  if(ONLY.includes("focus")){
    /* H3: H1's haze counted only beyond the orbit target's distance (the subject clear, what lies behind it receding), the focus
       distance baked per view; V55: the valley fog at 238.2 m drawn at most 55% opaque */
    out.focus={};
    const H1={m0:200,hs:400,sig:sig(10)};
    for(const [name,t] of [["overview-field",null],["overview-plan",null],["close-sokolnitz",null],["pratzen-low",null],["ph8-overview-study",null],["overview-field",480],["pratzen-low",510]]){
      const c=CASES.find(x=>x.name===name); await page.evaluate(s=>window.__aus.apply(s),Object.assign({},c,t?{t}:{})); await settle(page);
      const vcol=await page.evaluate(()=>__f4.mistC()), F=await page.evaluate(()=>landCam.position.distanceTo(orbitTarget)), rows=[];
      const cands=t?[["V55",Object.assign({},H1,{focus:F,top:238.2,he:15,sv:sig(0.2),vmax:0.55})]]:[["H3",Object.assign({},H1,{focus:F})]];
      for(const [k,cfg] of cands){
        await page.evaluate(([cfg,vcol])=>{ __f4.chunks(cfg,vcol); __f4.mist(!cfg.top); },[cfg,vcol]);
        await page.evaluate(()=>{ for(let i=0;i<3;i++) renderFrame(); });
        const buf=await page.screenshot({timeout:180000}), b64=buf.toString("base64");
        const px=await page.evaluate(b=>window.__aus.pixels(b),b64), tc=await page.evaluate(b=>window.__aus.textContrast(b),b64), ly=await page.evaluate(()=>__f4.layer());
        const an=await page.evaluate(cfg=>__f4.candidate(cfg),cfg), fu=cfg.top?await page.evaluate(t=>__f4.figuresUnder(t),cfg.top):null;
        rows.push({cand:k,focus:+F.toFixed(1),nearBlack:px.nearBlack,solidBlocks:px.solidBlocks,meanLum:px.meanLum,contrast:{texts:tc.texts,min:tc.min,belowAA:tc.belowAA.length},layer:ly,analytic:an,figuresUnder:fu});
        if(opt("--png")) fs.writeFileSync(path.join(opt("--png"),"fog-"+name+(t?"-t"+t:"")+"-"+k+".png"),buf);
      }
      await page.evaluate(()=>{ __f4.chunks(null); __f4.mist(true); });
      out.focus[name+(t?"@t"+t:"")+"@4x"]={rows}; console.log("focus",name,t||"",JSON.stringify(rows).slice(0,500)); save();
    }
  }
  if(ONLY.includes("cost")){
    /* the frame cost once compiled, each candidate on a fresh page (one page compiling every candidate in turn slowed down by an
       order of magnitude in software WebGL, H0 included): 5 frames to warm up, then the median of 15 world passes */
    out.cost={};
    const H1={m0:200,hs:400,sig:sig(10)}, V238=Object.assign({},H1,{top:238.2,he:15,sv:sig(0.2),vmax:0.55});
    for(const [name,t] of [["overview-field",480],["pratzen-low",510],["overview-plan",null]]){
      const row={};
      for(const [k,cfg] of [["H0",null],["H1",H1],["V238",V238]]){
        const pg=await open(browser,[1600,900]); await pg.evaluate(PROBE.toString().replace(/^function\s*\(\)\s*\{/,"(function(){")+")()");
        const c=CASES.find(x=>x.name===name); await pg.evaluate(s=>window.__aus.apply(s),Object.assign({},c,t?{t}:{})); await settle(pg);
        const vcol=await pg.evaluate(()=>__f4.mistC());
        row[k]=await pg.evaluate(([cfg,vcol])=>{ if(cfg){ __f4.chunks(cfg,vcol); __f4.mist(!cfg.top); } for(let i=0;i<5;i++) renderFrame();
          const t=[]; for(let i=0;i<15;i++){ renderFrame(); t.push(DEV.tWorld); } t.sort((a,b)=>a-b); return +t[7].toFixed(1); },[cfg,vcol]);
        await pg.close();
      }
      out.cost[name+(t?"@t"+t:"")]=row; console.log("cost",name,JSON.stringify(row)); save();
    }
  }
  if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  save(); await browser.close();
})().catch(e=>{ console.error(e); process.exit(2); });
