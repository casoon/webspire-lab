---
name: slop-review
description: Prüft einen gebauten Screen am gerenderten Bild gegen den Regelkatalog in `design/ANTI-PATTERNS.md` und liefert eine Befundliste mit Regel-ID, Fundort und Priorität. Nutzen für Phase 8, wenn eine Richtung, Untervariante oder ein Katalogbaustein steht. NICHT für technische Barrierefreiheit (→ [[accessibility-audit]]) oder Textüberarbeitung (→ [[anti-ai-copy]]).
---
# Slop-Review

Phase 8 der Gestaltungsprüfung: aus einem gebauten Screen wird eine zuordenbare Befundliste, kein Bauchgefühl.

## Gotcha zuerst

**Das Urteil entsteht am gerenderten Screen, nicht am Quelltext.** Wer nur die `.astro`-Datei liest, findet
die Hälfte nicht: Flächenanteil des Akzents, tatsächliches Zeilenmaß, ob die primäre Aktion wirklich
auffällt — das steht in keinem Markup, das sieht man erst im Bild.

**Und es entsteht im Vergleich.** Ein einzelner Entwurf wirkt fast immer besser, als er im Nebeneinander
ist. Also die Vergleichsseite des Laufs (`/lab/<projekt>/`) mit ansehen, nicht nur die Einzelroute.

**In diesem Durchgang wird nur befundet, nicht repariert.** Rollentrennung wie in `[[anti-ai-copy]]`:
Wer beim Finden schon umbaut, hört nach dem dritten Fund auf zu suchen. Erst die vollständige Liste,
dann — in einem eigenen Durchgang — die Änderungen.

## Ablauf

1. **Maschinell.** `pnpm test:e2e` — deckt die `SLOP-*`-Regeln ab. Ergebnisse übernehmen, nicht nachbauen.
   Die Meldungen enthalten Regel-ID, Selektor und Messwert und gehen so in die Befundliste.
2. **Screenshots.** `pnpm test:shots`, dann die Bilder **tatsächlich ansehen** — Read auf die PNGs in
   `screenshots/desktop/` und `screenshots/mobile/`. Beide Viewports. Ein Entwurf, der nur im
   Desktop-Bild geprüft wurde, ist nicht geprüft.
3. **`JUDGE-*`-Regeln** aus `design/ANTI-PATTERNS.md` durchgehen, in der Reihenfolge des Katalogs.
   Die Reihenfolge ist die Prüfliste — nicht selektiv das prüfen, was auffällt.
4. **`COPY-*`-Regeln** auf die sichtbaren Texte des Screens anwenden.
5. **Abgleich gegen den Brief** (`lab.config/projects/<projekt>.json`): Hält der Entwurf den Gestaltungsrahmen
   aus `designFrame` ein? Ist die dort benannte Signatur im Bild erkennbar? Ist die primäre Aktion die
   auffälligste Handlung auf dem Screen?
6. **Abschlussfrage** — eigener Schritt, siehe unten.

## Befund-Format

Pro Fund ein Eintrag. Keine Sammelbefunde: drei überrundete Karten sind drei Fundorte, nicht ein
„Radien insgesamt zu weich".

```
[REGEL-ID]  Priorität: hoch | mittel | niedrig
Fundort:    /lab/<projekt>/richtungen/<slug> — section.hero > div.card
            (oder: screenshots/mobile/lab__<projekt>__richtungen__<slug>.png, oberes Drittel)
Sichtbar:   was konkret im Bild zu sehen ist, mit Messwert wenn vorhanden
Wirkung:    was das mit dem Screen macht
Änderung:   ein Satz.
```

Priorität: **hoch** = der Entwurf ist damit als generiert erkennbar oder die primäre Aktion leidet.
**mittel** = Regelverstoß ohne Signalwirkung. **niedrig** = Feinschliff.

## Abschlussfrage (`JUDGE-SLOP-TEST`)

Zuletzt, mit Abstand zu den Einzelbefunden, an den Screenshots:

- Könnte jemand ohne Zögern sagen „das hat eine KI gemacht"?
- Ist die Palette allein aus der Branche erratbar?

Wenn ja, ist das ein Befund, kein Gefühl. Er wird als solcher notiert und benennt, **welche
Entscheidung fehlt** — Schrift, Farbwelt, Abschnittsrhythmus, Signatur. „Wirkt generisch" ist
kein Befund; „keine der sechs Achsen weicht vom Basis-Token-Set ab" ist einer.

## Ausnahmen

Steht die Ausnahme begründet im Brief unter „Bewusste Ausnahmen", ist sie kein Befund — sie wird
im Ergebnis kurz als bekannte Abweichung erwähnt. Nicht dokumentierte Ausnahmen sind Befunde,
auch wenn sie beabsichtigt aussehen.

## Abgrenzung

- Technische Barrierefreiheit: `[[accessibility-audit]]` bzw. `pnpm test:a11y`.
- Textüberarbeitung: `[[anti-ai-copy]]`. Hier werden `COPY-*`-Verstöße nur benannt.
- Performance: `[[web-performance]]`.

Dieser Skill bewertet Gestaltung. Die drei Schleifen nicht vermischen.

## Fremdmaterial

Bausteine aus Pattern-Registries, Komponenten-Bibliotheken oder fremden Design-Skills werden nach
`design/ANTI-PATTERNS.md` bewertet, **nicht** nach den Regeln ihrer Herkunft. Externe Quellen liefern
Material für die Entwicklung, dieser Katalog kontrolliert — bei Widerspruch gewinnt der Katalog.

„Die Registry empfiehlt das" ist kein Gegenargument zu einem Befund und keine dokumentierte Ausnahme.
Wenn ein übernommener Baustein eine Regel verletzt, ist das ein Befund wie jeder andere; die Herkunft
gehört in den Fundort, nicht in die Begründung.

## Gotchas

- **Regeln werden nicht aufgeweicht, weil der Entwurf sie verletzt.** Entweder ändert sich der
  Entwurf, oder die Ausnahme steht begründet im Brief.
- **Die Lab-Oberfläche selbst ist Werkzeug** und wird nicht mitbewertet. Geprüft wird, was unter
  `/vorschau/` und `/lab/*/richtungen/` liegt.
- **Ein grüner Testlauf heißt nicht, dass der Entwurf gut ist.** Die `SLOP-*`-Regeln sind die
  Untergrenze, nicht das Ziel — die interessanten Befunde stehen alle unter `JUDGE-*`.
- **Fünf Varianten mit identischem Abschnittsrhythmus** sind ein Befund am Lauf, nicht an der
  Einzelseite (`JUDGE-SAME-SHAPE`). Er fällt nur auf der Vergleichsseite auf.
