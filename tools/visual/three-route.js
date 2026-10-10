/* Roadmap step 3 (decision 133 (a); docs/FINAL_AUDIT.md SW-1): one way for every page tool to serve three.js r128 from the local copy, and to
   wait for the page to start.
   - THREE_LOCAL: AUSTERLITZ_THREE, else tools/visual/three.min.js, else node_modules/three/build/three.min.js (three 0.128.0).
   - routeThree(page): the cdnjs request answered from THREE_LOCAL, with an explicit access-control-allow-origin, since the page's script tag
     carries crossorigin="anonymous" and an integrity hash (a CORS fetch: without the header the browser would block the script).
   - integrityOf(html) / checkIntegrity(html): the tag's integrity against THREE_LOCAL hashed the same way; a mismatch stops the tool at once,
     naming both values (an archived build without the attribute is not checked).
   - waitBoot(page): the boot screen gone and the scene made, or the start-up guard's failure (AUS_BOOT.failed) reported at once instead of
     a 240 s timeout. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const ROOT=path.join(__dirname,"..","..");
const THREE_LOCAL=[process.env.AUSTERLITZ_THREE, path.join(__dirname,"three.min.js"),
  path.resolve("node_modules/three/build/three.min.js"), path.join(ROOT,"node_modules","three","build","three.min.js")].find(p=>p&&fs.existsSync(p))||null;
const THREE_RE=/three(\.min)?\.js$/;
function integrityOf(html){
  const t=fs.readFileSync(html,"utf8"), m=/<script\b[^>]*\bsrc="[^"]*three(?:\.min)?\.js"[^>]*>/.exec(t);
  if(!m) return null; const i=/\bintegrity="([^"]+)"/.exec(m[0]); return i?i[1]:null;
}
function hashAs(sri,file){ const alg=sri.split("-")[0]; return alg+"-"+crypto.createHash(alg).update(fs.readFileSync(file)).digest("base64"); }
function checkIntegrity(html){
  const sri=integrityOf(html); if(!sri||!THREE_LOCAL) return {sri:sri,local:THREE_LOCAL,ok:true};
  const got=hashAs(sri,THREE_LOCAL);
  if(got!==sri) throw new Error("three.js: the page's integrity "+sri+" does not match "+THREE_LOCAL+" ("+got+"): the routed copy would be blocked");
  return {sri:sri,local:THREE_LOCAL,ok:true};
}
async function routeThree(page){
  if(!THREE_LOCAL) return false;
  await page.route(THREE_RE,r=>r.fulfill({path:THREE_LOCAL,contentType:"application/javascript",headers:{"access-control-allow-origin":"*"}}));
  return true;
}
async function waitBoot(page,timeout){
  const h=await page.waitForFunction(()=>(!document.getElementById("boot")&&typeof window.camera!=="undefined")||
    (window.AUS_BOOT&&window.AUS_BOOT.failed?{failed:window.AUS_BOOT.failed}:false),null,{timeout:timeout||240000,polling:500});
  const v=await h.jsonValue();
  if(v&&v.failed) throw new Error("the page could not start: "+JSON.stringify(v.failed));
  return true;
}
module.exports={THREE_LOCAL,THREE_RE,integrityOf,checkIntegrity,routeThree,waitBoot};
