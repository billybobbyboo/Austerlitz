/* In-page measures used by the audit probes (injected; reads the app's own state, changes nothing). */
module.exports=function(){
  window.__audit={
    free(){ try{ var f=MAPCAM.freeRect(); return f; }catch(e){ return [0,0,innerWidth,innerHeight]; } },
    scr(wx,wz){ var v=new THREE.Vector3(wx,groundY(wx,wz),wz).project(camera); return [(v.x+1)/2*innerWidth,(1-v.y)/2*innerHeight,v.z]; },
    comp(){
      var f=this.free(), fw=f[2]-f[0], fh=f[3]-f[1], L=liveEvents(clock), out={t:+clock.toFixed(1),free:f.map(Math.round)};
      out.events=L.slice(0,4).map(function(o){ var w=W(o.e.p[0],o.e.p[1]), s=window.__audit.scr(w[0],w[1]); return {n:String(o.e.n||o.e.id||"").slice(0,30),w:+o.w.toFixed(2),fx:+((s[0]-f[0])/fw).toFixed(2),fy:+((s[1]-f[1])/fh).toFixed(2),inFree:s[0]>=f[0]&&s[0]<=f[2]&&s[1]>=f[1]&&s[1]<=f[3]&&s[2]<1}; });
      var xs=[],ys=[],n=0,inF=0; for(var id in FORMATIONS){ var F=FORMATIONS[id]; if(!F.track) continue; var p=posNow(id); if(!p) continue; var w=W(p[0],p[1]), s=this.scr(w[0],w[1]); if(s[2]>=1) continue; n++; if(s[0]>=f[0]&&s[0]<=f[2]&&s[1]>=f[1]&&s[1]<=f[3]){ inF++; xs.push(s[0]); ys.push(s[1]); } }
      out.formations={onField:n,inFree:inF};
      if(xs.length){ var x0=Math.min.apply(null,xs),x1=Math.max.apply(null,xs),y0=Math.min.apply(null,ys),y1=Math.max.apply(null,ys); out.bbox=[x0,y0,x1,y1].map(Math.round); out.bboxShare=+(((x1-x0)*(y1-y0))/(fw*fh)).toFixed(3); out.bboxCy=+((((y0+y1)/2)-f[1])/fh).toFixed(2); }
      // label plates: union area by a coarse raster (4 px cells) inside the free rect
      var its=[].slice.call(document.querySelectorAll("#maplayer .ml-item")).filter(function(e){ return +getComputedStyle(e).opacity>0.5&&e.getBoundingClientRect().width>0; });
      var cw=Math.ceil(fw/4), ch=Math.ceil(fh/4), g=new Uint8Array(cw*ch), cov=0;
      its.forEach(function(e){ var r=e.getBoundingClientRect(); var a=Math.max(0,Math.floor((r.left-f[0])/4)), b=Math.min(cw,Math.ceil((r.right-f[0])/4)), c=Math.max(0,Math.floor((r.top-f[1])/4)), d=Math.min(ch,Math.ceil((r.bottom-f[1])/4)); for(var y=c;y<d;y++) for(var x=a;x<b;x++) if(!g[y*cw+x]){ g[y*cw+x]=1; cov++; } });
      out.labels=its.length; out.labelCover=+(cov/(cw*ch)).toFixed(3);
      // label cover inside the formations' bbox (how much of the action the plates hide)
      if(out.bbox){ var bx0=Math.floor((out.bbox[0]-f[0])/4), bx1=Math.ceil((out.bbox[2]-f[0])/4), by0=Math.floor((out.bbox[1]-f[1])/4), by1=Math.ceil((out.bbox[3]-f[1])/4), c2=0, tot=0; for(var y2=Math.max(0,by0);y2<Math.min(ch,by1);y2++) for(var x2=Math.max(0,bx0);x2<Math.min(cw,bx1);x2++){ tot++; if(g[y2*cw+x2]) c2++; } out.labelCoverInAction=tot?+(c2/tot).toFixed(3):null; }
      out.dist=+camera.position.distanceTo(orbitTarget).toFixed(0);
      out.cap=(document.getElementById("tb-cap").innerText||"").replace(/\s+/g," ").slice(0,90); var c=document.getElementById("tb-cap"); out.capCut=[].slice.call(c.querySelectorAll("*")).filter(function(e){ return e.children.length===0&&e.scrollWidth>e.clientWidth+1; }).length;
      return out;
    }
  };
};
