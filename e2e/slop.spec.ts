import { expect, type Page, test } from '@playwright/test';
import { previewRoutes } from './routes';

// Nur Entwürfe werden geprüft. Die Lab-Oberfläche selbst ist Werkzeug,
// kein Entwurf, und darf von diesen Regeln abweichen.
const routes = previewRoutes();

// Katalogbausteine sind Fragmente: sie haben bewusst keine Display-Größe und
// keinen Abschnittsrhythmus. Regeln, die über die ganze Seite urteilen, gelten
// deshalb nur für Richtungsseiten.
const isFullPage = (route: string) => !route.startsWith('/vorschau/');

const RULES = [
  'SLOP-GHOST-CARD',
  'SLOP-OVERROUND',
  'SLOP-SIDE-STRIPE',
  'SLOP-GRADIENT-TEXT',
  'SLOP-HERO-SIZE',
  'SLOP-TRACKING',
  'SLOP-MEASURE',
  'SLOP-REFLEX-FONT',
  'SLOP-FLAT-TYPE',
  'SLOP-NESTED-SURFACE',
  'SLOP-JUSTIFY',
  'SLOP-CAPS-BODY',
  'SLOP-LEADING',
  'SLOP-TINY-TEXT',
  'SLOP-INFINITE-MOTION',
  'SLOP-BOUNCE-EASING',
  'SLOP-GLOW',
  'SLOP-DECOR-GRADIENT',
  'SLOP-EYEBROW-COUNT',
  'SLOP-ROW-DOUBLE-RULE',
  'SLOP-TRANSITION-ALL',
  'SLOP-ANIMATE-LAYOUT',
] as const;

type Findings = Record<(typeof RULES)[number], string[]>;

function scan(page: Page, fullPage: boolean): Promise<Findings> {
  return page.evaluate((pageLevel) => {
    const findings: Record<string, string[]> = {};
    for (const rule of [
      'SLOP-GHOST-CARD',
      'SLOP-OVERROUND',
      'SLOP-SIDE-STRIPE',
      'SLOP-GRADIENT-TEXT',
      'SLOP-HERO-SIZE',
      'SLOP-TRACKING',
      'SLOP-MEASURE',
      'SLOP-REFLEX-FONT',
      'SLOP-FLAT-TYPE',
      'SLOP-NESTED-SURFACE',
      'SLOP-JUSTIFY',
      'SLOP-CAPS-BODY',
      'SLOP-LEADING',
      'SLOP-TINY-TEXT',
      'SLOP-INFINITE-MOTION',
      'SLOP-BOUNCE-EASING',
      'SLOP-GLOW',
      'SLOP-DECOR-GRADIENT',
      'SLOP-EYEBROW-COUNT',
      'SLOP-ROW-DOUBLE-RULE',
      'SLOP-TRANSITION-ALL',
      'SLOP-ANIMATE-LAYOUT',
    ]) {
      findings[rule] = [];
    }

    const px = (value: string) => Number.parseFloat(value) || 0;

    const isTransparent = (color: string) =>
      color === 'transparent' || /rgba?\([^)]*,\s*0\s*\)/.test(color);

    // Schriften, die keine Entscheidung sind, sondern das Fehlen einer.
    const REFLEX_FONTS = [
      'inter',
      'plus jakarta',
      'geist',
      'manrope',
      'poppins',
      'dm sans',
      'space grotesk',
    ];

    // Eigenschaften, deren Animation Layout auslöst (siehe motion-design).
    const LAYOUT_PROPS = [
      'width',
      'height',
      'top',
      'left',
      'right',
      'bottom',
      'margin',
      'padding',
      'border-width',
      'font-size',
      'line-height',
    ];

    // Farbfunktionen entfernen, dann sind die verbleibenden px-Werte die Längen:
    // x-Offset, y-Offset, Blur, Spread.
    const shadowLengths = (value: string) => {
      if (!value || value === 'none') return [] as number[][];
      const withoutColors = value.replace(/(rgba?|hsla?|color|oklch|lab)\([^)]*\)/g, '');
      return withoutColors
        .split(',')
        .map((shadow) => (shadow.match(/-?[\d.]+px/g) ?? []).map(Number.parseFloat));
    };

    const maxShadowBlur = (value: string) =>
      Math.max(0, ...shadowLengths(value).map((lengths) => Math.abs(lengths[2] ?? 0)));

    const selectorFor = (element: Element) => {
      const parts: string[] = [];
      let node: Element | null = element;
      while (node && parts.length < 3) {
        if (node.id) {
          parts.unshift(`#${node.id}`);
          break;
        }
        const classes = [...node.classList].slice(0, 2).map((name) => `.${name}`);
        parts.unshift(node.tagName.toLowerCase() + classes.join(''));
        node = node.parentElement;
      }
      return parts.join(' > ');
    };

    const hasDirectText = (element: Element) =>
      [...element.childNodes].some(
        (node) => node.nodeType === Node.TEXT_NODE && (node.textContent ?? '').trim().length > 0
      );

    const directText = (element: Element) =>
      [...element.childNodes]
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => (node.textContent ?? '').trim())
        .join(' ')
        .trim();

    const elements = [...document.body.querySelectorAll<HTMLElement>('*')].filter((element) => {
      if (element.namespaceURI !== 'http://www.w3.org/1999/xhtml') return false;
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });

    /** Eine „Fläche": hat einen sichtbaren Rahmen oder einen eigenen Hintergrund. */
    const isSurface = (style: CSSStyleDeclaration) => {
      const borders = (['top', 'right', 'bottom', 'left'] as const).some(
        (side) =>
          px(style.getPropertyValue(`border-${side}-width`)) >= 1 &&
          style.getPropertyValue(`border-${side}-style`) !== 'none' &&
          !isTransparent(style.getPropertyValue(`border-${side}-color`))
      );
      return borders || !isTransparent(style.backgroundColor);
    };

    const maxRadiusOf = (style: CSSStyleDeclaration) =>
      Math.max(
        ...(['top-left', 'top-right', 'bottom-right', 'bottom-left'] as const).map((corner) =>
          px(style.getPropertyValue(`border-${corner}-radius`))
        )
      );

    const fontSizes = new Set<number>();
    const eyebrows: string[] = [];

    for (const element of elements) {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const where = selectorFor(element);

      const sides = (['Top', 'Right', 'Bottom', 'Left'] as const).map((side) => ({
        side,
        width: px(style.getPropertyValue(`border-${side.toLowerCase()}-width`)),
        style: style.getPropertyValue(`border-${side.toLowerCase()}-style`),
        color: style.getPropertyValue(`border-${side.toLowerCase()}-color`),
      }));

      const visibleBorder = sides.find(
        (side) => side.width >= 1 && side.style !== 'none' && !isTransparent(side.color)
      );
      const blur = maxShadowBlur(style.boxShadow);
      if (visibleBorder && blur >= 16) {
        findings['SLOP-GHOST-CARD'].push(
          `SLOP-GHOST-CARD: ${where} — sichtbare border (${visibleBorder.width}px ${visibleBorder.side.toLowerCase()}) UND box-shadow mit ${blur}px Blur`
        );
      }

      // Halo statt Schatten: kein Versatz, aber weicher Blur. Dekoration.
      for (const lengths of shadowLengths(style.boxShadow)) {
        const [offsetX = 0, offsetY = 0, shadowBlur = 0] = lengths;
        if (offsetX === 0 && offsetY === 0 && shadowBlur >= 16) {
          findings['SLOP-GLOW'].push(
            `SLOP-GLOW: ${where} — box-shadow ohne Versatz mit ${shadowBlur}px Blur ist ein Glow, kein Schatten`
          );
          break;
        }
      }

      const backgroundImage = style.backgroundImage;
      if (/repeating-linear-gradient|radial-gradient/.test(backgroundImage)) {
        const kind = backgroundImage.includes('repeating-linear-gradient')
          ? 'repeating-linear-gradient (Streifen)'
          : 'radial-gradient (Halo)';
        findings['SLOP-DECOR-GRADIENT'].push(`SLOP-DECOR-GRADIENT: ${where} — ${kind}`);
      }

      // Pill-Heuristik: flache Elemente dürfen stark gerundet sein, hohe nicht.
      if (rect.height > 60) {
        const maxRadius = maxRadiusOf(style);
        if (maxRadius >= 24) {
          findings['SLOP-OVERROUND'].push(
            `SLOP-OVERROUND: ${where} — border-radius ${maxRadius}px bei ${Math.round(rect.height)}px Höhe`
          );
        }
      }

      // Konzentrische Radien: die äußere Fläche muss stärker gerundet sein als
      // die innere. Gleicher oder größerer Innenradius lässt eine UI kippen.
      const radius = maxRadiusOf(style);
      if (radius > 0 && isSurface(style)) {
        for (const parent of [element.parentElement].filter(Boolean) as HTMLElement[]) {
          const parentStyle = getComputedStyle(parent);
          const parentRadius = maxRadiusOf(parentStyle);
          if (parentRadius > 0 && isSurface(parentStyle) && radius >= parentRadius) {
            findings['SLOP-NESTED-SURFACE'].push(
              `SLOP-NESTED-SURFACE: ${where} — Innenradius ${radius}px >= Außenradius ${parentRadius}px bei verschachtelten Flächen`
            );
          }
        }
      }

      const [top, right, bottom, left] = sides.map((side) => side.width);
      const stripeLeft = left > 1 && top === 0 && right === 0 && bottom === 0;
      const stripeRight = right > 1 && top === 0 && left === 0 && bottom === 0;
      if (stripeLeft || stripeRight) {
        findings['SLOP-SIDE-STRIPE'].push(
          `SLOP-SIDE-STRIPE: ${where} — nur ${stripeLeft ? 'linke' : 'rechte'} Kante mit ${stripeLeft ? left : right}px Rahmen`
        );
      }

      if (
        style.backgroundClip === 'text' ||
        style.getPropertyValue('-webkit-background-clip') === 'text'
      ) {
        findings['SLOP-GRADIENT-TEXT'].push(`SLOP-GRADIENT-TEXT: ${where} — background-clip: text`);
      }

      // `transition-property` ist per Initialwert `all`. Ohne Laufzeit gibt es
      // aber keine Transition — sonst meldet die Regel jedes Element der Seite.
      const hasTransition = style.transitionDuration
        .split(',')
        .some((duration) => Number.parseFloat(duration) > 0);

      if (hasTransition) {
        if (style.transitionProperty.split(',').some((prop) => prop.trim() === 'all')) {
          findings['SLOP-TRANSITION-ALL'].push(
            `SLOP-TRANSITION-ALL: ${where} — transition-property: all, Eigenschaften einzeln benennen`
          );
        }

        const animated = style.transitionProperty
          .split(',')
          .map((prop) => prop.trim())
          .filter((prop) => LAYOUT_PROPS.includes(prop));
        if (animated.length > 0) {
          findings['SLOP-ANIMATE-LAYOUT'].push(
            `SLOP-ANIMATE-LAYOUT: ${where} — animiert Layout-Eigenschaft(en) ${animated.join(', ')}, nur transform und opacity animieren`
          );
        }
      }

      if (style.animationName !== 'none' && style.animationIterationCount.includes('infinite')) {
        findings['SLOP-INFINITE-MOTION'].push(
          `SLOP-INFINITE-MOTION: ${where} — Endlos-Animation "${style.animationName}" (Marquee, Puls, Blinken)`
        );
      }

      // Überschwingende Easing-Kurven: y-Werte außerhalb 0..1 sind Bounce.
      // Nur dort prüfen, wo überhaupt etwas läuft.
      const timings = [
        hasTransition ? style.transitionTimingFunction : '',
        style.animationName !== 'none' ? style.animationTimingFunction : '',
      ];
      for (const timing of timings) {
        const bezier = timing.match(/cubic-bezier\(([^)]+)\)/);
        if (!bezier) continue;
        const [, y1, , y2] = bezier[1].split(',').map((part) => Number.parseFloat(part));
        if (y1 > 1 || y2 > 1 || y1 < 0 || y2 < 0) {
          findings['SLOP-BOUNCE-EASING'].push(
            `SLOP-BOUNCE-EASING: ${where} — ${timing} schwingt über, exponentielles ease-out verwenden`
          );
          break;
        }
      }

      if (!hasDirectText(element)) continue;

      const fontSize = px(style.fontSize);
      fontSizes.add(Math.round(fontSize * 10) / 10);

      const family = style.fontFamily.toLowerCase();
      const reflex = REFLEX_FONTS.find((font) => family.includes(font));
      if (reflex) {
        findings['SLOP-REFLEX-FONT'].push(
          `SLOP-REFLEX-FONT: ${where} — "${reflex}" ist eine Reflexwahl. Begründung gehört in den Brief.`
        );
      }

      if (fontSize > 96) {
        findings['SLOP-HERO-SIZE'].push(
          `SLOP-HERO-SIZE: ${where} — font-size ${fontSize}px (Grenze 96px)`
        );
      }

      const tracking = style.letterSpacing === 'normal' ? 0 : px(style.letterSpacing);
      if (tracking < -0.04 * fontSize) {
        findings['SLOP-TRACKING'].push(
          `SLOP-TRACKING: ${where} — letter-spacing ${tracking}px = ${(tracking / fontSize).toFixed(3)}em (Grenze -0.04em)`
        );
      }

      if (fontSize < 12) {
        findings['SLOP-TINY-TEXT'].push(
          `SLOP-TINY-TEXT: ${where} — font-size ${fontSize}px, unter 12px ist nicht lesbar`
        );
      }

      const text = directText(element);

      if (style.textAlign === 'justify' && text.length > 80) {
        findings['SLOP-JUSTIFY'].push(
          `SLOP-JUSTIFY: ${where} — Blocksatz erzeugt im Web Löcher, kein Silbentrennungssystem vorhanden`
        );
      }

      if (style.textTransform === 'uppercase' && text.length > 60) {
        findings['SLOP-CAPS-BODY'].push(
          `SLOP-CAPS-BODY: ${where} — ${text.length} Zeichen in Versalien, Versalien nur für kurze Labels`
        );
      }

      // Zeilenhöhe nur für Fließtext prüfen, nicht für Überschriften.
      if (fontSize <= 20 && text.length > 80) {
        const leading = style.lineHeight === 'normal' ? fontSize * 1.2 : px(style.lineHeight);
        const ratio = leading / fontSize;
        if (ratio < 1.35) {
          findings['SLOP-LEADING'].push(
            `SLOP-LEADING: ${where} — line-height ${ratio.toFixed(2)} bei Fließtext (mindestens 1.35)`
          );
        }
      }

      // Eyebrow-Kandidat: kurzes Label in Versalien mit geweiteter Laufweite.
      if (
        style.textTransform === 'uppercase' &&
        tracking > 0 &&
        text.length > 0 &&
        text.length <= 40
      ) {
        eyebrows.push(`${where} ("${text.slice(0, 30)}")`);
      }
    }

    // Zeilenmaß: Zeichenbreite über einen Testtext in der tatsächlichen Schrift messen.
    const context = document.createElement('canvas').getContext('2d');
    if (context) {
      const sample = 'abcdefghijklmnopqrstuvwxyz ETAOIN shrdlu, ';
      for (const paragraph of document.querySelectorAll<HTMLElement>('p')) {
        const text = (paragraph.textContent ?? '').trim();
        if (text.length < 120) continue;
        const style = getComputedStyle(paragraph);
        const rect = paragraph.getBoundingClientRect();
        const contentWidth = rect.width - px(style.paddingLeft) - px(style.paddingRight);
        if (contentWidth <= 0) continue;

        context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize}/${style.fontSize} ${style.fontFamily}`;
        const charWidth = context.measureText(sample).width / sample.length;
        if (charWidth <= 0) continue;

        const chars = Math.round(contentWidth / charWidth);
        // Erst deutlich über 80ch melden — knapp darüber ist Geschmackssache.
        if (chars > 90) {
          findings['SLOP-MEASURE'].push(
            `SLOP-MEASURE: ${selectorFor(paragraph)} — Zeilenmaß ca. ${chars} Zeichen (Ziel ~75, Grenze 90)`
          );
        }
      }
    }

    // Doppelte Trennlinien: Zeile mit Rahmen oben UND unten, über mehrere
    // Geschwister hinweg. Zwischen zwei Zeilen gehört eine Linie, nicht zwei.
    const doubleRuled = new Map<Element, number>();
    for (const element of elements) {
      const style = getComputedStyle(element);
      const hasTop =
        px(style.borderTopWidth) >= 1 &&
        style.borderTopStyle !== 'none' &&
        !isTransparent(style.borderTopColor);
      const hasBottom =
        px(style.borderBottomWidth) >= 1 &&
        style.borderBottomStyle !== 'none' &&
        !isTransparent(style.borderBottomColor);
      if (hasTop && hasBottom && element.parentElement) {
        doubleRuled.set(element.parentElement, (doubleRuled.get(element.parentElement) ?? 0) + 1);
      }
    }
    for (const [parent, count] of doubleRuled) {
      if (count >= 4) {
        findings['SLOP-ROW-DOUBLE-RULE'].push(
          `SLOP-ROW-DOUBLE-RULE: ${selectorFor(parent)} — ${count} Kinder mit Rahmen oben UND unten`
        );
      }
    }

    if (pageLevel) {
      // Typo-Spanne: ohne echten Sprung zwischen Display und Fließtext gibt es
      // keine Hierarchie, nur verschieden große Absätze.
      const sizes = [...fontSizes].sort((a, b) => a - b);
      if (sizes.length >= 3) {
        const ratio = sizes[sizes.length - 1] / sizes[0];
        if (ratio < 2) {
          findings['SLOP-FLAT-TYPE'].push(
            `SLOP-FLAT-TYPE: Größen ${sizes.join(', ')}px — Spanne ${ratio.toFixed(2)}:1, mindestens 2:1 nötig`
          );
        }
      }

      // Eyebrows sind Stimme, solange sie selten sind. Über jeder Section sind
      // sie KI-Grammatik. Grenze: einer pro drei Abschnitte.
      const sections = Math.max(1, document.querySelectorAll('section').length);
      const allowed = Math.ceil(sections / 3);
      if (eyebrows.length > allowed && eyebrows.length >= 3) {
        findings['SLOP-EYEBROW-COUNT'].push(
          `SLOP-EYEBROW-COUNT: ${eyebrows.length} Eyebrow-Label bei ${sections} Abschnitt(en), erlaubt ${allowed} — ${eyebrows.join('; ')}`
        );
      }
    }

    return findings;
  }, fullPage) as Promise<Findings>;
}

if (routes.length === 0) {
  test.skip('keine Vorschau-Routen gebaut — nichts zu prüfen', () => {});
}

for (const route of routes) {
  test(`ohne Slop-Muster: ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const findings = await scan(page, isFullPage(route));

    // Soft, damit ein Lauf alle verletzten Regeln einer Seite auf einmal zeigt.
    for (const rule of RULES) {
      expect.soft(findings[rule], `${rule} auf ${route}`).toEqual([]);
    }
  });
}
