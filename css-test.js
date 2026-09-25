/* Stylesheet integrity: balance, cascade order, and no duplicated top-level rules.
   Added after a patch silently truncated the file at the first media query. */
const fs=require('fs');
const c=fs.readFileSync('style.css','utf8');
let errs=[];
if(c.count===undefined){}
const open=(c.match(/{/g)||[]).length, close=(c.match(/}/g)||[]).length;
if(open!==close) errs.push(`unbalanced braces: ${open} open, ${close} close`);

const clean=c.replace(/\/\*[\s\S]*?\*\//g,"");
const firstMedia=clean.indexOf("@media");
const base=firstMedia<0?clean:clean.slice(0,firstMedia);

/* top-level selectors only: a selector list starting at column 0 */
const rules=[...base.matchAll(/^([^@\s][^{}]*?)\{/gm)].map(m=>m[1].trim().replace(/\s+/g," "));
const seen={}, dupes=[];
rules.forEach(r=>{ if(seen[r]) dupes.push(r); seen[r]=1; });
if(dupes.length) errs.push("duplicated rules: "+[...new Set(dupes)].join(" | "));

const required=[
 ".tab-btn",".chap",".cmdrow",".planblock",".pill.claim-fact",
 "#viewmode",".vm-btn","#restore",".clockbox",".timerail",".rail-ticks b",".speeds",
 ".tb-trackwrap",".step",".timebar",".dispatch",".legend",".tools",".drawer",
 "body.pm-watch .rail","body.pm-map .rail","body.no-dispatch .dispatch"
];
const missing=required.filter(s=>!rules.some(r=>r===s||r.split(",").map(x=>x.trim()).includes(s)));
if(missing.length) errs.push("missing base rules: "+missing.join(", "));

/* every custom property used must be declared */
const used=new Set([...c.matchAll(/var\((--[\w-]+)\)/g)].map(m=>m[1]));
const declared=new Set([...c.matchAll(/(--[\w-]+)\s*:/g)].map(m=>m[1]));
const undecl=[...used].filter(v=>!declared.has(v));
if(undecl.length) errs.push("undeclared custom properties: "+undecl.join(", "));

console.log("top-level rules:",rules.length,"| custom properties:",declared.size);
console.log("CSS ERRORS:",errs.length);
errs.forEach(e=>console.log("  ! "+e));
process.exitCode = errs.length?1:0;

/* --- targeted checks for the symptoms reported against the previous build --- */
/* collect every rule as {selectors:[...], body} so lookups are exact */
const allRules=[];
{
  const re=/([^{}]+)\{([^{}]*)\}/g; let m;
  const flat=clean.replace(/@media[^{]*\{/g,"");
  while((m=re.exec(flat))!==null){
    const sels=m[1].split(",").map(x=>x.trim().replace(/\s+/g," ")).filter(Boolean);
    allRules.push({sels:sels, body:m[2]});
  }
}
function decls(sel){
  let body=null;
  allRules.forEach(r=>{ if(r.sels.indexOf(sel)>=0) body=(body||"")+r.body; });
  return body===null?null:{body:body};
}
const checks=[
 ["body.pm-map .dispatch","display:none","map mode must hide the dispatch text"],
 ["body.pm-map .timebar","display:none","map mode must hide the timeline"],
 ["body.pm-map .tools","display:none","map mode must hide the controls"],
 ["body.pm-watch .dispatch","display:none","watch mode must hide the dispatch text"],
 ["body.pm-watch .tools","display:none","watch mode must hide the controls"],
 ["body.no-dispatch .dispatch","display:none","the text toggle must hide the dispatch"],
 [".rail-ticks b","position:absolute","hour labels must be positioned, not inline"],
 [".tab-btn","background:none","rail tabs must not render as default buttons"],
 [".vm-btn","cursor:pointer","the presentation control must be clickable"]
];
let cerrs=0;
checks.forEach(([sel,need,why])=>{
  const d=decls(sel);
  if(!d){ console.log("  ! no rule for "+sel+" — "+why); cerrs++; return; }
  if(d.body.replace(/\s/g,"").indexOf(need.replace(/\s/g,""))<0){
    console.log("  ! "+sel+" lacks "+need+" — "+why); cerrs++;
  }
});
console.log("behaviour checks:",checks.length-cerrs+"/"+checks.length+" pass");
if(cerrs) process.exitCode=1;
