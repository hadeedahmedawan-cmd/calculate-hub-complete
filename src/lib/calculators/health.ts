import type { Calculator } from "./types";
import { fmt, n, round } from "./helpers";

const cat = "Health & Fitness";

const activity = [
  { value: "1.2", label: "Sedentary" },
  { value: "1.375", label: "Light (1-3 d/wk)" },
  { value: "1.55", label: "Moderate (3-5 d/wk)" },
  { value: "1.725", label: "Very active (6-7 d/wk)" },
  { value: "1.9", label: "Athlete" },
];
const sexOpt = [{ value: "m", label: "Male" }, { value: "f", label: "Female" }];

export const health: Calculator[] = [
  {
    slug: "bmi", name: "BMI Calculator", category: cat, priority: "High",
    description: "Body Mass Index from height and weight.",
    fields: [
      { name: "unit", label: "Units", type: "select", default: "metric", options: [{value:"metric",label:"Metric (cm, kg)"},{value:"imp",label:"Imperial (in, lb)"}] },
      { name: "h", label: "Height", default: 175 },
      { name: "w", label: "Weight", default: 70 },
    ],
    compute: (v) => {
      let h = n(v.h), w = n(v.w);
      if (v.unit === "imp") { h = h * 0.0254; w = w * 0.453592; } else { h = h / 100; }
      const bmi = w / (h * h);
      const cat2 = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
      return { rows: [["BMI", fmt(bmi, 1)], ["Category", cat2]] };
    },
  },
  {
    slug: "calorie", name: "Calorie Calculator", category: cat, priority: "High",
    description: "Daily calorie needs (Mifflin–St Jeor).",
    fields: [
      { name: "sex", label: "Sex", type: "select", options: sexOpt, default: "m" },
      { name: "age", label: "Age", default: 30 },
      { name: "h", label: "Height", unit: "cm", default: 175 },
      { name: "w", label: "Weight", unit: "kg", default: 70 },
      { name: "act", label: "Activity", type: "select", options: activity, default: "1.55" },
    ],
    compute: (v) => {
      const bmr = 10 * n(v.w) + 6.25 * n(v.h) - 5 * n(v.age) + (v.sex === "m" ? 5 : -161);
      const tdee = bmr * n(v.act);
      return { rows: [
        ["BMR", fmt(bmr, 0) + " kcal"],
        ["Maintenance", fmt(tdee, 0) + " kcal"],
        ["Mild loss (-250)", fmt(tdee - 250, 0)],
        ["Loss (-500)", fmt(tdee - 500, 0)],
        ["Gain (+300)", fmt(tdee + 300, 0)],
      ]};
    },
  },
  {
    slug: "bmr", name: "BMR Calculator", category: cat, priority: "Medium",
    description: "Basal Metabolic Rate.",
    fields: [
      { name: "sex", label: "Sex", type: "select", options: sexOpt, default: "m" },
      { name: "age", label: "Age", default: 30 },
      { name: "h", label: "Height", unit: "cm", default: 175 },
      { name: "w", label: "Weight", unit: "kg", default: 70 },
    ],
    compute: (v) => fmt(10 * n(v.w) + 6.25 * n(v.h) - 5 * n(v.age) + (v.sex === "m" ? 5 : -161), 0) + " kcal/day",
  },
  {
    slug: "body-fat", name: "Body Fat % (US Navy)", category: cat, priority: "Medium",
    description: "Estimate body fat from tape measurements.",
    fields: [
      { name: "sex", label: "Sex", type: "select", options: sexOpt, default: "m" },
      { name: "h", label: "Height", unit: "cm", default: 175 },
      { name: "neck", label: "Neck", unit: "cm", default: 40 },
      { name: "waist", label: "Waist", unit: "cm", default: 85 },
      { name: "hip", label: "Hip (F only)", unit: "cm", default: 95 },
    ],
    compute: (v) => {
      const h = n(v.h);
      let bf;
      if (v.sex === "m") bf = 495 / (1.0324 - 0.19077 * Math.log10(n(v.waist) - n(v.neck)) + 0.15456 * Math.log10(h)) - 450;
      else bf = 495 / (1.29579 - 0.35004 * Math.log10(n(v.waist) + n(v.hip) - n(v.neck)) + 0.221 * Math.log10(h)) - 450;
      return fmt(bf, 1) + "% body fat";
    },
  },
  {
    slug: "ideal-weight", name: "Ideal Weight Calculator", category: cat, priority: "Medium",
    description: "Ideal body weight (Devine formula).",
    fields: [
      { name: "sex", label: "Sex", type: "select", options: sexOpt, default: "m" },
      { name: "h", label: "Height", unit: "cm", default: 175 },
    ],
    compute: (v) => {
      const inches = n(v.h) / 2.54;
      const base = v.sex === "m" ? 50 : 45.5;
      const kg = base + 2.3 * Math.max(0, inches - 60);
      return fmt(kg, 1) + " kg (" + fmt(kg * 2.2046, 1) + " lb)";
    },
  },
  {
    slug: "macros", name: "Macro Calculator", category: cat, priority: "Medium",
    description: "Split calories into protein/carbs/fat.",
    fields: [
      { name: "cal", label: "Daily calories", default: 2200 },
      { name: "goal", label: "Goal", type: "select", default: "bal", options: [
        {value:"bal",label:"Balanced 30/40/30"},
        {value:"lc",label:"Low carb 40/20/40"},
        {value:"hp",label:"High protein 40/35/25"},
      ]},
    ],
    compute: (v) => {
      const splits: Record<string, [number,number,number]> = { bal:[.3,.4,.3], lc:[.4,.2,.4], hp:[.4,.35,.25] };
      const [p,c,f] = splits[v.goal] ?? splits.bal;
      const cal = n(v.cal);
      return { rows: [
        ["Protein", `${fmt(cal*p/4, 0)} g`],
        ["Carbs", `${fmt(cal*c/4, 0)} g`],
        ["Fat", `${fmt(cal*f/9, 0)} g`],
      ]};
    },
  },
  {
    slug: "pregnancy-due-date", name: "Pregnancy Due Date", category: cat, priority: "High",
    description: "Estimated due date from last menstrual period (Naegele).",
    fields: [{ name: "lmp", label: "Last period date", type: "date" }],
    compute: (v) => {
      if (!v.lmp) throw new Error("Please pick a date");
      const d = new Date(v.lmp);
      d.setDate(d.getDate() + 280);
      return "Estimated due date: " + d.toDateString();
    },
  },
  {
    slug: "ovulation", name: "Ovulation Calculator", category: cat, priority: "Medium",
    description: "Estimated ovulation window.",
    fields: [
      { name: "lmp", label: "First day of last period", type: "date" },
      { name: "cyc", label: "Cycle length", unit: "days", default: 28 },
    ],
    compute: (v) => {
      if (!v.lmp) throw new Error("Please pick a date");
      const d = new Date(v.lmp);
      const ov = new Date(d); ov.setDate(d.getDate() + n(v.cyc) - 14);
      const s = new Date(ov); s.setDate(ov.getDate() - 5);
      return { rows: [["Ovulation", ov.toDateString()], ["Fertile window", s.toDateString() + " → " + ov.toDateString()]] };
    },
  },
  {
    slug: "water-intake", name: "Water Intake Calculator", category: cat, priority: "Medium",
    description: "Daily water needs by weight and activity.",
    fields: [
      { name: "w", label: "Weight", unit: "kg", default: 70 },
      { name: "min", label: "Exercise", unit: "min/day", default: 30 },
    ],
    compute: (v) => fmt(n(v.w) * 35 + n(v.min) * 12, 0) + " ml/day",
  },
  {
    slug: "heart-rate-zones", name: "Heart Rate Zones", category: cat, priority: "Low",
    description: "Training zones from max HR (220-age).",
    fields: [{ name: "age", label: "Age", default: 30 }],
    compute: (v) => {
      const max = 220 - n(v.age);
      return { rows: [
        ["Max HR", max + " bpm"],
        ["Z1 50-60%", `${round(max*.5)}–${round(max*.6)}`],
        ["Z2 60-70%", `${round(max*.6)}–${round(max*.7)}`],
        ["Z3 70-80%", `${round(max*.7)}–${round(max*.8)}`],
        ["Z4 80-90%", `${round(max*.8)}–${round(max*.9)}`],
        ["Z5 90-100%", `${round(max*.9)}–${max}`],
      ]};
    },
  },
  {
    slug: "pace", name: "Running Pace Calculator", category: cat, priority: "Low",
    description: "Pace, time, and distance.",
    fields: [
      { name: "dist", label: "Distance", unit: "km", default: 5 },
      { name: "min", label: "Time minutes", default: 25 },
    ],
    compute: (v) => {
      const pace = n(v.min) / n(v.dist);
      const m = Math.floor(pace), s = Math.round((pace - m) * 60);
      return `${m}:${String(s).padStart(2,"0")} min/km — ${fmt(60/pace,1)} km/h`;
    },
  },
  {
    slug: "one-rep-max", name: "One Rep Max", category: cat, priority: "Low",
    description: "Estimated 1RM (Epley).",
    fields: [
      { name: "w", label: "Weight lifted", default: 100 },
      { name: "r", label: "Reps", default: 5 },
    ],
    compute: (v) => fmt(n(v.w) * (1 + n(v.r) / 30), 1) + " (Epley)",
  },
  {
    slug: "whr", name: "Waist-to-Hip Ratio", category: cat, priority: "Low",
    description: "Health indicator based on WHR.",
    fields: [
      { name: "waist", label: "Waist", default: 85 },
      { name: "hip", label: "Hip", default: 95 },
      { name: "sex", label: "Sex", type: "select", options: sexOpt, default: "m" },
    ],
    compute: (v) => {
      const r = n(v.waist) / n(v.hip);
      const risk = v.sex === "m" ? (r < .9 ? "Low" : r < 1 ? "Moderate" : "High") : (r < .8 ? "Low" : r < .85 ? "Moderate" : "High");
      return { rows: [["Ratio", fmt(r,2)], ["Risk", risk]] };
    },
  },
  {
    slug: "steps-to-calories", name: "Steps to Calories", category: cat, priority: "Low",
    description: "Approx calories burned per step count.",
    fields: [
      { name: "steps", label: "Steps", default: 10000 },
      { name: "w", label: "Weight", unit: "kg", default: 70 },
    ],
    compute: (v) => fmt(n(v.steps) * n(v.w) * 0.00057, 0) + " kcal",
  },
  {
    slug: "sleep-cycle", name: "Sleep Cycle Calculator", category: cat, priority: "Medium",
    description: "Ideal wake times using 90-minute cycles.",
    fields: [{ name: "bed", label: "Bedtime (HH:MM)", type: "text", default: "23:00" }],
    compute: (v) => {
      const [h, m] = (v.bed || "").split(":").map(Number);
      if (isNaN(h) || isNaN(m)) throw new Error("Enter HH:MM");
      const base = new Date(); base.setHours(h, m, 0, 0);
      const times = [3, 4, 5, 6].map((c) => {
        const t = new Date(base.getTime() + c * 90 * 60000 + 14 * 60000);
        return [`${c} cycles (${c*1.5}h)`, t.toTimeString().slice(0,5)] as [string,string];
      });
      return { rows: times };
    },
  },
];