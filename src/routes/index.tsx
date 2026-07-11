import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ALL_CALCULATORS, calcsByCategory } from "@/lib/calculators/registry";
import { CATEGORIES } from "@/lib/calculators/types";
import { AdSlot } from "@/components/AdSlot";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Are all calculators on CalcHub really free?",
    a: "Yes. Every calculator and converter on CalcHub is 100% free with no signup, no paywall, and no usage limits. You can use them as often as you like on any device.",
  },
  {
    q: "Do I need to create an account to use CalcHub?",
    a: "No account is required. Just open any calculator and start using it. We don't ask for an email address or store personal information.",
  },
  {
    q: "Is my data private? Where are the calculations performed?",
    a: "All calculations run locally in your browser. Your inputs are never sent to a server, stored in a database, or shared with third parties.",
  },
  {
    q: "Can I use CalcHub on mobile phones and tablets?",
    a: "Yes. CalcHub is fully responsive and works on smartphones, tablets, laptops, and desktops. It also works offline once a page has been loaded.",
  },
  {
    q: "Which calculators are the most popular?",
    a: "The most-used tools include the mortgage calculator, loan calculator, BMI calculator, percentage calculator, tip calculator, unit converters, currency-style converters, and the scientific calculator.",
  },
  {
    q: "How accurate are the results?",
    a: "CalcHub uses standard mathematical formulas and IEEE-754 double-precision arithmetic, the same used by most spreadsheets and programming languages. For regulated decisions (tax, medical, legal), always verify with a qualified professional.",
  },
  {
    q: "Can I suggest a new calculator or report an issue?",
    a: "Absolutely. CalcHub is actively maintained and we regularly add new calculators based on user requests. Send suggestions or bug reports through the contact link in the footer.",
  },
  {
    q: "Does CalcHub work offline?",
    a: "Yes. Because every calculation runs client-side, once a calculator page is loaded it will keep working even without an internet connection.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CalcHub — 160+ free calculators and converters" },
      { name: "description", content: "A large, fast collection of free calculators: mortgage, BMI, unit converters, tax, GPA, QR codes, and more. No signup." },
      { property: "og:title", content: "CalcHub — 160+ free calculators" },
      { property: "og:description", content: "Free calculators for finance, health, converters, math, cooking, home projects and more." },
      { property: "og:url", content: "https://calculatehub.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://calculatehub.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [q, setQ] = useState("");
  const grouped = useMemo(() => calcsByCategory(), []);
  const filtered = useMemo(() => {
    if (!q.trim()) return null;
    const s = q.toLowerCase();
    return ALL_CALCULATORS.filter((c) =>
      c.name.toLowerCase().includes(s) || c.description.toLowerCase().includes(s) || c.category.toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" />
            <span>{ALL_CALCULATORS.length}+ calculators, all free, no signup</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            CalcHub — 160+ Free Online Calculators &amp; Converters
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            Every calculator you need — finance, health, converters, math, cooking, DIY.
            Fast, distraction-free, works on any device.
          </p>
          <input
            aria-label="Search calculators"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search calculators…"
            className="mt-6 w-full max-w-xl rounded-lg border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <AdSlot slot="1111111111" format="horizontal" minHeight={100} label="Sponsored" className="mb-8" />
        {filtered ? (
          <section>
            <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {filtered.length} results
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => <CalcCard key={c.slug} calc={c} />)}
            </div>
          </section>
        ) : (
          CATEGORIES.filter((cat) => grouped[cat]?.length).map((cat, idx) => (
            <div key={cat}>
            {idx === 2 && (
              <AdSlot slot="2222222222" format="auto" minHeight={250} label="Sponsored" className="mb-8" />
            )}
            <section className="mb-10">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-xl font-semibold text-foreground">{cat}</h2>
                <span className="text-xs text-muted-foreground">{grouped[cat].length} tools</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {grouped[cat].map((c) => <CalcCard key={c.slug} calc={c} />)}
              </div>
            </section>
            </div>
          ))
        )}
        <AdSlot slot="3333333333" format="auto" minHeight={250} label="Sponsored" className="mt-8" />
      </main>

      <section aria-labelledby="faq-heading" className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
          <h2 id="faq-heading" className="text-2xl font-semibold text-foreground md:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Answers to the most common questions about using CalcHub.
          </p>
          <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-background">
            {FAQS.map((f, i) => (
              <details key={i} className="group px-4 py-4 open:bg-accent/30">
                <summary className="flex cursor-pointer items-start justify-between gap-4 text-base font-medium text-foreground list-none">
                  <span>{f.q}</span>
                  <span
                    aria-hidden
                    className="mt-1 text-lg text-muted-foreground transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        CalcHub — built with TanStack Start. All calculations run in your browser.
      </footer>
    </div>
  );
}

function CalcCard({ calc }: { calc: { slug: string; name: string; description: string; priority: string } }) {
  return (
    <Link
      to="/c/$slug"
      params={{ slug: calc.slug }}
      className="group flex flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary hover:bg-accent"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="font-medium text-foreground group-hover:text-primary">{calc.name}</div>
        {calc.priority === "High" && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium uppercase text-primary">Popular</span>
        )}
      </div>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{calc.description}</p>
    </Link>
  );
}
