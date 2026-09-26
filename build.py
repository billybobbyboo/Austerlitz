import io,os,sys,json,re
# The colour and type tokens (tokens.js) are the one source for CSS and JavaScript. style.css carries a
# generated copy of them between the tokens markers; `python3 build.py --tokens` rewrites it, and the build
# stops if the copy has drifted from tokens.js (docs/VISUAL_SPEC.md §5.1).
BEGIN='/* tokens:begin — generated from tokens.js by `python3 build.py --tokens`; do not edit */'
END='/* tokens:end */'
def token_block():
    src=open('tokens.js',encoding='utf-8').read()
    m=re.search(r'/\*TOKENS:BEGIN\*/(.*)/\*TOKENS:END\*/',src,re.S)
    if not m: sys.exit('tokens.js: TOKENS markers not found')
    T=json.loads(m.group(1))
    def decls(d): return ''.join('--%s:%s;'%(k,v) for k,v in d.items())
    root=decls(T['theme']['dark'])+decls(T['type'])
    return BEGIN+'\n:root{'+root+'}\nbody.mode-staff{'+decls(T['theme']['paper'])+'}\n'+END
css=open('style.css',encoding='utf-8').read()
i,j=css.find('/* tokens:begin'),css.find(END)
if i<0 or j<0: sys.exit('style.css: the tokens block markers are missing')
want=token_block()
if '--tokens' in sys.argv:
    css=css[:i]+want+css[j+len(END):]
    open('style.css','w',encoding='utf-8',newline='\n').write(css)
    print('style.css tokens block rewritten from tokens.js')
elif css[i:j+len(END)]!=want:
    sys.exit('style.css: the tokens block differs from tokens.js; run `python3 build.py --tokens`')
js="\n".join(open(f,encoding='utf-8').read() for f in ['assets.js','tokens.js','geo.js','data.js','analysis.js','world.js','symbols.js','app.js'])
shell=open('shell.html',encoding='utf-8').read()
out=shell.replace('/*CSS*/',css).replace('/*JS*/',js)
open('austerlitz-command-map.html','w',encoding='utf-8',newline='\n').write(out)
open('bundle.js','w',encoding='utf-8',newline='\n').write(js)
print("bytes:",len(out))
