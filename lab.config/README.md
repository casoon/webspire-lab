# Lab-Konfiguration

Dieser Ordner enthält die lokalen Projektdaten des Labs. Er wird mitcommittet und ist damit die
Quelle für die Startseite, nicht ein Cache.

```text
lab.config/
  workspace.json             # versionsfähige Lab-Einstellungen
  projects/<slug>.json       # ein Projekt pro Datei
  prompts/                   # optionale, versionierte KI-Prompts
```

`workspace.json` und jede Projektdatei tragen eine `schemaVersion`. Updates des Templates dürfen
Konfiguration nie überschreiben; sie ergänzen bei Bedarf eine Migration. API-Schlüssel gehören
nicht hierher, sondern ausschließlich in die lokale, ignorierte `.env.local`.

Die Oberfläche unter `/start/` erstellt eine Projektdatei mit den Angaben für Phase 1. Die Felder
`briefing` und `designFrame` werden anschließend im selben JSON ergänzt; sie bleiben absichtlich
konfigurationsnah statt in einer Datenbank oder einem versteckten Browser-Speicher zu liegen.

## KI ohne Anbieterbindung

`prompts/` enthält nur versionierte Eingabevorlagen. Für den Start werden Notizen in einen Chat
kopiert und die Antwort von einem Menschen geprüft, bevor sie in die Projektdatei übernommen wird.
Eine spätere direkte Anbindung soll denselben Vertrag nutzen: strukturierter Entwurf, offene Fragen
separat, keine automatische Speicherung und Schlüssel ausschließlich in `.env.local`.
