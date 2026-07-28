import { expect, test } from '@playwright/test';

test('Projektdatei wird als JSON heruntergeladen, wenn kein Ordnerzugriff verfügbar ist', async ({
  page,
}) => {
  await page.goto('/start/');
  await page.evaluate(() => {
    Object.defineProperty(window, 'showDirectoryPicker', { value: undefined, configurable: true });
  });

  await page.getByLabel('Projektname').fill('Nordwerk Relaunch');
  await page.getByLabel('Organisation').fill('Nordwerk GmbH');
  await page.getByLabel('Haupt-CTA').fill('Termin anfragen');
  await page.getByLabel('Sekundäre CTA 1').fill('Leistungen ansehen');
  await page
    .getByLabel('Ziel der Seite')
    .fill('Qualifizierte Anfragen für das Planungsteam gewinnen.');
  await page
    .getByLabel('Zielgruppe und Situation')
    .fill('Bauherrschaften, die einen verlässlichen Planungspartner suchen.');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Projektdatei speichern' }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe('nordwerk-relaunch.json');
  await expect(page.locator('#save-status')).toContainText(
    'lab.config/projects/nordwerk-relaunch.json'
  );

  const content = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of content ?? []) chunks.push(chunk);
  const project = JSON.parse(Buffer.concat(chunks).toString('utf8'));

  expect(project).toMatchObject({
    schemaVersion: 1,
    slug: 'nordwerk-relaunch',
    status: 'brief',
    constraints: [],
    ctas: { primary: 'Termin anfragen', secondary: ['Leistungen ansehen'] },
    designFrame: { direction: '', signature: '' },
  });
});

test('CTAs dürfen leer bleiben', async ({ page }) => {
  await page.goto('/start/');
  await page.evaluate(() => {
    Object.defineProperty(window, 'showDirectoryPicker', { value: undefined, configurable: true });
  });

  await page.getByLabel('Projektname').fill('Ohne CTA');
  await page.getByLabel('Organisation').fill('Beispiel GmbH');
  await page.getByLabel('Ziel der Seite').fill('Die Seite erklärt das Angebot nachvollziehbar.');
  await page
    .getByLabel('Zielgruppe und Situation')
    .fill('Menschen, die sich erst einen Überblick verschaffen möchten.');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Projektdatei speichern' }).click();
  const download = await downloadPromise;
  const content = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of content ?? []) chunks.push(chunk);

  expect(JSON.parse(Buffer.concat(chunks).toString('utf8')).ctas).toEqual({
    primary: '',
    secondary: [],
  });
});
