#!/usr/bin/env node
/* Stage 2 Part A, section C (owner decision 22): bind every OVERLAYS arrow to the formation tracks it
   describes. Reads the live data; changes nothing.
   node tools/stage2/arrow-binding.js [--md out.md] [--json out.json]

   For an arrow shown in phase ph (it is drawn while the clock is in [PHASES[ph].t0, PHASES[ph].t1)):
   - named: the formations its label names (names, commanders' surnames, "I Column" = First Column ...).
   - for each candidate formation of the arrow's side, its movement across the phase: the position at
     t0 and at t1 (posAtClock, the model's own interpolation; a corps without a track is the centroid of
     its tracked leaves), and the leg(s) in motion inside the window.
   - endpoint distances in metres: arrow start to position at t0, arrow end to position at t1; the
     heading difference between the arrow and that movement.
   - also the best-fitting single leg in any phase (diagnostic: an arrow drawn a phase before or after
     the leg that moves).
   Verdict (tolerance TOL_M at both ends, heading within TOL_DEG):
     interpretive: kind "axis" (an ordered or intended route), a label naming a group (two or more
                   formations, or a corps without a track of its own), or naming no formation;
     derivable:    exactly one named formation, and its movement across the phase matches within tolerance;
     mismatch:     one named formation, and its movement across the phase does not match (data question).
   Two readings of "the leg across that phase" are scored, because the model's convention decides it:
   an anchor track[ph] is where the formation stands at PHASES[ph].t0 (legWindow: the leg into anchor ph
   runs from the previous anchor's phase start to PHASES[ph].t0). So
     "across": the movement while the arrow is on screen, position at t0 to position at t1 (the leg into
               anchor ph+1);
     "into":   the leg that arrives at anchor ph, completed as the phase begins (the movement the phase's
               own track entry describes).
   The verdict is given for both.
   Since the chronology data task (owner decisions 40-46) an anchor may be reached after its phase opens, or its move may
   begin later in the phase (tm.at, tm.dep; legWindow gives each leg's real window), so a third reading is scored:
     "exec":   the leg the model executes during the phase: every leg whose window overlaps [t0, t1) by a minute or more
               is a candidate, and the arrow is derivable on it if its endpoints and heading match that leg one-to-one.
   This is the rule recorded for 2C (STAGE2_SPEC section C): the arrow shown during phase ph depicts the leg the model
   executes during phase ph. */
const {load}=require("./model.js"), fs=require("fs");
const X=load(), G=X.GEOREF, M_PER_MAP=G.KM_PER_MAP*1000;
const TOL_M=450, TOL_DEG=35;
const F=X.FORMATIONS, ids=Object.keys(F);
const side=id=>F[id].nation==="fr"?"fr":"al";
const d=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1])*M_PER_MAP;
const ang=v=>Math.atan2(v[1],v[0]);
function hdiff(a,b){ let x=Math.abs(ang(a)-ang(b))*180/Math.PI; if(x>180) x=360-x; return x; }
function posAt(id,t){
  const f=F[id];
  if(f.track){ if(X.goneAt(id,t)||X.notYetAt(id,t)) return null; return X.posAtClock(id,t); }
  const ls=X.leavesOf(id,[]); let sx=0,sy=0,n=0;
  ls.forEach(k=>{ if(X.goneAt(k,t)||X.notYetAt(k,t)) return; const p=X.posAtClock(k,t); if(p){ sx+=p[0]; sy+=p[1]; n++; } });
  return n?[sx/n,sy/n]:null;
}
/* names a label can use for a formation */
const ROMAN={"I Column":"dok","II Column":"lang","III Column":"prz","IV Column":"col4","V Column":"lich"};
function keysOf(id){
  const f=F[id], k=new Set();
  const add=s=>{ if(s) k.add(s.toLowerCase()); };
  (f.name||"").replace(/'s .*$/,"").split(/ and /).forEach(s=>add(s.trim()));
  const cm=(f.commander||"").replace(/\(.*\)/,"").split(/;|,/)[0].trim().split(/\s+/); add(cm[cm.length-1]);
  if(id==="guard_cav"){ add("Bessieres"); add("Rapp"); }
  if(id==="c_iii") add("Davout");
  if(id==="drouet") add("Drouet");
  if(id==="lich") add("Liechtenstein");
  if(id==="constantine") add("Russian Imperial Guard");
  if(id==="c_iv") add("Soult");
  return k;
}
const KEYS={}; ids.forEach(i=>KEYS[i]=keysOf(i));
function named(label){
  const base=label.split("→")[0];
  const out=new Set();
  Object.entries(ROMAN).forEach(([r,id])=>{ if(new RegExp("(^|\\s)"+r+"(\\s|$)").test(base)) out.add(id); });
  ids.forEach(id=>{ KEYS[id].forEach(k=>{ if(k.length>3&&new RegExp("\\b"+k.replace(/[-']/g,".")+"\\b","i").test(base)) out.add(id); }); });
  /* a named sub-formation hides its generic parent match (e.g. "Russian Imperial Guard" vs rg_inf "Guard Infantry") */
  return [...out];
}
const rows=[];
Object.keys(X.OVERLAYS).map(Number).forEach(ph=>{
  const P=X.PHASES[ph], t0=P.t0, t1=P.t1, ov=X.OVERLAYS[ph];
  (ov.arrows||[]).forEach((a,ai)=>{
    const S=a.pts[0], E=a.pts[a.pts.length-1], v=[E[0]-S[0],E[1]-S[1]];
    const nm=named(a.label).filter(id=>side(id)===a.side);
    const cands=ids.filter(id=>side(id)===a.side).map(id=>{
      const p0=posAt(id,t0), p1=posAt(id,t1);
      if(!p0||!p1) return null;
      const mv=[p1[0]-p0[0],p1[1]-p0[1]], moved=Math.hypot(mv[0],mv[1])*M_PER_MAP;
      const dS=d(S,p0), dE=d(E,p1), hd=moved>50?hdiff(v,mv):null;
      /* the best single leg anywhere in the track */
      let best=null;
      if(F[id].track){ const A=X.anchorList(id);
        for(let i=0;i<A.length-1;i++){ const aa=A[i], bb=A[i+1]; if(!aa.p||!bb.p) continue;
          const s=Math.max(d(S,aa.p),d(E,bb.p)); if(!best||s<best.score) best={score:s,from:aa.ph,to:bb.ph,dS:d(S,aa.p),dE:d(E,bb.p),win:X.legWindow(aa,bb)}; } }
      let into=null;
      if(F[id].track){ const A=X.anchorList(id), k=A.findIndex(q=>q.ph===ph);
        if(k>0&&A[k].p&&A[k-1].p){ const aa=A[k-1], bb=A[k], iv=[bb.p[0]-aa.p[0],bb.p[1]-aa.p[1]], im=Math.hypot(iv[0],iv[1])*M_PER_MAP;
          into={from:aa.ph,dS:d(S,aa.p),dE:d(E,bb.p),moved:im,hd:im>50?hdiff(v,iv):null,win:X.legWindow(aa,bb)}; } }
      return {id,p0,p1,moved,dS,dE,hd,score:Math.max(dS,dE),best,into};
    }).filter(Boolean).sort((x,y)=>x.score-y.score);
    const byId=Object.fromEntries(cands.map(c=>[c.id,c]));
    const group=nm.length>1||nm.some(id=>!F[id].track)||/ and /.test(a.label.split("→")[0]);
    let verdict, why;
    if(a.kind==="axis"){ verdict="interpretive"; why="kind axis: an ordered or intended route, not a movement made"; }
    else if(!nm.length){ verdict="interpretive"; why="the label names no modelled formation"; }
    else if(group){ verdict="interpretive"; why="group or summary arrow: "+nm.join(", "); }
    else {
      const c=byId[nm[0]];
      if(!c){ verdict="mismatch"; why=nm[0]+" is not on the field for the whole phase"; }
      else if(c.moved<=50){ verdict="mismatch"; why=nm[0]+" does not move across the phase ("+Math.round(c.moved)+" m)"; }
      else if(c.dS<=TOL_M&&c.dE<=TOL_M&&c.hd<=TOL_DEG){ verdict="derivable"; why="one-to-one within "+TOL_M+" m and "+TOL_DEG+" degrees"; }
      else { verdict="mismatch"; why="endpoints "+Math.round(c.dS)+" / "+Math.round(c.dE)+" m, heading "+(c.hd==null?"-":Math.round(c.hd))+" degrees"; }
    }
    /* the same verdict on the "into" reading */
    let verdictInto=verdict, whyInto=why;
    if(verdict!=="interpretive"){
      const c=byId[nm[0]]||cands.find(q=>q.id===nm[0]);
      const allC=ids.filter(id=>id===nm[0]);
      const ci=(()=>{ if(!F[nm[0]].track) return null; const A=X.anchorList(nm[0]), k=A.findIndex(q=>q.ph===ph);
        if(k>0&&A[k].p&&A[k-1].p){ const aa=A[k-1], bb=A[k], iv=[bb.p[0]-aa.p[0],bb.p[1]-aa.p[1]], im=Math.hypot(iv[0],iv[1])*M_PER_MAP;
          return {from:aa.ph,dS:d(S,aa.p),dE:d(E,bb.p),moved:im,hd:im>50?hdiff(v,iv):null}; } return null; })();
      if(!ci){ verdictInto="mismatch"; whyInto=nm[0]+" has no anchor at phase "+ph+" (no leg arrives in it)"; }
      else if(ci.dS<=TOL_M&&ci.dE<=TOL_M&&ci.hd!=null&&ci.hd<=TOL_DEG){ verdictInto="derivable"; whyInto="leg "+ci.from+"→"+ph+" within "+TOL_M+" m and "+TOL_DEG+" degrees"; }
      else { verdictInto="mismatch"; whyInto="leg "+ci.from+"→"+ph+": endpoints "+Math.round(ci.dS)+" / "+Math.round(ci.dE)+" m, heading "+(ci.hd==null?"-":Math.round(ci.hd))+" degrees"; }
    }
    /* the "exec" reading: the legs the model executes during the phase */
    let verdictExec=verdict, whyExec=why, execLegs=[];
    if(verdict!=="interpretive"){
      const id0=nm[0];
      if(F[id0].track){ const A=X.anchorList(id0);
        for(let k=1;k<A.length;k++){ const aa=A[k-1], bb=A[k]; if(!aa.p||!bb.p) continue; const w=X.legWindow(aa,bb);
          const ov=Math.min(w[1],t1)-Math.max(w[0],t0); if(ov<1) continue;
          const iv=[bb.p[0]-aa.p[0],bb.p[1]-aa.p[1]], im=Math.hypot(iv[0],iv[1])*M_PER_MAP;
          execLegs.push({from:aa.ph,to:bb.ph,win:w,dS:d(S,aa.p),dE:d(E,bb.p),moved:im,hd:im>50?hdiff(v,iv):null}); } }
      const ok=execLegs.filter(q=>q.dS<=TOL_M&&q.dE<=TOL_M&&q.hd!=null&&q.hd<=TOL_DEG);
      const hm=t=>String(Math.floor(t/60)).padStart(2,"0")+":"+String(Math.round(t%60)).padStart(2,"0");
      const desc=q=>"leg "+q.from+"→"+q.to+" ("+hm(q.win[0])+"-"+hm(q.win[1])+")";
      if(ok.length){ verdictExec="derivable"; whyExec=desc(ok[0])+" within "+TOL_M+" m and "+TOL_DEG+" degrees"; }
      else if(!execLegs.length){ verdictExec="mismatch"; whyExec=id0+" executes no leg during the phase"; }
      else { verdictExec="mismatch"; whyExec=execLegs.map(q=>desc(q)+": endpoints "+Math.round(q.dS)+" / "+Math.round(q.dE)+" m, heading "+(q.hd==null?"-":Math.round(q.hd))+" degrees").join("; "); }
    }
    /* the binding: derivable if either reading matches one-to-one; the reading is recorded */
    const binding=verdict==="interpretive"?"interpretive":
      (verdictInto==="derivable"&&verdict==="derivable")?"derivable (both)":verdictInto==="derivable"?"derivable (into)":verdict==="derivable"?"derivable (across)":"mismatch";
    const lenM=Math.hypot(v[0],v[1])*M_PER_MAP;
    rows.push({ph,clock:P.clock,i:ai,kind:a.kind,side:a.side,label:a.label,pts:a.pts,lenM:Math.round(lenM),named:nm,
      verdict,why,verdictInto,whyInto,binding,verdictExec,whyExec,
      namedMove:nm.map(id=>{ const c=byId[id]; return c?{id,dS:Math.round(c.dS),dE:Math.round(c.dE),moved:Math.round(c.moved),hd:c.hd==null?null:Math.round(c.hd),
        best:c.best&&{from:c.best.from,to:c.best.to,dS:Math.round(c.best.dS),dE:Math.round(c.best.dE),win:c.best.win}}:{id,absent:true}; }),
      nearest:cands.slice(0,3).map(c=>({id:c.id,dS:Math.round(c.dS),dE:Math.round(c.dE),moved:Math.round(c.moved),hd:c.hd==null?null:Math.round(c.hd)}))});
  });
});
const other=[];
Object.keys(X.OVERLAYS).map(Number).forEach(ph=>{ const ov=X.OVERLAYS[ph];
  (ov.lines||[]).forEach(l=>other.push({ph,type:"line",side:l.side,label:l.label,verdict:"interpretive",why:"a front or position line"}));
  (ov.bounds||[]).forEach(b=>other.push({ph,type:"boundary",label:b.label,verdict:"interpretive",why:"a disposition boundary"}));
  (ov.obj||[]).forEach(o=>other.push({ph,type:"objective",label:o[2],verdict:"interpretive",why:"an objective marker"}));
});
const count=(k,f)=>rows.filter(r=>r[f||"verdict"]===k).length;
console.log("arrows "+rows.length+": across the phase: derivable "+count("derivable")+", interpretive "+count("interpretive")+", mismatch "+count("mismatch")+
  "; into the phase: derivable "+count("derivable","verdictInto")+", mismatch "+count("mismatch","verdictInto")+
  "; binding (either reading): derivable into "+count("derivable (into)","binding")+", derivable across "+count("derivable (across)","binding")+
  ", both "+count("derivable (both)","binding")+", interpretive "+count("interpretive","binding")+", mismatch "+count("mismatch","binding")+
  "; the leg executed during the phase (the 2C rule): derivable "+count("derivable","verdictExec")+", mismatch "+count("mismatch","verdictExec")+
  "; other overlay items "+other.length+" (all interpretive). Tolerance "+TOL_M+" m at both ends, heading "+TOL_DEG+" degrees; 1 map unit = "+M_PER_MAP.toFixed(1)+" m.");
const fmtN=r=>r.namedMove.map(n=>n.absent?n.id+" (absent)":n.id+" "+n.dS+"/"+n.dE+" m, moved "+n.moved+" m"+(n.hd==null?"":", "+n.hd+"°")+
  (n.best?"; best leg "+n.best.from+"→"+n.best.to+" "+n.best.dS+"/"+n.best.dE+" m":"")).join("; ");
rows.forEach(r=>console.log("ph"+r.ph+" "+r.kind.padEnd(8)+r.side+" "+r.verdict.padEnd(13)+(r.verdict==="interpretive"?"":"into:"+r.verdictInto.padEnd(10)+"exec:"+r.verdictExec.padEnd(10)+"["+r.whyExec+"] ")+JSON.stringify(r.label)+"  "+r.why+(r.verdict==="interpretive"?"":" | into: "+r.whyInto)+(r.named.length?"  ["+fmtN(r)+"]":"")+
  "  nearest: "+r.nearest.map(n=>n.id+" "+n.dS+"/"+n.dE).join(", ")));
const i=process.argv.indexOf("--json"); if(i>0) fs.writeFileSync(process.argv[i+1],JSON.stringify({TOL_M,TOL_DEG,rows,other},null,1));
const m=process.argv.indexOf("--md"); if(m>0){
  const L=["| ph | kind | side | label | length m | named | across the phase: start / end m, moved m, heading | best leg (phases): start / end m | nearest other candidates | verdict, across | verdict, into | binding | verdict, leg executed in the phase | reason |","|---|---|---|---|---:|---|---|---|---|---|---|---|---|---|"];
  rows.forEach(r=>L.push("| "+r.ph+" | "+r.kind+" | "+r.side+" | "+r.label+" | "+r.lenM+" | "+(r.named.join(", ")||"-")+" | "+
    (r.namedMove.map(n=>n.absent?n.id+": absent":n.id+": "+n.dS+" / "+n.dE+", "+n.moved+(n.hd==null?"":", "+n.hd+"°")).join("; ")||"-")+" | "+
    (r.namedMove.filter(n=>n.best).map(n=>n.id+": "+n.best.from+"→"+n.best.to+", "+n.best.dS+" / "+n.best.dE).join("; ")||"-")+" | "+
    r.nearest.filter(n=>!r.named.includes(n.id)).slice(0,2).map(n=>n.id+" "+n.dS+" / "+n.dE).join("; ")+" | **"+r.verdict+"** | "+(r.verdict==="interpretive"?"-":"**"+r.verdictInto+"**")+" | **"+r.binding+"** | "+(r.verdict==="interpretive"?"-":"**"+r.verdictExec+"**")+" | "+(r.verdict==="interpretive"?r.why:"across: "+r.why+"; into: "+r.whyInto+"; executed: "+r.whyExec)+" |"));
  fs.writeFileSync(process.argv[m+1],L.join("\n")+"\n");
}
