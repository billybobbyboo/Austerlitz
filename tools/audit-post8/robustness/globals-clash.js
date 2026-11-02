/* Final audit after Stage 8, area "robustness": the bundle's top-level names against the browser's own globals (measurement only).
   node tools/audit-post8/robustness/globals-clash.js  ->  docs/audit-post8-evidence/robustness/globals-clash.json
   The ten bundled files and shell.html's inline scripts are classic scripts sharing one global scope with the browser's window. Every
   top-level var, let, const, function and class name (acorn) is compared with the property names of a fresh window in the pinned Chromium
   (an about:blank page: every own and inherited property name of window, walked up its prototype chain), and each clash classed by what a
   page's top-level declaration does to it there: the property's descriptor (writable? configurable? an accessor?) read in the same page. */
"use strict";
const fs=require("fs"), path=require("path");
const acorn=require(path.join(__dirname,"..","..","..","node_modules","acorn"));
const A=require("../lib.js");
const ROOT=path.resolve(__dirname,"..","..",".."), OUT=path.join(A.EVID,"robustness","globals-clash.json");
const BUNDLE=["assets.js","tokens.js","geo.js","data.js","appearance.js","analysis.js","narrative.js","world.js","symbols.js","app.js"];
(async()=>{
  const names={};
  const add=(n,f,l,k)=>{ (names[n]=names[n]||[]).push(f+":"+l+" "+k); };
  BUNDLE.forEach(f=>{ const ast=acorn.parse(fs.readFileSync(path.join(ROOT,f),"utf8"),{ecmaVersion:"latest",locations:true});
    ast.body.forEach(st=>{ if(st.type==="VariableDeclaration") st.declarations.forEach(d=>{ if(d.id.type==="Identifier") add(d.id.name,f,d.loc.start.line,st.kind); });
      else if(st.type==="FunctionDeclaration"||st.type==="ClassDeclaration") add(st.id.name,f,st.loc.start.line,st.type==="FunctionDeclaration"?"function":"class"); }); });
  const shell=fs.readFileSync(path.join(ROOT,"shell.html"),"utf8"); const re=/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi; let m;
  while((m=re.exec(shell))){ if(m[1].includes("/*JS*/")) continue; const line0=shell.slice(0,m.index).split("\n").length;
    const ast=acorn.parse(m[1],{ecmaVersion:"latest",locations:true});
    ast.body.forEach(st=>{ if(st.type==="VariableDeclaration") st.declarations.forEach(d=>add(d.id.name,"shell.html",line0+d.loc.start.line-1,st.kind));
      else if(st.type==="FunctionDeclaration") add(st.id.name,"shell.html",line0+st.loc.start.line-1,"function"); }); }
  const b=await A.launch(); const res={generated:new Date().toISOString(),topLevelNames:Object.keys(names).length};
  try{
    const page=await (await b.newContext()).newPage(); await page.goto("about:blank");
    const win=await page.evaluate((list)=>{ const seen=new Set(); let o=window; while(o){ Object.getOwnPropertyNames(o).forEach(k=>seen.add(k)); o=Object.getPrototypeOf(o); }
      const out={}; list.forEach(n=>{ if(!seen.has(n)) return; let d=null, o2=window; while(o2&&!d){ d=Object.getOwnPropertyDescriptor(o2,n); if(!d) o2=Object.getPrototypeOf(o2); }
        out[n]={own:o2===window,accessor:!!(d&&(d.get||d.set)),writable:d?!!d.writable:null,configurable:d?!!d.configurable:null,type:typeof window[n]}; });
      return {count:seen.size,clashes:out}; },Object.keys(names));
    res.windowProperties=win.count;
    res.clashes=Object.keys(win.clashes).map(n=>Object.assign({name:n,declared:names[n]},win.clashes[n]));
    res.browser=b.version();
  }catch(e){ res.error=String(e&&e.stack||e); process.exitCode=1; }
  finally{ await b.close(); fs.writeFileSync(OUT,JSON.stringify(res,null,1)); console.log("clashes:",(res.clashes||[]).map(c=>c.name).join(", ")); }
})();
