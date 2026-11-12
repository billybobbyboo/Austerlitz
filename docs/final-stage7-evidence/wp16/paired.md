# paired session: A (eabe076a, 3028969 B), C3 (bf835e42, 3029780 B), C2 (fd7bfa42, 3029752 B)

viewport 2560x1305, frame 6.944 ms (144 Hz), blocks per build per motion 4 (palindrome order), frames per block {"play":552,"route":264,"drag":264,"held":168}, warm-up 72; load [3.36,3.34,3.32] -> [2.28,2.49,2.87]

## Start-up in this session (ms; one page each, opened one after another under the machine's load)

| build | DOM ready | first frame | boot overlay gone | main thread quiet | BOOTMS init |
|---|---|---|---|---|---|
| A | 16004 | 7464 | 16006 | 17334 | 5075 |
| C3 | 16139 | 7562 | 16140 | 17279 | 4959.3 |
| C2 | 17654 | 8381 | 18011 | 19504 | 5737.1 |

## play-half

Play at half speed under Follow from 08:30, Watch, the Field vantage (device route play-half, perf-route.js:263-265)

Blocks in order: A 22.33, C3 17.00, C2 13.81, C2 13.92, C3 16.84, A 19.21, A 17.95, C3 14.91, C2 13.03, C2 17.41, C3 17.77, A 18.43

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs A (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| A | 4 | 18.82 (22.33, 19.21, 17.95, 18.43) | 0.03 | 17.50 | 8.75 | 3.30 | 1.20 | 785 | - |
| C3 | 4 | 16.92 (17.00, 16.84, 14.91, 17.77) | 0.04 | 16.15 | 7.00 | 3.45 | 1.20 | 785 | -14.6% (-23.9%, -12.4%, -16.9%, -3.6%) |
| C2 | 4 | 13.86 (13.81, 13.92, 13.03, 17.41) | 0.03 | 13.25 | 8.40 | 2.05 | 1.15 | 785 | -27.5% (-38.2%, -27.6%, -27.4%, -5.5%) |

Counts per frame (load-independent; 144 frames each): GL calls in all A 13193.35, C3 13201.35, C2 13193.35; bytes uploaded by bufferData/bufferSubData A 345498, C3 345498, C2 345498; draw calls A 785, C3 785, C2 785

| GL method | A | C3 | C2 | C3 - A | C2 - A |
|---|---|---|---|---|---|
| vertexAttribPointer | 4751.0 | 4751.0 | 4751.0 | +0.0 | +0.0 |
| bindBuffer | 3344.2 | 3344.2 | 3344.2 | +0.0 | +0.0 |
| uniformMatrix4fv | 802.0 | 808.0 | 802.0 | +6.0 | +0.0 |
| bindVertexArray | 716.1 | 716.1 | 716.1 | +0.0 | +0.0 |
| activeTexture | 668.0 | 668.0 | 668.0 | +0.0 | +0.0 |
| useProgram | 485.0 | 487.0 | 485.0 | +2.0 | +0.0 |
| drawArraysInstanced | 440.0 | 440.0 | 440.0 | +0.0 | +0.0 |
| uniform1iv | 310.0 | 310.0 | 310.0 | +0.0 | +0.0 |
| uniform3fv | 261.0 | 261.0 | 261.0 | +0.0 | +0.0 |
| uniform3f | 219.6 | 219.6 | 219.6 | +0.0 | +0.0 |
| bufferSubData | 171.2 | 171.2 | 171.2 | +0.0 | +0.0 |
| drawElements | 168.0 | 168.0 | 168.0 | +0.0 | +0.0 |
| bindTexture | 143.2 | 143.2 | 143.2 | +0.0 | +0.0 |
| drawElementsInstanced | 129.0 | 129.0 | 129.0 | +0.0 | +0.0 |
| uniformMatrix3fv | 125.6 | 125.6 | 125.6 | +0.0 | +0.0 |
| uniform1f | 115.1 | 115.1 | 115.1 | +0.0 | +0.0 |
| uniform2f | 60.6 | 60.6 | 60.6 | +0.0 | +0.0 |
| drawArrays | 48.1 | 48.1 | 48.1 | +0.0 | +0.0 |
| disable | 47.1 | 47.1 | 47.1 | +0.0 | +0.0 |
| enable | 47.1 | 47.1 | 47.1 | +0.0 | +0.0 |
| uniform4f | 38.0 | 38.0 | 38.0 | +0.0 | +0.0 |
| depthMask | 26.3 | 26.3 | 26.3 | +0.0 | +0.0 |
| clear | 19.0 | 19.0 | 19.0 | +0.0 | +0.0 |
| bindFramebuffer | 12.2 | 12.2 | 12.2 | +0.0 | +0.0 |
| scissor | 9.1 | 9.1 | 9.1 | +0.0 | +0.0 |
| viewport | 8.1 | 8.1 | 8.1 | +0.0 | +0.0 |
| frontFace | 6.0 | 6.0 | 6.0 | +0.0 | +0.0 |
| clearColor | 5.0 | 5.0 | 5.0 | +0.0 | +0.0 |

| app function (calls per frame) | A | C3 | C2 |
|---|---|---|---|
| groundY | 12607.6 | 12607.6 | 12607.6 |
| cullStale | 539.0 | 539.0 | 539.0 |
| cullTest | 539.0 | 539.0 | 539.0 |
| viewH | 265.8 | 265.8 | 265.8 |
| worldPerPx | 251.7 | 251.7 | 251.7 |
| stateAt | 168.2 | 168.2 | 168.2 |
| posNow | 168.0 | 168.0 | 168.0 |
| cullRefresh | 127.1 | 127.1 | 127.1 |
| cullGeo | 127.1 | 127.1 | 127.1 |
| liveStatus | 91.5 | 91.5 | 91.5 |
| height | 83.7 | 83.7 | 83.7 |
| displayHeight | 81.7 | 81.7 | 81.7 |
| mlBandAt | 79.3 | 79.3 | 79.3 |
| marchRate | 63.0 | 63.0 | 63.0 |
| mlFar | 62.3 | 62.3 | 62.3 |
| drawnKnow | 61.5 | 61.5 | 61.5 |
| mlOccluded | 61.0 | 61.0 | 61.0 |
| mlFree | 60.9 | 60.9 | 60.9 |
| leavesOf | 60.0 | 60.0 | 60.0 |
| mlTake | 45.9 | 45.9 | 45.9 |
| mlHoldTry | 44.5 | 44.5 | 44.5 |
| smokeWant | 32.0 | 32.0 | 32.0 |
| poseBlock | 31.0 | 31.0 | 31.0 |
| settleBlock | 31.0 | 31.0 | 31.0 |
| kitLod | 31.0 | 31.0 | 31.0 |
| gaitStep | 31.0 | 31.0 | 31.0 |
| outlinePlace | 31.0 | 31.0 | 31.0 |
| updateTrail | 31.0 | 31.0 | 31.0 |
| onScreen | 31.0 | 31.0 | 31.0 |
| eyeOwnNear | 31.0 | 31.0 | 31.0 |
| confAt | 29.5 | 29.5 | 29.5 |
| faceClock | 29.0 | 29.0 | 29.0 |
| enemyFacing | 29.0 | 29.0 | 29.0 |
| spriteFloor | 26.0 | 26.0 | 26.0 |
| mlFarPlate | 25.3 | 25.3 | 25.3 |
| mlFarRatio | 25.3 | 25.3 | 25.3 |
| groundYFast | 23.0 | 23.0 | 23.0 |
| groundPatch | 15.7 | 15.7 | 15.7 |
| placeStandards | 13.6 | 13.6 | 13.6 |
| aggReading | 8.0 | 8.0 | 8.0 |
| mlPanels | 5.0 | 5.0 | 5.0 |
| mlLegendFit | 5.0 | 5.0 | 5.0 |
| landPanels | 4.0 | 4.0 | 4.0 |
| landFreeRect | 3.0 | 3.0 | 3.0 |
| capRows | 2.5 | 2.5 | 2.5 |
| ribbonRelayout | 2.5 | 2.5 | 2.5 |
| mlPlaceItem | 1.8 | 1.8 | 1.8 |
| mlCollect | 1.0 | 1.0 | 1.0 |
| mlBand | 1.0 | 1.0 | 1.0 |
| mlObstacles | 1.0 | 1.0 | 1.0 |
| smokePlace | 1.0 | 1.0 | 1.0 |
| arrowCap | 1.0 | 1.0 | 1.0 |
| viewDist | 1.0 | 1.0 | 1.0 |
| drawOnArrows | 1.0 | 1.0 | 1.0 |
| toastRelayout | 0.1 | 0.1 | 0.1 |
| freeCentre | 0.0 | 0.0 | 0.0 |
| kitLodSet | 0.0 | 0.0 | 0.0 |

## overview-held

the Overview vantage, 09:30, Watch, held and drawn every frame (device route overview held, perf-route.js:243-244)

Blocks in order: A 15.42, C3 14.91, C2 11.29, C2 11.14, C3 12.28, A 15.05, A 13.54, C3 12.63, C2 11.13, C2 11.75, C3 12.17, A 15.23

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs A (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| A | 4 | 15.14 (15.42, 15.05, 13.54, 15.23) | 0.01 | 14.25 | 8.95 | 2.70 | 0.70 | 825 | - |
| C3 | 4 | 12.45 (14.91, 12.28, 12.63, 12.17) | 0.01 | 11.60 | 6.75 | 2.50 | 0.60 | 825 | -12.6% (-3.3%, -18.4%, -6.8%, -20.1%) |
| C2 | 4 | 11.21 (11.29, 11.14, 11.13, 11.75) | 0.02 | 10.45 | 8.45 | 1.20 | 0.60 | 825 | -24.4% (-26.8%, -26.0%, -17.8%, -22.9%) |

Counts per frame (load-independent; 144 frames each): GL calls in all A 13181, C3 13218, C2 13181; bytes uploaded by bufferData/bufferSubData A 0, C3 0, C2 0; draw calls A 825, C3 825, C2 825

| GL method | A | C3 | C2 | C3 - A | C2 - A |
|---|---|---|---|---|---|
| vertexAttribPointer | 4984.0 | 4984.0 | 4984.0 | +0.0 | +0.0 |
| bindBuffer | 3330.0 | 3330.0 | 3330.0 | +0.0 | +0.0 |
| uniformMatrix4fv | 816.0 | 830.0 | 816.0 | +14.0 | +0.0 |
| bindVertexArray | 741.0 | 741.0 | 741.0 | +0.0 | +0.0 |
| activeTexture | 696.0 | 696.0 | 696.0 | +0.0 | +0.0 |
| useProgram | 509.0 | 516.0 | 509.0 | +7.0 | +0.0 |
| drawArraysInstanced | 464.0 | 464.0 | 464.0 | +0.0 | +0.0 |
| uniform1iv | 324.0 | 324.0 | 324.0 | +0.0 | +0.0 |
| uniform3fv | 276.0 | 276.0 | 276.0 | +0.0 | +0.0 |
| drawElements | 187.0 | 187.0 | 187.0 | +0.0 | +0.0 |
| bindTexture | 143.0 | 143.0 | 143.0 | +0.0 | +0.0 |
| drawElementsInstanced | 131.0 | 131.0 | 131.0 | +0.0 | +0.0 |
| uniform1f | 113.0 | 129.0 | 113.0 | +16.0 | +0.0 |
| uniformMatrix3fv | 121.0 | 121.0 | 121.0 | +0.0 | +0.0 |
| uniform3f | 76.0 | 76.0 | 76.0 | +0.0 | +0.0 |
| uniform2f | 60.0 | 60.0 | 60.0 | +0.0 | +0.0 |
| disable | 45.0 | 45.0 | 45.0 | +0.0 | +0.0 |
| enable | 45.0 | 45.0 | 45.0 | +0.0 | +0.0 |
| drawArrays | 43.0 | 43.0 | 43.0 | +0.0 | +0.0 |
| depthMask | 22.0 | 22.0 | 22.0 | +0.0 | +0.0 |
| clear | 17.0 | 17.0 | 17.0 | +0.0 | +0.0 |
| bindFramebuffer | 10.0 | 10.0 | 10.0 | +0.0 | +0.0 |
| scissor | 7.0 | 7.0 | 7.0 | +0.0 | +0.0 |
| frontFace | 6.0 | 6.0 | 6.0 | +0.0 | +0.0 |
| viewport | 6.0 | 6.0 | 6.0 | +0.0 | +0.0 |
| clearColor | 3.0 | 3.0 | 3.0 | +0.0 | +0.0 |
| uniform1fv | 2.0 | 2.0 | 2.0 | +0.0 | +0.0 |
| uniform1i | 2.0 | 2.0 | 2.0 | +0.0 | +0.0 |

| app function (calls per frame) | A | C3 | C2 |
|---|---|---|---|
| groundY | 1209.0 | 1209.0 | 1209.0 |
| cullStale | 565.0 | 565.0 | 565.0 |
| cullTest | 565.0 | 565.0 | 565.0 |
| viewH | 221.0 | 221.0 | 221.0 |
| worldPerPx | 214.0 | 214.0 | 214.0 |
| posNow | 117.0 | 117.0 | 117.0 |
| mlFree | 84.0 | 84.0 | 84.0 |
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
| mlTake | 23.0 | 23.0 | 23.0 |
| aggReading | 8.0 | 8.0 | 8.0 |
| mlFarPlate | 5.0 | 5.0 | 5.0 |
| mlFarRatio | 5.0 | 5.0 | 5.0 |
| confAt | 5.0 | 5.0 | 5.0 |
| mlPanels | 4.0 | 4.0 | 4.0 |
| mlLegendFit | 4.0 | 4.0 | 4.0 |
| landPanels | 3.0 | 3.0 | 3.0 |
| landFreeRect | 2.0 | 2.0 | 2.0 |
| mlCollect | 1.0 | 1.0 | 1.0 |
| mlBand | 1.0 | 1.0 | 1.0 |
| mlObstacles | 1.0 | 1.0 | 1.0 |
| smokePlace | 1.0 | 1.0 | 1.0 |
| arrowCap | 1.0 | 1.0 | 1.0 |
| viewDist | 1.0 | 1.0 | 1.0 |

## overview-route

the Overview, 09:30, Watch, orbiting at 20 degrees a second by the route's own camera writes (device route overview orbit, perf-route.js:166-170): decision 268's segment

Blocks in order: A 16.75, C3 14.78, C2 13.38, C2 11.60, C3 13.79, A 16.55, A 17.04, C3 14.63, C2 11.53, C2 12.75, C3 14.73, A 17.21

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs A (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| A | 4 | 16.89 (16.75, 16.55, 17.04, 17.21) | 0.05 | 16.00 | 9.10 | 2.55 | 0.80 | 827 | - |
| C3 | 4 | 14.68 (14.78, 13.79, 14.63, 14.73) | 0.03 | 13.40 | 6.90 | 2.40 | 0.75 | 827 | -14.3% (-11.7%, -16.7%, -14.2%, -14.4%) |
| C2 | 4 | 12.18 (13.38, 11.60, 11.53, 12.75) | 0.03 | 11.30 | 8.65 | 1.20 | 0.75 | 827 | -27.9% (-20.1%, -29.9%, -32.4%, -25.9%) |

Counts per frame (load-independent; 144 frames each): GL calls in all A 13322.13, C3 13361.15, C2 13322.42; bytes uploaded by bufferData/bufferSubData A 363, C3 363, C2 363; draw calls A 827, C3 827, C2 827

| GL method | A | C3 | C2 | C3 - A | C2 - A |
|---|---|---|---|---|---|
| vertexAttribPointer | 4984.0 | 4984.0 | 4984.0 | +0.0 | +0.0 |
| bindBuffer | 3330.1 | 3330.1 | 3330.1 | +0.0 | +0.0 |
| uniformMatrix4fv | 853.0 | 869.0 | 853.0 | +16.0 | +0.0 |
| bindVertexArray | 743.0 | 743.0 | 743.0 | +0.0 | +0.0 |
| activeTexture | 696.0 | 696.0 | 696.0 | +0.0 | +0.0 |
| useProgram | 510.0 | 517.0 | 510.0 | +7.0 | +0.0 |
| drawArraysInstanced | 464.0 | 464.0 | 464.0 | +0.0 | +0.0 |
| uniform1iv | 324.0 | 324.0 | 324.0 | +0.0 | +0.0 |
| uniform3fv | 276.0 | 276.0 | 276.0 | +0.0 | +0.0 |
| drawElements | 187.0 | 187.0 | 187.0 | +0.0 | +0.0 |
| uniform1f | 127.5 | 143.6 | 127.8 | +16.0 | +0.3 |
| bindTexture | 143.0 | 143.0 | 143.0 | +0.0 | +0.0 |
| uniform3f | 136.0 | 136.0 | 136.0 | +0.0 | +0.0 |
| drawElementsInstanced | 131.0 | 131.0 | 131.0 | +0.0 | +0.0 |
| uniformMatrix3fv | 129.0 | 129.0 | 129.0 | +0.0 | +0.0 |
| uniform2f | 60.0 | 60.0 | 60.0 | +0.0 | +0.0 |
| disable | 45.0 | 45.0 | 45.0 | +0.0 | +0.0 |
| enable | 45.0 | 45.0 | 45.0 | +0.0 | +0.0 |
| drawArrays | 45.0 | 45.0 | 45.0 | +0.0 | +0.0 |
| depthMask | 22.0 | 22.0 | 22.0 | +0.0 | +0.0 |
| clear | 19.0 | 19.0 | 19.0 | +0.0 | +0.0 |
| bindFramebuffer | 12.0 | 12.0 | 12.0 | +0.0 | +0.0 |
| scissor | 9.0 | 9.0 | 9.0 | +0.0 | +0.0 |
| viewport | 8.0 | 8.0 | 8.0 | +0.0 | +0.0 |
| uniform4f | 6.3 | 6.3 | 6.3 | +0.0 | +0.0 |
| frontFace | 6.0 | 6.0 | 6.0 | +0.0 | +0.0 |
| clearColor | 5.0 | 5.0 | 5.0 | +0.0 | +0.0 |
| uniform1fv | 2.0 | 2.0 | 2.0 | +0.0 | +0.0 |

| app function (calls per frame) | A | C3 | C2 |
|---|---|---|---|
| groundY | 2050.6 | 2050.6 | 2050.6 |
| cullStale | 565.0 | 565.0 | 565.0 |
| cullTest | 565.0 | 565.0 | 565.0 |
| viewH | 231.0 | 231.0 | 231.0 |
| worldPerPx | 214.0 | 214.0 | 214.0 |
| posNow | 117.0 | 117.0 | 117.0 |
| mlFree | 108.0 | 108.0 | 108.0 |
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
| mlTake | 22.3 | 22.3 | 22.3 |
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
| capRows | 0.0 | 0.0 | 0.0 |
| ribbonRelayout | 0.0 | 0.0 | 0.0 |
| groundPatch | 0.0 | 0.0 | 0.0 |

## overview-drag

the Overview, 09:30, Watch, orbiting at 20 degrees a second by a right-button drag through the app's handler (a visitor's orbit)

Blocks in order: A 17.90, C3 15.81, C2 12.74, C2 11.92, C3 14.66, A 18.68, A 18.13, C3 14.66, C2 12.94, C2 12.02, C3 13.81, A 16.18

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs A (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| A | 4 | 18.02 (17.90, 18.68, 18.13, 16.18) | 0.02 | 16.85 | 9.50 | 2.65 | 0.80 | 827 | - |
| C3 | 4 | 14.66 (15.81, 14.66, 14.66, 13.81) | 0.05 | 13.80 | 7.15 | 2.50 | 0.75 | 827 | -16.9% (-11.7%, -21.5%, -19.1%, -14.6%) |
| C2 | 4 | 12.38 (12.74, 11.92, 12.94, 12.02) | 0.06 | 11.50 | 8.85 | 1.25 | 0.70 | 827 | -28.7% (-28.8%, -36.2%, -28.6%, -25.7%) |

Counts per frame (load-independent; 144 frames each): GL calls in all A 13315.72, C3 13354.75, C2 13315.96; bytes uploaded by bufferData/bufferSubData A 363, C3 363, C2 363; draw calls A 827, C3 827, C2 827

| GL method | A | C3 | C2 | C3 - A | C2 - A |
|---|---|---|---|---|---|
| vertexAttribPointer | 4984.0 | 4984.0 | 4984.0 | +0.0 | +0.0 |
| bindBuffer | 3330.1 | 3330.1 | 3330.1 | +0.0 | +0.0 |
| uniformMatrix4fv | 853.0 | 869.0 | 853.0 | +16.0 | +0.0 |
| bindVertexArray | 743.0 | 743.0 | 743.0 | +0.0 | +0.0 |
| activeTexture | 696.0 | 696.0 | 696.0 | +0.0 | +0.0 |
| useProgram | 510.0 | 517.0 | 510.0 | +7.0 | +0.0 |
| drawArraysInstanced | 464.0 | 464.0 | 464.0 | +0.0 | +0.0 |
| uniform1iv | 324.0 | 324.0 | 324.0 | +0.0 | +0.0 |
| uniform3fv | 276.0 | 276.0 | 276.0 | +0.0 | +0.0 |
| drawElements | 187.0 | 187.0 | 187.0 | +0.0 | +0.0 |
| uniform1f | 127.5 | 143.5 | 127.7 | +16.0 | +0.2 |
| bindTexture | 143.0 | 143.0 | 143.0 | +0.0 | +0.0 |
| uniform3f | 136.0 | 136.0 | 136.0 | +0.0 | +0.0 |
| drawElementsInstanced | 131.0 | 131.0 | 131.0 | +0.0 | +0.0 |
| uniformMatrix3fv | 129.0 | 129.0 | 129.0 | +0.0 | +0.0 |
| uniform2f | 60.0 | 60.0 | 60.0 | +0.0 | +0.0 |
| disable | 45.0 | 45.0 | 45.0 | +0.0 | +0.0 |
| enable | 45.0 | 45.0 | 45.0 | +0.0 | +0.0 |
| drawArrays | 45.0 | 45.0 | 45.0 | +0.0 | +0.0 |
| depthMask | 22.0 | 22.0 | 22.0 | +0.0 | +0.0 |
| clear | 19.0 | 19.0 | 19.0 | +0.0 | +0.0 |
| bindFramebuffer | 12.0 | 12.0 | 12.0 | +0.0 | +0.0 |
| scissor | 9.0 | 9.0 | 9.0 | +0.0 | +0.0 |
| viewport | 8.0 | 8.0 | 8.0 | +0.0 | +0.0 |
| frontFace | 6.0 | 6.0 | 6.0 | +0.0 | +0.0 |
| clearColor | 5.0 | 5.0 | 5.0 | +0.0 | +0.0 |
| uniform1fv | 2.0 | 2.0 | 2.0 | +0.0 | +0.0 |
| uniform1i | 2.0 | 2.0 | 2.0 | +0.0 | +0.0 |

| app function (calls per frame) | A | C3 | C2 |
|---|---|---|---|
| groundY | 2050.6 | 2050.6 | 2050.6 |
| cullStale | 565.0 | 565.0 | 565.0 |
| cullTest | 565.0 | 565.0 | 565.0 |
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
| mlFree | 31.1 | 31.1 | 31.1 |
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
| mlOccluded | 26.0 | 26.0 | 26.0 |
| mlTake | 21.0 | 21.0 | 21.0 |
| mlHoldTry | 20.0 | 20.0 | 20.0 |
| aggReading | 8.0 | 8.0 | 8.0 |
| mlFarPlate | 5.0 | 5.0 | 5.0 |
| mlFarRatio | 5.0 | 5.0 | 5.0 |
| mlPanels | 5.0 | 5.0 | 5.0 |
| mlLegendFit | 5.0 | 5.0 | 5.0 |
| confAt | 5.0 | 5.0 | 5.0 |
| landPanels | 4.0 | 4.0 | 4.0 |
| landFreeRect | 3.0 | 3.0 | 3.0 |
| mlPlaceItem | 1.2 | 1.2 | 1.2 |
| mlCollect | 1.0 | 1.0 | 1.0 |
| mlBand | 1.0 | 1.0 | 1.0 |
| mlObstacles | 1.0 | 1.0 | 1.0 |
| smokePlace | 1.0 | 1.0 | 1.0 |
| arrowCap | 1.0 | 1.0 | 1.0 |
| viewDist | 1.0 | 1.0 | 1.0 |
| capRows | 0.0 | 0.0 | 0.0 |
| ribbonRelayout | 0.0 | 0.0 | 0.0 |
| groundPatch | 0.0 | 0.0 | 0.0 |

## ph8-drag

phase 8, 14:40, the Overview, Watch, orbiting by a right-button drag (the task's motion; device route ph8-overview orbits by camera writes)

Blocks in order: A 15.59, C3 13.31, C2 11.04, C2 10.93, C3 12.97, A 14.25, A 15.07, C3 13.00, C2 11.49, C2 10.81, C3 12.99, A 15.91

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs A (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| A | 4 | 15.33 (15.59, 14.25, 15.07, 15.91) | 0.04 | 14.75 | 8.20 | 2.45 | 0.65 | 801 | - |
| C3 | 4 | 12.99 (13.31, 12.97, 13.00, 12.99) | 0.02 | 12.60 | 6.30 | 2.40 | 0.60 | 801 | -14.2% (-14.6%, -8.9%, -13.8%, -18.4%) |
| C2 | 4 | 10.98 (11.04, 10.93, 11.49, 10.81) | 0.06 | 10.45 | 7.85 | 1.20 | 0.60 | 801 | -26.5% (-29.2%, -23.3%, -23.8%, -32.1%) |

Counts per frame (load-independent; 144 frames each): GL calls in all A 12986.87, C3 12995.85, C2 12985.96; bytes uploaded by bufferData/bufferSubData A 295, C3 295, C2 295; draw calls A 801, C3 801, C2 801

| GL method | A | C3 | C2 | C3 - A | C2 - A |
|---|---|---|---|---|---|
| vertexAttribPointer | 4879.0 | 4879.0 | 4879.0 | +0.0 | +0.0 |
| bindBuffer | 3259.2 | 3259.2 | 3259.2 | +0.0 | +0.0 |
| uniformMatrix4fv | 822.0 | 828.0 | 822.0 | +6.0 | +0.0 |
| bindVertexArray | 728.2 | 728.2 | 728.2 | +0.0 | +0.0 |
| activeTexture | 682.0 | 682.0 | 682.0 | +0.0 | +0.0 |
| useProgram | 487.0 | 490.0 | 487.0 | +3.0 | +0.0 |
| drawArraysInstanced | 454.0 | 454.0 | 454.0 | +0.0 | +0.0 |
| uniform1iv | 317.0 | 317.0 | 317.0 | +0.0 | +0.0 |
| uniform3fv | 265.0 | 265.0 | 265.0 | +0.0 | +0.0 |
| drawElements | 176.2 | 176.2 | 176.2 | +0.0 | +0.0 |
| bindTexture | 140.0 | 140.0 | 140.0 | +0.0 | +0.0 |
| uniform3f | 130.8 | 130.8 | 130.8 | +0.0 | +0.0 |
| drawElementsInstanced | 129.0 | 129.0 | 129.0 | +0.0 | +0.0 |
| uniformMatrix3fv | 129.0 | 129.0 | 129.0 | +0.0 | +0.0 |
| uniform1f | 110.5 | 110.5 | 109.6 | -0.0 | -0.9 |
| uniform2f | 58.8 | 58.8 | 58.8 | +0.0 | +0.0 |
| disable | 45.0 | 45.0 | 45.0 | +0.0 | +0.0 |
| enable | 45.0 | 45.0 | 45.0 | +0.0 | +0.0 |
| drawArrays | 42.0 | 42.0 | 42.0 | +0.0 | +0.0 |
| depthMask | 22.0 | 22.0 | 22.0 | +0.0 | +0.0 |
| clear | 19.0 | 19.0 | 19.0 | +0.0 | +0.0 |
| bindFramebuffer | 12.0 | 12.0 | 12.0 | +0.0 | +0.0 |
| scissor | 9.0 | 9.0 | 9.0 | +0.0 | +0.0 |
| viewport | 8.0 | 8.0 | 8.0 | +0.0 | +0.0 |
| frontFace | 6.0 | 6.0 | 6.0 | +0.0 | +0.0 |
| clearColor | 5.0 | 5.0 | 5.0 | +0.0 | +0.0 |
| uniform1fv | 2.0 | 2.0 | 2.0 | +0.0 | +0.0 |
| uniform1i | 2.0 | 2.0 | 2.0 | +0.0 | +0.0 |

| app function (calls per frame) | A | C3 | C2 |
|---|---|---|---|
| groundY | 1826.3 | 1826.3 | 1826.3 |
| cullStale | 553.0 | 553.0 | 553.0 |
| cullTest | 553.0 | 553.0 | 553.0 |
| viewH | 229.2 | 229.2 | 229.2 |
| worldPerPx | 213.2 | 213.2 | 213.2 |
| stateAt | 82.0 | 82.0 | 82.0 |
| liveStatus | 69.0 | 69.0 | 69.0 |
| marchRate | 64.0 | 64.0 | 64.0 |
| posNow | 61.0 | 61.0 | 61.0 |
| leavesOf | 60.0 | 60.0 | 60.0 |
| mlBandAt | 48.0 | 48.0 | 48.0 |
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
| mlFree | 28.9 | 28.9 | 28.9 |
| mlFar | 24.2 | 24.2 | 24.2 |
| mlOccluded | 23.2 | 23.2 | 23.2 |
| mlTake | 18.7 | 18.7 | 18.7 |
| mlHoldTry | 17.6 | 17.6 | 17.6 |
| aggReading | 8.0 | 8.0 | 8.0 |
| mlPanels | 5.0 | 5.0 | 5.0 |
| mlLegendFit | 5.0 | 5.0 | 5.0 |
| confAt | 5.0 | 5.0 | 5.0 |
| mlFarPlate | 4.0 | 4.0 | 4.0 |
| mlFarRatio | 4.0 | 4.0 | 4.0 |
| landPanels | 4.0 | 4.0 | 4.0 |
| landFreeRect | 3.0 | 3.0 | 3.0 |
| mlPlaceItem | 1.2 | 1.2 | 1.2 |
| mlCollect | 1.0 | 1.0 | 1.0 |
| mlBand | 1.0 | 1.0 | 1.0 |
| mlObstacles | 1.0 | 1.0 | 1.0 |
| smokePlace | 1.0 | 1.0 | 1.0 |
| arrowCap | 1.0 | 1.0 | 1.0 |
| viewDist | 1.0 | 1.0 | 1.0 |
| capRows | 0.0 | 0.0 | 0.0 |
| ribbonRelayout | 0.0 | 0.0 | 0.0 |
| groundPatch | 0.0 | 0.0 | 0.0 |
