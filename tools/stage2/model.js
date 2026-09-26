/* Stage 2 Part A: load the model (not the scene) into a node vm context, from the live sources.
   geo.js, tokens.js, data.js and world.js are evaluated whole (world.js with a minimal THREE stub, as
   tools/mk-world-mod.js does); from app.js only the named top-level declarations are taken, by acorn.
   Used by the measurement scripts in this folder; bundles nothing, changes nothing. */
const fs=require("fs"), path=require("path"), vm=require("vm"), acorn=require("acorn");
const ROOT=path.resolve(__dirname,"..","..");
const read=f=>fs.readFileSync(path.join(ROOT,f),"utf8");
const THREE_STUB="var THREE={Color:function(h){this.r=((h>>16)&255)/255;this.g=((h>>8)&255)/255;this.b=(h&255)/255;},CanvasTexture:function(c){this.image=c;},RepeatWrapping:1,ClampToEdgeWrapping:2};"+
  "THREE.Color.prototype.convertSRGBToLinear=function(){return this;};";
function appDecls(names){
  const src=read("app.js"), ast=acorn.parse(src,{ecmaVersion:2020,sourceType:"script"}), out=[];
  const want=new Set(names), found=new Set();
  ast.body.forEach(n=>{
    let ids=[];
    if(n.type==="FunctionDeclaration") ids=[n.id.name];
    else if(n.type==="VariableDeclaration") ids=n.declarations.map(d=>d.id.name);
    if(ids.some(i=>want.has(i))){ out.push(src.slice(n.start,n.end)); ids.forEach(i=>found.add(i)); }
  });
  const miss=names.filter(n=>!found.has(n)); if(miss.length) throw new Error("app.js: not found: "+miss.join(", "));
  return out.join("\n");
}
function load(extra){
  const ctx={console}; vm.createContext(ctx);
  const code=[THREE_STUB, read("geo.js"), read("tokens.js"), read("data.js"), read("analysis.js"), read("world.js"),
    appDecls(["OVERLAYS","clamp01","phaseAt","anchorList","legPath","pointOnPath","legWindow","legAt","posAtClock","notYetAt","goneAt",
              "leavesOf"].concat(extra||[])),
    "this.X={GEOREF,FORMATIONS,PHASES,OVERLAYS,EVENTS,W,height,hAt,localHeight,anchorList,legPath,pointOnPath,legWindow,legAt,posAtClock,notYetAt,goneAt,leavesOf,"+
    "SATS,MENI,PBERG,SANTON,ZURAN,VINO,PRAT,GOLDBACH,LITAVA,TERRAIN_LINES,VILLAGES};"].join("\n;\n");
  vm.runInContext(code,ctx,{filename:"model"});
  return ctx.X;
}
module.exports={load,ROOT,read};
