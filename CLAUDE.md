# @webspire/lab

Design-Lab und Vorlagen-Katalog. Hier entstehen Designrichtungen durch Bauen, Nebeneinanderstellen
und Verwerfen — nicht durch einen guten Prompt. Was überzeugt, zieht als Code ins Zielprojekt um.

Das verbindliche Verfahren steht in `design/README.md`. Lies es, bevor du gestaltest.

## Stack

Astro 7 (statisch, kein Adapter) · Tailwind v4 über `@tailwindcss/vite` · Node ≥ 22.12 · pnpm ·
Playwright + axe-core · Biome. Kein UI-Framework, keine Islands, kein Client-JS außer den paar
Zeilen in `AxisBar` und `CompareGrid`.

## Struktur

```
design/          Verfahren, Regeln, Briefings, Referenzbibliothek (Markdown, für Menschen)
src/styles/      tokens.css = drei Schichten + sechs Achsen; app.css = dünner Basis-Layer
src/pages/lab/<projekt>/index.astro              Vergleichsseite eines Laufs
src/pages/lab/<projekt>/richtungen/<slug>.astro  eine Designrichtung, Bare-Layout
src/catalog/<family>/<slug>/entry.md             Katalog-Metadaten + Doku
src/catalog/<family>/<slug>/Preview.astro        das Markup dazu
e2e/             axe, Struktur, maschinelle Slop-Regeln, Screenshots
```

Läufe und Katalogeinträge werden per Glob gefunden, nicht in einer Liste gepflegt.

## Kommandos

```
pnpm dev · pnpm build · pnpm type-check · pnpm check
pnpm test:a11y      axe + Struktur über alle gebauten Routen
pnpm test:e2e       zusätzlich e2e/slop.spec.ts
pnpm test:shots     Screenshots für den visuellen Vergleich
```

## Konventionen

- **Tokens statt Werte.** Bridge-Utilities benutzen (`bg-surface`, `text-h1`, `rounded-ds`,
  `container-ds`, `measure`, `section-y`). Wo es keine gibt: `var(--ds-*)`. Keine Hex-Werte,
  keine Pixel-Radien, keine Abstands-Literale im Markup — sonst greifen die Achsen nicht.
- **Eine Richtung überschreibt Schicht-1-Tokens** per `<style is:global>` mit `:root { --ds-… }`.
  Sie erfindet keine neuen Variablennamen.
- **Katalogbausteine sind richtungsneutral.** Ein Baustein, der eigene Farben oder Radien setzt,
  gehört nicht in den Katalog.
- **Varianten unterscheiden sich strukturell**, nicht nur farblich, und zeigen denselben Inhalt
  und dieselbe primäre Aktion.
- **Bildflächen bleiben beschriftete Platzhalter.** Keine externen Bild-URLs, kein picsum,
  keine Stockfotos.
- **Deutsch** in Doku, Kommentaren und Copy. Code und Tokennamen englisch.

## Definition of Done

1. `pnpm build` und `pnpm type-check` laufen durch.
2. `pnpm test:a11y` grün — genau ein `<h1>`, lückenlose Hierarchie, Fokus sichtbar, Kontrast 4.5:1.
3. Keine `SLOP-*`-Verstöße (`pnpm test:e2e`).
4. Die `JUDGE-*`- und `COPY-*`-Regeln aus `design/ANTI-PATTERNS.md` durchgegangen, Ausnahmen
   im Brief dokumentiert.
5. Bei Katalogeinträgen: `a11yChecked` nur `true`, wenn Tastatur, Kontrast und
   `prefers-reduced-motion` tatsächlich geprüft wurden.

## Was hier nicht gilt

- `[[landing-and-site-builder]]` und `[[web-design-workflow]]` bauen Produktionsseiten. Hier
  entstehen Ausschnitte zum Vergleichen: Hero plus ein Inhaltsabschnitt, mehr nicht.
- Kein SEO, kein i18n, keine Blog-Collections, kein Cloudflare-Adapter. Wer das braucht, ist
  im Zielprojekt, nicht im Lab.
- `[[astro-architecture]]` beschreibt v6. Collections- und Routing-API sind in v7 identisch,
  die Adapter- und Markdown-Teile nicht relevant.

## Skills

Alle 18 Skills liegen im Repo, nichts wird von außen erwartet. Fünf sind projekteigen:

`/design-brief` Phase 1+3 · `/inspiration-capture` Phase 2 · `/design-directions-lab` Phase 4+5 ·
`/design-catalog-entry` Phase 6 · `/slop-review` Phase 8.

Die übrigen 13 sind **eingefrorene Kopien** aus `casoon-agent-skills`. In diesem Repo greift
immer die Kopie, nie die global verlinkte Version — Abgleich von Hand, siehe `NOTICE`.

Ästhetische Ausführung → `[[frontend-design]]`, Hierarchie und CTA-Stufen → `[[ui-design]]`,
Richtungs-Taxonomie → `[[design-directions]]`, Bewegung → `[[motion-design]]`,
Barrierefreiheit → `[[accessibility-audit]]`, Texte → `[[anti-ai-copy]]`.
