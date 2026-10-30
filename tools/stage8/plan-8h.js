#!/usr/bin/env node
/* Stage 8, implementation PR 8H (docs/STAGE8_SPEC.md section 20): a village's plan as the 8G planner sees it, drawn top-down to scale (north
   up, as the paper map): the village's place (the paper map's footprint, covVill at PAPER_SYM.village.level, and the planner's margin,
   VILL8G.margin), the ground's drawn village class (drawnCover 5), the drawn roads and streams with the clearance the planner keeps from each
   (v8NearSegs: half-width plus clearance), the meres' ice where the planner refuses it (v8Mere), the trees it keeps clear of, and every
   building the build drew there (BLDG), the church, the château and the castle marked; for a landmark the bearing a source gives (the
   château's, BLD8G.chateau.bearing) drawn as a ray with its tolerance. One SVG per village, made from the page's own functions.
   node tools/stage8/plan-8h.js --html <build> --villages Austerlitz,Satschan [--out dir] [--tag 8g]
   Measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const HTML=path.resolve(opt("--html")||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=path.resolve(opt("--out")||path.join(L.EVID8,"8h","plans")), TAG=opt("--tag")||"now";
const NAMES=(opt("--villages")||"Austerlitz,Satschan").split(",");
(async()=>{
  process.env.AUSTERLITZ_HTML=HTML;
  const browser=await L.launch(), page=await L.open(browser,[1600,900]);
  const data=await page.evaluate(names=>{
    var out={};
    names.forEach(function(name){
      var v=VILLAGES.filter(function(q){ return q[0]===name; })[0]; if(!v) return;
      var cc=W(v[1],v[2]), Rv=2.6+v[3]*0.46, R=Rv*1.7, st=0.2, nx=Math.ceil(2*R/st)+1;
      _v8Ice=null; _v8H=null;
      var grid=[]; for(var j=0;j<nx;j++){ var row=[]; for(var i=0;i<nx;i++){ var x=cc[0]-R+i*st, z=cc[1]-R+j*st;
        row.push([+covAt(covVill,x,z).toFixed(3), drawnCover(x,z), v8Mere(x,z)?1:0]); } grid.push(row); }
      var segs=v8NearSegs(cc,R+2).map(function(s){ return [s.ax,s.az,s.bx,s.bz,s.h,s.c,s.kind,s.name]; });
      var WP=woodsPlan(), trees=WP.broad.concat(WP.conif).filter(function(t){ return Math.abs(t[0]-cc[0])<R+1&&Math.abs(t[2]-cc[1])<R+1; }).map(function(t){ return [t[0],t[2],t[3]]; });
      var bl=BLDG.filter(function(b){ return b.R&&Math.abs(b.R.x-cc[0])<R+1&&Math.abs(b.R.z-cc[1])<R+1; }).map(function(b){ return {c:b.R.corners, part:b.part||b.church, village:b.village}; });
      out[name]={cc:cc, R:R, st:st, nx:nx, grid:grid, segs:segs, trees:trees, buildings:bl, level:PAPER_SYM.village.level, margin:VILL8G.margin,
        north:v8North(), east:v8East(), bearing:name==="Austerlitz"?BLD8G.chateau.bearing:null, tol:BLD8G.chateau.tol!=null?BLD8G.chateau.tol:90};
    });
    return out; },NAMES);
  await browser.close();
  fs.mkdirSync(OUT,{recursive:true});
  for(const name of Object.keys(data)){
    const D=data[name], S=600/(2*D.R), X=x=>((x-(D.cc[0]-D.R))*S).toFixed(1), Z=z=>((z-(D.cc[1]-D.R))*S).toFixed(1);
    /* the world's x is the map's x and its z the map's y (W keeps the map's axes; the map is 17.4 degrees off true north) */
    let s=`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="680" viewBox="0 0 640 680" font-family="sans-serif" font-size="11"><rect width="640" height="680" fill="#fff"/><g transform="translate(20,20)">`;
    for(let j=0;j<D.nx;j++) for(let i=0;i<D.nx;i++){ const g=D.grid[j][i], x=D.cc[0]-D.R+i*D.st, z=D.cc[1]-D.R+j*D.st;
      let f=null; if(g[2]) f="#9cc8e6"; else if(g[1]===5) f="#e9d9b8"; else if(g[0]>D.level) f="#f3eedd";
      if(f) s+=`<rect x="${X(x-D.st/2)}" y="${Z(z-D.st/2)}" width="${(D.st*S+0.5).toFixed(1)}" height="${(D.st*S+0.5).toFixed(1)}" fill="${f}"/>`;
      if(g[0]>=D.margin&&!(i+1<D.nx&&D.grid[j][i+1][0]>=D.margin&&i>0&&D.grid[j][i-1][0]>=D.margin&&j+1<D.nx&&D.grid[j+1][i][0]>=D.margin&&j>0&&D.grid[j-1][i][0]>=D.margin))
        s+=`<rect x="${X(x-0.05)}" y="${Z(z-0.05)}" width="2" height="2" fill="#a07a3a"/>`; }
    D.segs.forEach(q=>{ const col=q[6]==="road"?"#c9a14a":"#3a7bd5";
      s+=`<line x1="${X(q[0])}" y1="${Z(q[1])}" x2="${X(q[2])}" y2="${Z(q[3])}" stroke="${col}" stroke-opacity="0.18" stroke-width="${(2*(q[4]+q[5])*S).toFixed(1)}" stroke-linecap="round"/>`;
      s+=`<line x1="${X(q[0])}" y1="${Z(q[1])}" x2="${X(q[2])}" y2="${Z(q[3])}" stroke="${col}" stroke-opacity="0.6" stroke-width="${(2*q[4]*S).toFixed(1)}" stroke-linecap="round"/>`; });
    D.trees.forEach(t=>{ s+=`<circle cx="${X(t[0])}" cy="${Z(t[1])}" r="${((0.2+0.45*t[2])*S).toFixed(1)}" fill="#2e7d32" fill-opacity="0.35"/>`; });
    D.buildings.forEach(b=>{ const col=/church|chapel|temple|tower|nave|column|pediment/.test(b.part||"")?"#7b1fa2":/chateau/.test(b.part||"")?"#d32f2f":/castle/.test(b.part||"")?"#d32f2f":/fence|wall/.test(b.part||"")?"#555":/rear/.test(b.part||"")?"#8d6e63":"#333";
      s+=`<polygon points="${b.c.map(p=>X(p[0])+","+Z(p[1])).join(" ")}" fill="${col}" fill-opacity="0.75" stroke="#000" stroke-width="0.4"/>`; });
    s+=`<circle cx="${X(D.cc[0])}" cy="${Z(D.cc[1])}" r="4" fill="none" stroke="#000"/>`;
    if(D.bearing!=null){ const ray=(deg,len,col,w)=>{ const a=deg*Math.PI/180, dx=D.east[0]*Math.sin(a)+D.north[0]*Math.cos(a), dz=D.east[1]*Math.sin(a)+D.north[1]*Math.cos(a);
        const ch=D.buildings.filter(b=>b.part==="church nave")[0], c=ch?[(ch.c[0][0]+ch.c[2][0])/2,(ch.c[0][1]+ch.c[2][1])/2]:D.cc;
        return `<line x1="${X(c[0])}" y1="${Z(c[1])}" x2="${X(c[0]+dx*len)}" y2="${Z(c[1]+dz*len)}" stroke="${col}" stroke-width="${w}" stroke-dasharray="4 3"/>`; };
      s+=ray(D.bearing,9,"#d32f2f",1.6)+ray(D.bearing-D.tol,7,"#999",1)+ray(D.bearing+D.tol,7,"#999",1); }
    const n=D.north; s+=`<line x1="580" y1="60" x2="${(580+n[0]*40).toFixed(1)}" y2="${(60+n[1]*40).toFixed(1)}" stroke="#000" stroke-width="2"/><text x="${(584+n[0]*48).toFixed(1)}" y="${(64+n[1]*48).toFixed(1)}">N</text>`;
    s+=`<line x1="20" y1="620" x2="${(20+S*1000/63.19).toFixed(1)}" y2="620" stroke="#000" stroke-width="2"/><text x="20" y="636">1 km (true; buildings at the building scale)</text>`;
    s+=`</g><text x="20" y="670">${name} (${TAG}): place light, drawn village class tan, ice blue; roads ochre, streams blue (dark: drawn half-width; pale: with the planner's clearance); trees green</text></svg>`;
    fs.writeFileSync(path.join(OUT,TAG+"-"+name+".svg"),s);
  }
  fs.writeFileSync(path.join(OUT,TAG+"-plans.json"),JSON.stringify(Object.fromEntries(Object.entries(data).map(([k,d])=>[k,{cc:d.cc,R:d.R,segs:d.segs,buildings:d.buildings,bearing:d.bearing,tol:d.tol}]))));
  console.log("wrote",Object.keys(data).map(k=>path.join(OUT,TAG+"-"+k+".svg")).join("\n"));
})().catch(e=>{ console.error(e); process.exit(1); });
