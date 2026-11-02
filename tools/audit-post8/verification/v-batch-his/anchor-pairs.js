/* v-batch-his: every Bagration anchor against every Caffarelli anchor from @5, true km (GEOREF.kmBetween); read-only, on the verifier's isolated copy. */
process.env.ISO='/tmp/claude-0/-home-user-Austerlitz/cb561984-b1ad-5d5a-82ba-de46bf4c820e/scratchpad/v-batch-his-iso';
const L=require('/home/user/Austerlitz/tools/audit-post8/verification/v-repro-his/load.js'); L.load();
const b=FORMATIONS.bag.track, c=FORMATIONS.caffarelli.track;
for(const i of Object.keys(b)) for(const j of Object.keys(c)) if(b[i].p&&c[j].p&&+j>=5) console.log('bag@'+i,JSON.stringify(b[i].p),'caff@'+j,JSON.stringify(c[j].p),GEOREF.kmBetween(b[i].p,c[j].p).toFixed(2), b[i].tm?JSON.stringify(b[i].tm).slice(0,80):'');
