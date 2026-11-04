/* Audit-only. Run from repository root: node docs/final-audit-chatgpt-evidence/device-audit.js */
'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm'),cp=require('child_process'),assert=require('assert');
const root=process.cwd(),dir=path.join(root,'docs/stage8-evidence/device'),out=__dirname;
const sandbox={};vm.createContext(sandbox);vm.runInContext(fs.readFileSync('tools/step6/perf-route.js','utf8'),sandbox);
const api=sandbox.AUS_PERF, expected=require('crypto').createHash('sha256').update(fs.readFileSync('austerlitz-command-map.html')).digest('hex');
const median=a=>{a=a.slice().sort((x,y)=>x-y);return a.length%2?a[a.length>>1]:(a[(a.length>>1)-1]+a[a.length>>1])/2;};
const reports=[],all={};
for(const name of fs.readdirSync(dir).filter(n=>n.endsWith('.json')).sort()){
 const d=JSON.parse(fs.readFileSync(path.join(dir,name))),txt=fs.readFileSync(path.join(dir,name.replace('.json','.txt')),'utf8').trim();
 const embedded=JSON.parse(txt.split('AUS_PERF_JSON ')[1]),formatted=api.format(d).trim();
 assert.deepStrictEqual(embedded,d,name+' embedded JSON');
 assert.equal(formatted,txt,name+' entire formatted report including table, headers, settings, verdicts');
 assert.equal(d.build.sha256,expected);assert.equal(d.build.bytes,2810630);assert.equal(d.device.visibility,'visible');assert(d.segments.every(s=>!s.hidden));
 for(const s of d.segments){assert(s.frames>0);assert(s.long>=0&&s.long<=s.frames);assert(Math.abs(s.longPct-100*s.long/s.frames)<=0.051);assert(s.p50<=s.p95&&s.p95<=s.p99&&s.p99<=s.max);}
 if(d.bracketVerdict)assert.deepStrictEqual(JSON.parse(JSON.stringify(api.bracketVerdict(d.segments,api.BRACKETS[d.route]))),d.bracketVerdict);
 reports.push({name,rows:d.segments.length,version:d.version,build:d.build,visible:true,tableMatches:true,bracket:d.bracketVerdict||null,device:d.device,longMs:d.longMs});all[name]=d;
}
const phone={};for(const id of ['ph8-overview','play-half']){
 const seg=['phone-R1.json','phone-R2.json'].flatMap(n=>all[n].segments.filter(s=>s.id===id&&s.cand==='A'&&s.round));
 phone[id]={blocks:seg.length,medianFps:median(seg.map(s=>s.fps)),fpsRange:[Math.min(...seg.map(s=>s.fps)),Math.max(...seg.map(s=>s.fps))],medianLongPct:median(seg.map(s=>s.longPct)),allOver5pct:seg.every(s=>s.longPct>5),weightedLongPct:100*seg.reduce((n,s)=>n+s.long,0)/seg.reduce((n,s)=>n+s.frames,0)};
}
const desktop=['desk-D1.json','desk-D2.json'].flatMap(n=>all[n].segments.filter(s=>/^play/.test(s.id)&&s.kind==='played').map(s=>({file:n,...s})));
const result={auditSourceCommit:cp.execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),reports,totalRows:reports.reduce((n,r)=>n+r.rows,0),phone,desktopPlay:desktop,notes:['Tables/header/settings/verdicts checked by regenerating with current formatter; embedded JSON compared structurally.','Frame interval arrays and temperatures were not recorded; percentiles cannot be recomputed from individual frames.','Long threshold uses max(1.5*measured refresh,25) strictly exceeded; recorded rounded threshold is 25/25.5 ms.']};
fs.writeFileSync(path.join(out,'device-audit.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify({reports:reports.length,rows:result.totalRows,phone,desktopPlay:desktop.map(s=>({id:s.id,kind:s.kind,fps:s.fps,p95:s.p95,js50:s.js50}))},null,2));
