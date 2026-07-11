import { useEffect, useRef, useState } from "react";

function fmt(ms: number) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(h)}:${p(m)}:${p(s)}.${p(cs)}`;
}

export function Stopwatch() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const start = useRef<number>(0);
  const acc = useRef<number>(0);
  useEffect(() => {
    if (!running) return;
    start.current = Date.now();
    const id = setInterval(() => setMs(acc.current + (Date.now() - start.current)), 33);
    return () => clearInterval(id);
  }, [running]);
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-secondary/40 p-8 text-center">
        <div className="font-mono text-5xl font-bold tabular-nums text-foreground">{fmt(ms)}</div>
      </div>
      <div className="flex gap-2">
        <button
          className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => {
            if (running) {
              acc.current = ms;
              setRunning(false);
            } else setRunning(true);
          }}
        >
          {running ? "Pause" : "Start"}
        </button>
        <button
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
          onClick={() => setLaps((l) => [ms, ...l])}
          disabled={!running}
        >
          Lap
        </button>
        <button
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
          onClick={() => {
            setRunning(false);
            setMs(0);
            acc.current = 0;
            setLaps([]);
          }}
        >
          Reset
        </button>
      </div>
      {laps.length > 0 && (
        <ol className="divide-y divide-border rounded-lg border border-border bg-card">
          {laps.map((l, i) => (
            <li key={i} className="flex justify-between px-4 py-2 font-mono text-sm">
              <span className="text-muted-foreground">Lap {laps.length - i}</span>
              <span>{fmt(l)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}