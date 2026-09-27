#!/bin/sh
# Full regression: regenerate derived test modules from live code, build, then run every suite.
cd "$(dirname "$0")/.."   # the repository root, wherever it is checked out
node tools/mk-world-mod.js >/dev/null || exit 1
node tools/mk-helpers.js >/dev/null || exit 1
python3 build.py > /tmp/build.out 2>&1 || { echo "BUILD FAILED"; cat /tmp/build.out; exit 1; }
node --check bundle.js || { echo "BUNDLE DOES NOT PARSE"; exit 1; }
echo "BUILD OK: $(cat /tmp/build.out)  bundle $(wc -c < bundle.js) bytes, html $(wc -c < austerlitz-command-map.html) bytes"
# A suite fails if it exits non-zero (including a crash or the timeout) or prints an error summary:
# a non-zero error, failure, finding, violation or disagreement count, or a line marking a failed check.
# audit.js and runtime-test.js report only in their output; the others also set their exit code.
FAILS='^(CSS ERRORS|ERRORS|errors|findings): *[1-9]|VIOLATIONS \([1-9]|, [1-9][0-9]* failed$|: [1-9][0-9]* disagreements|^  (!|E|FAIL|✗) |BROKEN|  FLOATS$|: DISAGREE$|<-- outside'
failed=""
# Stage 2B height guard: no presentation code reads the model height (height()/hAt()) where the drawn ground is meant,
# and every call site is classified (docs/STAGE2_SPEC.md §A, §J)
node tools/stage2/height-sites.js --check > /tmp/out_height-guard.txt 2>&1; code=$?
echo "=== height guard  exit=$code"
grep -E "call sites|presentation sites|UNCLASSIFIED" /tmp/out_height-guard.txt | cut -c1-200
if [ $code -ne 0 ]; then echo "!!! height guard FAILED (full output in /tmp/out_height-guard.txt)"; failed="$failed height-guard"; fi
for t in css-test.js test.js geo-test.js terrain-test.js audit.js sim-test.js redteam.js runtime-test.js; do
  timeout 600 node $t > /tmp/out_$t.txt 2>&1; code=$?
  echo "=== $t  exit=$code"
  grep -E "CSS ERRORS|behaviour checks|^ERRORS|^warnings|order of battle checks|geo-test:|VIOLATIONS \(|disagreements|worst agreement|explicit tolerance|most men on the field|tour stop|^findings|retired claims|^errors:|console.warn unique|  ! |FAIL|BROKEN|FLOATS|DISAGREE|outside|summit ordering|falls downstream|mere:|THROWN|E DRIVE|parent|detachment|command post" /tmp/out_$t.txt | cut -c1-200
  if [ $code -ne 0 ] || grep -Eq "$FAILS" /tmp/out_$t.txt; then
    echo "!!! $t FAILED (exit=$code; full output in /tmp/out_$t.txt)"
    failed="$failed $t"
  fi
done
if [ -n "$failed" ]; then echo "REGRESSION FAILED:$failed"; exit 1; fi
echo "ALL 8 SUITES PASSED (and the height guard)"
