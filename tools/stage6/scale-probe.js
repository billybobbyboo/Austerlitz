#!/usr/bin/env node
/* Stage 6 Part A (docs/STAGE6_SPEC.md section 3): what a figure, its coat, a facing and its headgear are on screen, in px, in the harness
   views, read from the running scene by projecting each figure's own parts (no render is changed; no source file is changed).
   node tools/stage6/scale-probe.js [--json f] [--md f] [--only views]

   For every figure on foot (the kit's infantry coat mesh: line, skirmishers, gun crews) and every rider (the rider coat mesh: cavalry,
   officers, escorts) whose foot projects inside the free rectangle (outside every panel) and in front of the eye:
   - the figure: foot to hat top (1.635 units on foot; the rider 1.05-2.015 above the ground), its length on screen;
   - the headgear: today's black cylinder, 0.27 units tall, 0.26 across: its height and width on screen;
   - the coat: the torso box, 0.36 x 0.56 units on foot (0.32 x 0.50 for the rider): its width and height on screen;
   - a facing: a collar, lapel or cuff at about 4% of a man's height (7 cm of 1.75 m; on the kit's 1.635-unit man 0.065 units): its size on
     screen, the figure's px times 0.065 / 1.635 (an inference from the proportion, not a drawn part);
   - the standards: each cloth's projected bounding box (GEO.flag 2.4 x 1.4 times the block's standard scale).
   Not occlusion-tested: a figure behind a hill is counted at the size it would have (appearance-probe.js measures what is rendered).
   Reported per view: the distribution (median, 90th percentile, largest) and the counts at or above 2, 4, 8, 16, 32 and 64 px, per kind
   and per formation. */
const fs=require("fs"), path=require("path");
const L=require("./lib.js");
const {launch,open,HELPERS,inject,views,applyView,shot,sheet,EVID6}=L;
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const OUTJ=opt("--json")||path.join(EVID6,"scale-probe.json"), OUTM=opt("--md")||path.join(EVID6,"scale-probe.md"), SHEET=opt("--sheet");

const SCALE=function(){
  var K=figKit(), M=new THREE.Matrix4(), W4=new THREE.Matrix4(), v=new THREE.Vector3(), a=new THREE.Vector3(), b=new THREE.Vector3();
  var fr=(mode!=="staff")?landFreeRect():MAPCAM.freeRect(null,landPanels()), R=__s5.panels(), VW=renderer.domElement.clientWidth||innerWidth, VH=viewH();
  camera.updateMatrixWorld(true);
  function scr(p){ v.copy(p).project(camera); return [(v.x*0.5+0.5)*VW,(-v.y*0.5+0.5)*VH,v.z]; }
  function inFree(s){ if(s[2]>1||s[2]<-1||s[0]<fr[0]||s[0]>fr[2]||s[1]<fr[1]||s[1]>fr[3]) return false;
    for(var k=0;k<R.length;k++){ var q=R[k]; if(s[0]>=q[0]&&s[0]<q[2]&&s[1]>=q[1]&&s[1]<q[3]) return false; } return true; }
  function len(m,p0,p1){ a.set(p0[0],p0[1],p0[2]).applyMatrix4(m); b.set(p1[0],p1[1],p1[2]).applyMatrix4(m); var s0=scr(a), s1=scr(b); return Math.hypot(s1[0]-s0[0],s1[1]-s0[1]); }
  /* parts in the figure's own frame (figKit): on foot, the man to his hat top 1.635; the hat 1.365-1.635, 0.26 across; the torso 0.36 x 0.56 at 0.62-1.18.
     Mounted: the ground to the hat top 2.015; the hat 1.745-2.015; the coat 0.32 x 0.50 at 1.05-1.55 */
  var P={foot:{top:1.635,hat:[1.365,1.635],hatW:0.13,torso:[0.62,1.18],torsoW:0.18},mounted:{top:2.015,hat:[1.745,2.015],hatW:0.13,torso:[1.05,1.55],torsoW:0.16}};
  var out={figs:{foot:[],mounted:[]},per:{},flags:[]};
  Object.keys(units).forEach(function(id){ var r=units[id], blk=r.block; if(!blk||!__aus.effVisible(blk)) return; blk.updateMatrixWorld(true);
    var per={foot:[],mounted:[],flags:[]};
    blk.traverse(function(o){ if(!o.isInstancedMesh||!__aus.effVisible(o)) return;
      var kind=o.geometry===K.infCoat?"foot":o.geometry===K.rider?"mounted":o===blk.userData.flags?"flag":null; if(!kind) return;
      for(var i=0;i<o.count;i++){ o.getMatrixAt(i,M); W4.multiplyMatrices(o.matrixWorld,M);
        if(kind==="flag"){ var g=GEO.flag.parameters, c=[[-g.width/2,-g.height/2],[g.width/2,-g.height/2],[g.width/2,g.height/2],[-g.width/2,g.height/2]].map(function(q){ a.set(q[0],q[1],0).applyMatrix4(W4); return scr(a); });
          var mid=[(c[0][0]+c[2][0])/2,(c[0][1]+c[2][1])/2,c[0][2]]; if(!inFree(mid)) continue;
          var xs=c.map(function(q){ return q[0]; }), ys=c.map(function(q){ return q[1]; });
          var e={id:id,w:+(Math.max.apply(null,xs)-Math.min.apply(null,xs)).toFixed(2),h:+(Math.max.apply(null,ys)-Math.min.apply(null,ys)).toFixed(2)};
          /* the cloth's own extent on screen: its width edge and its height edge, whatever the view's angle */
          e.edgeW=+Math.hypot(c[1][0]-c[0][0],c[1][1]-c[0][1]).toFixed(2); e.edgeH=+Math.hypot(c[3][0]-c[0][0],c[3][1]-c[0][1]).toFixed(2);
          out.flags.push(e); per.flags.push(e); continue; }
        a.set(0,0,0).applyMatrix4(W4); var s=scr(a); if(!inFree(s)) continue;
        var p=P[kind], fig=len(W4,[0,0,0],[0,p.top,0]), hat=len(W4,[0,p.hat[0],0],[0,p.hat[1],0]),
            hatW=Math.max(len(W4,[-p.hatW,(p.hat[0]+p.hat[1])/2,0],[p.hatW,(p.hat[0]+p.hat[1])/2,0]),len(W4,[0,(p.hat[0]+p.hat[1])/2,-p.hatW],[0,(p.hat[0]+p.hat[1])/2,p.hatW])),
            tH=len(W4,[0,p.torso[0],0],[0,p.torso[1],0]), tW=Math.max(len(W4,[-p.torsoW,(p.torso[0]+p.torso[1])/2,0],[p.torsoW,(p.torso[0]+p.torso[1])/2,0]),len(W4,[0,(p.torso[0]+p.torso[1])/2,-0.11],[0,(p.torso[0]+p.torso[1])/2,0.11]));
        var row=[fig,hat,hatW,tW,tH,fig*0.065/1.635];
        out.figs[kind].push(row); per[kind].push(row); } });
    if(per.foot.length||per.mounted.length||per.flags.length) out.per[id]=per; });
  function stats(rows,j){ var x=rows.map(function(r){ return r[j]; }).sort(function(p,q){ return p-q; }); if(!x.length) return null;
    function q(f){ return +x[Math.min(x.length-1,Math.floor(f*x.length))].toFixed(2); }
    var ge={}; [1,2,4,8,16,32,64].forEach(function(t){ ge[t]=x.filter(function(v2){ return v2>=t; }).length; });
    return {n:x.length,median:q(0.5),p90:q(0.9),max:+x[x.length-1].toFixed(2),ge:ge}; }
  var COLS=["figure","hat","hatWidth","coatWidth","coatHeight","facing"], res={figures:{},perFormation:{},flags:null};
  ["foot","mounted"].forEach(function(k){ var r={}; COLS.forEach(function(c,j){ r[c]=stats(out.figs[k],j); }); res.figures[k]=r; });
  Object.keys(out.per).forEach(function(id){ var pf=out.per[id], all=pf.foot.concat(pf.mounted);
    res.perFormation[id]={n:all.length,figure:stats(all,0),hat:stats(all,1),coatWidth:stats(all,3),facing:stats(all,5),
      flags:pf.flags.length?{n:pf.flags.length,edgeW:Math.max.apply(null,pf.flags.map(function(f){ return f.edgeW; })),edgeH:Math.max.apply(null,pf.flags.map(function(f){ return f.edgeH; }))}:null}; });
  res.flags=out.flags.length?{n:out.flags.length,edgeW:stats(out.flags.map(function(f){ return [f.edgeW]; }),0),edgeH:stats(out.flags.map(function(f){ return [f.edgeH]; }),0)}:null;
  res.factor=DISPLAY.factor; res.mode=mode; res.camDist=+camera.position.distanceTo(orbitTarget).toFixed(1);
  return res;
};

(async()=>{
  const browser=await launch(), page=await open(browser,[1600,900]), out={html:process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html",when:new Date().toISOString(),views:{}}, tiles=[];
  await inject(page,HELPERS);
  const ONLY=opt("--only"), RUN=ONLY?views().filter(v=>ONLY.split(",").includes(v.key)):views();
  for(const V of RUN){
    await applyView(page,V);
    const r=await page.evaluate(SCALE); r.clock=V.c.t; out.views[V.key]=r;
    const F=r.figures.foot.figure, Mo=r.figures.mounted.figure;
    console.log(V.key.padEnd(26),"factor",r.factor,"foot",F?F.n+" med "+F.median+" p90 "+F.p90+" max "+F.max:"-","| mounted",Mo?Mo.n+" med "+Mo.median+" max "+Mo.max:"-",
      "| hat med",r.figures.foot.hat?r.figures.foot.hat.median:"-","| facing max",r.figures.foot.facing?r.figures.foot.facing.max:"-","| flags",r.flags?r.flags.n+" w med "+r.flags.edgeW.median+" max "+r.flags.edgeW.max:"-");
    if(SHEET&&["pratzen-orbit-min","close-sokolnitz","pratzen-low","eye-zuran","selected-formation","overview-field"].includes(V.key)) tiles.push({png:Buffer.from(await shot(page),"base64"),cap:V.key});
    fs.writeFileSync(OUTJ,JSON.stringify(out,null,1));
  }
  if(SHEET&&tiles.length) fs.writeFileSync(SHEET,await sheet(page,tiles,3,640,360,"Stage 6 Part A: the harness views the scale probe measures"));
  if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
  await browser.close();
  /* the markdown */
  const md=["# Stage 6 Part A: figures on screen, in px ("+out.html+")\n","`node tools/stage6/scale-probe.js`. Every figure whose foot lies in the free rectangle, in front of the eye; not occlusion-tested. "+
    "Median / 90th percentile / largest, px; n figures. A facing is 4% of a man's height (inference from the proportion; not a drawn part).\n",
    "| view | factor | on foot: n | figure | headgear height | headgear width | coat width | facing | mounted: n | figure | standards: n | cloth width | cloth height |","|---|---|---|---|---|---|---|---|---|---|---|---|---|"];
  const f3=s=>s?s.median+" / "+s.p90+" / "+s.max:"-";
  Object.keys(out.views).forEach(k=>{ const r=out.views[k], F=r.figures.foot, Mo=r.figures.mounted;
    md.push("| "+k+" | "+r.factor+" | "+(F.figure?F.figure.n:0)+" | "+f3(F.figure)+" | "+f3(F.hat)+" | "+f3(F.hatWidth)+" | "+f3(F.coatWidth)+" | "+f3(F.facing)+" | "+(Mo.figure?Mo.figure.n:0)+" | "+f3(Mo.figure)+" | "+
      (r.flags?r.flags.n:0)+" | "+(r.flags?f3(r.flags.edgeW):"-")+" | "+(r.flags?f3(r.flags.edgeH):"-")+" |"); });
  md.push("\n## Figures at or above a size (on foot), per view\n","| view | n | figure >= 8 px | >= 16 | >= 32 | >= 64 | headgear >= 2 px | >= 4 | >= 8 | facing >= 1 px | >= 2 | >= 4 |","|---|---|---|---|---|---|---|---|---|---|---|---|");
  Object.keys(out.views).forEach(k=>{ const F=out.views[k].figures.foot; if(!F.figure) return md.push("| "+k+" | 0 | | | | | | | | | | |");
    md.push("| "+k+" | "+F.figure.n+" | "+F.figure.ge[8]+" | "+F.figure.ge[16]+" | "+F.figure.ge[32]+" | "+F.figure.ge[64]+" | "+F.hat.ge[2]+" | "+F.hat.ge[4]+" | "+F.hat.ge[8]+" | "+F.facing.ge[1]+" | "+F.facing.ge[2]+" | "+F.facing.ge[4]+" |"); });
  md.push("\n## Per formation (median figure px; the largest standard's cloth, px)\n");
  Object.keys(out.views).forEach(k=>{ const P=out.views[k].perFormation; const ids=Object.keys(P); if(!ids.length) return;
    md.push("- **"+k+"**: "+ids.map(id=>id+" "+(P[id].figure?P[id].figure.median:"-")+(P[id].flags?" (cloth "+P[id].flags.edgeW.toFixed(1)+" x "+P[id].flags.edgeH.toFixed(1)+")":"")).join("; ")); });
  fs.writeFileSync(OUTM,md.join("\n")+"\n");
})().catch(e=>{ console.error(e); process.exit(2); });
