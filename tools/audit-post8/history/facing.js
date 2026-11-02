/* S-5's facing (app.js faceClock, posAtT, enemyFacing, extracted from the live app.js by declaration name): a formation that is not marching
   faces the nearest enemy (HQs excluded) as placed at faceClock. Checked here: at each phase's middle, for every halted formation, the enemy
   it faces and how far, against the opponents its current act/objective names (names resolved by tools/stage2/chronology.js's NAMES table,
   copied). Flags: facing an enemy more than 60 degrees off a named opponent's bearing; a fighting status facing an enemy over 2.5 km away. */
const fs=require('fs'), path=require('path');
const {load,ISO}=require('./load.js'); load({state:true});
const app=fs.readFileSync(path.join(ISO,'app.js'),'utf8');
function scanEnd(src,i){ let depth=0,seen=false; for(let k=i;k<src.length;k++){ const c=src[k],n=src[k+1];
  if(c==='/'&&n==='/'){ k=src.indexOf('\n',k); continue; } if(c==='/'&&n==='*'){ k=src.indexOf('*/',k+2)+1; continue; }
  if(c==='"'||c==="'"||c==='`'){ for(k++;k<src.length&&src[k]!==c;k++) if(src[k]==='\\') k++; continue; }
  if(c==='{'||c==='['||c==='('){ depth++; if(c==='{') seen=true; } else if(c==='}'||c===']'||c===')'){ depth--; if(seen&&depth===0) return k+1; } } }
function extract(name){ const i=app.indexOf('\nfunction '+name+'('); if(i<0) throw new Error(name); return app.slice(i+1,scanEnd(app,i+1)); }
(0,eval)('var faceCache={}, _efT={}, _efV={};\n'+['faceClock','posAtT','enemyFacing'].map(extract).join('\n'));
const chron=fs.readFileSync(path.join(ISO,'tools','stage2','chronology.js'),'utf8');
const NAMES=(0,eval)('('+chron.slice(chron.indexOf('const NAMES=')+12, chron.indexOf('];',chron.indexOf('const NAMES='))+1)+')');
function namesIn(text){ const s=new Set(); NAMES.forEach(([k,ids])=>{ if(new RegExp('(^|[^A-Za-z])'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'($|[^A-Za-z])').test(text)) ids.forEach(i=>s.add(i)); }); return s; }
const bearing=(a,b)=>{ const wa=W(a[0],a[1]), wb=W(b[0],b[1]); return Math.atan2(wb[0]-wa[0],wb[1]-wa[1]); };
const dAng=(x,y)=>{ let d=x-y; while(d>Math.PI) d-=2*Math.PI; while(d<-Math.PI) d+=2*Math.PI; return Math.abs(d)*180/Math.PI; };
const FIGHT={engaged:1,attacking:1,counterattack:1,charging:1,holding:1,repulsed:0,supporting:1};
const out=[], flags=[];
PHASES.forEach(P=>{ const t=Math.round((P.t0+P.t1)/2); clock=t; faceCache={}; _efT={}; _efV={};
  Object.keys(units).forEach(id=>{ const f=FORMATIONS[id]; if(f.arm==='hq') return; const me=posNow(id); if(!me) return;
    const h=headingAt(id,t); if(h!==null) return;   /* marching: faces its heading */
    const fc=enemyFacing(id); if(fc===null) return;
    /* which enemy that is: the nearest at faceClock */
    const tc=faceClock(id,t), mp=posAtT(id,tc); let best=null,bd=1e9; Object.keys(units).forEach(k=>{ const g=FORMATIONS[k]; if(g.arm==='hq'||(g.nation==='fr')===(f.nation==='fr')) return; const q=posAtT(k,tc); if(!q) return; const d=Math.hypot(q[0]-mp[0],q[1]-mp[1]); if(d<bd){bd=d;best=k;} });
    const s=stateAt(id,P.id); const txt=(s.act||'')+' '+(s.obj||'');
    const named=[...namesIn(txt)].filter(k=>FORMATIONS[k]&&FORMATIONS[k].track&&(FORMATIONS[k].nation==='fr')!==(f.nation==='fr')&&posAtT(k,t));
    let worst=null; named.forEach(k=>{ const a=dAng(fc,bearing(me,posAtT(k,t))); if(!worst||a<worst.a) worst={k,a}; });
    const line=`ph${P.id} ${fmtClock(t)} ${id} (${s.st}) faces ${best} at ${(bd*KM_PER_MAP).toFixed(2)} km`+(named.length?`; act names ${named.join(',')}: best ${worst.k} ${worst.a.toFixed(0)} deg off`:'');
    out.push(line);
    if(worst&&worst.a>60) flags.push('OFF-OPPONENT '+line);
    if(FIGHT[s.st]&&bd*KM_PER_MAP>2.5) flags.push('FAR '+line);
  }); });
console.log('== flags =='); flags.forEach(x=>console.log(x));
console.log('\n== every halted formation at each phase middle =='); out.forEach(x=>console.log(x));
