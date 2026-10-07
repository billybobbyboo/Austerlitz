import io,os,sys,json,re
# The colour and type tokens (tokens.js) are the one source for CSS and JavaScript. style.css carries a
# generated copy of them between the tokens markers; `python3 build.py --tokens` rewrites it, and the build
# stops if the copy has drifted from tokens.js (docs/VISUAL_SPEC.md §5.1).
BEGIN='/* tokens:begin — generated from tokens.js by `python3 build.py --tokens`; do not edit */'
END='/* tokens:end */'
def tokens():
    src=open('tokens.js',encoding='utf-8').read()
    m=re.search(r'/\*TOKENS:BEGIN\*/(.*)/\*TOKENS:END\*/',src,re.S)
    if not m: sys.exit('tokens.js: TOKENS markers not found')
    return json.loads(m.group(1))
def token_block(T):
    def decls(d): return ''.join('--%s:%s;'%(k,v) for k,v in d.items())
    root=decls(T['theme']['dark'])+decls(T['type'])
    return BEGIN+'\n:root{'+root+'}\nbody.mode-staff{'+decls(T['theme']['paper'])+'}\n'+END
# The embedded type (decision 141; docs/FINAL_AUDIT.md T-0): fonts.css, written by tools/fonts/build-fonts.py and committed, goes in at
# the /*FONTS*/ marker inside the stylesheet's <style>, after the CSS (@font-face rules may stand anywhere). The build stops unless each
# type token names a face fonts.css embeds first, and every face is a WOFF2 data URL: the page loads no font from anywhere.
MARKERS=('/*CSS*/','/*JS*/','/*FONTS*/')
def fonts_block(T):
    if not os.path.exists('fonts.css'): sys.exit('fonts.css is missing: run tools/fonts/build-fonts.py (decision 141)')
    f=open('fonts.css',encoding='utf-8').read()
    for role in ('sans','serif'):
        m=re.match(r'\s*"([^"]+)"',T['type'][role])
        if not m or ('@font-face{font-family:"%s";'%m.group(1)) not in f:
            sys.exit('tokens.js: the %s stack must name a face embedded in fonts.css first (decision 141)'%role)
    if not re.search(r'@font-face\{',f): sys.exit('fonts.css: no @font-face')
    if re.search(r'src:url\((?!data:font/woff2;base64,)',f) or re.search(r'@import|url\((?!data:)',f):
        sys.exit('fonts.css: every face must be embedded as a WOFF2 data URL (decision 141)')
    for k in MARKERS:
        if k in f: sys.exit('fonts.css contains the build marker '+k)
    if '</style' in f.lower(): sys.exit('fonts.css contains "</style"')
    return f
css=open('style.css',encoding='utf-8').read()
i,j=css.find('/* tokens:begin'),css.find(END)
if i<0 or j<0: sys.exit('style.css: the tokens block markers are missing')
T=tokens()
want=token_block(T)
if '--tokens' in sys.argv:
    css=css[:i]+want+css[j+len(END):]
    open('style.css','w',encoding='utf-8',newline='\n').write(css)
    print('style.css tokens block rewritten from tokens.js')
elif css[i:j+len(END)]!=want:
    sys.exit('style.css: the tokens block differs from tokens.js; run `python3 build.py --tokens`')
js="\n".join(open(f,encoding='utf-8').read() for f in ['assets.js','tokens.js','geo.js','data.js','appearance.js','analysis.js','world.js','symbols.js','app.js'])
fonts=fonts_block(T)
shell=open('shell.html',encoding='utf-8').read()
for k in MARKERS:
    if shell.count(k)!=1: sys.exit('shell.html must contain the marker %s exactly once'%k)
out=shell.replace('/*FONTS*/',fonts).replace('/*CSS*/',css).replace('/*JS*/',js)
open('austerlitz-command-map.html','w',encoding='utf-8',newline='\n').write(out)
open('bundle.js','w',encoding='utf-8',newline='\n').write(js)
print("bytes:",len(out))
