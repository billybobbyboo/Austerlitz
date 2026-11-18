#!/usr/bin/env node
/* UI/UX roadmap step 5 (docs/UX_ART_AUDIT.md UA-08): the villages the narrative uses, derived from the data, not chosen.
   Reads data.js, world.js's VILLAGES and analysis.js in a sandbox; collects every string of PHASES, EVENTS, TOUR and ANALYSIS (the narrative the
   brief names), and counts, for each village name the data holds (world.js VILLAGES, the drawn footprints, and data.js FEATURES of kind village or
   town, the map's named places), the strings that name it as a whole word. "Pratzen" alone is the plateau as often as the village, so the village
   is counted only where a string says "Pratzen village" or "village of Pratzen" (the FEATURES name "Pratzen village"), and "Austerlitz" only outside
   the battle's own name ("the battle of Austerlitz", "Austerlitz campaign"). Writes nothing; prints the table and the list.
   node tools/ux-step5/villages.js [--json] */
"use strict";
const fs=require("fs"), path=require("path"), vm=require("vm");
const R=path.join(__dirname,"..","..");
const ctx={console}; vm.createContext(ctx);
function run(f,extra){ vm.runInContext(fs.readFileSync(path.join(R,f),"utf8")+(extra||""),ctx,{filename:f}); }
run("geo.js"); run("data.js",";this.PHASES=PHASES;this.FEATURES=FEATURES;");
const wsrc=fs.readFileSync(path.join(R,"world.js"),"utf8"), m=wsrc.match(/var VILLAGES=\[[\s\S]*?\n\];/);
vm.runInContext(m[0]+";this.VILLAGES=VILLAGES;",ctx);
run("analysis.js",";this.ANALYSIS=ANALYSIS;this.EVENTS=EVENTS;this.TOUR=TOUR;");
function strings(o,acc,where){ if(typeof o==="string") acc.push({s:o,where}); else if(Array.isArray(o)) o.forEach((x,i)=>strings(x,acc,where+"["+i+"]"));
  else if(o&&typeof o==="object") for(const k in o){ if(k==="cam"||k==="aim") continue; strings(o[k],acc,where+"."+k); } return acc; }
const SRC={PHASES:ctx.PHASES, EVENTS:ctx.EVENTS, TOUR:ctx.TOUR, ANALYSIS:ctx.ANALYSIS};
const S=[]; for(const k in SRC) strings(SRC[k],S,k);
const feat={}; ctx.FEATURES.forEach(f=>{ if(f.kind==="village"||f.kind==="town") feat[f.id]=f; });
const names=new Map();   /* the village's name as the data spells it -> its FEATURES entry, if any */
ctx.VILLAGES.forEach(v=>names.set(v[0],null));
Object.values(feat).forEach(f=>{ const n=f.name==="Pratzen village"?"Pratzen":f.name; names.set(n,f); });
function re(n){ return new RegExp("(^|[^A-Za-zÀ-ž])"+n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"(?![A-Za-zÀ-ž])"); }
const rows=[];
for(const [n,f] of names){
  let hits=S.filter(x=>re(n).test(x.s));
  if(n==="Pratzen") hits=S.filter(x=>/Pratzen village|village of Pratzen/.test(x.s));
  if(n==="Austerlitz") hits=hits.filter(x=>x.s.replace(/[Bb]attle of Austerlitz|Austerlitz campaign|Austerlitz, 2 December/g,"").match(re(n)));
  const by={}; hits.forEach(h=>{ const k=h.where.split(/[.[]/)[0]; by[k]=(by[k]||0)+1; });
  rows.push({name:n, feature:f?f.id:null, featureName:f?f.name:null, strings:hits.length, by, inVillages:ctx.VILLAGES.some(v=>v[0]===n)});
}
rows.sort((a,b)=>b.strings-a.strings||a.name.localeCompare(b.name));
if(process.argv.includes("--json")){ console.log(JSON.stringify({strings:S.length, rows},null,1)); process.exit(0); }
console.log("strings read:",S.length,"(PHASES, EVENTS, TOUR, ANALYSIS; camera presets skipped)");
console.log("name".padEnd(22),"FEATURES id".padEnd(13),"strings","  by source");
rows.forEach(r=>console.log(r.name.padEnd(22),String(r.feature||"-").padEnd(13),String(r.strings).padStart(7),"  "+JSON.stringify(r.by)));
