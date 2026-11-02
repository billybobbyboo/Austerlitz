/* Proper names across every visitor string of data.js, analysis.js and narrative.js notes (tools/lang-scan.js records, as statements.js
   reads them) and the app's typed strings: capitalised words, counted, and pairs of distinct spellings within edit distance 2 of each
   other (same first letter, five letters or more) listed for review. */
const fs=require('fs'), path=require('path');
const {ISO}=require('./load.js');
const LS=require(path.join(ISO,'tools','lang-scan.js'))(ISO);
const recs=LS.records.filter(r=>['data.js','analysis.js','narrative.js','appearance.js','app.js','shell.html','symbols.js'].includes(r.file));
const cnt={}, where={};
recs.forEach(r=>{ const m=String(r.text).match(/\b[A-ZÀ-Ý][A-Za-zÀ-ÿ'’\-]{3,}\b/g)||[]; m.forEach(w=>{ cnt[w]=(cnt[w]||0)+1; (where[w]=where[w]||new Set()).add(r.file+':'+r.line); }); });
function lev(a,b){ const d=[]; for(let i=0;i<=a.length;i++){ d[i]=[i]; } for(let j=0;j<=b.length;j++) d[0][j]=j; for(let i=1;i<=a.length;i++) for(let j=1;j<=b.length;j++) d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1)); return d[a.length][b.length]; }
const strip=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'');
const words=Object.keys(cnt).filter(w=>w.length>=5);
const pairs=[];
for(let i=0;i<words.length;i++) for(let j=i+1;j<words.length;j++){ const a=words[i], b=words[j]; if(a[0]!==b[0]&&strip(a[0])!==strip(b[0])) continue; if(Math.abs(a.length-b.length)>2) continue;
  const da=strip(a).toLowerCase(), db=strip(b).toLowerCase(); if(da===db&&a!==b){ pairs.push([a,b,'accent/case only']); continue; }
  if(da.replace(/s$/,'')===db.replace(/s$/,'')||da.replace(/'s$/,'')===db.replace(/'s$/,'')) continue;
  const d=lev(da,db); if(d>0&&d<=1&&da.length>=6) pairs.push([a,b,'edit '+d]); }
console.log('records read: '+recs.length+'; capitalised words: '+Object.keys(cnt).length);
pairs.sort((x,y)=>x[2].localeCompare(y[2])).forEach(p=>console.log(`${p[0]} (${cnt[p[0]]}: ${[...where[p[0]]].slice(0,3).join(', ')}) ~ ${p[1]} (${cnt[p[1]]}: ${[...where[p[1]]].slice(0,3).join(', ')}) [${p[2]}]`));
