#!/usr/bin/env node
/* Final audit after Stage 8, area "tests": the inventoried narrative statements whose hours are written in words that check:chronology's
   extractor (tools/stage2/chronology.js timesIn) does not read ("at seven", "about nine", "past two"; it reads HH:MM, ranges, "a quarter
   to/past", "half past", "N o'clock", "noon"/"midday"), with each statement's claim status (own claim, hashed; class claim; unchecked).
   Read-only.  usage: node tools/audit-post8/tests/word-hours.js [root]   (finding TS-13) */
const path=require("path"), fs=require("fs"), vm=require("vm");
const ROOT=path.resolve(process.argv[2]||".");
const {statements}=require(path.join(ROOT,"tools","step4","statements.js"));
const ctx={}; vm.runInNewContext(fs.readFileSync(path.join(ROOT,"narrative.js"),"utf8")+";this.c=STATEMENT_CLAIMS;this.k=CLAIM_BY_CLASS;",ctx);
const W=/\b(?:about|at|by|until|before|after|towards?|around|near|past|till) (?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b(?! o'clock)/gi;
const READ=/(\d{1,2}):(\d{2})|(a quarter to|quarter to|a quarter past|quarter past|half past)\s+(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)|(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve) o'clock|\b(noon|midday)\b/i;
const rows=statements(ROOT).filter(s=>{ W.lastIndex=0; return W.test(s.whole||s.text); }).map(s=>{ W.lastIndex=0; const own=ctx.c[s.ref], cls=ctx.k[s.cls];
  return {ref:s.ref, where:s.file+":"+s.line, words:((s.whole||s.text).match(W)||[]).join(", "), alsoClockShaped:READ.test(s.whole||s.text),
    claim:own?own.cl+" (own, hashed)":cls?cls.cl+" (by class, not hashed)":"unchecked"}; });
const by={}; rows.forEach(r=>{ const k=r.claim.includes("own")?"own":r.claim.includes("class")?"class":"unchecked"; by[k]=(by[k]||0)+1; });
console.log("statements with a word-form hour the extractor does not read: "+rows.length+"; with no clock-shaped hour besides: "+rows.filter(r=>!r.alsoClockShaped).length+"; "+JSON.stringify(by));
rows.forEach(r=>console.log("  "+r.where+"  "+r.ref+"  ["+r.words+"]  "+r.claim+(r.alsoClockShaped?"  (also a clock-shaped hour)":"")));
