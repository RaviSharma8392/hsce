import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { seoPages } from './src/data/seoPages.js'

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

function escapeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
}

function getBreadcrumbSchema(page) {
  const segments = page.path.split('/').filter(Boolean)
  const items = [{ name: 'Home', url: `${siteUrl}/` }]
  let currentPath = ''
  for (const segment of segments) {
    currentPath += `/${segment}`
    const matchingPage = seoPages.find((candidate) => candidate.path === currentPath)
    const name = matchingPage
      ? matchingPage.title.split(' | ')[0]
      : segment.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
    items.push({ name, url: `${siteUrl}${currentPath}` })
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

function getCourseSchema(page, canonicalUrl) {
  if (!['/course', '/admissions'].includes(page.path)) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${siteUrl}/course#bed-course`,
    name: 'Bachelor of Education (B.Ed.)',
    description: page.path === '/course'
      ? page.description
      : 'Find official admission information for the Bachelor of Education (B.Ed.) programme at Haryana Shakti College of Education.',
    url: `${siteUrl}/course`,
    provider: {
      '@type': 'CollegeOrUniversity',
      '@id': `${siteUrl}/#organization`,
      name: 'Haryana Shakti College of Education',
      url: `${siteUrl}/`,
    },
    educationalCredentialAwarded: 'Bachelor of Education (B.Ed.)',
  }
}

function replaceMeta(html, attribute, key, value) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`<meta\\s+${attribute}="${escapedKey}"[\\s\\S]*?>`, 'i')
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace('</head>', `    ${tag}\\n  </head>`)
}

function createRouteHtml(template, page) {
  const canonicalUrl = `${siteUrl}${page.path === '/' ? '/' : page.path}`
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  const robots = page.indexable === false ? 'noindex, follow' : 'index, follow, max-image-preview:large'
  const imageUrl = `${siteUrl}/assets/campus/college-campus-hero.png`
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${title}</title>`)

  html = replaceMeta(html, 'name', 'description', description)
  html = replaceMeta(html, 'name', 'robots', robots)
  html = replaceMeta(html, 'property', 'og:title', page.title)
  html = replaceMeta(html, 'property', 'og:description', page.description)
  html = replaceMeta(html, 'name', 'twitter:title', page.title)
  html = replaceMeta(html, 'name', 'twitter:description', page.description)
  html = replaceMeta(html, 'property', 'og:url', canonicalUrl)
  html = replaceMeta(html, 'property', 'og:image', imageUrl)
  html = replaceMeta(html, 'property', 'og:image:width', '1672')
  html = replaceMeta(html, 'property', 'og:image:height', '941')
  html = replaceMeta(html, 'property', 'og:image:alt', 'Haryana Shakti College of Education campus')
  html = replaceMeta(html, 'name', 'twitter:image', imageUrl)
  html = replaceMeta(html, 'name', 'twitter:card', 'summary_large_image')
  html = html.replace(/<link\s+rel="canonical"[\s\S]*?>/i, () => `<link rel="canonical" href="${canonicalUrl}" />`)

  const schemas = []
  if (page.path !== '/') schemas.push(getBreadcrumbSchema(page))
  const courseSchema = getCourseSchema(page, canonicalUrl)
  if (courseSchema) schemas.push(courseSchema)
  if (schemas.length) {
    const schemaScripts = schemas.map((schema) => `<script type="application/ld+json">${escapeJsonLd(schema)}</script>`).join('\n    ')
    html = html.replace('</head>', `    ${schemaScripts}\n  </head>`)
  }
  return html
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
        let routeHtml = createRouteHtml(template, page)
        if (page.path !== '/') {
          routeHtml = routeHtml.replace(
            /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/,
            '',
          )
        }
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
        .replace(
          /<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/,
          '',
        )
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
