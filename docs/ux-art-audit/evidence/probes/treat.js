/* Temporary design prototypes for the audit: injected into the live pinned page at run time (CSS and a few classes; no source changed, nothing shipped).
   A = refinement of the current identity ("quiet plates"); B = the atlas treatment. */
module.exports=function(){
  var css=document.createElement("style"); css.id="aud-css"; css.textContent=[
  /* ---------- A: three label tiers on the current dark identity ---------- */
  "body.aud-a #maplayer .ml-item.aud-quiet{background:transparent!important;text-shadow:0 0 2px #0A0E12,0 0 3px #0A0E12,0 0 4px #0A0E12,0 1px 6px rgba(10,14,18,.95),0 0 9px rgba(10,14,18,.8)}",
  "body.aud-a #maplayer .ml-item.aud-quiet .mln-bdg{background:rgba(10,14,18,.55)!important;border-color:rgba(242,238,228,.5)!important}",
  "body.aud-a #maplayer .ml-item.aud-place{letter-spacing:.03em;opacity:.92}",
  "body.aud-a #maplayer .ml-item.aud-note{opacity:.9}",
  "body.aud-a #maplayer .ml-item.aud-live{background:#EFE4C8!important;color:#101720!important;font-size:13.5px;line-height:18px;padding:1px 8px 2px;box-shadow:0 0 0 1px #0A0E12,0 3px 12px rgba(0,0,0,.55);z-index:3}",
  "body.aud-a #maplayer .ml-item.aud-inv{box-shadow:0 0 0 1px rgba(239,228,200,.7)}",
  "body.aud-a .ml-lines{opacity:.55}",
  "body.aud-a #maplayer .ml-item.ml-fading,body.aud-b #maplayer .ml-item.ml-fading,body.aud-a #maplayer .ml-item:not(.on),body.aud-b #maplayer .ml-item:not(.on),body.aud-a #maplayer .ml-item[style*='translate(0px, 0px)'],body.aud-b #maplayer .ml-item[style*='translate(0px, 0px)']{visibility:hidden}",
  "@media (max-width:719px){body.aud-a #maplayer .ml-item.aud-live,body.aud-b #maplayer .ml-item.aud-live{font-size:12.5px!important;line-height:16px!important;padding:0 5px 1px!important;max-width:calc(100vw - 24px);white-space:normal}#aud-title{padding:6px 10px 7px;max-width:260px}#aud-title b{font-size:19px}}",
  /* first-run card in the rail column (A): the map left free */
  "body.aud-card #firstrun{position:fixed!important;left:0!important;top:0!important;right:auto!important;bottom:var(--tb)!important;width:300px!important;max-width:300px!important;height:auto!important;margin:0!important;transform:none!important;border-radius:0!important;border:0!important;border-right:1px solid var(--line-2)!important;padding:22px 18px!important;box-sizing:border-box;box-shadow:none!important;overflow:auto}",
  "body.aud-card #firstrun h2{font-size:25px;line-height:1.15;margin:0 0 4px}",
  "body.aud-card .aud-sub{font-family:var(--sans);font-size:12.5px;color:var(--text-muted);margin:0 0 16px}",
  "body.aud-card .aud-row{display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-top:1px solid var(--line);font-family:var(--sans);font-size:12.5px;line-height:1.45;color:var(--text)}",
  "body.aud-card .aud-row b{font-weight:600;color:var(--text-hi)}",
  "body.aud-card .aud-sw{flex:0 0 46px;display:flex;gap:4px;flex-wrap:wrap;padding-top:2px}",
  "body.aud-card .aud-sw i{display:block;width:14px;height:14px;border:1px solid #0A0E12}",
  "body.aud-card .aud-sw em{font-style:normal;font-weight:600;font-size:10.5px;min-width:14px;height:14px;line-height:14px;text-align:center;border:1px solid var(--text-muted);border-radius:2px;color:var(--text-hi)}",
  "body.aud-card .aud-p{font-family:var(--serif);font-size:14px;line-height:1.55;color:var(--text-body);margin:12px 0 16px}",
  "body.aud-card #firstrun .fr-act{display:flex;flex-direction:column;gap:8px;align-items:stretch}",
  /* ---------- B: the atlas plate ---------- */
  "body.aud-b #stage canvas{filter:var(--aud-filter,brightness(1.5) contrast(.84) saturate(.66) sepia(.2))}",
  "body.aud-b #maplayer .ml-item{background:transparent!important;color:#1A160E!important;text-shadow:0 0 1px #F6F1E5,0 0 2px #F6F1E5,0 0 3px #F6F1E5,0 0 5px #F6F1E5,0 0 8px rgba(246,241,229,.95)}",
  "body.aud-b #maplayer .ml-item.aud-place{letter-spacing:.05em;color:#3A3220!important}",
  "body.aud-b #maplayer .ml-item.aud-quiet{opacity:.86}",
  "body.aud-b #maplayer .ml-item.aud-inv{font-weight:600}",
  "body.aud-b #maplayer .ml-item.aud-live{background:#2B2418!important;color:#F6F1E5!important;text-shadow:none;font-size:13.5px;line-height:18px;padding:1px 9px 2px;box-shadow:0 2px 8px rgba(40,30,10,.35);z-index:3}",
  "body.aud-b #maplayer .mln-bdg{background:#F6F1E5!important;color:#25231D!important;border-color:#25231D!important}",
  "body.aud-b #maplayer .mln-mark{border-color:#25231D!important}",
  "body.aud-b .ml-lines path[stroke-width='3']{stroke:rgba(246,241,229,.92)!important}",
  "body.aud-b .ml-lines path[stroke-width='1.2']{stroke:#3A362C!important}",
  "body.aud-b .ml-lines circle{fill:#3A362C!important;stroke:#F6F1E5!important}",
  "body.aud-b #vignette{display:none}",
  "#aud-frame{position:fixed;pointer-events:none;z-index:6;border:1px solid #2B2418;outline:3px double #2B2418;outline-offset:4px;box-sizing:border-box}",
  "#aud-title{position:fixed;z-index:7;pointer-events:none;background:#F6F1E5;border:1px solid #2B2418;box-shadow:0 0 0 3px #F6F1E5,0 0 0 4px #2B2418;padding:9px 16px 10px;font-family:var(--serif);color:#14120C;max-width:420px}",
  "#aud-title small{display:block;font-family:var(--sans);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:#5D5A4E;margin-bottom:3px}",
  "#aud-title b{display:block;font-weight:400;font-size:25px;line-height:1.15}",
  "#aud-title i{display:block;font-style:normal;font-size:13px;color:#3A362B;margin-top:4px}",
  "body.aud-b.aud-land .tools .t,body.aud-b.aud-land #viewmode .t{box-shadow:0 0 0 1px rgba(246,241,229,.6)}"
  ].join("\n"); document.head.appendChild(css);
  var names=null;
  function tier(){
    if(!names){ names=[]; for(var id in FORMATIONS){ try{ names.push([nameOf(FORMATIONS[id]),id]); }catch(e){} } names.sort(function(a,b){ return b[0].length-a[0].length; }); }
    var inv={}, live=liveEvents(clock).filter(function(o){ return o.w>0.3; });
    live.forEach(function(o){ (o.e.forms||[]).forEach(function(id){ inv[id]=1; var f=FORMATIONS[id]; if(f&&f.parent) inv[f.parent]=1; }); });
    var liveNames=live.map(function(o){ return o.e.n; });
    [].forEach.call(document.querySelectorAll("#maplayer .ml-item"),function(e){
      var al=e.getAttribute("aria-label")||"", c=e.classList; c.remove("aud-quiet","aud-place","aud-live","aud-inv","aud-note");
      if(c.contains("mlc")) return;   /* counters keep their plates */
      if(/^Event/.test(al)){ if(liveNames.some(function(n){ return al.indexOf(n)>=0; })) c.add("aud-live"); else c.add("aud-quiet"); return; }
      if(/^Place/.test(al)){ c.add("aud-quiet"); c.add("aud-place"); return; }
      if(c.contains("mln")){ var id=null; for(var i=0;i<names.length;i++) if(al.indexOf(names[i][0])===0){ id=names[i][1]; break; }
        if(id&&inv[id]) c.add("aud-inv"); else c.add("aud-quiet"); return; }
      c.add("aud-quiet"); c.add("aud-note");
    });
  }
  window.__treat={
    off:function(){ clearInterval(this._t); document.body.classList.remove("aud-a","aud-b","aud-land"); ["aud-frame","aud-title"].forEach(function(i){ var e=document.getElementById(i); if(e) e.remove(); });
      [].forEach.call(document.querySelectorAll("#maplayer .ml-item"),function(e){ e.classList.remove("aud-quiet","aud-place","aud-live","aud-inv","aud-note"); }); },
    A:function(){ this.off(); document.body.classList.add("aud-a"); tier(); this._t=setInterval(tier,120); },
    B:function(o){ o=o||{}; this.off(); document.body.classList.add("aud-b"); if(o.land) document.body.classList.add("aud-land"); if(o.filter) document.body.style.setProperty("--aud-filter",o.filter); else document.body.style.removeProperty("--aud-filter");
      tier(); this._t=setInterval(tier,120);
      var f=[0,0,innerWidth,innerHeight]; try{ f=MAPCAM.freeRect(); }catch(e){}
      if(o.frame){ var fr=document.createElement("div"); fr.id="aud-frame"; var m=o.frameInset||10; fr.style.left=(f[0]-m)+"px"; fr.style.top=(f[1]-m-(o.frameUp||0))+"px"; fr.style.width=(f[2]-f[0]+2*m)+"px"; fr.style.height=(f[3]-f[1]+2*m+(o.frameUp||0))+"px"; document.body.appendChild(fr); }
      if(o.title){ var t=document.createElement("div"); t.id="aud-title"; t.innerHTML="<small>"+o.title[0]+"</small><b>"+o.title[1]+"</b>"+(o.title[2]?"<i>"+o.title[2]+"</i>":""); t.style.left=(o.titleX!==undefined?o.titleX:(f[0]+14))+"px"; t.style.top=(o.titleY!==undefined?o.titleY:(f[1]+14))+"px"; document.body.appendChild(t); } }
  };
};
