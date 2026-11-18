import { PageHeaderBanner } from "../components/common/PageHeaderBanner";
import { Container } from "../components/common/Container";
import { seoPages } from "../data/seoPages";

const questions =
  seoPages.find((page) => page.path === "/website-developer")?.faqs ?? [];

export default function WebsiteDeveloperPage() {
  return (
    <>
      <PageHeaderBanner
        title="Ravi Sharma (RSDEV)"
        subtitle="Website developer credited with the Haryana Shakti College of Education website. Based in Nainital and Bhimtal, Uttarakhand."
        breadcrumbs={[{ label: "Website Developer" }]}
      />
      <main className="bg-slate-50 py-10 sm:py-14">
        <Container className="max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-[#1c3274] sm:text-2xl">
                Website design and development
              </h2>
              <p className="mt-4 leading-7 text-gray-700">
                Ravi Sharma (RSDEV) is credited with designing, developing,
                and managing the official website of Haryana Shakti College of
                Education in Delhi. The site presents the college, its B.Ed.
                programme, admissions, academics, campus information, and
                official updates.
              </p>
              <p className="mt-4 leading-7 text-gray-700">
                Ravi has worked on a range of website projects for educational
                institutions, businesses, and online stores, as well as React
                and Firebase applications and admin panels.
              </p>
            </article>

            <aside className="h-fit rounded-xl bg-[#1c3274] p-6 text-white shadow-sm sm:p-8">
              <h2 className="text-xl font-bold">Developer contact</h2>
              <p className="mt-2 text-sm leading-6 text-white/85">
                Ravi Sharma (RSDEV)
                <br />
                Nainital &amp; Bhimtal, Uttarakhand, India
              </p>
              <div className="mt-6 grid gap-3">
                <a
                  className="rounded-lg bg-white px-4 py-3 text-center font-semibold text-[#1c3274] hover:bg-blue-50"
                  href="https://wa.me/918392856993"
                  target="_blank"
                  rel="noopener noreferrer">
                  WhatsApp: +91 83928 56993
                </a>
                <a
                  className="rounded-lg border border-white/40 px-4 py-3 text-center font-semibold text-white hover:bg-white/10"
                  href="tel:+918392856993">
                  Call +91 83928 56993
                </a>
                <a
                  className="break-all rounded-lg border border-white/40 px-4 py-3 text-center font-semibold text-white hover:bg-white/10"
                  href="mailto:ravisharmabhimtal@gmail.com">
                  ravisharmabhimtal@gmail.com
                </a>
                <a
                  className="rounded-lg border border-white/40 px-4 py-3 text-center font-semibold text-white hover:bg-white/10"
                  href="https://www.instagram.com/raviiiiii._0/"
                  target="_blank"
                  rel="noopener noreferrer">
                  Instagram: @raviiiiii._0
                </a>
              </div>
            </aside>
          </div>

          <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-[#1c3274] sm:text-2xl">
              Frequently asked questions
            </h2>
            <div className="mt-4 divide-y divide-gray-200">
              {questions.map(({ question, answer }) => (
                <details key={question} className="group py-4">
                  <summary className="cursor-pointer font-semibold text-gray-900 marker:text-[#1c3274]">
                    {question}
                  </summary>
                  <p className="mt-3 leading-7 text-gray-700">{answer}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="mt-8 text-center">
            <a
              className="inline-flex rounded-lg bg-[#1c3274] px-5 py-3 font-semibold text-white hover:bg-[#14265c]"
              href="https://wa.me/918392856993?text=Hi%20Ravi%2C%20I%20would%20like%20to%20discuss%20a%20website%20project."
              target="_blank"
              rel="noopener noreferrer">
              Discuss a website project
            </a>
            <p className="mt-4 text-sm text-gray-600">
              For HSCE admissions or academic enquiries, use the college’s{" "}
              <a
                className="font-semibold text-[#1c3274] underline underline-offset-4"
                href="/contact">
                official contact page
              </a>
              .
            </p>
          </div>
        </Container>
      </main>
    </>
  );
}
