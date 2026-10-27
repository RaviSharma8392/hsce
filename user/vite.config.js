import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { seoPages } from './src/data/seoPages.js'

const siteUrl = 'https://www.hscekanjhawala.com'

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function createSitemap() {
  const urls = seoPages
    .filter((page) => page.indexable !== false)
    .map(
      (page) =>
        `  <url><loc>${siteUrl}${page.path === '/' ? '/' : page.path}</loc></url>`,
    )

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}

function createRouteHtml(template, page) {
  const canonicalUrl = `${siteUrl}${page.path === '/' ? '/' : page.path}`
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  const robots = page.indexable === false ? 'noindex, follow' : 'index, follow'

  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      `<meta name="description" content="${description}" />`,
    )
    .replace(
      /<meta name="robots"\s+content="[^"]*"\s*\/>/,
      `<meta name="robots" content="${robots}" />`,
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:title" content="${title}" />`,
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:description" content="${description}" />`,
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
      `<meta property="og:url" content="${canonicalUrl}" />`,
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
      `<link rel="canonical" href="${canonicalUrl}" />`,
    )
}

function seoPagesPlugin() {
  return {
    name: 'hsce-seo-pages',
    apply: 'build',
    async writeBundle(outputOptions) {
      if (!outputOptions.dir) {
        throw new Error('Vite output directory is missing; cannot generate SEO pages.')
      }

      const outputDirectory = outputOptions.dir
      const indexPath = resolve(outputDirectory, 'index.html')
      const template = await readFile(indexPath, 'utf8')

      for (const page of seoPages) {
        const pagePath =
          page.path === '/'
            ? indexPath
            : resolve(outputDirectory, page.path.slice(1), 'index.html')
        await mkdir(dirname(pagePath), { recursive: true })
        await writeFile(pagePath, createRouteHtml(template, page))
      }

      await writeFile(resolve(outputDirectory, 'sitemap.xml'), createSitemap())
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoPagesPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
