import type { Calculator } from "./types";
import { fmt, money, n, round } from "./helpers";

const cat = "Financial";

function amort(principal: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const nper = years * 12;
  const m = r === 0 ? principal / nper : (principal * r) / (1 - Math.pow(1 + r, -nper));
  return { monthly: m, total: m * nper, interest: m * nper - principal };
}

export const financial: Calculator[] = [
  {
    slug: "mortgage",
    name: "Mortgage Calculator",
    category: cat,
    priority: "High",
    description: "Estimate monthly mortgage payments, total interest and payoff.",
    fields: [
      { name: "price", label: "Home price", unit: "$", default: 400000 },
      { name: "down", label: "Down payment", unit: "$", default: 80000 },
      { name: "rate", label: "Interest rate", unit: "% APR", default: 6.5 },
      { name: "years", label: "Loan term", unit: "years", default: 30 },
    ],
    compute: (v) => {
      const p = n(v.price) - n(v.down);
      const a = amort(p, n(v.rate), n(v.years));
      return {
        rows: [
          ["Loan amount", money(p)],
          ["Monthly payment", money(a.monthly)],
          ["Total interest", money(a.interest)],
          ["Total paid", money(a.total)],
        ],
      };
    },
  },
  {
    slug: "loan",
    name: "Loan Calculator",
    category: cat,
    priority: "High",
    description: "Calculate monthly payment and total cost of any loan.",
    fields: [
      { name: "amt", label: "Loan amount", unit: "$", default: 20000 },
      { name: "rate", label: "Interest rate", unit: "% APR", default: 7 },
      { name: "years", label: "Term", unit: "years", default: 5 },
    ],
    compute: (v) => {
      const a = amort(n(v.amt), n(v.rate), n(v.years));
      return { rows: [
        ["Monthly payment", money(a.monthly)],
        ["Total interest", money(a.interest)],
        ["Total paid", money(a.total)],
      ]};
    },
  },
  {
    slug: "emi",
    name: "EMI Calculator",
    category: cat,
    priority: "High",
    description: "Equated Monthly Installment for personal, home or auto loans.",
    fields: [
      { name: "amt", label: "Principal", unit: "₹/$", default: 500000 },
      { name: "rate", label: "Interest rate", unit: "% p.a.", default: 9 },
      { name: "months", label: "Tenure", unit: "months", default: 60 },
    ],
    compute: (v) => {
      const P = n(v.amt), r = n(v.rate) / 12 / 100, m = n(v.months);
      const emi = r === 0 ? P / m : (P * r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1);
      return { rows: [
        ["EMI", fmt(emi)],
        ["Total interest", fmt(emi * m - P)],
        ["Total payment", fmt(emi * m)],
      ]};
    },
  },
  {
    slug: "compound-interest",
    name: "Compound Interest Calculator",
    category: cat,
    priority: "High",
    description: "See how savings grow with compounding.",
    fields: [
      { name: "p", label: "Principal", unit: "$", default: 10000 },
      { name: "r", label: "Annual rate", unit: "%", default: 6 },
      { name: "y", label: "Years", default: 10 },
      { name: "c", label: "Compounds per year", default: 12 },
      { name: "add", label: "Monthly contribution", unit: "$", default: 0 },
    ],
    compute: (v) => {
      const P = n(v.p), r = n(v.r) / 100, t = n(v.y), c = n(v.c), add = n(v.add);
      const base = P * Math.pow(1 + r / c, c * t);
      const contrib = add * 12 * (Math.pow(1 + r / c, c * t) - 1) / (r || 1e-9);
      const total = base + contrib;
      return { rows: [
        ["Future value", money(total)],
        ["Total contributed", money(P + add * 12 * t)],
        ["Interest earned", money(total - P - add * 12 * t)],
      ]};
    },
  },
  {
    slug: "simple-interest",
    name: "Simple Interest Calculator",
    category: cat,
    priority: "Medium",
    description: "Interest = P × R × T.",
    fields: [
      { name: "p", label: "Principal", unit: "$", default: 1000 },
      { name: "r", label: "Rate", unit: "%/yr", default: 5 },
      { name: "t", label: "Time", unit: "years", default: 3 },
    ],
    compute: (v) => {
      const i = n(v.p) * n(v.r) / 100 * n(v.t);
      return { rows: [["Interest", money(i)], ["Total", money(n(v.p) + i)]] };
    },
  },
  {
    slug: "paycheck",
    name: "Salary / Paycheck Calculator",
    category: cat,
    priority: "High",
    description: "Estimate net pay from gross salary with a simple flat tax.",
    fields: [
      { name: "gross", label: "Annual gross salary", unit: "$", default: 75000 },
      { name: "tax", label: "Effective tax rate", unit: "%", default: 22 },
      { name: "per", label: "Pay periods / year", default: 26 },
    ],
    compute: (v) => {
      const net = n(v.gross) * (1 - n(v.tax) / 100);
      return { rows: [
        ["Net annual", money(net)],
        ["Per paycheck", money(net / n(v.per))],
        ["Tax withheld", money(n(v.gross) - net)],
      ]};
    },
  },
  {
    slug: "take-home-pay",
    name: "Take-Home Pay Calculator",
    category: cat,
    priority: "Medium",
    description: "Estimate take-home after taxes and deductions.",
    fields: [
      { name: "gross", label: "Gross monthly", unit: "$", default: 6000 },
      { name: "tax", label: "Tax %", default: 25 },
      { name: "ret", label: "Retirement %", default: 5 },
      { name: "health", label: "Health premium", unit: "$/mo", default: 200 },
    ],
    compute: (v) => {
      const g = n(v.gross);
      const net = g - g * n(v.tax) / 100 - g * n(v.ret) / 100 - n(v.health);
      return money(net) + " / month";
    },
  },
  {
    slug: "income-tax",
    name: "Income Tax Calculator (US 2024 est.)",
    category: cat,
    priority: "High",
    description: "Approximate federal income tax using single-filer brackets.",
    fields: [
      { name: "income", label: "Taxable income", unit: "$", default: 80000 },
    ],
    compute: (v) => {
      const brackets = [
        [11600, 0.10],[47150, 0.12],[100525, 0.22],[191950, 0.24],
        [243725, 0.32],[609350, 0.35],[Infinity, 0.37],
      ] as const;
      let inc = n(v.income), prev = 0, tax = 0;
      for (const [cap, r] of brackets) {
        if (inc <= 0) break;
        const slice = Math.min(inc, cap - prev);
        tax += slice * r; inc -= slice; prev = cap;
      }
      const total = n(v.income);
      return { rows: [
        ["Federal tax", money(tax)],
        ["Effective rate", fmt(tax / total * 100) + "%"],
        ["After tax", money(total - tax)],
      ], note: "Rough estimate; not tax advice." };
    },
  },
  {
    slug: "sales-tax",
    name: "Sales Tax Calculator",
    category: cat,
    priority: "Medium",
    description: "Add sales tax to a subtotal.",
    fields: [
      { name: "sub", label: "Subtotal", unit: "$", default: 100 },
      { name: "rate", label: "Tax rate", unit: "%", default: 8.25 },
    ],
    compute: (v) => {
      const t = n(v.sub) * n(v.rate) / 100;
      return { rows: [["Tax", money(t)], ["Total", money(n(v.sub) + t)]] };
    },
  },
  {
    slug: "tip",
    name: "Tip Calculator",
    category: cat,
    priority: "High",
    description: "Split a bill and calculate the tip.",
    fields: [
      { name: "bill", label: "Bill", unit: "$", default: 50 },
      { name: "pct", label: "Tip", unit: "%", default: 18 },
      { name: "people", label: "Split between", default: 2 },
    ],
    compute: (v) => {
      const tip = n(v.bill) * n(v.pct) / 100;
      const total = n(v.bill) + tip;
      return { rows: [
        ["Tip", money(tip)],
        ["Total", money(total)],
        ["Per person", money(total / n(v.people))],
      ]};
    },
  },
  {
    slug: "roi",
    name: "ROI Calculator",
    category: cat,
    priority: "Medium",
    description: "Return on investment.",
    fields: [
      { name: "cost", label: "Initial cost", unit: "$", default: 1000 },
      { name: "value", label: "Final value", unit: "$", default: 1500 },
    ],
    compute: (v) => {
      const roi = (n(v.value) - n(v.cost)) / n(v.cost) * 100;
      return fmt(roi) + "%";
    },
  },
  {
    slug: "retirement",
    name: "Retirement Savings Calculator",
    category: cat,
    priority: "Medium",
    description: "Project savings at retirement.",
    fields: [
      { name: "cur", label: "Current savings", unit: "$", default: 20000 },
      { name: "add", label: "Monthly contribution", unit: "$", default: 500 },
      { name: "r", label: "Annual return", unit: "%", default: 7 },
      { name: "y", label: "Years to retirement", default: 30 },
    ],
    compute: (v) => {
      const P = n(v.cur), c = n(v.add), r = n(v.r) / 100 / 12, m = n(v.y) * 12;
      const fv = P * Math.pow(1 + r, m) + c * ((Math.pow(1 + r, m) - 1) / r);
      return money(fv);
    },
  },
  {
    slug: "401k",
    name: "401(k) / Pension Growth",
    category: cat,
    priority: "Medium",
    description: "Project 401(k) balance with employer match.",
    fields: [
      { name: "sal", label: "Annual salary", unit: "$", default: 70000 },
      { name: "cpct", label: "Your contribution", unit: "%", default: 8 },
      { name: "mpct", label: "Employer match", unit: "%", default: 4 },
      { name: "r", label: "Return", unit: "%", default: 7 },
      { name: "y", label: "Years", default: 25 },
    ],
    compute: (v) => {
      const annual = n(v.sal) * (n(v.cpct) + n(v.mpct)) / 100;
      const r = n(v.r) / 100;
      const fv = annual * ((Math.pow(1 + r, n(v.y)) - 1) / r);
      return money(fv);
    },
  },
  {
    slug: "amortization",
    name: "Loan Amortization Schedule",
    category: cat,
    priority: "Medium",
    description: "First-year amortization breakdown.",
    fields: [
      { name: "p", label: "Principal", unit: "$", default: 200000 },
      { name: "r", label: "Rate", unit: "%", default: 6 },
      { name: "y", label: "Years", default: 30 },
    ],
    compute: (v) => {
      const P = n(v.p), r = n(v.r) / 100 / 12, m = n(v.y) * 12;
      const pay = (P * r) / (1 - Math.pow(1 + r, -m));
      let bal = P, totalI = 0;
      for (let i = 0; i < 12; i++) { const interest = bal * r; bal -= pay - interest; totalI += interest; }
      return { rows: [
        ["Monthly payment", money(pay)],
        ["Year 1 interest", money(totalI)],
        ["Year 1 principal", money(pay * 12 - totalI)],
        ["Remaining balance", money(bal)],
      ]};
    },
  },
  {
    slug: "car-loan",
    name: "Car Loan Calculator",
    category: cat,
    priority: "High",
    description: "Estimate monthly auto loan payment.",
    fields: [
      { name: "price", label: "Car price", unit: "$", default: 30000 },
      { name: "down", label: "Down payment", unit: "$", default: 3000 },
      { name: "trade", label: "Trade-in value", unit: "$", default: 0 },
      { name: "rate", label: "APR", unit: "%", default: 7.5 },
      { name: "y", label: "Term", unit: "years", default: 5 },
    ],
    compute: (v) => {
      const p = n(v.price) - n(v.down) - n(v.trade);
      const a = amort(p, n(v.rate), n(v.y));
      return { rows: [["Loan", money(p)], ["Monthly", money(a.monthly)], ["Total interest", money(a.interest)]] };
    },
  },
  {
    slug: "debt-payoff",
    name: "Debt Payoff Calculator",
    category: cat,
    priority: "Medium",
    description: "How long to pay off a debt at a fixed monthly payment.",
    fields: [
      { name: "bal", label: "Balance", unit: "$", default: 5000 },
      { name: "apr", label: "APR", unit: "%", default: 20 },
      { name: "pay", label: "Monthly payment", unit: "$", default: 200 },
    ],
    compute: (v) => {
      const r = n(v.apr) / 100 / 12, B = n(v.bal), P = n(v.pay);
      if (P <= B * r) return "Payment too low to ever pay off.";
      const months = -Math.log(1 - (B * r) / P) / Math.log(1 + r);
      return { rows: [
        ["Months to payoff", round(months, 1).toString()],
        ["Years", round(months / 12, 1).toString()],
        ["Total paid", money(P * months)],
        ["Interest", money(P * months - B)],
      ]};
    },
  },
  {
    slug: "credit-card-interest",
    name: "Credit Card Interest Calculator",
    category: cat,
    priority: "Medium",
    description: "How much interest you'll pay on a card balance.",
    fields: [
      { name: "bal", label: "Balance", unit: "$", default: 3000 },
      { name: "apr", label: "APR", unit: "%", default: 22 },
      { name: "pay", label: "Monthly payment", unit: "$", default: 100 },
    ],
    compute: (v) => {
      const r = n(v.apr) / 100 / 12, B = n(v.bal), P = n(v.pay);
      if (P <= B * r) return "You'll never pay it off at this rate.";
      const months = -Math.log(1 - (B * r) / P) / Math.log(1 + r);
      return { rows: [["Payoff months", round(months).toString()], ["Interest", money(P * months - B)]] };
    },
  },
  {
    slug: "savings-goal",
    name: "Savings Goal Calculator",
    category: cat,
    priority: "Medium",
    description: "Monthly savings needed to hit a goal.",
    fields: [
      { name: "goal", label: "Goal amount", unit: "$", default: 10000 },
      { name: "have", label: "Currently saved", unit: "$", default: 1000 },
      { name: "r", label: "Annual return", unit: "%", default: 4 },
      { name: "months", label: "Timeframe", unit: "months", default: 36 },
    ],
    compute: (v) => {
      const r = n(v.r) / 100 / 12, m = n(v.months);
      const fv = n(v.goal) - n(v.have) * Math.pow(1 + r, m);
      const pay = fv * r / (Math.pow(1 + r, m) - 1);
      return money(pay) + " / month";
    },
  },
  {
    slug: "investment-return",
    name: "Investment Return Calculator",
    category: cat,
    priority: "Medium",
    description: "Annualized return (CAGR).",
    fields: [
      { name: "start", label: "Start value", unit: "$", default: 1000 },
      { name: "end", label: "End value", unit: "$", default: 1500 },
      { name: "y", label: "Years", default: 3 },
    ],
    compute: (v) => fmt((Math.pow(n(v.end) / n(v.start), 1 / n(v.y)) - 1) * 100) + "% CAGR",
  },
  {
    slug: "inflation",
    name: "Inflation Calculator",
    category: cat,
    priority: "Medium",
    description: "Future value of money given inflation.",
    fields: [
      { name: "amt", label: "Amount today", unit: "$", default: 1000 },
      { name: "rate", label: "Inflation rate", unit: "%/yr", default: 3 },
      { name: "y", label: "Years", default: 20 },
    ],
    compute: (v) => {
      const fv = n(v.amt) * Math.pow(1 + n(v.rate) / 100, n(v.y));
      const pv = n(v.amt) / Math.pow(1 + n(v.rate) / 100, n(v.y));
      return { rows: [
        ["Nominal future value", money(fv)],
        ["Purchasing power", money(pv)],
      ]};
    },
  },
  {
    slug: "break-even",
    name: "Break-Even Calculator",
    category: cat,
    priority: "Low",
    description: "Units needed to cover fixed costs.",
    fields: [
      { name: "fixed", label: "Fixed costs", unit: "$", default: 10000 },
      { name: "price", label: "Price per unit", unit: "$", default: 25 },
      { name: "vc", label: "Variable cost per unit", unit: "$", default: 10 },
    ],
    compute: (v) => {
      const u = n(v.fixed) / (n(v.price) - n(v.vc));
      return round(u).toString() + " units";
    },
  },
  {
    slug: "currency-converter",
    name: "Currency Converter (Live)",
    category: cat,
    priority: "High",
    description: "Live exchange rates from open.er-api.com.",
    fields: [
      { name: "amt", label: "Amount", default: 100 },
      { name: "from", label: "From", type: "select", default: "USD",
        options: ["USD","EUR","GBP","JPY","INR","CAD","AUD","CNY","CHF","MXN","BRL","ZAR","SGD","NZD","SEK","NOK","KRW","AED"].map(c=>({value:c,label:c})) },
      { name: "to", label: "To", type: "select", default: "EUR",
        options: ["USD","EUR","GBP","JPY","INR","CAD","AUD","CNY","CHF","MXN","BRL","ZAR","SGD","NZD","SEK","NOK","KRW","AED"].map(c=>({value:c,label:c})) },
    ],
    compute: async (v) => {
      const res = await fetch(`https://open.er-api.com/v6/latest/${v.from || "USD"}`);
      if (!res.ok) throw new Error("Rate service unavailable");
      const data = await res.json();
      const rate = data?.rates?.[v.to];
      if (!rate) throw new Error("Unknown currency");
      const out = n(v.amt) * rate;
      return { rows: [
        [`${v.amt} ${v.from} =`, `${fmt(out, 4)} ${v.to}`],
        ["Rate", `1 ${v.from} = ${fmt(rate, 6)} ${v.to}`],
      ], note: `Updated: ${data.time_last_update_utc || "unknown"}` };
    },
  },
  {
    slug: "discount",
    name: "Discount / Sale Price Calculator",
    category: cat,
    priority: "High",
    description: "Compute the price after a percentage discount.",
    fields: [
      { name: "price", label: "Original price", unit: "$", default: 80 },
      { name: "pct", label: "Discount", unit: "%", default: 25 },
    ],
    compute: (v) => {
      const save = n(v.price) * n(v.pct) / 100;
      return { rows: [["You save", money(save)], ["Sale price", money(n(v.price) - save)]] };
    },
  },
  {
    slug: "vat",
    name: "VAT Calculator",
    category: cat,
    priority: "Medium",
    description: "Add or extract VAT.",
    fields: [
      { name: "amt", label: "Amount", default: 100 },
      { name: "rate", label: "VAT rate", unit: "%", default: 20 },
      { name: "mode", label: "Mode", type: "select", default: "add", options: [{value:"add",label:"Add VAT to net"},{value:"extract",label:"Extract VAT from gross"}] },
    ],
    compute: (v) => {
      const a = n(v.amt), r = n(v.rate) / 100;
      if (v.mode === "extract") {
        const net = a / (1 + r);
        return { rows: [["Net", fmt(net)], ["VAT", fmt(a - net)], ["Gross", fmt(a)]] };
      }
      return { rows: [["Net", fmt(a)], ["VAT", fmt(a * r)], ["Gross", fmt(a * (1 + r))]] };
    },
  },
  {
    slug: "profit-margin",
    name: "Profit Margin Calculator",
    category: cat,
    priority: "Medium",
    description: "Revenue, cost → margin and markup.",
    fields: [
      { name: "rev", label: "Revenue", unit: "$", default: 100 },
      { name: "cost", label: "Cost", unit: "$", default: 60 },
    ],
    compute: (v) => {
      const p = n(v.rev) - n(v.cost);
      return { rows: [
        ["Profit", money(p)],
        ["Margin", fmt(p / n(v.rev) * 100) + "%"],
        ["Markup", fmt(p / n(v.cost) * 100) + "%"],
      ]};
    },
  },
  {
    slug: "rent-affordability",
    name: "Rent Affordability Calculator",
    category: cat,
    priority: "Low",
    description: "Max rent using the 30% rule.",
    fields: [{ name: "inc", label: "Gross monthly income", unit: "$", default: 5000 }],
    compute: (v) => money(n(v.inc) * 0.3) + " / month max",
  },
  {
    slug: "down-payment",
    name: "Down Payment Calculator",
    category: cat,
    priority: "Low",
    description: "Down payment amount from percentage.",
    fields: [
      { name: "price", label: "Home price", unit: "$", default: 400000 },
      { name: "pct", label: "Down %", default: 20 },
    ],
    compute: (v) => money(n(v.price) * n(v.pct) / 100),
  },
];