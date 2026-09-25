/* ============================================================
   MILITARY SYMBOLOGY — canvas-drawn formation counters
   ============================================================ */

var SYM_W=420, SYM_H=206, SYM_DPR=2;

var TONE = {
  quiet:"#7F847F", steady:"#3F6FA6", active:"#C0602C",
  warn:"#B8861F", bad:"#9E3D36", gone:"#63484A"
};

var ECHELON = { army:"XXXX", corps:"XXX", div:"XX", bde:"X" };

function roundRect(c,x,y,w,h,r){
  c.beginPath();
  c.moveTo(x+r,y); c.lineTo(x+w-r,y); c.quadraticCurveTo(x+w,y,x+w,y+r);
  c.lineTo(x+w,y+h-r); c.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  c.lineTo(x+r,y+h); c.quadraticCurveTo(x,y+h,x,y+h-r);
  c.lineTo(x,y+r); c.quadraticCurveTo(x,y,x+r,y); c.closePath();
}

/* opts: {sel:bool, paper:bool, dim:bool} */
function drawSymbol(f, st, cf, opts){
  opts=opts||{};
  var cv=document.createElement("canvas");
  cv.width=SYM_W*SYM_DPR; cv.height=SYM_H*SYM_DPR;
  var c=cv.getContext("2d");
  c.scale(SYM_DPR,SYM_DPR);
  c.textBaseline="middle";

  var nat=NATION[f.nation];
  var FX=135, FY=42, FW=150, FH=96;
  var ink   = opts.paper ? "#25231D" : "#F2EEE4";
  var halo  = opts.paper ? "rgba(246,241,229,.92)" : "rgba(10,14,18,.86)";
  var sub   = opts.paper ? "#5D5A4E" : "#B9B5A8";

  /* the extent actually inked, in canvas units, so label placement can use the counter's real
     footprint instead of its padded canvas */
  var inkBox=[1e9,1e9,-1e9,-1e9];
  function grow(x0,y0,x1,y1){ if(x0<inkBox[0])inkBox[0]=x0; if(y0<inkBox[1])inkBox[1]=y0; if(x1>inkBox[2])inkBox[2]=x1; if(y1>inkBox[3])inkBox[3]=y1; }
  function inkText(t,x,y,align){
    var w=c.measureText(t).width, m=/(\d+(\.\d+)?)px/.exec(c.font), px=m?parseFloat(m[1]):20;
    var x0=align==="right"?x-w:(align==="center"?x-w/2:x);
    grow(x0-2,y-px*0.62,x0+w+2,y+px*0.62);
  }
  function label(text,x,y,font,align,col,maxW){
    c.font=font; c.textAlign=align;
    c.lineWidth=4; c.strokeStyle=halo; c.lineJoin="round";
    if(maxW){
      c.fillStyle=halo;
      var save=c.fillStyle;
      c.fillStyle=col;
      c.strokeStyle=halo;
      /* stroke then fill, wrapped */
      var words=String(text).split(" "), line="", lines=[];
      for(var i=0;i<words.length;i++){
        var t=line?line+" "+words[i]:words[i];
        if(c.measureText(t).width>maxW && line){ lines.push(line); line=words[i]; } else line=t;
      }
      if(line) lines.push(line);
      var lh=22, sy=y-((lines.length-1)*lh)/2;
      for(var j=0;j<lines.length;j++){ c.strokeText(lines[j],x,sy+j*lh); inkText(lines[j],x,sy+j*lh,align); }
      for(var k=0;k<lines.length;k++){ c.fillText(lines[k],x,sy+k*lh); }
      c.fillStyle=save;
    } else {
      c.strokeText(text,x,y); inkText(text,x,y,align);
      c.fillStyle=col; c.fillText(text,x,y);
    }
  }

  var alpha = opts.dim ? 0.34 : (opts.know==="uncertain" ? 0.82 : 1);
  c.globalAlpha = alpha;

  /* echelon bar above the frame */
  var ech=ECHELON[f.ech]||"";
  if(ech){
    c.font="500 25px ui-sans-serif, system-ui, sans-serif";
    c.textAlign="center";
    c.lineWidth=4; c.strokeStyle=halo; c.lineJoin="round";
    c.strokeText(ech,FX+FW/2,30); c.fillStyle=ink; c.fillText(ech,FX+FW/2,30); inkText(ech,FX+FW/2,30,"center");
  }

  /* frame */
  c.save();
  if(opts.know==="uncertain") c.setLineDash([5,5]);
  else if(cf==="B") c.setLineDash([9,6]);
  else if(cf==="C") c.setLineDash([3,7]);
  c.lineWidth = opts.sel?5:3.2;
  c.fillStyle = nat.fill;
  c.strokeStyle = opts.sel ? "#F0C463" : nat.edge;
  roundRect(c,FX,FY,FW,FH,3);
  c.fill(); c.stroke();
  c.restore();
  grow(FX-3,FY-3,FX+FW+3,FY+FH+3);
  if(f.arm==="hq") grow(FX-3,FY,FX+3,FY+FH+32);

  /* arm glyph */
  var gi = f.arm;
  c.strokeStyle = nat.edge; c.fillStyle = nat.edge; c.lineWidth=3.4; c.lineCap="butt";
  var ix=FX+10, iy=FY+9, iw=FW-20, ih=FH-18;
  function diagBoth(){ c.beginPath(); c.moveTo(ix,iy); c.lineTo(ix+iw,iy+ih);
                       c.moveTo(ix+iw,iy); c.lineTo(ix,iy+ih); c.stroke(); }
  function diagOne(){ c.beginPath(); c.moveTo(ix,iy+ih); c.lineTo(ix+iw,iy); c.stroke(); }
  if(gi==="inf") diagBoth();
  else if(gi==="cav") diagOne();
  else if(gi==="art"){ c.beginPath(); c.arc(FX+FW/2,FY+FH/2,15,0,Math.PI*2); c.fill(); }
  else if(gi==="guard"){ diagBoth();
    c.fillRect(FX+FW/2-30,FY+8,60,9); }
  else if(gi==="mixed"){ diagBoth(); diagOne(); }
  else if(gi==="hq"){
    c.lineWidth=4;
    c.beginPath(); c.moveTo(FX,FY+FH); c.lineTo(FX,FY+FH+30); c.stroke();
    c.beginPath(); c.arc(FX+FW/2,FY+FH/2,16,0,Math.PI*2); c.stroke();
    c.beginPath(); c.moveTo(FX+FW/2-16,FY+FH/2); c.lineTo(FX+FW/2+16,FY+FH/2); c.stroke();
  }
  else diagBoth();

  /* confidence badge, or a query where the position is only reported */
  if(opts.know==="uncertain"){
    c.fillStyle = opts.paper?"#8A5F12":"#EFC468";
    c.font="600 22px ui-sans-serif, system-ui, sans-serif";
    c.textAlign="left";
    c.fillText("?", FX+FW+6, FY+9);
  } else if(cf && cf!=="A"){
    c.fillStyle = opts.paper?"#8A7A4E":"#D8B563";
    c.font="500 19px ui-sans-serif, system-ui, sans-serif";
    c.textAlign="left";
    c.fillText(cf, FX+FW+6, FY+8);
  }

  if(opts.know==="uncertain"||(cf&&cf!=="A")) grow(FX+FW+4,FY-6,FX+FW+26,FY+22);
  /* designation, left of frame */
  label(f.desig||f.name, FX-14, FY+FH/2,
        "400 21px ui-sans-serif, system-ui, sans-serif", "right", sub, 116);

  /* strength, right of frame */
  if(f.strength){
    label("\u2248"+f.strength.toLocaleString(), FX+FW+14, FY+FH/2,
          "400 21px ui-sans-serif, system-ui, sans-serif", "left", sub, 112);
  }

  /* commander surname below */
  var nm=(f.name||"").replace("'s Division","").replace("'s Dragoons","").replace("'s Cuirassiers","");
  label(nm, SYM_W/2, FY+FH+26, "500 25px ui-sans-serif, system-ui, sans-serif", "center", ink, 400);

  /* status pill */
  if(st && STATUS[st]){
    var s=STATUS[st], tone=TONE[s.tone];
    c.font="500 19px ui-sans-serif, system-ui, sans-serif"; c.textAlign="center";
    var tw=c.measureText(s.label).width+26;
    c.fillStyle=tone;
    roundRect(c,SYM_W/2-tw/2,FY+FH+42,tw,26,13); c.fill(); grow(SYM_W/2-tw/2,FY+FH+42,SYM_W/2+tw/2,FY+FH+68);
    c.fillStyle="#FBF7EE"; c.fillText(s.label,SYM_W/2,FY+FH+55);
  }

  c.globalAlpha=1;
  cv._ink=[Math.max(0,inkBox[0]/SYM_W),Math.max(0,inkBox[1]/SYM_H),Math.min(1,inkBox[2]/SYM_W),Math.min(1,inkBox[3]/SYM_H)];
  return cv;
}

function makeFeatureGlyph(name, kind, paper){
  var cv=document.createElement("canvas");
  var Wc=320, Hc=72;
  cv.width=Wc*SYM_DPR; cv.height=Hc*SYM_DPR;
  var c=cv.getContext("2d"); c.scale(SYM_DPR,SYM_DPR); c.textBaseline="middle";
  var ink  = paper?"#3A362C":"#E8E2D3";
  var halo = paper?"rgba(246,241,229,.9)":"rgba(10,14,18,.8)";
  var col = kind==="water" ? (paper?"#3C6A86":"#8FB6CC")
          : kind==="height" ? (paper?"#7A5C22":"#D9BC7A")
          : kind==="road" ? (paper?"#6B5B45":"#B0A48C") : ink;
  /* marker */
  c.save(); c.translate(Wc/2,20); c.rotate(Math.PI/4);
  c.lineWidth=2.4; c.strokeStyle=col; c.fillStyle=paper?"#F6F1E5":"#141A20";
  c.fillRect(-6,-6,12,12); c.strokeRect(-6,-6,12,12);
  c.restore();
  c.font="400 22px ui-sans-serif, system-ui, sans-serif"; c.textAlign="center";
  c.lineWidth=4; c.lineJoin="round"; c.strokeStyle=halo;
  c.strokeText(name,Wc/2,48); c.fillStyle=col; c.fillText(name,Wc/2,48);
  var tw=c.measureText(name).width;
  cv._ink=[Math.max(0,(Wc/2-Math.max(tw/2,10)-2)/Wc),6/Hc,Math.min(1,(Wc/2+Math.max(tw/2,10)+2)/Wc),62/Hc];
  return cv;
}

function makePlainLabel(text,size,colour,paper){
  var cv=document.createElement("canvas");
  var c0=cv.getContext("2d");
  var font="400 "+size+"px 'Iowan Old Style', Palatino, Georgia, serif";
  c0.font=font;
  var w=Math.ceil(c0.measureText(text).width)+30;
  cv.width=w*SYM_DPR; cv.height=Math.round(size*1.9)*SYM_DPR;
  var c=cv.getContext("2d"); c.scale(SYM_DPR,SYM_DPR);
  c.font=font; c.textBaseline="middle"; c.textAlign="center";
  c.lineWidth=5; c.lineJoin="round";
  c.strokeStyle = paper?"rgba(246,241,229,.9)":"rgba(8,12,16,.72)";
  var cy=size*0.95;
  c.strokeText(text,w/2,cy);
  c.fillStyle=colour; c.fillText(text,w/2,cy);
  cv._ink=[12/w,0.14,(w-12)/w,0.80];
  return {canvas:cv, w:w, h:Math.round(size*1.9)};
}
