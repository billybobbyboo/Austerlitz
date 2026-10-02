# The sun of 2 December 1805 over the field (derived), and the light today (fact)

`node tools/stage4/sun.js --md docs/stage4-evidence/sun.md --json docs/stage4-evidence/sun.json`. Meeus (ch. 25) and NOAA's equation of time; refraction by Bennett. Derived from astronomy, not a record of the day.

| | the clock read as local apparent (solar) time | the clock read as local mean time |
|---|---|---|
| equation of time (min, apparent - mean) | 10.36 | 10.36 |
| declination (deg) | -21.96 | -21.96 |
| the sun on the meridian | 12:00 | 11:50 |
| highest altitude (deg, refracted) | 19 | 19 |
| nautical dawn (-12 deg) | 06:28 | 06:18 |
| civil dawn (-6 deg) | 07:08 | 06:58 |
| sunrise (upper limb) | 07:45 | 07:34 |
| sunset | 16:15 | 16:05 |
| civil dusk | 16:52 | 16:41 |
| nautical dusk | 17:31 | 17:21 |

## Each phase's light today against the computed sun (apparent time; mean time in brackets)

| phase | clock | preset | preset sun: azimuth, altitude (deg) | disc | intensity | computed at start | at middle | at end |
|---|---|---|---|---|---|---|---|---|
| 0 Deployment | 04:00-07:00 | predawn | 356.9, 25.1 | 0 | 0.26 | 82.4, -35.8 (-34.1) | 99.4, -21.2 (-19.5) | 115.4, -7.2 (-5.7) |
| 1 Telnitz | 07:00-08:00 | dawn | 141.1, 6.8 | 0.35 | 0.46 | 115.4, -7.2 (-5.7) | 120.9, -2.9 (-1.4) | 126.5, 1.5 (2.8) |
| 2 Sokolnitz | 08:00-08:45 | mist | 143.6, 10.1 | 0.45 | 0.62 | 126.5, 1.5 (2.8) | 130.9, 4.3 (5.5) | 135.4, 6.9 (8) |
| 3 The Pratzen | 08:45-09:30 | sunburst | 143.1, 11.6 | 1 | 1.1 | 135.4, 6.9 (8) | 140, 9.3 (10.4) | 144.8, 11.5 (12.5) |
| 4 Pratzeberg | 09:30-10:30 | morning | 154.2, 19.4 | 0.55 | 1.02 | 144.8, 11.5 (12.5) | 151.4, 14.1 (14.9) | 158.3, 16.2 (16.8) |
| 5 Olmutz road | 10:30-11:15 | morning | 154.2, 19.4 | 0.55 | 1.02 | 158.3, 16.2 (16.8) | 163.6, 17.4 (17.8) | 169, 18.3 (18.5) |
| 6 The Guard | 11:15-12:45 | midday | 182.9, 30.4 | 0.4 | 1.05 | 169, 18.3 (18.5) | 180, 19 (18.9) | 191, 18.2 (17.9) |
| 7 The wheel | 12:45-14:30 | afternoon | 233.9, 19.5 | 0.55 | 0.96 | 191, 18.2 (17.9) | 203.4, 15.7 (15) | 215.2, 11.5 (10.5) |
| 8 The ponds | 14:30-17:00 | late | 257.4, 7.7 | 0.9 | 0.82 | 215.2, 11.5 (10.5) | 230.5, 3.3 (2.1) | 244.5, -7.2 (-8.8) |
| 9 Reckoning | 17:00-18:00 | dusk | 272.7, 2.8 | 0.5 | 0.34 | 244.5, -7.2 (-8.8) | 249.9, -11.8 (-13.4) | 255.2, -16.5 (-18.1) |

The paper map's preset (staff): azimuth 73.7, altitude 71.9. The baked hillshade's light: azimuth 330.7, altitude 44.4.

## The altitude a sun corrected to the display factor would take (tan alt_k = k tan alt)

| clock | azimuth | altitude (true) | at 1x | at 4x | at 10.33x |
|---|---|---|---|---|---|
| 08:00 | 126.5 | 1.5 | 1.5 | 6.2 | 15.6 |
| 09:00 | 138.5 | 8.5 | 8.5 | 31 | 57.2 |
| 10:00 | 151.4 | 14.1 | 14.1 | 45.2 | 68.9 |
| 11:00 | 165.4 | 17.7 | 17.7 | 52 | 73.1 |
| 12:00 | 180 | 19 | 19 | 53.9 | 74.3 |
| 13:00 | 194.6 | 17.7 | 17.7 | 51.9 | 73.1 |
| 14:00 | 208.6 | 14.1 | 14.1 | 45.1 | 68.9 |
| 15:00 | 221.5 | 8.5 | 8.5 | 30.9 | 57.1 |
| 16:00 | 233.4 | 1.5 | 1.5 | 6 | 15.2 |

## The modelled ground facing away from the sun (N.L <= 0), % of 105651 lattice points

| clock | altitude | true sun at 1x | at 4x | at 10.33x | corrected sun at 1x | at 4x | at 10.33x |
|---|---|---|---|---|---|---|---|
| 08:00 | 1.5 | 3.2 | 14.83 | 32.57 | 3.2 | 3.2 | 3.2 |
| 09:00 | 8.5 | 0.05 | 1.21 | 6.67 | 0.05 | 0.05 | 0.05 |
| 10:00 | 14.1 | 0 | 0.41 | 3.94 | 0 | 0 | 0 |
| 11:00 | 17.7 | 0 | 0.31 | 1.84 | 0 | 0 | 0 |
| 12:00 | 19 | 0 | 0.3 | 1.24 | 0 | 0 | 0 |
| 13:00 | 17.7 | 0 | 0.39 | 1.27 | 0 | 0 | 0 |
| 14:00 | 14.1 | 0 | 0.55 | 1.76 | 0 | 0 | 0 |
| 15:00 | 8.5 | 0.05 | 1.01 | 3.65 | 0.05 | 0.05 | 0.05 |
| 16:00 | 1.5 | 1.75 | 12.87 | 32.61 | 1.75 | 1.75 | 1.75 |

## The modelled ground in the terrain's cast shadow, % of lattice points (every 2 units)

| clock | altitude | true sun at 1x | at 4x | at 10.33x | corrected sun at 1x | at 4x | at 10.33x |
|---|---|---|---|---|---|---|---|
| 08:00 | 1.5 | 5.54 | 27.19 | 59.17 | 5.54 | 5.54 | 5.54 |
| 09:00 | 8.5 | 0.06 | 2.37 | 11.78 | 0.06 | 0.06 | 0.06 |
| 10:00 | 14.1 | 0 | 0.75 | 7.08 | 0 | 0 | 0 |
| 11:00 | 17.7 | 0 | 0.51 | 3.78 | 0 | 0 | 0 |
| 12:00 | 19 | 0 | 0.47 | 2.75 | 0 | 0 | 0 |
| 13:00 | 17.7 | 0 | 0.62 | 2.84 | 0 | 0 | 0 |
| 14:00 | 14.1 | 0 | 1 | 3.83 | 0 | 0 | 0 |
| 15:00 | 8.5 | 0.08 | 2.17 | 7.59 | 0.08 | 0.08 | 0.08 |
| 16:00 | 1.5 | 3.7 | 25.07 | 58.82 | 3.7 | 3.7 | 3.7 |

The presets as drawn today, the same measures (facing away; in cast shadow):

| phase | preset | altitude | away at 1x | at 4x | at 10.33x | shadow at 1x | at 4x | at 10.33x |
|---|---|---|---|---|---|---|---|---|
| 0 | predawn | 25.1 | 0 | 0.2 | 0.9 | 0 | 0.25 | 1.86 |
| 1 | dawn | 6.8 | 0.09 | 2.6 | 8.1 | 0.12 | 4.68 | 14.51 |
| 2 | mist | 10.1 | 0.02 | 0.8 | 5.82 | 0.03 | 1.57 | 10.2 |
| 3 | sunburst | 11.6 | 0 | 0.56 | 5.16 | 0 | 1.09 | 9.03 |
| 4 | morning | 19.4 | 0 | 0.25 | 1.43 | 0 | 0.36 | 2.95 |
| 5 | morning | 19.4 | 0 | 0.25 | 1.43 | 0 | 0.36 | 2.95 |
| 6 | midday | 30.4 | 0 | 0.07 | 0.61 | 0 | 0.11 | 1.18 |
| 7 | afternoon | 19.5 | 0 | 0.24 | 1.19 | 0 | 0.35 | 2.47 |
| 8 | late | 7.7 | 0.04 | 1.53 | 4.38 | 0.05 | 2.78 | 9.76 |
| 9 | dusk | 2.8 | 0.77 | 6.07 | 21.26 | 1.26 | 12.01 | 38.96 |

The model's slopes at true scale (degrees, on the lattice): median 0.38, 90th percentile 1.42, 99th 4.78, steepest 14.1. Drawn: 1x {"p50":0.4,"p90":1.4,"p99":4.8,"max":14.1}; 4x {"p50":1.5,"p90":5.7,"p99":18.5,"max":45.1}; 10.33x {"p50":3.9,"p90":14.4,"p99":40.8,"max":68.9}.

