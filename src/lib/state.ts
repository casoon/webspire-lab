import { getCollection } from 'astro:content';
import { CATALOG_FAMILY } from '../content.config';

/**
 * Zustand des Labs, aus den vorhandenen Artefakten abgeleitet.
 *
 * Die Startseite soll nicht acht Phasen aufzählen, sondern sagen, was JETZT
 * dran ist. Dafür braucht sie einen Blick auf alles: Referenzen, Briefings,
 * gebaute Richtungen, Katalog.
 *
 * Die Reihenfolge der Prüfungen ist die Reihenfolge des Verfahrens. Der erste
 * Schritt, der nicht erledigt ist, ist der nächste Schritt. Kein Springen.
 */

// `?raw` ist hier keine Marotte, sondern Pflicht: ein Glob auf Seitenmodule
// hängt deren CSS an die importierende Seite — auch ohne `eager`. Die
// Startseite hat dadurch die Farbwelt einer Designrichtung geerbt.
// Als Rohtext gibt es kein CSS im Modulgraph, und gebraucht werden ohnehin
// nur die Schlüssel.
const runIndexes = import.meta.glob('/src/pages/lab/*/index.astro', {
  query: '?raw',
  import: 'default',
});
const directionPages = import.meta.glob('/src/pages/lab/*/richtungen/*.astro', {
  query: '?raw',
  import: 'default',
});

/** Screens, an denen generierte Entwürfe real scheitern. */
const CRITICAL_FAMILIES = ['form', 'table', 'nav', 'error', 'empty-state', 'cookie'] as const;

const REFERENCE_TARGET = 15;
const DIRECTION_TARGET = 5;
const SUBVARIANT_TARGET = 3;

interface Step {
  /** Phasennummer aus design/README.md */
  phase: number;
  title: string;
  /** Was konkret zu tun ist. Ein Satz, Imperativ. */
  action: string;
  /** Warum jetzt und nicht später. */
  why: string;
  /** Slash-Command, falls einer passt. */
  command?: string;
  /** Wo das Ergebnis landet. */
  target?: string;
}

type PhaseState = 'done' | 'current' | 'open';

interface Phase {
  n: number;
  title: string;
  state: PhaseState;
  /** Ein Satz zum Stand, oder null wenn nichts zu sagen ist. */
  note: string | null;
}

function runSlugs() {
  return Object.keys(runIndexes)
    .map((path) => path.replace('/src/pages/lab/', '').replace('/index.astro', ''))
    .sort();
}

function directionsOf(runSlug: string) {
  const prefix = `/src/pages/lab/${runSlug}/richtungen/`;
  return Object.keys(directionPages)
    .filter((path) => path.startsWith(prefix))
    .map((path) => path.slice(prefix.length).replace('.astro', ''))
    .sort();
}

export async function labState() {
  const [allReferences, allBriefs, catalog] = await Promise.all([
    getCollection('references'),
    getCollection('briefs'),
    getCollection('catalog', ({ data }) => !data.draft),
  ]);
  const references = allReferences.filter((reference) => !reference.data.template);
  const briefs = allBriefs.filter((brief) => !brief.data.template);

  const liveSites = references.filter((ref) => ref.data.sourceType === 'live-site').length;
  const coveredByReferences = new Set(references.flatMap((ref) => ref.data.covers));
  const missingCritical = CRITICAL_FAMILIES.filter((family) => !coveredByReferences.has(family));

  const runs = runSlugs().map((slug) => ({ slug, directions: directionsOf(slug) }));
  const runBySlug = new Map(runs.map((run) => [run.slug, run]));

  // Aktiv ist das zuletzt angefasste Briefing, das noch nicht übernommen wurde.
  const openBriefs = briefs
    .filter((brief) => brief.data.status !== 'shipped')
    .sort((a, b) => b.data.updated.valueOf() - a.data.updated.valueOf());
  const active = openBriefs[0] ?? null;
  const activeRun = active ? runBySlug.get(active.id) : undefined;
  const activeDirections = activeRun?.directions.length ?? 0;

  const catalogFamilies = new Set(catalog.map((entry) => entry.data.family));
  const unchecked = catalog.filter((entry) => !entry.data.a11yChecked);

  const next = nextStep();
  const phases = buildPhases(next.phase);

  return {
    references: {
      total: references.length,
      target: REFERENCE_TARGET,
      liveShare: references.length ? Math.round((liveSites / references.length) * 100) : 0,
      missingCritical,
    },
    briefs,
    active,
    runs,
    activeDirections,
    catalog: {
      total: catalog.length,
      unchecked: unchecked.length,
      missingFamilies: CATALOG_FAMILY.filter((family) => !catalogFamilies.has(family)),
    },
    next,
    phases,
  };

  function nextStep(): Step {
    if (briefs.length === 0) {
      return {
        phase: 1,
        title: 'Briefing anlegen',
        action: 'Erstes Briefing schreiben: ein Ziel, eine primäre Aktion, echte Zielgruppe.',
        why: 'Ohne Briefing ist jede spätere Bewertung Geschmackssache.',
        command: '/design-brief',
        target: 'design/briefs/<projekt>.md',
      };
    }

    if (references.length < REFERENCE_TARGET) {
      const fehlen = REFERENCE_TARGET - references.length;
      return {
        phase: 2,
        title: 'Referenzbibliothek füllen',
        action: `Noch ${fehlen} Referenz${fehlen === 1 ? '' : 'en'} erfassen, bevorzugt reale Websites${
          missingCritical.length ? ` mit ${missingCritical.slice(0, 3).join(', ')}` : ''
        }.`,
        why: 'Unter 15 Einträgen trägt die Bibliothek keine Entscheidung, und die KI arbeitet aus dem Vakuum.',
        command: '/inspiration-capture',
        target: 'design/references/',
      };
    }

    if (active && active.data.status === 'brief') {
      return {
        phase: 3,
        title: 'Gestaltungsrahmen ableiten',
        action: `Teil 2 in ${active.id}.md ausfüllen: Richtung, Typografie, Farben, Layout, Bildsprache, Bewegung, Signatur.`,
        why: 'Der Rahmen entsteht aus der Bibliothek, nicht aus dem Bauch. Ab dann ist er die Messlatte.',
        command: '/design-brief',
        target: `design/briefs/${active.id}.md`,
      };
    }

    if (active && activeDirections < DIRECTION_TARGET) {
      const fehlen = DIRECTION_TARGET - activeDirections;
      return {
        phase: 4,
        title: 'Richtungen bauen',
        action: `Noch ${fehlen} Richtung${fehlen === 1 ? '' : 'en'} für ${active.id} bauen, alle mit demselben Inhalt und derselben primären Aktion.`,
        why: 'Fünf Richtungen nebeneinander. Einzeln wirkt fast jeder Entwurf überzeugend.',
        command: '/design-directions-lab',
        target: `src/pages/lab/${active.id}/richtungen/`,
      };
    }

    if (active && active.data.status === 'directions') {
      return {
        phase: 5,
        title: 'Vergleichen und entscheiden',
        action: `/lab/${active.id}/ nebeneinander ansehen, eine Richtung wählen, daraus ${SUBVARIANT_TARGET} Untervarianten bauen.`,
        why: 'Nicht fünf neue Designs. Farbwelt und Typografie bleiben, variiert werden Aufbau, CTA-Position und Rhythmus.',
        command: '/design-directions-lab',
        target: `design/briefs/${active.id}.md (Teil 3)`,
      };
    }

    if (active && active.data.status === 'refining') {
      return {
        phase: 8,
        title: 'Prüfen',
        action:
          'pnpm test:e2e und pnpm test:shots laufen lassen, danach die Befundliste erstellen.',
        why: 'Die Gestaltungsprüfung ist eine eigene Schleife. Wer sie mit dem Entwerfen vermischt, verliert beides.',
        command: '/slop-review',
        target: 'Befundliste',
      };
    }

    if (unchecked.length > 0) {
      return {
        phase: 6,
        title: 'Katalog aufräumen',
        action: `${unchecked.length} Baustein${unchecked.length === 1 ? '' : 'e'} ohne a11y-Prüfung: Tastatur, Kontrast und reduced-motion nachweisen oder auf draft setzen.`,
        why: 'Ein Katalog aus ungeprüften Schnipseln ist eine Haftungsfalle, keine Hilfe.',
        command: '/design-catalog-entry',
        target: 'src/catalog/',
      };
    }

    if (active && active.data.status === 'decided') {
      return {
        phase: 6,
        title: 'Übernehmen',
        action: `Gewählte Richtung in das Zielprojekt überführen, wiederverwendbare Teile in den Katalog, ${active.id} auf shipped setzen.`,
        why: 'Was hier überzeugt, gehört ins Kundenprojekt. Das Lab ist keine Produktionsumgebung.',
        command: '/design-catalog-entry',
        target: 'src/catalog/',
      };
    }

    if (catalog.length > 0 && CATALOG_FAMILY.some((family) => !catalogFamilies.has(family))) {
      const missing = CATALOG_FAMILY.filter((family) => !catalogFamilies.has(family));
      return {
        phase: 6,
        title: 'Katalog verbreitern',
        action: `Bausteine für ${missing.slice(0, 3).join(', ')} ergänzen.`,
        why: 'Formulare, Tabellen und Fehlerzustände sind die Screens, an denen generierte Designs scheitern. Nicht noch ein Hero.',
        command: '/design-catalog-entry',
        target: 'src/catalog/',
      };
    }

    return {
      phase: 1,
      title: 'Nächstes Projekt',
      action: 'Alle Läufe sind abgeschlossen. Neues Briefing anlegen.',
      why: 'Nichts offen.',
      command: '/design-brief',
      target: 'design/briefs/<projekt>.md',
    };
  }

  function buildPhases(currentPhase: number): Phase[] {
    const stateOf = (n: number): PhaseState =>
      n === currentPhase ? 'current' : n < currentPhase ? 'done' : 'open';

    return [
      {
        n: 1,
        title: 'Briefing',
        state: stateOf(1),
        note: briefs.length
          ? `${briefs.length} Briefing${briefs.length === 1 ? '' : 's'}${active ? `, aktiv: ${active.id}` : ''}`
          : 'noch keins',
      },
      {
        n: 2,
        title: 'Referenzen sammeln',
        state: references.length >= REFERENCE_TARGET ? 'done' : stateOf(2),
        note:
          references.length >= REFERENCE_TARGET
            ? `${references.length} Einträge, ${references.length ? Math.round((liveSites / references.length) * 100) : 0}% reale Websites`
            : `${references.length} von ${REFERENCE_TARGET}`,
      },
      {
        n: 3,
        title: 'Gestaltungsrahmen',
        state: stateOf(3),
        note: active ? `Status: ${active.data.status}` : null,
      },
      {
        n: 4,
        title: 'Fünf Richtungen',
        state: activeDirections >= DIRECTION_TARGET ? 'done' : stateOf(4),
        note: active ? `${activeDirections} von ${DIRECTION_TARGET} gebaut` : null,
      },
      {
        n: 5,
        title: 'Wählen, drei Untervarianten',
        state: stateOf(5),
        note: active?.data.chosenDirection ? `gewählt: ${active.data.chosenDirection}` : null,
      },
      {
        n: 6,
        title: 'Bausteine und Assets',
        state: stateOf(6),
        note: `${catalog.length} im Katalog${unchecked.length ? `, ${unchecked.length} ungeprüft` : ''}`,
      },
      {
        n: 7,
        title: 'Achsen feinjustieren',
        state: stateOf(7),
        note: 'jederzeit unter /achsen/',
      },
      {
        n: 8,
        title: 'Technische Prüfung',
        state: stateOf(8),
        note: 'pnpm test:e2e, dann /slop-review',
      },
    ];
  }
}
