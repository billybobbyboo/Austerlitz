# The census by view and pass (tools/stage8/census-8d.js)

Generated from `census.json` (141.0.7390.37, software WebGL): one whole frame per view, every pass, reconciled with `renderer.info`. "Eye moved": the ground's depth for the overlays drawn again in the frame (8B's pass, as when the eye moves); "still": reused from the last frame. Triangles as three counts them; calls are draw calls.

## Before and after: build-fix.html (md5 `87578ebce0e414a4c8b308d88f7abc03`) against build-8d.html (md5 `f79f56ab99965526ec4b6d94d74e3cd8`)

The frame as each build draws it when the eye moves (the ground's depth drawn): calls, then triangles, whole frame and by pass (before → after). Step 6's estimate is read on the before build: the triangles of the figure meshes none of whose instances is in the eye's frustum (world pass).

| view | calls | triangles | change | world | shadow | depth | post | labels | step 6's estimate (world, figures off the view) |
|---|---|---|---|---|---|---|---|---|---|
| overview-field | 834 → 834 | 2.692 M → 2.692 M | 0.0% | 1.502 M → 1.502 M | 1.043 M → 1.043 M | 147.1 k → 147.1 k | 7 → 7 | 10 → 10 | 0 (0 of 303 meshes) |
| overview-field-1x | 197 → 197 | 385.1 k → 385.1 k | 0.0% | 238.0 k → 238.0 k | 0 → 0 | 147.1 k → 147.1 k | 7 → 7 | 10 → 10 | 0 (0 of 0 meshes) |
| overview-field-10x | 834 → 834 | 2.695 M → 2.695 M | 0.0% | 1.505 M → 1.505 M | 1.043 M → 1.043 M | 147.1 k → 147.1 k | 7 → 7 | 10 → 10 | 0 (0 of 303 meshes) |
| overview-plan | 834 → 834 | 2.671 M → 2.671 M | 0.0% | 1.481 M → 1.481 M | 1.043 M → 1.043 M | 147.1 k → 147.1 k | 7 → 7 | 10 → 10 | 0 (0 of 303 meshes) |
| close-sokolnitz | 781 → 675 | 2.638 M → 2.434 M | -7.7% | 1.471 M → 1.267 M | 1.020 M → 1.020 M | 147.1 k → 147.1 k | 7 → 7 | 8 → 8 | 292,986 (159 of 289 meshes) |
| close-sokolnitz-1x | 181 → 181 | 385.7 k → 385.7 k | 0.0% | 238.6 k → 238.6 k | 0 → 0 | 147.1 k → 147.1 k | 7 → 7 | 10 → 10 | 0 (0 of 0 meshes) |
| close-sokolnitz-10x | 771 → 603 | 2.635 M → 2.345 M | -11.0% | 1.468 M → 1.178 M | 1.020 M → 1.019 M | 147.1 k → 147.1 k | 7 → 7 | 6 → 6 | 367,984 (196 of 289 meshes) |
| staff-paper | 148 → 148 | 238.7 k → 238.7 k | 0.0% | 238.7 k → 238.7 k | 0 → 0 | 0 → 0 | 7 → 7 | 10 → 10 | 0 (0 of 0 meshes) |
| pratzen-low | 760 → 543 | 2.628 M → 2.211 M | -15.9% | 1.455 M → 1.119 M | 1.026 M → 945.0 k | 147.1 k → 147.1 k | 7 → 7 | 4 → 4 | 339,022 (179 of 293 meshes) |
| selected-formation | 766 → 691 | 2.663 M → 2.490 M | -6.5% | 1.474 M → 1.300 M | 1.043 M → 1.043 M | 147.1 k → 147.1 k | 7 → 7 | 6 → 6 | 174,824 (85 of 303 meshes) |
| watch-selected | 742 → 625 | 2.628 M → 2.408 M | -8.4% | 1.455 M → 1.235 M | 1.026 M → 1.026 M | 147.1 k → 147.1 k | 7 → 7 | 4 → 4 | 234,018 (121 of 293 meshes) |
| hybrid-dimmed | 742 → 635 | 2.632 M → 2.449 M | -7.0% | 1.459 M → 1.283 M | 1.026 M → 1.019 M | 147.1 k → 147.1 k | 7 → 7 | 4 → 4 | 176,302 (102 of 293 meshes) |
| pratzen-low-1x | 162 → 162 | 374.9 k → 374.9 k | 0.0% | 227.8 k → 227.8 k | 0 → 0 | 147.1 k → 147.1 k | 7 → 7 | 4 → 4 | 0 (0 of 0 meshes) |
| pratzen-low-10x | 761 → 580 | 2.629 M → 2.288 M | -13.0% | 1.456 M → 1.115 M | 1.026 M → 1.026 M | 147.1 k → 147.1 k | 7 → 7 | 4 → 4 | 349,390 (181 of 293 meshes) |
| paper-north-up | 156 → 156 | 240.9 k → 240.9 k | 0.0% | 240.9 k → 240.9 k | 0 → 0 | 0 → 0 | 7 → 7 | 10 → 10 | 0 (0 of 0 meshes) |
| paper-close | 103 → 103 | 203.5 k → 203.5 k | 0.0% | 203.4 k → 203.4 k | 0 → 0 | 0 → 0 | 7 → 7 | 4 → 4 | 0 (0 of 0 meshes) |
| paper-drawer | 110 → 110 | 226.5 k → 226.5 k | 0.0% | 226.5 k → 226.5 k | 0 → 0 | 0 → 0 | 7 → 7 | 6 → 6 | 0 (0 of 0 meshes) |
| ph8-overview-study | 811 → 811 | 2.653 M → 2.653 M | 0.0% | 1.474 M → 1.474 M | 1.032 M → 1.032 M | 147.1 k → 147.1 k | 7 → 7 | 4 → 4 | 0 (0 of 298 meshes) |
| ph8-overview-watch | 811 → 811 | 2.650 M → 2.650 M | 0.0% | 1.471 M → 1.471 M | 1.032 M → 1.032 M | 147.1 k → 147.1 k | 7 → 7 | 4 → 4 | 0 (0 of 298 meshes) |
| ph8-overview-watch-1x | 183 → 183 | 383.8 k → 383.8 k | 0.0% | 236.7 k → 236.7 k | 0 → 0 | 147.1 k → 147.1 k | 7 → 7 | 4 → 4 | 0 (0 of 0 meshes) |
| ph8-overview-watch-10x | 811 → 811 | 2.653 M → 2.653 M | 0.0% | 1.474 M → 1.474 M | 1.032 M → 1.032 M | 147.1 k → 147.1 k | 7 → 7 | 4 → 4 | 0 (0 of 298 meshes) |
| eye-zuran | 207 → 177 | 643.0 k → 529.6 k | -17.6% | 362.6 k → 285.4 k | 133.3 k → 97.0 k | 147.1 k → 147.1 k | 7 → 7 | 4 → 4 | 90,378 (24 of 39 meshes) |
| eye-zuran-1x | 129 → 129 | 374.2 k → 374.2 k | 0.0% | 227.1 k → 227.1 k | 0 → 0 | 147.1 k → 147.1 k | 7 → 7 | 4 → 4 | 0 (0 of 0 meshes) |
| plans-overview | 859 → 859 | 2.677 M → 2.677 M | 0.0% | 1.487 M → 1.487 M | 1.043 M → 1.043 M | 147.1 k → 147.1 k | 7 → 7 | 26 → 26 | 0 (0 of 303 meshes) |
| paper-laptop | 156 → 156 | 240.9 k → 240.9 k | 0.0% | 240.9 k → 240.9 k | 0 → 0 | 0 → 0 | 7 → 7 | 10 → 10 | 0 (0 of 0 meshes) |
| narrow-1024 | 834 → 834 | 2.698 M → 2.698 M | 0.0% | 1.509 M → 1.509 M | 1.043 M → 1.043 M | 147.1 k → 147.1 k | 7 → 7 | 10 → 10 | 0 (0 of 303 meshes) |
| phone:overview-plan | 545 → 545 | 1.640 M → 1.640 M | 0.0% | 1.493 M → 1.493 M | 0 → 0 | 147.1 k → 147.1 k | 7 → 7 | 10 → 10 | 0 (0 of 303 meshes) |
| phone:pratzen-low | 451 → 223 | 1.605 M → 1.178 M | -26.6% | 1.458 M → 1.031 M | 0 → 0 | 147.1 k → 147.1 k | 7 → 7 | 4 → 4 | 426,710 (229 of 293 meshes) |
| phone:ph8-overview-watch | 527 → 527 | 1.631 M → 1.631 M | 0.0% | 1.484 M → 1.484 M | 0 → 0 | 147.1 k → 147.1 k | 7 → 7 | 4 → 4 | 0 (0 of 298 meshes) |

## build-fix.html (md5 `87578ebce0e414a4c8b308d88f7abc03`)

| view | culled? | calls | triangles | world | shadow | depth | post | labels | figures (all passes) | still eye: triangles | reconciled |
|---|---|---|---|---|---|---|---|---|---|---|---|
| overview-field | (no culling in the build) | 834 | 2.692 M | 1.502 M | 1.043 M | 147.1 k | 7 | 10 | 1.267 M | 2.545 M | true |
| overview-field-1x | (no culling in the build) | 197 | 385.1 k | 238.0 k | 0 | 147.1 k | 7 | 10 | 0 | 238.0 k | true |
| overview-field-10x | (no culling in the build) | 834 | 2.695 M | 1.505 M | 1.043 M | 147.1 k | 7 | 10 | 1.267 M | 2.548 M | true |
| overview-plan | (no culling in the build) | 834 | 2.671 M | 1.481 M | 1.043 M | 147.1 k | 7 | 10 | 1.267 M | 2.524 M | true |
| close-sokolnitz | (no culling in the build) | 781 | 2.638 M | 1.471 M | 1.020 M | 147.1 k | 7 | 8 | 1.221 M | 2.491 M | true |
| close-sokolnitz-1x | (no culling in the build) | 181 | 385.7 k | 238.6 k | 0 | 147.1 k | 7 | 10 | 0 | 238.6 k | true |
| close-sokolnitz-10x | (no culling in the build) | 771 | 2.635 M | 1.468 M | 1.020 M | 147.1 k | 7 | 6 | 1.221 M | 2.488 M | true |
| staff-paper | (no culling in the build) | 148 | 238.7 k | 238.7 k | 0 | 0 | 7 | 10 | 0 | 238.7 k | true |
| pratzen-low | (no culling in the build) | 760 | 2.628 M | 1.455 M | 1.026 M | 147.1 k | 7 | 4 | 1.234 M | 2.481 M | true |
| selected-formation | (no culling in the build) | 766 | 2.663 M | 1.474 M | 1.043 M | 147.1 k | 7 | 6 | 1.267 M | 2.516 M | true |
| watch-selected | (no culling in the build) | 742 | 2.628 M | 1.455 M | 1.026 M | 147.1 k | 7 | 4 | 1.234 M | 2.481 M | true |
| hybrid-dimmed | (no culling in the build) | 742 | 2.632 M | 1.459 M | 1.026 M | 147.1 k | 7 | 4 | 1.234 M | 2.485 M | true |
| pratzen-low-1x | (no culling in the build) | 162 | 374.9 k | 227.8 k | 0 | 147.1 k | 7 | 4 | 0 | 227.8 k | true |
| pratzen-low-10x | (no culling in the build) | 761 | 2.629 M | 1.456 M | 1.026 M | 147.1 k | 7 | 4 | 1.234 M | 2.482 M | true |
| paper-north-up | (no culling in the build) | 156 | 240.9 k | 240.9 k | 0 | 0 | 7 | 10 | 0 | 240.9 k | true |
| paper-close | (no culling in the build) | 103 | 203.5 k | 203.4 k | 0 | 0 | 7 | 4 | 0 | 203.5 k | true |
| paper-drawer | (no culling in the build) | 110 | 226.5 k | 226.5 k | 0 | 0 | 7 | 6 | 0 | 226.5 k | true |
| ph8-overview-study | (no culling in the build) | 811 | 2.653 M | 1.474 M | 1.032 M | 147.1 k | 7 | 4 | 1.245 M | 2.506 M | true |
| ph8-overview-watch | (no culling in the build) | 811 | 2.650 M | 1.471 M | 1.032 M | 147.1 k | 7 | 4 | 1.245 M | 2.503 M | true |
| ph8-overview-watch-1x | (no culling in the build) | 183 | 383.8 k | 236.7 k | 0 | 147.1 k | 7 | 4 | 0 | 236.8 k | true |
| ph8-overview-watch-10x | (no culling in the build) | 811 | 2.653 M | 1.474 M | 1.032 M | 147.1 k | 7 | 4 | 1.245 M | 2.506 M | true |
| eye-zuran | (no culling in the build) | 207 | 643.0 k | 362.6 k | 133.3 k | 147.1 k | 7 | 4 | 266.7 k | 495.9 k | true |
| eye-zuran-1x | (no culling in the build) | 129 | 374.2 k | 227.1 k | 0 | 147.1 k | 7 | 4 | 0 | 227.1 k | true |
| plans-overview | (no culling in the build) | 859 | 2.677 M | 1.487 M | 1.043 M | 147.1 k | 7 | 26 | 1.267 M | 2.530 M | true |
| paper-laptop | (no culling in the build) | 156 | 240.9 k | 240.9 k | 0 | 0 | 7 | 10 | 0 | 240.9 k | true |
| narrow-1024 | (no culling in the build) | 834 | 2.698 M | 1.509 M | 1.043 M | 147.1 k | 7 | 10 | 1.267 M | 2.551 M | true |
| phone:overview-plan | (no culling in the build) | 545 | 1.640 M | 1.493 M | 0 | 147.1 k | 7 | 10 | 633.5 k | 1.493 M | true |
| phone:pratzen-low | (no culling in the build) | 451 | 1.605 M | 1.458 M | 0 | 147.1 k | 7 | 4 | 616.9 k | 1.458 M | true |
| phone:ph8-overview-watch | (no culling in the build) | 527 | 1.631 M | 1.484 M | 0 | 147.1 k | 7 | 4 | 622.9 k | 1.484 M | true |

## build-8d.html (md5 `f79f56ab99965526ec4b6d94d74e3cd8`)

| view | culled? | calls | triangles | world | shadow | depth | post | labels | figures (all passes) | still eye: triangles | reconciled |
|---|---|---|---|---|---|---|---|---|---|---|---|
| overview-field | yes | 834 | 2.692 M | 1.502 M | 1.043 M | 147.1 k | 7 | 10 | 1.267 M | 2.545 M | true |
| overview-field | no | 834 | 2.692 M | 1.502 M | 1.043 M | 147.1 k | 7 | 10 | 1.267 M | 2.545 M | true |
| overview-field-1x | yes | 197 | 385.1 k | 238.0 k | 0 | 147.1 k | 7 | 10 | 0 | 238.0 k | true |
| overview-field-1x | no | 197 | 385.1 k | 238.0 k | 0 | 147.1 k | 7 | 10 | 0 | 238.0 k | true |
| overview-field-10x | yes | 834 | 2.695 M | 1.505 M | 1.043 M | 147.1 k | 7 | 10 | 1.267 M | 2.548 M | true |
| overview-field-10x | no | 834 | 2.695 M | 1.505 M | 1.043 M | 147.1 k | 7 | 10 | 1.267 M | 2.548 M | true |
| overview-plan | yes | 834 | 2.671 M | 1.481 M | 1.043 M | 147.1 k | 7 | 10 | 1.267 M | 2.524 M | true |
| overview-plan | no | 834 | 2.671 M | 1.481 M | 1.043 M | 147.1 k | 7 | 10 | 1.267 M | 2.524 M | true |
| close-sokolnitz | yes | 675 | 2.434 M | 1.267 M | 1.020 M | 147.1 k | 7 | 8 | 1.016 M | 2.287 M | true |
| close-sokolnitz | no | 781 | 2.638 M | 1.471 M | 1.020 M | 147.1 k | 7 | 8 | 1.221 M | 2.491 M | true |
| close-sokolnitz-1x | yes | 181 | 385.7 k | 238.6 k | 0 | 147.1 k | 7 | 10 | 0 | 238.6 k | true |
| close-sokolnitz-1x | no | 181 | 385.7 k | 238.6 k | 0 | 147.1 k | 7 | 10 | 0 | 238.6 k | true |
| close-sokolnitz-10x | yes | 603 | 2.345 M | 1.178 M | 1.019 M | 147.1 k | 7 | 6 | 930.8 k | 2.198 M | true |
| close-sokolnitz-10x | no | 771 | 2.635 M | 1.468 M | 1.020 M | 147.1 k | 7 | 6 | 1.221 M | 2.488 M | true |
| staff-paper | yes | 148 | 238.7 k | 238.7 k | 0 | 0 | 7 | 10 | 0 | 238.7 k | true |
| staff-paper | no | 148 | 238.7 k | 238.7 k | 0 | 0 | 7 | 10 | 0 | 238.7 k | true |
| pratzen-low | yes | 543 | 2.211 M | 1.119 M | 945.0 k | 147.1 k | 7 | 4 | 816.2 k | 2.064 M | true |
| pratzen-low | no | 760 | 2.628 M | 1.455 M | 1.026 M | 147.1 k | 7 | 4 | 1.234 M | 2.481 M | true |
| selected-formation | yes | 691 | 2.490 M | 1.300 M | 1.043 M | 147.1 k | 7 | 6 | 1.094 M | 2.343 M | true |
| selected-formation | no | 766 | 2.663 M | 1.474 M | 1.043 M | 147.1 k | 7 | 6 | 1.267 M | 2.516 M | true |
| watch-selected | yes | 625 | 2.408 M | 1.235 M | 1.026 M | 147.1 k | 7 | 4 | 1.013 M | 2.261 M | true |
| watch-selected | no | 742 | 2.628 M | 1.455 M | 1.026 M | 147.1 k | 7 | 4 | 1.234 M | 2.481 M | true |
| hybrid-dimmed | yes | 635 | 2.449 M | 1.283 M | 1.019 M | 147.1 k | 7 | 4 | 1.050 M | 2.302 M | true |
| hybrid-dimmed | no | 742 | 2.632 M | 1.459 M | 1.026 M | 147.1 k | 7 | 4 | 1.234 M | 2.485 M | true |
| pratzen-low-1x | yes | 162 | 374.9 k | 227.8 k | 0 | 147.1 k | 7 | 4 | 0 | 227.8 k | true |
| pratzen-low-1x | no | 162 | 374.9 k | 227.8 k | 0 | 147.1 k | 7 | 4 | 0 | 227.8 k | true |
| pratzen-low-10x | yes | 580 | 2.288 M | 1.115 M | 1.026 M | 147.1 k | 7 | 4 | 892.7 k | 2.141 M | true |
| pratzen-low-10x | no | 761 | 2.629 M | 1.456 M | 1.026 M | 147.1 k | 7 | 4 | 1.234 M | 2.482 M | true |
| paper-north-up | yes | 156 | 240.9 k | 240.9 k | 0 | 0 | 7 | 10 | 0 | 240.9 k | true |
| paper-north-up | no | 156 | 240.9 k | 240.9 k | 0 | 0 | 7 | 10 | 0 | 240.9 k | true |
| paper-close | yes | 103 | 203.5 k | 203.4 k | 0 | 0 | 7 | 4 | 0 | 203.5 k | true |
| paper-close | no | 103 | 203.5 k | 203.4 k | 0 | 0 | 7 | 4 | 0 | 203.5 k | true |
| paper-drawer | yes | 110 | 226.5 k | 226.5 k | 0 | 0 | 7 | 6 | 0 | 226.5 k | true |
| paper-drawer | no | 110 | 226.5 k | 226.5 k | 0 | 0 | 7 | 6 | 0 | 226.5 k | true |
| ph8-overview-study | yes | 811 | 2.653 M | 1.474 M | 1.032 M | 147.1 k | 7 | 4 | 1.245 M | 2.506 M | true |
| ph8-overview-study | no | 811 | 2.653 M | 1.474 M | 1.032 M | 147.1 k | 7 | 4 | 1.245 M | 2.506 M | true |
| ph8-overview-watch | yes | 811 | 2.650 M | 1.471 M | 1.032 M | 147.1 k | 7 | 4 | 1.245 M | 2.503 M | true |
| ph8-overview-watch | no | 811 | 2.650 M | 1.471 M | 1.032 M | 147.1 k | 7 | 4 | 1.245 M | 2.503 M | true |
| ph8-overview-watch-1x | yes | 183 | 383.8 k | 236.7 k | 0 | 147.1 k | 7 | 4 | 0 | 236.8 k | true |
| ph8-overview-watch-1x | no | 183 | 383.8 k | 236.7 k | 0 | 147.1 k | 7 | 4 | 0 | 236.8 k | true |
| ph8-overview-watch-10x | yes | 811 | 2.653 M | 1.474 M | 1.032 M | 147.1 k | 7 | 4 | 1.245 M | 2.506 M | true |
| ph8-overview-watch-10x | no | 811 | 2.653 M | 1.474 M | 1.032 M | 147.1 k | 7 | 4 | 1.245 M | 2.506 M | true |
| eye-zuran | yes | 177 | 529.6 k | 285.4 k | 97.0 k | 147.1 k | 7 | 4 | 153.3 k | 382.5 k | true |
| eye-zuran | no | 207 | 643.0 k | 362.6 k | 133.3 k | 147.1 k | 7 | 4 | 266.7 k | 495.9 k | true |
| eye-zuran-1x | yes | 129 | 374.2 k | 227.1 k | 0 | 147.1 k | 7 | 4 | 0 | 227.1 k | true |
| eye-zuran-1x | no | 129 | 374.2 k | 227.1 k | 0 | 147.1 k | 7 | 4 | 0 | 227.1 k | true |
| plans-overview | yes | 859 | 2.677 M | 1.487 M | 1.043 M | 147.1 k | 7 | 26 | 1.267 M | 2.530 M | true |
| plans-overview | no | 859 | 2.677 M | 1.487 M | 1.043 M | 147.1 k | 7 | 26 | 1.267 M | 2.530 M | true |
| paper-laptop | yes | 156 | 240.9 k | 240.9 k | 0 | 0 | 7 | 10 | 0 | 240.9 k | true |
| paper-laptop | no | 156 | 240.9 k | 240.9 k | 0 | 0 | 7 | 10 | 0 | 240.9 k | true |
| narrow-1024 | yes | 834 | 2.698 M | 1.509 M | 1.043 M | 147.1 k | 7 | 10 | 1.267 M | 2.551 M | true |
| narrow-1024 | no | 834 | 2.698 M | 1.509 M | 1.043 M | 147.1 k | 7 | 10 | 1.267 M | 2.551 M | true |
| phone:overview-plan | yes | 545 | 1.640 M | 1.493 M | 0 | 147.1 k | 7 | 10 | 633.5 k | 1.493 M | true |
| phone:overview-plan | no | 545 | 1.640 M | 1.493 M | 0 | 147.1 k | 7 | 10 | 633.5 k | 1.493 M | true |
| phone:pratzen-low | yes | 223 | 1.178 M | 1.031 M | 0 | 147.1 k | 7 | 4 | 190.2 k | 1.031 M | true |
| phone:pratzen-low | no | 451 | 1.605 M | 1.458 M | 0 | 147.1 k | 7 | 4 | 616.9 k | 1.458 M | true |
| phone:ph8-overview-watch | yes | 527 | 1.631 M | 1.484 M | 0 | 147.1 k | 7 | 4 | 622.9 k | 1.484 M | true |
| phone:ph8-overview-watch | no | 527 | 1.631 M | 1.484 M | 0 | 147.1 k | 7 | 4 | 622.9 k | 1.484 M | true |

