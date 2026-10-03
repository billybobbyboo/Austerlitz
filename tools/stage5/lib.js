/* Stage 5 Part A: shared by the page probes in this folder. The page is opened as the Stage 0 harness opens it
   (tools/stage2/page.js); these helpers are injected into it. Measurement code only: nothing here is the Stage 5 design. */
const path=require("path");
const P2=require("../stage2/page.js");
/* the landscape harness views at 1600 x 900 (no first run, no pointer interaction), and the four drawn at every factor */
const LAND=P2.CASES.filter(c=>!c.fresh&&c.mode!=="staff"&&c.viewport[0]===1600&&!c.interact&&!c.factor);
const MULTI=["overview-field","close-sokolnitz","pratzen-low","ph8-overview-watch"];
const PAPER=P2.CASES.filter(c=>c.mode==="staff"&&c.viewport[0]===1600);
const FACTORS=[[4,""],[1,"@1x"],["model","@10.33x"]];
/* in the page: __s5.diff(a,b) compares two screenshots of the same view (base64 PNG): the share of the free rectangle
   (outside every panel) whose pixels changed, and the contrast between each changed pixel and the same pixel before (the
   encoding against the ground it lies on: WCAG luminance ratio; non-text needs 3:1). __s5.frame(n) times the world pass. */
const HELPERS=function(){
  var S={};
  function lin(v){ v/=255; return v<=0.04045?v/12.92:Math.pow((v+0.055)/1.055,2.4); }
  function L(d,o){ return 0.2126*lin(d[o])+0.7152*lin(d[o+1])+0.0722*lin(d[o+2]); }
  function img(b){ return new Promise(function(r){ var i=new Image(); i.onload=function(){ var c=document.createElement("canvas"); c.width=i.width; c.height=i.height;
    var x=c.getContext("2d",{willReadFrequently:true}); x.drawImage(i,0,0); r({w:i.width,h:i.height,d:x.getImageData(0,0,i.width,i.height).data}); }; i.src="data:image/png;base64,"+b; }); }
  S.panels=function(){ var sel=[".rail",".dispatch",".legend",".timebar",".tools","#viewmode","#firstrun",".drawer","#tourbar","#selchip","#layerpop","#vsbadge","#maplayer .ml-item"], R=[];
    var railHidden=document.body.classList.contains("rail-hidden");
    sel.forEach(function(s){ document.querySelectorAll(s).forEach(function(e){ var cs=getComputedStyle(e); if(cs.display==="none"||cs.visibility==="hidden"||+cs.opacity<0.05||e.hidden) return;
      if((e.classList.contains("rail")&&railHidden)||(e.classList.contains("drawer")&&!e.classList.contains("on"))) return;
      var r=e.getBoundingClientRect(); if(r.width>0&&r.height>0) R.push([r.left,r.top,r.right,r.bottom]); }); });
    return R; };
  S.diff=function(a,b,thr){ thr=thr||8; var fr=(typeof landFreeRect==="function"&&mode!=="staff")?landFreeRect():MAPCAM.freeRect(null,landPanels()), R=S.panels();
    return Promise.all([img(a),img(b)]).then(function(I){ var A=I[0].d, B=I[1].d, W=I[0].w, n=0, ch=0, cs=[];
      for(var y=Math.ceil(fr[1]);y<Math.floor(fr[3]);y+=2) for(var x=Math.ceil(fr[0]);x<Math.floor(fr[2]);x+=2){
        var inP=false; for(var k=0;k<R.length;k++){ var r=R[k]; if(x>=r[0]&&x<r[2]&&y>=r[1]&&y<r[3]){ inP=true; break; } } if(inP) continue;
        var o=(y*W+x)*4; n++; var dd=Math.max(Math.abs(A[o]-B[o]),Math.abs(A[o+1]-B[o+1]),Math.abs(A[o+2]-B[o+2]));
        if(dd>thr){ ch++; var la=L(A,o), lb=L(B,o); cs.push((Math.max(la,lb)+0.05)/(Math.min(la,lb)+0.05)); } }
      cs.sort(function(p,q){ return p-q; });
      return {samples:n,changed:n?+(ch/n).toFixed(4):0,contrastMedian:cs.length?+cs[Math.floor(cs.length/2)].toFixed(2):null,
              contrastP90:cs.length?+cs[Math.floor(cs.length*0.9)].toFixed(2):null,share3to1:cs.length?+(cs.filter(function(c){ return c>=3; }).length/cs.length).toFixed(3):null}; }); };
  S.frame=function(n){ var t=[]; for(var i=0;i<(n||5);i++){ renderFrame(); t.push(DEV.tWorld); } t.sort(function(a,b){ return a-b; }); return +t[Math.floor(t.length/2)].toFixed(2); };
  S.layer=function(){ mlLayout(); return {dropped:ML.stats.dropped,items:ML.stats.items,placed:ML.stats.placed}; };
  window.__s5=S; return true;
};
function inject(page,fn){ return page.evaluate(fn.toString().replace(/^function\s*\(\)\s*\{/,"(function(){")+")()"); }
async function shot(page){ return (await page.screenshot({timeout:180000})).toString("base64"); }
async function contrastOf(page,b64){ const tc=await page.evaluate(b=>window.__aus.textContrast(b),b64); return {min:tc.min,belowAA:tc.belowAA.length,texts:tc.texts}; }
async function darkOf(page,b64){ const px=await page.evaluate(b=>window.__aus.pixels(b),b64); return {solidBlack:px.solidBlack,meanLum:px.meanLum}; }
module.exports=Object.assign({},P2,{LAND,MULTI,PAPER,FACTORS,HELPERS,inject,shot,contrastOf,darkOf,EVID:path.join(P2.ROOT,"docs","stage5-evidence")});
