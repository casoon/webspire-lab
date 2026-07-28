---
title: 'Nordwerk Fensterbau'
client: 'Nordwerk Fensterbau GmbH'
goal: 'Qualifizierte Anfragen für ein Vor-Ort-Aufmaß im Altbau erzeugen, statt allgemeine Kontaktanfragen einzusammeln.'
primaryAction: 'Aufmaß-Termin anfragen'
audience: 'Altbaubesitzer zwischen 45 und 70 Jahren im Nordwesten sowie Hausverwaltungen mit Mehrfamilienhäusern aus der Zeit vor 1940.'
status: 'directions'
updated: 2026-07-27
constraints:
  - 'Kein Online-Shop, keine Preisangaben, kein Konfigurator.'
  - 'Keine Stockfotos. Bildflächen bleiben bis zum Fototermin beschriftete Platzhalter.'
  - 'Kein Client-JS. Die Seite muss ohne JavaScript vollständig bedienbar sein.'
  - 'Handwerkssprache mit konkreten Materialien und Maßen, keine Agenturfloskeln.'
  - 'Text mindestens 4.5:1, große Schrift mindestens 3:1. Fokus bleibt sichtbar.'
---

## Briefing

**Betrieb.** Nordwerk Fensterbau ist ein Tischlerei-Meisterbetrieb in Oldenburg mit sieben
Mitarbeitern, davon zwei Gesellen im Außendienst. Arbeitsschwerpunkt ist die Instandsetzung
von Kastendoppelfenstern, Sprossenfenstern und Haustüren aus Kiefer, Eiche und Lärche. Neubau
und Kunststoff macht der Betrieb nicht.

**Ziel der Seite.** Qualifizierte Anfragen für ein Vor-Ort-Aufmaß. Qualifiziert heißt: der
Anfragende weiß vorher, dass ein Termin 45 bis 90 Minuten dauert, dass Holz aufgestochen wird
und dass das Angebot je Fenster kalkuliert wird. Wer das nicht will, soll nicht anfragen.

**Primäre Aktion.** Aufmaß-Termin anfragen. Sekundär der Rückruf über die Werkstattnummer,
weil ein Teil der Zielgruppe lieber telefoniert als Formulare ausfüllt.

**Zielgruppe.**

- Altbaubesitzer, 45 bis 70, meist selbst bewohnend, oft mit Denkmalauflage oder Erhaltungssatzung
  im Hinterkopf. Entscheiden langsam, vergleichen zwei bis drei Betriebe, misstrauen Werbesprache.
- Hausverwaltungen mit Mehrfamilienhäusern. Brauchen Positionen nach Wohneinheit und einen
  belastbaren Terminrahmen, nicht Gestaltung.

**Was die Seite nicht leisten muss.** Verkaufen. Der Abschluss passiert vor Ort am Fenster.
Die Seite muss nur so weit tragen, dass jemand den Aufwand eines Aufmaßes akzeptiert.

**Wettbewerbsumfeld.** Regionale Fensterbauer treten fast durchgehend mit Herstellerbildern,
Energieeffizienz-Grafiken und austauschbaren Sanierungsversprechen auf. Der Unterschied von
Nordwerk liegt im Verfahren, nicht in der Behauptung. Das gehört in die Gestaltung, nicht in
Adjektive.

**Inhaltlicher Kern für den Vergleich.** Alle Richtungen zeigen denselben Ausschnitt: Hero mit
Überschrift, Einordnung, primärer und sekundärer Aktion, dazu einen Inhaltsabschnitt zum Ablauf
des Aufmaßes mit vier Schritten und eine Fußzeile. Mehr nicht. Was sich unterscheidet, ist
ausschließlich die Gestaltung.

## Gestaltungsrahmen

### Ästhetische Richtung

Werkstatt, nicht Showroom. Die Seite soll aussehen, als hätte sie jemand geführt, der Maße
notiert, nicht jemand, der Stimmung erzeugt. Konkret heißt das: sichtbare Ordnung, klare
Beschriftung, ruhige Flächen. Zulässige Leitrichtungen für die Varianten sind `content-first`,
`minimal` und `editorial`. Ausgeschlossen sind `premium` und `bold-branding`, weil beide dem
Betrieb eine Preislage andichten, die er nicht bedient.

### Typografie

Eine Familie pro Richtung, maximal zwei. Überschriften dürfen technisch (Mono), sachlich
(Grotesk) oder buchmäßig (Serif) sprechen. Der Fließtext bleibt in jeder Richtung auf 65 bis
75 Zeichen Zeilenmaß. Display-Grade enden bei 6rem, die Laufweite geht nicht unter -0.04em.
Keine Schriftmischung, die man erklären muss.

### Farbe

Der Hintergrund ist nie cremefarben und nie beige. Zulässig sind kühle Neutraltöne
(Farbton 200 bis 260), gedeckte Grünwerte (Farbton 140 bis 170) und ein dunkler Grund als
eigenständige Variante. Der Akzent trägt genau eine Aufgabe: die primäre Aktion. Farbige
Randstreifen als Dekoration sind ausgeschlossen. Die Akzentfläche bleibt unter zehn Prozent.

### Layout

Drei unterschiedliche Raster, nicht drei Varianten desselben Rasters:

1. dichtes zweispaltiges Register mit gefüllten Kacheln,
2. einspaltig, sehr luftig, große Grade, keine Rahmen,
3. asymmetrischer Split mit stehender Bildfläche und Zeilen statt Karten.

Radien bleiben unter 24px. Ein Element bekommt entweder Rahmen oder Schatten, nie beides.

### Bildsprache

Dokumentarisch, aus der eigenen Werkstatt und von eigenen Baustellen: geöffneter Flügel im
Kastenfenster, Anschäftung in Lärche, Messingband nach dem Aufarbeiten, Leinölkitt. Keine
Menschen mit Bauhelm, keine Hersteller-Renderings. Bis zum Fototermin stehen beschriftete
Platzhalterflächen, die benennen, was dort später zu sehen ist.

### Bewegung

Bewegung ist optional und nie tragend. Zulässig sind Zustandswechsel bei Fokus und Hover
innerhalb von 220ms. Eine Richtung verzichtet bewusst vollständig auf Bewegung, damit im
Vergleich sichtbar wird, ob sie überhaupt etwas beiträgt. Scroll-Effekte sind ausgeschlossen.

## Richtungen

| Slug | Kurzform |
| --- | --- |
| `01-werkverzeichnis` | Dichtes Register, Mono-Überschriften, kühles Hellgrau-Blau |
| `02-aufmass` | Dunkler Grund, sehr große Grotesk, einspaltig und luftig |
| `03-bestand` | Gedecktes Salbeigrün, Serifen-Überschriften, asymmetrischer Split |

Vergleich unter `/lab/nordwerk/`.

> Dieser Lauf ist die Referenz-Implementierung für die Struktur eines Lab-Laufs und zeigt
> deshalb nur drei Richtungen. Phase 4 verlangt fünf. Wer hier abschaut, schaut die
> Dateistruktur, die Token-Konvention und den gleichbleibenden Inhalt ab, nicht die Anzahl.
