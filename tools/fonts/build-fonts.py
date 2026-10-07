#!/usr/bin/env python3
"""tools/fonts/build-fonts.py: the embedded type (decision 141; docs/FINAL_AUDIT.md T-0). A development step; CI never runs it.

  python3 tools/fonts/build-fonts.py [--cache DIR] [--check]

Reads the sources pinned in tools/fonts/sources.json (each downloaded once into the cache, default tools/fonts/.cache/, which git
ignores; a file whose sha256 differs is refused), and writes fonts.css at the repository root and tools/fonts/manifest.json:
three faces, each a modified version of an open font, as WOFF2 in base64 data URLs, with every licence in fonts.css's header.
  "Austerlitz Sans"   Inter 4.001 (SIL OFL 1.1): instanced to weights 400-700 at optical size 14
  "Austerlitz Sans"   one glyph, U+2502, of DejaVu Sans 2.37 (Bitstream Vera licence), a second face of the same family
  "Austerlitz Serif"  TeX Gyre Pagella 2.501 (GUST Font License, an instance of the LPPL 1.3c), weight 400
Each is subset to the code points it is asked for and has (its unicode-range is written from its own cmap) and to the OpenType
features in FEATURES (Chrome's defaults without calt, which in Inter draws " x " as a multiplication sign and "->" as an arrow and so
would alter quoted words; with tnum for the tabular-nums rules), hinting removed, and renamed (name IDs 1-4 and 6), with a note of the
change in name ID 10: the GUST Font License's request, the LPPL's clause 6 (a modified version identified as such, its changes stated,
no support implied, where to obtain the original), the Bitstream Vera licence's rule (no "Bitstream" or "Vera" in a modified font's name)
and OFL practice. Not legal advice.

The vertical metrics are overridden (ascent-override, descent-override, line-gap-override) to those of the faces the harness's
baselines were measured with, DejaVu Sans (hhea 1901/483/0 per 2048) for the sans and Liberation Serif (0.891/0.216/0.042) for the
serif: layout-compatibility values (a design decision, recorded as such), so that line boxes do not move. size-adjust is not used,
so CSS px sizes and the 10.5 px floor stay what they say.

Needs fontTools 4.66.1 and brotli 1.2.0 (pinned in sources.json; the output's bytes depend on them), in a virtual environment
outside the repository, for example:
  python3 -m venv /tmp/fonts-venv && /tmp/fonts-venv/bin/pip install fonttools==4.66.1 brotli==1.2.0
  /tmp/fonts-venv/bin/python tools/fonts/build-fonts.py
--check builds in memory and exits 1 if fonts.css or manifest.json differs from what is committed (nothing is written).
css-test.js validates the committed fonts.css on every run (names, features, licences, coverage of every visitor glyph), with no
Python: a data task that adds a letter the faces lack fails there until this generator is run again with the range widened."""
import base64, hashlib, io, json, os, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
SOURCES = json.load(open(os.path.join(HERE, 'sources.json'), encoding='utf-8'))
FEATURES = ['kern', 'liga', 'ccmp', 'locl', 'mark', 'mkmk', 'rlig', 'clig', 'tnum']
# the code points asked for: whole Latin blocks (a data task adding a Czech or French letter stays covered), the Cyrillic the sources'
# titles and quoted words use (appearance.js; in the sans only), the punctuation, arrows and signs the interface draws
SANS_RANGE = 'U+0020-007E,U+00A0-017F,U+0400-045F,U+0462-0463,U+0472-0475,U+2010-2027,U+2030-203A,U+2190-2193,U+2212,U+2248,U+25BA,U+25C4'
SERIF_RANGE = 'U+0020-007E,U+00A0-017F,U+2010-2027,U+2030-203A,U+2190-2193,U+2212,U+2248'
FEAT_WORDS = ' '.join(FEATURES)
FACES = [
    dict(src='inter', family='Austerlitz Sans', ps='AusterlitzSans', range=SANS_RANGE, instance={'wght': (400, 700), 'opsz': 14},
         weight='400 700', metrics=('92.8%', '23.6%', '0%'),
         note='Modified version of Inter 4.001 (rsms/Inter; SIL Open Font License 1.1) for the Austerlitz command map: instanced to weights '
              '400-700 at optical size 14, subset to the code points in its unicode-range and the OpenType features ' + FEAT_WORDS +
              ', hinting removed, renamed. The original: https://github.com/rsms/inter'),
    dict(src='dejavu', family='Austerlitz Sans', ps='AusterlitzSans-BoxLine', range='U+2502', instance=None,
         weight='400 700', metrics=('92.8%', '23.6%', '0%'),
         note='Modified version of DejaVu Sans 2.37 for the Austerlitz command map: one glyph (U+2502), hinting removed, renamed '
              '(Bitstream Vera Fonts licence). The original: https://dejavu-fonts.github.io'),
    dict(src='pagella', family='Austerlitz Serif', ps='AusterlitzSerif', range=SERIF_RANGE, instance=None,
         weight='400', metrics=('89.1%', '21.6%', '4.2%'),
         note='Modified version of TeX Gyre Pagella 2.501 (GUST e-foundry; GUST Font License) for the Austerlitz command map: subset to the '
              'code points in its unicode-range and the OpenType features ' + FEAT_WORDS + ', hinting removed, renamed. Its authors provide '
              'no support for this modified version. The unmodified original: https://ctan.org/pkg/tex-gyre-pagella',
         licence13='This Font Software is a modified version of TeX Gyre Pagella, distributed under the GUST Font License, an instance of '
                   'the LaTeX Project Public License 1.3c (https://www.latex-project.org/lppl.txt); the licence and the changes are in the '
                   'header of fonts.css.',
         licence14='https://www.gust.org.pl/fonts/licenses/GUST-FONT-LICENSE.txt'),
]


def die(msg):
    sys.exit('build-fonts.py: ' + msg)


def args():
    a = sys.argv[1:]
    cache = os.environ.get('AUSTERLITZ_FONT_CACHE') or os.path.join(HERE, '.cache')
    if '--cache' in a:
        i = a.index('--cache')
        if i + 1 >= len(a): die('--cache needs a directory')
        cache = a[i + 1]
    return os.path.abspath(cache), '--check' in a


def versions():
    import fontTools, brotli
    want = SOURCES['requirements']
    have = {'fonttools': fontTools.version, 'brotli': brotli.__version__}
    for k, v in want.items():
        if have[k] != v: die('%s %s found, %s pinned (sources.json): the WOFF2 bytes depend on it' % (k, have[k], v))
    return have


def fetch(key, cache):
    f = SOURCES['files'][key]
    path = os.path.join(cache, key + '-' + f['sha256'][:16] + os.path.splitext(f['url'])[1])
    if os.path.exists(path):
        data = open(path, 'rb').read()
        if hashlib.sha256(data).hexdigest() == f['sha256']: return data
    os.makedirs(cache, exist_ok=True)
    data = urllib.request.urlopen(f['url'], timeout=120).read()
    got = hashlib.sha256(data).hexdigest()
    if got != f['sha256']: die('%s: sha256 %s, pinned %s (%s); refused' % (key, got, f['sha256'], f['url']))
    open(path, 'wb').write(data)
    return data


def codepoints(s):
    out = []
    for part in s.split(','):
        a, _, b = part.strip()[2:].partition('-')
        a = int(a, 16); b = int(b, 16) if b else a
        out += range(a, b + 1)
    return out


def compact(cps):
    r = []
    for c in sorted(cps):
        if r and c == r[-1][1] + 1: r[-1][1] = c
        else: r.append([c, c])
    return ','.join('U+%04X' % a if a == z else 'U+%04X-%04X' % (a, z) for a, z in r)


def build(F, data):
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer
    from fontTools import subset
    f = TTFont(io.BytesIO(data), recalcTimestamp=False)
    if F['instance']:
        f = instancer.instantiateVariableFont(f, F['instance'])
        # round trip through bytes: without it the subsetter raises KeyError on the lazily loaded gvar
        t = io.BytesIO(); f.recalcTimestamp = False; f.save(t); t.seek(0); f = TTFont(t, recalcTimestamp=False)
    o = subset.Options()
    o.layout_features = FEATURES; o.hinting = False; o.desubroutinize = True; o.flavor = 'woff2'
    o.name_IDs = [0, 1, 2, 3, 4, 5, 6, 10, 13, 14]; o.name_languages = [0x409]; o.notdef_outline = True
    o.drop_tables = o.drop_tables + ['FFTM']   # FontForge's timestamp table (Pagella): not needed, and not subsettable
    s = subset.Subsetter(o); s.populate(unicodes=codepoints(F['range'])); s.subset(f)
    n = f['name']
    version = n.getDebugName(5) or ''
    for nid in (1, 2, 3, 4, 5, 6, 16, 17, 21, 22, 25):
        n.removeNames(nameID=nid)
    for nid, val in [(1, F['family']), (2, 'Regular'), (3, F['ps'] + ';' + version.replace('Version ', '') + ';modified'), (4, F['family']),
                     (5, version + ';modified for the Austerlitz command map'), (6, F['ps']), (10, F['note'])]:
        n.setName(val, nid, 3, 1, 0x409)
    if F.get('licence13'):
        n.setName(F['licence13'], 13, 3, 1, 0x409); n.setName(F['licence14'], 14, 3, 1, 0x409)
    # every name ID another table refers to (fvar instances, STAT) must still be there
    ids = {r.nameID for r in n.names}
    if 'STAT' in f and f['STAT'].table.ElidedFallbackNameID not in ids: die(F['ps'] + ': STAT refers to a name ID that was removed')
    if 'fvar' in f:
        for a in f['fvar'].axes:
            if a.axisNameID not in ids: die(F['ps'] + ': fvar refers to a name ID that was removed')
        for inst in f['fvar'].instances:
            if inst.subfamilyNameID not in ids: die(F['ps'] + ': an fvar instance refers to a name ID that was removed')
    cps = set(f.getBestCmap().keys())
    if not cps <= set(codepoints(F['range'])): die(F['ps'] + ': the subset maps code points it was not asked for')
    b = io.BytesIO(); f.flavor = 'woff2'; f.recalcTimestamp = False; f.save(b)
    return b.getvalue(), cps


def licence_header(files):
    readme = files['pagella-readme'].decode('utf-8')
    lines = readme.split('\n'); i = next(k for k, l in enumerate(lines) if l.startswith('License:'))
    j = next(k for k in range(i + 1, len(lines)) if lines[k].startswith('####'))
    pagella_notice = '\n'.join(lines[i:j]).rstrip()
    if 'GUST Font License' not in pagella_notice: die('README-TeX-Gyre-Pagella.txt: no licence paragraph found')
    if 'based on the URW Palladio L' not in readme.replace('\n', ' '): die('README-TeX-Gyre-Pagella.txt: no URW Palladio statement found')
    head = [
        'fonts.css: generated by tools/fonts/build-fonts.py from the sources pinned in tools/fonts/sources.json (decision 141); do not edit.',
        'build.py puts it at the /*FONTS*/ marker in the stylesheet. Three faces, each a modified version of an open font, embedded as WOFF2:',
        '',
        '  "Austerlitz Sans" (AusterlitzSans): Inter 4.001, Copyright 2020 The Inter Project Authors (https://github.com/rsms/inter), under the',
        '    SIL Open Font License 1.1 (below). Changes: instanced to weights 400-700 at optical size 14; subset to the code points of its',
        '    unicode-range and the OpenType features ' + FEAT_WORDS + '; hinting removed; renamed.',
        '  "Austerlitz Sans" (AusterlitzSans-BoxLine): the one glyph U+2502 of DejaVu Sans 2.37, under the Bitstream Vera Fonts licence and',
        '    the Arev Fonts licence, the DejaVu changes in the public domain (below). Changes: one glyph kept; hinting removed; renamed.',
        '  "Austerlitz Serif" (AusterlitzSerif): a modified version of TeX Gyre Pagella 2.501 (GUST e-foundry), which is based on URW',
        '    Palladio L, released by URW++ under the GUST Font License (README-TeX-Gyre-Pagella.txt). Changes: subset to the code points of',
        '    its unicode-range and the OpenType features ' + FEAT_WORDS + '; hinting removed; renamed (the GUST Font',
        '    License\'s request). Its authors provide no support for this modified version. The unmodified original:',
        '    https://ctan.org/pkg/tex-gyre-pagella (CTAN fonts/tex-gyre). Distributed under the GUST Font License (below), an instance of',
        '    the LaTeX Project Public License 1.3c or later (https://www.latex-project.org/lppl.txt).',
        '',
        'The vertical metrics are overridden to those of DejaVu Sans (the sans) and Liberation Serif (the serif): layout-compatibility',
        'values, so that line boxes stay where the harness measured them. Each face\'s name ID 10 states its changes.',
        '',
        '======== Inter: the SIL Open Font License 1.1 (google/fonts ofl/inter/OFL.txt) ========',
        files['inter-licence'].decode('utf-8').rstrip(),
        '',
        '======== TeX Gyre Pagella: its notice (README-TeX-Gyre-Pagella.txt) and the GUST Font License (GUST-FONT-LICENSE.txt) ========',
        pagella_notice,
        '',
        files['pagella-licence'].decode('utf-8').rstrip(),
        '',
        '======== DejaVu Sans: its licence (LICENSE) ========',
        files['dejavu-licence'].decode('utf-8').rstrip(),
    ]
    text = '\n'.join(head).replace('\r\n', '\n').replace('*/', '* /')
    return '/* ' + text + '\n*/\n'


def main():
    cache, check = args()
    tools = versions()
    files = {k: fetch(k, cache) for k in SOURCES['files']}
    rules, man = [], []
    for F in FACES:
        woff2, cps = build(F, files[F['src']])
        ur = compact(cps)
        rules.append('@font-face{font-family:"%s";src:url(data:font/woff2;base64,%s) format("woff2");font-weight:%s;font-style:normal;'
                     'ascent-override:%s;descent-override:%s;line-gap-override:%s;font-display:swap;unicode-range:%s}'
                     % (F['family'], base64.b64encode(woff2).decode('ascii'), F['weight'], F['metrics'][0], F['metrics'][1], F['metrics'][2], ur))
        man.append({'family': F['family'], 'face': F['ps'], 'source': F['src'], 'source_sha256': SOURCES['files'][F['src']]['sha256'],
                    'codepoints': len(cps), 'unicode_range': ur, 'woff2_bytes': len(woff2), 'woff2_sha256': hashlib.sha256(woff2).hexdigest()})
    css = licence_header(files) + '\n'.join(rules) + '\n'
    for bad in ('/*CSS*/', '/*JS*/', '/*FONTS*/'):
        if bad in css: die('fonts.css would contain the build marker ' + bad)
    if '</style' in css.lower(): die('fonts.css would contain "</style"')
    manifest = {'about': 'written by tools/fonts/build-fonts.py with fonts.css; do not edit', 'tools': tools,
                'fonts_css': {'bytes': len(css.encode('utf-8')), 'sha256': hashlib.sha256(css.encode('utf-8')).hexdigest(),
                              'licence_header_bytes': len(licence_header(files).encode('utf-8'))},
                'features': FEATURES, 'faces': man}
    mtext = json.dumps(manifest, indent=1, ensure_ascii=False) + '\n'
    out_css, out_man = os.path.join(ROOT, 'fonts.css'), os.path.join(HERE, 'manifest.json')
    if check:
        same = (os.path.exists(out_css) and open(out_css, encoding='utf-8').read() == css and
                os.path.exists(out_man) and open(out_man, encoding='utf-8').read() == mtext)
        print('fonts.css and manifest.json ' + ('match a fresh build' if same else 'DIFFER from a fresh build'))
        sys.exit(0 if same else 1)
    open(out_css, 'w', encoding='utf-8', newline='\n').write(css)
    open(out_man, 'w', encoding='utf-8', newline='\n').write(mtext)
    print('fonts.css %d bytes (licence header %d); %s' % (manifest['fonts_css']['bytes'], manifest['fonts_css']['licence_header_bytes'],
          ', '.join('%s %d bytes, %d code points' % (m['face'], m['woff2_bytes'], m['codepoints']) for m in man)))


if __name__ == '__main__':
    main()
