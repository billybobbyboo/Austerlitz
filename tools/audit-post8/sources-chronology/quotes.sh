#!/usr/bin/env bash
# Final audit after Stage 8, area sources-chronology: re-extract, from the archive.org text layers (OCR), every passage the ledger
# quotes, with its context and the OCR file's line, so that each "verified" row can be re-checked. Read-only.
# usage: tools/audit-post8/sources-chronology/quotes.sh [DL_DIR] > docs/audit-post8-evidence/sources-chronology/quotes-textlayer.txt
# DL_DIR holds <archive.org id>_djvu.txt files saved as <id>.txt (kutuzov1951.txt is item 20250102_20250102_1833); fetch-texts.sh
# fetches them. The text layer is OCR: the ledger says so wherever a quotation rests on it alone.
set -u
DL="${1:-/tmp/claude-0/-home-user-Austerlitz/cb561984-b1ad-5d5a-82ba-de46bf4c820e/scratchpad/srcchron/dl}"
G="python3 -I $(dirname "$0")/srcgrep.py"
q(){ # row, source label, file, regex, context, max
  echo; echo "=== $1 | $2 | $DL/$3"; $G "$DL/$3" "$4" "${5:-220}" "${6:-1}" 2>&1; }

q L01 "Thiebault, Memoires t. III (1894) p. 457 [ia mmoires03thieuoft]" mmoires03thieuoft.txt "voulant mettre à profit un brouillard" 260
q L01 "Schoenhals, Der Krieg 1805 in Deutschland (1873) p. 158 [ia derkriegindeuts00schgoog]" derkriegindeuts00schgoog.txt "Ein dichter Nebel lagerte" 260
q L01 "Segur, Histoire et memoires t. II (1877) p. 466 [ia histoireetmmoir06sggoog]" histoireetmmoir06sggoog.txt "pas huit heures ; le silence" 420
q L01 "Savary, Memoires t. II (1828) p. 204 [ia mmoiresduducder04savagoog]" mmoiresduducder04savagoog.txt "brouillard très.?.?pais" 160
q L02 "Thiebault t. III p. 457 (twenty minutes, quarter of an hour)" mmoires03thieuoft.txt "au plus vingt minutes" 300
q L02 "Thiebault t. III p. 458 (un peu prematurement)" mmoires03thieuoft.txt "un peu prématurément" 300
q L02 "Thiebault t. III p. 504 (the aide at half past eight)" mmoires03thieuoft.txt "trompé par l.aide de camp" 330
q L02 "Segur t. II p. 466 (ten minutes; il etait huit heures)" histoireetmmoir06sggoog.txt "Dix minutes, répondit" 420
q L02 "Stutterheim, Die Schlacht bey Austerlitz (Hamburg 1806) pp. 60-61 [ia 11344011bsb] (about nine)" 11344011bsb.txt "Es war ungefahr 9" 300
q L02 "Schoenhals p. 160 (the order to attack about nine)" derkriegindeuts00schgoog.txt "Jetzt zerstreute sich der Nebel" 360
q L04 "Buxhowden's report, Kutuzov documents t. II (1951) pp. 241-242 [ia 20250102_20250102_1833]" kutuzov1951.txt "из лагеря выступили поутру" 220
q L04 "Kutuzov's relation no. 247 (14 Jan 1806), Kutuzov documents p. 255" kutuzov1951.txt "Мы выступили в 7 час" 160
q L04 "Przybyszewski's report (11 Jul 1806), Kutuzov documents p. 268" kutuzov1951.txt "ноября 20 дня поутру в 7 час" 200
q L04 "Schoenhals p. 157 (the disposition's hour)" derkriegindeuts00schgoog.txt "war 7 Uhr Fr" 200
q L04 "Schoenhals p. 160 (II and III Columns at half past seven)" derkriegindeuts00schgoog.txt "um halb 8 Uhr die zweite" 160
q L04 "Stutterheim (Hamburg 1806) p. 49 (seven)" 11344011bsb.txt "um 7 Uhr Morgens" 200
q L04 "Mikhailovsky-Danilevsky, Relation (Paris 1846) p. 238 [ia relationdelacam00dangoog] (the French translation's 'huit heures')" relationdelacam00dangoog.txt "à huit heures du matin, les trois premières colonnes" 200
q L05 "Savary t. II pp. 204-205 (about seven; Legrand attacked soon after)" mmoiresduducder04savagoog.txt "commençaient à déboucher sur le général Legrand" 520
q L05 "Stutterheim (Hamburg 1806) pp. 49-50 (hussars between seven and eight)" 11344011bsb.txt "zwiſchen 7 und 8" 200
q L05 "Davout, Correspondance t. I (1885) no. 127 p. 203 [ia correspondanced03davogoog] (about eight, Telnitz vigorously attacked)" correspondanced03davogoog.txt "Pendant cette marche, vers huit heures" 420
q L05 "Kutuzov's relation no. 247 p. 256 (the I Column about eight; registered C1.25, not named in the dispute)" kutuzov1951.txt "около 8 час" 260
q L06 "Davout no. 123 (2 Dec 1805) pp. 192-193 (five o'clock)" correspondanced03davogoog.txt "ce malin, à cinq heures" 160
q L06 "Davout no. 123 p. 193 (continued)" correspondanced03davogoog.txt "s.est mise en marche de ses positions" 260
q L06 "Davout no. 127 (26 Dec 1805) p. 202 (between half past five and six)" correspondanced03davogoog.txt "entre cinq heures et demie et six heures" 200
q L06 "Napoleon's dispositions, Correspondance t. XI (1863) no. 9535 p. 443 [ia correspondancede11napouoft]" correspondancede11napouoft.txt "partira, à cinq heures du matin" 300
q L06 "Thiers, Histoire du Consulat t. VI (1847) [ia histoireduconsul06thieuoft]" histoireduconsul06thieuoft.txt "trente-six lieues qui séparent" 200
q L07 "Stutterheim (Hamburg 1806) p. 52 (about nine, 4,000 men from Raigern, the fog)" 11344011bsb.txt "Gegen 9 \[\[?Uhr|Gegen 9 Uhr erhielt" 320
q L07 "Materialien (Weimar 1806) pp. 109-110, the Moniteur's remarks [ia 10807964bsb]" 10807964bsb.txt "Vers neuf heures, le" 260
q L07 "Schoenhals pp. 159-160 (Friant about nine)" derkriegindeuts00schgoog.txt "Es war ungefähr 9 Uhr" 300
q L07 "Mikhailovsky-Danilevsky (Paris 1846) pp. 240-241 (Davout after Telnitz had fallen)" relationdelacam00dangoog.txt "Davoust déboucha de Raygern" 360
q L08 "Davout no. 127 pp. 203-204 (Telnitz at half past nine)" correspondanced03davogoog.txt "neuf heures et demie" 300
q L08 "Davout no. 127 p. 204 (the 26e Legere in the fog)" correspondanced03davogoog.txt "le brouillard ne lui permettant pas" 360
q L09 "Davout no. 127 p. 203 (Sokolnitz not yet attacked about eight)" correspondanced03davogoog.txt "n.était pas encore attaqué" 160
q L09 "Przybyszewski's report, Kutuzov documents p. 270 (eight until four)" kutuzov1951.txt "от осьми час" 200
q L09 "Mikhailovsky-Danilevsky (Paris 1846) p. 248 (Langeron at half past eight)" relationdelacam00dangoog.txt "huit heures et demie, lorsque" 300
q L09 "Schoenhals p. 160 (the heights already attacked when the III Column appeared at Sokolnitz)" derkriegindeuts00schgoog.txt "bereits angegriffen waren, als die Spitze" 200
q L10 "Mikhailovsky-Danilevsky (Paris 1846) p. 241 (Kamensky on his own, citing Langeron's report)" relationdelacam00dangoog.txt "pr.?.?vint La.igeron|prévint Langeron" 420
q L10 "Schoenhals p. 161 (Langeron sent the brigade)" derkriegindeuts00schgoog.txt "Langeron, der des Feindes" 300
q L10 "Kutuzov's relation no. 247 pp. 257-258 (Kutuzov ordered Kamensky onto the ridge)" kutuzov1951.txt "приказал я генерал-майору графу" 300
q L10 "Stutterheim (Hamburg 1806) pp. 64-65 (the two regiments on the commander-in-chief's order)" 11344011bsb.txt "auf Befehl des General en Chef" 360
q L10 "NEW: Buxhowden's letter to Kutuzov no. 250 (21 Jan 1806), Kutuzov documents p. 262 (Langeron sent Kamensky back; also read on the page image n290)" kutuzov1951.txt "послав назад" 420
q L11 "Thiebault t. III p. 504 (Kamensky's brigade still entire on the heights at half past eight)" mmoires03thieuoft.txt "la brigade Kamenski" 260
q L11 "Stutterheim (Hamburg 1806) p. 63 (Kamensky's brigade showing a front on the height; no hour)" 11344011bsb.txt "Es war die Brigade des General" 300
q L12 "Stutterheim (Hamburg 1806) pp. 63-64 (Alexander orders the 4th Column's battalions forward; Kollowrath ordered to hold the left)" 11344011bsb.txt "befahl feinen Bataillonen vorzuruͤcken" 360
q L12 "Mikhailovsky-Danilevsky (Paris 1846) p. 241 (Kutuzov rides to the left wing of the 4th Column)" relationdelacam00dangoog.txt "se rendit à l.ail" 300
q L13 "Segur t. II p. 467 (towards eleven)" histoireetmmoir06sggoog.txt "Vers onze heures tout avait réussi" 200
q L13 "Stutterheim (Hamburg 1806) p. 67 (about two hours)" 11344011bsb.txt "dauerte ung" 200
q L13 "Schoenhals p. 163 (about two hours)" derkriegindeuts00schgoog.txt "hatte dieses Gefecht gew" 220
q L14 "Stutterheim (Hamburg 1806) p. 56 (the Guard jager battalion into Blasowitz)" 11344011bsb.txt "zur beſtimmten Stunde die Anhoͤhen vor" 420
q L14 "Schoenhals pp. 163-164 (the Guard jagers occupy Blasowitz; thrown out)" derkriegindeuts00schgoog.txt "das Garde-Jäger-Bataillon, welches" 300
q L14 "Mikhailovsky-Danilevsky (Paris 1846) pp. 256-257 (the Guard chasseurs into Blasowitz)" relationdelacam00dangoog.txt "chasseurs de la garde, sous le commandement" 300
q L15 "Materialien (Weimar 1806) p. 118 (the only trophy of the day)" 10807964bsb.txt "die einzige Troph" 300
q L15 "Rapp, Memoires (1823) pp. 60-61 (already one o'clock)" mmoiresdugnralr00rappgoog.txt "Il était déjà une heure" 260
q L15 "Segur t. II p. 468 (il etait une heure)" histoireetmmoir06sggoog.txt "ce fut le moment critique" 300
q L15 "Schoenhals pp. 165-166 (toward noon, the Guards given way)" derkriegindeuts00schgoog.txt "gegen Mittag, nachdem die Höhen" 260
q L16 "30th Bulletin, Correspondance t. XI no. 9541 p. 452 (Rapp took Repnin)" correspondancede11napouoft.txt "a pris le prince Repnin" 300
q L16 "Rapp pp. 61-62 (Repnin in our hands)" mmoiresdugnralr00rappgoog.txt "lé prince Repnin|le prince Repnin" 200
q L16 "30th Bulletin p. 451 (the victory decided at one)" correspondancede11napouoft.txt "A une heure après midi la victoire" 160
q L17 "Stutterheim (Hamburg 1806) p. 58 (Bagration advanced from the Posoritz post house; Krug and Holubitz held)" 11344011bsb.txt "Peſorſitzer" 360
q L17 "Schoenhals p. 165 (Holubitz and Kruch held by three battalions of the 6th Jager under Ulanius)" derkriegindeuts00schgoog.txt "durch 3 Bataillone des 6. J" 300
q L17 "Stutterheim (Hamburg 1806) p. 70 (from the Posoritz post house forward)" 11344011bsb.txt "Poforfi ber|Posorsitzer-Posthause" 260
q L18 "30th Bulletin pp. 451-452 (twenty guns; 20,000 drowned)" correspondancede11napouoft.txt "tel qu.on l.avait vu à Aboukir" 330
q L18 "Schoenhals p. 169 (the light battery, holes in the ice, few; half past two)" derkriegindeuts00schgoog.txt "Um halb 3 Uhr Nach" 600
q L18 "Schoenhals pp. 169-170 (a French exaggeration; the Telnitz priest's 60 to at most 100)" derkriegindeuts00schgoog.txt "Ertrinken so vieler Russen" 360
q L18 "Thiebault t. III pp. 465-466 (wounded about three; half an hour of fire; three to four thousand; 24 Guard guns)" mmoires03thieuoft.txt "vers trois heures du soir j.avais été blessé" 200
q L18 "Thiebault t. III p. 466 (continued)" mmoires03thieuoft.txt "trois à quatre mille" 300
q L18 "Stutterheim (Hamburg 1806) p. 79 (the dam passed; about four, night falling)" 11344011bsb.txt "Es war jetzt ungefahr 4" 200
q L19 "Schoenhals p. 157 (the disposition: past the castle of Sokolnitz)" derkriegindeuts00schgoog.txt "die dritte an dem Schlo" 200
q L19 "Mikhailovsky-Danilevsky (Paris 1846) p. 248 (the castle occupied by the French)" relationdelacam00dangoog.txt "le château, près duquel passait la route" 200
q L19 "Przybyszewski's report p. 269 (through the castle)" kutuzov1951.txt "прошел сквозь замок" 200
q L20 "Schoenhals p. 166 (Bagration's retreat about six)" derkriegindeuts00schgoog.txt "Abends gegen 6 Uhr" 200
q L20 "Stutterheim (Hamburg 1806) p. 72 (Bagration behind Austerlitz at six)" 11344011bsb.txt "um 6 Uhr Abends" 200
echo
echo "=== negative search: the Sokolnitz pheasantry in the 19 period texts (counts of faisander|fasaner|Fasangarten|pheasantr|фазан)"
for f in "$DL"/*.txt; do printf '%s %s\n' "$(basename "$f")" "$(grep -c -i 'faisander\|fasaner\|Fasangarten\|pheasantr\|фазан' "$f")"; done
