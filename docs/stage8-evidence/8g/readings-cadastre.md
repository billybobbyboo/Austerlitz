# Stable Cadastre indication sketches (1825-1826) of the Austerlitz battlefield villages: what they show

Reader's report, 29 October 2026. Source: Moravský zemský archiv (MZA), fund D9 *Indikační skici*, online viewer (https://www.mza.cz/indikacniskici/). Every image was viewed as an image. Crops are listed per reading (106 crops, 21 MB, saved in the reading session and not committed; a selection, downscaled, is in `cadastre/` beside this file). Every tile used was listed (6,855 tile URLs; the scheme in section 0.1 rebuilds any of them). The reader's scripts are not committed.

**Citation.** `BUILDINGS` (appearance.js) and the texts' register cite this report's sections as C and the section's number: C1.1 is
section 1.1 (Sokolnitz's village core), C3 section 3, C4 section 4; a number after the section's (C3.1, C3.6) is the numbered finding within it.

**Grading.**
- **B** = what an 1825/1826 sketch shows of 1825/1826 (my reading of the drawing).
- **Measured** values carry their method and uncertainty.
- Anything about **1805** is **inference**: the sketches are 20–21 years after the battle. Pratzen burned in 1805, 1814 and 1818; Telnitz lost 22 houses in 1808; Augezd burned in 1794.
- "Not stated" means the sheet gives no key or label. I do not expand abbreviations or give meanings to colours from outside knowledge unless marked as inference.

## 0. Access, image structure, calibration and method

### 0.1 Tile and zoom scheme (from the detail page's JavaScript)
- `https://www.mza.cz/indikacniskici/skica/detail/<ID>` redirects to a numeric id. Its script builds an OpenSeadragon source with `getMZATileUrl(level,x,y)`.
- The base URL is `https://www.mza.cz/indikacniskici/data/obrazky/<ID>/Img/`, with five levels:

| level | URL | tiles per piece | scale |
|---|---|---|---|
| 0 | `map.jpg` | whole mosaic | thumbnail |
| 1 | `Preview/<S>.jpg` | 1 (217 x 174 px) | 1/12 |
| 2 | `little/<S>-<a><n>.jpg` | 3 x 3 | 1/4 |
| 3 | `Small/<S>-<a><n>-<b><m>.jpg` | 6 x 6 | 1/2 |
| 4 | `Normal/<S>-<a><n>-<b><m>-<c><k>.jpg` | 12 x 12 (2,604 x 2,088 px) | 1 |

- **Normal (level 4) is the highest resolution** (`maxLevel: 4`).
- `<S>` is the side (A = front, R = reverse) plus the row and column, e.g. `A05D`.
- Tile for a pixel (x, y) of a piece:
  - tile column lx = floor(x/217) and tile row ly = floor(y/174);
  - a = letter of floor(lx/4); n = floor(ly/4)+1;
  - b = letter of floor(lx/2) mod 2; m = (floor(ly/2) mod 2)+1;
  - c = letter of lx mod 2; k = (ly mod 2)+1.
- **A piece is one quarter of a numbered sheet.** The Sokolnice reverse side carries one sheet title per four pieces. Piece R02D reads:
  - centre: "Nro II / Gemeinde / SOKOLLNITZ / in / Mähren Brünner Kreis / 1825";
  - top: "Ost Coll IV 20 Sect c[?]", "Steuer Bezirk Sokolnitz", "9 Inspectorat";
  - bottom: "Verfaßt vom Adjunct 1ter Classe / Franz Knoblech[?]" and "Aufgenommen vom Geometer 1ter Classe / Wenzl Krautzky[?]".
  - Titles for Nro I–VII and "IV, VIII" are visible on the reverse mosaic.
  - So each piece is nominally 500 x 400 Klafter; its aspect 2604/2088 = 1.247 matches 1.25. Crop: `sokolnice_R02D_L3_reverse-sheet-title-NroII.jpg`.

### 0.2 Calibration (pixels per Klafter at level 4)
- **Nominal check:** a quarter sheet is 500 Klafter across 2,604 px, i.e. 5.21 px/Klafter = 2.746 px/m. This holds only if the scan spans exactly the quarter, so I used it as a check.
- **Method used:** modern RÚIAN parcel boundaries (ČÚZK ArcGIS, layer 5, in WGS84) were converted to a local true-north metric frame. They were fitted to the sketch's black ink lines by robust chamfer matching (scale, rotation and shift; bootstrap over halves of the lines).

| piece | px/m | px/Klafter | sheet rotation vs true north | note |
|---|---|---|---|---|
| Sokolnice A05D (village) | 2.764–2.788 | 5.24–5.29 | −0.5 to −0.7° | aspect fitted freely: 1.000 |
| Sokolnice A04E (castle) | 2.7215 | 5.16 | −0.25° | the modern granary falls on the drawn one |
| Telnice A03D | 2.775 | 5.26 | +0.56° | |
| Telnice A02D | 2.685 / 2.63 (x/y) | 5.09 / 4.99 | +0.4° | poorer fit; I used 2.69–2.75 |
| Prace A03C (standard) | 2.695 | 5.11 | −0.1° | |
| Kovalovice A06B+C (post) | 2.680 | 5.08 | −0.6° | road and buildings match the overlay |
| Kobylnice A04C | 2.70–2.81 | 5.1–5.3 | ±0.4° | unstable; the village has changed a lot |
| **Prace A07A/A08A (detail)** | **4.8 (±4%)** | **9.1** | – | ratio to A03C from shared features is 1.78–1.83 times |

- The Prace detail ratio comes from the yellow houses 11–24, the extent of the east row and the churchyard. It is not 2 times, so do not assume 1:1440.
- On standard pieces 1 px ≈ 0.36 m ≈ 0.19 Klafter.
- Sheet "up" is within 0.1–0.7° of true north, so the bearings below are true within about 1°.
- Errors: edge reading ±2–3 px (±1 m) on standard pieces and ±0.5 m on the Prace detail; scale ±2% (±4% on the detail).
- Widths are measured on the coloured wash and exclude the ink outline; add about 0.5–1 m for the outer line.

### 0.3 Measuring method
- Pieces were stitched and rotated so the street runs vertically (Sokolnice 16°, Telnice 37°).
- Measurements came from gridded crops and from colour masks:
  - pink/carmine: r−g > 28 and r−b > 38;
  - yellow: r > 150, g > 130, b < 115, g−b > 55 and r−g < 45 (it finds Prace's yellow buildings);
  - ink: dark and unsaturated.
- `plotmeasure.py` records per plot:
  - the plot width at the street;
  - the "long range": the pink range running back from the street front along a side boundary, with its length and width;
  - the built length of the street front ("frontage");
  - the depth of the street range.
- Medians are used; plots where the measurement failed are excluded and listed.

### 0.4 Availability check
A site search on 29 October 2026 found:
- **Újezd u Brna:** only MOR275818730 (1873), MOR275818980 (1898) and MOR275819130 (1913).
- **Žatčany:** only MOR304518730 (1873).
- **Měnín:** only MOR149218730 (1873) and MOR149219010 (1901).

So there is still no 1820s sketch for these three, and the 1873 sketches were not used. Each record links to the ČÚZK archive (`ags.cuzk.cz/archiv/?xy=…`); the 1820s imperial obligatory imprints there are a separate lead.

## 1. Village cores (Q1)

### 1.1 Sokolnice / Sokolnitz 1825 (MOR246318250)
**Pieces and URLs.** The village is on A05D, its north part on A04D, the castle on A04E and the pheasantry on A03E; all read at level 4.
- Green centre: `…/MOR246318250/Img/Normal/A05D-C1-A2-A2.jpg`.
- West row, plots 50–48: `…/Normal/A05D-C1-A2-A1.jpg`.
- East row, plots 22–24: `…/Normal/A05D-C1-A2-B1.jpg`.

**Form (B).**
- A long open green (black "146" written on it) runs N-S, with its axis about 16° west of north. Two rows of farmsteads face it.
- Width between building fronts, north to south: 52, 52, 51, 48, 45, 42, 41 m, and about 43–45 m at the south end. That is n = 8, median 46 m, range 41–52 m (22–27 Klafter).
- It is about 300 m long (about 158 Klafter). It closes to road width at the north and opens at the south onto an E-W road. The shape is a long wedge tapering south, not a symmetric spindle.
- Red survey tie lines with circles and figures cross the green; these are survey marks, not features.

**Plots (B).**
- They are narrow, deep and perpendicular to the green. The west row has 13 plots (red numbers 52 down to 40) and the east row 13 (red 20 to 32).
- Width at the street: median **21.7 m** (n = 25; range 10.8–36.1 m).
- Depth to the rear garden boundary: west row about 112 m (59 Klafter), east row about 83–110 m (±10 m).
- Behind every yard is a garden in green wash with tree symbols. Labels show the plot number in brackets, e.g. "(50)", and letters such as "W(25)" or "G w"; the abbreviations are not expanded on the sheet.

**Buildings (B).**
- Each farmstead is one pink mass drawn as an **L**: a range along the street front (long side to the green), and a long range running back along one side boundary, with its narrow end at the street corner.
- No division between dwelling and outbuildings is drawn, so **which part is the dwelling is not shown**.
- Forms counted in the stretch west 52–40 and east 20–32 (26 plots):

| form | plots |
|---|---|
| L or hook form | about 22 |
| straight range on the side boundary with only a stub at the street | 1 (49) |
| U-shaped corner farm (about 42 x 40 m including the yard, plus a separate range on its south boundary) | 1 (52) |
| compact block at the street | 1 (46) |
| wide plot with two deeper blocks | 1 (25) |

- The built street frontage is at least 60% of the plot width in 19 of 20 measurable plots.
- In the west row the long range is on the **north** boundary in 8 plots (51, 50, 45, 44, 43, 42, 41, 40) and on the south boundary in 3 (49, 48, 47). In the east row it is on the north boundary in every plot I read (20–32).

**Buildings at the back of the yard (B).**
- A separate pink building stands at or near the back of the yard in **6 of 26 plots**: west 44 and 40; east 20 (a block parallel to the street), 25, 26 and 32.
- None of them is yellow.
- Small pink houses with their own black numbers (e.g. "46", "50") stand at the far ends of the east-row gardens.

**Colours (B).**
- All village buildings are **pink** (light carmine; median RGB 178,135,110).
- There is **no yellow building in the village**: colour segmentation of A05D, A04D, A05E, A04F, A03D and A06D finds none. Three tiny yellowish specks on A05D are paper tone in strip fields (crop `sokolnice_A05D_L4_yellow-specks-are-paper-not-buildings.jpg`).
- Yellow appears only at a few manor buildings on A04E (section 3).
- The castle is a darker, saturated carmine (147,62,47).

**Numbers (B).**
- Each plot has a red number that runs in sequence along the row (52, 51, 50 …; 20, 21, 22 …) and falls within the title's "Bauparzellen 1 – 146".
- It also has a black number that does not run in sequence (92, 90, 89, 86 …; 31, 32, 35, 36 …). This is probably the house number (inference).
- The green itself is "146", the last building-parcel number on the title.

**Church, edges and water (B).**
- **No church or chapel is drawn** in the village. At the site of the modern Marian chapel on the green there is only the number "146" (crop `sokolnice_A05D_L4_green146-no-chapel-at-modern-site.jpg`). The castle has no chapel or cross symbol.
- Behind the west gardens is a lane, then a broad dark-brown band (a road; roads are brown bands throughout). Behind the east gardens is a path lettered "G"/"W", then strip fields.
- No fence, hedge, wall or ditch symbol appears at the village edges.
- Water: a pale-blue pond lies south-east of the village (section 3.5), and a blue stream runs east of the manor area.

**Not established.** Where the dwelling sits within the L; storeys, roofs and materials (the pink/yellow difference is the sheet's own but is not explained on it); anything about 1805.

**Crops:**
- `sokolnice_A04D-A05D-A04E-A05E_L4_overview-village-castle_q25.jpg`
- `sokolnice_A04D-A05D_L4_village-green-rotated16.jpg`, `sokolnice_A04D-A05D_L4_village-plots-depth-rotated16.jpg`
- `sokolnice_A04D-A05D_L4_westrow-1-cornerfarm52-rot16.jpg` through `…_westrow-5-plots43-40-rot16.jpg`
- `sokolnice_A04D-A05D_L4_eastrow-1-plots20-23-rot16.jpg` through `…_eastrow-3-plots27-32-rot16.jpg`
- `sokolnice_A05D_L4_modern-RUIAN-parcels-overlay.jpg`, `sokolnice_A05D_L4_survey-tie-lines-on-green.jpg`, `sokolnice_A05D_L4_building-segmentation-sample.jpg`

### 1.2 Telnice / Tellnitz 1825 (MOR265518250)
**Pieces and URLs.** The NE half and the church are on A02D; the SW half and the pond are on A03D; level 4.
- Church: `…/MOR265518250/Img/Normal/A02D-B3-B2-B1.jpg`.
- Pond: `…/Normal/A03D-A2-B1-A2.jpg`.
- A seam between the two pieces crosses the village; I measured nothing across it.

**Form (B).**
- One straight street runs SW-NE (bearing about 37°). It is about 600 m from the pond at the SW end to the stream at the NE end, with a row of farmsteads on each side.
- The street is **about 21 m** between building fronts (n = 12; median 20.7 m, range 15.6–27.0 m, 10.9 Klafter), a little wider to the SW. A thin red survey line runs along it.
- This is a moderately wide street, not a broad green like Sokolnice.

**Plots (B).**
- Perpendicular to the street. Width: median **22.4 m** (n = 14; range 18.2–30.9 m).
- Depth, approximate (±20 m): NW row about 110 m to the stream side, SE row about 60 m.

**Buildings (B).**
- Pink **L-forms**: a range along the street front plus a long range along the plot's **NE** boundary. This holds for all 14 measured plots (NW row red 40 to 32; SE row red 9 to 13). A few have a short return at the far end, making a U.
- The built frontage is at least 60% of the plot width in 10 of 14 plots; the other 4 are at 0.42–0.59, partly from measurement error.
- A separate building at the back of the yard appears in 1 of 10 plots checked (NW row plot 37).
- **No yellow building** on A02D, A03D, A02E or A03C. Two small yellowish patches are paper tone (crop `telnice_A02D-A03C_L4_yellowish-patches-not-buildings.jpg`).
- Houses are pink (median 165,107,96).
- The red numbers run in sequence (9–13 and 32–40) within the title's "Bauparzellen 98". The black numbers (88, 87, 84 …) do not, and are probably house numbers (inference).

**Gardens (B).**
- Dark-green gardens with trees lie behind both rows. On the NW side they run down to the stream (a blue line with a light-green strip).
- Small separate pink houses stand in the NW gardens near the stream and at the far ends of the SE gardens.

**Church (B).**
- It stands at the **NE end, inside the built-up area**, on the SE side of the street. It is in a light-green polygonal churchyard with small black grave crosses, divided into two parts; the red numbers include "96".
- Plan (crops `telnice_A02D_L4_church-plan-zoom4x.jpg`, `telnice_A02D_L4_church-plan-mask.jpg`):
  - **West end:** a square about 6.3 x 8 m with a dark outline, left light grey/white rather than carmine. By position and shape it is a tower base (inference; not labelled).
  - **Nave:** deep carmine, about 17.8 m long and about 9.7 m wide including the outline.
  - **East end:** a narrower rounded projection, about 7 x 6.3 m; an apse by shape (inference).
  - **North side:** a small annex near the east end, about 5.6 x 4 m.
  - A black cross is drawn on the nave.
- Total length about 31 m (by eye) to 34 m (from the mask), ±1.5 m.
- Axis bearing **about 97°**, tower west and apse east. The modern church's axis is about 111°, a difference of about 14° that the sketch does not explain.
- A pink building beside the churchyard is labelled in script "Pfarrey[?] 3".

**Pond, stream and edges (B).**
- At the SW end is a blue four-sided pond, about 91 x 69 m, labelled in cursive "Gem. / Telnitz / Weiher" with a red parcel number (crop `telnice_A03D_L4_pond-Weiher.jpg`). A road with trees runs along its west side.
- The stream runs along the NW side of the village to its NE end.
- "Gem. Telnitz Hutw[eide]" (light green) lies east of the village.
- No fence, hedge, wall or ditch symbol appears.

**Not established.** The village before 1808, when it lost 22 houses; the dwelling within each L; why the church axis differs.

**Crops:**
- `telnice_A02D-A03D_L4_overview.jpg`, `telnice_A02D-A03D_L4_village-rotated37.jpg`
- `telnice_A02D-A03D_L4_street-NE-part-rot37.jpg`, `…_street-middle-rot37.jpg`, `…_street-SW-part-rot37.jpg`
- `telnice_A02D-A03D_L4_eastrow-plots9-13-rot37.jpg`, `telnice_A02D-A03D_L4_westrow-plots40-36-rot37.jpg`
- `telnice_A02D_L4_NE-end-church-rot37.jpg`, `telnice_A02D_L4_church-churchyard-zoom.jpg`
- `telnice_A03D_L4_pond-Weiher.jpg`, `telnice_A02D-A03D_L4_modern-RUIAN-overlay.jpg`

### 1.3 Prace / Pratze 1826 (MOR205818260)
**Pieces and URLs.** The built-up area is drawn twice: at standard scale on A03C, and on two **detail pieces**, A07A (core) and A08A (south part and church), at about 4.8 px/m. All read at level 4.
- East row: `…/MOR205818260/Img/Normal/A07A-B2-B2-B2.jpg`.
- Church on the detail: `…/Normal/A08A-B2-A1-A2.jpg`.
- Church on the standard piece: `…/Normal/A03C-A2-A2-B2.jpg`.

**Form (B).**
- A N-S main street carries black "116", the last number of the title's "Bauparzellen 1 bis 116". Farm rows stand on both sides.
- The street is about 21–33 m between fronts (n = 4; median about 24 m), widening to the south.
- In front of most east-row houses, on the street, is a small dark-green **stippled rectangle** of about 5–6 x 8–9 m (meaning not stated).
- At the north end an E-W road has small yellow houses on its north side and a row of narrow plots (90–95) facing it.
- A brook (blue band) crosses W-E south of the farm rows. A small rectangle marks where the street crosses it (a bridge? not stated); the brook then turns south.
- The south part (A08A) is a cluster of small pink and yellow buildings along a lane.

**Plots (B).**
- East row width: median **21.9 m** (n = 8; range 18.8–31.2 m).
- East row depth about 85–100 m (yard about 46 m, garden about 55 m). West row depth about 100 m.

**Buildings (B).**
- All 17 farm plots on the main street carry pink **L-forms**, except one stepped block (74). The plots are east-row parcels 9, 10, 13, 14, 17, 18, 21, 22, 25 and west-row parcels 89, 86, 85, 82, 81, 78, 77, 74.
- Each L is a street range (long side to the street) plus a long range along the plot's **north** boundary.
- The built frontage is at least 60% of the plot width in all 8 measured east-row plots.
- So the lead's "mostly long blocks set perpendicular to the street, narrow end on the street" is **not** what the detail shows. The perpendicular range is there, but almost every plot also has a street range of 13–24 m.

**Yellow buildings (B) — confirmed.**
- A **yellow** building stands at the back of the yard, where the yard meets the garden, in **8 of 9** east-row plots (not plot 21) and in about 5 of 8 west-row plots (89, 86, 78, 77 and probably 82). That is about 13 of 17 plots.
- Their size is about 6–10 x 5–8 m (median about 8.3 x 6.3 m; mask areas 15–70 m², median about 36 m²). They stand 26–50 m behind the street front.
- Other yellow buildings are **separate numbered houses**:
  - at the far east ends of the east gardens (black building-parcel numbers 11, 12, 15, 16, 19, 20, 23 and 24 on yellow rectangles);
  - at the far west ends of the west gardens (75, 76, 79, 80, 84, 87, 88);
  - along the north road.
- So not every yellow building is a barn.

**Colours and numbers (B).**
- Houses are pink (median 194,142,127), with no difference between street ranges and long ranges. Yellow buildings are 160,139,67. The church is a darker carmine (158,98,92).
- The black numbers in sequence (9, 10, [11, 12 yellow], 13, 14 …) are building-parcel numbers. The red "N. 8", "N. 9" … are house numbers.
- Garden labels give owner, house number and "o.g.", e.g. "Thuma Anton N.8 o.g." (abbreviation not expanded).

**Church and water (B).**
- The church is described in section 4: outside the farm rows, south of the brook, in its own churchyard.
- East of the village is a light blue-grey elongated area labelled in cursive **"Lachen"**, with red "713" and trees along its north edge (crop `prace_A03C_L4_pond-Lachen.jpg`).

**Edges (B).** No fence, hedge, wall or ditch symbol. Gardens end at back lanes, where the yellow numbered houses stand.

**Later additions on the standard piece.**
- A03C shows a row of small houses with black building-parcel numbers **120–124** next to the churchyard.
- The 1826 detail piece A08A does not show them, and the title counts only 116/117 building parcels.
- They are probably later additions to A03C (inference). For the 1826 state, use the detail pieces.

**Not established.** The village in 1805 (fires in 1805, 1814 and 1818); what yellow means (timber is the usual reading, but no key on the sheet says so).

**Crops:**
- `prace_A07A_L4_detail-village-overview.jpg`
- `prace_A07A_L4_eastrow-1-plots9-17.jpg`, `prace_A07A_L4_eastrow-2-plots18-25.jpg`
- `prace_A07A_L4_westrow-1-plots95-85.jpg`, `prace_A07A_L4_westrow-2-plots82-74.jpg`
- `prace_A08A_L4_detail-south-and-church-overview.jpg`
- `prace_A03C_L4_village-north.jpg`, `prace_A03C_L4_village-middle.jpg`, `prace_A03C_L4_village-south-church.jpg`
- `prace_A03C_L4_building-segmentation.jpg`, `prace_A03C_L4_brook-crossing-street116.jpg`, `prace_A03C_L4_pond-Lachen.jpg`
- `prace_A07A-A03C_L4_scale-ratio-yellow-houses.jpg`, `prace_A01A_L4_title-Riede-table.jpg`

### 1.4 Kobylnice / Kobelnitz and Ponětovice / Puntowitz 1825 (MOR102418250)
**Pieces and URLs.** Kobylnice is on A04C and Ponětovice on A02D; level 4.
- Kobylnice green: `…/MOR102418250/Img/Normal/A04C-B2-B1-B1.jpg`.
- Ponětovice green: `…/Normal/A02D-A2-B2-B1.jpg`.
- The title (A01A) reads "Kobelnitz samt Enclave Puntowitz".

**Kobylnice — green and plots (B).**
- A broad N-S green carries black "60", the red section numeral "I" (a tall red bar with serifs) and a large red dot.
- Between fronts it is about 24–38 m in the middle (n = 3: 38, 27, 24 m) and about 50–60 m at the north end, where the west houses are set back.
- At the north end is an enclosed parcel with a pink U- or H-shaped building round a yard ("1").
- East-side plots are about 20 m wide (side-boundary spacing 29, 20, 20, 21.8, 20, 20 and 14.5 m).

**Kobylnice — buildings and land (B).**
- Buildings are pink. The west row has L-forms with long continuous street ranges. The east row has street ranges along the green (long side to the green), with arms running east along the plot's **north** boundary.
- Gardens with trees lie behind both rows, then strip fields with owners' names and house numbers in brackets: "Klaschka Johann (3)", "Swoboda Jiljg", "Wanniger Johann (5)", "Kratochwila Jiřj".
- Three small **yellow** squares (about 6 x 6 m) stand in yards of the south part.
- South of the village is a large rectangle (about 70 x 74 m) with long pink ranges on its west and south sides and black "20". It is a manor farm by its form (inference).

**Kobylnice — church and the meadow west (B).**
- **No church is drawn.** On the green is a black Latin-cross **symbol** with no footprint, at A04C (1636, 565) (crop `kobylnice_A04C_L4_cross-symbol-on-green.jpg`). The modern Marian chapel is on the same green, about 30 m from the symbol by my unstable fit.
- **West of the village** (crop `kobylnice_A04C_L4_meadow-west-462.jpg`) is a large uniform pale-green wash with many small grass-tuft symbols, red "462" and section "VII".
  - Owner text: "Graf Dittrichstein Proskau Franz Joseph[?]". Below it is a large flourished cursive word I cannot read ("Wies…"[?]).
  - **No water, dam or pond symbol is drawn there in 1825.** Whether it was a former pond basin is not stated on the sheet.
  - Its east edge is a road with tree symbols along the village's west side.

**Ponětovice (B).**
- A rectangular E-W green (black "38") lies between two rows, about 24–26 m wide and about 207 m long.
- The "band across the green" is the red section numeral "I", not a building (crop `ponetovice_A02D_L4_red-numeral-I-not-building.jpg`).
- Plots are about 17–20 m wide; the built block is about 31 m deep.
- The farmsteads are **closed courtyards**: a continuous pink range along the green (long side to the green), side ranges and a back range round a small light yard. This holds in nearly every plot of both rows (north row parcels 10–19, south row about 1–10).
- Gardens with trees lie behind.
- At the east end is a strip of very small parcels with small pink buildings and a block of tiny parcels with dense dark stippling. The green opens east onto the SW-NE road.
- No church or chapel was found, and no yellow building.

**Crops:**
- `kobylnice_A04C_L4_village-north.jpg`, `kobylnice_A04C_L4_village-south-manor.jpg`, `kobylnice_A04C_L4_green60-rows-zoom.jpg`
- `kobylnice_A04C_L4_meadow-owner-label.jpg`, `kobylnice_A01A_L4_title-lists.jpg`
- `ponetovice_A02D_L4_green38-village.jpg`, `ponetovice_A02D_L4_green-west-enclosed-yards.jpg`, `ponetovice_A02D_L4_green-east.jpg`

## 2. Measurements (Q2)
Calibration is in section 0.2. Values are on the coloured wash; add about 0.5–1 m for the outline. In the tables, "long range" is the range running back from the street along a side boundary, and "street range" is the range along the street front.

**Sokolnice (A05D, 2.77 px/m ±2%).** 25 plots measured; building statistics use the 20 regular L plots.

| quantity | n | median | range |
|---|---|---|---|
| plot width at street | 25 | 21.7 m (11.4 Kl) | 10.8–36.1 m |
| plot depth | about 6 | west about 112 m (59 Kl); east 83–110 m | ±10 m |
| long range length | 20 | 34.3 m (18.1 Kl) | 22.4–48.7 m |
| long range width | 18 | 7.8 m (4.1 Kl) | 3.6–14.1 m |
| built street frontage | 20 | 19.0 m (10.0 Kl) | 11.2–25.3 m |
| street range depth | 20 | 7.6 m (4.0 Kl) | 2.9–11.6 m |
| separate rear buildings | 6 of 26 plots | about 80 m² | 60–180 m²; 26–48 m behind the front |
| green width | 8 | 46 m (24.5 Kl) | 41–52 m |
| green length | 1 | about 300 m (158 Kl) | ±10 m |

**Telnice (A02D/A03D, 2.75 px/m ±2%).**

| quantity | n | median | range |
|---|---|---|---|
| plot width at street | 14 | 22.4 m (11.8 Kl) | 18.2–30.9 m |
| plot depth | – | NW row about 110 m; SE row about 60 m | ±20 m |
| long range length | 14 | 35.6 m (18.8 Kl) | 30.5–44.4 m |
| long range width | 13 | 6.2 m (3.3 Kl) | 4.0–7.6 m |
| built street frontage | 14 | 16.5 m (8.7 Kl) | 9.1–21.1 m |
| street range depth | 14 | 6.9 m (3.6 Kl) | 4.4–9.1 m |
| street width | 12 | 20.7 m (10.9 Kl) | 15.6–27.0 m |
| church | 1 | about 31–34 m long; nave about 9.7 m wide (16–18 x 5.1 Kl) | tower square about 6.3 x 8 m; apse about 7 x 6.3 m |
| pond "Weiher" | 1 | about 91 x 69 m | ±3 m |

**Prace (detail pieces A07A/A08A, 4.8 px/m ±4%).**

| quantity | n | median | range |
|---|---|---|---|
| plot width at street (east row) | 8 | 21.9 m (11.5 Kl) | 18.8–31.2 m |
| plot depth | – | east about 85–100 m; west about 100 m | ±10 m |
| long range length, east row (pink part) | 8 | 33.5 m (17.7 Kl) | 24.2–47.3 m |
| long range length, west row (by eye) | 6 | about 39 m | 37–54 m |
| long range width | 7 | 6.2 m (3.3 Kl) | 5.4–10.0 m |
| built street frontage | 8 | 15.1 m (8.0 Kl) | 13.3–24.4 m |
| street range depth | 8 | 6.3 m (3.3 Kl) | 5.0–8.8 m |
| yellow rear building | 8 of 9 east plots (about 13 of 17) | about 8.3 x 6.3 m (about 36 m²) | 15–70 m²; 26–50 m behind the front (median about 41 m) |
| street width | 4 | about 24 m (12.6 Kl) | 21–33 m |
| church | 1 | 27.9 x 13.8 m (14.7 x 7.3 Kl) | apse 6 x 8.8 m; west projection 3.8 x 3.5 m |
| churchyard | 1 | about 47 x 40 m | round/polygonal |

**Kobylnice and Ponětovice (2.75 px/m ±3%; fits unstable).**
- Kobylnice: plots about 20 m wide (n = 7, range 14.5–29 m); green 24–38 m (n = 3) and 50–60 m at the north end.
- Ponětovice: green about 25 x 207 m; plots about 17–20 m; built block about 31 m deep.

**Sokolnice castle (A04E, 2.7215 px/m ±2%; carmine mask).** Crop: `sokolnice_A04E_L4_castle-carmine-mask-measure.jpg`.

| quantity | value |
|---|---|
| outer block | 79.6 x 60.0 m = 42.0 x 31.6 Kl (±1 m) |
| long axis | bearing about 103° (long sides WNW-ESE) |
| area inside outer edge / carmine area | 4,557 m² / 3,363 m² |
| courtyard | 39.1 x 34.2 m = 20.6 x 18.0 Kl; 1,268 m² |
| range depths | west about 15 m, east about 26 m, north about 14 m, south about 17 m |
| granary "10" | 35.5 x 16.5 m (mask); long axis bearing about 77° |

**Comparison with today (not 1825 evidence).**
- The modern castle (OSM; RÚIAN parcel 374) is 61.9 x 52.2 m with its long sides NNE-SSW, and its courtyard is 1,052 m².
- The N-S extent agrees (about 60 m), but the drawn block is about 28 m longer east-west, almost all of it in the deeper east range.
- The sketch does not say why: a demolished east range and a drawing simplification are both possible.

## 3. Sokolnice castle area at the highest resolution (Q3)
**Pieces and URLs.** A04E (castle, manor farm, park) and A03E (pheasantry), level 4.
- Castle: `…/MOR246318250/Img/Normal/A04E-A2-B1-A1.jpg`; granary: `…/Normal/A04E-A2-A2-A1.jpg`.
- Parcel 620: `…/Normal/A04E-A1-A2-B1.jpg`.
- Manor farm: `…/Normal/A04E-A2-B1-A2.jpg` and `…/Normal/A04E-A2-A2-B1.jpg`.
- Pond 627: `…/Normal/A04E-A3-A2-A2.jpg` and `…/Normal/A05E-A1-A1-A1.jpg`.
- Pheasantry: `…/Normal/A03E-B2-A2-A2.jpg`.

**Line styles seen (there is no key on the sheet).**

| what is drawn | how |
|---|---|
| parcel boundaries | thin black lines (some heavier) |
| roads | brown bands, light brown to dark sepia/maroon, often with a red line on one edge |
| streams | blue lines |
| water | blue or pale blue-grey wash |
| territory boundary | pink band with a red line |
| pheasantry | dark grey wash with tree symbols |
| gardens | green with tree symbols |
| meadow | light green or blue-green with grass tufts |
| buildings | pink; the castle a deeper carmine; a few yellow |

**No line anywhere in the castle area has a distinct wall or fence symbol**: no double, hatched or castellated line, and no thick carmine line on its own.

**3.1 Castle (B).**
- A **closed quadrangle**, carmine all round, with a light courtyard carrying red "57" and black "7".
- The four ranges are **not equal**: the east range is drawn about 1.7 times as deep as the others. No gate passage is drawn.
- A heavy black parcel line runs along its north side.

**3.2 West of the castle (B).**
- Parcel **620** (red number) is unwashed; the sheet's green for gardens and orchards is not used on it. It carries the script "Gemeinde[?] / Sokollnitz a" and "(54)".
- It is bounded on the west by a dark red-brown road band, on the east by a thin black line with a few tree or bush symbols drawn along it, and on the south by a heavier black line.
- At its north end is a narrow green garden, **619**, with two small pink buildings (about 15 x 16 m and smaller) and a small hatched square. South of it is parcel **621**, also unwashed.
- **No wall line is drawn round 620 or 619.** The "walled orchard west of the castle" is not on this sketch as a walled orchard.
- The modern wall (OSM way 487390686) follows 620's west and south sides, where the sketch shows only the road band and parcel lines (crop `sokolnice_A03E-A04E_L4_modern-OSM-walls-overlay.jpg`).

**3.3 Pheasantry (B).**
- Labelled "**Fasangarten**" in large script, with red section "III". The owner script reads "Dietrichstein Franz Graf als[?] Herrschaft Sokollnitz". The title's table also names section III "Fasangarten" (parcels 366–378).
- It is a dark grey wash with tree symbols, about 0.38–0.43 km E-W and about 0.62 km N-S (about 0.25 km² by the level-2 mask), narrowing south toward the castle.
- A light-green avenue with tree rows runs N-S through it, with a blue line along its west side. The avenue has an **oval loop** enclosing parcel "Sokollnitz 374 Acker".
- Its edges:
  - **North:** the colour edge against a light blue-green meadow ("Wiese", 378 a) along a thin parcel line.
  - **West:** a stream (blue line) and a light-green strip; beyond them a broad grey-brown band with a red line and a large red number "24[4?]9", a road-type parcel number.
  - **East:** a dark maroon-brown band about 11 m wide with a red line on its west edge; a road, judging by its colour and the lettering along it.
  - **South:** parcel 7 and the castle parcels.
- **Nothing encloses the whole pheasantry except these parcel lines, roads and the stream**; nothing drawn can be told apart as a wall or fence.
- The modern walls along its east side follow the drawn east edge and road band within about 10–20 m, but the 1825 drawing shows no wall there.
- Crops: `sokolnice_A03E_L4_pheasantry-north-edge.jpg`, `sokolnice_A03E_L4_pheasantry-east-edge-road.jpg`, `sokolnice_A03E_L4_pheasantry-west-edge-stream.jpg`, `sokolnice_mosaic_L2_pheasantry-castle-park.jpg`, `sokolnice_mosaic_L2_pheasantry-dark-wash-mask.jpg`.

**3.4 Granary.**
- **B:** a pink rectangle with black "**10**", 35.5 x 16.5 m, long axis about 13° north of east. It stands at a road junction SW of the castle, at the east end of a light-green strip with a thin line along its north edge.
- **Identification (inference, strong):** the modern granary (OSM way 120172453; 39.9 x 12.7 m, long axis 14° north of east) falls on it in the fit.
- **It is not drawn beside a pond**: no water is drawn next to it (crop `sokolnice_A04D-A04E_L4_manor-farm-and-granary10.jpg`).

**3.5 Pond (B).**
- About 325 m south of the granary (about 480 m SSW of the castle) is a **pale blue-grey** parcel, red "627", with owner script "…Herrschaft … Sokollnitz". An unwashed oval parcel "626" lies in its north part. A road band bounds it on the south and east.
- Its colour (151,157,137) is bluer than the meadows but paler than the Telnice "Weiher" (128,142,142).
- The modern street "U Rybníka" ("At the pond") maps onto it.
- Whether it held water in 1825 is not stated (crop `sokolnice_A04D-A05D-A05E_L4_pond627-pale-blue.jpg`).

**3.6 Manor farm south of the castle (B).** All buildings are pink. Two yards are split by the N-S road:
- **North range:** one long range, 57 m west of the road and 94 m east of it, about 8 m wide.
- **West yard:** a west range of about 81 m and a south range of about 74 m. Inside are red "56." and black "11", and a small dark-green stippled square.
- **East yard:** black "13", a diagonal SE range of about 60 m and a short south bar.
- **South of the west yard:** small buildings "12" (parcel 55).

**3.7 Other (B).**
- At the SE corner of the pheasantry is an enclosure (house "4") with:
  - a pink range on its north side;
  - a narrow reddish band on its east side by the road;
  - a small **yellow** building of about 11 x 12 m;
  - a dark-green stippled garden.
  - Crop: `sokolnice_A04E_L4_enclosure-house4-yellow-building.jpg`.
- East of the castle is the park: an oval light-green area with trees (616, section "VII"), lettered "Schloss Sokollnitz" in print.
- North of the castle is a large unwashed parcel "7.".

**Cannot tell:** whether any boundary was walled in 1825, since the sketch has no wall symbol to show it; the 1805 state.

## 4. Prace church: plan and position (Q4)
**Plan (B), detail piece A08A.** Crops: `prace_A08A_L4_church-zoom3x.jpg`, `prace_A08A_L4_church-plan-mask.jpg`, `prace_A08A_L4_church-environs-1826-detail.jpg`.

| part | what is drawn |
|---|---|
| body | carmine main rectangle, 18.3 x 13.8 m, with a large black cross pattée drawn on it |
| east end | a rounded projection, 6 x 8.8 m (an apse by shape) |
| west end | a narrow projection, 3.8 x 3.5 m, on the axis (porch or tower base; not stated) |
| total length | 27.9 m (27–29 m) |
| axis | bearing about 93°, W-E (modern church about 88°) |

**Churchyard (B).**
- Round or polygonal, about 47 x 40 m, light green with a thin black outline, grave crosses, red "66" and a short tongue to the south. A black "T." sign stands just north of it (not explained).
- On A08A it stands on **unwashed open land**: about 29 m from its east edge to building "61" (NE), and about 60 m to the west edge of the south cluster.

**Position, measured on the standard piece A03C** (2.695 px/m; church centre at pixel (318, 1347); sheet-up = north within 0.1°):

| from | distance | bearing to the church |
|---|---|---|
| midpoint of the main street between the farm rows | 276 m (146 Kl) | 194° |
| where the main street crosses the brook | 145 m (76 Kl) | 201° |
| area-weighted centre of all buildings | 250 m (132 Kl) | 199° |

**Reading.**
- In 1826 the church stands **SSW of the village core, south of the brook, apart from the farm rows**, with only the small south cluster to its east.
- Caution: A03C shows houses 120–124 about 25–35 m east of the churchyard; as explained in section 1.3, they are probably later additions.

**The hill.**
- The sketch draws no relief. The field section to the south is named on the title "Za Kostellem" ("behind the church", parcels 1157–1368).
- Modern terrain (ČÚZK DMR5G, a modern elevation model, not the sketch):
  - main street at the core about 243 m; brook 239.5 m;
  - church site 254 m, with the ground still rising south to 256–258 m.
- So the church stands on a north-facing slope about 15 m above the brook, not on a summit.
- "Outside the village" fits the sketch; "on the hill" is not shown by it.

## 5. The post house on the Brünn-Olmütz highway (Q5)
**Found on the Kovalovice 1826 sketch** (MOR108718260; its record lists "Další obce: Stará Pošta (Posoritzer Post.)"). Piece A06B (with A06C), level 4; tile `…/MOR108718260/Img/Normal/A06B-C2-B2-A2.jpg`.

**Labels (B).**
- Bold print-style label **"Posoritzer Post."**; the "z" looks added by hand. Below it, in cursive, "Löffler Carl" (owner of the large parcel to the west, red "1051").
- **Further east,** past the territory boundary: cursive "**Nach Olmütz**".

**Highway (B).**
- A band about 15 m wide including its edges, in light red wash with a darker strip, with single upright (poplar-like) tree symbols on both sides.
- On its north side is a light-green strip lettered "…k Strassenfond." (a road-fund strip); the road parcel is red "1421".

**Buildings (B).**
- **The post complex lies north of the highway.** Pink ranges stand round a light yard (black parcel "128", red "65", "a"), with a range facing the road and a N-S wing. They sit in a polygonal enclosure with a green tree garden ("No 65 hg").
- **West of it** is a small complex "129" with a tiny yellow square.
- **Across the road (south)** is a second farmstead, "131" / red "No 64": pink ranges round a yard with one **yellow** building of about 7 x 20 m. Script reads "…einert Anna" and "No 64 hg a.".
- A small pink building "130" stands by the road.

**Crops:** `kovalovice_A06B_L4_overview-Posoritzer-Post.jpg`, `kovalovice_A06B-A06C_L4_post-house-complex.jpg`, `kovalovice_A06B_L4_post-house-zoom.jpg`, `kovalovice_A06B_L4_label-Posoritzer-Post.jpg`, `kovalovice_A06C_L4_highway-Strassenfond-strip.jpg`, `kovalovice_A06C_L4_label-Nach-Olmuetz.jpg`.

**Georeference (measured).**
- The RÚIAN fit of A06B+C gives 2.680 px/m, rotation −0.6°, bootstrap standard deviation 0.0007.
- Modern road edges coincide with the drawn band, and modern buildings stand on the drawn complexes (crop `kovalovice_A06B-A06C_L4_post-modern-RUIAN-overlay.jpg`).
- Positions (±15 m):

| point | position |
|---|---|
| post yard (north complex) | **49.18547 N, 16.82614 E** |
| its range facing the road | 49.18513 N, 16.82636 E |
| highway centre in front of it | 49.18500 N, 16.82633 E (the drawn road runs at a bearing of about 79°, WSW-ENE) |
| south complex "131" yard | 49.18465 N, 16.82751 E (about 135 m SE, across the road) |
| modern "Stará Pošta" no. 430 (OSM) | 49.18519 N, 16.82624 E — the same site |

- Distances from the post yard to modern church and village points (OSM):

| to | distance | bearing |
|---|---|---|
| Holubice church | 1.57 km | 218° |
| Kovalovice village centre | 1.34 km | 349° |
| Kovalovice chapel | 2.23 km | 345° |
| Pozořice church | 3.71 km | 314° |
| Tvarožná church | 3.70 km | 278° |

**A second inn on the same highway: Holubice 1826** (MOR071418260; its record lists "Holubská Hospoda (Holubitzer Wirthshaus)").
- **B:** bold label **"Hollubitzer Wirthshaus"** beside a small group south of the highway on piece A02B (tile `…/MOR071418260/Img/Normal/A02B-B3-A2-B1.jpg`).
  - Buildings: two pink blocks and a pink U-shaped building open to a light yard, labelled black "62" and red "No 34". A small pink "63" stands in a green parcel to the west.
  - A light-green N-S strip crosses the road. Field names are "Pod Silniczau" and "Nad Bahny".
  - Crops: `holubice_mosaic_L2_Hollubitzer-Wirthshaus.jpg`, `holubice_A02B-A03B_L4_Wirthshaus-buildings.jpg`.
- **Georeference (rough):** fitting modern parcels fails here because of the motorway and field consolidation. Fitting the modern cadastral-territory polygon to the drawn territory boundary gives about **49.1843 N, 16.8073 E (±150 m)**, about 1.4 km west of the post.
- This position and the road bearing drawn at the post (about 79°) do not fully agree. The road may bend; the inn's N-S position is the weak part.

**Pozořice and Tvarožná.**
- Tvarožná: the highway crosses the south of the territory as an avenue with no building on it (crop `tvarozna_mosaic_L2_highway-no-buildings.jpg`).
- Pozořice: the south tip of the territory meets Holubice and Kovalovice without the highway inside it. Nothing labelled Post or Wirthshaus was seen (crop `pozorice_mosaic_L2_south-end.jpg`, level 2 only).

## 6. Legend, colour key and symbols (Q6)
**No legend or colour key is printed on any piece I examined.** That covers:
- the title pieces of Sokolnice, Telnice, Prace and Kobylnice (crop `titles_A01A_L4_sokolnice-telnice-prace-kobylnice.jpg`);
- the Sokolnice reverse side;
- Kovalovice A02A, which holds lists of measured chainages ("ab g/a 14.0 18.3 …", "bc", "cd" …, each with a black "g" row and a red "a" row), not a key (crop `kovalovice_A02A_L4_chainage-lists-not-legend.jpg`).

**What the title pieces say, as read.**
- **Sokolnice A01A:** a section table I–XXI with "von/bis", e.g. "III Fasangarten 366-378" and "VIII Orts-Ried 642-755"; "Wegparzellen 2398 - 2442", "Flussparzellen 2443 - 2444", "Bauparzellen 1 - 146", "Summa aller Parzellen 2590".
- **Telnice A01A:** "Grundparzellen 1353", "Bauparzellen 98", "Suma 1451".
- **Prace A01A:** "Gemeinde PRATZE" and a table "Benennung der Riede". The Riede are listed below; the totals are "Grundparzellen 1368", "Wegparzellen 23", "Bachparzellen 3", "Bauparzellen 117", "Summa aller Parzellen 1511".

| Ried | parcels |
|---|---|
| Bauparzellen | 1 bis 116 |
| Orts Ried | 1–79 |
| Za Lauczky[?] | 80–146 |
| Od Puntowska | 147–245 |
| Padielky | 246–355 |
| Od Kawkowska[?] | 356–543 |
| U Lauže[?] | 544–632 |
| Na Niwkach | 633–726 |
| Kopcach | 727–858 |
| Przičky | 859–957 |
| Winohrady | 958–993 |
| Antehly[?] | 994–1088 |
| Na Stwerty[?] | 1089–1156 |
| Za Kostellem | 1157–1368 |

- **Kobylnice A01A:** "Kobelnitz samt Enclave Puntowitz", 1825, with lists of Riede for each.

**Symbols and washes seen** (meanings not stated on the sheets unless a label says so):
- **Building washes:** pink/light carmine; a deeper carmine for the castle and both churches; yellow.
- **Crosses and signs:**
  - a black cross pattée or Latin cross on church plans;
  - small black grave crosses in churchyards;
  - a black cross symbol on the Kobylnice green;
  - a black "T." beside the Prace churchyard.
- **Small marks:**
  - small dark-green stippled squares in yards (Sokolnice) and in front of houses (Prace);
  - a small hatched square (Sokolnice 619);
  - survey points (small circles) with red tie lines and paired figures.
- **Trees and land washes:**
  - deciduous tree symbols in gardens and parks; upright tree symbols along the highway; grass tufts on meadows;
  - dark grey wash with trees (pheasantry); green (gardens); light green or blue-green (meadow, pasture).
- **Water:** light blue or blue-grey wash (ponds); blue lines (streams).
- **Roads and boundaries:** brown bands (roads); a pink band with a red line (territory boundary); red Roman numerals (sections).
- **Letters after owners' names:** "a", "hg", "W", "G", "GW", "o.g.", "D W" — not expanded on the sheets.

## 7. The other 1826 villages (Q7)
These were read at level 3 (half resolution) on each sketch's village enlargement. That is enough for the pattern but not for measurement. Yellow counts come from colour segmentation, checked by eye.

| village (ID, pieces) | street form | dwelling ranges | yellow and rear buildings | church |
|---|---|---|---|---|
| Jiříkovice (MOR092918260, A09D) | one W-E street, two rows | pink, mostly perpendicular to the street, some L | about 10 small yellow at the far ends of the north garden strips; a few in yards | none on the enlargement; a large "Meyerhof"[?] complex to the east |
| Blažovice (MOR011518260, A07A+A08A) | N-S street/green with a dense block between two lanes; continues N-S to the south | pink, many L, mixed orientation | many yellow at the ends of garden strips and in yards | not identified at level 3 |
| Šlapanice (MOR242018260, A09A–A10B) | dense, like a market town, along a stream and a N-S main street | pink, many gable-on-street, some L | few | carmine cross-shaped church at the north end of the main street, **inside** the built-up area |
| Holubice and Kruh (MOR071418260, A08A–A09B) | irregular villages round curving greens | pink, mixed | almost none | not identified at level 3 |
| Křenovice (MOR113218260, A07A–A07B) | two parallel SW-NE rows | pink, perpendicular to the street, short wings | about 15 small yellow at the back of the gardens; a few in yards | none on the enlargement; a manor complex to the west |
| Hostěrádky and Rešov (MOR077618260, A07A–A07B) | an E-W street; a central green in Rešov | pink, perpendicular, with L-wings | none | not identified |
| Tvarožná (MOR273018260, A12A–A12C) | long W-E street-green with a stream | pink, mostly perpendicular, short wings | occasional | carmine cross-plan church with an apse in a small round churchyard at the **south edge**, apart from the houses |
| Kovalovice (MOR108718260, A07A–A07B) | long W-E street village along a stream | pink, in narrow deep plots | a regular line of small yellow at the back of the garden strips | a small chapel-like parcel; a manor complex to the south |
| Pozořice (MOR205218260, A10A–A10B) | market town along a SW-NE road | dense pink rows | many (garden ends, yards, a row at the SW exit) | carmine church inside the town (SW part); a large manor court with a basin to the east |
| Slavkov (MOR243418260, A11B–A12B) | town with château, square and named streets ("Brünner Gasse", "Breite Gasse") | continuous frontages, long side on the street | few | carmine church with cross and apse on the square |

**Does the pattern hold?**
- **Shared farmstead form:** Sokolnice, Telnice and Prace all have the L described above: a street range plus a long range on the N/NE side, yards open to the S/SW, gardens with trees behind, and plots about 22 m wide.
- **Ponětovice differs:** closed courtyards with the long side on the green.
- **Yellow buildings:**
  - absent from the Sokolnice and Telnice villages;
  - common in Prace and in the villages to the north and east (Jiříkovice, Blažovice, Křenovice, Kovalovice, Pozořice), mostly at garden ends and at the back of yards.
- **Church position:**
  - inside the built-up area in Telnice, Šlapanice, Pozořice and Slavkov;
  - at the edge in Tvarožná;
  - apart from the farm rows, south of the brook, in Prace.

## Summary table

| item | what the sketch shows (B unless marked) | key number |
|---|---|---|
| Sokolnice green | long N-S green, a wedge tapering south | 41–52 m wide (median 46 m), about 300 m long |
| Sokolnice plots and buildings | narrow deep plots; pink Ls; 6 of 26 with a pink rear building; no yellow | plot 21.7 m; long range 34 x 7.8 m |
| Telnice | straight SW-NE street; pink Ls on the NE boundary; no yellow; pond "Weiher" at SW; stream on the NW side | street 20.7 m; plot 22.4 m; long range 35.6 m |
| Telnice church | NE end, inside the village; light west square (tower?), carmine nave, rounded east end | about 31–34 m long; axis about 97° (today about 111°) |
| Prace (detail) | N-S street; pink Ls; **yellow rear building in about 13 of 17 plots**; yellow numbered houses at garden ends | plot 21.9 m; yellow about 8.3 x 6.3 m |
| Prace church | W-E, rounded east apse, small west projection; south of the brook, apart from the farm rows | 27.9 x 13.8 m; 276 m at 194° from the street midpoint |
| Kobylnice | broad N-S green; Ls; 3 yellow; cross symbol on the green; meadow to the west with no water drawn | green 24–38 m (50–60 m at the north end) |
| Ponětovice | E-W green; closed courtyards | green about 25 x 207 m |
| Sokolnice castle | closed carmine quadrangle; deeper east range | 79.6 x 60.0 m; courtyard 39.1 x 34.2 m |
| pheasantry | "Fasangarten", dark wash, avenue with an oval loop; **no enclosing wall or fence line** | about 0.4 x 0.62 km |
| west of the castle | parcel 620 unwashed, garden 619; **no wall line** | – |
| granary | pink "10" at a road junction, not by water | 35.5 x 16.5 m |
| pond | pale-blue parcel 627 with the oval parcel 626, about 325 m south of the granary | – |
| post house | "Posoritzer Post.", north of the highway | 49.18547 N, 16.82614 E (±15 m) |
| Holubice inn | "Hollubitzer Wirthshaus", south of the highway | about 49.1843 N, 16.8073 E (±150 m) |
| legend | none on any piece examined | – |

## Open questions
1. **Which part of the L is the dwelling?** The sketches draw one undivided pink mass per farmstead. Whether the dwelling is the street range (long side to the street) or the head of the long range (gable to the street) cannot be read here; the cadastre's written protocols, house descriptions or old photographs would settle it.
2. **What pink and yellow mean.** There is no key. The usual reading is masonry versus timber, but that is outside this evidence; the instruction for the indication sketches should be cited.
3. **The Sokolnice castle's east range.** The drawn block is about 28 m longer east-west than today's castle. A demolished range, or a drawing simplification? This needs a building history.
4. **The Telnice church axis.** About 97° drawn against about 111° today: was it rebuilt on a new axis after 1825, or is the drawing wrong?
5. **Sokolnice pond 627.** Water or wet meadow in 1825? The imperial obligatory imprint (ČÚZK archive) would show the final classification.
6. **Kobylnice west.** The sketch shows meadow and no water. The "former pond basin" is not stated on the sheet, and the cursive word under the owner's name was not read.
7. **The Holubice inn's position** is rough. A local fit to surviving features (a bridge, a culvert, field roads) would settle it.
8. **Later updates on standard pieces.** Prace A03C has later additions; other standard pieces may too. Prefer the detail pieces, and check parcel numbers against the title counts.
9. **1805.** None of this is evidence for 1805 without an argument. Prace (fires in 1805, 1814 and 1818), Telnice (22 houses lost in 1808) and Augezd (no 1820s sketch; burned in 1794) are the weakest cases.
