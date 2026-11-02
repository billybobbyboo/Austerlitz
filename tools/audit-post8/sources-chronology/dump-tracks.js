// Dump every formation's track anchors with grade, timing (tm) and act text; read-only.
// usage: node tools/audit-post8/sources-chronology/dump-tracks.js [ids...]
const fs=require("fs"),vm=require("vm"),path=require("path");
const root=path.resolve(__dirname,"../../..");
const ctx={};vm.createContext(ctx);
for(const f of ["data.js","analysis.js","narrative.js"]) vm.runInContext(fs.readFileSync(path.join(root,f),"utf8"),ctx);
const ids=process.argv.slice(2);
const F=ctx.FORMATIONS;
function hm(m){if(m==null)return "-";const h=Math.floor(m/60),mm=Math.round(m%60);return String(h).padStart(2,"0")+":"+String(mm).padStart(2,"0");}
for(const id of Object.keys(F)){
  if(ids.length&&!ids.includes(id))continue;
  const f=F[id];
  console.log("=== "+id+" | "+f.name+" | "+(f.commander||"")+" | str "+f.strength+" | parent "+(f.parent||"-"));
  const t=f.track||{};
  for(const k of Object.keys(t).sort((a,b)=>+a-+b)){
    const e=t[k];
    let s="  @"+k+" p="+(e.p?JSON.stringify(e.p):"-")+" st="+(e.st||"-")+" cf="+(e.cf||"-");
    if(e.tm) s+=" tm{at "+hm(e.tm.at)+(e.tm.dep!=null?" dep "+hm(e.tm.dep):"")+" gr "+e.tm.gr+" basis "+e.tm.basis+"}";
    if(e.moveMin) s+=" moveMin="+e.moveMin;
    console.log(s);
    if(e.act) console.log("     act: "+e.act);
    if(e.obj) console.log("     obj: "+e.obj);
    if(e.tm){ if(e.tm.ev) console.log("     tm.ev: "+JSON.stringify(e.tm.ev)); if(e.tm.note) console.log("     tm.note: "+e.tm.note);}
  }
}
