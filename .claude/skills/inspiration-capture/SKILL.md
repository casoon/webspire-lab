---
name: inspiration-capture
description: Nimmt eine Referenz (URL, Screenshot oder Beschreibung) als verschlagworteten Eintrag in die Inspirationsbibliothek unter design/references/ auf. Nutzen, wenn in Phase 2 Referenzen gesammelt oder ein Fundstück festgehalten werden soll. NICHT für die Wahl der Leitrichtung (→ [[design-directions]]) oder das Bauen von Varianten (→ [[design-directions-lab]]).
---
# Inspiration aufnehmen

Macht aus „sieht gut aus" einen benennbaren, vergleichbaren Eintrag in `design/references/<slug>.md`.

## Gotcha zuerst

Der Eintrag ist nur so viel wert wie sein `takeaway`. Urteil („starkes Design") und Nachbau-Anweisung
(„so einen Hero bauen") sind beide wertlos — das erste sagt nichts, das zweite erzeugt Kopien. Gefragt
ist die **Eigenschaft**, die sich unabhängig von dieser Seite übernehmen lässt.

## Ablauf

1. **Quelle klären.** Bei URL: Seite mit WebFetch abrufen, Merkmale aus echtem Markup und CSS ableiten
   statt aus der Erinnerung. Nicht erreichbar (Login, JS-only, 403)? Im Eintrag vermerken, nicht erfinden.
2. **Bei `sourceType: shot` nachfragen**, ob es eine reale Umsetzung gibt, und die stattdessen erfassen.
   Dribbble und Pinterest zeigen Präsentationsdesigns: keine Fehlerzustände, keine Formulare, oft nicht
   barrierefrei umsetzbar. Der Live-Anteil ist auf `/referenzen/` sichtbar und sollte die Mehrheit sein.
3. **Screenshot** nach `design/references/screenshots/<slug>.<ext>`, Dateiname = Slug.
4. **Verschlagworten** und **Deckung prüfen** (unten), dann Datei aus `_TEMPLATE.md` anlegen. Slug kurz: `basecamp-pricing`.

## Frontmatter

```yaml
title: 'Basecamp — Preisseite'
sourceType: live-site       # live-site | shot | print | app | other
url: 'https://…'            # optional, muss gültige URL sein
captured: 2026-07-27
direction:                  # 1–2 Werte, nicht mehr
  - conversion              # editorial | corporate | premium | bold-branding | minimal
  - content-first           # tech | storytelling | conversion | content-first | brand-first
typeVoice: sans-neutral     # serif-display | sans-neutral | grotesk-bold | mono | mixed
layout: single-column       # grid-12 | asymmetric | single-column | split | broadsheet | canvas
surface: bordered           # flat | bordered | cards | layered | full-bleed
takeaway: '…'               # mind. 20 Zeichen
screenshot: 'basecamp-pricing.webp'
covers:                     # hero | nav | section | feature | pricing | faq
  - pricing                 # form | table | footer | empty-state | error | cookie
  - table
```

## Verschlagworten

**`direction`** — nicht „welcher Stil", sondern: wofür ist die Seite offensichtlich optimiert?
Verkaufen → `conversion`. Lesen → `content-first` oder `editorial`. Wiedererkennung vor Information
→ `brand-first` oder `bold-branding`. Wer drei Werte braucht, hat sich nicht entschieden.

**`typeVoice`** — nur die Überschrift ansehen. Serifen mit starkem Strichkontrast → `serif-display`,
neutrale Sans in normalem Gewicht → `sans-neutral`, fette enge Grotesk die selbst als Bild wirkt →
`grotesk-bold`, Monospace als Charakter → `mono`, Überschrift und Fließtext aus zwei Welten → `mixed`.

**`layout`** — gedanklich Linien an die Textkanten legen. Kanten treffen ein sichtbares Spaltenraster →
`grid-12`, Raster erkennbar aber ungleich gefüllt → `asymmetric`, eine Spalte durchgehend →
`single-column`, zwei durchlaufende Hälften → `split`, mehrspaltiger Textsatz → `broadsheet`, freie
Positionierung ohne Spalte → `canvas`.

**`surface`** — Woran erkennt man, wo ein Block aufhört? Nur Abstand → `flat`, Linien → `bordered`,
abgesetzte Kacheln → `cards`, Überlappung und Schatten → `layered`, randlose Farbflächen → `full-bleed`.

**Farbstrategie, Dichte, Bewegung** haben kein Feld — sie gehören in „Was auffällt". Farbe: Nicht-Grau-Töne
zählen, notieren wofür der Akzent reserviert ist. Dichte: wie viel Inhalt in eine Bildschirmhöhe passt.
Bewegung: einmal scrollen und notieren, was sich bewegt, das nicht der Scroll ist.

## takeaway: Eigenschaft, kein Urteil

| schlecht | gut |
|---|---|
| „Sehr klares, modernes Design." | „Fließtext bleibt bei ~62 Zeichen, während Bildflächen randlos laufen — die Spannung kommt aus dem Breitenunterschied, nicht aus Farbe." |
| „Hero mit großem Bild und Button rechts nachbauen." | „Der primäre CTA erscheint erst nach dem zweiten Abschnitt; davor steht eine einzige Zeile, die den Nutzen benennt." |
| „Tolle Typografie." | „Nur zwei Schriftgrade im Inhaltsbereich; Hierarchie entsteht aus Abstand und Gewicht." |

Test: Lässt sich der Satz auf eine andere Branche anwenden? Wenn nein, klebt er an der Vorlage.

## Deckung und Negatives

Vor dem Speichern die Deckungsanzeige auf `/referenzen/` prüfen und gezielt nach dem fragen, was fehlt.
Wichtigste Lücken: `form`, `table`, `nav`, `error`, `empty-state`, `cookie` — dort scheitern generierte
Designs, und dort sammelt niemand freiwillig. Eine Bibliothek nur aus Heros ist wertlos.
„Was nicht funktioniert" ist ebenso Pflichtteil: zu niedriger Kontrast, unbedienbares Formular,
scroll-kapernde Animation. Was nicht notiert wird, wandert in die eigene Arbeit.

## Gotchas

- Vokabular geschlossen: keine Freitext-Tags erfinden, das Schema lehnt sie beim Build ab.
- Nicht mehr als zwei `direction`-Werte, auch wenn drei zu passen scheinen.
- Dateien mit Unterstrich werden nicht geladen (`_TEMPLATE.md` bleibt so).
- Unter 15 Einträgen trägt die Bibliothek keine Entscheidung. Ziel für Phase 2: 15–30.
