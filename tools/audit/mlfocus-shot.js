#!/usr/bin/env node
/* Final audit (docs/FINAL_AUDIT.md, dimension 6): the focused, dropped place name "Telnitz" at the Overview, 04:00, 1600 x 900: its computed
   opacity, display and transform, the element on top at the layer's origin, and a screenshot of that corner
   (docs/audit-evidence/mlfocus-telnitz.png). Measurement only; never beside `npm run check:visual`. node tools/audit/mlfocus-shot.js */
const L=require("../stage7/lib.js"), fs=require("fs");
(async()=>{ const b=await L.launch(), p=await L.open(b,[1600,900]); await p.keyboard.press("Escape"); await L.settle(p);
 await p.focus("#maplayer"); for(let i=0;i<40;i++){ await p.keyboard.press("Tab"); await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(3));
  const n=await p.evaluate(()=>document.activeElement&&document.activeElement.getAttribute("aria-label")); if(n==="Place: Telnitz") break; }
 const st=await p.evaluate(()=>{ const a=document.activeElement, cs=getComputedStyle(a); return {name:a.getAttribute("aria-label"),op:cs.opacity,vis:cs.visibility,disp:cs.display,transform:cs.transform,z:getComputedStyle(document.querySelector(".rail")).zIndex,mlz:getComputedStyle(document.getElementById("maplayer")).zIndex,top:document.elementFromPoint(20,8)&&document.elementFromPoint(20,8).className}; });
 console.log(JSON.stringify(st)); fs.writeFileSync(require("path").join(L.ROOT,"docs","audit-evidence","mlfocus-telnitz.png"),await p.screenshot({clip:{x:0,y:0,width:420,height:140}})); await b.close(); })();
