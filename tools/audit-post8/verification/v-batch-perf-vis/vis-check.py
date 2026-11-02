#!/usr/bin/env python3
"""Verifier v-batch-perf-vis: an independent re-analysis of the visibility area's raw driver runs
(docs/audit-post8-evidence/visibility/runs/raw-*.json), written without reusing analyse.js / vis-lib.js summarise().
Codes per frame (vis-lib.js header): '#' drawn, h/H held (H with room), d/D dropped (D with room), t behind ground,
o off screen, p under a panel, '.' not in the layer. stat: the fresh layout's '#' placed, '-' not placed, ' ' not eligible.
A formation's record: its counter 'c:<id>' where collected in a frame, else its name 'n:<id>' (motion.js tracking's definition).
Usage: python3 vis-check.py <run> [<run> ...]   (prints JSON)"""
import json, sys, os

RUNS = os.path.join(os.path.dirname(__file__), '../../../../docs/audit-post8-evidence/visibility/runs')
HIDE = set('hHdD'); ROOM = set('HD'); INV = set('#hHdDt')

def merged(items, fid, n):
    c = items.get('c:' + fid); m = items.get('n:' + fid)
    codes = []; stat = []
    for i in range(n):
        cc = c['codes'][i] if c else '.'
        if cc != '.':
            codes.append(cc); stat.append(c['stat'][i] if c and c.get('stat') else ' ')
        else:
            codes.append(m['codes'][i] if m else '.'); stat.append(m['stat'][i] if m and m.get('stat') else ' ')
    return ''.join(codes), ''.join(stat)

def runs_of(s, pred):
    out = []; cur = 0
    for ch in s:
        if pred(ch): cur += 1
        else:
            if cur: out.append(cur)
            cur = 0
    if cur: out.append(cur)
    return out

def analyse(run):
    d = json.load(open(os.path.join(RUNS, 'raw-%s.json' % run)))
    F = d['frames']; n = len(F); fms = d['opts'].get('frameMs', 1000 / 30)
    play = [i for i, f in enumerate(F) if f['ph'] == 'play']; a, b = play[0], play[-1]
    rest = [i for i, f in enumerate(F) if f['ph'] == 'rest']; fresh = [i for i, f in enumerate(F) if f['ph'] == 'fresh']
    fids = sorted({k[2:] for k in d['items'] if k[:2] in ('c:', 'n:') and d['items'][k].get('fid')})
    out = {'run': run, 'md5': d['md5'], 'viewport': d['viewport'], 'mode': d['mode'], 'frames': n, 'play': [a, b],
           'clock': [F[a]['t'], F[b]['t']], 'frameMs': fms, 'formations': {}}
    TD = TI = TH = TR = TS = TSE = 0; eps = []
    for fid in fids:
        codes, stat = merged(d['items'], fid, n)
        pc = codes[a:b + 1]; ps = stat[a:b + 1]
        inv = sum(ch in INV for ch in pc); drawn = pc.count('#'); hid = sum(ch in HIDE for ch in pc); room = sum(ch in ROOM for ch in pc)
        sel = sum(1 for x in ps if x in '#-'); son = ps.count('#')
        hr = runs_of(pc, lambda ch: ch in HIDE)          # consecutive frames hidden by the layout
        nd = runs_of(pc, lambda ch: ch in INV and ch != '#')  # consecutive in-view frames not drawn
        TD += drawn; TI += inv; TH += hid; TR += room; TS += son; TSE += sel; eps += hr
        rec = {'inView': inv, 'drawn': drawn, 'share': round(drawn / inv, 4) if inv else None,
               'hidLayout': hid, 'hidWithRoom': room, 'episodes': len(hr), 'longestHidFrames': max(hr) if hr else 0,
               'longestHidMs': round((max(hr) if hr else 0) * fms), 'freshShare': round(son / sel, 4) if sel else None,
               'afterRest': codes[rest[-1]] if rest else None, 'fresh': codes[fresh[0]] if fresh else None,
               'freshStatAtEnd': stat[fresh[0]] if fresh else None}
        # clock minutes of the longest hidden run
        if hr:
            L = max(hr); s = None; cur = 0
            for i in range(a, b + 1):
                if codes[i] in HIDE:
                    cur += 1
                    if cur == L: s = i - L + 1; break
                else: cur = 0
            rec['longestHidClock'] = [F[s]['t'], F[s + L - 1]['t']]
        out['formations'][fid] = rec
    out['total'] = {'inView': TI, 'drawn': TD, 'share': round(TD / TI, 4) if TI else None, 'hidLayout': TH,
                    'hidWithRoomShare': round(TR / TH, 4) if TH else None, 'freshShare': round(TS / TSE, 4) if TSE else None,
                    'episodes': len(eps), 'meanEpisodeMs': round(sum(eps) / len(eps) * fms) if eps else 0,
                    'playMs': round((b - a + 1) * fms)}
    # at rest after Play: hidden by layout at the last rest frame, and of those drawn by the fresh view
    if rest and fresh:
        hidRest = [f for f, r in out['formations'].items() if r['afterRest'] in HIDE]
        freshDrawn = [f for f in hidRest if out['formations'][f]['fresh'] == '#']
        out['rest'] = {'hiddenAfterRest': hidRest, 'drawnByFresh': freshDrawn}
    return out

if __name__ == '__main__':
    print(json.dumps([analyse(r) for r in sys.argv[1:]], indent=1))
