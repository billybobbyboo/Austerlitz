#!/usr/bin/env node
/* Stage 8, implementation PR 8E (decision 242 (a), 243 (a); docs/STAGE8_SPEC.md sections 4.7, 8.2 and 17): the kit's triangles per figure, by
   class, before and after: section 8.2's limit is 1.3 times the existing kit per man. Read from the blocks themselves on each build's page
   (no frame drawn): for every dress class a formation draws (ud.dress: its role, mounted or on foot, and its meshes), the triangles of one
   figure (a man: his coat and his fixed parts; a rider: his horse, coat and fixed parts; a driver likewise; a team's horse alone), on the 8D
   build the one kit geometry each mesh draws, on the 8E build the simple level's and the rich level's (each mesh's pair); and per drawn gun
   of a battery, deployed and limbered, the vehicles, the team and its drivers apart from the gunners (the extra equipment, reported apart, as
   section 8.2 asks: the gun, the limber and the teams behind the deployed guns are new or redrawn, not a man's kit).
   node tools/stage8/kit-census-8e.js <8D build.html> <8E build.html> [--json out.json]
   Measurement only; nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=opt("--json"), BUILDS=argv.filter((a,i)=>a.endsWith(".html")&&argv[i-1]!=="--json");
if(BUILDS.length!==2){ console.error("usage: kit-census-8e.js <8D build.html> <8E build.html> [--json out.json]"); process.exit(2); }
const PAGE=function(){
  var tri=function(g){ return g?(g.index?g.index.count/3:g.attributes.position.count/3):0; }, lv=function(m,k){ var L=m.userData.lod; return L?tri(L[k]):tri(m.geometry); };
  var fig={}, art={deployed:{}, limbered:{}}, bat=null;
  Object.keys(units).forEach(function(id){ var b=units[id].block, u=b&&b.userData; if(!u) return;
    (u.dress||[]).forEach(function(r){ var kind=r.role==="crew"?"a gunner":r.role==="driver"?"a driver and his horse":r.mounted?"a rider and his horse":"a man on foot";
      var key=kind+" | "+(r.dress||"generic"); if(fig[key]) return;
      var s=0, rr=0, old=0; (r.meshes||[]).forEach(function(m){ s+=lv(m,"s"); rr+=lv(m,"r"); old+=tri(m.geometry); });
      fig[key]={kind:kind, dress:r.dress||null, old:old, simple:s, rich:rr, example:id}; });
    if(u.deployed&&u.limbered&&!bat) bat={id:id, u:u}; });
  if(bat){ var guns=bat.u.art?bat.u.art.guns:null;
    [["deployed",bat.u.deployed],["limbered",bat.u.limbered]].forEach(function(p){ var g=p[1], out=art[p[0]];
      g.traverse(function(o){ if(!o.isInstancedMesh) return; var k=o.userData.kit||{}, what=k.role==="crew"?"gunners (figures)":k.role==="gear"?"the vehicles":k.role==="team"?"the team":k.role==="driver"?"the drivers":"other ("+(k.role||o.geometry.type)+")";
        var x=out[what]||(out[what]={old:0, simple:0, rich:0}); x.old+=tri(o.geometry)*o.count; x.simple+=lv(o,"s")*o.count; x.rich+=lv(o,"r")*o.count; }); });
    art.battery=bat.id; art.guns=guns||null; }
  return {fig:fig, art:art, hasLod:typeof KLOD!=="undefined"};
};
(async()=>{
  const browser=await L.launch(), res={chromium:browser.version(), builds:{}};
  const R=[];
  for(const b of BUILDS){ process.env.AUSTERLITZ_HTML=path.resolve(b);
    const page=await L.open(browser,[1280,800],{}); await page.evaluate(()=>closeFirst(null)); const r=await page.evaluate(PAGE); await page.close();
    r.md5=crypto.createHash("md5").update(fs.readFileSync(b)).digest("hex"); R.push(r); res.builds[r.md5]=r; }
  await browser.close();
  const [A,B]=R, rows=[];
  Object.keys(B.fig).sort().forEach(k=>{ const b=B.fig[k], a=A.fig[k]; const base=a?a.old:null;
    rows.push({key:k, kind:b.kind, dress:b.dress, before:base, simple:b.simple, rich:b.rich, ratio:base?+(b.rich/base).toFixed(3):null, simpleSame:base===b.simple}); });
  const worst={}; rows.forEach(r=>{ if(r.ratio===null) return; if(!worst[r.kind]||r.ratio>worst[r.kind].ratio) worst[r.kind]=r; });
  res.figures=rows; res.worstByKind=worst;
  const per=(x,g)=>g?+(x/g).toFixed(1):null, gA=A.art.guns, gB=B.art.guns;
  res.artillery={battery:B.art.battery, guns:{before:gA, after:gB}, deployed:{}, limbered:{}};
  ["deployed","limbered"].forEach(s=>{ const keys=new Set(Object.keys(A.art[s]||{}).concat(Object.keys(B.art[s]||{})));
    keys.forEach(k=>{ const a=(A.art[s]||{})[k], b=(B.art[s]||{})[k]; res.artillery[s][k]={before:a?per(a.old,gA):0, simple:b?per(b.simple,gB):0, rich:b?per(b.rich,gB):0}; }); });
  console.log("per figure, the most against the 8D kit by kind (section 8.2: at most 1.3 times):");
  Object.keys(worst).forEach(k=>{ const r=worst[k]; console.log("  "+k.padEnd(24)+String(r.before).padStart(5)+" -> simple "+String(r.simple).padStart(5)+", rich "+String(r.rich).padStart(5)+"  ("+r.ratio+"; "+r.dress+")"); });
  const over=rows.filter(r=>r.ratio!==null&&r.ratio>1.3); console.log(over.length?"OVER 1.3: "+over.map(r=>r.key+" "+r.ratio).join("; "):"every class within 1.3 times ("+rows.length+" classes)");
  const ss=rows.filter(r=>r.before!==null&&!r.simpleSame); console.log(ss.length?"the simple level differs from 8D's kit for: "+ss.map(r=>r.key+" ("+r.before+" -> "+r.simple+")").join("; "):"the simple level is 8D's kit for every class");
  console.log("per drawn gun ("+gA+" guns before, "+gB+" after; "+res.artillery.battery+"), the extra equipment apart:");
  ["deployed","limbered"].forEach(s=>Object.keys(res.artillery[s]).forEach(k=>{ const x=res.artillery[s][k]; console.log("  "+(s+": "+k).padEnd(36)+String(x.before).padStart(7)+" -> simple "+String(x.simple).padStart(7)+", rich "+String(x.rich).padStart(7)); }));
  if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(path.resolve(OUT),JSON.stringify(res,null,1)); }
})().catch(e=>{ console.error(e); process.exit(1); });
