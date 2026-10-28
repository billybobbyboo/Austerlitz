#!/usr/bin/env node
/* Stage 8, implementation PR 8F's prerequisite 2 (the audit of 8E: the ground contact; docs/STAGE8_SPEC.md section 18): the gait's feet and
   hooves on the drawn ground, measured on two builds (8E's with prerequisite 1, the "before"; the fix, the "after"), each on a page opened as the
   harness opens it. For every formation drawn with a gait at three clocks (09:05, 10:40, 13:50), at 4x and 10.33x (at 1x the formations are
   footprints), up to 40 instances of every animated mesh (the men's fixed parts, the horses), at eight phases of full swing, in each way a figure
   is drawn (the simple kit and the rich; on the build of the profile option, docs/stage8-evidence/8f/contact/profile-option.patch, which has
   GAIT.slopeModel, the simple kit with the chords, the rich kit with the chords and the rich kit with each foot's profile), each instance against itself at rest (the same instance and level, its own slopes as the
   build's layoutFigs writes them, the build's own animAt, the hook's arithmetic): the least, over its points, of a point's offset from the drawn
   ground (groundY) posed less the same point's at rest. Two sets of points:
   - "edges": the hook's own heel and toe on each foot's line (and each hoof's fore and aft edges on its line), as the kits draw them (x 0.085
     either side, the hooves' 0.13): the rich kit's on both levels on 8E's build, each kit's own on the fix's,
   - "drawn": the soles the kit draws (the leg and foot parts' and the hooves' vertices within 0.03 of the soles' plane: their corners),
   with each case beyond 0.03 units (4x; in proportion to the relief at 10.33x) the instance, the clock, the phase, the way, its slopes and its
   resting seat (the legacy offset of the upright figure on a slope: reported, not the gait's). The pixels: each way's worst at the largest size
   it is drawn at (a man KLOD.IN px tall on the simple kit; the rich kit without limit, so reported through the harness's closest figure view,
   inf-close: 24 units at 1600 x 900; on the profile option's build the rich kit with the chords up to its GAIT.PROFILE.IN), and every error through a camera 8 units off.
   Then each instance on the two builds against itself (its worst over the phases): how many worse, better, newly beyond and cleared, the most worse.
   Stills: the worst instance of the before build's rich kit at its clock, close (8 units), both builds.
   node tools/stage8/contact-8f.js --before 8e.html --after fix.html [--out dir] [--no-stills]
   Writes <out>/contact.json and <out>/contact/*.jpg; measurement code only. */
"use strict";
const fs=require("fs"), path=require("path");
const L=require("./lib.js");
const argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; };
const BEFORE=path.resolve(opt("--before")), AFTER=path.resolve(opt("--after")||path.join(L.ROOT,"austerlitz-command-map.html")), OUT=path.resolve(opt("--out")||path.join(L.EVID8,"8f"));
const md5=f=>require("crypto").createHash("md5").update(fs.readFileSync(f)).digest("hex");
const MEASURE=function(){
  closeFirst(null);
  var V=new THREE.Vector3(), Mi=new THREE.Matrix4(), Mw=new THREE.Matrix4(), o=[0,0,0], out={ways:{}}, keepF=DISPLAY.factor, M=ANIM.MAN, H=ANIM.HORSE, fix=M.HEEL0!==undefined, lev="slopeModel" in GAIT;
  var WAYS=lev?[["simple/chord",0,"chord"],["rich/chord",1,"chord"],["rich/full",1,"full"]]:[["simple",0,null],["rich",1,null]];
  var f=camera.fov*Math.PI/180, per24=innerHeight/2/Math.tan(f/2)/24, per8=innerHeight/2/Math.tan(f/2)/8;
  function largestPx(way,sc){ var lim=way==="simple/chord"||way==="simple"?KLOD.IN:(way==="rich/chord"?GAIT.PROFILE.IN:null); return lim?lim/(KLOD.H*(sc||1)):per24; }   /* px a unit */
  out.px={fov:camera.fov, height:innerHeight, perUnitAt24:+per24.toFixed(2), perUnitAt8:+per8.toFixed(2), richThreshold:KLOD.IN, profileThreshold:lev?GAIT.PROFILE.IN:null};
  function shown(){ var Ls=[]; Object.keys(units).forEach(function(id){ var r=units[id]; if(r.block&&r.block.visible&&r.block.userData.gait) Ls.push(id); }); return Ls; }
  var cache=new Map();
  function drawn(g,horse){ if(cache.has(g)) return cache.get(g); var P=g.attributes.position, K=g.attributes.aPart, seen={}, res=[];
    for(var i=0;i<P.count;i++){ var k=Math.round(K.getX(i)); if(horse?(k<5||k>8):!(k===1||k===2||k===13||k===14)) continue; if(P.getY(i)>0.03) continue;
      var key=k+","+P.getX(i).toFixed(4)+","+P.getY(i).toFixed(4)+","+P.getZ(i).toFixed(4); if(!seen[key]){ seen[key]=1; res.push([k,P.getX(i),P.getY(i),P.getZ(i)]); } }
    cache.set(g,res); return res; }
  function edges(horse,rich){ var res=[], FX=0.085, LX=0.13;   /* the feet's and the hooves' lines as the kits draw them (8E's check (h) took the same) */
    if(horse) [[5,-LX,H.ZF],[6,LX,H.ZF],[7,-LX,H.ZH],[8,LX,H.ZH]].forEach(function(q){ [-H.HZ,H.HZ].forEach(function(e){ res.push([q[0],q[1],H.HIP-H.L,q[2]+e]); }); });
    else [[rich?13:1,-FX],[rich?14:2,FX]].forEach(function(q){ [rich||!fix?M.HEEL:M.HEEL0,rich||!fix?M.TOE:M.TOE0].forEach(function(z){ res.push([q[0],q[1],M.FOOT,z]); }); });
    return res; }
  function offs(pts,amp,ph,sl,knee,trot){ var r=[]; for(var j=0;j<pts.length;j++){ var q=pts[j]; animAt(q[0],q[1],q[2],q[3],ph,amp,o,{slope:sl,knee:knee,trot:trot}); V.set(o[0],o[1],o[2]).applyMatrix4(Mw); r.push(V.y-groundY(V.x,V.z)); } return r; }
  var st=function(a,tol){ a.sort(function(x,y){ return x-y; }); var n=a.length; return {poses:n, median:+(a[n>>1]||0).toFixed(4), p99:+(a[Math.floor(0.99*n)]||0).toFixed(4), worst:+(a[n-1]||0).toFixed(4), beyond:a.filter(function(v){ return v>tol; }).length}; };
  try{
    DISPLAY.settings.forEach(function(fct){ setDisplayFactor(fct); if(isTrueScale()) return; var tol=0.03*fct/4, R={tol:tol}, F=fmtFactor(fct);
      WAYS.forEach(function(W0){ R[W0[0]]={}; ["edges","drawn"].forEach(function(w){ R[W0[0]][w]={}; ["men","horses"].forEach(function(k){ R[W0[0]][w][k]={a:[],px:[],worst:[],rest:0,inst:{}}; }); }); });
      [545,640,830].forEach(function(t){ setPresentation("watch"); setClock(t,{instant:true,force:true,camera:false}); AUSTERLITZ_DEBUG.settle(24,true);
        shown().forEach(function(id){ var bk=units[id].block, G=bk.userData.gait, bu=bk.userData, sc=bk.scale.x||1;
          WAYS.forEach(function(W0){ if(lev) GAIT.slopeModel=W0[2]; bu.layout(bu.sw,bu.sd,true); bk.updateMatrixWorld(true);
            G.meshes.forEach(function(m){ var k=m.userData.gaitKind, part=m.userData.kit&&m.userData.kit.part; if(!(k==="man"&&part==="fixed")&&!(k!=="gear"&&part==="horse")) return;
              for(var a=m;a;a=a.parent) if(!a.visible) return;
              var horse=part==="horse", U=m.userData.anim, ph=m.geometry.attributes.aPh, SA=m.geometry.attributes.aSl, SB=m.geometry.attributes.aSl2, step=Math.max(1,Math.floor(m.count/40));
              [["drawn",drawn(W0[1]?m.userData.lod.r:m.userData.lod.s,horse)],["edges",edges(horse,W0[1]===1)]].forEach(function(S){ var bin=R[W0[0]][S[0]][horse?"horses":"men"], pu=largestPx(W0[0],sc);
                for(var i=0;i<m.count;i+=step){ m.getMatrixAt(i,Mi); Mw.multiplyMatrices(m.matrixWorld,Mi);
                  var sl=SB?Array.prototype.slice.call(SA.array,i*4,i*4+4).concat(Array.prototype.slice.call(SB.array,i*4,i*4+4)):[SA.array[i*2],SA.array[i*2+1]];
                  var r0=offs(S[1],0,0,sl,W0[1],U.uAnimTrot.value), rs=0; r0.forEach(function(v){ rs=Math.max(rs,Math.abs(v)); }); bin.rest=Math.max(bin.rest,rs);
                  for(var pi=0;pi<8;pi++){ var phv=pi/8*2*Math.PI+2*Math.PI*(ph?ph.array[i]:0), pp=offs(S[1],1,phv,sl,W0[1],U.uAnimTrot.value), e=1e9; for(var j=0;j<pp.length;j++) e=Math.min(e,pp[j]-r0[j]);
                    bin.a.push(Math.abs(e)); bin.px.push(Math.abs(e)*pu); var ik=id+"#"+i+"@"+fmtClock(t); if(!(ik in bin.inst)||Math.abs(e)>Math.abs(bin.inst[ik])) bin.inst[ik]=+e.toFixed(4); if(Math.abs(e)>tol) bin.worst.push({id:id, i:i, clock:fmtClock(t), phase:+phv.toFixed(2), e:+e.toFixed(4), px:+(Math.abs(e)*pu).toFixed(2), px8:+(Math.abs(e)*per8).toFixed(2), restSeat:+rs.toFixed(3),
                      at:[+Mw.elements[12].toFixed(2),+Mw.elements[14].toFixed(2)], scale:+sc.toFixed(3), slopes:sl.map(function(v){ return +(+v).toFixed(3); })}); } } }); }); }); }); });
      WAYS.forEach(function(W0){ ["edges","drawn"].forEach(function(w){ ["men","horses"].forEach(function(k){ var b=R[W0[0]][w][k], s1=st(b.a,tol), s2=st(b.px,1e9);
        R[W0[0]][w][k]=Object.assign(s1,{worstPx:s2.worst, p99Px:s2.p99, legacySeat:+b.rest.toFixed(3), inst:b.inst, cases:b.worst.sort(function(x,y){ return Math.abs(y.e)-Math.abs(x.e); }).slice(0,12)}); }); }); });
      out.ways[F]=R; });
  } finally { if(lev) GAIT.slopeModel=null; setDisplayFactor(keepF); }
  return out; };
/* a close still of an instance: the eye 8 units from it, a little above, the clock its own */
const AIM=function(a){ setPresentation("watch"); setDisplayFactor(a.f==="4"?4:GEOREF.EXAG); setClock(a.t,{instant:true,force:true,camera:false}); AUSTERLITZ_DEBUG.settle(24,true);
  var x=a.at[0], z=a.at[1], y=groundY(x,z), d=new THREE.Vector3(0.75,0.32,0.58).normalize().multiplyScalar(a.r);
  tween=null; camArc=null; freeCam=true; curVantage=null; landCam.position.set(x+d.x,y+d.y,z+d.z); orbitTarget.set(x,y+0.5,z); landCam.lookAt(orbitTarget); clampCamera(); syncViewOffset(true);
  AUSTERLITZ_DEBUG.settle(10,true); return {clock:fmtClock(clock)}; };
(async()=>{
  fs.mkdirSync(path.join(OUT,"contact"),{recursive:true});
  const browser=await L.launch(), res={chromium:browser.version(), builds:{}};
  for(const [lab,html] of [["before",BEFORE],["after",AFTER]]){
    process.env.AUSTERLITZ_HTML=html; const page=await L.open(browser,[1600,900],{});
    const r=await page.evaluate(MEASURE); res.builds[lab]=Object.assign({file:path.basename(html), md5:md5(html)},r); await page.close();
    Object.keys(r.ways).forEach(F=>Object.keys(r.ways[F]).filter(w=>w!=="tol").forEach(way=>["edges","drawn"].forEach(w=>["men","horses"].forEach(k=>{ const s=r.ways[F][way][w][k];
      console.log(lab.padEnd(7)+F.padEnd(6)+way.padEnd(13)+w.padEnd(6)+k.padEnd(7)+" poses "+s.poses+", half within "+s.median+", 99 in 100 "+s.p99+", worst "+s.worst+" ("+(s.cases[0]?s.cases[0].id+" #"+s.cases[0].i+" "+s.cases[0].clock:"")+"), beyond "+s.beyond+" (tol "+r.ways[F].tol.toFixed(4)+"); px at its largest: worst "+s.worstPx.toFixed(2)+", 99 in 100 "+s.p99Px.toFixed(2)+"; the legacy seat "+s.legacySeat); })))); }
  /* each instance against itself on the two builds: its worst offset over the eight phases, the same instance, clock, level and points */
  res.perInstance={}; const B0=res.builds.before, A0=res.builds.after;
  Object.keys(A0.ways).forEach(F=>{ res.perInstance[F]={}; Object.keys(A0.ways[F]).filter(w=>w!=="tol").forEach(way=>{ const bw=B0.ways[F]&&(B0.ways[F][way]||B0.ways[F][way.split("/")[0]]); if(!bw) return;
    const tol=A0.ways[F].tol; res.perInstance[F][way]={};
    ["edges","drawn"].forEach(w=>{ res.perInstance[F][way][w]={}; ["men","horses"].forEach(k=>{ const a=A0.ways[F][way][w][k].inst, b=bw[w][k].inst, keys=Object.keys(a).filter(q=>q in b);
      const d=keys.map(q=>({at:q, before:b[q], after:a[q], change:+(Math.abs(a[q])-Math.abs(b[q])).toFixed(4)}));
      res.perInstance[F][way][w][k]={instances:keys.length, tol:+tol.toFixed(4), worse:d.filter(x=>x.change>0.001).length, worseByTolThird:d.filter(x=>x.change>tol/3).length,
        better:d.filter(x=>x.change<-0.001).length, beyondBefore:d.filter(x=>Math.abs(x.before)>tol).length, beyondAfter:d.filter(x=>Math.abs(x.after)>tol).length,
        newlyBeyond:d.filter(x=>Math.abs(x.after)>tol&&Math.abs(x.before)<=tol).length, cleared:d.filter(x=>Math.abs(x.before)>tol&&Math.abs(x.after)<=tol).length,
        mostWorse:d.filter(x=>x.change>0.001).sort((x,y)=>y.change-x.change).slice(0,8), mostBetter:d.sort((x,y)=>x.change-y.change).slice(0,4)}; }); }); }); });
  Object.values(res.builds).forEach(r=>Object.values(r.ways).forEach(R=>Object.keys(R).filter(w=>w!=="tol").forEach(way=>["edges","drawn"].forEach(w=>["men","horses"].forEach(k=>{ delete R[way][w][k].inst; })))));
  Object.keys(res.perInstance).forEach(F=>Object.keys(res.perInstance[F]).forEach(way=>["edges","drawn"].forEach(w=>["men","horses"].forEach(k=>{ const c=res.perInstance[F][way][w][k];
    console.log("each instance "+F.padEnd(6)+way.padEnd(13)+w.padEnd(6)+k.padEnd(7)+" "+c.instances+" instances: beyond tol "+c.beyondBefore+" before, "+c.beyondAfter+" after ("+c.newlyBeyond+" newly, "+c.cleared+" cleared); worse by over 0.001 "+c.worse+" (by over a third of tol "+c.worseByTolThird+"), better "+c.better+
      (c.mostWorse.length?"; the most worse "+c.mostWorse.slice(0,3).map(x=>x.at+" "+x.before+" -> "+x.after).join(", "):"")); }))));
  fs.writeFileSync(path.join(OUT,"contact.json"),JSON.stringify(res,null,1));
  if(!argv.includes("--no-stills")){
    /* the worst drawn case of the men on the before build's rich kit at 4x and at 10.33x, close, on both builds */
    for(const F of ["4","10.33"]){ const c=res.builds.before.ways[F]&&res.builds.before.ways[F].rich&&res.builds.before.ways[F].rich.drawn.men.cases[0]; if(!c) continue;
      const t=(+c.clock.slice(0,2))*60+(+c.clock.slice(3,5));
      for(const [lab,html] of [["before",BEFORE],["after",AFTER]]){
        process.env.AUSTERLITZ_HTML=html; const page=await L.open(browser,[1280,720],{});
        await page.evaluate(AIM,{f:F, t:t, at:c.at, r:8});
        await L.jpeg(page,path.join(OUT,"contact",c.id+"-"+F+"x-"+lab+".jpg"),88); await page.close(); } } }
  await browser.close();
  console.log("written "+path.relative(L.ROOT,path.join(OUT,"contact.json")));
})().catch(e=>{ console.error(e); process.exit(1); });
