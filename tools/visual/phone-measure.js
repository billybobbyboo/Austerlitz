/* Roadmap step 6 item 3 Part B (docs/STEP6_SPEC.md section 4.5; decision 228): the phone measures, in the page, one source for the harness's
   phone cases (harness.js, judged in thresholds.js) and tools/step6/phone-probe.js (from which they were moved; Part A's probe had them inline).
   window.__ph:
     targets()  every visible control that takes a press: its box (with the press area a positioned ::before adds, decision 166 (a)) against
                WCAG 2.5.8 (24 x 24 px, or its spacing exception), the event markers apart (decision 167's essential exception), and 44 x 44 px
                (recorded, not held: decision 228 (a)); a control scrolled out of its scrolling box (a sheet's list) is not on the screen and is
                counted apart (since Part B; the probe's Part A runs counted such a control as covered or outside)
     cut()      every element holding its own text whose content overflows a box that clips it, or whose box runs off the screen
     small()    text under the 10.5 px floor
     panels(), overlaps()  the interface panels' boxes, and the pairs that overlap (one inside the other is not an overlap)
     reach()    each feature a visitor needs, by the controls that do it: "ok" where one is visible, on the screen and on top; else the controls
                that show it (the Menu, the dispatch sheet's grip, the Panels, the first card's "Explore on my own"), with the depth: the presses
                it takes (since Part B)
     framing()  the map layer's items placed, and those whose box lies wholly inside the free rectangle (app.js landFreeRect), so that the
                free area is where the battle is drawn (section 4.4: 0 of 0 after "Explore" at 390 px in Part A)
   Measurement only: nothing here changes the page. */
(function(){
  var A={};
  function vis(e){ if(!e||!e.isConnected) return false; var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||+cs.opacity<0.02) return false;
    for(var p=e;p;p=p.parentElement){ var c=getComputedStyle(p); if(c.display==="none"||c.visibility==="hidden"||p.hidden) return false; }
    var r=e.getBoundingClientRect(); return r.width>0&&r.height>0; }
  function desc(e){ if(!e||e===document.body) return "body"; return e.tagName.toLowerCase()+(e.id?"#"+e.id:"")+(e.className&&typeof e.className==="string"?"."+e.className.trim().split(/\s+/).slice(0,2).join("."):""); }
  function nameOf(e){ var a=e.getAttribute("aria-label"); if(a&&a.trim()) return a.trim(); var t=(e.textContent||"").replace(/\s+/g," ").trim(); return t||e.getAttribute("title")||""; }
  /* a box wholly outside the visible part of a scrolling ancestor (overflow auto or scroll): scrolled out, not on the screen */
  function scrolledOut(e,r){ for(var p=e.parentElement;p&&p!==document.body;p=p.parentElement){ var c=getComputedStyle(p);
      if(/(auto|scroll)/.test(c.overflowY+" "+c.overflowX)){ var q=p.getBoundingClientRect(); if(r.bottom<=q.top+1||r.top>=q.bottom-1||r.right<=q.left+1||r.left>=q.right-1) return true; } }
    return false; }
  /* a box that runs past the edge of a scrolling ancestor: the rest is a scroll away (a sheet's list, a dossier), not cut or off the screen */
  function inScroll(e,r){ for(var p=e.parentElement;p&&p!==document.body;p=p.parentElement){ var c=getComputedStyle(p);
      if(/(auto|scroll)/.test(c.overflowY+" "+c.overflowX)){ var q=p.getBoundingClientRect(); if(r.bottom>q.bottom+1||r.top<q.top-1||r.right>q.right+1||r.left<q.left-1) return true; } }
    return false; }
  var SEL="button,a[href],input,select,textarea,[role=button],[role=tab],[role=slider],[tabindex]:not([tabindex='-1'])";
  var MAPSEL="#maplayer";
  A.targets=function(){
    var R=Array.prototype.slice.call(document.querySelectorAll(SEL)).filter(function(e){ return vis(e)&&!e.disabled&&!(e.closest&&e.closest(MAPSEL))&&!e.closest("[inert]")&&getComputedStyle(e).pointerEvents!=="none"; })
      .map(function(e){ var b=e.getBoundingClientRect(), r={left:b.left,top:b.top,right:b.right,bottom:b.bottom,width:b.width,height:b.height};
        var pb=getComputedStyle(e,"::before"); if(pb.content&&pb.content!=="none"&&pb.position==="absolute"){ var t=parseFloat(pb.top), h=parseFloat(pb.height);
          if(t<0&&h>0){ r.top=Math.min(r.top,b.top+t); r.height=r.bottom-r.top; } }
        return {e:e,r:r,cx:(r.left+r.right)/2,cy:(r.top+r.bottom)/2,scrolled:scrolledOut(e,r)}; });
    var S=R.filter(function(o){ return !o.scrolled; });
    return R.map(function(o){
      var small=o.r.width<24-1e-6||o.r.height<24-1e-6, ok=!small;
      if(small){ ok=true; for(var j=0;j<S.length;j++){ var q=S[j]; if(q===o) continue;
        var nx=Math.max(q.r.left,Math.min(o.cx,q.r.right)), ny=Math.max(q.r.top,Math.min(o.cy,q.r.bottom));
        if(Math.hypot(nx-o.cx,ny-o.cy)<12){ ok=false; break; } if((q.r.width<24||q.r.height<24)&&Math.hypot(q.cx-o.cx,q.cy-o.cy)<24){ ok=false; break; } } }
      var cx=Math.max(0,Math.min(innerWidth-1,o.cx)), cy=Math.max(0,Math.min(innerHeight-1,o.cy)), top=o.scrolled?null:document.elementFromPoint(cx,cy);
      var covered=!!(top&&top!==o.e&&!o.e.contains(top)&&!(top.closest&&top.closest("label")&&top.closest("label").contains(o.e)));
      var outside=!o.scrolled&&!inScroll(o.e,o.r)&&(o.r.right>innerWidth+0.5||o.r.bottom>innerHeight+0.5||o.r.left<-0.5||o.r.top<-0.5);
      var offscreen=o.r.right<=0||o.r.bottom<=0||o.r.left>=innerWidth||o.r.top>=innerHeight;
      return {el:desc(o.e),name:nameOf(o.e).slice(0,40),evmark:!!(o.e.closest&&o.e.closest("#evmarks")),w:+o.r.width.toFixed(1),h:+o.r.height.toFixed(1),x:Math.round(o.r.left),y:Math.round(o.r.top),
        scrolled:o.scrolled,under24:small,spacingOk:ok,under44:o.r.width<44||o.r.height<44,covered:covered?desc(top):null,outside:outside,offscreen:offscreen}; }); };
  A.cut=function(){
    var out=[];
    document.querySelectorAll("body *").forEach(function(e){
      if(e.closest(MAPSEL)||e.closest(".sr-only")||!vis(e)) return;
      var own=Array.prototype.some.call(e.childNodes,function(n){ return n.nodeType===3&&n.textContent.trim().length>0; }); if(!own) return;
      var cs=getComputedStyle(e), r=e.getBoundingClientRect(), why=null;
      if(scrolledOut(e,r)||inScroll(e,r)) return;   /* scrolled out of a sheet, or running past its edge: whole, a scroll away */
      var clipX=cs.overflowX!=="visible"||cs.textOverflow==="ellipsis", clipY=cs.overflowY!=="visible"||(cs.webkitLineClamp&&cs.webkitLineClamp!=="none");
      if(clipX&&e.scrollWidth>e.clientWidth+1) why=cs.textOverflow==="ellipsis"?"ellipsis":"clipped across";
      else if(clipY&&e.scrollHeight>e.clientHeight+1&&cs.overflowY!=="auto"&&cs.overflowY!=="scroll") why="clipped down";
      if(!why){ for(var p=e.parentElement;p&&p!==document.body;p=p.parentElement){ var pc=getComputedStyle(p); if(pc.overflow==="hidden"||pc.overflowX==="hidden"){
        var pr=p.getBoundingClientRect(); if(r.right>pr.right+1||r.left<pr.left-1){ why="cut by "+desc(p); } break; } } }
      if(!why&&(r.right<=0||r.left>=innerWidth||r.bottom<=0||r.top>=innerHeight)) why="wholly off the screen";
      else if(!why&&(r.right>innerWidth+0.5||r.left<-0.5||r.bottom>innerHeight+0.5||r.top<-0.5)) why="partly off the screen";
      if(why) out.push({el:desc(e),why:why,text:(e.textContent||"").replace(/\s+/g," ").trim().slice(0,60),w:Math.round(r.width)}); });
    return out; };
  A.small=function(){ var out=[]; document.querySelectorAll("body *").forEach(function(e){ if(e.closest(".sr-only")||!vis(e)) return;
      if(!Array.prototype.some.call(e.childNodes,function(n){ return n.nodeType===3&&n.textContent.trim().length>0; })) return;
      var px=parseFloat(getComputedStyle(e).fontSize); if(px<10.5-1e-6) out.push(desc(e)+" "+px+"px"); }); return out; };
  var PANELS={rail:".rail",timebar:".timebar",card:"#firstrun",dispatch:".dispatch",tools:".tools",menu:"#menubtn",viewmode:"#viewmode",drawer:".drawer",
    layers:"#layerpop",tourbar:"#tourbar",selchip:"#selchip",legend:".legend",eyecap:"#eyecap",help:"#help"};
  A.panels=function(){ var o={}; Object.keys(PANELS).forEach(function(k){ var e=document.querySelector(PANELS[k]); if(!e||!vis(e)||e.getAttribute("aria-hidden")==="true") return;
      if(k==="rail"&&document.body.classList.contains("rail-hidden")) return; if(k==="drawer"&&!e.classList.contains("on")) return;
      var r=e.getBoundingClientRect(); if(r.right<=0||r.left>=innerWidth||r.bottom<=0||r.top>=innerHeight) return; o[k]=[r.left,r.top,r.right,r.bottom].map(Math.round); }); return o; };
  A.overlaps=function(){ var P=A.panels(), K=Object.keys(P), out=[];
    for(var i=0;i<K.length;i++) for(var j=i+1;j<K.length;j++){ var a=P[K[i]], b=P[K[j]], w=Math.min(a[2],b[2])-Math.max(a[0],b[0]), h=Math.min(a[3],b[3])-Math.max(a[1],b[1]);
      if(w>1&&h>1){ var inA=document.querySelector(PANELS[K[i]]).contains(document.querySelector(PANELS[K[j]]))||document.querySelector(PANELS[K[j]]).contains(document.querySelector(PANELS[K[i]]));
        if(!inA) out.push({a:K[i],b:K[j],w:Math.round(w),h:Math.round(h)}); } }
    return out; };
  /* the features a visitor needs, each by the controls that do it (since Part B: the phases also in the dispatch sheet's list, the speeds as one
     button, "Whose eyes?" in the Command tab too); the controls that show a hidden one, inner first */
  var FEAT={play:["#play"], clock:["#timerail"], phases:["#phases .step","#phlist .ph-item"], presentation:[".vm-btn"], layers:["#layersbtn"], paperMap:[".mode-btn[data-m=staff]","#layersbtn"],
    panels:["#panelsbtn","#tab-now"], follow:["#follow"], vantages:[".van-btn"], help:["#helpbtn"], sources:["#srcbtn"], tour:["#tourbtn","#fr-tour"], events:["#evmarks button, #evmarks [role=button]"],
    eyes:["#eyesbtn",".cmd-btn"], speeds:[".spd-btn","#speedbtn"]};
  /* [the container that hides a control, the control that shows it, when]: the Menu shows the tools (below 720 px); the sheet's grip its phases;
     the Panels the rail; "Explore on my own" what the first card stands down (the dispatch below 720 px, the tools held landscape); the dossier's
     close the dispatch sheet it stands in place of; the Layers panel's close the dispatch (below 720 px) and the tools (held landscape) it stands
     in place of; Study what Watch does not show (decision 60: Watch is the battlefield and the timeline): the Menu and the dispatch below 720 px,
     the tools and the dispatch above */
  var B=function(c){ return document.body.classList.contains(c); }, PH=function(){ return typeof PHONE!=="undefined"&&PHONE===true; };
  var OPENER=[["#tools","#menubtn",PH],["#phlist","#dgrip"],[".rail","#panelsbtn"],[".dispatch,#tools","#fr-close",function(){ return B("firstrun-on"); }],
    [".dispatch","#drawer-close",function(){ return B("drawer-open"); }],
    [".dispatch,#tools","#layerclose",function(){ return !document.getElementById("layerpop").hidden; }],
    ["#menubtn,.dispatch",'.vm-btn[data-vm="study"]',function(){ return B("pm-watch")&&PH(); }],
    ["#tools,.dispatch",'.vm-btn[data-vm="study"]',function(){ return B("pm-watch")&&!PH(); }]];
  function onTop(e){ var r=e.getBoundingClientRect(), on=0, top=null, ok=false;
    [[.5,.5],[.2,.2],[.8,.2],[.2,.8],[.8,.8],[.5,.2],[.5,.8],[.2,.5],[.8,.5]].forEach(function(q){ if(ok) return; var x=r.left+q[0]*r.width, y=r.top+q[1]*r.height;
      if(x<0||y<0||x>=innerWidth||y>=innerHeight) return; on++; var t=document.elementFromPoint(x,y); if(t&&(t===e||e.contains(t))) ok=true; else if(!top) top=t; });
    return ok?"ok":on?"covered by "+desc(top):"off the screen"; }
  /* the shortest chain of controls that shows e: each a press, the first on the screen and on top; at each step only the innermost container
     that hides e counts (the phase list needs its grip even after the card that hides the whole dispatch is closed) */
  function chain(e,n){ if(n>3) return null; var best=null, C=[];
    OPENER.forEach(function(q){ if(q[2]&&!q[2]()) return; var c=e.closest&&e.closest(q[0]); if(!c||(e.matches&&e.matches(q[1]))) return; C.push([q,c]); });
    var inner=C.filter(function(x){ return !C.some(function(y){ return y[1]!==x[1]&&x[1].contains(y[1]); }); });
    inner.forEach(function(x){ var q=x[0], b=document.querySelector(q[1]); if(!b) return; var p=null;
      if(vis(b)&&!b.closest("[inert]")&&onTop(b)==="ok") p=[q[1]]; else { var r=chain(b,n+1); if(r) p=r.concat([q[1]]); }
      if(p&&(!best||p.length<best.length)) best=p; });
    return best; }
  A.reach=function(){ var o={}; Object.keys(FEAT).forEach(function(k){ var best=null, via=null, depth=null;
      FEAT[k].forEach(function(s){ document.querySelectorAll(s).forEach(function(e){ if(best==="ok") return; if(!vis(e)||e.closest("[inert]")){ best=best||"hidden"; return; }
        var w=onTop(e); if(w==="ok") best="ok"; else if(!best||best==="hidden") best=w; }); });
      if(best!=="ok"){ FEAT[k].forEach(function(s){ document.querySelectorAll(s).forEach(function(e){ var p=chain(e,0);
          if(p&&(depth===null||p.length<depth)){ depth=p.length; via=p.join(" > "); } }); }); }
      o[k]=best==="ok"?{state:"ok",depth:0}:{state:best||"absent",depth:depth,via:via}; }); return o; };
  /* the map layer's items placed, and those wholly inside the free rectangle (the area no panel covers, where the camera centres the view) */
  A.framing=function(){ var fr=(typeof landFreeRect==="function"&&typeof mode!=="undefined"&&mode!=="staff")?landFreeRect():(typeof MAPCAM!=="undefined"&&MAPCAM.freeRect?MAPCAM.freeRect():null);
    var items=Array.prototype.slice.call(document.querySelectorAll("#maplayer .ml-item.on")), inF=0;
    items.forEach(function(e){ var r=e.getBoundingClientRect(); if(fr&&r.left>=fr[0]-0.5&&r.top>=fr[1]-0.5&&r.right<=fr[2]+0.5&&r.bottom<=fr[3]+0.5) inF++; });
    return {placed:items.length, inFree:inF, free:fr?fr.map(Math.round):null}; };
  A.summary=function(){ var T=A.targets(), on=T.filter(function(t){ return !t.scrolled; }), ov=A.overlaps(), cut=A.cut(), reach=A.reach();
    return {targets:on.length, scrolled:T.length-on.length,
      fail2_5_8:on.filter(function(t){ return t.under24&&!t.spacingOk&&!t.evmark; }).map(function(t){ return t.el+" "+t.w+"x"+t.h+" '"+t.name+"'"; }),
      evmarksUnder24:on.filter(function(t){ return t.evmark&&t.under24&&!t.spacingOk; }).length,
      under44:on.filter(function(t){ return t.under44; }).length, under44List:on.filter(function(t){ return t.under44; }).map(function(t){ return t.el+" "+t.w+"x"+t.h; }),
      covered:on.filter(function(t){ return t.covered&&!t.evmark; }).map(function(t){ return t.el+" '"+t.name+"' under "+t.covered; }),
      outside:on.filter(function(t){ return t.outside; }).map(function(t){ return t.el+" '"+t.name+"'"+(t.offscreen?" (wholly off)":""); }),
      cut:cut.filter(function(c){ return c.why!=="wholly off the screen"; }), offScreenText:cut.filter(function(c){ return c.why==="wholly off the screen"; }).length,
      overlaps:ov, panels:A.panels(), reach:reach, small:A.small(), framing:A.framing()}; };
  window.__ph=A; return true;
})();
