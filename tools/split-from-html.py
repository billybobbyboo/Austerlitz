#!/usr/bin/env python3
"""One-time: re-create the source tree from a built Austerlitz HTML (provenance record).
python3 tools/split-from-html.py <built.html> <outdir>
Cuts the bundle at the header banner of each original source file, in the build order
recorded in the first project chat (assets, geo, data, analysis, world, symbols, app),
writes shell.html around it, and checks that concatenating the pieces gives back the input."""
import sys, os
src, out = sys.argv[1], sys.argv[2]
H = open(src, 'rb').read().decode('utf-8')
assert '\r' not in H, 'the build uses LF line endings only'
a = H.index('<script>/* Embedded ground textures') + len('<script>')
z = H.rindex('</script>')
B = H[a:z]
def banner_before(title):
    i = B.index(title); j = B.rindex('\n/* ===', 0, i) + 1; return j
cuts = [('assets.js', 0), ('geo.js', banner_before('var GEOREF = (function(){')),
        ('data.js', banner_before('   AUSTERLITZ — historical dataset')),
        ('analysis.js', banner_before('   ANALYSIS — the nine things')),
        ('world.js', banner_before('   WORLD v2')),
        ('symbols.js', banner_before('   MILITARY SYMBOLOGY')),
        ('app.js', banner_before('   COMMAND MAP — application'))]
assert [c[1] for c in cuts] == sorted(c[1] for c in cuts), 'files out of order'
os.makedirs(out, exist_ok=True)
for k, (name, start) in enumerate(cuts):
    end = cuts[k + 1][1] if k + 1 < len(cuts) else len(B)
    open(os.path.join(out, name), 'wb').write(B[start:end].encode('utf-8'))
open(os.path.join(out, 'shell.html'), 'wb').write((H[:a] + '/*@@BUNDLE@@*/' + H[z:]).encode('utf-8'))
print('split into shell.html +', ', '.join(c[0] for c in cuts))
