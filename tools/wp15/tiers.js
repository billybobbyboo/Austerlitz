/* WP-15 (docs/ROADMAP_FINAL_AUDIT.md; finding CL-SRC-10, ChatGPT CG-F02): the prominence tiers of the narrative statements.
   Shared by tools/wp15/triage.js (the ranked queue) and tools/wp15/apply-proposals.js (the before and after counts). Read-only: it reads
   the sources (app.js for the opening's stops, data.js for the formations' echelons and the tour's length) and the inventory's rows
   (docs/step4-evidence/inventory.json, kept current by test.js), and loads no page.

   The tiers (the order a visitor meets the statements; the reasons are in docs/wp15-evidence/triage.md):
     tier 1  what a visitor reads first or reads in every phase:
       1a the first screen: phase 0's lede, shown in the Now tab's dispatch at 04:00 when the page opens, beside the first-run card
          from 1080 px wide (decision 113) and in the dispatch card below it;
       1b the opening (app.js OPENING.stops: the tour's stops it plays), in its order;
       1c the rest of the tour, in the tour's order;
       1d the phase ledes of phases 1-9, in phase order (the Now tab and the dispatch card show each phase's lede while the clock is in it);
       1e the headline strengths: each army headquarters' total and its source line (army.men, army.src), then each corps-level
          formation's strength note (echelon "corps"), in FORMATIONS order (the army card and the dossiers show them);
       1f the Command tab's rows, by phase, the French side before the Allied, in row order;
     tier 2  what the timeline and the panels show beside them: the phase lines and the phase flash (phase order), the events' names,
       whys and disputes (EVENTS order), the themes, the places' subtitles, the plans and their orders, the acts;
     tier 3  the rest: the formations' other fields, the tracks' acts and objectives, the timing notes, the places' stories, facts and
       reasons, the sources sheet's method statements; by class in this order, then in source order.
   Every statement gets exactly one tier and group; the order is deterministic (no clock, no randomness). */
"use strict";
const fs = require("fs"), path = require("path"), vm = require("vm");

function sourceContext(root) {
  const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
  const m = /var OPENING=\{stops:\[([\d,\s]+)\]/.exec(app);
  if (!m) throw new Error("app.js: var OPENING={stops:[...]} not found");
  const stops = m[1].split(",").map(s => +s.trim());
  const ctx = {}; vm.createContext(ctx);
  ["geo.js", "data.js", "analysis.js"].forEach(f => vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f }));
  vm.runInContext("this.__F=FORMATIONS; this.__T=TOUR; this.__P=PHASES; this.__E=EVENTS; this.__A=ANALYSIS; this.__X=FEATURES;", ctx);
  const F = ctx.__F, fids = Object.keys(F);
  return {
    stops,
    tourLen: ctx.__T.length,
    phases: ctx.__P.length,
    fOrder: new Map(fids.map((id, i) => [id, i])),
    ech: new Map(fids.map(id => [id, F[id].ech])),
    evOrder: new Map(ctx.__E.map((e, i) => [e.id, i])),
    thOrder: new Map(ctx.__A.map((a, i) => [a.id, i])),
    plOrder: new Map(ctx.__X.map((p, i) => [p.id, i]))
  };
}

/* the group of one statement, and its sort key inside the group (a number or an array of numbers) */
function classify(row, C) {
  const r = row.ref; let m;
  if (r === "PHASES[#0].lede") return { tier: 1, group: "1a", key: [0] };
  if ((m = /^TOUR\[(\d+)\]\.x$/.exec(r))) {
    const k = +m[1], i = C.stops.indexOf(k);
    return i >= 0 ? { tier: 1, group: "1b", key: [i] } : { tier: 1, group: "1c", key: [k] };
  }
  if ((m = /^PHASES\[#(\d+)\]\.lede$/.exec(r))) return { tier: 1, group: "1d", key: [+m[1]] };
  if ((m = /^FORMATIONS\.(\w+)\.army\.(men|src)$/.exec(r))) return { tier: 1, group: "1e", key: [0, C.fOrder.get(m[1]), m[2] === "men" ? 0 : 1] };
  if ((m = /^FORMATIONS\.(\w+)\.strengthNote$/.exec(r)) && C.ech.get(m[1]) === "corps") return { tier: 1, group: "1e", key: [1, C.fOrder.get(m[1]), 0] };
  if ((m = /^COMMAND\.(fr|al)\["(\d+)"\]\[(\d+)\]$/.exec(r))) return { tier: 1, group: "1f", key: [+m[2], m[1] === "fr" ? 0 : 1, +m[3]] };
  if ((m = /^PHASES\[#(\d+)\]\.(events\[(\d+)\]|flash)$/.exec(r))) return { tier: 2, group: "2a", key: [+m[1], m[3] == null ? 99 : +m[3]] };
  if ((m = /^EVENTS\[#([\w-]+)\]\.(n|why|dispute)$/.exec(r))) return { tier: 2, group: "2b", key: [C.evOrder.get(m[1]), ["n", "why", "dispute"].indexOf(m[2])] };
  if ((m = /^ANALYSIS\[#(\w+)\]\.text$/.exec(r))) return { tier: 2, group: "2c", key: [C.thOrder.get(m[1])] };
  if ((m = /^FEATURES\[#(\w+)\]\.sub$/.exec(r))) return { tier: 2, group: "2d", key: [C.plOrder.get(m[1])] };
  if (/^PLANS\./.test(r)) return { tier: 2, group: "2e", key: [row.line] };
  if (/^ACTS\[/.test(r)) return { tier: 2, group: "2f", key: [row.line] };
  const T3 = ["formation", "track act", "track objective", "timing note", "place", "place fact", "place why", "method"];
  const ci = T3.indexOf(row.cls);
  return { tier: 3, group: "3a", key: [ci < 0 ? 99 : ci, row.file === "data.js" ? 0 : 1, row.line] };
}

const GROUPS = {
  "1a": "the first screen: phase 0's lede (the Now tab at 04:00, beside the first-run card)",
  "1b": "the opening: the tour stops it plays, in its order",
  "1c": "the rest of the tour, in its order",
  "1d": "the phase ledes of phases 1-9",
  "1e": "the headline strengths: the army totals and their source lines, then the corps-level strength notes",
  "1f": "the Command tab's rows, by phase, French before Allied",
  "2a": "the phase lines and the phase flash",
  "2b": "the events' names, whys and disputes",
  "2c": "the themes",
  "2d": "the places' subtitles",
  "2e": "the plans and their orders",
  "2f": "the acts",
  "3a": "the rest: formations' other fields, tracks' acts and objectives, timing notes, places' stories, facts and reasons, the method statements"
};

function cmpKey(a, b) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const x = a[i] == null ? -1 : a[i], y = b[i] == null ? -1 : b[i];
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}
/* rows: inventory rows; returns them with tier, group and rank (1-based over every row), in rank order */
function rank(rows, C) {
  const G = Object.keys(GROUPS);
  const out = rows.map((row, i) => Object.assign({}, row, classify(row, C), { idx: i }));
  out.sort((a, b) => (a.tier - b.tier) || (G.indexOf(a.group) - G.indexOf(b.group)) || cmpKey(a.key, b.key) || (a.idx - b.idx));
  out.forEach((r, i) => { r.rank = i + 1; delete r.key; delete r.idx; });
  return out;
}
const isUnchecked = row => row.claim === "unchecked";
/* counts of unchecked statements by tier and by tier and class */
function counts(ranked) {
  const byTier = {}, byTierClass = {}, all = {};
  ranked.forEach(r => {
    const t = "tier " + r.tier;
    all[t] = (all[t] || 0) + 1;
    if (!isUnchecked(r)) return;
    byTier[t] = (byTier[t] || 0) + 1;
    byTierClass[t] = byTierClass[t] || {};
    byTierClass[t][r.cls] = (byTierClass[t][r.cls] || 0) + 1;
  });
  return { statements: all, unchecked: byTier, uncheckedByClass: byTierClass };
}
module.exports = { sourceContext, classify, rank, counts, GROUPS, isUnchecked };
