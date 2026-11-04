import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { seoPages, siteUrl } from '../src/data/seoPages.js';

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function runSeoAudit() {
  console.log('🔍 Starting Google Search Console Readiness & SEO Audit on dist/...\n');
  const distDir = resolve(process.cwd(), 'dist');
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
    const indexablePages = seoPages.filter((p) => p.indexable !== false);

    let allLocsFound = true;
    for (const page of indexablePages) {
      const expectedLoc = `${siteUrl}${page.path === '/' ? '/' : page.path}`;
      if (!sitemap.includes(`<loc>${expectedLoc}</loc>`)) {
        console.error(`  ❌ Missing route in sitemap: ${expectedLoc}`);
        allLocsFound = false;
        errors++;
      }
    }
    if (allLocsFound) {
      console.log(`  ✅ All ${indexablePages.length} indexable production routes are present in sitemap.xml.`);
    }

    // Verify non-indexable routes are excluded
    const nonIndexablePages = seoPages.filter((p) => p.indexable === false);
    for (const page of nonIndexablePages) {
      const forbiddenLoc = `${siteUrl}${page.path}`;
      if (sitemap.includes(`<loc>${forbiddenLoc}</loc>`)) {
        console.error(`  ❌ Non-indexable route included in sitemap: ${forbiddenLoc}`);
        errors++;
      }
    }

    // Check tags: <lastmod>, <changefreq>, <priority>
    if (sitemap.includes('<lastmod>') && sitemap.includes('<changefreq>') && sitemap.includes('<priority>')) {
      console.log('  ✅ sitemap.xml includes valid <lastmod>, <changefreq>, and <priority> entries.');
    } else {
      console.error('  ❌ sitemap.xml missing standard <lastmod>, <changefreq>, or <priority> elements.');
      errors++;
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

    // Canonical tag check
    if (page.indexable !== false) {
      if (!html.includes(`<link rel="canonical" href="${expectedCanonical}" />`)) {
        console.error(`  ❌ Mismatched or missing canonical tag in ${filename}`);
        errors++;
      }
    }

    // Robots directive check
    if (page.indexable === false) {
      if (!html.includes('content="noindex, follow"')) {
        console.error(`  ❌ Expected noindex for ${filename}`);
        errors++;
      }
    } else {
      if (!html.includes('content="index, follow, max-image-preview:large"')) {
        console.error(`  ❌ Missing index or max-image-preview:large in ${filename}`);
        errors++;
      }
    }

    // Google Verification Meta tag check
    if (!html.includes('<meta name="google-site-verification" content="google3a0ff77e0457b278" />')) {
      console.error(`  ❌ Missing google-site-verification meta tag in ${filename}`);
      errors++;
    }

    // JSON-LD validation
    const ldMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (ldMatch) {
      try {
        const json = JSON.parse(ldMatch[1]);
        if (!json['@graph'] || !Array.isArray(json['@graph'])) {
          console.error(`  ❌ Invalid JSON-LD @graph in ${filename}`);
          errors++;
        }
      } catch (err) {
        console.error(`  ❌ Syntax error parsing JSON-LD in ${filename}:`, err.message);
        errors++;
      }
    }
  }

  console.log('\n==================================================');
  if (errors === 0) {
    console.log('🎉 AUDIT PASSED: 0 errors detected. Full GSC readiness confirmed!');
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

