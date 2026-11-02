/* perf-attribution: three.js's self time by function (name, line, column) in one or more raw profiles, with three.min.js's source at each
   column, so that the minified names can be read; and the app callers of each. Usage: node three-fns.js <frames> <prof.json.gz> [...] */
"use strict";
const fs=require("fs"), zlib=require("zlib"), path=require("path");
const SRC=fs.readFileSync(path.join(__dirname,"../../../node_modules/three/build/three.min.js"),"utf8").split("\n");
const n=+process.argv[2];
for(const f of process.argv.slice(3)){
  const p=JSON.parse(zlib.gunzipSync(fs.readFileSync(f)));
  const byId=new Map(), par=new Map(); p.nodes.forEach(x=>{ byId.set(x.id,x); (x.children||[]).forEach(c=>par.set(c,x.id)); });
  const S=p.samples, D=p.timeDeltas, inRun=new Map();
  const has=(id,fn)=>{ if(inRun.has(id+fn)) return inRun.get(id+fn); let k=id,r=false; while(k!=null){ if(byId.get(k).callFrame.functionName===fn){ r=true; break; } k=par.get(k);} inRun.set(id+fn,r); return r; };
  const self={}, caller={};
  for(let i=0;i<S.length;i++){ const s=S[i], d=(i+1<S.length?D[i+1]:0)/1000; if(!has(s,"__paRun")||has(s,"__paSync")||has(s,"__paFlush")) continue;
    const cf=byId.get(s).callFrame; if(!/three/.test(cf.url)) continue;
    const k=(cf.functionName||"(anon)")+"@"+(cf.lineNumber+1)+":"+cf.columnNumber; self[k]=(self[k]||0)+d;
    /* the first three frame below which an app frame calls: the three entry point, and its app caller */
    let q=s, entry=null, app=null; while(q!=null){ const c=byId.get(q).callFrame; if(/three/.test(c.url)) entry=c.functionName||"(anon)@"+c.columnNumber; else if(c.url){ app=c.functionName; break; } q=par.get(q); }
    const ck=k+" <= "+entry+" <= "+app; caller[ck]=(caller[ck]||0)+d; }
  console.log("== "+path.basename(f));
  Object.entries(self).sort((a,b)=>b[1]-a[1]).slice(0,22).forEach(([k,v])=>{ const m=/@(\d+):(\d+)$/.exec(k), line=SRC[+m[1]-1]||"", c=+m[2];
    console.log((v/n).toFixed(3).padStart(7)+" ms/frame  "+k.padEnd(34)+" "+line.slice(c,c+110).replace(/\s+/g," ")); });
  console.log(" -- by entry and app caller:");
  Object.entries(caller).sort((a,b)=>b[1]-a[1]).slice(0,12).forEach(([k,v])=>console.log((v/n).toFixed(3).padStart(7)+"  "+k));
}
