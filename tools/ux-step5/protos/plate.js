/* UI/UX roadmap step 5 (docs/UX_ART_AUDIT.md UA-08, Direction B): the paper plate as an in-page prototype, put into the live page after it started
   (nothing here is in the source). window.__u5.install(o) / uninstall(); o:
   - surround: the apron drawn in the paper's own tone on the paper map (unlit, its colour put through the inverse of the post pass's tone curve);
   - neatline: a north-aligned double neatline round the free rectangle the field is framed in (MAPCAM.freeRect over the field's extent);
   - hold: "none" | "framed" | "always": the map layer laid out inside the neatline (outside it a panel for the layer: no item placed there, an anchor
     there not drawn and not dropped), while the field is shown as framed (MAPCAM.framed()) or always on the paper map; with neatline "framed" the
     neatline itself is drawn only while framed;
   - holdCounters: hold the counters alone (every other item as before);
   - cart: "none" | "margin" | "inside": the title cartouche (the date, the clock, the phase's title, its act and span) in the plate's margin beside
     the neatline where it fits, else in the free rectangle's band beside the field's box; a panel for the layer while drawn; "phone" false keeps it
     off below 720 px;
   - names: "none" | "rank" | "base": the twelve villages (tools/ux-step5/villages.js) at entry: "rank", the ten the map layer has a place for
     collected on the paper map and ranked at o.rank (3.95: under the counters, before the live events); "base", all twelve as a base lettering laid
     out after the layer in the room it leaves (never moving a layer item), a village whose own place the layer draws left to it.
   Measurement only. */
(function(){
  var TWELVE=[["sokolnitz","Sokolnitz"],["telnitz","Telnitz"],["augezd","Augezd"],["blasowitz","Blasowitz"],["kobelnitz","Kobelnitz"],["puntowitz","Puntowitz"],
    ["austerlitz","Austerlitz"],["pratzenv","Pratzen village"],["krzenowitz","Krzenowitz"],[null,"Holubitz"],[null,"Krug"],["girzikowitz","Girzikowitz"]];
  var O=null, orig={}, el={}, apronMat=null, apronKeep=null, NL=null, CB=null, stats={passes:0};
  function q(id){ return document.getElementById(id); }
  function staff(){ return mode==="staff"; }
  function fieldExt(){ var N=MAPCAM.north, E=MAPCAM.east, a0=1e9,a1=-1e9,b0=1e9,b1=-1e9; MAPCAM.field.forEach(function(p){ var a=p[0]*E.x+p[1]*E.z, b=p[0]*N.x+p[1]*N.z; a0=Math.min(a0,a); a1=Math.max(a1,a); b0=Math.min(b0,b); b1=Math.max(b1,b); }); return [a1-a0,b1-b0]; }
  function holdOn(){ if(!O||!staff()) return false; return O.hold==="always"||(O.hold==="framed"&&MAPCAM.framed()); }
  function neatOn(){ if(!O||!O.neatline||!staff()) return false; return O.neatline!=="framed"||MAPCAM.framed(); }
  /* the post pass's tone curve (Narkowicz's ACES fit, app.js's composite), inverted per channel */
  function acesInv(y){ y=Math.min(0.995,Math.max(0,y)); var a=2.51-2.43*y, b=0.03-0.59*y, c=-0.14*y; return (-b+Math.sqrt(b*b-4*a*c))/(2*a); }
  function surround(on){
    if(!apronMesh) return;
    if(on){ if(!apronMat){ var c=new THREE.Color(O.surroundHex||"#F3EEE2").convertSRGBToLinear(), ex=FX.on&&FX.matComp?FX.matComp.uniforms.exposure.value:1;
        if(FX.on) c.setRGB(acesInv(c.r)/ex,acesInv(c.g)/ex,acesInv(c.b)/ex);
        apronMat=new THREE.MeshBasicMaterial({color:c,fog:false}); }
      if(apronMesh.material!==apronMat){ apronKeep=apronMesh.material; apronMesh.material=apronMat; } }
    else if(apronKeep){ apronMesh.material=apronKeep; apronKeep=null; }
  }
  function fr0(){ return MAPCAM.freeRect(fieldExt(),orig.mlPanels()); }
  function neatBox(){ var f=fr0(), m=O.neatOut||7; return [f[0]-m,f[1]-m,f[2]+m,f[3]+m]; }
  function placeNeat(){
    var on=neatOn(); el.nl.style.display=on?"":"none"; NL=null; if(!on) return;
    var b=neatBox(); NL=b; el.nl.style.left=b[0]+"px"; el.nl.style.top=b[1]+"px"; el.nl.style.width=(b[2]-b[0])+"px"; el.nl.style.height=(b[3]-b[1])+"px";
  }
  /* the cartouche: its words from the data and the labels; its place in the margin beside the neatline, else the band beside the field's box */
  function cartText(){ var P=PHASES[curPhase], act=null; (typeof ACTS!=="undefined"?ACTS:[]).forEach(function(a){ if(a.phases&&a.phases.indexOf(curPhase)>=0) act=a; });
    return {k:"2 December 1805 · "+fmtClock(clock), t:P.title, s:(act?act.n:"")+(act?" · ":"")+phaseSpan(curPhase)}; }
  function placeCart(){
    CB=null; var off=!O||O.cart==="none"||!staff()||(O.cart&&O.phone===false&&innerWidth<720)||(O.cartFramed&&!MAPCAM.framed());
    if(off){ el.cart.style.display="none"; return; }
    var t=cartText(), key=t.k+"|"+t.t+"|"+t.s+"|"+innerWidth;
    if(el.cart.dataset.k!==key){ el.cart.dataset.k=key; el.cart.innerHTML='<small>'+esc(t.k)+'</small><b>'+esc(t.t)+'</b>'+(t.s&&innerWidth>=720?'<i>'+esc(t.s)+'</i>':''); }
    el.cart.style.display=""; el.cart.style.visibility="hidden"; el.cart.style.left="0px"; el.cart.style.top="0px"; el.cart.style.maxWidth="";
    var r=el.cart.getBoundingClientRect(), w=Math.ceil(r.width), h=Math.ceil(r.height), f=fr0(), m=(O.neatOut||7)+8, P=mlPanelsBase();
    function free(x0,y0){ var x1=x0+w, y1=y0+h; if(x0<8||y0<8||x1>innerWidth-8||y1>innerHeight-8) return false;
      for(var i=0;i<P.length;i++){ var p=P[i]; if(x0<p[2]+8&&x1>p[0]-8&&y0<p[3]+8&&y1>p[1]-8) return false; } return true; }
    var cand=[], fb=null;
    if(O.cart==="margin"||O.cart==="inside"){
      if(O.cart==="margin"){ /* right of the neatline, top-aligned under whatever stands above; then left of it; then above and below it */
        for(var y=f[1];y<=f[3]-h;y+=8){ cand.push([f[2]+m,y]); }
        for(var y2=f[1];y2<=f[3]-h;y2+=8){ cand.push([f[0]-m-w,y2]); } }
      /* the band of the free rectangle above or below the field's box (the field framed by one dimension) */
      var C=MAPCAM.field.map(function(p){ return MAPCAM.toScreen(p[0],p[1]); }), bt=Math.min.apply(null,C.map(function(c){ return c[1]; })), bb=Math.max.apply(null,C.map(function(c){ return c[1]; }));
      if(bt-f[1]>=h+4) cand.push([f[0]+4,f[1]+2]); if(f[3]-bb>=h+4) cand.push([f[0]+4,f[3]-h-2]);
    }
    for(var i=0;i<cand.length&&!fb;i++) if(free(cand[i][0],cand[i][1])) fb=cand[i];
    if(!fb){ el.cart.style.display="none"; return; }
    el.cart.style.left=fb[0]+"px"; el.cart.style.top=fb[1]+"px"; el.cart.style.visibility=""; CB=[fb[0],fb[1],fb[0]+w,fb[1]+h];
  }
  function mlPanelsBase(){ return orig.mlPanels(); }
  var inLayout=false;
  function wrapPanels(){ var R=orig.mlPanels(); if(!O||!inLayout) return R;
    if(CB) R.push(CB.slice());
    if(holdOn()&&!O.holdCounters){ var b=NL||neatBox(), g=(O.holdIn===undefined?2:O.holdIn); var x0=b[0]+g, y0=b[1]+g, x1=b[2]-g, y1=b[3]-g, W=innerWidth, H=innerHeight;
      R.push([-10,-10,W+10,y0],[-10,y1,W+10,H+10],[-10,y0,x0,y1],[x1,y0,W+10,y1]); }
    return R; }
  function wrapObst(VW,VH){ var R=orig.mlObstacles(VW,VH); if(inLayout&&FIRST.length) R=R.concat(FIRST); return R; }
  function wrapPlace(it,VW,VH,panels,obst,local){
    if(O&&O.holdCounters&&holdOn()&&it.mode==="counter"){ var b=NL||neatBox(), g=2, x0=b[0]+g, y0=b[1]+g, x1=b[2]-g, y1=b[3]-g;
      panels=panels.concat([[-10,-10,VW+10,y0],[-10,y1,VW+10,VH+10],[-10,y0,x0,y1],[x1,y0,VW+10,y1]]); }
    return orig.mlPlaceItem(it,VW,VH,panels,obst,local); }
  /* "rank": the ten village places collected on the paper map at entry and ranked at o.rank */
  function rankOn(){ return O&&O.names==="rank"&&staff()&&(!O.rankWhen||(MAPCAM.framed()&&(O.rankWhen!=="rest"||!playing))); }
  function wrapCollect(){
    var tw={}; TWELVE.forEach(function(t){ if(t[0]) tw[t[0]]=1; });
    var keep=[]; if(rankOn()) placeLabels.forEach(function(o){ if(tw[o.ft.id]){ keep.push([o,o.show]); o.show=textOn(); } });
    var out=orig.mlCollect();
    keep.forEach(function(k){ k[0].show=k[1]; });
    if(rankOn()) out.forEach(function(it){ if(it.cat==="place"&&it.pick&&tw[it.pick.id]&&!it.keep){ it.pri=O.rank; it.base=O.rank; } });
    return out; }
  /* "base": the twelve as a base lettering after the layer, in the room it leaves */
  var BL={}, FIRST=[];
  function firstOn(){ return O&&O.names==="first"&&staff()&&textOn()&&(O.firstWhen==="always"||((O.firstWhen!=="framed"&&O.firstWhen!=="rest")||MAPCAM.framed())&&(O.firstWhen!=="rest"||!playing)); }
  function baseLetters(VW,VH,pre){
    var on=O&&(O.names==="base"||(O.names==="first"&&(pre||!firstOn())))&&staff()&&textOn();
    TWELVE.forEach(function(t){ var e=BL[t[1]]; if(e&&!on) e.style.display="none"; });
    if(!on) return;
    inLayout=true; var P=wrapPanels(); inLayout=false; var obst=mlObstacles(VW,VH), taken=ML.taken.slice(), placed=[];
    function hit(x0,y0,x1,y1,L){ for(var i=0;i<L.length;i++){ var r=L[i]; if(x0<r[2]+2&&r[0]<x1+2&&y0<r[3]+2&&r[1]<y1+2) return true; } return false; }
    TWELVE.forEach(function(t){
      var nm=t[1], e=BL[nm];
      if(!e){ e=BL[nm]=document.createElement("div"); e.className="u5-pl"; e.dataset.v=nm; e.textContent=nm; e.setAttribute("aria-hidden","true"); el.pl.appendChild(e); e._w=0; }
      var li=t[0]?ML.items["t:"+t[0]]:null; if(!pre&&li&&li.eFrame===ML.frame&&li.state==="on"){ e.style.display="none"; return; }   /* the layer draws it */
      var mp=null, rr=4; if(t[0]){ var ft=FEATURES.filter(function(f){ return f.id===t[0]; })[0]; mp=ft.p; } VILLAGES.forEach(function(v){ if(v[0]===(t[0]==="pratzenv"?"Pratzen":nm)){ if(!mp) mp=[v[1],v[2]]; rr=v[3]; } });
      var w0=W(mp[0],mp[1]), s=MAPCAM.toScreen(w0[0],w0[1]), rpx=rr*0.55/MAPCAM.state().wpp*0.5+3;
      e.style.display="";
      if(!e._w){ var b=e.getBoundingClientRect(); e._w=Math.ceil(b.width); e._h=Math.ceil(b.height); }
      var w=e._w, h=e._h, C=[];
      [0,7,14].forEach(function(dd){ var r0=rpx+dd; C.push([s[0]+r0,s[1]-h/2],[s[0]-r0-w,s[1]-h/2],[s[0]-w/2,s[1]-r0-h],[s[0]-w/2,s[1]+r0],[s[0]+r0*0.7,s[1]-r0*0.7-h],[s[0]-r0*0.7-w,s[1]-r0*0.7-h],[s[0]+r0*0.7,s[1]+r0*0.7],[s[0]-r0*0.7-w,s[1]+r0*0.7]); });
      if(e._c!==undefined){ C.unshift(C[e._c]); }
      var got=-1;
      for(var i=0;i<C.length&&got<0;i++){ var x0=C[i][0], y0=C[i][1], x1=x0+w, y1=y0+h; if(x0<2||y0<2||x1>VW-2||y1>VH-2) continue;
        if(hit(x0,y0,x1,y1,P)||hit(x0,y0,x1,y1,taken)||hit(x0,y0,x1,y1,obst)||hit(x0,y0,x1,y1,placed)) continue; got=i; }
      if(got<0){ e.style.visibility="hidden"; e._on=false; return; }
      var c=C[got]; if(e._c!==undefined&&got===0){} else e._c=(e._c!==undefined?got-1:got);
      e.style.visibility=""; e._on=true; e.style.transform="translate("+Math.round(c[0])+"px,"+Math.round(c[1])+"px)"; placed.push([c[0],c[1],c[0]+w,c[1]+h]);
    });
    if(pre) FIRST=placed.slice();
    stats.base=TWELVE.filter(function(t){ var e=BL[t[1]]; return e&&e._on&&e.style.display!=="none"; }).length;
  }
  function wrapLayout(){
    if(O){ placeNeat(); placeCart(); surround(!!O.surround&&staff()); }
    var VW=renderer.domElement.clientWidth||innerWidth, VH=renderer.domElement.clientHeight||innerHeight;
    FIRST=[]; if(firstOn()){ camera.updateMatrixWorld(); baseLetters(VW,VH,true); }
    inLayout=true; var r; try{ r=orig.mlLayout.apply(this,arguments); } finally { inLayout=false; } stats.passes++;
    if(O&&!firstOn()) baseLetters(VW,VH,false);
    return r; }
  var CSS=[
    "#neatline{position:fixed;z-index:5;pointer-events:none;box-sizing:border-box;border:2px solid #33301F}",
    "#neatline::after{content:'';position:absolute;inset:2px;border:1px solid #33301F}",
    "#cartouche{position:fixed;z-index:7;pointer-events:none;box-sizing:border-box;background:#F6F1E5;border:1px solid #33301F;box-shadow:0 0 0 3px #F6F1E5,0 0 0 4px #33301F;padding:7px 12px 8px;font-family:var(--serif);color:#14120C;max-width:320px}",
    "#cartouche small{display:block;font-family:var(--sans);font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;color:#45412F;margin-bottom:2px}",
    "#cartouche b{display:block;font-weight:400;font-size:21px;line-height:1.15}",
    "#cartouche i{display:block;font-style:normal;font-family:var(--sans);font-size:11.5px;color:#3A362B;margin-top:3px}",
    "@media (max-width:719px){#cartouche{padding:4px 8px 5px;max-width:300px}#cartouche b{font-size:17px}}",
    "#paperletters{position:fixed;inset:0;z-index:6;pointer-events:none;overflow:hidden}",
    ".u5-pl{position:absolute;left:0;top:0;white-space:nowrap;font-family:var(--serif);font-size:12.5px;line-height:15px;letter-spacing:.04em;color:#3A362C;"+
      "text-shadow:1px 0 0 #F6F1E5,0.71px 0.71px 0 #F6F1E5,0 1px 0 #F6F1E5,-0.71px 0.71px 0 #F6F1E5,-1px 0 0 #F6F1E5,-0.71px -0.71px 0 #F6F1E5,0 -1px 0 #F6F1E5,0.71px -0.71px 0 #F6F1E5,2px 0 0 #F6F1E5,1.41px 1.41px 0 #F6F1E5,0 2px 0 #F6F1E5,-1.41px 1.41px 0 #F6F1E5,-2px 0 0 #F6F1E5,-1.41px -1.41px 0 #F6F1E5,0 -2px 0 #F6F1E5,1.41px -1.41px 0 #F6F1E5}"
  ].join("\n");
  window.__u5={
    TWELVE:TWELVE, stats:stats,
    install:function(o){ this.uninstall(); O=Object.assign({surround:true,neatline:true,hold:"none",cart:"none",names:"none",rank:3.95},o||{});
      if(!q("u5-css")){ var s=document.createElement("style"); s.id="u5-css"; s.textContent=CSS; document.head.appendChild(s); }
      el.nl=document.createElement("div"); el.nl.id="neatline"; el.nl.setAttribute("aria-hidden","true"); document.body.appendChild(el.nl);
      el.cart=document.createElement("div"); el.cart.id="cartouche"; el.cart.setAttribute("aria-hidden","true"); document.body.appendChild(el.cart);
      el.pl=document.createElement("div"); el.pl.id="paperletters"; el.pl.setAttribute("aria-hidden","true"); var ml=q("maplayer"); ml.parentNode.insertBefore(el.pl,ml);
      orig.mlPanels=mlPanels; orig.mlCollect=mlCollect; orig.mlLayout=mlLayout; orig.mlPlaceItem=mlPlaceItem; orig.mlObstacles=mlObstacles;
      mlPanels=wrapPanels; mlCollect=wrapCollect; mlLayout=wrapLayout; mlPlaceItem=wrapPlace; mlObstacles=wrapObst;
      if(typeof mlReset==="function") mlReset("proto"); requestRender(3); return O; },
    uninstall:function(){ if(orig.mlPanels){ mlPanels=orig.mlPanels; mlCollect=orig.mlCollect; mlLayout=orig.mlLayout; mlPlaceItem=orig.mlPlaceItem; mlObstacles=orig.mlObstacles; orig={}; }
      surround(false); apronMat=null; ["nl","cart","pl"].forEach(function(k){ if(el[k]) el[k].remove(); el[k]=null; }); BL={}; O=null; NL=null; CB=null; requestRender(3); },
    neat:function(){ return NL; }, cart:function(){ return CB; }
  };
})();
