/* ============================================================
   ANALYSIS — the nine things that decided Austerlitz,
   the two command views, and documented limits on what was known.
   src: "doc" = attested decision or report · "inf" = labelled inference
   ============================================================ */

/* The spine data task (docs/STAGE3_SPEC.md sections C.2-C.3; owner decisions 52, 59, 64-67): a chapter is a theme. It names the
   moments it concerns (moments: "ph:<phase>" or "ev:<event id>") and the principal moment it opens on (at); its clock is that
   moment's (a phase's start, an event's start). It keeps its own camera (cam) only where no phase's view shows its subject:
   plan, deception, weakness, and cut (whose moment, the Pratzeberg taken at 11:00, falls in phase 5, whose view looks north). */
var ANALYSIS = [
{ id:"plan", n:"The Allied plan", at:"ph:0", moments:["ph:0"], cam:[-27,262,41,-27,0,9],
  forms:["kienmayer","dok","lang","prz","col4","milo","kollo","lich","bag","constantine"],
  feats:["pratzen","goldbach","telnitz","sokolnitz","kobelnitz"],
  text:"Weyrother's dispositions send four of the five Allied columns south-west off the Pratzen plateau to turn the French right and cut the road to Vienna. Bagration holds the highway in the north, Liechtenstein's cavalry links the two, and the Russian Guard stands in reserve behind Krzenowitz. The plan assumes the French will stand still while roughly 60,000 men march across their front."},

{ id:"deception", n:"The French deception", at:"ph:0", moments:["ph:0"], cam:[-129,44,27,-7,8,-5],
  forms:["gqg","legrand","sthilaire","vandamme","c_gd","c_gren"],
  feats:["pratzen","vinohrady","pratzeberg","goldbach"],
  text:"Napoleon abandoned the Pratzen plateau on 1 December and camped his army west of it, behind the Goldbach. He asked for an armistice interview and let his outposts be pushed in. The intention, stated in his orders to the army, was to invite an attack on his right so that the enemy would leave the high ground in the centre."},

{ id:"weakness", n:"The apparent weakness on the right", at:"ev:telnitz", moments:["ev:raigern","ev:davout","ev:telnitz"], cam:[-160,58,157,-56,4,59],
  forms:["legrand","friant","bourcier","c_iii"],
  feats:["telnitz","sokolnitz","goldbach","viennaroad"],
  text:"Legrand's single division held roughly five kilometres of the lower Goldbach on its own. Davout's III Corps detachment, some 4,300 men by Duffy's and Smith's count, reached Raigern only on the night of 1 December after a forced march from Vienna, 8 km from the villages it had to hold. Against them the Allies committed nearly 40,000. The weakness was real, not simulated, which is what made it convincing."},

{ id:"commitment", n:"The commitment of the Allied left", at:"ph:1", moments:["ev:telnitz","ev:sokolnitz","ev:telnitz-retaken"],
  forms:["buxhowden","kienmayer","dok","lang","prz"],
  feats:["telnitz","sokolnitz","augezd","goldbach"],
  text:"Between 07:00 and 09:00 the three left-hand columns and Kienmayer's advance guard descended into the Goldbach villages and fed themselves into a fight for four hamlets. Each column that went down was a column no longer on the plateau. By the time Soult moved, the centre of the Allied position had been emptied by the Allies themselves."},

{ id:"pratzen", n:"The attack on the Pratzen", at:"ev:soult", moments:["ev:decision","ev:soult","ev:pratzen-village","ev:face-about","ev:kamensky","ev:pratzeberg"],
  forms:["sthilaire","vandamme","c_iv","milo","kollo","ahq"],
  feats:["pratzen","pratzeberg","vinohrady","puntowitz","girzikowitz"],
  text:"Saint-Hilaire and Vandamme had been standing in fog in the Goldbach valley, invisible from the heights. At about 08:45 they climbed the western slope and struck the 4th Column, which was still on the plateau. It had started about two hours late: held up by Liechtenstein's cavalry crossing its line of march and, in Russian accounts, chiefly by Kutuzov's reluctance to leave the heights until the Tsar ordered it forward. The fight for the two summits lasted until about 11:00, when the plateau was French from end to end."},

{ id:"cut", n:"The cutting of the Allied army", at:"ev:pratzeberg", moments:["ev:pratzeberg","ev:buxhowden-blind"], cam:[-75,38,42,7,8,12],
  forms:["sthilaire","vandamme","buxhowden","dok","lang","prz","constantine","bag"],
  feats:["pratzen","pratzeberg","goldbach"],
  text:"With the plateau taken, the Allied army was in two halves that could no longer support one another. Buxhowden's 40,000 were west and south of the heights; Bagration and the Guard were north and east of them. Buxhowden did not learn that the centre had gone until about noon. From this point the French hold the interior lines on their enemy's own battlefield."},

{ id:"guard", n:"The Russian Guard counterattack", at:"ph:6", moments:["ev:guard-attack","ev:guard-broken","ev:hq-forward"],
  forms:["constantine","rg_inf","rg_cav","vandamme","guard_cav","guard_inf","drouet"],
  feats:["vinohrady"],
  text:"Grand Duke Constantine threw the last Allied reserve at Vandamme on the Old Vineyards. The Guard infantry broke two French battalions and the Guard cavalry took the eagle of the 4th Line, the only one lost that day. Bessieres brought up the Guard cavalry and Rapp charged with the chasseurs and Mamelukes; Drouet's division formed line across the plateau. Prince Repnin was taken prisoner."},

{ id:"north", n:"Lannes, Murat and Bagration", at:"ph:5", moments:["ev:blasowitz"],
  forms:["c_v","caffarelli","suchet","santon","c_cav","kellermann","nansouty","dhautpoul","bag","lich"],
  feats:["santon","olmutzroad","blasowitz"],
  text:"The northern battle was a holding action that Lannes turned into an advance. The Santon, scarped and carrying eighteen guns, made the flank unturnable, so Bagration could not get past it. When Liechtenstein's and Uvarov's horse charged, Murat answered with Nansouty's and d'Hautpoul's cuirassiers. Blasowitz fell about 11:15 and Bagration was levered off the rest of the army, withdrawing on Rausnitz in good order."},

{ id:"wheel", n:"The French wheel", at:"ev:wheel", moments:["ev:davout-resumes","ev:wheel","ev:sokolnitz-falls"],
  forms:["sthilaire","vandamme","c_gren","guard_inf","heightguns","friant","legrand","prz","lang","dok"],
  feats:["pratzen","sokolnitz","telnitz"],
  text:"Between about 13:00 and 14:00 Napoleon turned his centre ninety degrees and brought it down off the plateau onto the back of Buxhowden's columns, while Davout attacked from the west. Przybyszewski's column was surrounded in Sokolnitz and largely captured. The Allied left was now being attacked from the direction of its own rear."},

{ id:"collapse", n:"The destruction of the Allied left", at:"ev:augezd", moments:["ev:augezd","ev:ice","ev:end"],
  forms:["dok","kienmayer","lang","buxhowden","vandamme","sthilaire","heightguns"],
  feats:["augezd","satschan","menitz","telnitz"],
  text:"The only ordered way out was the neck of dry ground at Augezd between the two meres, with French guns on the height above it. Some formations broke south across the frozen water. The 30th Bulletin claimed twenty thousand drowned; when the meres were drained the recovery was thirty-eight guns, about a hundred and thirty horses and two men. The catastrophe was real, but it was encirclement, not drowning."}
];

/* ---- what each headquarters knew, saw, ordered and expected ---- */
var COMMAND = {
fr:{
 0:[["saw","doc","Allied camp fires and movement on and behind the Pratzen plateau, observed from the Zuran before first light."],
    ["knew","doc","That the Allied army was more numerous and that the Tsar's staff, not Kutuzov, was directing it."],
    ["didnt","inf","The exact column boundaries and the order of march. Inferred: French accounts describe the Allied movement as read off the ground, not from captured orders."],
    ["ordered","doc","The army to stand behind the Goldbach; Soult's two divisions concealed in the valley; nothing to be done that might discourage the attack on the right."],
    ["expected","doc","That the enemy would march across his front to turn his right, leaving the plateau. His proclamation of 1 December says so in terms."]],
 1:[["saw","doc","The attack developing on Telnitz at the southern end of the line."],
    ["knew","doc","That Davout's detachment had reached Raigern overnight and would come up to the Goldbach during the morning."],
    ["ordered","doc","The right to give ground slowly and hold the villages."]],
 2:[["saw","doc","Allied columns descending off the plateau in strength."],
    ["knew","doc","Soult's answer that he needed under twenty minutes to reach the heights."],
    ["ordered","doc","A further quarter of an hour's delay before releasing the attack, to let more of the enemy get down into the valley."]],
 3:[["saw","doc","The crest of the Pratzen, once the mist lifted, and the 4th Column still on it."],
    ["didnt","inf","How strong the force still on the plateau was. Inferred: the attack went in with two divisions and no reserve committed."],
    ["ordered","doc","Soult to take the Pratzeberg and Stare Vinohrady."]],
 4:[["knew","doc","That Saint-Hilaire was in difficulty on the Pratzeberg."],
    ["ordered","doc","Bernadotte forward onto the plateau in support; Lannes to advance in the north."]],
 5:[["saw","inf","The northern battle from the Zuran. Inferred from the model's terrain, not documented: most of the Olmutz road sector, including the Santon, is in view from that mound."],
    ["ordered","doc","The cavalry reserve committed against the Allied horse."]],
 6:[["saw","doc","The Russian Guard attack on Stare Vinohrady."],
    ["ordered","doc","Bessieres to commit the Guard cavalry."],
    ["knew","doc","That the plateau, and with it the centre of the enemy army, was his."]],
 7:[["knew","doc","That Buxhowden's columns were still fighting in the villages, unaware of what had happened behind them."],
    ["ordered","doc","The centre to wheel south onto their rear, supported by the Guard and the grenadiers."]],
 8:[["saw","doc","The Allied left crowding into the Augezd defile and onto the meres."],
    ["ordered","doc","Artillery fire onto the defile and the ice."]]
},
al:{
 0:[["knew","doc","That the French had given up the Pratzen plateau and pulled back behind the Goldbach."],
    ["didnt","doc","That two French divisions were standing in the Goldbach valley. The fog in the valley hid them."],
    ["didnt","inf","That Bernadotte's corps and Davout's detachment had joined the army. Inferred: the Allied estimate of French strength was materially too low."],
    ["ordered","doc","Weyrother's dispositions: four columns south-west against the French right, Bagration to hold the highway."],
    ["expected","doc","A French army in retreat that would be turned and cut off from Vienna."]],
 1:[["saw","doc","Telnitz taken and retaken."],
    ["ordered","doc","The left-hand columns to press on across the Goldbach and wheel north."]],
 2:[["knew","doc","That the 4th Column was still on the plateau: Kutuzov was holding it back, and the Tsar rode up about 08:45 and ordered it forward (Russian Biographical Dictionary, 1903)."],
    ["knew","doc","That the villages on the stream were proving harder to take than expected."]],
 3:[["saw","doc","French infantry on the crest of the Pratzen, at close range, from the 4th Column's own position."],
    ["ordered","doc","Kutuzov: the 4th Column to face about; part of the II Column recalled up the slope."]],
 4:[["saw","doc","Kamensky, at the tail of the II Column, saw French troops on the height behind him and turned his brigade about on his own judgement."],
    ["didnt","doc","Buxhowden, commanding the three left-hand columns, had not been told that the centre was gone."]],
 5:[["knew","doc","That Bagration could not force the Santon and that Blasowitz had fallen."],
    ["ordered","doc","A withdrawal on Rausnitz, covering the Allied right."]],
 6:[["ordered","doc","Constantine to commit the Russian Imperial Guard against the French on Stare Vinohrady."],
    ["didnt","inf","That the French Guard was in hand and uncommitted a mile away. Inferred from the speed with which Bessieres answered."]],
 7:[["knew","doc","From about noon, that the plateau was lost and the army was cut in two."],
    ["didnt","doc","On the left, the scale of it. Buxhowden's columns were still attacking westward while being enveloped."]],
 8:[["ordered","doc","A general retreat south over the Augezd defile and the meres."],
    ["knew","doc","That the line of retreat was under artillery fire from ground the army had held at dawn."]]
}
};

/* Documented limits on what a headquarters could know about a specific
   formation. [phaseFrom, state]; state: seen | uncertain | unknown */
var KNOW_OVERRIDE = {
 al:{
  sthilaire:[[0,"unknown"],[3,"seen"]],
  vandamme: [[0,"unknown"],[3,"seen"]],
  guard_inf:[[0,"unknown"],[6,"seen"]],
  guard_cav:[[0,"unknown"],[6,"seen"]],
  drouet:   [[0,"unknown"],[6,"seen"]],
  rivaud:   [[0,"unknown"],[4,"uncertain"],[6,"seen"]],
  friant:   [[0,"unknown"],[2,"seen"]],
  bourcier: [[0,"unknown"],[2,"uncertain"]],
  c_gren:   [[0,"unknown"],[7,"seen"]],
  heightguns:[[0,"unknown"],[8,"seen"]]
 },
 fr:{
  constantine:[[0,"uncertain"],[6,"seen"]],
  rg_inf:[[0,"uncertain"],[6,"seen"]],
  rg_cav:[[0,"uncertain"],[6,"seen"]],
  kamensky:[[0,"unknown"],[4,"seen"]],
  prz:[[0,"uncertain"],[2,"seen"]]
 }
};

/* ============================================================
   THE TWO PLANS
   Weyrother's dispositions column by column, and the counter-plan
   Napoleon set out on 1 December. Routes are intended lines of march,
   not what actually happened.
   ============================================================ */
var PLANS = {
al:{
  name:"The Allied plan",
  author:"Drafted by Gen. Franz von Weyrother, Quartermaster-General. Read aloud at Krzenowitz after midnight, in German, to an audience largely of Russian officers, with no time to copy it out.",
  intent:"Turn the French right with overwhelming weight, force the Goldbach at the southern villages, then wheel the left wing north-west to envelop the French as they fall back toward Brünn - severing their line to Vienna - and roll them up against the hills. The centre is to follow the attack, not hold the plateau.",
  assumed:[
   "That the French, about 50,000 by the Allied estimate, were retreating and would not stand.",
   "That the Pratzen plateau could safely be vacated because the decisive ground was the French right.",
   "That five columns could cross one another's lines of march in darkness and arrive in order."],
  cost:"All three assumptions were wrong. Execution compounded them: the 4th Column started about two hours late - delayed by the cavalry column's counter-march and, in Russian accounts, chiefly by Kutuzov's reluctance to leave the heights - and was still on the plateau when Soult arrived.",
  staging:[
   {n:"Columns I-III on the southern plateau", c:[288,308], rx:62, ry:70},
   {n:"IV Column at Pratzen", c:[327,231], rx:52, ry:44},
   {n:"Reserve behind Krzenowitz", c:[417,198], rx:46, ry:38},
   {n:"Bagration on the highway", c:[377,95], rx:70, ry:30}],
  objectives:[
   {n:"Telnitz", p:[212,408]},{n:"Sokolnitz", p:[208,365]},
   {n:"Kobelnitz", p:[205,277]},{n:"Envelop toward Brünn", p:[138,334]}],
  cols:[
   {n:"Advance Guard - Kienmayer", forms:["kienmayer"], obj:[212,408], ord:"Precede the 1st Column, seize Telnitz at first light, then screen the outer flank toward Menitz.",
    route:[[291,367],[247,397],[218,409],[200,402]]},
   {n:"1st Column - Dokhturov", forms:["dok"], obj:[171,372], ord:"Descend from the southern plateau, force the crossing at Telnitz, then wheel north-west on Turas.",
    route:[[291,332],[269,362],[234,395],[198,395],[171,372]]},
   {n:"2nd Column - Langeron", forms:["lang"], obj:[190,354], ord:"Take Sokolnitz, cross the stream, conform on Dokhturov's right.",
    route:[[291,308],[265,325],[227,356],[190,354]]},
   {n:"3rd Column - Przybyszewski", forms:["prz"], obj:[196,332], ord:"Take the Sokolnitz castle and the pheasantry, cross, and link the attack to the centre.",
    route:[[290,282],[264,301],[234,332],[196,332]]},
   {n:"4th Column - Kollowrat and Miloradovich", forms:["milo", "kollo"], obj:[205,277], ord:"Move from Pratzen to Kobelnitz and hold the hinge between the attack and the right.",
    route:[[335,229],[293,245],[256,265],[207,277]]},
   {n:"5th Column - Liechtenstein", forms:["lich"], obj:[288,145], ord:"Cavalry. Cover the right of the attacking columns between Blasowitz and the plateau.",
    route:[[296,243],[316,218],[308,177],[288,145]]},
   {n:"Advance Guard of the Right - Bagration", forms:["bag"], obj:[253,73], ord:"Hold the Olmutz highway, pin the French left, and link to Liechtenstein.",
    route:[[315,41],[292,52],[273,62],[253,73]]},
   {n:"Reserve - Constantine", forms:["rg_inf", "rg_cav"], obj:[404,198], ord:"The Imperial Guard to remain behind Krzenowitz, in hand.",
    route:[[417,198],[380,195],[347,192]]}
  ]},
fr:{
  name:"Napoleon's plan",
  author:"Set out in the proclamation to the army and the orders of 1 December, and in the dispositions given to the corps commanders on the Zuran before dawn.",
  intent:"Invite the attack on the right by giving up the Pratzen plateau and holding the lower Goldbach thin. When the enemy centre has marched off the heights to join that attack, take the heights with two divisions held concealed in the valley, cut the Allied army in half, then wheel south onto the rear of everything that has gone down into the Goldbach.",
  assumed:[
   "That the Allies would read the abandoned plateau and the withdrawn outposts as weakness.",
   "That Davout could reach the lower Goldbach from Vienna in time to keep the right alive.",
   "That Legrand could hold roughly five kilometres of stream on his own for several hours."],
  cost:"The risk was carried entirely on the right. If Davout had not arrived, or if Legrand had broken before nine o'clock, the bait would have been swallowed with the army behind it.",
  staging:[
   {n:"Soult concealed in the Goldbach valley", c:[210,205], rx:40, ry:66},
   {n:"Reserve behind the Zuran", c:[189,161], rx:50, ry:40},
   {n:"Lannes and Murat on the highway", c:[227,114], rx:64, ry:34},
   {n:"Davout coming up from Raigern", c:[118,422], rx:80, ry:34}],
  objectives:[
   {n:"Pratzeberg", p:[285,289]},{n:"Stare Vinohrady", p:[313,205]},
   {n:"Hold the Santon", p:[222,87]},{n:"Close the Augezd defile", p:[297,372]}],
  cols:[
   {n:"The bait - Legrand, then Davout", forms:["legrand", "friant"], obj:[212,410], ord:"Hold the villages on the lower Goldbach and give ground slowly. Do nothing that might discourage the attack.",
    route:[[208,312],[207,371],[214,390],[212,410]]},
   {n:"The concealed centre - Soult", forms:["sthilaire"], obj:[285,289], ord:"Saint-Hilaire behind Puntowitz, Vandamme behind Girzikowitz, out of sight in the valley. On the signal, take the Pratzeberg and Stare Vinohrady.",
    route:[[204,218],[228,236],[254,260],[271,274],[285,287]]},
   {n:"The second axis - Vandamme", forms:["vandamme"], obj:[309,207], ord:"Climb the northern shoulder of the plateau and take the Old Vineyards, linking the assault to Lannes.",
    route:[[221,179],[236,191],[267,200],[309,207]]},
   {n:"The pivot - Lannes and Murat", forms:["suchet", "caffarelli", "santon"], obj:[304,46], ord:"Hold the Olmutz highway with the Santon fortified and entrenched. Advance only when the centre has gone in.",
    route:[[225,97],[247,75],[276,61],[304,46]]},
   {n:"In hand - Bernadotte, the Guard, the grenadiers", forms:["guard_inf", "guard_cav", "c_gren", "drouet"], obj:[300,211], ord:"Remain behind the Zuran as the general reserve, to be fed onto the plateau once it is taken.",
    route:[[189,161],[230,185],[263,201],[300,211]]},
   {n:"The wheel", forms:["sthilaire", "vandamme"], obj:[294,369], ord:"Once the plateau is held from Pratzen to the highway, turn the centre ninety degrees and come down on the rear of the Allied left.",
    route:[[288,249],[276,293],[286,341],[290,366],[294,369]]}
  ]}
};

/* ============================================================
   ACTS — five genuinely different battlefield situations,
   grouping the ten clock phases.
   ============================================================ */
var ACTS = [
 {id:"deception", n:"The Deception",      phases:[0],
  line:"Napoleon has given up the plateau and left his right thin. The Allies form to attack it."},
 {id:"advance",   n:"The Allied Advance", phases:[1,2],
  line:"Four columns go down into the Goldbach villages. The centre of the Allied position empties behind them."},
 {id:"strike",    n:"The Pratzen Strike", phases:[3,4],
  line:"Soult climbs out of the fog onto ground the Allies have just left, and holds it against everything sent back."},
 {id:"divided",   n:"The Army Divided",   phases:[5,6],
  line:"With the plateau lost the Allied army is in two halves. The last reserve is spent trying to take it back."},
 {id:"collapse",  n:"The Collapse",       phases:[7,8,9],
  line:"The French centre turns south onto the rear of an Allied left that is still attacking westward."}
];

/* ============================================================
   EVENTS — what happened, when, and what followed from it.
   t may be a single minute or an interval where the hour is not fixed.
   kind: decision | attack | capture | arrival | engagement | movement |
         withdrawal | collapse
   ============================================================ */
var EVENTS = [
{id:"columns-move", t:[240,420], n:"The Allied columns begin to leave the plateau", side:"al", kind:"movement",
 p:[291,276], forms:["kienmayer","dok","lang","prz"], cf:"A", claim:"fact",
 why:"Every column that goes down into the valley is a column no longer holding the centre."},

{id:"counter-march", t:[255,480], n:"Liechtenstein counter-marches across the 4th Column", side:"al", kind:"movement",
 p:[311,227], forms:["lich","milo","kollo"], cf:"A", claim:"fact",
 why:"The cavalry column had been posted on the wrong flank overnight; crossing the line of march contributed to the 4th Column starting about two hours late. Russian accounts put the delay chiefly on Kutuzov's reluctance to leave the heights."},

{id:"telnitz", t:420, n:"Kienmayer attacks Telnitz", side:"al", kind:"attack",
 p:[212,408], forms:["kienmayer","legrand"], cf:"A", claim:"fact",
 why:"The first shot of the battle, and the beginning of the attack Napoleon wanted."},

{id:"raigern", t:[240,285], n:"Friant's division at Raigern since the night", side:"fr", kind:"arrival",
 p:[18,500], forms:["friant","bourcier"], cf:"B", claim:"est",
 why:"Davout and Friant reached Raigern on the night of 1 December after about 113 km from Vienna in 40-46 hours (sources vary). Raigern lies just beyond this corner of the map."},
{id:"davout", t:[465,495], n:"Friant's leading brigade reaches the Goldbach", side:"fr", kind:"arrival",
 p:[198,402], forms:["friant"], cf:"B", claim:"est",
 why:"About 08:00, near Telnitz. Without it the French right does not survive the morning."},

{id:"sokolnitz", t:480, n:"Langeron and Przybyszewski attack Sokolnitz", side:"al", kind:"attack",
 p:[208,365], forms:["lang","prz","legrand"], cf:"A", claim:"fact",
 why:"The castle and the pheasantry are the strongest ground on the lower Goldbach, and the fight for them absorbs two columns."},

{id:"telnitz-retaken", t:510, n:"Friant retakes Telnitz, then withdraws behind the stream", side:"fr", kind:"attack",
 p:[214,406], forms:["friant"], cf:"A", claim:"fact",
 why:"A counterstroke straight off the march, and then a deliberate step back. The right is to be held, not won."},

{id:"decision", t:[505,525], n:"Napoleon releases Soult against the heights", side:"fr", kind:"decision",
 p:[177,134], forms:["gqg","c_iv","sthilaire","vandamme"], cf:"B", claim:"est",
 why:"Asked how long he needed, Soult is reported to have answered under twenty minutes, and Napoleon to have waited a further quarter of an hour to let more of the enemy get down into the valley. A memoir anecdote."},

{id:"soult", t:[525,555], n:"Saint-Hilaire and Vandamme climb the slope", side:"fr", kind:"attack",
 p:[262,262], forms:["sthilaire","vandamme"], cf:"A", claim:"fact",
 why:"Two divisions that had been standing in fog, invisible from the crest, arrive on the plateau the Allies have just vacated."},

{id:"pratzen-village", t:540, n:"Thiebault's brigade clears Pratzen village", side:"fr", kind:"capture",
 p:[276,243], forms:["sthilaire"], tolKm:1.5, tolWhy:"Thiebault\u2019s brigade is not plotted separately: the marker is the village it cleared, and at about 09:00 the division\u2019s plotted centre is still climbing the western slope below it", cf:"B", claim:"est",
 why:"Opens the way to the Pratzeberg. The hour is documented; the exact sequence within it is not."},

{id:"face-about", t:555, n:"Kutuzov orders the 4th Column to face about", side:"al", kind:"decision",
 p:[290,237], forms:["ahq","milo","kollo"], cf:"A", claim:"fact",
 why:"The Allied commander-in-chief, riding with the column, is the first to see what has happened."},

{id:"kamensky", t:585, n:"Kamensky turns his brigade about and drives the French off the crest", side:"al", kind:"engagement",
 p:[285,289], forms:["kamensky","sthilaire","lang"], cf:"A", claim:"fact",
 why:"The one piece of Allied initiative on the plateau, taken by a brigade commander on his own judgement."},

{id:"kursk", t:630, n:"Langeron's reinforcements arrive as the crest is lost", side:"al", kind:"engagement",
 p:[290,282], forms:["lang","kamensky"], cf:"C", claim:"recon",
 why:"Langeron rode back and sent troops up toward Kamensky; one account has two battalions arriving just as the position was abandoned. Which regiment, and what it lost, are not established."},

{id:"pratzeberg", t:660, n:"The Pratzeberg is firmly in French hands", side:"fr", kind:"capture",
 p:[285,289], forms:["sthilaire","legrand"], cf:"A", claim:"fact",
 why:"From here the French centre holds the high ground above the Goldbach valley and, in time, comes down into the back of the Allied columns fighting in it."},

{id:"blasowitz", t:675, n:"Blasowitz falls and Bagration is levered off the army", side:"fr", kind:"capture",
 p:[296,147], forms:["caffarelli","suchet","bag","lich"], tolKm:1.3, tolWhy:"division-level: the marker is the village; Caffarelli\u2019s plotted centre lies about 1.2 km from it, within the division\u2019s frontage", cf:"B", claim:"est",
 why:"The Allied right is separated from the centre and withdraws on Rausnitz in good order."},

{id:"guard-attack", t:[660,780], n:"The Russian Guard takes the eagle of the 4th Line", side:"al", kind:"attack",
 p:[313,205], forms:["rg_inf","rg_cav","constantine","vandamme"], cf:"B", claim:"est",
 why:"The last Allied reserve, and the only eagle Napoleon lost that day."},

{id:"guard-broken", t:[675,795], n:"Rapp's counter-charge breaks the Chevalier Guard", side:"fr", kind:"engagement",
 p:[308,210], forms:["guard_cav","guard_inf","drouet","rg_cav"], cf:"B", claim:"est",
 why:"Prince Repnin is taken prisoner. With the reserve spent, nothing remains to retake the plateau."},

{id:"hq-forward", t:[720,760], n:"Napoleon moves forward to Stare Vinohrady", side:"fr", kind:"decision",
 p:[309,207], forms:["gqg"], cf:"B", claim:"est",
 why:"From Stare Vinohrady he directs the centre while the Allied left is still fighting westward on the Goldbach with its rear open. Later he moves again, to the chapel of St Anthony above Augezd, from which he watches the end."},

{id:"buxhowden-blind", t:[700,760], n:"Buxhowden does not yet know the centre is gone", side:"al", kind:"movement",
 p:[263,376], forms:["buxhowden","dok","lang"], cf:"B", claim:"est",
 why:"Contemporaries put it about noon. Three columns go on attacking westward while the army behind them is being taken apart."},

{id:"davout-resumes", t:750, n:"Davout resumes the offensive", side:"fr", kind:"attack",
 p:[204,392], forms:["friant","bourcier"], cf:"A", claim:"fact",
 why:"The anvil becomes a hammer. Langeron is pushed back onto Sokolnitz from the west."},

{id:"wheel", t:[780,840], n:"The French centre turns south", side:"fr", kind:"movement",
 p:[277,303], forms:["sthilaire","vandamme","c_gren","guard_inf"], cf:"B", claim:"est",
 why:"Ninety degrees, off the heights, into the rear of Buxhowden's three columns."},

{id:"sokolnitz-falls", t:840, n:"Sokolnitz falls; Przybyszewski's column is surrounded", side:"fr", kind:"capture",
 p:[217,352], forms:["prz","friant","sthilaire"], cf:"A", claim:"fact",
 why:"The column tries to break out toward Kobelnitz, comes apart, and surrenders almost entire."},

{id:"augezd", t:870, n:"Vandamme takes the height above the Augezd defile", side:"fr", kind:"capture",
 p:[297,372], forms:["vandamme","heightguns"], cf:"A", claim:"fact",
 why:"The only ordered way out for the Allied left now lies under French guns."},

{id:"ice", t:900, n:"French artillery fires on the ice of the Satschan mere", side:"fr", kind:"collapse",
 p:[268,421], forms:["heightguns","dok","kienmayer"], tolKm:1.5, tolWhy:"the marker is the target of a bombardment: the guns fire from the chapel height about 2 km away, and the retreating columns are converging on the ice", cf:"A", claim:"fact",
 why:"The 30th Bulletin claimed twenty thousand drowned. The drained ponds gave up thirty-eight guns, about a hundred and thirty horses and two men. The catastrophe was encirclement, not drowning."},

{id:"end", t:990, n:"Organised resistance ends", side:"fr", kind:"collapse",
 p:[290,366], forms:[], cf:"A", claim:"fact",
 why:"Bagration withdraws on Rausnitz, the Guard on Austerlitz, and the Allied left has ceased to exist as a formation."}
];

/* ============================================================
   GUIDED TOUR — nine stops, about twelve minutes.
   Every stop reuses an existing chapter, plan or feature; none of the
   text asserts anything the reconstruction does not already carry.
   ============================================================ */
/* A stop names one moment (at), and as before a theme, plan or feature; it takes the moment's clock and its theme's camera, or the
   moment's phase's. Exceptions, each from the stop's own text: stop 4 keeps its own clock (t), because its text quotes the plateau
   reading at 07:15 (sim-test.js checks it); stops 2 and 5 keep their own cameras (the plan's overview; the Pratzen, which phase
   2's view does not show). */
var TOUR = [
{n:"The battlefield", at:"ph:0",
 x:"Ten kilometres of open Moravian farmland. The blue army to the west is French; to the east are the Russians in green and the Austrians in white, whose arrows and outlines are drawn in amber. Between them runs the Goldbach, a small stream in a marshy bottom, and behind it stands the Pratzen plateau, the high ground in the centre of the field."},
{n:"The Allied plan", at:"ph:0", plan:"al", cam:[-27,262,41,-27,0,9],
 x:"Weyrother's orders send four of the five Allied columns south-west, off the plateau, to turn the French right and cut the road to Vienna. The heavy arrows are the intended lines of march. Note what they all have in common: they lead away from the centre."},
{n:"The French deception", at:"ph:0", chapter:"deception",
 x:"Napoleon gave up the plateau on 1 December and camped behind the Goldbach, leaving his right so thin that a single division held five kilometres of stream. The weakness was real, which is what made it convincing."},
{n:"The Allied advance", at:"ph:1", t:445, chapter:"commitment",
 x:"From seven o'clock the Allied left goes down into the villages and stays there. Watch the figure on the plateau outline, a reading derived from the plotted positions with every man counted once: the Allied strength on the heights falls from about 39,000 at 04:00 to about 19,000 by 07:15, half of it gone before a shot is fired at the plateau."},
{n:"Why the Pratzen matters", at:"ph:2", feature:"pratzen", cam:[-136,46,31,-6,8,-3],
 x:"In this model's terrain an observer on the Pratzeberg summit can see about 73 per cent of the field, and one on the valley floor at Puntowitz under 3 per cent. That is a reading from the model, not a record of what anyone saw: on the morning of the battle the valley lay in fog, and it was the fog that hid Soult's divisions forming at the foot of the slope."},
{n:"The French strike", at:"ev:soult", chapter:"pratzen",
 x:"At about a quarter to nine Saint-Hilaire and Vandamme climb out of the fog onto ground the Allies have just left. Two divisions, no reserve committed, against a column still filing off the heights."},
{n:"The army divided", at:"ev:pratzeberg", chapter:"cut",
 x:"With the plateau gone the Allied army is in two halves that can no longer help one another. Buxhowden's forty thousand are still attacking westward and will not learn what has happened behind them until about noon."},
{n:"The collapse", at:"ev:augezd", chapter:"collapse",
 x:"The French centre turns ninety degrees and comes down off the heights into the rear of the Allied left. The only ordered way out is the neck of dry ground at Augezd, under guns on ground the Allies held at dawn."},
{n:"What it cost", at:"ph:9", chapter:null,
 x:"Allied losses are usually given as fifteen to sixteen thousand killed and wounded and twelve thousand or more taken, with about a hundred and eighty guns. French losses were near nine thousand. Everything you have watched today is a reconstruction: positions are graded A, B or C, strengths carry their ranges, and two figures on the situation line are computed rather than recorded. The sources panel says which is which."}
];
