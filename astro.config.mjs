import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

function localProjectWriter() {
  return {
    name: 'local-project-writer',
    configureServer(server) {
      server.middlewares.use('/__lab/projects', async (request, response) => {
        if (request.method !== 'POST') {
          response.writeHead(405, { Allow: 'POST' }).end();
          return;
        }

        try {
          const chunks = [];
          for await (const chunk of request) chunks.push(chunk);
          const project = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          const slug = typeof project?.slug === 'string' ? project.slug : '';

          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            response.writeHead(400).end(JSON.stringify({ error: 'Ungültige Projektkennung.' }));
            return;
          }

          const projects = resolve(server.config.root, 'lab.config/projects');
          const target = resolve(projects, `${slug}.json`);
          if (!target.startsWith(`${projects}/`)) {
            response.writeHead(400).end(JSON.stringify({ error: 'Ungültiger Dateipfad.' }));
            return;
          }

          await mkdir(projects, { recursive: true });
          await writeFile(target, `${JSON.stringify(project, null, 2)}\n`, {
            encoding: 'utf8',
            flag: 'wx',
          });
          server.ws.send({ type: 'full-reload', path: '*' });
          response
            .writeHead(201, { 'Content-Type': 'application/json' })
            .end(JSON.stringify({ ok: true }));
        } catch (error) {
          const exists =
            error && typeof error === 'object' && 'code' in error && error.code === 'EEXIST';
          response.writeHead(exists ? 409 : 500, { 'Content-Type': 'application/json' }).end(
            JSON.stringify({
              error: exists
                ? 'Projektdatei existiert bereits.'
                : 'Projektdatei konnte nicht gespeichert werden.',
            })
          );
        }
      });

      server.middlewares.use('/__lab/references', async (request, response) => {
        if (request.method !== 'POST') {
          response.writeHead(405, { Allow: 'POST' }).end();
          return;
        }

        try {
          const chunks = [];
          for await (const chunk of request) chunks.push(chunk);
          const reference = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          const slug = typeof reference?.slug === 'string' ? reference.slug : '';
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
            response.writeHead(400).end(JSON.stringify({ error: 'Ungültige Referenzkennung.' }));
            return;
          }

          const references = resolve(server.config.root, 'lab.config/references');
          const target = resolve(references, `${slug}.json`);
          if (!target.startsWith(`${references}/`)) {
            response.writeHead(400).end(JSON.stringify({ error: 'Ungültiger Dateipfad.' }));
            return;
          }

          await mkdir(references, { recursive: true });
          await writeFile(target, `${JSON.stringify(reference, null, 2)}\n`, {
            encoding: 'utf8',
            flag: 'wx',
          });
          server.ws.send({ type: 'full-reload', path: '*' });
          response
            .writeHead(201, { 'Content-Type': 'application/json' })
            .end(JSON.stringify({ ok: true }));
        } catch (error) {
          const exists =
            error && typeof error === 'object' && 'code' in error && error.code === 'EEXIST';
          response.writeHead(exists ? 409 : 500, { 'Content-Type': 'application/json' }).end(
            JSON.stringify({
              error: exists
                ? 'Referenzdatei existiert bereits.'
                : 'Referenzdatei konnte nicht gespeichert werden.',
            })
          );
        }
      });
    },
  };
}

// Design-Lab: rein statisch, kein Adapter, kein Client-Framework.
// Islands werden hier bewusst NICHT konfiguriert — wer Interaktivität braucht,
// baut sie im Produktionsprojekt, nicht im Lab.
export default defineConfig({
  site: 'http://localhost:4321',
  trailingSlash: 'always',
  output: 'static',
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss(), localProjectWriter()],
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
