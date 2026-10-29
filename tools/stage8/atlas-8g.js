#!/usr/bin/env node
/* Stage 8, implementation PR 8G's prerequisite 1 (docs/STAGE8_SPEC.md section 19.1): the ground's atlas, measured on a build (8F's or 8G's):
   1. the normals' conventions: each photograph's normal map (ASSETS, decoded) and each cell of the procedural normal atlas painted afresh, its
      red read as the slope's part to the image's right and its green taken as the part toward the image's foot ("down") or toward its top
      ("up"): a normal map made from a height field is a gradient field (its curl small) only one way;
   2. each shader cell's mean tone as the build samples it (GDETAIL.lum, by the shader's own cell index) and the canvas's cell k's own mean, so
      that 8F's mapping (cell k drawn from the canvas's cell (k mod 4, 2 - floor(k/4))) and the corrected one can be compared;
   3. what the ground's sampling formula reads for each cell k, through the GPU (tuv's formula, the texture as the build uploads it), against the
      canvas's cell k and the canvas's cell (k mod 4, 2 - floor(k/4)), each the right way up and flipped in v: the correlation of their greys,
      the sample placed as the shader places it (row q from the target's foot is fract(vUv.y) = (q + 0.5) / N), so the table means the same on
      either build; and a contact sheet, each row a cell: the sample, the canvas's cell k, the canvas's other-row cell.
   node tools/stage8/atlas-8g.js [--out dir] [--tag name]     (the build: AUSTERLITZ_HTML, else the repository's)
   Writes <out>/atlas-<tag>.json and <out>/atlas-<tag>.jpg; measurement code only. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=path.resolve(opt("--out")||path.join(L.EVID8,"8g")), HTML=path.resolve(process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html")), TAG=opt("--tag")||"8g";
const MEAS=async function(){
  closeFirst(null); setMode("terrain");
  var out={flipY:{colour:_atlas.flipY, normal:_nrmAtlas.flipY}, photo:typeof ATLAS_PHOTO!=="undefined"?ATLAS_PHOTO:null, curl:{}, lum:GDETAIL.lum.slice(), cells:[]};
  /* 1. the conventions */
  function dec(src){ return new Promise(function(res){ var im=new Image(); im.onload=function(){ var c=document.createElement("canvas"); c.width=im.width; c.height=im.height; var x=c.getContext("2d"); x.drawImage(im,0,0); res({w:im.width,h:im.height,d:x.getImageData(0,0,im.width,im.height).data}); }; im.src=src; }); }
  function curl(img){ var w=img.w, h=img.h, d=img.d, sD=0, sU=0, sE=0, n=0;
    for(var y=1;y<h-1;y+=2) for(var x=1;x<w-1;x+=2){ var P=function(i){ return d[i]-128; }, Q=function(i){ return d[i+1]-128; };
      var dPdy=(P(((y+1)*w+x)*4)-P(((y-1)*w+x)*4))/2, dQdx=(Q((y*w+x+1)*4)-Q((y*w+x-1)*4))/2;
      sD+=(dQdx-dPdy)*(dQdx-dPdy); sU+=(-dQdx-dPdy)*(-dQdx-dPdy); sE+=dPdy*dPdy+dQdx*dQdx; n++; }
    return {down:+(sD/n).toFixed(3), up:+(sU/n).toFixed(3), energy:+(sE/n).toFixed(3)}; }
  for(var k0 of ["grass","mud","litter"]) out.curl["photograph "+k0]=curl(await dec(ASSETS[k0].nor));
  var img;
  if(typeof paintNormalCells==="function"){ var c=document.createElement("canvas"); c.width=2048; c.height=1536; img=c.getContext("2d").createImageData(2048,1536); paintNormalCells(img.data,2048); }
  else { var keepN=_nrmAtlas; _nrmAtlas=null; var fresh=coverNormalAtlas(); _nrmAtlas=keepN;   /* a build before 8G: its painter made afresh, read once through a copy */
    var c2=document.createElement("canvas"); c2.width=2048; c2.height=1536; var x2=c2.getContext("2d"); x2.drawImage(fresh.image,0,0); img=x2.getImageData(0,0,2048,1536); fresh.dispose(); }
  for(var k1=0;k1<12;k1++){ var R=512, cx=(k1%4)*R+16, cy=Math.floor(k1/4)*R+16, sub=new Uint8ClampedArray(480*480*4);
    for(var j=0;j<480;j++) sub.set(img.data.subarray(((cy+j)*2048+cx)*4,((cy+j)*2048+cx+480)*4),j*480*4);
    out.curl["pattern cell "+k1]=curl({w:480,h:480,d:sub}); }
  /* 2. the canvas's own cells' means (linear, as atlasLum takes them), by canvas cell */
  var LC=(function(){ var cc=document.createElement("canvas"); cc.width=_atlasCanvas.width; cc.height=_atlasCanvas.height; var xx=cc.getContext("2d"); xx.drawImage(_atlasCanvas,0,0); return xx.getImageData(0,0,cc.width,cc.height).data; })();
  out.canvasLum=[]; for(var k2=0;k2<12;k2++){ var s=0, n=0, cx2=(k2%4)*512, cy2=Math.floor(k2/4)*512; for(var j2=16;j2<496;j2+=4) for(var i2=16;i2<496;i2+=4){ var o=((cy2+j2)*2048+cx2+i2)*4; s+=(0.2126*LC[o]+0.7152*LC[o+1]+0.0722*LC[o+2])/255; n++; } out.canvasLum.push(+(s/n).toFixed(4)); }
  /* 3. the sampling formula through the GPU */
  var N=128, map=groundMesh.material.map, rt=new THREE.WebGLRenderTarget(N,N), b=new Uint8Array(N*N*4), sc=new THREE.Scene(), cam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  var mat=new THREE.ShaderMaterial({uniforms:{map:{value:map}, ci:{value:0}, cj:{value:0}}, depthTest:false, depthWrite:false,
    vertexShader:"varying vec2 vU; void main(){ vU=uv; gl_Position=vec4(position.xy,0.0,1.0); }",
    fragmentShader:"uniform sampler2D map; uniform float ci, cj; varying vec2 vU; void main(){ gl_FragColor=texture2D(map,vec2(fract(vU.x)*0.234375+0.0078125+ci*0.25, fract(vU.y)*0.3125+0.0104167+cj*0.3333333)); }"});
  sc.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),mat));
  /* the canvas's cell (ci, cy) at N x N: row r is the pattern's v = (r + 0.5) / N (its rows from the top) */
  function cell(ci,cy,flip){ var g=new Float64Array(N*N); for(var r=0;r<N;r++) for(var q=0;q<N;q++){ var v=(r+0.5)/N; if(flip) v=1-v; var X=Math.min(2047,Math.floor(ci*512+16+480*(q+0.5)/N)), Y=Math.min(1535,Math.floor(cy*512+16+480*v)), o=(Y*2048+X)*4; g[r*N+q]=0.2126*LC[o]+0.7152*LC[o+1]+0.0722*LC[o+2]; } return g; }
  function corr(a,bb){ var n=a.length, ma=0, mb=0; for(var i=0;i<n;i++){ ma+=a[i]; mb+=bb[i]; } ma/=n; mb/=n; var sab=0, saa=0, sbb=0;
    for(var j=0;j<n;j++){ var p=a[j]-ma, q=bb[j]-mb; sab+=p*q; saa+=p*p; sbb+=q*q; } return +(sab/Math.sqrt(saa*sbb||1)).toFixed(3); }
  var sheet=document.createElement("canvas"); sheet.width=3*N+40; sheet.height=12*(N+8); var sx=sheet.getContext("2d"); sx.fillStyle="#222"; sx.fillRect(0,0,sheet.width,sheet.height);
  function put(g,X,Y){ var im=sx.createImageData(N,N); for(var i=0;i<N*N;i++){ im.data[i*4]=im.data[i*4+1]=im.data[i*4+2]=g[i]; im.data[i*4+3]=255; } sx.putImageData(im,X,Y); }
  for(var k=0;k<12;k++){ mat.uniforms.ci.value=k%4; mat.uniforms.cj.value=Math.floor(k/4);
    renderer.setRenderTarget(rt); renderer.clear(); renderer.render(sc,cam); renderer.readRenderTargetPixels(rt,0,0,N,N,b); renderer.setRenderTarget(null);
    /* the target's row q from its foot is fract(vU.y) = (q + 0.5) / N: placed at row q, as the pattern's v */
    var s3=new Float64Array(N*N); for(var q2=0;q2<N;q2++) for(var p2=0;p2<N;p2++){ var o2=(q2*N+p2)*4; s3[q2*N+p2]=0.2126*b[o2]+0.7152*b[o2+1]+0.0722*b[o2+2]; }
    var other=k%4+4*(2-Math.floor(k/4));
    out.cells.push({k:k, own:corr(s3,cell(k%4,Math.floor(k/4),false)), ownFlipped:corr(s3,cell(k%4,Math.floor(k/4),true)), otherRow:corr(s3,cell(k%4,2-Math.floor(k/4),false)), otherRowFlipped:corr(s3,cell(k%4,2-Math.floor(k/4),true)), canvasCell:k, otherCell:other});
    put(s3,0,k*(N+8)); put(cell(k%4,Math.floor(k/4),false),N+20,k*(N+8)); put(cell(k%4,2-Math.floor(k/4),false),2*N+40,k*(N+8)); }
  rt.dispose(); mat.dispose(); out.sheet=sheet.toDataURL("image/jpeg",0.9); return out; };
(async()=>{
  const browser=await L.launch(); process.env.AUSTERLITZ_HTML=HTML; const page=await L.open(browser,[1366,768],{}); await page.waitForTimeout(3000);
  const r=await page.evaluate(MEAS); await page.close(); r.chromium=browser.version(); await browser.close();
  fs.mkdirSync(OUT,{recursive:true}); fs.writeFileSync(path.join(OUT,"atlas-"+TAG+".jpg"),Buffer.from(r.sheet.split(",")[1],"base64")); delete r.sheet;
  r.build=path.basename(HTML); r.md5=crypto.createHash("md5").update(fs.readFileSync(HTML)).digest("hex");
  fs.writeFileSync(path.join(OUT,"atlas-"+TAG+".json"),JSON.stringify(r,null,1));
  console.log("flipY "+JSON.stringify(r.flipY)+", photographs painted "+JSON.stringify(r.photo));
  Object.entries(r.curl).forEach(([k,v])=>console.log("curl "+k.padEnd(20)+" green down "+String(v.down).padEnd(9)+" up "+String(v.up).padEnd(9)+" (energy "+v.energy+")"));
  r.cells.forEach(c=>console.log("cell "+String(c.k).padStart(2)+": its sample against the canvas's cell k "+c.own+" (flipped "+c.ownFlipped+"), against the other row's cell "+c.otherCell+" "+c.otherRow+" (flipped "+c.otherRowFlipped+"); its mean "+r.lum[c.k].toFixed(4)+", the canvas's cell k "+r.canvasLum[c.k]+", the other row's "+r.canvasLum[c.otherCell]));
})().catch(e=>{ console.error(e); process.exit(1); });
