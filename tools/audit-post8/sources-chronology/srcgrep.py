#!/usr/bin/env python3
"""Search a downloaded OCR text layer (an archive.org _djvu.txt) for a regex across line breaks; read-only.
usage: python3 -I srcgrep.py FILE REGEX [context_chars=300] [max=8]
Joins lines (dropping end-of-line hyphenation: '-', the soft hyphen, '¬', '⸗'), collapses whitespace, and prints each match with
its context and the line number of the original file where the match starts (to find the printed page nearby)."""
import sys, re, bisect
path, rx = sys.argv[1], sys.argv[2]
ctx = int(sys.argv[3]) if len(sys.argv) > 3 else 300
mx = int(sys.argv[4]) if len(sys.argv) > 4 else 8
raw = open(path, encoding="utf-8", errors="replace").read().split("\n")
buf, starts = [], []
pos = 0
for ln in raw:
    s = re.sub(r"\s+", " ", ln).strip()
    starts.append(pos)
    if s.endswith(("-", "­", "¬", "⸗")) and len(s) > 1:
        s = s[:-1]; sep = ""
    else:
        sep = " "
    buf.append(s + sep); pos += len(s) + len(sep)
text = "".join(buf)
n = 0
for m in re.finditer(rx, text, re.I):
    li = bisect.bisect_right(starts, m.start())
    a, b = max(0, m.start() - ctx), min(len(text), m.end() + ctx)
    print("--- line %d: ...%s[[%s]]%s..." % (li, text[a:m.start()], m.group(0), text[m.end():b]))
    n += 1
    if n >= mx: break
print("matches shown: %d" % n, file=sys.stderr)
