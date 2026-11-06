/* WP-15's verifier (docs/ROADMAP_FINAL_AUDIT.md, WP-15; the final audits' Stage 4, alongside track). Proves that the proposed data changes of
   docs/wp15-evidence/proposals.json pass the project's own claim checks, without changing the repository:
     1. copies the repository's sources to a scratch directory outside the repository (the code, tools/, and docs/'s text files; node_modules
        linked, not copied; no image, no archive), and runs the copy's test.js as it stands (it must pass: the baseline); every run of test.js
        here is followed by redteam.js, whose overclaim scan and retired phrases read narrative.js's notes (a visitor is shown them);
     2. run A: inserts every proposed claim on a statement as it stands into the copy's narrative.js (STATEMENT_CLAIMS), and any proposed
        APPEARANCE_SOURCES entry into its appearance.js; regenerates the copy's inventory (tools/step4/inventory.js) and runs its test.js;
     3. run B: as A, and also applies each correction marked appliedForTest to the copy's data.js or analysis.js (its "from" must occur
        exactly once) with the claim the corrected statement would carry; regenerates the inventory and runs test.js;
     4. prints the unchecked statements by tier and by tier and class (tools/wp15/tiers.js) for the baseline, A and B.
   Exit 0 only if all three runs pass (test.js ERRORS: 0, redteam.js findings: 0, both exit 0). Nothing in the repository is written; the
   scratch directory is removed unless --keep.
     node tools/wp15/apply-proposals.js [--proposals FILE] [--out DIR] [--keep] [--suite] [--mutate KIND]
   --suite      also runs the whole regression suite (tools/run-all.sh) on run B's copy.
   --mutate     a negative control: breaks one proposal before applying it, so test.js must fail. KIND is one of
                hash     the first claim's hash changed;
                reading  a reading id that no register declares;
                source   a source not in APPEARANCE_SOURCES;
                clock    a note carrying a clock time;
                fact     an "attributed" claim made "fact" while it rests on a reading labelled disputed only (TOUR[7]'s readings);
                correction  a correction's claim given the hash of the uncorrected text;
                language an unlabelled superlative in a note (redteam.js). */
"use strict";
const fs = require("fs"), path = require("path"), os = require("os"), cp = require("child_process");
const ROOT = path.resolve(__dirname, "..", "..");
const T = require("./tiers.js");

const args = process.argv.slice(2), opt = k => { const i = args.indexOf(k); return i >= 0 ? (args[i + 1] || true) : null; };
const PFILE = path.resolve(opt("--proposals") || path.join(ROOT, "docs", "wp15-evidence", "proposals.json"));
const OUTDIR = opt("--out") ? path.resolve(opt("--out")) : fs.mkdtempSync(path.join(os.tmpdir(), "wp15-verify-"));
const KEEP = args.includes("--keep"), SUITE = args.includes("--suite"), MUTATE = opt("--mutate");
if (OUTDIR === ROOT || OUTDIR.startsWith(ROOT + path.sep)) { console.error("the scratch directory must be outside the repository"); process.exit(2); }

/* ---- the copy ---- */
const SKIP_DIRS = new Set([".git", "node_modules", "archive", "out", "out-selftest", ".cache", "__pycache__"]);
const TEXT_EXT = new Set([".md", ".json", ".csv", ".txt"]);
function copyTree(src, dst, rel) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name), r = rel ? rel + "/" + e.name : e.name;
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) copyTree(s, d, r); continue; }
    if (!e.isFile()) continue;
    const ext = path.extname(e.name).toLowerCase();
    if (r.startsWith("docs/") && !TEXT_EXT.has(ext)) continue;          /* docs/: the registers, the inventory and the other text files only */
    if (/\.(png|jpe?g|gif|webp|mp4|webm|pdf|pgm|zip)$/i.test(e.name)) continue;
    fs.copyFileSync(s, d);
  }
}
function makeCopy(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  copyTree(ROOT, dir, "");
  fs.symlinkSync(path.join(ROOT, "node_modules"), path.join(dir, "node_modules"), "dir");
}

/* ---- the edits ---- */
function insertClaims(dir, entries) {
  const f = path.join(dir, "narrative.js"), src = fs.readFileSync(f, "utf8"), anchor = "var STATEMENT_CLAIMS = {\n";
  if (src.split(anchor).length !== 2) throw new Error("narrative.js: the STATEMENT_CLAIMS anchor is not found once");
  const have = new Set(); { const vm = require("vm"), c = {}; vm.runInNewContext(src + ";this.__c=STATEMENT_CLAIMS;", c); Object.keys(c.__c).forEach(k => have.add(k)); }
  entries.forEach(([ref]) => { if (have.has(ref)) throw new Error("narrative.js already has a claim for " + ref + " (a proposal is for an unchecked statement)"); });
  const block = entries.map(([ref, c]) => "  " + JSON.stringify(ref) + ": " + JSON.stringify(c) + ",\n").join("");
  fs.writeFileSync(f, src.replace(anchor, anchor + "  /* WP-15's proposals, applied by tools/wp15/apply-proposals.js to this copy only */\n" + block));
}
function insertSources(dir, sources) {
  const keys = Object.keys(sources || {}); if (!keys.length) return;
  const f = path.join(dir, "appearance.js"), src = fs.readFileSync(f, "utf8"), anchor = "var APPEARANCE_SOURCES = {\n";
  if (src.split(anchor).length !== 2) throw new Error("appearance.js: the APPEARANCE_SOURCES anchor is not found once");
  fs.writeFileSync(f, src.replace(anchor, anchor + keys.map(k => "  " + k + ": " + JSON.stringify(sources[k]) + ",\n").join("")));
}
function applyCorrection(dir, c, ref) {
  const f = path.join(dir, c.file), src = fs.readFileSync(f, "utf8"), n = src.split(c.from).length - 1;
  if (n !== 1) throw new Error(ref + ": the correction's text occurs " + n + " times in " + c.file);
  fs.writeFileSync(f, src.replace(c.from, () => c.to));
}

/* ---- running the copy ---- */
function run(dir, cmd, argv) {
  const r = cp.spawnSync(cmd, argv, { cwd: dir, encoding: "utf8", maxBuffer: 64 << 20, timeout: 1800000 });
  return { code: r.status, out: (r.stdout || "") + (r.stderr || "") };
}
function testJs(dir, label) {
  const inv = run(dir, "node", ["tools/step4/inventory.js"]);
  if (inv.code !== 0) return { ok: false, label, summary: "the inventory could not be written: " + inv.out.trim().split("\n").pop(), errors: [] };
  const r = run(dir, "node", ["test.js"]);
  const m = /^ERRORS: (\d+)$/m.exec(r.out), sc = /^statement claims: .*$/m.exec(r.out);
  const errors = r.out.split("\n").filter(l => /^ {2}! /.test(l));
  /* and redteam.js: the overclaim scan reads narrative.js's notes, which a visitor is shown, and its retired phrases */
  const t = run(dir, "node", ["redteam.js"]), f = /^findings: (\d+)$/m.exec(t.out);
  const findings = t.out.split("\n").filter(l => /^ {2}✗ /.test(l));
  const ok = r.code === 0 && m && +m[1] === 0 && t.code === 0 && f && +f[1] === 0;
  return { ok, label, code: r.code, nerr: m ? +m[1] : null, rcode: t.code, nfind: f ? +f[1] : null,
    summary: (sc ? sc[0] : "(no claims line)") + "\n  redteam.js: exit " + t.code + ", findings: " + (f ? f[1] : "?"), errors: errors.concat(findings) };
}
function countsOf(dir) {
  const inv = JSON.parse(fs.readFileSync(path.join(dir, "docs", "step4-evidence", "inventory.json"), "utf8"));
  return T.counts(T.rank(inv.rows, T.sourceContext(dir)));
}

/* ---- the negative controls ---- */
function mutate(P, kind) {
  const claims = P.proposals.filter(p => p.claim);
  const first = claims[0];
  switch (kind) {
    case "hash": first.claim.h = first.claim.h.replace(/^./, ch => ch === "0" ? "1" : "0"); return "the hash of " + first.ref + " changed to " + first.claim.h;
    case "reading": first.claim.by[0].rd = "wp15.not-a-reading"; return "a reading id no register declares, on " + first.ref;
    case "source": first.claim.by[0].src = "notasource1999"; return "a source not in APPEARANCE_SOURCES, on " + first.ref;
    case "clock": first.claim.note = (first.claim.note || "") + " The columns left at 7:00."; return "a clock time in the note of " + first.ref;
    case "fact": { const p = P.proposals.find(x => x.ref === "TOUR[7].x"); p.claim.cl = "fact"; p.claim.by = p.claim.by.filter(b => b.rd === "marbot1891.p262.guard-descends"); return "TOUR[7].x claimed fact on Marbot's reading alone, which the register labels disputed"; }
    case "correction": { const p = P.proposals.find(x => x.correction); p.correction.claim.h = p.hash; return "the correction of " + p.ref + " claimed with the uncorrected text's hash"; }
    case "language": first.claim.note = (first.claim.note || "") + " It was the bloodiest fight of the day."; return "an unlabelled superlative in the note of " + first.ref + " (redteam.js's overclaim scan)";
    default: throw new Error("unknown --mutate kind " + kind);
  }
}

function table(rows) {
  const tiers = ["tier 1", "tier 2", "tier 3"], L = [];
  L.push("unchecked statements by tier:            " + rows.map(r => r.name.padStart(10)).join(""));
  tiers.forEach(t => L.push("  " + (t + " (of " + rows[0].c.statements[t] + ")").padEnd(38) + rows.map(r => String(r.c.unchecked[t] || 0).padStart(10)).join("")));
  L.push("  " + "all".padEnd(38) + rows.map(r => String(tiers.reduce((a, t) => a + (r.c.unchecked[t] || 0), 0)).padStart(10)).join(""));
  L.push("unchecked statements by tier and class:");
  tiers.forEach(t => { const cls = [...new Set(rows.flatMap(r => Object.keys(r.c.uncheckedByClass[t] || {})))].sort();
    cls.forEach(k => L.push("  " + (t + ", " + k).padEnd(38) + rows.map(r => String((r.c.uncheckedByClass[t] || {})[k] || 0).padStart(10)).join(""))); });
  return L.join("\n");
}

function main() {
  const P = JSON.parse(fs.readFileSync(PFILE, "utf8"));
  if (MUTATE) console.log("NEGATIVE CONTROL (--mutate " + MUTATE + "): " + mutate(P, MUTATE));
  console.log("proposals: " + path.relative(ROOT, PFILE) + " (" + P.proposals.length + " statements: " +
    P.proposals.filter(p => p.claim).length + " claims on the statement as it stands, " + P.proposals.filter(p => p.correction).length + " corrections, " +
    P.proposals.filter(p => p.correction && p.correction.appliedForTest).length + " of them applied for the test)");
  console.log("scratch directory: " + OUTDIR + " (outside the repository)");
  const results = [], rows = [];
  /* the new register's own markers: test.js requires a "read on" marker on the step-4 register's entries by that file's name, so this
     register's are checked here in the same way (each entry one marker; how many on a page image, how many on the text layer) */
  { const f = path.join(ROOT, "docs", "wp15-evidence", "readings.md"), ents = []; let cur = null;
    fs.readFileSync(f, "utf8").split("\n").forEach(l => { let m;
      if ((m = /^### [\w.]+ `([^`]+)`/.exec(l))) { cur = { id: m[1], readOn: undefined }; ents.push(cur); }
      else if (/^#/.test(l)) cur = null;
      else if (cur && cur.readOn === undefined && (m = /^- \*\*quote\*\* \(read on: (.*?)\): /.exec(l))) cur.readOn = m[1]; });
    const none = ents.filter(e => e.readOn === undefined), image = ents.filter(e => e.readOn && /^page image/i.test(e.readOn) && !/text layer|\bOCR\b/i.test(e.readOn));
    results.push({ ok: !none.length, label: "the register docs/wp15-evidence/readings.md", summary: ents.length + " readings, each with its \"read on\" marker" +
      (none.length ? " but " + none.map(e => e.id).join(", ") : "") + "; " + image.length + " read on a page image, " + (ents.length - image.length - none.length) + " on the text layer in whole or part", errors: [] }); }
  try {
    /* the baseline */
    const D0 = path.join(OUTDIR, "baseline"); makeCopy(D0);
    const r0 = testJs(D0, "baseline"); results.push(r0); rows.push({ name: "before", c: countsOf(D0) });
    /* run A: the claims on the statements as they stand */
    const DA = path.join(OUTDIR, "claims"); makeCopy(DA);
    insertSources(DA, P.appearanceSources);
    insertClaims(DA, P.proposals.filter(p => p.claim).map(p => [p.ref, p.claim]));
    const rA = testJs(DA, "A: claims"); results.push(rA); rows.push({ name: "A claims", c: countsOf(DA) });
    /* run B: and the corrections applied for the test */
    const DB = path.join(OUTDIR, "corrected"); makeCopy(DB);
    insertSources(DB, P.appearanceSources);
    const C = P.proposals.filter(p => p.correction && p.correction.appliedForTest);
    C.forEach(p => applyCorrection(DB, p.correction, p.ref));
    insertClaims(DB, P.proposals.filter(p => p.claim).map(p => [p.ref, p.claim]).concat(C.map(p => [p.ref, p.correction.claim])));
    const rB = testJs(DB, "B: claims and corrections"); results.push(rB); rows.push({ name: "B +corr", c: countsOf(DB) });
    if (SUITE) {
      const s = run(DB, "sh", ["tools/run-all.sh"]); const last = s.out.trim().split("\n").filter(l => /SUITES PASSED|REGRESSION FAILED|^=== /.test(l));
      results.push({ ok: s.code === 0, label: "B: the whole suite (tools/run-all.sh)", summary: last.join("; "), errors: s.code === 0 ? [] : s.out.split("\n").filter(l => /FAILED|!!!/.test(l)) });
    }
  } catch (e) { results.push({ ok: false, label: "setup", summary: e.message, errors: [] }); }
  results.forEach(r => {
    console.log("\n" + (r.ok ? "PASS" : "FAIL") + "  " + r.label + (r.nerr != null ? "  (test.js exit " + r.code + ", ERRORS: " + r.nerr + ")" : ""));
    console.log("  " + r.summary);
    r.errors.slice(0, 12).forEach(e => console.log("  " + e.trim()));
    if (r.errors.length > 12) console.log("  ... " + (r.errors.length - 12) + " more");
  });
  if (rows.length) console.log("\n" + table(rows));
  const ok = results.every(r => r.ok);
  console.log("\n" + (ok ? "VERIFIED: every proposed claim passes the copy's test.js and redteam.js, as the statements stand and with the corrections applied" +
    (SUITE ? ", and the corrected copy passes the whole suite" : "") :
    "NOT VERIFIED: " + results.filter(r => !r.ok).map(r => r.label).join("; ")));
  if (!KEEP) fs.rmSync(OUTDIR, { recursive: true, force: true }); else console.log("(kept: " + OUTDIR + ")");
  process.exit(ok ? 0 : 1);
}
main();
