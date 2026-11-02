/* Final audit after Stage 8, area "robustness": markup-significant characters in the bundled data (measurement only; see the note at the end). */
const fs=require('fs'),path=require('path');const acorn=require('/home/user/Austerlitz/node_modules/acorn');
const files=process.argv.slice(2);const out={};
for(const f of files){const src=fs.readFileSync(path.join('/home/user/Austerlitz',f),'utf8');const ast=acorn.parse(src,{ecmaVersion:'latest',locations:true});
 const hits={dq:[],lt:[],amp:[],gt:[]};
 (function w(n,key){ if(!n||typeof n.type!=='string')return;
   if(n.type==='Literal'&&typeof n.value==='string'){ const v=n.value;
     if(v.includes('"')) hits.dq.push([n.loc.start.line,key,v.slice(0,90)]);
     if(/<[a-zA-Z\/!]/.test(v)) hits.lt.push([n.loc.start.line,key,v.slice(0,90)]);
     if(/&[a-zA-Z#]/.test(v)) hits.amp.push([n.loc.start.line,key,v.slice(0,90)]);
   }
   if(n.type==='TemplateLiteral') n.quasis.forEach(q=>{ if(q.value.cooked&&q.value.cooked.includes('"')) hits.dq.push([q.loc.start.line,key,'tpl:'+q.value.cooked.slice(0,80)]); });
   for(const k in n){ if(k==='loc')continue; const v=n[k]; const kk=(n.type==='Property'&&k==='value')?(n.key.name||n.key.value):key;
     if(Array.isArray(v)) v.forEach(c=>w(c,kk)); else if(v&&typeof v.type==='string') w(v,kk); }
 })(ast,null);
 out[f]={dq:hits.dq.length,lt:hits.lt.length,amp:hits.amp.length,dqKeys:[...new Set(hits.dq.map(h=>h[1]))].slice(0,40),ltSample:hits.lt.slice(0,6),ampSample:hits.amp.slice(0,6),dqSample:hits.dq.slice(0,8)};
}
console.log(JSON.stringify(out,null,1));
/* (appended) usage: node tools/audit-post8/robustness/dataset-chars.js data.js analysis.js appearance.js narrative.js geo.js tokens.js
   prints, per file, the string literals holding a double quote, a "<" before a letter, "/" or "!", or an "&" before a letter or "#":
   the characters esc() (app.js:6910, & < > only) leaves or that would break markup if a sink took the string unescaped */
