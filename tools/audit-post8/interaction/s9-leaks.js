#!/usr/bin/env node
/* Scenario 9: listeners, timers and objects before and after repeated cycles, two rounds of each (a second identical round must add nothing):
   10 open/close cycles of the dossier, the sources sheet, the "?" overlay, the Layers panel and the legend; 10 presentation switches; 3 runs of
   the guided tour; 3 runs of the opening. The page is instrumented before its scripts run (ilib.js INSTR: addEventListener/removeEventListener,
   timeouts, intervals, animation frames, observers). A visitor's page at 1280 x 720; real clicks and keys; frames by the frame driver. */
"use strict";
const {run,H,I}=require("./irun.js");
const MEM=()=>({geometries:renderer.info.memory.geometries, textures:renderer.info.memory.textures, programs:(renderer.info.programs||[]).length, dom:document.getElementsByTagName("*").length,
  mlItems:Object.keys(ML.items).length, mlNodes:ML.root.querySelectorAll(".ml-item").length, scene:scene.children.length, overlayRoot:overlayRoot.children.length, drawerLen:document.getElementById("drawer-body").innerHTML.length});
run("s9-leaks",{viewport:[1280,720],page:"visitor"},async c=>{
  const p=await c.page("desk",[1280,720],{});
  const rec={};
  const measure=async label=>{ await H.until(p,"!tween",400); await H.frames(p,20); await p.waitForTimeout(4000);   /* the toast's 3.4 s and the drawer's 360 ms timers run out */
    const k=await I.counts(p), m=await H.ev(p,MEM); rec[label]={live:k.live,timeouts:k.timeouts,timeoutsBy:k.timeoutsBy,intervals:k.intervals,rafs:k.rafs,rafsBy:k.rafsBy,observers:k.observers,onDetached:k.onDetached,byTarget:k.byTarget,mem:m};
    I.log("measure",label,"live",k.live,"timeouts",k.timeouts,"rafs",k.rafs,"intervals",k.intervals,"obs",k.observers,"mem",JSON.stringify(m)); return rec[label]; };
  await c.step(p,"Esc closes the first-run card",H.esc,{snap:false});
  await measure("base");
  const name=async q=>H.ev(q,()=>{ const k=Object.keys(ML.items).find(k=>k.startsWith("n:")&&ML.items[k].on&&ML.items[k].rect&&ML.items[k].pick); if(!k) return null; const it=ML.items[k]; return {k,x:(it.rect[0]+it.rect[2])/2,y:(it.rect[1]+it.rect[3])/2}; });
  const blocks={
    dossier:async q=>{ for(let i=0;i<10;i++){ const n=await name(q); if(!n) throw new Error("no name to click"); await q.mouse.click(n.x,n.y); await H.frames(q,2); await H.click(q,"#drawer-close"); await H.frames(q,2); } },
    sources:async q=>{ for(let i=0;i<10;i++){ await H.click(q,"#srcbtn"); await H.frames(q,1); await H.click(q,"#modal-close"); await H.frames(q,1); } },
    help:async q=>{ for(let i=0;i<10;i++){ await H.click(q,"#helpbtn"); await H.frames(q,1); await H.esc(q); await H.frames(q,1); } },
    layers:async q=>{ for(let i=0;i<10;i++){ await H.click(q,"#layersbtn"); await H.frames(q,1); await H.click(q,"#layerclose"); await H.frames(q,1); } },
    legend:async q=>{ for(let i=0;i<10;i++){ await H.click(q,"#lg-toggle"); await H.frames(q,2); await H.click(q,"#lg-toggle"); await H.frames(q,2); } },
    presentation:async q=>{ const K=["2","3","1","2","1","3","1","2","3","1"]; for(const k of K){ await H.key(q,k); await H.frames(q,2); } },
    tour:async q=>{ for(let r=0;r<3;r++){ await H.click(q,"#tourbtn"); await H.frames(q,10); let n=0; while(await H.ev(q,()=>tourStep>=0)&&n++<20){ await H.click(q,"#tour-next"); await H.frames(q,10); } } },
    opening:async q=>{ for(let r=0;r<3;r++){ await H.click(q,"#openingbtn"); await H.frames(q,10); let n=0; while(await H.ev(q,()=>OPENING.on)&&n++<12){ await H.click(q,"#tour-next"); await H.frames(q,10); } } }
  };
  for(const round of [1,2]){
    for(const b of Object.keys(blocks)){
      await c.step(p,"round "+round+": "+b+" cycles",blocks[b],{snap:false});
      await measure(round+":"+b);
    }
  }
  c.out.rec=rec;
  /* growth: round 2's block against round 1's same block */
  const growth=Object.keys(blocks).map(b=>{ const a=rec["1:"+b], z=rec["2:"+b]; return {block:b, live:z.live-a.live, timeouts:z.timeouts-a.timeouts, rafs:z.rafs-a.rafs, intervals:z.intervals-a.intervals, observers:z.observers-a.observers,
    geometries:z.mem.geometries-a.mem.geometries, textures:z.mem.textures-a.mem.textures, dom:z.mem.dom-a.mem.dom, mlItems:z.mem.mlItems-a.mem.mlItems, scene:z.mem.scene-a.mem.scene, overlayRoot:z.mem.overlayRoot-a.mem.overlayRoot}; });
  c.out.growth=growth;
  /* the listener keys that grew between the two rounds */
  const kd={}; const A=rec["1:opening"].byTarget, Z=rec["2:opening"].byTarget; new Set([...Object.keys(A),...Object.keys(Z)]).forEach(k=>{ const d=(Z[k]||0)-(A[k]||0); if(d) kd[k]=d; });
  c.out.listenerKeysGrown=kd;
  const bad=growth.filter(g=>g.live>0||g.timeouts>0||g.rafs>1||g.intervals>0||g.observers>0||g.geometries>0||g.textures>0||g.scene>0||g.overlayRoot>0);
  c.check("no-growth",bad.length===0,"a second identical round of every cycle adds no listener, timer, frame request, observer, GPU object or scene node",{growing:bad,base:{live:rec.base.live,timeouts:rec.base.timeouts,rafs:rec.base.rafs,mem:rec.base.mem},end:{live:rec["2:opening"].live,timeouts:rec["2:opening"].timeouts,rafs:rec["2:opening"].rafs,mem:rec["2:opening"].mem}});
  const t0=rec.base, t1=rec["2:opening"];
  c.check("timers-settle",t1.timeouts===0&&t1.intervals===0,"after the cycles, once the toast's and the drawer's timers have run out, no timeout or interval is pending",{timeouts:t1.timeouts,timeoutsBy:t1.timeoutsBy,intervals:t1.intervals});
});
