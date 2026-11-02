/* Final audit after Stage 8, area "visibility": the runs long-play.js and stills.js play (each: [view spec, options]; from/to in clock minutes,
   540 = 09:00; speed 0.5 = 1/2x). Views from tools/visual/motion.js VIEWS. */
"use strict";
const path=require("path");
const MO=require(path.join(__dirname,"..","..","visual","motion.js"));
const VW=MO.VIEWS, view=(k,o)=>Object.assign(JSON.parse(JSON.stringify(VW[k])),o||{});
/* each run: [view spec, the run's options]. from/to in clock minutes (540 = 09:00); speed 0.5 = 1/2x */
const RUNS={
  /* the benchmark's three Play runs replicated (motion.js MOTIONS: 09:00, 90 frames at 1/2x, 30 at rest): the instrument's check against MOTION.VIS */
  "bench-hybrid":[view("hybrid"),{from:540,speed:0.5,fixedFrames:90}],
  "bench-land":[view("land"),{from:540,speed:0.5,fixedFrames:90}],
  "bench-paper":[view("paper"),{from:540,speed:0.5,fixedFrames:90}],
  /* the long runs */
  "hybrid-0830":[view("hybrid"),{from:510,to:690,speed:0.5}],
  "hybrid-1200":[view("hybrid"),{from:720,to:900,speed:0.5}],
  "hybrid-4x-day":[view("hybrid"),{from:240,to:1080,speed:4}],
  "land-0900":[view("land"),{from:540,to:720,speed:0.5}],
  "land-4x-day":[view("land"),{from:240,to:1080,speed:4}],
  "paper-0900":[view("paper"),{from:540,to:720,speed:0.5}],
  "phone-0900":[view("phone"),{from:540,to:720,speed:0.5}],
  "hybrid-fr-0900":[view("hybrid"),{from:540,to:720,speed:0.5,reading:"fr"}],
  "hybrid-al-0900":[view("hybrid"),{from:540,to:720,speed:0.5,reading:"al"}],
  "hybrid-fixed-0830":[view("hybrid"),{from:510,to:690,speed:0.5,follow:false}],
  "hybrid-watch-0830":[view("hybrid",{presentation:"watch"}),{from:510,to:690,speed:0.5}],
  "land-watch-0900":[view("land",{presentation:"watch"}),{from:540,to:720,speed:0.5}],
  "hybrid-sel-0900":[view("hybrid"),{from:540,to:600,speed:0.5,select:"nansouty"}],
  "hybrid-hover-0900":[view("hybrid"),{from:540,to:600,speed:0.5,hover:"milo"}],
  /* the driver at a slow device's pacing: frames 1 s apart (each frame a re-placement pass; Play's dt capped at 120 ms), to compare with the
     real-time run on this machine's software WebGL (realtime.js) */
  "hybrid-0900-slow":[view("hybrid"),{from:540,to:600,speed:0.5,frameMs:1000}],
  /* the same hour at 30 frames a second, to compare with the real-time run without the WebGL draw (realtime.js --nogl) */
  "hybrid-0900-1h":[view("hybrid"),{from:540,to:600,speed:0.5}]
};
module.exports={RUNS, view};
