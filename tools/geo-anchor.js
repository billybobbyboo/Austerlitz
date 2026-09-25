/* =========================================================================
   Re-anchoring by meaning, after tools/geo-migrate.js.

   The legacy map drew some things in a way no smooth warp can repair:
   the Olmutz highway ran due east through Holubitz (it passes ~2 km north
   of it and leaves the frame north-east through the Posoritz post house);
   Raigern, Rausnitz and the post house were drawn inside the frame; the
   Litava did not follow its course; Pratzen village sat on the wrong side of
   the line joining the two summits. Everything here is placed from GEO
   ground truth by an explicit, stated rule. Every edit asserts that its
   target text exists, so nothing is silently skipped.
   ========================================================================= */
const fs=require('fs'), path=require('path');
const GEO=require('../geo.js');
const ROOT=path.join(__dirname,'..');
const R=v=>Math.round(v), RP=p=>[R(p[0]),R(p[1])];
const U=GEO.K;                                  /* map units per true km */
const at=(lat,lon)=>GEO.toMap(lat,lon);
const g=k=>GEO.GT[k].map;
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]], sub=(a,b)=>[a[0]-b[0],a[1]-b[1]], mul=(a,s)=>[a[0]*s,a[1]*s];
const len=v=>Math.hypot(v[0],v[1]), lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
/* move from a place by true km east/north */
function offsetKm(p,eKm,nKm){ const ll=GEO.toGeo(p[0],p[1]); return at(ll[0]+nKm/111.13, ll[1]+eKm/(111.32*Math.cos(49.14*Math.PI/180))); }
/* where a segment a->b crosses the frame edge (0..680 x 0..500) */
function edgeCross(inside,outside){
  let lo=0,hi=1; for(let i=0;i<60;i++){ const m=(lo+hi)/2, p=lerp(inside,outside,m); if(p[0]>=0&&p[0]<=680&&p[1]>=0&&p[1]<=500) lo=m; else hi=m; }
  return lerp(inside,outside,lo);
}
function nearestOnPoly(p,poly){ let best=null,bd=1e9; for(let i=0;i<poly.length-1;i++){ const a=poly[i],b=poly[i+1],v=sub(b,a); const t=Math.max(0,Math.min(1,((p[0]-a[0])*v[0]+(p[1]-a[1])*v[1])/(v[0]*v[0]+v[1]*v[1]))); const q=lerp(a,b,t), d=len(sub(p,q)); if(d<bd){bd=d;best=q;} } return best; }

/* ---------------- the corrected Olmutz highway ---------------- */
const W0=[30,154], W1=[142,128];                     /* western part: warped legacy course, unchanged in meaning */
const S1=offsetKm(g('santon'),0,-0.35);              /* along the Santon's southern foot */
const T1=offsetKm(g('bosenitz'),0,-0.35);            /* past the southern edge of Tvarozna */
const PH=g('posthouse');                             /* the Posoritz post house (approximate) */
const EX=(function(){ const r=g('rausnitz'); const e=edgeCross(PH,r); return lerp(PH,r,(len(sub(e,PH))+8)/len(sub(r,PH))); })();  /* just past the top edge, toward Rausnitz */
const HW=[W0,W1,S1,T1,PH,EX];
/* a point at true distance km along the highway from the Santon's foot, dS km to the south side */
function along(km,dS){
  const poly=[S1,T1,PH,EX]; let d=km*U;
  for(let i=0;i<poly.length-1;i++){ const a=poly[i],b=poly[i+1],v=sub(b,a),L=len(v);
    if(d<=L||i===poly.length-2){ const p=add(a,mul(v,d/L)); const n=[-v[1]/L, v[0]/L]; return RP(add(p,mul(n,(dS||0)*U))); } d-=L; }
}

/* ---------------- the local road from Raigern, and the edge marker ---------------- */
const OTM=at(49.100613,16.672783);                   /* Otmarov: the modern Rajhrad-Otmarov-Telnice road; 1805 course not verified */
const RAIG_EDGE=edgeCross(OTM,g('raigern'));
const RAIG_IN=lerp(RAIG_EDGE,OTM,0.3*U/len(sub(OTM,RAIG_EDGE)));   /* 0.3 km inside the frame */

/* ---------------- the Litava and the Rakovec ---------------- */
const L=[ at(49.1490,16.8950),                       /* upstream, east of Slavkov                     */
          at(49.14976,16.876598),                    /* along the southern edge of Slavkov (jmk.cz)    */
          at(49.1158,16.7873),                       /* past the south-east side of Hostěrádky, right bank village (turistika.cz) */
          g('augezd'),                               /* Újezd                                         */
          g('satschan') ];                           /* Žatčany                                       */
L.push(edgeCross(g('satschan'),at(49.0396,16.6187)));/* toward Židlochovice, where it joins the Svratka */
L.push(lerp(L[4],at(49.0396,16.6187),(len(sub(L[5],L[4]))+10)/len(sub(at(49.0396,16.6187),L[4]))));
const LIT=L.map(RP);
const RAK_JOIN=nearestOnPoly(g('krzenowitz'),[LIT[1],LIT[2]]);
const RAK=[RP(offsetKm(g('krzenowitz'),0,1.5)), RP(g('krzenowitz')), RP(RAK_JOIN)];

/* ---------------- the plateau crest: Stare Vinohrady -> col -> Pratzeberg (PeakVisor key col) ---------------- */
const CREST=[offsetKm(g('vinohrady'),0,0.4), g('vinohrady'), lerp(g('vinohrady'),g('vinocol'),0.5), g('vinocol'),
             lerp(g('vinocol'),g('pratzeberg'),0.5), g('pratzeberg'), offsetKm(g('pratzeberg'),-0.25,-0.35)].map(RP);
const PLAT_C=RP(mul(add(add(g('pratzen'),g('vinohrady')),add(g('vinocol'),g('pratzeberg'))),0.25));

/* ---------------- edit helpers ---------------- */
const files={}; const load=f=>files[f]||(files[f]=fs.readFileSync(path.join(ROOT,f),'utf8'));
const log=[];
function rep(f,oldS,newS,why){ const t=load(f); const i=t.indexOf(oldS); if(i<0) throw new Error('['+f+'] not found for: '+why+'\n  '+oldS.slice(0,120)); if(t.indexOf(oldS,i+1)>=0) throw new Error('['+f+'] ambiguous for: '+why); files[f]=t.slice(0,i)+newS+t.slice(i+oldS.length); log.push(f.padEnd(12)+why); }
function block(id){ const t=load('data.js'); const i=t.indexOf('\n'+id+':{'); if(i<0) throw new Error('no formation '+id); const j=t.indexOf('\n\n',i+1); return [i,j<0?t.length:j]; }
function setP(id,ph,p,why){ const t=load('data.js'); const [i,j]=block(id); const b=t.slice(i,j); const re=new RegExp('(\\n    '+ph+':\\{p:)\\[-?\\d+,-?\\d+\\]'); if(!re.test(b)) throw new Error('no anchor '+id+' ph'+ph);
  files['data.js']=t.slice(0,i)+b.replace(re,'$1['+R(p[0])+','+R(p[1])+']')+t.slice(j); log.push('data.js     '+id+' ph'+ph+' -> ['+RP(p)+']  '+why); }
function setEntry(id,ph,oldEntryStart,newEntry,why){ const t=load('data.js'); const [i,j]=block(id); const b=t.slice(i,j); const k=b.indexOf('\n    '+ph+':{'+oldEntryStart); if(k<0) throw new Error('no entry '+id+' ph'+ph);
  const e=b.indexOf('}',k); files['data.js']=t.slice(0,i)+b.slice(0,k)+'\n    '+ph+':{'+newEntry+'}'+b.slice(e+1)+t.slice(j); log.push('data.js     '+id+' ph'+ph+' entry replaced  '+why); }
const js=p=>'['+R(p[0])+','+R(p[1])+']', jsl=a=>'['+a.map(js).join(',')+']';

/* ================= world.js ================= */
rep('world.js','var UNITS_PER_KM = 26.1;','var UNITS_PER_KM = GEO.UNITS_PER_KM;   /* from geo.js: the only scale */','scale from GEO');
rep('world.js','   1 world unit ~= 38 m - vertical relief exaggerated about 4x','   1 world unit = 2 map units = GEO.M_PER_WORLD m (~63 m); relief exaggeration is GEO.EXAG','header comment');
{ const t=load('world.js'); const a=t.indexOf('var LITAVA_M'), b=t.indexOf('\n',a); files['world.js']=t.slice(0,a)+'var LITAVA_M  ='+jsl(LIT)+';   /* Slavkov south edge -> Hostěrádky -> Újezd -> Žatčany -> toward Židlochovice */'+t.slice(b); log.push('world.js    Litava rerouted from ground truth'); }
{ /* the Goldbach ends at its confluence with the Litava */
  const t=load('world.js'); const a=t.indexOf('var GOLDBACH_M='), b=t.indexOf(';',a); const arr=JSON.parse(t.slice(a+15,b)); const conf=nearestOnPoly(arr[arr.length-1],[LIT[3],LIT[4]]); arr[arr.length-1]=RP(conf);
  files['world.js']=t.slice(0,a)+'var GOLDBACH_M='+JSON.stringify(arr)+t.slice(b); log.push('world.js    Goldbach joins the rerouted Litava at ['+RP(conf)+']'); }
rep('world.js','  [[199,205],[201,239],[201,260]]\n];','  [[199,205],[201,239],[201,260]],\n  '+jsl(RAK)+'   /* the Rakovec through Křenovice to the Litava (turistika.cz); course north of the village schematic */\n];','Rakovec added');
{ const t=load('world.js'); const a=t.indexOf(' {n:"Brunn-Olmutz highway"'), b=t.indexOf(' {n:"Pratzen-Austerlitz road"');
  files['world.js']=t.slice(0,a)+' {n:"Brunn-Olmutz highway", cls:"highway", w:2.9,\n  p:'+jsl(HW)+'},   /* west: legacy course; east of the Santon: past Tvarožná to the Posoritz post house and on toward Rausnitz */\n'+t.slice(b); log.push('world.js    highway rerouted; Vienna post road removed (it runs west of the frame, through Raigern)'); }
/* roads between two villages whose middle vertices crossed a fold zone: keep the legacy shape, re-anchor on the endpoints */
function endpointSimilarity(legacy,A,B){ const a0=legacy[0], a1=legacy[legacy.length-1], v0=sub(a1,a0), v1=sub(B,A);
  const s=len(v1)/len(v0), th=Math.atan2(v1[1],v1[0])-Math.atan2(v0[1],v0[0]), c=Math.cos(th)*s, sn=Math.sin(th)*s;
  return legacy.map(p=>{ const d=sub(p,a0); return RP([A[0]+c*d[0]-sn*d[1], A[1]+sn*d[0]+c*d[1]]); }); }
{ const pa=endpointSimilarity([[372,290],[440,258],[500,228],[560,205]],g('pratzen'),g('austerlitz'));
  rep('world.js',' {n:"Pratzen-Austerlitz road", cls:"post", w:2.0, p:[[276,243],[405,242],[467,196],[507,126]]},',' {n:"Pratzen-Austerlitz road", cls:"post", w:2.0, p:'+jsl(pa)+'},   /* legacy shape re-anchored on its two villages; course unverified */','Pratzen-Austerlitz road re-anchored');
  const kr=endpointSimilarity([[420,180],[396,232],[372,290]],g('krzenowitz'),g('pratzen'));
  rep('world.js',' {n:"Krzenowitz road", cls:"track", w:1.5, p:[[415,196],[366,222],[276,243]]},',' {n:"Krzenowitz road", cls:"track", w:1.5, p:'+jsl(kr)+'},','Krzenowitz road re-anchored'); }
rep('world.js',' {n:"Holubitz-Posoritz track", cls:"track", w:1.3, p:[[340,89],[412,77],[481,50]]},',' {n:"Holubitz-Posoritz track", cls:"track", w:1.3, p:'+jsl([g('holubitz'),lerp(g('holubitz'),PH,0.5),PH])+'},','Holubitz to the post house');
rep('world.js',' {n:"Raigern-Telnitz lane", cls:"track", w:1.2, p:[[56,436],[128,423],[179,411]]}',' {n:"Raigern-Telnitz road", cls:"track", w:1.2, p:'+jsl([RAIG_EDGE,OTM,g('telnitz')])+'}   /* local road via Otmarov; Raigern itself is off the map */','Raigern-Telnitz local road');
rep('world.js',' {c:[561,173], rx:30, ry:22, rot:0.0,  n:170, conifer:0.30},   /* Austerlitz park */',' {c:'+js(add(g('austerlitz'),[44,25]))+', rx:30, ry:22, rot:0.0,  n:170, conifer:0.30},   /* Austerlitz park: legacy offset from the town */','park kept beside the town');
rep('world.js',' {c:[238,360], rx:24, ry:17, rot:0.08, n:190, conifer:0.12},   /* Sokolnitz pheasantry */',' {c:'+js(add(g('sokolnitz'),[28,20]))+', rx:24, ry:17, rot:0.08, n:190, conifer:0.12},   /* Sokolnitz pheasantry: legacy offset from the village */','pheasantry kept beside Sokolnitz');
rep('world.js','    var cc=W(227,341), y=height(cc[0],cc[1]);','    var cc=W('+R(g('sokolnitz')[0]+18)+','+R(g('sokolnitz')[1]-10)+'), y=height(cc[0],cc[1]);   /* legacy offset from the village */','castle kept beside Sokolnitz');
{ const m1=lerp(LIT[2],LIT[3],0.5), m2=lerp(LIT[1],LIT[2],0.6);
  rep('world.js',' {c:[315,384], rx:54, ry:18},   /* Litava bottom */',' {c:'+js(m1)+', rx:30, ry:22},   /* Litava bottom, Hostěrádky to Újezd */','Litava marsh on the river');
  rep('world.js',' {c:[350,358], rx:34, ry:14}\n];',' {c:'+js(m2)+', rx:34, ry:14}   /* Litava bottom below Slavkov */\n];','second Litava marsh on the river'); }
{ /* villages: every surveyed place from GEO; the three places with no survey entry keep their warped legacy position */
  const w=require('./warp.js').warp;   /* pure module: requiring it does not re-run the migration */
  const V=[['Bosenitz','bosenitz',7],['Girzikowitz','girzikowitz',9],['Puntowitz','puntowitz',8],['Kobelnitz','kobelnitz',9],['Sokolnitz','sokolnitz',13],['Telnitz','telnitz',12],
    ['Augezd','augezd',9],['Blasowitz','blasowitz',10],['Krug',w(350,140),5],['Holubitz','holubitz',7],['Pratzen','pratzen',11],['Bellowitz',w(150,120),7],['Schlapanitz','schlapanitz',9],
    ['Krzenowitz','krzenowitz',10],['Austerlitz','austerlitz',24],['Menitz','menitz',7],['Satschan','satschan',7],['Turas',w(96,372),5],['Hostieradek','hostieradek',7],['Posoritz post house','posthouse',3]];
  const rows=V.map(v=>{ const p=typeof v[1]==='string'?g(v[1]):v[1]; return '["'+v[0]+'",'+R(p[0])+','+R(p[1])+','+v[2]+']'; });
  const t=load('world.js'); const a=t.indexOf('var VILLAGES=['), b=t.indexOf('];',a)+2;
  let out='var VILLAGES=[   /* from GEO ground truth; Krug, Bellowitz and Turas are not in the register and keep their warped legacy place.\n                    Raigern, Rausnitz and Kowalowitz lie beyond the frame and are shown as edge markers */\n';
  for(let i=0;i<rows.length;i+=3) out+=' '+rows.slice(i,i+3).join(',')+(i+3<rows.length?',':'')+'\n';
  files['world.js']=t.slice(0,a)+out+'];'+t.slice(b); log.push('world.js    villages regenerated from GEO'); }
rep('world.js','  "Pratzen","Schlapanitz","Krzenowitz","Austerlitz","Posoritz","Bosenitz","Holubitz"];','  "Pratzen","Schlapanitz","Krzenowitz","Austerlitz","Bosenitz","Holubitz"];','no church at the post house');
{ const t=load('world.js'); const a=t.indexOf(' {t:"ridge", n:"Pratzen crest", p:'), b=t.indexOf(']],',a)+2;
  files['world.js']=t.slice(0,a)+' {t:"ridge", n:"Pratzen crest", p:'+jsl(CREST)+t.slice(b); log.push('world.js    crest: Stare Vinohrady -> col -> Pratzeberg'); }
rep('world.js',' {t:"ridge", n:"Santon spur", p:[[208,70],[222,87],[237,72]],',' {t:"ridge", n:"Santon spur", p:'+jsl([add(g('santon'),[-9,-7]),g('santon'),add(g('santon'),[5,7])])+',','Santon spur re-centred on the summit, clear of Bosenitz and the road');
{ const t=load('world.js'); const a=t.indexOf(' {t:"valley", n:"Litava bottom", p:'), b=t.indexOf(']],',a)+2;
  files['world.js']=t.slice(0,a)+' {t:"valley", n:"Litava bottom", p:'+jsl(LIT.slice(1,5))+t.slice(b); log.push('world.js    Litava bottom follows the river'); }
{ const t=load('world.js'); const a=t.indexOf(' {t:"defile", n:"Augezd defile", p:'), b=t.indexOf(']],',a)+2;
  files['world.js']=t.slice(0,a)+' {t:"defile", n:"Augezd defile", p:'+jsl([g('augezd'),lerp(g('augezd'),g('satschan'),0.5),g('satschan')])+t.slice(b); log.push('world.js    Augezd defile: Augezd to Satschan over the pond embankment'); }
rep('world.js','var PRAT=W(317,228),','var PRAT=W('+PLAT_C[0]+','+PLAT_C[1]+'),','plateau relief centred on the plateau (mean of Pratzen, Stare Vinohrady, the col and the Pratzeberg)');

/* ================= data.js: anchors tied to the road, Raigern, the chapel, Krzenowitz ================= */
[[0,along(3.4,0.3)],[5,along(1.5,0)],[6,along(2.3,0)],[7,along(3.0,0)],[8,along(4.2,0)],[9,along(5.2,0)]].forEach(([ph,p])=>setP('bag',ph,p,'on the corrected highway'));
[[0,along(0,0)],[5,along(0.8,0)],[6,along(1.6,0)],[7,along(2.3,0)],[8,along(3.2,0)],[9,along(3.6,0)]].forEach(([ph,p])=>setP('suchet',ph,p,'astride the corrected highway'));
setP('friant',0,RAIG_IN,'at the map edge on the road from Raigern (Raigern itself off the map)');
setP('bourcier',0,add(RAIG_IN,[-4,-6]),'beside Friant at the map edge');
setP('gqg',8,add(g('chapel'),[3,-2]),'the St Anthony chapel above Augezd');
setP('heightguns',8,add(g('chapel'),[-3,3]),'the battery at the St Anthony chapel');
setP('heightguns',9,add(g('chapel'),[-3,3]),'the battery at the St Anthony chapel');
setP('ahq',0,offsetKm(g('krzenowitz'),-0.25,0),'Kutuzov\'s headquarters at Krzenowitz overnight');
setP('sthilaire',8,add(g('sokolnitz'),[28,-13]),'against Sokolnitz from the east');
setP('sthilaire',9,lerp(g('telnitz'),g('augezd'),0.5),'between Telnitz and Augezd');
setEntry('kamensky',7,'p:null','p:'+js(offsetKm(g('pratzeberg'),0.4,-0.6))+',st:"retreating",cf:"C",act:"Broken; withdraws off the plateau. Its route after this point is not documented: it is shown falling back toward Augezd, the Allied left\'s line of retreat (reconstruction)"','kept on the map');
{ const t=load('data.js'); const [i,j]=block('kamensky'); const b=t.slice(i,j); const k=b.lastIndexOf('}}}'); if(k<0) throw new Error('kamensky end');
  files['data.js']=t.slice(0,i)+b.slice(0,k)+'},\n    8:{p:'+js(offsetKm(g('augezd'),0.35,0.55))+',st:"retreating",cf:"C"}}}'+b.slice(k+3)+t.slice(j); log.push('data.js     kamensky ph8 added near Augezd (C)'); }
/* features that are positions of named places */
function featP(id,p){ const t=load('data.js'); const re=new RegExp('(\\{id:"'+id+'",\\s*p:)\\[-?\\d+,-?\\d+\\]'); if(!re.test(t)) throw new Error('feature '+id); files['data.js']=t.replace(re,'$1'+js(p)); log.push('data.js     feature '+id+' -> '+js(p)); }
featP('pratzen',PLAT_C); featP('litava',lerp(LIT[1],LIT[2],0.45)); featP('olmutzroad',along(1.2,-0.3)); featP('viennaroad',RAIG_EDGE);

/* ================= analysis.js: the plans on the highway ================= */
{ const t=load('analysis.js'); const a=t.indexOf('n:"Advance Guard of the Right - Bagration"'); const o=t.indexOf('obj:',a), oe=t.indexOf(']',o)+1, r=t.indexOf('route:',a), re=t.indexOf(']]',r)+2;
  let s=t.slice(0,o)+'obj:'+js(along(1.2,0))+t.slice(oe,r)+'route:'+jsl([along(3.4,0),along(2.6,0),along(1.9,0),along(1.2,0)])+t.slice(re); files['analysis.js']=s; log.push('analysis.js Bagration plan on the highway'); }
{ const t=load('analysis.js'); const a=t.indexOf('n:"The pivot - Lannes and Murat"'); const o=t.indexOf('obj:',a), oe=t.indexOf(']',o)+1, r=t.indexOf('route:',a), re=t.indexOf(']]',r)+2;
  files['analysis.js']=t.slice(0,o)+'obj:'+js(along(3.0,0))+t.slice(oe,r)+'route:'+jsl([along(0,0),along(1.0,0),along(2.0,0),along(3.0,0)])+t.slice(re); log.push('analysis.js Lannes plan along the highway'); }

/* ================= app.js overlays on the highway ================= */
rep('app.js','{pts:[[222,100],[251,102],[272,109]],kind:"attack",side:"fr",label:"Suchet"}','{pts:'+jsl([along(0.1,0),along(0.5,0),along(0.9,0)])+',kind:"attack",side:"fr",label:"Suchet"}','Suchet arrow on the road');
rep('app.js','{pts:[[379,95],[344,101],[327,103]],kind:"attack",side:"al",label:"Bagration"}','{pts:'+jsl([along(2.6,0),along(2.0,0),along(1.5,0)])+',kind:"attack",side:"al",label:"Bagration"}','Bagration arrow on the road');
rep('app.js','{pts:[[423,88],[473,72],[518,57]],kind:"retreat",side:"al",label:"Bagration withdraws on Rausnitz"}','{pts:'+jsl([along(3.0,0),along(3.9,0),along(4.8,0)])+',kind:"retreat",side:"al",label:"Bagration withdraws on Rausnitz"}','Bagration withdrawal on the road');

Object.keys(files).forEach(f=>fs.writeFileSync(path.join(ROOT,f),files[f],'utf8'));
console.log(log.join('\n'));
console.log('\nhighway '+JSON.stringify(HW.map(RP))+'\nLitava  '+JSON.stringify(LIT)+'\nRakovec '+JSON.stringify(RAK)+'\ncrest   '+JSON.stringify(CREST)+'\nRaigern edge '+JSON.stringify(RP(RAIG_EDGE))+' ('+GEO.kmBetween(RAIG_EDGE,g('raigern')).toFixed(1)+' km to Raigern), Otmarov '+JSON.stringify(RP(OTM))+
  '\nhighway leaves the frame at '+JSON.stringify(RP(edgeCross(PH,g('rausnitz'))))+' ('+GEO.kmBetween(edgeCross(PH,g('rausnitz')),g('rausnitz')).toFixed(1)+' km to Rausnitz)');
module.exports={along,HW,LIT,RAIG_EDGE,PH};
