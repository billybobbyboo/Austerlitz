/* Final audit after Stage 8, area "robustness": shared helpers for the runtime probes (measurement only; nothing here changes the application).
   cdp(page)           a CDP session with Performance enabled
   snap(page,s,label)  the heap forced through two garbage collections (HeapProfiler.collectGarbage), then CDP Performance.getMetrics
                       (JSHeapUsedSize, Nodes, JSEventListeners, Documents, LayoutCount, ...) and the page's own counts (__rb.inpage(): three's
                       renderer.info.memory and programs, the dispose listeners on the scene's geometries, textures and materials, DOM nodes,
                       the map layer's items, DEV.frames/skipped, the counted requestAnimationFrame and timer callbacks)
   install(page)       window.__rb: the counters (requestAnimationFrame, setTimeout and setInterval wrapped from now on: what is scheduled and
                       what fires, by callback name and delay), inpage(), settle(), sleep() on the page's own original setTimeout
   The wrappers are installed after boot: they count what the page schedules from then on, which is what an idle page does. */
"use strict";
const fs=require("fs"), path=require("path");
const A=require("../lib.js");
const PICK=["JSHeapUsedSize","JSHeapTotalSize","Nodes","JSEventListeners","Documents","Frames","LayoutCount","RecalcStyleCount","LayoutDuration","RecalcStyleDuration","ScriptDuration","TaskDuration"];
async function cdp(page){ const s=await page.context().newCDPSession(page); await s.send("Performance.enable"); return s; }
async function metrics(s){ const r=await s.send("Performance.getMetrics"); const o={}; r.metrics.forEach(m=>{ if(PICK.includes(m.name)) o[m.name]=m.name.endsWith("Duration")?+m.value.toFixed(3):m.value; });
  /* the typed arrays' backing stores (geometry and texture data) live outside the JS heap: Runtime.getHeapUsage reports them where the browser does */
  try{ const h=await s.send("Runtime.getHeapUsage"); o.heapUsed=h.usedSize; if(h.backingStorageSize!==undefined) o.backingStorage=h.backingStorageSize; if(h.embedderHeapUsedSize!==undefined) o.embedderHeap=h.embedderHeapUsedSize; }catch(e){ o.heapUsageError=String(e.message||e).slice(0,80); }
  return o; }
async function gc(s){ await s.send("HeapProfiler.collectGarbage"); await new Promise(r=>setTimeout(r,250)); await s.send("HeapProfiler.collectGarbage"); await new Promise(r=>setTimeout(r,250)); }
async function install(page){
  await page.evaluate(()=>{
    if(window.__rb) return;
    const T0=window.setTimeout.bind(window), I0=window.setInterval.bind(window), R0=window.requestAnimationFrame.bind(window);
    const C={raf:0,rafCb:0,to:0,toCb:0,iv:0,ivCb:0,toBy:{},ivBy:{}};
    window.requestAnimationFrame=function(cb){ C.raf++; return R0(function(t){ C.rafCb++; return cb(t); }); };
    window.setTimeout=function(cb,ms){ const a=[].slice.call(arguments,2); C.to++; const k=((cb&&cb.name)||"anon")+"@"+(ms|0);
      return T0(function(){ C.toCb++; C.toBy[k]=(C.toBy[k]||0)+1; if(typeof cb==="function") return cb.apply(this,a); },ms); };
    window.setInterval=function(cb,ms){ const a=[].slice.call(arguments,2); C.iv++; const k=((cb&&cb.name)||"anon")+"@"+(ms|0);
      return I0(function(){ C.ivCb++; C.ivBy[k]=(C.ivBy[k]||0)+1; if(typeof cb==="function") return cb.apply(this,a); },ms); };
    const sleep=ms=>new Promise(z=>T0(z,ms));
    function inpage(){
      const info=renderer.info, M=info.memory, geos=new Set(), texs=new Set(), mats=new Set();
      scene.traverse(o=>{ if(o.geometry) geos.add(o.geometry);
        const ms=Array.isArray(o.material)?o.material:(o.material?[o.material]:[]);
        if(o.customDepthMaterial) ms.push(o.customDepthMaterial); if(o.customDistanceMaterial) ms.push(o.customDistanceMaterial);
        ms.forEach(mt=>{ if(!mt) return; mats.add(mt); for(const k in mt){ const v=mt[k]; if(v&&v.isTexture) texs.add(v); }
          if(mt.uniforms) for(const k in mt.uniforms){ const v=mt.uniforms[k]&&mt.uniforms[k].value; if(v&&v.isTexture) texs.add(v); } }); });
      const L=x=>(x._listeners&&x._listeners.dispose)?x._listeners.dispose.length:0;
      const agg=set=>{ let s=0,mx=0; set.forEach(x=>{ const n=L(x); s+=n; if(n>mx) mx=n; }); return {n:set.size,listeners:s,max:mx}; };
      return {geometries:M.geometries, textures:M.textures, programs:info.programs?info.programs.length:null, calls:info.render.calls, triangles:info.render.triangles,
        frames:DEV.frames, skipped:DEV.skipped, devState:DEV.state, lost:GL.lost, built:typeof ANIM!=="undefined"?ANIM.built:null, depth:typeof ANIM!=="undefined"?ANIM.depth:null,
        geo:agg(geos), tex:agg(texs), mat:agg(mats), dom:document.getElementsByTagName("*").length, mlItems:typeof ML!=="undefined"?Object.keys(ML.items).length:null,
        clock:clock, playing:playing, presentation:presentation, mode:mode, factor:DISPLAY.factor, speed:speed, fx:FX.on,
        heap:performance.memory?performance.memory.usedJSHeapSize:null, counts:JSON.parse(JSON.stringify(C))};
    }
    /* the page settled: the loop's own state not "active" for hold ms (ambient frames allowed when ambient is true), at most cap ms */
    async function settle(hold,cap,ambient){ hold=hold||500; cap=cap||120000; const t0=performance.now(); let s=0;
      while(performance.now()-t0<cap){ await sleep(100); const st=frameState(performance.now()), ok=ambient?st!=="active":(st==="idle"&&DEV.state==="idle");
        if(ok){ if(!s) s=performance.now(); else if(performance.now()-s>=hold) return Math.round(performance.now()-t0); } else s=0; }
      return -1; }
    window.__rb={C,inpage,settle,sleep,T0};
  });
}
async function snap(page,s,label,o){
  o=o||{};
  if(o.gc!==false) await gc(s);
  const m=await metrics(s), p=await page.evaluate(()=>window.__rb.inpage());
  const r={label,t:new Date().toISOString(),cdp:m,page:p,log:(page._log||[]).length};
  return r;
}
function writer(file){ return obj=>{ fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,JSON.stringify(obj,null,1)); }; }
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
module.exports={A,cdp,metrics,gc,install,snap,writer,sleep,PICK};
