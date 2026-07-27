import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Die Routen kommen aus dem gebauten dist/ und nicht aus einer gepflegten Liste:
// Richtungen und Katalogeinträge entstehen laufend, eine Liste wäre sofort veraltet.
const distDir = fileURLToPath(new URL('../dist/', import.meta.url));

// trailingSlash: 'always' — jede Route endet auf '/', dist/index.html ist '/'.
function collect(dir: string, prefix: string, found: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      collect(join(dir, entry.name), `${prefix}${entry.name}/`, found);
    } else if (entry.name === 'index.html') {
      found.push(prefix);
    }
  }
}

export function allRoutes(): string[] {
  if (!existsSync(distDir)) return [];
  const found: string[] = [];
  collect(distDir, '/', found);
  return found.sort();
}

/** Die Lab-Oberfläche eines Laufs inklusive seiner Unterseiten. */
export function labRoutes(): string[] {
  return allRoutes().filter((route) => route.startsWith('/lab/'));
}

/** Entwürfe: Katalog-Vorschauen und die Richtungen eines Lab-Laufs. */
export function previewRoutes(): string[] {
  return allRoutes().filter(isPreviewRoute);
}

/** Alles, was Werkzeug ist statt Entwurf: Startseite, Katalog, Achsen, Referenzen, Lab-Index. */
export function chromeRoutes(): string[] {
  return allRoutes().filter((route) => !isPreviewRoute(route));
}

function isPreviewRoute(route: string): boolean {
  return route.startsWith('/vorschau/') || /^\/lab\/[^/]+\/richtungen\//.test(route);
}
