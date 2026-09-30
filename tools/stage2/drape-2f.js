#!/usr/bin/env node
/* Stage 2F: roads and streams against the drawn ground, for one build, at 1x, 4x, 10.33x and on the flat paper map.
   node tools/stage2/drape-2f.js <build.html> [--json out.json]
   For every road and stream ribbon: each vertex's height above groundY (the ground mesh) less its intended lift (before 2F
   the lift is the vertex's seat offset, seatOff; since 2F userData.drape.lift), and the midpoint of every edge of every
   ribbon triangle: how far it lies below the drawn ground (a chord cutting through the 81 m triangles), and how many do. */
const fs=require("fs"), path=require("path"), P=require("./page.js");
const argv=process.argv.slice(2), HTML=path.resolve(argv[0]), jo=argv.indexOf("--json");
(async()=>{
  const b=await P.launch(), page=await P.open(b,[1600,900],HTML), res={build:path.basename(HTML)};
  for(const st of ["1","4","model","paper"]){
    res[st]=await page.evaluate(st=>{
      setMode(st==="paper"?"staff":"terrain"); if(st!=="paper") setDisplayFactor(st==="model"?GEOREF.EXAG:+st);
      let vw=0, n=0, mids=0, under=0, deep=0; const A=new THREE.Vector3(), B=new THREE.Vector3();
      world.roads.concat(world.water).forEach(o=>{ const G=o.geometry, Pp=G.attributes.position; if(!G.index) return;
        const lift=o.userData.drape?o.userData.drape.lift:null, off=o.userData.seatOff; if(lift===null&&!off) return;   /* the meres: flat discs, not ribbons */
        for(let i=0;i<Pp.count;i++){ const L=lift!==null?lift:off[i]; vw=Math.max(vw,Math.abs(Pp.getY(i)-groundY(Pp.getX(i),Pp.getZ(i))-L)); n++; }
        const I=G.index.array; for(let t=0;t<I.length;t+=3) for(let e=0;e<3;e++){ const a=I[t+e], c=I[t+(e+1)%3];
          A.fromBufferAttribute(Pp,a); B.fromBufferAttribute(Pp,c); const x=(A.x+B.x)/2, z=(A.z+B.z)/2, y=(A.y+B.y)/2, g=groundY(x,z); mids++;
          if(y<g){ under++; deep=Math.max(deep,g-y); } } });
      setMode("terrain"); setDisplayFactor(DISPLAY.defaultFactor);
      return {vertices:n, worstVertex:+vw.toFixed(4), edgeMidpoints:mids, underGround:under, deepestUnder:+deep.toFixed(3)}; },st);
    console.log(st.padEnd(6),JSON.stringify(res[st]));
  }
  if(jo>=0) fs.writeFileSync(argv[jo+1],JSON.stringify(res,null,1));
  await b.close();
})().catch(e=>{ console.error(e); process.exit(2); });
