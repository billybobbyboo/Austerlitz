#!/usr/bin/env node
/* The final audits' Stage 7, WP-14 (CL-ROB-10): no dead top-level function, and no comment naming a function the code does not have.
   Reads the bundle's sources in build.py's order (acorn): (1) every top-level function declaration is referenced by some identifier in the
   code (comments do not count), but those UNCALLED names, each with its reason; (2) every camelCase word a comment uses as a name (followed
   by "(", ":", "," or ")") is an identifier or a string's word somewhere in the code, but those GHOSTS names, each with its kind. The audit
   found gaitDist defined and called by nothing while the gait's comment named it, and v8Near defined and called by nothing.
   node tools/final-stage7/dead-code.js [repo root]   exit 1 on a finding. Run by tools/final-stage7/mutate.js's controls. */
"use strict";
const fs=require("fs"), path=require("path");
const ROOT=path.resolve(process.argv[2]||process.cwd()), acorn=require(path.join(ROOT,"node_modules","acorn"));
const UNCALLED={
  posOf:"test-only: the movement model's position, read by the suites and held by check:data's model list (tools/visual/data-invariance.js)"
};
const GHOSTS={
  mapX:"a data field's name (data.js: a track point [mapX, mapY])",
  phaseFrom:"a data field's name (analysis.js: [phaseFrom, state])",
  hashOf:"a tool's function (tools/step4/statements.js)",
  smokeShare:"a tool's measure (tools/visual/measure.js)",
  emulateMedia:"Playwright's function, named in a comment on the harness",
  initGLContext:"three r128's own function, named in WP-14's comment on the restore",
  sRGB:"a word, the colour space",
  placeFootprint:"history: the functions Stage 5B replaced (makeFootprint and placeFootprint)",
  legendGlyph:"history: the legend's sample, now drawn from the one glyph table",
  timeTip:"history: the timeline's tip before Stage 5's one tooltip"
};
const bp=fs.readFileSync(path.join(ROOT,"build.py"),"utf8"), m=/for f in (\[[^\]]+\])/.exec(bp);
const files=JSON.parse(m[1].replace(/'/g,'"'));
const decl=new Map(), refs=new Set(), words=new Set(), named=new Map(), bad=[];
function walk(n,par,f){ if(!n||typeof n.type!=="string") return;
  if(n.type==="Identifier"){ words.add(n.name);
    const isDecl=par&&par.type==="FunctionDeclaration"&&par.id===n, isProp=par&&((par.type==="MemberExpression"&&par.property===n&&!par.computed)||(par.type==="Property"&&par.key===n&&!par.computed));
    if(!isDecl&&!isProp) refs.add(n.name); }
  if(n.type==="Literal"&&typeof n.value==="string") n.value.split(/[^\w$]+/).forEach(x=>words.add(x));
  if(n.type==="TemplateElement") String(n.value.cooked||"").split(/[^\w$]+/).forEach(x=>words.add(x));
  for(const k in n){ const v=n[k]; if(Array.isArray(v)) v.forEach(c=>walk(c,n,f)); else if(v&&typeof v.type==="string") walk(v,n,f); } }
files.forEach(f=>{ const src=fs.readFileSync(path.join(ROOT,f),"utf8");
  const ast=acorn.parse(src,{ecmaVersion:2020,onComment:(block,t)=>{ const re=/\b([a-z][a-z0-9]*[A-Z][A-Za-z0-9]*)(?=[(:,)])/g; let q; while((q=re.exec(t))) if(!named.has(q[1])) named.set(q[1],f); }});
  ast.body.forEach(n=>{ if(n.type==="FunctionDeclaration") decl.set(n.id.name,f); });
  walk(ast,null,f); });
const dead=[...decl.keys()].filter(k=>!refs.has(k)&&!UNCALLED[k]);
dead.forEach(k=>bad.push(k+" ("+decl.get(k)+") is a top-level function never called: remove it, or name its reason in UNCALLED"));
Object.keys(UNCALLED).forEach(k=>{ if(!decl.has(k)) bad.push("UNCALLED names "+k+", which is not a top-level function: remove the entry");
  else if(refs.has(k)) bad.push("UNCALLED names "+k+", which is called: remove the entry"); });
const ghost=[...named.keys()].filter(k=>!words.has(k)&&!GHOSTS[k]);
ghost.forEach(k=>bad.push("a comment in "+named.get(k)+" names a function the code does not have: "+k+" (name it right, or give its kind in GHOSTS)"));
Object.keys(GHOSTS).forEach(k=>{ if(!named.has(k)) bad.push("GHOSTS names "+k+", which no comment names: remove the entry");
  else if(words.has(k)) bad.push("GHOSTS names "+k+", which the code has: remove the entry"); });
if(bad.length){ bad.forEach(b=>console.log("FAIL "+b)); console.log("dead code (CL-ROB-10): "+bad.length+" findings"); process.exit(1); }
console.log("dead code (CL-ROB-10): "+decl.size+" top-level functions in "+files.length+" files, each called but "+Object.keys(UNCALLED).length+" named ("+Object.keys(UNCALLED).join(", ")+"); "+named.size+" names in comments, each in the code but "+Object.keys(GHOSTS).length+" named by kind OK");
