### After (md5 7d5594baf7468f943ab42f7d848608d1, Chromium 141.0.7390.37)

| case | complete frame: calls | complete frame: triangles | still eye: calls | still eye: triangles | the depth pass: calls, triangles |
|---|---|---|---|---|---|
| first-run | 750 | 2,119,869 | 748 | 1,972,781 | 2, 147,088 |
| opening-1 | 721 | 2,110,729 | 719 | 1,963,641 | 2, 147,088 |
| opening-2 | 629 | 2,122,053 | 627 | 1,974,965 | 2, 147,088 |
| opening-3 | 493 | 1,802,157 | 491 | 1,655,069 | 2, 147,088 |
| opening-4 | 552 | 1,943,247 | 550 | 1,796,159 | 2, 147,088 |
| opening-end | 750 | 2,120,961 | 748 | 1,973,873 | 2, 147,088 |
| overview-field | 839 | 2,194,039 | 837 | 2,046,951 | 2, 147,088 |
| overview-plan | 839 | 2,173,035 | 837 | 2,025,947 | 2, 147,088 |
| close-sokolnitz | 705 | 2,135,939 | 703 | 1,988,851 | 2, 147,088 |
| staff-paper | 148 | 238,469 | 148 | 238,469 | 0, 0 |
| pratzen-low | 563 | 1,823,189 | 561 | 1,676,101 | 2, 147,088 |
| pratzen-orbit-min | 624 | 1,972,697 | 622 | 1,825,609 | 2, 147,088 |
| selected-formation | 695 | 2,117,831 | 693 | 1,970,743 | 2, 147,088 |
| watch-selected | 638 | 2,036,305 | 636 | 1,889,217 | 2, 147,088 |
| hybrid-dimmed | 648 | 2,056,719 | 646 | 1,909,631 | 2, 147,088 |
| pratzen-low-1x | 163 | 375,287 | 161 | 228,199 | 2, 147,088 |
| pratzen-low-10x | 593 | 1,891,465 | 591 | 1,744,377 | 2, 147,088 |
| paper-north-up | 156 | 240,839 | 156 | 240,839 | 0, 0 |
| paper-close | 102 | 203,223 | 102 | 203,223 | 0, 0 |
| paper-drawer | 110 | 226,029 | 110 | 226,029 | 0, 0 |
| paper-laptop | 156 | 240,839 | 156 | 240,839 | 0, 0 |
| narrow-1024 | 839 | 2,200,439 | 837 | 2,053,351 | 2, 147,088 |
| ph8-overview-study | 820 | 2,163,707 | 818 | 2,016,619 | 2, 147,088 |
| ph8-overview-watch | 820 | 2,161,279 | 818 | 2,014,191 | 2, 147,088 |
| eye-zuran | 191 | 574,245 | 189 | 427,157 | 2, 147,088 |
| eye-zuran-1x | 134 | 380,589 | 132 | 233,501 | 2, 147,088 |
| plans-overview | 864 | 2,178,945 | 862 | 2,031,857 | 2, 147,088 |
| opening-1-laptop | 726 | 2,145,457 | 724 | 1,998,369 | 2, 147,088 |
| phone-390-first (low tier) | 482 | 1,315,760 | 480 | 1,168,672 | 2, 147,088 |
| phone-390-explore (low tier) | 251 | 962,896 | 249 | 815,808 | 2, 147,088 |
| phone-390-dossier (low tier) | 198 | 936,706 | 196 | 789,618 | 2, 147,088 |
| phone-390-watch (low tier) | 251 | 962,896 | 249 | 815,808 | 2, 147,088 |
| phone-390-layers (low tier) | 207 | 851,780 | 205 | 704,692 | 2, 147,088 |
| phone-360-explore (low tier) | 252 | 960,470 | 250 | 813,382 | 2, 147,088 |
| phone-430-explore (low tier) | 251 | 960,714 | 249 | 813,626 | 2, 147,088 |
| phone-844x390-explore (low tier) | 269 | 914,706 | 267 | 767,618 | 2, 147,088 |
| phone-402x714-explore (low tier) | 238 | 956,042 | 236 | 808,954 | 2, 147,088 |
| phone-390-paper (low tier) | 156 | 240,839 | 156 | 240,839 | 0, 0 |
| first-run-laptop | 750 | 2,122,367 | 748 | 1,975,279 | 2, 147,088 |

- **desktop** (29 cases), maxima over the cases, each separately: the complete frame 864 calls (plans-overview) and 2,200,439 triangles (narrow-1024); the still eye 862 calls (plans-overview) and 2,053,351 triangles (narrow-1024). Headroom from the complete frame: 36 calls of 900 (4%), 599,561 triangles of 2,800,000 (21.4%).
- **phone** (10 cases), maxima over the cases, each separately: the complete frame 482 calls (phone-390-first) and 1,315,760 triangles (phone-390-first); the still eye 480 calls (phone-390-first) and 1,168,672 triangles (phone-390-first). Headroom from the complete frame: 304,240 triangles of 1,620,000 (18.8%).
