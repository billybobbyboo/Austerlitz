/* v-batch-perfattr: the probe runs (probe.js) summarised: per run the per-frame counts, and per adjacent A/B pair the loop, three.render and CPU
   differences (container numbers on stubbed draws, not device numbers). Usage: node summarise.js <probe.json> [...] */
"use strict";
const fs=require("fs"), path=require("path");
for(const f of process.argv.slice(2)){
  const d=JSON.parse(fs.readFileSync(f,"utf8"));
  console.log("== "+path.basename(f)+"  "+d.vp.join("x")+"  setup "+JSON.stringify(d.setup)+"\n   lights "+JSON.stringify(d.install.lights)+" materials seen "+d.install.materialsSeen);
  console.log("run  clock        draws inst(sh/main) kitInst(sh) extraAttr instVAP glVAP  glBind useProg getProgram/frame  loop  three.render cpu");
  d.runs.forEach(r=>{ const p=r.per;
    console.log([r.label.padEnd(4), (r.clock[0].toFixed(1)+"-"+r.clock[1].toFixed(1)).padEnd(12), String(p.draws).padStart(5), (p.inst+"("+p.instShadow+"/"+p.instMain+")").padStart(12),
      (p.kitInst+"("+p.kitInstShadow+")").padStart(11), String(p.extraVAP).padStart(9), String(p.instVAP).padStart(7), String(r.gl.vertexAttribPointer).padStart(7), String(r.gl.bindBuffer).padStart(7),
      String(r.gl.useProgram).padStart(7), String(p.gp).padStart(16), String(r.ms.loop).padStart(5), String(r.ms.threeRender).padStart(12), String(r.cpuMsPerFrame).padStart(7)].join(" ")); });
  const A=d.runs.filter(r=>r.label[0]==="A"), B=d.runs.filter(r=>r.label[0]==="B");
  const pairs=[]; for(let i=0;i<Math.min(A.length,B.length);i++) pairs.push({pair:A[i].label+"-"+B[i].label, loop:+(A[i].ms.loop-B[i].ms.loop).toFixed(1), three:+(A[i].ms.threeRender-B[i].ms.threeRender).toFixed(1), cpu:+(A[i].cpuMsPerFrame-B[i].cpuMsPerFrame).toFixed(2)});
  for(let i=1;i<A.length;i++) pairs.push({pair:B[i-1].label+"-"+A[i].label, loop:+(A[i].ms.loop-B[i-1].ms.loop).toFixed(1), three:+(A[i].ms.threeRender-B[i-1].ms.threeRender).toFixed(1), cpu:+(A[i].cpuMsPerFrame-B[i-1].cpuMsPerFrame).toFixed(2)});
  const med=a=>{ const s=a.slice().sort((x,y)=>x-y); return s[Math.floor(s.length/2)]; };
  console.log("A minus B, adjacent runs: "+pairs.map(p=>p.pair+" loop "+p.loop+" three "+p.three+" cpu "+p.cpu).join("; "));
  console.log("median A-B: loop "+med(pairs.map(p=>p.loop))+" ms, three.render "+med(pairs.map(p=>p.three))+" ms, cpu "+med(pairs.map(p=>p.cpu))+" ms; min loop "+Math.min(...pairs.map(p=>p.loop))+", max "+Math.max(...pairs.map(p=>p.loop)));
}
