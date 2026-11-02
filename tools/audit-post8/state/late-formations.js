/* audit-post8 (state): which formations appear after phase 0 or leave during the day, and whether a PLANS column names them (routeDeviation reads
   posAtClock without the presence test). Usage: node late-formations.js <iso-root>   (read-only) */
const fs=require('fs'); const ISO=process.argv[2]; process.chdir(ISO);
const M=require(ISO+'/_world_mod.js');
global.W=M.W; global.height=M.height; global.hAt=M.hAt; global.smoothstep=M.smoothstep;
global.covAt=M.covAt; global.SATS=M.SATS; global.MENI=M.MENI; global.VILLAGES=M.VILLAGES; M.buildCover(); M.buildGrid();
Object.defineProperty(global,'covWater',{get:()=>M.covWater}); Object.defineProperty(global,'covRoad',{get:()=>M.covRoad}); Object.defineProperty(global,'covMarsh',{get:()=>M.covMarsh});
eval(fs.readFileSync('data.js','utf8')); eval(fs.readFileSync('analysis.js','utf8')); eval(fs.readFileSync('_clock.js','utf8'));
const late=Object.keys(FORMATIONS).filter(id=>FORMATIONS[id].track&&anchorList(id).length&&anchorList(id)[0].ph>0);
const gone=Object.keys(FORMATIONS).filter(id=>FORMATIONS[id].track&&anchorList(id).some(a=>a.p===null));
console.log('first anchor after phase 0:',late.map(id=>id+'@'+anchorList(id)[0].ph).join(', '));
console.log('removed during the day:',gone.join(', '));
['al','fr'].forEach(sd=>PLANS[sd].cols.forEach(c=>{ const hit=c.forms.filter(f=>late.includes(f)||gone.includes(f)); if(hit.length) console.log('plan',sd,c.n,'names',hit.join(',')); }));
