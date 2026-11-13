# paired session: A (07c186de, 3035557 B), P (084863c7, 3036257 B)

viewport 2560x1305, frame 6.944 ms (144 Hz), blocks per build per motion 6 (palindrome order), frames per block {"play":552,"route":264,"drag":264,"held":168}, warm-up 72; load [4.15,3.71,3.77] -> [2.59,3.33,3.62]

## Start-up in this session (ms; one page each, opened one after another under the machine's load)

| build | DOM ready | first frame | boot overlay gone | main thread quiet | BOOTMS init |
|---|---|---|---|---|---|
| A | 16659 | 8198 | 17040 | 18449 | 5709.6 |
| P | 17183 | 8505 | 17185 | 18593 | 5917.7 |

## overview-drag

the Overview, 09:30, Watch, orbiting at 20 degrees a second by a right-button drag through the app's handler (a visitor's orbit)

Blocks in order: A 9.12, P 8.23, P 8.49, A 9.92, A 9.24, P 8.52, P 7.87, A 11.24, A 9.52, P 8.32, P 8.72, A 8.28

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs A (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| A | 6 | 9.38 (9.12, 9.92, 9.24, 11.24, 9.52, 8.28) | 0.06 | 8.50 | 5.80 | 1.10 | 0.70 | 827 | - |
| P | 6 | 8.40 (8.23, 8.49, 8.52, 7.87, 8.32, 8.72) | 0.06 | 7.60 | 5.25 | 1.10 | 0.70 | 827 | -11.2% (-9.7%, -14.4%, -7.8%, -30.0%, -12.6%, +5.4%) |

Counts per frame (load-independent; 144 frames each): GL calls in all A 13354.78, P 12462.82; bytes uploaded by bufferData/bufferSubData A 154, P 154; draw calls A 827, P 827

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
| uniform1f | 143.5 | 143.6 | +0.0 |
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

Blocks in order: A 8.96, P 8.90, P 8.16, A 8.98, A 9.29, P 8.34, P 8.54, A 8.83, A 8.92, P 8.32, P 8.43, A 9.30

| build | blocks | CPU/frame median (blocks) | wait/frame | loop p50 | three.render p50 | updateVisibility p50 | mlLayout p50 | calls | CPU vs A (adjacent blocks: median, range) |
|---|---|---|---|---|---|---|---|---|---|
| A | 6 | 8.97 (8.96, 8.98, 9.29, 8.83, 8.92, 9.30) | 0.04 | 8.30 | 5.90 | 1.20 | 0.60 | 801 | - |
| P | 6 | 8.39 (8.90, 8.16, 8.34, 8.54, 8.32, 8.43) | 0.04 | 7.85 | 5.60 | 1.10 | 0.60 | 801 | -8.0% (-0.7%, -9.2%, -10.2%, -3.3%, -6.7%, -9.3%) |

Counts per frame (load-independent; 144 frames each): GL calls in all A 12994.77, P 12123.03; bytes uploaded by bufferData/bufferSubData A 175, P 175; draw calls A 801, P 801

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
| uniform1f | 109.4 | 109.6 | +0.3 |
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
