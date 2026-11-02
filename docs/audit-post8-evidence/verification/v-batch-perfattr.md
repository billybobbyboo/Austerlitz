# v-batch-perfattr: verification of the perf-attribution findings

Audited build `f10fe585c46aea576f436ed51ac46f83` (2,810,630 B); L3 build `c9d29c149b613bff059598e4fe8c8d03` (both md5-checked in
`<scratch>/perf-attribution/`). Method: code reading at HEAD (`app.js`, `node_modules/three/build/three.js` r128, the same code the page
loads minified from cdnjs), re-reading the area's evidence (`docs/audit-post8-evidence/perf-attribution/{summary.md,paired.md,pages/*.json}`),
and one new bounded probe per build.

## The probe (new evidence)

`tools/audit-post8/verification/v-batch-perfattr/probe.js` reuses the area's own page and set-up (`pa-lib.js` `openVisitor` with its draw
stub, `setup("play-half")`: 08:30, Watch, the Field vantage, Follow, Play at half speed, 2560 x 1305, effects, shadow, factor 4, culling on) and
its frame driver (`runMotion`, kind play, 1000/144 ms a frame). Per drawn frame (`renderFrameNow` wrapped) it classifies every
`renderer.renderBufferDirect` (instanced or not; the sun's shadow camera or not; the program's ACTIVE attributes, which r128's
`setupVertexAttributes` binds with one `bindBuffer` and one `vertexAttribPointer` each, instanceMatrix 4 pointers and 1 bind; among them
`aPart`/`aPh`/`aSl`) and counts every material's `customProgramCacheKey` call (r128 `getParameters` calls it once per `getProgram`,
three.js:13219; the prototype's and 538 own ones wrapped). Conditions: **A** as built; **B** every light's layers also enabling layer 1
(`LAYER_LABEL`, app.js:3519), page-local, nothing written to a source file; alternated A/B. Commands (load average 0.4-2.5 on 4 cores, the
machine nearly idle):

```
node tools/audit-post8/verification/v-batch-perfattr/probe.js <scratch>/perf-attribution/build-f10fe585.html docs/audit-post8-evidence/verification/v-batch-perfattr/probe-now.json
PROBE_REPS=4 PROBE_N=48 node .../probe.js <scratch>/perf-attribution/build-f10fe585.html .../probe-now-4x48.json
PROBE_REPS=2 PROBE_N=24 node .../probe.js <scratch>/perf-attribution/build-c9d29c14.html .../probe-L3.json
node tools/audit-post8/verification/v-batch-perfattr/summarise.js ...   (-> v-batch-perfattr/summary.txt)
```

| build, run | draws | instanced (shadow/main) | kit instanced (shadow) | kit attrs bound | instanced VAP (model) | GL vertexAttribPointer | GL bindBuffer | getProgram a frame |
|---|---|---|---|---|---|---|---|---|
| L3, A (4 runs agree) | 789-791 | 572 (272/300) | 0 | 0 | 3,493 | 3,493 | 2,099 | **313** (all MeshStandardMaterial) |
| L3, B | 791 | 572 | 0 | 0 | 3,493 | 3,493 | 2,099 | **0** |
| now, A (6 runs, A1-A3 of both files) | 800-802 | 581 (276/305) | 430 (215) | **1,290** | 4,846 | 4,846 | 3,429-3,435 | **318** (103 MeshStandard, 215 MeshStandard with the anim hook) |
| now, B (6 runs) | 802 | 581 | 430 (215) | 1,290 | 4,846 | 4,846 | 3,420-3,432 | **0** |

(A4/B4 of the 4x48 file ran into the 08:45 dwell, 833/801 draws: same pattern, 326 and 0.) Timing (container, stubbed draws, not device
numbers): A minus B in adjacent runs, loop median per frame: 4.5, 14.4, 13.1 (probe-now); 7.6, 2.4, 10.5, -1.5, 2.1, 12.3, -0.9 (4x48);
6.6, -4.1, 2.8 ms (L3); 10 of 13 pairs positive, median 4.5 ms; three.render medians A 11.4-18.3 against B 9.3-10.8 ms in the now build.
Noisy (the A runs vary 21.6-34.9 ms), so the size is not established here; see finding 2 for a bound from the device.

## perf-attribution #0: WEAKENED

Claim: decision 268 (a)'s desktop script excess is mostly three.js re-binding 8D/8E's three extra kit attributes on every instanced draw, plus
Stage 8's per-frame app work.

- Mechanism CONFIRMED by code and by per-draw count: three r128 forces `updateBuffers=true` for every InstancedMesh even with a VAO
  (three.js:10682-10684) and re-binds each active attribute (three.js:10857-10914: `bindBuffer` + `vertexAttribPointer` per attribute). Per
  frame in play-half the kit is 430 instanced draws (215 main, 215 shadow: the hook is on the material and its own depth material,
  app.js:1896-1902), each binding aPart, aPh and aSl: **1,290 = 3 x 430** extra pointers and binds, measured, against the area's "about 450"
  (paired.md: +1,353 vertexAttribPointer, +1,332 bindBuffer now - L3; the remaining +63/+42 from 9 more instanced draws). Every
  `vertexAttribPointer` of a frame comes from instanced re-binding (model = GL count to 0.6, both builds). Origin: aPart in 8D `4cb72b1`
  (kitMerge, app.js:1108), aPh/aSl in 8E `62f5cd2` (kitWrap, app.js:1243-1249), by `git log -S`. Ref app.js:12866 is the self-test's
  own test geometry (`hLeg`), not production code.
- "Mostly" NOT supported for the time: the profile functions of attribute set-up (summary.md, L3 -> now) `setup` +0.48, `bindBuffer` +0.58,
  `vertexAttribPointer` +0.47 (+ `bindVertexArray` +0.19) are **+1.53 (+1.72) of the +9.69 ms profiled Play rise, 16-18%**; drag +1.18
  (+1.51) of +8.74, 13-17%; route +0.84 (+0.89) of +4.32, 19-21%. Stage 8's app subsystems are about +3.1 (32%) in Play. That leaves
  about +2.7 ms of three.js JS growth in Play unattributed (minified `(anonymous)` 1.60 -> 2.81, `renderBufferDirect` +0.21,
  `updateMatrixWorld` +0.21, `It` +0.23; plausibly the +218 `useProgram` switches' refresh work: uniformMatrix4fv +76, uniform3f +43,
  uniform2f +56 a frame, not isolated). The re-binding is most of the GL-call growth (2,580 of +3,175 calls, 81%), not most of the time.
- Severity S3, priority P4, category accepted-compromise (decision 268 (a)) and origin agreed. Remedy: packing aPh (float, per instance) into
  aSl (vec2, per instance) is feasible (app.js:1364-1368, 1879) and would save 2 x 430 calls a frame; aPart (per vertex) has no "spare
  component": colour's fourth would turn on r128's `vertexAlphas` (USE_COLOR_ALPHA), so that half of the remedy is not straightforward.

## perf-attribution #1: CONFIRMED

- Code: `freeRect` app.js:4925-4943 scans `floor(W/8) x floor(H/8)` cells (320 x 163 = 52,160 at 2560 x 1305), each against the panel list
  until one covers it, and allocates `[s0,hh]` (321 x 163 = 52,323 arrays a call). Callers per frame: `placeLights`' key (app.js:347, every
  frame), `shadowReceivers` (app.js:321, when that key changes: every moving frame), `smokePlace` (app.js:6075, when puffs are wanted).
  paired.md: `landFreeRect` 3 a frame in play-half, route, drag and ph8-drag, **2 in overview-held** (the eye still, the key unchanged), in
  L3 and now alike (inherited; the calls are in the step-4 tree, `git log -S` 0a19964, before Stage 8).
- Profile: freeRect self now 3.80-6.53 ms profiled (5 motions, summary.md); in L3's two round-1 drags freeRect's self is exactly 0 and the
  inlined `viewport` (app.js:637, `vp()` app.js:4902) carries exactly freeRect's inclusive time (4.92/4.93 and 8.71/8.72 ms;
  pages/page-1-L3.json `callers`: `vp < freeRect < placeLights|landFreeRect|smokePlace`): the same work under inlining, so freeRect is the
  largest app function in every profile, both builds.
- Remedy feasible and in the app's own idiom: `syncViewOffset` already forms the viewport+panels key every frame (`VOFF.key`,
  app.js:6364-6365) and MAPCAM has `panelsKey` (app.js:4959). Key on the exact rectangles, not rounded ones (freeRect compares unrounded
  edges against the 8 px grid). Impact estimate (inference, uniform scaling): freeRect's profiled 6.53 (Play) and 6.19 ms (route), divided by
  the profiling inflation (1.63, 1.78) and the container/desktop ratio (3.2, 3.4), is about 1.3 and 1.0 ms a frame on the desktop:
  comparable to decision 268's +1.5/+1.1 ms, not clearly "more than" it. S4/P2 optional-improvement, inherited: agreed.

## perf-attribution #2: CONFIRMED, cause now established

- Code: the only per-frame path into `getProgramCacheKey` is `setProgram`'s `needsProgramChange` -> `getProgram` (three.js:18186-18215,
  18075-18083); the app never calls `renderer.compile` and sets no material `needsUpdate` per frame (grep of app.js).
- Cause (new): `renderFX` draws the scene twice a frame, the world with `camera.layers.set(LAYER_WORLD)` (app.js:3714-3719) and the
  labels with `camera.layers.set(LAYER_LABEL)` (app.js:3757-3761). The three lights are on layer 0 only (`layers=1` mask, read in the page);
  r128 pushes a light only if `object.layers.test(camera.layers)` (three.js projectObject, 17954-17966), and both renders share one render
  state (`renderStates.get(scene, renderStateStack.length)`, three.js:17877, 13922-13940). So the label pass sets up zero lights, the lights
  hash changes and `state.version` is bumped (three.js:13791-13814), twice a frame; every lit material drawn in the next world pass then fails
  `lightsStateVersion` (three.js:18188-18190) and goes through `getProgram`: getParameters, getProgramCacheKey, the lights' uniform wiring and
  `seqWithValue` (three.js:18095-18150), a cache hit every time.
- Measured: **313 getProgram calls a frame in L3, 318 now** (every MeshStandardMaterial drawn in the world pass: 103 + 215 kit materials);
  with the lights also on layer 1, **0 a frame**, in all 7 B runs, both builds, returning to 313/318 in every A run. Inherited (L3 has it; the
  label pass predates Stage 8, `git log -S` at the history's first commit 18e014b, 2 October 2026), not part of Stage 8's rise (313 -> 318).
- Size: in this container A - B is noisy (loop median 4.5 ms of about 22-24 ms over 13 adjacent pairs, range -4.1 to +14.4); on the desktop
  it is bounded by the effects-off orbit (no label pass): 4.0 against 4.8 ms in L3, 5.1 against 5.8/5.9 now (docs/STAGE8_SPEC.md:5559-5560),
  so at most about 0.7-0.8 ms a frame there, the post passes and the label pass's traversal included (inference).
- Remedy (not tested for pixels): put the three lights on both layers AND keep the label pass from re-rendering the shadow map (with the
  lights visible and `sun.castShadow`, r128's `WebGLShadowMap.render` runs in the label pass, three.js:14116-14119, clearing `sun.shadow.map`,
  which the self-test reads after a frame, app.js:13238), e.g. `renderer.shadowMap.autoUpdate=false` around it. The label objects are sprites
  (app.js:3094, 3998, 4534), unlit, so no visible change is expected.
- Corrections: category untested -> optional-improvement (cause established, fix small); priority P4 -> P3 (a likely 0.5-0.8 ms a frame on
  the desktop, roughly half of decision 268's excess, inherited); severity S4 kept.

## Not checked

The remedies themselves (pixel identity, device timings); 8D's build; the phone; GPU time; what the minified three.js `(anonymous)` growth in
finding 0 is (the area's CPU profiles were not kept); the A/B saving's exact size (container noise).
