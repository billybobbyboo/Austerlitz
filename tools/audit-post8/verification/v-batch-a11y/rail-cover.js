// v-batch-a11y: the event markers' hit coverage along the time rail's centre line, from EVENTS (data.js) and style.css's geometry.
// Marker: 8x8 (dec 10x10 + 2px border) rotated 45deg, ::after inset -6px of the padding box; .evmarks and .timerail share top and are 24 px high.
const fs=require('fs'),vm=require('vm'),R='/home/user/Austerlitz/';
const ctx={console,Math,JSON,Object,Array};vm.createContext(ctx);
for(const f of ['geo.js','data.js','analysis.js']){ try{ vm.runInContext(fs.readFileSync(R+f,'utf8')+'\n;this.EVENTS=typeof EVENTS!=="undefined"?EVENTS:this.EVENTS;',ctx,{filename:f}); }catch(e){ console.error(f,e.message); } }
const T_MIN=240,T_MAX=1080, EV=ctx.EVENTS; const starts=EV.map(e=>({t:Array.isArray(e.t)?e.t[0]:e.t,dec:e.kind==='decision'}));
const railY=12; // rail centre within the 24 px band
function halfW(dec){ // padding box side s, centre cy; hit square side s+12 rotated 45deg: half-diagonal (s+12)/sqrt2
  const s=dec?10:8, top=dec?1:2, border=dec?2:0, cy=top+border+s/2; const hd=(s+12)/Math.SQRT2; return Math.max(0,hd-Math.abs(railY-cy)); }
for(const W of [374,1572]){ const iv=starts.map(o=>{const x=W*(o.t-T_MIN)/(T_MAX-T_MIN),h=halfW(o.dec);return [x-h,x+h,o.t];}).sort((a,b)=>a[0]-b[0]);
  function cover(lo,hi){ let c=0,cur=null; for(const [a,b] of iv){ const A=Math.max(a,lo),B=Math.min(b,hi); if(B<=A) continue; if(!cur){cur=[A,B];} else if(A<=cur[1]){cur[1]=Math.max(cur[1],B);} else {c+=cur[1]-cur[0];cur=[A,B];} } if(cur)c+=cur[1]-cur[0]; return c; }
  const x7=W*(420-T_MIN)/(T_MAX-T_MIN), x15=W*(900-T_MIN)/(T_MAX-T_MIN);
  console.log(JSON.stringify({railPx:W,markers:starts.length,distinctStarts:new Set(starts.map(o=>o.t)).size,halfWidthPlain:+halfW(false).toFixed(2),halfWidthDec:+halfW(true).toFixed(2),coverWhole:+(cover(0,W)/W).toFixed(3),cover0700to1500:+(cover(x7,x15)/(x15-x7)).toFixed(3)}));
}
