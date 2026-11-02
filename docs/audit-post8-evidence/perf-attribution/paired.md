# paired session: L3 (c9d29c14, 2218404 B), 8E (d73d0115, 2537677 B), now (f10fe585, 2810630 B)

viewport 2560x1305, frame 6.944 ms (144 Hz), blocks per build per motion 2 (palindrome order), frames per block {"play":552,"route":264,"drag":264,"held":168}, warm-up 72; load [43.3,41,34.13] -> [12.45,21.82,28.84]

## Start-up in this session (ms; one page each, opened one after another under the machine's load)

| build | DOM ready | first frame | boot overlay gone | main thread quiet | BOOTMS init |
|---|---|---|---|---|---|
| L3 | 120860 | 29705 | 120861 | 121540 | (none before 8H) |
| 8E | 112440 | 31830 | 112448 | 124801 | (none before 8H) |
| now | 91850 | 22280 | 94945 | 100527 | 14867.2 |

## play-half

Play at half speed under Follow from 08:30, Watch, the Field vantage (device route play-half, perf-route.js:263-265)

Blocks in order: L3 19.52, 8E 24.16, now 23.99, now 24.07, 8E 23.59, L3 19.59

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs L3 (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| L3 | 2 | 19.55 (19.52, 19.59) | 16.76 | 21.15 | 11.40 | 3.60 | 1.30 | 791 | - |
| 8E | 2 | 23.88 (24.16, 23.59) | 14.49 | 27.20 | 15.40 | 4.30 | 1.45 | 789 | +22.1% (+23.8%, +20.4%) |
| now | 2 | 24.03 (23.99, 24.07) | 19.30 | 29.40 | 17.05 | 4.15 | 1.55 | 802 | +22.9% (+22.9%, +22.8%) |

Counts per frame (load-independent; 144 frames each): GL calls in all L3 10326.78, 8E 13226.95, now 13502.35; bytes uploaded by bufferData/bufferSubData L3 281868, 8E 388656, now 348124; draw calls L3 791, 8E 789, now 802

| GL method | L3 | 8E | now | 8E - L3 | now - L3 |
|---|---|---|---|---|---|
| vertexAttribPointer | 3493.3 | 4750.0 | 4846.0 | +1256.7 | +1352.7 |
| bindBuffer | 2098.9 | 3369.2 | 3429.0 | +1270.3 | +1330.0 |
| uniformMatrix4fv | 747.0 | 811.0 | 823.0 | +64.0 | +76.0 |
| bindVertexArray | 727.1 | 725.1 | 733.1 | -2.0 | +6.0 |
| activeTexture | 676.0 | 672.0 | 684.0 | -4.0 | +8.0 |
| useProgram | 283.0 | 491.0 | 501.0 | +208.0 | +218.0 |
| drawArraysInstanced | 439.0 | 441.0 | 448.0 | +2.0 | +9.0 |
| uniform1iv | 315.0 | 313.0 | 318.0 | -2.0 | +3.0 |
| uniform3fv | 261.0 | 261.0 | 269.0 | +0.0 | +8.0 |
| uniform3f | 178.3 | 188.1 | 221.6 | +9.8 | +43.3 |
| bufferSubData | 188.1 | 196.2 | 193.0 | +8.2 | +4.9 |
| drawElements | 172.0 | 172.0 | 172.0 | +0.0 | +0.0 |
| bindTexture | 153.2 | 138.2 | 143.2 | -15.0 | -10.0 |
| drawElementsInstanced | 133.0 | 127.0 | 133.0 | -6.0 | +0.0 |
| uniformMatrix3fv | 125.3 | 125.1 | 129.8 | -0.2 | +4.5 |
| uniform1f | 83.1 | 122.1 | 113.1 | +39.0 | +30.0 |
| uniform2f | 6.0 | 61.3 | 62.0 | +55.3 | +56.0 |
| drawArrays | 47.1 | 49.1 | 49.1 | +2.0 | +2.0 |
| disable | 43.1 | 44.1 | 47.1 | +1.0 | +4.0 |
| enable | 43.1 | 44.1 | 47.1 | +1.0 | +4.0 |
| uniform4f | 26.0 | 30.0 | 38.0 | +4.0 | +12.0 |
| depthMask | 24.3 | 24.3 | 26.3 | +0.0 | +2.0 |
| clear | 17.0 | 19.0 | 19.0 | +2.0 | +2.0 |
| bindFramebuffer | 10.2 | 12.2 | 12.2 | +2.0 | +2.0 |
| scissor | 7.1 | 9.1 | 9.1 | +2.0 | +2.0 |
| viewport | 6.1 | 8.1 | 8.1 | +2.0 | +2.0 |
| frontFace | 4.0 | 4.0 | 6.0 | +0.0 | +2.0 |
| clearColor | 3.0 | 5.0 | 5.0 | +2.0 | +2.0 |

| app function (calls per frame) | L3 | 8E | now |
|---|---|---|---|
| groundY | 7066.1 | 11908.1 | 11657.7 |
| cullStale | 0.0 | 547.0 | 551.0 |
| cullTest | 0.0 | 547.0 | 551.0 |
| mlFree | 474.8 | 59.7 | 60.4 |
| viewH | 103.5 | 265.7 | 265.8 |
| worldPerPx | 96.4 | 251.6 | 251.7 |
| stateAt | 247.8 | 168.5 | 168.4 |
| posNow | 168.0 | 168.0 | 168.0 |
| cullRefresh | 0.0 | 145.8 | 144.5 |
| cullGeo | 0.0 | 145.8 | 144.5 |
| liveStatus | 91.3 | 91.5 | 91.5 |
| height | 87.3 | 87.3 | 87.7 |
| displayHeight | 85.3 | 85.3 | 85.7 |
| mlBandAt | 0.0 | 54.0 | 77.6 |
| marchRate | 63.0 | 63.0 | 63.0 |
| mlFar | 0.0 | 62.2 | 62.3 |
| mlPlaceItem | 62.0 | 1.8 | 1.9 |
| drawnKnow | 61.3 | 61.5 | 61.5 |
| mlOccluded | 60.7 | 60.9 | 61.0 |
| confAt | 60.3 | 29.5 | 29.5 |
| leavesOf | 60.0 | 60.0 | 60.0 |
| mlTake | 50.2 | 45.1 | 44.3 |
| mlHoldTry | 0.0 | 43.7 | 42.9 |
| smokeWant | 32.0 | 32.0 | 32.0 |
| poseBlock | 31.0 | 31.0 | 31.0 |
| settleBlock | 31.0 | 31.0 | 31.0 |
| confPlace | 31.0 | 0.0 | 0.0 |
| updateTrail | 31.0 | 31.0 | 31.0 |
| onScreen | 31.0 | 31.0 | 31.0 |
| eyeOwnNear | 31.0 | 31.0 | 31.0 |
| kitLod | 0.0 | 31.0 | 31.0 |
| gaitStep | 0.0 | 31.0 | 31.0 |
| outlinePlace | 0.0 | 31.0 | 31.0 |
| spriteFloor | 26.0 | 26.0 | 26.0 |
| mlFarPlate | 0.0 | 0.0 | 23.6 |
| mlFarRatio | 0.0 | 0.0 | 23.6 |
| groundYFast | 0.0 | 0.0 | 23.0 |
| groundPatch | 18.6 | 18.7 | 17.8 |
| placeStandards | 14.9 | 14.9 | 14.7 |
| enemyFacing | 12.0 | 12.0 | 13.0 |
| faceClock | 0.0 | 12.0 | 13.0 |
| aggReading | 8.0 | 8.0 | 8.0 |
| mlPanels | 5.0 | 5.0 | 5.0 |
| mlLegendFit | 5.0 | 5.0 | 5.0 |
| landPanels | 4.0 | 4.0 | 4.0 |
| landFreeRect | 3.0 | 3.0 | 3.0 |
| capRows | 0.0 | 2.6 | 2.5 |
| ribbonRelayout | 0.0 | 2.6 | 2.5 |
| mlCollect | 1.0 | 1.0 | 1.0 |
| mlObstacles | 1.0 | 1.0 | 1.0 |
| smokePlace | 1.0 | 1.0 | 1.0 |
| viewDist | 1.0 | 1.0 | 1.0 |
| drawOnArrows | 1.0 | 1.0 | 1.0 |
| mlBand | 0.0 | 1.0 | 1.0 |
| arrowCap | 0.0 | 1.0 | 1.0 |
| toastRelayout | 0.0 | 0.0 | 0.0 |
| freeCentre | 0.0 | 0.0 | 0.0 |
| kitLodSet | 0.0 | 0.0 | 0.0 |

## overview-held

the Overview vantage, 09:30, Watch, held and drawn every frame (device route overview held, perf-route.js:243-244)

Blocks in order: L3 14.48, 8E 16.01, now 18.89, now 15.09, 8E 17.53, L3 14.25

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs L3 (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| L3 | 2 | 14.37 (14.48, 14.25) | 6.70 | 15.60 | 10.30 | 2.65 | 0.60 | 832 | - |
| 8E | 2 | 16.77 (16.01, 17.53) | 10.24 | 19.10 | 13.15 | 2.90 | 0.70 | 828 | +16.8% (+10.5%, +23.1%) |
| now | 2 | 16.99 (18.89, 15.09) | 9.07 | 21.15 | 14.05 | 2.95 | 0.70 | 837 | +18.1% (+30.4%, +5.9%) |

Counts per frame (load-independent; 144 frames each): GL calls in all L3 10217, 8E 13255, now 13394; bytes uploaded by bufferData/bufferSubData L3 0, 8E 0, now 0; draw calls L3 832, 8E 828, now 837

| GL method | L3 | 8E | now | 8E - L3 | now - L3 |
|---|---|---|---|---|---|
| vertexAttribPointer | 3668.0 | 5009.0 | 5068.0 | +1341.0 | +1400.0 |
| bindBuffer | 2001.0 | 3348.0 | 3386.0 | +1347.0 | +1385.0 |
| uniformMatrix4fv | 770.0 | 825.0 | 828.0 | +55.0 | +58.0 |
| bindVertexArray | 753.0 | 749.0 | 753.0 | -4.0 | +0.0 |
| activeTexture | 704.0 | 700.0 | 708.0 | -4.0 | +4.0 |
| useProgram | 294.0 | 513.0 | 519.0 | +219.0 | +225.0 |
| drawArraysInstanced | 467.0 | 469.0 | 472.0 | +2.0 | +5.0 |
| uniform1iv | 329.0 | 327.0 | 330.0 | -2.0 | +1.0 |
| uniform3fv | 275.0 | 275.0 | 281.0 | +0.0 | +6.0 |
| drawElements | 189.0 | 189.0 | 189.0 | +0.0 | +0.0 |
| bindTexture | 155.0 | 138.0 | 143.0 | -17.0 | -12.0 |
| drawElementsInstanced | 133.0 | 127.0 | 133.0 | -6.0 | +0.0 |
| uniform1f | 74.0 | 128.0 | 114.0 | +54.0 | +40.0 |
| uniformMatrix3fv | 122.0 | 121.0 | 123.0 | -1.0 | +1.0 |
| uniform3f | 82.0 | 78.0 | 76.0 | -4.0 | -6.0 |
| uniform2f | 6.0 | 62.0 | 62.0 | +56.0 | +56.0 |
| disable | 41.0 | 42.0 | 45.0 | +1.0 | +4.0 |
| enable | 41.0 | 42.0 | 45.0 | +1.0 | +4.0 |
| drawArrays | 43.0 | 43.0 | 43.0 | +0.0 | +0.0 |
| depthMask | 20.0 | 20.0 | 22.0 | +0.0 | +2.0 |
| clear | 17.0 | 17.0 | 17.0 | +0.0 | +0.0 |
| bindFramebuffer | 10.0 | 10.0 | 10.0 | +0.0 | +0.0 |
| scissor | 7.0 | 7.0 | 7.0 | +0.0 | +0.0 |
| viewport | 6.0 | 6.0 | 6.0 | +0.0 | +0.0 |
| frontFace | 4.0 | 4.0 | 6.0 | +0.0 | +2.0 |
| clearColor | 3.0 | 3.0 | 3.0 | +0.0 | +0.0 |
| uniform1i | 2.0 | 2.0 | 2.0 | +0.0 | +0.0 |
| uniform1fv | 0.0 | 0.0 | 2.0 | +0.0 | +2.0 |

| app function (calls per frame) | L3 | 8E | now |
|---|---|---|---|
| groundY | 434.0 | 1209.0 | 1209.0 |
| cullStale | 0.0 | 575.0 | 575.0 |
| cullTest | 0.0 | 575.0 | 575.0 |
| viewH | 65.0 | 221.0 | 221.0 |
| worldPerPx | 59.0 | 214.0 | 214.0 |
| stateAt | 155.0 | 79.0 | 79.0 |
| posNow | 117.0 | 117.0 | 117.0 |
| mlFree | 94.0 | 86.0 | 86.0 |
| liveStatus | 67.0 | 67.0 | 67.0 |
| marchRate | 63.0 | 63.0 | 63.0 |
| leavesOf | 60.0 | 60.0 | 60.0 |
| mlBandAt | 0.0 | 43.0 | 48.0 |
| spriteFloor | 41.0 | 41.0 | 41.0 |
| drawnKnow | 37.0 | 37.0 | 37.0 |
| confAt | 36.0 | 5.0 | 5.0 |
| displayHeight | 32.0 | 32.0 | 32.0 |
| height | 32.0 | 32.0 | 32.0 |
| smokeWant | 32.0 | 32.0 | 32.0 |
| poseBlock | 31.0 | 31.0 | 31.0 |
| settleBlock | 31.0 | 31.0 | 31.0 |
| confPlace | 31.0 | 0.0 | 0.0 |
| updateTrail | 31.0 | 31.0 | 31.0 |
| onScreen | 31.0 | 31.0 | 31.0 |
| eyeOwnNear | 31.0 | 31.0 | 31.0 |
| kitLod | 0.0 | 31.0 | 31.0 |
| gaitStep | 0.0 | 31.0 | 31.0 |
| outlinePlace | 0.0 | 31.0 | 31.0 |
| mlPlaceItem | 27.0 | 27.0 | 27.0 |
| mlFar | 0.0 | 27.0 | 27.0 |
| mlOccluded | 26.0 | 26.0 | 26.0 |
| mlTake | 23.0 | 24.0 | 24.0 |
| enemyFacing | 16.0 | 16.0 | 16.0 |
| aggReading | 8.0 | 8.0 | 8.0 |
| mlFarPlate | 0.0 | 0.0 | 5.0 |
| mlFarRatio | 0.0 | 0.0 | 5.0 |
| mlPanels | 4.0 | 4.0 | 4.0 |
| mlLegendFit | 4.0 | 4.0 | 4.0 |
| landPanels | 3.0 | 3.0 | 3.0 |
| landFreeRect | 2.0 | 2.0 | 2.0 |
| mlCollect | 1.0 | 1.0 | 1.0 |
| mlObstacles | 1.0 | 1.0 | 1.0 |
| smokePlace | 1.0 | 1.0 | 1.0 |
| viewDist | 1.0 | 1.0 | 1.0 |
| mlBand | 0.0 | 1.0 | 1.0 |
| arrowCap | 0.0 | 1.0 | 1.0 |

## overview-route

the Overview, 09:30, Watch, orbiting at 20 degrees a second by the route's own camera writes (device route overview orbit, perf-route.js:166-170): decision 268's segment

Blocks in order: L3 16.14, 8E 19.84, now 20.22, now 21.57, 8E 19.56, L3 15.27

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs L3 (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| L3 | 2 | 15.71 (16.14, 15.27) | 7.64 | 16.75 | 9.90 | 2.35 | 0.70 | 832 | - |
| 8E | 2 | 19.70 (19.84, 19.56) | 10.99 | 21.60 | 13.40 | 2.85 | 0.90 | 830 | +25.5% (+22.9%, +28.1%) |
| now | 2 | 20.90 (20.22, 21.57) | 19.31 | 24.10 | 14.95 | 3.05 | 1.00 | 839 | +33.3% (+25.3%, +41.2%) |

Counts per frame (load-independent; 144 frames each): GL calls in all L3 10289.86, 8E 13358.14, now 13525.93; bytes uploaded by bufferData/bufferSubData L3 0, 8E 712, now 802; draw calls L3 832, 8E 830, now 839

| GL method | L3 | 8E | now | 8E - L3 | now - L3 |
|---|---|---|---|---|---|
| vertexAttribPointer | 3668.0 | 5009.0 | 5068.0 | +1341.0 | +1400.0 |
| bindBuffer | 2001.0 | 3348.2 | 3386.2 | +1347.2 | +1385.2 |
| uniformMatrix4fv | 791.0 | 855.0 | 865.0 | +64.0 | +74.0 |
| bindVertexArray | 753.0 | 751.0 | 755.0 | -2.0 | +2.0 |
| activeTexture | 704.0 | 700.0 | 708.0 | -4.0 | +4.0 |
| useProgram | 294.0 | 514.0 | 520.0 | +220.0 | +226.0 |
| drawArraysInstanced | 467.0 | 469.0 | 472.0 | +2.0 | +5.0 |
| uniform1iv | 329.0 | 327.0 | 330.0 | -2.0 | +1.0 |
| uniform3fv | 275.0 | 275.0 | 281.0 | +0.0 | +6.0 |
| drawElements | 189.0 | 189.0 | 189.0 | +0.0 | +0.0 |
| bindTexture | 155.0 | 138.0 | 143.0 | -17.0 | -12.0 |
| uniform1f | 81.9 | 136.8 | 125.6 | +55.0 | +43.7 |
| uniform3f | 122.0 | 122.0 | 136.0 | +0.0 | +14.0 |
| drawElementsInstanced | 133.0 | 127.0 | 133.0 | -6.0 | +0.0 |
| uniformMatrix3fv | 126.0 | 126.0 | 131.0 | +0.0 | +5.0 |
| uniform2f | 6.0 | 62.0 | 62.0 | +56.0 | +56.0 |
| drawArrays | 43.0 | 45.0 | 45.0 | +2.0 | +2.0 |
| disable | 41.0 | 42.0 | 45.0 | +1.0 | +4.0 |
| enable | 41.0 | 42.0 | 45.0 | +1.0 | +4.0 |
| depthMask | 20.0 | 20.0 | 22.0 | +0.0 | +2.0 |
| clear | 17.0 | 19.0 | 19.0 | +2.0 | +2.0 |
| bindFramebuffer | 10.0 | 12.0 | 12.0 | +2.0 | +2.0 |
| scissor | 7.0 | 9.0 | 9.0 | +2.0 | +2.0 |
| viewport | 6.0 | 8.0 | 8.0 | +2.0 | +2.0 |
| frontFace | 4.0 | 4.0 | 6.0 | +0.0 | +2.0 |
| clearColor | 3.0 | 5.0 | 5.0 | +2.0 | +2.0 |
| uniform1i | 2.0 | 2.0 | 2.0 | +0.0 | +0.0 |
| uniform1fv | 0.0 | 0.0 | 2.0 | +0.0 | +2.0 |

| app function (calls per frame) | L3 | 8E | now |
|---|---|---|---|
| groundY | 444.0 | 1998.6 | 2058.8 |
| cullStale | 0.0 | 575.0 | 575.0 |
| cullTest | 0.0 | 575.0 | 575.0 |
| viewH | 66.0 | 231.0 | 231.0 |
| worldPerPx | 59.0 | 214.0 | 214.0 |
| stateAt | 155.0 | 79.0 | 79.0 |
| posNow | 117.0 | 117.0 | 117.0 |
| mlFree | 104.8 | 107.3 | 111.0 |
| liveStatus | 67.0 | 67.0 | 67.0 |
| marchRate | 63.0 | 63.0 | 63.0 |
| leavesOf | 60.0 | 60.0 | 60.0 |
| mlBandAt | 0.0 | 43.0 | 48.0 |
| spriteFloor | 41.0 | 41.0 | 41.0 |
| drawnKnow | 37.0 | 37.0 | 37.0 |
| confAt | 36.0 | 5.0 | 5.0 |
| displayHeight | 32.0 | 32.0 | 32.0 |
| height | 32.0 | 32.0 | 32.0 |
| smokeWant | 32.0 | 32.0 | 32.0 |
| poseBlock | 31.0 | 31.0 | 31.0 |
| settleBlock | 31.0 | 31.0 | 31.0 |
| confPlace | 31.0 | 0.0 | 0.0 |
| updateTrail | 31.0 | 31.0 | 31.0 |
| onScreen | 31.0 | 31.0 | 31.0 |
| eyeOwnNear | 31.0 | 31.0 | 31.0 |
| kitLod | 0.0 | 31.0 | 31.0 |
| gaitStep | 0.0 | 31.0 | 31.0 |
| outlinePlace | 0.0 | 31.0 | 31.0 |
| mlPlaceItem | 27.0 | 27.0 | 27.0 |
| mlFar | 0.0 | 27.0 | 27.0 |
| mlOccluded | 26.0 | 26.0 | 26.0 |
| mlTake | 22.3 | 23.2 | 23.4 |
| enemyFacing | 16.0 | 16.0 | 16.0 |
| aggReading | 8.0 | 8.0 | 8.0 |
| mlPanels | 5.0 | 5.0 | 5.0 |
| mlLegendFit | 5.0 | 5.0 | 5.0 |
| mlFarPlate | 0.0 | 0.0 | 5.0 |
| mlFarRatio | 0.0 | 0.0 | 5.0 |
| landPanels | 4.0 | 4.0 | 4.0 |
| landFreeRect | 3.0 | 3.0 | 3.0 |
| mlCollect | 1.0 | 1.0 | 1.0 |
| mlObstacles | 1.0 | 1.0 | 1.0 |
| smokePlace | 1.0 | 1.0 | 1.0 |
| viewDist | 1.0 | 1.0 | 1.0 |
| mlBand | 0.0 | 1.0 | 1.0 |
| arrowCap | 0.0 | 1.0 | 1.0 |
| capRows | 0.0 | 0.0 | 0.0 |
| ribbonRelayout | 0.0 | 0.0 | 0.0 |
| groundPatch | 0.0 | 0.0 | 0.0 |

## overview-drag

the Overview, 09:30, Watch, orbiting at 20 degrees a second by a right-button drag through the app's handler (a visitor's orbit)

Blocks in order: L3 18.26, 8E 19.55, now 21.96, now 21.08, 8E 20.64, L3 16.41

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs L3 (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| L3 | 2 | 17.34 (18.26, 16.41) | 7.42 | 19.40 | 11.10 | 2.65 | 0.75 | 832 | - |
| 8E | 2 | 20.10 (19.55, 20.64) | 4.47 | 22.10 | 13.40 | 2.95 | 0.85 | 830 | +16.4% (+7.1%, +25.8%) |
| now | 2 | 21.52 (21.96, 21.08) | 4.79 | 23.75 | 15.05 | 3.10 | 0.95 | 839 | +24.4% (+20.3%, +28.4%) |

Counts per frame (load-independent; 144 frames each): GL calls in all L3 10289.92, 8E 13358.16, now 13525.91; bytes uploaded by bufferData/bufferSubData L3 0, 8E 712, now 802; draw calls L3 832, 8E 830, now 839

| GL method | L3 | 8E | now | 8E - L3 | now - L3 |
|---|---|---|---|---|---|
| vertexAttribPointer | 3668.0 | 5009.0 | 5068.0 | +1341.0 | +1400.0 |
| bindBuffer | 2001.0 | 3348.2 | 3386.2 | +1347.2 | +1385.2 |
| uniformMatrix4fv | 791.0 | 855.0 | 865.0 | +64.0 | +74.0 |
| bindVertexArray | 753.0 | 751.0 | 755.0 | -2.0 | +2.0 |
| activeTexture | 704.0 | 700.0 | 708.0 | -4.0 | +4.0 |
| useProgram | 294.0 | 514.0 | 520.0 | +220.0 | +226.0 |
| drawArraysInstanced | 467.0 | 469.0 | 472.0 | +2.0 | +5.0 |
| uniform1iv | 329.0 | 327.0 | 330.0 | -2.0 | +1.0 |
| uniform3fv | 275.0 | 275.0 | 281.0 | +0.0 | +6.0 |
| drawElements | 189.0 | 189.0 | 189.0 | +0.0 | +0.0 |
| bindTexture | 155.0 | 138.0 | 143.0 | -17.0 | -12.0 |
| uniform1f | 81.9 | 136.8 | 125.5 | +54.9 | +43.6 |
| uniform3f | 122.0 | 122.0 | 136.0 | +0.0 | +14.0 |
| drawElementsInstanced | 133.0 | 127.0 | 133.0 | -6.0 | +0.0 |
| uniformMatrix3fv | 126.0 | 126.0 | 131.0 | +0.0 | +5.0 |
| uniform2f | 6.0 | 62.0 | 62.0 | +56.0 | +56.0 |
| drawArrays | 43.0 | 45.0 | 45.0 | +2.0 | +2.0 |
| disable | 41.0 | 42.0 | 45.0 | +1.0 | +4.0 |
| enable | 41.0 | 42.0 | 45.0 | +1.0 | +4.0 |
| depthMask | 20.0 | 20.0 | 22.0 | +0.0 | +2.0 |
| clear | 17.0 | 19.0 | 19.0 | +2.0 | +2.0 |
| bindFramebuffer | 10.0 | 12.0 | 12.0 | +2.0 | +2.0 |
| scissor | 7.0 | 9.0 | 9.0 | +2.0 | +2.0 |
| viewport | 6.0 | 8.0 | 8.0 | +2.0 | +2.0 |
| frontFace | 4.0 | 4.0 | 6.0 | +0.0 | +2.0 |
| clearColor | 3.0 | 5.0 | 5.0 | +2.0 | +2.0 |
| uniform1i | 2.0 | 2.0 | 2.0 | +0.0 | +0.0 |
| uniform1fv | 0.0 | 0.0 | 2.0 | +0.0 | +2.0 |

| app function (calls per frame) | L3 | 8E | now |
|---|---|---|---|
| groundY | 444.0 | 1998.6 | 2058.8 |
| cullStale | 0.0 | 575.0 | 575.0 |
| cullTest | 0.0 | 575.0 | 575.0 |
| viewH | 66.0 | 231.0 | 231.0 |
| worldPerPx | 59.0 | 214.0 | 214.0 |
| stateAt | 155.0 | 79.0 | 79.0 |
| posNow | 117.0 | 117.0 | 117.0 |
| mlFree | 104.7 | 32.1 | 32.1 |
| liveStatus | 67.0 | 67.0 | 67.0 |
| marchRate | 63.0 | 63.0 | 63.0 |
| leavesOf | 60.0 | 60.0 | 60.0 |
| mlBandAt | 0.0 | 43.0 | 48.0 |
| spriteFloor | 41.0 | 41.0 | 41.0 |
| drawnKnow | 37.0 | 37.0 | 37.0 |
| confAt | 36.0 | 5.0 | 5.0 |
| displayHeight | 32.0 | 32.0 | 32.0 |
| height | 32.0 | 32.0 | 32.0 |
| smokeWant | 32.0 | 32.0 | 32.0 |
| poseBlock | 31.0 | 31.0 | 31.0 |
| settleBlock | 31.0 | 31.0 | 31.0 |
| confPlace | 31.0 | 0.0 | 0.0 |
| updateTrail | 31.0 | 31.0 | 31.0 |
| onScreen | 31.0 | 31.0 | 31.0 |
| eyeOwnNear | 31.0 | 31.0 | 31.0 |
| kitLod | 0.0 | 31.0 | 31.0 |
| gaitStep | 0.0 | 31.0 | 31.0 |
| outlinePlace | 0.0 | 31.0 | 31.0 |
| mlPlaceItem | 27.0 | 1.1 | 1.2 |
| mlFar | 0.0 | 27.0 | 27.0 |
| mlOccluded | 26.0 | 26.0 | 26.0 |
| mlTake | 22.3 | 22.3 | 22.0 |
| mlHoldTry | 0.0 | 21.3 | 21.0 |
| enemyFacing | 16.0 | 16.0 | 16.0 |
| aggReading | 8.0 | 8.0 | 8.0 |
| mlPanels | 5.0 | 5.0 | 5.0 |
| mlLegendFit | 5.0 | 5.0 | 5.0 |
| mlFarPlate | 0.0 | 0.0 | 5.0 |
| mlFarRatio | 0.0 | 0.0 | 5.0 |
| landPanels | 4.0 | 4.0 | 4.0 |
| landFreeRect | 3.0 | 3.0 | 3.0 |
| mlCollect | 1.0 | 1.0 | 1.0 |
| mlObstacles | 1.0 | 1.0 | 1.0 |
| smokePlace | 1.0 | 1.0 | 1.0 |
| viewDist | 1.0 | 1.0 | 1.0 |
| mlBand | 0.0 | 1.0 | 1.0 |
| arrowCap | 0.0 | 1.0 | 1.0 |
| capRows | 0.0 | 0.0 | 0.0 |
| ribbonRelayout | 0.0 | 0.0 | 0.0 |
| groundPatch | 0.0 | 0.0 | 0.0 |

## ph8-drag

phase 8, 14:40, the Overview, Watch, orbiting by a right-button drag (the task's motion; device route ph8-overview orbits by camera writes)

Blocks in order: L3 16.32, 8E 22.43, now 20.54, now 20.33, 8E 20.77, L3 19.00

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs L3 (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| L3 | 2 | 17.66 (16.32, 19.00) | 4.21 | 18.25 | 10.15 | 3.30 | 0.75 | 809 | - |
| 8E | 2 | 21.60 (22.43, 20.77) | 5.47 | 23.30 | 13.70 | 4.10 | 0.85 | 811 | +23.4% (+37.5%, +9.3%) |
| now | 2 | 20.43 (20.54, 20.33) | 4.25 | 22.15 | 14.05 | 3.10 | 0.90 | 819 | +16.4% (+25.8%, +7.0%) |

Counts per frame (load-independent; 144 frames each): GL calls in all L3 10409.24, 8E 13494.79, now 13330.81; bytes uploaded by bufferData/bufferSubData L3 246142, 8E 339777, now 221; draw calls L3 809, 8E 811, now 819

| GL method | L3 | 8E | now | 8E - L3 | now - L3 |
|---|---|---|---|---|---|
| vertexAttribPointer | 3601.1 | 4952.0 | 5011.0 | +1350.9 | +1409.9 |
| bindBuffer | 2112.9 | 3473.2 | 3347.2 | +1360.3 | +1234.3 |
| uniformMatrix4fv | 767.0 | 831.0 | 841.0 | +64.0 | +74.0 |
| bindVertexArray | 743.0 | 745.0 | 748.2 | +2.0 | +5.2 |
| activeTexture | 694.0 | 694.0 | 702.0 | +0.0 | +8.0 |
| useProgram | 286.0 | 501.0 | 507.0 | +215.0 | +221.0 |
| drawArraysInstanced | 451.0 | 463.0 | 466.0 | +12.0 | +15.0 |
| uniform1iv | 324.0 | 324.0 | 327.0 | +0.0 | +3.0 |
| uniform3fv | 268.0 | 269.0 | 275.0 | +1.0 | +7.0 |
| drawElements | 179.0 | 179.0 | 178.2 | +0.0 | -0.8 |
| bufferSubData | 142.7 | 164.2 | 0.2 | +21.5 | -142.5 |
| bindTexture | 156.0 | 135.0 | 140.0 | -21.0 | -16.0 |
| drawElementsInstanced | 139.0 | 127.0 | 133.0 | -12.0 | -6.0 |
| uniformMatrix3fv | 129.0 | 128.0 | 133.0 | -1.0 | +4.0 |
| uniform3f | 124.0 | 120.0 | 132.8 | -4.0 | +8.8 |
| uniform1f | 94.0 | 123.4 | 111.2 | +29.5 | +17.2 |
| uniform2f | 6.0 | 60.0 | 60.0 | +54.0 | +54.0 |
| disable | 41.0 | 42.0 | 45.0 | +1.0 | +4.0 |
| enable | 41.0 | 42.0 | 45.0 | +1.0 | +4.0 |
| drawArrays | 40.0 | 42.0 | 42.0 | +2.0 | +2.0 |
| depthMask | 20.0 | 20.0 | 22.0 | +0.0 | +2.0 |
| clear | 17.0 | 19.0 | 19.0 | +2.0 | +2.0 |
| bindFramebuffer | 10.0 | 12.0 | 12.0 | +2.0 | +2.0 |
| scissor | 7.0 | 9.0 | 9.0 | +2.0 | +2.0 |
| viewport | 6.0 | 8.0 | 8.0 | +2.0 | +2.0 |
| frontFace | 4.0 | 4.0 | 6.0 | +0.0 | +2.0 |
| clearColor | 3.0 | 5.0 | 5.0 | +2.0 | +2.0 |
| uniform1i | 2.0 | 2.0 | 2.0 | +0.0 | +0.0 |

| app function (calls per frame) | L3 | 8E | now |
|---|---|---|---|
| groundY | 4626.4 | 6703.4 | 1812.9 |
| cullStale | 0.0 | 569.0 | 569.0 |
| cullTest | 0.0 | 569.0 | 569.0 |
| viewH | 61.0 | 230.0 | 229.2 |
| worldPerPx | 54.0 | 214.0 | 213.2 |
| mlFree | 184.0 | 29.9 | 28.9 |
| stateAt | 170.0 | 82.0 | 82.0 |
| cullRefresh | 0.0 | 116.1 | 0.0 |
| cullGeo | 0.0 | 116.1 | 0.0 |
| liveStatus | 69.0 | 69.0 | 69.0 |
| marchRate | 64.0 | 64.0 | 64.0 |
| posNow | 61.0 | 61.0 | 61.0 |
| leavesOf | 60.0 | 60.0 | 60.0 |
| mlBandAt | 0.0 | 44.0 | 48.0 |
| confAt | 37.0 | 5.0 | 5.0 |
| drawnKnow | 37.0 | 37.0 | 37.0 |
| poseBlock | 32.0 | 32.0 | 32.0 |
| settleBlock | 32.0 | 32.0 | 32.0 |
| confPlace | 32.0 | 0.0 | 0.0 |
| displayHeight | 32.0 | 32.0 | 32.0 |
| height | 32.0 | 32.0 | 32.0 |
| smokeWant | 32.0 | 32.0 | 32.0 |
| updateTrail | 32.0 | 32.0 | 32.0 |
| onScreen | 32.0 | 32.0 | 32.0 |
| eyeOwnNear | 32.0 | 32.0 | 32.0 |
| kitLod | 0.0 | 32.0 | 32.0 |
| gaitStep | 0.0 | 32.0 | 32.0 |
| outlinePlace | 0.0 | 32.0 | 32.0 |
| spriteFloor | 30.0 | 30.0 | 30.0 |
| mlPlaceItem | 25.0 | 1.1 | 1.2 |
| mlFar | 0.0 | 25.0 | 24.2 |
| mlOccluded | 24.0 | 24.0 | 23.2 |
| mlTake | 21.9 | 20.0 | 18.7 |
| mlHoldTry | 0.0 | 19.0 | 17.6 |
| placeStandards | 10.7 | 10.4 | 0.0 |
| groundPatch | 10.5 | 10.1 | 0.0 |
| aggReading | 8.0 | 8.0 | 8.0 |
| mlPanels | 5.0 | 5.0 | 5.0 |
| mlLegendFit | 5.0 | 5.0 | 5.0 |
| enemyFacing | 5.0 | 5.0 | 5.0 |
| mlFarPlate | 0.0 | 0.0 | 4.0 |
| mlFarRatio | 0.0 | 0.0 | 4.0 |
| landPanels | 4.0 | 4.0 | 4.0 |
| landFreeRect | 3.0 | 3.0 | 3.0 |
| mlCollect | 1.0 | 1.0 | 1.0 |
| mlObstacles | 1.0 | 1.0 | 1.0 |
| smokePlace | 1.0 | 1.0 | 1.0 |
| viewDist | 1.0 | 1.0 | 1.0 |
| mlBand | 0.0 | 1.0 | 1.0 |
| arrowCap | 0.0 | 1.0 | 1.0 |
| capRows | 0.0 | 0.1 | 0.0 |
| ribbonRelayout | 0.0 | 0.1 | 0.0 |
