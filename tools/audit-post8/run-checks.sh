#!/bin/sh
# Final audit after Stage 8 (docs/FINAL_AUDIT_POST_STAGE8.md): the repository's required checks on the audited build, in sequence,
# each logged with its exit code, wall time and UTC start/end. Changes nothing in the application.
# AUSTERLITZ_CHROME should name Chromium 141.0.7390.37 (the headless shell Playwright 1.56 pins and CI runs).
# usage: AUSTERLITZ_CHROME=/path/to/headless_shell sh tools/audit-post8/run-checks.sh [step ...]
#   steps: baseline npm-test check-data check-chronology check-contrast check-selftest check-visual check-report (default: all, in order)
set -u
cd "$(dirname "$0")/../.."
E=${AUDIT_EVIDENCE:-docs/audit-post8-evidence/checks}
mkdir -p "$E"
run(){ name=$1; shift; s=$(date +%s)
  echo "=== $name start $(date -u +%FT%TZ) commit $(git rev-parse --short HEAD) chrome ${AUSTERLITZ_CHROME:-playwright-default}" | tee -a "$E/summary.txt"
  "$@" > "$E/$name.txt" 2>&1; code=$?; e=$(date +%s)
  echo "=== $name exit=$code seconds=$((e-s)) end $(date -u +%FT%TZ)" | tee -a "$E/summary.txt"; }
STEPS=${*:-"baseline npm-test check-data check-chronology check-contrast check-selftest check-visual check-report"}
for st in $STEPS; do
  case $st in
    baseline) run baseline npm run check:baseline ;;
    npm-test) run npm-test env AUSTERLITZ_SUITE_OUT="$PWD/$E/suite-out" npm test ;;
    check-data) run check-data npm run check:data ;;
    check-chronology) run check-chronology npm run check:chronology ;;
    check-contrast) run check-contrast npm run check:contrast ;;
    check-selftest) run check-selftest npm run check:selftest; cp tools/visual/out-selftest/report.json "$E/selftest-report.json" 2>/dev/null ;;
    check-visual) run check-visual npm run check:visual; cp tools/visual/out/report.json "$E/visual-report.json" 2>/dev/null ;;
    check-report) run check-report npm run check:report ;;
    *) echo "unknown step $st" | tee -a "$E/summary.txt" ;;
  esac
done
echo "=== done $(date -u +%FT%TZ)" | tee -a "$E/summary.txt"
