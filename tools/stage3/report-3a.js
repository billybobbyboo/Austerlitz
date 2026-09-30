#!/usr/bin/env node
/* Stage 3 Part A: the tables of docs/STAGE3_SPEC.md sections B and G, from the probes' JSON (changes nothing).
   node tools/stage3/report-3a.js [docs/stage3-evidence/dock-probe.json] [--md out.md] */
const fs=require("fs"), path=require("path");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const src=args.find(a=>a.endsWith(".json"))||path.join(__dirname,"..","..","docs","stage3-evidence","dock-probe.json");
const D=JSON.parse(fs.readFileSync(src,"utf8")), L=D.levels, T=require("../visual/thresholds.js");
const pc=x=>x==null?"-":(100*x).toFixed(1);
const md=[];
md.push("# Stage 3 Part A: the docked layout probe (tools/stage3/dock-probe.js; tables by tools/stage3/report-3a.js)\n");
md.push("Levels: "+L.map((l,i)=>i+" "+l).join(", ")+". Each level includes the ones before it.\n");
md.push("## The unobstructed fraction (section H), per view: the case's viewport / 1280 x 720, in per cent\n");
md.push("| view | viewport | 2C baseline (thresholds.js) | "+L.join(" | ")+" |");
md.push("|---|---|---|"+L.map(()=>"---").join("|")+"|");
Object.keys(D.cases).forEach(k=>{ const c=D.cases[k], any=c[L[0]]||c[Object.keys(c)[0]], b=T.UNOBSTRUCTED[k];
  md.push("| "+k+" | "+any.vp.join(" x ")+" | "+(b?pc(b[0])+" / "+pc(b[1]):"-")+" | "+L.map(l=>c[l]?pc(c[l].unobstructed)+" / "+pc(c[l].at720.unobstructed):"-").join(" | ")+" |"); });
md.push("\n## The timebar's height (px) and the largest free rectangle (w x h px), at the case's viewport\n");
md.push("| view | "+L.map(l=>l+": timebar, free rect").join(" | ")+" |"); md.push("|---|"+L.map(()=>"---").join("|")+"|");
Object.keys(D.cases).forEach(k=>{ const c=D.cases[k];
  md.push("| "+k+" | "+L.map(l=>c[l]?((c[l].timebar?c[l].timebar.total:"-")+", "+c[l].free.w+" x "+c[l].free.h):"-").join(" | ")+" |"); });
md.push("\n## The timebar's rows today (px), per viewport\n");
const seen={}; Object.keys(D.cases).forEach(k=>{ const c=D.cases[k][L[0]]; if(!c||!c.timebar) return; [["",c],["1280 x 720 ",c.at720]].forEach(([p,m])=>{ const key=m.vp.join("x"); if(seen[key]) return; seen[key]=1;
  md.push("- "+m.vp.join(" x ")+" ("+k+"): "+Object.entries(m.timebar).map(([a,b])=>a+" "+b).join(", ")); }); });
md.push("\n## The paper map as framed (px per true km, east-west): the case's viewport / 1280 x 720\n");
md.push("| view | "+L.join(" | ")+" |"); md.push("|---|"+L.map(()=>"---").join("|")+"|");
Object.keys(D.cases).forEach(k=>{ const c=D.cases[k]; if(!Object.values(c).some(m=>m.paper)) return;
  md.push("| "+k+" | "+L.map(l=>c[l]&&c[l].paper?c[l].paper.pxPerKm+" / "+(c[l].at720.paper?c[l].at720.paper.pxPerKm:"-"):"-").join(" | ")+" |"); });
md.push("\n## Arrow heads more than a quarter hidden (under a panel or off screen), at the case's viewport: count / heads drawn\n");
md.push("| view | "+L.join(" | ")+" | with setViewOffset, docked (level "+(L.length-1)+") |"); md.push("|---|"+L.map(()=>"---").join("|")+"|---|");
Object.keys(D.cases).forEach(k=>{ const c=D.cases[k], last=c[L[L.length-1]];
  md.push("| "+k+" | "+L.map(l=>c[l]?c[l].heads.hiddenOverQuarter+" / "+c[l].heads.heads:"-").join(" | ")+" | "+(last&&last.offset?last.offset.heads.hiddenOverQuarter+" / "+last.offset.heads.heads:"-")+" |"); });
md.push("\n## The landscape's orbit target: its distance from the free rectangle's centre (px), and the panel over it, if any\n");
md.push("| view | "+L.join(" | ")+" |"); md.push("|---|"+L.map(()=>"---").join("|")+"|");
Object.keys(D.cases).forEach(k=>{ const c=D.cases[k]; if(!Object.values(c).some(m=>m.target)) return;
  md.push("| "+k+" | "+L.map(l=>c[l]&&c[l].target?c[l].target.fromFreeCentre+(c[l].target.underPanel?" (under "+c[l].target.underPanel+")":""):"-").join(" | ")+" |"); });
md.push("\nWith camera.setViewOffset centring it in the free rectangle the distance is 0 px in every view and level by construction; worldPerPx at the target is unchanged (the probe records both values per view).\n");
md.push("## The map layer: items dropped (limit, thresholds.js) per level\n");
md.push("| view | limit | "+L.join(" | ")+" |"); md.push("|---|---|"+L.map(()=>"---").join("|")+"|");
Object.keys(D.cases).forEach(k=>{ const c=D.cases[k];
  md.push("| "+k+" | "+(T.DROP_LIMIT[k]!==undefined?T.DROP_LIMIT[k]:"-")+" | "+L.map(l=>c[l]&&c[l].layer?c[l].layer.dropped:"-").join(" | ")+" |"); });
const out=md.join("\n")+"\n";
if(opt("--md")) fs.writeFileSync(opt("--md"),out); else process.stdout.write(out);
/* ---- derived: the paper map framed in the rectangle that fits the field best, against MAPCAM's largest-area rectangle ----
   From the panels the probe measured (the harness's list), on MAPCAM's own grid (8 px, 10 px clear of every panel and edge):
   the largest-area free rectangle (MAPCAM.freeRect's rule, checked against the one the page returned) and, among every maximal
   free rectangle, the one in which the modelled ground's north-up outline is drawn largest. */
if(require.main===module){
  const X=require("../stage2/model.js").load(), G=X.GEOREF, n=Math.hypot(G.NORTH[0],G.NORTH[1]), N=[G.NORTH[0]/n,G.NORTH[1]/n], E=[-N[1],N[0]];
  const F=[[-180,-155],[180,-155],[180,155],[-180,155]], A=F.map(p=>p[0]*E[0]+p[1]*E[1]), B=F.map(p=>p[0]*N[0]+p[1]*N[1]);
  const aw=Math.max(...A)-Math.min(...A), bh=Math.max(...B)-Math.min(...B);
  function rects(vp,P){ const Gd=8, M=10, nx=Math.floor(vp[0]/Gd), ny=Math.floor(vp[1]/Gd), h=new Int32Array(nx); let best=null, bA=-1, fit=null, fS=-1;
    for(let j=0;j<ny;j++){ const y0=j*Gd, y1=y0+Gd;
      for(let i=0;i<nx;i++){ const x0=i*Gd, x1=x0+Gd; let bad=x0<M||y0<M||x1>vp[0]-M||y1>vp[1]-M;
        for(const q of P){ if(bad) break; if(x0<q[2]+M&&x1>q[0]-M&&y0<q[3]+M&&y1>q[1]-M) bad=true; } h[i]=bad?0:h[i]+1; }
      for(let i=0;i<nx;i++){ if(!h[i]) continue; let l=i, r=i; while(l>0&&h[l-1]>=h[i]) l--; while(r<nx-1&&h[r+1]>=h[i]) r++;
        const w=(r-l+1)*Gd, hh=h[i]*Gd, a=w*hh, sc=Math.min(w/aw,hh/bh);
        if(a>bA){ bA=a; best=[l*Gd,(j+1-h[i])*Gd,(r+1)*Gd,(j+1)*Gd]; } if(sc>fS){ fS=sc; fit=[l*Gd,(j+1-h[i])*Gd,(r+1)*Gd,(j+1)*Gd]; } } }
    return {area:best, areaPxKm:+(G.UNITS_PER_KM*Math.min((best[2]-best[0])/aw,(best[3]-best[1])/bh)).toFixed(2), fit, fitPxKm:+(G.UNITS_PER_KM*fS).toFixed(2)}; }
  const md2=["\n## Derived: the paper map as entered, framed in the rectangle that fits the field (px per true km), against the largest-area rectangle\n",
    "The field's north-up outline is "+aw.toFixed(1)+" x "+bh.toFixed(1)+" world units. \"area\" reproduces MAPCAM.freeRect's rule on the measured panels (whole pixels, the harness's panel list; within one 8 px cell of the rectangle the page returned, which the tables above give); \"fit\" is the best of every maximal free rectangle for the field's outline.\n",
    "| view, level | viewport | area: rectangle, px/km | fit: rectangle, px/km |","|---|---|---|---|"];
  Object.keys(D.cases).filter(k=>["paper-north-up","paper-laptop","paper-1366"].includes(k)).forEach(k=>L.forEach(l=>{ const m=D.cases[k][l]; if(!m) return;
    [[m.vp,m.panels]].concat(m.vp.join()==="1280,720"?[]:[[m.at720.vp,m.at720.panels]]).forEach(([vp,pn])=>{ const r=rects(vp,Object.values(pn));
      md2.push("| "+k+", "+l+" | "+vp.join(" x ")+" | "+(r.area[2]-r.area[0])+" x "+(r.area[3]-r.area[1])+", "+r.areaPxKm+" | "+(r.fit[2]-r.fit[0])+" x "+(r.fit[3]-r.fit[1])+", "+r.fitPxKm+" |"); }); }));
  const extra=md2.join("\n")+"\n";
  if(opt("--md")) fs.appendFileSync(opt("--md"),extra); else process.stdout.write(extra);
}
