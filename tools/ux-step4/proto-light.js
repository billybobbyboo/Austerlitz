/* UI/UX roadmap step 4 (UA-03; owner decision 71): the 04:00 light prototyped in the live page (node tools/ux-step4/proto-light.js [build] [out.json]
   [capture prefix]). Each option changes LIGHT.predawn's values in the page (the build is not changed) and applies the light again; measured at
   1600 x 900 on the first screen's camera: the battle area's luminance at 04:00 and, with the camera held, at each clock of the morning (the predawn
   row is the light table's first row; the table blends it toward "dawn" between the sun's altitudes -18 and -3, so a lifted night also lifts the
   morning's twilight) */
"use strict";
const path=require("path"), fs=require("fs"), L=require("./lib.js");
const html=path.resolve(process.argv[2]||"austerlitz-command-map.html"), out=process.argv[3]||null, cap=process.argv[4]||null;
const OPT={
  N0:null,
  /* the audit's mock (docs/ux-art-audit/evidence/probes/m2.js S1-A): sun 0.62, sky fill 1.25, saturation 1.12, exposure 1.22 */
  N1:{i:0.62,hemi:1.25,sat:1.12,exp:1.22},
  /* UA-03's words: sun about 0.6, sky fill 1.25, a cooler grade (the gain toward blue), the night's saturation and exposure kept */
  N2:{i:0.60,hemi:1.25,gain:[0.92,0.97,1.10]},
  /* N2 with the exposure of the audit's mock */
  N3:{i:0.60,hemi:1.25,gain:[0.92,0.97,1.10],exp:1.22}
};
/* added after the first run (a lifted night is brighter than the dawn after it): N4, N2 with the "dawn" row's sun and sky fill raised as well
   (sun 0.60, sky fill 0.95), so that the morning does not darken between the night and the day */
OPT.N4={i:0.60,hemi:1.25,gain:[0.92,0.97,1.10],dawn:{i:0.60,hemi:0.95}};
const ONLY=(process.env.ONLY||"").split(",").filter(Boolean); if(ONLY.length) Object.keys(OPT).forEach(k=>{ if(ONLY.indexOf(k)<0) delete OPT[k]; });
const CLOCKS=[240,300,360,390,420,450,480,540];
(async()=>{ const b=await L.launch(), R={build:L.buildInfo(html), options:OPT, clocks:CLOCKS, results:{}};
  for(const k of Object.keys(OPT)){ const p=await L.open(b,html,{vp:[1600,900]});
    await p.evaluate(o=>{ if(!o) return; var P=LIGHT.predawn; P.i=o.i; P.hemi=o.hemi; if(o.gain) P.grade[1]=o.gain.slice(); if(o.sat) P.grade[2]=o.sat; if(o.exp) P.grade[5]=o.exp; if(o.dawn){ LIGHT.dawn.i=o.dawn.i; LIGHT.dawn.hemi=o.dawn.hemi; } applyLight(true); requestRender(6); },OPT[k]);
    await L.settle(p,8);
    if(cap) await p.screenshot({path:cap+"-"+k+"-1600x900.png",timeout:300000});
    const r={first:await L.battleLum(p), morning:{}};
    for(const t of CLOCKS){ await p.evaluate(t=>{ setClock(t,{instant:true,force:true,camera:false}); applyLight(true); requestRender(6); },t); await L.settle(p,8);
      const lt=await p.evaluate(()=>({i:+sun.intensity.toFixed(3),hemi:+hemi.intensity.toFixed(3),alt:+LIGHT_NOW.sun.alt.toFixed(1)}));
      r.morning[t]=Object.assign(lt,await L.battleLum(p)); }
    R.results[k]=r; console.log(k,JSON.stringify(r.first),Object.keys(r.morning).map(t=>t+":"+r.morning[t].median+"(i"+r.morning[t].i+",h"+r.morning[t].hemi+")").join(" "));
    await p.context().close(); }
  await b.close(); if(out) fs.writeFileSync(out,JSON.stringify(R,null,1)+"\n");
})().catch(e=>{ console.error(e); process.exit(1); });
