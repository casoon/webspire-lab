# Template aktualisieren

Ein GitHub-Template ist eine Momentaufnahme. Änderungen am Template erreichen neue Projekte,
aber nicht automatisch bereits erstellte Repositories. Dieser Ablauf hält die Übernahme bewusst
als normalen Git-Change sichtbar.

## Einmalig: Quelle hinterlegen

Im geklonten Projekt die URL des ursprünglichen Template-Repositories einsetzen:

```bash
git remote add template <url-des-template-repositories>
git fetch template
```

## Updates übernehmen

```bash
git fetch template
git switch main
git merge template/main
```

Bei einem über GitHubs **Use this template** erstellten Repository haben die beiden Projekte
getrennte Historien. Beim ersten Update deshalb einmalig:

```bash
git merge template/main --allow-unrelated-histories
```

Danach die Konflikte absichtlich entscheiden: eigene Briefings, Referenzen und Läufe bleiben im
Projekt; Änderungen an `src/`, `e2e/`, `design/`-Regeln und den Skills werden gegen den Nutzen des
Updates abgewogen. Anschließend immer `pnpm check`, `pnpm type-check` und `pnpm test:e2e` ausführen.

## Keine automatische Synchronisierung

Ein Bot, der Template-Änderungen ungeprüft in Kundenläufe schreibt, ist hier nicht sinnvoll: Die
Designrichtungen und Briefings sind absichtlich projektspezifisch. Ein automatischer PR-Workflow
kann später ergänzt werden, wenn mehrere Klone regelmäßig dieselben Infrastruktur-Updates
übernehmen sollen; er sollte aber nur einen Pull Request öffnen, nie selbst mergen.
