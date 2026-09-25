#!/usr/bin/env python3
"""Build the Austerlitz command map: one self-contained HTML from the source files.

    python3 build.py                 writes dist/austerlitz-command-map.html, prints size and md5
    python3 build.py --expect MD5    also fails (exit 1) unless the result has that md5

The bundle is the source files concatenated in load order and placed in shell.html where
/*@@BUNDLE@@*/ stands. Files are read and written as bytes, and any CRLF line endings a
Windows checkout or editor introduces are turned back into LF, so the same sources give the
same bytes on every platform."""
import hashlib, os, sys
ORDER = ['assets.js', 'geo.js', 'data.js', 'analysis.js', 'world.js', 'symbols.js', 'app.js']
here = os.path.dirname(os.path.abspath(__file__))
def read(name):
    b = open(os.path.join(here, name), 'rb').read().replace(b'\r\n', b'\n')
    if b'\r' in b: sys.exit('stray carriage return in ' + name)
    return b
shell = read('shell.html')
if shell.count(b'/*@@BUNDLE@@*/') != 1: sys.exit('shell.html must contain /*@@BUNDLE@@*/ exactly once')
out = shell.replace(b'/*@@BUNDLE@@*/', b''.join(read(n) for n in ORDER))
os.makedirs(os.path.join(here, 'dist'), exist_ok=True)
dst = os.path.join(here, 'dist', 'austerlitz-command-map.html')
open(dst, 'wb').write(out)
md5 = hashlib.md5(out).hexdigest()
print('dist/austerlitz-command-map.html  %s bytes  md5 %s' % (format(len(out), ','), md5))
if '--expect' in sys.argv:
    want = sys.argv[sys.argv.index('--expect') + 1]
    if md5 != want: sys.exit('MISMATCH: expected md5 %s' % want)
    print('matches the expected build')
