import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { collegeName, seoPages, siteUrl } from '../src/data/seoPages.js';

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function readMeta(html, attribute, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = html.match(
    new RegExp(`<meta\\s+${attribute}="${escapedName}"\\s+content="([^"]*)"\\s*\\/?>`, 'i'),
  );
  return match?.[1] ?? null;
}

async function runSeoAudit() {
  console.log('🔍 Starting Google Search Console Readiness & SEO Audit on dist/...\n');
  const distDir = resolve(process.cwd(), 'dist');
  const indexablePages = seoPages.filter((page) => page.indexable !== false);
  let errors = 0;
  let warnings = 0;

  // 1. Verify Verification Files & Meta Tags
  console.log('▶ Checking Ownership & Verification:');
  const googleHtmlPath = resolve(distDir, 'google3a0ff77e0457b278.html');
  if (await fileExists(googleHtmlPath)) {
    const content = await readFile(googleHtmlPath, 'utf8');
    if (content.includes('google3a0ff77e0457b278.html')) {
      console.log('  ✅ Google Site Verification HTML file present with valid token.');
    } else {
      console.error('  ❌ Google verification file present but content is invalid.');
      errors++;
    }
  } else {
    console.error('  ❌ Missing Google verification HTML file in dist.');
    errors++;
  }

  // 2. Verify robots.txt
  console.log('\n▶ Checking robots.txt Alignment:');
  const robotsPath = resolve(distDir, 'robots.txt');
  if (await fileExists(robotsPath)) {
    const robots = await readFile(robotsPath, 'utf8');
    if (robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`)) {
      console.log(`  ✅ Sitemap URL explicitly declared: ${siteUrl}/sitemap.xml`);
    } else {
      console.error('  ❌ Sitemap declaration missing or mismatched in robots.txt.');
      errors++;
    }

    if (robots.includes('Disallow: /assets/') || robots.includes('Disallow: /*.js') || robots.includes('Disallow: /*.css')) {
      console.error('  ❌ robots.txt accidentally disallows vital CSS/JS/media assets!');
      errors++;
    } else {
      console.log('  ✅ robots.txt cleanly allows Googlebot access to CSS/JS and assets.');
    }
  } else {
    console.error('  ❌ Missing robots.txt in dist.');
    errors++;
  }

  // 3. Verify sitemap.xml Structure & Alignment
  console.log('\n▶ Checking sitemap.xml:');
  const sitemapPath = resolve(distDir, 'sitemap.xml');
  if (await fileExists(sitemapPath)) {
    const sitemap = await readFile(sitemapPath, 'utf8');
    const sitemapLocs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
    const expectedLocs = indexablePages.map(
      (page) => `${siteUrl}${page.path === '/' ? '/' : page.path}`,
    );
    const expectedLocSet = new Set(expectedLocs);
    const duplicateLocs = sitemapLocs.filter(
      (location, index) => sitemapLocs.indexOf(location) !== index,
    );
    const unexpectedLocs = sitemapLocs.filter((location) => !expectedLocSet.has(location));
    const missingLocs = expectedLocs.filter((location) => !sitemapLocs.includes(location));

    for (const location of missingLocs) {
      console.error(`  ❌ Missing route in sitemap: ${location}`);
      errors++;
    }
    for (const location of duplicateLocs) {
      console.error(`  ❌ Duplicate sitemap route: ${location}`);
      errors++;
    }
    for (const location of unexpectedLocs) {
      console.error(`  ❌ Unexpected or non-indexable sitemap route: ${location}`);
      errors++;
    }
    if (missingLocs.length === 0 && duplicateLocs.length === 0 && unexpectedLocs.length === 0) {
      console.log(`  ✅ Sitemap contains exactly ${expectedLocs.length} indexable routes.`);
    }

    // lastmod is optional and should only be emitted for a verified content update.
    const sitemapLastmods = [...sitemap.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map((match) => match[1]);
    const invalidLastmods = sitemapLastmods.filter((date) => !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date)));
    if (invalidLastmods.length) {
      console.error('  ❌ sitemap.xml contains an invalid <lastmod> date.');
      errors++;
    } else {
      console.log(`  ✅ Sitemap routes are aligned; ${sitemapLastmods.length} verified <lastmod> dates are included.`);
    }
  } else {
    console.error('  ❌ Missing sitemap.xml in dist.');
    errors++;
  }

  // 4. Verify Static HTML Pages & JSON-LD Structured Data
  console.log('\n▶ Checking Static HTML Pre-render, Canonical Links & JSON-LD:');
  for (const page of seoPages) {
    const filename = page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`;
    const filePath = resolve(distDir, filename);

    if (!(await fileExists(filePath))) {
      console.error(`  ❌ Missing pre-rendered HTML file: ${filename}`);
      errors++;
      continue;
    }

    const html = await readFile(filePath, 'utf8');
    const expectedCanonical = `${siteUrl}${page.path === '/' ? '/' : page.path}`;
    const expectedImage = page.image || `${siteUrl}/assets/brand/college-logo.png`;
    const expectedRobots =
      page.indexable === false
        ? 'noindex, follow'
        : 'index, follow, max-image-preview:large';

    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    if (titleMatch?.[1] !== escapeHtml(page.title)) {
      console.error(`  ❌ Missing or mismatched title in ${filename}`);
      errors++;
    }
    if (readMeta(html, 'name', 'description') !== escapeHtml(page.description)) {
      console.error(`  ❌ Missing or mismatched description in ${filename}`);
      errors++;
    }
    if (readMeta(html, 'name', 'robots') !== expectedRobots) {
      console.error(`  ❌ Missing or mismatched robots directive in ${filename}`);
      errors++;
    }
    if (readMeta(html, 'property', 'og:site_name') !== escapeHtml(collegeName)) {
      console.error(`  ❌ Missing or mismatched Open Graph site name in ${filename}`);
      errors++;
    }
    if (readMeta(html, 'name', 'twitter:card') !== 'summary_large_image') {
      console.error(`  ❌ Missing or mismatched Twitter card type in ${filename}`);
      errors++;
    }
    if (readMeta(html, 'property', 'og:title') !== escapeHtml(page.title)) {
      console.error(`  ❌ Missing or mismatched Open Graph title in ${filename}`);
      errors++;
    }
    if (readMeta(html, 'property', 'og:description') !== escapeHtml(page.description)) {
      console.error(`  ❌ Missing or mismatched Open Graph description in ${filename}`);
      errors++;
    }
    if (readMeta(html, 'property', 'og:url') !== expectedCanonical) {
      console.error(`  ❌ Missing or mismatched Open Graph URL in ${filename}`);
      errors++;
    }
    if (readMeta(html, 'property', 'og:image') !== escapeHtml(expectedImage)) {
      console.error(`  ❌ Missing or mismatched Open Graph image in ${filename}`);
      errors++;
    }
    if (readMeta(html, 'name', 'twitter:title') !== escapeHtml(page.title)) {
      console.error(`  ❌ Missing or mismatched Twitter title in ${filename}`);
      errors++;
    }
    if (readMeta(html, 'name', 'twitter:description') !== escapeHtml(page.description)) {
      console.error(`  ❌ Missing or mismatched Twitter description in ${filename}`);
      errors++;
    }
    if (readMeta(html, 'name', 'twitter:image') !== escapeHtml(expectedImage)) {
      console.error(`  ❌ Missing or mismatched Twitter image in ${filename}`);
      errors++;
    }

    // Canonical tag check
    if (!html.includes(`<link rel="canonical" href="${expectedCanonical}" />`)) {
      console.error(`  ❌ Mismatched or missing canonical tag in ${filename}`);
      errors++;
    }

    // Google Verification Meta tag check
    if (!html.includes('<meta name="google-site-verification" content="google3a0ff77e0457b278" />')) {
      console.error(`  ❌ Missing google-site-verification meta tag in ${filename}`);
      errors++;
    }

    // JSON-LD validation
    const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!ldMatch) {
      console.error(`  ❌ Missing JSON-LD structured data in ${filename}`);
      errors++;
      continue;
    }

    try {
      const json = JSON.parse(ldMatch[1]);
      if (!Array.isArray(json['@graph'])) {
        console.error(`  ❌ Invalid JSON-LD @graph in ${filename}`);
        errors++;
        continue;
      }

      const webPage = json['@graph'].find((item) => item['@type'] === 'WebPage');
      if (!webPage || webPage.url !== expectedCanonical) {
        console.error(`  ❌ Missing or mismatched WebPage structured data in ${filename}`);
        errors++;
      }
      if (page.path === '/') {
        if (
          !json['@graph'].some((item) => item['@type'] === 'WebSite') ||
          !json['@graph'].some((item) => item['@type'] === 'CollegeOrUniversity')
        ) {
          console.error(`  ❌ Homepage is missing WebSite or CollegeOrUniversity data.`);
          errors++;
        }
      }
      if (page.breadcrumbs?.length) {
        const breadcrumbs = json['@graph'].find((item) => item['@type'] === 'BreadcrumbList');
        const expectedCount = page.breadcrumbs.length + 1;
        if (
          !breadcrumbs ||
          breadcrumbs.itemListElement?.length !== expectedCount ||
          breadcrumbs.itemListElement.some((item, index) => item.position !== index + 1)
        ) {
          console.error(`  ❌ Missing or invalid breadcrumb data in ${filename}`);
          errors++;
        }
      }
      if (page.pageType === 'course' && !json['@graph'].some((item) => item['@type'] === 'Course')) {
        console.error(`  ❌ Missing Course structured data in ${filename}`);
        errors++;
      }
      if (page.faqs?.length && !json['@graph'].some((item) => item['@type'] === 'FAQPage')) {
        console.error(`  ❌ Missing FAQ structured data in ${filename}`);
        errors++;
      }
    } catch (err) {
      console.error(`  ❌ Syntax error parsing JSON-LD in ${filename}:`, err.message);
      errors++;
    }
  }

  const notFoundPath = resolve(distDir, '404.html');
  if (await fileExists(notFoundPath)) {
    const notFoundHtml = await readFile(notFoundPath, 'utf8');
    if (
      !readMeta(notFoundHtml, 'name', 'robots')?.includes('noindex') ||
      /<link\s+rel="canonical"/i.test(notFoundHtml) ||
      /<script type="application\/ld\+json">/i.test(notFoundHtml)
    ) {
      console.error('  ❌ 404.html should be noindex and omit canonical/structured data.');
      errors++;
    } else {
      console.log('  ✅ 404.html is noindex and excluded from canonical/schema indexing.');
    }
  } else {
    console.error('  ❌ Missing 404.html in dist.');
    errors++;
  }

  for (const page of indexablePages) {
    if (page.title.length > 65) {
      warnings++;
      console.warn(`  ⚠️ Long page title (${page.title.length} chars): ${page.path}`);
    }
    if (page.description.length > 170) {
      warnings++;
      console.warn(`  ⚠️ Long meta description (${page.description.length} chars): ${page.path}`);
    }
  }

  console.log('\n==================================================');
  if (errors === 0) {
    console.log(`🎉 AUDIT PASSED: 0 errors detected, ${warnings} SEO length warnings.`);
    console.log('==================================================\n');
  } else {
    console.error(`💥 AUDIT FAILED: ${errors} errors detected.`);
    console.error('==================================================\n');
    process.exit(1);
  }
}

runSeoAudit().catch((err) => {
  console.error('Audit execution error:', err);
  process.exit(1);
});
