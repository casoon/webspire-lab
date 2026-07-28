# @webspire/lab

Werkstatt für Webdesign: Richtungen bauen, nebeneinander stellen, verwerfen, verfeinern.
Was überzeugt, zieht als Code ins Produktionsprojekt um.

Der Ausgangspunkt ist eine einfache Beobachtung: Ein Modell, das einmal „bau eine moderne
Premium-Landingpage" hört, liefert zuverlässig dasselbe zurück — Standard-Grotesk, blauvioletter
Verlauf, große abgerundete Karten, Icon-Kacheln, „Unlock your potential". Nicht weil es nicht
besser kann, sondern weil ihm Referenz, Rahmen und Vergleich fehlen. Alle drei liefert dieses Repo.

```bash
pnpm install
pnpm dev
```

## Als Template starten

Das Repository ist als GitHub-Template gedacht: **Use this template** wählen, das neue Repository
klonen und darin arbeiten. Es gibt bewusst keinen Installer — ein neuer Lauf braucht zuerst einen
inhaltlichen Auftrag, nicht einen weiteren Generator.

1. Lokal `pnpm dev` starten und unter `/start/` ein Projekt anlegen. Die Oberfläche erzeugt
   `lab.config/projects/<projekt>.json`; wenn der Browser keinen Ordnerzugriff erlaubt, lädt sie
   die Datei zum Verschieben herunter.
2. Referenzen in `design/references/` erfassen; bei einer kopierten Vorlage ebenso `template: true`
   entfernen.
3. Erst dann `src/pages/lab/<projekt>/richtungen/` für die Vergleichsseiten anlegen.

Das geklonte Lab startet leer. Die vollständige Nordwerk-Referenz liegt getrennt unter
[`examples/nordwerk/`](examples/nordwerk/), wird nicht gebaut und erscheint nicht als aktiver
Kundenlauf.

## Mehrere Projekte und Updates

Ein Projekt besteht aus einer JSON-Datei unter `lab.config/projects/<projekt>.json` und — sobald
Richtungen entstehen — einem gleichnamigen Lauf unter `src/pages/lab/<projekt>/`. Die Startseite
zeigt jeden Lauf mit seinem eigenen nächsten Schritt. Projektdateien und Referenzen sind
versionierbar, lesbar und ohne Datenbank; die Projektdatei ist die einzige Quelle für den
Arbeitsauftrag und den Gestaltungsrahmen. Der Katalog und die Referenzbibliothek gelten gemeinsam
für alle Projekte im Lab.

Wie ein geklontes Lab spätere Verbesserungen dieses Templates übernimmt, steht in
[`UPDATES.md`](UPDATES.md).

| Route | Inhalt |
|-------|--------|
| `/` | Ablauf und Stand |
| `/start/` | Projekt lokal anlegen |
| `/lab/` | Läufe je Projekt, jeder mit Vergleichsseite |
| `/katalog/` | geprüfte Bausteine zum Kopieren |
| `/referenzen/` | Inspirationsbibliothek mit Merkmalen und Deckungsanzeige |
| `/achsen/` | die sechs Stellschrauben zum Ausprobieren |

## Verfahren

Acht Phasen, beschrieben in [`design/README.md`](design/README.md). Kurz:

1. Briefing — ein Ziel, eine primäre Aktion
2. 15–30 Referenzen sammeln, verschlagwortet nach Merkmal
3. Gestaltungsrahmen ableiten
4. Fünf Richtungen bauen, gleicher Inhalt, gemeinsame Vergleichsseite
5. Eine wählen, drei Untervarianten entlang einzelner Achsen
6. Bausteine aus dem Katalog, Fremdcode abmalen statt importieren
7. Achsen feinjustieren
8. Prüfen: axe, Slop-Regeln, Screenshots, Urteil

Die Regeln, gegen die geprüft wird, stehen in [`design/ANTI-PATTERNS.md`](design/ANTI-PATTERNS.md) —
mit IDs, damit ein Befund zuordenbar ist statt „wirkt irgendwie KI-mäßig".

## Prüfen

```bash
pnpm test:a11y     # axe + Überschriftenstruktur + Fokus über alle Routen
pnpm test:e2e      # zusätzlich die maschinell prüfbaren SLOP-Regeln
pnpm test:shots    # Screenshots für den visuellen Vergleich
pnpm analyze       # Fallow: ungenutzter Code, Duplikate, Komplexität
```

Die Startseite sagt bei jedem Aufruf, welcher Schritt gerade dran ist und was ihn blockiert.
Sie liest den Zustand aus den vorhandenen Artefakten, nicht aus einer gepflegten Liste.

## Skills

Die Phasen sind als Slash-Commands hinterlegt: `/design-brief`, `/inspiration-capture`,
`/design-directions-lab`, `/design-catalog-entry`, `/slop-review`.

Alle 18 Skills liegen in `.claude/skills/` und gelten nur in diesem Repo. Dreizehn davon sind
eingefrorene Kopien aus einer anderen Sammlung, damit das Projekt ohne externe Abhängigkeit
läuft — Herkunft und Pflegehinweis stehen in [`NOTICE`](NOTICE).

Sie erfüllen den offenen [Agent-Skills-Standard](https://agentskills.io/specification) und laufen
deshalb unverändert auch in Codex, Gemini CLI, Copilot und Cursor.

## Verhältnis zu Webspire

Namensfamilie, **kein Code-Link**. Webspire ist eine Pattern-Registry — kuratierte Bausteine zum
Übernehmen. Dieses Lab ist das Gegenstück: es erzeugt Designrichtungen, stellt sie nebeneinander
und prüft sie. Das eine liefert Material, das andere entscheidet.

Der Webspire-MCP lässt sich in Phase 6 als Quelle nutzen, ist aber **keine Abhängigkeit**: er läuft
als eigener Prozess, taucht in keiner `package.json` auf, und nichts hier bricht ohne ihn.

Bei Widerspruch zwischen einer externen Empfehlung und den Regeln dieses Repos gewinnt
[`design/ANTI-PATTERNS.md`](design/ANTI-PATTERNS.md). Externe Quellen kennen weder das Briefing
noch diesen Katalog.

## Lizenz

Apache 2.0, siehe [`LICENSE`](LICENSE). Herkunft mitgelieferter Fremdinhalte: [`NOTICE`](NOTICE).
