/* Isolated audit diagnostics. No application changes. Run from repository root. */
'use strict';
const fs=require('fs'),path=require('path');
const root=process.cwd(),out=__dirname,L=require(path.join(root,'tools/stage8/lib')),MO=require(path.join(root,'tools/visual/motion'));
let log={commit:require('child_process').execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),build:require('crypto').createHash('sha256').update(fs.readFileSync('austerlitz-command-map.html')).digest('hex'),screens:[],errors:[],checks:[],extended:[]};
if(process.argv.includes('--resume'))log=JSON.parse(fs.readFileSync(path.join(out,'browser-audit.json')));
const save=()=>fs.writeFileSync(path.join(out,'browser-audit.json'),JSON.stringify(log,null,2));
(async()=>{
const b=await L.launch();log.chromium=b.version();let p=await L.open(b,[1600,900],{harness:false,transitions:true});
p.on('pageerror',e=>log.errors.push(e.message));p.setDefaultTimeout(120000);
await p.locator('#fr-close').click();
const names=['overview-field','pratzen-low','close-sokolnitz','paper-north-up','plans-overview','hybrid-dimmed'];
for(const name of names){
 if(process.argv.includes('--resume')&&fs.existsSync(path.join(out,name+'.jpg')))continue;
 const c=L.byName(name);await p.evaluate(s=>window.__aus.apply(s),c);await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2));
 await p.screenshot({path:path.join(out,name+'.jpg'),type:'jpeg',quality:85,timeout:180000});
 log.screens.push({name,spec:c,state:await p.evaluate(()=>window.__aus.state()),layer:await p.evaluate(()=>({stats:ML.stats,dropped:ML.stats.droppedIds}))});save();console.log('captured',name);
}
/* Real keys and buttons, sequenced while playing, changing speed, seeking, changing presentation, source modal and focus. */
await p.locator('#play').click();await p.waitForTimeout(1100);
log.checks.push({name:'real Play advances',value:await p.evaluate(()=>({playing,clock,speed}))});
await p.keyboard.press('Space');await p.waitForTimeout(400);
log.checks.push({name:'real Space pauses',value:await p.evaluate(()=>({playing,clock,speed}))});
await p.evaluate(()=>setPresentation('study'));await p.locator('#srcbtn').click();await p.keyboard.press('Tab');await p.keyboard.press('Escape');
log.checks.push({name:'sources modal Escape/focus',value:await p.evaluate(()=>({focus:document.activeElement&&document.activeElement.id,open:document.getElementById('modal').classList.contains('on')}))});save();
await p.close();
/* Mobile emulation is Chromium touch input, never described as an actual iPhone. */
const cx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1'});
p=await cx.newPage();p.setDefaultTimeout(120000);await require(path.join(root,'tools/visual/three-route')).routeThree(p);p.on('pageerror',e=>log.errors.push(e.message));
await p.goto('file://'+path.join(root,'austerlitz-command-map.html'));await require(path.join(root,'tools/visual/three-route')).waitBoot(p);
await p.locator('#fr-close').tap();await p.screenshot({path:path.join(out,'phone-portrait.jpg'),type:'jpeg',quality:85,timeout:180000});
await p.locator('#menubtn').tap();await p.setViewportSize({width:844,height:390});await p.waitForTimeout(750);
await p.screenshot({path:path.join(out,'phone-rotated-menu.jpg'),type:'jpeg',quality:85,timeout:180000});
log.checks.push({name:'phone rotate while menu open',value:await p.evaluate(()=>({width:innerWidth,height:innerHeight,scroll:document.documentElement.scrollWidth,focus:document.activeElement&&document.activeElement.id,phone:document.body.classList.contains('phone')}))});save();await cx.close();
/* Extended deterministic app-loop playback. Render skipped only for this label diagnostic. */
p=await L.open(b,[1600,900],{});
if(!process.argv.includes('--skip-extended')) for(const [mode,speed,selected] of [['hybrid',0.5,null],['hybrid',4,null],['staff',0.5,null],['hybrid',0.5,'sthilaire']]){
 const c=L.byName(mode==='staff'?'paper-north-up':'hybrid-dimmed');c.select=null;c.t=540;c.mode=mode;
 await p.evaluate(s=>window.__aus.apply(s),c);await p.evaluate(()=>AUSTERLITZ_DEBUG.settle(2));await L.inject(p,MO.inPage);
 const frames=3600,args={kind:'play',n:frames,amt:speed,gl:false,room:false,select:selected,rest:90,pre:8,from:540};
 const r=await p.evaluate(new Function('a','return ('+MO.RUN.toString()+')(a);'),args);
 const m=MO.measure(r.F,{restFrom:r.restFrom,track:[]});
 const q={mode,speed,selected,frames,simulatedSeconds:frames/30,startClock:540,endClock:await p.evaluate(()=>clock),measurement:m};log.extended.push(q);save();
 console.log('extended',mode,speed,selected,'end',q.endClock,'longest',m.track.all.longestMs,'visibility',m.track.all.visible);
}
await p.close();await b.close();save();
})().catch(e=>{log.errors.push(String(e.stack||e));save();console.error(e);process.exit(1)});
