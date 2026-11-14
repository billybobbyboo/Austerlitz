'use strict';
const fs=require('fs'),path=require('path'),root=process.cwd(),out=__dirname,L=require(path.join(root,'tools/stage8/lib')),MO=require(path.join(root,'tools/visual/motion'));
(async()=>{const b=await L.launch(),p=await L.open(b,[1600,900],{}),res={commit:require('child_process').execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),chromium:b.version(),note:'The real app loop, deterministic 30 Hz clock, WebGL draw skipped only during label measurement; not a device performance test.',runs:[]};
const ids=await p.evaluate(()=>Object.keys(FORMATIONS));
for(const [view,speed,selected] of [['hybrid',0.5,null],['hybrid',4,null],['paper',0.5,null],['hybrid',0.5,'sthilaire']]){
 const c=JSON.parse(JSON.stringify(MO.VIEWS[view]));c.t=540;await p.evaluate(s=>window.__aus.apply(s),c);await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2));await L.inject(p,MO.inPage);
 const args={kind:'play',n:3600,amt:speed,gl:false,room:false,select:selected,rest:90,pre:8,from:540};
 const r=await p.evaluate(new Function('a','return ('+MO.RUN.toString()+')(a);'),args),m=MO.measure(r.F,{restFrom:r.restFrom,track:ids});
 const entry={view,speed,selected,args,simulatedSeconds:120,endClock:await p.evaluate(()=>clock),measurement:m};res.runs.push(entry);fs.writeFileSync(path.join(out,'extended-playback.json'),JSON.stringify(res,null,2));
 console.log(view,speed,selected,'end',entry.endClock,'longest hidden ms',m.track.all.longestMs,'visible',m.track.all.visible,'protected hidden',m.keepHidden);
}await p.close();await b.close()})().catch(e=>{console.error(e);process.exit(1)});
