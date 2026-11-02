#!/usr/bin/env node
/* Final audit after Stage 8, area visual-landscape: the shot list (writes shots.json beside the evidence). Every view is fixed by a clock, a
   presentation, a ground, a display factor and a camera: a vantage (app.js VANTAGE, placed as the app places a preset: placeCamera ->
   presetFrame, the Overview fitted to the battle), a harness or Stage 8 view (tools/visual/cases.js, tools/stage8/views.js, stills-8j.js:
   their aims copied here), or an aim chosen for this audit {map:[x,y] map units or a formation id, dir, r world units} (measure.js aimOf).
   Order = priority (the carried items first), so that a run cut short keeps the most important captures.
   usage: node shots.js > shots.json */
"use strict";
const V1600=[1600,900], V1280=[1280,720];
const S=[];
const add=(o)=>S.push(Object.assign({vp:V1600, presentation:"watch", mode:"terrain"},o));
const T={"0600":360,"0800":480,"0900":540,"1000":600,"1200":720,"1400":840,"1500":900,"1630":990};
/* ---- 1. the carried items ---- */
/* the Sokolnitz castle (decision 266 (a)): 8J's views (tools/stage8/stills-8j.js) and a wider one with the village */
add({id:"sok-castle-1000", group:"landmarks", t:600, aim:{map:[212.9,344.3], dir:[-0.55,0.42,0.72], r:26}, note:"The Sokolnitz castle's site at 10:00, the III Column holding it (stills-8j 'sokolnitz-castle')."});
add({id:"sok-castle-1500-close", group:"landmarks", t:900, aim:{map:[212.9,344.3], dir:[-0.55,0.42,0.72], r:14}, note:"The castle close at 15:00, the III Column gone (stills-8j 'sokolnitz-castle-afternoon')."});
add({id:"sok-castle-1500-clean", group:"landmarks", t:900, presentation:"map", aim:{map:[212.9,344.3], dir:[-0.55,0.42,0.72], r:26}, note:"The castle and the village at 15:00 in Clean (no map text): its size against the farmhouses."});
add({id:"sok-village-1200-west", group:"landmarks", t:720, presentation:"map", aim:{map:[210,352], dir:[-0.80,0.45,0.40], r:45}, note:"Sokolnitz from the west at 12:00 in Clean: the castle among the village's farmsteads, the brook, the pheasantry."});
add({id:"sok-pheasantry-1000", group:"landmarks", t:600, aim:{map:[214.6,328.5], dir:[0.62,0.40,0.68], r:34}, note:"The pheasantry (8J's traced 1825 outline) at 10:00 (stills-8j 'sokolnitz-pheasantry')."});
add({id:"sok-brook-0820", group:"landmarks", t:500, aim:{map:[211,360], dir:[0.70,0.34,0.62], r:30}, note:"The Goldbach by Sokolnitz at 08:20 (stills-8j 'sokolnitz-brook')."});
/* the ice under a low sun (decision 264 (a)): 8F's/8H's views (views.js ice-*, ice-8h.js) */
add({id:"ice-low-1500", group:"ice", t:900, aim:{map:[262,428], dir:[0.25,0.22,0.94], r:46}, note:"The Satschan mere low, 15:00 (views.js ice-low)."});
add({id:"ice-low8h-1500", group:"ice", t:900, aim:{map:[262,440], dir:[0.45,0.18,-0.74], r:50}, note:"8H's low view of the meres at 15:00 (ice-8h.js 'low': the glare measured 43.5%)."});
add({id:"ice-low8h-0900", group:"ice", t:540, aim:{map:[262,440], dir:[0.45,0.18,-0.74], r:50}, note:"The same low view at 09:00 (glare 18.2% in 8H)."});
add({id:"ice-low8h-1200", group:"ice", t:720, aim:{map:[262,440], dir:[0.45,0.18,-0.74], r:50}, note:"The same low view at 12:00 (glare 21.2% in 8H)."});
add({id:"ice-mid-1500", group:"ice", t:900, aim:{map:[262,444], dir:[0.45,0.50,-0.74], r:58}, note:"The meres obliquely at 15:00 (views.js ice-mid)."});
add({id:"ice-high-1500", group:"ice", t:900, aim:{map:[250,440], dir:[0.10,0.80,0.59], r:90}, note:"The meres from above at 15:00 (views.js ice-high)."});
add({id:"ice-sun-1400", group:"ice", t:840, aim:{map:[262,444], dir:[-0.35,0.30,-0.89], r:52}, note:"The meres toward the sun at 14:00 (views.js ice-sun)."});
add({id:"ice-low8h-1630", group:"ice", t:990, aim:{map:[262,440], dir:[0.45,0.18,-0.74], r:50}, note:"The low view at 16:30 (the sun setting)."});
/* Satschan's farmsteads (261 (a)), the Austerlitz garden (8J), the post house (8K), the omitted landmarks */
add({id:"satschan-1200", group:"landmarks", t:720, aim:{map:[262.4,443.7], dir:[-0.45,0.55,0.70], r:28}, note:"Satschan village at 12:00: five farmsteads of seven drawn (decision 261 (a))."});
add({id:"austerlitz-garden-1400", group:"landmarks", t:840, aim:{map:[496,125], dir:[-0.40,0.55,0.73], r:30}, note:"The Austerlitz château and its garden at 14:00 (stills-8j 'austerlitz-garden')."});
add({id:"austerlitz-town-1400", group:"landmarks", t:840, aim:{map:[500,126], dir:[-0.55,0.62,0.56], r:80}, note:"Austerlitz from the west-north-west at 14:00, 80 units off: the town, the château's symbol, the garden."});
add({id:"posthouse-1500", group:"landmarks", t:900, aim:{map:[363.2,53.8], dir:[-0.55,0.40,0.73], r:24}, note:"The Posoritz post house at 15:00 (stills-8j 8k 'posthouse')."});
add({id:"posthouse-1000-wide", group:"landmarks", t:600, aim:{map:[355,60], dir:[-0.60,0.50,0.62], r:60}, note:"The post house and the highway at 10:00 (Bagration's front), 60 units off."});
add({id:"santon-1000", group:"landmarks", t:600, aim:{map:[222,87], dir:[-0.62,0.40,0.68], r:34}, note:"The Santon at 10:00: the hill, its battery; the chapel not drawn (BUILDINGS.notDrawn.santon)."});
add({id:"santon-1300-close", group:"landmarks", t:780, aim:{map:[222,87], dir:[0.50,0.35,0.79], r:18}, note:"The Santon's top close at 13:00 from the north-east."});
add({id:"stanthony-1300", group:"landmarks", t:780, aim:{map:[291,354], dir:[-0.55,0.45,0.70], r:30}, note:"Above Augezd at 13:00: the chapel of St Anthony's site (not drawn; its name on the ground)."});
add({id:"pratzen-church-0900", group:"landmarks", t:540, aim:{map:[277,252], dir:[-0.65,0.38,0.66], r:22}, note:"The Pratzen church at its own site (8J) at 09:00 (stills-8j 'pratzen-church')."});
add({id:"telnitz-0800", group:"landmarks", t:480, aim:{map:[212,408], dir:[-0.55,0.30,0.78], r:26}, note:"Telnitz at 08:00 (views.js village-telnitz at 07:50)."});
add({id:"telnitz-0930-wide", group:"landmarks", t:570, aim:{map:[215,405], dir:[-0.70,0.45,0.55], r:50}, note:"Telnitz at 09:30, Friant retaking it, 50 units off."});
add({id:"pratzeberg-0930", group:"landmarks", t:570, aim:{map:[285,289], dir:[-0.55,0.45,-0.70], r:60}, note:"The Pratzeberg from the north-west at 09:30."});
add({id:"pratzeberg-1000-east", group:"landmarks", t:600, aim:{map:[285,289], dir:[0.75,0.40,0.53], r:55}, note:"The Pratzeberg from the east at 10:00, the crisis."});
/* the troops: 8E/8F's closest figure views (views.js), the slopes, the artillery */
add({id:"inf-close-0920", group:"troops", t:560, aim:{map:"sthilaire", dir:[-0.62,0.34,0.70], r:24}, note:"Saint-Hilaire's division at 09:20, 24 units off (views.js inf-close)."});
add({id:"inf-east-0900", group:"troops", t:540, aim:{map:"sthilaire", dir:[0.7,0.35,0.2], r:26}, note:"Saint-Hilaire's division climbing at 09:00 from ahead of its march (clips-8e 'infantry')."});
add({id:"cav-close-1055", group:"troops", t:655, aim:{map:"nansouty", dir:[0.55,0.32,0.77], r:24}, note:"Nansouty's cuirassiers at 10:55, 24 units off (views.js cav-close)."});
add({id:"bat-deployed-1320", group:"troops", t:800, aim:{map:"heightguns", dir:[-0.70,0.34,0.62], r:20}, note:"The guns on the heights deployed at 13:20 (views.js bat-deployed): drivers on the limbers' horses."});
add({id:"bat-limbered-1410", group:"troops", t:850, aim:{map:"heightguns", dir:[-0.70,0.34,0.62], r:20}, note:"The same battery limbered and moving at 14:10 (views.js bat-limbered): no gunners drawn."});
add({id:"bat-chapel-1500", group:"troops", t:900, aim:{map:"heightguns", dir:[0.10,0.30,-0.95], r:34}, note:"The battery at 15:00 from the south (views.js bat-chapel)."});
add({id:"slope-10x-0900", group:"troops", t:540, factor:"model", aim:{map:"sthilaire", dir:[0.3,0.15,-0.95], r:16}, note:"At 10.33x on the slope, low from the side (clips-8e 'slope-10x'): feet on the drawn ground."});
add({id:"slope-4x-0900-r10", group:"troops", t:540, aim:{map:"sthilaire", dir:[0.3,0.15,-0.95], r:10}, note:"At 4x on the slope, low from the side, 10 units off: the rich kit at its closest."});
add({id:"slope-10x-0900-r8", group:"troops", t:540, factor:"model", aim:{map:"sthilaire", dir:[0.3,0.12,-0.95], r:8}, note:"At 10.33x, 8 units off, low: the closest figure view."});
add({id:"santon-guns-1300", group:"troops", t:780, aim:{map:"santon", dir:[-0.40,0.35,0.85], r:16}, note:"The Santon's battery and detachment at 13:00, close."});
add({id:"rg-inf-1045", group:"troops", t:645, aim:{map:"rg_inf", dir:[0.60,0.35,0.72], r:24}, note:"The Russian Guard infantry at 10:45 (standards)."});
add({id:"kollo-0920", group:"troops", t:560, aim:{map:"kollo", dir:[0.60,0.35,0.72], r:24}, note:"Kollowrat's Austrians at 09:20 (standards, the white coats)."});
/* ---- 2. the vantage matrix: the five vantages and the low Pratzen view (cases.js pratzen-low) at the eight clocks, Watch, 4x ---- */
const PL={map:[285,289], dir:[-1.0,0.13,0.18], r:70};
const order=["0900","1500","0600","1200","0800","1000","1400","1630"];
for(const k of order){
  add({id:"v-field-"+k, group:"vantage", t:T[k], vantage:"field", note:"The Field vantage at "+k+"."});
  add({id:"v-plateau-"+k, group:"vantage", t:T[k], vantage:"plateau", note:"The Pratzen vantage at "+k+"."});
  add({id:"v-plan-"+k, group:"vantage", t:T[k], vantage:"plan", note:"The Overview (fitted to the battle's extent) at "+k+"."});
  add({id:"v-low-"+k, group:"vantage", t:T[k], aim:PL, note:"The low Pratzen view (cases.js pratzen-low) at "+k+"."});
  if(["0600","0800","1000","1500"].includes(k)) add({id:"v-zuran-"+k, group:"vantage", t:T[k], vantage:"zuran", note:"The Zuran vantage at "+k+"."});
  if(["0600","0900","1200","1630"].includes(k)) add({id:"v-allied-"+k, group:"vantage", t:T[k], vantage:"allied", note:"The Allied vantage at "+k+"."});
}
/* ---- 3. the factors ---- */
add({id:"f-low-1x-0900", group:"factor", t:540, factor:1, aim:PL, note:"pratzen-low at 1x, 09:00."});
add({id:"f-low-10x-0900", group:"factor", t:540, factor:"model", aim:PL, note:"pratzen-low at 10.33x, 09:00."});
add({id:"f-low-1x-1500", group:"factor", t:900, factor:1, aim:PL, note:"pratzen-low at 1x, 15:00."});
add({id:"f-low-10x-1500", group:"factor", t:900, factor:"model", aim:PL, note:"pratzen-low at 10.33x, 15:00."});
add({id:"f-field-1x-1000", group:"factor", t:600, factor:1, vantage:"field", note:"The Field vantage at 1x, 10:00."});
add({id:"f-field-10x-1000", group:"factor", t:600, factor:"model", vantage:"field", note:"The Field vantage at 10.33x, 10:00."});
add({id:"f-sok-1x-1000", group:"factor", t:600, factor:1, aim:{map:[212.9,344.3], dir:[-0.55,0.42,0.72], r:26}, note:"The castle view at 1x, 10:00."});
add({id:"f-sok-10x-1000", group:"factor", t:600, factor:"model", aim:{map:[212.9,344.3], dir:[-0.55,0.42,0.72], r:26}, note:"The castle view at 10.33x, 10:00."});
add({id:"f-santon-10x-1000", group:"factor", t:600, factor:"model", aim:{map:[222,87], dir:[-0.62,0.40,0.68], r:34}, note:"The Santon at 10.33x, 10:00."});
/* ---- 4. 1280 x 720 spot checks ---- */
add({id:"l-field-0900", group:"laptop", vp:V1280, t:540, vantage:"field", note:"The Field vantage at 1280 x 720, 09:00."});
add({id:"l-low-1500", group:"laptop", vp:V1280, t:900, aim:PL, note:"pratzen-low at 1280 x 720, 15:00."});
add({id:"l-plan-1200", group:"laptop", vp:V1280, t:720, vantage:"plan", note:"The Overview at 1280 x 720, 12:00."});
add({id:"l-sok-1000", group:"laptop", vp:V1280, t:600, aim:{map:[212.9,344.3], dir:[-0.55,0.42,0.72], r:26}, note:"The castle view at 1280 x 720, 10:00."});
process.stdout.write(JSON.stringify(S,null,1));
