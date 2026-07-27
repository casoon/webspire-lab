import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env.CI);

// Nicht 4321: darauf läuft gern der Astro-Dev-Server eines anderen Projekts.
// Ein fremder Server auf dem erwarteten Port lässt die Suite gegen die falsche
// Website laufen, und zwar lautlos.
const PORT = 4329;

export default defineConfig({
  testDir: './e2e',
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,

  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixelRatio: 0.01,
    },
  },

  use: {
    baseURL: `http://localhost:${PORT}`,
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    // iPhone-14-Geometrie, aber bewusst in Chromium: geprüft wird das Layout
    // im Mobil-Viewport, nicht die Engine — das spart einen zweiten Browser-Download.
    { name: 'mobile', use: { ...devices['iPhone 14'], browserName: 'chromium' } },
  ],

  // astro preview bedient den statischen dist/-Build — kein zusätzlicher Server nötig.
  // reuseExistingServer bleibt aus: dist/ ändert sich mit jedem Build, ein
  // weiterverwendeter Server liefert also womöglich einen alten Stand oder,
  // schlimmer, ein fremdes Projekt.
  webServer: {
    command: `pnpm preview --port ${PORT}`,
    port: PORT,
    reuseExistingServer: false,
  },
});
