import { collegeName, siteUrl } from "./seoPages.js";

const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;

export function createSeoStructuredData(page) {
  const canonicalUrl = `${siteUrl}${page.path === "/" ? "/" : page.path}`;
  const graph = [
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: collegeName,
      alternateName: ["HSCE", "HSCE Delhi", "Haryana Shakti College"],
      url: `${siteUrl}/`,
      publisher: {
        "@type": ["CollegeOrUniversity", "EducationalOrganization"],
        "@id": organizationId,
        name: collegeName,
        url: `${siteUrl}/`,
      },
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
      about: {
        "@type": ["CollegeOrUniversity", "EducationalOrganization"],
        "@id": organizationId,
        name: collegeName,
        url: `${siteUrl}/`,
      },
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
      "@type": ["CollegeOrUniversity", "EducationalOrganization"],
      "@id": organizationId,
      name: collegeName,
      alternateName: "HSCE",
      url: `${siteUrl}/`,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/assets/brand/college-logo.png`,
      },
      image: page.image,
      foundingDate: "2012",
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
      affiliation: {
        "@type": "CollegeOrUniversity",
        name: "Guru Gobind Singh Indraprastha University",
        alternateName: "GGSIPU",
        url: "http://www.ipu.ac.in/",
      },
      parentOrganization: {
        "@type": "Organization",
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
        item: `${siteUrl}${item.path === "/" ? "/" : item.path}`,
      })),
    });
  }

  if (page.pageType === "course") {
    graph.push({
      "@type": "Course",
      "@id": `${siteUrl}/course#bed-course`,
      name: "Bachelor of Education (B.Ed.)",
      description: page.description,
      provider: {
        "@type": ["CollegeOrUniversity", "EducationalOrganization"],
        "@id": organizationId,
        name: collegeName,
        url: `${siteUrl}/`,
      },
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
