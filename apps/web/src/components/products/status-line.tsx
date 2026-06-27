"use client";

import { useProductStore } from "@/store/product-store";

/** Header right: "{n} products · {method} · {ms} ms", or "ready" before first run. */
export function StatusLine() {
  const lastRun = useProductStore((s) => s.lastRun);

  return (
    <p className="text-right text-sm text-muted-foreground">
      {lastRun
        ? `${lastRun.n} products · ${lastRun.method} · ${lastRun.ms.toFixed(1)} ms`
        : "ready"}
    </p>
  );
}
