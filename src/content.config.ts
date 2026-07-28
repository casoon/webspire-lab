import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Drei Collections, drei Zwecke:
 *
 *   references — die Inspirationsbibliothek (Phase 2). Liegt unter design/,
 *                weil sie von Hand gepflegt und gelesen wird, nicht generiert.
 *   briefs     — Briefing + Gestaltungsrahmen je Projekt (Phase 1 + 3).
 *   catalog    — der Vorlagen-Katalog: kuratierte, geprüfte Bausteine (Phase 6).
 *
 * Die Merkmals-Vokabulare (DIRECTIONS, TYPE_VOICE, …) sind absichtlich
 * geschlossene Enums. Freitext-Tags erzeugen nach zwanzig Einträgen Matsch;
 * ein festes Vokabular macht die Bibliothek durchsuchbar und vergleichbar.
 */

export const DIRECTIONS = [
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

const TYPE_VOICE = ['serif-display', 'sans-neutral', 'grotesk-bold', 'mono', 'mixed'] as const;

const LAYOUT_KIND = [
  'grid-12',
  'asymmetric',
  'single-column',
  'split',
  'broadsheet',
  'canvas',
] as const;

const SURFACE_KIND = ['flat', 'bordered', 'cards', 'layered', 'full-bleed'] as const;

export const CATALOG_FAMILY = [
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

/** Neutralstellung aller sechs Achsen. Ein Katalogbaustein, der hiervon abweicht,
 *  braucht dafür einen Grund im entry.md. */
const DEFAULT_AXES = {
  heading: 'sans',
  width: 'normal',
  density: 'balanced',
  accent: 'normal',
  corner: 'soft',
  motion: 'subtle',
} as const;

const axes = z.object({
  heading: z.enum(['sans', 'serif', 'display', 'mono']).default(DEFAULT_AXES.heading),
  width: z.enum(['compact', 'normal', 'wide']).default(DEFAULT_AXES.width),
  density: z.enum(['tight', 'balanced', 'airy']).default(DEFAULT_AXES.density),
  accent: z.enum(['quiet', 'normal', 'strong']).default(DEFAULT_AXES.accent),
  corner: z.enum(['square', 'soft', 'round']).default(DEFAULT_AXES.corner),
  motion: z.enum(['none', 'subtle', 'expressive']).default(DEFAULT_AXES.motion),
});

const references = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './design/references' }),
  schema: z.object({
    /** Mitgelieferte Vorlage: validieren, aber nirgends als Referenz anzeigen. */
    template: z.boolean().default(false),
    title: z.string().min(1),
    /** Reale Website schlägt Dribbble-Shot. Siehe design/README.md, Phase 2. */
    sourceType: z.enum(['live-site', 'shot', 'print', 'app', 'other']),
    url: z.url().optional(),
    captured: z.coerce.date(),
    direction: z.array(z.enum(DIRECTIONS)).min(1),
    typeVoice: z.enum(TYPE_VOICE),
    layout: z.enum(LAYOUT_KIND),
    surface: z.enum(SURFACE_KIND),
    /** Was genau übernommen werden soll — nicht "sieht gut aus". */
    takeaway: z.string().min(20),
    /** Screenshot relativ zu design/references/screenshots/ */
    screenshot: z.string().optional(),
    /** Screens jenseits des Heros. Eine Bibliothek nur aus Heros ist wertlos. */
    covers: z.array(z.enum(CATALOG_FAMILY)).default([]),
  }),
});

const catalog = defineCollection({
  loader: glob({
    pattern: '**/entry.md',
    base: './src/catalog',
    generateId: ({ entry }) => entry.replace(/\/entry\.md$/, ''),
  }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(20).max(200),
    family: z.enum(CATALOG_FAMILY),
    direction: z.array(z.enum(DIRECTIONS)).min(1),
    axes: axes.default(DEFAULT_AXES),
    /** Woher der Baustein stammt — Herkunft ist bei Fremdcode Lizenzfrage. */
    origin: z.enum(['eigen', 'adaptiert', 'extern']).default('eigen'),
    originNote: z.string().optional(),
    /** Erst true, wenn Tastatur + Kontrast + reduced-motion geprüft sind. */
    a11yChecked: z.boolean().default(false),
    /** Client-JS in kB. 0 = statisch. Steht bewusst im Katalog sichtbar. */
    jsWeight: z.number().min(0).default(0),
    updated: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { references, catalog };
