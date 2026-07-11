import type { Calculator } from "./types";
import { financial } from "./financial";
import { health } from "./health";
import { converters } from "./converters";
import { everyday } from "./everyday";
import { mathCalcs } from "./math";
import { misc } from "./misc";

export const ALL_CALCULATORS: Calculator[] = [
  ...financial, ...health, ...converters, ...everyday, ...mathCalcs, ...misc,
];

export const CALC_BY_SLUG: Record<string, Calculator> = Object.fromEntries(
  ALL_CALCULATORS.map((c) => [c.slug, c]),
);

export function calcsByCategory(): Record<string, Calculator[]> {
  const out: Record<string, Calculator[]> = {};
  for (const c of ALL_CALCULATORS) (out[c.category] ??= []).push(c);
  return out;
}