import { getCollection } from 'astro:content';

/** Statische Katalogrouten für Detail- und Vorschauseite. */
export async function catalogStaticPaths() {
  const entries = await getCollection('catalog', ({ data }) => !data.draft);
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}
