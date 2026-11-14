/* The closing re-verification pass: the audit's tools/audit-post8/robustness/mirror-check.js, adapted only to feed aSl as WP-16 packed it
   (decision 321 (a): a vec3, the two slopes and the instance's phase; aPh gone) and to write into docs/closing-evidence/. As written, the audit's
   probe binds aPh (no longer declared: GL_INVALID_VALUE) and gives aSl two components, so the shader reads the phase as 0. The audit's header:
   Final audit after Stage 8, area "robustness": the gait's two copies, the vertex hook in GLSL (animGLSL, app.js:1849; the string every kit
   material compiles, ANIM.body) and its JavaScript mirror (animAt, app.js:1020; the oracle of the self-test's culling-bounds, envelope and
   contact checks and of runtime-test.js), compared value for value on the GPU (measurement only; nothing is changed).
   node tools/audit-post8/robustness/mirror-check.js  ->  docs/audit-post8-evidence/robustness/mirror-check.json
   One harness page (1024 x 700). In it, on a WebGL2 context of its own (a fresh canvas: the app's context and state untouched), a program
   made of ANIM.decl (its "attribute" lines as GLSL ES 3.00 "in") and ANIM.body exactly as the kit materials receive them, run by transform
   feedback over points: `transformed` read back for every vertex. Inputs: 400 uniform sets (amp 0, 0.3, 1 and 1.4, beyond the clamp; phase
   0-2 pi; trot, knee -0.2 to 1.2, beyond their clamps; both wheels' angles -1 to 1), 64 vertices each (part drawn from every part in
   ANIM.PART and three parts it does not define, 4, 9 and 15; positions over a figure's box; aPh 0-1; both slopes -3.5 to 3.5, beyond
   ANIM.SLOPE). The oracle: animAt(part, x, y, z, uAnimPhase + 6.2831853 aPh, amp, out, {slope, trot, rollG, rollL, knee}). Reported: the
   largest difference by part, the count over 1e-4 units (a man is about 1.8 units tall), the worst cases. Also ANIM.body === animGLSL(). */
"use strict";
const path=require("path"), fs=require("fs");
const A=require("../audit-post8/lib.js");
const OUT=path.join(__dirname,"..","..","docs","closing-evidence","robustness","mirror-check-adapted.json");
(async()=>{
  const res={what:"animGLSL (GPU, transform feedback) against animAt (JavaScript)",started:new Date().toISOString()};
  const b=await A.launch();
  try{
    const page=await A.open(b,[1024,700]);
    const r=await page.evaluate(()=>{
      const out={bodyIsCurrent:ANIM.body===animGLSL(), parts:Object.keys(ANIM.PART).map(Number)};
      const cv=document.createElement("canvas"); cv.width=cv.height=4; const gl=cv.getContext("webgl2");
      if(!gl){ out.error="no WebGL2 context"; return out; }
      out.renderer=gl.getParameter(gl.RENDERER); out.version=gl.getParameter(gl.VERSION);
      const decl=ANIM.decl.replace(/^attribute /gm,"in ");
      const vs="#version 300 es\nprecision highp float;\nin vec3 position;\n"+decl+"\nout vec3 vOut;\nvoid main(){\n vec3 transformed=vec3(position);\n"+ANIM.body+"\n vOut=transformed; gl_Position=vec4(0.0,0.0,0.0,1.0); gl_PointSize=1.0;\n}";
      const fs="#version 300 es\nprecision highp float;\nout vec4 c;\nvoid main(){ c=vec4(1.0); }";
      const sh=(t,s)=>{ const x=gl.createShader(t); gl.shaderSource(x,s); gl.compileShader(x); if(!gl.getShaderParameter(x,gl.COMPILE_STATUS)) throw new Error("compile: "+gl.getShaderInfoLog(x)); return x; };
      const pr=gl.createProgram(); gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs)); gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));
      gl.transformFeedbackVaryings(pr,["vOut"],gl.SEPARATE_ATTRIBS); gl.linkProgram(pr);
      if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){ out.error="link: "+gl.getProgramInfoLog(pr); return out; }
      gl.useProgram(pr);
      const loc={}; ["position","aPart","aPh","aSl"].forEach(k=>loc[k]=gl.getAttribLocation(pr,k));
      const U={}; ANIM.U.forEach(k=>U[k]=gl.getUniformLocation(pr,k));
      let seed=12345; const rnd=()=>{ seed=(seed*1664525+1013904223)>>>0; return seed/4294967296; };
      const PARTS=out.parts.concat([4,9,15]);
      const N=64, SETS=400, AMPS=[0,0.3,1,1.4];
      const bPos=gl.createBuffer(), bPart=gl.createBuffer(), bPh=gl.createBuffer(), bSl=gl.createBuffer(), bOut=gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER,bOut); gl.bufferData(gl.ARRAY_BUFFER,N*3*4,gl.STREAM_READ); gl.bindBuffer(gl.ARRAY_BUFFER,null);
      const tf=gl.createTransformFeedback(); gl.enable(gl.RASTERIZER_DISCARD);
      const byPart={}, worst=[]; let n=0, over=0, maxAll=0;
      const o3=[0,0,0];
      for(let s=0;s<SETS;s++){
        const u={uAnimAmp:AMPS[s%4], uAnimPhase:rnd()*6.2831853, uAnimTrot:-0.2+1.4*rnd(), uAnimRollG:-1+2*rnd(), uAnimRollL:-1+2*rnd(), uAnimKnee:-0.2+1.4*rnd()};
        const P=new Float32Array(N*3), K=new Float32Array(N), H=new Float32Array(N), S=new Float32Array(N*2);
        for(let i=0;i<N;i++){ K[i]=PARTS[Math.floor(rnd()*PARTS.length)]; P[i*3]=-0.3+0.6*rnd(); P[i*3+1]=1.9*rnd(); P[i*3+2]=-0.6+1.2*rnd(); H[i]=rnd(); S[i*2]=-3.5+7*rnd(); S[i*2+1]=-3.5+7*rnd(); }
        const put=(buf,arr,l,sz)=>{ gl.bindBuffer(gl.ARRAY_BUFFER,buf); gl.bufferData(gl.ARRAY_BUFFER,arr,gl.STREAM_DRAW); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l,sz,gl.FLOAT,false,0,0); };
        const S3=new Float32Array(N*3); for(let i=0;i<N;i++){ S3[i*3]=S[i*2]; S3[i*3+1]=S[i*2+1]; S3[i*3+2]=H[i]; } put(bPos,P,loc.position,3); put(bPart,K,loc.aPart,1); put(bSl,S3,loc.aSl,3);   /* the closing pass: aSl a vec3 since WP-16 (decision 321 (a)): two slopes and the phase */
        Object.keys(u).forEach(k=>gl.uniform1f(U[k],u[k]));
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK,tf); gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER,0,bOut);
        gl.beginTransformFeedback(gl.POINTS); gl.drawArrays(gl.POINTS,0,N); gl.endTransformFeedback();
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER,0,null); gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK,null);
        const R=new Float32Array(N*3); gl.bindBuffer(gl.ARRAY_BUFFER,bOut); gl.getBufferSubData(gl.ARRAY_BUFFER,0,R); gl.bindBuffer(gl.ARRAY_BUFFER,null);
        for(let i=0;i<N;i++){
          const k=K[i]; animAt(k,P[i*3],P[i*3+1],P[i*3+2],u.uAnimPhase+6.2831853*H[i],u.uAnimAmp,o3,{slope:[S[i*2],S[i*2+1]],trot:u.uAnimTrot,rollG:u.uAnimRollG,rollL:u.uAnimRollL,knee:u.uAnimKnee});
          const d=Math.max(Math.abs(R[i*3]-o3[0]),Math.abs(R[i*3+1]-o3[1]),Math.abs(R[i*3+2]-o3[2])), moved=Math.hypot(o3[0]-P[i*3],o3[1]-P[i*3+1],o3[2]-P[i*3+2]);
          const e=byPart[k]||(byPart[k]={n:0,max:0,over:0,movedMax:0}); e.n++; e.max=Math.max(e.max,d); e.movedMax=Math.max(e.movedMax,moved); if(d>1e-4){ e.over++; over++; }
          n++; maxAll=Math.max(maxAll,d);
          if(d>1e-4&&worst.length<12) worst.push({part:k,amp:u.uAnimAmp,uniforms:u,vertex:[P[i*3],P[i*3+1],P[i*3+2]],aPh:H[i],aSl:[S[i*2],S[i*2+1]],gpu:[R[i*3],R[i*3+1],R[i*3+2]],js:o3.slice(),d});
        }
      }
      /* the context's own sin and cos (the hook's only transcendental functions) against Math.sin and Math.cos over 0 to 4 pi: the
         precision floor any GPU-against-JavaScript comparison of the hook meets */
      { const vs2="#version 300 es\nprecision highp float;\nin float x;\nout vec3 vOut;\nvoid main(){ vOut=vec3(sin(x),cos(x),x); gl_Position=vec4(0.0,0.0,0.0,1.0); gl_PointSize=1.0; }";
        const p2=gl.createProgram(); gl.attachShader(p2,sh(gl.VERTEX_SHADER,vs2)); gl.attachShader(p2,sh(gl.FRAGMENT_SHADER,fs)); gl.transformFeedbackVaryings(p2,["vOut"],gl.SEPARATE_ATTRIBS); gl.linkProgram(p2); gl.useProgram(p2);
        const M2=4096, X=new Float32Array(M2); for(let i=0;i<M2;i++) X[i]=12.566371*i/(M2-1);
        Object.values(loc).forEach(l=>{ if(l>=0) gl.disableVertexAttribArray(l); });
        const lx=gl.getAttribLocation(p2,"x"), bx=gl.createBuffer(), bo=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,bx); gl.bufferData(gl.ARRAY_BUFFER,X,gl.STREAM_DRAW); gl.enableVertexAttribArray(lx); gl.vertexAttribPointer(lx,1,gl.FLOAT,false,0,0);
        gl.bindBuffer(gl.ARRAY_BUFFER,bo); gl.bufferData(gl.ARRAY_BUFFER,M2*3*4,gl.STREAM_READ); gl.bindBuffer(gl.ARRAY_BUFFER,null);
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK,tf); gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER,0,bo); gl.beginTransformFeedback(gl.POINTS); gl.drawArrays(gl.POINTS,0,M2); gl.endTransformFeedback();
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER,0,null); gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK,null);
        const R2=new Float32Array(M2*3); gl.bindBuffer(gl.ARRAY_BUFFER,bo); gl.getBufferSubData(gl.ARRAY_BUFFER,0,R2);
        let es=0, ec=0; for(let i=0;i<M2;i++){ es=Math.max(es,Math.abs(R2[i*3]-Math.sin(R2[i*3+2]))); ec=Math.max(ec,Math.abs(R2[i*3+1]-Math.cos(R2[i*3+2]))); }
        out.trigFloor={samples:M2,range:"0 to 4 pi",sinMaxErr:+es.toExponential(3),cosMaxErr:+ec.toExponential(3)}; }
      gl.disable(gl.RASTERIZER_DISCARD);
      Object.keys(byPart).forEach(k=>{ byPart[k].max=+byPart[k].max.toExponential(3); byPart[k].movedMax=+byPart[k].movedMax.toFixed(4); });
      Object.assign(out,{samples:n,over1e4:over,maxDiff:+maxAll.toExponential(3),byPart,worst,glError:gl.getError()});
      return out;
    });
    Object.assign(res,r); res.browser=b.version();
  }catch(e){ res.error=String(e&&e.stack||e); process.exitCode=1; }
  finally{ await b.close(); res.finished=new Date().toISOString(); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); console.log("done",OUT); }
})();
