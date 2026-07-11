import { useState } from "react";

export function PasswordGenerator() {
  const [len, setLen] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [nums, setNums] = useState(true);
  const [sym, setSym] = useState(true);
  const [pw, setPw] = useState("");
  const gen = () => {
    let pool = "";
    if (upper) pool += "ABCDEFGHJKLMNPQRSTUVWXYZ";
    if (lower) pool += "abcdefghijkmnpqrstuvwxyz";
    if (nums) pool += "23456789";
    if (sym) pool += "!@#$%^&*()_-+=[]{}<>?";
    if (!pool) return setPw("");
    const a = new Uint32Array(len);
    crypto.getRandomValues(a);
    setPw(Array.from(a, (x) => pool[x % pool.length]).join(""));
  };
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-secondary/40 p-4">
        <div className="min-h-[3rem] break-all font-mono text-lg text-foreground">
          {pw || <span className="text-muted-foreground text-sm">Click generate</span>}
        </div>
        {pw && (
          <button
            onClick={() => navigator.clipboard.writeText(pw)}
            className="mt-2 text-xs text-primary hover:underline"
          >
            Copy
          </button>
        )}
      </div>
      <div>
        <label className="text-sm font-medium">Length: {len}</label>
        <input type="range" min={4} max={64} value={len} onChange={(e) => setLen(+e.target.value)} className="w-full" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          ["Uppercase", upper, setUpper],
          ["Lowercase", lower, setLower],
          ["Numbers", nums, setNums],
          ["Symbols", sym, setSym],
        ].map(([l, v, s]) => (
          <label key={l as string} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={v as boolean} onChange={(e) => (s as (b: boolean) => void)(e.target.checked)} />
            {l as string}
          </label>
        ))}
      </div>
      <button onClick={gen} className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Generate
      </button>
    </div>
  );
}