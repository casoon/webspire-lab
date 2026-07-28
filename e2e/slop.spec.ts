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
  return page.evaluate(scanDocument, fullPage) as Promise<Findings>;
}

function scanDocument(pageLevel: boolean): Record<string, string[]> {
  const rules = [
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
  ];
  const findings = Object.fromEntries(rules.map((rule) => [rule, [] as string[]]));
  const fontSizes = new Set<number>();
  const eyebrows: string[] = [];
  const reflexFonts = [
    'inter',
    'plus jakarta',
    'geist',
    'manrope',
    'poppins',
    'dm sans',
    'space grotesk',
  ];
  const layoutProps = [
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
  const px = (value: string) => Number.parseFloat(value) || 0;
  const transparent = (color: string) =>
    color === 'transparent' || /rgba?\([^)]*,\s*0\s*\)/.test(color);
  const add = (rule: string, message: string) => findings[rule].push(`${rule}: ${message}`);
  const shadowLengths = (value: string) =>
    value && value !== 'none'
      ? value
          .replace(/(rgba?|hsla?|color|oklch|lab)\([^)]*\)/g, '')
          .split(',')
          .map((shadow) => (shadow.match(/-?[\d.]+px/g) ?? []).map(Number.parseFloat))
      : ([] as number[][]);
  const selectorFor = (element: Element) => {
    const parts: string[] = [];
    let node: Element | null = element;
    while (node && parts.length < 3) {
      if (node.id) {
        parts.unshift(`#${node.id}`);
        break;
      }
      parts.unshift(
        node.tagName.toLowerCase() +
          [...node.classList]
            .slice(0, 2)
            .map((name) => `.${name}`)
            .join('')
      );
      node = node.parentElement;
    }
    return parts.join(' > ');
  };
  const directText = (element: Element) =>
    [...element.childNodes]
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => (node.textContent ?? '').trim())
      .join(' ')
      .trim();
  const hasDirectText = (element: Element) => directText(element).length > 0;
  const maxRadius = (style: CSSStyleDeclaration) =>
    Math.max(
      ...['top-left', 'top-right', 'bottom-right', 'bottom-left'].map((corner) =>
        px(style.getPropertyValue(`border-${corner}-radius`))
      )
    );
  const isSurface = (style: CSSStyleDeclaration) =>
    ['top', 'right', 'bottom', 'left'].some(
      (side) =>
        px(style.getPropertyValue(`border-${side}-width`)) >= 1 &&
        style.getPropertyValue(`border-${side}-style`) !== 'none' &&
        !transparent(style.getPropertyValue(`border-${side}-color`))
    ) || !transparent(style.backgroundColor);

  function checkSurface(element: HTMLElement, style: CSSStyleDeclaration, where: string) {
    const rect = element.getBoundingClientRect();
    const sides = ['Top', 'Right', 'Bottom', 'Left'].map((side) => ({
      side,
      width: px(style.getPropertyValue(`border-${side.toLowerCase()}-width`)),
      style: style.getPropertyValue(`border-${side.toLowerCase()}-style`),
      color: style.getPropertyValue(`border-${side.toLowerCase()}-color`),
    }));
    const visibleBorder = sides.find(
      (side) => side.width >= 1 && side.style !== 'none' && !transparent(side.color)
    );
    const shadows = shadowLengths(style.boxShadow);
    const blur = Math.max(0, ...shadows.map((lengths) => Math.abs(lengths[2] ?? 0)));
    if (visibleBorder && blur >= 16)
      add(
        'SLOP-GHOST-CARD',
        `${where} — sichtbare border (${visibleBorder.width}px ${visibleBorder.side.toLowerCase()}) UND box-shadow mit ${blur}px Blur`
      );
    if (shadows.some(([x = 0, y = 0, shadowBlur = 0]) => x === 0 && y === 0 && shadowBlur >= 16))
      add(
        'SLOP-GLOW',
        `${where} — box-shadow ohne Versatz mit mindestens 16px Blur ist ein Glow, kein Schatten`
      );
    if (/repeating-linear-gradient|radial-gradient/.test(style.backgroundImage))
      add(
        'SLOP-DECOR-GRADIENT',
        `${where} — ${style.backgroundImage.includes('repeating-linear-gradient') ? 'repeating-linear-gradient (Streifen)' : 'radial-gradient (Halo)'}`
      );
    const radius = maxRadius(style);
    if (rect.height > 60 && radius >= 24)
      add(
        'SLOP-OVERROUND',
        `${where} — border-radius ${radius}px bei ${Math.round(rect.height)}px Höhe`
      );
    const parent = element.parentElement;
    if (radius > 0 && parent && isSurface(style)) {
      const parentStyle = getComputedStyle(parent);
      const parentRadius = maxRadius(parentStyle);
      if (parentRadius > 0 && isSurface(parentStyle) && radius >= parentRadius)
        add(
          'SLOP-NESTED-SURFACE',
          `${where} — Innenradius ${radius}px >= Außenradius ${parentRadius}px bei verschachtelten Flächen`
        );
    }
    const [top, right, bottom, left] = sides.map((side) => side.width);
    const stripeLeft = left > 1 && top === 0 && right === 0 && bottom === 0;
    const stripeRight = right > 1 && top === 0 && left === 0 && bottom === 0;
    if (stripeLeft || stripeRight)
      add(
        'SLOP-SIDE-STRIPE',
        `${where} — nur ${stripeLeft ? 'linke' : 'rechte'} Kante mit ${stripeLeft ? left : right}px Rahmen`
      );
    if (
      style.backgroundClip === 'text' ||
      style.getPropertyValue('-webkit-background-clip') === 'text'
    )
      add('SLOP-GRADIENT-TEXT', `${where} — background-clip: text`);
  }

  function checkMotion(style: CSSStyleDeclaration, where: string) {
    const hasTransition = style.transitionDuration
      .split(',')
      .some((duration) => Number.parseFloat(duration) > 0);
    if (
      hasTransition &&
      style.transitionProperty.split(',').some((property) => property.trim() === 'all')
    )
      add(
        'SLOP-TRANSITION-ALL',
        `${where} — transition-property: all, Eigenschaften einzeln benennen`
      );
    const animated = hasTransition
      ? style.transitionProperty
          .split(',')
          .map((property) => property.trim())
          .filter((property) => layoutProps.includes(property))
      : [];
    if (animated.length)
      add(
        'SLOP-ANIMATE-LAYOUT',
        `${where} — animiert Layout-Eigenschaft(en) ${animated.join(', ')}, nur transform und opacity animieren`
      );
    const animatedInfinitely =
      style.animationName !== 'none' && style.animationIterationCount.includes('infinite');
    if (animatedInfinitely)
      add(
        'SLOP-INFINITE-MOTION',
        `${where} — Endlos-Animation "${style.animationName}" (Marquee, Puls, Blinken)`
      );
    for (const timing of [
      hasTransition ? style.transitionTimingFunction : '',
      style.animationName !== 'none' ? style.animationTimingFunction : '',
    ]) {
      const bezier = timing.match(/cubic-bezier\(([^)]+)\)/);
      if (!bezier) continue;
      const [, y1, , y2] = bezier[1].split(',').map(Number.parseFloat);
      if (y1 > 1 || y2 > 1 || y1 < 0 || y2 < 0) {
        add(
          'SLOP-BOUNCE-EASING',
          `${where} — ${timing} schwingt über, exponentielles ease-out verwenden`
        );
        break;
      }
    }
  }

  function checkText(element: HTMLElement, style: CSSStyleDeclaration, where: string) {
    if (!hasDirectText(element)) return;
    const fontSize = px(style.fontSize);
    const tracking = style.letterSpacing === 'normal' ? 0 : px(style.letterSpacing);
    const text = directText(element);
    fontSizes.add(Math.round(fontSize * 10) / 10);
    const reflex = reflexFonts.find((font) => style.fontFamily.toLowerCase().includes(font));
    if (reflex)
      add(
        'SLOP-REFLEX-FONT',
        `${where} — "${reflex}" ist eine Reflexwahl. Begründung gehört in den Brief.`
      );
    if (fontSize > 96) add('SLOP-HERO-SIZE', `${where} — font-size ${fontSize}px (Grenze 96px)`);
    if (tracking < -0.04 * fontSize)
      add(
        'SLOP-TRACKING',
        `${where} — letter-spacing ${tracking}px = ${(tracking / fontSize).toFixed(3)}em (Grenze -0.04em)`
      );
    if (fontSize < 12)
      add('SLOP-TINY-TEXT', `${where} — font-size ${fontSize}px, unter 12px ist nicht lesbar`);
    if (style.textAlign === 'justify' && text.length > 80)
      add(
        'SLOP-JUSTIFY',
        `${where} — Blocksatz erzeugt im Web Löcher, kein Silbentrennungssystem vorhanden`
      );
    if (style.textTransform === 'uppercase' && text.length > 60)
      add(
        'SLOP-CAPS-BODY',
        `${where} — ${text.length} Zeichen in Versalien, Versalien nur für kurze Labels`
      );
    if (fontSize <= 20 && text.length > 80) {
      const leading = style.lineHeight === 'normal' ? fontSize * 1.2 : px(style.lineHeight);
      if (leading / fontSize < 1.35)
        add(
          'SLOP-LEADING',
          `${where} — line-height ${(leading / fontSize).toFixed(2)} bei Fließtext (mindestens 1.35)`
        );
    }
    if (style.textTransform === 'uppercase' && tracking > 0 && text.length > 0 && text.length <= 40)
      eyebrows.push(`${where} ("${text.slice(0, 30)}")`);
  }

  function checkMeasure() {
    const context = document.createElement('canvas').getContext('2d');
    if (!context) return;
    const sample = 'abcdefghijklmnopqrstuvwxyz ETAOIN shrdlu, ';
    for (const paragraph of document.querySelectorAll<HTMLElement>('p')) {
      if ((paragraph.textContent ?? '').trim().length < 120) continue;
      const style = getComputedStyle(paragraph);
      const width =
        paragraph.getBoundingClientRect().width - px(style.paddingLeft) - px(style.paddingRight);
      if (width <= 0) continue;
      context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize}/${style.fontSize} ${style.fontFamily}`;
      const charWidth = context.measureText(sample).width / sample.length;
      const chars = Math.round(width / charWidth);
      if (charWidth > 0 && chars > 90)
        add(
          'SLOP-MEASURE',
          `${selectorFor(paragraph)} — Zeilenmaß ca. ${chars} Zeichen (Ziel ~75, Grenze 90)`
        );
    }
  }

  function checkRows(elements: HTMLElement[]) {
    const doubleRuled = new Map<Element, number>();
    for (const element of elements) {
      const style = getComputedStyle(element);
      const visible = (side: 'Top' | 'Bottom') =>
        px(style[`border${side}Width`]) >= 1 &&
        style[`border${side}Style`] !== 'none' &&
        !transparent(style[`border${side}Color`]);
      if (visible('Top') && visible('Bottom') && element.parentElement)
        doubleRuled.set(element.parentElement, (doubleRuled.get(element.parentElement) ?? 0) + 1);
    }
    for (const [parent, count] of doubleRuled)
      if (count >= 4)
        add(
          'SLOP-ROW-DOUBLE-RULE',
          `${selectorFor(parent)} — ${count} Kinder mit Rahmen oben UND unten`
        );
  }

  const elements = [...document.body.querySelectorAll<HTMLElement>('*')].filter(
    (element) =>
      element.namespaceURI === 'http://www.w3.org/1999/xhtml' &&
      element.getBoundingClientRect().width > 0 &&
      element.getBoundingClientRect().height > 0
  );
  for (const element of elements) {
    const style = getComputedStyle(element);
    const where = selectorFor(element);
    checkSurface(element, style, where);
    checkMotion(style, where);
    checkText(element, style, where);
  }
  checkMeasure();
  checkRows(elements);
  if (pageLevel) {
    const sizes = [...fontSizes].sort((a, b) => a - b);
    if (sizes.length >= 3 && sizes[sizes.length - 1] / sizes[0] < 2)
      add(
        'SLOP-FLAT-TYPE',
        `Größen ${sizes.join(', ')}px — Spanne ${(sizes[sizes.length - 1] / sizes[0]).toFixed(2)}:1, mindestens 2:1 nötig`
      );
    const sections = Math.max(1, document.querySelectorAll('section').length);
    const allowed = Math.ceil(sections / 3);
    if (eyebrows.length > allowed && eyebrows.length >= 3)
      add(
        'SLOP-EYEBROW-COUNT',
        `${eyebrows.length} Eyebrow-Label bei ${sections} Abschnitt(en), erlaubt ${allowed} — ${eyebrows.join('; ')}`
      );
  }
  return findings;
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
