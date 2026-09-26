/* ============================================================
   MILITARY SYMBOLOGY — canvas-drawn formation counters
   Colours and icons come from TOKENS (tokens.js, docs/VISUAL_SPEC.md §10); nation colours from NATION.
   ============================================================ */

var SYM_W=420, SYM_H=206, SYM_DPR=2;

var ECHELON = { army:"XXXX", corps:"XXX", div:"XX", bde:"X" };

function roundRect(c,x,y,w,h,r){
  c.beginPath();
  c.moveTo(x+r,y); c.lineTo(x+w-r,y); c.quadraticCurveTo(x+w,y,x+w,y+r);
  c.lineTo(x+w,y+h-r); c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  c.lineTo(x+r,y+h); c.quadraticCurveTo(x,y+h,x,y+h-r);
  c.lineTo(x,y+r); c.quadraticCurveTo(x,y,x+r,y); c.closePath();
}

/* one icon set for status, claim, evidence layer and source (decisions 3 and 10), drawn the same on
   canvas and as inline SVG. Geometry in a 12 x 12 box. */
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
function drawIcon(c,kind,x,y,s,col){          /* x,y: top left; s: side of the 12-unit box */
  var k=s/12;
  c.save(); c.translate(x,y); c.scale(k,k); c.fillStyle=col; c.strokeStyle=col; c.lineJoin="round";
  function tri(a,b,d){ c.beginPath(); c.moveTo(a[0],a[1]); c.lineTo(b[0],b[1]); c.lineTo(d[0],d[1]); c.closePath(); c.fill(); }
  if(kind==="ring"||kind==="open"){ c.lineWidth=kind==="ring"?1.6:1.4; c.beginPath(); c.arc(6,6,4.2,0,Math.PI*2); c.stroke(); }
  else if(kind==="square") c.fillRect(2.5,2.5,7,7);
  else if(kind==="forward") tri([2.5,1.8],[10.5,6],[2.5,10.2]);
  else if(kind==="caution"){ tri([6,1.2],[10.8,8.2],[1.2,8.2]); c.fillRect(1.2,9.4,9.6,1.6); }
  else if(kind==="down") tri([1.5,2.5],[10.5,2.5],[6,10.5]);
  else if(kind==="cross"){ c.lineWidth=1.8; c.beginPath(); c.moveTo(2.5,2.5); c.lineTo(9.5,9.5); c.moveTo(9.5,2.5); c.lineTo(2.5,9.5); c.stroke(); }
  else if(kind==="full"){ c.beginPath(); c.arc(6,6,4.2,0,Math.PI*2); c.fill(); }
  else if(kind==="half"){ c.lineWidth=1.4; c.beginPath(); c.arc(6,6,4.2,0,Math.PI*2); c.stroke();
    c.beginPath(); c.moveTo(6,1.8); c.arc(6,6,4.2,-Math.PI/2,Math.PI/2,true); c.closePath(); c.fill(); }
  else if(kind==="diamond"){ c.lineWidth=1.4; c.beginPath(); c.moveTo(6,1.2); c.lineTo(10.8,6); c.lineTo(6,10.8); c.lineTo(1.2,6); c.closePath(); c.stroke(); }
  c.restore();
}
/* the side a formation fights for: at Austerlitz the French army against the Russians and Austrians */
function sideOfNation(n){ return n==="fr"?"fr":"al"; }

/* opts: {sel, paper, dim, know}. Layout (canvas units; the sprite is drawn about 0.45-0.56 px per unit):
   echelon above; the frame with the arm glyph and the nation tag; designation left, strength right;
   the commander's name and the status plate below. Text is at least 27 units, so 12 px on screen at the
   smallest counter (docs/VISUAL_SPEC.md §8.3, owner decision 16). */
function drawSymbol(f, st, cf, opts){
  opts=opts||{};
  var cv=document.createElement("canvas");
  cv.width=SYM_W*SYM_DPR; cv.height=SYM_H*SYM_DPR;
  var c=cv.getContext("2d");
  c.scale(SYM_DPR,SYM_DPR);
  c.textBaseline="middle";

  var nat=NATION[f.nation], K=TOKENS.sym.counter[opts.paper?"paper":"dark"], S=TOKENS.sym.side[sideOfNation(f.nation)];
  var SANS=TOKENS.type.sans;
  var FX=155, FY=50, FW=110, FH=78;     /* the frame, 1.54 : 1: narrower, so the larger text keeps the old footprint */
  var dim=!!opts.dim;
  var ink=dim?K.sub:K.ink, inkW=dim?400:500, sub=K.sub, halo=K.halo;

  /* the extent actually inked, in canvas units, so label placement can use the counter's real
     footprint instead of its padded canvas */
  var inkBox=[1e9,1e9,-1e9,-1e9];
  function grow(x0,y0,x1,y1){ if(x0<inkBox[0])inkBox[0]=x0; if(y0<inkBox[1])inkBox[1]=y0; if(x1>inkBox[2])inkBox[2]=x1; if(y1>inkBox[3])inkBox[3]=y1; }
  function font(w,px){ return w+" "+px+"px "+SANS; }
  function inkText(t,x,y,align){
    var w=c.measureText(t).width, m=/(\d+(\.\d+)?)px/.exec(c.font), px=m?parseFloat(m[1]):20;
    var x0=align==="right"?x-w:(align==="center"?x-w/2:x);
    grow(x0-2,y-px*0.62,x0+w+2,y+px*0.62);
  }
  function label(text,x,y,fnt,align,col,maxW){
    c.font=fnt; c.textAlign=align;
    c.lineWidth=4; c.strokeStyle=halo; c.lineJoin="round";
    var m=/(\d+(\.\d+)?)px/.exec(fnt), lh=(m?parseFloat(m[1]):22)*1.04;
    var words=String(text).split(" "), line="", lines=[];
    for(var i=0;i<words.length;i++){
      var t=line?line+" "+words[i]:words[i];
      if(maxW && c.measureText(t).width>maxW && line){ lines.push(line); line=words[i]; } else line=t;
    }
    if(line) lines.push(line);
    var sy=y-((lines.length-1)*lh)/2;
    for(var j=0;j<lines.length;j++){ c.strokeText(lines[j],x,sy+j*lh); inkText(lines[j],x,sy+j*lh,align); }
    c.fillStyle=col;
    for(var k=0;k<lines.length;k++) c.fillText(lines[k],x,sy+k*lh);
  }

  /* echelon bar above the frame */
  var ech=ECHELON[f.ech]||"";
  if(ech) label(ech,FX+FW/2,FY-19,font(500,25),"center",ink);

  /* frame: nation fill; a cased band in the side colour (decision 1); never dashed (decision 4).
     A dimmed counter (highlight families) dims its fill, frame, glyph and tag only (owner decision 13). */
  c.save();
  c.globalAlpha=dim?0.34:1;
  c.fillStyle=nat.fill;
  roundRect(c,FX,FY,FW,FH,3); c.fill();
  c.lineJoin="round";
  c.lineWidth=6.4; c.strokeStyle=TOKENS.sym.keyline; roundRect(c,FX,FY,FW,FH,3); c.stroke();
  c.lineWidth=3.6; c.strokeStyle=opts.paper?S.deep:S.base; roundRect(c,FX,FY,FW,FH,3); c.stroke();

  /* arm glyph, above the nation tag */
  var gi=f.arm;
  c.strokeStyle=nat.edge; c.fillStyle=nat.edge; c.lineWidth=3.4; c.lineCap="butt";
  var ix=FX+12, iy=FY+9, iw=FW-24, ih=FH-9-28, gcx=FX+FW/2, gcy=iy+ih/2;
  function diagBoth(){ c.beginPath(); c.moveTo(ix,iy); c.lineTo(ix+iw,iy+ih);
                       c.moveTo(ix+iw,iy); c.lineTo(ix,iy+ih); c.stroke(); }
  function diagOne(){ c.beginPath(); c.moveTo(ix,iy+ih); c.lineTo(ix+iw,iy); c.stroke(); }
  if(gi==="inf") diagBoth();
  else if(gi==="cav") diagOne();
  else if(gi==="art"){ c.beginPath(); c.arc(gcx,gcy,13,0,Math.PI*2); c.fill(); }
  else if(gi==="guard"){ diagBoth(); c.fillRect(gcx-30,FY+5,60,8); }
  else if(gi==="mixed"){ diagBoth(); diagOne(); }
  else if(gi==="hq"){
    c.lineWidth=4;
    c.beginPath(); c.moveTo(FX,FY+FH); c.lineTo(FX,FY+FH+30); c.stroke();
    c.beginPath(); c.arc(gcx,gcy,15,0,Math.PI*2); c.stroke();
    c.beginPath(); c.moveTo(gcx-15,gcy); c.lineTo(gcx+15,gcy); c.stroke();
  }
  else diagBoth();
  /* nation tag, read from the data (owner decision 11), in the nation's own ink on its fill */
  c.font=font(600,24); c.textAlign="center"; c.fillStyle=nat.ink;
  c.fillText(nat.tag,gcx,FY+FH-15);
  c.restore();
  grow(FX-4,FY-4,FX+FW+4,FY+FH+4);
  if(f.arm==="hq") grow(FX-3,FY,FX+3,FY+FH+32);

  /* selection: a ring outside the frame; the frame keeps its side colour */
  if(opts.sel){
    c.lineWidth=4; c.strokeStyle=K.select; roundRect(c,FX-10,FY-10,FW+20,FH+20,5); c.stroke();
    grow(FX-13,FY-13,FX+FW+13,FY+FH+13);
  }

  /* confidence: a plated badge at the frame's corner, B or C, or "?" when the position is only reported */
  var badge = opts.know==="uncertain" ? "?" : (cf && cf!=="A" ? cf : "");
  if(badge){
    var bx=FX+FW-14, by=FY-18, bs=30;
    c.fillStyle=K.badgePlate; roundRect(c,bx,by,bs,bs,3); c.fill();
    c.lineWidth=2; c.strokeStyle=TOKENS.sym.keyline; roundRect(c,bx,by,bs,bs,3); c.stroke();
    c.fillStyle=K.badgeInk; c.font=font(600,24); c.textAlign="center"; c.fillText(badge,bx+bs/2,by+bs/2+1);
    grow(bx-1,by-1,bx+bs+1,by+bs+1);
  }

  /* designation, left of frame; strength, right of frame */
  label(f.desig||f.name, FX-10, FY+FH/2, font(400,24), "right", sub, 104);     /* designation: tertiary, 10.5 px */
  if(f.strength) label("≈"+f.strength.toLocaleString(), FX+FW+10, FY+FH/2, font(400,27), "left", sub, 124);

  /* commander surname below */
  var nm=(f.name||"").replace("'s Division","").replace("'s Dragoons","").replace("'s Cuirassiers","");
  label(nm, SYM_W/2, FY+FH+22, font(inkW,27), "center", ink, 400);

  /* status: a neutral plate with the group's icon and the words (decision 3) */
  if(st && STATUS[st]){
    var s=STATUS[st], ic=TOKENS.sym.status[s.tone]||{icon:"ring",weight:400};
    c.font=font(dim?400:ic.weight,27); c.textAlign="left";
    var tw=c.measureText(s.label).width, pw=tw+22+30, px0=SYM_W/2-pw/2, py0=FY+FH+38;
    c.fillStyle=K.plate; roundRect(c,px0,py0,pw,32,4); c.fill();
    drawIcon(c,ic.icon,px0+11,py0+8,16,K.plateInk);
    c.fillStyle=K.plateInk; c.fillText(s.label,px0+33,py0+17);
    grow(px0,py0,px0+pw,py0+32);
  }

  cv._ink=[Math.max(0,inkBox[0]/SYM_W),Math.max(0,inkBox[1]/SYM_H),Math.min(1,inkBox[2]/SYM_W),Math.min(1,inkBox[3]/SYM_H)];
  return cv;
}

function makeFeatureGlyph(name, kind, paper){
  var cv=document.createElement("canvas");
  var Wc=320, Hc=72;
  cv.width=Wc*SYM_DPR; cv.height=Hc*SYM_DPR;
  var c=cv.getContext("2d"); c.scale(SYM_DPR,SYM_DPR); c.textBaseline="middle";
  var P=TOKENS.sym.place[paper?"paper":"dark"];
  var ink=P.other, halo=P.halo;
  var col = kind==="water" ? P.water : kind==="height" ? P.height : kind==="road" ? P.road : ink;
  /* marker */
  c.save(); c.translate(Wc/2,20); c.rotate(Math.PI/4);
  c.lineWidth=2.4; c.strokeStyle=col; c.fillStyle=P.fill;
  c.fillRect(-6,-6,12,12); c.strokeRect(-6,-6,12,12);
  c.restore();
  c.font="400 22px "+TOKENS.type.sans; c.textAlign="center";
  c.lineWidth=4; c.lineJoin="round"; c.strokeStyle=halo;
  c.strokeText(name,Wc/2,48); c.fillStyle=col; c.fillText(name,Wc/2,48);
  var tw=c.measureText(name).width;
  cv._ink=[Math.max(0,(Wc/2-Math.max(tw/2,10)-2)/Wc),6/Hc,Math.min(1,(Wc/2+Math.max(tw/2,10)+2)/Wc),62/Hc];
  return cv;
}

/* opts.mark: a side colour; draws a small cased square before the text (formation names in the landscape) */
function makePlainLabel(text,size,colour,paper,opts){
  opts=opts||{};
  var cv=document.createElement("canvas");
  var c0=cv.getContext("2d");
  var font="400 "+size+"px "+TOKENS.type.serif;
  c0.font=font;
  var mk=opts.mark?Math.round(size*0.62):0, gap=opts.mark?Math.round(size*0.34):0;
  var tw=Math.ceil(c0.measureText(text).width), w=tw+30+mk+gap;
  cv.width=w*SYM_DPR; cv.height=Math.round(size*1.9)*SYM_DPR;
  var c=cv.getContext("2d"); c.scale(SYM_DPR,SYM_DPR);
  var cy=size*0.95, x0=15;
  if(opts.mark){
    c.fillStyle=TOKENS.sym.keyline; c.fillRect(x0,cy-mk/2,mk,mk);
    c.fillStyle=opts.mark; c.fillRect(x0+2,cy-mk/2+2,mk-4,mk-4);
  }
  c.font=font; c.textBaseline="middle"; c.textAlign="center";
  c.lineWidth=5; c.lineJoin="round";
  c.strokeStyle=TOKENS.sym.label[paper?"paper":"dark"].halo;
  var tx=x0+mk+gap+tw/2;
  c.strokeText(text,tx,cy);
  c.fillStyle=colour; c.fillText(text,tx,cy);
  cv._ink=[12/w,0.14,(w-12)/w,0.80];
  return {canvas:cv, w:w, h:Math.round(size*1.9)};
}
