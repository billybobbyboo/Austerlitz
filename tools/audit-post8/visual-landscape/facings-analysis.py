#!/usr/bin/env python3
"""Final audit after Stage 8, area visual-landscape: a summary of facings.json (facings.js: every drawn block every 10 minutes 05:00-17:00, its
drawn yaw against the nearest enemy's bearing). Writes facings-summary.json. usage: python3 facings-analysis.py <facings.json> <out.json>
Adds, beside facings.js's flags A-D: the share of halted blocks within 1.5 km of an enemy that face it within 45 degrees (the convention's check);
the contact cases (an enemy within 0.5 km and the yaw more than 120 degrees off it); by formation and by status; and how many of the moving rows
are drifts under 1 km/h (headingAt sets the yaw whenever a leg is in progress, whatever its rate: app.js updateVisibility/poseBlock)."""
import json, sys, collections
F = json.load(open(sys.argv[1])); rows = F['rows']
halted_near = [r for r in rows if not r['moving'] and r['nearKm'] is not None and r['nearKm'] < 1.5]
within45 = [r for r in halted_near if abs(r['dNear']) <= 45]
moving = [r for r in rows if r['moving']]
drift = [r for r in moving if r['kmh'] is not None and r['kmh'] < 1]
FIGHT = {'attacking', 'engaged', 'charging', 'counterattack'}
contact = [r for r in rows if r['nearKm'] is not None and r['nearKm'] < 0.5 and abs(r['dNear']) > 120]
contact_fight = [r for r in contact if r['status'] in FIGHT]
def by(rs, key):
    c = collections.Counter(r[key] for r in rs); return dict(c.most_common())
def spans(rs):
    out = collections.defaultdict(list)
    for r in rs: out[r['id']].append(r['t'])
    return {k: (v[0] + '-' + v[-1], len(v)) for k, v in out.items()}
summ = {
  'rows': len(rows), 'flags': {k: len(v) for k, v in F['flags'].items()},
  'convention_check': {'halted_within_1.5km': len(halted_near), 'facing_within_45deg': len(within45), 'share': round(len(within45) / max(1, len(halted_near)), 3)},
  'moving_rows': len(moving), 'drift_rows_under_1kmh': len(drift), 'drift_share_of_moving': round(len(drift) / max(1, len(moving)), 3),
  'contact_rows_enemy_lt_0.5km_yaw_gt_120': len(contact), 'contact_rows_fighting_status': len(contact_fight),
  'contact_by_formation': spans(contact), 'contact_by_status': by(contact, 'status'),
  'contact_moving_vs_halted': {'moving': sum(1 for r in contact if r['moving']), 'halted': sum(1 for r in contact if not r['moving'])},
  'contact_rows': contact,
}
json.dump(summ, open(sys.argv[2], 'w'), indent=1)
print(json.dumps({k: v for k, v in summ.items() if k != 'contact_rows'}, indent=1))
