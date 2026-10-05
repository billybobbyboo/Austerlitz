#!/usr/bin/env node
/* Stage 6 Part A (docs/STAGE6_SPEC.md section 1): what is drawn for every formation today, read from the running page (the scene the
   visitor sees), not from the documents. It changes no source file and bundles nothing.
   node tools/stage6/census.js [--json f] [--md f]      (AUSTERLITZ_HTML measures another build)

   1. The figure kit (figKit): every part of each of its five merged geometries (infantry coat and fixed parts, horse, rider coat and
      fixed parts), its size in world units and its colour as drawn (the vertex colour, decoded back to sRGB), or "instance" where the
      part takes the formation's coat colour.
   2. Per formation (all 41; the 32 leaves are drawn as blocks, the aggregates only as counters and names): nation, arm, echelon, its
      strength and guns; what its block holds (every instanced mesh, its kind and count, its material or instance colours); the coat
      colour as drawn (each instance's colour, its mean and spread, and the share in a second nation's colour, f.mix); the headgear,
      legwear and horse as drawn; the standards (how many, the pole, the cloth's size, and the flag texture's colours by area); the
      counter's colours (fill, edge, ink, tag, side band), the landscape name's side mark and the dossier's bar.
   3. The flag textures (flagTexture), sampled: each nation's colours by area and where they lie. */
const fs=require("fs"), path=require("path");
const {launch,open,settle}=require("../stage2/page.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const ROOT=path.resolve(__dirname,"..","..");
const OUTJ=opt("--json")||path.join(ROOT,"docs","stage6-evidence","census.json");
const OUTM=opt("--md")||path.join(ROOT,"docs","stage6-evidence","census.md");

/* in the page */
const CENSUS=function(){
  function hexLin(r,g,b){ var c=new THREE.Color(r,g,b); c.convertLinearToSRGB(); return "#"+c.getHexString().toUpperCase(); }
  function hexOfColor(c){ return hexLin(c.r,c.g,c.b); }
  var K=figKit(), kinds=[["infCoat",K.infCoat],["infFixed",K.infFixed],["horse",K.horse],["rider",K.rider],["riderFixed",K.riderFixed]];
  var kindOf=new Map(kinds.map(function(k){ return [k[1],k[0]]; }));
  Object.keys(GEO).forEach(function(k){ if(GEO[k]&&!kindOf.has(GEO[k])) kindOf.set(GEO[k],"GEO."+k); });
  /* 1. the kit: parts are runs of 36 vertices (a box, non-indexed) or more (the head, the hat); group by colour and connected y-range */
  var kit={};
  kinds.forEach(function(k){ var g=k[1], P=g.attributes.position.array, C=g.attributes.color.array, m={};
    for(var i=0;i<P.length;i+=3){ var h=(C[i]===1&&C[i+1]===1&&C[i+2]===1)?"instance":hexLin(C[i],C[i+1],C[i+2]);
      var e=m[h]||(m[h]={verts:0,x0:1e9,x1:-1e9,y0:1e9,y1:-1e9,z0:1e9,z1:-1e9}); e.verts++;
      e.x0=Math.min(e.x0,P[i]); e.x1=Math.max(e.x1,P[i]); e.y0=Math.min(e.y0,P[i+1]); e.y1=Math.max(e.y1,P[i+1]); e.z0=Math.min(e.z0,P[i+2]); e.z1=Math.max(e.z1,P[i+2]); }
    Object.keys(m).forEach(function(h){ var e=m[h]; ["x0","x1","y0","y1","z0","z1"].forEach(function(q){ e[q]=+e[q].toFixed(3); }); });
    g.computeBoundingBox(); kit[k[0]]={verts:P.length/3,top:+g.boundingBox.max.y.toFixed(3),colours:m}; });
  var figTop={foot:+figureTop(false).toFixed(3),mounted:+figureTop(true).toFixed(3)};
  /* 3. the flag textures, sampled on a 32 x 16 grid */
  function flagColours(tex){ if(!tex||!tex.image||!tex.image.getContext) return null;
    var cv=tex.image, x=cv.getContext("2d"), d=x.getImageData(0,0,cv.width,cv.height).data, m={}, n=0;
    for(var y=2;y<cv.height;y+=4) for(var xx=2;xx<cv.width;xx+=4){ var o=(y*cv.width+xx)*4, h="#"+[d[o],d[o+1],d[o+2]].map(function(v){ return ("0"+v.toString(16)).slice(-2); }).join("").toUpperCase();
      var e=m[h]||(m[h]={share:0,cols:[1e9,-1e9],rows:[1e9,-1e9]}); e.share++; n++; e.cols[0]=Math.min(e.cols[0],xx); e.cols[1]=Math.max(e.cols[1],xx); e.rows[0]=Math.min(e.rows[0],y); e.rows[1]=Math.max(e.rows[1],y); }
    Object.keys(m).forEach(function(h){ m[h].share=+(m[h].share/n).toFixed(3); if(m[h].share<0.01) delete m[h]; });
    return {w:cv.width,h:cv.height,colours:m}; }
  var flags={}; ["fr","ru","at"].forEach(function(n){ flags[n]=flagColours(flagTexture(n)); });
  /* 2. per formation */
  var rows=[];
  Object.keys(FORMATIONS).forEach(function(id){ var f=FORMATIONS[id], r=units[id], N=NATION[f.nation], S=TOKENS.sym.side[sideOfNation(f.nation)];
    var row={id:id,name:f.name,desig:f.desig||"",ech:f.ech,nation:f.nation,arm:f.arm,leaf:!!f.track,parent:f.parent||null,strength:f.strength||null,guns:f.guns||null,
      battery:f.battery||null,mix:f.mix||null,staff:f.staff||"",
      counter:{fill:N.fill,edge:N.edge,ink:N.ink,tag:N.tag,sideBand:S.base,sideBandPaper:S.deep},nameMark:S.base,dossierBar:N.fill};
    if(r&&r.block){ var b=r.block, u=b.userData, meshes=[];
      b.traverse(function(o){ if(!o.isInstancedMesh) return;
        var k=kindOf.get(o.geometry)||o.geometry.type, alloc=o.instanceMatrix.count, e={kind:k,count:alloc,group:o.parent===u.std?"standards":o.parent===u.skirmish?"skirmishers":o.parent===u.deployed?"deployed":o.parent===u.limbered?"limbered":"body"};
        if(o.material&&o.material.map&&o===u.flags) e.material="flag texture ("+f.nation+")";
        else if(o.material&&o.material.vertexColors) e.material="vertex colours (the kit's parts; white parts take the instance colour)";
        else if(o.material&&o.material.color) e.material=hexOfColor(o.material.color);
        if(o.instanceColor){ var A=o.instanceColor.array, sr=0,sg=0,sb=0, cols={};
          for(var i=0;i<alloc;i++){ sr+=A[i*3]; sg+=A[i*3+1]; sb+=A[i*3+2]; }
          e.instanceMean=hexLin(sr/alloc,sg/alloc,sb/alloc);
          /* the base colour each instance was tinted from: the coat jitter is a scalar (0.86-1.14), so the hue is the ratio of the channels */
          for(var j=0;j<alloc;j++){ var mx=Math.max(A[j*3],A[j*3+1],A[j*3+2])||1, key=[A[j*3]/mx,A[j*3+1]/mx,A[j*3+2]/mx].map(function(v){ return v.toFixed(2); }).join(","); cols[key]=(cols[key]||0)+1; }
          e.instanceHues=Object.keys(cols).length; e.instanceHueShares=Object.keys(cols).map(function(k2){ return [k2,+(cols[k2]/alloc).toFixed(3)]; }); }
        meshes.push(e); });
      row.block={W0:+u.W0.toFixed(2),D0:+u.D0.toFixed(2),mounted:!!u.mounted,stdX:u.stdX.length,stdScale:+(u.stdScale||0).toFixed(4),stdTall:u.stdTall||1,
        poleLen:+(GEO.pole.parameters.height*(u.stdTall||1)*(u.stdScale||0)).toFixed(3),cloth:[+(GEO.flag.parameters.width*(u.stdScale||0)).toFixed(3),+(GEO.flag.parameters.height*(u.stdScale||0)).toFixed(3)],
        meshes:meshes};
      var men=0, riders=0, horses=0, guns=0;
      meshes.forEach(function(e){ if(e.kind==="infCoat") men+=e.count; if(e.kind==="rider") riders+=e.count; if(e.kind==="horse") horses+=e.count; if(e.kind==="GEO.barrel") guns+=e.count; });
      row.block.men=men; row.block.riders=riders; row.block.horses=horses; row.block.barrels=guns;
      var coat=meshes.filter(function(e){ return (e.kind==="infCoat"||e.kind==="rider")&&e.instanceHueShares; });
      row.coat=coat.length?{base:N.fill,mean:coat[0].instanceMean,hues:coat.map(function(e){ return e.instanceHues; }),mixShare:f.mix?f.mix.share:0,mixBase:f.mix?NATION[f.mix.nation].fill:null}:null;
    }
    rows.push(row); });
  return {kit:kit,figTop:figTop,flags:flags,rows:rows,M_PER_WORLD:GEOREF.M_PER_WORLD,STD_RATIO:STD_RATIO,STD_POLE:STD_POLE,
    geo:{pole:GEO.pole.parameters,flag:GEO.flag.parameters,tent:GEO.tent.parameters,barrel:GEO.barrel.parameters,wheel:GEO.wheel.parameters},
    unusedGeo:Object.keys(GEO).filter(function(k){ var used=false; Object.keys(units).forEach(function(id){ var b=units[id].block; if(b) b.traverse(function(o){ if(o.geometry===GEO[k]) used=true; }); }); return !used; }),
    atlasDefined:typeof formationAtlas==="function", legendNation:Array.prototype.map.call(document.querySelectorAll('.legend [data-lg="nation"]'),function(e){ return e.textContent.trim()+" "+getComputedStyle(e.querySelector(".sw")).backgroundColor; }),
    firstRunKey:(document.getElementById("fr-key")||{}).textContent||""};
};

(async()=>{
  const browser=await launch(), page=await open(browser,[1600,900]);
  await page.evaluate(()=>{ setClock(570,{instant:true,force:true,camera:false}); });
  await settle(page);
  const out=await page.evaluate(CENSUS);
  out.html=process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html"; out.when=new Date().toISOString();
  if(page._errors.length) out.pageErrors=page._errors.slice(0,5);
  await browser.close();
  fs.writeFileSync(OUTJ,JSON.stringify(out,null,1));
  /* the markdown */
  const md=["# Stage 6 census: what is drawn for every formation today ("+out.html+")\n",
    "`node tools/stage6/census.js`, read from the running page at 09:30 (the scene, not the documents). World unit = "+out.M_PER_WORLD.toFixed(2)+" m.\n",
    "## The figure kit (`figKit`): every part's colour as drawn\n",
    "\"instance\" is the formation's coat colour (`NATION[f.nation].fill`, each figure jittered 0.86-1.14). Extents in world units.\n",
    "| geometry | colour | vertices | x | y (height) | z |","|---|---|---|---|---|---|"];
  Object.keys(out.kit).forEach(k=>{ const g=out.kit[k]; Object.keys(g.colours).forEach(h=>{ const e=g.colours[h];
    md.push("| "+k+" (top "+g.top+") | "+h+" | "+e.verts+" | "+e.x0+" to "+e.x1+" | "+e.y0+" to "+e.y1+" | "+e.z0+" to "+e.z1+" |"); }); });
  md.push("\nFigure top (`figureTop`): on foot "+out.figTop.foot+" units ("+(out.figTop.foot*out.M_PER_WORLD).toFixed(0)+" m drawn), mounted "+out.figTop.mounted+" units. Standard ratio `STD_RATIO` "+out.STD_RATIO+" (provisional, decisions 26 and 36); pole geometry "+out.STD_POLE+" units before scaling.\n");
  md.push("Shared geometries never drawn (`initBlockGeo`, created and unused): "+out.unusedGeo.join(", ")+". `formationAtlas` defined: "+out.atlasDefined+" (never called).\n");
  md.push("## The flag textures (`flagTexture`), sampled\n","| nation | colour | share of the cloth | columns (of 128) | rows (of 64) |","|---|---|---|---|---|");
  Object.keys(out.flags).forEach(n=>{ const F=out.flags[n]; Object.keys(F.colours).sort((a,b)=>F.colours[b].share-F.colours[a].share).forEach(h=>{ const e=F.colours[h];
    md.push("| "+n+" | "+h+" | "+e.share+" | "+e.cols.join("-")+" | "+e.rows.join("-")+" |"); }); });
  md.push("\n## Per formation\n","Coat: the instance colour's base (the nation's fill) and the share in a second nation's (`f.mix`). Every figure on foot and every rider wears the same black cylinder (the kit's `shako`); every man the same breeches; every horse the same brown. Standards: how many, the cloth in world units.\n",
    "| id | name | ech | nation | arm | drawn | men / riders / horses / barrels | coat as drawn | standards (cloth, units) | counter fill / side band |","|---|---|---|---|---|---|---|---|---|---|");
  out.rows.forEach(r=>{ const B=r.block;
    const drawn=!r.leaf?"counter and name only":(r.arm==="hq"?"headquarters: marquee, 4 tents, 12 mounted escort":r.arm==="art"?"battery: guns, crews (infantry kit), limbers and teams":r.arm==="cav"?"cavalry ranks":r.arm==="mixed"?"infantry ranks with horse behind":"infantry ranks, skirmishers, 2 mounted officers")+(r.battery?", an attached battery":"");
    md.push("| "+r.id+" | "+r.name+" | "+r.ech+" | "+r.nation+" | "+r.arm+" | "+drawn+" | "+(B?B.men+" / "+B.riders+" / "+B.horses+" / "+B.barrels:"-")+" | "+
      (r.coat?r.coat.base+(r.coat.mixShare?" ("+Math.round(100*r.coat.mixShare)+"% "+r.coat.mixBase+")":""):"-")+" | "+(B?B.stdX+" x "+B.cloth.join(" x ")+" ("+r.nation+" flag)":"-")+" | "+r.counter.fill+" / "+r.counter.sideBand+" |"); });
  md.push("\n## Where nationality and side are carried today\n","- Legend nation rows: "+out.legendNation.join("; ")+".","- First-run key: \""+out.firstRunKey.trim()+"\"");
  fs.writeFileSync(OUTM,md.join("\n")+"\n");
  console.log(md.join("\n"));
})().catch(e=>{ console.error(e); process.exit(2); });
