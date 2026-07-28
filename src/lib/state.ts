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

interface ProjectState {
  slug: string;
  title: string;
  goal: string | null;
  status: string | null;
  directions: string[];
  hasRun: boolean;
  next: Step | null;
  phases: Phase[];
  updated: number;
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

  const projects = [...new Set([...briefs.map((brief) => brief.id), ...runBySlug.keys()])]
    .map((slug): ProjectState => {
      const brief = briefs.find((entry) => entry.id === slug);
      const directions = runBySlug.get(slug)?.directions ?? [];
      const next = nextStep(slug, brief, directions.length);

      return {
        slug,
        title: brief?.data.title ?? slug,
        goal: brief?.data.goal ?? null,
        status: brief?.data.status ?? null,
        directions,
        hasRun: runBySlug.has(slug),
        next,
        phases: buildPhases(next?.phase ?? null, brief, directions.length),
        updated: brief?.data.updated.valueOf() ?? 0,
      };
    })
    .sort((a, b) => b.updated - a.updated || a.slug.localeCompare(b.slug));

  const catalogFamilies = new Set(catalog.map((entry) => entry.data.family));
  const unchecked = catalog.filter((entry) => !entry.data.a11yChecked);

  return {
    references: {
      total: references.length,
      target: REFERENCE_TARGET,
      liveShare: references.length ? Math.round((liveSites / references.length) * 100) : 0,
      missingCritical,
    },
    projects,
    catalog: {
      total: catalog.length,
      unchecked: unchecked.length,
      missingFamilies: CATALOG_FAMILY.filter((family) => !catalogFamilies.has(family)),
    },
  };

  function nextStep(
    slug: string,
    brief: (typeof briefs)[number] | undefined,
    directionCount: number
  ): Step | null {
    if (!brief) {
      return {
        phase: 1,
        title: 'Briefing zuordnen',
        action: `Briefing für ${slug} anlegen: ein Ziel, eine primäre Aktion, echte Zielgruppe.`,
        why: 'Ohne Briefing ist der vorhandene Vergleich nicht bewertbar.',
        command: '/design-brief',
        target: `design/briefs/${slug}.md`,
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

    if (brief.data.status === 'brief') {
      return {
        phase: 3,
        title: 'Gestaltungsrahmen ableiten',
        action: `Teil 2 in ${slug}.md ausfüllen: Richtung, Typografie, Farben, Layout, Bildsprache, Bewegung, Signatur.`,
        why: 'Der Rahmen entsteht aus der Bibliothek, nicht aus dem Bauch. Ab dann ist er die Messlatte.',
        command: '/design-brief',
        target: `design/briefs/${slug}.md`,
      };
    }

    if (directionCount < DIRECTION_TARGET) {
      const fehlen = DIRECTION_TARGET - directionCount;
      return {
        phase: 4,
        title: 'Richtungen bauen',
        action: `Noch ${fehlen} Richtung${fehlen === 1 ? '' : 'en'} für ${slug} bauen, alle mit demselben Inhalt und derselben primären Aktion.`,
        why: 'Fünf Richtungen nebeneinander. Einzeln wirkt fast jeder Entwurf überzeugend.',
        command: '/design-directions-lab',
        target: `src/pages/lab/${slug}/richtungen/`,
      };
    }

    if (brief.data.status === 'directions') {
      return {
        phase: 5,
        title: 'Vergleichen und entscheiden',
        action: `/lab/${slug}/ nebeneinander ansehen, eine Richtung wählen, daraus ${SUBVARIANT_TARGET} Untervarianten bauen.`,
        why: 'Nicht fünf neue Designs. Farbwelt und Typografie bleiben, variiert werden Aufbau, CTA-Position und Rhythmus.',
        command: '/design-directions-lab',
        target: `design/briefs/${slug}.md (Teil 3)`,
      };
    }

    if (brief.data.status === 'refining') {
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

    if (brief.data.status === 'decided') {
      return {
        phase: 6,
        title: 'Übernehmen',
        action: `Gewählte Richtung in das Zielprojekt überführen, wiederverwendbare Teile in den Katalog, ${slug} auf shipped setzen.`,
        why: 'Was hier überzeugt, gehört ins Kundenprojekt. Das Lab ist keine Produktionsumgebung.',
        command: '/design-catalog-entry',
        target: 'src/catalog/',
      };
    }

    return null;
  }

  function buildPhases(
    currentPhase: number | null,
    brief: (typeof briefs)[number] | undefined,
    directionCount: number
  ): Phase[] {
    const stateOf = (n: number): PhaseState =>
      currentPhase === null
        ? 'done'
        : n === currentPhase
          ? 'current'
          : n < currentPhase
            ? 'done'
            : 'open';

    return [
      {
        n: 1,
        title: 'Briefing',
        state: stateOf(1),
        note: brief ? `Status: ${brief.data.status}` : 'fehlt',
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
        note: brief ? `Status: ${brief.data.status}` : null,
      },
      {
        n: 4,
        title: 'Fünf Richtungen',
        state: directionCount >= DIRECTION_TARGET ? 'done' : stateOf(4),
        note: `${directionCount} von ${DIRECTION_TARGET} gebaut`,
      },
      {
        n: 5,
        title: 'Wählen, drei Untervarianten',
        state: stateOf(5),
        note: brief?.data.chosenDirection ? `gewählt: ${brief.data.chosenDirection}` : null,
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
