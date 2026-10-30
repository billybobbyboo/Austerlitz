#!/usr/bin/env node
/* Stage 8, implementation PR 8H (docs/STAGE8_SPEC.md section 20): the buildings' acceptance, measured on any build that draws 8G's buildings.
   For each build named, one page opened as the harness opens it (?harness=1; tools/stage7/lib.js), the plan the app drew read back (BLDG, its
   plans): per village the build's number of houses (VILLAGES), the farmsteads drawn, how many are an L (a long range with its range along the
   street) and how many a long range alone, the buildings at the back of the yards, why the planner set aside what it set aside; every building's
   centre on the ground's drawn village class (drawnCover 5, the landscape's own ground) and in the village's place as the paper map draws it (the
   same buildings as the self-test's 8G check (b) counts); the Austerlitz château's bearing and distance from its church's nave, against its
   bearing today (BLD8G.chateau.bearing; places.md); and the two village dossiers' "Farmsteads" rows as a visitor reads them.
   node tools/stage8/buildings-8h.js --builds 8g=<html>,8h=<html> [--out file.json]
   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const BUILDS=(opt("--builds")||("now="+path.join(L.ROOT,"austerlitz-command-map.html"))).split(",").map(s=>{ const i=s.indexOf("="); return {tag:s.slice(0,i), file:path.resolve(s.slice(i+1))}; });
const OUT=opt("--out");
const md5=f=>require("crypto").createHash("md5").update(fs.readFileSync(f)).digest("hex");
(async()=>{
  const browser=await L.launch(), out={tool:"tools/stage8/buildings-8h.js", browser:browser.version(), builds:{}};
  for(const B of BUILDS){
    process.env.AUSTERLITZ_HTML=B.file;
    const page=await L.open(browser,[1600,900]);
    const r=await page.evaluate(()=>{
      var Bd=BLDG, V={}, res={villages:{}, chateau:null, errors:[]};
      VILLAGES.forEach(function(v){ var P=Bd.plans&&Bd.plans[v[0]];
        V[v[0]]={n:v[3], farms:P?P.farms.length:0, ell:0, longOnly:0, rear:0, sizes:P?P.sizes.slice():null, skipped:P?P.skipped:null,
          all:0, onClass:0, inPlace:0, church:Bd.places&&Bd.places[v[0]]?Bd.places[v[0]].church:null}; });
      Object.keys(Bd.plans||{}).forEach(function(k){ var P=Bd.plans[k], q=V[k]; P.farms.forEach(function(f){ if(f.street) q.ell++; else q.longOnly++; if(f.rear) q.rear++; }); });
      var lv=PAPER_SYM.village.level;
      Bd.forEach(function(b){ var q=V[b.village]; if(!q||!b.R||b.landmark&&!(b.church||b.part==="chapel"||b.part==="church")) return;
        if(b.part==="fence"||b.part==="churchyard wall") return;
        q.all++; var R=b.R; if(drawnCover(R.x,R.z)===5) q.onClass++;
        if(covAt(covVill,R.x,R.z)>lv&&R.pts.every(function(p){ return covAt(covVill,p[0],p[1])>=VILL8G.margin; })) q.inPlace++; });
      /* the château against its church, as the self-test reads it (8G check (e)) */
      var nave=Bd.filter(function(b){ return b.part==="church nave"&&b.village==="Austerlitz"; })[0], chat=Bd.filter(function(b){ return b.part==="chateau main range"; })[0];
      if(nave&&chat){ var En=v8East(), Nn=v8North(), dx=chat.R.x-nave.R.x, dz=chat.R.z-nave.R.z, az=(Math.atan2(dx*En[0]+dz*En[1],dx*Nn[0]+dz*Nn[1])*180/Math.PI+360)%360;
        var want=BLD8G.chateau.bearing, dev=Math.abs(((az-want)%360+540)%360-180);
        res.chateau={bearing:+az.toFixed(1), want:want, deviation:+dev.toFixed(1), dist_m:Math.round(Math.hypot(dx,dz)*GEOREF.M_PER_WORLD), dist_units:+Math.hypot(dx,dz).toFixed(2),
          tolerance:BLD8G.chateau.tol!=null?BLD8G.chateau.tol:90, church:{x:+nave.R.x.toFixed(2), z:+nave.R.z.toFixed(2)}, chateau:{x:+chat.R.x.toFixed(2), z:+chat.R.z.toFixed(2)}}; }
      res.villages=V;
      /* the dossiers' "Farmsteads" rows */
      res.dossier={};
      FEATURES.forEach(function(ft){ if(ft.kind!=="village"&&ft.kind!=="town") return; var s=buildingsSection(ft); if(!s) return;
        var rows=[].slice.call(s.querySelectorAll(".row,tr,div")).map(function(e){ return e.textContent; }).filter(function(t){ return /^Farmsteads/.test(t); });
        res.dossier[ft.name]=rows.length?rows[0]:s.textContent.slice(0,240); });
      res.totals={buildings:Bd.length};
      return res; });
    r.file=path.relative(L.ROOT,B.file); r.md5=md5(B.file); r.bytes=fs.statSync(B.file).size; r.pageErrors=page._errors.slice();
    out.builds[B.tag]=r;
    await page.close();
  }
  await browser.close();
  /* per village, each build's share on the drawn class, and the change */
  const tags=Object.keys(out.builds); out.coverage={};
  if(tags.length>=2){ const a=out.builds[tags[0]].villages, b=out.builds[tags[tags.length-1]].villages;
    Object.keys(a).forEach(k=>{ const pa=a[k].all?a[k].onClass/a[k].all:null, pb=b[k]&&b[k].all?b[k].onClass/b[k].all:null;
      out.coverage[k]={[tags[0]]:pa==null?null:+(100*pa).toFixed(1), [tags[tags.length-1]]:pb==null?null:+(100*pb).toFixed(1), kept:pa==null||pb==null?null:pb>=pa-1e-9}; }); }
  const s=JSON.stringify(out,null,1);
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,s); }
  console.log(s.length>20000?s.slice(0,20000)+"\n...":s);
})().catch(e=>{ console.error(e); process.exit(1); });
