#!/usr/bin/env node
/* Stage 6D (docs/STAGE6_SPEC.md section 6.3, "Its report must show"): the standards from the table measured against the build before them,
   view by view, on the real builds (nothing in the scene is changed but Position confidence for measure 1's second frame, restored).
   node tools/stage6/compare-6d.js [--before f.html (default: the 6C build, extracted from commit 04f8535)] [--after austerlitz-command-map.html]
                                   [--only views] [--json f] [--md f] [--sheet f] [--frames dir] [--resume]
   Per view (tools/stage6/lib.js views()), on each build:
   1. the thresholds as rendered: solid near-black and mean luminance (measure.js pixels; the Stage 0 limit 0.0005), the map text's lowest
      contrast and the number below AA (measure.js textContrast), the map layer's drops, the smoke's share (measure.js smokeShare), the
      position-confidence marks' share (measure.js confShare, against the view with no mark: CONF.none), the world pass (software WebGL, the
      median of 15 frames) and the draw calls of one frame; the share of the free rectangle that differs between the builds;
   2. the standards: how many have their cloth's centre in the free rectangle, and each such cloth's size on screen (its four corners
      projected: the width along its top edge and the height along its staff side, in px), the median and the largest.
   It also lists every block's standards on both builds (how many; on the after build per class: its colours entry, the painting or the plain
   cloth, the rule of its count, its height rule and ratio, the cloth's size in units, the finial).
   Each view's results are saved as it is measured, and --resume skips what is saved. */
const fs=require("fs"), path=require("path"), os=require("os"), cp=require("child_process");
const L=require("./lib.js");
const {launch,open,HELPERS,inject,views,applyView,shot,contrastOf,darkOf,sheet,EVID6,ROOT}=L;
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const FRAMES=opt("--frames")||path.join(os.tmpdir(),"aus-compare-6d"), RESUME=args.includes("--resume");
fs.mkdirSync(FRAMES,{recursive:true});
let BEFORE=opt("--before");
if(!BEFORE){ BEFORE=path.join(FRAMES,"stage6c-07c61c82.html");
  if(!fs.existsSync(BEFORE)) fs.writeFileSync(BEFORE,cp.execSync("git show 04f8535:austerlitz-command-map.html",{cwd:ROOT,maxBuffer:1<<26})); }
const AFTER=opt("--after")||"austerlitz-command-map.html";
const OUTJ=opt("--json")||path.join(EVID6,"compare-6d.json"), OUTM=opt("--md")||path.join(EVID6,"compare-6d.md"), SHEET=opt("--sheet")||path.join(EVID6,"compare-6d-sheet.jpg");
const SHEETV=["close-sokolnitz","pratzen-low","eye-zuran","pratzen-orbit-min"];

const PROBE=function(){
  var S={};
  /* every cloth drawn (any build: the instanced meshes whose geometry is GEO.flag), its four corners projected */
  S.cloths=function(){ var fr=landFreeRect(), VW=renderer.domElement.clientWidth||innerWidth, VH=viewH(), M=new THREE.Matrix4(), out=[];
    var P=[new THREE.Vector3(-1.2,0.7,0),new THREE.Vector3(1.2,0.7,0),new THREE.Vector3(-1.2,-0.7,0),new THREE.Vector3(1.2,-0.7,0),new THREE.Vector3()], q=new THREE.Vector3();
    function sc(v){ q.copy(v).applyMatrix4(M).project(camera); return [(q.x*0.5+0.5)*VW,(-q.y*0.5+0.5)*VH,q.z]; }
    camera.updateMatrixWorld(true);
    Object.keys(units).forEach(function(id){ var b=units[id].block; if(!b||!__aus.effVisible(b)) return; b.updateMatrixWorld(true);
      b.traverse(function(o){ if(!o.isInstancedMesh||o.geometry!==GEO.flag||!__aus.effVisible(o)) return;
        for(var i=0;i<o.count;i++){ o.getMatrixAt(i,M); M.premultiply(o.matrixWorld); var c=sc(P[4]);
          if(c[2]>1||c[0]<fr[0]||c[0]>fr[2]||c[1]<fr[1]||c[1]>fr[3]) continue;
          var a=sc(P[0]), b2=sc(P[1]), d=sc(P[2]); out.push([Math.hypot(b2[0]-a[0],b2[1]-a[1]),Math.hypot(d[0]-a[0],d[1]-a[1])]); } }); });
    function st(k){ var v=out.map(function(e){ return e[k]; }).sort(function(x,y){ return x-y; }); return v.length?{med:+v[Math.floor(v.length/2)].toFixed(1),max:+v[v.length-1].toFixed(1)}:null; }
    return {n:out.length, w:st(0), h:st(1)}; };
  /* every block's standards: on 6D the table's (ud.stds), before it the count of its poles */
  S.blocks=function(){ var out={};
    Object.keys(units).forEach(function(id){ var u=units[id].block&&units[id].block.userData; if(!u) return;
      if(!u.stds){ out[id]={n:u.poles?u.poles.count:0}; return; }
      var by={}; u.stds.forEach(function(q){ var k=q.dress; if(!by[k]) by[k]={dress:q.dress,carry:q.carry,n:0,paint:q.S.paint||"plain",rule:q.rule.how,per:q.rule.per,rate:q.rule.n,
        provisional:q.S.provisional,ratio:+q.S.ratio.toFixed(4),denom:+q.S.denom.toFixed(3),w:+q.S.w.toFixed(3),h:+q.S.h.toFixed(3),fin:+q.S.fin.toFixed(3),cloth:q.S.clothBy}; by[k].n++; });
      var none=(u.dress||[]).filter(function(r){ return r.dress&&(r.role==="ranks"||r.role==="riders"||r.role==="escort"||r.role==="crew")&&!by[r.dress]; })
        .map(function(r){ var R=kitStdRule(DRESS[r.dress].carry); return {dress:r.dress,why:R.why}; });
      out[id]={n:u.stds.length,classes:Object.keys(by).map(function(k){ return by[k]; }),none:none}; });
    return out; };
  window.__s6d=S; return true;
};

async function measure(html,RUN,label,out){
  const res=out[label], todo=RUN.filter(V=>!res.views[V.key]);
  if(!todo.length&&res.blocks) return;
  const browser=await launch(), page=await open(browser,[1600,900],path.resolve(ROOT,html));
  await inject(page,HELPERS); await inject(page,PROBE);
  const quick=async()=>{ await page.evaluate(()=>AUSTERLITZ_DEBUG.settle(2)); };
  if(!res.blocks){ res.blocks=await page.evaluate(()=>__s6d.blocks()); fs.writeFileSync(OUTJ,JSON.stringify(out,null,1)); }
  for(const V of todo){
    const t0=Date.now(); await applyView(page,V);
    const r={}, b0=await shot(page);
    r.layer=await page.evaluate(()=>__s5.layer()); r.contrast=await contrastOf(page,b0); r.dark=await darkOf(page,b0);
    r.worldMs=await page.evaluate(()=>__s5.frame(15));
    r.calls=await page.evaluate(()=>{ renderer.info.autoReset=false; renderer.info.reset(); renderFrame(); var c=renderer.info.render.calls; renderer.info.autoReset=true; return c; });
    r.smoke=await page.evaluate(()=>{ var s=window.__aus.smokeShare(); return s?s.share:null; });
    fs.writeFileSync(path.join(FRAMES,label+"-"+V.key+".png"),Buffer.from(b0,"base64"));
    if(V.c.mode!=="staff"){
      r.cloths=await page.evaluate(()=>__s6d.cloths());
      await page.evaluate(()=>{ layerOn.confidence=false; CONF.none=true; }); await quick(); const c0=await shot(page);
      await page.evaluate(()=>{ layerOn.confidence=true; CONF.none=false; }); await quick();
      r.confShare=(await page.evaluate(([a,b])=>window.__aus.confShare(a,b),[b0,c0])).share; }
    const bf=path.join(FRAMES,"before-"+V.key+".png");
    if(label==="after"&&fs.existsSync(bf)) r.changed=(await page.evaluate(([x,y])=>__s5.diff(x,y,8),[fs.readFileSync(bf).toString("base64"),b0])).changed;
    r.seconds=Math.round((Date.now()-t0)/1000); res.views[V.key]=r; res.errors=page._errors.slice(0,5);
    fs.writeFileSync(OUTJ,JSON.stringify(out,null,1));
    console.log(label.padEnd(7),V.key.padEnd(26),"blk",r.dark.solidBlack,"lum",r.dark.meanLum,"AA-",r.contrast.belowAA,"min",r.contrast.min,"drop",r.layer.dropped,
      "conf",r.confShare,"smoke",r.smoke,"ms",r.worldMs,"calls",r.calls,"cloths",r.cloths?r.cloths.n+" w "+JSON.stringify(r.cloths.w)+" h "+JSON.stringify(r.cloths.h):"-","|",r.seconds,"s");
  }
  await browser.close();
}

(async()=>{
  const ONLY=opt("--only"), RUN=ONLY?views().filter(v=>ONLY.split(",").includes(v.key)):views();
  const out=RESUME&&fs.existsSync(OUTJ)?JSON.parse(fs.readFileSync(OUTJ,"utf8")):{when:new Date().toISOString(),before:{html:BEFORE,views:{},errors:[]},after:{html:AFTER,views:{},errors:[]}};
  await measure(BEFORE,RUN,"before",out);
  await measure(AFTER,RUN,"after",out);
  out.when=new Date().toISOString(); fs.writeFileSync(OUTJ,JSON.stringify(out,null,1));
  const T=[]; SHEETV.forEach(k=>["before","after"].forEach(l=>{ const f=path.join(FRAMES,l+"-"+k+".png"); if(fs.existsSync(f)) T.push({png:fs.readFileSync(f),cap:k+": "+(l==="before"?"Stage 6C":"Stage 6D")}); }));
  if(T.length){ const browser=await launch(), page=await open(browser,[1600,900],path.resolve(ROOT,AFTER));
    fs.writeFileSync(SHEET,await sheet(page,T,2,800,450,"Stage 6D: the standards from the table (right) against Stage 6C (left), as rendered")); await browser.close(); }
  const A=out.after, B=out.before, f=(x,y)=>(x===undefined||x===null?"-":x)+" / "+(y===undefined||y===null?"-":y);
  const md=["# Stage 6D: the standards from the table against the build before them\n",
    "`node tools/stage6/compare-6d.js`, run "+out.when.slice(0,10)+". Before: the Stage 6C build (`07c61c82`, commit 04f8535); after: `"+AFTER+"` (Stage 6D). 1600 x 900, software WebGL. "+
    "Solid near-black: the share of 8 x 8 blocks at least 90% near-black outside the panels (Stage 0 limit 0.0005). Map text: the lowest contrast as rendered and the number below AA. "+
    "Confidence: the marks' share against the view with no mark. Cloths: the standards whose cloth's centre lies in the free rectangle, and the cloth's width along its top edge and height along the staff, in px on screen (median / largest). "+
    "Changed: the share of the free rectangle that differs between the builds.\n",
    "| view | solid black before / after | mean luminance before / after | text min (below AA) before / after | drops before / after | confidence share before / after | smoke before / after | world pass ms before / after | draw calls before / after | cloths in view before / after | cloth width px (median, largest) before / after | cloth height px before / after | changed |",
    "|---|---|---|---|---|---|---|---|---|---|---|---|---|"];
  Object.keys(A.views).forEach(k=>{ const a=A.views[k], b=B.views[k]||{}; const cw=c=>c&&c.w?c.w.med+", "+c.w.max:"-", ch=c=>c&&c.h?c.h.med+", "+c.h.max:"-";
    md.push("| "+k+" | "+f(b.dark&&b.dark.solidBlack,a.dark.solidBlack)+" | "+f(b.dark&&b.dark.meanLum,a.dark.meanLum)+" | "+f(b.contrast&&(b.contrast.min+" ("+b.contrast.belowAA+")"),a.contrast.min+" ("+a.contrast.belowAA+")")+" | "+
      f(b.layer&&b.layer.dropped,a.layer.dropped)+" | "+f(b.confShare,a.confShare)+" | "+f(b.smoke,a.smoke)+" | "+f(b.worldMs,a.worldMs)+" | "+f(b.calls,a.calls)+" | "+
      f(b.cloths&&b.cloths.n,a.cloths&&a.cloths.n)+" | "+cw(b.cloths)+" / "+cw(a.cloths)+" | "+ch(b.cloths)+" / "+ch(a.cloths)+" | "+(a.changed===undefined?"-":a.changed)+" |"); });
  md.push("\n## Every block's standards (before: how many; after: per class, from the table)\n",
    "Rule: per drawn battalion or squadron as the colours entry counts them (sourced), or KIT's lower bound on a disputed count (lower). Height: the sourced ratio over the man to his hat's top (1.635 units), or the provisional 1.6 over the figure's top. Cloth in units (width x height): at its measure against the staff, in its proportion at the provisional drop, or generic.\n",
    "| block | before | after | class | colours entry | n | painting | rule | height | ratio / denominator | cloth (units) | finial (units) |","|---|---|---|---|---|---|---|---|---|---|---|---|");
  Object.keys(A.blocks).forEach(id=>{ const a=A.blocks[id], b=(B.blocks||{})[id]||{};
    if(!a.classes.length&&!a.none.length) return md.push("| "+id+" | "+(b.n||0)+" | 0 | - | - | - | - | - | - | - | - | - |");
    a.classes.forEach((c,i)=>md.push("| "+(i?"":id)+" | "+(i?"":(b.n||0))+" | "+(i?"":a.n)+" | "+c.dress+" | "+c.carry+" | "+c.n+" | "+c.paint+" | "+(c.rule==="lower"?"lower bound, ":"")+(c.rate<1?"1 per "+Math.round(1/c.rate):c.rate+" per")+" "+c.per+" | "+
      (c.provisional?"provisional":"sourced")+" | "+c.ratio+" / "+c.denom+" | "+c.w+" x "+c.h+" ("+c.cloth+") | "+(c.fin||"-")+" |"));
    a.none.forEach((c,i)=>md.push("| "+(a.classes.length||i?"":id)+" | "+(a.classes.length||i?"":(b.n||0))+" | "+(a.classes.length||i?"":a.n)+" | "+c.dress+" | - | 0 | - | none: "+c.why+" | - | - | - | - |")); });
  md.push("\n`compare-6d-sheet.jpg`: "+SHEETV.join(", ")+", before and after.");
  if(B.errors.length||A.errors.length) md.push("\nPage errors: before "+JSON.stringify(B.errors)+", after "+JSON.stringify(A.errors));
  fs.writeFileSync(OUTM,md.join("\n")+"\n");
  console.log("written",OUTJ,OUTM,SHEET);
})().catch(e=>{ console.error(e); process.exit(2); });
