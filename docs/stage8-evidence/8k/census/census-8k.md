### After (md5 f10fe585c46aea576f436ed51ac46f83, Chromium 141.0.7390.37)

| case | complete frame: calls | complete frame: triangles | still eye: calls | still eye: triangles | the depth pass: calls, triangles |
|---|---|---|---|---|---|
| first-run | 750 | 2,074,211 | 748 | 1,927,123 | 2, 147,088 |
| opening-1 | 721 | 2,064,141 | 719 | 1,917,053 | 2, 147,088 |
| opening-2 | 630 | 2,076,483 | 628 | 1,929,395 | 2, 147,088 |
| opening-3 | 493 | 1,757,203 | 491 | 1,610,115 | 2, 147,088 |
| opening-4 | 552 | 1,898,507 | 550 | 1,751,419 | 2, 147,088 |
| opening-end | 750 | 2,075,243 | 748 | 1,928,155 | 2, 147,088 |
| overview-field | 839 | 2,145,695 | 837 | 1,998,607 | 2, 147,088 |
| overview-plan | 839 | 2,127,975 | 837 | 1,980,887 | 2, 147,088 |
| close-sokolnitz | 703 | 2,089,587 | 701 | 1,942,499 | 2, 147,088 |
| staff-paper | 154 | 239,801 | 154 | 239,801 | 0, 0 |
| pratzen-low | 570 | 1,798,057 | 568 | 1,650,969 | 2, 147,088 |
| pratzen-orbit-min | 624 | 1,926,609 | 622 | 1,779,521 | 2, 147,088 |
| selected-formation | 691 | 2,080,725 | 689 | 1,933,637 | 2, 147,088 |
| watch-selected | 653 | 2,015,270 | 651 | 1,868,182 | 2, 147,088 |
| hybrid-dimmed | 656 | 2,031,833 | 654 | 1,884,745 | 2, 147,088 |
| pratzen-low-1x | 163 | 376,405 | 161 | 229,317 | 2, 147,088 |
| pratzen-low-10x | 593 | 1,846,779 | 591 | 1,699,691 | 2, 147,088 |
| paper-north-up | 156 | 241,659 | 156 | 241,659 | 0, 0 |
| paper-close | 102 | 202,927 | 102 | 202,927 | 0, 0 |
| paper-drawer | 110 | 226,765 | 110 | 226,765 | 0, 0 |
| paper-laptop | 156 | 241,659 | 156 | 241,659 | 0, 0 |
| narrow-1024 | 839 | 2,151,193 | 837 | 2,004,105 | 2, 147,088 |
| ph8-overview-study | 820 | 2,118,395 | 818 | 1,971,307 | 2, 147,088 |
| ph8-overview-watch | 820 | 2,115,909 | 818 | 1,968,821 | 2, 147,088 |
| eye-zuran | 191 | 575,405 | 189 | 428,317 | 2, 147,088 |
| eye-zuran-1x | 134 | 381,887 | 132 | 234,799 | 2, 147,088 |
| plans-overview | 864 | 2,133,789 | 862 | 1,986,701 | 2, 147,088 |
| opening-1-laptop | 726 | 2,101,155 | 724 | 1,954,067 | 2, 147,088 |
| phone-390-first (low tier) | 482 | 1,288,561 | 480 | 1,141,473 | 2, 147,088 |
| phone-390-explore (low tier) | 251 | 936,189 | 249 | 789,101 | 2, 147,088 |
| phone-390-dossier (low tier) | 198 | 909,999 | 196 | 762,911 | 2, 147,088 |
| phone-390-watch (low tier) | 251 | 936,189 | 249 | 789,101 | 2, 147,088 |
| phone-390-layers (low tier) | 207 | 825,073 | 205 | 677,985 | 2, 147,088 |
| phone-360-explore (low tier) | 252 | 933,743 | 250 | 786,655 | 2, 147,088 |
| phone-430-explore (low tier) | 251 | 934,309 | 249 | 787,221 | 2, 147,088 |
| phone-844x390-explore (low tier) | 277 | 922,441 | 275 | 775,353 | 2, 147,088 |
| phone-402x714-explore (low tier) | 238 | 929,507 | 236 | 782,419 | 2, 147,088 |
| phone-390-paper (low tier) | 156 | 241,659 | 156 | 241,659 | 0, 0 |
| first-run-laptop | 750 | 2,076,863 | 748 | 1,929,775 | 2, 147,088 |

- **desktop** (29 cases), maxima over the cases, each separately: the complete frame 864 calls (plans-overview) and 2,151,193 triangles (narrow-1024); the still eye 862 calls (plans-overview) and 2,004,105 triangles (narrow-1024). Headroom from the complete frame: 36 calls of 900 (4%), 648,807 triangles of 2,800,000 (23.2%).
- **phone** (10 cases), maxima over the cases, each separately: the complete frame 482 calls (phone-390-first) and 1,288,561 triangles (phone-390-first); the still eye 480 calls (phone-390-first) and 1,141,473 triangles (phone-390-first). Headroom from the complete frame: 331,439 triangles of 1,620,000 (20.5%).
