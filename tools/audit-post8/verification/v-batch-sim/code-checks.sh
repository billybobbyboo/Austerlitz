#!/bin/sh
# v-batch-sim: the code readings behind the verdicts (read-only; run from anywhere). Prints each cited range at HEAD and
# the same code fact counted in the pre-Stage-8 archive build step5c-45f8f662.html (origin) and, where useful, stage8e.
R=/home/user/Austerlitz; A=$R/app.js; S=$R/style.css
p(){ echo "== $1"; sed -n "$2p" "$3" | cut -c1-320; }
p "state#1 setChapter (no stopPlay)" 4193,4208 $A
p "state#1 applyTour (stopPlay)" 4671,4674 $A
p "state#1 the comment: themes stop the clock" 8827,8827 $A
p "state#1 followActive" 8906,8906 $A
p "state#2/interaction#3 rebuildOverlays fade reset" 3113,3114 $A
p "state#2/interaction#3 applyOverlayOpacity" 3180,3186 $A
p "state#2 scene tween fade" 3473,3478 $A
p "state#3 loop: idle return before lastFrame" 9123,9131 $A
p "state#3 input listeners (keydown -> lastInput)" 7098,7100 $A
p "state#3 togglePlay" 8788,8795 $A
p "state#4 knowledgeOf cache" 4133,4152 $A
p "state#4 knowAtClock" 4288,4288 $A
p "state#5 jumpEvent margin" 7596,7606 $A
p "state#6 rail pointer handlers" 7527,7531 $A
p "state#6 rail touch-action" 344,344 $S
p "state#7 lowTier once" 621,622 $A
p "state#7 groundDetail/shadow by lowTier" 646,657 $A
p "state#7 onResize" 7104,7119 $A
p "interaction#1 tipShow placement" 7439,7445 $A
p "interaction#1 tip hoverable" 7470,7471 $A
p "interaction#1 #tltip css" 250,253 $S
p "interaction#2 rail and markers siblings" 313,322 $R/shell.html
p "interaction#2 marker css" 379,391 $S
p "interaction#2 playhead pointer-events none" 350,351 $S
p "interaction#4 readHidden" 4325,4329 $A
p "interaction#4 compact card rows" 7818,7819 $A
p "interaction#4 8A's review" 1684,1685 $R/docs/STAGE8_SPEC.md
p "interaction#5 paintSituation key" 7364,7366 $A
p "interaction#5 stopPlay" 8781,8787 $A
p "interaction#6 sheetOpened" 6755,6755 $A
p "interaction#6 canvas pointermove" 6868,6881 $A
echo "== origin: counts in archive/step5c-45f8f662.html (pre-Stage 8) and archive/stage8e-f3c3f3af.html"
for f in $R/archive/step5c-45f8f662.html $R/archive/stage8e-f3c3f3af.html; do
  echo "$f"
  echo "  outgoing 0.9*ovFadeOut: $(grep -c 'oldMats\[i\].opacity=0.9\*ovFadeOut' $f)"
  echo "  jump margin 1.5: $(grep -c 'ts\[i\]>t+1.5' $f)"
  echo "  knowAtClock per minute: $(grep -c 'function knowAtClock(){ var k=commandView+"|"+Math.floor(clock+1e-9)' $f)"
  echo "  Doing now row: $(grep -c 'row("Doing now"' $f); readHidden: $(grep -c 'function readHidden' $f)"
  echo "  tip above element: $(grep -c 'tp.style.top=Math.round(Math.max(8,r.top-h-8))' $f)"
  echo "  marker hit inset: $(grep -c '.ev-mark::after{content:"";position:absolute;inset:-6px' $f)"
  echo "  rail pointerup only: $(grep -c 'window.addEventListener("pointerup",function(){ dragging=false; });' $f)"
  echo "  lowTier at start: $(grep -c 'lowTier = (window.innerWidth\*window.innerHeight < 900\*700)' $f)"
  echo "  caption key with playing,dw: $(grep -c 'flatFor>=60?1:0,playing?1:0,dw?dw.map' $f)"
  echo "  sheetOpened (no drag end): $(grep -c 'function sheetOpened(id){ var S=SHEETS\[id\]; S.from=focusedEl(); syncInert(); focusTo(\[S.tab\[0\]\]); }' $f)"
done
L=$(grep -n "function setChapter" $R/archive/stage4d-9b13adbf.html | head -1 | cut -d: -f1)
echo "  stage4d setChapter stopPlay count: $(sed -n "${L},$((L+16))p" $R/archive/stage4d-9b13adbf.html | grep -c stopPlay)"
