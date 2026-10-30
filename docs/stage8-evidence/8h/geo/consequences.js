#!/usr/bin/env node
/* Stage 8, implementation PR 8H (docs/STAGE8_SPEC.md section 20.6; docs/stage8-evidence/8h/geo/proposal.md): what each proposed correction of
   the geographic review would touch, computed from the repository's own declarations and this folder's places.json. Nothing here changes a
   source file: it reads geo.js, data.js, analysis.js, world.js (evaluated as terrain-test.js evaluates them), tools/step4/statements.js and
   places.json, and writes consequences.json beside itself, printing a summary.
   For each correction (its proposed geometry in map units, from places.json: today's sources and the 1825-52 maps as read in README.md):
   - the declarations it would change (each in check:data's guarded group, tools/visual/data-invariance.js, or not);
   - the formations' anchors (FORMATIONS[].track[phase].p), the places (FEATURES), the events (EVENTS.p), the plans' objectives and routes
     (PLANS columns' obj and route points) and the arrows' points (OVERLAYS) within RADIUS of the old or the new place, each with both distances;
   - for the brook: every anchor whose side of the drawn brook would change (east or west at its own row), and the roads and tracks whose
     crossing of it would move; for the highway: the anchors near it that would no longer be beside it; for the woods: the anchors inside the
     old or the new outline;
   - the visitor statements (tools/step4/statements.js) that name the place.
   node docs/stage8-evidence/8h/geo/consequences.js   (from the repository's root; no network) */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.join(__dirname,"..","..","..","..");
process.chdir(ROOT);
global.GEOREF=require(path.join(ROOT,"geo.js"));
global.THREE=require("three");
const K=require(path.join(__dirname,"krovak.js"));
const P=require(path.join(__dirname,"places.json"));
/* the declarations, evaluated in the global scope (an indirect eval: this module is strict), as terrain-test.js evaluates them */
(0,eval)(fs.readFileSync(path.join(ROOT,"data.js"),"utf8"));
(0,eval)(fs.readFileSync(path.join(ROOT,"analysis.js"),"utf8"));
(0,eval)(fs.readFileSync(path.join(ROOT,"tokens.js"),"utf8"));
(0,eval)(fs.readFileSync(path.join(ROOT,"world.js"),"utf8"));
const ST=require(path.join(ROOT,"tools","step4","statements.js")).statements(ROOT);
const GUARD=fs.readFileSync(path.join(ROOT,"tools","visual","data-invariance.js"),"utf8");
const guarded=name=>new RegExp('["\\s,]'+name+'[",]').test(GUARD);

const enToMap=en=>{ const g=K.fromJTSK(en[0],en[1]); return GEOREF.toMap(g[0],g[1]); };
const mapDistM=(a,b)=>1000*GEOREF.kmBetween(a,b);
const r1=v=>Math.round(v*10)/10;
const RADIUS=20;   /* map units (about 630 m): an anchor this near a place is read as placed by it, or near enough to be affected */

/* polyline helpers in map units */
function xAtY(line,y){ let best=null; for(let i=0;i<line.length-1;i++){ const a=line[i], b=line[i+1]; const lo=Math.min(a[1],b[1]), hi=Math.max(a[1],b[1]);
  if(y<lo||y>hi||a[1]===b[1]) continue; const t=(y-a[1])/(b[1]-a[1]), x=a[0]+t*(b[0]-a[0]); if(best===null||Math.abs(x)<Infinity) best=best===null?x:best; } return best; }
function yAtX(line,x){ for(let i=0;i<line.length-1;i++){ const a=line[i], b=line[i+1]; const lo=Math.min(a[0],b[0]), hi=Math.max(a[0],b[0]);
  if(x<lo||x>hi||a[0]===b[0]) continue; const t=(x-a[0])/(b[0]-a[0]); return a[1]+t*(b[1]-a[1]); } return null; }
function segDistP(p,a,b){ const dx=b[0]-a[0], dy=b[1]-a[1], L=dx*dx+dy*dy, t=L?Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/L)):0; return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy); }
function lineDist(p,line){ let d=Infinity; for(let i=0;i<line.length-1;i++) d=Math.min(d,segDistP(p,line[i],line[i+1])); return d; }
function inPoly(p,poly){ let c=false; for(let i=0,j=poly.length-1;i<poly.length;j=i++){ const a=poly[i], b=poly[j];
  if(((a[1]>p[1])!==(b[1]>p[1]))&&(p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])) c=!c; } return c; }
function inEll(p,w){ const dx=p[0]-w.c[0], dy=p[1]-w.c[1], c=Math.cos(-w.rot), s=Math.sin(-w.rot), u=dx*c-dy*s, v=dx*s+dy*c; return (u*u)/(w.rx*w.rx)+(v*v)/(w.ry*w.ry)<=1; }
function centroid(poly){ let A=0,cx=0,cy=0; for(let i=0,j=poly.length-1;i<poly.length;j=i++){ const f=poly[j][0]*poly[i][1]-poly[i][0]*poly[j][1]; A+=f; cx+=(poly[j][0]+poly[i][0])*f; cy+=(poly[j][1]+poly[i][1])*f; }
  A/=2; return [cx/(6*A),cy/(6*A)]; }
function segX(a,b,c,d){ const r=[b[0]-a[0],b[1]-a[1]], s=[d[0]-c[0],d[1]-c[1]], den=r[0]*s[1]-r[1]*s[0]; if(!den) return null;
  const t=((c[0]-a[0])*s[1]-(c[1]-a[1])*s[0])/den, u=((c[0]-a[0])*r[1]-(c[1]-a[1])*r[0])/den; return (t>=0&&t<=1&&u>=0&&u<=1)?[a[0]+t*r[0],a[1]+t*r[1]]:null; }
function crossings(line,road){ const out=[]; for(let i=0;i<line.length-1;i++) for(let j=0;j<road.length-1;j++){ const q=segX(line[i],line[i+1],road[j],road[j+1]); if(q) out.push(q.map(r1)); } return out; }

/* every positioned point of the data, with what it is */
const POINTS=[];
for(const id of Object.keys(FORMATIONS)){ const f=FORMATIONS[id]; if(!f.track) continue;
  for(const ph of Object.keys(f.track)){ const a=f.track[ph]; if(a&&Array.isArray(a.p)) POINTS.push({kind:"anchor", ref:"FORMATIONS."+id+".track[\""+ph+"\"]", who:f.name||id, p:a.p, cf:a.cf||null, st:a.st||null}); } }
FEATURES.forEach(f=>{ if(Array.isArray(f.p)) POINTS.push({kind:"place", ref:"FEATURES[#"+f.id+"]", who:f.name, p:f.p}); });
EVENTS.forEach(e=>{ if(Array.isArray(e.p)) POINTS.push({kind:"event", ref:"EVENTS[#"+e.id+"]", who:e.n, p:e.p}); });
Object.keys(PLANS).forEach(side=>{ (PLANS[side].cols||PLANS[side].columns||[]).forEach((c,i)=>{
  if(Array.isArray(c.obj)) POINTS.push({kind:"plan objective", ref:"PLANS."+side+"["+i+"].obj", who:c.n, p:c.obj});
  (c.route||[]).forEach((q,k)=>{ if(Array.isArray(q)) POINTS.push({kind:"plan route", ref:"PLANS."+side+"["+i+"].route["+k+"]", who:c.n, p:q}); }); }); });
/* the arrows and lines (OVERLAYS, app.js's guarded interpretation data): the declaration's own text, read with acorn and evaluated alone */
const OVERLAYS=(function(){ const src=fs.readFileSync(path.join(ROOT,"app.js"),"utf8"), ast=require("acorn").parse(src,{ecmaVersion:2020});
  const d=ast.body.find(n=>n.type==="VariableDeclaration"&&n.declarations.some(x=>x.id.name==="OVERLAYS")).declarations.find(x=>x.id.name==="OVERLAYS");
  return (new Function("return ("+src.slice(d.init.start,d.init.end)+");"))(); })();
Object.keys(OVERLAYS).forEach(ph=>{ const O=OVERLAYS[ph]; Object.keys(O).forEach(kind=>{ (Array.isArray(O[kind])?O[kind]:[]).forEach((o,i)=>{ const pts=o&&(o.pts||o.p); if(!Array.isArray(pts)) return;
  pts.forEach((q,k)=>{ if(Array.isArray(q)&&typeof q[0]==="number") POINTS.push({kind:"overlay point", ref:"OVERLAYS["+ph+"]."+kind+"["+i+"].pts["+k+"]", who:o.label||o.n||"", p:q}); }); }); }); });

function near(oldP,newP,R){ return POINTS.map(q=>({q:q, dOld:Math.hypot(q.p[0]-oldP[0],q.p[1]-oldP[1]), dNew:Math.hypot(q.p[0]-newP[0],q.p[1]-newP[1])}))
  .filter(x=>x.dOld<=R||x.dNew<=R).sort((a,b)=>Math.min(a.dOld,a.dNew)-Math.min(b.dOld,b.dNew))
  .map(x=>({kind:x.q.kind, ref:x.q.ref, who:x.q.who, p:x.q.p, cf:x.q.cf, st:x.q.st, oldM:Math.round(mapDistM(x.q.p,oldP)), newM:Math.round(mapDistM(x.q.p,newP))})); }
function says(re){ return ST.filter(s=>re.test(s.whole||s.text)).map(s=>({ref:s.ref, file:s.file, line:s.line, t:(s.whole||s.text).slice(0,140)})); }

const OUT={tool:"docs/stage8-evidence/8h/geo/consequences.js", radius_map_units:RADIUS, corrections:{}};

/* A. the castle: the legacy W(226,355) castlePlan8g starts from, to today's castle (the 1825 quadrangle's site, README 6.1, 7.2) */
(function(){ const L=P.landmarks.find(l=>l.id==="sokolnice_castle"), now=[226,355], tgt=L.map;
  OUT.corrections.castle={what:"Sokolnitz castle: the buildings planner's legacy place W(226,355) (world.js castlePlan8g) to today's castle, the 1825 quadrangle's site",
    from:now, to:tgt, moveM:Math.round(mapDistM(now,tgt)), declarations:[{name:"castlePlan8g (world.js; its W(226,355) and v8NearSegs radius)", guarded:guarded("castlePlan8g")}],
    near:near(now,tgt,RADIUS), statements:says(/\bcastle\b/i).filter(s=>/sokolnitz|przyby|pheasant|castle grounds|walled castle/i.test(s.t)||/sokolnitz|prz\b/i.test(s.ref))}; })();

/* B. the pheasantry: WOODS[0] (an ellipse south-east of the village) to the 1825 Fasangarten north of the castle (README 6.1, 7.1) */
(function(){ const W0=WOODS[0], poly=P.figures.period1825.fasangarten_1825.en.map(enToMap), c=centroid(poly);
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9; poly.forEach(q=>{ x0=Math.min(x0,q[0]); x1=Math.max(x1,q[0]); y0=Math.min(y0,q[1]); y1=Math.max(y1,q[1]); });
  const today=P.figures.pheasantry.map(enToMap);
  const ins=POINTS.filter(q=>q.kind==="anchor").map(q=>({ref:q.ref, who:q.who, p:q.p, inOld:inEll(q.p,{c:W0.c,rx:W0.rx,ry:W0.ry,rot:W0.rot}), in1825:inPoly(q.p,poly), inToday:inPoly(q.p,today)})).filter(x=>x.inOld||x.in1825||x.inToday);
  OUT.corrections.pheasantry={what:"the Sokolnitz pheasantry: WOODS[0] (c "+W0.c+", rx "+W0.rx+", ry "+W0.ry+") to the 1825 Fasangarten's outline",
    from:W0.c, to:c.map(r1), moveM:Math.round(mapDistM(W0.c,c)), outline1825:{x:[r1(x0),r1(x1)], y:[r1(y0),r1(y1)], points:poly.length}, todayCentroid:centroid(today).map(r1),
    declarations:[{name:"WOODS (world.js)", guarded:guarded("WOODS")}], anchorsInside:ins, near:near(W0.c,c,RADIUS), statements:says(/pheasant/i)}; })();

/* C. the Goldbach at Sokolnitz: GOLDBACH_M between Kobelnitz and Telnitz to today's Říčka (the 1825 channel at the castle within about
   10 m; north of the castle the 1825 avenue channel within 7-8 m, README 6.1, 7.3). The review read the brook at the castle's and the village's
   rows only: the comparison and the proposal are limited to y 300-380 (from Kobelnitz's south end to below the village); south of it, to
   Telnitz and the meres (decision 27), the drawn course is not reviewed here */
(function(){ const old=GOLDBACH_M, Y0=300, Y1=380;
  /* today's Říčka: its OSM ways joined north to south (each way's points in order, the ways ordered by their northern end) */
  const parts=P.figures.real_stream.map(s=>s.map(enToMap)).filter(l=>l.length>1).map(l=>l[0][1]<=l[l.length-1][1]?l:l.slice().reverse()).sort((a,b)=>a[0][1]-b[0][1]);
  const main=[].concat.apply([],parts);
  const rows=[]; for(let y=Y0;y<=Y1;y+=5){ const xo=xAtY(old,y), xn=xAtY(main,y); rows.push({y:y, oldX:xo===null?null:r1(xo), newX:xn===null?null:r1(xn), gapM:(xo===null||xn===null)?null:Math.round(mapDistM([xo,y],[xn,y]))}); }
  const side=[]; POINTS.filter(q=>q.kind!=="plan route"||true).forEach(q=>{ const y=q.p[1]; if(y<Y0||y>Y1) return;
    const xo=xAtY(old,y), xn=xAtY(main,y); if(xo===null||xn===null) return; const so=q.p[0]<xo?"west":"east", sn=q.p[0]<xn?"west":"east";
    if(so!==sn||Math.abs(q.p[0]-xn)<5) side.push({kind:q.kind, ref:q.ref, who:q.who, p:q.p, cf:q.cf, st:q.st, oldSide:so, newSide:sn, toOldM:Math.round(mapDistM(q.p,[xo,y])), toNewM:Math.round(mapDistM(q.p,[xn,y]))}); });
  const clip=l=>l.filter(q=>q[1]>=Y0-6&&q[1]<=Y1+6);
  const roads=ROADS.map(r=>({n:r.n, oldX:crossings(clip(old),r.p).filter(q=>q[1]>=Y0&&q[1]<=Y1), newX:crossings(main,r.p).filter(q=>q[1]>=Y0&&q[1]<=Y1)})).filter(r=>r.oldX.length||r.newX.length);
  OUT.corrections.goldbach={what:"the Goldbach at Sokolnitz: GOLDBACH_M's course between y "+Y0+" and "+Y1+" to today's Říčka (the 1825 brook at the castle and the village)", rows:rows,
    declarations:[{name:"GOLDBACH_M (world.js)", guarded:guarded("GOLDBACH_M")},{name:"MARSH[0] 'lower Goldbach' (world.js), its centre on the drawn brook", guarded:guarded("MARSH")}],
    sideChanges:side.filter(s=>s.oldSide!==s.newSide), onTheNewBrook:side.filter(s=>s.oldSide===s.newSide), roadCrossings:roads,
    statements:says(/goldbach|the brook|the stream/i).filter(s=>/sokolnitz|castle|pheasant/i.test(s.t)||/sokolnitz|prz|langeron|legrand|friant/i.test(s.ref))}; })();

/* D. the highway east of the Santon: ROADS[0] from the Santon to the post house, to II/430's line (README 6.2-6.4, 7.5) */
(function(){ const road=ROADS[0].p, real=P.figures.real_road.map(s=>s.map(enToMap));
  const pts=[].concat.apply([],real).filter(q=>q[0]>=200&&q[0]<=410).sort((a,b)=>a[0]-b[0]);
  const line=[]; let last=-1e9; pts.forEach(q=>{ if(q[0]-last>=2){ line.push(q); last=q[0]; } });
  const rows=[]; [222,240,260,280,300,324,340,363,380,400].forEach(x=>{ const yo=yAtX(road,x), yn=yAtX(line,x); rows.push({x:x, oldY:yo===null?null:r1(yo), newY:yn===null?null:r1(yn), gapM:(yo===null||yn===null)?null:Math.round(mapDistM([x,yo],[x,yn]))}); });
  const by=POINTS.map(q=>({q:q, dOld:lineDist(q.p,road.slice(2)), dNew:lineDist(q.p,line)})).filter(x=>x.q.p[0]>=215&&(x.dOld<=8||x.dNew<=8))
    .map(x=>({kind:x.q.kind, ref:x.q.ref, who:x.q.who, p:x.q.p, cf:x.q.cf, st:x.q.st, toOldM:Math.round(x.dOld*1000*GEOREF.kmBetween([0,0],[1,0])), toNewM:Math.round(x.dNew*1000*GEOREF.kmBetween([0,0],[1,0]))}));
  OUT.corrections.highway={what:"the Brünn-Olmütz highway east of the Santon: ROADS[0]'s points [225,97],[239,80],[324,36],[401,-4] to II/430's line (the 1826 and 1836-52 road)", rows:rows,
    declarations:[{name:"ROADS (world.js)", guarded:guarded("ROADS")}], near:by,
    statements:says(/highway|olm[uü]tz road|post road|chauss/i)}; })();

/* E. the post house: GT.posthouse (a construction) to Kovalovice No. 109 (README 6.2, 6.3, 7.4) */
(function(){ const now=GEOREF.toMap(GEOREF.GT.posthouse.lat,GEOREF.GT.posthouse.lon).map(r1), L=P.landmarks.find(l=>l.id==="posthouse"), to=L.map;
  OUT.corrections.posthouse={what:"the Posoritz post house: GT.posthouse (geo.js; drawn place FEATURES posthouse p [324,36]) to Kovalovice No. 109",
    from:now, to:to.map(r1), moveM:Math.round(mapDistM(now,to)), declarations:[{name:"GT.posthouse (geo.js GEOREF)", guarded:guarded("GEOREF")||true},{name:"FEATURES (data.js) #posthouse p", guarded:guarded("FEATURES")}],
    near:near(now,to,RADIUS), statements:says(/post ?house|posoritz post|posthaus/i)}; })();

/* F. the Austerlitz park: WOODS[1] (south-east of the town) to the château garden west of the château (README 6.2, 6.3, 7.6) */
(function(){ const W1=WOODS[1], g=P.figures.garden.map(enToMap), c=centroid(g);
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9; g.forEach(q=>{ x0=Math.min(x0,q[0]); x1=Math.max(x1,q[0]); y0=Math.min(y0,q[1]); y1=Math.max(y1,q[1]); });
  OUT.corrections.park={what:"the Austerlitz park: WOODS[1] (c "+W1.c+", rx "+W1.rx+", ry "+W1.ry+") to the château garden west of the château",
    from:W1.c, to:c.map(r1), extent:{x:[r1(x0),r1(x1)], y:[r1(y0),r1(y1)]}, moveM:Math.round(mapDistM(W1.c,c)), declarations:[{name:"WOODS (world.js)", guarded:guarded("WOODS")}],
    near:near(W1.c,c,RADIUS), statements:says(/\bpark\b|garden/i).filter(s=>/austerlitz|château|chateau|kaunitz/i.test(s.t))}; })();

/* G. the Pratzen church: drawn by its village point since 8G's planner, to its own site outside the village (README 7.7) */
(function(){ const L=P.landmarks.find(l=>l.id==="prace_church"), to=L.map, from=[276,243];
  OUT.corrections.pratzenChurch={what:"the Pratzen church: by the village point (276,243) (world.js churchPlan8g, CHURCHES) to its site outside the village",
    from:from, to:to.map(r1), moveM:Math.round(mapDistM(from,to)), declarations:[{name:"churchPlan8g (world.js; the village's church placed near its point)", guarded:guarded("churchPlan8g")}],
    near:near(from,to,10), statements:says(/pratzen.*church|church.*pratzen/i)}; })();

fs.writeFileSync(path.join(__dirname,"consequences.json"),JSON.stringify(OUT,null,1));
for(const k of Object.keys(OUT.corrections)){ const c=OUT.corrections[k];
  console.log("\n== "+k+": "+c.what+(c.moveM!==undefined?" ("+c.moveM+" m)":""));
  console.log("   declarations: "+c.declarations.map(d=>d.name+(d.guarded?" [guarded]":"")).join("; "));
  if(c.rows) console.log("   rows: "+c.rows.map(r=>JSON.stringify(r)).join(" "));
  if(c.anchorsInside) console.log("   anchors inside the old or new wood: "+c.anchorsInside.map(a=>a.ref+" "+JSON.stringify(a.p)+" old "+a.inOld+" 1825 "+a.in1825+" today "+a.inToday).join("; ")||"none");
  if(c.sideChanges) console.log("   side of the brook changes: "+(c.sideChanges.map(a=>a.ref+" "+JSON.stringify(a.p)+" "+a.oldSide+"->"+a.newSide).join("; ")||"none"));
  if(c.onTheNewBrook) console.log("   within 5 units of the new brook: "+(c.onTheNewBrook.map(a=>a.ref+" "+JSON.stringify(a.p)+" "+a.toNewM+" m").join("; ")||"none"));
  if(c.roadCrossings) console.log("   road crossings: "+c.roadCrossings.map(r=>r.n+" old "+JSON.stringify(r.oldX)+" new "+JSON.stringify(r.newX)).join("; "));
  if(c.near) console.log("   near ("+c.near.length+"): "+c.near.slice(0,40).map(a=>a.kind+" "+a.ref+" "+JSON.stringify(a.p)+(a.oldM!==undefined?" "+a.oldM+"->"+a.newM+" m":" "+a.toOldM+"->"+a.toNewM+" m")).join("; "));
  console.log("   statements naming it ("+c.statements.length+"): "+c.statements.slice(0,30).map(s=>s.ref).join(", "));
}
