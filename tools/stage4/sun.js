#!/usr/bin/env node
/* Stage 4 Part A (docs/STAGE4_SPEC.md sections A and B): the sun of 2 December 1805 over the field, computed, against the light
   the app draws today. Node only: the model is read from the live sources through tools/stage2/model.js (the LIGHT table is taken
   from app.js by acorn); nothing is bundled and no source changes. node tools/stage4/sun.js [--json out.json] [--md out.md]

   1. The ephemeris (derived, not a record): the sun's altitude and true azimuth at GEOREF's origin (49.14 N, 16.76 E) every
      10 minutes from 04:00 to 18:00 on 2 December 1805, by Meeus's low-accuracy solar coordinates (Astronomical Algorithms,
      ch. 25) and the NOAA equation of time, with standard refraction (Bennett). Two readings of the app's clock are given, since
      the clock basis of the sources' hours is not established: local apparent (solar) time, where the sun crosses the meridian
      at 12:00, and local mean time, where it crosses at 12:00 minus the equation of time. Sunrise and sunset (the upper limb,
      -0.833 degrees), civil and nautical twilight, and the highest altitude.
   2. The light today (fact, read from the sources): each phase's LIGHT preset (app.js) as a true azimuth and altitude (the
      preset's sun vector p, from the orbit target toward the sun, in world axes; true north is GEOREF.NORTH in the map's x,y,
      which W() carries to world x,z unchanged), its intensity and its sun disc, against the computed sun at the phase's start,
      middle and end. Since roadmap step 2 (docs/FINAL_AUDIT.md D-4) the phases name no preset: PHASES[].light, without a reader
      since 4B, was removed from data.js. This part runs only on a source tree in which every phase names one (before step 2; its
      reading is docs/stage4-evidence/sun.md); on one in which none does it is left out and the script says so, and on one in which
      some do it stops (a partial table would read as the whole day).
   3. The display factor (derived): a slope of true gradient s is drawn with gradient k*s at factor k. The ground's lit side
      (the sign of N.L) and its cast shadows are the true ground's under the true sun exactly when the light's vertical
      component is scaled by k as well: tan(alt_k) = k tan(alt). For each factor (1, 4, GEOREF.EXAG) the altitude that would
      take, at each hour; and the share of the modelled ground facing away from the sun (N.L <= 0) under the true sun and
      under the corrected one, on the model's own surface (localHeight sampled every world unit), at each factor. */
const fs=require("fs"), path=require("path");
const {load}=require("../stage2/model.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const X=load(["LIGHT"]), G=X.GEOREF;
const D2R=Math.PI/180, R2D=180/Math.PI;
const LAT=49.14, LON=16.76;   /* GEOREF's local tangent plane origin (geo.js) */

/* ---- the sun (tools/stage4/ephem.js: Meeus ch. 25, NOAA's equation of time, Bennett's refraction) ---- */
const sunAtClock=require("./ephem.js").makeSun(LAT,LON);
function crossing(basis,level,from,to,rising){   /* the clock minute at which the geometric altitude crosses level */
  let a=from, b=to; const f=t=>sunAtClock(t,basis).geo-level;
  for(let k=0;k<60;k++){ const m=(a+b)/2; if((f(m)<0)===rising) a=m; else b=m; } return (a+b)/2; }
const hm=t=>{ const m=Math.round(t); return String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0"); };
const r1=v=>+v.toFixed(1), r2=v=>+v.toFixed(2);

const ephem={site:"49.14 N, 16.76 E (GEOREF origin)", date:"1805-12-02", bases:{}};
["apparent","mean"].forEach(b=>{
  const noon = b==="apparent" ? 720 : 720-sunAtClock(720,b).eot;
  const E={eotMin:r2(sunAtClock(720,b).eot), declDeg:r2(sunAtClock(720,b).dec), noon:hm(noon),
    maxAlt:r1(sunAtClock(noon,b).alt),
    nauticalDawn:hm(crossing(b,-12,300,noon,true)), civilDawn:hm(crossing(b,-6,300,noon,true)), sunrise:hm(crossing(b,-0.833,300,noon,true)),
    sunset:hm(crossing(b,-0.833,noon,1140,false)), civilDusk:hm(crossing(b,-6,noon,1200,false)), nauticalDusk:hm(crossing(b,-12,noon,1260,false)),
    table:[]};
  for(let t=240;t<=1080;t+=10){ const s=sunAtClock(t,b); E.table.push({t:hm(t),alt:r1(s.alt),az:r1(s.az)}); }
  ephem.bases[b]=E;
});

/* ---- the light today: each preset's sun vector as a true azimuth and altitude ---- */
const N=G.NORTH, E=[-N[1],N[0]];   /* true north and east in the map's x,y = world x,z (W() only scales and shifts) */
function presetSun(L){ const p=L.p, h=Math.hypot(p[0],p[2]);
  const n=p[0]*N[0]+p[2]*N[1], e=p[0]*E[0]+p[2]*E[1];
  return {az:r1((Math.atan2(e,n)*R2D+360)%360), alt:r1(Math.atan2(p[1],h)*R2D), i:L.i, disc:L.disc, hemi:L.hemi, fogN:L.fogN, fogF:L.fogF}; }
const named=X.PHASES.filter(ph=>ph.light!==undefined);
if(named.length&&named.length!==X.PHASES.length) throw new Error("sun.js: "+named.length+" of "+X.PHASES.length+" phases name a light preset; part 2 needs every phase or none");
named.forEach(ph=>{ if(!X.LIGHT[ph.light]) throw new Error("sun.js: phase "+ph.id+" names the light preset \""+ph.light+"\", which app.js's LIGHT does not have"); });
const PRESETS=named.length>0;
const NO_PRESETS="The phases name no light preset (roadmap step 2, docs/FINAL_AUDIT.md D-4: PHASES[].light, without a reader since 4B, removed); the presets' rows are left out. Their reading on the build before step 2 is docs/stage4-evidence/sun.md.";
const today=named.map(ph=>{ const L=X.LIGHT[ph.light], s=presetSun(L), mid=(ph.t0+ph.t1)/2;
  const at=t=>{ const a=sunAtClock(t,"apparent"), m=sunAtClock(t,"mean"); return {apparent:{alt:r1(a.alt),az:r1(a.az)},mean:{alt:r1(m.alt),az:r1(m.az)}}; };
  return {phase:ph.id, label:ph.label, clock:hm(ph.t0)+"-"+hm(ph.t1), light:ph.light, mist:ph.mist, preset:s,
    computed:{start:at(ph.t0), mid:at(mid), end:at(ph.t1)}}; });
const staff=presetSun(X.LIGHT.staff);
/* the baked hillshade's light (world.js groundVertexFacts, paperShade): (-0.52, 0.70, -0.49) */
const bakedSun=presetSun({p:[-0.52,0.70,-0.49]});

/* ---- the display factor: the corrected altitude, and the ground facing away ---- */
const factors=[1,4,G.EXAG];
const corrected=[];
for(let t=480;t<=960;t+=60){ const s=sunAtClock(t,"apparent"); if(s.alt<=0) continue;
  corrected.push({t:hm(t),alt:r1(s.alt),az:r1(s.az),altAt:factors.map(k=>r1(Math.atan(k*Math.tan(s.alt*D2R))*R2D))}); }
/* the model surface: localHeight (model units, the drawing at GEOREF.EXAG) on a 1-unit lattice over the modelled ground; at
   factor k its gradient is the model's times k/EXAG */
const lh=(typeof X.localHeight==="function")?X.localHeight:X.height;
/* the model height on a half-unit raster (for the gradients and the shadow march) */
const HX0=-180, HZ0=-155, HN=[721,621], HR=new Float64Array(HN[0]*HN[1]);
for(let j=0;j<HN[1];j++) for(let i=0;i<HN[0];i++) HR[j*HN[0]+i]=lh(HX0+i*0.5,HZ0+j*0.5);
function hR(x,z){ const fx=(x-HX0)*2, fz=(z-HZ0)*2; if(fx<0||fz<0||fx>=HN[0]-1||fz>=HN[1]-1) return null;
  const i=Math.floor(fx), j=Math.floor(fz), u=fx-i, v=fz-j, o=j*HN[0]+i;
  return (HR[o]*(1-u)+HR[o+1]*u)*(1-v)+(HR[o+HN[0]]*(1-u)+HR[o+HN[0]+1]*u)*v; }
const grid=[]; for(let z=-150;z<=150;z+=1) for(let x=-175;x<=175;x+=1){
  const gx=(hR(x+0.5,z)-hR(x-0.5,z)), gz=(hR(x,z+0.5)-hR(x,z-0.5)); grid.push([gx,gz,x,z]); }
function awayShare(k,az,alt){   /* share of lattice points with N.L <= 0 at factor k under a sun at az, alt (true) */
  const s=k/G.EXAG, a=az*D2R;
  /* the sun's horizontal direction in world x,z from its true azimuth */
  const hx=Math.sin(a)*E[0]+Math.cos(a)*N[0], hz=Math.sin(a)*E[1]+Math.cos(a)*N[1], ly=Math.tan(alt*D2R);
  let n=0; for(const g of grid){ const d=-g[0]*s*hx-g[1]*s*hz+ly; if(d<=0) n++; } return n/grid.length; }
/* cast shadow: a lattice point (every 2 units) is in the terrain's shadow if the ground anywhere toward the sun (1-unit steps, up
   to 200 units) rises above the sun's ray from it; at factor k a ray of true altitude alt rises tan(alt)*EXAG/k model units a unit */
function shadowShare(k,az,alt){
  const a=az*D2R, hx=Math.sin(a)*E[0]+Math.cos(a)*N[0], hz=Math.sin(a)*E[1]+Math.cos(a)*N[1], rise=Math.tan(alt*D2R)*G.EXAG/k;
  let n=0, m=0;
  for(let z=-150;z<=150;z+=2) for(let x=-175;x<=175;x+=2){ const h0=hR(x,z); if(h0===null) continue; m++;
    for(let d=1;d<=200;d++){ const q=hR(x+hx*d,z+hz*d); if(q===null) break; const ray=h0+d*rise; if(ray>16) break; if(q>ray){ n++; break; } } }
  return n/m; }
const away=[];
for(let t=480;t<=960;t+=60){ const s=sunAtClock(t,"apparent"); if(s.alt<=0) continue;
  const row={t:hm(t),alt:r1(s.alt)};
  factors.forEach(k=>{ const kk=fmtK(k); row["true@"+kk]=+(100*awayShare(k,s.az,s.alt)).toFixed(2);
    row["corrected@"+kk]=+(100*awayShare(k,s.az,Math.atan(k*Math.tan(s.alt*D2R))*R2D)).toFixed(2);
    row["shadow@"+kk]=+(100*shadowShare(k,s.az,s.alt)).toFixed(2);
    row["shadowCorr@"+kk]=+(100*shadowShare(k,s.az,Math.atan(k*Math.tan(s.alt*D2R))*R2D)).toFixed(2); });
  away.push(row); }
/* the presets as drawn today, the same measure */
const awayToday=today.filter(p=>p.preset.alt>0).map(p=>{ const row={phase:p.phase,light:p.light,alt:p.preset.alt};
  factors.forEach(k=>{ row["@"+fmtK(k)]=+(100*awayShare(k,p.preset.az,p.preset.alt)).toFixed(2); row["shadow@"+fmtK(k)]=+(100*shadowShare(k,p.preset.az,p.preset.alt)).toFixed(2); }); return row; });
function fmtK(k){ return k===G.EXAG?(+k.toFixed(2))+"x":k+"x"; }
/* the model's slopes: true gradient percentiles on the lattice (degrees, at true scale) */
const slopes=grid.map(g=>Math.atan(Math.hypot(g[0],g[1])/G.EXAG)*R2D).sort((a,b)=>a-b);
const pct=q=>r2(slopes[Math.floor(q*(slopes.length-1))]);
const slopeTrue={p50:pct(0.5),p90:pct(0.9),p99:pct(0.99),max:r2(slopes[slopes.length-1])};
const slopeAt=k=>({p50:r1(Math.atan(Math.tan(slopeTrue.p50*D2R)*k)*R2D),p90:r1(Math.atan(Math.tan(slopeTrue.p90*D2R)*k)*R2D),p99:r1(Math.atan(Math.tan(slopeTrue.p99*D2R)*k)*R2D),max:r1(Math.atan(Math.tan(slopeTrue.max*D2R)*k)*R2D)});

const out={ephemeris:ephem, today, staffPreset:staff, bakedHillshadeLight:bakedSun, corrected, awayShare:{computed:away,presets:awayToday},
  slopes:{trueDeg:slopeTrue, at:Object.fromEntries(factors.map(k=>[fmtK(k),slopeAt(k)]))}, lattice:grid.length};
if(opt("--json")) fs.writeFileSync(opt("--json"),JSON.stringify(out,null,1));

/* ---- a summary, and the tables as Markdown ---- */
const A=ephem.bases.apparent, Mn=ephem.bases.mean;
const md=[];
md.push("# The sun of 2 December 1805 over the field (derived), and the light today (fact)\n");
md.push("`node tools/stage4/sun.js --md docs/stage4-evidence/sun.md --json docs/stage4-evidence/sun.json`. Meeus (ch. 25) and NOAA's equation of time; refraction by Bennett. Derived from astronomy, not a record of the day.\n");
md.push("| | the clock read as local apparent (solar) time | the clock read as local mean time |\n|---|---|---|");
[["equation of time (min, apparent - mean)","eotMin"],["declination (deg)","declDeg"],["the sun on the meridian","noon"],["highest altitude (deg, refracted)","maxAlt"],
 ["nautical dawn (-12 deg)","nauticalDawn"],["civil dawn (-6 deg)","civilDawn"],["sunrise (upper limb)","sunrise"],["sunset","sunset"],["civil dusk","civilDusk"],["nautical dusk","nauticalDusk"]]
 .forEach(([l,k])=>md.push("| "+l+" | "+A[k]+" | "+Mn[k]+" |"));
md.push("\n## Each phase's light today against the computed sun (apparent time; mean time in brackets)\n");
if(!PRESETS) md.push(NO_PRESETS+"\n");
else md.push("| phase | clock | preset | preset sun: azimuth, altitude (deg) | disc | intensity | computed at start | at middle | at end |\n|---|---|---|---|---|---|---|---|---|");
today.forEach(p=>{ const f=o=>o.apparent.az+", "+o.apparent.alt+" ("+o.mean.alt+")";
  md.push("| "+p.phase+" "+p.label+" | "+p.clock+" | "+p.light+" | "+p.preset.az+", "+p.preset.alt+" | "+p.preset.disc+" | "+p.preset.i+" | "+f(p.computed.start)+" | "+f(p.computed.mid)+" | "+f(p.computed.end)+" |"); });
md.push("\nThe paper map's preset (staff): azimuth "+staff.az+", altitude "+staff.alt+". The baked hillshade's light: azimuth "+bakedSun.az+", altitude "+bakedSun.alt+".\n");
md.push("## The altitude a sun corrected to the display factor would take (tan alt_k = k tan alt)\n");
md.push("| clock | azimuth | altitude (true) | at 1x | at 4x | at "+fmtK(G.EXAG)+" |\n|---|---|---|---|---|---|");
corrected.forEach(c=>md.push("| "+c.t+" | "+c.az+" | "+c.alt+" | "+c.altAt.join(" | ")+" |"));
md.push("\n## The modelled ground facing away from the sun (N.L <= 0), % of "+grid.length+" lattice points\n");
md.push("| clock | altitude | true sun at 1x | at 4x | at "+fmtK(G.EXAG)+" | corrected sun at 1x | at 4x | at "+fmtK(G.EXAG)+" |\n|---|---|---|---|---|---|---|---|");
away.forEach(r=>md.push("| "+r.t+" | "+r.alt+" | "+factors.map(k=>r["true@"+fmtK(k)]).join(" | ")+" | "+factors.map(k=>r["corrected@"+fmtK(k)]).join(" | ")+" |"));
md.push("\n## The modelled ground in the terrain's cast shadow, % of lattice points (every 2 units)\n");
md.push("| clock | altitude | true sun at 1x | at 4x | at "+fmtK(G.EXAG)+" | corrected sun at 1x | at 4x | at "+fmtK(G.EXAG)+" |\n|---|---|---|---|---|---|---|---|");
away.forEach(r=>md.push("| "+r.t+" | "+r.alt+" | "+factors.map(k=>r["shadow@"+fmtK(k)]).join(" | ")+" | "+factors.map(k=>r["shadowCorr@"+fmtK(k)]).join(" | ")+" |"));
if(!PRESETS) md.push("\nThe presets as drawn today, the same measures: left out (the phases name no light preset; see the section on each phase's light above).");
else md.push("\nThe presets as drawn today, the same measures (facing away; in cast shadow):\n\n| phase | preset | altitude | away at 1x | at 4x | at "+fmtK(G.EXAG)+" | shadow at 1x | at 4x | at "+fmtK(G.EXAG)+" |\n|---|---|---|---|---|---|---|---|---|");
awayToday.forEach(r=>md.push("| "+r.phase+" | "+r.light+" | "+r.alt+" | "+factors.map(k=>r["@"+fmtK(k)]).join(" | ")+" | "+factors.map(k=>r["shadow@"+fmtK(k)]).join(" | ")+" |"));
md.push("\nThe model's slopes at true scale (degrees, on the lattice): median "+slopeTrue.p50+", 90th percentile "+slopeTrue.p90+", 99th "+slopeTrue.p99+", steepest "+slopeTrue.max+
  ". Drawn: "+factors.map(k=>fmtK(k)+" "+JSON.stringify(slopeAt(k))).join("; ")+".\n");
if(opt("--md")) fs.writeFileSync(opt("--md"),md.join("\n")+"\n");
console.log("apparent:",JSON.stringify(Object.fromEntries(Object.entries(A).filter(([k])=>k!=="table"))));
console.log("mean:    ",JSON.stringify(Object.fromEntries(Object.entries(Mn).filter(([k])=>k!=="table"))));
if(!PRESETS) console.log(NO_PRESETS);
today.forEach(p=>console.log("phase",p.phase,p.light.padEnd(9),"preset az/alt",p.preset.az,p.preset.alt,"disc",p.preset.disc," computed mid (apparent) az/alt",p.computed.mid.apparent.az,p.computed.mid.apparent.alt));
console.log("staff",JSON.stringify(staff),"baked",JSON.stringify(bakedSun));
corrected.forEach(c=>console.log("corrected",c.t,c.alt,c.altAt.join(" / ")));
away.forEach(r=>console.log("away",JSON.stringify(r)));
awayToday.forEach(r=>console.log("away preset",JSON.stringify(r)));
console.log("slopes",JSON.stringify(out.slopes));
