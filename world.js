/* ============================================================
   WORLD v2 — terrain, land cover, hydrography, settlement
   map (0..680, 0..500) -> world (x -170..170, z -125..125)
   1 world unit = 2 map units = GEOREF.M_PER_WORLD m (~63 m); relief exaggeration is GEOREF.EXAG
   ============================================================ */

/* One matte helper for the whole scene: rough, non-metallic, lit by the sun
   and by the sky environment. */
function matte(o){
  if(o.roughness===undefined) o.roughness=0.88;
  if(o.metalness===undefined) o.metalness=0.0;
  if(o.envMapIntensity===undefined) o.envMapIntensity=0.32;
  if(typeof o.color==="number") o.color=lin(o.color);
  return new THREE.MeshStandardMaterial(o);
}
/* r128 stores a hex handed to a material as if it were already linear, and the
   post chain converts linear to sRGB on output. Every colour in these files was
   designed as an sRGB value, so it is decoded once here; a Color object is
   assumed to be linear already. */
function lin(c){ return (typeof c==="number") ? new THREE.Color(c).convertSRGBToLinear() : c; }
/* canvas textures that carry colour (sky, mist, smoke, coats) are sRGB and are
   decoded on sample; label sprites bypass the chain and stay as painted */
function ctexS(cv){
  var t=ctex(cv); t.encoding=THREE.sRGBEncoding;
  /* every canvas that reaches this path is a power of two, so mipmaps are safe on any context */
  t.generateMipmaps=true; t.minFilter=THREE.LinearMipmapLinearFilter; t.anisotropy=4;
  return t;
}
function ctex(cv){
  var t=new THREE.CanvasTexture(cv);
  t.minFilter=THREE.LinearFilter; t.magFilter=THREE.LinearFilter;
  t.generateMipmaps=false; t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;
  return t;
}
function W(mx,my){ return [(mx-340)*0.5, (my-250)*0.5]; }
function M2W(pts){ return pts.map(function(p){ return W(p[0],p[1]); }); }

var UNITS_PER_KM = GEOREF.UNITS_PER_KM;   /* from geo.js: the only scale */

/* ---------------- hydrography ---------------- */
var GOLDBACH_M=[[250,109],[240,160],[212,218],[208,256],[207,297],[204,362],[208,376],[214,410],[237,415],[276,415]];
var LITAVA_M  =[[552,128],[511,138],[351,313],[297,372],[262,444],[215,500],[209,508]];   /* Slavkov south edge -> Hostěrádky -> Újezd -> Žatčany -> toward Židlochovice */
var BROOKS_M=[
  [[275,147],[256,185],[225,236]],
  [[283,237],[247,257],[208,275]],
  [[277,318],[251,341],[212,367]],
  [[199,205],[201,239],[201,260]],
  [[401,150],[415,196],[439,217]]   /* the Rakovec through Křenovice to the Litava (turistika.cz); course north of the village schematic */
];
var GOLDBACH=M2W(GOLDBACH_M), LITAVA=M2W(LITAVA_M), BROOKS=BROOKS_M.map(M2W);

/* ---------------- roads and tracks ---------------- */
var ROADS=[
 {n:"Brunn-Olmutz highway", cls:"highway", w:2.9,
  p:[[30,154],[142,128],[225,97],[239,80],[324,36],[401,-4]]},   /* west: legacy course; east of the Santon: past Tvarožná to the Posoritz post house and on toward Rausnitz */
 {n:"Pratzen-Austerlitz road", cls:"post", w:2.0, p:[[276,243],[360,199],[433,158],[507,126]]},   /* legacy shape re-anchored on its two villages; course unverified */
 {n:"Krzenowitz road", cls:"track", w:1.5, p:[[415,196],[348,217],[276,243]]},
 {n:"Sokolnitz-Telnitz track", cls:"track", w:1.5, p:[[208,365],[208,376],[212,408]]},
 {n:"Telnitz-Augezd track", cls:"track", w:1.5, p:[[212,408],[247,397],[297,372]]},
 {n:"Augezd causeway", cls:"track", w:1.6, p:[[297,372],[285,409],[262,444]]},
 {n:"Kobelnitz-Sokolnitz track", cls:"track", w:1.3, p:[[205,277],[211,312],[208,365]]},
 {n:"Puntowitz-Kobelnitz track", cls:"track", w:1.3, p:[[213,222],[215,247],[205,277]]},
 {n:"Blasowitz-Krzenowitz track", cls:"track", w:1.4, p:[[296,147],[339,139],[415,196]]},
 {n:"Schlapanitz-Girzikowitz track", cls:"track", w:1.4, p:[[163,177],[177,163],[233,162]]},
 {n:"Bosenitz-Blasowitz track", cls:"track", w:1.3, p:[[236,69],[261,114],[296,147]]},
 {n:"Pratzen-Sokolnitz track", cls:"track", w:1.4, p:[[276,243],[271,292],[238,334]]},
 {n:"Menitz track", cls:"track", w:1.3, p:[[212,408],[187,427],[182,464]]},
 {n:"Holubitz-Posoritz track", cls:"track", w:1.3, p:[[340,89],[332,62],[324,36]]},
 {n:"Raigern-Telnitz road", cls:"track", w:1.2, p:[[18,500],[115,443],[212,408]]}   /* local road via Otmarov; Raigern itself is off the map */
];

/* ---------------- woodland ---------------- */
var WOODS=[
 {c:[236,385], rx:24, ry:17, rot:0.08, n:190, conifer:0.12},   /* Sokolnitz pheasantry: legacy offset from the village */
 {c:[551,151], rx:30, ry:22, rot:0.0,  n:170, conifer:0.30},   /* Austerlitz park: legacy offset from the town */
 {c:[353,55],  rx:28, ry:13, rot:0.12, n:110, conifer:0.55},   /* wood above Holubitz */
 {c:[76,396],  rx:27, ry:19, rot:0.2,  n:112, conifer:0.40},   /* Raigern woods */
 {c:[229,253], rx:13, ry:9,  rot:0.4,  n:48,  conifer:0.45},   /* copse west of the plateau */
 {c:[235,64],  rx:15, ry:9,  rot:0.0,  n:50,  conifer:0.50},   /* copse behind the Santon */
 {c:[461,151], rx:23, ry:15, rot:0.3,  n:86,  conifer:0.35},   /* east of Krzenowitz */
 {c:[198,478], rx:24, ry:12, rot:0.15, n:66,  conifer:0.25},   /* below the Menitz mere */
 {c:[611,305], rx:28, ry:21, rot:0.0,  n:104, conifer:0.45},   /* far east */
 {c:[394,423], rx:23, ry:13, rot:0.25, n:74,  conifer:0.30}    /* south-east */
];

/* ---------------- marshy bottoms ---------------- */
var MARSH=[
 {c:[207,372], rx:15, ry:58},   /* lower Goldbach, Sokolnitz down to Telnitz */
 {c:[227,418], rx:38, ry:26},   /* confluence below Telnitz */
 {c:[272,418], rx:76, ry:26},   /* Satschan fringe */
 {c:[188,457], rx:62, ry:24},   /* Menitz fringe */
 {c:[202,273], rx:13, ry:44},   /* Kobelnitz bottom */
 {c:[324,343], rx:30, ry:22},   /* Litava bottom, Hostěrádky to Újezd */
 {c:[202,271], rx:12, ry:44},   /* Kobelnitz reach, where the bottom first turns wet */
 {c:[252,415], rx:34, ry:16},
 {c:[415,243], rx:34, ry:14}   /* Litava bottom below Slavkov */
];

var VINEYARD={c:[313,205], rx:23, ry:16};

/* ---------------- settlements ---------------- */
var VILLAGES=[   /* from GEOREF ground truth; Krug, Bellowitz and Turas are not in the register and keep their warped legacy place.
                    Raigern, Rausnitz and Kowalowitz lie beyond the frame and are shown as edge markers */
 ["Bosenitz",236,69,7],["Girzikowitz",233,162,9],["Puntowitz",213,222,8],
 ["Kobelnitz",205,277,9],["Sokolnitz",208,365,13],["Telnitz",212,408,12],
 ["Augezd",297,372,9],["Blasowitz",296,147,10],["Krug",339,139,5],
 ["Holubitz",340,89,7],["Pratzen",276,243,11],["Bellowitz",164,113,7],
 ["Schlapanitz",163,177,9],["Krzenowitz",415,196,10],["Austerlitz",507,126,24],
 ["Menitz",181,489,7],["Satschan",262,444,7],["Turas",89,372,5],
 ["Hostieradek",342,309,7],["Posoritz post house",324,36,3]
];
var CHURCHES=["Girzikowitz","Kobelnitz","Sokolnitz","Telnitz","Augezd","Blasowitz",
  "Pratzen","Schlapanitz","Krzenowitz","Austerlitz","Bosenitz","Holubitz"];

/* The Pratzen crest: Stare Vinohrady -> the col between them -> the Pratzeberg (GEOREF ground truth;
   the col is PeakVisor's key col of Stare Vinohrady). Used by the relief and the terrain line. */
var CREST_M=[[309,193],[313,205],[323,231],[332,257],[309,273],[285,289],[281,302]];

/* ---------------- named terrain analysis ---------------- */
var TERRAIN_LINES=[
 {t:"ridge", n:"Pratzen crest", p:CREST_M,
  note:"The dominant ground of the field. Whoever held it held the centre and the interior lines."},
 {t:"ridge", n:"Santon spur", p:[[213,80],[222,87],[227,94]],
  note:"Short steep spur north of the highway, scarped and entrenched before the battle."},
 {t:"ridge", n:"Holubitz ridge", p:[[384,91],[349,108],[330,125],[309,139]],
  note:"Bagration's shelf along the highway. Low, but enough to anchor the Allied right."},
 {t:"ridge", n:"Zuran rise", p:[[168,131],[177,134],[193,143]],
  note:"Napoleon's first command post. Low, but it looks straight down the French front."},
 {t:"scarp", n:"Western escarpment", p:[[273,188],[259,233],[245,280],[248,324],[258,349]],
  note:"The face Soult's divisions climbed. At true scale the plateau is a gentle rise, about 115 m from the Goldbach to the Pratzeberg over some 2.5 km; on the morning of the battle it was the fog in the valley at its foot that hid his divisions."},
 {t:"valley", n:"Goldbach bottom", p:[[240,160],[213,222],[203,277],[206,365],[212,408],[239,413]],
  note:"Marshy in December: a small obstacle to infantry, a serious one to guns and formed cavalry, which cross it at the villages."},
 {t:"valley", n:"Litava bottom", p:[[511,138],[351,313],[297,372],[262,444]],
  note:"Frames the south-east of the field and funnels the Allied retreat toward the meres."},
 {t:"defile", n:"Augezd defile", p:[[297,372],[280,408],[262,444]],
  note:"The neck of dry ground between the two meres. The only ordered way out for three Allied columns."},
 {t:"dead", n:"Dead ground, Goldbach valley", p:[[221,192],[210,242],[201,281]],
  note:"Dead ground as seen from the Pratzeberg in this model's terrain - a derived reading. On the morning of the battle it was the fog that hid Saint-Hilaire's and Vandamme's divisions forming here."}
];

/* ---------------- noise and relief ---------------- */
function hash2(i,j){
  var n=Math.imul(i,374761393)+Math.imul(j,668265263);
  n=Math.imul(n^(n>>>13),1274126177);
  return ((n^(n>>>16))>>>0)/4294967295;
}
function vnoise(x,z){
  var xi=Math.floor(x), zi=Math.floor(z), xf=x-xi, zf=z-zi;
  var u=xf*xf*(3-2*xf), v=zf*zf*(3-2*zf);
  var a=hash2(xi,zi), b=hash2(xi+1,zi), c=hash2(xi,zi+1), d=hash2(xi+1,zi+1);
  return (a*(1-u)+b*u)*(1-v)+(c*(1-u)+d*u)*v;
}
function dist2(ax,az,bx,bz){ var dx=ax-bx, dz=az-bz; return Math.sqrt(dx*dx+dz*dz); }
function pnoise(x,z,P){
  var xi=Math.floor(x), zi=Math.floor(z), xf=x-xi, zf=z-zi;
  var u=xf*xf*(3-2*xf), v=zf*zf*(3-2*zf);
  var x0=((xi%P)+P)%P, x1=(x0+1)%P, z0=((zi%P)+P)%P, z1=(z0+1)%P;
  var a=hash2(x0,z0), b=hash2(x1,z0), c=hash2(x0,z1), d=hash2(x1,z1);
  return (a*(1-u)+b*u)*(1-v)+(c*(1-u)+d*u)*v;
}
function segDist(px,pz,ax,az,bx,bz){
  var vx=bx-ax, vz=bz-az, wa=px-ax, wb=pz-az;
  var c1=wa*vx+wb*vz; if(c1<=0) return dist2(px,pz,ax,az);
  var c2=vx*vx+vz*vz; if(c2<=c1) return dist2(px,pz,bx,bz);
  var t=c1/c2; return dist2(px,pz,ax+t*vx,az+t*vz);
}
function polyDist(px,pz,pts){
  var d=1e9;
  for(var i=0;i<pts.length-1;i++){
    var s=segDist(px,pz,pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1]);
    if(s<d) d=s;
  }
  return d;
}
function smoothstep(a,b,x){ var t=Math.min(1,Math.max(0,(x-a)/(b-a))); return t*t*(3-2*t); }
function bump(x,z,c,rx,rz,h,edge){
  var d=Math.sqrt(((x-c[0])/rx)*((x-c[0])/rx)+((z-c[1])/rz)*((z-c[1])/rz));
  return h*(1-smoothstep(edge,1,d));
}
function ell(x,z,cm,rx,ry){
  if(!cm._w) cm._w=W(cm[0],cm[1]);
  var a=(x-cm._w[0])/(rx*0.5), b=(z-cm._w[1])/(ry*0.5);
  return Math.sqrt(a*a+b*b);
}

var CREST=M2W(CREST_M);
var PRAT=W(310,250), VINO=W(313,205), PBERG=W(285,289), SANTON=W(222,87),
    ZURAN=W(177,134), SATS=W(268,421), MENI=W(187,457), SLAV=W(507,126), SCHLAP=W(163,177);

/* The land's large-scale fall, fitted to surveyed elevations (tools/relief-fit.js): ground rising
   to the north, and the broad middle-Litava lowland along the Litava and the Rakovec. Kept apart
   from the local relief, because the floor, the land-cover thresholds and the pond levels are
   calibrated on local relief and must keep their meaning. World units, before the 1.2 factor. */
function regionalH(x,z){
  var nk=GEOREF.mapToEN(x*2+340,z*2+250)[1];                 /* true northing, km           */
  var dv=Math.min(polyDist(x,z,LITAVA),polyDist(x,z,BROOKS[BROOKS.length-1]));
  return 0.51*smoothstep(3.0,6.0,nk) + 0.37*nk - 3.16*Math.exp(-(dv*dv)/625);
}
/* A pond's shoreline is level: within and just around each mere the regional level is held at
   the mere's own value, blending out beyond the rim. The legacy water levels (local relief)
   then sit below the rim all the way round, as they did before the regional fall was added. */
var _RS=null, _RM=null;
function pondHold(x,z,c,rx,rz){ var d=Math.sqrt(((x-c[0])/rx)*((x-c[0])/rx)+((z-c[1])/rz)*((z-c[1])/rz)); return 1-smoothstep(1.05,1.25,d); }   /* full hold to just past the water's edge (d=1), fading by 1.25 */
function regionalLevel(x,z){
  if(_RS===null){ _RS=regionalH(SATS[0],SATS[1]); _RM=regionalH(MENI[0],MENI[1]); }
  var r=regionalH(x,z), ws=pondHold(x,z,SATS,28,10.5), wm=pondHold(x,z,MENI,23,9);
  if(ws>0) r=r*(1-ws)+_RS*ws;
  if(wm>0) r=r*(1-wm)+_RM*wm;
  return r;
}
function height(x,z){ return localHeight(x,z) + 1.2*regionalLevel(x,z); }
function localHeight(x,z){
  var h = 2.3*(vnoise(x/34+11.3,z/34+5.7)-0.5)
        + 1.1*(vnoise(x/15+61.1,z/15+27.9)-0.5)
        + 0.32*(vnoise(x/7+103.7,z/7+83.1)-0.5);
  /* relief amplitudes fitted to verified elevations (tools/relief-fit.js):
     Pratzeberg 324 m, Stare Vinohrady 294, Santon 296, Zuran 286-293, Tvarozna 257,
     Kobylnice 211 -> Sokolnice 207 (the drop kept), Prace 245, the col 273, Ujezd 195,
     Krenovice 203-216, Slavkov 200-237 (range only). Metres = GEOREF.elevM(h).           */
  h += bump(x,z,PRAT,50,60,1.13,0.48);                       /* the broad upland            */
  var dc=polyDist(x,z,CREST); h += 5.29*Math.exp(-(dc*dc)/64); /* the crest arc, ~0.5 km wide */
  h += bump(x,z,VINO,11,10,1.03,0.26);
  h += bump(x,z,PBERG,10,9.5,5.45,0.26);
  h += bump(x,z,SANTON,7.4,6.4,5.24,0.30);
  h += bump(x,z,ZURAN,6.6,5.8,5.45,0.36);
  h += bump(x,z,SLAV,13,11,2.58,0.40);                       /* the rise Austerlitz stands on (fitted) */
  h += bump(x,z,SCHLAP,15,9,3.0,0.36);
  var dg=polyDist(x,z,GOLDBACH); h -= 3.3*Math.exp(-(dg*dg)/66);
  var dl=polyDist(x,z,LITAVA);   h -= 2.6*Math.exp(-(dl*dl)/88);
  for(var i=0;i<BROOKS.length;i++){
    var db=polyDist(x,z,BROOKS[i]); h -= 1.15*Math.exp(-(db*db)/34);
  }
  var ps=Math.sqrt(((x-SATS[0])/28)*((x-SATS[0])/28)+((z-SATS[1])/10.5)*((z-SATS[1])/10.5));
  h -= 4.3*(1-smoothstep(0.55,1.15,ps));
  var pm=Math.sqrt(((x-MENI[0])/23)*((x-MENI[0])/23)+((z-MENI[1])/9)*((z-MENI[1])/9));
  h -= 5.3*(1-smoothstep(0.55,1.15,pm));
  return Math.max(h*1.2,-6.9);
}
/* The land-cover classifier: one definition, used by the terrain build and by the tests.
   ml is LOCAL relief (see regionalH): the thresholds were calibrated on it.
   0 field, 1 meadow, 2 marsh, 3 water, 4 wood, 5 village, 6 vineyard, 7 track */
function coverClass(mx,mz,ml){
  var water=covAt(covWater,mx,mz), marsh=covAt(covMarsh,mx,mz), wood=covAt(covWood,mx,mz),
      vill=covAt(covVill,mx,mz), road=covAt(covRoad,mx,mz), vine=covAt(covVine,mx,mz);
  var pondS=1-smoothstep(0.55,1.08,Math.sqrt(((mx-SATS[0])/28)*((mx-SATS[0])/28)+((mz-SATS[1])/10.5)*((mz-SATS[1])/10.5)));
  var pondM=1-smoothstep(0.55,1.08,Math.sqrt(((mx-MENI[0])/23)*((mx-MENI[0])/23)+((mz-MENI[1])/9)*((mz-MENI[1])/9)));
  if(pondS>0.5||pondM>0.5||(water>0.55&&ml<-2.6)) return 3;
  if(marsh>0.45&&ml<0.4) return 2;
  if(vill>0.55) return 5;
  if(wood>0.5) return 4;
  if(road>0.6) return 7;
  if(vine>0.55) return 6;
  if(ml<-1.2||water>0.35) return 1;
  return 0;
}
function hAt(mx,my){ var w=W(mx,my); return height(w[0],w[1]); }

/* ---------------- coarse land-cover raster ---------------- */
var COV_NX=168, COV_NZ=146, COV_X0=-180, COV_Z0=-155, COV_DX=360/167, COV_DZ=310/145;
var covWood, covMarsh, covVill, covRoad, covWater, covVine;

function buildCover(){
  var n=COV_NX*COV_NZ;
  covWood=new Float32Array(n); covMarsh=new Float32Array(n); covVill=new Float32Array(n);
  covRoad=new Float32Array(n); covWater=new Float32Array(n); covVine=new Float32Array(n);
  var roadPts=ROADS.map(function(r){ return {p:M2W(r.p), w:r.w}; });
  var villW=VILLAGES.map(function(v){ var c=W(v[1],v[2]); return [c[0],c[1],2.6+v[3]*0.46]; });
  for(var j=0;j<COV_NZ;j++){
    var z=COV_Z0+j*COV_DZ;
    for(var i=0;i<COV_NX;i++){
      var x=COV_X0+i*COV_DX, k=j*COV_NX+i, s, t;
      s=0;
      for(t=0;t<WOODS.length;t++){
        var wd=WOODS[t];
        s=Math.max(s,1-smoothstep(0.62,1.16,ell(x,z,wd.c,wd.rx,wd.ry)));
      }
      covWood[k]=s;
      s=0;
      for(t=0;t<MARSH.length;t++){
        var mr=MARSH[t];
        s=Math.max(s,1-smoothstep(0.6,1.05,ell(x,z,mr.c,mr.rx,mr.ry)));
      }
      covMarsh[k]=s;
      s=0;
      for(t=0;t<villW.length;t++){
        var vv=villW[t], dv=Math.hypot(x-vv[0],z-vv[1]);
        s=Math.max(s,1-smoothstep(vv[2]*0.72,vv[2]*1.35,dv));
      }
      covVill[k]=s;
      var dr=1e9;
      for(t=0;t<roadPts.length;t++) dr=Math.min(dr,polyDist(x,z,roadPts[t].p)-roadPts[t].w*0.5);
      covRoad[k]=1-smoothstep(0.4,2.6,dr);
      var dw=Math.min(polyDist(x,z,GOLDBACH),polyDist(x,z,LITAVA));
      for(t=0;t<BROOKS.length;t++) dw=Math.min(dw,polyDist(x,z,BROOKS[t]));
      covWater[k]=1-smoothstep(1.0,3.0,dw);
      covVine[k]=1-smoothstep(0.75,1.06,ell(x,z,VINEYARD.c,VINEYARD.rx,VINEYARD.ry));
    }
  }
}
function covAt(a,x,z){
  var fi=(x-COV_X0)/COV_DX, fj=(z-COV_Z0)/COV_DZ;
  var i=Math.max(0,Math.min(COV_NX-2,Math.floor(fi))), j=Math.max(0,Math.min(COV_NZ-2,Math.floor(fj)));
  var u=Math.max(0,Math.min(1,fi-i)), v=Math.max(0,Math.min(1,fj-j));
  var k=j*COV_NX+i;
  return (a[k]*(1-u)+a[k+1]*u)*(1-v)+(a[k+COV_NX]*(1-u)+a[k+COV_NX+1]*u)*v;
}

/* ---------------- analysis grid ---------------- */
var G_NX=301, G_NZ=259, G_X0=-180, G_Z0=-155, G_DX=360/300, G_DZ=310/258;
var gridH=null, gridCurv=null;
function buildGrid(){
  gridH=new Float32Array(G_NX*G_NZ);
  gridCurv=new Float32Array(G_NX*G_NZ);
  var i,j;
  for(j=0;j<G_NZ;j++) for(i=0;i<G_NX;i++)
    gridH[j*G_NX+i]=height(G_X0+i*G_DX, G_Z0+j*G_DZ);
  for(j=1;j<G_NZ-1;j++) for(i=1;i<G_NX-1;i++){
    var k=j*G_NX+i;
    gridCurv[k]=gridH[k-1]+gridH[k+1]+gridH[k-G_NX]+gridH[k+G_NX]-4*gridH[k];
  }
}
function gridAt(a,x,z){
  var fi=(x-G_X0)/G_DX, fj=(z-G_Z0)/G_DZ;
  var i=Math.max(0,Math.min(G_NX-2,Math.floor(fi))), j=Math.max(0,Math.min(G_NZ-2,Math.floor(fj)));
  var u=Math.max(0,Math.min(1,fi-i)), v=Math.max(0,Math.min(1,fj-j)), k=j*G_NX+i;
  return (a[k]*(1-u)+a[k+1]*u)*(1-v)+(a[k+G_NX]*(1-u)+a[k+G_NX+1]*u)*v;
}

/* ---------------- the land cover as drawn (Stage 2F; decision 28; docs/STAGE2_SPEC.md sections J and K) ----------------
   The classes are the model's own, coverClass on the cover rasters (buildCover, covAt) and the local relief: nothing here
   changes a class. Until 2F each 81 m triangle of the ground was drawn in the class of its centroid, so every edge was a
   saw-tooth of triangles, up to 156 m from the model's edge (tools/stage2/cover-2f.js). Now the ground shader evaluates the
   same rule at every drawn point (atlasShader): the six rasters are uploaded as they are and interpolated as covAt does,
   and the local relief is read from COVER_ML, the model's localHeight on a grid of 0.25 world units (16 m), interpolated
   bicubically (coverMlAt). The local relief matters only at coverClass's three thresholds (-2.6, 0.4, -1.2), and on a flat
   valley floor a small error there moves the edge far: from the 81 m vertices meadow would be 234 m out, bilinear on a 0.5
   grid 44 m, bilinear on this grid 24.5 m (one island a centimetre of relief high), bicubic 7.2 m. So the
   grid is built coarse to fine: localHeight exactly every 1.0 unit; each node of the 0.5 and then the 0.25 lattice
   interpolated from the coarser one, and evaluated exactly where that value lies within COVER_ML.near of a threshold
   (0.5, then 0.2). Every node then lies on the same side of every threshold as localHeight itself (checked against the
   exact grid, all 1,809,801 nodes; tools/stage2/cover-2f.js), for 632,442 evaluations instead of 1.81 million.
   drawnCover(x, z) is the same rule on the CPU, for what is placed by class (the trees and scrub of the woods, the paper
   map's woods). The going layer is not this: it stays per triangle, from FACE.cover and the model slope (decision 32). */
var COVER_ML={step:0.25, nx:1449, nz:1249, x0:-181, z0:-156, near:[0.5,0.2], a:null, exact:0};   /* one node beyond the field all round */
function buildCoverMl(){
  var M=COVER_ML, nx=M.nx, nz=M.nz, a=new Float32Array(nx*nz), n=0, i, j;
  function exact(i,j){ n++; return localHeight(M.x0+i*M.step,M.z0+j*M.step); }
  for(j=0;j<nz;j+=4) for(i=0;i<nx;i+=4) a[j*nx+i]=exact(i,j);
  [[2,M.near[0]],[1,M.near[1]]].forEach(function(L){ var s=L[0], d=L[1], S=2*s;
    for(j=0;j<nz;j+=s) for(i=0;i<nx;i+=s){ if(i%S===0&&j%S===0) continue;
      var i0=i-i%S, j0=j-j%S, i1=Math.min(nx-1,i0+S), j1=Math.min(nz-1,j0+S), u=(i-i0)/S, v=(j-j0)/S;
      var val=(a[j0*nx+i0]*(1-u)+a[j0*nx+i1]*u)*(1-v)+(a[j1*nx+i0]*(1-u)+a[j1*nx+i1]*u)*v;
      a[j*nx+i]=(Math.abs(val+2.6)<d||Math.abs(val+1.2)<d||Math.abs(val-0.4)<d)?exact(i,j):val; } });
  M.a=a; M.exact=n;
}
/* between the nodes, Catmull-Rom (bicubic, the 4 x 4 nodes around the point): it follows a rounded crest or hollow that
   bilinear interpolation cuts, which matters where the relief only just crosses a threshold */
function crWeights(t){ var t2=t*t, t3=t2*t; return [0.5*(-t3+2*t2-t),0.5*(3*t3-5*t2+2),0.5*(-3*t3+4*t2+t),0.5*(t3-t2)]; }
function coverMlAt(x,z){
  var M=COVER_ML, fi=(x-M.x0)/M.step, fj=(z-M.z0)/M.step;
  var i=Math.max(1,Math.min(M.nx-3,Math.floor(fi))), j=Math.max(1,Math.min(M.nz-3,Math.floor(fj)));
  var wx=crWeights(Math.max(0,Math.min(1,fi-i))), wz=crWeights(Math.max(0,Math.min(1,fj-j))), a=M.a, r=0;
  for(var b=0;b<4;b++){ var k=(j-1+b)*M.nx+i-1; r+=wz[b]*(wx[0]*a[k]+wx[1]*a[k+1]+wx[2]*a[k+2]+wx[3]*a[k+3]); }
  return r;
}
function drawnCover(x,z){ return coverClass(x,z,coverMlAt(x,z)); }

/* ---------------- the ground as drawn ----------------
   Anything that must stand on the visible ground - figures, standards, the camera floor, mist
   edges - reads the terrain mesh's own triangles, not the analytic height(), which the 81 m
   triangulation departs from by up to a few tenths of a unit on steep ground. The layout matches
   PlaneGeometry(360,310,280,240) turned flat: cell (ix,iz) is triangles (a,b,d) and (b,c,d). */
var GROUND_W=360, GROUND_D=310, GROUND_NX=280, GROUND_NZ=240;

/* ---------------- display height (Stage 2B; owner decisions 19 and 35) ----------------
   The ground is DRAWN at s times the model height, s = DISPLAY.factor / GEOREF.EXAG. DISPLAY.factor is a
   view setting stated relative to true scale: 1 is true scale, 4 the default, GEOREF.EXAG (10.33) the
   model's own vertical scale, i.e. the drawing before Stage 2B. It is presentation state, not a second
   scale: metres, kilometres and the vertical scale still come only from GEOREF, s is always derived from
   GEOREF.EXAG, and height(), hAt(), the viewshed, line of sight, the contour levels, dossier elevations,
   land cover, the going classes and the march audit stay in model units. Everything placed on the drawn
   ground reads displayHeight() or groundY() (the mesh itself); tools/stage2/height-sites.js --check,
   run by tools/run-all.sh, fails if presentation code calls height() or hAt(). Symbols (figures,
   standards, buildings, trees) are never rescaled: only their seat on the ground moves. */
var DISPLAY={factor:4, defaultFactor:4, settings:[1,4,GEOREF.EXAG], flat:false};
/* Stage 2E (decision 19, docs/STAGE2_SPEC.md section G.2): the paper map draws the ground FLAT, whatever the setting:
   DISPLAY.flat is set while it is shown, and the drawn scale is then 0 (the setting, DISPLAY.factor, is kept for the
   landscape). Its relief is read from its own cartographic hillshade (PAPER_HILLSHADE), never from the drawn height. */
function displayScale(){ return DISPLAY.flat ? 0 : DISPLAY.factor/GEOREF.EXAG; }
function displayY(h){ return h*displayScale(); }
function displayHeight(x,z){ return displayY(height(x,z)); }
/* The camera presets (PHASES, ANALYSIS and TOUR cameras, VANTAGE, the staff view, the harness cases) were
   authored over the ground drawn at GEOREF.EXAG, i.e. over the model height. They are never edited; at use
   each point keeps its height above its own ground: y' = y + authoredLift(x, z). */
function authoredLift(x,z){ var h=height(x,z); return displayY(h)-h; }
function reframe(c){ return [c[0],c[1]+authoredLift(c[0],c[2]),c[2], c[3],c[4]+authoredLift(c[3],c[5]),c[5]]; }

/* things built once on the ground keep their height above it when the factor changes */
function seatGeometry(o){   /* a mesh or line whose vertices are in world space */
  var P=o.geometry.attributes.position, off=new Float32Array(P.count);
  for(var i=0;i<P.count;i++) off[i]=P.getY(i)-displayHeight(P.getX(i),P.getZ(i));
  o.userData.seatOff=off; return o;
}
function reseatGeometry(o){
  var P=o.geometry.attributes.position, off=o.userData.seatOff;
  for(var i=0;i<P.count;i++) P.setY(i,displayHeight(P.getX(i),P.getZ(i))+off[i]);
  P.needsUpdate=true;
  if(o.isMesh&&o.geometry.attributes.normal) o.geometry.computeVertexNormals();
  if(o.geometry.computeBoundingSphere) o.geometry.computeBoundingSphere(); if(o.geometry.boundingBox) o.geometry.computeBoundingBox();
}
var _seatM=null, _seatP, _seatQ, _seatS;   /* made on first use: the suites load this file with a minimal THREE */
function seatScratch(){ if(!_seatM){ _seatM=new THREE.Matrix4(); _seatP=new THREE.Vector3(); _seatQ=new THREE.Quaternion(); _seatS=new THREE.Vector3(); } }
function seatInstances(im){
  seatScratch();
  var off=new Float32Array(im.count);
  for(var i=0;i<im.count;i++){ im.getMatrixAt(i,_seatM); _seatM.decompose(_seatP,_seatQ,_seatS); off[i]=_seatP.y-displayHeight(_seatP.x,_seatP.z); }
  im.userData.seatOff=off; SEATED.push(im); return im;
}
function reseatInstances(im){
  seatScratch();
  var off=im.userData.seatOff;
  for(var i=0;i<im.count;i++){
    im.getMatrixAt(i,_seatM); _seatM.decompose(_seatP,_seatQ,_seatS);
    _seatP.y=displayHeight(_seatP.x,_seatP.z)+off[i]; _seatM.compose(_seatP,_seatQ,_seatS); im.setMatrixAt(i,_seatM);
  }
  im.instanceMatrix.needsUpdate=true;
}
var SEATED=[], SEATED_GEO=[];

function groundY(x,z){
  if(!groundMesh) return displayHeight(x,z);
  var P=groundMesh.geometry.attributes.position.array, cw=GROUND_W/GROUND_NX, cd=GROUND_D/GROUND_NZ;
  var fx=(x+GROUND_W/2)/cw, fz=(z+GROUND_D/2)/cd;
  if(fx<0||fz<0||fx>GROUND_NX||fz>GROUND_NZ) return displayHeight(x,z);
  var ix=Math.min(GROUND_NX-1,Math.floor(fx)), iz=Math.min(GROUND_NZ-1,Math.floor(fz)), u=fx-ix, v=fz-iz;
  var o0=(iz*GROUND_NX+ix)*18, o1=o0+9;
  var ha=P[o0+1], hb=P[o0+4], hd=P[o0+7], hc=P[o1+4];
  return (u+v<=1) ? ha+u*(hd-ha)+v*(hb-ha) : hc+(1-u)*(hb-hc)+(1-v)*(hd-hc);
}

/* ---------------- state ---------------- */
var scrubMesh=null;
var groundMesh=null, domeMesh=null, mistGroup=null, treeMesh=null, coniferMesh=null,
    roofMesh=null, houseMesh=null, spireMesh=null, waterMeshes=[], iceRims=[], roadMeshes=[],
    contourGroup=null, marshGroup=null, analysisGroup=null;
var FACE={n:0,x:null,z:null,h:null,slope:null,shade:null,cover:null,ao:null,nz:null};
var palNatural=null, palPaper=null, palGoing=null, apronMesh=null, chimneyMesh=null, _palNat={};
/* Stage 2E (decision 19; docs/STAGE2_SPEC.md section G.2): the paper map's cartographic hillshade has its own factor,
   stated in its legend, whatever the relief setting of the landscape. Relative to true scale, as the setting is: the
   model's normals (FACE.baseN, on its own vertical scale GEOREF.EXAG) are re-scaled by PAPER_HILLSHADE / GEOREF.EXAG.
   A design value, chosen on the renders (CHANGELOG.md, Stage 2E), not a scale: nothing is measured with it. */
var PAPER_HILLSHADE=6;
function paperShade(){
  var s=PAPER_HILLSHADE/GEOREF.EXAG, B=FACE.baseN, n=B.length/3, out=new Float32Array(n);
  var LX=-0.52, LY=0.70, LZ=-0.49, ln=Math.sqrt(LX*LX+LY*LY+LZ*LZ); LX/=ln; LY/=ln; LZ/=ln;
  for(var q=0;q<n;q++){ var nx=B[q*3]*s, ny=B[q*3+1], nz=B[q*3+2]*s, L=Math.sqrt(nx*nx+ny*ny+nz*nz)||1;
    out[q]=Math.max(0,(nx*LX+ny*LY+nz*LZ)/L); }
  FACE.psh=out;
}
var groundPalette="natural", vsMask=null, vsOrigin=null;

/* ---------------- build ---------------- */
/* the ground's geometry: built on the model surface, then drawn at the display factor. buildWorld's, and terrain-test.js's, which reads
   the drawn ground through groundY over it (roadmap step 1, docs/FINAL_AUDIT.md T-2: until step 1 these lines stood inside buildWorld,
   unchanged, and the suite checked the meres against a ground of its own). Needs buildCover and buildGrid first; sets FACE */
function groundGeometry(){
  var geo=new THREE.PlaneGeometry(GROUND_W,GROUND_D,GROUND_NX,GROUND_NZ);   /* groundY() reads this layout */
  geo.rotateX(-Math.PI/2);
  /* the ground is first built on the MODEL surface (the drawing before 2B): land cover, the elevation tint
     and the going classes are read from it, so they are the same at every display factor; then it is
     drawn at the display factor (scaleGround) */
  var pos=geo.attributes.position;
  for(var i=0;i<pos.count;i++) pos.setY(i, height(pos.getX(i),pos.getZ(i)));
  geo.computeVertexNormals();      /* averaged across faces, so slopes are continuous */
  geo=geo.toNonIndexed();          /* then split, keeping those smooth normals per vertex */
  /* world-space UVs for the grain texture: one tile per 7 world units (about 270 m) */
  (function(){
    var pa=geo.attributes.position, uv=new Float32Array(pa.count*2);
    for(var i=0;i<pa.count;i++){ uv[i*2]=pa.getX(i)/11.0; uv[i*2+1]=pa.getZ(i)/11.0; }
    geo.setAttribute("uv",new THREE.BufferAttribute(uv,2));
  })();
  buildFaceFacts(geo);
  FACE.baseY=new Float32Array(geo.attributes.position.count);
  for(var bi=0;bi<FACE.baseY.length;bi++) FACE.baseY[bi]=geo.attributes.position.array[bi*3+1];
  FACE.baseN=Float32Array.from(geo.attributes.normal.array);
  FACE.gslope=Float32Array.from(FACE.slope); FACE.gshade=Float32Array.from(FACE.shade);   /* model slope: the going classes */
  groundVertexFacts(geo);
  scaleGround(geo);
  return geo;
}
function buildWorld(scene){
  buildCover();
  buildGrid();
  buildCoverMl();

  var sc=document.createElement("canvas"); sc.width=4; sc.height=256;
  var sctx=sc.getContext("2d");
  var g=sctx.createLinearGradient(0,0,0,256);
  LAND_COL.skyInit.forEach(function(q){ g.addColorStop(q[0],hexCss(q[1])); });   /* the dome's first texture; the light table repaints it (paintSky) */
  sctx.fillStyle=g; sctx.fillRect(0,0,4,256);
  domeMesh=new THREE.Mesh(new THREE.SphereGeometry(1400,32,20),   /* beyond the apron and the fog */
    new THREE.MeshBasicMaterial({map:ctex(sc),side:THREE.BackSide,fog:false,depthWrite:false}));
  scene.add(domeMesh);

  var geo=groundGeometry();
  (function(){
    var cov=new Float32Array(FACE.n*3);
    for(var f=0;f<FACE.n;f++){
      var cell=FACE.cover[f];
      if(cell===0){ var cr=FACE.crop[f]; cell = cr===1?8 : cr===2?9 : cr===3?10 : 0; }
      cov[f*3]=cov[f*3+1]=cov[f*3+2]=cell;
    }
    geo.setAttribute("cover",new THREE.BufferAttribute(cov,1));
  })();
  palNatural=_palNat[displayScale()]=makePalette("natural");
  paperShade();
  palPaper=makePalette("paper");
  geo.setAttribute("color",new THREE.BufferAttribute(new Float32Array(FACE.n*9),3));
  groundMesh=new THREE.Mesh(geo,atlasShader(matte({vertexColors:true,flatShading:false,
    map:coverAtlas(), normalMap:coverNormalAtlas(), envMapIntensity:0.28,
    normalScale:new THREE.Vector2(0.45,0.45), roughness:0.94, metalness:0.0})));
  groundMesh.material.userData.grain=groundMesh.material.map;
  groundMesh.receiveShadow=true;
  scene.add(groundMesh);
  applyGround();

  buildWater(scene);
  buildRoads(scene);
  buildSettlements(scene);
  buildWoods(scene);
  apronMesh=buildApron(scene);
  buildContours(scene);
  buildMarshSymbols(scene);
  buildAnalysis(scene);
  buildMist(scene);
  buildPaperSymbols(scene);

  return {ground:groundMesh, apron:apronMesh, dome:domeMesh, mist:mistGroup, trees:treeMesh, conifers:coniferMesh, scrub:scrubMesh,
          houses:houseMesh, roofs:roofMesh, spires:spireMesh, chimneys:chimneyMesh, water:waterMeshes, iceRims:iceRims, roads:roadMeshes,
          contours:contourGroup, marsh:marshGroup, analysis:analysisGroup, paper:paperGroup};
}

/* Stage 2F: what the ground shader interpolates between the vertices to colour each point (atlasShader): the elevation tint
   (from the model height, in metres), the curvature (the hollows' occlusion and the field tint), and the frame of the field
   pattern (fieldStrip's strips and blocks, turned by the angle at the vertex). Read once, on the model surface (FACE.baseY). */
function groundVertexFacts(geo){
  var pa=geo.attributes.position.array, n=pa.length/3, g=new Float32Array(n*4), cw=GROUND_W/GROUND_NX, cd=GROUND_D/GROUND_NZ, L={};
  for(var q=0;q<n;q++){ var x=pa[q*3], z=pa[q*3+2], key=Math.round((x+GROUND_W/2)/cw)*1000+Math.round((z+GROUND_D/2)/cd), c=L[key];
    if(!c){ var ang=0.5+1.7*vnoise(x/88+3.1,z/88+7.7), ca=Math.cos(ang), sa=Math.sin(ang);
      c=L[key]=[Math.max(0,Math.min(1,(GEOREF.elevM(FACE.baseY[q])-200)/123)),gridAt(gridCurv,x,z),x*ca+z*sa,-x*sa+z*ca]; }
    g[q*4]=c[0]; g[q*4+1]=c[1]; g[q*4+2]=c[2]; g[q*4+3]=c[3]; }
  geo.setAttribute("gnd",new THREE.BufferAttribute(g,4));
}
/* draw the model-built ground at the display factor: y = s * h; the smooth normals of a surface scaled
   vertically by s are (s nx, ny, s nz), normalised; the baked shade, frost and drawn slope follow them */
function scaleGround(geo){
  var s=displayScale(), P=geo.attributes.position.array, N=geo.attributes.normal.array, B=FACE.baseN;
  for(var i=0;i<FACE.baseY.length;i++){
    P[i*3+1]=FACE.baseY[i]*s;
    if(s===1){ N[i*3]=B[i*3]; N[i*3+1]=B[i*3+1]; N[i*3+2]=B[i*3+2]; continue; }
    var nx=B[i*3]*s, ny=B[i*3+1], nz=B[i*3+2]*s, L=Math.sqrt(nx*nx+ny*ny+nz*nz)||1;
    N[i*3]=nx/L; N[i*3+1]=ny/L; N[i*3+2]=nz/L;
  }
  geo.attributes.position.needsUpdate=true; geo.attributes.normal.needsUpdate=true;
  if(geo.computeBoundingSphere) geo.computeBoundingSphere(); if(geo.boundingBox) geo.computeBoundingBox();
  var LX=-0.52, LY=0.70, LZ=-0.49, ln=Math.sqrt(LX*LX+LY*LY+LZ*LZ); LX/=ln; LY/=ln; LZ/=ln;
  for(var q=0;q<FACE.n*3;q++){ var a=N[q*3],b=N[q*3+1],c=N[q*3+2]; FACE.vsh[q]=Math.max(0,a*LX+b*LY+c*LZ); FACE.vnz[q]=c; }
  for(var f=0;f<FACE.n;f++){
    var o=f*9;
    var ux=P[o+3]-P[o], uy=P[o+4]-P[o+1], uz=P[o+5]-P[o+2], vx=P[o+6]-P[o], vy=P[o+7]-P[o+1], vz=P[o+8]-P[o+2];
    var nx2=uy*vz-uz*vy, ny2=uz*vx-ux*vz, nz2=ux*vy-uy*vx, nl=Math.sqrt(nx2*nx2+ny2*ny2+nz2*nz2)||1;
    nx2/=nl; ny2/=nl; nz2/=nl; if(ny2<0){ nx2=-nx2; ny2=-ny2; nz2=-nz2; }
    FACE.slope[f]=Math.acos(Math.max(-1,Math.min(1,ny2)));
    FACE.shade[f]=Math.max(0,nx2*LX+ny2*LY+nz2*LZ);
    FACE.nz[f]=nz2;
  }
}
/* a change of display factor: everything built once is redrawn or re-seated on the new ground; the app
   then rebuilds its overlays and moves the camera (setDisplayFactor in app.js) */
function rescaleWorld(){
  scaleGround(groundMesh.geometry);
  /* palGoing reads the model slope and palPaper its own hillshade (Stage 2E): neither changes. The landscape's palette
     follows the drawn slope: kept per drawn scale, and not made at all for the flat paper map, which never shows it */
  palNatural=DISPLAY.flat?null:(_palNat[displayScale()]||(_palNat[displayScale()]=makePalette("natural")));
  applyGround();
  apronMesh.geometry.dispose(); apronMesh.geometry=apronGeometry();
  SEATED.forEach(reseatInstances);
  SEATED_GEO.forEach(reseatGeometry);
  DRAPED.forEach(drape);
  waterMeshes.concat(iceRims).forEach(function(m){ if(m.userData.mere) m.position.y=mereLevel.apply(null,m.userData.mere)+(m.userData.mereLift||0); });
  rebuildContours();
  TERRAIN_LINES.forEach(function(tl){ if(tl._midXZ) tl._mid=[tl._midXZ[0],displayHeight(tl._midXZ[0],tl._midXZ[1])+4.2,tl._midXZ[1]]; });
}
function buildFaceFacts(geo){
  var p=geo.attributes.position.array;
  var nf=geo.attributes.position.count/3;
  FACE.n=nf;
  FACE.x=new Float32Array(nf); FACE.z=new Float32Array(nf); FACE.h=new Float32Array(nf);
  FACE.slope=new Float32Array(nf); FACE.shade=new Float32Array(nf);
  FACE.cover=new Uint8Array(nf); FACE.ao=new Float32Array(nf);
  FACE.crop=new Uint8Array(nf);       /* 0 stubble, 1 plough, 2 pasture, 3 winter sowing */
  FACE.nz=new Float32Array(nf);
  FACE.vsh=new Float32Array(nf*3); FACE.vnz=new Float32Array(nf*3);   /* per vertex */
  var LX=-0.52, LY=0.70, LZ=-0.49;
  var ln=Math.sqrt(LX*LX+LY*LY+LZ*LZ); LX/=ln; LY/=ln; LZ/=ln;
  var vn=geo.attributes.normal.array;
  for(var q=0;q<nf*3;q++){
    var qx=vn[q*3],qy=vn[q*3+1],qz=vn[q*3+2];
    FACE.vsh[q]=Math.max(0,qx*LX+qy*LY+qz*LZ);
    FACE.vnz[q]=qz;
  }
  for(var f=0;f<nf;f++){
    var o=f*9;
    var ax=p[o],ay=p[o+1],az=p[o+2], bx=p[o+3],by=p[o+4],bz=p[o+5], cx=p[o+6],cy=p[o+7],cz=p[o+8];
    var ux=bx-ax, uy=by-ay, uz=bz-az, vx=cx-ax, vy=cy-ay, vz=cz-az;
    var nx=uy*vz-uz*vy, ny=uz*vx-ux*vz, nz=ux*vy-uy*vx;
    var nl=Math.sqrt(nx*nx+ny*ny+nz*nz)||1; nx/=nl; ny/=nl; nz/=nl;
    if(ny<0){ nx=-nx; ny=-ny; nz=-nz; }
    var mx=(ax+bx+cx)/3, mz=(az+bz+cz)/3, mh=(ay+by+cy)/3;
    var ml=mh-1.2*regionalLevel(mx,mz);   /* local relief: what the land-cover thresholds were calibrated on */
    FACE.x[f]=mx; FACE.z[f]=mz; FACE.h[f]=mh;
    FACE.slope[f]=Math.acos(Math.max(-1,Math.min(1,ny)));
    FACE.shade[f]=Math.max(0,nx*LX+ny*LY+nz*LZ);
    FACE.nz[f]=nz;

    FACE.cover[f]=coverClass(mx,mz,ml);   /* per triangle: the going layer's classes (the ground itself draws per point, Stage 2F) */

    var curvAO=gridAt(gridCurv,mx,mz);
    FACE.ao[f]=Math.max(0.62,Math.min(1.10, 1 - curvAO*0.40));
    var ang=0.5+1.7*vnoise(mx/88+3.1,mz/88+7.7);
    var ca=Math.cos(ang), sa=Math.sin(ang);
    var u1=mx*ca+mz*sa, v1=-mx*sa+mz*ca;
    FACE.crop[f]=fieldStrip(Math.floor(u1/5.2),Math.floor(v1/30))[1];   /* the going layer's atlas cell */
  }
}
/* The field pattern: strips 5.2 world units wide in blocks 30 deep, turned with the lie of the land (the angle is read at
   each point; buildFaceFacts, and the vertex attribute "gnd" the ground shader interpolates). A block is one holding:
   stubble, plough, pasture or a winter sowing (crop 0-3); a strip has its own tint (t). Presentation, not data: the
   pattern is drawn, and read by nothing. The shader reads this table from a texture (groundTextures), and draws the baulks
   between strips and the headlands between blocks itself (atlasShader). */
function fieldStrip(strip,block){
  var id=hash2(strip,block*17+3);
  var bh=hash2(block*3+1,(strip>>2)*7+5);
  var crop = bh<0.42?0 : bh<0.68?1 : bh<0.88?2 : 3;
  var blockTint=[1.00,0.92,0.98,0.96][crop]*(0.975+0.05*hash2(block,strip>>2));
  var t=(0.955+0.09*id)*blockTint;
  if(id>0.84) t*=0.93;
  return [t,crop];
}

/* the base colour of each cover class (sRGB), in coverClass's order (field, meadow, marsh, water, wood, village, vineyard, track).
   Since Stage 4E (docs/STAGE4_SPEC.md section G.2; owner decision 79) the landscape's are this table's, the paper map's are its
   symbology's, TOKENS.sym.paperMap.ground (values unchanged); the landscape's other colours are LAND_COL's (below) */
var COVER_KEYS=["field","meadow","marsh","water","wood","village","vineyard","track"];
var COVER_COL={
  natural:[0x686659,0x5C5F50,0x4E5650,0x3A4850,0x33402E,0x6A665A,0x62634F,0x5F5A4A],
  paper:  COVER_KEYS.map(function(k){ return hexNumW(TOKENS.sym.paperMap.ground[k]); })
};
/* Stage 4E (section G.2; decision 79): the landscape's terrain, building, vegetation and contour colours, one table (values
   unchanged from the literals they replace); the water's are WATER_COL (buildWater), the light's and the sprites' are app.js's
   LIGHT, LIGHT_RIG and SPRITE_COL */
var LAND_COL={
  skyInit:[[0,0x18242E],[0.55,0x47575F],[0.83,0x959E9C],[1,0xC6B9A0]],
  road:{highway:0x9C9078, post:0x857A63, track:0x736A58, edge:0x554C3E},
  wallTex:{plaster:0xD9D2C2, plinth:0x8E8474, window:0x2E2A26, frame:0xB9B2A2, door:0x5A4C3E, doorway:0x3A3028,
    /* the canvas's translucent strokes (roadmap step 1, docs/FINAL_AUDIT.md T-6: until step 1 literals in wallTexture, text unchanged):
       the plaster's mottle (its rgb; the alpha varies per mark), the band above the plinth, the eave's shadow (top, bottom) */
    mottle:"120,110,95", band:"rgba(70,62,52,.35)", eave:["rgba(0,0,0,.42)","rgba(0,0,0,0)"]},
  roofTex:0xC8C0B0, chimney:0x4A3E36, spire:0x4E4136,
  roofCourse:"60,40,30",   /* the roof texture's tile courses, their rgb (the alpha alternates per course; until step 1 a literal in roofTexture) */
  walls:[0xC9BFAA,0xBDB39F,0xD1C7B2,0xB2A894],
  roofs:[0x8A4A38,0x7C4536,0x6E4C3E,0x93553F,0x5F4E42],
  bare:[0x45423C,0x4A4741,0x403E39,0x4E4A43,0x474540],
  conifer:[0x2C3A2C,0x27332A,0x30402F],
  scrub:[0x4E4A3E,0x574F42,0x46433A],
  contour:{fine:0x2A2418, index:0x17140C}, marsh:0x5D7C8C
};
function hexNumW(h){ return parseInt(String(h).replace("#",""),16); }
function hexCss(n){ return "#"+("000000"+n.toString(16)).slice(-6).toUpperCase(); }
/* Stage 2F: the ground is coloured per point by its shader (atlasShader), from the class at that point and the palette's
   colour for it (COVER_COL), the elevation tint, the field pattern, the damp and trodden ground, the hollows and the light.
   What the vertices still carry is the light, which comes from the drawn slope and so changes with the display factor:
   per vertex, the baked hillshade and how far the slope faces north (the frost). The paper map carries its own hillshade
   (paperShade) and no frost. Until 2F this function returned each triangle's finished colour. */
function makePalette(kind){
  var n=FACE.n*3, out=new Float32Array(n*3), paper=(kind==="paper");
  for(var q=0;q<n;q++){
    out[q*3]=paper?FACE.psh[q]:FACE.vsh[q];
    out[q*3+1]=paper?0:Math.max(0,-FACE.vnz[q]);
  }
  return out;
}
/* the going thresholds in true degrees: 9 and 17 degrees of model slope, divided back by GEOREF.EXAG */
var GOING_TRUE_DEG=[9,17].map(function(d){ return Math.atan(Math.tan(d*Math.PI/180)/GEOREF.EXAG)*180/Math.PI; });
function makeGoingPalette(){
  var n=FACE.n, out=new Float32Array(n*9), c=new THREE.Color(), GOING_HEX={};
  TOKENS.sym.going.forEach(function(g){ GOING_HEX[g.key]=parseInt(g.hex.slice(1),16); });
  for(var f=0;f<n;f++){
    var cov=FACE.cover[f], deg=FACE.gslope[f]*180/Math.PI, sh=FACE.gshade[f], hex;
    /* the classes and their colours are one table, TOKENS.sym.going, which the legend also reads. The slope is
       the MODEL slope (owner decision 32), so the layer is the same at every display factor: 9 and 17 degrees
       on the model's own vertical scale are GOING_TRUE_DEG in true degrees, provisional and unsourced */
    var gk = cov===3 ? "water" : cov===2 ? "marsh" : deg>17 ? "severe" : (deg>9||cov===4||cov===5) ? "hard" : cov===6 ? "vine" : "good";
    hex=GOING_HEX[gk];
    c.setHex(hex);
    var rel=(0.70+0.46*sh)*FACE.ao[f];
    c.r*=rel; c.g*=rel; c.b*=rel;
    var o=f*9;
    c.convertSRGBToLinear();
    var R=Math.max(0,Math.min(1,c.r)),
        G=Math.max(0,Math.min(1,c.g)),
        B=Math.max(0,Math.min(1,c.b));
    for(var k=0;k<3;k++){ out[o+k*3]=R; out[o+k*3+1]=G; out[o+k*3+2]=B; }
  }
  return out;
}
function applyGround(){
  if(!groundMesh) return;
  var U=groundMesh.material.userData.U, going=(groundPalette==="going");
  var base = groundPalette==="paper" ? palPaper
           : going ? (palGoing||(palGoing=makeGoingPalette()))
           : (palNatural||(palNatural=_palNat[displayScale()]=makePalette("natural")));
  var arr=groundMesh.geometry.attributes.color.array;
  var i,f,k;
  /* the going layer: each triangle's colour, its class from the model slope and FACE.cover (unchanged by 2F); the natural
     ground and the paper map: the light at each vertex, the shader colouring each point (atlasShader) */
  U.uMode.value = going ? 0 : groundPalette==="paper" ? 2 : 1;
  U.uPal.value = groundPal(groundPalette==="paper"?"paper":"natural");
  U.uVSOn.value = (vsMask&&!going) ? 1 : 0;
  if(vsMask&&!going) viewshedTexture();
  if(!vsMask||!going){
    for(i=0;i<arr.length;i++) arr[i]=base[i];
  } else {
    for(f=0;f<FACE.n;f++){
      var vis=sampleVS(FACE.x[f],FACE.z[f]);
      var o=f*9;
      for(k=0;k<3;k++){
        var q=o+k*3;
        var r=base[q], gg=base[q+1], b=base[q+2];
        if(vis){ r=r*0.86+0.20; gg=gg*0.88+0.17; b=b*0.70+0.03; }
        else   { r=r*0.40+0.035; gg=gg*0.42+0.055; b=b*0.52+0.10; }
        arr[q]=r; arr[q+1]=gg; arr[q+2]=b;
      }
    }
  }
  groundMesh.geometry.attributes.color.needsUpdate=true;
}
function setGround(name){
  groundPalette=name;
  /* the staff map is a sheet of paper, not a field */
  [groundMesh,apronMesh].forEach(function(o){ var m=o&&o.material;
    if(m){ m.map=(name==="paper")?null:m.userData.grain; m.needsUpdate=true; } });
  if(apronMesh) apronMesh.material.userData.U.uMode.value=0;
  applyGround();
}
/* 8 ground types in a 4x2 atlas. Each 256px cell holds a 240px periodic
   pattern with an 8px gutter of the same pattern, so linear filtering at a
   cell edge never reads the neighbouring cell. */
/* domain-warped patterns, shared by the colour atlas and the normal atlas */
var _pats=null;
function coverPatterns(){
  if(_pats) return _pats;
  var P=8;
  function n(u,v,s,o){ return pnoise((u*P*s+o)%(P*s+1e9),(v*P*s+o*0.7)%(P*s+1e9),P*s); }
  function warp(u,v,amt,o){ return [u+(n(u,v,2,o)-0.5)*amt, v+(n(u,v,2,o+17)-0.5)*amt]; }
  function base(u,v){ return 0.55*n(u,v,1,3.1)+0.30*n(u,v,2,7.7)+0.15*n(u,v,4,1.3); }
  _pats=[
    /* 0 open field: ploughed furrows drifting across a warped mottle */
    function(u,v){ var w=warp(u,v,0.05,3.3);
      var f=0.5+0.5*Math.sin((w[0]*11+w[1]*3.2)*Math.PI*2);
      return 0.84+(base(w[0],w[1])-0.5)*0.22+(f-0.5)*0.09; },
    /* 1 meadow: soft tussock, no furrows */
    function(u,v){ var w=warp(u,v,0.07,8.1); return 0.92+(base(w[0],w[1])-0.5)*0.20; },
    /* 2 marsh: wet blotches with reed dashes */
    function(u,v){ var w=warp(u,v,0.09,2.2), b=base(w[0],w[1]);
      var wet=b<0.42?-0.11:0;
      var reed=(Math.sin(u*Math.PI*2*23)>0.86&&Math.abs(Math.sin(v*Math.PI*2*9))<0.45)?0.10:0;
      return 0.86+(b-0.5)*0.26+wet+reed; },
    /* 3 water: faint ripple */
    function(u,v){ return 0.92+0.05*Math.sin((u*6+v*2)*Math.PI*2)+(base(u,v)-0.5)*0.10; },
    /* 4 wood: dense canopy, high contrast */
    function(u,v){ var w=warp(u,v,0.10,5.5);
      var b=0.5*n(w[0],w[1],3,5.5)+0.5*n(w[0],w[1],6,2.2); return 0.78+(b-0.5)*0.46; },
    /* 5 village: yards and gardens */
    function(u,v){ var w=warp(u,v,0.06,9.1);
      var b=0.6*n(w[0],w[1],2,9.1)+0.4*n(w[0],w[1],5,4.4); return 0.86+(b-0.5)*0.28; },
    /* 6 vineyard: rows at an angle */
    function(u,v){ var r=0.5+0.5*Math.sin((u*7-v*5)*Math.PI*2);
      return 0.86+(base(u,v)-0.5)*0.16+(r>0.5?0.045:-0.045); },
    /* 7 track: ruts along the way */
    function(u,v){ var rut=(Math.abs(v-0.36)<0.03||Math.abs(v-0.64)<0.03)?-0.11:0;
      return 0.88+(base(u,v)-0.5)*0.18+rut; },
    /* 8 plough: deep furrows */
    function(u,v){ var w=warp(u,v,0.03,4.4);
      var f=0.5+0.5*Math.sin((w[0]*14+w[1]*2.0)*Math.PI*2);
      return 0.84+(base(w[0],w[1])-0.5)*0.18+(f-0.5)*0.16; },
    /* 9 pasture: soft tussock */
    function(u,v){ var w=warp(u,v,0.07,6.1); return 0.92+(base(w[0],w[1])-0.5)*0.20; },
    /* 10 winter sowing: faint drill rows */
    function(u,v){ var r=0.5+0.5*Math.sin((u*22+v*1.5)*Math.PI*2);
      return 0.88+(base(u,v)-0.5)*0.16+(r-0.5)*0.06; },
    /* 11 trodden ground */
    function(u,v){ var w=warp(u,v,0.10,2.9); return 0.86+(base(w[0],w[1])-0.5)*0.24; }
  ];
  return _pats;
}
var _atlas=null, _atlasCanvas=null;
function coverAtlas(){
  if(_atlas) return _atlas;
  var CW=2048, CH=1536, R=512, IN=480, G=16;
  var c=document.createElement("canvas"); c.width=CW; c.height=CH;
  var x=c.getContext("2d"), img=x.createImageData(CW,CH), d=img.data;
  function cell(cx,cy,fn){
    for(var j=0;j<R;j++) for(var i=0;i<R;i++){
      var u=(i-G)/IN, v=(j-G)/IN;               /* 0..1 across the period */
      var g=fn(u,v);
      var val=Math.max(0,Math.min(255,g*255))|0;
      var o=((cy*R+j)*CW+(cx*R+i))*4;
      d[o]=val; d[o+1]=val; d[o+2]=val; d[o+3]=255;
    }
  }
  var pats=coverPatterns();
  for(var k=0;k<12;k++) cell(k%4,Math.floor(k/4),pats[k]);
  x.putImageData(img,0,0);
  _atlasCanvas=c;
  _atlas=new THREE.CanvasTexture(c);
  _atlas.wrapS=_atlas.wrapT=THREE.ClampToEdgeWrapping;
  _atlas.anisotropy=8;
  photoAtlas();
  return _atlas;
}
/* When the embedded photograph decodes, every land cell is repainted as the
   photograph tinted for its ground type, with the procedural pattern multiplied
   over it so furrows, ruts and vine rows survive. The texture object is the same,
   so the material simply updates. */
function photoAtlas(){
  if(typeof ASSETS==="undefined"||!ASSETS.grass) return;
  /* cell -> [source, r, g, b, pattern weight] */
  var CELL={0:["grass",0.94,0.92,0.86,0.55], 1:["grass",1.00,1.00,0.92,0.35], 2:["grass",0.78,0.82,0.78,0.60],
            4:["litter",0.72,0.70,0.64,0.50], 5:["mud",1.06,1.02,0.96,0.45], 6:["litter",0.96,0.94,0.86,0.60],
            7:["mud",0.98,0.94,0.88,0.65], 8:["litter",0.80,0.76,0.70,0.70], 9:["grass",0.96,1.02,0.88,0.40],
            10:["litter",0.86,0.86,0.76,0.55], 11:["mud",0.92,0.90,0.86,0.50]};
  var srcs={}, pending=3;
  ["grass","mud","litter"].forEach(function(n){
    var im=new Image();
    im.onload=function(){ srcs[n]=im; if(--pending===0) paint(); };
    im.src=ASSETS[n].diff;
  });
  function tileOf(img){
    var R=512, IN=480, G=16, t=document.createElement("canvas"); t.width=t.height=R;
    var tx=t.getContext("2d");
    for(var oy=-1;oy<=1;oy++) for(var ox=-1;ox<=1;ox++) tx.drawImage(img, G+ox*IN, G+oy*IN, IN, IN);
    return tx.getImageData(0,0,R,R).data;
  }
  function paint(){
    var c=_atlasCanvas, x=c.getContext("2d"), R=512;
    var pattern=x.getImageData(0,0,c.width,c.height), d=pattern.data;
    var tiles={grass:tileOf(srcs.grass), mud:tileOf(srcs.mud), litter:tileOf(srcs.litter)};
    Object.keys(CELL).forEach(function(kk){
      var k=+kk, t=CELL[kk], photo=tiles[t[0]];
      var cx=(k%4)*R, cy=Math.floor(k/4)*R;
      for(var j=0;j<R;j++) for(var i=0;i<R;i++){
        var o=((cy+j)*c.width+(cx+i))*4, p=(j*R+i)*4;
        var proc=d[o]/255, mix=1+(proc-0.86)*t[4]*2.2;
        d[o]  =Math.max(0,Math.min(255,photo[p]  *t[1]*mix));
        d[o+1]=Math.max(0,Math.min(255,photo[p+1]*t[2]*mix));
        d[o+2]=Math.max(0,Math.min(255,photo[p+2]*t[3]*mix));
      }
    });
    x.putImageData(pattern,0,0);
    _atlas.needsUpdate=true;
    if(typeof requestRender==="function") requestRender(2);
    photoNormal();
  }
}
function photoNormal(){
  if(!_nrmAtlas||!ASSETS.grass) return;
  var SRC={0:"grass",1:"grass",2:"grass",4:"litter",5:"mud",6:"litter",7:"mud",8:"litter",9:"grass",10:"litter",11:"mud"};
  var KEEP={0:0.55,6:0.5,7:0.45,8:0.4,10:0.5};      /* how much of the procedural furrow/rut normal survives */
  var srcs={}, pending=3;
  ["grass","mud","litter"].forEach(function(n){
    var im=new Image();
    im.onload=function(){ srcs[n]=im; if(--pending===0) paint(); };
    im.src=ASSETS[n].nor;
  });
  function paint(){
    var c=_nrmAtlas.image, x=c.getContext("2d"), R=512, IN=480, G=16;
    var base=x.getImageData(0,0,c.width,c.height), d=base.data;
    var tiles={};
    ["grass","mud","litter"].forEach(function(n){
      var t=document.createElement("canvas"); t.width=t.height=R; var tx=t.getContext("2d");
      for(var oy=-1;oy<=1;oy++) for(var ox=-1;ox<=1;ox++) tx.drawImage(srcs[n], G+ox*IN, G+oy*IN, IN, IN);
      tiles[n]=tx.getImageData(0,0,R,R).data;
    });
    Object.keys(SRC).forEach(function(kk){
      var k=+kk, ph=tiles[SRC[kk]], w=1-(KEEP[kk]||0.25);
      var cx=(k%4)*R, cy=Math.floor(k/4)*R;
      for(var j=0;j<R;j++) for(var i=0;i<R;i++){
        var o=((cy+j)*c.width+(cx+i))*4, p=(j*R+i)*4;
        d[o]  =Math.round(d[o]  *(1-w)+ph[p]  *w);
        d[o+1]=Math.round(d[o+1]*(1-w)+ph[p+1]*w);
      }
    });
    x.putImageData(base,0,0);
    _nrmAtlas.needsUpdate=true;
    if(typeof requestRender==="function") requestRender(2);
  }
}
/* the same eight patterns, differentiated into a tangent-space normal map so
   the ground catches the low winter light instead of reading as tinted paper */
var _nrmAtlas=null;
function coverNormalAtlas(){
  if(_nrmAtlas) return _nrmAtlas;
  var CW=2048, CH=1536, R=512, IN=480, G=16;
  var c=document.createElement("canvas"); c.width=CW; c.height=CH;
  var x=c.getContext("2d"), img=x.createImageData(CW,CH), d=img.data;
  var pats=coverPatterns(), STR=[2.6,1.5,2.2,0.8,3.2,2.4,2.0,2.2,3.0,1.4,1.8,2.4];
  for(var k=0;k<12;k++){
    var cx=k%4, cy=Math.floor(k/4), fn=pats[k], s=STR[k];
    for(var j=0;j<R;j++) for(var i=0;i<R;i++){
      var u=(i-G)/IN, v=(j-G)/IN, e=1/IN;
      var hL=fn(u-e,v), hR=fn(u+e,v), hD=fn(u,v-e), hU=fn(u,v+e);
      var nx=-(hR-hL)*s, ny=-(hU-hD)*s, nz=1.0;
      var L=Math.sqrt(nx*nx+ny*ny+nz*nz); nx/=L; ny/=L; nz/=L;
      var o=((cy*R+j)*CW+(cx*R+i))*4;
      d[o]=(nx*0.5+0.5)*255|0; d[o+1]=(ny*0.5+0.5)*255|0; d[o+2]=(nz*0.5+0.5)*255|0; d[o+3]=255;
    }
  }
  x.putImageData(img,0,0);
  _nrmAtlas=new THREE.CanvasTexture(c);
  _nrmAtlas.wrapS=_nrmAtlas.wrapT=THREE.ClampToEdgeWrapping;
  _nrmAtlas.anisotropy=8;
  return _nrmAtlas;
}

/* ---- the ground shader (Stage 2F; decision 28) ----
   The standard material, with the ground's own colour: each drawn point is classified by coverClass's rule (the same tests,
   in the same order, on the same rasters: gClass below), then coloured as the palette colours that class (the colour of
   the class in COVER_COL, the elevation tint, the field pattern, the damp and trodden ground, the hollows' occlusion, the
   frost and the hillshade: makePalette before 2F). Since Stage 4B the landscape carries no baked hillshade (every point is
   coloured as the flat ground, 0.994): it is lit by the computed sun, its altitude corrected to the display factor (app.js
   applyLight), and a baked light from the north-west was a second light that contradicted it (docs/STAGE4_SPEC.md A.5; until
   4B it was kept narrow, 0.70-1.12, Stage 0's temporary correction). The paper map is not sun-lit and keeps its full
   cartographic hillshade (0.66-1.12). The map
   and the normal map sample the atlas cell of that class. uMode:
   0 the going layer (each triangle's colour and cell, as before 2F), 1 the natural ground, 2 the paper map. The pond radii
   below are coverClass's own; the self-test renders the classes (uDebug) and checks them against drawnCover and coverClass.
   The atlas is sampled with the gradients of the continuous texture coordinate, so neither a cell's wrap nor a class edge
   draws a seam of the atlas's smallest mip. */
var GROUND_VERT_HEAD="\nattribute float cover;\nvarying float vCover;\nattribute vec4 gnd;\nvarying vec4 vGnd;\nvarying vec2 vWxz;";
var GROUND_FRAG_HEAD=[
  "varying float vCover; varying vec4 vGnd; varying vec2 vWxz;",
  "uniform sampler2D uCovA; uniform sampler2D uCovB; uniform sampler2D uMl; uniform sampler2D uField; uniform sampler2D uVS;",
  "uniform vec4 uCovG; uniform vec2 uCovN; uniform vec4 uMlG; uniform vec2 uMlN; uniform vec4 uVSG; uniform vec2 uVSN; uniform vec4 uFieldG;",
  "uniform vec4 uPondS; uniform vec4 uPondM; uniform vec3 uPal[8]; uniform float uMode; uniform float uVSOn; uniform float uDebug;",
  /* COVER_ML, four nodes along x to a texel (uMlT its size in texels): nodes i0 to i0+3 of row j, and coverMlAt */
  "uniform vec2 uMlT;",
  "vec4 gMlRow(float i0,float j){ float I=floor(i0/4.0), c=i0-4.0*I; vec2 r=(vec2(I,j)+0.5)/uMlT;",
  "  vec4 a=texture2D(uMl,r), b=texture2D(uMl,r+vec2(1.0/uMlT.x,0.0)); return c<0.5?a:c<1.5?vec4(a.yzw,b.x):c<2.5?vec4(a.zw,b.xy):vec4(a.w,b.xyz); }",
  "vec4 gCR(float t){ float t2=t*t, t3=t2*t; return 0.5*vec4(-t3+2.0*t2-t,3.0*t3-5.0*t2+2.0,-3.0*t3+4.0*t2+t,t3-t2); }",
  "float gMl(vec2 p){ vec2 f=(p-uMlG.xy)/uMlG.zw, i=clamp(floor(f),vec2(1.0),uMlN-3.0); vec4 wx=gCR(clamp(f.x-i.x,0.0,1.0)), wz=gCR(clamp(f.y-i.y,0.0,1.0));",
  "  return wz.x*dot(wx,gMlRow(i.x-1.0,i.y-1.0))+wz.y*dot(wx,gMlRow(i.x-1.0,i.y))+wz.z*dot(wx,gMlRow(i.x-1.0,i.y+1.0))+wz.w*dot(wx,gMlRow(i.x-1.0,i.y+2.0)); }",
  /* covAt: bilinear between the four raster nodes around the point, clamped at the edge */
  "vec4 gBil(sampler2D t,vec2 n,vec4 g,vec2 p){ vec2 f=(p-g.xy)/g.zw, i=clamp(floor(f),vec2(0.0),n-2.0), u=clamp(f-i,0.0,1.0), c=(i+0.5)/n, d=1.0/n;",
  "  return mix(mix(texture2D(t,c),texture2D(t,c+vec2(d.x,0.0)),u.x),mix(texture2D(t,c+vec2(0.0,d.y)),texture2D(t,c+d),u.x),u.y); }",
  "float gPond(vec4 P,vec2 p){ return 1.0-smoothstep(0.55,1.08,length((p-P.xy)/P.zw)); }",
  /* coverClass: A = water, marsh, wood, village; B = road, vineyard; ml the local relief */
  "float gClass(vec2 p,float ml,vec4 A,vec4 B){",
  "  if(gPond(uPondS,p)>0.5||gPond(uPondM,p)>0.5||(A.x>0.55&&ml< -2.6)) return 3.0;",
  "  if(A.y>0.45&&ml<0.4) return 2.0;",
  "  if(A.w>0.55) return 5.0;",
  "  if(A.z>0.5) return 4.0;",
  "  if(B.x>0.6) return 7.0;",
  "  if(B.y>0.55) return 6.0;",
  "  if(ml< -1.2||A.x>0.35) return 1.0;",
  "  return 0.0; }",
  "vec3 gPalOf(float c){ return c<0.5?uPal[0]:c<1.5?uPal[1]:c<2.5?uPal[2]:c<3.5?uPal[3]:c<4.5?uPal[4]:c<5.5?uPal[5]:c<6.5?uPal[6]:uPal[7]; }",
  "vec3 gLin(vec3 c){ return mix(c*0.0773993808,pow(max(c*0.9478672986+0.0521327014,vec3(0.0)),vec3(2.4)),step(vec3(0.04045),c)); }"
].join("\n");
var GROUND_FRAG_ATLAS=[
  "#ifdef USE_UV",
  "vec4 gAtlas(sampler2D t,vec2 uv){",
  "#if __VERSION__ >= 300",
  "  vec2 k=vec2(0.234375,0.3125); return textureGrad(t,uv,dFdx(vUv)*k,dFdy(vUv)*k);",
  "#else",
  "  return texture2D(t,uv);",
  "#endif",
  "}",
  "#endif"
].join("\n");
var GROUND_FRAG_MAIN=[
  "float gCls=vCover, gCrop=0.0; vec3 gCol=vec3(1.0);",
  "if(uMode>0.5){",
  "  vec4 A=gBil(uCovA,uCovN,uCovG,vWxz), B=gBil(uCovB,uCovN,uCovG,vWxz);",
  "  gCls=gClass(vWxz,gMl(vWxz),A,B);",
  /* the field pattern (fieldStrip): the strip's tint and the block's crop; the baulks and headlands drawn here, averaged where
     they are finer than a pixel */
  "  float su=vGnd.z/5.2, sv=vGnd.w/30.0;",
  "  vec2 sb=clamp(floor(vec2(su,sv))+uFieldG.xy,vec2(0.0),uFieldG.zw-1.0);",
  "  vec4 F=texture2D(uField,(sb+0.5)/uFieldG.zw);",
  "  float t=F.x, curv=vGnd.y; gCrop=F.y;",
  "  t*=mix(abs(fract(su)-0.5)>0.46?0.965:1.0,1.0-0.08*0.035,smoothstep(0.02,0.08,fwidth(su)));",
  "  t*=mix(abs(fract(sv)-0.5)>0.475?0.90:1.0,1.0-0.05*0.10,smoothstep(0.02,0.08,fwidth(sv)));",
  "  t*=1.0-clamp(curv*0.10,-0.05,0.06);",
  "  t*=1.0-min(0.35,A.x)*0.30;",
  "  if(A.w>0.15&&A.w<0.55) t*=1.04;",
  "  float ao=clamp(1.0-curv*0.40,0.62,1.10), e=vGnd.x, paper=step(1.5,uMode);",
  "  vec3 bc=gPalOf(gCls);",
  "  bc*=paper>0.5?vec3(0.90+0.16*e,0.92+0.10*e,0.98-0.20*e):vec3(0.90+0.14*e,0.90+0.14*e,0.92+0.12*e);",
  "  if(gCls!=3.0&&gCls!=4.0){ bc*=t;",
  "    if(gCls==0.0) bc*=gCrop==1.0?vec3(1.025,0.99,0.97):gCrop==2.0?vec3(0.98,1.015,0.985):gCrop==3.0?vec3(0.99,1.01,0.995):vec3(1.0); }",
  "  float hollow=max(0.0,0.94-ao)*2.4, sh=vColor.r;",
  "  if(paper<0.5&&gCls!=3.0){ float frost=min(0.30,vColor.g*0.26+hollow*0.22+(gCls==1.0?0.08:0.0)+(gCls==2.0?0.06:0.0));",
  "    if(frost>0.01) bc+=(vec3(0.70,0.73,0.78)-bc)*frost; }",
  "  float shL=paper>0.5?sh:0.70;",   /* Stage 4B: the landscape carries no baked hillshade, every point the flat ground's (0.70) */
  "  bc*=(paper>0.5?(0.66+0.46*shL):(0.70+0.42*shL))*ao;",
  "  if(paper<0.5){ float wc=(shL-0.55)*0.07; bc.r*=1.0+wc; bc.b*=1.0-wc; }",
  "  gCol=clamp(gLin(bc),0.0,1.0);",
  "  if(uVSOn>0.5){ vec2 q=floor((vWxz-uVSG.xy)/uVSG.zw+0.5); float vis=0.0;",   /* sampleVS: the nearest node of the analysis grid */
  "    if(q.x>=0.0&&q.y>=0.0&&q.x<uVSN.x&&q.y<uVSN.y) vis=texture2D(uVS,(q+0.5)/uVSN).x;",
  "    gCol=vis>0.75?gCol*vec3(0.86,0.88,0.70)+vec3(0.20,0.17,0.03):vis>0.25?gCol*vec3(0.60,0.64,0.70)+vec3(0.14,0.15,0.17):gCol*vec3(0.40,0.42,0.52)+vec3(0.035,0.055,0.10); }",   /* Stage 5E: in sight, in sight under the fog, out of sight */
  "}",
  "float gCell=uMode>0.5?(gCls==0.0?(gCrop==1.0?8.0:gCrop==2.0?9.0:gCrop==3.0?10.0:0.0):gCls):vCover;",
  "float ci=mod(gCell,4.0), cj=floor(gCell/4.0);",
  "#ifdef USE_UV",
  "vec2 tuv=vec2(fract(vUv.x)*0.234375+0.0078125+ci*0.25, fract(vUv.y)*0.3125+0.0104167+cj*0.3333333);",
  "#endif",
  "vec4 diffuseColor = vec4( diffuse, opacity );"
].join("\n");
/* the data the shader reads, made once: the six cover rasters (as covAt reads them), the local relief (COVER_ML), the
   field-strip table, and the viewshed (refreshed when one is drawn) */
var _gTex=null;
function groundTextures(){
  if(_gTex) return _gTex;
  function tex(d,w,h,type){ var t=new THREE.DataTexture(d,w,h,THREE.RGBAFormat,type);
    t.magFilter=t.minFilter=THREE.NearestFilter; t.generateMipmaps=false; t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping; t.needsUpdate=true; return t; }
  var n=COV_NX*COV_NZ, A=new Float32Array(n*4), B=new Float32Array(n*4), k;
  for(k=0;k<n;k++){ A[k*4]=covWater[k]; A[k*4+1]=covMarsh[k]; A[k*4+2]=covWood[k]; A[k*4+3]=covVill[k]; B[k*4]=covRoad[k]; B[k*4+1]=covVine[k]; }
  var M=COVER_ML, MT=Math.ceil(M.nx/4), ml=new Float32Array(MT*M.nz*4);
  for(var j=0;j<M.nz;j++) for(var i=0;i<M.nx;i++) ml[(j*MT)*4+i]=M.a[j*M.nx+i];   /* texel (i/4, j), channel i%4 */
  var FX=128, FZ=32, fd=new Float32Array(FX*FZ*4);
  for(var b=0;b<FZ;b++) for(var s=0;s<FX;s++){ var fs=fieldStrip(s-64,b-16); k=(b*FX+s)*4; fd[k]=fs[0]; fd[k+1]=fs[1]; }
  _gTex={a:tex(A,COV_NX,COV_NZ,THREE.FloatType), b:tex(B,COV_NX,COV_NZ,THREE.FloatType), ml:tex(ml,MT,M.nz,THREE.FloatType),
    field:tex(fd,FX,FZ,THREE.FloatType), vs:tex(new Uint8Array(G_NX*G_NZ*4),G_NX,G_NZ,THREE.UnsignedByteType)};
  return _gTex;
}
function viewshedTexture(){
  var t=groundTextures().vs, d=t.image.data;
  for(var i=0;i<vsMask.length;i++) d[i*4]=vsMask[i]===2?128:(vsMask[i]?255:0);   /* Stage 5E: 2, in sight but under the valley fog's top */
  t.needsUpdate=true;
}
var _gPal={};
function groundPal(kind){ return _gPal[kind]||(_gPal[kind]=COVER_COL[kind].map(function(h){ var c=new THREE.Color(h); return new THREE.Vector3(c.r,c.g,c.b); })); }
function groundUniforms(){
  var T=groundTextures(), M=COVER_ML;
  return {uCovA:{value:T.a}, uCovB:{value:T.b}, uCovN:{value:new THREE.Vector2(COV_NX,COV_NZ)}, uCovG:{value:new THREE.Vector4(COV_X0,COV_Z0,COV_DX,COV_DZ)},
    uMl:{value:T.ml}, uMlN:{value:new THREE.Vector2(M.nx,M.nz)}, uMlT:{value:new THREE.Vector2(Math.ceil(M.nx/4),M.nz)}, uMlG:{value:new THREE.Vector4(M.x0,M.z0,M.step,M.step)},
    uField:{value:T.field}, uFieldG:{value:new THREE.Vector4(64,16,128,32)},
    uVS:{value:T.vs}, uVSN:{value:new THREE.Vector2(G_NX,G_NZ)}, uVSG:{value:new THREE.Vector4(G_X0,G_Z0,G_DX,G_DZ)},
    uPondS:{value:new THREE.Vector4(SATS[0],SATS[1],28,10.5)}, uPondM:{value:new THREE.Vector4(MENI[0],MENI[1],23,9)},
    uPal:{value:groundPal("natural")}, uMode:{value:1}, uVSOn:{value:0}, uDebug:{value:0}};
}
function atlasShader(mat){
  var U=groundUniforms(); mat.userData.U=U;
  mat.onBeforeCompile=function(sh){
    Object.keys(U).forEach(function(k){ sh.uniforms[k]=U[k]; });
    if(typeof atmoUniforms==="function") atmoUniforms(sh);   /* Stage 4C: the atmosphere's uniforms (app.js) */
    sh.vertexShader=sh.vertexShader
      .replace("#include <common>","#include <common>"+GROUND_VERT_HEAD)
      .replace("#include <uv_vertex>","#include <uv_vertex>\nvCover=cover; vGnd=gnd; vWxz=(modelMatrix*vec4(position,1.0)).xz;");
    sh.fragmentShader=sh.fragmentShader
      .replace("#include <common>","#include <common>\n"+GROUND_FRAG_HEAD)
      .replace("void main() {",GROUND_FRAG_ATLAS+"\nvoid main() {")
      .replace("vec4 diffuseColor = vec4( diffuse, opacity );",GROUND_FRAG_MAIN)
      .replace("#include <map_fragment>",
        "#ifdef USE_MAP\n"+
        "  vec4 texelColor=gAtlas(map,tuv);\n"+
        "  texelColor=mapTexelToLinear(texelColor);\n"+
        "  diffuseColor*=texelColor;\n"+
        "#endif")
      .replace("#include <color_fragment>",
        "#if defined( USE_COLOR )\n  diffuseColor.rgb*=(uMode>0.5?gCol:vColor);\n#endif")
      .replace("#include <normal_fragment_maps>",
        "#ifdef USE_NORMALMAP\n"+
        "  vec3 mapN=gAtlas(normalMap,tuv).xyz*2.0-1.0;\n"+
        "  mapN.xy*=normalScale;\n"+
        "  normal=perturbNormal2Arb(-vViewPosition,normal,mapN,faceDirection);\n"+
        "#endif")
      .replace("#include <dithering_fragment>","#include <dithering_fragment>\n  if(uDebug>0.5) gl_FragColor=vec4(gCls/255.0,gCrop/255.0,uMode/255.0,1.0);");
  };
  return mat;
}
var _grain=null;
function grainTexture(){
  if(_grain) return _grain;
  var N=256, c=document.createElement("canvas"); c.width=c.height=N;
  var x=c.getContext("2d"), img=x.createImageData(N,N), d=img.data;
  for(var j=0;j<N;j++) for(var i=0;i<N;i++){
    /* three octaves of value noise, tileable because vnoise is sampled on a
       period that divides the tile; then a faint furrow direction */
    var u=i/N*8, v=j/N*8;
    var n = 0.55*vnoise(u+0.5,v+0.5) + 0.30*vnoise(u*2.3+11.1,v*2.3+7.3) + 0.15*vnoise(u*5.1+3.7,v*5.1+9.9);
    var furrow = 0.5+0.5*Math.sin((i*0.9+j*0.35)*0.42);
    var g = 0.86 + (n-0.5)*0.30 + (furrow-0.5)*0.06;
    var val=Math.max(0,Math.min(255,g*255))|0;
    var o=(j*N+i)*4; d[o]=val; d[o+1]=val; d[o+2]=val; d[o+3]=255;
  }
  x.putImageData(img,0,0);
  _grain=new THREE.CanvasTexture(c);
  _grain.wrapS=_grain.wrapT=THREE.RepeatWrapping;
  _grain.anisotropy=4;
  return _grain;
}

function sampleVS(x,z){
  var i=Math.round((x-G_X0)/G_DX), j=Math.round((z-G_Z0)/G_DZ);
  if(i<0||j<0||i>=G_NX||j>=G_NZ) return 0;
  return vsMask[j*G_NX+i];
}
/* What an observer can see of the ground. The eye height is real metres through
   the vertical scale (default: a mounted observer, 3 m); the relief's uniform
   exaggeration does not change what is visible, but an eye height typed in world
   units would put the observer on a tower. */
function computeViewshed(mapPt,eyeM){
  var w=W(mapPt[0],mapPt[1]);
  var oi=Math.round((w[0]-G_X0)/G_DX), oj=Math.round((w[1]-G_Z0)/G_DZ);
  oi=Math.max(0,Math.min(G_NX-1,oi)); oj=Math.max(0,Math.min(G_NZ-1,oj));
  var oh=gridH[oj*G_NX+oi]+GEOREF.unitsFromM(eyeM||3.0);
  vsMask=new Uint8Array(G_NX*G_NZ);
  vsOrigin=mapPt.slice();
  var RAYS=900, MAXR=170;
  for(var r=0;r<RAYS;r++){
    var a=r/RAYS*Math.PI*2, dx=Math.cos(a), dz=Math.sin(a), best=-1e9;
    for(var s=1;s<MAXR;s++){
      var x=w[0]+dx*s*1.2, z=w[1]+dz*s*1.2;
      var i=Math.round((x-G_X0)/G_DX), j=Math.round((z-G_Z0)/G_DZ);
      if(i<0||j<0||i>=G_NX||j>=G_NZ) break;
      var k=j*G_NX+i, ang=(gridH[k]-oh)/(s*1.2);
      if(ang>=best-0.0006){ vsMask[k]=1; if(ang>best) best=ang; }
    }
  }
  vsMask[oj*G_NX+oi]=1;
  applyGround();
}
function clearViewshed(){ vsMask=null; vsOrigin=null; applyGround(); }

/* Roads and streams (Stage 2F; decision 28): flat ribbons draped on the drawn ground, as the 2C overlays are. Every vertex
   stands at its lift above groundY, the ground mesh itself, not the analytic height between its vertices; the vertices are
   RIBBON_STEP (0.5 world units, 31 m) apart along the line and across it, so the ribbon follows the 81 m triangles instead of
   cutting through them (at 1 unit, 30 edge midpoints still dipped under the ground at 10.33x; at 0.5, none: drape-2f.js); and
   when the ground is redrawn (a display factor, the flat paper map) each vertex is draped again (drape). */
var DRAPED=[], RIBBON_STEP=0.5;
function ribbon(scene,pts,width,yoff,mat,store,kind){
  pts=resample(pts,RIBBON_STEP);
  var m=Math.max(1,Math.ceil(width/RIBBON_STEP)), v=[], idx=[];
  for(var i=0;i<pts.length;i++){
    var a=pts[Math.max(0,i-1)], b=pts[Math.min(pts.length-1,i+1)];
    var dx=b[0]-a[0], dz=b[1]-a[1], L=Math.sqrt(dx*dx+dz*dz)||1;
    var nx=-dz/L*width/2, nz=dx/L*width/2;
    for(var k=0;k<=m;k++){ var f=-1+2*k/m, x=pts[i][0]+nx*f, z=pts[i][1]+nz*f; v.push(x,groundY(x,z)+yoff,z); }
  }
  for(var j=0;j<pts.length-1;j++) for(k=0;k<m;k++){ var o=j*(m+1)+k, p=o+m+1; idx.push(o,p,o+1, o+1,p,p+1); }
  var g=new THREE.BufferGeometry();
  g.setAttribute("position",new THREE.Float32BufferAttribute(v,3));
  g.setIndex(idx); g.computeVertexNormals();
  var mesh=new THREE.Mesh(g,mat); scene.add(mesh); if(store) store.push(mesh);
  mesh.userData.drape={lift:yoff,kind:kind};
  DRAPED.push(mesh);
  return mesh;
}
function drape(o){
  var P=o.geometry.attributes.position, lift=o.userData.drape.lift;
  for(var i=0;i<P.count;i++) P.setY(i,groundY(P.getX(i),P.getZ(i))+lift);
  P.needsUpdate=true; o.geometry.computeVertexNormals(); if(o.geometry.computeBoundingSphere) o.geometry.computeBoundingSphere();
}
function resample(pts,step){
  var out=[pts[0]];
  for(var i=0;i<pts.length-1;i++){
    var a=pts[i], b=pts[i+1], L=dist2(a[0],a[1],b[0],b[1]);
    var n=Math.max(1,Math.round(L/step));
    for(var k=1;k<=n;k++) out.push([a[0]+(b[0]-a[0])*k/n, a[1]+(b[1]-a[1])*k/n]);
  }
  return out;
}
/* a mere's level: its legacy level carried with the land, never above the lowest drawn ground on its own
   edge - so no edge of the water can hang above the ground (the Litava now runs through Satschan). On the
   display ground: the legacy level scales with the land, the 0.05 margin is drawn units */
function mereLevel(cc,rx,rz,base){
  if(DISPLAY.flat) return 0.12;   /* the flat paper map (Stage 2E): the water lies on the sheet, under the roads and streams */
  var lo=1e9; for(var a=0;a<96;a++){ var t=a/96*Math.PI*2; lo=Math.min(lo,displayHeight(cc[0]+Math.cos(t)*rx,cc[1]+Math.sin(t)*rz)); }
  return Math.min(displayY(base+1.2*regionalLevel(cc[0],cc[1])), lo-0.05);
}
/* Stage 4E (docs/STAGE4_SPEC.md sections F.1 and G.2; owner decision 79): the water's palette, one table. The meres are ice (the
   data: the Satschan mere "frozen on 2 December"; the phase-8 texts' guns firing "down on the ice"): smoother than before, taking
   the computed sun's sheen and the sky (the environment map), with a lighter rim where the shore ice meets the bank. Their
   outlines stay schematic (decision 27); no cracks, holes, snow or figures in the water. The banks and streams are unchanged. */
var WATER_COL={ice:0x4E5C66, iceRim:0x75838B, bank:0x4E5A4C, stream:0x587A8E};
var ICE={roughness:0.32, env:0.42, rim:0.86, rimLift:0.02};
function buildWater(scene){
  var iceMat=new THREE.MeshStandardMaterial({color:lin(WATER_COL.ice),roughness:ICE.roughness,metalness:0.0,envMapIntensity:ICE.env,
    transparent:true,opacity:0.96});
  var rimMat=new THREE.MeshStandardMaterial({color:lin(WATER_COL.iceRim),roughness:ICE.roughness+0.2,metalness:0.0,envMapIntensity:ICE.env*0.6,
    transparent:true,opacity:0.96});
  function mere(cc,rx,rz,base){
    var m=new THREE.Mesh(new THREE.CircleGeometry(1,48),iceMat);
    m.rotation.x=-Math.PI/2; m.position.set(cc[0],mereLevel(cc,rx,rz,base),cc[1]); m.scale.set(rx,rz,1);
    m.userData.mere=[cc,rx,rz,base];
    scene.add(m); waterMeshes.push(m);
    var r=new THREE.Mesh(new THREE.RingGeometry(ICE.rim,1,48,1),rimMat);   /* the shore ice: its outer edge the mere's own */
    r.rotation.x=-Math.PI/2; r.position.set(cc[0],mereLevel(cc,rx,rz,base)+ICE.rimLift,cc[1]); r.scale.set(rx,rz,1);
    r.userData.mere=[cc,rx,rz,base]; r.userData.mereLift=ICE.rimLift;
    scene.add(r); iceRims.push(r);   /* not water: the landscape's ice surface only (hidden on the paper map) */
  }
  mere(SATS,28,10.5,-3.85);
  mere(MENI,23,9,-3.95);
  var bankMat=matte({color:WATER_COL.bank,roughness:0.96});
  var streamMat=new THREE.MeshStandardMaterial({color:lin(WATER_COL.stream),roughness:0.48,metalness:0.0,envMapIntensity:0.18});
  ribbon(scene,GOLDBACH,4.6,0.16,bankMat,waterMeshes,"bank");
  ribbon(scene,GOLDBACH,2.8,0.26,streamMat,waterMeshes,"stream");
  ribbon(scene,LITAVA,5.0,0.16,bankMat,waterMeshes,"bank");
  ribbon(scene,LITAVA,3.2,0.26,streamMat,waterMeshes,"stream");
  BROOKS.forEach(function(b){
    ribbon(scene,b,2.4,0.16,bankMat,waterMeshes,"bank");
    ribbon(scene,b,1.4,0.26,streamMat,waterMeshes,"stream");
  });
}
function buildRoads(scene){
  var hi=matte({color:LAND_COL.road.highway,roughness:0.94});
  var po=matte({color:LAND_COL.road.post,roughness:0.94});
  var tr=matte({color:LAND_COL.road.track,roughness:0.95});
  var edge=matte({color:LAND_COL.road.edge,roughness:0.97});
  ROADS.forEach(function(r){
    var mat = r.cls==="highway"?hi : r.cls==="post"?po : tr;
    var pts=M2W(r.p);
    ribbon(scene, pts, r.w+1.1, 0.26, edge, roadMeshes, "road edge");
    ribbon(scene, pts, r.w, 0.34, mat, roadMeshes, "road");
  });
}
var _wallTex=null, _roofTex=null;
function wallTexture(){
  if(_wallTex) return _wallTex;
  var c=document.createElement("canvas"); c.width=256; c.height=128;
  var x=c.getContext("2d");
  var WC=LAND_COL.wallTex;
  x.fillStyle=hexCss(WC.plaster); x.fillRect(0,0,256,128);
  for(var i=0;i<900;i++){ x.fillStyle="rgba("+WC.mottle+","+(0.03+hash2(i,7)*0.05)+")";
    x.fillRect(hash2(i,1)*256,hash2(i,2)*128,2+hash2(i,3)*6,2+hash2(i,4)*4); }
  x.fillStyle=hexCss(WC.plinth); x.fillRect(0,104,256,24);
  x.fillStyle=WC.band; x.fillRect(0,100,256,6);
  x.fillStyle=hexCss(WC.window); x.fillRect(52,40,26,30); x.fillRect(178,40,26,30);
  x.fillStyle=hexCss(WC.frame); x.fillRect(64,40,2,30); x.fillRect(52,54,26,2); x.fillRect(190,40,2,30); x.fillRect(178,54,26,2);
  x.fillStyle=hexCss(WC.door); x.fillRect(114,58,26,46); x.fillStyle=hexCss(WC.doorway); x.fillRect(116,60,22,42);
  var g=x.createLinearGradient(0,0,0,18); g.addColorStop(0,WC.eave[0]); g.addColorStop(1,WC.eave[1]);
  x.fillStyle=g; x.fillRect(0,0,256,18);
  _wallTex=ctexS(c); return _wallTex;
}
function roofTexture(){
  if(_roofTex) return _roofTex;
  var c=document.createElement("canvas"); c.width=128; c.height=128;
  var x=c.getContext("2d");
  x.fillStyle=hexCss(LAND_COL.roofTex); x.fillRect(0,0,128,128);
  for(var r=0;r<16;r++){
    x.fillStyle="rgba("+LAND_COL.roofCourse+","+(0.18+(r%2)*0.06)+")"; x.fillRect(0,r*8,128,2);
    for(var k=0;k<16;k++){ x.fillStyle="rgba(255,255,255,"+(hash2(r,k)*0.08)+")"; x.fillRect(k*8+(r%2)*4,r*8+2,7,5); }
  }
  _roofTex=ctexS(c); return _roofTex;
}
function buildSettlements(scene){
  var seed=1805;
  function rnd(){ seed=(seed*1664525+1013904223)%4294967296; return seed/4294967296; }
  var wallGeo=new THREE.BoxGeometry(1,1,1);
  /* a gable roof: a triangular prism the width of the house, ridge along its length */
  var roofGeo=(function(){
    /* a gable, extruded along its ridge: winding, normals and UVs all come out right */
    var sh=new THREE.Shape(); sh.moveTo(-0.5,0); sh.lineTo(0.5,0); sh.lineTo(0,0.5); sh.lineTo(-0.5,0);
    var g=new THREE.ExtrudeGeometry(sh,{depth:1,bevelEnabled:false});
    g.translate(0,0,-0.5);
    g.computeVertexNormals();
    return g;
  })();
  var chimneyGeo=new THREE.BoxGeometry(0.22,0.5,0.22);
  function laneDir(cc){
    /* the lane runs with the nearest road through the village, else with the valley */
    var best=1e9, dir=0.3;
    ROADS.forEach(function(r){
      var pts=M2W(r.p);
      for(var k=0;k<pts.length-1;k++){
        var ax=pts[k][0],az=pts[k][1],bx=pts[k+1][0],bz=pts[k+1][1];
        var dd=segDist(cc[0],cc[1],ax,az,bx,bz);
        if(dd<best){ best=dd; dir=Math.atan2(bz-az,bx-ax); }
      }
    });
    return best<14 ? dir : 0.3+hash2(Math.floor(cc[0]),Math.floor(cc[1]))*3.1;
  }
  var spireGeo=new THREE.ConeGeometry(0.62,3.2,6);
  var wallMat=matte({color:0xFFFFFF,flatShading:true,map:wallTexture()});   /* colour comes from each instance */
  var roofMat=matte({color:0xFFFFFF,flatShading:true,map:roofTexture(),side:THREE.DoubleSide});
  var chimneyMat=matte({color:LAND_COL.chimney,flatShading:true});
  var spireMat=matte({color:LAND_COL.spire,flatShading:true});
  var houses=[],roofs=[],spires=[],chims=[];
  VILLAGES.forEach(function(v){
    var cc=W(v[1],v[2]);
    var lane=laneDir(cc), cl=Math.cos(lane), sl=Math.sin(lane);
    var R=2.4+v[3]*0.42;
    for(var i=0;i<v[3];i++){
      /* along the lane, close either side of it; a few outliers behind */
      var along=(rnd()*2-1)*R*1.15, off=(rnd()<0.75?1:-1)*(1.1+rnd()*1.3)*(rnd()<0.85?1:2.4);
      var x=cc[0]+along*cl-off*sl, z=cc[1]+along*sl+off*cl;
      var barn=rnd()<0.22;
      var w2=barn?(2.6+rnd()*1.6):(1.4+rnd()*1.0), d2=barn?(1.3+rnd()*0.5):(1.1+rnd()*0.7);
      var hh=barn?(1.0+rnd()*0.4):(1.1+rnd()*0.6), y=displayHeight(x,z);
      var rot=lane+(rnd()<0.5?0:Math.PI/2)+(rnd()-0.5)*0.22;
      houses.push([x,y+hh/2,z,w2,hh,d2,rot]);
      roofs.push([x,y+hh,z,w2*1.18,d2*1.16,rot,barn?0.80:1.05]);
      if(!barn && rnd()<0.6){
        var cr=Math.cos(rot), sr=Math.sin(rot), ox=(rnd()-0.5)*d2*0.5, oz=w2*0.22;
        chims.push([x+ox*cr-oz*sr, y+hh+0.52*(1.05*0.5)+0.18, z+ox*sr+oz*cr, rot]);
      }
    }
    if(CHURCHES.indexOf(v[0])>=0){
      var y2=displayHeight(cc[0],cc[1]);
      houses.push([cc[0],y2+1.0,cc[1],3.4,2.0,2.4,0.1]);          /* nave */
      houses.push([cc[0]-1.4,y2+2.1,cc[1],1.5,4.2,1.5,0.1]);      /* tower */
      spires.push([cc[0]-1.4,y2+5.6,cc[1]]);
    }
  });
  (function(){
    var cc=W(226,355), y=displayHeight(cc[0],cc[1]);   /* legacy offset from the village */
    /* Sokolnitz castle: three wings round a court, and a taller block at the corner */
    houses.push([cc[0],y+1.6,cc[1]-2.2,7.0,3.2,2.2,0.2]);  roofs.push([cc[0],y+3.2,cc[1]-2.2,7.3,2.6,0.2,1.2]);
    houses.push([cc[0]-2.6,y+1.5,cc[1]+0.4,2.0,3.0,4.6,0.2]); roofs.push([cc[0]-2.6,y+3.0,cc[1]+0.4,2.3,5.0,0.2,1.1]);
    houses.push([cc[0]+2.6,y+1.5,cc[1]+0.4,2.0,3.0,4.6,0.2]); roofs.push([cc[0]+2.6,y+3.0,cc[1]+0.4,2.3,5.0,0.2,1.1]);
    houses.push([cc[0]+3.0,y+2.4,cc[1]-2.4,2.4,4.8,2.4,0.2]); roofs.push([cc[0]+3.0,y+4.8,cc[1]-2.4,2.7,2.7,0.2,1.4]);
    for(var s=0;s<16;s++){
      var a=s/16*Math.PI*2, x=cc[0]+Math.cos(a)*7.0, z=cc[1]+Math.sin(a)*5.0;
      houses.push([x,displayHeight(x,z)+0.55,z,1.5,1.1,0.5,a]);
    }
  })();
  houseMesh=new THREE.InstancedMesh(wallGeo,wallMat,houses.length);
  roofMesh=new THREE.InstancedMesh(roofGeo,roofMat,roofs.length);
  var chimMesh=new THREE.InstancedMesh(chimneyGeo,chimneyMat,Math.max(1,chims.length));
  chimMesh.castShadow=true;
  var tmpC=new THREE.Color();
  spireMesh=new THREE.InstancedMesh(spireGeo,spireMat,Math.max(1,spires.length));
  houseMesh.castShadow=roofMesh.castShadow=spireMesh.castShadow=true;
  houseMesh.receiveShadow=roofMesh.receiveShadow=true;
  var d=new THREE.Object3D();
  houses.forEach(function(h,i){
    d.position.set(h[0],h[1],h[2]); d.rotation.set(0,h[6],0); d.scale.set(h[3],h[4],h[5]);
    d.updateMatrix(); houseMesh.setMatrixAt(i,d.matrix);
    tmpC.setHex(LAND_COL.walls[(i*3)%4]).convertSRGBToLinear().multiplyScalar(0.86+0.20*((i*37)%11)/11);
    houseMesh.setColorAt(i,tmpC);
  });
  if(houseMesh.instanceColor) houseMesh.instanceColor.needsUpdate=true;
  roofs.forEach(function(r,i){
    d.position.set(r[0],r[1],r[2]); d.rotation.set(0,r[5],0); d.scale.set(r[3],r[6]||0.7,r[4]);
    d.updateMatrix(); roofMesh.setMatrixAt(i,d.matrix);
    var pick=(i*7)%5;
    tmpC.setHex(LAND_COL.roofs[pick]).convertSRGBToLinear().multiplyScalar(0.86+0.26*((i*13)%7)/7);
    roofMesh.setColorAt(i,tmpC);
  });
  if(roofMesh.instanceColor) roofMesh.instanceColor.needsUpdate=true;
  chims.forEach(function(ch,i){
    d.position.set(ch[0],ch[1],ch[2]); d.rotation.set(0,ch[3],0); d.scale.set(1,1,1);
    d.updateMatrix(); chimMesh.setMatrixAt(i,d.matrix);
  });
  scene.add(chimMesh);
  spires.forEach(function(s,i){
    d.position.set(s[0],s[1],s[2]); d.rotation.set(0,0.4,0); d.scale.set(1,1,1);
    d.updateMatrix(); spireMesh.setMatrixAt(i,d.matrix);
  });
  scene.add(houseMesh); scene.add(roofMesh); scene.add(spireMesh);
  chimneyMesh=chimMesh;
  [houseMesh,roofMesh,chimMesh,spireMesh].forEach(seatInstances);
}
function buildWoods(scene){
  var seed=77; function rnd(){ seed=(seed*1664525+1013904223)%4294967296; return seed/4294967296; }
  var broad=[],conif=[];
  /* Stage 2F (owner, on the 2E review): a wood's trees stand inside the wood as the model's land cover has it, where
     drawnCover is wood, so the landscape, the ground's cover and the paper map's woods agree. That cover is buildCover's
     unrotated ellipse, ending at about 0.89 of the wood's radii, less what a village, water or marsh takes from it (coverClass);
     before 2F the trees filled the ellipse turned by WOODS.rot, to its radii. The same number of trees per wood (WOODS.n). */
  WOODS.forEach(function(wd){
    var c=W(wd.c[0],wd.c[1]), guard=0;
    for(var i=0;i<wd.n;i++){
      var u=rnd()*2-1, v=rnd()*2-1, x=c[0]+u*wd.rx*0.5, z=c[1]+v*wd.ry*0.5;
      if(u*u+v*v>1||drawnCover(x,z)!==4){ if(++guard<wd.n*20){ i--; } continue; }
      var s=0.7+rnd()*0.65;
      (rnd()<Math.max(0.28,wd.conifer)?conif:broad).push([x,displayHeight(x,z),z,s,"wood"]);
    }
  });
  VILLAGES.forEach(function(v){
    if(v[3]<7) return;
    var cc=W(v[1],v[2]), R=2.6+v[3]*0.46;
    for(var i=0;i<Math.round(v[3]*1.1);i++){
      var a=rnd()*Math.PI*2, r=R*(1.05+rnd()*0.45);
      var x=cc[0]+Math.cos(a)*r, z=cc[1]+Math.sin(a)*r*0.75;
      broad.push([x,displayHeight(x,z),z,0.5+rnd()*0.3,"village"]);   /* a village's trees and orchards, round it: not a wood */
    }
  });
  var d=new THREE.Object3D();
  /* ---- silhouettes: a small kit, merged so each variant is one draw call.
     Deciduous crowns in December are bare wood: a dense mass of twig, grey-brown,
     darker than the field but never green. Conifers keep their green. ---- */
  var kit=treeKit();
  var tcol=new THREE.Color();
  var byVar=[[],[],[],[]], conVar=[[],[]];
  broad.forEach(function(t,i){ byVar[(i*7+Math.floor(t[0]*3))%4 & 3].push(t); });
  conif.forEach(function(t,i){ conVar[(i*5)%2].push(t); });
  treeMesh=new THREE.Group(); coniferMesh=new THREE.Group();
  var BARE=LAND_COL.bare;
  byVar.forEach(function(list,vi){
    var im=new THREE.InstancedMesh(kit.broad[vi],matte({color:0xFFFFFF,flatShading:true}),Math.max(1,list.length));
    im.castShadow=true; im.count=Math.max(1,list.length);
    list.forEach(function(t,k){
      d.position.set(t[0],t[1],t[2]); d.rotation.set(0,rnd()*6.28,0);
      d.scale.set(t[3],t[3]*(0.92+rnd()*0.22),t[3]); d.updateMatrix(); im.setMatrixAt(k,d.matrix);
      tcol.setHex(BARE[(k*7+vi)%5]).convertSRGBToLinear().multiplyScalar(0.84+0.30*((k*11)%9)/9);
      im.setColorAt(k,tcol);
    });
    if(im.instanceColor) im.instanceColor.needsUpdate=true;
    im.userData.kinds=list.map(function(t){ return t[4]; });
    if(list.length) treeMesh.add(im);
  });
  var EVER=LAND_COL.conifer;
  conVar.forEach(function(list,vi){
    var im=new THREE.InstancedMesh(kit.conifer[vi],matte({color:0xFFFFFF,flatShading:true}),Math.max(1,list.length));
    im.castShadow=true; im.count=Math.max(1,list.length);
    list.forEach(function(t,k){
      d.position.set(t[0],t[1],t[2]); d.rotation.set(0,rnd()*6.28,0);
      d.scale.set(t[3],t[3]*(0.9+rnd()*0.3),t[3]); d.updateMatrix(); im.setMatrixAt(k,d.matrix);
      tcol.setHex(EVER[(k*5+vi)%3]).convertSRGBToLinear().multiplyScalar(0.84+0.30*((k*13)%7)/7);
      im.setColorAt(k,tcol);
    });
    if(im.instanceColor) im.instanceColor.needsUpdate=true;
    im.userData.kinds=list.map(function(t){ return t[4]; });
    if(list.length) coniferMesh.add(im);
  });
  /* scrub: low thorn and hazel along the water and at the wood edges */
  var scrub=[];
  /* at the wood's edge, inside it (Stage 2F): in the outer band of its cover, 0.72 to 0.89 of the radii, where drawnCover is
     wood (before 2F: a ring just outside the turned ellipse, 1.02 to 1.24 of its radii) */
  WOODS.forEach(function(wd){
    var c=W(wd.c[0],wd.c[1]), want=Math.round(wd.n*0.35), got=0, guard=0;
    while(got<want&&guard++<want*40){
      var a=rnd()*6.28, r=0.72+rnd()*0.17, x=c[0]+Math.cos(a)*wd.rx*0.5*r, z=c[1]+Math.sin(a)*wd.ry*0.5*r;
      if(drawnCover(x,z)!==4) continue;
      scrub.push([x,displayHeight(x,z),z,0.5+rnd()*0.5,"edge"]); got++;
    }
  });
  [GOLDBACH,LITAVA].forEach(function(line){
    for(var q=0;q<160;q++){
      var t=rnd(), k=Math.floor(t*(line.length-1)), p0=line[k], p1=line[Math.min(line.length-1,k+1)];
      var f=t*(line.length-1)-k, x=p0[0]+(p1[0]-p0[0])*f, z=p0[1]+(p1[1]-p0[1])*f;
      var side=rnd()<0.5?-1:1, off=2.2+rnd()*2.6;
      var dx=p1[0]-p0[0], dz=p1[1]-p0[1], L=Math.hypot(dx,dz)||1;
      x+=(-dz/L)*side*off; z+=(dx/L)*side*off;
      if(covAt(covVill,x,z)>0.3) continue;
      scrub.push([x,displayHeight(x,z),z,0.45+rnd()*0.45,"stream"]);   /* bank scrub along the streams: not a wood */
    }
  });
  scrubMesh=new THREE.InstancedMesh(kit.scrub,matte({color:0xFFFFFF,flatShading:true}),Math.max(1,scrub.length));
  scrubMesh.castShadow=false; scrubMesh.receiveShadow=true;
  scrub.forEach(function(t,k){
    d.position.set(t[0],t[1],t[2]); d.rotation.set(0,rnd()*6.28,0);
    d.scale.set(t[3],t[3]*0.8,t[3]); d.updateMatrix(); scrubMesh.setMatrixAt(k,d.matrix);
    tcol.setHex(LAND_COL.scrub[k%3]).convertSRGBToLinear().multiplyScalar(0.85+0.3*((k*7)%5)/5);
    scrubMesh.setColorAt(k,tcol);
  });
  if(scrubMesh.instanceColor) scrubMesh.instanceColor.needsUpdate=true;
  scrubMesh.userData.kinds=scrub.map(function(t){ return t[4]; });
  scene.add(treeMesh); scene.add(coniferMesh); scene.add(scrubMesh);
  treeMesh.children.concat(coniferMesh.children,[scrubMesh]).forEach(seatInstances);
}

/* geometry kit: low-poly crowns merged with their trunks; four bare deciduous
   habits, two conifers, one bush */
function mergeParts(parts){
  var P=[],N=[];
  parts.forEach(function(pt){
    var g=pt.geo.index ? pt.geo.toNonIndexed() : pt.geo;   /* icosahedra arrive non-indexed */
    g.computeVertexNormals();
    var pa=g.attributes.position.array, na=g.attributes.normal.array;
    var sx=pt.s[0],sy=pt.s[1],sz=pt.s[2], ox=pt.p[0],oy=pt.p[1],oz=pt.p[2];
    for(var i=0;i<pa.length;i+=3){
      P.push(pa[i]*sx+ox, pa[i+1]*sy+oy, pa[i+2]*sz+oz);
      var nx=na[i]/sx, ny=na[i+1]/sy, nz=na[i+2]/sz, L=Math.sqrt(nx*nx+ny*ny+nz*nz)||1;
      N.push(nx/L,ny/L,nz/L);
    }
  });
  var out=new THREE.BufferGeometry();
  out.setAttribute("position",new THREE.Float32BufferAttribute(P,3));
  out.setAttribute("normal",new THREE.Float32BufferAttribute(N,3));
  return out;
}
var _kit=null;
function treeKit(){
  if(_kit) return _kit;
  /* a crown is an icosahedron pushed in and out along its normals, so no two silhouettes match */
  function crown(seed){
    var g=new THREE.IcosahedronGeometry(1,2), pa=g.attributes.position.array;
    for(var i=0;i<pa.length;i+=3){
      var k=0.78+0.44*hash2(Math.round(pa[i]*13+seed),Math.round(pa[i+1]*7+pa[i+2]*11));
      pa[i]*=k; pa[i+1]*=k*0.92; pa[i+2]*=k;
    }
    g.computeVertexNormals(); return g;
  }
  var sph=crown(1), sph2=crown(2), sph3=crown(3), trunk=new THREE.CylinderGeometry(0.11,0.16,1,5), cone=new THREE.ConeGeometry(1,1,7);
  var T=function(h){ return {geo:trunk,p:[0,h/2,0],s:[1,h,1]}; };
  _kit={
    broad:[
      /* round-headed oak */
      mergeParts([T(1.1),{geo:sph,p:[0,2.0,0],s:[1.25,1.05,1.25]},{geo:sph2,p:[0.55,2.35,0.2],s:[0.75,0.7,0.75]},{geo:sph3,p:[-0.5,2.25,-0.3],s:[0.7,0.62,0.7]}]),
      /* tall lime, two storeys of crown */
      mergeParts([T(1.5),{geo:sph2,p:[0,2.4,0],s:[0.95,1.1,0.95]},{geo:sph3,p:[0.1,3.4,0.1],s:[0.7,0.85,0.7]}]),
      /* squat, wide-spreading */
      mergeParts([T(0.8),{geo:sph3,p:[0,1.6,0],s:[1.55,0.85,1.45]},{geo:sph,p:[0.8,1.7,0],s:[0.7,0.55,0.7]},{geo:sph2,p:[-0.75,1.65,0.3],s:[0.65,0.5,0.65]}]),
      /* poplar-like, narrow and tall */
      mergeParts([T(1.2),{geo:sph2,p:[0,2.4,0],s:[0.62,1.5,0.62]},{geo:sph3,p:[0,3.5,0],s:[0.45,0.8,0.45]}])
    ],
    conifer:[
      mergeParts([T(0.6),{geo:cone,p:[0,2.3,0],s:[0.95,3.4,0.95]},{geo:cone,p:[0,1.35,0],s:[1.25,1.4,1.25]}]),
      mergeParts([T(0.9),{geo:cone,p:[0,3.0,0],s:[0.8,4.2,0.8]}])
    ],
    scrub: mergeParts([{geo:sph,p:[0,0.5,0],s:[1,0.6,0.9]},{geo:sph,p:[0.6,0.4,0.2],s:[0.6,0.45,0.55]}])
  };
  return _kit;
}

var CONTOUR_INTERVAL=1.5, CONTOUR_INDEX=4;
/* the ground continues beyond the field, coarsely, until the fog takes it */
function buildApron(scene){
  /* its own material (Stage 2F): the ground's shader, always in its per-triangle mode (uMode 0), its colours its own */
  var mat=atlasShader(matte({vertexColors:true,flatShading:false,map:coverAtlas(),normalMap:coverNormalAtlas(),envMapIntensity:0.28,
    normalScale:new THREE.Vector2(0.45,0.45),roughness:0.94,metalness:0.0}));
  mat.userData.grain=mat.map; mat.userData.U.uMode.value=0;
  var m=new THREE.Mesh(apronGeometry(),mat);
  m.position.y=-0.35;            /* tucked just under the field's own edge */
  m.receiveShadow=true;
  scene.add(m);
  return m;
}
function apronGeometry(){
  var X0=-860, X1=860, Z0=-760, Z1=760, NX=86, NZ=76;
  var P=[],N=[],U=[],C=[],COV=[],GN=[], s=displayScale();
  var base=lin(COVER_COL.natural[0]);
  function v(x,z){ return [x,displayHeight(x,z),z]; }
  function push(a,b,c){
    var ux=b[0]-a[0],uy=b[1]-a[1],uz=b[2]-a[2], vx=c[0]-a[0],vy=c[1]-a[1],vz=c[2]-a[2];
    var nx=uy*vz-uz*vy, ny=uz*vx-ux*vz, nz=ux*vy-uy*vx, L=Math.sqrt(nx*nx+ny*ny+nz*nz)||1;
    nx/=L; ny/=L; nz/=L;
    if(ny<0){ nx=-nx; ny=-ny; nz=-nz; }
    var sh=Math.max(0,(nx*-0.52+ny*0.70+nz*-0.49)/1.0);
    /* elevation from the model height: the drawn height over the drawn scale; on the flat paper map (Stage 2E) the drawn
       scale is 0, and the model height is read directly (a colour, not a drawn position) */
    var mid=s?(a[1]+b[1]+c[1])/3/s:height((a[0]+b[0]+c[0])/3,(a[2]+b[2]+c[2])/3);
    var k=0.50+0.62*(s?0.70:sh), e=Math.max(0,Math.min(1,(GEOREF.elevM(mid)-200)/123));   /* Stage 4B: no baked hillshade on the landscape's apron */
    var r=base.r*k*(0.88+0.24*e), g=base.g*k*(0.90+0.20*e), bb=base.b*k*(0.94+0.06*e);
    [a,b,c].forEach(function(q){
      P.push(q[0],q[1],q[2]); N.push(nx,ny,nz); U.push(q[0]/11,q[2]/11); C.push(r,g,bb); COV.push(0); GN.push(0,0,0,0);
    });
  }
  var dx=(X1-X0)/NX, dz=(Z1-Z0)/NZ;
  for(var j=0;j<NZ;j++) for(var i=0;i<NX;i++){
    var x0=X0+i*dx, x1=x0+dx, z0=Z0+j*dz, z1=z0+dz;
    var cx=(x0+x1)/2, cz=(z0+z1)/2;
    if(Math.abs(cx)<168 && Math.abs(cz)<123) continue;     /* the field itself */
    var a=v(x0,z0), b=v(x1,z0), c=v(x1,z1), d=v(x0,z1);
    push(a,c,b); push(a,d,c);          /* counter-clockwise seen from above */
  }
  var g=new THREE.BufferGeometry();
  g.setAttribute("position",new THREE.Float32BufferAttribute(P,3));
  g.setAttribute("normal",new THREE.Float32BufferAttribute(N,3));
  g.setAttribute("uv",new THREE.Float32BufferAttribute(U,2));
  g.setAttribute("color",new THREE.Float32BufferAttribute(C,3));
  g.setAttribute("cover",new THREE.Float32BufferAttribute(COV,1));
  g.setAttribute("gnd",new THREE.Float32BufferAttribute(GN,4));
  return g;
}
function buildContours(scene){
  contourGroup=new THREE.Group();
  var fine=[], index=[], n=0;
  var hmin=1e9, hmax=-1e9; for(var gi=0;gi<gridH.length;gi++){ if(gridH[gi]<hmin) hmin=gridH[gi]; if(gridH[gi]>hmax) hmax=gridH[gi]; }
  var k0=Math.floor((hmin+5)/CONTOUR_INTERVAL), k1=Math.ceil((hmax+5)/CONTOUR_INTERVAL);
  for(var kk=k0; kk<=k1; kk++){   /* the legacy lattice (-5 + k x interval) and its index lines, over the real range */
    var L=-5+kk*CONTOUR_INTERVAL;
    marchLevel(L, (((kk%CONTOUR_INDEX)+CONTOUR_INDEX)%CONTOUR_INDEX===0)?index:fine);
    n++;
  }
  function mk(arr,col,op){
    if(!arr.length) return null;
    var g=new THREE.BufferGeometry();
    g.setAttribute("position",new THREE.Float32BufferAttribute(arr,3));
    var l=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:col,transparent:true,opacity:op}));
    contourGroup.add(l);
    return l;
  }
  contourGroup.userData.fine=mk(fine,LAND_COL.contour.fine,0.30);
  contourGroup.userData.index=mk(index,LAND_COL.contour.index,0.50);
  scene.add(contourGroup);
}
/* the contour lattice is model data (gridH, CONTOUR_INTERVAL); only its drawn height follows the factor */
function rebuildContours(){
  var fine=[], index=[];
  var hmin=1e9, hmax=-1e9; for(var gi=0;gi<gridH.length;gi++){ if(gridH[gi]<hmin) hmin=gridH[gi]; if(gridH[gi]>hmax) hmax=gridH[gi]; }
  var k0=Math.floor((hmin+5)/CONTOUR_INTERVAL), k1=Math.ceil((hmax+5)/CONTOUR_INTERVAL);
  for(var kk=k0; kk<=k1; kk++) marchLevel(-5+kk*CONTOUR_INTERVAL, (((kk%CONTOUR_INDEX)+CONTOUR_INDEX)%CONTOUR_INDEX===0)?index:fine);
  [["fine",fine],["index",index]].forEach(function(q){ var l=contourGroup.userData[q[0]]; if(!l) return;
    l.geometry.dispose(); var g=new THREE.BufferGeometry(); g.setAttribute("position",new THREE.Float32BufferAttribute(q[1],3)); l.geometry=g; });
}
function marchLevel(L,out){
  var lift=0.30;
  for(var j=0;j<G_NZ-1;j++){
    var z0=G_Z0+j*G_DZ, z1=z0+G_DZ;
    for(var i=0;i<G_NX-1;i++){
      var x0=G_X0+i*G_DX, x1=x0+G_DX;
      var k=j*G_NX+i;
      var a=gridH[k], b=gridH[k+1], c=gridH[k+1+G_NX], d=gridH[k+G_NX];
      var idx=(a>L?1:0)|(b>L?2:0)|(c>L?4:0)|(d>L?8:0);
      if(idx===0||idx===15) continue;
      var t;
      t=(L-a)/((b-a)||1e-6); var ABx=x0+(x1-x0)*t, ABz=z0;
      t=(L-b)/((c-b)||1e-6); var BCx=x1,            BCz=z0+(z1-z0)*t;
      t=(L-d)/((c-d)||1e-6); var CDx=x0+(x1-x0)*t, CDz=z1;
      t=(L-a)/((d-a)||1e-6); var DAx=x0,            DAz=z0+(z1-z0)*t;
      var y=displayY(L)+lift;
      switch(idx){
        case 1: case 14: out.push(DAx,y,DAz, ABx,y,ABz); break;
        case 2: case 13: out.push(ABx,y,ABz, BCx,y,BCz); break;
        case 3: case 12: out.push(DAx,y,DAz, BCx,y,BCz); break;
        case 4: case 11: out.push(BCx,y,BCz, CDx,y,CDz); break;
        case 6: case 9:  out.push(ABx,y,ABz, CDx,y,CDz); break;
        case 7: case 8:  out.push(DAx,y,DAz, CDx,y,CDz); break;
        case 5:  out.push(DAx,y,DAz, ABx,y,ABz, BCx,y,BCz, CDx,y,CDz); break;
        case 10: out.push(ABx,y,ABz, BCx,y,BCz, CDx,y,CDz, DAx,y,DAz); break;
      }
    }
  }
}
function setContourStyle(paper){
  var f=contourGroup.userData.fine, x=contourGroup.userData.index;
  var PM=TOKENS.sym.paperMap;
  if(f){ f.material.color.copy(lin(paper?hexNumW(PM.contour.fine):LAND_COL.contour.fine)); f.material.opacity=paper?0.42:0.30; }
  if(x){ x.material.color.copy(lin(paper?hexNumW(PM.contour.index):LAND_COL.contour.index)); x.material.opacity=paper?0.62:0.50; }
  if(marshGroup&&marshGroup.userData.mat){
    marshGroup.userData.mat.color.copy(lin(paper?hexNumW(PM.marsh):LAND_COL.marsh));
    marshGroup.userData.mat.opacity=paper?0.7:0.55;
  }
  if(analysisGroup) analysisGroup.children.forEach(function(o){ if(o.userData.t) o.material.color.setHex(analysisCol(o.userData.t,paper)); });
}
function buildMarshSymbols(scene){
  marshGroup=new THREE.Group();
  var pts=[], seed=404;
  function rnd(){ seed=(seed*1664525+1013904223)%4294967296; return seed/4294967296; }
  for(var j=0;j<COV_NZ;j+=2) for(var i=0;i<COV_NX;i+=2){
    var x=COV_X0+i*COV_DX+(rnd()-0.5)*2.4, z=COV_Z0+j*COV_DZ+(rnd()-0.5)*2.4;
    if(covAt(covMarsh,x,z)<0.55) continue;
    if(rnd()>0.42) continue;
    var h=displayHeight(x,z), hl=localHeight(x,z);   /* where: the model's local relief; drawn on the display ground */
    if(hl>0.6||hl<-4.4) continue;
    for(var r=0;r<3;r++){
      var len=1.5-r*0.42, zz=z+(r-1)*0.62;
      pts.push(x-len/2,h+0.34,zz, x+len/2,h+0.34,zz);
    }
  }
  var g=new THREE.BufferGeometry();
  g.setAttribute("position",new THREE.Float32BufferAttribute(pts,3));
  var m=new THREE.LineBasicMaterial({color:lin(LAND_COL.marsh),transparent:true,opacity:0.55});
  var ls=new THREE.LineSegments(g,m); marshGroup.add(ls); SEATED_GEO.push(seatGeometry(ls));
  marshGroup.userData.mat=m;
  scene.add(marshGroup);
}
/* line colours come from TOKENS.sym.analysis (with paper variants); the patterns are terrain notation */
var ANALYSIS_STYLE={
  ridge: {dash:false, tick:true},
  scarp: {dash:false, tick:true},
  valley:{dash:true,  tick:false},
  defile:{dash:false, tick:false},
  dead:  {dash:true,  tick:false}
};
function analysisCol(t,paper){ var a=TOKENS.sym.analysis[t]; return parseInt((paper?a.paper:a.line).slice(1),16); }
function buildAnalysis(scene){
  analysisGroup=new THREE.Group();
  analysisGroup.visible=false;
  TERRAIN_LINES.forEach(function(tl){
    var st=ANALYSIS_STYLE[tl.t];
    var pts=resample(M2W(tl.p),2.2);
    var verts=[];
    for(var i=0;i<pts.length-1;i++){
      if(st.dash && i%2===1) continue;
      verts.push(pts[i][0],displayHeight(pts[i][0],pts[i][1])+1.5,pts[i][1],
                 pts[i+1][0],displayHeight(pts[i+1][0],pts[i+1][1])+1.5,pts[i+1][1]);
    }
    var g=new THREE.BufferGeometry();
    g.setAttribute("position",new THREE.Float32BufferAttribute(verts,3));
    var lm=new THREE.LineSegments(g,new THREE.LineBasicMaterial({color:analysisCol(tl.t,false),transparent:true,opacity:0.92}));
    lm.userData.t=tl.t; analysisGroup.add(lm); SEATED_GEO.push(seatGeometry(lm));
    if(st.tick){
      var tv=[];
      for(var k=1;k<pts.length-1;k+=2){
        var a=pts[k-1], b=pts[k+1];
        var dx=b[0]-a[0], dz=b[1]-a[1], L=Math.sqrt(dx*dx+dz*dz)||1;
        var nx=-dz/L, nz=dx/L;
        var h1=displayHeight(pts[k][0]+nx*2,pts[k][1]+nz*2), h2=displayHeight(pts[k][0]-nx*2,pts[k][1]-nz*2);
        var s=(h1<h2)?1:-1;
        var ex=pts[k][0]+nx*2.4*s, ez=pts[k][1]+nz*2.4*s;
        tv.push(pts[k][0],displayHeight(pts[k][0],pts[k][1])+1.5,pts[k][1], ex,displayHeight(ex,ez)+1.1,ez);
      }
      var g2=new THREE.BufferGeometry();
      g2.setAttribute("position",new THREE.Float32BufferAttribute(tv,3));
      var tm=new THREE.LineSegments(g2,new THREE.LineBasicMaterial({color:analysisCol(tl.t,false),transparent:true,opacity:0.6}));
      tm.userData.t=tl.t; analysisGroup.add(tm); SEATED_GEO.push(seatGeometry(tm));
    }
    var mid=pts[Math.floor(pts.length/2)];
    tl._midXZ=[mid[0],mid[1]]; tl._mid=[mid[0],displayHeight(mid[0],mid[1])+4.2,mid[1]];
  });
  scene.add(analysisGroup);
}
/* ---------------- the paper map's own symbology (Stage 2E; docs/STAGE2_SPEC.md section G.2; decisions 25 and 31) ----------------
   Drawn only on the flat paper map: the villages as flat footprints and the woods as map symbology (a tint, tree marks
   and an outline), in place of roofs, houses and 3D trees. Each is traced from the model's own land cover, so it marks the
   ground the model calls village or wood: the outline is the level of the cover field built from VILLAGES and WOODS
   (buildCover) at coverClass's threshold (village 0.55, wood 0.5), traced on a grid four times finer than the cover
   raster, which covAt interpolates. A footprint is the village's extent in the model, as schematic as the cover it comes
   from (VILLAGES gives a place and a size, not a plan); where coverClass gives water or marsh priority, the footprint is
   still drawn (owner, on the 2E review: the footprints stay the model's cover disc). Since 2F the woods are traced from the
   drawn wood class itself (drawnCover), where the ground draws wood and the trees of the landscape stand: the cover field
   less what a village, water or marsh takes from it. Nothing here is drawn on the landscape, and nothing is seated: the
   paper map's ground is flat (y 0). */
var paperGroup=null, PAPER_SYM={wood:{level:0.5,lift:0.05}, village:{level:0.55,lift:0.08}, markPx:26};
/* closed outlines of {field > level}, as rings of world [x, z]; the raster is padded with 0 so every ring closes */
/* Stage 2F: with inside(x, z) given, the outline of the region where it holds (a class of drawnCover): the grid marks each
   node in or out, and each crossing is found on its edge by bisection, to 1/256 of the step (about 0.1 m) */
function coverRings(field,level,inside){
  var st=4, nx=(COV_NX-1)*st+3, nz=(COV_NZ-1)*st+3, dx=COV_DX/st, dz=COV_DZ/st, x0=COV_X0-dx, z0=COV_Z0-dz;
  var v=new Float32Array(nx*nz), i, j;
  for(j=1;j<nz-1;j++) for(i=1;i<nx-1;i++){ var gx=x0+i*dx, gz=z0+j*dz; v[j*nx+i]=inside?(inside(gx,gz)?1:0):covAt(field,gx,gz); }
  if(inside) level=0.5;
  var pts={}, nb={};
  function P(a,b){ var k=a<b?a+"_"+b:b+"_"+a; if(!pts[k]){ var t=(level-v[a])/((v[b]-v[a])||1e-9), ia=a%nx, ja=(a-ia)/nx, ib=b%nx, jb=(b-ib)/nx;
    if(inside){ var lo=0, hi=1, ina=v[a]>level; for(var it=0;it<8;it++){ var m=(lo+hi)/2;
      if(inside(x0+(ia+(ib-ia)*m)*dx, z0+(ja+(jb-ja)*m)*dz)===ina) lo=m; else hi=m; } t=(lo+hi)/2; }
    pts[k]=[x0+(ia+(ib-ia)*t)*dx, z0+(ja+(jb-ja)*t)*dz]; } return k; }
  function S(p,q){ (nb[p]=nb[p]||[]).push(q); (nb[q]=nb[q]||[]).push(p); }
  /* corners a (i,j), b (i+1,j), c (i+1,j+1), d (i,j+1); edges 0 ab, 1 bc, 2 cd, 3 da; each case joins two edges */
  var T={1:[[3,0]],2:[[0,1]],3:[[3,1]],4:[[1,2]],6:[[0,2]],7:[[2,3]],8:[[2,3]],9:[[0,2]],11:[[1,2]],12:[[1,3]],13:[[0,1]],14:[[3,0]]};
  for(j=0;j<nz-1;j++) for(i=0;i<nx-1;i++){
    var a=j*nx+i, b=a+1, c=a+nx+1, d=a+nx, m=(v[a]>level?1:0)|(v[b]>level?2:0)|(v[c]>level?4:0)|(v[d]>level?8:0);
    if(m===0||m===15) continue;
    var E=[[a,b],[b,c],[d,c],[a,d]], L=T[m];
    if(m===5||m===10){ var mid=inside?inside(x0+(i+0.5)*dx,z0+(j+0.5)*dz):(v[a]+v[b]+v[c]+v[d])/4>level;   /* a saddle: the centre decides which corners join */
      L=(m===5)===mid?[[0,1],[2,3]]:[[3,0],[1,2]]; }
    L.forEach(function(q){ S(P(E[q[0]][0],E[q[0]][1]),P(E[q[1]][0],E[q[1]][1])); });
  }
  var seen={}, rings=[];
  Object.keys(nb).forEach(function(k0){ if(seen[k0]) return;
    var ring=[], prev=null, k=k0;
    while(k&&!seen[k]){ seen[k]=1; ring.push(pts[k]); var n=nb[k], nx2=(n[0]!==prev)?n[0]:n[1]; prev=k; k=nx2; }
    if(ring.length>=3) rings.push(ring); });
  return rings;
}
function ringInside(p,R){ var c=false; for(var i=0,j=R.length-1;i<R.length;j=i++){ var a=R[i], b=R[j];
  if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0]) c=!c; } return c; }
/* rings to one flat mesh (outer rings with the rings nested in them as holes), and their outline */
function ringMeshes(rings,lift,fill,edge,uvOf){
  var depth=rings.map(function(r,i){ var n=0; rings.forEach(function(o,j){ if(i!==j&&ringInside(r[0],o)) n++; }); return n; });
  var P=[], U=[], I=[], Lp=[];
  rings.forEach(function(r,i){ if(depth[i]%2) return;
    var holes=rings.filter(function(o,j){ return depth[j]===depth[i]+1&&ringInside(o[0],r); });
    var V=[r].concat(holes), base=P.length/3;
    var tri=THREE.ShapeUtils.triangulateShape(r.map(function(q){ return new THREE.Vector2(q[0],q[1]); }),
      holes.map(function(h){ return h.map(function(q){ return new THREE.Vector2(q[0],q[1]); }); }));
    V.forEach(function(R){ R.forEach(function(q){ P.push(q[0],lift,q[1]); if(uvOf){ var uv=uvOf(q); U.push(uv[0],uv[1]); } }); });
    tri.forEach(function(t){ I.push(base+t[0],base+t[1],base+t[2]); });
  });
  rings.forEach(function(r){ for(var k=0;k<r.length;k++){ var a=r[k], b=r[(k+1)%r.length]; Lp.push(a[0],lift+0.01,a[1],b[0],lift+0.01,b[1]); } });
  var g=new THREE.BufferGeometry(); g.setAttribute("position",new THREE.Float32BufferAttribute(P,3)); if(uvOf) g.setAttribute("uv",new THREE.Float32BufferAttribute(U,2)); g.setIndex(I);
  var lg=new THREE.BufferGeometry(); lg.setAttribute("position",new THREE.Float32BufferAttribute(Lp,3));
  var m=new THREE.Mesh(g,fill), l=new THREE.LineSegments(lg,edge);
  m.renderOrder=l.renderOrder=2;
  return [m,l];
}
/* the tree mark: a map symbol on a transparent tile, upright on the north-up paper map */
function woodMarkTexture(){
  var cv=document.createElement("canvas"); cv.width=cv.height=64;
  var x=cv.getContext("2d"), col=TOKENS.sym.paperMap.wood.mark;
  x.strokeStyle=col; x.fillStyle=col; x.lineWidth=2.2; x.lineCap="round";
  [[18,22],[50,54]].forEach(function(c){ x.beginPath(); x.arc(c[0],c[1]-3,6.5,0,Math.PI*2); x.stroke();
    x.beginPath(); x.moveTo(c[0],c[1]+3.5); x.lineTo(c[0],c[1]+9); x.stroke(); });
  var t=ctexS(cv); t.wrapS=t.wrapT=THREE.RepeatWrapping; return t;
}
function buildPaperSymbols(scene){
  paperGroup=new THREE.Group(); paperGroup.visible=false;
  var T=TOKENS.sym.paperMap, N=[GEOREF.NORTH[0],GEOREF.NORTH[1]], E=[-N[1],N[0]];
  function basic(hex,op){ return new THREE.MeshBasicMaterial({color:lin(parseInt(hex.slice(1),16)),transparent:op<1,opacity:op,depthWrite:false,fog:false,side:THREE.DoubleSide}); }
  function line(hex,op){ return new THREE.LineBasicMaterial({color:lin(parseInt(hex.slice(1),16)),transparent:op<1,opacity:op}); }
  /* woods: the tint, then the tree marks (texture coordinates east and north, so the marks stand upright), then the outline */
  var wr=coverRings(null,0,function(x,z){ return covAt(covWood,x,z)>PAPER_SYM.wood.level&&drawnCover(x,z)===4; });   /* Stage 2F: the drawn wood class */
  var wt=ringMeshes(wr,PAPER_SYM.wood.lift,basic(T.wood.fill,0.72),line(T.wood.edge,0.9));
  var marks=new THREE.MeshBasicMaterial({map:woodMarkTexture(),transparent:true,opacity:0.85,depthWrite:false,fog:false,side:THREE.DoubleSide});
  var wm=ringMeshes(wr,PAPER_SYM.wood.lift+0.005,marks,line(T.wood.edge,0),function(q){ return [q[0]*E[0]+q[1]*E[1],q[0]*N[0]+q[1]*N[1]]; });
  wm[0].userData.marks=true;
  /* villages: the footprint and its edge */
  var vr=coverRings(covVill,PAPER_SYM.village.level);
  var vt=ringMeshes(vr,PAPER_SYM.village.lift,basic(T.village.fill,0.88),line(T.village.edge,0.95));
  wt[0].userData.cover=4; vt[0].userData.cover=5;   /* the class each fill draws (the self-test's cover render, Stage 2F) */
  [wt[0],wm[0],wt[1],vt[0],vt[1]].forEach(function(o){ paperGroup.add(o); });
  paperGroup.userData={woods:wr.length, villages:vr.length, marks:wm[0], rings:{wood:wr,village:vr}};
  scene.add(paperGroup);
}
/* the tree marks keep one size on screen (PAPER_SYM.markPx px a tile) at every zoom: wpp is world units per pixel */
function paperMarkScale(wpp){ var m=paperGroup&&paperGroup.userData.marks; if(!m||!m.material.map) return;
  var k=1/(PAPER_SYM.markPx*wpp); if(Math.abs(m.material.map.repeat.x-k)>1e-6*k){ m.material.map.repeat.set(k,k); } }

/* Stage 4C: the mist sheets (Stage 0: twenty textured squares in the bottoms and one broad haze sheet, faded where the ground rose
   through them) are gone. The valley fog and the haze are drawn by every material's fog (app.js, ATMO), from the clock; the group
   stays, empty and hidden, so world.mist keeps its place. */
function buildMist(scene){
  mistGroup=new THREE.Group(); mistGroup.visible=false;
  scene.add(mistGroup);
}
