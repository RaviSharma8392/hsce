import { collegeName, siteUrl } from "./seoPages.js";

const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;

export function createSeoStructuredData(page) {
  const canonicalUrl = `${siteUrl}${page.path}`;
  const graph = [
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: collegeName,
      alternateName: ["HSCE", "HSCE Delhi", "Haryana Shakti College"],
      url: `${siteUrl}/`,
      publisher: { "@id": organizationId },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: page.title,
      description: page.description,
      isPartOf: { "@id": websiteId },
      about: { "@id": organizationId },
      ...(page.image && {
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: page.image,
          caption: page.imageAlt,
        },
      }),
    },
  ];

  if (page.path === "/") {
    graph.push({
      "@type": "EducationalOrganization",
      "@id": organizationId,
      name: collegeName,
      alternateName: "HSCE",
      url: `${siteUrl}/`,
      logo: `${siteUrl}/assets/brand/college-logo.png`,
      image: page.image,
      description:
        "Haryana Shakti College of Education offers the Bachelor of Education (B.Ed.) programme in Kanjhawala, Delhi.",
      telephone: "+91-9953155054",
      email: "hsce.kanjhawala@gmail.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Ghevra Road, Kanjhawala",
        addressLocality: "North West Delhi",
        addressRegion: "Delhi",
        postalCode: "110081",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "28.7155",
        longitude: "77.0012",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+91-9953155054",
          contactType: "admissions",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
        {
          "@type": "ContactPoint",
          telephone: "+91-8056777077",
          contactType: "office",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
      ],
      parentOrganization: {
        "@type": "EducationalOrganization",
        name: "Haryana Shakti Education Society",
      },
      sameAs: [
        "https://www.instagram.com/hscekanjhawala/",
        "https://haryanashakticollege.com",
      ],
    });
  }

  if (page.breadcrumbs?.length) {
    const items = [
      { name: "Home", path: "/" },
      ...page.breadcrumbs.map((crumb) => ({
        ...crumb,
        path: crumb.path ?? page.path,
      })),
    ];

    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${siteUrl}${item.path}`,
      })),
    });
  }

  if (page.pageType === "course") {
    graph.push({
      "@type": "Course",
      "@id": `${siteUrl}/course#bed-course`,
      name: "Bachelor of Education (B.Ed.)",
      description: page.description,
      provider: { "@id": organizationId },
      url: `${siteUrl}/course`,
      educationalCredentialAwarded: "Bachelor of Education (B.Ed.)",
      timeRequired: "P2Y",
    });
  }

  if (page.faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: page.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
