import type { Calculator } from "./types";
import { fmt, n } from "./helpers";
import { ScientificCalc } from "@/components/widgets/ScientificCalc";

const cat = "Math";

function gcd(a: number, b: number): number { return b === 0 ? Math.abs(a) : gcd(b, a % b); }

export const mathCalcs: Calculator[] = [
  {
    slug: "fraction", name: "Fraction Calculator", category: cat, priority: "Medium",
    description: "Add / subtract / multiply / divide fractions.",
    fields: [
      { name: "a", label: "Fraction A", type: "text", default: "1/2" },
      { name: "op", label: "Op", type: "select", default: "+", options: ["+","-","*","/"].map(x=>({value:x,label:x})) },
      { name: "b", label: "Fraction B", type: "text", default: "1/3" },
    ],
    compute: (v) => {
      const p = (s: string) => { const [x,y] = s.split("/").map(Number); return [x, y || 1]; };
      const [a,b] = p(v.a), [c,d] = p(v.b);
      let num = 0, den = 1;
      if (v.op === "+") { num = a*d + c*b; den = b*d; }
      if (v.op === "-") { num = a*d - c*b; den = b*d; }
      if (v.op === "*") { num = a*c; den = b*d; }
      if (v.op === "/") { num = a*d; den = b*c; }
      const g = gcd(num, den);
      return `${num/g}/${den/g} (= ${fmt(num/den, 6)})`;
    },
  },
  {
    slug: "ratio", name: "Ratio Calculator", category: cat, priority: "Medium",
    description: "Solve A:B = C:? proportions.",
    fields: [
      { name: "a", label: "A", default: 3 },
      { name: "b", label: "B", default: 4 },
      { name: "c", label: "C", default: 9 },
    ],
    compute: (v) => `? = ${fmt(n(v.b) * n(v.c) / n(v.a), 4)}`,
  },
  {
    slug: "square-root", name: "Square Root", category: cat, priority: "Medium",
    description: "√x.",
    fields: [{ name: "x", label: "x", default: 2 }],
    compute: (v) => fmt(Math.sqrt(n(v.x)), 8),
  },
  {
    slug: "percentage-change", name: "Percentage Change", category: cat, priority: "Medium",
    description: "(new − old) / old.",
    fields: [
      { name: "old", label: "Old", default: 100 },
      { name: "new", label: "New", default: 125 },
    ],
    compute: (v) => fmt((n(v.new) - n(v.old)) / n(v.old) * 100, 4) + "%",
  },
  { slug: "scientific", name: "Scientific Calculator", category: cat, priority: "Medium",
    description: "Full-featured expression calculator.", custom: () => <ScientificCalc /> },
  {
    slug: "average", name: "Average / Mean", category: cat, priority: "Low",
    description: "Arithmetic mean of a list.",
    fields: [{ name: "list", label: "Numbers (comma or space)", type: "text", default: "10, 20, 30, 40" }],
    compute: (v) => {
      const a = v.list.split(/[\s,]+/).filter(Boolean).map(Number);
      return fmt(a.reduce((s,x)=>s+x,0)/a.length, 6);
    },
  },
  {
    slug: "median-mode", name: "Median / Mode", category: cat, priority: "Low",
    description: "Median and mode of a list.",
    fields: [{ name: "list", label: "Numbers", type: "text", default: "1,2,2,3,4" }],
    compute: (v) => {
      const a = v.list.split(/[\s,]+/).filter(Boolean).map(Number).sort((x,y)=>x-y);
      const mid = Math.floor(a.length/2);
      const median = a.length % 2 ? a[mid] : (a[mid-1] + a[mid]) / 2;
      const cnt = new Map<number,number>();
      a.forEach(x => cnt.set(x, (cnt.get(x) ?? 0) + 1));
      const max = Math.max(...cnt.values());
      const mode = [...cnt].filter(([,c])=>c===max).map(([v])=>v).join(", ");
      return { rows: [["Median", median.toString()], ["Mode", mode]] };
    },
  },
  {
    slug: "std-dev", name: "Standard Deviation", category: cat, priority: "Low",
    description: "Sample and population standard deviation.",
    fields: [{ name: "list", label: "Numbers", type: "text", default: "5,7,3,7,10,2" }],
    compute: (v) => {
      const a = v.list.split(/[\s,]+/).filter(Boolean).map(Number);
      const m = a.reduce((s,x)=>s+x,0)/a.length;
      const sq = a.reduce((s,x)=>s+(x-m)**2,0);
      return { rows: [
        ["Mean", fmt(m,4)],
        ["σ (population)", fmt(Math.sqrt(sq/a.length),4)],
        ["s (sample)", fmt(Math.sqrt(sq/(a.length-1)),4)],
      ]};
    },
  },
  {
    slug: "quadratic", name: "Quadratic Equation Solver", category: cat, priority: "Low",
    description: "Solve ax² + bx + c = 0.",
    fields: [
      { name: "a", label: "a", default: 1 },
      { name: "b", label: "b", default: -3 },
      { name: "c", label: "c", default: 2 },
    ],
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c);
      const d = b*b - 4*a*c;
      if (d < 0) return `Complex roots: ${fmt(-b/(2*a),4)} ± ${fmt(Math.sqrt(-d)/(2*a),4)}i`;
      return `x₁ = ${fmt((-b + Math.sqrt(d))/(2*a),4)}, x₂ = ${fmt((-b - Math.sqrt(d))/(2*a),4)}`;
    },
  },
  {
    slug: "prime", name: "Prime Number Checker", category: cat, priority: "Low",
    description: "Is a number prime?",
    fields: [{ name: "x", label: "Number", default: 97 }],
    compute: (v) => {
      const x = Math.floor(n(v.x));
      if (x < 2) return `${x} is not prime`;
      for (let i = 2; i * i <= x; i++) if (x % i === 0) return `${x} is composite (${i} × ${x/i})`;
      return `${x} is prime`;
    },
  },
  {
    slug: "lcm-gcd", name: "LCM / GCD", category: cat, priority: "Low",
    description: "Least common multiple and greatest common divisor.",
    fields: [
      { name: "a", label: "a", default: 12 },
      { name: "b", label: "b", default: 18 },
    ],
    compute: (v) => {
      const a = n(v.a), b = n(v.b), g = gcd(a,b);
      return { rows: [["GCD", g.toString()], ["LCM", (a*b/g).toString()]] };
    },
  },
  {
    slug: "exponent", name: "Exponent Calculator", category: cat, priority: "Low",
    description: "aⁿ.",
    fields: [
      { name: "a", label: "Base", default: 2 },
      { name: "n", label: "Exponent", default: 10 },
    ],
    compute: (v) => fmt(Math.pow(n(v.a), n(v.n)), 6),
  },
  {
    slug: "logarithm", name: "Logarithm Calculator", category: cat, priority: "Low",
    description: "logₐ(x).",
    fields: [
      { name: "b", label: "Base", default: 10 },
      { name: "x", label: "x", default: 1000 },
    ],
    compute: (v) => fmt(Math.log(n(v.x)) / Math.log(n(v.b)), 6),
  },
  {
    slug: "matrix", name: "Matrix Calculator (2×2)", category: cat, priority: "Low",
    description: "Add or multiply two 2×2 matrices.",
    fields: [
      { name: "a", label: "A (a,b;c,d)", type: "text", default: "1,2;3,4" },
      { name: "b", label: "B (a,b;c,d)", type: "text", default: "5,6;7,8" },
      { name: "op", label: "Op", type: "select", default: "mul", options: [{value:"add",label:"A + B"},{value:"mul",label:"A × B"}] },
    ],
    compute: (v) => {
      const p = (s: string) => s.split(";").map(r => r.split(",").map(Number));
      const A = p(v.a), B = p(v.b);
      const R: number[][] = [[0,0],[0,0]];
      if (v.op === "add") for (let i=0;i<2;i++) for (let j=0;j<2;j++) R[i][j] = A[i][j]+B[i][j];
      else for (let i=0;i<2;i++) for (let j=0;j<2;j++) R[i][j] = A[i][0]*B[0][j] + A[i][1]*B[1][j];
      return `[${R[0].join(", ")}; ${R[1].join(", ")}]`;
    },
  },
  {
    slug: "base-converter", name: "Number Base Converter", category: cat, priority: "Low",
    description: "Binary, octal, decimal, hex.",
    fields: [
      { name: "v", label: "Value", type: "text", default: "255" },
      { name: "from", label: "From base", default: 10 },
      { name: "to", label: "To base", default: 16 },
    ],
    compute: (v) => parseInt(v.v, n(v.from)).toString(n(v.to)).toUpperCase(),
  },
];