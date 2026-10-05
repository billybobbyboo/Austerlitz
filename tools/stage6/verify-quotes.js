#!/usr/bin/env node
/* Stage 6B (docs/STAGE6_SPEC.md §6.1): every verbatim quote in appearance.js checked against the text of the source it cites.
   For each claim with a quote (q), the source's text is fetched where it can be read as text from this machine: archive.org
   items (the scan's OCR text, *_djvu.txt), Gallica views (the page's OCR, ALTO, for the views the locator names), e-rara's
   plain text, a sale catalogue's page. The quote and the text are normalised alike (case, diacritics, pre-reform Russian
   letters, punctuation, hyphenation and spacing) and the quote searched for whole; if it is not found whole, the share of
   its word pairs found in the text is reported, for checking on the page image. A quote read only on a page image, or a
   source with no text layer reachable here, is reported as such, not as found. Network access is needed; nothing is changed.
   node tools/stage6/verify-quotes.js [--md docs/stage6-evidence/quote-check.md] [--cache dir]
   It reports; it does not fail the build (OCR is not the printed page). */
const fs=require("fs"), path=require("path"), https=require("https"), os=require("os"), vm=require("vm");
const ROOT=path.resolve(__dirname,"..","..");
const args=process.argv.slice(2), opt=k=>{ const i=args.indexOf(k); return i>=0?args[i+1]:null; };
const OUT=opt("--md"), CACHE=opt("--cache")||path.join(os.tmpdir(),"aus-stage6-quotes");
fs.mkdirSync(CACHE,{recursive:true});
const ctx={}; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(ROOT,"appearance.js"),"utf8")+"\nthis.X={APPEARANCE_SOURCES,DRESS,COMPOSITION,COLOURS_CARRIED,STANDARD_MEASURES};",ctx);
const {APPEARANCE_SOURCES:SRC,DRESS,COMPOSITION,COLOURS_CARRIED,STANDARD_MEASURES}=ctx.X;
const UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
function get(u,n){ n=n||0; return new Promise((res,rej)=>{ const r=https.get(u,{headers:{"User-Agent":UA}},resp=>{
  if(resp.statusCode>=300&&resp.statusCode<400&&resp.headers.location&&n<5){ resp.resume(); return res(get(new URL(resp.headers.location,u).href,n+1)); }
  const b=[]; resp.on("data",c=>b.push(c)); resp.on("end",()=>res({status:resp.statusCode,body:Buffer.concat(b)})); });
  r.on("error",rej); r.setTimeout(90000,()=>{ r.destroy(new Error("timeout")); }); }); }
async function cached(key,fn){ const f=path.join(CACHE,key.replace(/[^a-z0-9._-]/gi,"_")); if(fs.existsSync(f)) return fs.readFileSync(f,"utf8");
  const t=await fn(); if(t) fs.writeFileSync(f,t); return t; }
/* the claims with quotes */
const claims=[];
function walk(where,c){ if(!c||typeof c!=="object") return;
  if(Array.isArray(c.sides)) c.sides.forEach((x,i)=>walk(where+" side "+i,x));
  if(c.q&&c.src) claims.push({where,src:c.src,at:c.at||"",q:c.q});
  if(c.inForce&&c.inForce.q) claims.push({where:where+" inForce",src:c.inForce.src,at:c.inForce.at,q:c.inForce.q}); }
Object.entries(DRESS).forEach(([k,d])=>Object.entries(d).forEach(([a,v])=>{ if(v&&typeof v==="object") walk("DRESS."+k+"."+a,v); }));
Object.entries(COMPOSITION).forEach(([k,c])=>{ (c.parts||[]).forEach((p,i)=>walk("COMPOSITION."+k+" part "+i,p)); (c.others||[]).forEach((p,i)=>walk("COMPOSITION."+k+" other "+i,p)); });
Object.entries(COLOURS_CARRIED).forEach(([k,c])=>Object.entries(c).forEach(([a,v])=>walk("COLOURS_CARRIED."+k+"."+a,v)));
Object.entries(STANDARD_MEASURES).forEach(([k,c])=>Object.entries(c).forEach(([a,v])=>{ if(v&&typeof v==="object") walk("STANDARD_MEASURES."+k+"."+a,v); }));
/* text per source */
async function archiveText(ia){ return cached("ia_"+ia,async()=>{ const m=await get("https://archive.org/metadata/"+encodeURIComponent(ia)); if(m.status!==200) return null;
  const j=JSON.parse(m.body.toString("utf8")), f=(j.files||[]).find(x=>/_djvu\.txt$/.test(x.name)); if(!f) return null;
  const t=await get("https://archive.org/download/"+encodeURIComponent(ia)+"/"+f.name.split("/").map(encodeURIComponent).join("/")); return t.status===200?t.body.toString("utf8"):null; }); }
async function galllicaViews(ark,at){ const views=new Set(); const re=/\bf(\d+)(?:\s*-\s*f(\d+))?/g; let m;
  while((m=re.exec(at))){ const a=+m[1], b=m[2]?+m[2]:a; for(let v=a;v<=b&&v<a+12;v++) views.add(v); }
  let out=""; for(const v of views){ const t=await cached("gallica_"+ark+"_f"+v,async()=>{ try{ const r=await get("https://gallica.bnf.fr/RequestDigitalElement?O="+ark+"&E=ALTO&Deb="+v);
      if(r.status!==200) return null; const x=r.body.toString("utf8"); return (x.match(/CONTENT="([^"]*)"/g)||[]).map(s=>s.slice(9,-1)).join(" "); }catch(e){ return null; } });
    if(t) out+=" "+t; await new Promise(r=>setTimeout(r,1500)); }
  return out||null; }
async function textFor(c){ const S=SRC[c.src]||{};
  if(S.ia) return {how:"archive.org OCR", t:await archiveText(S.ia)};
  const g=/gallica\.bnf\.fr\/ark:\/12148\/([a-z0-9]+)/.exec(S.url||""); if(g){ const t=await galllicaViews(g[1],c.at); return {how:t?"Gallica OCR (ALTO) of the views named":"Gallica: no view named in the locator, or not reachable", t}; }
  if(/e-rara\.ch/.test(S.url||"")) return {how:"e-rara plain text", t:await cached("erara_fieffe",async()=>{ const r=await get("https://www.e-rara.ch/download/ftpack/plain/26006205"); return r.status===200?r.body.toString("utf8"):null; })};
  if(/osenat\.com/.test(S.url||"")) return {how:"the catalogue page", t:await cached("page_"+c.src,async()=>{ const r=await get(S.url); return r.status===200?r.body.toString("utf8").replace(/<[^>]+>/g," "):null; })};
  return {how:"no text layer reachable here (page images read)", t:null}; }
function norm(s){ return String(s).normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase()
  .replace(/ѣ/g,"е").replace(/[іїі]/g,"и").replace(/ѳ/g,"ф").replace(/ѵ/g,"и").replace(/ъ/g,"").replace(/ё/g,"е")
  .replace(/&amp;/g,"&").replace(/[-­]\s*\n\s*/g,"").replace(/\[sic\]/g," ").replace(/[^a-z0-9а-яß]+/g," ").replace(/\s+/g," ").trim(); }
/* the largest share of the quote's word pairs found together within one passage (three times the quote's length) */
function cluster(tn,q){ const ps=pairs(q); if(!ps.length) return {n:0,share:0};
  const hits=[]; ps.forEach((p,i)=>{ let k=tn.indexOf(p), m=0; while(k>=0&&m<400){ hits.push([k,i]); k=tn.indexOf(p,k+1); m++; } });
  hits.sort((a,b)=>a[0]-b[0]); const L=Math.max(60,3*q.length); let best=0, j=0; const cnt=new Map();
  for(let i=0;i<hits.length;i++){ cnt.set(hits[i][1],(cnt.get(hits[i][1])||0)+1);
    while(hits[i][0]-hits[j][0]>L){ const c=cnt.get(hits[j][1])-1; if(c) cnt.set(hits[j][1],c); else cnt.delete(hits[j][1]); j++; }
    best=Math.max(best,cnt.size); }
  return {n:ps.length, share:best/ps.length}; }
function pairs(s){ const w=s.split(" "), out=[]; for(let i=0;i+1<w.length;i++) out.push(w[i]+" "+w[i+1]); return out; }
const IMG=JSON.parse(fs.readFileSync(path.join(__dirname,"quote-check-images.json"),"utf8")).checked;
(async()=>{ const rows=[], bySrc={}, texts={};
  for(const c of claims){ const key=c.src+"|"+(SRC[c.src]&&SRC[c.src].ia?"":c.at);
    if(!(key in texts)){ try{ texts[key]=await textFor(c); }catch(e){ texts[key]={how:"error: "+e.message,t:null}; } }
    const T=texts[key], q=norm(c.q.replace(/\[\.\.\.\]/g," ").replace(/\.\.\./g," "));
    let res;
    if(!T.t) res="not checked ("+T.how+")";
    else { const tn=T.norm||(T.norm=norm(T.t));
      if(tn.indexOf(q)>=0) res="found";
      else { const c=cluster(tn,q); res=c.n?(c.share>=0.6?"found with OCR differences: ":"not found whole: ")+Math.round(100*c.share)+"% of its word pairs in one passage ("+T.how+")":"not found (one word)"; } }
    const im=IMG.find(x=>x.src===c.src&&c.at.indexOf(x.at)===0&&(c.at.length===x.at.length||!/\d/.test(c.at[x.at.length])));
    if(im&&!res.startsWith("found")) res="checked on the page image ("+im.page+")";
    rows.push(Object.assign({res},c)); (bySrc[c.src]=bySrc[c.src]||[]).push(res); }
  const n=k=>rows.filter(r=>r.res.startsWith(k)).length;
  const sum="quotes "+rows.length+": found whole "+rows.filter(r=>r.res==="found").length+", found with OCR differences "+n("found with OCR")+", not found "+n("not found")+", checked on the page image "+n("checked on the page image")+", not checked (no text layer here) "+n("not checked");
  console.log(sum);
  rows.filter(r=>!r.res.startsWith("found")).forEach(r=>console.log("  "+r.where+" ["+r.src+", "+r.at+"]: "+r.res));
  if(OUT){ const md=["# Stage 6B: the quotes of appearance.js checked against their sources' text\n",
    "`node tools/stage6/verify-quotes.js --md "+OUT+"`, run "+new Date().toISOString().slice(0,10)+". Each quote normalised (case, diacritics, pre-reform letters, punctuation, hyphenation) and searched for whole in the source's OCR text; "+
    "\"checked on the page image\" names the image (tools/stage6/quote-check-images.json); \"not found whole\" gives the share of its word pairs found (OCR errors, a quote read on the page image, a different edition's text); \"not checked\" means no text layer could be read here (the quote was read on the page image by the reading pass, `readings-*.md`).\n",
    "**"+sum+"**\n","| claim | source | locator | result | quote |","|---|---|---|---|---|"];
    rows.forEach(r=>md.push("| "+r.where+" | `"+r.src+"` | "+r.at.replace(/\|/g,"/")+" | "+r.res+" | "+r.q.replace(/\|/g,"/").slice(0,120)+" |"));
    fs.writeFileSync(path.resolve(OUT),md.join("\n")+"\n"); }
})().catch(e=>{ console.error(e); process.exit(2); });
