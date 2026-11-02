# perf-attribution summary (4 pages: L3 x2 (rounds 1,2), now x2 (rounds 1,2))

## Start-up (ms from navigation, page's own clock)

| build | rounds | DOM ready | first frame (AUS_BOOT ok) | boot overlay gone | main thread quiet (last long task end) | longest task | long tasks total |
|---|---|---|---|---|---|---|---|
| L3 | 2 | 77915.5 (67517.00-88314.00) | 20913.5 (20241.00-21586.00) | 79644.5 (67519.00-91770.00) | 80493 (68331.00-92655.00) | 55217.5 | 79493 |
| now | 2 | 80394.5 (69207.00-91582.00) | 22053 (21060.00-23046.00) | 80396 (69209.00-91583.00) | 84536.5 (74726.00-94347.00) | 56337 | 80590 |

## play-half

Play at half speed under Follow from 08:30, Watch, the Field vantage (device route play-half, perf-route.js:263-265)

| build | rounds | loop p50 (range) | loop mean | CPU/frame (range) | wait/frame | GPU proc CPU/frame | flush p50 | calls | triangles | clock | MLS passes/moving/rest/fresh |
|---|---|---|---|---|---|---|---|---|---|---|---|
| L3 | 2 | 21.65 (21.10-22.20) | 35.19 | 19.06 (18.16-19.96) | 17.20 | 3.91 | 0.50 | 794 | 2490763 | 513.1-550.6 513.1-550.6 | (before 8C) |
| now | 2 | 29.10 (28.40-29.80) | 43.11 | 23.28 (22.70-23.87) | 20.28 | 5.01 | 0.00 | 805 | 2243919 | 513.1-550.6 513.1-550.6 | 1656/1656/0/0 |

Named steps, median of the rounds' per-frame medians (ms):

| step | L3 | now | now - L3 |
|---|---|---|---|
| loop | 21.650 | 29.100 | +7.450 |
| updateVisibility | 3.550 | 4.500 | +0.950 |
| mlLayout | 1.250 | 1.450 | +0.200 |
| renderFrame | 16.850 | 23.000 | +6.150 |
| three.render | 11.500 | 16.350 | +4.850 |
| renderFX | 11.500 | 16.950 | +5.450 |
| gdepthPass | - | 0.100 | - |
| arrowCap | - | 0.150 | - |
| applyLight | 0.000 | 0.050 | +0.050 |
| placeLights | 3.400 | 3.450 | +0.050 |
| applyAtmo | 0.000 | 0.000 | +0.000 |
| syncViewOffset | 0.100 | 0.100 | +0.000 |
| syncFollow | 0.000 | 0.000 | +0.000 |
| tickClock | 0.400 | 0.500 | +0.100 |
| followStep | 0.250 | 0.300 | +0.050 |
| frameState | 0.000 | 0.000 | +0.000 |
| kitLodFrame | - | 0.000 | - |

Profile (the frames' samples; ms a frame, median over rounds, and share of the profiled run):

| subsystem | L3 ms (share) | now ms (share) | now - L3 ms |
|---|---|---|---|
| (profiled run) | 28.31 (26.54-30.09) | 38.01 (35.88-40.14) | +9.69 |
| three.js (JS) | 14.056 (49.6%) | 18.261 (48.1%) | +4.205 |
| panels and free rectangle (freeRect, landPanels, panelRects) | 5.972 (21.1%) | 6.655 (17.5%) | +0.683 |
| WebGL calls (native) | 3.622 (12.7%) | 4.950 (13.0%) | +1.328 |
| map layer (ml*) | 1.454 (5.2%) | 1.962 (5.2%) | +0.508 |
| native/builtin (other) | 0.727 (2.6%) | 0.943 (2.5%) | +0.216 |
| updateVisibility (other, inline) | 0.480 (1.7%) | 0.811 (2.1%) | +0.331 |
| render path (renderFrame*, renderFX, renderStandard, gdepth*, pass) | 0.053 (0.2%) | 0.743 (1.9%) | +0.690 |
| clock/Follow/camera (tickClock, followStep, syncFollow, syncViewOffset, tween, orbit, clamp*) | 0.529 (1.9%) | 0.539 (1.4%) | +0.010 |
| culling (cull*) | 0 | 0.465 (1.2%) | +0.465 |
| ground queries (groundY*, height*, displayHeight) | 0.230 (0.8%) | 0.458 (1.2%) | +0.228 |
| figures' layout (layoutFigs, placeStandards, showBattalions, seat) | 0.414 (1.5%) | 0.449 (1.2%) | +0.035 |
| confidence (conf*, groundPatch) | 0.257 (0.9%) | 0.434 (1.1%) | +0.176 |
| outlines (outline*) | 0 | 0.359 (1.0%) | +0.359 |
| formation model (stateAt, posNow, legPath, ...) | 0.206 (0.7%) | 0.241 (0.6%) | +0.035 |
| arrows (arrow*, capPts, ribbon*, drawOn*) | 0.014 (0.0%) | 0.181 (0.5%) | +0.168 |
| gait/anim (gait*, anim*, faceClock, poseBlock) | 0.077 (0.3%) | 0.161 (0.4%) | +0.084 |
| smoke and dust (smoke*, dust*) | 0.102 (0.4%) | 0.153 (0.4%) | +0.051 |
| light (applyLight, placeLights, lightAt, shadow*) | 0.085 (0.3%) | 0.113 (0.3%) | +0.029 |
| app (other) | 0.018 (0.1%) | 0.077 (0.2%) | +0.058 |
| kit level of detail (kitLod*) | 0 | 0.036 (0.1%) | +0.036 |
| eyes/knowledge (know*, eyes*, readHidden, drawnKnow) | 0.007 (0.0%) | 0.008 (0.0%) | +0.001 |
| atmosphere (atmo*, applyAtmo, fog*, domeFollow) | 0.008 (0.0%) | 0.005 (0.0%) | -0.003 |
| timeline/DOM UI (tl*, caption*, fitCaption, syncDock, syncInert) | 0.004 (0.0%) | 0.002 (0.0%) | -0.002 |
| skeleton/routes (skel*, route*) | 0.000 (0.0%) | 0.001 (0.0%) | +0.000 |

Top functions by self time, L3: `freeRect app:10472` 5.840; `getProgramCacheKey three:6` 2.278; `Pt three:6` 1.692; `(anonymous) three:6` 1.601; `renderBufferDirect three:6` 0.896; `vertexAttribPointer native:0` 0.751; `setup three:6` 0.683; `bindBuffer native:0` 0.678; `updateMatrixWorld three:6` 0.545; `At three:6` 0.520; `mlLayout app:10833` 0.492; `bufferSubData native:0` 0.474; `It three:6` 0.459; `bindVertexArray native:0` 0.404

three.js and GL time by the app function that called it, L3: `renderFX` 16.945; `groundPatch` 0.184; `(anonymous)` 0.162; `seatPrep` 0.101; `pass` 0.086; `settleBlock` 0.059; `drawOnU` 0.045; `placeStandards` 0.034

Top functions by self time, now: `freeRect app:12503` 6.525; `(anonymous) three:6` 2.813; `getProgramCacheKey three:6` 2.234; `Pt three:6` 1.806; `bindBuffer native:0` 1.253; `vertexAttribPointer native:0` 1.220; `setup three:6` 1.167; `renderBufferDirect three:6` 1.106; `updateMatrixWorld three:6` 0.753; `renderFX app:11289` 0.701; `It three:6` 0.686; `mlLayout app:13005` 0.649; `At three:6` 0.613; `bindVertexArray native:0` 0.592

three.js and GL time by the app function that called it, now: `renderFX` 21.882; `gdepthPass` 0.413; `(anonymous)` 0.222; `groundPatch` 0.122; `pass` 0.096; `worldPerPx` 0.094; `F.intersectsObject` 0.084; `seatPrep` 0.070

## overview-held

the Overview vantage, 09:30, Watch, held and drawn every frame (device route overview held, perf-route.js:243-244)

| build | rounds | loop p50 (range) | loop mean | CPU/frame (range) | wait/frame | GPU proc CPU/frame | flush p50 | calls | triangles | clock | MLS passes/moving/rest/fresh |
|---|---|---|---|---|---|---|---|---|---|---|---|
| L3 | 2 | 15.55 (14.00-17.10) | 22.00 | 14.04 (12.92-15.16) | 8.18 | 2.67 | 0.00 | 832 | 2523605 | 570.0-570.0 570.0-570.0 | (before 8C) |
| now | 2 | 16.80 (16.40-17.20) | 23.45 | 15.34 (15.14-15.54) | 10.05 | 2.69 | 0.00 | 837 | 1978147 | 570.0-570.0 570.0-570.0 | 252/0/252/0 |

Named steps, median of the rounds' per-frame medians (ms):

| step | L3 | now | now - L3 |
|---|---|---|---|
| loop | 15.550 | 16.800 | +1.250 |
| updateVisibility | 2.550 | 2.600 | +0.050 |
| mlLayout | 0.550 | 0.650 | +0.100 |
| renderFrame | 12.800 | 13.800 | +1.000 |
| three.render | 10.600 | 11.350 | +0.750 |
| renderFX | 10.600 | 11.400 | +0.800 |
| gdepthPass | - | 0.000 | - |
| arrowCap | - | 0.000 | - |
| applyLight | 0.000 | 0.000 | +0.000 |
| placeLights | 1.500 | 1.400 | -0.100 |
| applyAtmo | 0.000 | 0.000 | +0.000 |
| syncViewOffset | 0.100 | 0.100 | +0.000 |
| syncFollow | 0.000 | 0.000 | +0.000 |
| tickClock | 0.000 | 0.000 | +0.000 |
| followStep | 0.000 | 0.000 | +0.000 |
| frameState | 0.000 | 0.000 | +0.000 |
| kitLodFrame | - | 0.000 | - |

Profile (the frames' samples; ms a frame, median over rounds, and share of the profiled run):

| subsystem | L3 ms (share) | now ms (share) | now - L3 ms |
|---|---|---|---|
| (profiled run) | 29.02 (28.23-29.81) | 30.65 (24.12-37.18) | +1.63 |
| three.js (JS) | 17.429 (60.0%) | 19.545 (63.5%) | +2.116 |
| panels and free rectangle (freeRect, landPanels, panelRects) | 4.566 (15.7%) | 3.856 (12.8%) | -0.710 |
| WebGL calls (native) | 3.848 (13.3%) | 3.956 (12.9%) | +0.108 |
| map layer (ml*) | 0.676 (2.3%) | 0.922 (3.1%) | +0.246 |
| updateVisibility (other, inline) | 0.898 (3.1%) | 0.706 (2.3%) | -0.192 |
| native/builtin (other) | 0.663 (2.3%) | 0.550 (1.8%) | -0.113 |
| formation model (stateAt, posNow, legPath, ...) | 0.203 (0.7%) | 0.140 (0.4%) | -0.063 |
| ground queries (groundY*, height*, displayHeight) | 0.193 (0.7%) | 0.132 (0.5%) | -0.061 |
| culling (cull*) | 0 | 0.187 (0.6%) | +0.187 |
| outlines (outline*) | 0 | 0.176 (0.6%) | +0.176 |
| smoke and dust (smoke*, dust*) | 0.164 (0.6%) | 0.111 (0.4%) | -0.053 |
| confidence (conf*, groundPatch) | 0.099 (0.3%) | 0.006 (0.0%) | -0.094 |
| gait/anim (gait*, anim*, faceClock, poseBlock) | 0.091 (0.3%) | 0.097 (0.3%) | +0.005 |
| clock/Follow/camera (tickClock, followStep, syncFollow, syncViewOffset, tween, orbit, clamp*) | 0.073 (0.3%) | 0.076 (0.2%) | +0.003 |
| render path (renderFrame*, renderFX, renderStandard, gdepth*, pass) | 0.068 (0.2%) | 0.053 (0.2%) | -0.014 |
| app (other) | 0.007 (0.0%) | 0.037 (0.1%) | +0.031 |
| kit level of detail (kitLod*) | 0 | 0.031 (0.1%) | +0.031 |
| light (applyLight, placeLights, lightAt, shadow*) | 0.031 (0.1%) | 0.022 (0.1%) | -0.008 |
| atmosphere (atmo*, applyAtmo, fog*, domeFollow) | 0.002 (0.0%) | 0.030 (0.1%) | +0.028 |
| arrows (arrow*, capPts, ribbon*, drawOn*) | 0 | 0.010 (0.0%) | +0.010 |
| figures' layout (layoutFigs, placeStandards, showBattalions, seat) | 0.007 (0.0%) | 0.002 (0.0%) | -0.004 |
| eyes/knowledge (know*, eyes*, readHidden, drawnKnow) | 0.001 (0.0%) | 0.002 (0.0%) | +0.001 |
| timeline/DOM UI (tl*, caption*, fitCaption, syncDock, syncInert) | 0.001 (0.0%) | 0 | -0.001 |

Top functions by self time, L3: `freeRect app:10472` 4.487; `getProgramCacheKey three:6` 2.774; `Pt three:6` 2.630; `renderBufferDirect three:6` 2.167; `(anonymous) three:6` 1.405; `vertexAttribPointer native:0` 1.042; `setup three:6` 0.819; `updateMatrixWorld three:6` 0.638; `bindVertexArray native:0` 0.618; `Ct three:6` 0.616; `bindBuffer native:0` 0.561; `uniformMatrix4fv native:0` 0.498; `It three:6` 0.488; `worldPerPx app:10422` 0.457

three.js and GL time by the app function that called it, L3: `renderFX` 21.115; `pass` 0.087; `worldPerPx` 0.038; `settleBlock` 0.014; `tri` 0.012; `(anonymous)` 0.005; `placeLights` 0.003; `poseBlock` 0.002

Top functions by self time, now: `freeRect app:12503` 3.797; `renderBufferDirect three:6` 2.652; `(anonymous) three:6` 2.236; `getProgramCacheKey three:6` 2.119; `Pt three:6` 1.870; `vertexAttribPointer native:0` 1.294; `setup three:6` 1.139; `bindBuffer native:0` 0.902; `updateMatrix three:6` 0.725; `It three:6` 0.714; `At three:6` 0.679; `updateMatrixWorld three:6` 0.534; `bindVertexArray native:0` 0.510; `e three:6` 0.453

three.js and GL time by the app function that called it, now: `renderFX` 23.232; `pass` 0.084; `F.intersectsObject` 0.068; `worldPerPx` 0.054; `tri` 0.050; `settleBlock` 0.016; `lin` 0.010; `(anonymous)` 0.007

## overview-route

the Overview, 09:30, Watch, orbiting at 20 degrees a second by the route's own camera writes (device route overview orbit, perf-route.js:166-170): decision 268's segment

| build | rounds | loop p50 (range) | loop mean | CPU/frame (range) | wait/frame | GPU proc CPU/frame | flush p50 | calls | triangles | clock | MLS passes/moving/rest/fresh |
|---|---|---|---|---|---|---|---|---|---|---|---|
| L3 | 2 | 17.15 (16.10-18.20) | 25.20 | 15.60 (15.00-16.21) | 9.19 | 3.29 | 0.25 | 832 | 2523605 | 570.0-570.0 570.0-570.0 | (before 8C) |
| now | 2 | 23.20 (22.80-23.60) | 33.44 | 20.12 (19.80-20.44) | 12.72 | 4.26 | 0.00 | 839 | 2125259 | 570.0-570.0 570.0-570.0 | 396/0/396/0 |

Named steps, median of the rounds' per-frame medians (ms):

| step | L3 | now | now - L3 |
|---|---|---|---|
| loop | 17.150 | 23.200 | +6.050 |
| updateVisibility | 2.350 | 3.000 | +0.650 |
| mlLayout | 0.700 | 1.000 | +0.300 |
| renderFrame | 14.450 | 20.050 | +5.600 |
| three.render | 10.550 | 14.450 | +3.900 |
| renderFX | 10.550 | 14.900 | +4.350 |
| gdepthPass | - | 0.100 | - |
| arrowCap | - | 0.100 | - |
| applyLight | 0.000 | 0.000 | +0.000 |
| placeLights | 3.150 | 3.400 | +0.250 |
| applyAtmo | 0.000 | 0.000 | +0.000 |
| syncViewOffset | 0.100 | 0.100 | +0.000 |
| syncFollow | 0.000 | 0.000 | +0.000 |
| tickClock | 0.000 | 0.000 | +0.000 |
| followStep | 0.000 | 0.000 | +0.000 |
| frameState | 0.000 | 0.000 | +0.000 |
| kitLodFrame | - | 0.000 | - |

Profile (the frames' samples; ms a frame, median over rounds, and share of the profiled run):

| subsystem | L3 ms (share) | now ms (share) | now - L3 ms |
|---|---|---|---|
| (profiled run) | 31.55 (30.18-32.91) | 35.87 (24.25-47.49) | +4.32 |
| three.js (JS) | 15.907 (50.5%) | 19.947 (54.7%) | +4.040 |
| panels and free rectangle (freeRect, landPanels, panelRects) | 8.053 (25.3%) | 6.287 (17.7%) | -1.766 |
| WebGL calls (native) | 4.199 (13.4%) | 4.716 (13.7%) | +0.517 |
| map layer (ml*) | 1.105 (3.5%) | 1.234 (3.5%) | +0.129 |
| native/builtin (other) | 0.706 (2.3%) | 0.899 (2.4%) | +0.194 |
| updateVisibility (other, inline) | 0.624 (2.0%) | 0.774 (2.1%) | +0.150 |
| render path (renderFrame*, renderFX, renderStandard, gdepth*, pass) | 0.058 (0.2%) | 0.513 (1.6%) | +0.455 |
| ground queries (groundY*, height*, displayHeight) | 0.105 (0.3%) | 0.232 (0.7%) | +0.127 |
| outlines (outline*) | 0 | 0.230 (0.7%) | +0.230 |
| formation model (stateAt, posNow, legPath, ...) | 0.194 (0.6%) | 0.185 (0.5%) | -0.009 |
| clock/Follow/camera (tickClock, followStep, syncFollow, syncViewOffset, tween, orbit, clamp*) | 0.120 (0.4%) | 0.174 (0.4%) | +0.054 |
| smoke and dust (smoke*, dust*) | 0.138 (0.4%) | 0.144 (0.4%) | +0.006 |
| culling (cull*) | 0 | 0.134 (0.4%) | +0.134 |
| confidence (conf*, groundPatch) | 0.121 (0.4%) | 0.003 (0.0%) | -0.118 |
| gait/anim (gait*, anim*, faceClock, poseBlock) | 0.099 (0.3%) | 0.105 (0.3%) | +0.006 |
| arrows (arrow*, capPts, ribbon*, drawOn*) | 0 | 0.097 (0.3%) | +0.097 |
| light (applyLight, placeLights, lightAt, shadow*) | 0.080 (0.3%) | 0.063 (0.2%) | -0.017 |
| app (other) | 0.018 (0.1%) | 0.080 (0.2%) | +0.062 |
| kit level of detail (kitLod*) | 0 | 0.037 (0.1%) | +0.037 |
| figures' layout (layoutFigs, placeStandards, showBattalions, seat) | 0.010 (0.0%) | 0.006 (0.0%) | -0.004 |
| atmosphere (atmo*, applyAtmo, fog*, domeFollow) | 0.005 (0.0%) | 0.004 (0.0%) | -0.002 |
| eyes/knowledge (know*, eyes*, readHidden, drawnKnow) | 0 | 0.002 (0.0%) | +0.002 |
| timeline/DOM UI (tl*, caption*, fitCaption, syncDock, syncInert) | 0.001 (0.0%) | 0.001 (0.0%) | -0.001 |
| skeleton/routes (skel*, route*) | 0.001 (0.0%) | 0.000 (0.0%) | -0.001 |

Top functions by self time, L3: `freeRect app:10472` 7.978; `getProgramCacheKey three:6` 2.772; `Pt three:6` 1.949; `vertexAttribPointer native:0` 1.314; `(anonymous) three:6` 1.070; `setup three:6` 1.039; `renderBufferDirect three:6` 1.013; `At three:6` 0.823; `bindBuffer native:0` 0.754; `getParameters three:6` 0.622; `bindVertexArray native:0` 0.541; `updateMatrixWorld three:6` 0.488; `uniformMatrix4fv native:0` 0.471; `It three:6` 0.458

three.js and GL time by the app function that called it, L3: `renderFX` 19.900; `pass` 0.109; `tri` 0.028; `worldPerPx` 0.027; `shadowReceivers` 0.012; `settleBlock` 0.010; `updateVisibility` 0.008; `(none)` 0.005

Top functions by self time, now: `freeRect app:12503` 6.188; `(anonymous) three:6` 3.773; `getProgramCacheKey three:6` 2.471; `Pt three:6` 1.739; `vertexAttribPointer native:0` 1.713; `renderBufferDirect three:6` 1.508; `setup three:6` 1.186; `bindBuffer native:0` 1.048; `At three:6` 0.882; `It three:6` 0.788; `updateMatrixWorld three:6` 0.610; `querySelector native:0` 0.605; `bindVertexArray native:0` 0.589; `Cr.upload three:6` 0.517

three.js and GL time by the app function that called it, now: `renderFX` 23.798; `gdepthPass` 0.654; `pass` 0.063; `worldPerPx` 0.045; `F.intersectsObject` 0.045; `tri` 0.021; `placeLights` 0.017; `settleBlock` 0.011

## overview-drag

the Overview, 09:30, Watch, orbiting at 20 degrees a second by a right-button drag through the app's handler (a visitor's orbit)

| build | rounds | loop p50 (range) | loop mean | CPU/frame (range) | wait/frame | GPU proc CPU/frame | flush p50 | calls | triangles | clock | MLS passes/moving/rest/fresh |
|---|---|---|---|---|---|---|---|---|---|---|---|
| L3 | 2 | 17.05 (17.00-17.10) | 22.69 | 15.91 (15.82-15.99) | 7.28 | 2.92 | 0.25 | 832 | 2523605 | 570.0-570.0 570.0-570.0 | (before 8C) |
| now | 2 | 21.25 (20.50-22.00) | 34.70 | 18.37 (18.21-18.52) | 17.47 | 3.29 | 0.00 | 839 | 2125259 | 570.0-570.0 570.0-570.0 | 396/396/0/0 |

Named steps, median of the rounds' per-frame medians (ms):

| step | L3 | now | now - L3 |
|---|---|---|---|
| loop | 17.050 | 21.250 | +4.200 |
| updateVisibility | 2.350 | 2.750 | +0.400 |
| mlLayout | 0.700 | 0.800 | +0.100 |
| renderFrame | 14.400 | 17.950 | +3.550 |
| three.render | 10.200 | 12.600 | +2.400 |
| renderFX | 10.300 | 13.000 | +2.700 |
| gdepthPass | - | 0.100 | - |
| arrowCap | - | 0.100 | - |
| applyLight | 0.000 | 0.000 | +0.000 |
| placeLights | 3.200 | 3.200 | +0.000 |
| applyAtmo | 0.000 | 0.000 | +0.000 |
| syncViewOffset | 0.100 | 0.100 | +0.000 |
| syncFollow | 0.000 | 0.000 | +0.000 |
| tickClock | 0.000 | 0.000 | +0.000 |
| followStep | 0.000 | 0.000 | +0.000 |
| frameState | 0.000 | 0.000 | +0.000 |
| kitLodFrame | - | 0.000 | - |

Profile (the frames' samples; ms a frame, median over rounds, and share of the profiled run):

| subsystem | L3 ms (share) | now ms (share) | now - L3 ms |
|---|---|---|---|
| (profiled run) | 24.89 (24.26-25.53) | 33.64 (30.53-36.74) | +8.74 |
| three.js (JS) | 13.619 (54.8%) | 18.517 (54.8%) | +4.898 |
| panels and free rectangle (freeRect, landPanels, panelRects) | 5.220 (21.0%) | 5.980 (17.8%) | +0.760 |
| WebGL calls (native) | 3.035 (12.1%) | 4.197 (12.6%) | +1.162 |
| native/builtin (other) | 0.677 (2.7%) | 1.024 (3.0%) | +0.347 |
| map layer (ml*) | 0.840 (3.4%) | 1.010 (3.1%) | +0.170 |
| updateVisibility (other, inline) | 0.602 (2.4%) | 0.747 (2.2%) | +0.145 |
| render path (renderFrame*, renderFX, renderStandard, gdepth*, pass) | 0.036 (0.1%) | 0.540 (1.7%) | +0.503 |
| smoke and dust (smoke*, dust*) | 0.136 (0.5%) | 0.314 (1.0%) | +0.179 |
| ground queries (groundY*, height*, displayHeight) | 0.094 (0.4%) | 0.249 (0.7%) | +0.155 |
| outlines (outline*) | 0 | 0.213 (0.6%) | +0.213 |
| formation model (stateAt, posNow, legPath, ...) | 0.192 (0.8%) | 0.149 (0.5%) | -0.043 |
| culling (cull*) | 0 | 0.162 (0.5%) | +0.162 |
| gait/anim (gait*, anim*, faceClock, poseBlock) | 0.104 (0.4%) | 0.146 (0.4%) | +0.042 |
| confidence (conf*, groundPatch) | 0.122 (0.5%) | 0.005 (0.0%) | -0.116 |
| arrows (arrow*, capPts, ribbon*, drawOn*) | 0 | 0.119 (0.4%) | +0.119 |
| light (applyLight, placeLights, lightAt, shadow*) | 0.071 (0.3%) | 0.092 (0.3%) | +0.022 |
| clock/Follow/camera (tickClock, followStep, syncFollow, syncViewOffset, tween, orbit, clamp*) | 0.088 (0.4%) | 0.080 (0.2%) | -0.008 |
| app (other) | 0.019 (0.1%) | 0.049 (0.2%) | +0.030 |
| kit level of detail (kitLod*) | 0 | 0.029 (0.1%) | +0.029 |
| timeline/DOM UI (tl*, caption*, fitCaption, syncDock, syncInert) | 0.017 (0.1%) | 0 | -0.017 |
| figures' layout (layoutFigs, placeStandards, showBattalions, seat) | 0.012 (0.1%) | 0.006 (0.0%) | -0.006 |
| atmosphere (atmo*, applyAtmo, fog*, domeFollow) | 0.006 (0.0%) | 0.003 (0.0%) | -0.004 |
| eyes/knowledge (know*, eyes*, readHidden, drawnKnow) | 0.002 (0.0%) | 0.002 (0.0%) | -0.000 |
| skeleton/routes (skel*, route*) | 0 | 0.000 (0.0%) | +0.000 |

Top functions by self time, L3: `freeRect app:10472` 2.680; `viewport app:7010` 2.458; `getProgramCacheKey three:6` 2.264; `(anonymous) three:6` 1.985; `Pt three:6` 1.669; `vertexAttribPointer native:0` 0.937; `renderBufferDirect three:6` 0.828; `updateMatrixWorld three:6` 0.686; `setup three:6` 0.631; `bindBuffer native:0` 0.569; `It three:6` 0.414; `bindVertexArray native:0` 0.412; `querySelector native:0` 0.404; `Ct three:6` 0.358

three.js and GL time by the app function that called it, L3: `renderFX` 16.521; `pass` 0.060; `tri` 0.023; `worldPerPx` 0.017; `settleBlock` 0.008; `shadowReceivers` 0.006; `(anonymous)` 0.006; `placeLights` 0.005

Top functions by self time, now: `freeRect app:12503` 5.840; `(anonymous) three:6` 2.738; `getProgramCacheKey three:6` 2.492; `Pt three:6` 2.321; `vertexAttribPointer native:0` 1.345; `renderBufferDirect three:6` 1.075; `setup three:6` 1.017; `bindBuffer native:0` 0.956; `bindVertexArray native:0` 0.740; `It three:6` 0.720; `updateMatrixWorld three:6` 0.626; `At three:6` 0.624; `querySelector native:0` 0.603; `e three:6` 0.577

three.js and GL time by the app function that called it, now: `renderFX` 22.181; `gdepthPass` 0.313; `worldPerPx` 0.048; `F.intersectsObject` 0.043; `pass` 0.043; `tri` 0.034; `kitLod` 0.027; `poseBlock` 0.014

## ph8-drag

phase 8, 14:40, the Overview, Watch, orbiting by a right-button drag (the task's motion; device route ph8-overview orbits by camera writes)

| build | rounds | loop p50 (range) | loop mean | CPU/frame (range) | wait/frame | GPU proc CPU/frame | flush p50 | calls | triangles | clock | MLS passes/moving/rest/fresh |
|---|---|---|---|---|---|---|---|---|---|---|---|
| L3 | 2 | 18.40 (18.10-18.70) | 24.82 | 17.29 (16.72-17.85) | 7.54 | 3.25 | 0.35 | 809 | 2501183 | 880.0-880.0 880.0-880.0 | (before 8C) |
| now | 2 | 21.70 (19.90-23.50) | 35.64 | 18.62 (17.75-19.49) | 16.46 | 3.88 | 0.00 | 820 | 2112941 | 880.0-880.0 880.0-880.0 | 396/396/0/0 |

Named steps, median of the rounds' per-frame medians (ms):

| step | L3 | now | now - L3 |
|---|---|---|---|
| loop | 18.400 | 21.700 | +3.300 |
| updateVisibility | 3.200 | 2.900 | -0.300 |
| mlLayout | 0.700 | 0.800 | +0.100 |
| renderFrame | 14.900 | 18.400 | +3.500 |
| three.render | 10.400 | 13.450 | +3.050 |
| renderFX | 10.500 | 13.900 | +3.400 |
| gdepthPass | - | 0.100 | - |
| arrowCap | - | 0.100 | - |
| applyLight | 0.000 | 0.000 | +0.000 |
| placeLights | 3.250 | 3.150 | -0.100 |
| applyAtmo | 0.000 | 0.000 | +0.000 |
| syncViewOffset | 0.100 | 0.100 | +0.000 |
| syncFollow | 0.000 | 0.000 | +0.000 |
| tickClock | 0.000 | 0.000 | +0.000 |
| followStep | 0.000 | 0.000 | +0.000 |
| frameState | 0.000 | 0.000 | +0.000 |
| kitLodFrame | - | 0.000 | - |

Profile (the frames' samples; ms a frame, median over rounds, and share of the profiled run):

| subsystem | L3 ms (share) | now ms (share) | now - L3 ms |
|---|---|---|---|
| (profiled run) | 32.18 (23.80-40.56) | 29.84 (28.66-31.02) | -2.34 |
| three.js (JS) | 18.440 (57.0%) | 16.368 (54.8%) | -2.072 |
| panels and free rectangle (freeRect, landPanels, panelRects) | 6.942 (21.4%) | 5.277 (17.7%) | -1.666 |
| WebGL calls (native) | 2.777 (8.8%) | 4.065 (13.7%) | +1.288 |
| map layer (ml*) | 1.085 (3.5%) | 1.100 (3.7%) | +0.014 |
| native/builtin (other) | 0.882 (2.8%) | 0.784 (2.6%) | -0.098 |
| updateVisibility (other, inline) | 0.833 (2.5%) | 0.581 (1.9%) | -0.252 |
| render path (renderFrame*, renderFX, renderStandard, gdepth*, pass) | 0.075 (0.3%) | 0.458 (1.5%) | +0.383 |
| figures' layout (layoutFigs, placeStandards, showBattalions, seat) | 0.325 (1.0%) | 0.016 (0.1%) | -0.309 |
| outlines (outline*) | 0 | 0.214 (0.7%) | +0.214 |
| ground queries (groundY*, height*, displayHeight) | 0.168 (0.6%) | 0.205 (0.7%) | +0.036 |
| confidence (conf*, groundPatch) | 0.176 (0.5%) | 0.003 (0.0%) | -0.173 |
| smoke and dust (smoke*, dust*) | 0.099 (0.4%) | 0.146 (0.5%) | +0.047 |
| formation model (stateAt, posNow, legPath, ...) | 0.138 (0.5%) | 0.101 (0.3%) | -0.037 |
| culling (cull*) | 0 | 0.101 (0.3%) | +0.101 |
| gait/anim (gait*, anim*, faceClock, poseBlock) | 0.055 (0.2%) | 0.099 (0.3%) | +0.043 |
| light (applyLight, placeLights, lightAt, shadow*) | 0.090 (0.3%) | 0.061 (0.2%) | -0.029 |
| app (other) | 0.017 (0.1%) | 0.084 (0.3%) | +0.067 |
| clock/Follow/camera (tickClock, followStep, syncFollow, syncViewOffset, tween, orbit, clamp*) | 0.071 (0.2%) | 0.065 (0.2%) | -0.005 |
| arrows (arrow*, capPts, ribbon*, drawOn*) | 0 | 0.061 (0.2%) | +0.061 |
| kit level of detail (kitLod*) | 0 | 0.042 (0.1%) | +0.042 |
| atmosphere (atmo*, applyAtmo, fog*, domeFollow) | 0.004 (0.0%) | 0.005 (0.0%) | +0.001 |
| eyes/knowledge (know*, eyes*, readHidden, drawnKnow) | 0.000 (0.0%) | 0.001 (0.0%) | +0.001 |
| timeline/DOM UI (tl*, caption*, fitCaption, syncDock, syncInert) | 0.001 (0.0%) | 0.001 (0.0%) | +0.001 |
| skeleton/routes (skel*, route*) | 0 | 0.001 (0.0%) | +0.001 |

Top functions by self time, L3: `viewport app:7010` 4.356; `getProgramCacheKey three:6` 2.834; `freeRect app:10472` 2.462; `(anonymous) three:6` 2.234; `Pt three:6` 2.092; `It three:6` 2.031; `renderBufferDirect three:6` 0.990; `setup three:6` 0.982; `z three:6` 0.902; `bindBuffer native:0` 0.758; `updateMatrixWorld three:6` 0.703; `vertexAttribPointer native:0` 0.628; `At three:6` 0.555; `mlLayout app:10833` 0.517

three.js and GL time by the app function that called it, L3: `renderFX` 20.644; `pass` 0.209; `groundPatch` 0.116; `(anonymous)` 0.077; `seatPrep` 0.051; `seatLocal` 0.044; `placeStandards` 0.022; `worldPerPx` 0.020

Top functions by self time, now: `freeRect app:12503` 5.186; `getProgramCacheKey three:6` 2.339; `(anonymous) three:6` 2.197; `Pt three:6` 1.476; `vertexAttribPointer native:0` 1.253; `renderBufferDirect three:6` 1.058; `setup three:6` 0.980; `bindBuffer native:0` 0.948; `It three:6` 0.805; `Cr.upload three:6` 0.614; `bindVertexArray native:0` 0.611; `At three:6` 0.603; `updateMatrixWorld three:6` 0.535; `querySelector native:0` 0.523

three.js and GL time by the app function that called it, now: `renderFX` 19.989; `gdepthPass` 0.248; `worldPerPx` 0.067; `F.intersectsObject` 0.041; `tri` 0.023; `poseBlock` 0.014; `pass` 0.014; `placeLights` 0.014

