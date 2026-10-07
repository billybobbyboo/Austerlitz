#!/usr/bin/env node
/* Final audit (docs/FINAL_AUDIT.md, dimension 7): what makes up the built file's size. No page; reads the sources and the build.
   node tools/audit/size.js [--json out.json]
   Per source file: bytes in the build, comment bytes (acorn's onComment), and for app.js the largest top-level declarations and the
   self-test (AUSTERLITZ_DEBUG), which every visitor downloads. assets.js: each embedded texture's data URI. Measurement only. */
const fs=require("fs"), path=require("path"), acorn=require("acorn");
const ROOT=path.resolve(__dirname,"..","..");
const argv=process.argv.slice(2), jsonOut=argv.includes("--json")?argv[argv.indexOf("--json")+1]:null;
const FILES=['assets.js','tokens.js','geo.js','data.js','appearance.js','analysis.js','world.js','symbols.js','app.js'];
const html=fs.readFileSync(path.join(ROOT,"austerlitz-command-map.html"));
const B=s=>Buffer.byteLength(s,"utf8");
const out={html:{bytes:html.length},files:[],css:null,shell:null,appTop:[],assets:[]};
for(const f of FILES){
  const src=fs.readFileSync(path.join(ROOT,f),"utf8");
  let com=0, ast;
  try{ ast=acorn.parse(src,{ecmaVersion:2020,sourceType:"script",onComment:(block,text)=>{ com+=B(text)+(block?4:2); }}); }catch(e){ ast=null; }
  out.files.push({file:f,bytes:B(src),commentBytes:com,commentShare:+(com/B(src)).toFixed(3)});
  if(f==="app.js"&&ast){
    for(const n of ast.body){
      let name=n.type;
      if(n.type==="FunctionDeclaration") name=n.id.name;
      else if(n.type==="VariableDeclaration") name=n.declarations.map(d=>d.id.name||"?").join(",");
      else if(n.type==="ExpressionStatement"&&n.expression.type==="AssignmentExpression") name=src.slice(n.expression.left.start,n.expression.left.end);
      else if(n.type==="ExpressionStatement") name="expr@"+src.slice(0,n.start).split("\n").length;
      out.appTop.push({name,bytes:B(src.slice(n.start,n.end)),line:src.slice(0,n.start).split("\n").length});
    }
    out.appTop.sort((a,b)=>b.bytes-a.bytes);
  }
  if(f==="assets.js"){
    const re=/(\w+):\s*"(data:[^"]+)"/g; let m, stack=[];
    /* the keys are nested (mud:{diff:...}); report each data URI with the two keys before it */
    const keyRe=/(\w+):\{/g; let km; const opens=[]; while((km=keyRe.exec(src))) opens.push([km.index,km[1]]);
    while((m=re.exec(src))){ const parent=opens.filter(o=>o[0]<m.index).pop(); out.assets.push({key:(parent?parent[1]+".":"")+m[1],mime:m[2].slice(5,m[2].indexOf(";")),bytes:m[2].length}); }
  }
}
out.css={bytes:B(fs.readFileSync(path.join(ROOT,"style.css"),"utf8"))};
out.shell={bytes:B(fs.readFileSync(path.join(ROOT,"shell.html"),"utf8"))-B("/*CSS*/")-B("/*JS*/")};
const dbg=out.appTop.find(t=>/AUSTERLITZ_DEBUG/.test(t.name));
out.selfTest=dbg?{name:dbg.name,bytes:dbg.bytes,shareOfHtml:+(dbg.bytes/html.length).toFixed(3),line:dbg.line}:null;
const tot=out.files.reduce((a,f)=>a+f.bytes,0)+out.css.bytes+out.shell.bytes;
out.sumOfParts=tot;
console.log("built file:",html.length,"bytes; parts (sources + css + shell):",tot);
for(const f of out.files) console.log(("  "+f.file).padEnd(18),String(f.bytes).padStart(8),"bytes",(100*f.bytes/html.length).toFixed(1).padStart(5)+"%","  comments",String(f.commentBytes).padStart(7),(100*f.commentShare).toFixed(0)+"%");
console.log("  style.css".padEnd(18),String(out.css.bytes).padStart(8),"bytes");
console.log("  shell.html".padEnd(18),String(out.shell.bytes).padStart(8),"bytes (without the two markers)");
console.log("embedded textures (assets.js):"); for(const a of out.assets) console.log("  ",a.key.padEnd(18),a.mime.padEnd(11),a.bytes);
console.log("app.js: the ten largest top-level statements:"); for(const t of out.appTop.slice(0,10)) console.log("  ",String(t.bytes).padStart(7),"line",String(t.line).padStart(5),t.name.slice(0,60));
if(out.selfTest) console.log("the in-app self-test and debug API ("+out.selfTest.name+", app.js:"+out.selfTest.line+"):",out.selfTest.bytes,"bytes,",(100*out.selfTest.shareOfHtml).toFixed(1)+"% of the built file");
const allCom=out.files.reduce((a,f)=>a+f.commentBytes,0); console.log("comments in the bundled scripts:",allCom,"bytes,",(100*allCom/html.length).toFixed(1)+"% of the built file");
if(jsonOut) fs.writeFileSync(jsonOut,JSON.stringify(out,null,1));
