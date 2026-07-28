---
title: 'Anfrageformular, kompakt'
summary: 'Fünf Felder, sichtbare Labels, autocomplete, Pflichtfelder im Text gekennzeichnet und ein statisch sichtbarer Feldfehler. Ohne JavaScript.'
family: form
direction:
  - corporate
  - conversion
axes:
  heading: sans
  width: compact
  density: balanced
  accent: normal
  corner: soft
  motion: none
origin: eigen
a11yChecked: true
jsWeight: 0
updated: 2026-07-27
draft: false
---

## Wofür

Kurze Kontaktanfrage auf einer Leistungs- oder Kontaktseite: Name, E-Mail, Telefon optional,
Nachricht, Einwilligung. Gedacht für Fälle, in denen die Anfrage bei einem Menschen landet und
nicht in einem Prozess weiterverarbeitet wird.

Nicht gedacht für mehrstufige Formulare, Datei-Uploads, Terminbuchung oder Bestellstrecken. Sobald
Zwischenschritte, bedingte Felder oder eine Fortschrittsanzeige dazukommen, ist das ein anderer
Baustein und nicht mehr ohne JavaScript sinnvoll.

## Beim Übernehmen beachten

- `action` und `method` zeigen im Katalog ins Leere. Im Produktionsprojekt auf den echten Endpunkt setzen.
- Die `name`-Attribute (`name`, `email`, `telefon`, `nachricht`, `einwilligung`) sind Platzhalter
  und müssen zu dem passen, was der Endpunkt erwartet.
- Serverseitig validieren. `required` und `type="email"` sind Bedienkomfort im Browser, keine
  Prüfung. Ein abgeschickter Request kann jedes Feld leer oder beliebig gefüllt enthalten.
- Der Fehlerzustand an der E-Mail ist ein fest verdrahtetes Beispiel. Im Produktionsprojekt werden
  `aria-invalid`, die Fehlermeldung und der eingetragene Wert servergerendert gesetzt, und zwar nur
  an den Feldern, die tatsächlich fehlerhaft sind.
- Bei mehr als drei Feldern lohnt zusätzlich eine Fehlerübersicht oberhalb des Formulars, die auf
  die betroffenen Felder verlinkt und nach dem Absenden Fokus erhält.
- Spamschutz fehlt bewusst. Honeypot oder Rate Limit gehören auf die Serverseite, nicht in dieses
  Markup.
- Der Einwilligungstext ist ein Platzhalter. Der echte Text kommt aus der Datenschutzerklärung des
  Projekts.
- Die Feldrahmen liegen auf `border-control`, nicht auf `border-line`. `--ds-line` ist für
  dekorative Trenner gedacht und bleibt im Standardsatz bei 1,35:1, also unter den 3:1, die WCAG
  1.4.11 für die Begrenzung eines Bedienelements verlangt. Eine Richtung, die `--ds-line`
  überschreibt, muss `--ds-control-line` mit überschreiben und die 3:1 dort erneut prüfen.

## Geprüft

Gegen den gebauten Stand unter `/vorschau/form/anfrage-kompakt/` in Chromium:

- axe-core, Regelsatz WCAG 2.0/2.1/2.2 Level A und AA: keine Verstöße.
- Jedes Bedienelement hat ein sichtbares Label mit `for`/`id`. Kein Placeholder tritt an die Stelle
  eines Labels, es gibt überhaupt keine Placeholder.
- Pflichtfelder sind im Labeltext mit "(Pflichtfeld)" ausgezeichnet, das optionale Feld mit
  "(optional)". Die Kennzeichnung hängt an keiner Farbe.
- Der Fehler am E-Mail-Feld ist über `aria-describedby` verknüpft, das Ziel existiert, der Text
  beginnt mit dem Wort "Fehler". Zusätzlich verdoppelt sich die Rahmenstärke von 1 px auf 2 px. Die
  Rahmenfarbe bleibt gleich, der Zustand hängt also an keiner Farbe.
- Tabreihenfolge entspricht der Lesereihenfolge: Name, E-Mail, Telefon, Nachricht, Einwilligung,
  Absenden. Sechs Stopps, keine Tastaturfalle, kein `tabindex` im Markup.
- Fokus ist auf allen sechs Stopps sichtbar, gemessen als `outline: solid 2px` in der Akzentfarbe.
  Der `:focus-visible`-Outline aus dem Basis-Layer wird nirgends überschrieben.
- Zielgröße, gemessen bei `density="tight"`, also im ungünstigsten Fall: Textfelder 44 px,
  Textbereich 135 px, Einwilligungszeile 48 px, Absende-Button 44 px. Das Kontrollkästchen selbst
  ist 20 mal 20 px, die Zielfläche liefert das umschließende Label über die volle Spaltenbreite.
- Kontrast im Standard-Tokensatz: Labels, Fehlermeldung und Einwilligungstext 16,1:1, gedämpfte
  Hinweistexte 6,6:1, Beschriftung des Absende-Buttons 4,96:1, Feldrahmen 6,6:1. Damit halten die
  Feldrahmen die 3:1 aus WCAG 1.4.11.
- Keine Übergänge und keine Animationen im gerenderten Baum, damit auch nichts auf
  `prefers-reduced-motion` reagieren muss.
- Keine Placeholder im Markup und kein `<script>` auf der Seite.

Offen bleibt der Kontrast unter einer konkreten Designrichtung. Der Baustein setzt keine eigenen
Farben, also entscheidet der Tokensatz der Richtung darüber, und der muss dort geprüft werden.
