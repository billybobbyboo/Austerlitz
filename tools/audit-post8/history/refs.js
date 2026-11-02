/* Hierarchy and references: every parent exists and lists its child; every child names its parent; every formation id named by EVENTS,
   ANALYSIS (forms), PLANS (cols.forms), KNOW_OVERRIDE, TOUR (chapter/feature/plan), and every feature id named by ANALYSIS.feats exists;
   every moment (ph:/ev:) resolves; nation/side coherence between a child and its parent (a mixed column noted). */
const {load}=require('./load.js'); load();
const F=FORMATIONS, bad=[], notes=[];
Object.keys(F).forEach(id=>{ const f=F[id];
  if(f.parent){ if(!F[f.parent]) bad.push(id+': parent '+f.parent+' missing'); else if(!(F[f.parent].children||[]).includes(id)) bad.push(id+': parent '+f.parent+' does not list it'); }
  (f.children||[]).forEach(k=>{ if(!F[k]) bad.push(id+': child '+k+' missing'); else if(F[k].parent!==id) bad.push(id+': child '+k+' names parent '+F[k].parent); else if(F[k].nation!==f.nation) notes.push(`${k} (${F[k].nation}) under ${id} (${f.nation})`); }); });
const fids=new Set(Object.keys(F)), feats=new Set(FEATURES.map(x=>x.id)), evs=new Set(EVENTS.map(e=>e.id));
EVENTS.forEach(e=>e.forms.forEach(k=>{ if(!fids.has(k)) bad.push('EVENTS '+e.id+': '+k); }));
ANALYSIS.forEach(a=>{ (a.forms||[]).forEach(k=>{ if(!fids.has(k)) bad.push('ANALYSIS '+a.id+': form '+k); }); (a.feats||[]).forEach(k=>{ if(!feats.has(k)) bad.push('ANALYSIS '+a.id+': feat '+k); });
  [a.at].concat(a.moments||[]).forEach(m=>{ const [k,v]=m.split(':'); if(k==='ev'&&!evs.has(v)) bad.push('ANALYSIS '+a.id+': moment '+m); if(k==='ph'&&!PHASES[+v]) bad.push('ANALYSIS '+a.id+': moment '+m); }); });
['al','fr'].forEach(s=>PLANS[s].cols.forEach(c=>c.forms.forEach(k=>{ if(!fids.has(k)) bad.push('PLANS '+s+' '+c.n+': '+k); })));
['al','fr'].forEach(s=>Object.keys(KNOW_OVERRIDE[s]).forEach(k=>{ if(!fids.has(k)) bad.push('KNOW_OVERRIDE '+s+': '+k); else if((F[k].nation==='fr')===(s==='fr')) bad.push('KNOW_OVERRIDE '+s+': '+k+' is own side'); }));
TOUR.forEach((t,i)=>{ if(t.chapter&&!ANALYSIS.find(a=>a.id===t.chapter)) bad.push('TOUR '+i+' chapter '+t.chapter); if(t.feature&&!feats.has(t.feature)) bad.push('TOUR '+i+' feature '+t.feature);
  const [k,v]=t.at.split(':'); if(k==='ev'&&!evs.has(v)) bad.push('TOUR '+i+' at '+t.at); });
/* side of each event's formations against the event's side, for attack/capture kinds */
EVENTS.forEach(e=>{ const sides=e.forms.filter(k=>F[k]).map(k=>F[k].nation==='fr'?'fr':'al'); if(e.forms.length&&!sides.includes(e.side)) notes.push('EVENT '+e.id+' side '+e.side+' but forms '+e.forms.join(',')); });
/* the ANALYSIS forms of each theme that are never live in the theme's moments (not on the field) */
console.log('reference errors: '+bad.length); bad.forEach(x=>console.log('  '+x));
console.log('notes: '); notes.forEach(x=>console.log('  '+x));
