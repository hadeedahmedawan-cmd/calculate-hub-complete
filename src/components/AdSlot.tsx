import { useEffect, useRef } from "react";

// Google AdSense publisher client ID.
// Set VITE_ADSENSE_CLIENT (e.g. "ca-pub-1234567890123456") in your env
// once your AdSense account is approved. Until then a labeled placeholder
// renders so layout/CLS matches the live ad.
const CLIENT = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type Props = {
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  layout?: "in-article" | "in-feed";
  className?: string;
  /** Reserved height in px to prevent layout shift before the ad loads. */
  minHeight?: number;
  label?: string;
};

export function AdSlot({
  slot,
  format = "auto",
  layout,
  className = "",
  minHeight = 100,
  label = "Advertisement",
}: Props) {
  const ref = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (!CLIENT || !slot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* no-op: AdSense script not ready yet */
    }
  }, [slot]);

  const wrapperClass =
    "my-6 w-full overflow-hidden rounded-lg border border-dashed border-border bg-muted/30 " +
    className;

  if (!CLIENT || !slot) {
    return (
      <aside
        aria-label={label}
        className={wrapperClass}
        style={{ minHeight }}
      >
        <div className="flex h-full min-h-[inherit] items-center justify-center px-4 py-6 text-center text-xs uppercase tracking-widest text-muted-foreground">
          {label} — reserved
        </div>
      </aside>
    );
  }

  return (
    <aside aria-label={label} className={wrapperClass} style={{ minHeight }}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block", minHeight }}
        data-ad-client={CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive="true"
      />
    </aside>
  );
}