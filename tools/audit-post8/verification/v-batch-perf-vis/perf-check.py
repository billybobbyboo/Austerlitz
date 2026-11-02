#!/usr/bin/env python3
"""Verifier v-batch-perf-vis: independent read of the device reports (docs/stage8-evidence/device/*.json, docs/step6-evidence/perf-*.json),
written without reusing tools/audit-post8/perf/reconcile.js. Prints, per report, the UA's browser version, the refresh, and each segment's
id, kind, fps, p50, p95, max, long, longPct, warmMax, js50, js95, gpu50, calls, tris, clock window; and the missed-refresh share 1 - fps*R.
Usage: python3 perf-check.py <report.json> [...]"""
import json, sys, re
for p in sys.argv[1:]:
    d = json.load(open(p)); R = d.get('refreshMs'); ua = (d.get('device') or {}).get('ua', '')
    m = re.search(r'(Chrome/[\d.]+|Version/[\d.]+ Mobile/\w+ Safari/[\d.]+|CriOS/[\d.]+)', ua)
    print('==', p.split('/')[-1], 'v', d.get('version'), 'build', json.dumps(d.get('build'))[:120], 'R', R, 'longMs', d.get('longMs'), m.group(1) if m else ua[:60])
    for s in d['segments']:
        miss = (1 - s['fps'] * R / 1000) if (R and s.get('fps')) else None
        ck = (s.get('clockFrom'), s.get('clockTo')) if 'clockFrom' in s else ''
        print('  %-22s %-8s fr %4s fps %6s p50 %5s p95 %5s max %6s long %3s %5s%% warm %6s js50 %5s js95 %5s gpu50 %5s calls %5s tris %9s miss %s %s %s' % (
            s.get('id'), s.get('kind'), s.get('frames'), s.get('fps'), s.get('p50'), s.get('p95'), s.get('max'), s.get('long'), s.get('longPct'),
            s.get('warmMax'), s.get('js50'), s.get('js95'), s.get('gpu50'), s.get('calls'), s.get('tris'),
            ('%.3f' % miss) if miss is not None else '-', ck, (s.get('label') or s.get('block') or '')))
