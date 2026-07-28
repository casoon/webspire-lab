---
name: design-directions-lab
description: Baut Phase 4 und 5: fünf bewusst unterschiedliche Designrichtungen als Lab-Seiten, danach drei Untervarianten der gewählten Richtung plus Vergleichsseite. Nutzen, wenn ein Brief mit Gestaltungsrahmen steht und Entwürfe zum Vergleichen entstehen sollen. NICHT für Briefing und Rahmen (→ [[design-brief]]), nicht für Produktionsseiten (→ [[landing-and-site-builder]]).
---

# Designrichtungen im Lab

Ein Verfahren, das Auswahl erzwingt: fünf Entwürfe nebeneinander, dann eine Richtung und drei
Untervarianten davon — statt einem Entwurf, der allein betrachtet überzeugt.

## Gotcha zuerst

Alle Varianten zeigen **denselben Inhalt** und **dieselben CTAs**. Wer nebenbei die Texte
ändert, vergleicht Texte statt Design und trifft die Entscheidung auf falscher Grundlage. Die
Variante mit dem schärferen Hero-Satz gewinnt jedes Mal, egal wie sie gestaltet ist. Copy einmal
aus dem Brief ziehen und in allen fünf Richtungen wortgleich einsetzen.

## Voraussetzung

`lab.config/projects/<projekt>.json` existiert und `designFrame` (Gestaltungsrahmen, Phase 3) ist ausgefüllt.
Fehlt das, nicht anfangen, sondern → [[design-brief]]. Ohne Rahmen endet der Vergleich in Geschmack.

## Dateilayout

```
src/pages/lab/<projekt>/richtungen/<nn>-<slug>.astro   01-…, 02-… ; Bare.astro
src/pages/lab/<projekt>/index.astro                    Vergleichsseite ; Lab.astro
```
Läufe und Richtungen werden per Glob gefunden. Nichts in eine Liste eintragen.

## Token-Konvention

Eine Richtung überschreibt Schicht-1-Tokens, erfindet keine neuen Variablennamen und setzt keine
Farben im Markup. Sonst greifen die Achsen nicht und der Entwurf ist im Katalog unbrauchbar.

```astro
<style is:global>
  :root {
    --ds-accent-h: 32;
    --ds-accent-c-base: 0.14;
    --ds-bg: oklch(21% 0.012 250);
    --ds-font-head: 'Fraunces', var(--ds-font-serif);
    --ds-radius: 0;
  }
</style>
```

Im Markup nur Bridge-Utilities (`bg-surface`, `text-h1`, `rounded-ds`, `container-ds`, `measure`,
`section-y`) oder `var(--ds-*)`. Keine Hex-Werte, keine Pixel-Radien, keine Abstands-Literale.

## Umfang pro Richtung

Hero + **ein** exemplarischer Inhaltsabschnitt + Footer-Zeile. Keine vollständige Seite. Fünf halbe
Seiten sind vergleichbar; fünf ganze sind nicht bezahlbar und werden doch nur am Hero beurteilt.

## Phase 4 — fünf Richtungen, die sich wirklich unterscheiden

| Achse | Frage |
|-------|-------|
| Markenwirkung | streng, warm, technisch, handwerklich, laut |
| Typografie-Stimme | welche Schriftklasse trägt, wie laut das Display ist |
| Raster / Symmetrie | zentriert, asymmetrisch, gesplittet, versetzt |
| Flächenlogik | Karten, Vollflächen, Linien, gar keine Container |
| Inhaltsdichte | wenige große Blöcke gegen dichten Satzspiegel |
| Bildanteil | bildgetrieben bis rein typografisch |

**Regel:** Jede Richtung unterscheidet sich von jeder anderen in **mindestens drei** dieser sechs.
Zwei Unterschiede sind eine Farbvariante, kein eigener Entwurf (`JUDGE-SAME-SHAPE`).
Taxonomie → [[design-directions]]. Ausführung, Schriftpaarungen, absolute Verbote → [[frontend-design]].

**Pflicht vor dem ersten Code:** jede der fünf in zwei Sätzen benennen — was sie ist, und was sie
riskiert. Das Risiko ist der wichtigere Satz; eine Richtung ohne benanntes Risiko ist der Default.

```
02 Werkstatt — Dunkler Grund, schmaler Satzspiegel, Preis und Ablauf früh im Blick.
   Risiko: kippt bei zu viel Akzentfläche in Cluster (b), Near-Black mit grellem Akzent.
```

Erst wenn die fünf Beschreibungen nebeneinander liegen und sich unterscheiden, wird gebaut.

## Phase 5 — drei Untervarianten

**Nicht** fünf neue Designs. Die Richtung steht, jetzt wird sie verfeinert.

Konstant: Farbwelt, Grundtypografie, Bildsprache, Markencharakter.
Variiert: Aufbau des Inhaltsbereichs, Position des primären CTA, Abschnittsrhythmus, Verhältnis von
Bild zu Text, Raster.

Gleiches Dateilayout, fortlaufende Nummern (`06-…`, `07-…`, `08-…`). Verworfene Richtungen bleiben
liegen — sie sind die Begründung der Entscheidung.

## Vergleichsseite

`Lab.astro`, darin `AxisBar`, darunter `CompareGrid`. Jedes Item bekommt einen `note`-Satz, der
sagt, **worin** sich diese Variante von den anderen unterscheidet, nicht was sie schön macht.
Darunter die Bewertungskriterien aus dem Brief (Ziel, CTAs, Zielgruppe, „was es nicht
werden soll").

## Nach dem Bauen

```
pnpm build          # muss durchlaufen
pnpm test:e2e       # die maschinell prüfbaren SLOP-Regeln
```
Danach → [[slop-review]] für die `JUDGE-*`-Regeln, die kein Test findet. Entscheidung und
Verworfenes zurück in den Brief, Teil 3. Im Frontmatter `status` aktualisieren
(`directions` → `refining` → `decided`) und `chosenDirection` setzen.
Referenz-Implementierung, falls vorhanden: `src/pages/lab/beispiel-nordwerk/`.

## Gotchas

- Keine externen Bild-URLs, kein picsum, keine Stockfotos. Bildflächen sind beschriftete
  Platzhalter mit sichtbarem Text, was dort später stünde (`JUDGE-STOCK`).
- Kein Client-JS in Richtungsseiten. Das Lab-Chrome darf welches haben, ein Entwurf nicht.
- Nicht in den drei KI-Clustern landen (`JUDGE-CLUSTER`): Cream + Serif + Terracotta;
  Near-Black + Acid-Green; Broadsheet mit Haarlinien und radius 0. Fordert der Brief den Look
  ausdrücklich, ist er in Ordnung — sonst ist er der Default, der wie eine Wahl aussieht.
- Genau ein `<h1>` je Richtungsseite, lückenlose Überschriftenhierarchie.
- Kontrast prüfen, bevor eine Farbwelt verteidigt wird. Eine Palette, die 4.5:1 reißt, ist keine
  mutige Entscheidung, sondern eine, die nochmal gemacht werden muss.
