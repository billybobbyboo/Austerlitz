#!/usr/bin/env python3
"""v-premise-b: the static checks behind the premise verdicts (final audit after Stage 8).

Reads only committed files (the audited build's sources, archive/ builds, docs evidence, the CI visual report saved by the audit).
Run: python3 tools/audit-post8/verification/v-premise-b/checks.py
Nothing is written; everything is printed.
"""
import gzip, json, math, os, re

R = '/home/user/Austerlitz'
def rd(p): return open(os.path.join(R, p), encoding='utf8').read()

def fn_body(s, name, n=1600):
    i = s.find(name)
    if i < 0: return None
    seg = s[i:i + n]
    j = seg.find('\nfunction ', 10)
    return seg[:j if j > 0 else n]

print('== 1. origin: archived builds (before Stage 8 unless named)')
s5c = rd('archive/step5c-45f8f662.html')   # PR #58, the last check:data reference before Stage 8
b = fn_body(s5c, 'function drawerKey(){', 400)
print('step5c drawerKey (formation key: text phase + moving flag only, no place):', b.replace('\n', ' ')[:260])
i = s5c.find('drawerKey()!==_drawerKey')
print('step5c setClock within a phase:', s5c[i - 60:i + 40].replace('\n', ' '))
for f in ['archive/stage4d-9b13adbf.html', 'archive/step5c-45f8f662.html']:
    m = re.search(r'function free\(\)\{[^}]*\}', rd(f))
    print(f, 'LANDCAM free():', m.group(0) if m else None, '(no tween stop)')
s0 = rd('archive/stage0-c09c4b23.html')
i = s0.find('@media (max-height:430px)')
blk = s0[i:s0.find('}\n', s0.find('.legend{display:none}', i)) + 1]
print('stage0 short-height block hides .dispatch and .legend:', '.dispatch{display:none}' in blk and '.legend{display:none}' in blk,
      '| #firstrun given max-height/overflow there:', bool(re.search(r'#firstrun\{[^}]*(max-height|overflow)', blk)))
for f in ['archive/stage0-c09c4b23.html', 'archive/stage2c-68ac7721.html', 'archive/spine-6b2cccd4.html', 'archive/stage4d-9b13adbf.html']:
    s = rd(f)
    print(f, '| body.pm-watch .legend hidden:', 'body.pm-watch .legend' in s, '| narrow rule (max-width:1080px):', '@media (max-width:1080px)' in s,
          '| rose inside .legend:', s.rfind('<div class="legend">', 0, s.find('rose-needle')) > s.rfind('</div>', 0, s.rfind('<div class="legend">', 0, s.find('rose-needle'))))
for name in ['function buildArrow(a){', 'function plateauStrength(side){', 'function rebuildOverlays(ph,instant){']:
    body = fn_body(s5c, name)
    print('step5c', name, 'reads the reading (commandView/readHidden/knowledgeOf/drawnKnow):',
          any(k in (body or '') for k in ['commandView', 'readHidden', 'knowledgeOf', 'drawnKnow']))

print('\n== 2. audited sources (f10fe585): the same mechanisms')
app = rd('app.js'); css = rd('style.css'); world = rd('world.js')
b = fn_body(app, 'function drawerKey(){', 900)
print('drawerKey places only under a reading:', 'commandView!=="none"' in b.split('\n')[1], '| formation key holds posNow/nearestFeature:', 'posNow' in b or 'nearestFeature' in b)
print('LANDCAM free():', re.search(r'function free\(\)\{[^}]*\}', app).group(0))
print('stopTweens callers outside the self-test (line numbers):', [app.count('\n', 0, m.start()) + 1 for m in re.finditer(r'stopTweens\(\)', app)][:6])
i7 = css.find('@media (max-height:700px){'); blk7 = css[i7:css.find('\n}', i7)]
print('rose hidden at <=700 px tall (style.css:%d):' % (css.count('\n', 0, i7) + 1), '.legend .rose{display:none}' in blk7)
print('phone first-run max-height only under (max-width:720px) and (min-height:431px):',
      '@media (max-width:720px) and (min-height:431px)' in css and 'max-height:min(50vh' in css)
print('mereLevel read in app.js at lines (14096 is the 8G self-test\'s "no building on the ice"; no figure seating reads it):',
      [app.count('\n', 0, m.start()) + 1 for m in re.finditer(r'mereLevel', app)])
print('ice material depthWrite:false, opacity 0.96:', 'transparent:true,opacity:0.96,depthWrite:false' in world)

print('\n== 3. V-M5: place names on the paper map')
e2 = json.load(open(os.path.join(R, 'docs/stage2-evidence/paper-2e.json')))['heads']['paper-north-up']
print('2E (paper-2e.json) paper-north-up dropped:', e2['dropped'], [x for x in e2['ids'] if x.startswith('t:')])
ci = json.load(gzip.open(os.path.join(R, 'docs/audit-post8-evidence/checks/ci-visual-41394859313-report.json.gz')))
print('CI run 41394859313, build', ci.get('md5'))
for n in ['staff-paper', 'paper-north-up', 'paper-laptop', 'paper-close', 'paper-drawer', 'phone-390-paper']:
    L = ci['cases'][n]['layer']
    print('  %-16s %s %s dropped %2d, place names dropped %2d' % (n, ci['cases'][n]['viewport'], ci['cases'][n]['clock'], L['dropped'], len([x for x in L['droppedIds'] if x.startswith('t:')])))
th = rd('tools/visual/thresholds.js')
print('DROP_LIMIT paper-north-up / paper-laptop / staff-paper:', re.search(r'"paper-north-up":(\d+)', th).group(1), re.search(r'"paper-laptop":(\d+)', th).group(1), re.search(r'"staff-paper":(\d+)', th).group(1))

print('\n== 4. visual-landscape #0: preset cameras near the Satschan mere (disc centre world (-36, 85.5), 28 x 10.5)')
for f in ['data.js', 'analysis.js']:
    s = rd(f)
    for m in re.finditer(r'cam:\[(-?[\d.]+),(-?[\d.]+),(-?[\d.]+),(-?[\d.]+),(-?[\d.]+),(-?[\d.]+)\]', s):
        e = list(map(float, m.groups()[:3])); t = list(map(float, m.groups()[3:]))
        dT = math.hypot(t[0] + 36, t[2] - 85.5)
        if dT < 60:
            print('  %s:%d eye-target %.0f units, target %.0f from the disc centre, eye %.0f' % (f, s.count('\n', 0, m.start()) + 1, math.dist(e, t), dT, math.hypot(e[0] + 36, e[2] - 85.5)))

print('\n== 5. V-M3: the vantages\' headings against north (GEOREF ROT 17.42 deg, geo.js:26, NORTH geo.js:54)')
ROT = 17.42; N = (-math.sin(math.radians(ROT)), -math.cos(math.radians(ROT)))
vm = re.search(r'var VANTAGE=\{([^}]*)\}', app).group(1)
for k, nums in re.findall(r'(\w+):\[([^\]]*)\]', vm):
    c = list(map(float, nums.split(','))); fx, fz = c[3] - c[0], c[5] - c[2]; L = math.hypot(fx, fz); fx /= L; fz /= L
    print('  %-8s view heading %4.0f deg from north' % (k, abs(math.degrees(math.atan2(fx * N[1] - fz * N[0], fx * N[0] + fz * N[1])))))

print('\n== 6. visibility #0: the benchmark\'s longest-hidden measure against its window')
m = re.search(r'"hybrid-play":\[(\d+),(\d+),(\d+)\]', th[th.find('VIS'):])
drawn, inview, longest = map(int, m.groups())
print('  MOTION.VIS hybrid-play drawn %d of %d formation-frames, longest %d ms; frames = %d/28 = %.0f; window at 30 fps = %.0f ms'
      % (drawn, inview, longest, inview, inview / 28, inview / 28 / 30 * 1000))
