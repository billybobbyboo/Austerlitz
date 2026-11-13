# paired session: P (084863c7, 3036257 B), Hstd (3648b157, 3036416 B), Hfig (67b354de, 3036449 B)

viewport 402x714, frame 6.944 ms (144 Hz), blocks per build per motion 4 (palindrome order), frames per block {"play":552,"route":264,"drag":264,"held":168}, warm-up 72; load [2.59,3.33,3.62] -> [1.71,2.63,3.3]

## Start-up in this session (ms; one page each, opened one after another under the machine's load)

| build | DOM ready | first frame | boot overlay gone | main thread quiet | BOOTMS init |
|---|---|---|---|---|---|
| P | 11068 | 7391 | 11069 | 11048 | 5331.7 |
| Hstd | 10557 | 7510 | 10864 | 10840 | 5538.5 |
| Hfig | 10185 | 6995 | 10191 | 10169 | 5403.8 |

## play-half

Play at half speed under Follow from 08:30, Watch, the Field vantage (device route play-half, perf-route.js:263-265)

Blocks in order: P 9.42, Hstd 8.69, Hfig 6.73, Hfig 6.66, Hstd 8.87, P 9.40, P 9.18, Hstd 8.69, Hfig 6.87, Hfig 7.05, Hstd 8.46, P 8.94

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs P (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| P | 4 | 9.29 (9.42, 9.40, 9.18, 8.94) | 0.02 | 9.00 | 3.95 | 2.65 | 0.80 | 497 | - |
| Hstd | 4 | 8.69 (8.69, 8.87, 8.69, 8.46) | 0.01 | 8.45 | 3.40 | 2.65 | 0.80 | 426 | -5.6% (-7.8%, -5.7%, -5.3%, -5.4%) |
| Hfig | 4 | 6.80 (6.73, 6.66, 6.87, 7.05) | 0.02 | 6.65 | 1.80 | 2.55 | 0.80 | 227 | -26.9% (-28.5%, -29.2%, -25.2%, -21.1%) |

Counts per frame (load-independent; 144 frames each): GL calls in all P 6682.75, Hstd 5340.79, Hfig 1306.23; bytes uploaded by bufferData/bufferSubData P 790965, Hstd 782495, Hfig 645859; draw calls P 479, Hstd 413, Hfig 223

| GL method | P | Hstd | Hfig | Hstd - P | Hfig - P |
|---|---|---|---|---|---|
| vertexAttribPointer | 2289.8 | 1878.2 | 116.0 | -411.6 | -2173.8 |
| bindBuffer | 1704.3 | 1395.4 | 112.5 | -308.9 | -1591.8 |
| bindVertexArray | 414.2 | 351.3 | 163.2 | -62.9 | -251.0 |
| uniformMatrix4fv | 340.9 | 247.8 | 124.0 | -93.1 | -216.9 |
| useProgram | 256.3 | 186.3 | 38.0 | -69.9 | -218.2 |
| uniform3fv | 234.2 | 164.3 | 16.0 | -69.9 | -218.2 |
| uniform3f | 208.0 | 163.9 | 143.3 | -44.1 | -64.7 |
| drawArraysInstanced | 197.4 | 197.4 | 10.0 | +0.0 | -187.4 |
| drawElements | 159.6 | 159.6 | 159.1 | +0.0 | -0.5 |
| bufferSubData | 148.4 | 122.1 | 38.5 | -26.3 | -109.9 |
| uniformMatrix3fv | 116.8 | 70.9 | 10.4 | -45.9 | -106.4 |
| bindTexture | 80.8 | 32.5 | 32.5 | -48.3 | -48.3 |
| activeTexture | 75.9 | 27.0 | 27.0 | -48.9 | -48.9 |
| drawElementsInstanced | 70.9 | 6.4 | 6.0 | -64.5 | -64.9 |
| uniform1f | 67.1 | 67.1 | 43.8 | +0.0 | -23.3 |
| uniform2f | 60.0 | 60.0 | 60.0 | +0.0 | +0.0 |
| drawArrays | 47.4 | 47.4 | 47.4 | +0.0 | +0.0 |
| disable | 43.0 | 20.1 | 20.1 | -22.8 | -22.8 |
| enable | 43.0 | 20.1 | 20.1 | -22.8 | -22.8 |
| uniform4f | 38.6 | 36.6 | 32.0 | -2.0 | -6.6 |
| depthMask | 26.3 | 26.3 | 26.3 | +0.0 | +0.0 |
| clear | 18.0 | 18.0 | 18.0 | +0.0 | +0.0 |
| bindFramebuffer | 10.2 | 10.2 | 10.2 | +0.0 | +0.0 |
| scissor | 7.1 | 7.1 | 7.1 | +0.0 | +0.0 |
| texParameteri | 4.1 | 4.1 | 4.1 | +0.0 | +0.0 |
| pixelStorei | 4.0 | 4.0 | 4.0 | +0.0 | +0.0 |
| clearColor | 4.0 | 4.0 | 4.0 | +0.0 | +0.0 |
| viewport | 3.1 | 3.1 | 3.1 | +0.0 | +0.0 |

| app function (calls per frame) | P | Hstd | Hfig |
|---|---|---|---|
| groundY | 22631.2 | 22631.2 | 22631.2 |
| cullStale | 283.0 | 212.0 | 0.0 |
| cullTest | 283.0 | 212.0 | 0.0 |
| viewH | 241.7 | 241.7 | 241.7 |
| worldPerPx | 227.7 | 227.7 | 227.7 |
| posNow | 168.0 | 168.0 | 168.0 |
| stateAt | 161.0 | 161.0 | 161.0 |
| cullRefresh | 127.1 | 98.3 | 0.0 |
| cullGeo | 127.1 | 98.3 | 0.0 |
| height | 96.5 | 96.5 | 96.5 |
| displayHeight | 94.5 | 94.5 | 94.5 |
| liveStatus | 89.3 | 89.3 | 89.3 |
| marchRate | 63.0 | 63.0 | 63.0 |
| drawnKnow | 59.4 | 59.4 | 59.4 |
| leavesOf | 58.9 | 58.9 | 58.9 |
| mlBandAt | 48.1 | 48.1 | 48.1 |
| mlFree | 42.3 | 42.3 | 42.3 |
| mlFar | 38.4 | 38.4 | 38.4 |
| mlOccluded | 38.0 | 38.0 | 38.0 |
| smokeWant | 32.0 | 32.0 | 32.0 |
| poseBlock | 31.0 | 31.0 | 31.0 |
| settleBlock | 31.0 | 31.0 | 31.0 |
| kitLod | 31.0 | 31.0 | 31.0 |
| gaitStep | 31.0 | 31.0 | 31.0 |
| outlinePlace | 31.0 | 31.0 | 31.0 |
| updateTrail | 31.0 | 31.0 | 31.0 |
| onScreen | 31.0 | 31.0 | 31.0 |
| eyeOwnNear | 31.0 | 31.0 | 31.0 |
| faceClock | 29.0 | 29.0 | 29.0 |
| enemyFacing | 29.0 | 29.0 | 29.0 |
| confAt | 27.4 | 27.4 | 27.4 |
| spriteFloor | 26.0 | 26.0 | 26.0 |
| groundYFast | 23.0 | 23.0 | 23.0 |
| mlTake | 16.4 | 16.4 | 16.4 |
| mlHoldTry | 15.8 | 15.8 | 15.8 |
| groundPatch | 15.8 | 15.8 | 15.8 |
| placeStandards | 13.6 | 13.6 | 13.6 |
| mlFarPlate | 9.7 | 9.7 | 9.7 |
| mlFarRatio | 9.7 | 9.7 | 9.7 |
| aggReading | 8.0 | 8.0 | 8.0 |
| mlPanels | 5.0 | 5.0 | 5.0 |
| mlLegendFit | 5.0 | 5.0 | 5.0 |
| landPanels | 4.0 | 4.0 | 4.0 |
| landFreeRect | 3.0 | 3.0 | 3.0 |
| mlPlaceItem | 1.1 | 1.1 | 1.1 |
| mlCollect | 1.0 | 1.0 | 1.0 |
| mlBand | 1.0 | 1.0 | 1.0 |
| mlObstacles | 1.0 | 1.0 | 1.0 |
| smokePlace | 1.0 | 1.0 | 1.0 |
| arrowCap | 1.0 | 1.0 | 1.0 |
| viewDist | 1.0 | 1.0 | 1.0 |
| drawOnArrows | 1.0 | 1.0 | 1.0 |
| capRows | 0.6 | 0.6 | 0.6 |
| ribbonRelayout | 0.6 | 0.6 | 0.6 |
| toastRelayout | 0.1 | 0.1 | 0.1 |
| placeToast | 0.0 | 0.0 | 0.0 |

## overview-route

the Overview, 09:30, Watch, orbiting at 20 degrees a second by the route's own camera writes (device route overview orbit, perf-route.js:166-170): decision 268's segment

Blocks in order: P 7.64, Hstd 6.81, Hfig 4.81, Hfig 4.75, Hstd 6.82, P 7.30, P 7.59, Hstd 7.48, Hfig 4.67, Hfig 4.89, Hstd 6.78, P 7.36

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs P (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| P | 4 | 7.48 (7.64, 7.30, 7.59, 7.36) | 0.01 | 6.85 | 4.15 | 1.20 | 0.80 | 542 | - |
| Hstd | 4 | 6.81 (6.81, 6.82, 7.48, 6.78) | 0.01 | 6.40 | 3.60 | 1.20 | 0.80 | 471 | -7.2% (-10.8%, -6.6%, -1.5%, -7.8%) |
| Hfig | 4 | 4.78 (4.81, 4.75, 4.67, 4.89) | 0.01 | 4.40 | 1.70 | 1.20 | 0.80 | 244 | -35.9% (-37.0%, -34.9%, -38.6%, -33.6%) |

Counts per frame (load-independent; 144 frames each): GL calls in all P 7197.66, Hstd 5788.65, Hfig 1173.02; bytes uploaded by bufferData/bufferSubData P 158, Hstd 158, Hfig 158; draw calls P 542, Hstd 471, Hfig 244

| GL method | P | Hstd | Hfig | Hstd - P | Hfig - P |
|---|---|---|---|---|---|
| vertexAttribPointer | 2677.0 | 2224.0 | 116.0 | -453.0 | -2561.0 |
| bindBuffer | 1820.0 | 1509.0 | 74.0 | -311.0 | -1746.0 |
| bindVertexArray | 461.0 | 392.0 | 165.0 | -69.0 | -296.0 |
| uniformMatrix4fv | 401.0 | 300.0 | 164.0 | -101.0 | -237.0 |
| useProgram | 293.0 | 217.0 | 33.0 | -76.0 | -260.0 |
| uniform3fv | 276.0 | 200.0 | 16.0 | -76.0 | -260.0 |
| drawArraysInstanced | 233.0 | 233.0 | 10.0 | +0.0 | -223.0 |
| drawElements | 185.0 | 185.0 | 183.0 | +0.0 | -2.0 |
| uniform3f | 136.0 | 91.0 | 78.0 | -45.0 | -58.0 |
| uniformMatrix3fv | 129.0 | 79.0 | 13.0 | -50.0 | -116.0 |
| bindTexture | 86.0 | 33.0 | 33.0 | -53.0 | -53.0 |
| activeTexture | 81.0 | 27.0 | 27.0 | -54.0 | -54.0 |
| drawElementsInstanced | 79.0 | 8.0 | 6.0 | -71.0 | -73.0 |
| uniform1f | 76.6 | 76.6 | 41.0 | -0.0 | -35.6 |
| uniform2f | 61.0 | 61.0 | 61.0 | +0.0 | +0.0 |
| drawArrays | 45.0 | 45.0 | 45.0 | +0.0 | +0.0 |
| disable | 43.0 | 18.0 | 18.0 | -25.0 | -25.0 |
| enable | 43.0 | 18.0 | 18.0 | -25.0 | -25.0 |
| depthMask | 22.0 | 22.0 | 22.0 | +0.0 | +0.0 |
| clear | 18.0 | 18.0 | 18.0 | +0.0 | +0.0 |
| bindFramebuffer | 10.0 | 10.0 | 10.0 | +0.0 | +0.0 |
| scissor | 7.0 | 7.0 | 7.0 | +0.0 | +0.0 |
| clearColor | 4.0 | 4.0 | 4.0 | +0.0 | +0.0 |
| viewport | 3.0 | 3.0 | 3.0 | +0.0 | +0.0 |
| frontFace | 2.0 | 2.0 | 2.0 | +0.0 | +0.0 |
| uniform1fv | 2.0 | 2.0 | 2.0 | +0.0 | +0.0 |
| uniform4f | 2.0 | 2.0 | 2.0 | +0.0 | +0.0 |
| getError | 1.0 | 1.0 | 1.0 | +0.0 | +0.0 |

| app function (calls per frame) | P | Hstd | Hfig |
|---|---|---|---|
| groundY | 1740.7 | 1740.7 | 1740.7 |
| cullStale | 296.0 | 225.0 | 0.0 |
| cullTest | 296.0 | 225.0 | 0.0 |
| mlFree | 278.3 | 278.3 | 278.3 |
| viewH | 231.0 | 231.0 | 231.0 |
| worldPerPx | 214.0 | 214.0 | 214.0 |
| posNow | 117.0 | 117.0 | 117.0 |
| stateAt | 79.0 | 79.0 | 79.0 |
| liveStatus | 67.0 | 67.0 | 67.0 |
| marchRate | 63.0 | 63.0 | 63.0 |
| leavesOf | 60.0 | 60.0 | 60.0 |
| mlBandAt | 48.0 | 48.0 | 48.0 |
| spriteFloor | 41.0 | 41.0 | 41.0 |
| drawnKnow | 37.0 | 37.0 | 37.0 |
| displayHeight | 32.0 | 32.0 | 32.0 |
| height | 32.0 | 32.0 | 32.0 |
| smokeWant | 32.0 | 32.0 | 32.0 |
| poseBlock | 31.0 | 31.0 | 31.0 |
| settleBlock | 31.0 | 31.0 | 31.0 |
| kitLod | 31.0 | 31.0 | 31.0 |
| gaitStep | 31.0 | 31.0 | 31.0 |
| outlinePlace | 31.0 | 31.0 | 31.0 |
| updateTrail | 31.0 | 31.0 | 31.0 |
| onScreen | 31.0 | 31.0 | 31.0 |
| eyeOwnNear | 31.0 | 31.0 | 31.0 |
| enemyFacing | 29.0 | 29.0 | 29.0 |
| mlFar | 27.0 | 27.0 | 27.0 |
| mlPlaceItem | 26.0 | 26.0 | 26.0 |
| mlOccluded | 26.0 | 26.0 | 26.0 |
| mlTake | 15.4 | 15.4 | 15.4 |
| aggReading | 8.0 | 8.0 | 8.0 |
| mlFarPlate | 5.0 | 5.0 | 5.0 |
| mlFarRatio | 5.0 | 5.0 | 5.0 |
| mlPanels | 5.0 | 5.0 | 5.0 |
| mlLegendFit | 5.0 | 5.0 | 5.0 |
| confAt | 5.0 | 5.0 | 5.0 |
| landPanels | 4.0 | 4.0 | 4.0 |
| landFreeRect | 3.0 | 3.0 | 3.0 |
| mlCollect | 1.0 | 1.0 | 1.0 |
| mlBand | 1.0 | 1.0 | 1.0 |
| mlObstacles | 1.0 | 1.0 | 1.0 |
| smokePlace | 1.0 | 1.0 | 1.0 |
| arrowCap | 1.0 | 1.0 | 1.0 |
| viewDist | 1.0 | 1.0 | 1.0 |
| groundPatch | 0.0 | 0.0 | 0.0 |

## ph8-drag

phase 8, 14:40, the Overview, Watch, orbiting by a right-button drag (the task's motion; device route ph8-overview orbits by camera writes)

Blocks in order: P 7.13, Hstd 6.29, Hfig 4.79, Hfig 4.56, Hstd 6.41, P 7.13, P 7.39, Hstd 7.61, Hfig 5.08, Hfig 4.47, Hstd 8.82, P 8.86

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs P (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| P | 4 | 7.26 (7.13, 7.13, 7.39, 8.86) | 0.01 | 6.65 | 4.05 | 1.25 | 0.60 | 524 | - |
| Hstd | 4 | 7.01 (6.29, 6.41, 7.61, 8.82) | 0.01 | 6.30 | 3.60 | 1.25 | 0.60 | 453 | -5.3% (-11.8%, -10.2%, +2.9%, -0.5%) |
| Hfig | 4 | 4.67 (4.79, 4.56, 5.08, 4.47) | 0.01 | 4.20 | 1.60 | 1.25 | 0.60 | 233 | -34.5% (-32.8%, -36.1%, -31.3%, -49.6%) |

Counts per frame (load-independent; 144 frames each): GL calls in all P 7014.99, Hstd 5607.99, Hfig 1131.93; bytes uploaded by bufferData/bufferSubData P 0, Hstd 0, Hfig 0; draw calls P 524, Hstd 453, Hfig 233

| GL method | P | Hstd | Hfig | Hstd - P | Hfig - P |
|---|---|---|---|---|---|
| vertexAttribPointer | 2622.0 | 2169.0 | 116.0 | -453.0 | -2506.0 |
| bindBuffer | 1782.0 | 1471.0 | 74.0 | -311.0 | -1708.0 |
| bindVertexArray | 454.0 | 385.0 | 165.0 | -69.0 | -289.0 |
| uniformMatrix4fv | 376.0 | 275.0 | 140.0 | -101.0 | -236.0 |
| useProgram | 281.0 | 205.0 | 32.0 | -76.0 | -249.0 |
| uniform3fv | 265.0 | 189.0 | 16.0 | -76.0 | -249.0 |
| drawArraysInstanced | 228.0 | 228.0 | 10.0 | +0.0 | -218.0 |
| drawElements | 176.0 | 176.0 | 175.0 | +0.0 | -1.0 |
| uniform3f | 132.0 | 89.0 | 76.0 | -43.0 | -56.0 |
| uniformMatrix3fv | 129.0 | 79.0 | 13.0 | -50.0 | -116.0 |
| bindTexture | 83.0 | 30.0 | 30.0 | -53.0 | -53.0 |
| activeTexture | 81.0 | 27.0 | 27.0 | -54.0 | -54.0 |
| drawElementsInstanced | 78.0 | 7.0 | 6.0 | -71.0 | -72.0 |
| uniform1f | 70.0 | 70.0 | 43.9 | +0.0 | -26.1 |
| uniform2f | 58.0 | 58.0 | 58.0 | +0.0 | +0.0 |
| disable | 43.0 | 18.0 | 18.0 | -25.0 | -25.0 |
| enable | 43.0 | 18.0 | 18.0 | -25.0 | -25.0 |
| drawArrays | 42.0 | 42.0 | 42.0 | +0.0 | +0.0 |
| depthMask | 22.0 | 22.0 | 22.0 | +0.0 | +0.0 |
| clear | 18.0 | 18.0 | 18.0 | +0.0 | +0.0 |
| bindFramebuffer | 10.0 | 10.0 | 10.0 | +0.0 | +0.0 |
| scissor | 7.0 | 7.0 | 7.0 | +0.0 | +0.0 |
| clearColor | 4.0 | 4.0 | 4.0 | +0.0 | +0.0 |
| viewport | 3.0 | 3.0 | 3.0 | +0.0 | +0.0 |
| frontFace | 2.0 | 2.0 | 2.0 | +0.0 | +0.0 |
| uniform1fv | 2.0 | 2.0 | 2.0 | +0.0 | +0.0 |
| uniform4f | 2.0 | 2.0 | 2.0 | +0.0 | +0.0 |
| getError | 1.0 | 1.0 | 1.0 | +0.0 | +0.0 |

| app function (calls per frame) | P | Hstd | Hfig |
|---|---|---|---|
| groundY | 1614.0 | 1614.0 | 1614.0 |
| cullStale | 290.0 | 219.0 | 0.0 |
| cullTest | 290.0 | 219.0 | 0.0 |
| mlFree | 258.8 | 258.8 | 258.8 |
| viewH | 230.0 | 230.0 | 230.0 |
| worldPerPx | 214.0 | 214.0 | 214.0 |
| stateAt | 82.0 | 82.0 | 82.0 |
| liveStatus | 69.0 | 69.0 | 69.0 |
| marchRate | 64.0 | 64.0 | 64.0 |
| posNow | 61.0 | 61.0 | 61.0 |
| leavesOf | 60.0 | 60.0 | 60.0 |
| mlBandAt | 47.1 | 47.1 | 47.1 |
| drawnKnow | 37.0 | 37.0 | 37.0 |
| poseBlock | 32.0 | 32.0 | 32.0 |
| settleBlock | 32.0 | 32.0 | 32.0 |
| kitLod | 32.0 | 32.0 | 32.0 |
| gaitStep | 32.0 | 32.0 | 32.0 |
| outlinePlace | 32.0 | 32.0 | 32.0 |
| displayHeight | 32.0 | 32.0 | 32.0 |
| height | 32.0 | 32.0 | 32.0 |
| smokeWant | 32.0 | 32.0 | 32.0 |
| updateTrail | 32.0 | 32.0 | 32.0 |
| spriteFloor | 32.0 | 32.0 | 32.0 |
| onScreen | 32.0 | 32.0 | 32.0 |
| eyeOwnNear | 32.0 | 32.0 | 32.0 |
| enemyFacing | 30.0 | 30.0 | 30.0 |
| mlFar | 25.0 | 25.0 | 25.0 |
| mlOccluded | 24.0 | 24.0 | 24.0 |
| mlTake | 11.2 | 11.2 | 11.2 |
| mlHoldTry | 10.0 | 10.0 | 10.0 |
| aggReading | 8.0 | 8.0 | 8.0 |
| mlPanels | 5.0 | 5.0 | 5.0 |
| mlLegendFit | 5.0 | 5.0 | 5.0 |
| confAt | 5.0 | 5.0 | 5.0 |
| landPanels | 4.0 | 4.0 | 4.0 |
| mlFarPlate | 3.1 | 3.1 | 3.1 |
| mlFarRatio | 3.1 | 3.1 | 3.1 |
| landFreeRect | 3.0 | 3.0 | 3.0 |
| mlPlaceItem | 1.5 | 1.5 | 1.5 |
| mlCollect | 1.0 | 1.0 | 1.0 |
| mlBand | 1.0 | 1.0 | 1.0 |
| mlObstacles | 1.0 | 1.0 | 1.0 |
| smokePlace | 1.0 | 1.0 | 1.0 |
| arrowCap | 1.0 | 1.0 | 1.0 |
| viewDist | 1.0 | 1.0 | 1.0 |
