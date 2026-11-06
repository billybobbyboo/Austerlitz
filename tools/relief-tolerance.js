/* The relief's tolerance lines (the final audits' Stage 4, WP-04b; CL-GEO-01, docs/FINAL_AUDIT_POST_STAGE8.md, its validation line, and owner
   decision 273 (a)): the drawn relief, GEOREF.elevM(hAt), held against open elevation data at the places the audit found it 30-80 m off, and
   against the twelve sourced anchors tools/relief-fit.js fits. The elevation values are tools/relief-dem.json's, extracted once from the
   committed responses by tools/relief-dem.js (nothing is fetched at test time). Read by terrain-test.js, and by
   tools/final-stage4-wp04b/mutate.js and relief-measure.js on other trees.
     check(elevAt, D, GEOREF) -> {rows:[{line, value, limit, ok, text}], ok}
   elevAt(mx,my): the model's metres at a map point (GEOREF.elevM(hAt(mx,my)) on the tree being judged). */
"use strict";
function check(elevAt, D, G){
  const rows=[], add=(line,value,limit,ok,text)=>rows.push({line, value:+value.toFixed(1), limit, ok, text});
  const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
  /* (1) the southern Pratzen plateau: the audit's 300 m core grid inside map x 270-330, y 295-350 (36 cells), the model's mean against GLO-90's */
  { const P=D.southernBox.pts, m=mean(P.map(p=>elevAt(p[0],p[1]))), d=mean(P.map(p=>p[2])), dv=m-d;
    add("southern box mean", dv, D.limits.boxMeanM, Math.abs(dv)<=D.limits.boxMeanM,
      "the southern Pratzen plateau (map x "+D.southernBox.box.slice(0,2).join("-")+", y "+D.southernBox.box.slice(2).join("-")+", "+P.length+" cells of the audit's 300 m grid): model mean "+
      m.toFixed(1)+" m against GLO-90's "+d.toFixed(1)+" m, "+(dv>=0?"+":"")+dv.toFixed(1)+" m (limit "+D.limits.boxMeanM+")"); }
  /* (2) the four profiles across the southern plateau (16 points each): each profile's worst departure */
  Object.keys(D.profiles).forEach(k=>{ const P=D.profiles[k], dd=P.map(p=>elevAt(p[0],p[1])-p[2]), w=dd.reduce((a,b)=>Math.abs(b)>Math.abs(a)?b:a,0);
    add("profile "+k, w, D.limits.profileWorstM, Math.abs(w)<=D.limits.profileWorstM,
      "profile "+k+" ("+P.length+" points): worst model-GLO-90 "+(w>=0?"+":"")+w.toFixed(1)+" m, mean "+mean(dd).toFixed(1)+" m (limit "+D.limits.profileWorstM+")"); });
  /* (3) Slapanice, GT.schlapanitz: the model against GLO-90 at the point */
  { const s=D.slapanice, dv=elevAt(s.map[0],s.map[1])-s.dem;
    add("Slapanice", dv, D.limits.pointM, Math.abs(dv)<=D.limits.pointM, "Slapanice (GT.schlapanitz): model "+(s.dem+dv).toFixed(1)+" m against GLO-90's "+s.dem+" m, "+(dv>=0?"+":"")+dv.toFixed(1)+" m (limit "+D.limits.pointM+")"); }
  /* (4) St Anthony's knoll: the chapel's OpenStreetMap point, against GLO-90 there (the audit's 100 m chapel grid, inverse-distance of its four nearest) */
  { const c=D.chapel, dv=elevAt(c.map[0],c.map[1])-c.dem;
    add("chapel knoll", dv, D.limits.pointM, Math.abs(dv)<=D.limits.pointM, "St Anthony's knoll (the chapel's OSM point): model "+(c.dem+dv).toFixed(1)+" m against GLO-90's "+c.dem.toFixed(1)+" m, "+(dv>=0?"+":"")+dv.toFixed(1)+" m (limit "+D.limits.pointM+")"); }
  /* (5) the twelve sourced anchors (tools/relief-fit.js's A{}: target and tolerance) */
  Object.keys(D.anchors).forEach(k=>{ const t=D.anchors[k], m=G.GT[k].map, e=elevAt(m[0],m[1]), dv=e-t[0];
    add("anchor "+k, dv, t[1], Math.abs(dv)<=t[1], "anchor "+k+": model "+e.toFixed(1)+" m against the sourced "+t[0]+" m, "+(dv>=0?"+":"")+dv.toFixed(1)+" m (tolerance "+t[1]+")"); });
  /* (6) no false summit: no ground within 1 km of the Pratzeberg higher than its summit plus 2 m, on a 25 m lattice; the summit its surveyed
     elevation (GT.pratzeberg.elev, 324 m), a fixed reference that a low drawn summit point cannot lower (the model's own at the point beside it) */
  { const S=G.GT.pratzeberg.map, top=G.GT.pratzeberg.elev, r=D.limits.summitKm/G.KM_PER_MAP, step=0.025/G.KM_PER_MAP; let hi=-1e9, at=null;
    for(let y=-r;y<=r+1e-9;y+=step) for(let x=-r;x<=r+1e-9;x+=step){ if(x*x+y*y>r*r) continue; const e=elevAt(S[0]+x,S[1]+y); if(e>hi){ hi=e; at=[S[0]+x,S[1]+y]; } }
    const dv=hi-top;
    add("summit", dv, D.limits.summitM, dv<=D.limits.summitM, "no false summit: the highest ground within "+D.limits.summitKm+" km of the Pratzeberg "+hi.toFixed(1)+" m at map "+at.map(v=>v.toFixed(1)).join(",")+
      " ("+Math.round(G.kmBetween(S,at)*1000)+" m from it), the surveyed summit "+top+" m (the model "+elevAt(S[0],S[1]).toFixed(1)+" m at its point), "+(dv>=0?"+":"")+dv.toFixed(1)+" m (limit +"+D.limits.summitM+")"); }
  return {rows, ok:rows.every(r=>r.ok)};
}
module.exports={check};
