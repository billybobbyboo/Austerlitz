/* UI/UX roadmap step 3 (docs/UX_ART_AUDIT.md UA-02): the shared page opener of the step's tools. A page of any build at a desktop's size (density
   1, a mouse) or a phone's (density 3, touch, an iPhone's user agent: Chromium's emulation, not a physical device), three.js r128 served from the
   local copy checked against the page's integrity (tools/visual/three-route.js), started with ?harness=1 (deterministic frames), the console's
   warnings and errors kept. Measurement only: nothing here is a build's. */
"use strict";
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const ROOT=path.resolve(__dirname,"..",".."), TR=require(path.join(ROOT,"tools","visual","three-route.js"));
const { chromium } = require("playwright");
const UA_IOS="Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
function buildInfo(html){ const b=fs.readFileSync(html); return {file:path.relative(ROOT,html), bytes:b.length, md5:crypto.createHash("md5").update(b).digest("hex"), sha256:crypto.createHash("sha256").update(b).digest("hex")}; }
async function launch(){ return chromium.launch({executablePath:process.env.AUSTERLITZ_CHROME||undefined,args:["--use-angle=swiftshader","--enable-unsafe-swiftshader","--ignore-gpu-blocklist"]}); }
async function open(browser,html,o){ o=o||{};
  TR.checkIntegrity(html);
  const vp=o.vp||[1440,900], phone=!!o.phone;
  const ctx=await browser.newContext(phone?{viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:3,isMobile:true,hasTouch:true,userAgent:UA_IOS}:{viewport:{width:vp[0],height:vp[1]},deviceScaleFactor:1,reducedMotion:o.reduced?"reduce":"no-preference"});
  const p=await ctx.newPage(), errs=[]; p.on("pageerror",e=>errs.push("pageerror: "+e.message)); p.on("console",m=>{ if(m.type()==="error"||m.type()==="warning") errs.push(m.type()+": "+m.text()); });
  if(o.reduced) await p.emulateMedia({reducedMotion:"reduce"});
  await TR.routeThree(p); await p.goto("file://"+path.resolve(html)+(o.query===undefined?"?harness=1":o.query),{waitUntil:"commit",timeout:180000}); await TR.waitBoot(p,240000);
  p.__errs=errs; p.__phone=phone; return p; }
async function settle(p,n){ await p.evaluate(k=>AUSTERLITZ_DEBUG.settle(k),n||30); await p.waitForTimeout(200); }
/* the card closed by a real press; the pointer parked off the map (tools/visual/motion.js parks it at 2, 2) */
async function closeCard(p){ if(p.__phone) await p.tap("#fr-close",{timeout:60000}); else { await p.click("#fr-close",{timeout:60000}); await p.mouse.move(2,2); } }
const q=(a,pp)=>{ if(!a.length) return null; const s=a.slice().sort((x,y)=>x-y); return s[Math.min(s.length-1,Math.floor(s.length*pp))]; };
module.exports={ROOT, TR, buildInfo, launch, open, settle, closeCard, q, UA_IOS};
