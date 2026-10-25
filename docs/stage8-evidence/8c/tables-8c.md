| motion | jumps | pops | level-of-detail switches | flickers | formations drawn while in view | longest hidden by the layout | back after room (most) |
|---|---|---|---|---|---|---|---|
| `hybrid-pan` | 131 / 5 | 39 / 55 | 23 / 23 | 8 / 0 | 78% / 67% | 2,033 / 2,467 ms | 0 / 667 ms |
| `hybrid-zoom` | 334 / 27 | 95 / 116 | 24 / 24 | 23 / 4 | 85% / 61% | 1,533 / 1,533 ms | 0 / 633 ms |
| `hybrid-orbit` | 508 / 7 | 117 / 145 | 0 / 0 | 31 / 0 | 85% / 58% | 1,300 / 2,200 ms | 0 / 667 ms |
| `hybrid-glide` | 359 / 16 | 122 / 79 | 12 / 12 | 40 / 1 | 86% / 68% | 2,533 / 2,533 ms | 0 / 633 ms |
| `hybrid-play` | 237 / 10 | 76 / 109 | 2 / 2 | 16 / 2 | 76% / 62% | 4,033 / 3,100 ms | 0 / 667 ms |
| `paper-pan` | 12 / 0 | 2 / 5 | 0 / 0 | 0 / 0 | 100% / 97% | 0 / 667 ms | 0 / 667 ms |
| `paper-zoom` | 314 / 8 | 20 / 92 | 0 / 0 | 14 / 2 | 100% / 69% | 0 / 667 ms | 0 / 667 ms |
| `paper-glide` | 288 / 5 | 21 / 43 | 27 / 27 | 9 / 0 | 100% / 69% | 0 / 633 ms | 0 / 633 ms |
| `paper-play` | 113 / 5 | 6 / 30 | 2 / 2 | 1 / 0 | 100% / 93% | 0 / 667 ms | 0 / 667 ms |
| `land-pan` | 113 / 12 | 6 / 34 | 2 / 2 | 1 / 0 | 100% / 91% | 0 / 1,133 ms | 0 / 567 ms |
| `land-zoom` | 233 / 32 | 27 / 63 | 30 / 30 | 8 / 1 | 100% / 77% | 0 / 667 ms | 0 / 667 ms |
| `land-orbit` | 408 / 40 | 49 / 78 | 0 / 0 | 12 / 0 | 100% / 83% | 0 / 667 ms | 0 / 667 ms |
| `land-play` | 208 / 22 | 21 / 74 | 2 / 2 | 3 / 0 | 100% / 83% | 0 / 667 ms | 0 / 667 ms |
| `low-pan` | 18 / 6 | 3 / 10 | 0 / 0 | 0 / 0 | 100% / 93% | 0 / 533 ms | 0 / 533 ms |
| `low-orbit` | 74 / 16 | 13 / 29 | 0 / 0 | 2 / 0 | 100% / 78% | 0 / 633 ms | 0 / 633 ms |
| `low-zoom` | 89 / 34 | 19 / 23 | 6 / 6 | 4 / 0 | 100% / 80% | 0 / 633 ms | 0 / 633 ms |
| **the 16** | **3,439 / 245** | **636 / 985** | **130 / 130** | **172 / 10** | | | |

| run (8B / 8C) | jumps | pops | level-of-detail switches | flickers | formations drawn while in view | never-dropped hidden | drawn though not known |
|---|---|---|---|---|---|---|---|
| `hybrid-pan+real` | 131 / 5 | 39 / 55 | 23 / 23 | 8 / 0 | 78% / 67% | 0 / 0 | 0 / 0 |
| `hybrid-orbit+real` | 508 / 7 | 117 / 145 | 0 / 0 | 31 / 0 | 85% / 58% | 0 / 0 | 0 / 0 |
| `hybrid-zoom+real` | 334 / 27 | 95 / 116 | 24 / 24 | 23 / 4 | 85% / 61% | 0 / 0 | 0 / 0 |
| `paper-zoom+real` | 314 / 8 | 20 / 92 | 0 / 0 | 14 / 2 | 100% / 69% | 0 / 0 | 0 / 0 |
| `hybrid-pan+fr` | 78 / 6 | 33 / 48 | 23 / 23 | 5 / 0 | 78% / 68% | 0 / 0 | 0 / 0 |
| `hybrid-pan+al` | 98 / 5 | 34 / 48 | 14 / 14 | 7 / 0 | 88% / 73% | 0 / 0 | 0 / 0 |
| `paper-play+al` | 86 / 5 | 5 / 33 | 2 / 2 | 0 / 0 | 100% / 89% | 0 / 0 | 0 / 0 |
| `phone-pan+touch` | 164 / 1 | 66 / 49 | 0 / 0 | 22 / 0 | 75% / 40% | 0 / 0 | 0 / 0 |
| `hybrid-zoom+sel` | 347 / 31 | 115 / 111 | 24 / 24 | 34 / 4 | 85% / 59% | 0 / 0 | 0 / 0 |
| `hybrid-orbit+sel` | 538 / 10 | 130 / 141 | 0 / 0 | 34 / 4 | 84% / 59% | 0 / 0 | 0 / 0 |
| `paper-zoom+sel` | 307 / 13 | 21 / 106 | 0 / 0 | 12 / 2 | 100% / 67% | 0 / 0 | 0 / 0 |
| `paper-play+sel` | 137 / 8 | 5 / 40 | 2 / 2 | 0 / 2 | 100% / 87% | 0 / 0 | 0 / 0 |

| over the 16 motions (8B / 8C) | |
|---|---|
| formation-frames in view (drawn, behind the ground, or hidden by the layout) | 29,202 / 29,291 |
| of them drawn | 26,989 (92%) / 21,987 (75%) |
| hidden by the layout (no room, or held by 8C until a re-placement pass) | 2,213 / 7,304 |
| behind the ground | 0 / 0 |
| off the screen or under a panel (not counted against visibility) | 8,271 / 8,330 |
| out of the layer by its level of detail | 3,481 / 3,333 |
| times a formation was hidden by the layout | 131 / 417 |
| longest such disappearance | 4,033 / 3,100 ms |
| back after the layout had room for it again: mean, most | 0, 0 / 494, 667 ms |
| a drawn formation's box moving against its anchor (jumps) | 2,197 / 97 |
| its box changing side of its anchor | 1,568 / 91 |
| two neighbouring formations' boxes swapping order (identity) | 2,642 / 270 |

| formation (8B / 8C, over the 16) | drawn while in view | longest hidden by the layout | jumps | swaps |
|---|---|---|---|---|
| sthilaire | 93% / 65% | 2,067 / 1,600 ms | 91 / 3 | 68 / 9 |
| vandamme | 100% / 78% | 33 / 1,233 ms | 86 / 3 | 98 / 9 |
| legrand | 100% / 71% | 0 / 1,233 ms | 108 / 10 | 40 / 5 |
| dok | 100% / 83% | 0 / 633 ms | 21 / 3 | 30 / 5 |
| lang | 100% / 77% | 0 / 633 ms | 59 / 5 | 33 / 4 |
| prz | 100% / 77% | 0 / 667 ms | 77 / 5 | 37 / 2 |
| kollo | 99% / 93% | 267 / 567 ms | 59 / 4 | 72 / 16 |
| lich | 98% / 82% | 1,000 / 1,367 ms | 90 / 4 | 165 / 11 |
| bag | 100% / 95% | 0 / 533 ms | 28 / 0 | 75 / 15 |
| c_iv | 100% / 77% | 0 / 667 ms | 23 / 0 | 30 / 3 |
| c_iii | 100% / 90% | 0 / 400 ms | 19 / 0 | 1 / 0 |
