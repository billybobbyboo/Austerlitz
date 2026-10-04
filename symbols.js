/* ============================================================
   MILITARY SYMBOLOGY — formation counters and map labels, as DOM and SVG (Stage 2D; the canvas counter of Stages 0-2C
   is retired). Colours and icons come from TOKENS (tokens.js, docs/VISUAL_SPEC.md §10); nation colours from NATION.
   ============================================================ */

var ECHELON = { army:"XXXX", corps:"XXX", div:"XX", bde:"X" };

/* one icon set for status, claim, evidence layer and source (decisions 3 and 10), inline SVG on counters and in the
   dossier. Geometry in a 12 x 12 box. */
var ICON_SVG={
  ring:'<circle cx="6" cy="6" r="4.2" fill="none" stroke-width="1.6"/>',
  square:'<rect x="2.5" y="2.5" width="7" height="7" stroke="none"/>',
  forward:'<path d="M2.5 1.8 L10.5 6 L2.5 10.2 Z" stroke="none"/>',
  caution:'<path d="M6 1.2 L10.8 8.2 L1.2 8.2 Z" stroke="none"/><rect x="1.2" y="9.4" width="9.6" height="1.6" stroke="none"/>',
  down:'<path d="M1.5 2.5 L10.5 2.5 L6 10.5 Z" stroke="none"/>',
  cross:'<path d="M2.5 2.5 L9.5 9.5 M9.5 2.5 L2.5 9.5" fill="none" stroke-width="1.8"/>',
  full:'<circle cx="6" cy="6" r="4.2" stroke="none"/>',
  half:'<circle cx="6" cy="6" r="4.2" fill="none" stroke-width="1.4"/><path d="M6 1.8 A4.2 4.2 0 0 0 6 10.2 Z" stroke="none"/>',
  open:'<circle cx="6" cy="6" r="4.2" fill="none" stroke-width="1.4"/>',
  diamond:'<path d="M6 1.2 L10.8 6 L6 10.8 L1.2 6 Z" fill="none" stroke-width="1.4"/>'
};
function iconSVG(kind){ return '<svg class="ic" viewBox="0 0 12 12" aria-hidden="true">'+(ICON_SVG[kind]||"")+'</svg>'; }
/* the side a formation fights for: at Austerlitz the French army against the Russians and Austrians */
function sideOfNation(n){ return n==="fr"?"fr":"al"; }

/* ============================================================
   Stage 2D: the counter and the map labels as DOM elements (docs/STAGE2_SPEC.md section F.1; owner decisions 9, 11,
   13, 24 and 38). The map layer in app.js places them. Colours come only from TOKENS and NATION, sizes from the type
   scale (style.css, .mlc and .mlt). Every text sits on a plate, so it meets AA over any ground and check:contrast
   measures it like any page text.
   The compact counter (the default): the 40 x 28 px cased frame (keyline, side band, keyline, nation fill), the arm
   glyph, the nation tag, the echelon mark above, the B / C / ? badge and the status icon without its text, with the
   short name beside it. The full counter (the selection, the highlighted family, hover, keyboard focus, and closer
   than ML_FULL_DIST) adds the status words, the strength and the commander.
   A dimmed counter (owner decision 13): its fill, band and glyph at 34%; its text, badge and nation tag at full
   opacity, one step down in tone and weight (counter-sub, 400), the tag on the neutral plate.
   ============================================================ */
var ECH_WORD={army:"army",corps:"corps",div:"division",bde:"brigade"};
var SIDE_WORD={fr:"French",ru:"Allied, Russian",at:"Allied, Austrian"};
function shortName(f){ return (f.name||"").replace("'s Division","").replace("'s Dragoons","").replace("'s Cuirassiers",""); }
function nameOf(f){ return (f.name||"").replace("'s Division","").replace("'s Brigade",""); }
/* the arm glyph in the frame's 40 x 28 box: the fill is 30 x 18 at (5, 5), the nation tag takes its lower 9 px */
function armGlyphSVG(arm,col){
  function L(a,b,c,d){ return '<path d="M'+a+' '+b+'L'+c+' '+d+'"/>'; }
  var both=L(8,6.5,32,13.5)+L(32,6.5,8,13.5), one=L(8,13.5,32,6.5), g;
  if(arm==="cav") g=one;
  else if(arm==="art") g='<circle cx="20" cy="10" r="2.8" fill="'+col+'" stroke="none"/>';
  else if(arm==="guard") g=both+'<rect x="14" y="5" width="12" height="2" fill="'+col+'" stroke="none"/>';
  else if(arm==="mixed") g=both+one;
  else if(arm==="hq") g='<path d="M0.8 28L0.8 39"/><circle cx="20" cy="10" r="3.4"/>'+L(16.6,10,23.4,10);
  else g=both;
  return '<g fill="none" stroke="'+col+'" stroke-width="1.4">'+g+'</g>';
}
/* o: {st, cf, sel, paper, dim, know, full, strength, commander} */
function counterHTML(f,o){
  var K=TOKENS.sym.counter[o.paper?"paper":"dark"], S=TOKENS.sym.side[sideOfNation(f.nation)], N=NATION[f.nation], kl=TOKENS.sym.keyline;
  var dim=!!o.dim, ink=dim?K.sub:K.ink, plate="background:"+K.plate+";color:"+ink;
  var ech=ECHELON[f.ech]||"", badge=o.know==="uncertain"?"?":(o.cf&&o.cf!=="A"?o.cf:"");
  var s=o.st&&STATUS[o.st], ic=s?(TOKENS.sym.status[s.tone]||{icon:"ring",weight:400}):null;
  var h='<span class="mlc-frame'+(o.sel?' sel" style="outline-color:'+K.select:'')+'">'+
    (ech?'<span class="mlc-ech" style="'+plate+'">'+ech+'</span>':'')+
    '<svg class="mlc-svg" viewBox="0 0 40 28" width="40" height="28" aria-hidden="true"'+(dim?' style="opacity:.34"':'')+'>'+
      '<rect width="40" height="28" rx="3" fill="'+kl+'"/><rect x="1" y="1" width="38" height="26" rx="2.4" fill="'+(o.paper?S.deep:S.base)+'"/>'+
      '<rect x="4" y="4" width="32" height="20" rx="1.4" fill="'+kl+'"/><rect x="5" y="5" width="30" height="18" rx="1" fill="'+N.fill+'"/>'+
      armGlyphSVG(f.arm,N.edge)+'</svg>'+
    '<span class="mlc-tag" style="'+(dim?plate+';font-weight:400':'background:'+N.fill+';color:'+N.ink)+'">'+esc(N.tag)+'</span>'+
    (badge?'<span class="mlc-badge" style="background:'+K.badgePlate+';color:'+K.badgeInk+';border-color:'+kl+'">'+badge+'</span>':'')+
    '</span>';
  var name='<b class="mlc-name" style="font-weight:'+(dim?400:500)+'">'+esc(shortName(f))+'</b>';
  if(!o.full) return h+'<span class="mlc-text" style="'+plate+'">'+name+(ic?iconSVG(ic.icon):'')+'</span>';
  var sub=(o.strength?'≈'+o.strength.toLocaleString():'')+(o.commander?(o.strength?' · ':'')+esc(o.commander):'');
  return h+'<span class="mlc-text" style="'+plate+'">'+name+
    (s?'<span class="mlc-st" style="color:'+(dim?K.sub:K.plateInk)+';font-weight:'+(dim?400:ic.weight)+'">'+iconSVG(ic.icon)+esc(s.label)+'</span>':'')+
    (sub?'<span class="mlc-sub" style="color:'+K.sub+'">'+sub+'</span>':'')+'</span>';
}
/* the accessible name (docs/STAGE2_SPEC.md section F.1): name, side, echelon, strength, status, position grade */
function counterLabel(f,o){
  var s=o.st&&STATUS[o.st];
  return f.name+", "+(SIDE_WORD[f.nation]||f.nation)+", "+(ECH_WORD[f.ech]||f.ech)+(o.strength?", about "+o.strength.toLocaleString():"")+
    (s?", "+s.label.toLowerCase():"")+", position grade "+(o.cf||"A")+(o.know==="uncertain"?", reported only":"");
}
/* a formation's name in the landscape, which draws no counters: neutral text with the side mark beside it (decision 9), and since
   Stage 5B its position grade as the counter's badge: B or C, "?" when reported only, none for A (decision 4; section A.4 item 4).
   o: {cf, know}, as counterHTML's */
function nameHTML(f,paper,o){
  var K=TOKENS.sym.counter[paper?"paper":"dark"], badge=o?(o.know==="uncertain"?"?":(o.cf&&o.cf!=="A"?o.cf:"")):"";
  return '<i class="mln-mark" style="background:'+TOKENS.sym.side[sideOfNation(f.nation)].base+';border-color:'+TOKENS.sym.keyline+'"></i>'+esc(nameOf(f))+
    (badge?'<span class="mln-bdg" style="background:'+K.badgePlate+';color:'+K.badgeInk+';border-color:'+TOKENS.sym.keyline+'">'+badge+'</span>':'');
}
