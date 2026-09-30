/* Stage 2F: world.js (with geo.js, tokens.js and data.js) evaluated inside one function scope, with a minimal THREE stub,
   exposing the named top-level declarations of world.js. Measurement only (tools/stage2/cover-2f.js); bundles nothing and
   changes nothing. const X=require("./wmodel.js").load(["coverClass","covAt",...]); X.buildCover(); ... */
const fs=require("fs"), path=require("path"), vm=require("vm");
const ROOT=path.resolve(__dirname,"..",".."), read=f=>fs.readFileSync(path.join(ROOT,f),"utf8");
const STUB="var THREE={Color:function(h){this.r=((h>>16)&255)/255;this.g=((h>>8)&255)/255;this.b=(h&255)/255;},CanvasTexture:function(c){this.image=c;},RepeatWrapping:1,ClampToEdgeWrapping:2};"+
  "THREE.Color.prototype.convertSRGBToLinear=function(){return this;};THREE.Color.prototype.setHex=function(h){THREE.Color.call(this,h);return this;};";
function load(names){
  const code="(function(){"+[STUB,read("geo.js").replace(/if\s*\(typeof module[\s\S]*$/,""),read("tokens.js"),read("data.js"),read("world.js"),
    "return {"+names.map(n=>JSON.stringify(n)+":function(){return "+n+";}").join(",")+"};"].join("\n;\n")+"})()";
  const G=vm.runInThisContext(code,{filename:"world"}), out={};
  names.forEach(n=>Object.defineProperty(out,n,{get:G[n],enumerable:true})); return out;
}
module.exports={load,ROOT,read};
