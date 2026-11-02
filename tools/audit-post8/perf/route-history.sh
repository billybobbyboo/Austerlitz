#!/usr/bin/env bash
# Post-Stage-8 final audit, area "perf": which code measured which run, and which build each run read (git only; reads, writes one file).
#   bash tools/audit-post8/perf/route-history.sh [out]   (default docs/audit-post8-evidence/perf/route-history.txt)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"; cd "$ROOT"
OUT="${1:-docs/audit-post8-evidence/perf/route-history.txt}"
{
echo "# tools/step6/perf-route.js: commits (the VERSION strings were never bumped for the ordinary route: 'step6-perf-route 3')"
git log --format='%h %ad %s' --date=iso -- tools/step6/perf-route.js
echo
echo "# main at each device run (merge commits; UTC = +1100 minus 11 h)"
git log --merges --format='%h %ad %s' --date=iso | grep -E '#(60|61|62|78|79)\b'
echo "# L1/L2/L3 (22 Oct 06:37-07:46 UTC) after #60 (a8afeec, 05:01 UTC); P3/P4 (22 Oct 22:30-22:40 UTC) after #61 (f8d0949, 21:56 UTC);"
echo "# P5 (23 Oct 01:00 UTC) after #62 (b04e150, 00:47 UTC); the Stage 8 runs (1 Nov 07:01-08:42 UTC) after #78 (c2adefe, 06:55 UTC)"
echo
echo "# the route's file at each of those commits (the last commit touching it), and the measurement code's changes"
for c in a8afeec f8d0949 b04e150 c2adefe; do printf '%s: perf-route.js last changed in %s\n' "$c" "$(git log -1 --format=%h "$c" -- tools/step6/perf-route.js)"; done
echo
echo "## the ordinary route's measurement code (pct, longMs, summarise, sample, tick, VIEWS, PLAYED, SECS, the moves) a8afeec -> HEAD:"
for fn in 'function pct' 'function longMs' 'function summarise' 'function sample' 'function tick' 'function orbitStep' 'function lookStep' 'function panStep' 'function kitMeshes' 'function figuresHidden'; do
  # a function: its text up to the next line that starts a function at the same indentation (line numbers differ between versions)
  a2=$(git show a8afeec:tools/step6/perf-route.js | awk -v f="$fn" 'index($0,f){p=1} p{print} p&&/^    }$|^    function /&&!index($0,f){exit}' | md5sum | cut -c1-8)
  b2=$(awk -v f="$fn" 'index($0,f){p=1} p{print} p&&/^    }$|^    function /&&!index($0,f){exit}' tools/step6/perf-route.js | md5sum | cut -c1-8)
  printf '  %-22s %s\n' "$fn" "$([ "$a2" = "$b2" ] && echo identical || echo DIFFERS)"
done
for v in 'var VIEWS' 'var PLAYED' 'var SECS' 'var OV=' 'var PRATZEN' 'var DIAG'; do
  a=$(git show a8afeec:tools/step6/perf-route.js | awk -v f="$v" 'index($0,f){p=1} p{print} p&&/;$/{exit}' | md5sum | cut -c1-8)
  b=$(awk -v f="$v" 'index($0,f){p=1} p{print} p&&/;$/{exit}' tools/step6/perf-route.js | md5sum | cut -c1-8)
  printf '  %-22s %s\n' "$v" "$([ "$a" = "$b" ] && echo identical || echo DIFFERS)"
done
echo "  (the whole diff a8afeec -> HEAD adds the phone route, the brackets and their report lines; nothing in the shared measurement code)"
echo
echo "## the phone route (function phoneRoute) 9e04718 (P3/P4's) -> HEAD:"
if diff <(git show 9e04718:tools/step6/perf-route.js | sed -n '/function phoneRoute/,/^    }$/p') <(sed -n '/function phoneRoute/,/^    }$/p' tools/step6/perf-route.js) >/dev/null; then echo "  identical"; else echo "  DIFFERS"; fi
echo
echo "# the builds the reports name, against git (md5, sha256, bytes)"
for c in a8afeec f8d0949 b04e150 c2adefe; do
  printf '%s  md5 %s  sha256 %s  bytes %s\n' "$c" "$(git show "$c":austerlitz-command-map.html | md5sum | cut -c1-32)" "$(git show "$c":austerlitz-command-map.html | sha256sum | cut -c1-64)" "$(git show "$c":austerlitz-command-map.html | wc -c)"
done
printf 'working tree  md5 %s  sha256 %s  bytes %s\n' "$(md5sum < austerlitz-command-map.html | cut -c1-32)" "$(sha256sum < austerlitz-command-map.html | cut -c1-64)" "$(wc -c < austerlitz-command-map.html)"
echo
echo "# the device reports' commits (records only)"
git log --format='%h %ad %s' --date=iso -- docs/stage8-evidence/device/
echo
echo "# the scripts that 'checked each table against its JSON' (docs/stage8-evidence/device/README.md): committed anywhere?"
grep -rl -E 'stage8-evidence/device|desk-D1|phone-R1' tools/ 2>/dev/null | grep -v audit-post8 || echo "  none committed (reproduced here by tools/audit-post8/perf/reconcile.js)"
} > "$OUT"
echo "wrote $OUT"
