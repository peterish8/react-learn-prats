import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const staticDir = resolve(root, 'static-dist');
const outputDir = resolve(root, 'dist');
let html = await readFile(resolve(staticDir, 'index.html'), 'utf8');

const scriptMatch = html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/);
const styleMatch = html.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/);
if (!scriptMatch || !styleMatch) throw new Error('Static Vite assets were not found in index.html');

const script = (await readFile(resolve(staticDir, scriptMatch[1].replace(/^\//, '')), 'utf8'))
  .replaceAll('</script', '<\\/script');
const style = await readFile(resolve(staticDir, styleMatch[1].replace(/^\//, '')), 'utf8');
html = html.replace(styleMatch[0], `<style>${style}</style>`)
  .replace(scriptMatch[0], `<script type="module">${script}</script>`);

const worker = `const html=${JSON.stringify(html)};
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === '/health') {
      return Response.json({ status: 'ok', app: 'react-reset-prathick' }, {
        headers: { 'cache-control': 'no-store' }
      });
    }
    return new Response(html, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=60, stale-while-revalidate=86400',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'strict-origin-when-cross-origin'
      }
    });
  }
};
`;

await rm(outputDir, { recursive: true, force: true });
await mkdir(resolve(outputDir, 'server'), { recursive: true });
await mkdir(resolve(outputDir, '.openai'), { recursive: true });
await writeFile(resolve(outputDir, 'server/index.js'), worker);
await writeFile(resolve(outputDir, '.openai/hosting.json'), await readFile(resolve(root, '.openai/hosting.json')));
