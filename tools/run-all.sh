#!/bin/sh
# Full regression: regenerate derived test modules from live code, build, then run every suite.
cd "$(dirname "$0")/.."   # the repository root, wherever it is checked out
# Each suite's full output goes to a private temporary directory (roadmap step 1, T-9: until step 1 fixed /tmp/out_*.txt paths, which
# two runs on one machine shared). It is removed when the run passes and kept, and named, when anything fails. To keep every
# output of a passing run too, set AUSTERLITZ_SUITE_OUT to a directory (created if missing; never removed).
if [ -n "$AUSTERLITZ_SUITE_OUT" ]; then
  OUT=$AUSTERLITZ_SUITE_OUT; mkdir -p "$OUT" || exit 1; keep=1
else
  OUT=$(mktemp -d "${TMPDIR:-/tmp}/austerlitz-suite.XXXXXX") || { echo "CANNOT MAKE A TEMPORARY DIRECTORY"; exit 1; }; keep=""
fi
cleanup(){ if [ -n "$keep" ]; then echo "(full outputs kept in $OUT)"; else rm -rf "$OUT"; fi; }
trap cleanup EXIT
trap 'keep=1; exit 130' INT
trap 'keep=1; exit 143' TERM
node tools/mk-world-mod.js >/dev/null || exit 1
node tools/mk-helpers.js >/dev/null || exit 1
python3 build.py > "$OUT/build.out" 2>&1 || { echo "BUILD FAILED"; cat "$OUT/build.out"; exit 1; }
node --check bundle.js || { echo "BUNDLE DOES NOT PARSE"; exit 1; }
echo "BUILD OK: $(cat "$OUT/build.out")  bundle $(wc -c < bundle.js) bytes, html $(wc -c < austerlitz-command-map.html) bytes"
# A suite fails if it exits non-zero (including a crash or the timeout) or prints an error summary:
# a non-zero error, failure, finding, violation or disagreement count, a console warning (runtime-test.js: three.js r128's own
# material checks, roadmap step 1, T-1), or a line marking a failed check.
# audit.js alone reports only in its output; the others also set their exit code (runtime-test.js since roadmap step 1).
FAILS='^(CSS ERRORS|ERRORS|errors|findings): *[1-9]|VIOLATIONS \([1-9]|, [1-9][0-9]* failed$|: [1-9][0-9]* disagreements|^  (!|E|FAIL|✗) |BROKEN|  FLOATS$|: DISAGREE$|<-- outside|^console\.warn unique: *[1-9]'
failed=""
# Stage 2B height guard: no presentation code reads the model height (height()/hAt()) where the drawn ground is meant,
# and every call site is classified (docs/STAGE2_SPEC.md §A, §J)
node tools/stage2/height-sites.js --check > "$OUT/out_height-guard.txt" 2>&1; code=$?
echo "=== height guard  exit=$code"
grep -E "call sites|presentation sites|UNCLASSIFIED" "$OUT/out_height-guard.txt" | cut -c1-200
if [ $code -ne 0 ]; then keep=1; echo "!!! height guard FAILED (full output in $OUT/out_height-guard.txt)"; failed="$failed height-guard"; fi
for t in css-test.js test.js geo-test.js terrain-test.js audit.js sim-test.js redteam.js runtime-test.js binding-test.js; do
  timeout 600 node $t > "$OUT/out_$t.txt" 2>&1; code=$?
  echo "=== $t  exit=$code"
  grep -E "CSS ERRORS|behaviour checks|^ERRORS|^warnings|order of battle checks|appearance checks|events validated|geo-test:|VIOLATIONS \(|disagreements|worst agreement|explicit tolerance|most men on the field|tour stop|^findings|retired claims|^errors:|console.warn unique|^  W |  ! |FAIL|BROKEN|FLOATS|DISAGREE|outside|summit ordering|falls downstream|mere:|THROWN|E DRIVE|parent|detachment|command post|^binding|^unsettled|^dashed or segmented" "$OUT/out_$t.txt" | cut -c1-200
  if [ $code -ne 0 ] || grep -Eq "$FAILS" "$OUT/out_$t.txt"; then
    keep=1
    echo "!!! $t FAILED (exit=$code; full output in $OUT/out_$t.txt)"
    failed="$failed $t"
  fi
done
if [ -n "$failed" ]; then echo "REGRESSION FAILED:$failed"; exit 1; fi
echo "ALL 9 SUITES PASSED (and the height guard)"
