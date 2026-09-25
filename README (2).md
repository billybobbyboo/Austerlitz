> **Historical record.** This tooling was written to port Stage 0 into the correction-pass source tree,
> which turned out never to have left the first project chat's sandbox. The current tree was re-created
> from the Stage 0 build and already contains these 73 edits. Do not apply them again.

# Stage 0 source patch

The Stage 0 build (`austerlitz-command-map.html`, md5 `c09c4b23d9e245ff9d693960cf9496b9`) is the verified
correction-pass build (md5 `672aff9f0d1b1673d079903185d39351`) plus the 73 edits in `stage0-edits.json`.
Each edit replaces a run of whole lines (`old`, unique in the original build) with `new`. No edit touches
the data declarations (`tools/visual/data-invariance.js` proves it).

| file | purpose |
|---|---|
| `stage0-edits.json` | the edits, in order, with the enclosing function or section of each (`where`) and its line range in the original build |
| `apply-stage0.py` | applies them to the built HTML (verified here) or to a source tree (dry run unless `--write`) |
| `extract-edits.py` | regenerates `stage0-edits.json` from the two builds and checks that it reproduces the patched one exactly |
| `stage0.patch` | the same change as a unified diff of the built HTML, for review |

## Bring the source tree to parity
1. Check the tree is at the correction-pass state: `python3 build.py` should give md5 `672aff9f…`.
2. Dry run: `python3 tools/stage0/apply-stage0.py --tree .` Each edit is located by its text across the
   tree's .js/.html/.css/.py files (built artefacts are skipped) and reported with the file it lands in.
3. If every edit is placed: `python3 tools/stage0/apply-stage0.py --tree . --write` (originals kept as
   `*.pre-stage0`). A `PROBLEM` line means the edit's text was not found exactly once, typically because a
   build step transforms the code or a file uses different line endings; apply that edit by hand from
   `stage0-edits.json`.
4. `python3 build.py` should now give md5 `c09c4b23…` if the build is deterministic; if it differs, compare
   with `stage0.patch`.
5. Run `sh tools/run-all.sh`. `runtime-test.js` and `css-test.js` may need updating for the new first-run
   buttons (`fr-watch`; `fr-close` is now Explore), the legend swatches filled by script, and `#selchip`,
   `#devstats`.

Tested here: HTML mode reproduces the delivered build byte for byte; tree mode placed all 73 edits in a
simulated tree (a template plus the script split into three files at section boundaries) and the
reassembled result matched md5 `c09c4b23…`. It has not been run against the real tree, which was not
available.
