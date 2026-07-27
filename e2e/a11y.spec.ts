import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { allRoutes } from './routes';

const routes = allRoutes();

// Tests werden zur Modulzeit erzeugt: ein Test pro Route, damit im Report
// direkt sichtbar ist, welche Route fehlschlägt.
test.describe('axe', () => {
  if (routes.length === 0) {
    test.skip('keine gebauten Routen gefunden — dist/ ist leer', () => {});
  }

  for (const route of routes) {
    test(`ohne Verstöße: ${route}`, async ({ page }) => {
      await page.goto(route);
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
        .analyze();

      const report = violations.map(
        (violation) =>
          `${violation.id} (${violation.impact}): ${violation.help}\n  ${violation.nodes
            .map((node) => node.target.join(' '))
            .join('\n  ')}`
      );
      expect(report, `axe-Verstöße auf ${route}`).toEqual([]);
    });
  }
});

test.describe('Überschriften', () => {
  if (routes.length === 0) {
    test.skip('keine gebauten Routen gefunden — dist/ ist leer', () => {});
  }

  for (const route of routes) {
    test(`genau ein h1: ${route}`, async ({ page }) => {
      await page.goto(route);
      const headlines = await page.locator('h1').allTextContents();
      expect(headlines, `h1-Elemente auf ${route}`).toHaveLength(1);
    });

    test(`keine Überschriftensprünge: ${route}`, async ({ page }) => {
      await page.goto(route);
      const levels = await page.evaluate(() =>
        [...document.querySelectorAll('h1, h2, h3, h4, h5, h6')].map((heading) => ({
          level: Number(heading.tagName[1]),
          text: (heading.textContent ?? '').trim().slice(0, 40),
        }))
      );

      const jumps = levels.flatMap((heading, index) => {
        if (index === 0) return [];
        const previous = levels[index - 1];
        if (heading.level - previous.level <= 1) return [];
        return [`h${previous.level} → h${heading.level} bei "${heading.text}"`];
      });
      expect(jumps, `Überschriftensprünge auf ${route}`).toEqual([]);
    });
  }
});

test.describe('Bilder', () => {
  if (routes.length === 0) {
    test.skip('keine gebauten Routen gefunden — dist/ ist leer', () => {});
  }

  for (const route of routes) {
    test(`jedes img hat alt: ${route}`, async ({ page }) => {
      await page.goto(route);
      // Leeres alt ist erlaubt (dekorativ), ein fehlendes Attribut nicht.
      const withoutAlt = await page.evaluate(() =>
        [...document.querySelectorAll('img')]
          .filter((image) => !image.hasAttribute('alt'))
          .map((image) => image.getAttribute('src') ?? '(ohne src)')
      );
      expect(withoutAlt, `img ohne alt-Attribut auf ${route}`).toEqual([]);
    });
  }
});

test.describe('Fokus', () => {
  if (routes.length === 0) {
    test.skip('keine gebauten Routen gefunden — dist/ ist leer', () => {});
  }

  for (const route of routes) {
    test(`erstes Tab-Ziel ist sichtbar fokussiert: ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.keyboard.press('Tab');

      // Erst den fokussierten Zustand auslesen, dann blur — getComputedStyle ist live.
      const focus = await page.evaluate(() => {
        const active = document.activeElement as HTMLElement | null;
        if (!active || active === document.body || active === document.documentElement) {
          return null;
        }
        const style = getComputedStyle(active);
        const focused = {
          outlineWidth: style.outlineWidth,
          outlineStyle: style.outlineStyle,
          boxShadow: style.boxShadow,
        };
        active.blur();
        const idle = getComputedStyle(active);
        return {
          label: `${active.tagName.toLowerCase()}${active.id ? `#${active.id}` : ''}`,
          focused,
          idle: {
            outlineWidth: idle.outlineWidth,
            outlineStyle: idle.outlineStyle,
            boxShadow: idle.boxShadow,
          },
        };
      });

      test.skip(focus === null, 'keine fokussierbaren Elemente auf dieser Seite');
      if (!focus) return;

      const hasOutline =
        focus.focused.outlineStyle !== 'none' &&
        Number.parseFloat(focus.focused.outlineWidth) > 0 &&
        focus.focused.outlineWidth !== focus.idle.outlineWidth;
      const hasShadow =
        focus.focused.boxShadow !== 'none' && focus.focused.boxShadow !== focus.idle.boxShadow;

      expect(
        hasOutline || hasShadow,
        `${focus.label} auf ${route} verändert im Fokus weder outline-width noch box-shadow ` +
          `(fokussiert: outline ${focus.focused.outlineWidth} ${focus.focused.outlineStyle}, ` +
          `shadow ${focus.focused.boxShadow})`
      ).toBe(true);
    });
  }
});
