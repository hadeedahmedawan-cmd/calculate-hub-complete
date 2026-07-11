import { createFileRoute, notFound } from "@tanstack/react-router";
import { CALC_BY_SLUG } from "@/lib/calculators/registry";
import { CalculatorPage } from "@/components/CalculatorPage";

const SITE = "https://calculatehub.lovable.app";

function padDescription(name: string, category: string, description: string) {
  let d = description.trim();
  if (d.length >= 50) return d.length > 160 ? d.slice(0, 157) + "…" : d;
  const suffix = ` Free ${category.toLowerCase()} calculator on CalcHub — instant results, no signup, runs in your browser.`;
  d = `${d}${suffix}`;
  return d.length > 160 ? d.slice(0, 157) + "…" : d;
}

export const Route = createFileRoute("/c/$slug")({
  head: ({ params }) => {
    const c = CALC_BY_SLUG[params.slug];
    if (!c) return { meta: [{ title: "Calculator not found" }, { name: "robots", content: "noindex" }] };
    const url = `${SITE}/c/${c.slug}`;
    const desc = padDescription(c.name, c.category, c.description);
    return {
      meta: [
        { title: `${c.name} — CalcHub` },
        { name: "description", content: desc },
        { property: "og:title", content: `${c.name} — CalcHub` },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: c.name,
            description: desc,
            url,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any (web)",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        },
      ],
    };
  },
  loader: ({ params }) => {
    if (!CALC_BY_SLUG[params.slug]) throw notFound();
    return { slug: params.slug };
  },
  component: CalcRoute,
  notFoundComponent: NotFoundCalc,
  errorComponent: ({ error, reset }) => (
    <div className="mx-auto max-w-md p-8 text-center">
      <h1 className="text-xl font-semibold">Something broke</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <button onClick={reset} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Try again</button>
    </div>
  ),
});

function CalcRoute() {
  const { slug } = Route.useLoaderData();
  const calc = CALC_BY_SLUG[slug];
  return <CalculatorPage calc={calc} />;
}

function NotFoundCalc() {
  return (
    <div className="mx-auto max-w-md p-8 text-center">
      <h1 className="text-2xl font-semibold">Calculator not found</h1>
      <a href="/" className="mt-4 inline-block text-primary hover:underline">← Back to CalcHub</a>
    </div>
  );
}