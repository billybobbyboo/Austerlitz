/* Final audit after Stage 8, area "robustness": the static scan (measurement only; reads the sources, writes evidence).
   node tools/audit-post8/robustness/static-scan.js  ->  docs/audit-post8-evidence/robustness/static-scan.json
   1. HTML sinks (innerHTML, outerHTML, insertAdjacentHTML, document.write) in app.js, world.js, symbols.js, shell.html's inline scripts and
      tools/step6/perf-run.html: each sink's interpolated parts classified (escaped by esc(), numeric, literal, other), and whether a part
      stands in a quoted attribute (esc() escapes & < > only, not quotes).
   2. Every read of a source from outside the bundle (location, document.URL/referrer, window.name, storage, cookies, postMessage, history.state,
      clipboard, drag and drop, files, network) in the same files.
   3. Dead code: the top-level functions of app.js, world.js and symbols.js, reachability from the bundle's top-level code (any reference counts
      as a use) over all ten bundled files and shell.html; a function reached only from the test suites or tools is "test/tool-only".
   4. Global mutable state: app.js's top-level bindings and which are reassigned, by how many functions.
   5. Mirrored logic: animGLSL/animAt, groundY/groundYFast and the tests that hold each pair together. */
"use strict";
const fs=require("fs"), path=require("path");
const acorn=require(path.join(__dirname,"..","..","..","node_modules","acorn"));
const ROOT=path.resolve(__dirname,"..","..",".."), OUT=path.join(ROOT,"docs","audit-post8-evidence","robustness");
const BUNDLE=["assets.js","tokens.js","geo.js","data.js","appearance.js","analysis.js","narrative.js","world.js","symbols.js","app.js"];
const read=f=>fs.readFileSync(path.join(ROOT,f),"utf8");
function parse(src,file,offsetLine){
  try{ return acorn.parse(src,{ecmaVersion:"latest",sourceType:"script",locations:true,allowHashBang:true}); }
  catch(e){ throw new Error(file+": "+e.message); }
}
function inlineScripts(file){
  const s=read(file), out=[]; const re=/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi; let m;
  while((m=re.exec(s))){ const line=s.slice(0,m.index+m[0].indexOf(">")+1).split("\n").length; out.push({file,src:m[1],line0:line-1}); }
  return out;
}
/* a generic walker with parent links */
function walk(node,fn,parent,anc){
  anc=anc||[];
  if(!node||typeof node.type!=="string") return;
  fn(node,parent,anc);
  anc.push(node);
  for(const k in node){ if(k==="loc"||k==="start"||k==="end") continue; const v=node[k];
    if(Array.isArray(v)) v.forEach(c=>{ if(c&&typeof c.type==="string") walk(c,fn,node,anc); });
    else if(v&&typeof v.type==="string") walk(v,fn,node,anc); }
  anc.pop();
}
const units=[];
["app.js","world.js","symbols.js"].forEach(f=>units.push({file:f,src:read(f),line0:0}));
inlineScripts("shell.html").forEach(u=>units.push(u));
inlineScripts("tools/step6/perf-run.html").forEach(u=>units.push(u));
units.forEach(u=>{ u.ast=parse(u.src,u.file); });
const txt=(u,n)=>u.src.slice(n.start,n.end);
const lineOf=(u,n)=>n.loc.start.line+u.line0;

/* ---- 1. sinks ---- */
const SINK_PROPS=new Set(["innerHTML","outerHTML"]);
function flatten(n,acc){ acc=acc||[];
  if(n.type==="BinaryExpression"&&n.operator==="+"){ flatten(n.left,acc); flatten(n.right,acc); }
  else if(n.type==="TemplateLiteral"){ n.quasis.forEach((q,i)=>{ acc.push({lit:q.value.cooked}); if(n.expressions[i]) flatten(n.expressions[i],acc); }); }
  else if(n.type==="Literal"&&typeof n.value==="string") acc.push({lit:n.value});
  else acc.push({expr:n});
  return acc; }
function classify(u,e){
  if(e.type==="CallExpression"){
    const c=e.callee, name=c.type==="Identifier"?c.name:(c.type==="MemberExpression"&&!c.computed?c.property.name:null);
    if(name==="esc") return "esc";
    if(["toFixed","round","floor","ceil","max","min","abs","Number","fmtFactor","String"].includes(name)&&!(name==="String")) return "numeric";
    if(name==="join"||name==="map") return "built:"+(c.type==="MemberExpression"?txt(u,c.object).slice(0,40):name);
    return "call:"+name;
  }
  if(e.type==="Literal") return typeof e.value==="number"?"numeric":"literal";
  if(e.type==="UnaryExpression"&&(e.operator==="+"||e.operator==="-")) return "numeric";
  if(e.type==="BinaryExpression"&&e.operator!=="+") return "numeric";
  if(e.type==="ConditionalExpression"){ const a=flatten(e.consequent), b=flatten(e.alternate);
    const parts=a.concat(b).filter(p=>p.expr).map(p=>classify(u,p.expr));
    return parts.length===0?"literal":(parts.every(p=>p==="esc"||p==="numeric"||p==="literal")?"cond:safe":"cond:"+parts.join("|")); }
  if(e.type==="Identifier") return "ident:"+e.name;
  if(e.type==="MemberExpression") return "member:"+txt(u,e).slice(0,50);
  return e.type;
}
const sinks=[];
units.forEach(u=>walk(u.ast,(n)=>{
  let kind=null, val=null;
  if(n.type==="AssignmentExpression"&&n.left.type==="MemberExpression"&&!n.left.computed&&SINK_PROPS.has(n.left.property.name)){ kind=n.left.property.name+(n.operator==="+="?"+=":""); val=n.right; }
  if(n.type==="CallExpression"&&n.callee.type==="MemberExpression"&&!n.callee.computed){
    const p=n.callee.property.name;
    if(p==="insertAdjacentHTML"){ kind=p; val=n.arguments[1]; }
    if((p==="write"||p==="writeln")&&n.callee.object.type==="Identifier"&&n.callee.object.name==="document"){ kind="document."+p; val=n.arguments[0]; }
  }
  if(!kind) return;
  const parts=val?flatten(val):[];
  let litSoFar="", items=[];
  parts.forEach(p=>{ if(p.lit!==undefined){ litSoFar+=p.lit; return; }
    const tail=litSoFar.slice(-60), inAttr=/=\s*["'][^"']*$/.test(tail);
    items.push({part:txt(u,p.expr).slice(0,80),cls:classify(u,p.expr),inAttr});
    litSoFar+="\u0000"; });
  const emptyClear=val&&val.type==="Literal"&&val.value==="";
  sinks.push({file:u.file,line:lineOf(u,n),kind,emptyClear,parts:items,src:txt(u,n).slice(0,160)});
}));
const sinkSummary={total:sinks.length, byFile:{}, clears:sinks.filter(s=>s.emptyClear).length,
  withNonEscapedOther:sinks.filter(s=>s.parts.some(p=>!/^(esc|numeric|literal|cond:safe)$/.test(p.cls))).length,
  escInAttr:sinks.filter(s=>s.parts.some(p=>p.inAttr&&p.cls==="esc")).map(s=>s.file+":"+s.line)};
sinks.forEach(s=>{ sinkSummary.byFile[s.file]=(sinkSummary.byFile[s.file]||0)+1; });

/* ---- 2. sources from outside the bundle ---- */
const SRC_OBJ=new Set(["location","localStorage","sessionStorage","indexedDB","history"]);
const sources=[];
units.forEach(u=>walk(u.ast,(n,parent)=>{
  let hit=null;
  if(n.type==="MemberExpression"&&!n.computed){
    const o=n.object, p=n.property.name;
    if(o.type==="Identifier"&&SRC_OBJ.has(o.name)) hit=o.name+"."+p;
    if(o.type==="MemberExpression"&&!o.computed&&o.object.type==="Identifier"&&o.object.name==="window"&&SRC_OBJ.has(o.property.name)) hit="window."+o.property.name+"."+p;
    if(o.type==="Identifier"&&o.name==="document"&&["URL","documentURI","referrer","cookie","baseURI"].includes(p)) hit="document."+p;
    if(o.type==="Identifier"&&o.name==="window"&&["name","opener"].includes(p)) hit="window."+p;
    if(p==="dataTransfer"||p==="clipboardData") hit="event."+p;
    if(o.type==="MemberExpression"&&!o.computed&&o.property.name==="clipboard"&&/^read/.test(p)) hit="navigator.clipboard."+p;
  }
  if(n.type==="CallExpression"){
    const c=n.callee;
    if(c.type==="Identifier"&&["fetch","eval","Function","importScripts"].includes(c.name)) hit=c.name+"()";
    if(c.type==="MemberExpression"&&!c.computed&&c.property.name==="addEventListener"&&n.arguments[0]&&n.arguments[0].type==="Literal"&&["message","storage","drop","paste","hashchange","popstate"].includes(n.arguments[0].value)) hit="addEventListener('"+n.arguments[0].value+"')";
  }
  if(n.type==="NewExpression"&&n.callee.type==="Identifier"&&["XMLHttpRequest","FileReader","WebSocket","EventSource","Worker","BroadcastChannel","Function","URLSearchParams"].includes(n.callee.name)) hit="new "+n.callee.name;
  if(hit) sources.push({file:u.file,line:lineOf(u,n),source:hit,context:u.src.slice(Math.max(0,n.start-60),Math.min(u.src.length,n.end+100)).replace(/\s+/g," ")});
}));

/* ---- 3. dead code over the bundle ---- */
const bundleUnits=BUNDLE.map(f=>({file:f,src:read(f),line0:0})).concat(inlineScripts("shell.html"));
bundleUnits.forEach(u=>{ u.ast=u.ast||parse(u.src,u.file); });
const decl={};   /* top-level function name -> {file,line,bytes} (app.js, world.js, symbols.js) */
const allTop=new Set();
bundleUnits.forEach(u=>u.ast.body.forEach(st=>{
  if(st.type==="FunctionDeclaration"){ allTop.add(st.id.name); if(["app.js","world.js","symbols.js"].includes(u.file)) decl[st.id.name]={file:u.file,line:st.loc.start.line,bytes:st.end-st.start}; }
}));
/* references: for each Identifier that is a reference (not a property key, not a declaration id), the enclosing top-level function (or null:
   top-level code) */
const refs={};   /* name -> Set of "from" (top-level function name or "<top>") */
function isRef(n,parent){
  if(!parent) return true;
  if(parent.type==="MemberExpression"&&parent.property===n&&!parent.computed) return false;
  if((parent.type==="Property"||parent.type==="MethodDefinition")&&parent.key===n&&!parent.computed&&parent.value!==n) return false;
  if(parent.type==="FunctionDeclaration"&&parent.id===n) return false;
  if(parent.type==="LabeledStatement"||parent.type==="BreakStatement"||parent.type==="ContinueStatement") return false;
  return true;
}
bundleUnits.forEach(u=>u.ast.body.forEach(st=>{
  const from=st.type==="FunctionDeclaration"?st.id.name:"<top:"+u.file+">";
  walk(st,(n,parent)=>{ if(n.type==="Identifier"&&isRef(n,parent)){ (refs[n.name]=refs[n.name]||new Set()).add(from); } });
}));
/* string references (KEYS run functions are inline; a name in a string, e.g. window[name], is counted as a use) */
const bundleText=bundleUnits.map(u=>u.src).join("\n");
/* reachability from the top-level code */
const live=new Set(), q=[];
Object.keys(refs).forEach(name=>{ refs[name].forEach(f=>{ if(f.startsWith("<top:")&&allTop.has(name)&&!live.has(name)){ live.add(name); q.push(name); } }); });
const callees={};   /* from -> names */
Object.keys(refs).forEach(name=>refs[name].forEach(f=>{ (callees[f]=callees[f]||new Set()).add(name); }));
while(q.length){ const f=q.pop(); (callees[f]||new Set()).forEach(n=>{ if(allTop.has(n)&&!live.has(n)){ live.add(n); q.push(n); } }); }
/* the suites and tools (any file outside the bundle that names the function as a word) */
const testFiles=fs.readdirSync(ROOT).filter(f=>/test\.js$|^audit\.js$|^redteam\.js$/.test(f)).map(f=>path.join(ROOT,f));
(function addTools(d){ fs.readdirSync(d,{withFileTypes:true}).forEach(e=>{ const p=path.join(d,e.name);
  if(e.isDirectory()){ if(!/node_modules|audit-post8/.test(p)) addTools(p); } else if(/\.(js|py|html)$/.test(e.name)) testFiles.push(p); }); })(path.join(ROOT,"tools"));
const testText=testFiles.map(f=>{ try{ return fs.readFileSync(f,"utf8"); }catch(e){ return ""; } }).join("\n");
const dead=[], testOnly=[];
Object.keys(decl).forEach(name=>{
  if(live.has(name)) return;
  const re=new RegExp("\\b"+name.replace(/\$/g,"\\$")+"\\b");
  const inStr=(bundleText.match(new RegExp("[\"']"+name+"[\"']","g"))||[]).length;
  const rec=Object.assign({name,inStrings:inStr},decl[name]);
  if(re.test(testText)) testOnly.push(rec); else dead.push(rec);
});
dead.sort((a,b)=>b.bytes-a.bytes); testOnly.sort((a,b)=>b.bytes-a.bytes);
/* the self-test shipped in the product: AUSTERLITZ_DEBUG's IIFE */
let selfTestBytes=null, debugRange=null;
(function(){ const u=bundleUnits.find(x=>x.file==="app.js");
  u.ast.body.forEach(st=>{ if(st.type==="VariableDeclaration"&&st.declarations.some(d=>d.id.name==="AUSTERLITZ_DEBUG")){ selfTestBytes=st.end-st.start; debugRange=[st.loc.start.line,st.loc.end.line]; } }); })();

/* ---- 4. global mutable state (app.js) ---- */
const appU=bundleUnits.find(x=>x.file==="app.js");
const topBind={};
appU.ast.body.forEach(st=>{ if(st.type==="VariableDeclaration") st.declarations.forEach(d=>{ if(d.id.type==="Identifier") topBind[d.id.name]={kind:st.kind,line:d.loc.start.line}; }); });
const writers={};   /* global -> Set of functions that assign it (whole reassignment, ++/--) */
const mutators={};   /* global -> Set of functions that assign a member of it */
appU.ast.body.forEach(st=>{
  const from=st.type==="FunctionDeclaration"?st.id.name:"<top>";
  walk(st,(n)=>{
    const tgt=n.type==="AssignmentExpression"?n.left:(n.type==="UpdateExpression"?n.argument:null);
    if(!tgt) return;
    if(tgt.type==="Identifier"&&topBind[tgt.name]) (writers[tgt.name]=writers[tgt.name]||new Set()).add(from);
    if(tgt.type==="MemberExpression"){ let o=tgt; while(o.type==="MemberExpression") o=o.object; if(o.type==="Identifier"&&topBind[o.name]) (mutators[o.name]=mutators[o.name]||new Set()).add(from); }
  });
});
const kinds={var:0,let:0,const:0}; Object.values(topBind).forEach(b=>kinds[b.kind]++);
const reassigned=Object.keys(writers).filter(n=>[...writers[n]].some(f=>f!=="<top>"));
const mostWritten=Object.keys(topBind).map(n=>({name:n,line:topBind[n].line,reassignedBy:writers[n]?[...writers[n]].filter(f=>f!=="<top>").length:0,mutatedBy:mutators[n]?[...mutators[n]].filter(f=>f!=="<top>").length:0}))
  .sort((a,b)=>(b.reassignedBy+b.mutatedBy)-(a.reassignedBy+a.mutatedBy)).slice(0,25);
const fnCount=appU.ast.body.filter(s=>s.type==="FunctionDeclaration").length;

/* ---- 5. mirrored logic ---- */
function grepFiles(re,files){ const out=[]; files.forEach(f=>{ const s=read(f); s.split("\n").forEach((l,i)=>{ if(re.test(l)) out.push(f+":"+(i+1)); }); }); return out; }
const suites=["css-test.js","test.js","geo-test.js","terrain-test.js","audit.js","sim-test.js","redteam.js","runtime-test.js","binding-test.js"];
const mirrors={
  animGLSL_animAt:{decl:grepFiles(/^function (animGLSL|animAt)\b|^var (animGLSL|animAt)\b/,["app.js"]), suites:grepFiles(/\banimAt\b/,suites).slice(0,12), selftest:grepFiles(/\banimAt\(/,["app.js"]).length},
  groundY_groundYFast:{decl:grepFiles(/^function (groundY|groundYFast)\b/,["world.js"]), suites:grepFiles(/\bgroundYFast\b/,suites).slice(0,12)}
};

const res={generated:new Date().toISOString(), files:units.map(u=>u.file+(u.line0?"@"+(u.line0+1):"")),
  sinks:{summary:sinkSummary, list:sinks}, externalSources:sources,
  deadCode:{topLevelFunctions:Object.keys(decl).length, live:Object.keys(decl).filter(n=>live.has(n)).length, testOrToolOnly:testOnly, dead,
    deadBytes:dead.reduce((s,d)=>s+d.bytes,0), testOnlyBytes:testOnly.reduce((s,d)=>s+d.bytes,0), selfTestIIFE:{bytes:selfTestBytes,lines:debugRange}, appBytes:appU.src.length},
  globals:{appTopLevelBindings:kinds, appTopLevelFunctions:fnCount, reassignedFromFunctions:reassigned.length, mostWritten},
  mirrors};
fs.mkdirSync(OUT,{recursive:true});
fs.writeFileSync(path.join(OUT,"static-scan.json"),JSON.stringify(res,null,1));
console.log(JSON.stringify({sinks:sinkSummary, sources:sources.map(s=>s.file+":"+s.line+" "+s.source), dead:dead.length, deadBytes:res.deadCode.deadBytes, testOnly:testOnly.length,
  testOnlyBytes:res.deadCode.testOnlyBytes, selfTest:res.deadCode.selfTestIIFE, globals:res.globals.appTopLevelBindings, reassigned:reassigned.length, fns:fnCount, mirrors},null,1));
