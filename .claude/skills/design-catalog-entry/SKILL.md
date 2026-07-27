---
name: design-catalog-entry
description: Nimmt einen Baustein in den Vorlagen-Katalog auf und legt `src/catalog/<family>/<slug>/entry.md` plus `Preview.astro` an. Nutzen, wenn aus Phase 6 ein wiederverwendbarer, geprüfter Baustein werden soll. NICHT für Richtungen und Untervarianten, die im Lab bleiben (→ [[design-directions-lab]]).
---
# Design-Catalog-Entry

Legt einen Katalogbaustein an: Metadaten, Markup, Doku — kuratiert und geprüft, nicht gesammelt.

## Gotcha zuerst

**Ein Katalogbaustein muss richtungsneutral sein.** Er setzt keine eigenen Farben, Radien oder Abstände, sondern ausschließlich Bridge-Utilities (`bg-surface`, `text-h2`, `rounded-ds`, `measure`) und dort, wo es keine Utility gibt, `var(--ds-*)`.

Maßgeblich ist dabei nicht die Vorschau im Standard-Tokensatz, sondern der Baustein unter einer anderen Designrichtung und bei umgestellten Achsen (`corner: square`, `density: tight`, `width: wide`). Wer dabei bricht, ist keine Vorlage, sondern eine Richtungs-Variante und bleibt im Lab.

## Pfadkonvention

```
src/catalog/<family>/<slug>/entry.md      Metadaten + Doku, ID = <family>/<slug>
src/catalog/<family>/<slug>/Preview.astro das Markup, als Fragment ohne Layout
```

`<family>` ist einer der Werte aus `CATALOG_FAMILY` in `src/content.config.ts`, `<slug>` kebab-case. Die Vorschau-Route löst über exakt diesen Pfad auf (`/src/catalog/<id>/Preview.astro`, per Glob). Liegt die Datei anders oder heißt sie anders, baut der Eintrag durch und bleibt ohne Vorschau — mit einem Hinweiskasten statt Markup.

## Frontmatter

Schema aus `src/content.config.ts`. Ein Verstoß bricht `pnpm build`.

```yaml
---
title: 'Anfrageformular, kompakt'
summary: 'Was der Baustein zeigt.'   # 20–200 Zeichen
family: form                         # hero nav section feature pricing faq form table footer empty-state error cookie
direction:                           # min 1, aus DIRECTIONS
  - corporate
axes:                                # unter welcher Achsenstellung die Vorschau gerendert wird
  heading: sans                      # sans | serif | display | mono
  width: compact                     # compact | normal | wide
  density: balanced                  # tight | balanced | airy
  accent: normal                     # quiet | normal | strong
  corner: soft                       # square | soft | round
  motion: none                       # none | subtle | expressive
origin: eigen                        # eigen | adaptiert | extern
originNote: 'Quelle, Lizenz'         # Pflicht bei adaptiert und extern
a11yChecked: true                    # nur nach tatsächlicher Prüfung
jsWeight: 0                          # Client-JS in kB
updated: 2026-07-27
draft: false
---
```

## Aufnahmekriterien

Der Katalog soll die Screens abdecken, an denen generierte Designs scheitern: Formulare, Tabellen, Navigation, Fehlerzustände, Leerzustände, Cookie-Dialoge. `/katalog/` zeigt unten, welche Familien fehlen — der nächste Eintrag kommt von dort. Nicht noch ein Hero.

Nicht aufgenommen wird: die einmalige Hero-Spielerei, die nur in einem Projekt funktioniert; alles mit ungeklärter Lizenz; alles mit Client-JS ohne zwingenden Grund; alles Ungeprüfte.

## Herkunft und Lizenz

`origin: eigen | adaptiert | extern`. Bei `adaptiert` und `extern` gehört die Quelle samt Lizenz in `originNote` — Herkunft ist bei Fremdcode eine Lizenzfrage, keine Höflichkeit. Fremdcode aus 21st.dev, Magic UI oder React Bits wird abgemalt, nicht importiert. Eine React-Insel für einen Button lohnt sich in Astro nie: das Framework-Bundle kostet mehr als der Rest der Seite, und das Markup muss ohnehin auf die `--ds-*`-Tokens umgeschrieben werden.

## Prüfliste vor `a11yChecked: true`

Am einzeln geöffneten `/vorschau/<id>/`, nicht im eingebetteten Rahmen. Jeder Punkt tatsächlich durchgeführt:

- Tastaturbedienung vollständig, keine Falle, kein positiver `tabindex`
- Fokus auf jedem Bedienelement sichtbar
- Kontrast 4.5:1 für Text, 3:1 für Bedienelemente und Grafiken
- Labels sichtbar und über `for`/`id` verknüpft, kein Placeholder als Label
- Touch-Target ≥ 44px, auch bei `density: tight`
- Keine Information allein über Farbe
- `prefers-reduced-motion` respektiert
- Zoom 200 % ohne horizontales Scrollen und ohne Überlappung

Die Patterns dahinter stehen in `[[accessibility-audit]]` und werden hier nicht wiederholt. Das Feld wird nie auf Verdacht gesetzt: ungeprüft heißt `a11yChecked: false` und `draft: true`.

## Body von `entry.md`

- **Wofür** — der konkrete Einsatzfall, und danach ausdrücklich, wofür der Baustein nicht gedacht ist und ab wann es ein anderer Baustein wird.
- **Beim Übernehmen beachten** — was im Zielprojekt angepasst werden muss: Endpunkte, Feldnamen, serverseitige Validierung, Platzhaltertexte, bewusst Weggelassenes.
- **Geprüft** — welche a11y-Punkte konkret geprüft wurden, mit Zahlen wo es welche gibt, plus was offen bleibt.

## Validierung

```
pnpm build       # Schema-Fehler brechen hier; danach dist/katalog/<id>/ und dist/vorschau/<id>/ prüfen
pnpm test:a11y   # axe + Struktur, inklusive der neuen Vorschau-Route
```

## Gotchas

- **Die Datei heißt exakt `entry.md`.** Der Loader matcht `**/entry.md` und leitet die ID aus dem Ordnerpfad ab. `index.md` oder `eintrag.md` erzeugt keinen Eintrag, nur Stille.
- **`draft: true`, solange ungeprüft.** Entwürfe erscheinen weder in `/katalog/` noch unter `/vorschau/` — und werden deshalb auch von `pnpm test:a11y` nicht erfasst.
- **`jsWeight` ehrlich angeben.** Der Wert steht sichtbar in der Liste und in der Detailansicht. Eine geschönte Zahl macht genau die Entscheidung kaputt, für die das Feld da ist.
- **Die Vorschau ist ein Fragment**, das `Bare` einbettet. Trotzdem sinnvolle Überschriftenhierarchie: genau ein `<h1>` pro Vorschau, danach lückenlos.
