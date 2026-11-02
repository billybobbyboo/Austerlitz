"""Post-Stage-8 final audit, area "geography": extract ways from a saved OpenStreetMap API /map response (untrusted data: parsed with the
standard library only, run with python3 -I from outside the data's directory).
  python3 -I tools/audit-post8/geography/osm-ways.py IN.xml OUT.json KEY[=VALUE] ...
Keeps every way carrying one of the given tags (KEY alone: any value), with its tags of interest and its node coordinates (lat, lon).
The previous geography session's waterway extractor (osmw.py, scratch) generalised; measurement code only."""
import sys, json, xml.etree.ElementTree as ET
src, dst, want = sys.argv[1], sys.argv[2], sys.argv[3:]
t = ET.parse(src).getroot()
nodes = {n.get('id'): (float(n.get('lat')), float(n.get('lon'))) for n in t.findall('node')}
def match(tags):
    for w in want:
        k, _, v = w.partition('=')
        if k in tags and (not v or tags[k] == v):
            return True
    return False
out = []
for w in t.findall('way'):
    tags = {tg.get('k'): tg.get('v') for tg in w.findall('tag')}
    if not match(tags):
        continue
    pts = [nodes[nd.get('ref')] for nd in w.findall('nd') if nd.get('ref') in nodes]
    out.append({'id': w.get('id'), 'tags': {k: tags[k] for k in ('name', 'ref', 'highway', 'waterway') if k in tags}, 'pts': pts})
json.dump({'source': src.split('/')[-1], 'filter': want, 'ways': out}, open(dst, 'w'))
print(len(out), 'ways')
