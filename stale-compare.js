/* One-off: compare every coordinate in the pre-correction backup with the current tree. */
const fs=require('fs'), path=require('path');
global.GEOREF=require('../geo.js'); global.window={};
const {warp}=require('./warp.js');
function load(dir){
  const src=f=>fs.readFileSync(path.join(dir,f),'utf8'); const o={};
  (new Function('o', src('data.js')+';\n'+src('analysis.js')+';\no.F=FORMATIONS;o.FE=FEATURES;o.PH=PHASES;o.PL=PLANS;o.EV=EVENTS;o.TO=TOUR;'))(o);
  const a=src('app.js'); const i0=a.indexOf('var OVERLAYS'), i1=a.indexOf('\n};',i0)+3; const v0=a.indexOf('var VANTAGE'), v1=a.indexOf('};',v0)+2;
  (new Function('o', a.slice(i0,i1)+';'+a.slice(v0,v1)+';o.OV=OVERLAYS;o.VA=VANTAGE;'))(o);
  const w=src('world.js'); const h=w.slice(w.indexOf('function W('),w.indexOf('/* ---------------- noise and relief'));
  const rl=w.match(/var PRAT=W\([\s\S]*?;\n/)[0].replace(/var CREST=M2W\(CREST_M\);\n/,'');
  (new Function('o', h.replace(/var UNITS_PER_KM = [^;]*;/,'')+';'+rl.replace('var CREST=M2W(CREST_M);','')+';o.RO=ROADS;o.WO=WOODS;o.MA=MARSH;o.VI=VILLAGES;o.GB=GOLDBACH_M;o.LI=LITAVA_M;o.BR=BROOKS_M;o.TL=TERRAIN_LINES;o.VY=VINEYARD;o.RE={PRAT,VINO,PBERG,SANTON,ZURAN,SATS,MENI,SLAV,SCHLAP};'))(o);
  o.CASTLE=w.match(/Sokolnitz castle[\s\S]{0,5}/)?null:null; const cm=w.match(/var cc=W\((\d+),(\d+)\), y=height\(cc\[0\],cc\[1\]\);/); o.CASTLE=cm?[+cm[1],+cm[2]]:null;
  return o;
}
const W2M=w=>[w[0]*2+340,w[1]*2+250];
function coords(o){
  const out={}, put=(k,p)=>{ if(p&&typeof p[0]==='number') out[k]=[p[0],p[1]]; };
  Object.keys(o.F).forEach(id=>{ const t=o.F[id].track; if(t) Object.keys(t).forEach(ph=>{ put('track '+id+' ph'+ph,t[ph].p); (t[ph].via||[]).forEach((v,i)=>put('track '+id+' ph'+ph+' via'+i,v)); }); });
  o.FE.forEach(f=>put('feature '+f.id,f.p));
  o.PH.forEach((p,i)=>{ if(p.cam) put('camera phase'+i,W2M([p.cam[3],p.cam[5]])); });
  o.TO.forEach((s,i)=>{ if(s.cam) put('camera tour'+i,W2M([s.cam[3],s.cam[5]])); });
  Object.keys(o.VA).forEach(k=>{ put('camera vantage '+k,W2M([o.VA[k][3],o.VA[k][5]])); if(k==='zuran') put('camera vantage zuran (eye)',W2M([o.VA[k][0],o.VA[k][2]])); });
  ['al','fr'].forEach(sd=>{ const P=o.PL[sd]; (P.cols||[]).forEach((c,i)=>{ put('plan '+sd+' col'+i+' obj',c.obj); (c.route||[]).forEach((r,j)=>put('plan '+sd+' col'+i+' route'+j,r)); });
    (P.objectives||[]).forEach((x,i)=>put('plan '+sd+' objective'+i,x.p)); (P.staging||[]).forEach((x,i)=>put('plan '+sd+' staging'+i,x.c)); });
  o.EV.forEach(e=>put('event '+e.id,e.p));
  Object.keys(o.OV).forEach(ph=>{ const O=o.OV[ph]; ['lines','arrows','bounds'].forEach(k=>(O[k]||[]).forEach((L,i)=>L.pts.forEach((p,j)=>put('overlay ph'+ph+' '+k+i+' #'+j,p)))); (O.obj||[]).forEach((x,i)=>put('overlay ph'+ph+' obj'+i,x)); });
  o.RO.forEach(r=>{ const n=r.n.replace('Raigern-Telnitz lane','Raigern-Telnitz road'); r.p.forEach((p,i)=>put('road '+n+' #'+i,p)); });
  o.WO.forEach((x,i)=>put('wood '+i,x.c)); o.MA.forEach((x,i)=>put('marsh '+i,x.c)); o.VI.forEach(v=>put('village '+v[0],[v[1],v[2]]));
  o.GB.forEach((p,i)=>put('goldbach #'+i,p)); o.LI.forEach((p,i)=>put('litava #'+i,p)); o.BR.forEach((b,i)=>b.forEach((p,j)=>put('brook '+i+' #'+j,p)));
  o.TL.forEach(t=>t.p.forEach((p,i)=>put('terrain line '+t.n.replace('Western escarpment','Western slope')+' #'+i,p)));
  put('vineyard',o.VY.c); Object.keys(o.RE).forEach(k=>put('relief '+k,W2M(o.RE[k]))); put('castle',o.CASTLE);
  return out;
}
const OLD=coords(load(path.join(__dirname,'../../aus2_pre_geo'))), NEW=coords(load(path.join(__dirname,'..')));
/* the documented re-anchors of this pass (key prefixes) */
const INTENT=[
 [/^track (bag|suchet) ph[0-9]$/,'Olmutz highway corrected: re-plotted on the road'],[/^track (friant|bourcier) ph0$/,'Raigern is off the map: placed at the frame edge on its road'],
 [/^track gqg ph8$|^track heightguns ph[89]$/,'the St Anthony chapel above Augezd'],[/^track ahq ph[04]$/,'04:00 at Krzenowitz; 09:30 east of the French-held village'],
 [/^track sthilaire ph[89]$/,'against Sokolnitz from the east; then between Telnitz and Augezd'],[/^track kamensky ph[678]/,'broken brigade kept on the map, retiring east (C)'],
 [/^track kollo ph[456]$/,'off the French-held village; the 5 km/h leg removed'],[/^track (legrand ph7|bourcier ph8) via/,'inferred / act-following routes'],
 [/^feature (pratzen|litava|olmutzroad|viennaroad)$/,'feature marker moved to its corrected place'],[/^plan al col6|^plan fr col3/,'the plans on the corrected highway'],
 [/^event (soult|davout)$/,'event marker corrected (Soult axis; Friant at the Goldbach)'],[/^overlay ph5 arrows[12] |^overlay ph8 arrows5 /,'Suchet and Bagration arrows on the road'],
 [/^litava |^goldbach #9$/,'Litava rerouted from ground truth; the Goldbach meets it'],[/^brook 4 /,'the Rakovec (new)'],[/^road Brunn-Olmutz highway/,'highway rerouted'],
 [/^road (Pratzen-Austerlitz road|Krzenowitz road|Holubitz-Posoritz track|Raigern-Telnitz road) /,'road re-anchored on its end places'],
 [/^wood [01]$|^castle$/,'kept beside Austerlitz and Sokolnitz by their legacy offsets'],[/^marsh [58]$/,'Litava marshes moved onto the river'],
 [/^village /,'villages from ground truth'],[/^terrain line (Pratzen crest|Santon spur|Litava bottom|Augezd defile) /,'regenerated from ground truth'],[/^relief PRAT$/,'plateau relief centred on the crest']];
const why=k=>{ const m=INTENT.find(x=>x[0].test(k)); return m?m[1]:null; };
let migrated=0, stale=[], re=[], drift=[];
Object.keys(OLD).forEach(k=>{ if(!(k in NEW)) return; const o=OLD[k], n=NEW[k], w=warp(o[0],o[1]);
  const moved=Math.hypot(n[0]-o[0],n[1]-o[1]), shouldMove=Math.hypot(w[0]-o[0],w[1]-o[1]), offWarp=Math.hypot(n[0]-w[0],n[1]-w[1]);
  if(moved<0.5 && shouldMove>=2){ stale.push(k+' ['+o+'] should have moved '+shouldMove.toFixed(1)); return; }
  if(offWarp<=1.6){ migrated++; return; }
  const r=why(k); if(r) re.push([k,r,offWarp]); else drift.push(k+' legacy ['+o+'] warp ['+w.map(Math.round)+'] now ['+n.map(Math.round)+'] ('+(offWarp*GEOREF.KM_PER_MAP).toFixed(2)+' km off the warp)'); });
const removed=Object.keys(OLD).filter(k=>!(k in NEW)), added=Object.keys(NEW).filter(k=>!(k in OLD));
console.log('coordinates in the backup: '+Object.keys(OLD).length+'   now: '+Object.keys(NEW).length);
console.log('moved exactly as the migration warp prescribes: '+migrated);
console.log('STALE (never migrated although the warp moves them): '+stale.length); stale.forEach(s=>console.log('   '+s));
const byWhy={}; re.forEach(([k,r])=>{ (byWhy[r]=byWhy[r]||[]).push(k); });
console.log('re-anchored by a documented rule: '+re.length); Object.keys(byWhy).forEach(r=>console.log('   '+String(byWhy[r].length).padStart(3)+'  '+r));
console.log('UNEXPLAINED (differs from the warp, not on the documented list): '+drift.length); drift.forEach(s=>console.log('   '+s));
console.log('removed: '+removed.length+'  '+removed.join('; '));
console.log('added:   '+added.length+'  '+added.join('; '));
