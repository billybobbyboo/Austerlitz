#!/usr/bin/env node
/* Stage 5G (docs/STAGE5_SPEC.md section I, 5G; owner decision 95): the day-track inset, measured on the built page. It changes no source
   file. node tools/stage5/report-5g.js [--json out.json] [--md out.md] [--from out.json] [--sheet out.jpg]

   1. Per leaf formation (and IV Corps, an aggregate): anchors and the marks drawn for them (two anchors closer than DT.MERGE px are one
      mark), the inset's px per km and its scale bar, the shortest leg in inset px, the ordered routes drawn.
   2. The full dossier of Saint-Hilaire's division at 1600 x 900 and 1280 x 720 (docked) and 1024 x 768 (the card): the inset's rendered
      size, the dossier's height with it and without it (the inset's section taken out), whether it scrolls. */
const fs=require("fs");
const {launch,open,settle,sheet,CASES}=require("../stage2/page.js");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const PER=function(){ setClock(590,{instant:true,force:true,camera:false}); var out=[];
  Object.keys(units).filter(function(id){ return !!FORMATIONS[id].track; }).concat(["c_iv"]).forEach(function(id){ var M=dayTrackModel(id); if(!M) return;
    var nA=0, marks=0, shortest=1e9, routes=0;
    M.leaves.forEach(function(L){ marks+=L.anchors.length; L.anchors.forEach(function(g){ nA+=g.members.length; }); routes+=L.routes.length;
      L.legs.forEach(function(lg){ var d=0; for(var i=1;i<lg.pts.length;i++) d+=Math.hypot(lg.pts[i][0]-lg.pts[i-1][0],lg.pts[i][1]-lg.pts[i-1][1]); if(d>0) shortest=Math.min(shortest,d); }); });
    out.push({id:id,name:FORMATIONS[id].name,leaves:M.leaves.length,anchors:nA,marks:marks,pxPerKm:+(M.frame.s*GEOREF.UNITS_PER_KM).toFixed(1),bar:M.bar.km,
      shortestLegPx:shortest===1e9?null:+shortest.toFixed(1),routes:routes}); });
  return out; };
const DOSSIER=function(){ select("f","sthilaire"); dossierExpanded=true; paintDrawer(); setClock(590,{instant:true,camera:false});
  var d=document.querySelector(".drawer .dossier")||document.querySelector(".dossier"), fig=document.querySelector(".daytrack"), sec=fig?fig.closest(".sect"):null;
  var sc=d?(d.closest(".drawer-body")||d.parentElement):null, h=d?d.scrollHeight:null, fr=fig?fig.getBoundingClientRect():null, sh=sec?sec.getBoundingClientRect().height:0;
  var cs=sec?getComputedStyle(sec):null, mt=cs?parseFloat(cs.marginTop)+parseFloat(cs.marginBottom):0;
  return {docked:document.body.classList.contains("docked"),inset:fr?[Math.round(fr.width),Math.round(fr.height)]:null,dossierH:h,withoutInset:h===null?null:Math.round(h-sh-mt),
    viewH:sc?sc.clientHeight:null,scrolls:sc?sc.scrollHeight>sc.clientHeight+1:null}; };
(async()=>{
  const FROM=opt("--from");
  const out=FROM?JSON.parse(fs.readFileSync(FROM,"utf8")):{html:process.env.AUSTERLITZ_HTML||"austerlitz-command-map.html",when:new Date().toISOString(),dossier:{}};
  if(!FROM){
    const browser=await launch(), tiles=[], sel=CASES.find(c=>c.name==="selected-formation");
    for(const vp of [[1600,900],[1280,720],[1024,768]]){
      const page=await open(browser,vp); await page.evaluate(s=>window.__aus.apply(s),Object.assign({},sel,{viewport:vp})); await settle(page);
      if(vp[0]===1600){ out.formations=await page.evaluate(PER); out.formations.forEach(r=>console.log(JSON.stringify(r)));
        for(const id of ["sthilaire","friant","lich","kamensky","heightguns","c_iv"]){
          const box=await page.evaluate(id=>{ select("f",id); dossierExpanded=true; paintDrawer(); const f=document.querySelector(".daytrack"); if(!f) return null; f.scrollIntoView(); const q=f.getBoundingClientRect(); return [q.left,q.top,q.width,q.height]; },id);
          await settle(page); if(box) tiles.push({png:await page.screenshot({timeout:240000,clip:{x:Math.max(0,box[0]-6),y:Math.max(0,box[1]-26),width:box[2]+12,height:box[3]+32}}),cap:id}); } }
      out.dossier[vp.join("x")]=await page.evaluate(DOSSIER); console.log("dossier",vp.join("x"),JSON.stringify(out.dossier[vp.join("x")]));
      if(page._errors.length) console.log("page errors:",page._errors.slice(0,5));
      if(vp[0]===1024&&opt("--sheet")) fs.writeFileSync(opt("--sheet"),await sheet(page,tiles,3,300,300,"Stage 5G: the day-track inset ("+out.html+")",true));
      await page.close(); }
    if(opt("--json")) fs.writeFileSync(opt("--json"),JSON.stringify(out,null,1));
    await browser.close();
  }
  if(opt("--md")){
    const md=["# Stage 5G: the day-track inset ("+out.html+")\n","`node tools/stage5/report-5g.js`, at 09:50.\n",
      "| formation | leaves | anchors / marks | px per km | scale bar | shortest leg (inset px) | ordered routes |","|---|---|---|---|---|---|---|"];
    out.formations.forEach(r=>md.push("| "+r.name+" | "+r.leaves+" | "+r.anchors+" / "+r.marks+" | "+r.pxPerKm+" | "+r.bar+" km | "+(r.shortestLegPx===null?"-":r.shortestLegPx)+" | "+r.routes+" |"));
    md.push("\n## Saint-Hilaire's full dossier\n","| size | docked | the inset as rendered (px) | the dossier's height with it / without it (px) | its panel's height | scrolls |","|---|---|---|---|---|---|");
    Object.keys(out.dossier).forEach(k=>{ const d=out.dossier[k]; md.push("| "+k+" | "+d.docked+" | "+(d.inset?d.inset.join(" x "):"-")+" | "+d.dossierH+" / "+d.withoutInset+" | "+d.viewH+" | "+d.scrolls+" |"); });
    fs.writeFileSync(opt("--md"),md.join("\n")+"\n"); console.log(md.join("\n"));
  }
})().catch(e=>{ console.error(e); process.exit(2); });
