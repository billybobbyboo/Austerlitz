#!/bin/sh
# Full regression: regenerate derived test modules from live code, build, then run every suite.
cd "$(dirname "$0")/.."   # the repository root, wherever it is checked out
node tools/mk-world-mod.js >/dev/null || exit 1
node tools/mk-helpers.js >/dev/null || exit 1
python3 build.py > /tmp/build.out 2>&1 || { echo "BUILD FAILED"; cat /tmp/build.out; exit 1; }
node --check bundle.js || { echo "BUNDLE DOES NOT PARSE"; exit 1; }
echo "BUILD OK: $(cat /tmp/build.out)  bundle $(wc -c < bundle.js) bytes, html $(wc -c < austerlitz-command-map.html) bytes"
for t in css-test.js test.js geo-test.js terrain-test.js audit.js sim-test.js redteam.js runtime-test.js; do
  timeout 600 node $t > /tmp/out_$t.txt 2>&1; code=$?
  echo "=== $t  exit=$code"
  grep -E "CSS ERRORS|behaviour checks|^ERRORS|^warnings|order of battle checks|geo-test:|VIOLATIONS \(|disagreements|worst agreement|explicit tolerance|most men on the field|tour stop|^findings|retired claims|^errors:|console.warn unique|  ! |FAIL|BROKEN|FLOATS|DISAGREE|outside|summit ordering|falls downstream|mere:|THROWN|E DRIVE|parent|detachment|command post" /tmp/out_$t.txt | cut -c1-200
done
