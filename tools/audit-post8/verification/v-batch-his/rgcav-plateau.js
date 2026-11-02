/* v-batch-his: rg_cav's entry into PLATEAU_POLY about 10:05 and the Allied plateau reading (plateauStrength); read-only, on the verifier's isolated copy. */
process.env.ISO='/tmp/claude-0/-home-user-Austerlitz/cb561984-b1ad-5d5a-82ba-de46bf4c820e/scratchpad/v-batch-his-iso';
const L=require('/home/user/Austerlitz/tools/audit-post8/verification/v-repro-his/load.js'); L.load();
for(const t of [602,603,604,605,606]){ global.clock=t; const p=posNow('rg_cav'); console.log(t, JSON.stringify(p.map(v=>+v.toFixed(2))), onPlateau(p), plateauStrength('al')); }
