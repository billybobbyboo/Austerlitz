/* Audit-only property checks and negative controls. No file in the application is changed. */
'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert'),cp=require('child_process');
const root=process.cwd(),out=__dirname,M=require(path.join(root,'_world_mod.js'));M.buildCover();M.buildGrid();
const c={console,W:M.W,height:M.height,hAt:M.hAt,smoothstep:M.smoothstep,covAt:M.covAt,SATS:M.SATS,MENI:M.MENI,VILLAGES:M.VILLAGES,covWater:M.covWater,covRoad:M.covRoad,covMarsh:M.covMarsh};
vm.createContext(c);for(const f of ['geo.js','data.js','analysis.js','_clock.js','_state.js','_derived.js','_events.js'])vm.runInContext(fs.readFileSync(f,'utf8'),c,{filename:f});
const result=vm.runInContext(`(function(){
 var ids=Object.keys(FORMATIONS).filter(id=>FORMATIONS[id].track),times=[];units={};ids.forEach(id=>units[id]={});
 for(var t=T_MIN;t<=T_MAX;t+=0.25)times.push(t);
 PHASES.forEach(p=>[p.t0-1e-7,p.t0,p.t0+1e-7,p.t1-1e-7,p.t1].forEach(t=>{if(t>=T_MIN&&t<=T_MAX)times.push(t)}));
 var snapshots={},bad=[],positions=0,strengthChecks=0,inverseMax=0;
 times.forEach(t=>{clock=t;var row=[];ids.forEach(id=>{var p=posAtClock(id,t);if(p){positions++;if(!p.every(Number.isFinite))bad.push('nonfinite '+id+' '+t);row.push([id,p])}});snapshots[t]=JSON.stringify(row);
  ['fr','al'].forEach(side=>{var n=sideOnFieldAt(side,t);strengthChecks++;if(!Number.isFinite(n)||n<0)bad.push('strength '+side+' '+t)});
 });
 times.slice().reverse().forEach(t=>{clock=t;var row=[];ids.forEach(id=>{var p=posAtClock(id,t);if(p)row.push([id,p])});if(snapshots[t]!==JSON.stringify(row))bad.push('order dependent '+t)});
 Object.keys(GEOREF.GT).forEach(k=>{var g=GEOREF.GT[k],p=GEOREF.toMap(g.lat,g.lon),q=GEOREF.toGeo(p[0],p[1]);inverseMax=Math.max(inverseMax,Math.abs(q[0]-g.lat),Math.abs(q[1]-g.lon))});
 return {formations:ids.length,clocks:times.length,positions,reverseNavigationChecked:true,strengthChecks,inverseMaxDegrees:inverseMax,failures:bad};
})()`,c);
assert.equal(result.failures.length,0);
const inv=require(path.join(root,'tools/step4/inventory')).inventory(root);result.narrative={statements:inv.statements,byClaim:inv.byClaim};
/* Demonstrate current phone-rule behavior with missing measurements; the acceptance reports themselves are complete. */
const tmp=fs.mkdtempSync(path.join(require('os').tmpdir(),'austerlitz-negative-'));
const empty={refreshMs:17,notes:[],segments:[]};fs.writeFileSync(path.join(tmp,'empty.json'),JSON.stringify(empty));
const neg=cp.spawnSync(process.execPath,['tools/step6/phone-rule.js',path.join(tmp,'empty.json'),path.join(tmp,'empty.json')],{encoding:'utf8'});
result.negativeControl={name:'two empty phone reports',exit:neg.status,stdout:neg.stdout,stderr:neg.stderr,expected:'reject missing mandatory blocks',observed:neg.stdout.split('\n').filter(s=>s.startsWith('VERDICT:'))};
fs.rmSync(tmp,{recursive:true,force:true});
fs.writeFileSync(path.join(out,'model-audit.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
