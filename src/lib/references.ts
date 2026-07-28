export const REFERENCE_DIRECTIONS = [
  'editorial',
  'corporate',
  'premium',
  'bold-branding',
  'minimal',
  'tech',
  'storytelling',
  'conversion',
  'content-first',
  'brand-first',
] as const;

export const REFERENCE_COVERS = [
  'hero',
  'nav',
  'section',
  'feature',
  'pricing',
  'faq',
  'form',
  'table',
  'footer',
  'empty-state',
  'error',
  'cookie',
] as const;

export interface Reference {
  schemaVersion: 1;
  slug: string;
  title: string;
  sourceType: 'live-site' | 'shot' | 'print' | 'app' | 'other';
  url: string;
  capturedAt: string;
  direction: string[];
  typeVoice: 'serif-display' | 'sans-neutral' | 'grotesk-bold' | 'mono' | 'mixed';
  layout: 'grid-12' | 'asymmetric' | 'single-column' | 'split' | 'broadsheet' | 'canvas';
  surface: 'flat' | 'bordered' | 'cards' | 'layered' | 'full-bleed';
  takeaway: string;
  covers: string[];
}

const referenceFiles = import.meta.glob<{ default: unknown }>('/lab.config/references/*.json', {
  eager: true,
});

function toReference(value: unknown): Reference | null {
  if (!value || typeof value !== 'object') return null;
  const reference = value as Record<string, unknown>;
  const isStringArray = (input: unknown) =>
    Array.isArray(input) && input.every((item) => typeof item === 'string');

  if (
    reference.schemaVersion !== 1 ||
    !['slug', 'title', 'url', 'capturedAt', 'takeaway'].every(
      (key) => typeof reference[key] === 'string'
    ) ||
    !['live-site', 'shot', 'print', 'app', 'other'].includes(reference.sourceType as string) ||
    !['serif-display', 'sans-neutral', 'grotesk-bold', 'mono', 'mixed'].includes(
      reference.typeVoice as string
    ) ||
    !['grid-12', 'asymmetric', 'single-column', 'split', 'broadsheet', 'canvas'].includes(
      reference.layout as string
    ) ||
    !['flat', 'bordered', 'cards', 'layered', 'full-bleed'].includes(reference.surface as string) ||
    !isStringArray(reference.direction) ||
    !isStringArray(reference.covers)
  ) {
    return null;
  }

  return reference as unknown as Reference;
}

export function getReferences(): Reference[] {
  return Object.values(referenceFiles)
    .map((module) => toReference(module.default))
    .filter((reference): reference is Reference => reference !== null)
    .sort((a, b) => b.capturedAt.localeCompare(a.capturedAt) || a.slug.localeCompare(b.slug));
}
