### After (md5 9fa50cb46a085ab4ea8f932cd405f1e8, Chromium 141.0.7390.37)

| case | complete frame: calls | complete frame: triangles | still eye: calls | still eye: triangles | the depth pass: calls, triangles |
|---|---|---|---|---|---|
| first-run | 750 | 2,271,205 | 748 | 2,124,117 | 2, 147,088 |
| opening-1 | 721 | 2,262,065 | 719 | 2,114,977 | 2, 147,088 |
| opening-2 | 625 | 2,265,339 | 623 | 2,118,251 | 2, 147,088 |
| opening-3 | 494 | 1,954,801 | 492 | 1,807,713 | 2, 147,088 |
| opening-4 | 552 | 2,094,583 | 550 | 1,947,495 | 2, 147,088 |
| opening-end | 750 | 2,272,297 | 748 | 2,125,209 | 2, 147,088 |
| overview-field | 839 | 2,345,505 | 837 | 2,198,417 | 2, 147,088 |
| overview-plan | 839 | 2,324,625 | 837 | 2,177,537 | 2, 147,088 |
| close-sokolnitz | 701 | 2,279,101 | 699 | 2,132,013 | 2, 147,088 |
| staff-paper | 148 | 238,701 | 148 | 238,701 | 0, 0 |
| pratzen-low | 559 | 1,966,685 | 557 | 1,819,597 | 2, 147,088 |
| pratzen-orbit-min | 622 | 2,120,703 | 620 | 1,973,615 | 2, 147,088 |
| selected-formation | 696 | 2,269,489 | 694 | 2,122,401 | 2, 147,088 |
| watch-selected | 635 | 2,179,969 | 633 | 2,032,881 | 2, 147,088 |
| hybrid-dimmed | 644 | 2,200,241 | 642 | 2,053,153 | 2, 147,088 |
| pratzen-low-1x | 162 | 374,921 | 160 | 227,833 | 2, 147,088 |
| pratzen-low-10x | 590 | 2,035,069 | 588 | 1,887,981 | 2, 147,088 |
| paper-north-up | 156 | 240,915 | 156 | 240,915 | 0, 0 |
| paper-close | 102 | 203,431 | 102 | 203,431 | 0, 0 |
| paper-drawer | 110 | 226,499 | 110 | 226,499 | 0, 0 |
| paper-laptop | 156 | 240,915 | 156 | 240,915 | 0, 0 |
| narrow-1024 | 839 | 2,352,049 | 837 | 2,204,961 | 2, 147,088 |
| ph8-overview-study | 820 | 2,315,043 | 818 | 2,167,955 | 2, 147,088 |
| ph8-overview-watch | 820 | 2,312,615 | 818 | 2,165,527 | 2, 147,088 |
| eye-zuran | 177 | 560,783 | 175 | 413,695 | 2, 147,088 |
| eye-zuran-1x | 124 | 374,193 | 122 | 227,105 | 2, 147,088 |
| plans-overview | 864 | 2,330,631 | 862 | 2,183,543 | 2, 147,088 |
| opening-1-laptop | 726 | 2,296,793 | 724 | 2,149,705 | 2, 147,088 |
| phone-390-first (low tier) | 482 | 1,398,127 | 480 | 1,251,039 | 2, 147,088 |
| phone-390-explore (low tier) | 251 | 1,045,537 | 249 | 898,449 | 2, 147,088 |
| phone-390-dossier (low tier) | 198 | 1,019,347 | 196 | 872,259 | 2, 147,088 |
| phone-390-watch (low tier) | 251 | 1,045,537 | 249 | 898,449 | 2, 147,088 |
| phone-390-layers (low tier) | 209 | 934,639 | 207 | 787,551 | 2, 147,088 |
| phone-360-explore (low tier) | 253 | 1,042,801 | 251 | 895,713 | 2, 147,088 |
| phone-430-explore (low tier) | 251 | 1,043,205 | 249 | 896,117 | 2, 147,088 |
| phone-844x390-explore (low tier) | 269 | 995,997 | 267 | 848,909 | 2, 147,088 |
| phone-402x714-explore (low tier) | 242 | 1,038,893 | 240 | 891,805 | 2, 147,088 |
| phone-390-paper (low tier) | 156 | 240,915 | 156 | 240,915 | 0, 0 |
| first-run-laptop | 750 | 2,273,819 | 748 | 2,126,731 | 2, 147,088 |

- **desktop** (29 cases), maxima over the cases, each separately: the complete frame 864 calls (plans-overview) and 2,352,049 triangles (narrow-1024); the still eye 862 calls (plans-overview) and 2,204,961 triangles (narrow-1024). Headroom from the complete frame: 36 calls of 900 (4%), 447,951 triangles of 2,800,000 (16%).
- **phone** (10 cases), maxima over the cases, each separately: the complete frame 482 calls (phone-390-first) and 1,398,127 triangles (phone-390-first); the still eye 480 calls (phone-390-first) and 1,251,039 triangles (phone-390-first). Headroom from the complete frame: 221,873 triangles of 1,620,000 (13.7%).
