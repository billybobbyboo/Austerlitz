/* Roadmap step 5 (docs/FINAL_AUDIT.md T-9 (e)): the map frame the data's positions live in, read from world.js's W (guarded geography,
   tools/visual/data-invariance.js), not typed by hand in the tests (until step 5: 680 x 500 and "*2+340, *2+250" in test.js, redteam.js and
   geo-test.js). W is affine and takes the map's centre to the world's origin (world.js: "map (0..680, 0..500) -> world (x -170..170,
   z -125..125)"), so the frame is twice the point W sends to the origin, and toMap is W's inverse. Read-only; loads no page.
   require("./tools/map-frame.js")(W) -> {w, h, toMap(wx,wz), inside(p)} */
"use strict";
module.exports=function mapFrame(W){
  const o=W(0,0), u=W(1,1), sx=u[0]-o[0], sz=u[1]-o[1], cx=-o[0]/sx, cz=-o[1]/sz;
  if(!(sx>0&&sz>0)) throw new Error("map-frame: W is not increasing in both axes");
  const w=2*cx, h=2*cz;
  return {w, h, toMap:(wx,wz)=>[cx+wx/sx, cz+wz/sz], inside:p=>p[0]>=0&&p[0]<=w&&p[1]>=0&&p[1]<=h};
};
