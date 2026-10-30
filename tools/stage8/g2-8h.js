#!/usr/bin/env node
/* Stage 8, implementation PR 8H (docs/FINAL_AUDIT.md G-2; docs/STAGE8_SPEC.md section 20.7): the map-to-world factor and origin read from GEOREF
   (MAP_PER_WORLD, WORLD_ORIGIN) by world.js's W and regionalH and app.js's SUN_DAY, where each typed them until 8H; "without changing
   coordinates", shown: world.js and geo.js at a reference revision and as they stand, each loaded as the suites load them (tools/mk-world-mod.js's
   module, in a directory of its own), every number compared with ===: W over every map point the data and the ground truth name and over a grid
   of the whole map (every 0.25 map units, and fractional points), regionalH, height, hAt and localHeight over a grid of the world (every 0.5
   units), coverClass, the land cover's and the relief grid's whole arrays (buildCover, buildGrid), and the sun's place (SUN_DAY's latitude and
   longitude, toGeo of the origin).
   node tools/stage8/g2-8h.js [--ref 636cc5d] [--out file.json]   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), cp=require("child_process");
const ROOT=path.join(__dirname,"..",".."), argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const REF=opt("--ref")||"636cc5d", OUT=opt("--out");
function moduleFrom(dir,geo,world){
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,"geo.js"),geo);
  const stubSrc=fs.readFileSync(path.join(ROOT,"tools","mk-world-mod.js"),"utf8");
  const stub=/const stub='([\s\S]*?)';\n/.exec(stubSrc)[1].replace(/\\n/g,"\n");
  const tk=fs.readFileSync(path.join(ROOT,"tokens.js"),"utf8").match(/\/\*TOKENS:BEGIN\*\/([\s\S]*)\/\*TOKENS:END\*\//)[1];
  const exp="\nmodule.exports={height,hAt,W,M2W,buildCover,buildGrid,covAt,gridAt,localHeight,regionalH,coverClass,VILLAGES,ROADS,LITAVA,GOLDBACH,BROOKS,TERRAIN_LINES,\n get covWater(){return covWater}, get covMarsh(){return covMarsh}, get covWood(){return covWood}, get covVill(){return covVill}, get covRoad(){return covRoad}, get covVine(){return covVine}, get gridCurv(){return gridCurv}, get gridH(){return gridH}};\n";
  fs.writeFileSync(path.join(dir,"world_mod.js"),stub+"global.TOKENS="+tk.trim()+";\n"+world+exp);
  return require(path.join(dir,"world_mod.js"));
}
function sunCentre(appSrc,G){ const m=/var ll=GEOREF\.toGeo\(([^)]*)\)/.exec(appSrc); const GEOREF=G; return eval("GEOREF.toGeo("+m[1]+")"); }
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),"g2-8h-"));
const show=(rev,f)=>cp.execFileSync("git",["show",rev+":"+f],{cwd:ROOT,maxBuffer:64<<20}).toString();
const A=moduleFrom(path.join(tmp,"ref"),show(REF,"geo.js"),show(REF,"world.js"));
const GA=require(path.join(tmp,"ref","geo.js"));
delete global.GEOREF;
const B=moduleFrom(path.join(tmp,"now"),fs.readFileSync(path.join(ROOT,"geo.js"),"utf8"),fs.readFileSync(path.join(ROOT,"world.js"),"utf8"));
const GB=require(path.join(tmp,"now","geo.js"));
const res={tool:"tools/stage8/g2-8h.js", ref:REF, compared:{}, differ:{}};
function cmp(name,fa,fb,inputs){ let n=0, d=0, first=null;
  inputs.forEach(x=>{ const a=fa(x), b=fb(x), aa=Array.isArray(a)?a:[a], bb=Array.isArray(b)?b:[b];
    for(let i=0;i<aa.length;i++){ n++; if(!(aa[i]===bb[i]||(Number.isNaN(aa[i])&&Number.isNaN(bb[i])))){ d++; if(!first) first={x:x,a:aa[i],b:bb[i]}; } } });
  res.compared[name]=n; res.differ[name]=d; if(first) res["first:"+name]=first; }
/* map points: the data's and the ground truth's, and grids */
const pts=[]; A.VILLAGES.forEach(v=>pts.push([v[1],v[2]])); A.ROADS.forEach(r=>r.p.forEach(p=>pts.push(p))); A.TERRAIN_LINES.forEach(t=>(t.p||[]).forEach(p=>pts.push(p)));
Object.values(GA.GT).forEach(g=>pts.push(g.map));
for(let x=0;x<=680;x+=0.25) for(let y=-60;y<=560;y+=4) pts.push([x,y]);
for(let k=0;k<20000;k++) pts.push([Math.random()*700-10,Math.random()*640-70]);
cmp("W",p=>A.W(p[0],p[1]),p=>B.W(p[0],p[1]),pts);
const wpts=[]; for(let x=-175;x<=175;x+=0.5) for(let z=-155;z<=155;z+=0.5) wpts.push([x,z]);
for(let k=0;k<20000;k++) wpts.push([Math.random()*350-175,Math.random()*310-155]);
["regionalH","height","hAt","localHeight"].forEach(f=>cmp(f,p=>A[f](p[0],p[1]),p=>B[f](p[0],p[1]),wpts));
A.buildCover(); B.buildCover(); A.buildGrid(); B.buildGrid();
cmp("coverClass",p=>A.coverClass(p[0],p[1]),p=>B.coverClass(p[0],p[1]),wpts.filter((p,i)=>i%7===0));
["covWater","covMarsh","covWood","covVill","covRoad","covVine","gridH","gridCurv"].forEach(k=>{ const a=A[k], b=B[k]; cmp(k,i=>a[i],i=>b[i],Array.from({length:Math.max(a.length,b.length)},(_,i)=>i)); });
cmp("SUN_DAY's place",()=>sunCentre(show(REF,"app.js"),GA),()=>sunCentre(fs.readFileSync(path.join(ROOT,"app.js"),"utf8"),GB),[0]);
cmp("GEOREF's transform",p=>GA.toMap(p[0],p[1]).concat(GA.toGeo(p[1]*0.0+300,p[0]*0.0+200)),p=>GB.toMap(p[0],p[1]).concat(GB.toGeo(300,200)),Object.values(GA.GT).map(g=>[g.lat,g.lon]));
res.factor={MAP_PER_WORLD:GB.MAP_PER_WORLD, WORLD_ORIGIN:GB.WORLD_ORIGIN, frozen:Object.isFrozen(GB.WORLD_ORIGIN), consistent:Math.abs(GB.K/GB.UNITS_PER_KM-GB.MAP_PER_WORLD)<1e-12};
res.identical=Object.values(res.differ).every(d=>d===0);
fs.rmSync(tmp,{recursive:true,force:true});
const s=JSON.stringify(res,null,1); if(OUT){ fs.mkdirSync(path.dirname(path.resolve(OUT)),{recursive:true}); fs.writeFileSync(OUT,s); }
console.log(s); process.exit(res.identical?0:1);
