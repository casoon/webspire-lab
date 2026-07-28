# Achsen

Sechs Stellschrauben. Definition: `src/styles/tokens.css`, ausprobieren: `/achsen/`.

## Warum Stufen und keine Regler

Ein freier Schieberegler für jeden Pixelwert erzeugt Entwürfe, die sich nicht mehr in Tokens
zurückführen lassen. Man justiert vier Werte von Hand, findet es besser, und hat anschließend
kein System, sondern eine Sammlung Einzelfälle.

Sechs Achsen mit drei bis vier Stufen erzeugen 972 Kombinationen — genug, um eine Richtung
wirklich zu variieren, und jede davon ist ein sauberes Token-Set, das ins Produktionsprojekt umziehen kann.

## Die Achsen

| Attribut | Stufen | Was sich ändert |
|----------|--------|-----------------|
| `data-ds-heading` | sans · serif · display · mono | `--ds-font-head`, Laufweite, Schriftschnitt |
| `data-ds-width` | compact · normal · wide | `--ds-container`, `--ds-measure` |
| `data-ds-density` | tight · balanced · airy | `--spacing`, `--ds-section-y`, Zeilenhöhe, Gutter |
| `data-ds-accent` | quiet · normal · strong | Chroma des Akzents (nicht Fläche) |
| `data-ds-corner` | square · soft · round | `--ds-radius`, `--ds-radius-lg`, Pill |
| `data-ds-motion` | none · subtle · expressive | Dauern und Bewegungsweg |

Die Attribute wirken auf jedem Container, nicht nur auf `<html>`. Damit lassen sich zwei
Einstellungen direkt nebeneinander stellen.

## Drei Dinge, die man wissen muss

**Dichte dreht an `--spacing`.** Das ist Tailwinds Multiplikator: `p-8` ist
`calc(var(--spacing) * 8)`. Eine Änderung skaliert deshalb das gesamte Layout konsistent statt
einzelne Abstände zu verschieben. Genau deshalb dürfen Abstände nicht als Literale im Markup
stehen.

**Akzentstärke regelt Sättigung, nicht Fläche.** Der Akzent liegt in OKLCH-Einzelkomponenten
(`--ds-accent-l/-c/-h`), die Achse skaliert nur die Chroma. Farbton und Helligkeit bleiben
stabil, der Kontrast kippt nicht. Die 10-%-Flächenregel (`JUDGE-ACCENT-AREA`) gilt unabhängig davon.

**`motion: none` schaltet ab, es verlangsamt nicht.** Und `prefers-reduced-motion` schlägt
jede Achseneinstellung — die Media Query steht bewusst nach den Achsen im Stylesheet.

## Reihenfolge

```
:root                    Basis (charakterlos, absichtlich)        0,1,0
  ↓ überschrieben von
:root in der Richtung    <style is:global> auf der Richtungsseite  0,1,0, aber später im Dokument
  ↓ überschrieben von
[data-ds-x][data-ds-x]   Achsen                                    0,2,0
  ↓ gelesen von
@theme inline            Tailwind-Utilities
```

Zwei Dinge, an denen dieses Setup sonst scheitert:

**Die Achsen nennen ihr Attribut doppelt.** Astro hängt den `<style is:global>`-Block einer
Seite nach `app.css` ein. Bei gleicher Spezifität gewinnt der spätere Block, eine Richtung würde
also jede Achse überschreiben. Die Verdopplung hebt die Achsen auf 0,2,0 und macht sie
unabhängig von der Quellreihenfolge. Eine Richtung darf deshalb jedes Token setzen, ohne eine
Achse stillzulegen.

**`@theme inline` ist Pflicht.** Ohne `inline` friert Tailwind die Werte in die Utilities ein
und keine dieser Überschreibungen greift mehr. Das ist der häufigste Fehler bei
Multi-Token-Setups.

## Was hier nicht hingehört

Eine Designrichtung überschreibt Schicht-1-Tokens (`--ds-bg`, `--ds-accent-h`, `--ds-font-head`, …).
Sie erfindet **keine** neuen Variablennamen und setzt keine Farben direkt im Markup. Sonst greifen
die Achsen nicht mehr und der Baustein ist im Katalog unbrauchbar.
