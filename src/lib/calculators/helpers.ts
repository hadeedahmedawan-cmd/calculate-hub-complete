export const n = (v: string | undefined, fallback?: number): number => {
  if (v === undefined || v === "") {
    if (fallback !== undefined) return fallback;
    throw new Error("Please fill all fields");
  }
  const x = Number(v);
  if (!isFinite(x)) throw new Error("Enter valid numbers");
  return x;
};

export const fmt = (x: number, d = 2): string => {
  if (!isFinite(x)) return "—";
  return x.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });
};

export const money = (x: number, cur = "USD"): string =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: cur }).format(x);

export const round = (x: number, d = 2): number => {
  const p = Math.pow(10, d);
  return Math.round(x * p) / p;
};

export const daysBetween = (a: Date, b: Date): number =>
  Math.round((b.getTime() - a.getTime()) / 86400000);