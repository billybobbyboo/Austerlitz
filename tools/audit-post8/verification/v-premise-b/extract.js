// Extract the findings under verification (v-premise-b) with their full records.
const fs=require('fs');const p=require('path');
const root='/home/user/Austerlitz/docs/audit-post8-evidence';
const want=[['state',0],['interaction',0],['visibility',0],['visibility',1],['visual-landscape',0],['a11y',0],['visual-maps',0],['visual-maps',1],['visual-maps',2],['visual-maps',3],['visual-maps',4]];
for(const [a,i] of want){const r=JSON.parse(fs.readFileSync(p.join(root,a,'result.json'),'utf8'));const f=(r.findings||[])[i];
console.log('=== '+a+' #'+i+' ===');console.log(JSON.stringify(f,null,1));}
