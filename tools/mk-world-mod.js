/* Regenerate _world_mod.js (world.js as a CommonJS module for the test suites) from the live world.js. */
const fs=require('fs'), path=require('path'); const ROOT=path.join(__dirname,'..');
const stub='global.GEOREF=require("./geo.js");\nglobal.THREE={Color:class{constructor(h){this.setHex(h||0)}setHex(h){this.r=((h>>16)&255)/255;this.g=((h>>8)&255)/255;this.b=(h&255)/255;return this}multiplyScalar(k){this.r*=k;this.g*=k;this.b*=k;return this}convertSRGBToLinear(){const f=x=>x<0.04045?x/12.92:Math.pow((x+0.055)/1.055,2.4);this.r=f(this.r);this.g=f(this.g);this.b=f(this.b);return this}copy(c){this.r=c.r;this.g=c.g;this.b=c.b;return this}clone(){const c=new this.constructor();c.r=this.r;c.g=this.g;c.b=this.b;return c}},CanvasTexture:class{constructor(c){this.image=c}},RepeatWrapping:1,ClampToEdgeWrapping:2,sRGBEncoding:3001,LinearMipmapLinearFilter:1008};\n';
const w=fs.readFileSync(path.join(ROOT,'world.js'),'utf8');
/* Stage 4E: world.js reads the paper map's ground colours from TOKENS (tokens.js precedes it in the build), so the module gets them too */
const tk=fs.readFileSync(path.join(ROOT,'tokens.js'),'utf8').match(/\/\*TOKENS:BEGIN\*\/([\s\S]*)\/\*TOKENS:END\*\//)[1];
const tokens='global.TOKENS='+tk.trim()+';\n';
const exp='\nmodule.exports={height,hAt,W,buildCover,buildGrid,covAt,smoothstep,vnoise,pnoise,hash2,gridAt,\n get covWater(){return covWater}, get covMarsh(){return covMarsh}, get covWood(){return covWood},\n get covVill(){return covVill}, get covRoad(){return covRoad}, get covVine(){return covVine},\n get gridCurv(){return gridCurv}, get gridH(){return gridH}, SATS,MENI,VILLAGES,ROADS,LITAVA,GOLDBACH,BROOKS,TERRAIN_LINES,CONTOUR_INTERVAL,UNITS_PER_KM,\n PRAT,VINO,PBERG,SANTON,ZURAN,SLAV,SCHLAP,localHeight,regionalH,regionalLevel,coverClass,UNITS_PER_KM};\n';
fs.writeFileSync(path.join(ROOT,'_world_mod.js'),stub+tokens+w+exp,'utf8');
console.log('_world_mod.js regenerated from world.js');
