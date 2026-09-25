# Visual and UX audit (the working roadmap)

Written against the verified correction-pass build (md5 `672aff9f…`), before Stage 0. Stage 0 has
since fixed high-impact problem 1 (rendering faults), the first-run text and card overlap (parts of
problems 2 and 3), the worst label collisions (interim, part of 4), the Watch-mode selection and the
dossier units (medium items), and added the performance baseline. See `CHANGELOG.md` for what was done
and verified. Everything else below stands as the plan. Figures quoted here are as audited then.

## The short answer

What a first-time visitor meets: a near-black 04:00 field behind five overlapping surfaces (rail,
dispatch card, first-run card on top of it, legend, a four-row timeline), and a first sentence ("Amber
is the Russian and Austrian army") that the screen contradicts with green and white troops. At
1600x900 over half the viewport is interface. The natural first move is to orbit; you can't pan, and
the dramatic low angles are where rendering broke (black hillsides, men in the air, rectangular smoke).
For a project whose claim is rigour, visible rendering errors invite "if the men float, why trust the
numbers?"

What would make it distinctive is already built, mostly out of sight: every position graded, every
figure marked as record, reconstruction or derived; a fog-of-war view from line of sight; the plans set
against what happened; the plateau emptying before a shot is fired at it. The next phases should
(1) remove trust-breaking faults, (2) settle a visual language that can carry the evidence layer, and
(3) bring that layer, plus the fog and the low winter sun, into the default view.

## High-impact problems

**1. Rendering faults that break trust.** (Fixed in Stage 0.) The grade applied contrast about 0.5 in
linear light, clipping shaded slopes to black; figure seating was written unscaled and untilted and
refreshed only after 1.5 units of movement; the camera had no ground clamp; smoke and dust textures had
puffs cut by the canvas edge (translucent cards); flat mist sheets sliced into rising ground; the 10.3x
relief amplified all of it.

**2. Colour contradicts itself and carries too many meanings.** The key is given three ways (first-run
card, legend, tour stop 1). Status pills use blue for "steady" and orange for "active" (so a French corps
attacking wears the Allied hue); claim pills use green for Fact and amber for Estimate; the UI accent,
the "decision" event gold and the Allied amber are nearly one hue; there are at least eight French blues
in the code. Counters' dashed/dotted frames (confidence B/C) mean "planned/suspect" in APP-6, and green
frames read as neutral. *Change:* a one-page encoding spec: side then nation owns hue; status gets an icon
and a neutral tone; evidence (fact / estimate / reconstruction, A/B/C, derived) gets one non-hue channel;
the UI accent leaves the amber axis. The Allied colour is a decision for the owner (amber for symbology
with nation secondary is recommended). *When:* Stage 1 (the first-run text was fixed in Stage 0).

**3. The first screen.** Dark 04:00 field; rail, dispatch card, first-run card, legend and a ~145 px
four-row timebar over it; the default rail tab is the order of battle (reference, not story); no single
next action among tour, Play, 10 phases, 5 acts, 25 event diamonds, 10 analysis moments, 5 vantages,
3 presentations. *Change:* interim first-run arrangement (done in Stage 0); later a short skippable
opening built only from tested tour text. *When:* Stage 7.

**4. Labels and counters pile up.** Event labels, the plateau statistic and counters were exempt from
decluttering; counters are fixed at about 90-105 px tall regardless of zoom, each with echelon, glyph,
designation, strength, name and status pill. *Change:* move counters and labels to a DOM/SVG overlay laid
out by priority with collisions, leader lines and occlusion fading; compact counters by default, expanded
on hover, selection or close zoom. Gains: crisp text, far less texture memory, hover, and keyboard and
screen-reader access to formations. *When:* Stage 2 (interim priority placement done in Stage 0).

**5. The ground misrepresents the ground.** The fixed 10.3x exaggeration turns 5-7 degree slopes into
40-50 degrees (the Pratzeberg reads as a cone); land cover is assigned per 81 m triangle (sawtooth
boundaries); the Satschan and Menitz meres are perfect ellipses; roads and streams float on a different
triangulation. *Change:* vertical exaggeration as a presentation parameter (one display factor applied
in the ground mesh and one `groundY()` helper; `height()`, viewshed and line of sight untouched; offer 1x,
about 3-4x and the current value); a cover texture blended in the shader; draped roads and streams; mere
outlines traced from a georeferenced historical survey, schematic until then. *When:* decide in Stage 1,
implement in Stage 2; research the meres now.

**6. Five parallel structures, and "Map" means four things.** The day is told as 10 phases, 5 acts,
25 events, 10 analysis moments (not the same ten) and 8 tour stops; "Map" is a presentation mode, the
layers popover, the paper ground style and the M key. *Change:* one time spine (acts, phases, events);
analysis becomes themes; the tour a path through the same moments; rename modes (Study / Watch / Clean;
Landscape / Paper map / Both; Layers); one timeline track of about 90 px with act bands, phase ticks and
event markers. *When:* Stage 3.

**7. Exploration is orbit-only.** No pan, zoom-to-cursor, double-click focus, damping or keyboard camera;
the free-camera rule is invisible; panels cover the orbit target. *Change:* map-style controls (drag
pans, right-drag orbits, zoom toward the cursor, double-click focus, terrain-aware floor), a visible
"Follow the action" toggle, and `camera.setViewOffset` so the focus stays centred in the unobstructed area.
*When:* Stage 3 (ground clamp done in Stage 0).

**8. The staff map is neither a map nor a landscape.** It recolours the tilted, exaggerated 3D model,
hides roofs so villages become crates, keeps tube arrows, shows all counters at full size. *Change:* a
real map: top-down, true north up (`GEOREF.NORTH`), hillshade and contours, flat village footprints and
water, ground-draped arrows (the Plans overlay's `planRibbon` already does this), compact counters.
*When:* Stage 2.

**9. Uncertainty is invisible in the default view.** The legend promises dashed approximate positions,
but dashes exist only on counters, which only appear in paper and hybrid modes. *When:* Stage 5, with an
interim ground ring styled by grade earlier.

## High-impact opportunities

**1. Make the evidence layer the signature.** Render confidence spatially (crisp footprint A, soft
frontage B, diffuse zone C); an "evidence skeleton" toggle (graded anchors joined by thin interpolated
legs); interval events drawn as bars on the timeline; the Command view promoted to a "Whose eyes?"
control combining the knowledge model, the viewshed and the valley fog (always labelled as a model
reading); ordered routes as ghosts behind columns; a day-track map in each dossier. Needs Stages 1-2.

**2. Let the documented weather and light do the dramatic work.** Compute the sun: at 49.14 N on
2 December the declination is about -22 degrees, so it rises around 07:40-07:50 local solar time and
never climbs above about 19 degrees (derived; the clock basis of the sources is itself uncertain by
minutes). The old presets put the midday sun about 30 degrees up, showed a disc from 07:00 and stepped
the light at phase boundaries. A continuous, clock-driven sun gives raking light all day. Height fog in
the valley bottoms, lifting on the timing the narrative gives (documented versus modelled marked);
soft-particle smoke tied to engagement; ice on the meres; a horizon ring. Stage 4.

**3. Historical appearance, evidence first, identity decoupled from coat colour.** French dragoons and
chasseurs a cheval wore green; the Chevalier Guard wore white; coats cannot carry nationality once
uniforms are accurate. Likely anachronisms to research before changing (not verified): French colours
drawn as vertical tricolours (the 1804 lozenge pattern is the usual reconstruction for 1805; vertical
bands from 1812); every figure in a shako (French line infantry of 1805 are usually shown in the bicorne;
the shako from 1806); the Austrian flag design (white, gold border, black disc) matches no pattern
identified. Keep the changelog's open questions open until sourced. Stage 6.

**4. Pacing and direction.** At 1x the whole day plays in 84 s and the Pratzen assault in 4.5 s. Slower
default, automatic dwell at each event, a follow camera, arrows that draw on with the clock. Do not
animate losses (the model plots formations, not casualties) or suggest mass drowning at the meres.

**5. Derive movement arrows from the formation tracks.** The per-phase `OVERLAYS` are hand-authored,
separately from the tracks, and no test binds them. Generate movement arrows from track legs; keep only
interpretive arrows hand-authored and flagged. Stage 2, with a test.

## Medium-impact improvements
- Legend rebuilt from the encoding spec, contextual (only what is on screen).
- Dock the dispatch narrative in the rail as a first "Now" tab instead of floating it over the map.
- Picking: a formation registers only within 34 px of its centre; use its footprint; add hover and cursor.
- Shortcuts documented only in the legend footer; add a "?" overlay.
- Figure level of detail: swap distant figures for simple blocks.
- Scale: one man is 1.5 units (about 95 m of ground), houses about 90-160 m wide, flagpoles about 330 m,
  while frontages are true to scale. Deliberate miniature or not, it needs one stated convention.
- Faint text (#5C666E on #0C1116, about 3.2:1) fails WCAG AA at 9-11 px.
- Colour tokens shared between CSS and JS.

## Low-impact polish
- Previous/next event glyphs reversed from convention; native title tooltips on event diamonds.
- Scale bar valid only at the screen centre in perspective; say so.
- Compass rose at 60% opacity; serif fallbacks differ by OS (consider one embedded open serif).
- Chimneys stay visible in paper mode.

## Things that should not change
GEOREF as the only scale authority; the leaf rule; the claim/grade/layer taxonomy and "derived"
labelling; the dossier structure and its progressive disclosure; the narrative voice and attributions;
formation modelling (battalions, column-to-line, skirmishers, limbering, dipping standards); continuous
clock-driven positions and the march-rate audit; the Command view, Plans, plateau and centre-separation
readings; the restrained dark UI with serif narrative; reduced-motion support, ARIA states, the keyboard
time slider; the single-file, framework-free build on three.js r128; bare winter trees, frost on
north-facing slopes, crop strips.

## Staged plan, ordered by dependency
- **Stage 0, baseline and trust.** Done (see CHANGELOG.md).
- **Stage 1, visual language.** Decisions: the Allied symbology colour; default display exaggeration
  and whether it is adjustable; whether the miniature scale is deliberate; whether the paper map becomes
  a true north-up map. Output a `docs/VISUAL_SPEC.md`: encoding table, colour tokens, type scale, label
  hierarchy, symbol scales, uncertainty encoding; implement the tokens.
- **Stage 2, map readability.** DOM/SVG counters and labels; draped arrows derived from tracks (with a
  test); cover texture; display exaggeration; true paper map; legend; mere outlines only once sourced.
  The correction-pass suites should be recovered before this stage.
- **Stage 3, navigation and structure.** Camera controls, follow toggle, docked panels, one time spine,
  one timeline, mode names, help overlay.
- **Stage 4, time and atmosphere.** Ephemeris sun and continuous light (replacing Stage 0's temporary
  shadow toe and re-assessing its narrowed landscape hillshade), valley fog, smoke, ice, horizon, pacing.
- **Stage 5, evidence made visible.** Spatial confidence, evidence skeleton, interval events, "Whose
  eyes?" with eye-level views from the command posts (needs Stage 2's true-scale relief), plan ghosts,
  day-tracks.
- **Stage 6, historical appearance.** Uniforms, headgear, flags, each with a source and a grade.
- **Stage 7, first run and opening sequence.**
