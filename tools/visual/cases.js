/* Stage 0 baseline cases. Each case fixes the clock, the presentation, the ground style,
   the camera and any selection, so a later build can be compared with this one.
   cam: [px,py,pz, tx,ty,tz] in world units; aim: {map:[mx,my], dir:[dx,dy,dz], r} places the
   camera r units from the ground point under a map coordinate, along dir.
   interact: real pointer input, applied after the camera is placed (exercises bindCanvas). */
module.exports = [
  { name:"first-run", viewport:[1600,900], fresh:true,
    note:"What a first-time visitor sees, untouched." },
  { name:"first-run-laptop", viewport:[1366,768], fresh:true,
    note:"The same on a common laptop viewport." },
  { name:"overview-field", viewport:[1600,900], t:570, presentation:"study", mode:"terrain",
    cam:[-195,92,156,-33,4,-2], note:"Full battlefield from the west at 09:30 (Field vantage)." },
  { name:"overview-plan", viewport:[1600,900], t:570, presentation:"watch", mode:"terrain",
    cam:[-27,272,41,-27,0,9], note:"Operational overview from above (Overview vantage), Watch mode." },
  { name:"close-sokolnitz", viewport:[1600,900], t:500, presentation:"watch", mode:"terrain",
    aim:{map:[210,362], dir:[-0.62,0.46,0.64], r:58}, note:"Close view of Sokolnitz and the lower Goldbach, 08:20." },
  { name:"staff-paper", viewport:[1600,900], t:570, presentation:"study", mode:"staff",
    cam:[-27,272,41,-27,0,9], note:"Staff (paper) map, Overview vantage, 09:30." },
  { name:"pratzen-low", viewport:[1600,900], t:590, presentation:"watch", mode:"terrain",
    aim:{map:[285,289], dir:[-1.0,0.13,0.18], r:70}, note:"Low angle from the Goldbach up the west face of the Pratzeberg, 09:50." },
  { name:"pratzen-orbit-min", viewport:[1600,900], t:590, presentation:"watch", mode:"terrain",
    cam:[23,26,55,-31,10,-13], interact:{target:"deepest", wheel:24, dragY:-700, aim:"deepest"},
    note:"Centre (as a click on a name does) on the place or formation from which the closest, lowest orbit reaches furthest into the ground, zoom fully in, drag to the lowest pitch and turn toward the hill: the path that put the eye inside it." },
  { name:"selected-formation", viewport:[1600,900], t:570, presentation:"study", mode:"terrain",
    select:["f","sthilaire"], aim:{map:"sthilaire", dir:[-0.55,0.62,0.56], r:86},
    note:"Saint-Hilaire's division selected in Study: dossier card open, family highlighted." },
  { name:"watch-selected", viewport:[1600,900], t:585, presentation:"watch", mode:"terrain",
    select:["f","kamensky"], aim:{map:"kamensky", dir:[-0.55,0.62,0.56], r:80},
    note:"A formation selected while in Watch mode." },
  { name:"hybrid-dimmed", viewport:[1600,900], t:600, presentation:"watch", mode:"hybrid",
    select:["f","c_iv"], aim:{map:[285,289], dir:[-0.7,0.45,0.55], r:95},
    note:"Hybrid mode with a corps highlighted, so most blocks are drawn at the dimmed scale." },
  /* Stage 2B: every case above runs at the default display factor (4x), its camera re-framed to the drawn ground
     (app.js placeCamera); these two run the low Pratzen view at true scale and at the model's own scale (the
     drawing before 2B), with the same thresholds */
  { name:"pratzen-low-1x", viewport:[1600,900], t:590, presentation:"watch", mode:"terrain", factor:1,
    aim:{map:[285,289], dir:[-1.0,0.13,0.18], r:70}, note:"The low Pratzen view at true scale: formations drawn as footprints." },
  { name:"pratzen-low-10x", viewport:[1600,900], t:590, presentation:"watch", mode:"terrain", factor:"model",
    aim:{map:[285,289], dir:[-1.0,0.13,0.18], r:70}, note:"The low Pratzen view at the model's own vertical scale (GEOREF.EXAG, the drawing before 2B)." }
];
