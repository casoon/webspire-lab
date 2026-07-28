# Briefing aus Gesprächsnotizen ableiten

Lies die Notizen. Gib ausschließlich dieses JSON-Objekt zurück:

```json
{
  "project": "Objekt gemäß lab.config/templates/project.json",
  "openQuestions": ["kurze, konkrete Frage"]
}
```

Erfinde keine Zielgruppe, keine CTA und keine Fakten über das Unternehmen. Fehlende
Informationen stehen in `openQuestions`; die entsprechenden Felder in `project` bleiben leer.

Die Felder `goal`, `ctas` und `audience` müssen entweder aus den Notizen belegt oder leer
bleiben. Der Status ist immer `brief`.
