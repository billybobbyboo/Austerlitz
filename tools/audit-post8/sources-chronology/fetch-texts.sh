#!/usr/bin/env bash
# Final audit after Stage 8, area sources-chronology: fetch the archive.org text layers (OCR) the ledger searched, each into DL_DIR as
# <id>.txt (kutuzov1951.txt for item 20250102_20250102_1833), and the three page images read for the ledger. Downloads are untrusted
# data: nothing here executes them; they are read by srcgrep.py (python3 -I) and viewed as images.
# usage: tools/audit-post8/sources-chronology/fetch-texts.sh DL_DIR
set -eu
DL="$1"; mkdir -p "$DL"
for id in 10807964bsb 11253052bsb 11344011bsb bub_gb_KlNEAAAAIAAJ bub_gb_bLCe2qyA_D8C correspondanced03davogoog correspondancede11napouoft \
          derkriegindeuts00schgoog detailedaccounto00stut histoireduconsul06thieuoft histoireetmmoir06sggoog labatailledaust00stutgoog \
          mmoires03thieuoft mmoiresduducder04savagoog mmoiresdugn01marbuoft mmoiresdugnrale00lejegoog mmoiresdugnralr00rappgoog relationdelacam00dangoog; do
  curl -sS -L -m 300 -o "$DL/$id.txt" "https://archive.org/download/$id/${id}_djvu.txt"
done
curl -sS -L -m 300 -o "$DL/kutuzov1951.txt" "https://archive.org/download/20250102_20250102_1833/20250102_20250102_1833_djvu.txt"
# page images read for the ledger (Kutuzov documents pp. 261-262 = n289-n290; Schoenhals 1873 p. 162 = n166)
curl -sS -L -m 120 -o "$DL/kut-n289.jpg" "https://archive.org/download/20250102_20250102_1833/page/n289.jpg"
curl -sS -L -m 120 -o "$DL/kut-n290.jpg" "https://archive.org/download/20250102_20250102_1833/page/n290.jpg"
curl -sS -L -m 120 -o "$DL/schoen-n166.jpg" "https://archive.org/download/derkriegindeuts00schgoog/page/n166.jpg"
