---
name: design-brief
description: Führt Phase 1 (Briefing) und Phase 3 (Gestaltungsrahmen) durch und pflegt `lab.config/projects/<slug>.json`. Nutzen, wenn ein Designlauf startet oder der Rahmen aus der Referenzbibliothek abgeleitet wird. NICHT für Copy-Überarbeitung (→ [[anti-ai-copy]]) oder für die Umsetzung einer Produktionsseite (→ [[landing-and-site-builder]]).
---
# Design-Brief

Macht aus Projektangaben ein Briefing und später einen verbindlichen Gestaltungsrahmen — die Messlatte für Phase 4 bis 8.

## Gotcha zuerst

**Fehlende Angaben werden erfragt, nicht erfunden.** Ein Briefing mit erfundener Zielgruppe ist schlimmer als kein Briefing: es sieht vollständig aus, also prüft es niemand nach, und drei Phasen später wird gegen eine Fiktion gemessen.

Niemals raten — fehlt eine dieser Angaben, wird gefragt und die Arbeit pausiert:

| Feld | Warum nicht ableitbar |
|------|-----------------------|
| Ziel der Seite | Nur der Auftraggeber weiß, wofür die Seite gebaut wird |
| CTAs | Aus dem Produkt folgt keine Handlung. Haupt- und sekundäre CTAs nur übernehmen, wenn sie belegt sind |
| Zielgruppe samt Vorwissen und Skepsis | Die häufigste Halluzination. „KMU-Entscheider" ist keine Zielgruppe |
| Inhalte-Verfügbarkeit | Ob ein Abschnitt Text hat, ist eine Tatsache, keine Annahme |

Vorschlagen ist erlaubt, solange es als Vorschlag markiert ist und bestätigt wird: Randbedingungen, technische Basis, Gegenbeispiele unter „Was es nicht werden soll", `title`, `slug`. Der komplette Teil 2 (Gestaltungsrahmen) ist ohnehin Vorschlag — er wird belegt, nicht bestätigt.

**Nicht aus der Bestandswebsite abschreiben.** Deren Selbstbeschreibung ist Marketing-Copy, oft Jahre alt und meist der Grund für den Relaunch.

## Ablauf

1. Projekt über `/start/` anlegen oder `lab.config/templates/project.json` nach `lab.config/projects/<slug>.json` kopieren. Slug kebab-case, kurz.
2. Teil 1 in den Top-Level-Feldern sowie `briefing` mit dem füllen, was tatsächlich gesagt wurde. Lücken sammeln und **in einem Block** rückfragen, nicht einzeln.
3. `status: "brief"` setzen, `updatedAt` auf jetzt. Hier stoppen und an `/inspiration-capture` übergeben.
4. Erst wenn 15–30 Referenzen liegen: `designFrame` ergänzen, `status: "directions"`.

## Projektdatei

Schema aus `lab.config/templates/project.json`. Ein Verstoß blendet das Projekt im Lab aus und
bricht die inhaltliche Prüfung.

```json
{
  "title": "Relaunch Startseite",
  "client": "Beispiel GmbH",
  "goal": "Erstkontakt zu …",
  "ctas": {
    "primary": "Termin buchen",
    "secondary": ["Leistungen ansehen"]
  },
  "audience": "Bauleiter, die …",
  "status": "brief",
  "updatedAt": "2026-07-28T12:00:00.000Z",
  "chosenDirection": "editorial",
  "constraints": ["Bestandslogo bleibt"]
}
```

## Teil 2 aus der Bibliothek ableiten

Der Rahmen wird **belegt**, nicht behauptet. Vorgehen über `design/references/*.md`:

1. Merkmalsfelder auszählen: `direction`, `typeVoice`, `layout`, `surface`. Die Enums sind geschlossen, das lässt sich zählen.
2. Häufungen benennen statt gewichten: „11 von 18 Einträgen `asymmetric`, kein einziger `cards`" — daraus wird die Layout-Aussage.
3. `takeaway`-Zeilen quer lesen. Wiederkehrende Eigenschaften über mehrere Einträge sind Kandidaten für den Rahmen; ein einzelner Eintrag ist es nicht.
4. Widersprüche auflösen, nicht mitteln. Zwei Häufungen, die sich ausschließen (`minimal` und `bold-branding`), sind eine Entscheidung: eine gewinnt, die andere kommt unter „Was es nicht werden soll". Ein Mittelwert aus beidem ist genau das Durchschnitts-Internet.
5. Abschnitte „Was nicht funktioniert" der Referenzen einsammeln — sie speisen die Gegenbeispiele.

Zwei Aussagen brauchen zwingend eine Begründung im Brief:

- **Schrift.** Inter, Plus Jakarta Sans und Geist sind das Fehlen einer Wahl (`JUDGE-FONT-DEFAULT`). Ein Satz, warum diese Schrift zu diesem Inhalt passt.
- **Leitrichtung.** Eine aus der Taxonomie in `[[design-directions]]`, plus ein Satz, warum diese und keine andere.

Pflichtabschnitte, ohne die Teil 2 nicht fertig ist:

- **Signatur** — das eine Element, an das man sich erinnert. Ein konkretes gestalterisches Merkmal, kein Adjektiv. „Marginalspalte mit Datumsmarken, die über Abschnitte hinweg mitläuft" ist eine Signatur; „hochwertig" ist keine.
- **Was es nicht werden soll** — zwei bis drei konkrete Gegenbeispiele. Wunschadjektive zählen nicht.
- **Bewusste Ausnahmen** — welche Regel aus `design/ANTI-PATTERNS.md` gebrochen wird und was der Bruch bringt. Nicht dokumentierte Ausnahmen sind Fehler.

## Output

- Datei: `lab.config/projects/<slug>.json`, sonst nichts.
- Nach Teil 1: `status: brief`, offene Rückfragen als Liste in der Antwort. Nächster Schritt `/inspiration-capture`.
- Nach Teil 2: `status: directions`, `updated` neu. Nächster Schritt `/design-directions-lab`.

## Gotchas

- **Ein Ziel pro Seite.** Zwei gleichrangige Ziele sind der häufigste Grund, warum ein Entwurf später beliebig wirkt. CTAs sind optional; falls vorhanden, gibt es genau eine Haupt-CTA und höchstens zwei sekundäre (`JUDGE-CTA-TIERS`).
- **Abschnitte ohne vorhandenen Inhalt sind Layout-Dekoration.** Unter „Inhalte" gehört pro Abschnitt der Vermerk, ob der Text vorliegt. Fehlt er, ist der Abschnitt zu streichen oder als offen zu markieren — nicht mit Lorem zu füllen.
- **Teil 2 nicht vorziehen.** Ein Rahmen vor Phase 2 ist Bauchgefühl mit Überschrift.
- **`status` mitführen:** `brief` → `directions` → `refining` → `decided` → `shipped`. Er steuert, was als Nächstes erlaubt ist; `chosenDirection` erst ab `decided`.
- **`updatedAt` bei jeder Änderung setzen.** Ein alter Brief mit neuem Inhalt ist unbrauchbar als Messlatte.
