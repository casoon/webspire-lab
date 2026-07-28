# Anti-Pattern-Katalog

Regeln mit IDs, damit ein Befund zuordenbar ist statt "wirkt irgendwie KI-mäßig".

Drei Klassen:

- **SLOP-\*** — maschinell geprüft in `e2e/slop.spec.ts`. Verstoß = roter Test.
- **JUDGE-\*** — nur im Urteil prüfbar. `/slop-review` geht sie durch.
- **COPY-\*** — Textebene. Ausführliche Herleitung in `[[anti-ai-copy]]`.

**Geltungsbereich:** Entwürfe und Katalogbausteine — also alles unter `/vorschau/` und
`/lab/*/richtungen/`. Die Lab-Oberfläche selbst ist Werkzeug und darf abweichen.

## Herkunft

Die visuellen Verbote stammen aus `[[frontend-design]]` („Absolute bans"), die Motion-Schwellen
aus `[[motion-design]]`, die Hierarchie-Regeln aus `[[ui-design]]`. Der Abschnitt
„Vorgetäuschter Betrieb" ist aus beobachteten Mustern generierter Landingpages destilliert.

Hier stehen die Regeln als prüfbare Bedingung, nicht als Wiederholung der Begründung.

## Rangfolge bei Konflikten

Externe Quellen — Pattern-Registries, Komponenten-Bibliotheken, Design-Skills fremder
Anbieter, der Webspire-MCP — liefern **Material für die Entwicklung**. Dieser Katalog
**kontrolliert**. Bei Widerspruch gewinnt der Katalog.

Der Grund ist kein Misstrauen, sondern ein Unterschied im Zweck: eine Registry bietet Stile
als Menü an, das Lab erzwingt eine Entscheidung. Dass ein Look dort als Option geführt wird,
ist keine Begründung dafür, ihn hier zu wählen — und die Anbieter kennen weder das Briefing
noch diesen Katalog.

Zwei Fälle, die heute real auftreten:

| Externe Empfehlung | Regel, die sticht |
|---|---|
| Design-Skill „modern" schreibt Inter vor | `SLOP-REFLEX-FONT`, `JUDGE-FONT-DEFAULT` |
| Design-Skill „glassmorphism" als wählbarer Stil | `JUDGE-GLASS` |

Das heißt nicht, dass so etwas nie vorkommen darf. Es heißt, dass es über den normalen Weg
läuft: **eine begründete Ausnahme im Brief** (siehe unten). „Die Registry empfiehlt es" ist
keine Begründung. „Der Kunde verwendet Inter im Bestandsauftritt" ist eine.

Übernommenes Fremdmaterial wird nach diesem Katalog bewertet, nicht nach den Regeln seiner
Herkunft. Und keine externe Quelle ist Voraussetzung: nichts im Repo hängt davon ab, dass
eine Registry erreichbar ist.

---

## Maschinell geprüft

| ID | Regel | Schwelle |
|----|-------|----------|
| `SLOP-GHOST-CARD` | Nicht Rahmen und weicher Schatten am selben Element | border ≥ 1px sichtbar UND box-shadow-Blur ≥ 16px |
| `SLOP-OVERROUND` | Keine überrundeten Flächen | border-radius ≥ 24px an Elementen höher als 60px |
| `SLOP-SIDE-STRIPE` | Kein farbiger Seitenstreifen als Akzent | border-left/right > 1px bei 0 an den anderen Kanten |
| `SLOP-GRADIENT-TEXT` | Kein Verlaufstext | `background-clip: text` |
| `SLOP-HERO-SIZE` | Hero nicht überdimensionieren | font-size > 96px |
| `SLOP-TRACKING` | Display-Laufweite nicht überziehen | letter-spacing < -0.04em |
| `SLOP-MEASURE` | Zeilenmaß lesbar halten | Absatzbreite deutlich über 80ch |
| `SLOP-REFLEX-FONT` | Keine Reflex-Schriftwahl | Inter, Plus Jakarta, Geist, Manrope, Poppins, DM Sans, Space Grotesk |
| `SLOP-NESTED-SURFACE` | Konzentrische Radien bei verschachtelten Flächen | Innenradius ≥ Außenradius, beide mit Rahmen oder Hintergrund |
| `SLOP-GLOW` | Schatten brauchen Versatz | box-shadow ohne x/y-Versatz mit Blur ≥ 16px |
| `SLOP-DECOR-GRADIENT` | Keine dekorativen Verlaufsflächen | `repeating-linear-gradient` oder `radial-gradient` als Background |
| `SLOP-TINY-TEXT` | Lesbare Mindestgröße | font-size < 12px |
| `SLOP-LEADING` | Fließtext braucht Luft | line-height < 1.35 bei ≤ 20px und > 80 Zeichen |
| `SLOP-JUSTIFY` | Kein Blocksatz | `text-align: justify` bei > 80 Zeichen |
| `SLOP-CAPS-BODY` | Versalien nur für kurze Labels | `text-transform: uppercase` bei > 60 Zeichen |
| `SLOP-INFINITE-MOTION` | Keine Endlos-Animation | `animation-iteration-count: infinite` (Marquee, Puls, Blinken) |
| `SLOP-BOUNCE-EASING` | Kein Überschwingen | cubic-bezier mit y-Wert außerhalb 0–1 |
| `SLOP-TRANSITION-ALL` | Eigenschaften einzeln benennen | `transition-property: all` bei Laufzeit > 0 |
| `SLOP-ANIMATE-LAYOUT` | Nur transform und opacity animieren | Transition auf width, height, top, margin, padding, font-size … |
| `SLOP-ROW-DOUBLE-RULE` | Eine Linie zwischen zwei Zeilen, nicht zwei | ≥ 4 Geschwister mit Rahmen oben UND unten |
| `SLOP-FLAT-TYPE` | Echte Typo-Hierarchie | Spanne größte/kleinste Schriftgröße < 2:1 |
| `SLOP-EYEBROW-COUNT` | Eyebrows sind selten oder sie sind Grammatik | mehr als ein Versal-Label mit Sperrung pro drei Abschnitte |

`SLOP-FLAT-TYPE` und `SLOP-EYEBROW-COUNT` urteilen über die ganze Seite und gelten deshalb nur
für Richtungsseiten. Ein Katalogbaustein ist ein Fragment: er hat bewusst keine Display-Größe
und keinen Abschnittsrhythmus.

Jede Regel ist gegen eine Fixture geprüft worden, die sie absichtlich verletzt — eine Regel, die
nie feuert, ist toter Code und schafft falsche Sicherheit.

Eine Regel wird nicht aufgeweicht, weil ein Entwurf sie verletzt. Entweder der Entwurf ändert
sich, oder die Regel wird bewusst und begründet im Brief ausgenommen.

---

## Urteilsregeln

| ID | Regel |
|----|-------|
| `JUDGE-CREAM` | Kein cremefarbener/beiger Body-Hintergrund als „warm/editorial"-Default. Gebannt ist das ganze Band OKLCH L 0.84–0.97, C < 0.06, Hue 40–100. Auch Tokennamen wie `cream`, `sand`, `bone`, `linen`, `parchment` sind bereits das Symptom. Wärme kommt über Akzent, Schrift und Bild. |
| `JUDGE-CLUSTER` | Nicht in einem der drei aktuellen KI-Cluster landen: (a) Cream + kontraststarke Serif-Display + Terracotta, (b) Near-Black + ein greller Acid-Green- oder Zinnober-Akzent, (c) Broadsheet mit Haarlinien, radius 0 und dichten Zeitungsspalten. Wenn das Briefing den Look ausdrücklich fordert, ist er in Ordnung. Sonst nicht. |
| `JUDGE-EYEBROW` | Keine Eyebrow-Kicker oder `01/02/03`-Marker über jeder Section. Ein benanntes Kicker-System ist Stimme; dasselbe Gerüst über jeder Überschrift ist KI-Grammatik. Nummern nur bei echter Reihenfolge. |
| `JUDGE-ICON-GRID` | Kein Raster aus austauschbaren Icon-Kacheln als Ersatz für Inhalt. Drei Kacheln mit je einem Icon und zwei Zeilen Text sagen nichts. |
| `JUDGE-GLASS` | Glassmorphism nicht als Grundfläche. Nur selten und begründet. |
| `JUDGE-STRIPES` | Keine handgezeichneten Doodle-SVGs, keine Crosshair- oder Haarlinien-Gitter als Dekoration. Verlaufsflächen prüft `SLOP-DECOR-GRADIENT`. |
| `JUDGE-MOTION-PURPOSE` | Keine Animation ohne Funktion. Bewegung zeigt Zustandswechsel, Herkunft oder Zusammenhang — sonst weglassen. Zusätzliche Animation ist selbst ein Slop-Signal. |
| `JUDGE-MOTION-LIMITS` | Translate 4–12px, Hover-Scale max 1.05, Rotation max 3deg, Exits schneller als Entrances. `transition: all`, animierte Layout-Eigenschaften, Endlos-Animationen und Überschwingen prüfen `SLOP-TRANSITION-ALL`, `SLOP-ANIMATE-LAYOUT`, `SLOP-INFINITE-MOTION`, `SLOP-BOUNCE-EASING`. |
| `JUDGE-CTA-TIERS` | CTAs sind optional. Falls vorhanden: höchstens eine Haupt-CTA und zwei sekundäre CTAs pro Ansicht; Primary / Secondary / Ghost sauber getrennt. |
| `JUDGE-RADIUS-NESTING` | Verschachtelte Karten sind fast immer falsch — auch wenn die Radien stimmen. Die Radien selbst prüft `SLOP-NESTED-SURFACE`. |
| `JUDGE-ACCENT-AREA` | Akzentfarbe nicht über 10 % der Fläche. Die Achse `accent` regelt Sättigung, nicht Fläche. |
| `JUDGE-STOCK` | Keine generischen Stockfotos, keine 3D-Kugeln, Glasobjekte oder schwebenden Dashboards. Im Lab bleiben Bildflächen beschriftete Platzhalter. |
| `JUDGE-FONT-DEFAULT` | Wenn eine Schrift gewählt wird, steht die Begründung im Brief. Eine Schrift ohne Begründung ist keine Entscheidung. Die bekannten Reflexwahlen fängt `SLOP-REFLEX-FONT`, die Begründung kann kein Test prüfen. |
| `JUDGE-SAME-SHAPE` | Die Varianten eines Laufs unterscheiden sich strukturell, nicht nur farblich. Fünf Entwürfe mit identischem Abschnittsrhythmus sind ein Entwurf. |
| `JUDGE-SLOP-TEST` | Abschlussfrage: Könnte jemand ohne Zögern sagen „das hat eine KI gemacht"? Ist die Palette allein aus der Branche erratbar? Dann fehlt eine Entscheidung. |

---

## Vorgetäuschter Betrieb

Die folgenden Muster verraten einen generierten Entwurf schneller als jede Farbwahl, weil sie
Zustände behaupten, die es nicht gibt. Sie entstehen, weil das Modell die Oberfläche einer
laufenden Software imitiert, statt Inhalt darzustellen.

| ID | Regel |
|----|-------|
| `JUDGE-FAKE-UI` | Keine aus `div`s gebaute Produkt-Oberfläche oder Fake-Screenshot im Hero. Das ist das häufigste einzelne Verräter-Muster überhaupt. Entweder ein echtes Bild oder eine beschriftete Bildfläche. |
| `JUDGE-FAKE-STATUS` | Nichts, was Betrieb simuliert: Version-Labels im Hero (`V0.6`, `BETA`, `EARLY ACCESS`, `ALPHA`), Build-Nummern und Fake-Version-Footer (`v1.4.2`, `Build 0048`, `last sync 4s ago · main`), Live-Zähler („Reservation 412 von 800"), dekorative farbige Status-Punkte, Fortschritts- oder Score-Balken ohne echten Wert. |
| `JUDGE-DECOR-META` | Keine Metadaten als Dekoration: Wetter- und Zeitstreifen (`LIS 14:23 · 18°C`), Koordinaten, Foto-Credit-Captions (`Field study no. 12 · Ines Caetano`), `01 / 4`-Paginierung auf Bildern oder Kacheln, Textstreifen am Hero-Fuß (`BRAND. MOTION. SPATIAL.`), floatender Subtext rechts oben in Abschnittsüberschriften. Mittelpunkt `·` höchstens einmal pro Zeile. |
| `JUDGE-PLACEHOLDER-DATA` | Keine Platzhalterdaten im Entwurf: `John Doe`, `Acme`, `Nexus`, `SmartFlow`, Egg-Avatare oder Personen-Icons, und keine glatten Fantasiezahlen (`99,99 %`, `50 %`, `1.234.567`). Platzhalterdaten sind das verlässlichste Slop-Signal, weil sie verraten, dass niemand echte Inhalte hatte. Echte Zahl oder gar keine. |
| `JUDGE-SCROLL-CUE` | Keine Scroll-Aufforderung. Kein `Scroll`, kein `↓ scroll`, kein „Scroll to explore", kein animiertes Mausrad-Icon. Wer scrollen kann, weiß das. |
| `JUDGE-TYPE-STUNT` | Keine Schrift-Kunststücke ohne Anlass: mit `<br>` gebrochene und dann kursivierte Headlines, vertikal rotierter Text, Pills und Tags über Bilder gelegt. |
| `JUDGE-ROW-RULES` | Nicht `border-top` **und** `border-bottom` auf jeder Zeile langer Listen und Spec-Tabellen. Eine Trennlinie zwischen zwei Zeilen, nicht zwei. |

---

## Copy

| ID | Regel |
|----|-------|
| `COPY-TRIPLE` | Keine Dreierregel („schnell, sicher, skalierbar"). Auf die ein bis zwei echten Punkte kürzen. |
| `COPY-NOTONLY` | Kein „nicht nur X, sondern Y", kein „mehr als nur X". |
| `COPY-EMPTY` | Keine leeren Superlative und keine Platzhalter-Versprechen („Unlock your potential", „bahnbrechend", „einzigartig"). |
| `COPY-FILLER` | Kein Nominalstil, keine Hedges, keine Meta-Sätze. |
| `COPY-ANGLO` | Keine Floskel-Anglizismen: nahtlos, ganzheitlich, innovativ, state of the art, Game-Changer, next level. |
| `COPY-EMDASH` | Keine Em-Dashes als Konnektor. Komma, Punkt oder Klammer. |
| `COPY-SPECIFIC` | Jeder Nutzenversprechen-Satz nennt etwas Überprüfbares: Zahl, Ablauf, Material, Ort, Frist. Sonst streichen. |
| `COPY-POETIC` | Keine poetischen Rubriken als Ersatz für eine Aussage: „From the field", „Field notes", „Currently on the bench", „On our desks". Ebenso kein „Quietly in use at" oder „Quietly trusted by" — entweder Namen nennen oder weglassen. |

Synonym-Tausch zählt nicht als Behebung. Die neue Formulierung muss inhaltlich anders sein,
nicht das Nachbarwort.

---

## Ausnahmen

Eine Regel darf gebrochen werden, wenn die Begründung im Brief unter „Bewusste Ausnahmen"
steht und benennt, was der Bruch dem Entwurf bringt. Nicht dokumentierte Ausnahmen sind Fehler.
