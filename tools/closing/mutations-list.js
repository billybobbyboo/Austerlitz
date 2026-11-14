/* The closing re-verification pass: the audit's 33 negative controls (tools/audit-post8/tests/mutations-list.js), re-run on the build the
   final roadmap ends with. 30 apply to today's tree as written. Three find strings no longer occur, because a work package changed the text
   they edit; each is re-targeted to the same property in today's text, one edit as before:
     M08 the "derived" tag removed from the march row's Marching / Next move return (WP-03 renamed "plotted leg" to "plotted march" there and
         gave a drift its own return, decision 310's words; the drift return keeps its tag, as the audit's mutation left the readHidden path)
     M18 sthilaire@5 moved 13 map units south, as before (WP-03 added its grade, cf:"B", to the anchor)
     M22 the tour's quoted plateau figure at 04:00 changed to 45,000 (WP-02's strengths made it "about 41,000"; was "about 39,000")
   Every other field (title, claim, run, expect) is the audit's. */
const L=require("../audit-post8/tests/mutations-list.js").map(m=>Object.assign({},m));
const RE={
  M08:[{file:"app.js", find:"(mr.ice?' <span class=\"hh\">over the frozen mere</span>':'')+\" \"+derivedTag()+' <span class=\"hh\">(the plotted march\\u2019s length over its time window)</span>');",
        replace:"(mr.ice?' <span class=\"hh\">over the frozen mere</span>':'')+' <span class=\"hh\">(the plotted march\\u2019s length over its time window)</span>');"}],
  M18:[{file:"data.js", find:"5:{p:[287,282],cf:\"B\",st:\"holding\",act:\"Consolidating on the summit", replace:"5:{p:[287,295],cf:\"B\",st:\"holding\",act:\"Consolidating on the summit"}],
  M22:[{file:"analysis.js", find:"falls from about 41,000 at 04:00", replace:"falls from about 45,000 at 04:00"}]
};
L.forEach(m=>{ if(RE[m.id]){ m.edits=RE[m.id]; m.retargeted=true; } });
module.exports=L;
