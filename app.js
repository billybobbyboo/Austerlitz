/* ============================================================
   COMMAND MAP — application
   ============================================================ */
var RM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
/* ?harness=1: deterministic frames for the visual regression harness (no drift, no grain animation) */
var HARNESS = /[?&]harness=1\b/.test(location.search);

/* ---------------- per-phase map overlays ----------------
   Historical interpretation data. Every arrow is one of two things (Stage 2C; docs/STAGE2_SPEC.md section C, owner
   decisions 22, 33, 37 and 46):
     DERIVED: leg:[id, from, to] names the leg (or run of consecutive legs) of formation id, from its anchor at phase
       `from` to its anchor at phase `to`, that the model executes during the arrow's phase. It has no points of its own:
       arrowPts() takes them from the track, so its ends are the anchors exactly and it moves with the model.
     INTERPRETIVE: interp:"<kind>: <why>" says what it shows instead. Kinds: route (an ordered or intended route), objective
       (points at a place or objective, not at a modelled position), group (a summary arrow for several formations),
       unmodelled (names no formation the model tracks), halt (a column stopped short; drawn as a bar, not an arrow),
       unsettled (hand-authored: the model and the app's texts disagree and the sources are unread; listed by name in
       binding-test.js and in CHANGELOG.md).
   binding-test.js checks every arrow against the tracks. */
var OVERLAYS = {
0:{ lines:[
     {pts:[[223,82],[229,116],[238,158],[213,222],[205,277],[208,365],[212,408]],side:"fr",label:"French line on the Goldbach"},
     {pts:[[318,188],[315,227],[289,276],[291,332]],side:"al",label:"Allied columns on the plateau"}],
    bounds:[{pts:[[165,143],[244,139]],label:"V Corps · IV Corps"},
            {pts:[[160,252],[216,253]],label:"Soult's assault · Legrand"}],
    arrows:[
     {pts:[[291,332],[272,362],[234,395]],kind:"axis",side:"al",label:"I Column → Telnitz",interp:"route: an ordered route in the Allied disposition, not a movement made"},
     {pts:[[291,308],[268,328],[237,348]],kind:"axis",side:"al",label:"II Column → Sokolnitz",interp:"route: an ordered route in the Allied disposition, not a movement made"},
     {pts:[[290,282],[264,303],[240,330]],kind:"axis",side:"al",label:"III Column → the castle",interp:"route: an ordered route in the Allied disposition, not a movement made"},
     {pts:[[331,230],[285,251],[217,277]],kind:"axis",side:"al",label:"IV Column → Kobelnitz",interp:"route: an ordered route in the Allied disposition, not a movement made"},
     {leg:["lich",0,2],kind:"move",side:"al",label:"V Column counter-marches north"}],
    obj:[[212,408,"Telnitz"],[208,365,"Sokolnitz"],[205,277,"Kobelnitz"]]},

1:{ lines:[{pts:[[223,82],[229,116],[238,158],[213,222],[205,277],[208,365],[212,408]],side:"fr",label:"French line on the Goldbach"}],
    arrows:[
     {leg:["kienmayer",1,2],kind:"attack",side:"al",label:"Kienmayer"},
     {pts:[[291,332],[272,359],[247,381]],kind:"move",side:"al",label:"I Column descends",
      interp:"unsettled: the phase-1 timeline has the descent begin c. 07:30, the event and the track from 04:00 (the unresolved Dokhturov conflict, dok@1)"},
     {leg:["friant",1,2],kind:"move",side:"fr",label:"Friant's approach march"}],
    obj:[[212,408,"Telnitz"]]},

2:{ lines:[{pts:[[213,222],[205,277],[208,365],[212,408]],side:"fr",label:"Legrand and Friant on the stream"}],
    arrows:[
     {pts:[[268,328],[249,338],[229,356]],kind:"attack",side:"al",label:"II Column → Sokolnitz",
      interp:"objective: the attack on Sokolnitz village; the model has the column at the village from 08:00"},
     {pts:[[266,296],[254,316],[236,336]],kind:"attack",side:"al",label:"III Column → castle",
      interp:"objective: the attack on the castle and pheasantry; the model has the column there from 08:00"},
     {leg:["lich",2,3],kind:"move",side:"al",label:"Liechtenstein crosses the front"},
     {pts:[[325,230],[301,237]],kind:"halt",side:"al",label:"IV Column halted",of:"col4",
      interp:"halt: the 4th Column held up on the plateau, not a route; a bar where it stopped, across its line of march"},
     {leg:["friant",1,2],kind:"attack",side:"fr",label:"Friant retakes Telnitz"}],
    obj:[[208,365,"Sokolnitz"],[205,277,"Kobelnitz — never reached"]]},

3:{ arrows:[
     {leg:["sthilaire",2,3],kind:"attack",side:"fr",label:"Saint-Hilaire"},
     {leg:["vandamme",2,3],kind:"attack",side:"fr",label:"Vandamme"}],
    obj:[[285,289,"Pratzeberg"],[313,205,"Stare Vinohrady"]]},

4:{ arrows:[
     {pts:[[259,316],[270,300],[280,291]],kind:"counter",side:"al",label:"Kamensky turns about",
      interp:"unsettled: the phase-4 timeline dates the turn c. 09:45, his own record and the track in phase 3 (the unresolved Kamensky conflict, kamensky@3 and kamensky@4)"},
     {pts:[[324,233],[280,239],[289,273]],kind:"counter",side:"al",label:"Jurczek's Austrians",interp:"unmodelled: Jurczek's brigade has no track of its own"},
     {pts:[[213,299],[233,307],[246,307]],kind:"move",side:"fr",label:"Levasseur up the Goldbach",interp:"unmodelled: Levasseur's brigade has no track of its own"},
     {leg:["caffarelli",0,5],kind:"attack",side:"fr",label:"Caffarelli"},
     {leg:["suchet",0,5],kind:"attack",side:"fr",label:"Suchet"},
     {leg:["bag",0,5],kind:"attack",side:"al",label:"Bagration"}],
    lines:[{pts:[[309,207],[294,241],[283,287]],side:"fr",label:"French hold the crest"}],
    obj:[[285,289,"Pratzeberg"]]},

5:{ arrows:[
     {pts:[[319,194],[305,170],[298,153]],kind:"counter",side:"al",label:"Liechtenstein and Uvarov",interp:"group: Liechtenstein's and Uvarov's cavalry together"},
     {leg:["nansouty",5,6],kind:"counter",side:"fr",label:"Nansouty's cuirassiers"}],
    obj:[[296,147,"Blasowitz"],[222,87,"The Santon holds"]]},

6:{ arrows:[
     {pts:[[413,202],[359,187],[330,192]],kind:"attack",side:"al",label:"Russian Imperial Guard",interp:"group: the Guard infantry and cavalry under Constantine"},
     {pts:[[201,154],[245,184],[285,208]],kind:"counter",side:"fr",label:"Bessieres and Rapp",interp:"group: the Guard cavalry under Bessieres, with Rapp's charge"},
     {leg:["drouet",6,7],kind:"move",side:"fr",label:"Drouet forms line"}],
    lines:[{pts:[[296,145],[309,207],[296,241],[283,287]],side:"fr",label:"French on the plateau"}],
    obj:[[313,205,"Stare Vinohrady"]]},

7:{ arrows:[
     {leg:["sthilaire",6,7],kind:"attack",side:"fr",label:"Saint-Hilaire wheels south"},
     {leg:["vandamme",6,8],kind:"attack",side:"fr",label:"Vandamme wheels south"},
     {pts:[[198,398],[220,400],[238,392]],kind:"attack",side:"fr",label:"Davout resumes the offensive",interp:"group: Davout's III Corps, Friant and Bourcier"},
     {leg:["prz",7,8],kind:"retreat",side:"al",label:"Przybyszewski's breakout"}],
    lines:[{pts:[[212,408],[208,365],[205,277]],side:"al",label:"Buxhowden's columns, now cut off"}],
    obj:[[208,365,"Sokolnitz"]]},

8:{ arrows:[
     {pts:[[226,404],[260,385],[295,375]],kind:"retreat",side:"al",label:"I Column to the defile",
      interp:"objective: points at the Augezd defile, the way out; the model has the column's centre stop about 900 m short, part of it crossing the ice"},
     {pts:[[297,374],[282,412],[261,436]],kind:"retreat",side:"al",label:"Over the Satschan mere",interp:"unmodelled: the troops on the ice are not a tracked formation"},
     {pts:[[243,396],[226,422],[203,444]],kind:"retreat",side:"al",label:"Across the Menitz mere",interp:"unmodelled: the troops on the ice are not a tracked formation"},
     {leg:["vandamme",8,9],kind:"attack",side:"fr",label:"Vandamme takes the height"},
     {pts:[[223,379],[244,388],[270,375]],kind:"attack",side:"fr",label:"Legrand and Friant",interp:"group: Legrand's and Friant's divisions together"},
     {leg:["bag",7,9],kind:"retreat",side:"al",label:"Bagration withdraws on Rausnitz"}],
    obj:[[297,372,"The Augezd defile"]]},

9:{ lines:[{pts:[[223,82],[264,114],[313,205],[278,283],[290,366],[297,391]],side:"fr",label:"French positions at nightfall"}],
    arrows:[]}
};

/* ---------------- three.js scaffolding ---------------- */
var scene,camera,renderer,sun,hemi,world;
/* Stage 2E: two cameras. landCam, the perspective eye of the landscape and hybrid views; paperCam, the paper map's
   orthographic plan (MAPCAM). `camera` is the one drawn and projected through now; code that moves the landscape's eye
   (orbit, glides, presets, the ground floor) moves landCam. */
var landCam=null, paperCam=null;
var orbitTarget=new THREE.Vector3(0,0,14), sph=new THREE.Spherical();
var mode="terrain", tween=null;
var selection=null, freeCam=false;
/* Stage 3D (docs/STAGE3_SPEC.md section A.3, "one tween chain"): what the loop runs as `tween` is two slots. The scene slot
   holds a phase change's light and overlay fade; the camera slot holds a glide, a phase's camera arc or an eased move of the
   paper map. Each step returns true when it has ended. A phase change replaces the camera move only when it moves the camera
   itself (Follow on): before, it assigned `tween` and dropped any glide in flight, so a centring or a double-click made while
   the battle played was lost at the next phase boundary. Setting `tween=null` (a placement, the tools) still stops both. */
var _tw={scene:null,cam:null};
function _runTween(now){
  var s=_tw.scene, c=_tw.cam;
  if(s&&s(now)&&_tw.scene===s) _tw.scene=null;
  if(c&&c(now)&&_tw.cam===c) _tw.cam=null;
  if(!_tw.scene&&!_tw.cam&&tween===_runTween) tween=null;
}
function setTween(slot,fn){
  if(tween!==_runTween){ _tw.scene=null; _tw.cam=null; }
  _tw[slot]=fn||null;
  tween=(_tw.scene||_tw.cam)?_runTween:(tween===_runTween?null:tween);
}
var layerOn={symbols:true,arrows:true,labels:true,trails:true,contours:true,analysis:false,events:true};
var goingOn=false;
var terrainLabels=[];   /* {tl, col, world}: the map layer's terrain-study labels */
var highlight=null;      /* id -> true, or null for "show everything equally" */
var commandView="none";  /* none | fr | al */
var chapter=null;
var tourStep=-1;
var planSide=null;      /* "al" | "fr" | "both" | null */
var planGroup=null;
var cleanView=false;
function textOn(){ return layerOn.labels && !cleanView; }

var units={};        /* leaf formations with 3D blocks + symbols */
var aggregates={};   /* corps-level symbol only */
var placeLabels=[];   /* {ft, world}: the map layer's place names */

/* sky: zenith, mid-sky, horizon · disc: how much of the low December sun shows */
/* sun: intensity, colour, direction · hemi: sky fill · fog: atmospheric perspective,
   cool and darker than the ground so distance recedes instead of whitening ·
   sky: zenith, mid, horizon · disc: how much of the low sun shows ·
   grade: lift, gain, saturation, contrast, bloom, exposure */
var LIGHT={
 predawn:  {i:0.26,c:0x8FA2B6,p:[ -60, 80,-160],hemi:0.62,fogN:100,fogF:640, fogC:0x4A5666,bg:0x0D1520,
            sky:[0x0F1A26,0x2B3A48,0x4A5666],mistC:0x3E4852,disc:0.0,
            grade:[[0,0,0],[0.96,0.98,1.06],0.86,1.02,0.22,1.08]},
 dawn:     {i:0.46,c:0xD9B189,p:[ 210, 30, 140],hemi:0.50,fogN:110,fogF:680, fogC:0x787A7E,bg:0x152029,
            sky:[0x1B2836,0x4A5866,0x787A7E],mistC:0x8A8884,disc:0.35,
            grade:[[0,0,0],[1.02,1.00,0.98],0.94,1.04,0.34,1.00]},
 mist:     {i:0.62,c:0xDCC3A2,p:[ 200, 44, 146],hemi:0.48,fogN:120,fogF:720, fogC:0x82878A,bg:0x17242E,
            sky:[0x24313E,0x66717A,0x82878A],mistC:0xA4A7A6,disc:0.45,
            grade:[[0,0,0],[1.01,1.00,1.00],0.92,1.03,0.30,1.00]},
 sunburst: {i:1.10,c:0xFFD2A0,p:[ 206, 52, 148],hemi:0.40,fogN:220,fogF:1000,fogC:0x8E959A,bg:0x18262F,
            sky:[0x2A3D52,0x7A8D9C,0x8E959A],mistC:0xC4BFB4,disc:1.0,
            grade:[[0,0,0],[1.02,1.00,0.98],0.96,1.06,0.36,0.98]},
 morning:  {i:1.02,c:0xFFDFB2,p:[ 156, 80, 166],hemi:0.40,fogN:220,fogF:1000,fogC:0x8C949A,bg:0x16232D,
            sky:[0x2E4560,0x8497A8,0x8C949A],mistC:0xB8BCBC,disc:0.55,
            grade:[[0,0,0],[1.01,1.01,1.00],0.94,1.06,0.32,0.96]},
 midday:   {i:1.05,c:0xFFEDD4,p:[  46,108, 178],hemi:0.42,fogN:240,fogF:1080,fogC:0x8898A6,bg:0x152230,
            sky:[0x334C68,0x8EA0B0,0x8898A6],mistC:0xB9BEC2,disc:0.40,
            grade:[[0,0,0],[1.00,1.00,1.02],0.93,1.04,0.28,0.96]},
 afternoon:{i:0.96,c:0xFFD69A,p:[-124, 74, 168],hemi:0.40,fogN:220,fogF:1000,fogC:0x8E9498,bg:0x152130,
            sky:[0x2E4358,0x8393A2,0x8E9498],mistC:0xBDB8B0,disc:0.55,
            grade:[[0,0,0],[1.02,1.01,0.98],0.96,1.06,0.32,0.96]},
 late:     {i:0.82,c:0xF0B87C,p:[-204, 32, 118],hemi:0.38,fogN:180,fogF:900, fogC:0x8C8A8A,bg:0x131D28,
            sky:[0x243346,0x6E7A88,0x8C8A8A],mistC:0xAE9E8E,disc:0.9,
            grade:[[0,0,0],[1.04,1.00,0.96],0.98,1.08,0.40,0.98]},
 dusk:     {i:0.34,c:0xA9663E,p:[-236, 12,  62],hemi:0.58,fogN:120,fogF:720, fogC:0x565A64,bg:0x0C1420,
            sky:[0x0C1522,0x2E3948,0x565A64],mistC:0x4A4C54,disc:0.5,
            grade:[[0,0,0],[1.00,0.97,1.02],0.88,1.02,0.30,1.06]},
 staff:    {i:0.28,c:0xFFFFFF,p:[  60,220, -40],hemi:1.05,fogN:600,fogF:2000,fogC:0xD8D2C0,bg:0x171C21,
            sky:[0x171C21,0x171C21,0x171C21],mistC:0xC0BCB2,disc:0.0,
            grade:[[0,0,0],[1.00,1.00,1.00],1.00,1.00,0.04,1.00]}
};
/* ---- Stage 4B: the light from the computed sun (docs/STAGE4_SPEC.md section A.5; owner decisions 68-71) ----
   The sun's position is derived from astronomy, not a record of the day: Meeus's low-accuracy solar coordinates (Astronomical
   Algorithms, ch. 25), NOAA's equation of time and Bennett's refraction, for the field's centre on 2 December 1805, the app's
   clock read as local apparent (solar) time (decision 69; a reading, not a finding: the clock basis of the sources' hours is
   not established). tools/stage4/ephem.js is the same computation, used by the measurement scripts (one coefficient is
   written 1.9993e-2 here, so geo-test.js's search for the retired map scale's digits does not take it for one). */
var SUN_DAY=(function(){
  var ll=GEOREF.toGeo(340,250), LAT=ll[0], LON=ll[1], D2R=Math.PI/180, R2D=180/Math.PI;   /* the field's centre, W(0,0) */
  function jd(y,m,d){ if(m<=2){ y--; m+=12; } var A=Math.floor(y/100), B=2-A+Math.floor(A/4);
    return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5; }
  var JD0=jd(1805,12,2);
  function solar(JD){
    var T=(JD-2451545)/36525, L0=((280.46646+36000.76983*T+0.0003032*T*T)%360+360)%360;
    var M=357.52911+35999.05029*T-0.0001537*T*T, e=0.016708634-0.000042037*T-0.0000001267*T*T;
    var C=(1.914602-0.004817*T-0.000014*T*T)*Math.sin(M*D2R)+(1.9993e-2-0.000101*T)*Math.sin(2*M*D2R)+0.000289*Math.sin(3*M*D2R);
    var Om=125.04-1934.136*T, lam=L0+C-0.00569-0.00478*Math.sin(Om*D2R);
    var eps=23+(26+(21.448-T*(46.815+T*(0.00059-T*0.001813)))/60)/60+0.00256*Math.cos(Om*D2R);
    var y=Math.pow(Math.tan(eps*D2R/2),2), L=L0*D2R, Mr=M*D2R;
    return {dec:Math.asin(Math.sin(eps*D2R)*Math.sin(lam*D2R))*R2D,
            eot:4*R2D*(y*Math.sin(2*L)-2*e*Math.sin(Mr)+4*e*y*Math.sin(Mr)*Math.cos(2*L)-0.5*y*y*Math.sin(4*L)-1.25*e*e*Math.sin(2*Mr))};
  }
  /* t: the clock in minutes after midnight, as apparent solar time. alt is refracted, geo geometric; az true, from north */
  function at(t){
    var s=solar(JD0+(t-LON*4)/1440); s=solar(JD0+(t-s.eot-LON*4)/1440);
    var H=(t/4-180)*D2R, ph=LAT*D2R, de=s.dec*D2R;
    var geo=Math.asin(Math.sin(ph)*Math.sin(de)+Math.cos(ph)*Math.cos(de)*Math.cos(H))*R2D;
    var az=(Math.atan2(Math.sin(H),Math.cos(H)*Math.sin(ph)-Math.tan(de)*Math.cos(ph))*R2D+540)%360;
    var refr=geo>-1?1.02/Math.tan((geo+10.3/(geo+5.11))*D2R)/60:0;
    return {alt:geo+refr, geo:geo, az:az, dec:s.dec, eot:s.eot, am:t<720};
  }
  var noon=at(720).alt;
  return {at:at, noonAlt:noon, lat:LAT, lon:LON};
})();
/* the sun's horizontal direction in world x, z for a true azimuth (GEOREF.NORTH is true north in the map's x, y, which W()
   carries to world x, z) */
function sunWorldDir(az,alt,out){
  var N=GEOREF.NORTH, a=az*Math.PI/180, b=alt*Math.PI/180, hx=Math.sin(a)*-N[1]+Math.cos(a)*N[0], hz=Math.sin(a)*N[0]+Math.cos(a)*N[1];
  return (out||new THREE.Vector3()).set(hx*Math.cos(b),Math.sin(b),hz*Math.cos(b)).normalize();
}
/* the drawn light's altitude: the true altitude's tangent times the display factor (decision 68), so the drawn ground's lit side
   and cast shadows are the true ground's under the true sun at every factor (section A.3); at 1x it is the true altitude */
function drawnAltitude(alt){ return Math.atan(DISPLAY.factor*Math.tan(alt*Math.PI/180))*180/Math.PI; }
/* LIGHT_BY_ALT: every value a preset carried, as a function of the sun's true (refracted) altitude, morning and afternoon. Its
   rows are today's presets placed where each one's phase has the sun (section A.5): design values, interpolated; the top row is
   the day's highest altitude, where morning and afternoon meet. fill: the light opposite the sun (decision 70; it replaces the
   shadow toe), 0.36 by day, 0.16 (the fixed fill before 4B) at night; with it the sky fill is raised by 0.08 by day. Both were
   chosen on the harness's darkness measure without the toe: Part A's 0.28 alone (section A.4b) left the figures' and houses'
   cast shadows near-black in two views at 4x (selected-formation 0.076%, the low Pratzen view at 11:00 0.079%, against 0.05%);
   these values bring the worst to 0.030% (CHANGELOG.md, Stage 4B). Design values. */
var LIGHT_FILL={predawn:0.16,dawn:0.22,dusk:0.16,staff:0.16}, LIGHT_FILL_DAY=0.52, LIGHT_SKY_LIFT={predawn:0,dawn:0.04,dusk:0,staff:0};
/* Stage 4C: the haze's strength for each preset's hour, as the visibility (km) at the valley floor that would give it. A depth cue
   counted beyond the orbit target (decision 81), not the day's air: physical visibilities (10-25 km) hazed the ground behind the
   subject so heavily that the landscape's luminance rose 17-29 above 4B's in four harness views; these keep every view within 15
   (CHANGELOG.md, Stage 4C). Design values; the day's visibility is not recorded in this reconstruction. */
var LIGHT_VIS={predawn:40,dawn:40,mist:50,sunburst:70,morning:100,midday:120,afternoon:100,late:70,dusk:50,staff:120};
var LIGHT_BY_ALT={
  am:[[-18,"predawn"],[-3,"dawn"],[4,"mist"],[9,"sunburst"],[15,"morning"],[SUN_DAY.noonAlt,"midday"]],
  pm:[[-18,"dusk"],[-12,"dusk"],[3,"late"],[16,"afternoon"],[SUN_DAY.noonAlt,"midday"]]
};
/* the night light: a design light (decision 71), the predawn preset's direction, not a moon */
var NIGHT_DIR=new THREE.Vector3(LIGHT.predawn.p[0],LIGHT.predawn.p[1],LIGHT.predawn.p[2]).normalize();
function lightRow(L,k){ return {i:L.i,c:new THREE.Color(L.c),hemi:L.hemi+(LIGHT_SKY_LIFT[k]!==undefined?LIGHT_SKY_LIFT[k]:0.08),fogN:L.fogN,fogF:L.fogF,fogC:lin(L.fogC),bg:lin(L.bg),
  sky:[new THREE.Color(L.sky[0]),new THREE.Color(L.sky[1]),new THREE.Color(L.sky[2])],mistC:lin(L.mistC),disc:L.disc,grade:L.grade,
  fill:LIGHT_FILL[k]!==undefined?LIGHT_FILL[k]:LIGHT_FILL_DAY,vis:LIGHT_VIS[k]}; }
function mixRow(a,b,e){ return {i:a.i+(b.i-a.i)*e,c:a.c.clone().lerp(b.c,e),hemi:a.hemi+(b.hemi-a.hemi)*e,fogN:a.fogN+(b.fogN-a.fogN)*e,
  fogF:a.fogF+(b.fogF-a.fogF)*e,fogC:a.fogC.clone().lerp(b.fogC,e),bg:a.bg.clone().lerp(b.bg,e),
  sky:[a.sky[0].clone().lerp(b.sky[0],e),a.sky[1].clone().lerp(b.sky[1],e),a.sky[2].clone().lerp(b.sky[2],e)],
  mistC:a.mistC.clone().lerp(b.mistC,e),disc:a.disc+(b.disc-a.disc)*e,grade:lerpGrade(a.grade,b.grade,e),fill:a.fill+(b.fill-a.fill)*e,vis:a.vis+(b.vis-a.vis)*e}; }
/* the light at a clock: the table's values at the sun's altitude, the drawn light's direction and the disc's */
function lightAt(t){
  var s=SUN_DAY.at(t), rows=s.am?LIGHT_BY_ALT.am:LIGHT_BY_ALT.pm, a=Math.max(rows[0][0],Math.min(SUN_DAY.noonAlt,s.alt)), R=null;
  for(var i=0;i<rows.length-1;i++){ var r0=rows[i], r1=rows[i+1];
    if(a>=r0[0]&&a<=r1[0]){ R=mixRow(lightRow(LIGHT[r0[1]],r0[1]),lightRow(LIGHT[r1[1]],r1[1]),r1[0]>r0[0]?(a-r0[0])/(r1[0]-r0[0]):0); break; } }
  if(!R) R=lightRow(LIGHT[rows[0][1]],rows[0][1]);
  /* the drawn light: the sun's azimuth at its corrected altitude (kept 0.5 degrees above the horizon) once the sun is up; through
     civil twilight it turns to the night light, which it is below -6 degrees */
  var w=smoothstep(-6,0,s.geo), sd=sunWorldDir(s.az,drawnAltitude(Math.max(0.5,s.alt)));
  R.dir=w>=1?sd:NIGHT_DIR.clone().multiplyScalar(1-w).addScaledVector(sd,w).normalize();
  /* the disc: at the true altitude, drawn while the upper limb is above the horizon (geometric altitude above -0.833 degrees) */
  R.discDir=sunWorldDir(s.az,s.alt); R.disc*=clamp01((s.geo+0.833)/0.5);
  R.sun=s; R.twilight=w;
  return R;
}
var LIGHT_NOW=null, _lightKey="", _envQ=32;
/* the light of the current clock (or the paper map's), applied when the clock, the factor or the ground style changes */
function applyLight(force){
  var staff=(mode==="staff"), key=staff?"staff":(Math.round(clock*100)+"|"+DISPLAY.factor);
  if(!force&&key===_lightKey) return false;
  _lightKey=key;
  var R;
  if(staff){ var L=LIGHT.staff; R=lightRow(L,"staff"); R.dir=new THREE.Vector3(L.p[0],L.p[1],L.p[2]).normalize(); R.discDir=R.dir.clone(); R.disc=0; R.fill=0.16; R.sun=null; R.twilight=1; }
  else R=lightAt(clock);
  LIGHT_NOW=R;
  sun.intensity=R.i; sun.color.copy(R.c); sunDir.copy(R.dir).multiplyScalar(SHADOW_FIT.D);
  hemi.intensity=R.hemi;
  if(fillLight) fillLight.intensity=R.fill;
  scene.fog.near=R.fogN; scene.fog.far=R.fogF; scene.fog.color.copy(R.fogC);
  scene.background.copy(R.bg);
  /* Stage 4E (docs/STAGE4_SPEC.md section F.2; decision 80): the horizon is the atmosphere's. The dome's colour at and below its
     equator is the haze's (the fog colour the chunks mix toward), so where the apron's far edge shows it sinks into the same
     colour; no ring of distant relief is drawn. On the landscape the light table's horizon is the fog colour in every row. */
  _skyNow[0].copy(R.sky[0]); _skyNow[1].copy(R.sky[1]); _skyNow[2].copy(R.sky[2]); if(!staff) _skyNow[2].copy(R.fogC).convertLinearToSRGB();   /* the sky's colours are sRGB, the fog's linear */
  paintSky(_skyNow[0],_skyNow[1],_skyNow[2]);
  refreshEnvironment();
  if(sunDisc) sunDisc.material.opacity=staff?0:R.disc*0.92;
  applyGrade(R.grade);
  ATMO.u.uAtmoV.value.copy(R.mistC);   /* Stage 4C: the valley fog's colour is the light's */
  return true;
}
/* ---- the shadow map follows what is drawn (section A.5, item 7) ----
   The shadow camera's box is fitted to the ground under the free rectangle (each screen ray's stretch between the highest and
   the lowest drawn ground, kept within R of the orbit target: R = 1.4 x the eye's distance to it, 120-700 units), square, its
   size rounded up to 16 units (240-1,600: never finer than the fixed box before 4B, so the figures' own shadows stay as soft as
   they were) and its centre snapped to whole shadow texels in a frame fixed to the light, so a moving eye does not make shadows
   shimmer. The light stands back along its direction from the receivers by MARGIN units, so near and far also cover the ground
   toward the light (a hill that casts onto them); the depth bias is kept at its pre-4B size in world units (0.0009 x 640). */
var SHADOW_FIT={D:400,margin:520,biasUnits:0.576,key:"",ext:0,pts:[],R:0,minG:null};
var _sfR=new THREE.Vector3(), _sfU=new THREE.Vector3(), _sfF=new THREE.Vector3(), _sfP=new THREE.Vector3(), _sfRay=new THREE.Vector3(), _sfUp=new THREE.Vector3(0,1,0);
function groundMinY(){ var s=displayScale(); if(SHADOW_FIT.minG&&SHADOW_FIT.minG[0]===s) return SHADOW_FIT.minG[1];
  var m=1e9, B=FACE.baseY; for(var i=0;i<B.length;i++) if(B[i]<m) m=B[i]; SHADOW_FIT.minG=[s,m*s]; return m*s; }
function shadowReceivers(){
  var fr=landFreeRect(), E=landCam.position, T=orbitTarget, R=Math.max(120,Math.min(700,1.4*E.distanceTo(T))), out=[T.clone()];
  var VW=renderer.domElement.clientWidth||window.innerWidth, VH=renderer.domElement.clientHeight||window.innerHeight;
  var top=mlMaxG(), bot=groundMinY();
  landCam.updateMatrixWorld();
  function add(p){ var dx=p.x-T.x, dz=p.z-T.z, h=Math.hypot(dx,dz); if(h>R){ p.x=T.x+dx*R/h; p.z=T.z+dz*R/h; } out.push(p); }
  for(var j=0;j<=4;j++) for(var i=0;i<=6;i++){
    var sx=fr[0]+(fr[2]-fr[0])*i/6, sy=fr[1]+(fr[3]-fr[1])*j/4;
    _sfRay.set(sx/VW*2-1,-(sy/VH)*2+1,0.5).unproject(landCam).sub(E).normalize();
    if(_sfRay.y<-1e-4){
      var s0=Math.max(0,(top-E.y)/_sfRay.y), s1=(bot-E.y)/_sfRay.y;
      add(E.clone().addScaledVector(_sfRay,s0)); add(E.clone().addScaledVector(_sfRay,Math.max(s0,s1)));
    } else { var hz=new THREE.Vector3(_sfRay.x,0,_sfRay.z); if(hz.lengthSq()<1e-9) continue; hz.normalize();
      add(new THREE.Vector3(T.x+hz.x*R,top,T.z+hz.z*R)); add(new THREE.Vector3(T.x+hz.x*R,bot,T.z+hz.z*R)); }
  }
  SHADOW_FIT.R=R; return out;
}
function placeLights(){
  var paper=(mode==="staff");
  if(sunDisc){ sunDisc.position.copy(LIGHT_NOW?LIGHT_NOW.discDir:sunDir).normalize().multiplyScalar(560).add(orbitTarget); sunDisc.visible=!paper&&sunDisc.material.opacity>0.02; }
  if(fillLight&&paper) fillLight.position.set(80,60,-120);   /* the paper map keeps its light as before 4B */
  else if(fillLight&&LIGHT_NOW){ var d=LIGHT_NOW.dir; fillLight.position.set(-d.x,0,-d.z); if(fillLight.position.lengthSq()<1e-9) fillLight.position.set(1,0,0);
    fillLight.position.normalize().multiplyScalar(130).setY(60); }   /* opposite the light's azimuth, about 22.6 degrees up, as the fixed fill stood */
  if(paper){ sun.target.position.copy(orbitTarget); sun.target.updateMatrixWorld(); sun.position.copy(orbitTarget).add(sunDir); return; }
  landCam.updateMatrixWorld();
  var e=landCam.matrixWorld.elements, key=sunDir.x.toFixed(5)+","+sunDir.y.toFixed(5)+","+sunDir.z.toFixed(5)+"|"+DISPLAY.factor+"|"+orbitTarget.x.toFixed(3)+","+orbitTarget.z.toFixed(3);
  for(var i=0;i<16;i++) key+=","+e[i].toFixed(4);
  key+="|"+(renderer.domElement.clientWidth||0)+"x"+(renderer.domElement.clientHeight||0)+"|"+landFreeRect().map(Math.round).join(",");
  if(key===SHADOW_FIT.key) return;
  SHADOW_FIT.key=key;
  var P=shadowReceivers(), f=_sfF.copy(sunDir).normalize().negate();   /* the light's view direction */
  _sfR.crossVectors(f,_sfUp); if(_sfR.lengthSq()<1e-9) _sfR.set(1,0,0); _sfR.normalize(); _sfU.crossVectors(_sfR,f).normalize();
  var x0=1e9,x1=-1e9,y0=1e9,y1=-1e9,d0=1e9,d1=-1e9;
  P.forEach(function(p){ var x=p.dot(_sfR), y=p.dot(_sfU), d=p.dot(f); x0=Math.min(x0,x); x1=Math.max(x1,x); y0=Math.min(y0,y); y1=Math.max(y1,y); d0=Math.min(d0,d); d1=Math.max(d1,d); });
  var cam=sun.shadow.camera, n=sun.shadow.mapSize.x, ext=Math.ceil((Math.max(x1-x0,y1-y0)+12)/16)*16;
  ext=Math.max(240,Math.min(1600,ext));
  var tex=ext/n, cx=Math.round((x0+x1)/2/tex)*tex, cy=Math.round((y0+y1)/2/tex)*tex, back=d0-SHADOW_FIT.margin;
  _sfP.copy(_sfR).multiplyScalar(cx).addScaledVector(_sfU,cy).addScaledVector(f,back);
  sun.position.copy(_sfP); sun.target.position.copy(_sfP).add(f); sun.updateMatrixWorld(); sun.target.updateMatrixWorld();
  cam.left=-ext/2; cam.right=ext/2; cam.bottom=-ext/2; cam.top=ext/2; cam.near=0.5; cam.far=(d1-back)+20;
  cam.updateProjectionMatrix();
  sun.shadow.bias=-SHADOW_FIT.biasUnits/(cam.far-cam.near);
  SHADOW_FIT.ext=ext; SHADOW_FIT.pts=P;
}
/* ---- Stage 4C: the atmosphere (docs/STAGE4_SPEC.md sections B.3 and C.5; owner decisions 72, 73, 80 and 81) ----
   One atmosphere in three.js's fog chunks, shared by every fogged material, computed in the true (unexaggerated) geometry: the
   ray's vertical divided by the display factor, heights in metres through GEOREF (DATUM_M, M_PER_WORLD: no scale of its own).
   - The haze: exponential in height (scale height ATMO.HS above ATMO.M0, the valley floor), its one parameter the visibility at
     the valley floor (the light table's vis, km: design values, not the day's visibility, which this reconstruction does not
     record). Counted only beyond the orbit target's distance from the eye (decision 81): a depth cue, so the subject is never
     hazed and what lies behind it recedes. It replaces the linear fog's near and far and Stage 3D's recession (fogShift).
   - The valley fog: a layer whose top is the Command view's own: knowledgeOf treats a formation as "uncertain" while the
     phase's mist exceeds 0.5 and it stands below model height -0.8 (app.js knowledgeOf, guarded), so the top is drawn at
     GEOREF.elevM(-0.8), 238.2 m, and the self-test holds the two together. Its amount follows PHASES[].mist (read, not
     changed), eased over the first FOG_EASE minutes of each phase so nothing steps; as the amount falls below 0.9 the top sinks
     (the heights clear before the valley, as the narrative has Soult climb out of the fog into sunlight). Drawn at most 55%
     opaque (decision 72), so the figures in it stay visible; counted from the eye (it is a layer, not a depth cue). The evening
     values of PHASES[].mist (0.22, 0.30; no text mentions them) are drawn as a thin haze, labelled modelled (decision 73).
   On the paper map neither is drawn. Line of sight, the viewshed and the knowledge model are not touched. */
var ATMO={HS:400, M0:200, EDGE:6, FOG_EASE:20, FOG_SINK:20, FOG_VIS_KM:0.2, CAP:0.55,
  FOG_TOP_H:-0.8,   /* the knowledge model's threshold (knowledgeOf: hAt(p) < -0.8), model units */
  u:{uAtmoA:{value:new THREE.Vector4(4,243.1,63.2,0)}, uAtmoB:{value:new THREE.Vector4(0,400,200,0)},
     uAtmoC:{value:new THREE.Vector4(238.2,15,0,0)}, uAtmoV:{value:new THREE.Color(0.7,0.72,0.74)}}};
ATMO.FOG_TOP=GEOREF.elevM(ATMO.FOG_TOP_H);
/* sigma, the extinction per world unit for a meteorological visibility in km (Koschmieder: 3.912 / V) */
function atmoSigma(km){ return 3.912/km*GEOREF.M_PER_WORLD/1000; }
/* the valley fog's amount at a clock: PHASES[].mist, each phase's value reached FOG_EASE minutes after its start */
function fogAmount(t){
  var p=phaseAt(t), v=PHASES[p].mist, prev=p>0?PHASES[p-1].mist:v;
  return prev+(v-prev)*smoothstep(0,ATMO.FOG_EASE,t-PHASES[p].t0);
}
function fogTop(a){ return ATMO.FOG_TOP-ATMO.FOG_SINK*(1-Math.min(1,a/0.9)); }
function fogCap(a){ return ATMO.CAP*smoothstep(0,0.9,a); }
/* every material compiled gets the atmosphere's uniforms (shared objects; unused where the material has no fog). Materials
   with an onBeforeCompile of their own (the ground shader, world.js atlasShader) call atmoUniforms themselves. */
function atmoUniforms(sh){ var U=ATMO.u; for(var k in U) sh.uniforms[k]=U[k]; }
if(THREE.Material) THREE.Material.prototype.onBeforeCompile=function(sh){ atmoUniforms(sh); };   /* (absent only in runtime-test.js's stub, which draws nothing) */
(function(){
  var C=THREE.ShaderChunk; if(!C) return;
  C.fog_pars_vertex="#ifdef USE_FOG\n\tvarying float fogDepth;\n\tvarying vec3 vFogW;\n#endif";
  /* the fragment's world position, from the view matrix every program has: w = R^T (v - t) */
  C.fog_vertex="#ifdef USE_FOG\n\tfogDepth = - mvPosition.z;\n\tvec3 fgT = mvPosition.xyz - viewMatrix[3].xyz;\n"+
    "\tvFogW = vec3( dot( viewMatrix[0].xyz, fgT ), dot( viewMatrix[1].xyz, fgT ), dot( viewMatrix[2].xyz, fgT ) );\n#endif";
  C.fog_pars_fragment=["#ifdef USE_FOG",
    "\tuniform vec3 fogColor;\n\tvarying float fogDepth;\n\tvarying vec3 vFogW;",
    /* A: display factor, datum (m), metres per world unit, the focus (eye to orbit target); B: the haze's extinction per world
       unit at the valley floor, its scale height (m), the floor (m), on; C: the valley fog's top (m), edge (m), extinction, cap */
    "\tuniform vec4 uAtmoA; uniform vec4 uAtmoB; uniform vec4 uAtmoC; uniform vec3 uAtmoV;",
    "#endif"].join("\n");
  C.fog_fragment=["#ifdef USE_FOG",
    "\tvec3 fgD = vFogW - cameraPosition; float fgLen = length( fgD ), K = uAtmoA.x;",
    "\tfloat mw = uAtmoA.y + vFogW.y / K * uAtmoA.z;",
    /* the haze, beyond the focus */
    "\tvec3 fgS = cameraPosition + fgD * ( min( fgLen, uAtmoA.w ) / max( fgLen, 1e-6 ) ), fgR = vFogW - fgS;",
    "\tfloat fgL = length( vec3( fgR.x, fgR.y / K, fgR.z ) ), mc = uAtmoA.y + fgS.y / K * uAtmoA.z, dm = mw - mc;",
    "\tfloat ec = exp( -( mc - uAtmoB.z ) / uAtmoB.y ), ew = exp( -( mw - uAtmoB.z ) / uAtmoB.y );",
    "\tfloat tauH = uAtmoB.x * fgL * ( abs( dm ) > 0.01 ? uAtmoB.y * ( ec - ew ) / dm : ew );",
    "\tvec3 fgC = mix( gl_FragColor.rgb, fogColor, ( 1.0 - exp( - tauH ) ) * uAtmoB.w );",
    /* the valley fog, from the eye: uniform under the top, an exponential edge above it */
    "\tif( uAtmoC.w > 0.0 ) {",
    "\t\tfloat tp = uAtmoC.x, he = uAtmoC.y, me = uAtmoA.y + cameraPosition.y / K * uAtmoA.z, dme = mw - me;",
    "\t\tfloat fgLE = length( vec3( fgD.x, fgD.y / K, fgD.z ) );",
    "\t\tfloat gc = me <= tp ? me : tp + he * ( 1.0 - exp( -( me - tp ) / he ) );",
    "\t\tfloat gw = mw <= tp ? mw : tp + he * ( 1.0 - exp( -( mw - tp ) / he ) );",
    "\t\tfloat tauV = uAtmoC.z * fgLE * ( abs( dme ) > 0.01 ? ( gw - gc ) / dme : ( mw <= tp ? 1.0 : exp( -( mw - tp ) / he ) ) );",
    "\t\tfgC = mix( fgC, uAtmoV, min( uAtmoC.w, 1.0 - exp( - tauV ) ) );",
    "\t}",
    "\tgl_FragColor.rgb = fgC;",
    "#endif"].join("\n");
})();
/* the same in script, for the self-test and the measurements: [haze, valley fog] at world point p seen from eye e */
function atmoAt(e,p,focus){
  var A=ATMO.u.uAtmoA.value, B=ATMO.u.uAtmoB.value, C=ATMO.u.uAtmoC.value, K=A.x, f=(focus===undefined?A.w:focus);
  var dx=p.x-e.x, dy=p.y-e.y, dz=p.z-e.z, len=Math.sqrt(dx*dx+dy*dy+dz*dz), k=Math.min(len,f)/Math.max(len,1e-6);
  var s={x:e.x+dx*k,y:e.y+dy*k,z:e.z+dz*k}, rx=p.x-s.x, ry=p.y-s.y, rz=p.z-s.z, L=Math.sqrt(rx*rx+ry*ry/(K*K)+rz*rz);
  var mw=A.y+p.y/K*A.z, mc=A.y+s.y/K*A.z, dm=mw-mc, ec=Math.exp(-(mc-B.z)/B.y), ew=Math.exp(-(mw-B.z)/B.y);
  var tH=B.x*L*(Math.abs(dm)>0.01?B.y*(ec-ew)/dm:ew), h=(1-Math.exp(-tH))*B.w, v=0;
  if(C.w>0){ var tp=C.x, he=C.y, me=A.y+e.y/K*A.z, dme=mw-me, LE=Math.sqrt(dx*dx+dy*dy/(K*K)+dz*dz);
    var G=function(m){ return m<=tp?m:tp+he*(1-Math.exp(-(m-tp)/he)); };
    var tV=C.z*LE*(Math.abs(dme)>0.01?(G(mw)-G(me))/dme:(mw<=tp?1:Math.exp(-(mw-tp)/he))); v=Math.min(C.w,1-Math.exp(-tV)); }
  return [h,v];
}
/* the atmosphere's uniforms for this frame: the light's haze and mist colour, the clock's fog, the eye's focus */
/* Stage 4E (docs/STAGE4_SPEC.md section F.2): the sky dome is centred on the eye, so its equator, where the sky turns to the haze's
   colour, is the eye's own horizon at every height and factor (centred on the origin, a high eye saw the dome above its equator
   below the level horizon) */
function domeFollow(){ if(world&&world.dome&&landCam&&mode!=="staff") world.dome.position.copy(landCam.position); }
function applyAtmo(){
  var A=ATMO.u.uAtmoA.value, B=ATMO.u.uAtmoB.value, C=ATMO.u.uAtmoC.value, paper=(mode==="staff");
  A.set(DISPLAY.flat?1:DISPLAY.factor,GEOREF.DATUM_M,GEOREF.M_PER_WORLD,landCam.position.distanceTo(orbitTarget));
  if(paper||!LIGHT_NOW){ B.w=0; C.w=0; return; }
  B.set(atmoSigma(LIGHT_NOW.vis),ATMO.HS,ATMO.M0,1);
  var a=fogAmount(clock); C.set(fogTop(a),ATMO.EDGE,atmoSigma(ATMO.FOG_VIS_KM)*a,fogCap(a));
  ATMO.u.uAtmoV.value.copy(LIGHT_NOW.mistC);
}
var skyCanvas=null, skyCtx=null, sunDisc=null;
var _skyNow=[new THREE.Color(0x0F1A26),new THREE.Color(0x2B3A48),new THREE.Color(0x6E7A82)];
var _gradeNow=[[0,0,0],[0.94,0.97,1.06],0.86,1.10,0.26,0.94];
function paintSky(c0,c1,c2){
  if(!skyCanvas){
    skyCanvas=document.createElement("canvas"); skyCanvas.width=4; skyCanvas.height=256;
    skyCtx=skyCanvas.getContext("2d");
  }
  var g=skyCtx.createLinearGradient(0,0,0,256);
  /* the sphere's equator is at 0.5: zenith above, the fog colour at and below it */
  g.addColorStop(0,"#"+c0.getHexString()); g.addColorStop(0.30,"#"+c1.getHexString());
  g.addColorStop(0.47,"#"+c2.getHexString()); g.addColorStop(1,"#"+c2.getHexString());
  skyCtx.fillStyle=g; skyCtx.fillRect(0,0,4,256);
  if(world&&world.dome){
    var m=world.dome.material;
    if(!m.map||m.map.image!==skyCanvas){ m.map=ctexS(skyCanvas); m.needsUpdate=true; }
    else m.map.needsUpdate=true;
  }
}
var pmrem=null, envRT=null, _envKey="";
function refreshEnvironment(){
  if(!skyCanvas) return;
  /* Stage 4B: the light moves with the clock, so the environment map (a PMREM pass) is re-made only when the sky's colours have
     moved by a 32nd of their range, not every frame */
  var key=[0,2].map(function(k){ var c=_skyNow[k]; return Math.round(c.r*_envQ)+","+Math.round(c.g*_envQ)+","+Math.round(c.b*_envQ); }).join("|");
  if(key===_envKey) return;
  _envKey=key;
  if(!pmrem){ pmrem=new THREE.PMREMGenerator(renderer); pmrem.compileEquirectangularShader(); }
  var eq=document.createElement("canvas"); eq.width=64; eq.height=32;
  var x=eq.getContext("2d");
  var g=x.createLinearGradient(0,0,0,32);
  g.addColorStop(0,"#"+_skyNow[0].getHexString());
  g.addColorStop(0.30,"#"+_skyNow[1].getHexString());
  g.addColorStop(0.48,"#"+_skyNow[2].getHexString());
  g.addColorStop(1,"#2A2A24");
  x.fillStyle=g; x.fillRect(0,0,64,32);
  var tex=new THREE.CanvasTexture(eq);
  tex.mapping=THREE.EquirectangularReflectionMapping;
  tex.encoding=THREE.sRGBEncoding;
  var out=pmrem.fromEquirectangular(tex);
  if(envRT) envRT.dispose();
  envRT=out;
  scene.environment=out.texture;
  tex.dispose();
}
function buildSunDisc(){
  var c=document.createElement("canvas"); c.width=c.height=128;
  var x=c.getContext("2d");
  var gr=x.createRadialGradient(64,64,4,64,64,64);
  gr.addColorStop(0,"rgba(255,244,214,1)"); gr.addColorStop(0.18,"rgba(255,222,160,.95)");
  gr.addColorStop(0.42,"rgba(255,190,110,.35)"); gr.addColorStop(1,"rgba(255,170,90,0)");
  x.fillStyle=gr; x.fillRect(0,0,128,128);
  sunDisc=new THREE.Sprite(new THREE.SpriteMaterial({map:ctexS(c),transparent:true,opacity:0,
    depthWrite:false,fog:false}));
  sunDisc.scale.set(74,74,1); sunDisc.renderOrder=2;
  scene.add(sunDisc);
}
var sunDir=new THREE.Vector3(-60,80,-160), fillLight=null;

function init(){
  scene=new THREE.Scene();
  scene.background=lin(0x121A22);
  scene.fog=new THREE.Fog(lin(0x3E4A58),90,560);

  renderer=new THREE.WebGLRenderer({antialias:true});
  lowTier = (window.innerWidth*window.innerHeight < 900*700) ||
             /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent||"");
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowTier?1.5:2));
  renderer.setSize(window.innerWidth,window.innerHeight);
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.info.autoReset=false;          /* the frame resets it, so the readout can split the passes */
  renderer.outputEncoding=THREE.LinearEncoding;
  renderer.toneMapping=THREE.NoToneMapping;
  document.getElementById("stage").appendChild(renderer.domElement);

  camera=landCam=new THREE.PerspectiveCamera(37,window.innerWidth/window.innerHeight,1,1900);
  camera.position.set(-196,132,226);
  paperCam=new THREE.OrthographicCamera(-1,1,1,-1,1,600);
  MAPCAM.init(paperCam,{schedule:mapSchedule,panels:function(){ mlLegendFit(renderer.domElement.clientWidth||innerWidth,viewH()); return mlPanels(); },viewport:function(){ var e=renderer.domElement; return [e.clientWidth||innerWidth,e.clientHeight||innerHeight]; }});

  hemi=new THREE.HemisphereLight(0xA9BBCC,0x3E3A30,0.34); scene.add(hemi);
  /* a weak fill from opposite the sun so shaded slopes are dark, never black: since Stage 4B it turns with the light
     (placeLights) and its strength is the light table's (decision 70: it replaces the shadow toe) */
  fillLight=new THREE.DirectionalLight(0x9AA8B8,0.16);
  fillLight.position.set(80,60,-120); scene.add(fillLight);
  sun=new THREE.DirectionalLight(0xA5B2BE,0.40);
  sun.position.set(-140,92,-160); sun.castShadow=true;
  var shadowPx = lowTier ? 1024 : (renderer.capabilities.maxTextureSize>=8192 ? 4096 : 2048);
  sun.shadow.mapSize.set(shadowPx,shadowPx);
  sun.shadow.radius=1.5;
  var s=sun.shadow.camera;
  s.left=-118; s.right=118; s.top=108; s.bottom=-108; s.near=20; s.far=660;
  sun.shadow.bias=-0.0009;
  sun.shadow.normalBias=0.35;
  scene.add(sun); scene.add(sun.target); sun.target.position.set(0,0,0);

  world=buildWorld(scene);
  setFXEnabled(true);

  overlayRoot=new THREE.Group(); scene.add(overlayRoot);
  curOv=new THREE.Group(); overlayRoot.add(curOv);

  buildSunDisc();
  buildFormations();
  buildFeatureGlyphs();
  buildAnalysisLabels();
  buildEventLayer();
  buildUI();
  mlInit();

  camera.lookAt(orbitTarget);
  setMode("terrain");
  setClock(T_MIN,{instant:true,force:true});
  setCommandView("none");
  setPresentation("study");
  openFirstRun();
  var probs=auditMovement();
  if(probs.length){
    console.warn("Austerlitz movement audit: "+probs.length+" leg(s) need attention");
    probs.forEach(function(x){ console.warn("  ",x.id,x.leg,x.why,x.kmh?x.kmh.toFixed(2)+" km/h":""); });
  }
  loop();

  var b=document.getElementById("boot");
  requestAnimationFrame(function(){ b.style.opacity="0"; });
  setTimeout(function(){ if(b.parentNode) b.parentNode.removeChild(b); },900);
}

/* ---------------- formation state ---------------- */
function stateAt(id,ph){
  var f=FORMATIONS[id];
  if(!f.track) return null;
  var s={p:undefined,st:null,obj:null,act:null,cf:"B",actPhase:0,pPhase:0};
  for(var i=0;i<=ph;i++){
    var e=f.track[i]; if(!e) continue;
    if("p" in e){ s.p=e.p; s.pPhase=i; }
    if(e.st){ s.st=e.st; }
    if(e.obj){ s.obj=e.obj; }
    if(e.act){ s.act=e.act; s.actPhase=i; }
    if(e.cf){ s.cf=e.cf; }
  }
  return s;
}
function leavesOf(id,out){
  out=out||[];
  var f=FORMATIONS[id];
  if(f.track) out.push(id);
  if(f.children) f.children.forEach(function(k){ leavesOf(k,out); });
  return out;
}
function posOf(id,ph){ return posNow(id); }
function aggStrength(id){
  var f=FORMATIONS[id];
  if(f.strength) return f.strength;
  var t=0; leavesOf(id,[]).forEach(function(k){ t+=FORMATIONS[k].strength||0; });
  return t;
}
function aggStatus(id,ph){
  var f=FORMATIONS[id];
  if(f.track){ var s=stateAt(id,ph); return s?s.st:null; }
  var counts={},best=null,bn=0;
  leavesOf(id,[]).forEach(function(k){
    var s2=stateAt(k,ph); if(!s2||!s2.st) return;
    counts[s2.st]=(counts[s2.st]||0)+1;
    if(counts[s2.st]>bn){ bn=counts[s2.st]; best=s2.st; }
  });
  return best;
}
/* ---- the leaf rule: troops are counted once ----
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
}

/* ---------------- build 3D objects ---------------- */
/* ============================================================
   FORMATION MODELS
   A division is drawn as its battalions: separate blocks with intervals,
   echeloned into two lines when it is large enough, with a skirmish screen
   in front when it is going forward. Each formation's mass is one merged
   geometry with one baked texture, so a body of men costs a single draw call.
   ============================================================ */
var GEO={}, _smokeTex=null, _dustTex=null;
/* Stage 4E (docs/STAGE4_SPEC.md section G.2; owner decision 79): the sprite palette, one table: powder smoke, dust, and the trodden
   ground under a formation (values unchanged from the literals they replace) */
var SPRITE_COL={smoke:0xA9A69E, dust:0xC6BCA6, pad:0x2A2620};

function initBlockGeo(){
  GEO.shako  = new THREE.CylinderGeometry(0.16,0.18,0.28,6);
  GEO.bear   = new THREE.CylinderGeometry(0.18,0.19,0.42,6);
  GEO.musket = new THREE.BoxGeometry(0.05,1.15,0.05);
  GEO.sabre  = new THREE.BoxGeometry(0.05,1.05,0.05);
  GEO.body   = new THREE.BoxGeometry(0.30,0.92,0.22);
  GEO.horse  = new THREE.BoxGeometry(0.34,0.44,1.05);
  GEO.rider  = new THREE.BoxGeometry(0.30,0.62,0.26);
  GEO.barrel = new THREE.CylinderGeometry(0.09,0.115,1.50,8);
  GEO.wheel  = new THREE.CylinderGeometry(0.44,0.44,0.10,14);
  GEO.trail  = new THREE.BoxGeometry(0.20,0.18,1.60);
  GEO.limber = new THREE.BoxGeometry(1.05,0.58,0.75);
  GEO.tent   = new THREE.ConeGeometry(1.75,2.3,4);
  GEO.pole   = new THREE.CylinderGeometry(0.06,0.06,5.2,5);
  GEO.flag   = new THREE.PlaneGeometry(2.4,1.4);
}
function shade(hex,k){
  var r=Math.min(255,((hex>>16)&255)*k), g=Math.min(255,((hex>>8)&255)*k), b=Math.min(255,(hex&255)*k);
  return "rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
}
function srnd(i){ var v=Math.sin(i*127.1+i*i*0.017)*43758.5453; return v-Math.floor(v); }
function imesh(geo,colour,count){
  var m=new THREE.InstancedMesh(geo, matte({color:colour,flatShading:true}), count);
  m.castShadow=true; return m;
}

/* One atlas per formation: ranked men across the top half, the same body
   seen from above across the bottom half. No tiling, so no wrap artefacts. */
function formationAtlas(coat,arm,files){
  var c=document.createElement("canvas"); c.width=512; c.height=256;
  var x=c.getContext("2d");
  var dark=shade(coat,0.50), mid=shade(coat,0.82), hat="#1B1917", steel="#787C82";

  /* --- upper half: the rank in silhouette --- */
  x.clearRect(0,0,512,128);
  var step=512/files;
  for(var i=0;i<files;i++){
    var px=i*step+step/2, jy=((i*37)%5)-2, w=Math.max(6,step*0.52);
    if(arm==="cav"){
      x.fillStyle=shade(0x4A3A2C,0.70+((i*13)%5)*0.07);
      x.fillRect(px-w*0.9,58+jy,w*1.8,30);
      x.fillRect(px+w*0.5,40+jy,w*0.62,24);
      x.fillRect(px-w*0.8,88+jy,w*0.3,26); x.fillRect(px+w*0.5,88+jy,w*0.3,26);
      x.fillStyle=mid;  x.fillRect(px-w*0.3,28+jy,w*0.7,34);
      x.fillStyle=hat;  x.fillRect(px-w*0.3,16+jy,w*0.7,14);
      x.strokeStyle=steel; x.lineWidth=2;
      x.beginPath(); x.moveTo(px+w*0.4,32+jy); x.lineTo(px+w*1.1,2+jy); x.stroke();
    } else {
      x.fillStyle=dark; x.fillRect(px-w*0.5,50+jy,w,62);
      x.fillStyle=mid;  x.fillRect(px-w*0.5,50+jy,w,14);
      x.fillStyle=hat;  x.fillRect(px-w*0.36,24+jy,w*0.72,28);
      x.strokeStyle=steel; x.lineWidth=1.8;
      x.beginPath(); x.moveTo(px+w*0.42,56+jy); x.lineTo(px+w*0.95,4+jy); x.stroke();
    }
  }
  /* --- lower half: the same body from above --- */
  x.fillStyle=shade(coat,0.58); x.fillRect(0,128,512,128);
  for(var r=0;r<4;r++) for(var k=0;k<files;k++){
    var qx=k*step+step/2+((r*7)%9)-4, qy=128+r*30+16;
    x.fillStyle="#1D1B18";
    x.beginPath();
    if(arm==="cav") x.ellipse(qx,qy,step*0.20,13,0,0,Math.PI*2);
    else x.ellipse(qx,qy,Math.min(7,step*0.24),6.4,0,0,Math.PI*2);
    x.fill();
  }
  var t=ctexS(c); t.anisotropy=4;
  return t;
}
/* a box written straight into a shared buffer, UV-mapped to the atlas */
function pushBox(P,N,U,cx,cy,cz,w,h,dp){
  var x0=cx-w/2,x1=cx+w/2, y0=cy-h/2,y1=cy+h/2, z0=cz-dp/2,z1=cz+dp/2;
  var F=[
   [[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],[0,0,1],1],   /* front */
   [[x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],[0,0,-1],1],  /* back  */
   [[x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[1,0,0],1],   /* right */
   [[x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],[-1,0,0],1],  /* left  */
   [[x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],[0,1,0],0],   /* top   */
   [[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1],[0,-1,0],0]   /* base  */
  ];
  for(var f=0;f<F.length;f++){
    var q=F[f], n=q[4], upper=q[5];
    var v0=upper?0.52:0.02, v1=upper?0.98:0.48;
    var uv=[[0,v0],[1,v0],[1,v1],[0,v1]];
    var order=[0,1,2, 0,2,3];
    for(var o=0;o<6;o++){
      var idx=order[o];
      P.push(q[idx][0],q[idx][1],q[idx][2]);
      N.push(n[0],n[1],n[2]);
      U.push(uv[idx][0],uv[idx][1]);
    }
  }
}
/* how a formation is subdivided: battalions, or squadrons for horse */
function subUnits(f){
  var s=f.strength||3000;
  if(f.arm==="cav") return Math.max(2,Math.min(6,Math.round(s/950)));
  if(f.arm==="hq"||f.arm==="art") return 1;
  return Math.max(2,Math.min(7,Math.round(s/1150)));
}

/* ---- the figure kit: one merged geometry per kind, built once ----
   Everything is at the same symbolic scale as before (a man is 1.5 world units,
   the frontage is real). Two meshes per formation: the coats, coloured per
   instance, and everything else with its colours baked into the vertices. */
var FIG=null;
function figKit(){
  if(FIG) return FIG;
  function box(w,h,d){ return new THREE.BoxGeometry(w,h,d); }
  function part(geo,p,s,rot,col){ return {geo:geo,p:p,s:s||[1,1,1],rot:rot||[0,0,0],col:col}; }
  /* merges parts into one geometry with vertex colours; colour undefined = white (takes the instance colour) */
  function merge(parts){
    var P=[],N=[],C=[], m=new THREE.Matrix4(), q=new THREE.Quaternion(), e=new THREE.Euler(), v=new THREE.Vector3(), nrm=new THREE.Vector3();
    var white=new THREE.Color(1,1,1);
    parts.forEach(function(pt){
      var g=pt.geo.index?pt.geo.toNonIndexed():pt.geo;
      g.computeVertexNormals();
      e.set(pt.rot[0],pt.rot[1],pt.rot[2]); q.setFromEuler(e);
      m.compose(new THREE.Vector3(pt.p[0],pt.p[1],pt.p[2]), q, new THREE.Vector3(pt.s[0],pt.s[1],pt.s[2]));
      var nm=new THREE.Matrix3().getNormalMatrix(m);
      var pa=g.attributes.position.array, na=g.attributes.normal.array;
      var col=pt.col?lin(pt.col):white;
      for(var k=0;k<pa.length;k+=3){
        v.set(pa[k],pa[k+1],pa[k+2]).applyMatrix4(m); P.push(v.x,v.y,v.z);
        nrm.set(na[k],na[k+1],na[k+2]).applyMatrix3(nm).normalize(); N.push(nrm.x,nrm.y,nrm.z);
        C.push(col.r,col.g,col.b);
      }
    });
    var out=new THREE.BufferGeometry();
    out.setAttribute("position",new THREE.Float32BufferAttribute(P,3));
    out.setAttribute("normal",new THREE.Float32BufferAttribute(N,3));
    out.setAttribute("color",new THREE.Float32BufferAttribute(C,3));
    return out;
  }
  var head=new THREE.IcosahedronGeometry(0.115,1), shako=new THREE.CylinderGeometry(0.115,0.13,0.27,7);
  var SKIN=0xC9A98A, BLACK=0x1C1A17, WOOD=0x4A3826, STEEL=0x8A8E92, BREECH=0xBDB8AC, HORSE=0x5A4232, LEATHER=0x3A2E22;
  FIG={
    /* infantry: coat parts take the instance colour */
    infCoat: merge([
      part(box(0.36,0.56,0.24),[0,0.90,0]),                    /* torso */
      part(box(0.10,0.48,0.12),[-0.24,0.86,0.02]),              /* left arm */
      part(box(0.10,0.48,0.12),[ 0.24,0.88,0.06],[1,1,1],[-0.35,0,0])   /* right arm, holding the musket */
    ]),
    infFixed: merge([
      part(box(0.13,0.62,0.18),[-0.09,0.31,0],null,null,BREECH), part(box(0.13,0.62,0.18),[0.09,0.31,0],null,null,BREECH),
      part(head,[0,1.30,0],null,null,SKIN),
      part(shako,[0,1.50,0],null,null,BLACK),
      part(box(0.28,0.30,0.14),[0,0.96,-0.20],null,null,LEATHER),           /* pack */
      part(box(0.045,1.25,0.045),[0.27,1.12,0.12],null,[0.18,0,0.10],WOOD),  /* musket */
      part(box(0.03,0.32,0.03),[0.33,1.82,0.06],null,[0.18,0,0.10],STEEL)    /* bayonet */
    ]),
    /* cavalry: the horse is fixed, the rider's coat takes the instance colour */
    horse: merge([
      part(box(0.38,0.42,1.05),[0,0.78,0],null,null,HORSE),
      part(box(0.22,0.44,0.24),[0,1.10,0.56],null,[0.5,0,0],HORSE),          /* neck */
      part(box(0.18,0.20,0.36),[0,1.32,0.78],null,null,HORSE),               /* head */
      part(box(0.10,0.62,0.10),[-0.13,0.31,0.40],null,null,HORSE), part(box(0.10,0.62,0.10),[0.13,0.31,0.40],null,null,HORSE),
      part(box(0.10,0.62,0.10),[-0.13,0.31,-0.40],null,null,HORSE), part(box(0.10,0.62,0.10),[0.13,0.31,-0.40],null,null,HORSE),
      part(box(0.06,0.34,0.08),[0,0.80,-0.56],null,[0.6,0,0],BLACK),        /* tail */
      part(box(0.30,0.08,0.44),[0,1.01,0],null,null,LEATHER)                 /* saddle */
    ]),
    rider: merge([
      part(box(0.32,0.50,0.22),[0,1.30,0]),                                  /* coat */
      part(box(0.10,0.40,0.12),[-0.22,1.26,0]), part(box(0.10,0.40,0.12),[0.22,1.28,0.04],null,[-0.4,0,0])
    ]),
    riderFixed: merge([
      part(head,[0,1.68,0],null,null,SKIN), part(shako,[0,1.88,0],null,null,BLACK),
      part(box(0.11,0.34,0.14),[-0.14,0.98,0.05],null,[0.5,0,0],BREECH), part(box(0.11,0.34,0.14),[0.14,0.98,0.05],null,[0.5,0,0],BREECH),
      part(box(0.03,0.95,0.03),[0.28,1.55,0.10],null,[-0.55,0,0.15],STEEL)   /* sabre */
    ])
  };
  return FIG;
}

/* how a formation is subdivided: battalions, or squadrons for horse */
function subUnitsFig(f){ return subUnits(f); }

function makeBlock(f){
  var g=new THREE.Group();
  var body=new THREE.Group(), std=new THREE.Group();
  g.add(body); g.add(std);
  var coat=parseInt(NATION[f.nation].fill.slice(1),16);
  var d=new THREE.Object3D();
  var arm=f.arm, str=f.strength||3000, K=figKit();
  var ud={body:body, std:std, sw:1, sd:1, stdX:[], skirmish:null,
          deployed:null, limbered:null, W0:6, D0:4, figs:[], seat:[], lastSw:-1, lastSd:-1};

  /* one instanced mesh whose instances are laid out from a base position table,
     so column and line are re-layouts of the same men rather than a stretched box */
  function figMesh(geo,colour,pts,rotJitter){
    var m=new THREE.InstancedMesh(geo,matte({color:0xFFFFFF,vertexColors:true,flatShading:true}),Math.max(1,pts.length));
    m.castShadow=true; m.count=Math.max(1,pts.length);
    var base=new Float32Array(pts.length*3), rots=new Float32Array(pts.length), c=new THREE.Color();
    var tint=lin(colour);
    pts.forEach(function(pt,i){
      base[i*3]=pt[0]; base[i*3+1]=pt[1]; base[i*3+2]=pt[2];
      rots[i]=pt[3]+(srnd(i*13+7)-0.5)*(rotJitter||0);
      c.copy(tint).multiplyScalar(0.86+0.28*srnd(i*7+3));
      if(colour!==0xFFFFFF) m.setColorAt(i,c);
    });
    if(m.instanceColor) m.instanceColor.needsUpdate=true;
    body.add(m);
    ud.figs.push({mesh:m,base:base,rots:rots,n:pts.length,src:pts});
    return m;
  }
  /* anything else that stands on the ground - skirmishers, gun crews, teams, guns, limbers, tents -
     is registered with its designed layout, and re-seated with the men */
  var _pv0=new THREE.Vector3(), _sv0=new THREE.Vector3(), _qr=new THREE.Quaternion(), _mm=new THREE.Matrix4();
  function seatable(mesh,shape,upright){
    var n=mesh.count, P=new Float32Array(n*3), R=new Float32Array(n*4), S=new Float32Array(n*3);
    for(var i=0;i<n;i++){
      mesh.getMatrixAt(i,_mm); _mm.decompose(_pv0,_qr,_sv0);
      P[i*3]=_pv0.x; P[i*3+1]=_pv0.y; P[i*3+2]=_pv0.z;
      R[i*4]=_qr.x; R[i*4+1]=_qr.y; R[i*4+2]=_qr.z; R[i*4+3]=_qr.w;
      S[i*3]=_sv0.x; S[i*3+1]=_sv0.y; S[i*3+2]=_sv0.z;
    }
    ud.seat.push({mesh:mesh,n:n,P:P,R:R,S:S,shape:!!shape,upright:!!upright});
    return mesh;
  }
  /* Seating, in world space, on the ground as drawn (groundY). Each man keeps the world x,z his
     place in the (tilted, scaled) block gives him, is set on the drawn ground at that x,z, and the
     point is mapped back into the block's frame through the inverse of its world matrix. That is
     exact under any block scale (highlight dimming, hybrid mode), tilt or deployment, with no
     iteration - an earlier fixed-point version diverged where the 10x relief is steeper than 45
     degrees. Before Stage 0 the error was written in unscaled and untilted, and only refreshed
     when the block moved 1.5 units or turned: men stood up to 16 units off the ground on the
     Pratzeberg. Men and horses now stand with gravity; guns, limbers and tents keep the slope. */
  var _wp=new THREE.Vector3(), _up0=new THREE.Vector3(0,1,0), _nb=new THREE.Vector3(), _inv=new THREE.Matrix4(),
      _gl=new THREE.Vector3(), _qt0=new THREE.Quaternion(), _qc=new THREE.Quaternion(), _qa=new THREE.Quaternion(), _one=new THREE.Vector3(1,1,1);
  function seatPrep(){ g.updateMatrixWorld(true); _inv.copy(g.matrixWorld).invert(); }
  function seatLocal(lx,lz,out){
    _wp.set(lx,0,lz).applyMatrix4(g.matrixWorld);
    _wp.y=groundY(_wp.x,_wp.z);
    return out.copy(_wp).applyMatrix4(_inv);
  }
  /* the block's rotation is tilt x yaw; this is the local rotation that undoes the tilt and keeps the yaw */
  function uprightQuat(){
    _nb.copy(_up0).applyQuaternion(g.quaternion).normalize();
    _qt0.setFromUnitVectors(_up0,_nb).invert();
    return _qc.copy(g.quaternion).invert().multiply(_qt0).multiply(g.quaternion);
  }
  function layoutFigs(sw,sd){
    seatPrep();
    var C=uprightQuat(), cache=new Map();
    ud.figs.forEach(function(fg){
      var L=cache.get(fg.src);
      if(!L){
        L=new Float32Array(fg.n*3);
        for(var i=0;i<fg.n;i++){ seatLocal(fg.base[i*3]*sw,fg.base[i*3+2]*sd,_gl); L[i*3]=_gl.x; L[i*3+1]=_gl.y; L[i*3+2]=_gl.z; }
        cache.set(fg.src,L);
      }
      for(var j=0;j<fg.n;j++){
        _qa.setFromAxisAngle(_up0,fg.rots[j]).premultiply(C);
        _pv0.set(L[j*3], L[j*3+1]+fg.base[j*3+1], L[j*3+2]);
        _mm.compose(_pv0,_qa,_one);
        fg.mesh.setMatrixAt(j,_mm);
      }
      fg.mesh.instanceMatrix.needsUpdate=true;
    });
    ud.seat.forEach(function(st){
      for(var i=0;i<st.n;i++){
        var lx=st.shape?st.P[i*3]*sw:st.P[i*3], lz=st.shape?st.P[i*3+2]*sd:st.P[i*3+2];
        seatLocal(lx,lz,_gl);
        _pv0.set(_gl.x, _gl.y+st.P[i*3+1], _gl.z);
        _qa.set(st.R[i*4],st.R[i*4+1],st.R[i*4+2],st.R[i*4+3]);
        if(st.upright) _qa.premultiply(C);
        _sv0.set(st.S[i*3],st.S[i*3+1],st.S[i*3+2]);
        _mm.compose(_pv0,_qa,_sv0);
        st.mesh.setMatrixAt(i,_mm);
      }
      st.mesh.instanceMatrix.needsUpdate=true;
    });
    SEAT_STATS.blocks++;
  }
  ud.layout=layoutFigs;
  ud.seatPrep=seatPrep;
  ud.seatLocal=seatLocal;
  ud.upright=uprightQuat;
  /* show only the battalions that are this formation's own troops (a detachment drawn separately is not drawn twice) */
  ud.showBattalions=function(k){
    if(!ud.batFigs||!ud.perBat) return;
    k=Math.max(1,Math.min(ud.nBat,k));
    ud.batFigs.forEach(function(fg){ fg.mesh.count=Math.max(1,k*ud.perBat); });
    ud.shownBat=k;
  };

  if(arm==="hq"){
    ud.W0=6.0; ud.D0=5.0;
    var marq=new THREE.Mesh(GEO.tent, matte({color:0xD8D1BC,flatShading:true}));
    marq.position.y=1.28; marq.castShadow=true; body.add(marq);
    var tents=imesh(GEO.tent,0xC4BCA6,4);
    for(var t0=0;t0<4;t0++){
      var ta=t0/4*Math.PI*2+0.6;
      d.scale.set(0.5,0.5,0.5); d.rotation.set(0,ta,0);
      d.position.set(Math.cos(ta)*3.1,0.6,Math.sin(ta)*2.4); d.updateMatrix();
      tents.setMatrixAt(t0,d.matrix);
    }
    body.add(tents); seatable(tents,false,true);
    var esc=[], escR=[];
    for(var e=0;e<12;e++){
      var a=e/12*Math.PI*2, rr=3.6+srnd(e)*1.0;
      esc.push([Math.cos(a)*rr,0,Math.sin(a)*rr*0.75,a+1.57]);
    }
    figMesh(K.horse,0xFFFFFF,esc,0.3); figMesh(K.rider,coat,esc,0.3); figMesh(K.riderFixed,0xFFFFFF,esc,0.3);
    ud.stdX=[0];
  }
  else if(arm==="art"){
    var guns=Math.max(3,Math.min(8,Math.round((f.guns||12)/2)));
    ud.W0=guns*2.7; ud.D0=6.0;
    var dep=new THREE.Group(), lim=new THREE.Group();
    body.add(dep); body.add(lim);
    ud.deployed=dep; ud.limbered=lim;
    var bar=imesh(GEO.barrel,0x35322C,guns), whl=imesh(GEO.wheel,0x6B563C,guns*2), tra=imesh(GEO.trail,0x5A4832,guns);
    var nw=0, crew=[];
    for(var q=0;q<guns;q++){
      var gx=(q-(guns-1)/2)*2.7, jz=(srnd(q)-0.5)*0.6;
      d.scale.set(1.35,1.35,1.35);
      d.position.set(gx,0.95,jz); d.rotation.set(1.5708,0,0); d.updateMatrix(); bar.setMatrixAt(q,d.matrix);
      d.position.set(gx,0.62,jz-1.15); d.rotation.set(0,0,0); d.updateMatrix(); tra.setMatrixAt(q,d.matrix);
      for(var sg=-1;sg<=1;sg+=2){
        d.position.set(gx+sg*0.72,0.60,jz-0.15); d.rotation.set(0,0,1.5708);
        d.updateMatrix(); whl.setMatrixAt(nw++,d.matrix);
      }
      for(var k2=0;k2<5;k2++) crew.push([gx-1.1+srnd(q*7+k2)*2.2, 0, jz-1.6-srnd(q*3+k2)*1.2, (srnd(q*5+k2)-0.5)*1.2]);
    }
    dep.add(bar); dep.add(whl); dep.add(tra);
    seatable(bar,false,false); seatable(whl,false,false); seatable(tra,false,false);
    /* crews: the same figure kit, parented to the deployed group so they limber up with the guns */
    var cM=new THREE.InstancedMesh(K.infCoat,matte({color:0xFFFFFF,vertexColors:true,flatShading:true}),crew.length);
    var fM=new THREE.InstancedMesh(K.infFixed,matte({color:0xFFFFFF,vertexColors:true,flatShading:true}),crew.length);
    var cc=new THREE.Color(), tint=lin(coat);
    crew.forEach(function(pt,i){
      d.position.set(pt[0],pt[1],pt[2]); d.rotation.set(0,pt[3],0); d.scale.set(1,1,1); d.updateMatrix();
      cM.setMatrixAt(i,d.matrix); fM.setMatrixAt(i,d.matrix);
      cc.copy(tint).multiplyScalar(0.86+0.28*srnd(i*7+3)); cM.setColorAt(i,cc);
    });
    if(cM.instanceColor) cM.instanceColor.needsUpdate=true;
    cM.castShadow=fM.castShadow=true;
    dep.add(cM); dep.add(fM); seatable(cM,false,true); seatable(fM,false,true);
    /* the same battery hitched up and on the move */
    var lb=imesh(GEO.limber,0x6A5741,guns), lw=imesh(GEO.wheel,0x6B563C,guns*4), lbar=imesh(GEO.barrel,0x35322C,guns);
    var mw=0, team=[];
    for(var q2=0;q2<guns;q2++){
      var lx=(q2-(guns-1)/2)*2.7;
      d.scale.set(1.35,1.35,1.35); d.rotation.set(0,0,0);
      d.position.set(lx,0.68,0.5); d.updateMatrix(); lb.setMatrixAt(q2,d.matrix);
      d.position.set(lx,0.92,-1.9); d.rotation.set(1.5708,0,0); d.updateMatrix(); lbar.setMatrixAt(q2,d.matrix);
      d.rotation.set(0,0,1.5708);
      for(var sg2=-1;sg2<=1;sg2+=2){
        d.position.set(lx+sg2*0.72,0.60,0.5); d.updateMatrix(); lw.setMatrixAt(mw++,d.matrix);
        d.position.set(lx+sg2*0.72,0.60,-2.2); d.updateMatrix(); lw.setMatrixAt(mw++,d.matrix);
      }
      for(var hz=0;hz<2;hz++) team.push([lx-0.25+hz*0.5,0,2.2+hz*0.2,0]);
      for(var hz2=0;hz2<2;hz2++) team.push([lx-0.25+hz2*0.5,0,3.5+hz2*0.2,0]);
    }
    lim.add(lb); lim.add(lw); lim.add(lbar);
    seatable(lb,false,false); seatable(lw,false,false); seatable(lbar,false,false);
    var hM=new THREE.InstancedMesh(K.horse,matte({color:0xFFFFFF,vertexColors:true,flatShading:true}),team.length);
    team.forEach(function(pt,i){ d.position.set(pt[0],pt[1],pt[2]); d.rotation.set(0,pt[3],0); d.scale.set(1,1,1); d.updateMatrix(); hM.setMatrixAt(i,d.matrix); });
    hM.castShadow=true; lim.add(hM); seatable(hM,false,true);
    lim.visible=false;
    ud.stdX=[0];
  }
  else {
    var cav=(arm==="cav"), mixed=(arm==="mixed");
    var n=subUnits(f);
    var bw = cav?3.0:2.7, bd = cav?2.3:1.6;
    var gap = cav?1.4:1.0;
    var front = (n>=5) ? Math.ceil(n*0.6) : n, back=n-front;
    var rowW=function(k){ return k*bw+(k-1)*gap; };
    var W1=rowW(front), W2=back?rowW(back):0;
    ud.W0=Math.max(W1,W2); ud.D0=back?(bd*2+3.4):bd;
    var stdAt=[], pts=[];
    var files=cav?5:8, ranks=cav?2:3;
    function fill(bcx,bcz){
      for(var r=0;r<ranks;r++) for(var k3=0;k3<files;k3++){
        var X=bcx-bw/2+bw*(k3+0.5)/files+(srnd(pts.length)-0.5)*0.10;
        var Z=bcz+bd/2-bd*(r+0.5)/ranks+(srnd(pts.length+41)-0.5)*0.08;
        pts.push([X,0,Z,0]);
      }
    }
    for(var i=0;i<front;i++){
      var cx2=-W1/2+bw/2+i*(bw+gap);
      fill(cx2, back?1.7:0);
      if(i%2===0) stdAt.push(cx2);
    }
    for(var j2=0;j2<back;j2++){
      var cx3=-W2/2+bw/2+j2*(bw+gap)+(bw+gap)*0.5;
      fill(cx3,-1.7);
    }
    ud.perBat=files*ranks; ud.nBat=n; ud.batFigs=[];
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
      ud.batFigs=ud.figs.slice(-2);
      /* voltigeurs thrown out in front when the formation is going forward */
      var sk=[];
      for(var v=0;v<16;v++) sk.push([(srnd(v*3)-0.5)*ud.W0*1.06,0,ud.D0*0.5+2.4+srnd(v*5)*3.0,(srnd(v)-0.5)*1.2]);
      var skC=new THREE.InstancedMesh(K.infCoat,matte({color:0xFFFFFF,vertexColors:true,flatShading:true}),sk.length);
      var skF=new THREE.InstancedMesh(K.infFixed,matte({color:0xFFFFFF,vertexColors:true,flatShading:true}),sk.length);
      var cs=new THREE.Color(), ts=lin(coat);
      sk.forEach(function(pt,i){
        d.position.set(pt[0],pt[1],pt[2]); d.rotation.set(0,pt[3],0); d.scale.set(1,1,1); d.updateMatrix();
        skC.setMatrixAt(i,d.matrix); skF.setMatrixAt(i,d.matrix);
        cs.copy(ts).multiplyScalar(0.9+0.2*srnd(i)); skC.setColorAt(i,cs);
      });
      if(skC.instanceColor) skC.instanceColor.needsUpdate=true;
      skC.castShadow=skF.castShadow=true;
      var screen=new THREE.Group(); screen.add(skC); screen.add(skF);
      screen.visible=false; body.add(screen); ud.skirmish=screen;
      seatable(skC,false,true); seatable(skF,false,true);
      /* two mounted officers on the flanks */
      var off=[[-(ud.W0*0.5+1.5),0,ud.D0*0.5+0.9,0],[ud.W0*0.5+1.5,0,ud.D0*0.5+0.9,0]];
      figMesh(K.horse,0xFFFFFF,off,0); figMesh(K.rider,coat,off,0); figMesh(K.riderFixed,0xFFFFFF,off,0);
    }
    if(f.battery){   /* an attached battery in front of the infantry (the Santon's eighteen guns) */
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
      seatable(bb,false,false); seatable(bwl,false,false); seatable(btr,false,false);
    }
    if(mixed){
      var sq=Math.max(5,Math.min(9,Math.round(str/850))), hp=[];
      for(var q3=0;q3<sq;q3++) hp.push([(q3-(sq-1)/2)*1.15,0,-ud.D0*0.5-2.4,0]);
      figMesh(K.horse,0xFFFFFF,hp,0.1); figMesh(K.rider,coat,hp,0.1); figMesh(K.riderFixed,0xFFFFFF,hp,0.1);
    }
    ud.stdX = cav ? [0] : stdAt;
    ud.mounted = cav;   /* the standard's reference height: the mounted figure */
  }
  layoutFigs(1,1);

  /* standards: the cloth carries the nation, and never distorts with the deployment */
  var nStd=Math.max(1,ud.stdX.length);
  var poles=imesh(GEO.pole,0x6A5B48,nStd);
  var flags=new THREE.InstancedMesh(GEO.flag,
    matte({map:flagTexture(f.nation),side:THREE.DoubleSide}),nStd);
  std.add(poles); std.add(flags);
  ud.poles=poles; ud.flags=flags;
  g.userData=ud;
  placeStandards(g,1);
  return g;
}
/* national colours, painted once per nation */
var _flagTex={};
function flagTexture(nation){
  if(_flagTex[nation]) return _flagTex[nation];
  var c=document.createElement("canvas"); c.width=128; c.height=64;
  var x=c.getContext("2d");
  if(nation==="fr"){
    x.fillStyle="#2C4C9C"; x.fillRect(0,0,43,64); x.fillStyle="#E9E2D2"; x.fillRect(43,0,43,64); x.fillStyle="#B3302E"; x.fillRect(86,0,42,64);
  } else if(nation==="ru"){
    x.fillStyle="#2E7A48"; x.fillRect(0,0,128,64); x.fillStyle="#E9E2D2";
    x.fillRect(0,26,128,12); x.fillRect(58,0,12,64);            /* a green colour with a white cross */
  } else {
    x.fillStyle="#E9E2D2"; x.fillRect(0,0,128,64);
    x.fillStyle="#C8A03A"; x.fillRect(0,0,128,10); x.fillRect(0,54,128,10);   /* Austrian: white with a gold border */
    x.fillStyle="#2A2622"; x.beginPath(); x.arc(64,32,11,0,Math.PI*2); x.fill();
  }
  x.fillStyle="rgba(0,0,0,.12)"; for(var k=0;k<128;k+=4) x.fillRect(k,0,1,64);   /* a little cloth */
  var t=ctexS(c); _flagTex[nation]=t; return t;
}
/* standards stand on the drawn ground and upright, like the men who carry them. Stage 2B (decisions 26 and 36):
   they join the figure scale at a PROVISIONAL pole-top-to-figure ratio of 1.6, a design rule, not a historical
   value: the shortest pole whose cloth, in today's proportions, clears the heads of the ranks (cloth bottom at
   least 1.05 figure heights). Provisional (Stage 2): to be replaced by a sourced ratio in Stage 6. The pole, its
   thickness, the cloth and the hanging offsets scale together; cavalry use the mounted figure's height. */
var STD_RATIO=1.6, STD_POLE=5.2;
var _figTop={};
function figureTop(mounted){
  var k=mounted?"m":"f"; if(_figTop[k]) return _figTop[k];
  var K=figKit(), top=0;
  (mounted?[K.horse,K.rider,K.riderFixed]:[K.infCoat,K.infFixed]).forEach(function(g){ if(g.computeBoundingBox) g.computeBoundingBox(); if(g.boundingBox) top=Math.max(top,g.boundingBox.max.y); });
  return (_figTop[k]=top);
}
var _stQ=new THREE.Quaternion(), _stZ=new THREE.Quaternion(), _stP=new THREE.Vector3(), _stO=new THREE.Vector3(),
    _stS=new THREE.Vector3(), _stM=new THREE.Matrix4(), _stAx=new THREE.Vector3(0,0,1), _stG=new THREE.Vector3();
function placeStandards(g,sw,tilt){
  var ud=g.userData;
  tilt=tilt||0;
  var tall=(ud.body&&ud.body.children.length&&ud.stdX.length===1&&!ud.skirmish)?1.25:1;
  var k=STD_RATIO*figureTop(!!ud.mounted)/(STD_POLE*tall);   /* one ratio for every block */
  ud.stdScale=k; ud.stdTall=tall;
  if(ud.seatPrep) ud.seatPrep(); else g.updateMatrixWorld(true);
  var C=ud.upright?_stQ.copy(ud.upright()):_stQ.identity();
  for(var i=0;i<ud.stdX.length;i++){
    var X=ud.stdX[i]*sw;
    if(ud.seatLocal) ud.seatLocal(X,0,_stG); else _stG.set(X,0,0);
    _stO.set(0,STD_POLE/2*tall*k,0).applyQuaternion(C);
    _stP.copy(_stG).add(_stO);
    _stM.compose(_stP,C,_stS.set(k,tall*k,k)); ud.poles.setMatrixAt(i,_stM);
    _stO.set(1.25*k*Math.cos(tilt),4.5*tall*k-1.25*k*Math.sin(tilt),0).applyQuaternion(C);
    _stP.copy(_stG).add(_stO);
    _stZ.setFromAxisAngle(_stAx,-tilt).premultiply(C);
    _stM.compose(_stP,_stZ,_stS.set(k,k,k)); ud.flags.setMatrixAt(i,_stM);
  }
  ud.poles.instanceMatrix.needsUpdate=true;
  ud.flags.instanceMatrix.needsUpdate=true;
}
/* multiply a canvas's alpha by a round window that is zero at every edge, so whatever overlaps
   inside it the sprite can never show a straight side */
function softWindow(x,n){
  x.globalCompositeOperation="destination-in";
  var w=x.createRadialGradient(n/2,n/2,n*0.24,n/2,n/2,n*0.49);
  w.addColorStop(0,"rgba(0,0,0,1)"); w.addColorStop(1,"rgba(0,0,0,0)");
  x.fillStyle=w; x.fillRect(0,0,n,n);
  x.globalCompositeOperation="source-over";
}
/* the highest drawn ground under a camera-facing sprite, across its width */
var _sfR=new THREE.Vector3();
function spriteFloor(x,z,half){
  _sfR.setFromMatrixColumn(camera.matrixWorld,0); _sfR.y=0;
  var L=_sfR.length()||1; _sfR.multiplyScalar(1/L);
  var m=groundY(x,z);
  for(var k=-2;k<=2;k++){ if(k) m=Math.max(m,groundY(x+_sfR.x*half*k/2,z+_sfR.z*half*k/2)); }
  return m;
}
function smokeTexture(){
  if(_smokeTex) return _smokeTex;
  var c=document.createElement("canvas"); c.width=c.height=128;
  var x=c.getContext("2d");
  for(var i=0;i<10;i++){
    /* the same ten puffs, pulled inside the canvas: before, several were cut off by the left and
       bottom edges, so the sprite showed a straight translucent edge - a card */
    var r=15+((i*29)%30)*0.7, px=26+((i*37)%74), py=38+((i*53)%62);
    px=Math.max(r+2,Math.min(126-r,px)); py=Math.max(r+2,Math.min(126-r,py));
    var gr=x.createRadialGradient(px,py,1,px,py,r);
    gr.addColorStop(0,"rgba(255,255,255,.32)");
    gr.addColorStop(1,"rgba(255,255,255,0)");
    x.fillStyle=gr; x.beginPath(); x.arc(px,py,r,0,Math.PI*2); x.fill();
  }
  softWindow(x,128);
  /* Stage 4E (docs/STAGE4_SPEC.md section E.2): a puff fades toward its lower edge, so where it stands near a slope it thins
     into the ground's air instead of ending on a line */
  x.globalCompositeOperation="destination-in";
  var vg=x.createLinearGradient(0,0,0,128); vg.addColorStop(0,"rgba(0,0,0,1)"); vg.addColorStop(0.55,"rgba(0,0,0,1)"); vg.addColorStop(1,"rgba(0,0,0,0)");
  x.fillStyle=vg; x.fillRect(0,0,128,128); x.globalCompositeOperation="source-over";
  _smokeTex=ctexS(c); return _smokeTex;
}
var _padTex=null;
var PAD_GEO=(function(){ var g=new THREE.PlaneGeometry(1,1); g.rotateX(-Math.PI/2); return g; })();

/* ---- the footprint (Stage 2B, owner decision 34) ----
   A formation's modelled ground extent, frontage W0 x sw by depth D0 x sd (the block's own layout, at ground
   scale), draped on the drawn ground in its side's colour. One primitive: true scale draws formations as
   footprints now, and Stage 5's spatial-confidence display is meant to reuse it. */
function makeFootprint(hex,opacity){
  var g=new THREE.PlaneGeometry(1,1,6,4); g.rotateX(-Math.PI/2);
  var m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:lin(hex),transparent:true,opacity:opacity||0.85,
    depthWrite:false,side:THREE.DoubleSide,fog:false}));
  m.userData.base=Float32Array.from(g.attributes.position.array); m.renderOrder=4; m.frustumCulled=false;
  return m;
}
function placeFootprint(m,x,z,yaw,w,d,lift){
  var P=m.geometry.attributes.position, B=m.userData.base, c=Math.cos(yaw), sn=Math.sin(yaw);
  for(var i=0;i<P.count;i++){
    var lx=B[i*3]*w, lz=B[i*3+2]*d, wx=x+lx*c+lz*sn, wz=z-lx*sn+lz*c;
    P.setXYZ(i,wx,groundY(wx,wz)+lift,wz);
  }
  P.needsUpdate=true; if(m.geometry.computeBoundingSphere) m.geometry.computeBoundingSphere();
}
/* true scale (decision 34): at 1x the relief is honest and every symbol would stand taller than it, so the
   figure-scale and landscape-scale layers are not drawn; formations are drawn as their footprints */
function isTrueScale(){ return DISPLAY.factor===1; }
function landscapeVisible(){ return mode!=="staff" && !isTrueScale(); }
function syncLandscapeLayers(){
  var on=landscapeVisible();
  world.trees.visible=on; world.conifers.visible=on;
  if(world.scrub) world.scrub.visible=on;
  world.roofs.visible=on; world.spires.visible=on;
  if(world.chimneys) world.chimneys.visible=on;
  world.houses.visible=!isTrueScale()&&mode!=="staff";   /* the paper map draws the villages as flat footprints (Stage 2E) */
  if(world.paper) world.paper.visible=(mode==="staff");
}
/* ---- the display factor (Stage 2B; owner decisions 19 and 35) ----
   Presentation only: the model, GEOREF.EXAG and every model-unit value are unchanged. Everything built once on
   the ground is redrawn or re-seated (rescaleWorld in world.js; label anchors, glyphs and the plateau ring keep their
   height above the ground); overlays and plans are rebuilt; the camera keeps its height above the ground.
   Returns the time the change took, in ms.
   Stage 2E: the paper map draws the ground flat whatever the setting (decision 19): while it is shown a change of the
   setting is recorded for the landscape and nothing is redrawn; entering and leaving it redraw the ground (setDrawnFlat). */
function setDisplayFactor(f){
  if(!(f>0)||f===DISPLAY.factor) return 0;
  if(DISPLAY.flat){ DISPLAY.factor=f; syncLandscapeLayers(); paintExaggeration(); return 0; }
  return redrawGround(function(){ DISPLAY.factor=f; });
}
function setDrawnFlat(on){ return DISPLAY.flat===on ? 0 : redrawGround(function(){ DISPLAY.flat=on; }); }
function redrawGround(change){
  var t0=performance.now(), hold=[];
  function keep(v){ if(v) hold.push([v,v.y-displayHeight(v.x,v.z)]); }
  placeLabels.forEach(function(o){ keep(o.world); });
  eventMarks.forEach(function(k){ keep(k.sp.position); keep(k.world); });
  terrainLabels.forEach(function(o){ keep(o.world); });
  if(plateauRing&&!plateauRing.userData.seatOff) seatGeometry(plateauRing);
  keep(orbitTarget); keep(landCam.position);
  change();
  rescaleWorld();
  hold.forEach(function(h){ h[0].y=displayHeight(h[0].x,h[0].z)+h[1]; });
  if(plateauRing) reseatGeometry(plateauRing);
  tween=null; camArc=null;
  landCam.lookAt(orbitTarget); clampCamera();
  rebuildOverlays(curPhase,true);
  if(planSide){ var ps=planSide, fc=freeCam; planSide=null; freeCam=true; setPlan(ps); freeCam=fc; }
  Object.keys(units).forEach(function(id){ var r=units[id]; r.seated=false; r.trailU=undefined; });
  syncLandscapeLayers();
  paintExaggeration();
  if(selection) paintDrawer();
  var md=document.getElementById("modal"); if(md&&md.classList.contains("on")&&md.dataset.sources) openSources();
  requestRender(4);
  DISPLAY.lastMs=performance.now()-t0;
  return DISPLAY.lastMs;
}
/* the relief control and its legend line: the factor stated relative to true scale, and the two symbol scales */
/* A factor change is not offered during playback when it takes over 100 ms on the harness machine. Measured in
   Stage 2B (tools/stage2/renders-2b.js, headless Chromium, software rendering): 186-421 ms over two runs of nine
   changes each, so the control is disabled while the battle plays. */
var EXAG_SLOW_MS=100, EXAG_MEASURED_MS=215;
function bindExaggeration(){
  var set=document.getElementById("exag-set"); if(!set) return;
  set.innerHTML=DISPLAY.settings.map(function(x){
    return '<button class="t exag-btn" type="button" data-x="'+x+'" aria-pressed="false">'+fmtFactor(x)+'\u00d7'+(x===1?' true':'')+'</button>'; }).join("");
  set.querySelectorAll(".exag-btn").forEach(function(b){
    b.addEventListener("click",function(){ if(b.disabled) return; setDisplayFactor(+b.dataset.x); });
  });
  paintExaggeration();
}
function fmtFactor(f){ return f===1?"1":(Math.round(f*100)/100).toString(); }
function paintExaggeration(){
  var f=DISPLAY.factor, paper=(mode==="staff");
  document.querySelectorAll(".exag-btn").forEach(function(b){
    b.setAttribute("aria-pressed",+b.dataset.x===f?"true":"false");
    b.disabled=playing&&EXAG_MEASURED_MS>EXAG_SLOW_MS;
    b.title=b.disabled?"Pause to change the relief (a change takes about "+EXAG_MEASURED_MS+" ms)":"";
  });
  /* the paper map has no relief setting (decision 19): the control is not offered there, and its row says why */
  var set=document.getElementById("exag-set"), desc=document.getElementById("exag-desc");
  if(set) set.hidden=paper;
  if(desc) desc.textContent=paper?"The paper map is drawn flat, with its own hillshade (\u00d7"+fmtFactor(PAPER_HILLSHADE)+"); the setting applies to the landscape"
    :"How tall the ground is drawn; 1\u00d7 is true scale";
  var el=document.getElementById("exag-line"), sy=document.getElementById("exag-symbols");
  /* the paper map (Stage 2E, decisions 19 and 29): its hillshade's own factor; it draws no figure, building or tree */
  if(paper){ if(el) el.textContent="paper map: the ground drawn flat, in plan; hillshade exaggerated \u00d7"+fmtFactor(PAPER_HILLSHADE)+" (1\u00d7 is true scale)";
    if(sy) sy.textContent="villages and woods at their extent in the model; counters and names at symbol scale"; return; }
  if(el) el.textContent = isTrueScale()
    ? "relief at true scale: formations drawn as their footprints"
    : "relief drawn \u00d7"+fmtFactor(f)+" vertically (1\u00d7 is true scale)";
  if(sy) sy.textContent = isTrueScale() ? "counters and names at symbol scale"
    : "symbols: figures and standards about 45\u201370\u00d7 life, buildings and trees about 10\u201315\u00d7";
}
function padTexture(){
  if(_padTex) return _padTex;
  var c=document.createElement("canvas"); c.width=c.height=128;
  var x=c.getContext("2d");
  var gr=x.createRadialGradient(64,64,10,64,64,64);
  gr.addColorStop(0,"rgba(0,0,0,.55)"); gr.addColorStop(0.55,"rgba(0,0,0,.30)"); gr.addColorStop(1,"rgba(0,0,0,0)");
  x.fillStyle=gr; x.fillRect(0,0,128,128);
  _padTex=ctex(c); return _padTex;
}
function dustTexture(){
  if(_dustTex) return _dustTex;
  var c=document.createElement("canvas"); c.width=c.height=128;
  var x=c.getContext("2d");
  for(var i=0;i<7;i++){
    var r=18+((i*23)%26)*0.7, px=20+((i*43)%88), py=64+((i*31)%46);
    px=Math.max(r+2,Math.min(126-r,px)); py=Math.max(r+2,Math.min(126-r,py));
    var gr=x.createRadialGradient(px,py,1,px,py,r);
    gr.addColorStop(0,"rgba(255,255,255,.22)");
    gr.addColorStop(1,"rgba(255,255,255,0)");
    x.fillStyle=gr; x.beginPath(); x.arc(px,py,r,0,Math.PI*2); x.fill();
  }
  softWindow(x,128);
  _dustTex=ctexS(c); return _dustTex;
}

/* column of march, deployed line, or coming apart */
var SHAPE={
  march:[0.40,2.55], countermarch:[0.42,2.40], advancing:[0.58,1.85],
  attacking:[1.16,0.82], charging:[1.30,0.76], counterattack:[1.18,0.80],
  holding:[1.00,1.00], engaged:[1.06,0.96], supporting:[0.88,1.24],
  forming:[0.86,1.22], reserve:[0.68,1.62], concealed:[0.74,1.52],
  observing:[1.00,1.00], fortifying:[1.00,1.00], delayed:[0.84,1.34],
  surprised:[0.94,1.12], withdrawing:[0.66,1.62], retreating:[0.56,1.82],
  repulsed:[0.76,1.50], broken:[1.40,1.40], encircled:[1.26,1.26],
  pursuing:[0.82,1.42], captured:[1.00,1.00]
};
var SKIRMISH={attacking:1,advancing:1,engaged:1,charging:1,counterattack:1,pursuing:1};
var LOOSE={broken:1,encircled:1,repulsed:1,retreating:1};
function shapeFor(st){ return SHAPE[st]||[1,1]; }
function buildFormations(){
  initBlockGeo();
  var d=new THREE.Object3D();

  Object.keys(FORMATIONS).forEach(function(id){
    var f=FORMATIONS[id];
    var isLeaf=!!f.track;
    var hsh=0; for(var q=0;q<id.length;q++) hsh=(hsh*31+id.charCodeAt(q))%997;
    var rec={id:id, f:f, leaf:isLeaf, delay:(hsh%100)/100*0.20, trailOn:false};   /* its counter and name are the map layer's (Stage 2D) */

    if(isLeaf){
      var g=makeBlock(f);
      g.visible=false; scene.add(g);
      rec.block=g;

      /* powder smoke where a formation is fighting: since Stage 4E a few puffs along its front (SMOKE) */
      var sm=new THREE.Group(); sm.visible=false;
      for(var pf=0;pf<SMOKE.PUFFS;pf++){ var sp=new THREE.Sprite(new THREE.SpriteMaterial({
          map:smokeTexture(), transparent:true, opacity:0, depthWrite:false, color:lin(SPRITE_COL.smoke) }));
        sp.renderOrder=6; sm.add(sp); }
      scene.add(sm); rec.smoke=sm;

      /* the ground under the formation: trodden, occluded, in contact */
      var pad=new THREE.Mesh(PAD_GEO,
        new THREE.MeshBasicMaterial({map:padTexture(),transparent:true,opacity:0.66,
          depthWrite:false,color:lin(SPRITE_COL.pad)}));
      pad.renderOrder=3; pad.visible=false;
      scene.add(pad); rec.pad=pad;

      /* dust kicked up by horse and by teams on the move */
      var du=new THREE.Sprite(new THREE.SpriteMaterial({
        map:dustTexture(), transparent:true, opacity:0, depthWrite:false, color:lin(SPRITE_COL.dust) }));
      du.scale.set(13,6,1); du.visible=false; du.renderOrder=5;
      scene.add(du); rec.dust=du;

      /* movement trail */
      var tg=new THREE.BufferGeometry();
      tg.setAttribute("position",new THREE.Float32BufferAttribute(new Float32Array(32*3),3));
      tg.setDrawRange(0,0);
      var tl=new THREE.Line(tg,new THREE.LineBasicMaterial({color:lin(hexNum(TOKENS.sym.label.dark.annotation)),
        transparent:true,opacity:0.55,depthTest:false}));
      tl.renderOrder=17; tl.visible=false; scene.add(tl);
      rec.trail=tl;

      units[id]=rec;
    } else {
      aggregates[id]=rec;
    }
  });
}

/* the named places: their anchors, where the map layer puts each marker and name */
function buildFeatureGlyphs(){
  FEATURES.forEach(function(ft){
    var w=W(ft.p[0],ft.p[1]);
    placeLabels.push({ft:ft,world:new THREE.Vector3(w[0],displayHeight(w[0],w[1])+(ft.kind==="height"?6:3.2),w[1])});
  });
}

function updateTrail(rec,id){
  var L=legAt(id,clock);
  if(!L||!L.b||L.u<=0.001){ rec.trail.visible=false; return; }
  if(rec.trailU!==undefined && Math.abs(rec.trailU-L.u)<0.004 && rec.trailA===L.a) return;
  rec.trailU=L.u; rec.trailA=L.a;
  var pp=legPath(L.a,L.b), N=24, arr=rec.trail.geometry.attributes.position.array, n=0;
  for(var i=0;i<N;i++){
    var q=pointOnPath(pp,L.u*i/(N-1)), w=W(q[0],q[1]);
    arr[n++]=w[0]; arr[n++]=displayHeight(w[0],w[1])+1.4; arr[n++]=w[1];
  }
  rec.trail.geometry.attributes.position.needsUpdate=true;
  rec.trail.geometry.setDrawRange(0,N);
}
/* ---------------- overlays ---------------- */
function hexNum(h){ return parseInt(String(h).replace("#",""),16); }
function sideCol(sd){ var S=TOKENS.sym.side[sd];
  return {attack:hexNum(S.base), move:hexNum(S.step2), counter:hexNum(S.step3), retreat:hexNum(S.step2), axis:hexNum(S.step2), line:hexNum(S.base)}; }
var SIDE_COL={ fr:sideCol("fr"), al:sideCol("al") };

var overlayRoot, curOv=null, oldOv=null;
var overlayMats=[], oldMats=[];
var ovFadeIn=1, ovFadeOut=0;

function ovAdd(o){ curOv.add(o); }
function disposeGroup(g){
  g.traverse(function(o){
    if(o.geometry) o.geometry.dispose();
    if(o.material){ if(o.material.map) o.material.map.dispose(); o.material.dispose(); }
  });
}
function groundPts(mapPts,lift){
  return mapPts.map(function(p){ var w=W(p[0],p[1]); return new THREE.Vector3(w[0],displayHeight(w[0],w[1])+lift,w[1]); });
}
/* The only dashed or segmented drawing (docs/STAGE2_SPEC.md section C.2): n runs of `duty` of their period each, as
   [u0,u1] fractions. Used by the axis arrows (ordered routes) and the plan staging outlines; binding-test.js checks
   that no other drawer dashes. */
function dashRuns(n,duty){ var r=[]; for(var i=0;i<n;i++) r.push([i/n,i/n+duty/n]); return r; }
/* the points of an overlay arrow, in map units. A derived arrow (a.leg) has none of its own: they are its leg's, or its run
   of consecutive legs', anchors and via points, so its ends are the anchors exactly (Stage 2C) */
function arrowPts(a){
  if(!a.leg) return a.pts;
  var A=anchorList(a.leg[0]), pts=null;
  for(var i=0;i<A.length;i++){
    if(A[i].ph===a.leg[1]) pts=[A[i].p.slice()];
    else if(pts && A[i].ph<=a.leg[2]) pts=pts.concat(A[i].via||[],[A[i].p]);
  }
  return pts;
}
/* ---- draped ribbons (Stage 2C; decision 20 and section D) ----
   An arrow, line, boundary or halt bar is a flat ribbon laid on the ground AS DRAWN: every vertex stands exactly `lift`
   above groundY() at the current display factor (the self-test checks it at 1x, 4x and 10.33x). The centre line is a
   smooth curve through the map points in the ground plane, sampled every unit or so and across its width, so the ribbon
   follows the relief rather than cutting through it. o: w0, w1 shaft width at start and end; head "plain" (French) or
   "chevron" (Allied: notched, the notch 0.38 of the head's length), headW, headL, the tip on the last point; runs, the
   dashes (dashRuns); col, edge: fill and casing; lift; world: the points are already world x, z. Meshes go to `add`,
   materials to `mats`. */
var CHEVRON_NOTCH=0.38;
function drapeMesh(v,idx,col,op,lift,order,mats,kind){
  var g=new THREE.BufferGeometry();
  g.setAttribute("position",new THREE.Float32BufferAttribute(v,3)); g.setIndex(idx);
  /* over woods and buildings, as the plan ribbons are: an annotation on the map, not an object in the landscape */
  var m=new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:0,fog:false,depthWrite:false,depthTest:false,side:THREE.DoubleSide});
  m.userData.op=op; mats.push(m);
  var mesh=new THREE.Mesh(g,m); mesh.renderOrder=order; mesh.userData.drape={lift:lift,kind:kind};
  return mesh;
}
function drapeTri(A,B,C,n,lift,v,idx){   /* a flat triangle split n x n, every vertex draped */
  var row=[], i, j;
  for(i=0;i<=n;i++){ row.push(v.length/3);
    for(j=0;j<=n-i;j++){ var a=i/n, b=j/n, x=A[0]+(B[0]-A[0])*a+(C[0]-A[0])*b, z=A[1]+(B[1]-A[1])*a+(C[1]-A[1])*b;
      v.push(x,groundY(x,z)+lift,z); } }
  for(i=0;i<n;i++) for(j=0;j<n-i;j++){ var p0=row[i]+j, p1=row[i+1]+j, p2=row[i]+j+1;
    idx.push(p0,p1,p2); if(j<n-i-1) idx.push(p1,row[i+1]+j+1,p2); }
}
function drapedRibbon(mapPts,o,add,mats){
  var wp=mapPts.map(function(p){ var w=o.world?p:W(p[0],p[1]); return new THREE.Vector3(w[0],0,w[1]); }), tOrig=null;
  if(o.dense){   /* Stage 4D: points added along every segment longer than o.dense units, so the curve keeps to the path's
                    straight runs and turns close to its corners; tOrig, each of the path's own points' curve parameter */
    var dp=[wp[0]], ix=[0];
    for(var q=1;q<wp.length;q++){ var sl=wp[q].distanceTo(wp[q-1]), ns=Math.max(1,Math.ceil(sl/o.dense));
      for(var e=1;e<=ns;e++) dp.push(wp[q-1].clone().lerp(wp[q],e/ns)); ix.push(dp.length-1); }
    wp=dp; tOrig=ix.map(function(k){ return k/(wp.length-1); }); }
  var curve=wp.length>2?new THREE.CatmullRomCurve3(wp,false,"centripetal"):new THREE.LineCurve3(wp[0],wp[1]);
  var L=curve.getLength(), headL=o.head?Math.min(o.headL,L*0.6):0, headW=o.head?o.headW*headL/o.headL:0;
  var uEnd=(L-headL)/L, uT=o.uTaper||uEnd, runs=o.runs||[[0,1]], lift=o.lift, out={curve:curve,len:L,uEnd:uEnd,headL:headL,headW:headW,layers:[],tOrig:tOrig}, ord=o.order||0;
  [[1.34,o.edge,0.5,-0.06],[1.0,o.col,1.0,0]].forEach(function(layer,li){
    var sc=layer[0], ly=lift+layer[3], v=[], idx=[];
    var nRows=0;
    runs.forEach(function(r){
      var u0=r[0]*uEnd, u1=o.full?1:Math.min(r[1],1)*uEnd, n=Math.max(2,Math.ceil((u1-u0)*L/1.0));   /* o.full (Stage 4D): the shaft built to the end, drawn to uEnd when whole */
      nRows=n;
      var wmax=Math.max(o.w0,o.w1)*sc, m=Math.max(2,Math.ceil(wmax/1.0)), first=v.length/3;
      for(var i=0;i<=n;i++){
        var u=u0+(u1-u0)*i/n, pt=curve.getPointAt(u), tg=curve.getTangentAt(u), nx=-tg.z, nz=tg.x, nl=Math.hypot(nx,nz)||1;
        nx/=nl; nz/=nl;
        var hw=(o.w0+(o.w1-o.w0)*(uT>0?Math.min(1,u/uT):0))*sc/2;
        for(var k=0;k<=m;k++){ var f=-1+2*k/m, x=pt.x+nx*hw*f, z=pt.z+nz*hw*f; v.push(x,groundY(x,z)+ly,z); }
      }
      for(i=0;i<n;i++) for(k=0;k<m;k++){ var a=first+i*(m+1)+k, b=a+m+1; idx.push(a,b,a+1, a+1,b,b+1); }
    });
    var sh=drapeMesh(v,idx,layer[1],layer[2],ly,12+li+ord,mats,"shaft"), lay={shaft:sh,cols:Math.max(2,Math.ceil(Math.max(o.w0,o.w1)*sc/1.0)),rows:nRows,sc:sc,ly:ly,w0:o.w0,w1:o.w1,uT:uT};
    add(sh); out.layers.push(lay);
    if(o.full) shaftEnd(lay,curve,L,uT,uEnd);
    if(o.head){
      var H=ribbonHead(curve,1,headL,headW,sc,ly,o.head);
      var hm=drapeMesh(H.v,H.idx,layer[1],layer[2],ly,14+li+ord,mats,"head");
      hm.userData.head=o.head; hm.userData.side=li===1?o.side:null; hm.userData.tip=H.tip; hm.userData.base=H.base; if(H.notch) hm.userData.notch=H.notch;
      add(hm); lay.head=hm;
      if(li===0&&o.heads) o.heads.push(hm);   /* the casing's head mesh: labels keep clear of it (2D) */
    }
  });
  return out;
}
/* Stage 4D: a full-length shaft (o.full) drawn from its start to arc length u: the rows up to u, the last of them moved to
   exactly u (draped, at the shaft's width there, uT the arc length where its taper ends); the row moved before is put back first */
function shaftEnd(lay,curve,L,uEnd,u){
  var g=lay.shaft.geometry, A=g.attributes.position, m=lay.cols, n=lay.rows, per=(m+1)*3;
  if(lay.moved){ A.array.set(lay.moved.v,lay.moved.row*per); lay.moved=null; }
  var k=Math.max(1,Math.min(n,Math.ceil(u*n-1e-9)));
  if(k<n||u<1){ var row=k, save=A.array.slice(row*per,(row+1)*per), pt=curve.getPointAt(u), tg=curve.getTangentAt(u), nx=-tg.z, nz=tg.x, nl=Math.hypot(nx,nz)||1;
    nx/=nl; nz/=nl; var hw=(lay.w0+(lay.w1-lay.w0)*(uEnd>0?Math.min(1,u/uEnd):0))*lay.sc/2;
    for(var j=0;j<=m;j++){ var f=-1+2*j/m, x=pt.x+nx*hw*f, z=pt.z+nz*hw*f, o=row*per+j*3; A.array[o]=x; A.array[o+1]=groundY(x,z)+lay.ly; A.array[o+2]=z; }
    lay.moved={row:row,v:save}; }
  A.needsUpdate=true; g.boundingSphere=null;
  g.setDrawRange(0,k*m*6);
  lay.end=curve.getPointAt(u);
}
/* a ribbon's head with its tip at arc length u of the curve (u = 1: the arrow's end), every vertex draped; the casing's head
   (sc > 1) stands a little beyond the tip. Since Stage 4D also the head of an arrow drawn on with the clock. */
function ribbonHead(curve,u,headL,headW,sc,ly,type){
  var end=curve.getPointAt(u), tg=curve.getTangentAt(u), nx=-tg.z, nz=tg.x, nl=Math.hypot(nx,nz)||1; nx/=nl; nz/=nl;
  var over=(sc-1)*headL*0.35, hl=headL*sc, hw2=headW*sc/2;
  var tip=[end.x+tg.x*over,end.z+tg.z*over], bc=[tip[0]-tg.x*hl,tip[1]-tg.z*hl];
  var l=[bc[0]+nx*hw2,bc[1]+nz*hw2], r=[bc[0]-nx*hw2,bc[1]-nz*hw2], hv=[], hi=[], nt=null;
  if(type==="chevron"){ nt=[bc[0]+tg.x*hl*CHEVRON_NOTCH,bc[1]+tg.z*hl*CHEVRON_NOTCH];
    drapeTri(tip,l,nt,5,ly,hv,hi); drapeTri(tip,nt,r,5,ly,hv,hi); }
  else drapeTri(tip,l,r,5,ly,hv,hi);
  return {v:hv,idx:hi,tip:tip,base:[l,r],notch:nt};
}
function overlayMesh(m){ ovAdd(m); }
function buildArrow(a){
  var pts=arrowPts(a);
  if(!pts||pts.length<2) return;
  if(a.kind==="halt") return buildHalt(a,pts);
  var col=SIDE_COL[a.side][a.kind]||SIDE_COL[a.side].move, S=TOKENS.sym.side[a.side];
  var w = a.kind==="attack"?[2.0,2.6] : a.kind==="counter"?[1.8,2.3] : [1.3,1.6];
  var r=drapedRibbon(pts,{w0:w[0],w1:w[1],side:a.side,head:a.side==="al"?"chevron":"plain",headW:7.5,headL:6.5,heads:ovHeads,
    runs:a.kind==="axis"?dashRuns(9,0.62):null,   /* an intended route: broken; a retreat happened, so it is solid */
    dense:a.leg?2:0,   /* Stage 4D: a derived arrow kept to its path (its drawn-on part follows the formation) */
    col:lin(col).clone().multiplyScalar(0.58),edge:lin(hexNum(S.edge)),lift:2.4},overlayMesh,overlayMats);
  var mid=r.curve.getPointAt(0.5);
  if(a.label) addOverlayLabel(a.label,new THREE.Vector3(mid.x,groundY(mid.x,mid.z)+2.4,mid.z));
  if(a.leg){ var d={a:a,ghost:r,r:drawOnRibbon(pts,w,col,S,r),s:-1}; DRAWON.push(d); }   /* Stage 4D: the part marched, drawn on with the clock */
}
/* "IV Column halted" (decision 23, section C.3): a column stopped short of its objective is not a route. A solid bar
   across its line of march at the point it had reached, cased like the arrows, no head. Its length is the frontage of
   the column's widest formation as the blocks model it (W0 x sw): a design rule. */
function haltFrontage(id){
  var best=0; leavesOf(id,[]).forEach(function(k){ var b=units[k]&&units[k].block, u=b&&b.userData;
    if(u&&u.W0) best=Math.max(best,u.W0*(u.sw||1)); });
  return best||8;
}
function buildHalt(a,pts){
  var e=W(pts[pts.length-1][0],pts[pts.length-1][1]), p=W(pts[pts.length-2][0],pts[pts.length-2][1]);
  var dx=e[0]-p[0], dz=e[1]-p[1], L=Math.hypot(dx,dz)||1, nx=-dz/L, nz=dx/L, h=haltFrontage(a.of)/2;
  var S=TOKENS.sym.side[a.side], col=SIDE_COL[a.side].attack;
  var ends=[[e[0]+nx*h,e[1]+nz*h],[e[0]-nx*h,e[1]-nz*h]];
  drapedRibbon(ends,{world:true,w0:1.6,w1:1.6,col:lin(col).clone().multiplyScalar(0.58),edge:lin(hexNum(S.edge)),lift:2.4},overlayMesh,overlayMats);
  if(a.label) addOverlayLabel(a.label,new THREE.Vector3(e[0],groundY(e[0],e[1])+2.4,e[1]));
}
function buildLine(l){
  var col=SIDE_COL[l.side].line, S=TOKENS.sym.side[l.side];
  var r=drapedRibbon(l.pts,{w0:1.1,w1:1.1,col:lin(col).clone().multiplyScalar(0.58),edge:lin(hexNum(S.edge)),lift:1.9},overlayMesh,overlayMats);
  for(var i=0;i<=14;i++){   /* ticks on the side the line faces: drawn from the line out, both ends on the drawn ground */
    var t=i/14, p=r.curve.getPointAt(t), tg=r.curve.getTangentAt(t);
    var sx=-tg.z, sz=tg.x, sl=Math.hypot(sx,sz)||1, k=(l.side==="fr"?2.6:-2.6)/sl, qx=p.x+sx*k, qz=p.z+sz*k;
    var g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(p.x,groundY(p.x,p.z)+1.9,p.z),new THREE.Vector3(qx,groundY(qx,qz)+1.9,qz)]);
    var lm=new THREE.LineBasicMaterial({color:lin(col),transparent:true,opacity:0,depthTest:false});
    overlayMats.push(lm);
    var ln=new THREE.Line(g,lm); ln.renderOrder=13; ln.userData.drape={lift:1.9,kind:"tick"}; ovAdd(ln);
  }
  var q=r.curve.getPointAt(0.18);
  if(l.label) addOverlayLabel(l.label,new THREE.Vector3(q.x,groundY(q.x,q.z)+1.9,q.z));
}
/* a boundary between commands: one solid thin line in the annotation colour (decision 21), explained in the legend */
function buildBoundary(b){
  var c=lin(hexNum(TOKENS.sym.label.dark.annotation));
  var r=drapedRibbon(b.pts,{w0:0.7,w1:0.7,col:c,edge:c,lift:1.6},overlayMesh,overlayMats);
  var q=r.curve.getPointAt(0.5);
  if(b.label) addOverlayLabel(b.label,new THREE.Vector3(q.x,groundY(q.x,q.z)+1.6,q.z));
}
function addOverlayLabel(text,pos){          /* annotation text: hue stays on the arrow, not the words */
  ovText.push({text:text,pos:pos.clone(),acl:6});   /* the map layer's label, anchored on the drawn line (2D) */
}
function buildObjective(o){
  var w=W(o[0],o[1]);
  var cv=document.createElement("canvas"); cv.width=cv.height=128;
  var c=cv.getContext("2d");
  c.strokeStyle=TOKENS.sym.label[mode==="staff"?"paper":"dark"].annotation; c.lineWidth=7;
  c.beginPath(); c.arc(64,64,40,0,Math.PI*2); c.stroke();
  c.beginPath(); c.moveTo(64,14); c.lineTo(64,114); c.moveTo(14,64); c.lineTo(114,64); c.stroke();
  var m=new THREE.SpriteMaterial({map:ctex(cv),transparent:true,opacity:0,depthTest:false,fog:false});
  var sp=new THREE.Sprite(m); sp.position.set(w[0],displayHeight(w[0],w[1])+3.0,w[1]);
  sp.scale.set(4.4,4.4,1); sp.renderOrder=21;
  asLabel(sp); ovAdd(sp); overlayMats.push(m);
  ovMarkers.push({pos:sp.position.clone(),r:1.8,r0:1.8,sp:sp,s0:4.4,fade:1});   /* the marker's cross reaches 1.72 units: labels keep clear of it (2D) */
  ovText.push({text:o[2],pos:sp.position.clone(),acl:3,r:1.8,obj:true});
}
function retireOld(){
  if(oldOv){ overlayRoot.remove(oldOv); disposeGroup(oldOv); oldOv=null; oldMats=[]; }
}
function rebuildOverlays(ph,instant){
  retireOld();
  oldOv=curOv; oldMats=overlayMats;
  curOv=new THREE.Group(); overlayRoot.add(curOv);
  overlayMats=[]; ovText=[]; ovMarkers=[]; ovHeads=[]; DRAWON=[];
  var o=OVERLAYS[ph];
  if(o){
    (o.lines||[]).forEach(buildLine);
    (o.bounds||[]).forEach(buildBoundary);
    (o.arrows||[]).forEach(buildArrow);
    (o.obj||[]).forEach(buildObjective);
  }
  if(instant){ retireOld(); ovFadeIn=1; ovFadeOut=0; }
  else { ovFadeIn=0; ovFadeOut=1; }
  drawOnArrows();
}
/* ---- Stage 4D: arrows that draw on with the clock (docs/STAGE4_SPEC.md section D.3, item 4) ----
   Only an arrow derived from an executed leg (a.leg; Stage 2C) is drawn on: its drawn length is the formation's progress along
   the leg, or run of legs, at the clock (legWindow and legPath, read, not changed), its head at the tip. Before the first leg
   starts the arrow is not drawn, and its label not shown until the tip passes it; once the last leg is complete it is whole,
   as before. Interpretive arrows, lines and boundaries keep the phase change's fade. Under reduced motion every arrow is whole.
   The tip is placed on the drawn curve at the point the formation has reached on its path: the curve passes through the
   path's points (Catmull-Rom), so the formation's place between two of them is carried to the same place between them on the
   curve. */
var DRAWON=[];
/* where the formation is on the arrow's path at clock t: the segment of the path's points it is on (g: its index and the
   fraction along it), and whether its first leg has started */
function arrowProgress(a,t){
  var A=anchorList(a.leg[0]), i0=-1, i1=-1, k;
  for(k=0;k<A.length;k++){ if(A[k].ph===a.leg[1]&&i0<0) i0=k; if(A[k].ph===a.leg[2]&&i0>=0) i1=k; }
  if(i0<0||i1<=i0) return {g:null,segs:0,started:true,done:true};
  var seg=0, g=null, started=false, segs=0;
  for(k=i0+1;k<=i1;k++) segs+=legPath(A[k-1],A[k]).pts.length-1;
  for(k=i0+1;k<=i1;k++){ var pp=legPath(A[k-1],A[k]), w=legWindow(A[k-1],A[k]), f=clamp01((t-w[0])/((w[1]-w[0])||1));
    if(t>w[0]) started=true;
    if(f<1){ if(!started){ g=seg; break; }
      var d=f*pp.len, j=1; while(j<pp.cum.length-1&&pp.cum[j]<d) j++;
      var sl=(pp.cum[j]-pp.cum[j-1])||1; g=seg+(j-1)+clamp01((d-pp.cum[j-1])/sl); break; }
    seg+=pp.pts.length-1; }
  return {g:g,segs:segs,started:started,done:g===null};
}
/* the arc length (fraction of the curve) of the drawn point nearest the formation, searched between the curve's points that
   bound its segment of the path (the curve passes through every point of the path) */
function drawOnU(r,P,q){
  var c=r.curve, S=P.segs, s0=Math.min(S-1,Math.floor(P.g)), TO=r.tOrig, t0=TO?TO[s0]:s0/S, t1=TO?TO[s0+1]:(s0+1)/S, best=t0, bd=1e18, v=new THREE.Vector3(), N=48, a, b, i;
  for(i=0;i<=N;i++){ var t=t0+(t1-t0)*i/N; c.getPoint(t,v); var e=(v.x-q[0])*(v.x-q[0])+(v.z-q[1])*(v.z-q[1]); if(e<bd){ bd=e; best=t; } }
  a=Math.max(t0,best-(t1-t0)/N); b=Math.min(t1,best+(t1-t0)/N);
  for(i=0;i<24;i++){ var m1=a+(b-a)/3, m2=b-(b-a)/3; c.getPoint(m1,v); var e1=(v.x-q[0])*(v.x-q[0])+(v.z-q[1])*(v.z-q[1]); c.getPoint(m2,v); var e2=(v.x-q[0])*(v.x-q[0])+(v.z-q[1])*(v.z-q[1]);
    if(e1<e2) b=m2; else a=m1; }
  var t=(a+b)/2, Ls=c.getLengths(), D=Ls.length-1, x=t*D, k0=Math.floor(x), k1=Math.min(D,k0+1);
  return Math.max(1e-4,Math.min(1,(Ls[k0]+(Ls[k1]-Ls[k0])*(x-k0))/(r.len||1)));
}
function drawOnArrows(){
  for(var i=0;i<DRAWON.length;i++){ var d=DRAWON[i], P=RM?{done:true,started:true}:arrowProgress(d.a,clock), u;
    if(P.done) u=1; else if(!P.started) u=0;
    else { var q=posAtClock(d.a.leg[0],clock), w=W(q[0],q[1]); u=drawOnU(d.r,P,w); if(u>=1) u=1-1e-6; }
    if(d.done&&Math.abs(u-d.s)<1e-7) continue;
    d.s=u; d.done=true; drawOnApply(d);
  }
}
/* Owner decision 83 (Stage 4D, in place of section D.3's "not drawn before the leg, the head at the tip"): the whole arrow is
   always drawn, faint (DRAWON_GHOST of its opacity), its head at the destination and its label as before, so a phase's moves
   read at its start; over it the part marched is drawn at full strength, from the start to the formation, without a head (the
   formation's counter or figures stand at its end; a head there would lie under them). Once the leg is complete the arrow is
   drawn whole at full strength, as before 4D (the marched part hidden). */
var DRAWON_GHOST=0.4;
function drawOnRibbon(pts,w,col,S,g){
  var r=drapedRibbon(pts,{w0:w[0],w1:w[1],side:null,head:null,full:true,dense:2,uTaper:g.uEnd,order:4,
    col:lin(col).clone().multiplyScalar(0.58),edge:lin(hexNum(S.edge)),lift:2.4},overlayMesh,overlayMats);
  g.layers.forEach(function(lay){ [lay.shaft,lay.head].forEach(function(m){ if(m) m.material.userData.op0=m.material.userData.op; }); });
  return r;
}
function drawOnApply(d){
  var r=d.r, g=d.ghost, u=d.s, whole=u>=1, show=u>1e-6&&!whole;   /* whole: the arrow itself at full strength, exactly as before 4D */
  r.layers.forEach(function(lay){ lay.shaft.visible=show; if(show) shaftEnd(lay,r.curve,r.len,lay.uT,u); });
  g.layers.forEach(function(lay){ [lay.shaft,lay.head].forEach(function(m){ if(m) m.material.userData.op=m.material.userData.op0*(whole?1:DRAWON_GHOST); }); });
  d.tip=show?[r.layers[r.layers.length-1].end.x,r.layers[r.layers.length-1].end.z]:null;
}
function applyOverlayOpacity(){
  var base=layerOn.arrows?0.95:0;
  var i;
  for(i=0;i<overlayMats.length;i++) overlayMats[i].opacity=base*ovFadeIn*(overlayMats[i].userData.op||1);
  for(i=0;i<oldMats.length;i++) oldMats[i].opacity=0.9*ovFadeOut*(oldMats[i].userData.op||1);
}

/* ============================================================
   CLOCK AND MOVEMENT MODEL
   Positions are a continuous function of the battle clock, evaluated
   along a march route, so a formation can never jump. Phase-scoped
   content (narrative, overlays, light, camera) switches at boundaries.
   ============================================================ */
var TRANS_MS=2600;
var T_MIN=PHASES[0].t0, T_MAX=PHASES[PHASES.length-1].t1;
var clock=T_MIN, curPhase=0;
var playing=false, playRAF=0, speed=0.5, MIN_PER_SEC=10;   /* Stage 4D (decision 74): Play starts at half speed; the buttons keep their meaning */
var KM_PER_MAP=GEOREF.KM_PER_MAP;   /* one map unit on the ground: from geo.js, the only scale */

function easeInOut(k){ return k<0.5 ? 4*k*k*k : 1-Math.pow(-2*k+2,3)/2; }
function clamp01(x){ return x<0?0:(x>1?1:x); }
function clampT(t){ return Math.max(T_MIN,Math.min(T_MAX,t)); }
function phaseAt(t){
  for(var i=PHASES.length-1;i>=0;i--) if(t>=PHASES[i].t0) return i;
  return 0;
}
function fmtClock(t){
  var h=Math.floor(t/60)%24, m=Math.floor(t%60);
  return (h<10?"0":"")+h+":"+(m<10?"0":"")+m;
}

/* ---- anchors and march routes ----
   THE TIMING RULE (owner decisions 33 and 40; docs/STAGE2_SPEC.md section M). A track entry with a position is an
   anchor. By default an anchor is reached at the START of its phase, PHASES[ph].t0: the move into it runs from the
   previous anchor's arrival (or moveMin before the phase start: "holds, then marches") and is complete as the phase
   begins, so the default anchor is "in place when the phase opens". An anchor may instead carry its own timing, tm,
   in minutes of the day, only where a dated statement supports it (decision 41: tm also carries that evidence, a
   timing grade A/B/C and its basis, "source" or "app narrative, unsourced"):
     tm.at   when the anchor is reached; may lie after its phase start. A range [lo,hi] is honoured at hi;
     tm.dep  when the move into it begins. A range [lo,hi] is honoured at lo.
   So a ranged move is shown in motion across the whole range; no midpoint is ever taken. With a departure at or
   after the phase start and no arrival, the anchor is reached after moveMin, or once the leg has been marched at its
   arm's ceiling (SPEED_CEIL), whichever is later, rounded up to the minute: the least delay the dated departure and
   the ceiling allow (the arrival is then derived, a.arrDerived). Anchors without tm behave exactly as before.
   THE TACTICAL RATE (owner, 2C precondition; docs/STAGE2_SPEC.md section M.13, "(b) where it fits, otherwise (c),
   flagged"). A derived arrival (dated departure, no dated arrival) of a formation in battle order during the leg
   (BATTLE_ORDER: its status at the anchor's phase) is instead the one its arm's TACTICAL_RATE gives, rounded up to the
   minute, provided the leg then still fits before its next anchor: it arrives no later than the latest arrival that
   leaves the next leg within the ceiling (and no later than the next leg's dated departure, or the phase the formation
   leaves the field). Otherwise the arrival stays at the ceiling and is flagged (a.arrFlag says why). The rates are
   DESIGN VALUES, unsourced, never history. a.arrRule is "tactical", "ceiling" or "moveMin" (the leg's own moveMin
   governs). Arrivals are resolved from the last anchor back, because a tactical arrival depends on the next anchor's.
   auditMovement() validates every explicit time: departure before arrival, no overlap with the neighbouring legs,
   inside the day. The leg into anchor b runs over b.w = [departure, arrival]; b.arr is its arrival. */
function anchorList(id){
  var f=FORMATIONS[id];
  if(!f||!f.track) return [];
  if(f._anchors) return f._anchors;
  var out=[];
  Object.keys(f.track).map(Number).sort(function(a,b){return a-b;}).forEach(function(ph){
    var e=f.track[ph];
    if("p" in e) out.push({ph:ph,p:e.p,via:e.via||null,moveMin:e.moveMin||null,ice:!!e.ice,tm:e.tm||null});
  });
  function depOf(b){ var tm=b.tm||{}; return tm.dep==null?null:(Array.isArray(tm.dep)?tm.dep[0]:tm.dep); }
  function statusAt(ph){ var st=null; for(var k=0;k<=ph;k++) if(f.track[k]&&f.track[k].st) st=f.track[k].st; return st; }
  var ceil=SPEED_CEIL[f.arm]||5.0;
  for(var i=out.length-1;i>=0;i--){
    var b=out[i], a=out[i-1], c=out[i+1], t0=PHASES[b.ph].t0;
    b.arr=t0; b.w=null; b.arrDerived=false; b.arrRule=null; b.arrFlag=null;
    if(!a||a.p===null||b.p===null) continue;
    var tm=b.tm||{}, dep=depOf(b), at=tm.at==null?null:(Array.isArray(tm.at)?tm.at[1]:tm.at);
    if(at!==null) b.arr=at;
    else if(dep!==null && dep>=t0){
      var km=legPath(a,b).len*KM_PER_MAP, mm=b.moveMin||0, rate=TACTICAL_RATE[f.arm]||null;
      b.arr=Math.ceil(dep+Math.max(mm,km/ceil*60)-1e-9); b.arrDerived=true;
      b.arrRule=mm>=km/ceil*60?"moveMin":"ceiling";
      if(rate && b.arrRule==="ceiling"){
        if(!BATTLE_ORDER[statusAt(b.ph)]) b.arrFlag="not in battle order";
        else {
          var tac=Math.ceil(dep+Math.max(mm,km/rate*60)-1e-9), latest=T_MAX;
          if(c && c.p===null) latest=PHASES[c.ph].t0;
          else if(c){ latest=c.arr-legPath(b,c).len*KM_PER_MAP/ceil*60; if(depOf(c)!==null) latest=Math.min(latest,depOf(c)); }
          if(tac<=latest){ b.arr=tac; b.arrRule="tactical"; }
          else b.arrFlag="the tactical rate does not fit before the next anchor";
        }
      }
    }
  }
  out.forEach(function(b,i){
    var a=out[i-1];
    if(!a||a.p===null||b.p===null) return;
    var d=depOf(b);
    if(d===null){ d=a.arr; if(b.moveMin && b.moveMin<(b.arr-d)) d=b.arr-b.moveMin; }   /* holds, then marches */
    b.w=[d,b.arr];
  });
  f._anchors=out;
  return out;
}
function legPath(a,b){
  if(b._path) return b._path;
  var pts=[a.p].concat(b.via||[],[b.p]), cum=[0], tot=0;
  for(var i=1;i<pts.length;i++){
    var dx=pts[i][0]-pts[i-1][0], dy=pts[i][1]-pts[i-1][1];
    tot+=Math.sqrt(dx*dx+dy*dy); cum.push(tot);
  }
  b._path={pts:pts,cum:cum,len:tot};
  return b._path;
}
function pointOnPath(pp,u){
  if(pp.len<=0) return pp.pts[0].slice();
  var d=u*pp.len, i=1;
  while(i<pp.cum.length-1 && pp.cum[i]<d) i++;
  var seg=(pp.cum[i]-pp.cum[i-1])||1, t=(d-pp.cum[i-1])/seg;
  return [pp.pts[i-1][0]+(pp.pts[i][0]-pp.pts[i-1][0])*t,
          pp.pts[i-1][1]+(pp.pts[i][1]-pp.pts[i-1][1])*t];
}
/* the leg from anchor a to the next anchor b: [departure, arrival]. The default (the timing rule above): an anchor is
   reached at its phase's start unless it carries an explicit time (tm); anchorList resolves the window once. */
function legWindow(a,b){
  if(b.w) return b.w;
  var t0=a.arr!==undefined?a.arr:PHASES[a.ph].t0, t1=PHASES[b.ph].t0;
  if(b.moveMin && b.moveMin<(t1-t0)) t0=t1-b.moveMin;   /* holds, then marches */
  return [t0,t1];
}
function legAt(id,t){
  var A=anchorList(id);
  if(!A.length) return null;
  if(A[0].p===null) return null;
  if(t<=PHASES[A[0].ph].t0) return {a:A[0],b:null,u:0};
  var i=0;
  while(i<A.length-1 && t>=A[i+1].arr) i++;   /* an anchor is passed when it is reached, not when its phase opens */
  var a=A[i];
  if(a.p===null) return null;
  if(i===A.length-1) return {a:a,b:null,u:0};
  var b=A[i+1];
  if(b.p===null) return {a:a,b:null,u:0};
  var w=legWindow(a,b);
  if(t<=w[0]) return {a:a,b:b,u:0,w:w};
  return {a:a,b:b,u:clamp01((t-w[0])/((w[1]-w[0])||1)),w:w};
}
function posAtClock(id,t){
  var L=legAt(id,t);
  if(!L) return null;
  if(!L.b||L.u<=0) return L.a.p.slice();
  return pointOnPath(legPath(L.a,L.b),L.u);
}
function notYetAt(id,t){
  var A=anchorList(id);
  return A.length ? (t < PHASES[A[0].ph].t0-0.001) : false;
}
function goneAt(id,t){
  var A=anchorList(id);
  for(var i=0;i<A.length;i++) if(A[i].p===null && t>=PHASES[A[i].ph].t0) return true;
  return false;
}
function headingAt(id,t){
  var L=legAt(id,t);
  if(!L||!L.b||L.u<=0||L.u>=1) return null;
  var pp=legPath(L.a,L.b);
  var p0=pointOnPath(pp,Math.max(0,L.u-0.03)), p1=pointOnPath(pp,Math.min(1,L.u+0.03));
  var dx=p1[0]-p0[0], dy=p1[1]-p0[1];
  if(dx*dx+dy*dy<1e-6) return null;
  var w0=W(p0[0],p0[1]), w1=W(p1[0],p1[1]);
  return Math.atan2(w1[0]-w0[0],w1[1]-w0[1]);
}
/* march rate for the leg in progress, or the one just completed */
function marchRate(id,t){
  var L=legAt(id,t);
  if(!L||!L.b) return null;
  var pp=legPath(L.a,L.b), w=L.w||legWindow(L.a,L.b);
  var km=pp.len*KM_PER_MAP, min=w[1]-w[0];
  if(min<=0||km<0.02) return null;
  return {km:km, min:min, kmh:km/(min/60), moving:(L.u>0&&L.u<1), ice:L.b.ice};
}

/* ---- current-clock accessors used across the app ---- */
function posNow(id){
  var f=FORMATIONS[id];
  if(f.track) return (goneAt(id,clock)||notYetAt(id,clock))?null:posAtClock(id,clock);
  var ls=leavesOf(id,[]), sx=0,sy=0,n=0;
  ls.forEach(function(k){
    var p=(goneAt(k,clock)||notYetAt(k,clock))?null:posAtClock(k,clock);
    if(p){ sx+=p[0]; sy+=p[1]; n++; }
  });
  return n?[sx/n,sy/n]:null;
}

/* ---- plausibility audit: run at load, reported to the console ---- */
var SPEED_CEIL={inf:5.0, guard:5.0, art:4.5, cav:12.0, mixed:8.0, hq:12.0};
/* The tactical rate for a derived arrival of a formation in battle order (anchorList; docs/STAGE2_SPEC.md section M.13).
   DESIGN VALUES, UNSOURCED: chosen so that a formed body moving under fire is not given the march-rate ceiling as its
   pace; they are not historical rates and are never presented as such. Artillery and headquarters have none (their
   ceilings apply unchanged). BATTLE_ORDER: the statuses in which a formation counts as deployed in battle order. */
var TACTICAL_RATE={inf:3.0, guard:3.0, cav:6.0, mixed:4.0},
    BATTLE_ORDER={attacking:1, advancing:1, counterattack:1, engaged:1, charging:1, holding:1, supporting:1, withdrawing:1, repulsed:1};
/* The Goldbach itself was a trickle. What stopped guns and formed cavalry
   was the marshy bottom it ran through, and the meres in the south. */
function wetAt(mx,my){
  var w=W(mx,my);
  var pS=1-smoothstep(0.55,1.08,Math.sqrt(Math.pow((w[0]-SATS[0])/28,2)+Math.pow((w[1]-SATS[1])/10.5,2)));
  var pM=1-smoothstep(0.55,1.08,Math.sqrt(Math.pow((w[0]-MENI[0])/23,2)+Math.pow((w[1]-MENI[1])/9,2)));
  return {pond:Math.max(pS,pM), marsh:covAt(covMarsh,w[0],w[1]), road:covAt(covRoad,w[0],w[1])};
}
function nearSettlement(mx,my){
  for(var i=0;i<VILLAGES.length;i++){
    var dx=mx-VILLAGES[i][1], dy=my-VILLAGES[i][2];
    if(dx*dx+dy*dy < 22*22) return true;
  }
  return false;
}
function crossingProblem(pp,ice){
  var step=3.5, n=Math.max(2,Math.ceil(pp.len/step));
  for(var i=1;i<n;i++){
    var q=pointOnPath(pp,i/n), w=wetAt(q[0],q[1]);
    if(!ice && w.pond>0.55) return {at:q,why:"crosses open water"};
    if(!ice && w.marsh>0.50 && w.road<0.35 && !nearSettlement(q[0],q[1]))
      return {at:q,why:"crosses the marshy bottom away from a village or road"};
  }
  return null;
}
function auditMovement(){
  var out=[];
  Object.keys(FORMATIONS).forEach(function(id){
    var f=FORMATIONS[id];
    if(!f.track) return;
    var A=anchorList(id);
    for(var i=0;i<A.length-1;i++){
      var a=A[i], b=A[i+1];
      if(a.p===null||b.p===null) continue;
      var pp=legPath(a,b), w=legWindow(a,b);
      var km=pp.len*KM_PER_MAP, min=w[1]-w[0];
      var kmh=min>0?km/(min/60):Infinity;
      var ceil=SPEED_CEIL[f.arm]||5.0;
      if(kmh>ceil+0.001)
        out.push({id:id,leg:a.ph+"->"+b.ph,why:"rate",km:km,min:min,kmh:kmh,ceil:ceil});
      var x=crossingProblem(pp,b.ice);
      if(x) out.push({id:id,leg:a.ph+"->"+b.ph,why:x.why,at:x.at});
    }
    /* explicit times (decision 40): departure before arrival, no overlap with the neighbouring legs, inside the day */
    A.forEach(function(b,k){
      if(!b.tm) return;
      var leg=(k?A[k-1].ph:"-")+"->"+b.ph, bad=function(why){ out.push({id:id,leg:leg,why:"timing: "+why,at:b.p||[0,0]}); };
      if(k===0||b.p===null||A[k-1].p===null){ bad("a first or removal entry cannot carry its own time"); return; }
      if(!(b.w[0]<b.w[1])) bad("departure "+fmtClock(b.w[0])+" is not before arrival "+fmtClock(b.w[1]));
      if(b.w[0]<A[k-1].arr) bad("departs "+fmtClock(b.w[0])+", before the previous anchor is reached at "+fmtClock(A[k-1].arr));
      var c=A[k+1];
      if(c&&c.p!==null&&(b.arr>c.w[0]||b.arr>c.arr)) bad("arrives "+fmtClock(b.arr)+", after the next leg departs ("+fmtClock(c.w[0])+") or the next anchor is reached ("+fmtClock(c.arr)+")");
      if(c&&c.p===null&&b.arr>PHASES[c.ph].t0) bad("arrives "+fmtClock(b.arr)+", after the formation leaves the field");
      if(b.w[0]<T_MIN||b.arr>T_MAX) bad("outside the day ("+fmtClock(b.w[0])+"-"+fmtClock(b.arr)+")");
    });
  });
  return out;
}

/* ---- phase transition: light, camera, overlays ---- */
var camArc=null;
var _sp=new THREE.Spherical(), _cv=new THREE.Vector3(), _ct=new THREE.Vector3();
function setupArc(fromPos,fromTgt,toPos,toTgt){
  var s0=new THREE.Spherical().setFromVector3(fromPos.clone().sub(fromTgt));
  var s1=new THREE.Spherical().setFromVector3(toPos.clone().sub(toTgt));
  var d=s1.theta-s0.theta;
  while(d>Math.PI) d-=Math.PI*2;
  while(d<-Math.PI) d+=Math.PI*2;
  return {s0:s0,s1:s1,dth:d,t0:fromTgt.clone(),t1:toTgt.clone()};
}
function applyArc(a,e,bulge){
  _ct.copy(a.t0).lerp(a.t1,e);
  var r=a.s0.radius+(a.s1.radius-a.s0.radius)*e;
  r*=1+(bulge===undefined?0.15:bulge)*Math.sin(Math.PI*e);
  _sp.set(r, a.s0.phi+(a.s1.phi-a.s0.phi)*e, a.s0.theta+a.dth*e);
  _sp.makeSafe();
  landCam.position.copy(_ct).add(_cv.setFromSpherical(_sp));
  orbitTarget.copy(_ct);
  clampCamera();
  landCam.lookAt(_ct);
}
/* Since Stage 4B the light is not a phase's: it follows the clock (applyLight, from the computed sun and LIGHT_BY_ALT), so a phase
   change no longer interpolates it; since 4C neither is the fog (applyAtmo, from the clock). What remains here is the overlays'
   fade and the camera's glide while Follow is on. */
function startPhaseTransition(ph,instant,moveCam){
  /* the paper map's plan stays where it is: the whole field is on it; while the clock plays, Follow follows the live events
     instead (Stage 4D, followStep) */
  var camMove=moveCam && !freeCam && mode!=="staff" && !playing;
  if(camMove){
    var pc=presetFrame(ph.cam);
    camArc=setupArc(landCam.position,orbitTarget,new THREE.Vector3(pc[0],pc[1],pc[2]),new THREE.Vector3(pc[3],pc[4],pc[5]));
  }
  var dur=(instant||RM)?1:TRANS_MS, t0=performance.now();
  if(camMove){ curVantage=null;
    setTween("cam",function(now){ var k=Math.min(1,(now-t0)/dur); if(camArc) applyArc(camArc,easeInOut(k)); return k>=1||!camArc; }); }
  setTween("scene",function(now){
    var k=Math.min(1,(now-t0)/dur);
    ovFadeOut=1-clamp01(k/0.42);
    ovFadeIn=clamp01((k-0.34)/0.66);
    if(k>=1){ retireOld(); ovFadeIn=1; ovFadeOut=0; return true; }
    return false;
  });
}

function setClock(t,opts){
  opts=opts||{};
  clock=clampT(t);
  var ph=phaseAt(clock);
  if(ph!==curPhase || opts.force){
    curPhase=ph;
    faceCache={};
    rebuildOverlays(ph,!!opts.instant);
    startPhaseTransition(PHASES[ph],!!opts.instant,opts.camera!==false);
    paintDispatch(PHASES[ph]);
    paintOOB();
    if(selection) paintDrawer();
    if(PHASES[ph].flash && !opts.instant) flash(PHASES[ph].flash);
  }
  else if(selection&&selection.kind==="f"&&drawerKey()!==_drawerKey) paintDrawer();   /* a delayed move begins or ends */
  applyLight(false);   /* Stage 4B: the light is the clock's */
  drawOnArrows();      /* Stage 4D: derived arrows drawn to the clock */
  paintTimeline();
}
function setPhase(n,instant){
  n=Math.max(0,Math.min(PHASES.length-1,n));
  freeCam=false;
  setClock(PHASES[n].t0,{instant:!!instant,force:true});
}

/* ============================================================
   POST PROCESSING
   Hand-rolled because cdnjs ships only the three.js build, not the
   example modules. Scene renders linear into a half-float target;
   a bright pass and two blur levels make the bloom; a final pass
   tone-maps, grades to the hour, and writes sRGB to the screen.
   Map symbols live on layer 1 and are drawn afterwards, ungraded, so
   they stay legible; map text is the DOM map layer's (Stage 2D).
   ============================================================ */
var lowTier=false;
var LAYER_WORLD=0, LAYER_LABEL=1;
var FX={on:false, scale:1, rtScene:null, rtA:null, rtB:null, rtC:null, rtD:null, rtFinal:null, matFXAA:null,
        quadScene:null, quadCam:null, quad:null,
        matBright:null, matBlur:null, matComp:null};

/* map symbols (event glyphs, objective and plan markers) are drawn after the grade, so they stay legible; counters and all
   map text are the map layer's, over the canvas (Stage 2D) */
function asLabel(o){ if(o&&o.layers) o.layers.set(LAYER_LABEL); return o; }
function fsQuad(mat){
  var g=new THREE.BufferGeometry();
  g.setAttribute("position",new THREE.Float32BufferAttribute([-1,-1,0, 3,-1,0, -1,3,0],3));
  g.setAttribute("uv",new THREE.Float32BufferAttribute([0,0, 2,0, 0,2],2));
  return new THREE.Mesh(g,mat);
}
function makeRT(w,h,half){
  var o={minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,
         format:THREE.RGBAFormat,depthBuffer:true,stencilBuffer:false};
  if(half) o.type=THREE.HalfFloatType;
  var rt=new THREE.WebGLRenderTarget(Math.max(2,w|0),Math.max(2,h|0),o);
  rt.texture.generateMipmaps=false;
  return rt;
}
function initFX(){
  var half = renderer.capabilities.isWebGL2 ||
             !!renderer.extensions.get("OES_texture_half_float");
  FX.scale = lowTier?1.0:1.3;
  var s=new THREE.Vector2(); renderer.getDrawingBufferSize(s);
  var w=s.x*FX.scale, h=s.y*FX.scale;
  FX.rtScene=makeRT(w,h,half);
  FX.rtA=makeRT(w/2,h/2,half); FX.rtB=makeRT(w/2,h/2,half);
  FX.rtC=makeRT(w/4,h/4,half); FX.rtD=makeRT(w/4,h/4,half);
  FX.rtFinal=makeRT(s.x,s.y,false);          /* the graded frame at screen size, sRGB */
  FX.rtFinal.depthBuffer=false;

  /* FXAA: edge-directed blur along the luma gradient, on the finished sRGB frame */
  FX.matFXAA=new THREE.ShaderMaterial({
    uniforms:{tDiffuse:{value:null},texel:{value:new THREE.Vector2(1/1024,1/1024)}},
    vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }",
    fragmentShader:[
      "uniform sampler2D tDiffuse; uniform vec2 texel; varying vec2 vUv;",
      "float luma(vec3 c){ return dot(c,vec3(0.299,0.587,0.114)); }",
      "void main(){",
      "  vec3 rgbM =texture2D(tDiffuse,vUv).rgb;",
      "  vec3 rgbNW=texture2D(tDiffuse,vUv+vec2(-1.0,-1.0)*texel).rgb;",
      "  vec3 rgbNE=texture2D(tDiffuse,vUv+vec2( 1.0,-1.0)*texel).rgb;",
      "  vec3 rgbSW=texture2D(tDiffuse,vUv+vec2(-1.0, 1.0)*texel).rgb;",
      "  vec3 rgbSE=texture2D(tDiffuse,vUv+vec2( 1.0, 1.0)*texel).rgb;",
      "  float lM=luma(rgbM), lNW=luma(rgbNW), lNE=luma(rgbNE), lSW=luma(rgbSW), lSE=luma(rgbSE);",
      "  float lMin=min(lM,min(min(lNW,lNE),min(lSW,lSE)));",
      "  float lMax=max(lM,max(max(lNW,lNE),max(lSW,lSE)));",
      "  vec2 dir=vec2(-((lNW+lNE)-(lSW+lSE)), ((lNW+lSW)-(lNE+lSE)));",
      "  float dirReduce=max((lNW+lNE+lSW+lSE)*0.03125, 0.0078125);",
      "  float rcpDirMin=1.0/(min(abs(dir.x),abs(dir.y))+dirReduce);",
      "  dir=min(vec2(8.0),max(vec2(-8.0),dir*rcpDirMin))*texel;",
      "  vec3 rgbA=0.5*(texture2D(tDiffuse,vUv+dir*(1.0/3.0-0.5)).rgb+texture2D(tDiffuse,vUv+dir*(2.0/3.0-0.5)).rgb);",
      "  vec3 rgbB=rgbA*0.5+0.25*(texture2D(tDiffuse,vUv+dir*-0.5).rgb+texture2D(tDiffuse,vUv+dir*0.5).rgb);",
      "  float lB=luma(rgbB);",
      "  gl_FragColor=vec4((lB<lMin||lB>lMax)?rgbA:rgbB,1.0);",
      "}"].join("\n"),
    depthTest:false,depthWrite:false});

  FX.matBright=new THREE.ShaderMaterial({
    uniforms:{tDiffuse:{value:null},threshold:{value:0.82},knee:{value:0.45}},
    vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }",
    fragmentShader:[
      "uniform sampler2D tDiffuse; uniform float threshold; uniform float knee;",
      "varying vec2 vUv;",
      "void main(){",
      "  vec3 c=texture2D(tDiffuse,vUv).rgb;",
      "  float l=dot(c,vec3(0.2126,0.7152,0.0722));",
      "  float s=smoothstep(threshold,threshold+knee,l);",
      "  gl_FragColor=vec4(c*s,1.0);",
      "}"].join("\n"),
    depthTest:false,depthWrite:false});

  FX.matBlur=new THREE.ShaderMaterial({
    uniforms:{tDiffuse:{value:null},dir:{value:new THREE.Vector2(1,0)},
              texel:{value:new THREE.Vector2(1/512,1/512)}},
    vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }",
    fragmentShader:[
      "uniform sampler2D tDiffuse; uniform vec2 dir; uniform vec2 texel;",
      "varying vec2 vUv;",
      /* nine-tap gaussian, linear-sampled */
      "void main(){",
      "  vec2 o=dir*texel;",
      "  vec3 c=texture2D(tDiffuse,vUv).rgb*0.2270270270;",
      "  c+=texture2D(tDiffuse,vUv+o*1.3846153846).rgb*0.3162162162;",
      "  c+=texture2D(tDiffuse,vUv-o*1.3846153846).rgb*0.3162162162;",
      "  c+=texture2D(tDiffuse,vUv+o*3.2307692308).rgb*0.0702702703;",
      "  c+=texture2D(tDiffuse,vUv-o*3.2307692308).rgb*0.0702702703;",
      "  gl_FragColor=vec4(c,1.0);",
      "}"].join("\n"),
    depthTest:false,depthWrite:false});

  FX.matComp=new THREE.ShaderMaterial({
    uniforms:{
      tDiffuse:{value:null}, tBloomA:{value:null}, tBloomB:{value:null},
      texel:{value:new THREE.Vector2(1/1024,1/1024)},
      bloom:{value:0.42}, exposure:{value:1.05},
      lift:{value:new THREE.Vector3(0,0,0)}, gain:{value:new THREE.Vector3(1,1,1)},
      sat:{value:1.04}, contrast:{value:1.06},
      vignette:{value:0.26}, grain:{value:0.011}, sharpen:{value:0.22},
      time:{value:0}
    },
    vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }",
    fragmentShader:[
      "uniform sampler2D tDiffuse; uniform sampler2D tBloomA; uniform sampler2D tBloomB;",
      "uniform vec2 texel; uniform float bloom, exposure, sat, contrast, vignette, grain, sharpen, time;",
      "uniform vec3 lift, gain;",
      "varying vec2 vUv;",
      /* ACES filmic, Narkowicz's fit */
      "vec3 aces(vec3 x){",
      "  return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.0,1.0);",
      "}",
      "void main(){",
      "  vec3 c=texture2D(tDiffuse,vUv).rgb;",
      /* unsharp mask against a four-tap neighbourhood, recovering the
         softness that supersampling costs */
      "  vec3 b=texture2D(tDiffuse,vUv+vec2(texel.x,0.0)).rgb",
      "        +texture2D(tDiffuse,vUv-vec2(texel.x,0.0)).rgb",
      "        +texture2D(tDiffuse,vUv+vec2(0.0,texel.y)).rgb",
      "        +texture2D(tDiffuse,vUv-vec2(0.0,texel.y)).rgb;",
      "  c+=(c-b*0.25)*sharpen;",
      "  c=max(c,vec3(0.0));",
      "  c+=(texture2D(tBloomA,vUv).rgb+texture2D(tBloomB,vUv).rgb*1.3)*bloom;",
      "  c*=exposure;",
      "  c=aces(c);",
      /* lift and gain, then saturation and contrast about mid grey */
      "  c=clamp(c*gain+lift,0.0,1.0);",
      "  float l=dot(c,vec3(0.2126,0.7152,0.0722));",
      "  c=clamp(mix(vec3(l),c,sat),0.0,1.0);",
      /* contrast about mid-grey in perceptual (gamma 2.2) space. Done in linear light, a pivot at
         0.5 sent every value below 0.5(1-1/k) - 0.02 to 0.04 for these presets - to pure black,
         which is what turned slopes in shade into black silhouettes. Here the clip point is
         below one code value, so shade keeps its texture while mid-tones keep the same curve. */
      "  vec3 pc=clamp(pow(max(c,vec3(0.0)),vec3(1.0/2.2)),0.0,1.0);",
      /* pinned at black and white, so the curve can steepen the middle but never clip an end */
      "  vec3 pk=pow(pc,vec3(contrast)), qk=pow(vec3(1.0)-pc,vec3(contrast));",
      "  c=pow(pk/max(pk+qk,vec3(1e-6)),vec3(2.2));",
      /* a quiet frame, and fine grain so flat sky does not band */
      "  vec2 q=vUv-0.5;",
      "  c*=1.0-vignette*dot(q,q)*1.6;",
      "  float n=fract(sin(dot(vUv*vec2(1.0,1.3)+time,vec2(12.9898,78.233)))*43758.5453);",
      "  c+=(n-0.5)*grain;",
      /* linear to sRGB */
      "  c=clamp(c,0.0,1.0);",
      "  vec3 srgb=mix(c*12.92, 1.055*pow(max(c,vec3(0.0031308)),vec3(1.0/2.4))-0.055,",
      "                step(vec3(0.0031308),c));",
      /* Stage 4B (decision 70): no shadow toe. Stage 0 lifted values below 0.2 here; the light now keeps shade off black where
         the shade is made, by the sun's altitude corrected to the display factor and a fill opposite the sun */
      "  gl_FragColor=vec4(srgb,1.0);",
      "}"].join("\n"),
    depthTest:false,depthWrite:false});

  FX.quadCam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  FX.quadScene=new THREE.Scene();
  FX.quad=fsQuad(FX.matBright);
  FX.quad.frustumCulled=false;
  FX.quadScene.add(FX.quad);
  FX.on=true;
  sizeFX();
}
function sizeFX(){
  if(!FX.on) return;
  var s=new THREE.Vector2(); renderer.getDrawingBufferSize(s);
  var w=Math.max(2,(s.x*FX.scale)|0), h=Math.max(2,(s.y*FX.scale)|0);
  FX.rtScene.setSize(w,h);
  FX.rtA.setSize(w/2|0,h/2|0); FX.rtB.setSize(w/2|0,h/2|0);
  FX.rtC.setSize(w/4|0,h/4|0); FX.rtD.setSize(w/4|0,h/4|0);
  FX.matComp.uniforms.texel.value.set(1/w,1/h);
  if(FX.rtFinal){ FX.rtFinal.setSize(s.x,s.y); FX.matFXAA.uniforms.texel.value.set(1/s.x,1/s.y); }
}
function pass(mat,target){
  FX.quad.material=mat;
  renderer.setRenderTarget(target||null);
  renderer.clear();
  renderer.render(FX.quadScene,FX.quadCam);
}
function renderFX(){
  /* 1. the world, linear, into the scene target */
  var t0=performance.now();
  camera.layers.set(LAYER_WORLD);
  renderer.setRenderTarget(FX.rtScene);
  renderer.clear();
  renderer.render(scene,camera);
  DEV.world=devMark(); DEV.tWorld=performance.now()-t0; t0=performance.now();

  /* 2. bright pass, then two blur levels */
  FX.matBright.uniforms.tDiffuse.value=FX.rtScene.texture;
  pass(FX.matBright,FX.rtA);
  var hw=FX.rtA.width, hh=FX.rtA.height;
  FX.matBlur.uniforms.tDiffuse.value=FX.rtA.texture;
  FX.matBlur.uniforms.dir.value.set(1,0);
  FX.matBlur.uniforms.texel.value.set(1/hw,1/hh);
  pass(FX.matBlur,FX.rtB);
  FX.matBlur.uniforms.tDiffuse.value=FX.rtB.texture;
  FX.matBlur.uniforms.dir.value.set(0,1);
  pass(FX.matBlur,FX.rtA);

  FX.matBlur.uniforms.tDiffuse.value=FX.rtA.texture;
  FX.matBlur.uniforms.texel.value.set(1/FX.rtC.width,1/FX.rtC.height);
  FX.matBlur.uniforms.dir.value.set(1,0);
  pass(FX.matBlur,FX.rtC);
  FX.matBlur.uniforms.tDiffuse.value=FX.rtC.texture;
  FX.matBlur.uniforms.dir.value.set(0,1);
  pass(FX.matBlur,FX.rtD);

  /* 3. composite at screen size, then anti-alias the finished frame to the screen */
  FX.matComp.uniforms.tDiffuse.value=FX.rtScene.texture;
  FX.matComp.uniforms.tBloomA.value=FX.rtA.texture;
  FX.matComp.uniforms.tBloomB.value=FX.rtD.texture;
  FX.matComp.uniforms.time.value=HARNESS?0:(performance.now()%10000)*0.001;
  pass(FX.matComp,FX.rtFinal);
  FX.matFXAA.uniforms.tDiffuse.value=FX.rtFinal.texture;
  pass(FX.matFXAA,null);
  DEV.post=devMark(); DEV.tPost=performance.now()-t0; t0=performance.now();

  /* 4. map symbols on top, ungraded, so the map stays readable.
     r128 forces a clear whenever scene.background is a Color, regardless of
     autoClear (WebGLBackground.render, line 51). With the background left in
     place this pass wiped the composite to sky-blue and drew labels on it. */
  camera.layers.set(LAYER_LABEL);
  var ac=renderer.autoClear, bg=scene.background;
  renderer.autoClear=false;
  scene.background=null;
  renderer.render(scene,camera);
  scene.background=bg;
  renderer.autoClear=ac;
  camera.layers.enableAll();
  DEV.total=devMark(); DEV.tLabels=performance.now()-t0;
}

/* ---- one frame path. FX renders linear into a target and grades on the way out;
   the standard path lets the renderer tone-map and encode itself. Either way the
   world reaches the screen, and a failure inside FX drops to the standard path
   instead of leaving the frame empty. ---- */
function setFXEnabled(on){
  if(on && !FX.on){
    try{ initFX(); }
    catch(err){ FX.on=false; console.warn("post processing unavailable, standard path in use"); }
  }
  if(!on) FX.on=false;
  if(FX.on){
    renderer.outputEncoding=THREE.LinearEncoding;
    renderer.toneMapping=THREE.NoToneMapping;
  } else {
    renderer.outputEncoding=THREE.sRGBEncoding;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.0;
  }
  var vb=document.getElementById("fxstate");
  if(vb) vb.textContent=FX.on?"FX on":"FX off";
}
function renderStandard(){
  camera.layers.enableAll();
  renderer.setRenderTarget(null);
  renderer.render(scene,camera);
}
/* Stage 3D's recession of the fog (fogShift) is gone since 4C: the haze is counted beyond the orbit target (applyAtmo). */
function renderFrame(){
  applyLight(false); placeLights();   /* Stage 4B: the light of the clock, and the lights and the shadow box placed for this view */
  applyAtmo();   /* Stage 4C: the haze and the valley fog for this view and this clock */
  domeFollow();  /* Stage 4E: the sky's equator at the eye's horizon */
  renderFrameNow();
}
function renderFrameNow(){
  renderer.info.reset();
  /* the guard: anything that placed the eye without clampCamera() is counted and corrected (the landscape's eye: the paper
     map's plan camera stands far above the flat sheet) */
  if(landCam.position.y<camFloor(landCam.position.x,landCam.position.z)-1e-6){
    CAM.violations++; clampCamera();
    if(CAM.violations===1) console.warn("Austerlitz runtime check: a camera path bypassed the ground floor");
  }
  var tl=performance.now(); mlLayout(); DEV.tLayer=performance.now()-tl;   /* the map layer: only in a drawn frame (Stage 2D) */
  if(!FX.on){ var t0=performance.now(); renderStandard(); DEV.world=DEV.total=devMark(); DEV.tWorld=performance.now()-t0; DEV.tPost=DEV.tLabels=0; DEV.frames++; return; }
  try{ renderFX(); }
  catch(err){
    setFXEnabled(false);
    renderStandard();
  }
  DEV.frames++;
}
/* ---- development readout: render and frame statistics (the ` key, or ?stats) ---- */
var DEV={state:"active",frames:0,skipped:0,tUpdate:0,tWorld:0,tPost:0,tLabels:0,tLayer:0,
  world:{calls:0,triangles:0,points:0,lines:0},post:{calls:0,triangles:0,points:0,lines:0},total:{calls:0,triangles:0,points:0,lines:0}};
function devMark(){ var r=renderer.info.render; return {calls:r.calls,triangles:r.triangles,points:r.points,lines:r.lines}; }
var devOn=/[?&]stats\b/.test(location.search), _devT=0, _devSeat=0;
function kfmt(n){ return n>=1e6?(n/1e6).toFixed(2)+"M":(n>=1e3?(n/1e3).toFixed(1)+"k":String(n)); }
function paintDevStats(now){
  var el=document.getElementById("devstats"); if(!el) return;
  if(el.hidden===devOn) el.hidden=!devOn;
  if(!devOn||now-_devT<500) return;
  var sec=_devT?(now-_devT)/1000:1; _devT=now;
  var fps=DEV.frames/sec, sk=DEV.skipped/sec, se=(SEAT_STATS.blocks-_devSeat)/sec;
  DEV.frames=0; DEV.skipped=0; _devSeat=SEAT_STATS.blocks;
  var mi=renderer.info.memory, c=camera.position, W=DEV.world, T=DEV.total;
  el.textContent=[
    "frames drawn "+fps.toFixed(0)+"/s   skipped "+sk.toFixed(0)+"/s   state "+DEV.state,
    "cpu ms   update "+DEV.tUpdate.toFixed(1)+"   world "+DEV.tWorld.toFixed(1)+"   post "+DEV.tPost.toFixed(1)+"   labels "+DEV.tLabels.toFixed(1)+"   map layer "+DEV.tLayer.toFixed(1),
    "world pass   "+W.calls+" calls   "+kfmt(W.triangles)+" tris   "+kfmt(W.lines)+" lines   "+W.points+" points",
    "post+labels  "+(T.calls-W.calls)+" calls (labels "+(T.calls-DEV.post.calls)+")",
    "seating  "+se.toFixed(1)+" blocks/s ("+SEAT_STATS.blocks+" since load)",
    "map layer   "+ML.stats.placed+" placed   "+ML.stats.dropped+" dropped   "+ML.stats.leaders+" leaders   "+ML.stats.occluded+" behind the ground   "+ML.stats.nodes+" nodes",
    "camera   "+(c.y-camGround(c.x,c.z)).toFixed(2)+" above ground   clamps "+CAM.clamps+"   bypassed "+CAM.violations,
    "memory   "+mi.geometries+" geometries   "+mi.textures+" textures   "+(renderer.info.programs?renderer.info.programs.length:0)+" programs"
  ].join("\n");
}

/* the grade follows the hour: cold and blue before the sun, golden at 08:45 */
function applyGrade(g){
  if(!g) return;
  _gradeNow=[g[0].slice(),g[1].slice(),g[2],g[3],g[4],g[5]];
  if(!FX.on) return;
  var u=FX.matComp.uniforms;
  u.lift.value.set(g[0][0],g[0][1],g[0][2]);
  u.gain.value.set(g[1][0],g[1][1],g[1][2]);
  u.sat.value=g[2]; u.contrast.value=g[3]; u.bloom.value=g[4]; u.exposure.value=g[5];
}
function lerpGrade(a,b,e){
  var o=[[0,0,0],[0,0,0],0,0,0,0];
  for(var i=0;i<3;i++){ o[0][i]=a[0][i]+(b[0][i]-a[0][i])*e; o[1][i]=a[1][i]+(b[1][i]-a[1][i])*e; }
  for(var k=2;k<6;k++) o[k]=a[k]+(b[k]-a[k])*e;
  return o;
}

/* ============================================================
   THE EVENT LAYER
   Events are the joints of the reconstruction: a time, a place, the
   formations concerned, what followed, and how well it is attested.
   ============================================================ */
var eventGroup=null, eventMarks=[];
function evWindow(e){ return Array.isArray(e.t)?e.t:[e.t,e.t]; }
function evWeight(e,t){
  var w=evWindow(e), lead=14, tail=26;
  if(t>=w[0]&&t<=w[1]) return 1;
  if(t<w[0]) return clamp01(1-(w[0]-t)/lead);
  return clamp01(1-(t-w[1])/tail);
}
/* the event the viewer is most likely looking at right now */
function liveEvents(t){
  var out=[];
  for(var i=0;i<EVENTS.length;i++){
    var w=evWeight(EVENTS[i],t);
    if(w>0.02) out.push({e:EVENTS[i],w:w});
  }
  out.sort(function(a,b){ return b.w-a.w; });
  return out;
}
function actOf(ph){
  for(var i=0;i<ACTS.length;i++) if(ACTS[i].phases.indexOf(ph)>=0) return ACTS[i];
  return ACTS[0];
}
function eventGlyph(side,kind){
  var cv=document.createElement("canvas"); cv.width=cv.height=128;
  var x=cv.getContext("2d");
  var col = TOKENS.sym.side[side==="fr"?"fr":"al"].light;
  x.strokeStyle=col; x.lineWidth=5;
  x.beginPath(); x.arc(64,64,38,0,Math.PI*2); x.stroke();
  x.lineWidth=3.5;
  if(kind==="capture"){ x.beginPath(); x.moveTo(64,16); x.lineTo(64,112); x.moveTo(16,64); x.lineTo(112,64); x.stroke(); }
  else if(kind==="decision"){ x.beginPath(); x.arc(64,64,14,0,Math.PI*2); x.stroke(); }
  else if(kind==="arrival"){ x.beginPath(); x.moveTo(40,78); x.lineTo(64,40); x.lineTo(88,78); x.stroke(); }
  else if(kind==="collapse"){ x.beginPath(); x.moveTo(40,40); x.lineTo(88,88); x.moveTo(88,40); x.lineTo(40,88); x.stroke(); }
  else { x.beginPath(); x.moveTo(64,34); x.lineTo(64,94); x.stroke();
         x.beginPath(); x.moveTo(48,52); x.lineTo(64,32); x.lineTo(80,52); x.stroke(); }
  return ctex(cv);
}
/* The decisive fact of the morning is a negative one: the plateau emptying.
   Empty ground shows nothing, so the plateau is surveyed on the map and the
   holding read off the plotted formations. */
var plateauRing=null;
function buildPlateauRing(){
  var pts=[], P=PLATEAU_POLY.concat([PLATEAU_POLY[0]]);
  for(var a=0;a<P.length-1;a++) for(var k=0;k<8;k++){
    var mx=P[a][0]+(P[a+1][0]-P[a][0])*k/8, my=P[a][1]+(P[a+1][1]-P[a][1])*k/8;
    var w=W(mx,my);
    pts.push(w[0],displayHeight(w[0],w[1])+1.6,w[1]);
  }
  var w0=W(P[0][0],P[0][1]); pts.push(w0[0],displayHeight(w0[0],w0[1])+1.6,w0[1]);
  var g=new THREE.BufferGeometry();
  g.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));
  plateauRing=new THREE.Line(g,new THREE.LineBasicMaterial({color:lin(hexNum(TOKENS.sym.label.dark.annotation)),
    transparent:true,opacity:0,depthTest:false}));
  plateauRing.renderOrder=16;
  eventGroup.add(plateauRing);   /* its reading is the map layer's (plateauText), over the northern part of the outline */
}
function updatePlateauRing(){
  if(!plateauRing) return;
  var show = curPhase<=7 && presentation!=="map";
  var tgt = show?0.5:0;
  var pro=tgt-plateauRing.material.opacity; if(Math.abs(pro)>0.004) settling=true;
  plateauRing.material.opacity += pro*ease(0.06);
  plateauRing.visible=plateauRing.material.opacity>0.01;
}
var selRing=null;
function buildSelRing(){
  var pts=[];
  for(var a=0;a<=64;a++){
    var th=a/64*Math.PI*2;
    pts.push(Math.cos(th),0,Math.sin(th));
  }
  var g=new THREE.BufferGeometry();
  g.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));
  selRing=new THREE.Line(g,new THREE.LineBasicMaterial({color:lin(hexNum(TOKENS.theme.dark.accent)),
    transparent:true,opacity:0,depthTest:false}));
  selRing.renderOrder=17;
  selRing.visible=false;
  scene.add(selRing);
}
function updateSelRing(){
  if(!selRing) return;
  var on = selection && selection.kind==="f" && units[selection.id] &&
           mode!=="staff" && presentation!=="map";
  if(!on){ selRing.material.opacity=0; selRing.visible=false; return; }
  var p=posNow(selection.id);
  if(!p){ selRing.visible=false; return; }
  var rec=units[selection.id], ud=rec.block.userData;
  var r=Math.max(7,(ud&&ud.W0?ud.W0:8)*0.62*1.25*(ud?ud.sw:1)+3.4);
  var w=W(p[0],p[1]);
  selRing.position.set(w[0],displayHeight(w[0],w[1])+0.7,w[1]);
  selRing.scale.set(r,1,r*0.82);
  selRing.visible=true;
  var sro=0.62-selRing.material.opacity; if(Math.abs(sro)>0.004) settling=true;
  selRing.material.opacity += sro*ease(0.12);
}
function buildEventLayer(){
  eventGroup=new THREE.Group(); scene.add(eventGroup);
  EVENTS.forEach(function(e){
    var w=W(e.p[0],e.p[1]), gy=displayHeight(w[0],w[1]);   /* the glyph carries the side; the words (the map layer's) stay neutral */
    var m=new THREE.SpriteMaterial({map:eventGlyph(e.side,e.kind),transparent:true,
      opacity:0,depthTest:false,fog:false});
    var sp=new THREE.Sprite(m);
    sp.position.set(w[0],gy+4.2,w[1]); sp.scale.set(5.4,5.4,1); sp.renderOrder=23;
    asLabel(sp); eventGroup.add(sp);
    eventMarks.push({e:e,sp:sp,m:m,world:sp.position.clone(),r:2.1,r0:2.1,s0:5.4,fade:1});
  });
  buildPlateauRing();
  buildSelRing();
}
function updateEventLayer(){
  if(!eventGroup) return;
  var show=layerOn.events && !cleanViewHidesEvents();
  eventGroup.visible=show;
  if(!show) return;
  updatePlateauRing();
  for(var i=0;i<eventMarks.length;i++){
    var k=eventMarks[i], w=evWeight(k.e,clock);
    var sel=(selection&&selection.kind==="e"&&selection.id===k.e.id);
    var a=sel?1:w;
    k.m.opacity=a*0.95;
    k.sp.visible=a>0.02; k.labelOn=(a>0.45||sel);   /* the map layer draws the label of a live event */
  }
}
function cleanViewHidesEvents(){ return presentation==="map"; }
/* Stage 3E (docs/STAGE3_SPEC.md section G.3; owner decision 57): the event glyphs and the objective markers (the overlays' and
   the plans') keep a largest size on screen, SYM_MAX_PX, and fade out within SYM_FADE of the eye, as the counters and labels keep
   one size. They are world-sized sprites: at the orbit minimum the eye stood 1.8 units from an event glyph drawn 6,100 px wide,
   and the map layer, which keeps labels clear of it, placed nothing. Every harness view but that one draws them at 189 px or less
   (close-sokolnitz), so the cap changes only views closer than those. The layer's obstacle discs shrink and fade with them.
   Run after updateVisibility has set their opacities (each drawn frame, and settle). */
var SYM_MAX_PX=192, SYM_FADE=[4,12];
function symbolSizes(){
  if(camera.isOrthographicCamera){   /* the paper map: drawn at their authored size, as before (no eye stands among them) */
    var reset=function(o,sp){ o.fade=1; o.r=o.r0; if(sp) sp.scale.set(o.s0,o.s0,1); if(o.op0!==undefined&&sp) sp.material.opacity=o.op0; };
    eventMarks.forEach(function(k){ reset(k,k.sp); }); ovMarkers.forEach(function(m){ reset(m,m.sp); }); planMarkers.forEach(function(m){ reset(m,m.sp); });
    return; }
  function one(o,pos,sp,mat,op){
    var wpp=worldPerPx(pos), f=Math.min(1,SYM_MAX_PX*wpp/o.s0), d=camera.position.distanceTo(pos);
    o.fade=Math.max(0,Math.min(1,(d-SYM_FADE[0])/(SYM_FADE[1]-SYM_FADE[0])));
    o.r=o.r0*f;
    if(sp){ sp.scale.set(o.s0*f,o.s0*f,1); if(mat&&op!==undefined) mat.opacity=op*o.fade; }
  }
  eventMarks.forEach(function(k){ one(k,k.world,k.sp,k.m,k.m.opacity); });
  ovMarkers.forEach(function(m){ if(m.sp) one(m,m.pos,m.sp,m.sp.material,m.sp.material.opacity); });
  planMarkers.forEach(function(m){ if(m.sp) one(m,m.pos,m.sp,m.sp.material,m.op0); });
}

/* ============================================================
   DERIVED READINGS
   Computed from the plotted reconstruction, not from a source.
   ============================================================ */
/* The plateau outline: encloses Pratzen village, Stare Vinohrady, the col
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
}
var PBERG_NORTHING=GEOREF.GT.pratzeberg?GEOREF.northingKm(GEOREF.GT.pratzeberg.map[0],GEOREF.GT.pratzeberg.map[1]):0;
var SEP_KM=1.45;   /* how close to the line a French formation must stand to separate the two groups */
function sideCentroid(side,which){
  var sx=0,sy=0,n=0;
  Object.keys(units).forEach(function(id){
    var f=FORMATIONS[id];
    if(f.arm==="hq") return;
    if((f.nation==="fr")!==(side==="fr")) return;
    var p=posNow(id); if(!p) return;
    var dn=GEOREF.northingKm(p[0],p[1])-PBERG_NORTHING;   /* true north/south of the Pratzeberg */
    if(which==="south"&&dn>0) return;
    if(which==="north"&&dn<=0) return;
    sx+=p[0]; sy+=p[1]; n++;
  });
  return n?[sx/n,sy/n]:null;
}
/* A derived spatial reading, not a historical statistic: is a French
   formation standing across the line joining the Allied groups north and
   south of the plateau? When it stops being true, that means the geometry
   no longer holds, not that the Allied army has reunited. */
function centreSeparation(){
  var a=sideCentroid("al","south"), b=sideCentroid("al","north");
  if(!a||!b) return false;
  var cut=false;
  Object.keys(units).forEach(function(id){
    if(cut) return;
    var f=FORMATIONS[id];
    if(f.nation!=="fr"||f.arm==="hq") return;
    var p=posNow(id); if(!p) return;
    var vx=b[0]-a[0], vy=b[1]-a[1], L=vx*vx+vy*vy;
    if(L<1) return;
    var t=((p[0]-a[0])*vx+(p[1]-a[1])*vy)/L;
    if(t<0.18||t>0.82) return;
    var qx=a[0]+vx*t, qy=a[1]+vy*t;
    if(Math.hypot(p[0]-qx,p[1]-qy)*KM_PER_MAP<SEP_KM) cut=true;
  });
  return cut;
}

/* ============================================================
   WHAT A COMMANDER COULD KNOW
   ============================================================ */
/* Heights above ground are real metres converted through the vertical scale:
   a mounted observer's eye (3 m) and the top of a formed body - heads,
   bayonets, standards (2.5 m). The relief is exaggerated but uniformly, and a
   uniform vertical scale does not change what can be seen; only these offsets
   must be converted. */
var EYE_OBSERVER_M=3.0, EYE_TARGET_M=2.5, LOS_CLEAR_M=0.5;
function hasLOS(aMap,bMap,eyeA,eyeB){
  var wa=W(aMap[0],aMap[1]), wb=W(bMap[0],bMap[1]);
  var ha=height(wa[0],wa[1])+(eyeA||GEOREF.unitsFromM(EYE_OBSERVER_M)), hb=height(wb[0],wb[1])+(eyeB||GEOREF.unitsFromM(EYE_TARGET_M));
  var dx=wb[0]-wa[0], dz=wb[1]-wa[1];
  var L=Math.sqrt(dx*dx+dz*dz);
  if(L<2) return true;
  var n=Math.min(110,Math.max(4,Math.ceil(L/2.2)));
  for(var i=1;i<n;i++){
    var t=i/n;
    if(height(wa[0]+dx*t, wa[1]+dz*t) > ha+(hb-ha)*t+GEOREF.unitsFromM(LOS_CLEAR_M)) return false;
  }
  return true;
}
var knowCache={}, knowKey="";
function knowledgeOf(id){
  if(commandView==="none") return "all";
  var f=FORMATIONS[id];
  if(!f) return "all";
  var side=(f.nation==="fr")?"fr":"al";
  if(side===commandView) return "own";
  var key=commandView+"|"+curPhase;
  if(knowKey!==key){ knowKey=key; knowCache={}; }
  if(knowCache[id]) return knowCache[id];
  var r="seen", ov=KNOW_OVERRIDE[commandView] && KNOW_OVERRIDE[commandView][id];
  if(ov){
    for(var i=ov.length-1;i>=0;i--) if(curPhase>=ov[i][0]){ r=ov[i][1]; break; }
  } else {
    var hq=posNow(commandView==="fr"?"gqg":"ahq"), p=posNow(id);
    if(!hq||!p) r="unknown";
    else if(!hasLOS(hq,p)) r="unknown";
    else if(PHASES[curPhase].mist>0.5 && hAt(p[0],p[1])<-0.8) r="uncertain";
  }
  knowCache[id]=r;
  return r;
}

/* ============================================================
   HIERARCHY HIGHLIGHTING AND ANALYSIS CHAPTERS
   ============================================================ */
function familyOf(id){
  var set={}, f=FORMATIONS[id];
  if(!f) return null;
  (function down(k){
    set[k]=true;
    var g=FORMATIONS[k];
    if(g&&g.children) g.children.forEach(down);
  })(id);
  var p=f.parent;
  while(p){ set[p]=true; p=FORMATIONS[p]?FORMATIONS[p].parent:null; }
  return set;
}
function setHighlight(set){
  if(highlight===set) return;
  highlight=set;
}
function chapterById(cid){
  for(var i=0;i<ANALYSIS.length;i++) if(ANALYSIS[i].id===cid) return ANALYSIS[i];
  return null;
}
/* The spine (the data task; docs/STAGE3_SPEC.md section C.2): a moment is a phase ("ph:<n>") or an event ("ev:<id>"); its clock is
   the phase's start or the event's start, its camera the phase's (an event's: the phase its start falls in). A theme opens on
   its principal moment (at) with its own camera if it has one; a tour stop takes its moment's clock unless it keeps its own (t),
   and its own camera, else its theme's, else its moment's phase's. */
function momentOf(m){
  var k=String(m||""), i=k.indexOf(":"), kind=k.slice(0,i), id=k.slice(i+1);
  if(kind==="ph"){ var n=+id; if(PHASES[n]&&String(n)===id) return {kind:"ph",id:n,t:PHASES[n].t0,ph:n}; return null; }
  if(kind==="ev"){ for(var j=0;j<EVENTS.length;j++) if(EVENTS[j].id===id){ var t=evWindow(EVENTS[j])[0]; return {kind:"ev",id:id,t:t,ph:phaseAt(t)}; } }
  return null;
}
function chapterClock(c){ return momentOf(c.at).t; }
function chapterCam(c){ return c.cam||PHASES[momentOf(c.at).ph].cam; }
function stopClock(st){ return st.t!==undefined?st.t:momentOf(st.at).t; }
function stopCam(st){ if(st.cam) return st.cam; var c=st.chapter?chapterById(st.chapter):null; return c?chapterCam(c):PHASES[momentOf(st.at).ph].cam; }
function setChapter(cid){
  var c=chapterById(cid);
  if(!c){ chapter=null; setHighlight(null); paintChapters(); paintChapterText(); paintTimeline(); return; }
  chapter=cid;
  var set={};
  c.forms.forEach(function(k){
    var fam=familyOf(k);
    if(fam) Object.keys(fam).forEach(function(q){ set[q]=true; });
  });
  setHighlight(set);
  freeCam=false;
  setClock(chapterClock(c),{force:true,camera:false});
  flyTo(chapterCam(c));
  paintChapters();
  paintChapterText();
}
function paintChapters(){
  document.querySelectorAll(".chap").forEach(function(b){
    b.setAttribute("aria-current", b.dataset.c===chapter ? "true":"false");
  });
}
function paintChapterText(){
  var host=document.getElementById("chaptext");
  if(!host) return;
  if(!chapter){ host.innerHTML='<p class="muted">Pick one of the ten moments above. The map will move to that hour, highlight the formations and ground involved, and dim everything else.</p>'; return; }
  var c=chapterById(chapter);
  var feats=c.feats.map(function(fid){
    var nm=fid; FEATURES.forEach(function(x){ if(x.id===fid) nm=x.name; });
    return '<button class="linkb" data-feat="'+esc(fid)+'">'+esc(nm)+'</button>';
  }).join(" ");
  host.innerHTML='<h3>'+esc(c.n)+' <span class="hh">'+esc(fmtClock(chapterClock(c)))+'</span></h3>'+
    '<p class="prose">'+esc(c.text)+'</p>'+
    '<div class="chapfeat">'+feats+'</div>';
  host.querySelectorAll("[data-feat]").forEach(function(b){
    b.addEventListener("click",function(){ select("t",b.dataset.feat); });
  });
}
function paintCommand(){
  var host=document.getElementById("cmdbody");
  if(!host) return;
  if(commandView==="none"){
    host.innerHTML='<p class="muted">Choose a headquarters. Enemy formations it could not see are removed from the map; formations known only by report are drawn with a broken outline and a query.</p>';
    return;
  }
  var side=commandView, book=COMMAND[side]||{}, items=null;
  for(var i=curPhase;i>=0;i--){ if(book[i]){ items=book[i]; break; } }
  var who = side==="fr" ? "Imperial Headquarters, Napoleon" : "Allied Headquarters, Kutuzov and the Tsar";
  var KIND={saw:"Could see",knew:"Knew",didnt:"Did not know",ordered:"Ordered",expected:"Expected"};
  var h='<p class="cmdwho">'+esc(who)+' <span class="hh">'+esc(PHASES[curPhase].clock)+'</span></p>';
  if(!items) h+='<p class="muted">Nothing recorded for this hour.</p>';
  else h+='<dl class="cmdlist">'+items.map(function(it){
    return '<div class="cmdrow"><dt>'+esc(KIND[it[0]]||it[0])+
      '</dt><dd>'+esc(it[2])+' <span class="src '+(it[1]==="doc"?"doc":"inf")+'">'+
      iconSVG(TOKENS.sym.source[it[1]==="doc"?"doc":"inf"])+(it[1]==="doc"?"DOCUMENTED":"INFERRED")+'</span></dd></div>';
  }).join("")+'</dl>';
  host.innerHTML=h;
}
function setCommandView(v){
  commandView=v;
  knowKey="";
  document.querySelectorAll(".cmd-btn").forEach(function(b){
    b.setAttribute("aria-pressed", b.dataset.cv===v ? "true":"false");
  });
  document.body.classList.toggle("cmd-on", v!=="none");
  paintCommand();
}

/* ============================================================
   PLAN OVERLAY — intended lines of march, drawn heavy
   ============================================================ */
function clearPlan(){
  planText=[]; planMarkers=[]; planHeads=[];
  if(!planGroup) return;
  scene.remove(planGroup);
  disposeGroup(planGroup);
  planGroup=null;
}
/* A staff-map arrow: a tapered ribbon laid on the ground with a broad head,
   which reads from directly above far better than a tube does. */
function planRibbon(pts,colour,edge,w0,w1,headW,headL,chevron){
  var lift=1.9;
  var curve=new THREE.CatmullRomCurve3(groundPts(pts,lift));
  function build(scale,col,op,yAdd){
    var N=56, v=[], idx=[];
    for(var i=0;i<=N;i++){
      var t=i/N, pt=curve.getPoint(t), tg=curve.getTangent(t).normalize();
      var nx=-tg.z, nz=tg.x, L=Math.sqrt(nx*nx+nz*nz)||1; nx/=L; nz/=L;
      var hw=((w0+(w1-w0)*t)*scale)/2;
      var ax=pt.x+nx*hw, az=pt.z+nz*hw, bx=pt.x-nx*hw, bz=pt.z-nz*hw;
      v.push(ax,displayHeight(ax,az)+lift+yAdd,az, bx,displayHeight(bx,bz)+lift+yAdd,bz);
    }
    for(var k=0;k<N;k++){ var o=k*2; idx.push(o,o+1,o+2, o+1,o+3,o+2); }
    var g=new THREE.BufferGeometry();
    g.setAttribute("position",new THREE.Float32BufferAttribute(v,3));
    g.setIndex(idx); g.computeVertexNormals();
    var m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({color:lin(col).clone().multiplyScalar(0.58),transparent:true,opacity:op*0.78,
      fog:false,depthWrite:false,depthTest:false,side:THREE.DoubleSide}));
    m.renderOrder=13; planGroup.add(m);

    /* head */
    var end=curve.getPoint(1), tg2=curve.getTangent(1).normalize();
    var nx2=-tg2.z, nz2=tg2.x, L2=Math.sqrt(nx2*nx2+nz2*nz2)||1; nx2/=L2; nz2/=L2;
    var hw2=(headW*scale)/2, hl=headL*scale;
    var tipx=end.x+tg2.x*hl, tipz=end.z+tg2.z*hl;
    var lx=end.x+nx2*hw2, lz=end.z+nz2*hw2;
    var rx=end.x-nx2*hw2, rz=end.z-nz2*hw2;
    var hv=[tipx,displayHeight(tipx,tipz)+lift+yAdd,tipz,
            lx,displayHeight(lx,lz)+lift+yAdd,lz,
            rx,displayHeight(rx,rz)+lift+yAdd,rz];
    var hidx=[0,1,2];
    if(chevron){
      var bx2=end.x-tg2.x*hl*0.38, bz2=end.z-tg2.z*hl*0.38;
      hv.push(bx2,displayHeight(bx2,bz2)+lift+yAdd,bz2);
      hidx=[0,1,3, 0,3,2];
    }
    var hg=new THREE.BufferGeometry();
    hg.setAttribute("position",new THREE.Float32BufferAttribute(hv,3));
    hg.setIndex(hidx); hg.computeVertexNormals();
    var hm=new THREE.Mesh(hg,new THREE.MeshBasicMaterial({color:lin(col).clone().multiplyScalar(0.58),transparent:true,opacity:op*0.78,
      fog:false,depthWrite:false,depthTest:false,side:THREE.DoubleSide}));
    hm.renderOrder=13; planGroup.add(hm);
    if(scale>1) planHeads.push(hm);   /* the casing's head (with the chevron's fourth point): labels keep clear of it (2D) */
  }
  build(1.34,edge,0.55,-0.06);   /* dark casing so the arrow reads over any ground */
  build(1.00,colour,0.96,0.0);
}
function planStaging(area,colour,edge){
  var c=W(area.c[0],area.c[1]);
  var mk=new THREE.Mesh(new THREE.CircleGeometry(1,48),
    new THREE.MeshBasicMaterial({color:lin(colour).clone().multiplyScalar(0.6),transparent:true,opacity:0.13,
      fog:false,depthWrite:false,depthTest:false}));
  mk.rotation.x=-Math.PI/2;
  mk.position.set(c[0],displayHeight(c[0],c[1])+1.2,c[1]);
  mk.scale.set(area.rx*0.5,area.ry*0.5,1);
  mk.renderOrder=11; planGroup.add(mk);
  var pts=[];   /* a plan: dashed (decision 15), sixteen dashes of half their period */
  dashRuns(16,0.5).forEach(function(r){ r.forEach(function(u){
    var th=u*Math.PI*2, x=c[0]+Math.cos(th)*area.rx*0.5, z=c[1]+Math.sin(th)*area.ry*0.5;
    pts.push(x,displayHeight(x,z)+1.4,z); }); });
  var g=new THREE.BufferGeometry();
  g.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));
  var ln=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:lin(edge),transparent:true,
    opacity:0.65,depthTest:false}));
  ln.renderOrder=12; planGroup.add(ln);
  planLabel(area.n,{pos:new THREE.Vector3(c[0],displayHeight(c[0],c[1])+1.2,c[1]),acl:4});
}
function planObjective(obj,colour){
  var c=W(obj.p[0],obj.p[1]);
  var cv=document.createElement("canvas"); cv.width=cv.height=160;
  var x=cv.getContext("2d");
  x.strokeStyle="#"+("000000"+colour.toString(16)).slice(-6);
  x.lineWidth=11; x.beginPath(); x.arc(80,80,54,0,Math.PI*2); x.stroke();
  x.lineWidth=9; x.beginPath();
  x.moveTo(80,12); x.lineTo(80,148); x.moveTo(12,80); x.lineTo(148,80); x.stroke();
  var m=new THREE.SpriteMaterial({map:ctex(cv),transparent:true,opacity:0.95,depthTest:false,fog:false});
  var sp=new THREE.Sprite(m);
  sp.position.set(c[0],displayHeight(c[0],c[1])+4.0,c[1]);
  sp.scale.set(7.2,7.2,1); sp.renderOrder=24; asLabel(sp); planGroup.add(sp);
  planMarkers.push({pos:sp.position.clone(),r:3.1,r0:3.1,sp:sp,s0:7.2,op0:0.95,fade:1});   /* the cross reaches 3.06 units */
  planLabel(obj.n,{pos:sp.position.clone(),acl:3,r:3.1});
}
/* a plan label: annotation text, the map layer's; the ribbon carries the side */
function planLabel(text,anchor){ planText.push({text:text,pos:anchor.pos,acl:anchor.acl,r:anchor.r||0}); }
var planLinks=null;
function buildPlanLinks(){
  var sides = planSide==="both" ? ["al","fr"] : [planSide];
  var n=0;
  sides.forEach(function(sd){ PLANS[sd].cols.forEach(function(c){ if(c.forms) n+=c.forms.length; }); });
  if(!n) return;
  var g=new THREE.BufferGeometry();
  g.setAttribute("position",new THREE.Float32BufferAttribute(new Float32Array(n*6),3));
  planLinks=new THREE.LineSegments(g,new THREE.LineDashedMaterial({color:lin(hexNum(TOKENS.sym.label.dark.annotation)),
    dashSize:2.4,gapSize:2.0,transparent:true,opacity:0.5,depthTest:false}));
  planLinks.renderOrder=15;
  planGroup.add(planLinks);
  planLinks.userData.pairs=[];
  sides.forEach(function(sd){
    PLANS[sd].cols.forEach(function(c){
      (c.forms||[]).forEach(function(fid,ix){
        planLinks.userData.pairs.push([fid,c.obj,ix===0]);
      });
    });
  });
}
function updatePlanLinks(){
  if(!planLinks||!planSide) return;
  var arr=planLinks.geometry.attributes.position.array, pairs=planLinks.userData.pairs, k=0, drawn=0;
  var near=viewDist()<190;
  for(var i=0;i<pairs.length;i++){
    var show = pairs[i][2] || near ||
               (selection&&selection.kind==="f"&&selection.id===pairs[i][0]);
    var p=show?posNow(pairs[i][0]):null;
    if(!p){ arr[k]=arr[k+1]=arr[k+2]=arr[k+3]=arr[k+4]=arr[k+5]=0; k+=6; continue; }
    var a=W(p[0],p[1]), b=W(pairs[i][1][0],pairs[i][1][1]);
    arr[k++]=a[0]; arr[k++]=displayHeight(a[0],a[1])+2.6; arr[k++]=a[1];
    arr[k++]=b[0]; arr[k++]=displayHeight(b[0],b[1])+2.6; arr[k++]=b[1];
    drawn++;
  }
  planLinks.geometry.attributes.position.needsUpdate=true;
  planLinks.computeLineDistances();
  planLinks.visible=drawn>0;
}
function setPlan(side){
  planSide=(planSide===side)?null:side;
  planLinks=null;
  clearPlan();
  if(planSide){
    planGroup=new THREE.Group(); scene.add(planGroup);
    var sides = planSide==="both" ? ["al","fr"] : [planSide];
    sides.forEach(function(sd){
      var col  = hexNum(TOKENS.sym.side[sd].base);
      var edge = hexNum(TOKENS.sym.side[sd].edge);
      var chev = (sd==="al");
      var P=PLANS[sd];
      (P.staging||[]).forEach(function(a){ planStaging(a,col,edge); });
      P.cols.forEach(function(c){
        planRibbon(c.route,col,edge,3.6,6.4,15.0,13.0,chev);
        var mid=c.route[Math.max(0,Math.floor(c.route.length/2)-1)];
        var w=W(mid[0],mid[1]);
        planLabel(c.n.split(" - ")[0],{pos:new THREE.Vector3(w[0],displayHeight(w[0],w[1])+1.9,w[1]),acl:6});
      });
      (P.objectives||[]).forEach(function(o){ planObjective(o,col); });
    });
    buildPlanLinks();
    if(!freeCam) flyTo(VANTAGE.plan);
  }
  document.querySelectorAll(".plan-btn").forEach(function(b){
    b.setAttribute("aria-pressed", b.dataset.p===planSide ? "true":"false");
  });
  document.body.classList.toggle("plan-on",!!planSide);   /* the legend explains the staging outline */
  if(!chapter) setHighlight(planSide?{}:null);
  paintPlanText();
}
function paintPlanText(){
  var host=document.getElementById("plantext");
  if(!host) return;
  if(!planSide){
    host.innerHTML='<p class="muted">Choose a plan. The intended lines of march are drawn across the whole field in heavy arrows, independent of the clock, so you can compare what was ordered with what happened.</p>';
    return;
  }
  var sides = planSide==="both" ? ["al","fr"] : [planSide];
  host.innerHTML = sides.map(function(sd){
    var P=PLANS[sd];
    return '<div class="planblock plan-'+sd+'">'+
      '<h3>'+esc(P.name)+'</h3>'+
      '<p class="planauth">'+esc(P.author)+'</p>'+
      '<h4>Intent</h4><p class="prose">'+esc(P.intent)+'</p>'+
      '<h4>What it assumed</h4><ul class="bul">'+P.assumed.map(function(a){return '<li>'+esc(a)+'</li>';}).join('')+'</ul>'+
      '<h4>Orders</h4><dl class="kvs">'+P.cols.map(function(c){
        return '<div class="kv"><dt>'+esc(c.n)+'</dt><dd>'+esc(c.ord)+'</dd></div>'; }).join('')+'</dl>'+
      '<p class="note">'+esc(P.cost)+'</p></div>';
  }).join('');
}

/* ============================================================
   GUIDED TOUR — eight stops through the existing material
   ============================================================ */
function clearOverlays(){
  if(planSide) setPlan(planSide);
  if(chapter) setChapter(null);
}
function startTour(){
  closeFirst(null);
  tourStep=0;
  hideDispatch=true; syncVis();
  applyTour();
}
function exitTour(){
  tourStep=-1; paintTimeline();
  var b=document.getElementById("tourbar");
  if(b) b.hidden=true;
  clearOverlays();
  select(null,null);
  hideDispatch=false; syncVis();
}
function tourGo(d){
  if(tourStep<0) return;
  var n=tourStep+d;
  if(n<0) return;
  if(n>=TOUR.length){ exitTour(); return; }
  tourStep=n; applyTour();
}
function applyTour(){
  var st=TOUR[tourStep];
  stopPlay();
  clearOverlays();
  if(st.chapter) setChapter(st.chapter);
  if(st.plan) setPlan(st.plan);
  setClock(stopClock(st),{force:true,camera:false});
  freeCam=false; flyTo(stopCam(st));
  if(st.feature) select("t",st.feature); else select(null,null);
  var bar=document.getElementById("tourbar");
  bar.hidden=false;
  document.getElementById("tour-n").textContent=(tourStep+1)+" OF "+TOUR.length;
  document.getElementById("tour-t").textContent=st.n;
  document.getElementById("tour-x").textContent=st.x;
  var pv=document.getElementById("tour-prev");
  pv.disabled=(tourStep===0);
  pv.style.opacity=tourStep===0?0.4:1;
  document.getElementById("tour-next").textContent =
    (tourStep===TOUR.length-1) ? "Finish" : "Next";
}

/* ---------------- view modes ---------------- */
function setMode(m){
  var was=mode;
  mode=m;
  var staff=(m==="staff");
  /* Stage 2E: the paper map is a true north-up plan (MAPCAM) over the ground drawn flat (decisions 19 and 25) */
  setDrawnFlat(staff);
  camera=staff?paperCam:landCam;
  setGround(goingOn?"going":(staff?"paper":"natural"));
  setContourStyle(staff);
  world.dome.visible=!staff;
  syncLandscapeLayers();
  renderer.shadowMap.enabled=!staff;
  world.water.forEach(function(w2){ if(w2.material.opacity!==undefined) w2.material.opacity=staff?1:0.94; });
  (world.iceRims||[]).forEach(function(r2){ r2.visible=!staff; });   /* Stage 4E: the shore ice is the landscape's */

  applyLight(true);   /* Stage 4B: the paper map's own light, or the landscape's light of the clock */

  document.body.classList.toggle("mode-staff",staff);
  if(ML.root){ ML.root.tabIndex=0;   /* Stage 3D: the landscape layer takes keyboard focus as the paper map's does */
    ML.root.setAttribute("aria-label",staff?"The paper map, north up: arrow keys pan, plus and minus zoom; Tab reaches its formations, events and places"
      :"The map: arrow keys pan, Shift and the arrow keys turn and tilt, plus and minus zoom; Tab reaches its formations, events and places"); }
  document.querySelectorAll(".mode-btn").forEach(function(b){
    b.setAttribute("aria-pressed", b.dataset.m===m ? "true":"false");
  });

  rebuildOverlays(curPhase,true);
  if(planSide){ var keep=planSide, fc=freeCam; planSide=null; freeCam=true; setPlan(keep); freeCam=fc; }
  paintExaggeration();
  /* entering the paper map: the whole field framed in the free part of the screen, unless the plan was moved by hand
     before (then it is as it was left); leaving it: the landscape eye where it was, or the phase's view */
  if(staff){ if(was!=="staff"){ if(MAPCAM.moved()) MAPCAM.apply(); else MAPCAM.frameField(true); } }
  else if(!freeCam) flyTo(PHASES[curPhase].cam);
  requestRender(3);
}

/* the terrain-study labels: their anchors (the map layer draws them) and colours */
function buildAnalysisLabels(){
  TERRAIN_LINES.forEach(function(tl){ terrainLabels.push({tl:tl,col:TOKENS.sym.analysis[tl.t],world:new THREE.Vector3(tl._mid[0],tl._mid[1],tl._mid[2])}); });
}

/* ---------------- the projection, and level of detail ----------------
   Stage 2E (docs/STAGE2_SPEC.md sections F and G): one projection helper serves both cameras. worldPerPx(p) is the
   ground length (world units) one screen pixel spans at the point p: for the perspective eye it grows with p's depth
   along the view, for the paper map's orthographic plan it is the same everywhere. It is the projection, not a scale:
   metres and kilometres still come only from GEOREF (UNITS_PER_KM, M_PER_WORLD). The level of detail, the map layer's
   sizes, the symbols' clearances and the scale bar read it; nothing reads a camera's field of view any more. */
var _pv=new THREE.Vector3();
function viewH(){ return renderer.domElement.clientHeight||window.innerHeight; }
function worldPerPx(p){
  if(camera.isOrthographicCamera) return (camera.top-camera.bottom)/(camera.zoom*viewH());
  camera.updateMatrixWorld();
  var d=p ? -_pv.copy(p).applyMatrix4(camera.matrixWorldInverse).z : camera.position.distanceTo(orbitTarget);
  return 2*d*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))/viewH();
}
function pxPerWorld(atPos){ return 1/worldPerPx(atPos); }
/* the distance at which the landscape eye shows the ground at a given worldPerPx, and back: the paper map's zoom is read
   against the landscape's level-of-detail distances (corps beyond 250, brigades within 165, full counters within 70) */
function distAtWpp(w){ return w*viewH()/(2*Math.tan(THREE.MathUtils.degToRad(landCam.fov/2))); }
function mapWppAt(d){ return 2*d*Math.tan(THREE.MathUtils.degToRad(landCam.fov/2))/viewH(); }
function viewDist(){ return camera.isOrthographicCamera ? distAtWpp(worldPerPx(null)) : camera.position.distanceTo(orbitTarget); }
function viewDistTo(p){ return camera.isOrthographicCamera ? distAtWpp(worldPerPx(p)) : camera.position.distanceTo(p); }

/* ---------------- the paper map's camera: MAPCAM (Stage 2E; docs/STAGE2_SPEC.md section G.2; owner decision 25) ----------------
   A true north-up plan: an orthographic camera looking straight down with GEOREF.NORTH up on the screen (the map frame is
   rotated GEOREF.ROT_DEG from north), so one scale holds across the whole view and the scale bar is exact everywhere.
   The map controls: a drag moves the ground with the pointer; the wheel zooms toward the cursor, the ground point under it
   staying under it; keys pan and zoom; framing puts the ground in question in the largest part of the screen no panel
   covers; eased moves. The state is in ground terms (the point at the centre of the screen, world units per pixel), and
   the module knows only its camera and three functions it is given (the viewport, the panels, a scheduler for eased moves),
   so that Stage 3 can reuse it. No orbit, no tilt. */
var MAPCAM=(function(){
  var cam=null, env=null, st={x:0,z:0,wpp:0.5}, moved=false, framed=false, gid=0, H=400;
  var N=new THREE.Vector3(GEOREF.NORTH[0],0,GEOREF.NORTH[1]).normalize(), E=new THREE.Vector3(-N.z,0,N.x);   /* north and east on the ground */
  var FIELD=[[-GROUND_W/2,-GROUND_D/2],[GROUND_W/2,-GROUND_D/2],[GROUND_W/2,GROUND_D/2],[-GROUND_W/2,GROUND_D/2]];   /* the modelled ground */
  var MARGIN=10, lim={min:0.015,max:0.8};
  function vp(){ return env.viewport(); }
  function init(c,e){ cam=c; env=e; cam.up.copy(N); }
  function apply(){
    var v=vp(), hw=v[0]*st.wpp/2, hh=v[1]*st.wpp/2;
    cam.left=-hw; cam.right=hw; cam.top=hh; cam.bottom=-hh; cam.near=1; cam.far=H+220; cam.zoom=1;
    cam.up.copy(N); cam.position.set(st.x,H,st.z); cam.lookAt(st.x,0,st.z);
    cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    if(typeof paperMarkScale==="function") paperMarkScale(st.wpp);
    requestRender(2);
  }
  function clampW(w){ return Math.max(lim.min,Math.min(lim.max,w)); }
  function toGround(sx,sy){ var v=vp(), a=(sx-v[0]/2)*st.wpp, b=(v[1]/2-sy)*st.wpp; return [st.x+E.x*a+N.x*b, st.z+E.z*a+N.z*b]; }
  function toScreen(x,z){ var v=vp(), rx=x-st.x, rz=z-st.z; return [v[0]/2+(rx*E.x+rz*E.z)/st.wpp, v[1]/2-(rx*N.x+rz*N.z)/st.wpp]; }
  function stop(){ gid++; framed=false; }
  /* a drag of (dx, dy) screen pixels: the ground under the pointer moves with it */
  function pan(dx,dy){ stop(); moved=true; st.x+=(-E.x*dx+N.x*dy)*st.wpp; st.z+=(-E.z*dx+N.z*dy)*st.wpp; apply(); }
  /* zoom by k about a screen point: the ground point under it stays under it */
  function zoomAt(sx,sy,k){ stop(); moved=true; var g=toGround(sx,sy), v=vp(); st.wpp=clampW(st.wpp*k);
    var a=(sx-v[0]/2)*st.wpp, b=(v[1]/2-sy)*st.wpp; st.x=g[0]-E.x*a-N.x*b; st.z=g[1]-E.z*a-N.z*b; apply(); }
  /* the largest rectangle of the screen no panel covers (on an 8 px grid, MARGIN px clear of each panel and edge). Stage 3B
     (docs/STAGE3_SPEC.md section B.4): given the extent of what is to be framed (ext, ground units along east and north),
     the free rectangle in which it is drawn largest instead, the larger area breaking a tie: with the legend closed the
     largest rectangle is wide and short, and the about square field was drawn 15-19% smaller in it than it need be */
  function freeRect(ext,P0){   /* P0: a panel list instead of the app's (Stage 3D: the landscape's, without the first-run card) */
    var v=vp(), G=8, nx=Math.floor(v[0]/G), ny=Math.floor(v[1]/G), P=P0||env.panels(), h=new Int32Array(nx), best=[0,0,v[0],v[1]], bA=-1, bS=-1;
    for(var j=0;j<ny;j++){
      var y0=j*G, y1=y0+G;
      for(var i=0;i<nx;i++){ var x0=i*G, x1=x0+G, bad=x0<MARGIN||y0<MARGIN||x1>v[0]-MARGIN||y1>v[1]-MARGIN;
        for(var k=0;!bad&&k<P.length;k++){ var q=P[k]; if(x0<q[2]+MARGIN&&x1>q[0]-MARGIN&&y0<q[3]+MARGIN&&y1>q[1]-MARGIN) bad=true; }
        h[i]=bad?0:h[i]+1; }
      var S=[];   /* the largest rectangle under the histogram of free cells ending on this row */
      for(var i2=0;i2<=nx;i2++){ var hh=i2<nx?h[i2]:0, s0=i2;
        while(S.length&&S[S.length-1][1]>=hh){ var t=S.pop(), A=t[1]*(i2-t[0]), sc=ext?Math.min((i2-t[0])*G/ext[0],t[1]*G/ext[1]):0;
          if(ext?(sc>bS+1e-9||(sc>bS-1e-9&&A>bA)):A>bA){ bA=A; bS=sc; best=[t[0]*G,(j+1-t[1])*G,i2*G,(j+1)*G]; } s0=t[0]; }
        S.push([s0,hh]); }
    }
    return best;
  }
  /* put ground points inside the free rectangle: the zoom that fits them, their middle at its centre */
  function fit(pts,r){
    var a0=1e9,a1=-1e9,b0=1e9,b1=-1e9;
    pts.forEach(function(p){ var a=p[0]*E.x+p[1]*E.z, b=p[0]*N.x+p[1]*N.z; a0=Math.min(a0,a); a1=Math.max(a1,a); b0=Math.min(b0,b); b1=Math.max(b1,b); });
    r=r||freeRect([Math.max(1e-6,a1-a0),Math.max(1e-6,b1-b0)]);
    var w=Math.max((a1-a0)/Math.max(1,r[2]-r[0]),(b1-b0)/Math.max(1,r[3]-r[1]));
    return place((a0+a1)/2*E.x+(b0+b1)/2*N.x,(a0+a1)/2*E.z+(b0+b1)/2*N.z,w,r); }
  /* the state that shows ground point (x, z) at the centre of the free rectangle r at wpp */
  function place(x,z,w,r){ r=r||freeRect(); var v=vp(), cx=(r[0]+r[2])/2, cy=(r[1]+r[3])/2, a=(cx-v[0]/2)*w, b=(v[1]/2-cy)*w;
    return {x:x-E.x*a-N.x*b, z:z-E.z*a-N.z*b, wpp:w}; }
  function set(s){ stop(); st.x=s.x; st.z=s.z; st.wpp=clampW(s.wpp); apply(); }
  /* an eased move to state s (the zoom eased in its logarithm), run by the app's scheduler */
  function glide(s,ms){ framed=false; var my=++gid, a={x:st.x,z:st.z,w:Math.log(st.wpp)}, w1=Math.log(clampW(s.wpp)), t0=performance.now(), dur=ms||900;
    env.schedule(function(now){ if(my!==gid) return true;
      var k=Math.min(1,(now-t0)/dur), e=easeInOut(k); st.x=a.x+(s.x-a.x)*e; st.z=a.z+(s.z-a.z)*e; st.wpp=Math.exp(a.w+(w1-a.w)*e); apply();
      return k>=1; }, dur); }
  /* the whole modelled ground, framed; the zoom limits follow it (from 12 times closer to 1.5 times farther) */
  function fieldState(){ var s=fit(FIELD); lim.max=Math.max(0.8,s.wpp*1.5); return s; }
  return {
    init:init, apply:apply, toGround:toGround, toScreen:toScreen, pan:pan, zoomAt:zoomAt, freeRect:freeRect, stop:stop,
    frameField:function(instant){ moved=false; var s=fieldState(); if(instant) set(s); else glide(s,900); framed=true; },
    framed:function(){ return framed; },
    centreOn:function(x,z,w,instant){ var s=place(x,z,clampW(w)); if(instant) set(s); else glide(s,900); },
    glideTo:function(x,z,w,ms){ glide(place(x,z,clampW(w)),ms||1200); },
    state:function(){ return {x:st.x,z:st.z,wpp:st.wpp,moved:moved}; },
    restore:function(s){ set(s); moved=!!s.moved; },
    moved:function(){ return moved; },
    north:N, east:E, field:FIELD, limits:lim
  };
})();
/* the scheduler MAPCAM's eased moves run on: the app's tween, on top of a phase change's transition already running
   (as glide does); the move ends when its step returns true. Reduced motion: at once. */
function mapSchedule(step,ms){
  if(RM){ step(performance.now()+1e9); return; }
  setTween("cam",step);   /* Stage 3D: the camera slot; a phase change's fade runs on in its own */
}
var ECH_RANK={army:0,corps:1,div:2,bde:3};

/* ============================================================
   THE MAP LAYER (Stage 2D; docs/STAGE2_SPEC.md sections E, F and H; owner decisions 24, 29, 38 and 39)
   One DOM layer (#maplayer) over the WebGL canvas and under the interface panels holds every counter and all in-scene
   map text: formation counters (paper map and hybrid) and names (landscape), event labels, the plateau reading, the
   movement, line, boundary, halt and objective labels, the plan labels, place and terrain-study labels. Symbols stay in
   the scene: arrows and ribbons with their heads, event glyphs, objective and plan markers.
   - One pass per DRAWN frame (renderFrame): render on demand is unchanged, and a skipped frame lays out nothing. An
     item's content is rebuilt only when its key changes; positions are computed in every drawn frame.
   - Priority, highest first: the selection; the formation under the pointer or the keyboard focus; the highlighted
     family; counters by echelon, larger first; live events; the plateau reading; movement and plan labels; formation
     names; place names, major first; terrain-study labels; objective names. What is never dropped (the selection, the
     formation hovered or focused, the highlighted family, live events: decision 39) is placed first.
   - Placement: at the anchor, then the eight places around it, then rings of 28-148 px (on to 380 px for what is never
     dropped) with a leader line to the anchor; a place name only beside its marker. Obstacles: the interface panels,
     every item already placed, the arrow heads (section D), event glyphs and objective markers, ML_PAD px apart. An
     item that finds no room is dropped and counted: it stays in the layer, invisible, reachable by hovering its
     position and from the keyboard (Tab, in priority order; Enter selects).
   - Not drawn, and counted apart: an anchor off screen, under a panel, or behind the drawn ground. Occlusion: the
     segment from the eye to the anchor is marched over the drawn ground (groundY), only where it is low enough to meet
     it (section F.3 measured rays against the mesh at 84-205 ms a pass); what is never dropped is not occluded.
   ============================================================ */
var ML={root:null, lines:null, items:{}, frame:0, hover:null, focus:null,
        order:"", maxG:{}, stats:{items:0,placed:0,leaders:0,dropped:0,occluded:0,offscreen:0,underPanel:0,keepMissing:[],dropped_:[],ms:0,nodes:0},
        taken:[], svg:"", legendOpen:false, lgSize:null};   /* Stage 3B (decision 49): the legend opens closed to its head; the visitor's choice then holds */
var ML_FULL_DIST=70;   /* a counter nearer the eye than this (world units; about 4.4 km) is drawn full (section F.1) */
var ML_PAD=2;          /* px kept clear between placed items, and from panels and symbols */
var ML_RINGS=[28,44,64,88,116,148], ML_RINGS_KEEP=[190,240,300,380];
/* what the overlays and plans hand the layer: labels with their anchors, markers and heads (world positions) */
var ovText=[], ovMarkers=[], ovHeads=[], planText=[], planMarkers=[], planHeads=[];
var _mlV=new THREE.Vector3(), _mlW=new THREE.Vector3(), _mlR=new THREE.Vector3();
function mlInit(){
  ML.root=document.getElementById("maplayer");
  if(!ML.root) return;
  ML.root.innerHTML='<svg class="ml-lines" aria-hidden="true" focusable="false"></svg>';
  ML.lines=ML.root.querySelector(".ml-lines");
  ML.root.tabIndex=0;   /* Stage 3D: the layer takes keyboard focus on the landscape too (setMode words its label) */
  ML.root.setAttribute("aria-label","The map: arrow keys pan, Shift and the arrow keys turn and tilt, plus and minus zoom; Tab reaches its formations, events and places");
  /* Stage 2E: on the paper map the layer itself takes keyboard focus (Tab, after the interface, before the map's items):
     the arrow keys pan and + and - zoom about the centre. Elsewhere the arrows keep stepping the clock. */
  ML.root.addEventListener("keydown",function(e){
    if(e.target!==ML.root) return;
    /* Stage 3E: the key table's map rows (KEYS); Stage 3D: the landscape takes the keys too (section A.3) */
    var r=keyRow(e,"map"); if(!r) return;
    if(KEYS_DRY){ KEYS_DRY.push("map:"+r.id); e.preventDefault(); e.stopPropagation(); return; }
    if(r.run(e)!==false){ e.preventDefault(); e.stopPropagation(); }
  });
  /* a web font that arrives after an item was measured changes its size: measure every item again and draw */
  if(document.fonts&&document.fonts.addEventListener){
    var remeasure=function(){ for(var k in ML.items) ML.items[k].dirty=true; requestRender(2); };
    document.fonts.addEventListener("loadingdone",remeasure);
    if(document.fonts.ready) document.fonts.ready.then(remeasure);
  }
}
function mlItem(key,cls){
  var it=ML.items[key];
  if(!it){
    var e=document.createElement("div"); e.className="ml-item "+cls; e.style.display="none";
    ML.root.appendChild(e);
    it=ML.items[key]={key:key,el:e,ck:null,aria:null,w:0,h:0,disp:false,on:false,tx:null,world:new THREE.Vector3(),ground:null,
      fid:null,pick:null,focusable:false,op:1,opS:1,rect:null,lead:false,state:"",eFrame:-1};
    e.addEventListener("focus",function(){ ML.focus=key; requestRender(2); });
    e.addEventListener("blur",function(){ if(ML.focus===key){ ML.focus=null; requestRender(2); } });
    e.addEventListener("keydown",function(ev){
      if((ev.key==="Enter"||ev.key===" ")&&it.pick){ ev.preventDefault(); ev.stopPropagation(); select(it.pick.kind,it.pick.id); }
    });
  }
  it.frame=ML.frame;
  return it;
}
/* content is rebuilt only when its key changes; plate is the item's own background and ink, when it has one */
function mlContent(it,ck,html,plate){
  if(it.ck===ck) return;
  it.ck=ck; it.el.innerHTML=html; it.dirty=true;
  if(plate){ it.el.style.background=plate[0]; it.el.style.color=plate[1]; }
}
function mlAria(it,label){
  if(!label||it.aria===label) return;
  if(!it.focusable){ it.el.setAttribute("tabindex","0"); it.el.setAttribute("role","button"); it.focusable=true; }
  it.el.setAttribute("aria-label",label); it.aria=label;
}
/* the items this frame, from the level of detail updateVisibility decided (rec.show, rec.nameShow, o.show, k.labelOn) */
function mlCollect(){
  var out=[], paper=(mode==="staff"), labels=textOn(), K=paper?"paper":"dark";
  var PL=TOKENS.sym.plate[K], LB=TOKENS.sym.label[K], PC=TOKENS.sym.place[K];
  var fam=(highlight&&Object.keys(highlight).length)?highlight:null;
  var foc=(ML.focus&&ML.items[ML.focus])?ML.items[ML.focus].fid:null;
  function isSel(k,id){ return !!(selection&&selection.kind===k&&selection.id===id); }
  function add(it,o){
    it.cat=o.cat; it.pri=o.pri; it.base=o.base===undefined?o.pri:o.base; it.keep=!!o.keep; it.occl=o.occl!==false; it.acl=o.acl||4;
    it.r=o.r||0; it.mode=o.mode||"label"; it.fid=o.fid||null; it.pick=o.pick||null; it.ground=o.ground||null; it.op=o.op===undefined?1:o.op;
    it.mk=o.mk||null; mlAria(it,o.aria); out.push(it); return it;
  }
  function text(key,cat,cls,str,col,w,o){
    var it=mlItem(key,"mlt "+cls);
    mlContent(it,[str,col,PL].join("|"),esc(str),[PL,col]);
    it.world.copy(w); o.cat=cat; return add(it,o);
  }
  function fstate(id){ var f=FORMATIONS[id]; return {st:liveStatus(id,curPhase),cf:aggConf(id,curPhase),know:knowledgeOf(id),strength:f.strength||aggStrength(id)}; }
  function rank(f,s){ var e=ECH_RANK[f.ech]; return (e===undefined?2:e)*0.1-(s||0)/1e7; }
  /* formation counters: the paper map and hybrid */
  function counter(id,rec){
    var f=FORMATIONS[id], w=W(rec.p[0],rec.p[1]), gy=displayHeight(w[0],w[1]), S=fstate(id);
    var sel=isSel("f",id), inFam=!!(fam&&fam[id]), hov=(ML.hover===id), fo=(foc===id);
    var near=viewDistTo(_mlV.set(w[0],gy,w[1]))<ML_FULL_DIST;
    var o={st:S.st,cf:S.cf,sel:sel,paper:paper,dim:!!(highlight&&!highlight[id]),know:S.know,full:sel||inFam||hov||fo||near,
           strength:S.strength,commander:shortCommander(f)};
    var it=mlItem("c:"+id,"mlc"+(f.arm==="hq"?" mlc-hq":"")); it.hq=(f.arm==="hq");
    mlContent(it,["c",o.st,o.cf,sel?1:0,paper?1:0,o.dim?1:0,o.know,o.full?1:0,o.strength].join("|"),counterHTML(f,o));
    it.world.set(w[0],gy+2.2,w[1]);
    it.gp=(it.gp||new THREE.Vector3()).set(w[0],gy+0.3,w[1]);
    var base=3+rank(f,S.strength);
    add(it,{cat:"counter",mode:"counter",pri:sel?0:(hov||fo)?0.5:inFam?1:base,base:base,keep:sel||hov||fo||inFam,
            fid:id,pick:{kind:"f",id:id},ground:it.gp,acl:6,aria:counterLabel(f,o)});
  }
  Object.keys(aggregates).forEach(function(id){ var r=aggregates[id]; if(r.show&&r.p) counter(id,r); });
  Object.keys(units).forEach(function(id){ var r=units[id]; if(r.show&&r.p) counter(id,r); });
  /* formation names: the landscape, which draws no counters (owner decision 9) */
  Object.keys(units).forEach(function(id){ var r=units[id]; if(!r.nameShow) return;
    var f=FORMATIONS[id], S=fstate(id), it=mlItem("n:"+id,"mlt mln");
    mlContent(it,["n",id,PL].join("|"),nameHTML(f,false),[PL,LB.ink]);
    it.world.set(r.block.position.x,r.block.position.y+6.4,r.block.position.z);
    var sel=isSel("f",id), inFam=!!(fam&&fam[id]), hov=(ML.hover===id), fo=(foc===id), base=7+rank(f,S.strength);
    add(it,{cat:"name",pri:sel?0:(hov||fo)?0.5:inFam?1:base,base:base,keep:sel||hov||fo||inFam,fid:id,pick:{kind:"f",id:id},acl:2,
            aria:counterLabel(f,S)});
  });
  /* the moments of the battle: every live event's label is kept (decision 39) */
  if(eventGroup&&eventGroup.visible) eventMarks.forEach(function(k){ if(!k.labelOn) return;
    var sel=isSel("e",k.e.id), w=evWindow(k.e);
    text("e:"+k.e.id,"event","mlt-serif",k.e.n,LB.annotation,k.world,{pri:sel?0:4+(1-evWeight(k.e,clock))*0.5,base:4,keep:true,r:2.1,acl:3,
      pick:{kind:"e",id:k.e.id},aria:"Event, "+fmtClock((w[0]+w[1])/2)+": "+k.e.n});
  });
  /* the plateau reading, over the northern part of its outline */
  if(eventGroup&&eventGroup.visible&&plateauRing&&plateauRing.visible){
    var pc=W(298,196); _mlR.set(pc[0],displayHeight(pc[0],pc[1])+1.6,pc[1]);
    text("p:plateau","plateau","mlt-serif",plateauText(),LB.annotation,_mlR,{pri:5,acl:5});
  }
  /* movement, line, boundary, halt and objective labels, and the plans' */
  var seen={};
  function uniq(k){ var n=seen[k]||0; seen[k]=n+1; return n?k+"#"+n:k; }
  if(labels&&layerOn.arrows) ovText.forEach(function(t){
    text(uniq("o:"+t.text),t.obj?"objective":"overlay","mlt-serif",t.text,LB.annotation,t.pos,{pri:t.obj?10:6,acl:t.acl,r:t.r,op:ovFadeIn});
  });
  if(planGroup) planText.forEach(function(t){ text(uniq("pl:"+t.text),"plan","mlt-serif",t.text,LB.annotation,t.pos,{pri:6,acl:t.acl,r:t.r}); });
  /* place names: a marker at the place, the name beside it */
  placeLabels.forEach(function(o){ if(!o.show) return;
    var ft=o.ft, col=ft.kind==="water"?PC.water:ft.kind==="height"?PC.height:ft.kind==="road"?PC.road:PC.other;
    var sel=isSel("t",ft.id), base=MAJOR_FEATURES[ft.id]?8:8.5;
    text("t:"+ft.id,"place","mlt-small",ft.name,col,o.world,{pri:sel?0:base,base:base,keep:sel,mode:"place",mk:[col,PC.fill],
      pick:{kind:"t",id:ft.id},aria:"Place: "+ft.name});
  });
  /* terrain-study labels */
  if(layerOn.analysis&&labels) terrainLabels.forEach(function(o){
    var sel=isSel("a",o.tl.n);
    text("a:"+o.tl.n,"analysis","mlt-small",o.tl.n,paper?o.col.paper:o.col.label,o.world,{pri:sel?0:9,base:9,keep:sel,
      pick:{kind:"a",id:o.tl.n},aria:"Terrain: "+o.tl.n});
  });
  return out;
}
function plateauText(){
  var al=plateauStrength("al"), fr=plateauStrength("fr");
  return "THE PRATZEN  ·  Allied ≈ "+al.toLocaleString()+(fr>500?("   French ≈ "+fr.toLocaleString()):"");
}
/* the interface panels over the map, read as rectangles once per pass */
var ML_PANELS=[".rail",".dispatch",".legend",".drawer",".timebar",".tools","#viewmode","#tourbar","#firstrun","#selchip","#layerpop","#vsbadge","#restore"];
function mlPanels(){
  var R=[];
  ML_PANELS.forEach(function(q){ var e=document.querySelector(q); if(!e||e.hidden) return;
    if(e.classList.contains("rail")&&document.body.classList.contains("rail-hidden")) return;
    if(e.classList.contains("drawer")&&!e.classList.contains("on")) return;
    var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||+cs.opacity<0.05) return;
    var r=e.getBoundingClientRect(); if(!(r.width>=2&&r.height>=2)) return;
    R.push([r.left,r.top,r.right,r.bottom]); });
  return R;
}
/* the highest drawn ground, per drawn scale (Stage 2E: the flat paper map's is 0, whatever the setting): above it no segment
   can meet the ground */
function mlMaxG(){
  var f=displayScale(); if(ML.maxG[f]!==undefined) return ML.maxG[f];
  var P=groundMesh.geometry.attributes.position.array, m=-1e9;
  for(var i=1;i<P.length;i+=3) if(P[i]>m) m=P[i];
  return (ML.maxG[f]=m);
}
/* is the anchor behind the drawn ground? The eye-to-anchor segment, sampled every 0.35 units over the ground (a quarter
   of a mesh cell), from where it first comes below the highest ground; the last 1.2 units are left out so an anchor is not
   hidden by its own slope */
function mlOccluded(A,maxG){
  if(camera.isOrthographicCamera) return false;   /* the paper map looks straight down on flat ground: nothing is behind it */
  var E=camera.position, dx=A.x-E.x, dy=A.y-E.y, dz=A.z-E.z, L=Math.sqrt(dx*dx+dy*dy+dz*dz);
  if(L<3) return false;
  var t1=1-1.2/L, t0=0;
  if(E.y>maxG){ if(dy>=0) return false; t0=(maxG-E.y)/dy; if(t0>=t1) return false; }
  var n=Math.max(2,Math.ceil(Math.sqrt(dx*dx+dz*dz)*(t1-t0)/0.35));
  for(var i=0;i<=n;i++){ var t=t0+(t1-t0)*i/n; if(groundY(E.x+dx*t,E.z+dz*t)>E.y+dy*t+0.005) return true; }
  return false;
}
/* screen rectangles of the symbols labels must leave clear: arrow heads (their casing's mesh, every vertex as drawn now: a
   change of display factor re-drapes the heads in place, and on relief the middle of a head stands off the line between its
   corners), event glyphs, objective and plan markers. */
function mlObstacles(VW,VH){
  var R=[];
  function tri(M){ var r=[1e9,1e9,-1e9,-1e9], A=M.geometry.attributes.position; M.updateWorldMatrix(true,false);   /* its parents too: the pass can run before the render updates them */
    for(var i=0;i<A.count;i++){ _mlW.fromBufferAttribute(A,i).applyMatrix4(M.matrixWorld).project(camera); if(!(_mlW.z<1&&_mlW.z>-1)) return;
      var x=(_mlW.x*0.5+0.5)*VW, y=(-_mlW.y*0.5+0.5)*VH; if(x<r[0]) r[0]=x; if(y<r[1]) r[1]=y; if(x>r[2]) r[2]=x; if(y>r[3]) r[3]=y; }
    R.push(r); }
  function px(x,y,z){ _mlW.set(x,y,z).project(camera); return _mlW.z<1&&_mlW.z>-1?[(_mlW.x*0.5+0.5)*VW,(-_mlW.y*0.5+0.5)*VH]:null; }
  function disc(p,r){ var c=px(p.x,p.y,p.z); if(!c) return;
    _mlV.copy(p).applyMatrix4(camera.matrixWorldInverse); var d=-_mlV.z; if(d<=camera.near) return;
    var rp=r/worldPerPx(p); R.push([c[0]-rp,c[1]-rp,c[0]+rp,c[1]+rp]); }
  /* Stage 3E: a symbol faded near the eye is no obstacle; a capped one keeps clear only its drawn size (symbolSizes) */
  if(layerOn.arrows&&ovFadeIn>0.05){ ovHeads.forEach(function(M){ if(M.visible) tri(M); }); ovMarkers.forEach(function(m){ if(m.fade>0.05) disc(m.pos,m.r); }); }
  if(planGroup){ planHeads.forEach(tri); planMarkers.forEach(function(m){ if(m.fade>0.05) disc(m.pos,m.r); }); }
  if(eventGroup&&eventGroup.visible) eventMarks.forEach(function(k){ if(k.sp.visible&&k.m.opacity>0.05) disc(k.world,k.r); });
  return R;
}
function mlHits(x0,y0,x1,y1,L){
  for(var i=0;i<L.length;i++){ var q=L[i]; if(x0<q[2]+ML_PAD&&q[0]<x1+ML_PAD&&y0<q[3]+ML_PAD&&q[1]<y1+ML_PAD) return true; }
  return false;
}
function mlFree(x0,y0,w,h,VW,VH,panels,obst){
  var x1=x0+w, y1=y0+h;
  if(x0<ML_PAD||y0<ML_PAD||x1>VW-ML_PAD||y1>VH-ML_PAD) return false;
  return !mlHits(x0,y0,x1,y1,panels)&&!mlHits(x0,y0,x1,y1,obst)&&!mlHits(x0,y0,x1,y1,ML.taken);
}
/* one item: its anchor, the eight places around it, then the rings (with a leader) */
function mlPlaceItem(it,VW,VH,panels,obst){
  var w=it.w, h=it.h, sx=it.sx, sy=it.sy;
  if(!(w>0&&h>0)) return false;
  var cl=it.acl+(it.r?it.r*it.ppw:0), C, i;
  if(it.mode==="place"){   /* a place name sits beside its marker, never away from it */
    var m=[sx-5,sy-5,sx+5,sy+5], g=7;
    if(!mlFree(m[0],m[1],10,10,VW,VH,panels,obst)) return false;
    C=[[sx+g,sy-h/2],[sx-w/2,sy-g-h],[sx-g-w,sy-h/2],[sx-w/2,sy+g],[sx+g-2,sy-g-h+2],[sx+g-2,sy+g-2],[sx-g-w+2,sy-g-h+2],[sx-g-w+2,sy+g-2]];
    ML.taken.push(m);
    for(i=0;i<C.length;i++) if(mlFree(C[i][0],C[i][1],w,h,VW,VH,panels,obst)){ it.mrect=m; return mlTake(it,C[i][0],C[i][1],false); }
    ML.taken.pop(); return false;
  }
  if(it.mode==="counter"){   /* the frame's foot 6 px above the anchor; the paddings are .mlc's (style.css) */
    var pb=it.hq?12:5; it.ox=5+20; it.oy=13+(h-13-pb)/2+14; C=[[sx-it.ox,sy-cl-it.oy]]; }
  else { it.ox=w/2; it.oy=h;
    C=[[sx-w/2,sy-cl-h],[sx+2,sy-cl-h],[sx-2-w,sy-cl-h],[sx+cl+2,sy-h/2],[sx-cl-2-w,sy-h/2],[sx-w/2,sy+cl],[sx+2,sy+cl],[sx-2-w,sy+cl]]; }
  for(i=0;i<C.length;i++) if(mlFree(C[i][0],C[i][1],w,h,VW,VH,panels,obst)) return mlTake(it,C[i][0],C[i][1],i>0&&it.mode==="counter");
  /* Stage 2E: on the paper map every label may go as far as what is never dropped does (the far rings, then the rows): the
     plan, framed inside the free part of the screen, is small and dense, and its free room lies around the sheet */
  var far=it.keep||mode==="staff";
  var R=far?ML_RINGS.concat(ML_RINGS_KEEP):ML_RINGS;
  for(var k=0;k<R.length;k++){ var n=R[k]<60?12:R[k]<120?16:24, rr=R[k]+cl;
    for(var a=0;a<n;a++){ var j=(a+1)>>1, th=-Math.PI/2+((a&1)?1:-1)*j*2*Math.PI/n;   /* from straight up, alternately either side */
      var x0=sx+Math.cos(th)*rr-w/2, y0=sy+Math.sin(th)*rr-h/2;
      if(mlFree(x0,y0,w,h,VW,VH,panels,obst)) return mlTake(it,x0,y0,true); } }
  /* what is never dropped (and, on the paper map, every label), last: the nearest free place on rows 8 px apart, sliding
     along each row (a long label between two panels, where no ring position fits the gap) */
  if(far){   /* the places to try along a row: centred, and flush against each obstacle's sides and the screen's edges */
    var X=[sx-w/2,ML_PAD+0.01,VW-ML_PAD-w-0.01];
    [panels,obst,ML.taken].forEach(function(L){ L.forEach(function(q){ X.push(q[2]+ML_PAD+0.01,q[0]-ML_PAD-w-0.01); }); });
    X.sort(function(p,q){ return Math.abs(p+w/2-sx)-Math.abs(q+w/2-sx); });
    for(var dy=0;dy<=380;dy+=8) for(var sg=-1;sg<=1;sg+=2){ if(!dy&&sg>0) continue;
      var yy=sy-h/2+sg*dy;
      for(var xi=0;xi<X.length;xi++) if(Math.abs(X[xi]+w/2-sx)<=w/2+380&&mlFree(X[xi],yy,w,h,VW,VH,panels,obst)) return mlTake(it,X[xi],yy,true); } }
  return false;
}
/* Stage 2E: what is never dropped and finds no room whole is laid out again with its words wrapped, narrower each time,
   until it fits. Found on the paper map at 1366 x 768 with a dossier open, where the only free strip (236 px, between the
   dispatch and the drawer) is narrower than the selection's full counter (308 px) and a live event's name (355 px). A last
   resort: where everything fits whole, as in every view before 2E, nothing wraps. */
function mlWrapPlace(it,VW,VH,panels,obst){
  var w0=it.w, h0=it.h; it.el.classList.add("ml-wrap");
  for(var f=0.75;f>0.3;f-=0.1){ it.el.style.maxWidth=Math.max(110,Math.round(w0*f))+"px";
    var r=it.el.getBoundingClientRect(); it.w=Math.ceil(r.width); it.h=Math.ceil(r.height);
    if(mlPlaceItem(it,VW,VH,panels,obst)){ it.wrapped=true; return true; } }
  it.el.classList.remove("ml-wrap"); it.el.style.maxWidth=""; it.w=w0; it.h=h0; return false;
}
function mlTake(it,x0,y0,lead){ it.rect=[x0,y0,x0+it.w,y0+it.h]; it.lead=lead; it.state="on"; ML.taken.push(it.rect); return true; }
/* the nearest point of a rectangle to (x, y) */
function mlNear(r,x,y){ return [Math.max(r[0],Math.min(x,r[2])),Math.max(r[1],Math.min(y,r[3]))]; }
function mlLine(s,a,b,C){
  var d='M'+a[0].toFixed(1)+' '+a[1].toFixed(1)+'L'+b[0].toFixed(1)+' '+b[1].toFixed(1);
  s.push('<path d="'+d+'" fill="none" stroke="'+C.cs+'" stroke-width="3" stroke-linecap="round"/><path d="'+d+'" fill="none" stroke="'+C.co+'" stroke-width="1.2"/>');
}
/* the pass */
function mlLayout(){
  if(!ML.root) return;
  var t0=performance.now();
  ML.frame++;
  var VW=renderer.domElement.clientWidth||window.innerWidth, VH=renderer.domElement.clientHeight||window.innerHeight;
  camera.updateMatrixWorld();
  mlLegendFit(VW,VH);
  var list=mlCollect(), panels=mlPanels();
  var st={items:list.length,placed:0,leaders:0,dropped:0,occluded:0,offscreen:0,underPanel:0,keepMissing:[],dropped_:[],ms:0,nodes:0};
  var elig=[], dirty=[];
  list.forEach(function(it){
    _mlV.copy(it.world).applyMatrix4(camera.matrixWorldInverse);
    var depth=-_mlV.z;
    _mlW.copy(it.world).project(camera);
    if(depth<=camera.near||Math.abs(_mlW.x)>1||Math.abs(_mlW.y)>1){ it.state="offscreen"; st.offscreen++; return; }
    it.sx=(_mlW.x*0.5+0.5)*VW; it.sy=(-_mlW.y*0.5+0.5)*VH; it.ppw=1/worldPerPx(it.world);
    /* a place whose 10 px marker cannot be drawn inside the screen is not in view: off screen, not dropped */
    var me=5+ML_PAD; if(it.mode==="place"&&(it.sx<me||it.sy<me||it.sx>VW-me||it.sy>VH-me)){ it.state="offscreen"; st.offscreen++; return; }
    for(var p=0;p<panels.length;p++){ var q=panels[p]; if(it.sx>=q[0]&&it.sx<=q[2]&&it.sy>=q[1]&&it.sy<=q[3]){ it.state="panel"; st.underPanel++; return; } }
    it.eFrame=ML.frame; it.state=""; elig.push(it);
    if(!it.disp){ it.el.style.display=""; it.disp=true; it.dirty=true; }
    if(it.wrapped){ it.el.classList.remove("ml-wrap"); it.el.style.maxWidth=""; it.wrapped=false; it.dirty=true; }   /* each pass tries it whole first */
    if(it.dirty) dirty.push(it);
  });
  for(var k in ML.items){ var q=ML.items[k]; if(q.eFrame!==ML.frame&&q.disp){ q.el.style.display="none"; q.disp=false; q.on=false; q.el.classList.remove("on"); q.tx=null; } }
  dirty.forEach(function(it){ var r=it.el.getBoundingClientRect(); it.w=Math.ceil(r.width||0); it.h=Math.ceil(r.height||0); it.dirty=false; });
  var maxG=mlMaxG(), obst=mlObstacles(VW,VH);
  elig.forEach(function(it){ it.occ=!it.keep&&it.occl&&mlOccluded(it.world,maxG); if(it.occ){ it.state="occluded"; st.occluded++; } });
  var order=elig.filter(function(it){ return !it.occ; }).sort(function(a,b){ return (a.keep!==b.keep)?(a.keep?-1:1):(a.pri-b.pri); });
  ML.taken=[];
  order.forEach(function(it){
    if(mlPlaceItem(it,VW,VH,panels,obst)||(it.keep&&mlWrapPlace(it,VW,VH,panels,obst))){ st.placed++; if(it.lead) st.leaders++; }
    else { it.state="dropped"; st.dropped++; st.dropped_.push(it.key); if(it.keep) st.keepMissing.push(it.key); }
  });
  /* write: positions, visibility, the leader lines and markers */
  var K=mode==="staff"?"paper":"dark", C={cs:TOKENS.sym.plate[K],co:TOKENS.sym.label[K].annotation}, s=[];
  elig.forEach(function(it){
    var on=it.state==="on";
    if(on){ var x=Math.round(it.rect[0]), y=Math.round(it.rect[1]), tx=x+","+y;
      if(it.tx!==tx){ it.el.style.transform="translate("+x+"px,"+y+"px)"; it.tx=tx; }
      if(it.mode==="counter"){ _mlW.copy(it.ground).project(camera);
        var g=[(_mlW.x*0.5+0.5)*VW,(-_mlW.y*0.5+0.5)*VH], foot=[x+it.ox,y+it.oy];
        mlLine(s,g,it.lead?mlNear([x,y,x+it.w,y+it.h],g[0],g[1]):foot,C); }
      else if(it.lead) mlLine(s,[it.sx,it.sy],mlNear(it.rect,it.sx,it.sy),C);
      if(it.lead) s.push('<circle cx="'+(it.mode==="counter"?g[0]:it.sx).toFixed(1)+'" cy="'+(it.mode==="counter"?g[1]:it.sy).toFixed(1)+'" r="2.2" fill="'+C.co+'" stroke="'+C.cs+'" stroke-width="1"/>');
      if(it.mode==="place") s.push('<path d="M'+it.sx.toFixed(1)+' '+(it.sy-5).toFixed(1)+'l5 5l-5 5l-5 -5z" fill="'+it.mk[1]+'" stroke="'+it.mk[0]+'" stroke-width="1.6"/>');
    }
    if(it.on!==on){ it.el.classList.toggle("on",on); it.on=on; }
    var op=on&&it.op<1?Math.max(0,it.op):1;
    if(it.opS!==op){ it.el.style.opacity=op<1?String(op.toFixed(2)):""; it.opS=op; }
  });
  var svg=s.join("");
  if(svg!==ML.svg){ ML.lines.innerHTML=svg; ML.svg=svg; }
  /* the keyboard reaches every item on the map in priority order (section F.1): the layer's children follow it */
  var fo=elig.filter(function(it){ return it.focusable; }).sort(function(a,b){ return a.base-b.base; });
  var ok=fo.map(function(it){ return it.key; }).join(",");
  if(ok!==ML.order){ ML.order=ok;
    var act=document.activeElement, back=act&&ML.root.contains&&ML.root.contains(act)?act:null;
    fo.forEach(function(it){ ML.root.appendChild(it.el); });
    if(back&&document.activeElement!==back&&back.focus) back.focus({preventScroll:true}); }
  st.ms=performance.now()-t0;
  /* nodes drawn now: the layer, its lines and every item displayed (a hidden item is display:none and inert) */
  st.nodes=2+(ML.lines&&ML.lines.childNodes?ML.lines.childNodes.length:0);
  elig.forEach(function(it){ st.nodes+=1+(it.el.getElementsByTagName?it.el.getElementsByTagName("*").length:0); });
  ML.stats=st;
}
/* ---- the legend: contextual, compact, collapsible, never over the dispatch (decision 29, section F.2) ----
   One row per encoding on screen, written from the tables that draw it. If the open legend would overlap the
   dispatch (a narrow window with the dossier open), it stays closed: the rectangle test of section J. */
var _lgKey="";
function paintLegend(){
  var lg=document.querySelector(".legend"); if(!lg) return;
  var O=OVERLAYS[curPhase]||{}, A=layerOn.arrows?(O.arrows||[]):[];
  function side(s){ return A.some(function(a){ return a.side===s&&a.kind!=="halt"; }); }
  var counters=layerOn.symbols&&mode!=="terrain"&&!cleanView, land=mode!=="staff";
  var on={nation:counters||(land&&!isTrueScale()), foot:land&&isTrueScale(), "arrow-fr":side("fr"), "arrow-al":side("al"),
          halt:A.some(function(a){ return a.kind==="halt"; }), bound:layerOn.arrows&&(O.bounds||[]).length>0, plan:!!planSide,
          badge:counters, analysis:!!layerOn.analysis, contours:!!layerOn.contours&&!cleanView,
          wood:!land, village:!land,   /* Stage 2E: the paper map's own symbology */
          mere:true,   /* Stage 2F: the meres are drawn in every view, and their outlines are schematic (decision 27, section I.2) */
          fog:land&&fogCap(fogAmount(clock))>0.01};   /* Stage 4C: while the valley fog is drawn */
  var key=JSON.stringify(on);
  if(key===_lgKey) return;
  _lgKey=key; ML.lgSize=null;
  lg.querySelectorAll("[data-lg]").forEach(function(e){ e.hidden=!on[e.dataset.lg]; });
  var hint=document.getElementById("lg-hint");   /* the controls of the view shown: the paper map pans, the landscape orbits */
  if(hint) hint.innerHTML=land?"drag to pan &middot; right-drag or Shift-drag to turn &middot; scroll to zoom toward the pointer &middot; double-click to centre &middot; click or Tab to a counter or a name"
    :"drag to pan &middot; scroll to zoom toward the pointer &middot; Tab to the map: arrows pan, + &minus; zoom &middot; click or Tab to a counter or a name";
}
function mlLegendFit(VW,VH){
  var lg=document.querySelector(".legend"), tg=document.getElementById("lg-toggle"); if(!lg||!tg) return;
  paintLegend();
  var rows=document.getElementById("lg-rows"), dp=document.querySelector(".dispatch"), squeeze=false;
  function shown(e){ if(!e) return false; var cs=getComputedStyle(e); return cs.display!=="none"&&cs.visibility!=="hidden"; }
  if(ML.legendOpen&&shown(lg)&&shown(dp)&&rows){
    /* the open legend's rectangle, where it will stand when any slide has finished */
    if(!ML.lgSize){ var rr=rows.getBoundingClientRect(), hr=tg.getBoundingClientRect(); ML.lgSize=[Math.max(rr.width,hr.width)+22,rr.height+hr.height+16]; }
    var D=dp.getBoundingClientRect(), L=lg.getBoundingClientRect(), dr=document.getElementById("drawer");
    var right=VW-18-(document.body.classList.contains("drawer-open")&&dr&&!docked?dr.getBoundingClientRect().width:0), bottom=L.bottom;   /* docked (3B): the legend does not slide */
    squeeze=right-ML.lgSize[0]<D.right+ML_PAD&&bottom-ML.lgSize[1]<D.bottom&&bottom>D.top;
  }
  var open=ML.legendOpen&&!squeeze;
  if(lg.classList.contains("collapsed")===open){ lg.classList.toggle("collapsed",!open); tg.setAttribute("aria-expanded",String(open)); }
  if(lg.classList.contains("squeezed")!==squeeze){ lg.classList.toggle("squeezed",squeeze);
    tg.title=squeeze?"No room for the key beside the dispatch: hide the dispatch (D) or close the dossier":"Show or hide the key"; }
}
/* ---- hover and picking by footprint (section F.1) ---- */
/* the drawn ground under a screen point: the view ray marched over groundY, then bisected */
var _gRay=new THREE.Vector3();
function groundAt(cx,cy){
  if(camera.isOrthographicCamera) return MAPCAM.toGround(cx,cy);   /* the paper map: the plan point under the pointer */
  var VW=renderer.domElement.clientWidth||window.innerWidth, VH=renderer.domElement.clientHeight||window.innerHeight;
  camera.updateMatrixWorld();
  _gRay.set(cx/VW*2-1,-(cy/VH)*2+1,0.5).unproject(camera).sub(camera.position).normalize();
  var E=camera.position, maxG=mlMaxG(), s=0, step, prev;
  if(E.y>maxG){ if(_gRay.y>=0) return null; s=(maxG-E.y)/_gRay.y; }
  for(prev=s;s<1400;prev=s,s+=step){
    step=Math.max(0.5,s*0.004);
    var x=E.x+_gRay.x*s, z=E.z+_gRay.z*s;
    if(E.y+_gRay.y*s<=groundY(x,z)){
      var a=prev, b=s;
      for(var i=0;i<12;i++){ var m=(a+b)/2; if(E.y+_gRay.y*m<=groundY(E.x+_gRay.x*m,E.z+_gRay.z*m)) b=m; else a=m; }
      return [E.x+_gRay.x*b,E.z+_gRay.z*b];
    }
    if(E.y+_gRay.y*s<-60) return null;
  }
  return null;
}
/* a formation is on the map when its figures or footprint are drawn, or the layer holds its counter or name */
function mlOnMap(id){
  var r=units[id]; if(!r||knowledgeOf(id)==="unknown") return false;
  if((r.block&&r.block.visible)||(r.foot&&r.foot.visible)) return true;
  var c=ML.items["c:"+id], n=ML.items["n:"+id];
  return !!((c&&c.eFrame===ML.frame)||(n&&n.eFrame===ML.frame));
}
/* the formation whose footprint (frontage W0 x sw by depth D0 x sd at its yaw, the 2B primitive; the drawn block's size
   where it is larger) contains the ground under the point, with one unit to spare; the nearest centre wins */
function pickFormation(cx,cy){
  var g=groundAt(cx,cy); if(!g) return null;
  var best=null, bd=1e9;
  Object.keys(units).forEach(function(id){
    var r=units[id], u=r.block&&r.block.userData; if(!u||!u.W0||!mlOnMap(id)) return;
    var p=posNow(id); if(!p) return;
    var w=W(p[0],p[1]), sc=r.block.visible?Math.max(1,r.block.scale.x||1):1, yaw=r.yaw||0, c=Math.cos(yaw), sn=Math.sin(yaw);
    var dx=g[0]-w[0], dz=g[1]-w[1], lx=dx*c-dz*sn, lz=dx*sn+dz*c, hw=u.W0*(u.sw||1)*sc/2+1, hd=u.D0*(u.sd||1)*sc/2+1;
    if(Math.abs(lx)<=hw&&Math.abs(lz)<=hd){ var d=lx*lx/(hw*hw)+lz*lz/(hd*hd); if(d<bd){ bd=d; best=id; } }
  });
  return best;
}
function mlHit(cx,cy){
  for(var k in ML.items){ var it=ML.items[k]; if(it.on&&it.rect&&cx>=it.rect[0]&&cx<=it.rect[2]&&cy>=it.rect[1]&&cy<=it.rect[3]) return it; }
  return null;
}
/* the formation whose counter or name anchor lies within 20 px (a corps counter has no footprint of its own) */
function mlNearAnchor(cx,cy,r2,dropped){
  var best=null, bd=r2||400;
  for(var k in ML.items){ var it=ML.items[k]; if(!it.fid||it.eFrame!==ML.frame||it.state==="occluded"||(dropped&&it.state!=="dropped")) continue;
    var d=(it.sx-cx)*(it.sx-cx)+(it.sy-cy)*(it.sy-cy); if(d<bd){ bd=d; best=it.fid; } }
  return best;
}
/* the pointer over a counter, a name or a formation's position: that formation is shown, full and never dropped */
function mlHoverAt(cx,cy){
  /* a dropped formation's own position (within 6 px) comes first, even under another item's box: Stage 2E found a dropped
     counter on the small framed paper map whose anchor lay under a neighbour's counter, reachable only from the keyboard */
  var it=mlHit(cx,cy), id=mlNearAnchor(cx,cy,36,true)||(it&&it.fid)||pickFormation(cx,cy)||mlNearAnchor(cx,cy);   /* a place or arrow label is no formation: look under it */
  var cur=(it&&it.pick)||id?"pointer":"";
  if(renderer.domElement.style.cursor!==cur) renderer.domElement.style.cursor=cur;
  if(id!==ML.hover){ ML.hover=id; requestRender(2); }
}

var lodEch="div";
var smokeT=0;
var MAJOR_FEATURES={pratzen:1,vinohrady:1,pratzeberg:1,santon:1,zuran:1,goldbach:1,
  litava:1,austerlitz:1,telnitz:1,sokolnitz:1,augezd:1,satschan:1};
var _evTicks=[];
var faceCache={};
function enemyFacing(id){
  var key=curPhase+"|"+id;
  if(faceCache[key]!==undefined) return faceCache[key];
  var f=FORMATIONS[id], me=posNow(id), r=null;
  if(me){
    var best=null, bd=1e9;
    Object.keys(units).forEach(function(k){
      var g2=FORMATIONS[k];
      if(g2.arm==="hq") return;
      if((g2.nation==="fr")===(f.nation==="fr")) return;
      var q=posNow(k); if(!q) return;
      var dd=(q[0]-me[0])*(q[0]-me[0])+(q[1]-me[1])*(q[1]-me[1]);
      if(dd<bd){ bd=dd; best=q; }
    });
    if(best){
      var a=W(me[0],me[1]), b=W(best[0],best[1]);
      r=Math.atan2(b[0]-a[0], b[1]-a[1]);
    }
  }
  faceCache[key]=r; return r;
}
/* Different arms carry different mass, so they wheel at different rates. */
var WHEEL={cav:0.085, mixed:0.062, inf:0.050, guard:0.050, art:0.028, hq:0.10};
/* lay the block's yaw onto the slope, and re-seat its men when it has moved or turned */
var _up=new THREE.Vector3(0,1,0), _nrm=new THREE.Vector3(), _qt=new THREE.Quaternion(), _qy=new THREE.Quaternion();
/* Called after poseBlock, once this frame's position, scale, yaw and deployment are known. The
   men are re-seated whenever anything that moves them in the world has changed - position, tilt,
   yaw, block scale (highlight dimming, hybrid mode) or deployment - and never otherwise, so an
   idle block costs nothing. */
var SEAT_STATS={blocks:0};
function settleBlock(rec){
  var b=rec.block, p=b.position, u=b.userData;
  var e=1.6;
  var hx=(groundY(p.x+e,p.z)-groundY(p.x-e,p.z))/(2*e);
  var hz=(groundY(p.x,p.z+e)-groundY(p.x,p.z-e))/(2*e);
  _nrm.set(-hx,1,-hz).normalize();
  _qt.setFromUnitVectors(_up,_nrm);
  _qy.setFromAxisAngle(_up,rec.yaw||0);
  b.quaternion.copy(_qt).multiply(_qy);
  if(!u||!u.layout) return;
  var S=rec.seatSig||(rec.seatSig=new Float64Array(10)), q=b.quaternion, k=b.scale.x;
  var changed=!rec.seated||
    Math.abs(S[0]-p.x)>0.004||Math.abs(S[1]-p.y)>0.004||Math.abs(S[2]-p.z)>0.004||
    Math.abs(S[3]-q.x)>2e-5||Math.abs(S[4]-q.y)>2e-5||Math.abs(S[5]-q.z)>2e-5||Math.abs(S[6]-q.w)>2e-5||
    Math.abs(S[7]-k)>1e-5||Math.abs(S[8]-u.sw)>0.001||Math.abs(S[9]-u.sd)>0.001;
  if(changed){
    u.layout(u.sw,u.sd);
    S[0]=p.x; S[1]=p.y; S[2]=p.z; S[3]=q.x; S[4]=q.y; S[5]=q.z; S[6]=q.w; S[7]=k; S[8]=u.sw; S[9]=u.sd;
    rec.seated=true;
  }
  if(changed||rec.stdTilt!==u.tilt){ placeStandards(b,u.sw,u.tilt); rec.stdTilt=u.tilt; }
}
function poseBlock(rec,id,st){
  var u=rec.block.userData;
  if(!u||!u.body) return;
  var f=rec.f, mr=f.track?marchRate(id,clock):null;
  var moving=!!(mr&&mr.moving);

  var sh=shapeFor(st);
  var rate=ease(moving?0.075:0.045);
  if(Math.abs(sh[0]-u.sw)>0.002||Math.abs(sh[1]-u.sd)>0.002) settling=true;
  u.sw += (sh[0]-u.sw)*rate;
  u.sd += (sh[1]-u.sd)*rate;
  /* column and line are re-layouts of the same men, not a stretched block; the re-seat itself
     happens in settleBlock, once the frame's scale and yaw are known too */
  if(u.showBattalions && f.strength && f.track && trackedDescendants(id).length){
    var kb=Math.round(u.nBat*ownStrengthAt(id,clock)/f.strength);
    if(kb!==u.shownBat) u.showBattalions(kb);
  }
  var lowered = (st==="broken"||st==="captured"||st==="encircled"||st==="repulsed") ? 0.95 : 0;
  if(Math.abs(lowered-(u.tilt||0))>0.002) settling=true;
  u.tilt = (u.tilt||0) + (lowered-(u.tilt||0))*ease(0.05);

  if(u.skirmish) u.skirmish.visible = !!SKIRMISH[st] && (!moving || st==="advancing" || st==="pursuing");
  if(rec.pad){
    var sc=rec.block.scale.x||1;
    rec.pad.scale.set((u.W0*u.sw*sc)+4.5,1,(u.D0*u.sd*sc)+4.5);
    rec.pad.position.set(rec.block.position.x,rec.block.position.y+0.22,rec.block.position.z);
    rec.pad.rotation.y=rec.yaw||0;
  }
  if(u.deployed){                       /* a battery on the move is hitched up */
    u.deployed.visible=!moving;
    u.limbered.visible=moving;
  }

  var want=headingAt(id,clock);
  if(want===null) want=enemyFacing(id);
  if(want===null) return;
  var want0=want;
  if(LOOSE[st]) want += Math.sin(smokeT*0.5+rec.delay*47)*0.10;   /* a broken body sways: ambient, not settling */
  if(rec.yaw===undefined) rec.yaw=rec.block.rotation.y||0;
  var diff=want-rec.yaw, d0=want0-rec.yaw;
  while(diff>Math.PI) diff-=Math.PI*2;
  while(diff<-Math.PI) diff+=Math.PI*2;
  while(d0>Math.PI) d0-=Math.PI*2;
  while(d0<-Math.PI) d0+=Math.PI*2;
  if(Math.abs(d0)>(LOOSE[st]?0.13:0.002)) settling=true;
  rec.yaw += diff*ease(WHEEL[f.arm]||0.05);
}
var FIGHTING={attacking:1,engaged:1,charging:1,counterattack:1,repulsed:1,encircled:1,broken:1};
/* ---- Stage 4E: smoke (docs/STAGE4_SPEC.md section E.2; owner decision 77) ----
   Who smokes is the phase status, as before: a formation smokes while its status is a fighting one (the record of who fought in
   the phase). How much follows the clock: full inside the window of any event that names the formation or one of its parents
   (EVENTS[].forms, through evWeight's own lead and tail, so it eases in and out), a thin residue (SMOKE.RESIDUE) otherwise; no
   event, status or window is added. A formation's smoke is SMOKE.PUFFS puffs along its front (the frontage the block draws), each
   standing with its lower edge above the drawn ground across its width (spriteFloor) and fading toward that edge. On screen the
   smoke covers at most SMOKE.CAP of the free rectangle: past it the puffs largest on screen (the nearest) are shrunk, none culled,
   so the formations they belong to stay legible. Dust is unchanged. */
var SMOKE={PUFFS:3, RESIDUE:0.25, OP:0.32, CAP:0.25, ev:null, want:[], share:0, capped:0};
function smokeEvents(id){
  if(!SMOKE.ev){ SMOKE.ev={}; EVENTS.forEach(function(e){ (e.forms||[]).forEach(function(k){ (SMOKE.ev[k]=SMOKE.ev[k]||[]).push(e); }); }); }
  var out=[], a=id, n=0; while(a&&n++<8){ (SMOKE.ev[a]||[]).forEach(function(e){ if(out.indexOf(e)<0) out.push(e); }); a=FORMATIONS[a]&&FORMATIONS[a].parent; }
  return out;
}
/* the smoke's amount for a formation at clock t, 0 when its phase status is not a fighting one */
function smokeAmount(id,t){
  var st=liveStatus(id,phaseAt(t)); if(!(st&&FIGHTING[st])) return 0;
  var w=0; smokeEvents(id).forEach(function(e){ w=Math.max(w,evWeight(e,t)); });
  return SMOKE.RESIDUE+(1-SMOKE.RESIDUE)*w;
}
function smokeWant(rec,id,f,p,dimmed){
  var amt=(!!p&&mode!=="staff"&&!dimmed)?smokeAmount(id,clock):0;
  rec.smokeAmt=amt; rec.smoke.visible=amt>0;
  if(!(amt>0)){ rec.smoke.children.forEach(function(sp){ sp.material.opacity=0; }); return; }
  var u=rec.block.userData, sc=8+Math.min(10,(f.strength||3000)/850), ps=Math.max(5,sc*0.62);
  var front=Math.max(ps*0.6,(u&&u.W0?u.W0*(u.sw||1):6)*rec.block.scale.x), yaw=rec.yaw||0, c=Math.cos(yaw), sn=Math.sin(yaw);
  var drift=Math.sin(smokeT*0.6+rec.delay*31)*0.8, N=rec.smoke.children.length;
  rec.smoke.children.forEach(function(sp,i){
    var o=N>1?(i/(N-1)-0.5)*front*0.8:0, x=rec.block.position.x+o*c+drift, z=rec.block.position.z-o*sn-1.4;
    SMOKE.want.push({sp:sp,x:x,z:z,s:ps*(1-0.12*((i+1)%2)),y0:rec.block.position.y,op:SMOKE.OP*amt});
  });
}
/* the share of the free rectangle a set of puffs covers (each puff's projected rectangle, clipped; overlaps counted twice) */
var _smV=new THREE.Vector3();
function smokeShareOf(list,fr,lim){
  var A=(fr[2]-fr[0])*(fr[3]-fr[1]), H=viewH(), Wd=renderer.domElement.clientWidth||innerWidth, t=Math.tan(camera.fov*Math.PI/360), S=0;
  for(var i=0;i<list.length;i++){ var q=list[i], s=Math.min(q.s,lim===undefined?1e9:q.px>lim?q.s*lim/q.px:q.s);
    if(!(q.d>camera.near)) continue; var w=s*H/(2*q.d*t), h=w*0.6;
    var x0=Math.max(fr[0],q.sx-w/2), x1=Math.min(fr[2],q.sx+w/2), y0=Math.max(fr[1],q.sy-h/2), y1=Math.min(fr[3],q.sy+h/2);
    if(x1>x0&&y1>y0) S+=(x1-x0)*(y1-y0)/A; }
  return S;
}
function smokePlace(){
  var L=SMOKE.want; SMOKE.want=[]; SMOKE.capped=0;
  if(!L.length||camera.isOrthographicCamera){ SMOKE.share=0; return; }
  camera.updateMatrixWorld(); var fr=landFreeRect(), H=viewH(), Wd=renderer.domElement.clientWidth||innerWidth, t=Math.tan(camera.fov*Math.PI/360);
  L.forEach(function(q){ _smV.set(q.x,q.y0+2.4,q.z); var d=-_smV.clone().applyMatrix4(camera.matrixWorldInverse).z; _smV.project(camera);
    q.d=d; q.sx=(_smV.x*0.5+0.5)*Wd; q.sy=(-_smV.y*0.5+0.5)*H; q.px=d>camera.near?q.s*H/(2*d*t):0; });
  var S=smokeShareOf(L,fr), lim;
  if(S>SMOKE.CAP*0.96){   /* the largest on screen shrunk to a common size, found by bisection, so the share is under the cap */
    var lo=0, hi=Math.max.apply(null,L.map(function(q){ return q.px; }));
    for(var k=0;k<30;k++){ var m=(lo+hi)/2; if(smokeShareOf(L,fr,m)>SMOKE.CAP*0.96) hi=m; else lo=m; }
    lim=lo; SMOKE.capped=L.filter(function(q){ return q.px>lim; }).length; S=smokeShareOf(L,fr,lim); }
  SMOKE.share=S;
  L.forEach(function(q){ var sp=q.sp, s=(lim!==undefined&&q.px>lim)?q.s*lim/q.px:q.s, h=s*0.6;
    sp.scale.set(s,h,1);
    sp.position.set(q.x, Math.max(q.y0+2.4+h*0.24, spriteFloor(q.x,q.z,s*0.5)+0.2+h/2), q.z);
    var to=q.op-sp.material.opacity; if(Math.abs(to)>0.004) settling=true;
    sp.material.opacity+=to*ease(0.05); });
}
function updateVisibility(){
  var dist=viewDist();   /* the paper map: the distance at which the landscape eye would show the ground at its scale */
  var wantCorps = dist>250;
  var showBde = dist<165;
  var showSym = layerOn.symbols && mode!=="terrain" && !cleanView;
  var showBlocks = mode!=="staff";
  var labels = textOn();
  lodEch = wantCorps?"corps":"div";

  /* which counter the map layer draws (Stage 2D): its position on the map, or none */
  function placeSprite(rec,mapPos,show){ rec.show=!!(mapPos&&show); rec.p=mapPos; }

  Object.keys(aggregates).forEach(function(id){
    var rec=aggregates[id];
    var p=posOf(id,curPhase);
    placeSprite(rec,p,showSym && wantCorps && !!p);
  });

  Object.keys(units).forEach(function(id){
    var rec=units[id], f=rec.f;
    var p=posNow(id);
    if(p){
      var wq=W(p[0],p[1]);
      rec.block.position.set(wq[0],groundY(wq[0],wq[1]),wq[1]);   /* settled below, after pose and scale */
    }
    /* a parent is only folded away by its children if those children are
       divisions; a brigade detachment does not replace its parent */
    var isParent = !!(f.children && f.children.some(function(c){
      return FORMATIONS[c] && FORMATIONS[c].ech!=="bde"; }));
    var kn=knowledgeOf(id);
    if(kn==="unknown") p=null;
    var show = wantCorps
      ? (showSym && !!p && !f.parent)
      : (showSym && !!p && !isParent && (f.ech!=="bde" || showBde));
    placeSprite(rec,p,show);

    var trueScale=isTrueScale();
    rec.block.visible = showBlocks && !!p && !trueScale;
    if(showBlocks && p && trueScale){
      if(!rec.foot){ rec.foot=makeFootprint(hexNum(TOKENS.sym.side[sideOfNation(f.nation)].base)); scene.add(rec.foot); }
      poseBlock(rec,id,liveStatus(id,curPhase));
      var fu=rec.block.userData;
      placeFootprint(rec.foot,wq[0],wq[1],rec.yaw||0,fu.W0*fu.sw,fu.D0*fu.sd,0.25);
      rec.foot.visible=true;
    } else if(rec.foot) rec.foot.visible=false;
    var dimmed = highlight && !highlight[id];
    rec.block.scale.setScalar(1.25*(mode==="hybrid"?0.86:1)*(dimmed?0.80:1));
    if(rec.block.visible){ poseBlock(rec,id,liveStatus(id,curPhase)); settleBlock(rec); }

    /* the formation's name, in the landscape (the map layer draws it) */
    /* Stage 3D (the owner's answer): once the view shows corps (beyond 250 units), corps and army names are drawn at any distance;
       the Overview fitted to the free rectangle stands 425-536 units out, beyond the 300 that named every formation before */
    var nameRange = (f.ech==="corps"||f.ech==="army")&&dist>250 ? Infinity : f.ech==="bde" ? 170 : (f.arm==="art"||f.arm==="hq") ? 220 : 300;
    rec.nameShow = labels && mode==="terrain" && !!p && camera.position.distanceTo(rec.block.position)>34 &&
                   (dist<nameRange || (selection&&selection.kind==="f"&&selection.id===id));
    if(rec.trail){
      rec.trail.visible = layerOn.trails && !!p && !cleanView && !dimmed;
      if(rec.trail.visible) updateTrail(rec,id);
    }
    if(rec.pad) rec.pad.visible = !!p && rec.block.visible && mode!=="staff";
    if(trueScale){ if(rec.dust) rec.dust.visible=false; }
    if(rec.dust){
      var mrv=f.track?marchRate(id,clock):null;
      var dusty=!!(mrv&&mrv.moving) && (f.arm==="cav"||f.arm==="art"||f.arm==="mixed")
                && !!p && mode!=="staff" && !dimmed;
      rec.dust.visible=dusty;
      if(dusty){
        var dsc=10+Math.min(9,(f.strength||3000)/700);
        rec.dust.scale.set(dsc,dsc*0.44,1);
        var yaw=rec.yaw||0;
        var dxp=rec.block.position.x - Math.sin(yaw)*dsc*0.42 + Math.sin(smokeT*0.7+rec.delay*23)*0.6,
            dzp=rec.block.position.z - Math.cos(yaw)*dsc*0.42;
        rec.dust.position.set(dxp, Math.max(rec.block.position.y+1.5, spriteFloor(dxp,dzp,dsc*0.5)+0.2+dsc*0.13), dzp);
        var dto=0.34-rec.dust.material.opacity; if(Math.abs(dto)>0.004) settling=true;
        rec.dust.material.opacity += dto*ease(0.05);
      } else rec.dust.material.opacity=0;
    }
    if(rec.smoke) smokeWant(rec,id,f,p,dimmed);
  });
  smokePlace();   /* Stage 4E: the puffs placed, the cap on screen applied */

  placeLabels.forEach(function(o){
    var major=MAJOR_FEATURES[o.ft.id] || o.ft.kind==="height" || o.ft.kind==="town";
    o.show = labels && (major || dist<210);
  });

  world.contours.visible=layerOn.contours && !cleanView;
  world.marsh.visible=layerOn.contours && !cleanView;
  world.analysis.visible=layerOn.analysis;
  updateScaleBar(); updateRose();
  applyOverlayOpacity();
  updateEventLayer();
  symbolSizes();   /* Stage 3E: event glyphs and objective markers capped on screen, faded near the eye */
  updateSelRing();
  updatePlanLinks();   /* the map layer lays out in the drawn frame (mlLayout), not here */
}

/* ---------------- picking ----------------
   Stage 2D: an item the map layer drew (counter, name, event, place or terrain label) by its drawn box; else a formation
   by its footprint (pickFormation); else a corps counter, an event glyph or a place within 34 px of its anchor. */
var v3=new THREE.Vector3();
function pickAt(cx,cy){
  var hit=mlHit(cx,cy); if(hit&&hit.pick) return {kind:hit.pick.kind,id:hit.pick.id};
  var fid=pickFormation(cx,cy); if(fid) return {kind:"f",id:fid};
  var best=null, bestD=34;
  function test(pos,kind,id){
    if(!pos) return;
    v3.copy(pos).project(camera);
    if(v3.z>1) return;
    var d=Math.hypot((v3.x*0.5+0.5)*window.innerWidth-cx,(-v3.y*0.5+0.5)*window.innerHeight-cy);
    if(d<bestD){ bestD=d; best={kind:kind,id:id}; }
  }
  Object.keys(ML.items).forEach(function(k){ var it=ML.items[k]; if(it.eFrame===ML.frame&&it.pick&&it.state!=="occluded") test(it.world,it.pick.kind,it.pick.id); });
  if(!best) for(var ei=0;ei<eventMarks.length;ei++) if(eventGroup.visible&&eventMarks[ei].sp.visible) test(eventMarks[ei].sp.position,"e",eventMarks[ei].e.id);
  return best;
}
function select(kind,id){
  var prev=selection;
  if(!prev||prev.kind!==kind||prev.id!==id) dossierExpanded=false;
  selection=(kind&&id)?{kind:kind,id:id}:null;
  if(!chapter){
    if(selection&&selection.kind==="f") setHighlight(familyOf(selection.id));
    else setHighlight(null);
  }
  paintDrawer(); paintOOB();
}

/* ---------------- camera ---------------- */
/* The eye never enters the ground. Its floor is the highest drawn ground within CAM_R of the eye
   plus CAM_CLEAR, so the near plane (1 unit) cannot cut into a slope either. Every path that
   places the camera - orbit, zoom, glides, presets, the first view - goes through clampCamera();
   a guard before each frame counts anything that did not (CAM.violations). */
var CAM_CLEAR=1.8, CAM_R=1.6, CAM={clamps:0,violations:0};
function camGround(x,z){
  var m=groundY(x,z);
  for(var k=0;k<8;k++){ var a=k*Math.PI/4; m=Math.max(m,groundY(x+Math.cos(a)*CAM_R,z+Math.sin(a)*CAM_R)); }
  m=Math.max(m,formationTop(x,z));
  return (Math.abs(x)<178&&Math.abs(z)<153) ? m : m+1.2;   /* the apron outside the field is coarser */
}
/* Stage 2B: the camera floor also clears the men. Inside a drawn formation's footprint (with CAM_R to spare) the
   "ground" is the top of its figures, so the eye never stands among them; at the 4x default the ground is gentle
   enough for the lowest orbit to reach a body of men, which at 10.33x a hill usually kept away */
function formationTop(x,z){
  var top=-1e9;
  if(typeof units==="undefined") return top;
  for(var id in units){ var r=units[id], b=r.block; if(!b||!b.visible) continue; var u=b.userData; if(!u||!u.W0) continue;
    var sc=b.scale.x||1, dx=x-b.position.x, dz=z-b.position.z, yaw=r.yaw||0, c=Math.cos(yaw), sn=Math.sin(yaw);
    var lx=dx*c-dz*sn, lz=dx*sn+dz*c;
    if(Math.abs(lx)<=u.W0*u.sw*sc/2+CAM_R && Math.abs(lz)<=u.D0*u.sd*sc/2+CAM_R)
      top=Math.max(top,b.position.y+figureTop(!!u.mounted)*sc);
  }
  return top;
}
function camFloor(x,z){ return camGround(x,z)+CAM_CLEAR; }
function clampCamera(){
  var p=landCam.position, f=camFloor(p.x,p.z);
  if(p.y<f){ p.y=f; landCam.lookAt(orbitTarget); CAM.clamps++; return true; }
  return false;
}
var _ov=new THREE.Vector3();
/* orbit placement shared by drag, wheel and the self-test */
function orbitPlace(){
  landCam.position.copy(orbitTarget).add(_ov.setFromSpherical(sph));
  if(clampCamera()) sph.setFromVector3(_ov.copy(landCam.position).sub(orbitTarget));
  landCam.lookAt(orbitTarget);
}
/* every camera move the app asks for (a preset, a centring, a tour stop, a chapter, an event) arrives here; on the paper
   map it becomes a move of the plan (MAPCAM): the target centred in the free part of the screen, at the zoom that shows
   the ground as the landscape eye would at that distance (mapWppAt) */
function glide(toPos,toTgt,ms,bulge){
  freeCam=false; curVantage=null;
  if(mode==="staff"){ MAPCAM.glideTo(toTgt.x,toTgt.z,mapWppAt(toPos.distanceTo(toTgt)),ms); return; }
  var arc=setupArc(landCam.position,orbitTarget,toPos,toTgt);
  var t0=performance.now(), dur=RM?1:(ms||1500);
  /* a transition already running (a phase change's light and overlay fade) runs on under the glide, in its own slot:
     replacing it left the tour's arrows at opacity 0 and the previous phase's drawn (found in Stage 2D) */
  setTween("cam",function(now){
    var k=Math.min(1,(now-t0)/dur);
    applyArc(arc,easeInOut(k),bulge);
    return k>=1;
  });
}
function flyTo(v){   /* v is an authored preset: re-framed to the drawn ground (presetFrame) */
  var vk=null; Object.keys(VANTAGE).forEach(function(k){ if(VANTAGE[k]===v) vk=k; });
  if(mode==="staff"){ freeCam=false; curVantage=vk;   /* the paper map: the overview frames the whole field; any other preset centres its target at its distance */
    if(v===VANTAGE.plan) MAPCAM.frameField(); else MAPCAM.glideTo(v[3],v[5],mapWppAt(Math.hypot(v[0]-v[3],v[1]-v[4],v[2]-v[5])),1600);
    return; }
  v=presetFrame(v);
  glide(new THREE.Vector3(v[0],v[1],v[2]), new THREE.Vector3(v[3],v[4],v[5]), 1600, 0.12);
  curVantage=vk;   /* the vantage's button stays pressed until the eye leaves it (Stage 3D) */
}
var VANTAGE={
  field:[-195,92,156,-33,4,-2],
  zuran:[-83,26,-53,9,6,-5],
  plateau:[23,26,55,-31,10,-13],
  allied:[135,44,-22,-25,6,12],
  plan:[-27,272,41,-27,0,9]
};

/* ---------------- the landscape camera (Stage 3D; docs/STAGE3_SPEC.md sections A.3 and H) ----------------
   The focus in the unobstructed area. The landscape's principal point is moved to the centre of the free rectangle
   (MAPCAM.freeRect(), the rectangle the paper map frames in) by camera.setViewOffset: the orbit target, every preset's target
   and every centring land in the middle of the free map, not of the window. Picking, hover, the map layer, occlusion and
   the scale bar project through the camera's own matrices, so nothing else changes (section A.2: groundAt's round trip and
   worldPerPx unchanged). The offset follows the panels: each drawn frame compares them with the last, and the offset eases
   to the new centre over the panels' slide; a resize sets it at once. On the paper map it is not drawn (MAPCAM frames its
   own plan); in Clean there is no panel, so it is about zero. */
var VOFF={x:0,y:0,tx:0,ty:0,key:"",W:0,H:0};
/* the panels the landscape's focus keeps clear of: the map layer's, without the first-run card, which stands over the map only
   until the visitor chooses a way in (owner's answer in 3D: the first screen is framed as Study is, not into the short strip
   above the card) */
function landPanels(){
  mlLegendFit(renderer.domElement.clientWidth||innerWidth,viewH());
  var P=mlPanels(), fr=document.getElementById("firstrun");
  if(fr&&!fr.hidden){ var r=fr.getBoundingClientRect(); P=P.filter(function(q){ return !(Math.abs(q[0]-r.left)<0.5&&Math.abs(q[1]-r.top)<0.5&&Math.abs(q[2]-r.right)<0.5&&Math.abs(q[3]-r.bottom)<0.5); }); }
  return P;
}
function landFreeRect(){ return MAPCAM.freeRect(null,landPanels()); }
function freeCentre(){ var fr=landFreeRect(); return [(fr[0]+fr[2])/2,(fr[1]+fr[3])/2]; }
function syncViewOffset(instant){
  if(mode==="staff"||!landCam) return true;
  var W=renderer.domElement.clientWidth||window.innerWidth, H=viewH(), P=landPanels(), key=W+"x"+H;
  for(var i=0;i<P.length;i++) key+=";"+Math.round(P[i][0])+","+Math.round(P[i][1])+","+Math.round(P[i][2])+","+Math.round(P[i][3]);
  if(key!==VOFF.key){ VOFF.key=key; var c=freeCentre(); VOFF.tx=W/2-c[0]; VOFF.ty=H/2-c[1]; }
  var done=true;
  if(instant||W!==VOFF.W||H!==VOFF.H){ VOFF.x=VOFF.tx; VOFF.y=VOFF.ty; }
  else if(VOFF.x!==VOFF.tx||VOFF.y!==VOFF.ty){
    var r=ease(0.28); VOFF.x+=(VOFF.tx-VOFF.x)*r; VOFF.y+=(VOFF.ty-VOFF.y)*r;
    if(Math.abs(VOFF.tx-VOFF.x)<0.05&&Math.abs(VOFF.ty-VOFF.y)<0.05){ VOFF.x=VOFF.tx; VOFF.y=VOFF.ty; } else { done=false; settling=true; } }
  var v=landCam.view;
  if(!v||!v.enabled||v.fullWidth!==W||v.fullHeight!==H||v.offsetX!==VOFF.x||v.offsetY!==VOFF.y||v.width!==W||v.height!==H){
    landCam.setViewOffset(W,H,VOFF.x,VOFF.y,W,H); landCam.updateProjectionMatrix(); }
  VOFF.W=W; VOFF.H=H;
  return done;
}
/* The Overview on the landscape (section B.4, as the owner settled it in 3D): what the day's battle covers fitted into the free
   rectangle. The preset gives the direction of view; the target and the distance are found so the extent's edge, on the
   drawn ground, is inside the free rectangle and centred in it. Section B.4 proposed the whole modelled ground, as the paper
   map's Overview (MAPCAM.frameField); on the landscape that put the eye 533-712 units out (1,000-1,230 on the first-run
   screen) against the authored 278, and the owner chose the battle's extent (derived from the data, no data change): every
   formation's position at the start, middle and end of every phase, every event and every place. Every other preset is
   re-framed in height only (reframe, Stage 2B); with the offset its target lands at the free rectangle's centre. */
var _actExt=null;
function actionExtent(){
  if(_actExt) return _actExt;
  var B=[1e9,1e9,-1e9,-1e9];
  function add(m){ var w=W(m[0],m[1]); B[0]=Math.min(B[0],w[0]); B[1]=Math.min(B[1],w[1]); B[2]=Math.max(B[2],w[0]); B[3]=Math.max(B[3],w[1]); }
  PHASES.forEach(function(ph){ [ph.t0+1,(ph.t0+ph.t1)/2,ph.t1-1].forEach(function(t){
    Object.keys(FORMATIONS).forEach(function(id){ if(FORMATIONS[id].track&&!goneAt(id,t)&&!notYetAt(id,t)){ var p=posAtClock(id,t); if(p) add(p); } }); }); });
  EVENTS.forEach(function(e){ add(e.p); }); FEATURES.forEach(function(f){ add(f.p); });
  return (_actExt=B);
}
function isOverview(v){ var P=VANTAGE.plan; for(var i=0;i<6;i++) if(Math.abs(v[i]-P[i])>1e-9) return false; return true; }
function presetFrame(v){ var c=reframe(v); return isOverview(v)?fitOverview(c):c; }
function fitOverview(c){
  syncViewOffset(true);
  var fr=landFreeRect(), VW=renderer.domElement.clientWidth||window.innerWidth, H=viewH(), S=[], v=new THREE.Vector3();
  var sp=landCam.position.clone(), st=orbitTarget.clone();
  var X=actionExtent();
  for(var k=0;k<=8;k++){ var a=X[0]+(X[2]-X[0])*k/8, b=X[1]+(X[3]-X[1])*k/8;
    [[a,X[1]],[a,X[3]],[X[0],b],[X[2],b]].forEach(function(q){ S.push(new THREE.Vector3(q[0],groundY(q[0],q[1]),q[1])); }); }
  var dir=new THREE.Vector3(c[0]-c[3],c[1]-c[4],c[2]-c[5]).normalize(), T=new THREE.Vector3(c[3],c[4],c[5]);
  function place(d){ landCam.position.copy(T).addScaledVector(dir,d); landCam.lookAt(T); landCam.updateMatrixWorld(true); }
  function box(){ var bx=[1e9,1e9,-1e9,-1e9];
    for(var i=0;i<S.length;i++){ v.copy(S[i]).project(landCam); if(v.z>1||v.z<-1) return null;
      var x=(v.x*0.5+0.5)*VW, y=(-v.y*0.5+0.5)*H; bx[0]=Math.min(bx[0],x); bx[1]=Math.min(bx[1],y); bx[2]=Math.max(bx[2],x); bx[3]=Math.max(bx[3],y); }
    return bx; }
  function inside(d){ place(d); var b=box(); return !!b&&b[0]>=fr[0]&&b[1]>=fr[1]&&b[2]<=fr[2]&&b[3]<=fr[3]; }
  var d=1;
  for(var it=0;it<4;it++){
    var lo=40, hi=3000; for(var n=0;n<34;n++){ var m=(lo+hi)/2; if(inside(m)) hi=m; else lo=m; } d=hi;
    /* centre the field's outline: the box's middle moved to the free rectangle's, through the ground under the two points */
    place(d); var b=box(); if(!b) break;
    var g0=groundAt((b[0]+b[2])/2,(b[1]+b[3])/2), g1=groundAt((fr[0]+fr[2])/2,(fr[1]+fr[3])/2); if(!g0||!g1) break;
    T.x+=g0[0]-g1[0]; T.z+=g0[1]-g1[1]; T.y=groundY(T.x,T.z);
  }
  var lo2=40, hi2=3000; for(var n2=0;n2<34;n2++){ var m2=(lo2+hi2)/2; if(inside(m2)) hi2=m2; else lo2=m2; } d=hi2;
  landCam.position.copy(sp); orbitTarget.copy(st); landCam.lookAt(orbitTarget); landCam.updateMatrixWorld(true);
  var E=T.clone().addScaledVector(dir,d);
  return [E.x,E.y,E.z,T.x,T.y,T.z];
}
/* Follow (section A.3; owner decision 47): today's rule made visible. On, the eye goes to each phase's view at the phase
   boundary; off, it stays where the visitor put it. It is !freeCam. A pan, orbit, zoom or double-click, and a centring
   (the dossier, the order of battle, the events), turn it off; a vantage, chapter, tour stop, phase or act turns it on.
   The button and the vantages' pressed state are brought up to date every animation frame (and by the self-test). */
var curVantage=null;
function syncFollow(){
  var b=document.getElementById("follow"), on=String(!freeCam);
  if(b&&b.getAttribute("aria-pressed")!==on) b.setAttribute("aria-pressed",on);
  var vs=document.querySelectorAll(".van-btn");
  for(var i=0;i<vs.length;i++){ var pr=String(vs[i].dataset.v===curVantage); if(vs[i].getAttribute("aria-pressed")!==pr) vs[i].setAttribute("aria-pressed",pr); }
}
function setFollow(on){
  if(on){ freeCam=false; flyTo(PHASES[curPhase].cam); }
  else { freeCam=true; curVantage=null; }
  syncFollow();
}
/* The landscape's pointer, wheel, touch and key moves (section A.3), through the app's own groundAt, groundY and clampCamera.
   - pan (left-drag, one finger, the arrow keys): the grabbed ground point stays under the pointer. The eye and the target
     move in the horizontal plane of the grabbed point; the pointer's ray is held at least 3 degrees below the horizontal,
     so a drag toward the horizon slows instead of running out; the target stays on the modelled ground. When the drag ends
     the target is moved along its own view ray onto the drawn ground ("anchor"): nothing on screen moves (section A.2).
   - zoom (the wheel, a pinch, + and -): the eye and the target scaled about the ground point under the cursor, the distance
     to the target kept in 24-620 units; a step the floor would cut is shortened to stop at the floor, so the point stays.
   - orbit (right-drag, Shift or Ctrl + left-drag, a two-finger twist, Shift + the arrow keys): about the target, as before.
   - focus (double-click): the ground point under the pointer glided to the free rectangle's centre, at the current distance
     or 86 units if farther (the dossier's centring distance).
   Each turns Follow off. Every write to the eye goes through clampCamera. */
var LANDCAM=(function(){
  var R=new THREE.Vector3(), V=new THREE.Vector3(), MIN_DEP=Math.sin(3*Math.PI/180), FX=GROUND_W/2, FZ=GROUND_D/2, grab=null;
  var stats={moves:0,ms:0,floorStops:0};
  function vw(){ return renderer.domElement.clientWidth||window.innerWidth; }
  function ray(sx,sy){ landCam.updateMatrixWorld(); return R.set(sx/vw()*2-1,-(sy/viewH())*2+1,0.5).unproject(landCam).sub(landCam.position).normalize(); }
  function screenOf(p){ landCam.updateMatrixWorld(); V.copy(p).project(landCam); return [(V.x*0.5+0.5)*vw(),(-V.y*0.5+0.5)*viewH()]; }
  function free(){ freeCam=true; curVantage=null; }
  /* the target moved along its own view ray onto the drawn ground: the picture does not move */
  function anchor(){ var t=screenOf(orbitTarget), g=groundAt(t[0],t[1]);
    if(g){ orbitTarget.set(g[0],groundY(g[0],g[1]),g[1]); landCam.lookAt(orbitTarget); } }
  function panStart(sx,sy){
    var g=groundAt(sx,sy), E=landCam.position; grab=null; if(!g) return false;
    var gy=Math.min(groundY(g[0],g[1]),E.y-0.5), r=ray(sx,sy);
    if(r.y>-MIN_DEP) return false;
    var t=(gy-E.y)/r.y; grab={x:E.x+r.x*t,y:gy,z:E.z+r.z*t}; return true;
  }
  function panTo(sx,sy){
    if(!grab) return false; var a=performance.now(), E=landCam.position, r=ray(sx,sy);
    if(r.y>-MIN_DEP){ var hl=Math.hypot(r.x,r.z)||1, c=Math.sqrt(1-MIN_DEP*MIN_DEP); r.set(r.x/hl*c,-MIN_DEP,r.z/hl*c); }
    var t=(grab.y-E.y)/r.y, dx=grab.x-(E.x+r.x*t), dz=grab.z-(E.z+r.z*t);
    dx=Math.max(-FX,Math.min(FX,orbitTarget.x+dx))-orbitTarget.x; dz=Math.max(-FZ,Math.min(FZ,orbitTarget.z+dz))-orbitTarget.z;
    orbitTarget.x+=dx; orbitTarget.z+=dz; E.x+=dx; E.z+=dz;
    clampCamera(); landCam.lookAt(orbitTarget); free();
    stats.moves++; stats.ms+=performance.now()-a; requestRender(2); return true;
  }
  function panEnd(){ if(grab){ grab=null; anchor(); requestRender(2); } }
  function zoomAt(sx,sy,k){
    var g=groundAt(sx,sy), E=landCam.position, T=orbitTarget;
    var P=g?new THREE.Vector3(g[0],groundY(g[0],g[1]),g[1]):T.clone();
    var r0=E.distanceTo(T); if(r0<1e-6) return;
    var kk=Math.max(24,Math.min(620,r0*k))/r0; free();
    if(Math.abs(kk-1)<1e-9) return;
    var e=new THREE.Vector3();
    function eyeAt(q){ return e.copy(E).sub(P).multiplyScalar(q).add(P); }
    function ok(q){ eyeAt(q); return e.y>=camFloor(e.x,e.z); }
    if(!ok(kk)){ var lo=1, hi=kk; for(var i=0;i<24;i++){ var m=(lo+hi)/2; if(ok(m)) lo=m; else hi=m; } kk=lo; stats.floorStops++; }
    eyeAt(kk); T.sub(P).multiplyScalar(kk).add(P); E.copy(e);
    clampCamera(); landCam.lookAt(T); anchor(); requestRender(2);
  }
  function orbit(dx,dy){
    sph.setFromVector3(landCam.position.clone().sub(orbitTarget));
    sph.theta-=dx*0.005; sph.phi-=dy*0.005; sph.phi=Math.max(0.10,Math.min(Math.PI/2-0.03,sph.phi));
    orbitPlace(); free(); requestRender(2);
  }
  function focusAt(sx,sy){
    var g=groundAt(sx,sy); if(!g) return false;
    var P=new THREE.Vector3(g[0],groundY(g[0],g[1]),g[1]), d=landCam.position.clone().sub(orbitTarget), r=Math.min(d.length(),86);
    glide(P.clone().addScaledVector(d.normalize(),r),P,RM?1:900,0.04); free(); return true;
  }
  /* the keys, with the map layer focused: the arrows pan 12% of the shorter side, Shift and the arrows turn 15 degrees and
     tilt 5, + and - zoom about the free rectangle's centre */
  function key(e){
    var c=freeCentre(), d=Math.round(Math.min(vw(),viewH())*0.12), k=e.key, sh=e.shiftKey, A=Math.PI/180;
    if(sh&&(k==="ArrowLeft"||k==="ArrowRight"||k==="ArrowUp"||k==="ArrowDown")){
      var dx=k==="ArrowLeft"?-15*A/0.005:k==="ArrowRight"?15*A/0.005:0, dy=k==="ArrowUp"?-5*A/0.005:k==="ArrowDown"?5*A/0.005:0;
      orbit(dx,dy); return true; }
    var m={ArrowLeft:[d,0],ArrowRight:[-d,0],ArrowUp:[0,d],ArrowDown:[0,-d]}[k];
    if(m){ if(panStart(c[0],c[1])&&panTo(c[0]+m[0],c[1]+m[1])) panEnd(); else { grab=null; free(); } return true; }
    if(k==="+"||k==="="){ zoomAt(c[0],c[1],1/1.25); return true; }
    if(k==="-"||k==="_"){ zoomAt(c[0],c[1],1.25); return true; }
    return false;
  }
  return {panStart:panStart, panTo:panTo, panEnd:panEnd, zoomAt:zoomAt, orbit:orbit, focusAt:focusAt, key:key, anchor:anchor,
    screenOf:screenOf, stats:stats, grabbing:function(){ return !!grab; }};
})();

/* ---------------- names (Stage 3E; docs/STAGE3_SPEC.md section E; owner decision 50) ----------------
   One table of the words the interface shows for the three axes of the view. The identifiers stay (terrain, staff, hybrid,
   study, watch, map): the harness drives the archived builds through them and keys its limits by case names. The buttons, their
   titles and accessible names, the layers panel and the help overlay read this table; shell.html carries the same words. */
var LABELS={
  presentation:{
    study:{label:"Study", title:"Everything: panels, dossiers, sources", key:"1"},
    watch:{label:"Watch", title:"Battlefield and timeline only", key:"2"},
    map:{label:"Clean", title:"The battlefield alone: no panels", key:"3"}
  },
  ground:{
    terrain:{label:"Landscape", title:"The ground in relief, with figures"},
    staff:{label:"Paper map", title:"A north-up plan on flat ground, with counters"},
    hybrid:{label:"Landscape with counters", title:"The ground in relief, with the paper map's counters"}
  },
  layers:{button:"Layers\u2026", heading:"Layers", aria:"Layers and ground", ground:"Ground", shows:"What is drawn"}
};
function applyLabels(){
  document.querySelectorAll(".vm-btn").forEach(function(b){ var L=LABELS.presentation[b.dataset.vm]; if(!L) return;
    b.textContent=L.label; b.title=L.title+" (key "+L.key+")"; });
  document.querySelectorAll(".mode-btn").forEach(function(b){ var L=LABELS.ground[b.dataset.m]; if(!L) return; b.textContent=L.label; b.title=L.title+" (M cycles)"; });
  var lb=document.getElementById("layersbtn"); if(lb) lb.textContent=LABELS.layers.button;
  var lp=document.getElementById("layerpop"); if(lp){ lp.setAttribute("aria-label",LABELS.layers.aria);
    var h=lp.querySelector(".lp-head span"); if(h) h.textContent=LABELS.layers.heading;
    var g=lp.querySelector(".modes"); if(g) g.setAttribute("aria-label",LABELS.layers.ground); }
}

/* ---------------- keys (Stage 3E; docs/STAGE3_SPEC.md section F; owner decisions 50, 51) ----------------
   One table of every key and pointer control. The window's key handler and the map layer's run the rows of their scope
   (keyRow); the "?" overlay lists every row; the self-test checks, by a dry run, that each row's keys reach that row and that
   other keys reach none. Rows of the scopes "item", "rail", "group" and "pointer" are bound by their own widgets (the map
   layer's items, the time rail, the roving groups and the tablist, bindCanvas) and listed here so the overlay shows them.
   shift: true or false when it matters, absent when it does not. Keys with Ctrl, Meta or Alt reach no row. */
var ARROWS=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"];
var KEYS=[
  {id:"time", scope:"window", group:"Time", keys:["ArrowLeft","ArrowRight"], show:["←","→"], text:"Back or forward ten minutes; with Shift, an hour. Stops playback. Not while a button has focus",
    run:function(e){ stopPlay(); setClock(clock+(e.key==="ArrowRight"?1:-1)*(e.shiftKey?60:10)); }},
  {id:"play", scope:"window", group:"Time", keys:[" "], show:["Space"], text:"Play or pause (on a focused button, Space presses the button)",
    run:function(e){ e.preventDefault(); togglePlay(); }},
  {id:"nextev", scope:"window", group:"Time", keys:["."], show:["."], text:"The next event", run:function(){ jumpEvent(1); }},
  {id:"prevev", scope:"window", group:"Time", keys:[","], show:[","], text:"The previous event", run:function(){ jumpEvent(-1); }},
  {id:"study", scope:"window", group:"View and ground", keys:["1"], show:["1"], text:function(){ return presLine("study"); },
    run:function(){ setPresentation("study"); }},
  {id:"watch", scope:"window", group:"View and ground", keys:["2"], show:["2"], text:function(){ return presLine("watch"); },
    run:function(){ setPresentation("watch"); }},
  {id:"clean", scope:"window", group:"View and ground", keys:["3"], show:["3"], text:function(){ return presLine("map"); },
    run:function(){ setPresentation("map"); }},
  {id:"h", scope:"window", group:"View and ground", keys:["h","H"], show:["H"], text:function(){ return LABELS.presentation.map.label+" and "+LABELS.presentation.study.label+", in turn"; },
    run:function(){ setPresentation(presentation==="map"?"study":"map"); }},
  {id:"u", scope:"window", group:"View and ground", keys:["u","U"], show:["U"], text:function(){ return LABELS.presentation.study.label+" and "+LABELS.presentation.watch.label+", in turn"; },
    run:function(){ setPresentation(presentation==="study"?"watch":"study"); }},
  {id:"m", scope:"window", group:"View and ground", keys:["m","M"], show:["M"], text:function(){ var G=LABELS.ground; return "The ground: "+G.terrain.label+", "+G.staff.label+", "+G.hybrid.label+", in turn"; },
    run:function(){ setMode(mode==="terrain"?"staff":(mode==="staff"?"hybrid":"terrain")); }},
  {id:"esc", scope:"window", group:"View and ground", keys:["Escape"], show:["Esc"], text:"Back: close the first card, the layers panel or the tour; else everything shown in Study, and the chapter, the selection and the sources sheet cleared",
    run:function(){
      if(firstRunOpen){ closeFirst(null); return; }
      if(!document.getElementById("layerpop").hidden){ window.__setPop(false); return; }
      if(tourStep>=0){ exitTour(); return; }
      if(presentation!=="study"||hideDispatch) showEverything();
      if(chapter) setChapter(null);
      select(null,null);
      document.getElementById("modal").classList.remove("on"); delete document.getElementById("modal").dataset.sources; }},
  {id:"d", scope:"window", group:"Layers and panels", keys:["d","D"], show:["D"], text:"Show or hide the dispatch's text", run:function(){ setDispatchVisible(hideDispatch); }},
  {id:"c", scope:"window", group:"Layers and panels", keys:["c","C"], show:["C"], text:"Contours on or off",
    run:function(){ var cb=document.querySelector('.layer-btn[data-l="contours"]'); if(cb) cb.click(); }},
  {id:"t", scope:"window", group:"Layers and panels", keys:["t","T"], show:["T"], text:"The terrain study on or off",
    run:function(){ var ab=document.querySelector('.layer-btn[data-l="analysis"]'); if(ab) ab.click(); }},
  {id:"f", scope:"window", group:"Layers and panels", keys:["f","F"], show:["F"], text:"Visual effects (post-processing) on or off", run:function(){ setFXEnabled(!FX.on); }},
  {id:"help", scope:"window", group:"Layers and panels", keys:["?"], show:["?"], text:"This list; ? or Esc closes it", run:function(){ setHelp(true); }},
  {id:"mappan", scope:"map", group:"The map, when it has focus (Tab to it)", keys:ARROWS, shift:false, show:["←","↑","→","↓"], text:"Pan",
    run:function(e){ mapKey(e); }},
  {id:"mapturn", scope:"map", group:"The map, when it has focus (Tab to it)", keys:ARROWS, shift:true, show:["Shift","←","↑","→","↓"],
    text:function(){ return "On the "+LABELS.ground.terrain.label.toLowerCase()+": turn 15° and tilt 5°; on the "+LABELS.ground.staff.label.toLowerCase()+": pan"; },
    run:function(e){ mapKey(e); }},
  {id:"mapzoom", scope:"map", group:"The map, when it has focus (Tab to it)", keys:["+","=","-","_"], show:["+","−"], text:"Zoom in or out about the centre",
    run:function(e){ mapKey(e); }},
  {id:"item", scope:"item", group:"The map, when it has focus (Tab to it)", keys:["Enter"," "], show:["Tab","Enter"], text:"Tab reaches the counters and names on the map, in order of importance; Enter or Space selects one"},
  {id:"rail", scope:"rail", group:"The timeline", keys:[], show:["←","→","Home","End","PgUp","PgDn"], text:"On the time rail: ten minutes (Shift, an hour), the day's start and end, the phases' starts"},
  {id:"groups", scope:"group", group:"The timeline", keys:[], show:["←","→","Home","End"], text:"In the acts, the phases, the events and the panel's tabs: move between them; Enter or Space chooses"},
  {id:"drag", scope:"pointer", group:"Pointer and touch", keys:[], show:["Drag"], text:"Pan the map (the ground under the pointer stays under it)"},
  {id:"rdrag", scope:"pointer", group:"Pointer and touch", keys:[], show:["Right-drag"], text:function(){ return "Turn and tilt the "+LABELS.ground.terrain.label.toLowerCase()+" (also Shift or Ctrl and drag)"; }},
  {id:"wheel", scope:"pointer", group:"Pointer and touch", keys:[], show:["Wheel"], text:"Zoom toward the pointer"},
  {id:"dbl", scope:"pointer", group:"Pointer and touch", keys:[], show:["Double-click"], text:function(){ return "Centre the "+LABELS.ground.terrain.label.toLowerCase()+" on that point"; }},
  {id:"click", scope:"pointer", group:"Pointer and touch", keys:[], show:["Click"], text:"Select a counter, a name or an event; on empty ground, clear the selection"},
  {id:"touch", scope:"pointer", group:"Pointer and touch", keys:[], show:["One finger","Two fingers"], text:"Pan; pinch to zoom and twist to turn"},
  {id:"dev", scope:"window", group:"Developer", keys:["`"], show:["`"], text:"The developer readout: frame and render statistics",
    run:function(){ devOn=!devOn; _devT=0; paintDevStats(performance.now()); }}
];
function keyText(r){ return typeof r.text==="function"?r.text():r.text; }
function presLine(k){ var L=LABELS.presentation[k]; return L.label+" ("+L.title.charAt(0).toLowerCase()+L.title.slice(1)+")"; }
/* the row of a scope a key event reaches, if any */
function keyRow(e,scope){
  if(e.ctrlKey||e.metaKey||e.altKey) return null;
  for(var i=0;i<KEYS.length;i++){ var r=KEYS[i];
    if(r.scope===scope&&r.keys.indexOf(e.key)>=0&&(r.shift===undefined||r.shift===!!e.shiftKey)) return r; }
  return null;
}
var KEYS_DRY=null;   /* the self-test's dry run: the rows reached are recorded, not run */
/* the map layer's keys: the paper map pans and zooms (Stage 2E), the landscape (LANDCAM, Stage 3D) also turns and tilts */
function mapKey(e){
  if(mode!=="staff") return LANDCAM.key(e);
  var v=[renderer.domElement.clientWidth||innerWidth,viewH()], d=Math.round(Math.min(v[0],v[1])*0.12);
  if(e.key==="ArrowLeft") MAPCAM.pan(d,0); else if(e.key==="ArrowRight") MAPCAM.pan(-d,0);
  else if(e.key==="ArrowUp") MAPCAM.pan(0,d); else if(e.key==="ArrowDown") MAPCAM.pan(0,-d);
  else if(e.key==="+"||e.key==="=") MAPCAM.zoomAt(v[0]/2,v[1]/2,1/1.25); else if(e.key==="-"||e.key==="_") MAPCAM.zoomAt(v[0]/2,v[1]/2,1.25);
  else return false;
  freeCam=true; return true;
}
/* the overlay: built from the table; a modal dialog that keeps focus inside and returns it on closing. Its "?" button stands in
   the timeline's control row in Study and Watch (section F.2 put Study's in the tools group, which it widened: the unobstructed
   fraction of every Study view fell by 0.1 point) */
var HELP_GROUPS=["Time","View and ground","Layers and panels","The map, when it has focus (Tab to it)","The timeline","Pointer and touch","Developer"];
function buildHelp(){
  var host=document.getElementById("help-body"); if(!host) return;
  var html="";
  HELP_GROUPS.forEach(function(g){ var rows=KEYS.filter(function(r){ return r.group===g; }); if(!rows.length) return;
    html+='<h3>'+esc(g)+'</h3>';
    rows.forEach(function(r){ html+='<div class="hp-row" data-key="'+r.id+'"><kbd>'+r.show.map(function(k){ return "<b>"+esc(k)+"</b>"; }).join("")+'</kbd><span>'+esc(keyText(r))+'</span></div>'; }); });
  host.innerHTML=html;
}
var _helpFrom=null;
function helpOpen(){ var h=document.getElementById("help"); return !!h&&!h.hidden; }
function setHelp(open){
  var h=document.getElementById("help"); if(!h) return;
  if(open===helpOpen()) return;
  if(open){ _helpFrom=document.activeElement; buildHelp(); h.hidden=false; document.getElementById("help-close").focus({preventScroll:true}); }
  else { h.hidden=true; var f=_helpFrom; _helpFrom=null;
    if(f&&f.focus&&document.contains(f)&&f!==document.body) f.focus({preventScroll:true}); else if(document.activeElement&&document.activeElement.blur) document.activeElement.blur(); }
  ["helpbtn"].forEach(function(id){ var b=document.getElementById(id); if(b) b.setAttribute("aria-expanded",String(open)); });
  requestRender(2);
}
function bindHelp(){
  var h=document.getElementById("help"); if(!h) return;
  ["helpbtn"].forEach(function(id){ var b=document.getElementById(id); if(b) b.addEventListener("click",function(e){ e.stopPropagation(); setHelp(true); }); });
  document.getElementById("help-close").addEventListener("click",function(){ setHelp(false); });
  h.addEventListener("click",function(e){ if(e.target===h) setHelp(false); });   /* the scrim around the sheet */
  h.addEventListener("keydown",function(e){
    if(e.key==="Escape"||e.key==="?"){ e.preventDefault(); e.stopPropagation(); setHelp(false); return; }
    if(e.key==="Tab"){   /* focus stays in the dialog: the close button and the scrolling list */
      var F=[document.getElementById("help-close"),document.getElementById("help-body")], i=F.indexOf(document.activeElement);
      e.preventDefault(); F[(i+(e.shiftKey?F.length-1:1))%F.length].focus({preventScroll:true}); return; }
    e.stopPropagation();   /* modal: no other key acts while it is open */
  });
}
/* the window's keys. Space and Enter on a focused button, link or tab do what the platform does (press it), not play */
function onWindowKey(e){
  if(helpOpen()) return;   /* the dialog has the keys (bindHelp) */
  if(e.ctrlKey||e.metaKey||e.altKey) return;
  var t=e.target, ctl=t&&t.closest&&t.closest("button,a[href],input,select,textarea,summary,[role='button'],[role='tab']");
  if((e.key===" "||e.key==="Enter")&&ctl) return;
  /* a Stage 3 leftover (section G.6): ← and → on a focused button, link or tab no longer step the clock; they step it from the
     map, the page, or nothing focused (the time rail and the roving groups have their own arrow keys) */
  if((e.key==="ArrowLeft"||e.key==="ArrowRight")&&ctl) return;
  var r=keyRow(e,"window");
  if(KEYS_DRY){ KEYS_DRY.push(r?r.id:null); return; }
  if(firstRunOpen && e.key!=="Escape" && e.key!=="Tab" && e.key!=="Shift" && e.key!=="`" && !(t&&t.closest&&t.closest("#firstrun"))) closeFirst(null);
  if(r) r.run(e);
}

/* ---------------- interaction ---------------- */
/* Stage 3D (owner decision 48): on the landscape a left-drag pans and a right-drag (or Shift or Ctrl + left-drag) orbits;
   the wheel zooms toward the cursor; a double-click centres the ground under it; one finger pans and two pinch and twist.
   The paper map is unchanged (Stage 2E): any drag pans, the wheel zooms toward the cursor. A press that moves under 5 px is
   a click, and selects, as before. */
function bindCanvas(){
  var el=renderer.domElement, drag=null, touch={}, pinch=null;
  el.addEventListener("contextmenu",function(e){ e.preventDefault(); });   /* the right button orbits; on the canvas only */
  function nTouch(){ return Object.keys(touch).length; }
  function pinchState(){ var k=Object.keys(touch), a=touch[k[0]], b=touch[k[1]];
    return {mx:(a[0]+b[0])/2, my:(a[1]+b[1])/2, d:Math.hypot(b[0]-a[0],b[1]-a[1])||1, ang:Math.atan2(b[1]-a[1],b[0]-a[0])}; }
  el.addEventListener("pointerdown",function(e){
    if(e.pointerType==="touch"){ touch[e.pointerId]=[e.clientX,e.clientY];
      if(nTouch()===2&&mode!=="staff"){ if(drag&&drag.kind==="pan") LANDCAM.panEnd(); drag=null; pinch=pinchState(); return; } }
    if(drag&&e.pointerType==="touch") return;
    var orbit=(e.button===2||e.shiftKey||e.ctrlKey);
    drag={kind:mode==="staff"?"map":(orbit?"orbit":"pan"), moved:0, x0:e.clientX, y0:e.clientY, lx:e.clientX, ly:e.clientY, started:false, id:e.pointerId};
    if(el.setPointerCapture) el.setPointerCapture(e.pointerId);
  });
  el.addEventListener("pointermove",function(e){
    if(e.pointerType==="touch"&&touch[e.pointerId]){ touch[e.pointerId]=[e.clientX,e.clientY];
      if(pinch&&nTouch()===2){ var p=pinchState();
        LANDCAM.zoomAt(p.mx,p.my,pinch.d/p.d); LANDCAM.orbit(-(p.ang-pinch.ang)/0.005,0); pinch=p; return; } }
    if(!drag){ if(e.pointerType!=="touch") mlHoverAt(e.clientX,e.clientY); return; }
    if(e.pointerId!==drag.id) return;
    var dx=e.clientX-drag.lx, dy=e.clientY-drag.ly;
    drag.moved+=Math.abs(dx)+Math.abs(dy); drag.lx=e.clientX; drag.ly=e.clientY;
    if(drag.moved>4){ freeCam=true; curVantage=null; }
    if(drag.kind==="map"){ MAPCAM.pan(dx,dy); return; }   /* the paper map pans; it never orbits */
    if(drag.kind==="orbit"){ LANDCAM.orbit(dx,dy); return; }
    if(!drag.started){ drag.started=true; LANDCAM.panStart(drag.x0,drag.y0); }
    LANDCAM.panTo(e.clientX,e.clientY);
  });
  window.addEventListener("pointerup",function(e){
    if(e.pointerType==="touch"){ delete touch[e.pointerId]; if(pinch){ if(nTouch()<2) pinch=null; return; } }
    if(!drag||(e.pointerId!==undefined&&drag.id!==undefined&&e.pointerId!==drag.id)) return;
    if(drag.moved<5){
      var hit=pickAt(e.clientX,e.clientY);
      select(hit?hit.kind:null, hit?hit.id:null);
    }
    if(drag.kind==="pan"&&drag.started) LANDCAM.panEnd();
    drag=null;
  });
  window.addEventListener("pointercancel",function(e){ delete touch[e.pointerId]; pinch=null; if(drag&&drag.kind==="pan"&&drag.started) LANDCAM.panEnd(); drag=null; });
  el.addEventListener("pointerleave",function(){ if(ML.hover){ ML.hover=null; el.style.cursor=""; requestRender(2); } });
  el.addEventListener("dblclick",function(e){ if(mode!=="staff"){ e.preventDefault(); LANDCAM.focusAt(e.clientX,e.clientY); } });
  el.addEventListener("wheel",function(e){
    e.preventDefault(); freeCam=true; curVantage=null;
    if(mode==="staff"){ MAPCAM.zoomAt(e.clientX,e.clientY,1+Math.sign(e.deltaY)*0.09); return; }   /* toward the cursor */
    LANDCAM.zoomAt(e.clientX,e.clientY,1+Math.sign(e.deltaY)*0.09);
  },{passive:false});
}

/* ---------------- UI ---------------- */
function el(tag,cls,html){ var e=document.createElement(tag); if(cls) e.className=cls; if(html!=null) e.innerHTML=html; return e; }
function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function buildUI(){
  applyLabels();   /* Stage 3E */
  bindCanvas();

  /* the one timeline (Stage 3C): act bands, phase ticks, the rail, the event markers, on one time axis */
  buildTimeline();

  document.querySelectorAll(".mode-btn").forEach(function(b){
    b.addEventListener("click",function(){ setMode(b.dataset.m); });
  });

  /* rail tabs (Stage 3B: a tablist; arrow keys, Home and End move between the tabs shown, without stepping the clock) */
  document.querySelectorAll(".tab-btn").forEach(function(b){
    b.addEventListener("click",function(){ selectTab(b.dataset.t); tabChosen=true; });
  });
  var tl2=document.querySelector(".tabs");
  if(tl2) tl2.addEventListener("keydown",function(e){
    var T=Array.prototype.filter.call(document.querySelectorAll(".tab-btn"),function(x){ return !x.hidden; }), i=T.indexOf(document.activeElement), j=-1;
    if(i<0) return;
    if(e.key==="ArrowRight") j=(i+1)%T.length; else if(e.key==="ArrowLeft") j=(i-1+T.length)%T.length;
    else if(e.key==="Home") j=0; else if(e.key==="End") j=T.length-1;
    if(j<0) return;
    e.preventDefault(); e.stopPropagation();
    selectTab(T[j].dataset.t,true); tabChosen=true;
  });

  /* the ten moments */
  var ch=document.getElementById("chapters");
  ANALYSIS.forEach(function(c){
    var b=el("button","chap");
    b.type="button"; b.dataset.c=c.id;
    b.innerHTML='<em>'+esc(fmtClock(chapterClock(c)))+'</em><span>'+esc(c.n)+'</span>';
    b.addEventListener("click",function(){ setChapter(chapter===c.id?null:c.id); });
    ch.appendChild(b);
  });
  paintChapterText();

  document.querySelectorAll(".cmd-btn").forEach(function(b){
    b.addEventListener("click",function(){ setCommandView(b.dataset.cv); });
  });
  document.querySelectorAll(".spd-btn").forEach(function(b){
    b.addEventListener("click",function(){ setSpeed(+b.dataset.s); });
  });

  document.querySelectorAll(".van-btn").forEach(function(b){
    b.addEventListener("click",function(){
      document.querySelectorAll(".van-btn").forEach(function(o){o.setAttribute("aria-pressed","false");});
      b.setAttribute("aria-pressed","true");
      flyTo(VANTAGE[b.dataset.v]);
    });
  });
  document.querySelectorAll(".layer-btn").forEach(function(b){
    b.addEventListener("click",function(){
      var k=b.dataset.l, on=b.getAttribute("aria-pressed")==="true";
      layerOn[k]=!on; b.setAttribute("aria-pressed",String(!on));

    });
  });
  var dwb=document.getElementById("dwell");   /* Stage 4D (decision 75): pause briefly at events, on by default */
  if(dwb) dwb.addEventListener("click",function(){ DWELL.on=!DWELL.on; dwb.setAttribute("aria-pressed",String(DWELL.on)); if(!DWELL.on) DWELL.st=null; });
  document.getElementById("prev").addEventListener("click",function(){ stopPlay(); setClock(clock-10); });
  document.getElementById("next").addEventListener("click",function(){ stopPlay(); setClock(clock+10); });
  document.getElementById("prevEv").addEventListener("click",function(){ jumpEvent(-1); });
  var fb=document.getElementById("follow");   /* Stage 3D: Follow the action (section A.3, decision 47) */
  if(fb) fb.addEventListener("click",function(){ setFollow(freeCam); });
  document.getElementById("nextEv").addEventListener("click",function(){ jumpEvent(1); });
  document.getElementById("play").addEventListener("click",togglePlay);
  document.querySelectorAll(".vm-btn").forEach(function(b){
    b.addEventListener("click",function(){ setPresentation(b.dataset.vm); });
  });

  document.getElementById("restore").addEventListener("click",showEverything);
  document.getElementById("tourbtn").addEventListener("click",function(){
    if(tourStep>=0) exitTour(); else startTour();
  });
  document.getElementById("tour-prev").addEventListener("click",function(){ tourGo(-1); });
  document.getElementById("tour-next").addEventListener("click",function(){ tourGo(1); });
  document.getElementById("tour-exit").addEventListener("click",exitTour);
  paintKey(); bindExaggeration();
  /* the legend's head opens and closes it; where it would lie over the dispatch it stays closed (its title says why) */
  document.getElementById("lg-toggle").addEventListener("click",function(){
    if(document.querySelector(".legend").classList.contains("squeezed")) return;
    ML.legendOpen=!ML.legendOpen; requestRender(2); });
  document.getElementById("fr-close").addEventListener("click",function(){ closeFirst("explore"); });
  document.getElementById("fr-watch").addEventListener("click",function(){ closeFirst("watch"); });
  document.getElementById("fr-tour").addEventListener("click",function(){ closeFirst("tour"); });
  /* anything done outside the card is Explore, in place */
  window.addEventListener("pointerdown",function(e){
    if(firstRunOpen && !e.target.closest("#firstrun")) closeFirst(null); },{capture:true});
  document.getElementById("sc-open").addEventListener("click",function(){ setPresentation("study"); paintDrawer(); });
  document.getElementById("sc-clear").addEventListener("click",function(){ select(null,null); });
  document.querySelectorAll(".plan-btn").forEach(function(b){
    b.addEventListener("click",function(){ setPlan(b.dataset.p); });
  });
  paintPlanText();
  (function(){
    _tbEl=document.querySelector(".timebar");
    if(window.ResizeObserver && _tbEl) new ResizeObserver(syncTimebarHeight).observe(_tbEl);
    window.addEventListener("resize",syncTimebarHeight);
    syncTimebarHeight();
  })();
  if(window.innerWidth<1080) document.body.classList.add("rail-hidden");
  syncDock();
  var db=document.getElementById("drawer-back"); if(db) db.addEventListener("click",function(){ select(null,null); });

  var pop=document.getElementById("layerpop"), popBtn=document.getElementById("layersbtn");
  function setPop(open){
    pop.hidden=!open;
    popBtn.setAttribute("aria-expanded",String(open));
  }
  popBtn.addEventListener("click",function(e){ e.stopPropagation(); setPop(pop.hidden); });
  document.getElementById("layerclose").addEventListener("click",function(){ setPop(false); });
  pop.addEventListener("click",function(e){ e.stopPropagation(); });
  document.addEventListener("click",function(){ if(!pop.hidden) setPop(false); });
  window.__setPop=setPop;
  document.getElementById("going").addEventListener("click",function(){
    goingOn=!goingOn;
    this.setAttribute("aria-pressed",String(goingOn));
    setGround(goingOn?"going":(mode==="staff"?"paper":"natural"));
    document.getElementById("goingkey").style.display=goingOn?"block":"none";
  });
  document.getElementById("vsclear").addEventListener("click",function(){
    clearViewshed(); syncViewBadge(); if(selection) paintDrawer();
  });
  document.getElementById("drawer-close").addEventListener("click",function(){ select(null,null); });
  document.getElementById("srcbtn").addEventListener("click",function(){ openSources(); });
  document.getElementById("modal-close").addEventListener("click",function(){ var md=document.getElementById("modal"); md.classList.remove("on"); delete md.dataset.sources; });

  window.addEventListener("keydown",onWindowKey);   /* Stage 3E: the key table (KEYS) */
  bindHelp();
  /* render on demand: input asks for frames; a drag only while a button is held */
  ["pointerdown","pointerup","wheel","keydown","click"].forEach(function(ev){
    window.addEventListener(ev,function(){ lastInput=performance.now(); requestRender(2); },{capture:true,passive:true}); });
  window.addEventListener("pointermove",function(e){ if(e.buttons){ lastInput=performance.now(); requestRender(1); } },{capture:true,passive:true});
  /* a panel sliding in or out (the drawer, the rail, the legend): draw until it has stopped, and once more after */
  ["transitionrun","transitionstart"].forEach(function(ev){ document.addEventListener(ev,function(){ panelMoveUntil=performance.now()+450; }); });
  document.addEventListener("transitionend",function(){ requestRender(2); });
  window.addEventListener("resize",function(){
    requestRender(3);
    syncDock();
    landCam.aspect=window.innerWidth/window.innerHeight;
    landCam.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
    sizeFX();
    syncViewOffset(true);   /* Stage 3D: the focus at the new free rectangle's centre at once */
    /* the paper map: the field framed anew if that is what it shows, else the plan keeps its centre and scale */
    if(mode==="staff"){ if(MAPCAM.framed()) MAPCAM.frameField(true); else MAPCAM.apply(); }
  });
  buildOOB();
}

/* ---- one colour key ----
   The legend and the first-run card are both written from this table, and the table reads the
   same colours that draw the counters, figures and arrows (NATION, SIDE_COL), so the key a
   visitor is told and the key on screen cannot drift apart. The larger encoding problems
   (status and claim colours reusing the side hues) are Stage 1. */
function hexOf(n){ return "#"+("000000"+n.toString(16)).slice(-6).toUpperCase(); }
var COLOUR_KEY={
  fr:{word:"blue", hex:NATION.fr.fill}, ru:{word:"green", hex:NATION.ru.fill}, at:{word:"white", hex:NATION.at.fill},
  "arrow-fr":{word:"blue", hex:hexOf(SIDE_COL.fr.attack)}, "arrow-al":{word:"amber", hex:hexOf(SIDE_COL.al.attack)},
  /* true scale draws formations as footprints in the side colour (makeFootprint): the legend says so (2D) */
  "foot-fr":{word:"blue", hex:TOKENS.sym.side.fr.base}, "foot-al":{word:"amber", hex:TOKENS.sym.side.al.base}
};
function paintKey(){
  document.querySelectorAll(".legend [data-key]").forEach(function(e){
    var k=COLOUR_KEY[e.dataset.key]; if(k) e.style.background=k.hex; });
  document.querySelectorAll(".legend .bnd").forEach(function(e){ e.style.borderTopColor=TOKENS.sym.label.dark.annotation; });
  /* the paper map's woods and village footprints (Stage 2E): the colours world.js draws them in */
  document.querySelectorAll(".legend .psym").forEach(function(e){ var t=TOKENS.sym.paperMap[e.dataset.sym];
    e.style.background=t.fill; e.style.borderColor=t.edge; });
  /* the going classes: the same table the going layer is drawn from (world.js makeGoingPalette) */
  var gk=document.getElementById("goingkey");
  /* the slope classes are read from the model slope (decision 32): their thresholds in true degrees, provisional */
  var GT={hard:GOING_TRUE_DEG[0], severe:GOING_TRUE_DEG[1]};
  if(gk) gk.innerHTML=TOKENS.sym.going.map(function(g){
    var lab=g.label+(GT[g.key]!==undefined?" (true slope over "+GT[g.key].toFixed(2)+"\u00b0, provisional)":"");
    return '<div class="k"><span>'+esc(lab)+'</span><span class="sw" data-going="'+g.key+'" style="background:'+g.hex+'"></span></div>'; }).join("");
  var p=document.getElementById("fr-key"); if(!p) return;
  var K=COLOUR_KEY;
  function sw(k,cls){ return '<i class="'+(cls||"key-sw")+'" data-key="'+k+'" style="background:'+K[k].hex+'" aria-hidden="true"></i>'; }
  function cap(w){ return w.charAt(0).toUpperCase()+w.slice(1); }
  p.innerHTML=sw("fr")+cap(K.fr.word)+" is the French army. The Allies are "+sw("ru")+K.ru.word+" for Russia and "+
    sw("at")+K.at.word+" for Austria, and their movement arrows are drawn in "+sw("arrow-al","key-ar")+K["arrow-al"].word+
    ". The high ground in the centre is the Pratzen plateau, and it decides the battle.";
}
/* ---- the first view ----
   The whole field from above (the Overview vantage) at 04:00, the first-run card alone near the
   foot of the map, the dispatch and legend held back until the visitor chooses a way in. Any
   click or key outside the card counts as Explore, without moving the camera. */
var firstRunOpen=false;
function openFirstRun(){
  var fr=document.getElementById("firstrun"); if(!fr||fr.hidden) return;
  firstRunOpen=true;
  document.body.classList.add("firstrun-on");
  if(docked) selectTab("oob");                  /* Stage 3B: the rail as before while the card is open */
  var v=presetFrame(VANTAGE.plan);              /* Stage 3D: the field fitted into the free rectangle above the card */
  camArc=null;                                  /* the start-up phase transition keeps its light, not its camera */
  landCam.position.set(v[0],v[1],v[2]); orbitTarget.set(v[3],v[4],v[5]); landCam.lookAt(orbitTarget);
  clampCamera();
  curVantage="plan"; syncFollow();
  requestRender(3);
}
function closeFirst(how){
  if(!firstRunOpen) return;
  firstRunOpen=false;
  var fr=document.getElementById("firstrun"); if(fr) fr.hidden=true;
  document.body.classList.remove("firstrun-on");
  if(docked&&!tabChosen) selectTab("now");      /* Stage 3B (decision 55): Study opens on the Now tab */
  if(how==="tour") startTour();
  else if(how==="watch"){ setPresentation("watch"); setPhase(0); if(!playing) togglePlay(); }
  else if(how==="explore") setPhase(0);
  syncSelChip(); requestRender(3);
}
/* ---- the selection chip ----
   Whenever something is selected but its dossier is not on screen (Watch, the clean Map view),
   this says what is selected, why the rest is dimmed, and offers the dossier or a way out. */
function drawerShown(){ var d=document.getElementById("drawer"); return !!d&&d.classList.contains("on")&&getComputedStyle(d).display!=="none"; }
function syncSelChip(){
  var chip=document.getElementById("selchip"); if(!chip) return;
  var show=!!selection && !drawerShown() && !firstRunOpen;
  chip.hidden=!show;
  if(!show) return;
  var k="Selected", n="", st="";
  if(selection.kind==="f"&&FORMATIONS[selection.id]){
    n=FORMATIONS[selection.id].name; var s1=liveStatus(selection.id,curPhase); st=(s1&&STATUS[s1])?STATUS[s1].label:"";
    if(highlight) k="Selected, with its chain of command";
  } else if(selection.kind==="e"){ k="Event"; EVENTS.forEach(function(e){ if(e.id===selection.id) n=e.n; }); }
  else if(selection.kind==="t"){ k="Place"; FEATURES.forEach(function(x){ if(x.id===selection.id) n=x.name; }); }
  else { k="Terrain"; n=selection.id; }
  chip.querySelector(".sc-k").textContent=k;
  chip.querySelector(".sc-n").textContent=n;
  chip.querySelector(".sc-s").textContent=st;
}
function shortCommander(f){
  var c=f.commander||"";
  c=c.replace(/^(Marshal|Gen\. de division|Gen\.|General|Lt\.-Gen\.|Maj\.-Gen\.|FML|Feldmarschall-Leutnant|Emperor|Grand Duke)\s+/,"");
  var cut=c.indexOf(";"); if(cut>0) c=c.slice(0,cut);
  return c.length>34 ? c.slice(0,33)+"\u2026" : c;
}
function buildOOB(){
  var host=document.getElementById("oob");
  host.innerHTML="";
  [["French army — Grande Armee",["gqg","c_iv","c_iii","c_v","c_cav","c_i","c_gd","c_gren"],"fr"],
   ["Allied army — Russia and Austria",["ahq","buxhowden","col4","lich","bag","constantine"],"al"]]
  .forEach(function(grp){
    var h=el("div","oob-head",esc(grp[0]));
    host.appendChild(h);
    grp[1].forEach(function(id){
      var f=FORMATIONS[id];
      var row=el("button","oob-row");
      row.type="button"; row.dataset.id=id;
      row.innerHTML='<span class="oob-dot" style="background:'+NATION[f.nation].fill+'"></span>'+
        '<span class="oob-name">'+esc(f.name)+'<em>'+esc(shortCommander(f))+'</em></span>'+
        '<span class="oob-str">'+(aggStrength(id)?aggStrength(id).toLocaleString():"—")+'</span>';
      row.addEventListener("click",function(){ select("f",id); focusOn(id); });
      host.appendChild(row);
      if(f.children) f.children.forEach(function(cid){
        var cf=FORMATIONS[cid];
        var r2=el("button","oob-row sub");
        r2.type="button"; r2.dataset.id=cid;
        r2.innerHTML='<span class="oob-name">'+esc(cf.name)+'<em>'+esc(shortCommander(cf))+'</em></span>'+
          '<span class="oob-str">'+(cf.strength?cf.strength.toLocaleString():"—")+'</span>';
        r2.addEventListener("click",function(){ select("f",cid); focusOn(cid); });
        host.appendChild(r2);
        if(cf.children) cf.children.forEach(function(gid){
          var gf=FORMATIONS[gid];
          var r3=el("button","oob-row sub2");
          r3.type="button"; r3.dataset.id=gid;
          r3.innerHTML='<span class="oob-name">'+esc(gf.name)+'</span>'+
            '<span class="oob-str">'+(gf.strength?gf.strength.toLocaleString():"—")+'</span>';
          r3.addEventListener("click",function(){ select("f",gid); focusOn(gid); });
          host.appendChild(r3);
        });
      });
    });
  });
  /* orphan leaves that hang off a leaf parent (Kamensky) */
  paintOOB();
}
function paintOOB(){
  document.querySelectorAll(".oob-row").forEach(function(r){
    var id=r.dataset.id;
    r.classList.toggle("off", !posNow(id));
    r.classList.toggle("sel", !!(selection&&selection.kind==="f"&&selection.id===id));
    r.classList.toggle("kin", !!(highlight && highlight[id] && !(selection&&selection.id===id)));
  });
  paintCommand();
}
function centreOnMap(mp,radius){
  var w=W(mp[0],mp[1]), y=displayHeight(w[0],w[1]);
  var tgt=new THREE.Vector3(w[0],y,w[1]);
  var pos=tgt.clone().add(new THREE.Vector3(-0.55,0.62,0.56).normalize().multiplyScalar(radius||86));
  glide(pos,tgt,1500,0.10);
  freeCam=true;   /* Stage 3D (decision 47): a centring turns Follow off */
}
function focusOn(id){
  var p=posOf(id,curPhase); if(!p) return;
  centreOnMap(p,86);
}

var _sitKey="", _plLastVal=-1, _plLastT=0;
var SEP_NOTE="Derived from the plotted formations: a French formation stands across the line joining the Allied groups north and south of the plateau. A spatial reading, not a casualty figure.";
var FLAT_NOTE="The reconstruction plots formations, not losses. A holding that does not change does not mean the fighting there has stopped.";
/* Stage 3C (docs/STAGE3_SPEC.md section D.2): the situation is split. The timeline's caption carries the act, the phase and the
   live event, and, where no Now tab is shown (Watch, the tour, D), the two derived readings; the top of the Now tab (inside
   the dispatch) carries the derived readings and the live event's reason. The row's dismiss went with the row. */
function paintSituation(){
  var host=document.getElementById("situation"), cap=document.getElementById("tb-cap");
  if(!host&&!cap) return;
  var live=liveEvents(clock), top=live.length?live[0].e:null;
  var act=actOf(curPhase);
  var onH=plateauStrength("al"), cut=centreSeparation();
  if(onH!==_plLastVal){ _plLastVal=onH; _plLastT=clock; }
  var flatFor=clock-_plLastT;
  var dw=dwellEvents();   /* Stage 4D: during a dwell the caption names the event(s) the clock stopped for */
  var key=[act.id,curPhase,top?top.id:"-",Math.round(onH/1000),cut?1:0,
           flatFor>=60?1:0,playing?1:0,dw?dw.map(function(e){ return e.id; }).join(","):"-"].join("|");
  if(key===_sitKey) return;
  _sitKey=key;
  var der=(curPhase<=6&&onH>0)?'<span class="der" title="'+esc(FLAT_NOTE)+'"><small>derived</small> on the heights: Allied &asymp; '+
      onH.toLocaleString()+(flatFor>=60?' <em>plotted strength unchanged</em>':'')+'</span>':"";
  var cutH=cut?'<span class="cut der" title="'+esc(SEP_NOTE)+'"><small>derived</small> centre separation detected</span>':"";
  var c='<span class="act">'+esc(act.n.toUpperCase())+'</span><span class="sep">&middot;</span><span>'+esc(PHASES[curPhase].title)+'</span>';
  if(dw&&dw.length) c+='<span class="sep">&middot;</span><span class="ev dwell">'+esc(dw.map(function(e){ return e.n; }).join("; "))+'</span>';
  else if(top) c+='<span class="sep">&middot;</span><span class="ev">'+esc(top.n)+'</span>';
  if(der) c+='<span class="sep der-sep">&middot;</span>'+der;
  if(cutH) c+='<span class="sep der-sep">&middot;</span>'+cutH;
  if(cap){ cap.innerHTML=c; cap.title=cap.textContent; }
  if(host) host.innerHTML=der+cutH+(top?'<span class="ev">'+esc(top.n)+'</span>':'')+'<span class="why">'+esc(top?top.why:act.line)+'</span>';
}
/* ---- Stage 3C: one timeline (docs/STAGE3_SPEC.md section D; owner decisions 53, 60) ----
   One axis, proportional to time from 04:00 to 18:00 (decision 53): the act bands, the phase ticks with their labels and the
   rail (hour ticks, the event markers, the playhead) are placed at their share of it. The current phase's label is always
   whole (style.css); a narrow phase's label shortens where it does not fit. Acts, phases and events are each one keyboard
   stop (a roving tabindex: the arrow keys, Home and End move within the group and stop there, so the clock does not step);
   the rail is the slider (arrows ±10 min, Shift ±60, Home and End, PageUp and PageDown the phase starts). */
function tlPc(t){ return 100*(t-T_MIN)/(T_MAX-T_MIN); }
function tlText(t){ var ph=phaseAt(t); return fmtClock(t)+", "+PHASES[ph].label+", "+actOf(ph).n; }
function rovingGroup(host,sel){
  if(!host) return;
  host.addEventListener("keydown",function(e){
    var B=Array.prototype.slice.call(host.querySelectorAll(sel)), i=B.indexOf(document.activeElement), j=-1;
    if(i<0) return;
    if(e.key==="ArrowRight"||e.key==="ArrowDown") j=Math.min(B.length-1,i+1); else if(e.key==="ArrowLeft"||e.key==="ArrowUp") j=Math.max(0,i-1);
    else if(e.key==="Home") j=0; else if(e.key==="End") j=B.length-1;
    if(j<0) return;
    e.preventDefault(); e.stopPropagation();
    B.forEach(function(b,k){ b.tabIndex=(k===j)?0:-1; }); B[j].focus();
  });
}
function buildTimeline(){
  SPINE=buildSpine();
  var tl=document.getElementById("phases");
  if(tl){ tl.innerHTML="";
    PHASES.forEach(function(p,i){
      var b=el("button","step"); b.type="button"; b.textContent=p.label; b.title=p.clock+"  "+p.title;
      b.setAttribute("aria-label",p.clock+", "+p.label+": "+p.title);
      b.style.left=tlPc(p.t0)+"%"; b.style.width=(tlPc(p.t1)-tlPc(p.t0))+"%"; b.tabIndex=-1;
      b.addEventListener("click",function(){ stopPlay(); freeCam=false; setPhase(i); });
      tl.appendChild(b); });
    rovingGroup(tl,".step"); }
  buildActs();
  var rail=document.getElementById("timerail"), ticks=document.getElementById("railticks"), evh=document.getElementById("evmarks");
  if(ticks){ var html="";
    for(var t=Math.ceil(T_MIN/60)*60; t<=T_MAX; t+=60){ var h=Math.floor(t/60), major=(h%2===0);
      html+='<i class="'+(major?"hr":"")+'" style="left:'+tlPc(t)+'%"></i>';
      if(major) html+='<b style="left:'+tlPc(t)+'%">'+((h<10?"0":"")+h)+'</b>'; }
    ticks.innerHTML=html; }
  if(evh){ evh.innerHTML="";
    /* in time order, so the arrow keys go forward in time */
    EVENTS.map(function(e){ var w=evWindow(e); return {e:e,mid:(w[0]+w[1])/2}; }).sort(function(a,b){ return a.mid-b.mid; }).forEach(function(o,k){
      var e=o.e, b=el("button","ev-mark "+(e.kind==="decision"?"dec ":"")+(e.side==="fr"?"fr":"al")); b.type="button";
      b.style.left=tlPc(o.mid)+"%"; b.title=fmtClock(o.mid)+"  "+e.n; b.setAttribute("aria-label",fmtClock(o.mid)+", "+e.n); b.tabIndex=k===0?0:-1;
      b.addEventListener("click",function(){ stopPlay(); setClock(o.mid); select("e",e.id); });
      evh.appendChild(b); _evTicks.push({el:b,e:e,mid:o.mid}); });
    rovingGroup(evh,".ev-mark"); }
  if(!rail) return;
  var dragging=false;
  function toClock(clientX){ var r=rail.getBoundingClientRect(); return T_MIN+Math.max(0,Math.min(1,(clientX-r.left)/(r.width||1)))*(T_MAX-T_MIN); }
  rail.addEventListener("pointerdown",function(e){ dragging=true; stopPlay(); if(rail.setPointerCapture) rail.setPointerCapture(e.pointerId); setClock(toClock(e.clientX)); });
  rail.addEventListener("pointermove",function(e){ if(dragging) setClock(toClock(e.clientX)); });
  window.addEventListener("pointerup",function(){ dragging=false; });
  rail.addEventListener("keydown",function(e){
    var t=null, ph=phaseAt(clock);
    if(e.key==="ArrowRight") t=clock+(e.shiftKey?60:10); else if(e.key==="ArrowLeft") t=clock-(e.shiftKey?60:10);
    else if(e.key==="Home") t=T_MIN; else if(e.key==="End") t=T_MAX;
    else if(e.key==="PageDown") t=ph<PHASES.length-1?PHASES[ph+1].t0:T_MAX;
    else if(e.key==="PageUp") t=(clock>PHASES[ph].t0+0.5)?PHASES[ph].t0:PHASES[Math.max(0,ph-1)].t0;
    if(t===null) return;
    e.preventDefault(); e.stopPropagation();   /* one step: the window's own arrow keys do not step it again (before 3C: +25 min) */
    stopPlay(); setClock(t);
  });
}
function buildActs(){
  var host=document.getElementById("acts");
  if(!host) return;
  host.innerHTML="";
  ACTS.forEach(function(a){
    var p0=PHASES[a.phases[0]], p1=PHASES[a.phases[a.phases.length-1]], b=el("button","act-btn");
    b.type="button"; b.dataset.a=a.id; b.textContent=a.n; b.title=a.line; b.tabIndex=-1;
    b.setAttribute("aria-label",a.n+", "+fmtClock(p0.t0)+" to "+fmtClock(p1.t1)+": "+a.line);
    b.style.left=tlPc(p0.t0)+"%"; b.style.width=(tlPc(p1.t1)-tlPc(p0.t0))+"%";
    b.addEventListener("click",function(){ stopPlay(); setPhase(a.phases[0]); });
    host.appendChild(b);
  });
  rovingGroup(host,".act-btn");
}
function paintActs(){
  var cur=actOf(curPhase), host=document.getElementById("acts"), inG=!!(host&&document.activeElement&&document.activeElement.parentNode===host);
  document.querySelectorAll(".act-btn").forEach(function(b){
    var on=b.dataset.a===cur.id; b.setAttribute("aria-current", on?"true":"false"); if(!inG) b.tabIndex=on?0:-1;
  });
}
/* ---- Stage 3C: the spine index (docs/STAGE3_SPEC.md section C.2), built from the data as it is; no data change ----
   acts > phases > events: each event in the phase that holds the start of its window; each chapter and tour stop placed by its
   clock. The timeline marks the chosen chapter's or tour stop's place on the axis. */
var SPINE=null;
function buildSpine(){
  var P=PHASES.map(function(p,i){ return {ph:i,t0:p.t0,t1:p.t1,act:actOf(i).id,events:[],chapters:[],tour:[]}; });
  EVENTS.forEach(function(e){ P[phaseAt(evWindow(e)[0])].events.push(e.id); });
  ANALYSIS.forEach(function(c){ P[momentOf(c.at).ph].chapters.push(c.id); });
  TOUR.forEach(function(st,k){ P[phaseAt(stopClock(st))].tour.push(k); });
  return {acts:ACTS.map(function(a){ return {id:a.id,phases:a.phases.slice()}; }),phases:P};
}
/* jump between the moments that matter, not between arbitrary minutes */
function eventTimes(){
  return EVENTS.map(function(e){ var w=evWindow(e); return (w[0]+w[1])/2; })
               .sort(function(a,b){ return a-b; });
}
var _pv2=new THREE.Vector3();
function onScreen(mp,margin){
  var w=W(mp[0],mp[1]);
  _pv2.set(w[0],displayHeight(w[0],w[1])+3,w[1]).project(camera);
  if(_pv2.z>1) return false;
  margin=(margin===undefined)?0.16:margin;
  return Math.abs(_pv2.x)<1-margin && Math.abs(_pv2.y)<1-margin;
}
function goToEventAt(t){
  /* the clock moves; the camera only follows if the moment is off screen */
  setClock(t,{camera:false});
  var best=null,bw=0;
  liveEvents(t).forEach(function(x){ if(x.w>bw){ bw=x.w; best=x.e; } });
  if(best && !onScreen(best.p)) centreOnMap(best.p,112);
}
function jumpEvent(dir){
  stopPlay();
  var ts=eventTimes(), t=clock;
  if(dir>0){
    for(var i=0;i<ts.length;i++) if(ts[i]>t+1.5){ goToEventAt(ts[i]); return; }
    goToEventAt(T_MAX);
  } else {
    for(var j=ts.length-1;j>=0;j--) if(ts[j]<t-1.5){ goToEventAt(ts[j]); return; }
    goToEventAt(T_MIN);
  }
}
function paintTimeline(){
  var tl=document.getElementById("phases"), inG=!!(tl&&document.activeElement&&document.activeElement.parentNode===tl);
  document.querySelectorAll("#phases .step").forEach(function(b,i){
    b.setAttribute("aria-current", i===curPhase?"true":"false"); if(!inG) b.tabIndex=(i===curPhase)?0:-1;
  });
  paintSituation();
  paintActs();
  var r=document.getElementById("clockread");
  if(r) r.textContent=fmtClock(clock);
  var evh=document.getElementById("evmarks"), inE=!!(evh&&document.activeElement&&document.activeElement.parentNode===evh), best=-1, bd=1e9;
  var dwI={}; (dwellEvents()||[]).forEach(function(e){ dwI[e.id]=1; });
  for(var q=0;q<_evTicks.length;q++){
    _evTicks[q].el.classList.toggle("on", evWeight(_evTicks[q].e,clock)>0.5);
    if(_evTicks[q].el.classList.contains("dw")!==!!dwI[_evTicks[q].e.id]) _evTicks[q].el.classList.toggle("dw",!!dwI[_evTicks[q].e.id]);   /* Stage 4D: lit while the clock dwells on it */
    var d=Math.abs(_evTicks[q].mid-clock); if(d<bd){ bd=d; best=q; }
  }
  if(!inE) for(var q2=0;q2<_evTicks.length;q2++) _evTicks[q2].el.tabIndex=(q2===best)?0:-1;   /* the keyboard enters the events at the nearest */
  var head=document.getElementById("playhead");
  if(head) head.style.left=tlPc(clock)+"%";
  var rail=document.getElementById("timerail"), m=Math.round(clock);
  if(rail&&rail.getAttribute("aria-valuenow")!==String(m)){ rail.setAttribute("aria-valuenow",String(m)); rail.setAttribute("aria-valuetext",tlText(clock)); }
  /* the chosen chapter's or tour stop's place on the axis */
  var sm=document.getElementById("spinemark");
  if(sm){ var c=(chapter&&typeof chapterById==="function")?chapterById(chapter):null, st=(tourStep>=0)?TOUR[tourStep]:null, t2=c?chapterClock(c):(st?stopClock(st):null);
    sm.hidden=(t2===null); if(t2!==null){ sm.style.left=tlPc(t2)+"%"; sm.title=c?"The chapter \u201c"+c.n+"\u201d, at "+fmtClock(t2):"Tour stop "+(tourStep+1)+", at "+fmtClock(t2); } }
  /* the theme's other moments, marked on the timeline (section C.2): its events' markers and its phases' ticks */
  var ms=c?c.moments.map(momentOf):[], evIn={}, phIn={};
  ms.forEach(function(m){ if(!m) return; if(m.kind==="ev") evIn[m.id]=1; else phIn[m.id]=1; });
  for(var q3=0;q3<_evTicks.length;q3++){ var on3=!!evIn[_evTicks[q3].e.id]; if(_evTicks[q3].el.classList.contains("inth")!==on3) _evTicks[q3].el.classList.toggle("inth",on3); }
  var stepsT=document.querySelectorAll("#phases .step");
  for(var q4=0;q4<stepsT.length;q4++){ var on4=!!phIn[q4]; if(stepsT[q4].classList.contains("inth")!==on4) stepsT[q4].classList.toggle("inth",on4); }
}
function paintChanges(phIdx){
  var host=document.getElementById("d-changes");
  if(!host) return;
  var items=[];
  Object.keys(FORMATIONS).forEach(function(id){
    var f=FORMATIONS[id];
    var e=f.track && f.track[phIdx];
    if(!e) return;
    var txt=e.act || (e.st&&STATUS[e.st]?FORMATIONS[id].name+" "+STATUS[e.st].label.toLowerCase():null);
    if(!txt) return;
    var an=anchorList(id).filter(function(q){ return q.ph===phIdx; })[0];
    if(an&&an.w&&an.w[0]>PHASES[phIdx].t0) txt="From "+fmtClock(an.w[0])+": "+txt;   /* a dated move that begins later in the phase */
    items.push({id:id,txt:txt,rank:e.act?0:1});
  });
  if(!items.length){ host.innerHTML=""; return; }
  items.sort(function(a,b){ return a.rank-b.rank; });
  items=items.slice(0,7);
  host.innerHTML='<h4>WHAT CHANGED AT '+esc(PHASES[phIdx].clock.split(" ")[0])+'</h4><ul>'+
    items.map(function(it){
      return '<li><i style="background:'+NATION[FORMATIONS[it.id].nation].fill+'"></i>'+
             '<span>'+esc(it.txt)+'</span></li>';
    }).join("")+'</ul>';
}
function paintDispatch(ph){
  document.getElementById("d-clock").textContent=ph.clock;
  document.getElementById("d-title").textContent=ph.title;
  document.getElementById("d-lede").textContent=ph.lede;
  var ev=document.getElementById("d-events");
  ev.innerHTML="";
  (ph.events||[]).forEach(function(e2){
    var li=el("li",null,'<b>'+esc(e2[0])+'</b><span>'+esc(e2[1])+'</span>');
    ev.appendChild(li);
  });
  paintChanges(ph.id);
  /* Stage 3B: one polite announcement per phase change, whichever tab is shown (the dispatch itself is no longer a live
     region: in a hidden tab it would not be read) */
  var lv=document.getElementById("live-phase"); if(lv){ lv.textContent=ph.clock+". "+actOf(ph.id).n+": "+ph.title+"."; PHASE_SAID++; }
}

/* ---- a formation's text during a delayed move (owner decision 46) ----
   An anchor whose move is dated to begin after its phase opens (tm.dep) is still held at the previous position when
   the phase starts. Until it moves, its act and status are the previous anchor's, and the dossier says when the dated
   move begins. Presentation only: the model (stateAt, aggStatus, the tracks) is unchanged. */
function waitingFor(id,t){
  var f=FORMATIONS[id]; if(!f||!f.track) return null;
  var L=legAt(id,t), ph=phaseAt(t);
  if(L&&L.b&&L.w&&L.b.ph===ph&&t<L.w[0]&&L.w[0]>PHASES[ph].t0) return L.b;
  return null;
}
function textPhase(id,t){ return waitingFor(id,t)?phaseAt(t)-1:phaseAt(t); }
function liveStatus(id,ph){
  if(ph!==phaseAt(clock)) return aggStatus(id,ph);
  var f=FORMATIONS[id];
  if(f.track){ var s=stateAt(id,textPhase(id,clock)); return s?s.st:null; }
  var counts={},best=null,bn=0;
  leavesOf(id,[]).forEach(function(k){
    var s2=stateAt(k,textPhase(k,clock)); if(!s2||!s2.st) return;
    counts[s2.st]=(counts[s2.st]||0)+1;
    if(counts[s2.st]>bn){ bn=counts[s2.st]; best=s2.st; }
  });
  return best;
}
/* the explicit timing that governs a formation now: the leg in progress or awaited, or the anchor reached this phase */
function timingNow(id){
  var f=FORMATIONS[id]; if(!f||!f.track) return null;
  var L=legAt(id,clock);
  if(!L) return null;
  if(L.b&&L.b.tm) return L.b;
  if(!L.b&&L.a.tm&&L.a.ph===curPhase) return L.a;
  return null;
}
var TIMING_TEXT={A:"Timing dated in a cited source.",
                 B:"Timing given as approximate in this reconstruction's narrative, which cites no source for it.",
                 C:"Timing inferred from the narrative (a bound, a sequence or a range), applied to this move."};
function drawerKey(){
  if(!selection||selection.kind!=="f") return "";
  return leavesOf(selection.id,[]).map(function(k){ var L=legAt(k,clock); return textPhase(k,clock)+(L&&L.b&&L.u>0&&L.u<1?"m":"s"); }).join(",");
}
var _drawerKey="";
var CONF_INTERP="The formation is between two plotted anchors: this position is interpolated, and graded no better than the weaker anchor.";
var CONF_TEXT={A:"Position documented in the sources.",
               B:"Sector documented; the frontage shown is an approximation.",
               C:"Reconstructed from the narrative — treat as indicative only."};

function paintDrawer(){ _drawerKey=drawerKey(); paintDrawerBody(); syncSelChip(); }
function paintDrawerBody(){
  var dr=document.getElementById("drawer");
  if(!selection){ dr.classList.remove("on"); document.body.classList.remove("drawer-open"); return; }
  dr.classList.add("on");
  document.body.classList.add("drawer-open");
  var body=document.getElementById("drawer-body");
  body.innerHTML="";
  if(selection.kind==="f") body.appendChild(dossierExpanded?dossierFormation(selection.id):compactCard(selection.id));
  else if(selection.kind==="e") body.appendChild(dossierEvent(selection.id));
  else if(selection.kind==="a") body.appendChild(dossierAnalysis(selection.id));
  else body.appendChild(dossierFeature(selection.id));
}

function row(k,v){ return '<div class="kv"><dt>'+esc(k)+'</dt><dd>'+v+'</dd></div>'; }

function outcomeOf(id){
  var f=FORMATIONS[id];
  if(!f.track) return null;
  var ks=Object.keys(f.track).map(Number).sort(function(a,b){return b-a;});
  for(var i=0;i<ks.length;i++){
    var e=f.track[ks[i]];
    if(e.act) return {ph:ks[i],act:e.act,st:e.st};
    if(e.p===null) return {ph:ks[i],act:"No longer on the field as a formation.",st:e.st};
  }
  return null;
}
function claimOf(id,cf){
  var f=FORMATIONS[id];
  var explicit=null;
  if(f.track){
    for(var i=0;i<=curPhase;i++){ var e=f.track[i]; if(e&&e.claim) explicit=e.claim; }
  }
  return explicit || CLAIM_FROM_CONF[cf] || "est";
}
var dossierExpanded=false;
function compactCard(id){
  var f=FORMATIONS[id];
  var st=liveStatus(id,curPhase), cf=aggConf(id,curPhase), cl=claimOf(id,cf);
  var s2=f.track?stateAt(id,textPhase(id,clock)):null, wt=f.track?waitingFor(id,clock):null, tmg=timingNow(id);
  var pos=posNow(id), nat=NATION[f.nation];
  var wrap=el("div","dossier card-compact");
  var head=el("div","dh");
  head.innerHTML='<div class="dh-bar" style="background:'+nat.fill+'"></div><div class="dh-tx">'+
    '<p class="dh-sub">'+esc(f.desig||"")+' &middot; '+esc(nat.name)+'</p>'+
    '<h2>'+esc(f.name)+'</h2><p class="dh-cmd">'+esc(f.commander||"")+'</p></div>';
  wrap.appendChild(head);
  var pills='';
  if(st) pills+=statusPill(st);
  pills+=claimPill(cl);
  pills+='<span class="pill ghost">Position '+esc(cf)+(aggInterp(id,curPhase)?' &middot; interpolated':'')+'</span>';
  if(tmg) pills+='<span class="pill ghost">Timing '+esc(tmg.tm.gr)+'</span>';
  wrap.appendChild(el("div","pillrow",pills));
  var str=f.strength||aggStrength(id);
  var body='';
  if(f.army) body+=row("Army total", esc(f.army.men)+", "+f.army.guns+" guns <span class=\"hh\">("+esc(f.army.src)+")</span>");
  else if(f.strengthRange) body+=row("Strength","&asymp; "+f.strengthRange[0].toLocaleString()+"&ndash;"+f.strengthRange[1].toLocaleString()+" men <span class=\"hh\">(working figure "+str.toLocaleString()+")</span>"+(f.guns?", "+f.guns+" guns":""));
  else if(str) body+=row("Strength","&asymp; "+str.toLocaleString()+" men"+(f.guns?", "+f.guns+" guns":""));
  if(f.parent){
    var pf=FORMATIONS[f.parent];
    body+=row("Under", esc(shortCommander(pf))+" &middot; "+esc(pf.name));
  }
  if(s2&&s2.act) body+=row("Doing now", esc(s2.act));
  if(wt&&f.track[wt.ph].act) body+=row("From "+esc(fmtClock(wt.w[0])), esc(f.track[wt.ph].act));
  if(s2&&s2.obj) body+=row("Objective", esc(s2.obj));
  body+=row("Where", pos? esc(nearestFeature(pos)) : "Not on the field at this hour");
  wrap.appendChild(el("dl","kvs",body));
  var mb=el("button","more-btn","Full dossier: role, movement, sources");
  mb.addEventListener("click",function(){ dossierExpanded=true; paintDrawer(); });
  wrap.appendChild(mb);
  return wrap;
}
function dossierFormation(id){
  var f=FORMATIONS[id];
  var isAgg=!f.track;
  var s=f.track?stateAt(id,textPhase(id,clock)):null, wt=f.track?waitingFor(id,clock):null, tmg=timingNow(id);
  var st=liveStatus(id,curPhase), cf=aggConf(id,curPhase);
  var pos=posNow(id);
  var wrap=el("div","dossier");
  var nat=NATION[f.nation];

  var head=el("div","dh");
  head.innerHTML=
    '<div class="dh-bar" style="background:'+nat.fill+'"></div>'+
    '<div class="dh-tx"><p class="dh-sub">'+esc(f.desig||"")+' &middot; '+esc(nat.name)+'</p>'+
    '<h2>'+esc(f.name)+'</h2>'+
    '<p class="dh-cmd">'+esc(f.commander||"")+'</p></div>';
  wrap.appendChild(head);

  var pills='';
  if(st) pills+=statusPill(st);
  var cl=claimOf(id,cf);
  pills+=claimPill(cl);
  pills+='<span class="pill ghost">Position '+esc(cf)+(aggInterp(id,curPhase)?' &middot; interpolated':'')+'</span>';
  if(tmg) pills+='<span class="pill ghost">Timing '+esc(tmg.tm.gr)+'</span>';
  if(commandView!=="none"){
    var kn=knowledgeOf(id);
    var KL={own:"Own troops",seen:"In sight",uncertain:"Reported only",unknown:"Not known"};
    if(KL[kn]) pills+='<span class="pill ghost">'+esc(KL[kn])+'</span>';
  }
  wrap.appendChild(el("div","pillrow",pills));

  /* WHO */
  var who=row("Commander", esc(f.commander||"—"));
  if(f.staff) who+=row("Composition", esc(f.staff));
  if(f.parent) who+=row("Higher formation",
    '<button class="linkb" data-goto="'+esc(f.parent)+'">'+esc(FORMATIONS[f.parent].name)+'</button>');
  who+=row("Arm", esc({inf:"Infantry",cav:"Cavalry",art:"Artillery",mixed:"Infantry and cavalry",
                       hq:"Headquarters",guard:"Guard infantry"}[f.arm]||f.arm));
  who+=row("Echelon", esc({army:"Army / headquarters",corps:"Corps or column",div:"Division",bde:"Brigade or detachment"}[f.ech]||f.ech));
  wrap.appendChild(sect("Who",who,true,"record"));

  /* HOW MANY */
  var str=f.strength||aggStrength(id);
  var many = str ? row("Approximate strength","&asymp; "+str.toLocaleString()+" men") : row("Strength","Not recorded");
  if(f.guns) many+=row("Guns", esc(String(f.guns)));
  if(f.strengthNote) many+=row("On the figures", esc(f.strengthNote));
  wrap.appendChild(sect("How many",many,true,"record"));

  /* WHERE, and how fast it is moving */
  var absent = f.track ? (notYetAt(id,clock) ? "Not yet on the field in this reconstruction"
                                             : "No longer on the field") : "\u2014";
  var whr=row("Position at "+esc(fmtClock(clock)), pos? esc(nearestFeature(pos)) : esc(absent));
  var mr=f.track?marchRate(id,clock):null;
  if(mr){
    whr+=row(mr.moving?"Marching":"Next move",
      mr.km.toFixed(1)+" km in "+Math.round(mr.min)+" min &middot; "+mr.kmh.toFixed(1)+" km/h"+
      (mr.ice?' <span class="hh">over the frozen mere</span>':''));
  }
  if(tmg){
    var tw=tmg.w, tt=tmg.tm;
    whr+=row("Timing", (tw[0]<clock&&tw[1]<=clock?"Reached ":"Moves ")+esc(fmtClock(tw[0]))+"&ndash;"+esc(fmtClock(tw[1]))+
      (tmg.arrDerived?' <span class="hh">(arrival derived: '+esc(arrivalRuleText(tmg))+')</span>':'')+
      " &middot; grade "+esc(tt.gr)+" &middot; "+esc(tt.basis));
    whr+=row("Dated by", tt.ev.map(function(q){ return "&ldquo;"+esc(q)+"&rdquo;"; }).join("; ")+'<br><span class="hh">'+esc(tt.note)+'</span>');
  }
  wrap.appendChild(sect("Where",whr,true,"recon"));

  /* WHEN and WHAT */
  if(f.track){
    var tp=textPhase(id,clock);
    var prev=tp>0?stateAt(id,tp-1):null;
    var nx=wt?{i:curPhase,act:f.track[wt.ph].act||"Moves to its next position.",from:wt.w[0]}:nextChange(id,curPhase);
    var h='<ol class="tl">';
    h+='<li class="past"><b>'+(prev&&prev.act?esc(PHASES[Math.max(0,tp-1)].clock):"—")+'</b><span>'+
        (prev&&prev.act?esc(prev.act):"No earlier action recorded.")+'</span></li>';
    h+='<li class="now"><b>'+esc(PHASES[curPhase].clock)+'</b><span>'+
        (s&&s.act?esc(s.act):"Position unchanged.")+
        (s&&s.act&&s.actPhase<curPhase?' <i>(continuing from '+esc(PHASES[s.actPhase].clock)+')</i>':'')+'</span></li>';
    h+='<li class="next"><b>'+(nx?(nx.from!==undefined?"From "+esc(fmtClock(nx.from)):esc(PHASES[nx.i].clock)):"—")+'</b><span>'+
        (nx?esc(nx.act):"No further change recorded in this reconstruction.")+'</span></li>';
    h+='</ol>';
    wrap.appendChild(sect("What it was doing",h,false,"recon"));
  }

  /* WHY */
  var why='';
  if(s&&s.obj) why+=row("Objective", esc(s.obj));
  if(f.role) why+=row("Role in the battle", esc(f.role));
  if(why) wrap.appendChild(sect("Why it was there",why,true,"record"));

  /* the event it is part of at this moment */
  var mine=liveEvents(clock).filter(function(x){ return x.e.forms.indexOf(id)>=0; });
  if(mine.length){
    var se=el("div","sect");
    se.innerHTML='<h3>Historical event</h3>';
    var ule=el("ul","links");
    mine.slice(0,3).forEach(function(x){
      var li=el("li");
      var b=el("button","linkb",esc(x.e.n));
      b.addEventListener("click",function(){ select("e",x.e.id); });
      li.appendChild(b); ule.appendChild(li);
    });
    se.appendChild(ule); wrap.appendChild(se);
  }

  /* OUTCOME */
  var oc=f.track?outcomeOf(id):null;
  if(oc) wrap.appendChild(sect("What became of it",
    '<p class="prose">'+esc(oc.act)+'</p><p class="hh">Last recorded at '+esc(PHASES[oc.ph].clock)+'</p>',false));

  /* subordinates */
  if(f.children&&f.children.length){
    var ul=el("ul","links");
    f.children.forEach(function(k){
      var li=el("li");
      var b=el("button","linkb",esc(FORMATIONS[k].name));
      b.addEventListener("click",function(){ select("f",k); focusOn(k); });
      li.appendChild(b); ul.appendChild(li);
    });
    var sc=sect("Subordinate formations","",false);
    sc.appendChild(ul);
    wrap.appendChild(sc);
  }

  if(f.note) wrap.appendChild(el("p","note",esc(f.note)));
  wrap.appendChild(el("p","conf",esc(CLAIM[cl].note)+" "+esc(CONF_TEXT[cf]||"")+(aggInterp(id,curPhase)?" "+esc(CONF_INTERP):"")+(tmg?" "+esc(TIMING_TEXT[tmg.tm.gr]||""):"")));

  var act=el("div","dact");
  var btn=el("button","t","Centre the map here");
  btn.addEventListener("click",function(){ focusOn(id); });
  act.appendChild(btn);
  wrap.appendChild(act);

  wrap.querySelectorAll("[data-goto]").forEach(function(b){
    b.addEventListener("click",function(){ select("f",b.dataset.goto); focusOn(b.dataset.goto); });
  });
  return wrap;
}
var LAYER_TAG={record:"record",recon:"reconstruction",derived:"derived"};
/* status and claim as neutral plates: the icon and the words carry them, never hue (decisions 3 and 10) */
function statusPill(st){ var t=STATUS[st].tone, ic=TOKENS.sym.status[t];
  return '<span class="pill st-'+t+'">'+iconSVG(ic.icon)+esc(STATUS[st].label)+'</span>'; }
function claimPill(cl){ return '<span class="pill claim-'+cl+'">'+iconSVG(TOKENS.sym.claim[cl])+esc(CLAIM[cl].label)+'</span>'; }
function sect(title,html,isDl,layer){
  var d=el("div","sect");
  d.innerHTML='<h3>'+esc(title)+(layer?' <span class="ltag '+layer+'">'+iconSVG(TOKENS.sym.layer[layer])+esc(LAYER_TAG[layer])+'</span>':'')+'</h3>'+
    (isDl?'<dl class="kvs">'+html+'</dl>':html);
  return d;
}
function nextChange(id,ph){
  var f=FORMATIONS[id]; if(!f.track) return null;
  for(var i=ph+1;i<PHASES.length;i++){
    if(f.track[i]&&f.track[i].act) return {i:i,act:f.track[i].act};
    if(f.track[i]&&f.track[i].p===null) return {i:i,act:"No longer on the field as a formation."};
  }
  return null;
}
function nearestFeature(p){
  var best=null,bd=1e9;
  FEATURES.forEach(function(ft){
    var d=Math.hypot(ft.p[0]-p[0],ft.p[1]-p[1]);
    if(d<bd){ bd=d; best=ft; }
  });
  if(!best) return "—";
  var km=GEOREF.kmBetween(best.p,p);
  if(km<0.5) return best.name;
  return km.toFixed(1)+" km "+GEOREF.compass8(GEOREF.bearingDeg(best.p,p))+" of "+best.name;   /* true bearing, not map axes */
}

/* features that are surveyed places in GEOREF.GT */
var FEATURE_GT={pratzeberg:"pratzeberg",vinohrady:"vinohrady",santon:"santon",zuran:"zuran",telnitz:"telnitz",
  sokolnitz:"sokolnitz",kobelnitz:"kobelnitz",pratzenv:"pratzen",puntowitz:"puntowitz",girzikowitz:"girzikowitz",
  blasowitz:"blasowitz",augezd:"augezd",krzenowitz:"krzenowitz",austerlitz:"austerlitz",chapel:"chapel",posthouse:"posthouse"};
function dossierFeature(id){
  var ft=null; FEATURES.forEach(function(x){ if(x.id===id) ft=x; });
  var wrap=el("div","dossier");
  if(!ft) return wrap;
  var kindName={height:"High ground",water:"Watercourse or mere",village:"Village",town:"Town",road:"Road"}[ft.kind]||ft.kind;
  var head=el("div","dh");
  head.innerHTML='<div class="dh-bar" style="background:var(--text-muted)"></div><div class="dh-tx">'+
    '<p class="dh-sub">'+esc(kindName)+'</p><h2>'+esc(ft.name)+'</h2>'+
    '<p class="dh-cmd">'+esc(ft.sub||"")+'</p></div>';
  wrap.appendChild(head);
  /* heights in metres through GEOREF, the only vertical scale; where the feature is a surveyed
     place its surveyed height is quoted beside the model's (GEOREF.GT, GEOREF.ELEV_SRC) */
  var elM=GEOREF.elevM(hAt(ft.p[0],ft.p[1])), gtk=FEATURE_GT[ft.id], gt=gtk&&GEOREF.GT[gtk];
  var surveyed = (gt&&gt.elev) ? "; surveyed "+gt.elev+" m"+(GEOREF.ELEV_SRC[gtk]?' <span class="hh">('+esc(GEOREF.ELEV_SRC[gtk])+')</span>':"")
               : (gtk&&GEOREF.ELEV_SRC[gtk]) ? '; surveyed <span class="hh">'+esc(GEOREF.ELEV_SRC[gtk])+'</span>' : "";
  var facts=row("Elevation on this model", "\u2248 "+Math.round(elM)+" m at the marker"+surveyed+
    ' <span class="hh">(relief drawn \u00d7'+geoText("{EXAG}")+' vertically)</span>');
  (ft.facts||[]).forEach(function(k){ facts+=row(k[0],esc(k[1])); });
  wrap.appendChild(el("dl","kvs",facts));
  if(ft.why&&ft.why.length){
    var s=el("div","sect");
    s.innerHTML='<h3>Operational importance</h3><ul class="bul">'+
      ft.why.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>';
    wrap.appendChild(s);
  }
  if(ft.story){
    var s2=el("div","sect");
    s2.innerHTML='<h3>What happened here</h3><p class="prose">'+esc(ft.story)+'</p>';
    wrap.appendChild(s2);
  }
  var here=[];
  Object.keys(units).forEach(function(uid){
    var pp=posNow(uid);
    if(pp&&Math.hypot(pp[0]-ft.p[0],pp[1]-ft.p[1])<34) here.push(uid);
  });
  if(here.length){
    var s3=el("div","sect");
    s3.innerHTML='<h3>Formations nearby now</h3>';
    var ul=el("ul","links");
    here.forEach(function(uid){
      var li=el("li");
      var b=el("button","linkb",esc(FORMATIONS[uid].name));
      b.addEventListener("click",function(){ select("f",uid); });
      li.appendChild(b); ul.appendChild(li);
    });
    s3.appendChild(ul); wrap.appendChild(s3);
  }
  var act=el("div","dact");
  var btn=el("button","t","Centre the map here");
  btn.addEventListener("click",function(){ centreOnMap(ft.p,82); });
  act.appendChild(btn);
  var isHere = vsOrigin && vsOrigin[0]===ft.p[0] && vsOrigin[1]===ft.p[1];
  var vb=el("button","t", isHere?"Clear the sightlines":"What can be seen from here");
  vb.addEventListener("click",function(){
    if(isHere) clearViewshed();
    else computeViewshed(ft.p, EYE_OBSERVER_M);   /* metres */
    paintDrawer(); syncViewBadge();
  });
  act.appendChild(vb);
  wrap.appendChild(act);
  wrap.appendChild(el("p","conf",
    "Sightlines are computed from this model's elevations, not the real survey, and take no account of woods, buildings or smoke."));
  return wrap;
}
function syncViewBadge(){
  var b=document.getElementById("vsbadge");
  if(!b) return;
  b.style.display=vsOrigin?"flex":"none";
  var nm="";
  FEATURES.forEach(function(f){ if(vsOrigin&&f.p[0]===vsOrigin[0]&&f.p[1]===vsOrigin[1]) nm=f.name; });
  var t=document.getElementById("vsname");
  if(t) t.textContent=nm||"selected point";
}

function dossierEvent(eid){
  var e=null; EVENTS.forEach(function(x){ if(x.id===eid) e=x; });
  var wrap=el("div","dossier");
  if(!e) return wrap;
  var w=evWindow(e), exact=(w[0]===w[1]);
  var col = e.side==="fr" ? "var(--side-fr)" : "var(--side-al)";     /* the side, not a nation */
  var KIND={decision:"Command decision",attack:"Attack",capture:"Position taken",
            arrival:"Reinforcement",engagement:"Engagement",movement:"Movement",
            withdrawal:"Withdrawal",collapse:"Collapse"};
  var head=el("div","dh");
  head.innerHTML='<div class="dh-bar" style="background:'+col+'"></div><div class="dh-tx">'+
    '<p class="dh-sub">'+esc(KIND[e.kind]||e.kind)+' &middot; '+
      (e.side==="fr"?"French":"Allied")+'</p><h2>'+esc(e.n)+'</h2>'+
    '<p class="dh-cmd">'+esc(exact?("about "+fmtClock(w[0])):(fmtClock(w[0])+" to "+fmtClock(w[1])))+'</p></div>';
  wrap.appendChild(head);
  wrap.appendChild(el("div","pillrow",
    claimPill(e.claim)+
    '<span class="pill ghost">Timing '+esc(e.cf)+'</span>'+
    (exact?'':'<span class="pill ghost">Interval, not a timestamp</span>')));
  var s2=el("div","sect");
  s2.innerHTML='<h3>Why it matters</h3><p class="ev-why">'+esc(e.why)+'</p>';
  wrap.appendChild(s2);
  if(e.forms.length){
    var s3=el("div","sect");
    s3.innerHTML='<h3>Formations concerned</h3>';
    var ul=el("ul","links");
    e.forms.forEach(function(fid){
      if(!FORMATIONS[fid]) return;
      var li=el("li");
      var b=el("button","linkb",esc(FORMATIONS[fid].name));
      b.addEventListener("click",function(){ select("f",fid); focusOn(fid); });
      li.appendChild(b); ul.appendChild(li);
    });
    s3.appendChild(ul); wrap.appendChild(s3);
  }
  wrap.appendChild(el("p","conf",esc(CLAIM[e.claim].note)+
    (exact?"":" The hour is not fixed in the sources, so this is shown as an interval rather than a timestamp.")));
  var act=el("div","dact");
  var b1=el("button","t","Go to this moment");
  b1.addEventListener("click",function(){ stopPlay(); setClock((w[0]+w[1])/2); centreOnMap(e.p,96); });
  act.appendChild(b1);
  wrap.appendChild(act);
  return wrap;
}
function dossierAnalysis(name){
  var tl=null; TERRAIN_LINES.forEach(function(x){ if(x.n===name) tl=x; });
  var wrap=el("div","dossier");
  if(!tl) return wrap;
  var kind={ridge:"Ridge line",scarp:"Escarpment",valley:"Valley floor",
            defile:"Defile",dead:"Dead ground"}[tl.t];
  var col=TOKENS.sym.analysis[tl.t].line;
  var head=el("div","dh");
  head.innerHTML='<div class="dh-bar" style="background:'+col+'"></div><div class="dh-tx">'+
    '<p class="dh-sub">Terrain analysis</p><h2>'+esc(tl.n)+'</h2>'+
    '<p class="dh-cmd">'+esc(kind)+'</p></div>';
  wrap.appendChild(head);
  var hs=tl.p.map(function(q){ return hAt(q[0],q[1]); });
  var lo=Math.min.apply(null,hs), hi=Math.max.apply(null,hs);
  var len=0;
  for(var i=0;i<tl.p.length-1;i++) len+=Math.hypot(tl.p[i+1][0]-tl.p[i][0],tl.p[i+1][1]-tl.p[i][1]);
  wrap.appendChild(el("dl","kvs",
    row("Length","about "+(len*0.5/UNITS_PER_KM).toFixed(1)+" km")+
    row("Elevation along it","\u2248 "+Math.round(GEOREF.elevM(lo))+"\u2013"+Math.round(GEOREF.elevM(hi))+" m on this model")));
  var s2=el("div","sect");
  s2.innerHTML='<h3>Why it matters</h3><p class="prose">'+esc(tl.note)+'</p>';
  wrap.appendChild(s2);
  var act=el("div","dact");
  var b1=el("button","t","Centre the map here");
  b1.addEventListener("click",function(){ centreOnMap(tl.p[Math.floor(tl.p.length/2)],92); });
  act.appendChild(b1);
  wrap.appendChild(act);
  return wrap;
}

/* The rose points to true north as seen from the current camera: the map frame
   is rotated GEOREF.ROT_DEG from north, and the camera orbits freely. */
var _rose=null, _rA=new THREE.Vector3(), _rB=new THREE.Vector3();
function updateRose(){
  if(!_rose){ _rose=document.getElementById("rose-needle");
    var cv=document.getElementById("contour-val"); if(cv) cv.innerHTML="&asymp; "+geoText("{CONTOUR_M}")+" m"; }
  if(!_rose||!camera) return;
  _rA.copy(orbitTarget); _rB.set(orbitTarget.x+GEOREF.NORTH[0]*20, orbitTarget.y, orbitTarget.z+GEOREF.NORTH[1]*20);
  _rA.project(camera); _rB.project(camera);
  var ang=Math.atan2(_rB.x-_rA.x, _rB.y-_rA.y)*180/Math.PI;
  _rose.setAttribute("transform","rotate("+ang.toFixed(1)+" 30 30)");
}
function updateScaleBar(){
  var box=document.getElementById("scalebar");
  var bar=document.getElementById("sb-fill"), lab=document.getElementById("sb-label");
  if(!box||!bar||!lab) return;
  var k=pxPerWorld(orbitTarget)*UNITS_PER_KM;
  var choices=[0.25,0.5,1,2,5,10], pick=1;
  for(var i=0;i<choices.length;i++){
    var w=choices[i]*k;
    if(w>=62&&w<=170){ pick=choices[i]; break; }
    if(w<62) pick=choices[i];
  }
  var px=Math.round(pick*k);
  if(px<10||px>400){ box.style.opacity="0"; return; }
  box.style.opacity="1";
  bar.style.width=px+"px";
  lab.textContent=(pick<1? (pick*1000)+" m" : pick+" km");
}

/* numbers in prose that depend on the map's scale are filled in from GEO, never typed */
/* how a derived arrival was reached (anchorList): the tactical rate is a design value, never history */
function arrivalRuleText(b){
  if(b.arrRule==="moveMin") return "its "+b.moveMin+"-minute march";
  if(b.arrRule==="tactical") return "tactical rate, a design value";
  return "the march-rate ceiling"+(b.arrFlag?"; flagged: "+b.arrFlag:"");
}
/* every derived arrival in the model, with its rule (the sources sheet lists them) */
function derivedArrivals(){
  var out=[];
  Object.keys(FORMATIONS).forEach(function(id){ if(!FORMATIONS[id].track) return;
    anchorList(id).forEach(function(b){ if(b.arrDerived) out.push({id:id,ph:b.ph,b:b}); }); });
  return out;
}
/* what the sources sheet says about the movement arrows: the rule, and what every other arrow is */
function arrowNotes(){
  var n=0, d=0, k={}, uns=[];
  Object.keys(OVERLAYS).forEach(function(ph){ (OVERLAYS[ph].arrows||[]).forEach(function(a){ n++;
    if(a.leg){ d++; return; } var kind=String(a.interp).split(":")[0]; k[kind]=(k[kind]||0)+1;
    if(kind==="unsettled") uns.push(a.label+" ("+PHASES[ph].clock+")"); }); });
  return ["An arrow drawn for a phase shows the movement the model makes during that phase. "+d+" of the "+n+" arrows are drawn from the formation's own modelled route, so their ends are its modelled positions; they move with the model.",
    "The others are interpretive and marked as such in the data: "+(k.route||0)+" ordered routes (dashed), "+(k.objective||0)+" that point at a place or objective rather than a modelled position, "+
      (k.group||0)+" that stand for several formations, "+(k.unmodelled||0)+" for bodies the map does not track, and "+(k.halt||0)+" halt bar, a column stopped short of its objective.",
    "Hand-authored, because this map's own texts disagree about the hour and the sources have not been checked: "+uns.join("; ")+"."];
}
/* Stage 4B (docs/STAGE4_SPEC.md section A.5; decisions 68-71): how the light is drawn, a presentation note of the sources sheet
   (not SOURCE_NOTE): derived from astronomy and the app's clock, with what it is not */
function lightNotes(){
  var hm=fmtClock, rise=null, set=null; for(var t=T_MIN;t<=T_MAX;t+=1){ var g=SUN_DAY.at(t).geo>-0.833; if(g&&rise===null) rise=t; if(!g&&rise!==null&&set===null) set=t; }
  return ["The sun is computed, not recorded: its position over the field on 2 December 1805, with the map's clock read as local solar time "+
      "(the sun due south at 12:00). On that reading it rises at "+hm(rise)+" and sets at "+hm(set)+", and is never more than "+Math.round(SUN_DAY.noonAlt)+
      " degrees above the horizon. Which time the sources' hours keep is not established; local mean time would move every sun event about 10 minutes earlier.",
    "The relief is drawn exaggerated, so the light is steepened by the same factor: the ground's lit and shaded sides, and its shadows, are those the true "+
      "ground would have under the true sun. The sun's disc stands at its true height, so where the relief is exaggerated the light seems to come from higher than the disc.",
    "Before dawn the field is lit by a design light, not by a moon; nothing about the night's sky is claimed. The weather of the day (the fog in the valley, "+
      "the sun on the heights at about 08:45) is the narrative's, as the phases' texts give it; this reconstruction cites no source for it.",
    "The valley fog is drawn from the narrative: in the Goldbach valley until about 08:45, off the heights first. Its top is drawn at "+Math.round(ATMO.FOG_TOP)+
      " m, the height below which the Command view treats ground as fogged while the mist lies; its depth and its lifting are modelled, not recorded, "+
      "and it is drawn see-through so the formations in it stay visible. The thin mist drawn in the late afternoon is modelled too: no text mentions it.",
    "The haze that softens what lies behind the place in view is a depth cue, the same at every zoom; the day's visibility is not recorded in this reconstruction."];
}
function geoText(p){
  /* {EXAG} is the DISPLAY factor relative to true scale (decision 35), never GEOREF.EXAG, the model's own scale */
  return String(p).replace(/\{EXAG\}/g,fmtFactor(DISPLAY.factor)).replace(/\{M_PER_UNIT\}/g,(GEOREF.KM_PER_MAP*1000).toFixed(0))
    .replace(/\{ROT\}/g,GEOREF.ROT_DEG.toFixed(0)).replace(/\{CONTOUR_M\}/g,(CONTOUR_INTERVAL*GEOREF.V_M_PER_UNIT).toFixed(0));
}
function openSources(){
  var m=document.getElementById("modal");
  var b=document.getElementById("modal-body");
  b.innerHTML='<h2>'+esc(SOURCE_NOTE.title)+'</h2>'+
    SOURCE_NOTE.body.map(function(p){return '<p>'+esc(geoText(p))+'</p>';}).join('')+
    '<h3>Three layers</h3><dl class="kvs">'+SOURCE_NOTE.layers.map(function(l){
      return '<div class="kv"><dt>'+esc(l[0])+'</dt><dd>'+esc(l[1])+'</dd></div>'; }).join('')+'</dl>'+
    '<h3>Confidence grades</h3><ul class="bul">'+
    '<li><b>A</b> — '+esc(CONF_TEXT.A)+'</li>'+
    '<li><b>B</b> — '+esc(CONF_TEXT.B)+'</li>'+
    '<li><b>C</b> — '+esc(CONF_TEXT.C)+'</li></ul>'+
    '<h3>Basis</h3><ul class="bul">'+SOURCE_NOTE.refs.map(function(r){return '<li>'+esc(r)+'</li>';}).join('')+'</ul>'+
    /* the display (decisions 19, 32, 35, 36): written by the app, so the guarded SOURCE_NOTE stays as it is */
    '<h3>How the ground and the symbols are drawn</h3><ul class="bul">'+
    '<li>'+esc(isTrueScale()?"The relief is drawn at true scale (1\u00d7). Formations are drawn as their modelled footprints; figures, standards, buildings and trees are not drawn."
      :"The relief is drawn "+fmtFactor(DISPLAY.factor)+" times its true height; 1\u00d7 is true scale. The setting is a view, not the model: heights in metres, sightlines and the going classes do not change with it.")+'</li>'+
    '<li>'+esc("Symbols stand on the ground at two named scales: figures and standards about 45\u201370 times life size, buildings and trees about 10\u201315 times.")+'</li>'+
    '<li>'+esc("The standards' pole-to-figure ratio (1.6) is provisional: a design rule chosen so that the colour clears the ranks, not a sourced ratio, to be replaced in Stage 6.")+'</li>'+
    '<li>'+esc("The going layer's slope classes (hard for guns over "+GOING_TRUE_DEG[0].toFixed(2)+"\u00b0, severe over "+GOING_TRUE_DEG[1].toFixed(2)+"\u00b0 of true slope) are unsourced design values, provisional until a data task sources or renames them.")+'</li></ul>'+
    /* the tactical rate (2C precondition, docs/STAGE2_SPEC.md section M.13): design values, stated as such */
    '<h3>Arrivals the map derives</h3><ul class="bul">'+
    '<li>'+esc("Where a move's start is dated and its arrival is not, the map derives the arrival. A formation in battle order moves at a tactical rate: infantry and Guard "+
      TACTICAL_RATE.inf.toFixed(1)+" km/h, cavalry "+TACTICAL_RATE.cav.toFixed(1)+", mixed "+TACTICAL_RATE.mixed.toFixed(1)+
      ". These rates are design values, not sourced, and are not historical rates. They are used only where the move still fits before the formation's next position; otherwise the move keeps the march-rate ceiling and is flagged.")+'</li>'+
    derivedArrivals().map(function(r){ var f=FORMATIONS[r.id];
      return '<li>'+esc(f.name+" ("+fmtClock(r.b.w[0])+"\u2013"+fmtClock(r.b.w[1])+"): "+arrivalRuleText(r.b)+".")+'</li>'; }).join('')+'</ul>'+
    /* Stage 2C: the arrows (decisions 33 and 37), counted from OVERLAYS */
    '<h3>How the arrows are drawn</h3><ul class="bul">'+arrowNotes().map(function(t){ return '<li>'+esc(t)+'</li>'; }).join('')+'</ul>'+
    '<h3>How the light is drawn</h3><ul class="bul">'+lightNotes().map(function(t){ return '<li>'+esc(t)+'</li>'; }).join('')+'</ul>';
  m.dataset.sources="1";
  m.classList.add("on");
}

function flash(msg){
  var t=document.getElementById("toast");
  t.textContent=msg; t.classList.add("on");
  setTimeout(function(){ t.classList.remove("on"); },3400);
}
function setProg(f){
  var b=document.getElementById("prog");
  if(b) b.style.transform="scaleX("+Math.max(0,Math.min(1,f))+")";
}
function stopPlay(){
  playing=false; dwellReset(); FOLLOW.T=null;
  var b=document.getElementById("play");
  if(b){ b.textContent="Play"; b.setAttribute("aria-pressed","false"); }
  paintExaggeration();
}
function togglePlay(){
  if(playing){ stopPlay(); return; }
  if(clock>=T_MAX-0.5) setClock(T_MIN,{force:true});
  playing=true; dwellReset(); FOLLOW.T=null; FOLLOW.ev=null;
  var b=document.getElementById("play");
  if(b){ b.textContent="Pause"; b.setAttribute("aria-pressed","true"); }
  paintExaggeration();
}
function setSpeed(x){
  speed=x;
  document.querySelectorAll(".spd-btn").forEach(function(b){
    b.setAttribute("aria-pressed", (+b.dataset.s===x)?"true":"false");
  });
}
function tickClock(dtMs){
  if(!playing) return;
  if(DWELL.expect!==null&&Math.abs(clock-DWELL.expect)>1e-9) dwellReset();   /* the clock was moved by other means */
  var nt=dwellAdvance(dtMs/1000,MIN_PER_SEC*speed);
  if(nt>=T_MAX){ setClock(T_MAX); stopPlay(); return; }
  setClock(nt); DWELL.expect=clock;
}
/* ---- Stage 4D: the dwell (docs/STAGE4_SPEC.md section D.3, item 2; owner decision 75) ----
   While the clock plays, at each event's start (the distinct start minutes of EVENTS) the clock eases down to a stop, holds
   DWELL.HOLD seconds with the event's marker lit and its name in the caption, and eases back to speed. Each ease covers d clock
   minutes in 2d/v seconds (v, the speed in clock minutes a second), so the clock's rate is continuous: d is a quarter second's
   travel at speed (DWELL.EASE = 0.5 s each way), less where two starts are closer than that (half the gap). A dwell adds
   HOLD + 2d/v seconds to the day (2.0 s where the ease is whole). The start the clock stands on when Play is pressed does not
   dwell. Scrubbing, the keys, the phase and act buttons, the tour and the themes stop the clock, and never dwell. It is time,
   not motion: it stays under reduced motion. The toggle (DWELL.on) is in the layers panel. */
var DWELL={on:true, HOLD:1.5, EASE:0.5, starts:null, next:0, st:null, expect:null};
function dwellStarts(){
  if(!DWELL.starts){ var o={}; EVENTS.forEach(function(e){ o[evWindow(e)[0]]=1; }); DWELL.starts=Object.keys(o).map(Number).sort(function(a,b){ return a-b; }); }
  return DWELL.starts;
}
function dwellReach(i,v){ var S=dwellStarts(), d=v*DWELL.EASE/2;
  if(i>0) d=Math.min(d,(S[i]-S[i-1])/2); if(i<S.length-1) d=Math.min(d,(S[i+1]-S[i])/2); return d; }
function dwellReset(){ var S=dwellStarts(), i=0; while(i<S.length&&S[i]<=clock+1e-9) i++; DWELL.next=i; DWELL.st=null; DWELL.expect=null; }
function dwellEvents(){ if(!DWELL.st) return null; var E=DWELL.st.E; return EVENTS.filter(function(e){ return evWindow(e)[0]===E; }); }
/* the clock after dt seconds at v clock minutes a second, through any dwell */
function dwellAdvance(dt,v){
  var c=clock, S=dwellStarts(), guard=0;
  while(dt>1e-9&&guard++<64){
    var st=DWELL.st;
    if(!st){
      if(!DWELL.on||DWELL.next>=S.length){ return c+dt*v; }
      var i=DWELL.next, E=S[i], d=dwellReach(i,v), z=E-d;
      if(c+dt*v<z){ return c+dt*v; }
      if(c<z){ dt-=(z-c)/v; c=z; }
      else { d=Math.max(1e-6,E-c); }   /* already inside the ease (a change of speed): ease from here */
      DWELL.st={E:E,d:d,te:2*d/v,stage:"in",tau:0}; continue;
    }
    var lim=st.stage==="hold"?DWELL.HOLD:st.te, step=Math.min(dt,lim-st.tau);
    st.tau+=step; dt-=step;
    var k=lim>0?st.tau/lim:1;
    if(st.stage==="in") c=st.E-st.d*(1-k)*(1-k);
    else if(st.stage==="hold") c=st.E;
    else c=st.E+st.d*k*k;
    if(st.tau>=lim-1e-9){
      if(st.stage==="in"){ st.stage="hold"; st.tau=0; c=st.E; }
      else if(st.stage==="hold"){ st.stage="out"; st.tau=0; }
      else { DWELL.st=null; DWELL.next++; c=st.E+st.d; }
    }
  }
  return c;
}
/* the length of the day's play in real seconds from t0 at speed x, with the dwells as built (the self-test's reference) */
function dwellDayLength(t0,x){
  var v=MIN_PER_SEC*x, S=dwellStarts(), L=(T_MAX-t0)/v;
  if(DWELL.on) for(var i=0;i<S.length;i++) if(S[i]>t0+1e-9&&S[i]<T_MAX) L+=DWELL.HOLD+2*dwellReach(i,v)/v;
  return L;
}
/* ---- Stage 4D: Follow while the clock plays (docs/STAGE4_SPEC.md sections D.2 and D.3, item 3; owner decision 78) ----
   With Follow on and the clock playing, the eye follows the action: its target eased toward the weighted centre of the live
   events (liveEvents, their own weights), its distance toward one that holds their spread (FOLLOW: 2.4 x their weighted radius
   + 130 units, in 230-300), its direction toward the current phase's authored view; eased in real time (time constant FOLLOW.TAU) and
   the target's move across the screen held to FOLLOW.CAP px a second at the free centre by slowing, never by a jump; every
   step through the floor (clampCamera). While playing the phase boundary's glide is not used; when the clock stops the view
   stays, and a phase or act button, a vantage, a theme or a tour stop glides to its view as before. Any pan, orbit, zoom or
   double-click turns Follow off (decision 47). Under reduced motion the eye moves only at each event's start, at once. On
   the paper map nothing follows (its plan shows the whole field). */
/* the distance: section D.2's candidate held 86-274 units (2.4 x the spread + 70); between about 140 and 200, where the map layer
   shows every brigade, its drops reached 19-20 over the day (the limit 19). 230-300 (2.4 x the spread + 130) keeps them at 11-12
   and every live event in the free rectangle in 92-93% of minutes (tools/stage4/report-4d.js): the action framed wider than
   most phase views (92-212 units in phases 1-8); a zoom turns Follow off for a closer look. */
var FOLLOW={TAU:1.5, CAP:150, K:2.4, D0:130, DMIN:230, DMAX:300, T:null, dist:0, dir:null, ev:null};
function followGoal(){
  var L=liveEvents(clock), sw=0, cx=0, cz=0, c=presetFrame(PHASES[curPhase].cam);
  var dir=new THREE.Vector3(c[0]-c[3],c[1]-c[4],c[2]-c[5]).normalize();
  L.forEach(function(o){ var w=W(o.e.p[0],o.e.p[1]); cx+=w[0]*o.w; cz+=w[1]*o.w; sw+=o.w; });
  if(!(sw>0)) return {T:null,dist:null,dir:dir};
  cx/=sw; cz/=sw; var rad=0;
  L.forEach(function(o){ var w=W(o.e.p[0],o.e.p[1]); rad+=o.w*Math.hypot(w[0]-cx,w[1]-cz); }); rad/=sw;
  return {T:new THREE.Vector3(cx,groundY(cx,cz),cz),dist:Math.max(FOLLOW.DMIN,Math.min(FOLLOW.DMAX,FOLLOW.K*rad+FOLLOW.D0)),dir:dir};
}
function followActive(){ return playing&&!freeCam&&mode!=="staff"&&!_tw.cam; }
function followStep(dtMs){
  if(!followActive()){ FOLLOW.T=null; return false; }
  var g=followGoal();
  if(!FOLLOW.T){ FOLLOW.T=orbitTarget.clone(); FOLLOW.dist=landCam.position.distanceTo(orbitTarget); FOLLOW.dir=landCam.position.clone().sub(orbitTarget).normalize(); }
  if(RM){   /* reduced motion: at each event start, at once (not when Play is pressed) */
    var S=dwellStarts(), j=-1; for(var i=0;i<S.length;i++) if(S[i]<=clock+1e-9) j=i;
    if(FOLLOW.ev===null){ FOLLOW.ev=j; return false; }
    if(j===FOLLOW.ev) return false;
    FOLLOW.ev=j; if(g.T){ FOLLOW.T.copy(g.T); FOLLOW.dist=g.dist; } FOLLOW.dir.copy(g.dir);
  } else {
    var a=1-Math.exp(-(dtMs/1000)/FOLLOW.TAU);
    if(g.T){ var mv=g.T.clone().sub(FOLLOW.T).multiplyScalar(a), cap=FOLLOW.CAP*(dtMs/1000)*worldPerPx(FOLLOW.T), ml=Math.hypot(mv.x,mv.z);
      if(ml>cap) mv.multiplyScalar(cap/ml);
      FOLLOW.T.add(mv); FOLLOW.dist+=(g.dist-FOLLOW.dist)*a; }
    FOLLOW.dir.lerp(g.dir,a).normalize();
  }
  FOLLOW.T.y=groundY(FOLLOW.T.x,FOLLOW.T.z);
  orbitTarget.copy(FOLLOW.T); landCam.position.copy(FOLLOW.T).addScaledVector(FOLLOW.dir,FOLLOW.dist); landCam.lookAt(orbitTarget);
  clampCamera(); curVantage=null;
  return true;
}
var presentation="study", hideDispatch=false;
var PRESENT={
  study:{cls:"pm-study", rail:true},
  watch:{cls:"pm-watch", rail:false},
  map:  {cls:"pm-map",   rail:false}
};
function setPresentation(m){
  closeFirst(null);
  if(!PRESENT[m]) m="study";
  presentation=m;
  var b=document.body;
  b.classList.remove("pm-study","pm-watch","pm-map");
  b.classList.add(PRESENT[m].cls);
  if(m!=="study"){ select(null,null); b.classList.add("rail-hidden"); }
  else if(window.innerWidth>=1080) b.classList.remove("rail-hidden");
  document.querySelectorAll(".vm-btn").forEach(function(x){
    x.setAttribute("aria-pressed", x.dataset.vm===m ? "true":"false");
  });

  cleanView=(m==="map");
  syncViewmode();
  syncVis();
  syncSelChip();
  if(typeof requestRender==="function") requestRender(2);
}
/* ---- Stage 3B: the docked layout (docs/STAGE3_SPEC.md section B.2; owner decisions 49, 54, 55, 58) ----
   From 1080 px wide (DOCK_MIN) the dispatch is the rail's first tab, "Now", and Study opens on it; the dossier opens in the
   rail's column (style.css, body.docked). Below 1080 px, where the rail starts hidden, the dispatch stays a card where it
   stood before (#dispatch-home) and the Now tab is hidden. While the first-run card is open the rail shows the order of
   battle, as before (the first run is Stage 7's); closing the card opens the Now tab unless a tab was chosen meanwhile. */
var DOCK_MIN=1080, docked=null, tabNow="now", tabChosen=false, PHASE_SAID=0;
function syncDock(){
  var want=window.innerWidth>=DOCK_MIN;
  if(want===docked) return;
  docked=want;
  var dp=document.querySelector(".dispatch"), pane=document.getElementById("now"), home=document.getElementById("dispatch-home");
  document.body.classList.toggle("docked",want);
  if(dp&&pane&&home&&home.parentNode&&home.parentNode.insertBefore){ if(want) pane.appendChild(dp); else home.parentNode.insertBefore(dp,home); }
  var nb=document.getElementById("tab-now"); if(nb) nb.hidden=!want;
  if(want&&presentation==="study") document.body.classList.remove("rail-hidden");
  if(!want&&tabNow==="now") selectTab("oob");
  else if(want&&!tabChosen&&!firstRunOpen) selectTab("now");
}
function selectTab(t,focus){
  var ok=false;
  document.querySelectorAll(".tab-btn").forEach(function(b){ var on=(b.dataset.t===t&&!b.hidden); if(on) ok=true;
    b.setAttribute("aria-selected",on?"true":"false"); b.setAttribute("tabindex",on?"0":"-1"); if(on&&focus&&b.focus) b.focus(); });
  if(!ok) return;
  tabNow=t;
  document.querySelectorAll(".tabpane").forEach(function(pane){ pane.hidden=(pane.id!==t); });
  if(t==="command") paintCommand();
  if(t==="plans") paintPlanText();
  var to=document.getElementById("drawer-back-to"), tb=document.getElementById("tab-"+t); if(to&&tb) to.textContent=tb.textContent;
  if(typeof requestRender==="function") requestRender(2);
}
/* Stage 3C (decision 60; docs/STAGE3_SPEC.md section G.2): in Watch the presentation switch stands in the timeline's control row,
   at full opacity (it was a floating control at 24%, below AA over the map); elsewhere it stands where it stood */
function syncViewmode(){
  var vm=document.getElementById("viewmode"), slot=document.getElementById("tb-vm"), home=document.getElementById("viewmode-home");
  if(!vm||!slot||!home||!home.parentNode||!home.parentNode.insertBefore) return;
  if(presentation==="watch"){ if(vm.parentNode!==slot) slot.appendChild(vm); }
  else if(vm.parentNode===slot) home.parentNode.insertBefore(vm,home);
}
function syncVis(){
  document.body.classList.toggle("no-dispatch",hideDispatch);

  syncTimebarHeight();
}
function setDispatchVisible(on){ hideDispatch=!on; syncVis(); }
function showEverything(){
  hideDispatch=false;
  document.body.classList.remove("rail-hidden");
  setPresentation("study");
}
/* the time bar wraps at narrow widths, so its height is measured, never assumed */
var _tbEl=null;
function syncTimebarHeight(){
  if(!_tbEl) _tbEl=document.querySelector(".timebar");
  if(!_tbEl) return;
  var h=(presentation==="map")?0:Math.round(_tbEl.getBoundingClientRect().height);
  document.documentElement.style.setProperty("--tb",h+"px");
}

/* ---------------- loop ---------------- */
var frameClock=new THREE.Clock();
var lastFrame=0;
/* ---- render on demand ----
   A frame is drawn when something changes: a tween, playback, recent input, an easing that has
   not arrived (settling), or a request from a state change. When the only motion is slow drift -
   mist, smoke, dust, a broken formation's sway - frames drop to the ambient rate; when nothing
   moves, nothing is drawn. Easings are time-based through ease(), so they run at the same
   wall-clock speed at any frame rate. */
var needFrames=3, lastInput=0, lastAmbient=0, settling=false, FK=1;
var AMBIENT_MS=90, INPUT_HOLD_MS=450;
function requestRender(n){ needFrames=Math.max(needFrames,n||2); }
function ease(r){ return 1-Math.pow(1-r,FK); }
function ambientNow(){
  if(RM||HARNESS) return false;
  for(var id in units){
    var r=units[id];
    if((r.smoke&&r.smoke.visible)||(r.dust&&r.dust.visible)) return true;
    if(r.block&&r.block.visible&&LOOSE[liveStatus(id,curPhase)]) return true;
  }
  return false;
}
/* Stage 2D: while an interface panel slides (a CSS transition), frames are drawn so the map layer keeps clear of it */
var panelMoveUntil=0;
function frameState(now){
  if(tween||playing||needFrames>0||settling||now-lastInput<INPUT_HOLD_MS||now<panelMoveUntil) return "active";
  if(ambientNow()) return (now-lastAmbient>=AMBIENT_MS)?"ambient":"waiting";
  return "idle";
}
function loop(){
  requestAnimationFrame(loop);
  syncFollow();   /* Stage 3D: the Follow button and the vantages' pressed state, every animation frame */
  var now=performance.now(), state=frameState(now);
  paintDevStats(now);
  if(state==="idle"||state==="waiting"){ DEV.skipped++; if(state==="idle") DEV.state="idle"; return; }
  DEV.state=state; lastAmbient=now;
  if(needFrames>0) needFrames--;
  settling=false;
  var dt=lastFrame?Math.min(120,now-lastFrame):16;
  lastFrame=now;
  FK=Math.max(0.25,Math.min(7.2,dt/16.667));
  if(tween) tween(now);
  tickClock(dt);
  followStep(dt);   /* Stage 4D: Follow while the clock plays */
  setProg((clock-T_MIN)/(T_MAX-T_MIN));
  var tu=performance.now(); updateVisibility(); DEV.tUpdate=performance.now()-tu;
  syncViewOffset(false);   /* Stage 3D: the landscape's focus eased to the free rectangle's centre */
  smokeT=HARNESS?0:now*0.001;
  renderFrame();
  loop._n=(loop._n||0)+1;
  if(devOn&&loop._n%120===0){ var fe=AUSTERLITZ_DEBUG.figureError();   /* with the readout on: a periodic check of the seating */
    if(fe.worst>0.02&&!loop._warned){ loop._warned=true; console.warn("Austerlitz runtime check: a figure is "+fe.worst.toFixed(3)+" units off the drawn ground ("+fe.where+")"); } }
}

/* ============================================================
   RUNTIME CHECKS AND THE HARNESS HOOK
   AUSTERLITZ_DEBUG.selfTest() runs the Stage 0 guarantees against the live application. The
   visual harness (tools/visual) calls it; it can also be run from the console at any time.
   applyCase() and settle() let the harness put the app into a fixed, fully settled state.
   ============================================================ */
var AUSTERLITZ_DEBUG=(function(){
  function finishTween(){ var n=0; while(tween&&n<4){ tween(performance.now()+1e7); n++; } }
  function settle(n,noRender){
    finishTween(); syncViewOffset(true);
    var fk=FK; FK=7.2;
    for(var i=0;i<(n||60);i++){ settling=false; updateVisibility(); }
    FK=fk;
    if(!noRender) renderFrame();
    return settling;
  }
  function placeCamera(c){   /* an authored camera (a harness case, a preset): re-framed to the drawn ground */
    tween=null; camArc=null; freeCam=true; curVantage=null;
    /* the paper map: the preset's target centred in the free part of the screen, at the zoom of its distance (glide) */
    if(mode==="staff"){ MAPCAM.centreOn(c[3],c[5],mapWppAt(Math.hypot(c[0]-c[3],c[1]-c[4],c[2]-c[5])),true); return; }
    c=presetFrame(c);   /* Stage 3D: the Overview fitted into the free rectangle; every other preset re-framed in height */
    landCam.position.set(c[0],c[1],c[2]); orbitTarget.set(c[3],c[4],c[5]); landCam.lookAt(orbitTarget);
    clampCamera();
  }
  /* ---- Stage 3D (docs/STAGE3_SPEC.md section H): the landscape's controls, through the handlers a visitor drives ---- */
  function pev(t,x,y,b,btn,type,id){ return new PointerEvent(t,{pointerId:id||7,isPrimary:(id||7)===7,pointerType:type||"mouse",clientX:x,clientY:y,buttons:b,button:btn,bubbles:true,cancelable:true}); }
  function freeC(){ var fr=landFreeRect(); return [Math.round((fr[0]+fr[2])/2),Math.round((fr[1]+fr[3])/2)]; }
  function landPlace(v){ placeCamera(v); syncViewOffset(true); }
  /* from every vantage: a left-drag pans, the wheel zooms toward the cursor, a right-drag orbits, a double-click centres;
     the eye at or above the floor after every step. A pan step the floor lifted is counted apart (the grabbed point cannot
     stay under the pointer when the eye is lifted). */
  function landControls(){
    var el=renderer.domElement, spc=el.setPointerCapture, i, q;
    var R={pan:0,panAfter:0,panN:0,panLifted:0,zoom:0,zoomN:0,zoomStops:0,focus:0,focusN:0,orbitBad:0,orbitN:0,below:0,views:0,lost:[]};
    el.setPointerCapture=function(){};
    function floorOK(){ var p=landCam.position; if(p.y<camFloor(p.x,p.z)-1e-6) R.below++; }
    function sphNow(){ return new THREE.Spherical().setFromVector3(landCam.position.clone().sub(orbitTarget)); }
    Object.keys(VANTAGE).forEach(function(k){
      landPlace(VANTAGE[k]); R.views++;
      var fr=landFreeRect(), c=freeC();
      /* pan */
      var sx=c[0]-80, sy=c[1]+60, g=groundAt(sx,sy);
      if(g){ var gp=new THREE.Vector3(g[0],groundY(g[0],g[1]),g[1]), cl=CAM.clamps;
        el.dispatchEvent(pev("pointerdown",sx,sy,1,0));
        for(i=1;i<=10;i++){ var x=sx+12*i, y=sy+7*i, cb=CAM.clamps; el.dispatchEvent(pev("pointermove",x,y,1,0)); floorOK();
          if(CAM.clamps>cb){ R.panLifted++; continue; }
          q=LANDCAM.screenOf(gp); R.pan=Math.max(R.pan,Math.hypot(q[0]-x,q[1]-y)); R.panN++; }
        window.dispatchEvent(pev("pointerup",sx+120,sy+70,0,0)); floorOK();
        if(CAM.clamps===cl){ q=LANDCAM.screenOf(gp); R.panAfter=Math.max(R.panAfter,Math.hypot(q[0]-(sx+120),q[1]-(sy+70))); }
      } else R.lost.push(k+": no ground to pan");
      /* the wheel, twelve steps in toward a point off the centre */
      landPlace(VANTAGE[k]);
      var wx=Math.round(fr[0]+(fr[2]-fr[0])*0.3), wy=Math.round(fr[1]+(fr[3]-fr[1])*0.7), g1=groundAt(wx,wy);
      if(g1){ var gp1=new THREE.Vector3(g1[0],groundY(g1[0],g1[1]),g1[1]);
        for(i=0;i<12;i++){ var fs0=LANDCAM.stats.floorStops;
          el.dispatchEvent(new WheelEvent("wheel",{deltaY:-120,clientX:wx,clientY:wy,bubbles:true,cancelable:true})); floorOK();
          q=LANDCAM.screenOf(gp1); R.zoom=Math.max(R.zoom,Math.hypot(q[0]-wx,q[1]-wy)); R.zoomN++; if(LANDCAM.stats.floorStops>fs0) R.zoomStops++; }
      } else R.lost.push(k+": no ground to zoom toward");
      /* a right-drag orbits about the target */
      landPlace(VANTAGE[k]);
      var t0=orbitTarget.clone(), th0=sphNow().theta;
      el.dispatchEvent(pev("pointerdown",c[0],c[1],2,2));
      for(i=1;i<=6;i++){ el.dispatchEvent(pev("pointermove",c[0]+10*i,c[1],2,2)); floorOK(); }
      window.dispatchEvent(pev("pointerup",c[0]+60,c[1],0,2));
      var dth=sphNow().theta-th0; while(dth>Math.PI) dth-=2*Math.PI; while(dth<-Math.PI) dth+=2*Math.PI;
      R.orbitN++; if(orbitTarget.distanceTo(t0)>1e-9||Math.abs(dth+0.3)>1e-6) R.orbitBad++;
      /* a double-click centres the ground point under it in the free rectangle */
      landPlace(VANTAGE[k]);
      var dx=Math.round(fr[0]+(fr[2]-fr[0])*0.25), dy=Math.round(fr[1]+(fr[3]-fr[1])*0.35), g2=groundAt(dx,dy);
      if(g2){ var gp2=new THREE.Vector3(g2[0],groundY(g2[0],g2[1]),g2[1]);
        el.dispatchEvent(new MouseEvent("dblclick",{clientX:dx,clientY:dy,bubbles:true,cancelable:true}));
        finishTween(); syncViewOffset(true); floorOK();
        q=LANDCAM.screenOf(gp2); R.focus=Math.max(R.focus,Math.hypot(q[0]-c[0],q[1]-c[1])); R.focusN++;
      } else R.lost.push(k+": no ground to centre");
    });
    el.setPointerCapture=spc;
    return R;
  }
  /* the keys on the focused map layer, and touch (synthetic pointer events: one finger pans, two pinch and twist) */
  function landKeysTouch(){
    var el=renderer.domElement, spc=el.setPointerCapture, R={}, c, q, i;
    el.setPointerCapture=function(){};
    landPlace(VANTAGE.field); c=freeC();
    var clk=clock, t0=orbitTarget.clone(), s0=new THREE.Spherical().setFromVector3(landCam.position.clone().sub(orbitTarget));
    ML.root.focus({preventScroll:true});
    function key(k,sh){ ML.root.dispatchEvent(new KeyboardEvent("keydown",{key:k,shiftKey:!!sh,bubbles:true,cancelable:true})); }
    key("ArrowRight"); var t1=orbitTarget.clone(); R.keyPan=+t1.distanceTo(t0).toFixed(2);
    var r1=landCam.position.distanceTo(orbitTarget); key("+"); R.keyZoom=+(landCam.position.distanceTo(orbitTarget)/r1).toFixed(3);
    var th1=new THREE.Spherical().setFromVector3(landCam.position.clone().sub(orbitTarget)).theta; key("ArrowLeft",true);
    var d=new THREE.Spherical().setFromVector3(landCam.position.clone().sub(orbitTarget)).theta-th1; while(d>Math.PI) d-=2*Math.PI; while(d<-Math.PI) d+=2*Math.PI;
    R.keyTurnDeg=+(d*180/Math.PI).toFixed(2); R.clockKept=clock===clk; R.keyFree=freeCam; ML.root.blur();
    /* one finger pans: the grabbed point stays under it */
    landPlace(VANTAGE.field); c=freeC();
    var g=groundAt(c[0]-40,c[1]+40), gp=new THREE.Vector3(g[0],groundY(g[0],g[1]),g[1]);
    el.dispatchEvent(pev("pointerdown",c[0]-40,c[1]+40,1,0,"touch",11));
    for(i=1;i<=8;i++) el.dispatchEvent(pev("pointermove",c[0]-40+10*i,c[1]+40-6*i,1,0,"touch",11));
    window.dispatchEvent(pev("pointerup",c[0]+40,c[1]-8,0,0,"touch",11));
    q=LANDCAM.screenOf(gp); R.touchPan=+Math.hypot(q[0]-(c[0]+40),q[1]-(c[1]-8)).toFixed(3);
    /* two fingers: pinch apart (zoom in) and twist */
    landPlace(VANTAGE.field); c=freeC();
    var r0=landCam.position.distanceTo(orbitTarget), th0=new THREE.Spherical().setFromVector3(landCam.position.clone().sub(orbitTarget)).theta;
    el.dispatchEvent(pev("pointerdown",c[0]-50,c[1],1,0,"touch",21)); el.dispatchEvent(pev("pointerdown",c[0]+50,c[1],1,0,"touch",22));
    for(i=1;i<=6;i++){ var a=i*0.05, rr=50+10*i;
      el.dispatchEvent(pev("pointermove",c[0]-rr*Math.cos(a),c[1]-rr*Math.sin(a),1,0,"touch",21)); el.dispatchEvent(pev("pointermove",c[0]+rr*Math.cos(a),c[1]+rr*Math.sin(a),1,0,"touch",22)); }
    window.dispatchEvent(pev("pointerup",0,0,0,0,"touch",21)); window.dispatchEvent(pev("pointerup",0,0,0,0,"touch",22));
    var th2=new THREE.Spherical().setFromVector3(landCam.position.clone().sub(orbitTarget)).theta, dt=th2-th0; while(dt>Math.PI) dt-=2*Math.PI; while(dt<-Math.PI) dt+=2*Math.PI;
    R.pinchRatio=+(landCam.position.distanceTo(orbitTarget)/r0).toFixed(3); R.twistDeg=+(dt*180/Math.PI).toFixed(2); R.touchSelect=selection;
    el.setPointerCapture=spc;
    return R;
  }
  /* the focus in the free rectangle after each panel change, as the loop eases it; picking through the offset; Follow after
     every camera path; every preset's target at the free centre; the Overview's field inside the free rectangle; one tween
     chain */
  function cameraChecks3D(ck){
    var el=renderer.domElement, spc=el.setPointerCapture, i, q;
    el.setPointerCapture=function(){};
    function ease(){ var n=0, fk=FK; FK=7.2; while(!syncViewOffset(false)&&n<400) n++; FK=fk; return n; }
    function off(){ var fr=landFreeRect(), t=LANDCAM.screenOf(orbitTarget); return Math.hypot(t[0]-(fr[0]+fr[2])/2,t[1]-(fr[1]+fr[3])/2); }
    /* 1. the offset after panel changes */
    setPresentation("study"); if(typeof selectTab==="function") selectTab("now"); select(null,null); landPlace(VANTAGE.field);
    var states=[], worst=0, lg=document.getElementById("lg-toggle");
    function st(name,fn){ fn(); var n=ease(), e=off(); worst=Math.max(worst,e); states.push(name+" "+e.toFixed(2)+" px ("+n+" frames)"); }
    st("Study, the Now tab",function(){});
    st("a formation selected (the dossier in the rail)",function(){ select("f","sthilaire"); });
    st("the dossier closed",function(){ select(null,null); });
    st("the legend opened",function(){ if(lg&&!ML.legendOpen) lg.click(); mlLayout(); });
    st("the legend closed",function(){ if(lg&&ML.legendOpen) lg.click(); mlLayout(); });
    st("Watch",function(){ setPresentation("watch"); });
    st("Clean",function(){ setPresentation("map"); });
    st("Study again",function(){ setPresentation("study"); });
    var vx=VOFF.x, vy=VOFF.y;
    ck("camera: the orbit target at the free rectangle's centre after each panel change (setViewOffset, eased as the loop does)", worst<=1, states.join("; ")+"; the offset now ("+vx.toFixed(1)+", "+vy.toFixed(1)+") px");
    /* 2. picking and the ground through the offset */
    landPlace(VANTAGE.plateau); renderFrame();
    var hit=null; Object.keys(ML.items).some(function(k){ var it=ML.items[k]; if(it.eFrame===ML.frame&&it.pick&&it.pick.kind==="f"&&it.rect&&it.state!=="occluded"&&it.el.style.display!=="none"){ hit=it; return true; } return false; });
    var picked=null;
    if(hit){ var hx=Math.round((hit.rect[0]+hit.rect[2])/2), hy=Math.round((hit.rect[1]+hit.rect[3])/2); select(null,null);
      el.dispatchEvent(pev("pointerdown",hx,hy,1,0)); window.dispatchEvent(pev("pointerup",hx,hy,0,0)); picked=selection; }
    /* the round trip on the modelled ground: beyond it, on the coarse apron toward the horizon, the ground has a step at the
       apron's edge, where a grazing ray's crossing is not a point of the ground (found here: 3.3 px at 700 units, with or
       without the offset; section A.2's 2.2 px grazing ray) */
    var fr=landFreeRect(), rt=0, rn=0, beyond=0;
    for(i=0;i<40;i++){ var sx=fr[0]+(fr[2]-fr[0])*((i%8)+0.5)/8, sy=fr[1]+(fr[3]-fr[1])*(Math.floor(i/8)+0.5)/5, g=groundAt(sx,sy); if(!g) continue;
      if(Math.abs(g[0])>GROUND_W/2||Math.abs(g[1])>GROUND_D/2){ beyond++; continue; }
      var p=new THREE.Vector3(g[0],groundY(g[0],g[1]),g[1]); q=LANDCAM.screenOf(p); rt=Math.max(rt,Math.hypot(q[0]-sx,q[1]-sy)); rn++; }
    ck("camera: picking and the ground through the offset (a click on a counter's box selects it; groundAt's round trip within 1 px)",
      !!hit&&!!picked&&picked.kind===hit.pick.kind&&picked.id===hit.pick.id&&rt<=1&&rn>=20,
      (hit?"the counter of "+hit.pick.id+" clicked at its box's centre: "+(picked?"selected "+picked.kind+":"+picked.id:"NOTHING SELECTED"):"NO COUNTER PLACED")+"; round trip worst "+rt.toFixed(3)+" px over "+rn+" points of the modelled ground ("+beyond+" beyond it, on the apron, not counted)");
    select(null,null);
    /* 3. Follow equals !freeCam after every camera path, with the value decision 47 gives */
    var walk=[], bad=[], fb=document.getElementById("follow");
    function path(name,want,fn){ fn(); finishTween(); syncFollow(); var pr=fb&&fb.getAttribute("aria-pressed");
      var okk=pr===String(!freeCam)&&(!freeCam)===want; walk.push(name+" "+(want?"on":"off")); if(!okk) bad.push(name+": pressed "+pr+", freeCam "+freeCam); }
    var cc=freeC();
    function drag(btn){ el.dispatchEvent(pev("pointerdown",cc[0],cc[1],btn===2?2:1,btn)); for(var j=1;j<=5;j++) el.dispatchEvent(pev("pointermove",cc[0]+8*j,cc[1]+3*j,btn===2?2:1,btn)); window.dispatchEvent(pev("pointerup",cc[0]+40,cc[1]+15,0,btn)); }
    path("a vantage",true,function(){ document.querySelector('.van-btn[data-v="field"]').click(); });
    var vp1=document.querySelector('.van-btn[data-v="field"]').getAttribute("aria-pressed");
    path("a pan",false,function(){ drag(0); });
    var vp2=document.querySelector('.van-btn[data-v="field"]').getAttribute("aria-pressed");
    path("Follow pressed",true,function(){ fb.click(); });
    path("the wheel",false,function(){ el.dispatchEvent(new WheelEvent("wheel",{deltaY:-120,clientX:cc[0],clientY:cc[1],bubbles:true,cancelable:true})); });
    path("a phase button",true,function(){ document.querySelectorAll("#phases .step")[3].click(); });
    path("a right-drag orbit",false,function(){ drag(2); });
    path("an act button",true,function(){ document.querySelectorAll(".act-btn")[1].click(); });
    path("a double-click",false,function(){ el.dispatchEvent(new MouseEvent("dblclick",{clientX:cc[0]+30,clientY:cc[1]+20,bubbles:true,cancelable:true})); });
    path("a chapter",true,function(){ setChapter(ANALYSIS[2].id); });
    path("a centring from the order of battle",false,function(){ setChapter(null); var r=document.querySelector(".oob-row"); if(r) r.click(); });
    path("a tour stop",true,function(){ startTour(); });
    path("the keys on the map layer",false,function(){ exitTour(); ML.root.focus({preventScroll:true}); ML.root.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowUp",bubbles:true,cancelable:true})); ML.root.blur(); });
    path("Follow pressed again",true,function(){ fb.click(); });
    path("Follow released",false,function(){ fb.click(); });
    select(null,null);
    ck("camera: Follow shows !freeCam after every camera path, as decision 47 sets it; a vantage's button is released when the eye leaves it",
      !bad.length&&vp1==="true"&&vp2==="false", walk.length+" paths ("+walk.join(", ")+")"+(bad.length?"; WRONG: "+bad.join("; "):"")+"; the Field vantage pressed "+vp1+", after a pan "+vp2);
    /* 4. presets: every vantage's target at the free centre; the Overview's field inside the free rectangle */
    var pw=0, pl=[], fieldOut=0, ovNames=[];
    Object.keys(VANTAGE).forEach(function(k){ flyTo(VANTAGE[k]); finishTween(); syncViewOffset(true); var e=off(); pw=Math.max(pw,e); pl.push(k+" "+e.toFixed(2));
      if(k==="plan"){ updateVisibility(); mlLayout();   /* the Overview names its corps and armies (the owner's answer in 3D) */
        Object.keys(ML.items).forEach(function(q){ var it=ML.items[q]; if(q.indexOf("n:")===0&&it.eFrame===ML.frame&&it.state==="on") ovNames.push(q.slice(2)); }); }
      if(k==="plan"){ var fr2=landFreeRect(), X=actionExtent(), mx=(X[0]+X[2])/2, mz=(X[1]+X[3])/2;
        [[X[0],X[1]],[X[2],X[1]],[X[2],X[3]],[X[0],X[3]],[mx,X[1]],[mx,X[3]],[X[0],mz],[X[2],mz]].forEach(function(c){ var s2=LANDCAM.screenOf(new THREE.Vector3(c[0],groundY(c[0],c[1]),c[1]));
          if(s2[0]<fr2[0]-0.5||s2[0]>fr2[2]+0.5||s2[1]<fr2[1]-0.5||s2[1]>fr2[3]+0.5) fieldOut++; }); } });
    ck("camera: every vantage's target at the free rectangle's centre; the Overview fits the day's battle into the free rectangle and names its corps and armies (section B.4, as settled in 3D)",
      pw<=1&&fieldOut===0&&ovNames.length>0, pl.join(", ")+" px; the Overview: "+(8-fieldOut)+" of 8 points of the battle's extent ("+actionExtent().map(function(x){ return x.toFixed(1); }).join(", ")+") inside the free rectangle, at "+landCam.position.distanceTo(orbitTarget).toFixed(0)+" units, naming "+ovNames.length+" formations ("+ovNames.slice(0,6).join(", ")+(ovNames.length>6?", ...":"")+")");
    /* 5. one tween chain: a double-click during a phase change is not dropped when Follow is off; with Follow on the phase's view wins */
    setPhase(2,true); finishTween(); landPlace(VANTAGE.field);
    var c3=freeC(), g3=groundAt(c3[0]+60,c3[1]+30), keep=new THREE.Vector3(g3[0],groundY(g3[0],g3[1]),g3[1]);
    el.dispatchEvent(new MouseEvent("dblclick",{clientX:c3[0]+60,clientY:c3[1]+30,bubbles:true,cancelable:true}));
    setClock(PHASES[3].t0+1);   /* a phase change while the glide runs */
    finishTween(); var kept=orbitTarget.distanceTo(keep);
    setClock(PHASES[2].t0+1,{instant:true,force:true}); finishTween();
    document.querySelector('.van-btn[data-v="zuran"]').click();   /* Follow on, a glide in flight */
    setClock(PHASES[3].t0+1); var pc3=presetFrame(PHASES[3].cam); finishTween();
    var won=Math.hypot(orbitTarget.x-pc3[3],orbitTarget.z-pc3[5]);
    ck("camera: one tween chain: a centring made during a phase change is kept with Follow off; with Follow on the phase's view wins",
      kept<1e-6&&won<1e-6, "Follow off: the double-click's point ends "+kept.toExponential(1)+" units from the target; Follow on (a vantage glide in flight): the phase's view ends "+won.toExponential(1)+" from its preset");
    el.setPointerCapture=spc;
  }
  /* ---- Stage 3E (docs/STAGE3_SPEC.md section H): the key table, the overlay, the names, the symbols' largest size ---- */
  function keyChecks3E(ck){
    function kd(el,k,o){ o=o||{}; el.dispatchEvent(new KeyboardEvent("keydown",{key:k,shiftKey:!!o.shift,ctrlKey:!!o.ctrl,metaKey:!!o.meta,altKey:!!o.alt,bubbles:true,cancelable:true})); }
    if(document.activeElement&&document.activeElement.blur) document.activeElement.blur();
    setHelp(false);
    /* 1. a dry run: every row's keys reach that row, other keys none, and no two rows claim one key */
    var wrong=[], n=0, claims={};
    KEYS_DRY=[];
    KEYS.forEach(function(r){
      if(r.scope!=="window"&&r.scope!=="map") return;
      r.keys.forEach(function(k){ (r.shift===undefined?[false,true]:[r.shift]).forEach(function(sh){
        var c=r.scope+"|"+k+"|"+sh; if(claims[c]&&claims[c]!==r.id) wrong.push(k+" claimed by "+claims[c]+" and "+r.id); claims[c]=r.id;
        KEYS_DRY.length=0;
        if(r.scope==="map"){ ML.root.focus({preventScroll:true}); kd(ML.root,k,{shift:sh}); ML.root.blur(); }
        else kd(document.body,k,{shift:sh});
        var want=(r.scope==="map"?"map:":"")+r.id; n++;
        if(KEYS_DRY[0]!==want) wrong.push((sh?"Shift+":"")+(k===" "?"Space":k)+" reached "+KEYS_DRY[0]+", not "+want); }); }); });
    var unb=["q","x","a","0","4","/","Home","End","PageUp","Enter","Tab","Backspace"], hit=[];
    unb.forEach(function(k){ KEYS_DRY.length=0; kd(document.body,k); if(KEYS_DRY[0]) hit.push(k+" → "+KEYS_DRY[0]); });
    var mods=0; [["c",{ctrl:true}],["m",{meta:true}],["1",{alt:true}],["ArrowRight",{ctrl:true}]].forEach(function(q){ KEYS_DRY.length=0; kd(document.body,q[0],q[1]); if(KEYS_DRY.length) mods++; });
    var tb=document.getElementById("tourbtn"); tb.focus({preventScroll:true}); KEYS_DRY.length=0; kd(tb," "); var spaceOnButton=KEYS_DRY.length;
    KEYS_DRY.length=0; kd(tb,"ArrowRight"); kd(tb,"ArrowLeft",{shift:true}); spaceOnButton+=KEYS_DRY.length; tb.blur();
    KEYS_DRY=null;
    var bound=KEYS.filter(function(r){ return r.scope==="window"||r.scope==="map"; }).length;
    ck("keys: every key the window and the map layer bind is a row of the key table and every row's keys reach it; other keys, keys with Ctrl, Meta or Alt, and Space and the arrows on a button reach none",
      !wrong.length&&!hit.length&&!mods&&!spaceOnButton&&n>0,
      KEYS.length+" rows ("+bound+" bound by the two handlers, the rest by their own widgets or the pointer); "+n+" key presses reached their rows"+(wrong.length?"; WRONG: "+wrong.slice(0,6).join("; "):"")+
      "; unbound keys reaching a row: "+(hit.length?hit.join(", "):"none")+"; with a modifier: "+mods+" of 4; Space, \u2192 and Shift+\u2190 on a focused button: "+(spaceOnButton?"REACHED A ROW":"no row (Space presses the button)"));
    /* 2. the overlay lists every row, in its groups; opening and closing return focus; Tab stays inside */
    tb.focus({preventScroll:true}); kd(tb,"?",{shift:true});
    var hp=document.getElementById("help"), open1=!hp.hidden, inFocus=document.activeElement===document.getElementById("help-close");
    var rows=hp.querySelectorAll(".hp-row"), listed=Array.prototype.map.call(rows,function(e){ return e.dataset.key; });
    var missing=KEYS.filter(function(r){ return listed.indexOf(r.id)<0; }).map(function(r){ return r.id; }), ungrouped=KEYS.filter(function(r){ return HELP_GROUPS.indexOf(r.group)<0; }).map(function(r){ return r.id; });
    kd(document.activeElement,"Tab"); var t1=document.activeElement&&document.activeElement.id; kd(document.activeElement,"Tab"); var t2=document.activeElement&&document.activeElement.id;
    var clk=clock; kd(document.activeElement,"ArrowRight"); var modal=clock===clk;
    kd(document.activeElement,"Escape"); var closed=hp.hidden, back=document.activeElement===tb;
    document.getElementById("helpbtn").focus({preventScroll:true}); document.getElementById("helpbtn").click(); var byBtn=!hp.hidden; kd(document.activeElement,"?"); var closed2=hp.hidden, back2=document.activeElement===document.getElementById("helpbtn");
    if(document.activeElement&&document.activeElement.blur) document.activeElement.blur();
    ck("keys: the “?” overlay lists every row of the key table in its groups; a modal dialog, focus moved in, kept in by Tab, and returned when Esc or “?” closes it",
      open1&&inFocus&&rows.length===KEYS.length&&!missing.length&&!ungrouped.length&&t1==="help-body"&&t2==="help-close"&&modal&&closed&&back&&byBtn&&closed2&&back2,
      rows.length+" rows listed of "+KEYS.length+(missing.length?"; MISSING: "+missing.join(", "):"")+(ungrouped.length?"; NO GROUP: "+ungrouped.join(", "):"")+"; opened by ? on the focused tour button: "+open1+
      ", focus on its close button: "+inFocus+"; Tab: "+t1+", then "+t2+"; the arrow key inside it left the clock "+(modal?"unchanged":"MOVED")+"; Esc closed it: "+closed+", focus back on the tour button: "+back+
      "; the ? button opened it: "+byBtn+", ? closed it: "+closed2+", focus back on that button: "+back2);
    /* 3. the names (decision 50): no presentation labelled "Map", no ground labelled "Staff map"; the identifiers unchanged */
    var vm=Array.prototype.map.call(document.querySelectorAll(".vm-btn"),function(b){ return b.dataset.vm+"="+b.textContent.trim(); }),
      gm=Array.prototype.map.call(document.querySelectorAll(".mode-btn"),function(b){ return b.dataset.m+"="+b.textContent.trim(); });
    var badN=vm.concat(gm).filter(function(x){ return /=(Map|Staff map|Terrain|Hybrid)$/.test(x); });
    var lb=document.getElementById("layersbtn").textContent.trim(), lpa=document.getElementById("layerpop").getAttribute("aria-label");
    ck("names: the presentations, the ground and the layers labelled from one table (decision 50); identifiers unchanged",
      !badN.length&&vm.join()==="study=Study,watch=Watch,map=Clean"&&gm.join()==="terrain=Landscape,staff=Paper map,hybrid=Landscape with counters"&&lb==="Layers…"&&lpa==="Layers and ground",
      vm.join(", ")+"; "+gm.join(", ")+"; the layers button “"+lb+"”, its panel “"+lpa+"”");
    /* 4. decision 57: event glyphs and objective markers at most SYM_MAX_PX on screen, faded near the eye */
    setClock(590,{instant:true,force:true,camera:false}); finishTween(); var k0=eventMarks.filter(function(k){ return k.e.id==="kamensky"; })[0];
    tween=null; camArc=null; freeCam=true; landCam.position.copy(k0.world).add(new THREE.Vector3(0,1.2,1.35)); orbitTarget.copy(k0.world); landCam.lookAt(orbitTarget); clampCamera();
    settle(4,true);
    var big=0, faded=0, near=0; eventMarks.forEach(function(k){ if(!k.sp.visible) return; var px=k.sp.scale.x/worldPerPx(k.world); big=Math.max(big,px); if(camera.position.distanceTo(k.world)<SYM_FADE[0]){ near++; if(k.m.opacity<=1e-6&&k.fade===0) faded++; } });
    ovMarkers.forEach(function(m){ if(m.sp){ big=Math.max(big,m.sp.scale.x/worldPerPx(m.pos)); } });
    landPlace(VANTAGE.field); settle(4,true);
    var same=eventMarks.every(function(k){ return !k.sp.visible||Math.abs(k.sp.scale.x-k.s0)<1e-9||k.s0/worldPerPx(k.world)>SYM_MAX_PX; });
    ck("symbols: event glyphs and objective markers at most "+SYM_MAX_PX+" px on screen, and faded within "+SYM_FADE[0]+" units of the eye (decision 57); drawn as before where smaller",
      big<=SYM_MAX_PX+0.5&&near>0&&faded===near&&same,
      "the eye 1.8 units from the live glyph “kamensky”: the largest symbol drawn "+big.toFixed(1)+" px; "+faded+" of "+near+" glyphs within "+SYM_FADE[0]+" units faded out; from the Field vantage every glyph at its authored size: "+same);
  }
  function applyCase(spec,aimOf){
    closeFirst(null);
    stopPlay(); if(tourStep>=0) exitTour();
    if(planSide) setPlan(planSide); if(chapter) setChapter(null);
    freeCam=true;
    setPresentation(spec.presentation||"study");
    if(mode!==(spec.mode||"terrain")) setMode(spec.mode||"terrain");
    setDisplayFactor(spec.factor||DISPLAY.defaultFactor);   /* a case runs at the default display factor unless it names one */
    setClock(spec.t,{instant:true,force:true,camera:false});
    finishTween();
    select(null,null);
    if(spec.select) select(spec.select[0],spec.select[1]);
    /* Stage 2E: a paper-map case frames the whole field (paper:"frame"), or centres a preset or an aim */
    if(mode==="staff"&&(spec.paper==="frame"||(!spec.cam&&!spec.aim))){ tween=null; freeCam=true; MAPCAM.frameField(true); }
    else placeCamera(spec.cam||aimOf(spec));
    requestRender(3);
    return true;
  }
  function visibleUp(o){ while(o){ if(!o.visible) return false; o=o.parent; } return true; }
  /* every visible man and horse (the figure kit), and the foot of every standard, against groundY */
  function figureError(){
    var K=figKit(), geos=[K.infCoat,K.infFixed,K.horse,K.rider,K.riderFixed], m=new THREE.Matrix4(), p=new THREE.Vector3();
    var worst=0, where="", n=0;
    Object.keys(units).forEach(function(id){
      var b=units[id].block; if(!b||!visibleUp(b)) return;
      b.updateMatrixWorld(true);
      b.traverse(function(o){
        if(!o.isInstancedMesh||geos.indexOf(o.geometry)<0||!visibleUp(o)) return;
        for(var i=0;i<o.count;i++){
          o.getMatrixAt(i,m); p.set(0,0,0).applyMatrix4(m).applyMatrix4(o.matrixWorld);
          var e=Math.abs(p.y-groundY(p.x,p.z)); n++; if(e>worst){ worst=e; where=id; }
        }
      });
      var u=b.userData;
      if(u&&u.poles&&visibleUp(u.poles)) for(var j=0;j<u.poles.count;j++){
        u.poles.getMatrixAt(j,m); p.set(0,-2.6,0).applyMatrix4(m).applyMatrix4(u.poles.matrixWorld);
        var e2=Math.abs(p.y-groundY(p.x,p.z)); if(e2>worst){ worst=e2; where=id+" (standard)"; }
      }
    });
    return {worst:worst,where:where,n:n};
  }
  /* ---- Stage 2B facts measured at one display factor, compared across factors by stage2bChecks ---- */
  function factorFacts(fct){
    var P=W(285,289), S=W(208,365), o={f:fct, s:displayScale()};
    o.relief=groundY(P[0],P[1])-groundY(S[0],S[1]);                 /* drawn Pratzeberg-Sokolnitz relief */
    o.analytic=displayHeight(P[0],P[1])-displayHeight(S[0],S[1]);
    var g=makeGoingPalette(), h=0; for(var q=0;q<g.length;q+=9) h=(h*31+Math.round(g[q]*4095)+7*Math.round(g[q+1]*4095)+13*Math.round(g[q+2]*4095))%2147483647;
    o.going=h;
    /* standards: pole top over the figure's height, in the block's own frame */
    var m=new THREE.Matrix4(), top=new THREE.Vector3(), foot=new THREE.Vector3(), worst=0, n=0;
    Object.keys(units).forEach(function(id){ var u=units[id].block&&units[id].block.userData; if(!u||!u.poles||!u.stdX.length) return;
      if(u.stdScale===undefined) placeStandards(units[id].block,u.sw||1,u.tilt||0);
      for(var j=0;j<u.poles.count;j++){ u.poles.getMatrixAt(j,m); top.set(0,STD_POLE/2,0).applyMatrix4(m); foot.set(0,-STD_POLE/2,0).applyMatrix4(m);
        var r=top.distanceTo(foot)/figureTop(!!u.mounted);   /* the pole's length: it stands upright on a tilted block */ n++; worst=Math.max(worst,Math.abs(r-STD_RATIO)); } });
    o.std={n:n,worst:worst};
    /* the words: legend, the sources sheet, a place dossier's relief caption */
    paintExaggeration();
    o.legend=(document.getElementById("exag-line").textContent||"")+" | "+(document.getElementById("exag-symbols").textContent||"");
    openSources(); o.sources=document.getElementById("modal-body").textContent||"";
    var md=document.getElementById("modal"); md.classList.remove("on"); delete md.dataset.sources;
    o.dossier=dossierFeature("pratzeberg").textContent||"";
    /* true scale: nothing at figure or landscape scale drawn; every formation on the field has its footprint */
    o.landscape=[world.trees,world.conifers,world.scrub,world.houses,world.roofs,world.spires,world.chimneys].filter(function(x){ return x&&x.visible; }).length;
    var onField=0, feet=0, blocks=0;
    setMode("terrain"); setClock(PHASES[3].t0+22,{instant:true,force:true,camera:false}); finishTween(); settle(8,true);
    Object.keys(units).forEach(function(id){ var r=units[id]; if(!r.block||!posNow(id)||knowledgeOf(id)==="unknown") return; onField++;
      if(r.block.visible) blocks++; if(r.foot&&r.foot.visible) feet++; });
    o.onField=onField; o.feet=feet; o.blocks=blocks;
    return o;
  }
  /* Stage 2C: the draped overlays of every phase, measured against groundY at the current display factor */
  function overlayDrape(){
    var keep=curPhase, worst=0, where="", n=0, meshes=0, H={n:0,al:0,fr:0,notch:"",bad:[]}, v=new THREE.Vector3();
    for(var ph=0;ph<PHASES.length;ph++){
      rebuildOverlays(ph,true);
      curOv.updateMatrixWorld(true);
      curOv.traverse(function(o){ var d=o.userData.drape; if(!d||!o.geometry) return; meshes++;
        var P=o.geometry.attributes.position;
        for(var i=0;i<P.count;i++){ v.fromBufferAttribute(P,i).applyMatrix4(o.matrixWorld);
          var e=Math.abs(v.y-groundY(v.x,v.z)-d.lift); n++; if(e>worst){ worst=e; where=d.kind+" in phase "+ph; } }
        if(d.kind==="head"&&o.userData.side){ var u=o.userData, want=u.side==="al"?"chevron":"plain"; H.n++; H[u.side]++;
          var bc=[(u.base[0][0]+u.base[1][0])/2,(u.base[0][1]+u.base[1][1])/2], ax=[u.tip[0]-bc[0],u.tip[1]-bc[1]], L2=ax[0]*ax[0]+ax[1]*ax[1];
          var f=u.notch?((u.notch[0]-bc[0])*ax[0]+(u.notch[1]-bc[1])*ax[1])/L2:null;
          if(u.head!==want||(want==="chevron"&&!(f>0.3&&f<0.45))||(want==="plain"&&u.notch)) H.bad.push(u.side+" head in phase "+ph+" is "+u.head+(f!==null?" (notch "+f.toFixed(2)+")":""));
          else if(f!==null) H.notch=f.toFixed(2); } });
    }
    rebuildOverlays(keep,true);
    return {worst:worst,where:where,n:n,meshes:meshes,heads:H};
  }
  /* ---- Stage 2D: the map layer and the legend (docs/STAGE2_SPEC.md section J), in five fixed states at the current
     display factor. Boxes are read from the page (getBoundingClientRect); arrow heads are projected anew from the overlay
     meshes, independently of the layer's own obstacle list. ---- */
  var _lv3=new THREE.Vector3();
  function layerChecks(ck){
    var S=[
      {n:"landscape, Study, Saint-Hilaire selected",m:"terrain",p:"study",t:585,sel:["f","sthilaire"],aim:"sthilaire"},
      {n:"hybrid, Watch, IV Corps highlighted",m:"hybrid",p:"watch",t:600,sel:["f","c_iv"],aim:[285,289]},
      {n:"paper map, Study",m:"staff",p:"study",t:570,sel:null,paper:true},
      {n:"paper map, Study, Saint-Hilaire selected",m:"staff",p:"study",t:585,sel:["f","sthilaire"],aim:"sthilaire"},
      {n:"landscape, Watch, 04:30",m:"terrain",p:"watch",t:300,sel:null,cam:VANTAGE.plan},
      {n:"landscape, Study, a plan, going and terrain study on",m:"terrain",p:"study",t:520,sel:null,cam:VANTAGE.field,layers:true},
      {n:"the first-run card",m:"terrain",p:"study",t:240,sel:null,first:true},
      {n:"the guided tour, its third stop",m:"terrain",p:"study",t:240,sel:null,tour:3},
      {n:"the guided tour on the paper map, its third stop",m:"staff",p:"study",t:240,sel:null,tour:3}
    ];
    var R={overlaps:[],panel:[],head:[],keep:[],a11y:[],legend:[],ctx:[],names:0,heads:0,placed:0,keepN:0,reachKey:[],reachHover:[],dropTested:0,enter:"",idle:true};
    function cross(a,b){ return Math.min(a[2],b[2])-Math.max(a[0],b[0])>0.5&&Math.min(a[3],b[3])-Math.max(a[1],b[1])>0.5; }
    function box(e){ var b=e.getBoundingClientRect(); return [b.left,b.top,b.right,b.bottom]; }
    function shown(e){ if(!e) return false; var cs=getComputedStyle(e); return cs.display!=="none"&&cs.visibility!=="hidden"&&e.getBoundingClientRect().width>0; }
    /* the test is synchronous: the panels' CSS slides (.32 s) are held still, so each state is laid out where the panels rest */
    document.body.classList.add("st-still");
    function toggle(q){ var e=document.querySelector(q); if(e) e.click(); }
    S.forEach(function(s){
      setPresentation(s.p); if(mode!==s.m) setMode(s.m);
      setClock(s.t,{instant:true,force:true,camera:false}); finishTween();
      if(s.layers){ if(!planSide) setPlan("al"); if(!goingOn) toggle("#going"); if(!layerOn.analysis) toggle('.layer-btn[data-l="analysis"]'); }
      select(null,null); if(s.sel) select(s.sel[0],s.sel[1]);
      if(s.first){ var frc=document.getElementById("firstrun"); frc.hidden=false; openFirstRun(); }
      else if(s.tour){ startTour(); for(var ts=1;ts<s.tour;ts++) tourGo(1); finishTween(); }
      else if(s.paper){ tween=null; freeCam=true; MAPCAM.frameField(true); }
      else if(s.cam) placeCamera(s.cam);
      else { var q=typeof s.aim==="string"?posNow(s.aim):s.aim, w=W(q[0],q[1]), y=displayHeight(w[0],w[1]), d=_lv3.set(-0.55,0.62,0.56).normalize().multiplyScalar(90);
        tween=null; camArc=null; freeCam=true;
        if(mode==="staff") MAPCAM.centreOn(w[0],w[1],mapWppAt(90),true);
        else { orbitTarget.set(w[0],y,w[1]); landCam.position.set(w[0]+d.x,y+d.y,w[1]+d.z); landCam.lookAt(orbitTarget); clampCamera(); } }
      settle(20,true);
      /* render on demand: a pass without a drawn frame lays nothing out; a drawn frame lays out once */
      var fr=ML.frame; settle(4,true); if(ML.frame!==fr) R.idle=false; renderFrame(); if(ML.frame!==fr+1) R.idle=false;
      var items=Object.keys(ML.items).map(function(k){ return ML.items[k]; }).filter(function(it){ return it.eFrame===ML.frame; });
      var on=items.filter(function(it){ return it.state==="on"; }), B=on.map(function(it){ return box(it.el); }), i, j;
      R.placed+=on.length;
      for(i=0;i<on.length;i++) for(j=i+1;j<on.length;j++) if(cross(B[i],B[j])) R.overlaps.push(s.n+": "+on[i].key+" / "+on[j].key);
      var P=mlPanels(); on.forEach(function(it,k){ P.forEach(function(p){ if(cross(B[k],p)) R.panel.push(s.n+": "+it.key); }); });
      var H=[]; curOv.updateMatrixWorld(true);
      if(layerOn.arrows) curOv.traverse(function(o){ var dd=o.userData.drape; if(!dd||dd.kind!=="head"||!o.geometry||!o.visible) return;   /* a head drawn (Stage 4D: hidden while its arrow draws on), as the harness's measure counts them */
        var A=o.geometry.attributes.position, r=[1e9,1e9,-1e9,-1e9], ok=true;
        for(var k=0;k<A.count;k++){ _lv3.fromBufferAttribute(A,k).applyMatrix4(o.matrixWorld).project(camera); if(_lv3.z>1||_lv3.z<-1){ ok=false; break; }
          var x=(_lv3.x*0.5+0.5)*innerWidth, y=(-_lv3.y*0.5+0.5)*innerHeight; r=[Math.min(r[0],x),Math.min(r[1],y),Math.max(r[2],x),Math.max(r[3],y)]; }
        if(ok) H.push(r); });
      R.heads+=H.length;
      on.forEach(function(it,k){ H.forEach(function(h){ if(cross(B[k],h)) R.head.push(s.n+": "+it.key); }); });
      items.forEach(function(it){ if(!it.keep) return; R.keepN++; if(it.state!=="on"&&it.state!=="offscreen"&&it.state!=="panel") R.keep.push(s.n+": "+it.key+" ("+it.state+")"); });
      items.forEach(function(it){ if(!it.fid) return; R.names++; var l=it.el.getAttribute("aria-label")||"";
        if(it.el.getAttribute("tabindex")!=="0"||it.el.getAttribute("role")!=="button"||
           !/^.+, (French|Allied, Russian|Allied, Austrian), (army|corps|division|brigade)(, about [\d,]+)?(, [a-z -]+)?, position grade [ABC](, reported only)?$/.test(l))
          R.a11y.push(s.n+": "+it.key+" \""+l+"\""); });
      if(!R.enter){ var f1=on.filter(function(it){ return !!it.fid; })[0];
        if(f1){ f1.el.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true,cancelable:true}));
          R.enter=(selection&&selection.kind==="f"&&selection.id===f1.fid)?"Enter on "+f1.key+" selects it":"FAILED: Enter on "+f1.key+" did not select it";
          select(null,null); if(s.sel) select(s.sel[0],s.sel[1]); mlLayout(); } }
      /* every dropped formation: from the keyboard (focus draws it), and by hovering some point of its drawn position */
      items.filter(function(it){ return it.fid&&it.state==="dropped"; }).forEach(function(it){
        R.dropTested++;
        it.el.focus(); mlLayout(); if(ML.items[it.key].state!=="on") R.reachKey.push(s.n+": "+it.key); it.el.blur(); mlLayout();
        var f=it.fid, u=units[f], hit=false, pts=[];
        if(u&&u.block&&u.block.userData.W0){ var p=posNow(f), w=W(p[0],p[1]), bu=u.block.userData, yaw=u.yaw||0, c=Math.cos(yaw), sn=Math.sin(yaw);
          for(var a=-2;a<=2;a++) for(var b=-2;b<=2;b++){ var lx=a/4*bu.W0*bu.sw, lz=b/4*bu.D0*bu.sd; pts.push([w[0]+lx*c+lz*sn,w[1]-lx*sn+lz*c]); } }
        else pts.push([it.world.x,it.world.z]);   /* a corps counter has no footprint: its anchor */
        for(var k=0;k<pts.length&&!hit;k++){ _lv3.set(pts[k][0],displayHeight(pts[k][0],pts[k][1]),pts[k][1]).project(camera);
          if(_lv3.z>1) continue;
          mlHoverAt((_lv3.x*0.5+0.5)*innerWidth,(-_lv3.y*0.5+0.5)*innerHeight);
          if(ML.hover===f){ mlLayout(); hit=ML.items[it.key].state==="on"; } }
        ML.hover=null; mlLayout();
        if(!hit) R.reachHover.push(s.n+": "+it.key);
      });
      /* the legend: never over the dispatch; its rows are what is drawn */
      var lg=document.querySelector(".legend"), dp=document.querySelector(".dispatch");
      if(shown(lg)&&shown(dp)&&cross(box(lg),box(dp))) R.legend.push(s.n);
      if(shown(lg)){ var row=function(k){ var e=lg.querySelector('[data-lg="'+k+'"]'); return !!e&&!e.hidden; };
        var O=OVERLAYS[curPhase]||{};
        if(row("plan")!==!!planSide) R.ctx.push(s.n+": the plan row");
        if(row("analysis")!==!!layerOn.analysis) R.ctx.push(s.n+": the terrain-study row");
        if(row("halt")!==(layerOn.arrows&&(O.arrows||[]).some(function(a){ return a.kind==="halt"; }))) R.ctx.push(s.n+": the halt row");
        if(row("bound")!==(layerOn.arrows&&(O.bounds||[]).length>0)) R.ctx.push(s.n+": the boundary row");
        if(row("badge")!==(mode!=="terrain"&&layerOn.symbols)) R.ctx.push(s.n+": the badge row");
        if(row("foot")!==(mode!=="staff"&&isTrueScale())) R.ctx.push(s.n+": the footprint rows");
        if(row("wood")!==(mode==="staff")||row("village")!==(mode==="staff")) R.ctx.push(s.n+": the paper map's wood and village rows");
        if(!row("mere")) R.ctx.push(s.n+": the meres' row (pond outlines schematic)");
        if((getComputedStyle(document.getElementById("goingkey")).display!=="none")!==goingOn) R.ctx.push(s.n+": the going rows"); }
      if(s.layers){ setPlan(planSide); if(goingOn) toggle("#going"); if(layerOn.analysis) toggle('.layer-btn[data-l="analysis"]'); }
      if(s.first) closeFirst(null);
      if(s.tour) exitTour();
    });
    select(null,null); setPresentation("study");
    document.body.classList.remove("st-still");
    ck("map layer: 0 overlaps, and nothing over an interface panel or an arrow head", !R.overlaps.length&&!R.panel.length&&!R.head.length&&R.placed>0,
      R.placed+" items drawn in "+S.length+" states (the first-run card, the paper map and a tour stop on each map among them), against "+R.heads+" arrow heads"+(R.overlaps.length?"; OVERLAP: "+R.overlaps.slice(0,4).join(", "):"")+
      (R.panel.length?"; UNDER A PANEL: "+R.panel.slice(0,4).join(", "):"")+(R.head.length?"; OVER A HEAD: "+R.head.slice(0,4).join(", "):""));
    ck("map layer: the selection, the highlighted family and the labels of live events are never dropped", !R.keep.length&&R.keepN>0,
      R.keepN+" such items in view"+(R.keep.length?"; NOT DRAWN: "+R.keep.join(", "):", all drawn"));
    ck("map layer: every formation on the map is focusable and named (name, side, echelon, strength, status, grade); Enter selects it",
      !R.a11y.length&&R.names>0&&/^Enter/.test(R.enter), R.names+" formation items; "+R.enter+(R.a11y.length?"; BAD: "+R.a11y.slice(0,3).join(", "):""));
    ck("map layer: every dropped formation is reachable from the keyboard and by hovering its position", R.dropTested>0&&!R.reachKey.length&&!R.reachHover.length,
      R.dropTested+" dropped formations tested"+(R.reachKey.length?"; NOT BY KEYBOARD: "+R.reachKey.join(", "):"")+(R.reachHover.length?"; NOT BY HOVER: "+R.reachHover.join(", "):""));
    ck("map layer: lays out only in a drawn frame (render on demand)", R.idle, R.idle?"no pass without a frame; one pass per frame, in "+S.length+" states":"a pass ran outside a drawn frame, or none in one");
    ck("legend: never over the dispatch, and its rows are what the view draws", !R.legend.length&&!R.ctx.length,
      S.length+" states"+(R.legend.length?"; OVER THE DISPATCH: "+R.legend.join(", "):"")+(R.ctx.length?"; WRONG ROWS: "+R.ctx.join(", "):""));
  }
  /* ---- Stage 2E: the paper map (docs/STAGE2_SPEC.md sections G and J; decisions 19, 25 and 29), at the current setting:
     the north bearing, one scale across the view and the scale bar, the field framed in the free part of the screen, what
     is drawn and what is hidden, and the controls (drag, wheel and keys through the handlers a visitor drives). Returns what
     must not change with the setting, compared across settings by paperCross. ---- */
  function paperChecks(ck){
    var o={}, i, VW=renderer.domElement.clientWidth||innerWidth, VH=viewH(), el=renderer.domElement;
    document.body.classList.add("st-still");
    setPresentation("study"); if(mode!=="staff") setMode("staff");
    setClock(570,{instant:true,force:true,camera:false}); finishTween(); select(null,null);
    tween=null; freeCam=true; MAPCAM.frameField(true); settle(20,true); renderFrame();
    function scr(mp){ var w=W(mp[0],mp[1]); _lv3.set(w[0],groundY(w[0],w[1]),w[1]).project(camera); return [(_lv3.x*0.5+0.5)*VW,(-_lv3.y*0.5+0.5)*VH]; }
    function perKm(mp){ var g=GEOREF.toGeo(mp[0],mp[1]), dl=0.5/(111.32*Math.cos(g[0]*Math.PI/180)), a=scr(GEOREF.toMap(g[0],g[1]-dl)), b=scr(GEOREF.toMap(g[0],g[1]+dl));
      return Math.hypot(a[0]-b[0],a[1]-b[1]); }
    function bearing(){ var pb=GEOREF.GT.pratzeberg.map, g=GEOREF.toGeo(pb[0],pb[1]), c=scr(pb), u=scr(GEOREF.toMap(g[0]+0.01,g[1]));
      return Math.atan2(u[0]-c[0],-(u[1]-c[1]))*180/Math.PI; }
    /* flat, and the setting kept for the landscape */
    var P=groundMesh.geometry.attributes.position.array, ymax=0; for(i=1;i<P.length;i+=3) ymax=Math.max(ymax,Math.abs(P[i]));
    var pal=0; for(i=0;i<palPaper.length;i+=7) pal=(pal*31+Math.round(palPaper[i]*65535))%2147483647;
    var geo=0; curOv.updateMatrixWorld(true); curOv.traverse(function(q){ if(!q.userData.drape||!q.geometry) return; var A=q.geometry.attributes.position.array;
      for(var k=0;k<A.length;k+=5) geo=((geo*31+Math.round(A[k]*1000))%2147483647+2147483647)%2147483647; });
    o.pal=pal; o.geo=geo; o.flat=ymax;
    ck("paper map: the ground is drawn flat and hillshaded at its own factor, whatever the setting", ymax===0&&DISPLAY.flat&&groundPalette==="paper",
      "largest |drawn height| "+ymax+"; hillshade \u00d7"+fmtFactor(PAPER_HILLSHADE)+" (palette checksum "+pal+"); the setting kept for the landscape: \u00d7"+fmtFactor(DISPLAY.factor));
    /* north, one scale, the scale bar */
    var brg=bearing(), GT=GEOREF.GT, K=[GT.pratzeberg.map,GT.sokolnitz.map,GT.santon.map,GT.satschan.map].map(perKm);
    var kmax=Math.max.apply(null,K), kmin=Math.min.apply(null,K), spread=(kmax-kmin)/kmax, kmean=K.reduce(function(a,b){ return a+b; },0)/K.length;
    ck("paper map: true north is up (within 0.5\u00b0)", Math.abs(brg)<=0.5, "GEOREF.NORTH on screen "+brg.toFixed(3)+"\u00b0 from up (the frame is rotated "+GEOREF.ROT_DEG.toFixed(2)+"\u00b0)");
    var lab=(document.getElementById("sb-label").textContent||""), km=/km/.test(lab)?parseFloat(lab):parseFloat(lab)/1000, bw=document.getElementById("sb-fill").getBoundingClientRect().width;
    var sbErr=Math.abs(bw-km*kmean)/(km*kmean);
    o.pxkm=kmean;
    ck("paper map: one scale across the view (four places within 1%), and the scale bar correct to 1%", spread<=0.01&&sbErr<=0.01,
      "px per true km at the Pratzeberg, Sokolnitz, the Santon, Satschan: "+K.map(function(k){ return k.toFixed(2); }).join(", ")+" (spread "+(100*spread).toFixed(3)+"%); scale bar "+lab+" = "+bw.toFixed(1)+" px against "+(km*kmean).toFixed(1)+" (error "+(100*sbErr).toFixed(2)+"%)");
    /* the whole modelled ground inside the free part of the screen */
    var PN=mlPanels(), n=0, bad=0;
    for(i=0;i<=36;i++) for(var j=0;j<=31;j++){ var x=-180+i*10, z=-155+j*10; _lv3.set(x,0,z).project(camera); var sx=(_lv3.x*0.5+0.5)*VW, sy=(-_lv3.y*0.5+0.5)*VH; n++;
      var off=sx<0||sy<0||sx>VW||sy>VH; for(var k2=0;!off&&k2<PN.length;k2++){ var q=PN[k2]; if(sx>=q[0]&&sx<=q[2]&&sy>=q[1]&&sy<=q[3]) off=true; } if(off) bad++; }
    ck("paper map: the whole field is framed inside the part of the screen no panel covers", bad===0,
      (n-bad)+" of "+n+" points of the modelled ground on screen and clear of every panel; "+(1/(worldPerPx(null)*GEOREF.KM_PER_MAP*2)).toFixed(1)+" px per km in the free rectangle "+MAPCAM.freeRect().join(","));
    /* drawn and hidden */
    var hidden=[];
    [["trees",world.trees],["conifers",world.conifers],["scrub",world.scrub],["houses",world.houses],["roofs",world.roofs],["spires",world.spires],["chimneys",world.chimneys],
     ["mist",world.mist],["sky dome",world.dome]].forEach(function(q){ if(q[1]&&visibleUp(q[1])) hidden.push(q[0]); });
    Object.keys(units).forEach(function(id){ var r=units[id]; if(r.block&&visibleUp(r.block)) hidden.push("figures of "+id); if(r.foot&&r.foot.visible) hidden.push("footprint of "+id);
      if(r.smoke&&r.smoke.visible) hidden.push("smoke of "+id); if(r.dust&&r.dust.visible) hidden.push("dust of "+id); });
    var drapes=0; curOv.traverse(function(q){ if(q.userData.drape&&q.userData.drape.kind!=="head") drapes++; });
    var counters=Object.keys(ML.items).filter(function(k){ var it=ML.items[k]; return it.mode==="counter"&&it.state==="on"; }).length;
    var drawn=[["hillshade",groundPalette==="paper"&&visibleUp(groundMesh)],["contours",!layerOn.contours||visibleUp(world.contours)],
      ["village footprints",visibleUp(world.paper)&&world.paper.userData.villages>0],["woods symbology",visibleUp(world.paper)&&world.paper.userData.woods>0],
      ["water",world.water.every(function(w2){ return visibleUp(w2); })],["draped arrows",drapes>0],["counters",counters>0]];
    var missing=drawn.filter(function(q){ return !q[1]; }).map(function(q){ return q[0]; });
    /* Stage 2F: the paper map's cover, its ground alone and with its woods and footprints; its roads and streams draped flat */
    var pc=coverChecks(ck,true); o.cover=pc.hash; o.coverPaper=pc.paper;
    var rdp=roadDrape();
    ck("paper map: roads and streams draped on the flat sheet, every vertex at its lift", rdp.n>0&&rdp.worst<=0.05&&rdp.mids>0&&!rdp.under,
      rdp.n+" vertices in "+rdp.meshes+" meshes; worst |y - groundY - lift| "+rdp.worst.toExponential(1)+"; "+rdp.under+" of "+rdp.mids+" edge midpoints under the sheet");
    ck("paper map: no figures, roofs, chimneys, houses or 3D trees drawn; hillshade, contours, village footprints, water, woods, draped arrows and counters drawn",
      !hidden.length&&!missing.length, (hidden.length?"DRAWN: "+hidden.slice(0,6).join(", ")+"; ":"")+(missing.length?"MISSING: "+missing.join(", ")+"; ":"")+
      world.paper.userData.villages+" village footprints, "+world.paper.userData.woods+" woods, "+drapes+" draped overlay meshes, "+counters+" counters");
    /* the controls, through the handlers: a drag pans (the ground under the pointer stays under it), the wheel zooms toward
       the cursor, the keys pan; nothing orbits (north stays up, the landscape eye does not move) */
    var fr=MAPCAM.freeRect(), cx=(fr[0]+fr[2])/2, cy=(fr[1]+fr[3])/2, spc=el.setPointerCapture, land=landCam.position.clone();
    el.setPointerCapture=function(){};
    function pe(t,x,y,b){ return new PointerEvent(t,{pointerId:1,isPrimary:true,pointerType:"mouse",clientX:x,clientY:y,buttons:b,button:0,bubbles:true,cancelable:true}); }
    var g0=MAPCAM.toGround(cx,cy);
    el.dispatchEvent(pe("pointerdown",cx,cy,1)); for(i=1;i<=10;i++) el.dispatchEvent(pe("pointermove",cx+12*i,cy+7*i,1)); window.dispatchEvent(pe("pointerup",cx+120,cy+70,0));
    var a0=MAPCAM.toScreen(g0[0],g0[1]), dragErr=Math.hypot(a0[0]-(cx+120),a0[1]-(cy+70));
    var wx=fr[0]+(fr[2]-fr[0])*0.3, wy=fr[1]+(fr[3]-fr[1])*0.7, g1=MAPCAM.toGround(wx,wy), w0=MAPCAM.state().wpp;
    for(i=0;i<3;i++) el.dispatchEvent(new WheelEvent("wheel",{deltaY:-120,clientX:wx,clientY:wy,bubbles:true,cancelable:true}));
    var a1=MAPCAM.toScreen(g1[0],g1[1]), zoomErr=Math.hypot(a1[0]-wx,a1[1]-wy), w1=MAPCAM.state().wpp;
    var s0=MAPCAM.state(), clk=clock; ML.root.focus({preventScroll:true});
    ML.root.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowRight",bubbles:true,cancelable:true}));
    var s1=MAPCAM.state(), keyPx=Math.hypot(s1.x-s0.x,s1.z-s0.z)/s1.wpp; ML.root.blur();
    el.setPointerCapture=spc; renderFrame();
    var brg2=bearing(), still=landCam.position.distanceTo(land);
    ck("paper map: a drag pans, the wheel zooms toward the cursor (the ground under it within 1 px), the keys pan; nothing orbits",
      dragErr<=1&&zoomErr<=1&&w1<w0&&keyPx>1&&clock===clk&&Math.abs(brg2)<=0.5&&still<1e-9,
      "drag 139 px: the ground point under the pointer ends "+dragErr.toFixed(3)+" px from it; three wheel steps ("+(w0/w1).toFixed(3)+" times closer): "+zoomErr.toFixed(3)+
      " px; the right arrow key pans "+keyPx.toFixed(0)+" px, clock unchanged; north still "+brg2.toFixed(3)+"\u00b0 from up; the landscape eye moved "+still.toFixed(6));
    /* back to the landscape: the relief as it was */
    setMode("terrain"); settle(4,true);
    var gw=0; for(i=0;i<300;i++){ var ix=(i*37)%(GROUND_NX+1), iz=(i*53)%(GROUND_NZ+1), gx=-GROUND_W/2+ix*GROUND_W/GROUND_NX, gz=-GROUND_D/2+iz*GROUND_D/GROUND_NZ;
      gw=Math.max(gw,Math.abs(groundY(gx,gz)-displayHeight(gx,gz))); }
    ck("paper map: leaving it redraws the relief at the setting", !DISPLAY.flat&&gw<1e-3&&displayScale()===DISPLAY.factor/GEOREF.EXAG,
      "|groundY - displayHeight| at mesh vertices "+gw.toExponential(1)+" at \u00d7"+fmtFactor(DISPLAY.factor));
    document.body.classList.remove("st-still");
    return o;
  }
  function paperCross(B){
    var F=DISPLAY.settings, M=B[F[0]], bad=F.filter(function(f){ return B[f].pal!==M.pal||B[f].geo!==M.geo||B[f].flat!==0||Math.abs(B[f].pxkm-M.pxkm)>1e-6||
      B[f].cover!==M.cover||B[f].coverPaper!==M.coverPaper; });
    return [{name:"paper map: identical at every relief setting (flat ground, the same hillshade, the same draped overlays and the same cover; decision 19)", ok:!bad.length,
      detail:F.map(function(f){ return fmtFactor(f)+"\u00d7: hillshade "+B[f].pal+", overlays "+B[f].geo+", cover "+B[f].coverPaper+", "+B[f].pxkm.toFixed(3)+" px/km"; }).join("; ")}];
  }
  function stage2bChecks(B){
    var out2=[], F=DISPLAY.settings, M=B[GEOREF.EXAG];
    function ck2(name,ok,detail){ out2.push({name:name,ok:!!ok,detail:detail}); }
    var relBad=F.filter(function(f){ return Math.abs(B[f].relief-B[f].s*M.relief)>0.01; });
    ck2("relief: the drawn Pratzeberg-Sokolnitz relief is s times the model's at every factor", !relBad.length,
      F.map(function(f){ return fmtFactor(f)+"\u00d7 "+B[f].relief.toFixed(3)+" (s x model "+(B[f].s*M.relief).toFixed(3)+"; analytic "+B[f].analytic.toFixed(3)+")"; }).join("; ")+" units");
    var goBad=F.filter(function(f){ return B[f].going!==M.going; });
    ck2("going: the going classes (from the model slope) are identical at every factor", !goBad.length,
      "palette checksum "+F.map(function(f){ return fmtFactor(f)+"\u00d7 "+B[f].going; }).join(", ")+"; thresholds "+GOING_TRUE_DEG.map(function(d){ return d.toFixed(2); }).join(" and ")+" true degrees");
    var stBad=F.filter(function(f){ return B[f].std.n===0||B[f].std.worst>0.01; });
    ck2("standards: pole top / figure height is the provisional ratio "+STD_RATIO+" for every block", !stBad.length,
      F.map(function(f){ return fmtFactor(f)+"\u00d7 "+B[f].std.n+" standards, worst deviation "+B[f].std.worst.toFixed(4); }).join("; "));
    var lgBad=F.filter(function(f){ var t=B[f].legend; return f===1 ? !/true scale/.test(t)||!/footprints/.test(t)
      : t.indexOf("\u00d7"+fmtFactor(f))<0||!/true scale/.test(t)||!/45\u201370/.test(t)||!/10\u201315/.test(t); });
    ck2("legend: states the current factor, relative to true scale, and the two named symbol scales", !lgBad.length,
      F.map(function(f){ return fmtFactor(f)+"\u00d7: \""+B[f].legend+"\""; }).join("; "));
    var stale=[], model=GEOREF.EXAG.toFixed(0);
    F.forEach(function(f){ var o=B[f];
      if(o.sources.indexOf("exaggerated about "+fmtFactor(f)+" times")<0) stale.push(fmtFactor(f)+"\u00d7 sources sheet does not state it");
      if(o.dossier.indexOf("\u00d7"+fmtFactor(f)+" vertically")<0) stale.push(fmtFactor(f)+"\u00d7 place dossier does not state it");
      if(f!==GEOREF.EXAG){ if(o.sources.indexOf("about "+model+" times")>=0) stale.push(fmtFactor(f)+"\u00d7 sources sheet states "+model);
        if(o.dossier.indexOf("\u00d7"+model+" ")>=0) stale.push(fmtFactor(f)+"\u00d7 dossier states \u00d7"+model);
        if(o.legend.indexOf("\u00d7"+model)>=0) stale.push(fmtFactor(f)+"\u00d7 legend states \u00d7"+model); } });
    ck2("no stale exaggeration: the sources sheet, place dossier and legend state the display factor, never GEOREF.EXAG as drawn", !stale.length,
      stale.length?stale.join("; "):"checked at "+F.map(fmtFactor).join(", ")+" (the model's own "+GEOREF.EXAG+" appears only when it is the display factor)");
    var t1=B[1];
    ck2("true scale: at 1\u00d7 no figure, standard, building, tree or scrub is drawn, and every formation on the field has its footprint",
      t1.landscape===0&&t1.blocks===0&&t1.feet===t1.onField&&t1.onField>0,
      t1.onField+" formations on the field at "+fmtClock(PHASES[3].t0+22)+", "+t1.feet+" footprints, "+t1.blocks+" figure blocks, "+t1.landscape+" landscape layers drawn");
    return out2;
  }
  /* ---- Stage 2F: the land cover as drawn (docs/STAGE2_SPEC.md section J, 2F; decision 28) ----
     The ground is rendered straight down, one pixel per COVER_H world units (7.9 m) over the whole modelled ground, with the
     ground shader's own class output (uDebug); on the paper map its wood and village fills are drawn over it in their class.
     The cover polygon of a class is where the model's classifier, at the point itself, gives it: coverClass(x, z,
     localHeight(x, z)), at each pixel's centre. For each class the error is the largest distance from a pixel where the
     drawing and the model disagree about that class (one says it, the other not) to the model's edge of it, less half a
     pixel: "along each cover polygon's edge, how far from the edge the drawn cover changes". */
  var COVER_H=0.125, COVER_TOL_M=20, COVER_NAMES=["field","meadow","marsh","water","wood","village","vineyard","track"], _covTruth=null;
  function coverGrid(){ return {nx:Math.round(GROUND_W/COVER_H), nz:Math.round(GROUND_D/COVER_H), x0:-GROUND_W/2, z0:-GROUND_D/2}; }
  function coverTruth(){   /* the model's classes at the pixel centres: the same at every factor and on the paper map */
    if(_covTruth) return _covTruth;
    var g=coverGrid(), T=new Uint8Array(g.nx*g.nz);
    for(var j=0;j<g.nz;j++){ var z=g.z0+(j+0.5)*COVER_H; for(var i=0;i<g.nx;i++){ var x=g.x0+(i+0.5)*COVER_H; T[j*g.nx+i]=coverClass(x,z,localHeight(x,z)); } }
    return (_covTruth=T);
  }
  /* the drawn classes, row j from the smallest z; 255 where nothing is drawn. paper: the paper map's wood and village fills too */
  function coverRender(paper){
    var g=coverGrid(), rt=new THREE.WebGLRenderTarget(g.nx,g.nz,{minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter});
    var cam=new THREE.OrthographicCamera(g.x0,g.x0+GROUND_W,-g.z0,-(g.z0+GROUND_D),1,4000);
    cam.position.set(0,2000,0); cam.up.set(0,0,-1); cam.lookAt(0,0,0); cam.updateMatrixWorld(); cam.updateProjectionMatrix();
    var hid=[], mats=[], U=groundMesh.material.userData.U, cc=new THREE.Color(), ca=renderer.getClearAlpha(), tm=renderer.toneMapping, oe=renderer.outputEncoding;
    renderer.getClearColor(cc);
    scene.children.forEach(function(o){ if(o!==groundMesh&&!(paper&&o===world.paper)&&o.visible){ o.visible=false; hid.push(o); } });
    if(paper) world.paper.children.forEach(function(o){ var k=o.userData.cover;
      if(k===undefined){ if(o.visible){ o.visible=false; hid.push(o); } return; }
      mats.push([o,o.material]); o.material=new THREE.MeshBasicMaterial({color:new THREE.Color(k/255,0,0),fog:false,toneMapped:false,side:THREE.DoubleSide}); });
    U.uDebug.value=1; renderer.toneMapping=THREE.NoToneMapping; renderer.outputEncoding=THREE.LinearEncoding;
    renderer.setClearColor(0xffffff,1); renderer.setRenderTarget(rt); renderer.clear(); renderer.render(scene,cam);
    var buf=new Uint8Array(g.nx*g.nz*4); renderer.readRenderTargetPixels(rt,0,0,g.nx,g.nz,buf);
    renderer.setRenderTarget(null); renderer.setClearColor(cc,ca); renderer.toneMapping=tm; renderer.outputEncoding=oe; U.uDebug.value=0;
    hid.forEach(function(o){ o.visible=true; }); mats.forEach(function(m){ m[0].material.dispose(); m[0].material=m[1]; });
    rt.dispose(); requestRender(2);
    var D=new Uint8Array(g.nx*g.nz);
    for(var q=0;q<g.nz;q++){ var j=g.nz-1-q; for(var i=0;i<g.nx;i++) D[j*g.nx+i]=buf[(q*g.nx+i)*4]; }
    return D;
  }
  /* per class, the largest distance (m) from a disagreeing pixel to the model's edge of that class; T the model's classes */
  function coverError(D,T){
    var g=coverGrid(), nx=g.nx, nz=g.nz, R=64, worst={}, wrong={}, far={}, blank=0;
    function near(i,j,test){ var best=1e9;   /* the nearest pixel where test holds, searched in square rings */
      for(var r=1;r<=R&&r<=best;r++) for(var dj=-r;dj<=r;dj++) for(var di=-r;di<=r;di+=(Math.abs(dj)===r?1:2*r)){
        var a=i+di, b=j+dj; if(a<0||b<0||a>=nx||b>=nz||!test(T[b*nx+a])) continue; var d=Math.sqrt(di*di+dj*dj); if(d<best) best=d; }
      return best; }
    for(var j=0;j<nz;j++) for(var i=0;i<nx;i++){ var q=j*nx+i, t=T[q], d=D[q]; if(d===t) continue;
      if(d===255){ blank++; continue; }
      [[t,function(v){ return v!==t; }],[d,function(v){ return v===d; }]].forEach(function(c){
        var k=c[0], e=near(i,j,c[1]); wrong[k]=(wrong[k]||0)+1; if(e>R) far[k]=(far[k]||0)+1;
        var m=Math.max(0,e-0.5)*COVER_H*GEOREF.M_PER_WORLD; if(!(m<=(worst[k]||0))) worst[k]=m; }); }
    var per=COVER_NAMES.map(function(n,k){ return {name:n, m:worst[k]||0, px:wrong[k]||0, far:far[k]||0}; });
    return {per:per, blank:blank, ok:!blank&&per.every(function(c){ return c.m<=COVER_TOL_M&&!c.far; }),
      text:per.map(function(c){ return c.name+" "+(c.far?">"+Math.round(R*COVER_H*GEOREF.M_PER_WORLD):c.m.toFixed(1))+" m"; }).join(", ")+
        " (pixels disagreeing: "+per.reduce(function(a,c){ return a+c.px; },0)+" of "+(nx*nz)+(blank?"; NOT DRAWN: "+blank:"")+")"};
  }
  function coverHash(D){ var h=0; for(var i=0;i<D.length;i+=3) h=(h*31+D[i])%2147483647; return h; }
  /* the paper map's classes: the model's, except that a village footprint is the model's cover disc (covVill > 0.55; owner,
     on the 2E review), drawn over whatever class the ground has there */
  function paperTruth(T){ var g=coverGrid(), P=new Uint8Array(T), fp=0, over={};
    for(var j=0;j<g.nz;j++){ var z=g.z0+(j+0.5)*COVER_H; for(var i=0;i<g.nx;i++){ var x=g.x0+(i+0.5)*COVER_H, q=j*g.nx+i;
      if(covAt(covVill,x,z)>PAPER_SYM.village.level){ fp++; if(T[q]!==5){ over[COVER_NAMES[T[q]]]=(over[COVER_NAMES[T[q]]]||0)+1; } P[q]=5; } } }
    return {P:P, fp:fp, over:over}; }
  function coverChecks(ck,paper){
    var T=coverTruth(), D=coverRender(false), e=coverError(D,T), o={hash:coverHash(D)};
    ck("cover: along each class's edge the drawn cover changes within "+COVER_TOL_M+" m of the model's edge"+(paper?" (the paper map's ground)":""), e.ok, e.text);
    if(paper){ var pt=paperTruth(T), P=coverRender(true), e2=coverError(P,pt.P), a=COVER_H*COVER_H*GEOREF.M_PER_WORLD*GEOREF.M_PER_WORLD/1e6;
      o.paper=coverHash(P);
      ck("cover: on the paper map, with its woods and village footprints, every class's drawn edge within "+COVER_TOL_M+" m of its edge", e2.ok,
        e2.text+"; the village footprints are the model's cover disc (owner decision): "+(pt.fp*a).toFixed(2)+" km\u00b2, of which the model classes "+
        Object.keys(pt.over).map(function(k){ return k+" "+(pt.over[k]*a).toFixed(2); }).join(", ")+" km\u00b2 (drawn under them on the landscape)"); }
    o.per=e.per; return o;
  }
  /* roads and streams (Stage 2F): every vertex at its lift above the drawn ground, and no edge of theirs cutting under it
     (the midpoint of every triangle edge above groundY) */
  function roadDrape(){
    var worst=0, where="", n=0, meshes=0, mids=0, under=0, v=new THREE.Vector3(), w=new THREE.Vector3();
    world.roads.concat(world.water).forEach(function(o){ var d=o.userData.drape; if(!d) return; meshes++; o.updateMatrixWorld(true);
      var P=o.geometry.attributes.position, I=o.geometry.index?o.geometry.index.array:[];
      for(var i=0;i<P.count;i++){ v.fromBufferAttribute(P,i).applyMatrix4(o.matrixWorld);
        var e=Math.abs(v.y-groundY(v.x,v.z)-d.lift); n++; if(e>worst){ worst=e; where=d.kind; } }
      for(var t=0;t<I.length;t+=3) for(var k=0;k<3;k++){ v.fromBufferAttribute(P,I[t+k]).applyMatrix4(o.matrixWorld); w.fromBufferAttribute(P,I[t+(k+1)%3]).applyMatrix4(o.matrixWorld);
        mids++; if((v.y+w.y)/2<groundY((v.x+w.x)/2,(v.z+w.z)/2)) under++; } });
    return {worst:worst,where:where,n:n,meshes:meshes,mids:mids,under:under};
  }
  /* the trees and scrub of the woods (Stage 2F; owner, on the 2E review): every one inside the wood as the land cover has it */
  function woodPlacement(){
    var m=new THREE.Matrix4(), p=new THREE.Vector3(), R={wood:0,edge:0,village:0,stream:0,out:[],notModel:0};
    world.trees.children.concat(world.conifers.children,[world.scrub]).forEach(function(im){ var K=im.userData.kinds||[];
      for(var i=0;i<im.count;i++){ var k=K[i]; if(!k) continue; R[k]++; if(k!=="wood"&&k!=="edge") continue;
        im.getMatrixAt(i,m); p.setFromMatrixPosition(m);
        if(drawnCover(p.x,p.z)!==4) R.out.push(k+" at "+p.x.toFixed(1)+","+p.z.toFixed(1));
        if(coverClass(p.x,p.z,localHeight(p.x,p.z))!==4) R.notModel++; } });
    return R;
  }
  /* Stage 4B (docs/STAGE4_SPEC.md section A.6): the light. lightChecks runs at each display factor, lightDayChecks once. */
  function azOf(v){ var N=GEOREF.NORTH, n=v.x*N[0]+v.z*N[1], e=v.x*-N[1]+v.z*N[0]; return (Math.atan2(e,n)*180/Math.PI+360)%360; }
  function angDiff(a,b){ var d=Math.abs(a-b)%360; return d>180?360-d:d; }
  function lightChecks(ck,fct){
    var keep=clock, worstAz=0, worstAlt=0, worstLight=0, n=0, at1=0;
    for(var k=0;k<40;k++){ var t=T_MIN+(T_MAX-T_MIN)*k/39, s=SUN_DAY.at(t); setClock(t,{instant:true,camera:false}); finishTween(); applyLight(true); placeLights();
      if(s.geo<0||s.alt<0.5) continue; n++;
      var d=sunDir.clone().normalize(), real=sun.position.clone().sub(sun.target.position).normalize();
      worstAz=Math.max(worstAz,angDiff(azOf(d),s.az)); worstAlt=Math.max(worstAlt,Math.abs(Math.asin(d.y)*180/Math.PI-drawnAltitude(s.alt)));
      worstLight=Math.max(worstLight,real.angleTo(d)*180/Math.PI);
      if(fct===1) at1=Math.max(at1,Math.abs(Math.asin(d.y)*180/Math.PI-s.alt)); }
    ck("light: the drawn sun is the computed sun, its altitude corrected to the display factor (decision 68)", n>0&&worstAz<=0.1&&worstAlt<=0.1&&worstLight<=0.1&&at1<=0.1,
      n+" of 40 clocks with the sun up: worst azimuth "+worstAz.toFixed(3)+" deg, worst altitude against tan(alt) x "+fmtFactor(fct)+" "+worstAlt.toFixed(3)+
      " deg, the shadow-casting light against it "+worstLight.toFixed(3)+" deg"+(fct===1?"; at 1x against the true altitude "+at1.toFixed(3)+" deg":""));
    /* the shadow box covers the drawn ground under the free rectangle (within SHADOW_FIT.R of the target) from every vantage */
    setClock(600,{instant:true,camera:false}); finishTween(); applyLight(true);
    var outside=[], pts=0, vw=renderer.domElement.clientWidth||innerWidth, vh=renderer.domElement.clientHeight||innerHeight, q=new THREE.Vector3();
    Object.keys(VANTAGE).forEach(function(vk){ placeCamera(VANTAGE[vk]); syncViewOffset(true); placeLights(); sun.shadow.updateMatrices(sun);
      var fr=landFreeRect(), T=orbitTarget, bad=0;
      for(var j=0;j<=6;j++) for(var i=0;i<=8;i++){ var g=groundAt(fr[0]+(fr[2]-fr[0])*i/8,fr[1]+(fr[3]-fr[1])*j/6); if(!g) continue;
        if(Math.hypot(g[0]-T.x,g[1]-T.z)>SHADOW_FIT.R) continue; pts++;
        q.set(g[0],groundY(g[0],g[1]),g[1]).applyMatrix4(sun.shadow.matrix);
        if(q.x<0||q.x>1||q.y<0||q.y>1||q.z<0||q.z>1) bad++; }
      if(bad) outside.push(vk+" "+bad); });
    ck("light: the shadow map covers the drawn ground under the free rectangle from every vantage", pts>0&&!outside.length,
      pts+" ground points in "+Object.keys(VANTAGE).length+" vantages, box "+SHADOW_FIT.ext+" units at the last"+(outside.length?"; OUTSIDE: "+outside.join(", "):""));
    setClock(keep,{instant:true,camera:false}); finishTween(); applyLight(true);
  }
  function lightDayChecks(){
    var out=[], keep=clock, bad=[], first=null, last=null;
    for(var t=T_MIN;t<=T_MAX;t+=5){ var s=SUN_DAY.at(t); setClock(t,{instant:true,camera:false}); finishTween(); applyLight(true);
      var on=sunDisc.material.opacity>0, up=s.geo>-0.833; if(on!==up) bad.push(fmtClock(t)+" disc "+on+", sun up "+up); if(on){ if(first===null) first=t; last=t; } }
    out.push({name:"light: the sun disc is drawn exactly while the sun's upper limb is above the horizon, at its true altitude", ok:!bad.length&&first!==null,
      detail:"every 5 minutes 04:00-18:00: drawn from "+(first===null?"-":fmtClock(first))+" to "+(last===null?"-":fmtClock(last))+" (sunrise and sunset, apparent time: 07:45, 16:15)"+(bad.length?"; WRONG: "+bad.slice(0,6).join("; "):"")});
    /* continuity: no step at a phase boundary larger than the largest one-minute change elsewhere in the day */
    function vec(t){ var L=lightAt(t); return [L.dir.x,L.dir.y,L.dir.z,L.i,L.c.r,L.c.g,L.c.b,L.hemi,L.fill,L.grade[4],L.grade[5],L.grade[2],L.grade[3],L.bg.r,L.bg.g,L.bg.b,L.disc]; }
    var prev=vec(T_MIN), bnd={}, inMax=0, bMax=0, where="";
    PHASES.forEach(function(p){ bnd[p.t0]=1; });
    for(var m=T_MIN+1;m<=T_MAX;m++){ var v=vec(m), d=0; for(var k=0;k<v.length;k++) d=Math.max(d,Math.abs(v[k]-prev[k])); prev=v;
      if(bnd[m]){ if(d>bMax){ bMax=d; where=fmtClock(m); } } else inMax=Math.max(inMax,d); }
    out.push({name:"light: continuous in the clock, no step at a phase boundary", ok:bMax<=inMax+1e-9,
      detail:"largest one-minute change at a phase boundary "+bMax.toFixed(4)+" ("+where+"), elsewhere "+inMax.toFixed(4)});
    var comp=FX.on?FX.matComp.fragmentShader:"";
    out.push({name:"light: no shadow toe in the grade, no baked hillshade on the landscape (decision 70)", ok:(!FX.on||comp.indexOf("tt*tt")<0)&&GROUND_FRAG_MAIN.indexOf("float shL=paper>0.5?sh:0.70;")>=0,
      detail:"composite "+(FX.on?(comp.indexOf("tt*tt")<0?"without the toe":"WITH THE TOE"):"off")+"; the ground shader "+(GROUND_FRAG_MAIN.indexOf("shL=paper>0.5?sh:0.70")>=0?"colours the landscape as the flat ground":"BAKES A HILLSHADE ON THE LANDSCAPE")});
    setClock(keep,{instant:true,camera:false}); finishTween(); applyLight(true);
    return out;
  }
  /* Stage 4D (docs/STAGE4_SPEC.md section D.4): pacing. paceChecks runs at each display factor, paceDayChecks once.
     playDay plays the clock from `from` to `to` at speed x with Follow on, through the app's own tickClock and followStep,
     stepMs of real time a step; pre and post run around each step. */
  function playDay(x,from,to,stepMs,pre,post){
    var sp=speed, real=0, n=0, c=presetFrame(PHASES[phaseAt(from)].cam);
    setSpeed(x); setClock(from,{instant:true,force:true,camera:false}); finishTween();
    landCam.position.set(c[0],c[1],c[2]); orbitTarget.set(c[3],c[4],c[5]); landCam.lookAt(orbitTarget); clampCamera(); syncViewOffset(true);
    freeCam=false; playing=true; dwellReset(); FOLLOW.T=null; FOLLOW.ev=null;
    while(playing&&clock<to&&n<400000){ if(pre) pre(); tickClock(stepMs); followStep(stepMs); real+=stepMs; n++; if(post) post(real); }
    stopPlay(); setSpeed(sp); finishTween();
    return real/1000;
  }
  var _pv4=new THREE.Vector3();
  function onFreeRect(p,fr){ _pv4.set(p[0],p[1],p[2]).project(landCam); if(_pv4.z>1||_pv4.z<-1) return false;
    var x=(_pv4.x*0.5+0.5)*(renderer.domElement.clientWidth||innerWidth), y=(-_pv4.y*0.5+0.5)*viewH(); return x>=fr[0]&&x<=fr[2]&&y>=fr[1]&&y<=fr[3]; }
  function paceChecks(ck,fct){
    var keep=clock, cam={p:landCam.position.clone(),t:orbitTarget.clone(),fc:freeCam};
    /* the day under Follow at half speed: the floor, the live events in the free rectangle, the screen speed, the drops */
    var fr=landFreeRect(), R={min:0,inn:0,below:0,spd:0,drops:0,dropAt:"",lastMin:-1}, pT=new THREE.Vector3(), pW=1;
    var sec=playDay(0.5,T_MIN,T_MAX,100,function(){ pT.copy(orbitTarget); pW=worldPerPx(orbitTarget); },function(){
      var p=landCam.position; if(p.y<camFloor(p.x,p.z)-1e-6) R.below++;
      R.spd=Math.max(R.spd,Math.hypot(orbitTarget.x-pT.x,orbitTarget.z-pT.z)/pW/0.1);
      var m=Math.floor(clock); if(m===R.lastMin) return; R.lastMin=m; R.min++;
      landCam.updateMatrixWorld(true);
      var live=liveEvents(clock).filter(function(o){ return o.w>=0.5; }), ok=live.every(function(o){ var w=W(o.e.p[0],o.e.p[1]); return onFreeRect([w[0],groundY(w[0],w[1]),w[1]],fr); });
      if(ok) R.inn++;
      if(m%10===0){ for(var k=0;k<12;k++){ settling=false; updateVisibility(); } mlLayout(); if(ML.stats.dropped>R.drops){ R.drops=ML.stats.dropped; R.dropAt=fmtClock(m); } } });
    var share=R.inn/Math.max(1,R.min);
    ck("Follow while playing: the day at \u00bd\u00d7 never under the floor, every live event in the free rectangle in at least 80% of its minutes, the ground's speed across the screen within "+FOLLOW.CAP+" px/s, drops never above 19 (section D.4)",
      !R.below&&share>=0.8&&R.spd<=FOLLOW.CAP+1e-6&&R.drops<=19,
      "played in "+sec.toFixed(1)+" s; "+R.below+" steps under the floor; every live event inside in "+(100*share).toFixed(1)+"% of "+R.min+" minutes; the target's largest speed "+R.spd.toFixed(1)+" px/s; drops at most "+R.drops+(R.dropAt?" ("+R.dropAt+")":""));
    /* draw-on: at 20 clocks inside each derived arrow's legs, its drawn tip on the formation's path at its progress */
    var nA=0, nT=0, worst=0, where="", bad=[];
    for(var ph=0;ph<PHASES.length;ph++){ rebuildOverlays(ph,true);
      DRAWON.slice().forEach(function(d){ var A=anchorList(d.a.leg[0]), i0=-1, i1=-1;
        A.forEach(function(q,k){ if(q.ph===d.a.leg[1]&&i0<0) i0=k; if(q.ph===d.a.leg[2]&&i0>=0) i1=k; });
        var w0=legWindow(A[i0],A[i0+1])[0], w1=legWindow(A[i1-1],A[i1])[1]; nA++;
        clock=w0-0.5; drawOnArrows(); if(d.r.layers[0].shaft.visible||!d.ghost.layers[1].shaft.visible) bad.push(d.a.label+": its marched part drawn, or the whole arrow not drawn, before its leg starts");
        clock=w1+0.5; drawOnArrows(); if(d.s!==1||d.ghost.layers[1].shaft.material.userData.op!==d.ghost.layers[1].shaft.material.userData.op0) bad.push(d.a.label+": not whole at full strength after its leg ends");
        for(var k=1;k<=20;k++){ var t=w0+(w1-w0)*k/21; clock=t; drawOnArrows(); var L=legAt(d.a.leg[0],t); if(!L||!L.b||L.u<=0) continue;
          if(d.r.layers.some(function(l){ return !!l.head; })||!d.ghost.layers.every(function(l){ return l.shaft.visible&&(!l.head||l.head.visible); })) bad.push(d.a.label+": the marched part has a head, or the whole arrow is not drawn, at "+fmtClock(t));
          var q=posAtClock(d.a.leg[0],t), w=W(q[0],q[1]), tip=d.tip||[1e9,1e9], e=Math.hypot(tip[0]-w[0],tip[1]-w[1]); nT++;
          if(e>worst){ worst=e; where=d.a.label+" at "+fmtClock(t); } } }); }
    clock=keep; rebuildOverlays(phaseAt(keep),true);
    ck("draw-on: a derived arrow's marched part ends on its formation's path at the formation's progress, within 0.5 units, without a head, over the whole arrow drawn faint; at full strength once its leg is complete (section D.4; decision 83)",
      nA>0&&nT>0&&worst<=0.5&&!bad.length, nA+" derived arrows, "+nT+" clocks inside their legs: the tip at most "+worst.toFixed(3)+" units from the formation"+(where?" ("+where+")":"")+(bad.length?"; WRONG: "+bad.slice(0,4).join("; "):""));
    setClock(keep,{instant:true,force:true,camera:false}); finishTween();
    landCam.position.copy(cam.p); orbitTarget.copy(cam.t); landCam.lookAt(orbitTarget); freeCam=cam.fc;
  }
  function paceDayChecks(){
    var out=[], keep=clock, keepRM=RM, cam={p:landCam.position.clone(),t:orbitTarget.clone(),fc:freeCam};
    /* the dwell: a dry run of the day at each speed takes its computed length within 1 s, one dwell at each start after 04:00 */
    function dry(x,from,to){ var c0=clock, real=0, st=1/60, n=0, was=null; clock=from; dwellReset();
      while(clock<to&&real<3600){ clock=Math.min(T_MAX,dwellAdvance(st,MIN_PER_SEC*x)); real+=st; if(DWELL.st&&DWELL.st.E!==was){ n++; was=DWELL.st.E; } }
      clock=c0; dwellReset(); return {real:real,n:n}; }
    var S=dwellStarts(), want=S.filter(function(t){ return t>T_MIN; }).length, rows=[], badD=[];
    [0.5,1,2,4].forEach(function(x){ var r=dry(x,T_MIN,T_MAX), L=dwellDayLength(T_MIN,x); rows.push(x+"\u00d7 "+r.real.toFixed(1)+" s (computed "+L.toFixed(1)+", "+r.n+" dwells)");
      if(Math.abs(r.real-L)>1||r.n!==want) badD.push(x+"\u00d7"); });
    var lenHalf=dwellDayLength(T_MIN,0.5);
    out.push({name:"dwell: the day plays in its computed length at every speed, one dwell at each event start after 04:00 (section D.4)", ok:!badD.length,
      detail:rows.join("; ")+"; "+want+" starts after 04:00 ("+S.length+" in all); at \u00bd\u00d7 "+Math.floor(lenHalf/60)+" min "+Math.round(lenHalf%60)+" s"+(badD.length?"; WRONG at "+badD.join(", "):"")});
    /* scrubbing does not dwell: the clock moved past an event start while playing, and the time keys */
    var E=S[S.length-3], scrub=[];
    playing=true; setClock(E-2,{instant:true,camera:false}); dwellReset(); DWELL.expect=clock; tickClock(16);
    setClock(E+3,{instant:true,camera:false}); tickClock(16); if(DWELL.st||S[DWELL.next]<=E) scrub.push("a move past "+fmtClock(E)+" while playing dwelt");
    for(var j=0;j<6;j++) tickClock(100); if(DWELL.st) scrub.push("dwelt after the move");
    var kev={key:"ArrowRight",shiftKey:false,preventDefault:function(){},target:document.body}, kr=keyRow(kev,"window"); if(kr) kr.run(kev); if(!kr||playing||DWELL.st) scrub.push("the time key left the clock playing or dwelling");
    stopPlay();
    out.push({name:"dwell: scrubbing never dwells (a move of the clock while playing, the time keys)", ok:!scrub.length, detail:scrub.length?scrub.join("; "):"a move past "+fmtClock(E)+" while playing: no dwell; the → key stops the clock"});
    /* reduced motion: the dwell kept; the camera moved only at event starts; every arrow whole */
    RM=true; var rm=[], r1=dry(0.5,T_MIN,T_MAX); if(r1.n!==want) rm.push(r1.n+" dwells");
    var moves=0, atStart=0, lastP=new THREE.Vector3(), c0=-1;
    playDay(0.5,480,660,100,function(){ lastP.copy(landCam.position); c0=clock; },function(){ if(landCam.position.distanceTo(lastP)>1e-9){ moves++;
      var hit=S.some(function(t){ return t>c0-1e-9&&t<=clock+1e-9; }); if(hit) atStart++; else rm.push("moved at "+fmtClock(clock)+" with no event start"); } });
    rebuildOverlays(curPhase,true); var whole=DRAWON.every(function(d){ return d.s===1; }), nd=DRAWON.length;
    RM=keepRM; rebuildOverlays(curPhase,true);
    if(!whole) rm.push("an arrow drawn on");
    out.push({name:"reduced motion: the dwell kept, the camera moved only at event starts, every arrow whole (section D.4)", ok:!rm.length&&moves>0,
      detail:r1.n+" dwells over the day; 08:00-11:00 at \u00bd\u00d7: "+moves+" camera moves, "+atStart+" at an event start; "+nd+" arrows of the phase whole"+(rm.length?"; WRONG: "+rm.slice(0,4).join("; "):"")});
    setClock(keep,{instant:true,force:true,camera:false}); finishTween();
    landCam.position.copy(cam.p); orbitTarget.copy(cam.t); landCam.lookAt(orbitTarget); freeCam=cam.fc;
    return out;
  }
  /* Stage 4C (docs/STAGE4_SPEC.md sections B.4 and C.6): the atmosphere. fogChecks runs at each display factor, atmoDayChecks once. */
  function fogChecks(ck,fct){
    var keep=clock, bad=[], K=DISPLAY.factor, yOf=function(m){ return (m-GEOREF.DATUM_M)/GEOREF.M_PER_WORLD*K; };
    /* the valley fog's top: on a ray falling 1 in 10 from 300 m above it, a point 1 m under the top carries the cap's fog and a
       point 20 m over it a quarter of the cap at most, at 08:00, 08:30 and 08:44 */
    [480,510,524].forEach(function(t){ setClock(t,{instant:true,camera:false}); finishTween(); applyLight(true); applyAtmo();
      var C=ATMO.u.uAtmoC.value; if(Math.abs(C.x-ATMO.FOG_TOP)>1e-6) bad.push(fmtClock(t)+": top "+C.x.toFixed(2)+" m");
      var run=300*10/GEOREF.M_PER_WORLD, eye=new THREE.Vector3(0,yOf(ATMO.FOG_TOP+300),0);
      var lo=atmoAt(eye,new THREE.Vector3(run,yOf(ATMO.FOG_TOP-1),0),1e9)[1], hi=atmoAt(eye,new THREE.Vector3(run,yOf(ATMO.FOG_TOP+20),0),1e9)[1];
      if(!(lo>=0.9*C.w)) bad.push(fmtClock(t)+": 1 m under the top "+lo.toFixed(3)+" (cap "+C.w.toFixed(2)+")");
      if(!(hi<=0.25*C.w)) bad.push(fmtClock(t)+": 20 m over the top "+hi.toFixed(3)); });
    ck("valley fog: its top drawn at the knowledge model's 238.2 m (hAt -0.8) while the mist is whole, at its cap below and clear above (section C.6)",
      !bad.length, bad.length?bad.join("; "):"at 08:00, 08:30 and 08:44: the top at "+ATMO.FOG_TOP.toFixed(1)+" m; 1 m under it the cap ("+ATMO.CAP+"), 20 m over it at most a quarter of it");
    /* the haze: none at the orbit target from any vantage (counted beyond it); the fitted Overview's ground lightly hazed */
    setClock(570,{instant:true,camera:false}); finishTween(); applyLight(true);
    var tgt=[], ov=null, vw=renderer.domElement.clientWidth||innerWidth;
    Object.keys(VANTAGE).forEach(function(vk){ placeCamera(VANTAGE[vk]); syncViewOffset(true); applyAtmo();
      var A=ATMO.u.uAtmoA.value, d=landCam.position.distanceTo(orbitTarget), h=atmoAt(landCam.position,orbitTarget)[0];
      if(Math.abs(A.w-d)>1e-6||h>1e-9) tgt.push(vk+": focus "+A.w.toFixed(2)+" against "+d.toFixed(2)+", haze at the target "+h.toFixed(4));
      if(vk==="plan"){ var fr=landFreeRect(), m=0, n=0; for(var j=0;j<=5;j++) for(var i=0;i<=8;i++){ var g=groundAt(fr[0]+(fr[2]-fr[0])*i/8,fr[1]+(fr[3]-fr[1])*j/5); if(!g) continue;
          m+=atmoAt(landCam.position,new THREE.Vector3(g[0],groundY(g[0],g[1]),g[1]))[0]; n++; } ov=n?m/n:null; } });
    var lim=(Math.abs(fct-4)<1e-9)?0.25:0.45;
    ck("haze: none at the orbit target from every vantage; the fitted Overview's ground at most "+lim+" (section B.4)", !tgt.length&&ov!==null&&ov<=lim,
      (tgt.length?"WRONG: "+tgt.join("; ")+"; ":"")+"the fitted Overview at 09:30: mean haze over its ground "+(ov===null?"-":ov.toFixed(3)));
    setClock(keep,{instant:true,camera:false}); finishTween(); applyLight(true); applyAtmo();
  }
  function atmoDayChecks(){
    var out=[], keep=clock, cv0=commandView, kN=0, kBad=[];
    /* the Command view and the drawn fog read one threshold: in phases 0-2, an enemy formation is "uncertain" exactly when it is
       in line of sight and stands under the drawn fog's top */
    ["fr","al"].forEach(function(cv){ setCommandView(cv);
      [0,1,2].forEach(function(ph){ setClock((PHASES[ph].t0+PHASES[ph].t1)/2,{instant:true,camera:false}); finishTween(); applyAtmo();
        var hq=posNow(cv==="fr"?"gqg":"ahq"), top=ATMO.u.uAtmoC.value.x;
        Object.keys(FORMATIONS).forEach(function(id){ var f=FORMATIONS[id]; if((f.nation==="fr"?"fr":"al")===cv) return;
          if(KNOW_OVERRIDE[cv]&&KNOW_OVERRIDE[cv][id]) return; var p=posNow(id); if(!p||!hq) return; kN++;
          var want=hasLOS(hq,p)&&GEOREF.elevM(hAt(p[0],p[1]))<top, got=knowledgeOf(id)==="uncertain";
          if(want!==got) kBad.push(cv+" "+PHASES[ph].label+" "+id+": drawn "+want+", read "+got); }); }); });
    setCommandView(cv0);
    out.push({name:"valley fog: the Command view's 'uncertain' is exactly the enemy in sight under the drawn fog's top (phases 0-2)", ok:kN>0&&!kBad.length,
      detail:kN+" formation readings from both headquarters"+(kBad.length?"; DIFFER: "+kBad.slice(0,6).join("; "):"")});
    /* the fog's amount: continuous in the clock, whole while the phase's mist exceeds 0.5, each phase's own value once eased */
    var steps=0, worst=0, whole=[], own=[];
    for(var t=T_MIN;t<T_MAX;t++){ var a=fogAmount(t), b=fogAmount(t+1); worst=Math.max(worst,Math.abs(b-a)); if(Math.abs(b-a)>0.06) steps++;
      var ph=PHASES[phaseAt(t)]; if(ph.mist>0.5&&a<0.9-1e-9) whole.push(fmtClock(t));
      if(t>=ph.t0+ATMO.FOG_EASE&&Math.abs(a-ph.mist)>1e-9) own.push(fmtClock(t)); }
    out.push({name:"valley fog: its amount follows PHASES[].mist continuously, whole while the mist exceeds 0.5", ok:!steps&&!whole.length&&!own.length,
      detail:"largest one-minute change "+worst.toFixed(3)+(whole.length?"; NOT WHOLE at "+whole.slice(0,4).join(", "):"")+(own.length?"; NOT THE PHASE'S VALUE at "+own.slice(0,4).join(", "):"")});
    /* the paper map draws neither; Stage 3D's recession is gone */
    setMode("staff"); renderFrame(); var pB=ATMO.u.uAtmoB.value.w, pC=ATMO.u.uAtmoC.value.w; setMode("terrain");
    out.push({name:"atmosphere: none on the paper map; the fog's recession (fogShift) gone", ok:pB===0&&pC===0&&typeof fogShift==="undefined",
      detail:"on the paper map haze "+pB+", valley fog "+pC+"; fogShift "+(typeof fogShift)});
    setClock(keep,{instant:true,camera:false}); finishTween(); applyLight(true); applyAtmo();
    return out;
  }
  function selfTest(){
    var out=[], t0=performance.now(), i;
    function ck(name,ok,detail){ out.push({name:name,ok:!!ok,detail:detail}); }
    var save={t:clock,mode:mode,pres:presentation,pos:landCam.position.clone(),tgt:orbitTarget.clone(),fc:freeCam,map:MAPCAM.state()};
    closeFirst(null); stopPlay(); if(tourStep>=0) exitTour();
    if(mode==="staff") setMode("terrain");   /* the checks of the drawn relief run on the landscape (Stage 2E) */

    /* 1-5, the mist and the derived readings, at each display factor (Stage 2B: 1x, the default, GEOREF.EXAG).
       Replaces the single-factor checks of Stage 0; every threshold is the same. */
    var keepClock, saveFactor=DISPLAY.factor, bySetting={}, paperBy={}, coverBy={};
    function atFactor(fct){
      setDisplayFactor(fct);
      var tag=" (at "+fmtFactor(fct)+"\u00d7)";
      function ck(name,ok,detail){ out.push({name:name+tag,ok:!!ok,detail:detail}); }
      /* 1. the ground as drawn */
      var gw=0;
      for(i=0;i<600;i++){ var ix=(i*37)%(GROUND_NX+1), iz=(i*53)%(GROUND_NZ+1);
        var gx=-GROUND_W/2+ix*GROUND_W/GROUND_NX, gz=-GROUND_D/2+iz*GROUND_D/GROUND_NZ;
        gw=Math.max(gw,Math.abs(groundY(gx,gz)-displayHeight(gx,gz))); }
      ck("ground: groundY() returns the drawn terrain, the display height, at its vertices", gw<1e-3, "largest |groundY - displayHeight| at mesh vertices "+gw.toExponential(1));

      /* 2. every fixed view, and every view the app computes when it centres on something */
      var views=[];
      Object.keys(VANTAGE).forEach(function(k){ views.push(["vantage "+k,VANTAGE[k]]); });
      PHASES.forEach(function(ph){ views.push(["phase "+ph.id+" ("+ph.label+")",ph.cam]); });
      ANALYSIS.forEach(function(a){ views.push(["chapter "+a.id,chapterCam(a)]); });
      TOUR.forEach(function(st,k){ views.push(["tour stop "+(k+1),stopCam(st)]); });
      views.push(["the paper map's preset",[-27,262,41,-27,0,9]]);
      var fixedMin=1e9, fixedWorst="", below=[];
      views.forEach(function(v){ var c=reframe(v[1]), cl=c[1]-camGround(c[0],c[2]);   /* presets are re-framed at use */
        if(cl<fixedMin){ fixedMin=cl; fixedWorst=v[0]; } if(cl<CAM_CLEAR) below.push(v[0]+" ("+cl.toFixed(2)+")"); });
      var comp=0, compMin=1e9, compWorst="";
      function centreEye(mp,r){ var w=W(mp[0],mp[1]), y=displayHeight(w[0],w[1]), d=new THREE.Vector3(-0.55,0.62,0.56).normalize().multiplyScalar(r);
        return [w[0]+d.x,y+d.y,w[1]+d.z]; }
      function chkEye(e,label){ comp++; var cl=e[1]-camGround(e[0],e[2]);
        if(cl<compMin){ compMin=cl; compWorst=label; } if(cl<CAM_CLEAR) below.push(label+" ("+cl.toFixed(2)+")"); }
      keepClock=clock;
      PHASES.forEach(function(ph){ clock=(ph.t0+ph.t1)/2;
        Object.keys(FORMATIONS).forEach(function(id){ var q=posNow(id); if(q) chkEye(centreEye(q,86),"centring on "+id+" at "+fmtClock(clock)); }); });
      clock=keepClock;
      EVENTS.forEach(function(e){ chkEye(centreEye(e.p,96),"event "+e.id); chkEye(centreEye(e.p,112),"event "+e.id+" (next/previous)"); });
      FEATURES.forEach(function(f){ chkEye(centreEye(f.p,82),"place "+f.id); });
      TERRAIN_LINES.forEach(function(tl){ chkEye(centreEye(tl.p[Math.floor(tl.p.length/2)],92),"terrain line "+tl.n); });
      ck("camera: every fixed and computed view is above the ground", below.length===0,
        views.length+" fixed views (vantages, phases, chapters, tour stops, the paper map's preset), lowest "+fixedMin.toFixed(1)+" units at "+fixedWorst+
        "; "+comp+" centring views, lowest "+compMin.toFixed(1)+" at "+compWorst+(below.length?"; BELOW THE FLOOR: "+below.slice(0,8).join(", "):""));

      /* 3. glides, through the same arc code the application uses */
      var arcsN=0, arcsMin=1e9, arcsBad=0, c0=CAM.clamps;
      function arcCheck(a,b,bulge){
        a=reframe(a); b=reframe(b);
        var A=setupArc(new THREE.Vector3(a[0],a[1],a[2]),new THREE.Vector3(a[3],a[4],a[5]),new THREE.Vector3(b[0],b[1],b[2]),new THREE.Vector3(b[3],b[4],b[5]));
        for(var k=0;k<=24;k++){ applyArc(A,easeInOut(k/24),bulge); arcsN++;
          var cl=landCam.position.y-camGround(landCam.position.x,landCam.position.z); if(cl<arcsMin) arcsMin=cl; if(cl<CAM_CLEAR-1e-6) arcsBad++; }
      }
      for(i=0;i+1<TOUR.length;i++) arcCheck(stopCam(TOUR[i]),stopCam(TOUR[i+1]),0.12);
      for(i=0;i+1<PHASES.length;i++) arcCheck(PHASES[i].cam,PHASES[i+1].cam,0.15);
      for(i=1;i<ANALYSIS.length;i++) arcCheck(chapterCam(ANALYSIS[i-1]),chapterCam(ANALYSIS[i]),0.12);
      var vk=Object.keys(VANTAGE);
      vk.forEach(function(a){ vk.forEach(function(b){ if(a!==b) arcCheck(VANTAGE[a],VANTAGE[b],0.12); }); });
      ck("camera: glides between tour stops, phases, chapters and vantages stay above the ground", arcsBad===0,
        arcsN+" positions sampled; lowest clearance "+arcsMin.toFixed(2)+" units; the floor lifted "+(CAM.clamps-c0)+" of them");

      /* 4. orbit extremes, through the placement the pointer handlers use */
      var orbN=0, orbMin=1e9, orbBad=0;
      views.forEach(function(v){ var c=reframe(v[1]); orbitTarget.set(c[3],c[4],c[5]);
        for(var th=0;th<24;th++){
          sph.set(24,Math.PI/2-0.03,th/24*Math.PI*2); orbitPlace(); orbN++;
          var cl=landCam.position.y-camGround(landCam.position.x,landCam.position.z); if(cl<orbMin) orbMin=cl; if(cl<CAM_CLEAR-1e-6) orbBad++;
        } });
      ck("camera: orbiting at the lowest pitch and closest zoom never enters the ground", orbBad===0,
        orbN+" orbit positions around "+views.length+" targets; lowest clearance "+orbMin.toFixed(2)+" units");
      /* Stage 3D: the landscape's controls, through real pointer and wheel events, from every vantage */
      var m0=LANDCAM.stats.moves, t0m=LANDCAM.stats.ms, lc=landControls(), kt=landKeysTouch(), mv=LANDCAM.stats.moves-m0, msMove=mv?(LANDCAM.stats.ms-t0m)/mv:0;
      ck("camera controls: a left-drag pans (the grabbed ground point within 1 px of the pointer during and after), the wheel zooms toward the cursor (within 1 px, a step the floor shortens included), a double-click centres the point in the free rectangle (within 2 px), a right-drag orbits; the eye at or above the floor after every step",
        lc.pan<=1&&lc.panAfter<=1&&lc.zoom<=1&&lc.focus<=2&&!lc.orbitBad&&!lc.below&&!lc.lost.length&&lc.panN>0&&lc.zoomN>0&&msMove<=2,
        lc.views+" vantages: pan worst "+lc.pan.toFixed(3)+" px during ("+lc.panN+" steps; "+lc.panLifted+" the floor lifted, counted apart), "+lc.panAfter.toFixed(3)+" px after; wheel worst "+
        lc.zoom.toFixed(3)+" px over "+lc.zoomN+" steps ("+lc.zoomStops+" shortened by the floor); double-click "+lc.focus.toFixed(3)+" px from the free centre; right-drag orbits "+(lc.orbitN-lc.orbitBad)+" of "+lc.orbitN+
        "; below the floor "+lc.below+"; a pan move "+msMove.toFixed(3)+" ms on average over "+mv+" (budget 2 ms)"+(lc.lost.length?"; "+lc.lost.join(", "):""));
      ck("camera controls: the keys on the focused map layer pan, zoom and turn without stepping the clock; one finger pans, two pinch and twist",
        kt.keyPan>1&&kt.keyZoom<1&&Math.abs(kt.keyTurnDeg-15)<0.01&&kt.clockKept&&kt.keyFree&&kt.touchPan<=1&&kt.pinchRatio<1&&Math.abs(kt.twistDeg)>1,
        "the right arrow moves the target "+kt.keyPan+" units; + brings the eye to "+kt.keyZoom+" of its distance; Shift + left arrow turns "+kt.keyTurnDeg+"\u00b0; clock "+(kt.clockKept?"unchanged":"MOVED")+
        "; one-finger pan "+kt.touchPan+" px; a pinch apart brings the eye to "+kt.pinchRatio+" of its distance and the twist turns "+kt.twistDeg+"\u00b0");
      renderFrame();
      ck("camera: no path placed the eye below the floor before a frame", CAM.violations===0, "render-time guard count "+CAM.violations);

      /* 5. figures on the drawn ground, across the day, both modes, with and without dimming */
      freeCam=true;
      var fw={worst:0,where:"",n:0}, cases=0;
      var times=PHASES.map(function(ph){ return Math.round((ph.t0+ph.t1)/2); }).concat([PHASES[3].t0+22,PHASES[7].t0+35,PHASES[8].t0+40]);
      ["terrain","hybrid"].forEach(function(md){
        if(mode!==md) setMode(md);
        [null,"c_iv","buxhowden"].forEach(function(hl){
          times.forEach(function(tm){
            setClock(tm,{instant:true,force:true,camera:false}); finishTween();
            select(null,null); if(hl) select("f",hl);
            settle(28,true);
            var r=figureError(); cases++; fw.n+=r.n;
            if(r.worst>fw.worst){ fw.worst=r.worst; fw.where=r.where+" at "+fmtClock(tm)+", "+md+(hl?", "+hl+" highlighted":""); }
          });
        });
      });
      select(null,null);
      ck("figures: every visible man, horse and standard stands on the drawn ground", fw.worst<=0.02,
        cases+" states (10 phases and 3 marching moments; terrain and hybrid; no highlight and two highlight families), "+
        fw.n+" figure placements; worst "+fw.worst.toFixed(4)+" units"+(fw.where?" ("+fw.where+")":""));

      /* Stage 4C: the mist sheets are gone, and their edge check with them; the valley fog and the haze: fogChecks, below */
      /* 10. derived readings: rendering changes must not move them */
      keepClock=clock; clock=240;   /* model readings: the same at every display factor */
      var p04=plateauStrength("al");
      clock=keepClock;
      var over=[]; for(var tm=240;tm<=1080;tm+=15){ if(sideOnFieldAt("al",tm)>85400||sideOnFieldAt("fr",tm)>73000) over.push(fmtClock(tm)); }
      var aud=auditMovement();
      ck("derived readings unchanged: the plateau at 04:00, both army totals, the movement audit", p04===38700&&!over.length&&!aud.length,
        "Allied on the plateau at 04:00 = "+p04.toLocaleString()+" (changelog 38,700); "+
        (over.length?"totals exceed an army at "+over.join(","):"totals within 85,400 and 73,000 at 57 moments")+"; movement audit "+aud.length+" findings");


      /* 12. Stage 2C: every overlay arrow, line and boundary vertex at its lift above the drawn ground, in every phase;
         every Allied head the notched chevron, every French head the plain triangle */
      var dr=overlayDrape();
      ck("overlays: every arrow, line and boundary vertex stands at its lift above the drawn ground", dr.n>0&&dr.worst<=0.05,
        dr.n+" vertices in "+dr.meshes+" draped meshes over the 10 phases; worst |y - groundY - lift| "+dr.worst.toFixed(4)+(dr.where?" ("+dr.where+")":""));
      ck("heads: every Allied arrow head is the notched chevron, every French head the plain triangle", dr.heads.n>0&&!dr.heads.bad.length,
        dr.heads.n+" heads ("+dr.heads.al+" Allied chevrons, notch "+dr.heads.notch+" of the head's length ahead of its base; "+dr.heads.fr+" French plain)"+(dr.heads.bad.length?"; WRONG: "+dr.heads.bad.join(", "):""));

      /* 13. Stage 2F: the land cover drawn per point (within 20 m of each class's edge), the roads and streams draped */
      coverBy[fct]=coverChecks(ck,false).hash;
      var rd=roadDrape();
      ck("roads and streams: every vertex stands at its lift above the drawn ground, and no edge cuts under it", rd.n>0&&rd.worst<=0.05&&rd.mids>0&&!rd.under,
        rd.n+" vertices in "+rd.meshes+" road and stream meshes; worst |y - groundY - lift| "+rd.worst.toExponential(1)+(rd.where?" ("+rd.where+")":"")+
        "; "+rd.under+" of "+rd.mids+" edge midpoints under the ground");

      layerChecks(ck);
      paperBy[fct]=paperChecks(ck);
      bySetting[fct]=factorFacts(fct);
      lightChecks(ck,fct);   /* Stage 4B */
      fogChecks(ck,fct);    /* Stage 4C */
      paceChecks(ck,fct);   /* Stage 4D */
    }
    DISPLAY.settings.forEach(atFactor);
    stage2bChecks(bySetting).forEach(function(c){ out.push(c); });
    paperCross(paperBy).forEach(function(c){ out.push(c); });
    lightDayChecks().forEach(function(c){ out.push(c); });   /* Stage 4B */
    atmoDayChecks().forEach(function(c){ out.push(c); });   /* Stage 4C */
    paceDayChecks().forEach(function(c){ out.push(c); });   /* Stage 4D */
    setDisplayFactor(saveFactor);
    /* Stage 2F: one set of drawn classes, whatever the setting, on the landscape and the paper map; the woods' trees and scrub */
    var cvF=DISPLAY.settings, cvBad=cvF.filter(function(f){ return coverBy[f]!==coverBy[cvF[0]]||paperBy[f].cover!==coverBy[cvF[0]]; });
    ck("cover: the drawn classes are the same at every relief setting and on the paper map", !cvBad.length,
      cvF.map(function(f){ return fmtFactor(f)+"\u00d7 "+coverBy[f]+" (paper map "+paperBy[f].cover+")"; }).join("; "));
    /* Stage 3B (docs/STAGE3_SPEC.md sections B.2, B.4 and H; owner decisions 49, 54, 55, 58): the docked layout */
    (function(){
      var wide=window.innerWidth>=DOCK_MIN, dp=document.querySelector(".dispatch"), inRail=!!(dp&&dp.closest(".rail")), nowB=document.getElementById("tab-now");
      var tab0=tabNow, chosen0=tabChosen;
      setPresentation("study"); select(null,null); document.body.classList.add("st-still");
      ck("docked layout: from 1080 px the dispatch is the rail's Now tab; below it a card, and the Now tab hidden",
        docked===wide&&inRail===wide&&!!nowB&&nowB.hidden===!wide,
        window.innerWidth+" px wide: docked "+docked+", the dispatch "+(inRail?"in the rail":"a card")+", the Now tab "+(nowB&&nowB.hidden?"hidden":"shown"));
      /* the tabs: roles, and the arrow keys, Home and End between the tabs shown, the clock untouched */
      var T=Array.prototype.filter.call(document.querySelectorAll(".tab-btn"),function(b){ return !b.hidden; }), clk=clock, bad=[];
      T.forEach(function(b){ var pn=document.getElementById(b.getAttribute("aria-controls")||"");
        if(b.getAttribute("role")!=="tab"||!pn||pn.getAttribute("role")!=="tabpanel") bad.push(b.dataset.t+": roles"); });
      function key(k){ var a=document.activeElement; if(a) a.dispatchEvent(new KeyboardEvent("keydown",{key:k,bubbles:true,cancelable:true})); }
      selectTab(T[0].dataset.t,true);
      key("ArrowRight"); if(tabNow!==T[1].dataset.t||document.activeElement!==T[1]) bad.push("ArrowRight did not move to "+T[1].dataset.t);
      key("End"); if(tabNow!==T[T.length-1].dataset.t) bad.push("End did not move to the last tab");
      key("Home"); if(tabNow!==T[0].dataset.t) bad.push("Home did not move to the first tab");
      key("ArrowLeft"); if(tabNow!==T[T.length-1].dataset.t) bad.push("ArrowLeft did not wrap to the last tab");
      T.forEach(function(b){ if((b.getAttribute("aria-selected")==="true")!==(b.dataset.t===tabNow)||(b.getAttribute("tabindex")==="0")!==(b.dataset.t===tabNow)) bad.push(b.dataset.t+": selection state"); });
      if(clock!==clk) bad.push("the clock moved ("+clk+" to "+clock+")");
      ck("rail tabs: a tablist; the arrow keys, Home and End move between the tabs shown without stepping the clock", !bad.length,
        T.length+" tabs"+(bad.length?"; "+bad.join("; "):", every key as expected"));
      /* one announcement per phase change, while another tab hides the Now tab */
      selectTab("analysis");
      var said=PHASE_SAID, ph=(curPhase+1)%PHASES.length; setClock(PHASES[ph].t0+1,{instant:true,camera:false}); finishTween();
      var lv=document.getElementById("live-phase"), want=PHASES[ph].clock+". "+actOf(ph).n+": "+PHASES[ph].title+".";
      ck("a phase change is announced once by the polite live region, whichever tab is shown", PHASE_SAID===said+1&&lv&&lv.getAttribute("aria-live")==="polite"&&lv.textContent===want&&
        !(dp&&dp.hasAttribute("aria-live")), (PHASE_SAID-said)+" announcement: \""+(lv?lv.textContent:"")+"\" (the dispatch "+(dp&&dp.hasAttribute("aria-live")?"is still":"is not")+" a live region)");
      /* the dossier in the rail's column: over the rail, down to the timebar, the tools and the legend unmoved */
      if(wide){ var rb=function(q){ var r=document.querySelector(q).getBoundingClientRect(); return [r.left,r.top,r.right,r.bottom]; };
        var tools0=rb(".tools"), lg0=rb(".legend"); select("f","sthilaire");
        var d=rb(".drawer"), ra=rb(".rail"), tb=rb(".timebar"), tools1=rb(".tools"), lg1=rb(".legend"), near=function(a,b){ return Math.abs(a-b)<=1; };
        ck("the dossier opens in the rail's column, down to the timebar; the tools and the legend do not move",
          near(d[0],ra[0])&&near(d[2],ra[2])&&near(d[3],tb[1])&&tools0.join()===tools1.join()&&lg0.join()===lg1.join()&&drawerShown(),
          "dossier "+d.map(Math.round).join(",")+", rail "+ra.map(Math.round).join(",")+", timebar top "+Math.round(tb[1])+(tools0.join()===tools1.join()?"":"; the tools moved")+(lg0.join()===lg1.join()?"":"; the legend moved"));
        select(null,null); }
      /* the paper map frames the field in the free rectangle where it is drawn largest, never smaller than in the largest one */
      setMode("staff"); tween=null; MAPCAM.frameField(true);
      var N0=MAPCAM.north, E0=MAPCAM.east, A=MAPCAM.field.map(function(q){ return q[0]*E0.x+q[1]*E0.z; }), B=MAPCAM.field.map(function(q){ return q[0]*N0.x+q[1]*N0.z; });
      var aw=Math.max.apply(null,A)-Math.min.apply(null,A), bh=Math.max.apply(null,B)-Math.min.apply(null,B), ra2=MAPCAM.freeRect(), rf=MAPCAM.freeRect([aw,bh]);
      var wArea=Math.max(aw/(ra2[2]-ra2[0]),bh/(ra2[3]-ra2[1])), wNow=MAPCAM.state().wpp;
      ck("paper map: the field is framed in the free rectangle where it is drawn largest", wNow<=wArea*(1+1e-9)&&Math.abs(wNow-Math.max(aw/(rf[2]-rf[0]),bh/(rf[3]-rf[1])))<1e-9,
        (GEOREF.UNITS_PER_KM/wNow).toFixed(1)+" px per km in "+(rf[2]-rf[0])+" x "+(rf[3]-rf[1])+" px; the largest free rectangle, "+(ra2[2]-ra2[0])+" x "+(ra2[3]-ra2[1])+" px, gives "+(GEOREF.UNITS_PER_KM/wArea).toFixed(1));
      setMode("terrain");
      document.body.classList.remove("st-still");
      tabChosen=chosen0; selectTab(tab0);
    })();
    /* Stage 3C (docs/STAGE3_SPEC.md sections C.2, D and H; owner decisions 53, 60): the one timeline */
    (function(){
      var bad=[], keys=[], grp=[], pl0=playing;
      setPresentation("study"); select(null,null); if(chapter) setChapter(null); stopPlay(); document.body.classList.add("st-still");
      setClock(600,{instant:true,force:true,camera:false}); finishTween();
      var H=document.querySelector(".timebar").getBoundingClientRect().height, ax=document.querySelector(".tb-trackwrap").getBoundingClientRect();
      function pcAt(x){ return (x-ax.left)/ax.width*100; }
      document.querySelectorAll("#phases .step").forEach(function(b,i){ var r=b.getBoundingClientRect(), fs=parseFloat(getComputedStyle(b).fontSize);
        if(Math.abs(pcAt(r.left)-tlPc(PHASES[i].t0))>0.15) bad.push("phase "+i+" at "+pcAt(r.left).toFixed(2)+"%, not "+tlPc(PHASES[i].t0).toFixed(2)+"%");
        if(fs<12) bad.push("phase "+i+" label "+fs+" px"); });
      document.querySelectorAll(".act-btn").forEach(function(b,i){ var r=b.getBoundingClientRect(), a=ACTS[i], fs=parseFloat(getComputedStyle(b).fontSize);
        if(Math.abs(pcAt(r.left)-tlPc(PHASES[a.phases[0]].t0))>0.15||Math.abs(pcAt(r.right)-tlPc(PHASES[a.phases[a.phases.length-1]].t1))>0.15) bad.push("act "+a.id+" not on its phases");
        if(fs<12) bad.push("act "+a.id+" label "+fs+" px"); });
      ck("timeline: at most 92 px; the act bands and phase ticks at their share of one time axis; their labels at 12 px or more",
        H<=92&&!bad.length, Math.round(H*10)/10+" px tall at "+window.innerWidth+" x "+window.innerHeight+(bad.length?"; "+bad.slice(0,4).join("; "):"; 5 acts and 10 phases placed"));
      /* the even hours' numerals (section D.2: placed under the rail, their overlap measured): clear of every event marker's box and
         of one another, inside the timebar */
      var NR=Array.prototype.map.call(document.querySelectorAll("#railticks b"),function(b){ return b.getBoundingClientRect(); }),
        MR=Array.prototype.map.call(document.querySelectorAll("#evmarks .ev-mark"),function(b){ return b.getBoundingClientRect(); }),
        tbB=document.querySelector(".timebar").getBoundingClientRect().bottom, nOv=0, nSelf=0, nOut=0;
      NR.forEach(function(n,i){ MR.forEach(function(m){ if(Math.min(n.right,m.right)>Math.max(n.left,m.left)&&Math.min(n.bottom,m.bottom)>Math.max(n.top,m.top)) nOv++; });
        if(i&&n.left<NR[i-1].right) nSelf++; if(n.bottom>tbB) nOut++; });
      ck("timeline: the hour numerals clear of the event markers and of one another, inside the timebar",
        NR.length===8&&!nOv&&!nSelf&&!nOut, NR.length+" numerals, "+MR.length+" event markers: "+nOv+" overlaps with a marker, "+nSelf+" with one another, "+nOut+" below the timebar");
      var cut=[];
      for(var i=0;i<PHASES.length;i++){ setClock(PHASES[i].t0+1,{instant:true,camera:false}); finishTween(); var st=document.querySelectorAll("#phases .step")[i];
        if(st.getAttribute("aria-current")!=="true"||st.scrollWidth>st.clientWidth+1) cut.push(PHASES[i].label); }
      var short=Array.prototype.filter.call(document.querySelectorAll("#phases .step"),function(b){ return b.getAttribute("aria-current")!=="true"&&b.scrollWidth>b.clientWidth+1; }).map(function(b){ return b.textContent; });
      ck("timeline: the current phase's label is always whole (decision 53)", !cut.length,
        window.innerWidth+" px wide, each phase made current in turn"+(cut.length?"; CUT: "+cut.join(", "):"")+"; shortened while not current: "+(short.join(", ")||"none"));
      /* the slider: one step per key (the window's arrows no longer step it again), and its value exposed */
      function key(k,sh){ var a=document.activeElement; if(a) a.dispatchEvent(new KeyboardEvent("keydown",{key:k,shiftKey:!!sh,bubbles:true,cancelable:true})); }
      setClock(600,{instant:true,camera:false}); finishTween(); var rail=document.getElementById("timerail"); rail.focus();
      [["ArrowRight",0,610],["ArrowRight",1,670],["ArrowLeft",0,660],["PageUp",0,630],["PageUp",0,570],["PageDown",0,630],["Home",0,T_MIN],["End",0,T_MAX]].forEach(function(q){
        key(q[0],q[1]); finishTween(); var v=rail.getAttribute("aria-valuenow"), vt=rail.getAttribute("aria-valuetext");
        if(Math.abs(clock-q[2])>1e-6||v!==String(Math.round(clock))||vt!==tlText(clock)) keys.push((q[1]?"Shift+":"")+q[0]+": "+clock+" (want "+q[2]+"), valuenow "+v); });
      ck("timeline: the slider's keys (arrows 10 min, Shift 60, PageUp and PageDown the phase starts, Home, End), one step each, and its value exposed",
        !keys.length, keys.length?keys.join("; "):"8 keys from 10:00, each as expected; aria-valuenow and aria-valuetext current");
      /* the groups: the arrow keys move within acts, phases and events and stop there; events named and selectable */
      [["#acts",".act-btn"],["#phases",".step"],["#evmarks",".ev-mark"]].forEach(function(g){
        var B=document.querySelectorAll(g[0]+" "+g[1]), c0=clock; B[0].focus(); key("ArrowRight"); if(document.activeElement!==B[1]) grp.push(g[0]+": ArrowRight did not move");
        key("End"); if(document.activeElement!==B[B.length-1]) grp.push(g[0]+": End"); if(clock!==c0) grp.push(g[0]+": the clock moved"); });
      var M=Array.prototype.slice.call(document.querySelectorAll("#evmarks .ev-mark")), names=M.filter(function(b){ return !/^\d\d:\d\d, .+/.test(b.getAttribute("aria-label")||""); });
      if(names.length) grp.push(names.length+" event markers without a clock and title");
      var mids=_evTicks.map(function(o){ return o.mid; }); for(var k=1;k<mids.length;k++) if(mids[k]<mids[k-1]) grp.push("event markers not in time order");
      M[3].click(); if(!selection||selection.kind!=="e"||Math.abs(clock-_evTicks[3].mid)>1e-6) grp.push("a marker's click did not select its event at its clock");
      select(null,null);
      togglePlay(); var pp=document.getElementById("play").getAttribute("aria-pressed"); stopPlay(); var pp2=document.getElementById("play").getAttribute("aria-pressed");
      if(pp!=="true"||pp2!=="false") grp.push("Play's aria-pressed "+pp+"/"+pp2);
      ck("timeline: acts, phases and events are each one keyboard stop, the arrows stay in them; events named by clock and title; Play pressed while playing",
        !grp.length, grp.length?grp.join("; "):M.length+" event markers in time order, each named; the clock unmoved by the groups' keys");
      /* Watch: the presentation switch in the control row at full opacity; the caption carries the derived readings */
      setClock(570,{instant:true,camera:false}); finishTween(); setPresentation("watch"); var vm=document.getElementById("viewmode"), d=document.querySelector("#tb-cap .der");
      var inRow=!!vm.closest(".tb-top"), op=getComputedStyle(vm).opacity, derOn=!!d&&getComputedStyle(d).display!=="none";
      setPresentation("study"); var back=!vm.closest(".timebar"), derOff=!d||getComputedStyle(document.querySelector("#tb-cap .der")).display==="none";
      ck("Watch: the presentation switch stands in the timeline's control row at full opacity; the caption carries the derived plateau reading (decision 60)",
        inRow&&+op===1&&derOn&&back&&derOff, "in Watch: in the control row "+inRow+", opacity "+op+", the derived reading "+(derOn?"shown":"MISSING")+"; in Study: the switch back "+back+", the caption's reading "+(derOff?"left to the Now tab":"SHOWN TWICE"));
      /* the spine index, and the chosen chapter's place on the axis */
      var nE=SPINE.phases.reduce(function(a,p){ return a+p.events.length; },0), nC=SPINE.phases.reduce(function(a,p){ return a+p.chapters.length; },0), nT=SPINE.phases.reduce(function(a,p){ return a+p.tour.length; },0), sp=[];
      EVENTS.forEach(function(e){ if(SPINE.phases[phaseAt(evWindow(e)[0])].events.indexOf(e.id)<0) sp.push(e.id); });
      setChapter("cut"); finishTween(); var sm=document.getElementById("spinemark"), smL=parseFloat(sm.style.left), smOn=!sm.hidden; setChapter(null); finishTween(); var smOff=sm.hidden;
      ck("spine: acts > phases > events built from the data; the chosen chapter's place marked on the axis",
        nE===EVENTS.length&&nC===ANALYSIS.length&&nT===TOUR.length&&!sp.length&&smOn&&Math.abs(smL-tlPc(chapterClock(chapterById("cut"))))<0.01&&smOff,
        nE+" events, "+nC+" chapters, "+nT+" tour stops placed in "+SPINE.phases.length+" phases"+(sp.length?"; MISPLACED: "+sp.join(", "):"")+"; the chapter \u201ccut\u201d "+(smOn?"marked":"NOT MARKED")+" at "+smL.toFixed(3)+"% (its clock "+tlPc(chapterClock(chapterById("cut"))).toFixed(3)+"%; within 0.01, the style's own precision) ("+(smOff?"cleared after":"NOT CLEARED")+")");
      /* the spine data task (section C.2; owner decisions 52, 59, 64-67): every theme and stop resolves to its moment; choosing a
         theme goes to its principal moment and marks its other moments; tour stop 7 follows its theme's clock */
      var bad3=[], nM=0;
      ANALYSIS.forEach(function(c){ var m=momentOf(c.at); if(!m){ bad3.push(c.id+": "+c.at); return; }
        c.moments.forEach(function(q){ nM++; if(!momentOf(q)) bad3.push(c.id+": "+q); }); });
      TOUR.forEach(function(st,k){ if(!momentOf(st.at)) bad3.push("stop "+(k+1)+": "+st.at); });
      setChapter("cut"); finishTween();
      var ck3=clock, marked=_evTicks.filter(function(o){ return o.el.classList.contains("inth"); }).map(function(o){ return o.e.id; }).sort().join(",");
      setChapter("guard"); finishTween(); var phMarked=document.querySelectorAll("#phases .step.inth").length, ckG=clock;
      setChapter(null); finishTween(); var cleared=!document.querySelector(".ev-mark.inth,.step.inth");
      var s7=stopClock(TOUR[6]), c7=chapterClock(chapterById(TOUR[6].chapter)), own=TOUR.filter(function(st){ return st.t!==undefined; }).length;
      ck("spine: every theme and tour stop names its moments (phases or events); a theme opens on its principal moment and marks the others; stop 7 follows its theme (decision 52)",
        !bad3.length&&ck3===660&&marked==="buxhowden-blind,pratzeberg"&&ckG===675&&phMarked===0&&cleared&&s7===c7&&own===1,
        ANALYSIS.length+" themes naming "+nM+" moments, "+TOUR.length+" stops"+(bad3.length?"; UNRESOLVED: "+bad3.join(", "):"")+"; the theme \u201ccut\u201d at "+fmtClock(ck3)+", marking "+marked+
        "; \u201cguard\u201d at "+fmtClock(ckG)+"; marks cleared after: "+cleared+"; stop 7 at "+fmtClock(s7)+" (its theme "+fmtClock(c7)+"); "+own+" stop with its own clock (stop 4)");
      if(document.activeElement&&document.activeElement.blur) document.activeElement.blur();
      document.body.classList.remove("st-still"); if(pl0) togglePlay();
    })();
    cameraChecks3D(ck);   /* Stage 3D */
    keyChecks3E(ck);      /* Stage 3E */
    var wp=woodPlacement();
    ck("woods: every tree and every scrub of a wood stands inside the wood as the land cover has it", wp.wood>0&&wp.edge>0&&!wp.out.length&&!wp.notModel,
      wp.wood+" trees and "+wp.edge+" edge scrub of the woods, all where the drawn cover is wood ("+wp.notModel+" where the model's own class is not)"+
      (wp.out.length?"; OUTSIDE: "+wp.out.slice(0,5).join(", "):"")+"; not woods, and not tested: "+wp.village+" trees round the villages, "+wp.stream+" bank scrub along the streams");

    /* 6. the first-run key, the legend, and what is actually drawn */
    var fr=document.getElementById("firstrun"), lg=document.querySelector(".legend"), mism=[];
    var frKeys=fr.querySelectorAll("[data-key]");
    if(!frKeys.length) mism.push("the first-run card carries no colour key");
    frKeys.forEach(function(e){ var l=lg.querySelector('[data-key="'+e.dataset.key+'"]');
      if(!l) mism.push(e.dataset.key+" is not in the legend");
      else if(getComputedStyle(e).backgroundColor!==getComputedStyle(l).backgroundColor)
        mism.push(e.dataset.key+": "+getComputedStyle(e).backgroundColor+" against the legend's "+getComputedStyle(l).backgroundColor); });
    var txt=(document.getElementById("fr-key").textContent||"").replace(/\s+/g," ");
    ["Blue is the French army","green for Russia","white for Austria","drawn in amber"].forEach(function(w){ if(txt.indexOf(w)<0) mism.push('missing "'+w+'"'); });
    if(/amber is the russian/i.test(fr.textContent)) mism.push("still says amber is the Russian and Austrian army");
    function rgb(hex){ var n=parseInt(hex.replace("#",""),16); return "rgb("+((n>>16)&255)+", "+((n>>8)&255)+", "+(n&255)+")"; }
    [["fr",NATION.fr.fill],["ru",NATION.ru.fill],["at",NATION.at.fill],["arrow-fr",hexOf(SIDE_COL.fr.attack)],["arrow-al",hexOf(SIDE_COL.al.attack)]].forEach(function(k){
      var l=lg.querySelector('[data-key="'+k[0]+'"]');
      if(!l||getComputedStyle(l).backgroundColor!==rgb(k[1])) mism.push("legend "+k[0]+" is not the drawing colour "+k[1]); });
    ck("first run: the colour key agrees with the legend, and the legend with what is drawn", mism.length===0,
      mism.length?mism.join("; "):'"'+txt.slice(0,150)+'..."');

    /* 7. dossiers in metres */
    var bad=[];
    FEATURES.forEach(function(ft){ var t=dossierFeature(ft.id).textContent, want=Math.round(GEOREF.elevM(hAt(ft.p[0],ft.p[1])));
      if(/\bunits?\b/i.test(t)) bad.push(ft.id+" shows model units");
      if(t.indexOf("\u2248 "+want+" m")<0) bad.push(ft.id+" lacks "+want+" m"); });
    TERRAIN_LINES.forEach(function(tl){ var t=dossierAnalysis(tl.n).textContent;
      if(/\bunits?\b/i.test(t)) bad.push(tl.n+" shows model units");
      if(!/\u2248 \d+\u2013\d+ m on this model/.test(t)) bad.push(tl.n+" lacks a range in metres"); });
    ck("dossiers: elevations are metres through GEOREF, never model units", bad.length===0,
      bad.length?bad.join("; "):FEATURES.length+" place dossiers and "+TERRAIN_LINES.length+" terrain-study dossiers");

    /* 8. a selection is always shown somewhere, and clearing it clears the dimming */
    var steps=[], okAll=true;
    function chip(){ var c=document.getElementById("selchip"); return !c.hidden&&getComputedStyle(c).display!=="none"; }
    function note(label,ok){ steps.push((ok?"":"FAILED: ")+label); if(!ok) okAll=false; }
    if(mode!=="terrain") setMode("terrain");
    setClock(585,{instant:true,force:true,camera:false}); finishTween();
    setPresentation("watch"); select("f","kamensky");
    note("Watch, formation selected: chip shown, dossier hidden, family highlighted", chip()&&!drawerShown()&&!!highlight);
    document.getElementById("sc-open").click();
    note("chip opens the dossier in Study, selection kept", presentation==="study"&&drawerShown()&&!chip()&&!!selection&&selection.id==="kamensky");
    setPresentation("watch");
    note("entering Watch clears selection, chip and dimming", !selection&&!chip()&&!highlight);
    select("e","kamensky");
    note("Watch, event selected: chip shown", chip()&&!drawerShown());
    document.getElementById("sc-clear").click();
    note("chip clears the selection", !selection&&!chip()&&!highlight);
    setPresentation("map"); select("f","sthilaire");
    note("clean map view, selection: chip shown", chip());
    select(null,null);
    note("nothing selected: no chip, no dimming", !chip()&&!highlight);
    setPresentation("study"); select("f","sthilaire");
    note("Study, selection: dossier shown, no chip", drawerShown()&&!chip());
    select(null,null);
    ck("watch mode: a selection is always shown, and clearing it clears the dimming", okAll, steps.join("; "));

    /* 9. sprite edges and mist edges */
    function edge(t){ var c=t.image,w=c.width,h=c.height,d=c.getContext("2d").getImageData(0,0,w,h).data,mx=0,x,y;
      for(x=0;x<w;x++) mx=Math.max(mx,d[x*4+3],d[((h-1)*w+x)*4+3]);
      for(y=0;y<h;y++) mx=Math.max(mx,d[y*w*4+3],d[(y*w+w-1)*4+3]);
      return mx; }
    var se=edge(smokeTexture()), de=edge(dustTexture());
    ck("sprites: smoke and dust fade to nothing at every edge", se===0&&de===0, "largest edge alpha: smoke "+se+", dust "+de+" of 255");

    /* 11. render on demand */
    setMode("staff"); setClock(600,{instant:true,force:true,camera:false}); finishTween(); settle(40,true);
    needFrames=0; lastInput=-1e9; settling=false;
    var sIdle=frameState(performance.now());
    setMode("terrain"); setClock(250,{instant:true,force:true,camera:false}); finishTween(); settle(40,true);
    needFrames=0; lastInput=-1e9; settling=false;
    var sMist=frameState(performance.now()+1000);
    ck("render on demand: a view at rest draws nothing; slow drift alone draws at the ambient rate",
      sIdle==="idle"&&(HARNESS||RM?sMist==="idle":sMist==="ambient"),
      "paper map at rest: "+sIdle+"; landscape at 04:10 with mist: "+sMist+((HARNESS||RM)?" (drift is off in harness or reduced-motion mode)":""));

    if(mode!==save.mode) setMode(save.mode);
    setPresentation(save.pres);
    setClock(save.t,{instant:true,force:true,camera:false}); finishTween();
    landCam.position.copy(save.pos); orbitTarget.copy(save.tgt); landCam.lookAt(orbitTarget); clampCamera(); freeCam=save.fc;
    if(mode==="staff") MAPCAM.restore(save.map);
    requestRender(3);
    return {ms:Math.round(performance.now()-t0), ok:out.every(function(c){ return c.ok; }), checks:out};
  }
  function stats(){
    return {state:DEV.state, world:DEV.world, total:DEV.total, layer:ML.stats,
            camera:{clamps:CAM.clamps,violations:CAM.violations}, seating:{blocks:SEAT_STATS.blocks},
            memory:{geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures}};
  }
  return {groundY:groundY, camFloor:camFloor, settle:settle, applyCase:applyCase, placeCamera:placeCamera,
          selfTest:selfTest, stats:stats, figureError:figureError,
          cover:{grid:coverGrid, truth:coverTruth, render:coverRender, error:coverError, paperTruth:paperTruth, checks:coverChecks, roads:roadDrape, woods:woodPlacement}};
})();

init();
