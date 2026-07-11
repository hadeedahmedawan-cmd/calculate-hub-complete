import { useState } from "react";

export function QrGenerator() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(300);
  const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text)}&size=${size}x${size}`;
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Text or URL</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Size: {size}px</label>
        <input type="range" min={100} max={600} step={50} value={size} onChange={(e) => setSize(+e.target.value)} className="w-full" />
      </div>
      {text && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-white p-6">
          <img src={url} alt="QR code" width={size} height={size} />
          <a href={url} download="qr.png" className="text-sm text-primary hover:underline">Download PNG</a>
        </div>
      )}
    </div>
  );
}