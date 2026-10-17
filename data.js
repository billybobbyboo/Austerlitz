/* ============================================================
   AUSTERLITZ — historical dataset
   Map frame: x 0..680 (west->east, ~13 km), y 0..500 (north->south, ~10 km)
   conf: A = well documented · B = sector documented, frontage approximate
         C = reconstructed from narrative, position conjectural
   ============================================================ */

var NATION = {
  fr: {name:"France",  fill:"#2E5496", edge:"#16274A", ink:"#EAF0FA", tag:"FR"},
  ru: {name:"Russia",  fill:"#3E6B4A", edge:"#1C3222", ink:"#E9F2E9", tag:"RU"},
  at: {name:"Austria", fill:"#D9D2BF", edge:"#4A4638", ink:"#2A2720", tag:"AT"}
};

/* What kind of statement a datum is. Distinct from positional confidence:
   a position can be an ESTIMATE while the event itself is a FACT. */
var CLAIM = {
  fact:  {label:"Fact",          note:"Attested in the standard accounts of the battle."},
  est:   {label:"Estimate",      note:"The event is attested; the figure or frontage shown is an estimate."},
  recon: {label:"Reconstruction",note:"Inferred from the narrative. Treat as indicative, not as evidence."},
  disputed:{label:"Disputed",    note:"The event is attested, but its hour, or the hour of part of it, is disputed: the accounts read disagree with each other or with this map's timing, or give none while this map's own texts differ; each is named, and the map keeps its timing."}
};
var CLAIM_FROM_CONF = {A:"fact", B:"est", C:"recon"};

var STATUS = {
  concealed:      {label:"Concealed",       tone:"quiet"},
  reserve:        {label:"In reserve",      tone:"quiet"},
  forming:        {label:"Forming up",      tone:"quiet"},
  observing:      {label:"Observing",       tone:"quiet"},
  fortifying:     {label:"Fortifying",      tone:"quiet"},
  holding:        {label:"Holding",         tone:"steady"},
  march:          {label:"On the march",    tone:"steady"},
  delayed:        {label:"Delayed",         tone:"warn"},
  countermarch:   {label:"Counter-marching",tone:"warn"},
  advancing:      {label:"Advancing",       tone:"active"},
  attacking:      {label:"Attacking",       tone:"active"},
  charging:       {label:"Charging",        tone:"active"},
  counterattack:  {label:"Counter-attacking",tone:"active"},
  engaged:        {label:"Heavily engaged", tone:"warn"},
  surprised:      {label:"Surprised",       tone:"warn"},
  supporting:     {label:"Supporting",      tone:"steady"},
  repulsed:       {label:"Repulsed",        tone:"bad"},
  withdrawing:    {label:"Withdrawing",     tone:"bad"},
  retreating:     {label:"Retreating",      tone:"bad"},
  encircled:      {label:"Encircled",       tone:"bad"},
  broken:         {label:"Broken",          tone:"bad"},
  captured:       {label:"Captured",        tone:"gone"},
  pursuing:       {label:"Pursuing",        tone:"active"}
};

/* ---------------- phases ---------------- */
var PHASES = [
{ id:0, t0:240, t1:420, clock:"04:00 - 07:00", label:"Deployment", title:"Dispositions in the dark",
  lede:"Napoleon has deliberately given up the Pratzen plateau and left his right, along the lower Goldbach, looking thin enough to invite attack. Weyrother's Allied orders, read out at Krzenowitz after midnight to commanders who largely did not understand them, send four of five columns south-west across the French front. Fog fills the Goldbach valley. Soult's two assault divisions are standing in it, invisible from the heights.",
  events:[
    ["c. 01:00","Weyrother reads the dispositions at Allied headquarters, Krzenowitz. Kutuzov reportedly dozes."],
    ["c. 04:00","The disposition orders the Allied columns to march at seven; Thiebault records reports through the night of the Allied left moving, judged by the noise. Liechtenstein's cavalry, misplaced on the left, must counter-march north across the front of the 4th Column; the Materialien has it ordered off only at dawn."],
    ["before dawn","Napoleon mounted at one in the morning to ride round his posts (the 30th Bulletin), and Thiebault has him on horseback long before day; the dispositions called his marshals to his bivouac for half past seven. His post, 'la butte' of the orders, is taken here to be the Zuran; the map places him there from 04:00, and the hour he took post is not established."]],
  cam:[-230,132,211,-28,0,1], mist:1.0 },

{ id:1, t0:420, t1:480, clock:"07:00 - 08:00", label:"Telnitz", title:"The Allied left opens the battle",
  lede:"Kienmayer's Austrian advance guard attacks Telnitz, the southernmost village on the Goldbach. Legrand's thin line holds the buildings and the vineyard bank above them, and the village changes hands repeatedly. Behind Kienmayer, Dokhturov's I Column is coming down off the southern end of the plateau.",
  events:[
    ["c. 07:00","Kienmayer's advance guard attacks Telnitz. According to Stutterheim the musket fire there grew very murderous, and the Szekler infantry regiment lost two thirds of its men, dead and wounded."],
    ["c. 07:00","Dokhturov's I Column leaves its camp as the disposition ordered; Kutuzov's report has it force the enemy back to Telnitz about eight, and Mikhailovsky-Danilevsky has Dokhturov begin the attack on Telnitz at half past eight."],
    ["c. 08:00","Friant's leading brigade comes up to the Goldbach near Telnitz. The hour on the timeline is this map's: Stutterheim and the Moniteur's remarks of 1806 have Friant's men come up about nine, Schönhals has them attack about nine, Mikhailovsky-Danilevsky after Telnitz had fallen; Davout's report has word of the attack reach him on the march about eight and gives no hour for the brigade's arrival. The division had reached Raigern overnight: about 115 km from Vienna in under two days in Sokolov, thirty-six leagues in forty-eight hours in Thiers."]],
  cam:[-167,62,162,-55,4,62], mist:0.98 },

{ id:2, t0:480, t1:525, clock:"08:00 - 08:45", label:"Sokolnitz", title:"Sokolnitz, the castle and the pheasantry",
  lede:"Langeron and Przybyszewski attack Sokolnitz village, its walled castle and the pheasantry enclosure beyond. Friant's leading brigade retakes Telnitz, then loses it again in the fog (Davout's report, which has the village in French hands at half past nine; the map shows it in this phase). On the plateau the 4th Column, which was meant to replace the troops leaving the heights, is still standing still: Liechtenstein's cavalry has cut across its line of march. A gap opens between it and the 3rd Column.",
  events:[
    ["c. 08:00","Langeron attacks Sokolnitz; Przybyszewski goes for the castle and pheasantry."],
    ["c. 08:30","Friant's leading troops retake Telnitz, then lose it again in the fog. Davout's report has the village in French hands at 09:30; the hour on the timeline is this map's."],
    ["c. 08:30","Napoleon asks Soult how long he needs to reach the heights. Twenty minutes at most, Soult answers in Thiebault's memoirs (ten in Ségur's), and Napoleon waits a further quarter of an hour. The hour is disputed: about eight in Ségur, the aide's report at half past eight in Thiebault, about nine in the Austrian accounts."]],
  cam:[-144,52,130,-56,4,46], mist:0.90 },

{ id:3, t0:525, t1:570, clock:"08:45 - 09:30", label:"The Pratzen", title:"Soult storms the heights",
  lede:"Saint-Hilaire and Vandamme climb out of the fog into sunlight onto a plateau the 4th Column is still crossing. St-Hilaire makes for the Pratzeberg south of Pratzen village, Vandamme for Stare Vinohrady, the 'old vineyards', north-east of the village. Kutuzov, riding with the 4th Column, sees the danger and begins pulling troops back. The Allied centre is being broken, but the plateau will not be firmly French until about 11:00.",
  events:[
    ["c. 08:45","Soult's divisions advance. The mist lifts off the heights."],
    ["c. 09:00","Thiebault's brigade clears Pratzen village; the 10e Legere pushes on for the Pratzeberg."],
    ["c. 09:15","Kutuzov orders the 4th Column to face about and recalls part of the II Column."]],
  cam:[-136,46,31,-6,8,-3], mist:0.16, flash:"The sun of Austerlitz, as memoirs call it" },

{ id:4, t0:570, t1:630, clock:"09:30 - 10:30", label:"Pratzeberg", title:"The crisis on the Pratzeberg",
  lede:"Kamensky's brigade, marching for Sokolnitz at the tail of Langeron's column, sees the French on the height behind it, turns about and attacks. Jurczek's Austrians join in and Saint-Hilaire is pushed back toward the crest. In the same hour, and independently, Lannes begins his advance astride the Olmutz highway in the north.",
  events:[
    ["c. 09:30","Lannes advances along the highway. Bagration counter-attacks. The two battles now run in parallel."],
    ["c. 09:45","Kamensky turns his brigade about and drives the 10e Legere off the crest. No account read gives the hour of the turn, only its sequence; his brigade's record on this map puts it in the 08:45 phase."],
    ["c. 10:15","Jurczek's Austrians attack the Pratzeberg; French and Austrians briefly mistake each other's identity. No source read gives the hour; Schönhals makes the attack simultaneous with Kamensky's."],
    ["c. 10:30","Langeron rides back and sends reinforcements up the slope; they arrive as the position is lost. The Kursk regiment in the accounts that tell it, its loss disputed (up to 1,600 men in Mikhailovsky-Danilevsky; two battalions in Langeron's journal); the hour is this map's."]],
  cam:[-75,38,42,7,8,12], mist:0.05 },

{ id:5, t0:630, t1:675, clock:"10:30 - 11:15", label:"Olmutz road", title:"The northern battle decided",
  lede:"Liechtenstein's and Uvarov's horse charge the French cavalry screen and Murat answers with Nansouty's and d'Hautpoul's cuirassiers. The Santon and its eighteen guns hold the flank, Blasowitz falls; in Thiers, Lannes then carries Holubitz and Krug and parts Bagration's infantry from Liechtenstein's cavalry, while in Schönhals Bagration's line is broken later, by Caffarelli's, Suchet's and d'Hautpoul's attacks. On the plateau, Saint-Hilaire's brigades carry their part of the Pratzen heights with their own charge, as Thiebault tells it, and Schönhals has Soult send Levasseur's brigade to support their right.",
  events:[
    ["c. 10:40","The cavalry collision west of Blasowitz. Kellermann falls back through his infantry and reforms."],
    ["c. 11:00","The Pratzeberg is firmly in French hands."],
    ["c. 11:15","Blasowitz falls; no source read gives the hour, and the accounts differ on its order: the Allied report printed in 1806 has it fall before Liechtenstein sent in the uhlans, and Schönhals tells of it after the uhlans' charge, during the cavalry fights."]],
  cam:[-120,58,-150,34,6,-66], mist:0.0 },

{ id:6, t0:675, t1:765, clock:"11:15 - 12:45", label:"The Guard", title:"The Russian Guard at Stare Vinohrady",
  lede:"Grand Duke Constantine commits the Guard, which Stutterheim calls the reserve of the Allied right, against Vandamme on the Old Vineyards. In Mikhailovsky-Danilevsky the Guard infantry overthrows the first two French columns with the bayonet; in Schönhals the Life Guard Horse cuts down a battalion of the 4th Line and a light battalion of the 24th and takes the 4th's eagle, which an Allied official report, first printed in the Materialien of 1806, calls the only trophy of the day; who took it is disputed (the Life Guard Horse in Stutterheim and Schönhals, the Chevalier Guards in Marbot). Bessieres brings up the Guard cavalry and Rapp charges with the chasseurs and Mamelukes; a division of Bernadotte's corps, Drouet's by his own memoir as Sokolov quotes it, meets the attack, though Thiebault counts I Corps' 2nd division among the troops that took no part.",
  events:[
    ["after 11:00","The Russian Guard attacks Vandamme; the 4th Line loses its eagle. The hour is disputed: before one by the order of the 30th Bulletin's and Mikhailovsky-Danilevsky's narratives, by about noon in Schönhals, about 13:00 in Rapp's memoirs and Ségur's."],
    ["after 11:15","Bessieres and Rapp counter-charge. The Chevalier Guard is broken; Prince Repnin captured. The hour is disputed: the map draws the charge from 11:15; Rapp and Ségur put the Guard's last effort about 13:00."],
    ["c. 12:00","Napoleon moves forward from the Zuran to Stare Vinohrady."],
    ["c. 12:00","Buxhowden, on the Allied left, is still unaware of the collapse behind him."],
    ["c. 12:30","Davout regroups and attacks; Langeron is forced back toward Sokolnitz."]],
  cam:[-76,36,-1,26,6,-31], mist:0.0 },

{ id:7, t0:765, t1:870, clock:"12:45 - 14:30", label:"The wheel", title:"The centre turns south",
  lede:"With the plateau secure and the Allied right pushed back beyond Blasowitz, Napoleon turns his centre ninety degrees. Saint-Hilaire and Vandamme come down off the heights onto the back of Buxhowden's three columns, supported by the Guard and the grenadier division, while Davout resumes the offensive from the west. Przybyszewski's column, caught between them in Sokolnitz, is surrounded.",
  events:[
    ["c. 13:00-14:00","Soult and Davout launch the converging assault on the Allied left."],
    ["c. 14:00","Sokolnitz falls. Przybyszewski's column is broken up and largely captured."]],
  cam:[-160,112,-55,-20,0,59], mist:0.0 },

{ id:8, t0:870, t1:1020, clock:"14:30 - 17:00", label:"The ponds", title:"Augezd, the ponds and the ice",
  lede:"By the afternoon a way out for the Allied left runs south over the defile at Augezd and the frozen meres beyond. This map reads it as a way left open, and the retreat the disposition ordered for the left, by the Turas wood, Kobelnitz and Puntowitz, as running through ground the French held. French guns on the heights fire down on the ice. The 30th Bulletin claimed twenty thousand Russians drowned here; Schönhals, on the Telnitz priest's word, has sixty to at most a hundred. General Suchet's report of 16 December 1805, as Sokolov quotes it, has thirty-six guns, 138 horses and three bodies taken from the pond near Augezd when it was drained; the figures usually given, thirty-eight guns, about a hundred and thirty horses and two men, were not traced to a source in this reading. Napoleon comes to the chapel of St Anthony above Augezd (Schönhals).",
  events:[
    ["c. 14:30","Vandamme takes the height above Augezd; the causeway comes under fire."],
    ["c. 15:00","French artillery fires on the ice of the Satschan mere. The accounts differ on the hour: Schönhals has the whole left wing past the Satschan dam by half past two; Thiebault puts the drowning in the last half hour of the firing, which ended about half an hour after three."],
    ["c. 16:30","Organised resistance ends, by this map's reckoning after Sokolov's end of the firing in the north; the accounts end the fighting from the Bulletin's victory decided at one to Mikhailovsky-Danilevsky's last shots between five and six. Bagration holds the height toward Rausnitz, where Mikhailovsky-Danilevsky has him at dusk; Schönhals has him withdraw on Austerlitz about six; the Guard on Austerlitz."]],
  cam:[-122,96,2,-18,0,68], mist:0.22 },

{ id:9, t0:1020, t1:1080, clock:"After dark", label:"Reckoning", title:"The reckoning",
  lede:"The figures for the losses differ widely. Mikhailovsky-Danilevsky has the Russians lose up to 21,000 killed, wounded and taken and 133 guns, and the Austrians 5,922; Schönhals about 15,000 Russian prisoners and 5,000 to 6,000 killed and wounded; an unsigned official report, first printed in the Materialien of 1806, has 3,000 to 4,000 killed and wounded and 8,000 to 10,000 prisoners. Napoleon claimed forty colours on 3 December and forty-five on 5 December. The French reports, as Sokolov gives them, count 1,305 killed, 6,940 wounded and 573 taken or missing; Sokolov himself puts the French loss at nine to nine and a half thousand. Austria signs at Pressburg on 26 December. The Confederation of the Rhine follows in July, and on 6 August 1806 Francis II lays down the imperial crown, ending the Holy Roman Empire.",
  events:[
    ["2 Dec","Allied army effectively destroyed as a field force; Russia begins withdrawing east."],
    ["26 Dec","Treaty of Pressburg: Austria cedes Venetia, Istria, Dalmatia, Tyrol and Vorarlberg."],
    ["6 Aug 1806","Francis II abdicates as Holy Roman Emperor."]],
  cam:[-220,158,206,-28,0,6], mist:0.30 }
];

/* ---------------- formations ----------------
   track keys are phase ids; values carry forward until changed.
   p = [mapX, mapY] · st = status key · obj = objective · act = what it is doing
   cf = confidence for that position
   TIMING (owner decision 40; the rule is set out above anchorList in app.js). An entry with a position is an anchor, and
   by default it is reached at its phase's START: the move into it is complete as the phase opens. An anchor reached later,
   or whose move is dated to begin at a stated time, carries tm = {at, dep (minutes of the day), gr (timing grade A/B/C),
   basis ("source" or "app narrative, unsourced"), ev (the dated statements it follows, quoted), note}. No tm is written
   without a dated statement; a range is kept as a range. moveMin = the minutes a move takes ("holds, then marches"). */

var FORMATIONS = {

/* ======================= FRENCH ======================= */
gqg:{ ech:"army", nation:"fr", arm:"hq", desig:"G.Q.G.",
  name:"Imperial Headquarters", commander:"Emperor Napoleon I",
  staff:"Marshal Berthier, chief of staff. Gen. Songis commanding the artillery.",
  strength:null, parent:null,
  army:{men:"about 73,000", guns:139, src:"Duffy 1977; Smith 1998"},
  role:"Direction of the army. Napoleon directed the battle from the height of his bivouac, taken here to be the Zuran, then from Stare Vinohrady, and in the last phase from the height above Augezd by the chapel of St Anthony.",
  note:"Duffy (1977) and Smith (1998) give about 73,000 French of all arms with 139 guns - an army total, not the headquarters' own. Other accounts range from 65,000 to 75,000.",
  track:{
    0:{p:[177,134],st:"observing",cf:"B",obj:"Hold the right; break the Allied centre once it has committed",act:"On the height of his bivouac, taken here to be the Zuran: 'la butte' of the orders of 1 December, 'the barrow by Schlapanitz' in Mikhailovsky-Danilevsky. The dispositions call his marshals to his bivouac for the morning's orders"},
    3:{st:"observing",act:"Releases Soult against the heights; a memoir anecdote, as Thiebault tells it, has him wait a further quarter of an hour first"},
    6:{tm:{dep:720,gr:"B",basis:"app narrative, unsourced",ev:["Napoleon moves forward from the Zuran to Stare Vinohrady.","About noon, for Stare Vinohrady"],note:"dated c. 12:00, and the Zuran is vacated about noon: a departure. The arrival follows the existing 40-minute march (moveMin)"},
       p:[309,207],cf:"A",via:[[215,154],[236,165]],moveMin:40,act:"Moves forward from the Zuran to Stare Vinohrady"},
    7:{p:[307,227],act:"Orders the centre to wheel south onto Buxhowden's rear"},
    8:{p:[294,352],cf:"B",act:"At the chapel of St Anthony above Augezd, having come from the Pratzen with the Guard cavalry and artillery (Schönhals; a French officer's note of 1806 has him come down to the chapel with the Guard cavalry); Mikhailovsky-Danilevsky has him place the Guard artillery on the Augezd heights in person"}}},

c_iv:{ ech:"corps", nation:"fr", arm:"inf", desig:"IV Corps",
  name:"IV Corps", commander:"Marshal Nicolas Soult", parent:null,
  strength:23600, strengthNote:"23,600 is Sokolov's estimate for 2 December from the returns of 22 November, when he counts 24,690 present: Saint-Hilaire 8,128 (Vare's brigade within it), Vandamme 7,913, Legrand 7,361, Margaron's light cavalry 953, the park 307 and the staff 28. The three divisions' working figures here (6,600, 6,700 and 7,000, summing to 20,300) are not from a source read. No gun count for 2 December is read; at the Rhine crossing Sokolov's tables give the corps 36 guns",
  role:"The centre assault. Two divisions storm the Pratzen; the third holds the lower Goldbach.",
  children:["sthilaire","vandamme","legrand","heightguns"]},

heightguns:{ ech:"bde", nation:"fr", arm:"art", desig:"Batteries on the plateau",
  name:"French guns on the heights", commander:"Corps and Guard artillery", parent:"c_iv",
  strength:null, guns:null,
  strengthNote:"The number of pieces brought onto the plateau in the wheel is not recorded. For the guns turned on the Allied left at the meres at the end, no account read gives a count at the chapel: Schönhals names the artillery of IV Corps and the Guard on the height, Mikhailovsky-Danilevsky the Guard artillery on the Augezd heights; the 30th Bulletin has twenty guns with which the Emperor went against the corps backed against a lake, Thiebault's memoirs 24 pieces of the Guard that broke the ice, and Sokolov 24 guns of the Guard horse artillery under Colonel Couin, none of them placing their guns at the chapel. '24 guns of the Guard and IV Corps' by the chapel is found in this reading only on a tourist website. At the Rhine crossing Sokolov's tables give IV Corps 36 guns and the Guard 24; no source read gives either on 2 December",
  role:"Fires from the captured plateau into the rear of the Allied left, and later onto the Augezd defile and the ice.",
  note:"That French artillery fired from the height above Augezd onto the retreating Allied left and the ice of the Satschan mere is documented (Schönhals, Mikhailovsky-Danilevsky); Stutterheim has it fire on the fugitives without saying where it stood. Its place on the plateau in the wheel is reconstructed; by the chapel the sector is documented and the point estimated, not surveyed.",
  track:{
    7:{p:[275,283],st:"holding",cf:"C",claim:"recon",
       obj:"Beat the ground behind Buxhowden's columns",
       act:"Unlimbers on the southern shoulder of the plateau as the centre wheels"},
    8:{p:[288,357],st:"attacking",claim:"est",moveMin:45,
       obj:"Command the Augezd defile and the meres",
       cf:"B",act:"Artillery of IV Corps and of the Guard, brought onto the height above Augezd (Schönhals), fires down onto the causeway and the frozen mere; Mikhailovsky-Danilevsky has the Guard artillery placed on the Augezd heights by Napoleon in person. That it stood by the chapel of St Anthony is this map's inference"},
    9:{p:[288,357],st:"holding",act:"Ceases fire at nightfall"}}},

sthilaire:{ ech:"div", nation:"fr", arm:"inf", desig:"1re Div., IV Corps",
  name:"Saint-Hilaire's Division", commander:"Gen. de division Louis Vincent de Saint-Hilaire",
  staff:"Brigades: Morand · Thiebault · Vare", parent:"c_iv",
  strength:6600, strengthNote:"about 6,600, this map's working figure, not from a source read; Sokolov counts 8,128 present on 22 November, Vare's brigade (the 43e and 55e) within it. This map also lists that brigade with Vandamme, as attached from Saint-Hilaire", guns:null,
  role:"Right-hand assault division against the Pratzeberg; later the hinge of the wheel south.",
  track:{
    0:{p:[201,221],st:"concealed",cf:"A",obj:"Await the signal in the Goldbach valley",act:"Standing in fog behind Puntowitz, hidden from the plateau"},
    2:{p:[206,231],st:"forming",act:"Crosses the Goldbach and forms for the attack"},
    3:{tm:{dep:525,gr:"C",basis:"app narrative, unsourced",ev:["Soult's divisions advance. The mist lifts off the heights.","At about 08:45 they climbed the western slope","Thiebault's brigade clears Pratzen village; the 10e Legere pushes on for the Pratzeberg."],note:"the climb begins c. 08:45 on this map, inside the sources' range (about eight in Ségur, the aide's report at half past eight in Thiebault, about nine in Stutterheim and Schönhals), and passes Pratzen village c. 09:00; no source read dates its end, so the arrival is derived"},
       p:[267,275],st:"attacking",cf:"A",via:[[218,230]],obj:"Seize the Pratzeberg",act:"Climbs the western slope; Thiebault clears Pratzen village, the 10e Legere pushes for the summit"},
    4:{p:[283,287],st:"engaged",cf:"A",obj:"Hold the Pratzeberg",act:"Fights off Kamensky's brigade, then Jurczek's Austrians; as Thiebault tells it, Saint-Hilaire proposed falling back before Colonel Pouzet objected and the brigades' own charge carried their part of the heights"},
    5:{p:[287,282],st:"holding",act:"Consolidating on the summit with Levasseur's brigade attached"},
    6:{p:[288,272],st:"holding",obj:"Cover the right of the plateau",act:"Faces east while Vandamme is attacked to the north"},
    7:{tm:{dep:780,at:840,gr:"B",basis:"app narrative, unsourced",ev:["Between about 13:00 and 14:00 Napoleon turned his centre ninety degrees and brought it down off the plateau","Soult and Davout launch the converging assault on the Allied left."],note:"the wheel is dated as a range, and the move is shown across all of it"},
       p:[285,324],st:"advancing",cf:"A",obj:"Take Buxhowden's columns in the rear",act:"Wheels south off the heights toward Sokolnitz and Telnitz"},
    8:{p:[236,352],st:"attacking",cf:"B",act:"Closes on Sokolnitz from the east while Davout presses from the west"},
    9:{p:[255,390],st:"pursuing",act:"Holds the ground between Telnitz and Augezd"}}},

vandamme:{ ech:"div", nation:"fr", arm:"inf", desig:"2e Div., IV Corps",
  name:"Vandamme's Division", commander:"Gen. de division Dominique Vandamme",
  staff:"43e and 55e de Ligne attached from Saint-Hilaire", parent:"c_iv",
  strength:6700, strengthNote:"about 6,700, this map's working figure, not from a source read; Sokolov counts 7,913 present on 22 November (its lines add to 7,895), without Vare's brigade, which this map lists here as attached from Saint-Hilaire",
  role:"Left-hand assault division against Stare Vinohrady; receives the Russian Guard counterattack.",
  track:{
    0:{p:[217,171],st:"concealed",cf:"A",obj:"Await the signal",act:"Concealed in the valley behind Girzikowitz"},
    2:{p:[221,182],st:"forming",act:"Crosses the Goldbach"},
    3:{tm:{dep:525,gr:"C",basis:"app narrative, unsourced",ev:["Soult's divisions advance. The mist lifts off the heights.","At about 08:45 they climbed the western slope"],note:"the climb begins c. 08:45 on this map, inside the sources' range (about eight in Ségur, the aide's report at half past eight in Thiebault, about nine in Stutterheim and Schönhals); no source read dates its end, so the arrival is derived"},
       p:[282,209],st:"attacking",cf:"A",via:[[232,173]],obj:"Seize Stare Vinohrady",act:"Climbs toward Stare Vinohrady, the 'old vineyards' (whether vines stood there in 1805 is not established)"},
    4:{p:[309,207],st:"holding",act:"Consolidates on the Old Vineyards, facing east"},
    6:{p:[296,206],st:"engaged",cf:"A",obj:"Hold Stare Vinohrady",act:"Struck by the Russian Imperial Guard; two battalions broken, and the eagle of the 4th Line taken by the Guard cavalry"},
    7:{tm:{dep:780,gr:"B",basis:"app narrative, unsourced",ev:["Between about 13:00 and 14:00 Napoleon turned his centre ninety degrees and brought it down off the plateau","Soult and Davout launch the converging assault on the Allied left."],note:"the wheel begins c. 13:00. Its end, c. 14:00, cannot be the arrival here: the next anchor, the height above Augezd c. 14:30, is 3.3 km on, 40 minutes at the ceiling; so the arrival is derived"},
       p:[289,243],st:"advancing",obj:"Wheel south along the plateau",act:"Turns south with Saint-Hilaire toward the Allied rear"},
    8:{p:[270,347],st:"attacking",cf:"A",obj:"Take the height above Augezd",act:"Seizes the ground commanding the causeway between the meres"},
    9:{p:[287,365],st:"pursuing",act:"Holds the Augezd defile"}}},

legrand:{ ech:"div", nation:"fr", arm:"inf", desig:"3e Div., IV Corps",
  name:"Legrand's Division", commander:"Gen. de division Claude Legrand",
  staff:"Brigades: Merle · Levasseur (Sokolov, 22 November); the situation of 28 October gives Levasseur, Merle and Brouard. Féry, given here from Duffy and Smith (cited, not read), is Vandamme's brigadier in both. Colonel Schobert's 3e de Ligne and the Tirailleurs du Pô in Telnitz", parent:"c_iv",
  strength:7000, strengthNote:"about 7,000, this map's working figure, not from a source read; 7,361 present on 22 November (Sokolov); 5,000 to 6,000 in Stutterheim (1806)",
  role:"The bait. Two brigades in Sokolov's order of battle cover roughly five kilometres of the lower Goldbach alone.",
  track:{
    0:{p:[208,312],st:"holding",cf:"A",obj:"Hold the lower Goldbach from Kobelnitz to Telnitz",act:"Strung out along the stream; skirmishing through the night"},
    1:{p:[211,379],st:"engaged",cf:"A",obj:"Hold Telnitz",act:"Contests Telnitz house by house against Kienmayer"},
    2:{p:[206,366],st:"engaged",obj:"Hold Sokolnitz",act:"Fights for Sokolnitz village and the castle wall"},
    4:{p:[220,321],st:"supporting",cf:"B",act:"Levasseur's brigade marches up onto the Pratzeberg: Schönhals has Soult send it, held in reserve, to support Saint-Hilaire's right"},
    7:{tm:{dep:780,at:840,gr:"C",basis:"app narrative, unsourced",ev:["Presses east across the stream as the trap closes","Between about 13:00 and 14:00 Napoleon turned his centre ninety degrees and brought it down off the plateau"],note:"the act ties the move to the trap closing, dated 13:00-14:00"},
       p:[213,371],st:"attacking",via:[[211,322],[208,365]],act:"Presses east across the stream as the trap closes"}   /* route inferred: the west-bank road through Sokolnitz, not a documented march */,
    8:{tm:{at:900,gr:"C",basis:"app narrative, unsourced",ev:["Several times between 07:00 and 15:00","Retakes Telnitz for good"],note:"Telnitz changed hands until about 15:00; taking it for good is the last change"},
       p:[217,387],st:"attacking",via:[[206,372],[210,377]],act:"Retakes Telnitz for good"},
    9:{p:[228,393],st:"holding"}}},

c_iii:{ ech:"corps", nation:"fr", arm:"inf", desig:"III Corps",
  name:"III Corps (detachment)", commander:"Marshal Louis-Nicolas Davout", parent:null,
  strength:4300, strengthNote:"Duffy and Smith give 4,300 men present, including 830 cavalry, with 12 guns. Other accounts put Friant's division alone at about 6,400, so the figure is genuinely disputed", guns:12,
  role:"Holds the extreme right for most of the morning against forces several times its number: Thiers gives seven to eight thousand foot, with the 3e de Ligne, which this map has in IV Corps, and 2,800 horse against 35,000 Russians on the Goldbach, and Davout's report speaks of extremely strong columns. Derived from Thiers's figures, that is about 3.2 to 3.6 to one against foot and horse, 4.4 to 5 to one against the foot alone.",
  children:["friant","bourcier"],
  note:"Caffarelli's division, normally of III Corps, fought under Lannes on the opposite flank."},

friant:{ ech:"div", nation:"fr", arm:"inf", desig:"2e Div., III Corps",
  name:"Friant's Division", commander:"Gen. de division Louis Friant",
  staff:"Brigades: Kister · Lochet · Heudelet", parent:"c_iii",
  strength:3470, strengthNote:"about 3,470 in Duffy and Smith; some accounts give as many as 6,400",
  role:"Arrives straight from the march and counterattacks without resting.",
  track:{
    0:{p:[26,495],st:"march",cf:"B",obj:"Reach the lower Goldbach",act:"At Raigern since the night of 1 December, 8 km south-west of Telnitz and just beyond the map edge, after about 115 km from Vienna in under two days in Sokolov, thirty-six leagues in forty-eight hours in Thiers, a march whose figures vary between the sources"},
    1:{p:[167,410],st:"march",act:"Marching from Raigern toward Telnitz"},
    2:{tm:{at:510,gr:"C",basis:"app narrative, unsourced",ev:["Friant's leading troops retake Telnitz, then lose it again in the fog.","Friant's leading brigade comes up to the Goldbach near Telnitz."],note:"the anchor is the position by Telnitz after the village is retaken, c. 08:30 on this map; Davout's report has the village in French hands at half past nine, then lost again, and the leading brigade at the Goldbach about nine in Stutterheim (question 177); the leading brigade reaches the Goldbach c. 08:00 on the way on this map"},
       p:[198,402],st:"counterattack",cf:"A",obj:"Retake Telnitz",act:"Heudelet's brigade retakes Telnitz, then loses it again: in Davout's report a French regiment, not recognising it in the fog, fired on it, and the Russians took the village again with fresh troops"},
    3:{p:[200,398],st:"engaged",obj:"Hold the stream line",act:"Holds against Dokhturov and Kienmayer with a fraction of their strength"},
    7:{p:[204,390],st:"attacking",cf:"A",obj:"Press east across the Goldbach",act:"Resumes the offensive at about 12:30 as the trap closes"},
    8:{p:[214,410],st:"attacking"},
    9:{p:[222,412],st:"holding"}}},

bourcier:{ ech:"div", nation:"fr", arm:"cav", desig:"4e Div. Dragons",
  name:"Bourcier's Dragoons", commander:"Gen. de division François Bourcier", parent:"c_iii",
  strength:830, strengthNote:"about 830 sabres present. Only a fraction of the division reached the field",
  role:"Covers Davout's open southern flank and the Vienna road.",
  track:{
    0:{p:[22,489],st:"march",cf:"C"},
    2:{p:[184,420],st:"holding",obj:"Cover the right of the Goldbach line",act:"Screens the ground south of Telnitz"},
    7:{p:[201,416],st:"advancing"},
    8:{p:[253,393],st:"pursuing",via:[[212,408],[247,397]],act:"Pursues along the Telnitz to Augezd track"},
    9:{p:[297,374],st:"pursuing",via:[[273,378]]}}},

c_v:{ ech:"corps", nation:"fr", arm:"inf", desig:"V Corps",
  name:"V Corps", commander:"Marshal Jean Lannes", parent:null,
  strength:12700, strengthNote:"about 12,700 with 20 guns",
  role:"Holds and then advances along the Brünn–Olmütz highway; forbidden to press too hard early.",
  children:["caffarelli","suchet"]},

caffarelli:{ ech:"div", nation:"fr", arm:"inf", desig:"1re Div., III Corps, with V Corps",
  name:"Caffarelli's Division", commander:"Gen. de division Marie-François de Caffarelli du Falga",
  staff:"Attached from III Corps for the battle", parent:"c_v",
  note:"Its number: the 1st division of III Corps in the situation of 28 October 1805, then under Bisson (Alombert and Colin, t. IV, pp. 723-724); in the same work, in its account of 2 November, Caffarelli replaces the wounded Bisson and commands the division to the end of the campaign (p. 69). Neither is a return of 2 December; this map draws the division with Lannes's V Corps, as its staff line says.",
  strength:6700, strengthNote:"about 6,700",
  track:{
    0:{p:[240,115],st:"holding",cf:"A",obj:"Hold south of the highway; do not press",act:"Formed on the right of V Corps, linking toward Bernadotte"},
    5:{tm:{dep:570,gr:"B",basis:"app narrative, unsourced",ev:["Lannes advances along the highway. Bagration counter-attacks."],note:"Lannes's advance is dated c. 09:30; before it the division holds"},
       p:[296,122],st:"attacking",cf:"A",obj:"Advance on Blasowitz",act:"Advances against Bagration's left as the northern battle opens"},
    6:{p:[321,120],st:"advancing"},
    7:{p:[347,114],st:"advancing",obj:"Push Bagration off the highway"},
    8:{p:[392,105],st:"pursuing"},
    9:{p:[423,96],st:"holding"}}},

suchet:{ ech:"div", nation:"fr", arm:"inf", desig:"3e Div., V Corps",
  name:"Suchet's Division", commander:"Gen. de division Louis-Gabriel Suchet", parent:"c_v",
  note:"Its number in V Corps: the two French returns of October 1805 read number it the 3rd (the situation of V Corps of 26 October and the situation of 28 October; Alombert and Colin, t. IV, pp. 756 and 732), and so does Sokolov's order of battle built on the returns of 22 November (t. II, pp. 183-185); none is of 2 December.",
  strength:6000, strengthNote:"about 6,000, including the detachment on the Santon: the 17e Légère, of this division (numbered there the 3rd of V Corps) in the French situation of 28 October 1805 (Alombert and Colin, t. IV, p. 732)",
  children:["santon"],
  track:{
    0:{p:[225,97],st:"holding",cf:"A",obj:"Hold the highway on the Santon's flank",act:"Formed astride the road under the fortified hill"},
    5:{tm:{dep:570,gr:"B",basis:"app narrative, unsourced",ev:["Lannes advances along the highway. Bagration counter-attacks."],note:"Lannes's advance is dated c. 09:30; before it the division holds"},
       p:[242,78],st:"attacking",cf:"B",act:"Advances astride the highway toward the post house"},
    6:{p:[264,67],st:"advancing"},
    7:{p:[284,57],st:"advancing"},
    8:{p:[309,43],st:"pursuing"},
    9:{p:[321,38],st:"holding"}}},

santon:{ ech:"bde", nation:"fr", arm:"inf", desig:"17e Légère with the Santon battery", battery:18, guns:18,
  name:"The Santon detachment", commander:"Gen. de brigade Michel Claparède", parent:"suchet",
  strength:1600, strengthNote:"about 1,600 infantry of the 17e Légère with 18 guns (Duffy/Smith; Tvarožná municipal history). Stutterheim (1806), an officer of the Allied army present on the day, names the 27th; the Materialien of 1806 keep his 27th in their translation but give the 17th light infantry in an editor's note (Zusatz 6, pp. 100-101), which the French situation of 28 October lists in Suchet's division (Alombert and Colin, t. IV, p. 732)",
  role:"The anchor of the French left. Its slopes were scarped and the crest entrenched before the battle; which face was scarped is not established in the sources checked.",
  track:{
    0:{p:[222,87],st:"fortifying",cf:"A",obj:"Anchor the army's left; the position is not to be given up",act:"Holding the fortified hill north of the highway with eighteen guns"},
    1:{st:"holding"},
    5:{st:"holding",act:"Its battery enfilades Bagration's attacks along the road"},
    9:{st:"holding",act:"Held the hill from first light to last without being taken"}}},

c_cav:{ ech:"corps", nation:"fr", arm:"cav", desig:"Reserve de Cavalerie",
  name:"Cavalry Reserve", commander:"Marshal Joachim Murat", parent:null,
  strength:7400, strengthNote:"7,400 sabres and 36 guns (Duffy 1977; Smith 1998). Beaumont's dragoons and Milhaud's light brigade are not plotted: the four plotted divisions account for 6,800 of the 7,400", guns:36,
  role:"Operates between Lannes and Soult; fights the cavalry battle in the north.",
  children:["kellermann","nansouty","dhautpoul","walther"],
  note:"Beaumont's dragoon division was also with the reserve but is not plotted separately, because no position for it can be given with confidence. Some orders of battle attribute Kellermann's light cavalry to I Corps rather than to Murat."},

kellermann:{ ech:"div", nation:"fr", arm:"cav", desig:"Div. Cavalerie Legere",
  name:"Kellermann's Light Cavalry", commander:"Gen. de division François Étienne Kellermann", parent:"c_cav",
  strength:2400,
  track:{
    0:{p:[242,135],st:"holding",cf:"B",obj:"Screen the front between Lannes and Soult",act:"Forward of the infantry on the open ground"},
    5:{p:[284,134],st:"engaged",cf:"A",act:"First into the cavalry melee; falls back through the infantry to reform"},
    6:{p:[312,131],st:"advancing"},
    7:{p:[343,127],st:"pursuing"},
    9:{p:[383,118],st:"holding"}}},

nansouty:{ ech:"div", nation:"fr", arm:"cav", desig:"1re Div. Cuirassiers",
  name:"Nansouty's Cuirassiers", commander:"Gen. de division Étienne de Nansouty", parent:"c_cav",
  strength:1600, strengthNote:"about 1,600: the six regiments listed by Duffy and Smith sum to about 1,580, with 92 gunners",
  track:{
    0:{p:[219,138],st:"reserve",cf:"B"},
    5:{p:[277,146],st:"charging",cf:"A",obj:"Break the Allied horse",act:"Charges Liechtenstein's and Uvarov's cavalry; the collision was said to be audible across the field"},
    6:{p:[307,142],st:"advancing"},
    7:{p:[339,139],st:"pursuing"},
    9:{p:[376,128],st:"holding"}}},

dhautpoul:{ ech:"div", nation:"fr", arm:"cav", desig:"2e Div. Cuirassiers",
  name:"d'Hautpoul's Cuirassiers", commander:"Gen. de division Jean-Joseph d'Hautpoul", parent:"c_cav",
  strength:1300,
  track:{
    0:{p:[201,146],st:"reserve",cf:"B"},
    5:{p:[265,155],st:"charging",cf:"B",act:"Supports Nansouty against the Allied cavalry"},
    7:{p:[332,150],st:"pursuing"},
    9:{p:[364,138],st:"holding"}}},

walther:{ ech:"div", nation:"fr", arm:"cav", desig:"Div. Dragons",
  name:"Walther's Dragoons", commander:"Gen. de division Frederic Walther", parent:"c_cav",
  strength:1500,
  track:{
    0:{p:[189,125],st:"reserve",cf:"C"},
    5:{p:[255,128],st:"advancing",cf:"C"},
    7:{p:[321,120],st:"pursuing"},
    9:{p:[344,110],st:"holding"}}},

c_i:{ ech:"corps", nation:"fr", arm:"inf", desig:"I Corps",
  name:"I Corps", commander:"Marshal Jean-Baptiste Bernadotte", parent:null,
  strength:13000, strengthNote:"about 11,000 to 13,000",
  role:"The centre, between Murat's cavalry and Soult, in the 30th Bulletin, Stutterheim, Schönhals and Marbot; no source read calls it the general reserve. Where it stood at dawn and how much of it fought are disputed; Drouet's memoir, as Sokolov quotes it, has his division called up at the crisis.",
  note:"No source read calls the corps the general reserve. The 30th Bulletin gives Bernadotte the command of the centre, with Rivaud's division on his left and Drouet's on his right (p. 449); Stutterheim (1806), an Austrian officer present at the battle, writes that the corps formed the centre of the French army (p. 41); Mikhailovsky-Danilevsky has Napoleon order Bernadotte and Soult together to seize the heights of Pratzen (1846, pp. 238-239); Marbot's memoirs have the centre formed by the troops of Soult and Bernadotte (vol. I, p. 260). Thiebault's memoirs count the 2nd division of I Corps, with the Guard and the reserve, among the troops that took no part in the fighting (vol. III, p. 466; the reserve is the grenadiers' on p. 504, in a boast he imputes to Napoleon). A note in the Materialien of 1806, by its lettering one of an unnamed French officer's (an attribution read on the text layer only), has half of the corps' battalions fire no cartridge and the other half take little part (p. 93); Savary has one of its divisions break the Russian Guard's infantry (1828, pp. 205-208).",
  children:["rivaud","drouet"]},

rivaud:{ ech:"div", nation:"fr", arm:"inf", desig:"1re or 2e Div., I Corps",
  name:"Rivaud's Division", commander:"Gen. de division Olivier Rivaud", parent:"c_i",
  strength:6000,
  note:"Its number in I Corps differs between two French returns of October 1805, neither of 2 December: the situation of 28 October numbers Rivaud's division the 2nd (Alombert and Colin, t. IV, p. 717); the force return of 26 October numbers its regiments (the 8e and 45e de ligne, the 54e detached, then under Pacthod) the 1st division, which this map reads as Rivaud's (an inference from its regiments and its brigade general). The two group the corps differently: on 26 October it also had an advance-guard division under Kellermann. Sokolov's order of battle built on the returns of 22 November has Rivaud the 1st and Drouet the 2nd (t. II, pp. 183-185). Thiebault's memoirs have I Corps' 1st division reinforce Lannes and its 2nd take no part; which of the two each is follows only from which fought, itself disputed.",
  track:{
    0:{p:[189,164],st:"reserve",cf:"B",obj:"Close up behind Vandamme",act:"Behind Girzikowitz on I Corps' left (Stutterheim; the 30th Bulletin for the left); the place drawn, west of the village, is this map's"},
    3:{tm:{dep:525,gr:"C",basis:"app narrative, unsourced",ev:["Crosses the brook by Girzikowitz with Soult's attack","Soult's divisions advance. The mist lifts off the heights."],note:"with Soult's attack (Stutterheim), c. 08:45 on this map; the arrival is derived"},
       p:[243,179],st:"advancing",via:[[222,162],[236,166]],act:"Crosses the brook by Girzikowitz with Soult's attack, toward the heights by Blasowitz (Stutterheim); Mikhailovsky-Danilevsky has part of the division sent ahead to Pratzen"},
    6:{p:[284,183],st:"supporting",act:"Near Blasowitz the Russian Guard runs at once into its skirmishers and Kellermann's light cavalry (Stutterheim); Schönhals has the Guard's fight against French infantry near Blasowitz, unnamed; Thiebault counts I Corps' 2nd division, perhaps this one, among the troops that took no part"},
    7:{p:[317,205],st:"holding"},
    9:{p:[334,186],st:"holding"}}},

drouet:{ ech:"div", nation:"fr", arm:"inf", desig:"2e or 1re Div., I Corps",
  name:"Drouet d'Erlon's Division", commander:"Gen. de division Jean-Baptiste Drouet d'Erlon", parent:"c_i",
  strength:7000,
  note:"Its number in I Corps differs between two French returns of October 1805, neither of 2 December: the 2nd division in the force return of 26 October (the 94e and 95e de ligne with two hussar regiments; the 27e légère then in Kellermann's advance-guard division), the 1st in the situation of 28 October (the 27e légère, 94e and 95e; Alombert and Colin, t. IV, pp. 762 and 716-717). Sokolov's order of battle built on the returns of 22 November has it the 2nd (t. II, pp. 183-185). Thiebault's memoirs have I Corps' 1st division reinforce Lannes and its 2nd take no part; which of the two each is follows only from which fought, itself disputed.",
  track:{
    0:{p:[179,177],st:"reserve",cf:"B",act:"Where I Corps stood at dawn is disputed: in the second line behind Soult on 1 December (Savary), behind Girzikowitz (Stutterheim), in the Goldbach ravine with Soult's troops (Marbot), across the brook since the evening before (Mikhailovsky-Danilevsky); the place drawn is this map's"},
    3:{tm:{dep:525,gr:"C",basis:"app narrative, unsourced",ev:["Soult's divisions advance. The mist lifts off the heights."],note:"this map holds the division at its dawn position until Soult's advance. Stutterheim (1806), an Austrian officer present at the battle, has Bernadotte cross the brook at Girzikowitz at the same time as Soult's attack, Rivaud on the left and Drouet on the right, and has the corps take its direction toward the heights by Blasowitz; Mikhailovsky-Danilevsky (1846) instead has Soult and Bernadotte across the brook from the evening before. The hour is this map's for Soult's advance, c. 08:45, the arrival is derived and the route drawn, toward Stare Vinohrady, is this reconstruction's. The 30th Bulletin has Bernadotte's centre advance at the moment the Russian Guard was routed; the accounts are not reconciled here"},
       p:[232,194],st:"advancing",via:[[215,177],[221,192]]},
    6:{p:[290,206],st:"engaged",cf:"B",obj:"Restore the line at Stare Vinohrady",act:"Meets the Russian Guard: Drouet's own memoir, as Sokolov quotes it, has his division called up to support the centre; Thiebault counts I Corps' 2nd division among the troops that took no part"},
    7:{p:[313,217],st:"holding",act:"Takes Vandamme's place on the plateau as Vandamme wheels toward Augezd (Schönhals; Ségur has Bernadotte left on the plateau); Savary has one of Bernadotte's divisions, unnamed, break the Russian Guard infantry, then go back to its morning place"},
    9:{p:[329,205],st:"holding"}}},

c_gd:{ ech:"corps", nation:"fr", arm:"guard", desig:"Garde Imperiale",
  name:"Imperial Guard", commander:"Marshal Jean-Baptiste Bessieres", parent:null,
  strength:5500, strengthNote:"about 5,500, Sokolov's estimate for 2 December from the returns of 22 November. No return read gives its guns on the day: the 30th Bulletin puts forty guns served by the Guard's gunners in the reserve, Schönhals forty with the grenadiers, and Sokolov has 24 guns of the Guard horse artillery fire at the meres",
  role:"Held in reserve with the Emperor and the grenadiers (the 30th Bulletin); its cavalry charges and breaks the Russian Guard, its artillery fires, and its infantry moves up onto the plateau, not engaged in the Bulletin and Schönhals; Coignet, in its ranks, has it break the Russian second line in the attack on the Pratzen, but not engaged against the Russian Guard.",
  children:["guard_inf","guard_cav"]},

guard_inf:{ ech:"div", nation:"fr", arm:"guard", desig:"Infanterie de la Garde",
  name:"Guard Infantry", commander:"Grenadiers and Chasseurs a Pied",
  staff:"With the Grenadiers of the Italian Royal Guard", parent:"c_gd",
  strength:3000,
  track:{
    0:{p:[187,149],st:"reserve",cf:"A",obj:"Remain in hand near the Zuran",act:"Formed in reserve around Napoleon's command post"},
    6:{p:[276,213],st:"advancing",via:[[225,163],[225,196]],moveMin:60,act:"Moves up onto the plateau behind the Guard cavalry; not engaged in the 30th Bulletin, Schönhals and Thiebault; Coignet, a grenadier of the foot Guard, claims it helped break the Russian second line in the attack on the Pratzen, but of the Russian Guard's attack writes that they thought their turn had come, and the enemy fell back"},
    7:{tm:{dep:780,at:840,gr:"B",basis:"app narrative, unsourced",ev:["Between about 13:00 and 14:00 Napoleon turned his centre ninety degrees and brought it down off the plateau","Soult and Davout launch the converging assault on the Allied left."],note:"the wheel names the Guard in support; shown across the range. Savary has the grenadiers and the Guard's foot division support the wheel; Ségur has the Guard on foot left on the plateau with Bernadotte"},
       p:[291,232],st:"supporting"},
    9:{p:[286,249],st:"holding"}}},

guard_cav:{ ech:"div", nation:"fr", arm:"cav", desig:"Cavalerie de la Garde",
  name:"Guard Cavalry", commander:"Marshal Bessieres; charge led by Gen. Rapp",
  staff:"Horse Grenadiers, Chasseurs a Cheval, Mamelukes", parent:"c_gd",
  strength:2500,
  track:{
    0:{p:[201,154],st:"reserve",cf:"A"},
    6:{p:[289,209],st:"charging",cf:"A",via:[[230,161],[235,188]],moveMin:45,obj:"Break the Russian Guard",act:"Rapp's counter-charge shatters the Chevalier Guard; Prince Repnin taken prisoner (the hour is disputed: about 13:00 or after in Rapp's own memoirs, before one by the order of the Bulletin's narrative; the map draws it from 11:15)"},
    7:{p:[303,226],st:"holding"},
    9:{p:[301,237],st:"holding"}}},

c_gren:{ ech:"div", nation:"fr", arm:"inf", desig:"Div. de Grenadiers",
  name:"Grenadier Division", commander:"Gen. de division Nicolas Oudinot",
  staff:"Oudinot was convalescent; effective command fell to Gen. Duroc", parent:null,
  strength:5700, strengthNote:"about 5,500 to 5,700 (5,700 is Sokolov's estimate for 2 December; 5,016 present on 22 November); elite companies drawn from regiments on garrison duty. Sokolov's order of battle lists a foot and a horse artillery company with the division, without a gun count, and the situation of V Corps of 26 October 1805 lists horse and foot artillery with it (Alombert and Colin, t. IV, p. 755); Schönhals has Oudinot's ten grenadier battalions with forty guns; the 30th Bulletin has forty guns in the reserve served by the Guard's gunners",
  role:"General reserve with the Guard in the 30th Bulletin, Stutterheim and Schönhals; Napoleon's dispositions put the grenadiers under Lannes's orders. It joins the wheel south in the afternoon.",
  track:{
    0:{p:[175,155],st:"reserve",cf:"B",obj:"Remain in general reserve",act:"Formed near the Zuran with the Guard"},
    6:{p:[254,223],st:"advancing",via:[[212,182],[212,220]],moveMin:70,act:"Moves up behind the plateau"},
    7:{tm:{dep:780,gr:"B",basis:"app narrative, unsourced",ev:["Between about 13:00 and 14:00 Napoleon turned his centre ninety degrees and brought it down off the plateau","Soult and Davout launch the converging assault on the Allied left."],note:"the wheel names the grenadier division in support. Ségur and Mikhailovsky-Danilevsky set the grenadiers moving toward the lakes about one; the arrival is derived. Until roadmap step 4b the map dated the arrival at 14:00, its own, which forced the next leg toward the ceiling (question 181)"},
       p:[261,268],st:"advancing",obj:"Support the wheel south",act:"Comes down off the heights behind Saint-Hilaire"},
    8:{p:[248,345],st:"attacking",act:"Comes down toward the meres in support; whether the grenadiers fought is disputed: Schönhals has a brigade bar the Kobelnitz pond, but also has them not in action, as the 30th Bulletin and Thiebault do"},
    9:{p:[248,363],st:"holding"}}},

/* ======================= ALLIED ======================= */
ahq:{ ech:"army", nation:"ru", arm:"hq", desig:"Allied H.Q.",
  name:"Allied Headquarters", commander:"Gen. Mikhail Kutuzov (commander-in-chief in name)",
  staff:"Tsar Alexander I and Emperor Francis II (Francis I of Austria) present; plan by Gen. Franz von Weyrother",
  strength:null, parent:null,
  army:{men:"about 85,400", guns:278, src:"Duffy 1977; Smith 1998"},
  role:"Russian and Soviet accounts hold that Kutuzov opposed the plan and was overruled by the Tsar; at the council itself he reportedly dozed rather than objecting. He rode with the 4th Column and was lightly wounded in the face.",
  note:"Allied strength is variously given as 73,000–89,000 with 278–334 guns. Roughly 16,000 were Austrian.",
  track:{
    0:{p:[408,198],st:"observing",obj:"Execute Weyrother's dispositions",cf:"B",act:"Kutuzov's headquarters at Krzenowitz, where the dispositions were read overnight. The emperors join the 4th Column on the plateau about 08:30-09:00"},
    3:{p:[293,240],st:"surprised",cf:"A",act:"The Tsar has just ridden up and ordered the 4th Column forward (about 08:45; Russian Biographical Dictionary, 1903). Soult appears on the heights; Kutuzov orders the column to face about and recalls part of the II Column"},
    4:{p:[303,235],st:"engaged",cf:"B",act:"Kutuzov wounded in the cheek; orders Kamensky to retire"},
    6:{p:[404,220],st:"withdrawing",act:"Headquarters falls back toward Krzenowitz"},
    8:{p:[454,190],st:"withdrawing"},
    9:{p:[480,148],st:"withdrawing"}}},

buxhowden:{ ech:"corps", nation:"ru", arm:"hq", desig:"Left Wing",
  name:"Left Wing Command", commander:"Gen. Friedrich Wilhelm von Buxhowden", parent:null,
  strength:40000, strengthNote:"Columns I–III with Kienmayer's advance guard: roughly 33,000–40,000",
  role:"Commands the whole southern attack. Remained unaware of the collapse on the plateau until around noon; Langeron, a hostile witness, alleged that he was drunk.",
  children:["kienmayer","dok","lang","prz"],
  track:{
    0:{p:[305,323],st:"forming",cf:"C"},
    2:{p:[274,347],st:"attacking",cf:"C",obj:"Turn the French right and cut the Vienna road",act:"Feeding all three columns into the Goldbach villages"},
    7:{p:[263,376],st:"engaged",act:"Only now learns the plateau is lost"},
    8:{p:[300,369],st:"withdrawing",cf:"B",via:[[271,375]],act:"Escapes south over the Augezd defile"},
    9:{p:[280,429],st:"retreating",via:[[299,374],[289,408]],ice:true}}},

kienmayer:{ ech:"div", nation:"at", arm:"mixed", desig:"Advance Guard, I Column",
  name:"Kienmayer's Advance Guard", commander:"Feldmarschall-Leutnant Michael von Kienmayer",
  staff:"Grenz infantry (Broder Nr. 7, 1st and 2nd Szekler Nr. 14 and 15) with chevau-legers, hussars and Cossacks", parent:"buxhowden",
  strength:6340, strengthNote:"6,340, used here, is Schönhals's table, its lines making about 3,400 foot and 2,940 horse (its total line prints 2,440 horses), with two cavalry batteries, undated; Sokolov 6,380 (3,440 foot and 2,940 horse with 12 guns; the sum derived). Duffy and Smith (cited, not read) were transcribed here as 3,440 foot and 3,440 horse, which make 6,880; this map's earlier working figure, 6,800, came from that transcription", guns:12,
  role:"Opens the battle. The Allied extreme left.",
  track:{
    0:{p:[291,367],st:"forming",cf:"A",obj:"Take Telnitz and turn the French right",act:"Formed near Augezd before first light"},
    1:{p:[236,398],st:"attacking",cf:"A",via:[[272,378],[247,397],[228,409]],obj:"Take Telnitz",act:"Attacks Telnitz; the village changes hands several times"},
    2:{p:[222,402],st:"engaged"},
    7:{p:[242,400],cf:"B",st:"holding",act:"Holding west of the Goldbach as the trap closes behind it"},
    8:{tm:{dep:870,at:900,gr:"C",basis:"app narrative, unsourced",ev:["Vandamme takes the height above Augezd; the causeway comes under fire.","French artillery fires on the ice of the Satschan mere."],note:"falls back under fire: not before the causeway is under fire, c. 14:30, and over the neck before the ice is fired on, c. 15:00; shown across that range"},
       p:[296,377],st:"retreating",cf:"A",via:[[247,397],[272,378]],obj:"Escape by the Augezd defile",
       act:"Falls back over the neck of land between the meres under artillery fire"},
    9:{p:[269,436],st:"retreating",via:[[298,387]],ice:true,
       act:"Falls back across the frozen Satschan mere under artillery fire"}}},

dok:{ ech:"div", nation:"ru", arm:"inf", desig:"I Column",
  name:"First Column", commander:"Lt.-Gen. Dmitry Dokhturov", parent:"buxhowden",
  strength:13490, strengthNote:"13,240 infantry and 250 cavalry with 64 guns (Duffy/Smith); other returns range from 7,750 to 14,200", guns:64,
  role:"Main weight of the attack on Telnitz.",
  track:{
    0:{p:[291,332],st:"forming",cf:"A",obj:"Follow Kienmayer through Telnitz and wheel north",act:"At the southern end of the Pratzen plateau"},
    1:{tm:{dep:420,gr:"A",basis:"source",ev:["Dokhturov's I Column leaves its camp as the disposition ordered"],note:"the departure at seven as the disposition ordered (Materialien 1806 pp. 101-106) and as Buxhowden's and Kutuzov's reports give it (Kutuzov, documents, 1951, pp. 241-242, 255-258); the arrival is derived"},
       p:[258,371],st:"advancing",cf:"A",act:"Leaves its camp at seven, as the disposition ordered, and descends toward the Goldbach (Buxhowden's and Kutuzov's reports)"},
    2:{p:[232,397],st:"attacking",cf:"A",obj:"Force the crossing at Telnitz",act:"Pushes into Telnitz behind Kienmayer"},
    7:{p:[226,404],st:"engaged",act:"Attacked from the west by Friant and from the rear off the heights"},
    8:{tm:{dep:870,at:900,gr:"C",basis:"app narrative, unsourced",ev:["Vandamme takes the height above Augezd; the causeway comes under fire.","French artillery fires on the ice of the Satschan mere."],note:"as Kienmayer: the retreat under fire runs from c. 14:30 to c. 15:00"},
       p:[268,384],st:"retreating",cf:"A",act:"Retreats south-east; part of the column crosses the frozen meres"},
    9:{p:[265,429],st:"retreating",via:[[292,377]],ice:true,
       act:"Part of the column breaks south over the ice rather than queue for the defile"}}},

lang:{ ech:"div", nation:"ru", arm:"inf", desig:"II Column",
  name:"Second Column", commander:"Lt.-Gen. Louis de Langeron",
  staff:"A French emigre in Russian service", parent:"buxhowden",
  strength:11700, strengthNote:"about 9,900–12,000 with 30 guns",
  role:"Attacks Sokolnitz. Warned by Kamensky in Mikhailovsky-Danilevsky's account (citing Langeron's report), Langeron rode back and sent reinforcements up the slope toward him: the Kursk regiment, whose strength engaged and loss the accounts give differently; Schönhals instead has it left in reserve behind Sokolnitz.",
  children:["kamensky"],
  track:{
    0:{p:[291,308],st:"forming",cf:"A",obj:"Take Sokolnitz",act:"Formed on the plateau behind Dokhturov"},
    1:{tm:{dep:420,gr:"B",basis:"source",ev:["the disposition ordered all the columns to march at 07:00","the II and III Columns at 07:30","the II Column coming down at 08:00"],note:"the departure at seven as the disposition ordered (Materialien 1806 pp. 101-106); Schönhals has the II and III Columns leave at half past seven (1873, p. 160), Buxhowden's report the II Column come down at eight (Kutuzov, documents, 1951, pp. 241-242), Mikhailovsky-Danilevsky the first three columns between seven and eight (1844, p. 177): grade B, the map's choice among them; the arrival is derived. Until roadmap step 4b the map moved the column from 04:00 (question 176)"},
       p:[268,328],st:"advancing"},
    2:{p:[235,350],st:"attacking",cf:"A",obj:"Take Sokolnitz village",act:"Storms Sokolnitz; Kamensky's brigade marches at the rear of the column"},
    4:{tm:{at:630,gr:"C",basis:"app narrative, unsourced",ev:["Langeron rides back and sends reinforcements up the slope; they arrive as the position is lost."],note:"c. 10:30 on this map; no source read gives the hour (the Kursk regiment's episode in Mikhailovsky-Danilevsky, Langeron's journal and Schönhals)"},
       p:[247,336],st:"engaged",cf:"C",act:"Langeron rides back and sends reinforcements up the slope toward Kamensky. The accounts name the Kursk regiment: Mikhailovsky-Danilevsky has Langeron bring it up too late, losing up to 1,600 men; Langeron's journal, as Sokolov quotes it, two of its battalions, half killed and half taken with their guns and colours; Schönhals has it left in reserve behind Sokolnitz and mostly taken there"},
    7:{p:[233,357],st:"engaged",act:"Driven back toward Sokolnitz by Davout at about 12:30"},
    8:{p:[253,378],st:"retreating"},
    9:{p:[284,378],st:"retreating"}}},

kamensky:{ ech:"bde", nation:"ru", arm:"inf", desig:"Brigade, II Column",
  name:"Kamensky's Brigade", commander:"Maj.-Gen. Sergey Kamensky", parent:"lang",
  strength:4250, strengthRange:[4000,4500], strengthNote:"the Fanagoria Grenadier and Ryazhsk Musketeer regiments, as Mikhailovsky-Danilevsky names them (1844, pp. 167, 179, 187-189, 198, 205, p. 187 citing Langeron's report to Kutuzov; its French translation of 1846 the same), who places the Ryazan regiment in Tolstoy's corps sent to Swedish Pomerania (1844, p. 257). The other reading, kept: Ryazan in the Materialien of 1806 (its list of the columns and its translation of Kutuzov's report; its translation of Stutterheim prints 'Rhiäsky') and as cited here from Duffy. Mikhailovsky-Danilevsky forms the brigade of these two regiments; Stutterheim (1806) and Thiébault have them reinforce it (disputed). About 2,000 each, with dragoons, Cossacks and pioneers attached (Duffy, via the Langeron column return)",
  role:"Allied initiative on the plateau, but whose is disputed: turned about on its own commander's judgement in Mikhailovsky-Danilevsky, citing Langeron's report; sent by Langeron in Schönhals; ordered onto the ridge by Kutuzov in his official report; no order of his named in Kutuzov's private relation of March 1806.",
  track:{
    2:{p:[259,316],st:"march",cf:"B",obj:"Follow the II Column to Sokolnitz",act:"Marching at the rear of Langeron's column"},
    3:{p:[269,298],st:"countermarch",cf:"A",obj:"Retake the Pratzeberg",act:"Kamensky sees the French on the height behind him, sends word to Langeron and turns his brigade about, in Mikhailovsky-Danilevsky's account citing Langeron's report (the accounts differ on who turned it, and none read gives the hour)"},
    4:{p:[279,289],st:"counterattack",cf:"A",obj:"Drive Saint-Hilaire off the crest",act:"Pushes the 10e Legere back off the summit before Thiebault stabilises the French line"},
    5:{p:[291,279],st:"engaged",act:"Fights on the crest alongside Jurczek's Austrians"},
    6:{p:[305,279],st:"broken",cf:"B",act:"Broken and ordered to retire by Kutuzov"},
    7:{p:[371,254],st:"retreating",cf:"C",act:"Ordered to retire by Kutuzov, it falls back east off the plateau behind the 4th Column. Its route after 11:15 is not documented: this track is a reconstruction"},
    8:{p:[397,221],st:"retreating",cf:"C"}}},

prz:{ ech:"div", nation:"ru", arm:"inf", desig:"III Column",
  name:"Third Column", commander:"Lt.-Gen. Ignacy Przybyszewski", parent:"buxhowden",
  strength:7700, strengthNote:"sources differ: 5,450 to 9,500, with 30 guns",
  role:"Attacks the Sokolnitz castle and pheasantry; surrounded and destroyed as a formation.",
  track:{
    0:{p:[290,282],st:"forming",cf:"A",obj:"Take the Sokolnitz castle and pheasantry"},
    1:{tm:{dep:420,gr:"B",basis:"source",ev:["the disposition ordered all the columns to march at 07:00","as did the III Column in Przybyszewski's report","the II and III Columns at 07:30"],note:"the departure at seven as the disposition ordered (Materialien 1806 pp. 101-106) and as Przybyszewski's report gives it (Kutuzov, documents, 1951, pp. 269-270); Schönhals has the II and III Columns leave at half past seven (1873, p. 160): grade B; the arrival is derived. Until roadmap step 4b the map moved the column from 04:00 (question 176)"},
       p:[266,296],st:"advancing"},
    2:{p:[238,332],st:"attacking",cf:"A",obj:"Take the castle and pheasantry",act:"Storms the walled castle grounds and the pheasant enclosure"},
    4:{p:[233,344],st:"engaged"},
    7:{p:[227,338],st:"encircled",cf:"A",obj:"Break out toward Kobelnitz",act:"Cut off by Soult from the east and Davout from the west"},
    8:{p:[227,309],st:"broken",cf:"A",moveMin:20,act:"Attempts to break out north toward Kobelnitz; the column disintegrates"}   /* timing inferred: holds at Sokolnitz until it is surrounded (~14:00, the file's own event), then breaks out */,
    9:{p:null,st:"captured",act:"Surrendered almost entire, near Kobelnitz by evening. Przybyszewski was later court-martialled."}}},

col4:{ ech:"corps", nation:"at", arm:"inf", desig:"IV Column",
  name:"Fourth Column", commander:"FZM Johann Kollowrat and Lt.-Gen. Mikhail Miloradovich", parent:null,
  strength:13900, strengthRange:[12000,23900], mixedNote:"Austrian and Russian: fifteen Austrian battalions and twelve Russian (Stutterheim 1806; Schönhals 1873), or fourteen Russian (WarHistory)",
  strengthNote:"13,900 infantry with 52 light and 24 heavy guns (Duffy 1977; Smith 1998), used here. Other figures: about 12,000 with fourteen Russian battalions (WarHistory; Stutterheim 1806 and Schönhals 1873 count twelve); 17,000 (Napoleon-Empire); 23,900 (Chandler, and an older revision of the same order of battle)",
  role:"Should have replaced the troops leaving the plateau. Delayed, then caught in the open by Soult.",
  children:["milo","kollo"],
  note:"Its objective was Kobelnitz. Liechtenstein's cavalry, misplaced on the left, crossed its line of march riding north-west and held it up; Russian accounts put the delay chiefly on Kutuzov's reluctance to leave the heights."},

milo:{ ech:"div", nation:"ru", arm:"inf", desig:"Russian wing, IV Column",
  name:"Miloradovich's Russians", commander:"Lt.-Gen. Mikhail Miloradovich", parent:"col4",
  strength:4800, strengthRange:[4800,7000],
  strengthNote:"Duffy and Smith imply about 4,800 (13,900 less the Austrian brigades' 9,100); Schönhals (1873) gives the Russian wing twelve battalions and 6,965 men, including two pioneer companies and two squadrons of Austrian dragoons (Smolensk's figures not printed), and Stutterheim (1806) twelve battalions; WarHistory has fourteen, which at 350-500 men would give 4,900-7,000. The earlier 10,000 had no source",
  track:{
    0:{p:[325,230],st:"forming",cf:"A",obj:"Advance on Kobelnitz",act:"Formed on the plateau near Pratzen village"},
    2:{p:[299,238],st:"delayed",cf:"A",obj:"Advance on Kobelnitz",act:"Held up while Liechtenstein's cavalry crosses its front from left to right"},
    3:{p:[290,237],st:"surprised",cf:"A",act:"Caught filing off the plateau as Soult appears on the crest"},
    4:{p:[315,237],st:"counterattack",cf:"B",act:"Rallied by Kutuzov for a counterattack up the southern slope"},
    6:{p:[392,232],st:"withdrawing"},
    8:{p:[446,210],st:"retreating"},
    9:{p:[475,170],st:"retreating"}}},

kollo:{ ech:"div", nation:"at", arm:"inf", desig:"Austrian wing, IV Column",
  name:"Kollowrat's Austrians", commander:"FZM Johann Karl Graf Kollowrat-Krakowsky",
  staff:"Brigades: Jurczek · Rottermund", parent:"col4",
  strength:9100, strengthNote:"about 9,100 infantry",
  track:{
    0:{p:[355,226],st:"forming",cf:"A",obj:"Follow the Russian wing toward Kobelnitz"},
    2:{p:[325,229],st:"delayed",cf:"A",act:"Waiting for Liechtenstein's cavalry to clear its front"},
    3:{p:[324,233],st:"surprised"},
    4:{tm:{at:615,gr:"C",basis:"app narrative, unsourced",ev:["Jurczek's Austrians attack the Pratzeberg; French and Austrians briefly mistake each other's identity."],note:"the attack on the summit, c. 10:15 on this map, is the arrival at this anchor; no source read gives the hour, and the sources tie the attack to Kamensky's"},
       p:[298,275],st:"counterattack",cf:"B",obj:"Retake the Pratzeberg",act:"Jurczek attacks the summit with Rottermund in support; the two sides briefly mistake each other's nationality"},
    5:{p:[332,257],st:"engaged",cf:"B",act:"Spread along the crest from the Pratzeberg to Stare Vinohrady: Jurczek on the summit, Rottermund on the Old Vineyards. The accounts differ: Schönhals has the Austrians and Kamensky climb the height in a second bayonet attack before Boyer's dragoons drive them off; Thiebault has them dispersed by his guns"},
    6:{p:[331,200],st:"withdrawing",cf:"B",act:"Rottermund's brigade falls back on Stare Vinohrady, then east"},
    8:{p:[454,196],st:"retreating"},
    9:{p:[478,153],st:"retreating"}}},

lich:{ ech:"corps", nation:"ru", arm:"cav", desig:"V Column", mix:{nation:"at", share:0.2},
  name:"Fifth Column (cavalry)", commander:"FML Prince Johann von Liechtenstein",
  staff:"Mixed, mostly Russian: the Austrian cuirassier brigades of Caramelli and Weber (about 1,100; Schönhals 1873; Duffy 1977; Smith 1998) and the Russian brigades of Shepelev, under Lt.-Gen. Essen, and Penitsky, under Lt.-Gen. Uvarov (Schönhals 1873); Mikhailovsky-Danilevsky has Uvarov's three regiments sent to Bagration's left the evening before (disputed). Duffy and Smith are cited here for a brigade of Gladkov, not checked against them: no Gladkov is found in the text layers of Schönhals, Stutterheim, the Materialien, Mikhailovsky-Danilevsky, Sokolov and the other works read, nor on the Fifth Column's pages read on their images, so that name is unconfirmed. Uvarov's brigadier is Penitsky in Schönhals and Gizhitsky in Sokolov", parent:null,
  strength:5400, strengthNote:"5,400 is this map's working figure, inside the range read: 5,600 in 69 squadrons, the Austrians 1,100 (Schönhals, undated); 4,600 with 24 guns (Sokolov; Stutterheim gives 4,600 horses on 27 November); about 3,600 without Uvarov's three regiments, which Mikhailovsky-Danilevsky sends to Bagration the evening before (derived).", guns:24,
  role:"Deployed on the wrong flank overnight; its counter-march across the 4th Column's front contributed to that column's late start.",
  track:{
    0:{p:[296,243],st:"forming",cf:"B",obj:"Join the Allied right beyond Blasowitz",act:"Formed on the left by mistake; must ride north-west across the army's line of march"},
    2:{p:[319,214],st:"countermarch",cf:"A",obj:"Reach the right wing",act:"Crossing the front of the 4th Column and holding it up"},
    3:{p:[317,191],st:"march"},
    5:{p:[298,156],st:"charging",cf:"A",obj:"Break the French cavalry screen",act:"Charges with Uvarov's Russians against Kellermann; met by Nansouty's cuirassiers"},
    6:{p:[341,152],st:"repulsed"},
    7:{p:[387,145],st:"withdrawing"},
    8:{p:[437,129],st:"retreating"},
    9:{p:[469,110],st:"retreating"}}},

bag:{ ech:"corps", nation:"ru", arm:"inf", desig:"Advance Guard",
  name:"Advance Guard of the Right", commander:"Lt.-Gen. Prince Pyotr Bagration", parent:null,
  strength:13700, strengthNote:"about 13,000 to 14,000 with 42 guns", guns:42,
  role:"Holds the Brünn–Olmütz highway. Driven back from Holubitz and Kruh, it re-forms on the height toward Rausnitz and withdraws toward Austerlitz in the evening (Stutterheim; Schönhals).",
  track:{
    0:{p:[319,49],st:"holding",obj:"Hold the highway and cover the Allied right",cf:"B",act:"Astride the Olmutz highway, his line reaching south toward Holubitz. Re-plotted on the corrected road, which passes about 2 km north of Holubitz; the exact line is not established"},
    5:{tm:{dep:570,gr:"B",basis:"app narrative, unsourced",ev:["Lannes advances along the highway. Bagration counter-attacks."],note:"Bagration's counter-attack is dated c. 09:30; before it he holds"},
       p:[262,68],st:"attacking",cf:"B",obj:"Drive Lannes back on Brünn",act:"Attacks along the highway; cannot get past the Santon battery"},
    6:{tm:{dep:675,gr:"C",basis:"app narrative, unsourced",ev:["Blasowitz falls; no source read gives the hour"],note:"the falling back begins with Blasowitz's fall, c. 11:15 on this map; no source read gives either hour, and Schönhals has Bagration fight on toward noon before d'Hautpoul's charge throws his battalions back; the arrival is derived"},
       p:[284,57],st:"holding",act:"Falls back fighting as Blasowitz is lost (this map's sequence; Schönhals has its line broken later)"},
    7:{p:[304,46],st:"withdrawing"},
    8:{p:[337,29],st:"retreating",cf:"B",act:"On the height toward Rausnitz, covering the Allied right (Schönhals); he retreats on Austerlitz about six in Schönhals, and is behind it by six in Stutterheim"},
    9:{p:[366,14],st:"retreating"}}},

constantine:{ ech:"corps", nation:"ru", arm:"guard", desig:"Imperial Guard",
  name:"Russian Imperial Guard", commander:"Grand Duke Constantine Pavlovich", parent:null,
  strength:10500, strengthNote:"Duffy and Smith give 6,730 infantry, 3,700 horse, 100 pioneers and 40 guns. Narrative accounts often give about 8,500", guns:40,
  role:"The reserve of the Allied right (Stutterheim); the disposition posts it at daybreak behind Blasowitz and Kruh, to reinforce Liechtenstein's cavalry and the left of Bagration's advance guard. Committed against Vandamme after 11:00; the hour is not established.",
  children:["rg_inf","rg_cav"]},

rg_inf:{ ech:"div", nation:"ru", arm:"guard", desig:"Guard Infantry",
  name:"Guard Infantry", commander:"Lt.-Gen. Maliutin", parent:"constantine",
  strength:6730, strengthNote:"6,730 (Duffy 1977; Smith 1998)",
  track:{
    0:{p:[413,202],st:"reserve",cf:"A",obj:"Remain in reserve near Krzenowitz",act:"On the high ground near Allied headquarters"},
    5:{p:[378,196],st:"advancing"},
    6:{p:[327,194],st:"counterattack",cf:"A",obj:"Retake Stare Vinohrady",act:"Attacks Vandamme and overthrows the first two French columns with the bayonet (Mikhailovsky-Danilevsky); the Life Guard Horse cuts down a battalion of the 4th Line and one of the 24th Light and takes the 4th's eagle (Schönhals)"},
    7:{p:[397,196],st:"repulsed",act:"Driven off the plateau by the French Guard cavalry; Ségur has Bernadotte about to complete its defeat, and Savary one of his divisions break the Guard infantry"},
    8:{p:[447,178],st:"retreating"},
    9:{p:[475,144],st:"retreating"}}},

rg_cav:{ ech:"div", nation:"ru", arm:"cav", desig:"Guard Cavalry",
  name:"Guard Cavalry", commander:"Lt.-Gen. Andrei Kologrivov", parent:"constantine",
  strength:3700, strengthNote:"3,700 horse (Duffy 1977; Smith 1998, cited, not read). Kologrivov's command on 2 December is in Sokolov alone, with no source on his page; Mikhailovsky-Danilevsky and the Chevalier Guard's history have him command the Guard cavalry at Olmütz and on the march, and the Chevalier Guard came up in Maliutin's separate column. The first name 'Andrei' is cited, not read",
  track:{
    0:{p:[423,193],st:"reserve",cf:"A"},
    6:{p:[321,189],st:"charging",cf:"A",obj:"Break the French line on the plateau",act:"The Guard cavalry takes the eagle of the 4th Line (credited to the Life Guard Horse by Stutterheim and Schönhals, to the Chevalier Guards by Marbot). The Chevalier Guard's charge is then broken by Bessieres and Rapp; Prince Repnin captured"},
    7:{p:[406,188],st:"repulsed"},
    8:{p:[452,164],st:"retreating"},
    9:{p:[481,132],st:"retreating"}}}
};

/* ---------------- terrain and settlement features ---------------- */
var FEATURES = [
{id:"pratzen", p:[302,249], kind:"height", name:"Pratzen Heights",
 sub:"Dominant central plateau: a crest about 3 km long from Stare Vinohrady to the Pratzeberg",
 facts:[["Relief","Summit about 115 m above the Goldbach (324 m against 207-211 m); Pratzen village lies in a hollow at 245 m"],["Extent","Runs north–south between Blasowitz and the Litava"],["Held at dawn by","Allied 4th Column and the departing I–III Columns"]],
 why:["The dominant ground of the central battlefield, well above the Goldbach crossings",
      "Whoever holds it holds the centre, and can come down into the rear of anything fighting in the valley",
      "The Allied plan required vacating it in order to attack the French right"],
 story:"Napoleon gave it up on purpose on 1 December and camped his army west of it. When the Allies marched off it in the morning he took it back with two divisions; by about 11:00 it was French from end to end and their army was split in two."},

{id:"vinohrady", p:[313,205], kind:"height", name:"Stare Vinohrady",
 sub:"The Old Vineyards — northern high point of the plateau",
 facts:[["Taken by","Vandamme's division in the course of the morning; the plateau was French from end to end by about 11:00"],["Contested by","Russian Imperial Guard, after about 11:00 (the hour is not established)"],["Also","Napoleon's second command post, from about noon"]],
 why:["Northern shoulder of the plateau, linking the centre to the Olmütz road sector",
      "In this map's interpretation, a counterfactual: losing it would have reopened the Allied army's severed halves"],
 story:"The Russian Guard's counterattack here broke two of Vandamme's battalions, and its cavalry took the eagle of the 4th Line, credited to the Life Guard Horse by Stutterheim, Schönhals and the Chevalier Guard's own history and to the Chevalier Guards by Marbot; an Allied official report, first printed in the Materialien of 1806, calls it the only trophy of the day. Rapp's counter-charge with the Guard cavalry ended it."},

{id:"pratzeberg", p:[285,289], kind:"height", name:"Pratzeberg",
 sub:"Southern summit of the plateau, above Pratzen village",
 facts:[["Taken by","Saint-Hilaire's division"],["Counterattacked by","Kamensky's brigade, then Jurczek's Austrians"],["Secure by","About 11:00"]],
 why:["This map reads it as the hinge of the French plan: Mikhailovsky-Danilevsky has Napoleon order Bernadotte and Soult to seize the Pratzen heights and cut the Allied army in two, and Marbot calls the Pratzen the key of the battlefield; from here the centre could turn south onto Buxhowden's rear"],
 story:"Saint-Hilaire's brigades of Morand and Thiebault fought Kamensky's brigade here. As Thiebault tells it, Saint-Hilaire proposed falling back to a position they could defend; Colonel Pouzet of the 10e Legere objected, and after half an hour the brigades' own charge carried that part of the heights. Schönhals has Soult send Levasseur's brigade to support Saint-Hilaire's right."},

{id:"santon", p:[222,87], kind:"height", name:"The Santon",
 sub:"Fortified hill north of the Brünn–Olmütz highway",
 facts:[["Garrison","Claparède's 17e Légère with eighteen guns"],["Preparation","Slopes scarped and crest entrenched before the battle; which face is not established"],["Result","Never taken"]],
 why:["Anchors the extreme French left and enfilades the highway",
      "This map reads the fortified Santon as anchoring the northern flank, freeing Lannes to attack"],
 story:"Named by French soldiers after a chapel in Egypt. Bagration could not get past it, which is a large part of why the northern battle stayed a holding action."},

{id:"zuran", p:[177,134], kind:"height", name:"Zuran mound",
 sub:"Low prehistoric barrow west of the Goldbach",
 facts:[["Occupied by","Napoleon and Berthier on the morning of the battle, by identification: the orders of 1 December send headquarters to 'la butte', and Mikhailovsky-Danilevsky has Napoleon on 'the barrow by Schlapanitz'; no source read names the Zuran, and the hour they took post is not established"],["Vacated","About noon, for Stare Vinohrady"]],
 why:["In this model's terrain, a view across the French front and the western face of the plateau"],
 story:"Mikhailovsky-Danilevsky has Napoleon, on the barrow by Schlapanitz with his marshals, see the heights being stripped of troops when the sun lit the hilltops, and give his final orders, the attack to begin half an hour after them; a memoir anecdote, as Thiebault tells it, has him wait a further quarter of an hour after Soult said he needed twenty minutes at most."},

{id:"goldbach", p:[201,273], kind:"water", name:"Goldbach stream",
 sub:"Small stream in a marshy valley, the armies' dividing line",
 facts:[["Course","North to south past Puntowitz, Kobelnitz, Sokolnitz and Telnitz"],["Obstacle value","Trivial for infantry, difficult for guns and horse in December mud"]],
 why:["Its valley held the fog that hid Soult's two divisions until they stepped onto the plateau",
      "Its villages hold the crossings for guns and formed cavalry; this map reads the southern battle as a fight for those crossings"],
 story:"The Allies spent the morning forcing crossings that led nowhere while the battle was decided on the high ground behind them."},

{id:"litava", p:[439,217], kind:"water", name:"Litava river",
 sub:"Also Littawa — flows west from Austerlitz past the southern edge of the plateau",
 facts:[["Joins","The Goldbach amongst the meres in the south"]],
 why:["Frames the south-eastern edge of the battlefield and funnels the Allied retreat"],
 story:""},

{id:"telnitz", p:[212,408], kind:"village", name:"Telnitz",
 sub:"Southernmost village on the Goldbach",
 facts:[["Attacked by","Kienmayer, then Dokhturov"],["Defended by","Colonel Schobert's 3e de Ligne and the Tirailleurs du Pô (Legrand); later Friant"],["Changed hands","Several times between 07:00 and 15:00"]],
 why:["The southern hinge of the French line and the road to the Vienna highway",
      "The I Column's first objective in Weyrother's disposition, which has it take the village and then cover its left beyond the defile"],
 story:"Mikhailovsky-Danilevsky has Kienmayer's Austrians twice break into the village and fail to hold it, then take it with Lewis once Dokhturov's column was up. According to Davout's report the 3e de Ligne left the village only after the finest resistance, Heudelet retook it, and superior forces took it again; according to Stutterheim the musket fire was very murderous. This map reads the flank as one Napoleon meant to give ground slowly; Marbot calls the thin right a trap, laid so that the Allies could take Telnitz easily."},

{id:"sokolnitz", p:[208,365], kind:"village", name:"Sokolnitz",
 sub:"Village with a walled castle and a pheasantry enclosure",
 facts:[["Attacked by","Langeron (village) and Przybyszewski (castle and pheasantry)"],["Defended by","Legrand, then Friant"],["Fell finally","Early afternoon, to the converging attack"]],
 why:["A walled castle and a pheasantry enclosure stand beside the village on the lower Goldbach; Davout reported the village taken and retaken several times"],
 story:"Przybyszewski's column was surrounded here in the afternoon and tried to break out north toward Kobelnitz. It disintegrated and surrendered almost entire."},

{id:"kobelnitz", p:[205,277], kind:"village", name:"Kobelnitz",
 sub:"Village on the Goldbach north of Sokolnitz",
 facts:[["Objective of","The Allied 4th Column, which never reached it"]],
 why:["The link between Legrand's thin southern line and Soult's assault divisions"],
 story:"Kollowrat and Miloradovich were ordered here from the Pratzen. They were still on the plateau when Soult arrived: held up by Liechtenstein's cavalry crossing their line of march and, in the Russian Biographical Dictionary's account (1903), chiefly by Kutuzov's reluctance to leave the heights."},

{id:"pratzenv", p:[276,243], kind:"village", name:"Pratzen village",
 sub:"Village on the western side of the plateau, north of the Pratzeberg, in a hollow at about 245 m",
 facts:[["Cleared by","Thiebault's brigade, about 09:00"]],
 why:["Sits between the two summits and covers the approach from Krzenowitz"],
 story:""},

{id:"puntowitz", p:[213,222], kind:"village", name:"Puntowitz",
 sub:"Goldbach village behind which Saint-Hilaire formed",
 facts:[["Occupied by","Saint-Hilaire's division before dawn"]],
 why:["One of the two crossing points from which the assault on the plateau was launched"], story:""},

{id:"girzikowitz", p:[233,162], kind:"village", name:"Girzikowitz",
 sub:"Goldbach village behind which Vandamme formed",
 facts:[["Occupied by","Vandamme's division; Bernadotte's corps closing up behind"]],
 why:["The northern launch point for the assault on Stare Vinohrady"], story:""},

{id:"blasowitz", p:[296,147], kind:"village", name:"Blasowitz",
 sub:"Village between the plateau and the Olmütz road",
 facts:[["Contested by","The Russian Guard held it in Stutterheim, Schönhals, Mikhailovsky-Danilevsky and Thiers, and in Thiebault the Grand Duke's reserve contests it, while the Chevalier Guard's history has the French occupy it without hindrance; its attackers are disputed: Lannes's V Corps in Thiebault's memoirs (vol. III, p. 462), Bernadotte's I Corps in Stutterheim (1806, p. 68), troops of both ordered onto it in Mikhailovsky-Danilevsky (1846, p. 255). Liechtenstein's part is disputed too: his cavalry arrives as the Guard occupies the village in Stutterheim (p. 56), only once the village is lost in Mikhailovsky-Danilevsky (p. 257)"],["Fell","About 11:00-11:15; the hour is not established"]],
 why:["This map reads it as the hinge of the Allied right onto the centre; in Thiers its loss is followed by Lannes parting Bagration's infantry from Liechtenstein's cavalry, while Schönhals has Bagration's line broken later, by Caffarelli's attack toward noon and d'Hautpoul's charge"], story:""},

{id:"augezd", p:[297,372], kind:"village", name:"Augezd",
 sub:"Village at the head of the road over the Satschan pond embankment",
 facts:[["Height above it","Taken by Vandamme in the afternoon"],["Function","A way out for the Allied left; according to the disposition the left was to retire, if the attack failed, by the Turas wood, Kobelnitz and Puntowitz, and the army, in the worst case, on Niemtschan, Hodjegitz and Herspitz"]],
 why:["This map reads it as the defile over which part of the Allied left escaped, under the French guns",
      "Schönhals has the guns of IV Corps and of the Guard, brought onto the height, fire on the retreating column"],
 story:"The chapel of St Anthony on the hill above the village - where Schönhals has Napoleon come with the Guard cavalry and artillery at the end - still overlooks the ground the Allied left had to cross."},

{id:"satschan", p:[268,421], kind:"water", name:"Satschan mere",
 sub:"Large shallow fishpond, frozen on 2 December",
 facts:[["The claim","The 30th Bulletin: twenty thousand Russians drowned"],["Recovered when drained","36 guns, 138 horses and three bodies in General Suchet's report of 16 December 1805, as Sokolov quotes it; 38 guns, about 130 horses and two men as usually given, not traced to a source"]],
 why:["Closes the southern escape route and forms the anvil of the French envelopment"],
 story:"French gunners did fire on the ice, and some men died there. The mass drowning is the 30th Bulletin's claim, twenty thousand; Marbot's memoirs tell of thousands drowned, Thiebault's of three to four thousand and Lejeune's of more than six thousand; Stutterheim (1806) has some die in the pond, and Schönhals, on the Telnitz priest's word, sixty to at most a hundred, calling the mass drowning a French exaggeration. The count from the drained pond is far below the Bulletin's, though by inference that count is a lower bound, not the toll. This map reads the Bulletin's figure as propaganda and the catastrophe as encirclement rather than drowning: an interpretation."},

{id:"menitz", p:[187,457], kind:"water", name:"Menitz mere",
 sub:"The western of the two meres",
 facts:[["Crossed by","Part of Dokhturov's column in the retreat"]],
 why:["Second of the two water obstacles closing the southern flank"], story:""},

{id:"austerlitz", p:[507,126], kind:"town", name:"Austerlitz",
 sub:"Slavkov u Brna — the town that named the battle",
 facts:[["Role","Allied rear area; the Guard withdrew on it"],["Note","Almost no fighting took place in the town itself"]],
 why:["The Allied line of retreat and supply toward Hungary"],
 story:"Napoleon signed the armistice with Francis at the castle here on 6 December."},

{id:"krzenowitz", p:[415,196], kind:"village", name:"Krzenowitz",
 sub:"Allied headquarters on the night of 1–2 December",
 facts:[["Role","Where Weyrother read out the dispositions after midnight"]],
 why:["The Allied command centre and the Guard's assembly area"],
 story:"The orders were read in German to an audience of largely Russian commanders, late, and with no time to distribute copies."},

{id:"olmutzroad", p:[249,64], kind:"road", name:"Brünn–Olmütz highway",
 sub:"The road across the northern battlefield: east-north-east from Brünn past the Santon to the Posoritz post house and Rausnitz",
 facts:[["Held by","Lannes' V Corps and Murat's cavalry against Bagration"]],
 why:["The Allied line of advance from Olmütz and the axis of the northern battle"], story:""},

{id:"viennaroad", p:[18,500], kind:"road", name:"To Raigern and the Vienna road",
 sub:"Rajhrad (Raigern), on the Brünn-Vienna road, lies about 1.6 km beyond this corner of the map and 8 km from Telnitz",
 facts:[["Used by","Friant's division, which reached Raigern overnight on 1-2 December"],["Distance covered","About 115 km from Vienna in under two days (Sokolov); thirty-six leagues in forty-eight hours (Thiers)"]],
 why:["This map reads Friant's arrival as what kept the French right from giving way"],
 story:"Thiers (1847) wrote of Friant's division that no troops on foot had made so astonishing a march: by his count, thirty-six leagues from Vienna to Gross-Raigern in forty-eight hours, one of the figures that vary between the sources."},
{id:"chapel", p:[291,354], kind:"landmark", name:"Chapel of St Anthony",
 sub:"On the hill at the northern edge of Augezd (Újezd u Brna); position approximate",
 facts:[["In 1805","Napoleon came here at the end from the Pratzen with the Guard cavalry and artillery, and artillery of IV Corps and the Guard fired from the height (Schönhals); a French officer's note of 1806 has him come down to the chapel with the Guard cavalry"],["The chapel","Completed in May 1703, closed in 1785, it lost its roof about the time of the battle and was in ruins by 1814, reconsecrated on 5 July 1863 (the town's account, a modern web text); a tourist website says it burned in 1805, and local tradition has the first cannon shot fired from it"]],
 why:["The view from here covers the defile and the meres the Allied left had to cross"], story:""},
{id:"posthouse", p:[324,36], kind:"landmark", name:"Posoritz post house",
 sub:"Post station on the Olmutz highway north of Holubitz, named after Posoritz, whose parish included Holubitz and Kruh; position approximate (about 1 km)",
 facts:[["Role","The Allied right's line of retreat ran past it toward Rausnitz"]],
 why:["Marks where the highway leaves the field for Rausnitz and Olmutz"], story:""},
{id:"rausnitz", p:[393,6], kind:"road", name:"To Rausnitz",
 sub:"Rousínov (Rausnitz) lies about 2.7 km beyond this edge of the map on the Olmutz highway",
 facts:[["Role","Bagration's line of withdrawal"]], why:[], story:""}
];

var SOURCE_NOTE = {
 title:"On accuracy and uncertainty",
 body:[
  "Positions here are reconstructed from standard accounts of the battle. Village-level locations and the sequence of attacks follow the accounts; the hours are partly dated in the sources read, partly disputed between them, and mostly this map's own, as each move's timing grade, and each event's timing and dispute, say. Exact frontages, the spacing between formations and the precise placement of cavalry reserves are not — a Napoleonic corps occupied a shifting area of ground, not a point.",
  "Every formation marker therefore carries a confidence grade. A means the position is documented; B means the sector is documented but the frontage shown is an approximation; C means the position is reconstructed from the narrative and should be treated as indicative only.",
  "Strengths are the hardest figures of all. The Allied column organisation split and intermingled regiments, and reputable orders of battle disagree substantially — Dokhturov's I Column is given as anything from 7,750 to 14,200 men. Where sources conflict, the dossier shows a working figure and the range.",
  "Terrain relief is exaggerated about {EXAG} times: one map unit is {M_PER_UNIT} m on the ground, and heights follow a separate vertical scale fitted to surveyed elevations. At true scale the Pratzen plateau reads as a gentle rise, about 115 m from the Goldbach to the Pratzeberg over some 2.5 km. The relief setting cannot be changed while the battle plays, because redrawing the ground can take longer than a frame; the ground switch (Landscape, Paper map, Landscape with counters) can, and a slow frame while it redraws advances the battle clock by at most 1.2 minutes at 1× (4.8 at four times speed).",
  "Villages are placed from the Czech municipality register and summits from terrain-model data; the map keeps its historical frame, which lies about {ROT} degrees off true north. The compass rose shows true north for the current view. Raigern, Rausnitz and Kowalowitz lie beyond the frame and are shown as markers at its edge.",
  "Open questions, left unresolved rather than guessed: the pattern of Russian infantry flags; whether Grenz infantry wore brown in 1805; whether vines stood at Telnitz and at Stare Vinohrady in 1805; the upper bound of the Russian Guard's attack; Bagration's exact line at dawn; the exact place of the Posoritz post house; the true position of Turas (it is Tuřany in Wolny's topography of 1836, and the Czech register places it about 2.8 km north-north-west of where this map draws it); the positions of Krug and Bellowitz, which no source read fixes; Kologrivov's command on 2 December, which rests on Sokolov alone (Mikhailovsky-Danilevsky and the Chevalier Guard's history have him command the Guard cavalry at Olmütz and on the march, and the Chevalier Guard came up in Maliutin's separate column); when Blasowitz fell; when Napoleon took post on the Zuran; when Bernadotte's corps, Drouet's division with it, crossed the Goldbach; how many guns stood by the chapel of St Anthony, and whose; how many men drowned in the meres; how Suchet's and Caffarelli's divisions were numbered on the day (Suchet's the 3rd of V Corps in both October returns read, Gazan's the 2nd on 26 October; Caffarelli's, under Bisson on 28 October, the 1st of III Corps); the brigade of Gladkov cited from Duffy and Smith, which no source read names; whether Uvarov's regiments were with Liechtenstein's column or had gone to Bagration the evening before; the numbers of Rivaud's and Drouet's divisions in I Corps, which the October returns give differently; and the hours on which the accounts read disagree with each other or with this map's timing: when the columns left the plateau (at 07:00 as the disposition ordered, the I Column at seven in Buxhowden's and Kutuzov's reports and so on the map, half past six for the left wing in Schönhals, between seven and eight in Mikhailovsky-Danilevsky; the II and III Columns at 07:30 in Schönhals, the III at 07:00 in Przybyszewski's report and the II coming down at 08:00 in Buxhowden's; all three from 07:00 on the map), when Kamensky turned his brigade about (no account read gives the hour; at 09:45 in the event, in the 08:45 phase in his brigade's record), when Rapp's counter-charge went in (by about noon in Schönhals, before one by the order of the Bulletin's narrative, about 13:00 in Rapp's and Ségur's memoirs; from 11:15 on the map), when Friant's division left Raigern (at 05:00, or between 05:30 and 06:00, in Davout's two reports, about 06:00 in Sokolov; from 04:00 on the map), when its leading brigade reached the Goldbach (about 09:00 in Stutterheim and the Moniteur's remarks of 1806; 08:00 on the map), when it retook Telnitz (in French hands at 09:30 in Davout's report, then lost again; 08:30 on the map), and when Bagration's corps fell back (with Blasowitz's fall on the map, 11:15; after an attack on its left toward noon in Schönhals). The map keeps its timing for Kamensky's turn, Rapp's charge, Friant's division and Bagration's corps. Duffy (1977) and Smith (1998), cited here for strengths, were not read. Kamensky's musketeer regiment is named here as Mikhailovsky-Danilevsky names it, Ryazhsk; the Materialien of 1806 give Ryazan, as this map earlier cited from Duffy, which is kept as the other reading. Two known limits of the terrain model are left as they are rather than reshaped to fit: its stream beds are not downhill at every point (reverse gradients of up to about 10 m within a reach), and from the chapel of St Anthony it does not show the centre of the Satschan pond, although Lejeune has Napoleon at the end on a knoll above Augezd facing the lakes, which this map takes to be the chapel's height.",
  "Two figures on the situation line are computed from the plotted reconstruction rather than taken from a source. The holding on the heights is the sum of the strengths of formations whose plotted positions fall inside the plateau outline; because the reconstruction plots formations and not losses, a figure that does not change does not mean the fighting there has stopped. Centre separation is a spatial test, not a historical statistic: it reports whether a French formation stands across the line joining the Allied groups north and south of the plateau. When it stops being reported the geometry no longer holds, which is not the same as the Allied army having reunited."],
 layers:[
  ["Historical record","What the sources attest: who was there, roughly how many, which villages were attacked and when. Marked as fact in an event's dossier."],
  ["Reconstruction","How this map represents the record: a plotted position, a route between anchors, a frontage. Graded A, B or C for confidence; a formation's dossier names the grade as its position's: documented, estimated or reconstructed."],
  ["Derived reading","What the engine computes from the plot, such as the holding on the heights or the centre-separation test. Never a source figure; the holding on the heights and the centre-separation test are marked derived wherever they are shown."]],
 refs:["Order-of-battle figures are this map's working figures, many first taken from Duffy (1977) and Smith (1998), cited and not read; where a formation's note names a source or gives what the sources read, it says so, and a figure without a note is this map's.",
       "Narrative of the fight for the Pratzeberg draws on Thiebault's memoirs, with Schönhals and Mikhailovsky-Danilevsky where the statements name them; Duffy (1977), on which it earlier drew, was not read.",
       "Figures for the meres: General Suchet's report of 16 December 1805, as Sokolov quotes it (2006, t. II, pp. 70-71, his note 88 citing Alombert and Colin, Paris, 2002, t. 5, p. 297; the French text was not read), has the pond near Augezd drained over five days and 36 Russian guns, 138 horse carcasses and three bodies taken from it; the figures usually given, 38 guns, about 130 horses and two men, were not traced to a source in this reading.",
       "Soult's 'twenty minutes at most' and Napoleon's further quarter of an hour are a memoir anecdote, told here as Thiebault's memoirs tell it (vol. III, 1894, pp. 456-458), who sets it 'au jour naissant' and has the signal follow an aide's report at half past eight (p. 504); Ségur tells the same exchange with ten minutes and has the divisions appear at eight (vol. II, 1877, p. 466); Savary has Napoleon hold the marshals until the attack on his right had become serious. The hour this map gives it is its own.",
       "Marbot's and Thiebault's memoirs tell of thousands drowned when the Guard's guns broke the ice of the Satschan mere (Marbot, vol. I, pp. 262-263, in the 27th edition read, first published 1891; Thiebault, vol. III, 1894, p. 466, three to four thousand), and Lejeune of more than six thousand (1895, vol. I, pp. 39-40); Stutterheim has some die (1806, pp. 74-75), and the editor of the Materialien prefers his word to the Bulletin's twenty thousand (1806, p. 121); Schönhals, on the Telnitz priest's statement, has sixty to at most a hundred and calls the mass drowning a French exaggeration (1873, pp. 169-170); all against the count from the drained pond.",
       "'The sun of Austerlitz' is a phrase the memoirs use: Thiebault puts it in quotation marks for the rising sun, which in his telling greets the attack on Telnitz and Sokolnitz and then lights the climb onto the Pratzen (vol. III, 1894, p. 461); Marbot has it appear in all its brilliance as the centre climbs toward Pratzen, and calls it the sun Napoleon so liked to recall (vol. I, p. 260, the 27th edition); neither gives that climb a clock hour. Participants put daybreak or the sun about eight (Thiebault: 'le jour ne venait qu'à huit heures'; Lejeune: 'il était huit heures du matin lorsque le soleil se leva'); this map computes its sun and takes no hour from them."]
};
