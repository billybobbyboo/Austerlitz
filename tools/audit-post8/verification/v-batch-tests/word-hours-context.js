#!/usr/bin/env node
/* Verification v-batch-tests (TS-13): each word-form "hour" that tools/audit-post8/tests/word-hours.js counts, with its context, so that
   the non-hours ("at one point", "about two battalions") can be told apart. Read-only. usage: node word-hours-context.js [root] */
const path=require("path");
const ROOT=path.resolve(process.argv[2]||"/home/user/Austerlitz");
const {statements}=require(path.join(ROOT,"tools","step4","statements.js"));
const W=/\b(?:about|at|by|until|before|after|towards?|around|near|past|till) (?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\b(?! o'clock)/gi;
let n=0, stm=0;
statements(ROOT).forEach(s=>{ const t=s.whole||s.text; let m, hit=[]; W.lastIndex=0;
  while((m=W.exec(t))) hit.push(t.slice(Math.max(0,m.index-25),m.index+m[0].length+25).replace(/\s+/g," "));
  if(hit.length){ stm++; n+=hit.length; console.log(s.file+":"+s.line+"  "+s.ref); hit.forEach(h=>console.log("     … "+h+" …")); } });
console.log("statements "+stm+", matches "+n);
/* the refined count: a match is not an unread hour where it is the tail of "half past N" or "a quarter past N" (timesIn reads those), or
   where a quantity follows the number (thousand, hours, minutes, times, men, battalions, squadrons, guns, km) or "to N and a half" (a figure) */
{ const {statements:st}=require(path.join(ROOT,"tools","step4","statements.js"));
  const vm=require("vm"), fs=require("fs"), ctx={}; vm.runInNewContext(fs.readFileSync(path.join(ROOT,"narrative.js"),"utf8")+";this.c=STATEMENT_CLAIMS;",ctx);
  let real=0, fp=0; const S=[], by={own:0,unchecked:0,class:0};
  st(ROOT).forEach(s=>{ const t=s.whole||s.text; let m, k=0; W.lastIndex=0;
    while((m=W.exec(t))){ const pre=t.slice(Math.max(0,m.index-12),m.index), post=t.slice(m.index+m[0].length,m.index+m[0].length+24);
      const notHour=(/^past /i.test(m[0])&&/(half|quarter) $/i.test(pre))||/^\s+(thousand|hours?|minutes?|times|men|battalions|squadrons|guns|km)\b/i.test(post)||/^\s+to \w+ and a half/i.test(post);
      if(notHour) fp++; else { real++; k++; } }
    if(k){ S.push(s.ref); by[ctx.c[s.ref]?"own":"unchecked"]++; } });
  console.log("refined: matches that are unread hours "+real+", not hours or read ("+fp+"); statements with at least one unread word-form hour "+S.length+" "+JSON.stringify(by)); }
