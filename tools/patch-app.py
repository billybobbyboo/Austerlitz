import sys
p='/home/claude/aus2/app.js'; s=open(p,encoding='utf-8').read()
def rep(old,new,why,count=1):
    global s
    if s.count(old)!=count: sys.exit('FAIL ('+str(s.count(old))+' matches, expected '+str(count)+'): '+why)
    s=s.replace(old,new); print('ok   '+why+('' if count==1 else ' (x'+str(count)+')'))

# ---------- 1. one scale ----------
rep('var KM_PER_MAP=0.01916;          /* one map unit on the ground */',
    'var KM_PER_MAP=GEO.KM_PER_MAP;   /* one map unit on the ground: from geo.js, the only scale */','scale from GEO')

# ---------- 2. the leaf rule and interpolation-aware confidence ----------
rep('''function aggConf(id,ph){
  var f=FORMATIONS[id];
  if(f.track){ var s=stateAt(id,ph); return s?s.cf:"B"; }
  var worst="A";
  leavesOf(id,[]).forEach(function(k){
    var s2=stateAt(k,ph); if(!s2) return;
    if(s2.cf==="C") worst="C"; else if(s2.cf==="B"&&worst!=="C") worst="B";
  });
  return worst;
}''','''/* ---- the leaf rule: troops are counted once ----
   A formation's own troops are its strength less the strength of every
   subordinate formation that is itself on the field (tracked and active)
   at that moment. Command-only formations (arm "hq") carry no troops of
   their own. Every battlefield total goes through ownStrengthAt, so any
   future parent/child hierarchy obeys the rule without special cases. */
function trackedDescendants(id,out){
  out=out||[];
  (FORMATIONS[id].children||[]).forEach(function(k){ if(FORMATIONS[k].track) out.push(k); trackedDescendants(k,out); });
  return out;
}
function activeAt(id,t){ return !!FORMATIONS[id].track && !notYetAt(id,t) && !goneAt(id,t); }
function ownStrengthAt(id,t){
  var f=FORMATIONS[id];
  if(!f.track||f.arm==="hq") return 0;
  var s=f.strength||0;
  trackedDescendants(id).forEach(function(k){ if(activeAt(k,t)) s-=(FORMATIONS[k].strength||0); });
  return Math.max(0,s);
}
function sideOnFieldAt(side,t){
  var tot=0;
  Object.keys(FORMATIONS).forEach(function(id){
    if((FORMATIONS[id].nation==="fr")!==(side==="fr")) return;
    if(activeAt(id,t)) tot+=ownStrengthAt(id,t);
  });
  return tot;
}

/* ---- confidence of a position ----
   A plotted position between two anchors is an interpolation. It is graded
   no better than the weaker of the two anchors it lies between. */
var GRADE_RANK={A:0,B:1,C:2};
function worseGrade(a,b){ return (GRADE_RANK[a]||0)>=(GRADE_RANK[b]||0)?a:b; }
function confAt(id,t){
  var f=FORMATIONS[id]; if(!f.track) return null;
  var s=stateAt(id,phaseAt(t)), cf=s?s.cf:"B";
  var L=(typeof legAt==="function")?legAt(id,t):null;
  if(L&&L.b&&L.u>0&&L.u<1){
    var ca=stateAt(id,L.a.ph), cb=stateAt(id,L.b.ph);
    return {cf:worseGrade(worseGrade(ca?ca.cf:"B",cb?cb.cf:"B"),cf), interp:true};
  }
  return {cf:cf, interp:false};
}
function liveConf(id,ph){
  var live=(typeof clock!=="undefined" && typeof phaseAt==="function" && ph===phaseAt(clock));
  if(live) return confAt(id,clock);
  var s=stateAt(id,ph); return {cf:s?s.cf:"B", interp:false};
}
function aggConf(id,ph){
  var f=FORMATIONS[id];
  if(f.track) return liveConf(id,ph).cf;
  var worst="A";
  leavesOf(id,[]).forEach(function(k){ worst=worseGrade(worst,liveConf(k,ph).cf); });
  return worst;
}
function aggInterp(id,ph){
  var f=FORMATIONS[id];
  if(f.track) return liveConf(id,ph).interp;
  return leavesOf(id,[]).some(function(k){ return liveConf(k,ph).interp; });
}''','leaf rule + interpolation-aware confidence')

# ---------- 3. the plateau outline: a polygon over the real plateau ----------
rep('''var PRATZEN_C=[348,238], PRATZEN_RX=100, PRATZEN_RY=120;
function onPlateau(mp){
  var a=(mp[0]-PRATZEN_C[0])/PRATZEN_RX, b=(mp[1]-PRATZEN_C[1])/PRATZEN_RY;
  return a*a+b*b<=1;
}
function plateauStrength(side){
  var tot=0;
  Object.keys(units).forEach(function(id){
    var f=FORMATIONS[id];
    if(!f.strength) return;
    var isFr=(f.nation==="fr");
    if((side==="fr")!==isFr) return;
    var p=posNow(id);
    if(p&&onPlateau(p)) tot+=f.strength;
  });
  return tot;
}''','''/* The plateau outline: encloses Pratzen village, Stare Vinohrady, the col
   and the Pratzeberg, and excludes every surrounding village (Blasowitz,
   Girzikowitz, Puntowitz, Kobelnitz, Sokolnitz, Augezd, Hostieradek,
   Krzenowitz). A drawing decision for a derived reading, not a surveyed edge. */
var PLATEAU_POLY=[[250,226],[262,200],[298,183],[336,187],[356,222],[358,272],[326,302],[300,318],[266,306],[248,272]];
function onPlateau(mp){
  var inside=false, P=PLATEAU_POLY;
  for(var i=0,j=P.length-1;i<P.length;j=i++){
    if(((P[i][1]>mp[1])!==(P[j][1]>mp[1])) && (mp[0] < (P[j][0]-P[i][0])*(mp[1]-P[i][1])/(P[j][1]-P[i][1])+P[i][0])) inside=!inside;
  }
  return inside;
}
/* Derived reading: men of one side standing on the plateau, counted once
   (the leaf rule), from plotted - not documented - positions. */
function plateauStrength(side){
  var tot=0;
  Object.keys(units).forEach(function(id){
    var f=FORMATIONS[id];
    if((side==="fr")!==(f.nation==="fr")) return;
    var own=ownStrengthAt(id,clock); if(!own) return;
    var p=posNow(id);
    if(p&&onPlateau(p)) tot+=own;
  });
  return tot;
}''','plateau polygon + leaf-rule plateau strength')
rep('''    if(which==="south"&&p[1]<300) return;
    if(which==="north"&&p[1]>=300) return;''','''    var dn=GEO.northingKm(p[0],p[1])-PBERG_NORTHING;   /* true north/south of the Pratzeberg */
    if(which==="south"&&dn>0) return;
    if(which==="north"&&dn<=0) return;''','north/south by true northing')
rep('function sideCentroid(side,which){','var PBERG_NORTHING=GEO.GT.pratzeberg?GEO.northingKm(GEO.GT.pratzeberg.map[0],GEO.GT.pratzeberg.map[1]):0;\nvar SEP_KM=1.45;   /* how close to the line a French formation must stand to separate the two groups */\nfunction sideCentroid(side,which){','constants for the separation reading')
rep('    if(Math.hypot(p[0]-qx,p[1]-qy)<46) cut=true;','    if(Math.hypot(p[0]-qx,p[1]-qy)*KM_PER_MAP<SEP_KM) cut=true;','separation threshold in true km')

# ---------- 4. line of sight with eye heights in metres ----------
rep('''function hasLOS(aMap,bMap,eyeA,eyeB){
  var wa=W(aMap[0],aMap[1]), wb=W(bMap[0],bMap[1]);
  var ha=height(wa[0],wa[1])+(eyeA||2.2), hb=height(wb[0],wb[1])+(eyeB||1.6);''','''/* Heights above ground are real metres converted through the vertical scale:
   a mounted observer's eye (3 m) and the top of a formed body - heads,
   bayonets, standards (2.5 m). The relief is exaggerated but uniformly, and a
   uniform vertical scale does not change what can be seen; only these offsets
   must be converted. */
var EYE_OBSERVER_M=3.0, EYE_TARGET_M=2.5, LOS_CLEAR_M=0.5;
function hasLOS(aMap,bMap,eyeA,eyeB){
  var wa=W(aMap[0],aMap[1]), wb=W(bMap[0],bMap[1]);
  var ha=height(wa[0],wa[1])+(eyeA||GEO.unitsFromM(EYE_OBSERVER_M)), hb=height(wb[0],wb[1])+(eyeB||GEO.unitsFromM(EYE_TARGET_M));''','LOS eye heights in metres')
rep('    if(height(wa[0]+dx*t, wa[1]+dz*t) > ha+(hb-ha)*t+0.4) return false;','    if(height(wa[0]+dx*t, wa[1]+dz*t) > ha+(hb-ha)*t+GEO.unitsFromM(LOS_CLEAR_M)) return false;','LOS clearance in metres')

# ---------- 5. plateau ring draws the polygon ----------
rep('''  var pts=[];
  for(var a=0;a<=72;a++){
    var th=a/72*Math.PI*2;
    var mx=PRATZEN_C[0]+Math.cos(th)*PRATZEN_RX, my=PRATZEN_C[1]+Math.sin(th)*PRATZEN_RY;
    var w=W(mx,my);
    pts.push(w[0],height(w[0],w[1])+1.6,w[1]);
  }''','''  var pts=[], P=PLATEAU_POLY.concat([PLATEAU_POLY[0]]);
  for(var a=0;a<P.length-1;a++) for(var k=0;k<8;k++){
    var mx=P[a][0]+(P[a+1][0]-P[a][0])*k/8, my=P[a][1]+(P[a+1][1]-P[a][1])*k/8;
    var w=W(mx,my);
    pts.push(w[0],height(w[0],w[1])+1.6,w[1]);
  }
  var w0=W(P[0][0],P[0][1]); pts.push(w0[0],height(w0[0],w0[1])+1.6,w0[1]);''','ring follows the polygon')
rep('  var c=W(PRATZEN_C[0],PRATZEN_C[1]-PRATZEN_RY*0.62);','  var c=W(298,196);   /* label on the northern part of the outline */','ring label position')

# ---------- 6. location descriptor in true km and true bearing ----------
rep('''  if(bd<16) return best.name;
  var dx=p[0]-best.p[0], dy=p[1]-best.p[1];
  var ns = Math.abs(dy)>7 ? (dy<0?"north":"south") : "";
  var ew = Math.abs(dx)>7 ? (dx<0?"west":"east") : "";
  var dir = (ns+(ns&&ew?"-":"")+ew) || "near";
  var km=(bd*0.019).toFixed(1);
  return km+" km "+dir+" of "+best.name;''','''  var km=GEO.kmBetween(best.p,p);
  if(km<0.5) return best.name;
  return km.toFixed(1)+" km "+GEO.compass8(GEO.bearingDeg(best.p,p))+" of "+best.name;   /* true bearing, not map axes */''','location descriptor: true km and bearing')

# ---------- 7. strength ranges and army totals on the card ----------
rep('''  if(str) body+=row("Strength","&asymp; "+str.toLocaleString()+" men"+(f.guns?", "+f.guns+" guns":""));''','''  if(f.army) body+=row("Army total", esc(f.army.men)+", "+f.army.guns+" guns <span class=\\"hh\\">("+esc(f.army.src)+")</span>");
  else if(f.strengthRange) body+=row("Strength","&asymp; "+f.strengthRange[0].toLocaleString()+"&ndash;"+f.strengthRange[1].toLocaleString()+" men <span class=\\"hh\\">(working figure "+str.toLocaleString()+")</span>"+(f.guns?", "+f.guns+" guns":""));
  else if(str) body+=row("Strength","&asymp; "+str.toLocaleString()+" men"+(f.guns?", "+f.guns+" guns":""));''','strength ranges and army totals')
rep('''  pills+='<span class="pill ghost">Position '+esc(cf)+'</span>';''','''  pills+='<span class="pill ghost">Position '+esc(cf)+(aggInterp(id,curPhase)?' &middot; interpolated':'')+'</span>';''','interpolated flag on the card',2)
rep('''  wrap.appendChild(el("p","conf",esc(CLAIM[cl].note)+" "+esc(CONF_TEXT[cf]||"")));''','''  wrap.appendChild(el("p","conf",esc(CLAIM[cl].note)+" "+esc(CONF_TEXT[cf]||"")+(aggInterp(id,curPhase)?" "+esc(CONF_INTERP):"")));''','interpolation note in the dossier')
rep('var CONF_TEXT={A:"Position documented in the sources.",','var CONF_INTERP="The formation is between two plotted anchors: this position is interpolated, and graded no better than the weaker anchor.";\nvar CONF_TEXT={A:"Position documented in the sources.",','interpolation note text')

# ---------- 8. blocks: a detachment is not drawn twice; an attached battery; a mixed column ----------
rep('''    if(cav){
      figMesh(K.horse,0xFFFFFF,pts,0.10); figMesh(K.rider,coat,pts,0.10); figMesh(K.riderFixed,0xFFFFFF,pts,0.10);
    } else {
      figMesh(K.infCoat,coat,pts,0.14); figMesh(K.infFixed,0xFFFFFF,pts,0.14);''','''    ud.perBat=files*ranks; ud.nBat=n; ud.batFigs=[];
    if(cav){
      figMesh(K.horse,0xFFFFFF,pts,0.10); var rid=figMesh(K.rider,coat,pts,0.10); figMesh(K.riderFixed,0xFFFFFF,pts,0.10);
      ud.batFigs=ud.figs.slice(-3);
      if(f.mix){   /* a mixed column: a share of the riders in the second nation's coat */
        var mc=lin(parseInt(NATION[f.mix.nation].fill.slice(1),16)), mcc=new THREE.Color();
        for(var mi=0;mi<pts.length;mi++) if(srnd(mi*11+5)<f.mix.share){ mcc.copy(mc).multiplyScalar(0.86+0.28*srnd(mi*7+3)); rid.setColorAt(mi,mcc); }
        if(rid.instanceColor) rid.instanceColor.needsUpdate=true;
      }
    } else {
      figMesh(K.infCoat,coat,pts,0.14); figMesh(K.infFixed,0xFFFFFF,pts,0.14);
      ud.batFigs=ud.figs.slice(-2);''','battalion bookkeeping and the mixed column')
rep('''    if(mixed){
      var sq=Math.max(5,Math.min(9,Math.round(str/850))), hp=[];''','''    if(f.battery){   /* an attached battery in front of the infantry (the Santon's eighteen guns) */
      var bg=Math.max(3,Math.min(6,Math.round(f.battery/3)));
      var bb=imesh(GEO.barrel,0x35322C,bg), bwl=imesh(GEO.wheel,0x6B563C,bg*2), btr=imesh(GEO.trail,0x5A4832,bg), bw2=0;
      for(var bq=0;bq<bg;bq++){
        var bx=(bq-(bg-1)/2)*2.4, bz=ud.D0*0.5+1.6;
        d.scale.set(1.35,1.35,1.35);
        d.position.set(bx,0.95,bz); d.rotation.set(1.5708,0,0); d.updateMatrix(); bb.setMatrixAt(bq,d.matrix);
        d.position.set(bx,0.62,bz-1.15); d.rotation.set(0,0,0); d.updateMatrix(); btr.setMatrixAt(bq,d.matrix);
        for(var bs=-1;bs<=1;bs+=2){ d.position.set(bx+bs*0.72,0.60,bz-0.15); d.rotation.set(0,0,1.5708); d.updateMatrix(); bwl.setMatrixAt(bw2++,d.matrix); }
      }
      bb.castShadow=bwl.castShadow=btr.castShadow=true; body.add(bb); body.add(bwl); body.add(btr);
    }
    if(mixed){
      var sq=Math.max(5,Math.min(9,Math.round(str/850))), hp=[];''','attached battery on an infantry block')
rep('''  ud.layout=layoutFigs;
''','''  ud.layout=layoutFigs;
  /* show only the battalions that are this formation's own troops (a detachment drawn separately is not drawn twice) */
  ud.showBattalions=function(k){
    if(!ud.batFigs||!ud.perBat) return;
    k=Math.max(1,Math.min(ud.nBat,k));
    ud.batFigs.forEach(function(fg){ fg.mesh.count=Math.max(1,k*ud.perBat); });
    ud.shownBat=k;
  };
''','battalion visibility hook')
rep('''  var lowered = (st==="broken"||st==="captured"||st==="encircled"||st==="repulsed") ? 0.95 : 0;''','''  if(u.showBattalions && f.strength && f.track && trackedDescendants(id).length){
    var kb=Math.round(u.nBat*ownStrengthAt(id,clock)/f.strength);
    if(kb!==u.shownBat) u.showBattalions(kb);
  }
  var lowered = (st==="broken"||st==="captured"||st==="encircled"||st==="repulsed") ? 0.95 : 0;''','detachment-aware battalion count per frame')

# ---------- 9. the compass shows true north for the current view ----------
rep('''function updateScaleBar(){''','''/* The rose points to true north as seen from the current camera: the map frame
   is rotated GEO.ROT_DEG from north, and the camera orbits freely. */
var _rose=null, _rA=new THREE.Vector3(), _rB=new THREE.Vector3();
function updateRose(){
  if(!_rose) _rose=document.getElementById("rose-needle");
  if(!_rose||!camera) return;
  _rA.copy(orbitTarget); _rB.set(orbitTarget.x+GEO.NORTH[0]*20, orbitTarget.y, orbitTarget.z+GEO.NORTH[1]*20);
  _rA.project(camera); _rB.project(camera);
  var ang=Math.atan2(_rB.x-_rA.x, _rB.y-_rA.y)*180/Math.PI;
  _rose.setAttribute("transform","rotate("+ang.toFixed(1)+" 30 30)");
}
function updateScaleBar(){''','compass rose follows true north')
rep('''  updateScaleBar();
  for(var i=0;i<overlayLabels.length;i++) overlayLabels[i].visible = labels && layerOn.arrows;''','''  updateScaleBar(); updateRose();
  for(var i=0;i<overlayLabels.length;i++) overlayLabels[i].visible = labels && layerOn.arrows;''','rose updated with the scale bar')

# ---------- 10. the sources text computes its own exaggeration ----------
rep('''    SOURCE_NOTE.body.map(function(p){return '<p>'+esc(p)+'</p>';}).join('')+''','''    SOURCE_NOTE.body.map(function(p){return '<p>'+esc(geoText(p))+'</p>';}).join('')+''','sources text uses derived scale')
rep('''function openSources(){''','''/* numbers in prose that depend on the map's scale are filled in from GEO, never typed */
function geoText(p){
  return String(p).replace(/\\{EXAG\\}/g,GEO.EXAG.toFixed(0)).replace(/\\{M_PER_UNIT\\}/g,(GEO.KM_PER_MAP*1000).toFixed(0))
    .replace(/\\{ROT\\}/g,GEO.ROT_DEG.toFixed(0)).replace(/\\{CONTOUR_M\\}/g,(CONTOUR_INTERVAL*GEO.V_M_PER_UNIT).toFixed(0));
}
function openSources(){''','geoText helper')
open(p,'w',encoding='utf-8').write(s)
print('app.js patched')
