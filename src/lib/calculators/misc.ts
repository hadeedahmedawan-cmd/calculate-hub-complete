import type { Calculator } from "./types";
import { fmt, n, round } from "./helpers";

// Cooking & Kitchen
const cook: Calculator[] = [
  {
    slug: "cups-to-grams", name: "Cups → Grams", category: "Cooking & Kitchen", priority: "Medium",
    description: "Convert cups to grams for common ingredients.",
    fields: [
      { name: "c", label: "Cups", default: 1 },
      { name: "ing", label: "Ingredient", type: "select", default: "flour", options: [
        {value:"flour",label:"All-purpose flour"},{value:"sugar",label:"White sugar"},
        {value:"bsugar",label:"Brown sugar"},{value:"butter",label:"Butter"},
        {value:"oats",label:"Oats"},{value:"rice",label:"Rice (raw)"},{value:"milk",label:"Milk"},
      ]},
    ],
    compute: (v) => {
      const g: Record<string,number> = { flour:125, sugar:200, bsugar:220, butter:227, oats:90, rice:200, milk:240 };
      return fmt(n(v.c) * g[v.ing], 0) + " g";
    },
  },
  {
    slug: "recipe-scaler", name: "Recipe Scaler", category: "Cooking & Kitchen", priority: "Medium",
    description: "Scale ingredients up or down.",
    fields: [
      { name: "orig", label: "Original servings", default: 4 },
      { name: "new", label: "New servings", default: 6 },
      { name: "amt", label: "Ingredient amount", default: 200 },
    ],
    compute: (v) => fmt(n(v.amt) * n(v.new) / n(v.orig), 2),
  },
  {
    slug: "oven-temp", name: "Oven Temperature Converter", category: "Cooking & Kitchen", priority: "Medium",
    description: "F ↔ C ↔ Gas mark.",
    fields: [
      { name: "v", label: "Value", default: 350 },
      { name: "from", label: "From", type: "select", default: "f", options: [{value:"f",label:"°F"},{value:"c",label:"°C"},{value:"g",label:"Gas mark"}] },
    ],
    compute: (v) => {
      const gas = [275,300,325,350,375,400,425,450,475];
      const x = n(v.v);
      const f = v.from === "f" ? x : v.from === "c" ? x*9/5+32 : gas[Math.min(8, Math.max(0, Math.round(x)-1))];
      const c = (f - 32) * 5/9;
      const g = gas.findIndex(t => t >= f); const gm = g < 0 ? "9+" : String(g + 1);
      return { rows: [["°F", fmt(f,0)], ["°C", fmt(c,0)], ["Gas mark", gm]] };
    },
  },
  {
    slug: "baking-measure", name: "Baking Measurement Converter", category: "Cooking & Kitchen", priority: "Low",
    description: "Tsp, tbsp, cup, fl oz.",
    fields: [
      { name: "v", label: "Value", default: 1 },
      { name: "from", label: "From", type: "select", default: "cup", options: [{value:"tsp",label:"tsp"},{value:"tbsp",label:"tbsp"},{value:"cup",label:"cup"},{value:"floz",label:"fl oz"}] },
      { name: "to", label: "To", type: "select", default: "tbsp", options: [{value:"tsp",label:"tsp"},{value:"tbsp",label:"tbsp"},{value:"cup",label:"cup"},{value:"floz",label:"fl oz"}] },
    ],
    compute: (v) => {
      const ml: Record<string,number> = { tsp:4.93, tbsp:14.79, cup:236.6, floz:29.57 };
      return fmt(n(v.v) * ml[v.from] / ml[v.to], 4) + " " + v.to;
    },
  },
  {
    slug: "cooking-time", name: "Cooking Time Calculator (Roast)", category: "Cooking & Kitchen", priority: "Low",
    description: "Roasting time by weight (~20 min/lb at 350°F).",
    fields: [
      { name: "lb", label: "Weight (lb)", default: 5 },
      { name: "min", label: "Min/lb", default: 20 },
    ],
    compute: (v) => `${fmt(n(v.lb) * n(v.min), 0)} minutes`,
  },
  {
    slug: "pour-calc", name: "Wine / Liquid Pour Calculator", category: "Cooking & Kitchen", priority: "Low",
    description: "How many servings from a bottle.",
    fields: [
      { name: "ml", label: "Bottle volume (ml)", default: 750 },
      { name: "serve", label: "Serving size (ml)", default: 150 },
    ],
    compute: (v) => `${fmt(n(v.ml)/n(v.serve),1)} servings`,
  },
];

// Home, DIY & Construction
const home: Calculator[] = [
  {
    slug: "paint-coverage", name: "Paint Coverage", category: "Home, DIY & Construction", priority: "Medium",
    description: "Gallons of paint for a room (2 coats).",
    fields: [
      { name: "sqft", label: "Wall area (sq ft)", default: 400 },
      { name: "coats", label: "Coats", default: 2 },
      { name: "cov", label: "Coverage per gallon (sq ft)", default: 350 },
    ],
    compute: (v) => `${fmt(n(v.sqft)*n(v.coats)/n(v.cov),2)} gallons`,
  },
  {
    slug: "tile", name: "Tile Calculator", category: "Home, DIY & Construction", priority: "Medium",
    description: "Tiles needed for an area (+ 10% waste).",
    fields: [
      { name: "sqft", label: "Area (sq ft)", default: 100 },
      { name: "tile", label: "Tile size (sq ft)", default: 1 },
    ],
    compute: (v) => `${Math.ceil(n(v.sqft)/n(v.tile)*1.1)} tiles`,
  },
  {
    slug: "concrete", name: "Concrete Calculator", category: "Home, DIY & Construction", priority: "Low",
    description: "Concrete cubic yards for a slab.",
    fields: [
      { name: "L", label: "Length (ft)", default: 10 },
      { name: "W", label: "Width (ft)", default: 10 },
      { name: "T", label: "Thickness (in)", default: 4 },
    ],
    compute: (v) => `${fmt(n(v.L)*n(v.W)*(n(v.T)/12)/27, 2)} cu yd`,
  },
  {
    slug: "flooring", name: "Flooring Calculator", category: "Home, DIY & Construction", priority: "Low",
    description: "Boxes of flooring for a room.",
    fields: [
      { name: "room", label: "Room area (sq ft)", default: 200 },
      { name: "box", label: "Sq ft per box", default: 22 },
    ],
    compute: (v) => `${Math.ceil(n(v.room)*1.1/n(v.box))} boxes (10% waste)`,
  },
  {
    slug: "wallpaper", name: "Wallpaper Calculator", category: "Home, DIY & Construction", priority: "Low",
    description: "Rolls needed for walls.",
    fields: [
      { name: "perim", label: "Room perimeter (ft)", default: 40 },
      { name: "height", label: "Wall height (ft)", default: 8 },
      { name: "roll", label: "Roll coverage (sq ft)", default: 56 },
    ],
    compute: (v) => `${Math.ceil(n(v.perim)*n(v.height)/n(v.roll)*1.15)} rolls`,
  },
  {
    slug: "square-footage", name: "Square Footage Calculator", category: "Home, DIY & Construction", priority: "Medium",
    description: "L × W square footage.",
    fields: [
      { name: "L", label: "Length (ft)", default: 12 },
      { name: "W", label: "Width (ft)", default: 10 },
    ],
    compute: (v) => `${fmt(n(v.L)*n(v.W),2)} sq ft`,
  },
  {
    slug: "roofing", name: "Roofing Material Calculator", category: "Home, DIY & Construction", priority: "Low",
    description: "Squares of shingles (100 sq ft each).",
    fields: [{ name: "sqft", label: "Roof area (sq ft)", default: 2000 }],
    compute: (v) => `${Math.ceil(n(v.sqft)/100*1.1)} squares`,
  },
  {
    slug: "fence", name: "Fence Calculator", category: "Home, DIY & Construction", priority: "Low",
    description: "Posts and panels for a fence run.",
    fields: [
      { name: "len", label: "Fence length (ft)", default: 100 },
      { name: "sp", label: "Post spacing (ft)", default: 8 },
    ],
    compute: (v) => {
      const posts = Math.ceil(n(v.len)/n(v.sp)) + 1;
      return { rows: [["Posts", posts.toString()], ["Panels", (posts - 1).toString()]] };
    },
  },
  {
    slug: "mulch", name: "Mulch / Soil Volume", category: "Home, DIY & Construction", priority: "Low",
    description: "Cubic yards of mulch or soil.",
    fields: [
      { name: "sqft", label: "Area (sq ft)", default: 200 },
      { name: "d", label: "Depth (in)", default: 3 },
    ],
    compute: (v) => `${fmt(n(v.sqft)*(n(v.d)/12)/27,2)} cu yd`,
  },
];

// Auto & Travel
const auto: Calculator[] = [
  {
    slug: "fuel-cost", name: "Fuel Cost (Trip)", category: "Auto & Travel", priority: "Medium",
    description: "Trip cost from distance, MPG and price/gal.",
    fields: [
      { name: "mi", label: "Distance (mi)", default: 300 },
      { name: "mpg", label: "MPG", default: 28 },
      { name: "p", label: "Price per gallon ($)", default: 3.5 },
    ],
    compute: (v) => `$${fmt(n(v.mi)/n(v.mpg)*n(v.p), 2)}`,
  },
  {
    slug: "gas-mileage", name: "Gas Mileage (MPG)", category: "Auto & Travel", priority: "Medium",
    description: "MPG from miles driven and gallons used.",
    fields: [
      { name: "mi", label: "Miles", default: 300 },
      { name: "gal", label: "Gallons", default: 10 },
    ],
    compute: (v) => `${fmt(n(v.mi)/n(v.gal), 2)} MPG`,
  },
  {
    slug: "car-payoff", name: "Car Loan Payoff", category: "Auto & Travel", priority: "Low",
    description: "Months to pay off a car loan.",
    fields: [
      { name: "bal", label: "Balance ($)", default: 15000 },
      { name: "apr", label: "APR %", default: 6 },
      { name: "pay", label: "Monthly payment ($)", default: 350 },
    ],
    compute: (v) => {
      const r = n(v.apr)/100/12, B = n(v.bal), P = n(v.pay);
      const m = -Math.log(1 - (B*r)/P) / Math.log(1+r);
      return `${round(m,1)} months`;
    },
  },
  {
    slug: "tire-size", name: "Tire Size Calculator", category: "Auto & Travel", priority: "Low",
    description: "Diameter and circumference from tire spec (e.g. 225/45R17).",
    fields: [{ name: "spec", label: "Tire spec", type: "text", default: "225/45R17" }],
    compute: (v) => {
      const m = v.spec.match(/(\d+)\/(\d+)R(\d+)/i);
      if (!m) throw new Error("Format: 225/45R17");
      const w = +m[1], ar = +m[2], rim = +m[3];
      const dia = rim * 25.4 + 2 * w * ar / 100;
      return { rows: [
        ["Diameter", `${fmt(dia,1)} mm (${fmt(dia/25.4,2)} in)`],
        ["Circumference", `${fmt(dia*Math.PI,1)} mm`],
      ]};
    },
  },
  {
    slug: "travel-time", name: "Travel Time Calculator", category: "Auto & Travel", priority: "Low",
    description: "Time = distance / speed.",
    fields: [
      { name: "d", label: "Distance", default: 300 },
      { name: "s", label: "Speed", default: 60 },
    ],
    compute: (v) => {
      const h = n(v.d)/n(v.s);
      return `${Math.floor(h)}h ${Math.round((h%1)*60)}m`;
    },
  },
  {
    slug: "flight-time", name: "Flight Time Calculator", category: "Auto & Travel", priority: "Low",
    description: "Rough flight time at cruise speed.",
    fields: [
      { name: "mi", label: "Distance (mi)", default: 2000 },
      { name: "kts", label: "Cruise speed (knots)", default: 500 },
    ],
    compute: (v) => {
      const mph = n(v.kts) * 1.15078;
      const h = n(v.mi) / mph;
      return `${Math.floor(h)}h ${Math.round((h%1)*60)}m`;
    },
  },
  {
    slug: "jet-lag", name: "Jet Lag Recovery Estimator", category: "Auto & Travel", priority: "Low",
    description: "Rough days to recover (1 day per time zone).",
    fields: [{ name: "tz", label: "Time zones crossed", default: 6 }],
    compute: (v) => `${Math.abs(n(v.tz))} days`,
  },
];

// Business & Work
const biz: Calculator[] = [
  {
    slug: "freelance-rate", name: "Freelance Rate Calculator", category: "Business & Work", priority: "Low",
    description: "Hourly rate to hit an income goal.",
    fields: [
      { name: "goal", label: "Yearly income goal ($)", default: 100000 },
      { name: "wks", label: "Working weeks", default: 46 },
      { name: "hrs", label: "Billable hours/week", default: 25 },
    ],
    compute: (v) => `$${fmt(n(v.goal)/(n(v.wks)*n(v.hrs)), 2)} / hour`,
  },
  {
    slug: "invoice-total", name: "Invoice Total", category: "Business & Work", priority: "Low",
    description: "Subtotal + tax − discount.",
    fields: [
      { name: "sub", label: "Subtotal", default: 1000 },
      { name: "tax", label: "Tax %", default: 8 },
      { name: "disc", label: "Discount %", default: 0 },
    ],
    compute: (v) => {
      const s = n(v.sub) * (1 - n(v.disc)/100);
      return `$${fmt(s * (1 + n(v.tax)/100), 2)}`;
    },
  },
  {
    slug: "markup", name: "Markup Calculator", category: "Business & Work", priority: "Medium",
    description: "Sell price from cost + markup %.",
    fields: [
      { name: "cost", label: "Cost", default: 40 },
      { name: "mk", label: "Markup %", default: 60 },
    ],
    compute: (v) => `$${fmt(n(v.cost)*(1+n(v.mk)/100), 2)}`,
  },
  {
    slug: "break-even-point", name: "Break-Even Point", category: "Business & Work", priority: "Low",
    description: "Sales revenue to cover costs.",
    fields: [
      { name: "fixed", label: "Fixed costs", default: 10000 },
      { name: "margin", label: "Contribution margin %", default: 40 },
    ],
    compute: (v) => `$${fmt(n(v.fixed)/(n(v.margin)/100), 2)}`,
  },
  {
    slug: "overtime", name: "Employee Overtime", category: "Business & Work", priority: "Low",
    description: "Weekly pay with time-and-a-half over 40 hours.",
    fields: [
      { name: "rate", label: "Hourly rate ($)", default: 22 },
      { name: "hrs", label: "Hours worked", default: 48 },
    ],
    compute: (v) => {
      const h = n(v.hrs), r = n(v.rate);
      const reg = Math.min(40, h) * r;
      const ot = Math.max(0, h - 40) * r * 1.5;
      return { rows: [["Regular", `$${fmt(reg,2)}`], ["Overtime", `$${fmt(ot,2)}`], ["Total", `$${fmt(reg+ot,2)}`]] };
    },
  },
  {
    slug: "business-loan", name: "Business Loan Calculator", category: "Business & Work", priority: "Medium",
    description: "Monthly payment for a business loan.",
    fields: [
      { name: "amt", label: "Amount", default: 50000 },
      { name: "apr", label: "APR %", default: 8 },
      { name: "y", label: "Years", default: 5 },
    ],
    compute: (v) => {
      const r = n(v.apr)/100/12, m = n(v.y)*12;
      return `$${fmt((n(v.amt)*r)/(1-Math.pow(1+r,-m)), 2)} / month`;
    },
  },
];

// Fun & Miscellaneous
const fun: Calculator[] = [
  {
    slug: "dog-years", name: "Dog Age → Human Age", category: "Fun & Miscellaneous", priority: "Medium",
    description: "Convert dog years using the modern log formula.",
    fields: [{ name: "y", label: "Dog age (years)", default: 5 }],
    compute: (v) => `${fmt(16 * Math.log(n(v.y)) + 31, 0)} human years`,
  },
  {
    slug: "cat-years", name: "Cat Age → Human Age", category: "Fun & Miscellaneous", priority: "Low",
    description: "Feline age converter.",
    fields: [{ name: "y", label: "Cat age (years)", default: 5 }],
    compute: (v) => {
      const y = n(v.y);
      const h = y <= 1 ? 15 * y : y <= 2 ? 24 : 24 + (y - 2) * 4;
      return `${fmt(h,0)} human years`;
    },
  },
  {
    slug: "shoe-size", name: "Shoe Size Converter", category: "Fun & Miscellaneous", priority: "Medium",
    description: "US / UK / EU conversion (adult).",
    fields: [
      { name: "v", label: "Size", default: 9 },
      { name: "from", label: "From", type: "select", default: "us", options: [{value:"us",label:"US M"},{value:"uk",label:"UK"},{value:"eu",label:"EU"}] },
    ],
    compute: (v) => {
      const x = n(v.v);
      const usm = v.from === "us" ? x : v.from === "uk" ? x + 1 : (x - 33) / 1;
      return { rows: [
        ["US Men", fmt(usm,1)],
        ["UK", fmt(usm - 1, 1)],
        ["EU", fmt(usm + 33, 0)],
      ]};
    },
  },
  {
    slug: "pizza-size", name: "Pizza Size Comparison", category: "Fun & Miscellaneous", priority: "Low",
    description: "Compare area of two round pizzas.",
    fields: [
      { name: "a", label: "Pizza A diameter (in)", default: 12 },
      { name: "b", label: "Pizza B diameter (in)", default: 16 },
    ],
    compute: (v) => {
      const A = Math.PI * (n(v.a)/2)**2, B = Math.PI * (n(v.b)/2)**2;
      return `A: ${fmt(A,0)} in², B: ${fmt(B,0)} in² — B is ${fmt(B/A,2)}× larger`;
    },
  },
  {
    slug: "love-compat", name: "Love / Compatibility (fun)", category: "Fun & Miscellaneous", priority: "Low",
    description: "Just for fun — deterministic score from two names.",
    fields: [
      { name: "a", label: "Name 1", type: "text", default: "Alex" },
      { name: "b", label: "Name 2", type: "text", default: "Sam" },
    ],
    compute: (v) => {
      const s = (v.a + v.b).toLowerCase().replace(/[^a-z]/g,"");
      let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 101;
      return `${h}% ❤`;
    },
  },
  {
    slug: "birthday-countdown", name: "Birthday Countdown", category: "Fun & Miscellaneous", priority: "Low",
    description: "Days until your next birthday.",
    fields: [{ name: "d", label: "Birthday", type: "date" }],
    compute: (v) => {
      if (!v.d) throw new Error("Pick a date");
      const bd = new Date(v.d);
      const t = new Date();
      const next = new Date(t.getFullYear(), bd.getMonth(), bd.getDate());
      if (next < t) next.setFullYear(t.getFullYear() + 1);
      return `${Math.ceil((next.getTime() - t.getTime())/86400000)} days`;
    },
  },
  {
    slug: "zodiac", name: "Zodiac Sign", category: "Fun & Miscellaneous", priority: "Low",
    description: "Western zodiac from date of birth.",
    fields: [{ name: "d", label: "Date of birth", type: "date" }],
    compute: (v) => {
      if (!v.d) throw new Error("Pick a date");
      const d = new Date(v.d), m = d.getMonth()+1, day = d.getDate();
      const signs: [number,number,string][] = [
        [3,21,"Aries"],[4,20,"Taurus"],[5,21,"Gemini"],[6,21,"Cancer"],[7,23,"Leo"],[8,23,"Virgo"],
        [9,23,"Libra"],[10,23,"Scorpio"],[11,22,"Sagittarius"],[12,22,"Capricorn"],[1,20,"Aquarius"],[2,19,"Pisces"],
      ];
      let s = "Capricorn";
      for (const [mm,dd,nm] of signs) if (m > mm || (m === mm && day >= dd)) s = nm;
      return s;
    },
  },
  {
    slug: "numerology", name: "Name Numerology", category: "Fun & Miscellaneous", priority: "Low",
    description: "Pythagorean numerology (fun only).",
    fields: [{ name: "name", label: "Full name", type: "text", default: "Ada Lovelace" }],
    compute: (v) => {
      let sum = 0;
      for (const c of v.name.toUpperCase()) if (c >= "A" && c <= "Z") sum += ((c.charCodeAt(0)-65)%9)+1;
      while (sum > 9 && sum !== 11 && sum !== 22) sum = String(sum).split("").reduce((s,x)=>s+Number(x),0);
      return `Life-path number: ${sum}`;
    },
  },
  {
    slug: "bac", name: "BAC (Blood Alcohol) Estimator", category: "Fun & Miscellaneous", priority: "Low",
    description: "Widmark BAC estimate — informational only.",
    fields: [
      { name: "sex", label: "Sex", type: "select", default: "m", options: [{value:"m",label:"Male"},{value:"f",label:"Female"}] },
      { name: "w", label: "Weight (lb)", default: 175 },
      { name: "drinks", label: "Standard drinks", default: 3 },
      { name: "h", label: "Hours since first drink", default: 2 },
    ],
    compute: (v) => {
      const r = v.sex === "m" ? 0.68 : 0.55;
      const bac = (n(v.drinks) * 5.14 / (n(v.w) * r)) - 0.015 * n(v.h);
      const val = Math.max(0, bac);
      return { rows: [["Est. BAC", fmt(val, 3) + "%"], ["Status", val >= 0.08 ? "Above US legal limit" : "Below US legal limit"]], note: "Estimate only. Never drink and drive." };
    },
  },
];

export const misc: Calculator[] = [...cook, ...home, ...auto, ...biz, ...fun];