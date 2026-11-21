import { collegeName, siteUrl } from "./seoPages.js";

const organizationId = `${siteUrl}/#organization`;
const websiteId = `${siteUrl}/#website`;

/**
 * Creates valid, validated Schema.org JSON-LD structured data for every page.
 * Homepage: Consolidated @graph with WebSite, CollegeOrUniversity, WebPage.
 * Internal pages: WebPage referencing #website and #organization, BreadcrumbList, Course, and visible FAQs.
 */
export function createSeoStructuredData(page) {
  const canonicalUrl = `${siteUrl}${page.path === "/" ? "/" : page.path}`;

  // 1. Homepage Consolidated Graph (Phase 3 Specification)
  if (page.path === "/") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": websiteId,
          url: `${siteUrl}/`,
          name: collegeName,
          alternateName: ["HSCE", "HSCE Delhi", "Haryana Shakti College"],
          publisher: {
            "@id": organizationId,
          },
        },
        {
          "@type": "CollegeOrUniversity",
          "@id": organizationId,
          name: collegeName,
          alternateName: "HSCE",
          url: `${siteUrl}/`,
          description:
            "Haryana Shakti College of Education (HSCE) is a teacher education institution in Kanjhawala, Delhi. Established in 2012 under Haryana Shakti Education Society, it offers a two-year Bachelor of Education (B.Ed.) programme recognised by NCTE and affiliated with Guru Gobind Singh Indraprastha University (GGSIPU).",
          foundingDate: "2012",
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/assets/brand/college-logo.png`,
          },
          image:
            "https://res.cloudinary.com/dljt6vgkk/image/upload/f_auto,q_auto,w_1400/v1792002734/college-campus-hero_y0tjjk.png",
          telephone: ["+91-9953155054", "+91-8056777077"],
          email: "hsce.kanjhawala@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Ghevra Road, Kanjhawala",
            addressLocality: "Kanjhawala",
            addressRegion: "Delhi",
            postalCode: "110081",
            addressCountry: "IN",
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
          sameAs: ["https://www.instagram.com/hscekanjhawala/"],
        },
        {
          "@type": "WebPage",
          "@id": `${siteUrl}/#webpage`,
          url: `${siteUrl}/`,
          name: "Haryana Shakti College of Education | Official Website",
          description:
            "Official site of Haryana Shakti College of Education (HSCE), Kanjhawala, Delhi. Explore the B.Ed. programme, GGSIPU admissions, NCTE recognition, academics and campus.",
          isPartOf: {
            "@id": websiteId,
          },
          about: {
            "@id": organizationId,
          },
          mainEntity: {
            "@id": organizationId,
          },
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: "https://res.cloudinary.com/dljt6vgkk/image/upload/f_auto,q_auto,w_1400/v1792002734/college-campus-hero_y0tjjk.png",
          },
        },
        ...(page.faqs?.length
          ? [
              {
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
              },
            ]
          : []),
      ],
    };
  }

  // 2. Internal Pages Graph (Phase 6 Specification)
  const graph = [
    {
      "@type": "WebPage",
      "@id": `${canonicalUrl}#webpage`,
      url: canonicalUrl,
      name: page.title,
      description: page.description,
      isPartOf: {
        "@type": "WebSite",
        "@id": websiteId,
        name: collegeName,
        url: `${siteUrl}/`,
      },
      about: {
        "@type": "CollegeOrUniversity",
        "@id": organizationId,
        name: collegeName,
        url: `${siteUrl}/`,
      },
      mainEntity: {
        "@id": organizationId,
      },
      ...(page.image && {
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: page.image,
          caption: page.imageAlt || collegeName,
        },
      }),
    },
  ];

  if (page.pageType === "developer") {
    graph[0].mainEntity = {
      "@id": `${canonicalUrl}#ravi-sharma`,
    };
  }

  // Breadcrumbs
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
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${siteUrl}${item.path === "/" ? "/" : item.path}`,
      })),
    });
  }

  // Course Schema (Only on /course)
  if (page.pageType === "developer") {
    const personId = `${canonicalUrl}#ravi-sharma`;
    graph.push({
      "@type": "Person",
      "@id": personId,
      name: "Ravi Sharma",
      jobTitle: "Website & eCommerce Developer",
      description:
        "Independent website developer credited with the Haryana Shakti College of Education website, with work across education, business, and eCommerce projects.",
      telephone: "+91-83928-56993",
      email: "ravisharmabhimtal@gmail.com",
      homeLocation: {
        "@type": "Place",
        name: "Nainital and Bhimtal, Uttarakhand, India",
      },
      knowsAbout: [
        "Website development",
        "eCommerce website development",
        "React web applications",
        "Firebase web applications",
      ],
      sameAs: [
        "https://www.instagram.com/raviiiiii._0/",
        "https://www.linkedin.com/in/ravi-sharma-13031b312",
      ],
      affiliation: {
        "@id": organizationId,
      },
      url: canonicalUrl,
    });
    graph.push({
      "@type": "ProfilePage",
      "@id": `${canonicalUrl}#profile`,
      url: canonicalUrl,
      name: page.title,
      isPartOf: {
        "@id": websiteId,
      },
      mainEntity: {
        "@id": personId,
      },
    });
  }

  // Course Schema (Only on /course)
  if (page.pageType === "course") {
    graph.push({
      "@type": "Course",
      "@id": `${siteUrl}/course#bed-course`,
      name: "Bachelor of Education (B.Ed.)",
      description:
        "Two-year regular Bachelor of Education (B.Ed.) programme recognised by NCTE and affiliated with Guru Gobind Singh Indraprastha University (GGSIPU), Delhi.",
      provider: {
        "@type": "CollegeOrUniversity",
        "@id": organizationId,
        name: collegeName,
        url: `${siteUrl}/`,
      },
      url: `${siteUrl}/course`,
      educationalCredentialAwarded: "Bachelor of Education (B.Ed.)",
      timeRequired: "P2Y",
    });
  }

  // Visible FAQs (Only on pages where FAQs visibly appear)
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
