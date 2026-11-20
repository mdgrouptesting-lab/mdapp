"use client";

import { useEffect, useState } from "react";

export function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % words.length), 2400);
    return () => clearInterval(t);
  }, [words.length]);
  return (
    <span className="relative inline-grid overflow-hidden align-bottom">
      {words.map((w, idx) => (
        <span
          key={w}
          className="text-gradient col-start-1 row-start-1 transition-all duration-700 ease-out"
          style={{ transform: `translateY(${idx === i ? 0 : idx < i ? -100 : 100}%)`, opacity: idx === i ? 1 : 0 }}
          aria-hidden={idx !== i}
        >
          {w}
        </span>
      ))}
    </span>
  );
}
