import type { ReactNode } from "react";

export type FieldType = "number" | "text" | "select" | "date" | "textarea";

export interface Field {
  name: string;
  label: string;
  type?: FieldType;
  options?: { value: string; label: string }[];
  unit?: string;
  placeholder?: string;
  default?: string | number;
  step?: string;
  min?: number;
  max?: number;
  help?: string;
}

export type ComputeResult =
  | string
  | number
  | ReactNode
  | { rows: [string, string | number][]; note?: string };

export interface Calculator {
  slug: string;
  name: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  description: string;
  fields?: Field[];
  compute?: (v: Record<string, string>) => ComputeResult | Promise<ComputeResult>;
  custom?: () => ReactNode;
  cta?: string;
}

export const CATEGORIES = [
  "Financial",
  "Health & Fitness",
  "Unit Converters",
  "Everyday & Utility",
  "Math",
  "Cooking & Kitchen",
  "Home, DIY & Construction",
  "Auto & Travel",
  "Business & Work",
  "Fun & Miscellaneous",
] as const;