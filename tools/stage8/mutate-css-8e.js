#!/usr/bin/env node
/* Stage 8, implementation PR 8E (docs/STAGE8_SPEC.md section 17): does css-test.js's 8E block (the troops' values and rules as decided) fail
   when what it holds is broken? Each mutation replaces one string of app.js; css-test.js is run on the copy in a temporary tree (every other
   file the repository's own, linked), and its 8E line and its findings are read. The unmutated source first: the block passes on it.
   node tools/stage8/mutate-css-8e.js [--json out.json]
   Measurement code only: nothing is written to a source file. */
"use strict";
const fs=require("fs"), path=require("path"), os=require("os"), cp=require("child_process");
const ROOT=path.resolve(__dirname,"..",".."), argv=process.argv.slice(2), opt=f=>{ const i=argv.indexOf(f); return i>=0?argv[i+1]:null; }, OUT=opt("--json");
/* [id, what it breaks, from, to] */
const MUT=[
  ["none","nothing (the source as it is)",null,null],
  ["klod","no margin: the kit simple again only under 17.6 px","var KLOD={IN:17.6, OUT:14.5,","var KLOD={IN:17.6, OUT:17.6,"],
  ["lodalloc","kitLod allocating for every block every frame","function kitLod(rec){\n  var u=rec.block.userData;","function kitLod(rec){\n  var tmp=new THREE.Vector3(); var u=rec.block.userData;"],
  ["colour","a vehicle part drawn in a colour of its own, not KIT.gear's","[x,r,0],null,[0,0,Math.PI/2],KIT.gear.wheel,k); }","[x,r,0],null,[0,0,Math.PI/2],0x808000,k); }"],
  ["armycolour","a carriage coloured by its army","function kitDisc(x,r,n,k){ return kitPart(","function kitDisc(x,r,n,k){ var nation=null; return kitPart("],
  ["drivers","IV Corps' letter generalised: a driver on every team the claim does not reach","  return {n:0, claim:null}; }\n/* the battery's layout","  return {n:1, claim:null}; }\n/* the battery's layout"],
  ["switch","the deployed and limbered battery eased over a duration no source gives","    u.deployed.visible=!moving;\n    u.limbered.visible=moving;","    u.deployed.visible=!moving||Math.random()<0.5;\n    u.limbered.visible=moving;"],
  ["wall","the gait's phase from the wall clock, not the track's distance","U.uAnimAmp.value=amp; U.uAnimPhase.value=amp>0?2*Math.PI*(x-Math.floor(x)):0;","U.uAnimAmp.value=amp; U.uAnimPhase.value=amp>0?(performance.now()/300)%6.283:0;"],
  ["rm","reduced motion ignored by the gait","if(lg&&!RM&&lg.kmh>=GAIT.KMH){ c=","if(lg&&lg.kmh>=GAIT.KMH){ c="],
  ["fade","the fade from 3.2 to 4.8 cycles a second moved","FULL:3.2, NONE:4.8,","FULL:4.0, NONE:6.0,"],
  ["ease","the amplitude set at once, not eased","if(G.amp!==want){ G.amp+=(want-G.amp)*e;","if(G.amp!==want){ G.amp=want;"],
  ["rmease","reduced motion eased, not at once","var e=RM?1:ease(GAIT.EASE);","var e=ease(GAIT.EASE);"],
  ["noskip","gaitStep computing (and allocating) every frame when nothing changed","  G.t=clock; G.rate=rate; G.rm=RM; G.fv=fv;\n  var L=rec.f.track?legAt(id,clock):null, lg=L?gaitLegOf(L,_glo):null,","  G.t=clock; G.rate=rate; G.rm=RM; G.fv=fv;\n  var L=rec.f.track?legAt(id,clock):null, lg=L?gaitLegOf(L):null,"],
  ["crew","a battery's cadence its hidden crew's","var rate=clockRate(), fv=gaitFastest(rec,G);","var rate=clockRate(), fv=G.fastest;"],
  ["wheelwrap","the wheels' angles not taken within one spoke's interval","a-=pg*Math.round(a/pg); b-=pl*Math.round(b/pl);",""],
  ["kneel","a behaviour beyond the gait: a kneeling part","PART:{0:{kind:\"none\"},","PART:{0:{kind:\"none\"}, 30:{kind:\"kneel\"},"],
  ["wind","the standards' cloth moved by the wall clock (wind)","a.setZ(i,F.a*(0.35+0.65*u)*Math.sin(Math.PI*F.n*u));","a.setZ(i,F.a*(0.35+0.65*u)*Math.sin(Math.PI*F.n*u+performance.now()));"]
];
const src=fs.readFileSync(path.join(ROOT,"app.js"),"utf8"), dir=fs.mkdtempSync(path.join(os.tmpdir(),"mutate-css-8e-")), res={mutations:[]};
fs.readdirSync(ROOT).forEach(f=>{ if(f!=="app.js"&&f!==".git") fs.symlinkSync(path.join(ROOT,f),path.join(dir,f)); });
let wrong=0;
for(const [id,what,a,b] of MUT){
  let s=src; if(a){ if(s.split(a).length!==2) throw new Error(id+": the string to replace is not found exactly once"); s=s.replace(a,()=>b); }
  fs.writeFileSync(path.join(dir,"app.js"),s);
  const r=cp.spawnSync("node",["css-test.js"],{cwd:dir,encoding:"utf8",maxBuffer:64<<20}), out=r.stdout||"";
  const line=(out.split("\n").find(l=>l.startsWith("the troops (decisions 242 (a)"))||""), found=out.split("\n").filter(l=>/^  ! /.test(l)).map(l=>l.slice(4));
  const fails=/: \d+ wrong$/.test(line), ok=id==="none"?!fails&&line.length>0:fails;
  if(!ok) wrong++;
  res.mutations.push({id, what, blockFails:fails, ok, findings:found.slice(0,6), exit:r.status});
  console.log((ok?"ok    ":"WRONG ")+id.padEnd(11)+(id==="none"?"the block passes":fails?"the block fails: "+found.slice(0,2).join(" | "):"the block passes (it should fail)"));
}
fs.rmSync(dir,{recursive:true,force:true});
console.log(wrong?wrong+" WRONG":"every mutation as it should be");
if(OUT){ fs.mkdirSync(path.dirname(OUT),{recursive:true}); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); }
if(wrong) process.exitCode=1;
