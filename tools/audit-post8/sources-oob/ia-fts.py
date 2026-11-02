#!/usr/bin/env python3
"""Audit helper (sources-oob): query archive.org's public full-text search (the OCR text layer) inside one item
and print the highlighted snippets. Usage: python3 -I ia-fts.py <identifier> <query> [<query> ...]
Writes nothing; a text-layer snippet is weaker evidence than a page image (the project's own standard)."""
import json, sys, urllib.parse, urllib.request
ident = sys.argv[1]
for q in sys.argv[2:]:
    uq = '"%s" AND identifier:%s' % (q, ident)
    url = ('https://archive.org/services/search/beta/page_production/?service_backend=fts&user_query=' +
           urllib.parse.quote(uq) + '&hits_per_page=5&page=1')
    try:
        with urllib.request.urlopen(url, timeout=40) as r:
            d = json.load(r)
    except Exception as e:
        print('==', q, 'ERROR', e); continue
    hits = d.get('response', {}).get('body', {}).get('hits', {})
    print('==', q, '| hits:', hits.get('total'))
    for h in hits.get('hits', []):
        for s in h.get('highlight', {}).get('text', []):
            print('   ', s.replace('\n', ' '))
