import { useEffect, useState } from "react";
export function useCountdown(iso?: string) {
  const [t, setT] = useState<number[]>([0, 0, 0, 0]);
  useEffect(() => {
    if (!iso) return;
    const id = setInterval(() => {
      const d = Math.max(0, new Date(iso).getTime() - Date.now());
      setT([
        Math.floor(d / 864e5),
        Math.floor((d % 864e5) / 36e5),
        Math.floor((d % 36e5) / 6e4),
        Math.floor((d % 6e4) / 1e3),
      ]);
    }, 1000);
    return () => clearInterval(id);
  }, [iso]);
  return t;
}
