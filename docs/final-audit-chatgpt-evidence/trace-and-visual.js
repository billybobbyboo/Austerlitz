'use strict';
const fs=require('fs'),path=require('path'),root=process.cwd(),out=__dirname,L=require(path.join(root,'tools/stage8/lib')),MO=require(path.join(root,'tools/visual/motion')),V=require(path.join(root,'tools/stage8/views'));
(async()=>{const b=await L.launch(),p=await L.open(b,[1600,900],{}),res={chromium:b.version(),trace:null,screens:[],memory:[]};
await p.evaluate(s=>window.__aus.apply(s),MO.VIEWS.hybrid);await L.inject(p,MO.inPage);
await p.evaluate(()=>{const orig=__md.snap;__md.snap=function(o){const s=orig(o);s.clock=clock;s.playing=playing;return s}});
const r=await p.evaluate(new Function('a','return ('+MO.RUN.toString()+')(a);'),{kind:'play',n:3600,amt:0.5,gl:false,room:false,rest:90,pre:8,from:540});
const episodes=[],keys=new Set(r.F.flatMap(f=>Object.keys(f.items).filter(k=>/^[cn]:/.test(k))));
for(const k of keys){let start=-1;for(let i=0;i<=r.F.length;i++){const f=r.F[i],s=f&&f.items[k],hidden=f&&f.playing&&s&&['held','dropped'].includes(s.st);if(hidden&&start<0)start=i;if(!hidden&&start>=0){const a=r.F[start],z=r.F[i-1];episodes.push({key:k,startFrame:start,endFrame:i-1,seconds:(i-start)/30,startClock:a.clock,endClock:z.clock,keep:a.items[k].keep});start=-1}}}
res.trace={note:'Only uninterrupted placement-hidden episodes while the app reports playing; excludes off-screen, behind terrain and the end/rest samples.',frames:r.F.length,episodes:episodes.sort((a,b)=>b.seconds-a.seconds)};
fs.writeFileSync(path.join(out,'trace-and-visual.json'),JSON.stringify(res,null,2));console.log('trace worst',res.trace.episodes.slice(0,4));
for(const [name,c] of [['ice-low-current',V['ice-low']],['infantry-current',{...V['inf-close'],t:545}],['artillery-moving-current',V['bat-limbered']],['castle-current',{...V['village-sokolnitz'],aim:{map:[212.9,344.3],dir:[-0.62,0.34,0.7],r:28}}],['garden-current',{...V['ice-high'],t:720,aim:{map:[496,125],dir:[-0.4,0.8,0.5],r:65}}]]){
 await p.evaluate(s=>window.__aus.apply(s),c);await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2));await p.screenshot({path:path.join(out,name+'.jpg'),type:'jpeg',quality:85,timeout:180000});res.screens.push({name,spec:c,state:await p.evaluate(()=>window.__aus.state())});console.log('captured',name);fs.writeFileSync(path.join(out,'trace-and-visual.json'),JSON.stringify(res,null,2));
}
/* A short sequence of actual rendered frames. Driver time is 30 Hz; software rendering wall time is not a device benchmark. */
await p.evaluate(s=>window.__aus.apply(s),{...V['inf-close'],t:545});await L.inject(p,MO.inPage);const frames=path.join(out,'motion-frames');fs.mkdirSync(frames,{recursive:true});
await p.evaluate(()=>{__md.start({gl:true});stopPlay();setClock(545,{instant:true,force:true,camera:false});setSpeed(0.5);freeCam=true;togglePlay()});
for(let i=0;i<12;i++){await p.evaluate(()=>__md.frame(3));await p.screenshot({path:path.join(frames,'f'+String(i).padStart(5,'0')+'.jpg'),type:'jpeg',quality:80,timeout:180000})}
await p.evaluate(()=>{stopPlay();__md.stop()});res.motion={frames:12,fps:10,startClock:545,endClock:await p.evaluate(()=>clock),driver:'30 Hz app loop, screenshot every third rendered frame',viewport:[1600,900]};
/* Repeated phase navigation to the same final state, with GPU resources actually rendered and heap collection requested. */
const cdp=await p.context().newCDPSession(p);for(let cycle=0;cycle<4;cycle++){
 await p.evaluate(()=>{stopPlay();for(const t of [240,480,600,720,900,1080,540])setClock(t,{instant:true,force:true,camera:false});AUSTERLITZ_DEBUG.settle(2)});await cdp.send('HeapProfiler.collectGarbage');res.memory.push({cycle,...await p.evaluate(()=>({geometry:renderer.info.memory.geometries,textures:renderer.info.memory.textures,programs:renderer.info.programs.length,dom:document.getElementsByTagName('*').length,heap:performance.memory?performance.memory.usedJSHeapSize:null}))});
}await p.close();await b.close();L.encode(frames,path.join(out,'infantry-motion'),10,640);fs.writeFileSync(path.join(out,'trace-and-visual.json'),JSON.stringify(res,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
