/* The overclaim scan's reader (roadmap step 1, H-8, docs/FINAL_AUDIT.md; owner decision 131). Read-only: it changes no file and
   loads no page. redteam.js section 6a judges what it returns.
   Every string a visitor can be shown, with where it is:
     - every string of every guarded declaration (tools/visual/data-invariance.js DATA, read from that file so the two cannot drift),
       walked in the source's syntax tree with a data path (FEATURES[#satschan].story, PHASES[3].lede, KEYS[#h].text: an array element
       is named by its id where it has one);
     - every string literal and template part of the presentation code (every file build.py joins, read from build.py's file list so a
       new source file cannot be missed), a "+" chain folded into one string with "…" for its non-literal parts, so that a phrase split
       across a chain is still seen;
     - tokens.js's TOKENS, walked as the JSON it is (its labels: the going key, the type stacks);
     - shell.html's text nodes and visitor attributes (title, aria-label, alt, placeholder, aria-description, aria-roledescription,
       aria-valuetext, content), outside <script>, <style> and comments, entities decoded; a text node is named by its nearest
       enclosing element with an id (p#fr-key text).
   Each record says whether it is judged and, if not, why:
     "code"      a property key, a member name, an operand of a comparison, "in" or "instanceof", a case label, a data: URI, or a
                 selector, id, class, event, attribute-name, media-query or storage-key argument of a DOM call (classList's methods
                 only on a classList); setAttribute's value unless the attribute is one a visitor is shown;
     "developer" AUSTERLITZ_DEBUG (the self-test and debug API, decision 140) and console arguments, which never reach the page;
     "verbatim"  appearance.js's q and v inside a claim (an object with src): the source's own words, as printed, which a modern
                 overclaim pattern must not judge. A v outside a claim (a disputed value's own words) is judged.
   Text is normalised before it is judged: soft hyphens and zero-width characters removed, every run of white space one space, so a
   phrase cannot hide across a line break.
   module.exports(ROOT) -> {records:[{file,line,decl,path,text,guarded,skip}], guarded:Set, missing:[guarded names not declared], files} */
const fs=require("fs"), path=require("path");
module.exports=function langScan(ROOT){
  let acorn; try{ acorn=require("acorn"); }catch(e){ acorn=require(path.join(ROOT,"node_modules","acorn")); }
  const di=fs.readFileSync(path.join(ROOT,"tools/visual/data-invariance.js"),"utf8");
  const dm=di.match(/const DATA=(\{[\s\S]*?\n\});/);
  if(!dm) throw new Error("lang-scan: DATA not found in tools/visual/data-invariance.js");
  const DATA=Function("return ("+dm[1]+")")();
  const GUARDED=new Set([].concat(...Object.values(DATA)));
  const APPEARANCE=new Set(["APPEARANCE_SOURCES","DRESS","COMPOSITION","COLOURS_CARRIED","STANDARD_MEASURES"]);
  const DEV=new Set(["AUSTERLITZ_DEBUG"]);
  const CODE_CALL=/^(querySelector|querySelectorAll|getElementById|getElementsByClassName|getElementsByTagName|closest|matches|addEventListener|removeEventListener|createElement|createElementNS|getAttribute|removeAttribute|hasAttribute|getContext|setProperty|getPropertyValue|matchMedia|dispatchEvent|getExtension|getItem|setItem|removeItem)$/;
  const CLASS_CALL=/^(add|remove|toggle|contains)$/;   /* code only on a classList */
  const VISITOR_ATTR=/^(aria-label|title|alt|aria-description|aria-roledescription|placeholder|aria-valuetext)$/;
  const norm=t=>String(t).replace(/[­​-‍⁠]/g,"").replace(/\s+/g," ").trim();
  const records=[], declared=new Set();
  const keyName=k=>k.type==="Identifier"?k.name:String(k.value);
  const seg=n=>/^[A-Za-z_$][\w$]*$/.test(n)?"."+n:"["+JSON.stringify(n)+"]";
  const isStr=n=>!!n&&((n.type==="Literal"&&typeof n.value==="string")||n.type==="TemplateLiteral");
  const strOf=n=>n.type==="Literal"?n.value:n.quasis.map(q=>q.value.cooked).join("…");
  const flat=(n,o)=>{ if(n.type==="BinaryExpression"&&n.operator==="+"){ flat(n.left,o); flat(n.right,o); } else o.push(n); return o; };
  function lineAt(src){ const nl=[0]; for(let i=0;i<src.length;i++) if(src.charCodeAt(i)===10) nl.push(i+1);
    return pos=>{ let lo=0,hi=nl.length-1; while(lo<hi){ const m=(lo+hi+1)>>1; if(nl[m]<=pos) lo=m; else hi=m-1; } return lo+1; }; }
  /* a string in a code position: what it is, or null (a string a visitor may be shown) */
  function codeSpot(node,par){
    if(!par) return null;
    if(par.type==="Property"&&par.key===node&&!par.computed) return "property key";
    if(par.type==="MemberExpression"&&par.property===node) return "member name";
    if(par.type==="BinaryExpression"&&/^(===|!==|==|!=|in|instanceof)$/.test(par.operator)) return "comparison";
    if(par.type==="SwitchCase"&&par.test===node) return "case label";
    if(par.type==="CallExpression"&&par.arguments.includes(node)){
      const c=par.callee, nm=c.type==="MemberExpression"?keyName(c.property):(c.type==="Identifier"?c.name:"");
      if(c.type==="MemberExpression"&&c.object.type==="Identifier"&&c.object.name==="console") return "developer";
      if(CODE_CALL.test(nm)) return nm;
      if(CLASS_CALL.test(nm)&&c.type==="MemberExpression"&&c.object.type==="MemberExpression"&&keyName(c.object.property)==="classList") return "classList";
      if(nm==="setAttribute"){ const a0=par.arguments[0]; if(a0===node) return "attribute name";
        if(a0&&a0.type==="Literal"&&!VISITOR_ATTR.test(a0.value)) return "attribute "+a0.value; } }
    return null;
  }
  function walk(node,cx,par){
    if(!node||typeof node.type!=="string") return;
    if(node.type==="BinaryExpression"&&node.operator==="+"){
      const parts=flat(node,[]);
      if(parts.some(isStr)){
        put(cx,node,parts.map(x=>isStr(x)?strOf(x):"…").join(""),par);
        parts.forEach(x=>{ if(x.type==="TemplateLiteral") x.expressions.forEach(e=>walk(e,cx,x)); else if(!isStr(x)) walk(x,cx,node); });
        return; } }
    if(isStr(node)){ put(cx,node,strOf(node),par); if(node.type==="TemplateLiteral") node.expressions.forEach(e=>walk(e,cx,node)); return; }
    if(node.type==="ObjectExpression"){
      const claim=node.properties.some(p=>p.type==="Property"&&!p.computed&&keyName(p.key)==="src");
      node.properties.forEach(p=>{
        if(p.type!=="Property"){ walk(p,cx,node); return; }
        if(p.computed) walk(p.key,cx,p);
        walk(p.value,Object.assign({},cx,{path:cx.path+(p.computed?"[?]":seg(keyName(p.key))),claim,key:p.computed?null:keyName(p.key)}),p); });
      return; }
    if(node.type==="ArrayExpression"){
      node.elements.forEach((e,i)=>{ let s="["+i+"]";
        if(e&&e.type==="ObjectExpression"){ const id=e.properties.find(p=>p.type==="Property"&&!p.computed&&keyName(p.key)==="id"&&p.value.type==="Literal"); if(id) s="[#"+id.value.value+"]"; }
        walk(e,Object.assign({},cx,{path:cx.path+s,key:null}),node); });
      return; }
    if(/Function/.test(node.type)){ const sub=Object.assign({},cx,{key:null,fn:(cx.fn||0)+1}); node.params.forEach(x=>walk(x,sub,node)); walk(node.body,sub,node); return; }
    for(const k in node){ if(k==="type"||k==="start"||k==="end") continue; const v=node[k];
      if(Array.isArray(v)) v.forEach(x=>walk(x,cx,node)); else if(v&&typeof v.type==="string") walk(v,cx,node); }
  }
  function put(cx,node,text,par){
    let skip=null;
    if(cx.dev) skip="developer";
    else if(/^data:/.test(text)) skip="code";
    else if(cx.guarded&&APPEARANCE.has(cx.decl)&&cx.claim&&(cx.key==="q"||cx.key==="v")) skip="verbatim";
    /* presentation code; and a guarded function's body, the model's code (a guarded data value outside a function is always judged) */
    else if(!cx.guarded||cx.fn){ const c=codeSpot(node,par); if(c) skip=c==="developer"?"developer":"code"; }
    records.push({file:cx.file,line:cx.line(node.start),decl:cx.decl,path:cx.path,text:norm(text),guarded:cx.guarded,skip});
  }
  /* the files the build joins: build.py's one literal file list (the line tools/fresh.js reads too) */
  const bm=fs.readFileSync(path.join(ROOT,"build.py"),"utf8").match(/for f in (\[[^\]]+\])/);
  if(!bm) throw new Error("lang-scan: the file list not found in build.py");
  const BUILT=JSON.parse(bm[1].replace(/'/g,'"'));
  BUILT.filter(f=>f!=="tokens.js").forEach(f=>{
    const src=fs.readFileSync(path.join(ROOT,f),"utf8"), line=lineAt(src);
    acorn.parse(src,{ecmaVersion:2020,sourceType:"script"}).body.forEach(n=>{
      const name=n.type==="FunctionDeclaration"?n.id.name:(n.type==="VariableDeclaration"?n.declarations.map(d=>d.id.name).join(","):"<"+n.type+">");
      declared.add(name);
      const cx={file:f,line,decl:name,guarded:GUARDED.has(name),dev:DEV.has(name),path:name,claim:false,key:null,fn:0};
      if(n.type==="VariableDeclaration") n.declarations.forEach(d=>walk(d.init,Object.assign({},cx,{path:d.id.name}),d));
      else walk(n,cx,null);
    });
  });
  { const src=fs.readFileSync(path.join(ROOT,"tokens.js"),"utf8"), tm=src.match(/\/\*TOKENS:BEGIN\*\/([\s\S]*)\/\*TOKENS:END\*\//);
    if(!tm) throw new Error("lang-scan: the TOKENS markers not found in tokens.js");
    (function w(v,p){ if(typeof v==="string") records.push({file:"tokens.js",line:0,decl:"TOKENS",path:p,text:norm(v),guarded:false,skip:null});
      else if(Array.isArray(v)) v.forEach((x,i)=>w(x,p+"["+i+"]")); else if(v&&typeof v==="object") Object.keys(v).forEach(k=>w(v[k],p+seg(k))); })(JSON.parse(tm[1]),"TOKENS"); }
  { const raw=fs.readFileSync(path.join(ROOT,"shell.html"),"utf8"), line=lineAt(raw);
    const blank=m=>m.replace(/[^\n]/g," ");   /* blanked, not removed, so that line numbers hold */
    const src=raw.replace(/<script[\s\S]*?<\/script>/gi,blank).replace(/<style[\s\S]*?<\/style>/gi,blank).replace(/<!--[\s\S]*?-->/g,blank);
    const ent=t=>t.replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#(\d+);/g,(m,d)=>String.fromCharCode(+d)).replace(/&#x([0-9a-f]+);/gi,(m,h)=>String.fromCharCode(parseInt(h,16))).replace(/&[a-z][a-z0-9]*;/gi," ");
    const VOID=/^(area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)$/i, open=[];
    const re=/<([a-zA-Z][\w-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>|<\/([a-zA-Z][\w-]*)\s*>|<[!?][^>]*>|([^<]+)/g; let m;
    while((m=re.exec(src))){
      if(m[5]!==undefined){ const t=norm(ent(m[5])); if(t){ const at=[...open].reverse().find(o=>o.id);
        records.push({file:"shell.html",line:line(m.index),decl:"shell.html",path:(at?at.tag+"#"+at.id+" ":"")+"text",text:t,guarded:false,skip:null}); } continue; }
      if(m[4]){ const k=open.map(o=>o.tag).lastIndexOf(m[4].toLowerCase()); if(k>=0) open.length=k; continue; }
      if(!m[1]) continue;
      const idm=(m[2]||"").match(/\bid\s*=\s*"([^"]*)"/), dv=(m[2]||"").match(/\bdata-v\s*=\s*"([^"]*)"/);
      const tag=m[1].toLowerCase();
      if(!m[3]&&!VOID.test(tag)) open.push({tag,id:idm?idm[1]:null});
      const ar=/([\w:-]+)\s*=\s*("([^"]*)"|'([^']*)')/g; let a;
      while((a=ar.exec(m[2]||""))){ const nm=a[1].toLowerCase(), v=a[3]!==undefined?a[3]:a[4];
        if(VISITOR_ATTR.test(nm)||nm==="content")
          records.push({file:"shell.html",line:line(m.index),decl:"shell.html",path:tag+(idm?"#"+idm[1]:dv?"[data-v="+dv[1]+"]":"")+"@"+nm,text:norm(ent(v)),guarded:false,skip:null}); } } }
  const missing=[...GUARDED].filter(n=>!declared.has(n));
  return {records,guarded:GUARDED,missing,files:BUILT.concat(["shell.html"])};
};
