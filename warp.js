/* The legacy->corrected rubber-sheet warp, with no side effects (safe to require). */
const GEO=require('../geo.js');
/* legacy positions of the places the old map drew, keyed to GEO ids */
const LEGACY={
  bosenitz:[215,92], girzikowitz:[206,178], puntowitz:[224,214], kobelnitz:[238,272], sokolnitz:[232,330],
  telnitz:[226,396], augezd:[292,428], blasowitz:[300,152], holubitz:[368,88], pratzen:[372,290],
  schlapanitz:[120,165], krzenowitz:[420,180], austerlitz:[560,205], menitz:[160,478], satschan:[322,478],
  pratzeberg:[338,306], vinohrady:[310,190], zuran:[168,150], santon:[205,78]
};
const CTRL=Object.keys(LEGACY).map(k=>({k, P:LEGACY[k], D:[GEO.GT[k].map[0]-LEGACY[k][0], GEO.GT[k].map[1]-LEGACY[k][1]]}));

function warp(x,y){
  let sw=0,dx=0,dy=0;
  for(const c of CTRL){
    const d2=(x-c.P[0])**2+(y-c.P[1])**2;
    if(d2<1e-9) return [x+c.D[0], y+c.D[1]];
    const w=1/d2; sw+=w; dx+=w*c.D[0]; dy+=w*c.D[1];
  }
  return [x+dx/sw, y+dy/sw];
}
module.exports={warp,CTRL,LEGACY};
