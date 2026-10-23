/* Stage 8 Part A (docs/STAGE8_SPEC.md): the views the evidence is taken in. The harness's own cases where one fits (tools/visual/cases.js,
   by name, the same state and camera), and close views of the things Stage 8 is about, each fixed the same way (a clock, a presentation, a
   mode and an aim: the camera r units from the ground under a map point or a formation, along dir; tools/visual/measure.js aimOf).
   Each close view's formation and clock were chosen from the data (data.js tracks): what it shows there is the build's drawing of the
   formation's state at that clock, nothing staged. */
"use strict";
const path=require("path");
const CASES=require(path.join(__dirname,"..","visual","cases.js"));
const C=n=>{ const c=CASES.find(c=>c.name===n); if(!c) throw new Error("no case "+n); return JSON.parse(JSON.stringify(c)); };
const VP=[1600,900];
const V={
  /* the harness's views */
  "overview-field":C("overview-field"), "overview-plan":C("overview-plan"), "close-sokolnitz":C("close-sokolnitz"), "pratzen-low":C("pratzen-low"),
  "pratzen-low-1x":C("pratzen-low-1x"), "pratzen-low-10x":C("pratzen-low-10x"), "hybrid-dimmed":C("hybrid-dimmed"), "paper-north-up":C("paper-north-up"),
  "paper-close":C("paper-close"), "ph8-overview-watch":C("ph8-overview-watch"), "eye-zuran":C("eye-zuran"), "selected-formation":C("selected-formation"),
  /* Landscape with counters as a visitor in Study meets it (hybrid-dimmed has a corps highlighted) */
  "hybrid-field":{viewport:VP, t:570, presentation:"study", mode:"hybrid", cam:[-195,92,156,-33,4,-2], note:"Landscape with counters, the Field vantage, Study, 09:30."},
  "hybrid-low":{viewport:VP, t:590, presentation:"watch", mode:"hybrid", aim:{map:[285,289], dir:[-1.0,0.13,0.18], r:70}, note:"Landscape with counters, the low Pratzen view, Watch, 09:50."},
  /* close views: the troops (L3) */
  "inf-close":{viewport:VP, t:560, presentation:"watch", mode:"terrain", aim:{map:"sthilaire", dir:[-0.62,0.34,0.70], r:24},
    note:"Saint-Hilaire's division (French line infantry, 1re Div. IV Corps) on the plateau at 09:20, close."},
  "inf-mid":{viewport:VP, t:560, presentation:"watch", mode:"terrain", aim:{map:"sthilaire", dir:[-0.62,0.40,0.68], r:48},
    note:"Saint-Hilaire's division at 09:20, at the distance of the low views."},
  "cav-close":{viewport:VP, t:655, presentation:"watch", mode:"terrain", aim:{map:"nansouty", dir:[0.55,0.32,0.77], r:24},
    note:"Nansouty's cuirassiers (French heavy cavalry) charging in the north, 10:55, close."},
  "cav-mid":{viewport:VP, t:655, presentation:"watch", mode:"terrain", aim:{map:"nansouty", dir:[0.55,0.40,0.73], r:48},
    note:"Nansouty's cuirassiers at 10:55, at the distance of the low views."},
  "bat-deployed":{viewport:VP, t:800, presentation:"watch", mode:"terrain", aim:{map:"heightguns", dir:[-0.70,0.34,0.62], r:20},
    note:"The French guns on the heights, unlimbered on the southern shoulder of the plateau (phase 7, holding), 13:20, close."},
  "bat-limbered":{viewport:VP, t:850, presentation:"watch", mode:"terrain", aim:{map:"heightguns", dir:[-0.70,0.34,0.62], r:20},
    note:"The same guns hitched up and on the move toward the height above Augezd (the leg 13:45-14:30), 14:10, close."},
  "bat-chapel":{viewport:VP, t:900, presentation:"watch", mode:"terrain", aim:{map:"heightguns", dir:[0.10,0.30,-0.95], r:34},
    note:"The guns above Augezd at 15:00, looking south over the defile toward the Satschan mere."},
  /* the same troops framed from the block itself (stills.js focus: the camera r units from the block's centre, az radians from its facing,
     el radians up; the orbit target on the drawn ground at the block): the visitor's closest orbit is 24 units from its target */
  "inf-front":{viewport:VP, t:560, presentation:"watch", mode:"terrain", aim:{map:"sthilaire", dir:[-0.62,0.34,0.70], r:40}, focus:{id:"sthilaire", r:26, az:0.75, el:0.36},
    note:"Saint-Hilaire's division at 09:20, from its front left, 26 units (about the closest orbit)."},
  "cav-front":{viewport:VP, t:655, presentation:"watch", mode:"terrain", aim:{map:"nansouty", dir:[0.55,0.32,0.77], r:40}, focus:{id:"nansouty", r:26, az:0.75, el:0.36},
    note:"Nansouty's division charging at 10:55, from its front left, 26 units."},
  "bat-front":{viewport:VP, t:800, presentation:"watch", mode:"terrain", aim:{map:"heightguns", dir:[-0.70,0.34,0.62], r:40}, focus:{id:"heightguns", r:24, az:0.85, el:0.40},
    note:"The guns on the heights unlimbered (phase 7), 13:20, from their front left, 24 units."},
  "bat-march":{viewport:VP, t:850, presentation:"watch", mode:"terrain", aim:{map:"heightguns", dir:[-0.70,0.34,0.62], r:40}, focus:{id:"heightguns", r:24, az:1.1, el:0.36},
    note:"The same guns hitched up and on the move (the leg 13:45-14:30), 14:10, from their front left."},
  /* water (L4) */
  "ice-low":{viewport:VP, t:900, presentation:"watch", mode:"terrain", aim:{map:[262,428], dir:[0.25,0.22,0.94], r:46},
    note:"The Satschan mere and the Augezd causeway from the north, low, 15:00."},
  "ice-high":{viewport:VP, t:900, presentation:"watch", mode:"terrain", aim:{map:[250,440], dir:[0.10,0.80,0.59], r:90},
    note:"Both meres from above the defile, 15:00."},
  "ice-mid":{viewport:VP, t:900, presentation:"watch", mode:"terrain", aim:{map:[262,444], dir:[0.45,0.50,-0.74], r:58},
    note:"The Satschan mere from the north-east, looking south-west across the ice, 15:00."},
  "ice-sun":{viewport:VP, t:840, presentation:"watch", mode:"terrain", aim:{map:[262,444], dir:[-0.35,0.30,-0.89], r:52},
    note:"The Satschan mere against the low afternoon sun (the computed sun in the south-west at 14:00), from the north."},
  "stream-low":{viewport:VP, t:500, presentation:"watch", mode:"terrain", aim:{map:[209,392], dir:[-0.78,0.22,0.58], r:30},
    note:"The Goldbach between Sokolnitz and Telnitz, low, 08:20."},
  "goldbach-top":{viewport:VP, t:720, presentation:"watch", mode:"terrain", aim:{map:[206,380], dir:[0.05,0.99,0.1], r:28},
    note:"The Goldbach below Sokolnitz from straight above at noon, the fog gone (section 5: where a stream ribbon would show)."},
  "goldbach-noon":{viewport:VP, t:720, presentation:"watch", mode:"terrain", aim:{map:[206,380], dir:[-0.78,0.30,0.55], r:30},
    note:"The Goldbach below Sokolnitz at noon, from the west bank, 30 units out."},
  /* buildings and woods (L5, woodland) */
  "village-telnitz":{viewport:VP, t:470, presentation:"watch", mode:"terrain", aim:{map:[212,408], dir:[-0.55,0.30,0.78], r:26},
    note:"Telnitz, its church and houses, 07:50."},
  "village-sokolnitz":{viewport:VP, t:500, presentation:"watch", mode:"terrain", aim:{map:[226,355], dir:[-0.62,0.34,0.70], r:26},
    note:"Sokolnitz castle and the village, 08:20, close."},
  "village-pratzen":{viewport:VP, t:540, presentation:"watch", mode:"terrain", aim:{map:[276,243], dir:[-0.65,0.30,0.70], r:28},
    note:"Pratzen village on the plateau's western slope, 09:00."},
  "woods-pheasantry":{viewport:VP, t:500, presentation:"watch", mode:"terrain", aim:{map:[236,385], dir:[-0.55,0.36,0.75], r:44},
    note:"The pheasantry wood by Sokolnitz, 08:20."},
  "horizon-east":{viewport:VP, t:720, presentation:"watch", mode:"terrain", aim:{map:[230,250], dir:[-0.97,0.10,0.21], r:60},
    note:"A low view east over the Goldbach toward the plateau and the horizon, 12:00."}
};
Object.keys(V).forEach(k=>{ V[k].name=k; V[k].viewport=V[k].viewport||VP; });
module.exports=V;
