# Audit evidence: Austerlitz, 2 November 2026

Baseline: billybobbyboo/Austerlitz main 43e3e5bcc5ab0cbbcb604a22a5b8c29f801649c8.
Application SHA-256 bf27887c177ec68efbaedfe29e9d7826cf89c66ca7390b17e3cda8acf708db07.
No tracked application, data, check, threshold or decision file was changed.

Start with docs/FINAL_AUDIT_POST_STAGE8_CHATGPT.md. findings.json is the stable detailed register; merge-ledger.csv is ready for the other auditors' IDs. Empty external-audit columns are intentional.

Reproduction: extract these docs into a checkout of the named commit, install package.json dependencies, and run diagnostic scripts from the repository root. They require the repository's original tools; this package is evidence, not a runnable copy of the whole application. Browser diagnostics use Playwright 1.56.0 / Chromium 141.0.7390.37 / SwiftShader. Do not run browser diagnostics concurrently: repository timing checks assume an unshared browser workload. Local Node was 24.22.1; CI Node was 22.

Local primary diagnostics:
- node docs/final-audit-chatgpt-evidence/model-audit.js
- node docs/final-audit-chatgpt-evidence/device-audit.js
- node docs/final-audit-chatgpt-evidence/extended-playback.js
- node docs/final-audit-chatgpt-evidence/trace-and-visual.js
- Browser stills/UI inputs: browser-audit.js (its initial hidden-button setup error and corrected resume are documented in the report). It was followed by the dedicated extended and traced scripts; use --skip-extended when reproducing the UI/stills only.

Original repository diagnostics were also run with separate output directories: contact-8f.js, ice-8h.js, phone-rule.js, mutate-8l.js and check-report.js. Exact arguments and outcome distinctions are in the report.

CI artifacts are existing results downloaded and rejudged here, not fresh local full harness runs. ci-full is run 41259079904 at test commit d3f70266; the app and check-code diff to audited main is empty. ci-pr78 is selftest-report from run 41282709563. Downloaded images retain original case names. Local rendered images are at this directory's root. infantry-motion.mp4/gif and motion-frames are actual rendered frames on the diagnostic clock, not device frame-pacing evidence.

Historical verification is sampled. narrative-coverage.csv marks every inventoried statement as not individually reverified by this audit; historical-source-ledger.csv identifies the narrowly checked source claims. Existing claim classes are retained separately from this auditor's certification. Three fresh primary-text page fetches have URLs and SHA-256s in sources/. The MZA tile fresh fetch returned HTTP 403; the stored repository tile was read, checked against its stored original hash and retained with the composite. Old source composite overlays consulted in the repository depict the old 8H map and must not be read as current main.

Setup notes: npm and browser installation succeeded. The first browser CDN mirror returned invalid ZIP data; fallback mirrors succeeded. An initial mutate-8l invocation omitted required arguments and failed; mutate-8l.log preserves it, mutations.log/json preserve the correct passing negative-control experiment. Local renderer timing is not owner-device timing. setup-package-lock.json records this setup and was not added to the application's tracked files.

The package contains no deployment or merge. All future remedies are proposals.
