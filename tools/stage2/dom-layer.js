#!/usr/bin/env node
/* Stage 2 Part A, section F (owner decision 24): a scratch PROBE of one DOM/SVG layer for counters and all map
   text, for measurement only (not the 2D implementation). In each harness view the canvas label sprites are
   hidden and the same items are laid out as DOM elements in one priority-ordered pass:
     priority: the selection; the highlighted family; counters army > corps > division > brigade (larger first);
     events (most live first); the plateau statistic; movement (overlay) labels; formation names; place labels
     (major first); terrain-study labels; objective names.
     content: counters COMPACT (a 40 x 28 px cased frame in the side colour with the nation fill and tag, the
     echelon mark, the B / C / ? badge, and the short name at 12.5 px); FULL for the selection and the highlighted
     family (+ strength and status at 12.5 px). Text elements carry their own words at the type scale.
     placement: at the anchor (bottom-centre 6 px above the point 2.2 units over the ground, where counters stand today), else eight neighbours, else rings of
     24-144 px around it with a leader line; never over a fixed panel or another placed element (2 px pad); an
     element that finds no place is dropped and counted. Occlusion: a ray from the eye to the anchor against the
     terrain mesh; an anchor behind the drawn ground is dropped and counted.
   Measured per view: elements placed, displaced (with a leader), dropped for room, occluded, overlaps among placed
   elements and with panels (checked independently after layout), the layout pass time (median of 5), the DOM node
   count, and today's canvas pass for comparison (the harness's own overlap count and LABEL_STATS).
   node tools/stage2/dom-layer.js <outdir> */
const fs=require("fs"), path=require("path"), P=require("./page.js");
/* it measures the Stage 0 canvas path (its sprites), on builds up to Stage 2C (archive/stage2c-68ac7721.html); from Stage 2D
   the harness (tools/visual/measure.js) measures the map layer */
async function canvasPath(page){ if(!await page.evaluate(()=>{ var k=Object.keys(units)[0]; return !!(k&&units[k].sprite); })){
  console.error("this build has no canvas labels (Stage 2D or later): run it on archive/stage2c-68ac7721.html (AUSTERLITZ_HTML)"); process.exit(2); } }
const out=path.resolve(process.argv[2]||path.join(__dirname,"out","dom")); fs.mkdirSync(out,{recursive:true});
const PROBE=`window.__dom=function(){
  var old=document.getElementById("s2layer"); if(old) old.remove();
  var root=document.createElement("div"); root.id="s2layer";
  root.style.cssText="position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:5;font-family:"+TOKENS.type.sans;
  var svg=document.createElementNS("http://www.w3.org/2000/svg","svg"); svg.setAttribute("width",innerWidth); svg.setAttribute("height",innerHeight);
  svg.style.cssText="position:absolute;left:0;top:0"; root.appendChild(svg);
  document.body.appendChild(root);
  var paper=mode==="staff", T=TOKENS.theme[paper?"paper":"dark"], K=TOKENS.sym.counter[paper?"paper":"dark"], LB=TOKENS.sym.label[paper?"paper":"dark"];
  function vis(o){ while(o){ if(!o.visible) return false; o=o.parent; } return true; }
  function txt(cv){ return ((cv&&cv.__runs)||[]).map(function(r){ return r.t; }).join(" ").trim(); }
  var items=[], hidden=[];
  function hide(sp){ if(sp){ hidden.push([sp,sp.visible]); sp.visible=false; } }
  var ECH={army:0,corps:1,div:2,bde:3}, isSel=function(k,id){ return !!(selection&&selection.kind===k&&selection.id===id); };
  function counter(id,rec){
    var sp=rec.sprite; if(!sp||!vis(sp)) return; var f=FORMATIONS[id], p=posNow(id); if(!p) return;
    var w=W(p[0],p[1]), full=isSel("f",id)||!!(highlight&&highlight[id]);
    var side=sideOfNation(f.nation), S=TOKENS.sym.side[side], N=NATION[f.nation], cf=aggConf(id,curPhase), st=aggStatus(id,curPhase);
    var e=document.createElement("div"); e.className="s2c";
    var ech={army:"XXXX",corps:"XXX",div:"XX",bde:"X"}[f.ech]||"";
    var nm=(f.name||"").replace("'s Division","").replace("'s Dragoons","").replace("'s Cuirassiers","");
    e.innerHTML='<div style="display:flex;align-items:center;gap:6px"><div style="position:relative;width:40px;height:28px;box-sizing:border-box;background:'+N.fill+
      ';border:3px solid '+S.base+';outline:1px solid '+TOKENS.sym.keyline+';box-shadow:inset 0 0 0 1px '+TOKENS.sym.keyline+
      '"><span style="position:absolute;left:2px;bottom:0;font:600 10.5px/1 '+TOKENS.type.sans+';color:'+N.ink+'">'+N.tag+'</span>'+
      '<span style="position:absolute;right:-9px;top:-9px;font:600 10.5px/1 '+TOKENS.type.sans+';color:'+K.badgeInk+';background:'+K.badgePlate+';padding:1px 3px;display:'+(cf==="A"?"none":"block")+'">'+(cf||"")+'</span>'+
      '<span style="position:absolute;left:0;right:0;top:-14px;text-align:center;font:500 10.5px/1 '+TOKENS.type.sans+';color:'+K.ink+'">'+ech+'</span></div>'+
      '<div style="font:500 12.5px/1.25 '+TOKENS.type.sans+';color:'+K.ink+';text-shadow:0 0 3px '+K.halo+',0 0 3px '+K.halo+'">'+nm+
      (full?'<br><span style="font-weight:400">≈'+(f.strength||aggStrength(id)||"?").toLocaleString()+' · '+(STATUS[st]?STATUS[st].label:"")+'</span>':'')+'</div></div>';
    items.push({el:e,world:new THREE.Vector3(w[0],height(w[0],w[1])+2.2,w[1]),pri:isSel("f",id)?0:full?1:2+(ECH[f.ech]||2)*0.1-(aggStrength(id)||0)/1e7,kind:"counter",id:id});
  }
  function text(sp,kind,pri,px,col,serif){
    if(!sp||!vis(sp)||!sp.material||sp.material.opacity<0.05) return; var s=txt(sp.material.map&&sp.material.map.image); if(!s) return;
    var a=sp.userData.anchor||sp.position, e=document.createElement("div");
    e.textContent=s; e.style.cssText="font:"+(serif?"400 "+px+"px "+TOKENS.type.serif:"400 "+px+"px "+TOKENS.type.sans)+";color:"+col+";white-space:nowrap;text-shadow:0 0 3px "+LB.halo+",0 0 3px "+LB.halo+",0 0 2px "+LB.halo;
    items.push({el:e,world:a.clone(),pri:pri,kind:kind,id:s});
  }
  Object.keys(units).forEach(function(id){ if(units[id].sprite.visible) counter(id,units[id]); hide(units[id].sprite); hide(units[id].stem); });
  Object.keys(aggregates).forEach(function(id){ if(aggregates[id].sprite.visible) counter(id,aggregates[id]); hide(aggregates[id].sprite); hide(aggregates[id].stem); });
  (eventMarks||[]).forEach(function(m){ text(m.ls,"event",3+(1-evWeight(m.e,clock))*0.5,12.5,LB.annotation,false); hide(m.ls); });
  if(plateauLabel){ text(plateauLabel,"plateau",4,12.5,LB.annotation,false); hide(plateauLabel); }
  (overlayLabels||[]).forEach(function(s){ text(s,"overlay",5,12.5,LB.annotation,true); hide(s); });
  Object.keys(units).forEach(function(id){ var l=units[id].nameLabel; text(l,"name",6,12.5,LB.ink,true); hide(l); });
  (featureSprites||[]).forEach(function(o){ text(o.sprite,"place",MAJOR_FEATURES[o.ft.id]?7:7.5,11.5,TOKENS.sym.place[paper?"paper":"dark"].other,false); hide(o.sprite); });
  (analysisSprites||[]).forEach(function(o){ text(o.sprite,"analysis",8,11.5,LB.annotation,false); hide(o.sprite); });
  items.forEach(function(it){ it.el.style.position="absolute"; it.el.style.left="0px"; it.el.style.top="0px"; it.el.style.visibility="hidden"; root.appendChild(it.el);
    it.w=it.el.offsetWidth; it.h=it.el.offsetHeight; });
  items.sort(function(a,b){ return a.pri-b.pri; });
  function layout(){
    camera.updateMatrixWorld(true);
    var t0=performance.now(), taken=[], panels=[], st={placed:0,displaced:0,dropped:0,occluded:0,offscreen:0,rayMs:0};
    [".rail",".dispatch",".legend",".timebar",".tools","#viewmode","#firstrun",".drawer","#tourbar","#selchip","#layerpop"].forEach(function(s){
      document.querySelectorAll(s).forEach(function(e){ var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||e.hidden||+cs.opacity<0.05) return;
        if(e.classList.contains("drawer")&&!e.classList.contains("on")) return; if(e.classList.contains("rail")&&document.body.classList.contains("rail-hidden")) return;
        var r=e.getBoundingClientRect(); if(r.width>0&&r.height>0) panels.push([r.left,r.top,r.right,r.bottom]); }); });
    var rc=new THREE.Raycaster(), eye=camera.position, dir=new THREE.Vector3();
    function hit(r,L){ for(var i=0;i<L.length;i++){ var q=L[i]; if(!(r[2]+2<=q[0]||q[2]+2<=r[0]||r[3]+2<=q[1]||q[3]+2<=r[1])) return true; } return false; }
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    var RINGS=[24,40,56,72,96,120,144], ANG=12;
    items.forEach(function(it){
      it.el.style.visibility="hidden";
      var v=it.world.clone().project(camera); if(v.z>1||Math.abs(v.x)>1||Math.abs(v.y)>1){ st.offscreen++; return; }
      var ax=(v.x*0.5+0.5)*innerWidth, ay=(-v.y*0.5+0.5)*innerHeight;
      var tr=performance.now(); dir.copy(it.world).sub(eye); var dist=dir.length(); dir.normalize(); rc.set(eye,dir); rc.far=dist-0.8;
      var occ=rc.intersectObject(groundMesh,false).length>0; st.rayMs+=performance.now()-tr; if(occ){ st.occluded++; return; }
      var c=[[0,-1],[1,-1],[-1,-1],[1,0],[-1,0],[0,0],[1,1],[-1,1]], best=null;
      function rect(dx,dy){ var x=ax+dx-it.w/2, y=ay+dy-it.h-6; return [x,y,x+it.w,y+it.h]; }
      for(var i=0;i<c.length&&!best;i++){ var r=rect(c[i][0]*(it.w/2+4),c[i][1]===-1?0:c[i][1]===0?it.h/2+6:it.h+12);
        if(r[0]>=0&&r[1]>=0&&r[2]<=innerWidth&&r[3]<=innerHeight&&!hit(r,taken)&&!hit(r,panels)) best={r:r,lead:false}; }
      for(var k=0;k<RINGS.length&&!best;k++) for(var a=0;a<ANG&&!best;a++){ var th=a/ANG*Math.PI*2-Math.PI/2, r2=rect(Math.cos(th)*RINGS[k],Math.sin(th)*RINGS[k]+it.h/2);
        if(r2[0]>=0&&r2[1]>=0&&r2[2]<=innerWidth&&r2[3]<=innerHeight&&!hit(r2,taken)&&!hit(r2,panels)) best={r:r2,lead:true}; }
      if(!best){ st.dropped++; return; }
      taken.push(best.r); it.r=best.r; st.placed++;
      it.el.style.transform="translate("+Math.round(best.r[0])+"px,"+Math.round(best.r[1])+"px)"; it.el.style.visibility="visible";
      if(best.lead){ st.displaced++; var ln=document.createElementNS("http://www.w3.org/2000/svg","line");
        var bx=Math.max(best.r[0],Math.min(ax,best.r[2])), by=Math.max(best.r[1],Math.min(ay,best.r[3]));
        ln.setAttribute("x1",ax); ln.setAttribute("y1",ay); ln.setAttribute("x2",bx); ln.setAttribute("y2",by);
        ln.setAttribute("stroke",T["text-muted"]); ln.setAttribute("stroke-width","1"); svg.appendChild(ln);
        var dot=document.createElementNS("http://www.w3.org/2000/svg","circle"); dot.setAttribute("cx",ax); dot.setAttribute("cy",ay); dot.setAttribute("r","2"); dot.setAttribute("fill",T["text-muted"]); svg.appendChild(dot); }
    });
    st.ms=performance.now()-t0;
    /* an independent check: overlaps among placed boxes (as rendered) and with panels */
    var R=[]; items.forEach(function(it){ if(it.el.style.visibility==="visible"){ var b=it.el.getBoundingClientRect(); R.push([b.left,b.top,b.right,b.bottom]); } });
    var ov=0, ovp=0; for(var i2=0;i2<R.length;i2++){ for(var j=i2+1;j<R.length;j++){ var A=R[i2],B=R[j]; if(Math.min(A[2],B[2])-Math.max(A[0],B[0])>1&&Math.min(A[3],B[3])-Math.max(A[1],B[1])>1) ov++; }
      panels.forEach(function(q){ if(Math.min(R[i2][2],q[2])-Math.max(R[i2][0],q[0])>1&&Math.min(R[i2][3],q[3])-Math.max(R[i2][1],q[1])>1) ovp++; }); }
    st.overlaps=ov; st.panelOverlaps=ovp; return st;
  }
  var times=[], st; for(var n=0;n<5;n++){ st=layout(); times.push(st.ms); } times.sort(function(a,b){ return a-b; });
  st.ms=+times[2].toFixed(2); st.rayMs=+st.rayMs.toFixed(2); st.items=items.length; st.domNodes=root.getElementsByTagName("*").length+1;
  st.byKind={}; items.forEach(function(it){ var k=st.byKind[it.kind]=st.byKind[it.kind]||{n:0,shown:0}; k.n++; if(it.el.style.visibility==="visible") k.shown++; });
  renderFrame();
  window.__domRestore=function(){ hidden.forEach(function(h){ h[0].visible=h[1]; }); root.remove(); };
  return st;
};`;
(async()=>{
  const b=await P.launch(), res={};
  let page=null, vpKey="";
  for(const c of P.CASES.filter(c=>!process.env.ONLY||process.env.ONLY.split(",").includes(c.name))){
    const key=c.viewport.join("x")+(c.fresh?":"+c.name:"");
    if(key!==vpKey||c.fresh){ if(page) await page.close(); page=await P.open(b,c.viewport,null,
      `(function(){var C=CanvasRenderingContext2D.prototype,ft=C.fillText;C.fillText=function(t){try{(this.canvas.__runs=this.canvas.__runs||[]).push({t:String(t)});}catch(e){} return ft.apply(this,arguments);};})();`);
      await canvasPath(page); await page.evaluate(PROBE); vpKey=key; }
    if(!c.fresh) await P.applyCase(page,c); else await P.settle(page);
    const before=await page.evaluate(()=>{ const o=__aus.overlaps(); return {visible:o.visible,pairs:o.pairs,stats:Object.assign({},LABEL_STATS)}; });
    /* today's label pass cost: the declutter pass timed (median of 5) */
    before.declutterMs=await page.evaluate(()=>{ const t=[]; for(let i=0;i<5;i++){ const a=performance.now(); declutter(); t.push(performance.now()-a); } t.sort((x,y)=>x-y); return +t[2].toFixed(2); });
    const st=await page.evaluate(()=>__dom());
    fs.writeFileSync(path.join(out,c.name+"-dom.png"),await page.screenshot({timeout:300000}));
    await page.evaluate(()=>{ __domRestore(); requestRender(3); });
    res[c.name]={canvasToday:before,dom:st};
    console.log(c.name.padEnd(20),"today: visible",before.visible,"overlaps",JSON.stringify(before.pairs),"stats",JSON.stringify(before.stats),"declutter ms",before.declutterMs,
      "| dom:",JSON.stringify(st));
  }
  fs.writeFileSync(path.join(out,process.env.ONLY?"dom-only.json":"dom.json"),JSON.stringify(res,null,1));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(2); });
