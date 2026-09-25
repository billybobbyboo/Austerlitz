/* geo-test.js - geographic and scale integrity, against the live code.
   Loads geo.js, the live world.js (through _world_mod.js, regenerated from world.js),
   data.js, analysis.js, and reads app.js as text for scale and bearing usage.
   Every threshold is in true distance or true elevation. */
const fs=require('fs');
require('child_process').execSync('node tools/mk-world-mod.js',{stdio:'ignore'});
const G=require('./geo.js'); global.GEOREF=G;
const M=require('./_world_mod.js'); M.buildCover(); M.buildGrid();
global.window={}; eval(fs.readFileSync('data.js','utf8')); eval(fs.readFileSync('analysis.js','utf8'));
const APP=fs.readFileSync('app.js','utf8'), WORLD=fs.readFileSync('world.js','utf8');
let pass=0, fail=0; const bad=[];
function check(name,ok,detail){ if(ok) pass++; else { fail++; bad.push(name+(detail?': '+detail:'')); } console.log((ok?'  ok   ':'  FAIL ')+name+(detail?'  ('+detail+')':'')); }
const km=(a,b)=>G.kmBetween(a,b);
function segDistKm(p,poly){ let d=1e9; for(let i=0;i<poly.length-1;i++){ const a=poly[i],b=poly[i+1],vx=b[0]-a[0],vy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*vx+(p[1]-a[1])*vy)/(vx*vx+vy*vy))); d=Math.min(d,Math.hypot(p[0]-a[0]-t*vx,p[1]-a[1]-t*vy)); } return d*G.KM_PER_MAP; }
const toMap=pw=>[pw[0]*2+340,pw[1]*2+250];

console.log('-- transform --');
const AUD={pratzen:[276,243],pratzeberg:[285,289],vinohrady:[313,205],austerlitz:[507,126],augezd:[297,372],satschan:[262,444],
  schlapanitz:[163,177],sokolnitz:[208,365],kobelnitz:[205,277],zuran:[177,134],santon:[222,87],hostieradek:[342,309]};
let worstA=0; Object.keys(AUD).forEach(k=>worstA=Math.max(worstA,km(G.GT[k].map,AUD[k])));
check('the audited map positions are reproduced by the transform', worstA<0.03, 'worst '+(worstA*1000).toFixed(0)+' m, rounding only');
let rt=0; Object.values(G.GT).forEach(g=>{ const b=G.toGeo(g.map[0],g.map[1]); rt=Math.max(rt,Math.abs(b[0]-g.lat)*111130,Math.abs(b[1]-g.lon)*72900); });
check('geo -> map -> geo round trip is exact', rt<0.01, rt.toExponential(1)+' m');
check('scale: 31.65 map units per true km (0.0316 km per unit)', Math.abs(G.K-31.647)<0.01 && Math.abs(G.KM_PER_MAP-0.03160)<0.00002, G.KM_PER_MAP.toFixed(5)+' km/unit');
check('frame rotation 17.4 degrees', Math.abs(G.ROT_DEG-17.42)<0.05, G.ROT_DEG.toFixed(2)+' deg');
check('true north vector matches the rotation', Math.abs(G.NORTH[0]+Math.sin(G.ROT_DEG*Math.PI/180))<1e-9 && Math.abs(G.NORTH[1]+Math.cos(G.ROT_DEG*Math.PI/180))<1e-9);
check('true bearing Pratzen -> Pratzeberg is south (186 deg)', Math.abs(G.bearingDeg(G.GT.pratzen.map,G.GT.pratzeberg.map)-186)<2, G.bearingDeg(G.GT.pratzen.map,G.GT.pratzeberg.map).toFixed(0)+' deg');
check('Pratzeberg is about 1.46 km from Pratzen village', Math.abs(km(G.GT.pratzen.map,G.GT.pratzeberg.map)-1.46)<0.05, km(G.GT.pratzen.map,G.GT.pratzeberg.map).toFixed(2)+' km');

console.log('-- one scale --');
check('world.js takes UNITS_PER_KM from GEOREF', /var UNITS_PER_KM = GEOREF\.UNITS_PER_KM;/.test(WORLD) && Math.abs(M.UNITS_PER_KM-G.UNITS_PER_KM)<1e-12);
check('app.js takes KM_PER_MAP from GEOREF', /var KM_PER_MAP=GEOREF\.KM_PER_MAP;/.test(APP));
const stale=[]; [['app.js',APP],['world.js',WORLD],['redteam.js',fs.readFileSync('redteam.js','utf8')],['sim-test.js',fs.readFileSync('sim-test.js','utf8')],['audit.js',fs.readFileSync('audit.js','utf8')]]
  .forEach(([f,t])=>{ (t.match(/0\.019\d*|\b26\.1\b/g)||[]).forEach(m=>stale.push(f+':'+m)); });
check('no hard-coded legacy scale constants anywhere', stale.length===0, stale.join(', '));
check('the sources text derives the exaggeration, never types it', SOURCE_NOTE.body.some(p=>/\{EXAG\}/.test(p)) && !JSON.stringify(SOURCE_NOTE).match(/fivefold/i));
check('vertical exaggeration derived from the two scales', Math.abs(G.EXAG-G.M_PER_WORLD/G.V_M_PER_UNIT)<1e-9 && G.EXAG>8 && G.EXAG<13, G.EXAG.toFixed(1)+'x');
check('the location descriptor uses true distance and true bearing', /GEOREF\.kmBetween\(best\.p,p\)/.test(APP) && /GEOREF\.compass8\(GEOREF\.bearingDeg\(best\.p,p\)\)/.test(APP) && !/bd\*0\.019/.test(APP));
check('the compass rose is driven by true north', /function updateRose\(\)/.test(APP) && /GEOREF\.NORTH\[0\]/.test(APP) && /updateScaleBar\(\); updateRose\(\);/.test(APP));

console.log('-- places --');
const V={}; M.VILLAGES.forEach(v=>V[v[0]]=[v[1],v[2]]);
let worstV=0, wv=''; Object.keys(G.GT).filter(k=>G.GT[k].kind==='v'&&!G.GT[k].offmap).forEach(k=>{ const v=V[G.GT[k].n]; const d=v?km(v,G.GT[k].map):9; if(d>worstV){worstV=d;wv=G.GT[k].n;} });
check('every surveyed village within 0.5 km of ground truth', worstV<0.5, 'worst '+wv+' '+(worstV*1000).toFixed(0)+' m');
check('Raigern, Rausnitz and Kowalowitz are not drawn inside the frame', !V.Raigern && !V.Rausnitz && !V.Kowalowitz && !V.Posoritz);
check('Hostieradek and the Posoritz post house are present', !!V.Hostieradek && !!V['Posoritz post house'] && km(V['Posoritz post house'],G.GT.posthouse.map)<0.05);
const F={}; FEATURES.forEach(f=>F[f.id]=f);
let worstF=0, wf=''; [['telnitz','telnitz'],['sokolnitz','sokolnitz'],['kobelnitz','kobelnitz'],['pratzenv','pratzen'],['puntowitz','puntowitz'],['girzikowitz','girzikowitz'],['blasowitz','blasowitz'],['augezd','augezd'],['austerlitz','austerlitz'],['krzenowitz','krzenowitz'],['vinohrady','vinohrady'],['pratzeberg','pratzeberg'],['santon','santon'],['zuran','zuran'],['chapel','chapel'],['posthouse','posthouse']]
  .forEach(([fid,k])=>{ const d=F[fid]?km(F[fid].p,G.GT[k].map):9; if(d>worstF){worstF=d;wf=fid;} });
check('feature markers of named places within 0.5 km of ground truth', worstF<0.5, 'worst '+wf+' '+(worstF*1000).toFixed(0)+' m');
const onEdge=p=>p[0]<=2||p[0]>=678||p[1]<=8||p[1]>=498;
check('Raigern and Rausnitz are shown as markers at the frame edge', onEdge(F.viennaroad.p) && onEdge(F.rausnitz.p), JSON.stringify(F.viennaroad.p)+' '+JSON.stringify(F.rausnitz.p));

console.log('-- water --');
const LIT=M.LITAVA.map(toMap), GB=M.GOLDBACH.map(toMap), RAK=M.BROOKS[M.BROOKS.length-1].map(toMap);
[['augezd',0.1],['satschan',0.1],['hostieradek',0.5]].forEach(([k,t])=>check('the Litava passes '+G.GT[k].n+' (within '+t+' km)',segDistKm(G.GT[k].map,LIT)<=t,(segDistKm(G.GT[k].map,LIT)*1000).toFixed(0)+' m'));
check('the Litava runs along the southern edge of Austerlitz (0.2-0.8 km from the centre)', segDistKm(G.GT.austerlitz.map,LIT)>0.2 && segDistKm(G.GT.austerlitz.map,LIT)<0.8, (segDistKm(G.GT.austerlitz.map,LIT)*1000).toFixed(0)+' m');
check('Krzenowitz stands on the Rakovec, not the Litava', segDistKm(G.GT.krzenowitz.map,RAK)<0.1 && segDistKm(G.GT.krzenowitz.map,LIT)>0.5, 'Rakovec '+(segDistKm(G.GT.krzenowitz.map,RAK)*1000).toFixed(0)+' m, Litava '+(segDistKm(G.GT.krzenowitz.map,LIT)*1000).toFixed(0)+' m');
['puntowitz','kobelnitz','sokolnitz','telnitz'].forEach(k=>check('the Goldbach passes '+G.GT[k].n+' (within 0.5 km)',segDistKm(G.GT[k].map,GB)<0.5,(segDistKm(G.GT[k].map,GB)*1000).toFixed(0)+' m'));

console.log('-- roads --');
const HW=M.ROADS.find(r=>r.cls==='highway').p;
const dS=segDistKm(G.GT.santon.map,HW);
check('the Olmutz highway passes the Santon\'s southern foot (0.2-0.6 km from the summit)', dS>=0.2&&dS<=0.6, (dS*1000).toFixed(0)+' m');
check('the highway runs through the Posoritz post house', segDistKm(G.GT.posthouse.map,HW)<0.05);
check('the highway leaves the frame north-east, toward Rausnitz', HW[HW.length-1][1]<0 && G.bearingDeg(HW[HW.length-2],HW[HW.length-1])>45 && G.bearingDeg(HW[HW.length-2],HW[HW.length-1])<90, 'true bearing '+G.bearingDeg(HW[HW.length-2],HW[HW.length-1]).toFixed(0)+' deg');
check('Holubitz lies well south of the highway (> 1.5 km)', segDistKm(G.GT.holubitz.map,HW)>1.5, (segDistKm(G.GT.holubitz.map,HW)).toFixed(2)+' km');
check('no "Vienna post road" inside the frame', !M.ROADS.some(r=>/Vienna/.test(r.n)));
const RT=M.ROADS.find(r=>/Raigern-Telnitz/.test(r.n));
check('the Raigern-Telnitz road runs from the frame edge to Telnitz', !!RT && onEdge(RT.p[0]) && km(RT.p[RT.p.length-1],G.GT.telnitz.map)<0.05);

console.log('-- terrain anchors (m) --');
const mAt=k=>G.elevM(M.hAt(G.GT[k].map[0],G.GT[k].map[1]));
[['pratzeberg',324,5],['vinohrady',294,6],['santon',296,6],['zuran',290,6],['bosenitz',257,8],['kobelnitz',211,6],['sokolnitz',207,6],['telnitz',195,8],['augezd',195,8],['krzenowitz',210,8]]
  .forEach(([k,t,tol])=>check(G.GT[k].n+' '+t+' m (within '+tol+')',Math.abs(mAt(k)-t)<=tol,mAt(k).toFixed(0)+' m'));
check('Austerlitz within its sourced 200-237 m range', mAt('austerlitz')>=200 && mAt('austerlitz')<=237, mAt('austerlitz').toFixed(0)+' m');
check('the Pratzeberg is the highest ground, 25+ m above Santon, Stare Vinohrady and Zuran', mAt('pratzeberg')-Math.max(mAt('santon'),mAt('vinohrady'),mAt('zuran'))>=25);
check('Pratzen village lies below the crest it sits beside', mAt('pratzen')<mAt('vinocol') && mAt('pratzen')<mAt('vinohrady'));

console.log('-- re-anchored positions --');
const P=(id,ph)=>FORMATIONS[id].track[ph].p;
check('Napoleon starts on the Zuran', km(P('gqg',0),G.GT.zuran.map)<0.1, (km(P('gqg',0),G.GT.zuran.map)*1000).toFixed(0)+' m');
check('Napoleon moves to Stare Vinohrady (no chapel there)', km(P('gqg',6),G.GT.vinohrady.map)<0.3, (km(P('gqg',6),G.GT.vinohrady.map)*1000).toFixed(0)+' m');
check('Napoleon ends at the St Anthony chapel above Augezd', km(P('gqg',8),G.GT.chapel.map)<0.3, (km(P('gqg',8),G.GT.chapel.map)*1000).toFixed(0)+' m');
check('the Allied HQ is at Krzenowitz at 04:00', km(P('ahq',0),G.GT.krzenowitz.map)<0.5, (km(P('ahq',0),G.GT.krzenowitz.map)*1000).toFixed(0)+' m');
check('Friant starts at the frame edge on the road from Raigern', segDistKm(P('friant',0),RT.p)<0.1 && km(P('friant',0),RT.p[0])<0.5);
const suchetOn=[0,5,6,7,8,9].every(ph=>segDistKm(P('suchet',ph),HW)<0.1), bagOn=[5,6,7,8,9].every(ph=>segDistKm(P('bag',ph),HW)<0.1);
check('Suchet and Bagration are plotted on the corrected highway', suchetOn && bagOn && segDistKm(P('bag',0),HW)<0.4);
check('no Allied formation stands in Pratzen village after the French cleared it (09:00)',
  Object.keys(FORMATIONS).filter(id=>FORMATIONS[id].nation!=='fr'&&FORMATIONS[id].track).every(id=>Object.keys(FORMATIONS[id].track).map(Number).filter(ph=>ph>=4).every(ph=>{ const e=FORMATIONS[id].track[ph]; return !e.p||km(e.p,G.GT.pratzen.map)>0.3; })));

console.log('\ngeo-test: '+pass+' passed, '+fail+' failed');
if(fail){ bad.forEach(b=>console.log('  ! '+b)); process.exitCode=1; }
