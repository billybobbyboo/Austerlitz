/* audit-post8 (state): every addEventListener / timer call in app.js with its enclosing function chain, and for each
   enclosing top-level function the places that call it (to judge whether a listener can be added more than once).
   Usage: node listeners.js <path-to-app.js>   (read-only) */
const fs=require('fs'), path=require('path');
const acorn=require(path.join(process.argv[3]||'/home/user/Austerlitz','node_modules/acorn'));
const src=fs.readFileSync(process.argv[2],'utf8');
const ast=acorn.parse(src,{ecmaVersion:2020,locations:true});
const out=[]; const calls={};   /* name -> [lines] */
function walk(n,chain){
  if(!n||typeof n.type!=='string') return;
  let ch=chain;
  if(n.type==='FunctionDeclaration'||n.type==='FunctionExpression'){
    const nm=n.id?n.id.name:'<anon@'+n.loc.start.line+'>'; ch=chain.concat([nm]); }
  if(n.type==='CallExpression'){
    const c=n.callee;
    if(c.type==='MemberExpression'&&!c.computed&&c.property.name==='addEventListener'){
      const ev=n.arguments[0]&&n.arguments[0].type==='Literal'?n.arguments[0].value:'<expr>';
      out.push({line:n.loc.start.line,kind:'listen',ev,chain:ch.join(' > ')});
    }
    if(c.type==='Identifier'&&/^(setTimeout|setInterval|requestAnimationFrame)$/.test(c.name)) out.push({line:n.loc.start.line,kind:c.name,chain:ch.join(' > ')});
    if(c.type==='Identifier'){ (calls[c.name]=calls[c.name]||[]).push(n.loc.start.line); }
  }
  for(const k in n){ if(k==='loc') continue; const v=n[k];
    if(Array.isArray(v)) v.forEach(x=>walk(x,ch)); else if(v&&typeof v.type==='string') walk(v,ch); }
}
walk(ast,[]);
const top=new Set(out.map(o=>o.chain.split(' > ')[0]));
console.log('# listeners and timers by enclosing chain (line kind event chain)');
out.forEach(o=>console.log(o.line+'\t'+o.kind+'\t'+(o.ev||'')+'\t'+o.chain));
console.log('\n# callers of each enclosing top-level function (call lines)');
[...top].sort().forEach(t=>console.log(t+'\t'+(calls[t]||[]).join(',')));
