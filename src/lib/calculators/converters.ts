import type { Calculator } from "./types";
import { fmt, n } from "./helpers";

const cat = "Unit Converters";

const uc = (slug: string, name: string, fromLabel: string, toLabel: string, factor: number, priority: Calculator["priority"] = "Medium"): Calculator => ({
  slug, name, category: cat, priority,
  description: `Convert ${fromLabel} to ${toLabel}.`,
  fields: [{ name: "v", label: fromLabel, default: 1 }],
  compute: (vv) => `${fmt(n(vv.v) * factor, 4)} ${toLabel}`,
});

export const converters: Calculator[] = [
  {
    slug: "celsius-fahrenheit", name: "Celsius ↔ Fahrenheit", category: cat, priority: "High",
    description: "Convert temperature both directions.",
    fields: [
      { name: "v", label: "Value", default: 0 },
      { name: "dir", label: "Direction", type: "select", default: "cf",
        options: [{value:"cf",label:"°C → °F"},{value:"fc",label:"°F → °C"}] },
    ],
    compute: (v) => v.dir === "fc"
      ? fmt((n(v.v) - 32) * 5/9, 2) + " °C"
      : fmt(n(v.v) * 9/5 + 32, 2) + " °F",
  },
  uc("meters-feet", "Meters ↔ Feet", "meters", "feet", 3.28084, "High"),
  uc("feet-inches", "Feet → Inches", "feet", "inches", 12),
  uc("meters-inches", "Meters → Inches", "meters", "inches", 39.3701),
  uc("kg-lbs", "Kilograms ↔ Pounds", "kg", "lb", 2.20462, "High"),
  uc("miles-km", "Miles ↔ Kilometers", "miles", "km", 1.60934, "High"),
  {
    slug: "speed-converter", name: "Speed Converter", category: cat, priority: "Medium",
    description: "MPH, KPH, m/s, knots.",
    fields: [
      { name: "v", label: "Value", default: 100 },
      { name: "from", label: "From", type: "select", default: "kph", options: ["mph","kph","ms","knots"].map(x=>({value:x,label:x})) },
      { name: "to", label: "To", type: "select", default: "mph", options: ["mph","kph","ms","knots"].map(x=>({value:x,label:x})) },
    ],
    compute: (v) => {
      const ms: Record<string,number> = { mph: 0.44704, kph: 0.277778, ms: 1, knots: 0.514444 };
      return fmt(n(v.v) * ms[v.from] / ms[v.to], 4) + " " + v.to;
    },
  },
  {
    slug: "area-converter", name: "Area Converter", category: cat, priority: "Medium",
    description: "sq ft, sq m, acres, hectares.",
    fields: [
      { name: "v", label: "Value", default: 1000 },
      { name: "from", label: "From", type: "select", default: "sqft", options: [{value:"sqft",label:"sq ft"},{value:"sqm",label:"sq m"},{value:"ac",label:"acres"},{value:"ha",label:"hectares"}] },
      { name: "to", label: "To", type: "select", default: "sqm", options: [{value:"sqft",label:"sq ft"},{value:"sqm",label:"sq m"},{value:"ac",label:"acres"},{value:"ha",label:"hectares"}] },
    ],
    compute: (v) => {
      const sq: Record<string,number> = { sqft: 0.092903, sqm: 1, ac: 4046.86, ha: 10000 };
      return fmt(n(v.v) * sq[v.from] / sq[v.to], 4) + " " + v.to;
    },
  },
  {
    slug: "volume-converter", name: "Volume Converter", category: cat, priority: "Medium",
    description: "Liters, gallons, ml, cups.",
    fields: [
      { name: "v", label: "Value", default: 1 },
      { name: "from", label: "From", type: "select", default: "l", options: [{value:"l",label:"liters"},{value:"gal",label:"gallons (US)"},{value:"ml",label:"ml"},{value:"cup",label:"cups (US)"}] },
      { name: "to", label: "To", type: "select", default: "gal", options: [{value:"l",label:"liters"},{value:"gal",label:"gallons (US)"},{value:"ml",label:"ml"},{value:"cup",label:"cups (US)"}] },
    ],
    compute: (v) => {
      const L: Record<string,number> = { l: 1, gal: 3.78541, ml: 0.001, cup: 0.24 };
      return fmt(n(v.v) * L[v.from] / L[v.to], 4) + " " + v.to;
    },
  },
  {
    slug: "pressure-converter", name: "Pressure Converter", category: cat, priority: "Low",
    description: "psi, bar, pascal, atm.",
    fields: [
      { name: "v", label: "Value", default: 1 },
      { name: "from", label: "From", type: "select", default: "bar", options: ["psi","bar","pa","atm"].map(x=>({value:x,label:x})) },
      { name: "to", label: "To", type: "select", default: "psi", options: ["psi","bar","pa","atm"].map(x=>({value:x,label:x})) },
    ],
    compute: (v) => {
      const pa: Record<string,number> = { psi: 6894.76, bar: 100000, pa: 1, atm: 101325 };
      return fmt(n(v.v) * pa[v.from] / pa[v.to], 4) + " " + v.to;
    },
  },
  {
    slug: "energy-converter", name: "Energy Converter", category: cat, priority: "Low",
    description: "Joules, calories, kWh, BTU.",
    fields: [
      { name: "v", label: "Value", default: 1000 },
      { name: "from", label: "From", type: "select", default: "j", options: [{value:"j",label:"J"},{value:"cal",label:"cal"},{value:"kwh",label:"kWh"},{value:"btu",label:"BTU"}] },
      { name: "to", label: "To", type: "select", default: "cal", options: [{value:"j",label:"J"},{value:"cal",label:"cal"},{value:"kwh",label:"kWh"},{value:"btu",label:"BTU"}] },
    ],
    compute: (v) => {
      const j: Record<string,number> = { j: 1, cal: 4.184, kwh: 3.6e6, btu: 1055.06 };
      return fmt(n(v.v) * j[v.from] / j[v.to], 6) + " " + v.to;
    },
  },
  {
    slug: "timezone-converter", name: "Time Zone Converter", category: cat, priority: "High",
    description: "Convert a time between IANA time zones.",
    fields: [
      { name: "time", label: "Local time (HH:MM)", type: "text", default: "14:30" },
      { name: "from", label: "From TZ", type: "text", default: "America/New_York" },
      { name: "to", label: "To TZ", type: "text", default: "Europe/London" },
    ],
    compute: (v) => {
      const [h,m] = v.time.split(":").map(Number);
      const now = new Date();
      const dateStr = now.toISOString().slice(0,10);
      // Interpret HH:MM as time in `from` zone; get UTC equivalent
      const guess = new Date(`${dateStr}T${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:00Z`);
      // find offset for from zone at that moment
      const fmtIn = new Intl.DateTimeFormat("en-US", { timeZone: v.from, hour: "numeric", hour12: false, minute: "numeric" });
      const parts = fmtIn.formatToParts(guess);
      const offsetH = h - Number(parts.find(p=>p.type==="hour")?.value ?? 0);
      const offsetM = m - Number(parts.find(p=>p.type==="minute")?.value ?? 0);
      const real = new Date(guess.getTime() + (offsetH * 60 + offsetM) * 60000);
      const out = new Intl.DateTimeFormat("en-US", { timeZone: v.to, hour: "numeric", minute: "2-digit", hour12: false, timeZoneName: "short" }).format(real);
      return `${v.time} ${v.from} → ${out} (${v.to})`;
    },
  },
  {
    slug: "length-converter", name: "Length Converter (all units)", category: cat, priority: "Medium",
    description: "mm, cm, m, km, in, ft, yd, mi.",
    fields: [
      { name: "v", label: "Value", default: 1 },
      { name: "from", label: "From", type: "select", default: "m", options: [{value:"mm",label:"mm"},{value:"cm",label:"cm"},{value:"m",label:"m"},{value:"km",label:"km"},{value:"in",label:"in"},{value:"ft",label:"ft"},{value:"yd",label:"yd"},{value:"mi",label:"mi"}] },
      { name: "to", label: "To", type: "select", default: "ft", options: [{value:"mm",label:"mm"},{value:"cm",label:"cm"},{value:"m",label:"m"},{value:"km",label:"km"},{value:"in",label:"in"},{value:"ft",label:"ft"},{value:"yd",label:"yd"},{value:"mi",label:"mi"}] },
    ],
    compute: (v) => {
      const m: Record<string,number> = { mm:.001, cm:.01, m:1, km:1000, in:.0254, ft:.3048, yd:.9144, mi:1609.34 };
      return fmt(n(v.v) * m[v.from] / m[v.to], 6) + " " + v.to;
    },
  },
  {
    slug: "weight-converter", name: "Weight Converter (all units)", category: cat, priority: "Medium",
    description: "mg, g, kg, oz, lb, ton.",
    fields: [
      { name: "v", label: "Value", default: 1 },
      { name: "from", label: "From", type: "select", default: "kg", options: ["mg","g","kg","oz","lb","ton"].map(x=>({value:x,label:x})) },
      { name: "to", label: "To", type: "select", default: "lb", options: ["mg","g","kg","oz","lb","ton"].map(x=>({value:x,label:x})) },
    ],
    compute: (v) => {
      const kg: Record<string,number> = { mg:1e-6, g:.001, kg:1, oz:.0283495, lb:.453592, ton:1000 };
      return fmt(n(v.v) * kg[v.from] / kg[v.to], 6) + " " + v.to;
    },
  },
  {
    slug: "temperature-converter", name: "Temperature Converter (all scales)", category: cat, priority: "Medium",
    description: "Celsius, Fahrenheit, Kelvin.",
    fields: [
      { name: "v", label: "Value", default: 25 },
      { name: "from", label: "From", type: "select", default: "c", options: [{value:"c",label:"°C"},{value:"f",label:"°F"},{value:"k",label:"K"}] },
      { name: "to", label: "To", type: "select", default: "f", options: [{value:"c",label:"°C"},{value:"f",label:"°F"},{value:"k",label:"K"}] },
    ],
    compute: (v) => {
      const x = n(v.v);
      const toC = v.from === "c" ? x : v.from === "f" ? (x-32)*5/9 : x - 273.15;
      const out = v.to === "c" ? toC : v.to === "f" ? toC*9/5+32 : toC + 273.15;
      return fmt(out, 2) + " " + (v.to === "k" ? "K" : "°" + v.to.toUpperCase());
    },
  },
  {
    slug: "data-converter", name: "Data Storage Converter", category: cat, priority: "Medium",
    description: "B, KB, MB, GB, TB (binary).",
    fields: [
      { name: "v", label: "Value", default: 1 },
      { name: "from", label: "From", type: "select", default: "gb", options: ["b","kb","mb","gb","tb"].map(x=>({value:x,label:x.toUpperCase()})) },
      { name: "to", label: "To", type: "select", default: "mb", options: ["b","kb","mb","gb","tb"].map(x=>({value:x,label:x.toUpperCase()})) },
    ],
    compute: (v) => {
      const b: Record<string,number> = { b:1, kb:1024, mb:1024**2, gb:1024**3, tb:1024**4 };
      return fmt(n(v.v) * b[v.from] / b[v.to], 6) + " " + v.to.toUpperCase();
    },
  },
  {
    slug: "angle-converter", name: "Angle Converter", category: cat, priority: "Low",
    description: "Degrees ↔ radians.",
    fields: [
      { name: "v", label: "Value", default: 180 },
      { name: "dir", label: "Direction", type: "select", default: "dr", options: [{value:"dr",label:"deg → rad"},{value:"rd",label:"rad → deg"}] },
    ],
    compute: (v) => v.dir === "dr" ? fmt(n(v.v) * Math.PI/180, 6) + " rad" : fmt(n(v.v) * 180/Math.PI, 6) + "°",
  },
  {
    slug: "fuel-converter", name: "Fuel Efficiency Converter", category: cat, priority: "Medium",
    description: "MPG ↔ L/100km.",
    fields: [
      { name: "v", label: "Value", default: 30 },
      { name: "dir", label: "Direction", type: "select", default: "ml", options: [{value:"ml",label:"MPG → L/100km"},{value:"lm",label:"L/100km → MPG"}] },
    ],
    compute: (v) => fmt(235.215 / n(v.v), 2) + (v.dir === "ml" ? " L/100km" : " MPG"),
  },
];