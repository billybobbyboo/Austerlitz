import sys
files={}
def load(f):
    if f not in files: files[f]=open('/home/claude/aus2/'+f,encoding='utf-8').read()
    return files[f]
def rep(f,old,new,why,count=1):
    s=load(f)
    if s.count(old)!=count: sys.exit('FAIL ['+f+'] ('+str(s.count(old))+' matches, expected '+str(count)+'): '+why+'\n   '+old[:140])
    files[f]=s.replace(old,new); print('ok  '+f.ljust(12)+why)
D='data.js'; A='analysis.js'

# ================= ORDER OF BATTLE =================
rep(D,'''  strength:null, guns:139, parent:null,
  role:"Direction of the army. Napoleon fought the battle from two command posts.",''','''  strength:null, parent:null,
  army:{men:"about 73,000", guns:139, src:"Duffy 1977; Smith 1998"},
  role:"Direction of the army. Napoleon directed the battle from the Zuran, then from Stare Vinohrady, and in the last phase from the chapel of St Anthony above Augezd.",''','army total moved off the HQ counter; three command posts')
rep(D,'  note:"The published order of battle gives about 73,000 French of all arms with 139 guns. Other accounts range from 65,000 to 75,000.",','  note:"Duffy (1977) and Smith (1998) give about 73,000 French of all arms with 139 guns - an army total, not the headquarters\' own. Other accounts range from 65,000 to 75,000.",','army note attributed')
rep(D,'''  staff:"Tsar Alexander I and Emperor Francis I present; plan by Gen. Franz von Weyrother",
  strength:null, parent:null,
  role:"Kutuzov opposed the plan and was overruled. He rode with the 4th Column and was wounded in the face.",''','''  staff:"Tsar Alexander I and Emperor Francis II (Francis I of Austria) present; plan by Gen. Franz von Weyrother",
  strength:null, parent:null,
  army:{men:"about 85,400", guns:278, src:"Duffy 1977; Smith 1998"},
  role:"Russian and Soviet accounts hold that Kutuzov opposed the plan and was overruled by the Tsar; at the council itself he reportedly dozed rather than objecting. He rode with the 4th Column and was lightly wounded in the face.",''','Allied HQ: naming, army total, attributed dispute')
rep(D,'''buxhowden:{ ech:"corps", nation:"ru", arm:"inf", desig:"Left Wing",''','''buxhowden:{ ech:"corps", nation:"ru", arm:"hq", desig:"Left Wing",''','Left Wing is a command, not a body of troops')
rep(D,'contemporaries reported he was drunk.",','Langeron, a hostile witness, alleged that he was drunk.",','drunkenness attributed to Langeron')
rep(D,'''  name:"Fourth Column", commander:"FML Johann Kollowrat and Lt.-Gen. Mikhail Miloradovich", parent:null,
  strength:20000, strengthNote:"sources give roughly 16,000 to 23,900, with 52–76 guns",''','''  name:"Fourth Column", commander:"FZM Johann Kollowrat and Lt.-Gen. Mikhail Miloradovich", parent:null,
  strength:13900, strengthRange:[12000,23900], mixedNote:"Austrian and Russian: fifteen Austrian battalions and fourteen Russian",
  strengthNote:"13,900 infantry with 52 light and 24 heavy guns (Duffy 1977; Smith 1998), used here. Other figures: about 12,000 with fourteen Russian battalions (WarHistory); 17,000 (Napoleon-Empire); 23,900 (Chandler, and an older revision of the same order of battle)",''','4th Column: working 13,900 with a sourced range')
rep(D,'''  strength:10000, strengthNote:"about 3,000–12,000 depending on the order of battle used",''','''  strength:4800, strengthRange:[4800,7000],
  strengthNote:"Duffy and Smith imply about 4,800 (13,900 less the Austrian brigades' 9,100); fourteen battalions at 350-500 men would give 4,900-7,000. The earlier 10,000 had no source",''','Miloradovich as a range')
rep(D,'''  name:"Kollowrat's Austrians", commander:"FML Johann Karl Graf Kollowrat-Krakowsky",''','''  name:"Kollowrat's Austrians", commander:"FZM Johann Karl Graf Kollowrat-Krakowsky",''','Kollowrat: Feldzeugmeister since October 1800 (Deutsche Biographie)')
rep(D,'''lich:{ ech:"corps", nation:"at", arm:"cav", desig:"V Column",
  name:"Fifth Column (cavalry)", commander:"FML Prince Johann von Liechtenstein",
  staff:"Austrian cuirassiers with Uvarov's Russian horse attached", parent:null,''','''lich:{ ech:"corps", nation:"ru", arm:"cav", desig:"V Column", mix:{nation:"at", share:0.2},
  name:"Fifth Column (cavalry)", commander:"FML Prince Johann von Liechtenstein",
  staff:"Mixed, mostly Russian: the Austrian cuirassier brigades of Caramelli and Weber (about 1,100) and the Russian brigades of Gladkov and Uvarov (Duffy 1977; Smith 1998)", parent:null,''','5th Column shown as mixed, mostly Russian')
rep(D,'  role:"Deployed on the wrong flank overnight. Its counter-march across the 4th Column\'s front cost the Allies the plateau.",','  role:"Deployed on the wrong flank overnight; its counter-march across the 4th Column\'s front contributed to that column\'s late start.",','counter-march: contributing, not decisive')
rep(D,'  strength:2900, strengthNote:"about 2,900; figures approximate",','  strength:4250, strengthRange:[4000,4500], strengthNote:"the Ryazan and Fanagoria regiments, about 2,000 each, with dragoons, Cossacks and pioneers attached (Duffy, via the Langeron column return)",','Kamensky 4,000-4,500')
rep(D,'  strength:7400, strengthNote:"about 7,000 to 9,000 with 9 guns", guns:9,','  strength:7400, strengthNote:"7,400 sabres and 36 guns (Duffy 1977; Smith 1998). Beaumont\'s dragoons and Milhaud\'s light brigade are not plotted: the four plotted divisions account for 6,800 of the 7,400", guns:36,','Cavalry Reserve: 36 guns')
rep(D,'''  name:"Nansouty's Cuirassiers", commander:"Gen. de division Étienne de Nansouty", parent:"c_cav",
  strength:2200,''','''  name:"Nansouty's Cuirassiers", commander:"Gen. de division Étienne de Nansouty", parent:"c_cav",
  strength:1600, strengthNote:"about 1,600: the six regiments listed by Duffy and Smith sum to about 1,580, with 92 gunners",''','Nansouty ~1,600')
rep(D,'  strength:5700, strengthNote:"about 5,500 to 5,700 with 10 guns; elite companies drawn from regiments on garrison duty", guns:10,','  strength:5700, strengthNote:"about 5,500 to 5,700; elite companies drawn from regiments on garrison duty. No artillery is listed for the division in the orders of battle checked",','grenadier guns removed')
rep(D,'''santon:{ ech:"bde", nation:"fr", arm:"art", desig:"17e Legere / Santon battery",
  name:"The Santon detachment", commander:"17e Regiment d'Infanterie Legere", parent:"c_v",
  strength:1600, strengthNote:"about 1,600 infantry with 18 guns",
  role:"The anchor of the French left. The hill's western face was scarped and the crest entrenched before the battle.",''','''santon:{ ech:"bde", nation:"fr", arm:"inf", desig:"17e Légère with the Santon battery", battery:18, guns:18,
  name:"The Santon detachment", commander:"Gen. de brigade Michel Claparède", parent:"c_v",
  strength:1600, strengthNote:"about 1,600 infantry of the 17e Légère with 18 guns (Duffy/Smith; Tvarožná municipal history)",
  role:"The anchor of the French left. Its slopes were scarped and the crest entrenched before the battle; which face was scarped is not established in the sources checked.",''','Santon: Claparede, infantry with its battery')
rep(D,'''  name:"Guard Cavalry", commander:"Chevalier Guard and Guard cavalry regiments", parent:"constantine",
  strength:3700, strengthNote:"3,700 horse in the published order of battle",''','''  name:"Guard Cavalry", commander:"Lt.-Gen. Andrei Kologrivov", parent:"constantine",
  strength:3700, strengthNote:"3,700 horse (Duffy 1977; Smith 1998). Kologrivov's command follows the same source; not yet confirmed by a second",''','Russian Guard cavalry: Kologrivov')
rep(D,'  staff:"Brigades: Levasseur · Merle · Fereys. 26e Legere, Corsican and Po tirailleurs in Telnitz", parent:"c_iv",','  staff:"Brigades: Merle · Féry · Levasseur. Colonel Schobert\'s 3e de Ligne and the Tirailleurs du Pô in Telnitz", parent:"c_iv",','Legrand: brigades and the Telnitz garrison')
for old,new in [('the published order of battle gives 4,300 men present','Duffy and Smith give 4,300 men present'),
                ('about 3,470 in the published order of battle','about 3,470 in Duffy and Smith'),
                ('3,440 infantry and 3,440 horse with 12 light guns in the published order of battle','3,440 infantry and 3,440 horse with 12 light guns (Duffy/Smith)'),
                ('13,240 infantry and 250 cavalry with 64 guns in the published order of battle','13,240 infantry and 250 cavalry with 64 guns (Duffy/Smith)'),
                ('the published order of battle gives 6,730 infantry','Duffy and Smith give 6,730 infantry'),
                ('strengthNote:"6,730 in the published order of battle"','strengthNote:"6,730 (Duffy 1977; Smith 1998)"')]:
    rep(D,old,new,'source named: '+new[:40])

# ================= TRACKS: acts that the corrections change =================
rep(D,'act:"Closing on Raigern after roughly 110 km in about 48 hours from Vienna"},','act:"At Raigern since the night of 1 December, 8 km south-west of Telnitz and just beyond the map edge, after about 113 km from Vienna in 40-46 hours (sources vary)"},','Friant ph0: overnight at Raigern')
rep(D,'act:"Coming up the Vienna road toward Telnitz"},','act:"Marching from Raigern toward Telnitz"},','Friant ph1: from Raigern, not the Vienna road')
rep(D,'act:"Astride the road between Krug and Holubitz"},','cf:"B",act:"Astride the Olmutz highway, his line reaching south toward Holubitz. Re-plotted on the corrected road, which passes about 2 km north of Holubitz; the exact line is not established"},','Bagration ph0 on the corrected road')
s=load(D); import re
m=re.search(r'\n    0:\{p:\[\d+,\d+\],st:"holding",cf:"A",cf:"B",',s)
if m: files[D]=s.replace(m.group(0),m.group(0).replace('cf:"A",cf:"B",','cf:"B",')); print('ok  data.js     Bagration ph0 graded B')
rep(D,'act:"Advances east astride the highway"},','act:"Advances astride the highway toward the post house"},','Suchet follows the corrected road')
rep(D,'act:"Moves headquarters forward to the chapel at Stare Vinohrady"},','act:"Moves forward from the Zuran to Stare Vinohrady"},','Napoleon ph6: Stare Vinohrady, no chapel')
rep(D,'act:"Directs the fire onto the Augezd defile and the meres"}','cf:"B",act:"From the chapel of St Anthony on the hill above Augezd, watches the Allied left break and directs the fire onto the defile and the meres"}','Napoleon ph8 at the St Anthony chapel')
rep(D,'act:"Fires down onto the causeway and the frozen mere"},','cf:"B",act:"A battery of 24 guns of the Guard and IV Corps, placed by the chapel of St Anthony (Újezd local history), fires down onto the causeway and the frozen mere"},','height guns at the chapel')
s=load(D); n=s.count('cf:"C",cf:"B"')
if n: files[D]=s.replace('cf:"C",cf:"B"','cf:"B"'); print('ok  data.js     removed '+str(n)+' superseded grade(s)')
s=load(D); n=s.count('cf:"A",cf:"B"')
if n: files[D]=s.replace('cf:"A",cf:"B"','cf:"B"'); print('ok  data.js     removed '+str(n)+' superseded grade(s)')
rep(D,'act:"With the 4th Column on the plateau; both emperors in attendance"},','cf:"B",act:"Kutuzov\'s headquarters at Krzenowitz, where the dispositions were read overnight. The emperors join the 4th Column on the plateau about 08:30-09:00"},','Allied HQ at 04:00: Krzenowitz, not the plateau')
rep(D,'act:"Sees Soult on the heights; orders the 4th Column to face about and recalls part of the II Column"},','act:"The Tsar has just ridden up and ordered the 4th Column forward (about 08:45; Russian Biographical Dictionary, 1903). Soult appears on the heights; Kutuzov orders the column to face about and recalls part of the II Column"},','the emperors arrive about 08:45')
rep(D,'act:"Climbs the vine-planted northern slope of the plateau"},','act:"Climbs toward Stare Vinohrady, the \'old vineyards\' (whether vines stood there in 1805 is not established)"},','vineyards: no longer asserted')
rep(D,'act:"Struck by the Russian Imperial Guard; two battalions broken and the eagle of the 4th Line carried off"},','act:"Struck by the Russian Imperial Guard; two battalions broken, and the eagle of the 4th Line taken by the Guard cavalry"},','eagle: taken by the Guard cavalry')
rep(D,'act:"Attacks Vandamme; breaks two French battalions and takes the eagle of the 4th Line"},','act:"Attacks Vandamme and breaks two French battalions; the Guard cavalry then takes the eagle of the 4th Line"},','Guard infantry does not take the eagle')
rep(D,'act:"The Chevalier Guard charges and is broken by Bessieres and Rapp; Prince Repnin captured"},','act:"The Guard cavalry takes the eagle of the 4th Line - traditionally credited to the Life Guard Horse Regiment. The Chevalier Guard\'s charge is then broken by Bessieres and Rapp; Prince Repnin captured"},','Guard cavalry takes the eagle')
rep(D,'cf:"A",act:"Langeron rides back up the slope with the Kursk regiment to support Kamensky; the regiment is destroyed"},','cf:"C",act:"Langeron rides back and sends reinforcements up the slope toward Kamensky; one account has two battalions arriving just as the position was abandoned. Which regiment, and what it lost, are not established"},','Kursk: figure removed, graded C')
rep(D,'Surrendered almost entire. Przybyszewski was later court-martialled and reduced to the ranks."}','Surrendered almost entire, near Kobelnitz by evening. Przybyszewski was later court-martialled."}','Przybyszewski: court-martialled')
rep(D,'act:"Closes the trap between the Goldbach and the meres"},','cf:"B",act:"Closes on Sokolnitz from the east while Davout presses from the west"},','Saint-Hilaire against Sokolnitz')

# ================= PHASES =================
rep(D,'''    ["c. 08:00","Friant's division of Davout's III Corps reaches Raigern after a march of roughly 110 km in about 48 hours."]],''','''    ["c. 08:00","Friant's leading brigade comes up to the Goldbach near Telnitz. The division had reached Raigern overnight after about 113 km from Vienna in 40-46 hours (sources vary)."]],''','Friant: overnight at Raigern, Goldbach c. 08:00')
rep(D,'Vandamme for the vine-planted slopes of Stare Vinohrady about a mile to the north. Kutuzov, riding with the 4th Column, sees the danger and begins pulling troops back, but the Allied army is already cut in two along its own centre line.",','Vandamme for Stare Vinohrady, the \'old vineyards\', north-east of the village. Kutuzov, riding with the 4th Column, sees the danger and begins pulling troops back. The Allied centre is being broken, but the plateau will not be firmly French until about 11:00.",','no premature "cut in two"')
rep(D,'''    ["c. 10:30","Langeron brings the Kursk regiment back up the slope; it is destroyed, losing about 1,600 of 2,000 men."]],''','''    ["c. 10:30","Langeron rides back and sends reinforcements up the slope; they arrive as the position is lost. Their regiment and losses are not established."]],''','Kursk line in phase 4')
rep(D,'The Chevalier Guard and the Guard infantry break two French battalions and carry off the eagle of the 4th Line, the only one Napoleon lost that day.','The Guard infantry breaks two French battalions and the Guard cavalry carries off the eagle of the 4th Line - traditionally credited to the Life Guard Horse Regiment - the only one Napoleon lost that day.','phase 6: eagle attribution')
rep(D,'''    ["c. 11:15","The Russian Guard attacks Vandamme; the 4th Line loses its eagle."],''','''    ["after 11:00","The Russian Guard attacks Vandamme; the 4th Line loses its eagle. The hour is not established."],''','Guard attack: no false precision')
rep(D,'''    ["c. 12:00","Napoleon shifts headquarters from the Zuran to the chapel at Stare Vinohrady."],''','''    ["c. 12:00","Napoleon moves forward from the Zuran to Stare Vinohrady."],''','Napoleon to Stare Vinohrady')
rep(D,'  lede:"With the plateau secure from Pratzen to the Olmutz road, Napoleon turns his centre ninety degrees.','  lede:"With the plateau secure and the Allied right pushed back beyond Blasowitz, Napoleon turns his centre ninety degrees.','the plateau does not reach the Olmutz road')
rep(D,'''    ["c. 13:00","Soult and Davout launch the converging assault on the Allied left."],''','''    ["c. 13:00-14:00","Soult and Davout launch the converging assault on the Allied left."],''','wheel as an interval')
rep(D,' and two men. Perhaps five thousand Allied troops were ever in that area at all.",',' and two men - figures as usually given. Napoleon watches from the chapel of St Anthony above Augezd.",','"perhaps five thousand" removed')

# ================= FEATURES =================
rep(D,''' sub:"Dominant central plateau, about 12 km of open rolling crest",
 facts:[["Relief","Roughly 40–60 m above the Goldbach valley"],''',''' sub:"Dominant central plateau: a crest about 3 km long from Stare Vinohrady to the Pratzeberg",
 facts:[["Relief","Summit about 115 m above the Goldbach (324 m against 207-211 m); Pratzen village lies in a hollow at 245 m"],''','Pratzen: extent and relief')
rep(D,'When the Allies marched off it at dawn he took it back with two divisions in under an hour, splitting their army in two."},','When the Allies marched off it in the morning he took it back with two divisions; by about 11:00 it was French from end to end and their army was split in two."},','Pratzen: no "in under an hour"')
rep(D,' facts:[["Taken by","Vandamme\'s division, about 09:00"],["Contested by","Russian Imperial Guard, about 11:15"],',' facts:[["Taken by","Vandamme\'s division in the course of the morning; the plateau was French from end to end by about 11:00"],["Contested by","Russian Imperial Guard, after about 11:00 (the hour is not established)"],','Stare Vinohrady: timing')
rep(D,' story:"The Russian Guard\'s counterattack here broke two of Vandamme\'s battalions and carried off the eagle of the 4th Line — the only eagle Napoleon lost at Austerlitz.',' story:"The Russian Guard\'s counterattack here broke two of Vandamme\'s battalions, and its cavalry took the eagle of the 4th Line — the only eagle Napoleon lost at Austerlitz.','Stare Vinohrady: eagle')
rep(D,' facts:[["Garrison","17e Legere with eighteen guns"],["Preparation","Western face scarped, crest entrenched before the battle"],',' facts:[["Garrison","Claparède\'s 17e Légère with eighteen guns"],["Preparation","Slopes scarped and crest entrenched before the battle; which face is not established"],','Santon: garrison and scarping')
rep(D,'waited fifteen minutes past the moment Soult said he needed, and then released the attack."},','is said to have waited a further quarter of an hour after Soult said how long he needed, and then released the attack."},','Zuran: anecdote attributed')
rep(D,'["Defended by","Legrand\'s 3e Ligne, Corsican and Po tirailleurs; later Friant"]','["Defended by","Colonel Schobert\'s 3e de Ligne and the Tirailleurs du Pô (Legrand); later Friant"]','Telnitz garrison')
rep(D,'The delay caused by Liechtenstein\'s counter-march meant they were still on the plateau when Soult arrived."},','They were still on the plateau when Soult arrived: held up by Liechtenstein\'s cavalry crossing their line of march and, in the Russian Biographical Dictionary\'s account (1903), chiefly by Kutuzov\'s reluctance to leave the heights."},','Kobelnitz: the delay attributed')
rep(D,' sub:"Village on the eastern shoulder of the plateau",',' sub:"Village on the western side of the plateau, north of the Pratzeberg, in a hollow at about 245 m",','Pratzen village is on the western side')
rep(D,' sub:"Village at the neck of land between the meres",',' sub:"Village at the head of the road over the Satschan pond embankment",','Augezd: the embankment route')
rep(D,' story:"The church on the steep hill above the village still overlooks the ground the Allied left had to cross."},',' story:"The chapel of St Anthony on the hill above the village - where Napoleon watched the end and a French battery stood - still overlooks the ground the Allied left had to cross."},','Augezd: the chapel, not a church')
rep(D,'["Recovered when drained","38 guns, about 130 horses, and two men"],["Troops in the area at all","Perhaps 5,000"]],','["Recovered when drained","38 guns, about 130 horses, and two men (figures as usually given)"]],','Satschan: the unsupported 5,000 removed')
rep(D,' sub:"The main east–west road across the northern battlefield",',' sub:"The road across the northern battlefield: east-north-east from Brünn past the Santon to the Posoritz post house and Rausnitz",','highway description')
rep(D,'''{id:"viennaroad", p:[18,500], kind:"road", name:"Vienna road at Raigern",
 sub:"Davout's approach from the south-west",
 facts:[["Used by","Friant's division, arriving at first light"],["Distance covered","About 110 km in roughly 48 hours"]],''','''{id:"viennaroad", p:[18,500], kind:"road", name:"To Raigern and the Vienna road",
 sub:"Rajhrad (Raigern), on the Brünn-Vienna road, lies about 1.6 km beyond this corner of the map and 8 km from Telnitz",
 facts:[["Used by","Friant's division, which reached Raigern overnight on 1-2 December"],["Distance covered","About 113 km from Vienna in 40-46 hours (sources vary)"]],''','Raigern: off-map marker')
s=load(D); i=s.index('\n];',s.index('var FEATURES'))
files[D]=s[:i]+''',
{id:"chapel", p:[291,354], kind:"landmark", name:"Chapel of St Anthony",
 sub:"On the hill at the northern edge of Augezd (Újezd u Brna); position approximate",
 facts:[["In 1805","Napoleon's command post for the last phase; a French battery of 24 guns of the Guard and IV Corps stood here"],["The chapel","First built 1703; burned in the battle; rebuilt 1863"]],
 why:["The view from here covers the defile and the meres the Allied left had to cross"], story:""},
{id:"posthouse", p:[324,36], kind:"landmark", name:"Posoritz post house",
 sub:"Post station on the Olmutz highway north of Holubitz; position approximate (about 1 km)",
 facts:[["Role","The Allied right's line of retreat ran past it toward Rausnitz"]],
 why:["Marks where the highway leaves the field for Rausnitz and Olmutz"], story:""},
{id:"rausnitz", p:[393,6], kind:"road", name:"To Rausnitz",
 sub:"Rousínov (Rausnitz) lies about 2.7 km beyond this edge of the map on the Olmutz highway",
 facts:[["Role","Bagration's line of withdrawal"]], why:[], story:""}'''+s[i:]
print('ok  data.js     chapel, post house and Rausnitz markers added')

# ================= SOURCES =================
rep(D,'''  "Terrain relief is exaggerated roughly fivefold. At true scale the Pratzen plateau, which decided the battle, would be almost invisible.",''','''  "Terrain relief is exaggerated about {EXAG} times: one map unit is {M_PER_UNIT} m on the ground, and heights follow a separate vertical scale fitted to surveyed elevations. At true scale the Pratzen plateau reads as a gentle rise, about 115 m from the Goldbach to the Pratzeberg over some 2.5 km.",
  "Villages are placed from the Czech municipality register and summits from terrain-model data; the map keeps its historical frame, which lies about {ROT} degrees off true north. The compass rose shows true north for the current view. Raigern, Rausnitz and Kowalowitz lie beyond the frame and are shown as markers at its edge.",
  "Open questions, left unresolved rather than guessed: the pattern of Russian infantry flags; whether Grenz infantry wore brown in 1805; whether vines stood at Telnitz and at Stare Vinohrady in 1805; the upper bound of the Russian Guard's attack; Bagration's exact line at dawn; the exact place of the Posoritz post house; the true position of Turas; Kologrivov's command, which rests on one source.",''','sources: derived exaggeration, geographic basis, open questions')
rep(D,''' refs:["Order-of-battle detail follows the published French and Allied orders of battle for 2 December 1805.",''',''' refs:["Order-of-battle figures follow Duffy (1977) and Smith (1998) unless a range is given; a range names its sources in the formation's note.",''','order-of-battle source named')

# ================= ANALYSIS: chapters, command, plans, events, tour =================
rep(A,"Davout's III Corps detachment, some 4,300 men, was still marching up from Vienna and did not reach Raigern until first light.","Davout's III Corps detachment, some 4,300 men by Duffy's and Smith's count, reached Raigern only on the night of 1 December after a forced march from Vienna, 8 km from the villages it had to hold.",'weakness: Davout at Raigern overnight')
rep(A,"At about 08:45 they climbed the western escarpment and struck the 4th Column, which was still filing off the plateau and had been delayed by Liechtenstein's cavalry crossing its line of march. The two summits, the Pratzeberg and Stare Vinohrady, were in French hands within the hour.","At about 08:45 they climbed the western slope and struck the 4th Column, which was still on the plateau. It had started about two hours late: held up by Liechtenstein's cavalry crossing its line of march and, in Russian accounts, chiefly by Kutuzov's reluctance to leave the heights until the Tsar ordered it forward. The fight for the two summits lasted until about 11:00, when the plateau was French from end to end.",'Pratzen chapter: no escarpment, no "within the hour"')
rep(A,"The Chevalier Guard and the Guard infantry broke two French battalions and took the eagle of the 4th Line, the only one lost that day.","The Guard infantry broke two French battalions and the Guard cavalry took the eagle of the 4th Line, the only one lost that day.",'guard chapter: eagle')
rep(A,"At about 13:00 Napoleon turned his centre ninety degrees","Between about 13:00 and 14:00 Napoleon turned his centre ninety degrees",'wheel chapter: interval')
rep(A,''' 2:[["didnt","doc","That the 4th Column's advance had stalled because Liechtenstein's cavalry was crossing its line of march."],''',''' 2:[["knew","doc","That the 4th Column was still on the plateau: Kutuzov was holding it back, and the Tsar rode up about 08:45 and ordered it forward (Russian Biographical Dictionary, 1903)."],''','command: Kutuzov knew the column had stalled')
rep(A,'''    ["knew","doc","That Davout's detachment was coming up the Vienna road and would arrive during the morning."],''','''    ["knew","doc","That Davout's detachment had reached Raigern overnight and would come up to the Goldbach during the morning."],''','command: Davout at Raigern')
rep(A,"then wheel the whole left wing north-west to cut the Brunn road and roll the French army up against the hills.","then wheel the left wing north-west to envelop the French as they fall back toward Brünn - severing their line to Vienna - and roll them up against the hills.",'Allied aim: one formulation')
rep(A,'{n:"Cut the Brunn road", p:','{n:"Envelop toward Brünn", p:','objective label')
rep(A,'''  cost:"Three of those assumptions were wrong and the fourth, the counter-march of the cavalry column, cost the 4th Column the hour in which Soult took the heights.",''','''  cost:"All three assumptions were wrong. Execution compounded them: the 4th Column started about two hours late - delayed by the cavalry column's counter-march and, in Russian accounts, chiefly by Kutuzov's reluctance to leave the heights - and was still on the plateau when Soult arrived.",''','plan cost: no phantom fourth assumption')
rep(A,'{n:"Davout coming up the Vienna road", c:','{n:"Davout coming up from Raigern", c:','staging label')
rep(A,'''{id:"davout", t:[450,495], n:"Friant's division reaches Raigern", side:"fr", kind:"arrival",
 p:[56,436], forms:["friant","c_iii"], cf:"A", claim:"fact",
 why:"About 110 km from Vienna in roughly 48 hours. Without it the French right does not survive the morning."},''','''{id:"raigern", t:[240,285], n:"Friant's division at Raigern since the night", side:"fr", kind:"arrival",
 p:[18,500], forms:["friant","bourcier"], cf:"B", claim:"est",
 why:"Davout and Friant reached Raigern on the night of 1 December after about 113 km from Vienna in 40-46 hours (sources vary). Raigern lies just beyond this corner of the map."},
{id:"davout", t:[465,495], n:"Friant's leading brigade reaches the Goldbach", side:"fr", kind:"arrival",
 p:[198,402], forms:["friant"], cf:"B", claim:"est",
 why:"About 08:00, near Telnitz. Without it the French right does not survive the morning."},''','Davout event split: overnight at Raigern; the Goldbach c. 08:00')
rep(A,''' p:[177,134], forms:["gqg","c_iv","sthilaire","vandamme"], cf:"A", claim:"fact",
 why:"Asked how long he needed, Soult answered under twenty minutes. Napoleon waited a further quarter of an hour to let more of the enemy get down into the valley."},''',''' p:[177,134], forms:["gqg","c_iv","sthilaire","vandamme"], cf:"B", claim:"est",
 why:"Asked how long he needed, Soult is reported to have answered under twenty minutes, and Napoleon to have waited a further quarter of an hour to let more of the enemy get down into the valley. A memoir anecdote."},''','Soult anecdote graded B')
rep(A,'n:"Saint-Hilaire and Vandamme climb the escarpment"','n:"Saint-Hilaire and Vandamme climb the slope"','escarpment -> slope')
rep(A,''' why:"The cavalry column had been posted on the wrong flank overnight. Crossing the line of march cost the 4th Column the hour in which the heights were lost."},''',''' why:"The cavalry column had been posted on the wrong flank overnight; crossing the line of march contributed to the 4th Column starting about two hours late. Russian accounts put the delay chiefly on Kutuzov's reluctance to leave the heights."},''','counter-march: contributing cause')
rep(A,'''{id:"kursk", t:630, n:"The Kursk regiment is destroyed on the slope", side:"al", kind:"engagement",
 p:[290,282], forms:["lang"], cf:"A", claim:"fact",
 why:"About 1,600 of 2,000 men. Langeron brought it back up himself; the crest could not be retaken."},''','''{id:"kursk", t:630, n:"Langeron's reinforcements arrive as the crest is lost", side:"al", kind:"engagement",
 p:[290,282], forms:["lang"], cf:"C", claim:"recon",
 why:"Langeron rode back and sent troops up toward Kamensky; one account has two battalions arriving just as the position was abandoned. Which regiment, and what it lost, are not established."},''','Kursk event: C, no figure')
rep(A,''' p:[296,147], forms:["caffarelli","suchet","bag","lich"], cf:"A", claim:"fact",''',''' p:[296,147], forms:["caffarelli","suchet","bag","lich"], cf:"B", claim:"est",''','Blasowitz graded B')
rep(A,'''{id:"guard-attack", t:675, n:"The Russian Guard takes the eagle of the 4th Line", side:"al", kind:"attack",
 p:[313,205], forms:["rg_inf","rg_cav","constantine","vandamme"], cf:"A", claim:"fact",''','''{id:"guard-attack", t:[660,780], n:"The Russian Guard takes the eagle of the 4th Line", side:"al", kind:"attack",
 p:[313,205], forms:["rg_inf","rg_cav","constantine","vandamme"], cf:"B", claim:"est",''','Guard attack: an interval after 11:00, B')
rep(A,'''{id:"guard-broken", t:705, n:"Rapp's counter-charge breaks the Chevalier Guard", side:"fr", kind:"engagement",
 p:[308,210], forms:["guard_cav","guard_inf","drouet","rg_cav"], cf:"A", claim:"fact",''','''{id:"guard-broken", t:[675,795], n:"Rapp's counter-charge breaks the Chevalier Guard", side:"fr", kind:"engagement",
 p:[308,210], forms:["guard_cav","guard_inf","drouet","rg_cav"], cf:"B", claim:"est",''','Guard broken: interval, B')
rep(A,'''{id:"hq-forward", t:720, n:"Napoleon moves headquarters onto the plateau", side:"fr", kind:"decision",
 p:[309,207], forms:["gqg"], cf:"A", claim:"fact",
 why:"From the chapel at Stare Vinohrady he can see the whole Allied left still fighting westward with its rear open."},''','''{id:"hq-forward", t:720, n:"Napoleon moves forward to Stare Vinohrady", side:"fr", kind:"decision",
 p:[309,207], forms:["gqg"], cf:"B", claim:"est",
 why:"From Stare Vinohrady he can see the whole Allied left still fighting westward with its rear open. Later he moves again, to the chapel of St Anthony above Augezd."},''','HQ forward: Stare Vinohrady, no chapel')
rep(A,'''{id:"wheel", t:780, n:"The French centre turns south", side:"fr", kind:"movement",
 p:[277,303], forms:["sthilaire","vandamme","c_gren","guard_inf"], cf:"A", claim:"fact",''','''{id:"wheel", t:[780,840], n:"The French centre turns south", side:"fr", kind:"movement",
 p:[277,303], forms:["sthilaire","vandamme","c_gren","guard_inf"], cf:"B", claim:"est",''','wheel: 13:00-14:00, B')
rep(A,'The blue army to the west is French, the amber army to the east Russian and Austrian.','The blue army to the west is French; to the east are the Russians in green and the Austrians in white, whose arrows and outlines are drawn in amber.','tour: no "amber army"')
for f in files: open('/home/claude/aus2/'+f,'w',encoding='utf-8').write(files[f])
print('history patch written')
