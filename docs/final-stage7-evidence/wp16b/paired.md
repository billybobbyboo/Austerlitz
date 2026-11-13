# paired session: A (07c186de, 3035557 B), P (084863c7, 3036257 B)

viewport 2560x1305, frame 6.944 ms (144 Hz), blocks per build per motion 4 (palindrome order), frames per block {"play":552,"route":264,"drag":264,"held":168}, warm-up 72; load [3.25,3.31,2.79] -> [3.14,2.97,2.75]

## Start-up in this session (ms; one page each, opened one after another under the machine's load)

| build | DOM ready | first frame | boot overlay gone | main thread quiet | BOOTMS init |
|---|---|---|---|---|---|
| A | 17091 | 8484 | 17470 | 18571 | 5891.1 |
| P | 16711 | 8335 | 16712 | 17064 | 5701.6 |

## play-half

Play at half speed under Follow from 08:30, Watch, the Field vantage (device route play-half, perf-route.js:263-265)

Blocks in order: A 11.03, P 10.19, P 9.91, A 10.67, A 10.50, P 10.40, P 10.36, A 12.00

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs A (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| A | 4 | 10.85 (11.03, 10.67, 10.50, 12.00) | 0.03 | 10.40 | 5.85 | 2.00 | 1.10 | 785 | - |
| P | 4 | 10.27 (10.19, 9.91, 10.40, 10.36) | 0.04 | 9.95 | 5.55 | 1.95 | 1.10 | 785 | -7.4% (-7.6%, -7.1%, -0.9%, -13.7%) |

Counts per frame (load-independent; 144 frames each): GL calls in all A 13201.35, P 12357.35; bytes uploaded by bufferData/bufferSubData A 345498, P 345576; draw calls A 785, P 785

| GL method | A | P | P - A |
|---|---|---|---|
| vertexAttribPointer | 4751.0 | 4329.0 | -422.0 |
| bindBuffer | 3344.2 | 2922.2 | -422.0 |
| uniformMatrix4fv | 808.0 | 808.0 | +0.0 |
| bindVertexArray | 716.1 | 716.1 | +0.0 |
| activeTexture | 668.0 | 668.0 | +0.0 |
| useProgram | 487.0 | 487.0 | +0.0 |
| drawArraysInstanced | 440.0 | 440.0 | +0.0 |
| uniform1iv | 310.0 | 310.0 | +0.0 |
| uniform3fv | 261.0 | 261.0 | +0.0 |
| uniform3f | 219.6 | 219.6 | +0.0 |
| bufferSubData | 171.2 | 171.2 | +0.0 |
| drawElements | 168.0 | 168.0 | +0.0 |
| bindTexture | 143.2 | 143.2 | +0.0 |
| drawElementsInstanced | 129.0 | 129.0 | +0.0 |
| uniformMatrix3fv | 125.6 | 125.6 | +0.0 |
| uniform1f | 115.1 | 115.1 | +0.0 |
| uniform2f | 60.6 | 60.6 | +0.0 |
| drawArrays | 48.1 | 48.1 | +0.0 |
| disable | 47.1 | 47.1 | +0.0 |
| enable | 47.1 | 47.1 | +0.0 |
| uniform4f | 38.0 | 38.0 | +0.0 |
| depthMask | 26.3 | 26.3 | +0.0 |
| clear | 19.0 | 19.0 | +0.0 |
| bindFramebuffer | 12.2 | 12.2 | +0.0 |
| scissor | 9.1 | 9.1 | +0.0 |
| viewport | 8.1 | 8.1 | +0.0 |
| frontFace | 6.0 | 6.0 | +0.0 |
| clearColor | 5.0 | 5.0 | +0.0 |

| app function (calls per frame) | A | P |
|---|---|---|
| groundY | 12607.6 | 12607.6 |
| cullStale | 539.0 | 539.0 |
| cullTest | 539.0 | 539.0 |
| viewH | 265.8 | 265.8 |
| worldPerPx | 251.7 | 251.7 |
| stateAt | 168.2 | 168.2 |
| posNow | 168.0 | 168.0 |
| cullRefresh | 127.1 | 127.1 |
| cullGeo | 127.1 | 127.1 |
| liveStatus | 91.5 | 91.5 |
| height | 83.7 | 83.7 |
| displayHeight | 81.7 | 81.7 |
| mlBandAt | 79.3 | 79.3 |
| marchRate | 63.0 | 63.0 |
| mlFar | 62.3 | 62.3 |
| drawnKnow | 61.5 | 61.5 |
| mlOccluded | 61.0 | 61.0 |
| mlFree | 60.9 | 60.9 |
| leavesOf | 60.0 | 60.0 |
| mlTake | 45.9 | 45.9 |
| mlHoldTry | 44.5 | 44.5 |
| smokeWant | 32.0 | 32.0 |
| poseBlock | 31.0 | 31.0 |
| settleBlock | 31.0 | 31.0 |
| kitLod | 31.0 | 31.0 |
| gaitStep | 31.0 | 31.0 |
| outlinePlace | 31.0 | 31.0 |
| updateTrail | 31.0 | 31.0 |
| onScreen | 31.0 | 31.0 |
| eyeOwnNear | 31.0 | 31.0 |
| confAt | 29.5 | 29.5 |
| faceClock | 29.0 | 29.0 |
| enemyFacing | 29.0 | 29.0 |
| spriteFloor | 26.0 | 26.0 |
| mlFarPlate | 25.3 | 25.3 |
| mlFarRatio | 25.3 | 25.3 |
| groundYFast | 23.0 | 23.0 |
| groundPatch | 15.7 | 15.7 |
| placeStandards | 13.6 | 13.6 |
| aggReading | 8.0 | 8.0 |
| mlPanels | 5.0 | 5.0 |
| mlLegendFit | 5.0 | 5.0 |
| landPanels | 4.0 | 4.0 |
| landFreeRect | 3.0 | 3.0 |
| capRows | 2.5 | 2.5 |
| ribbonRelayout | 2.5 | 2.5 |
| mlPlaceItem | 1.8 | 1.8 |
| mlCollect | 1.0 | 1.0 |
| mlBand | 1.0 | 1.0 |
| mlObstacles | 1.0 | 1.0 |
| smokePlace | 1.0 | 1.0 |
| arrowCap | 1.0 | 1.0 |
| viewDist | 1.0 | 1.0 |
| drawOnArrows | 1.0 | 1.0 |
| toastRelayout | 0.1 | 0.1 |
| freeCentre | 0.0 | 0.0 |
| kitLodSet | 0.0 | 0.0 |
| placeToast | 0.0 | 0.0 |

## overview-held

the Overview vantage, 09:30, Watch, held and drawn every frame (device route overview held, perf-route.js:243-244)

Blocks in order: A 8.49, P 8.05, P 8.00, A 8.49, A 8.61, P 8.09, P 8.21, A 8.07

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs A (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| A | 4 | 8.49 (8.49, 8.49, 8.61, 8.07) | 0.02 | 7.85 | 5.95 | 1.10 | 0.60 | 825 | - |
| P | 4 | 8.07 (8.05, 8.00, 8.09, 8.21) | 0.01 | 7.70 | 5.75 | 1.10 | 0.60 | 825 | -5.5% (-5.2%, -5.7%, -6.1%, +1.8%) |

Counts per frame (load-independent; 144 frames each): GL calls in all A 13218, P 12326; bytes uploaded by bufferData/bufferSubData A 0, P 0; draw calls A 825, P 825

| GL method | A | P | P - A |
|---|---|---|---|
| vertexAttribPointer | 4984.0 | 4538.0 | -446.0 |
| bindBuffer | 3330.0 | 2884.0 | -446.0 |
| uniformMatrix4fv | 830.0 | 830.0 | +0.0 |
| bindVertexArray | 741.0 | 741.0 | +0.0 |
| activeTexture | 696.0 | 696.0 | +0.0 |
| useProgram | 516.0 | 516.0 | +0.0 |
| drawArraysInstanced | 464.0 | 464.0 | +0.0 |
| uniform1iv | 324.0 | 324.0 | +0.0 |
| uniform3fv | 276.0 | 276.0 | +0.0 |
| drawElements | 187.0 | 187.0 | +0.0 |
| bindTexture | 143.0 | 143.0 | +0.0 |
| drawElementsInstanced | 131.0 | 131.0 | +0.0 |
| uniform1f | 129.0 | 129.0 | +0.0 |
| uniformMatrix3fv | 121.0 | 121.0 | +0.0 |
| uniform3f | 76.0 | 76.0 | +0.0 |
| uniform2f | 60.0 | 60.0 | +0.0 |
| disable | 45.0 | 45.0 | +0.0 |
| enable | 45.0 | 45.0 | +0.0 |
| drawArrays | 43.0 | 43.0 | +0.0 |
| depthMask | 22.0 | 22.0 | +0.0 |
| clear | 17.0 | 17.0 | +0.0 |
| bindFramebuffer | 10.0 | 10.0 | +0.0 |
| scissor | 7.0 | 7.0 | +0.0 |
| frontFace | 6.0 | 6.0 | +0.0 |
| viewport | 6.0 | 6.0 | +0.0 |
| clearColor | 3.0 | 3.0 | +0.0 |
| uniform1fv | 2.0 | 2.0 | +0.0 |
| uniform1i | 2.0 | 2.0 | +0.0 |

| app function (calls per frame) | A | P |
|---|---|---|
| groundY | 1209.0 | 1209.0 |
| cullStale | 565.0 | 565.0 |
| cullTest | 565.0 | 565.0 |
| viewH | 221.0 | 221.0 |
| worldPerPx | 214.0 | 214.0 |
| posNow | 117.0 | 117.0 |
| mlFree | 84.0 | 84.0 |
| stateAt | 79.0 | 79.0 |
| liveStatus | 67.0 | 67.0 |
| marchRate | 63.0 | 63.0 |
| leavesOf | 60.0 | 60.0 |
| mlBandAt | 48.0 | 48.0 |
| spriteFloor | 41.0 | 41.0 |
| drawnKnow | 37.0 | 37.0 |
| displayHeight | 32.0 | 32.0 |
| height | 32.0 | 32.0 |
| smokeWant | 32.0 | 32.0 |
| poseBlock | 31.0 | 31.0 |
| settleBlock | 31.0 | 31.0 |
| kitLod | 31.0 | 31.0 |
| gaitStep | 31.0 | 31.0 |
| outlinePlace | 31.0 | 31.0 |
| updateTrail | 31.0 | 31.0 |
| onScreen | 31.0 | 31.0 |
| eyeOwnNear | 31.0 | 31.0 |
| enemyFacing | 29.0 | 29.0 |
| mlFar | 27.0 | 27.0 |
| mlPlaceItem | 26.0 | 26.0 |
| mlOccluded | 26.0 | 26.0 |
| mlTake | 23.0 | 23.0 |
| aggReading | 8.0 | 8.0 |
| mlFarPlate | 5.0 | 5.0 |
| mlFarRatio | 5.0 | 5.0 |
| confAt | 5.0 | 5.0 |
| mlPanels | 4.0 | 4.0 |
| mlLegendFit | 4.0 | 4.0 |
| landPanels | 3.0 | 3.0 |
| landFreeRect | 2.0 | 2.0 |
| mlCollect | 1.0 | 1.0 |
| mlBand | 1.0 | 1.0 |
| mlObstacles | 1.0 | 1.0 |
| smokePlace | 1.0 | 1.0 |
| arrowCap | 1.0 | 1.0 |
| viewDist | 1.0 | 1.0 |

## overview-route

the Overview, 09:30, Watch, orbiting at 20 degrees a second by the route's own camera writes (device route overview orbit, perf-route.js:166-170): decision 268's segment

Blocks in order: A 9.04, P 8.70, P 9.00, A 9.05, A 9.06, P 8.72, P 9.26, A 9.41

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs A (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| A | 4 | 9.06 (9.04, 9.05, 9.06, 9.41) | 0.06 | 8.50 | 6.10 | 1.10 | 0.70 | 827 | - |
| P | 4 | 8.86 (8.70, 9.00, 8.72, 9.26) | 0.05 | 8.30 | 5.90 | 1.10 | 0.70 | 827 | -2.7% (-3.8%, -0.5%, -3.8%, -1.6%) |

Counts per frame (load-independent; 144 frames each): GL calls in all A 13361.12, P 12469.61; bytes uploaded by bufferData/bufferSubData A 363, P 363; draw calls A 827, P 827

| GL method | A | P | P - A |
|---|---|---|---|
| vertexAttribPointer | 4984.0 | 4538.0 | -446.0 |
| bindBuffer | 3330.1 | 2884.1 | -446.0 |
| uniformMatrix4fv | 869.0 | 869.0 | +0.0 |
| bindVertexArray | 743.0 | 743.0 | +0.0 |
| activeTexture | 696.0 | 696.0 | +0.0 |
| useProgram | 517.0 | 517.0 | +0.0 |
| drawArraysInstanced | 464.0 | 464.0 | +0.0 |
| uniform1iv | 324.0 | 324.0 | +0.0 |
| uniform3fv | 276.0 | 276.0 | +0.0 |
| drawElements | 187.0 | 187.0 | +0.0 |
| uniform1f | 143.5 | 144.0 | +0.5 |
| bindTexture | 143.0 | 143.0 | +0.0 |
| uniform3f | 136.0 | 136.0 | +0.0 |
| drawElementsInstanced | 131.0 | 131.0 | +0.0 |
| uniformMatrix3fv | 129.0 | 129.0 | +0.0 |
| uniform2f | 60.0 | 60.0 | +0.0 |
| disable | 45.0 | 45.0 | +0.0 |
| enable | 45.0 | 45.0 | +0.0 |
| drawArrays | 45.0 | 45.0 | +0.0 |
| depthMask | 22.0 | 22.0 | +0.0 |
| clear | 19.0 | 19.0 | +0.0 |
| bindFramebuffer | 12.0 | 12.0 | +0.0 |
| scissor | 9.0 | 9.0 | +0.0 |
| viewport | 8.0 | 8.0 | +0.0 |
| uniform4f | 6.3 | 6.3 | +0.0 |
| frontFace | 6.0 | 6.0 | +0.0 |
| clearColor | 5.0 | 5.0 | +0.0 |
| uniform1fv | 2.0 | 2.0 | +0.0 |

| app function (calls per frame) | A | P |
|---|---|---|
| groundY | 2050.6 | 2050.6 |
| cullStale | 565.0 | 565.0 |
| cullTest | 565.0 | 565.0 |
| viewH | 231.0 | 231.0 |
| worldPerPx | 214.0 | 214.0 |
| posNow | 117.0 | 117.0 |
| mlFree | 108.0 | 108.0 |
| stateAt | 79.0 | 79.0 |
| liveStatus | 67.0 | 67.0 |
| marchRate | 63.0 | 63.0 |
| leavesOf | 60.0 | 60.0 |
| mlBandAt | 48.0 | 48.0 |
| spriteFloor | 41.0 | 41.0 |
| drawnKnow | 37.0 | 37.0 |
| displayHeight | 32.0 | 32.0 |
| height | 32.0 | 32.0 |
| smokeWant | 32.0 | 32.0 |
| poseBlock | 31.0 | 31.0 |
| settleBlock | 31.0 | 31.0 |
| kitLod | 31.0 | 31.0 |
| gaitStep | 31.0 | 31.0 |
| outlinePlace | 31.0 | 31.0 |
| updateTrail | 31.0 | 31.0 |
| onScreen | 31.0 | 31.0 |
| eyeOwnNear | 31.0 | 31.0 |
| enemyFacing | 29.0 | 29.0 |
| mlFar | 27.0 | 27.0 |
| mlPlaceItem | 26.0 | 26.0 |
| mlOccluded | 26.0 | 26.0 |
| mlTake | 22.3 | 22.3 |
| aggReading | 8.0 | 8.0 |
| mlFarPlate | 5.0 | 5.0 |
| mlFarRatio | 5.0 | 5.0 |
| mlPanels | 5.0 | 5.0 |
| mlLegendFit | 5.0 | 5.0 |
| confAt | 5.0 | 5.0 |
| landPanels | 4.0 | 4.0 |
| landFreeRect | 3.0 | 3.0 |
| mlCollect | 1.0 | 1.0 |
| mlBand | 1.0 | 1.0 |
| mlObstacles | 1.0 | 1.0 |
| smokePlace | 1.0 | 1.0 |
| arrowCap | 1.0 | 1.0 |
| viewDist | 1.0 | 1.0 |
| capRows | 0.0 | 0.0 |
| ribbonRelayout | 0.0 | 0.0 |
| groundPatch | 0.0 | 0.0 |

## overview-drag

the Overview, 09:30, Watch, orbiting at 20 degrees a second by a right-button drag through the app's handler (a visitor's orbit)

Blocks in order: A 8.84, P 9.08, P 9.17, A 9.22, A 9.05, P 8.86, P 9.28, A 8.91

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs A (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| A | 4 | 8.98 (8.84, 9.22, 9.05, 8.91) | 0.05 | 8.40 | 6.00 | 1.10 | 0.70 | 827 | - |
| P | 4 | 9.12 (9.08, 9.17, 8.86, 9.28) | 0.02 | 8.35 | 6.00 | 1.10 | 0.70 | 827 | +1.0% (+2.7%, -0.6%, -2.1%, +4.1%) |

Counts per frame (load-independent; 144 frames each): GL calls in all A 13354.63, P 12463.27; bytes uploaded by bufferData/bufferSubData A 363, P 363; draw calls A 827, P 827

| GL method | A | P | P - A |
|---|---|---|---|
| vertexAttribPointer | 4984.0 | 4538.0 | -446.0 |
| bindBuffer | 3330.1 | 2884.1 | -446.0 |
| uniformMatrix4fv | 869.0 | 869.0 | +0.0 |
| bindVertexArray | 743.0 | 743.0 | +0.0 |
| activeTexture | 696.0 | 696.0 | +0.0 |
| useProgram | 517.0 | 517.0 | +0.0 |
| drawArraysInstanced | 464.0 | 464.0 | +0.0 |
| uniform1iv | 324.0 | 324.0 | +0.0 |
| uniform3fv | 276.0 | 276.0 | +0.0 |
| drawElements | 187.0 | 187.0 | +0.0 |
| uniform1f | 143.4 | 144.0 | +0.6 |
| bindTexture | 143.0 | 143.0 | +0.0 |
| uniform3f | 136.0 | 136.0 | +0.0 |
| drawElementsInstanced | 131.0 | 131.0 | +0.0 |
| uniformMatrix3fv | 129.0 | 129.0 | +0.0 |
| uniform2f | 60.0 | 60.0 | +0.0 |
| disable | 45.0 | 45.0 | +0.0 |
| enable | 45.0 | 45.0 | +0.0 |
| drawArrays | 45.0 | 45.0 | +0.0 |
| depthMask | 22.0 | 22.0 | +0.0 |
| clear | 19.0 | 19.0 | +0.0 |
| bindFramebuffer | 12.0 | 12.0 | +0.0 |
| scissor | 9.0 | 9.0 | +0.0 |
| viewport | 8.0 | 8.0 | +0.0 |
| frontFace | 6.0 | 6.0 | +0.0 |
| clearColor | 5.0 | 5.0 | +0.0 |
| uniform1fv | 2.0 | 2.0 | +0.0 |
| uniform1i | 2.0 | 2.0 | +0.0 |

| app function (calls per frame) | A | P |
|---|---|---|
| groundY | 2050.6 | 2050.6 |
| cullStale | 565.0 | 565.0 |
| cullTest | 565.0 | 565.0 |
| viewH | 231.0 | 231.0 |
| worldPerPx | 214.0 | 214.0 |
| posNow | 117.0 | 117.0 |
| stateAt | 79.0 | 79.0 |
| liveStatus | 67.0 | 67.0 |
| marchRate | 63.0 | 63.0 |
| leavesOf | 60.0 | 60.0 |
| mlBandAt | 48.0 | 48.0 |
| spriteFloor | 41.0 | 41.0 |
| drawnKnow | 37.0 | 37.0 |
| displayHeight | 32.0 | 32.0 |
| height | 32.0 | 32.0 |
| smokeWant | 32.0 | 32.0 |
| mlFree | 31.1 | 31.1 |
| poseBlock | 31.0 | 31.0 |
| settleBlock | 31.0 | 31.0 |
| kitLod | 31.0 | 31.0 |
| gaitStep | 31.0 | 31.0 |
| outlinePlace | 31.0 | 31.0 |
| updateTrail | 31.0 | 31.0 |
| onScreen | 31.0 | 31.0 |
| eyeOwnNear | 31.0 | 31.0 |
| enemyFacing | 29.0 | 29.0 |
| mlFar | 27.0 | 27.0 |
| mlOccluded | 26.0 | 26.0 |
| mlTake | 21.0 | 21.0 |
| mlHoldTry | 20.0 | 20.0 |
| aggReading | 8.0 | 8.0 |
| mlFarPlate | 5.0 | 5.0 |
| mlFarRatio | 5.0 | 5.0 |
| mlPanels | 5.0 | 5.0 |
| mlLegendFit | 5.0 | 5.0 |
| confAt | 5.0 | 5.0 |
| landPanels | 4.0 | 4.0 |
| landFreeRect | 3.0 | 3.0 |
| mlPlaceItem | 1.2 | 1.2 |
| mlCollect | 1.0 | 1.0 |
| mlBand | 1.0 | 1.0 |
| mlObstacles | 1.0 | 1.0 |
| smokePlace | 1.0 | 1.0 |
| arrowCap | 1.0 | 1.0 |
| viewDist | 1.0 | 1.0 |
| capRows | 0.0 | 0.0 |
| ribbonRelayout | 0.0 | 0.0 |
| groundPatch | 0.0 | 0.0 |

## ph8-drag

phase 8, 14:40, the Overview, Watch, orbiting by a right-button drag (the task's motion; device route ph8-overview orbits by camera writes)

Blocks in order: A 8.88, P 8.89, P 8.66, A 8.87, A 8.88, P 9.20, P 8.96, A 9.18

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs A (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| A | 4 | 8.88 (8.88, 8.87, 8.88, 9.18) | 0.05 | 8.30 | 5.90 | 1.10 | 0.60 | 801 | - |
| P | 4 | 8.93 (8.89, 8.66, 9.20, 8.96) | 0.05 | 8.30 | 5.90 | 1.20 | 0.60 | 801 | -1.1% (+0.1%, -2.3%, +3.6%, -2.3%) |

Counts per frame (load-independent; 144 frames each): GL calls in all A 12995.79, P 12123.48; bytes uploaded by bufferData/bufferSubData A 295, P 295; draw calls A 801, P 801

| GL method | A | P | P - A |
|---|---|---|---|
| vertexAttribPointer | 4879.0 | 4443.0 | -436.0 |
| bindBuffer | 3259.2 | 2823.2 | -436.0 |
| uniformMatrix4fv | 828.0 | 828.0 | +0.0 |
| bindVertexArray | 728.2 | 728.2 | +0.0 |
| activeTexture | 682.0 | 682.0 | +0.0 |
| useProgram | 490.0 | 490.0 | +0.0 |
| drawArraysInstanced | 454.0 | 454.0 | +0.0 |
| uniform1iv | 317.0 | 317.0 | +0.0 |
| uniform3fv | 265.0 | 265.0 | +0.0 |
| drawElements | 176.2 | 176.2 | +0.0 |
| bindTexture | 140.0 | 140.0 | +0.0 |
| uniform3f | 130.8 | 130.8 | +0.0 |
| drawElementsInstanced | 129.0 | 129.0 | +0.0 |
| uniformMatrix3fv | 129.0 | 129.0 | +0.0 |
| uniform1f | 110.4 | 110.1 | -0.3 |
| uniform2f | 58.8 | 58.8 | +0.0 |
| disable | 45.0 | 45.0 | +0.0 |
| enable | 45.0 | 45.0 | +0.0 |
| drawArrays | 42.0 | 42.0 | +0.0 |
| depthMask | 22.0 | 22.0 | +0.0 |
| clear | 19.0 | 19.0 | +0.0 |
| bindFramebuffer | 12.0 | 12.0 | +0.0 |
| scissor | 9.0 | 9.0 | +0.0 |
| viewport | 8.0 | 8.0 | +0.0 |
| frontFace | 6.0 | 6.0 | +0.0 |
| clearColor | 5.0 | 5.0 | +0.0 |
| uniform1fv | 2.0 | 2.0 | +0.0 |
| uniform1i | 2.0 | 2.0 | +0.0 |

| app function (calls per frame) | A | P |
|---|---|---|
| groundY | 1826.3 | 1826.3 |
| cullStale | 553.0 | 553.0 |
| cullTest | 553.0 | 553.0 |
| viewH | 229.2 | 229.2 |
| worldPerPx | 213.2 | 213.2 |
| stateAt | 82.0 | 82.0 |
| liveStatus | 69.0 | 69.0 |
| marchRate | 64.0 | 64.0 |
| posNow | 61.0 | 61.0 |
| leavesOf | 60.0 | 60.0 |
| mlBandAt | 48.0 | 48.0 |
| drawnKnow | 37.0 | 37.0 |
| poseBlock | 32.0 | 32.0 |
| settleBlock | 32.0 | 32.0 |
| kitLod | 32.0 | 32.0 |
| gaitStep | 32.0 | 32.0 |
| outlinePlace | 32.0 | 32.0 |
| displayHeight | 32.0 | 32.0 |
| height | 32.0 | 32.0 |
| smokeWant | 32.0 | 32.0 |
| updateTrail | 32.0 | 32.0 |
| spriteFloor | 32.0 | 32.0 |
| onScreen | 32.0 | 32.0 |
| eyeOwnNear | 32.0 | 32.0 |
| enemyFacing | 30.0 | 30.0 |
| mlFree | 28.9 | 28.9 |
| mlFar | 24.2 | 24.2 |
| mlOccluded | 23.2 | 23.2 |
| mlTake | 18.7 | 18.7 |
| mlHoldTry | 17.6 | 17.6 |
| aggReading | 8.0 | 8.0 |
| mlPanels | 5.0 | 5.0 |
| mlLegendFit | 5.0 | 5.0 |
| confAt | 5.0 | 5.0 |
| mlFarPlate | 4.0 | 4.0 |
| mlFarRatio | 4.0 | 4.0 |
| landPanels | 4.0 | 4.0 |
| landFreeRect | 3.0 | 3.0 |
| mlPlaceItem | 1.2 | 1.2 |
| mlCollect | 1.0 | 1.0 |
| mlBand | 1.0 | 1.0 |
| mlObstacles | 1.0 | 1.0 |
| smokePlace | 1.0 | 1.0 |
| arrowCap | 1.0 | 1.0 |
| viewDist | 1.0 | 1.0 |
| capRows | 0.0 | 0.0 |
| ribbonRelayout | 0.0 | 0.0 |
| groundPatch | 0.0 | 0.0 |
