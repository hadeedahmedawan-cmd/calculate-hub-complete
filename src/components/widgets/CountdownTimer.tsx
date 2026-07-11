import { useEffect, useRef, useState } from "react";

export function CountdownTimer() {
  const [h, setH] = useState("0");
  const [m, setM] = useState("5");
  const [s, setS] = useState("0");
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const target = useRef<number>(0);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = target.current - Date.now();
      if (left <= 0) {
        setMs(0);
        setRunning(false);
        try { new Audio("data:audio/wav;base64,UklGRnQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=").play(); } catch {}
        alert("Time's up!");
      } else setMs(left);
    }, 100);
    return () => clearInterval(id);
  }, [running]);
  const start = () => {
    const total = (Number(h) * 3600 + Number(m) * 60 + Number(s)) * 1000;
    if (total <= 0) return;
    target.current = Date.now() + (ms > 0 ? ms : total);
    setRunning(true);
  };
  const disp = ms || (Number(h) * 3600 + Number(m) * 60 + Number(s)) * 1000;
  const dh = Math.floor(disp / 3600000);
  const dm = Math.floor((disp % 3600000) / 60000);
  const ds = Math.floor((disp % 60000) / 1000);
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-secondary/40 p-8 text-center">
        <div className="font-mono text-5xl font-bold tabular-nums text-foreground">
          {p(dh)}:{p(dm)}:{p(ds)}
        </div>
      </div>
      {!running && (
        <div className="grid grid-cols-3 gap-2">
          {[
            ["Hours", h, setH],
            ["Minutes", m, setM],
            ["Seconds", s, setS],
          ].map(([label, val, set]) => (
            <div key={label as string}>
              <label className="text-xs text-muted-foreground">{label as string}</label>
              <input
                type="number"
                min={0}
                value={val as string}
                onChange={(e) => (set as (v: string) => void)(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <button
          className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => (running ? setRunning(false) : start())}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
          onClick={() => { setRunning(false); setMs(0); }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}