/* Regenerate the test helpers (_clock.js, _derived.js, _events.js, _state.js, _ov.js)
   from the live app.js, by declaration name. Run before every test pass, so the
   suites can never test a stale copy of the code again. Fails loudly if a named
   declaration is missing. */
const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(ROOT,'app.js'),'utf8');

/* end of a statement or function body starting at i: string/comment-aware brace matching */
function scanEnd(src,i,isFunc){
  let depth=0, seenBrace=false;
  for(let k=i;k<src.length;k++){
    const c=src[k], n=src[k+1];
    if(c==='/'&&n==='/'){ k=src.indexOf('\n',k); if(k<0) return src.length; continue; }
    if(c==='/'&&n==='*'){ k=src.indexOf('*/',k+2)+1; continue; }
    if(c==='"'||c==="'"||c==='`'){ for(k++;k<src.length&&src[k]!==c;k++) if(src[k]==='\\') k++; continue; }
    if(c==='/'&&/[=(,:!&|?{};]\s*$/.test(src.slice(Math.max(0,k-3),k))){   /* a regex literal */
      for(k++;k<src.length&&src[k]!=='/';k++){ if(src[k]==='\\') k++; else if(src[k]==='['){ while(k<src.length&&src[k]!==']'){ if(src[k]==='\\') k++; k++; } } }
      continue; }
    if(c==='{'||c==='['||c==='('){ depth++; if(c==='{') seenBrace=true; }
    else if(c==='}'||c===']'||c===')'){ depth--; if(isFunc&&seenBrace&&depth===0) return k+1; }
    else if(c===';'&&depth===0&&!isFunc) return k+1;
    else if(c==='\n'&&depth===0&&!isFunc&&seenBrace) { /* object literal ended without ';' */ }
  }
  throw new Error('unterminated declaration at '+i);
}
function extract(name){
  let i=app.indexOf('\nfunction '+name+'(');
  if(i>=0) return app.slice(i+1,scanEnd(app,i+1,true));
  i=app.indexOf('\nvar '+name);
  if(i>=0 && /[\s=,]/.test(app[i+5+name.length])) return app.slice(i+1,scanEnd(app,i+1,false));
  throw new Error('declaration not found in app.js: '+name);
}
const HELPERS={
  '_clock.js':['TRANS_MS','T_MIN','clock','playing','KM_PER_MAP','easeInOut','clamp01','clampT','phaseAt','fmtClock','anchorList','legPath',
               'pointOnPath','legWindow','legAt','posAtClock','notYetAt','goneAt','headingAt','marchRate','posNow','SPEED_CEIL','wetAt',
               'nearSettlement','crossingProblem','auditMovement'],
  '_derived.js':['trackedDescendants','activeAt','ownStrengthAt','sideOnFieldAt','PLATEAU_POLY','onPlateau','plateauStrength',
                 'PBERG_NORTHING','SEP_KM','sideCentroid','centreSeparation'],
  '_events.js':['eventGroup','evWindow','evWeight','liveEvents','actOf','eventGlyph','plateauRing','buildPlateauRing','updatePlateauRing'],
  '_state.js':['stateAt','leavesOf','posOf','aggStrength','aggStatus','GRADE_RANK','worseGrade','confAt','liveConf','aggConf','aggInterp'],
  '_ov.js':['OVERLAYS']
};
Object.keys(HELPERS).forEach(f=>{
  const body=HELPERS[f].map(extract).join('\n');
  fs.writeFileSync(path.join(ROOT,f),'/* generated from app.js by tools/mk-helpers.js - do not edit */\n'+body+'\n','utf8');
  console.log(f.padEnd(12)+HELPERS[f].length+' declarations');
});
