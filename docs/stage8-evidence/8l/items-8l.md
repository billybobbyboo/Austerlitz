# The motion block's counts item by item: stage8j-7d5594ba.html against austerlitz-command-map.html

Made by `tools/stage8/items-8l.js` (Chromium 141.0.7390.37). The 16's totals: jumps 238 to 248, pops 985 to 998; 61 items changed their counts in 13 of the 16 runs.

| run | jumps | pops | formations drawn of in view | longest hidden (ms) | items changed |
|---|---|---|---|---|---|
| hybrid-pan | 5 to 5 | 55 to 65 | 1376/2053 to 1427/2053 | 2467 to 2467 | 21 |
| hybrid-zoom | 26 to 28 | 115 to 116 | 1371/2242 to 1342/2248 | 1533 to 2133 | 27 |
| hybrid-orbit | 8 to 10 | 148 to 139 | 1487/2548 to 1537/2548 | 2200 to 1900 | 22 |
| hybrid-glide | 16 to 14 | 78 to 77 | 1227/1804 to 1157/1795 | 2533 to 2533 | 20 |
| hybrid-play | 8 to 8 | 108 to 98 | 2153/3388 to 2033/3388 | 3100 to 4033 | 19 |
| paper-pan | 0 to 0 | 5 to 2 | 1240/1274 to 1274/1274 | 667 to 0 | 4 |
| paper-zoom | 8 to 10 | 92 to 105 | 850/1229 to 795/1232 | 667 to 667 | 18 |
| paper-glide | 5 to 11 | 43 to 46 | 566/821 to 554/822 | 633 to 633 | 15 |
| paper-play | 5 to 5 | 30 to 30 | 1570/1694 to 1581/1694 | 667 to 667 | 2 |
| land-pan | 12 to 12 | 33 to 36 | 1879/2055 to 1868/2055 | 1133 to 1133 | 7 |
| land-zoom | 29 to 26 | 65 to 77 | 1714/2252 to 1641/2258 | 667 to 667 | 11 |
| land-orbit | 39 to 42 | 77 to 77 | 1965/2366 to 1981/2366 | 667 to 667 | 13 |
| land-play | 21 to 21 | 74 to 68 | 2630/3146 to 2667/3146 | 667 to 667 | 8 |
| low-pan | 6 to 6 | 10 to 10 | 820/885 to 820/885 | 533 to 533 | 0 |
| low-orbit | 16 to 16 | 29 to 29 | 681/876 to 681/876 | 633 to 633 | 0 |
| low-zoom | 34 to 34 | 23 to 23 | 505/633 to 505/633 | 633 to 633 | 0 |

Net change by item over the 16 (jumps, pops), the largest first:

- `c:rg_inf`: +0, -12
- `n:caffarelli`: -5, +5
- `o:Caffarelli`: -3, +6
- `o:Pratzeberg`: +5, -4
- `o:Bagration`: +2, +6
- `t:austerlitz`: -3, -5
- `c:rivaud`: +1, -6
- `c:lich`: -2, +5
- `o:Levasseur up the Goldbach`: -3, +3
- `o:Stare Vinohrady`: +2, -4
- `c:col4`: +0, -6
- `t:litava`: +3, -2
- `c:vandamme`: +0, +5
- `t:goldbach`: -1, +4
- `o:Suchet`: +2, +3
- `o:Jurczek's Austrians`: +2, -3
- `t:santon`: +0, -5
- `t:pratzen`: +0, +5
- `c:constantine`: +0, +5
- `n:milo`: -1, -4

The hybrid view's Play on the second build: the formations hidden longest (frame by frame: # drawn, r hidden with room for the full search, h hidden without, t behind the ground, o off the screen, L out of the layer):

```
nansouty      121 hrrrrrrrrrrrrrrrrrrrhhhhhhhhrrrrrrrrrrrrhhhhhhhhhhhhhhhhrrrrrrrrrrrrrrhhhhhhhhhhhhhhhrrrrrhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
walther       121 hrrhhhrrrrrhhhhhhhhhhhhhhhhhrrrrrrrrrrrrhhhhhhhhhhhhrrrrrrrrrrrrrrrrrrhhhhhhhhhhhhhhhrrrrrrhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
milo          121 hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhrrrrrrrhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
kellermann    101 ####################hhhhhhhhhrrrrrrrrrrrhhhhhhhhhhhhhhhhhhrrrrrrrrrrrrhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
```

Its re-placement passes (each: the items that came back, those that left):

- frame 17 (hold): back none; left c:prz
- frame 27 (hold): back t:telnitz, c:sthilaire, c:legrand, c:friant, c:dhautpoul, c:c_gren, c:kienmayer, c:lich, c:bag, o:Saint-Hilaire; left c:suchet, c:kellermann, c:rivaud, c:rg_cav, o:Vandamme, o:Friant retakes Telnitz
- frame 37 (hold): back t:pratzen, c:bourcier, c:lang, c:prz; left t:telnitz, c:legrand
- frame 47 (hold): back p:plateau, c:sthilaire, c:vandamme, c:caffarelli, c:suchet, c:rivaud, o:Saint-Hilaire, o:Vandamme, o:Friant retakes Telnitz; left c:friant, o:Stare Vinohrady
- frame 57 (hold): back c:legrand, c:prz; left none
- frame 67 (hold): back c:sthilaire, c:friant, c:rg_inf, o:Vandamme, o:Stare Vinohrady; left o:Saint-Hilaire
- frame 77 (hold): back c:vandamme, c:caffarelli, c:drouet, c:guard_cav, o:Friant retakes Telnitz; left c:rivaud
- frame 87 (hold): back t:pratzen, c:ahq, c:dok, c:lang, o:Saint-Hilaire; left p:plateau, t:augezd, c:vandamme, c:rg_inf, o:Friant retakes Telnitz
- frame 97 (hold): back c:sthilaire, c:rivaud; left none
