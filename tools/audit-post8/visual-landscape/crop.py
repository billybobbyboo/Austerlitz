import sys
# Final audit after Stage 8, area visual-landscape: crop a region of a capture (shots/<id>.jpg) for inspection; usage: crop.py id x0 y0 x1 y1 [scale] [out-dir]
from PIL import Image
# usage: crop.py id x0 y0 x1 y1 [scale] -> crops/<id>-x0-y0.jpg (coordinates in the 1600x900 (or 1280x720) shot)
S='/home/user/Austerlitz/docs/audit-post8-evidence/visual-landscape/shots/'
O=sys.argv[7] if len(sys.argv)>7 else '/tmp/claude-0/-home-user-Austerlitz/cb561984-b1ad-5d5a-82ba-de46bf4c820e/scratchpad/visual-landscape/crops/'
i=sys.argv[1]; x0,y0,x1,y1=map(int,sys.argv[2:6]); sc=float(sys.argv[6]) if len(sys.argv)>6 else 1
im=Image.open(S+i+'.jpg').crop((x0,y0,x1,y1))
if sc!=1: im=im.resize((int(im.width*sc),int(im.height*sc)),Image.LANCZOS)
f=O+'%s-%d-%d.jpg'%(i,x0,y0); im.save(f,quality=90); print(f)
