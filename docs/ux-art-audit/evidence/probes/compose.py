# Audit figure composer (temporary). Builds labelled before/after sheets and annotated baselines from the captures.
import sys, os
from PIL import Image, ImageDraw, ImageFont
import numpy as np
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # the audit's working folder (shots/, mock/, frames/, report/)
OUT=R+"/report/figs"
def font(sz,bold=False):
    for p in ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
              "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"]:
        if os.path.exists(p): return ImageFont.truetype(p,sz)
    return ImageFont.load_default()
CUR=(60,60,60); PRO=(20,92,60); B_=(120,74,20); DEF=(150,30,30)
def panel(img,label,kind="cur",w=None,notes=None):
    im=Image.open(img).convert("RGB") if isinstance(img,str) else img.convert("RGB")
    if w and im.width!=w: im=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
    col={"cur":CUR,"A":PRO,"B":B_,"def":DEF}[kind]
    bar=30+(18*len(notes) if notes else 0)
    out=Image.new("RGB",(im.width,im.height+bar),(250,248,242)); out.paste(im,(0,bar))
    d=ImageDraw.Draw(out); d.rectangle([0,0,im.width,bar-1],fill=col); d.text((10,7),label,font=font(14,True),fill=(255,255,255))
    if notes:
        for i,n in enumerate(notes): d.text((10,30+18*i),n,font=font(12),fill=(255,255,255))
    return out
def row(panels,gap=10,bg=(250,248,242)):
    h=max(p.height for p in panels); w=sum(p.width for p in panels)+gap*(len(panels)-1)
    out=Image.new("RGB",(w,h),bg); x=0
    for p in panels: out.paste(p,(x,0)); x+=p.width+gap
    return out
def col(rows,gap=12,bg=(250,248,242)):
    w=max(r.width for r in rows); h=sum(r.height for r in rows)+gap*(len(rows)-1)
    out=Image.new("RGB",(w,h),bg); y=0
    for r in rows: out.paste(r,(0,y)); y+=r.height+gap
    return out
def caption(im,text,sub=None):
    lines=[text]+([sub] if sub else [])
    h=16+22*len(lines); out=Image.new("RGB",(im.width,im.height+h),(250,248,242)); out.paste(im,(0,h)); d=ImageDraw.Draw(out)
    d.text((6,8),text,font=font(16,True),fill=(20,20,20))
    if sub: d.text((6,30),sub,font=font(12),fill=(70,70,70))
    return out
def mark(im,boxes):
    """boxes: [(x0,y0,x1,y1,n,text)] numbered red rectangles with a note under the picture"""
    im=im.convert("RGB").copy(); d=ImageDraw.Draw(im)
    for (x0,y0,x1,y1,n,_t) in boxes:
        d.rectangle([x0,y0,x1,y1],outline=(235,60,50),width=3); d.ellipse([x0-13,y0-13,x0+13,y0+13],fill=(235,60,50)); d.text((x0-5 if n<10 else x0-9,y0-9),str(n),font=font(15,True),fill=(255,255,255))
    notes=[str(n)+"  "+t for (_a,_b,_c,_d,n,t) in boxes]
    h=10+20*len(notes); out=Image.new("RGB",(im.width,im.height+h),(250,248,242)); out.paste(im,(0,0)); d=ImageDraw.Draw(out)
    for i,t in enumerate(notes): d.text((8,im.height+6+20*i),t,font=font(13),fill=(120,20,20))
    return out
def save(im,name,q=86):
    p=OUT+"/"+name; im.save(p,quality=q,optimize=True); print(name,im.size,os.path.getsize(p)//1024,"KB")
S=R+"/shots/"; M=R+"/mock/"; F=R+"/frames/"
def paper_void(src):
    """image edit: the olive surround of the paper sheet recoloured to the paper's own tone (the apron is a mesh; not reachable by CSS)"""
    im=Image.open(src).convert("RGB"); a=np.asarray(im).astype(np.int16); r,g,b=a[...,0],a[...,1],a[...,2]
    v=np.maximum(np.maximum(r,g),b)
    m=(v>40)&(v<178)&(np.abs(r-g)<16)&((g-b)>4)&((g-b)<46)
    yy,xx=np.mgrid[0:a.shape[0],0:a.shape[1]]; m&=(xx>=300)&(yy<=810)
    from PIL import ImageFilter
    mi=Image.fromarray((m*255).astype(np.uint8)).filter(ImageFilter.MinFilter(9)).filter(ImageFilter.MaxFilter(13))   # large regions only: lettering and marks are left alone
    m=(np.asarray(mi)>127)&(v<190)&(np.abs(r-g)<22)
    out=a.copy(); rng=np.random.default_rng(3); n=rng.integers(-3,4,size=m.shape)
    for i,c in enumerate((237,230,211)): out[...,i]=np.where(m,c+n,out[...,i])
    return Image.fromarray(np.clip(out,0,255).astype(np.uint8))
if __name__=="__main__":
    which=sys.argv[1:] or ["all"]
    def on(k): return "all" in which or k in which
    W3=960
    if on("F01"):
        save(caption(row([panel(M+"S1-desk-first-current.png","CURRENT · pinned build · cold open, 04:00, Overview, Study, 1440×900",w=1100),
                          panel(M+"S1-desk-first-A.png","PROPOSED (A) · mock, injected at run time · same clock, camera, viewport","A",w=1100)]),
             "Figure 1. The first frame","Left: what a visitor meets. Right: the night kept as a tint with the ground readable; the welcome in the rail's column with the three encodings; the map left free. Nothing shipped."),"F01-first-frame.jpg")
    if on("F02"):
        save(caption(row([panel(M+"S2-desk-0900-play-current.png","CURRENT · 09:00, the framing Play gives under Follow (238 units), Study",w=W3),
                          panel(M+"S2-desk-0900-play-A.png","PROPOSED (A) · label tiers only · camera, clock, viewport and panel held","A",w=W3),
                          panel(M+"S2-desk-0900-play-B.png","PROPOSED (B) · atlas treatment (paper chrome, tinted ground, ink lettering) · same view","B",w=W3)]),
             "Figure 2. The label wall, and two ways out of it","33 opaque plates cover 32% of the area the troops occupy (measured). A: the live events on the accent plate, the formations they name keep a plate, every other name loses its plate. B: the same tiers in ink on a light ground, with a plate title."),"F02-label-tiers.jpg")
    if on("F03"):
        save(caption(row([panel(M+"S2-desk-0900-play-current.png","CURRENT · Follow while playing: low and wide · action = 30% of the free map",w=W3),
                          panel(M+"S2-desk-0900-steep-current-labels.png","TESTED · same clock and target, 52° above the horizon at 205 units · labels as built","A",w=W3),
                          panel(M+"S2-desk-0900-steep-A.png","PROPOSED (A) · that framing with the label tiers · action = 87% of the free map","A",w=W3)]),
             "Figure 3. Where Play puts the camera","The formations' bounding box grows from 0.30 to 0.87 of the free rectangle; plates over the action fall from 32% to 18% before any label change; all four live events stay in the free rectangle."),"F03-play-framing.jpg")
    if on("F04"):
        cur=Image.open(M+"S3-desk-paper-current.png"); pb=Image.open(M+"S3-desk-paper-B.png")
        save(caption(row([panel(cur,"CURRENT · Paper map as entered, 09:00, Study, 1440×900",w=1100),
                          panel(pb,"PROPOSED (B) · mock, injected at run time: paper surround, neatline, title, contours on, ink event plates","B",w=1100)]),
             "Figure 4. The paper map as a plate","The sheet today is a tilted quadrilateral in an olive void. The mock gives it the paper's own surround, a north-aligned neatline, a title that states the moment, contours on, a firmer print. Counter placement is unchanged here (see finding MAP-4)."),"F04-paper-plate.jpg")
    if on("F05"):
        ph=lambda p,l,k: panel(p,l,k,w=420)
        save(caption(row([ph(M+"S4-phone-0900-play-current.png","CURRENT · 390×844, 09:00, Play framing","cur"),
                          ph(M+"S4-phone-0900-play-A.png","A · label tiers, camera held","A"),
                          ph(M+"S4-phone-0900-steep-A.png","A · tiers + steeper framing","A"),
                          ph(M+"S4-phone-0900-steep-B.png","B · atlas treatment, same framing","B")]),
             "Figure 5. The same proposals on a phone (emulated, 390×844 at density 3)","Today the formations fill 19% of the free map and plates cover 39% of that; steeper framing lifts the action to 69% of the free map."),"F05-phone.jpg")
    if on("F06"):
        a=mark(Image.open(S+"j5-d1440-B-0900-overview-watch.png"),[(358,100,1250,704,1,"The model's edge shows as nested hard-edged rectangles: land cover, relief detail and haze stop at the data frame."),(0,0,356,808,2,"Two thirds of the Overview is unlit apron; the battle occupies the middle third."),(560,180,1010,620,3,"At this distance the relief does not read: the Pratzen is not visibly higher than the Goldbach valley.")])
        b=mark(Image.open(S+"j9-F-desk-play-end-watch.png"),[(0,0,1438,395,1,"Watch, paused after Play at 09:13: the top 44% of the frame is haze and far ground, carrying only label plates."),(40,400,1400,640,2,"All 31 formations stand in a band holding 19% of the canvas; 34 plates cover 29% of it."),(0,650,1438,806,3,"The foreground third is empty ground.")])
        save(caption(row([panel(a,"CURRENT · Overview, Watch, 09:00, 1440×900","def",w=1200),panel(b,"CURRENT · Watch, the Follow framing after Play, 09:13","def",w=1200)]),"Figure 6. Composition at the two widest scales","Observed on the pinned build (Chromium 153, Mesa llvmpipe; the same rectangles are in the SwiftShader capture)."),"F06-composition.jpg")
    if on("F07"):
        k=Image.open(F+"crop-l1280-key.png").convert("RGB"); k=k.resize((k.width*2,k.height*2),Image.LANCZOS)
        s=Image.open(S+"j3-10-sources.png").convert("RGB").crop((400,70,1040,420)).resize((1024,560),Image.LANCZOS)
        t=Image.open(F+"crop-j7-02.png").convert("RGB"); t=t.crop((250,20,1010,110)).resize((1140,135),Image.LANCZOS)
        pk=Image.open(S+"j9-G1-phone-after-key.png").convert("RGB").resize((390,844),Image.LANCZOS)
        save(caption(row([panel(k,"Key at 1280×720: a light native scrollbar on the dark panel, text flush against it","def"),
                          col([panel(s,"Sources sheet: the same light scrollbar; one 39,000 px column","def"),panel(t,"Timeline at 1280 px: the current phase's label covers its neighbour mid-word; the caption is ellipsized","def")]),
                          panel(pk,"Phone: 'Show the key' shows no key","def")]),
             "Figure 7. Small defects a first-time visitor sees","Scrollbars: headed Chromium on Linux, as Windows draws them; macOS overlays hide them. Phone: 390×844 emulation."),"F07-defects.jpg")
    if on("F08"):
        g=lambda n,l: panel(S+"j6-t800-"+n+".png",l,"def")
        save(caption(col([row([g("01-cold","800×450 cold: 9.5% of the screen is free map"),g("04-0900-study","Study at 09:00: 18% free; the card's text is cut")]),row([g("06b-panels","Panels open: 3.7% free"),g("08-paper","Paper map: counters under the controls; the sheet 250 px wide")])]),
             "Figure 8. The 800×450 window","Between the phone layout (below 720 px) and the docked layout (from 1080 px) Study leaves almost no map. Watch at the same size gives 70%."),"F08-800x450.jpg")
    if on("F09"):
        a=Image.open(S+"j3-05-formation-card.png").convert("RGB").crop((0,0,640,810)); b=Image.open(S+"j3-07-daytrack.png").convert("RGB").crop((0,0,640,810))
        save(caption(row([panel(a,"Formation card: values set in a 120 px column, 16 characters a line","def"),panel(b,"The day-track: 4,765 px down an 8-screen dossier, a light inset, 14 px targets","def")]),
             "Figure 9. The dossier in a 300 px rail",""),"F09-dossier.jpg")
    if on("F10"):
        k=lambda p,l: panel(p,l,"A",w=960)
        save(caption(col([row([k(S+"j3-02-event-open.png","KEEP · 08:45, an event opened: fog, plateau, arrows, one subject"),k(S+"j5-d1440-C-0900-pratzen-watch.png","KEEP · the Pratzen vantage in Watch")]),
                          row([k(S+"j5-d1440-F-1500-mere-closer-study.png","KEEP · 15:00, the meres: ice, arrows over it, the event marked"),k(S+"j3-05-formation-card.png","KEEP · a selection: outline, ring, graded pills, 'How this is sourced'")])]),
             "Figure 10. Where the current design deserves to be kept","Medium and close views, the fog hour, the ice, the graded pills and claim words."),"F10-keepers.jpg")
