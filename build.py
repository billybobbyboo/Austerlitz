import io,os
css=open('style.css',encoding='utf-8').read()
js="\n".join(open(f,encoding='utf-8').read() for f in ['assets.js','geo.js','data.js','analysis.js','world.js','symbols.js','app.js'])
shell=open('shell.html',encoding='utf-8').read()
out=shell.replace('/*CSS*/',css).replace('/*JS*/',js)
open('austerlitz-command-map.html','w',encoding='utf-8',newline='\n').write(out)
open('bundle.js','w',encoding='utf-8',newline='\n').write(js)
print("bytes:",len(out))
