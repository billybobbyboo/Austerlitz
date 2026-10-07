/* tools/fonts/woff2.js: reads what ships in fonts.css, with Node's own brotli (no dependency). Used by css-test.js's type section
   (decision 141). It parses a WOFF2 file's table directory (UIntBase128 lengths; glyf and loca are transformed when their transform
   version is 0, the other tables when it is not 0) and decompresses the table stream. cmap, name, GSUB and GPOS are never transformed,
   so each is found by summing the stored lengths of the tables before it in the directory.
   node tools/fonts/woff2.js <file.woff2>...   prints each file's code points, family name and OpenType features */
const zlib=require("zlib");
const TAGS=["cmap","head","hhea","hmtx","maxp","name","OS/2","post","cvt ","fpgm","glyf","loca","prep","CFF ","VORG","EBDT","EBLC","gasp",
  "hdmx","kern","LTSH","PCLT","VDMX","vhea","vmtx","BASE","GDEF","GPOS","GSUB","EBSC","JSTF","MATH","CBDT","CBLC","COLR","CPAL","SVG ","sbix",
  "acnt","avar","bdat","bloc","bsln","cvar","fdsc","feat","fmtx","fvar","gvar","hsty","just","lcar","mort","morx","opbd","prop","trak","Zapf",
  "Silf","Glat","Gloc","Feat","Sill"];
function readWoff2(buf){
  if(buf.toString("latin1",0,4)!=="wOF2") throw new Error("not a WOFF2 file");
  if(buf.toString("latin1",4,8)==="ttcf") throw new Error("a WOFF2 collection: not expected here");
  const numTables=buf.readUInt16BE(12), compLen=buf.readUInt32BE(20);
  let p=48; const dir=[];
  function b128(){ let v=0; for(let i=0;i<5;i++){ const b=buf[p++]; v=v*128+(b&127); if(!(b&128)) return v; } throw new Error("bad UIntBase128"); }
  for(let i=0;i<numTables;i++){
    const fl=buf[p++]; let tag=TAGS[fl&63]; if((fl&63)===63){ tag=buf.toString("latin1",p,p+4); p+=4; }
    const tv=fl>>6, orig=b128(), transformed=(tag==="glyf"||tag==="loca")?tv===0:tv!==0;
    const len=transformed?b128():orig; dir.push({tag,orig,len,transformed});
  }
  const data=zlib.brotliDecompressSync(buf.subarray(p,p+compLen));
  let off=0; const tables={}; for(const t of dir){ tables[t.tag]={off,len:t.len,transformed:t.transformed}; off+=t.len; }
  if(off!==data.length) throw new Error("the table stream is "+data.length+" bytes, the directory says "+off);
  return {dir,data,tables};
}
function table(buf,tag){ const {data,tables}=readWoff2(buf), t=tables[tag]; if(!t) return null; if(t.transformed) throw new Error(tag+" is transformed");
  return data.subarray(t.off,t.off+t.len); }
/* the code points the font maps (cmap formats 4 and 12, Unicode subtables) */
function cmapCodepoints(buf){
  const c=table(buf,"cmap"), set=new Set(); if(!c) return set;
  const n=c.readUInt16BE(2);
  for(let i=0;i<n;i++){ const pid=c.readUInt16BE(4+i*8), eid=c.readUInt16BE(6+i*8), so=c.readUInt32BE(8+i*8), fmt=c.readUInt16BE(so);
    if(!(pid===3&&(eid===1||eid===10))&&pid!==0) continue;
    if(fmt===4){ const segX2=c.readUInt16BE(so+6), ends=so+14, starts=ends+segX2+2, deltas=starts+segX2, ros=deltas+segX2;
      for(let s=0;s<segX2/2;s++){ const e=c.readUInt16BE(ends+s*2), st=c.readUInt16BE(starts+s*2), d=c.readInt16BE(deltas+s*2), ro=c.readUInt16BE(ros+s*2);
        for(let cp=st;cp<=e&&cp!==0xFFFF;cp++){ let g; if(ro===0) g=(cp+d)&0xFFFF; else { g=c.readUInt16BE(ros+s*2+ro+(cp-st)*2); if(g) g=(g+d)&0xFFFF; } if(g) set.add(cp); } } }
    else if(fmt===12){ const ng=c.readUInt32BE(so+12); for(let k=0;k<ng;k++){ const a=c.readUInt32BE(so+16+k*12), b=c.readUInt32BE(so+20+k*12), g=c.readUInt32BE(so+24+k*12);
      for(let cp=a;cp<=b;cp++) if(g+(cp-a)) set.add(cp); } } }
  return set;
}
/* the Windows (platform 3) name records, by name ID */
function nameRecords(buf){
  const c=table(buf,"name"), out={}; if(!c) return out;
  const count=c.readUInt16BE(2), so=c.readUInt16BE(4);
  for(let i=0;i<count;i++){ const r=6+i*12, pid=c.readUInt16BE(r), id=c.readUInt16BE(r+6), len=c.readUInt16BE(r+8), o=c.readUInt16BE(r+10);
    if(pid===3){ const s=c.subarray(so+o,so+o+len); let str=""; for(let k=0;k+1<s.length;k+=2) str+=String.fromCharCode(s.readUInt16BE(k)); out[id]=str; } }
  return out;
}
/* the feature tags of a layout table's FeatureList (GSUB or GPOS) */
function featureTags(buf,tag){
  const g=table(buf,tag); if(!g) return [];
  const fl=g.readUInt16BE(6), n=g.readUInt16BE(fl), out=[];
  for(let i=0;i<n;i++) out.push(g.toString("latin1",fl+2+i*6,fl+6+i*6));
  return [...new Set(out)];
}
module.exports={readWoff2,cmapCodepoints,nameRecords,featureTags};
if(require.main===module){ const fs=require("fs");
  for(const f of process.argv.slice(2)){ const b=fs.readFileSync(f), n=nameRecords(b);
    console.log(f.split("/").pop()+": "+cmapCodepoints(b).size+" code points | family "+n[1]+" | GSUB "+featureTags(b,"GSUB").join(" ")+" | GPOS "+featureTags(b,"GPOS").join(" ")); } }
