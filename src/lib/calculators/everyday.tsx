import type { Calculator } from "./types";
import { fmt, n, daysBetween } from "./helpers";
import { Stopwatch } from "@/components/widgets/Stopwatch";
import { CountdownTimer } from "@/components/widgets/CountdownTimer";
import { PasswordGenerator } from "@/components/widgets/PasswordGenerator";
import { QrGenerator } from "@/components/widgets/QrGenerator";

const cat = "Everyday & Utility";

function toRoman(num: number): string {
  const map: [number, string][] = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
  let r = "";
  for (const [v,s] of map) while (num >= v) { r += s; num -= v; }
  return r;
}
function fromRoman(s: string): number {
  const m: Record<string,number> = { I:1,V:5,X:10,L:50,C:100,D:500,M:1000 };
  let r = 0;
  for (let i = 0; i < s.length; i++) {
    const c = m[s[i].toUpperCase()], nx = m[s[i+1]?.toUpperCase()];
    r += nx > c ? -c : c;
  }
  return r;
}

export const everyday: Calculator[] = [
  {
    slug: "age", name: "Age Calculator", category: cat, priority: "High",
    description: "Exact age in years, months, days.",
    fields: [{ name: "dob", label: "Date of birth", type: "date" }],
    compute: (v) => {
      if (!v.dob) throw new Error("Pick a date");
      const b = new Date(v.dob), t = new Date();
      let y = t.getFullYear() - b.getFullYear();
      let m = t.getMonth() - b.getMonth();
      let d = t.getDate() - b.getDate();
      if (d < 0) { m--; d += new Date(t.getFullYear(), t.getMonth(), 0).getDate(); }
      if (m < 0) { y--; m += 12; }
      return `${y} years, ${m} months, ${d} days (${daysBetween(b,t)} total days)`;
    },
  },
  {
    slug: "percentage", name: "Percentage Calculator", category: cat, priority: "High",
    description: "X% of Y, plus percent change.",
    fields: [
      { name: "mode", label: "Mode", type: "select", default: "of", options: [
        { value: "of", label: "What is X% of Y" },
        { value: "isof", label: "X is what % of Y" },
        { value: "chg", label: "% change X → Y" },
      ]},
      { name: "x", label: "X", default: 20 },
      { name: "y", label: "Y", default: 200 },
    ],
    compute: (v) => {
      const x = n(v.x), y = n(v.y);
      if (v.mode === "isof") return fmt(x / y * 100, 4) + "%";
      if (v.mode === "chg") return fmt((y - x) / x * 100, 4) + "%";
      return fmt(x * y / 100, 4);
    },
  },
  {
    slug: "gpa", name: "GPA Calculator", category: cat, priority: "High",
    description: "Weighted GPA on a 4.0 scale.",
    fields: [{ name: "list", label: "Grades (one per line: A,3)", type: "textarea", default: "A,3\nB+,4\nA-,3\nB,3" }],
    compute: (v) => {
      const scale: Record<string,number> = { "A+":4,"A":4,"A-":3.7,"B+":3.3,"B":3,"B-":2.7,"C+":2.3,"C":2,"C-":1.7,"D+":1.3,"D":1,"F":0 };
      let pts = 0, cr = 0;
      for (const line of v.list.split("\n")) {
        const [g, c] = line.split(",").map(s => s.trim());
        if (!g || !c) continue;
        const p = scale[g.toUpperCase()]; if (p == null) throw new Error("Unknown grade: " + g);
        const credit = Number(c); pts += p * credit; cr += credit;
      }
      return { rows: [["GPA", fmt(pts/cr, 3)], ["Total credits", cr.toString()]] };
    },
  },
  {
    slug: "date-diff", name: "Date Difference", category: cat, priority: "Medium",
    description: "Days between two dates.",
    fields: [
      { name: "a", label: "Start", type: "date" },
      { name: "b", label: "End", type: "date" },
    ],
    compute: (v) => {
      if (!v.a || !v.b) throw new Error("Pick both dates");
      const d = daysBetween(new Date(v.a), new Date(v.b));
      return `${d} days (${fmt(d/7,1)} weeks, ${fmt(d/365.25,2)} years)`;
    },
  },
  {
    slug: "days-until", name: "Days Until Date", category: cat, priority: "Medium",
    description: "Countdown to a future date.",
    fields: [{ name: "d", label: "Date", type: "date" }],
    compute: (v) => {
      if (!v.d) throw new Error("Pick a date");
      const d = daysBetween(new Date(), new Date(v.d));
      return d > 0 ? `${d} days until` : `${-d} days ago`;
    },
  },
  {
    slug: "random-number", name: "Random Number Generator", category: cat, priority: "Medium",
    description: "Cryptographically random integer.",
    fields: [
      { name: "min", label: "Min", default: 1 },
      { name: "max", label: "Max", default: 100 },
      { name: "count", label: "How many", default: 1 },
    ],
    compute: (v) => {
      const lo = Math.ceil(n(v.min)), hi = Math.floor(n(v.max)), c = Math.max(1, Math.min(1000, n(v.count)));
      const a = new Uint32Array(c); crypto.getRandomValues(a);
      return Array.from(a, (x) => lo + (x % (hi - lo + 1))).join(", ");
    },
  },
  { slug: "password", name: "Password Generator", category: cat, priority: "Medium",
    description: "Strong random password.", custom: () => <PasswordGenerator /> },
  { slug: "countdown-timer", name: "Countdown Timer", category: cat, priority: "Medium",
    description: "Timer that alerts when it hits zero.", custom: () => <CountdownTimer /> },
  { slug: "stopwatch", name: "Stopwatch", category: cat, priority: "Low",
    description: "Precision stopwatch with lap times.", custom: () => <Stopwatch /> },
  { slug: "qr-code", name: "QR Code Generator", category: cat, priority: "Medium",
    description: "Instant QR codes for URLs, text or vCards.", custom: () => <QrGenerator /> },
  {
    slug: "word-counter", name: "Word / Character Counter", category: cat, priority: "Medium",
    description: "Count words, characters, sentences.",
    fields: [{ name: "t", label: "Text", type: "textarea", placeholder: "Paste text…" }],
    compute: (v) => {
      const t = v.t || "";
      const words = t.trim() ? t.trim().split(/\s+/).length : 0;
      const sentences = t.split(/[.!?]+/).filter(s=>s.trim()).length;
      return { rows: [
        ["Characters", t.length.toString()],
        ["Characters (no spaces)", t.replace(/\s/g,"").length.toString()],
        ["Words", words.toString()],
        ["Sentences", sentences.toString()],
        ["Reading time", Math.max(1, Math.round(words/200)) + " min"],
      ]};
    },
  },
  {
    slug: "roman-numeral", name: "Roman Numeral Converter", category: cat, priority: "Low",
    description: "Number ↔ Roman numeral.",
    fields: [
      { name: "v", label: "Value", type: "text", default: "1994" },
      { name: "dir", label: "Direction", type: "select", default: "tr", options: [{value:"tr",label:"Number → Roman"},{value:"fr",label:"Roman → Number"}] },
    ],
    compute: (v) => v.dir === "fr" ? String(fromRoman(v.v)) : toRoman(Number(v.v)),
  },
  {
    slug: "weighted-grade", name: "Weighted Grade Calculator", category: cat, priority: "Medium",
    description: "Final grade from weighted assignments.",
    fields: [{ name: "list", label: "Rows (grade,weight per line)", type: "textarea", default: "85,30\n92,30\n78,40" }],
    compute: (v) => {
      let g = 0, w = 0;
      for (const line of v.list.split("\n")) {
        const [gr, wt] = line.split(",").map(s => Number(s.trim()));
        if (isNaN(gr) || isNaN(wt)) continue;
        g += gr * wt; w += wt;
      }
      return fmt(g/w, 2) + "% (weighted)";
    },
  },
  {
    slug: "timecard", name: "Time Card / Hours Worked", category: cat, priority: "Medium",
    description: "Total hours between clock in and out (minus break).",
    fields: [
      { name: "in", label: "Clock in (HH:MM)", type: "text", default: "09:00" },
      { name: "out", label: "Clock out (HH:MM)", type: "text", default: "17:30" },
      { name: "brk", label: "Break (minutes)", default: 30 },
      { name: "rate", label: "Hourly rate ($)", default: 20 },
    ],
    compute: (v) => {
      const [ih,im] = v.in.split(":").map(Number);
      const [oh,om] = v.out.split(":").map(Number);
      const mins = (oh*60+om) - (ih*60+im) - n(v.brk);
      const hrs = mins / 60;
      return { rows: [["Hours worked", fmt(hrs,2)], ["Pay", "$" + fmt(hrs * n(v.rate), 2)]] };
    },
  },
  {
    slug: "meeting-planner", name: "Time Zone Meeting Planner", category: cat, priority: "Low",
    description: "See a meeting time in multiple cities.",
    fields: [
      { name: "time", label: "Time (HH:MM)", type: "text", default: "10:00" },
      { name: "base", label: "Base TZ", type: "text", default: "America/New_York" },
      { name: "list", label: "Other TZs (comma-sep)", type: "text", default: "Europe/London,Asia/Tokyo,Australia/Sydney" },
    ],
    compute: (v) => {
      const [h,m] = v.time.split(":").map(Number);
      const d = new Date(); d.setHours(h, m, 0, 0);
      const opts: Intl.DateTimeFormatOptions = { hour:"2-digit", minute:"2-digit", weekday:"short", timeZoneName:"short" };
      const rows: [string,string][] = [[v.base, new Intl.DateTimeFormat("en-US",{...opts,timeZone:v.base}).format(d)]];
      for (const tz of v.list.split(",").map(s=>s.trim()).filter(Boolean)) {
        rows.push([tz, new Intl.DateTimeFormat("en-US",{...opts,timeZone:tz}).format(d)]);
      }
      return { rows };
    },
  },
];