import { useState } from "react";

// Safe-ish expression evaluator using Function with restricted scope.
function evalExpr(src: string): number {
  const safe = src
    .replace(/π/g, "PI")
    .replace(/(\d)(sin|cos|tan|ln|log|sqrt|exp|abs)/g, "$1*$2")
    .replace(/\^/g, "**")
    .replace(/\bln\(/g, "log(")
    .replace(/\blog\(/g, "log10(");
  const fn = new Function(
    "PI,E,sin,cos,tan,asin,acos,atan,log,log10,sqrt,exp,abs,pow,floor,ceil,round",
    `return (${safe});`,
  );
  const M = Math;
  return fn(M.PI, M.E, M.sin, M.cos, M.tan, M.asin, M.acos, M.atan, M.log, M.log10, M.sqrt, M.exp, M.abs, M.pow, M.floor, M.ceil, M.round);
}

export function ScientificCalc() {
  const [expr, setExpr] = useState("");
  const [out, setOut] = useState<string>("");
  const btn = (v: string) => setExpr((e) => e + v);
  const keys = [
    ["7", "8", "9", "/", "sin("],
    ["4", "5", "6", "*", "cos("],
    ["1", "2", "3", "-", "tan("],
    ["0", ".", "(", ")", "+"],
    ["π", "E", "^", "sqrt(", "log("],
  ];
  const run = () => {
    try { setOut(String(evalExpr(expr))); } catch { setOut("Error"); }
  };
  return (
    <div className="space-y-3">
      <input
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
        placeholder="2*sin(π/4)+sqrt(16)"
        className="w-full rounded-md border border-input bg-background px-3 py-3 font-mono text-lg"
      />
      <div className="rounded-md border border-border bg-secondary/40 px-4 py-3 text-right font-mono text-2xl">
        {out || "0"}
      </div>
      <div className="grid grid-cols-5 gap-2">
        {keys.flat().map((k) => (
          <button
            key={k}
            onClick={() => btn(k)}
            className="rounded-md border border-input bg-card px-2 py-3 text-sm font-medium hover:bg-accent"
          >
            {k}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => setExpr("")} className="flex-1 rounded-md border border-input py-2 text-sm hover:bg-accent">Clear</button>
        <button onClick={run} className="flex-[2] rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Evaluate</button>
      </div>
    </div>
  );
}