import { useMemo, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { Calculator, ComputeResult } from "@/lib/calculators/types";
import { AdSlot } from "@/components/AdSlot";
import { ALL_CALCULATORS } from "@/lib/calculators/registry";

function renderResult(r: ComputeResult): ReactNode {
  if (r == null) return null;
  if (typeof r === "string" || typeof r === "number") {
    return <div className="text-2xl font-semibold text-foreground">{r}</div>;
  }
  if (typeof r === "object" && r !== null && "rows" in (r as object)) {
    const obj = r as { rows: [string, string | number][]; note?: string };
    return (
      <div className="space-y-2">
        <dl className="divide-y divide-border rounded-lg border border-border bg-card">
          {obj.rows.map(([k, v], i) => (
            <div key={i} className="flex items-baseline justify-between gap-4 px-4 py-3">
              <dt className="text-sm text-muted-foreground">{k}</dt>
              <dd className="font-semibold text-foreground text-right">{v}</dd>
            </div>
          ))}
        </dl>
        {obj.note && <p className="text-xs text-muted-foreground">{obj.note}</p>}
      </div>
    );
  }
  return r as ReactNode;
}

export function CalculatorPage({ calc }: { calc: Calculator }) {
  const initial = useMemo(() => {
    const o: Record<string, string> = {};
    for (const f of calc.fields ?? []) o[f.name] = f.default != null ? String(f.default) : "";
    return o;
  }, [calc]);
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [result, setResult] = useState<ReactNode>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (!calc.compute) return;
    setError(null);
    setLoading(true);
    try {
      const r = await calc.compute(values);
      setResult(renderResult(r));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span className="mx-2">/</span>
        <span>{calc.category}</span>
      </nav>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{calc.name}</h1>
      <p className="mt-2 text-muted-foreground">{calc.description}</p>

      <AdSlot slot="4444444444" format="horizontal" minHeight={100} label="Sponsored" className="mt-6" />

      {calc.custom ? (
        <div className="mt-8">{calc.custom()}</div>
      ) : (
        <div className="mt-8 space-y-4">
          {(calc.fields ?? []).map((f) => (
            <div key={f.name} className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor={f.name}>
                {f.label}
                {f.unit && <span className="ml-1 text-muted-foreground">({f.unit})</span>}
              </label>
              {f.type === "select" ? (
                <select
                  id={f.name}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select…</option>
                  {(f.options ?? []).map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : f.type === "textarea" ? (
                <textarea
                  id={f.name}
                  value={values[f.name] ?? ""}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                  placeholder={f.placeholder}
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              ) : (
                <input
                  id={f.name}
                  type={f.type ?? "number"}
                  step={f.step ?? "any"}
                  min={f.min}
                  max={f.max}
                  value={values[f.name] ?? ""}
                  placeholder={f.placeholder}
                  onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              )}
              {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
            </div>
          ))}

          <button
            onClick={run}
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Calculating…" : calc.cta ?? "Calculate"}
          </button>

          {error && (
            <div className="mt-4 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {result != null && (
            <div className="mt-6 rounded-xl border border-border bg-secondary/40 p-5">
              <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Result
              </div>
              {result}
            </div>
          )}
        </div>
      )}

      <AdSlot slot="5555555555" format="auto" minHeight={250} label="Sponsored" className="mt-8" />

      <RelatedCalculators calc={calc} />
    </div>
  );
}

function RelatedCalculators({ calc }: { calc: Calculator }) {
  const related = useMemo(
    () =>
      ALL_CALCULATORS.filter((c) => c.category === calc.category && c.slug !== calc.slug).slice(0, 6),
    [calc.slug, calc.category],
  );
  if (!related.length) return null;
  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="text-lg font-semibold text-foreground">More {calc.category} calculators</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {related.map((c) => (
          <li key={c.slug}>
            <Link
              to="/c/$slug"
              params={{ slug: c.slug }}
              className="block rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}