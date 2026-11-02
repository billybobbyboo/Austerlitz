/* v-batch-rec-chron (records #7): the in-app self-test's share of the built file, raw and gzip-compressed (level 9), to weigh decision 140's
   premise by what a visitor transfers. Locates AUSTERLITZ_DEBUG's top-level statement in app.js with acorn, as tools/audit/size.js does.
   node tools/audit-post8/verification/v-batch-rec-chron/selftest-gzip.js   (reads only) */
"use strict";
const fs=require("fs"), path=require("path"), zlib=require("zlib"), acorn=require("acorn");
const ROOT=path.resolve(__dirname,"..","..","..","..");
const app=fs.readFileSync(path.join(ROOT,"app.js"),"utf8"), html=fs.readFileSync(path.join(ROOT,"austerlitz-command-map.html"));
const ast=acorn.parse(app,{ecmaVersion:2020});
const st=ast.body.find(n=>n.type==="VariableDeclaration"&&n.declarations.some(d=>d.id.name==="AUSTERLITZ_DEBUG"));
const dbg=app.slice(st.start,st.end), rest=app.slice(0,st.start)+app.slice(st.end);
const gz=b=>zlib.gzipSync(Buffer.from(b),{level:9}).length;
const out={selfTestBytes:Buffer.byteLength(dbg),htmlBytes:html.length,selfTestGzip:gz(dbg),htmlGzip:gz(html),appGzip:gz(app),appWithoutSelfTestGzip:gz(rest)};
out.rawShare=+(out.selfTestBytes/out.htmlBytes).toFixed(3); out.gzipMarginal=out.appGzip-out.appWithoutSelfTestGzip;
out.gzipMarginalShareOfHtml=+(out.gzipMarginal/out.htmlGzip).toFixed(3);
console.log(JSON.stringify(out));
