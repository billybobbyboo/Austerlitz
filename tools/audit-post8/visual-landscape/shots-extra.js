#!/usr/bin/env node
/* Final audit after Stage 8, area visual-landscape: the second shot list (after the probe, probe.js): the figures on the Satschan mere's ice in the
   ponds phase (probe.json: Dokhturov's column, Buxhowden's headquarters and Kienmayer's advance guard inside the disc 16:00-17:00, the ground
   up to 0.874 units under the ice), and the facing cases facings.js flagged nearest to contact, each read back in the page (after: the drawn
   yaw, the leg's heading, the rule's facing, the nearest enemy and its bearing, in degrees, the same convention as facings.js).
   usage: node shots-extra.js > shots-extra.json; node capture.js shots-extra.json <shots-dir> */
"use strict";
const S=[], V=[1600,900];
const after=id=>"var id='"+id+"', r=units[id], f=FORMATIONS[id], p=posNow(id), D=180/Math.PI; function ad(a,b){ var d=(a-b)%(2*Math.PI); if(d>Math.PI) d-=2*Math.PI; if(d<-Math.PI) d+=2*Math.PI; return +(d*D).toFixed(1); }"+
  " var near=null, nd=1e9; Object.keys(units).forEach(function(k){ var g=FORMATIONS[k]; if(!g||g.arm==='hq'||!units[k].block||(g.nation==='fr')===(f.nation==='fr')) return; var q=posNow(k); if(!q) return; var d=Math.hypot(q[0]-p[0],q[1]-p[1])*KM_PER_MAP; if(d<nd){ nd=d; near={id:k,q:q}; } });"+
  " var a=W(p[0],p[1]), b=near?W(near.q[0],near.q[1]):null, br=b?Math.atan2(b[0]-a[0],b[1]-a[1]):null, hd=headingAt(id,clock), mr=f.track?marchRate(id,clock):null;"+
  " return {id:id, yaw:+((r.yaw||0)*D).toFixed(1), heading:hd===null?null:+(hd*D).toFixed(1), rule:enemyFacing(id)===null?null:+(enemyFacing(id)*D).toFixed(1), moving:!!(mr&&mr.moving), kmh:mr?+mr.kmh.toFixed(2):null,"+
  " status:liveStatus(id,phaseAt(clock)), near:near?near.id:null, nearKm:near?+nd.toFixed(3):null, bearingNear:br===null?null:+(br*D).toFixed(1), yawMinusBearing:br===null?null:ad(r.yaw||0,br)};";
const add=o=>S.push(Object.assign({vp:V, presentation:"watch", mode:"terrain", group:"extra"},o));
add({id:"x-ice-dok-1640", t:1000, aim:{map:"dok", dir:[0.55,0.45,0.70], r:16}, after:after("dok"), note:"Dokhturov's I Column on the Satschan mere's ice at 16:40 (probe.json: inside the disc, the ground 0.874 units under the ice; a man's head top 1.415)."});
add({id:"x-ice-dok-1640-low", t:1000, aim:{map:"dok", dir:[0.80,0.20,0.56], r:11}, after:after("dok"), note:"The same, low and close: the figures' depth in the ice."});
add({id:"x-ice-bux-1620", t:980, aim:{map:"buxhowden", dir:[-0.5,0.35,0.79], r:12}, after:after("buxhowden"), note:"Buxhowden's headquarters (the marquee) on the ice at 16:20."});
add({id:"x-face-kamensky-1010", t:610, aim:{map:"kamensky", dir:[0.25,0.80,0.55], r:14}, after:after("kamensky"), note:"Kamensky's brigade at 10:10, counterattacking (facings.js flags B and C: drifting 0.49 km/h, its yaw about 175 degrees off Saint-Hilaire 60 m off)."});
add({id:"x-face-sthilaire-0950", t:590, aim:{map:"sthilaire", dir:[0.25,0.80,0.55], r:14}, after:after("sthilaire"), note:"Saint-Hilaire's division at 09:50, engaged (flags B, C: 0.2 km/h, about 143 degrees off Kamensky 40 m off)."});
add({id:"x-face-prz-0910", t:550, aim:{map:"prz", dir:[0.25,0.80,0.55], r:14}, after:after("prz"), note:"Przybyszewski's III Column at 09:10, attacking, halted (flags A, D: about 152 degrees off Legrand 320 m off)."});
add({id:"x-face-dok-1350", t:830, aim:{map:"dok", dir:[0.25,0.80,0.55], r:14}, after:after("dok"), note:"Dokhturov at 13:50, engaged, halted (flags A, D: about 127 degrees off Bourcier 240 m off)."});
add({id:"x-face-kienmayer-0900", t:540, aim:{map:"kienmayer", dir:[0.25,0.80,0.55], r:20}, after:after("kienmayer"), note:"Kienmayer at 09:00, engaged (flags B, C: drifting 0.13 km/h, about 162 degrees off the nearest enemy 1.4 km off)."});
process.stdout.write(JSON.stringify(S,null,1));
