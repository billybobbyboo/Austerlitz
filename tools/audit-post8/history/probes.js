/* Final audit after Stage 8, area "history": the small probes first run inline, kept here so that each evidence file can be made again.
   node probes.js <name>   with name one of: plateau-day, guard-attack-motion, legrand-through-castle, blasowitz-guard, sokolnitz-defence,
   milo-litava. Run against the isolated copy (see load.js). Read-only. */
const fs=require('fs'), path=require('path');
const {load,ISO}=require('./load.js'); const M=load({state:true});
const deg=r=>r===null?'null':(r*180/Math.PI).toFixed(0);
const P={
  'plateau-day'(){   /* the derived plateau reading minute by minute, and Kamensky's reversal before the French climb */
    let prev=null; for(let t=T_MIN;t<=T_MAX;t++){ clock=t; const v=plateauStrength('al'), f=plateauStrength('fr'); const k=v+'/'+f; if(k!==prev){ console.log(fmtClock(t)+' Al '+v+' Fr '+f); prev=k; } }
    for(const t of [490,500,510,520,524,525]){ clock=t; const p=posNow('kamensky'); console.log(fmtClock(t),'kamensky',p.map(x=>x.toFixed(1)),'onPlateau',onPlateau(p),'heading',deg(headingAt('kamensky',t)),'lang',posNow('lang').map(x=>x.toFixed(0)),'sthilaire',posNow('sthilaire').map(x=>x.toFixed(0))); } },
  'guard-attack-motion'(){   /* the two Guards during phase 6: positions, statuses, headings */
    for(const t of [675,690,705,720,735,750,760,765]){ clock=t; const ph=phaseAt(t);
      console.log(fmtClock(t)+' | '+['rg_inf','rg_cav','kollo','vandamme','guard_cav','drouet','gqg','kamensky'].map(id=>{ const p=posNow(id); return id+' '+(p?p.map(x=>x.toFixed(0)).join(','):'-')+' '+stateAt(id,ph).st+' hdg '+deg(headingAt(id,t)); }).join(' | ')); }
    ['rg_inf','rg_cav'].forEach(id=>anchorList(id).forEach(a=>console.log(id,'anchor ph',a.ph,'arr',fmtClock(a.arr),'w',a.w&&a.w.map(fmtClock).join('-')))); },
  'legrand-through-castle'(){   /* Legrand's leg 2->4 against the III Column at the castle (LANDMARK_SITES.castle [212.9,344.3]) */
    for(let t=480;t<=575;t+=5){ clock=t; const a=posNow('legrand'), b=posNow('prz'), ph=phaseAt(t);
      console.log(fmtClock(t),'legrand',a.map(x=>x.toFixed(1)),stateAt('legrand',ph).st,'| prz',b.map(x=>x.toFixed(1)),stateAt('prz',ph).st,'|',(Math.hypot(a[0]-b[0],a[1]-b[1])*KM_PER_MAP*1000).toFixed(0)+' m','| castle',(Math.hypot(a[0]-212.9,a[1]-344.3)*KM_PER_MAP*1000).toFixed(0)+' m'); }
    anchorList('legrand').forEach(a=>console.log('legrand anchor',a.ph,'arr',fmtClock(a.arr),'w',a.w&&a.w.map(fmtClock).join('-'))); },
  'blasowitz-guard'(){   /* who stands near Blasowitz when the event says the French take it from the Russian Guard */
    const B=[296,147]; for(const t of [600,630,660,675,690,705]){ clock=t; console.log(fmtClock(t),'distance to Blasowitz:',['rg_inf','rg_cav','lich','bag','caffarelli','rivaud','drouet','kellermann'].map(id=>{ const p=posNow(id); return id+' '+(Math.hypot(p[0]-B[0],p[1]-B[1])*KM_PER_MAP).toFixed(2)+'km'; }).join(', ')); }
    console.log('constantine role:',FORMATIONS.constantine.role); },
  'sokolnitz-defence'(){   /* the nearest formation of each side to the Sokolnitz village point over the day */
    const V=[208,365]; for(let t=420;t<=900;t+=30){ clock=t; let best=null,bd=1e9,ab=null,ad=1e9; Object.keys(units).forEach(id=>{ const f=FORMATIONS[id]; if(f.arm==='hq') return; const p=posNow(id); if(!p) return; const d=Math.hypot(p[0]-V[0],p[1]-V[1])*KM_PER_MAP; if(f.nation==='fr'){ if(d<bd){bd=d;best=id;} } else if(d<ad){ad=d;ab=id;} });
      console.log(fmtClock(t),'nearest French:',best,bd.toFixed(2)+' km','| nearest Allied:',ab,ad.toFixed(2)+' km'); } },
  'milo-litava'(){   /* retreat anchors against the Litava's drawn line (world.js LITAVA_M) and the water raster */
    const acorn=require(path.join(ISO,'node_modules','acorn')); const wsrc=fs.readFileSync(path.join(ISO,'world.js'),'utf8'); const AST=acorn.parse(wsrc,{ecmaVersion:2020});
    let LI=null; for(const n of AST.body){ if(n.type==='VariableDeclaration') for(const d of n.declarations){ if(d.id.name==='LITAVA_M') LI=(0,eval)('('+wsrc.slice(d.init.start,d.init.end)+')'); } }
    const dist=(p,line)=>{ let best=1e9; for(let j=0;j<line.length-1;j++){ const a=line[j],b=line[j+1]; const vx=b[0]-a[0],vy=b[1]-a[1]; const L=vx*vx+vy*vy; let t=L?((p[0]-a[0])*vx+(p[1]-a[1])*vy)/L:0; t=Math.max(0,Math.min(1,t)); best=Math.min(best,Math.hypot(p[0]-a[0]-t*vx,p[1]-a[1]-t*vy)); } return best; };
    Object.keys(FORMATIONS).forEach(id=>{ const f=FORMATIONS[id]; if(!f.track) return; anchorList(id).forEach(a=>{ if(!a.p) return; const d=dist(a.p,LI)*KM_PER_MAP*1000; if(d<250){ const w=W(a.p[0],a.p[1]); console.log(id+'@'+a.ph,a.p,'to the Litava '+d.toFixed(0)+' m, covWater '+M.covAt(M.covWater,w[0],w[1]).toFixed(2)); } }); }); }
};
const k=process.argv[2]; if(!P[k]){ console.log('probes: '+Object.keys(P).join(', ')); process.exit(1); } P[k]();
