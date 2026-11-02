/* Final audit after Stage 8, area "robustness": app.js LABELS strings holding a double quote, "<" or "&" (measurement only). node tools/audit-post8/robustness/labels-chars.js */
const fs=require('fs');const acorn=require('/home/user/Austerlitz/node_modules/acorn');
const src=fs.readFileSync('/home/user/Austerlitz/app.js','utf8');const ast=acorn.parse(src,{ecmaVersion:'latest',locations:true});
// find top-level var LABELS
let lab=null; for(const st of ast.body){ if(st.type==='VariableDeclaration') for(const d of st.declarations){ if(d.id.name==='LABELS') lab=d; } }
const hits=[];
(function w(n,p){ if(!n||typeof n.type!=='string')return; if(n.type==='Literal'&&typeof n.value==='string'&&/["<&]/.test(n.value)) hits.push([n.loc.start.line,p.join('.'),n.value.slice(0,120)]);
 if(n.type==='Property'){ w(n.value,p.concat([n.key.name||n.key.value])); return; }
 for(const k in n){ if(k==='loc')continue; const v=n[k]; if(Array.isArray(v)) v.forEach(c=>w(c,p)); else if(v&&typeof v.type==='string') w(v,p); } })(lab.init,[]);
console.log('LABELS at line',lab.loc.start.line,'strings with " < or &:',hits.length); hits.slice(0,30).forEach(h=>console.log(JSON.stringify(h)));
