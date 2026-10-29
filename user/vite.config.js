import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { seoPages } from './src/data/seoPages.js'
import { createSeoStructuredData } from './src/data/seoStructuredData.js'

const siteUrl = 'https://hscekanjhawala.com'

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function createSitemap() {
  const urls = seoPages
    .filter((page) => page.indexable !== false)
    .map(
      (page) =>
        `  <url><loc>${escapeXml(`${siteUrl}${page.path}`)}</loc></url>`,
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
  const canonicalUrl = `${siteUrl}${page.path}`
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  const robots =
    page.indexable === false
      ? 'noindex, follow'
      : 'index, follow, max-image-preview:large'
  const image = escapeHtml(page.image || `${siteUrl}/assets/brand/college-logo.png`)
  const imageAlt = escapeHtml(page.imageAlt || 'Haryana Shakti College of Education')
  const structuredData = JSON.stringify(createSeoStructuredData(page)).replaceAll(
    '<',
    '\\u003c',
  )

  return template
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
      () => `<meta name="description" content="${description}" />`,
    )
    .replace(
      /<meta name="robots"\s+content="[^"]*"\s*\/>/,
      () => `<meta name="robots" content="${robots}" />`,
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
      () => `<meta property="og:title" content="${title}" />`,
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
      () => `<meta property="og:description" content="${description}" />`,
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
      () => `<meta name="twitter:title" content="${title}" />`,
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
      () => `<meta name="twitter:description" content="${description}" />`,
    )
    .replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
      () => `<meta property="og:url" content="${canonicalUrl}" />`,
    )
    .replace(
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/,
      () => `<meta property="og:image" content="${image}" />`,
    )
    .replace(
      /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/>/,
      () => `<meta property="og:image:alt" content="${imageAlt}" />`,
    )
    .replace(
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/,
      () => `<meta name="twitter:image" content="${image}" />`,
    )
    .replace(
      /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
      () => `<link rel="canonical" href="${canonicalUrl}" />`,
    )
    .replace(
      '<!-- seo-json-ld -->',
      `<script type="application/ld+json">${structuredData}</script>`,
    )
}

function validateSeoPages() {
  const paths = new Set()
  const titles = new Set()
  const descriptions = new Set()

  for (const page of seoPages) {
    if (
      !page.path.startsWith('/') ||
      (page.path.length > 1 && page.path.endsWith('/')) ||
      page.path.includes('?') ||
      page.path.includes('#') ||
      paths.has(page.path)
    ) {
      throw new Error(`Invalid or duplicate SEO route: ${page.path}`)
    }

    paths.add(page.path)
    if (page.indexable === false) continue

    if (!page.title.trim() || !page.description.trim()) {
      throw new Error(`Missing indexable route metadata: ${page.path}`)
    }
    if (titles.has(page.title) || descriptions.has(page.description)) {
      throw new Error(`Duplicate indexable SEO metadata: ${page.path}`)
    }

    titles.add(page.title)
    descriptions.add(page.description)
  }
}

function seoPagesPlugin() {
  return {
    name: 'hsce-seo-pages',
    apply: 'build',
    buildStart() {
      validateSeoPages()
    },
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
            : resolve(outputDirectory, `${page.path.slice(1)}.html`)
        await mkdir(dirname(pagePath), { recursive: true })
        const routeHtml = createRouteHtml(template, page)
        await writeFile(pagePath, routeHtml)
      }

      const notFoundHtml = createRouteHtml(template, {
        path: '/',
        title: 'Page Not Found | Haryana Shakti College of Education',
        description:
          'The requested page could not be found on the Haryana Shakti College of Education website.',
        indexable: false,
      })
        .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/, '')
        .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/, '')
        .replace('<!-- seo-json-ld -->', '')
      await writeFile(resolve(outputDirectory, '404.html'), notFoundHtml)

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
