#!/usr/bin/env node
/* Stage 8, implementation PR 8F (docs/STAGE8_SPEC.md section 18.5 and 18.10): found while building the near detail. The ground's atlas
   (world.js coverAtlas) paints the pattern made for cover cell k (coverPatterns: 0 open field, 1 meadow, 2 marsh, 3 water, 4 wood, 5 village,
   6 vineyard, 7 track, 8 plough, 9 pasture, 10 winter sowing, 11 trodden ground) into the canvas's cell (k mod 4, floor(k/4)), counted from the
   canvas's top, and photoAtlas lays its photographs by the same k; three uploads the canvas flipped (CanvasTexture's flipY, its default), and
   the ground's shader reads cell k at tuv's v from the texture's foot, so for k it samples the canvas's cell (k mod 4, 2 - floor(k/4)). This
   tool shows it: for each k, the cell as the shader's formula samples it through the GPU (its luminance, 128 x 128) beside the canvas's cell k
   and the canvas's cell (k mod 4, 2 - floor(k/4)), each with the correlation of their greys; a contact sheet of the twelve.
   node tools/stage8/atlas-8f.js [--out dir]   (the build: AUSTERLITZ_HTML, else the repository's)
   Writes <out>/atlas-8f.json and <out>/atlas-8f.jpg (rows by k: the shader's sample, the canvas's cell k, the canvas's cell flipped); measurement code
   only. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const OUT=path.resolve(opt("--out")||path.join(L.EVID8,"8f")), HTML=path.resolve(process.env.AUSTERLITZ_HTML||path.join(L.ROOT,"austerlitz-command-map.html"));
const MEAS=function(){
  closeFirst(null); setMode("terrain");
  var N=128, map=groundMesh.material.map, c=_atlasCanvas, x=c.getContext("2d"), rt=new THREE.WebGLRenderTarget(N,N), b=new Uint8Array(N*N*4), sc=new THREE.Scene(), cam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  var mat=new THREE.ShaderMaterial({uniforms:{map:{value:map}, ci:{value:0}, cj:{value:0}}, depthTest:false, depthWrite:false,
    vertexShader:"varying vec2 vU; void main(){ vU=uv; gl_Position=vec4(position.xy,0.0,1.0); }",
    fragmentShader:"uniform sampler2D map; uniform float ci, cj; varying vec2 vU; void main(){ gl_FragColor=texture2D(map,vec2(fract(vU.x)*0.234375+0.0078125+ci*0.25, fract(vU.y)*0.3125+0.0104167+cj*0.3333333)); }"});
  sc.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),mat));
  /* a canvas cell's interior, its rows from the top, at N x N (the canvas drawn into a small one), as greys */
  function canvasCell(ci,cy){ var t=document.createElement("canvas"); t.width=t.height=N; var tx=t.getContext("2d"); tx.drawImage(c,ci*512+16,cy*512+16,480,480,0,0,N,N);
    var d=tx.getImageData(0,0,N,N).data, g=new Float64Array(N*N); for(var i=0;i<N*N;i++) g[i]=0.2126*d[i*4]+0.7152*d[i*4+1]+0.0722*d[i*4+2]; return g; }
  function corr(a,bb){ var n=a.length, ma=0, mb=0; for(var i=0;i<n;i++){ ma+=a[i]; mb+=bb[i]; } ma/=n; mb/=n; var sab=0, saa=0, sbb=0;
    for(var j=0;j<n;j++){ var p=a[j]-ma, q=bb[j]-mb; sab+=p*q; saa+=p*p; sbb+=q*q; } return sab/Math.sqrt(saa*sbb||1); }
  var out={flipY:map.flipY, cells:[], png:null}, sheet=document.createElement("canvas"); sheet.width=3*N+40; sheet.height=12*(N+8); var sx=sheet.getContext("2d"); sx.fillStyle="#222"; sx.fillRect(0,0,sheet.width,sheet.height);
  for(var k=0;k<12;k++){ mat.uniforms.ci.value=k%4; mat.uniforms.cj.value=Math.floor(k/4);
    renderer.setRenderTarget(rt); renderer.clear(); renderer.render(sc,cam); renderer.readRenderTargetPixels(rt,0,0,N,N,b); renderer.setRenderTarget(null);
    /* the target's rows from its foot; as an image from its top: the sampled cell as a viewer of the texture sees it, upright */
    var s=new Float64Array(N*N), img=sx.createImageData(N,N); for(var r=0;r<N;r++) for(var q=0;q<N;q++){ var o=((N-1-r)*N+q)*4, g=0.2126*b[o]+0.7152*b[o+1]+0.0722*b[o+2]; s[r*N+q]=g; var w=(r*N+q)*4; img.data[w]=b[o]; img.data[w+1]=b[o+1]; img.data[w+2]=b[o+2]; img.data[w+3]=255; }
    var own=canvasCell(k%4,Math.floor(k/4)), other=canvasCell(k%4,2-Math.floor(k/4));
    out.cells.push({k:k, withOwn:+corr(s,own).toFixed(3), withFlipped:+corr(s,other).toFixed(3)});
    sx.putImageData(img,0,k*(N+8)); sx.drawImage(c,(k%4)*512+16,Math.floor(k/4)*512+16,480,480,N+20,k*(N+8),N,N); sx.drawImage(c,(k%4)*512+16,(2-Math.floor(k/4))*512+16,480,480,2*N+40,k*(N+8),N,N); }
  rt.dispose(); mat.dispose(); out.sheet=sheet.toDataURL("image/jpeg",0.9); return out; };
(async()=>{
  const browser=await L.launch(); process.env.AUSTERLITZ_HTML=HTML; const page=await L.open(browser,[1366,768],{}); const r=await page.evaluate(MEAS); await page.close(); r.chromium=browser.version(); await browser.close();
  fs.mkdirSync(OUT,{recursive:true}); fs.writeFileSync(path.join(OUT,"atlas-8f.jpg"),Buffer.from(r.sheet.split(",")[1],"base64")); delete r.sheet;
  r.build=path.basename(HTML); r.md5=crypto.createHash("md5").update(fs.readFileSync(HTML)).digest("hex");
  fs.writeFileSync(path.join(OUT,"atlas-8f.json"),JSON.stringify(r,null,1));
  console.log("flipY "+r.flipY); r.cells.forEach(c=>console.log("cell "+String(c.k).padStart(2)+": the shader's sample against the canvas's cell k "+c.withOwn+", against its cell (k mod 4, 2 - floor(k/4)) "+c.withFlipped));
})().catch(e=>{ console.error(e); process.exit(1); });
