# Verfahren

Der verbindliche Ablauf für Designarbeit in diesem Repo. Wer eine Phase überspringt,
bekommt zuverlässig das statistische Durchschnitts-Internet zurück.

Die zentrale Annahme: **Qualität entsteht durch Auswahl, Vergleich und Iteration, nicht
durch einen besseren Prompt.** Ein Modell hat keinen Geschmack. Es hat Regeln, Referenzen
und die Möglichkeit, mehrere Varianten nebeneinander zu stellen. Alles drei muss aus
diesem Repo kommen.

---

## Die acht Phasen

| # | Phase | Ergebnis liegt in | Skill |
|---|-------|-------------------|-------|
| 1 | Briefing | `lab.config/projects/<projekt>.json` | `/design-brief` |
| 2 | Referenzen sammeln | `design/references/` | `/inspiration-capture` |
| 3 | Gestaltungsrahmen | derselbe Brief, Abschnitt 2 | `/design-brief` |
| 4 | Fünf Richtungen bauen | `src/pages/lab/<projekt>/richtungen/` | `/design-directions-lab` |
| 5 | Eine wählen, drei Untervarianten | dieselbe Struktur | `/design-directions-lab` |
| 6 | Bausteine und Assets | `src/catalog/` | `/design-catalog-entry` |
| 7 | Achsen feinjustieren | `/achsen/` im Lab | — |
| 8 | Technische Prüfung | `e2e/`, Befundliste | `/slop-review` |

---

## Phase 1 — Briefing

Ohne Briefing ist jede Bewertung Geschmackssache. Ein neues Projekt wird lokal unter `/start/`
angelegt; Vorlage und Schema liegen in `lab.config/templates/project.json`.

Pflichtangaben: Produkt, Ziel der Seite, **eine** primäre Aktion, Zielgruppe samt Vorwissen,
Inhalte, technische Basis, Randbedingungen.

Ein Ziel pro Seite. Zwei gleichrangige Ziele sind der häufigste Grund, warum ein Entwurf
später beliebig wirkt.

## Phase 2 — Referenzen sammeln

Ziel: 15–30 Einträge, bevor die erste Richtung entsteht. Darunter trägt die Bibliothek keine
Entscheidung.

Zwei Regeln, die den Unterschied machen:

**Reale Websites schlagen Shots.** Dribbble und Pinterest zeigen Präsentationsdesigns.
Die sind oft nicht implementierbar, nicht barrierefrei und kennen keine Fehlerzustände.
Der Anteil `sourceType: live-site` ist auf `/referenzen/` sichtbar — er sollte die Mehrheit sein.

**Nicht nur Heros sammeln.** Formulare, Tabellen, Navigation, Inhaltsseiten, Fehlermeldungen,
Cookie-Dialoge, Footer, Fokus- und Hover-Zustände, mobile Ansichten. Die Deckungsanzeige auf
`/referenzen/` zeigt, welche Screen-Typen fehlen. Genau dort scheitern generierte Designs.

Jeder Eintrag braucht ein `takeaway`: **welche Eigenschaft** übernommen werden soll.
Nicht "sieht gut aus". Nicht "diese Seite nachbauen".

## Phase 3 — Gestaltungsrahmen

Aus der Bibliothek wird ein kurzer, verbindlicher Rahmen: ästhetische Richtung, Typografie,
Farben, Layout, Bildsprache, Bewegung. Er steht im Feld `designFrame` derselben Projektdatei und
ist ab hier die Messlatte — auch gegen den eigenen späteren Geschmack.

Die Leitrichtung wird bewusst gewählt, nicht geerbt. Taxonomie und Auswahlheuristik:
`[[design-directions]]`.

## Phase 4 — Fünf Richtungen

Noch keine Produktionsseite. Pro Richtung nur Hero plus einen exemplarischen Inhaltsabschnitt.

Bindend:

- Alle Varianten zeigen **denselben Inhalt** und **dieselbe primäre Aktion**. Verändert wird
  ausschließlich die Gestaltung. Sonst vergleicht man Texte statt Design.
- Die fünf müssen sich in Typografie, Raster, Farbwelt und Inhaltsdichte unterscheiden —
  nicht fünf Spielarten desselben Layouts.
- Keine extern generierten Bilder. Bildflächen bleiben beschriftete Platzhalter.
- Gemeinsame Vergleichsseite unter `src/pages/lab/<projekt>/index.astro`.

Der gemeinsame Vergleich ist der eigentliche Mechanismus. Einzeln betrachtet wirkt fast jeder
Entwurf überzeugend.

## Phase 5 — Verfeinern

Nach der Auswahl **keine** fünf neuen Designs. Stattdessen drei Untervarianten, die genau eine
Achse verändern.

Bleibt gleich: Farbwelt, Grundtypografie, Bildsprache, Markencharakter.
Variiert wird: Aufbau des Inhaltsbereichs, Position des primären CTA, Abschnittsrhythmus,
Verhältnis von Bild zu Text, Raster.

## Phase 6 — Bausteine und Assets

Reihenfolge, nicht Auswahl:

1. Eigener Katalog (`src/catalog/`)
2. Kontrollierbare Quellen (shadcn-Registry und Vergleichbares)
3. 21st.dev, Magic UI, React Bits — als **visuelle Vorlage**, nicht als Import
4. Bildgeneratoren nur für Assets, die wirklich individuell sein müssen

Bei jedem fremden Baustein vor der Übernahme: Muss er interaktiv sein? Geht er als statisches
Markup? Wie groß ist das JS? Funktioniert er per Tastatur? Respektiert er `prefers-reduced-motion`?
Ist er serverseitig renderbar? Wie ist er lizenziert?

Für Astro gilt: keine Hydration für einen Button. Eine React-Komponente als Vorlage abzumalen ist
fast immer billiger als sie zu importieren.

## Phase 7 — Achsen

`/achsen/` im Lab. Sechs Stellschrauben statt freier Werte — Begründung in `TOKEN-AXES.md`.

Was hier eingestellt wird, lässt sich als Token-Set übernehmen. Ein per Hand nachjustierter
Entwurf nicht.

## Phase 8 — Technische Prüfung

Getrennte Schleife, nach der visuellen Entscheidung. Nicht vermischen: wer Ästhetik und
Barrierefreiheit gleichzeitig diskutiert, verliert beides.

```
pnpm test:a11y      # axe + Struktur über alle gebauten Routen
pnpm test:e2e       # zusätzlich die maschinell prüfbaren Slop-Regeln
pnpm test:shots     # Screenshots für den visuellen Vergleich
```

`e2e/slop.spec.ts` prüft 22 Regeln im gerenderten Browser: Rahmen und Schatten, Radien,
Zeilenmaß, Zeilenhöhe, Typo-Spanne, Reflex-Schriften, Eyebrow-Häufigkeit, Endlos-Animationen,
Easing-Überschwingen, animierte Layout-Eigenschaften. Alles messbar, alles mit eigener Regel-ID.

Was Tests nicht finden, findet `/slop-review`. Was der nicht findet, findet nur ein Mensch.

---

## Was in welche Datei gehört

| Datei | Inhalt |
|-------|--------|
| `README.md` | dieses Verfahren |
| `ANTI-PATTERNS.md` | Regelkatalog mit IDs, gegen den geprüft wird |
| `TOKEN-AXES.md` | die sechs Achsen und warum es Stufen statt Regler sind |
| `lab.config/templates/project.json` | Vorlage und Schema für Phase 1 und 3 |
| `lab.config/projects/<projekt>.json` | ausgefülltes Briefing je Projekt |
| `references/*.md` | Inspirationsbibliothek |

Barrierefreiheits-Patterns stehen bewusst **nicht** hier, sondern in `[[accessibility-audit]]`.
Dieses Repo dupliziert keine globalen Skills.
