/* Overview of FORMATIONS: hierarchy, strengths, commanders, anchors and grades. Writes a table to stdout. */
const {load}=require('./load.js'); load({state:true});
const ids=Object.keys(FORMATIONS);
const rows=[];
ids.forEach(id=>{const f=FORMATIONS[id];
  const tr=f.track?Object.keys(f.track).map(Number).sort((a,b)=>a-b):[];
  const anchors=tr.filter(k=>f.track[k].p);
  const grades=anchors.map(k=>k+':'+(f.track[k].cf||'-'));
  rows.push([id,f.ech,f.nation,f.arm,f.parent||'',(f.children||[]).join(','),f.strength==null?'null':f.strength,f.guns==null?'':f.guns,(f.commander||'').slice(0,50),grades.join(' ')].join(' | '));
});
console.log('id | ech | nation | arm | parent | children | strength | guns | commander | anchors:cf');
rows.forEach(r=>console.log(r));
console.log('\n'+ids.length+' formations; with track: '+ids.filter(i=>FORMATIONS[i].track).length);
