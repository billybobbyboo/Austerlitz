/* ============================================================
   TOKENS — the single source of the interface's colours and type (docs/VISUAL_SPEC.md §5)
   The body between the markers is strict JSON: build.py reads it to write the custom-property
   block in style.css (python3 build.py --tokens), and the build fails if that block has drifted.
   JavaScript reads TOKENS directly. Nation colours are not here: they live only in NATION (data.js).
   theme.dark is the landscape, theme.paper the paper map (body.mode-staff).
   sym.plate (Stage 2D) is the plate under every map-layer label: opaque enough that each map text colour below meets
   WCAG AA over black and over white ground (dark 0.88, worst 5.8:1, the road ink; paper 0.95, worst 4.6:1, the water ink).
   sym.paperMap (Stage 2E) is the paper map's own symbology: woods (a tint, the tree marks and the outline) and the flat
   village footprints. Symbols on the map, not text. Since Stage 4E also its ground (the cover classes' colours, in
   coverClass's order through COVER_KEYS), its contours and its marsh lines (owner decision 79; values unchanged).
   ============================================================ */
var TOKENS = /*TOKENS:BEGIN*/{
  "theme": {
    "dark": {
      "ink": "#0C1116", "ink-rgb": "12,17,22",
      "panel": "#131A21", "panel-rgb": "19,26,33",
      "scrim-rgb": "10,14,19",
      "line-rgb": "199,189,165",
      "line": "rgba(199,189,165,.16)", "line-2": "rgba(199,189,165,.30)",
      "text-hi": "#E7DFCC", "text": "#CABFA8", "text-body": "#B4AC99", "text-muted": "#9BA3A9",
      "accent": "#EFE4C8", "accent-rgb": "239,228,200", "on-accent": "#101720",
      "plate": "#2A3038", "plate-ink": "#E7DFCC",
      "side-fr": "#4C86D8", "side-al": "#D4703A",
      "side-fr-text": "#7FB0F0", "side-al-text": "#EC9A5E",
      "keyline": "#0A0E12"
    },
    "paper": {
      "ink": "#F3EEE2", "ink-rgb": "243,238,226",
      "panel": "#F5F1E6", "panel-rgb": "245,241,230",
      "scrim-rgb": "243,238,226",
      "line-rgb": "40,36,28",
      "line": "rgba(40,36,28,.14)", "line-2": "rgba(40,36,28,.25)",
      "text-hi": "#14120C", "text": "#33301F", "text-body": "#3A362B", "text-muted": "#45412F",
      "accent": "#4E3F1E", "accent-rgb": "78,63,30", "on-accent": "#F2EEE2",
      "plate": "#E3DDCD", "plate-ink": "#14120C",
      "side-fr": "#2A5FB0", "side-al": "#A8501C",
      "side-fr-text": "#2A5FB0", "side-al-text": "#A8501C",
      "keyline": "#0A0E12"
    }
  },
  "type": {
    "t-micro": "10.5px", "t-small": "11.5px", "t-ui": "12.5px", "t-prose": "14px",
    "t-h3": "17px", "t-h2": "21px", "t-display": "25px",
    "serif": "\"Iowan Old Style\",\"Palatino Linotype\",Palatino,\"Book Antiqua\",Georgia,serif",
    "sans": "ui-sans-serif,system-ui,-apple-system,\"Segoe UI\",Roboto,Helvetica,sans-serif"
  },
  "sym": {
    "side": {
      "fr": {"base": "#4C86D8", "light": "#7FB0F0", "deep": "#2A5FB0", "step2": "#6E9BD0", "step3": "#2F6BC4", "edge": "#0E2748"},
      "al": {"base": "#D4703A", "light": "#EC9A5E", "deep": "#A8501C", "step2": "#C98E58", "step3": "#C85A2C", "edge": "#50230A"}
    },
    "keyline": "#0A0E12",
    "counter": {
      "dark":  {"ink": "#F2EEE4", "sub": "#B9B5A8", "halo": "rgba(10,14,18,.86)", "plate": "#2A3038", "plateInk": "#E7DFCC",
                "badgePlate": "#0A0E12", "badgeInk": "#F2EEE4", "select": "#EFE4C8"},
      "paper": {"ink": "#25231D", "sub": "#5D5A4E", "halo": "rgba(246,241,229,.92)", "plate": "#E3DDCD", "plateInk": "#14120C",
                "badgePlate": "#F6F1E5", "badgeInk": "#25231D", "select": "#4E3F1E"}
    },
    "label": {
      "dark":  {"halo": "rgba(8,12,16,.72)", "ink": "#E8E2D3", "annotation": "#E3D9BE"},
      "paper": {"halo": "rgba(246,241,229,.9)", "ink": "#3A362C", "annotation": "#3A362C"}
    },
    "plate": {"dark": "rgba(10,14,18,.88)", "paper": "rgba(246,241,229,.95)"},
    "paperMap": {
      "wood":    {"fill": "#C9D3B2", "mark": "#566E43", "edge": "#566E43"},
      "village": {"fill": "#B8A58A", "edge": "#6B5B45"},
      "ground":  {"field": "#E8DFC6", "meadow": "#DCD9BC", "marsh": "#CBD5C8", "water": "#A8BEC8", "wood": "#BFCBA8",
                  "village": "#DCCFB4", "vineyard": "#E2DCBA", "track": "#D2C4A4"},
      "contour": {"fine": "#8A7346", "index": "#6E5629"},
      "marsh":   "#3E6D88"
    },
    "place": {
      "dark":  {"water": "#8FB6CC", "height": "#DCDAD4", "road": "#B0A48C", "other": "#E8E2D3", "fill": "#141A20", "halo": "rgba(10,14,18,.8)"},
      "paper": {"water": "#3C6A86", "height": "#56503E", "road": "#6B5B45", "other": "#3A362C", "fill": "#F6F1E5", "halo": "rgba(246,241,229,.9)"}
    },
    "analysis": {
      "ridge":  {"line": "#C8C6C0", "label": "#DCDAD4", "paper": "#56503E"},
      "scarp":  {"line": "#9C5A6E", "label": "#D6A0AE", "paper": "#7E3A4E"},
      "valley": {"line": "#6FA0B8", "label": "#93BFD4", "paper": "#3C6A86"},
      "defile": {"line": "#D05A4C", "label": "#F0A098", "paper": "#9A3A30"},
      "dead":   {"line": "#9080B4", "label": "#B4A6D6", "paper": "#584A86"}
    },
    "going": [
      {"key": "good",   "label": "good going",    "hex": "#6E8A5A"},
      {"key": "hard",   "label": "hard for guns", "hex": "#8C7A9A"},
      {"key": "severe", "label": "severe slope",  "hex": "#8E4436"},
      {"key": "vine",   "label": "vineyards",     "hex": "#ADCCBF"},
      {"key": "marsh",  "label": "marsh",         "hex": "#6B5A3E"},
      {"key": "water",  "label": "water",         "hex": "#36505E"}
    ],
    "status": {
      "quiet":  {"icon": "ring",     "weight": 400},
      "steady": {"icon": "square",   "weight": 400},
      "active": {"icon": "forward",  "weight": 500},
      "warn":   {"icon": "caution",  "weight": 500},
      "bad":    {"icon": "down",     "weight": 500},
      "gone":   {"icon": "cross",    "weight": 400}
    },
    "claim": {"fact": "full", "est": "half", "recon": "open"},
    "layer": {"record": "full", "recon": "open", "derived": "diamond"},
    "source": {"doc": "full", "inf": "open"}
  }
}/*TOKENS:END*/;

/* the theme's colours for JavaScript drawing: paper = the paper map */
function themeTok(paper){ return paper ? TOKENS.theme.paper : TOKENS.theme.dark; }
