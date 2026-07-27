import { test } from '@playwright/test';
import { previewRoutes } from './routes';

// Artefakte für den visuellen Vergleich zweier Richtungen — keine Baseline-Diffs.
// Deshalb page.screenshot() statt toHaveScreenshot().
const routes = previewRoutes();

// reducedMotion ist seit 1.62 keine Top-Level-Testoption mehr, sondern
// Teil der contextOptions.
test.use({ contextOptions: { reducedMotion: 'reduce' } });

function fileNameFor(route: string): string {
  return route.replace(/^\/|\/$/g, '').replace(/\//g, '__') || 'index';
}

if (routes.length === 0) {
  test.skip('keine Vorschau-Routen gebaut — nichts aufzunehmen', () => {});
}

for (const route of routes) {
  test(`Screenshot: ${route}`, async ({ page }, testInfo) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `screenshots/${testInfo.project.name}/${fileNameFor(route)}.png`,
      fullPage: true,
    });
  });
}
