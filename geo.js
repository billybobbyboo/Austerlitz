/* =========================================================================
   GEOREF - the single geographic reference for the map.
   (Named GEOREF because app.js already uses GEO for its mesh-geometry cache.)

   Ground truth (WGS84):
     villages  - municipality centres, Czech municipality register as published
                 in 33bcdd/souradnice-mest (state 1 January 2018)
     summits   - PeakVisor DEM summits; official heights where they differ
   The map keeps its historical frame. That frame is a similarity transform of
   true geography: fitted to twelve villages (the audit procedure: fit fifteen,
   twice re-score all fifteen and refit without the worst three). Every
   distance, bearing, scale bar, march rate and height in metres in the
   application derives from the constants below. Nothing else may hard-code
   a scale.
   ========================================================================= */
var GEOREF = (function(){
  /* local tangent plane about 49.14 N 16.76 E, in km */
  var LAT0 = 49.14, LON0 = 16.76;
  var KX = 111.32*Math.cos(LAT0*Math.PI/180), KY = 111.13;

  /* the fitted frame: map = [X0 + P*e - Q*n,  Y0 - Q*e - P*n]  (e,n in km)
     P = k cos(theta), Q = k sin(theta); k map units per true km            */
  var P = 30.194802341, Q = 9.475665481, X0 = 265.112325, Y0 = 251.134253;
  var K = Math.sqrt(P*P+Q*Q);                     /* 31.647 map units per km */
  var ROT = Math.atan2(Q,P)*180/Math.PI;          /* 17.42 degrees           */

  function en(lat,lon){ return [(lon-LON0)*KX, (lat-LAT0)*KY]; }
  function toMap(lat,lon){ var v=en(lat,lon); return [X0+P*v[0]-Q*v[1], Y0-Q*v[0]-P*v[1]]; }
  function mapToEN(mx,my){                      /* exact inverse, km east/north */
    var dx=mx-X0, dy=my-Y0, kk=P*P+Q*Q;
    return [(P*dx-Q*dy)/kk, (-Q*dx-P*dy)/kk];
  }
  function toGeo(mx,my){ var v=mapToEN(mx,my); return [LAT0+v[1]/KY, LON0+v[0]/KX]; }

  /* ---- horizontal scale: the only one ---- */
  var KM_PER_MAP   = 1/K;          /* 0.03160 km per map unit           */
  var MAP_PER_WORLD= 2;            /* W(): one world unit = two map units */
  var UNITS_PER_KM = K/MAP_PER_WORLD;     /* world units per km         */
  var M_PER_WORLD  = 1000/UNITS_PER_KM;   /* metres per world unit      */

  /* ---- vertical scale ----
     The model's heights are world units; metres = DATUM_M + h*V_M_PER_UNIT.
     The datum and the relief amplitudes in world.js were fitted together to
     the verified elevations in GT (tools/relief-fit.js).                   */
  var V_M_PER_UNIT = 6.12, DATUM_M = 243.1;     /* fitted with the relief: tools/relief-fit.js */
  var EXAG = M_PER_WORLD/V_M_PER_UNIT;   /* vertical exaggeration          */
  function elevM(h){ return DATUM_M + h*V_M_PER_UNIT; }
  function unitsFromM(m){ return m/V_M_PER_UNIT; }  /* a height difference */

  /* true north on the map (x right, y down); the frame is rotated ROT degrees */
  var NORTH = [-Math.sin(ROT*Math.PI/180), -Math.cos(ROT*Math.PI/180)];

  function kmBetween(a,b){ return Math.hypot(b[0]-a[0],b[1]-a[1])*KM_PER_MAP; }
  function bearingDeg(a,b){                     /* true bearing a->b, 0 = north */
    var A=mapToEN(a[0],a[1]), B=mapToEN(b[0],b[1]);
    var d=Math.atan2(B[0]-A[0],B[1]-A[1])*180/Math.PI; return (d+360)%360;
  }
  function compass8(deg){ return ["north","north-east","east","south-east","south","south-west","west","north-west"][Math.round(deg/45)%8]; }
  function northingKm(mx,my){ return mapToEN(mx,my)[1]; }

  /* ---- ground truth ----
     kind: v village, s summit, x other. elev: metres where sourced.
     approx: position derived rather than surveyed.                         */
  var GT = {
    telnitz:     {n:"Telnitz",     cz:"Telnice",          lat:49.101969, lon:16.717850, kind:"v", elev:195},
    sokolnitz:   {n:"Sokolnitz",   cz:"Sokolnice",        lat:49.114020, lon:16.721665, kind:"v", elev:207},
    kobelnitz:   {n:"Kobelnitz",   cz:"Kobylnice",        lat:49.138134, lon:16.731930, kind:"v", elev:211},
    puntowitz:   {n:"Puntowitz",   cz:"Ponětovice",       lat:49.152257, lon:16.742391, kind:"v"},
    schlapanitz: {n:"Schlapanitz", cz:"Šlapanice",        lat:49.168729, lon:16.727418, kind:"v"},
    girzikowitz: {n:"Girzikowitz", cz:"Jiříkovice",       lat:49.166816, lon:16.758096, kind:"v"},
    bosenitz:    {n:"Bosenitz",    cz:"Tvarožná",         lat:49.191870, lon:16.771563, kind:"v", elev:257},
    blasowitz:   {n:"Blasowitz",   cz:"Blažovice",        lat:49.165785, lon:16.786216, kind:"v"},
    holubitz:    {n:"Holubitz",    cz:"Holubice",         lat:49.177588, lon:16.812243, kind:"v"},
    pratzen:     {n:"Pratzen",     cz:"Prace",            lat:49.141161, lon:16.765498, kind:"v"},
    krzenowitz:  {n:"Krzenowitz",  cz:"Křenovice",        lat:49.142261, lon:16.829426, kind:"v"},
    austerlitz:  {n:"Austerlitz",  cz:"Slavkov u Brna",   lat:49.153354, lon:16.876598, kind:"v"},
    augezd:      {n:"Augezd",      cz:"Újezd u Brna",     lat:49.104448, lon:16.757474, kind:"v", elev:195},
    satschan:    {n:"Satschan",    cz:"Žatčany",          lat:49.087986, lon:16.733849, kind:"v"},
    menitz:      {n:"Menitz",      cz:"Měnín",            lat:49.082495, lon:16.694343, kind:"v"},
    hostieradek: {n:"Hostieradek", cz:"Hostěrádky-Rešov", lat:49.117751, lon:16.784406, kind:"v"},
    raigern:     {n:"Raigern",     cz:"Rajhrad",          lat:49.090311, lon:16.603982, kind:"v", offmap:true},
    rausnitz:    {n:"Rausnitz",    cz:"Rousínov",         lat:49.201381, lon:16.882252, kind:"v", offmap:true},
    kowalowitz:  {n:"Kowalowitz",  cz:"Kovalovice",       lat:49.204721, lon:16.819140, kind:"v", offmap:true},
    pratzeberg:  {n:"Pratzeberg",  cz:"Pracký kopec",     lat:49.128006, lon:16.763427, kind:"s", elev:324},
    vinohrady:   {n:"Stare Vinohrady", cz:"Staré vinohrady", lat:49.148292, lon:16.785864, kind:"s", elev:294},
    zuran:       {n:"Zuran",       cz:"Žuráň",            lat:49.179365, lon:16.738880, kind:"s", elev:290},
    santon:      {n:"Santon",      cz:"Santon",           lat:49.188258, lon:16.763559, kind:"s", elev:296},
    vinocol:     {n:"col south of Stare Vinohrady", cz:"", lat:49.132778, lon:16.786944, kind:"x", note:"PeakVisor key col of Staré vinohrady"},
    /* derived positions, not surveyed */
    chapel:      {n:"St Anthony chapel", cz:"kaple sv. Antonína", lat:49.10985, lon:16.757474, kind:"x", approx:true,
                  note:"On the hill at the northern edge of Újezd (cirkevnituristika.cz); placed ~0.6 km north of the village centre"},
    posthouse:   {n:"Posoritz post house", cz:"Stará pošta", lat:49.19337, lon:16.812243, kind:"x", approx:true,
                  note:"On the Olmütz highway north of Holubice: placed where a straight Tvarožná-Rousínov highway line crosses Holubice's meridian; uncertain by about 1 km"}
  };
  Object.keys(GT).forEach(function(k){ var g=GT[k]; g.map=toMap(g.lat,g.lon); });

  /* source notes for elevations */
  var ELEV_SRC = {
    pratzeberg:"324 m official (turistika.cz); 333 m DEM (PeakVisor), prominence 74 m",
    vinohrady:"294 m DEM (PeakVisor), prominence 21 m",
    zuran:"286 m official (turistika.cz); 293 m DEM (PeakVisor)",
    santon:"296 m (turistika.cz; PeakVisor), slopes 245-296 m (Šlapanice municipal study)",
    bosenitz:"257 m (Tvarožná municipality)",
    sokolnitz:"207 m (Sokolnice municipality)",
    kobelnitz:"211 m (Kobylnice municipality, ČÚZK)",
    telnitz:"195 m (turistika.cz, Telnice)",
    augezd:"195 m (Újezd u Brna municipal infobox)",
    krzenowitz:"203-216 m at the village; municipal range 210-250 m (turistika.cz; denik.cz)",
    austerlitz:"built-up area 200-237 m (Jihomoravský kraj water plan)"
  };

  return {
    GT:GT, ELEV_SRC:ELEV_SRC,
    toMap:toMap, toGeo:toGeo, mapToEN:mapToEN,
    K:K, ROT_DEG:ROT, NORTH:NORTH,
    KM_PER_MAP:KM_PER_MAP, UNITS_PER_KM:UNITS_PER_KM, M_PER_WORLD:M_PER_WORLD,
    V_M_PER_UNIT:V_M_PER_UNIT, DATUM_M:DATUM_M, EXAG:EXAG, elevM:elevM, unitsFromM:unitsFromM,
    kmBetween:kmBetween, bearingDeg:bearingDeg, compass8:compass8, northingKm:northingKm,
    place:function(id){ return GT[id].map.slice(); }
  };
})();
if(typeof module!=="undefined") module.exports=GEOREF;
