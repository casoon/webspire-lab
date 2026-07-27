---
title: 'Leistungsvergleich'
summary: 'Datentabelle mit Caption, Spalten- und Zeilenköpfen, Tabellenziffern und einem Scroll-Container, der per Tastatur erreichbar ist.'
family: table
direction:
  - corporate
  - content-first
axes:
  heading: sans
  width: normal
  density: balanced
  accent: quiet
  corner: soft
  motion: none
origin: eigen
a11yChecked: true
jsWeight: 0
updated: 2026-07-27
draft: false
---

## Wofür

Vergleich von drei bis fünf Angeboten oder Varianten über eine feste Menge an Merkmalen. Zahlen
stehen rechtsbündig und mit Tabellenziffern untereinander, damit Größenordnungen im Überblick
erkennbar bleiben.

Nicht gedacht für Layout, für sortierbare oder filterbare Tabellen und für Datenmengen, die
paginiert werden müssen. Sortierung und Filter brauchen JavaScript und einen anderen Baustein. Für
eine reine Preisdarstellung mit Aktionsbutton je Spalte ist `pricing` der passende Ort.

## Beim Übernehmen beachten

- Zeilen und Spalten sind Beispielinhalte. Beim Ersetzen muss die Kopfzeile mitgeändert werden,
  sonst zeigen `scope="col"` und `scope="row"` auf falsche Bezüge.
- `aria-label` am Scroll-Container muss die Tabelle benennen, nicht generisch "Tabelle" heißen.
  Bei zwei Tabellen auf einer Seite sind zwei unterschiedliche Labels nötig.
- Der Container bekommt `tabindex="0"` nur, weil er scrollbar ist. Wenn im Zielprojekt kein
  Überlauf entstehen kann, entfallen `tabindex`, `role` und `aria-label` zusammen, sonst steht ein
  Fokusstopp ohne Funktion im Weg.
- `whitespace-nowrap` erzwingt den Überlauf statt Umbruch in den Zellen. Bei langen Fließtexten in
  Zellen ist das die falsche Wahl und muss raus.
- Zahlenformat ist deutsch, mit Punkt als Tausendertrenner. Bei mehrsprachigen Projekten pro
  Sprache formatieren.
- Kein Umbau zu Karten auf schmalen Viewports. Sobald Spalten zu gestapelten Blöcken werden, ist
  der Vergleich weg, um den es hier geht.
- Angaben wie Preise und Reaktionszeiten sind rechtlich relevant. Der Stand in der Caption muss
  gepflegt werden.

## Geprüft

Gegen den gebauten Stand unter `/vorschau/table/leistungsvergleich/` in Chromium:

- axe-core, Regelsatz WCAG 2.0/2.1/2.2 Level A und AA: keine Verstöße.
- Tabellenstruktur: eine `<caption>`, vier `<th scope="col">` im `<thead>`, sechs Datenzeilen mit
  jeweils einem `<th scope="row">` als erster Zelle. Keine leere Kopfzelle, keine verbundenen
  Zellen.
- Bei 360 px Viewportbreite läuft die Tabelle tatsächlich über: 838 px Inhalt in 310 px Container.
  Der Scroll-Container ist dort der einzige Tabstopp, hat einen sichtbaren Fokus und scrollt mit
  den Pfeiltasten, gemessen 120 px nach drei Tastendrücken.
- Der Container ist als Region mit `aria-label` ausgezeichnet, wird also von Screenreadern als
  eigener Bereich angesagt.
- Zellen rendern mit `font-variant-numeric: tabular-nums`, Ziffern stehen spaltenweise
  untereinander.
- Kontrast im Standard-Tokensatz: Zellinhalt und Zeilenköpfe 16,1:1, Spaltenköpfe auf `surface`
  15,1:1, Caption und Einleitung 6,6:1. Die Trennlinien liegen bei 1,35:1 und sind rein dekorativ,
  die Tabellenstruktur hängt nicht an ihnen.
- Keine Übergänge und keine Animationen im gerenderten Baum, damit auch nichts auf
  `prefers-reduced-motion` reagieren muss.

Offen bleibt der Kontrast unter einer konkreten Designrichtung. Der Baustein setzt keine eigenen
Farben, also entscheidet der Tokensatz der Richtung darüber, und der muss dort geprüft werden.
